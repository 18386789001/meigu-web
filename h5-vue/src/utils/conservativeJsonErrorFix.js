/**
 * 保守的JSON解析错误处理工具
 * 只处理真正的JSON解析错误，不干扰正常的字符串处理
 */

// 原始JSON.parse方法的引用
const originalJsonParse = JSON.parse;

// 错误统计
let jsonParseErrorCount = 0;
let lastErrorTime = 0;

// 保守的JSON解析函数
export const conservativeJsonParse = (text, reviver) => {
  // 首先检查是否是简单的字符串值，如果是则直接返回，不进行JSON解析
  if (isSimpleStringValue(text)) {
    console.log('Conservative JSON Parse: Detected simple string value, returning directly:', text);
    return text;
  }
  
  try {
    // 首先尝试原始解析
    return originalJsonParse.call(this, text, reviver);
  } catch (error) {
    jsonParseErrorCount++;
    lastErrorTime = Date.now();
    
    console.warn(`JSON解析失败 (第${jsonParseErrorCount}次):`, error);
    console.warn('原始文本:', text);
    
    // 再次检查是否是简单的字符串值（双重保险）
    if (isSimpleStringValue(text)) {
      console.log('检测到简单字符串值，直接返回:', text);
      return text;
    }
    
    // 检查是否是真正的JSON格式错误
    if (isRealJsonError(text, error)) {
      console.log('检测到真正的JSON格式错误，尝试修复...');
      const fixedText = tryFixRealJsonError(text);
      
      if (fixedText !== text) {
        try {
          return originalJsonParse.call(this, fixedText, reviver);
        } catch (secondError) {
          console.warn('修复后仍然解析失败:', secondError);
        }
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

// 检查是否是真正的JSON格式错误
const isRealJsonError = (text, error) => {
  if (typeof text !== 'string') {
    return false;
  }
  
  const trimmed = text.trim();
  
  // 检查是否看起来像JSON（以 { 或 [ 开头）
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
    return false;
  }
  
  // 检查错误类型
  const errorMessage = error.message || '';
  return errorMessage.includes('Unexpected token') || 
         errorMessage.includes('Invalid') ||
         errorMessage.includes('SyntaxError');
};

// 尝试修复真正的JSON错误
const tryFixRealJsonError = (text) => {
  let fixed = text;
  
  // 只修复明显的JSON格式问题
  // 1. 修复单引号（只在看起来像JSON的情况下）
  if (fixed.includes("'") && (fixed.includes('{') || fixed.includes('['))) {
    fixed = fixed.replace(/'/g, '"');
  }
  
  // 2. 修复尾随逗号
  fixed = fixed.replace(/,(\s*[}\]])/g, '$1');
  
  // 3. 修复缺少引号的键（只在对象中）
  if (fixed.includes('{')) {
    fixed = fixed.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":');
  }
  
  return fixed;
};

// 获取安全的默认值
const getSafeDefaultValue = (text) => {
  if (typeof text !== 'string') {
    return null;
  }
  
  const trimmed = text.trim();
  
  // 根据文本内容尝试推断应该返回什么类型的默认值
  if (trimmed.startsWith('{')) {
    return {};
  } else if (trimmed.startsWith('[')) {
    return [];
  } else if (trimmed.startsWith('"')) {
    return '';
  } else if (trimmed === 'true') {
    return true;
  } else if (trimmed === 'false') {
    return false;
  } else if (trimmed === 'null') {
    return null;
  } else if (!isNaN(trimmed)) {
    return parseFloat(trimmed);
  } else {
    return null;
  }
};

// 重写JSON.parse方法（保守模式）
export const overrideJsonParseConservative = () => {
  console.log('重写JSON.parse方法（保守模式）...');
  
  try {
    JSON.parse = conservativeJsonParse;
    console.log('JSON.parse方法已重写（保守模式）');
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

// 设置保守的错误监听器
export const setupConservativeErrorListener = () => {
  console.log('设置保守的错误监听器...');
  
  // 监听全局错误
  window.addEventListener('error', (event) => {
    if (event.error && event.error.message) {
      const errorMessage = event.error.message;
      
      // 只处理真正的JSON解析错误
      if (errorMessage.includes('Invalid linked format') || 
          (errorMessage.includes('SyntaxError') && errorMessage.includes('JSON'))) {
        
        console.warn('检测到JSON解析错误，正在应用保守修复...');
        
        // 应用保守修复
        applyConservativeJsonFix();
        
        // 重写JSON.parse方法
        overrideJsonParseConservative();
      }
    }
  });
  
  console.log('保守错误监听器设置完成');
};

// 应用保守的JSON修复
export const applyConservativeJsonFix = () => {
  console.log('应用保守的JSON修复...');
  
  try {
    // 1. 清理localStorage中的无效JSON数据
    cleanLocalStorageConservative();
    
    // 2. 重写JSON.parse方法
    overrideJsonParseConservative();
    
    console.log('保守JSON修复应用完成');
  } catch (error) {
    console.error('应用保守JSON修复失败:', error);
  }
};

// 保守地清理localStorage
const cleanLocalStorageConservative = () => {
  console.log('保守地清理localStorage...');
  
  try {
    const keysToCheck = ['lang', 'userInfo', 'settings', 'preferences'];
    
    for (const key of keysToCheck) {
      try {
        const value = localStorage.getItem(key);
        if (value) {
          // 只检查看起来像JSON的数据
          if (value.trim().startsWith('{') || value.trim().startsWith('[')) {
            conservativeJsonParse(value);
            console.log(`localStorage key ${key} JSON数据有效`);
          } else {
            console.log(`localStorage key ${key} 不是JSON格式，跳过检查`);
          }
        }
      } catch (error) {
        console.warn(`localStorage key ${key} 数据无效，正在清理:`, error);
        localStorage.removeItem(key);
        
        // 设置安全的默认值
        if (key === 'lang') {
          localStorage.setItem(key, 'en-US');
        }
      }
    }
  } catch (error) {
    console.error('保守清理localStorage失败:', error);
  }
};

// 页面加载时自动应用保守修复
export const autoFixConservativeJsonOnLoad = () => {
  console.log('页面加载时自动应用保守JSON修复...');
  
  try {
    // 延迟执行，确保页面完全加载
    setTimeout(() => {
      applyConservativeJsonFix();
      setupConservativeErrorListener();
    }, 200);
    
    console.log('保守JSON自动修复已安排');
  } catch (error) {
    console.error('自动应用保守JSON修复失败:', error);
  }
};

// 执行所有保守JSON修复
export const executeConservativeJsonFixes = () => {
  console.log('执行所有保守JSON修复...');
  
  try {
    applyConservativeJsonFix();
    setupConservativeErrorListener();
    console.log('所有保守JSON修复执行完成');
  } catch (error) {
    console.error('执行保守JSON修复失败:', error);
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
  conservativeJsonParse,
  overrideJsonParseConservative,
  restoreJsonParse,
  setupConservativeErrorListener,
  applyConservativeJsonFix,
  autoFixConservativeJsonOnLoad,
  executeConservativeJsonFixes,
  getJsonErrorStats
};
