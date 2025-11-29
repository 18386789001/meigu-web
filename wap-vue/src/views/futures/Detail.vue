<template>
  <div id="futures-detail" class="pb-28 no_touch">
    <!-- 头部区域 -->
    <ContractHeader
      :symbol="symbol"
      :range="range"
      :selectIndex="selectIndex"
      :symbolName="futuresDetail.name"
      :balance="userInfo.balance"
      @tab="onTopTab"
      @update-coin="onUpdate">
    </ContractHeader>

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
    </div>

    <!-- 交易面板区域 -->
    <div :class="{ slide2: animated1 }" v-if="selectIndex === 1">
      <div class="mainBackground rounded-view">
        <FuturesOpen
          class="pl-8 pr-8"
          :symbol="symbol"
          :green-data="bids"
          :red-data="asks"
          :price="futuresDetail.price"
          @ordered="onOrdered">
        </FuturesOpen>
        <div class="line"></div>
        <!-- 委托/持仓-->
        <FuturesOrder
          class="pl-8 pr-8"
          :symbol="symbol"
          :order-cur="orderCur"
          :order-hold="orderHold"
          :topIndex="selectIndex"
          :futures-hold="futuresHold"
          :futures-history="futuresHistory"
          @tab="onTab"
          @recall="onRecall">
        </FuturesOrder>
      </div>
    </div>

    <!-- K线图区域 -->
    <div class="fixed-box">
      <div class="flex justify-between items-center px-8 py-5" @click.stop="handleClickShowKlineChart()">
        <span class="text-36 textColor">{{ symbol.toUpperCase() }}&nbsp;&nbsp;{{ t('K线图表') }}</span>
        <van-icon class="textColor text-34" :name="showCharts ? 'arrow-down' : 'arrow-up'"></van-icon>
      </div>
      <div class="kline-container flex" v-if="showKlineChart">
        <div class="chart-index" @click="openKlinePopup">
          <k-line-charts
            :update-key="updateKey"
            :update-data="quote"
            :symbol="symbol"
            :showBottom="true"
          />
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
          <k-line-charts
            :update-key="updateKey"
            :update-data="quote"
            :symbol="symbol"
            :showBottom="true"
            :height="400"
          />
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import ContractHeader from '@/components/Transform/contract-header/index.vue'
import FuturesOpen from '@/components/Transform/futures-open/index.vue'
import FuturesOrder from '@/components/Transform/futures-order/index.vue'
import KLineCharts from '@/components/Transform/kline-charts/index.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const store = useStore()

// 响应式数据
const symbol = ref(route.params.symbol || 'AU2412')
const range = ref([])
const selectIndex = ref(1)
const showMore = ref(false)
const showCharts = ref(false)
const showKlineChart = ref(false)
const showKlinePopup = ref(false)
const animated1 = ref(false)
const updateKey = ref(0)
const quote = ref({})
const userInfo = ref({})
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

const sockets = reactive({
  quotes: null,
  deep: null
})

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
const onTopTab = (index) => {
  selectIndex.value = index
  animated1.value = !animated1.value
}

const onUpdate = () => {
  // 更新数据
}

const onOrdered = () => {
  // 下单成功回调
}

const onTab = () => {
  // 标签切换
}

const onRecall = () => {
  // 撤单回调
}

const handleClickShowKlineChart = () => {
  showKlineChart.value = !showKlineChart.value
  showCharts.value = !showCharts.value
}

// 点击K线图区域弹出K线图表
const openKlinePopup = () => {
  showKlinePopup.value = true
}

const startQuoteSocket = () => {
  // 模拟WebSocket连接，实际项目中需要配置正确的WS_URL
  console.log('启动行情WebSocket连接:', symbol.value)
  // sockets.quotes = new WebSocket(`${WS_URL}/1/${symbol.value}`)
}

const startDeepSocket = () => {
  // 模拟WebSocket连接
  console.log('启动深度WebSocket连接:', symbol.value)
  // sockets.deep = new WebSocket(`${WS_URL}/3/${symbol.value}`)
}

const handleQoutes = (data) => {
  // 处理行情数据
  if (data && data.length > 0) {
    const quoteData = data[0]
    futuresDetail.value.price = quoteData.close || futuresDetail.value.price
    futuresDetail.value.change = quoteData.change_ratio || futuresDetail.value.change
    futuresDetail.value.changeAmount = quoteData.netChange || futuresDetail.value.changeAmount
  }
}

const handleDeep = (data) => {
  // 处理深度数据
  bids.value = data.bids || []
  asks.value = data.asks || []
}

onMounted(() => {
  // 获取用户信息
  userInfo.value = store.state.user?.userInfo || {}

  // 启动WebSocket连接
  startQuoteSocket()
  startDeepSocket()

  // 根据symbol获取期货详情数据
  const symbolParam = route.params.symbol
  if (symbolParam) {
    console.log('加载期货详情:', symbolParam)
    // 这里可以调用API获取具体的期货详情
  }
})

onBeforeUnmount(() => {
  // 关闭WebSocket连接
  if (sockets.quotes) {
    sockets.quotes.close()
  }
  if (sockets.deep) {
    sockets.deep.close()
  }
})
</script>

<style lang="scss" scoped>
#futures-detail {
  background: $mainBgColor;
  min-height: 100vh;
  font-size: 20px; // 大幅增加基础字号
  
  // 全局字号调整
  * {
    font-size: inherit;
  }
  
  // 确保所有文本元素都有合适的最小字号
  p, span, div, label, input, button {
    font-size: 20px;
  }
  
  // 小字号文本调整
  .text-sm {
    font-size: 18px !important;
  }
  
  // 中等字号文本调整
  .text-base {
    font-size: 20px !important;
  }
  
  // 大字号文本调整
  .text-lg {
    font-size: 22px !important;
  }
  
  // 超大字号文本调整
  .text-xl {
    font-size: 24px !important;
  }
  
  .text-2xl {
    font-size: 28px !important;
  }
  
  .text-3xl {
    font-size: 34px !important;
  }
  
  .text-4xl {
    font-size: 40px !important;
  }
  
  .text-5xl {
    font-size: 48px !important;
  }
  
  .text-6xl {
    font-size: 56px !important;
  }
  
  // 新增更大的字号类
  .text-30 {
    font-size: 30px !important;
  }
  
  .text-32 {
    font-size: 32px !important;
  }
  
  .text-34 {
    font-size: 34px !important;
  }
  
  .text-36 {
    font-size: 36px !important;
  }
  
  .text-40 {
    font-size: 40px !important;
  }
  
  .text-44 {
    font-size: 44px !important;
  }
  
  .text-48 {
    font-size: 48px !important;
  }
  
  .text-52 {
    font-size: 52px !important;
  }
}

/* 价格信息区域 */
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
  font-size: 52px;
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

/* 详细信息展开区域 */
.value-container {
  display: flex;
  padding: 20px 0;
  border-top: 1px solid $border_color;

  .flex-l {
    flex: 1;
    padding-right: 20px;

    .first-line {
      font-size: 40px;
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

/* 交易面板区域 */
.mainBackground {
  background: $mainBgColor;
  margin: 16px;
  border-radius: 8px;
  overflow: hidden;
}

.rounded-view {
  border: 1px solid $border_color;
}

.line {
  height: 1px;
  background: $border_color;
  margin: 0 16px;
}

/* K线图区域 */
.fixed-box {
  background: $mainBgColor;
  margin: 16px;
  border-radius: 8px;
  border: 1px solid $border_color;
  overflow: hidden;
}

.kline-container {
  background: $mainBgColor;

  .chart-index {
    width: 100%;
    height: 300px;
  }
}

/* K线图弹窗 */
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

    :deep(.chart-container) {
      height: 100% !important;
    }
  }
}

/* 动画效果 */
.slide1 {
  animation: slideInLeft 0.3s ease-in-out;
}

.slide2 {
  animation: slideInRight 0.3s ease-in-out;
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 响应式设计 */
@media (max-width: 375px) {
  .price-info-section {
    padding: 12px;
  }

  .current-price {
    font-size: 40px;
  }

  .value-container {
    flex-direction: column;
    gap: 16px;

    .flex-l {
      padding-right: 0;
    }

    .flex-r {
      flex-direction: column;
      gap: 8px;
    }
  }

  .mainBackground {
    margin: 12px;
  }

  .fixed-box {
    margin: 12px;
  }

  .kline-container .chart-index {
    height: 250px;
  }
}
</style>
