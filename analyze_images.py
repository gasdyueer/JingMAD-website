#!/usr/bin/env python3
import os
import glob
from pathlib import Path

def analyze_images():
    image_dir = "mad_imgs"
    image_pattern = os.path.join(image_dir, "*.png")
    image_files = glob.glob(image_pattern)
    
    if not image_files:
        print("未找到PNG图片文件")
        return
    
    total_size = 0
    sizes = []
    
    print(f"找到 {len(image_files)} 个PNG文件:")
    print("-" * 80)
    
    for img_path in image_files:
        size = os.path.getsize(img_path)
        total_size += size
        sizes.append(size)
        size_kb = size / 1024
        size_mb = size / (1024 * 1024)
        filename = os.path.basename(img_path)
        print(f"{filename[:40]:40} {size_kb:8.1f} KB ({size_mb:.2f} MB)")
    
    print("-" * 80)
    avg_size_kb = total_size / len(image_files) / 1024
    total_size_mb = total_size / (1024 * 1024)
    
    print(f"\n统计信息:")
    print(f"  文件总数: {len(image_files)}")
    print(f"  总大小: {total_size_mb:.2f} MB")
    print(f"  平均大小: {avg_size_kb:.1f} KB")
    print(f"  最大文件: {max(sizes) / 1024:.1f} KB")
    print(f"  最小文件: {min(sizes) / 1024:.1f} KB")
    
    # 分析文件大小分布
    print(f"\n文件大小分布:")
    thresholds = [100, 500, 1000, 2000, 5000]  # KB
    for i, threshold in enumerate(thresholds):
        if i == 0:
            count = sum(1 for s in sizes if s / 1024 < threshold)
            print(f"  < {threshold} KB: {count} 个文件")
        else:
            prev = thresholds[i-1]
            count = sum(1 for s in sizes if prev <= s / 1024 < threshold)
            print(f"  {prev}-{threshold} KB: {count} 个文件")
    
    count_large = sum(1 for s in sizes if s / 1024 >= thresholds[-1])
    print(f"  >= {thresholds[-1]} KB: {count_large} 个文件")
    
    return total_size_mb, len(image_files)

if __name__ == "__main__":
    analyze_images()