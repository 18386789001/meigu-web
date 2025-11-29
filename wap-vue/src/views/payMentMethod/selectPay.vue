<template>
  <div class="selectPay pb-10">
    <fx-header>
      <template #title>{{ $t('allPay') }}</template>
    </fx-header>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-container p-4 text-center">
      <van-loading size="24px" vertical>加载中...</van-loading>
      <p class="mt-2 text-gray-500">正在获取支付方式...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="hasError" class="error-container p-4 text-center">
      <div class="mb-4">
        <van-icon name="warning-o" size="48" color="#ff6b6b" />
      </div>
      <p class="text-gray-600 mb-2">获取支付方式失败</p>
      <p class="text-sm text-gray-500 mb-4">请检查网络连接或联系客服</p>
      <van-button @click="loadPaymentMethods" type="primary" size="small" class="mt-2">
        重新加载
      </van-button>
    </div>

    <!-- 支付方式选择 -->
    <div v-else class="payment-options p-4">
      <!-- 银行卡支付方式组 -->
      <div v-if="bankOptions.length > 0" class="payment-group mb-6">
        <div class="group-title mb-3">
          <h3 class="text-lg font-medium text-gray-800">{{ t('银行卡') }}</h3>
        </div>
        <van-radio-group v-model="selectedPayment" @change="onPaymentChange">
          <div class="option-item mb-3" v-for="option in bankOptions" :key="option.value">
            <van-radio :name="option.value" class="w-full">
              <div class="option-content">
                <span class="option-text">{{ option.label }}</span>
              </div>
            </van-radio>
          </div>
        </van-radio-group>
      </div>

      <!-- 无支付方式提示 -->
      <div v-if="bankOptions.length === 0" class="no-methods p-4 text-center">
        <van-icon name="info-o" size="48" color="#999" />
        <p class="text-gray-500 mt-2">{{ t('暂无可用的支付方式') }}</p>
        <p class="text-sm text-gray-400">{{ t('请联系管理员配置支付方式') }}</p>
      </div>

      <!-- 确认按钮 -->
      <div v-if="bankOptions.length > 0" class="fixed-bottom p-4">
        <van-button
          type="primary"
          block
          :disabled="!selectedPayment"
          @click="confirmSelection"
          class="confirm-btn"
        >
          {{ t('确认选择') }}
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant'
import { _getBankPaymentMethodConfig } from "@/service/user.api.js";
import { getStorage } from '@/utils/index.js';
import { useI18n } from 'vue-i18n';

const router = useRouter()
const { t } = useI18n()

// 支付方式选项数据
const selectedPayment = ref('')
const isLoading = ref(true)
const hasError = ref(false)

// 支付方式配置数据
const paymentMethods = ref({})
const usdtOptions = ref([])
const bankOptions = ref([])

// 支付方式选择变化事件
const onPaymentChange = (value) => {
  console.log('🔍 选择的支付方式:', value)
  selectedPayment.value = value
}

// 确认选择
const confirmSelection = () => {
  if (!selectedPayment.value) {
    showToast(t('请选择一种支付方式'))
    return
  }

  // 查找选中的选项详情
  let selectedOption = null
  const allOptions = [...bankOptions.value]

  for (const option of allOptions) {
    if (option.value === selectedPayment.value) {
      selectedOption = option
      break
    }
  }

  if (!selectedOption) {
    showToast(t('选择的支付方式无效'))
    return
  }

  console.log('✅ 确认选择的支付方式:', selectedOption)

  // 存储选择的支付方式信息到 sessionStorage
  sessionStorage.setItem("editAdd", JSON.stringify({
    id: selectedOption.id,
    name: selectedOption.label,
    value: selectedOption.value,
    type: 'add'
  }));

  // 跳转到添加页面
  router.push('add')
}
onMounted(async () => {
  console.log('🚀 页面挂载，开始获取真实支付方式配置...')
  await loadPaymentMethods()
})

// 获取支付方式配置
const loadPaymentMethods = async () => {
  try {
    isLoading.value = true
    hasError.value = false

    console.log('🔄 调用 API 获取支付方式配置...')

    // 获取当前语言设置
    const currentLang = getStorage('lang') || 'en'
    let language = 'zh-CN' // 默认值
    
    // 根据当前语言设置正确的API语言参数
    if (currentLang === 'Japanese' || currentLang === 'ja') {
      language = 'Japanese'
    } else if (currentLang === 'zh-CN' || currentLang === 'CN') {
      language = 'zh-CN'
    } else if (currentLang === 'en') {
      language = 'en'
    }
    
    console.log('🌐 当前语言设置:', currentLang, 'API语言参数:', language)
    
    const params = {
      language: language
    }

    const response = await _getBankPaymentMethodConfig(params)
    console.log('✅ API 响应成功:', response)

    // 检查API响应结构，使用response.data
    const responseData = response?.data || response
    console.log('📊 解析后的数据:', responseData)

    if (!responseData || typeof responseData !== 'object' || Object.keys(responseData).length === 0) {
      console.warn('⚠️ API 返回空数据，使用默认配置')
      // 使用默认支付方式配置 - 只保留银行卡
      const defaultConfig = {
        'bank_card': '银行卡'
      }
      paymentMethods.value = defaultConfig
      processPaymentMethods(defaultConfig)
      console.log('✅ 已加载默认支付方式配置')
    } else {
      paymentMethods.value = responseData
      processPaymentMethods(responseData)
    }

  } catch (error) {
    console.error('❌ 获取支付方式配置失败:', error)
    
    // 即使API失败，也提供默认配置确保用户能正常使用
    console.log('🔄 API失败，使用默认支付方式配置')
    const defaultConfig = {
      'bank_card': '银行卡'
    }
    paymentMethods.value = defaultConfig
    processPaymentMethods(defaultConfig)
    
    // 不设置错误状态，让用户能正常使用
    hasError.value = false
    showToast('已加载默认支付方式')
  } finally {
    isLoading.value = false
  }
}

// 处理支付方式数据，只保留银行卡
const processPaymentMethods = (methods) => {
  console.log('� 处理支付方式数据:', methods)

  const bankList = []

  // 遍历所有支付方式，只保留银行卡相关
  Object.entries(methods).forEach(([id, name]) => {
    console.log(`🔍 检查支付方式: ID=${id}, Name=${name}`)
    
    const methodInfo = {
      value: id,
      label: name,
      id: id
    }

    // 只保留银行卡相关的支付方式
    // 支持中文、英文、日文的银行卡关键词
    const isBankCard = name.includes('银行') || 
                      name.includes('銀行') || // 日文
                      name.toLowerCase().includes('bank') ||
                      id === 'bank_card' ||
                      name.toLowerCase().includes('card')
    
    console.log(`✅ 银行卡判断结果: ${isBankCard}`)
    
    if (isBankCard) {
      bankList.push(methodInfo)
      console.log(`➕ 添加银行卡选项:`, methodInfo)
    }
  })

  // 清空USDT选项
  usdtOptions.value = []
  bankOptions.value = bankList

  console.log('� 银行卡选项:', bankOptions.value)
}
</script>
<style lang="scss" scoped>
.selectPay {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.payment-options {
  padding-bottom: 80px; // 为底部按钮留出空间
}

.payment-group {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.group-title {
  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin: 0;
  }
}

.option-item {
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #fafafa;
  transition: all 0.3s ease;

  &:hover {
    border-color: #3b82f6;
    background: #f0f9ff;
  }
}

.option-content {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.option-text {
  font-size: 16px;
  color: #374151;
  font-weight: 500;
}

.fixed-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e5e7eb;
  z-index: 100;
}

.confirm-btn {
  height: 48px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
}

// Vant Radio 组件样式覆盖
:deep(.van-radio) {
  width: 100%;

  .van-radio__label {
    width: 100%;
    margin-left: 0;
  }

  .van-radio__icon {
    margin-right: 12px;
  }
}

:deep(.van-radio--checked) {
  .option-item {
    border-color: #3b82f6;
    background: #eff6ff;
  }

  .option-text {
    color: #1d4ed8;
  }
}

:deep(.van-button--disabled) {
  opacity: 0.5;
}
</style>