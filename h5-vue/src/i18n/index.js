import { createI18n } from 'vue-i18n';
import { getValidLanguageCode } from '@/utils/localStorage';
import zhCN from './zh-CN';
import zhTW from './zh-TW';
import enUS from './en-US';
import jaJP from './ja-JP';
import koKR from './ko-KR';
import thTH from './th-TH';
import viVN from './vi-VN';
import deDE from './de-DE';
import esES from './es-ES';
import frFR from './fr-FR';
import itIT from './it-IT';
import ptPT from './pt-PT';
import elGR from './el-GR';

const messages = {
  'zh': zhCN,      // 添加 zh 别名映射到 zh-CN
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  'en': enUS,      // 添加 en 别名映射到 en-US
  'en-US': enUS,
  'ja-JP': jaJP,
  'ko-KR': koKR,
  'th-TH': thTH,
  'vi-VN': viVN,
  'de-DE': deDE,
  'es-ES': esES,
  'fr-FR': frFR,
  'it-IT': itIT,
  'pt-PT': ptPT,
  'el-GR': elGR
};

// 确保所有语言代码都有完整的翻译
const ensureCompleteTranslations = () => {
  // 复制zh-CN的所有翻译到zh
  messages['zh'] = { ...zhCN };
  // 复制en-US的所有翻译到en
  messages['en'] = { ...enUS };
  console.log('ensureCompleteTranslations: zh-CN keys:', Object.keys(zhCN).slice(0, 10));
  console.log('ensureCompleteTranslations: zh keys:', Object.keys(messages['zh']).slice(0, 10));
  console.log('ensureCompleteTranslations: en-US keys:', Object.keys(enUS).slice(0, 10));
  console.log('ensureCompleteTranslations: en keys:', Object.keys(messages['en']).slice(0, 10));
  console.log('ensureCompleteTranslations: en-US trading keys:', Object.keys(enUS.trading || {}));
  console.log('ensureCompleteTranslations: en trading keys:', Object.keys(messages['en'].trading || {}));
};

// 获取浏览器语言
const getBrowserLanguage = () => {
  const lang = navigator.language || navigator.userLanguage;
  const supportedLanguages = ['zh', 'zh-CN', 'zh-TW', 'en', 'en-US', 'ja-JP', 'ko-KR', 'th-TH', 'vi-VN', 'de-DE', 'es-ES', 'fr-FR', 'it-IT', 'pt-PT', 'el-GR'];

  // 检查完整语言代码
  if (supportedLanguages.includes(lang)) {
    return lang;
  }

  // 检查语言前缀
  const langPrefix = lang.split('-')[0];
  const matchedLang = supportedLanguages.find(l => l.startsWith(langPrefix));
  if (matchedLang) {
    return matchedLang;
  }

  // 默认返回英文
  return 'en-US';
};

// 从本地存储获取语言设置
const getStoredLanguage = () => {
  try {
    const storedLang = localStorage.getItem('lang');
    console.log('从localStorage获取的语言设置:', storedLang);

    // 如果没有存储的语言设置，强制使用英文作为默认语言
    if (!storedLang) {
      console.log('没有存储的语言设置，使用英文默认');
      return 'en-US';
    }

    // 验证存储的语言是否有效，如果无效则使用英文
    return getValidLanguageCode(storedLang, 'en-US');
  } catch (error) {
    console.error('获取存储语言失败:', error);
    // 如果localStorage访问失败，返回默认语言
    return 'en-US';
  }
};

// 确保语言代码规范化
const normalizeStoredLanguage = (lang) => {
  // 如果没有语言设置或为空，使用英文默认
  if (!lang) return 'en-US';

  // 规范化zh为zh-CN
  if (lang === 'zh') return 'zh-CN';
  // 保持en不变，不转换为en-US

  return lang;
};

// 执行翻译完整性检查
ensureCompleteTranslations();

// 安全地创建i18n实例
let i18n;
try {
  console.log('Creating i18n with messages:', Object.keys(messages));
  console.log('Current locale:', normalizeStoredLanguage(getStoredLanguage()));
  
  i18n = createI18n({
    legacy: false,
    locale: normalizeStoredLanguage(getStoredLanguage()),
    fallbackLocale: 'en-US',
    messages,
    globalInjection: true,
    silentTranslationWarn: false,
    silentFallbackWarn: false,
    missingWarn: true,
    fallbackWarn: true,
    missingHandler: (locale, key, vm, values) => {
      console.warn(`Missing translation for key: ${key} in locale: ${locale}`);
      console.log('Available messages keys:', Object.keys(messages));
      console.log('zh-CN exists:', !!messages['zh-CN']);
      console.log('zh exists:', !!messages['zh']);
      
      try {
        // 尝试从各种语言获取翻译
        const fallbackLocales = ['en-US', 'en', 'zh-CN', 'zh', 'ja-JP', 'ko-KR'];
        for (const fallbackLocale of fallbackLocales) {
          const fallbackMessage = messages[fallbackLocale];
          if (fallbackMessage) {
            console.log(`Attempting to find key ${key} in ${fallbackLocale}:`);
            // 直接访问翻译，避免递归调用
            const keys = key.split('.');
            let translation = fallbackMessage;

            for (const k of keys) {
              if (translation && typeof translation === 'object' && translation[k]) {
                translation = translation[k];
              } else {
                console.log(`Key ${k} not found in ${fallbackLocale} translation object`);
                translation = null;
                break;
              }
            }

            if (typeof translation === 'string') {
              console.log(`Found fallback translation for ${key} from ${fallbackLocale}: ${translation}`);
              return translation;
            } else {
              console.log(`Translation for ${key} from ${fallbackLocale} is not a string:`, typeof translation);
            }
          } else {
            console.log(`${fallbackLocale} message not found`);
          }
        }
        
        return key; // 返回key本身作为fallback
      } catch (error) {
        console.warn('Translation fallback failed:', error);
        return key;
      }
    }
  });
} catch (error) {
  console.error('创建i18n实例失败:', error);
  // 创建最基本的i18n实例作为fallback
  i18n = createI18n({
    legacy: false,
    locale: 'en-US',
    fallbackLocale: 'en-US',
    messages: { 'en-US': enUS },
    globalInjection: true,
    silentTranslationWarn: false,
    silentFallbackWarn: false,
    missingWarn: true,
    fallbackWarn: true
  });
}

// 语言代码转换函数
const normalizeLocale = (locale) => {
  if (locale === 'zh') return 'zh-CN';
  return locale;
};

// 安全地设置初始语言
try {
  const initialLocale = normalizeStoredLanguage(getStoredLanguage());
  console.log('初始语言设置:', initialLocale);
  console.log('i18n.global.locale设置为:', i18n.global.locale);

  // 确保语言代码正确设置
  if (i18n && i18n.global) {
    if (i18n.global.locale.value !== undefined) {
      i18n.global.locale.value = initialLocale;
      console.log('强制设置i18n.global.locale.value为:', i18n.global.locale.value);
    } else {
      i18n.global.locale = initialLocale;
      console.log('强制设置i18n.global.locale为:', i18n.global.locale);
    }
  }
} catch (error) {
  console.error('设置初始语言失败:', error);
}

export default i18n;
