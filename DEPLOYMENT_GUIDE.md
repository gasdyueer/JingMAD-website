# GitHub Pages 部署指南

## 问题分析

之前的部署失败是因为 GitHub Pages 没有正确启用，并且 GitHub Actions 工作流配置存在问题。本指南提供通过 `gh-pages` 分支的直接部署方案。

## 解决方案：使用 gh-pages 分支部署

### 步骤 1：安装依赖并构建

```bash
# 安装所有依赖（包括 gh-pages）
npm install

# 构建项目
npm run build
```

### 步骤 2：首次部署到 gh-pages 分支

```bash
# 使用 gh-pages 工具部署
npm run deploy:gh
```

这个命令会：
1. 自动构建项目（通过 predeploy 脚本）
2. 将 `dist` 目录推送到远程仓库的 `gh-pages` 分支
3. 创建或更新 gh-pages 分支

### 步骤 3：配置 GitHub Pages 发布源

1. 打开 GitHub 仓库页面：https://github.com/gasdyueer/JingMAD-website
2. 进入 **Settings** → **Pages**
3. 配置发布源：
   - **Source**: 选择 `Deploy from a branch`
   - **Branch**: 选择 `gh-pages`
   - **Folder**: 选择 `/ (root)`
4. 点击 **Save**

### 步骤 4：等待发布

- 页面顶部会显示 "Your site is being built"
- 约 1-2 分钟后会变成 "Your site is published at https://gasdyueer.github.io/JingMAD-website"
- 点击链接访问你的网站

## 后续更新

当需要更新网站时：

```bash
# 1. 修改代码并提交到 main 分支
git add .
git commit -m "更新内容"
git push origin main

# 2. 重新部署
npm run deploy:gh
```

## 项目配置说明

### package.json 脚本

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build && npm run copy-images",
    "predeploy": "npm run build",
    "deploy:gh": "gh-pages -d dist"
  },
  "devDependencies": {
    "gh-pages": "^6.0.0"
  }
}
```

### vite.config.ts 配置

已正确配置 base URL：
```typescript
const base = process.env.NODE_ENV === 'production' ? '/JingMAD-website/' : '/';
```

### 重要文件

- `.nojekyll`: 已存在，用于禁用 Jekyll 处理
- `dist/`: 构建输出目录
- `mad_imgs/`: 图片资源目录（已复制到 dist）

## 故障排除

### 问题 1：页面空白或样式丢失
**原因**: base 路径配置错误
**解决**: 确保 `vite.config.ts` 中的 `base` 配置正确

### 问题 2：404 错误
**原因**: GitHub Pages 缓存或路由问题
**解决**:
1. 清除浏览器缓存：Ctrl+F5
2. 等待 GitHub Pages 更新（可能需要几分钟）

### 问题 3：部署后还是旧内容
**解决**:
```bash
# 清理构建缓存
npm run clean
npm run build
npm run deploy:gh
```

## 禁用 GitHub Actions（可选）

如果你不想使用 GitHub Actions，可以删除或重命名工作流文件：

```bash
# 重命名工作流文件以禁用它
mv .github/workflows/deploy.yml .github/workflows/deploy.yml.disabled
```

或者直接在 GitHub 仓库设置中禁用 Actions。

## 验证部署

1. 访问 https://gasdyueer.github.io/JingMAD-website
2. 检查页面是否正常加载
3. 检查图片是否显示
4. 测试搜索功能

## 联系方式

如有问题，请通过 GitHub Issues 反馈：https://github.com/gasdyueer/JingMAD-website/issues