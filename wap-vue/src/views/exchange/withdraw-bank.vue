<template>
  <div class="charge-bank pb-20">
    <van-sticky>
      <fx-header>
        <template #title>
          {{ $t('Bankcardwithdrawal') }}
        </template>
        <template #right>
          <van-icon name="orders-o" @click="openRecord"></van-icon>
        </template>
      </fx-header>
    </van-sticky>
    <div class="pt-6">
      <h1 class="px-4 title">{{ $t('Bankcardwithdrawal') }}</h1>
      <h4 class="px-4 ahs pt-2 pb-2 text-sm">{{ $t('WithdrawUsdBank') }}</h4>
      <van-action-sheet v-model:show="show" :actions="actions" @select="onSelect"></van-action-sheet>

      <van-form @failed="onFailed">
        <van-cell-group inset>
          <p class="pt-6 pb-2">{{ $t('FrenchCurrency') }}</p>
          <van-field class="select-item" @click="showActions('fiat')" readonly v-model="fiatValue" name="pattern"
            :placeholder="$t('selectFrenchCurrency')">
            <template #extra>
              <van-icon name="arrow-down" color="#878A96" size="18" />
            </template>
          </van-field>
        </van-cell-group>
        <van-cell-group inset>
          <p class="pt-6 pb-2">{{ $t('withdrawalAmount') }}</p>
          <van-field class="select-item" name="picker" type="number" @input="debounceInput" v-model="amount"
            :placeholder="$t('enterwithdrawalAmount')">
            <template #extra>
              <span class="currency-title">{{ fiatValue }}</span>
              <span class="ml-2 all" @click="allFun()">{{ $t('all') }}</span>
            </template>
          </van-field>
        </van-cell-group>
      </van-form>
      <div class="flex px-4 pt-4 pb-8 justify-between">
        <div class="ahs text-base">
          {{ $t('available') }}
        </div>
        <div class="money text-base">
          <span class="mr-1 font-semibold">{{ bal * rate }}</span>
          <span>{{ fiatValue }}</span>
        </div>
      </div>
      <div class="mx-4 pb-10 pt-10 quantity-wrap">
        <div class="flex justify-between items-center">
          <div class="ahs">
            {{ $t('AvailableaccountAmount') }}
          </div>
          <div class="money">
            <span class="mr-1 text-xl font-semibold">{{ bal * rate }}</span>
            <span class="text-base">{{ fiatValue }}</span>
          </div>
        </div>
        <div class="flex justify-between pt-10">
          <div class="ahs">
            {{ $t('WithdrawalFee') }}
          </div>
          <div class="money text-base">
            <span class="mr-1 font-semibold">{{ fee || '0.00' }}</span>
            <span>{{ fiatValue }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="px-4 mt-4 centent">
      <h2>{{ $t('WithdrawalInstructions') }}</h2>
      <p class="mt-2 text-xs">{{ $t('bankTips1') }}</p>
      <p class="mt-2 text-xs">{{ $t('bankTips2') }}</p>
      <p class="mt-2 text-xs">{{ $t('bankTips3') }}</p>
      <p class="mt-2 text-xs">{{ $t('bankTips4') }}</p>
    </div>
    <div class="px-4 mt-6">
      <van-button class="w-full" type="primary" @click="submit">{{
        $t('submit')
      }}</van-button>
    </div>
    <fx-popup v-model:show="showPopup" :payInfo="payInfo" @close="closeOrder" :fee="fee" :rate="rate"
      :fiatValue="fiatValue" :volume_last="volume_last"></fx-popup>
  </div>
</template>

<script setup>
import fxCountryList from '@/components/fx-country-list/index.vue'
import fxPopup from '@/components/fx-popup/confirm-order.vue'
import { _getCurrencyList, _getPaymentMethod } from '@/service/trade.api.js'
import { ref, watch, onMounted } from 'vue'
import { _getSessionToken } from '@/service/recharge.api'
import { _withdrawFee } from '@/service/withdraw.api'
import { useRouter } from 'vue-router'
import { showDialog, showToast } from 'vant'
import { _getBalance, _bankPaymentMethodList } from '@/service/user.api.js'
import { setStorage, debounce } from '@/utils/index'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const actions = ref([])
const show = ref(false)
const bal = ref(0)
_getBalance().then((res) => {
  bal.value = res.money
})
const currencies = ref([])
const payInfo = ref({})
const payList = ref([])
onMounted(async () => {
  c2cPaymentMethodList()
  // 获取法币列表
  _getCurrencyList().then((res) => {
    currencies.value = res.map((item) => {
      return {
        name: item.currency,
        rate: item.rate
      }
    })
    
    // 重新排序：JPY和USD优先
    const currencyOrder = ['JPY', 'USD']
    const sortedCurrencies = []
    
    // 先添加JPY和USD
    currencyOrder.forEach(currency => {
      const found = currencies.value.find(item => item.name === currency)
      if (found) {
        sortedCurrencies.push(found)
      }
    })
    
    // 再添加其他货币
    currencies.value.forEach(item => {
      if (!currencyOrder.includes(item.name)) {
        sortedCurrencies.push(item)
      }
    })
    
    actions.value = sortedCurrencies
  })

  _getSessionToken({}).then((res) => {
    payInfo.value.session_token = res.session_token
  })
})
const fiatValue = ref('')
const rate = ref(1)
const amount = ref('')
const router = useRouter()
const showPopup = ref(false)
const fee = ref(0)
const volume_last = ref(0)

const openRecord = () => {
  setStorage('recordId', 3)
  router.push('/Record/DepositAndWithdrawal')
}
//获取提现列表（无需绑定银行卡）
const c2cPaymentMethodList = () => {
  _bankPaymentMethodList().then((res) => {
    console.log('银行卡列表:', res)
    // 无需绑定银行卡，用户可以直接提现
    // 不再显示绑定银行卡的弹窗提醒
  }).catch((error) => {
    console.log('获取银行卡列表失败:', error)
    // 即使获取失败也不影响用户提现
  })
}

const debounceInput = debounce(function () {
  changeInput()
}, 500)
const changeInput = () => {
  if (amount.value === '') {
    fee.value = ''
    return
  }
  _withdrawFee({
    amount: amount.value,
    channel: 'USDT_'
  }).then((res) => {
    if (res.withdraw_fee_type == 'rate') {
      fee.value = res.fee
      volume_last.value = res.volume_last
    } else {
      fee.value = res.fee * rate.value
      volume_last.value = amount.value - fee.value
    }

    payInfo.value.fee = fee.value
  })
}

const actionType = ref('fiat') // 弹框类型

// watch(actionType, (val, oldVal) => {
//   if (val === 'fiat') {
//     // 获取法币列表
//     _getCurrencyList().then(res => {
//       currencies.value = res.map(item => {
//         return {
//           name: item.currency
//         }
//       });
//       actions.value = currencies.value
//     })
//   } else {
//     actions.value = [{ name: '银行卡' }]
//   }
// })
const onFailed = (errorInfo) => {
  console.log('failed', errorInfo)
}
//全部
const allFun = () => {
  amount.value = bal.value * rate.value
}
// 显示弹框
const showActions = (type) => {
  if (type == 'fiat') {
    show.value = true
  }
}

const onSelect = (value) => {
  fiatValue.value = value.name
  rate.value = value.rate
  show.value = false
}

const submit = () => {
  if (!fiatValue.value) {
    showToast(t('selectFrenchCurrency'))
    return
  }
  if (!amount.value) {
    showToast(t('enterWithdrawalAmount'))
    return
  }
  let numReg = /^[0-9]+([.]{1}[0-9]+){0,1}$/
  if (!numReg.test(amount.value)) {
    showToast(t('enterWithdrawalAmountNumber'))
    return
  }

  // 设置提现信息
  payInfo.value.direction = 'withdraw'
  payInfo.value.currency = fiatValue.value
  payInfo.value.coin_amount = amount.value / rate.value
  payInfo.value.fa_amount = amount.value
  payInfo.value.payment_method_id = '0' // 无需支付方式验证
  
  // 设置国家信息（根据货币自动判断）
  let nationality = 'United States' // 默认美国
  if (fiatValue.value === 'JPY') {
    nationality = 'Japan (日本)'
  } else if (fiatValue.value === 'USD') {
    nationality = 'United States'
  } else if (fiatValue.value === 'CNY') {
    nationality = 'China (中国)'
  } else if (fiatValue.value === 'INR') {
    nationality = 'India (印度)'
  } else if (fiatValue.value === 'MYR') {
    nationality = 'Malaysia (马来西亚)'
  } else if (fiatValue.value === 'HKD') {
    nationality = 'Hong Kong (香港)'
  }
  payInfo.value.nationality = nationality
  
  console.log('提现申请参数:', payInfo.value)
  
  // 直接跳转到资金密码验证页面
  router.push('/exchange/fund-password-verify?type=bank&payInfo=' + 
    JSON.stringify(payInfo.value) + 
    '&bankType=withdraw')
}
const submitOrder = () => {
  showPopup.value = false
  router.push('/exchange/fund-password-verify?type=bankWithdraw')
}
const excountry = (item) => {
  console.log(item)
}
const closeOrder = () => {
  showPopup.value = false
}
</script>
<style lang="scss" scoped>
.select-item {
  background: $input_background;
  padding: 0 15px;
  align-items: center;
  height: 50px;
  border-radius: 3px;
}

.title {
  font-size: 16px;
  color: $text_color;
  font-weight: bold;
}

.usd-input {
  height: 50px;
  background: $input_background;
  font-size: 16px;
}

.centent {
  h2 {
    color: $text_color;
    font-size: 16px;
  }

  p {
    color: $text_color1;
    line-height: 22px;
    font-size: 14px;
  }
}

.ahs {
  color: $text_color1;
}

.all {
  color: $active_line;
}

.money {
  color: $text_color;
  //font-size: 20px;
  //font-weight: bold;
}

.quantity-wrap {
  border-top: 1px solid $border_color;
  border-bottom: 1px solid $border_color;
}


.charge-bank {
  font-size: 14px;
}

:deep(.intl-tel-input.allow-dropdown .flag-container:hover .selected-flag) {
  background: transparent !important;
}

:deep(.van-cell-group--inset) {
  overflow: inherit !important;
}

:deep(.van-cell-group) {
  background: transparent !important;
}

:deep(.van-field__control) {
  color: $text_color !important;
}

.currency-title {
  color: $text_color !important;
}
</style>
