<template>
  <transition name="fade">
    <button 
      v-if="visible" 
      class="back-to-top"
      @click="scrollToTop"
      :class="{ 'scrolling': isScrolling }"
    >
      <i class="icon-arrow-up"></i>
    </button>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// 响应式数据
const visible = ref(false);
const isScrolling = ref(false);

// 滚动事件处理
const handleScroll = () => {
  visible.value = window.scrollY > 300;
};

// 滚动到顶部
const scrollToTop = () => {
  isScrolling.value = true;
  
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
  
  // 重置滚动状态
  setTimeout(() => {
    isScrolling.value = false;
  }, 1000);
};

// 生命周期
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style lang="scss" scoped>
.back-to-top {
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(30, 64, 175, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 998;
  box-shadow: 0 4px 20px rgba(30, 64, 175, 0.3);
  
  &:hover {
    background: rgba(30, 64, 175, 1);
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(30, 64, 175, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &.scrolling {
    background: rgba(255, 215, 0, 0.9);
    color: #1a1a1a;
    
    &:hover {
      background: rgba(255, 215, 0, 1);
    }
  }
  
  i {
    font-size: 20px;
    transition: transform 0.3s ease;
  }
  
  &:hover i {
    transform: translateY(-2px);
  }
}

// 淡入淡出动画
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

// 平板样式
@media (min-width: 769px) and (max-width: 1024px) {
  .back-to-top {
    bottom: 90px;
    right: 24px;
    width: 52px;
    height: 52px;
    
    i {
      font-size: 22px;
    }
  }
}

// 横屏样式
@media (orientation: landscape) and (max-height: 500px) {
  .back-to-top {
    bottom: 60px;
    right: 16px;
    width: 44px;
    height: 44px;
    
    i {
      font-size: 18px;
    }
  }
}
</style>
