import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';
import DefineOptions from 'unplugin-vue-define-options/vite';
import { visualizer } from 'rollup-plugin-visualizer'
import legacy from '@vitejs/plugin-legacy';

const isVisualizer = process.env.VISUALIZER === 'show'
export default defineConfig({
  base: '/syn/',
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()],
    }),
    DefineOptions(),
    isVisualizer && visualizer({ gzipSize: true }),
    legacy({
      targets: ['defaults', 'not IE 11'],
      modernPolyfills: true,
      renderLegacyChunks: false,
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/css/variable.scss";`
      },
    }
  },
  server: {
    open: true,
    port: 333,
    hmr: true,
    host: '0.0.0.0',
    proxy: {
      // '/apis': {
      //   target: 'https://jpmx.xyz',
      //   changeOrigin: true,
      //   secure: true,
      //   rewrite: (path) => path.replace(/^\/apis/, '/apis')
      // },
      // '/api': {
      //   target: 'https://jpmx.xyz',
      //   changeOrigin: true,
      //   secure: true,
      //   rewrite: (path) => path.replace(/^\/api/, '/api')
      // },
      // '/wallet': {
      //   target: 'https://jpmx.xyz',
      //   changeOrigin: true,
      //   secure: true,
      //   rewrite: (path) => path.replace(/^\/wallet/, '/wallet')
      // },
      // '/exchangeapplyorder': {
      //   target: 'https://jpmx.xyz',
      //   changeOrigin: true,
      //   secure: true,
      //   rewrite: (path) => path.replace(/^\/exchangeapplyorder/, '/exchangeapplyorder')
      // }
    }
  },
  resolve: {
    dedupe: [
      'vue'
    ],
    alias: {
      'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
      "~": path.resolve(__dirname, './'),
      "@": path.resolve(__dirname, 'src'),
    }
  },
  build: {
    outDir: '../../jar/syn',
    assetsDir: "static",
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, "index.html"),
      },
      output: {
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: "js/[name]-[hash].js",
        assetFileNames: "[ext]/[name]-[hash].[ext]"
      },
    },
  },
  externals: ['vue']
})
