<template>
  <div style="background: #000000; color: #ffffff; min-height: 100vh; padding: 30px;">
    <div style="max-width: 1200px; margin: 0 auto; padding: 60px 30px;">

      <h1 style="color: #bcff2f; font-size: 48px; font-weight: 800; margin-bottom: 30px;">
        去中心化 RWA 交易
      </h1>

      <h2 style="color: #ffffff; font-size: 28px; font-weight: 600; margin-bottom: 20px;">
        让优质资产自由流通
      </h2>

      <p style="color: #cccccc; font-size: 18px; margin-bottom: 50px; line-height: 1.6;">
        真实价值上链 从华尔街到你的钱包
      </p>

      <button
        @click="goToTrade"
        style="height: 60px; padding: 0 50px; background: #bcff2f; color: #000000; border: none; border-radius: 8px; font-size: 18px; font-weight: 700; cursor: pointer; transition: all 0.3s; margin-bottom: 60px;"
        @mouseover="$event.target.style.background='#a8e628'"
        @mouseout="$event.target.style.background='#bcff2f'"
      >
        立即交易
      </button>

      <!-- 调试信息区域 -->
      <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 30px; margin-bottom: 60px;">
        <h3 style="color: #bcff2f; font-size: 20px; margin-bottom: 20px;">导航栏状态检查</h3>
        <p style="color: #ffffff; margin-bottom: 10px;">✅ 导航栏组件: MSXNavFixed 已加载</p>
        <p style="color: #ffffff; margin-bottom: 10px;">✅ 背景颜色: 黑色 (#000000)</p>
        <p style="color: #ffffff; margin-bottom: 10px;">✅ 文字颜色: 白色 (#ffffff)</p>
        <p style="color: #ffffff; margin-bottom: 10px;">✅ 主题色: 荧光绿 (#bcff2f)</p>
        <p style="color: #ffffff; margin-bottom: 10px;">✅ 当前路由: {{ $route.path }}</p>
        <p style="color: #ffffff; margin-bottom: 10px;">✅ 时间: {{ currentTime }}</p>
      </div>

      <!-- 统计数据 -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px;">
        <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 40px; text-align: center;">
          <div style="font-size: 36px; font-weight: 800; color: #bcff2f; margin-bottom: 15px;">$1.64B</div>
          <div style="color: #cccccc; font-size: 16px;">24H成交量</div>
        </div>

        <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 40px; text-align: center;">
          <div style="font-size: 36px; font-weight: 800; color: #bcff2f; margin-bottom: 15px;">$14.8B</div>
          <div style="color: #cccccc; font-size: 16px;">RWA交易总量</div>
        </div>

        <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 40px; text-align: center;">
          <div style="font-size: 36px; font-weight: 800; color: #bcff2f; margin-bottom: 15px;">200+</div>
          <div style="color: #cccccc; font-size: 16px;">RWA代币数量</div>
        </div>

        <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 40px; text-align: center;">
          <div style="font-size: 36px; font-weight: 800; color: #bcff2f; margin-bottom: 15px;">167.1K</div>
          <div style="color: #cccccc; font-size: 16px;">用户数量</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentTime = ref('')

console.log('NavTestPage 组件已加载')

const goToTrade = () => {
  console.log('跳转到交易页面')
  router.push('/market')
}

const updateTime = () => {
  currentTime.value = new Date().toLocaleTimeString()
}

onMounted(() => {
  console.log('NavTestPage 组件已挂载')
  updateTime()
  setInterval(updateTime, 1000)
})
</script>