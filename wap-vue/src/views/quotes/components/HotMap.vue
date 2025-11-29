<template>
  <section class="hot-map-container">
    <div class="row1">
      <div class="item" :class="{ positive: mockIndustryData[0]?.trend === 'up', negative: mockIndustryData[0]?.trend === 'down' }">
        <p>{{ t("软件和IT服务") }}</p>
        <p>{{ details[0]?.value || mockIndustryData[0]?.value || '+0.25%' }}</p>
      </div>
      <div class="item" :class="{ positive: mockIndustryData[1]?.trend === 'up', negative: mockIndustryData[1]?.trend === 'down' }">
        <p>{{ t("科技设备") }}</p>
        <p>{{ details[1]?.value || mockIndustryData[1]?.value || '-0.31%' }}</p>
      </div>
    </div>
    <div class="row2">
      <div class="item" :class="{ positive: mockIndustryData[2]?.trend === 'up', negative: mockIndustryData[2]?.trend === 'down' }">
        <p>{{ t("银行服务") }}</p>
        <p>{{ details[2]?.value || mockIndustryData[2]?.value || '-1.32%' }}</p>
      </div>
      <div class="item" :class="{ positive: mockIndustryData[3]?.trend === 'up', negative: mockIndustryData[3]?.trend === 'down' }">
        <p>{{ t("医疗服务") }}</p>
        <p>{{ details[3]?.value || mockIndustryData[3]?.value || '+0.63%' }}</p>
      </div>
      <div class="item" :class="{ positive: mockIndustryData[4]?.trend === 'up', negative: mockIndustryData[4]?.trend === 'down' }">
        <p>{{ t("工业品") }}</p>
        <p>{{ details[4]?.value || mockIndustryData[4]?.value || '+0.44%' }}</p>
      </div>
      <div class="item" :class="{ positive: mockIndustryData[5]?.trend === 'up', negative: mockIndustryData[5]?.trend === 'down' }">
        <p>{{ t("百货零售") }}</p>
        <p>{{ details[5]?.value || mockIndustryData[5]?.value || '+0.19%' }}</p>
      </div>
    </div>
    <div class="row3">
      <div class="item" :class="{ positive: mockIndustryData[6]?.trend === 'up', negative: mockIndustryData[6]?.trend === 'down' }">
        <p>{{ t("投资服务") }}</p>
        <p>{{ details[6]?.value || mockIndustryData[6]?.value || '-0.12%' }}</p>
      </div>
      <div class="item" :class="{ positive: mockIndustryData[7]?.trend === 'up', negative: mockIndustryData[7]?.trend === 'down' }">
        <p>{{ t("食物&饮料") }}</p>
        <p>{{ details[7]?.value || mockIndustryData[7]?.value || '+0.10%' }}</p>
      </div>
      <div class="item" :class="{ positive: mockIndustryData[8]?.trend === 'up', negative: mockIndustryData[8]?.trend === 'down' }">
        <p>{{ t("周期性消费品") }}</p>
        <p>{{ details[8]?.value || mockIndustryData[8]?.value || '-0.02%' }}</p>
      </div>
      <div class="item" :class="{ positive: mockIndustryData[9]?.trend === 'up', negative: mockIndustryData[9]?.trend === 'down' }">
        <p>{{ t("保险") }}</p>
        <p>{{ details[9]?.value || mockIndustryData[9]?.value || '+0.44%' }}</p>
      </div>
      <div class="item" :class="{ positive: mockIndustryData[10]?.trend === 'up', negative: mockIndustryData[10]?.trend === 'down' }">
        <p>{{ t("化石燃料") }}</p>
        <p>{{ details[10]?.value || mockIndustryData[10]?.value || '+0.10%' }}</p>
      </div>
      <div class="item" :class="{ positive: mockIndustryData[11]?.trend === 'up', negative: mockIndustryData[11]?.trend === 'down' }">
        <p>{{ t("消费品") }}</p>
        <p>{{ details[11]?.value || mockIndustryData[11]?.value || '-0.15%' }}</p>
      </div>
      <div class="item" :class="{ positive: mockIndustryData[12]?.trend === 'up', negative: mockIndustryData[12]?.trend === 'down' }">
        <p>{{ t("汽车及零部件") }}</p>
        <p>{{ details[12]?.value || mockIndustryData[12]?.value || '+0.07%' }}</p>
      </div>
      <div class="item" :class="{ positive: mockIndustryData[13]?.trend === 'up', negative: mockIndustryData[13]?.trend === 'down' }">
        <p>{{ t("工业和商业服务") }}</p>
        <p>{{ details[13]?.value || mockIndustryData[13]?.value || '+0.10%' }}</p>
      </div>
      <div class="item" :class="{ positive: mockIndustryData[14]?.trend === 'up', negative: mockIndustryData[14]?.trend === 'down' }">
        <p>{{ t("电信服务") }}</p>
        <p>{{ details[14]?.value || mockIndustryData[14]?.value || '-0.28%' }}</p>
      </div>
      <div class="item" :class="{ positive: mockIndustryData[15]?.trend === 'up', negative: mockIndustryData[15]?.trend === 'down' }">
        <p>{{ t("房地产") }}</p>
        <p>{{ details[15]?.value || mockIndustryData[15]?.value || '+0.27%' }}</p>
      </div>
      <div class="item" :class="{ positive: mockIndustryData[16]?.trend === 'up', negative: mockIndustryData[16]?.trend === 'down' }">
        <p>{{ t("周期性消费服务") }}</p>
        <p>{{ details[16]?.value || mockIndustryData[16]?.value || '+0.27%' }}</p>
      </div>
      <div class="item" :class="{ positive: mockIndustryData[17]?.trend === 'up', negative: mockIndustryData[17]?.trend === 'down' }">
        <p>{{ t("公用事业") }}</p>
        <p>{{ details[17]?.value || mockIndustryData[17]?.value || '+0.44%' }}</p>
      </div>
      <div class="item" :class="{ positive: mockIndustryData[18]?.trend === 'up', negative: mockIndustryData[18]?.trend === 'down' }">
        <p>{{ t("矿产资源") }}</p>
        <p>{{ details[18]?.value || mockIndustryData[18]?.value || '+0.44%' }}</p>
      </div>
      <div class="item" :class="{ positive: mockIndustryData[19]?.trend === 'up', negative: mockIndustryData[19]?.trend === 'down' }">
        <p>{{ t("化学品") }}</p>
        <p>{{ details[19]?.value || mockIndustryData[19]?.value || '-0.19%' }}</p>
      </div>
    </div>
  </section>
</template>
    
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useUserStore } from '@/store/user';
import { useRoute, useRouter } from 'vue-router';
import {
  _getHotMapList
} from "@/service/etf.api";
import { useI18n } from 'vue-i18n'

const props = defineProps({
  isSell: {
    type: Boolean,
    default: false
  }
})
const userStore = useUserStore()
const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const details = ref([])
const interval = ref(null)
const isLoading = ref(false)

// 模拟行业涨跌幅数据
const mockIndustryData = ref([
  { name: '软件和IT服务', value: '+0.25%', trend: 'up' },
  { name: '科技设备', value: '-0.31%', trend: 'down' },
  { name: '银行服务', value: '-1.32%', trend: 'down' },
  { name: '医疗服务', value: '+0.63%', trend: 'up' },
  { name: '工业品', value: '+0.44%', trend: 'up' },
  { name: '百货零售', value: '+0.19%', trend: 'up' },
  { name: '投资服务', value: '-0.12%', trend: 'down' },
  { name: '食物&饮料', value: '+0.10%', trend: 'up' },
  { name: '周期性消费品', value: '-0.02%', trend: 'down' },
  { name: '保险', value: '+0.44%', trend: 'up' },
  { name: '化石燃料', value: '+0.10%', trend: 'up' },
  { name: '消费品', value: '-0.15%', trend: 'down' },
  { name: '汽车及零部件', value: '+0.07%', trend: 'up' },
  { name: '工业和商业服务', value: '+0.10%', trend: 'up' },
  { name: '电信服务', value: '-0.28%', trend: 'down' },
  { name: '房地产', value: '+0.27%', trend: 'up' },
  { name: '周期性消费服务', value: '+0.27%', trend: 'up' },
  { name: '公用事业', value: '+0.44%', trend: 'up' },
  { name: '矿产资源', value: '+0.44%', trend: 'up' },
  { name: '化学品', value: '-0.19%', trend: 'down' }
])

onMounted(() => {
  // 初始化时使用模拟数据
  details.value = [...mockIndustryData.value]
  getHotMapList()
  // 模拟数据更新
  updateMockData()
})

onBeforeUnmount(() => {
  // 清理定时器
  if (interval.value) {
    clearInterval(interval.value)
  }
})

const getHotMapList = () => {
  _getHotMapList().then(data => {
    // 如果API返回了有效数据，使用API数据；否则保持模拟数据
    if (data && Array.isArray(data) && data.length > 0) {
      details.value = data
    }
    // 如果API数据无效，保持使用模拟数据
  }).catch(error => {
    console.warn('获取热力图数据失败，继续使用模拟数据:', error)
    // API调用失败时，保持使用模拟数据
  })
}

// 更新模拟数据
const updateMockData = () => {
  interval.value = setInterval(() => {
    mockIndustryData.value = mockIndustryData.value.map(item => {
      // 随机生成新的涨跌幅数据 (-0.5% 到 +0.5% 之间的变化)
      const randomChange = (Math.random() - 0.5) * 1 // -0.5 到 0.5 之间
      const currentValue = parseFloat(item.value.replace('%', '').replace('+', ''))
      const newValue = (currentValue + randomChange).toFixed(2)
      const formattedValue = newValue > 0 ? `+${newValue}%` : `${newValue}%`

      return {
        ...item,
        value: formattedValue,
        trend: parseFloat(newValue) > 0 ? 'up' : 'down'
      }
    })
    
    // 同步更新details数据，确保界面显示最新的模拟数据
    details.value = [...mockIndustryData.value]
  }, 3000) // 每3秒更新一次数据
}

</script>
<style lang="scss" scoped>
.hot-map-container {
  margin: 12px;
  height: 487px;
  overflow: hidden;

  .item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 1px;
    text-align: center;
    font-size: 10px;
    transition: all 0.3s ease;

    p {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      color: $white;

      &:first-child {
        font-size: 9px;
        margin-bottom: 4px;
        opacity: 0.9;
      }

      &:last-child {
        font-size: 11px;
        font-weight: 600;
      }
    }

    // 涨跌颜色样式
    &.positive {
      p:last-child {
        color: #00ff88 !important; // 绿色表示上涨
      }
    }

    &.negative {
      p:last-child {
        color: #ff4757 !important; // 红色表示下跌
      }
    }

    // 悬停效果
    &:hover {
      transform: scale(1.05);
      z-index: 10;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
  }

  .row1 {
    display: flex;

    div:first-child {
      width: calc(60% - 1px);
      height: 137px;
      background-color: #AF2356;
    }

    div:nth-child(2) {
      width: calc(40% - 1px);
      height: 137px;
      background-color: #6A1744;
    }
  }

  .row2 {
    position: relative;
    display: flex;

    .item {
      display: inline-block;
      padding-top: 20px;
    }

    div:first-child {
      padding-top: 50px;
      width: 126px;
      height: 148px;
      background-color: #6A1744;
    }

    div:nth-child(2) {
      flex: 1;
      height: 105px;
      background-color: #1A615E;
    }

    div:nth-child(3) {
      flex: 1;
      height: 105px;
      background-color: #6A707E;
    }

    div:nth-child(4) {
      flex: 1;
      height: 105px;
      background-color: #AF2356;
    }
  }

  .row3 {
    position: relative;

    div:first-child {
      padding-top: 20px;
      display: inline-block;
      width: 126px;
      height: 112px;
      background-color: #1A615E;
    }

    div:nth-child(2) {
      position: absolute;
      top: -43px;
      display: inline-block;
      width: 20%;
      height: 98px;
      background-color: #1A615E;
    }

    div:nth-child(3) {
      position: absolute;
      top: -43px;
      left: calc(20% + 130px);
      display: inline-block;
      width: calc((80% - 130px) / 2);
      height: 62px;
      background-color: #6A1744;
    }

    div:nth-child(4) {
      position: absolute;
      top: -43px;
      left: calc(20% + 130px + (80% - 130px) / 2 + 2px);
      display: inline-block;
      width: calc((80% - 138px) / 2);
      height: 62px;
      background-color: #AF2356;
    }

    div:nth-child(5) {
      padding-top: 20px;
      position: absolute;
      top: 114px;
      left: 0;
      display: inline-block;
      width: 126px;
      height: 84px;
      background-color: #6A1744;
    }

    div:nth-child(6) {
      position: absolute;
      top: 57px;
      left: 128px;
      display: inline-block;
      width: 20%;
      height: 71px;
      background-color: #1A615E;
    }

    div:nth-child(7) {
      position: absolute;
      top: 21px;
      left: calc(20% + 130px);
      display: inline-block;
      width: calc((80% - 150px) / 2);
      height: 62px;
      background-color: #AF2356;
    }

    div:nth-child(8) {
      position: absolute;
      top: 21px;
      left: calc(20% + 130px + (80% - 150px) / 2 + 2px);
      display: inline-block;
      width: calc((80% - 118px) / 2);
      height: 50px;
      background-color: #1A615E;
    }

    div:nth-child(9) {
      position: absolute;
      top: 85px;
      left: calc(20% + 130px);
      display: inline-block;
      width: calc((80% - 150px) / 2);
      height: 56px;
      background-color: #6A1744;
    }

    div:nth-child(10) {
      position: absolute;
      top: 74px;
      left: calc(20% + 130px + (80% - 150px) / 2 + 2px);
      display: inline-block;
      width: calc((80% - 118px) / 2);
      height: 50px;
      background-color: #1A615E;
    }

    div:nth-child(11) {
      position: absolute;
      top: 130px;
      left: 128px;
      display: inline-block;
      width: 20%;
      height: 68px;
      background-color: #6A1744;
    }

    div:nth-child(12) {
      position: absolute;
      top: 142px;
      left: calc(20% + 130px);
      display: inline-block;
      width: calc((80% - 150px) / 2);
      height: 56px;
      background-color: #1A615E;
    }

    div:nth-child(13) {
      position: absolute;
      top: 126px;
      left: calc(20% + 130px + (80% - 150px) / 2 + 2px);
      display: inline-block;
      width: calc((80% - 118px) / 4);
      height: 72px;
      background-color: #6A1744;
    }

    div:nth-child(14) {
      position: absolute;
      top: 126px;
      left: calc(20% + 130px + (80% - 150px) / 2 + 4px + (80% - 118px) / 4);
      display: inline-block;
      width: calc((80% - 126px) / 4);
      height: 72px;
      background-color: #6A1744;
    }
  }
}
</style>