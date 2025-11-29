<template>
  <div class="symbol-icon" :class="containerClass">
    <img 
      :src="iconSrc" 
      :alt="symbol" 
      :class="imageClass"
      @error="handleImageError"
      @load="handleImageLoad"
    />
    <div 
      v-if="showFallback" 
      class="fallback-icon"
      :class="fallbackClass"
    >
      {{ fallbackText }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  symbol: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: 'w-12 h-12'
  },
  fallbackSize: {
    type: String,
    default: 'text-xs'
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
    default: 'bg-gray-500 text-white rounded-full flex items-center justify-center'
  }
})

const emit = defineEmits(['error', 'load'])

const showFallback = ref(false)
const imageError = ref(false)

const iconSrc = computed(() => {
  if (imageError.value) {
    return '/symbol/default.png'
  }
  return `${import.meta.env.VITE_HOST_URL || ''}/symbol/${props.symbol.toLowerCase()}.png`
})

const fallbackText = computed(() => {
  return props.symbol ? props.symbol.toUpperCase().substring(0, 3) : '?'
})

const handleImageError = (event) => {
  console.warn(`Failed to load icon for symbol: ${props.symbol}`)
  imageError.value = true
  showFallback.value = true
  emit('error', { symbol: props.symbol, event })
}

const handleImageLoad = (event) => {
  showFallback.value = false
  imageError.value = false
  emit('load', { symbol: props.symbol, event })
}

// 监听symbol变化，重置状态
watch(() => props.symbol, () => {
  showFallback.value = false
  imageError.value = false
})
</script>

<style scoped>
.symbol-icon {
  position: relative;
  display: inline-block;
}

.fallback-icon {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}
</style>
