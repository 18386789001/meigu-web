<template>
  <div class="home">
    <!-- 英雄区域 -->
    <section class="hero">
      <!-- 背景视频 -->
      <video
        class="hero-video"
        autoplay
        muted
        loop
        playsinline
        poster="/背景.mp4"
      >
        <source src="/背景.mp4" type="video/mp4" />
        您的浏览器不支持视频播放。
      </video>

      <!-- 视频遮罩层 -->
      <div class="hero-overlay"></div>

      <!-- 内容层 -->
      <div class="hero-content">
        <h1 class="hero-title">{{ $t("home.heroTitle") }}</h1>
        <p class="hero-subtitle">{{ $t("home.heroSubtitle") }}</p>
        <div class="hero-actions">
          <button class="btn-primary" @click="goToTrading">
            {{ $t("home.startTrading") }}
          </button>
          <button class="btn-secondary" @click="goToLogin">
            {{ $t("home.loginAccount") }}
          </button>
          <button class="btn-android-download" @click="downloadAndroidApp">
            <div class="android-icon">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4483-.9993.9993-.9993c.5511 0 .9993.4483.9993.9993.0001.5511-.4482.9997-.9993.9997zm-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4483.9993.9993 0 .5511-.4483.9997-.9993.9997zm11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.2439 13.8533 7.8508 12 7.8508s-3.5902.3931-5.1367 1.0989L4.841 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3435-4.1021-2.6892-7.5743-6.1185-9.4396z"
                />
              </svg>
            </div>
            <div class="download-text">
              <span class="download-label">{{ $t("home.downloadApp") }}</span>
              <span class="download-subtitle">{{
                $t("home.downloadAppSubtitle")
              }}</span>
            </div>
            <div class="download-arrow">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 5V19M12 19L19 12M12 19L5 12"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </section>

    <!-- 统计数据 -->
    <section class="stats">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">1000+</div>
            <div class="stat-label">{{ $t("home.activeTraders") }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">50+</div>
            <div class="stat-label">{{ $t("home.tradingPairs") }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">24/7</div>
            <div class="stat-label">{{ $t("home.support247") }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 交易产品 -->
    <section class="trading-products">
      <div class="container">
        <h2 class="section-title">{{ $t("home.tradingProducts") }}</h2>
        <div class="products-grid">
          <div
            v-for="product in tradingProducts"
            :key="product.id"
            class="product-card"
            @click="goToTrading"
          >
            <div class="product-icon">
              <div v-html="product.icon" class="icon-svg"></div>
            </div>
            <h3 class="product-title">{{ $t(product.title) }}</h3>
            <p class="product-desc">{{ $t(product.description) }}</p>
            <button class="product-btn">
              {{ $t("home.tradeNow") }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 平台优势 -->
    <section class="advantages">
      <div class="container">
        <h2 class="section-title">{{ $t("home.advantages") }}</h2>
        <div class="advantages-grid">
          <div
            v-for="advantage in advantages"
            :key="advantage.id"
            class="advantage-card"
          >
            <div class="advantage-icon">
              <div v-html="advantage.icon" class="icon-svg"></div>
            </div>
            <h3 class="advantage-title">{{ advantage.title }}</h3>
            <p class="advantage-desc">{{ advantage.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 注册区域 -->
    <section class="register-section">
      <div class="container">
        <div class="register-content">
          <h2 class="register-title">{{ $t("home.register.title") }}</h2>
          <p class="register-subtitle">{{ $t("home.register.subtitle") }}</p>
          <div class="register-actions">
            <button class="btn-primary" @click="goToRegister">
              {{ $t("home.register.realAccount") }}
            </button>
            <button class="btn-outline" @click="goToDemo">
              {{ $t("home.register.demoAccount") }}
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import config from "@/config";

const { t } = useI18n();

const router = useRouter();

// 交易产品数据
const tradingProducts = ref([
  {
    id: 1,
    title: "home.forex",
    description: "home.forexDesc",
    icon: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="30" fill="url(#forexGradient)" stroke="#1e40af" stroke-width="2"/>
      <path d="M20 28h24v2H20v-2zm0 4h24v2H20v-2zm0 4h24v2H20v-2z" fill="white"/>
      <path d="M18 20h2v24h-2V20zm26 0h2v24h-2V20z" fill="#1e40af"/>
      <path d="M32 18v2M32 44v2" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <defs>
        <linearGradient id="forexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1e40af;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
        </linearGradient>
      </defs>
    </svg>`,
  },
  {
    id: 2,
    title: "home.crypto",
    description: "home.cryptoDesc",
    icon: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="30" fill="url(#cryptoGradient)" stroke="#1e40af" stroke-width="2"/>
      <path d="M32 12c-11.046 0-20 8.954-20 20s8.954 20 20 20 20-8.954 20-20-8.954-20-20-20zm0 36c-8.837 0-16-7.163-16-16s7.163-16 16-16 16 7.163 16 16-7.163 16-16 16z" fill="white"/>
      <path d="M24 28h16v2H24v-2zm0 4h16v2H24v-2zm0 4h12v2H24v-2z" fill="#1e40af"/>
      <circle cx="32" cy="32" r="4" fill="white"/>
      <defs>
        <linearGradient id="cryptoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1e40af;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
        </linearGradient>
      </defs>
    </svg>`,
  },
  {
    id: 3,
    title: "home.stocks",
    description: "home.stocksDesc",
    icon: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="30" fill="url(#stocksGradient)" stroke="#1e40af" stroke-width="2"/>
      <path d="M16 40l8-12 8 8 8-16 8 20" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <path d="M16 40h32" stroke="white" stroke-width="2"/>
      <circle cx="24" cy="28" r="2" fill="white"/>
      <circle cx="32" cy="36" r="2" fill="white"/>
      <circle cx="40" cy="20" r="2" fill="white"/>
      <circle cx="48" cy="44" r="2" fill="white"/>
      <defs>
        <linearGradient id="stocksGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1e40af;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
        </linearGradient>
      </defs>
    </svg>`,
  },
  {
    id: 4,
    title: "home.commodities",
    description: "home.commoditiesDesc",
    icon: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="30" fill="url(#commoditiesGradient)" stroke="#1e40af" stroke-width="2"/>
      <path d="M32 16l4 8h8l-6 6 2 8-8-4-8 4 2-8-6-6h8l4-8z" fill="white"/>
      <circle cx="32" cy="32" r="3" fill="#1e40af"/>
      <path d="M20 40h24M20 44h24M20 48h24" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <defs>
        <linearGradient id="commoditiesGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1e40af;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
        </linearGradient>
      </defs>
    </svg>`,
  },
]);

// 平台优势数据
const advantages = computed(() => [
  {
    id: 1,
    title: t("home.advantagesDetails.professionalPlatform"),
    description: t("home.advantagesDetails.mt5Platform"),
    icon: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="30" fill="url(#platformGradient)" stroke="#1e40af" stroke-width="2"/>
      <rect x="16" y="20" width="32" height="24" rx="4" fill="white"/>
      <rect x="20" y="24" width="8" height="4" rx="2" fill="#1e40af"/>
      <rect x="30" y="24" width="8" height="4" rx="2" fill="#1e40af"/>
      <rect x="20" y="30" width="24" height="2" rx="1" fill="#1e40af"/>
      <rect x="20" y="34" width="16" height="2" rx="1" fill="#1e40af"/>
      <path d="M28 16v4M36 16v4" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <defs>
        <linearGradient id="platformGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1e40af;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
        </linearGradient>
      </defs>
    </svg>`,
  },
  {
    id: 2,
    title: t("home.advantagesDetails.security"),
    description: t("home.advantagesDetails.fundSecurity"),
    icon: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="30" fill="url(#securityGradient)" stroke="#1e40af" stroke-width="2"/>
      <path d="M32 16l8 4v8c0 8-8 12-8 12s-8-4-8-12v-8l8-4z" fill="white"/>
      <path d="M28 28l4 4 8-8" stroke="#1e40af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <circle cx="32" cy="32" r="2" fill="#1e40af"/>
      <defs>
        <linearGradient id="securityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1e40af;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
        </linearGradient>
      </defs>
    </svg>`,
  },
  {
    id: 3,
    title: t("home.advantagesDetails.lowSpreads"),
    description: t("home.advantagesDetails.ultraLowSpreads"),
    icon: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="30" fill="url(#spreadGradient)" stroke="#1e40af" stroke-width="2"/>
      <path d="M16 32h32M20 28h8M20 36h8M36 28h8M36 36h8" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <circle cx="32" cy="32" r="4" fill="white"/>
      <path d="M24 20l8 8 8-8M24 44l8-8 8 8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <defs>
        <linearGradient id="spreadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1e40af;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
        </linearGradient>
      </defs>
    </svg>`,
  },
  {
    id: 4,
    title: t("home.advantagesDetails.support247"),
    description: t("home.advantagesDetails.allDaySupport"),
    icon: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="30" fill="url(#supportGradient)" stroke="#1e40af" stroke-width="2"/>
      <circle cx="32" cy="32" r="12" fill="white"/>
      <path d="M32 24v8l4 4" stroke="#1e40af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <circle cx="32" cy="32" r="2" fill="#1e40af"/>
      <path d="M16 16h4M44 16h4M16 48h4M44 48h4" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <path d="M16 20l4-4M44 20l-4-4M16 44l4 4M44 44l-4 4" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
      <defs>
        <linearGradient id="supportGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1e40af;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
        </linearGradient>
      </defs>
    </svg>`,
  },
]);

// 语言代码映射（h5-vue到wap-vue）
const getWapLanguageCode = (h5LangCode) => {
  const langMap = {
    "en-US": "en",
    "ja-JP": "Japanese",
    "ko-KR": "Korean",
    "th-TH": "th",
    "vi-VN": "vi",
    "de-DE": "de",
    "es-ES": "es",
    "fr-FR": "fr",
    "it-IT": "Italy",
    "pt-PT": "pt",
    "el-GR": "gr",
    "zh-CN": "CN",
    "zh-TW": "CN",
  };
  return langMap[h5LangCode] || "en";
};

// 获取当前语言代码
const getCurrentLanguageCode = () => {
  return localStorage.getItem("lang") || "en-US";
};

// 方法
const goToTrading = () => {
  router.push("/trading");
};

const goToLogin = () => {
  const currentLang = getCurrentLanguageCode();
  const langCode = getWapLanguageCode(currentLang);
  const loginUrl = config.URLS.LOGIN({ lang: langCode });
  console.log("🔗 [Home.vue] 跳转到登录页");
  console.log("📝 [Home.vue] 当前语言代码 (H5):", currentLang);
  console.log("📝 [Home.vue] 转换后语言代码 (WAP):", langCode);
  console.log("🌐 [Home.vue] 生成的登录URL:", loginUrl);
  window.location.href = loginUrl;
};

const goToAbout = () => {
  router.push("/about");
};

const goToRegister = () => {
  const currentLang = getCurrentLanguageCode();
  const langCode = getWapLanguageCode(currentLang);
  const registerUrl = config.URLS.REGISTER({ lang: langCode });
  console.log("🔗 [Home.vue] 跳转到注册页");
  console.log("📝 [Home.vue] 当前语言代码 (H5):", currentLang);
  console.log("📝 [Home.vue] 转换后语言代码 (WAP):", langCode);
  console.log("🌐 [Home.vue] 生成的注册URL:", registerUrl);
  window.location.href = registerUrl;
};

const goToDemo = () => {
  const currentLang = getCurrentLanguageCode();
  const langCode = getWapLanguageCode(currentLang);
  const demoUrl = config.URLS.DEMO_ACCOUNT({ lang: langCode });
  console.log("🔗 [Home.vue] 跳转到模拟账户页");
  console.log("📝 [Home.vue] 当前语言代码 (H5):", currentLang);
  console.log("📝 [Home.vue] 转换后语言代码 (WAP):", langCode);
  console.log("🌐 [Home.vue] 生成的模拟账户URL:", demoUrl);
  window.location.href = demoUrl;
};

// 下载安卓APP
const downloadAndroidApp = () => {
  try {
    // 创建下载链接
    const link = document.createElement("a");
    // 使用正确的路径，考虑base路径 /h5/
    link.href = `${window.location.origin}/h5/JPMX2.apk`;
    link.download = "JPMX2.apk";
    link.setAttribute("target", "_blank");

    // 添加到DOM并触发点击
    document.body.appendChild(link);
    link.click();

    // 清理
    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);

    console.log("📱 [Home.vue] 开始下载安卓APP: JPMX2.apk");
    console.log("📱 [Home.vue] 下载链接:", link.href);
  } catch (error) {
    console.error("❌ [Home.vue] 下载失败:", error);
    // 备用方案：直接打开链接
    window.open("/h5/JPMX2.apk", "_blank");
  }
};
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: #0a0a0a;
  color: #ffffff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 英雄区域 */
.hero {
  position: relative;
  height: 100vh;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
}

/* 背景视频 */
.hero-video {
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  transform: translate(-50%, -50%);
  z-index: 1;
  object-fit: cover;
}

/* 视频遮罩层 */
.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(10, 10, 10, 0.7) 0%,
    rgba(26, 26, 46, 0.8) 100%
  );
  z-index: 2;
}

.hero-content {
  position: relative;
  z-index: 3;
  max-width: 600px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 70vh;
  padding-bottom: 80px;
}

.hero-title {
  font-size: clamp(28px, 5vw, 48px);
  font-weight: bold;
  margin-bottom: 16px;
  line-height: 1.2;
  color: #ffffff;
}

.hero-subtitle {
  font-size: clamp(16px, 3vw, 20px);
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 32px;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  margin: 0 auto;
  margin-top: auto;
}

/* 统计数据 */
.stats {
  padding: 40px 0;
  background: #111;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #1e40af;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

/* 交易产品 */
.trading-products {
  padding: 60px 0;
}

.section-title {
  text-align: center;
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 40px;
  color: #ffffff;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.product-card {
  background: #1a1a1a;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #333;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(30, 64, 175, 0.3);
}

.product-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 16px;
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-svg {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-svg svg {
  width: 100%;
  height: 100%;
}

.product-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
  color: #ffffff;
}

.product-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 20px;
  line-height: 1.5;
}

.product-btn {
  width: 100%;
  background: #1e40af;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.product-btn:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
}

/* 平台优势 */
.advantages {
  padding: 60px 0;
  background: #111;
}

.advantages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.advantage-card {
  text-align: center;
  padding: 24px;
}

.advantage-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 16px;
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.advantage-icon .icon-svg {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.advantage-icon .icon-svg svg {
  width: 100%;
  height: 100%;
}

.advantage-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
  color: #ffffff;
}

.advantage-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
}

/* 注册区域 */
.register-section {
  padding: 60px 0;
  background: linear-gradient(135deg, #1a1a2e 0%, #0a0a0a 100%);
}

.register-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.register-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #ffffff;
}

.register-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 32px;
}

.register-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

/* 按钮样式 */
.btn-primary {
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 44px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(30, 64, 175, 0.4);
}

.btn-secondary {
  background: transparent;
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 44px;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
}

.btn-whitepaper {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  color: #1f2937;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 44px;
}

.btn-whitepaper:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
}

.btn-outline {
  background: transparent;
  color: #1e40af;
  border: 1px solid #1e40af;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 44px;
}

.btn-outline:hover {
  background: #1e40af;
  color: white;
}

/* 安卓下载按钮 */
.btn-android-download {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  color: #ffffff;
  border: none;
  border-radius: 12px;
  padding: 14px 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 6px 24px rgba(30, 64, 175, 0.3);
  overflow: hidden;
  min-height: 44px;
  margin-top: 48px;
}

.btn-android-download::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 0;
}

.btn-android-download:hover::before {
  opacity: 1;
}

.btn-android-download:hover {
  transform: translateY(-2px) scale(1.01);
  box-shadow: 0 8px 30px rgba(30, 64, 175, 0.4);
}

.btn-android-download:active {
  transform: translateY(-1px) scale(0.99);
}

.android-icon {
  position: relative;
  z-index: 1;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.btn-android-download:hover .android-icon {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(360deg);
}

.android-icon svg {
  width: 20px;
  height: 20px;
  color: #ffffff;
}

.download-text {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
  text-align: left;
}

.download-label {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.3px;
  margin-bottom: 2px;
  display: block;
}

.download-subtitle {
  font-size: 11px;
  font-weight: 400;
  opacity: 0.9;
  display: block;
}

.download-arrow {
  position: relative;
  z-index: 1;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.btn-android-download:hover .download-arrow {
  transform: translateY(3px);
}

.download-arrow svg {
  width: 18px;
  height: 18px;
  color: #ffffff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero {
    height: 100vh;
    min-height: 500px;
  }

  .hero-content {
    padding: 0 16px 60px 16px;
    min-height: 75vh;
  }

  .hero-actions {
    max-width: 100%;
  }

  .hero-actions .btn-primary,
  .hero-actions .btn-secondary,
  .hero-actions .btn-android-download {
    width: 100%;
    max-width: 320px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .products-grid,
  .advantages-grid {
    grid-template-columns: 1fr;
  }

  .register-actions {
    flex-direction: column;
    align-items: center;
  }

  .register-actions .btn-primary,
  .register-actions .btn-outline {
    width: 200px;
  }

  .container {
    padding: 0 16px;
  }

  .btn-android-download {
    padding: 12px 16px;
    margin-top: 40px;
  }

  .android-icon {
    width: 32px;
    height: 32px;
  }

  .android-icon svg {
    width: 18px;
    height: 18px;
  }

  .download-label {
    font-size: 14px;
  }

  .download-subtitle {
    font-size: 10px;
  }

  .download-arrow {
    width: 20px;
    height: 20px;
  }

  .download-arrow svg {
    width: 16px;
    height: 16px;
  }
}
</style>