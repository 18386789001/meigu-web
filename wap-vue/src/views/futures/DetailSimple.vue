<template>
  <div id="futures-detail" class="pb-28">
    <!-- 简化的头部 -->
    <div class="simple-header">
      <div class="back-btn" @click="goBack">
        <van-icon name="arrow-left" size="20" />
      </div>
      <div class="title">{{ futuresDetail.name }}</div>
      <div class="favorite-btn">
        <van-icon name="star-o" size="20" />
      </div>
    </div>

    <!-- 价格信息区域 -->
    <div class="price-info-section">
      <div class="price-display">
        <div class="current-price" :class="{ positive: futuresDetail.change > 0, negative: futuresDetail.change < 0 }">
          {{ futuresDetail.price }}
        </div>
        <div class="price-change">
          <span class="change-amount" :class="{ positive: futuresDetail.change > 0, negative: futuresDetail.change < 0 }">
            {{ futuresDetail.change > 0 ? '+' : '' }}{{ futuresDetail.changeAmount }}
          </span>
          <span class="change-percent" :class="{ positive: futuresDetail.change > 0, negative: futuresDetail.change < 0 }">
            {{ futuresDetail.change > 0 ? '+' : '' }}{{ futuresDetail.change.toFixed(2) }}%
          </span>
        </div>
      </div>
      
      <!-- 详细信息展开区域 -->
      <section class="value-container" v-if="showMore">
        <div class="flex-l">
          <p class="first-line" :class="{ positive: futuresDetail.change > 0, negative: futuresDetail.change < 0 }">
            {{ futuresDetail.price }}
          </p>
          <p class="second-line">
            <span :class="{ positive: futuresDetail.change > 0, negative: futuresDetail.change < 0 }">
              {{ futuresDetail.change > 0 ? '+' : '' }}{{ futuresDetail.changeAmount }}
            </span>&nbsp;
            <span :class="{ positive: futuresDetail.change > 0, negative: futuresDetail.change < 0 }">
              {{ futuresDetail.change > 0 ? '+' : '' }}{{ futuresDetail.change.toFixed(2) }}%
            </span>
          </p>
        </div>
        <div class="flex-r">
          <div class="flex-r-item">
            <p>
              <span class="label">{{ t('最高价') }}</span>
              <span class="value">{{ futuresDetail.highPrice }}</span>
            </p>
            <p>
              <span class="label">{{ t('最低价') }}</span>
              <span class="value">{{ futuresDetail.lowPrice }}</span>
            </p>
            <p>
              <span class="label">{{ t('开盘价') }}</span>
              <span class="value">{{ futuresDetail.openPrice }}</span>
            </p>
          </div>
          <div class="flex-r-item">
            <p>
              <span class="label">{{ t('成交量') }}</span>
              <span class="value">{{ futuresDetail.volume }}</span>
            </p>
            <p>
              <span class="label">{{ t('持仓量') }}</span>
              <span class="value">{{ futuresDetail.openInterest }}</span>
            </p>
            <p>
              <span class="label">{{ t('结算价') }}</span>
              <span class="value">{{ futuresDetail.settlementPrice }}</span>
            </p>
          </div>
        </div>
      </section>
      
      <!-- 展开/收起按钮 -->
      <div class="toggle-btn" @click="showMore = !showMore">
        <van-icon :name="showMore ? 'arrow-up' : 'arrow-down'" />
      </div>
    </div>

    <!-- 交易面板区域 -->
    <div class="trading-panel">
      <FuturesOpen
        :symbol="symbol"
        :green-data="bids"
        :red-data="asks"
        :price="futuresDetail.price"
        @ordered="onOrdered">
      </FuturesOpen>
      
      <div class="divider"></div>
      
      <!-- 委托/持仓 -->
      <FuturesOrder
        :symbol="symbol"
        :order-cur="orderCur"
        :order-hold="orderHold"
        :futures-hold="futuresHold"
        :futures-history="futuresHistory"
        @tab="onTab"
        @recall="onRecall">
      </FuturesOrder>
    </div>

    <!-- K线图区域 -->
    <div class="kline-section">
      <div class="kline-header" @click="handleClickShowKlineChart">
        <span class="kline-title">{{ symbol.toUpperCase() }}&nbsp;&nbsp;{{ t('K线图表') }}</span>
        <van-icon :name="showKlineChart ? 'arrow-down' : 'arrow-up'" />
      </div>
      <div class="kline-container" v-if="showKlineChart">
        <div class="chart-placeholder" @click="openKlinePopup">
          <div class="chart-icon">📈</div>
          <div class="chart-text">{{ t('点击查看K线图表') }}</div>
        </div>
      </div>
    </div>

    <!-- K线图弹窗 -->
    <van-popup
      v-model:show="showKlinePopup"
      position="top"
      :style="{ height: '80%' }"
      round
      closeable
    >
      <div class="kline-popup-content">
        <div class="popup-header">
          <h3>{{ symbol.toUpperCase() }} {{ t('K线图表') }}</h3>
        </div>
        <div class="popup-chart">
          <div class="chart-placeholder">
            <div class="chart-icon">📊</div>
            <div class="chart-text">{{ t('K线图表功能') }}</div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import FuturesOpen from '@/components/Transform/futures-open/index.vue'
import FuturesOrder from '@/components/Transform/futures-order/index.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

// 响应式数据
const symbol = ref(route.params.symbol || 'AU2412')
const showMore = ref(false)
const showKlineChart = ref(false)
const showKlinePopup = ref(false)
const bids = ref([])
const asks = ref([])
const orderCur = ref([])
const orderHold = ref([])
const futuresHold = ref([
  {
    symbol: 'AU2412',
    direction: 'long',
    leverage: 10,
    quantity: '1.5',
    openPrice: '428.50',
    markPrice: '429.20',
    margin: '64.28',
    pnl: 1.05
  }
])
const futuresHistory = ref([
  {
    symbol: 'AU2412',
    action: 'long', // 使用英文标识，在显示时通过i18n翻译
    quantity: '1.0',
    price: '427.80',
    pnl: 2.15,
    createTime: Date.now() - 3600000
  }
])

// 期货详情数据
const futuresDetail = ref({
  symbol: route.params.symbol || 'AU2412',
  name: 'AU2412', // 使用symbol作为name，在显示时通过i18n翻译
  commodityName: '黄金', // 商品名称，用于i18n翻译
  contractCode: '2412',
  price: '428.593',
  change: 1.35,
  changeAmount: '5.74',
  openPrice: '428.00',
  highPrice: '430.50',
  lowPrice: '427.20',
  volume: '125,432',
  openInterest: '45,678',
  settlementPrice: '428.00'
})

// 方法
const goBack = () => {
  router.go(-1)
}

const onOrdered = () => {
  console.log('下单成功回调')
}

const onTab = () => {
  console.log('标签切换')
}

const onRecall = () => {
  console.log('撤单回调')
}

const handleClickShowKlineChart = () => {
  showKlineChart.value = !showKlineChart.value
}

const openKlinePopup = () => {
  showKlinePopup.value = true
}

onMounted(() => {
  console.log('期货详情页面加载:', symbol.value)
})
</script>

<style lang="scss" scoped>
#futures-detail {
  background: $mainBgColor;
  min-height: 100vh;
}

.simple-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: $mainBgColor;
  border-bottom: 1px solid $border_color;

  .back-btn,
  .favorite-btn {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .title {
    font-size: 30px;
    font-weight: 700;
    color: $text_color;
  }
}

.price-info-section {
  background: $mainBgColor;
  padding: 20px;
  border-bottom: 1px solid $border_color;
}

.price-display {
  text-align: center;
  margin-bottom: 16px;
}

.current-price {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 12px;
  color: $text_color;
}

.price-change {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.change-amount,
.change-percent {
  font-size: 26px;
  font-weight: 600;
}

.positive {
  color: $red;
}

.negative {
  color: $green;
}

.value-container {
  display: flex;
  padding: 20px 0;
  border-top: 1px solid $border_color;

  .flex-l {
    flex: 1;
    padding-right: 20px;

    .first-line {
      font-size: 36px;
      font-weight: 700;
      margin-bottom: 12px;
    }

    .second-line {
      font-size: 22px;
      color: $text_color2;
      font-weight: 500;
    }
  }

  .flex-r {
    flex: 2;
    display: flex;
    gap: 20px;

    .flex-r-item {
      flex: 1;

      p {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        font-size: 21px;

        .label {
          color: $text_color2;
          font-weight: 500;
        }

        .value {
          color: $text_color;
          font-weight: 600;
        }
      }
    }
  }
}

.toggle-btn {
  text-align: center;
  padding: 8px;
  cursor: pointer;
  color: $text_color2;
}

.trading-panel {
  background: $mainBgColor;
  margin: 16px;
  border-radius: 8px;
  border: 1px solid $border_color;
  padding: 16px;
}

.divider {
  height: 1px;
  background: $border_color;
  margin: 16px 0;
}

.kline-section {
  background: $mainBgColor;
  margin: 16px;
  border-radius: 8px;
  border: 1px solid $border_color;
  overflow: hidden;
}

.kline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  cursor: pointer;

  .kline-title {
    font-size: 22px;
    color: $text_color;
    font-weight: 500;
  }
}

.kline-container {
  border-top: 1px solid $border_color;
}

.chart-placeholder {
  height: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: $text_color3;

  .chart-icon {
    font-size: 52px;
    margin-bottom: 12px;
  }

  .chart-text {
    font-size: 22px;
    font-weight: 500;
  }
}

.kline-popup-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: $mainBgColor;
  
  .popup-header {
    padding: 16px;
    border-bottom: 1px solid $border_color;
    text-align: center;
    
    h3 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: $text_color;
    }
  }
  
  .popup-chart {
    flex: 1;
    padding: 16px;
    
    .chart-placeholder {
      height: 100%;
    }
  }
}
</style>
