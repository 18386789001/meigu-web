<template>
  <section class="markets-section">
    <div class="container">
      <h2 class="section-title">{{ $t('newHome.markets.title') }}</h2>

      <!-- Tab 切换 -->
      <el-tabs v-model="activeTab" @tab-click="handleTabChange" class="markets-tabs">
        <el-tab-pane :label="$t('newHome.markets.gainers')" name="gainers"></el-tab-pane>
        <el-tab-pane :label="$t('newHome.markets.hot')" name="hot"></el-tab-pane>
        <el-tab-pane :label="$t('newHome.markets.labs')" name="labs"></el-tab-pane>
      </el-tabs>

      <div class="markets-content" v-loading="loading">
        <!-- 行情表格 -->
        <el-table :data="marketData" class="market-table" @row-click="goToTrade">
          <el-table-column :label="$t('newHome.markets.pair')" width="200">
            <template #default="{ row }">
              <div class="pair-cell">
                <CoinIcon :symbol="row.symbol" :src="row.icon" size="sm" />
                <div class="pair-info">
                  <span class="pair-name">{{ row.symbol }}</span>
                  <el-tag v-if="row.tag" size="small" type="warning">{{ row.tag }}</el-tag>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column :label="$t('newHome.markets.price')" prop="price" align="right">
            <template #default="{ row }">
              <span class="price-value">{{ formatPrice(row.price) }}</span>
            </template>
          </el-table-column>

          <el-table-column :label="$t('newHome.markets.change24h')" width="150" align="right">
            <template #default="{ row }">
              <PercentBadge :value="row.changePercent" />
            </template>
          </el-table-column>

          <el-table-column :label="$t('newHome.markets.volume24h')" prop="volume" align="right">
            <template #default="{ row }">
              <span class="volume-value">{{ formatVolume(row.volume) }}</span>
            </template>
          </el-table-column>

          <el-table-column :label="$t('common.action')" width="120" align="center">
            <template #default="{ row }">
              <el-button size="small" class="trade-btn" @click.stop="goToTrade(row)">
                {{ $t('common.trade') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 查看更多 -->
        <div class="view-more-section">
          <el-button class="btn-view-more" @click="viewAllMarkets">
            {{ $t('newHome.markets.viewAll') }}
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowRight } from '@element-plus/icons-vue';
import CoinIcon from '@/views/_new/components/common/CoinIcon.vue';
import PercentBadge from '@/views/_new/components/common/PercentBadge.vue';

const router = useRouter();
const activeTab = ref('gainers');
const marketData = ref([]);
const loading = ref(false);

const mockMarketData = {
  gainers: [
    { id: 1, symbol: 'BTC/USDT', icon: '', price: 45230.50, changePercent: 5.23, volume: 1250000000, tag: 'Hot' },
    { id: 2, symbol: 'ETH/USDT', icon: '', price: 2845.30, changePercent: 3.45, volume: 850000000 },
    { id: 3, symbol: 'SOL/USDT', icon: '', price: 102.45, changePercent: 8.91, volume: 320000000, tag: 'New' },
    { id: 4, symbol: 'BNB/USDT', icon: '', price: 312.60, changePercent: 2.15, volume: 450000000 },
    { id: 5, symbol: 'XRP/USDT', icon: '', price: 0.5234, changePercent: 1.89, volume: 280000000 },
  ],
  hot: [
    { id: 6, symbol: 'DOGE/USDT', icon: '', price: 0.0845, changePercent: -2.34, volume: 180000000, tag: 'Hot' },
    { id: 7, symbol: 'ADA/USDT', icon: '', price: 0.4523, changePercent: 1.23, volume: 220000000 },
  ],
  labs: [
    { id: 8, symbol: 'NOVA/USDT', icon: '', price: 1.2345, changePercent: 15.67, volume: 50000000, tag: 'New' },
  ]
};

const fetchMarketData = async (type) => {
  loading.value = true;
  try {
    // TODO: 替换为实际 API 调用
    await new Promise(resolve => setTimeout(resolve, 300));
    marketData.value = mockMarketData[type] || [];
  } catch (error) {
    console.error('Failed to fetch market data:', error);
    marketData.value = mockMarketData[type] || [];
  } finally {
    loading.value = false;
  }
};

const formatPrice = (price) => {
  if (price >= 1) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return price.toFixed(6);
};

const formatVolume = (volume) => {
  if (volume >= 1000000000) return `$${(volume / 1000000000).toFixed(2)}B`;
  if (volume >= 1000000) return `$${(volume / 1000000).toFixed(2)}M`;
  return `$${(volume / 1000).toFixed(2)}K`;
};

const handleTabChange = (tab) => {
  fetchMarketData(tab.props.name);
};

const goToTrade = (row) => {
  const symbol = row.symbol.replace('/', '_');
  router.push(`/trade/${symbol}`);
};

const viewAllMarkets = () => {
  router.push('/market');
};

onMounted(() => {
  fetchMarketData('gainers');
});
</script>

<style lang="scss" scoped>
@import '@/views/_new/home/styles/variables.scss';

.markets-section {
  padding: $spacing-4xl 0;
  background: $bg-white;

  @media (max-width: $breakpoint-md) {
    padding: $spacing-3xl 0;
  }

  .section-title {
    text-align: center;
    margin-bottom: $spacing-2xl;
  }

  .markets-tabs {
    margin-bottom: $spacing-xl;

    :deep(.el-tabs__nav-wrap::after) {
      display: none;
    }

    :deep(.el-tabs__header) {
      margin: 0 0 $spacing-xl 0;
      justify-content: center;
    }

    :deep(.el-tabs__item) {
      font-size: $font-size-lg;
      font-weight: $font-weight-medium;

      &.is-active {
        color: $primary-color;
      }
    }

    :deep(.el-tabs__active-bar) {
      background-color: $primary-color;
    }
  }

  .market-table {
    :deep(.el-table__header) {
      th {
        background: $bg-light;
        color: $color-text-secondary;
        font-weight: $font-weight-semibold;
      }
    }

    :deep(.el-table__row) {
      cursor: pointer;

      &:hover {
        background: $bg-light;
      }
    }

    .pair-cell {
      display: flex;
      align-items: center;
      gap: $spacing-sm;

      .pair-info {
        display: flex;
        align-items: center;
        gap: $spacing-xs;

        .pair-name {
          font-weight: $font-weight-semibold;
        }
      }
    }

    .price-value {
      font-weight: $font-weight-medium;
      color: $color-text-primary;
    }

    .volume-value {
      color: $color-text-secondary;
      font-size: $font-size-sm;
    }

    .trade-btn {
      background: $color-black;
      color: $color-white;
      border: none;

      &:hover {
        background: #333;
      }
    }
  }

  .view-more-section {
    text-align: center;
    margin-top: $spacing-2xl;

    .btn-view-more {
      padding: 12px 32px;
      border: 2px solid $color-border;
      background: transparent;
      color: $color-text-primary;
      font-weight: $font-weight-semibold;

      &:hover {
        border-color: $primary-color;
        color: $primary-color;
      }

      .el-icon {
        margin-left: 8px;
      }
    }
  }
}
</style>
