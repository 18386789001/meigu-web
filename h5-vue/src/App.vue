<template>
  <div id="app">
    <!-- 移动端头部 -->
    <header class="mobile-header">
      <div class="header-content">
        <!-- 左侧汉堡菜单按钮 -->
        <button class="hamburger-btn" @click="toggleSidebar">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
        
        <!-- 中间Logo -->
        <div class="header-logo">
          <span class="logo-text">JPMX</span>
        </div>
        
        <!-- 右侧操作按钮 -->
        <div class="header-actions">
          <!-- 语言切换 -->
          <div class="language-selector">
            <button class="language-btn" @click="toggleLanguageMenu">
              <span>{{ currentLanguage }}</span>
              <i class="icon-chevron-down">▼</i>
            </button>
            
            <!-- 语言下拉菜单 -->
            <div v-if="languageMenuVisible" class="language-menu">
              <div 
                v-for="lang in languages" 
                :key="lang.code"
                class="language-item"
                :class="{ 'active': lang.code === currentLanguageCode }"
                @click="selectLanguage(lang)"
              >
                <span class="flag">{{ lang.flag }}</span>
                <span class="name">{{ lang.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    
    <!-- 主要内容区域 -->
    <main class="mobile-main">
      <router-view />
    </main>
    
    <!-- 移动端底部导航 -->
    <nav class="mobile-bottom-nav">
      <div class="nav-item" :class="{ 'active': $route.path === '/' || $route.path === '/home' }" @click="$router.push('/')">
        <i class="icon-home"></i>
        <span>{{ $t('nav.home') }}</span>
      </div>
      <div class="nav-item" :class="{ 'active': $route.path === '/trading' }" @click="$router.push('/trading')">
        <i class="icon-trading"></i>
        <span>{{ $t('nav.trading') }}</span>
      </div>
      <div class="nav-item" :class="{ 'active': $route.path === '/market' }" @click="$router.push('/market')">
        <i class="icon-chart"></i>
        <span>{{ $t('nav.market') }}</span>
      </div>
      <div class="nav-item" :class="{ 'active': $route.path === '/more' }" @click="$router.push('/more')">
        <i class="icon-more"></i>
        <span>{{ $t('nav.more') }}</span>
      </div>
    </nav>
    
    <!-- 侧边栏 -->
    <div class="sidebar-overlay" :class="{ 'visible': sidebarVisible }" @click="closeSidebar"></div>
    <aside class="mobile-sidebar" :class="{ 'visible': sidebarVisible }">
      <div class="sidebar-header">
        <div class="sidebar-logo">
          <span class="logo-text">JPMX</span>
        </div>
        <button class="close-btn" @click="closeSidebar">
          <i class="icon-close"></i>
        </button>
      </div>
      
      <nav class="sidebar-nav">
        <div class="nav-section">
          <h3>{{ $t('sidebar.trading') }}</h3>
          <a href="#" @click.prevent="goToTrading('forex')">{{ $t('sidebar.forexTrading') }}</a>
          <a href="#" @click.prevent="goToTrading('crypto')">{{ $t('sidebar.cryptocurrency') }}</a>
          <a href="#" @click.prevent="goToTrading('stocks')">{{ $t('sidebar.stockTrading') }}</a>
          <a href="#" @click.prevent="goToTrading('commodities')">{{ $t('sidebar.commodityFutures') }}</a>
        </div>
        
        <div class="nav-section">
          <h3>{{ $t('sidebar.services') }}</h3>
          <a href="#" @click.prevent="goToPage('/platform')">{{ $t('sidebar.tradingPlatform') }}</a>
          <a href="#" @click.prevent="goToPage('/education')">{{ $t('sidebar.educationCenter') }}</a>
          <a href="#" @click.prevent="goToPage('/analysis')">{{ $t('sidebar.marketAnalysis') }}</a>
          <a href="#" @click.prevent="goToPage('/support')">{{ $t('sidebar.customerSupport') }}</a>
        </div>
        
        <div class="nav-section">
          <h3>{{ $t('sidebar.account') }}</h3>
          <a href="#" @click.prevent="goToLogin">{{ $t('sidebar.login') }}</a>
          <a href="#" @click.prevent="goToRegister">{{ $t('sidebar.register') }}</a>
        </div>
      </nav>
    </aside>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getValidLanguageCode } from '@/utils/localStorage'
import { safeLanguageSwitch } from '@/utils/languageSwitchErrorFix'
import { safeLanguageSwitchWithRaceProtection } from '@/utils/languageSwitchRaceFix'
import i18n from '@/i18n'
import config from '@/config'

const router = useRouter()
const { locale } = useI18n()

// 响应式数据
const sidebarVisible = ref(false)
const languageMenuVisible = ref(false)

// 语言配置
const languages = ref([
  { code: 'en-US', name: 'English', flag: '🇺🇸' },
  { code: 'ja-JP', name: '日本語', flag: '🇯🇵' },
  { code: 'ko-KR', name: '한국어', flag: '🇰🇷' },
  { code: 'th-TH', name: 'ไทย', flag: '🇹🇭' },
  { code: 'vi-VN', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'de-DE', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
  { code: 'it-IT', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt-PT', name: 'Português', flag: '🇵🇹' },
  { code: 'el-GR', name: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
  { code: 'zh-TW', name: '繁體中文', flag: '🇹🇼' }
])

const currentLanguageCode = ref('en-US')
const currentLanguage = ref('English')

// 切换侧边栏
const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value
}

// 关闭侧边栏
const closeSidebar = () => {
  sidebarVisible.value = false
}

// 切换语言菜单
const toggleLanguageMenu = () => {
  languageMenuVisible.value = !languageMenuVisible.value
}

// 选择语言
const selectLanguage = async (lang) => {
  console.log('选择语言:', lang)

  // 规范化语言代码
  const normalizedCode = lang.code === 'zh' ? 'zh-CN' : lang.code

  console.log('规范化后的语言代码:', normalizedCode)

  try {
    // 使用带竞态条件保护的安全语言切换函数
    await safeLanguageSwitchWithRaceProtection(normalizedCode)
    
    // 更新当前语言显示
    currentLanguageCode.value = normalizedCode
    currentLanguage.value = lang.name
    console.log('语言显示已更新为:', lang.name)

    // 设置组件locale
    if (typeof locale === 'object' && locale.value !== undefined) {
      locale.value = normalizedCode
      console.log('组件locale已设置为:', locale.value)
    }

    // 关闭菜单
    languageMenuVisible.value = false
    
    console.log('语言切换完成，当前语言:', normalizedCode)
  } catch (error) {
    console.error('语言切换失败:', error)
    
    // 如果竞态条件保护失败，尝试使用基础的安全切换函数
    try {
      const success = safeLanguageSwitch(normalizedCode)
      if (success) {
        currentLanguageCode.value = normalizedCode
        currentLanguage.value = lang.name
        languageMenuVisible.value = false
        console.log('使用基础安全切换函数成功')
      }
    } catch (fallbackError) {
      console.error('基础安全切换函数也失败:', fallbackError)
    }
  }
}

// 跳转到交易页面
const goToTrading = (type) => {
  console.log('跳转到交易页面:', type)
  router.push(`/trading/${type}`)
  closeSidebar()
}

// 跳转到其他页面
const goToPage = (path) => {
  console.log('跳转到页面:', path)
  router.push(path)
  closeSidebar()
}

// 语言代码映射（h5-vue到wap-vue）
const getWapLanguageCode = (h5LangCode) => {
  const langMap = {
    'en-US': 'en',
    'ja-JP': 'Japanese',
    'ko-KR': 'Korean',
    'th-TH': 'th',
    'vi-VN': 'vi',
    'de-DE': 'de',
    'es-ES': 'es',
    'fr-FR': 'fr',
    'it-IT': 'Italy',
    'pt-PT': 'pt',
    'el-GR': 'gr',
    'zh-CN': 'CN',
    'zh-TW': 'CN'
  }
  return langMap[h5LangCode] || 'en'
}

// 跳转到登录页（携带语言参数）
const goToLogin = () => {
  const langCode = getWapLanguageCode(currentLanguageCode.value)
  const loginUrl = config.URLS.LOGIN({ lang: langCode })
  console.log('🔗 跳转到登录页')
  console.log('📝 当前语言代码 (H5):', currentLanguageCode.value)
  console.log('📝 转换后语言代码 (WAP):', langCode)
  console.log('🌐 生成的登录URL:', loginUrl)
  window.location.href = loginUrl
  closeSidebar()
}

// 跳转到注册页（携带语言参数）
const goToRegister = () => {
  const langCode = getWapLanguageCode(currentLanguageCode.value)
  const registerUrl = config.URLS.REGISTER({ lang: langCode })
  console.log('🔗 跳转到注册页')
  console.log('📝 当前语言代码 (H5):', currentLanguageCode.value)
  console.log('📝 转换后语言代码 (WAP):', langCode)
  console.log('🌐 生成的注册URL:', registerUrl)
  window.location.href = registerUrl
  closeSidebar()
}

// 点击外部关闭菜单
const handleClickOutside = (event) => {
  if (!event.target.closest('.language-selector')) {
    languageMenuVisible.value = false
  }
}

// 生命周期
onMounted(() => {
  document.addEventListener('click', handleClickOutside)

  // 从localStorage获取保存的语言设置，强制默认为英文
  let savedLang = localStorage.getItem('lang')

  // 如果没有语言设置或者不是有效语言，强制设置为英文
  if (!savedLang) {
    savedLang = 'en-US'
    localStorage.setItem('lang', 'en-US')
    console.log('没有语言设置，强制设置为英文:', savedLang)
  } else {
    console.log('从localStorage获取的语言设置:', savedLang)
  }

  // 查找对应的语言配置
  const lang = languages.value.find(l => l.code === savedLang)
  if (lang) {
    currentLanguageCode.value = savedLang
    currentLanguage.value = lang.name

    console.log('找到语言配置:', lang)

    // 安全地设置locale
    try {
      if (typeof locale === 'object' && locale.value !== undefined) {
        locale.value = savedLang
        console.log('设置组件locale为:', savedLang)
      }

      // 确保i18n全局locale也被设置
      if (i18n && i18n.global) {
        if (i18n.global.locale.value !== undefined) {
          i18n.global.locale.value = savedLang
          console.log('设置全局i18n locale为:', i18n.global.locale.value)
        } else {
          i18n.global.locale = savedLang
          console.log('设置全局i18n locale为:', i18n.global.locale)
        }
      }
    } catch (error) {
      console.warn('无法设置locale:', error)
    }
  } else {
    console.warn('未找到语言配置，强制使用英文默认')
    // 如果找不到配置，强制使用英文默认
    savedLang = 'en-US'
    currentLanguageCode.value = 'en-US'
    currentLanguage.value = 'English'
    localStorage.setItem('lang', 'en-US')
  }

  console.log('H5-vue应用已启动，当前语言:', savedLang)
})

// 监听语言变化
watch(currentLanguageCode, (newLang, oldLang) => {
  console.log('语言代码变化:', oldLang, '→', newLang)
  
  // 更新显示的语言名称
  const lang = languages.value.find(l => l.code === newLang)
  if (lang) {
    currentLanguage.value = lang.name
    console.log('语言名称已更新:', lang.name)
  }
})

// 监听locale变化
watch(() => locale.value, (newLocale, oldLocale) => {
  console.log('i18n locale变化:', oldLocale, '→', newLocale)
}, { immediate: true })

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
#app {
  min-height: 100vh;
  background: #0a0a0a;
  color: white;
  display: flex;
  flex-direction: column;
}

/* 移动端头部 */
.mobile-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 16px;
}

.hamburger-btn {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: all 0.3s ease;
}

.hamburger-line {
  width: 20px;
  height: 2px;
  background: white;
  margin: 2px 0;
  transition: all 0.3s ease;
  border-radius: 1px;
}

.header-logo .logo-text {
  font-size: 18px;
  font-weight: bold;
  color: #ffd700;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.language-selector {
  position: relative;
}

.language-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.language-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.language-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  min-width: 160px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 9999;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.language-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.language-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.language-item.active {
  background: rgba(30, 64, 175, 0.3);
  color: #ffd700;
}

.flag {
  font-size: 16px;
}

/* 主要内容区域 */
.mobile-main {
  flex: 1;
  padding-top: 60px;
  padding-bottom: 60px;
  min-height: calc(100vh - 120px);
}

/* 移动端底部导航 */
.mobile-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-around;
  padding: 8px 0;
  z-index: 1000;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #666;
}

.nav-item.active {
  color: #ffd700;
}

.nav-item:hover {
  color: #ffffff;
}

.nav-item i {
  font-size: 20px;
}

.nav-item span {
  font-size: 12px;
}

/* 侧边栏 */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1998;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.sidebar-overlay.visible {
  opacity: 1;
  visibility: visible;
}

.mobile-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 280px;
  background: #1a1a1a;
  z-index: 1999;
  transform: translateX(-100%);
  transition: all 0.3s ease;
  overflow-y: auto;
}

.mobile-sidebar.visible {
  transform: translateX(0);
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid #333;
}

.sidebar-logo .logo-text {
  font-size: 20px;
  font-weight: bold;
  color: #ffd700;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
}

.sidebar-nav {
  padding: 20px 0;
}

.nav-section {
  margin-bottom: 30px;
}

.nav-section h3 {
  color: #ffd700;
  font-size: 16px;
  margin-bottom: 12px;
  padding: 0 20px;
}

.nav-section a {
  display: block;
  padding: 12px 20px;
  color: #cccccc;
  text-decoration: none;
  transition: all 0.3s ease;
}

.nav-section a:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .mobile-main {
    padding-top: 50px;
    padding-bottom: 50px;
  }
}

@media (min-width: 769px) {
  .mobile-sidebar {
    width: 320px;
  }
}
</style>