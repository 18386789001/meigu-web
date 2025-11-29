<template>
  <div>
    <section class="section1 text-left">
      <pc-header
        :needTransparent="needTransparent"
        :class="needTransparent ? 'transparent-header' : 'fix-header'"
      ></pc-header>
      <div class="top_content_Box">
        <h1 class="section1-title mt-12">
          {{ t("h-s1-t1", { TITLE: $title }) }}
        </h1>
        <div class="section1-desc mb-12">{{ t("h-s1-d1") }}</div>

        <!-- 注册表单 -->
        <div class="hero-form">
          <el-input
            v-model="email"
            :placeholder="t('email')"
            class="email-input"
            size="large"
            @keyup.enter="handleRegister"
          >
          </el-input>
          <el-button
            class="btn-register11"
            size="large"
            :loading="registerLoading"
            @click="handleRegister"
          >
            {{ t("jiaru") }}
          </el-button>
        </div>

        <!-- 查看隐私 -->
        <h6
          style="margin-bottom: 24px"
          class="section1-link cursor-pointer"
          @click="gotoPage('pdf.js/SCB_Privacy_Policy_ROW.pdf')"
        >
          {{ t("h-s5-d1") }}
        </h6>

        <!-- 了解更多按钮 -->
        <el-button class="blue-middle-btn" @click="handleTrade">
          {{ t("liaojiegengduao") }}
        </el-button>
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
            @click="goToTicker(item)"
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
            @click="goToTicker(item)"
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

    <!-- 在1000多种交易产品上发掘交易机会 -->
    <pc-section class="pt-12 pb-20" innerclass="flex">
      <div class="section2-left mr-12">
        <el-tabs
          v-model="marketListType"
          class="demo-tabs"
          style="width: 650px"
          @tab-click="handleClick"
        >
          <el-tab-pane
            :label="_item.name"
            :name="_item.type"
            v-for="_item in marketList"
            :key="_item.type"
          >
            <el-table
              style="width: 650px"
              :data="activeList"
              class="self-table"
              :empty-text="t('message.home.noData')"
            >
              <el-table-column
                v-for="(item, index) in tableList"
                :key="index"
                :prop="item.prop"
                :width="item.width"
                :label="t(`h-s2-h${index + 1}`)"
              >
                <template #default="scope" v-if="item.prop == 'symbol'">
                  <div class="flex items-center">
                    <!-- :src="`${ConfigURL.HOST_URL}/symbol/${scope.row.symbol}.png`" -->

                    <el-image
                      :src="handleSymbolImg(scope.row.symbol)"
                      class="el-img-style"
                      style="width: 16px; height: 16px; margin-right: 6px"
                    >
                      <template #error>
                        <div class="image-slot">
                          <img
                            :src="`${ConfigURL.HOST_URL}/symbol/noCoins.png`"
                            class="el-img-style"
                            width="16"
                            height="16"
                          />
                        </div>
                      </template>
                    </el-image>
                    <!-- <img :src="scope.row.img" style="width: 40px;height:40px;margin-right: 30px;" alt="" /> -->
                    <span>{{ getName(scope.row.symbol) }}</span>
                  </div>
                </template>
                <template #default="scope" v-if="item.prop == 'amount'">
                  <div class="flex items-center">
                    <span>{{ fixData(scope.row.amount) }}</span>
                  </div>
                </template>
                <template #default="scope" v-if="item.prop == 'changeRatio'">
                  <div class="flex items-center">
                    <span :class="scope.row.changeRatio > 0 ? 'green' : 'red'"
                      >{{ scope.row.changeRatio }}%</span
                    >
                  </div>
                </template>
              </el-table-column>
              <el-table-column>
                <template #default="scope">
                  <!-- class="blue-small-btn" -->
                  <el-button
                    style="background-color: black; color: white"
                    @click="goDetail(scope.row.symbol, scope.row)"
                    >{{ t("jiaoyi") }}</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <p class="text-gray-400">{{ t("h-s2-1-d1") }}</p>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="section2-content">
        <h6 class="font-normal">{{ t("h-s2-2-t1", { TITLE: $title }) }}</h6>
        <h1>{{ t("h-s2-2-t2") }}</h1>
        <h5 class="w-300 my-4">
          {{ t("h-s2-2-d1") }}
        </h5>
        <el-button
          class="gray-middle-btn font-normal"
          @click="gotoPage('/trading/spreads-swaps-commissions')"
        >
          {{ t("h-s2-2-b1") }}
        </el-button>
      </div>
    </pc-section>

    <!-- 公告 -->
    <div class="mt-8" scope>
      <notice-bar />
    </div>

    <!-- 为什么选择Coinstore -->
    <pc-section class="section4 bg-white pt-12" style="margin-bottom: 24px">
      <h2 style="text-align: left; margin-bottom: 40px">
        {{ t("h-s2-2-t1", { TITLE: $title }) }}
      </h2>
      <div class="advantage-carousel">
        <!-- 左箭头 -->
        <div class="carousel-arrow left" @click="prevAdvantage">
          <el-icon><ArrowLeft /></el-icon>
        </div>

        <!-- 卡片容器 -->
        <div class="carousel-container">
          <div
            class="carousel-track"
            :style="{
              transform: `translateX(-${advantageCurrentIndex * 33.33}%)`,
            }"
          >
            <div
              class="carousel-item"
              v-for="(item, i) in advantageList4"
              :key="i"
              @click="gotoPage(item.url)"
            >
              <card-advantage
                :title="t(`h-s4-${i + 1}-t1`)"
                :desc="t(`h-s4-${i + 1}-d1`)"
                :imgPath="`/src/assets/images/compositeHome/home/iphone${
                  i + 1
                }.png`"
              />
            </div>
          </div>
        </div>

        <!-- 右箭头 -->
        <div class="carousel-arrow right" @click="nextAdvantage">
          <el-icon><ArrowRight /></el-icon>
        </div>
      </div>
    </pc-section>

    <!-- 一个账户，多个交易平台 - 炫酷版本 -->
    <pc-section class="platform-section py-12">
      <h2 class="section-title">{{ t("h-s5-t1") }}</h2>
      <div class="platforms-grid">
        <div
          v-for="(item, i) in platformList4"
          :key="i"
          class="platform-card"
          :class="`platform-card-${i + 1}`"
        >
          <div class="card-glow"></div>
          <div class="card-content">
            <div class="platform-icon">
              <img
                :src="
                  getImageUrl(
                    `/src/assets/images/compositeHome/home/trade${i + 1}.png`
                  )
                "
              />
            </div>
            <h3 class="platform-title">{{ t(`h-s5-${i + 1}-t1`) }}</h3>
            <p class="platform-desc">{{ t(`h-s5-${i + 1}-d1`) }}</p>
            <div class="card-shine"></div>
          </div>
        </div>
      </div>
    </pc-section>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
import { ArrowLeft, ArrowRight } from "@element-plus/icons-vue";

import Axios from "@/api/currency.js";
import cardAdvantage from "@comCompositeHome/home/cardAdvantage.vue";
import cardTrade from "@comCompositeHome/home/cardTrade.vue";
import PcHeader from "@comCompositeHome/header.vue";
import noticeBar from "@comCommon/noticeBar.vue";

import { fixData } from "@/utils/utils";
import ConfigURL from "@/config/index";
import { getImageUrl, handleSymbolImg, getImages } from "@/utils/index";
import { onMounted, nextTick, onUnmounted } from "vue";

const needTransparent = ref(true);
const router = useRouter();
const { t } = useI18n();

// 注册表单相关
const email = ref("");
const registerLoading = ref(false);

// 邮箱验证
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// 注册处理
const handleRegister = async () => {
  if (!email.value) {
    ElMessage.warning("请输入邮箱地址");
    return;
  }

  if (!validateEmail(email.value)) {
    ElMessage.error("邮箱地址格式不正确");
    return;
  }

  registerLoading.value = true;

  try {
    // 跳转到注册页面
    router.push({
      path: "/login",
      query: { email: email.value },
    });
  } catch (error) {
    ElMessage.error("注册失败，请稍后重试");
    console.error("Registration error:", error);
  } finally {
    registerLoading.value = false;
  }
};

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

const goToTicker = (item) => {
  const symbol = item.symbol.replace("/", "_");
  router.push(`/trade/${symbol}`);
};

onMounted(() => {
  nextTick(() => {
    getPublicRealtimeByType();
  });
  // getSymbol();
  window.addEventListener("scroll", handlePageScroll);

  // 启动行情滚动动画
  setTimeout(() => {
    startAnimation();
  }, 100);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handlePageScroll);
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
});

const handlePageScroll = () => {
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  needTransparent.value = scrollTop < 800;
};

const list6 = Array(6);
const marketList = [
  // {
  //   id: 0,
  //   name: t("h-s2-t1"),
  //   type: "hot",
  // },
  {
    id: 1,
    name: t("h-s2-t2"),
    type: "forex",
  },
  {
    id: 2,
    name: t("h-s2-t3"),
    type: "cryptos",
  },
  {
    id: 3,
    name: t("h-s2-t4"),
    type: "indices",
  },
  {
    id: 4,
    name: t("h-s2-t5"),
    type: "commodities",
    category: "commodities",
  },
];
const tableList = [
  {
    prop: "symbol",
    width: 180,
  },
  {
    prop: "close",
    width: 120,
  },
  {
    prop: "amount",
    width: 100,
  },
  {
    prop: "changeRatio",
    width: 100,
  },
];
const articleList3 = [
  {
    url: "/market-analysis/forex-market-unlimited-opportunities",
  },
  {
    url: "/market-analysis/what-will-take-gold",
  },
  {
    url: "/market-analysis/-us-aug-cpi-review-risk-sentiment-changed",
  },
];
const advantageList4 = [
  {
    url: "/trading/spreads-swaps-commissions",
  },
  {
    url: "/trading",
  },
  {
    url: "/why-demo/about/",
  },
  {
    url: "/trading-platforms",
  },
];

// 轮播相关
const advantageCurrentIndex = ref(0);

const prevAdvantage = () => {
  if (advantageCurrentIndex.value > 0) {
    advantageCurrentIndex.value--;
  }
};

const nextAdvantage = () => {
  // 最多显示3个，总共4个，所以最多可以滚动到索引1 (显示2,3,4)
  if (advantageCurrentIndex.value < advantageList4.length - 3) {
    advantageCurrentIndex.value++;
  }
};

const platformList4 = [
  {
    url: "/trading-platforms/platforms/ctrader",
  },
  {
    url: "/trading-platforms/platforms/metatrader5",
  },
  {
    url: "/trading-platforms/platforms/metatrader4",
  },
  {
    url: "/trading-platforms/platforms/ctrader",
  },
];

const awardPrefix = "/src/assets/images/compositeHome/home/award";

const allSymbol = ref("");
const marketListType = ref("forex");
const activeList = ref([]);
const topListData = ref([]);
const jsonArray = ref([]);

const handleTrade = () => {
  router.push("/trading/spreads-swaps-commissions");
};
const getSymbol = () => {
  Axios.getAllSymbolDetails({}).then((res) => {
    jsonArray.value = res.data;
    fliterTypeData();
  });
};

const getPublicRealtimeByType = () => {
  const params = {
    type: marketListType.value,
    pageNo: 1,
    pageSize: 4,
  };

  if (marketListType.value === "commodities") {
    params["type"] = "forex";
    params["category"] = "commodities";
  }

  Axios.publicRealtimeByType(params).then((res) => {
    if (res.code === 0) {
      activeList.value = res.data;
    } else {
      activeList.value = [];
    }
  });
};

const fliterTypeData = () => {
  if (marketListType.value == "hot") {
    //获取顶部热门
    jsonArray.value.map((val) => {
      if (topListData.value.length < 4) {
        if (val.isTop == 1) {
          topListData.value.push(val);
        }
      }
    });
    if (topListData.value.length == 0) {
      jsonArray.value.map((val) => {
        if (topListData.value.length < 4) {
          //val.isTop=="1"
          topListData.value.push(val);
        }
      });
    }
    activeList.value = topListData.value;
  } else if (marketListType.value == "commodities") {
    activeList.value = jsonArray.value.filter((val) => {
      return val.type == "forex" && val.category == "commodities";
    });
  } else {
    activeList.value = jsonArray.value.filter((val) => {
      return val.type == marketListType.value;
    });
  }
  if (activeList.value.length > 4) {
    activeList.value = activeList.value.slice(0, 4);
  }
};
const handleClick = (tab, event) => {
  marketListType.value = tab.props.name;
  getPublicRealtimeByType();
};
const getName = (symbol) => {
  // console.log("item = " + JSON.stringify(item));
  if (marketListType.value == "cryptos") {
    return symbol.toUpperCase();
  } else {
    return symbol;
  }
};
const goDetail = (symbol, item) => {
  let RouterName = "sustainable"; //永续
  if (item.type == "US-stocks") {
    router.push({
      path: `usStocks/constract/${symbol}`,
      query: { timestamp: Date.now(), RouterName: RouterName },
    });
  } else if (item.type == "cryptos") {
    router.push({
      path: `coin/constract/${symbol}`,
      query: { timestamp: Date.now(), RouterName: RouterName },
    });
  } else if (item.type == "indices") {
    router.push({
      path: `etf/constract/${symbol}`,
      query: { timestamp: Date.now(), RouterName: RouterName },
    });
  } else if (item.type == "forex") {
    router.push({
      path: `forex/constract/${symbol}`,
      query: { timestamp: Date.now(), RouterName: RouterName },
    });
  }
};

const gotoPage = (path) => {
  if (!path.startsWith("/")) {
    window.open(path);
    return;
  }
  router.push(path);
};

const input = ref("");
</script>

<style lang="scss" scoped>


// 强制覆盖全局button样式，防止被coin/trade.css污染
:deep(.el-button) {
  &.blue-middle-btn {
    background: #2e64f1 !important;
    color: #ffffff !important;
    border: none !important;
    border-radius: 4px !important;
    padding: 12px 24px !important;
    font-size: 14px !important;
    font-weight: 500 !important;
    transition: all 0.3s ease !important;

    &:hover {
      background: lighten(#2e64f1, 10%) !important;
      color: #ffffff !important;
    }

    &:focus,
    &:active {
      background: #2e64f1 !important;
      color: #ffffff !important;
    }
  }

  &.gray-middle-btn {
    background: #666666 !important;
    color: #ffffff !important;
    border: none !important;
    border-radius: 4px !important;
    padding: 12px 24px !important;
    font-size: 14px !important;
    font-weight: 500 !important;
    transition: all 0.3s ease !important;

    &:hover {
      background: lighten(#666666, 10%) !important;
      color: #ffffff !important;
    }

    &:focus,
    &:active {
      background: #666666 !important;
      color: #ffffff !important;
    }
  }
}

// 表格中的button样式
:deep(.el-table) {
  .el-button {
    background-color: #000000 !important;
    color: #ffffff !important;
    border: none !important;
    border-radius: 4px !important;
    padding: 8px 16px !important;
    font-size: 14px !important;

    &:hover {
      background-color: #333333 !important;
      color: #ffffff !important;
    }

    &:focus,
    &:active {
      background-color: #000000 !important;
      color: #ffffff !important;
    }
  }
}

.top_content_Box {
  max-width: 1300px;
  margin: 7% auto;
}

// Section1 文字样式
.section1-title {
  color: #000000;
  font-size: 48px;
  font-weight: 700;
  line-height: 1.2;
}

.section1-desc {
  color: #333333;
  font-size: 18px;
  line-height: 1.6;
}

.section1-link {
  color: #666666;
  font-size: 14px;
  text-decoration: underline;
  transition: color 0.3s ease;

  &:hover {
    color: #000000;
  }
}

// 注册表单样式
.hero-form {
  display: flex;
  gap: 0;
  max-width: 600px;
  margin-bottom: 12px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 0px 6px 0px 16px;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    padding: 16px;
  }

  .email-input {
    flex: 1;

    :deep(.el-input__wrapper) {
      background: transparent;
      border-radius: 0;
      padding: 8px 0;
      box-shadow: none;
      border: none;

      &:hover,
      &:focus,
      &.is-focus {
        box-shadow: none;
      }

      .el-input__inner {
        font-size: 14px;
        color: #000;

        &::placeholder {
          color: #999;
        }
      }
    }
  }

  .btn-register11 {
    background: #000000 !important;
    color: #ffffff !important;
    border: none;
    border-radius: 8px;
    padding: 14px 24px;
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;
    transition: all 0.3s ease;
    flex-shrink: 0;

    &:hover {
      background: #333333;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    &:active {
      transform: translateY(0);
    }

    @media (max-width: 768px) {
      width: 100%;
    }
  }
}

.w-300 {
  width: 500px;
}

.bd-gray {
  background: #f1f4f6;
}

.w-500 {
  width: 500px;
}

//覆盖global.scss，home-tab单独样式
.demo-tabs :deep {
  .el-tabs__content {
    // box-shadow: none;
    // border-bottom: 1px solid gray;
    border-radius: 0;
  }

  .el-tabs__header {
    background: #fff;
    border-radius: 10px 10px 0px 0px;
    margin: 0;
  }
}

// home-table样式
.self-table {
  box-shadow: none;
  border-radius: 0;
}

.section1 {
  background-color: #fffbfc;
  // background-image: linear-gradient(
  //     180deg,
  //     rgba(0, 0, 0, 0.8) 0%,
  //     rgba(0, 0, 0, 0) 100%
  //   ),
  //   url(@/assets/images/compositeHome/home/banner1.png);
  // background-size: 100% 100%;
  // background-repeat: no-repeat;
  height: 910px;
}

.transparent-header {
  background: transparent !important;
}

.fix-header {
  position: fixed !important;
}

.section2 {
  &-left {
    filter: drop-shadow(0px 0px 15px rgba(0, 0, 0, 0.1));
    width: 900px;

    p {
      background: #f6f7f8;
      border-radius: 0px 0px 10px 10px;
      padding: 18px 32px;
    }
  }

  &-content {
    max-width: 650px;
  }
}

.section3 {
  background: url(@/assets/images/compositeHome/home/banner2.png) no-repeat
    center;
  background-size: auto 100%;
  height: 468px;
  width: 1200px;
  padding: 120px 0 0 74px;
}

.section6 {
  background: url(@/assets/images/compositeHome/home/banner3.png) no-repeat
    center;
  background-size: auto 100%;
  margin: 0 auto;

  .join {
    width: 224px;
    height: 50px;
  }

  .el-input {
    width: 500px;
    height: 50px;
  }
}

.el-input :deep {
  .el-input__wrapper {
    border-radius: 0;
  }
}

.section8 {
  &-bg {
    background: url(@/assets/images/compositeHome/home/banner4.png) no-repeat
      center;
    background-size: auto 100%;
    height: 468px;
    width: 1200px;
    margin: 0 auto;
    border-radius: 20px;
  }
}

:deep(.el-table .cell) {
  color: #000;
}

:deep(.el-tabs__item:hover) {
  color: rgb(30, 35, 41) !important;
}

.green {
  color: #03a66d;
}

.red {
  color: #cf304a;
}

// ========================================
// 轮播样式
// ========================================
.advantage-carousel {
  position: relative;
  display: flex;
  align-items: center;
  gap: 24px;

  .carousel-arrow {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.3s ease;
    z-index: 10;

    &:hover {
      background: #f5f5f5;
      border-color: rgba(0, 0, 0, 0.2);
      transform: scale(1.1);
    }

    .el-icon {
      font-size: 20px;
      color: #000;
    }

    &.left {
      margin-right: 12px;
    }

    &.right {
      margin-left: 12px;
    }
  }

  .carousel-container {
    flex: 1;
    overflow: hidden;
  }

  .carousel-track {
    display: flex;
    gap: 24px;
    transition: transform 0.5s ease;
  }

  .carousel-item {
    flex: 0 0 calc(33.33% - 16px);
    cursor: pointer;
  }
}

// ========================================
// 公告样式
// ========================================
.notice-box {
  max-width: 1300px;
  margin: 0 auto;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 16px 24px;
  background: #ffffff;
}

// ========================================
// Ticker Bar
// ========================================
.ticker-bar {
  width: 100%;
  background: #ffffff;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 8px 0;

  .ticker-track {
    display: flex;
    width: fit-content;
    will-change: transform;
  }

  .ticker-list {
    display: flex;
    gap: 24px;
    padding: 0 16px;
    white-space: nowrap;
  }

  .ticker-item {
    display: flex;
    align-items: center;
    gap: 16px;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    transition: background 0.2s ease;

    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }

    .pair {
      font-size: 22px;
      font-weight: 600;
      color: #000;
      min-width: 100px;
    }

    .price {
      font-size: 14px;
      font-weight: 500;
      color: #000;
      min-width: 80px;
      text-align: right;
    }
  }
}

// ========================================
// Percent Badge
// ========================================
.percent-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;

  &.positive {
    color: #03a66d;
    background: rgba(3, 166, 109, 0.1);

    .arrow {
      color: #03a66d;
    }
  }

  &.negative {
    color: #cf304a;
    background: rgba(207, 48, 74, 0.1);

    .arrow {
      color: #cf304a;
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

// ========================================
// 平台卡片 - 炫酷版本
// ========================================
.platform-section {
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
        circle at 20% 50%,
        rgba(46, 100, 241, 0.1) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 80% 50%,
        rgba(240, 185, 11, 0.1) 0%,
        transparent 50%
      );
    pointer-events: none;
  }

  .section-title {
    text-align: left;
    color: #ffffff;
    font-size: 42px;
    font-weight: 700;
    margin-bottom: 60px;
    position: relative;
    z-index: 1;
  }
}

.platforms-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  max-width: 1300px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

.platform-card {
  position: relative;
  height: 380px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);

  // 发光效果
  .card-glow {
    position: absolute;
    inset: -2px;
    background: linear-gradient(45deg, transparent, transparent);
    border-radius: 20px;
    opacity: 0;
    transition: opacity 0.5s ease;
    pointer-events: none;
    z-index: 0;
  }

  // 不同卡片的主题色
  &.platform-card-1 .card-glow {
    background: linear-gradient(
      135deg,
      rgba(46, 100, 241, 0.4),
      rgba(46, 100, 241, 0.1)
    );
  }

  &.platform-card-2 .card-glow {
    background: linear-gradient(
      135deg,
      rgba(240, 185, 11, 0.4),
      rgba(240, 185, 11, 0.1)
    );
  }

  &.platform-card-3 .card-glow {
    background: linear-gradient(
      135deg,
      rgba(139, 92, 246, 0.4),
      rgba(139, 92, 246, 0.1)
    );
  }

  &.platform-card-4 .card-glow {
    background: linear-gradient(
      135deg,
      rgba(16, 185, 129, 0.4),
      rgba(16, 185, 129, 0.1)
    );
  }

  // 光泽效果
  .card-shine {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent 30%,
      rgba(255, 255, 255, 0.1) 50%,
      transparent 70%
    );
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
    transition: transform 0.8s ease;
    pointer-events: none;
  }

  .card-content {
    position: relative;
    z-index: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px;
    text-align: center;
  }

  .platform-icon {
    width: 120px;
    height: 120px;
    margin-bottom: 24px;
    position: relative;
    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);

    &::before {
      content: "";
      position: absolute;
      inset: -10px;
      background: radial-gradient(
        circle,
        rgba(255, 255, 255, 0.1) 0%,
        transparent 70%
      );
      border-radius: 50%;
      opacity: 0;
      transition: opacity 0.5s ease;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      filter: brightness(1.2) drop-shadow(0 4px 20px rgba(0, 0, 0, 0.3));
      transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
    }
  }

  .platform-title {
    font-size: 24px;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 12px;
    transition: all 0.3s ease;
  }

  .platform-desc {
    font-size: 14px;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.6);
    transition: all 0.3s ease;
  }

  // Hover效果
  &:hover {
    transform: translateY(-12px) scale(1.02);
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);

    .card-glow {
      opacity: 1;
    }

    .card-shine {
      transform: translateX(100%) translateY(100%) rotate(45deg);
    }

    .platform-icon {
      transform: scale(1.15) rotateY(10deg);

      &::before {
        opacity: 1;
      }

      img {
        filter: brightness(1.4) drop-shadow(0 8px 30px rgba(255, 255, 255, 0.2));
      }
    }

    .platform-title {
      color: #ffffff;
      text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
    }

    .platform-desc {
      color: rgba(255, 255, 255, 0.85);
    }
  }

  // 主题色高亮
  &.platform-card-1:hover .platform-title {
    color: #5b8ef7;
  }

  &.platform-card-2:hover .platform-title {
    color: #f0b90b;
  }

  &.platform-card-3:hover .platform-title {
    color: #a78bfa;
  }

  &.platform-card-4:hover .platform-title {
    color: #34d399;
  }

  // 3D透视效果
  &:hover {
    transform-style: preserve-3d;
  }
}
</style>
