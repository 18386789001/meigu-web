<template>
  <div style="background: #ffffff; color: #000000; min-height: 100vh;">
    <!-- 强制显示导航栏 -->
    <div style="position: fixed; top: 0; left: 0; right: 0; height: 64px; background: #000000; color: #ffffff; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; z-index: 1000; border-bottom: 1px solid #333;">
      <!-- 左侧 -->
      <div style="display: flex; align-items: center; gap: 48px;">
        <div style="font-weight: bold; font-size: 24px; cursor: pointer; color: #bcff2f;" @click="$router.push('/')">
          MSX
        </div>

        <div style="display: flex; gap: 16px;">
          <span style="padding: 8px 16px; cursor: pointer; border-radius: 6px; color: #ffffff;"
                :style="{ background: $route.path === '/rwa' ? 'rgba(188, 255, 47, 0.2)' : '' }"
                @click="$router.push('/rwa')">RWA</span>
          <span style="padding: 8px 16px; cursor: pointer; border-radius: 6px; color: #ffffff;"
                :style="{ background: $route.path === '/market' ? 'rgba(188, 255, 47, 0.2)' : '' }"
                @click="$router.push('/market')">加密货币</span>
          <span style="padding: 8px 16px; cursor: pointer; border-radius: 6px; color: #ffffff;"
                @click="$router.push('/invite')">邀请</span>
          <span style="padding: 8px 16px; cursor: pointer; border-radius: 6px; color: #ffffff;"
                @click="$router.push('/rewards')">奖励</span>
        </div>
      </div>

      <!-- 右侧 -->
      <div style="display: flex; align-items: center; gap: 16px;">
        <span style="color: #666; padding: 6px 12px; background: rgba(255,255,255,0.1); border-radius: 6px;">SOL</span>

        <button style="height: 36px; padding: 0 15px; background: #bcff2f; color: #000000; border: none; border-radius: 6px; font-size: 14px; cursor: pointer;"
                @click="$router.push('/login')">
          连接钱包
        </button>
      </div>
    </div>

    <!-- 页面内容，留出导航栏空间 -->
    <div style="padding-top: 64px; background: #000000; color: #ffffff; min-height: 100vh;">
      <div style="max-width: 1200px; margin: 0 auto; padding: 40px 24px;">
        <h1 style="color: #bcff2f; font-size: 3rem; font-weight: bold; margin-bottom: 24px;">
          去中心化 RWA 交易
        </h1>

        <p style="color: #ffffff; font-size: 1.2rem; margin-bottom: 16px;">
          让优质资产自由流通
        </p>

        <p style="color: #cccccc; font-size: 1rem; margin-bottom: 40px;">
          真实价值上链 从华尔街到你的钱包
        </p>

        <button style="height: 56px; padding: 0 48px; background: #bcff2f; color: #000000; border: none; border-radius: 8px; font-size: 18px; font-weight: bold; cursor: pointer;"
                @click="$router.push('/market')">
          立即交易
        </button>

        <!-- 调试信息 -->
        <div style="margin-top: 60px; padding: 20px; background: rgba(255,255,255,0.1); border-radius: 8px; color: #ffffff;">
          <h3 style="color: #bcff2f; margin-bottom: 16px;">导航栏调试信息</h3>
          <p>当前路由: <span style="color: #ff9800;">{{ $route.path }}</span></p>
          <p>导航栏状态: <span style="color: #4caf50;">已显示（强制）</span></p>
          <p>组件状态: <span style="color: #2196f3;">正常渲染</span></p>
          <p>时间戳: <span style="color: #9c27b0;">{{ new Date().toLocaleTimeString() }}</span></p>
          <p>导航栏类型: <span style="color: #ff5722;">内联样式（测试用）</span></p>
        </div>

        <!-- 统计数据 -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px; margin-top: 60px;">
          <div style="padding: 24px; background: rgba(255,255,255,0.05); border-radius: 12px; text-align: center; border: 1px solid rgba(255,255,255,0.1);">
            <div style="font-size: 2rem; font-weight: bold; color: #bcff2f; margin-bottom: 8px;">$1.64B</div>
            <div style="color: #cccccc; font-size: 0.9rem;">24H成交量</div>
          </div>

          <div style="padding: 24px; background: rgba(255,255,255,0.05); border-radius: 12px; text-align: center; border: 1px solid rgba(255,255,255,0.1);">
            <div style="font-size: 2rem; font-weight: bold; color: #bcff2f; margin-bottom: 8px;">$14.8B</div>
            <div style="color: #cccccc; font-size: 0.9rem;">RWA交易总量</div>
          </div>

          <div style="padding: 24px; background: rgba(255,255,255,0.05); border-radius: 12px; text-align: center; border: 1px solid rgba(255,255,255,0.1);">
            <div style="font-size: 2rem; font-weight: bold; color: #bcff2f; margin-bottom: 8px;">200+</div>
            <div style="color: #cccccc; font-size: 0.9rem;">RWA代币数量</div>
          </div>

          <div style="padding: 24px; background: rgba(255,255,255,0.05); border-radius: 12px; text-align: center; border: 1px solid rgba(255,255,255,0.1);">
            <div style="font-size: 2rem; font-weight: bold; color: #bcff2f; margin-bottom: 8px;">167.1K</div>
            <div style="color: #cccccc; font-size: 0.9rem;">用户数量</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 这是一个测试页面，使用内联样式确保导航栏能够正常显示
console.log('TestNavPage 组件已加载')
console.log('当前路由:', window.location.pathname)
</script>