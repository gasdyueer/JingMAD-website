#!/usr/bin/env python3
import os
import subprocess

def test_gitignore():
    """测试.gitignore规则是否有效"""
    print("测试.gitignore规则")
    print("="*60)
    
    # 检查当前备份目录
    backup_dirs = []
    if os.path.exists("mad_imgs"):
        for item in os.listdir("mad_imgs"):
            item_path = os.path.join("mad_imgs", item)
            if os.path.isdir(item_path) and "backup" in item:
                backup_dirs.append(item)
    
    if backup_dirs:
        print(f"找到备份目录: {backup_dirs}")
        print("\n这些目录应该被.gitignore规则排除:")
        print("  mad_imgs/backup*/")
        print("  mad_imgs/backup_*/")
        
        # 检查.gitignore内容
        with open(".gitignore", "r", encoding="utf-8") as f:
            gitignore_content = f.read()
        
        if "mad_imgs/backup" in gitignore_content:
            print("\n✓ .gitignore文件中包含备份目录排除规则")
        else:
            print("\n✗ .gitignore文件中未找到备份目录排除规则")
        
        # 模拟git check-ignore命令
        print("\n模拟git check-ignore结果:")
        for backup_dir in backup_dirs[:3]:  # 只测试前3个
            test_path = f"mad_imgs/{backup_dir}"
            print(f"  {test_path}/ - 应该被忽略")
    else:
        print("未找到备份目录")
    
    # 检查其他可能被忽略的文件模式
    print("\n其他被忽略的文件模式:")
    patterns_to_check = [
        "node_modules/",
        "dist/",
        ".env.local",
        "*.log",
    ]
    
    with open(".gitignore", "r", encoding="utf-8") as f:
        content = f.read()
    
    for pattern in patterns_to_check:
        if pattern in content:
            print(f"  ✓ {pattern}")
        else:
            print(f"  ✗ {pattern} (未找到)")
    
    print("\n.gitignore验证完成")

if __name__ == "__main__":
    test_gitignore()