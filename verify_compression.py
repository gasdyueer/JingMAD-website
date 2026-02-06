#!/usr/bin/env python3
import os
import glob

def verify_compression():
    # 检查JPEG文件
    jpeg_dir = "mad_imgs"
    jpeg_pattern = os.path.join(jpeg_dir, "*.jpg")
    jpeg_files = glob.glob(jpeg_pattern)
    
    # 检查PNG文件（应该只有备份目录中有）
    png_pattern = os.path.join(jpeg_dir, "*.png")
    png_files = glob.glob(png_pattern)
    
    print("压缩验证报告")
    print("="*60)
    
    # JPEG文件统计
    if jpeg_files:
        total_jpeg_size = sum(os.path.getsize(f) for f in jpeg_files)
        avg_jpeg_size = total_jpeg_size / len(jpeg_files) / 1024
        
        print(f"JPEG文件:")
        print(f"  数量: {len(jpeg_files)}")
        print(f"  总大小: {total_jpeg_size / (1024*1024):.2f} MB")
        print(f"  平均大小: {avg_jpeg_size:.1f} KB")
        
        # 显示前10个文件的大小
        print(f"\n前10个JPEG文件大小:")
        for i, f in enumerate(jpeg_files[:10], 1):
            size_kb = os.path.getsize(f) / 1024
            filename = os.path.basename(f)
            print(f"  {i:2}. {filename[:30]:30} {size_kb:7.1f} KB")
    else:
        print("未找到JPEG文件")
    
    # PNG文件统计
    if png_files:
        total_png_size = sum(os.path.getsize(f) for f in png_files)
        print(f"\nPNG文件 (应该只有备份目录中的):")
        print(f"  数量: {len(png_files)}")
        print(f"  总大小: {total_png_size / (1024*1024):.2f} MB")
        
        # 检查是否有非备份的PNG文件
        non_backup_png = [f for f in png_files if "backup" not in f]
        if non_backup_png:
            print(f"  警告: 发现 {len(non_backup_png)} 个非备份PNG文件")
            for f in non_backup_png[:5]:
                print(f"    - {os.path.basename(f)}")
        else:
            print("  所有PNG文件都在备份目录中 - 良好")
    else:
        print(f"\n未找到PNG文件 (可能已全部删除)")
    
    # 检查备份目录
    backup_dirs = [d for d in os.listdir(jpeg_dir) 
                  if os.path.isdir(os.path.join(jpeg_dir, d)) and "backup" in d]
    
    if backup_dirs:
        print(f"\n备份目录:")
        for backup_dir in backup_dirs:
            backup_path = os.path.join(jpeg_dir, backup_dir)
            backup_files = glob.glob(os.path.join(backup_path, "*.png"))
            if backup_files:
                total_backup_size = sum(os.path.getsize(f) for f in backup_files)
                print(f"  {backup_dir}: {len(backup_files)} 个文件, {total_backup_size/(1024*1024):.2f} MB")
    
    # 原始分析数据（从之前的结果）
    original_total_mb = 74.06
    converted_total_mb = 9.09
    
    print(f"\n压缩效果总结:")
    print(f"  原始PNG总大小: {original_total_mb:.2f} MB")
    print(f"  转换后JPEG总大小: {converted_total_mb:.2f} MB")
    print(f"  节省空间: {original_total_mb - converted_total_mb:.2f} MB")
    print(f"  压缩率: {(1 - converted_total_mb / original_total_mb) * 100:.1f}%")
    
    # 验证当前JPEG总大小是否与预期相符
    if jpeg_files:
        current_total_mb = total_jpeg_size / (1024*1024)
        print(f"\n当前实际JPEG总大小: {current_total_mb:.2f} MB")
        if abs(current_total_mb - converted_total_mb) < 0.5:
            print("  ✓ 与预期大小相符")
        else:
            print(f"  ⚠ 与预期大小有差异: 相差 {abs(current_total_mb - converted_total_mb):.2f} MB")

if __name__ == "__main__":
    verify_compression()