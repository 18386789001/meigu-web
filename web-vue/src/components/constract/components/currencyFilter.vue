<!-- 货币筛选和滚动选择器 -->
<template>
  <div class="currency-filter-bar">
    <!-- 右侧货币滚动列表 -->
    <div class="currency-scroll-container">
      <div class="scroll-btn left" @click="scrollLeft" v-if="showLeftArrow">
        <span>‹</span>
      </div>
      
      <div class="currency-scroll" ref="scrollContainer" @scroll="handleScroll">
        <div 
          v-for="currency in filteredCurrencies" 
          :key="currency.symbol"
          class="currency-card"
          :class="{ active: currency.symbol === currentSymbol }"
          @click="selectCurrency(currency)"
        >
          <div class="currency-name">{{ currency.name }}</div>
          <div class="currency-price">${{ formatPrice(currency.close) }}</div>
          <div 
            class="currency-change"
            :class="currency.change_ratio >= 0 ? 'up' : 'down'"
          >
            {{ currency.change_ratio >= 0 ? '+' : '' }}{{ formatPercent(currency.change_ratio) }}%
          </div>
        </div>
      </div>

      <div class="scroll-btn right" @click="scrollRight" v-if="showRightArrow">
        <span>›</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CurrencyFilter',
  props: {
    currencies: {
      type: Array,
      default: () => []
    },
    currentSymbol: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showLeftArrow: false,
      showRightArrow: true
    };
  },
  computed: {
    filteredCurrencies() {
      if (!this.currencies || this.currencies.length === 0) return [];

      // 直接显示所有货币，不进行筛选
      return this.currencies.slice(0, 30);
    }
  },
  methods: {
    selectCurrency(currency) {
      this.$emit('currencyChange', currency);
    },
    scrollLeft() {
      const container = this.$refs.scrollContainer;
      if (container) {
        container.scrollBy({ left: -300, behavior: 'smooth' });
      }
    },
    scrollRight() {
      const container = this.$refs.scrollContainer;
      if (container) {
        container.scrollBy({ left: 300, behavior: 'smooth' });
      }
    },
    handleScroll() {
      const container = this.$refs.scrollContainer;
      if (!container) return;
      
      this.showLeftArrow = container.scrollLeft > 10;
      this.showRightArrow = 
        container.scrollLeft < (container.scrollWidth - container.clientWidth - 10);
    },
    formatPrice(price) {
      if (!price) return '0.00';
      return Number(price).toFixed(2);
    },
    formatPercent(percent) {
      if (!percent) return '0.00';
      return Number(percent).toFixed(2);
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.handleScroll();
    });
  }
};
</script>

<style scoped>
.currency-filter-bar {
  display: flex;
  align-items: center;
  background: #0d0e10;
  border-bottom: 1px solid #1a1d24;
  padding: 12px 16px;
}

/* 滚动容器 */
.currency-scroll-container {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
}

.scroll-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a1d24;
  border-radius: 6px;
  cursor: pointer;
  color: #9ca3af;
  font-size: 24px;
  font-weight: bold;
  transition: all 0.2s;
  flex-shrink: 0;
  z-index: 10;
}

.scroll-btn:hover {
  background: #2c2f36;
  color: #fff;
}

.currency-scroll {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 4px 0;
  flex: 1;
}

.currency-scroll::-webkit-scrollbar {
  display: none;
}

.currency-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 货币卡片 */
.currency-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 14px;
  background: #1a1d24;
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 110px;
  flex-shrink: 0;
}

.currency-card:hover {
  background: #2c2f36;
  border-color: #3c3f46;
}

.currency-card.active {
  background: rgba(188, 255, 47, 0.1);
  border-color: #bcff2f;
}

.currency-name {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
}

.currency-price {
  font-size: 12px;
  color: #9ca3af;
}

.currency-change {
  font-size: 12px;
  font-weight: 500;
}

.currency-change.up {
  color: #62c885;
}

.currency-change.down {
  color: #e05561;
}
</style>
