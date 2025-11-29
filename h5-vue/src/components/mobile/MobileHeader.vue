<template>
  <header class="mobile-header" :class="{ 'scrolled': isScrolled }">
    <div class="header-content">
      <!-- 左侧汉堡菜单按钮 -->
      <button 
        class="hamburger-btn" 
        @click="toggleSidebar"
        :class="{ 'active': sidebarVisible }"
      >
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>
      
      <!-- 中间Logo -->
      <div class="header-logo">
        <img src="@/assets/images/logo.png" alt="Demo" />
        <span class="logo-text">Demo</span>
      </div>
      
      <!-- 右侧操作按钮 -->
      <div class="header-actions">
        <!-- 语言切换 -->
        <div class="language-selector">
          <button 
            class="language-btn" 
            @click="toggleLanguageMenu"
            :class="{ 'active': languageMenuVisible }"
          >
            <i class="icon-globe"></i>
            <span>{{ currentLanguage }}</span>
            <i class="icon-chevron-down"></i>
          </button>
          
          <!-- 语言下拉菜单 -->
          <div 
            class="language-menu" 
            :class="{ 'visible': languageMenuVisible }"
            @click.stop
          >
            <div 
              v-for="lang in languages" 
              :key="lang.code"
              class="language-item"
              :class="{ 'active': lang.code === currentLanguageCode }"
              @click="selectLanguage(lang)"
            >
              <div class="flag-icon">
                <svg v-if="lang.icon === 'china'" viewBox="0 0 24 24" class="country-icon">
                  <rect width="24" height="24" fill="#de2910"/>
                  <rect x="2" y="2" width="20" height="20" fill="none" stroke="#ffde00" stroke-width="0.5"/>
                  <circle cx="6" cy="6" r="1.5" fill="#ffde00"/>
                  <circle cx="18" cy="6" r="1.5" fill="#ffde00"/>
                  <circle cx="6" cy="18" r="1.5" fill="#ffde00"/>
                  <circle cx="18" cy="18" r="1.5" fill="#ffde00"/>
                  <circle cx="12" cy="12" r="2" fill="#ffde00"/>
                </svg>
                <svg v-else-if="lang.icon === 'taiwan'" viewBox="0 0 24 24" class="country-icon">
                  <rect width="24" height="24" fill="#fe0000"/>
                  <rect x="0" y="0" width="12" height="12" fill="#000095"/>
                  <circle cx="6" cy="6" r="2" fill="#ffffff"/>
                  <circle cx="6" cy="6" r="1" fill="#000095"/>
                </svg>
                <svg v-else-if="lang.icon === 'usa'" viewBox="0 0 24 24" class="country-icon">
                  <rect width="24" height="24" fill="#b22234"/>
                  <rect x="0" y="0" width="24" height="2" fill="#ffffff"/>
                  <rect x="0" y="4" width="24" height="2" fill="#ffffff"/>
                  <rect x="0" y="8" width="24" height="2" fill="#ffffff"/>
                  <rect x="0" y="12" width="24" height="2" fill="#ffffff"/>
                  <rect x="0" y="16" width="24" height="2" fill="#ffffff"/>
                  <rect x="0" y="20" width="24" height="2" fill="#ffffff"/>
                  <rect x="0" y="0" width="9.6" height="12" fill="#3c3b6e"/>
                </svg>
                <svg v-else-if="lang.icon === 'japan'" viewBox="0 0 24 24" class="country-icon">
                  <rect width="24" height="24" fill="#ffffff"/>
                  <circle cx="12" cy="12" r="6" fill="#bc002d"/>
                </svg>
                <svg v-else-if="lang.icon === 'korea'" viewBox="0 0 24 24" class="country-icon">
                  <rect width="24" height="24" fill="#ffffff"/>
                  <circle cx="12" cy="12" r="8" fill="#cd2e3a"/>
                  <path d="M12 4c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z" fill="#003478"/>
                  <path d="M8 8h8v8H8z" fill="#ffffff"/>
                </svg>
                <svg v-else-if="lang.icon === 'thailand'" viewBox="0 0 24 24" class="country-icon">
                  <rect width="24" height="4" fill="#ed1c24"/>
                  <rect y="4" width="24" height="4" fill="#ffffff"/>
                  <rect y="8" width="24" height="4" fill="#241d4f"/>
                  <rect y="12" width="24" height="4" fill="#ffffff"/>
                  <rect y="16" width="24" height="4" fill="#ed1c24"/>
                  <rect y="20" width="24" height="4" fill="#241d4f"/>
                </svg>
                <svg v-else-if="lang.icon === 'vietnam'" viewBox="0 0 24 24" class="country-icon">
                  <rect width="24" height="24" fill="#da251d"/>
                  <path d="M12 4l2.5 7.5h7.5l-6 4.5 2.5 7.5L12 19l-6 4.5 2.5-7.5-6-4.5h7.5z" fill="#ffcd00"/>
                </svg>
                <svg v-else-if="lang.icon === 'germany'" viewBox="0 0 24 24" class="country-icon">
                  <rect width="24" height="8" fill="#000000"/>
                  <rect y="8" width="24" height="8" fill="#dd0000"/>
                  <rect y="16" width="24" height="8" fill="#ffce00"/>
                </svg>
                <svg v-else-if="lang.icon === 'spain'" viewBox="0 0 24 24" class="country-icon">
                  <rect width="24" height="6" fill="#c60b1e"/>
                  <rect y="6" width="24" height="12" fill="#ffc400"/>
                  <rect y="18" width="24" height="6" fill="#c60b1e"/>
                  <rect x="2" y="8" width="20" height="8" fill="#c60b1e"/>
                  <circle cx="12" cy="12" r="2" fill="#ffc400"/>
                </svg>
                <svg v-else-if="lang.icon === 'france'" viewBox="0 0 24 24" class="country-icon">
                  <rect width="8" height="24" fill="#002395"/>
                  <rect x="8" width="8" height="24" fill="#ffffff"/>
                  <rect x="16" width="8" height="24" fill="#ed2939"/>
                </svg>
                <svg v-else-if="lang.icon === 'italy'" viewBox="0 0 24 24" class="country-icon">
                  <rect width="8" height="24" fill="#009246"/>
                  <rect x="8" width="8" height="24" fill="#ffffff"/>
                  <rect x="16" width="8" height="24" fill="#ce2b37"/>
                </svg>
                <svg v-else-if="lang.icon === 'portugal'" viewBox="0 0 24 24" class="country-icon">
                  <rect width="12" height="24" fill="#046a38"/>
                  <rect x="12" width="12" height="24" fill="#da020e"/>
                  <circle cx="6" cy="12" r="4" fill="#ffed4a"/>
                  <circle cx="6" cy="12" r="2" fill="#046a38"/>
                </svg>
                <svg v-else-if="lang.icon === 'greece'" viewBox="0 0 24 24" class="country-icon">
                  <rect width="24" height="24" fill="#0d5eaf"/>
                  <rect x="0" y="0" width="24" height="3" fill="#ffffff"/>
                  <rect x="0" y="6" width="24" height="3" fill="#ffffff"/>
                  <rect x="0" y="12" width="24" height="3" fill="#ffffff"/>
                  <rect x="0" y="18" width="24" height="3" fill="#ffffff"/>
                  <rect x="0" y="0" width="8" height="12" fill="#ffffff"/>
                  <rect x="0" y="3" width="8" height="3" fill="#0d5eaf"/>
                  <rect x="0" y="9" width="8" height="3" fill="#0d5eaf"/>
                </svg>
                <span v-else class="flag-emoji">{{ lang.flag }}</span>
              </div>
              <span class="name">{{ lang.name }}</span>
            </div>
          </div>
        </div>
        
        <!-- 用户操作按钮 -->
        <div class="user-actions">
          <button class="action-btn login-btn" @click="goToLogin">
            {{ $t('header.login') }}
          </button>
          <button class="action-btn register-btn" @click="goToRegister">
            {{ $t('header.register') }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- 搜索栏（可选显示） -->
    <div v-if="showSearch" class="search-bar">
      <div class="search-input-wrapper">
        <i class="icon-search"></i>
        <input
          type="text"
          :placeholder="$t('header.searchPlaceholder')"
          v-model="searchQuery"
          @keyup.enter="handleSearch"
        />
        <button class="search-clear" v-if="searchQuery" @click="clearSearch">
          <i class="icon-close"></i>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import config from '@/config';

const router = useRouter();
const { locale } = useI18n();

// 响应式数据
const isScrolled = ref(false);
const sidebarVisible = ref(false);
const languageMenuVisible = ref(false);
const showSearch = ref(false);
const searchQuery = ref('');

// 语言配置
const languages = ref([
  { code: 'zh-CN', name: '简体中文', flag: '🇨🇳', icon: 'china' },
  { code: 'zh-TW', name: '繁體中文', flag: '🇹🇼', icon: 'taiwan' },
  { code: 'en-US', name: 'English', flag: '🇺🇸', icon: 'usa' },
  { code: 'ja-JP', name: '日本語', flag: '🇯🇵', icon: 'japan' },
  { code: 'ko-KR', name: '한국어', flag: '🇰🇷', icon: 'korea' },
  { code: 'th-TH', name: 'ไทย', flag: '🇹🇭', icon: 'thailand' },
  { code: 'vi-VN', name: 'Tiếng Việt', flag: '🇻🇳', icon: 'vietnam' },
  { code: 'de-DE', name: 'Deutsch', flag: '🇩🇪', icon: 'germany' },
  { code: 'es-ES', name: 'Español', flag: '🇪🇸', icon: 'spain' },
  { code: 'fr-FR', name: 'Français', flag: '🇫🇷', icon: 'france' },
  { code: 'it-IT', name: 'Italiano', flag: '🇮🇹', icon: 'italy' },
  { code: 'pt-PT', name: 'Português', flag: '🇵🇹', icon: 'portugal' },
  { code: 'el-GR', name: 'Ελληνικά', flag: '🇬🇷', icon: 'greece' }
]);

// 当前语言
const currentLanguageCode = computed(() => locale.value);
const currentLanguage = computed(() => {
  const lang = languages.value.find(l => l.code === currentLanguageCode.value);
  return lang ? lang.name : 'English';
});

// 滚动事件处理
const handleScroll = () => {
  isScrolled.value = window.scrollY > 10;
};

// 切换侧边栏
const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value;
  // 通知父组件
  emit('toggle-sidebar', sidebarVisible.value);
};

// 切换语言菜单
const toggleLanguageMenu = () => {
  languageMenuVisible.value = !languageMenuVisible.value;
};

// 选择语言
const selectLanguage = (lang) => {
  locale.value = lang.code;
  localStorage.setItem('lang', lang.code);
  languageMenuVisible.value = false;
};

// 跳转到登录页
const goToLogin = () => {
  // 跳转到交易app的登录页面
  window.location.href = config.URLS.LOGIN();
};

// 跳转到注册页
const goToRegister = () => {
  // 跳转到交易app的注册页面
  window.location.href = config.URLS.REGISTER();
};

// 处理搜索
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // 实现搜索逻辑
    console.log('Search:', searchQuery.value);
  }
};

// 清除搜索
const clearSearch = () => {
  searchQuery.value = '';
};

// 点击外部关闭菜单
const handleClickOutside = (event) => {
  if (!event.target.closest('.language-selector')) {
    languageMenuVisible.value = false;
  }
};

// 生命周期
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  document.removeEventListener('click', handleClickOutside);
});

// 定义事件
const emit = defineEmits(['toggle-sidebar']);
</script>

<style lang="scss" scoped>
.mobile-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  
  &.scrolled {
    background: rgba(10, 10, 10, 0.98);
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
  }
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 16px;
  max-width: 100%;
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
  
  .hamburger-line {
    width: 20px;
    height: 2px;
    background: white;
    margin: 2px 0;
    transition: all 0.3s ease;
    border-radius: 1px;
  }
  
  &.active {
    .hamburger-line:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }
    
    .hamburger-line:nth-child(2) {
      opacity: 0;
    }
    
    .hamburger-line:nth-child(3) {
      transform: rotate(-45deg) translate(7px, -6px);
    }
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
  }
}

.header-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  
  img {
    width: 32px;
    height: 32px;
    border-radius: 6px;
  }
  
  .logo-text {
    font-size: 18px;
    font-weight: bold;
    color: #ffd700;
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.language-selector {
  position: relative;
  
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
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
    
    &.active {
      background: rgba(30, 64, 175, 0.3);
      border-color: #1e40af;
    }
    
    i {
      font-size: 12px;
    }
  }
  
  .language-menu {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 8px;
    background: rgba(20, 20, 20, 0.95);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    min-width: 160px;
    max-height: 300px;
    overflow-y: auto;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.3s ease;
    z-index: 1001;
    
    &.visible {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    
    .language-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      
      &.active {
        background: rgba(30, 64, 175, 0.3);
        color: #ffd700;
      }
      
      .flag-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        
        .country-icon {
          width: 20px;
          height: 20px;
          border-radius: 2px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }
        
        .flag-emoji {
          font-size: 16px;
        }
      }
      
      .flag {
        font-size: 16px;
      }
      
      .name {
        font-size: 14px;
      }
    }
  }
}

.user-actions {
  display: flex;
  gap: 8px;
  
  .action-btn {
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
    
    &.login-btn {
      background: transparent;
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      
      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }
    }
    
    &.register-btn {
      background: #ffd700;
      color: #1a1a1a;
      
      &:hover {
        background: #ffed4e;
        transform: translateY(-1px);
      }
    }
  }
}

.search-bar {
  padding: 0 16px 12px;
  
  .search-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    
    i {
      position: absolute;
      left: 12px;
      color: #666;
      font-size: 16px;
    }
    
    input {
      width: 100%;
      height: 40px;
      padding: 0 40px 0 40px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      color: white;
      font-size: 14px;
      
      &::placeholder {
        color: #666;
      }
      
      &:focus {
        outline: none;
        border-color: #1e40af;
        background: rgba(255, 255, 255, 0.15);
      }
    }
    
    .search-clear {
      position: absolute;
      right: 12px;
      background: none;
      border: none;
      color: #666;
      cursor: pointer;
      padding: 4px;
      
      &:hover {
        color: white;
      }
    }
  }
}

// 平板样式
@media (min-width: 769px) and (max-width: 1024px) {
  .header-content {
    height: 70px;
    padding: 0 24px;
  }
  
  .header-logo {
    .logo-text {
      font-size: 20px;
    }
  }
  
  .user-actions .action-btn {
    padding: 10px 20px;
    font-size: 16px;
  }
}
</style>
