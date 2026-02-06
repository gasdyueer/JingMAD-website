import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, '..', 'mad_imgs');
const targetDir = path.join(__dirname, '..', 'dist', 'mad_imgs');

function copyImages() {
  try {
    console.log('开始复制图片文件...');
    console.log('源目录:', sourceDir);
    console.log('目标目录:', targetDir);

    // 确保源目录存在
    if (!fs.existsSync(sourceDir)) {
      console.log('源图片目录不存在:', sourceDir);
      console.log('请确保mad_imgs目录存在并包含图片文件');
      return;
    }

    // 创建目标目录
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
      console.log('创建目标目录:', targetDir);
    }

    // 复制所有文件
    const files = fs.readdirSync(sourceDir);
    let copiedCount = 0;
    
    if (files.length === 0) {
      console.log('警告: 源目录中没有找到任何图片文件');
    }
    
    files.forEach(file => {
      const sourceFile = path.join(sourceDir, file);
      const targetFile = path.join(targetDir, file);
      
      // 只复制文件（跳过目录）
      if (fs.statSync(sourceFile).isFile()) {
        // 检查文件扩展名，只复制图片文件
        const ext = path.extname(file).toLowerCase();
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
        
        if (imageExtensions.includes(ext)) {
          fs.copyFileSync(sourceFile, targetFile);
          copiedCount++;
          console.log(`  复制: ${file}`);
        } else {
          console.log(`  跳过非图片文件: ${file}`);
        }
      }
    });

    console.log(`\n成功复制 ${copiedCount} 个图片文件到 ${targetDir}`);
    
    // 列出复制的文件
    if (copiedCount > 0) {
      console.log('\n复制的文件列表:');
      const copiedFiles = fs.readdirSync(targetDir);
      copiedFiles.forEach(file => {
        console.log(`  - ${file}`);
      });
    }
    
  } catch (error) {
    console.error('复制图片时出错:', error);
    process.exit(1);
  }
}

copyImages();