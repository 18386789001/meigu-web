import { createI18n } from 'vue-i18n'
import { getStorage } from '@/utils/index'
import enLocale from './modules/en'
import cnLocale from './modules/CN'
import zhcnLocale from './modules/zh-CN'
import korcnLocale from './modules/Korean'
import japcnLocale from './modules/Japanese'
import Deutsch from './modules/de'
import fr from './modules/fr'
import vi from './modules/vi'
import th from './modules/th'
import gr from './modules/gr'
import Italy from './modules/Italy'
import SpanishLocal from './modules/es'
import PortugueseLocal from './modules/pt'
// 强制默认语言为英文，确保首次访问显示英文
const getDefaultLanguage = () => {
  const storedLang = getStorage('lang');

  // 如果没有存储的语言设置，强制使用英文
  if (!storedLang) {
    console.log('🌐 首次访问，设置默认语言为英文');
    return 'en';
  }

  // 如果存储的是中文相关语言，但我们要默认英文，仍返回英文
  // 用户可以手动切换语言
  console.log('🌐 从存储获取语言:', storedLang);
  return storedLang;
};

const lang = getDefaultLanguage();

const messages = {
  'en': {
    ...enLocale
  },
  'CN': {
    ...cnLocale
  },
  'zh-CN': {
    ...zhcnLocale
  },
  'Korean': {
    ...korcnLocale
  },
  'Japanese': {
    ...japcnLocale
  },
  'de': {
    ...Deutsch
  },
  'fr': {
    ...fr
  },
  'vi': {
    ...vi
  },
  'th': {
    ...th
  },
  'Italy': {
    ...Italy
  },
  'es': {
    ...SpanishLocal
  },
  'pt': {
    ...PortugueseLocal
  },
  'gr': {
    ...gr
  }
}


const i18n = createI18n({
  legacy: false,
  locale: lang, // 首先从缓存里拿，没有的话就用浏览器语言，
  fallbackLocale: 'en', // 设置备用语言
  messages,
})

export default i18n