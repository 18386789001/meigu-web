<!-- 单个币种基本信息-->
<template>
  <div
    class="currency-info-bar"
    :class="[isFullscreen ? 'currency-info-bar-full' : '']"
  >
    <!-- 币种名称和主要信息 -->
    <div class="main-info">
      <div class="symbol-name" @click="handleClickSymbol">
        {{ pageData.name }}
        <i class="icon iconfont icon-Mul_Dropdown arrow-icon"></i>
      </div>
      <div 
        class="price-main"
        :class="[pageData.change_ratio >= 0 ? 'price-up' : 'price-down']"
      >
        {{ pageData.close }}
      </div>
      <div 
        class="change-info"
        :class="[pageData.change_ratio >= 0 ? 'price-up' : 'price-down']"
      >
        {{ addAndSubtr(pageData.change_ratio) }}
      </div>
    </div>

    <!-- 数据指标 -->
    <div class="stats-container">
      <div class="stat-item">
        <div class="stat-label">Mark price</div>
        <div class="stat-value">{{ pageData.close }}</div>
      </div>
      
      <div class="stat-item">
        <div class="stat-label">Index Price</div>
        <div class="stat-value">{{ pageData.close }}</div>
      </div>
      
      <div class="stat-item">
        <div class="stat-label">24h Change</div>
        <div 
          class="stat-value"
          :class="[pageData.change_ratio >= 0 ? 'value-up' : 'value-down']"
        >
          {{ pageData.close }} {{ addAndSubtr(pageData.change_ratio) }}
        </div>
      </div>
      
      <div class="stat-item">
        <div class="stat-label">24h Low</div>
        <div class="stat-value">{{ pageData.low }}</div>
      </div>
      
      <div class="stat-item">
        <div class="stat-label">24h High</div>
        <div class="stat-value">{{ pageData.high }}</div>
      </div>
      
      <div class="stat-item" v-if="pageType !== 'forex'">
        <div class="stat-label">24hTotal()</div>
        <div class="stat-value">{{ getAmount }}</div>
      </div>
      
      <div class="stat-item" v-if="pageType !== 'forex'">
        <div class="stat-label">24hAmount({{ t(`${unitMap.volumn[pageType]}`) }})</div>
        <div class="stat-value">{{ getVolume }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { addAndSubtr } from "@/utils/index";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const emit = defineEmits(["showSerachCollect"]);
const props = defineProps({
  pageData: {
    type: Object,
    default: {},
  },
  isFullscreen: {
    type: Boolean,
    default: false,
  },
  pageType: {
    type: String,
    default: "etf",
  },
});

const handleClickSymbol = () => {
  emit("showSerachCollect");
};
const unitMap = {
  amount: {
    etf: "message.home.wangu",
    usStocks: "message.home.wangu",
    twStocks: "message.home.wangu",
    cnStocks: "message.home.wangu",
    hkStocks: "message.home.wangu",
    coin: "", //当前币种
    forex: "", //当前币种
  },
  volumn: {
    etf: "message.home.wan",
    usStocks: "message.home.wan",
    cnStocks: "message.home.wan",
    hkStocks: "message.home.wan",
    twStocks: "message.home.wan",
    forex: "USD",
    coin: "USDT",
  },
};

const getVolume = computed(() => {
  const volume = props.pageData?.volume;

  if (volume) {
    const val = ["usStocks", "etf"].includes(props.pageType)
      ? volume / 10000
      : volume;
    return Number(val).toFixed(4);
  }

  return "--";
});

const getAmount = computed(() => {
  const amount = props.pageData?.amount || 0;
  if (amount) {
    const val = ["usStocks", "etf"].includes(props.pageType)
      ? amount / 10000
      : amount;
    return Number(val).toFixed(4);
  }
  return "--";
});
</script>
<style scoped>
.currency-info-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #0d0e10;
  border-bottom: 1px solid #1a1d24;
  padding: 12px 20px;
  min-height: 60px;
}

.currency-info-bar-full {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: #0d0e10;
  z-index: 3000000;
  padding: 12px 20px;
}

/* 主要信息区 */
.main-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.symbol-name {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 120px;
}

.symbol-name:hover {
  color: #1d91ff;
}

.arrow-icon {
  font-size: 12px;
  color: #6b7280;
}

.price-main {
  font-size: 24px;
  font-weight: 700;
  min-width: 100px;
}

.price-up {
  color: #62c885;
}

.price-down {
  color: #e05561;
}

.change-info {
  font-size: 14px;
  font-weight: 500;
}

/* 统计数据区 */
.stats-container {
  display: flex;
  align-items: center;
  gap: 32px;
  flex: 1;
  justify-content: flex-end;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 11px;
  color: #6b7280;
  white-space: nowrap;
}

.stat-value {
  font-size: 13px;
  color: #fff;
  font-weight: 500;
  white-space: nowrap;
}

.value-up {
  color: #62c885;
}

.value-down {
  color: #e05561;
}
</style>
