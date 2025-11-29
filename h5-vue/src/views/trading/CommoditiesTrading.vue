<template>
  <div class="commodities-trading-page">
    <!-- 视频背景 -->
    <video 
      class="video-background" 
      autoplay 
      muted 
      loop 
      playsinline
    >
      <source src="/背景.mp4" type="video/mp4">
    </video>
    
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-info">
          <h1 class="page-title">{{ $t('trading.commodities.title') }}</h1>
          <p class="page-subtitle">{{ $t('trading.commodities.description') }}</p>
        </div>
        <div class="header-stats">
          <div class="stat-item">
            <span class="stat-value">50+</span>
            <span class="stat-label">{{ $t('trading.commodities.commodities') }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">24/5</span>
            <span class="stat-label">{{ $t('trading.commodities.trading') }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">1:100</span>
            <span class="stat-label">{{ $t('trading.commodities.leverage') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="page-content">
      <!-- 商品分类 -->
      <div class="categories-section">
        <h2 class="section-title">{{ $t('trading.commodities.categoryTitle') }}</h2>
        <div class="categories-grid">
          <div 
            v-for="category in categories" 
            :key="category.id" 
            class="category-card"
            @click="selectCategory(category)"
          >
            <div class="category-icon">{{ category.icon }}</div>
            <h3 class="category-name">{{ $t(category.nameKey) }}</h3>
            <p class="category-count">{{ category.count }} {{ $t('trading.commodities.itemsCount') }}</p>
          </div>
        </div>
      </div>

      <!-- 热门商品 -->
      <div class="commodities-section">
        <div class="section-header">
          <h2 class="section-title">{{ $t('trading.commodities.hotCommodities') }}</h2>
          <div class="market-status">
            <span class="status-indicator active"></span>
            <span class="status-text">{{ $t('trading.commodities.marketOpen') }}</span>
          </div>
        </div>
        
        <div class="commodities-grid">
          <div 
            v-for="commodity in commodities" 
            :key="commodity.id" 
            class="commodity-card"
            @click="selectCommodity(commodity)"
          >
            <!-- 商品信息 -->
            <div class="commodity-info">
              <div class="commodity-logo">
                <div class="logo-circle" :style="{ backgroundColor: commodity.color }">
                  {{ commodity.icon }}
                </div>
              </div>
              <div class="commodity-details">
                <h3 class="commodity-name">{{ $t(commodity.nameKey) }}</h3>
                <p class="commodity-symbol">{{ commodity.symbol }}</p>
                <p class="commodity-desc">{{ $t(commodity.descKey) }}</p>
              </div>
            </div>

            <!-- 价格信息 -->
            <div class="price-info">
              <div class="price-main">
                <span class="price-value">${{ commodity.price }}</span>
                <span class="price-change" :class="commodity.changeType">
                  {{ commodity.changeIcon }} {{ commodity.changeText }}
                </span>
              </div>
              <div class="price-details">
                <div class="price-item">
                  <span class="price-label">{{ $t('trading.commodities.high') }}</span>
                  <span class="price-value-small">${{ commodity.high }}</span>
                </div>
                <div class="price-item">
                  <span class="price-label">{{ $t('trading.commodities.low') }}</span>
                  <span class="price-value-small">${{ commodity.low }}</span>
                </div>
                <div class="price-item">
                  <span class="price-label">{{ $t('trading.commodities.spread') }}</span>
                  <span class="price-value-small">{{ commodity.spread }}</span>
                </div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="action-buttons">
              <button class="btn-chart" @click.stop="viewChart(commodity)">
                <i class="icon">📈</i>
                <span>{{ $t('trading.commodities.chart') }}</span>
              </button>
              <button class="btn-trade" @click.stop="startTrading(commodity)">
                <i class="icon">💼</i>
                <span>{{ $t('trading.commodities.trade') }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 交易优势 -->
      <div class="advantages-section">
        <h2 class="section-title">{{ $t('trading.commodities.advantages') }}</h2>
        <div class="advantages-grid">
          <div class="advantage-card">
            <div class="advantage-icon">🌍</div>
            <h3>{{ $t('trading.commodities.diversified') }}</h3>
            <p>{{ $t('trading.commodities.diversifiedDesc') }}</p>
          </div>
          <div class="advantage-card">
            <div class="advantage-icon">📈</div>
            <h3>{{ $t('trading.commodities.highLeverage') }}</h3>
            <p>{{ $t('trading.commodities.leverageDesc') }}</p>
          </div>
          <div class="advantage-card">
            <div class="advantage-icon">🛡️</div>
            <h3>{{ $t('trading.commodities.hedging') }}</h3>
            <p>{{ $t('trading.commodities.hedgingDesc') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t, locale } = useI18n();

// 商品分类数据
const categories = ref([
  {
    id: 1,
    nameKey: 'trading.commodities.categories.preciousMetals',
    icon: '🥇',
    count: 8
  },
  {
    id: 2,
    nameKey: 'trading.commodities.categories.energy',
    icon: '⚡',
    count: 6
  },
  {
    id: 3,
    nameKey: 'trading.commodities.categories.agricultural',
    icon: '🌾',
    count: 12
  },
  {
    id: 4,
    nameKey: 'trading.commodities.categories.industrialMetals',
    icon: '🔩',
    count: 10
  }
]);

// 商品数据
const commodities = ref([
  {
    id: 1,
    nameKey: 'trading.commodities.items.gold',
    descKey: 'trading.commodities.items.goldDesc',
    symbol: 'XAUUSD',
    icon: '🥇',
    price: '2045.30',
    change: 1.25,
    changeType: 'positive',
    changeIcon: '↗',
    changeText: '+1.25%',
    high: '2048.50',
    low: '2041.20',
    spread: '0.3',
    color: '#FFD700'
  },
  {
    id: 2,
    nameKey: 'trading.commodities.items.silver',
    descKey: 'trading.commodities.items.silverDesc',
    symbol: 'XAGUSD',
    icon: '🥈',
    price: '24.85',
    change: -0.45,
    changeType: 'negative',
    changeIcon: '↘',
    changeText: '-0.45%',
    high: '25.20',
    low: '24.70',
    spread: '0.05',
    color: '#C0C0C0'
  },
  {
    id: 3,
    nameKey: 'trading.commodities.items.oil',
    descKey: 'trading.commodities.items.oilDesc',
    symbol: 'USOIL',
    icon: '🛢️',
    price: '78.45',
    change: 2.15,
    changeType: 'positive',
    changeIcon: '↗',
    changeText: '+2.15%',
    high: '79.20',
    low: '77.80',
    spread: '0.05',
    color: '#000000'
  },
  {
    id: 4,
    nameKey: 'trading.commodities.items.naturalGas',
    descKey: 'trading.commodities.items.naturalGasDesc',
    symbol: 'NATGAS',
    icon: '🔥',
    price: '2.85',
    change: -1.25,
    changeType: 'negative',
    changeIcon: '↘',
    changeText: '-1.25%',
    high: '2.92',
    low: '2.81',
    spread: '0.01',
    color: '#4169E1'
  },
  {
    id: 5,
    nameKey: 'trading.commodities.items.copper',
    descKey: 'trading.commodities.items.copperDesc',
    symbol: 'COPPER',
    icon: '🔶',
    price: '3.85',
    change: 0.75,
    changeType: 'positive',
    changeIcon: '↗',
    changeText: '+0.75%',
    high: '3.89',
    low: '3.82',
    spread: '0.02',
    color: '#B87333'
  },
  {
    id: 6,
    nameKey: 'trading.commodities.items.wheat',
    descKey: 'trading.commodities.items.wheatDesc',
    symbol: 'WHEAT',
    icon: '🌾',
    price: '6.25',
    change: 1.85,
    changeType: 'positive',
    changeIcon: '↗',
    changeText: '+1.85%',
    high: '6.35',
    low: '6.18',
    spread: '0.03',
    color: '#DAA520'
  }
]);

// 选择分类
const selectCategory = (category) => {
  console.log('Selected category:', category);
};

// 选择商品
const selectCommodity = (commodity) => {
  console.log('Selected commodity:', commodity);
};

// 查看图表
const viewChart = (commodity) => {
  console.log('View chart:', commodity);
  router.push(`/trading/commodities/${commodity.symbol}/chart`);
};

// 开始交易
const startTrading = (commodity) => {
  console.log('Start trading:', commodity);
  window.open(`http://localhost:333/syn/#/trading?symbol=${commodity.symbol}`, '_blank');
};
</script>

<style scoped>
.commodities-trading-page {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

/* 视频背景 */
.video-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -2;
}

/* 添加深色遮罩层确保文字可读性 */
.commodities-trading-page::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: -1;
}

/* 确保所有内容在遮罩层之上 */
.commodities-trading-page > * {
  position: relative;
  z-index: 1;
}

/* 页面头部 */
.page-header {
  padding: 80px 20px 40px;
  text-align: center;
  color: white;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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

/* 分类部分 */
.categories-section {
  margin-bottom: 80px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.category-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 30px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
}

.category-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.category-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.category-name {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.category-count {
  opacity: 0.8;
  margin: 0;
}

/* 商品部分 */
.commodities-section {
  margin-bottom: 80px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.market-status {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #4CAF50;
  animation: pulse 2s infinite;
}

.status-indicator.active {
  background-color: #4CAF50;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.commodities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.commodity-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
}

.commodity-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.commodity-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.commodity-logo {
  margin-right: 16px;
}

.logo-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.5rem;
}

.commodity-details {
  flex: 1;
}

.commodity-name {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.commodity-symbol {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: 4px;
}

.commodity-desc {
  font-size: 0.85rem;
  opacity: 0.7;
  margin: 0;
}

.price-info {
  margin-bottom: 20px;
}

.price-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.price-value {
  font-size: 1.5rem;
  font-weight: 700;
}

.price-change {
  font-size: 0.9rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
}

.price-change.positive {
  background-color: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
}

.price-change.negative {
  background-color: rgba(244, 67, 54, 0.2);
  color: #f44336;
}

.price-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.price-item {
  text-align: center;
}

.price-label {
  display: block;
  font-size: 0.8rem;
  opacity: 0.7;
  margin-bottom: 4px;
}

.price-value-small {
  font-size: 0.9rem;
  font-weight: 600;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.btn-chart,
.btn-trade {
  flex: 1;
  padding: 10px 16px;
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

.btn-chart {
  background: rgba(33, 150, 243, 0.2);
  color: #2196F3;
  border: 1px solid rgba(33, 150, 243, 0.3);
}

.btn-chart:hover {
  background: rgba(33, 150, 243, 0.3);
}

.btn-trade {
  background: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.btn-trade:hover {
  background: rgba(76, 175, 80, 0.3);
}

/* 优势部分 */
.advantages-section {
  margin-bottom: 40px;
}

.advantages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.advantage-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 30px 24px;
  text-align: center;
  color: white;
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

  .categories-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .commodities-grid {
    grid-template-columns: 1fr;
  }

  .advantages-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    text-align: center;
  }
}
</style>
