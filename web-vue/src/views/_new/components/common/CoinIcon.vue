<template>
  <div class="coin-icon" :class="sizeClass">
    <img
      v-if="src"
      :src="src"
      :alt="symbol"
      @error="handleError"
      class="coin-image"
    />
    <div v-else class="coin-placeholder">
      {{ symbol?.substring(0, 1) || '?' }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  symbol: {
    type: String,
    required: true
  },
  src: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md', // xs, sm, md, lg, xl
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  }
});

const imageError = ref(false);

const sizeClass = computed(() => `size-${props.size}`);

const handleError = () => {
  imageError.value = true;
};
</script>

<style lang="scss" scoped>
@import '@/views/_new/home/styles/variables.scss';

.coin-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  overflow: hidden;
  background: $bg-light;
  flex-shrink: 0;

  &.size-xs {
    width: 20px;
    height: 20px;
    font-size: 10px;
  }

  &.size-sm {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }

  &.size-md {
    width: 36px;
    height: 36px;
    font-size: 14px;
  }

  &.size-lg {
    width: 48px;
    height: 48px;
    font-size: 18px;
  }

  &.size-xl {
    width: 64px;
    height: 64px;
    font-size: 24px;
  }

  .coin-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .coin-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: $font-weight-semibold;
    color: $color-text-secondary;
    background: $bg-gray;
  }
}
</style>
