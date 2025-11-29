<template>
  <div class="crypto-trading-page">
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
        <h1 class="page-title">{{ $t('crypto.title') }}</h1>
        <p class="page-subtitle">{{ $t('crypto.subtitle') }}</p>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-section">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📈</div>
          <div class="stat-content">
            <h3 class="stat-value">{{ $t('crypto.stats.totalCoins') }}</h3>
            <p class="stat-label">{{ $t('crypto.stats.availableCoins') }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⚡</div>
          <div class="stat-content">
            <h3 class="stat-value">{{ $t('crypto.stats.avgSpread') }}</h3>
            <p class="stat-label">{{ $t('crypto.stats.lowSpreads') }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🔒</div>
          <div class="stat-content">
            <h3 class="stat-value">{{ $t('crypto.stats.maxLeverage') }}</h3>
            <p class="stat-label">{{ $t('crypto.stats.highLeverage') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <div class="controls-section">
      <div class="search-container">
        <div class="search-input-wrapper">
          <span class="search-icon">🔍</span>
          <input 
            v-model="searchQuery" 
            type="text" 
            :placeholder="$t('crypto.search.placeholder')"
            class="search-input"
          >
        </div>
      </div>
      
      <div class="filter-tabs">
        <button 
          v-for="filter in filters" 
          :key="filter.id"
          class="filter-tab"
          :class="{ active: activeFilter === filter.id }"
          @click="setActiveFilter(filter.id)"
        >
          <span class="filter-icon">{{ filter.icon }}</span>
          <span class="filter-text">{{ filter.name }}</span>
        </button>
      </div>
    </div>

    <!-- 加密货币列表 -->
    <div class="crypto-list-section">
      <div class="crypto-grid">
        <div 
          v-for="crypto in filteredCryptos" 
          :key="crypto.id"
          class="crypto-card"
          @click="selectCrypto(crypto)"
        >
          <div class="crypto-header">
            <div class="crypto-icon">
              <span class="icon">{{ crypto.icon }}</span>
            </div>
            <div class="crypto-info">
              <h3 class="crypto-name">{{ crypto.symbol }}</h3>
              <p class="crypto-desc">{{ crypto.name }}</p>
            </div>
            <div class="crypto-status">
              <span class="status-badge" :class="crypto.status">{{ $t('crypto.status.active') }}</span>
            </div>
          </div>
          
          <div class="crypto-price">
            <div class="price-main">${{ crypto.price }}</div>
            <div class="price-change" :class="crypto.changeType">
              <span class="change-icon">{{ crypto.changeType === 'positive' ? '↗' : '↘' }}</span>
              <span class="change-value">{{ crypto.changePercent }}%</span>
            </div>
          </div>
          
          <div class="crypto-details">
            <div class="detail-row">
              <span class="detail-label">{{ $t('crypto.details.high') }}</span>
              <span class="detail-value">${{ crypto.high }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">{{ $t('crypto.details.low') }}</span>
              <span class="detail-value">${{ crypto.low }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">{{ $t('crypto.details.volume') }}</span>
              <span class="detail-value">{{ crypto.volume }}</span>
            </div>
          </div>
          
          <div class="crypto-actions">
            <button class="action-btn chart-btn" @click.stop="viewChart(crypto)">
              <span class="btn-icon">📊</span>
              <span class="btn-text">{{ $t('crypto.actions.chart') }}</span>
            </button>
            <button class="action-btn trade-btn" @click.stop="startTrade(crypto)">
              <span class="btn-icon">⚡</span>
              <span class="btn-text">{{ $t('crypto.actions.trade') }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 特色优势 -->
    <div class="features-section">
      <h2 class="section-title">{{ $t('crypto.features.title') }}</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">🚀</div>
          <h3 class="feature-title">{{ $t('crypto.features.fast.title') }}</h3>
          <p class="feature-desc">{{ $t('crypto.features.fast.desc') }}</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🔒</div>
          <h3 class="feature-title">{{ $t('crypto.features.secure.title') }}</h3>
          <p class="feature-desc">{{ $t('crypto.features.secure.desc') }}</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🌍</div>
          <h3 class="feature-title">{{ $t('crypto.features.global.title') }}</h3>
          <p class="feature-desc">{{ $t('crypto.features.global.desc') }}</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">💎</div>
          <h3 class="feature-title">{{ $t('crypto.features.innovative.title') }}</h3>
          <p class="feature-desc">{{ $t('crypto.features.innovative.desc') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t } = useI18n();

// 响应式数据
const searchQuery = ref('');
const activeFilter = ref('all');

// 筛选器
const filters = computed(() => [
  { id: 'all', name: t('crypto.filters.all'), icon: '🌟' },
  { id: 'popular', name: t('crypto.filters.popular'), icon: '🔥' },
  { id: 'major', name: t('crypto.filters.major'), icon: '💎' },
  { id: 'alt', name: t('crypto.filters.alt'), icon: '🚀' }
]);

// 加密货币数据
const cryptos = ref([
  {
    id: 1,
    symbol: 'BTC/USD',
    name: 'Bitcoin',
    icon: '₿',
    price: '45,678.90',
    change: '+2.34',
    changePercent: '+2.34%',
    changeType: 'positive',
    high: '46,200.00',
    low: '44,500.00',
    volume: '2.5B',
    category: 'popular',
    status: 'active'
  },
  {
    id: 2,
    symbol: 'ETH/USD',
    name: 'Ethereum',
    icon: 'Ξ',
    price: '3,456.78',
    change: '-1.23',
    changePercent: '-1.23%',
    changeType: 'negative',
    high: '3,500.00',
    low: '3,400.00',
    volume: '1.8B',
    category: 'popular',
    status: 'active'
  },
  {
    id: 3,
    symbol: 'BNB/USD',
    name: 'Binance Coin',
    icon: '🔸',
    price: '234.56',
    change: '+0.45',
    changePercent: '+0.45%',
    changeType: 'positive',
    high: '240.00',
    low: '230.00',
    volume: '850M',
    category: 'popular',
    status: 'active'
  },
  {
    id: 4,
    symbol: 'ADA/USD',
    name: 'Cardano',
    icon: '₳',
    price: '0.4567',
    change: '-0.78',
    changePercent: '-0.78%',
    changeType: 'negative',
    high: '0.4700',
    low: '0.4500',
    volume: '320M',
    category: 'major',
    status: 'active'
  },
  {
    id: 5,
    symbol: 'SOL/USD',
    name: 'Solana',
    icon: '◎',
    price: '123.45',
    change: '+3.21',
    changePercent: '+3.21%',
    changeType: 'positive',
    high: '125.00',
    low: '120.00',
    volume: '280M',
    category: 'major',
    status: 'active'
  },
  {
    id: 6,
    symbol: 'DOT/USD',
    name: 'Polkadot',
    icon: '●',
    price: '6.789',
    change: '-1.56',
    changePercent: '-1.56%',
    changeType: 'negative',
    high: '6.900',
    low: '6.500',
    volume: '150M',
    category: 'major',
    status: 'active'
  },
  {
    id: 7,
    symbol: 'MATIC/USD',
    name: 'Polygon',
    icon: '⬟',
    price: '0.789',
    change: '+2.34',
    changePercent: '+2.34%',
    changeType: 'positive',
    high: '0.800',
    low: '0.750',
    volume: '95M',
    category: 'alt',
    status: 'active'
  },
  {
    id: 8,
    symbol: 'AVAX/USD',
    name: 'Avalanche',
    icon: '🔺',
    price: '34.56',
    change: '-0.89',
    changePercent: '-0.89%',
    changeType: 'negative',
    high: '35.00',
    low: '34.00',
    volume: '120M',
    category: 'alt',
    status: 'active'
  }
]);

// 过滤后的加密货币
const filteredCryptos = computed(() => {
  let filtered = cryptos.value;
  
  // 按分类筛选
  if (activeFilter.value !== 'all') {
    filtered = filtered.filter(crypto => crypto.category === activeFilter.value);
  }
  
  // 按搜索关键词筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(crypto => 
      crypto.symbol.toLowerCase().includes(query) ||
      crypto.name.toLowerCase().includes(query)
    );
  }
  
  return filtered;
});

// 方法
const setActiveFilter = (filterId) => {
  activeFilter.value = filterId;
};

const selectCrypto = (crypto) => {
  console.log('选择加密货币:', crypto);
};

const viewChart = (crypto) => {
  console.log('查看图表:', crypto);
  // 这里可以跳转到图表页面
};

const startTrade = (crypto) => {
  console.log('开始交易:', crypto);
  // 这里可以跳转到交易页面
};

// 组件挂载
onMounted(() => {
  console.log('CryptoTrading组件已挂载');
});
</script>

<style scoped>
.crypto-trading-page {
  min-height: 100vh;
  padding: 0;
  color: white;
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
  z-index: -1;
  opacity: 0.8;
}

/* 添加深色遮罩层确保文字可读性 */
.crypto-trading-page::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 0;
  pointer-events: none;
}

/* 确保所有内容在遮罩层之上 */
.crypto-trading-page > * {
  position: relative;
  z-index: 1;
}

/* 页面头部 */
.page-header {
  padding: 2rem 1rem 1rem;
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(15px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}

.page-subtitle {
  font-size: 1.1rem;
  color: #ffffff;
  margin: 0;
  font-weight: 300;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
  opacity: 0.95;
}

/* 统计卡片 */
.stats-section {
  padding: 1.5rem 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(15px);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.stat-icon {
  font-size: 2rem;
  opacity: 0.8;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
  color: #ffffff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
}

.stat-label {
  font-size: 0.9rem;
  color: #ffffff;
  margin: 0;
  opacity: 0.9;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

/* 控制区域 */
.controls-section {
  padding: 0 1rem 1.5rem;
}

.search-container {
  margin-bottom: 1.5rem;
}

.search-input-wrapper {
  position: relative;
  max-width: 400px;
  margin: 0 auto;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  opacity: 0.7;
}

.search-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: none;
  border-radius: 50px;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(15px);
  color: white;
  font-size: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.search-input:focus {
  outline: none;
  background: rgba(0, 0, 0, 0.5);
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
}

/* 筛选标签 */
.filter-tabs {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 50px;
  background: rgba(0, 0, 0, 0.4);
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(15px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.filter-tab:hover {
  background: rgba(0, 0, 0, 0.6);
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.5);
}

.filter-tab.active {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.6);
  box-shadow: 0 5px 15px rgba(255, 255, 255, 0.3);
  color: #ffffff;
}

.filter-icon {
  font-size: 1.1rem;
}

/* 加密货币列表 */
.crypto-list-section {
  padding: 0 1rem 2rem;
}

.crypto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.crypto-card {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.crypto-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
  background: rgba(0, 0, 0, 0.6);
  border-color: rgba(255, 255, 255, 0.5);
}

.crypto-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.crypto-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.crypto-info {
  flex: 1;
}

.crypto-name {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
  color: #ffffff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
}

.crypto-desc {
  font-size: 0.9rem;
  color: #ffffff;
  margin: 0;
  opacity: 0.9;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.crypto-status {
  display: flex;
  align-items: center;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  background: rgba(76, 175, 80, 0.3);
  color: #4caf50;
  border: 1px solid rgba(76, 175, 80, 0.5);
  backdrop-filter: blur(10px);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.crypto-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.price-main {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
}

.price-change {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 600;
}

.price-change.positive {
  color: #4caf50;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
}

.price-change.negative {
  color: #f44336;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
}

.crypto-details {
  margin-bottom: 1.5rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.detail-label {
  color: #ffffff;
  opacity: 0.8;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.detail-value {
  font-weight: 600;
  color: #ffffff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
}

.crypto-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: none;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.chart-btn {
  background: rgba(0, 0, 0, 0.4);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
}

.chart-btn:hover {
  background: rgba(0, 0, 0, 0.6);
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.5);
}

.trade-btn {
  background: linear-gradient(45deg, #4caf50, #45a049);
  color: white;
  border: none;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
}

.trade-btn:hover {
  background: linear-gradient(45deg, #45a049, #3d8b40);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(76, 175, 80, 0.4);
}

/* 特色优势 */
.features-section {
  padding: 2rem 1rem;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(15px);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.section-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 2rem 0;
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  max-width: 1000px;
  margin: 0 auto;
}

.feature-card {
  text-align: center;
  padding: 2rem 1.5rem;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: transform 0.3s ease;
  backdrop-filter: blur(15px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.feature-card:hover {
  transform: translateY(-5px);
  background: rgba(0, 0, 0, 0.6);
  border-color: rgba(255, 255, 255, 0.5);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.9;
}

.feature-title {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 0.75rem 0;
  color: #ffffff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
}

.feature-desc {
  font-size: 0.95rem;
  color: #ffffff;
  line-height: 1.5;
  margin: 0;
  opacity: 0.9;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .crypto-grid {
    grid-template-columns: 1fr;
  }
  
  .filter-tabs {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }
  
  .filter-tab {
    white-space: nowrap;
    flex-shrink: 0;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 1.5rem 1rem 1rem;
  }
  
  .page-title {
    font-size: 1.8rem;
  }
  
  .crypto-card {
    padding: 1.25rem;
  }
  
  .crypto-actions {
    flex-direction: column;
  }
  
  .action-btn {
    padding: 0.875rem;
  }
}
</style>
