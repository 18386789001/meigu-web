/**
 * localStorage 工具函数
 * 用于安全地存储和获取localStorage数据
 */

// 支持的语言代码列表
export const SUPPORTED_LANGUAGES = [
  'zh', 'zh-CN', 'zh-TW', 'en', 'en-US', 'ja-JP', 'ko-KR',
  'th-TH', 'vi-VN', 'de-DE', 'es-ES', 'fr-FR',
  'it-IT', 'pt-PT', 'el-GR'
];

/**
 * 安全地获取localStorage中的值
 * @param {string} key - 存储键
 * @param {*} defaultValue - 默认值
 * @returns {*} 存储的值或默认值
 */
export function safeGetItem(key, defaultValue = null) {
  try {
    const value = localStorage.getItem(key);
    return value !== null ? value : defaultValue;
  } catch (error) {
    console.error(`获取localStorage项失败 [${key}]:`, error);
    return defaultValue;
  }
}

/**
 * 安全地设置localStorage中的值
 * @param {string} key - 存储键
 * @param {*} value - 要存储的值
 * @returns {boolean} 是否成功存储
 */
export function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`设置localStorage项失败 [${key}]:`, error);
    return false;
  }
}

/**
 * 安全地删除localStorage中的值
 * @param {string} key - 存储键
 * @returns {boolean} 是否成功删除
 */
export function safeRemoveItem(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`删除localStorage项失败 [${key}]:`, error);
    return false;
  }
}

/**
 * 验证语言代码是否有效
 * @param {string} langCode - 语言代码
 * @returns {boolean} 是否有效
 */
export function isValidLanguageCode(langCode) {
  return SUPPORTED_LANGUAGES.includes(langCode);
}

/**
 * 获取有效的语言代码
 * @param {string} preferredLang - 首选语言
 * @param {string} fallbackLang - 备用语言
 * @returns {string} 有效的语言代码
 */
export function getValidLanguageCode(preferredLang, fallbackLang = 'en-US') {
  if (isValidLanguageCode(preferredLang)) {
    return preferredLang;
  }
  
  if (isValidLanguageCode(fallbackLang)) {
    return fallbackLang;
  }
  
  return 'en-US';
}

/**
 * 清理localStorage中的无效语言代码
 */
export function cleanupInvalidLanguageCode() {
  const storedLang = safeGetItem('lang');
  
  if (storedLang && !isValidLanguageCode(storedLang)) {
    console.warn('检测到无效的语言代码，正在清理:', storedLang);
    safeRemoveItem('lang');
    return true;
  }
  
  return false;
}

/**
 * 清理localStorage中的无效JSON数据
 */
export function cleanupInvalidJsonData() {
  const keys = ['userInfo', 'token', 'theme', 'preferences'];
  let cleaned = false;
  
  keys.forEach(key => {
    const value = safeGetItem(key);
    
    if (value && typeof value === 'string') {
      // 检查是否是JSON字符串
      if (value.startsWith('{') || value.startsWith('[')) {
        try {
          JSON.parse(value);
        } catch (error) {
          console.warn(`检测到无效的JSON数据，正在清理 [${key}]:`, value);
          safeRemoveItem(key);
          cleaned = true;
        }
      }
    }
  });
  
  return cleaned;
}

/**
 * 初始化localStorage清理
 * 在应用启动时调用，清理无效数据
 */
export function initLocalStorageCleanup() {
  let cleaned = false;
  
  // 清理无效语言代码
  if (cleanupInvalidLanguageCode()) {
    cleaned = true;
  }
  
  // 清理无效JSON数据
  if (cleanupInvalidJsonData()) {
    cleaned = true;
  }
  
  if (cleaned) {
    console.log('localStorage清理完成');
  }
  
  return cleaned;
}
