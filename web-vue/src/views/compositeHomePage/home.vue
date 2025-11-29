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

onMounted(() => {
  setTimeout(() => {
    animateStats();
  }, 800);
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
  padding-bottom: 200px;
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
  margin-top: -100px;
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
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 36px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
