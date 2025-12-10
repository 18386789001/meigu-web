<template>
  <div class="spot-page">
    <div class="fixed-header-wrapper">
      <pc-header />
    </div>
    <div class="spot-container">
      <!-- Left Section: Asset List -->
      <div class="left-section">
        <!-- Tabs & Search Header -->
        <div class="list-header">
          <div class="tabs">
            <div class="tab-item" :class="{ active: activeTab === 'RWA' }" @click="activeTab = 'RWA'">
              RWA
            </div>
            <div class="tab-item" :class="{ active: activeTab === 'Favorite' }" @click="activeTab = 'Favorite'">
              Favorite
            </div>
            <div class="tab-item" :class="{ active: activeTab === 'Dividend' }" @click="activeTab = 'Dividend'">
              Dividend Calendar
            </div>
          </div>
          <div class="search-filter" v-if="activeTab === 'RWA'">
            <div class="search-box">
              <el-icon class="search-icon">
                <Search />
              </el-icon>
              <input type="text" placeholder="Search by Name or Code" v-model="searchQuery" />
            </div>
            <div class="filter-dropdown">
              <span>All</span>
              <el-icon>
                <ArrowDown />
              </el-icon>
            </div>
          </div>
        </div>

        <!-- Table Header -->
        <!-- Table Header -->
        <div class="table-header" v-if="activeTab === 'Dividend'">
          <div class="col col-asset dividend-asset-col">Asset</div>
          <div class="col col-codes">Codes</div>
          <div class="col col-div-share">Dividend per Share</div>
          <div class="col col-split">Split Ratio</div>
          <div class="col col-date">Record Date</div>
          <div class="col col-date">Execution Date</div>
          <div class="col col-position">My Position</div>
          <div class="col col-pnl">PnL</div>
        </div>
        <div class="table-header" v-else>
          <div class="col col-star">#</div>
          <div class="col col-asset">Asset</div>
          <div class="col col-codes">Codes</div>
          <div class="col col-price">Price <el-icon>
              <Sort />
            </el-icon></div>
          <div class="col col-mcap">MCap <el-icon>
              <Sort />
            </el-icon></div>
          <div class="col col-vol">Volume <el-icon>
              <Sort />
            </el-icon></div>
          <div class="col col-24vol">24h volatility <el-icon>
              <Sort />
            </el-icon></div>
          <div class="col col-change">Change <el-icon>
              <Sort />
            </el-icon></div>
          <div class="col col-weekly">Weekly-Chg <el-icon>
              <Sort />
            </el-icon></div>
        </div>

        <!-- Table Body -->
        <div class="table-body">
          <div v-for="(item, index) in filteredList" :key="item.id" class="table-row">
            <template v-if="activeTab === 'Dividend'">
              <div class="col col-asset dividend-asset-col">
                <img :src="item.icon" alt="" class="asset-icon" />
                <span class="asset-name">{{ item.name }}</span>
              </div>
              <div class="col col-codes">{{ item.code }}</div>
              <div class="col col-div-share">{{ item.dividendPerShare }}</div>
              <div class="col col-split">{{ item.splitRatio }}</div>
              <div class="col col-date">{{ item.recordDate }}</div>
              <div class="col col-date">{{ item.executionDate }}</div>
              <div class="col col-position">{{ item.myPosition }}</div>
              <div class="col col-pnl">{{ item.pnl }}</div>
            </template>
            <template v-else>
              <div class="col col-star">
                <el-icon class="star-icon" :class="{ active: item.isFavorite }" @click.stop="toggleFavorite(item)">
                  <Star v-if="!item.isFavorite" />
                  <StarFilled v-else />
                </el-icon>
              </div>
              <div class="col col-asset">
                <img :src="item.icon" alt="" class="asset-icon" />
                <span class="asset-name">{{ item.name }}</span>
              </div>
              <div class="col col-codes">{{ item.code }}</div>
              <div class="col col-price">${{ item.price }}</div>
              <div class="col col-mcap">{{ item.mcap }}</div>
              <div class="col col-vol">{{ item.volume }}</div>
              <div class="col col-24vol" :class="item.volatility24 >= 0 ? 'text-green' : 'text-red'">
                ${{ item.volatility24 }}
              </div>
              <div class="col col-change" :class="item.change >= 0 ? 'text-green' : 'text-red'">
                {{ item.change }}%
              </div>
              <div class="col col-weekly" :class="item.weeklyChange >= 0 ? 'text-green' : 'text-red'">
                {{ item.weeklyChange }}%
              </div>
            </template>
          </div>
        </div>

        <!-- Pagination -->
        <div class="pagination-wrapper">
          <el-pagination background layout="prev, pager, next" :total="total" :page-size="pageSize"
            v-model:current-page="currentPage" prev-text="<" next-text=">" />
        </div>
      </div>

      <!-- Right Section: Account & Trade -->
      <div class="right-section">
        <!-- Account Card -->
        <div class="card account-card">
          <div class="card-header">
            <span>Account Balance <el-icon>
                <View />
              </el-icon></span>
            <span class="positions-link">Positions <el-icon>
                <ArrowDown />
              </el-icon></span>
          </div>
          <div class="balance-amount">$0</div>
          <div class="balance-sub">$0 (0%) (24H) ></div>

          <button class="btn btn-primary full-width">Deposit</button>
          <div class="btn-group">
            <button class="btn btn-outline">Perpetual</button>
            <button class="btn btn-outline">Withdraw</button>
          </div>
        </div>

        <!-- Trade Card -->
        <div class="card trade-card">
          <div class="card-header">
            <h3>Trade</h3>
            <span class="link-text">Buy On-Chain ></span>
          </div>

          <div class="trade-tabs">
            <div class="trade-tab" :class="{ active: tradeType === 'Market' }" @click="tradeType = 'Market'">
              Market
            </div>
            <div class="trade-tab" :class="{ active: tradeType === 'Limit' }" @click="tradeType = 'Limit'">
              Limit
            </div>
          </div>

          <!-- Swap Inputs -->
          <div class="input-group">
            <div class="input-label">From</div>
            <div class="input-box">
              <div class="currency-select">
                <img src="/image/USDT.png" class="currency-icon"
                  onerror="this.src='https://placehold.co/20x20?text=U'" />
                <span>USD</span>
              </div>
              <input type="number" placeholder="0.0" class="amount-input" />
            </div>
          </div>

          <div class="swap-divider">
            <div class="swap-icon-wrapper">
              <el-icon>
                <Sort />
              </el-icon>
            </div>
          </div>

          <div class="input-group">
            <div class="input-label">To</div>
            <div class="input-box">
              <div class="currency-select">
                <img src="/image/RWA-2.png" class="currency-icon"
                  onerror="this.src='https://placehold.co/20x20?text=A'" />
                <span>AAPL.M</span>
                <el-icon>
                  <ArrowDown />
                </el-icon>
              </div>
              <input type="number" placeholder="0.0" class="amount-input" />
            </div>
          </div>

          <!-- Market Info / Connect Wallet -->


          <button class="btn btn-primary full-width connect-btn">Connect wallet</button>

          <div class="terms-check">
            <input type="checkbox" id="terms" />
            <label for="terms">I confirm I am not a U.S. Citizen and I agree to the Terms of Use</label>
          </div>
        </div>
      </div>
    </div>
    <msx-footer />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search, ArrowDown, Sort, Star, StarFilled, View, Warning } from '@element-plus/icons-vue'
import PcHeader from "@/components/layout/commonHeader.vue";
import MsxFooter from "@/components/layout/MsxFooter.vue";

const activeTab = ref('RWA')
const searchQuery = ref('')
const tradeType = ref('Market')
const currentPage = ref(1)
const pageSize = 12
const total = ref(100) // Mock total

// Mock Data
const mockList = [
  { id: 1, name: 'Apple Inc. - MSX', code: 'AAPL.M', price: '277.32', mcap: '4.1T', volume: '38.23M', volatility24: -1.46, change: -0.52, weeklyChange: -0.55, icon: '/image/RWA-2.png', isFavorite: true },
  { id: 2, name: 'Amazon.Com Inc - MSX', code: 'AMZN.M', price: '227.12', mcap: '2.43T', volume: '35.03M', volatility24: -2.41, change: -1.05, weeklyChange: -2.62, icon: '/image/RWA-2.png', isFavorite: true },
  { id: 3, name: 'The Walt Disney Company - MSX', code: 'DIS.M', price: '107.71', mcap: '192.29B', volume: '13.73M', volatility24: 2.41, change: 2.29, weeklyChange: 3.1, icon: '/image/RWA-2.png', isFavorite: true },
  { id: 4, name: 'Alphabet Inc. Class A Common Stock', code: 'GOOGL.M', price: '314.32', mcap: '1.93T', volume: '33.88M', volatility24: -6.95, change: -2.16, weeklyChange: -1.83, icon: '/image/RWA-2.png', isFavorite: true },
  { id: 5, name: 'Meta Platforms, Inc. Class A - MSX', code: 'META.M', price: '665.39', mcap: '1.45T', volume: '13.17M', volatility24: -8.03, change: -1.19, weeklyChange: 2.69, icon: '/image/RWA-2.png', isFavorite: true },
  { id: 6, name: 'Microsoft Corp - MSX', code: 'MSFT.M', price: '490.31', mcap: '3.64T', volume: '21.99M', volatility24: 7.15, change: 1.48, weeklyChange: -0.35, icon: '/image/RWA-2.png', isFavorite: true },
  { id: 7, name: 'Netflix Inc - MSX', code: 'NFLX.M', price: '96.59', mcap: '409.28B', volume: '100.89M', volatility24: -3.65, change: -3.64, weeklyChange: -10.22, icon: '/image/RWA-2.png', isFavorite: true },
  { id: 8, name: 'Nvidia Corp - MSX', code: 'NVDA.M', price: '189.88', mcap: '4.61T', volume: '203.68M', volatility24: 7.47, change: 4.1, weeklyChange: 7.28, icon: '/image/RWA-2.png', isFavorite: true },
  { id: 9, name: 'Pfizer Inc. - MSX', code: 'PFE.M', price: '25.78', mcap: '146.58B', volume: '45.2M', volatility24: -0.25, change: -0.96, weeklyChange: 0.16, icon: '/image/RWA-2.png', isFavorite: true },
  { id: 10, name: 'PayPal Holdings, Inc. Common Stock', code: 'PYPL.M', price: '61.07', mcap: '57.14B', volume: '12.54M', volatility24: -1.21, change: -1.94, weeklyChange: -2.58, icon: '/image/RWA-2.png', isFavorite: true },
  { id: 11, name: 'Tesla, Inc. Common Stock - MSX', code: 'TSLA.M', price: '439.48', mcap: '1.46T', volume: '69.08M', volatility24: -15.52, change: -3.41, weeklyChange: 2.16, icon: '/image/RWA-2.png', isFavorite: true },
  { id: 12, name: 'Coinbase Global Inc. Class A - MSX', code: 'COIN.M', price: '274.07', mcap: '62.54B', volume: '5.94M', volatility24: 4.34, change: 1.61, weeklyChange: 0.46, icon: '/image/RWA-2.png', isFavorite: true },
]

const mockDividendList = [
  { id: 101, name: 'PG - MSX', code: 'PG.M', dividendPerShare: '1.0568', splitRatio: '--', recordDate: '2025-07-18', executionDate: '2025-08-15', myPosition: '0', pnl: '0', icon: '/image/icon1.png' },
  { id: 102, name: 'AMRK - MSX', code: 'AMRK.M', dividendPerShare: '0.2', splitRatio: '--', recordDate: '2025-07-18', executionDate: '2025-08-01', myPosition: '0', pnl: '0', icon: '/image/icon2.png' },
  { id: 103, name: 'DELL - MSX', code: 'DELL.M', dividendPerShare: '0.525', splitRatio: '--', recordDate: '2025-07-22', executionDate: '2025-08-01', myPosition: '0', pnl: '0', icon: '/image/icon3.png' },
  { id: 104, name: 'PFE - MSX', code: 'PFE.M', dividendPerShare: '0.43', splitRatio: '--', recordDate: '2025-07-25', executionDate: '2025-09-02', myPosition: '0', pnl: '0', icon: '/image/icon4.png' },
  { id: 105, name: 'NOK - MSX', code: 'NOK.M', dividendPerShare: '0.046567', splitRatio: '--', recordDate: '2025-07-29', executionDate: '2025-08-12', myPosition: '0', pnl: '0', icon: '/image/icon5.png' },
  { id: 106, name: 'ASML - MSX', code: 'ASML.M', dividendPerShare: '1.846784', splitRatio: '--', recordDate: '2025-07-29', executionDate: '2025-08-06', myPosition: '0', pnl: '0', icon: '/image/icon6.png' },
  { id: 107, name: 'TXN - MSX', code: 'TXN.M', dividendPerShare: '1.36', splitRatio: '--', recordDate: '2025-07-31', executionDate: '2025-08-12', myPosition: '0', pnl: '0', icon: '/image/icon7.png' },
  { id: 108, name: 'DAL - MSX', code: 'DAL.M', dividendPerShare: '0.1875', splitRatio: '--', recordDate: '2025-07-31', executionDate: '2025-08-21', myPosition: '0', pnl: '0', icon: '/image/icon8.png' },
  { id: 109, name: 'SBIT - MSX', code: 'SBIT.M', dividendPerShare: '0.043469', splitRatio: '--', recordDate: '2025-08-01', executionDate: '2025-08-07', myPosition: '0', pnl: '0', icon: '/image/icon9.png' },
]

const filteredList = computed(() => {
  if (activeTab.value === 'Dividend') {
    return mockDividendList;
  }
  return mockList.filter(item =>
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    item.code.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const toggleFavorite = (item) => {
  item.isFavorite = !item.isFavorite
}
</script>

<style>
/* 全局样式重置，确保导航栏紧贴顶部 */
body,
html {
  margin: 0 !important;
  padding: 0 !important;
  top: 0 !important;
  left: 0 !important;
}

#app {
  margin: 0 !important;
  padding: 0 !important;
  top: 0 !important;
  left: 0 !important;
}
</style>

<style scoped>
.spot-page {
  background-color: #000;
  min-height: 100vh;
  padding: 84px 20px 20px 20px;
  color: #fff;
  font-family: 'Inter', sans-serif;
  margin: 0 !important;
  padding-top: 84px !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
  padding-bottom: 20px !important;
}

.fixed-header-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}

/* Remove old fix-header class as it is replaced by wrapper */
.spot-container {
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 0 20px;
  /* Keep minimal padding for aesthetics inside the container if needed, or 0 if strictly requested */
  display: flex;
  gap: 20px;
}

/* Left Section */
.left-section {
  flex: 1;
  background-color: #000;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid #1a1a1a;
  padding-bottom: 0px;
}

.tabs {
  display: flex;
  gap: 32px;
}

.tab-item {
  padding: 12px 0;
  cursor: pointer;
  color: #888;
  font-size: 16px;
  font-weight: 500;
  position: relative;
  transition: all 0.3s;
}

.tab-item.active {
  color: #fff;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #fff;
}

.search-filter {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.search-box {
  background: #111;
  border: 1px solid #333;
  border-radius: 20px;
  display: flex;
  align-items: center;
  padding: 6px 12px;
  width: 240px;
}

.search-icon {
  color: #666;
  margin-right: 8px;
}

.search-box input {
  background: transparent;
  border: none;
  color: #fff;
  outline: none;
  width: 100%;
  font-size: 14px;
}

.filter-dropdown {
  background: #111;
  border: 1px solid #333;
  border-radius: 20px;
  padding: 6px 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 14px;
}

/* Table */
.table-header {
  display: flex;
  padding: 12px 0;
  color: #666;
  font-size: 12px;
  border-bottom: 1px solid #1a1a1a;
}

.col {
  display: flex;
  align-items: center;
  gap: 4px;
}

.col-star {
  width: 40px;
  justify-content: center;
}

.col-asset {
  flex: 2;
  min-width: 200px;
}

.col-codes {
  width: 100px;
}

.col-price {
  width: 100px;
}

.col-mcap {
  width: 100px;
}

.col-vol {
  width: 100px;
}

.col-24vol {
  width: 120px;
}

.col-change {
  width: 100px;
  text-align: right;
  justify-content: flex-end;
}

.col-weekly {
  width: 100px;
  text-align: right;
  justify-content: flex-end;
}

.col-div-share,
.col-split,
.col-date,
.col-position,
.col-pnl {
  flex: 1;
  min-width: 120px;
}

.table-row {
  display: flex;
  padding: 24px 0;
  border-bottom: 1px solid #1a1a1a;
  font-size: 14px;
  align-items: center;
  transition: background-color 0.2s;
}

.table-row:hover {
  background-color: #111;
}

.asset-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 12px;
}

.asset-name {
  font-weight: 500;
}

.star-icon {
  cursor: pointer;
  color: #444;
}

.star-icon.active {
  color: #fff;
}

.text-green {
  color: #82ff28;
}

.text-red {
  color: #ff3333;
}

/* Right Section */
.right-section {
  width: 360px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card {
  background: #111;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #222;
}

/* Account Card */
.account-card .card-header {
  display: flex;
  justify-content: space-between;
  color: #888;
  font-size: 14px;
  margin-bottom: 12px;
}

.positions-link {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.balance-amount {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 4px;
}

.balance-sub {
  color: #888;
  font-size: 14px;
  margin-bottom: 20px;
}

.btn {
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn:hover {
  opacity: 0.9;
}

.btn-primary {
  background-color: #82ff28;
  color: #000;
  padding: 12px;
}

.btn-outline {
  background: transparent;
  border: 1px solid #333;
  color: #fff;
  padding: 10px;
  flex: 1;
}

.full-width {
  width: 100%;
}

.btn-group {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

/* Trade Card */
.trade-card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.trade-card .card-header h3 {
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  margin: 0;
}

.link-text {
  color: #888;
  font-size: 12px;
  cursor: pointer;
}

.trade-tabs {
  background: #000;
  padding: 4px;
  border-radius: 8px;
  display: flex;
  margin-bottom: 20px;
}

.trade-tab {
  flex: 1;
  text-align: center;
  padding: 8px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  color: #888;
}

.trade-tab.active {
  background: #fff;
  color: #000;
  font-weight: 600;
}

.input-group {
  margin-bottom: 1px;
}

.input-label {
  color: #888;
  font-size: 12px;
  margin-bottom: 8px;
}

.input-box {
  background: #1a1a1a;
  border-radius: 12px;
  padding: 24px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.currency-select {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
}

.currency-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
}

.amount-input {
  background: transparent;
  border: none;
  color: #fff;
  text-align: right;
  font-size: 20px;
  width: 120px;
  outline: none;
  font-weight: 500;
}

.swap-divider {
  display: flex;
  justify-content: center;
  margin: -12px 0;
  position: relative;
  z-index: 1;
}

.swap-icon-wrapper {
  background: #2a2a2a;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 4px solid #111;
  /* Thicker border to match gap */
}

.market-notice {
  background: #1a1a1a;
  /* Fallback */
  background: rgba(255, 165, 0, 0.1);
  border: 1px solid rgba(255, 165, 0, 0.2);
  border-radius: 8px;
  padding: 12px;
  margin: 20px 0;
  display: flex;
  gap: 10px;
}

.notice-icon {
  color: #ffa500;
  margin-top: 2px;
}

.notice-content {
  font-size: 12px;
  color: #ccc;
  line-height: 1.4;
}

.countdown {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  margin: 4px 0;
}

.countdown span {
  background: #fff;
  color: #000;
  padding: 2px 4px;
  border-radius: 2px;
  margin: 0 2px;
}

.notice-sub {
  color: #888;
  font-size: 10px;
}

.connect-btn {
  margin-top: 24px;
  margin-bottom: 12px;
}

.terms-check {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  font-size: 10px;
  color: #888;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

/* Element UI Pagination Override */
:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background-color: #82ff28;
  color: #000;
}

:deep(.el-pagination.is-background .el-pager li) {
  background-color: transparent;
  color: #888;
}

:deep(.el-pagination.is-background .btn-prev),
:deep(.el-pagination.is-background .btn-next) {
  background-color: transparent;
  color: #888;
}

/* CSS fix specific for Dividend Tab layout */

/* Set a slightly wider logic for asset column in Dividend Tab specially, to prevent it from squeezing */
.dividend-asset-col {
  min-width: 260px !important;
  /* Ensure enough width for long names */
  padding-left: 32px !important;
  /* Double char spacing */
}

/* Adjust general column flex for Date and others to be more uniform */
.col-div-share,
.col-split,
.col-date,
.col-position,
.col-pnl,
.col-codes {
  flex: 1;
  min-width: 140px;
  /* Increased from 120px to give more breathing room */
  display: flex;
  align-items: center;
  justify-content: flex-start !important;
  /* Force Left Align */
  padding-left: 32px !important;
  /* Double char spacing */
}

/* Specific modification for Code column if it needs different width */
.col-codes {
  min-width: 100px;
  margin-right: 0;
}
</style>
