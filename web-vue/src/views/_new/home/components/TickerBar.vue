<template>
  <div class="ticker-bar">
    <div class="ticker-track" ref="tickerTrack">
      <!-- 第一组数据 -->
      <div class="ticker-list">
        <div
          v-for="(item, index) in tickerData"
          :key="`first-${index}`"
          class="ticker-item"
          @click="goToTrade(item)"
        >
          <span class="pair">{{ item.symbol }}</span>
          <span class="price">{{ formatPrice(item.price) }}</span>
          <PercentBadge :value="item.changePercent" :show-arrow="false" />
        </div>
      </div>
      <!-- 第二组数据（用于无缝滚动） -->
      <div class="ticker-list">
        <div
          v-for="(item, index) in tickerData"
          :key="`second-${index}`"
          class="ticker-item"
          @click="goToTrade(item)"
        >
          <span class="pair">{{ item.symbol }}</span>
          <span class="price">{{ formatPrice(item.price) }}</span>
          <PercentBadge :value="item.changePercent" :show-arrow="false" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import PercentBadge from '@/views/_new/components/common/PercentBadge.vue';

const router = useRouter();
const tickerTrack = ref(null);
const tickerData = ref([]);
let animationId = null;

// 模拟行情数据
const mockTickerData = [
  { symbol: 'BTC/USDT', price: 31115.98, changePercent: -10.77 },
  { symbol: 'ASTER/USDT', price: 1.0261, changePercent: -8.38 },
  { symbol: 'ANOA/USDT', price: 262.22835, changePercent: 0.54 },
  { symbol: 'CST/USDT', price: 865.68998, changePercent: -4.11 },
  { symbol: 'USDC/USDT', price: 1.00035, changePercent: 0.02 },
  { symbol: 'FTC/USDT', price: 0.1098, changePercent: -0.09 },
  { symbol: 'BBFT/USDT', price: 0.0007496, changePercent: -5.66 },
  { symbol: 'ETH/USDT', price: 1845.32, changePercent: 2.35 },
  { symbol: 'BNB/USDT', price: 312.45, changePercent: 1.24 },
  { symbol: 'SOL/USDT', price: 22.67, changePercent: -3.12 }
];

const fetchTickerData = async () => {
  try {
    // TODO: 替换为实际 API 调用
    // const response = await getRealtimeTickers();
    // tickerData.value = response.data;

    // 使用模拟数据
    tickerData.value = mockTickerData;
  } catch (error) {
    console.error('Failed to fetch ticker data:', error);
    tickerData.value = mockTickerData;
  }
};

const formatPrice = (price) => {
  if (price >= 1) {
    return price.toFixed(2);
  } else if (price >= 0.01) {
    return price.toFixed(4);
  } else {
    return price.toFixed(6);
  }
};

const goToTrade = (item) => {
  const symbol = item.symbol.replace('/', '_');
  router.push(`/trade/${symbol}`);
};

// 启动滚动动画
const startAnimation = () => {
  if (!tickerTrack.value) return;

  const track = tickerTrack.value;
  const firstList = track.querySelector('.ticker-list');

  if (!firstList) return;

  const listWidth = firstList.offsetWidth;
  let translateX = 0;
  const speed = 0.5; // 滚动速度（像素/帧）

  const animate = () => {
    translateX -= speed;

    // 当第一组完全滚出视野时，重置位置
    if (Math.abs(translateX) >= listWidth) {
      translateX = 0;
    }

    track.style.transform = `translateX(${translateX}px)`;
    animationId = requestAnimationFrame(animate);
  };

  animationId = requestAnimationFrame(animate);
};

onMounted(() => {
  fetchTickerData();
  // 等待数据加载和DOM更新后启动动画
  setTimeout(() => {
    startAnimation();
  }, 100);

  // 每30秒更新一次数据
  const intervalId = setInterval(fetchTickerData, 30000);

  onUnmounted(() => {
    clearInterval(intervalId);
  });
});

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
});
</script>

<style lang="scss" scoped>
@import '@/views/_new/home/styles/variables.scss';

.ticker-bar {
  width: 100%;
  background: $bg-white;
  border-top: 1px solid $color-divider;
  border-bottom: 1px solid $color-divider;
  overflow: hidden;
  padding: $spacing-sm 0;

  .ticker-track {
    display: flex;
    width: fit-content;
    will-change: transform;
  }

  .ticker-list {
    display: flex;
    gap: $spacing-3xl;
    padding: 0 $spacing-xl;
    white-space: nowrap;
  }

  .ticker-item {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    cursor: pointer;
    padding: $spacing-xs $spacing-sm;
    border-radius: $radius-xs;
    transition: background $transition-fast;

    &:hover {
      background: $bg-light;
    }

    .pair {
      font-size: $font-size-sm;
      font-weight: $font-weight-semibold;
      color: $color-text-primary;
      min-width: 100px;
    }

    .price {
      font-size: $font-size-sm;
      font-weight: $font-weight-medium;
      color: $color-text-primary;
      min-width: 80px;
      text-align: right;
    }
  }
}
</style>
