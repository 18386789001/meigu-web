import { createApp } from 'vue'
import './assets/css/index.scss'
import 'vant/lib/index.css'
import fxHeader from '@/components/fx-header'
import 'default-passive-events'
// import 'amfe-flexible'
import App from './App.vue'
import i18n from '@/i18n'
import '@/assets/remNew.js'
import 'vant/es/toast/style';
import router from '@/router'
import pinia from '@/store'
import store from '@/store/store'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { initializeWapLanguage } from '@/utils/languageInit.js'

// 在应用启动前初始化语言设置
console.log('🌐 WAP-Vue: 应用启动前语言初始化...');
const languageInitResult = initializeWapLanguage();
console.log('🌐 WAP-Vue: 语言初始化完成:', languageInitResult);

// 🔧 重要：语言初始化后，更新 i18n 的 locale
const currentLang = localStorage.getItem('lang') || 'en';
if (i18n.global.locale && i18n.global.locale.value !== undefined) {
  i18n.global.locale.value = currentLang;
  console.log('🌐 WAP-Vue: i18n locale 已更新为:', currentLang);
} else if (i18n.global.locale) {
  i18n.global.locale = currentLang;
  console.log('🌐 WAP-Vue: i18n locale 已更新为:', currentLang);
}

pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
const title = import.meta.env.VITE_APP__TITLE
app.config.globalProperties.$title = title
document.title = title
app.use(fxHeader)
app.use(i18n)
app.use(router)
app.use(pinia)
app.use(store)

app.mount('#app')