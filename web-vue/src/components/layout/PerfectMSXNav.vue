<template>
  <nav class="msx-nav">
    <div class="nav-container">
      <!-- 左侧Logo和菜单 -->
      <div class="nav-left">
        <div class="logo" @click="goHome">MSX</div>

        <div class="nav-menu">
          <div
            v-for="item in menuItems"
            :key="item.key"
            class="nav-item"
            :class="{ active: isActive(item.route) }"
            @click="goTo(item.route)"
          >
            {{ item.label }}
          </div>
        </div>
      </div>

      <!-- 右侧功能 -->
      <div class="nav-right">
        <div class="sol-badge">SOL</div>
        <button class="connect-btn" @click="connectWallet">
          连接钱包
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const menuItems = [
  { key: 'rwa', label: 'RWA', route: '/rwa' },
  { key: 'crypto', label: '加密货币', route: '/market' },
  { key: 'invite', label: '邀请', route: '/invite' },
  { key: 'rewards', label: '奖励', route: '/rewards' }
]

const isActive = (routePath) => {
  return route.path === routePath || route.path.startsWith(routePath)
}

const goHome = () => {
  router.push('/')
}

const goTo = (path) => {
  router.push(path)
}

const connectWallet = () => {
  router.push('/login')
}

console.log('PerfectMSXNav 组件已加载')
</script>

<style scoped>
.msx-nav {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  height: 70px !important;
  background: #000000 !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
  z-index: 9999 !important;
  backdrop-filter: blur(10px) !important;
  display: block !important;
  width: 100% !important;
}

.nav-container {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  height: 100% !important;
  max-width: 1400px !important;
  margin: 0 auto !important;
  padding: 0 30px !important;
  width: 100% !important;
}

.nav-left {
  display: flex !important;
  align-items: center !important;
  gap: 50px !important;
}

.logo {
  font-size: 28px !important;
  font-weight: 800 !important;
  color: #bcff2f !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
  display: block !important;
}

.logo:hover {
  transform: translateY(-1px);
  text-shadow: 0 2px 8px rgba(188, 255, 47, 0.3);
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-item {
  padding: 10px 18px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
  user-select: none;
}

.nav-item:hover {
  background: rgba(188, 255, 47, 0.15);
  color: #bcff2f;
}

.nav-item.active {
  background: rgba(188, 255, 47, 0.2);
  color: #bcff2f;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.sol-badge {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #999999;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  transition: all 0.3s ease;
}

.sol-badge:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

.connect-btn {
  height: 38px;
  padding: 0 18px;
  background: #bcff2f;
  color: #000000;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.connect-btn:hover {
  background: #a8e628;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(188, 255, 47, 0.3);
}

.connect-btn:active {
  transform: translateY(0);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-container {
    padding: 0 16px;
  }

  .nav-left {
    gap: 24px;
  }

  .nav-menu {
    gap: 8px;
  }

  .nav-item {
    padding: 8px 12px;
    font-size: 12px;
  }

  .logo {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .nav-menu {
    display: none;
  }

  .nav-container {
    padding: 0 12px;
  }
}
</style>