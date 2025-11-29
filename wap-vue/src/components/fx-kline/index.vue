<template>
  <van-loading color="#1194F7" class="loading-box" v-if="isLoading" />
  <div id="kline" class="boxDisplay" :style="{ height: `${props.height || defaultH}px`, position: 'relative' }"
    v-if="defaultH">
  </div>
  <ul class="flex px-4 py-4 box-border justify-between indicator-box" v-if="showBottom"
    style="border-top:1px solid rgba(68,75,88,0.2);">
    <li v-for="item in subTechnicalIndicatorTypes" :key="item" class="mr-2" :class="{ 'textColor': typeValue === item }"
      @click="choiceType(item)">{{ item }}
    </li>
  </ul>
</template>

<script setup>
import { init, dispose } from 'klinecharts'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import config from './config'
import { SET_STAGE } from '@/store/types.store';
import { getStorage } from '@/utils/index';
import fakeData from './fake-data'
import { _getKline } from "@/service/trade.api";
import { WS_URL } from '@/config'
import { useQuotesStore } from '@/store/quotes.store'
import { useI18n } from "vue-i18n";
import { useRoute } from 'vue-router';
const { t } = useI18n()
const quotesStore = useQuotesStore()
const route = useRoute()

// 检查当前页面是否为K线图页面
const isKlinePage = () => {
  const currentPath = route.path;
  const currentQuery = route.query;
  
  console.log('🔍 K线图页面检测:', {
    path: currentPath,
    query: currentQuery,
    symbol: currentQuery.symbol,
    type: currentQuery.type
  });
  
  // 大宗商品K线图页面
  if (currentPath === '/quotes/detail' && currentQuery.type === 'commodities') {
    console.log('✅ 检测到大宗商品K线图页面');
    return true;
  }
  
  // 合约交易K线图页面
  if (currentPath === '/foreign/coinChart' && currentQuery.from === 'contract') {
    console.log('✅ 检测到合约交易K线图页面');
    return true;
  }
  
  // 外汇K线图页面
  if (currentPath === '/foreign/coinChart' && currentQuery.symbol && currentQuery.from !== 'contract') {
    console.log('✅ 检测到外汇K线图页面');
    return true;
  }

  // ETF K线图页面 - 支持有type参数和没有type参数的情况
  if (currentPath === '/quotes/detail' && currentQuery.type === 'indices') {
    console.log('✅ 检测到ETF K线图页面 (有type参数)');
    return true;
  }
  
  // ETF K线图页面 - 没有type参数但有symbol的情况（通过symbol判断）
  if (currentPath === '/quotes/detail' && currentQuery.symbol && !currentQuery.type) {
    // 检查是否为ETF/指数类型的symbol
    const etfSymbols = ['SPY', 'QQQ', 'IWM', 'VTI', 'VOO', 'VEA', 'VWO', 'AGG', 'BND', 'TLT'];
    if (etfSymbols.includes(currentQuery.symbol.toUpperCase())) {
      console.log('✅ 检测到ETF K线图页面 (通过symbol判断):', currentQuery.symbol);
      return true;
    }
  }
  
  // 加密货币现货交易K线图页面
  if (currentPath.startsWith('/cryptos/trade/')) {
    console.log('✅ 检测到加密货币现货交易K线图页面');
    return true;
  }
  
  // 加密货币永续合约K线图页面
  if (currentPath.startsWith('/cryptos/perpetualContract/')) {
    console.log('✅ 检测到加密货币永续合约K线图页面');
    return true;
  }
  
  console.log('❌ 未检测到K线图页面');
  return false;
};

let chart = null
const paneId = ref('')
const typeValue = ref('MA')//图形类型
const subTechnicalIndicatorTypes = ref(['MA', 'EMA', 'BOLL', 'VOL', 'MACD', 'KDJ', 'RSI'])

const data = ref(fakeData)

const defaultH = ref(0)
const loading = ref(false)
const isLoading = ref(false)
const socket = ref(null)
const timer = ref(null)
const klineTimer = ref(null) // 新增：K线数据自动刷新定时器
const emits = defineEmits(['data', 'loading'])

onMounted(() => {
  // 检查是否为K线图页面，如果不是则不启动定时器和WebSocket
  if (!isKlinePage()) {
    console.log('🚫 当前页面不是K线图页面，跳过K线图组件初始化');
    return;
  }
  
  console.log('✅ 检测到K线图页面，启动K线图组件');
  
  defaultH.value = window.innerHeight - 94
  nextTick(async () => {
    // 只调用一次初始化，避免重复调用API
    await initData()
    // 大宗商品不使用WebSocket，其他类型启动WebSocket
    if (!isCommoditiesType()) {
    startQuoteScoket()
    } else {
      console.log(`✅ 大宗商品类型 ${props.symbol}，跳过WebSocket启动，仅使用定时器轮询`)
    }
  })
})

const props = defineProps({
  symbol: {
    type: String
  },
  height: {
    type: Number
  },
  chartType: {
    type: String,
    default: 'candle_solid'
  },
  showBottom: {
    type: Boolean,
    default: true
  },
  isShowsolid: {
    type: Boolean,
    default: false
  }
})

const startQuoteScoket = () => {
  // 检查是否为K线图页面
  if (!isKlinePage()) {
    console.log('🚫 当前页面不是K线图页面，跳过WebSocket连接');
    return;
  }
  
  closeSocket()
  
  // 启用所有WebSocket实时更新
  console.log(`🔌 启用WebSocket实时更新，周期: ${quotesStore.stage}`);
  
  // 将XAUUSD转换为GOLD，XAGUSD转换为Silver以适配WebSocket
  let wsSymbol = props.symbol;
  if (props.symbol === 'XAUUSD') {
    wsSymbol = 'GOLD';
  } else if (props.symbol === 'XAGUSD') {
    wsSymbol = 'Silver';
  }
  
  console.log(`🔌 启动WebSocket连接: ${props.symbol} -> ${wsSymbol}, 时间周期: ${quotesStore.stage}`);
  
  socket.value = new WebSocket(`${WS_URL}/1/${wsSymbol}`)
  socket.value.onmessage = (evt) => {
    const { data } = evt
    const { code, data: _data } = JSON.parse(data)
    if (code / 1 === 0) {
      emits('data', _data[0])
      updateCharts(_data[0])
    }
  }
}

onBeforeUnmount(() => {
  closeSocket()
  stopKlineTimer() // 清理K线定时器
})

const closeSocket = () => {
  socket.value && socket.value.close()
  socket.value = null
}

// 判断是否为commodities类型的商品
const isCommoditiesType = () => {
  if (!props.symbol) return false;
  
  // 定义commodities类型的商品符号列表
  const commoditiesSymbols = [
    'XAUUSD', 'XAGUSD', 'XALUSD', 'XCUUSD', 'XNIUSD', 'XPBUSD', 
    'XZNUSD', 'XPTUSD', 'XPDUSD', 'UKOIL', 'USOIL', 'GOLD', 'Silver',
    'Aluminum', 'COPPER', 'Nickel', 'Lead', 'Zinc', 'Platinum', 'Palladium'
  ];
  
  return commoditiesSymbols.includes(props.symbol);
};

// 启动K线数据自动刷新定时器（根据商品类型调整调用频率）
const startKlineTimer = () => {
  // 检查是否为K线图页面
  if (!isKlinePage()) {
    console.log('🚫 当前页面不是K线图页面，跳过K线定时器启动');
    return;
  }
  
  stopKlineTimer() // 先清除现有定时器
  
  // 根据商品类型确定调用频率
  let interval = 2000; // 默认2秒
  let intervalText = '2秒';
  
  // 如果是commodities类型的商品，根据时间周期调整调用频率
  if (isCommoditiesType()) {
    // 仅1min周期使用2秒调用频率
    if (quotesStore.stage === '1min') {
      interval = 2000;
      intervalText = '2秒';
      console.log(`🔄 检测到commodities类型商品 ${props.symbol}，1min周期使用2秒调用频率`)
    } 
    // 其他所有周期使用5秒调用频率
    else {
      interval = 5000;
      intervalText = '5秒';
      console.log(`🔄 检测到commodities类型商品 ${props.symbol}，周期 ${quotesStore.stage} 使用5秒调用频率`)
    }
  }
  
  console.log(`🔄 启动K线数据自动刷新定时器，每${intervalText}调用一次，时间周期: ${quotesStore.stage}，商品: ${props.symbol}`)
  
  klineTimer.value = setInterval(async () => {
    try {
      console.log(`⏰ K线定时器触发，刷新K线数据，时间周期: ${quotesStore.stage}，商品: ${props.symbol}`)
      await refreshKlineData()
    } catch (error) {
      console.error('❌ K线定时器刷新失败:', error)
    }
  }, interval)
}

// 停止K线数据自动刷新定时器
const stopKlineTimer = () => {
  if (klineTimer.value) {
    clearInterval(klineTimer.value)
    klineTimer.value = null
    console.log('🛑 停止K线数据自动刷新定时器')
  }
}

// 刷新K线数据
const refreshKlineData = async () => {
  // 检查是否为K线图页面
  if (!isKlinePage()) {
    console.log('🚫 当前页面不是K线图页面，跳过K线数据刷新');
    return;
  }
  
  if (!props.symbol) {
    console.warn('⚠️ 没有symbol，跳过K线数据刷新')
    return
  }
  
  try {
    // 统一使用1min周期获取分时图数据
    const actualStage = quotesStore.stage === 'timeSharing' ? '1min' : quotesStore.stage
    console.log(`🔄 定时刷新K线数据: ${props.symbol}, 时间周期: ${actualStage}`)
    
    const newData = await _getKline(props.symbol, actualStage)
    
    if (newData && newData.length > 0) {
      console.log(`✅ K线数据刷新成功，获取到 ${newData.length} 条数据`)
      
      // 对所有周期数据进行增强处理，确保K线有足够的波动
      let enhancedData = newData;
      if (quotesStore.stage === '1min' || quotesStore.stage === '5min' || 
          quotesStore.stage === '15min' || quotesStore.stage === '30min' || 
          quotesStore.stage === '60min' || quotesStore.stage === '120min' ||
          quotesStore.stage === '5day' || quotesStore.stage === '1day' || 
          quotesStore.stage === '1quarter' || quotesStore.stage === '1year') {
        enhancedData = enhanceKlineData(newData);
        console.log(`🔧 周期 ${quotesStore.stage} 数据增强处理完成`);
      }
      
      // 更新数据
      data.value = enhancedData
      
      // 更新图表
      if (chart) {
        let length = 2
        if (data.value.length > 0) {
          length = data.value[data.value.length - 1].decimals
        }
        chart.setPriceVolumePrecision(length, 2)
        
        nextTick(() => {
          chart.applyNewData(data.value)
        })
      }
      
      // 更新本地存储
      localStorage.setItem('kline', JSON.stringify(data.value))
    } else {
      console.warn('⚠️ K线数据刷新返回空数据')
    }
  } catch (error) {
    console.error('❌ K线数据刷新失败:', error)
  }
}


// 连续异常检测计数器
let consecutiveAnomalies = 0;
const maxConsecutiveAnomalies = 2; // 最多允许连续2次异常

// 数据稳定性检查
let lastStablePrice = null;
let stablePriceCount = 0;
const maxStableCount = 5; // 最多允许连续5次相同价格

// K线数据增强处理函数 - 确保所有周期K线有足够的波动
const enhanceKlineData = (klineData) => {
  if (!klineData || klineData.length === 0) {
    return klineData;
  }
  
  return klineData.map((item, index) => {
    const { high, low, open, close } = item;
    
    // 根据时间周期设置不同的最小波动要求
    let minVolatilityPercent = 0.0005; // 默认0.05%
    
    // 短周期需要更大的波动
    if (quotesStore.stage === '1min' || quotesStore.stage === '5min' || 
        quotesStore.stage === '15min' || quotesStore.stage === '30min' || 
        quotesStore.stage === '60min' || quotesStore.stage === '120min') {
      minVolatilityPercent = 0.001; // 短周期0.1%
    }
    // 长周期需要适中的波动
    else if (quotesStore.stage === '5day' || quotesStore.stage === '1day' || 
             quotesStore.stage === '1quarter' || quotesStore.stage === '1year') {
      minVolatilityPercent = 0.0008; // 长周期0.08%
    }
    
    const avgPrice = (high + low + open + close) / 4;
    const minVolatility = avgPrice * minVolatilityPercent;
    
    // 如果高低价差异太小，增加最小波动
    if (Math.abs(high - low) < minVolatility) {
      const center = (high + low) / 2;
      const newHigh = center + minVolatility / 2;
      const newLow = center - minVolatility / 2;
      
      console.log(`🔧 K线数据增强: 第${index}条，周期: ${quotesStore.stage}，原波动: ${(high - low).toFixed(2)}, 新波动: ${(newHigh - newLow).toFixed(2)}`);
      
      return {
        ...item,
        high: newHigh,
        low: newLow
      };
    }
    
    return item;
  });
};

// 数据验证函数 - 检查实时数据是否合理
const validateRealtimeData = (realtimeData, lastData) => {
  if (!realtimeData || !lastData) {
    return false;
  }

  const currentPrice = realtimeData.close / 1;
  const lastPrice = lastData.close;
  
  // 计算价格变化百分比
  const priceChangePercent = Math.abs((currentPrice - lastPrice) / lastPrice) * 100;
  
  // 根据时间周期设置不同的价格变化阈值
  let maxChangePercent = 1.5; // 默认1.5%
  
  // 长周期：最严格的阈值
  if (quotesStore.stage === '5day' || quotesStore.stage === '1day' || 
      quotesStore.stage === '1quarter' || quotesStore.stage === '1year') {
    maxChangePercent = 0.5; // 长周期使用0.5%的阈值
  }
  // 短周期：最严格的阈值
  else if (quotesStore.stage === '1min' || quotesStore.stage === '5min' || 
           quotesStore.stage === '15min' || quotesStore.stage === '30min' || 
           quotesStore.stage === '60min' || quotesStore.stage === '120min') {
    maxChangePercent = 0.3; // 短周期使用0.3%的阈值，非常严格
  }
  
  // 如果价格变化超过阈值，认为是异常波动
  if (priceChangePercent > maxChangePercent) {
    consecutiveAnomalies++;
    console.warn(`🚫 实时数据异常: 价格变化过大 ${priceChangePercent.toFixed(2)}% (${lastPrice} -> ${currentPrice}), 阈值: ${maxChangePercent}%, 连续异常次数: ${consecutiveAnomalies}`);
    
    // 如果连续异常次数过多，拒绝数据
    if (consecutiveAnomalies >= maxConsecutiveAnomalies) {
      console.error(`🚫 连续异常次数过多 (${consecutiveAnomalies}), 拒绝数据更新`);
      return false;
    }
    
    return false;
  }
  
  // 数据正常，重置异常计数器
  consecutiveAnomalies = 0;
  
  // 短周期稳定性检查
  if (quotesStore.stage === '1min' || quotesStore.stage === '5min' || 
      quotesStore.stage === '15min' || quotesStore.stage === '30min' || 
      quotesStore.stage === '60min' || quotesStore.stage === '120min') {
    
    // 检查价格是否过于稳定
    if (lastStablePrice === currentPrice) {
      stablePriceCount++;
      if (stablePriceCount >= maxStableCount) {
        console.warn(`🚫 价格过于稳定: 连续${stablePriceCount}次相同价格 ${currentPrice}，拒绝更新`);
        return false;
      }
    } else {
      lastStablePrice = currentPrice;
      stablePriceCount = 0;
    }
  }

  // 检查实时数据的基本合理性
  if (realtimeData.high < realtimeData.low) {
    console.warn(`🚫 实时数据异常: 最高价小于最低价`, realtimeData);
    return false;
  }

  if (realtimeData.open < realtimeData.low || realtimeData.open > realtimeData.high ||
      realtimeData.close < realtimeData.low || realtimeData.close > realtimeData.high) {
    console.warn(`🚫 实时数据异常: 开盘价或收盘价超出高低价范围`, realtimeData);
    return false;
  }

  // 检查高低价差异是否过大（防止异常长针）
  const priceRange = Math.abs(realtimeData.high - realtimeData.low);
  const avgPrice = (realtimeData.high + realtimeData.low) / 2;
  const rangePercent = (priceRange / avgPrice) * 100;
  
  // 根据时间周期设置不同的高低价差异阈值
  let maxRangePercent = 5; // 默认5%
  
  // 长周期：最严格的阈值
  if (quotesStore.stage === '5day' || quotesStore.stage === '1day' || 
      quotesStore.stage === '1quarter' || quotesStore.stage === '1year') {
    maxRangePercent = 2; // 长周期使用2%的阈值
  }
  // 短周期：最严格的阈值
  else if (quotesStore.stage === '1min' || quotesStore.stage === '5min' || 
           quotesStore.stage === '15min' || quotesStore.stage === '30min' || 
           quotesStore.stage === '60min' || quotesStore.stage === '120min') {
    maxRangePercent = 1.5; // 短周期使用1.5%的阈值，非常严格
  }
  
  if (rangePercent > maxRangePercent) {
    console.warn(`🚫 实时数据异常: 高低价差异过大 ${rangePercent.toFixed(2)}% (${realtimeData.low} - ${realtimeData.high}), 阈值: ${maxRangePercent}%`);
    return false;
  }

  return true;
};

const updateCharts = async (nowData) => {
  const dataList = chart.getDataList()
  if (!dataList || dataList.length === 0) {
    return
  }
  const lastData = dataList[dataList.length - 1]
  
  // 启用所有周期的实时数据更新
  console.log(`🔄 启用实时数据更新，周期: ${quotesStore.stage}`);
  
  // 验证实时数据
  if (!validateRealtimeData(nowData, lastData)) {
    console.warn('🚫 实时数据验证失败，跳过更新');
    return;
  }
  
  // 防止停盘后柱状图自动刷新修改
  if ((nowData.timestamp - lastData.timestamp) >= quotesStore.seconds) {
    console.log('🔄 时间周期更新，重新获取K线数据');
    data.value = await _getKline(props.symbol, quotesStore.stage === 'timeSharing' ? '1min' : quotesStore.stage)

    // 修改 k 线图价格和 ws 推送价格不一致
    data.value.unshift()

    data.value.push({
      high: nowData.high,
      low: nowData.low,
      close: nowData.close,
      open: nowData.open,
      timestamp: nowData.timestamp
    })

    chart.applyNewData(data.value);
    return false
  }

  // 数据平滑处理 - 避免极端波动
  const currentPrice = nowData.close / 1;
  const lastPrice = lastData.close;
  const priceChangePercent = Math.abs((currentPrice - lastPrice) / lastPrice) * 100;
  
  let smoothedPrice = currentPrice;
  
  // 根据时间周期设置不同的平滑阈值和策略
  let smoothingThreshold = 1.0; // 默认1%阈值
  let smoothingFactor = 0.7; // 默认70%权重给历史数据
  
  // 长周期：更严格的平滑处理
  if (quotesStore.stage === '5day' || quotesStore.stage === '1day' || 
      quotesStore.stage === '1quarter' || quotesStore.stage === '1year') {
    smoothingThreshold = 0.5; // 0.5%阈值
    smoothingFactor = 0.8; // 80%权重给历史数据
  }
  // 短周期：最严格的平滑处理
  else if (quotesStore.stage === '1min' || quotesStore.stage === '5min' || 
           quotesStore.stage === '15min' || quotesStore.stage === '30min' || 
           quotesStore.stage === '60min' || quotesStore.stage === '120min') {
    smoothingThreshold = 0.2; // 0.2%阈值，非常严格
    smoothingFactor = 0.9; // 90%权重给历史数据，非常保守
  }
  
  // 如果价格变化超过阈值，进行平滑处理
  if (priceChangePercent > smoothingThreshold) {
    console.log(`🔄 价格平滑处理: 变化 ${priceChangePercent.toFixed(2)}% (${lastPrice} -> ${currentPrice}), 阈值: ${smoothingThreshold}%, 平滑因子: ${smoothingFactor}`);
    
    // 使用加权平均进行平滑
    smoothedPrice = lastPrice * smoothingFactor + currentPrice * (1 - smoothingFactor);
  }
  
  // 改进的实时数据更新策略 - 避免产生异常长针
  let newHigh = lastData.high;
  let newLow = lastData.low;
  
  // 长周期：不更新高低价，只更新收盘价
  if (quotesStore.stage === '5day' || quotesStore.stage === '1day' || 
      quotesStore.stage === '1quarter' || quotesStore.stage === '1year') {
    newHigh = lastData.high;
    newLow = lastData.low;
  }
  // 短周期：使用更智能的高低价更新策略，确保K线有足够的波动
  else if (quotesStore.stage === '1min' || quotesStore.stage === '5min' || 
           quotesStore.stage === '15min' || quotesStore.stage === '30min' || 
           quotesStore.stage === '60min' || quotesStore.stage === '120min') {
    
    // 确保K线有最小波动，避免显示为线条
    const minVolatility = lastData.close * 0.0005; // 最小0.05%的波动
    
    // 如果高低价差异太小，增加最小波动
    if (Math.abs(lastData.high - lastData.low) < minVolatility) {
      newHigh = Math.max(lastData.high, smoothedPrice + minVolatility / 2);
      newLow = Math.min(lastData.low, smoothedPrice - minVolatility / 2);
    } else {
      // 正常更新高低价，但使用更严格的限制幅度
      const maxHighIncrease = lastData.high * 0.001; // 最高价最多增加0.1%
      const maxLowDecrease = lastData.low * 0.001;   // 最低价最多减少0.1%
      
      newHigh = Math.max(lastData.high, Math.min(smoothedPrice, lastData.high + maxHighIncrease));
      newLow = Math.min(lastData.low, Math.max(smoothedPrice, lastData.low - maxLowDecrease));
    }
    
    // 确保高低价关系正确
    if (newHigh < newLow) {
      newHigh = Math.max(newHigh, newLow);
      newLow = Math.min(newHigh, newLow);
    }
    
    // 确保K线有最小高度
    if (newHigh - newLow < minVolatility) {
      const center = (newHigh + newLow) / 2;
      newHigh = center + minVolatility / 2;
      newLow = center - minVolatility / 2;
    }
  }
  // 其他周期：标准更新策略
  else {
    newHigh = Math.max(lastData.high, smoothedPrice);
    newLow = Math.min(lastData.low, smoothedPrice);
  }
  
  const newData = {
    close: smoothedPrice,
    current_time: lastData.current_time,
    high: newHigh,
    low: newLow,
    open: lastData.open,
    symbol: lastData.symbol,
    line: quotesStore.stage === 'timeSharing' ? '1min' : quotesStore.stage,
    timestamp: (nowData.timestamp - lastData.timestamp) < quotesStore.seconds ? lastData.timestamp : (lastData.timestamp + quotesStore.seconds),
    volume: nowData.volume / 1
  }
  
  // 添加更新前的日志
  console.log('📊 实时数据更新:', {
    symbol: props.symbol,
    stage: quotesStore.stage,
    lastPrice: lastData.close,
    newPrice: newData.close,
    priceChange: ((newData.close - lastData.close) / lastData.close * 100).toFixed(2) + '%',
    high: newData.high,
    low: newData.low,
    isLongTerm: quotesStore.stage === '5day' || quotesStore.stage === '1day' || 
                quotesStore.stage === '1quarter' || quotesStore.stage === '1year',
    isShortTerm: quotesStore.stage === '1min' || quotesStore.stage === '5min' || 
                 quotesStore.stage === '15min' || quotesStore.stage === '30min' || 
                 quotesStore.stage === '60min' || quotesStore.stage === '120min'
  });
  
  nextTick(() => {
    chart.setStyleOptions({
      candle: {
        type: props.chartType
      },
      yAxis: {
        width: quotesStore.stage === 'timeSharing' ? 0 : null,
      }
    })
    chart.updateData(newData)
  })
}

const initData = async () => {
  chart = init('kline', config);
  chart.setOffsetRightSpace(15)
  chart.setDataSpace(10)
  if (props.isShowsolid) {
    chart.createTechnicalIndicator('MA', false, { id: 'candle_pane' });
    paneId.value = chart.createTechnicalIndicator('MA');
  }

  // this.fetchData()
  chart.setStyleOptions({
    candle: {
      type: props.chartType
    },
    yAxis: {
      width: quotesStore.stage === 'timeSharing' ? 0 : null,
    }
  })
  if (!quotesStore.stage) {
    quotesStore[SET_STAGE]({ stage: '1min', seconds: 1 * 60 * 1000 })
  }

  emits('loading', true)
  isLoading.value = true
  await getKlineData()
  isLoading.value = false
  emits('loading', false)
  let length = 2
  if (data.value.length > 0) {
    length = data.value[data.value.length - 1].decimals
  }
  chart.setPriceVolumePrecision(length, 2)
  localStorage.setItem('kline', JSON.stringify(data.value))

  nextTick(() => {
    chart.applyNewData(data.value);
  })
  
  // 启动K线数据自动刷新定时器（只有在K线图页面才启动）
  if (isKlinePage()) {
    startKlineTimer()
  } else {
    console.log('🚫 当前页面不是K线图页面，跳过定时器启动')
  }
}

const getKlineData = async () => {
  // 统一使用1min周期获取分时图数据，避免调用错误的周期
  const actualStage = quotesStore.stage === 'timeSharing' ? '1min' : quotesStore.stage
  console.log(`📊 获取K线数据: symbol=${props.symbol}, stage=${actualStage}`)

  data.value = await _getKline(props.symbol, actualStage)

  if (data.value.length == 0) {
    timer.value = setTimeout(async () => {
      await getKlineData()
    }, 2000);
  } else {
    if (timer.value) {
      clearTimeout(timer.value)
      timer.value = null
    }
    isLoading.value = false
    emits('loading', false)
    let length = 2
    if (data.value.length > 0) {
      length = data.value[data.value.length - 1].decimals
    }
    chart.setPriceVolumePrecision(length, 2)
    localStorage.setItem('kline', JSON.stringify(data.value))

    nextTick(() => {
      console.log('✅ K线数据应用到图表')
      chart.applyNewData(data.value);
    })
  }

}

const initData1 = async () => {
  chart = init('kline', config);
  chart.setOffsetRightSpace(15)
  chart.setDataSpace(10)

  data.value = getStorage('kline')
  if (!data.value) {
    data.value = await _getKline(props.symbol, quotesStore.stage === 'timeSharing' ? '1min' : quotesStore.stage)
  }

  let length = 2
  if (data.value.length > 0) {
    data.value[data.value.length - 1].decimals
  }
  chart.setPriceVolumePrecision(length, 2)
  // if (props.type === 'candle_solid') {
  //     chart.createTechnicalIndicator('MA', false, { id: 'candle_pane' });
  //     paneId.value = chart.createTechnicalIndicator('VOL');
  // }

  // this.fetchData()
  chart.setStyleOptions({
    candle: {
      type: props.chartType
    }
  })
  if (!quotesStore.stage) {
    quotesStore[SET_STAGE]({ stage: '1min', seconds: 1 * 60 * 1000 })
  }
  // console.log(data.value)

  nextTick(() => {
    chart.applyNewData(data.value);
  })
}
const choiceType = (type) => { // 选择副线
  typeValue.value = type
  chart.createTechnicalIndicator(type, false, { id: paneId.value })
}

// 监听symbol和时间周期变化，重新启动K线定时器
watch([() => props.symbol, () => quotesStore.stage], ([newSymbol, newStage], [oldSymbol, oldStage]) => {
  console.log('🔄 symbol或时间周期发生变化:', { 
    symbol: { from: oldSymbol, to: newSymbol }, 
    stage: { from: oldStage, to: newStage } 
  })
  
  // 如果symbol或时间周期发生变化，先停止旧定时器，再启动新定时器（避免重复调用）
  if (newSymbol && (newSymbol !== oldSymbol || newStage !== oldStage)) {
    if (isKlinePage()) {
      console.log('🔄 停止旧定时器，重新启动K线定时器')
      stopKlineTimer() // 先停止旧定时器
      startKlineTimer() // 再启动新定时器
    } else {
      console.log('🚫 当前页面不是K线图页面，跳过定时器重新启动')
    }
  }
}, { immediate: false })

</script>
<style lang="scss" scoped>
.textColor {
  color: $color_main;
}

.indicator-box {
  font-size: 12px;
  color: $text_color;
}

.loading-box {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>

