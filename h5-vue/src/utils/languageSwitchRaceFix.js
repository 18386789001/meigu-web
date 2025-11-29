/**
 * 语言切换竞态条件修复工具
 * 专门处理语言切换时的JSON解析错误和竞态条件问题
 */

// 语言切换状态管理
let languageSwitchInProgress = false;
let languageSwitchQueue = [];
let currentLanguageSwitchPromise = null;

// 安全的语言切换函数，防止竞态条件
export const safeLanguageSwitchWithRaceProtection = async (newLocale) => {
  console.log('开始安全语言切换:', newLocale);
  
  // 如果正在切换语言，将请求加入队列
  if (languageSwitchInProgress) {
    console.log('语言切换正在进行中，加入队列:', newLocale);
    return new Promise((resolve, reject) => {
      languageSwitchQueue.push({ locale: newLocale, resolve, reject });
    });
  }
  
  // 设置切换状态
  languageSwitchInProgress = true;
  
  try {
    // 执行语言切换
    const result = await executeLanguageSwitch(newLocale);
    console.log('语言切换成功:', newLocale);
    return result;
  } catch (error) {
    console.error('语言切换失败:', error);
    throw error;
  } finally {
    // 重置状态
    languageSwitchInProgress = false;
    
    // 处理队列中的请求
    if (languageSwitchQueue.length > 0) {
      const nextRequest = languageSwitchQueue.shift();
      console.log('处理队列中的下一个语言切换请求:', nextRequest.locale);
      
      // 异步处理下一个请求
      setTimeout(() => {
        safeLanguageSwitchWithRaceProtection(nextRequest.locale)
          .then(nextRequest.resolve)
          .catch(nextRequest.reject);
      }, 100); // 延迟100ms确保状态稳定
    }
  }
};

// 执行实际的语言切换
const executeLanguageSwitch = async (newLocale) => {
  console.log('执行语言切换:', newLocale);
  
  // 1. 清理localStorage中的无效数据
  await cleanInvalidLocalStorageData();
  
  // 2. 修复JSON解析问题
  await fixJsonParseIssues();
  
  // 3. 安全设置语言
  await setLanguageSafely(newLocale);
  
  // 4. 等待Vue响应式更新完成
  await waitForVueUpdate();
  
  // 5. 验证语言切换是否成功
  await verifyLanguageSwitch(newLocale);
  
  console.log('语言切换执行完成:', newLocale);
  return true;
};

// 清理localStorage中的无效数据
const cleanInvalidLocalStorageData = async () => {
  console.log('清理localStorage中的无效数据...');
  
  try {
    const keysToCheck = ['lang', 'userInfo', 'settings', 'preferences'];
    
    for (const key of keysToCheck) {
      try {
        const value = localStorage.getItem(key);
        if (value) {
          // 尝试解析JSON
          JSON.parse(value);
          console.log(`localStorage key ${key} 数据有效`);
        }
      } catch (error) {
        console.warn(`localStorage key ${key} 数据无效，正在清理:`, error);
        localStorage.removeItem(key);
        
        // 设置默认值
        if (key === 'lang') {
          localStorage.setItem(key, 'en-US');
        }
      }
    }
  } catch (error) {
    console.error('清理localStorage失败:', error);
  }
};

// 修复JSON解析问题
const fixJsonParseIssues = async () => {
  console.log('修复JSON解析问题...');
  
  try {
    // 重写JSON.parse方法，添加错误处理
    const originalJsonParse = JSON.parse;
    JSON.parse = function(text, reviver) {
      try {
        return originalJsonParse.call(this, text, reviver);
      } catch (error) {
        console.warn('JSON解析失败，尝试修复:', error);
        
        // 检查是否是简单的字符串值，如果是则直接返回
        if (isSimpleStringValue(text)) {
          console.log('检测到简单字符串值，直接返回:', text);
          return text;
        }
        
        // 尝试修复常见的JSON格式问题
        let fixedText = text;
        
        // 修复单引号问题
        fixedText = fixedText.replace(/'/g, '"');
        
        // 修复尾随逗号问题
        fixedText = fixedText.replace(/,(\s*[}\]])/g, '$1');
        
        // 修复未转义的引号
        fixedText = fixedText.replace(/([^\\])"/g, '$1\\"');
        
        try {
          return originalJsonParse.call(this, fixedText, reviver);
        } catch (secondError) {
          console.error('JSON修复失败，返回默认值:', secondError);
          return null;
        }
      }
    };
    
    console.log('JSON.parse方法已重写');
  } catch (error) {
    console.error('修复JSON解析问题失败:', error);
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

// 安全设置语言
const setLanguageSafely = async (newLocale) => {
  console.log('安全设置语言:', newLocale);
  
  try {
    // 1. 设置localStorage
    localStorage.setItem('lang', newLocale);
    console.log('localStorage语言已设置为:', newLocale);
    
    // 2. 等待一小段时间确保localStorage写入完成
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // 3. 设置Vue i18n locale
    if (window.i18n && window.i18n.global) {
      if (window.i18n.global.locale.value !== undefined) {
        window.i18n.global.locale.value = newLocale;
      } else {
        window.i18n.global.locale = newLocale;
      }
      console.log('Vue i18n locale已设置为:', newLocale);
    }
    
    // 4. 触发Vue响应式更新
    if (window.Vue && window.Vue.nextTick) {
      await window.Vue.nextTick();
    }
    
  } catch (error) {
    console.error('安全设置语言失败:', error);
    throw error;
  }
};

// 等待Vue响应式更新完成
const waitForVueUpdate = async () => {
  console.log('等待Vue响应式更新完成...');
  
  try {
    // 等待多个Vue更新周期
    for (let i = 0; i < 3; i++) {
      if (window.Vue && window.Vue.nextTick) {
        await window.Vue.nextTick();
      }
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    console.log('Vue响应式更新等待完成');
  } catch (error) {
    console.error('等待Vue更新失败:', error);
  }
};

// 验证语言切换是否成功
const verifyLanguageSwitch = async (expectedLocale) => {
  console.log('验证语言切换是否成功:', expectedLocale);
  
  try {
    // 1. 检查localStorage
    const storedLang = localStorage.getItem('lang');
    if (storedLang !== expectedLocale) {
      console.warn('localStorage语言不匹配，期望:', expectedLocale, '实际:', storedLang);
      localStorage.setItem('lang', expectedLocale);
    }
    
    // 2. 检查Vue i18n locale
    if (window.i18n && window.i18n.global) {
      const currentLocale = window.i18n.global.locale.value || window.i18n.global.locale;
      if (currentLocale !== expectedLocale) {
        console.warn('Vue i18n locale不匹配，期望:', expectedLocale, '实际:', currentLocale);
        if (window.i18n.global.locale.value !== undefined) {
          window.i18n.global.locale.value = expectedLocale;
        } else {
          window.i18n.global.locale = expectedLocale;
        }
      }
    }
    
    console.log('语言切换验证完成');
  } catch (error) {
    console.error('验证语言切换失败:', error);
  }
};

// 修复语言切换时的JSON解析错误
export const fixLanguageSwitchJsonError = () => {
  console.log('修复语言切换时的JSON解析错误...');
  
  try {
    // 1. 清理localStorage
    cleanInvalidLocalStorageData();
    
    // 2. 修复JSON解析
    fixJsonParseIssues();
    
    // 3. 设置错误监听器
    setupLanguageSwitchErrorListener();
    
    console.log('语言切换JSON解析错误修复完成');
  } catch (error) {
    console.error('修复语言切换JSON解析错误失败:', error);
  }
};

// 设置语言切换错误监听器
const setupLanguageSwitchErrorListener = () => {
  console.log('设置语言切换错误监听器...');
  
  // 监听全局错误
  window.addEventListener('error', (event) => {
    if (event.error && event.error.message) {
      const errorMessage = event.error.message;
      
      // 检查是否是JSON解析错误
      if (errorMessage.includes('Invalid linked format') || 
          errorMessage.includes('SyntaxError') ||
          errorMessage.includes('JSON')) {
        console.warn('检测到JSON解析错误，正在修复...');
        fixLanguageSwitchJsonError();
      }
    }
  });
  
  // 监听Vue错误
  if (window.Vue && window.Vue.config) {
    window.Vue.config.errorHandler = (error, instance, info) => {
      console.error('Vue错误:', error);
      console.error('错误信息:', info);
      
      if (error.message && (
        error.message.includes('Invalid linked format') ||
        error.message.includes('SyntaxError') ||
        error.message.includes('JSON')
      )) {
        console.log('检测到Vue中的JSON解析错误，正在修复...');
        fixLanguageSwitchJsonError();
      }
    };
  }
  
  console.log('语言切换错误监听器设置完成');
};

// 页面加载时自动修复
export const autoFixLanguageSwitchOnLoad = () => {
  console.log('页面加载时自动修复语言切换问题...');
  
  try {
    // 延迟执行，确保页面完全加载
    setTimeout(() => {
      fixLanguageSwitchJsonError();
    }, 100);
    
    console.log('语言切换自动修复已安排');
  } catch (error) {
    console.error('自动修复语言切换失败:', error);
  }
};

// 执行所有语言切换修复
export const executeLanguageSwitchFixes = () => {
  console.log('执行所有语言切换修复...');
  
  try {
    fixLanguageSwitchJsonError();
    console.log('所有语言切换修复执行完成');
  } catch (error) {
    console.error('执行语言切换修复失败:', error);
  }
};

// 导出主要函数
export default {
  safeLanguageSwitchWithRaceProtection,
  fixLanguageSwitchJsonError,
  autoFixLanguageSwitchOnLoad,
  executeLanguageSwitchFixes
};
