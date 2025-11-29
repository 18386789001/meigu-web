<template>
  <div class="platform-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-info">
          <h1 class="page-title">{{ $t('platform.title') }}</h1>
          <p class="page-subtitle">{{ $t('platform.description') }}</p>
        </div>
        <div class="header-stats">
          <div class="stat-item">
            <span class="stat-value">4+</span>
            <span class="stat-label">{{ $t('platform.platforms') }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">99.9%</span>
            <span class="stat-label">{{ $t('platform.uptime') }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">24/7</span>
            <span class="stat-label">{{ $t('platform.support') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="page-content">
      <!-- 平台列表 -->
      <div class="platforms-section">
        <div class="section-header">
          <h2 class="section-title">{{ $t('platform.availablePlatforms') }}</h2>
        </div>
        
        <div class="platforms-grid">
          <div 
            v-for="platform in platforms" 
            :key="platform.id" 
            class="platform-card"
            @click="selectPlatform(platform)"
          >
            <!-- 平台信息 -->
            <div class="platform-header">
              <div class="platform-logo">
                <div class="logo-circle">
                  {{ platform.icon }}
                </div>
              </div>
              <div class="platform-info">
                <h3 class="platform-name">{{ platform.name }}</h3>
                <p class="platform-type">{{ $t(`platform.platformTypes.${platform.type.toLowerCase()}`) }}</p>
                <p class="platform-desc">{{ $t(platform.descriptionKey) }}</p>
              </div>
            </div>

            <!-- 平台特性 -->
            <div class="platform-features">
              <div class="feature-item">
                <span class="feature-label">{{ $t('platform.spread') }}</span>
                <span class="feature-value">{{ platform.spread }}</span>
              </div>
              <div class="feature-item">
                <span class="feature-label">{{ $t('platform.leverage') }}</span>
                <span class="feature-value">{{ platform.leverage }}</span>
              </div>
              <div class="feature-item">
                <span class="feature-label">{{ $t('platform.execution') }}</span>
                <span class="feature-value">{{ platform.execution }}</span>
              </div>
            </div>

            <!-- 功能列表 -->
            <div class="platform-features-list">
              <ul>
                <li v-for="feature in platform.features" :key="feature">
                  {{ $t(feature) }}
                </li>
              </ul>
            </div>

            <!-- 操作按钮 -->
            <div class="action-buttons">
              <button class="btn-download" @click.stop="downloadPlatform(platform)">
                <i class="icon">⬇️</i>
                <span>{{ $t('platform.download') }}</span>
              </button>
              <button class="btn-demo" @click.stop="tryDemo(platform)">
                <i class="icon">🎯</i>
                <span>{{ $t('platform.tryDemo') }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 平台优势 -->
      <div class="advantages-section">
        <h2 class="section-title">{{ $t('platform.advantages') }}</h2>
        <div class="advantages-grid">
          <div class="advantage-card">
            <div class="advantage-icon">🛡️</div>
            <h3>{{ $t('platform.reliable') }}</h3>
            <p>{{ $t('platform.reliableDesc') }}</p>
          </div>
          <div class="advantage-card">
            <div class="advantage-icon">⚡</div>
            <h3>{{ $t('platform.fast') }}</h3>
            <p>{{ $t('platform.fastDesc') }}</p>
          </div>
          <div class="advantage-card">
            <div class="advantage-icon">🔒</div>
            <h3>{{ $t('platform.secure') }}</h3>
            <p>{{ $t('platform.secureDesc') }}</p>
          </div>
          <div class="advantage-card">
            <div class="advantage-icon">📱</div>
            <h3>{{ $t('platform.multiDevice') }}</h3>
            <p>{{ $t('platform.multiDeviceDesc') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t, locale } = useI18n();

// 平台数据
const platforms = ref([
  {
    id: 1,
    name: 'MT5 Desktop',
    descriptionKey: 'platform.mt5Desktop',
    type: 'Desktop',
    icon: '💻',
    spread: '0.1 pips',
    leverage: '1:1000',
    execution: '< 50ms',
    features: [
      'platform.features.advancedCharts',
      'platform.features.eaTrading',
      'platform.features.multiAccount',
      'platform.features.marketDepth'
    ]
  },
  {
    id: 2,
    name: 'MT5 Mobile',
    descriptionKey: 'platform.mt5Mobile',
    type: 'Mobile',
    icon: '📱',
    spread: '0.1 pips',
    leverage: '1:1000',
    execution: '< 50ms',
    features: [
      'platform.features.realTimePush',
      'platform.features.oneClickTrading',
      'platform.features.chartAnalysis',
      'platform.features.accountManagement'
    ]
  },
  {
    id: 3,
    name: 'MT5 Web',
    descriptionKey: 'platform.mt5Web',
    type: 'Web',
    icon: '🌐',
    spread: '0.1 pips',
    leverage: '1:1000',
    execution: '< 50ms',
    features: [
      'platform.features.noDownload',
      'platform.features.crossPlatform',
      'platform.features.realTimeSync',
      'platform.features.cloudStorage'
    ]
  },
  {
    id: 4,
    name: 'MetaTrader 4',
    descriptionKey: 'platform.mt4Classic',
    type: 'Legacy',
    icon: '📊',
    spread: '0.2 pips',
    leverage: '1:500',
    execution: '< 100ms',
    features: [
      'platform.features.classicInterface',
      'platform.features.stableReliable',
      'platform.features.richIndicators',
      'platform.features.wideSupport'
    ]
  }
]);

// 选择平台
const selectPlatform = (platform) => {
  console.log('Selected platform:', platform);
  router.push(`/platform/${platform.id}`);
};

// 下载平台
const downloadPlatform = (platform) => {
  console.log('Download platform:', platform);
  window.open(`http://localhost:333/syn/#/download/${platform.id}`, '_blank');
};

// 试用演示
const tryDemo = (platform) => {
  console.log('Try demo:', platform);
  window.open(`http://localhost:333/syn/#/demo/${platform.id}`, '_blank');
};
</script>

<style scoped>
.platform-page {
  min-height: 100vh;
  background: #000000;
  color: white;
}

/* 页面头部 */
.page-header {
  padding: 80px 20px 40px;
  text-align: center;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
}

.header-info {
  margin-bottom: 40px;
}

.page-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: white;
}

.page-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 0;
}

.header-stats {
  display: flex;
  justify-content: center;
  gap: 60px;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  color: #4CAF50;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 1rem;
  opacity: 0.8;
}

/* 主要内容 */
.page-content {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 2rem;
  font-weight: 600;
  color: white;
  margin-bottom: 30px;
  text-align: center;
}

/* 平台部分 */
.platforms-section {
  margin-bottom: 80px;
}

.platforms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
}

.platform-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.platform-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.platform-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.platform-logo {
  margin-right: 16px;
}

.logo-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

.platform-info {
  flex: 1;
}

.platform-name {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.platform-type {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: 4px;
}

.platform-desc {
  font-size: 0.85rem;
  opacity: 0.7;
  margin: 0;
}

.platform-features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.feature-item {
  text-align: center;
}

.feature-label {
  display: block;
  font-size: 0.8rem;
  opacity: 0.7;
  margin-bottom: 4px;
}

.feature-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: #4CAF50;
}

.platform-features-list {
  margin-bottom: 20px;
}

.platform-features-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.platform-features-list li {
  padding: 6px 0;
  font-size: 0.9rem;
  opacity: 0.8;
  position: relative;
  padding-left: 20px;
}

.platform-features-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #4CAF50;
  font-weight: bold;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.btn-download,
.btn-demo {
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.btn-download {
  background: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.btn-download:hover {
  background: rgba(76, 175, 80, 0.3);
}

.btn-demo {
  background: rgba(33, 150, 243, 0.2);
  color: #2196F3;
  border: 1px solid rgba(33, 150, 243, 0.3);
}

.btn-demo:hover {
  background: rgba(33, 150, 243, 0.3);
}

/* 优势部分 */
.advantages-section {
  margin-bottom: 40px;
}

.advantages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.advantage-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 30px 24px;
  text-align: center;
  transition: all 0.3s ease;
}

.advantage-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
}

.advantage-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.advantage-card h3 {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 12px;
}

.advantage-card p {
  opacity: 0.8;
  line-height: 1.5;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .header-stats {
    gap: 30px;
  }

  .stat-value {
    font-size: 2rem;
  }

  .platforms-grid {
    grid-template-columns: 1fr;
  }

  .platform-features {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .advantages-grid {
    grid-template-columns: 1fr;
  }
}
</style>
