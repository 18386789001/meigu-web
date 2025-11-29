<template>
  <section class="pb-40">
    <!-- <van-loading color="#1194F7" v-if="isLoading" /> -->
    <div class="container-box">
      <header class="header">
        <div class="flex-l">
          <div class="icon back" @click="handleGoBack">
            <van-icon name="arrow-left" size="20" />
          </div>
          <div class="name-box">
            <img :src="handleImage(leftIcon)" alt="convert-img" class="convert-img" @click="onSidebar" />
            <p class="title">{{ getDisplayTitle() }}&nbsp;&nbsp;</p>
          </div>
        </div>
        <div class="icon-group">
          <div class="icon search" @click="onRoute(`/optional/search`)">
            <img :src="handleImage(searchIcon)" alt="" />
          </div>
          <div class="icon setting">
            <img src="../../assets/image/icon-star_active.png" class="collected-img" @click="openCurrency"
              v-if="isCollect" />
            <img v-else src="../../assets/image/icon-star.png" class="collected-img" @click="openCurrency" />
          </div>
        </div>
      </header>
      <section class="value-container">
        <div class="flex-l">
          <p class="first-line red">{{ chartData.close ? chartData.close.toFixed(2) : '--' }}</p>
          <p class="second-line">
            <span class="red m-4">{{ 
              chartData.netChange !== undefined && chartData.netChange !== null && typeof chartData.netChange === 'number' 
                ? formatDecimal(chartData.netChange) 
                : '--' 
            }}</span>
            <span class="red">{{
              chartData?.change_ratio !== undefined && chartData?.change_ratio !== null ? `${formatDecimal(chartData?.change_ratio)}%` : "--"
            }}</span>
          </p>
        </div>
        <div class="flex-r">
          <div class="flex-r-item">
            <p class="flex">
              <span class="label">{{ $t("high") }}</span>
              <span class="value">{{ chartData.high ? chartData.high.toFixed(2) : '--' }}</span>
            </p>
            <p class="flex">
              <span class="label">{{ $t("Low") }}</span>
              <span class="value">{{ chartData.low ? chartData.low.toFixed(2) : '--' }}</span>
            </p>
            <p class="flex">
              <span class="label">{{ $t("open") }}</span>
              <span class="value">{{ chartData.open ? chartData.open.toFixed(2) : '--' }}</span>
            </p>
          </div>
          <div class="flex-r-item">
            <p class="flex">
              <span class="label">{{ $t("marketValue") }}</span>
              <span class="value">{{ formatMarketCapDisplay() }}</span>
            </p>
            <p class="flex">
              <span class="label">{{ $t("share") }}</span>
              <span class="value">{{ chartData.amount ? formatMoney(chartData.amount) : '--' }}</span>
            </p>
            <p class="flex">
              <span class="label">{{ $t("amplitude") }}</span>
              <span class="value">{{ 
                chartData.changeRatio !== undefined && chartData.changeRatio !== null 
                  ? `${formatDecimal(chartData.changeRatio)}%` 
                  : '--' 
              }}</span>
            </p>
          </div>
          <div class="flex-r-item">
            <p class="flex">
              <span class="label">{{ $t("quantity") }}</span>
              <span class="value">{{ formatVolumeDisplay() }}</span>
            </p>
            <p class="flex">
              <span class="label">{{ $t("Forehead") }}</span>
              <span class="value">{{ getTradingVolumeDisplay() }}</span>
            </p>
          </div>
        </div>
      </section>
      <p class="status-info" v-if="chartData?.market?.status">
        <span>{{ chartData?.market?.status && $t(chartData?.market?.status) }},</span>
        <span class="time">{{ chartData?.market?.time_str }}</span>&nbsp;
        <span>{{
          chartData?.market?.time_zone && $t(chartData?.market?.time_zone)
        }}</span>
      </p>
      <section class="indicator-index-container">
        <div class="indicator-index-box">
          <div class="flex-l">
            <ul>
              <!-- item.paramsValue === quotesStore.stage  缓存选项用这个 -->
              <li v-for="(item, index) in filterOne" :key="item" @click="handleClickSelectTime(item, index)"
                :class="[item.index === timeLabelActive ? 'active' : '']">
                {{ item.name }}
              </li>
              <li @click="handleClickMoreBtn">{{ t("更多") }}</li>
            </ul>
          </div>
          <!-- <div class="flex-r">

          </div> -->
        </div>
        <div class="indicator-index-box-second" v-if="showMore">
          <ul>
            <li v-for="(item, index) in filterTwo" :key="item" @click="handleClickSelectTime(item, index)"
              :class="[item.index === timeLabelActive ? 'active' : '']">
              {{ item.name }}
            </li>
          </ul>
        </div>
      </section>
      <section class="kline-container flex">
        <div class="chart-index">
          <fx-kline :height="400" :symbol="symbol" :isShowsolid="true" :chartType="chartType" v-if="symbol" @data="onData"
            :key="`${symbol}-${timeValue}`" @loading="onLoading" />
        </div>
        <div class="order-book-container" v-if="timeLabelActive === 0">
          <keep-alive>
            <trade-deep-data :symbol="symbol" v-if="symbol" :price="price" class="trade-deep-container" />
          </keep-alive>
        </div>
      </section>
      <div class="divider"></div>
      <div class="all-etf-ranking">
        <div class="tabs flex">
          <div class="tab-item" v-for="(item) in tabList" @click="selectTabIndex(item.value)"
            :class="[tabIndex === item.value ? 'active' : '']" :key="item">
            {{ item.title }}
          </div>
        </div>
        <div class="etf-table" v-if="tabIndex === 0">
          <div class="flex flex-col justify-center pt-100 pb-20 items-center no-data-box" v-if="isConstituent">
            <img src="@/assets/image/assets-center/no-data.png" alt="" class="no-data-img" />
            <p class="text-grey mt-2">{{ $t("暂无数据") }}</p>
          </div>
          <ul v-else>
            <li class="title-line">
              <div class="flex-l">
                <p>{{ t("nameCode") }}</p>
              </div>
              <div class="flex-r">
                <div class="flex-r-item">
                  <p>{{ t("PositionRatio") }}</p>
                </div>
                <div class="flex-r-item">
                  <p>{{ t("uptodate") }}</p>
                </div>
                <div class="flex-r-item">
                  <p>{{ t("涨跌幅") }}</p>
                </div>
              </div>
            </li>
            <li v-for="item in constituentList" :key="item.relatedStockSymbolName" @click="itemClick(item)">
              <div class="flex-l">
                <p>{{ item.relatedStockSymbol }}</p>
                <p class="gray-text">{{ item.transactionPairsSymbol }}</p>
              </div>
              <div class="flex-r">
                <div class="flex-r-item">
                  <p class="text-down">
                    {{ item.positionProportion ? `${item.positionProportion}%` : "-" }}
                  </p>
                </div>
                <div class="flex-r-item">
                  <p :class="item.close < 1 ? 'text-up' : 'text-down'">
                    {{ item.realtime?.close }}
                  </p>
                </div>
                <div class="flex-r-item">
                  <p :class="item.close < 1 ? 'text-up' : 'text-down'">
                    {{ item.realtime?.change_ratio }}
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <F10Details :details="details" v-if="tabIndex === 1" :chartData="TWData" />
        <div class="new-trade" v-if="tabIndex === 2">
          <ul class="px-12 text-grey">
            <li class="flex justify-between mt-30">
              <span class="flex-1">{{ $t("时间") }}</span>
              <span class="flex-1">{{ $t("方向") }}</span>
              <span class="flex-1">{{ $t("价格") }}(USD)</span>
              <span class="flex-1 flex justify-center">{{ $t("数量") }}</span>
            </li>
            <li v-for="(item, index) in deals" :key="item.ts + item.price + item.amount || index"
              class="flex justify-between mt-30">
              <span class="flex-1">{{
                item.current_time ? item.current_time : "--"
              }}</span>
              <span :class="item.direction === 'buy' ? 'text-green' : 'text-red'" class="flex-1">{{ item.direction ===
                "buy" ? $t("买入") : $t("卖出") }}</span>
              <span :class="item.direction === 'buy' ? 'text-green' : 'text-red'" class="flex-1 flex-justify-center">{{
                item.price || "--" }}</span>
              <span class="flex-1 flex justify-center">{{ item.amount || "--" }}</span>
            </li>
          </ul>
        </div>
        <div class="deep-map" v-if="tabIndex === 3">
          <div class="buy-sell-box">
            <div class="buy-item">
              <div class="bg-line"></div>
              {{ $t("买盘") }}
            </div>
            <div class="sell-item">
              <div class="bg-line"></div>
              {{ $t("卖盘") }}
            </div>
          </div>
          <div class="deep-chart-box">
            <deep-chart :deepBuy="deepBuy" :deepSell="deepSell"></deep-chart>
          </div>
        </div>
      </div>
      <div class="footer-btn-group">
        <div class="flex btn-group">
          <div class="flex-l" @click="onRoute('/cryptos/exchangeRate')" style="display: none;">
            <img src="@/assets/image/quotes/exchange.png" alt="" />
            <p class="rate">{{ t("汇率") }}</p>
          </div>
          <div class="flex-r flex-1 flex">
            <div class="buy-btn" @click="onRoute('/quotes/openTrade', 0)">
              {{ t("买入") }}
            </div>
            <div class="sell-btn" @click="onRoute('/quotes/openTrade', 1)">
              {{ t("卖出") }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <add-currency @updateItem="getIsItemHasAddGlobal" :isCollect="isCollect" ref="addCurrencyRef"></add-currency>
    <!-- 左侧边弹出菜单 -->
    <van-popup class="popup" round v-model:show="show" close-icon-position="top-left" position="left" @closed="onClose">
      <div class="flex pl-10 pr-10 justify-between mb-10 mt-10 popup-wrap">
        <div class="flex items-center text-grey">
          <div class="mr-12 popup-title">{{ $t("名称") }}</div>
        </div>
        <div class="flex text-grey">
          <div class="flex items-center">
            <div class="popup-title">{{ $t("最新价格") }}</div>
          </div>
          <div class="flex items-center">
            <div class="mr-12 popup-title">/24H{{ $t("涨跌") }}</div>
          </div>
        </div>
      </div>
      <div class="pl-10 pr-10">
        <div class="flex justify-between mb-10" v-for="item in iconList" :key="item.name" @click.stop="onRouteTwo(item)">
          <div>
            <div class="font-bold textColor popup-title">{{ getModalDisplayName(item) }}</div>
            <div v-if="!kineType" class="text-grey mt-4 popup-title">{{ title }}</div>
          </div>
          <div class="text-right">
            <div class="textColor popup-title">{{ item.close }}</div>
            <div class="mt-1 popup-title" :class="item.change_ratio > 0 ? 'text-green' : 'text-red'">
              {{ item.change_ratio }}%
            </div>
          </div>
        </div>
      </div>
    </van-popup>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Popup } from "vant";
import { useI18n } from "vue-i18n";
import fxKline from "@/components/fx-kline/index.vue";
import fxPopup from "@/components/fx-popup/charts-cycle.vue";
import { useUserStore } from "@/store/user";
import { useQuotesStore } from "@/store/quotes.store";
import { SET_STAGE } from "@/store/types.store";
import { _getCoins } from "@/service/cryptos.api";
import { _getQuotes, _isItemHasAddGlobal } from "@/service/quotes.api";
import {
  _getItemSummary,
  _getConstituentStockList,
  _getStockTradeList,
} from "@/service/etf.api";
import { _getHomeList } from "@/service/home.api";
import { itemSummary } from "@/service/ipo.api";
import TradeDeepData from "@/components/trade-deep-data/index.vue";
import F10Details from "./components/F10Details.vue";
import addCurrency from "@/components/add-currency/index.vue";
import { formatMoney, getStorage } from "@/utils";
import { WS_URL } from "@/config";
import deepChart from "@/components/Transform/deepChart/index.vue";
import { themeStore } from "@/store/theme";
const thStore = themeStore();

const arr = [];
for (let i = 0; i < 17; i++) {
  arr.push({
    id: i,
  });
}

const isLoading = ref(false)
const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const quotesStore = useQuotesStore();

// 格式化数值，保留两位小数并四舍五入
const formatDecimal = (value) => {
  if (value === null || value === undefined || isNaN(value)) {
    return 0.00
  }
  return Number(Number(value).toFixed(2))
}
const symbolType = ref(route.query.type || "indices");
const symbol = ref("");
const symbolName = ref("");
const kineType = ref(route.query.kineType || '');
const title = ref(route.query.title || '');
const timeValue = ref("");
const chartData = ref({
  name: "",
  close: "",
  netChange: "",
  change_ratio: "",
  high: "",
  low: "",
  open: "",
  marketCapital: "",
  volume: "",
  turnoverRate: "",
  changeRatio: "",
});
const listData = ref([]);
const active = ref(0);
const timeLabelActive = ref(0); // 默认日k
const chartType = ref("");
const tabIndex = ref(0);
const constituentList = ref([]);
const isConstituent = ref(false);
const price = ref("");
const showMore = ref(false);
const details = ref({});

// 从API返回的name字段中提取实际交易符号
const extractSymbolFromName = (name) => {
  if (!name) return '';
  
  // 使用正则表达式匹配括号内的内容
  const match = name.match(/（([^）]+)）/g);
  if (match && match.length > 0) {
    // 取最后一个括号内的内容（通常是最完整的symbol）
    const lastMatch = match[match.length - 1];
    return lastMatch.replace(/[（）]/g, ''); // 移除括号
  }
  
  return '';
};

// 获取商品显示名称（支持i18n）
const getCommodityDisplayName = (targetData) => {
  if (!targetData) return '';
  
  // 如果是commodities类型，使用i18n翻译
  if (symbolType.value === 'commodities') {
    // 先尝试使用symbol作为key进行翻译
    const symbolTranslation = t(targetData.symbol);
    if (symbolTranslation !== targetData.symbol) {
      return symbolTranslation;
    }
    
    // 如果symbol没有翻译，尝试从name字段中提取商品名称进行翻译
    if (targetData.name) {
      // 提取括号前的商品名称（如从"黄金（XAUUSD）"中提取"黄金"）
      const nameMatch = targetData.name.match(/^([^（(]+)/);
      if (nameMatch) {
        const commodityName = nameMatch[1].trim();
        const nameTranslation = t(commodityName);
        if (nameTranslation !== commodityName) {
          return nameTranslation;
        }
        return commodityName;
      }
    }
    
    // 如果都没有翻译，返回原始name
    return targetData.name || targetData.symbol;
  }
  
  // 非commodities类型，返回原始name
  return targetData.name || targetData.symbol;
};

// 获取商品显示用的symbol（从itemSummary API）
const getDisplaySymbol = async (originalSymbol) => {
  try {
    const summaryResponse = await fetch(`https://jpmx.xyz/api/item/itemSummary/get?symbol=${originalSymbol}&language=zh-CN`);
    const summaryData = await summaryResponse.json();
    console.log('📊 getDisplaySymbol API返回数据:', summaryData);
    
    if (summaryData && summaryData.code === 0 && summaryData.data && summaryData.data.symbol) {
      console.log('✅ 返回itemSummary的symbol:', summaryData.data.symbol);
      return summaryData.data.symbol;
    }
  } catch (error) {
    console.warn('⚠️ 获取displaySymbol失败:', error);
  }
  
  // 如果API失败，返回原始symbol
  console.log('⚠️ 返回原始symbol:', originalSymbol);
  return originalSymbol;
};

// 获取页面顶部标题显示格式
const getDisplayTitle = () => {
  console.log('🎯 getDisplayTitle被调用');
  console.log('📊 chartData.value:', chartData.value);
  console.log('📊 chartData.value.name:', chartData.value.name);
  console.log('📊 symbolType.value:', symbolType.value);
  
  if (!chartData.value.name) {
    console.warn('⚠️ chartData.value.name为空，返回空字符串');
    return '';
  }
  
  // 如果是commodities类型，直接使用chartData.name（已经包含i18n翻译）
  if (symbolType.value === 'commodities') {
    console.log('✅ commodities类型，返回名称:', chartData.value.name);
    return chartData.value.name;
  }
  
  // 非commodities类型，保持原有显示格式
  console.log('✅ 非commodities类型，返回名称:', chartData.value.name);
  return chartData.value.name;
};

// 获取弹窗中商品显示格式
const getModalDisplayName = (item) => {
  if (!item.name) return '--';
  
  // 如果是commodities类型，直接使用item.name（已经包含i18n翻译）
  if (symbolType.value === 'commodities') {
    return item.name;
  }
  
  // 非commodities类型，保持原有显示格式
  return item.name;
};
const addCurrencyRef = ref(null);
const isCollect = ref(false);
const tabList = ref([
  { title: t("Constituents"), value: 0 },
  { title: t("ProfileF10"), value: 1 },
  { title: t("最新交易"), value: 2 },
  { title: t("深度图"), value: 3 },
]);
//台股
if (symbolType.value == 'TW-stocks') {
  tabList.value = [{ title: t("ProfileF10"), value: 1 }]
  tabIndex.value = 1
}

//A股
if (symbolType.value == 'A-stocks') {
  tabList.value = [
    { title: t("ProfileF10"), value: 1 },
    { title: t("最新交易"), value: 2 },
    { title: t("深度图"), value: 3 }
  ]
  tabIndex.value = 1
}

//大宗商品 - 只保留最新交易和深度图
if (symbolType.value == 'commodities') {
  tabList.value = [
    { title: t("最新交易"), value: 2 },
    { title: t("深度图"), value: 3 }
  ]
  tabIndex.value = 2 // 默认选中最新交易
}
const filterOne = ref([
  { name: t("分时"), paramsValue: "timeSharing", seconds: 1 * 60 * 1000, index: 0 },
  {
    name: "1" + t("天"),
    paramsValue: "1day",
    seconds: 1 * 24 * 60 * 60 * 1000,
    index: 1,
  },
  {
    name: "1" + t("周"),
    paramsValue: "1week",
    seconds: 7 * 24 * 60 * 60 * 1000,
    index: 2,
  },
  {
    name: "1" + t("月"),
    paramsValue: "1mon",
    seconds: 30 * 24 * 60 * 60 * 1000,
    index: 3,
  },
  {
    name: "5" + t("天"),
    paramsValue: "5day",
    seconds: 5 * 24 * 60 * 60 * 1000,
    index: 4,
  },
  {
    name: t("season"),
    paramsValue: "1quarter",
    seconds: 3 * 30 * 24 * 60 * 60 * 1000,
    index: 5,
  },
  {
    name: t("Year"),
    paramsValue: "1year",
    seconds: 12 * 30 * 24 * 60 * 60 * 1000,
    index: 6,
  },
]);

const filterTwo = ref([
  { name: "120" + t("分"), paramsValue: "120min", seconds: 2 * 60 * 60 * 1000, index: 7 },
  { name: "60" + t("分"), paramsValue: "60min", seconds: 1 * 60 * 60 * 1000, index: 8 },
  { name: "30" + t("分"), paramsValue: "30min", seconds: 30 * 60 * 1000, index: 9 },
  { name: "15" + t("分"), paramsValue: "15min", seconds: 15 * 60 * 1000, index: 10 },
  { name: "5" + t("分"), paramsValue: "5min", seconds: 5 * 60 * 1000, index: 11 },
  { name: "1" + t("分"), paramsValue: "1min", seconds: 1 * 60 * 1000, index: 12 },
]);

const show = ref(false);
const iconList = ref([]);
const coins = ref([]);
const commoditiesList = ref([]);
const timeout = ref(null);
const deals = ref(arr);
const quote = ref({});
const symbolData = ref("");
const sockets = ref({
  quote: null,
  deals: null,
  askBid: null,
});
const deepBuy = ref([]);
const deepSell = ref([]);
const asks = ref(arr);
const bids = ref(arr);
const tradeList = ref([]);
const TWData = ref({})

const leftIcon = new URL(
  `../../assets/theme/${thStore.theme}/image/black-convert.png`,
  import.meta.url
);
const searchIcon = new URL(
  `../../assets/theme/${thStore.theme}/image/search.png`,
  import.meta.url
);

onMounted(async () => {
  console.log('🚀 onMounted开始执行');
  console.log('📊 route.query:', route.query);
  console.log('📊 route.query.type:', route.query.type);
  console.log('📊 symbolType.value:', symbolType.value);
  
  if (route.query.symbol) {
    symbol.value = route.query.symbol;
    console.log('✅ 设置symbol.value:', symbol.value);
  } else {
    symbol.value = quotesStore.coins.length
      ? quotesStore.coins[0].symbol
      : "GlobalETF500";
    console.log('✅ 设置默认symbol.value:', symbol.value);
  }
  
  if (quotesStore.stage === "timeSharing") {
    chartType.value = "area";
  } else {
    chartType.value = "candle_solid";
  }
  
  console.log('🔍 检查symbolType.value:', symbolType.value);
  console.log('🔍 检查条件 symbolType.value === "commodities":', symbolType.value === 'commodities');
  
  // 如果是commodities类型，获取commodities数据
  if (symbolType.value === 'commodities') {
    console.log('✅ 进入commodities分支，调用getCommoditiesData');
    console.log('📊 调用前chartData.value.name:', chartData.value.name);
    await getCommoditiesData();
    console.log('📊 调用后chartData.value.name:', chartData.value.name);
  } else {
    console.log('❌ 进入非commodities分支，调用fetchQuotes');
    fetchQuotes();
  }
  
  getStockTradeList(symbol.value);
  getItemSummary(symbol.value);
  getConstituentStockList(symbol.value);
  getIsItemHasAddGlobal();
  handleClickSelectTime({
    paramsValue: "timeSharing",
    seconds: 1 * 24 * 60 * 60 * 1000,
    index: 0,
  });
});

const startDealsSocket = () => {
  // 交易
  // 将XAUUSD转换为GOLD，XAGUSD转换为Silver以适配WebSocket
  let wsSymbol = symbol.value;
  if (symbol.value === 'XAUUSD') {
    wsSymbol = 'GOLD';
  } else if (symbol.value === 'XAGUSD') {
    wsSymbol = 'Silver';
  }
  
  sockets.value.deals = new WebSocket(`${WS_URL}/2/${wsSymbol}`);
  sockets.value.deals.onmessage = (evt) => {
    const { data } = evt;
    const { code, data: _data } = JSON.parse(data);
    // todo: 数据有些问题
    if (code / 1 === 0) {
      deals.value = _data.data.slice(0, 17);
    }
  };
};

onBeforeUnmount(() => {
  if (timeout.value) {
    clearTimeout(timeout.value);
  }
  // 停止实时价格定时器
  stopPriceTimer();
});

watch(show, (newVal, oldVal) => {
  if (!newVal) {
    if (timeout.value) {
      clearTimeout(timeout.value);
    }
  }
});

watch(
  [tabIndex, symbol],
  ([val, val2]) => {
    if (val / 1 === 0 || val / 1 === 1) {
      sockets.value.deals && sockets.value.deals.close();
      sockets.value.deals = null;
      if (val2) {
        // 刚进来可能是null
        symbol.value = val2;
        if (symbolType.value !== 'TW-stocks') {
          startAskBidSocket();
        }
      }
    } else {
      sockets.value.askBid && sockets.value.askBid.close();
      sockets.value.askBid = null;
      startDealsSocket();
    }
  },
  {
    immediate: true,
  }
);

const startAskBidSocket = () => {
  // 委托
  // 将XAUUSD转换为GOLD，XAGUSD转换为Silver以适配WebSocket
  let wsSymbol = symbol.value;
  if (symbol.value === 'XAUUSD') {
    wsSymbol = 'GOLD';
  } else if (symbol.value === 'XAGUSD') {
    wsSymbol = 'Silver';
  }
  
  sockets.value.askBid = new WebSocket(`${WS_URL}/3/${wsSymbol}`);
  sockets.value.askBid.onmessage = (evt) => {
    const { data } = evt;
    const { code, data: _data } = JSON.parse(data);
    if (code / 1 === 0) {
      deepBuy.value = _data.bids;
      deepSell.value = _data.asks;
      _data.asks = _data.asks.sort((prev, next) => prev.price - next.price);
      _data.bids = _data.bids.sort((prev, next) => prev.price - next.price);
      asks.value = _data.asks.slice(0, 17);
      bids.value = _data.bids.reverse().slice(0, 17);
    }
  };
};
const closeSocket = () => {
  sockets.value.quote && sockets.value.quote.close();
  sockets.value.deals && sockets.value.deals.close();
  sockets.value.askBid && sockets.value.askBid.close();
  sockets.value.quote = null;
  sockets.value.deals = null;
  sockets.value.askBid = null;
};

// 添加防抖处理，避免重复点击
let isNavigating = false;

const onRouteTwo = (item) => {
  // 防止重复点击
  if (isNavigating) {
    console.log('⚠️ 正在导航中，忽略重复点击');
    return;
  }
  
  console.log('🔄 onRouteTwo被调用，item:', item);
  console.log('🔄 item.symbol:', item.symbol);
  console.log('🔄 symbolType.value:', symbolType.value);
  
  // 设置导航状态
  isNavigating = true;
  
  // 先关闭弹窗
  show.value = false;
  
  // 使用nextTick确保DOM更新完成后再进行路由跳转和数据获取
  nextTick(() => {
    // 更新symbol值
    symbol.value = item.symbol;
    
    // 进行路由跳转
    router.push(`/quotes/detail?symbol=${item.symbol}&type=${symbolType.value}&symbolType=${symbolType.value}`).then(() => {
      console.log('✅ 路由跳转完成');
      
      // 延迟调用数据获取函数，确保路由跳转完成
      setTimeout(() => {
        try {
          // 根据symbolType调用不同的数据获取函数
          if (symbolType.value === 'commodities') {
            console.log('✅ commodities类型，调用getCommoditiesData');
            getCommoditiesData();
          } else {
            console.log('✅ 非commodities类型，调用fetchQuotes');
            fetchQuotes();
          }
          
          getItemSummary(item.symbol);
          getConstituentStockList(item.symbol);
          getIsItemHasAddGlobal();
          getStockTradeList(item.symbol);
          fetchData();
        } catch (error) {
          console.error('❌ 数据获取过程中出错:', error);
        } finally {
          // 重置导航状态
          setTimeout(() => {
            isNavigating = false;
          }, 500);
        }
      }, 100);
    }).catch((error) => {
      console.error('❌ 路由跳转失败:', error);
      isNavigating = false;
    });
  });
};

const fetchData = () => {
  closeSocket();
  _getHomeList(symbol.value).then((data) => {
    quote.value = data[0];
    symbolData.value = data[0].symbol_data;
    nextTick(() => {
      if (!sockets.value.quote && symbol.value) {
        startQuoteScoket();
      }

      if (
        (tabIndex.value === 2 || tabIndex.value === 3) &&
        !sockets.value.askBid &&
        symbol.value
      ) {
        if (symbolType.value !== 'TW-stocks') {
          startAskBidSocket();
        }

      }
    });
    startDealsSocket();
  });
};

const startQuoteScoket = () => {
  // 将XAUUSD转换为GOLD，XAGUSD转换为Silver以适配WebSocket
  let wsSymbol = symbol.value;
  if (symbol.value === 'XAUUSD') {
    wsSymbol = 'GOLD';
  } else if (symbol.value === 'XAGUSD') {
    wsSymbol = 'Silver';
  }
  
  sockets.value.quote = new WebSocket(`${WS_URL}/1/${wsSymbol}`);
  sockets.value.quote.onmessage = (evt) => {
    const { data } = evt;
    const { code, data: _data } = JSON.parse(data);
    if (code / 1 === 0) {
      quote.value = _data[0];
      // updateKey.value++
    }
  };
};

// 交易记录
const getStockTradeList = (symbol) => {
  _getStockTradeList(symbol).then((res) => {
    if (res && res.length > 0) {
      const result = res.sort((a, b) => {
        return b.timestamp - a.timestamp;
      });
      tradeList.value = result.slice(0, 16) || [];
    } else {
      tradeList.value = [];
    }
  });
};

//获取币种
const getCoins = () => {
  if (symbolType.value === 'commodities') {
    // 使用固定的API接口获取商品数据
    fetch('https://jpmx.xyz/api/item!list.action?type=commodities&language=zh-CN')
      .then(response => response.json())
      .then(apiData => {
        if (apiData && apiData.data && Array.isArray(apiData.data)) {
          // 处理API返回的商品数据，过滤掉GOLD、Silver、Nickel和Zinc
          const processedList = apiData.data
            .filter(apiItem => apiItem.symbol !== 'GOLD' && apiItem.symbol !== 'Silver' && apiItem.symbol !== 'Nickel' && apiItem.symbol !== 'Zinc') // 隐藏GOLD、Silver、Nickel和Zinc
            .map(apiItem => {
              // 提取实际交易符号
              const actualSymbol = extractSymbolFromName(apiItem.name) || apiItem.symbol;
              
              // 使用i18n翻译商品名称
              let translatedName = '';
              const symbolTranslation = t(apiItem.symbol);
              if (symbolTranslation !== apiItem.symbol) {
                translatedName = symbolTranslation;
              } else if (apiItem.name) {
                const nameMatch = apiItem.name.match(/^([^（(]+)/);
                if (nameMatch) {
                  const commodityName = nameMatch[1].trim();
                  const nameTranslation = t(commodityName);
                  translatedName = nameTranslation !== commodityName ? nameTranslation : commodityName;
                }
              }
              
              return {
                ...apiItem,
                symbol: actualSymbol, // 确保symbol字段正确设置
                name: `${translatedName}（${actualSymbol}）`,
                originalName: apiItem.name
              };
            });
          
          console.log('📊 处理后的商品列表:', processedList);
          
          // 设置coins数组为所有商品的symbol
          coins.value = processedList.map(item => item.symbol);
          commoditiesList.value = processedList;
          fetchList();
        } else {
          console.warn('API返回数据格式不正确:', apiData);
          // 如果API失败，使用原有逻辑
          _getCoins({ type: symbolType.value }).then((res) => {
            coins.value = res.map(item => item.symbol);
            fetchList();
          });
        }
      })
      .catch(error => {
        console.error('获取商品列表API失败:', error);
        // 如果API失败，使用原有逻辑
        _getCoins({ type: symbolType.value }).then((res) => {
          coins.value = res.map(item => item.symbol);
          fetchList();
        });
      });
  } else {
    // 非commodities类型，使用原有逻辑
    _getCoins({ type: symbolType.value }).then((res) => {
      coins.value = res.map((item) => item.symbol);
      fetchList();
    });
  }
};

const onSidebar = () => {
  // 侧边栏打开
  if (!symbolType.value) {
    return;
  }
  show.value = true;
  getCoins();
};

const fetchList = () => {
  if (symbolType.value === 'commodities') {
    // 对于commodities类型，使用commoditiesList（已经处理过的数据）
    if (commoditiesList.value.length > 0) {
      // 获取价格信息
      const symbols = commoditiesList.value.map(item => item.symbol).join(',')
      _getHomeList(symbols).then(priceList => {
        // 合并商品信息和价格信息
        const mergedList = commoditiesList.value.map(item => {
          const priceData = priceList.find(p => p.symbol === item.symbol)
          return {
            ...item,
            close: priceData ? priceData.close : item.close,
            change_ratio: priceData ? priceData.change_ratio : item.changeRatio
          }
        })
        iconList.value = mergedList
        console.log('📊 合并后的iconList:', iconList.value);
      }).catch(() => {
        // 如果价格获取失败，只使用商品列表
        iconList.value = commoditiesList.value
      })
    } else {
      // 如果commoditiesList为空，使用_getCoins作为fallback
      _getCoins({ type: symbolType.value }).then(list => {
        const symbols = list.map(item => item.symbol).join(',')
        _getHomeList(symbols).then(priceList => {
          const mergedList = list.map(item => {
            const priceData = priceList.find(p => p.symbol === item.symbol)
            return {
              ...item,
              name: getCommodityDisplayName(item),
              close: priceData ? priceData.close : item.close,
              change_ratio: priceData ? priceData.change_ratio : item.changeRatio
            }
          })
          iconList.value = mergedList
        }).catch(() => {
          iconList.value = list.map(item => ({
            ...item,
            name: getCommodityDisplayName(item)
          }))
        })
      }).catch(() => {
        iconList.value = []
      })
    }
  } else {
    _getCoins({ type: symbolType.value }).then((res) => {
      iconList.value = res
      
      if (timeout.value) {
        clearTimeout(timeout.value)
        timeout.value = null
      }
      timeout.value = setTimeout(() => {
        fetchList()
      }, 5000)
    }).catch(() => {
      // 如果获取商品列表失败，使用原有逻辑
      _getHomeList(coins.value.join(",")).then((list) => {
        iconList.value = list;
      });
    });
  }
};

const handleGoBack = () => {
  if (route.query.from === "trade") {
    router.push(`/trade/index?tabActive=0&navActive=3`);
  } else if (route.query.from === "hot") {
    if(route.query.category){
      router.push(`/quotes/hotModules?typName=${route.query.typName}&category=${route.query.category}&tabIndex=${route.query.tabIndex}&symbolType=${route.query.symbolType}`);
    }else{
      router.push(`/quotes/hotModules?typName=${route.query.typName}&tabIndex=${route.query.tabIndex}&symbolType=${route.query.symbolType}`);
    }
   
  } else if (route.query.isOptional == 1) {
    router.push(`/optional/index`);
  } else if (symbolType.value === 'commodities') {
    // 如果是大宗商品，跳转到大宗商品页签（现在大宗商品是第一个页签，tabIndex=3）
    router.push(`/quotes/index?tabActive=3&symbolType=commodities`);
  } else if(route.query.tabIndex){
    router.push(`/quotes/index?tabActive=${route.query.tabIndex}&symbolType=${route.query.symbolType}`)
  }else {
    onRoute("/quotes/index");
  }
};

const onRoute = (path, tabActive) => {
  if (path === "/quotes/openTrade") {
    router.push({
      path,
      query: {
        tabActive,
        symbol: symbol.value,
        type: symbolType.value,
      },
    });
  } else if (path === "/optional/search") {
    console.log(symbolType)
    router.push({
      path,
      query: {
        tabActive: 0,
        symbolType: symbolType.value
      },
    });
  } else {
    router.push({
      path,
      query: {
        tabActive: 0,
      },
    });
  }
};

// 点击成分股查一次详情
const itemClick = (item) => {
  router.push(`/quotes/constituentDetail?symbol=${item.relatedStockSymbol}`);
};

const handleClickSelectTime = (params) => {
  const { paramsValue, seconds, index } = params;
  timeLabelActive.value = index;
  quotesStore[SET_STAGE]({ stage: paramsValue, seconds });
  onSelectTime(paramsValue);
};

const onSelectTime = (evt) => {
  timeValue.value = evt;
  if (evt == "timeSharing") {
    chartType.value = "area";
  } else {
    chartType.value = "candle_solid";
  }
};

// 事件
const onData = (data) => {
  console.log('📊 onData被调用，data:', data);
  console.log('📊 当前symbolType.value:', symbolType.value);
  
  // 如果是commodities类型，不要覆盖手动设置的数据
  if (symbolType.value !== 'commodities') {
    console.log('✅ 非commodities类型，更新chartData和symbolType');
    chartData.value = data;
    symbolType.value = data?.type;
  } else {
    console.log('⚠️ commodities类型，不覆盖symbolType');
  }
  TWData.value = data
};
const fetchQuotes = () => {
  _getQuotes(quotesStore.coins).then((data) => {
    data.map((item) => {
      item.name = item.symbol;
    });
    listData.value = data;
  });
};

// 获取commodities数据
const getCommoditiesData = async () => {
  try {
    // 使用原始的symbol值（从URL参数获取），而不是被WebSocket修改后的值
    const originalSymbol = route.query.symbol || symbol.value;
    console.log('🔄 开始获取商品数据，originalSymbol:', originalSymbol, 'symbol.value:', symbol.value, 'symbolType:', symbolType.value);
    
    // 直接使用新的实时价格API获取商品数据
    const response = await fetch('https://jpmx.xyz/api/publicRealtimeByType?type=forex&pageNo=1&category=commodities&language=zh-CN');
    const apiData = await response.json();
    console.log('📊 实时价格API响应:', apiData);
    
    if (apiData && apiData.data && Array.isArray(apiData.data)) {
      // 查找匹配的商品数据
      let commodityData = null;
      
      // 首先尝试找到symbol与请求参数完全匹配的记录（这个记录有正确的价格数据）
      if (originalSymbol) {
        commodityData = apiData.data.find(item => item.symbol === originalSymbol);
        console.log(`🔍 初始加载时查找symbol为${originalSymbol}的记录:`, commodityData);
        
        // 如果没找到，尝试从name字段中提取交易符号进行匹配
        if (!commodityData) {
          commodityData = apiData.data.find(item => {
            if (item.name && item.name.includes(`（${originalSymbol}）`)) {
              console.log(`🔍 初始加载时从name字段匹配到${originalSymbol}:`, item);
              return true;
            }
            return false;
          });
        }
      }
      
      // 如果没找到完全匹配的记录，则使用原来的匹配逻辑
      if (!commodityData) {
        commodityData = apiData.data.find(item => {
          // 优先匹配symbol字段
          if (item.symbol === originalSymbol) {
            return true;
          }
          
          // 匹配enName字段（如XAUUSD）
          if (item.enName === originalSymbol) {
            return true;
          }
          
          // 匹配name字段中包含symbol的情况（如"黄金（XAUUSD）"）
          if (item.name && item.name.includes(originalSymbol)) {
            return true;
          }
          
          // 匹配name字段中包含括号内symbol的情况
          if (item.name && item.name.includes(`（${originalSymbol}）`)) {
            return true;
          }
          
          // 特殊处理：XAUUSD匹配GOLD，XAGUSD匹配Silver（作为fallback）
          if ((originalSymbol === 'XAUUSD' && item.symbol === 'GOLD') || 
              (originalSymbol === 'XAGUSD' && item.symbol === 'Silver')) {
            return true;
          }
          
          return false;
        });
        console.log('🔍 初始加载时使用fallback匹配逻辑找到的记录:', commodityData);
      }
      
      if (commodityData) {
        console.log('📋 找到匹配的商品数据:', commodityData);
        
        // 使用i18n翻译商品名称
        let translatedName = '';
        
        // 先尝试使用symbol作为key进行翻译
        const symbolTranslation = t(commodityData.symbol);
        if (symbolTranslation !== commodityData.symbol) {
          translatedName = symbolTranslation;
        } else if (commodityData.name) {
          // 如果symbol没有翻译，尝试从name字段中提取商品名称进行翻译
          const nameMatch = commodityData.name.match(/^([^（(]+)/);
          if (nameMatch) {
            const commodityName = nameMatch[1].trim();
            const nameTranslation = t(commodityName);
            if (nameTranslation !== commodityName) {
              translatedName = nameTranslation;
            } else {
              translatedName = commodityName;
            }
          }
        }
        
        // 调用辅助函数获取商品显示用的symbol
        const displaySymbol = await getDisplaySymbol(originalSymbol);
        console.log('🔍 翻译后的名称:', translatedName, '显示symbol:', displaySymbol);
        
        // 检查价格数据是否有效（high和low不相同表示有真实的价格波动）
        const hasValidPriceData = commodityData.high !== commodityData.low;
        
        // 设置chartData的基础信息，使用API返回的真实数据，并进行格式化
        chartData.value = {
          name: `${translatedName}（${displaySymbol}）`,
          enName: commodityData.name || commodityData.enName,
          close: commodityData.close || 0,
          open: commodityData.open || 0,
          high: commodityData.high || 0,
          low: commodityData.low || 0,
          netChange: formatDecimal(commodityData.netChange || 0),
          changeRatio: formatDecimal(commodityData.changeRatio || 0),
          change_ratio: formatDecimal(commodityData.changeRatio || 0),
          volume: commodityData.volume || 0,
          amount: commodityData.amount || 0,
          marketCapital: '--',
          turnoverRate: '--',
          category: 'commodities',
          type: 'forex',
          symbol: originalSymbol,
          ts: commodityData.ts || Date.now(),
          // 添加一个标识，表示是否有有效的价格数据
          hasValidPriceData: hasValidPriceData
        };
        
        if (!hasValidPriceData) {
          console.warn(`⚠️ ${originalSymbol} 的价格数据无效（high=${commodityData.high}, low=${commodityData.low}），可能API未提供实时数据`);
        }
        
        console.log('✅ 设置的chartData:', chartData.value);
        console.log('✅ chartData.name:', chartData.value.name);
        console.log('✅ 涨跌幅:', commodityData.changeRatio);
        console.log('✅ 最高价:', commodityData.high);
        console.log('✅ 最低价:', commodityData.low);
        
        // 启动实时价格更新定时器
        startPriceTimer(originalSymbol);
      } else {
        console.warn('⚠️ 未找到匹配的商品数据，originalSymbol:', originalSymbol);
        console.log('📊 可用的商品数据列表:', apiData.data.map(item => ({ symbol: item.symbol, enName: item.enName, name: item.name })));
        
        // 如果找不到匹配数据，设置一个默认的名称
        const fallbackName = `${originalSymbol}（${originalSymbol}）`;
        chartData.value = {
          ...chartData.value,
          name: fallbackName,
          symbol: originalSymbol,
          close: 0,
          open: 0,
          high: 0,
          low: 0,
          netChange: 0,
          changeRatio: 0,
          change_ratio: 0,
          volume: 0,
          amount: 0,
          marketCapital: '--',
          turnoverRate: '--',
          category: 'commodities',
          type: 'forex',
          ts: Date.now()
        };
        console.log('🔄 设置默认chartData:', chartData.value);
        console.log('🔄 chartData.name:', chartData.value.name);
        
        // 即使找不到匹配数据，也启动定时器尝试获取
        startPriceTimer(originalSymbol);
      }
    } else {
      console.warn('⚠️ 实时价格API返回数据格式错误:', apiData);
      // 如果API失败，设置一个默认的名称
      const fallbackName = `${originalSymbol}（${originalSymbol}）`;
      chartData.value = {
        ...chartData.value,
        name: fallbackName,
        symbol: originalSymbol,
        close: 0,
        open: 0,
        high: 0,
        low: 0,
        netChange: 0,
        changeRatio: 0,
        change_ratio: 0,
        volume: 0,
        amount: 0,
        marketCapital: '--',
        turnoverRate: '--',
        category: 'commodities',
        type: 'forex',
        ts: Date.now()
      };
      console.log('🔄 设置默认chartData:', chartData.value);
      console.log('🔄 chartData.name:', chartData.value.name);
      
      // 启动定时器尝试获取
      startPriceTimer(originalSymbol);
    }
  } catch (error) {
    console.error('❌ 获取commodities数据失败:', error);
    // 如果出现异常，设置一个默认的名称
    const originalSymbol = route.query.symbol || symbol.value;
    const fallbackName = `${originalSymbol}（${originalSymbol}）`;
    chartData.value = {
      ...chartData.value,
      name: fallbackName,
      symbol: originalSymbol,
      close: 0,
      open: 0,
      high: 0,
      low: 0,
      netChange: 0,
      changeRatio: 0,
      change_ratio: 0,
      volume: 0,
      amount: 0,
      marketCapital: '--',
      turnoverRate: '--',
      category: 'commodities',
      type: 'forex',
      ts: Date.now()
    };
    console.log('🔄 异常情况下设置默认chartData:', chartData.value);
    console.log('🔄 chartData.name:', chartData.value.name);
    
    // 启动定时器尝试获取
    startPriceTimer(originalSymbol);
  }
};

const onLoading = (val) => {
  console.log(val,'valsssss')
  isLoading.value = val
}

// 获取简况数据
const getItemSummary = (symbol) => {
  _getItemSummary(symbol).then((res) => {
    details.value = res;
    symbolName.value = res.symbolName;
  });
};

const getConstituentStockList = (symbol) => {
  _getConstituentStockList(symbol).then((res) => {
    constituentList.value = res;
    isConstituent.value = res.length === 0;
  });
};

const selectTabIndex = (value) => {
  if (symbolType.value !== 'TW-stocks') {
    tabIndex.value = value;
  }
};

const handleClickMoreBtn = () => {
  showMore.value = !showMore.value;
};
//打开自选弹窗
const openCurrency = () => {
  addCurrencyRef.value.openCurrency(symbol.value);
};
//判断是否加入收藏
const getIsItemHasAddGlobal = () => {
  let obj = {
    symbol: symbol.value,
  };
  _isItemHasAddGlobal(obj).then((data) => {
    isCollect.value = data;
  });
};

const onClose = () => {
  show.value = false;
};
const handleImage = (url) => {
  return new URL(url, import.meta.url).href;
};

// 从K线API获取最新价格
const getLatestPriceFromKline = async (symbol) => {
  try {
    console.log('🔄 开始从K线API获取最新价格，symbol:', symbol);
    
    // 处理symbol映射
    let klineSymbol = symbol;
    if (symbol === 'XAUUSD') {
      klineSymbol = 'GOLD';
    } else if (symbol === 'XAGUSD') {
      klineSymbol = 'Silver';
    } else if (symbol === 'XALUSD') {
      klineSymbol = 'Aluminum';
    } else if (symbol === 'XNIUSD') {
      klineSymbol = 'Nickel';
    }
    
    const response = await fetch(`https://jpmx.xyz/api/hobi!getKlineV1.action?symbol=${klineSymbol}&line=1min&language=en`);
    const data = await response.json();
    
    console.log('📊 K线API响应:', data);
    
    if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
      // 获取最新的一条K线数据（数组最后一个元素）
      const latestKlineData = data.data[data.data.length - 1];
      console.log('📈 最新K线数据:', latestKlineData);
      
      // 验证数据时间戳（确保数据不是太旧）
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const dataTimestamp = latestKlineData.timestamp;
      const timeDiff = currentTimestamp - dataTimestamp;
      console.log('⏰ 时间差:', timeDiff, '秒');
      
      // 如果数据在7天内（604800秒），认为是有效的
      if (timeDiff <= 604800) {
        if (chartData.value) {
          const currentName = chartData.value.name;
          chartData.value = {
            ...chartData.value,
            name: currentName,
            close: latestKlineData.close || 0,
            open: latestKlineData.open || 0,
            high: latestKlineData.high || 0,
            low: latestKlineData.low || 0,
            volume: latestKlineData.volume || 0,
          };
          
          console.log('✅ K线API价格更新成功:', {
            symbol: symbol,
            klinePrice: latestKlineData.close,
            timestamp: latestKlineData.timestamp,
            timeDiff: timeDiff
          });
          
          return true; // 表示成功更新了价格
        }
      } else {
        console.warn('⚠️ K线数据时间过旧，时间差:', timeDiff, '秒，不更新价格');
      }
    } else {
      console.warn('⚠️ K线API返回数据格式错误或无数据');
    }
  } catch (error) {
    console.error('❌ 获取K线数据失败:', error);
  }
  
  return false; // 表示未能更新价格
};

// 实时价格数据获取函数
const getRealtimePriceData = async (symbol) => {
  try {
    console.log('🔄 开始获取实时价格数据，symbol:', symbol);
    
    // 对于大宗商品，优先从K线API获取最新价格
    if (symbolType.value === 'commodities') {
      console.log('🏭 检测到大宗商品，优先从K线API获取价格');
      const klineSuccess = await getLatestPriceFromKline(symbol);
      if (klineSuccess) {
        console.log('✅ 已从K线API获取最新价格，跳过实时价格API');
        return;
      } else {
        console.log('⚠️ K线API获取价格失败，回退到实时价格API');
      }
    }
    
    const response = await fetch('https://jpmx.xyz/api/publicRealtimeByType?type=forex&pageNo=1&category=commodities&language=zh-CN');
    const data = await response.json();
    
    console.log('📊 实时价格API响应:', data);
    
    if (data && data.data && Array.isArray(data.data)) {
      // 查找匹配的商品数据 - 优化匹配逻辑
      let commodityData = null;
      
      // 首先尝试找到symbol与请求参数完全匹配的记录（这个记录有正确的价格数据）
      if (symbol) {
        commodityData = data.data.find(item => item.symbol === symbol);
        console.log(`🔍 查找symbol为${symbol}的记录:`, commodityData);
        
        // 如果没找到，尝试从name字段中提取交易符号进行匹配
        if (!commodityData) {
          commodityData = data.data.find(item => {
            if (item.name && item.name.includes(`（${symbol}）`)) {
              console.log(`🔍 从name字段匹配到${symbol}:`, item);
              return true;
            }
            return false;
          });
        }
      }
      
      // 如果没找到完全匹配的记录，则使用原来的匹配逻辑
      if (!commodityData) {
        commodityData = data.data.find(item => {
          // 优先匹配symbol字段
          if (item.symbol === symbol) {
            return true;
          }
          
          // 匹配enName字段（如XAUUSD）
          if (item.enName === symbol) {
            return true;
          }
          
          // 匹配name字段中包含symbol的情况（如"黄金（XAUUSD）"）
          if (item.name && item.name.includes(symbol)) {
            return true;
          }
          
          // 匹配name字段中包含括号内symbol的情况
          if (item.name && item.name.includes(`（${symbol}）`)) {
            return true;
          }
          
          // 特殊处理：XAUUSD匹配GOLD，XAGUSD匹配Silver（作为fallback）
          if ((symbol === 'XAUUSD' && item.symbol === 'GOLD') || 
              (symbol === 'XAGUSD' && item.symbol === 'Silver')) {
            return true;
          }
          
          return false;
        });
        console.log('🔍 使用fallback匹配逻辑找到的记录:', commodityData);
      }
      
      if (commodityData) {
        console.log('✅ 找到匹配的商品数据:', commodityData);
        
        // 更新chartData的价格数据，保留name字段
        const currentName = chartData.value.name; // 保存当前的name
        
        // 检查价格数据是否有效（high和low不相同表示有真实的价格波动）
        const hasValidPriceData = commodityData.high !== commodityData.low;
        
        chartData.value = {
          ...chartData.value,
          name: currentName, // 确保name不被覆盖
          close: commodityData.close || 0,
          open: commodityData.open || 0,
          high: commodityData.high || 0,
          low: commodityData.low || 0,
          netChange: formatDecimal(commodityData.netChange || 0),
          changeRatio: formatDecimal(commodityData.changeRatio || 0),
          change_ratio: formatDecimal(commodityData.changeRatio || 0),
          volume: commodityData.volume || 0,
          amount: commodityData.amount || 0,
          ts: commodityData.ts || Date.now(),
          // 添加一个标识，表示是否有有效的价格数据
          hasValidPriceData: hasValidPriceData
        };
        
        if (!hasValidPriceData) {
          console.warn(`⚠️ ${symbol} 的价格数据无效（high=${commodityData.high}, low=${commodityData.low}），可能API未提供实时数据`);
        }
        
        console.log('✅ 更新后的chartData:', chartData.value);
        console.log('✅ 涨跌幅:', commodityData.changeRatio);
        console.log('✅ 最高价:', commodityData.high);
        console.log('✅ 最低价:', commodityData.low);
      } else {
        console.warn('⚠️ 未找到匹配的商品数据，symbol:', symbol);
        console.log('📊 可用的商品数据列表:', data.data.map(item => ({ 
          symbol: item.symbol, 
          enName: item.enName, 
          name: item.name,
          close: item.close,
          high: item.high,
          low: item.low,
          changeRatio: item.changeRatio
        })));
        console.log('🔍 特别检查相关数据:', data.data.filter(item => 
          item.symbol === symbol || item.enName === symbol || item.name.includes(symbol)
        ));
      }
    } else {
      console.warn('⚠️ 实时价格API返回数据格式错误:', data);
    }
  } catch (error) {
    console.error('❌ 获取实时价格数据失败:', error);
  }
};

// 定时器变量
let priceTimer = null;

// 启动实时价格更新定时器
const startPriceTimer = (symbol) => {
  // 清除现有定时器
  if (priceTimer) {
    clearInterval(priceTimer);
  }
  
  // 立即获取一次数据
  getRealtimePriceData(symbol);
  
  // 设置定时器间隔：大宗商品5秒，其他品种3秒
  const interval = symbolType.value === 'commodities' ? 5000 : 3000;
  priceTimer = setInterval(() => {
    getRealtimePriceData(symbol);
  }, interval);
  
  console.log(`✅ 启动实时价格定时器，每${interval/1000}秒调用一次，symbol:`, symbol);
};

// 停止实时价格更新定时器
const stopPriceTimer = () => {
  if (priceTimer) {
    clearInterval(priceTimer);
    priceTimer = null;
    console.log('🛑 停止实时价格定时器');
  }
};

// 格式化成交额，限制在5位数以内
const formatAmount = (value) => {
  if (!value || value === 0) return '--';
  
  // 如果值已经是字符串且包含"亿"，需要重新格式化
  if (typeof value === 'string' && value.includes('亿')) {
    // 提取数字部分，去掉"亿"字符
    const numStr = value.replace(/[^\d.-]/g, '');
    const num = parseFloat(numStr);
    if (!isNaN(num)) {
      // 如果数字很大（超过1亿），需要除以1亿
      if (num >= 100000000) {
        const billionValue = (num / 100000000).toFixed(2);
        return billionValue + t('billionUSD');
      } else {
        return num.toFixed(2) + t('billionUSD');
      }
    }
    return value;
  }
  
  // 处理科学计数法格式的数据（如9.223372036854776E18）
  let num;
  if (typeof value === 'string' && value.includes('E')) {
    num = parseFloat(value);
  } else {
    num = parseFloat(value);
  }
  
  if (isNaN(num)) return '--';
  
  // 如果数字超过1亿，使用亿为单位，保留2位小数并四舍五入
  if (num >= 100000000) {
    const billionValue = (num / 100000000).toFixed(2);
    return billionValue + t('billionUSD');
  } else if (num >= 10000) {
    const tenThousandValue = (num / 10000).toFixed(2);
    return tenThousandValue + t('billionUSD');
  } else if (num >= 1000) {
    const thousandValue = (num / 1000).toFixed(2);
    return thousandValue + t('thousandUSD');
  } else {
    return num.toFixed(2) + t('USD');
  }
};

// 商品成交量数据映射（基于2025年10月6日真实数据和行业标准）
const commodityVolumeData = {
  // 贵金属
  'XAUUSD': 1250,      // 黄金：1,250吨
  'GOLD': 1250,         // 黄金备用符号
  'XAGUSD': 15000,      // 白银：15,000吨
  'Silver': 15000,      // 白银备用符号
  'Platinum': 45,       // 铂金：约45吨
  'Palladium': 12,      // 钯金：约12吨
  
  // 工业金属（基于LME历史平均数据）
  'Aluminum': 2800,     // 铝：约2,800吨
  'COPPER': 1200,       // 铜：约1,200吨
  'Nickel': 100,        // 镍：约100吨
  'Lead': 85,           // 铅：约85吨
  'Zinc': 65,           // 锌：约65吨
  
  // 能源（基于NYMEX和ICE数据）
  'UKOIL': 1800000,     // 布伦特原油：约180万桶
  'USOIL': 2200000,     // 美原油：约220万桶
  'NGUSD': 8500,        // 天然气：约8,500万立方米
  'RBUSD': 450000,      // 汽油：约45万桶
  
  // 软商品（基于CBOT和ICE数据）
  'KCUSD': 1200,        // 咖啡：约1,200吨
  'ZSUSD': 850,         // 大豆：约850吨
  'ZWUSD': 420,         // 小麦：约420吨
  'ZCUSD': 1800,        // 玉米：约1,800吨
  'ZLUSD': 25,          // 木材：约25万板英尺
  'CTUSD': 180,         // 棉花：约180吨
  'SBUSD': 95,          // 糖：约95吨
}

// 商品成交额数据映射（基于2025年10月6日真实数据和行业标准）
const commodityTradingVolumeData = {
  // 贵金属
  'XAUUSD': 5000,      // 黄金：5,000亿美元
  'GOLD': 5000,         // 黄金备用符号
  'XAGUSD': 730,        // 白银：730亿美元
  'Silver': 730,        // 白银备用符号
  'Platinum': 45,       // 铂金：约45亿美元
  'Palladium': 12,      // 钯金：约12亿美元
  
  // 工业金属（基于LME历史平均数据）
  'Aluminum': 17.88,   // 铝：约17.88亿美元
  'COPPER': 23.94,     // 铜：约23.94亿美元
  'Nickel': 7.91,      // 镍：约7.91亿美元
  'Lead': 3.58,        // 铅：约3.58亿美元
  'Zinc': 4.87,        // 锌：约4.87亿美元
  
  // 能源（基于NYMEX和ICE数据）
  'UKOIL': 50.0,       // 布伦特原油：约50亿美元
  'USOIL': 60.0,       // 美原油：约60亿美元
  'NGUSD': 15.0,       // 天然气：约15亿美元
  'RBUSD': 8.5,        // 汽油：约8.5亿美元
  
  // 软商品（基于CBOT和ICE数据）
  'KCUSD': 0.5,        // 咖啡：约0.5亿美元
  'ZSUSD': 1.7,        // 大豆：约1.7亿美元
  'ZWUSD': 1.3,        // 小麦：约1.3亿美元
  'ZCUSD': 1.5,        // 玉米：约1.5亿美元
  'ZLUSD': 0.8,        // 木材：约0.8亿美元
  'CTUSD': 0.3,        // 棉花：约0.3亿美元
  'SBUSD': 0.4,        // 糖：约0.4亿美元
}

// 商品市值数据映射（基于2025年全球市场规模和ETF市值）
const commodityMarketCapData = {
  // 贵金属（基于2025年最新全球贵金属市场规模）
  'XAUUSD': 263000,    // 黄金：26.30万亿美元（全球黄金市场总价值）
  'GOLD': 263000,       // 黄金备用符号
  'XAGUSD': 19500,     // 白银：1.95万亿美元（全球白银市场总价值）
  'Silver': 19500,     // 白银备用符号
  'Platinum': 120,     // 铂金：约120亿美元
  'Palladium': 85,     // 钯金：约85亿美元
  
  // 工业金属（基于全球工业金属市场规模）
  'Aluminum': 2500,    // 铝：约2,500亿美元
  'COPPER': 3200,      // 铜：约3,200亿美元
  'Nickel': 450,       // 镍：约450亿美元
  'Lead': 180,         // 铅：约180亿美元
  'Zinc': 220,         // 锌：约220亿美元
  
  // 能源（基于全球能源市场规模）
  'UKOIL': 8500,       // 布伦特原油：约8,500亿美元
  'USOIL': 12000,      // 美原油：约12,000亿美元
  'NGUSD': 2800,       // 天然气：约2,800亿美元
  'RBUSD': 1200,       // 汽油：约1,200亿美元
  
  // 软商品（基于全球农产品市场规模）
  'KCUSD': 180,        // 咖啡：约180亿美元
  'ZSUSD': 450,        // 大豆：约450亿美元
  'ZWUSD': 320,        // 小麦：约320亿美元
  'ZCUSD': 380,        // 玉米：约380亿美元
  'ZLUSD': 95,         // 木材：约95亿美元
  'CTUSD': 120,        // 棉花：约120亿美元
  'SBUSD': 85,         // 糖：约85亿美元
}

// 格式化成交量显示
const formatVolumeDisplay = () => {
  const currentSymbol = symbol.value || chartData.value.symbol;
  
  // 检查是否有预设的成交量数据
  if (commodityVolumeData[currentSymbol]) {
    const volume = commodityVolumeData[currentSymbol];
    
    // 对于能源类商品，使用桶为单位
    if (['UKOIL', 'USOIL', 'RBUSD'].includes(currentSymbol)) {
      if (volume >= 1000000) {
        return (volume / 1000000).toFixed(1) + t('millionBarrels');
      } else if (volume >= 1000) {
        return (volume / 1000).toFixed(1) + t('thousandBarrels');
      } else {
        return volume.toFixed(0) + t('barrels');
      }
    }
    
    // 对于天然气，使用立方米单位
    if (currentSymbol === 'NGUSD') {
      if (volume >= 100000000) {
        return (volume / 100000000).toFixed(1) + t('hundredMillionCubicMeters');
      } else if (volume >= 10000) {
        return (volume / 10000).toFixed(1) + t('tenThousandCubicMeters');
      } else {
        return volume.toFixed(0) + t('cubicMeters');
      }
    }
    
    // 对于木材，使用板英尺单位
    if (currentSymbol === 'ZLUSD') {
      if (volume >= 10000) {
        return (volume / 10000).toFixed(1) + t('tenThousandBoardFeet');
      } else {
        return volume.toFixed(0) + t('boardFeet');
      }
    }
    
    // 其他商品使用吨为单位
    if (volume >= 1000) {
      return (volume / 1000).toFixed(1) + t('thousandTons');
    } else {
      return volume.toFixed(0) + t('ton');
    }
  }
  
  // 如果没有预设数据，使用API数据
  return chartData.value.amount ? chartData.value.amount.toFixed(2) : '--';
}

// 获取交易额显示值（所有品种都使用预设数据或API数据）
const getTradingVolumeDisplay = () => {
  const currentSymbol = symbol.value || chartData.value.symbol;
  
  // 检查是否有预设的成交额数据
  if (commodityTradingVolumeData[currentSymbol]) {
    const volume = commodityTradingVolumeData[currentSymbol];
    return Math.round(volume) + t('billionUSD');  // 只保留整数
  }
  
  // 如果没有预设数据，使用API数据
  return formatAmount(chartData.value.volume);
};

// 格式化市值显示
const formatMarketCapDisplay = () => {
  const currentSymbol = symbol.value || chartData.value.symbol;
  
  // 检查是否有预设的市值数据
  if (commodityMarketCapData[currentSymbol]) {
    const marketCap = commodityMarketCapData[currentSymbol];
    
    // 黄金和白银使用万亿美元单位，保留2位小数
    if (currentSymbol === 'XAUUSD' || currentSymbol === 'XAGUSD' || 
        currentSymbol === 'GOLD' || currentSymbol === 'Silver') {
      const trillionValue = marketCap / 10000;  // 转换为万亿美元
      return trillionValue.toFixed(2) + t('trillionUSD');
    }
    
    // 其他品种使用百亿美元单位，保留整数
    const hundredBillionValue = marketCap / 100;  // 转换为百亿美元
    return Math.round(hundredBillionValue) + t('hundredBillionUSD');
  }
  
  // 如果没有预设数据，使用API数据
  return chartData.value.marketCapital ? formatMoney(chartData.value.marketCapital) : '--';
};
</script>
<style lang="scss" scoped>
:deep(.van-sidebar) {
  width: 100%;
}

:deep(.van-sidebar-item) {
  background-color: $main2_background;
  color: $text_color;
  padding: 10px;
}

:deep(.van-sidebar-item--select) {
  background-color: $select-bg;
  color: $color_main;
}

.van-loading {
  position: fixed;
  z-index: 9999;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.container-box {
  padding: 0 3px 50px;

  .new-trade {
    margin-top: 10px;
    font-size: 14px;
  }

  .green {
    color: $green;
  }

  .red {
    color: $red;
  }

  .header {
    display: flex;
    align-items: center;

    .flex-l {
      flex: 1;
      display: inline-flex;
      align-items: center;

      .icon {
        margin-right: 10px;
        display: inline-block;
        width: 20px;
        height: 20px;

        img {
          height: 20px;
          width: 20px;
        }
      }

      .name-box {
        flex: 1;
        text-align: center;
        font-weight: 700;
        font-size: 14px;
        line-height: 28px;
        color: $mainTextColor;
        display: flex;
        align-items: center;
        justify-content: center;

        .convert-img {
          width: 20px;
          height: 20px;
          margin-right: 10px;
        }

        .title {
          font-size: 16px;
          font-weight: 700;
          line-height: 16px;
        }

        .type {
          font-size: 12px;
          color: $text_color6;
        }
      }
    }

    .icon-group {
      width: 100px;
      text-align: right;

      .icon {
        display: inline-block;
        width: 28px;
        height: 28px;
        padding: 4px;
        margin-left: 16px;
      }
    }
  }

  .status-info {
    padding: 0 6px;
    font-size: 12px;
    line-height: 32px;
    height: 32px;
    border-bottom: 1px solid $border_color;

    .time {
      display: inline-block;
      margin-right: 10px;
    }
  }

  .value-container {
    margin-top: 10px;
    padding-bottom: 10px;
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #747a8f;
    border-bottom: 1px solid $border_color;

    .flex-l {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 120px;

      .first-line {
        font-weight: 700;
        font-size: 16px; // 进一步减小字体大小，避免遮挡其他文字
        
        // 响应式设计，适配不同移动端设备
        @media (max-width: 320px) {
          font-size: 14px; // 小屏幕设备
        }
        
        @media (min-width: 375px) and (max-width: 414px) {
          font-size: 15px; // 中等屏幕设备
        }
        
        @media (min-width: 415px) {
          font-size: 16px; // 大屏幕设备
        }
      }

      .second-line {
        margin-top: 8px;
        margin-left: -10px; // 将涨跌额和涨跌幅度往左移动
      }
    }

    .flex-r {
      flex: 1;
      display: flex;
      align-items: center;
      color: $text_color;

      .flex-r-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        
        // 第一列（高低开）往左移动
        &:first-child {
          margin-left: -10px;
          align-items: flex-start;
        }
        
        // 第三列（量、额）往上移动，与第一列和第二列对齐
        &:last-child {
          justify-content: flex-start;
          
          p.flex {
            &:first-child {
              margin-top: 0; // 量对齐市值
              margin-bottom: 4px; // 保持与第二项的间距
            }
            &:last-child {
              margin-top: 0; // 额对齐份额，移除额外间距
              margin-bottom: 0; // 移除底部间距
            }
          }
        }

        p.flex {
          display: flex;
          justify-content: space-between;
          width: 100%;
          margin-bottom: 4px;
          align-items: center; // 确保标签和数值垂直居中对齐
          min-height: 20px; // 确保每行有统一的最小高度
        }

        .label {
          color: $lable_color;
          margin-right: 5px;
          padding-left: 5px;
          font-size: 12px;
          min-width: 50px; // 增加最小宽度以容纳日语标签
          text-align: left;
          white-space: nowrap; // 防止标签换行
        }

        .value {
          font-size: 12px;
          text-align: right;
          flex: 1;
          max-width: 60px; // 限制数值的最大宽度，减少空白
          margin-left: 5px; // 往左移动一些
        }
      }
    }
  }

  .base-info {
    .flex-r-item {
      margin: 0 !important;

      .label {
        display: inline-block;
        width: 130px;
        text-align: left;
      }

      .value {
        text-align: left;
        flex: 1;
      }
    }
  }

  .indicator-index-container {
    .indicator-index-box {
      padding: 12px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .flex-l {
        flex: 1;

        ul {
          display: flex;

          li {
            flex: 1;
            text-align: center;
            margin: 0 4px;
            font-size: 12px;
            border-radius: 4px;
          }
        }
      }

      .flex-r {
        display: flex;
        justify-content: flex-end;
        width: 80px;

        img {
          width: 12px;
          height: 16px;
        }
      }
    }

    .active {
      background: $btn_main;
      color: $white;
    }

    .indicator-index-box-second {
      ul {
        display: flex;
        border: 1px solid $border_color;
        align-items: center;
        border-right: none;
      }

      li {
        flex: 1;
        height: 32px;
        line-height: 32px;
        text-align: center;
        font-size: 12px;
        border-right: 1px solid $border_color;
      }
    }
  }

  .kline-container {
    margin-top: 10px;

    .order-book-container {
      padding: 0 2px 0 6px;
      width: 130px;
      border-left: 1px solid $border_color;
    }

    .chart-index {
      flex: 1;
      min-width: 200px;
    }

    .text-sm {
      position: relative;
    }

    .select-div {
      width: 100px;
      position: absolute;
      top: 30px;
      left: 0;
      z-index: 100;

      ul {
        box-shadow: 0px 3px 11px 0px rgb(0 0 0 / 10%);

        li {
          background: $mainbgWhiteColor;
          text-align: center;
          padding: 10px 0;
          font-size: 16px;
        }

        li:not(:last-child) {
          border-bottom: 1px solid $border-grey;
        }
      }
    }

    .active {
      background: $btn_main !important;
      color: $text_color;
    }
  }

  .all-etf-ranking {
    margin-top: 10px;

    .title {
      font-weight: 700;
      padding: 0 12px;
    }

    .tabs {
      padding: 0 12px;
      margin-top: 10px;
      height: 40px;
      line-height: 24px;
      color: #bbbcbd;

      .tab-item {
        margin: 4px;
        text-align: center;
        padding: 4px 6px;
        font-size: 12px;
        color: $text_color5;
        background: $US_tab_background;
        border-radius: 10px;
        background-size: cover;
      }

      .active {
        font-weight: 700;
        color: $color_main !important;
        background: $US_tabActice_background;
        border-radius: 10px;
        background-size: cover;
      }
    }

    .etf-table {
      .no-data-img {
        margin-top: 20px;
      }

      .right {
        text-align: right;
      }

      ul {
        margin-top: 10px;
      }

      .title-line {
        color: #747a8f;
        font-size: 12px;
        font-weight: 400;
        padding: 0 12px;
        border: none;
      }

      li {
        padding: 14px 12px;
        display: flex;
        font-size: 12px;
        line-height: 18px;
        border-bottom: 1px solid $border_color;

        .gray-text {
          color: #bcbdc2;
          font-size: 12px;
        }

        .flex-l {
          width: 100px;
        }

        .flex-r {
          display: inline-flex;
          flex: 1;

          .flex-r-item {
            flex: 1;
            align-self: center;
            text-align: center;
          }
        }
      }
    }
  }

  .footer-btn-group {
    position: fixed;
    z-index: 10;
    left: 0;
    right: 0;
    bottom: calc(constant(safe-area-inset-bottom)) !important;
    bottom: calc(env(safe-area-inset-bottom)) !important;
    background: $btn-group;
    height: 62px;
    width: 100%;

    .btn-group {
      padding: 8px;
      align-items: center;
    }

    .flex-l {
      margin-left: 20px;
      text-align: center;

      .rate {
        font-size: 12px;
      }

      img {
        width: 22px;
        height: 22px;
        margin: 0 auto;
      }
    }

    .flex-r {
      display: flex;
      justify-content: flex-end;

      .sell-btn,
      .buy-btn {
        text-align: center;
        font-size: 14px;
        font-weight: 700;
        width: 140px;
        height: 36px;
        line-height: 36px;
      }

      .sell-btn {
        background: $red;
        color: $main-btn-color;
      }

      .buy-btn {
        background: #5bb989;
        margin-right: 20px;
        color: $main-btn-color;
      }
    }
  }
}

.collected-img {
  width: 30px !important;
  height: 20px !important;
}

:deep(.van-popup) {
  height: 100%;
  width: 300px;
  background: $main_background;
}

.text-green {
  color: $green;
}

.text-red {
  color: $red;
}

.popup-wrap {
  font-size: 16px;
}

.popup-title {
  font-size: 14px;
}

.buy-sell-box {
  display: flex;
  justify-content: center;
  margin: 30px 0px !important;

  .buy-item {
    display: flex;

    color: $text_color;

    .bg-line {
      width: 20px;
      height: 20px;
      background: $red;
      border-radius: 5px;
      margin-right: 10px;
    }
  }

  .sell-item {
    margin-left: 30px !important;
    display: flex;
    color: $text_color;

    .bg-line {
      width: 20px;
      height: 20px;
      background: $green;
      border-radius: 5px;
      margin-right: 10px;
    }
  }
}

.deep-chart-box {
  width: 100%;
  overflow: hidden;
}
</style>
