<template>
  <section class="pb-10">
    <div class="container-box">
      <header class="header">
        <div class="flex-l">
          <div class="icon back" @click="handleBack">
            <van-icon name="arrow-left" size="20" />
          </div>
          <div class="name-box flex">
            <div class="icon" @click="handleShowSidebar()">
              <img src="@/assets/image/foreign/exchange.png" alt="">
            </div>
            <p class="title">{{ symbol }}</p>
          </div>
        </div>
        <div class="icon-group">
          <div class="icon record" @click="onRoute('/position')">
            <img src="../../assets/image/foreign/record.png" alt="">
          </div>
          <div class="icon setting">
            <img src="../../assets/image/icon-star_active.png" class="collected-img" @click="openCurrency"
              v-if="isCollect" />
            <img v-else src="../../assets/image/icon-star.png" class="collected-img" @click="openCurrency" />
          </div>
        </div>
      </header>
      <section class="value-container">
        <div class="flex-l">
          <!-- 红色实时价格（最新价/今收） -->
          <p class="first-line red">{{ priceFormat(realtimeData?.close) }}</p>
          <!-- 涨跌额和涨跌幅度放在下方 -->
          <div class="price-changes">
            <span class="net-change" :class="realtimeData?.netChange >= 0 ? 'text-up' : 'text-down'">
              {{ realtimeData?.netChange >= 0 ? '+' : '' }}{{ netChangeFormat(realtimeData?.netChange) }}
            </span>
            <span class="change-ratio" :class="realtimeData?.changeRatio >= 0 ? 'text-up' : 'text-down'">
              {{ realtimeData?.changeRatio >= 0 ? '+' : '' }}{{ changeRatioFormat(realtimeData?.changeRatio) }}%
            </span>
          </div>
        </div>
        <div class="flex-r">
          <div class="flex-r-item">
            <p class="price-row">
              <span class="label">{{ t('high') }}</span>
              <span class="value">{{ priceFormat(realtimeData?.high) }}</span>
            </p>
            <p class="price-row">
              <span class="label">{{ t('Low') }}</span>
              <span class="value">{{ priceFormat(realtimeData?.low) }}</span>
            </p>
          </div>
          <div class="flex-r-item">
            <p class="price-row">
              <span class="label">{{ t('Open') }}</span>
              <span class="value">{{ priceFormat(realtimeData?.open) }}</span>
            </p>
            <p class="price-row">
              <span class="label">{{ t('今收') }}</span>
              <span class="value">{{ priceFormat(realtimeData?.close) }}</span>
            </p>
          </div>
        </div>
      </section>
      <p class="status-info" v-if="chartData?.market?.status">
        <span>{{ chartData?.market?.status && $t(chartData?.market?.status) }},</span>
        <span class="time">{{ chartData?.market?.time_str }}</span>&nbsp;
        <span>{{ chartData?.market?.time_zone && $t(chartData?.market?.time_zone) }}</span>
      </p>
      <section class="indicator-index-container">
        <div class="indicator-index-box">
          <div class="flex-l">
            <ul>
              <li v-for="(item, index) in filterOne" :key="item" @click="handleClickSelectTime(item, index)"
                :class="[item.index === timeLabelActive ? 'active' : '']">{{
                  item.name
                }}</li>
              <li @click="handleClickMoreBtn">{{ t('More') }}</li>
            </ul>
          </div>
          <div class="flex-r">
            <!-- <img src="@/assets/image/quotes/index-setting.png" alt=""> -->
          </div>
        </div>
        <div class="indicator-index-box-second" v-if="showMore">
          <ul>
            <li v-for="(item, index) in filterTwo" :key="item" @click="handleClickSelectTime(item, index)"
              :class="[item.index === timeLabelActive ? 'active' : '']">{{
                item.name
              }}</li>
          </ul>
        </div>
      </section>
      <section class="kline-container flex">
        <div class="chart-index">
          <fx-kline :height="450" :symbol="symbol" :isShowsolid="true" :chartType="chartType" v-if="symbol" @data="onData"
            :key="`${symbol}-${timeValue}`" />
        </div>
        <!-- <div class="order-book-container" v-if="timeLabelActive === 0">
          <keep-alive>
            <trade-deep-data :symbol="symbol" v-if="symbol" :price="price" class="trade-deep-container" />
          </keep-alive>
        </div> -->
      </section>
      <!-- <section class="footer-btn-group">
        <div class="flex-l" @click="onRoute('/cryptos/exchangeRate')" style="display: none;">
          <img src="@/assets/image/quotes/exchange.png" alt="">
          <p class="rate">{{ t('汇率') }}</p>
        </div>
        <div class="flex btn-group">
          <div class="flex-r flex">
            <div :class="[noData ? 'disabled buy-btn' : 'buy-btn']" @click="gotoPage('buy')">{{
              t('buy') }}</div>
            <div :class="[noData ? 'disabled sell-btn' : 'sell-btn']" @click="gotoPage('sell')">{{ t('sell') }}</div>
          </div>
        </div>
      </section> -->
      <section class="footer-btn-group flex items-center">
        <div class="flex-l exchangeRate-box" @click="onRoute('/cryptos/exchangeRate')" style="display: none;">
          <img src="@/assets/image/quotes/exchange.png" alt="">
          <p class="rate">{{ t('汇率') }}</p>
        </div>
        <div class="flex btn-group">

          <div class="flex btn-group">
            <div class="flex-r flex">
              <div :class="[noData ? 'disabled buy-btn' : 'buy-btn']" @click="gotoPage('buy')">{{
                t('buy') }}</div>
              <div :class="[noData ? 'disabled sell-btn' : 'sell-btn']" @click="gotoPage('sell')">{{ t('sell') }}</div>
            </div>
          </div>
        </div>
      </section>
      <van-popup overlay-class="left-modal" v-model:show="showLeftPopup" position="left" class="popup-bg"
        :style="{ width: '80%', height: '100%' }" round safe-area-inset-top safe-area-inset-bottom>
        <div class="modal-inner-box">
          <div class="sidebar">
            <div class="flex justify-between">
              <div class="flex items-center text-grey">
                <div class="mr-12">{{ $t('Symbol') }}</div>
              </div>
              <div class="flex text-grey right-text">
                <div class="item">
                  <div>{{ $t('lastPrice') }} / 24H {{ $t('upsAndDowns') }}</div>
                </div>
              </div>
            </div>
            <div class="flex justify-between mt-4" v-for="item in listData" :key="item.name"
              @click="handleSelectSymbol(item)">
              <div>
                <div class="font-bold textColor">{{ item.name }}</div>
              </div>
              <div class="text-right text-24">
                <div class="textColor">{{ item.close }}</div>
                <div class="value" :class="item.change_ratio > 0 ? 'green' : 'red'">{{ item.change_ratio
                }}%</div>
              </div>
            </div>
          </div>
        </div>
      </van-popup>
    </div>
    <add-currency @updateItem="getIsItemHasAddGlobal" :isCollect="isCollect" ref="addCurrencyRef"></add-currency>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Popup } from 'vant';
import { useI18n } from 'vue-i18n'
import fxKline from '@/components/fx-kline/index.vue'
import fxPopup from '@/components/fx-popup/charts-cycle.vue'
import { useUserStore } from '@/store/user.js';
import { useQuotesStore } from '@/store/quotes.store';
import { SET_STAGE } from '@/store/types.store';
import { _getQuotes, _isItemHasAddGlobal, _getRealtimeByType } from '@/service/quotes.api'
import addCurrency from '@/components/add-currency/index.vue'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const show = ref(false)
const showSelect = ref(false)
const quotesStore = useQuotesStore()
const userStore = useUserStore()
const symbol = ref('')
const timeValue = ref('')
const chartData = ref({})
const realtimeData = ref({}) // 新增：实时数据状态
const listData = ref([])
const active = ref(0)
const timeLabelActive = ref(0)
const chartType = ref('')
const allEtfTabIndex = ref(0)
const realtimeTimer = ref(null) // 新增：实时数据定时器
const allEtfListData = ref([])
const noData = ref(true)
const price = ref('')
const symbolType = ref('forex') //默认查询外汇
const showMore = ref(false)
const showLeftPopup = ref(false)
const addCurrencyRef = ref(null)
const isCollect = ref(false)

const filterOne = ref([

  { name: t('分时'), paramsValue: 'timeSharing', seconds: 1 * 60 * 1000, index: 0, },
  { name: '1' + t('天'), paramsValue: '1day', seconds: 1 * 24 * 60 * 60 * 1000, index: 1, },
  { name: '1' + t('周'), paramsValue: '1week', seconds: 7 * 24 * 60 * 60 * 1000, index: 2, },
  { name: '1' + t('月'), paramsValue: '1mon', seconds: 30 * 24 * 60 * 60 * 1000, index: 3, },
  { name: '5' + t('天'), paramsValue: '5day', seconds: 5 * 24 * 60 * 60 * 1000, index: 4, },
])


const filterTwo = ref([
  { name: '120' + t('分'), paramsValue: '120min', seconds: 2 * 60 * 60 * 1000, index: 5, },
  { name: '60' + t('分'), paramsValue: '60min', seconds: 1 * 60 * 60 * 1000, index: 6, },
  { name: '30' + t('分'), paramsValue: '30min', seconds: 30 * 60 * 1000, index: 7, },
  { name: '15' + t('分'), paramsValue: '15min', seconds: 15 * 60 * 1000, index: 8, },
  { name: '5' + t('分'), paramsValue: '5min', seconds: 5 * 60 * 1000, index: 9, },
  { name: '1' + t('分'), paramsValue: '1min', seconds: 1 * 60 * 1000, index: 10, },
])

onMounted(async () => {
  if (route.query.symbol) {
    symbol.value = route.query.symbol
  } else {
    symbol.value = quotesStore.coins.length ? quotesStore.coins[0].symbol : 'EURUSD'
  }
  if (quotesStore.stage === 'timeSharing') {
    chartType.value = 'area'
  } else {
    chartType.value = 'candle_solid'
  }
  fetchQuotes()
  fetchTableData()
  getIsItemHasAddGlobal()
  
  // 启动实时数据定时器
  startRealtimeTimer()
})

onBeforeMount(() => {
  console.log('mount')
  // 停止实时数据定时器
  stopRealtimeTimer()
})

const onRoute = (path) => {
  router.push(path)
}

const handleBack = () => {
  if (route.query.isOptional == 1) {
    router.push(`/optional/index`)
    return
  }
  // if (route.query.isOptional == 2){
  //   router.push(`/optional/search`)
  //   return
  // }
  if (route.query.from === 'trade') {
    router.push(`/trade/index?tabActive=2&navActive=2`)
  } else if (route.query.from === 'contract') {
    // 从合约交易页签进入，返回到行情页面的大宗商品页签
    router.push('/quotes/index?tabActive=3&activeTradingTab=contract')
  } else {
    // 默认跳转到行情页面的外汇页签
    router.push('/quotes/index?tabActive=2')
  }
}

const handleSelectSymbol = (item) => {
  symbol.value = item.name
  showLeftPopup.value = false
  getIsItemHasAddGlobal()
}

const gotoPage = (type) => {
  if (noData.value || Object.keys(chartData.value).length === 0) {
    return
  }
  if (!userStore.userInfo.token) {
    router.push('/login')
    return
  }
  router.push({
    path: '/foreign/opening',
    query: {
      symbol: symbol.value,
      type,
      closePrice: Number(chartData.value.close).toFixed(4),
    }

  })
}

const handleClickSelectTime = (params) => {
  const { paramsValue, seconds, index } = params;
  timeLabelActive.value = index;
  quotesStore[SET_STAGE]({ stage: paramsValue, seconds })
  onSelectTime(paramsValue)
}

const onSelectTime = (evt) => {
  timeValue.value = evt
  if (evt == 'timeSharing') {
    chartType.value = 'area'
  } else {
    chartType.value = 'candle_solid'
  }
}

// 事件
const onData = (data) => {
  chartData.value = data
  noData.value = false
}
const fetchQuotes = () => {
  _getQuotes(quotesStore.coins).then(data => {
    data.map(item => {
      item.name = item.symbol
    })
    listData.value = data
  })
}

// 新增：获取实时数据
const fetchRealtimeData = async () => {
  if (!symbol.value) return
  
  try {
    // 根据路由参数 from 判断是外汇还是大宗商品
    const isCommodities = route.query.from === 'contract'
    const category = isCommodities ? 'commodities' : 'forex'
    
    console.log('🔍 获取实时数据:', {
      symbol: symbol.value,
      from: route.query.from,
      category: category,
      isCommodities: isCommodities
    })
    
    const data = await _getRealtimeByType({
      type: 'forex',
      category: category,  // 根据来源动态设置类型
      pageNo: 1
    })
    
    console.log('📡 API返回数据数量:', data?.length)
    
    // 根据当前symbol找到对应的数据
    const currentSymbolData = data.find(item => 
      item.symbol?.toUpperCase() === symbol.value?.toUpperCase()
    )
    
    if (currentSymbolData) {
      realtimeData.value = {
        close: currentSymbolData.close,      // 今收/最新价
        open: currentSymbolData.open,        // 今开
        high: currentSymbolData.high,        // 最高
        low: currentSymbolData.low,          // 最低
        changeRatio: currentSymbolData.changeRatio,  // 涨跌幅度
        netChange: currentSymbolData.netChange       // 涨跌额
      }
      
      console.log('✅ 实时数据已更新:', {
        类型: isCommodities ? '大宗商品' : '外汇',
        品种: symbol.value,
        最新价: currentSymbolData.close,
        今开: currentSymbolData.open,
        最高: currentSymbolData.high,
        最低: currentSymbolData.low,
        涨跌额: currentSymbolData.netChange,
        涨跌幅: currentSymbolData.changeRatio + '%'
      })
    } else {
      console.warn('⚠️ 未找到对应的数据:', {
        symbol: symbol.value,
        category: category,
        可用数据: data?.map(item => item.symbol).slice(0, 5)
      })
    }
  } catch (error) {
    console.error('❌ 获取实时数据失败:', error)
  }
}

// 新增：启动实时数据定时器
const startRealtimeTimer = () => {
  stopRealtimeTimer() // 先清除现有定时器
  
  // 立即获取一次数据
  fetchRealtimeData()
  
  // 设置定时器，每3秒获取一次数据
  realtimeTimer.value = setInterval(() => {
    fetchRealtimeData()
  }, 3000)
  
  console.log('🔄 实时数据定时器已启动，每3秒更新一次')
}

// 新增：停止实时数据定时器
const stopRealtimeTimer = () => {
  if (realtimeTimer.value) {
    clearInterval(realtimeTimer.value)
    realtimeTimer.value = null
    console.log('🛑 实时数据定时器已停止')
  }
}

const filterCoins = (type) => {
  let arr = [...quotesStore.coins]
  let result = []
  if (type === "all") {
    result = arr;
  } else {
    result = arr.filter(item => item.type === type)
  }
  return result;
}

const fetchTableData = () => {
  const params = filterCoins(symbolType.value)
  _getQuotes(params).then(data => {
    allEtfListData.value = data
  })
}

const handleClickMoreBtn = () => {
  showMore.value = !showMore.value
}

const priceFormat = (value) => {
  return Number(value || '0.00').toFixed(2)
}

// 新增：涨跌额格式化函数
const netChangeFormat = (value) => {
  return Number(value || '0.00').toFixed(2)
}

// 新增：涨跌幅度格式化函数
const changeRatioFormat = (value) => {
  return Number(value || '0.00').toFixed(2)
}

const handleShowSidebar = () => {
  showLeftPopup.value = true
}
const openCurrency = () => {
  addCurrencyRef.value.openCurrency(symbol.value)
}
//判断是否加入收藏
const getIsItemHasAddGlobal = () => {
  let obj = {
    symbol: symbol.value
  }
  _isItemHasAddGlobal(obj).then((data) => {
    isCollect.value = data
  })
}
</script>
<style lang="scss" scoped>
:deep(.van-sidebar) {
  width: 100%;
}

:deep(.van-sidebar-item) {
  background-color: $main2_background;
  color: $text_color;
  padding: 10px;
}

:deep(.van-sidebar-item--select) {
  background-color: $select-bg;
  color: $color_main;
}

:deep(.modal-inner-box) {
  padding: 20px;
  font-size: 14px;

}

.container-box {
  padding: 0 10px 50px 10px;

  .green {
    color: $green;
  }

  .red {
    color: $red;
  }

  .header {
    position: relative;
    display: flex;
    align-items: center;

    .flex-l {
      flex: 1;
      display: inline-flex;
      align-items: center;

      .icon {
        margin-right: 10px;
        display: inline-block;
        width: 20px;
        height: 20px;

        img {
          height: 20px;
          width: 20px;
        }
      }

      .name-box {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        align-items: center;

        .title {
          font-size: 16px;
          font-weight: 700;
          line-height: 16px;
        }

        .type {
          font-size: 12px;
          color: $text_color6;
        }
      }
    }

    .icon-group {
      width: 100px;
      text-align: right;

      .icon {
        display: inline-block;
        width: 28px;
        height: 28px;
        padding: 4px;
        margin-left: 16px;
      }
    }


  }

  .status-info {
    padding: 0 6px;
    font-size: 12px;
    line-height: 32px;
    height: 32px;
    border-bottom: 1px solid $border_color;
    display: flex;
    align-items: center;

    .time {
      display: inline-block;
      margin-right: 10px;
    }
  }

  .value-container {
    margin-top: 20px;
    padding-bottom: 20px;
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #747A8F;
    border-bottom: 1px solid $border_color;

    .flex-l {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 160px;

      .first-line {
        font-weight: 700;
        font-size: 18px; // 减小字体大小，避免遮挡其他字段
        margin-bottom: 4px;
      }

      .price-changes {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        margin-top: 4px;
        gap: 8px; // 缩短涨跌额和涨跌幅度的间距

        .net-change {
          font-size: 12px;
          font-weight: 600;
          text-align: left;
        }

        .change-ratio {
          font-size: 12px;
          font-weight: 600;
          text-align: left; // 改为左对齐，往左移动
        }
      }

      .second-line {
        margin-top: 8px;
      }
    }

    .flex-r {
      flex: 1;
      display: flex;
      align-items: flex-start; // 改为flex-start确保顶部对齐
      color: $text_color;

      .flex-r-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-start; // 左对齐
        font-size: 12px;
        
        // 第一列（高低）往右移动
        &:first-child {
          margin-left: 10px;
        }
        
        // 第二列（今开、今收）与第一列对齐
        &:last-child {
          align-items: flex-start;
        }

        .price-row {
          display: flex;
          justify-content: space-between;
          width: 100%;
          margin-bottom: 4px;
          align-items: center;
          min-height: 20px; // 确保每行有统一的最小高度
        }

        .label {
          color: $lable_color;
          margin-right: 5px;
          padding-left: 5px;
          font-size: 12px;
          min-width: 50px; // 增加最小宽度以容纳日语标签
          text-align: left;
          white-space: nowrap; // 防止标签换行
        }

        .value {
          font-size: 12px;
          text-align: right;
          flex: 1;
          max-width: 60px; // 限制数值的最大宽度，减少空白
          margin-left: 5px; // 往左移动一些
        }
      }
    }
  }

  .base-info {
    .flex-r-item {
      margin: 0 !important;

      .label {
        display: inline-block;
        width: 130px;
        text-align: left;
      }

      .value {
        text-align: left;
        flex: 1;
      }
    }
  }

  .indicator-index-container {
    .indicator-index-box {
      padding: 12px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .flex-l {
        flex: 1;

        ul {
          display: flex;

          li {
            text-align: center;
            margin: 0 4px;
            padding: 0 4px;
            font-size: 12px;
            border-radius: 4px;
          }
        }
      }

      .flex-r {
        display: flex;
        justify-content: flex-end;
        width: 30px;

        img {
          width: 12px;
          height: 16px;
        }

      }
    }

    .active {
      background: $btn_main;
      color: $white;
    }

    .indicator-index-box-second {
      ul {
        display: flex;
        border: 1px solid $border_color;
        align-items: center;
        border-right: none;
      }

      li {
        flex: 1;
        height: 32px;
        line-height: 32px;
        text-align: center;
        font-size: 12px;
        border-right: 1px solid $border_color;
      }
    }
  }

  .kline-container {
    margin-top: 10px;

    .order-book-container {
      padding: 100px 2px 0 6px;
      width: 130px;
      border-left: 1px solid $border_color;
    }

    .chart-index {
      flex: 1;
      min-width: 200px;
    }



    .text-sm {
      position: relative;
    }

    .select-div {
      width: 100px;
      position: absolute;
      top: 30px;
      left: 0;
      z-index: 100;

      ul {
        box-shadow: 0px 3px 11px 0px rgb(0 0 0 / 10%);

        li {
          background: $mainbgWhiteColor;
          text-align: center;
          padding: 10px 0;
          font-size: 16px;
        }

        li:not(:last-child) {
          border-bottom: 1px solid $border-grey;
        }
      }
    }

    .active {
      background: $btn_main !important;
      color: $text_color;
    }
  }

  .all-etf-ranking {
    margin-top: 10px;

    .title {
      font-weight: 700;
      padding: 0 12px;
    }

    .tabs {
      padding: 0 12px;
      margin-top: 10px;
      // height: 40px;
      min-height: 40px;
      line-height: 24px;
      color: #BBBCBD;
      width: 280px;

      .tab-item {
        margin: 4px;
        text-align: center;
        padding: 4px 6px;
        font-size: 12px;
        color: $text_color5;
        background: $US_tab_background;
        border-radius: 10px;
        background-size: cover;
      }

      .active {
        font-weight: 700;
        color: $color_main !important;
        background: $US_tabActice_background;
        border-radius: 10px;
        background-size: cover;
      }
    }

    .etf-table {
      .right {
        text-align: right;
      }

      ul {
        margin-top: 10px;
      }

      .title-line {
        color: #747A8F;
        font-size: 12px;
        font-weight: 400;
        padding: 0 12px;
        border: none;
      }

      li {
        padding: 14px 12px;
        display: flex;
        font-size: 12px;
        line-height: 18px;
        border-bottom: 1px solid $border_color;

        .gray-text {
          color: #BCBDC2;
          font-size: 12px;
        }

        .flex-l {
          width: 100px;
        }

        .flex-r {
          display: inline-flex;
          flex: 1;

          .flex-r-item {
            flex: 1;
            align-self: center;
            text-align: center;
          }
        }
      }
    }
  }

  .f10-container {
    .title {
      margin: 16px 0;
      padding-bottom: 10px;
      border-bottom: 1px solid $border_color;
    }

    .tabs {
      margin-top: 10px;
      height: 40px;
      line-height: 24px;
      color: #BBBCBD;
      width: 120px;

      .tab-item {
        margin: 4px;
        text-align: center;
        padding: 4px 6px;
        font-size: 12px;
        font-weight: 700;
        color: $color_main !important;
        background: $US_tabActice_background;
        border-radius: 10px;
        background-size: cover;
      }
    }

    .value-container {
      margin-top: 10px;
      border: none;
    }

    .flex-r {
      align-items: flex-start;
    }

    .flex-r-item {
      li {
        display: flex;
        justify-content: space-between;
        line-height: 28px;
      }
    }

    .flex-r-item:first-child {
      margin-right: 40px;
    }

  }

  .footer-btn-group {
    position: fixed;
    z-index: 10;
    left: 0;
    right: 0;
    bottom: calc(constant(safe-area-inset-bottom)) !important;
    bottom: calc(env(safe-area-inset-bottom)) !important;
    background: $btn-group;
    height: 70px;
    width: 100%;
    justify-content: center;

    .exchangeRate-box {
      padding-right: 25px;
    }

    .flex-l {
      text-align: center;

      .rate {
        font-size: 12px;
      }

      img {
        width: 22px;
        height: 22px;
        margin: 0 auto;
      }
    }

    .flex-r {
      display: flex;
      justify-content: flex-end;

      .sell-btn,
      .buy-btn {
        text-align: center;
        font-size: 14px;
        font-weight: 700;
        width: 140px;
        height: 36px;
        line-height: 36px;
      }

      .sell-btn {
        background: $red;
        color: $main-btn-color;
      }

      .buy-btn {
        background: #5BB989;
        margin-right: 20px;
        color: $main-btn-color;
      }
    }
  }
}

.collected-img {
  width: 30px !important;
  height: 20px !important;
}
</style>
