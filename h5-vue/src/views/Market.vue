<template>
  <div class="market-page">
    <div class="container">
      <h1 class="page-title">{{ $t('market.title') }}</h1>
      <p class="page-subtitle">{{ $t('market.subtitle') }}</p>
      
      <div class="market-grid">
        <div class="market-card">
          <h3>{{ $t('market.forex') }}</h3>
          <div 
            v-for="item in marketData.forex" 
            :key="item.symbol"
            class="price-item"
          >
            <span class="symbol">{{ item.symbol }}</span>
            <span class="price">{{ item.price.toFixed(4) }}</span>
            <span class="change" :class="{ positive: item.isPositive, negative: !item.isPositive }">
              {{ formatChange(item.change) }}
            </span>
          </div>
        </div>
        
        <div class="market-card">
          <h3>{{ $t('market.crypto') }}</h3>
          <div 
            v-for="item in marketData.crypto" 
            :key="item.symbol"
            class="price-item"
          >
            <span class="symbol">{{ item.symbol }}</span>
            <span class="price">{{ item.price.toLocaleString() }}</span>
            <span class="change" :class="{ positive: item.isPositive, negative: !item.isPositive }">
              {{ formatChange(item.change) }}
            </span>
          </div>
        </div>
        
        <div class="market-card">
          <h3>{{ $t('market.commodities') }}</h3>
          <div 
            v-for="item in marketData.commodities" 
            :key="item.symbol"
            class="price-item"
          >
            <span class="symbol">{{ item.symbol }}</span>
            <span class="price">{{ item.price.toFixed(2) }}</span>
            <span class="change" :class="{ positive: item.isPositive, negative: !item.isPositive }">
              {{ formatChange(item.change) }}
            </span>
          </div>
        </div>
        
        <div class="market-card">
          <h3>{{ $t('market.stocks') }}</h3>
          <div 
            v-for="item in marketData.stocks" 
            :key="item.symbol"
            class="price-item"
          >
            <span class="symbol">{{ item.symbol }}</span>
            <span class="price">{{ item.price.toFixed(2) }}</span>
            <span class="change" :class="{ positive: item.isPositive, negative: !item.isPositive }">
              {{ formatChange(item.change) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 模拟行情数据
const marketData = ref({
  forex: [
    { symbol: 'EUR/USD', price: 1.0850, change: 0.0012, isPositive: true },
    { symbol: 'GBP/USD', price: 1.2650, change: -0.0008, isPositive: false },
    { symbol: 'USD/JPY', price: 149.85, change: 0.25, isPositive: true }
  ],
  crypto: [
    { symbol: 'BTC/USD', price: 43250, change: 1250, isPositive: true },
    { symbol: 'ETH/USD', price: 2650, change: 85, isPositive: true },
    { symbol: 'BNB/USD', price: 315.50, change: -12.30, isPositive: false }
  ],
  commodities: [
    { symbol: 'XAU/USD', price: 2045.80, change: 15.20, isPositive: true },
    { symbol: 'XAG/USD', price: 24.15, change: 0.35, isPositive: true },
    { symbol: 'USOIL', price: 72.45, change: -1.25, isPositive: false }
  ],
  stocks: [
    { symbol: 'AAPL', price: 192.45, change: 2.15, isPositive: true },
    { symbol: 'TSLA', price: 248.80, change: -8.50, isPositive: false },
    { symbol: 'MSFT', price: 378.90, change: 5.25, isPositive: true }
  ]
})

// 格式化价格变化显示
const formatChange = (change) => {
  const isPositive = change >= 0
  const prefix = isPositive ? '+' : ''
  return `${prefix}${change.toFixed(2)}`
}

// 模拟实时数据更新
let updateInterval = null

const updateMarketData = () => {
  // 随机更新价格数据
  marketData.value.forex.forEach(item => {
    const randomChange = (Math.random() - 0.5) * 0.002
    item.price += randomChange
    item.change = randomChange
    item.isPositive = randomChange >= 0
  })
  
  marketData.value.crypto.forEach(item => {
    const randomChange = (Math.random() - 0.5) * 100
    item.price += randomChange
    item.change = randomChange
    item.isPositive = randomChange >= 0
  })
  
  marketData.value.commodities.forEach(item => {
    const randomChange = (Math.random() - 0.5) * 5
    item.price += randomChange
    item.change = randomChange
    item.isPositive = randomChange >= 0
  })
  
  marketData.value.stocks.forEach(item => {
    const randomChange = (Math.random() - 0.5) * 2
    item.price += randomChange
    item.change = randomChange
    item.isPositive = randomChange >= 0
  })
}

onMounted(() => {
  // 每3秒更新一次数据
  updateInterval = setInterval(updateMarketData, 3000)
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})
</script>

<style scoped>
.market-page {
  min-height: 100vh;
  padding: 40px 0;
  background: #0a0a0a;
  color: white;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-title {
  text-align: center;
  margin-bottom: 16px;
  color: #ffffff;
  font-size: 28px;
}

.page-subtitle {
  text-align: center;
  margin-bottom: 40px;
  color: #cccccc;
  font-size: 16px;
}

.market-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.market-card {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 24px;
}

.market-card h3 {
  margin-bottom: 20px;
  color: #ffd700;
  font-size: 20px;
}

.price-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #333;
  transition: all 0.3s ease;
}

.price-item:last-child {
  border-bottom: none;
}

.price-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  padding: 12px 8px;
}

.symbol {
  font-weight: 600;
  color: #ffffff;
}

.price {
  font-weight: 600;
  color: #ffffff;
}

.change {
  font-weight: 600;
}

.change.positive {
  color: #10b981;
  animation: priceUp 0.5s ease-in-out;
}

.change.negative {
  color: #ef4444;
  animation: priceDown 0.5s ease-in-out;
}

@keyframes priceUp {
  0% { background-color: rgba(16, 185, 129, 0.2); }
  100% { background-color: transparent; }
}

@keyframes priceDown {
  0% { background-color: rgba(239, 68, 68, 0.2); }
  100% { background-color: transparent; }
}

@media (max-width: 768px) {
  .market-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .container {
    padding: 0 16px;
  }
}
</style>