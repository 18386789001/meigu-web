<template>
  <span class="percent-badge" :class="badgeClass">
    <span v-if="showArrow" class="arrow">{{ value >= 0 ? '▲' : '▼' }}</span>
    <span class="value">{{ formattedValue }}</span>
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  value: {
    type: Number,
    required: true
  },
  showArrow: {
    type: Boolean,
    default: true
  },
  decimals: {
    type: Number,
    default: 2
  }
});

const badgeClass = computed(() => {
  return props.value >= 0 ? 'positive' : 'negative';
});

const formattedValue = computed(() => {
  const sign = props.value > 0 ? '+' : '';
  return `${sign}${props.value.toFixed(props.decimals)}%`;
});
</script>

<style lang="scss" scoped>
@import '@/views/_new/home/styles/variables.scss';

.percent-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: $radius-xs;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  white-space: nowrap;

  &.positive {
    color: $color-up;
    background: $color-up-light;

    .arrow {
      color: $color-up;
    }
  }

  &.negative {
    color: $color-down;
    background: $color-down-light;

    .arrow {
      color: $color-down;
    }
  }

  .arrow {
    font-size: 10px;
    line-height: 1;
  }

  .value {
    line-height: 1;
  }
}
</style>
