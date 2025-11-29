<template>
  <section class="popular-events">
    <div class="container">
      <h2 class="section-title">{{ $t('newHome.events.title') }}</h2>

      <div class="events-grid" v-loading="loading">
        <EventCard
          v-for="event in eventsList"
          :key="event.id"
          :event="event"
        />
      </div>

      <!-- 查看更多按钮 -->
      <div class="view-all" v-if="eventsList.length > 0">
        <el-button class="btn-view-all" @click="viewAllEvents">
          {{ $t('newHome.events.viewAll') }}
          <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowRight } from '@element-plus/icons-vue';
import EventCard from './EventCard.vue';

const router = useRouter();
const eventsList = ref([]);
const loading = ref(false);

// 模拟活动数据
const mockEvents = [
  {
    id: 1,
    title: 'DAILY FUTURES TRADING CHALLENGE',
    description: 'Trade to win up to $10,000 daily!',
    logo: '/images/events/futures-logo.svg',
    illustration: '/images/events/futures-illustration.png',
    bgGradient: 'linear-gradient(135deg, #FFF5E6 0%, #FFE6F0 100%)',
    btnText: 'TRADE TO WIN',
    btnType: 'primary',
    link: '/events/futures-challenge'
  },
  {
    id: 2,
    title: 'SPOT TRADING',
    description: 'Discover the best spot trading opportunities',
    illustration: '/images/events/spot-illustration.png',
    bgGradient: 'linear-gradient(135deg, #E6F0FF 0%, #F0E6FF 100%)',
    btnText: 'Start Trading',
    link: '/market'
  },
  {
    id: 3,
    title: 'TRICK, TRADE OR LUCKY TREAT',
    description: 'Halloween special event with amazing rewards!',
    illustration: '/images/events/halloween-illustration.png',
    bgGradient: 'linear-gradient(135deg, #FFE6E6 0%, #FFF0E6 100%)',
    btnText: 'Join Now',
    link: '/events/halloween'
  },
  {
    id: 4,
    title: 'CRYPTO STAKING REWARDS',
    description: 'Earn passive income with flexible staking options',
    illustration: '/images/events/staking-illustration.png',
    bgGradient: 'linear-gradient(135deg, #E6FFE6 0%, #E6F9FF 100%)',
    btnText: 'Start Earning',
    link: '/earn/staking'
  }
];

const fetchEvents = async () => {
  loading.value = true;
  try {
    // TODO: 替换为实际 API 调用
    // const response = await getPopularEvents();
    // eventsList.value = response.data;

    // 使用模拟数据
    await new Promise(resolve => setTimeout(resolve, 500));
    eventsList.value = mockEvents;
  } catch (error) {
    console.error('Failed to fetch events:', error);
    eventsList.value = mockEvents;
  } finally {
    loading.value = false;
  }
};

const viewAllEvents = () => {
  router.push('/events');
};

onMounted(() => {
  fetchEvents();
});
</script>

<style lang="scss" scoped>
@import '@/views/_new/home/styles/variables.scss';

.popular-events {
  padding: $spacing-4xl 0;
  background: $bg-white;

  @media (max-width: $breakpoint-md) {
    padding: $spacing-3xl 0;
  }

  .section-title {
    text-align: center;
    margin-bottom: $spacing-3xl;

    @media (max-width: $breakpoint-md) {
      margin-bottom: $spacing-2xl;
    }
  }

  .events-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: $spacing-xl;
    margin-bottom: $spacing-3xl;

    @media (max-width: $breakpoint-lg) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: $breakpoint-md) {
      grid-template-columns: 1fr;
      gap: $spacing-lg;
    }
  }

  .view-all {
    text-align: center;
    margin-top: $spacing-2xl;

    .btn-view-all {
      padding: 14px 32px;
      font-size: $font-size-base;
      font-weight: $font-weight-semibold;
      border: 2px solid $color-border;
      background: transparent;
      color: $color-text-primary;
      border-radius: $radius-md;
      transition: all $transition-base;

      &:hover {
        border-color: $primary-color;
        color: $primary-color;
        transform: translateY(-2px);
        box-shadow: $shadow-md;
      }

      .el-icon {
        margin-left: 8px;
      }
    }
  }
}
</style>
