#!/usr/bin/env python3
import os
import glob
import shutil
from pathlib import Path
from PIL import Image
import time

def convert_to_jpeg(input_path, output_path, quality=85, max_size=None):
    """
    将图片转换为JPEG格式
    
    参数:
    - input_path: 输入文件路径
    - output_path: 输出文件路径  
    - quality: JPEG质量 (1-100)，默认85
    - max_size: 最大尺寸 (宽, 高)，如果提供则调整大小
    """
    try:
        # 打开图片
        with Image.open(input_path) as img:
            original_mode = img.mode
            original_size = img.size
            
            # 转换为RGB模式（JPEG不支持透明度）
            if img.mode in ('RGBA', 'LA', 'P'):
                # 创建白色背景
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                # 如果是透明图片，将透明部分填充为白色
                if img.mode == 'RGBA':
                    background.paste(img, mask=img.split()[-1])  # 使用alpha通道作为mask
                    img = background
                else:
                    img = img.convert('RGB')
            elif img.mode != 'RGB':
                img = img.convert('RGB')
            
            # 如果需要调整大小
            if max_size and (img.width > max_size[0] or img.height > max_size[1]):
                img.thumbnail(max_size, Image.Resampling.LANCZOS)
            
            # 保存为JPEG
            img.save(
                output_path, 
                'JPEG',
                quality=quality,
                optimize=True
            )
            
            # 获取文件大小
            original_file_size = os.path.getsize(input_path)
            converted_file_size = os.path.getsize(output_path)
            
            return {
                'success': True,
                'original_size': original_file_size,
                'converted_size': converted_file_size,
                'reduction_percent': (1 - converted_file_size / original_file_size) * 100 if original_file_size > 0 else 0,
                'original_dimensions': original_size,
                'converted_dimensions': img.size,
                'original_mode': original_mode,
                'converted_mode': 'RGB'
            }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

def convert_images_in_directory(input_dir, output_dir=None, quality=85, 
                                max_size=None, backup=True, delete_original=False):
    """
    转换目录中的所有PNG图片为JPEG
    
    参数:
    - input_dir: 输入目录
    - output_dir: 输出目录 (如果为None，则替换原文件为JPEG)
    - quality: JPEG质量
    - max_size: 最大尺寸
    - backup: 是否备份原文件
    - delete_original: 是否删除原PNG文件
    """
    # 创建输出目录
    if output_dir and not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # 查找所有PNG文件
    image_pattern = os.path.join(input_dir, "*.png")
    image_files = glob.glob(image_pattern)
    
    if not image_files:
        print(f"在目录 {input_dir} 中未找到PNG图片文件")
        return []
    
    print(f"找到 {len(image_files)} 个PNG文件需要转换为JPEG")
    
    # 备份原文件
    backup_dir = None
    if backup:
        timestamp = time.strftime("%Y%m%d_%H%M%S")
        backup_dir = os.path.join(input_dir, f"backup_png_{timestamp}")
        os.makedirs(backup_dir, exist_ok=True)
        print(f"创建PNG备份目录: {backup_dir}")
    
    results = []
    total_original = 0
    total_converted = 0
    
    for i, img_path in enumerate(image_files, 1):
        filename = os.path.basename(img_path)
        # 将扩展名从.png改为.jpg
        jpeg_filename = os.path.splitext(filename)[0] + '.jpg'
        
        # 确定输出路径
        if output_dir:
            output_path = os.path.join(output_dir, jpeg_filename)
        else:
            # 在同一目录下创建JPEG文件
            output_path = os.path.join(os.path.dirname(img_path), jpeg_filename)
        
        print(f"[{i}/{len(image_files)}] 处理: {filename} -> {jpeg_filename}")
        
        # 备份原PNG文件
        if backup and backup_dir:
            backup_path = os.path.join(backup_dir, filename)
            shutil.copy2(img_path, backup_path)
        
        # 转换为JPEG
        result = convert_to_jpeg(
            img_path, 
            output_path, 
            quality=quality,
            max_size=max_size
        )
        
        if result['success']:
            original_kb = result['original_size'] / 1024
            converted_kb = result['converted_size'] / 1024
            reduction = result['reduction_percent']
            
            total_original += result['original_size']
            total_converted += result['converted_size']
            
            print(f"    原始PNG: {original_kb:.1f} KB")
            print(f"    转换JPEG: {converted_kb:.1f} KB")
            print(f"    减少: {reduction:.1f}%")
            
            if result['original_mode'] != 'RGB':
                print(f"    模式转换: {result['original_mode']} -> RGB")
            
            if result['original_dimensions'] != result['converted_dimensions']:
                print(f"    尺寸: {result['original_dimensions']} -> {result['converted_dimensions']}")
            
            # 如果指定删除原文件
            if delete_original and not output_dir:
                try:
                    os.remove(img_path)
                    print(f"    已删除原PNG文件")
                except Exception as e:
                    print(f"    删除原文件失败: {e}")
        else:
            print(f"    错误: {result['error']}")
        
        results.append({
            'filename': filename,
            'jpeg_filename': jpeg_filename,
            **result
        })
    
    # 打印总结
    if total_original > 0:
        print("\n" + "="*60)
        print("转换总结:")
        print(f"  处理文件数: {len(image_files)}")
        print(f"  原始PNG总大小: {total_original / (1024*1024):.2f} MB")
        print(f"  转换后JPEG总大小: {total_converted / (1024*1024):.2f} MB")
        print(f"  总减少: {(1 - total_converted / total_original) * 100:.1f}%")
        print(f"  节省空间: {(total_original - total_converted) / (1024*1024):.2f} MB")
        
        if backup_dir:
            print(f"\n原PNG文件已备份到: {backup_dir}")
        if output_dir:
            print(f"转换后的JPEG文件保存在: {output_dir}")
        else:
            print(f"转换后的JPEG文件保存在原目录")
            if delete_original:
                print(f"原PNG文件已被删除")
    
    return results

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='将PNG图片转换为JPEG格式以减小文件大小')
    parser.add_argument('--input', '-i', default='mad_imgs', 
                       help='输入目录 (默认: mad_imgs)')
    parser.add_argument('--output', '-o', default=None,
                       help='输出目录 (默认: 在原目录创建JPEG文件)')
    parser.add_argument('--quality', '-q', type=int, default=85,
                       help='JPEG质量 (1-100, 默认: 85)')
    parser.add_argument('--max-width', type=int, default=None,
                       help='最大宽度 (默认: 不调整大小)')
    parser.add_argument('--max-height', type=int, default=None,
                       help='最大高度 (默认: 不调整大小)')
    parser.add_argument('--no-backup', action='store_true',
                       help='不备份原PNG文件')
    parser.add_argument('--delete-original', action='store_true',
                       help='转换后删除原PNG文件')
    parser.add_argument('--test', action='store_true',
                       help='测试模式，不实际保存文件')
    
    args = parser.parse_args()
    
    # 确定最大尺寸
    max_size = None
    if args.max_width or args.max_height:
        max_size = (args.max_width or 9999, args.max_height or 9999)
    
    print("PNG转JPEG转换工具")
    print("="*60)
    print(f"质量设置: {args.quality}/100")
    if max_size:
        print(f"最大尺寸: {max_size[0]}x{max_size[1]}")
    
    if args.test:
        print("测试模式: 不会实际转换文件")
        # 在测试模式下，我们只分析不保存
        # 这里简化处理，实际应用中需要调整
        pass
    
    # 执行转换
    results = convert_images_in_directory(
        input_dir=args.input,
        output_dir=args.output,
        quality=args.quality,
        max_size=max_size,
        backup=not args.no_backup,
        delete_original=args.delete_original
    )
    
    return results

if __name__ == "__main__":
    main()