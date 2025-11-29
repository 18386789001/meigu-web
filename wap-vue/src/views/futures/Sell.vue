<template>
  <div class="futures-sell-container">
    <van-nav-bar
      :title="t('期货卖出')"
      left-arrow
      @click-left="$router.back()"
    />
    
    <div class="content">
      <div class="symbol-info">
        <div class="symbol-name">{{ symbol }}</div>
        <div class="current-price">
          <span class="price">{{ currentPrice }}</span>
          <span class="change" :class="{ up: priceChange > 0, down: priceChange < 0 }">
            {{ priceChange > 0 ? '+' : '' }}{{ priceChange }}%
          </span>
        </div>
      </div>

      <div class="form-section">
        <van-form @submit="onSubmit">
          <van-field
            v-model="form.quantity"
            name="quantity"
            :label="t('数量')"
            type="number"
            :placeholder="t('请输入卖出数量')"
            :rules="[{ required: true, message: t('请输入卖出数量') }]"
          />
          
          <van-field
            v-model="form.price"
            name="price"
            :label="t('价格')"
            type="number"
            :placeholder="t('请输入卖出价格')"
            :rules="[{ required: true, message: t('请输入卖出价格') }]"
          />

          <van-field
            v-model="form.stopLoss"
            name="stopLoss"
            :label="t('止损价')"
            type="number"
            :placeholder="t('请输入止损价格')"
          />

          <van-field
            v-model="form.takeProfit"
            name="takeProfit"
            :label="t('止盈价')"
            type="number"
            :placeholder="t('请输入止盈价格')"
          />

          <div class="order-info">
            <div class="info-item">
              <span class="label">{{ t('预计金额') }}</span>
              <span class="value">{{ estimatedAmount }}</span>
            </div>
            <div class="info-item">
              <span class="label">{{ t('手续费') }}</span>
              <span class="value">{{ commission }}</span>
            </div>
            <div class="info-item">
              <span class="label">{{ t('保证金') }}</span>
              <span class="value">{{ margin }}</span>
            </div>
          </div>

          <div class="submit-btn">
            <van-button
              type="danger"
              native-type="submit"
              block
              :loading="loading"
            >
              {{ t('确认卖出') }}
            </van-button>
          </div>
        </van-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { showToast } from 'vant';

const { t } = useI18n();
const route = useRoute();

const symbol = ref('AU2412');
const currentPrice = ref('428.593');
const priceChange = ref(1.35);
const loading = ref(false);

const form = ref({
  quantity: '',
  price: '',
  stopLoss: '',
  takeProfit: ''
});

const estimatedAmount = computed(() => {
  if (form.value.quantity && form.value.price) {
    return (parseFloat(form.value.quantity) * parseFloat(form.value.price)).toFixed(2);
  }
  return '0.00';
});

const commission = computed(() => {
  if (form.value.quantity && form.value.price) {
    return (parseFloat(form.value.quantity) * parseFloat(form.value.price) * 0.001).toFixed(2);
  }
  return '0.00';
});

const margin = computed(() => {
  if (form.value.quantity && form.value.price) {
    return (parseFloat(form.value.quantity) * parseFloat(form.value.price) * 0.1).toFixed(2);
  }
  return '0.00';
});

const onSubmit = (values) => {
  loading.value = true;
  
  // 模拟API调用
  setTimeout(() => {
    loading.value = false;
    showToast(t('卖出订单已提交'));
    // 这里可以添加实际的API调用逻辑
  }, 2000);
};
</script>

<style lang="scss" scoped>
.futures-sell-container {
  background: $main_background;
  min-height: 100vh;

  .content {
    padding: 20px;

    .symbol-info {
      background: $mainBgColor;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      text-align: center;

      .symbol-name {
        font-size: 26px;
        font-weight: 600;
        color: $text_color;
        margin-bottom: 10px;
      }

      .current-price {
        .price {
          font-size: 32px;
          font-weight: 700;
          color: $text_color;
          margin-right: 10px;
        }

        .change {
          font-size: 22px;
          font-weight: 600;

          &.up {
            color: $red;
          }

          &.down {
            color: $green;
          }
        }
      }
    }

    .form-section {
      .order-info {
        background: $mainBgColor;
        padding: 15px;
        border-radius: 8px;
        margin: 20px 0;

        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid $border_color;

          &:last-child {
            border-bottom: none;
          }

          .label {
            color: $text_color5;
            font-size: 20px;
          }

          .value {
            color: $text_color;
            font-size: 20px;
            font-weight: 600;
          }
        }
      }

      .submit-btn {
        margin-top: 30px;
      }
    }
  }
}
</style>
