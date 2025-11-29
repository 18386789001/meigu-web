<template>
  <spot
    :pageType="pageType"
    :paramsType="paramsType"
    :defaultSymbol="defaultSymbol"
    :marketTypeParam="marketTypeParam"
  ></spot>
</template>
<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Spot from "@comSpot/index.vue";

const route = useRoute();

// 从 URL 参数获取资产代码和市场类型
const symbol = computed(() => route.params.id || 'AAPL');
const marketType = computed(() => route.query.marketType || 'stocks');

// 根据市场类型确定 pageType 和 paramsType
const pageType = computed(() => {
  const typeMap = {
    'stocks': 'usStocks',
    'forex': 'forex',
    'crypto': 'coin'
  };
  return typeMap[marketType.value] || 'usStocks';
});

const paramsType = computed(() => {
  const typeMap = {
    'stocks': 'US-stocks',
    'forex': 'forex',
    'crypto': 'cryptos'
  };
  return typeMap[marketType.value] || 'US-stocks';
});

// K线接口需要的市场类型参数（注意：stocks -> stock）
const marketTypeParam = computed(() => {
  const typeMap = {
    'stocks': 'stock',
    'forex': 'forex',
    'crypto': 'crypto'
  };
  return typeMap[marketType.value] || 'stock';
});

const defaultSymbol = computed(() => symbol.value);
</script>
