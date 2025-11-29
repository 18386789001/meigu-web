<template>
  <div class="new-home">
    111
    <!-- 顶部导航 -->
    <!-- <Header /> -->
    <!-- Hero 区域 -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <!-- 主标题 -->
          <h1 class="hero-title">
            One Touch To<br />
            <span class="highlight">Crypto</span>
          </h1>

          <!-- 副标题 -->
          <div class="hero-subtitle">
            <el-icon class="gift-icon"><Gift /></el-icon>
            <span>Register now and get $100 bonus</span>
          </div>

          <!-- 注册表单 -->
          <div class="hero-form">
            <el-input
              v-model="email"
              placeholder="Enter your email"
              class="email-input"
              size="large"
              @keyup.enter="handleRegister"
            >
              <template #prefix>
                <el-icon><Message /></el-icon>
              </template>
            </el-input>
            <el-button
              class="btn-start"
              size="large"
              :loading="loading"
              @click="handleRegister"
            >
              Start Now
            </el-button>
          </div>

          <!-- 下载图标 -->
          <div class="download-icons">
            <a
              v-for="platform in platforms"
              :key="platform.name"
              :href="platform.url"
              target="_blank"
              class="platform-link"
              :title="platform.name"
            >
              <div class="icon-wrapper">
                <el-icon><component :is="platform.icon" /></el-icon>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- 实时行情滚动条 -->
    <div class="ticker-bar">
      <div class="ticker-track" ref="tickerTrack">
        <!-- 第一组数据 -->
        <div class="ticker-list">
          <div
            v-for="(item, index) in tickerData"
            :key="`first-${index}`"
            class="ticker-item"
            @click="goToTrade(item)"
          >
            <span class="pair">{{ item.symbol }}</span>
            <span class="price">{{ formatPrice(item.price) }}</span>
            <span
              class="percent-badge"
              :class="item.changePercent >= 0 ? 'positive' : 'negative'"
            >
              <span class="arrow">{{
                item.changePercent >= 0 ? "▲" : "▼"
              }}</span>
              <span class="value"
                >{{
                  (item.changePercent >= 0 ? "+" : "") +
                  item.changePercent.toFixed(2)
                }}%</span
              >
            </span>
          </div>
        </div>
        <!-- 第二组数据（用于无缝滚动） -->
        <div class="ticker-list">
          <div
            v-for="(item, index) in tickerData"
            :key="`second-${index}`"
            class="ticker-item"
            @click="goToTrade(item)"
          >
            <span class="pair">{{ item.symbol }}</span>
            <span class="price">{{ formatPrice(item.price) }}</span>
            <span
              class="percent-badge"
              :class="item.changePercent >= 0 ? 'positive' : 'negative'"
            >
              <span class="arrow">{{
                item.changePercent >= 0 ? "▲" : "▼"
              }}</span>
              <span class="value"
                >{{
                  (item.changePercent >= 0 ? "+" : "") +
                  item.changePercent.toFixed(2)
                }}%</span
              >
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 市场行情 -->
    <section class="markets-section">
      <div class="container">
        <h2 class="section-title">Markets</h2>

        <!-- Tab 切换 -->
        <el-tabs
          v-model="activeTab"
          @tab-click="handleTabChange"
          class="markets-tabs"
        >
          <el-tab-pane label="Top Gainers" name="gainers"></el-tab-pane>
          <el-tab-pane label="Hot" name="hot"></el-tab-pane>
          <el-tab-pane label="Labs" name="labs"></el-tab-pane>
        </el-tabs>

        <div class="markets-content" v-loading="marketLoading">
          <!-- 行情表格 -->
          <el-table
            :data="marketData"
            class="market-table"
            @row-click="goToTrade"
          >
            <el-table-column label="Pair" width="200">
              <template #default="{ row }">
                <div class="pair-cell">
                  <div class="coin-icon">
                    <div class="coin-placeholder">
                      {{ row.symbol?.substring(0, 1) || "?" }}
                    </div>
                  </div>
                  <div class="pair-info">
                    <span class="pair-name">{{ row.symbol }}</span>
                    <el-tag v-if="row.tag" size="small" type="warning">{{
                      row.tag
                    }}</el-tag>
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="Price" prop="price" align="right">
              <template #default="{ row }">
                <span class="price-value">{{
                  formatMarketPrice(row.price)
                }}</span>
              </template>
            </el-table-column>

            <el-table-column label="24h Change" width="150" align="right">
              <template #default="{ row }">
                <span
                  class="percent-badge"
                  :class="row.changePercent >= 0 ? 'positive' : 'negative'"
                >
                  <span class="arrow">{{
                    row.changePercent >= 0 ? "▲" : "▼"
                  }}</span>
                  <span class="value"
                    >{{
                      (row.changePercent >= 0 ? "+" : "") +
                      row.changePercent.toFixed(2)
                    }}%</span
                  >
                </span>
              </template>
            </el-table-column>

            <el-table-column label="24h Volume" prop="volume" align="right">
              <template #default="{ row }">
                <span class="volume-value">{{ formatVolume(row.volume) }}</span>
              </template>
            </el-table-column>

            <el-table-column label="Action" width="120" align="center">
              <template #default="{ row }">
                <el-button
                  size="small"
                  class="trade-btn"
                  @click.stop="goToTrade(row)"
                >
                  Trade
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 查看更多 -->
          <div class="view-more-section">
            <el-button class="btn-view-more" @click="viewAllMarkets">
              View All Markets
              <el-icon><ArrowRight /></el-icon>
            </el-button>
          </div>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <!-- <Footer /> -->
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { Gift, Message, ArrowRight } from "@element-plus/icons-vue";
// import Header from "@/views/_new/components/layout/Header.vue";
// import Footer from "@/views/_new/components/layout/Footer.vue";

const router = useRouter();

// Hero Section 数据
const email = ref("");
const loading = ref(false);
const platforms = ref([
  {
    name: "Apple App Store",
    url: "https://apps.apple.com/app/coinstore",
    icon: "Apple",
  },
  {
    name: "Google Play",
    url: "https://play.google.com/store/apps/details?id=com.coinstore",
    icon: "Platform",
  },
  {
    name: "APK Direct",
    url: "https://coinstore.com/download",
    icon: "Download",
  },
]);

// Ticker Bar 数据
const tickerTrack = ref(null);
const tickerData = ref([
  { symbol: "BTC/USDT", price: 31115.98, changePercent: -10.77 },
  { symbol: "ASTER/USDT", price: 1.0261, changePercent: -8.38 },
  { symbol: "ANOA/USDT", price: 262.22835, changePercent: 0.54 },
  { symbol: "CST/USDT", price: 865.68998, changePercent: -4.11 },
  { symbol: "USDC/USDT", price: 1.00035, changePercent: 0.02 },
  { symbol: "FTC/USDT", price: 0.1098, changePercent: -0.09 },
  { symbol: "BBFT/USDT", price: 0.0007496, changePercent: -5.66 },
  { symbol: "ETH/USDT", price: 1845.32, changePercent: 2.35 },
  { symbol: "BNB/USDT", price: 312.45, changePercent: 1.24 },
  { symbol: "SOL/USDT", price: 22.67, changePercent: -3.12 },
]);
let animationId = null;

// Markets 数据
const activeTab = ref("gainers");
const marketData = ref([]);
const marketLoading = ref(false);

const mockMarketData = {
  gainers: [
    {
      id: 1,
      symbol: "BTC/USDT",
      price: 45230.5,
      changePercent: 5.23,
      volume: 1250000000,
      tag: "Hot",
    },
    {
      id: 2,
      symbol: "ETH/USDT",
      price: 2845.3,
      changePercent: 3.45,
      volume: 850000000,
    },
    {
      id: 3,
      symbol: "SOL/USDT",
      price: 102.45,
      changePercent: 8.91,
      volume: 320000000,
      tag: "New",
    },
    {
      id: 4,
      symbol: "BNB/USDT",
      price: 312.6,
      changePercent: 2.15,
      volume: 450000000,
    },
    {
      id: 5,
      symbol: "XRP/USDT",
      price: 0.5234,
      changePercent: 1.89,
      volume: 280000000,
    },
  ],
  hot: [
    {
      id: 6,
      symbol: "DOGE/USDT",
      price: 0.0845,
      changePercent: -2.34,
      volume: 180000000,
      tag: "Hot",
    },
    {
      id: 7,
      symbol: "ADA/USDT",
      price: 0.4523,
      changePercent: 1.23,
      volume: 220000000,
    },
    {
      id: 8,
      symbol: "MATIC/USDT",
      price: 0.8234,
      changePercent: 4.56,
      volume: 190000000,
    },
  ],
  labs: [
    {
      id: 9,
      symbol: "NOVA/USDT",
      price: 1.2345,
      changePercent: 15.67,
      volume: 50000000,
      tag: "New",
    },
    {
      id: 10,
      symbol: "STAR/USDT",
      price: 0.0234,
      changePercent: 23.45,
      volume: 30000000,
      tag: "New",
    },
  ],
};

// Hero Section 方法
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const handleRegister = async () => {
  if (!email.value) {
    ElMessage.warning("Please enter your email");
    return;
  }

  if (!validateEmail(email.value)) {
    ElMessage.error("Please enter a valid email");
    return;
  }

  loading.value = true;

  try {
    // TODO: 调用注册 API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 跳转到注册页面
    router.push({
      path: "/register",
      query: { email: email.value },
    });
  } catch (error) {
    ElMessage.error("Registration failed");
    console.error("Registration error:", error);
  } finally {
    loading.value = false;
  }
};

// Ticker Bar 方法
const formatPrice = (price) => {
  if (price >= 1) {
    return price.toFixed(2);
  } else if (price >= 0.01) {
    return price.toFixed(4);
  } else {
    return price.toFixed(6);
  }
};

const startAnimation = () => {
  if (!tickerTrack.value) return;

  const track = tickerTrack.value;
  const firstList = track.querySelector(".ticker-list");

  if (!firstList) return;

  const listWidth = firstList.offsetWidth;
  let translateX = 0;
  const speed = 0.5;

  const animate = () => {
    translateX -= speed;

    if (Math.abs(translateX) >= listWidth) {
      translateX = 0;
    }

    track.style.transform = `translateX(${translateX}px)`;
    animationId = requestAnimationFrame(animate);
  };

  animationId = requestAnimationFrame(animate);
};

// Markets 方法
const fetchMarketData = async (type) => {
  marketLoading.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 300));
    marketData.value = mockMarketData[type] || [];
  } catch (error) {
    console.error("Failed to fetch market data:", error);
    marketData.value = mockMarketData[type] || [];
  } finally {
    marketLoading.value = false;
  }
};

const formatMarketPrice = (price) => {
  if (price >= 1)
    return price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
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

const goToTrade = (item) => {
  const symbol = item.symbol.replace("/", "_");
  router.push(`/trade/${symbol}`);
};

const viewAllMarkets = () => {
  router.push("/market");
};

onMounted(() => {
  document.title = "Coinstore - One Touch To Crypto";

  // 启动行情滚动动画
  setTimeout(() => {
    startAnimation();
  }, 100);

  // 加载市场数据
  fetchMarketData("gainers");
});

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
});
</script>

<style lang="scss" scoped>
@import "./styles/common.scss";

.new-home {
  min-height: 100vh;
  background: $bg-white;
}

// ========================================
// Hero Section
// ========================================
.hero-section {
  background: $bg-hero;
  padding: $spacing-5xl 0;
  min-height: calc(100vh - $header-height);
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;

  @media (max-width: $breakpoint-md) {
    padding: $spacing-4xl 0;
    min-height: auto;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 50%;
    height: 100%;
    background: radial-gradient(
      circle at top right,
      rgba($primary-color, 0.05) 0%,
      transparent 70%
    );
    pointer-events: none;
  }

  .container {
    position: relative;
    z-index: 1;
  }

  .hero-content {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
  }

  .hero-title {
    font-size: $font-size-7xl;
    font-weight: $font-weight-bold;
    color: $color-black;
    line-height: 1.1;
    margin-bottom: $spacing-xl;

    @media (max-width: $breakpoint-lg) {
      font-size: $font-size-6xl;
    }

    @media (max-width: $breakpoint-md) {
      font-size: $font-size-5xl;
    }

    @media (max-width: $breakpoint-sm) {
      font-size: $font-size-4xl;
    }

    .highlight {
      color: $primary-color;
      background: linear-gradient(
        135deg,
        $primary-color 0%,
        $primary-dark 100%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  .hero-subtitle {
    display: inline-flex;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-sm $spacing-lg;
    background: rgba($primary-color, 0.1);
    border-radius: $radius-full;
    font-size: $font-size-lg;
    font-weight: $font-weight-medium;
    color: $color-text-primary;
    margin-bottom: $spacing-3xl;

    @media (max-width: $breakpoint-sm) {
      font-size: $font-size-base;
      padding: $spacing-xs $spacing-md;
    }

    .gift-icon {
      font-size: 24px;
      color: $primary-color;
    }
  }

  .hero-form {
    display: flex;
    gap: $spacing-md;
    max-width: 600px;
    margin: 0 auto $spacing-2xl;

    @media (max-width: $breakpoint-sm) {
      flex-direction: column;
    }

    .email-input {
      flex: 1;

      :deep(.el-input__wrapper) {
        background: $bg-white;
        border-radius: $radius-md;
        padding: $spacing-md $spacing-lg;
        box-shadow: $shadow-sm;
        transition: all $transition-base;

        &:hover,
        &.is-focus {
          box-shadow: $shadow-md;
        }
      }

      :deep(.el-input__inner) {
        font-size: $font-size-base;
      }
    }

    .btn-start {
      background: $color-black;
      color: $color-white;
      border: none;
      border-radius: $radius-md;
      padding: 0 $spacing-3xl;
      font-size: $font-size-lg;
      font-weight: $font-weight-semibold;
      white-space: nowrap;
      transition: all $transition-base;

      &:hover {
        background: #333;
        transform: translateY(-2px);
        box-shadow: $shadow-lg;
      }

      &:active {
        transform: translateY(0);
      }

      @media (max-width: $breakpoint-sm) {
        width: 100%;
        padding: $spacing-md $spacing-xl;
      }
    }
  }

  .download-icons {
    display: flex;
    justify-content: center;
    gap: $spacing-lg;
    flex-wrap: wrap;

    .platform-link {
      text-decoration: none;
      transition: transform $transition-base;

      &:hover {
        transform: translateY(-4px);

        .icon-wrapper {
          background: $primary-color;
          color: $color-white;
        }
      }

      .icon-wrapper {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: $bg-white;
        box-shadow: $shadow-md;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all $transition-base;

        @media (max-width: $breakpoint-sm) {
          width: 48px;
          height: 48px;
        }

        .el-icon {
          font-size: 28px;
          color: $color-text-primary;

          @media (max-width: $breakpoint-sm) {
            font-size: 24px;
          }
        }
      }
    }
  }
}

// ========================================
// Ticker Bar
// ========================================
.ticker-bar {
  width: 100%;
  background: $bg-white;
  border-top: 1px solid $color-divider;
  border-bottom: 1px solid $color-divider;
  overflow: hidden;
  padding: $spacing-sm 0;

  .ticker-track {
    display: flex;
    width: fit-content;
    will-change: transform;
  }

  .ticker-list {
    display: flex;
    gap: $spacing-3xl;
    padding: 0 $spacing-xl;
    white-space: nowrap;
  }

  .ticker-item {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    cursor: pointer;
    padding: $spacing-xs $spacing-sm;
    border-radius: $radius-xs;
    transition: background $transition-fast;

    &:hover {
      background: $bg-light;
    }

    .pair {
      font-size: $font-size-sm;
      font-weight: $font-weight-semibold;
      color: $color-text-primary;
      min-width: 100px;
    }

    .price {
      font-size: $font-size-sm;
      font-weight: $font-weight-medium;
      color: $color-text-primary;
      min-width: 80px;
      text-align: right;
    }
  }
}

// ========================================
// Markets Section
// ========================================
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

      .coin-icon {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        overflow: hidden;
        background: $bg-light;
        flex-shrink: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;

        .coin-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: $font-weight-semibold;
          font-size: 12px;
          color: $color-text-secondary;
          background: $bg-gray;
        }
      }

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

// ========================================
// Percent Badge (内联样式)
// ========================================
.percent-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: $radius-xs;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  white-space: nowrap;

  &.positive {
    color: $color-up;
    background: $color-up-light;

    .arrow {
      color: $color-up;
    }
  }

  &.negative {
    color: $color-down;
    background: $color-down-light;

    .arrow {
      color: $color-down;
    }
  }

  .arrow {
    font-size: 10px;
    line-height: 1;
  }

  .value {
    line-height: 1;
  }
}
</style>
