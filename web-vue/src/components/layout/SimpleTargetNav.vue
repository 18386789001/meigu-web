<template>
  <nav style="position: fixed; top: 0; left: 0; right: 0; height: 56px; background: #000000; border-bottom: 1px solid #bcff2f; z-index: 99999; display: flex; align-items: center; justify-content: space-between; padding: 0 32px;">

    <!-- 左侧Logo和菜单 -->
    <div style="display: flex; align-items: center; gap: 48px;">
      <!-- Logo区域 - 暂时用文字代替图片 -->
      <div @click="goHome" style="display: flex; align-items: center; gap: 12px; cursor: pointer;">
        <div style="width: 32px; height: 32px; background: #bcff2f; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #000000;">
          MSX
        </div>
        <span style="color: #ffffff; font-size: 20px; font-weight: 700;">
          MSX
        </span>
      </div>

      <!-- 导航菜单 -->
      <div style="display: flex; gap: 32px;">
        <span
          v-for="item in leftMenuItems"
          :key="item.key"
          :style="getMenuItemStyle(item.route)"
          @click="goTo(item.route)"
        >
          {{ item.label }}
        </span>
      </div>
    </div>

    <!-- 右侧功能菜单 -->
    <div style="display: flex; align-items: center; gap: 24px;">
      <!-- 简化的图标 -->
      <div style="display: flex; gap: 16px;">
        <span @click="handleNetwork" style="color: rgba(255,255,255,0.7); cursor: pointer;" @mouseover="$event.target.style.color='#bcff2f'" @mouseout="$event.target.style.color='rgba(255,255,255,0.7)'">⚡</span>
        <span @click="handleWallet" style="color: rgba(255,255,255,0.7); cursor: pointer;" @mouseover="$event.target.style.color='#bcff2f'" @mouseout="$event.target.style.color='rgba(255,255,255,0.7)'">💰</span>
        <span @click="handleSettings" style="color: rgba(255,255,255,0.7); cursor: pointer;" @mouseover="$event.target.style.color='#bcff2f'" @mouseout="$event.target.style.color='rgba(255,255,255,0.7)'">⚙️</span>
      </div>

      <!-- SOL标识 -->
      <div style="padding: 6px 12px; background: rgba(255,255,255,0.1); border-radius: 6px; color: rgba(255,255,255,0.8); font-size: 12px; font-weight: 600; letter-spacing: 1px;">
        SOL
      </div>

      <!-- 连接钱包按钮 -->
      <button
        @click="connectWallet"
        style="height: 36px; padding: 0 16px; background: #bcff2f; color: #000000; border: none; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer;"
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

console.log('SimpleTargetNav 组件已成功加载!')
</script>