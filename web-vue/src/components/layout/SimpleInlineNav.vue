<template>
  <nav style="position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; height: 70px !important; background: #000000 !important; border-bottom: 2px solid #bcff2f !important; z-index: 99999 !important; display: flex !important; align-items: center !important; justify-content: space-between !important; padding: 0 30px !important; width: 100% !important; box-sizing: border-box !important;">

    <!-- 左侧Logo和菜单 -->
    <div style="display: flex !important; align-items: center !important; gap: 50px !important;">
      <div style="font-size: 32px !important; font-weight: 900 !important; color: #bcff2f !important; cursor: pointer !important;" @click="goHome">
        MSX
      </div>

      <div style="display: flex !important; gap: 20px !important;">
        <span
          v-for="item in menuItems"
          :key="item.key"
          style="padding: 12px 20px !important; color: #ffffff !important; font-size: 16px !important; font-weight: 700 !important; cursor: pointer !important; border-radius: 8px !important; background: transparent !important; border: 1px solid transparent !important; transition: all 0.3s ease !important;"
          @click="goTo(item.route)"
          @mouseover="$event.target.style.background='rgba(188,255,47,0.2)'"
          @mouseout="$event.target.style.background='transparent'"
        >
          {{ item.label }}
        </span>
      </div>
    </div>

    <!-- 右侧功能 -->
    <div style="display: flex !important; align-items: center !important; gap: 25px !important;">
      <div style="padding: 10px 18px !important; background: rgba(255,255,255,0.15) !important; border-radius: 8px !important; color: #ffffff !important; font-size: 14px !important; font-weight: 800 !important; letter-spacing: 2px !important; border: 1px solid rgba(255,255,255,0.2) !important;">
        SOL
      </div>

      <button
        style="height: 42px !important; padding: 0 24px !important; background: #bcff2f !important; color: #000000 !important; border: none !important; border-radius: 8px !important; font-size: 16px !important; font-weight: 700 !important; cursor: pointer !important; transition: all 0.3s ease !important; box-shadow: 0 4px 12px rgba(188,255,47,0.3) !important;"
        @click="connectWallet"
        @mouseover="$event.target.style.background='#a8e628'; $event.target.style.transform='translateY(-2px)'"
        @mouseout="$event.target.style.background='#bcff2f'; $event.target.style.transform='translateY(0)'"
      >
        连接钱包
      </button>
    </div>

  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const menuItems = [
  { key: 'rwa', label: 'RWA', route: '/rwa' },
  { key: 'crypto', label: '加密货币', route: '/market' },
  { key: 'invite', label: '邀请', route: '/invite' },
  { key: 'rewards', label: '奖励', route: '/rewards' }
]

const goHome = () => {
  console.log('点击Logo')
  router.push('/')
}

const goTo = (path) => {
  console.log('跳转到:', path)
  router.push(path)
}

const connectWallet = () => {
  console.log('连接钱包')
  router.push('/login')
}

console.log('SimpleInlineNav 组件已加载')
</script>