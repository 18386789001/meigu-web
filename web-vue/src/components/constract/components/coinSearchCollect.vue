<template>
  <div class="makeADeal-wrapper">
    <!-- 搜索框 -->
    <div class="search-wrapper">
      <div class="search">
        <div class="search-img">
          <img src="@/assets/images/quotes/Group2987.png" alt="" />
        </div>
        <input
          type="text"
          placeholder="Search by Name or Code"
          @focus="showSearch = true"
          @blur="showSearch = false"
          @input="onInput"
          v-model="searchValue"
        />
      </div>
    </div>

    <!-- 标签页 -->
    <div class="tabs-wrapper">
      <div
        v-for="(tab, index) in tabs"
        :key="index"
        class="tab-item"
        :class="{ active: activeTab === index }"
        @click="switchTab(index)"
      >
        {{ tab }}
      </div>
    </div>

    <!-- 表头 -->
    <div class="table-header">
      <div class="header-left">
        <span class="header-name">Name</span>
      </div>
      <div class="header-right">
        <span>Price / Change</span>
      </div>
    </div>
    <!-- 数据 -->
    <div class="list-wrapper">
      <div
        class="list-item"
        v-for="(item, index) in searchValue ? listData : AllListData"
        :key="index"
        @click.stop="checkCurrency(item)"
      >
        <div class="item-left">
          <div class="star-icon" @click.stop="collect(item)">
            <span
              :class="['star-icon-symbol', item.isCollect ? 'star-filled' : 'star-empty']"
            >
              ★
            </span>
          </div>
          <div class="item-name">
            <div class="symbol">{{ item.name }}</div>
            <div class="description">
              {{ item.fullName ||
                (item.symbol ? item.symbol.toUpperCase() + ' - ' + getCryptoDescription(item.name) : getCryptoDescription(item.name)) }}
            </div>
          </div>
        </div>
        <div class="item-right">
          <div class="price">${{ item.close }}</div>
          <div
            class="change"
            :class="[item.change_ratio > 0 ? 'color-up' : 'color-down']"
          >
            {{ item.change_ratio > 0 ? "+" : "" }}{{ item.change_ratio }}%
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapStores } from "pinia";
import { CaretTop, CaretBottom } from "@element-plus/icons-vue";
import { useUserStore } from "@/store/user";

export default {
  emits: [
    "searchFun",
    "CurrencySort",
    "collectFun",
    "deleteCollectFun",
    "checkCurrency",
  ],
  name: "coinSearchCollect",
  props: ["listData", "AllListData", "pageType"],
  components: { CaretTop, CaretBottom },
  data() {
    return {
      showSearch: false,
      searchValue: "",
      sortIndex: 0,
      tabs: ['All', 'Last', 'Gainers', 'Losers'],
      activeTab: 0,
    };
  },

  computed: {
    ...mapState(useUserStore, ["existToken"]),
  },
  methods: {
    selectChcek(item, bool) {
      item.checked = bool;
    },
    onInput() {
      this.$emit("searchFun", this.searchValue);
    },

    // 获取币种描述信息
    getCryptoDescription(symbol) {
      const descriptions = {
        'BTC': 'Bitcoin - The first and largest cryptocurrency',
        'ETH': 'Ethereum - Smart contract platform with native cryptocurrency',
        'BNB': 'Binance Coin - Native token of Binance exchange and ecosystem',
        'XRP': 'Ripple - Digital payment protocol and remittance network',
        'ADA': 'Cardano - Proof-of-stake blockchain platform',
        'SOL': 'Solana - High-performance blockchain supporting builders',
        'DOGE': 'Dogecoin - Peer-to-peer digital currency',
        'DOT': 'Polkadot - Interoperable blockchain network',
        'AVAX': 'Avalanche - High-speed, low-cost blockchain',
        'MATIC': 'Polygon - Ethereum scaling solution and sidechain',
        'LINK': 'Chainlink - Decentralized oracle network',
        'UNI': 'Uniswap - Decentralized exchange protocol',
        'LTC': 'Litecoin - Peer-to-peer cryptocurrency',
        'ATOM': 'Cosmos - Interchain ecosystem',
        'FIL': 'Filecoin - Decentralized storage network',
        'TRX': 'TRON - Blockchain-based entertainment ecosystem',
        'XLM': 'Stellar - Distributed payment network',
        'VET': 'VeChain - Blockchain platform for supply chain',
        'THETA': 'Theta Network - Decentralized video streaming',
        'ICP': 'Internet Computer - Decentralized cloud computing platform'
      };

      const upperSymbol = symbol.toUpperCase();
      return descriptions[upperSymbol] || `${symbol.toUpperCase()} - Cryptocurrency trading pair`;
    },
    CurrencySort(val) {
      this.sortIndex = val;
      this.$emit("CurrencySort", val);
    },
    collect(item) {
      if (item.isCollect) {
        this.deleteCollectFun(item);
      } else {
        this.collectFun(item);
      }
    },
    //收藏
    collectFun(item) {
      this.$emit("collectFun", item);
    },
    //取消收藏
    deleteCollectFun(item) {
      this.$emit("deleteCollectFun", item);
    },
    //切换币种以及路由
    checkCurrency(item) {
      this.$emit("checkCurrency", item);
    },
    // 切换标签页
    switchTab(index) {
      this.activeTab = index;
      // TODO: 根据标签页过滤数据
    },
  },
};
</script>

<style scoped>
.color-down {
  color: #e05561;
}

.color-up {
  color: #62c885;
}

.makeADeal-wrapper {
  padding: 16px 0 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background: #0d0e10;
}

/* 搜索框 */
.search-wrapper {
  padding: 0 12px 12px;
}

.search {
  position: relative;
  height: 32px;
  background: #1a1d24;
  border-radius: 6px;
  border: 1px solid #2c3138;
}

.search .search-img {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  width: 14px;
  opacity: 0.5;
}

.search .search-img img {
  width: 100%;
}

.search input {
  width: 100%;
  height: 100%;
  padding-left: 36px;
  padding-right: 12px;
  box-sizing: border-box;
  font-size: 13px;
  color: #fff;
  background: transparent;
  border: none;
  outline: none;
}

.search input::placeholder {
  color: #6b7280;
}

/* 标签页 */
.tabs-wrapper {
  display: flex;
  gap: 0;
  padding: 0 12px;
  margin-bottom: 12px;
  border-bottom: 1px solid #1a1d24;
}

.tab-item {
  padding: 8px 16px;
  font-size: 13px;
  color: #6b7280;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
  white-space: nowrap;
}

.tab-item:hover {
  color: #fff;
}

.tab-item.active {
  color: #fff;
  border-bottom-color: #1d91ff;
}

/* 表头 */
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  font-size: 11px;
  color: #6b7280;
  background: #0d0e10;
  border-bottom: 1px solid #1a1d24;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-name {
  flex: 1;
}

.header-right {
  text-align: right;
}

/* 列表容器 */
.list-wrapper {
  flex: 1;
  height: auto;
  padding: 0;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.list-wrapper::-webkit-scrollbar {
  display: none;
}

/* 列表项 */
.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  cursor: pointer;
  border-bottom: 1px solid #1a1d24;
  transition: background 0.2s;
}

.list-item:hover {
  background: #1a1d24;
}

.item-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.star-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.star-icon-symbol {
  font-size: 22px;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
}

.star-icon-symbol:hover {
  transform: scale(1.1);
}

.star-filled {
  color: #fbbf24; /* 金色 - 收藏状态 */
  text-shadow: 0 0 6px rgba(251, 191, 36, 0.6); /* 金色光晕效果 */
}

.star-empty {
  color: #e5e7eb; /* 浅白色 - 未收藏状态 */
}

.item-name {
  flex: 1;
  min-width: 0;
}

.symbol {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.description {
  font-size: 13px;
  color: #9ca3af;
  margin-top: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 400;
}

.item-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  flex-shrink: 0;
}

.price {
  font-size: 13px;
  font-weight: 500;
  color: #fff;
}

.change {
  font-size: 11px;
  font-weight: 500;
}
</style>
```
