import { createApp } from "vue";

// 首先导入 CSS 样式文件
import "@/assets/css/compositeHome/index.css";
import "element-plus/dist/index.css";
import "vue3-country-intl/lib/vue3-country-intl.css";
import "@/assets/css/common.css";
import "vue-slider-component/theme/default.css";
import "vue3-slide-verify/dist/style.css";

// 然后导入 Vue 生态系统相关
import router from "@/router";
import pinia from "@/store";
import i18n from "@/i18n";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

// Element Plus 配置
import { setupElementPlus } from '@/plugins/element-plus';

// composite-home公用组件
import menuLayout from "@comCompositeHome/menuLayout.vue";
import pcSection from "@comCompositeHome/pcSection.vue";

// 公用组件
import Vue3CountryIntl from "vue3-country-intl";
import SlideVerify from "vue3-slide-verify";
import eventBus from "vue3-eventbus";
import lazyPlugin from "vue3-lazy";

// 工具函数
import { getImages, getStorage } from "@/utils/index";

// 自定义指令
import {setupAuthDirective} from './utils/directives';

// 全局错误处理
import { initErrorHandler } from './utils/errorHandler';

// 最后导入 App 组件
import App from "./App.vue";

// 创建应用实例
const app = createApp(App);

// 获取语言设置
const lang = getStorage("lang")?.includes("zh-CN");

// 配置 Pinia
pinia.use(piniaPluginPersistedstate); // 开启持久化

// 按正确顺序注册插件和组件
app.use(pinia);
app.use(router);
app.use(i18n);

// 配置 Element Plus - 使用专门的配置函数避免循环依赖
const currentLang = getStorage("lang") || "zh-CN";
setupElementPlus(app, currentLang);

// 使用懒加载插件
app.use(lazyPlugin, {
  // loading: require('@/assets/images/default.png'), // 图片加载时默认图片
  // error: require('@/assets/images/error.png')// 图片加载失败时默认图片
});

// 注册其他插件
app.use(eventBus);

// 设置全局属性
app.config.globalProperties.$getImages = getImages; // 挂载全局
app.config.globalProperties.$title = import.meta.env.VITE_APP__TITLE;
app.config.globalProperties.$email = import.meta.env.VITE_APP__EMAIL;

// 注册全局组件
app.component(Vue3CountryIntl.name, Vue3CountryIntl);
app.component(SlideVerify);

// 注册全局组件
app.component('menuLayout', menuLayout);
app.component('pcSection', pcSection);

// 设置自定义指令
setupAuthDirective(app); // 阻止鼠标多次点击指令

// 初始化全局错误处理（仅在浏览器环境中）
if (typeof window !== 'undefined') {
  initErrorHandler();
}

// 挂载应用
app.mount("#app");
