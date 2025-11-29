// vite.config.js
import { defineConfig } from "file:///D:/qianduanProject/haiwai/bCon/template-main/wap-vue/node_modules/.store/vite@3.2.11/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/qianduanProject/haiwai/bCon/template-main/wap-vue/node_modules/.store/@vitejs+plugin-vue@3.2.0/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "path";
import Components from "file:///D:/qianduanProject/haiwai/bCon/template-main/wap-vue/node_modules/.store/unplugin-vue-components@0.22.12/node_modules/unplugin-vue-components/dist/vite.mjs";
import { VantResolver } from "file:///D:/qianduanProject/haiwai/bCon/template-main/wap-vue/node_modules/.store/unplugin-vue-components@0.22.12/node_modules/unplugin-vue-components/dist/resolvers.mjs";
import DefineOptions from "file:///D:/qianduanProject/haiwai/bCon/template-main/wap-vue/node_modules/.store/unplugin-vue-define-options@1.5.5/node_modules/unplugin-vue-define-options/dist/vite.js";
import { visualizer } from "file:///D:/qianduanProject/haiwai/bCon/template-main/wap-vue/node_modules/.store/rollup-plugin-visualizer@5.14.0/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import legacy from "file:///D:/qianduanProject/haiwai/bCon/template-main/wap-vue/node_modules/.store/@vitejs+plugin-legacy@3.0.2/node_modules/@vitejs/plugin-legacy/dist/index.mjs";
var __vite_injected_original_dirname = "D:\\qianduanProject\\haiwai\\bCon\\template-main\\wap-vue";
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
      targets: ["defaults", "not IE 11"],
      modernPolyfills: true,
      renderLegacyChunks: false
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
    proxy: {}
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxxaWFuZHVhblByb2plY3RcXFxcaGFpd2FpXFxcXGJDb25cXFxcdGVtcGxhdGUtbWFpblxcXFx3YXAtdnVlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxxaWFuZHVhblByb2plY3RcXFxcaGFpd2FpXFxcXGJDb25cXFxcdGVtcGxhdGUtbWFpblxcXFx3YXAtdnVlXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9xaWFuZHVhblByb2plY3QvaGFpd2FpL2JDb24vdGVtcGxhdGUtbWFpbi93YXAtdnVlL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnO1xuaW1wb3J0IHsgVmFudFJlc29sdmVyIH0gZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzJztcbmltcG9ydCBEZWZpbmVPcHRpb25zIGZyb20gJ3VucGx1Z2luLXZ1ZS1kZWZpbmUtb3B0aW9ucy92aXRlJztcbmltcG9ydCB7IHZpc3VhbGl6ZXIgfSBmcm9tICdyb2xsdXAtcGx1Z2luLXZpc3VhbGl6ZXInXG5pbXBvcnQgbGVnYWN5IGZyb20gJ0B2aXRlanMvcGx1Z2luLWxlZ2FjeSc7XG5cbmNvbnN0IGlzVmlzdWFsaXplciA9IHByb2Nlc3MuZW52LlZJU1VBTElaRVIgPT09ICdzaG93J1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgYmFzZTogJy9zeW4vJyxcbiAgcGx1Z2luczogW1xuICAgIHZ1ZSgpLFxuICAgIENvbXBvbmVudHMoe1xuICAgICAgcmVzb2x2ZXJzOiBbVmFudFJlc29sdmVyKCldLFxuICAgIH0pLFxuICAgIERlZmluZU9wdGlvbnMoKSxcbiAgICBpc1Zpc3VhbGl6ZXIgJiYgdmlzdWFsaXplcih7IGd6aXBTaXplOiB0cnVlIH0pLFxuICAgIGxlZ2FjeSh7XG4gICAgICB0YXJnZXRzOiBbJ2RlZmF1bHRzJywgJ25vdCBJRSAxMSddLFxuICAgICAgbW9kZXJuUG9seWZpbGxzOiB0cnVlLFxuICAgICAgcmVuZGVyTGVnYWN5Q2h1bmtzOiBmYWxzZSxcbiAgICB9KSxcbiAgXSxcbiAgY3NzOiB7XG4gICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xuICAgICAgc2Nzczoge1xuICAgICAgICBhZGRpdGlvbmFsRGF0YTogYEBpbXBvcnQgXCJAL2Fzc2V0cy9jc3MvdmFyaWFibGUuc2Nzc1wiO2BcbiAgICAgIH0sXG4gICAgfVxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBvcGVuOiB0cnVlLFxuICAgIHBvcnQ6IDMzMyxcbiAgICBobXI6IHRydWUsXG4gICAgaG9zdDogJzAuMC4wLjAnLFxuICAgIHByb3h5OiB7XG4gICAgICAvLyAnL2FwaXMnOiB7XG4gICAgICAvLyAgIHRhcmdldDogJ2h0dHBzOi8vanBteC54eXonLFxuICAgICAgLy8gICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAvLyAgIHNlY3VyZTogdHJ1ZSxcbiAgICAgIC8vICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2FwaXMvLCAnL2FwaXMnKVxuICAgICAgLy8gfSxcbiAgICAgIC8vICcvYXBpJzoge1xuICAgICAgLy8gICB0YXJnZXQ6ICdodHRwczovL2pwbXgueHl6JyxcbiAgICAgIC8vICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgLy8gICBzZWN1cmU6IHRydWUsXG4gICAgICAvLyAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCAnL2FwaScpXG4gICAgICAvLyB9LFxuICAgICAgLy8gJy93YWxsZXQnOiB7XG4gICAgICAvLyAgIHRhcmdldDogJ2h0dHBzOi8vanBteC54eXonLFxuICAgICAgLy8gICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAvLyAgIHNlY3VyZTogdHJ1ZSxcbiAgICAgIC8vICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL3dhbGxldC8sICcvd2FsbGV0JylcbiAgICAgIC8vIH0sXG4gICAgICAvLyAnL2V4Y2hhbmdlYXBwbHlvcmRlcic6IHtcbiAgICAgIC8vICAgdGFyZ2V0OiAnaHR0cHM6Ly9qcG14Lnh5eicsXG4gICAgICAvLyAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgIC8vICAgc2VjdXJlOiB0cnVlLFxuICAgICAgLy8gICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvZXhjaGFuZ2VhcHBseW9yZGVyLywgJy9leGNoYW5nZWFwcGx5b3JkZXInKVxuICAgICAgLy8gfVxuICAgIH1cbiAgfSxcbiAgcmVzb2x2ZToge1xuICAgIGRlZHVwZTogW1xuICAgICAgJ3Z1ZSdcbiAgICBdLFxuICAgIGFsaWFzOiB7XG4gICAgICAndnVlLWkxOG4nOiAndnVlLWkxOG4vZGlzdC92dWUtaTE4bi5janMuanMnLFxuICAgICAgXCJ+XCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLycpLFxuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKSxcbiAgICB9XG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgb3V0RGlyOiAnLi4vLi4vamFyL3N5bicsXG4gICAgYXNzZXRzRGlyOiBcInN0YXRpY1wiLFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIGlucHV0OiB7XG4gICAgICAgIGluZGV4OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcImluZGV4Lmh0bWxcIiksXG4gICAgICB9LFxuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIGNodW5rRmlsZU5hbWVzOiAnanMvW25hbWVdLVtoYXNoXS5qcycsXG4gICAgICAgIGVudHJ5RmlsZU5hbWVzOiBcImpzL1tuYW1lXS1baGFzaF0uanNcIixcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6IFwiW2V4dF0vW25hbWVdLVtoYXNoXS5bZXh0XVwiXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIGV4dGVybmFsczogWyd2dWUnXVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMFYsU0FBUyxvQkFBb0I7QUFDdlgsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sVUFBVTtBQUNqQixPQUFPLGdCQUFnQjtBQUN2QixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLG1CQUFtQjtBQUMxQixTQUFTLGtCQUFrQjtBQUMzQixPQUFPLFlBQVk7QUFQbkIsSUFBTSxtQ0FBbUM7QUFTekMsSUFBTSxlQUFlLFFBQVEsSUFBSSxlQUFlO0FBQ2hELElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLE1BQU07QUFBQSxFQUNOLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxJQUNKLFdBQVc7QUFBQSxNQUNULFdBQVcsQ0FBQyxhQUFhLENBQUM7QUFBQSxJQUM1QixDQUFDO0FBQUEsSUFDRCxjQUFjO0FBQUEsSUFDZCxnQkFBZ0IsV0FBVyxFQUFFLFVBQVUsS0FBSyxDQUFDO0FBQUEsSUFDN0MsT0FBTztBQUFBLE1BQ0wsU0FBUyxDQUFDLFlBQVksV0FBVztBQUFBLE1BQ2pDLGlCQUFpQjtBQUFBLE1BQ2pCLG9CQUFvQjtBQUFBLElBQ3RCLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxLQUFLO0FBQUEsSUFDSCxxQkFBcUI7QUFBQSxNQUNuQixNQUFNO0FBQUEsUUFDSixnQkFBZ0I7QUFBQSxNQUNsQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixLQUFLO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixPQUFPLENBeUJQO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsUUFBUTtBQUFBLE1BQ047QUFBQSxJQUNGO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTCxZQUFZO0FBQUEsTUFDWixLQUFLLEtBQUssUUFBUSxrQ0FBVyxJQUFJO0FBQUEsTUFDakMsS0FBSyxLQUFLLFFBQVEsa0NBQVcsS0FBSztBQUFBLElBQ3BDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLElBQ1IsV0FBVztBQUFBLElBQ1gsZUFBZTtBQUFBLE1BQ2IsT0FBTztBQUFBLFFBQ0wsT0FBTyxLQUFLLFFBQVEsa0NBQVcsWUFBWTtBQUFBLE1BQzdDO0FBQUEsTUFDQSxRQUFRO0FBQUEsUUFDTixnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQSxNQUNsQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxXQUFXLENBQUMsS0FBSztBQUNuQixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
