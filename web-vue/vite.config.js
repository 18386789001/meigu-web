import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import Icons from "unplugin-icons/vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import DefineOptions from "unplugin-vue-define-options/vite";
import { visualizer } from "rollup-plugin-visualizer";
import legacy from "@vitejs/plugin-legacy";

const isVisualizer = process.env.VISUALIZER === "show";
export default defineConfig({
  base: "/",
  plugins: [
    vue(),
    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: false, // 禁用样式自动导入，避免循环依赖
          version: '2.3.1', // 指定版本，确保兼容性
        }),
      ],
      dts: true, // 生成类型声明文件
      include: [/\.vue$/, /\.vue\?vue/], // 限制处理范围
    }),
    AutoImport({
      imports: ["vue", "vue-router", "pinia"],
      resolvers: [
        ElementPlusResolver({
          importStyle: false, // 禁用样式自动导入，避免循环依赖
          version: '2.3.1', // 指定版本，确保兼容性
        }),
      ],
      dts: true, // 生成类型声明文件
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/], // 限制处理范围
    }),
    Icons({
      autoInstall: true,
    }),
    DefineOptions(),
    isVisualizer && visualizer({ gzipSize: true }),
    legacy({
      targets: ["defaults", "not IE 11"],
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/assets/css/global.scss";',
      },
    },
  },
  server: {
    port: 5174,
    host: '0.0.0.0',
    // 暂时注释掉代理配置，因为新页面使用模拟数据
    // 如果需要代理，请设置正确的 target URL
    proxy: {
      // 将 /api 请求代理到生产环境
      '/api': {
        target: 'https://jpmx.xyz',  // 设置正确的目标地址
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
      }
    }
  },
  // 添加静态资源配置
  publicDir: 'public',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@comCommon": path.resolve(__dirname, "src/components/common"),
      "@comCompositeHome": path.resolve(
        __dirname,
        "src/components/compositeHome"
      ),
      "@comTrade": path.resolve(__dirname, "src/components/commonTrade"),
      "@comConstract": path.resolve(__dirname, "src/components/constract"),
      "@comSpot": path.resolve(__dirname, "src/components/spot"),
      "@image": path.resolve(__dirname, "../image"),
      "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js",
    },
  },
  // 优化依赖预构建，解决循环依赖问题
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'pinia',
      'element-plus',
      '@element-plus/icons-vue',
      'axios',
      'dayjs',
      'vue-i18n',
      'echarts',
      'js-md5'
    ],
    exclude: ['vue-demi'],
    // 强制预构建，避免运行时依赖问题
    force: true
  },
  build: {
    outDir: '../../jar',
    assetsDir: "static",
    // 优化内存使用
    minify: 'esbuild', // 使用 esbuild 替代 terser，更快且内存占用更少
    target: 'es2015',
    // 确保正确的模块格式
    format: 'es',
    // 启用代码分割
    cssCodeSplit: true,
    // 分块策略优化
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, "index.html"),
      },
      output: {
        chunkFileNames: "js/[name]-[hash].js",
        entryFileNames: "js/[name]-[hash].js",
        assetFileNames: "[ext]/name-[hash].[ext]",
        // 确保模块格式正确
        format: 'es',
        // 避免变量名冲突
        globals: {
          vue: 'Vue'
        },
        // 优化的手动分块策略，避免循环依赖
        manualChunks: (id) => {
          // Vue 核心生态系统 - 保持在同一个 chunk 中避免循环依赖
          if (id.includes('vue') || id.includes('vue-router') || id.includes('pinia')) {
            return 'vue-core';
          }
          // Element Plus 及其图标 - 单独分块
          if (id.includes('element-plus') || id.includes('@element-plus')) {
            return 'element-plus';
          }
          // 图表库
          if (id.includes('echarts') || id.includes('klinecharts')) {
            return 'charts';
          }
          // 工具库
          if (id.includes('axios') || id.includes('dayjs') || id.includes('js-md5')) {
            return 'utils';
          }
          // UI 组件库
          if (id.includes('vue3-country-intl') || id.includes('vue3-slide-verify') ||
            id.includes('vue-slider-component') || id.includes('swiper')) {
            return 'ui-components';
          }
          // 其他第三方库
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      },
      // 减少并发处理，降低内存压力
      maxParallelFileOps: 2,
    },
    // 禁用源码映射以节省内存
    sourcemap: false,
    // 设置较小的分块大小阈值
    chunkSizeWarningLimit: 1000,
  },
});
