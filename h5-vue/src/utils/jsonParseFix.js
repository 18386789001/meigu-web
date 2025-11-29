/**
 * JSON解析错误修复工具
 * 专门处理生产环境中的localStorage JSON解析错误
 */

/**
 * 安全解析localStorage中的JSON数据
 * @param {string} key - 存储键
 * @param {*} defaultValue - 默认值
 * @returns {*} 解析后的数据或默认值
 */
export function safeParseStorage(key, defaultValue = null) {
  try {
    const value = localStorage.getItem(key);
    
    if (!value) {
      return defaultValue;
    }
    
    // 如果值不是JSON格式（不以{或[开头），直接返回
    if (typeof value === 'string' && !value.startsWith('{') && !value.startsWith('[')) {
      return value;
    }
    
    // 尝试解析JSON
    try {
      return JSON.parse(value);
    } catch (parseError) {
      console.warn(`JSON解析失败 [${key}]:`, parseError);
      console.warn(`原始数据:`, value);
      
      // 清理无效数据
      localStorage.removeItem(key);
      return defaultValue;
    }
  } catch (error) {
    console.error(`获取localStorage数据失败 [${key}]:`, error);
    return defaultValue;
  }
}

/**
 * 安全设置localStorage数据
 * @param {string} key - 存储键
 * @param {*} value - 要存储的值
 * @returns {boolean} 是否成功
 */
export function safeSetStorage(key, value) {
  try {
    if (typeof value === 'object' && value !== null) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, value);
    }
    return true;
  } catch (error) {
    console.error(`设置localStorage数据失败 [${key}]:`, error);
    return false;
  }
}

/**
 * 修复所有localStorage中的JSON解析问题
 */
export function fixAllJsonParseIssues() {
  console.log('=== 开始修复localStorage JSON解析问题 ===');
  
  const keysToCheck = ['lang', 'userInfo', 'token', 'theme', 'preferences', 'settings'];
  let fixedCount = 0;
  
  keysToCheck.forEach(key => {
    try {
      const value = localStorage.getItem(key);
      
      if (!value) {
        return;
      }
      
      // 检查是否是纯字符串（如语言代码）
      if (typeof value === 'string' && !value.startsWith('{') && !value.startsWith('[')) {
        // 对于语言代码，验证是否有效
        if (key === 'lang') {
          const validLanguages = [
            'zh-CN', 'zh-TW', 'en-US', 'ja-JP', 'ko-KR', 
            'th-TH', 'vi-VN', 'de-DE', 'es-ES', 'fr-FR', 
            'it-IT', 'pt-PT', 'el-GR', 'zh', 'en'
          ];
          
          if (!validLanguages.includes(value)) {
            console.warn(`无效的语言代码 [${key}]:`, value);
            localStorage.setItem(key, 'zh-CN');
            fixedCount++;
          }
        }
        return;
      }
      
      // 尝试解析JSON
      try {
        JSON.parse(value);
        console.log(`✓ ${key}: JSON数据有效`);
      } catch (parseError) {
        console.warn(`✗ ${key}: JSON解析失败，正在清理:`, parseError);
        console.warn(`原始数据:`, value);
        localStorage.removeItem(key);
        fixedCount++;
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
    console.log('✓ 未发现JSON解析问题');
  }
  
  return fixedCount;
}

/**
 * 创建安全的localStorage包装器
 */
export function createSafeLocalStorage() {
  return {
    getItem: safeParseStorage,
    setItem: safeSetStorage,
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
 * 在页面加载时自动修复
 */
export function autoFixOnPageLoad() {
  // 立即执行修复
  fixAllJsonParseIssues();
  
  // 延迟执行，确保所有代码都已加载
  setTimeout(() => {
    fixAllJsonParseIssues();
  }, 100);
  
  // 再次延迟执行，确保完全修复
  setTimeout(() => {
    fixAllJsonParseIssues();
  }, 1000);
}

/**
 * 监听localStorage变化，自动修复问题
 */
export function watchLocalStorageChanges() {
  // 重写localStorage的setItem方法
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function(key, value) {
    try {
      // 检查值是否会导致JSON解析问题
      if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
        try {
          JSON.parse(value);
        } catch (error) {
          console.warn(`检测到可能导致JSON解析问题的数据 [${key}]:`, value);
          console.warn('建议使用safeSetStorage函数');
        }
      }
      
      originalSetItem.call(this, key, value);
    } catch (error) {
      console.error(`设置localStorage失败 [${key}]:`, error);
    }
  };
  
  console.log('✓ localStorage监控已启用');
}
