/**
 * Element Plus 配置文件
 * 解决生产环境中的循环依赖问题
 */

import ElementPlus from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import en from 'element-plus/es/locale/lang/en';

// 导入样式
import 'element-plus/dist/index.css';

/**
 * 安装 Element Plus
 * @param {App} app Vue 应用实例
 * @param {string} locale 语言设置
 */
export function setupElementPlus(app, locale = 'zh-CN') {
  // 确定语言
  const isZhCN = locale.includes('zh-CN');
  
  // 注册 Element Plus
  app.use(ElementPlus, {
    locale: isZhCN ? zhCn : en,
    // 添加其他配置选项
    size: 'default',
    zIndex: 3000,
  });

  // 注册所有图标组件
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
  }
}

/**
 * 获取 Element Plus 语言包
 * @param {string} locale 语言设置
 * @returns {Object} 语言包对象
 */
export function getElementPlusLocale(locale = 'zh-CN') {
  return locale.includes('zh-CN') ? zhCn : en;
}

// 导出常用组件和方法
export {
  ElMessage,
  ElMessageBox,
  ElNotification,
  ElLoading
} from 'element-plus';

// 默认导出配置函数
export default setupElementPlus;
