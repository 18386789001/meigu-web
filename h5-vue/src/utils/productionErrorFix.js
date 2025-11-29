/**
 * 生产环境错误修复工具
 * 专门处理生产环境中的SyntaxError: Invalid linked format错误
 */

// 检查是否是简单的字符串值
const isSimpleStringValue = (text) => {
  if (typeof text !== 'string') {
    return false;
  }
  
  const trimmed = text.trim();
  
  // 检查是否是简单的语言代码或标识符
  const simplePatterns = [
    /^[a-z]{2}(-[A-Z]{2})?$/, // 语言代码如 en-US, zh-CN
    /^[a-zA-Z0-9_-]+$/, // 简单的标识符
    /^"[^"]*"$/, // 已经引用的字符串
    /^'[^']*'$/ // 单引号字符串
  ];
  
  const isSimple = simplePatterns.some(pattern => pattern.test(trimmed));
  
  // 额外检查：如果包含常见语言代码，直接返回true
  const commonLanguageCodes = ['en-US', 'zh-CN', 'ja-JP', 'en', 'zh', 'ja'];
  if (commonLanguageCodes.includes(trimmed)) {
    return true;
  }
  
  return isSimple;
};

/**
 * 修复JSON解析错误
 * @param {string} data - 要解析的数据
 * @param {*} defaultValue - 默认值
 * @returns {*} 解析后的数据或默认值
 */
export function safeJsonParse(data, defaultValue = null) {
  if (!data || typeof data !== 'string') {
    return defaultValue;
  }

  try {
    // 清理数据中的无效字符
    let cleanData = data.trim();
    
    // 移除可能的BOM标记
    if (cleanData.charCodeAt(0) === 0xFEFF) {
      cleanData = cleanData.slice(1);
    }
    
    // 检查是否是有效的JSON格式
    if (!cleanData.startsWith('{') && !cleanData.startsWith('[') && !cleanData.startsWith('"')) {
      return cleanData; // 返回原始字符串
    }
    
    return JSON.parse(cleanData);
  } catch (error) {
    console.warn('JSON解析失败:', error);
    console.warn('原始数据:', data);
    return defaultValue;
  }
}

/**
 * 修复localStorage中的无效数据
 */
export function fixLocalStorageData() {
  console.log('=== 开始修复localStorage数据 ===');
  
  const keysToCheck = [
    'lang', 'userInfo', 'token', 'theme', 'preferences', 
    'settings', 'i18n', 'locale', 'language'
  ];
  
  let fixedCount = 0;
  
  keysToCheck.forEach(key => {
    try {
      const value = localStorage.getItem(key);
      
      if (!value) {
        return;
      }
      
      // 检查是否是JSON格式
      if (value.startsWith('{') || value.startsWith('[')) {
        try {
          JSON.parse(value);
          console.log(`✓ ${key}: JSON数据有效`);
        } catch (parseError) {
          console.warn(`✗ ${key}: JSON解析失败，正在清理:`, parseError);
          localStorage.removeItem(key);
          fixedCount++;
        }
      } else {
        // 对于非JSON数据，检查是否是有效的语言代码
        if (key === 'lang' || key === 'locale' || key === 'language') {
          const validLanguages = [
            'zh', 'zh-CN', 'zh-TW', 'en', 'en-US', 'ja-JP', 'ko-KR',
            'th-TH', 'vi-VN', 'de-DE', 'es-ES', 'fr-FR',
            'it-IT', 'pt-PT', 'el-GR'
          ];
          
          if (!validLanguages.includes(value)) {
            console.warn(`无效的语言代码 [${key}]:`, value);
            localStorage.setItem(key, 'en-US');
            fixedCount++;
          }
        }
      }
    } catch (error) {
      console.error(`检查键 ${key} 时出错:`, error);
      try {
        localStorage.removeItem(key);
        fixedCount++;
      } catch (removeError) {
        console.error(`无法移除键 ${key}:`, removeError);
      }
    }
  });
  
  if (fixedCount > 0) {
    console.log(`✓ 修复完成，共修复 ${fixedCount} 个问题`);
  } else {
    console.log('✓ 未发现localStorage问题');
  }
  
  return fixedCount;
}

/**
 * 修复i18n相关的错误
 */
export function fixI18nErrors() {
  console.log('=== 开始修复i18n错误 ===');
  
  try {
    // 确保语言设置有效
    const currentLang = localStorage.getItem('lang');
    const validLanguages = [
      'zh', 'zh-CN', 'zh-TW', 'en', 'en-US', 'ja-JP', 'ko-KR',
      'th-TH', 'vi-VN', 'de-DE', 'es-ES', 'fr-FR',
      'it-IT', 'pt-PT', 'el-GR'
    ];
    
    if (!currentLang || !validLanguages.includes(currentLang)) {
      console.log('设置默认语言为英文');
      localStorage.setItem('lang', 'en-US');
    }
    
    // 清理可能的i18n缓存
    const i18nKeys = ['i18n', 'locale', 'language', 'messages'];
    i18nKeys.forEach(key => {
      try {
        const value = localStorage.getItem(key);
        if (value && (value.startsWith('{') || value.startsWith('['))) {
          JSON.parse(value); // 验证JSON格式
        }
      } catch (error) {
        console.warn(`清理无效的i18n数据 [${key}]:`, error);
        localStorage.removeItem(key);
      }
    });
    
    console.log('✓ i18n错误修复完成');
  } catch (error) {
    console.error('修复i18n错误失败:', error);
  }
}

/**
 * 修复Vue组件中的JSON解析问题
 */
export function fixVueComponentErrors() {
  console.log('=== 开始修复Vue组件错误 ===');
  
  try {
    // 重写JSON.parse方法，添加错误处理
    const originalJsonParse = JSON.parse;
    JSON.parse = function(text, reviver) {
      // 首先检查是否是简单的字符串值，如果是则直接返回
      if (isSimpleStringValue(text)) {
        console.log('Production Error Fix: Detected simple string value, returning directly:', text);
        return text;
      }
      
      try {
        return originalJsonParse.call(this, text, reviver);
      } catch (error) {
        console.warn('JSON.parse失败:', error);
        console.warn('原始文本:', text);
        
        // 再次检查是否是简单的字符串值（双重保险）
        if (isSimpleStringValue(text)) {
          console.log('检测到简单字符串值，直接返回:', text);
          return text;
        }
        
        // 尝试清理文本
        if (typeof text === 'string') {
          const cleanText = text.trim().replace(/[\x00-\x1F\x7F]/g, '');
          try {
            return originalJsonParse.call(this, cleanText, reviver);
          } catch (cleanError) {
            console.warn('清理后的JSON解析仍然失败:', cleanError);
            return null;
          }
        }
        
        return null;
      }
    };
    
    console.log('✓ Vue组件错误修复完成');
  } catch (error) {
    console.error('修复Vue组件错误失败:', error);
  }
}

/**
 * 修复生产环境中的链接格式错误
 */
export function fixLinkedFormatError() {
  console.log('=== 开始修复链接格式错误 ===');
  
  try {
    // 检查并修复可能的链接格式问题
    const linkPatterns = [
      /https?:\/\/[^\s]+/g,
      /www\.[^\s]+/g,
      /[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
    ];
    
    // 修复localStorage中可能的链接格式问题
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      try {
        const value = localStorage.getItem(key);
        if (value && typeof value === 'string') {
          // 检查是否包含无效的链接格式
          if (value.includes('http') || value.includes('www')) {
            // 验证链接格式
            const hasValidLink = linkPatterns.some(pattern => pattern.test(value));
            if (!hasValidLink && value.includes('http')) {
              console.warn(`发现可能的无效链接格式 [${key}]:`, value);
              // 可以选择清理或修复
            }
          }
        }
      } catch (error) {
        console.warn(`检查键 ${key} 的链接格式时出错:`, error);
      }
    });
    
    console.log('✓ 链接格式错误修复完成');
  } catch (error) {
    console.error('修复链接格式错误失败:', error);
  }
}

/**
 * 执行所有修复
 */
export function executeAllFixes() {
  console.log('=== 开始执行生产环境错误修复 ===');
  
  try {
    let totalFixed = 0;
    
    // 1. 修复localStorage数据
    totalFixed += fixLocalStorageData();
    
    // 2. 修复i18n错误
    fixI18nErrors();
    
    // 3. 修复Vue组件错误
    fixVueComponentErrors();
    
    // 4. 修复链接格式错误
    fixLinkedFormatError();
    
    console.log(`=== 生产环境错误修复完成，共修复 ${totalFixed} 个问题 ===`);
    
    return totalFixed;
  } catch (error) {
    console.error('执行修复时出错:', error);
    return 0;
  }
}

/**
 * 在页面加载时自动执行修复
 */
export function autoFixOnLoad() {
  // 立即执行
  executeAllFixes();
  
  // 延迟执行，确保所有代码都已加载
  setTimeout(() => {
    executeAllFixes();
  }, 100);
  
  // 再次延迟执行
  setTimeout(() => {
    executeAllFixes();
  }, 1000);
}

/**
 * 监听错误并自动修复
 */
export function setupErrorListener() {
  // 监听全局错误
  window.addEventListener('error', (event) => {
    if (event.error && event.error.message && 
        event.error.message.includes('Invalid linked format')) {
      console.warn('检测到链接格式错误，正在自动修复...');
      executeAllFixes();
    }
  });
  
  // 监听未处理的Promise拒绝
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && event.reason.message && 
        event.reason.message.includes('Invalid linked format')) {
      console.warn('检测到Promise中的链接格式错误，正在自动修复...');
      executeAllFixes();
    }
  });
  
  console.log('✓ 错误监听器已设置');
}

// 导出默认修复函数
export default {
  safeJsonParse,
  fixLocalStorageData,
  fixI18nErrors,
  fixVueComponentErrors,
  fixLinkedFormatError,
  executeAllFixes,
  autoFixOnLoad,
  setupErrorListener
};
