<template>
  <div class="theme-switcher">
    <van-switch
      v-model="isDarkMode"
      @change="toggleTheme"
      size="20px"
      active-color="#58A6FF"
      inactive-color="#E5E7ED"
    >
      <template #node>
        <div class="switch-icon">
          <van-icon 
            :name="isDarkMode ? 'moon-o' : 'sunny'" 
            :color="isDarkMode ? '#0D1117' : '#F0F6FC'"
            size="12px"
          />
        </div>
      </template>
    </van-switch>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { themeStore } from '@/store/theme'
import { SET_THEME } from '@/store/types.store'

const thStore = themeStore()
const isDarkMode = ref(false)

onMounted(() => {
  isDarkMode.value = thStore.theme === 'dark'
})

const toggleTheme = () => {
  const newTheme = isDarkMode.value ? 'dark' : 'white'
  thStore[SET_THEME](newTheme, false)
  
  // 添加切换动画
  document.documentElement.style.transition = 'all 0.3s ease'
  setTimeout(() => {
    document.documentElement.style.transition = ''
  }, 300)
}
</script>

<style lang="scss" scoped>
.theme-switcher {
  display: flex;
  align-items: center;
  justify-content: center;
  
  .switch-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
}

:deep(.van-switch) {
  background: $border_color;
}

:deep(.van-switch--on) {
  background: $color_main;
}

:deep(.van-switch__node) {
  background: $main_background;
  border: 1px solid $border_color;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
