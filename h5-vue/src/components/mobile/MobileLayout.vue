<template>
  <div class="mobile-layout">
    <!-- 移动端头部 -->
    <mobile-header />
    
    <!-- 主要内容区域 -->
    <main class="mobile-main">
      <router-view />
    </main>
    
    <!-- 移动端底部导航 -->
    <mobile-bottom-nav />
    
    <!-- 侧边栏 -->
    <mobile-sidebar 
      :visible="sidebarVisible" 
      @close="closeSidebar" 
    />
    
    <!-- 返回顶部按钮 -->
    <back-to-top v-if="showBackToTop" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import MobileHeader from './MobileHeader.vue';
import MobileBottomNav from './MobileBottomNav.vue';
import MobileSidebar from './MobileSidebar.vue';
import BackToTop from './BackToTop.vue';

// 侧边栏状态
const sidebarVisible = ref(false);

// 返回顶部按钮显示状态
const showBackToTop = ref(false);

// 打开侧边栏
const openSidebar = () => {
  sidebarVisible.value = true;
};

// 关闭侧边栏
const closeSidebar = () => {
  sidebarVisible.value = false;
};

// 滚动事件处理
const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300;
};

// 监听滚动事件
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

// 暴露方法给子组件使用
defineExpose({
  openSidebar,
  closeSidebar
});
</script>

<style lang="scss" scoped>
.mobile-layout {
  min-height: 100vh;
  background: #0a0a0a;
  color: white;
  display: flex;
  flex-direction: column;
}

.mobile-main {
  flex: 1;
  padding-top: 60px; // 为固定头部留出空间
  padding-bottom: 60px; // 为底部导航留出空间
  min-height: calc(100vh - 120px);
}

// 移动端样式优化
@media (max-width: 768px) {
  .mobile-main {
    padding-top: 50px;
    padding-bottom: 50px;
  }
}

// 平板样式
@media (min-width: 769px) and (max-width: 1024px) {
  .mobile-main {
    padding-top: 70px;
    padding-bottom: 70px;
  }
}
</style>
