<template>
  <div class="event-card" :style="cardStyle" @click="handleClick">
    <div class="card-overlay"></div>
    <div class="card-content">
      <!-- Logo/标签 -->
      <img v-if="event.logo" :src="event.logo" class="event-logo" alt="Event Logo" />

      <!-- 标题 -->
      <h3 class="event-title">{{ event.title }}</h3>

      <!-- 描述 -->
      <p v-if="event.description" class="event-description">
        {{ event.description }}
      </p>

      <!-- 插图 -->
      <div class="event-illustration">
        <img v-if="event.illustration" :src="event.illustration" alt="Event Illustration" />
      </div>

      <!-- CTA 按钮 -->
      <el-button class="event-btn" :type="event.btnType || 'primary'">
        {{ event.btnText || $t('newHome.events.joinNow') }}
        <el-icon class="arrow"><ArrowRight /></el-icon>
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowRight } from '@element-plus/icons-vue';

const props = defineProps({
  event: {
    type: Object,
    required: true,
    default: () => ({})
  }
});

const router = useRouter();

const cardStyle = computed(() => {
  const style = {};
  if (props.event.bgImage) {
    style.backgroundImage = `url(${props.event.bgImage})`;
  }
  if (props.event.bgColor) {
    style.backgroundColor = props.event.bgColor;
  }
  if (props.event.bgGradient) {
    style.background = props.event.bgGradient;
  }
  return style;
});

const handleClick = () => {
  if (props.event.link) {
    if (props.event.link.startsWith('http')) {
      window.open(props.event.link, '_blank');
    } else {
      router.push(props.event.link);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/views/_new/home/styles/variables.scss';

.event-card {
  position: relative;
  border-radius: $radius-xl;
  overflow: hidden;
  padding: $spacing-xl;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  background-size: cover;
  background-position: center;
  cursor: pointer;
  transition: all $transition-base;
  box-shadow: $shadow-md;

  &:hover {
    transform: translateY(-8px);
    box-shadow: $shadow-xl;

    .card-overlay {
      opacity: 0.15;
    }

    .event-btn {
      transform: translateX(4px);
    }
  }

  .card-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.05) 100%);
    opacity: 0.1;
    transition: opacity $transition-base;
  }

  .card-content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .event-logo {
    height: 32px;
    width: auto;
    margin-bottom: $spacing-md;
    object-fit: contain;
    align-self: flex-start;
  }

  .event-title {
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    color: $color-black;
    margin: 0 0 $spacing-sm 0;
    line-height: 1.3;

    @media (max-width: $breakpoint-md) {
      font-size: $font-size-xl;
    }
  }

  .event-description {
    font-size: $font-size-base;
    color: $color-text-secondary;
    margin: 0 0 $spacing-lg 0;
    line-height: 1.6;
  }

  .event-illustration {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: $spacing-lg 0;

    img {
      max-width: 100%;
      max-height: 200px;
      object-fit: contain;
    }
  }

  .event-btn {
    align-self: flex-start;
    background: $primary-color;
    color: $color-white;
    border: none;
    border-radius: $radius-md;
    padding: 12px 24px;
    font-weight: $font-weight-semibold;
    transition: all $transition-base;

    &:hover {
      background: $primary-dark;
    }

    .arrow {
      margin-left: 8px;
      transition: transform $transition-base;
    }

    &.el-button--primary {
      background: $primary-color;

      &:hover {
        background: $primary-dark;
      }
    }
  }
}
</style>
