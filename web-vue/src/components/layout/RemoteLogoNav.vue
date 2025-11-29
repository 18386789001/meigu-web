<template>
  <nav style="position: fixed; top: 0; left: 0; right: 0; height: 56px; background: #000000; border-bottom: 1px solid rgba(255, 255, 255, 0.08); z-index: 99999; display: flex; align-items: center; justify-content: space-between; padding: 0 32px;">

    <!-- 左侧Logo和菜单 -->
    <div style="display: flex; align-items: center; gap: 48px;">
      <!-- Logo区域 - 使用本地logo图片 -->
      <div @click="goHome" style="display: flex; align-items: center; cursor: pointer;">
        <img
          src="/images/logo.png"
          alt="MSX Logo"
          style="height: 32px; width: auto; object-fit: contain;"
          @load="onLogoLoad"
          @error="onLogoError"
        />
      </div>

      <!-- 导航菜单 -->
      <div style="display: flex; gap: 32px;">
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
    <div style="display: flex; align-items: center; gap: 24px;">
      <!-- 功能图标 -->
      <div style="display: flex; align-items: center; gap: 16px;">
        <!-- 网络图标 -->
        <div
          @click="handleNetwork"
          style="width: 20px; height: 20px; cursor: pointer; color: rgba(255, 255, 255, 0.7);"
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
          style="width: 20px; height: 20px; cursor: pointer; color: rgba(255, 255, 255, 0.7);"
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
          style="width: 20px; height: 20px; cursor: pointer; color: rgba(255, 255, 255, 0.7);"
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
      <div style="padding: 6px 12px; background: rgba(255, 255, 255, 0.08); border-radius: 6px; color: rgba(255, 255, 255, 0.8); font-size: 12px; font-weight: 600; letter-spacing: 1px;">
        SOL
      </div>

      <!-- 连接钱包按钮 -->
      <button
        @click="connectWallet"
        style="height: 36px; padding: 0 16px; background: #bcff2f; color: #000000; border: none; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease;"
        @mouseover="$event.target.style.background='#a8e628'"
        @mouseout="$event.target.style.background='#bcff2f'"
      >
        Connect Wallet
      </button>
    </div>

  </nav>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 英文菜单项
const leftMenuItems = [
  { key: 'rwa', label: 'RWA', route: '/rwa' },
  { key: 'crypto', label: 'Crypto', route: '/market' },
  { key: 'invite', label: 'Invite', route: '/invite' },
  { key: 'rewards', label: 'Rewards', route: '/rewards' }
]

const getMenuItemStyle = (routePath) => {
  const isActive = route.path === routePath || route.path.startsWith(routePath)
  return {
    padding: '8px 0px',
    color: isActive ? '#bcff2f' : '#ffffff',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'color 0.2s ease'
  }
}

const handleHover = (event, isHover) => {
  if (event.target.style.color !== 'rgb(188, 255, 47)') { // 如果不是激活状态
    event.target.style.color = isHover ? '#bcff2f' : '#ffffff'
  }
}

const onLogoLoad = () => {
  console.log('✅ 本地Logo图片加载成功')
}

const onLogoError = () => {
  console.log('❌ 本地Logo图片加载失败，使用备用方案')
  // 可以在这里设置备用logo显示
}

const goHome = () => {
  console.log('点击Logo')
  router.push('/')
}

const goTo = (path) => {
  console.log('跳转到:', path)
  router.push(path)
}

const handleNetwork = () => console.log('网络设置')
const handleWallet = () => console.log('钱包功能')
const handleSettings = () => console.log('设置')
const connectWallet = () => {
  console.log('连接钱包')
  router.push('/login')
}

console.log('RemoteLogoNav 组件已加载 - 使用本地logo图片')
</script>