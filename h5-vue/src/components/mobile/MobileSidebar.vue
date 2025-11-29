<template>
  <div class="mobile-sidebar" :class="{ 'visible': visible }">
    <!-- 遮罩层 -->
    <div class="sidebar-overlay" @click="$emit('close')"></div>
    
    <!-- 侧边栏内容 -->
    <div class="sidebar-content">
      <!-- 头部 -->
      <div class="sidebar-header">
        <div class="user-info">
          <div class="user-avatar">
            <img src="@/assets/images/default-avatar.png" alt="用户头像" />
          </div>
          <div class="user-details">
            <h3>{{ $t('sidebar.welcome') }}</h3>
            <p>{{ $t('sidebar.subtitle') }}</p>
          </div>
        </div>
        <button class="close-btn" @click="$emit('close')">
          <i class="icon-close"></i>
        </button>
      </div>
      
      <!-- 搜索栏 -->
      <div class="sidebar-search">
        <div class="search-input-wrapper">
          <i class="icon-search"></i>
          <input 
            type="text" 
            :placeholder="$t('sidebar.searchPlaceholder')"
            v-model="searchQuery"
            @keyup.enter="handleSearch"
          />
        </div>
      </div>
      
      <!-- 导航菜单 -->
      <nav class="sidebar-nav">
        <div class="nav-section">
          <h4 class="nav-title">{{ $t('sidebar.mainFeatures') }}</h4>
          <div class="nav-items">
            <div 
              v-for="item in mainNavItems" 
              :key="item.name"
              class="nav-item"
              :class="{ 'active': isActive(item.route) }"
              @click="navigateTo(item)"
            >
              <div class="nav-icon">
                <i :class="item.icon"></i>
                <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
              </div>
              <span class="nav-label">{{ item.label }}</span>
              <i v-if="item.hasSubmenu" class="nav-arrow icon-chevron-right"></i>
            </div>
          </div>
        </div>
        
        <div class="nav-section">
          <h4 class="nav-title">{{ $t('sidebar.tradingTools') }}</h4>
          <div class="nav-items">
            <div 
              v-for="item in tradingNavItems" 
              :key="item.name"
              class="nav-item"
              :class="{ 'active': isActive(item.route) }"
              @click="navigateTo(item)"
            >
              <div class="nav-icon">
                <i :class="item.icon"></i>
              </div>
              <span class="nav-label">{{ item.label }}</span>
              <i v-if="item.hasSubmenu" class="nav-arrow icon-chevron-right"></i>
            </div>
          </div>
        </div>
        
        <div class="nav-section">
          <h4 class="nav-title">{{ $t('sidebar.supportServices') }}</h4>
          <div class="nav-items">
            <div 
              v-for="item in supportNavItems" 
              :key="item.name"
              class="nav-item"
              :class="{ 'active': isActive(item.route) }"
              @click="navigateTo(item)"
            >
              <div class="nav-icon">
                <i :class="item.icon"></i>
              </div>
              <span class="nav-label">{{ item.label }}</span>
              <i v-if="item.hasSubmenu" class="nav-arrow icon-chevron-right"></i>
            </div>
          </div>
        </div>
      </nav>
      
      <!-- 设置区域 -->
      <div class="sidebar-settings">
        <div class="setting-item">
          <div class="setting-info">
            <i class="icon-moon"></i>
            <span>{{ $t('sidebar.darkMode') }}</span>
          </div>
          <div class="setting-control">
            <label class="switch">
              <input type="checkbox" v-model="darkMode" @change="toggleDarkMode">
              <span class="slider"></span>
            </label>
          </div>
        </div>
        
        <div class="setting-item">
          <div class="setting-info">
            <i class="icon-headset"></i>
            <span>{{ $t('sidebar.support247') }}</span>
          </div>
          <div class="setting-control">
            <button class="support-btn" @click="openSupport">
              <i class="icon-arrow-right"></i>
            </button>
          </div>
        </div>
        
        <div class="setting-item">
          <div class="setting-info">
            <i class="icon-download"></i>
            <span>{{ $t('sidebar.downloadApp') }}</span>
          </div>
          <div class="setting-control">
            <button class="download-btn" @click="downloadApp">
              <i class="icon-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
      
      <!-- 底部信息 -->
      <div class="sidebar-footer">
        <div class="language-selector">
          <i class="icon-globe"></i>
          <span>{{ $t('sidebar.language') }}</span>
          <i class="icon-chevron-down"></i>
        </div>
        <div class="currency-selector">
          <i class="icon-dollar"></i>
          <span>USD</span>
          <i class="icon-chevron-down"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const route = useRoute();
const router = useRouter();

// 响应式数据
const searchQuery = ref('');
const darkMode = ref(false);

// 主要导航项
const { t } = useI18n();
const mainNavItems = computed(() => [
  {
    name: 'home',
    label: t('nav.home'),
    icon: 'icon-home',
    route: '/home',
    external: false
  },
  {
    name: 'trading',
    label: t('nav.trading'),
    icon: 'icon-trading',
    route: '/trading',
    external: false,
    badge: 'HOT'
  },
  {
    name: 'market',
    label: t('nav.market'),
    icon: 'icon-chart',
    route: '/market',
    external: false
  },
  {
    name: 'platform',
    label: t('nav.platform'),
    icon: 'icon-platform',
    route: '/platform',
    external: false
  }
]);

// 交易工具导航项
const tradingNavItems = computed(() => [
  {
    name: 'forex',
    label: t('sidebar.forex'),
    icon: 'icon-forex',
    route: '/trading/forex',
    external: false
  },
  {
    name: 'crypto',
    label: t('sidebar.crypto'),
    icon: 'icon-crypto',
    route: '/trading/crypto',
    external: false
  },
  {
    name: 'stocks',
    label: t('sidebar.stocks'),
    icon: 'icon-stocks',
    route: '/trading/stocks',
    external: false
  },
  {
    name: 'commodities',
    label: t('sidebar.commodities'),
    icon: 'icon-commodities',
    route: '/trading/commodities',
    external: false
  }
]);

// 支持服务导航项
const supportNavItems = computed(() => [
  {
    name: 'education',
    label: t('nav.education'),
    icon: 'icon-education',
    route: '/education',
    external: false
  },
  {
    name: 'analysis',
    label: t('nav.analysis'),
    icon: 'icon-analysis',
    route: '/analysis',
    external: false
  },
  {
    name: 'support',
    label: t('nav.support'),
    icon: 'icon-support',
    route: '/support',
    external: false
  },
  {
    name: 'about',
    label: t('nav.about'),
    icon: 'icon-info',
    route: '/about',
    external: false
  }
]);

// 检查当前路由是否激活
const isActive = (itemRoute) => {
  if (itemRoute === '/home') {
    return route.path === '/' || route.path === '/home';
  }
  return route.path.startsWith(itemRoute);
};

// 导航到指定页面
const navigateTo = (item) => {
  if (item.external) {
    window.open(item.route, '_blank');
  } else {
    if (route.path !== item.route) {
      router.push(item.route);
    }
  }
  // 关闭侧边栏
  emit('close');
};

// 处理搜索
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    console.log('Search:', searchQuery.value);
    // 实现搜索逻辑
  }
};

// 切换夜间模式
const toggleDarkMode = () => {
  document.body.classList.toggle('dark-mode', darkMode.value);
  localStorage.setItem('darkMode', darkMode.value);
};

// 打开客服支持
const openSupport = () => {
  // 实现客服支持逻辑
  console.log('Open Support');
};

// 下载APP
const downloadApp = () => {
  // 实现APP下载逻辑
  console.log('Download App');
};

// 定义事件
const emit = defineEmits(['close']);

// 定义props
defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

// 初始化
onMounted(() => {
  // 从本地存储加载夜间模式设置
  const savedDarkMode = localStorage.getItem('darkMode');
  if (savedDarkMode !== null) {
    darkMode.value = savedDarkMode === 'true';
    document.body.classList.toggle('dark-mode', darkMode.value);
  }
});
</script>

<style lang="scss" scoped>
.mobile-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1001;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  
  &.visible {
    opacity: 1;
    visibility: visible;
  }
}

.sidebar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.sidebar-content {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 280px;
  max-width: 85vw;
  background: rgba(20, 20, 20, 0.95);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  
  .mobile-sidebar.visible & {
    transform: translateX(0);
  }
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .user-avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      overflow: hidden;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    
    .user-details {
      h3 {
        margin: 0;
        font-size: 16px;
        color: white;
        font-weight: 600;
      }
      
      p {
        margin: 4px 0 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  
  .close-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
}

.sidebar-search {
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
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
      padding: 0 12px 0 40px;
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
  }
}

.sidebar-nav {
  flex: 1;
  padding: 20px 0;
  
  .nav-section {
    margin-bottom: 24px;
    
    .nav-title {
      margin: 0 0 12px 20px;
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .nav-items {
      .nav-item {
        display: flex;
        align-items: center;
        padding: 12px 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        
        &:hover {
          background: rgba(255, 255, 255, 0.05);
        }
        
        &.active {
          background: rgba(30, 64, 175, 0.2);
          border-right: 3px solid #1e40af;
          
          .nav-icon {
            color: #ffd700;
          }
          
          .nav-label {
            color: #ffd700;
            font-weight: 600;
          }
        }
        
        .nav-icon {
          position: relative;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
          transition: all 0.3s ease;
          
          i {
            font-size: 18px;
          }
          
          .nav-badge {
            position: absolute;
            top: -6px;
            right: -6px;
            background: #ff4757;
            color: white;
            font-size: 8px;
            font-weight: bold;
            padding: 2px 4px;
            border-radius: 8px;
            min-width: 12px;
            text-align: center;
            line-height: 1;
          }
        }
        
        .nav-label {
          flex: 1;
          margin-left: 12px;
          color: white;
          font-size: 14px;
          transition: all 0.3s ease;
        }
        
        .nav-arrow {
          color: #666;
          font-size: 12px;
          transition: all 0.3s ease;
        }
      }
    }
  }
}

.sidebar-settings {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  
  .setting-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0;
    
    .setting-info {
      display: flex;
      align-items: center;
      gap: 12px;
      color: white;
      font-size: 14px;
      
      i {
        width: 20px;
        color: #999;
      }
    }
    
    .setting-control {
      .switch {
        position: relative;
        display: inline-block;
        width: 44px;
        height: 24px;
        
        input {
          opacity: 0;
          width: 0;
          height: 0;
          
          &:checked + .slider {
            background-color: #1e40af;
            
            &:before {
              transform: translateX(20px);
            }
          }
        }
        
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #333;
          transition: 0.3s;
          border-radius: 24px;
          
          &:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: 0.3s;
            border-radius: 50%;
          }
        }
      }
      
      .support-btn,
      .download-btn {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        
        &:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      }
    }
  }
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  gap: 16px;
  
  .language-selector,
  .currency-selector {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    color: white;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
    
    i {
      font-size: 14px;
      color: #999;
    }
  }
}
</style>
