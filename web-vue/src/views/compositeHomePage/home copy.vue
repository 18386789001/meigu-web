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
            class="btn-register"
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

    <!-- 公告 -->
    <div class="notice-box mt-8" scope>
      <notice-bar />
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

    <!-- 卓越交易者 -->
    <pc-section>
      <div class="section3">
        <h2 class="text-white">{{ t("h-s3-t1") }}</h2>
        <h5 class="w-500 mb-12 text-white">{{ t("h-s3-d1") }}</h5>
        <el-button class="white-small-btn" @click="gotoPage('/tradingview')">{{
          t("liaojiegengduao")
        }}</el-button>
      </div>
    </pc-section>

    <!-- 为什么选择Coinstore -->
    <pc-section class="section4 bg-white text-center pt-12">
      <h2 style="text-align: left">
        {{ t("h-s2-2-t1", { TITLE: $title }) }}
      </h2>
      <!-- <h2>{{ t("h-s4-t1") }}</h2>
      <h2>{{ t("h-s4-t2") }}</h2> -->
      <div class="grid grid-cols-2 gap-4 my-12">
        <card-advantage
          @click="gotoPage(item.url)"
          v-for="(item, i) in advantageList4"
          :key="i"
          :title="t(`h-s4-${i + 1}-t1`)"
          :desc="t(`h-s4-${i + 1}-d1`)"
          :imgPath="`/src/assets/images/compositeHome/home/iphone${i + 1}.png`"
        />
      </div>
    </pc-section>

    <!-- 一个账户，多个交易平台 -->
    <pc-section class="bd-gray py-12">
      <h2>{{ t("h-s5-t1") }}</h2>
      <!-- <h2>{{ t("h-s5-t2") }}</h2> -->
      <div class="grid grid-cols-4 gap-x-4 mt-12">
        <card-platform
          v-for="(item, i) in platformList4"
          @click="gotoPage(item.url)"
          :key="i"
          :title="t(`h-s5-${i + 1}-t1`)"
          :desc="t(`h-s5-${i + 1}-d1`)"
          :imgPath="`/src/assets/images/compositeHome/home/trade${i + 1}.png`"
        />
      </div>
    </pc-section>

    <!-- 立即注册并开始交易 -->
    <section class="section6 py-12">
      <h2 class="text-center text-white">{{ t("h-s5-t2") }}</h2>
      <div class="flex justify-center py-8">
        <el-input v-model="input" :placeholder="t('email')" />
        <div
          class="join bg-blue-500 flex justify-center items-center text-white"
        >
          {{ t("jiaru") }}
        </div>
      </div>
      <h6
        class="text-center text-white cursor-pointer"
        @click="gotoPage('pdf.js/SCB_Privacy_Policy_ROW.pdf')"
      >
        {{ t("h-s5-d1") }}
      </h6>
    </section>
    <!-- 让您的交易如虎添翼 -->
    <pc-section class="bd-gray py-12">
      <h2 class="mb-10">{{ t("h-s6-t1") }}</h2>
      <div class="grid grid-cols-3 gap-x-8">
        <card-trade
          v-for="(item, i) in articleList3"
          @click="gotoPage(item.url)"
          :key="i"
          :title="t(`h-s6-${i + 1}-t1`)"
          :desc="t(`h-s6-${i + 1}-d1`)"
          :imgPath="`/src/assets/images/compositeHome/home/article${i + 1}.png`"
          :tag="t(`h-s6-${i + 1}-b1`)"
        ></card-trade>
      </div>
      <h5
        class="mt-12 text-center cursor-pointer font-normal"
        @click="gotoPage('/market-analysis')"
      >
        {{ t("h-s6-d1") }}
      </h5>
    </pc-section>

    <!-- 年度最佳经济商 -->
    <pc-section class="pt-20">
      <div class="section8-bg p-20 flex justify-between">
        <div>
          <h2 class="text-white">{{ t("h-s7-t1") }}</h2>
          <h2 class="text-white">{{ t("h-s7-t2") }}</h2>
          <h5 class="text-white mb-4">
            {{ t("h-s7-d1") }}
          </h5>
          <el-button
            class="blue-middle-btn"
            round
            @click="gotoPage('/tradingview')"
            >{{ t("liaojiegengduao") }}</el-button
          >
        </div>
        <div class="flex flex-col justify-center items-center">
          <img
            style="width: 42.5px; height: 22.5px"
            v-lazy="getImages('compositeHome/home/biaozhi.png')"
            alt=""
          />
          <img
            style="width: 120px; height: 120px; margin-top: 31.5px"
            v-lazy="getImages('compositeHome/home/icon-bg-blue.png')"
            alt=""
          />
          <div class="font-size24 text-white" style="margin-top: 15px">
            {{ $title }}
          </div>
          <div class="font-size40" style="color: #f9f891">
            {{ t("message.home.niandujingxiaoshang") }}
          </div>
          <span class="font-size40" style="color: #f9f891">2022</span>
        </div>
      </div>
    </pc-section>
    <!-- 在全球范围内，我们被授予 -->
    <pc-section class="py-20">
      <div class="text-sm text-center">{{ t("h-s8-t1") }}</div>
      <h2 class="text-center">{{ t("h-s8-t2") }}</h2>
      <div class="flex justify-center">
        <img
          class="inline-block"
          v-for="(item, index) in list6"
          :key="index"
          :src="getImageUrl(`${awardPrefix}${index + 1}.png`)"
          width="174"
          height="110"
        />
      </div>
    </pc-section>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";

import Axios from "@/api/currency.js";
import cardAdvantage from "@comCompositeHome/home/cardAdvantage.vue";
import cardPlatform from "@comCompositeHome/home/cardPlatform.vue";
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

  .btn-register {
    background: #000000;
    color: #ffffff;
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
</style>
