/**
 * 语言初始化工具
 * 确保应用在所有环境下都默认使用英文
 */

import { getValidLanguageCode } from './localStorage';

/**
 * 强制初始化语言为英文
 * 适用于本地开发和生产环境
 */
export function forceInitializeEnglish() {
  try {
    console.log('开始强制语言初始化...');
    
    // 检查当前环境
    const isProduction = import.meta.env.PROD;
    const isDevelopment = import.meta.env.DEV;
    
    console.log('当前环境:', isProduction ? '生产环境' : '开发环境');
    console.log('当前域名:', window.location.hostname);
    console.log('当前路径:', window.location.pathname);
    
    // 获取当前语言设置
    const currentLang = localStorage.getItem('lang');
    console.log('当前存储的语言:', currentLang);
    
    // 强制设置为英文
    localStorage.setItem('lang', 'en-US');
    console.log('已强制设置语言为: en-US');
    
    // 验证设置是否成功
    const verifyLang = localStorage.getItem('lang');
    if (verifyLang === 'en-US') {
      console.log('✅ 语言初始化成功: en-US');
      return true;
    } else {
      console.error('❌ 语言初始化失败，当前值:', verifyLang);
      return false;
    }
    
  } catch (error) {
    console.error('语言初始化过程中发生错误:', error);
    
    // 尝试清理localStorage并重新设置
    try {
      localStorage.removeItem('lang');
      localStorage.setItem('lang', 'en-US');
      console.log('已清理并重新设置语言为: en-US');
      return true;
    } catch (retryError) {
      console.error('重试语言设置也失败:', retryError);
      return false;
    }
  }
}

/**
 * 检查并修复语言设置
 * 如果当前语言不是英文，则修复为英文
 */
export function checkAndFixLanguage() {
  try {
    const currentLang = localStorage.getItem('lang');
    
    // 如果没有语言设置或不是英文，则设置为英文
    if (!currentLang || currentLang !== 'en-US') {
      console.log(`检测到语言设置需要修复: ${currentLang} → en-US`);
      localStorage.setItem('lang', 'en-US');
      return true;
    }
    
    console.log('语言设置正确: en-US');
    return false;
  } catch (error) {
    console.error('检查语言设置时发生错误:', error);
    return false;
  }
}

/**
 * 监听语言变化并确保始终为英文
 * 防止其他代码意外修改语言设置
 */
export function watchLanguageChanges() {
  // 监听localStorage变化
  window.addEventListener('storage', (event) => {
    if (event.key === 'lang' && event.newValue !== 'en-US') {
      console.warn('检测到语言被修改为:', event.newValue, '正在恢复为英文');
      localStorage.setItem('lang', 'en-US');
    }
  });
  
  // 定期检查语言设置
  setInterval(() => {
    checkAndFixLanguage();
  }, 5000); // 每5秒检查一次
}

/**
 * 为生产环境优化的语言初始化
 * 针对 https://jpmx.xyz/h5/ 域名
 */
export function initializeForProduction() {
  const hostname = window.location.hostname;
  const isProductionDomain = hostname === 'jpmx.xyz' || hostname.includes('jpmx.xyz');
  
  if (isProductionDomain) {
    console.log('检测到生产环境域名，执行生产环境语言初始化');
    
    // 清除可能的缓存语言设置
    try {
      localStorage.removeItem('lang');
      sessionStorage.removeItem('lang');
      
      // 设置英文
      localStorage.setItem('lang', 'en-US');
      
      console.log('✅ 生产环境语言初始化完成: en-US');
      return true;
    } catch (error) {
      console.error('❌ 生产环境语言初始化失败:', error);
      return false;
    }
  }
  
  return false;
}

/**
 * 为开发环境优化的语言初始化
 * 针对 http://localhost:3333/h5/ 地址
 */
export function initializeForDevelopment() {
  const hostname = window.location.hostname;
  const port = window.location.port;
  const isDevelopmentEnv = hostname === 'localhost' && port === '3333';
  
  if (isDevelopmentEnv) {
    console.log('检测到开发环境，执行开发环境语言初始化');
    
    // 开发环境可能需要清理更多缓存
    try {
      // 清除所有可能的语言相关缓存
      const keysToRemove = ['lang', 'language', 'locale', 'i18n-locale'];
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
      
      // 设置英文
      localStorage.setItem('lang', 'en-US');
      
      console.log('✅ 开发环境语言初始化完成: en-US');
      return true;
    } catch (error) {
      console.error('❌ 开发环境语言初始化失败:', error);
      return false;
    }
  }
  
  return false;
}

/**
 * 通用语言初始化函数
 * 自动检测环境并执行相应的初始化
 */
export function initializeLanguage() {
  console.log('🌐 开始语言初始化...');
  
  // 首先尝试强制初始化
  const forceResult = forceInitializeEnglish();
  
  // 然后根据环境执行特定初始化
  const productionResult = initializeForProduction();
  const developmentResult = initializeForDevelopment();
  
  // 如果都没有执行，则执行通用初始化
  if (!productionResult && !developmentResult) {
    console.log('执行通用语言初始化');
    checkAndFixLanguage();
  }
  
  // 启动语言监听
  watchLanguageChanges();
  
  console.log('🎉 语言初始化完成');
  
  return {
    force: forceResult,
    production: productionResult,
    development: developmentResult
  };
}

/**
 * 页面加载时的语言初始化
 * 在DOM加载完成后执行
 */
export function initializeOnPageLoad() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLanguage);
  } else {
    initializeLanguage();
  }
}

/**
 * 导出默认初始化函数
 */
export default initializeLanguage;
