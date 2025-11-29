<template>
  <div class="msx-navigation">
    <div class="nav-container">
      <!-- 左侧区域 -->
      <div class="nav-left">
        <!-- Logo区域 -->
        <div class="logo-section" @click="handleLogoClick">
          <div class="logo-icon">MSX</div>
        </div>

        <!-- 导航菜单 -->
        <div class="nav-menu">
          <div
            v-for="item in navigationItems"
            :key="item.key"
            class="nav-item"
            :class="{ active: isCurrentRoute(item.route) }"
            @click="handleNavClick(item)"
          >
            <span class="nav-text">{{ item.label }}</span>
            <div class="nav-indicator"></div>
          </div>
        </div>
      </div>

      <!-- 右侧区域 -->
      <div class="nav-right">
        <!-- 功能图标组 -->
        <div class="function-icons">
          <div class="icon-item" @click="handleNetworkClick">
            <svg class="function-icon" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>

          <div class="icon-item" @click="handleWalletClick">
            <svg class="function-icon" viewBox="0 0 24 24" fill="none">
              <path d="M21 12V7H5C3.89543 7 3 7.89543 3 9V15C3 16.1046 3.89543 17 5 17H7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M21 12V17H19C17.8954 17 17 16.1046 17 15V14C17 12.8954 17.8954 12 19 12H21Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="8" cy="12" r="1" fill="currentColor"/>
              <circle cx="12" cy="12" r="1" fill="currentColor"/>
              <circle cx="16" cy="12" r="1" fill="currentColor"/>
            </svg>
          </div>

          <div class="icon-item" @click="handleSettingsClick">
            <svg class="function-icon" viewBox="0 0 24 24" fill="none">
              <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M19.4 15C19.2669 15.3016 19.2272 15.6472 19.286 15.972C19.3448 16.2968 19.4987 16.5915 19.73 16.81V16.81C19.9113 16.9913 20.0121 17.2377 20.0121 17.495C20.0121 17.7523 19.9113 17.9987 19.73 18.18L18.18 19.73C17.9987 19.9113 17.7523 20.0121 17.495 20.0121C17.2377 20.0121 16.9913 19.9113 16.81 19.73V19.73C16.5915 19.4987 16.2968 19.3448 15.972 19.286C15.6472 19.2272 15.3016 19.2669 15 19.4V19.4C14.7032 19.5394 14.4669 19.7813 14.3348 20.0815C14.2027 20.3816 14.1821 20.7202 14.2764 21.034V21.034C14.3707 21.3479 14.4748 21.6803 14.58 22.01V22.01C14.6852 22.3397 14.7893 22.6721 14.8836 22.986C14.9779 23.2999 14.9573 23.6385 14.8252 23.9386C14.6931 24.2388 14.4568 24.4807 14.16 24.62H14.16C13.8584 24.7531 13.5149 24.7734 13.1994 24.6776C12.8839 24.5819 12.6185 24.3756 12.45 24.09V24.09C12.2315 23.8587 11.9368 23.7048 11.612 23.646C11.2872 23.5872 10.9416 23.6269 10.64 23.76H10.64C10.3384 23.8931 10.1021 24.135 9.96996 24.4351C9.83785 24.7353 9.81721 25.0739 9.91155 25.3877V25.3877C10.0059 25.7016 10.11 26.034 10.2152 26.3638V26.3638C10.3204 26.6935 10.4245 27.0259 10.5188 27.3398C10.6132 27.6537 10.5925 27.9922 10.4604 28.2924C10.3283 28.5926 10.092 28.8345 9.7952 28.9739V28.9739C9.4936 29.107 9.1501 29.1273 8.8346 29.0315C8.51909 28.9358 8.2537 28.7295 8.0852 28.4439V28.4439C7.8667 28.2126 7.572 28.0587 7.2472 28C7.1908 27.9892 7.1336 27.983 7.076 27.9814C6.7582 27.9723 6.4453 28.0627 6.1852 28.2399C5.9251 28.4171 5.7308 28.6733 5.6304 28.9693V28.9693C5.53 29.2653 5.5281 29.587 5.625 29.8899V29.8899C5.7219 30.1928 5.8122 30.5086 5.8945 30.8374V30.8374C5.9768 31.1662 6.0504 31.5086 6.1145 31.8649C6.1786 32.2212 6.1333 32.5884 5.9854 32.9193C5.8375 33.2502 5.5941 33.5283 5.2852 33.7149V33.7149" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>

        <!-- SOL标识 -->
        <div class="sol-badge">
          <span class="sol-text">SOL</span>
        </div>

        <!-- 连接钱包按钮 -->
        <div class="wallet-section">
          <button
            v-if="!userStore.existToken"
            class="connect-wallet-btn"
            @click="handleConnectWallet"
          >
            连接钱包
          </button>

          <!-- 已登录状态的用户信息 -->
          <div v-else class="user-info" @click="handleUserMenu">
            <div class="user-avatar">
              <span>{{ userStore.userInfo?.username?.charAt(0) || 'U' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 移动端菜单按钮 -->
    <div class="mobile-menu-btn" @click="toggleMobileMenu">
      <div class="menu-line" :class="{ active: mobileMenuOpen }"></div>
      <div class="menu-line" :class="{ active: mobileMenuOpen }"></div>
      <div class="menu-line" :class="{ active: mobileMenuOpen }"></div>
    </div>

    <!-- 移动端侧边栏 -->
    <div class="mobile-sidebar" :class="{ open: mobileMenuOpen }">
      <div class="mobile-sidebar-content">
        <div class="mobile-header">
          <div class="logo-section" @click="handleLogoClick">
            <div class="logo-icon">MSX</div>
          </div>
          <div class="close-btn" @click="toggleMobileMenu">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>

        <div class="mobile-nav-menu">
          <div
            v-for="item in navigationItems"
            :key="item.key"
            class="mobile-nav-item"
            :class="{ active: isCurrentRoute(item.route) }"
            @click="handleMobileNavClick(item)"
          >
            <span class="mobile-nav-text">{{ item.label }}</span>
          </div>
        </div>

        <div class="mobile-footer">
          <button
            v-if="!userStore.existToken"
            class="mobile-connect-btn"
            @click="handleMobileConnectWallet"
          >
            连接钱包
          </button>

          <div v-else class="mobile-user-section">
            <div class="mobile-user-info">
              <div class="mobile-user-avatar">
                <span>{{ userStore.userInfo?.username?.charAt(0) || 'U' }}</span>
              </div>
              <span class="mobile-username">{{ userStore.userInfo?.username || '用户' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 遮罩层 -->
    <div
      v-if="mobileMenuOpen"
      class="mobile-overlay"
      @click="toggleMobileMenu"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { useI18n } from 'vue-i18n'

// 状态管理
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

// 响应式状态
const mobileMenuOpen = ref(false)

// 导航菜单配置
const navigationItems = computed(() => [
  {
    key: 'rwa',
    label: 'RWA',
    route: '/rwa',
    icon: '🏛️'
  },
  {
    key: 'crypto',
    label: '加密货币',
    route: '/market',
    icon: '₿'
  },
  {
    key: 'invite',
    label: '邀请',
    route: '/invite',
    icon: '👥'
  },
  {
    key: 'rewards',
    label: '奖励',
    route: '/rewards',
    icon: '🎁'
  }
])

// 方法定义
const handleLogoClick = () => {
  router.push('/')
}

const handleNavClick = (item) => {
  router.push(item.route)
}

const handleMobileNavClick = (item) => {
  router.push(item.route)
  mobileMenuOpen.value = false
}

const isCurrentRoute = (routePath) => {
  return route.path === routePath || route.path.startsWith(routePath)
}

const handleConnectWallet = () => {
  router.push('/login')
}

const handleMobileConnectWallet = () => {
  router.push('/login')
  mobileMenuOpen.value = false
}

const handleNetworkClick = () => {
  // 网络选择逻辑
  console.log('Network clicked')
}

const handleWalletClick = () => {
  // 钱包功能逻辑
  router.push('/wallet')
}

const handleSettingsClick = () => {
  // 设置功能逻辑
  router.push('/settings')
}

const handleUserMenu = () => {
  // 用户菜单逻辑
  router.push('/user')
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
  // 防止背景滚动
  if (mobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

// 生命周期
onMounted(() => {
  // 监听窗口大小变化
  const handleResize = () => {
    if (window.innerWidth > 768 && mobileMenuOpen.value) {
      mobileMenuOpen.value = false
      document.body.style.overflow = ''
    }
  }

  window.addEventListener('resize', handleResize)

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    document.body.style.overflow = ''
  })
})
</script>

<style lang="scss" scoped>
// CSS变量定义 - 基于msx.com的设计系统
:root {
  --msx-bg-primary: #000000;
  --msx-bg-secondary: #141414;
  --msx-bg-glass: rgba(255, 255, 255, 0.05);
  --msx-text-primary: #ffffff;
  --msx-text-secondary: rgba(255, 255, 255, 0.7);
  --msx-text-muted: rgba(255, 255, 255, 0.4);
  --msx-accent-green: #bcff2f;
  --msx-accent-green-hover: #a8e628;
  --msx-border-color: rgba(255, 255, 255, 0.08);
  --msx-border-color-hover: rgba(255, 255, 255, 0.12);
  --msx-shadow-glass: 0 4px 20px rgba(0, 0, 0, 0.3);
  --msx-shadow-glow: 0 0 20px rgba(188, 255, 47, 0.3);
  --msz-transition-base: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --msx-transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

.msx-navigation {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: var(--msx-bg-primary);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--msx-border-color);
  transition: all var(--msz-transition-base);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.6) 100%);
    pointer-events: none;
    z-index: -1;
  }
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
}

// 左侧区域
.nav-left {
  display: flex;
  align-items: center;
  gap: 48px;
}

.logo-section {
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all var(--msz-transition-base);

  &:hover {
    transform: translateY(-1px);

    .logo-icon {
      color: var(--msx-accent-green);
      text-shadow: 0 0 20px rgba(188, 255, 47, 0.5);
    }
  }
}

.logo-icon {
  font-size: 28px;
  font-weight: 800;
  color: var(--msx-text-primary);
  letter-spacing: -1px;
  transition: all var(--msz-transition-base);
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-item {
  position: relative;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 8px;
  transition: all var(--msz-transition-base);

  &:hover {
    background: var(--msx-bg-glass);

    .nav-text {
      color: var(--msx-accent-green);
    }

    .nav-indicator {
      opacity: 1;
      transform: scaleX(1);
    }
  }

  &.active {
    background: var(--msx-bg-glass);

    .nav-text {
      color: var(--msx-accent-green);
    }

    .nav-indicator {
      opacity: 1;
      transform: scaleX(1);
      background: var(--msx-accent-green);
    }
  }
}

.nav-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--msx-text-primary);
  transition: all var(--msz-transition-base);
  letter-spacing: -0.3px;
}

.nav-indicator {
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 20px;
  height: 2px;
  background: var(--msx-text-primary);
  border-radius: 1px;
  opacity: 0;
  transition: all var(--msz-transition-base);
}

// 右侧区域
.nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.function-icons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-item {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  transition: all var(--msz-transition-base);

  &:hover {
    background: var(--msx-bg-glass);

    .function-icon {
      color: var(--msx-accent-green);
    }
  }
}

.function-icon {
  width: 20px;
  height: 20px;
  color: var(--msx-text-secondary);
  transition: all var(--msz-transition-base);
}

.sol-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  background: var(--msx-bg-glass);
  border: 1px solid var(--msx-border-color);
  border-radius: 6px;
  transition: all var(--msz-transition-base);

  &:hover {
    background: var(--msx-bg-secondary);
    border-color: var(--msx-accent-green);
  }
}

.sol-text {
  font-size: 12px;
  font-weight: 600;
  color: var(--msx-text-primary);
  letter-spacing: 0.5px;
}

.wallet-section {
  display: flex;
  align-items: center;
}

.connect-wallet-btn {
  height: 36px;
  padding: 0 15px;
  background: var(--msx-accent-green);
  color: var(--msx-bg-primary);
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--msz-transition-base);
  letter-spacing: -0.3px;

  &:hover {
    background: var(--msx-accent-green-hover);
    transform: translateY(-1px);
    box-shadow: var(--msx-shadow-glow);
  }

  &:active {
    transform: translateY(0);
  }
}

.user-info {
  width: 40px;
  height: 40px;
  cursor: pointer;
  transition: all var(--msz-transition-base);

  &:hover {
    transform: translateY(-1px);

    .user-avatar {
      border-color: var(--msx-accent-green);
      box-shadow: var(--msx-shadow-glow);
    }
  }
}

.user-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: var(--msx-bg-glass);
  border: 2px solid var(--msx-border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--msz-transition-base);

  span {
    font-size: 14px;
    font-weight: 600;
    color: var(--msx-text-primary);
  }
}

// 移动端样式
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  cursor: pointer;
  gap: 4px;
}

.menu-line {
  width: 20px;
  height: 2px;
  background: var(--msx-text-primary);
  border-radius: 1px;
  transition: all var(--msz-transition-base);

  &.active {
    &:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }

    &:nth-child(2) {
      opacity: 0;
    }

    &:nth-child(3) {
      transform: rotate(-45deg) translate(7px, -6px);
    }
  }
}

.mobile-sidebar {
  position: fixed;
  top: 0;
  right: -100%;
  width: 80%;
  max-width: 400px;
  height: 100vh;
  background: var(--msx-bg-primary);
  backdrop-filter: blur(20px);
  z-index: 1001;
  transition: right var(--msz-transition-base);

  &.open {
    right: 0;
    box-shadow: var(--msx-shadow-glass);
  }
}

.mobile-sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 24px;
}

.mobile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.close-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 8px;
  transition: all var(--msz-transition-base);

  &:hover {
    background: var(--msx-bg-glass);

    svg {
      color: var(--msx-accent-green);
    }
  }

  svg {
    width: 20px;
    height: 20px;
    color: var(--msx-text-secondary);
    transition: all var(--msz-transition-base);
  }
}

.mobile-nav-menu {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mobile-nav-item {
  padding: 16px 20px;
  border-radius: 12px;
  cursor: pointer;
  transition: all var(--msz-transition-base);

  &:hover {
    background: var(--msx-bg-glass);

    .mobile-nav-text {
      color: var(--msx-accent-green);
    }
  }

  &.active {
    background: var(--msx-bg-glass);

    .mobile-nav-text {
      color: var(--msx-accent-green);
    }
  }
}

.mobile-nav-text {
  font-size: 16px;
  font-weight: 500;
  color: var(--msx-text-primary);
  transition: all var(--msz-transition-base);
}

.mobile-footer {
  margin-top: auto;
  padding-top: 24px;
}

.mobile-connect-btn {
  width: 100%;
  height: 48px;
  background: var(--msx-accent-green);
  color: var(--msx-bg-primary);
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--msz-transition-base);

  &:hover {
    background: var(--msx-accent-green-hover);
    transform: translateY(-1px);
    box-shadow: var(--msx-shadow-glow);
  }
}

.mobile-user-section {
  display: flex;
  align-items: center;
  padding: 16px;
  background: var(--msx-bg-glass);
  border-radius: 12px;
}

.mobile-user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mobile-user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--msx-bg-secondary);
  border: 2px solid var(--msx-border-color);
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    font-size: 14px;
    font-weight: 600;
    color: var(--msx-text-primary);
  }
}

.mobile-username {
  font-size: 16px;
  font-weight: 500;
  color: var(--msx-text-primary);
}

.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1000;
}

// 响应式设计
@media (max-width: 768px) {
  .nav-container {
    padding: 0 16px;
  }

  .nav-left {
    gap: 24px;
  }

  .nav-menu {
    display: none;
  }

  .function-icons {
    display: none;
  }

  .sol-badge {
    display: none;
  }

  .mobile-menu-btn {
    display: flex;
  }
}

@media (max-width: 480px) {
  .nav-container {
    height: 56px;
    padding: 0 12px;
  }

  .logo-icon {
    font-size: 24px;
  }
}

// 动画效果
@keyframes glow {
  0% {
    box-shadow: 0 0 5px rgba(188, 255, 47, 0.2);
  }
  50% {
    box-shadow: 0 0 20px rgba(188, 255, 47, 0.4);
  }
  100% {
    box-shadow: 0 0 5px rgba(188, 255, 47, 0.2);
  }
}

.connect-wallet-btn:focus {
  outline: none;
  animation: glow 2s infinite;
}

// 深色主题优化
@media (prefers-color-scheme: dark) {
  .msx-navigation {
    border-bottom-color: rgba(255, 255, 255, 0.05);
  }
}

// 高对比度模式支持
@media (prefers-contrast: high) {
  :root {
    --msx-border-color: rgba(255, 255, 255, 0.2);
    --msx-text-secondary: rgba(255, 255, 255, 0.9);
  }
}

// 减少动画模式支持
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>