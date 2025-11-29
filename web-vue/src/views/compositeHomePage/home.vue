<template>
  <div class="msx-home">
    <!-- Header is handled by App.vue / layout -->
    <pc-header class="fix-header"></pc-header>

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          Decentralized<br />
          RWA Trading
        </h1>
        <p class="hero-subtitle">
          Real Value On-Chain from Wall Street to Your Wallet
        </p>

        <div class="hero-actions">
          <button class="trade-btn" @click="handleTrade">
            <el-icon class="btn-icon">
              <Plus />
            </el-icon>
            Trade Now
          </button>
        </div>

        <!-- Stats Grid -->
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">${{ displayStats.vol.toFixed(2) }}B</div>
            <div class="stat-label">24h Vol</div>
          </div>

          <div class="stat-item center-stat">
            <div class="stat-value">${{ displayStats.total.toFixed(2) }}B</div>
            <div class="stat-label">Total RWA Trading Volume</div>
          </div>

          <div class="stat-item center-stat">
            <div class="stat-value">{{ Math.round(displayStats.tokens) }}+</div>
            <div class="stat-label">RWA Tokens</div>
          </div>

          <div class="stat-item">
            <div class="stat-chart-line">
              <!-- Simple SVG Line Chart Placeholder -->
              <svg width="100%" height="40" viewBox="0 0 100 40">
                <path d="M0,30 L20,10 L40,25 L60,5 L80,20 L100,10" fill="none" stroke="#4caf50" stroke-width="2" />
              </svg>
            </div>
            <div class="stat-value">{{ displayStats.users.toFixed(1) }}K</div>
            <div class="stat-label">Users</div>
          </div>
        </div>

        <!-- Banner Carousel -->
        <div class="banner-carousel">
          <button class="nav-btn prev-btn" @click="rotateBanner('left')">
            <el-icon>
              <ArrowLeft />
            </el-icon>
          </button>

          <div class="banner-track" ref="bannerTrack">
            <div class="banner-wrapper" :style="{ transform: `translateX(${translateX}px)` }">
              <div v-for="banner in allBanners" :key="banner.id" class="banner-card">
                <div class="banner-text">
                  <h3>{{ banner.title }}</h3>
                  <p>{{ banner.desc }}</p>
                </div>
                <div class="banner-img">
                  <img :src="banner.image" :alt="banner.title" />
                </div>
              </div>
            </div>
          </div>

          <button class="nav-btn next-btn" @click="rotateBanner('right')">
            <el-icon>
              <ArrowRight />
            </el-icon>
          </button>
        </div>

        <!-- All RWA Section -->
        <section class="all-rwa-section">
          <div class="section-header">
            <h2 class="section-title">All RWA</h2>
            <p class="section-subtitle">Trade up to 233 RWA & 78 contracts</p>
          </div>

          <div class="ranking-grid">
            <!-- Left Panel: Hot Contracts / Hot RWA -->
            <div class="ranking-panel">
              <div class="panel-tabs">
                <button :class="['tab-btn', { active: activeLeftTab === 'contracts' }]"
                  @click="switchLeftTab('contracts')">
                  Hot Contracts
                </button>
                <button :class="['tab-btn', { active: activeLeftTab === 'rwa' }]" @click="switchLeftTab('rwa')">
                  Hot RWA
                </button>
                <button class="more-btn" @click="handleMore">More ›</button>
              </div>

              <div class="ranking-list">
                <div v-for="(item, index) in currentLeftList" :key="item.id"
                  :class="['ranking-item', { 'item-appear': item.visible }]"
                  :style="{ animationDelay: `${index * 0.1}s` }">
                  <!-- <div class="rank-number">{{ index + 1 }}</div> -->
                  <img :src="item.icon" :alt="item.symbol" class="token-icon" />
                  <div class="token-info">
                    <div class="token-symbol">{{ item.symbol }}</div>
                    <div class="token-name">{{ item.name }}</div>
                  </div>
                  <div class="token-price">${{ item.price }}</div>
                  <div :class="['token-change', item.change >= 0 ? 'positive' : 'negative']">
                    {{ item.change >= 0 ? '+' : '' }}{{ item.change }}%
                  </div>
                  <div class="token-chart">
                    <div v-if="item.chart === 'line-chart'" class="line-chart">
                      <svg width="100%" height="100%" viewBox="0 0 100 40">
                        <!-- 定义渐变色 -->
                        <defs>
                          <!-- 向下荧光渐变 -->
                          <linearGradient :id="`glowGradient_${item.id}`" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" :style="`stop-color:${item.change >= 0 ? '#4caf50' : '#f44336'};stop-opacity:0.5`" />
                            <stop offset="30%" :style="`stop-color:${item.change >= 0 ? '#4caf50' : '#f44336'};stop-opacity:0.2`" />
                            <stop offset="100%" :style="`stop-color:${item.change >= 0 ? '#4caf50' : '#f44336'};stop-opacity:0`" />
                          </linearGradient>
                          <!-- 线条渐变 -->
                          <linearGradient :id="`lineGradient_${item.id}`" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" :style="`stop-color:${item.change >= 0 ? '#4caf50' : '#f44336'};stop-opacity:1`" />
                            <stop offset="50%" :style="`stop-color:${item.change >= 0 ? '#4caf50' : '#f44336'};stop-opacity:1`" />
                            <stop offset="100%" :style="`stop-color:${item.change >= 0 ? '#4caf50' : '#f44336'};stop-opacity:1`" />
                          </linearGradient>
                        </defs>
                        <!-- 绘制向下荧光填充区域 -->
                        <path
                          :d="getAreaPath(item.chartData)"
                          :fill="`url(#glowGradient_${item.id})`"
                          stroke="none"
                        />
                        <!-- 绘制折线 -->
                        <polyline
                          :points="getLinePoints(item.chartData)"
                          fill="none"
                          :stroke="`url(#lineGradient_${item.id})`"
                          stroke-width="1"
                          stroke-linejoin="round"
                          stroke-linecap="round"
                        />
                      </svg>
                    </div>
                    <img v-else :src="item.chart" :alt="'chart'" class="chart-img" />
                  </div>
                </div>
              </div>

              <div class="pagination-dots">
                <span v-for="page in 3" :key="page" :class="['dot', { active: currentLeftPage === page }]"
                  @click="changeLeftPage(page)"></span>
              </div>
            </div>

            <!-- Right Top Panel: Contract Rising List / RWA Rising List -->
            <div class="ranking-panel">
              <div class="panel-tabs">
                <button :class="['tab-btn', { active: activeRightTopTab === 'contracts' }]"
                  @click="switchRightTopTab('contracts')">
                  Contract Rising List
                </button>
                <button :class="['tab-btn', { active: activeRightTopTab === 'rwa' }]" @click="switchRightTopTab('rwa')">
                  RWA Rising List
                </button>
                <button class="more-btn" @click="handleMore">More ›</button>
              </div>

              <div class="ranking-list compact">
                <div v-for="(item, index) in currentRightTopList" :key="item.id"
                  :class="['ranking-item', { 'item-appear': item.visible }]"
                  :style="{ animationDelay: `${index * 0.1}s` }">
                  <!-- <div class="rank-number">{{ index + 1 }}</div> -->
                  <img :src="item.icon" :alt="item.symbol" class="token-icon" />
                  <div class="token-info">
                    <div class="token-symbol">{{ item.symbol }}</div>
                    <div class="token-name">{{ item.name }}</div>
                  </div>
                  <div class="token-price">${{ item.price }}</div>
                  <div :class="['token-change', item.change >= 0 ? 'positive' : 'negative']">
                    {{ item.change >= 0 ? '+' : '' }}{{ item.change }}%
                  </div>
                </div>
              </div>

              <div class="pagination-dots">
                <span v-for="page in 3" :key="page" :class="['dot', { active: currentRightTopPage === page }]"
                  @click="changeRightTopPage(page)"></span>
              </div>
            </div>

            <!-- Right Bottom Panel: New RWA Listings -->
            <div class="ranking-panel">
              <div class="panel-tabs">
                <button class="tab-btn active">New RWA Listings</button>
                <button class="more-btn" @click="handleMore">More ›</button>
              </div>

              <div class="ranking-list compact">
                <div v-for="(item, index) in currentNewRwaList" :key="item.id"
                  :class="['ranking-item', { 'item-appear': item.visible }]"
                  :style="{ animationDelay: `${index * 0.1}s` }">
                  <!-- <div class="rank-number">{{ index + 1 }}</div> -->
                  <img :src="item.icon" :alt="item.symbol" class="token-icon" />
                  <div class="token-info">
                    <div class="token-symbol">{{ item.symbol }}</div>
                    <div class="token-name">{{ item.name }}</div>
                  </div>
                  <div class="token-price">${{ item.price }}</div>
                  <div :class="['token-change', item.change >= 0 ? 'positive' : 'negative']">
                    {{ item.change >= 0 ? '+' : '' }}{{ item.change }}%
                  </div>
                </div>
              </div>

              <div class="pagination-dots">
                <span v-for="page in 3" :key="page" :class="['dot', { active: currentNewRwaPage === page }]"
                  @click="changeNewRwaPage(page)"></span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>

    <!-- Chat/Support Button (Floating) -->
    <div class="floating-chat-btn">
      <el-icon>
        <ChatDotRound />
      </el-icon>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { Plus, ChatDotRound, ArrowLeft, ArrowRight } from "@element-plus/icons-vue";
import PcHeader from "@/components/layout/commonHeader.vue";
import { reactive, onMounted, ref, computed, watch } from "vue";

const router = useRouter();

const handleTrade = () => {
  router.push("/trading");
};

const displayStats = reactive({
  vol: 0,
  total: 0,
  tokens: 0,
  users: 0
});

const animateStats = () => {
  const duration = 3000; // 3 seconds
  const start = performance.now();

  const targets = {
    vol: 1.64,
    total: 14.81,
    tokens: 200,
    users: 167.1
  };

  const step = (timestamp) => {
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function (easeOutQuart)
    const ease = 1 - Math.pow(1 - progress, 4);

    displayStats.vol = targets.vol * ease;
    displayStats.total = targets.total * ease;
    displayStats.tokens = targets.tokens * ease;
    displayStats.users = targets.users * ease;

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
};

// Banner Data
const bannerList = ref([
  {
    id: 1,
    title: "Black Friday M Credits Boost",
    desc: "Pump Your Rank, Snag More Points!",
    image: "/src/assets/images/msx/banner1.png"
  },
  {
    id: 2,
    title: "MSX has fully upgraded its domain to msx.com",
    desc: "less typing , more trading!",
    image: "/src/assets/images/msx/banner2.png"
  },
  {
    id: 3,
    title: "Innovative Contracts Your Future Wins",
    desc: "Up to 100x leverage, control the high-energy trading experience!",
    image: "/src/assets/images/msx/banner3.png"
  }
]);

const currentIndex = ref(0);
const translateX = ref(0);
const bannerTrack = ref(null);

// 真正的无限轮播 - 动态扩展
const allBanners = ref([]);

// 初始化轮播数据
const initBanners = () => {
  const initialBanners = [];
  for (let i = 0; i < 10; i++) { // 初始化10份
    initialBanners.push(...bannerList.value);
  }
  allBanners.value = initialBanners;
};

// 动态扩展轮播数据
const expandBanners = () => {
  for (let i = 0; i < 5; i++) { // 每次扩展5份
    allBanners.value.push(...bannerList.value);
  }
};

const rotateBanner = (direction) => {
  // 获取轮播轨道的实际宽度来计算精确移动距离
  const trackWidth = bannerTrack.value ? bannerTrack.value.offsetWidth : 0;
  const cardWidth = (trackWidth - 56) / 3; // 卡片宽度：(总宽度 - 两个间隔) / 3
  const gap = 28; // 间隔宽度
  const bannerMoveDistance = cardWidth + gap; // 一个卡片+一个间隔的距离

  if (direction === 'right') {
    // 向右移动，递增索引，继续向前滚动
    currentIndex.value++;
    translateX.value -= bannerMoveDistance;

    // 当接近右边界时，扩展更多banner
    if (currentIndex.value > allBanners.value.length - 5) {
      expandBanners();
    }

    // 无缝重置：当移动距离过大时，重置到中间位置
    if (Math.abs(translateX.value) > bannerMoveDistance * 20) {
      const resetOffset = bannerMoveDistance * 10;
      translateX.value += resetOffset;
      currentIndex.value -= 10;
    }
  } else {
    // 向左移动，递减索引，向后滚动
    currentIndex.value--;
    translateX.value += bannerMoveDistance;

    // 当接近左边界时，在前面添加更多banner
    if (currentIndex.value < 5) {
      const newBanners = [];
      for (let i = 0; i < 5; i++) {
        newBanners.push(...bannerList.value);
      }
      allBanners.value.unshift(...newBanners);
      currentIndex.value += 5; // 调整索引
    }

    // 无缝重置：当向左移动距离过大时，重置到中间位置
    if (translateX.value > bannerMoveDistance * 20) {
      const resetOffset = bannerMoveDistance * 10;
      translateX.value -= resetOffset;
      currentIndex.value += 10;
    }
  }
};

// 监听原始banner数据变化
watch(bannerList, () => {
  if (bannerList.value.length > 0) {
    initBanners();
  }
}, { immediate: true });

// ============ 榜单数据和逻辑 ============

// 榜单标签页状态
const activeLeftTab = ref('contracts');
const activeRightTopTab = ref('contracts');

// 分页状态
const currentLeftPage = ref(1);
const currentRightTopPage = ref(1);
const currentNewRwaPage = ref(1);

// 生成价格数据函数
const generatePriceData = (basePrice, changePercent, count = 500) => {
  const data = [];
  const targetPrice = basePrice * (1 + changePercent / 100);
  const step = (targetPrice - basePrice) / count;
  const volatility = Math.abs(basePrice * 0.002); // 0.2%的波动，更加平滑

  for (let i = 0; i < count; i++) {
    let trendValue = basePrice + step * i;

    // 添加轻微的自然波动，使用正弦函数让曲线更平滑
    const waveOffset = Math.sin((i / count) * Math.PI * 2) * volatility * 0.3;
    const randomNoise = (Math.random() - 0.5) * volatility * 0.5;

    const currentPrice = trendValue + waveOffset + randomNoise;
    data.push(parseFloat(currentPrice.toFixed(4)));
  }

  // 确保最后一个数据点接近目标价格，保持趋势的一致性
  data[data.length - 1] = targetPrice;
  return data;
};

// 模拟榜单数据
const hotContractsData = ref([
  {
    id: 1,
    symbol: 'BTCUSDT',
    name: 'Bitcoin',
    icon: '/image/RWA-1.svg',
    price: '98136',
    change: -0.01,
    chart: 'line-chart',
    chartData: generatePriceData(98150, -0.01, 50),
    visible: false
  },
  {
    id: 2,
    symbol: 'ASML.M',
    name: 'ASML Holding NV',
    icon: '/image/RWA-2.png',
    price: '1055.5',
    change: -0.42,
    chart: 'line-chart',
    chartData: generatePriceData(1060, -0.42, 50),
    visible: false
  },
  {
    id: 3,
    symbol: 'ETHUSDT',
    name: 'Ethereum',
    icon: '/image/RWA-3.svg',
    price: '2599.85',
    change: -0.07,
    chart: 'line-chart',
    chartData: generatePriceData(2605, -0.07, 50),
    visible: false
  },
  {
    id: 4,
    symbol: 'BNBUSDT',
    name: 'BNB',
    icon: '/image/BNB.webp',
    price: '980',
    change: -0.85,
    chart: 'line-chart',
    chartData: generatePriceData(985, -0.85, 50),
    visible: false
  },
  {
    id: 5,
    symbol: 'GOOGL.M',
    name: 'Alphabet Inc. Class...',
    icon: '/image/RWA-2.png',
    price: '538.88',
    change: -0.08,
    chart: 'line-chart',
    chartData: generatePriceData(540, -0.08, 50),
    visible: false
  },
  {
    id: 6,
    symbol: 'PYPL.M',
    name: 'Paypal Holdings In...',
    icon: '/image/RWA-2.png',
    price: '62.67',
    change: -0.53,
    chart: 'line-chart',
    chartData: generatePriceData(63, -0.53, 50),
    visible: false
  },
  {
    id: 7,
    symbol: 'ZECUSDT',
    name: 'Zcash',
    icon: '/image/RWA-7.svg',
    price: '458.55',
    change: +1.52,
    chart: 'line-chart',
    chartData: generatePriceData(455, 1.52, 50),
    visible: false
  },
  {
    id: 8,
    symbol: 'SOLUSDT',
    name: 'Solana',
    icon: '/image/SOL.webp',
    price: '238.45',
    change: +2.18,
    chart: 'line-chart',
    chartData: generatePriceData(235, 2.18, 50),
    visible: false
  },
]);

const hotRwaData = ref([
  {
    id: 11,
    symbol: 'ASML.M',
    name: 'ASML Holding NV',
    icon: '/image/RWA-2.png',
    price: '1055.5',
    change: -0.42,
    chart: 'line-chart',
    chartData: generatePriceData(1060, -0.42, 50),
    visible: false
  },
  {
    id: 12,
    symbol: 'GOOGL.M',
    name: 'Alphabet Inc.',
    icon: '/image/RWA-2.png',
    price: '538.88',
    change: -0.08,
    chart: 'line-chart',
    chartData: generatePriceData(540, -0.08, 50),
    visible: false
  },
  {
    id: 13,
    symbol: 'PYPL.M',
    name: 'Paypal Holdings',
    icon: '/image/RWA-2.png',
    price: '62.67',
    change: -0.53,
    chart: 'line-chart',
    chartData: generatePriceData(63, -0.53, 50),
    visible: false
  },
  {
    id: 14,
    symbol: 'TSLA.M',
    name: 'Tesla Inc.',
    icon: '/image/RWA-2.png',
    price: '345.20',
    change: +2.15,
    chart: 'line-chart',
    chartData: generatePriceData(340, 2.15, 50),
    visible: false
  },
  {
    id: 15,
    symbol: 'AAPL.M',
    name: 'Apple Inc.',
    icon: '/image/RWA-2.png',
    price: '189.50',
    change: +1.05,
    chart: 'line-chart',
    chartData: generatePriceData(187, 1.05, 50),
    visible: false
  },
  {
    id: 16,
    symbol: 'MSFT.M',
    name: 'Microsoft Corp.',
    icon: '/image/RWA-2.png',
    price: '378.90',
    change: +0.85,
    chart: 'line-chart',
    chartData: generatePriceData(376, 0.85, 50),
    visible: false
  },
  {
    id: 17,
    symbol: 'AMZN.M',
    name: 'Amazon.com Inc.',
    icon: '/image/RWA-2.png',
    price: '156.30',
    change: +1.20,
    chart: 'line-chart',
    chartData: generatePriceData(154, 1.20, 50),
    visible: false
  },
  {
    id: 18,
    symbol: 'META.M',
    name: 'Meta Platforms',
    icon: '/image/RWA-1.svg',
    price: '485.20',
    change: +0.95,
    chart: 'line-chart',
    chartData: generatePriceData(482, 0.95, 50),
    visible: false
  },
]);

const contractRisingData = ref([
  { id: 21, symbol: 'ONTM.M', name: 'Quantum Enigma Inc...', icon: '/image/RWA-2.png', price: '9.96', change: +2.68, visible: false },
  { id: 22, symbol: 'MYXUSDT.M', name: 'MSX Token', icon: '/image/RWA-1.svg', price: '2.599', change: +2.95, visible: false },
  { id: 23, symbol: 'BMNR.M', name: 'BeMine Immersion ...', icon: '/image/RWA-2.png', price: '33.85', change: +2.20, visible: false },
]);

const rwaRisingData = ref([
  { id: 31, symbol: 'TSLA.M', name: 'Tesla Inc.', icon: '/image/RWA-2.png', price: '345.20', change: +3.15, visible: false },
  { id: 32, symbol: 'NVDA.M', name: 'NVIDIA Corp.', icon: '/image/RWA-2.png', price: '489.50', change: +2.85, visible: false },
  { id: 33, symbol: 'AMD.M', name: 'Advanced Micro...', icon: '/image/RWA-2.png', price: '125.30', change: +2.45, visible: false },
]);

const newRwaData = ref([
  { id: 41, symbol: 'ABBV.M', name: 'AbbVie Inc.', icon: '/image/RWA-2.png', price: '227.7', change: 0.00, visible: false },
  { id: 42, symbol: 'MRK.M', name: 'Merck & Co. Inc.', icon: '/image/RWA-2.png', price: '104.83', change: 0.00, visible: false },
  { id: 43, symbol: 'ONDS.M', name: 'Ondas Holdings In...', icon: '/image/RWA-2.png', price: '9.93', change: +0.38, visible: false },
]);

// 当前显示的列表
const currentLeftList = computed(() => {
  return activeLeftTab.value === 'contracts' ? hotContractsData.value : hotRwaData.value;
});

const currentRightTopList = computed(() => {
  return activeRightTopTab.value === 'contracts' ? contractRisingData.value : rwaRisingData.value;
});

const currentNewRwaList = computed(() => {
  return newRwaData.value;
});

// 切换标签页
const switchLeftTab = (tab) => {
  activeLeftTab.value = tab;
  loadListWithAnimation(activeLeftTab.value === 'contracts' ? hotContractsData : hotRwaData);
};

const switchRightTopTab = (tab) => {
  activeRightTopTab.value = tab;
  loadListWithAnimation(activeRightTopTab.value === 'contracts' ? contractRisingData : rwaRisingData);
};

// 分页切换
const changeLeftPage = (page) => {
  currentLeftPage.value = page;
  loadListWithAnimation(activeLeftTab.value === 'contracts' ? hotContractsData : hotRwaData);
};

const changeRightTopPage = (page) => {
  currentRightTopPage.value = page;
  loadListWithAnimation(activeRightTopTab.value === 'contracts' ? contractRisingData : rwaRisingData);
};

const changeNewRwaPage = (page) => {
  currentNewRwaPage.value = page;
  loadListWithAnimation(newRwaData);
};

// 加载列表的动画效果
const loadListWithAnimation = (listRef) => {
  // 首先隐藏所有项
  listRef.value.forEach(item => {
    item.visible = false;
  });

  // 逐个显示
  listRef.value.forEach((item, index) => {
    setTimeout(() => {
      item.visible = true;
    }, index * 100); // 每个项延迟100ms
  });
};

// 折线图处理函数
const getLinePoints = (data) => {
  if (!data || data.length === 0) return '';

  const width = 100;
  const height = 40;
  const padding = 5;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;

  const minPrice = Math.min(...data);
  const maxPrice = Math.max(...data);
  const priceRange = maxPrice - minPrice || 1;

  return data.map((price, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = padding + (1 - (price - minPrice) / priceRange) * chartHeight;
    return `${x},${y}`;
  }).join(' ');
};

const getLineDataPoints = (data) => {
  if (!data || data.length === 0) return [];

  const width = 100;
  const height = 40;
  const padding = 5;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;

  const minPrice = Math.min(...data);
  const maxPrice = Math.max(...data);
  const priceRange = maxPrice - minPrice || 1;

  return data.map((price, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = padding + (1 - (price - minPrice) / priceRange) * chartHeight;
    return { x, y };
  });
};

// 生成向下荧光填充区域的路径
const getAreaPath = (data) => {
  if (!data || data.length === 0) return '';

  const width = 100;
  const height = 40;
  const padding = 5;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;

  const minPrice = Math.min(...data);
  const maxPrice = Math.max(...data);
  const priceRange = maxPrice - minPrice || 1;

  // 生成折线点
  const linePoints = data.map((price, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = padding + (1 - (price - minPrice) / priceRange) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

  // 生成填充区域路径：从左下角开始 -> 沿折线 -> 到右下角 -> 闭合
  const startX = padding;
  const endX = width - padding;
  const bottomY = height - padding;

  return `M ${startX} ${bottomY} L ${linePoints} L ${endX} ${bottomY} Z`;
};

// More按钮处理
const handleMore = () => {
  console.log('More clicked');
};

onMounted(() => {
  setTimeout(() => {
    animateStats();
  }, 800);

  // 初始化榜单动画
  setTimeout(() => {
    loadListWithAnimation(hotContractsData);
    loadListWithAnimation(contractRisingData);
    loadListWithAnimation(newRwaData);
  }, 1500);
});
</script>

<style lang="scss" scoped>
.msx-home {
  min-height: 100vh;
  background-color: #000;
  background-image: url("@/assets/images/msx/background.png");
  background-size: 100% auto;
  background-position: center top;
  background-repeat: no-repeat;
  color: #fff;
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
}

.fix-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}

.hero-section {
  padding-top: 220px;
  display: flex;
  justify-content: center;
  text-align: center;
  min-height: 100vh;
  padding-bottom: 100px;
}

.hero-content {
  max-width: 1400px;
  width: 100%;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-title {
  font-size: 64px;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 24px;
  background: linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0.7) 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.1);
}

.hero-subtitle {
  font-size: 18px;
  color: #888;
  margin-bottom: 48px;
  font-weight: 400;
}

.hero-actions {
  margin-bottom: 100px;
}

.trade-btn {
  background: #bcff2f;
  color: #000;
  border: none;
  padding: 14px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
  box-shadow: 0 0 20px rgba(188, 255, 47, 0.2);

  &:hover {
    background: #a8e628;
    transform: translateY(-2px);
    box-shadow: 0 0 30px rgba(188, 255, 47, 0.4);
  }

  .btn-icon {
    font-size: 18px;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  width: 100%;
  margin-top: auto;
  padding-bottom: 80px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;

  &.center-stat {
    justify-content: center;
  }
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 40px;
}

.stat-label {
  font-size: 14px;
  color: #888;
}

.stat-chart-line {
  width: 100px;
  height: 40px;
  margin-bottom: 16px;
}

/* Banner Carousel Styles */
.banner-carousel {
  width: 100%;
  position: relative;
  margin-top: 60px;
  margin-bottom: 80px;
  padding: 0 70px;
  /* Space for arrows */

  &:hover {
    .nav-btn {
      opacity: 1;
    }
  }
}

.banner-track {
  width: 100%;
  overflow: hidden;
}

.banner-wrapper {
  display: flex;
  gap: 28px;
  /* 卡片间距 */
  width: 100%;
  position: relative;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}

.banner-card {
  background: #111;
  border: 1px solid #222;
  border-radius: 12px;
  padding: 36px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s;
  height: 200px;
  overflow: hidden;
  will-change: transform, opacity;

  &:hover {
    border-color: #333;
    background: #161616;

    .banner-img img {
      transform: scale(1.1);
    }
  }
}

.banner-text {
  flex: 1;
  padding-right: 24px;

  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 16px;
    line-height: 1.4;
  }

  p {
    font-size: 13px;
    color: #888;
    line-height: 1.5;
  }
}

.banner-img {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    transition: transform 0.3s ease;
  }
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  border: none;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  opacity: 0;
  transition: all 0.3s;
  z-index: 10;
  font-size: 20px;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  &.prev-btn {
    left: 10px;
  }

  &.next-btn {
    right: 10px;
  }
}

/* ============ All RWA Section ============ */
.all-rwa-section {
  width: 100%;
  margin-top: 0;
  padding: 0 20px 60px;
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.section-title {
  font-size: 48px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 16px;
  background: linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0.8) 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-subtitle {
  font-size: 16px;
  color: #888;
}

.ranking-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  grid-template-rows: auto auto;
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.ranking-panel {
  background: #0a0a0a;
  border: 1px solid #1a1a1a;
  border-radius: 16px;
  padding: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &:first-child {
    grid-row: 1 / 3; // 左侧面板占两行
    min-height: 600px; // 设置最小高度，减少空隙
    justify-content: flex-start; // 内容从顶部开始排列
    padding-top: 40px; // 内容整体下移
    padding-left: 30px; // 增加左边距，解决数据太靠左的问题
  }

  &:nth-child(2) {
    // 右上角面板 - 进一步增加高度以容纳3个项目
    height: 380px; // 进一步增加高度
    min-height: 380px;
    max-height: 380px;
  }

  &:nth-child(3) {
    // 右下角面板
    min-height: 280px;
  }
}

.panel-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  border-bottom: 1px solid #1a1a1a;
  padding-bottom: 12px;
}

.tab-btn {
  background: transparent;
  border: none;
  color: #666;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 6px;

  &:hover {
    color: #aaa;
  }

  &.active {
    color: #fff;
    background: rgba(255, 255, 255, 0.05);
  }
}

.more-btn {
  margin-left: auto;
  background: transparent;
  border: none;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #bcff2f;
  }
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  justify-content: flex-start;
  height: auto; // 改为自动高度
  overflow: hidden;

  &.compact {
    min-height: 150px;
    height: 250px; // 紧凑模式进一步增加高度以容纳3个项目
  }
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  border-radius: 8px;
  transition: all 0.3s;
  opacity: 0;
  transform: translateY(20px);

  &.item-appear {
    animation: slideInUp 0.5s forwards;
  }
}

// 左侧面板的特殊布局
.ranking-panel:first-child .ranking-item {
  justify-content: space-between;

  .token-info {
    flex: 0 0 auto; // 不占满剩余空间
    min-width: 120px;
  }

  .token-price {
    margin-left: 80px; // 进一步增加左边距，向右移动更多
    margin-right: 40px; // 保持与波动率的间隔
    text-align: center;
  }

  .token-change {
    margin-right: 80px; // 进一步增加右边距，保持平衡
    text-align: center;
  }

  .token-chart {
    flex: 1;
    margin-left: auto;
    margin-right: 0;
    max-width: 150px; // K线图加长
  }
}

// 右侧面板的特殊布局
.ranking-panel:not(:first-child) .ranking-item {
  justify-content: space-between;
  align-items: center;

  .token-info {
    flex: 0 0 auto;
    min-width: 120px;
    margin-right: auto; // logo和名字靠左
  }

  .token-price {
    text-align: center;
    margin: 0 15px;
  }

  .token-change {
    text-align: center;
    margin: 0 15px 0 0;
  }

  // 右侧面板没有chart，所以不需要调整
}

@keyframes slideInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.rank-number {
  width: 20px;
  font-size: 14px;
  font-weight: 600;
  color: #666;
  text-align: center;
}

.token-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.token-info {
  flex: 1;
  min-width: 0;
}

.token-symbol {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 4px;
  text-align: left; // 确保左对齐
}

.token-name {
  font-size: 12px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left; // 确保左对齐
}

.token-price {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  min-width: 80px;
  text-align: right;
}

.token-change {
  font-size: 14px;
  font-weight: 600;
  min-width: 70px;
  text-align: right;

  &.positive {
    color: #4caf50;
  }

  &.negative {
    color: #f44336;
  }
}

.token-chart {
  width: 100px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  overflow: hidden;
  flex-shrink: 0;

  .chart-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    opacity: 0;
    transform: translateX(-20px);
    animation: slideInChart 0.6s forwards;
    animation-delay: 0.3s;
  }
}

@keyframes slideInChart {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.pagination-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #1a1a1a;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #fff;
  cursor: pointer;
  transition: all 0.3s;
  opacity: 0.4;

  &:hover {
    opacity: 0.7;
  }

  &.active {
    opacity: 1;
  }
}

/* 轮播图卡片样式 */
.banner-card {
  flex: 0 0 calc((100% - 56px) / 3);
  /* 三张卡片，总间隔56px（28px * 2） */
  width: calc((100% - 56px) / 3);
  box-sizing: border-box;
  min-width: 0;
  /* 防止flex挤压 */
}

.floating-chat-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background: #333;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #fff;
  font-size: 24px;
  transition: all 0.3s;
  z-index: 100;

  &:hover {
    background: #444;
    transform: scale(1.1);
  }
}

@media (max-width: 1024px) {
  .hero-title {
    font-size: 48px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 40px;
  }

  .banner-wrapper {
    grid-template-columns: 1fr;
  }

  .banner-card {
    height: auto;
    min-height: 160px;
  }

  .ranking-grid {
    grid-template-columns: 1fr;
  }

  .ranking-panel:first-child {
    grid-row: auto;
  }

  .section-title {
    font-size: 36px;
  }

  .token-chart {
    width: 80px;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 36px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .section-title {
    font-size: 28px;
  }

  .token-chart {
    display: none; // 移动端隐藏趋势图
  }

  .ranking-item {
    gap: 12px;
    padding: 12px 8px;
  }

  .token-price {
    min-width: 60px;
    font-size: 13px;
  }

  .token-change {
    min-width: 55px;
    font-size: 13px;
  }
}

</style>
