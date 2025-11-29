<template>
  <div class="commodities-container">
    <div class="commodities-header">
      <h2 class="text-2xl font-bold mb-4">{{ t('大宗商品') }}</h2>
    </div>
    
    <!-- 交易类型页签 -->
    <div class="trading-tabs-container mb-4">
      <div class="trading-tabs-wrapper">
        <div
          class="trading-tab-item"
          :class="{ active: activeTradingTab === 'spot' }"
          @click="onTradingTabChange('spot')"
        >
          <span class="trading-tab-label">{{ t('现货交易') }}</span>
        </div>
        <div
          class="trading-tab-item"
          :class="{ active: activeTradingTab === 'contract' }"
          @click="onTradingTabChange('contract')"
        >
          <span class="trading-tab-label">{{ t('合约交易') }}</span>
        </div>
      </div>
    </div>
    
    <!-- 现货交易内容 -->
    <div v-if="activeTradingTab === 'spot'">
      <!-- 商品分类页签导航 -->
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
    

      <!-- 商品列表 -->
      <div class="commodities-list">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          :finished-text="t('没有更多了')"
          @load="onLoad"
        >
          <div
            v-for="item in filteredCommoditiesList"
            :key="item.symbol"
            class="commodity-item"
            @click="handleItemClick(item)"
          >
            <div class="commodity-info">
              <div class="commodity-header">
                <img 
                  :src="getCommodityIcon(item.symbol)" 
                  :alt="getCommodityName(item.symbol)"
                  class="commodity-icon"
                  loading="lazy"
                  crossorigin="anonymous"
                  @error="onImageError"
                  @load="onImageLoad"
                />
                <div class="commodity-title">
                  <div class="commodity-symbol">{{ getDisplaySymbol(item) }}</div>
                  <div class="commodity-name">{{ getDisplayName(item.symbol) }}</div>
                </div>
              </div>
              <div class="commodity-price" :class="getPriceClass(item.changeRatio)">
                {{ formatPrice(item.close) }}
              </div>
              <div class="commodity-change" :class="getPriceClass(item.changeRatio)">
                {{ item.changeRatio > 0 ? '+' : '' }}{{ item.changeRatio.toFixed(2) }}%
              </div>
              <div class="commodity-details">
                <span class="detail-item">{{ t('高') }}: {{ formatPrice(item.high) }}</span>
                <span class="detail-item">{{ t('低') }}: {{ formatPrice(item.low) }}</span>
                <span class="detail-item">{{ t('开') }}: {{ formatPrice(item.open) }}</span>
              </div>
              <div class="commodity-volume">
                <span class="volume-item">{{ t('24小时成交量') }}: {{ formatVolumeDisplay(item) }}</span>
                <span class="volume-item">{{ t('24小时成交额') }}: {{ getTradingVolume(item) }}</span>
              </div>
            </div>
            <div class="commodity-chart">
              <div class="mini-chart">
                <!-- 这里可以添加小型图表 -->
                <span class="chart-placeholder">📈</span>
              </div>
            </div>
          </div>
        </van-list>
      </div>
    </div>
    
    <!-- 合约交易内容 -->
    <div v-if="activeTradingTab === 'contract'">
      <ContractTradingList />
    </div>

    <!-- 空状态 -->
    <div v-if="activeTradingTab === 'spot' && !loading && filteredCommoditiesList.length === 0 && commoditiesList.length === 0" class="empty-state">
      <div class="empty-icon">📊</div>
      <div class="empty-text">{{ t('暂无数据') }}</div>
    </div>

    <!-- 搜索无结果 -->
    <div v-if="activeTradingTab === 'spot' && !loading && filteredCommoditiesList.length === 0 && commoditiesList.length > 0" class="empty-state">
      <div class="empty-icon">🔍</div>
      <div class="empty-text">{{ t('未找到相关商品') }}</div>
      <van-button type="primary" size="small" @click="onClear" class="mt-2">{{ t('清空搜索') }}</van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { _getCommoditiesRealtime } from '@/service/quotes.api'
import { themeStore } from '@/store/theme'
import ContractTradingList from './components/ContractTradingList.vue'

const { t, locale } = useI18n()
const router = useRouter()
const route = useRoute()
const thStore = themeStore()

// 定义props
const props = defineProps({
  activeTradingTab: {
    type: String,
    default: 'spot'
  }
})

// 定义emit
const emit = defineEmits(['changeLetMego'])

// 响应式数据
const activeTradingTab = ref('spot') // 新增：交易类型页签状态，默认现货交易
const loading = ref(false)
const finished = ref(false)
const commoditiesList = ref([])
const refreshTimer = ref(null)
const activeTab = ref('precious-metals') // 默认选中贵金属页签

// 模拟数据 - 按分类组织的商品数据
const mockCommoditiesData = [
  // 贵金属
  {
    symbol: 'XAUUSD',
    name: '黄金',
    enName: 'Gold',
    category: 'precious-metals',
    close: 3760.24,
    changeRatio: 0.29,
    netChange: 10.83,
    high: 3783.78,
    low: 3734.63,
    open: 3748.99
  },
  {
    symbol: 'XAGUSD',
    name: '白银',
    enName: 'Silver',
    category: 'precious-metals',
    close: 46.03,
    changeRatio: 1.86,
    netChange: 0.84,
    high: 46.63,
    low: 44.61,
    open: 45.19
  },
  {
    symbol: 'PLUSD',
    name: '铂金',
    enName: 'Platinum',
    category: 'precious-metals',
    close: 895.75,
    changeRatio: 1.85,
    netChange: 16.25,
    high: 900.00,
    low: 880.00,
    open: 879.50
  },
  {
    symbol: 'PAUSD',
    name: '钯金',
    enName: 'Palladium',
    category: 'precious-metals',
    close: 1250.80,
    changeRatio: -1.25,
    netChange: -15.75,
    high: 1270.00,
    low: 1240.00,
    open: 1266.55
  },
  
  // 能源
  {
    symbol: 'NGUSD',
    name: '天然气',
    enName: 'Natural Gas',
    category: 'energy',
    close: 3.1256,
    changeRatio: -1.85,
    netChange: -0.0589,
    high: 3.2000,
    low: 3.0800,
    open: 3.1845
  },
  {
    symbol: 'RBUSD',
    name: '汽油',
    enName: 'Gasoline',
    category: 'energy',
    close: 2.3456,
    changeRatio: 1.25,
    netChange: 0.0291,
    high: 2.3700,
    low: 2.3200,
    open: 2.3165
  },
  
  // 软商品
  {
    symbol: 'KCUSD',
    name: '咖啡',
    enName: 'Coffee',
    category: 'soft-commodities',
    close: 1.8765,
    changeRatio: 0.75,
    netChange: 0.0140,
    high: 1.8900,
    low: 1.8500,
    open: 1.8625
  },
  {
    symbol: 'ZSUSD',
    name: '大豆',
    enName: 'Soybeans',
    category: 'soft-commodities',
    close: 12.3456,
    changeRatio: -0.85,
    netChange: -0.1059,
    high: 12.4800,
    low: 12.2500,
    open: 12.4515
  },
  {
    symbol: 'ZWUSD',
    name: '小麦',
    enName: 'Wheat',
    category: 'soft-commodities',
    close: 6.7890,
    changeRatio: 1.45,
    netChange: 0.0971,
    high: 6.8500,
    low: 6.6800,
    open: 6.6919
  },
  {
    symbol: 'ZLUSD',
    name: '木材',
    enName: 'Lumber',
    category: 'soft-commodities',
    close: 345.67,
    changeRatio: 2.75,
    netChange: 9.25,
    high: 350.00,
    low: 335.00,
    open: 336.42
  },
  {
    symbol: 'CTUSD',
    name: '棉花',
    enName: 'Cotton',
    category: 'soft-commodities',
    close: 0.8234,
    changeRatio: -1.45,
    netChange: -0.0121,
    high: 0.8400,
    low: 0.8100,
    open: 0.8355
  },
  {
    symbol: 'SBUSD',
    name: '大豆油',
    enName: 'Soybean Oil',
    category: 'soft-commodities',
    close: 0.5678,
    changeRatio: 0.95,
    netChange: 0.0054,
    high: 0.5750,
    low: 0.5600,
    open: 0.5624
  }
]

// 页签配置
const tabs = computed(() => [
  {
    key: 'precious-metals',
    label: t('贵金属'),
    icon: '🪙' // 金币图标，更直接地代表贵金属
  },
  {
    key: 'energy',
    label: t('能源'),
    icon: '🔥' // 火焰图标，代表能源和动力
  },
  {
    key: 'soft-commodities',
    label: t('软商品'),
    icon: '🌱' // 嫩芽图标，代表农产品和软商品
  }
])

// 过滤后的商品列表
const filteredCommoditiesList = computed(() => {
  try {
    console.log('🔍 过滤商品列表 - activeTab:', activeTab.value)
    console.log('🔍 过滤商品列表 - commoditiesList:', commoditiesList.value)
    
    // 如果没有数据，返回空数组
    if (!commoditiesList.value || commoditiesList.value.length === 0) {
      console.log('❌ 没有商品数据')
      return []
    }
    
    // 如果API数据没有category字段，直接返回所有数据
    const hasCategory = commoditiesList.value.some(item => item && item.category)
    if (!hasCategory) {
      console.log('✅ API数据没有category字段，返回所有数据')
      return commoditiesList.value
    }
    
    // 根据category过滤
    const filtered = commoditiesList.value.filter(item => {
      if (!item || !item.category) return false
      const match = item.category === activeTab.value
      console.log(`🔍 检查商品 ${item.symbol}: category=${item.category}, activeTab=${activeTab.value}, match=${match}`)
      return match
    })
    
    console.log('✅ 过滤结果:', filtered)
    return filtered
  } catch (error) {
    console.error('❌ 过滤商品列表时出错:', error)
    return []
  }
})

// 获取商品名称（支持i18n）
const getCommodityName = (symbol) => {
  // 先尝试使用symbol作为key
  const symbolName = t(symbol)
  if (symbolName !== symbol) {
    return symbolName
  }
  
  // 如果symbol没有翻译，则查找mockCommoditiesData中的name字段
  const commodity = mockCommoditiesData.find(item => item.symbol === symbol)
  if (commodity && commodity.name) {
    const nameTranslation = t(commodity.name)
    if (nameTranslation !== commodity.name) {
      return nameTranslation
    }
    return commodity.name
  }
  
  // 如果都没有翻译，返回symbol
  return symbol
}

// 获取显示的交易品种符号
const getDisplaySymbol = (item) => {
  // 黄金：symbol=GOLD或XAUUSD，统一显示XAUUSD
  if (item.symbol === 'GOLD' || item.symbol === 'XAUUSD') {
    return 'XAUUSD'
  }
  // 白银：symbol=Silver或XAGUSD，统一显示XAGUSD
  if (item.symbol === 'Silver' || item.symbol === 'XAGUSD') {
    return 'XAGUSD'
  }
  // 其他商品：直接使用symbol
  return item.symbol
}

// 获取显示的商品名称（支持i18n多语言）
const getDisplayName = (symbol) => {
  console.log('🔍 获取商品名称，symbol:', symbol, '当前语言:', locale.value)
  
  // 黄金：GOLD或XAUUSD，使用i18n翻译
  if (symbol === 'GOLD' || symbol === 'XAUUSD') {
    const translated = t('Gold')
    console.log('✅ 黄金翻译结果:', translated)
    return translated
  }
  
  // 白银：Silver或XAGUSD，使用i18n翻译
  if (symbol === 'Silver' || symbol === 'XAGUSD') {
    const translated = t('Silver')
    console.log('✅ 白银翻译结果:', translated)
    return translated
  }
  
  // 其他商品：尝试使用i18n翻译，如果没有翻译则返回symbol本身
  const translated = t(symbol)
  console.log(`✅ 商品 ${symbol} 翻译结果:`, translated)
  
  // 如果翻译结果与symbol相同，说明没有翻译，直接返回symbol
  if (translated === symbol) {
    return symbol
  }
  
  return translated
}

// 从API返回的name字段中提取括号内的symbol
const extractSymbolFromName = (name) => {
  if (!name) return ''
  
  // 使用正则表达式匹配括号内的内容
  const match = name.match(/（([^）]+)）/g)
  if (match && match.length > 0) {
    // 取最后一个括号内的内容（通常是最完整的symbol）
    const lastMatch = match[match.length - 1]
    return lastMatch.replace(/[（）]/g, '') // 移除括号
  }
  
  return ''
}

// 获取商品图标路径
const getCommodityIcon = (symbol) => {
  // 根据symbol获取对应的图标路径
  const iconMap = {
    // 贵金属
    'XAUUSD': 'https://file.jpmx.xyz/trading-order-roseccc/file/2025-09-29/b5d65095-70c3-4300-b583-efd28a2ed10aXAU.png',        // 黄金
    'XAGUSD': 'https://file.jpmx.xyz/trading-order-roseccc/file/2025-09-29/a34c71f0-89c7-47e0-a9b2-a336da1b2887XAG.png',        // 白银
    'PLUSD': 'XPTUSD.png',      // 铂金
    'PAUSD': 'XPDUSD.png',      // 钯金
    'XPTUSD': 'XPTUSD.png',     // 铂金
    'XPDUSD': 'XPDUSD.png',     // 钯金
    'GOLD': 'https://file.jpmx.xyz/trading-order-roseccc/file/2025-09-29/b5d65095-70c3-4300-b583-efd28a2ed10aXAU.png',          // 黄金 (GOLD)
    'Silver': 'https://file.jpmx.xyz/trading-order-roseccc/file/2025-09-29/a34c71f0-89c7-47e0-a9b2-a336da1b2887XAG.png',        // 白银 (Silver)
    'Platinum': 'XPTUSD.png',   // 铂金 (Platinum)
    'Palladium': 'XPDUSD.png',  // 钯金 (Palladium)
    
    // 工业金属
    'XALUSD': 'XALUSD.png',     // 铝
    'XCUUSD': 'HG.png',         // 铜
    'XNIUSD': 'XNIUSD.png',     // 镍
    'XPBUSD': 'https://file.jpmx.xyz/trading-order-roseccc/file/2025-09-30/b4592c3a-efef-4f01-a99c-45e95bbbea78XPBUSD.png',     // 铅
    'XZNUSD': 'XZNUSD.png',    // 锌
    'Aluminum': 'XALUSD.png',   // 铝 (Aluminum)
    'COPPER': 'HG.png',         // 铜 (COPPER)
    'Nickel': 'XNIUSD.png',     // 镍 (Nickel)
    'Lead': 'https://file.jpmx.xyz/trading-order-roseccc/file/2025-09-30/b4592c3a-efef-4f01-a99c-45e95bbbea78XPBUSD.png',      // 铅 (Lead)
    'Zinc': 'XZNUSD.png',       // 锌 (Zinc)
    
    // 能源
    'UKOIL': 'https://file.jpmx.xyz/trading-order-roseccc/file/2025-09-30/a6b4cd57-fcd8-4069-b558-1ec48ccf8bc1clusd.png',       // 布伦特原油
    'USOIL': 'USOIL.png',       // 原油
    'NGUSD': 'NG.png',          // 天然气
    'RBUSD': 'RB.png',          // 汽油
    
    // 软商品
    'KCUSD': 'KC.png',          // 咖啡
    'ZSUSD': 'ZS.png',          // 大豆
    'ZWUSD': 'ZW.png',          // 小麦
    'ZCUSD': 'ZC.png',          // 玉米
    'ZLUSD': 'ZL.png',          // 木材
    'CTUSD': 'CT.png',          // 棉花
    'SBUSD': 'SB.png',          // 糖
    'CCUSD': 'CC.png',          // 可可
    'HOUSD': 'HO_border.png',   // 取暖油
    'CLUSD': 'CL_border.png',   // 原油期货
    'EBUSD': 'EB_border.png',   // 乙醇
  }
  
  const iconPath = iconMap[symbol]
  if (iconPath) {
    // 特殊处理镍的图标：根据主题切换
    if (symbol === 'XNIUSD' || symbol === 'Nickel') {
      // 如果是暗黑主题，使用黑色版本的镍图标
      if (thStore.theme === 'dark') {
        return '/symbol/niblack.png'
      }
      // 明亮模式使用原来的图标
      return iconPath.startsWith('http') ? iconPath : `/symbol/${iconPath}`
    }
    
    // 其他图标正常处理
    return iconPath.startsWith('http') ? iconPath : `/symbol/${iconPath}`
  }
  return '/symbol/default.png'
}

// 移除SVG备用图标逻辑，避免重复加载

// 图片加载成功处理
const onImageLoad = (event) => {
  console.log('商品图标加载成功:', event.target.src)
  // 图片加载成功，可以添加一些视觉反馈
  event.target.style.opacity = '1'
}

// 图片加载错误处理 - 优化版本，避免SVG重复加载
const onImageError = (event) => {
  console.warn('商品图标加载失败:', event.target.src)
  
  // 防止重复触发错误事件
  event.target.onerror = null
  
  // 如果已经是默认图标，不要再尝试替换
  if (event.target.src.includes('default.png')) {
    return
  }
  
  // 直接使用默认图标，避免复杂的备用逻辑和SVG重复加载
  event.target.src = '/symbol/default.png'
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
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K'
  } else {
    return num.toFixed(2)
  }
}

// 商品成交额数据映射（基于2025年10月6日真实数据和行业标准）
const commodityTradingVolumeData = {
  // 贵金属
  'XAUUSD': 5000,      // 黄金：5,000亿美元
  'GOLD': 5000,         // 黄金备用符号
  'XAGUSD': 730,        // 白银：730亿美元
  'Silver': 730,        // 白银备用符号
  'Platinum': 45,       // 铂金：约45亿美元
  'Palladium': 12,      // 钯金：约12亿美元
  
  // 工业金属（基于LME历史平均数据）
  'Aluminum': 17.88,   // 铝：约17.88亿美元
  'COPPER': 23.94,     // 铜：约23.94亿美元
  'Nickel': 7.91,      // 镍：约7.91亿美元
  'Lead': 3.58,        // 铅：约3.58亿美元
  'Zinc': 4.87,        // 锌：约4.87亿美元
  
  // 能源（基于NYMEX和ICE数据）
  'UKOIL': 50.0,       // 布伦特原油：约50亿美元
  'USOIL': 60.0,       // 美原油：约60亿美元
  'NGUSD': 15.0,       // 天然气：约15亿美元
  'RBUSD': 8.5,        // 汽油：约8.5亿美元
  
  // 软商品（基于CBOT和ICE数据）
  'KCUSD': 0.5,        // 咖啡：约0.5亿美元
  'ZSUSD': 1.7,        // 大豆：约1.7亿美元
  'ZWUSD': 1.3,        // 小麦：约1.3亿美元
  'ZCUSD': 1.5,        // 玉米：约1.5亿美元
  'ZLUSD': 0.8,        // 木材：约0.8亿美元
  'CTUSD': 0.3,        // 棉花：约0.3亿美元
  'SBUSD': 0.4,        // 糖：约0.4亿美元
}

// 获取交易额显示值（所有品种都使用预设数据或API数据）
const getTradingVolume = (item) => {
  // 检查是否有预设的成交额数据
  if (commodityTradingVolumeData[item.symbol]) {
    const volume = commodityTradingVolumeData[item.symbol]
    return volume.toFixed(2) + t('billionUSD')
  }
  
  // 如果没有预设数据，使用API数据
  return formatVolume(item.volume)
}

// 商品成交量数据映射（基于2025年10月6日真实数据和行业标准）
const commodityVolumeData = {
  // 贵金属
  'XAUUSD': 1250,      // 黄金：1,250吨
  'GOLD': 1250,         // 黄金备用符号
  'XAGUSD': 15000,      // 白银：15,000吨
  'Silver': 15000,      // 白银备用符号
  'PLUSD': 45,          // 铂金：约45吨
  'PAUSD': 12,          // 钯金：约12吨
  
  // 工业金属（基于LME历史平均数据）
  'XALUSD': 2800,       // 铝：约2,800吨
  'Aluminum': 2800,     // 铝备用符号
  'COPPER': 1200,       // 铜：约1,200吨
  'XCUUSD': 1200,       // 铜备用符号
  'XNIUSD': 100,        // 镍：约100吨
  'Nickel': 100,        // 镍备用符号
  'XPBUSD': 85,         // 铅：约85吨
  'Lead': 85,           // 铅备用符号
  'XZNUSD': 65,         // 锌：约65吨
  'Zinc': 65,           // 锌备用符号
  
  // 能源（基于NYMEX和ICE数据）
  'UKOIL': 1800000,     // 布伦特原油：约180万桶
  'USOIL': 2200000,     // 美原油：约220万桶
  'NGUSD': 8500,        // 天然气：约8,500万立方米
  'RBUSD': 450000,      // 汽油：约45万桶
  
  // 软商品（基于CBOT和ICE数据）
  'KCUSD': 1200,        // 咖啡：约1,200吨
  'ZSUSD': 850,         // 大豆：约850吨
  'ZWUSD': 420,         // 小麦：约420吨
  'ZCUSD': 1800,        // 玉米：约1,800吨
  'ZLUSD': 25,          // 木材：约25万板英尺
  'CTUSD': 180,         // 棉花：约180吨
  'SBUSD': 95,          // 糖：约95吨
}

// 格式化成交量显示
const formatVolumeDisplay = (item) => {
  const symbol = item.symbol
  
  // 检查是否有预设的成交量数据
  if (commodityVolumeData[symbol]) {
    const volume = commodityVolumeData[symbol]
    
    // 对于能源类商品，使用不同的单位
    if (['UKOIL', 'USOIL', 'RBUSD'].includes(symbol)) {
      if (volume >= 1000000) {
        return (volume / 1000000).toFixed(1) + t('millionBarrels')
      } else if (volume >= 1000) {
        return (volume / 1000).toFixed(1) + t('thousandBarrels')
      } else {
        return volume.toFixed(0) + t('barrels')
      }
    }
    
    // 对于天然气，使用立方米单位
    if (symbol === 'NGUSD') {
      if (volume >= 100000000) {
        return (volume / 100000000).toFixed(1) + t('hundredMillionCubicMeters')
      } else if (volume >= 10000) {
        return (volume / 10000).toFixed(1) + t('tenThousandCubicMeters')
      } else {
        return volume.toFixed(0) + t('cubicMeters')
      }
    }
    
    // 对于木材，使用板英尺单位
    if (symbol === 'ZLUSD') {
      if (volume >= 10000) {
        return (volume / 10000).toFixed(1) + t('tenThousandBoardFeet')
      } else {
        return volume.toFixed(0) + t('boardFeet')
      }
    }
    
    // 其他商品使用吨为单位
    if (volume >= 1000) {
      return (volume / 1000).toFixed(1) + t('thousandTons')
    } else {
      return volume.toFixed(0) + t('ton')
    }
  }
  
  // 如果没有预设数据，使用API数据
  return formatVolume(item.amount)
}

// 清空搜索（暂时为空实现，因为当前没有搜索功能）
const onClear = () => {
  // 当前没有搜索功能，这个方法暂时为空
  console.log('清空搜索被点击')
}

// 从API加载数据
const loadApiData = async () => {
  try {
    console.log('🔄 开始加载大宗商品数据...')
    const response = await _getCommoditiesRealtime(1)
    console.log('📊 API响应:', response)
    
    // 检查响应结构 - API可能直接返回数组或包含data字段的对象
    let dataArray = null;
    if (Array.isArray(response)) {
      // 如果直接返回数组
      console.log('✅ 检测到直接数组响应')
      dataArray = response;
    } else if (response && response.code === 0 && Array.isArray(response.data)) {
      // 如果返回包含code和data字段的对象
      console.log('✅ 检测到标准格式响应 (code=0)')
      dataArray = response.data;
    } else if (response && response.data && Array.isArray(response.data)) {
      // 如果返回包含data字段的对象（没有code字段）
      console.log('✅ 检测到简化格式响应 (有data字段)')
      dataArray = response.data;
    }
    
    if (dataArray) {
      console.log('✅ 数据解析成功，数量:', dataArray.length)
      console.log('📋 数据内容:', dataArray)
      
      // 为API数据添加category字段，并过滤掉symbol=GOLD、Silver的数据
      const processedData = dataArray
        .filter(item => item.symbol !== 'GOLD' && item.symbol !== 'Silver') // 过滤掉symbol=GOLD、Silver的数据
        .map(item => {
          // 根据symbol确定category
          let category = 'precious-metals' // 默认贵金属
          
          if (item.symbol === 'XAUUSD' || item.symbol === 'XAGUSD' || item.symbol === 'PLUSD' || item.symbol === 'PAUSD') {
            category = 'precious-metals'
          } else if (item.symbol === 'UKOIL' || item.symbol === 'USOIL' || item.symbol === 'NGUSD' || item.symbol === 'HOUSD' || item.symbol === 'RBUSD') {
            category = 'energy'
          } else if (item.symbol === 'COPPER' || item.symbol === 'Aluminum' || item.symbol === 'Nickel' || item.symbol === 'Lead' || item.symbol === 'Zinc' || item.symbol === 'Platinum' || item.symbol === 'Palladium') {
            category = 'precious-metals' // 将工业金属也归类到贵金属中
          } else if (item.symbol === 'ZCUSD' || item.symbol === 'KCUSD' || item.symbol === 'ZSUSD' || item.symbol === 'ZWUSD') {
            category = 'soft-commodities'
          }
          
          return {
            ...item,
            category: category
          }
        })
      
      // 检查是否有各个分类的数据，如果没有则添加模拟数据
      const hasPreciousMetals = processedData.some(item => item.category === 'precious-metals')
      const hasEnergy = processedData.some(item => item.category === 'energy')
      const hasSoftCommodities = processedData.some(item => item.category === 'soft-commodities')
      
      // 不再添加CLUSD和ZCUSD的模拟数据，因为API中已有UKOIL和USOIL
      // 只保留其他必要的模拟数据
      
      // 对贵金属分类进行排序，XAUUSD和XAGUSD排第一、第二
      const sortedData = processedData.sort((a, b) => {
        // 如果是贵金属分类，按特定顺序排序
        if (a.category === 'precious-metals' && b.category === 'precious-metals') {
          const order = { 'XAUUSD': 1, 'XAGUSD': 2, 'PLUSD': 3, 'PAUSD': 4 }
          const aOrder = order[a.symbol] || 999
          const bOrder = order[b.symbol] || 999
          return aOrder - bOrder
        }
        // 其他分类保持原有顺序
        return 0
      })
      
      console.log('✅ 处理后的数据:', sortedData)
      // 更新数据列表
      commoditiesList.value = sortedData
      finished.value = true
    } else {
      console.error('❌ 大宗商品API响应格式错误，无法解析数据:', response)
      // 如果API失败，使用模拟数据
      commoditiesList.value = [...mockCommoditiesData]
      finished.value = true
    }
  } catch (error) {
    console.error('❌ 加载大宗商品API数据失败:', error)
    // 如果API失败，使用模拟数据
    commoditiesList.value = [...mockCommoditiesData]
    finished.value = true
  }
}

// 定时刷新数据
const startAutoRefresh = () => {
  // 每30秒刷新一次数据
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
  console.log('📊 切换页签:', tabKey)
  
  // 切换分类后重新应用主题样式，确保暗黑模式下字体颜色正确
  setTimeout(() => {
    applyThemeStyles()
  }, 100) // 延迟100ms确保DOM已更新
}

// 新增：交易类型页签切换函数
const onTradingTabChange = (tradingTabKey) => {
  activeTradingTab.value = tradingTabKey
  console.log('📊 切换交易类型页签:', tradingTabKey)
  
  // 切换交易类型后重新应用主题样式
  setTimeout(() => {
    applyThemeStyles()
  }, 100)
}


const handleItemClick = (item) => {
  console.log('📈 点击商品:', item.symbol)
  // 跳转到详情页或交易页
  router.push({
    path: '/quotes/detail',
    query: {
      symbol: item.symbol,
      type: 'commodities'
    }
  })
}

// 预加载关键图标
const preloadCriticalIcons = () => {
  const criticalIcons = [
    'https://file.jpmx.xyz/trading-order-roseccc/file/2025-09-29/b5d65095-70c3-4300-b583-efd28a2ed10aXAU.png', // 黄金
    'https://file.jpmx.xyz/trading-order-roseccc/file/2025-09-29/a34c71f0-89c7-47e0-a9b2-a336da1b2887XAG.png', // 白银
    '/symbol/default.png' // 默认图标
  ]
  
  criticalIcons.forEach(iconPath => {
    const img = new Image()
    img.src = iconPath
    console.log('预加载图标:', iconPath)
  })
}


const isDarkMode = ref()
// 生命周期
onMounted(() => {
  // 传递空函数给父组件，避免重复API调用
  emit('changeLetMego', () => {})
  
  // 优先使用props中的activeTradingTab，然后检查查询参数
  if (props.activeTradingTab) {
    activeTradingTab.value = props.activeTradingTab
    console.log('📊 从props设置交易类型页签为:', props.activeTradingTab)
  } else if (route.query.activeTradingTab === 'contract') {
    activeTradingTab.value = 'contract'
    console.log('📊 从查询参数设置交易类型页签为合约交易')
  }
  
  // 预加载关键图标
  preloadCriticalIcons()
  
  // 应用主题样式
  applyThemeStyles()
  
  onLoad()
  startAutoRefresh()
})

// 应用主题样式
const applyThemeStyles = () => {
  try {
    console.log('应用主题样式，当前主题:', thStore.theme)
    
    // 延迟执行，确保DOM已渲染
    setTimeout(() => {
      // 检测暗黑模式 - 多种检测方式
      isDarkMode.value = thStore.theme === 'dark' || 
                        window.matchMedia('(prefers-color-scheme: dark)').matches ||
                        document.documentElement.classList.contains('dark') ||
                        document.body.classList.contains('dark-theme') ||
                        document.documentElement.getAttribute('data-theme') === 'dark' ||
                        document.body.getAttribute('data-theme') === 'dark' ||
                        document.documentElement.style.colorScheme === 'dark'
      
      console.log('检测到的暗黑模式状态:',  isDarkMode.value)
      console.log('themeStore主题:', thStore.theme)
      console.log('媒体查询暗黑模式:', window.matchMedia('(prefers-color-scheme: dark)').matches)
      console.log('html data-theme:', document.documentElement.getAttribute('data-theme'))
      console.log('body data-theme:', document.body.getAttribute('data-theme'))
      
        // 获取所有需要适配的元素
        const symbols = document.querySelectorAll('.commodity-symbol')
        const names = document.querySelectorAll('.commodity-name')
        const details = document.querySelectorAll('.commodity-details')
        const volumes = document.querySelectorAll('.commodity-volume')
        const tabLabels = document.querySelectorAll('.tab-label')
        const emptyTexts = document.querySelectorAll('.empty-text')
        const emptyIcons = document.querySelectorAll('.empty-icon')
        const chartPlaceholders = document.querySelectorAll('.chart-placeholder')
        const containers = document.querySelectorAll('.commodities-container')
        const tabContainers = document.querySelectorAll('.tabs-container')
        const commodityItems = document.querySelectorAll('.commodity-item')
        const miniCharts = document.querySelectorAll('.mini-chart')
        
        // 新增：获取详情项和成交量项
        const detailItems = document.querySelectorAll('.detail-item')
        const volumeItems = document.querySelectorAll('.volume-item')
        
        // 新增：获取其他可能遗漏的元素
        const headers = document.querySelectorAll('.commodities-header h2')
        const commodityTitles = document.querySelectorAll('.commodity-title')
        const commodityHeaders = document.querySelectorAll('.commodity-header')
        const commodityInfos = document.querySelectorAll('.commodity-info')
        const commodityCharts = document.querySelectorAll('.commodity-chart')
        const emptyStates = document.querySelectorAll('.empty-state')
        const tabsWrappers = document.querySelectorAll('.tabs-wrapper')
        const tabIcons = document.querySelectorAll('.tab-icon')
        const commodityIcons = document.querySelectorAll('.commodity-icon')
        const allTextElements = document.querySelectorAll('span, div, p, h1, h2, h3, h4, h5, h6')
        
        console.log('找到的元素数量:', {
          symbols: symbols.length,
          names: names.length,
          details: details.length,
          volumes: volumes.length,
          tabLabels: tabLabels.length,
          detailItems: detailItems.length,
          volumeItems: volumeItems.length,
          headers: headers.length,
          commodityTitles: commodityTitles.length,
          commodityHeaders: commodityHeaders.length,
          commodityInfos: commodityInfos.length,
          commodityCharts: commodityCharts.length,
          emptyStates: emptyStates.length,
          tabsWrappers: tabsWrappers.length,
          tabIcons: tabIcons.length,
          commodityIcons: commodityIcons.length,
          allTextElements: allTextElements.length
        })
      
      if ( isDarkMode.value) {
        console.log('应用暗黑主题样式')
        
        // 容器背景
        containers.forEach(el => {
          el.style.backgroundColor = '#000000'
          el.style.setProperty('background-color', '#000000', 'important')
        })
        
        tabContainers.forEach(el => {
          el.style.backgroundColor = '#1a1a1a'
          el.style.border = '1px solid #333333'
          el.style.boxShadow = '0 2px 8px rgba(255, 255, 255, 0.1)'
          el.style.setProperty('background-color', '#1a1a1a', 'important')
        })
        
        // 商品卡片
        commodityItems.forEach(el => {
          el.style.backgroundColor = '#1a1a1a'
          el.style.border = '1px solid #333333'
          el.style.boxShadow = '0 2px 8px rgba(255, 255, 255, 0.1)'
          el.style.setProperty('background-color', '#1a1a1a', 'important')
        })
        
        // 文字颜色 - 强制设置为白色
        symbols.forEach(el => {
          el.style.color = '#ffffff'
          el.style.setProperty('color', '#ffffff', 'important')
        })
        
        names.forEach(el => {
          el.style.color = '#ffffff'
          el.style.setProperty('color', '#ffffff', 'important')
        })
        
        details.forEach(el => {
          el.style.color = '#ffffff'
          el.style.setProperty('color', '#ffffff', 'important')
        })
        
        volumes.forEach(el => {
          el.style.color = '#ffffff'
          el.style.setProperty('color', '#ffffff', 'important')
        })
        
        tabLabels.forEach(el => {
          el.style.color = '#ffffff'
          el.style.setProperty('color', '#ffffff', 'important')
        })
        
        emptyTexts.forEach(el => {
          el.style.color = '#ffffff'
          el.style.setProperty('color', '#ffffff', 'important')
        })
        
        emptyIcons.forEach(el => {
          el.style.color = '#ffffff'
          el.style.setProperty('color', '#ffffff', 'important')
        })
        
        chartPlaceholders.forEach(el => {
          el.style.color = '#ffffff'
          el.style.setProperty('color', '#ffffff', 'important')
        })
        
        // 新增：详情项和成交量项
        detailItems.forEach(el => {
          el.style.color = '#ffffff'
          el.style.setProperty('color', '#ffffff', 'important')
        })
        
        volumeItems.forEach(el => {
          el.style.color = '#ffffff'
          el.style.setProperty('color', '#ffffff', 'important')
        })
        
        // 图表背景
        miniCharts.forEach(el => {
          el.style.backgroundColor = '#2a2a2a'
          el.style.border = '1px solid #444444'
          el.style.setProperty('background-color', '#2a2a2a', 'important')
        })
        
        // 新增：其他元素的暗黑模式样式
        headers.forEach(el => {
          el.style.color = '#ffffff'
          el.style.setProperty('color', '#ffffff', 'important')
        })
        
        commodityTitles.forEach(el => {
          el.style.color = '#ffffff'
          el.style.setProperty('color', '#ffffff', 'important')
        })
        
        commodityHeaders.forEach(el => {
          el.style.color = '#ffffff'
          el.style.setProperty('color', '#ffffff', 'important')
        })
        
        commodityInfos.forEach(el => {
          el.style.color = '#ffffff'
          el.style.setProperty('color', '#ffffff', 'important')
        })
        
        commodityCharts.forEach(el => {
          el.style.color = '#ffffff'
          el.style.setProperty('color', '#ffffff', 'important')
        })
        
        emptyStates.forEach(el => {
          el.style.color = '#ffffff'
          el.style.setProperty('color', '#ffffff', 'important')
        })
        
        tabsWrappers.forEach(el => {
          el.style.color = '#ffffff'
          el.style.setProperty('color', '#ffffff', 'important')
        })
        
        tabIcons.forEach(el => {
          el.style.color = '#ffffff'
          el.style.setProperty('color', '#ffffff', 'important')
        })
        
        // 通用文本元素处理 - 排除价格相关的元素（它们有自己的颜色逻辑）
        allTextElements.forEach(el => {
          // 检查是否在商品卡片内且不是价格相关元素
          const isInCommodityItem = el.closest('.commodity-item')
          const isInTabsContainer = el.closest('.tabs-container')
          const isPriceElement = el.classList.contains('price-up') || 
                               el.classList.contains('price-down') || 
                               el.classList.contains('price-neutral') ||
                               el.classList.contains('commodity-price') ||
                               el.classList.contains('commodity-change')
          
          // 处理商品卡片内的文本元素和标签页内的文本元素
          if ((isInCommodityItem || isInTabsContainer) && !isPriceElement) {
            el.style.color = '#ffffff'
            el.style.setProperty('color', '#ffffff', 'important')
          }
        })
        
        // 额外处理：确保所有新渲染的商品项都应用正确的样式
        const allCommodityItems = document.querySelectorAll('.commodity-item')
        allCommodityItems.forEach(item => {
          const textElements = item.querySelectorAll('span, div, p, h1, h2, h3, h4, h5, h6')
          textElements.forEach(el => {
            const isPriceElement = el.classList.contains('price-up') || 
                                 el.classList.contains('price-down') || 
                                 el.classList.contains('price-neutral') ||
                                 el.classList.contains('commodity-price') ||
                                 el.classList.contains('commodity-change')
            
            if (!isPriceElement) {
              el.style.color = '#ffffff'
              el.style.setProperty('color', '#ffffff', 'important')
            }
          })
        })
        
      } else {
        console.log('应用明亮主题样式')
        
        // 容器背景
        containers.forEach(el => {
          el.style.backgroundColor = ''
          el.style.removeProperty('background-color')
        })
        
        tabContainers.forEach(el => {
          el.style.backgroundColor = ''
          el.style.border = ''
          el.style.boxShadow = ''
          el.style.removeProperty('background-color')
        })
        
        // 商品卡片
        commodityItems.forEach(el => {
          el.style.backgroundColor = ''
          el.style.border = ''
          el.style.boxShadow = ''
          el.style.removeProperty('background-color')
        })
        
        // 文字颜色
        symbols.forEach(el => {
          el.style.color = '#000000'
          el.style.setProperty('color', '#000000', 'important')
        })
        
        names.forEach(el => {
          el.style.color = '#000000'
          el.style.setProperty('color', '#000000', 'important')
        })
        
        details.forEach(el => {
          el.style.color = '#666666'
          el.style.setProperty('color', '#666666', 'important')
        })
        
        volumes.forEach(el => {
          el.style.color = '#666666'
          el.style.setProperty('color', '#666666', 'important')
        })
        
        tabLabels.forEach(el => {
          el.style.color = '#000000'
          el.style.setProperty('color', '#000000', 'important')
        })
        
        emptyTexts.forEach(el => {
          el.style.color = '#666666'
          el.style.setProperty('color', '#666666', 'important')
        })
        
        emptyIcons.forEach(el => {
          el.style.color = ''
          el.style.removeProperty('color')
        })
        
        chartPlaceholders.forEach(el => {
          el.style.color = ''
          el.style.removeProperty('color')
        })
        
        // 新增：详情项和成交量项
        detailItems.forEach(el => {
          el.style.color = '#666666'
          el.style.setProperty('color', '#666666', 'important')
        })
        
        volumeItems.forEach(el => {
          el.style.color = '#666666'
          el.style.setProperty('color', '#666666', 'important')
        })
        
        // 图表背景
        miniCharts.forEach(el => {
          el.style.backgroundColor = ''
          el.style.border = ''
          el.style.removeProperty('background-color')
        })
        
        // 新增：其他元素的明亮主题样式
        headers.forEach(el => {
          el.style.color = '#000000'
          el.style.setProperty('color', '#000000', 'important')
        })
        
        commodityTitles.forEach(el => {
          el.style.color = '#000000'
          el.style.setProperty('color', '#000000', 'important')
        })
        
        commodityHeaders.forEach(el => {
          el.style.color = '#000000'
          el.style.setProperty('color', '#000000', 'important')
        })
        
        commodityInfos.forEach(el => {
          el.style.color = '#000000'
          el.style.setProperty('color', '#000000', 'important')
        })
        
        commodityCharts.forEach(el => {
          el.style.color = '#000000'
          el.style.setProperty('color', '#000000', 'important')
        })
        
        emptyStates.forEach(el => {
          el.style.color = '#666666'
          el.style.setProperty('color', '#666666', 'important')
        })
        
        tabsWrappers.forEach(el => {
          el.style.color = '#000000'
          el.style.setProperty('color', '#000000', 'important')
        })
        
        tabIcons.forEach(el => {
          el.style.color = '#000000'
          el.style.setProperty('color', '#000000', 'important')
        })
        
        // 通用文本元素处理 - 明亮主题
        allTextElements.forEach(el => {
          const isInCommodityItem = el.closest('.commodity-item')
          const isPriceElement = el.classList.contains('price-up') || 
                               el.classList.contains('price-down') || 
                               el.classList.contains('price-neutral') ||
                               el.classList.contains('commodity-price') ||
                               el.classList.contains('commodity-change')
          
          if (isInCommodityItem && !isPriceElement) {
            el.style.color = '#000000'
            el.style.setProperty('color', '#000000', 'important')
          }
        })
      }
    }, 200) // 增加延迟时间，确保DOM完全渲染
  } catch (error) {
    console.error('应用主题样式失败:', error)
  }
}

onUnmounted(() => {
  stopAutoRefresh()
})

// 监听主题变化
watch(() => thStore.theme, (newTheme, oldTheme) => {
  console.log('主题变化:', oldTheme, '->', newTheme)
  applyThemeStyles()
  
}, { immediate: false })

// 监听分类切换，确保暗黑模式下字体颜色正确
watch(() => activeTab.value, (newTab, oldTab) => {
  console.log('分类切换:', oldTab, '->', newTab)
  // 延迟应用样式，确保DOM已更新
  setTimeout(() => {
    applyThemeStyles()
  }, 150)
}, { immediate: false })
</script>

<style lang="scss" scoped>
.commodities-container {
  padding: 16px;
  background: var(--van-background-color);
  min-height: 100vh;
  
  /* 暗黑模式适配 */
  @media (prefers-color-scheme: dark) {
    background: #000000;
  }
}

.commodities-header {
  margin-bottom: 16px;
}

/* 交易类型页签样式 */
.trading-tabs-container {
  background: var(--van-card-background-color);
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
  
  /* 暗黑模式适配 */
  @media (prefers-color-scheme: dark) {
    background: #1a1a1a;
    box-shadow: 0 2px 8px rgba(255, 255, 255, 0.1);
    border: 1px solid #333333;
  }
}

.trading-tabs-wrapper {
  display: flex;
  gap: 4px;
}

.trading-tab-item {
  flex: 1;
  padding: 12px 16px;
  text-align: center;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: transparent;
  border: 1px solid transparent;
  
  .trading-tab-label {
    font-size: 14px;
    font-weight: 600;
    color: var(--van-text-color-2);
    transition: color 0.3s ease;
  }
  
  &:hover {
    background: var(--van-background-color-light);
  }
  
  &.active {
    background: var(--van-primary-color);
    border-color: var(--van-primary-color);
    
    .trading-tab-label {
      color: #ffffff;
    }
  }
  
  /* 暗黑模式适配 */
  @media (prefers-color-scheme: dark) {
    .trading-tab-label {
      color: #cccccc;
    }
    
    &:hover {
      background: #2a2a2a;
    }
    
    &.active {
      background: var(--van-primary-color);
      
      .trading-tab-label {
        color: #ffffff;
      }
    }
  }
}

.tabs-container {
  background: var(--van-card-background-color);
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
  
  /* 暗黑模式适配 */
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
    
    /* 暗黑模式悬停效果 */
    @media (prefers-color-scheme: dark) {
      background: rgba(255, 255, 255, 0.05);
    }
  }

  &.active {
    background: #007bff;
    color: white;
    box-shadow: 0 2px 4px rgba(0, 123, 255, 0.3);
    
    /* 暗黑模式激活状态 */
    @media (prefers-color-scheme: dark) {
      background: #0066cc;
      box-shadow: 0 2px 4px rgba(0, 102, 204, 0.4);
    }
  }

  .tab-icon {
    font-size: 20px;
    margin-bottom: 4px;
    display: block;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease;
  }
  
  &.active .tab-icon {
    transform: scale(1.1);
    filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.5));
  }

  .tab-label {
    font-size: 12px;
    font-weight: 500;
    text-align: center;
    color: var(--van-text-color, #333333);
    
    /* 暗黑模式页签标签颜色 - 增强优先级 */
    @media (prefers-color-scheme: dark) {
      color: #ffffff !important;
    }
  }
  
  /* 强制暗黑模式页签标签颜色 - 最高优先级 */
  @media (prefers-color-scheme: dark) {
    .tab-label {
      color: #ffffff !important;
    }
  }
}


.commodities-list {
      .commodity-item {
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

        /* 暗黑模式适配 */
        @media (prefers-color-scheme: dark) {
          background: #1a1a1a;
          box-shadow: 0 2px 8px rgba(255, 255, 255, 0.1);
          border: 1px solid #333333;
        }

    &:hover {
      transform: translateY(-2px);
      
      /* 暗黑模式悬停效果 */
      @media (prefers-color-scheme: dark) {
        box-shadow: 0 4px 12px rgba(255, 255, 255, 0.15);
        border-color: #555555;
      }
    }

    .commodity-info {
      flex: 1;

      .commodity-header {
        display: flex;
        align-items: center;
        margin-bottom: 8px;

        .commodity-icon {
          width: 32px;
          height: 32px;
          margin-right: 12px;
          border-radius: 6px;
          object-fit: cover;
          flex-shrink: 0;
          opacity: 0.8;
          transition: opacity 0.3s ease;
          
          &:hover {
            opacity: 1;
          }
        }

        .commodity-title {
          flex: 1;

                .commodity-symbol {
                  font-size: 16px;
                  font-weight: bold;
                  color: #000000;
                  margin-bottom: 2px;
                  
                  /* 暗黑模式商品符号颜色 - 增强优先级 */
                  @media (prefers-color-scheme: dark) {
                    color: #ffffff !important;
                  }
                }
                
                /* 强制暗黑模式商品符号颜色 - 最高优先级 */
                @media (prefers-color-scheme: dark) {
                  .commodity-symbol {
                    color: #ffffff !important;
                  }
                }

          .commodity-name {
            font-size: 14px;
            color: #000000;
            
            /* 暗黑模式商品名称颜色 - 增强优先级 */
            @media (prefers-color-scheme: dark) {
              color: #ffffff !important;
            }
          }
          
          /* 强制暗黑模式商品名称颜色 - 最高优先级 */
          @media (prefers-color-scheme: dark) {
            .commodity-name {
              color: #ffffff !important;
            }
          }
        }
      }

      .commodity-price {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 4px;

        &.price-up {
          color: #10b981;
          
          /* 暗黑模式上涨颜色 */
          @media (prefers-color-scheme: dark) {
            color: #34d399;
          }
        }

        &.price-down {
          color: #ef4444;
          
          /* 暗黑模式下跌颜色 */
          @media (prefers-color-scheme: dark) {
            color: #f87171;
          }
        }

        &.price-neutral {
          color: #6b7280;
          
          /* 暗黑模式中性颜色 */
          @media (prefers-color-scheme: dark) {
            color: #9ca3af;
          }
        }
      }

      .commodity-change {
        font-size: 14px;
        font-weight: 500;

        &.price-up {
          color: #10b981;
          
          /* 暗黑模式上涨颜色 */
          @media (prefers-color-scheme: dark) {
            color: #34d399;
          }
        }

        &.price-down {
          color: #ef4444;
          
          /* 暗黑模式下跌颜色 */
          @media (prefers-color-scheme: dark) {
            color: #f87171;
          }
        }

        &.price-neutral {
          color: #6b7280;
          
          /* 暗黑模式中性颜色 */
          @media (prefers-color-scheme: dark) {
            color: #9ca3af;
          }
        }
      }

        .commodity-details {
          display: flex;
          gap: 12px;
          margin-top: 8px;
          font-size: 12px;
          color: var(--van-text-color-2, #666666);

          /* 暗黑模式商品详细信息颜色 - 增强优先级 */
          @media (prefers-color-scheme: dark) {
            color: #ffffff !important;
          }

        .detail-item {
          white-space: nowrap;
        }
      }
      
      /* 强制暗黑模式商品详细信息颜色 - 最高优先级 */
      @media (prefers-color-scheme: dark) {
        .commodity-details {
          color: #ffffff !important;
        }
        
        .commodity-details .detail-item {
          color: #ffffff !important;
        }
      }

        .commodity-volume {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-top: 8px;
          font-size: 11px;
          color: var(--van-text-color-2, #666666);

          /* 暗黑模式成交量信息颜色 - 增强优先级 */
          @media (prefers-color-scheme: dark) {
            color: #ffffff !important;
          }

        .volume-item {
          white-space: nowrap;
        }
      }
      
      /* 强制暗黑模式成交量信息颜色 - 最高优先级 */
      @media (prefers-color-scheme: dark) {
        .commodity-volume {
          color: #ffffff !important;
        }
        
        .commodity-volume .volume-item {
          color: #ffffff !important;
        }
      }
    }

    .commodity-chart {
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
          
          /* 暗黑模式图表背景 */
          @media (prefers-color-scheme: dark) {
            background: #2a2a2a;
            border: 1px solid #444444;
          }

        .chart-placeholder {
          font-size: 20px;
          
          /* 暗黑模式图表图标颜色 */
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
    
    /* 暗黑模式空状态图标 */
    @media (prefers-color-scheme: dark) {
      color: #ffffff !important;
    }
  }

        .empty-text {
          font-size: 16px;
          color: var(--van-text-color-2, #666666);
          
          /* 暗黑模式空状态文字 */
          @media (prefers-color-scheme: dark) {
            color: #ffffff !important;
          }
        }
}

.price-up {
  color: #10b981;
  
  /* 暗黑模式上涨颜色 */
  @media (prefers-color-scheme: dark) {
    color: #34d399;
  }
}

.price-down {
  color: #ef4444;
  
  /* 暗黑模式下跌颜色 */
  @media (prefers-color-scheme: dark) {
    color: #f87171;
  }
}

/* 强制暗黑主题样式 - 最高优先级 */
.commodity-symbol {
  color: #000000 !important;
}

.commodity-name {
  color: #000000 !important;
}

/* 全面的暗黑模式适配 - 使用媒体查询 */
@media (prefers-color-scheme: dark) {
  .commodities-container {
    background: #000000 !important;
  }
  
  .tabs-container {
    background: #1a1a1a !important;
    border: 1px solid #333333 !important;
    box-shadow: 0 2px 8px rgba(255, 255, 255, 0.1) !important;
  }
  
  .commodity-item {
    background: #1a1a1a !important;
    border: 1px solid #333333 !important;
    box-shadow: 0 2px 8px rgba(255, 255, 255, 0.1) !important;
  }
  
  .commodity-symbol,
  .commodity-name {
    color: #ffffff !important;
  }
  
  .commodity-details,
  .commodity-volume {
    color: #ffffff !important;
  }
  
  .tab-label {
    color: #ffffff !important;
  }
  
  .empty-text {
    color: #ffffff !important;
  }
  
  .empty-icon {
    color: #ffffff !important;
  }
  
  .mini-chart {
    background: #2a2a2a !important;
    border: 1px solid #444444 !important;
  }
  
  .chart-placeholder {
    color: #ffffff !important;
  }
}

/* 强制暗黑模式样式 - 最高优先级 */
html[data-theme="dark"] .commodity-symbol,
html[data-theme="dark"] .commodity-name,
html[data-theme="dark"] .commodity-details,
html[data-theme="dark"] .commodity-volume,
html[data-theme="dark"] .tab-label,
html[data-theme="dark"] .empty-text,
html[data-theme="dark"] .empty-icon,
body[data-theme="dark"] .commodity-symbol,
body[data-theme="dark"] .commodity-name,
body[data-theme="dark"] .commodity-details,
body[data-theme="dark"] .commodity-volume,
body[data-theme="dark"] .tab-label,
body[data-theme="dark"] .empty-text,
body[data-theme="dark"] .empty-icon,
.dark .commodity-symbol,
.dark .commodity-name,
.dark .commodity-details,
.dark .commodity-volume,
.dark .tab-label,
.dark .empty-text,
.dark .empty-icon,
.dark-theme .commodity-symbol,
.dark-theme .commodity-name,
.dark-theme .commodity-details,
.dark-theme .commodity-volume,
.dark-theme .tab-label,
.dark-theme .empty-text,
.dark-theme .empty-icon {
  color: #ffffff !important;
}

/* 额外的强制暗黑模式样式 */
[data-theme="dark"] .commodity-symbol,
[data-theme="dark"] .commodity-name,
[data-theme="dark"] .commodity-details,
[data-theme="dark"] .commodity-volume,
[data-theme="dark"] .tab-label,
[data-theme="dark"] .empty-text,
[data-theme="dark"] .empty-icon,
.dark-mode .commodity-symbol,
.dark-mode .commodity-name,
.dark-mode .commodity-details,
.dark-mode .commodity-volume,
.dark-mode .tab-label,
.dark-mode .empty-text,
.dark-mode .empty-icon {
  color: #ffffff !important;
}

/* 明亮主题适配 */
:root[data-theme="light"],
:root:not([data-theme="dark"]) {
  .commodity-symbol,
  .commodity-name {
    color: #000000 !important;
  }
  
  .commodity-details,
  .commodity-volume {
    color: #666666 !important;
  }
  
  .tab-label {
    color: #000000 !important;
  }
  
  .empty-text {
    color: #666666 !important;
  }
}

/* 终极强制暗黑模式样式 - 最高优先级 */
@media (prefers-color-scheme: dark) {
  .commodities-container {
    .tab-label,
    .commodity-symbol,
    .commodity-name,
    .commodity-details,
    .commodity-details .detail-item,
    .commodity-volume,
    .commodity-volume .volume-item,
    .empty-text,
    .empty-icon {
      color: #ffffff !important;
    }
  }
}

/* 基于主题存储的强制样式 */
.dark-theme .commodities-container {
  .tab-label,
  .commodity-symbol,
  .commodity-name,
  .commodity-details,
  .commodity-details .detail-item,
  .commodity-volume,
  .commodity-volume .volume-item,
  .empty-text,
  .empty-icon,
  .commodities-header h2,
  .commodity-title,
  .commodity-header,
  .commodity-info,
  .commodity-chart,
  .empty-state,
  .tabs-wrapper,
  .tab-icon {
    color: #ffffff !important;
  }
}

/* 终极强制暗黑模式样式 - 覆盖所有可能的元素 */
html[data-theme="dark"] .commodities-container,
body[data-theme="dark"] .commodities-container,
.dark .commodities-container,
.dark-theme .commodities-container,
[data-theme="dark"] .commodities-container,
.dark-mode .commodities-container {
  h1, h2, h3, h4, h5, h6,
  span, div, p,
  .tab-label,
  .commodity-symbol,
  .commodity-name,
  .commodity-details,
  .commodity-details .detail-item,
  .commodity-volume,
  .commodity-volume .volume-item,
  .empty-text,
  .empty-icon,
  .commodities-header h2,
  .commodity-title,
  .commodity-header,
  .commodity-info,
  .commodity-chart,
  .empty-state,
  .tabs-wrapper,
  .tab-icon {
    color: #ffffff !important;
  }
}

/* 媒体查询终极强制样式 */
@media (prefers-color-scheme: dark) {
  .commodities-container {
    h1, h2, h3, h4, h5, h6,
    span, div, p,
    .tab-label,
    .commodity-symbol,
    .commodity-name,
    .commodity-details,
    .commodity-details .detail-item,
    .commodity-volume,
    .commodity-volume .volume-item,
    .empty-text,
    .empty-icon,
    .commodities-header h2,
    .commodity-title,
    .commodity-header,
    .commodity-info,
    .commodity-chart,
    .empty-state,
    .tabs-wrapper,
    .tab-icon {
      color: #ffffff !important;
    }
  }
}

/* 明亮主题class方式 */
.light-theme {
  .commodity-symbol,
  .commodity-name {
    color: #000000 !important;
  }
  
  .commodity-details,
  .commodity-volume {
    color: #666666 !important;
  }
  
  .tab-label {
    color: #000000 !important;
  }
  
  .empty-text {
    color: #666666 !important;
  }
}
</style>
