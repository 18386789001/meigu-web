// vite.config.js
import { defineConfig } from "file:///D:/Awww/MT5/template/wap-vue/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/Awww/MT5/template/wap-vue/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "path";
import Components from "file:///D:/Awww/MT5/template/wap-vue/node_modules/unplugin-vue-components/dist/vite.mjs";
import { VantResolver } from "file:///D:/Awww/MT5/template/wap-vue/node_modules/unplugin-vue-components/dist/resolvers.mjs";
import DefineOptions from "file:///D:/Awww/MT5/template/wap-vue/node_modules/unplugin-vue-define-options/dist/vite.mjs";
import { visualizer } from "file:///D:/Awww/MT5/template/wap-vue/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import legacy from "file:///D:/Awww/MT5/template/wap-vue/node_modules/@vitejs/plugin-legacy/dist/index.mjs";
var __vite_injected_original_dirname = "D:\\Awww\\MT5\\template\\wap-vue";
var isVisualizer = process.env.VISUALIZER === "show";
var vite_config_default = defineConfig({
  base: "/syn/",
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()]
    }),
    DefineOptions(),
    isVisualizer && visualizer({ gzipSize: true }),
    legacy({
      targets: ["defaults", "not IE 11"]
    })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/css/variable.scss";`
      }
    }
  },
  server: {
    open: true,
    port: 333,
    hmr: true,
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: "https://jpmx.xyz/",
        changeOrigin: true,
        secure: false,
        timeout: 1e4,
        configure: (proxy, options) => {
          proxy.on("error", (err, req, res) => {
            console.log("proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req, res) => {
            console.log("Sending Request to the Target:", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req, res) => {
            console.log("Received Response from the Target:", proxyRes.statusCode, req.url);
          });
        }
      }
    }
  },
  resolve: {
    dedupe: [
      "vue"
    ],
    alias: {
      "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js",
      "~": path.resolve(__vite_injected_original_dirname, "./"),
      "@": path.resolve(__vite_injected_original_dirname, "src")
    }
  },
  build: {
    outDir: "../../jar/syn",
    assetsDir: "static",
    rollupOptions: {
      input: {
        index: path.resolve(__vite_injected_original_dirname, "index.html")
      },
      output: {
        chunkFileNames: "js/[name]-[hash].js",
        entryFileNames: "js/[name]-[hash].js",
        assetFileNames: "[ext]/[name]-[hash].[ext]"
      }
    }
  },
  externals: ["vue"]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxBd3d3XFxcXE1UNVxcXFx0ZW1wbGF0ZVxcXFx3YXAtdnVlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxBd3d3XFxcXE1UNVxcXFx0ZW1wbGF0ZVxcXFx3YXAtdnVlXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9Bd3d3L01UNS90ZW1wbGF0ZS93YXAtdnVlL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXHJcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnO1xyXG5pbXBvcnQgeyBWYW50UmVzb2x2ZXIgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnO1xyXG5pbXBvcnQgRGVmaW5lT3B0aW9ucyBmcm9tICd1bnBsdWdpbi12dWUtZGVmaW5lLW9wdGlvbnMvdml0ZSc7XHJcbmltcG9ydCB7IHZpc3VhbGl6ZXIgfSBmcm9tICdyb2xsdXAtcGx1Z2luLXZpc3VhbGl6ZXInXHJcbmltcG9ydCBsZWdhY3kgZnJvbSAnQHZpdGVqcy9wbHVnaW4tbGVnYWN5JztcclxuXHJcbmNvbnN0IGlzVmlzdWFsaXplciA9IHByb2Nlc3MuZW52LlZJU1VBTElaRVIgPT09ICdzaG93J1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIGJhc2U6ICcvc3luLycsXHJcbiAgcGx1Z2luczogW1xyXG4gICAgdnVlKCksXHJcbiAgICBDb21wb25lbnRzKHtcclxuICAgICAgcmVzb2x2ZXJzOiBbVmFudFJlc29sdmVyKCldLFxyXG4gICAgfSksXHJcbiAgICBEZWZpbmVPcHRpb25zKCksXHJcbiAgICBpc1Zpc3VhbGl6ZXIgJiYgdmlzdWFsaXplcih7IGd6aXBTaXplOiB0cnVlIH0pLFxyXG4gICAgbGVnYWN5KHtcclxuICAgICAgdGFyZ2V0czogWydkZWZhdWx0cycsICdub3QgSUUgMTEnXSxcclxuICAgIH0pLFxyXG4gIF0sXHJcbiAgY3NzOiB7XHJcbiAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XHJcbiAgICAgIHNjc3M6IHtcclxuICAgICAgICBhZGRpdGlvbmFsRGF0YTogYEBpbXBvcnQgXCJAL2Fzc2V0cy9jc3MvdmFyaWFibGUuc2Nzc1wiO2BcclxuICAgICAgfSxcclxuICAgIH1cclxuICB9LFxyXG4gIHNlcnZlcjoge1xyXG4gICAgb3BlbjogdHJ1ZSxcclxuICAgIHBvcnQ6IDMzMyxcclxuICAgIGhtcjogdHJ1ZSxcclxuICAgIGhvc3Q6ICcwLjAuMC4wJyxcclxuICAgIHByb3h5OiB7XHJcbiAgICAgIFwiL2FwaVwiOiB7XHJcbiAgICAgICAgdGFyZ2V0OiBcImh0dHBzOi8vbXQ1dGVzdC50b3AvXCIsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIHNlY3VyZTogZmFsc2UsXHJcbiAgICAgICAgdGltZW91dDogMTAwMDAsXHJcbiAgICAgICAgY29uZmlndXJlOiAocHJveHksIG9wdGlvbnMpID0+IHtcclxuICAgICAgICAgIHByb3h5Lm9uKCdlcnJvcicsIChlcnIsIHJlcSwgcmVzKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdwcm94eSBlcnJvcicsIGVycik7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHByb3h5Lm9uKCdwcm94eVJlcScsIChwcm94eVJlcSwgcmVxLCByZXMpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1NlbmRpbmcgUmVxdWVzdCB0byB0aGUgVGFyZ2V0OicsIHJlcS5tZXRob2QsIHJlcS51cmwpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBwcm94eS5vbigncHJveHlSZXMnLCAocHJveHlSZXMsIHJlcSwgcmVzKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdSZWNlaXZlZCBSZXNwb25zZSBmcm9tIHRoZSBUYXJnZXQ6JywgcHJveHlSZXMuc3RhdHVzQ29kZSwgcmVxLnVybCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGRlZHVwZTogW1xyXG4gICAgICAndnVlJ1xyXG4gICAgXSxcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgICd2dWUtaTE4bic6ICd2dWUtaTE4bi9kaXN0L3Z1ZS1pMThuLmNqcy5qcycsXHJcbiAgICAgIFwiflwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi8nKSxcclxuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKSxcclxuICAgIH1cclxuICB9LFxyXG4gIGJ1aWxkOiB7XHJcbiAgICBvdXREaXI6ICcuLi8uLi9qYXIvc3luJyxcclxuICAgIGFzc2V0c0RpcjogXCJzdGF0aWNcIixcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgaW5wdXQ6IHtcclxuICAgICAgICBpbmRleDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJpbmRleC5odG1sXCIpLFxyXG4gICAgICB9LFxyXG4gICAgICBvdXRwdXQ6IHtcclxuICAgICAgICBjaHVua0ZpbGVOYW1lczogJ2pzL1tuYW1lXS1baGFzaF0uanMnLFxyXG4gICAgICAgIGVudHJ5RmlsZU5hbWVzOiBcImpzL1tuYW1lXS1baGFzaF0uanNcIixcclxuICAgICAgICBhc3NldEZpbGVOYW1lczogXCJbZXh0XS9bbmFtZV0tW2hhc2hdLltleHRdXCJcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBleHRlcm5hbHM6IFsndnVlJ11cclxufSlcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFnUixTQUFTLG9CQUFvQjtBQUM3UyxPQUFPLFNBQVM7QUFDaEIsT0FBTyxVQUFVO0FBQ2pCLE9BQU8sZ0JBQWdCO0FBQ3ZCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sbUJBQW1CO0FBQzFCLFNBQVMsa0JBQWtCO0FBQzNCLE9BQU8sWUFBWTtBQVBuQixJQUFNLG1DQUFtQztBQVN6QyxJQUFNLGVBQWUsUUFBUSxJQUFJLGVBQWU7QUFDaEQsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsTUFBTTtBQUFBLEVBQ04sU0FBUztBQUFBLElBQ1AsSUFBSTtBQUFBLElBQ0osV0FBVztBQUFBLE1BQ1QsV0FBVyxDQUFDLGFBQWEsQ0FBQztBQUFBLElBQzVCLENBQUM7QUFBQSxJQUNELGNBQWM7QUFBQSxJQUNkLGdCQUFnQixXQUFXLEVBQUUsVUFBVSxLQUFLLENBQUM7QUFBQSxJQUM3QyxPQUFPO0FBQUEsTUFDTCxTQUFTLENBQUMsWUFBWSxXQUFXO0FBQUEsSUFDbkMsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLEtBQUs7QUFBQSxJQUNILHFCQUFxQjtBQUFBLE1BQ25CLE1BQU07QUFBQSxRQUNKLGdCQUFnQjtBQUFBLE1BQ2xCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLEtBQUs7QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFFBQVE7QUFBQSxRQUNSLFNBQVM7QUFBQSxRQUNULFdBQVcsQ0FBQyxPQUFPLFlBQVk7QUFDN0IsZ0JBQU0sR0FBRyxTQUFTLENBQUMsS0FBSyxLQUFLLFFBQVE7QUFDbkMsb0JBQVEsSUFBSSxlQUFlLEdBQUc7QUFBQSxVQUNoQyxDQUFDO0FBQ0QsZ0JBQU0sR0FBRyxZQUFZLENBQUMsVUFBVSxLQUFLLFFBQVE7QUFDM0Msb0JBQVEsSUFBSSxrQ0FBa0MsSUFBSSxRQUFRLElBQUksR0FBRztBQUFBLFVBQ25FLENBQUM7QUFDRCxnQkFBTSxHQUFHLFlBQVksQ0FBQyxVQUFVLEtBQUssUUFBUTtBQUMzQyxvQkFBUSxJQUFJLHNDQUFzQyxTQUFTLFlBQVksSUFBSSxHQUFHO0FBQUEsVUFDaEYsQ0FBQztBQUFBLFFBQ0g7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLFFBQVE7QUFBQSxNQUNOO0FBQUEsSUFDRjtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0wsWUFBWTtBQUFBLE1BQ1osS0FBSyxLQUFLLFFBQVEsa0NBQVcsSUFBSTtBQUFBLE1BQ2pDLEtBQUssS0FBSyxRQUFRLGtDQUFXLEtBQUs7QUFBQSxJQUNwQztBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLFdBQVc7QUFBQSxJQUNYLGVBQWU7QUFBQSxNQUNiLE9BQU87QUFBQSxRQUNMLE9BQU8sS0FBSyxRQUFRLGtDQUFXLFlBQVk7QUFBQSxNQUM3QztBQUFBLE1BQ0EsUUFBUTtBQUFBLFFBQ04sZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsTUFDbEI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsV0FBVyxDQUFDLEtBQUs7QUFDbkIsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
