<template>
  <!-- 合约委托详情 -->
  <div id="cryptos">
    <div class="entrustDetail text-28">
      <assets-head :title="$t('委托详情')" />
      <!-- <div class="grey-line contBackground"></div> -->
      <div class="pl-8 pr-8 pt-14 pb-14 ">
        <div class="flex justify-between pb-11 text-28">
          <div class="text-grey">{{ $t('操作') }}</div>
          <div class="text-green textColor"> {{ handleWord(detail.direction, detail.offset,
            detail.price_type) }}&nbsp;{{ detail.name || '--' }}</div>
        </div>
        <div class="flex justify-between pb-11 text-28">
          <div class="text-grey">{{ $t('状态') }}</div>
          <div class="textColor">{{ detail.state === 'created' ? $t('已完成') : $t('未成交') }}</div>
        </div>
        <div class="flex justify-between pb-11 text-28">
          <div class="text-grey">{{ $t('委托金额') }}</div>
          <div class="textColor">{{ detail.amount_open || '--' }}</div>
        </div>
        <div class="flex justify-between pb-11 text-28">
          <div class="text-grey">{{ $t('剩余金额') }}</div>
          <div class="textColor">{{ detail.amount || '--' }}</div>
        </div>
        <div class="flex justify-between pb-11 text-28">
          <div class="text-grey">{{ $t('保证金') }}</div>
          <div class="textColor">{{ detail.deposit || '--' }}</div>
        </div>
        <div class="flex justify-between pb-11 text-28">
          <div class="text-grey">{{ $t('杠杆') }}</div>
          <div class="textColor">{{ detail.lever_rate ? detail.lever_rate + 'x' : '--' }}</div>
        </div>
        <div class="flex justify-between pb-11 text-28">
          <div class="text-grey">{{ $t('手续费') }}</div>
          <div class="textColor">{{ detail.fee || '--' }}</div>
        </div>
        <div class="flex justify-between pb-11 text-28">
          <div class="text-grey">{{ $t('订单类型') }}</div>
          <div class="textColor" v-if="detail.price_type === 'limit'">{{ $t('限价委托') }}</div>
          <div class="textColor" v-else-if="detail.price_type === 'market'">{{ $t('市价委托') }}</div>
          <div class="textColor" v-else>--</div>
        </div>
        <div class="flex justify-between pb-11 text-28">
          <div class="text-grey">{{ detail.price_type === 'limit' ? $t('限价') : $t('市价') }}</div>
          <div class="textColor">{{ detail.price || '--' }}</div>
        </div>
        <div class="flex justify-between pb-11 text-28">
          <div class="text-grey">{{ $t('订单号') }}</div>
          <div class="textColor">{{ detail.order_no || '--' }}</div>
        </div>
        <div class="flex justify-between pb-11 text-28">
          <div class="text-grey">{{ $t('委托时间') }}</div>
          <div class="textColor">
            {{ detail.create_time_ts ? dayjs(detail.create_time_ts * 1000).format('YYYY-MM-DD HH:mm:ss') : '--' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { _orderDetail } from "@/service/trade.api";
import assetsHead from "@/components/Transform/assets-head/index.vue";
import dayjs from 'dayjs'
export default {
  name: "entrustDetail",
  data() {
    return {
      detail: {},
      dayjs
    }
  },
  components: { assetsHead },
  mounted() {
    const orderNo = this.$route.query.order_no;
    if (orderNo) {
      this.fetchDetail(orderNo);
    } else {
      console.error('订单号参数缺失');
      this.$router.go(-1); // 返回上一页
    }
  },
  methods: {
    handleWord(direction, offset, price_type) {
      // 根据方向和操作类型返回对应的操作描述
      // price_type 参数保留以备将来使用
      if (direction === 'buy' && offset === 'open') {
        return this.$t('开多')
      } else if (direction === 'sell' && offset === 'open') {
        return this.$t('开空')
      } else if (direction === 'buy' && offset === 'close') {
        return this.$t('平多')
      } else if (direction === 'sell' && offset === 'close') {
        return this.$t('平空')
      } else {
        return '--'
      }
    },
    onClickLeft() {
      this.$router.go(-1);
    },
    fetchDetail(order_no) {
      _orderDetail(order_no).then(data => {
        this.detail = data || {};
      }).catch(error => {
        console.error('获取委托详情失败:', error);
        this.detail = {};
        // 可以添加错误提示
        this.$toast && this.$toast('获取委托详情失败');
      });
    }
  },
  // beforeRouteEnter(to, from, next) {
  //   alert(1)
  //   console.log(to)
  //   const { query: { order_no } } = to
  //   next(vm => {
  //     vm.fetchDetail(order_no)
  //   })
  // }
}
</script>

<style lang="scss" scoped>
#cryptos {
  .entrustDetail {
    width: 100%;
    box-sizing: border-box;
  }

  .grey-line {
    height: 15px;
  }
}
</style>
