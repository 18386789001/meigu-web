<template>
  <nav class="mobile-bottom-nav">
    <div class="nav-items">
      <div 
        v-for="item in navItems" 
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
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

// 导航项配置
const navItems = computed(() => [
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
  },
  {
    name: 'more',
    label: t('nav.more'),
    icon: 'icon-more',
    route: '/more',
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
    // 外部链接
    window.open(item.route, '_blank');
  } else {
    // 内部路由
    if (route.path !== item.route) {
      router.push(item.route);
    }
  }
};
</script>

<style lang="scss" scoped>
.mobile-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 8px 0;
  padding-bottom: calc(8px + env(safe-area-inset-bottom));
}

.nav-items {
  display: flex;
  justify-content: space-around;
  align-items: center;
  max-width: 100%;
  padding: 0 8px;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  min-width: 60px;
  position: relative;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
  
  &.active {
    .nav-icon {
      color: #ffd700;
      transform: scale(1.1);
    }
    
    .nav-label {
      color: #ffd700;
      font-weight: 600;
    }
  }
}

.nav-icon {
  position: relative;
  font-size: 20px;
  color: #666;
  transition: all 0.3s ease;
  margin-bottom: 4px;
  
  .nav-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background: #ff4757;
    color: white;
    font-size: 10px;
    font-weight: bold;
    padding: 2px 6px;
    border-radius: 10px;
    min-width: 16px;
    text-align: center;
    line-height: 1;
  }
}

.nav-label {
  font-size: 12px;
  color: #999;
  transition: all 0.3s ease;
  text-align: center;
  line-height: 1.2;
}

// 平板样式
@media (min-width: 769px) and (max-width: 1024px) {
  .mobile-bottom-nav {
    padding: 12px 0;
    padding-bottom: calc(12px + env(safe-area-inset-bottom));
  }
  
  .nav-item {
    padding: 12px 8px;
    min-width: 80px;
  }
  
  .nav-icon {
    font-size: 24px;
    margin-bottom: 6px;
  }
  
  .nav-label {
    font-size: 14px;
  }
}

// 横屏样式
@media (orientation: landscape) and (max-height: 500px) {
  .mobile-bottom-nav {
    padding: 4px 0;
    padding-bottom: calc(4px + env(safe-area-inset-bottom));
  }
  
  .nav-item {
    padding: 4px 2px;
    min-width: 50px;
  }
  
  .nav-icon {
    font-size: 18px;
    margin-bottom: 2px;
  }
  
  .nav-label {
    font-size: 10px;
  }
}
</style>
