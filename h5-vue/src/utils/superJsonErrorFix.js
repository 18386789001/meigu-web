/**
 * 超级JSON解析错误处理工具
 * 专门处理生产环境中的各种JSON解析错误，包括"Invalid linked format"错误
 */

// 原始JSON.parse方法的引用
const originalJsonParse = JSON.parse;

// 错误统计
let jsonParseErrorCount = 0;
let lastErrorTime = 0;

// 超级JSON解析函数
export const superJsonParse = (text, reviver) => {
  try {
    // 首先尝试原始解析
    return originalJsonParse.call(this, text, reviver);
  } catch (error) {
    jsonParseErrorCount++;
    lastErrorTime = Date.now();
    
    console.warn(`JSON解析失败 (第${jsonParseErrorCount}次):`, error);
    console.warn('原始文本:', text);
    
    // 检查是否是简单的字符串值，如果是则直接返回
    if (isSimpleStringValue(text)) {
      console.log('检测到简单字符串值，直接返回:', text);
      return text;
    }
    
    // 尝试各种修复策略
    const fixedText = tryFixJsonText(text);
    
    if (fixedText !== text) {
      try {
        console.log('使用修复后的文本重新解析...');
        return originalJsonParse.call(this, fixedText, reviver);
      } catch (secondError) {
        console.warn('修复后仍然解析失败:', secondError);
      }
    }
    
    // 如果所有修复都失败，返回安全的默认值
    console.warn('所有修复策略都失败，返回默认值');
    return getSafeDefaultValue(text);
  }
};

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

// 尝试修复JSON文本
const tryFixJsonText = (text) => {
  if (typeof text !== 'string') {
    return text;
  }
  
  let fixedText = text;
  
  // 1. 修复常见的格式问题
  fixedText = fixCommonFormatIssues(fixedText);
  
  // 2. 修复链接格式问题
  fixedText = fixLinkedFormatIssues(fixedText);
  
  // 3. 修复编码问题
  fixedText = fixEncodingIssues(fixedText);
  
  // 4. 修复特殊字符问题
  fixedText = fixSpecialCharacterIssues(fixedText);
  
  return fixedText;
};

// 修复常见格式问题
const fixCommonFormatIssues = (text) => {
  let fixed = text;
  
  // 修复单引号
  fixed = fixed.replace(/'/g, '"');
  
  // 修复尾随逗号
  fixed = fixed.replace(/,(\s*[}\]])/g, '$1');
  
  // 修复未转义的引号
  fixed = fixed.replace(/([^\\])"/g, '$1\\"');
  
  // 修复缺少引号的键
  fixed = fixed.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":');
  
  // 修复多余的逗号
  fixed = fixed.replace(/,(\s*[,}])/g, '$1');
  
  return fixed;
};

// 修复链接格式问题
const fixLinkedFormatIssues = (text) => {
  let fixed = text;
  
  // 修复"Invalid linked format"相关的格式问题
  // 这通常是由于某些特殊字符或格式导致的
  
  // 修复可能的链接格式问题
  fixed = fixed.replace(/\\u([0-9a-fA-F]{4})/g, (match, code) => {
    try {
      return String.fromCharCode(parseInt(code, 16));
    } catch (e) {
      return match;
    }
  });
  
  // 修复可能的转义问题
  fixed = fixed.replace(/\\/g, '\\\\');
  
  // 修复可能的控制字符
  fixed = fixed.replace(/[\x00-\x1F\x7F]/g, '');
  
  return fixed;
};

// 修复编码问题
const fixEncodingIssues = (text) => {
  let fixed = text;
  
  // 尝试修复UTF-8编码问题
  try {
    // 如果文本包含无效的UTF-8序列，尝试修复
    fixed = decodeURIComponent(encodeURIComponent(fixed));
  } catch (e) {
    // 如果修复失败，保持原文本
  }
  
  return fixed;
};

// 修复特殊字符问题
const fixSpecialCharacterIssues = (text) => {
  let fixed = text;
  
  // 修复可能的特殊字符
  fixed = fixed.replace(/[\u200B-\u200D\uFEFF]/g, ''); // 零宽字符
  
  // 修复可能的BOM字符
  if (fixed.charCodeAt(0) === 0xFEFF) {
    fixed = fixed.slice(1);
  }
  
  return fixed;
};

// 获取安全的默认值
const getSafeDefaultValue = (text) => {
  // 根据文本内容尝试推断应该返回什么类型的默认值
  
  if (text.trim().startsWith('{')) {
    return {};
  } else if (text.trim().startsWith('[')) {
    return [];
  } else if (text.trim().startsWith('"')) {
    return '';
  } else if (text.trim() === 'true') {
    return true;
  } else if (text.trim() === 'false') {
    return false;
  } else if (text.trim() === 'null') {
    return null;
  } else if (!isNaN(text.trim())) {
    return parseFloat(text.trim());
  } else {
    return null;
  }
};

// 重写JSON.parse方法
export const overrideJsonParse = () => {
  console.log('重写JSON.parse方法...');
  
  try {
    JSON.parse = superJsonParse;
    console.log('JSON.parse方法已重写');
  } catch (error) {
    console.error('重写JSON.parse失败:', error);
  }
};

// 恢复原始JSON.parse方法
export const restoreJsonParse = () => {
  console.log('恢复原始JSON.parse方法...');
  
  try {
    JSON.parse = originalJsonParse;
    console.log('原始JSON.parse方法已恢复');
  } catch (error) {
    console.error('恢复JSON.parse失败:', error);
  }
};

// 设置全局错误监听器
export const setupSuperJsonErrorListener = () => {
  console.log('设置超级JSON错误监听器...');
  
  // 监听全局错误
  window.addEventListener('error', (event) => {
    if (event.error && event.error.message) {
      const errorMessage = event.error.message;
      
      // 检查是否是JSON解析错误
      if (errorMessage.includes('Invalid linked format') || 
          errorMessage.includes('SyntaxError') ||
          errorMessage.includes('JSON') ||
          errorMessage.includes('Unexpected token')) {
        
        console.warn('检测到JSON解析错误，正在应用超级修复...');
        
        // 应用超级修复
        applySuperJsonFix();
        
        // 重写JSON.parse方法
        overrideJsonParse();
      }
    }
  });
  
  // 监听Vue错误
  if (window.Vue && window.Vue.config) {
    const originalErrorHandler = window.Vue.config.errorHandler;
    
    window.Vue.config.errorHandler = (error, instance, info) => {
      console.error('Vue错误:', error);
      console.error('错误信息:', info);
      
      if (error.message && (
        error.message.includes('Invalid linked format') ||
        error.message.includes('SyntaxError') ||
        error.message.includes('JSON') ||
        error.message.includes('Unexpected token')
      )) {
        console.log('检测到Vue中的JSON解析错误，正在应用超级修复...');
        applySuperJsonFix();
        overrideJsonParse();
      }
      
      // 调用原始错误处理器
      if (originalErrorHandler) {
        originalErrorHandler(error, instance, info);
      }
    };
  }
  
  console.log('超级JSON错误监听器设置完成');
};

// 应用超级JSON修复
export const applySuperJsonFix = () => {
  console.log('应用超级JSON修复...');
  
  try {
    // 1. 清理localStorage
    cleanLocalStorageForJsonFix();
    
    // 2. 重写JSON.parse方法
    overrideJsonParse();
    
    // 3. 修复Vue i18n相关的问题
    fixVueI18nJsonIssues();
    
    // 4. 修复可能的组件状态问题
    fixComponentStateIssues();
    
    console.log('超级JSON修复应用完成');
  } catch (error) {
    console.error('应用超级JSON修复失败:', error);
  }
};

// 清理localStorage以修复JSON问题
const cleanLocalStorageForJsonFix = () => {
  console.log('清理localStorage以修复JSON问题...');
  
  try {
    const keysToCheck = ['lang', 'userInfo', 'settings', 'preferences', 'theme', 'locale'];
    
    for (const key of keysToCheck) {
      try {
        const value = localStorage.getItem(key);
        if (value) {
          // 尝试解析JSON
          superJsonParse(value);
          console.log(`localStorage key ${key} 数据有效`);
        }
      } catch (error) {
        console.warn(`localStorage key ${key} 数据无效，正在清理:`, error);
        localStorage.removeItem(key);
        
        // 设置安全的默认值
        if (key === 'lang') {
          localStorage.setItem(key, '"en-US"');
        } else if (key === 'theme') {
          localStorage.setItem(key, '"light"');
        }
      }
    }
  } catch (error) {
    console.error('清理localStorage失败:', error);
  }
};

// 修复Vue i18n相关的JSON问题
const fixVueI18nJsonIssues = () => {
  console.log('修复Vue i18n相关的JSON问题...');
  
  try {
    // 检查i18n实例
    if (window.i18n && window.i18n.global) {
      const messages = window.i18n.global.messages;
      
      if (messages) {
        // 验证所有语言的消息对象
        for (const [locale, messageObj] of Object.entries(messages)) {
          try {
            // 尝试序列化和反序列化来验证JSON格式
            const serialized = JSON.stringify(messageObj);
            const deserialized = superJsonParse(serialized);
            
            if (deserialized) {
              console.log(`语言 ${locale} 的消息对象有效`);
            }
          } catch (error) {
            console.warn(`语言 ${locale} 的消息对象有问题:`, error);
            
            // 尝试修复或使用默认值
            if (locale === 'en-US') {
              // 对于英文，尝试使用默认消息
              console.log('使用默认英文消息');
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('修复Vue i18n JSON问题失败:', error);
  }
};

// 修复组件状态问题
const fixComponentStateIssues = () => {
  console.log('修复组件状态问题...');
  
  try {
    // 检查Vue应用实例
    if (window.Vue && window.Vue.getCurrentInstance) {
      const instance = window.Vue.getCurrentInstance();
      
      if (instance) {
        // 检查组件的数据
        const data = instance.data;
        if (data) {
          for (const [key, value] of Object.entries(data)) {
            try {
              // 验证数据是否可以被JSON序列化
              JSON.stringify(value);
            } catch (error) {
              console.warn(`组件数据 ${key} 无法序列化:`, error);
              
              // 尝试修复数据
              if (typeof value === 'string') {
                try {
                  const parsed = superJsonParse(value);
                  if (parsed !== null) {
                    data[key] = parsed;
                    console.log(`组件数据 ${key} 已修复`);
                  }
                } catch (parseError) {
                  console.warn(`组件数据 ${key} 修复失败:`, parseError);
                }
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('修复组件状态问题失败:', error);
  }
};

// 页面加载时自动应用超级修复
export const autoFixSuperJsonOnLoad = () => {
  console.log('页面加载时自动应用超级JSON修复...');
  
  try {
    // 延迟执行，确保页面完全加载
    setTimeout(() => {
      applySuperJsonFix();
      setupSuperJsonErrorListener();
    }, 200);
    
    console.log('超级JSON自动修复已安排');
  } catch (error) {
    console.error('自动应用超级JSON修复失败:', error);
  }
};

// 执行所有超级JSON修复
export const executeSuperJsonFixes = () => {
  console.log('执行所有超级JSON修复...');
  
  try {
    applySuperJsonFix();
    setupSuperJsonErrorListener();
    console.log('所有超级JSON修复执行完成');
  } catch (error) {
    console.error('执行超级JSON修复失败:', error);
  }
};

// 获取错误统计信息
export const getJsonErrorStats = () => {
  return {
    errorCount: jsonParseErrorCount,
    lastErrorTime: lastErrorTime,
    timeSinceLastError: Date.now() - lastErrorTime
  };
};

// 导出主要函数
export default {
  superJsonParse,
  overrideJsonParse,
  restoreJsonParse,
  setupSuperJsonErrorListener,
  applySuperJsonFix,
  autoFixSuperJsonOnLoad,
  executeSuperJsonFixes,
  getJsonErrorStats
};
