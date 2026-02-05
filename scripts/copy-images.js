import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, '..', 'mad_imgs');
const targetDir = path.join(__dirname, '..', 'dist', 'mad_imgs');

function copyImages() {
  try {
    // 确保源目录存在
    if (!fs.existsSync(sourceDir)) {
      console.log('源图片目录不存在:', sourceDir);
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
    
    files.forEach(file => {
      const sourceFile = path.join(sourceDir, file);
      const targetFile = path.join(targetDir, file);
      
      // 只复制文件（跳过目录）
      if (fs.statSync(sourceFile).isFile()) {
        fs.copyFileSync(sourceFile, targetFile);
        copiedCount++;
      }
    });

    console.log(`成功复制 ${copiedCount} 个图片文件到 ${targetDir}`);
  } catch (error) {
    console.error('复制图片时出错:', error);
    process.exit(1);
  }
}

copyImages();