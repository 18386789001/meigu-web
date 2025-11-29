<template>
  <div class="rwa-container">
    <div class="rwa-wrapper">
      <main class="rwa-main">
        <div class="rwa-content">
          <div class="rwa-inner">
            <!-- 标题 -->
            <div class="rwa-header">
              <div class="header-title">
                <div class="title-text">
                  {{ $t("RWA") }}
                </div>
              </div>
            </div>

            <div class="content-box">
              <!-- Tab导航和搜索 -->
              <div class="tabs-wrapper">
                <div class="tabs-container">
                  <div
                    class="tab-item"
                    @click="changeCategoryTab(item)"
                    v-for="item in categoryList"
                    :key="item.code"
                    :class="{ 'tab-active': activeCategory == item.code }"
                  >
                    {{ getCategoryName(item) }}
                  </div>
                </div>
                <!-- 
                <div class="search-container">
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
                      :placeholder="$t('message.hangqing.sousuo')"
                      @input="handleSearch"
                      clearable
                      class="search-input"
                    />
                  </div>
                </div> -->
              </div>

              <!-- RWA 资产列表 -->
              <div class="content-view-box">
                <el-table
                  :data="displayList"
                  v-loading="loading"
                  style="width: 100%"
                  :header-cell-style="{
                    background: '#fafafa',
                    color: '#707a8a',
                    fontSize: '12px',
                    fontWeight: '500',
                  }"
                  :row-style="{ cursor: 'pointer' }"
                  @row-click="goAssetDetail"
                >
                  <!-- 名称列 -->
                  <el-table-column
                    :label="$t('message.hangqing.mingcheng')"
                    width="250"
                    align="center"
                  >
                    <template #default="{ row }">
                      <div class="name-cell">
                        <!-- 资产图标 -->
                        <el-image
                          v-if="row.icon"
                          :src="row.icon"
                          class="asset-img"
                        >
                          <template #error>
                            <div class="image-slot">
                              <div class="default-icon">
                                {{ row.name ? row.name.charAt(0) : "R" }}
                              </div>
                            </div>
                          </template>
                        </el-image>
                        <div v-else class="default-icon">
                          {{ row.name ? row.name.charAt(0) : "R" }}
                        </div>
                        <!-- 资产名称 -->
                        <div class="name-info">
                          <span class="asset-name">{{ row.name }}</span>
                          <span class="asset-code">{{ row.code }}</span>
                        </div>
                      </div>
                    </template>
                  </el-table-column>

                  <!-- 分类列 -->
                  <el-table-column
                    :label="$t('message.hangqing.fenlei')"
                    align="center"
                    width="150"
                  >
                    <template #default="{ row }">
                      <span>{{ row.categoryName || "-" }}</span>
                    </template>
                  </el-table-column>

                  <!-- 价格列 -->
                  <el-table-column
                    :label="$t('message.hangqing.jiage')"
                    align="center"
                  >
                    <template #default="{ row }">
                      <span class="price-text"
                        >${{ formatPrice(row.price) }}</span
                      >
                    </template>
                  </el-table-column>

                  <!-- 24H涨跌列 -->
                  <el-table-column
                    :label="$t('message.hangqing.24hzhangfu')"
                    align="center"
                  >
                    <template #default="{ row }">
                      <span
                        :class="getChangeClass(row.changePercent)"
                        class="change-text"
                      >
                        {{ formatChange(row.changePercent) }}
                      </span>
                    </template>
                  </el-table-column>

                  <!-- 24H交易量列 -->
                  <el-table-column
                    :label="$t('message.hangqing.24hjiaoyiliang')"
                    align="center"
                  >
                    <template #default="{ row }">
                      <span>{{ formatVolume(row.volume) }}</span>
                    </template>
                  </el-table-column>

                  <!-- 操作列 -->
                  <el-table-column label="" width="120" align="center">
                    <template #default="{ row }">
                      <el-button
                        type="primary"
                        size="small"
                        @click.stop="goAssetDetail(row)"
                        class="trade-button"
                      >
                        {{ $t("message.hangqing.jiaoyi") }}
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>

                <!-- 分页器 -->
                <div class="pagination-container" v-if="total > pageSize">
                  <el-pagination
                    v-model:current-page="currentPage"
                    :page-size="pageSize"
                    :total="total"
                    layout="prev, pager, next"
                    @current-change="handlePageChange"
                    background
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import rwaApi from "@/api/newApi/rwa.js";
import { fixData } from "@/utils/utils";

const router = useRouter();
const { t } = useI18n();

// 状态数据
const loading = ref(false);
const categoryList = ref([{ code: "all", name: "全部", enName: "All" }]);
const activeCategory = ref("all");
const assetList = ref([]);
const searchKeyword = ref("");
const currentPage = ref(1);
const pageSize = ref(20);
const controller = ref(null);
const refreshTimer = ref(null);

// 计算属性 - 总数
const total = computed(() => assetList.value.length);

// 计算属性 - 当前页显示的数据
const displayList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return assetList.value.slice(start, end);
});

// 获取分类名称（支持国际化）
const getCategoryName = (item) => {
  // 可以根据当前语言返回不同的名称
  return item.name || item.enName || item.code;
};

// 格式化价格
const formatPrice = (price) => {
  if (!price) return "0.00";
  const num = parseFloat(price);
  if (isNaN(num)) return "0.00";
  return num.toFixed(6);
};

// 格式化涨跌幅
const formatChange = (change) => {
  if (!change) return "0.00%";
  const num = parseFloat(change);
  if (isNaN(num)) return "0.00%";
  return (num > 0 ? "+" : "") + num.toFixed(2) + "%";
};

// 获取涨跌幅样式类
const getChangeClass = (change) => {
  const num = parseFloat(change);
  if (isNaN(num) || num === 0) return "";
  return num > 0 ? "green" : "red";
};

// 格式化交易量
const formatVolume = (volume) => {
  if (!volume) return "0";
  return fixData(volume);
};

// 获取 RWA 分类列表
const getRWACategories = async () => {
  try {
    const res = await rwaApi.getRWACategories({}, controller.value);
    if (res.success && res.data && res.data.categories) {
      // 添加"全部"选项
      categoryList.value = [
        { code: "all", name: t("message.hangqing.quanbu"), enName: "All" },
        ...res.data.categories,
      ];
    }
  } catch (error) {
    console.error("获取RWA分类失败:", error);
  }
};

// 获取 RWA 资产列表
const getRWAAssets = async () => {
  loading.value = true;
  try {
    const params = {};

    // 如果选择了分类，添加分类参数
    if (activeCategory.value && activeCategory.value !== "all") {
      params.categoryCode = activeCategory.value;
    }

    // 如果有搜索关键词，添加搜索参数
    if (searchKeyword.value) {
      params.keyword = searchKeyword.value;
    }

    const res = await rwaApi.getRWAQuotes(params, controller.value);
    if (res.success && res.data && res.data.tick_list) {
      // 转换数据格式以匹配页面显示
      assetList.value = res.data.tick_list.map((item) => ({
        code: item.code,
        name: item.name,
        icon: item.icon,
        categoryCode: item.categoryCode,
        categoryName: item.categoryName,
        price: item.price,
        changePercent: item.changeRatio,
        volume: item.volume,
        turnover: item.turnover,
      }));
    } else {
      assetList.value = [];
    }
  } catch (error) {
    console.error("获取RWA资产列表失败:", error);
    assetList.value = [];
  } finally {
    loading.value = false;
  }
};

// 切换分类
const changeCategoryTab = (category) => {
  if (activeCategory.value === category.code) return;
  activeCategory.value = category.code;
  currentPage.value = 1; // 重置页码
  getRWAAssets();
};

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1; // 重置页码
  getRWAAssets();
};

// 翻页 - 前端分页处理
const handlePageChange = (page) => {
  currentPage.value = page;
  window.scrollTo(0, 0);
};

// 跳转到资产详情（交易页面）
const goAssetDetail = (row) => {
  if (!row || !row.code) return;
  // 带上市场类型参数
  router.push({
    path: `/rwa/spot/${row.code}`,
    query: {
      marketType: row.categoryCode || "stocks",
    },
  });
};

// 定时刷新数据
const startRefresh = () => {
  refreshTimer.value = setInterval(() => {
    getRWAAssets();
  }, 5000); // 每5秒刷新一次
};

const stopRefresh = () => {
  if (refreshTimer.value) {
    clearInterval(refreshTimer.value);
    refreshTimer.value = null;
  }
};

// 生命周期
onMounted(() => {
  controller.value = new AbortController();
  getRWACategories();
  getRWAAssets();
  startRefresh();
  window.scrollTo(0, 0);
});

onUnmounted(() => {
  stopRefresh();
  if (controller.value) {
    controller.value.abort();
  }
});
</script>

<style scoped lang="scss">
.rwa-container {
  background-color: #fafafa;
  min-height: 100vh;
  padding-bottom: 40px;
}

.rwa-wrapper {
  width: 100%;
}

.rwa-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.rwa-content {
  width: 100%;
}

.rwa-inner {
  width: 100%;
}

.rwa-header {
  margin-bottom: 24px;
}

.header-title {
  display: flex;
  align-items: center;
}

.title-text {
  font-size: 28px;
  font-weight: 600;
  color: #1e2329;
}

.content-box {
  background: #ffffff;
  border-radius: 8px;
  padding: 24px;
}

.tabs-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.tabs-container {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tab-item {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #707a8a;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;

  &:hover {
    color: #1e2329;
    background: #f5f5f5;
  }

  &.tab-active {
    color: #fff;
    background: #1890ff;
  }
}

.search-container {
  flex-shrink: 0;
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon-prefix {
  position: absolute;
  left: 12px;
  z-index: 1;
  display: flex;
  align-items: center;
}

.search-icon {
  width: 16px;
  height: 16px;
  color: #707a8a;
}

:deep(.search-input) {
  width: 240px;

  .el-input__wrapper {
    padding-left: 36px;
  }
}

.content-view-box {
  width: 100%;
}

.name-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.asset-img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  flex-shrink: 0;
}

.default-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
}

.name-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.asset-name {
  font-size: 14px;
  font-weight: 500;
  color: #1e2329;
}

.asset-code {
  font-size: 12px;
  color: #707a8a;
}

.price-text {
  font-size: 14px;
  font-weight: 500;
  color: #1e2329;
}

.change-text {
  font-size: 14px;
  font-weight: 500;

  &.green {
    color: #0ecb81;
  }

  &.red {
    color: #f6465d;
  }
}

.trade-button {
  background: #1890ff;
  border-color: #1890ff;

  &:hover {
    background: #40a9ff;
    border-color: #40a9ff;
  }
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

:deep(.el-table) {
  .el-table__row {
    &:hover {
      background-color: #f5f7fa;
    }
  }
}
</style>
