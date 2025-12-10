<template>
  <div class="crypto-spot-page">
    <div class="fixed-header-wrapper">
      <pc-header />
    </div>
    
    <div class="spot-content">
      <!-- Top Filters / Tabs -->
      <div class="market-header">
        <div class="market-tabs">
          <div 
            class="tab-btn" 
            :class="{ active: activeTab === 'Trending' }"
            @click="activeTab = 'Trending'"
          >
            <el-icon class="fire-icon"><Trophy /></el-icon> 
            Trending
          </div>
          <div 
            class="tab-btn" 
            :class="{ active: activeTab === 'Top' }"
            @click="activeTab = 'Top'"
          >
            <el-icon><TrendCharts /></el-icon>
            Top searches
          </div>
          <div 
            class="tab-btn" 
            :class="{ active: activeTab === 'Last' }"
            @click="activeTab = 'Last'"
          >
            <el-icon><Clock /></el-icon>
            Last
          </div>
        </div>

        <div class="search-area">
             <div class="search-input-wrapper">
                <el-icon class="search-icon"><Search /></el-icon>
                <input type="text" placeholder="Search token name or address" v-model="searchQuery" />
             </div>
        </div>
      </div>

      <!-- Main Table -->
      <div class="market-table-container">
        <table class="market-table">
          <thead>
            <tr>
              <th class="col-fav"></th>
              <th class="col-name"># &nbsp; Name</th>
              <th class="col-price" @click="handleSort('price')">Price <el-icon><Sort /></el-icon></th>
              <th class="col-change" @click="handleSort('change')">Change (%) <el-icon><Sort /></el-icon></th>
              <th class="col-fdv">FDV <el-icon><Sort /></el-icon></th>
              <th class="col-mcap">Market cap <el-icon><Sort /></el-icon></th>
              <th class="col-txns">Transactions <el-icon><Sort /></el-icon></th>
              <th class="col-traders">Unique traders <el-icon><Sort /></el-icon></th>
              <th class="col-turnover">Turnover <el-icon><Sort /></el-icon></th>
              <th class="col-age">Token age <el-icon><Sort /></el-icon></th>
              <th class="col-audit">Audit</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in filteredList" :key="item.id">
              <td class="col-fav">
                <el-icon 
                  class="star-icon" 
                  :class="{ active: item.isFavorite }"
                  @click.stop="toggleFavorite(item)"
                >
                  <Star v-if="!item.isFavorite" />
                  <StarFilled v-else />
                </el-icon>
              </td>
              <td class="col-name">
                <div class="token-info-cell">
                  <!-- <span class="rank-num">{{ index + 1 }}</span> -->
                  <img :src="item.icon" class="token-icon" onerror="this.src='https://placehold.co/32x32?text=C'"/>
                  <div class="token-details">
                    <span class="token-symbol">{{ item.symbol }}</span>
                    <span class="token-address">{{ formatAddress(item.address) }} <el-icon class="copy-icon"><CopyDocument /></el-icon></span>
                  </div>
                </div>
              </td>
              <td class="col-price">{{ item.price }}</td>
              <td class="col-change" :class="getChangeClass(item.change)">
                {{ item.change }}%
              </td>
              <td class="col-fdv">{{ item.fdv }}</td>
              <td class="col-mcap">{{ item.mcap }}</td>
              <td class="col-txns">{{ item.transactions }}</td>
              <td class="col-traders">{{ item.traders }}</td>
              <td class="col-turnover">{{ item.turnover }}</td>
              <td class="col-age">{{ item.age }}</td>
              <td class="col-audit">
                <el-icon v-if="item.audit" class="audit-check"><SuccessFilled /></el-icon>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
       <div class="pagination-container">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="100"
              :page-size="20"
              prev-text="<"
              next-text=">"
            />
       </div>

    </div>
    
    <msx-footer />
    
     <!-- Floating Chat Button -->
    <div class="floating-chat-btn">
      <el-icon><ChatDotRound /></el-icon>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  Search, Sort, Star, StarFilled, 
  TrendCharts, Clock, CopyDocument, SuccessFilled, ChatDotRound, Trophy
} from '@element-plus/icons-vue'
import PcHeader from "@/components/layout/commonHeader.vue";
import MsxFooter from "@/components/layout/MsxFooter.vue";

// Use a trophy icon component if available, otherwise fallback
const activeTab = ref('Trending')
const searchQuery = ref('')

const mockData = [
  { 
    id: 1, symbol: 'NIGHT', name: 'Night Token', address: '0xfc9...3224f', 
    price: '0.04049', change: '-91.01', fdv: '672.54M', mcap: '14.06M', 
    transactions: '51.91K', traders: '5.22K', turnover: '5.17M', age: '2025-12-08 21:39', 
    audit: true, icon: '/image/icon1.png', isFavorite: false 
  },
  { 
    id: 2, symbol: 'ASTER', name: 'Aster', address: '0x00d...f556a', 
    price: '0.9565', change: '+1.57', fdv: '2.01B', mcap: '7.58B', 
    transactions: '5.21K', traders: '1.42K', turnover: '9.3M', age: '2025-09-17 13:47', 
    audit: true, icon: '/image/icon2.png', isFavorite: false 
  },
  { 
    id: 3, symbol: 'STABLE', name: 'Stable Coin', address: '0x011...0075f', 
    price: '0.01758', change: '-10', fdv: '314.23M', mcap: '18.62M', 
    transactions: '87.01K', traders: '4.11K', turnover: '25.55M', age: '2025-12-08 02:05', 
    audit: true, icon: '/image/icon3.png', isFavorite: false 
  },
    { 
    id: 4, symbol: 'year of yellow ...', name: 'Year Yellow', address: '0x2fc...a4444', 
    price: '0.000858', change: '-46.84', fdv: '851.95K', mcap: '851.95K', 
    transactions: '15.12K', traders: '5.53K', turnover: '3.01M', age: '2025-12-07 13:39', 
    audit: true, icon: '/image/icon4.png', isFavorite: false 
  },
  { 
    id: 5, symbol: '💛', name: 'Heart', address: '0x037...94444', 
    price: '0.0001011', change: '+84.99', fdv: '101.12K', mcap: '101.12K', 
    transactions: '12.79K', traders: '4.93K', turnover: '1.7M', age: '2025-12-08 18:24', 
    audit: true, icon: '/image/icon5.png', isFavorite: false 
  },
    { 
    id: 6, symbol: 'BINANCE JUNI...', name: 'Binance Jr', address: '0x746...04444', 
    price: '0.0004247', change: '-48.19', fdv: '424.79K', mcap: '424.79K', 
    transactions: '5.72K', traders: '2.63K', turnover: '859.73K', age: '2025-12-05 18:02', 
    audit: true, icon: '/image/icon6.png', isFavorite: false 
  },
    { 
    id: 7, symbol: 'CREPE', name: 'Crepe', address: '0x0b2...d931d', 
    price: '0.043302', change: '-5.06', fdv: '22.79M', mcap: '21.24M', 
    transactions: '3.1K', traders: '1.92K', turnover: '298.41K', age: '2025-05-22 23:53', 
    audit: true, icon: '/image/icon7.png', isFavorite: false 
  },
   { 
    id: 8, symbol: 'ARK', name: 'Ark', address: '0xcae...18b9d', 
    price: '27.19', change: '+3.2', fdv: '0', mcap: '382.2M', 
    transactions: '35.75K', traders: '21.32K', turnover: '7.07M', age: '2025-08-26 19:16', 
    audit: true, icon: '/image/icon8.png', isFavorite: false 
  },
     { 
    id: 9, symbol: 'POWER', name: 'Power', address: '0x9dc...a1223', 
    price: '0.215', change: '-19.42', fdv: '45.06M', mcap: '5.49M', 
    transactions: '56.99K', traders: '2.48K', turnover: '17.14M', age: '2025-12-04 18:12', 
    audit: true, icon: '/image/icon9.png', isFavorite: false 
  },
   { 
    id: 10, symbol: '$BANANA', name: 'Banana', address: '0x3d4...9a760', 
    price: '0.003245', change: '-0.12', fdv: '32.44M', mcap: '32.26M', 
    transactions: '16.76K', traders: '1.54K', turnover: '3.58M', age: '2024-11-18 17:00', 
    audit: true, icon: '/image/icon10.png', isFavorite: false 
  },
   { 
    id: 11, symbol: '币安聊天室', name: 'Chatroom', address: '0x635...04444', 
    price: '0.01262', change: '-86.24', fdv: '12.62K', mcap: '12.62K', 
    transactions: '19.95K', traders: '6.37K', turnover: '10.13M', age: '2025-12-09 20:06', 
    audit: true, icon: '/image/icon11.png', isFavorite: false 
  },
   { 
    id: 12, symbol: 'DOYR', name: 'Doyr', address: '0x925...64444', 
    price: '0.002866', change: '-23.01', fdv: '2.87M', mcap: '2.87M', 
    transactions: '17.46K', traders: '5.7K', turnover: '3.5M', age: '2025-12-06 21:29', 
    audit: true, icon: '/image/icon12.png', isFavorite: false 
  },
]

const filteredList = computed(() => {
  return mockData.filter(item => 
    item.symbol.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
    item.address.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const formatAddress = (addr) => {
  return addr // Already formatted in mock
}

const getChangeClass = (changeStr) => {
  if (changeStr.includes('+')) return 'text-green'
  return 'text-red'
}

const toggleFavorite = (item) => {
    item.isFavorite = !item.isFavorite
}

const handleSort = (field) => {
    console.log('Sort by', field)
}
</script>

<style scoped>
.crypto-spot-page {
  background-color: #000;
  min-height: 100vh;
  padding-top: 64px; /* Header height */
  color: #fff;
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
}

.fixed-header-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}

.spot-content {
  padding: 40px 40px 80px 40px;
  min-height: calc(100vh - 400px);
}

/* Header & Tabs */
.market-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.market-tabs {
  display: flex;
  gap: 12px;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #1a1a1a;
  border: 1px solid #333;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  color: #888;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn:hover {
    border-color: #555;
    color: #ccc;
}

.tab-btn.active {
  background: #222;
  border-color: #bcff2f;
  color: #fff;
}

.tab-btn .el-icon {
    font-size: 16px;
}

.search-input-wrapper {
    position: relative;
    background: #111;
    border: 1px solid #333;
    border-radius: 20px;
    display: flex;
    align-items: center;
    padding: 8px 16px;
    width: 300px;
}

.search-icon {
    color: #666;
    margin-right: 8px;
}

.search-input-wrapper input {
    background: transparent;
    border: none;
    color: #fff;
    outline: none;
    width: 100%;
    font-size: 14px;
}

/* Table */
.market-table-container {
  overflow-x: auto;
}

.market-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 14px;
}

.market-table th {
  text-align: left;
  color: #666;
  font-weight: 500;
  padding: 16px 8px;
  border-bottom: 1px solid #222;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
}

.market-table th:hover {
    color: #ccc;
}

.market-table td {
  padding: 16px 8px;
  border-bottom: 1px solid #1a1a1a;
  vertical-align: middle;
}

.market-table tr:hover td {
    background-color: #0a0a0a;
}

/* Columns */
.col-fav { width: 40px; text-align: center; }
.col-name { min-width: 200px; }
.col-price { min-width: 100px; }
.col-change { min-width: 100px; }
.col-fdv { min-width: 100px; }
.col-mcap { min-width: 100px; }
.col-txns { min-width: 100px; }
.col-traders { min-width: 120px; }
.col-turnover { min-width: 100px; }
.col-age { min-width: 140px; }
.col-audit { width: 60px; text-align: center; }

/* Cell Content */
.star-icon {
    font-size: 16px;
    color: #444;
    cursor: pointer;
}
.star-icon.active {
    color: #fff;
}

.token-info-cell {
    display: flex;
    align-items: center;
    gap: 12px;
}

.token-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #333;
}

.token-details {
    display: flex;
    flex-direction: column;
}

.token-symbol {
    font-weight: 700;
    color: #fff;
    font-size: 15px;
}

.token-address {
    font-size: 12px;
    color: #666;
    display: flex;
    align-items: center;
    gap: 4px;
}

.copy-icon {
    cursor: pointer;
    font-size: 12px;
}

.text-green { color: #82ff28; }
.text-red { color: #ff3333; }

.audit-check {
    color: #82ff28;
    font-size: 18px;
}

/* Pagination */
.pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 40px;
}

:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background-color: #82ff28;
  color: #000;
}

:deep(.el-pagination.is-background .el-pager li) {
  background-color: transparent;
  color: #888;
}

:deep(.el-pagination.is-background .btn-prev), :deep(.el-pagination.is-background .btn-next) {
    background-color: transparent;
    color: #888;
}

/* Floating Button */
.floating-chat-btn {
  position: fixed;
  bottom: 40px;
  right: 40px;
  width: 56px;
  height: 56px;
  background-color: #333;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  transition: transform 0.3s;
  z-index: 99;
}

.floating-chat-btn:hover {
  transform: scale(1.1);
  background-color: #444;
}

.floating-chat-btn .el-icon {
  font-size: 24px;
  color: #fff;
}
</style>
