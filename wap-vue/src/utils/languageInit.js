/**
 * WAP-Vue 语言初始化工具
 * 确保项目默认显示英文，包括新闻资讯
 */

/**
 * 从URL获取语言参数
 */
export function getLanguageFromUrl() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    if (langParam) {
      console.log('🌐 WAP-Vue: 从URL获取到语言参数:', langParam);
      return langParam;
    }
    return null;
  } catch (error) {
    console.error('🌐 WAP-Vue: 获取URL语言参数失败:', error);
    return null;
  }
}

/**
 * 强制初始化英文语言
 * 确保首次访问时显示英文内容
 * 如果URL中有语言参数，则使用URL参数的语言
 */
export function forceInitializeEnglish() {
  try {
    console.log('🌐 WAP-Vue: 开始语言初始化...');
    
    // 首先检查URL参数中是否有语言设置
    const urlLang = getLanguageFromUrl();
    if (urlLang) {
      console.log('🌐 WAP-Vue: 检测到URL语言参数，设置语言为:', urlLang);
      localStorage.setItem('lang', urlLang);
      localStorage.setItem('userSetLanguage', 'true'); // 标记为用户设置
      localStorage.setItem('langSource', 'url'); // 标记语言来源
      return true;
    }
    
    // 检查当前语言设置
    const currentLang = localStorage.getItem('lang');
    console.log('🌐 WAP-Vue: 当前语言设置:', currentLang);
    
    // 如果没有语言设置，默认设置为英文
    if (!currentLang) {
      localStorage.setItem('lang', 'en');
      console.log('🌐 WAP-Vue: 首次访问，设置默认语言为英文');
      return true;
    }
    
    // 检查用户是否手动设置过语言
    const hasUserSetLanguage = localStorage.getItem('userSetLanguage');
    
    // 如果用户已经手动设置过语言，保持用户的选择
    if (hasUserSetLanguage === 'true') {
      console.log('🌐 WAP-Vue: 用户已手动设置语言，保持当前设置:', currentLang);
      return false;
    }
    
    // 如果用户没有手动设置过语言，且当前不是英文，设置为英文
    if (currentLang !== 'en') {
      localStorage.setItem('lang', 'en');
      console.log('🌐 WAP-Vue: 用户未手动设置语言，使用英文默认');
      return true;
    }
    
    console.log('🌐 WAP-Vue: 保持当前语言设置:', currentLang);
    return false;
  } catch (error) {
    console.error('🌐 WAP-Vue: 语言初始化失败:', error);
    // 出错时默认使用英文
    try {
      localStorage.setItem('lang', 'en');
      return true;
    } catch (e) {
      console.error('🌐 WAP-Vue: 无法设置默认语言:', e);
      return false;
    }
  }
}

/**
 * 检查并修复语言设置
 */
export function checkAndFixLanguage() {
  try {
    const lang = localStorage.getItem('lang');
    
    // 验证语言代码是否有效
    const validLanguages = ['en', 'CN', 'Japanese', 'Korean', 'de', 'fr', 'vi', 'th', 'Italy', 'es', 'pt', 'gr'];
    
    if (!lang || !validLanguages.includes(lang)) {
      console.log('🌐 WAP-Vue: 无效的语言设置，重置为英文');
      localStorage.setItem('lang', 'en');
      return 'en';
    }
    
    return lang;
  } catch (error) {
    console.error('🌐 WAP-Vue: 语言检查失败:', error);
    return 'en';
  }
}

/**
 * 初始化新闻语言设置
 * 确保新闻资讯默认显示英文
 */
export function initializeNewsLanguage() {
  try {
    console.log('📰 WAP-Vue: 初始化新闻语言设置...');
    
    const currentLang = localStorage.getItem('lang');
    const newsLangPreference = localStorage.getItem('newsLanguagePreference');
    
    // 如果没有新闻语言偏好设置，且当前语言不是英文，为新闻设置英文偏好
    if (!newsLangPreference) {
      if (!currentLang || currentLang !== 'en') {
        localStorage.setItem('newsLanguagePreference', 'en');
        console.log('📰 WAP-Vue: 设置新闻默认语言为英文');
      } else {
        localStorage.setItem('newsLanguagePreference', currentLang);
        console.log('📰 WAP-Vue: 使用当前语言作为新闻语言:', currentLang);
      }
    }
    
    return localStorage.getItem('newsLanguagePreference') || 'en';
  } catch (error) {
    console.error('📰 WAP-Vue: 新闻语言初始化失败:', error);
    return 'en';
  }
}

/**
 * 监听语言变化
 */
export function watchLanguageChanges() {
  // 监听localStorage变化
  window.addEventListener('storage', (e) => {
    if (e.key === 'lang') {
      console.log('🌐 WAP-Vue: 检测到语言变化:', e.oldValue, '→', e.newValue);
      
      // 标记用户已手动设置语言
      if (e.newValue) {
        localStorage.setItem('userSetLanguage', 'true');
      }
      
      // 触发自定义事件，通知其他组件
      window.dispatchEvent(new CustomEvent('languageChanged', {
        detail: {
          oldLanguage: e.oldValue,
          newLanguage: e.newValue
        }
      }));
    }
  });
  
  console.log('🌐 WAP-Vue: 语言变化监听器已启动');
}

/**
 * 获取显示语言
 * 优先使用用户设置，否则使用默认英文
 */
export function getDisplayLanguage() {
  try {
    const userLang = localStorage.getItem('lang');
    const hasUserSet = localStorage.getItem('userSetLanguage');
    
    // 如果用户手动设置过语言，使用用户设置
    if (hasUserSet && userLang) {
      return userLang;
    }
    
    // 否则使用默认英文
    return 'en';
  } catch (error) {
    console.error('🌐 WAP-Vue: 获取显示语言失败:', error);
    return 'en';
  }
}

/**
 * 设置用户语言
 * @param {string} language 语言代码
 */
export function setUserLanguage(language) {
  try {
    localStorage.setItem('lang', language);
    localStorage.setItem('userSetLanguage', 'true');
    
    console.log('🌐 WAP-Vue: 用户设置语言为:', language);
    
    // 触发语言变化事件
    window.dispatchEvent(new CustomEvent('languageChanged', {
      detail: {
        oldLanguage: localStorage.getItem('lang'),
        newLanguage: language
      }
    }));
    
    return true;
  } catch (error) {
    console.error('🌐 WAP-Vue: 设置用户语言失败:', error);
    return false;
  }
}

/**
 * 重置语言设置
 */
export function resetLanguageSettings() {
  try {
    localStorage.removeItem('lang');
    localStorage.removeItem('userSetLanguage');
    localStorage.removeItem('newsLanguagePreference');
    
    // 重新初始化为英文
    forceInitializeEnglish();
    initializeNewsLanguage();
    
    console.log('🌐 WAP-Vue: 语言设置已重置为默认英文');
    return true;
  } catch (error) {
    console.error('🌐 WAP-Vue: 重置语言设置失败:', error);
    return false;
  }
}

/**
 * 获取新闻显示语言
 */
export function getNewsDisplayLanguage() {
  try {
    // 优先使用新闻语言偏好
    const newsLangPreference = localStorage.getItem('newsLanguagePreference');
    if (newsLangPreference) {
      return newsLangPreference;
    }
    
    // 其次使用用户设置的语言
    const userLang = localStorage.getItem('lang');
    if (userLang) {
      return userLang;
    }
    
    // 最后使用默认英文
    return 'en';
  } catch (error) {
    console.error('📰 WAP-Vue: 获取新闻显示语言失败:', error);
    return 'en';
  }
}

/**
 * 设置新闻显示语言
 * @param {string} language 语言代码
 */
export function setNewsDisplayLanguage(language) {
  try {
    localStorage.setItem('newsLanguagePreference', language);
    console.log('📰 WAP-Vue: 设置新闻显示语言为:', language);
    
    // 触发新闻语言变化事件
    window.dispatchEvent(new CustomEvent('newsLanguageChanged', {
      detail: { language }
    }));
    
    return true;
  } catch (error) {
    console.error('📰 WAP-Vue: 设置新闻显示语言失败:', error);
    return false;
  }
}

/**
 * 通用语言初始化函数
 * 在应用启动时调用
 */
export function initializeWapLanguage() {
  console.log('🌐 WAP-Vue: 开始语言初始化...');
  
  // 1. 强制初始化英文
  const forceResult = forceInitializeEnglish();
  
  // 2. 检查并修复语言设置
  const currentLang = checkAndFixLanguage();
  
  // 3. 初始化新闻语言
  const newsLang = initializeNewsLanguage();
  
  // 4. 启动语言监听
  watchLanguageChanges();
  
  console.log('🌐 WAP-Vue: 语言初始化完成');
  console.log('🌐 WAP-Vue: 当前语言:', currentLang);
  console.log('📰 WAP-Vue: 新闻语言:', newsLang);
  
  return {
    currentLanguage: currentLang,
    newsLanguage: newsLang,
    forceInitialized: forceResult
  };
}

/**
 * 检查是否为首次访问
 */
export function isFirstVisit() {
  try {
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      localStorage.setItem('hasVisited', 'true');
      return true;
    }
    return false;
  } catch (error) {
    console.error('🌐 WAP-Vue: 检查首次访问失败:', error);
    return true; // 出错时假设是首次访问
  }
}

// 导出默认初始化函数
export default initializeWapLanguage;
