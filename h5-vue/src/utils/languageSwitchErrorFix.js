/**
 * 语言切换错误修复工具
 * 专门处理语言切换时的JSON解析错误
 */

/**
 * 修复语言切换时的JSON解析错误
 */
export function fixLanguageSwitchJsonError() {
  console.log('=== 开始修复语言切换JSON错误 ===');
  
  try {
    // 1. 检查并修复localStorage中的语言相关数据
    const langKeys = ['lang', 'locale', 'language', 'i18n'];
    langKeys.forEach(key => {
      try {
        const value = localStorage.getItem(key);
        if (value) {
          // 如果是JSON格式，验证其有效性
          if (value.startsWith('{') || value.startsWith('[')) {
            try {
              JSON.parse(value);
              console.log(`✓ ${key}: JSON数据有效`);
            } catch (parseError) {
              console.warn(`✗ ${key}: JSON解析失败，正在清理:`, parseError);
              localStorage.removeItem(key);
            }
          } else {
            // 对于非JSON数据，检查是否是有效的语言代码
            const validLanguages = [
              'zh', 'zh-CN', 'zh-TW', 'en', 'en-US', 'ja-JP', 'ko-KR',
              'th-TH', 'vi-VN', 'de-DE', 'es-ES', 'fr-FR',
              'it-IT', 'pt-PT', 'el-GR'
            ];
            
            if (!validLanguages.includes(value)) {
              console.warn(`无效的语言代码 [${key}]:`, value);
              localStorage.setItem(key, 'en-US');
            }
          }
        }
      } catch (error) {
        console.error(`检查键 ${key} 时出错:`, error);
        try {
          localStorage.removeItem(key);
        } catch (removeError) {
          console.error(`无法移除键 ${key}:`, removeError);
        }
      }
    });
    
    // 2. 修复Vue i18n相关的错误
    fixVueI18nErrors();
    
    // 3. 修复语言切换过程中的状态问题
    fixLanguageSwitchState();
    
    console.log('✓ 语言切换JSON错误修复完成');
  } catch (error) {
    console.error('修复语言切换JSON错误失败:', error);
  }
}

/**
 * 修复Vue i18n相关错误
 */
export function fixVueI18nErrors() {
  console.log('=== 开始修复Vue i18n错误 ===');
  
  try {
    // 检查全局Vue实例
    if (typeof window !== 'undefined') {
      // 检查Vue应用实例
      const app = document.getElementById('app');
      if (app && app.__vue_app__) {
        console.log('Vue应用实例已找到');
        
        // 检查i18n实例
        const i18n = app.__vue_app__.config.globalProperties.$i18n;
        if (i18n) {
          console.log('i18n实例已找到');
          
          // 检查当前语言设置
          const currentLocale = i18n.locale;
          console.log('当前i18n语言:', currentLocale);
          
          // 验证语言设置是否有效
          const validLanguages = [
            'zh', 'zh-CN', 'zh-TW', 'en', 'en-US', 'ja-JP', 'ko-KR',
            'th-TH', 'vi-VN', 'de-DE', 'es-ES', 'fr-FR',
            'it-IT', 'pt-PT', 'el-GR'
          ];
          
          if (!validLanguages.includes(currentLocale)) {
            console.warn('无效的i18n语言设置，重置为英文:', currentLocale);
            i18n.locale = 'en-US';
            localStorage.setItem('lang', 'en-US');
          }
        }
      }
    }
    
    console.log('✓ Vue i18n错误修复完成');
  } catch (error) {
    console.error('修复Vue i18n错误失败:', error);
  }
}

/**
 * 修复语言切换过程中的状态问题
 */
export function fixLanguageSwitchState() {
  console.log('=== 开始修复语言切换状态问题 ===');
  
  try {
    // 检查并修复可能的竞态条件
    const currentLang = localStorage.getItem('lang') || 'en-US';
    console.log('当前语言设置:', currentLang);
    
    // 确保语言设置的一致性
    const validLanguages = [
      'zh', 'zh-CN', 'zh-TW', 'en', 'en-US', 'ja-JP', 'ko-KR',
      'th-TH', 'vi-VN', 'de-DE', 'es-ES', 'fr-FR',
      'it-IT', 'pt-PT', 'el-GR'
    ];
    
    if (!validLanguages.includes(currentLang)) {
      console.warn('检测到无效语言设置，重置为英文:', currentLang);
      localStorage.setItem('lang', 'en-US');
    }
    
    // 清理可能的重复或冲突的语言设置
    const duplicateKeys = ['locale', 'language'];
    duplicateKeys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value && value !== currentLang) {
        console.log(`清理重复的语言设置 [${key}]:`, value);
        localStorage.removeItem(key);
      }
    });
    
    console.log('✓ 语言切换状态问题修复完成');
  } catch (error) {
    console.error('修复语言切换状态问题失败:', error);
  }
}

/**
 * 安全的语言切换函数
 */
export function safeLanguageSwitch(targetLang) {
  console.log('=== 开始安全语言切换 ===');
  console.log('目标语言:', targetLang);
  
  try {
    // 1. 验证目标语言
    const validLanguages = [
      'zh', 'zh-CN', 'zh-TW', 'en', 'en-US', 'ja-JP', 'ko-KR',
      'th-TH', 'vi-VN', 'de-DE', 'es-ES', 'fr-FR',
      'it-IT', 'pt-PT', 'el-GR'
    ];
    
    if (!validLanguages.includes(targetLang)) {
      console.warn('无效的目标语言，使用英文默认:', targetLang);
      targetLang = 'en-US';
    }
    
    // 2. 清理localStorage中的无效数据
    fixLanguageSwitchJsonError();
    
    // 3. 设置新的语言
    localStorage.setItem('lang', targetLang);
    console.log('语言已保存到localStorage:', targetLang);
    
    // 4. 等待一小段时间确保状态更新
    setTimeout(() => {
      try {
        // 5. 更新Vue i18n实例
        if (typeof window !== 'undefined') {
          const app = document.getElementById('app');
          if (app && app.__vue_app__) {
            const i18n = app.__vue_app__.config.globalProperties.$i18n;
            if (i18n) {
              i18n.locale = targetLang;
              console.log('i18n语言已更新:', targetLang);
            }
          }
        }
        
        console.log('✓ 安全语言切换完成');
      } catch (error) {
        console.error('更新i18n实例失败:', error);
      }
    }, 100);
    
    return true;
  } catch (error) {
    console.error('安全语言切换失败:', error);
    return false;
  }
}

/**
 * 监听语言切换事件并自动修复
 */
export function setupLanguageSwitchListener() {
  console.log('=== 设置语言切换监听器 ===');
  
  try {
    // 监听localStorage变化
    window.addEventListener('storage', (event) => {
      if (event.key === 'lang') {
        console.log('检测到语言变化:', event.oldValue, '→', event.newValue);
        
        // 延迟执行修复，确保语言切换完成
        setTimeout(() => {
          fixLanguageSwitchJsonError();
        }, 200);
      }
    });
    
    // 监听自定义语言切换事件
    window.addEventListener('languageChanged', (event) => {
      console.log('检测到自定义语言切换事件:', event.detail);
      
      setTimeout(() => {
        fixLanguageSwitchJsonError();
      }, 200);
    });
    
    // 重写localStorage的setItem方法，专门处理语言设置
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
      try {
        // 如果是语言设置，进行特殊处理
        if (key === 'lang') {
          console.log('检测到语言设置:', value);
          
          // 验证语言代码
          const validLanguages = [
            'zh', 'zh-CN', 'zh-TW', 'en', 'en-US', 'ja-JP', 'ko-KR',
            'th-TH', 'vi-VN', 'de-DE', 'es-ES', 'fr-FR',
            'it-IT', 'pt-PT', 'el-GR'
          ];
          
          if (!validLanguages.includes(value)) {
            console.warn('无效的语言代码，使用英文默认:', value);
            value = 'en-US';
          }
          
          // 先修复可能的JSON错误
          fixLanguageSwitchJsonError();
        }
        
        originalSetItem.call(this, key, value);
        
        // 如果是语言设置，触发自定义事件
        if (key === 'lang') {
          window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { oldValue: null, newValue: value }
          }));
        }
      } catch (error) {
        console.error('设置localStorage失败:', error);
      }
    };
    
    console.log('✓ 语言切换监听器已设置');
  } catch (error) {
    console.error('设置语言切换监听器失败:', error);
  }
}

/**
 * 执行所有语言切换相关的修复
 */
export function executeLanguageSwitchFixes() {
  console.log('=== 开始执行语言切换修复 ===');
  
  try {
    // 1. 修复JSON解析错误
    fixLanguageSwitchJsonError();
    
    // 2. 修复Vue i18n错误
    fixVueI18nErrors();
    
    // 3. 修复状态问题
    fixLanguageSwitchState();
    
    // 4. 设置监听器
    setupLanguageSwitchListener();
    
    console.log('=== 语言切换修复完成 ===');
    
    return true;
  } catch (error) {
    console.error('执行语言切换修复时出错:', error);
    return false;
  }
}

/**
 * 在页面加载时自动执行语言切换修复
 */
export function autoFixLanguageSwitchOnLoad() {
  // 立即执行修复
  executeLanguageSwitchFixes();
  
  // 延迟执行，确保所有代码都已加载
  setTimeout(() => {
    executeLanguageSwitchFixes();
  }, 500);
  
  // 再次延迟执行
  setTimeout(() => {
    executeLanguageSwitchFixes();
  }, 2000);
}

// 导出默认修复函数
export default {
  fixLanguageSwitchJsonError,
  fixVueI18nErrors,
  fixLanguageSwitchState,
  safeLanguageSwitch,
  setupLanguageSwitchListener,
  executeLanguageSwitchFixes,
  autoFixLanguageSwitchOnLoad
};
