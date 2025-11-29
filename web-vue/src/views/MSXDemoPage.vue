<template>
  <div class="msx-demo-page">
    <!-- 页面内容 -->
    <div class="demo-content">
      <div class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">去中心化 RWA 交易</h1>
          <p class="hero-subtitle">让优质资产自由流通</p>
          <p class="hero-description">真实价值上链 从华尔街到你的钱包</p>
          <button class="cta-button" @click="handleTrade">
            立即交易
          </button>

          <!-- 导航栏测试信息 -->
          <div class="test-info" style="margin-top: 40px; padding: 20px; background: rgba(255,255,255,0.1); border-radius: 8px;">
            <h3>导航栏测试</h3>
            <p>当前路由: {{ $route.path }}</p>
            <p>导航栏状态: 已启用</p>
            <p>Meta信息: {{ $route.meta }}</p>
          </div>
        </div>
      </div>

      <!-- 简化的统计数据区域 -->
      <div class="stats-section">
        <div class="stats-container">
          <div class="stat-item">
            <div class="stat-value">$1.64B</div>
            <div class="stat-label">24H成交量</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">$14.8B</div>
            <div class="stat-label">RWA交易总量</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">200+</div>
            <div class="stat-label">RWA代币数量</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">167.1K</div>
            <div class="stat-label">用户数量</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleTrade = () => {
  router.push('/market')
}
</script>

<style lang="scss" scoped>
/* 直接使用硬编码颜色值，避免CSS变量问题 */
.msx-demo-page {
  min-height: 100vh;
  background: #000000;
  color: #ffffff;
  overflow-x: hidden;
}

.demo-content {
  padding-top: 64px; /* 为导航栏留出空间 */
  min-height: 100vh;
  background: #000000; /* 确保背景是黑色 */
}

// Hero区域
.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(ellipse at center, rgba(188, 255, 47, 0.05) 0%, transparent 70%);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(circle at 20% 50%, rgba(188, 255, 47, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 80% 50%, rgba(188, 255, 47, 0.03) 0%, transparent 50%);
    pointer-events: none;
  }
}

.hero-content {
  text-align: center;
  z-index: 1;
  max-width: 800px;
  padding: 0 24px;
}

.hero-title {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 800;
  margin-bottom: 24px;
  background: linear-gradient(135deg, var(--msx-text-primary) 0%, var(--msx-accent-green) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -2px;
  animation: glow 3s ease-in-out infinite alternate;
}

.hero-subtitle {
  font-size: clamp(1.2rem, 3vw, 1.8rem);
  color: var(--msx-text-secondary);
  margin-bottom: 16px;
  font-weight: 500;
}

.hero-description {
  font-size: 1.1rem;
  color: var(--msx-text-muted);
  margin-bottom: 48px;
  line-height: 1.6;
}

.cta-button {
  height: 56px;
  padding: 0 48px;
  background: var(--msx-accent-green);
  color: var(--msx-bg-primary);
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--msz-transition-base);
  letter-spacing: -0.5px;
  position: relative;
  overflow: hidden;

  &:hover {
    background: var(--msx-accent-green-hover);
    transform: translateY(-2px);
    box-shadow: var(--msx-shadow-glow);
  }

  &:active {
    transform: translateY(0);
  }

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }

  &:active::before {
    width: 300px;
    height: 300px;
  }
}

// 统计数据区域
.stats-section {
  padding: 80px 24px;
  background: var(--msx-bg-secondary);
}

.stats-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 48px;
}

.stat-item {
  text-align: center;
  padding: 24px;
  background: var(--msx-bg-glass);
  border-radius: 12px;
  border: 1px solid var(--msx-border-color);
  transition: all var(--msz-transition-base);

  &:hover {
    transform: translateY(-4px);
    border-color: var(--msx-accent-green);
    box-shadow: var(--msx-shadow-glass);
  }
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--msx-accent-green);
  margin-bottom: 8px;
  letter-spacing: -1px;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--msx-text-secondary);
  font-weight: 500;
}

// 功能特性区域
.features-section {
  padding: 100px 24px;
}

.features-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
}

.feature-card {
  padding: 40px 32px;
  background: var(--msx-bg-glass);
  border-radius: 16px;
  border: 1px solid var(--msx-border-color);
  text-align: center;
  transition: all var(--msz-transition-base);
  backdrop-filter: blur(10px);

  &:hover {
    transform: translateY(-8px);
    border-color: var(--msx-accent-green);
    box-shadow: var(--msx-shadow-glass);

    .feature-icon {
      transform: scale(1.1) rotate(5deg);
    }

    .feature-title {
      color: var(--msx-accent-green);
    }
  }
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 24px;
  display: block;
  transition: all var(--msz-transition-base);
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--msx-text-primary);
  transition: all var(--msz-transition-base);
}

.feature-description {
  font-size: 1rem;
  color: var(--msx-text-secondary);
  line-height: 1.6;
}

// 动画效果
@keyframes glow {
  0% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(1.1);
  }
  100% {
    filter: brightness(1.2);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.feature-card {
  animation: fadeInUp 0.8s ease-out backwards;

  &:nth-child(1) { animation-delay: 0.2s; }
  &:nth-child(2) { animation-delay: 0.4s; }
  &:nth-child(3) { animation-delay: 0.6s; }
}

.stat-item {
  animation: fadeInUp 0.6s ease-out backwards;

  &:nth-child(1) { animation-delay: 0.1s; }
  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.3s; }
  &:nth-child(4) { animation-delay: 0.4s; }
}

// 响应式设计
@media (max-width: 768px) {
  .demo-content {
    padding-top: 56px; // 移动端导航栏高度
  }

  .hero-section {
    min-height: 80vh;
    padding: 60px 20px;
  }

  .hero-content {
    padding: 0 16px;
  }

  .stats-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  .features-container {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .feature-card {
    padding: 32px 24px;
  }
}

@media (max-width: 480px) {
  .stats-container {
    grid-template-columns: 1fr;
  }

  .stat-value {
    font-size: 2rem;
  }

  .feature-card {
    padding: 24px 20px;
  }
}

// 高性能优化
.hero-section {
  contain: layout paint;
}

.feature-card,
.stat-item {
  will-change: transform;
}

// 可访问性支持
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

// 打印样式
@media print {
  .msx-demo-page {
    background: white !important;
    color: black !important;
  }

  .hero-title,
  .feature-title {
    color: black !important;
  }
}
</style>