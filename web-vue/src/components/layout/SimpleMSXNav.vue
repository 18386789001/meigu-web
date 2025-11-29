<template>
  <div class="simple-msx-nav" style="position: sticky; top: 0; z-index: 1000; background: #000000; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
    <div class="nav-container" style="display: flex; justify-content: space-between; align-items: center; height: 64px; max-width: 1400px; margin: 0 auto; padding: 0 24px;">
      <!-- 左侧Logo -->
      <div class="nav-left" style="display: flex; align-items: center; gap: 48px;">
        <div class="logo" @click="goHome" style="cursor: pointer; color: #ffffff; transition: color 0.3s ease;">
          <span style="font-weight: bold; font-size: 24px; color: #bcff2f;">MSX</span>
        </div>

        <!-- 导航菜单 -->
        <div class="nav-menu" style="display: flex; align-items: center; gap: 16px;">
          <span
            v-for="item in menuItems"
            :key="item.key"
            class="nav-item"
            :class="{ active: $route.path === item.route }"
            @click="goTo(item.route)"
            style="padding: 8px 16px; cursor: pointer; color: #ffffff; border-radius: 6px; transition: all 0.3s ease; font-size: 14px; font-weight: 500;"
          >
            {{ item.label }}
          </span>
        </div>
      </div>

      <!-- 右侧功能区 -->
      <div class="nav-right" style="display: flex; align-items: center; gap: 16px;">
        <span style="margin-right: 20px; color: #666; padding: 6px 12px; background: rgba(255,255,255,0.1); border-radius: 6px;">SOL</span>

        <button
          v-if="!userStore.existToken"
          class="connect-btn"
          @click="goToLogin"
          style="height: 36px; padding: 0 15px; background: #bcff2f; color: #000000; border: none; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.3s ease;"
        >
          连接钱包
        </button>

        <div v-else class="user-info" @click="goToUser" style="width: 40px; height: 40px; border-radius: 50%; background: rgba(255, 255, 255, 0.1); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease;">
          <div class="avatar" style="color: #ffffff; font-weight: 600;">
            {{ userStore.userInfo?.username?.charAt(0) || 'U' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useUserStore } from '@/store/user'
import { useRouter, useRoute } from 'vue-router'

console.log('SimpleMSXNav 组件开始加载')

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

onMounted(() => {
  console.log('SimpleMSXNav 组件已挂载')
  console.log('当前路由:', route.path)
  console.log('用户登录状态:', userStore.existToken)
})

const menuItems = [
  { key: 'rwa', label: 'RWA', route: '/rwa' },
  { key: 'crypto', label: '加密货币', route: '/market' },
  { key: 'invite', label: '邀请', route: '/invite' },
  { key: 'rewards', label: '奖励', route: '/rewards' }
]

const goHome = () => {
  router.push('/')
}

const goTo = (path) => {
  router.push(path)
}

const goToLogin = () => {
  router.push('/login')
}

const goToUser = () => {
  router.push('/user')
}
</script>

<style scoped>
.simple-msx-nav {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: #000000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 48px;
}

.logo {
  cursor: pointer;
  color: #ffffff;
  transition: color 0.3s ease;
}

.logo:hover {
  color: #bcff2f;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-item {
  padding: 8px 16px;
  cursor: pointer;
  color: #ffffff;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #bcff2f;
}

.nav-item.active {
  background: rgba(188, 255, 47, 0.1);
  color: #bcff2f;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.connect-btn {
  height: 36px;
  padding: 0 15px;
  background: #bcff2f;
  color: #000000;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.connect-btn:hover {
  background: #a8e628;
  transform: translateY(-1px);
}

.user-info {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-info:hover {
  background: rgba(188, 255, 47, 0.2);
  transform: translateY(-1px);
}

.avatar {
  color: #ffffff;
  font-weight: 600;
}

/* 移动端适配 */
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
    padding: 6px 12px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .nav-menu {
    display: none;
  }
}
</style>