<template>
  <div class="msx-home">
    <!-- Header is handled by App.vue / layout -->
    <pc-header class="fix-header"></pc-header>

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title scroll-reveal">
          Decentralized<br />
          RWA Trading
        </h1>
        <p class="hero-subtitle scroll-reveal delay-100">
          Real Value On-Chain from Wall Street to Your Wallet
        </p>

        <div class="hero-actions scroll-reveal delay-200">
          <button class="trade-btn" @click="handleTrade">
            <el-icon class="btn-icon">
              <Plus />
            </el-icon>
            Trade Now
          </button>
        </div>

        <!-- Stats Grid -->
        <div class="stats-grid scroll-reveal delay-300">
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
        <div class="banner-carousel scroll-reveal delay-400">
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
        <section class="all-rwa-section scroll-reveal">
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
                            <stop offset="0%"
                              :style="`stop-color:${item.change >= 0 ? '#4caf50' : '#f44336'};stop-opacity:0.5`" />
                            <stop offset="30%"
                              :style="`stop-color:${item.change >= 0 ? '#4caf50' : '#f44336'};stop-opacity:0.2`" />
                            <stop offset="100%"
                              :style="`stop-color:${item.change >= 0 ? '#4caf50' : '#f44336'};stop-opacity:0`" />
                          </linearGradient>
                          <!-- 线条渐变 -->
                          <linearGradient :id="`lineGradient_${item.id}`" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%"
                              :style="`stop-color:${item.change >= 0 ? '#4caf50' : '#f44336'};stop-opacity:1`" />
                            <stop offset="50%"
                              :style="`stop-color:${item.change >= 0 ? '#4caf50' : '#f44336'};stop-opacity:1`" />
                            <stop offset="100%"
                              :style="`stop-color:${item.change >= 0 ? '#4caf50' : '#f44336'};stop-opacity:1`" />
                          </linearGradient>
                        </defs>
                        <!-- 绘制向下荧光填充区域 -->
                        <path :d="getAreaPath(item.chartData)" :fill="`url(#glowGradient_${item.id})`" stroke="none" />
                        <!-- 绘制折线 -->
                        <polyline :points="getLinePoints(item.chartData)" fill="none"
                          :stroke="`url(#lineGradient_${item.id})`" stroke-width="1" stroke-linejoin="round"
                          stroke-linecap="round" />
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

        <!-- DeFi Perpetuals Section -->
        <section class="defi-section scroll-reveal">
          <div class="defi-container">
            <!-- 左侧：特性卡片网格 -->
            <div class="defi-features">
              <div class="features-grid">
                <div v-for="(feature, index) in defiFeatures" :key="index" :class="[
                  'feature-card',
                  {
                    'expanded': expandedCard === index,
                    'compressed': isCompressed(index)
                  }
                ]" @click="toggleCard(index)">
                  <div class="feature-icon">
                    <component :is="feature.icon" />
                  </div>
                  <h3 class="feature-title">{{ feature.title }}</h3>
                  <p v-if="expandedCard === index" class="feature-desc">{{ feature.desc }}</p>
                </div>
              </div>
            </div>

            <!-- 右侧：标题和按钮 -->
            <div class="defi-content">
              <h2 class="defi-title">DeFi Perpetuals</h2>
              <h3 class="defi-subtitle">Long & Short On-Chain</h3>
              <p class="defi-description">
                Diversified returns, capturing opportunities in both rising and falling markets, supporting hedging
                strategies, and helping manage risk
              </p>
              <button class="trade-fi-btn" @click="handleTradeFi">
                Trade Fi
              </button>
            </div>
          </div>
        </section>

        <!-- MSXBridge Section -->
        <section class="bridge-section scroll-reveal">
          <div class="bridge-container">
            <!-- 左侧：文字内容 -->
            <div class="bridge-content">
              <h2 class="bridge-title">MSXBridge</h2>
              <h3 class="bridge-subtitle">Move assets freely and securely across chains</h3>
              <p class="bridge-description">
                Cross-chain is faster and safer, supporting multi-chain interoperability and one-click exchange,
                allowing assets to flow freely across global networks
              </p>
              <button class="go-now-btn" @click="handleBridge">
                Go Now
              </button>
            </div>

            <!-- 右侧：图片展示 -->
            <div class="bridge-visual">
              <img src="/image/MSXBridge.png" alt="MSXBridge" class="bridge-img" />
            </div>
          </div>
        </section>

        <!-- Steps Section -->
        <section class="steps-section scroll-reveal">
          <div class="steps-container">
            <!-- 左侧：步骤列表 -->
            <div class="steps-list">
              <div class="step-card">
                <span class="step-text">Step 1: Please link your wallet</span>
                <el-icon class="step-arrow">
                  <TopRight />
                </el-icon>
              </div>
              <div class="step-card">
                <span class="step-text">Step 2: Please perform quick top-up</span>
                <el-icon class="step-arrow">
                  <TopRight />
                </el-icon>
              </div>
              <div class="step-card">
                <span class="step-text">Step 3: Start your trading journey</span>
                <el-icon class="step-arrow">
                  <TopRight />
                </el-icon>
              </div>
            </div>

            <!-- 右侧：文本内容 -->
            <div class="steps-content">
              <h2 class="steps-title">Only 3 steps<br>required</h2>
              <h3 class="steps-subtitle">Start your trading journey</h3>
              <p class="steps-description">
                MSX provides you with the simplest way to use and the best user experience, efficient and convenient at
                your fingertips
              </p>
              <button class="trade-now-btn" @click="handleTrade">
                Trade Now
              </button>
            </div>
          </div>
        </section>

        <!-- Advantages Section -->
        <section class="advantages-section scroll-reveal">
          <div class="advantages-container">
            <div class="section-header">
              <h2 class="section-title">Our advantages</h2>
              <p class="section-subtitle">We will escort your safe transactions</p>
            </div>

            <div class="advantages-grid">
              <div class="advantage-item">
                <div class="advantage-icon">
                  <el-icon>
                    <Sort />
                  </el-icon>
                </div>
                <h3 class="advantage-title">Lightning Transfer</h3>
                <p class="advantage-desc">10-second transfers via optimized path selection</p>
              </div>

              <div class="advantage-item">
                <div class="advantage-icon">
                  <el-icon>
                    <RefreshRight />
                  </el-icon>
                  <span class="icon-text">24</span>
                </div>
                <h3 class="advantage-title">Always-On</h3>
                <p class="advantage-desc">24/7 operation with instant failover for zero downtime</p>
              </div>

              <div class="advantage-item">
                <div class="advantage-icon">
                  <el-icon>
                    <FolderChecked />
                  </el-icon>
                </div>
                <h3 class="advantage-title">Triple-Shield</h3>
                <p class="advantage-desc">Audited contracts + multisig + time-lock for attack prevention</p>
              </div>

              <div class="advantage-item">
                <div class="advantage-icon">
                  <el-icon>
                    <Switch />
                  </el-icon>
                </div>
                <h3 class="advantage-title">Direct Swaps</h3>
                <p class="advantage-desc">Direct asset transfers, one-click wallet integration</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Partners Section -->
        <section class="partners-section scroll-reveal">
          <div class="partners-container">
            <div class="section-header">
              <h2 class="section-title">Investors and Partners</h2>
              <p class="section-subtitle">Backed by the best institutions in Crypto</p>
            </div>

            <div class="marquee-wrapper">
              <div class="marquee-content">
                <!-- 使用INP系列图片作为合作伙伴展示 -->
                <div class="partner-logo" v-for="i in 14" :key="`p1-${i}`">
                  <img :src="`/image/INP-${i}.png`" :alt="`Partner ${i}`" />
                </div>
                <!-- 第二组图片（用于无缝滚动） -->
                <div class="partner-logo" v-for="i in 14" :key="`p2-${i}`">
                  <img :src="`/image/INP-${i}.png`" :alt="`Partner ${i}`" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- FAQ Section -->
        <section class="faq-section scroll-reveal">
          <div class="faq-container">
            <h2 class="section-title faq-title">MSX FAQ</h2>
            <div class="faq-list">
              <div v-for="(item, index) in faqList" :key="index" class="faq-item" :class="{ 'active': item.isOpen }"
                @click="toggleFaq(index)">
                <div class="faq-question">
                  <span>{{ item.question }}</span>
                  <el-icon class="faq-icon" :class="{ 'rotate': item.isOpen }">
                    <ArrowRight />
                  </el-icon>
                </div>
                <div class="faq-answer" :style="{ maxHeight: item.isOpen ? '200px' : '0' }">
                  <p v-html="item.answer"></p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>

    <!-- Footer Section -->
    <footer class="msx-footer">
      <div class="footer-content-wrapper">
        <div class="footer-left">
          <div class="footer-brand">
            <img src="/image/logo-white.png" alt="MSX Logo" class="footer-logo" />
          </div>
          <p class="footer-slogan">Innovation Drive Growth<br>Do our best to help users achieve wealth growth</p>

          <div class="footer-contact-info">
            <p class="contact-label">Partnership Application</p>
            <a href="mailto:info@msx.com" class="contact-email">info@msx.com</a>
          </div>
        </div>

        <div class="footer-links-group">
          <div class="footer-column">
            <h3>Community</h3>
            <ul>
              <li><a href="#">MSX Official</a></li>
              <li><a href="#">MSX CN</a></li>
              <li><a href="#">Telegram Global</a></li>
              <li><a href="#">Telegram CN</a></li>
              <li><a href="#">Discord</a></li>
              <li><a href="#">Community Voting</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h3>About MSX</h3>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact us</a></li>
              <li><a href="#">Notices</a></li>
              <li><a href="#">Customer Support</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Privacy Protection</a></li>
              <li><a href="#">White paper</a></li>
              <li><a href="#">Affiliate Program</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h3>Other</h3>
            <ul>
              <li><a href="#">AML Statement</a></li>
              <li><a href="#">Disclaimer</a></li>
              <li><a href="#">Law Enforcement Requests</a></li>
              <li><a href="#">Proof of Reserves</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© 2025 MSX All rights reserved</p>
      </div>
    </footer>

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
import { Plus, ChatDotRound, ArrowLeft, ArrowRight, Clock, TrendCharts, Promotion, Lock, TopRight, Sort, RefreshRight, FolderChecked, Connection as Switch } from "@element-plus/icons-vue";
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

// 滚动动画观察者
const initScrollObserver = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('active');
        }, 100);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  const elements = document.querySelectorAll('.scroll-reveal');
  elements.forEach((el) => observer.observe(el));
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

// ============ DeFi Perpetuals 逻辑 ============
const expandedCard = ref(0); // 默认展开第一个卡片（左上角）

const defiFeatures = ref([
  {
    icon: Clock,
    title: 'Flexible positions, no rollover',
    desc: 'Strategy flexibility, no contract expiry pressure'
  },
  {
    icon: TrendCharts,
    title: 'High leverage, long & short trading',
    desc: 'Go long or short, easily capture market ups and downs'
  },
  {
    icon: Promotion,
    title: 'Deep liquidity, low slippage',
    desc: 'Efficient matching, trade prices closely follow the market'
  },
  {
    icon: Lock,
    title: 'Stable liquidation and controllable risks',
    desc: 'Multi-source oracle quotes to avoid incorrect liquidations caused by abnormal fluctuations'
  }
]);

// 判断卡片是否被挤压（同行检测）
const isCompressed = (index) => {
  if (expandedCard.value === null) return false;

  // 计算展开卡片所在的行
  const expandedRow = Math.floor(expandedCard.value / 2);
  // 计算当前卡片所在的行
  const currentRow = Math.floor(index / 2);

  // 同一行且不是展开的卡片，则被挤压
  return expandedRow === currentRow && expandedCard.value !== index;
};

const toggleCard = (index) => {
  // 如果点击的是已展开的卡片，不做任何操作
  if (expandedCard.value === index) {
    return;
  }

  // 切换到点击的卡片
  expandedCard.value = index;
};

const handleTradeFi = () => {
  console.log('Trade Fi clicked');
  router.push('/trading');
};

const handleBridge = () => {
  console.log('Bridge clicked');
  // router.push('/bridge'); // 假设有这个路由，或者暂时留空
};

// ============ FAQ 逻辑 ============
const faqList = ref([
  {
    question: "What is MSX?",
    answer: "MSX (<span style='color: #bcff2f'>msx.com</span>) is a world-leading decentralized platform for tokenized real-world assets (RWA), offering a full suite of RWA spot and derivatives trading. Users can purchase RWA spot tokens and trade RWA derivatives directly with USDT, USDC, or USD1.",
    isOpen: true // 默认展开第一个
  },
  {
    question: "Which tokens are currently available for trading?",
    answer: "Over 100 stock tokens and ETF tokens are listed; newly added tokens include BTCS.M, DFDV.M, ANTA.M, SBET.M, and GRYP.M. The platform will continue to expand to include more Real-World Assets (RWAs). please directly visit <a href='https://msx.com/us-trading' target='_blank' style='color: #bcff2f'>https://msx.com/us-trading</a>",
    isOpen: false
  },
  {
    question: "How are dividends distributed?",
    answer: "Airdropped directly to your wallet—no manual action required.",
    isOpen: false
  },
  {
    question: "What are RWA perpetual contracts?",
    answer: "An on-chain contract tied to a stock-token index, with no expiration date, allowing leveraged long or short positions.",
    isOpen: false
  },
  {
    question: "What is the trading fee for MSX?",
    answer: "The fee for RWA is 0.3%, crypto-to-crypto trading fee is 0, cross-chain bridge fee is 0.1%, contract trading maker fee is 0.02%, taker fee is 0.045%.",
    isOpen: false
  }
]);

const toggleFaq = (index) => {
  // 手风琴模式：点击展开，其他关闭
  faqList.value.forEach((item, i) => {
    if (i === index) {
      item.isOpen = !item.isOpen;
    } else {
      item.isOpen = false;
    }
  });
};

onMounted(() => {
  setTimeout(() => {
    animateStats();
    initScrollObserver();
  }, 100);

  // 初始化榜单动画
  setTimeout(() => {
    loadListWithAnimation(hotContractsData);
    loadListWithAnimation(contractRisingData);
    loadListWithAnimation(newRwaData);
  }, 1500);
});
</script>

<style lang="scss" scoped>
/* 滚动动画样式 */
.scroll-reveal {
  opacity: 0;
  transform: translateY(80px);
  transition: all 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  will-change: opacity, transform;
}

.scroll-reveal.active {
  opacity: 1;
  transform: translateY(0);
}

/* 修复底部白线：确保背景全黑 */
:deep(body),
:deep(html) {
  background-color: #000 !important;
  border: none !important;
  outline: none !important;
  margin: 0 !important;
  padding: 0 !important;
}

/* 移除所有可能的边框 */
* {
  box-sizing: border-box;
}

/* 确保最外层容器没有边框 */
.msx-home {
  border: none !important;
  outline: none !important;
}

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
  padding-bottom: 0;
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

/* ============ DeFi Perpetuals Section ============ */
.defi-section {
  width: 100%;
  padding: 80px 20px;
  margin-top: 40px;
}

.defi-container {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center; // 改为center确保整体垂直居中
}

.defi-features {
  width: 100%;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.feature-card {
  background: #0a0a0a;
  border: 1px solid #1a1a1a;
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  // 统一处理所有属性的过渡动画
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1),
    border-color 0.6s cubic-bezier(0.4, 0, 0.2, 1),
    border-width 0.6s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.6s cubic-bezier(0.4, 0, 0.2, 1),
    z-index 0.6s cubic-bezier(0.4, 0, 0.2, 1),
    width 0.6s cubic-bezier(0.4, 0, 0.2, 1),
    max-width 0.6s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1),
    margin-left 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 210px;

  // 默认状态（中）：正常宽度和位置
  width: 100%;
  max-width: 100%;
  opacity: 1;
  transform: scaleX(1);
  z-index: 1;

  // 默认占一列
  grid-column: span 1;

  // 左边卡片（索引0,2）- 从左侧开始放大
  &:nth-child(1),
  &:nth-child(3) {
    transform-origin: left center;
    margin-left: 0; // 默认左对齐
  }

  // 右边卡片（索引1,3）- 从右侧开始放大
  &:nth-child(2),
  &:nth-child(4) {
    transform-origin: right center;
    margin-left: auto; // 默认右对齐，确保位置一致性
  }

  // 大状态（选中展开）
  &.expanded {
    // 视觉效果
    border-color: #fff;
    border-width: 2px;
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);

    // 尺寸和层级
    width: 100%;
    max-width: 100%;
    opacity: 1;
    transform: scaleX(1.2);
    z-index: 2;

    // 反向缩放内容，抵消变形
    .feature-icon {
      transform: scaleX(0.833); // 1/1.2 ≈ 0.833
    }

    .feature-title {
      transform: scaleX(0.833);
    }

    .feature-desc {
      transform: scaleX(0.833);
    }
  }

  // 小状态（同行压缩）
  &.compressed {
    // 视觉效果
    border-color: #1a1a1a;
    border-width: 1px;
    box-shadow: none;

    // 尺寸和层级
    width: 80%;
    max-width: 80%;
    opacity: 0.8;
    transform: scaleX(1);
    z-index: 1;

    // 确保内容正常显示和换行
    .feature-icon {
      transform: none; // 保持正常
    }

    .feature-title {
      transform: none; // 保持正常
      word-wrap: break-word;
      overflow-wrap: break-word;
      word-break: break-word;
      white-space: normal;
    }

    .feature-desc {
      transform: none; // 保持正常
      word-wrap: break-word;
      overflow-wrap: break-word;
      word-break: break-word;
      white-space: normal;
    }
  }
}

.feature-icon {
  width: 40px;
  height: 40px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: #bcff2f;
  font-size: 32px;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.feature-title {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 8px;
  line-height: 1.4;
  text-align: left; // 左对齐
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.feature-desc {
  font-size: 14px;
  color: #888;
  line-height: 1.5;
  margin-top: 12px;
  text-align: left; // 左对齐
  animation: fadeIn 0.4s ease;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}


.defi-content {
  padding-left: 40px;
  text-align: left; // 左对齐
  display: flex;
  flex-direction: column;
  justify-content: center; // 垂直居中
}

.defi-title {
  font-size: 48px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 16px;
  line-height: 1.2;
  text-align: left; // 左对齐
}

.defi-subtitle {
  font-size: 28px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 24px;
  line-height: 1.3;
  text-align: left; // 左对齐
}

.defi-description {
  font-size: 16px;
  color: #888;
  line-height: 1.6;
  margin-bottom: 40px;
  max-width: 500px;
  text-align: left; // 左对齐
}

.trade-fi-btn {
  background: #bcff2f;
  color: #000;
  border: none;
  padding: 16px 48px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 0 20px rgba(188, 255, 47, 0.2);
  display: inline-block; // 左对齐

  &:hover {
    background: #a8e628;
    transform: translateY(-2px);
    box-shadow: 0 0 30px rgba(188, 255, 47, 0.4);
  }
}

/* ============ MSXBridge Section ============ */
.bridge-section {
  width: 100%;
  padding: 80px 20px;
  background: #000; // 保持背景一致
}

.bridge-container {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center; // 垂直居中
}

.bridge-content {
  text-align: left;
}

.bridge-title {
  font-size: 48px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 16px;
  line-height: 1.2;
}

.bridge-subtitle {
  font-size: 28px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 24px;
  line-height: 1.3;
}

.bridge-description {
  font-size: 16px;
  color: #888;
  line-height: 1.6;
  margin-bottom: 40px;
  max-width: 500px;
}

.go-now-btn {
  background: #bcff2f;
  color: #000;
  border: none;
  padding: 16px 48px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 0 20px rgba(188, 255, 47, 0.2);
  display: inline-block;

  &:hover {
    background: #a8e628;
    transform: translateY(-2px);
    box-shadow: 0 0 30px rgba(188, 255, 47, 0.4);
  }
}

.bridge-visual {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bridge-img {
  width: 100%;
  max-width: 800px; // 增大最大宽度从600px到800px
  height: auto;
  object-fit: contain;
  // 移除悬浮放大效果
}

/* ============ Steps Section ============ */
.steps-section {
  width: 100%;
  padding: 80px 20px;
  background: #000;
}

.steps-container {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 100px;
  align-items: center;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.step-card {
  background: #111;
  border: 1px solid #222;
  border-radius: 12px;
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #161616;
    border-color: #333;
    transform: translateX(10px);

    .step-arrow {
      color: #bcff2f;
      transform: translate(2px, -2px);
    }
  }
}

.step-text {
  font-size: 16px;
  color: #fff;
  font-weight: 500;
}

.step-arrow {
  font-size: 20px;
  color: #666;
  transition: all 0.3s ease;
}

.steps-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.steps-title {
  font-size: 48px;
  font-weight: 700;
  color: #fff;
  line-height: 1.2;
  margin-bottom: 16px;
}

.steps-subtitle {
  font-size: 28px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 24px;
}

.steps-description {
  font-size: 16px;
  color: #888;
  line-height: 1.6;
  margin-bottom: 40px;
  max-width: 500px;
}

.trade-now-btn {
  background: #bcff2f;
  color: #000;
  border: none;
  padding: 16px 48px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 0 20px rgba(188, 255, 47, 0.2);

  &:hover {
    background: #a8e628;
    transform: translateY(-2px);
    box-shadow: 0 0 30px rgba(188, 255, 47, 0.4);
  }
}



/* ============ Advantages Section ============ */
.advantages-section {
  width: 100%;
  padding: 80px 20px;
  background: #000;
}

.advantages-container {
  max-width: 1400px;
  margin: 0 auto;
}

.advantages-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  margin-top: 60px;
}

.advantage-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px;
}

.advantage-icon {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  position: relative;
  color: #bcff2f;
  font-size: 64px;

  /* 简单的边框效果模拟图标风格 */
  .el-icon {
    font-size: 64px;
  }
}

.icon-text {
  position: absolute;
  font-size: 14px;
  font-weight: 700;
  color: #bcff2f;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #000;
  padding: 2px;
}

.advantage-title {
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 16px;
}

.advantage-desc {
  font-size: 14px;
  color: #888;
  line-height: 1.6;
  max-width: 240px;
}

/* ============ Partners Section ============ */
/* ============ Partners Section ============ */
.partners-section {
  width: 100%;
  padding: 80px 0;
  background: #000;
  overflow: hidden;
}

.partners-container {
  width: 100%;
}

.marquee-wrapper {
  width: 100%;
  overflow: hidden;
  margin-top: 60px;
  position: relative;

  /* 添加左右渐变遮罩 */
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    width: 100px;
    height: 100%;
    z-index: 2;
    pointer-events: none;
  }

  &::before {
    left: 0;
    background: linear-gradient(to right, #000, transparent);
  }

  &::after {
    right: 0;
    background: linear-gradient(to left, #000, transparent);
  }
}

.marquee-content {
  display: flex;
  width: max-content;
  animation: scroll 80s linear infinite;
  /* 减慢速度 */

  &:hover {
    animation-play-state: paused;
  }
}

/* ... existing code ... */

.msx-footer {
  width: 100%;
  padding: 80px 0 0;
  /* 移除底部padding，让footer-bottom紧贴 */
  background: #000;
  border-top: 1px solid #000;
}

/* ... existing code ... */

.footer-bottom {
  max-width: 100%;
  margin: 0 auto;
  padding: 24px 80px 24px;
  /* 添加底部padding */
  background: #000;
  /* 明确设置黑色背景 */
  border-top: 1px solid #333;
  border-bottom: 1px solid #333;
  text-align: center;

  p {
    font-size: 12px;
    color: #666;
    margin: 0;
    /* 移除p的默认margin */
  }
}

/* 动画延迟类 */
.delay-100 {
  transition-delay: 0.1s;
}

.delay-200 {
  transition-delay: 0.2s;
}

.delay-300 {
  transition-delay: 0.3s;
}

.delay-400 {
  transition-delay: 0.4s;
}

.delay-500 {
  transition-delay: 0.5s;
}

.partner-logo {
  flex-shrink: 0;
  width: 200px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 30px;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    opacity: 0.7;
    transition: opacity 0.3s;
    filter: grayscale(100%);

    &:hover {
      opacity: 1;
      filter: grayscale(0%);
    }
  }
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-50%);
  }
}

/* ============ FAQ Section ============ */
.faq-section {
  width: 100%;
  padding: 80px 20px 40px;
  background: #000;
}

.faq-container {
  max-width: 1200px;
  margin: 0 auto;
}

.faq-title {
  text-align: center;
  margin-bottom: 60px;
}

.faq-list {
  display: flex;
  flex-direction: column;
}

.faq-item {
  border-bottom: 1px solid #222;

  &:first-child {
    border-top: 1px solid #222;
  }
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32px 0;
  cursor: pointer;
  font-size: 20px;
  font-weight: 500;
  color: #fff;
  transition: color 0.3s;
}

.faq-icon {
  font-size: 24px;
  color: #fff;
  transition: transform 0.3s ease;

  &.rotate {
    transform: rotate(90deg);
  }
}

.faq-answer {
  overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease;
  max-height: 0;

  p {
    font-size: 16px;
    color: #888;
    line-height: 1.6;
    padding-bottom: 32px;
    text-align: left;
  }
}

.faq-item.active {
  .faq-question {
    color: #fff;
  }
}

/* ============ Footer Section ============ */

.footer-content-wrapper {
  max-width: 100%;
  padding: 60px 80px 60px;
  /* 添加顶部padding给边框留出空间 */
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 60px;
  border-top: 1px solid #333;
}

.footer-left {
  max-width: 400px;
  display: flex;
  flex-direction: column;
  /* 确保高度足够，以便 contact-info 可以沉底，或者依赖 margin-top: auto */
  min-height: 200px;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;

  .footer-logo {
    height: 40px;
    width: auto;
    object-fit: contain;
  }
}

.footer-slogan {
  font-size: 14px;
  color: #fff;
  line-height: 1.6;
  margin-bottom: 40px;
}

.footer-contact-info {
  margin-top: auto;
  /* 将联系信息推到底部 */
  padding-top: 20px;

  .contact-label {
    font-size: 12px;
    color: #888;
    margin-bottom: 8px;
  }

  .contact-email {
    font-size: 14px;
    color: #fff;
    text-decoration: none;
    transition: color 0.3s;

    &:hover {
      color: #bcff2f;
    }
  }
}

.footer-links-group {
  display: flex;
  gap: 120px;
}

.footer-column {
  h3 {
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 28px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      margin-bottom: 20px;

      a {
        font-size: 13px;
        color: #888;
        text-decoration: none;
        transition: color 0.3s;

        &:hover {
          color: #bcff2f;
        }
      }
    }
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

  .defi-container {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .defi-content {
    padding-left: 0;
  }

  .defi-title {
    font-size: 36px;
  }

  .defi-subtitle {
    font-size: 24px;
  }

  /* Bridge Section Responsive */
  .bridge-container {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }

  .bridge-content {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .bridge-title {
    font-size: 36px;
  }

  .bridge-subtitle {
    font-size: 24px;
  }

  /* Advantages Section Tablet */
  .advantages-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 40px;
  }

  /* Footer Section Tablet */
  .footer-content-wrapper {
    flex-direction: column;
    gap: 40px;
  }

  .footer-links-group {
    width: 100%;
    justify-content: space-between;
    gap: 20px;
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
    display: none;
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

  .features-grid {
    grid-template-columns: 1fr;
  }

  .feature-card.expanded {
    grid-column: span 1;
  }

  .defi-title {
    font-size: 28px;
  }

  .defi-subtitle {
    font-size: 20px;
  }

  .defi-description {
    font-size: 14px;
  }

  /* Bridge Section Mobile */
  .bridge-title {
    font-size: 28px;
  }

  .bridge-subtitle {
    font-size: 20px;
  }

  .bridge-description {
    font-size: 14px;
  }

  /* Steps Section Mobile */
  .steps-container {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }

  .steps-content {
    order: -1;
    text-align: center;
    align-items: center;
  }

  .steps-title {
    font-size: 28px;
  }

  .steps-subtitle {
    font-size: 20px;
  }

  .steps-description {
    font-size: 14px;
  }

  /* Advantages Section Mobile */
  .advantages-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .advantage-item {
    padding: 0;
  }

  /* Partners Section Mobile */
  .partner-logo {
    width: 150px;
    padding: 0 20px;
    height: 60px;
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

  .defi-container {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .defi-content {
    padding-left: 0;
  }

  .defi-title {
    font-size: 36px;
  }

  .defi-subtitle {
    font-size: 24px;
  }

  /* Bridge Section Responsive */
  .bridge-container {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }

  .bridge-content {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .bridge-title {
    font-size: 36px;
  }

  .bridge-subtitle {
    font-size: 24px;
  }

  /* Advantages Section Tablet */
  .advantages-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 40px;
  }

  /* Footer Section Tablet */
  .footer-content-wrapper {
    flex-direction: column;
    gap: 40px;
  }

  .footer-links-group {
    width: 100%;
    justify-content: space-between;
    gap: 20px;
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
    display: none;
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

  .features-grid {
    grid-template-columns: 1fr;
  }

  .feature-card.expanded {
    grid-column: span 1;
  }

  .defi-title {
    font-size: 28px;
  }

  .defi-subtitle {
    font-size: 20px;
  }

  .defi-description {
    font-size: 14px;
  }

  /* Bridge Section Mobile */
  .bridge-title {
    font-size: 28px;
  }

  .bridge-subtitle {
    font-size: 20px;
  }

  .bridge-description {
    font-size: 14px;
  }

  /* Steps Section Mobile */
  .steps-container {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }

  .steps-content {
    order: -1;
    text-align: center;
    align-items: center;
  }

  .steps-title {
    font-size: 28px;
  }

  .steps-subtitle {
    font-size: 20px;
  }

  .steps-description {
    font-size: 14px;
  }

  /* Advantages Section Mobile */
  .advantages-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .advantage-item {
    padding: 0;
  }

  /* Partners Section Mobile */
  .partner-logo {
    width: 150px;
    padding: 0 20px;
    height: 60px;
  }

  /* FAQ Section Mobile */
  .faq-title {
    font-size: 28px;
    margin-bottom: 40px;
  }

  .faq-question {
    font-size: 16px;
    padding: 16px 0;
  }

  /* Footer Section Mobile */
  .footer-links-group {
    flex-direction: column;
    gap: 40px;
  }

  .footer-brand {
    justify-content: center;
  }

  .footer-left {
    text-align: center;
    max-width: 100%;
  }
}
</style>
