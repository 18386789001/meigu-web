<template>
  <constract
    :pageType="pageType"
    :paramsType="paramsType"
    :defaultSymbol="defaultSymbol"
    :contractType="contractType"
  ></constract>
</template>
<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import Constract from "@comConstract/index.vue";

const route = useRoute();

// 根据路由参数获取配置
const contractType = computed(() => route.params.type || 'crypto');
const paramsType = computed(() => contractType.value === 'rwa' ? 'rwa' : 'cryptos');
const defaultSymbol = computed(() => {
  if (contractType.value === 'rwa') {
    return 'btcusdt'; // RWA默认用btc
  } else {
    return 'ltcusdt'; // Crypto默认用ltc
  }
});
const pageType = computed(() => 'coin');
</script>
