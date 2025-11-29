<template>
  <div class="charge-bank pb-20">
    <fx-header>
      <template #title>
        {{ $t('BankCarddeposit') }}
      </template>
      <template #right>
        <van-icon @click="openRecord" name="orders-o"></van-icon>
      </template>
    </fx-header>
    <div class="px-6">
      <div class="pt-6">
        <h1 class="px-4 title"> {{ $t('BankCarddeposit') }}</h1>

        <!-- 新用户友好提示 -->
        <div class="px-4 mt-4 mb-2">
          <div class="user-tip">
            <van-icon name="info-o" size="16" color="#1989fa" />
            <span class="tip-text">{{ $t('noCardTip') || '无需绑定银行卡，直接选择币种和金额即可下单' }}</span>
          </div>
        </div>
        <van-action-sheet
          v-model:show="show"
          :actions="currencyActions"
          @select="onSelect"
          :title="$t('selectCurrency') || '选择货币'"
          :cancel-text="$t('cancel') || '取消'">
        </van-action-sheet>
        <ul class="flex flex-col" >
          <!-- 货币选择器 -->
          <li class="flex flex-col px-4 mt-6">
            <p>{{ $t('selectCurrency') || '选择货币' }}</p>
            <div class="select-item flex" @click="showActions()">
              <div class="flex-1 text-base">
                <span v-if="selectedCurrency">
                  {{ selectedCurrency.currency_symbol }} {{ getDisplayCurrencyName(selectedCurrency.currency) }}
                </span>
                <span v-else style="color: #C0C4CC;font-size: 14px;">{{ $t('selectCurrency') || '请选择货币' }}</span>
              </div>
              <div>
                <van-icon name="arrow-down" color="#878A96" size="16" />
              </div>
            </div>

          </li>




          <!-- <li class="flex flex-col px-4 mt-6"> -->
            <!-- <p>{{ $t('payAccount') }}</p> -->
            <!-- <input :placeholder="$t('enterBankcardnumber') " class="mt-2 usd-input pl-3" type="number" v-model="bankId" /> -->
          <!-- </li> -->


          <li class="flex flex-col px-4 mt-6">
            <p>{{ $t('RechargeAmount') }}</p>
            <div class="amount-input-wrapper">
              <input :placeholder="$t('RechargeRange') + '10-999999'" class="mt-2 usd-input pl-3" type="number"
                v-model="amount" />
              <span v-if="selectedCurrency" class="currency-suffix">{{ selectedCurrency.currency }}</span>
            </div>
            <!-- 显示预计到账USDT -->
            <div v-if="amount && selectedCurrency" class="mt-2 text-sm text-gray-600">
              {{ $t('expectedUSDT') || '预计到账' }}: {{ calculateUSDT() }} USD
            </div>
          </li>
        </ul>
      </div>
<!--@todo ee-->
      <div class="px-4 mt-4 centent" v-if="false">
        <h2>{{ $t('RechargeInstructions') }}</h2>
        <p class="mt-2 text-xs">{{ $t('desc1') }}</p>
        <p class="mt-2 text-xs">{{ $t('desc2') }}</p>
        <p class="mt-2 text-xs">{{ $t('desc3') }}</p>
        <p class="mt-2 text-xs">{{ $t('desc4') }}</p>
        <p class="mt-2 text-xs">{{ $t('desc5') }}</p>
      </div>
      <div class="px-4 mt-6">
        <van-button class="w-full" type="primary" @click="submit">{{ $t('submit') }}</van-button>
      </div>
    </div>
    <fx-popup v-model:show="showPopup" @close="closeOrder" :payInfo="payInfo" :bankId="bankId" :bankType="'recharge'"
      :fiatValue="selectedCurrency?.name || 'USD'"></fx-popup>
  </div>
</template>

<script setup>
import fxPopup from '@/components/fx-popup/confirm-order.vue'
import { ref, onBeforeMount } from 'vue';
import { useRouter } from "vue-router";
import { _getSessionToken, _getC2CCurrencyList } from "@/service/recharge.api";
import { useLanguageStore } from "@/store/language.store.js";
import { useI18n } from "vue-i18n";
import { showToast } from 'vant';
import { setStorage } from '@/utils/index'
import { _bankPaymentMethodList } from '@/service/user.api.js'

const { t } = useI18n()
const languageStore = useLanguageStore();
const router = useRouter()

// 货币名称多语言映射 - 返回货币代号
const getCurrencyName = (currency, lang) => {
  // 直接返回货币代号，不进行多语言转换
  console.log(`获取货币名称: ${currency}, 语言: ${lang}, 结果:`, currency)
  return currency
}

// 获取当前语言环境下的货币显示名称
const getDisplayCurrencyName = (currency) => {
  const currentLang = languageStore.language || 'zh-CN'
  let apiLang = 'Chinese'

  if (currentLang.includes('ja') || currentLang === 'Japanese') {
    apiLang = 'Japanese'
  } else if (currentLang.includes('en')) {
    apiLang = 'English'
  } else if (currentLang.includes('zh')) {
    apiLang = 'Chinese'
  }

  return getCurrencyName(currency, apiLang)
}

// 响应式数据
const show = ref(false)
const amount = ref('')
const showPopup = ref(false)
const bankId = ref(null)
const currencies = ref([]);
const payInfo = ref({})
const selectedCurrency = ref(null)
const currencyActions = ref([])

// 计算预计到账USDT
const calculateUSDT = () => {
  if (!amount.value || !selectedCurrency.value) return '0'
  const usdtAmount = parseFloat(amount.value) / selectedCurrency.value.rate
  return Math.floor(usdtAmount * 100) / 100
}
// 获取货币列表
const getCurrencyList = async () => {
  try {
    // 始终使用英文API获取所有币种，不管当前页面语言
    const apiLang = 'English'

    console.log('使用英文API获取所有币种，当前页面语言:', languageStore.language)

    // 使用认证的API请求
    const result = await _getC2CCurrencyList({ language: apiLang })

    console.log('API返回数据:', result)

    if (result && result.length > 0) {
      // 创建货币选项数组 - 显示所有货币种类
      let currencyOptions = []

      result.forEach(currency => {
        const localizedName = getCurrencyName(currency.currency, apiLang)
        console.log(`货币 ${currency.currency} 本地化名称:`, localizedName)
        console.log(`API原始数据:`, currency)
        currencyOptions.push({
          ...currency,
          name: `${currency.currency_symbol} ${localizedName}` // 确保name字段在最后设置，覆盖API返回的name
        })
      })

      // 货币排序：1.USD 2.JPY 其它保持不变
      currencyOptions.sort((a, b) => {
        if (a.currency === 'USD') return -1
        if (b.currency === 'USD') return 1
        if (a.currency === 'JPY') return -1
        if (b.currency === 'JPY') return 1
        return 0
      })

      currencies.value = result

      // 为ActionSheet格式化数据 - Vant ActionSheet需要name字段作为显示文本
      const actionSheetOptions = currencyOptions.map(currency => ({
        name: currency.name,  // 显示的文本
        value: currency.currency,  // 选择时返回的值
        currency: currency.currency,
        currency_symbol: currency.currency_symbol,
        rate: currency.rate,
        out_or_in: currency.out_or_in
      }))

      currencyActions.value = actionSheetOptions

      console.log('货币选项:', currencyOptions)
      console.log('ActionSheet选项:', actionSheetOptions)

      // 默认选择第一个货币
      if (currencyOptions.length > 0) {
        selectedCurrency.value = currencyOptions[0]
      }
    } else {
      // API失败时提供默认选项
      console.log('API数据为空，使用默认选项')
      setDefaultCurrencyOptions()
    }
  } catch (error) {
    console.error('获取货币列表失败:', error)
    // API失败时提供默认选项
    setDefaultCurrencyOptions()
    showToast('获取货币列表失败，使用默认选项')
  }
}

// 设置默认货币选项
const setDefaultCurrencyOptions = () => {
  // 始终使用英文API语言，不管当前页面语言
  const apiLang = 'English'

  // 提供所有主要货币的默认选项
  let defaultOptions = [
    {
      name: `$ ${getCurrencyName('USD', apiLang)}`,
      currency: 'USD',
      currency_symbol: '$',
      rate: 1,
      out_or_in: 'in'
    },
    {
      name: `¥ ${getCurrencyName('JPY', apiLang)}`,
      currency: 'JPY',
      currency_symbol: '¥',
      rate: 150,
      out_or_in: 'in'
    },
    {
      name: `¥ ${getCurrencyName('CNY', apiLang)}`,
      currency: 'CNY',
      currency_symbol: '¥',
      rate: 7.1,
      out_or_in: 'in'
    },
    {
      name: `₩ ${getCurrencyName('KRW', apiLang)}`,
      currency: 'KRW',
      currency_symbol: '₩',
      rate: 1300,
      out_or_in: 'in'
    },
    {
      name: `₹ ${getCurrencyName('INR', apiLang)}`,
      currency: 'INR',
      currency_symbol: '₹',
      rate: 98,
      out_or_in: 'in'
    },
    {
      name: `€ ${getCurrencyName('EUR', apiLang)}`,
      currency: 'EUR',
      currency_symbol: '€',
      rate: 0.85,
      out_or_in: 'in'
    }
  ]

  // 货币排序：1.USD 2.JPY 其它保持不变
  defaultOptions.sort((a, b) => {
    if (a.currency === 'USD') return -1
    if (b.currency === 'USD') return 1
    if (a.currency === 'JPY') return -1
    if (b.currency === 'JPY') return 1
    return 0
  })

  // 为ActionSheet格式化默认数据 - Vant ActionSheet需要name字段作为显示文本
  const actionSheetDefaultOptions = defaultOptions.map(currency => ({
    name: currency.name,  // 显示的文本
    value: currency.currency,  // 选择时返回的值
    currency: currency.currency,
    currency_symbol: currency.currency_symbol,
    rate: currency.rate,
    out_or_in: currency.out_or_in
  }))

  currencyActions.value = actionSheetDefaultOptions
  selectedCurrency.value = defaultOptions[0]
  console.log('设置默认货币选项:', defaultOptions)
  console.log('ActionSheet默认选项:', actionSheetDefaultOptions)
}

onBeforeMount(() => {
  console.log('页面初始化开始')
  c2cPaymentMethodList()
  getCurrencyList()

  _getSessionToken({}).then(res => {
    console.log('获取session token:', res)
    payInfo.value.payment_method_id = res.gf_payment_method_id
    payInfo.value.session_token = res.session_token
  })
})

//获取支付方式列表（可选）
const c2cPaymentMethodList = () => {
  _bankPaymentMethodList().then((res) => {
    console.log('用户银行卡列表:', res)

    // 新逻辑：不强制要求绑定银行卡
    // 用户可以直接选择币种和金额下单
    // 如果有绑定的银行卡，可以在后续流程中使用
    if (res.length === 0) {
      console.log('用户暂未绑定银行卡，但可以继续下单流程')
      // 不再强制跳转到绑定页面，允许用户继续操作
    } else {
      console.log('用户已绑定银行卡数量:', res.length)
      // 可以在这里保存用户的银行卡信息供后续使用
    }
  }).catch((error) => {
    console.error('获取银行卡列表失败:', error)
    // 即使获取失败也不影响用户下单
  })
}

const openRecord = () => {
  setStorage('recordId', 1)
  router.push('/Record/DepositAndWithdrawal')
}

// 文件上传功能已移除


// 显示货币选择弹框
const showActions = () => {
  console.log('点击显示货币选择器')
  console.log('当前货币选项:', currencyActions.value)
  console.log('当前show状态:', show.value)

  if (currencyActions.value.length === 0) {
    console.log('货币选项为空，重新加载')
    getCurrencyList()
    return
  }

  show.value = true
  console.log('设置show为true后:', show.value)
}



// 选择货币
const onSelect = (value) => {
  console.log('选择的货币:', value)
  console.log('ActionSheet返回的数据类型:', typeof value)
  console.log('ActionSheet返回的数据内容:', JSON.stringify(value))
  selectedCurrency.value = value
  show.value = false
}

const submit = () => {
  // 验证是否选择了货币
  if (!selectedCurrency.value) {
    showToast(t('selectCurrency') || '请选择货币')
    return
  }

  // 验证充值金额
  if (!amount.value) {
    showToast(t('enterRechargeAmount'))
    return
  }

  let numReg = /^[0-9]+([.]{1}[0-9]+){0,1}$/;
  if (!numReg.test(amount.value)) {
    showToast(t('amountNumber'));
    return;
  }

  // 设置支付信息
  payInfo.value.direction = 'recharge'

  // 设置货币和对应国家
  let actualCurrency = selectedCurrency.value.currency
  let nationality = 'United States' // 默认美国

  if (selectedCurrency.value.currency === 'JPY') {
    // 日元直接使用JPY
    actualCurrency = 'JPY'
    nationality = 'Japan (日本)' // 日本
  } else if (selectedCurrency.value.currency === 'CNY') {
    nationality = 'China (中国)' // 中国
  } else if (selectedCurrency.value.currency === 'USD') {
    nationality = 'United States' // 美国
  }

  payInfo.value.currency = actualCurrency
  payInfo.value.currency_symbol = selectedCurrency.value.currency_symbol
  payInfo.value.rate = selectedCurrency.value.rate
  payInfo.value.coin_amount = calculateUSDT()
  payInfo.value.fa_amount = amount.value
  payInfo.value.currency_name = selectedCurrency.value.name
  payInfo.value.nationality = nationality

  console.log('支付信息:', payInfo.value)
  console.log('实际货币代码:', actualCurrency)
  console.log('设置的国家:', nationality)

  // 新用户友好提示：无需绑定银行卡即可下单
  console.log('✅ 新用户无需绑定银行卡，直接进入支付流程')
  showPopup.value = true
}
const closeOrder = () => {
  showPopup.value = false
}

</script>
<style lang="scss" scoped>
.charge-bank {
  font-size: 15px;
}

.select-item {
  background: $input_background;
  padding: 0 15px;
  align-items: center;
  height: 50px;
  border-radius: 3px;
  margin-top: 10px;
  color: $text_color;
}

.title {
  font-size: 26px;
  color: $text_color;
  font-weight: bold;
}

.usd-input {
  height: 50px;
  background: $input_background;
  font-size: 14px;
  width: 100%;
  padding-right: 60px; /* 为货币后缀留出空间 */
}

.amount-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.currency-suffix {
  position: absolute;
  right: 12px;
  color: $text_color1;
  font-size: 14px;
  pointer-events: none;
}

.centent {
  h2 {
    color: $text_color;
    font-size: 16px;
  }

  p {
    color: $text_color1;
    ;
    line-height: 22px;
  }
}

.tips {
  color: $text_color1;
  ;
  padding: 10px 0;
  font-size: 14px;
}

:deep(.intl-tel-input.allow-dropdown .flag-container:hover .selected-flag) {
  background: transparent !important;
}

:deep(.van-action-sheet) {
  overflow: auto;
}

:deep(.van-icon-orders-o) {
  color: $text_color;
}

.text-xs {
  font-size: 14px;
}

.user-tip {
  display: flex;
  align-items: center;
  background: rgba(25, 137, 250, 0.1);
  border: 1px solid rgba(25, 137, 250, 0.2);
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 8px;
}

.tip-text {
  margin-left: 8px;
  font-size: 14px;
  color: #1989fa;
  line-height: 1.4;
}
</style>