<template>
  <div style="position: fixed; top: 0; left: 0; right: 0; height: 70px; background: #000000; border-bottom: 1px solid #333; z-index: 10000;">
    <div style="display: flex; justify-content: space-between; align-items: center; height: 100%; max-width: 1400px; margin: 0 auto; padding: 0 30px;">

      <!-- 左侧Logo和菜单 -->
      <div style="display: flex; align-items: center; gap: 50px;">
        <div style="cursor: pointer;" @click="goHome">
          <span style="font-size: 28px; font-weight: 800; color: #bcff2f;">MSX</span>
        </div>

        <div style="display: flex; gap: 20px;">
          <span
            @click="goTo('/rwa')"
            style="padding: 10px 18px; cursor: pointer; color: #ffffff; font-size: 14px; font-weight: 600; border-radius: 8px; transition: all 0.3s;"
            @mouseover="$event.target.style.background='rgba(188,255,47,0.2)'"
            @mouseout="$event.target.style.background='transparent'"
          >
            RWA
          </span>
          <span
            @click="goTo('/market')"
            style="padding: 10px 18px; cursor: pointer; color: #ffffff; font-size: 14px; font-weight: 600; border-radius: 8px; transition: all 0.3s;"
            @mouseover="$event.target.style.background='rgba(188,255,47,0.2)'"
            @mouseout="$event.target.style.background='transparent'"
          >
            加密货币
          </span>
          <span
            @click="goTo('/invite')"
            style="padding: 10px 18px; cursor: pointer; color: #ffffff; font-size: 14px; font-weight: 600; border-radius: 8px; transition: all 0.3s;"
            @mouseover="$event.target.style.background='rgba(188,255,47,0.2)'"
            @mouseout="$event.target.style.background='transparent'"
          >
            邀请
          </span>
          <span
            @click="goTo('/rewards')"
            style="padding: 10px 18px; cursor: pointer; color: #ffffff; font-size: 14px; font-weight: 600; border-radius: 8px; transition: all 0.3s;"
            @mouseover="$event.target.style.background='rgba(188,255,47,0.2)'"
            @mouseout="$event.target.style.background='transparent'"
          >
            奖励
          </span>
        </div>
      </div>

      <!-- 右侧功能 -->
      <div style="display: flex; align-items: center; gap: 20px;">
        <div style="padding: 8px 16px; background: rgba(255,255,255,0.1); border-radius: 6px;">
          <span style="color: #999; font-size: 12px; font-weight: 700; letter-spacing: 1px;">SOL</span>
        </div>

        <button
          @click="goTo('/login')"
          style="height: 38px; padding: 0 18px; background: #bcff2f; color: #000000; border: none; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.3s;"
          @mouseover="$event.target.style.background='#a8e628'"
          @mouseout="$event.target.style.background='#bcff2f'"
        >
          连接钱包
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

console.log('MSXNavFixed 组件已成功加载!')

const goHome = () => {
  console.log('点击Logo，跳转到首页')
  router.push('/')
}

const goTo = (path) => {
  console.log('跳转到:', path)
  router.push(path)
}
</script>