<template>
  <section class="new-listing">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">{{ $t('newHome.newListing.title') }}</h2>
        <el-button text class="view-all-btn" @click="viewAllListings">
          {{ $t('common.viewAll') }}
          <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>

      <div class="listing-grid" v-loading="loading">
        <ListingCard
          v-for="coin in newCoins"
          :key="coin.id"
          :coin="coin"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowRight } from '@element-plus/icons-vue';
import ListingCard from './ListingCard.vue';

const router = useRouter();
const newCoins = ref([]);
const loading = ref(false);

// 模拟新币数据
const mockNewCoins = [
  {
    id: 1,
    symbol: 'CALL',
    icon: '/images/coins/call.png',
    listingTime: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    symbol: 'ASTER',
    icon: '/images/coins/aster.png',
    listingTime: '2024-01-16T12:00:00Z'
  },
  {
    id: 3,
    symbol: 'ANOA',
    icon: '/images/coins/anoa.png',
    listingTime: '2024-01-17T14:00:00Z'
  },
  {
    id: 4,
    symbol: 'NOVA',
    icon: '/images/coins/nova.png',
    listingTime: '2024-01-18T16:00:00Z'
  }
];

const fetchNewListings = async () => {
  loading.value = true;
  try {
    // TODO: 替换为实际 API 调用
    // const response = await getNewListings();
    // newCoins.value = response.data;

    await new Promise(resolve => setTimeout(resolve, 500));
    newCoins.value = mockNewCoins;
  } catch (error) {
    console.error('Failed to fetch new listings:', error);
    newCoins.value = mockNewCoins;
  } finally {
    loading.value = false;
  }
};

const viewAllListings = () => {
  router.push('/listings/new');
};

onMounted(() => {
  fetchNewListings();
});
</script>

<style lang="scss" scoped>
@import '@/views/_new/home/styles/variables.scss';

.new-listing {
  padding: $spacing-4xl 0;
  background: $bg-dark;

  @media (max-width: $breakpoint-md) {
    padding: $spacing-3xl 0;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-3xl;

    @media (max-width: $breakpoint-md) {
      flex-direction: column;
      gap: $spacing-lg;
      align-items: flex-start;
    }

    .section-title {
      color: $color-white;
      margin: 0;
    }

    .view-all-btn {
      color: $primary-color;
      font-weight: $font-weight-medium;

      &:hover {
        color: $primary-dark;
      }

      .el-icon {
        margin-left: 8px;
      }
    }
  }

  .listing-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: $spacing-xl;

    @media (max-width: $breakpoint-xl) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: $breakpoint-lg) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: $breakpoint-md) {
      grid-template-columns: 1fr;
      gap: $spacing-lg;
    }
  }
}
</style>
