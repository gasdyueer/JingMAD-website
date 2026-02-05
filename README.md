<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 静止画MAD展览网站 (JingMAD-website)

一个展示静止画MAD作品的交互式画廊网站，具有现代化的视觉效果和流畅的动画。

## ✨ 特性

- **交互式画廊**：100个静止画MAD作品的精美展示
- **流畅动画**：使用GSAP和ScrollTrigger实现的视差滚动效果
- **响应式设计**：适配桌面和移动设备
- **搜索功能**：按标题或作者快速查找作品
- **时间轴导航**：快速跳转到特定排名作品
- **现代化UI**：赛博朋克风格的设计，带有故障文本效果

## 🚀 快速开始

### 前提条件
- Node.js 18.0.0 或更高版本
- npm 9.0.0 或更高版本

### 安装

```bash
# 克隆仓库
git clone https://github.com/gasdyueer/JingMAD-website.git
cd JingMAD-website

# 安装依赖
npm install
```

### 开发

```bash
# 启动开发服务器
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 📁 项目结构

```
JingMAD-website/
├── index.html          # 主HTML文件
├── index.tsx           # 主TypeScript逻辑
├── database.ts         # MAD数据定义
├── mad_list.md         # MAD列表数据
├── vite.config.ts      # Vite配置
├── tsconfig.json       # TypeScript配置
├── package.json        # 项目依赖和脚本
├── README.md           # 项目文档
└── mad_imgs/           # MAD封面图片
```

## 🛠️ 技术栈

- **前端框架**: Vite + TypeScript
- **动画库**: GSAP + ScrollTrigger
- **平滑滚动**: Lenis
- **样式**: 纯CSS + CSS变量
- **字体**: Google Fonts (JetBrains Mono, Rajdhani)
- **构建工具**: Vite

## 📝 数据管理

MAD数据存储在 `database.ts` 和 `mad_list.md` 中。要添加新的MAD作品：

1. 在 `mad_list.md` 中添加条目
2. 将封面图片放入 `mad_imgs/` 目录
3. 更新 `database.ts` 中的 `MAD_LIST` 数组

## 🌐 部署

### GitHub Pages

1. 构建项目：`npm run build`
2. 将 `dist` 目录推送到 `gh-pages` 分支
3. 在GitHub仓库设置中启用GitHub Pages

### 其他平台

项目生成静态文件，可部署到任何静态托管服务：
- Vercel
- Netlify
- Cloudflare Pages
- AWS S3

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🤝 贡献

欢迎提交Issue和Pull Request！

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开Pull Request

## 📧 联系

项目维护者：Social Death

- GitHub: [@yourusername](https://github.com/yourusername)
- 项目链接: [https://github.com/yourusername/JingMAD-website](https://github.com/yourusername/JingMAD-website)
