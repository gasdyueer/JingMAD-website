import path from 'path';
import { defineConfig, loadEnv } from 'vite';


export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
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
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
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
      },
      publicDir: 'mad_imgs', // 将mad_imgs设为公共目录，这样图片可以直接通过相对路径访问
      // 包含所有图片格式和markdown文件
      assetsInclude: ['**/*.md', '**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.gif', '**/*.webp'],
    };
});
