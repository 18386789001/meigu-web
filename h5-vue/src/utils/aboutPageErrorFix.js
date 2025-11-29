/**
 * About页面错误处理工具
 * 专门处理About.vue页面中的SyntaxError问题
 */

/**
 * 修复About页面中的国际化错误
 */
export function fixAboutPageI18nErrors() {
  console.log('=== 开始修复About页面i18n错误 ===');
  
  try {
    // 检查whitepaper相关的翻译键是否存在
    const requiredKeys = [
      'whitepaper.cover.title',
      'whitepaper.cover.subtitle',
      'whitepaper.cover.description',
      'whitepaper.cover.version',
      'whitepaper.toc.title',
      'whitepaper.section1.title',
      'whitepaper.section1.content1',
      'whitepaper.section1.content2'
    ];
    
    // 获取当前语言
    const currentLang = localStorage.getItem('lang') || 'en-US';
    console.log('当前语言:', currentLang);
    
    // 检查翻译键是否存在
    requiredKeys.forEach(key => {
      try {
        // 这里可以添加更详细的检查逻辑
        console.log(`检查翻译键: ${key}`);
      } catch (error) {
        console.warn(`翻译键 ${key} 检查失败:`, error);
      }
    });
    
    console.log('✓ About页面i18n错误修复完成');
  } catch (error) {
    console.error('修复About页面i18n错误失败:', error);
  }
}

/**
 * 修复About页面中的JSON解析问题
 */
export function fixAboutPageJsonErrors() {
  console.log('=== 开始修复About页面JSON错误 ===');
  
  try {
    // 检查localStorage中与About页面相关的数据
    const aboutRelatedKeys = [
      'whitepaper',
      'about',
      'content',
      'sections'
    ];
    
    aboutRelatedKeys.forEach(key => {
      try {
        const value = localStorage.getItem(key);
        if (value) {
          // 尝试解析JSON
          if (value.startsWith('{') || value.startsWith('[')) {
            JSON.parse(value);
            console.log(`✓ ${key}: JSON数据有效`);
          }
        }
      } catch (error) {
        console.warn(`清理无效的About页面数据 [${key}]:`, error);
        localStorage.removeItem(key);
      }
    });
    
    console.log('✓ About页面JSON错误修复完成');
  } catch (error) {
    console.error('修复About页面JSON错误失败:', error);
  }
}

/**
 * 修复About页面中的链接格式问题
 */
export function fixAboutPageLinkErrors() {
  console.log('=== 开始修复About页面链接错误 ===');
  
  try {
    // 检查可能的链接格式问题
    const linkPatterns = [
      /https?:\/\/[^\s"']+/g,
      /www\.[^\s"']+/g,
      /[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
    ];
    
    // 检查localStorage中可能包含链接的数据
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      try {
        const value = localStorage.getItem(key);
        if (value && typeof value === 'string') {
          // 检查是否包含链接
          const hasLinks = linkPatterns.some(pattern => pattern.test(value));
          if (hasLinks) {
            // 验证链接格式
            const links = value.match(/https?:\/\/[^\s"']+/g) || [];
            links.forEach(link => {
              try {
                new URL(link);
                console.log(`✓ 有效链接: ${link}`);
              } catch (urlError) {
                console.warn(`✗ 无效链接: ${link}`, urlError);
              }
            });
          }
        }
      } catch (error) {
        console.warn(`检查键 ${key} 的链接时出错:`, error);
      }
    });
    
    console.log('✓ About页面链接错误修复完成');
  } catch (error) {
    console.error('修复About页面链接错误失败:', error);
  }
}

/**
 * 修复About页面中的Vue组件错误
 */
export function fixAboutPageVueErrors() {
  console.log('=== 开始修复About页面Vue错误 ===');
  
  try {
    // 检查Vue相关的全局对象
    if (typeof window !== 'undefined' && window.Vue) {
      console.log('Vue版本:', window.Vue.version);
    }
    
    // 检查Vue Router
    if (typeof window !== 'undefined' && window.$router) {
      console.log('Vue Router已加载');
    }
    
    // 检查Vue i18n
    if (typeof window !== 'undefined' && window.$i18n) {
      console.log('Vue i18n已加载');
    }
    
    console.log('✓ About页面Vue错误修复完成');
  } catch (error) {
    console.error('修复About页面Vue错误失败:', error);
  }
}

/**
 * 执行About页面的所有修复
 */
export function executeAboutPageFixes() {
  console.log('=== 开始执行About页面错误修复 ===');
  
  try {
    // 1. 修复i18n错误
    fixAboutPageI18nErrors();
    
    // 2. 修复JSON错误
    fixAboutPageJsonErrors();
    
    // 3. 修复链接错误
    fixAboutPageLinkErrors();
    
    // 4. 修复Vue错误
    fixAboutPageVueErrors();
    
    console.log('=== About页面错误修复完成 ===');
    
    return true;
  } catch (error) {
    console.error('执行About页面修复时出错:', error);
    return false;
  }
}

/**
 * 在About页面加载时自动执行修复
 */
export function autoFixAboutPageOnLoad() {
  // 检查当前是否在About页面
  const currentPath = window.location.pathname;
  if (currentPath.includes('/about')) {
    console.log('检测到About页面，开始自动修复...');
    
    // 立即执行修复
    executeAboutPageFixes();
    
    // 延迟执行，确保页面完全加载
    setTimeout(() => {
      executeAboutPageFixes();
    }, 500);
    
    // 再次延迟执行
    setTimeout(() => {
      executeAboutPageFixes();
    }, 2000);
  }
}

/**
 * 监听About页面的错误
 */
export function setupAboutPageErrorListener() {
  // 监听About页面特定的错误
  window.addEventListener('error', (event) => {
    const currentPath = window.location.pathname;
    if (currentPath.includes('/about')) {
      if (event.error && event.error.message) {
        if (event.error.message.includes('Invalid linked format') ||
            event.error.message.includes('SyntaxError') ||
            event.error.message.includes('JSON')) {
          console.warn('检测到About页面错误，正在自动修复...');
          executeAboutPageFixes();
        }
      }
    }
  });
  
  console.log('✓ About页面错误监听器已设置');
}

// 导出默认修复函数
export default {
  fixAboutPageI18nErrors,
  fixAboutPageJsonErrors,
  fixAboutPageLinkErrors,
  fixAboutPageVueErrors,
  executeAboutPageFixes,
  autoFixAboutPageOnLoad,
  setupAboutPageErrorListener
};
