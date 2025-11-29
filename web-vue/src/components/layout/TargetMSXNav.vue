<template>
  <nav style="position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; height: 56px !important; background: #000000 !important; border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important; z-index: 99999 !important; display: flex !important; align-items: center !important; justify-content: space-between !important; padding: 0 32px !important; width: 100% !important; box-sizing: border-box !important;">

    <!-- 左侧Logo和菜单 -->
    <div style="display: flex !important; align-items: center !important; gap: 48px !important;">
      <!-- Logo -->
      <div @click="goHome" style="display: flex !important; align-items: center !important; gap: 12px !important; cursor: pointer !important;">
        <img
          src="@/assets/images/logo.png"
          alt="MSX Logo"
          style="height: 28px !important; width: auto !important;"
        />
        <span style="color: #ffffff !important; font-size: 20px !important; font-weight: 700 !important;">
          MSX
        </span>
      </div>

      <!-- 导航菜单 -->
      <div style="display: flex !important; gap: 32px !important;">
        <span
          v-for="item in leftMenuItems"
          :key="item.key"
          :style="getMenuItemStyle(item.route)"
          @click="goTo(item.route)"
          @mouseover="handleHover($event, true)"
          @mouseout="handleHover($event, false)"
        >
          {{ item.label }}
        </span>
      </div>
    </div>

    <!-- 右侧功能菜单 -->
    <div style="display: flex !important; align-items: center !important; gap: 24px !important;">
      <!-- 功能图标 -->
      <div style="display: flex !important; align-items: center !important; gap: 16px !important;">
        <!-- 网络图标 -->
        <div
          @click="handleNetwork"
          style="width: 24px !important; height: 24px !important; cursor: pointer !important; color: rgba(255, 255, 255, 0.7) !important;"
          @mouseover="$event.target.style.color='#bcff2f'"
          @mouseout="$event.target.style.color='rgba(255, 255, 255, 0.7)'"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </div>

        <!-- 钱包图标 -->
        <div
          @click="handleWallet"
          style="width: 24px !important; height: 24px !important; cursor: pointer !important; color: rgba(255, 255, 255, 0.7) !important;"
          @mouseover="$event.target.style.color='#bcff2f'"
          @mouseout="$event.target.style.color='rgba(255, 255, 255, 0.7)'"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
            <rect x="3" y="11" width="18" height="8" rx="1" ry="1"/>
          </svg>
        </div>

        <!-- 设置图标 -->
        <div
          @click="handleSettings"
          style="width: 24px !important; height: 24px !important; cursor: pointer !important; color: rgba(255, 255, 255, 0.7) !important;"
          @mouseover="$event.target.style.color='#bcff2f'"
          @mouseout="$event.target.style.color='rgba(255, 255, 255, 0.7)'"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v6m0 6v6m4.22-13.22l4.24 4.24M1.54 1.54l4.24 4.24M20.46 20.46l-4.24-4.24M1.54 20.46l4.24-4.24"/>
          </svg>
        </div>
      </div>

      <!-- SOL标识 -->
      <div style="padding: 6px 12px !important; background: rgba(255, 255, 255, 0.08) !important; border-radius: 6px !important; color: rgba(255, 255, 255, 0.8) !important; font-size: 12px !important; font-weight: 600 !important; letter-spacing: 1px !important;">
        SOL
      </div>

      <!-- 连接钱包按钮 -->
      <button
        @click="connectWallet"
        style="height: 36px !important; padding: 0 16px !important; background: #bcff2f !important; color: #000000 !important; border: none !important; border-radius: 6px !important; font-size: 14px !important; font-weight: 600 !important; cursor: pointer !important; transition: all 0.2s ease !important;"
        @mouseover="$event.target.style.background='#a8e628'"
        @mouseout="$event.target.style.background='#bcff2f'"
      >
        Connect Wallet
      </button>
    </div>

  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 英文菜单项（根据截图）
const leftMenuItems = [
  { key: 'rwa', label: 'RWA', route: '/rwa' },
  { key: 'crypto', label: 'Crypto', route: '/market' },
  { key: 'invite', label: 'Invite', route: '/invite' },
  { key: 'rewards', label: 'Rewards', route: '/rewards' }
]

const getMenuItemStyle = (routePath) => {
  const isActive = route.path === routePath || route.path.startsWith(routePath)
  return {
    padding: '8px 0px !important',
    color: isActive ? '#bcff2f !important' : '#ffffff !important',
    fontSize: '14px !important',
    fontWeight: '500 !important',
    cursor: 'pointer !important',
    transition: 'color 0.2s ease !important',
    position: 'relative !important'
  }
}

const handleHover = (event, isHover) => {
  if (event.target.style.color !== 'rgb(188, 255, 47)') { // 如果不是激活状态
    event.target.style.color = isHover ? '#bcff2f' : '#ffffff'
  }
}

const goHome = () => {
  console.log('点击Logo')
  router.push('/')
}

const goTo = (path) => {
  console.log('跳转到:', path)
  router.push(path)
}

const handleNetwork = () => {
  console.log('网络设置')
}

const handleWallet = () => {
  console.log('钱包功能')
}

const handleSettings = () => {
  console.log('设置')
}

const connectWallet = () => {
  console.log('连接钱包')
  router.push('/login')
}

console.log('TargetMSXNav 组件已加载')
</script>