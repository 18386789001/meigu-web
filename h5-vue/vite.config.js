import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  base: '/h5/',
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/css/variables.scss";`
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@comH5': resolve(__dirname, 'src/components'),
      '@comCommon': resolve(__dirname, 'src/components/common'),
      '@comH5Home': resolve(__dirname, 'src/components/home'),
      '@comH5Trading': resolve(__dirname, 'src/components/trading'),
      '@comH5Platform': resolve(__dirname, 'src/components/platform'),
      '@comH5Education': resolve(__dirname, 'src/components/education'),
      '@comH5Analysis': resolve(__dirname, 'src/components/analysis'),
      '@comH5Support': resolve(__dirname, 'src/components/support'),
      '@comH5Footer': resolve(__dirname, 'src/components/footer'),
      '@comH5Header': resolve(__dirname, 'src/components/header'),
      '@comH5Mobile': resolve(__dirname, 'src/components/mobile'),
      '@viewsH5': resolve(__dirname, 'src/views'),
      '@apiH5': resolve(__dirname, 'src/api'),
      '@utilsH5': resolve(__dirname, 'src/utils'),
      '@assetsH5': resolve(__dirname, 'src/assets'),
      '@storeH5': resolve(__dirname, 'src/store'),
      '@routerH5': resolve(__dirname, 'src/router'),
      '@i18nH5': resolve(__dirname, 'src/i18n')
    }
  },
  server: {
    port: 3333,
    host: true,
    open: true,
    // 添加重定向规则
    middlewareMode: false,
    proxy: {
      '/api': {
        target: 'https://jpmx.xyz',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
      // 新增：代理WAP端请求
      '/syn': {
        target: 'https://jpmx.xyz',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/syn/, '/syn'),
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('WAP proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending WAP Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received WAP Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      }
    }
  },
  build: {
    outDir: '../../jar/h5',
    assetsDir: 'static',
    sourcemap: false,
    rollupOptions: {
      output: {
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
      }
    }
  }
})
