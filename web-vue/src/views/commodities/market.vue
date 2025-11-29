<template>
  <div class="commodities-market-page">
    <div class="page-container">
      <main class="main-content">
        <div class="content-wrapper">
          <!-- 页面标题 -->
          <div class="page-header">
            <div class="header-title">
              <h1>大宗商品行情</h1>
            </div>
          </div>

          <!-- 分类Tab + 搜索区 -->
          <div class="market-tabs-wrapper">
            <div class="market-tabs">
              <div
                class="market-tab-item"
                v-for="category in categories"
                :key="category.code"
                :class="{ 'tab-active': activeCategory === category.code }"
                @click="handleCategoryChange(category.code)"
              >
                {{ category.name }}
              </div>
            </div>

            <div class="market-search">
              <div class="search-wrapper">
                <div class="search-icon-prefix">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    class="search-icon"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M11 6a5 5 0 110 10 5 5 0 010-10zm0-3a8 8 0 017.021 11.838l3.07 3.07-1.59 1.591-1.591 1.591-3.07-3.07A8 8 0 1111 3z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </div>
                <el-input
                  v-model="searchKeyword"
                  placeholder="搜索商品名称或符号"
                  clearable
                  @input="handleSearch"
                  class="search-input"
                />
              </div>
            </div>
          </div>

          <!-- 商品列表 -->
          <div class="content-view-box" style="width: 100%;">
            <el-table
              v-loading="loading"
              :data="filteredList"
              style="width: 100%"
              :header-cell-style="{
                background: '#fafafa',
                color: '#707a8a',
                fontSize: '12px',
                fontWeight: '500',
              }"
            >
              <!-- 商品符号列 -->
              <el-table-column
                :label="$t('message.hangqing.shangpin')"
                width="150"
                align="center"
              >
                <template #default="{ row }">
                  <div class="symbol-cell" style="justify-content: center;">
                    <span class="symbol-text">{{ row.symbol }}</span>
                  </div>
                </template>
              </el-table-column>

              <!-- 名称列 -->
              <el-table-column
                :label="$t('message.hangqing.mingcheng')"
                width="120"
                align="center"
              >
                <template #default="{ row }">
                  <span class="name-text">{{ row.name || getCommodityName(row.symbol) }}</span>
                </template>
              </el-table-column>

              <!-- 最新价列 -->
              <el-table-column
                :label="$t('message.hangqing.zuixinjia')"
                width="150"
                align="center"
                prop="close"
              >
                <template #default="{ row }">
                  <span class="price-text">{{ formatPrice(row.close) }}</span>
                </template>
              </el-table-column>

              <!-- 涨跌额列 -->
              <el-table-column
                :label="$t('message.hangqing.zhangdiee')"
                width="120"
                align="center"
              >
                <template #default="{ row }">
                  <span
                    class="change-text"
                    :class="row.change >= 0 ? 'text-up' : 'text-down'"
                  >
                    {{ row.change >= 0 ? '+' : '' }}{{ formatPrice(row.change) }}
                  </span>
                </template>
              </el-table-column>

              <!-- 涨跌幅列 -->
              <el-table-column
                :label="$t('message.hangqing.zhangdiefu')"
                width="120"
                align="center"
              >
                <template #default="{ row }">
                  <span
                    class="ratio-text"
                    :class="row.changeRatio >= 0 ? 'text-up' : 'text-down'"
                  >
                    {{ row.changeRatio >= 0 ? '+' : '' }}{{ row.changeRatio }}%
                  </span>
                </template>
              </el-table-column>

              <!-- 成交量列 -->
              <el-table-column
                :label="$t('message.hangqing.24hjiaoyiliang')"
                align="center"
              >
                <template #default="{ row }">
                  <span class="volume-text">{{ formatVolume(row.volume) }}</span>
                </template>
              </el-table-column>

              <!-- 操作列 -->
              <el-table-column
                :label="$t('message.home.caozuo')"
                width="120"
                align="center"
              >
                <template #default="{ row }">
                  <el-button
                    type="primary"
                    size="small"
                    @click="handleGoToKline(row)"
                  >
                    {{ $t('message.home.jiaoyi') }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <!-- 分页器 -->
            <div class="pagination-wrapper" v-if="total > pageSize">
              <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[10, 20, 50, 100]"
                :total="total"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handlePageChange"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import commoditiesApi from '@/api/commodities'

const router = useRouter()

// 数据状态
const loading = ref(false)
const commoditiesList = ref([])
const searchKeyword = ref('')
const activeCategory = ref('all')
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

// 分类配置 - 添加"全部"选项
const categories = ref([
  { code: 'all', name: 'All', items: [] },
  ...commoditiesApi.getCommodityCategories()
])

// 自动刷新定时器
let refreshTimer = null

// 获取商品名称
const getCommodityName = (symbol) => {
  return commoditiesApi.getCommodityName(symbol)
}

// 计算过滤后的列表
const filteredList = computed(() => {
  let list = commoditiesList.value

  // 按分类过滤
  if (activeCategory.value !== 'all') {
    const category = categories.value.find(c => c.code === activeCategory.value)
    if (category && category.items) {
      list = list.filter(item => category.items.includes(item.symbol))
    }
  }

  // 按搜索关键词过滤
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    list = list.filter(item => {
      const symbol = (item.symbol || '').toLowerCase()
      const name = (item.name || getCommodityName(item.symbol) || '').toLowerCase()
      return symbol.includes(keyword) || name.includes(keyword)
    })
  }

  return list
})

// 加载商品数据
const loadCommoditiesData = async () => {
  loading.value = true
  try {
    const res = await commoditiesApi.getCommoditiesRealtime(currentPage.value)
    if (res && res.data) {
      commoditiesList.value = res.data
      total.value =  res.data.length
    } else {
      commoditiesList.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('加载大宗商品数据失败:', error)
    commoditiesList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 处理分类切换
const handleCategoryChange = (categoryCode) => {
  activeCategory.value = categoryCode
  currentPage.value = 1
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
}

// 处理分页变化
const handlePageChange = (page) => {
  currentPage.value = page
  loadCommoditiesData()
}

// 处理每页条数变化
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  loadCommoditiesData()
}

// 点击按钮跳转到K线页面（合约交易）
const handleGoToKline = (row) => {
  router.push(`/commodities/constract/${row.symbol}`)
}

// 格式化价格
const formatPrice = (price) => {
  if (!price && price !== 0) return '--'
  const num = Number(price)
  if (isNaN(num)) return '--'
  return num.toFixed(2)
}

// 格式化成交量
const formatVolume = (volume) => {
  if (!volume) return '--'
  const num = Number(volume)
  if (isNaN(num)) return '--'

  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(2) + 'B'
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K'
  }
  return num.toFixed(0)
}

// 启动自动刷新
const startAutoRefresh = () => {
  refreshTimer = setInterval(() => {
    loadCommoditiesData()
  }, 10000) // 每10秒刷新一次
}

// 停止自动刷新
const stopAutoRefresh = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
}

// 生命周期
onMounted(() => {
  loadCommoditiesData()
  startAutoRefresh()
})

onUnmounted(() => {
  stopAutoRefresh()
})
</script>

<style scoped lang="scss">
.commodities-market-page {
  background-color: #fafafa;
  min-height: 100vh;
  padding: 20px;

  .page-container {
    max-width: 1400px;
    margin: 0 auto;
  }

  .main-content {
    background: #fff;
    border-radius: 8px;
    padding: 24px;
  }

  .content-wrapper {
    width: 100%;
  }

  // 页面标题
  .page-header {
    margin-bottom: 24px;

    .header-title h1 {
      font-size: 24px;
      font-weight: 600;
      color: #1e2329;
      margin: 0;
    }
  }

  // Tab和搜索区域
  .market-tabs-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #eaecef;

    .market-tabs {
      display: flex;
      gap: 24px;

      .market-tab-item {
        padding: 8px 16px;
        font-size: 14px;
        color: #707a8a;
        cursor: pointer;
        transition: all 0.3s;
        border-radius: 4px;

        &:hover {
          color: #1e2329;
          background-color: #f5f5f5;
        }

        &.tab-active {
          color: #1e2329;
          font-weight: 600;
          background-color: #fcd535;
        }
      }
    }

    .market-search {
      .search-wrapper {
        position: relative;
        display: flex;
        align-items: center;

        .search-icon-prefix {
          position: absolute;
          left: 12px;
          z-index: 1;
          display: flex;
          align-items: center;

          .search-icon {
            width: 16px;
            height: 16px;
            color: #707a8a;
          }
        }

        .search-input {
          width: 280px;

          :deep(.el-input__inner) {
            padding-left: 36px;
          }
        }
      }
    }
  }

  // 表格区域
  .content-view-box {
    .symbol-cell {
      display: flex;
      align-items: center;

      .symbol-text {
        font-size: 14px;
        font-weight: 600;
        color: #1e2329;
      }
    }

    .name-text {
      font-size: 14px;
      color: #707a8a;
    }

    .price-text {
      font-size: 14px;
      font-weight: 500;
      color: #1e2329;
    }

    .change-text,
    .ratio-text {
      font-size: 14px;
      font-weight: 500;

      &.text-up {
        color: #0ecb81;
      }

      &.text-down {
        color: #f6465d;
      }
    }

    .volume-text {
      font-size: 14px;
      color: #707a8a;
    }

    // 分页器
    .pagination-wrapper {
      margin-top: 24px;
      display: flex;
      justify-content: flex-end;
    }
  }

  // Element Plus 表格样式覆盖
  :deep(.el-table) {
    .el-table__row {
      &:hover {
        background-color: #f5f5f5;
      }
    }
  }
}
</style>
