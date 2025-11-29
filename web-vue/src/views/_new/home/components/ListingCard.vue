<template>
  <div class="listing-card" @click="handleClick">
    <div class="card-inner">
      <!-- NEW LISTING 标签 -->
      <span class="new-badge">{{ $t('newHome.newListing.badge') }}</span>

      <!-- 币种名称 -->
      <h3 class="coin-symbol">${{ coin.symbol }}</h3>

      <!-- 3D 币种图标 -->
      <div class="coin-icon-wrapper">
        <div class="glow-effect"></div>
        <img :src="coin.icon || '/images/coins/default.png'" :alt="coin.symbol" class="coin-icon-3d" />
      </div>

      <!-- 上线时间 -->
      <p class="listing-info">
        <el-icon><Clock /></el-icon>
        <span>{{ formatListingTime(coin.listingTime) }}</span>
      </p>

      <!-- 交易对 -->
      <div class="trading-pair">
        <span>{{ coin.symbol }}/USDT</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { Clock } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  coin: {
    type: Object,
    required: true
  }
});

const router = useRouter();
const { t } = useI18n();

const formatListingTime = (time) => {
  if (!time) return '';
  const date = new Date(time);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const handleClick = () => {
  router.push(`/trade/${props.coin.symbol}_USDT`);
};
</script>

<style lang="scss" scoped>
@import '@/views/_new/home/styles/variables.scss';

.listing-card {
  background: $bg-card-dark;
  border-radius: $radius-xl;
  padding: $spacing-xl;
  cursor: pointer;
  transition: all $transition-base;
  position: relative;
  overflow: hidden;
  min-height: 320px;
  display: flex;
  flex-direction: column;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba($primary-color, 0.05) 0%, transparent 100%);
    opacity: 0;
    transition: opacity $transition-base;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba($primary-color, 0.2);

    &::before {
      opacity: 1;
    }

    .coin-icon-3d {
      transform: scale(1.1) rotateY(15deg);
    }

    .glow-effect {
      transform: scale(1.2);
      opacity: 0.8;
    }
  }

  .card-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    height: 100%;
  }

  .new-badge {
    display: inline-block;
    padding: 6px 16px;
    background: $primary-color;
    color: $color-white;
    font-size: $font-size-xs;
    font-weight: $font-weight-bold;
    border-radius: $radius-full;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: $spacing-md;
  }

  .coin-symbol {
    font-size: $font-size-3xl;
    font-weight: $font-weight-bold;
    color: $color-white;
    margin: 0 0 $spacing-lg 0;

    @media (max-width: $breakpoint-md) {
      font-size: $font-size-2xl;
    }
  }

  .coin-icon-wrapper {
    position: relative;
    width: 120px;
    height: 120px;
    margin: $spacing-xl 0;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    .glow-effect {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: radial-gradient(circle, rgba($primary-color, 0.4) 0%, transparent 70%);
      filter: blur(20px);
      transition: all $transition-base;
    }

    .coin-icon-3d {
      position: relative;
      z-index: 1;
      width: 100%;
      height: 100%;
      object-fit: contain;
      filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3));
      transition: all $transition-base;
      transform-style: preserve-3d;
    }
  }

  .listing-info {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: $font-size-sm;
    color: rgba($color-white, 0.7);
    margin: 0 0 $spacing-sm 0;

    .el-icon {
      font-size: 16px;
    }
  }

  .trading-pair {
    padding: 8px 16px;
    background: rgba($color-white, 0.1);
    border-radius: $radius-md;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-white;
  }
}
</style>
