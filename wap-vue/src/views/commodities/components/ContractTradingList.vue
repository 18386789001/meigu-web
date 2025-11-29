<template>
  <div class="contract-trading-container">
    <van-loading color="#1194F7" class="loading-box" v-if="isLoading && isFirst" />
    
    <div class="symbol-table">
      <ul>
        <li v-for="(item, index) in listData" :key="item.symbol" @click="itemClick(item)">
          <div class="flex-l">
            <p>
              <span class="mr-1" :class="item.changeRatio > 0 ? 'text-up' : 'text-down'" v-if="item.netChange > 0">+{{
                item.netChange }}</span>
              <span class="mr-1" :class="item.changeRatio > 0 ? 'text-up' : 'text-down'" v-else>{{ item.netChange
              }}</span>&nbsp;
              <span :class="item.changeRatio > 0 ? 'text-up' : 'text-down'">{{ `${item.changeRatio}%` }}</span>
            </p>
            <p>{{ item.symbol.toUpperCase() }}</p>
            <p class="gray-text">{{ item.current_time ? item.current_time.slice(11) : '-' }}</p>
          </div>
          <div class="flex-r">
            <div class="flex justify-end h-full flex-wrap">
              <div class="flex-r-item">
                <p class="flex text-primary justify-end" :class="item.open < 1 ? 'text-up' : 'text-down'">
                  <span class="font-semibold text-lg">{{
                    item.open.toString().substr(0, item.open.toString().length
                      - 1)
                  }}</span>
                  <span class="text-xs">{{ item.open.toString().substr(item.open.toString().length - 1) }}</span>
                </p>
                <div class="text-gray">
                  <span class="mr-1.5">H: {{ item.high }}</span>
                </div>
              </div>
              <div class="last flex-r-item">
                <p class="flex text-primary justify-end" :class="item.close < 1 ? 'text-up' : 'text-down'">
                  <span class="font-semibold text-lg">{{
                    item.close.toString().substr(0, item.close.toString().length
                      - 1)
                  }}</span>
                  <span class="text-xs">{{ item.close.toString().substr(item.close.toString().length - 1) }}</span>
                </p>
                <div class="text-gray">
                  <span>L: {{ item.low }}</span>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { _getRealtimeByType } from '@/service/quotes.api'
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n()
const router = useRouter()
const listData = ref([])
const interval = ref(null)
const isLoading = ref(false)
const isFirst = ref(true)

// 格式化数值，保留两位小数并四舍五入
const formatDecimal = (value) => {
  if (value === null || value === undefined || isNaN(value)) {
    return 0.00
  }
  return Number(Number(value).toFixed(2))
}

onMounted(() => {
  fetchQuotes()
  interval.value = setInterval(() => {
    fetchQuotes()
  }, 3000)
})

onBeforeUnmount(() => {
  if (interval.value) {
    clearInterval(interval.value)
  }
})

const fetchQuotes = () => {
  isLoading.value = true
  _getRealtimeByType({
    type: 'forex',
    category: 'commodities',
    pageNo: 1
  }).then(data => {
    isLoading.value = false
    isFirst.value = false
    
    // 处理数据：隐藏GOLD和SILVER，将XAUUSD和XAGUSD移到前面
    const processedData = processCommodityData(data)
    listData.value = processedData
  }).catch((e) => {
    isLoading.value = false
    isFirst.value = true
    listData.value = []
  })
}

// 处理商品数据：隐藏GOLD和SILVER，重新排序
const processCommodityData = (data) => {
  if (!data || !Array.isArray(data)) {
    return []
  }
  
  // 过滤掉GOLD和SILVER
  const filteredData = data.filter(item => {
    const symbol = item.symbol?.toUpperCase()
    return symbol !== 'GOLD' && symbol !== 'SILVER'
  })
  
  // 找到XAUUSD和XAGUSD
  const xauusd = filteredData.find(item => item.symbol?.toUpperCase() === 'XAUUSD')
  const xagusd = filteredData.find(item => item.symbol?.toUpperCase() === 'XAGUSD')
  
  // 移除XAUUSD和XAGUSD从原数组中
  const otherData = filteredData.filter(item => {
    const symbol = item.symbol?.toUpperCase()
    return symbol !== 'XAUUSD' && symbol !== 'XAGUSD'
  })
  
  // 重新排序：XAUUSD第一，XAGUSD第二，其他商品按原顺序
  const sortedData = []
  
  if (xauusd) {
    // 格式化XAUUSD的数值
    sortedData.push({
      ...xauusd,
      changeRatio: formatDecimal(xauusd.changeRatio),
      netChange: formatDecimal(xauusd.netChange)
    })
  }
  
  if (xagusd) {
    // 格式化XAGUSD的数值
    sortedData.push({
      ...xagusd,
      changeRatio: formatDecimal(xagusd.changeRatio),
      netChange: formatDecimal(xagusd.netChange)
    })
  }
  
  // 格式化其他商品的数值
  const formattedOtherData = otherData.map(item => ({
    ...item,
    changeRatio: formatDecimal(item.changeRatio),
    netChange: formatDecimal(item.netChange)
  }))
  
  sortedData.push(...formattedOtherData)
  
  console.log('📊 合约交易数据已处理:', {
    原始数据: data.length,
    过滤后: filteredData.length,
    最终排序: sortedData.length,
    前两项: sortedData.slice(0, 2).map(item => item.symbol),
    格式化示例: sortedData.slice(0, 2).map(item => ({
      symbol: item.symbol,
      changeRatio: item.changeRatio,
      netChange: item.netChange
    }))
  })
  
  return sortedData
}

const itemClick = (item) => {
  router.push({ path: '/foreign/coinChart', query: { symbol: item.symbol, from: 'contract' } })
}
</script>

<style lang="scss" scoped>
:deep(.van-loading) {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
}

.contract-trading-container {
  padding: 0 16px;
}

.symbol-table {
  li {
    margin-top: 20px;
    display: flex;
    font-weight: 600;
    font-size: 14px;
    line-height: 18px;

    .gray-text {
      color: #BCBDC2;
      font-size: 12px;
    }

    .flex-l {
      width: 130px;
    }

    .flex-r {
      flex: 1;

      .flex-r-item {
        flex: 1;
        align-self: center;
        text-align: right;

        .last-item {
          padding: 0 6px;

          p {
            text-align: right;
            width: 70px;
            height: 24px;
            line-height: 24px;
            border-radius: 4px;
            color: $text_color;
            font-weight: 600;
            font-size: 14px;
          }
        }
      }

    }
  }
}

/* 暗黑模式适配 */
@media (prefers-color-scheme: dark) {
  .contract-trading-container {
    background: #000000;
  }
  
  .symbol-table {
    li {
      color: #ffffff;
      
      .gray-text {
        color: #888888;
      }
      
      .flex-l {
        color: #ffffff;
      }
      
      .flex-r {
        .flex-r-item {
          p {
            color: #ffffff;
          }
          
          .text-gray {
            color: #888888;
          }
        }
      }
    }
  }
}
</style>
