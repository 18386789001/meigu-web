<template>
  <div class="futures-order-container">
    <!-- 标签页导航 -->
    <div class="order-tabs">
      <div 
        class="tab-item" 
        :class="{ active: activeTab === 'positions' }" 
        @click="setActiveTab('positions')"
      >
        {{ t('持仓') }}({{ futuresHold.length }})
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeTab === 'orders' }" 
        @click="setActiveTab('orders')"
      >
        {{ t('委托') }}({{ orderCur.length }})
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeTab === 'history' }" 
        @click="setActiveTab('history')"
      >
        {{ t('历史') }}
      </div>
    </div>

    <!-- 持仓列表 -->
    <div v-if="activeTab === 'positions'" class="positions-content">
      <div v-if="futuresHold.length === 0" class="empty-state">
        <div class="empty-icon">📊</div>
        <div class="empty-text">{{ t('暂无持仓') }}</div>
      </div>
      <div v-else class="positions-list">
        <div 
          v-for="(position, index) in futuresHold" 
          :key="index"
          class="position-item"
        >
          <div class="position-header">
            <div class="symbol-info">
              <span class="symbol">{{ position.symbol }}</span>
              <span class="direction" :class="position.direction === 'long' ? 'long' : 'short'">
                {{ position.direction === 'long' ? t('多') : t('空') }}
              </span>
              <span class="leverage">{{ position.leverage }}x</span>
            </div>
            <div class="pnl" :class="position.pnl >= 0 ? 'profit' : 'loss'">
              {{ position.pnl >= 0 ? '+' : '' }}{{ position.pnl }}
            </div>
          </div>
          <div class="position-details">
            <div class="detail-row">
              <span class="label">{{ t('数量') }}</span>
              <span class="value">{{ position.quantity }}</span>
            </div>
            <div class="detail-row">
              <span class="label">{{ t('开仓价') }}</span>
              <span class="value">{{ position.openPrice }}</span>
            </div>
            <div class="detail-row">
              <span class="label">{{ t('标记价') }}</span>
              <span class="value">{{ position.markPrice }}</span>
            </div>
            <div class="detail-row">
              <span class="label">{{ t('保证金') }}</span>
              <span class="value">{{ position.margin }}</span>
            </div>
          </div>
          <div class="position-actions">
            <van-button 
              size="small" 
              type="primary" 
              @click="closePosition(position)"
            >
              {{ t('平仓') }}
            </van-button>
            <van-button 
              size="small" 
              plain 
              @click="adjustPosition(position)"
            >
              {{ t('调整') }}
            </van-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 委托列表 -->
    <div v-if="activeTab === 'orders'" class="orders-content">
      <div v-if="orderCur.length === 0" class="empty-state">
        <div class="empty-icon">📋</div>
        <div class="empty-text">{{ t('暂无委托') }}</div>
      </div>
      <div v-else class="orders-list">
        <div 
          v-for="(order, index) in orderCur" 
          :key="index"
          class="order-item"
        >
          <div class="order-header">
            <div class="symbol-info">
              <span class="symbol">{{ order.symbol }}</span>
              <span class="direction" :class="order.direction === 'buy' ? 'buy' : 'sell'">
                {{ order.direction === 'buy' ? t('买入') : t('卖出') }}
              </span>
              <span class="order-type">{{ order.type === 'market' ? t('市价') : t('限价') }}</span>
            </div>
            <div class="order-status" :class="order.status">
              {{ t(order.status) }}
            </div>
          </div>
          <div class="order-details">
            <div class="detail-row">
              <span class="label">{{ t('数量') }}</span>
              <span class="value">{{ order.quantity }}</span>
            </div>
            <div class="detail-row" v-if="order.type === 'limit'">
              <span class="label">{{ t('价格') }}</span>
              <span class="value">{{ order.price }}</span>
            </div>
            <div class="detail-row">
              <span class="label">{{ t('已成交') }}</span>
              <span class="value">{{ order.filled || '0' }}</span>
            </div>
            <div class="detail-row">
              <span class="label">{{ t('时间') }}</span>
              <span class="value">{{ formatTime(order.createTime) }}</span>
            </div>
          </div>
          <div class="order-actions">
            <van-button 
              size="small" 
              type="danger" 
              @click="cancelOrder(order)"
              v-if="order.status === 'pending'"
            >
              {{ t('撤单') }}
            </van-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 历史记录 -->
    <div v-if="activeTab === 'history'" class="history-content">
      <div v-if="futuresHistory.length === 0" class="empty-state">
        <div class="empty-icon">📜</div>
        <div class="empty-text">{{ t('暂无历史记录') }}</div>
      </div>
      <div v-else class="history-list">
        <div 
          v-for="(record, index) in futuresHistory" 
          :key="index"
          class="history-item"
        >
          <div class="history-header">
            <div class="symbol-info">
              <span class="symbol">{{ record.symbol }}</span>
              <span class="action">{{ t(record.action) }}</span>
            </div>
            <div class="pnl" :class="record.pnl >= 0 ? 'profit' : 'loss'">
              {{ record.pnl >= 0 ? '+' : '' }}{{ record.pnl }}
            </div>
          </div>
          <div class="history-details">
            <div class="detail-row">
              <span class="label">{{ t('数量') }}</span>
              <span class="value">{{ record.quantity }}</span>
            </div>
            <div class="detail-row">
              <span class="label">{{ t('价格') }}</span>
              <span class="value">{{ record.price }}</span>
            </div>
            <div class="detail-row">
              <span class="label">{{ t('时间') }}</span>
              <span class="value">{{ formatTime(record.createTime) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { showToast, showConfirmDialog } from 'vant'

const { t } = useI18n()

// Props
const props = defineProps({
  symbol: {
    type: String,
    default: 'AU2412'
  },
  orderCur: {
    type: Array,
    default: () => []
  },
  orderHold: {
    type: Array,
    default: () => []
  },
  futuresHold: {
    type: Array,
    default: () => [
      {
        symbol: 'AU2412',
        direction: 'long',
        leverage: 10,
        quantity: '1.5',
        openPrice: '428.50',
        markPrice: '429.20',
        margin: '64.28',
        pnl: 1.05
      }
    ]
  },
  futuresHistory: {
    type: Array,
    default: () => [
      {
        symbol: 'AU2412',
        action: '开多',
        quantity: '1.0',
        price: '427.80',
        pnl: 2.15,
        createTime: Date.now() - 3600000
      }
    ]
  },
  topIndex: {
    type: Number,
    default: 1
  }
})

// Emits
const emit = defineEmits(['tab', 'recall'])

// 响应式数据
const activeTab = ref('positions')

// 方法
const setActiveTab = (tab) => {
  activeTab.value = tab
  emit('tab', tab)
}

const closePosition = async (position) => {
  try {
    await showConfirmDialog({
      title: t('确认平仓'),
      message: t('确定要平仓这个持仓吗？')
    })
    
    // 这里应该调用平仓API
    console.log('平仓:', position)
    showToast(t('平仓成功'))
    
  } catch (error) {
    // 用户取消
  }
}

const adjustPosition = (position) => {
  // 调整持仓（止盈止损等）
  console.log('调整持仓:', position)
  showToast(t('功能开发中'))
}

const cancelOrder = async (order) => {
  try {
    await showConfirmDialog({
      title: t('确认撤单'),
      message: t('确定要撤销这个委托吗？')
    })
    
    // 这里应该调用撤单API
    console.log('撤单:', order)
    showToast(t('撤单成功'))
    emit('recall', order)
    
  } catch (error) {
    // 用户取消
  }
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style lang="scss" scoped>
.futures-order-container {
  padding: 16px 0;
}

.order-tabs {
  display: flex;
  margin-bottom: 16px;
  border-bottom: 1px solid $border_color;
  
  .tab-item {
    flex: 1;
    text-align: center;
    padding: 12px 8px;
    font-size: 14px;
    color: $text_color2;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all 0.3s;
    
    &.active {
      color: $color_main;
      border-bottom-color: $color_main;
      font-weight: 500;
    }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: $text_color3;
  
  .empty-icon {
    font-size: 48px;
    margin-bottom: 12px;
  }
  
  .empty-text {
    font-size: 14px;
  }
}

.position-item,
.order-item,
.history-item {
  background: $main2_background;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  
  .position-header,
  .order-header,
  .history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    
    .symbol-info {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .symbol {
        font-size: 16px;
        font-weight: 600;
        color: $text_color;
      }
      
      .direction {
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
        
        &.long,
        &.buy {
          background: rgba(255, 68, 68, 0.1);
          color: $red;
        }
        
        &.short,
        &.sell {
          background: rgba(0, 200, 81, 0.1);
          color: $green;
        }
      }
      
      .leverage,
      .order-type {
        padding: 2px 6px;
        background: rgba(17, 148, 247, 0.1);
        color: $color_main;
        border-radius: 4px;
        font-size: 12px;
      }
      
      .action {
        font-size: 14px;
        color: $text_color2;
      }
    }
    
    .pnl {
      font-size: 16px;
      font-weight: 600;
      
      &.profit {
        color: $red;
      }
      
      &.loss {
        color: $green;
      }
    }
    
    .order-status {
      font-size: 14px;
      
      &.pending {
        color: $color_main;
      }
      
      &.filled {
        color: $green;
      }
      
      &.cancelled {
        color: $text_color3;
      }
    }
  }
  
  .position-details,
  .order-details,
  .history-details {
    margin-bottom: 12px;
    
    .detail-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
      font-size: 12px;
      
      .label {
        color: $text_color2;
      }
      
      .value {
        color: $text_color;
        font-weight: 500;
      }
    }
  }
  
  .position-actions,
  .order-actions {
    display: flex;
    gap: 8px;
    
    :deep(.van-button) {
      flex: 1;
      height: 32px;
      font-size: 12px;
    }
  }
}
</style>
