<template>
  <div class="announcement-bar" v-if="announcements.length > 0">
    <div class="container">
      <div class="announcement-content">
        <!-- 公告图标 -->
        <div class="announcement-icon">
          <el-icon><Bell /></el-icon>
        </div>

        <!-- 公告文本滚动区域 -->
        <div class="announcement-text">
          <transition name="slide-up">
            <div :key="currentIndex" class="announcement-item">
              {{ currentAnnouncement.title }}
            </div>
          </transition>
        </div>

        <!-- 查看更多按钮 -->
        <el-button text class="view-more-btn" @click="viewAllAnnouncements">
          {{ $t('newHome.announcement.viewMore') }}
          <el-icon class="arrow-icon"><ArrowRight /></el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { Bell, ArrowRight } from '@element-plus/icons-vue';

const router = useRouter();

const announcements = ref([]);
const currentIndex = ref(0);
let intervalId = null;

// 模拟公告数据
const mockAnnouncements = [
  {
    id: 1,
    title: 'Coinstore Lists STBL/USDT Trading Pair',
    link: '/announcement/1'
  },
  {
    id: 2,
    title: 'New Feature: Spot Grid Trading is Now Live!',
    link: '/announcement/2'
  },
  {
    id: 3,
    title: 'Maintenance Notice: System Upgrade on Dec 25',
    link: '/announcement/3'
  }
];

const currentAnnouncement = computed(() => {
  return announcements.value[currentIndex.value] || { title: '', link: '' };
});

const fetchAnnouncements = async () => {
  try {
    // TODO: 替换为实际 API 调用
    // const response = await getAnnouncements();
    // announcements.value = response.data;

    // 使用模拟数据
    announcements.value = mockAnnouncements;
  } catch (error) {
    console.error('Failed to fetch announcements:', error);
    announcements.value = mockAnnouncements;
  }
};

const startAutoSwitch = () => {
  intervalId = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % announcements.value.length;
  }, 4000); // 每4秒切换一次
};

const viewAllAnnouncements = () => {
  router.push('/announcements');
};

onMounted(() => {
  fetchAnnouncements();
  setTimeout(() => {
    if (announcements.value.length > 1) {
      startAutoSwitch();
    }
  }, 100);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<style lang="scss" scoped>
@import '@/views/_new/home/styles/variables.scss';

.announcement-bar {
  background: linear-gradient(90deg, rgba($primary-color, 0.05) 0%, rgba($primary-color, 0.02) 100%);
  padding: $spacing-md 0;
  border-bottom: 1px solid rgba($primary-color, 0.1);

  .container {
    max-width: $container-max-width;
    margin: 0 auto;
    padding: 0 $container-padding;
  }

  .announcement-content {
    display: flex;
    align-items: center;
    gap: $spacing-lg;

    @media (max-width: $breakpoint-md) {
      gap: $spacing-md;
    }
  }

  .announcement-icon {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: $primary-color;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: pulse 2s infinite;

    @media (max-width: $breakpoint-md) {
      width: 32px;
      height: 32px;
    }

    .el-icon {
      font-size: 18px;
      color: $color-white;

      @media (max-width: $breakpoint-md) {
        font-size: 16px;
      }
    }
  }

  .announcement-text {
    flex: 1;
    overflow: hidden;
    position: relative;
    height: 24px;
    display: flex;
    align-items: center;

    .announcement-item {
      font-size: $font-size-base;
      color: $color-text-primary;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;

      @media (max-width: $breakpoint-md) {
        font-size: $font-size-sm;
      }
    }
  }

  .view-more-btn {
    flex-shrink: 0;
    color: $primary-color;
    font-weight: $font-weight-medium;
    padding: 0;

    &:hover {
      color: $primary-dark;
    }

    .arrow-icon {
      margin-left: 4px;
      font-size: 14px;
      transition: transform $transition-base;
    }

    &:hover .arrow-icon {
      transform: translateX(4px);
    }

    @media (max-width: $breakpoint-sm) {
      span:first-child {
        display: none;
      }
    }
  }
}

// 动画
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.5s ease;
}

.slide-up-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
