import path from 'path';
import { defineConfig } from 'vite';


export default defineConfig(({ mode }) => {
    // 根据构建模式设置 base URL
    // 在 GitHub Pages 上，仓库名称为 'JingMAD-website'，所以 base 应为 '/JingMAD-website/'
    // 本地开发时使用根路径
    // 使用 mode 参数来判断，mode 为 'production' 时使用仓库路径
    const base = mode === 'production' ? '/JingMAD-website/' : '/';
    
    console.log(`Vite build mode: ${mode}, base path: ${base}`);
    
    return {
      base,
      server: {
        port: 3000,
        host: 'localhost',
        // 允许服务根目录外的文件
        fs: {
          strict: false,
          allow: ['..'] // 允许访问父目录
        },
      },
      preview: {
        port: 4173,
        host: 'localhost',
      },
      plugins: [],
      define: {
        'process.env.BASE_URL': JSON.stringify(base),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        assetsDir: 'assets',
        rollupOptions: {
          output: {
            assetFileNames: (assetInfo) => {
              if (assetInfo.name && /\.(jpg|jpeg|png|gif|svg|webp)$/.test(assetInfo.name)) {
                return 'assets/images/[name]-[hash][extname]';
              }
              return 'assets/[name]-[hash][extname]';
            },
          },
        },
        // 复制public目录到dist
        copyPublicDir: true,
        // 输出目录为 dist
        outDir: 'dist',
      },
      publicDir: 'mad_imgs', // 将mad_imgs设为公共目录，这样图片可以直接通过相对路径访问
      // 包含所有图片格式和markdown文件
      assetsInclude: ['**/*.md', '**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.gif', '**/*.webp'],
    };
});
