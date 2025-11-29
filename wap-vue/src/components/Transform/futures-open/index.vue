<template>
  <div class="futures-open-container">
    <!-- 永续合约/交割合约切换 -->
    <div class="contract-type-tabs">
      <div class="tab-item active">
        {{ t('永续合约') }}
      </div>
    </div>

    <!-- 杠杆选择 -->
    <div class="leverage-section">
      <div class="leverage-label">{{ t('杠杆') }}</div>
      <div class="leverage-selector" @click="showLeverageModal = true">
        <span class="leverage-value">{{ currentLeverage }}x</span>
        <van-icon name="arrow-down" size="12" />
      </div>
    </div>

    <!-- 买入/卖出切换 -->
    <div class="trade-direction-tabs">
      <div 
        class="direction-tab buy-tab" 
        :class="{ active: tradeDirection === 'buy' }" 
        @click="setTradeDirection('buy')"
      >
        {{ t('开多') }}
      </div>
      <div 
        class="direction-tab sell-tab" 
        :class="{ active: tradeDirection === 'sell' }" 
        @click="setTradeDirection('sell')"
      >
        {{ t('开空') }}
      </div>
    </div>

    <!-- 订单类型选择 -->
    <div class="order-type-tabs">
      <div 
        class="type-tab" 
        :class="{ active: orderType === 'market' }" 
        @click="setOrderType('market')"
      >
        {{ t('市价') }}
      </div>
      <div 
        class="type-tab" 
        :class="{ active: orderType === 'limit' }" 
        @click="setOrderType('limit')"
      >
        {{ t('限价') }}
      </div>
    </div>

    <!-- 价格输入 -->
    <div class="price-input-section" v-if="orderType === 'limit'">
      <div class="input-label">{{ t('价格') }}</div>
      <div class="price-input-wrapper">
        <van-field
          v-model="orderPrice"
          type="number"
          :placeholder="t('请输入价格')"
          class="price-input"
        />
        <span class="currency-unit">USDT</span>
      </div>
    </div>

    <!-- 数量输入 -->
    <div class="quantity-input-section">
      <div class="input-label">{{ t('数量') }}</div>
      <div class="quantity-input-wrapper">
        <van-field
          v-model="orderQuantity"
          type="number"
          :placeholder="t('请输入数量')"
          class="quantity-input"
        />
        <span class="currency-unit">{{ symbol.replace('USDT', '').replace('2412', '') }}</span>
      </div>
    </div>

    <!-- 数量快捷选择 -->
    <div class="quantity-shortcuts">
      <div 
        class="shortcut-btn" 
        v-for="percent in [25, 50, 75, 100]" 
        :key="percent"
        @click="setQuantityByPercent(percent)"
      >
        {{ percent }}%
      </div>
    </div>

    <!-- 可开仓数量 -->
    <div class="available-info">
      <span class="label">{{ t('可开仓') }}</span>
      <span class="value">{{ availableQuantity }} {{ symbol.replace('USDT', '') }}</span>
    </div>

    <!-- 预估费用 -->
    <div class="estimated-cost">
      <div class="cost-item">
        <span class="label">{{ t('预估费用') }}</span>
        <span class="value">{{ estimatedCost }} USDT</span>
      </div>
      <div class="cost-item">
        <span class="label">{{ t('手续费') }}</span>
        <span class="value">{{ tradingFee }} USDT</span>
      </div>
    </div>

    <!-- 下单按钮 -->
    <div class="submit-button-wrapper">
      <van-button 
        :class="['submit-button', tradeDirection === 'buy' ? 'buy-button' : 'sell-button']"
        :loading="isSubmitting"
        @click="submitOrder"
        block
        round
      >
        {{ tradeDirection === 'buy' ? t('买入开多') : t('卖出开空') }}
      </van-button>
    </div>

    <!-- 杠杆调整弹窗 -->
    <van-popup v-model:show="showLeverageModal" position="bottom" round closeable>
      <div class="leverage-modal">
        <div class="modal-header">
          <h3>{{ t('调整杠杆') }}</h3>
        </div>
        <div class="leverage-content">
          <!-- 杠杆数值调整 -->
          <div class="leverage-adjuster">
            <div class="adjuster-controls">
              <van-button
                class="adjust-btn minus-btn"
                @click="adjustLeverage(-1)"
                :disabled="tempLeverage <= 1"
                round
                size="small"
              >
                -
              </van-button>
              <div class="leverage-display">
                <span class="leverage-number">{{ tempLeverage }}</span>
                <span class="leverage-unit">x</span>
              </div>
              <van-button
                class="adjust-btn plus-btn"
                @click="adjustLeverage(1)"
                round
                size="small"
              >
                +
              </van-button>
            </div>
          </div>

          <!-- 快捷杠杆选择 -->
          <div class="leverage-shortcuts">
            <div
              class="leverage-shortcut"
              v-for="leverage in [1, 2, 5, 10]"
              :key="leverage"
              :class="{ active: leverage === tempLeverage }"
              @click="tempLeverage = leverage"
            >
              {{ leverage }}x
            </div>
          </div>

          <!-- 风险提示 -->
          <div class="risk-warning" v-if="tempLeverage > 5">
            <van-icon name="warning-o" color="#ff6b35" />
            <span>{{ t('高杠杆交易风险较大，请谨慎操作') }}</span>
          </div>

          <!-- 杠杆说明 -->
          <div class="leverage-info">
            <p>{{ t('当前杠杆倍数最高可开') }}: {{ (20000 * tempLeverage).toLocaleString() }} USDT</p>
            <p>{{ t('杠杆倍数越高风险越大，请谨慎选择合适的杠杆倍数') }}</p>
            <p class="risk-text" v-if="tempLeverage > 10">{{ t('永续合约风险过高，杠杆最大为10倍！') }}</p>
          </div>

          <!-- 确认按钮 -->
          <div class="modal-actions">
            <van-button
              class="confirm-btn"
              type="primary"
              @click="confirmLeverage"
              block
              round
              size="large"
            >
              {{ t('确认') }}
            </van-button>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { showToast } from 'vant'

const { t } = useI18n()

// Props
const props = defineProps({
  symbol: {
    type: String,
    default: 'AU2412'
  },
  price: {
    type: [String, Number],
    default: '0'
  },
  greenData: {
    type: Array,
    default: () => []
  },
  redData: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['ordered'])

// 响应式数据
const tradeDirection = ref('buy')
const orderType = ref('market')
const orderPrice = ref('')
const orderQuantity = ref('')
const currentLeverage = ref(10)
const tempLeverage = ref(10)
const showLeverageModal = ref(false)
const isSubmitting = ref(false)

// 计算属性
const availableQuantity = computed(() => {
  // 这里应该根据实际余额和杠杆计算可开仓数量
  return '1000.00'
})

const estimatedCost = computed(() => {
  if (!orderQuantity.value) return '0.00'
  const price = orderType.value === 'market' ? props.price : orderPrice.value
  const quantity = parseFloat(orderQuantity.value) || 0
  const cost = (parseFloat(price) || 0) * quantity / currentLeverage.value
  return cost.toFixed(2)
})

const tradingFee = computed(() => {
  if (!orderQuantity.value) return '0.00'
  const price = orderType.value === 'market' ? props.price : orderPrice.value
  const quantity = parseFloat(orderQuantity.value) || 0
  const fee = (parseFloat(price) || 0) * quantity * 0.0005 // 0.05% 手续费
  return fee.toFixed(4)
})

// 方法
const setTradeDirection = (direction) => {
  tradeDirection.value = direction
}

const setOrderType = (type) => {
  orderType.value = type
  if (type === 'market') {
    orderPrice.value = ''
  }
}

const setQuantityByPercent = (percent) => {
  // 根据百分比设置数量
  const maxQuantity = parseFloat(availableQuantity.value) || 0
  const quantity = (maxQuantity * percent / 100).toFixed(2)
  orderQuantity.value = quantity
}

const adjustLeverage = (delta) => {
  const newLeverage = tempLeverage.value + delta
  if (newLeverage >= 1 && newLeverage <= 100) {
    tempLeverage.value = newLeverage
  }
}

const confirmLeverage = () => {
  if (tempLeverage.value > 10) {
    showToast(t('永续合约风险过高，杠杆最大为10倍！'))
    return
  }
  currentLeverage.value = tempLeverage.value
  showLeverageModal.value = false
  showToast(t('杠杆调整成功'))
}

// 监听杠杆弹窗显示，同步临时杠杆值
watch(showLeverageModal, (show) => {
  if (show) {
    tempLeverage.value = currentLeverage.value
  }
})

const submitOrder = async () => {
  // 验证输入
  if (!orderQuantity.value) {
    showToast(t('请输入数量'))
    return
  }

  if (orderType.value === 'limit' && !orderPrice.value) {
    showToast(t('请输入价格'))
    return
  }

  isSubmitting.value = true

  try {
    // 这里应该调用实际的下单API
    const orderData = {
      symbol: props.symbol,
      direction: tradeDirection.value,
      type: orderType.value,
      quantity: orderQuantity.value,
      price: orderType.value === 'limit' ? orderPrice.value : props.price,
      leverage: currentLeverage.value
    }

    console.log('提交订单:', orderData)
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    showToast(t('下单成功'))
    emit('ordered', orderData)
    
    // 重置表单
    orderQuantity.value = ''
    orderPrice.value = ''
    
  } catch (error) {
    console.error('下单失败:', error)
    showToast(t('下单失败'))
  } finally {
    isSubmitting.value = false
  }
}

// 监听价格变化，自动填充限价单价格
watch(() => props.price, (newPrice) => {
  if (orderType.value === 'limit' && !orderPrice.value) {
    orderPrice.value = newPrice
  }
})
</script>

<style lang="scss" scoped>
.futures-open-container {
  padding: 16px 0;
}

.contract-type-tabs {
  display: flex;
  margin-bottom: 16px;
  
  .tab-item {
    flex: 1;
    text-align: center;
    padding: 8px;
    background: $color_main;
    color: white;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
  }
}

.leverage-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .leverage-label {
    font-size: 16px;
    color: $text_color;
    font-weight: 500;
  }

  .leverage-selector {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    border: 1px solid $border_color;
    border-radius: 6px;
    cursor: pointer;
    background: $main2_background;
    min-width: 60px;
    justify-content: center;

    .leverage-value {
      font-size: 16px;
      color: $color_main;
      font-weight: 600;
    }
  }
}

.trade-direction-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;

  .direction-tab {
    flex: 1;
    text-align: center;
    padding: 16px 12px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;

    &.buy-tab {
      background: rgba(255, 68, 68, 0.1);
      color: $red;
      border: 1px solid rgba(255, 68, 68, 0.3);

      &.active {
        background: $red;
        color: white;
        box-shadow: 0 2px 8px rgba(255, 68, 68, 0.3);
      }
    }

    &.sell-tab {
      background: rgba(0, 200, 81, 0.1);
      color: $green;
      border: 1px solid rgba(0, 200, 81, 0.3);

      &.active {
        background: $green;
        color: white;
        box-shadow: 0 2px 8px rgba(0, 200, 81, 0.3);
      }
    }
  }
}

.order-type-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;

  .type-tab {
    flex: 1;
    text-align: center;
    padding: 12px;
    background: $main2_background;
    color: $text_color2;
    border-radius: 6px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;

    &.active {
      background: $color_main;
      color: white;
      box-shadow: 0 2px 6px rgba(17, 148, 247, 0.3);
    }
  }
}

.price-input-section,
.quantity-input-section {
  margin-bottom: 20px;

  .input-label {
    font-size: 16px;
    color: $text_color;
    margin-bottom: 12px;
    font-weight: 500;
  }

  .price-input-wrapper,
  .quantity-input-wrapper {
    position: relative;

    .currency-unit {
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 15px;
      color: $text_color2;
      font-weight: 500;
    }
  }

  :deep(.van-field) {
    background: $main2_background;
    border-radius: 8px;
    border: 1px solid $border_color;

    .van-field__control {
      color: $text_color;
      padding-right: 70px;
      font-size: 16px;
      height: 48px;
      line-height: 48px;
    }
  }
}

.quantity-shortcuts {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;

  .shortcut-btn {
    flex: 1;
    text-align: center;
    padding: 12px 8px;
    background: $main2_background;
    color: $text_color2;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
    border: 1px solid $border_color;

    &:hover {
      background: $color_main;
      color: white;
      border-color: $color_main;
    }
  }
}

.available-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 15px;
  padding: 12px 16px;
  background: $main2_background;
  border-radius: 8px;

  .label {
    color: $text_color2;
    font-weight: 500;
  }

  .value {
    color: $text_color;
    font-weight: 600;
  }
}

.estimated-cost {
  margin-bottom: 24px;
  padding: 16px;
  background: $main2_background;
  border-radius: 8px;

  .cost-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    font-size: 15px;

    &:last-child {
      margin-bottom: 0;
    }

    .label {
      color: $text_color2;
      font-weight: 500;
    }

    .value {
      color: $text_color;
      font-weight: 600;
    }
  }
}

.submit-button-wrapper {
  .submit-button {
    height: 52px;
    font-size: 18px;
    font-weight: 700;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    &.buy-button {
      background: $red;
      border-color: $red;
      box-shadow: 0 4px 12px rgba(255, 68, 68, 0.3);
    }

    &.sell-button {
      background: $green;
      border-color: $green;
      box-shadow: 0 4px 12px rgba(0, 200, 81, 0.3);
    }
  }
}

.leverage-modal {
  padding: 24px;
  background: $mainBgColor;

  .modal-header {
    text-align: center;
    margin-bottom: 32px;

    h3 {
      margin: 0;
      font-size: 20px;
      color: $text_color;
      font-weight: 600;
    }
  }

  .leverage-content {
    .leverage-adjuster {
      margin-bottom: 32px;

      .adjuster-controls {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 24px;

        .adjust-btn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          font-size: 24px;
          font-weight: 600;

          &.minus-btn {
            background: $main2_background;
            color: $text_color;
            border: 1px solid $border_color;
          }

          &.plus-btn {
            background: $color_main;
            color: white;
            border: 1px solid $color_main;
          }
        }

        .leverage-display {
          display: flex;
          align-items: baseline;
          gap: 4px;

          .leverage-number {
            font-size: 48px;
            font-weight: 700;
            color: $text_color;
          }

          .leverage-unit {
            font-size: 24px;
            color: $text_color2;
          }
        }
      }
    }

    .leverage-shortcuts {
      display: flex;
      gap: 12px;
      margin-bottom: 24px;

      .leverage-shortcut {
        flex: 1;
        text-align: center;
        padding: 12px;
        background: $main2_background;
        color: $text_color;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s;
        border: 1px solid $border_color;

        &.active {
          background: rgba(17, 148, 247, 0.1);
          color: $color_main;
          border-color: $color_main;
        }
      }
    }

    .risk-warning {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: rgba(255, 107, 53, 0.1);
      border-radius: 8px;
      margin-bottom: 20px;

      span {
        font-size: 14px;
        color: #ff6b35;
      }
    }

    .leverage-info {
      margin-bottom: 32px;

      p {
        margin: 8px 0;
        font-size: 14px;
        color: $text_color2;
        line-height: 1.5;

        &.risk-text {
          color: #ff6b35;
          font-weight: 500;
        }
      }
    }

    .modal-actions {
      .confirm-btn {
        height: 48px;
        font-size: 16px;
        font-weight: 600;
        background: $color_main;
        border-color: $color_main;
      }
    }
  }
}
</style>
