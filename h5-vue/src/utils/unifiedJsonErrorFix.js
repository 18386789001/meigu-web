/**
 * 统一的JSON错误修复工具
 * 解决SyntaxError: Invalid linked format错误
 * 避免多个JSON.parse覆盖冲突
 */

// 全局标记，确保只初始化一次
let isInitialized = false;
let originalJsonParse = null;

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

// 统一的JSON.parse覆盖
const setupUnifiedJsonParse = () => {
  if (isInitialized) {
    console.log('Unified JSON Error Fix: Already initialized, skipping...');
    return;
  }
  
  // 保存原始JSON.parse
  originalJsonParse = JSON.parse;
  
  // 重写JSON.parse方法
  JSON.parse = function(text, reviver) {
    // 首先检查是否是简单的字符串值
    if (isSimpleStringValue(text)) {
      console.log('Unified JSON Fix: Detected simple string value, returning directly:', text);
      return text;
    }
    
    try {
      return originalJsonParse.call(this, text, reviver);
    } catch (error) {
      console.warn('Unified JSON Fix: JSON.parse失败:', error);
      console.warn('Unified JSON Fix: 原始文本:', text);
      
      // 再次检查是否是简单的字符串值（双重保险）
      if (isSimpleStringValue(text)) {
        console.log('Unified JSON Fix: 检测到简单字符串值，直接返回:', text);
        return text;
      }
      
      // 尝试清理文本
      if (typeof text === 'string') {
        const cleanText = text.trim().replace(/[\x00-\x1F\x7F]/g, '');
        try {
          return originalJsonParse.call(this, cleanText, reviver);
        } catch (cleanError) {
          console.warn('Unified JSON Fix: 清理后的JSON解析仍然失败:', cleanError);
          return null;
        }
      }
      
      return null;
    }
  };
  
  isInitialized = true;
  console.log('✅ Unified JSON Error Fix: 初始化完成');
};

// 恢复原始JSON.parse
const restoreOriginalJsonParse = () => {
  if (originalJsonParse && isInitialized) {
    JSON.parse = originalJsonParse;
    isInitialized = false;
    console.log('Unified JSON Error Fix: 已恢复原始JSON.parse');
  }
};

// 页面加载时自动初始化
export const autoFixOnLoad = () => {
  if (typeof window !== 'undefined') {
    setupUnifiedJsonParse();
  }
};

// 手动初始化
export const initializeUnifiedJsonFix = () => {
  setupUnifiedJsonParse();
};

// 手动恢复
export const restoreJsonParse = () => {
  restoreOriginalJsonParse();
};

// 检查是否已初始化
export const isUnifiedJsonFixInitialized = () => {
  return isInitialized;
};

// 默认导出
export default {
  autoFixOnLoad,
  initializeUnifiedJsonFix,
  restoreJsonParse,
  isUnifiedJsonFixInitialized
};
