/**
 * 增强的错误处理机制
 * 专门处理JSON解析错误和语言切换问题
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
 * 增强的JSON解析函数
 */
export function enhancedJsonParse(data, defaultValue = null) {
  if (!data || typeof data !== 'string') {
    return defaultValue;
  }

  try {
    // 1. 清理数据
    let cleanData = data.trim();
    
    // 2. 移除BOM标记
    if (cleanData.charCodeAt(0) === 0xFEFF) {
      cleanData = cleanData.slice(1);
    }
    
    // 3. 移除控制字符
    cleanData = cleanData.replace(/[\x00-\x1F\x7F]/g, '');
    
    // 4. 检查是否是有效的JSON格式
    if (!cleanData.startsWith('{') && !cleanData.startsWith('[') && !cleanData.startsWith('"')) {
      return cleanData; // 返回原始字符串
    }
    
    // 5. 尝试解析JSON
    return JSON.parse(cleanData);
  } catch (error) {
    console.warn('增强JSON解析失败:', error);
    console.warn('原始数据:', data);
    
    // 6. 尝试修复常见的JSON问题
    try {
      // 修复常见的JSON格式问题
      let fixedData = data
        .replace(/,\s*}/g, '}')  // 移除尾随逗号
        .replace(/,\s*]/g, ']')  // 移除尾随逗号
        .replace(/'/g, '"')      // 替换单引号为双引号
        .replace(/(\w+):/g, '"$1":'); // 为键添加引号
      
      return JSON.parse(fixedData);
    } catch (fixError) {
      console.warn('JSON修复也失败:', fixError);
      return defaultValue;
    }
  }
}

/**
 * 增强的localStorage包装器
 */
export function createEnhancedLocalStorage() {
  return {
    getItem: (key) => {
      try {
        const value = localStorage.getItem(key);
        return enhancedJsonParse(value, value);
      } catch (error) {
        console.error(`获取localStorage项失败 [${key}]:`, error);
        return null;
      }
    },
    
    setItem: (key, value) => {
      try {
        if (typeof value === 'object' && value !== null) {
          localStorage.setItem(key, JSON.stringify(value));
        } else {
          localStorage.setItem(key, value);
        }
        return true;
      } catch (error) {
        console.error(`设置localStorage项失败 [${key}]:`, error);
        return false;
      }
    },
    
    removeItem: (key) => {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (error) {
        console.error(`移除localStorage项失败 [${key}]:`, error);
        return false;
      }
    },
    
    clear: () => {
      try {
        localStorage.clear();
        return true;
      } catch (error) {
        console.error('清空localStorage失败:', error);
        return false;
      }
    }
  };
}

/**
 * 增强的错误监听器
 */
export function setupEnhancedErrorListener() {
  console.log('=== 设置增强错误监听器 ===');
  
  try {
    // 1. 监听全局错误
    window.addEventListener('error', (event) => {
      const error = event.error;
      const message = error ? error.message : event.message;
      
      console.error('全局错误:', message);
      
      // 检查是否是JSON解析错误
      if (message && (
        message.includes('Invalid linked format') ||
        message.includes('SyntaxError') ||
        message.includes('JSON') ||
        message.includes('Unexpected token')
      )) {
        console.warn('检测到JSON解析错误，正在修复...');
        
        // 执行修复
        setTimeout(() => {
          fixAllJsonParseIssues();
        }, 100);
      }
    });
    
    // 2. 监听未处理的Promise拒绝
    window.addEventListener('unhandledrejection', (event) => {
      const reason = event.reason;
      const message = reason ? reason.message : String(reason);
      
      console.error('未处理的Promise拒绝:', message);
      
      // 检查是否是JSON解析错误
      if (message && (
        message.includes('Invalid linked format') ||
        message.includes('SyntaxError') ||
        message.includes('JSON') ||
        message.includes('Unexpected token')
      )) {
        console.warn('检测到Promise中的JSON解析错误，正在修复...');
        
        // 执行修复
        setTimeout(() => {
          fixAllJsonParseIssues();
        }, 100);
      }
    });
    
    // 3. 监听语言切换事件
    window.addEventListener('languageChanged', (event) => {
      console.log('检测到语言切换事件:', event.detail);
      
      // 延迟执行修复
      setTimeout(() => {
        fixAllJsonParseIssues();
      }, 200);
    });
    
    console.log('✓ 增强错误监听器已设置');
  } catch (error) {
    console.error('设置增强错误监听器失败:', error);
  }
}

/**
 * 修复所有JSON解析问题
 */
export function fixAllJsonParseIssues() {
  console.log('=== 开始修复所有JSON解析问题 ===');
  
  try {
    let fixedCount = 0;
    
    // 1. 修复localStorage中的JSON问题
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      try {
        const value = localStorage.getItem(key);
        
        if (!value) {
          return;
        }
        
        // 检查是否是JSON格式
        if (value.startsWith('{') || value.startsWith('[')) {
          try {
            enhancedJsonParse(value);
            console.log(`✓ ${key}: JSON数据有效`);
          } catch (parseError) {
            console.warn(`✗ ${key}: JSON解析失败，正在清理:`, parseError);
            localStorage.removeItem(key);
            fixedCount++;
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
    
    // 2. 修复语言相关的问题
    const langKeys = ['lang', 'locale', 'language'];
    langKeys.forEach(key => {
      try {
        const value = localStorage.getItem(key);
        
        if (value) {
          // 验证语言代码
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
      } catch (error) {
        console.error(`检查语言键 ${key} 时出错:`, error);
      }
    });
    
    if (fixedCount > 0) {
      console.log(`✓ 修复完成，共修复 ${fixedCount} 个问题`);
    } else {
      console.log('✓ 未发现JSON解析问题');
    }
    
    return fixedCount;
  } catch (error) {
    console.error('修复JSON解析问题失败:', error);
    return 0;
  }
}

/**
 * 重写JSON.parse方法
 */
export function overrideJsonParse() {
  console.log('=== 重写JSON.parse方法 ===');
  
  try {
    const originalJsonParse = JSON.parse;
    
    JSON.parse = function(text, reviver) {
      // 首先检查是否是简单的字符串值，如果是则直接返回
      if (isSimpleStringValue(text)) {
        console.log('Enhanced Error Handling: Detected simple string value, returning directly:', text);
        return text;
      }
      
      try {
        return originalJsonParse.call(this, text, reviver);
      } catch (error) {
        console.warn('JSON.parse失败，尝试修复:', error);
        console.warn('原始文本:', text);
        
        // 再次检查是否是简单的字符串值（双重保险）
        if (isSimpleStringValue(text)) {
          console.log('检测到简单字符串值，直接返回:', text);
          return text;
        }
        
        // 使用增强的JSON解析
        const result = enhancedJsonParse(text);
        if (result !== null) {
          return result;
        }
        
        // 如果修复失败，返回null
        console.error('JSON解析修复失败');
        return null;
      }
    };
    
    console.log('✓ JSON.parse方法已重写');
  } catch (error) {
    console.error('重写JSON.parse方法失败:', error);
  }
}

/**
 * 执行所有增强的错误处理
 */
export function executeEnhancedErrorHandling() {
  console.log('=== 开始执行增强错误处理 ===');
  
  try {
    // 1. 重写JSON.parse方法
    overrideJsonParse();
    
    // 2. 修复所有JSON解析问题
    fixAllJsonParseIssues();
    
    // 3. 设置增强错误监听器
    setupEnhancedErrorListener();
    
    console.log('=== 增强错误处理完成 ===');
    
    return true;
  } catch (error) {
    console.error('执行增强错误处理时出错:', error);
    return false;
  }
}

/**
 * 在页面加载时自动执行增强错误处理
 */
export function autoFixEnhancedErrorsOnLoad() {
  // 立即执行
  executeEnhancedErrorHandling();
  
  // 延迟执行，确保所有代码都已加载
  setTimeout(() => {
    executeEnhancedErrorHandling();
  }, 100);
  
  // 再次延迟执行
  setTimeout(() => {
    executeEnhancedErrorHandling();
  }, 1000);
}

// 导出默认修复函数
export default {
  enhancedJsonParse,
  createEnhancedLocalStorage,
  setupEnhancedErrorListener,
  fixAllJsonParseIssues,
  overrideJsonParse,
  executeEnhancedErrorHandling,
  autoFixEnhancedErrorsOnLoad
};
