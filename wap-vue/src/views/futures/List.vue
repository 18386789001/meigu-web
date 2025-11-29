<template>
  <section class="futures-container">
    <!-- 分类筛选 -->
    <div class="category-filters">
      <div 
        v-for="category in categories" 
        :key="category.key"
        class="filter-item" 
        :class="{ active: activeCategory === category.key }"
        @click="switchCategory(category.key)"
      >
        {{ t(category.title) }}
      </div>
    </div>

    <!-- 数据表格头部 -->
    <div class="table-header">
      <div class="header-item contract">{{ t('合约') }}</div>
      <div class="header-item latest" @click="sortBy('latest')">
        {{ t('最新') }}
        <span class="sort-icon" :class="{ active: sortField === 'latest' }">↕</span>
      </div>
      <div class="header-item change" @click="sortBy('change')">
        {{ t('涨幅') }}
        <span class="sort-icon" :class="{ active: sortField === 'change' }">↕</span>
      </div>
      <div class="header-item change-amount" @click="sortBy('changeAmount')">
        {{ t('涨跌') }}
        <span class="sort-icon" :class="{ active: sortField === 'changeAmount' }">↕</span>
      </div>
    </div>

    <!-- 数据列表 -->
    <div class="futures-list">
      <div 
        v-for="item in filteredFutures" 
        :key="item.symbol" 
        class="futures-item"
        @click="goToDetail(item)"
      >
        <div class="contract-info">
          <div class="contract-name">{{ t(item.commodityName) }}{{ item.contractCode }}</div>
          <div class="contract-symbol">{{ item.symbol }}</div>
        </div>
        <div class="price-info">
          <div class="latest-price" :class="{ positive: item.change > 0, negative: item.change < 0 }">
            {{ item.price }}
          </div>
          <div class="change-percent" :class="{ positive: item.change > 0, negative: item.change < 0 }">
            {{ item.change > 0 ? '+' : '' }}{{ item.change.toFixed(2) }}%
          </div>
          <div class="change-amount" :class="{ positive: item.change > 0, negative: item.change < 0 }">
            {{ item.change > 0 ? '+' : '' }}{{ item.changeAmount }}
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredFutures.length === 0" class="empty-state">
      <div class="empty-icon">📊</div>
      <div class="empty-text">{{ t('暂无数据') }}</div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted,watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { _getRealtimeByType, _publicRealtimeTop } from '@/service/quotes.api'

const { t } = useI18n()
const router = useRouter()
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
const emit = defineEmits(['changeLetMego'])

// 响应式数据
const sortField = ref('change')
const sortOrder = ref('desc')
const activeCategory = ref('precious-metals')

// 完整的期货数据
const futuresData = ref([
  // 贵金属 (4个品种)
  {
    symbol: 'AU',
    name: '黄金',
    commodityName: 'gold',
    contractCode: '',
    price: '428.593',
    change: 1.35,
    changeAmount: '5.74',
    category: 'precious-metals'
  },
  {
    symbol: 'AG',
    name: '白银',
    commodityName: 'silver',
    contractCode: '',
    price: '1538.78',
    change: -3.69,
    changeAmount: '-58.93',
    category: 'precious-metals'
  },
  {
    symbol: 'PT',
    name: '铂',
    commodityName: 'platinum',
    contractCode: '',
    price: '892.45',
    change: 2.15,
    changeAmount: '18.76',
    category: 'precious-metals'
  },
  {
    symbol: 'PD',
    name: '钯',
    commodityName: 'palladium',
    contractCode: '',
    price: '1245.32',
    change: -1.85,
    changeAmount: '-23.45',
    category: 'precious-metals'
  },
  
  // 工业金属 (6个品种)
  {
    symbol: 'CU',
    name: '铜',
    commodityName: 'copper',
    contractCode: '',
    price: '3.4567',
    change: 0.85,
    changeAmount: '0.0291',
    category: 'industrial-metals'
  },
  {
    symbol: 'AL',
    name: '铝',
    commodityName: 'aluminum',
    contractCode: '',
    price: '2.1234',
    change: -2.15,
    changeAmount: '-0.0467',
    category: 'industrial-metals'
  },
  {
    symbol: 'PB',
    name: '铅',
    commodityName: 'lead',
    contractCode: '',
    price: '1.9876',
    change: 1.25,
    changeAmount: '0.0245',
    category: 'industrial-metals'
  },
  {
    symbol: 'ZN',
    name: '锌',
    commodityName: 'zinc',
    contractCode: '',
    price: '2.3456',
    change: -0.95,
    changeAmount: '-0.0225',
    category: 'industrial-metals'
  },
  {
    symbol: 'SN',
    name: '锡',
    commodityName: 'tin',
    contractCode: '',
    price: '18.7654',
    change: 3.25,
    changeAmount: '0.5921',
    category: 'industrial-metals'
  },
  {
    symbol: 'NI',
    name: '镍',
    commodityName: 'nickel',
    contractCode: '',
    price: '12.3456',
    change: -1.75,
    changeAmount: '-0.2198',
    category: 'industrial-metals'
  },
  
  // 能源 (3个品种)
  {
    symbol: 'BRENT',
    name: 'spotBrent原油',
    commodityName: 'spotBrent',
    contractCode: '',
    price: '78.45',
    change: 2.35,
    changeAmount: '1.80',
    category: 'energy'
  },
  {
    symbol: 'NATGAS',
    name: 'NatGas天然气',
    commodityName: 'natGas',
    contractCode: '',
    price: '3.1256',
    change: -1.85,
    changeAmount: '-0.0589',
    category: 'energy'
  },
  {
    symbol: 'GASOLINE',
    name: 'Gasoline汽油',
    commodityName: 'gasoline',
    contractCode: '',
    price: '2.4567',
    change: 1.95,
    changeAmount: '0.0471',
    category: 'energy'
  },
  
  // 软商品 (12个品种)
  {
    symbol: 'COFFEE',
    name: 'Coffee咖啡',
    commodityName: 'coffee',
    contractCode: '',
    price: '1.8765',
    change: 0.75,
    changeAmount: '0.0140',
    category: 'soft-commodities'
  },
  {
    symbol: 'COCOA',
    name: 'Cocoa可可豆',
    commodityName: 'cocoa',
    contractCode: '',
    price: '2.3456',
    change: -2.25,
    changeAmount: '-0.0541',
    category: 'soft-commodities'
  },
  {
    symbol: 'WHEAT',
    name: 'Wheat小麦',
    commodityName: 'wheat',
    contractCode: '',
    price: '6.7890',
    change: 1.45,
    changeAmount: '0.0971',
    category: 'soft-commodities'
  },
  {
    symbol: 'SOYBEANS',
    name: 'Soybeans大豆',
    commodityName: 'soybeans',
    contractCode: '',
    price: '12.3456',
    change: -0.85,
    changeAmount: '-0.1059',
    category: 'soft-commodities'
  },
  {
    symbol: 'CORN',
    name: 'Corn玉米',
    commodityName: 'corn',
    contractCode: '',
    price: '4.5678',
    change: 2.15,
    changeAmount: '0.0961',
    category: 'soft-commodities'
  },
  {
    symbol: 'OJ',
    name: 'OJ橙汁',
    commodityName: 'orangeJuice',
    contractCode: '',
    price: '1.2345',
    change: -1.25,
    changeAmount: '-0.0156',
    category: 'soft-commodities'
  },
  {
    symbol: 'SUGAR',
    name: 'Sugar糖',
    commodityName: 'sugar',
    contractCode: '',
    price: '0.1876',
    change: 3.45,
    changeAmount: '0.0063',
    category: 'soft-commodities'
  },
  {
    symbol: 'SOYOIL',
    name: 'SoyOil豆油',
    commodityName: 'soyOil',
    contractCode: '',
    price: '0.4567',
    change: -0.95,
    changeAmount: '-0.0044',
    category: 'soft-commodities'
  },
  {
    symbol: 'LEANHOGS',
    name: 'LeanHogs瘦猪肉',
    commodityName: 'leanHogs',
    contractCode: '',
    price: '0.6789',
    change: 1.75,
    changeAmount: '0.0117',
    category: 'soft-commodities'
  },
  {
    symbol: 'CATTLE',
    name: 'Cattle活牛',
    commodityName: 'cattle',
    contractCode: '',
    price: '1.2345',
    change: -2.35,
    changeAmount: '-0.0297',
    category: 'soft-commodities'
  },
  {
    symbol: 'OATS',
    name: 'Oats燕麦',
    commodityName: 'oats',
    contractCode: '',
    price: '3.4567',
    change: 0.65,
    changeAmount: '0.0224',
    category: 'soft-commodities'
  },
  {
    symbol: 'COTTON',
    name: 'Cotton棉花',
    commodityName: 'cotton',
    contractCode: '',
    price: '0.7890',
    change: -1.85,
    changeAmount: '-0.0149',
    category: 'soft-commodities'
  }
])


const publicRealtimeTop = () => {
  _publicRealtimeTop({
    type: 'commodities',
  }).then(data => {
     futuresData.value = data || []
  }).catch((e) => {

  })
}

const getRealtimeByType = () => {
  _getRealtimeByType({
    type: 'commodities',
    pageNo: 1
  }).then(data => {
    if (data === null) {
      data = []
    }
    defaultListData.value = data
  })
}

const letMeGo = () => {
  emit('changeLetMego', () => {
    getRealtimeByType()
    publicRealtimeTop()
  })
}

onMounted(async () => {
  getRealtimeByType()
  publicRealtimeTop()
  letMeGo()
})

watch(() => props.tabActive, (val) => {
  console.log('watch etf', val)
  if (props.index === val) {
    letMeGo()
  }
})

// 分类定义
const categories = ref([
  { key: 'precious-metals', title: 'preciousMetals' },
  { key: 'industrial-metals', title: 'industrialMetals' },
  { key: 'energy', title: 'energy' },
  { key: 'soft-commodities', title: 'softCommodities' }
])


// 计算属性
const filteredFutures = computed(() => {
  // 根据当前选中的分类过滤数据
  let filtered = futuresData.value.filter(item => item.category === activeCategory.value)

  // 排序
  filtered.sort((a, b) => {
    let aValue, bValue
    if (sortField.value === 'latest') {
      aValue = parseFloat(a.price)
      bValue = parseFloat(b.price)
    } else if (sortField.value === 'change') {
      aValue = a.change
      bValue = b.change
    } else if (sortField.value === 'changeAmount') {
      aValue = parseFloat(a.changeAmount)
      bValue = parseFloat(b.changeAmount)
    }

    if (sortOrder.value === 'asc') {
      return aValue - bValue
    } else {
      return bValue - aValue
    }
  })

  return filtered
})

// 方法
const switchCategory = (categoryKey) => {
  activeCategory.value = categoryKey
}

const sortBy = (field) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'desc'
  }
}

const goToDetail = (item) => {
  // 跳转到期货详情页面
  router.push({
    name: 'FuturesDetail',
    params: { symbol: item.symbol }
  })
}

onMounted(() => {
  // 组件挂载后的初始化逻辑
})
</script>

<style lang="scss" scoped>
.futures-container {
  background: $mainBgColor;
  min-height: 100vh;
}


/* 分类筛选 */
.category-filters {
  display: flex;
  overflow-x: auto;
  padding: 12px 16px;
  background: $main2_background;
  border-bottom: 1px solid $border_color;
}

.filter-item {
  flex-shrink: 0;
  padding: 8px 16px;
  margin-right: 8px;
  background: $mainBgColor;
  border: 1px solid $border_color;
  border-radius: 16px;
  font-size: 13px;
  color: $text_color2;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-item.active {
  background: $red;
  color: $mainTextColor;
  border-color: $red;
}

/* 表格头部 */
.table-header {
  display: flex;
  background: $main2_background;
  padding: 12px 16px;
  border-bottom: 1px solid $border_color;
  font-size: 13px;
  color: $text_color2;
  font-weight: 500;
}

.header-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: color 0.3s;
}

.header-item:hover {
  color: $text_color;
}

.header-item.contract {
  flex: 2;
  justify-content: flex-start;
}

.header-item.latest {
  flex: 1;
  justify-content: center;
}

.header-item.change {
  flex: 1;
  justify-content: center;
}

.header-item.change-amount {
  flex: 1;
  justify-content: center;
}

.sort-icon {
  margin-left: 4px;
  font-size: 12px;
  opacity: 0.5;
  transition: opacity 0.3s;
}

.sort-icon.active {
  opacity: 1;
  color: $red;
}

/* 数据列表 */
.futures-list {
  background: $mainBgColor;
}

.futures-item {
  display: flex;
  padding: 16px;
  border-bottom: 1px solid $border_color;
  cursor: pointer;
  transition: background-color 0.3s;
}

.futures-item:hover {
  background-color: $main2_background;
}

.futures-item:last-child {
  border-bottom: none;
}

.contract-info {
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.contract-name {
  font-size: 15px;
  font-weight: 500;
  color: $text_color;
  margin-bottom: 2px;
}

.contract-symbol {
  font-size: 12px;
  color: $text_color3;
}

.price-info {
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.latest-price {
  flex: 1;
  text-align: center;
  font-size: 15px;
  font-weight: 500;
  color: $text_color;
}

.change-percent {
  flex: 1;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
}

.change-amount {
  flex: 1;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
}

.positive {
  color: $red;
}

.negative {
  color: $green;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: $text_color3;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 375px) {
  .nav-tabs {
    padding: 0 12px;
  }
  
  .tab-item {
    padding: 10px 12px;
    font-size: 13px;
  }
  
  .category-filters {
    padding: 10px 12px;
  }
  
  .filter-item {
    padding: 6px 12px;
    font-size: 12px;
  }
  
  .futures-item {
    padding: 12px;
  }
  
  .contract-name {
    font-size: 14px;
  }
  
  .latest-price {
    font-size: 14px;
  }
  
  .change-percent,
  .change-amount {
    font-size: 13px;
  }
}
</style>
