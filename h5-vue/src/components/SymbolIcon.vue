<template>
  <div class="symbol-icon" :class="containerClass">
    <img 
      v-if="!showFallback"
      :src="currentIconSrc" 
      :alt="symbol" 
      :class="imageClass"
      @error="handleImageError"
      @load="handleImageLoad"
    />
    <div 
      v-else
      class="fallback-icon"
      :class="fallbackClass"
      :style="fallbackStyle"
    >
      {{ fallbackText }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  symbol: {
    type: String,
    required: true
  },
  size: {
    type: [String, Number],
    default: 48
  },
  fallbackSize: {
    type: String,
    default: 'text-sm'
  },
  containerClass: {
    type: String,
    default: ''
  },
  imageClass: {
    type: String,
    default: 'rounded-full'
  },
  fallbackClass: {
    type: String,
    default: 'bg-gray-500 text-white rounded-full flex items-center justify-center font-bold'
  },
  category: {
    type: String,
    default: 'crypto',
    validator: (value) => ['crypto', 'stock', 'forex', 'commodity'].includes(value)
  },
  hostUrl: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['error', 'load'])

const showFallback = ref(false)
const imageError = ref(false)
const currentFormat = ref('svg')
const failedFormats = ref(new Set())

// 计算当前图标源
const currentIconSrc = computed(() => {
  if (!props.symbol) {
    return '/symbol/default.svg'
  }
  
  const baseUrl = props.hostUrl || ''
  const symbolLower = props.symbol.toLowerCase()
  
  // 如果所有格式都失败了，使用默认图标
  if (failedFormats.value.has('svg') && failedFormats.value.has('png')) {
    return `${baseUrl}/symbol/default.svg`
  }
  
  // 优先使用SVG，失败后尝试PNG
  if (currentFormat.value === 'svg' && !failedFormats.value.has('svg')) {
    return `${baseUrl}/symbol/${symbolLower}.svg`
  } else if (currentFormat.value === 'png' && !failedFormats.value.has('png')) {
    return `${baseUrl}/symbol/${symbolLower}.png`
  }
  
  return `${baseUrl}/symbol/default.svg`
})

// 备用文本
const fallbackText = computed(() => {
  if (!props.symbol) return '?'
  const symbolUpper = props.symbol.toUpperCase()
  return symbolUpper.length > 4 ? symbolUpper.substring(0, 4) : symbolUpper
})

// 备用样式
const fallbackStyle = computed(() => {
  const size = typeof props.size === 'number' ? `${props.size}px` : props.size
  return {
    width: size,
    height: size,
    fontSize: typeof props.size === 'number' ? `${Math.max(props.size * 0.3, 12)}px` : '12px'
  }
})

// 处理图片加载错误
const handleImageError = (event) => {
  // 减少控制台日志输出，只在开发环境显示详细信息
  if (process.env.NODE_ENV === 'development') {
    console.warn(`Failed to load ${currentFormat.value} icon for symbol: ${props.symbol}`)
  }

  // 记录失败的格式
  failedFormats.value.add(currentFormat.value)

  // 如果SVG失败，尝试PNG
  if (currentFormat.value === 'svg' && !failedFormats.value.has('png')) {
    currentFormat.value = 'png'
    return
  }

  // 如果PNG也失败，显示备用图标
  if (currentFormat.value === 'png' || failedFormats.value.has('png')) {
    showFallback.value = true
    imageError.value = true
  }

  emit('error', {
    symbol: props.symbol,
    format: currentFormat.value,
    event
  })
}

// 处理图片加载成功
const handleImageLoad = (event) => {
  showFallback.value = false
  imageError.value = false
  
  emit('load', { 
    symbol: props.symbol, 
    format: currentFormat.value,
    event 
  })
}

// 重置图标状态
const resetIcon = () => {
  showFallback.value = false
  imageError.value = false
  currentFormat.value = 'svg'
  failedFormats.value.clear()
}

// 监听symbol变化，重置状态
watch(() => props.symbol, () => {
  resetIcon()
})

// 暴露方法给父组件
defineExpose({
  resetIcon,
  retry: resetIcon
})

onMounted(() => {
  // 组件挂载时重置状态
  resetIcon()
})
</script>

<style scoped>
.symbol-icon {
  display: inline-block;
  position: relative;
}

.symbol-icon img {
  display: block;
  max-width: 100%;
  height: auto;
}

.fallback-icon {
  user-select: none;
  transition: all 0.2s ease;
}

.fallback-icon:hover {
  transform: scale(1.05);
}

/* 加载动画 */
.symbol-icon.loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 错误状态样式 */
.symbol-icon.error .fallback-icon {
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
}

/* 不同类别的主题色 */
.symbol-icon.crypto .fallback-icon {
  background: linear-gradient(135deg, #4ECDC4, #44A08D);
}

.symbol-icon.stock .fallback-icon {
  background: linear-gradient(135deg, #2E86AB, #A23B72);
}

.symbol-icon.forex .fallback-icon {
  background: linear-gradient(135deg, #264653, #2A9D8F);
}

.symbol-icon.commodity .fallback-icon {
  background: linear-gradient(135deg, #8B4513, #DAA520);
}
</style>
