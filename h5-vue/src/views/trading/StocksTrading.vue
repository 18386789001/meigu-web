<template>
  <div class="stocks-trading-page">
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
          <h1 class="page-title">{{ $t('trading.stocks.title') }}</h1>
          <p class="page-subtitle">{{ $t('trading.stocks.description') }}</p>
        </div>
        <div class="header-stats">
          <div class="stat-item">
            <span class="stat-value">500+</span>
            <span class="stat-label">{{ $t('trading.stocks.companies') }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">24/7</span>
            <span class="stat-label">{{ $t('trading.stocks.trading') }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">0.1%</span>
            <span class="stat-label">{{ $t('trading.stocks.commission') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="page-content">
      <!-- 股票列表 -->
      <div class="stocks-section">
        <div class="section-header">
          <h2 class="section-title">{{ $t('trading.stocks.hotStocks') }}</h2>
          <div class="market-status">
            <span class="status-indicator active"></span>
            <span class="status-text">{{ $t('trading.stocks.marketOpen') }}</span>
          </div>
        </div>
        
        <div class="stocks-grid">
          <div 
            v-for="stock in stocks" 
            :key="stock.id" 
            class="stock-card"
            @click="selectStock(stock)"
          >
            <!-- 股票信息 -->
            <div class="stock-info">
              <div class="stock-logo">
                <div class="logo-circle" :style="{ backgroundColor: stock.color }">
                  {{ stock.symbol.charAt(0) }}
                </div>
              </div>
              <div class="stock-details">
                <h3 class="stock-name">{{ stock.name }}</h3>
                <p class="stock-symbol">{{ stock.symbol }}</p>
                <p class="stock-desc">{{ stock.description }}</p>
              </div>
            </div>

            <!-- 价格信息 -->
            <div class="price-info">
              <div class="price-main">
                <span class="price-value">${{ stock.price }}</span>
                <span class="price-change" :class="stock.changeType">
                  {{ stock.changeIcon }} {{ stock.changeText }}
                </span>
              </div>
              <div class="price-details">
                <div class="price-item">
                  <span class="price-label">{{ $t('trading.stocks.high') }}</span>
                  <span class="price-value-small">${{ stock.high }}</span>
                </div>
                <div class="price-item">
                  <span class="price-label">{{ $t('trading.stocks.low') }}</span>
                  <span class="price-value-small">${{ stock.low }}</span>
                </div>
                <div class="price-item">
                  <span class="price-label">{{ $t('trading.stocks.volume') }}</span>
                  <span class="price-value-small">{{ stock.volume }}</span>
                </div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="action-buttons">
              <button class="btn-chart" @click.stop="viewChart(stock)">
                <i class="icon">📈</i>
                <span>{{ $t('trading.stocks.chart') }}</span>
              </button>
              <button class="btn-trade" @click.stop="startTrading(stock)">
                <i class="icon">💼</i>
                <span>{{ $t('trading.stocks.trade') }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 交易优势 -->
      <div class="advantages-section">
        <h2 class="section-title">{{ $t('trading.stocks.advantages') }}</h2>
        <div class="advantages-grid">
          <div class="advantage-card">
            <div class="advantage-icon">🌍</div>
            <h3>{{ $t('trading.stocks.globalMarket') }}</h3>
            <p>{{ $t('trading.stocks.globalMarketDesc') }}</p>
          </div>
          <div class="advantage-card">
            <div class="advantage-icon">📊</div>
            <h3>{{ $t('trading.stocks.analysis') }}</h3>
            <p>{{ $t('trading.stocks.analysisDesc') }}</p>
          </div>
          <div class="advantage-card">
            <div class="advantage-icon">⚡</div>
            <h3>{{ $t('trading.stocks.fastExecution') }}</h3>
            <p>{{ $t('trading.stocks.fastExecutionDesc') }}</p>
          </div>
          <div class="advantage-card">
            <div class="advantage-icon">💰</div>
            <h3>{{ $t('trading.stocks.lowCost') }}</h3>
            <p>{{ $t('trading.stocks.lowCostDesc') }}</p>
          </div>
          <div class="advantage-card">
            <div class="advantage-icon">📡</div>
            <h3>{{ $t('trading.stocks.realTime') }}</h3>
            <p>{{ $t('trading.stocks.realTimeDesc') }}</p>
          </div>
          <div class="advantage-card">
            <div class="advantage-icon">👨‍💼</div>
            <h3>{{ $t('trading.stocks.professional') }}</h3>
            <p>{{ $t('trading.stocks.professionalDesc') }}</p>
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

// 股票数据
const stocksData = [
  {
    id: 1,
    name: 'Apple Inc.',
    symbol: 'AAPL',
    descriptionKey: 'stocks.apple',
    price: '175.43',
    change: 2.15,
    changeType: 'positive',
    changeIcon: '↗',
    changeText: '+2.15%',
    high: '176.20',
    low: '173.85',
    volume: '45.2M',
    color: '#007AFF'
  },
  {
    id: 2,
    name: 'Microsoft Corporation',
    symbol: 'MSFT',
    descriptionKey: 'stocks.microsoft',
    price: '378.85',
    change: -1.24,
    changeType: 'negative',
    changeIcon: '↘',
    changeText: '-1.24%',
    high: '382.10',
    low: '375.60',
    volume: '28.7M',
    color: '#00BCF2'
  },
  {
    id: 3,
    name: 'Tesla Inc.',
    symbol: 'TSLA',
    descriptionKey: 'stocks.tesla',
    price: '248.50',
    change: 5.67,
    changeType: 'positive',
    changeIcon: '↗',
    changeText: '+5.67%',
    high: '252.30',
    low: '245.80',
    volume: '52.1M',
    color: '#E31937'
  },
  {
    id: 4,
    name: 'Amazon.com Inc.',
    symbol: 'AMZN',
    descriptionKey: 'stocks.amazon',
    price: '151.94',
    change: 0.89,
    changeType: 'positive',
    changeIcon: '↗',
    changeText: '+0.89%',
    high: '153.20',
    low: '150.45',
    volume: '32.8M',
    color: '#FF9900'
  },
  {
    id: 5,
    name: 'Alphabet Inc.',
    symbol: 'GOOGL',
    descriptionKey: 'stocks.google',
    price: '142.56',
    change: -0.45,
    changeType: 'negative',
    changeIcon: '↘',
    changeText: '-0.45%',
    high: '144.10',
    low: '141.20',
    volume: '25.3M',
    color: '#4285F4'
  },
  {
    id: 6,
    name: 'Meta Platforms Inc.',
    symbol: 'META',
    descriptionKey: 'stocks.meta',
    price: '485.20',
    change: 3.21,
    changeType: 'positive',
    changeIcon: '↗',
    changeText: '+3.21%',
    high: '489.50',
    low: '478.90',
    volume: '18.9M',
    color: '#1877F2'
  }
];

// 响应式股票数据
const stocks = computed(() => {
  return stocksData.map(stock => ({
    ...stock,
    description: t(stock.descriptionKey)
  }));
});

// 选择股票
const selectStock = (stock) => {
  console.log('Selected stock:', stock);
};

// 查看图表
const viewChart = (stock) => {
  console.log('View chart:', stock);
  router.push(`/trading/stocks/${stock.symbol}/chart`);
};

// 开始交易
const startTrading = (stock) => {
  console.log('Start trading:', stock);
  window.open(`http://localhost:333/syn/#/trading?symbol=${stock.symbol}`, '_blank');
};
</script>

<style scoped>
.stocks-trading-page {
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
.stocks-trading-page::before {
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
.stocks-trading-page > * {
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

/* 股票部分 */
.stocks-section {
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

.stocks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.stock-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
}

.stock-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.stock-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.stock-logo {
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
  font-size: 1.2rem;
}

.stock-details {
  flex: 1;
}

.stock-name {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.stock-symbol {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: 4px;
}

.stock-desc {
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

  .stocks-grid {
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
