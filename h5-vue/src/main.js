import { createApp } from "vue";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

// CSS样式文件
import "element-plus/dist/index.css";

// Element Plus组件
import zh from "element-plus/es/locale/lang/zh-cn";
import en from "element-plus/es/locale/lang/en";
import { ElMessage } from "element-plus";
import ElementPlus from "element-plus";

// 公用组件
import Vue3CountryIntl from "vue3-country-intl";
import SlideVerify from "vue3-slide-verify";
import eventBus from "vue3-eventbus";

// 自定义指令
import { setupAuthDirective } from './utils/directives';


// 全局错误处理
import { initErrorHandler } from './utils/errorHandler';
import { initErrorFilter } from './utils/errorFilter';

// 路由和状态管理
import router from "@/router";
import pinia from "@/store";
import i18n from "@/i18n";
import App from "./App.vue";

// 移动端检测和自动切换
import { initDeviceDetection, autoSwitchToDesktop } from "@/utils/deviceDetector";
import { initLocalStorageCleanup, getValidLanguageCode } from "@/utils/localStorage";
import { fixAllLocalStorageIssues } from "@/utils/productionFix";
import { initLocalStorageCleaner } from "@/utils/localStorageCleaner";
import { autoFixOnPageLoad, watchLocalStorageChanges } from "@/utils/jsonParseFix";
import { initializeLanguage, initializeOnPageLoad } from "@/utils/languageInit";

// 导入统一的JSON错误修复工具
import { autoFixOnLoad as autoFixUnifiedJson } from '@/utils/unifiedJsonErrorFix';
import { setupErrorListener } from '@/utils/productionErrorFix';
import { setupAboutPageErrorListener } from '@/utils/aboutPageErrorFix';

// 初始化localStorage清理和修复
try {
  // 首先运行其他清理器
  initLocalStorageCleaner();
  initLocalStorageCleanup();

  // 生产环境修复（但不重置语言）
  if (import.meta.env.PROD) {
    fixAllLocalStorageIssues();
  }

  // 自动修复JSON解析问题
  autoFixOnPageLoad();

  // 监控localStorage变化
  watchLocalStorageChanges();

  // 使用统一的JSON错误修复工具
  autoFixUnifiedJson();
  
  // 设置错误监听器
  setupErrorListener();
  
  // 设置About页面错误监听器
  setupAboutPageErrorListener();

  // ⚠️ 已禁用强制英语初始化，以支持用户自由选择语言
  // initializeLanguage();

} catch (error) {
  console.error('localStorage初始化失败:', error);
  // 强制清理localStorage并设置英文
  try {
    localStorage.clear();
    localStorage.setItem('lang', 'en-US');
    console.log('已强制清理localStorage并设置英文');
  } catch (clearError) {
    console.error('强制清理localStorage失败:', clearError);
  }
}

// 强制语言初始化为英文
const initializeDefaultLanguage = () => {
  try {
    const currentLang = localStorage.getItem('lang');

    // 如果没有设置语言或者语言无效，强制设置为英文
    if (!currentLang || !getValidLanguageCode(currentLang)) {
      console.log('初始化默认语言为英文');
      localStorage.setItem('lang', 'en-US');
    }

    // 确保i18n使用英文作为默认语言
    if (i18n && i18n.global) {
      const finalLang = localStorage.getItem('lang') || 'en-US';
      if (i18n.global.locale.value !== undefined) {
        i18n.global.locale.value = finalLang;
      } else {
        i18n.global.locale = finalLang;
      }
      console.log('i18n默认语言设置为:', finalLang);
    }
  } catch (error) {
    console.error('语言初始化失败:', error);
    // 出错时强制使用英文
    try {
      localStorage.setItem('lang', 'en-US');
    } catch (e) {
      console.error('无法设置默认语言:', e);
    }
  }
};

// 执行语言初始化
initializeDefaultLanguage();

// 强制使用英文作为默认语言
const app = createApp(App);

// 插件配置
pinia.use(piniaPluginPersistedstate);
setupAuthDirective(app);
app.use(i18n);
app.use(router);
app.use(ElementPlus, {
  locale: en, // 强制使用英文
});
app.use(pinia);
app.use(eventBus);

// 全局属性
app.config.globalProperties.$title = import.meta.env.VITE_APP__TITLE || "Demo";
app.config.globalProperties.$email = import.meta.env.VITE_APP__EMAIL || "support@demo.com";

// 全局组件
app.component(Vue3CountryIntl.name, Vue3CountryIntl);
app.component(SlideVerify);

// 挂载应用
app.mount("#app");

// 全局消息提示
app.config.globalProperties.$message = ElMessage;

// 初始化设备检测
initDeviceDetection();

// PC端自动切换检测
setTimeout(() => {
  try {
    // 延迟执行，确保设备检测已完成
    const switched = autoSwitchToDesktop();
    if (switched) {
      console.log('PC端检测完成，已自动切换到PC版');
    } else {
      console.log('移动端访问，继续使用H5版本');
    }
  } catch (error) {
    console.error('PC端切换检测失败:', error);
  }
}, 100);


// 初始化错误处理（仅在浏览器环境中）
if (typeof window !== 'undefined') {
  initErrorFilter(); // 先初始化错误过滤器
  initErrorHandler();
}

// 页面加载完成
document.addEventListener('DOMContentLoaded', () => {
  const appElement = document.getElementById('app');
  if (appElement) {
    appElement.classList.add('loaded');
  }

  // ⚠️ 已禁用强制英语初始化，以支持用户自由选择语言
  // initializeOnPageLoad();
  
        // 页面加载完成后执行错误修复
        autoFixUnifiedJson();
        
        // 注意：已使用统一的JSON错误修复工具，无需重复调用其他修复函数
});

// 强制重定向到首页
window.addEventListener('load', () => {
  const currentPath = window.location.pathname;
  
  // 如果当前路径不是/h5/开头，重定向到首页
  if (!currentPath.startsWith('/h5/')) {
    window.location.href = '/h5/';
  }
});

// 监听浏览器前进后退按钮
window.addEventListener('popstate', () => {
  const currentPath = window.location.pathname;
  if (!currentPath.startsWith('/h5/')) {
    window.location.href = '/h5/';
  }
});