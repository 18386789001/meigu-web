<template>
  <div class="rwa-container">
    <div class="rwa-header">
      <h2 class="text-2xl font-bold mb-4">{{ t('RWA') }}</h2>
    </div>

    <!-- 分类标签 -->
    <div class="tabs-container mb-4">
      <div class="tabs-wrapper">
        <div
          v-for="tab in tabs"
          :key="tab.key"
          class="tab-item"
          :class="{ active: activeTab === tab.key }"
          @click="onTabChange(tab.key)"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-label">{{ tab.label }}</span>
        </div>
      </div>
    </div>

    <!-- RWA 资产列表 -->
    <div class="rwa-list">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        :finished-text="t('没有更多了')"
        @load="onLoad"
      >
        <div
          v-for="item in filteredRWAList"
          :key="item.symbol"
          class="rwa-item"
          @click="handleItemClick(item)"
        >
          <div class="rwa-info">
            <div class="rwa-header-info">
              <img
                :src="getRWAIcon(item.symbol, item.category)"
                :alt="item.name"
                class="rwa-icon"
                loading="lazy"
                crossorigin="anonymous"
                @error="onImageError"
              />
              <div class="rwa-title">
                <div class="rwa-symbol">{{ item.symbol }}</div>
                <div class="rwa-name">{{ item.name }}</div>
              </div>
            </div>
            <div class="rwa-price" :class="getPriceClass(item.changeRatio)">
              {{ formatPrice(item.close) }}
            </div>
            <div class="rwa-change" :class="getPriceClass(item.changeRatio)">
              {{ item.changeRatio > 0 ? '+' : '' }}{{ item.changeRatio.toFixed(2) }}%
            </div>
            <div class="rwa-details">
              <span class="detail-item">{{ t('高') }}: {{ formatPrice(item.high) }}</span>
              <span class="detail-item">{{ t('低') }}: {{ formatPrice(item.low) }}</span>
              <span class="detail-item">{{ t('开') }}: {{ formatPrice(item.open) }}</span>
            </div>
            <div class="rwa-volume">
              <span class="volume-item">{{ t('24小时成交量') }}: {{ formatVolume(item.volume) }}</span>
            </div>
          </div>
          <div class="rwa-chart">
            <div class="mini-chart">
              <span class="chart-placeholder">📈</span>
            </div>
          </div>
        </div>
      </van-list>
    </div>

    <!-- 空状态 -->
    <div v-if="!loading && filteredRWAList.length === 0 && rwaList.length === 0" class="empty-state">
      <div class="empty-icon">📊</div>
      <div class="empty-text">{{ t('暂无数据') }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { _getRWAStocks, _getRWAForex, _getRWACrypto } from '@/service/rwa.api'
import { themeStore } from '@/store/theme'

const { t, locale } = useI18n()
const router = useRouter()
const thStore = themeStore()

// 定义props
const props = defineProps({
  index: {
    type: Number,
    default: 0
  },
  tabActive: {
    type: Number,
    default: 0
  }
})

// 定义emit
const emit = defineEmits(['changeLetMego'])

// 响应式数据
const loading = ref(false)
const finished = ref(false)
const rwaList = ref([])
const refreshTimer = ref(null)
const activeTab = ref('stocks') // 默认选中股票

// 模拟数据
const mockRWAData = [
  // 股票
  {
    symbol: 'AAPL.US',
    name: '苹果',
    enName: 'Apple Inc',
    category: 'stocks',
    close: 178.25,
    changeRatio: 1.25,
    netChange: 2.20,
    high: 179.50,
    low: 176.80,
    open: 177.00,
    volume: 52400000
  },
  {
    symbol: 'MSFT.US',
    name: '微软',
    enName: 'Microsoft Corp',
    category: 'stocks',
    close: 425.30,
    changeRatio: 0.85,
    netChange: 3.60,
    high: 427.00,
    low: 423.50,
    open: 424.00,
    volume: 21500000
  },
  {
    symbol: 'GOOGL.US',
    name: '谷歌',
    enName: 'Alphabet Inc',
    category: 'stocks',
    close: 142.60,
    changeRatio: -0.45,
    netChange: -0.65,
    high: 143.80,
    low: 142.00,
    open: 143.20,
    volume: 18900000
  },

  // 外汇
  {
    symbol: 'EURUSD',
    name: '欧元/美元',
    enName: 'EUR/USD',
    category: 'forex',
    close: 1.0845,
    changeRatio: 0.35,
    netChange: 0.0038,
    high: 1.0862,
    low: 1.0820,
    open: 1.0830,
    volume: 0
  },
  {
    symbol: 'GBPUSD',
    name: '英镑/美元',
    enName: 'GBP/USD',
    category: 'forex',
    close: 1.2675,
    changeRatio: -0.25,
    netChange: -0.0032,
    high: 1.2710,
    low: 1.2650,
    open: 1.2698,
    volume: 0
  },
  {
    symbol: 'USDJPY',
    name: '美元/日元',
    enName: 'USD/JPY',
    category: 'forex',
    close: 149.85,
    changeRatio: 0.15,
    netChange: 0.22,
    high: 150.20,
    low: 149.50,
    open: 149.70,
    volume: 0
  },

  // 加密货币
  {
    symbol: 'BTCUSDT',
    name: '比特币',
    enName: 'Bitcoin',
    category: 'crypto',
    close: 68250.50,
    changeRatio: 2.35,
    netChange: 1567.80,
    high: 68800.00,
    low: 66500.00,
    open: 66682.70,
    volume: 28500000000
  },
  {
    symbol: 'ETHUSDT',
    name: '以太坊',
    enName: 'Ethereum',
    category: 'crypto',
    close: 3780.25,
    changeRatio: 1.85,
    netChange: 68.70,
    high: 3825.00,
    low: 3690.00,
    open: 3711.55,
    volume: 15200000000
  },
  {
    symbol: 'BNBUSDT',
    name: '币安币',
    enName: 'Binance Coin',
    category: 'crypto',
    close: 585.40,
    changeRatio: -0.95,
    netChange: -5.60,
    high: 595.00,
    low: 580.00,
    open: 591.00,
    volume: 1850000000
  }
]

// 页签配置
const tabs = computed(() => [
  {
    key: 'stocks',
    label: t('股票'),
    icon: '📈'
  },
  {
    key: 'forex',
    label: t('外汇'),
    icon: '💱'
  },
  {
    key: 'crypto',
    label: t('加密货币'),
    icon: '₿'
  }
])

// 过滤后的资产列表
const filteredRWAList = computed(() => {
  try {
    if (!rwaList.value || rwaList.value.length === 0) {
      return []
    }

    // 如果API数据没有category字段，直接返回所有数据
    const hasCategory = rwaList.value.some(item => item && item.category)
    if (!hasCategory) {
      return rwaList.value
    }

    // 根据category过滤
    return rwaList.value.filter(item => {
      if (!item || !item.category) return false
      return item.category === activeTab.value
    })
  } catch (error) {
    console.error('过滤资产列表时出错:', error)
    return []
  }
})

// 获取资产图标
const getRWAIcon = (symbol, category) => {
  // 根据分类和symbol返回对应图标
  const iconMap = {
    // 股票图标
    'AAPL.US': 'https://file.jpmx.xyz/trading-order-roseccc/file/2025-09-29/aapl-icon.png',
    'MSFT.US': 'https://file.jpmx.xyz/trading-order-roseccc/file/2025-09-29/msft-icon.png',
    'GOOGL.US': 'https://file.jpmx.xyz/trading-order-roseccc/file/2025-09-29/googl-icon.png',

    // 外汇图标
    'EURUSD': '/symbol/EURUSD.png',
    'GBPUSD': '/symbol/GBPUSD.png',
    'USDJPY': '/symbol/USDJPY.png',

    // 加密货币图标
    'BTCUSDT': 'https://file.jpmx.xyz/trading-order-roseccc/file/2025-09-29/btc-icon.png',
    'ETHUSDT': 'https://file.jpmx.xyz/trading-order-roseccc/file/2025-09-29/eth-icon.png',
    'BNBUSDT': 'https://file.jpmx.xyz/trading-order-roseccc/file/2025-09-29/bnb-icon.png'
  }

  const iconPath = iconMap[symbol]
  if (iconPath) {
    return iconPath.startsWith('http') ? iconPath : iconPath
  }

  // 默认图标
  return '/symbol/default.png'
}

// 图片加载错误处理
const onImageError = (event) => {
  console.warn('RWA图标加载失败:', event.target.src)
  event.target.onerror = null
  if (!event.target.src.includes('default.png')) {
    event.target.src = '/symbol/default.png'
  }
}

// 获取价格样式类
const getPriceClass = (changeRatio) => {
  if (changeRatio > 0) {
    return 'price-up'
  } else if (changeRatio < 0) {
    return 'price-down'
  } else {
    return 'price-neutral'
  }
}

// 格式化价格
const formatPrice = (price) => {
  if (price === null || price === undefined || isNaN(price)) {
    return '--'
  }
  return parseFloat(price).toFixed(2)
}

// 格式化成交量
const formatVolume = (volume) => {
  if (volume === null || volume === undefined || isNaN(volume)) {
    return '--'
  }
  const num = parseFloat(volume)
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(2) + 'B'
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K'
  } else {
    return num.toFixed(2)
  }
}

// 从API加载数据
const loadApiData = async () => {
  try {
    console.log('开始加载RWA数据...', '分类:', activeTab.value)

    let response = null

    // 根据选中的分类调用不同的 API
    if (activeTab.value === 'stocks') {
      response = await _getRWAStocks()
    } else if (activeTab.value === 'forex') {
      response = await _getRWAForex()
    } else if (activeTab.value === 'crypto') {
      response = await _getRWACrypto()
    }

    console.log('RWA API响应:', response)

    // 检查响应结构
    if (response && response.success && response.data && response.data.tick_list) {
      const dataArray = response.data.tick_list
      console.log('数据解析成功，数量:', dataArray.length)

      // 处理数据，添加 category 字段
      const processedData = dataArray.map(item => ({
        symbol: item.code || item.symbol,
        name: item.name,
        category: activeTab.value,
        close: parseFloat(item.price || item.close || 0),
        changeRatio: parseFloat(item.changeRatio || 0),
        netChange: parseFloat(item.change || 0),
        high: parseFloat(item.high || 0),
        low: parseFloat(item.low || 0),
        open: parseFloat(item.open || 0),
        volume: parseFloat(item.volume || 0)
      }))

      rwaList.value = processedData
      finished.value = true
    } else {
      console.error('RWA API响应格式错误:', response)
      // 如果API失败，使用模拟数据
      rwaList.value = [...mockRWAData]
      finished.value = true
    }
  } catch (error) {
    console.error('加载RWA API数据失败:', error)
    // 如果API失败，使用模拟数据
    rwaList.value = [...mockRWAData]
    finished.value = true
  }
}

// 定时刷新数据
const startAutoRefresh = () => {
  refreshTimer.value = setInterval(() => {
    loadApiData()
  }, 30000)
}

// 停止自动刷新
const stopAutoRefresh = () => {
  if (refreshTimer.value) {
    clearInterval(refreshTimer.value)
    refreshTimer.value = null
  }
}

// 方法
const onLoad = async () => {
  loading.value = true
  await loadApiData()
  loading.value = false
}

const onTabChange = (tabKey) => {
  activeTab.value = tabKey
  console.log('切换分类:', tabKey)

  // 切换分类时重新加载数据
  loadApiData()

  setTimeout(() => {
    applyThemeStyles()
  }, 100)
}

const handleItemClick = (item) => {
  console.log('点击RWA资产:', item.symbol)
  // 跳转到K线详情页
  router.push({
    path: '/quotes/detail',
    query: {
      symbol: item.symbol,
      type: 'rwa'
    }
  })
}

const isDarkMode = ref()

// 应用主题样式
const applyThemeStyles = () => {
  try {
    setTimeout(() => {
      isDarkMode.value = thStore.theme === 'dark' ||
                        window.matchMedia('(prefers-color-scheme: dark)').matches ||
                        document.documentElement.classList.contains('dark') ||
                        document.body.classList.contains('dark-theme') ||
                        document.documentElement.getAttribute('data-theme') === 'dark' ||
                        document.body.getAttribute('data-theme') === 'dark' ||
                        document.documentElement.style.colorScheme === 'dark'

      if (isDarkMode.value) {
        const containers = document.querySelectorAll('.rwa-container')
        const tabContainers = document.querySelectorAll('.tabs-container')
        const rwaItems = document.querySelectorAll('.rwa-item')
        const miniCharts = document.querySelectorAll('.mini-chart')

        containers.forEach(el => {
          el.style.backgroundColor = '#000000'
          el.style.setProperty('background-color', '#000000', 'important')
        })

        tabContainers.forEach(el => {
          el.style.backgroundColor = '#1a1a1a'
          el.style.border = '1px solid #333333'
          el.style.setProperty('background-color', '#1a1a1a', 'important')
        })

        rwaItems.forEach(el => {
          el.style.backgroundColor = '#1a1a1a'
          el.style.border = '1px solid #333333'
          el.style.setProperty('background-color', '#1a1a1a', 'important')
        })

        miniCharts.forEach(el => {
          el.style.backgroundColor = '#2a2a2a'
          el.style.border = '1px solid #444444'
          el.style.setProperty('background-color', '#2a2a2a', 'important')
        })

        // 设置文字颜色为白色
        const allTextElements = document.querySelectorAll('.rwa-container span, .rwa-container div, .rwa-container p, .rwa-container h1, .rwa-container h2, .rwa-container h3')
        allTextElements.forEach(el => {
          const isPriceElement = el.classList.contains('price-up') ||
                               el.classList.contains('price-down') ||
                               el.classList.contains('price-neutral') ||
                               el.classList.contains('rwa-price') ||
                               el.classList.contains('rwa-change')

          if (!isPriceElement) {
            el.style.color = '#ffffff'
            el.style.setProperty('color', '#ffffff', 'important')
          }
        })
      } else {
        // 明亮模式样式
        const containers = document.querySelectorAll('.rwa-container')
        const tabContainers = document.querySelectorAll('.tabs-container')
        const rwaItems = document.querySelectorAll('.rwa-item')
        const miniCharts = document.querySelectorAll('.mini-chart')

        containers.forEach(el => {
          el.style.backgroundColor = ''
          el.style.removeProperty('background-color')
        })

        tabContainers.forEach(el => {
          el.style.backgroundColor = ''
          el.style.border = ''
          el.style.removeProperty('background-color')
        })

        rwaItems.forEach(el => {
          el.style.backgroundColor = ''
          el.style.border = ''
          el.style.removeProperty('background-color')
        })

        miniCharts.forEach(el => {
          el.style.backgroundColor = ''
          el.style.border = ''
          el.style.removeProperty('background-color')
        })

        const allTextElements = document.querySelectorAll('.rwa-container span, .rwa-container div, .rwa-container p, .rwa-container h1, .rwa-container h2, .rwa-container h3')
        allTextElements.forEach(el => {
          const isPriceElement = el.classList.contains('price-up') ||
                               el.classList.contains('price-down') ||
                               el.classList.contains('price-neutral') ||
                               el.classList.contains('rwa-price') ||
                               el.classList.contains('rwa-change')

          if (!isPriceElement) {
            el.style.color = ''
            el.style.removeProperty('color')
          }
        })
      }
    }, 200)
  } catch (error) {
    console.error('应用主题样式失败:', error)
  }
}

// 生命周期
onMounted(() => {
  emit('changeLetMego', () => {})
  applyThemeStyles()
  onLoad()
  startAutoRefresh()
})

onUnmounted(() => {
  stopAutoRefresh()
})

// 监听主题变化
watch(() => thStore.theme, () => {
  applyThemeStyles()
}, { immediate: false })

// 监听分类切换
watch(() => activeTab.value, () => {
  setTimeout(() => {
    applyThemeStyles()
  }, 150)
}, { immediate: false })
</script>

<style lang="scss" scoped>
.rwa-container {
  padding: 16px;
  background: var(--van-background-color);
  min-height: 100vh;

  @media (prefers-color-scheme: dark) {
    background: #000000;
  }
}

.rwa-header {
  margin-bottom: 16px;
}

.tabs-container {
  background: var(--van-card-background-color);
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;

  @media (prefers-color-scheme: dark) {
    background: #1a1a1a;
    box-shadow: 0 2px 8px rgba(255, 255, 255, 0.1);
    border: 1px solid #333333;
  }
}

.tabs-wrapper {
  display: flex;
  gap: 4px;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: transparent;

  &:hover {
    background: rgba(0, 123, 255, 0.05);
    transform: translateY(-1px);

    @media (prefers-color-scheme: dark) {
      background: rgba(255, 255, 255, 0.05);
    }
  }

  &.active {
    background: #007bff;
    color: white;
    box-shadow: 0 2px 4px rgba(0, 123, 255, 0.3);

    @media (prefers-color-scheme: dark) {
      background: #0066cc;
      box-shadow: 0 2px 4px rgba(0, 102, 204, 0.4);
    }
  }

  .tab-icon {
    font-size: 20px;
    margin-bottom: 4px;
    display: block;
    transition: transform 0.2s ease;
  }

  &.active .tab-icon {
    transform: scale(1.1);
  }

  .tab-label {
    font-size: 12px;
    font-weight: 500;
    text-align: center;
    color: var(--van-text-color, #333333);

    @media (prefers-color-scheme: dark) {
      color: #ffffff !important;
    }
  }
}

.rwa-list {
  .rwa-item {
    background: var(--van-card-background-color);
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    transition: transform 0.2s ease;
    border: 1px solid transparent;

    @media (prefers-color-scheme: dark) {
      background: #1a1a1a;
      box-shadow: 0 2px 8px rgba(255, 255, 255, 0.1);
      border: 1px solid #333333;
    }

    &:hover {
      transform: translateY(-2px);

      @media (prefers-color-scheme: dark) {
        box-shadow: 0 4px 12px rgba(255, 255, 255, 0.15);
        border-color: #555555;
      }
    }

    .rwa-info {
      flex: 1;

      .rwa-header-info {
        display: flex;
        align-items: center;
        margin-bottom: 8px;

        .rwa-icon {
          width: 32px;
          height: 32px;
          margin-right: 12px;
          border-radius: 6px;
          object-fit: cover;
          flex-shrink: 0;
        }

        .rwa-title {
          flex: 1;

          .rwa-symbol {
            font-size: 16px;
            font-weight: bold;
            color: #000000;
            margin-bottom: 2px;

            @media (prefers-color-scheme: dark) {
              color: #ffffff !important;
            }
          }

          .rwa-name {
            font-size: 14px;
            color: #000000;

            @media (prefers-color-scheme: dark) {
              color: #ffffff !important;
            }
          }
        }
      }

      .rwa-price {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 4px;

        &.price-up {
          color: #10b981;

          @media (prefers-color-scheme: dark) {
            color: #34d399;
          }
        }

        &.price-down {
          color: #ef4444;

          @media (prefers-color-scheme: dark) {
            color: #f87171;
          }
        }

        &.price-neutral {
          color: #6b7280;

          @media (prefers-color-scheme: dark) {
            color: #9ca3af;
          }
        }
      }

      .rwa-change {
        font-size: 14px;
        font-weight: 500;

        &.price-up {
          color: #10b981;

          @media (prefers-color-scheme: dark) {
            color: #34d399;
          }
        }

        &.price-down {
          color: #ef4444;

          @media (prefers-color-scheme: dark) {
            color: #f87171;
          }
        }

        &.price-neutral {
          color: #6b7280;

          @media (prefers-color-scheme: dark) {
            color: #9ca3af;
          }
        }
      }

      .rwa-details {
        display: flex;
        gap: 12px;
        margin-top: 8px;
        font-size: 12px;
        color: var(--van-text-color-2, #666666);

        @media (prefers-color-scheme: dark) {
          color: #ffffff !important;
        }

        .detail-item {
          white-space: nowrap;
        }
      }

      .rwa-volume {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-top: 8px;
        font-size: 11px;
        color: var(--van-text-color-2, #666666);

        @media (prefers-color-scheme: dark) {
          color: #ffffff !important;
        }

        .volume-item {
          white-space: nowrap;
        }
      }
    }

    .rwa-chart {
      width: 60px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;

      .mini-chart {
        width: 100%;
        height: 100%;
        background: var(--van-background-color-light);
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #e5e7eb;

        @media (prefers-color-scheme: dark) {
          background: #2a2a2a;
          border: 1px solid #444444;
        }

        .chart-placeholder {
          font-size: 20px;

          @media (prefers-color-scheme: dark) {
            color: #ffffff;
          }
        }
      }
    }
  }
}

.empty-state {
  text-align: center;
  padding: 60px 20px;

  .empty-icon {
    font-size: 48px;
    margin-bottom: 16px;

    @media (prefers-color-scheme: dark) {
      color: #ffffff !important;
    }
  }

  .empty-text {
    font-size: 16px;
    color: var(--van-text-color-2, #666666);

    @media (prefers-color-scheme: dark) {
      color: #ffffff !important;
    }
  }
}

@media (prefers-color-scheme: dark) {
  .rwa-container {
    h1, h2, h3, h4, h5, h6,
    span, div, p,
    .tab-label,
    .rwa-symbol,
    .rwa-name,
    .rwa-details,
    .rwa-details .detail-item,
    .rwa-volume,
    .rwa-volume .volume-item,
    .empty-text,
    .empty-icon {
      color: #ffffff !important;
    }
  }
}
</style>
