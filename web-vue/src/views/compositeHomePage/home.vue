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
import { Plus, ChatDotRound } from "@element-plus/icons-vue";
import PcHeader from "@/components/layout/commonHeader.vue";
import { reactive, onMounted } from "vue";

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
  /* Increased top padding to push content down */
  display: flex;
  justify-content: center;
  text-align: center;
  min-height: 100vh;
}

.hero-content {
  max-width: 1200px;
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
  /* Increased bottom padding to push stats up */
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
  /* Increased spacing */
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
