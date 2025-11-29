<template>
  <div class="leverage-modal-overlay" v-if="visible" @click="handleOverlayClick">
    <div class="leverage-modal" @click.stop>
      <!-- 标题 -->
      <div class="modal-header">
        <h2 class="modal-title">{{ t('调整杠杆') }}</h2>
      </div>

      <!-- 当前杠杆显示 -->
      <div class="current-leverage">
        <div class="leverage-display">
          <div class="leverage-btn-wrap" @click="decreaseLeverage" >
            <button class="leverage-btn minus-btn" :disabled="currentLeverageValue <= leverageRange.min">
              <span class="btn-text">-</span>
            </button>
          </div>
          <div class="leverage-value">{{ currentLeverageValue }}x</div>
          <div class="leverage-btn-wrap" @click="increaseLeverage">
            <button class="leverage-btn plus-btn" :disabled="currentLeverageValue >= leverageRange.max">
              <span class="btn-text">+</span>
            </button>
         </div>
        </div>
      </div>

      <!-- 杠杆滑动条 -->
      <div class="leverage-slider-container" ref="sliderContainer">
        <div class="slider-track" @click="handleTrackClick">
          <div class="slider-fill" :style="{ width: sliderFillWidth + '%' }"></div>
          <div class="slider-handle" 
               :style="{ left: sliderHandlePosition + '%' }"
               @mousedown="handleMouseDown">
          </div>
        </div>
        
        <!-- 杠杆标记点 -->
        <div class="leverage-marks">
          <div class="mark" 
               v-for="mark in leverageMarks"
               :key="mark"
               :class="{ active: currentLeverageValue >= mark }" 
               @click="setLeverage(mark)"
               @mousedown="handleMarkMouseDown($event, mark)"
               @touchstart="handleMarkTouchStart($event, mark)">{{ mark }}x</div>
        </div>
      </div>

      <!-- 信息提示 -->
      <div class="info-section">
        <div class="info-text">
          {{ t('当前杠杆倍数最高可开') }}: {{ maxOpenAmount }}USDT
        </div>
        <div class="info-text">
          {{ t('杠杆调整将同时影响当前仓位和挂单的杠杆') }}
        </div>
        <div class="warning-text">
          {{ t('选择超过10x杠杆交易会增加强行平仓风险请注意相关风险') }}{{ t('更多信息请参考') }}
          <span class="link-text" @click="showRiskInfo">{{ t('这里') }}</span>{{ t('。') }}
        </div>
      </div>

      <!-- 确认按钮 -->
      <div class="confirm-section">
        <button class="confirm-btn" @click="handleConfirm">{{ t('确认') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { showToast } from 'vant'
import { useI18n } from 'vue-i18n'

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  currentLeverage: {
    type: Number,
    default: 20
  },
  maxOpenAmount: {
    type: String,
    default: '20,000,000'
  },
  level:{
    type: Array,
    default:[]
  }
})

// Emits
const emit = defineEmits(['update:visible', 'update:currentLeverage', 'confirm', 'cancel'])

// i18n
const { t } = useI18n()

// 响应式数据
const isDragging = ref(false)
const startX = ref(0)
const startLeverage = ref(20)
const sliderContainer = ref(null)
const currentLeverageValue = ref(props.currentLeverage)

// 监听props变化
watch(() => props.currentLeverage, (newVal) => {
  currentLeverageValue.value = newVal
})

// 计算杠杆范围
const leverageRange = computed(() => {
  if (!props.level || props.level.length === 0) {
    return { min: 1, max: 125 }
  }
  const leverRates = props.level.map(item => item.lever_rate)
  return {
    min: Math.min(...leverRates),
    max: Math.max(...leverRates) // 取消10倍限制，使用API返回的最大值
  }
})

// 计算杠杆标记点
const leverageMarks = computed(() => {
  const { min, max } = leverageRange.value
  const marks = []

  // 如果范围太小，直接返回最小值和最大值
  if (max - min <= 5) {
    return [min, max].filter((v, i, arr) => arr.indexOf(v) === i)
  }

  // 生成5-6个标记点
  const step = (max - min) / 5
  for (let i = 0; i <= 5; i++) {
    const mark = Math.round(min + step * i)
    if (mark >= min && mark <= max && !marks.includes(mark)) {
      marks.push(mark)
    }
  }

  return marks.sort((a, b) => a - b)
})

// 计算属性
const sliderFillWidth = computed(() => {
  const { min, max } = leverageRange.value
  return ((currentLeverageValue.value - min) / (max - min)) * 100
})

const sliderHandlePosition = computed(() => {
  const { min, max } = leverageRange.value
  return ((currentLeverageValue.value - min) / (max - min)) * 100
})

// 方法
const decreaseLeverage = () => {
  const { min } = leverageRange.value
  if (currentLeverageValue.value > min) {
    currentLeverageValue.value = currentLeverageValue.value - 1
    emit('update:currentLeverage', currentLeverageValue.value)
  }
}

const increaseLeverage = () => {
  const { max } = leverageRange.value
  if (currentLeverageValue.value < max) {
    currentLeverageValue.value = currentLeverageValue.value + 1
    emit('update:currentLeverage', currentLeverageValue.value)
  }
}

const updateLeverageFromPosition = (x, containerWidth) => {
  const { min, max } = leverageRange.value
  const percentage = Math.max(0, Math.min(100, (x / containerWidth) * 100))
  const leverage = Math.round(min + (percentage / 100) * (max - min))
  if (leverage !== currentLeverageValue.value) {
    currentLeverageValue.value = leverage
    emit('update:currentLeverage', leverage)
  }
}

const handleTrackClick = (e) => {
  if (e.target.classList.contains('slider-track')) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const containerWidth = rect.width
    updateLeverageFromPosition(x, containerWidth)
  }
}

const handleTouchStart = (e) => {
  isDragging.value = true
  startX.value = e.touches[0].clientX
  startLeverage.value = currentLeverageValue.value
  e.preventDefault()
  e.stopPropagation()
}

const handleTouchMove = (e) => {
  if (!isDragging.value) return
  
  const container = sliderContainer.value
  if (!container) return
  
  const containerRect = container.getBoundingClientRect()
  const containerWidth = containerRect.width
  
  const currentX = e.touches[0].clientX
  const relativeX = currentX - containerRect.left
  
  updateLeverageFromPosition(relativeX, containerWidth)
  e.preventDefault()
  e.stopPropagation()
}

const handleTouchEnd = (e) => {
  isDragging.value = false
  e.preventDefault()
  e.stopPropagation()
}

const handleMouseDown = (e) => {
  isDragging.value = true
  startX.value = e.clientX
  startLeverage.value = currentLeverageValue.value
  
  const handleMouseMove = (e) => {
    if (!isDragging.value) return
    
    const container = sliderContainer.value
    if (!container) return
    
    const containerRect = container.getBoundingClientRect()
    const containerWidth = containerRect.width
    
    const relativeX = e.clientX - containerRect.left
    updateLeverageFromPosition(relativeX, containerWidth)
  }
  
  const handleMouseUp = () => {
    isDragging.value = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  
  e.preventDefault()
  e.stopPropagation()
}

const handleOverlayClick = () => {
  emit('update:visible', false)
  emit('cancel')
}

const handleConfirm = () => {
  // 取消10倍杠杆限制，直接确认
  emit('confirm', currentLeverageValue.value)
  emit('update:visible', false)
}

const showRiskInfo = () => {
  // 显示风险信息
  console.log('显示风险信息')
}

// 设置杠杆值
const setLeverage = (leverage) => {
  const { min, max } = leverageRange.value
  if (leverage >= min && leverage <= max) {
    currentLeverageValue.value = leverage
    emit('update:currentLeverage', leverage)
  }
}

// 处理标记点鼠标拖拽
const handleMarkMouseDown = (e, leverage) => {
  e.preventDefault()
  e.stopPropagation()
  
  isDragging.value = true
  startX.value = e.clientX
  startLeverage.value = leverage
  
  const handleMouseMove = (e) => {
    if (!isDragging.value) return
    
    const container = sliderContainer.value
    if (!container) return
    
    const containerRect = container.getBoundingClientRect()
    const containerWidth = containerRect.width
    
    const relativeX = e.clientX - containerRect.left
    updateLeverageFromPosition(relativeX, containerWidth)
  }
  
  const handleMouseUp = () => {
    isDragging.value = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

// 处理标记点触摸拖拽
const handleMarkTouchStart = (e, leverage) => {
  e.preventDefault()
  e.stopPropagation()
  
  isDragging.value = true
  startX.value = e.touches[0].clientX
  startLeverage.value = leverage
  
  const handleTouchMove = (e) => {
    if (!isDragging.value) return
    
    const container = sliderContainer.value
    if (!container) return
    
    const containerRect = container.getBoundingClientRect()
    const containerWidth = containerRect.width
    
    const currentX = e.touches[0].clientX
    const relativeX = currentX - containerRect.left
    
    updateLeverageFromPosition(relativeX, containerWidth)
    e.preventDefault()
    e.stopPropagation()
  }
  
  const handleTouchEnd = (e) => {
    isDragging.value = false
    e.preventDefault()
    e.stopPropagation()
  }
  
  const sliderHandle = sliderContainer.value?.querySelector('.slider-handle')
  if (sliderHandle) {
    sliderHandle.addEventListener('touchmove', handleTouchMove, { passive: false })
    sliderHandle.addEventListener('touchend', handleTouchEnd, { passive: false })
  }
}

// 监听拖拽状态，防止页面滚动
watch(isDragging, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

// 监听visible变化，初始化杠杆值
watch(() => props.visible, (newVal) => {
  if (newVal) {
    console.log('level',props.level,leverageRange)
    currentLeverageValue.value = props.currentLeverage
  }
})

// 添加触摸事件监听器
onMounted(() => {
  const sliderHandle = sliderContainer.value?.querySelector('.slider-handle')
  if (sliderHandle) {
    // 使用 addEventListener 添加非被动的触摸事件监听器
    sliderHandle.addEventListener('touchstart', handleTouchStart, { passive: false })
    sliderHandle.addEventListener('touchmove', handleTouchMove, { passive: false })
    sliderHandle.addEventListener('touchend', handleTouchEnd, { passive: false })
  }
})

// 组件卸载时清理
onUnmounted(() => {
  document.body.style.overflow = ''
  const sliderHandle = sliderContainer.value?.querySelector('.slider-handle')
  if (sliderHandle) {
    sliderHandle.removeEventListener('touchstart', handleTouchStart)
    sliderHandle.removeEventListener('touchmove', handleTouchMove)
    sliderHandle.removeEventListener('touchend', handleTouchEnd)
  }
})
</script>

<style scoped>
.leverage-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: flex-end;
  z-index: 9999;
}

.leverage-modal {
  background: #ffffff;
  width: 100%;
  border-radius: 20px 20px 0 0;
  padding: 36px 24px 40px 24px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
}

/* 标题 */
.modal-header {
  text-align: center;
  margin-bottom: 36px;
}

.modal-title {
  font-size: 42px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  letter-spacing: -0.5px;
}

/* 当前杠杆显示 */
.current-leverage {
  margin-bottom: 36px;
}

.leverage-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin: 0 20px;
}

.leverage-btn-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  cursor: pointer;
  border-radius: 50%;
  transition: background-color 0.2s ease;
  min-width: 80px;
  min-height: 80px;
}

.leverage-btn-wrap:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.leverage-btn {
  width: 56px;
  height: 56px;
  border: none;
  border-radius: 50%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
}

.leverage-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background: #f8f9fa;
}

.leverage-btn:not(:disabled):hover {
  background: #f1f3f4;
  transform: scale(1.05);
}

.leverage-btn:not(:disabled):active {
  transform: scale(0.95);
  background: #e9ecef;
}

.btn-text {
  font-size: 48px;
  font-weight: 600;
  color: #495057;
  line-height: 1;
}

.leverage-value {
  font-size: 56px;
  font-weight: 800;
  color: #1a1a1a;
  min-width: 140px;
  text-align: center;
  letter-spacing: -1px;
}

/* 滑动条容器 */
.leverage-slider-container {
  margin-bottom: 36px;
  position: relative;
  padding: 0 20px;
}

.slider-track {
  position: relative;
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
  margin-bottom: 32px;
  cursor: pointer;
}

.slider-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff6b35 0%, #f7931e 100%);
  border-radius: 3px;
  transition: width 0.2s ease;
}

.slider-handle {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 28px;
  height: 28px;
  background: #ffffff;
  border-radius: 50%;
  border: 3px solid #ff6b35;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;
}

.slider-handle:active {
  transform: translate(-50%, -50%) scale(1.1);
  box-shadow: 0 6px 16px rgba(255, 107, 53, 0.4);
}

/* 杠杆标记点 */
.leverage-marks {
  display: flex;
  justify-content: space-between;
  position: relative;
  padding: 0 4px;
}

.mark {
  font-size: 20px;
  color: #6c757d;
  position: relative;
  transition: all 0.2s ease;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.mark.active {
  color: #ff6b35;
  font-weight: 700;
}

.mark::before {
  content: '';
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  background: #dee2e6;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.mark.active::before {
  background: #ff6b35;
  transform: translateX(-50%) scale(1.2);
}

.mark:hover {
  background-color: rgba(255, 107, 53, 0.1);
  color: #ff6b35;
  transform: scale(1.05);
}

.mark:active {
  background-color: rgba(255, 107, 53, 0.2);
  transform: scale(0.95);
}

/* 信息提示 */
.info-section {
  margin-bottom: 36px;
  padding: 0 20px;
}

.info-text {
  font-size: 22px;
  color: #495057;
  line-height: 1.6;
  margin-bottom: 16px;
  font-weight: 400;
}

.warning-text {
  font-size: 22px;
  color: #dc3545;
  line-height: 1.6;
  font-weight: 500;
}

.link-text {
  color: #007bff;
  text-decoration: underline;
  cursor: pointer;
  font-weight: 600;
}

.link-text:hover {
  color: #0056b3;
}

/* 确认按钮 */
.confirm-section {
  text-align: center;
  padding: 0 20px;
}

.confirm-btn {
  width: 100%;
  height: 64px;
  background: linear-gradient(135deg, #ffd700 0%, #ffb347 100%);
  border: none;
  border-radius: 32px;
  color: #ffffff;
  font-size: 26px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 16px rgba(255, 215, 0, 0.3);
  letter-spacing: 0.5px;
}

.confirm-btn:hover {
  background: linear-gradient(135deg, #ffcc00 0%, #ffa500 100%);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
}

.confirm-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
}

/* 响应式设计 */
@media (max-width: 375px) {
  .leverage-modal {
    padding: 32px 20px 40px 20px;
  }
  
  .modal-title {
    font-size: 36px;
  }
  
  .leverage-value {
    font-size: 48px;
  }
  
  .leverage-btn {
    width: 60px;
    height: 60px;
  }
  
  .leverage-btn-wrap {
    min-width: 84px;
    min-height: 84px;
    padding: 12px;
  }
  
  .btn-text {
    font-size: 44px;
  }
  
  .leverage-display {
    gap: 32px;
    padding: 24px;
  }
  
  .info-text {
    font-size: 20px;
  }
  
  .warning-text {
    font-size: 20px;
  }
  
  .mark {
    font-size: 18px;
    padding: 6px 10px;
  }
  
  .confirm-btn {
    height: 60px;
    font-size: 24px;
  }
}

/* 防止文本选择 */
.leverage-modal * {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* 确保弹窗在最上层 */
.leverage-modal-overlay {
  z-index: 9999 !important;
}

/* 滑动条交互优化 */
.slider-track:hover .slider-handle {
  transform: translate(-50%, -50%) scale(1.05);
}

.slider-track:active .slider-handle {
  transform: translate(-50%, -50%) scale(1.1);
}
</style>
