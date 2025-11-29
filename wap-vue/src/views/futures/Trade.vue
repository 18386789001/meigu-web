<template>
  <section class="pb-fix">
    <van-loading color="#1194F7" class="loading-box" v-if="isLoading" />
    <div class="futures-trade-container">
      <header class="header">
        <div class="flex-l">
          <span class="title">{{ t("期货交易") }}</span>
        </div>
      </header>
      
      <!-- 用户信息区域 -->
      <div class="user-info px-4 mt-4">
        <div class="mt-8 flex">
          <img class="w-24 h-24" src="../../assets/image/avatar.png" alt="avatar" />
          <div class="ml-2 flex flex-col justify-center">
            <div class="font-bold text-lg name">
              {{ userStore.userInfo && userStore.userInfo.username }}
            </div>
            <div class="text-sm text-gray-400 ID mt-1 flex items-center">
              ID：{{
                userStore.userInfo && userStore.userInfo.usercode
              }}<img class="w-8 h-8 ml-4" src="../../assets/image/idcopy.png" alt="id" @click="copy" />
            </div>
          </div>
        </div>
      </div>

      <!-- 资产信息区域 -->
      <div class="asset">
        <div class="line">
          <div class="flex-l">
            <p>{{ t("Futures Total assets") }}</p>
            <p class="value">
              {{
                currency.currency_symbol
              }}
              {{
                assetsObj.totalAssets
                  ? (assetsObj.totalAssets * (currency.rate ?? 0)).toFixed(2)
                  : "0"
              }}
            </p>
          </div>
          <div class="flex-r">
            <p>{{ t("Futures Loss") }}</p>
            <p class="profit red">
              {{
                currency.currency_symbol
              }}
              {{
                assetsObj.profit
                  ? (assetsObj.profit * (currency.rate ?? 0)).toFixed(2)
                  : "0"
              }}
            </p>
          </div>
        </div>
        <div class="line">
          <div class="flex-l">
            <p>{{ t("Futures Balance") }}</p>
            <p class="value">
              {{
                currency.currency_symbol
              }}
              {{
                assetsObj.usdtBalance
                  ? (assetsObj.usdtBalance * (currency.rate ?? 0)).toFixed(2)
                  : "0"
              }}
            </p>
          </div>
          <div class="flex-r">
            <p>{{ t("Futures Profit Day") }}</p>
            <p class="profit red">
              {{
                currency.currency_symbol
              }}
              {{
                assetsObj.profitToday
                  ? (assetsObj.profitToday * (currency.rate ?? 0)).toFixed(2)
                  : "0"
              }}
            </p>
          </div>
        </div>
      </div>

      <!-- 快捷操作按钮 -->
      <div class="quick-actions">
        <div class="action-btn buy-btn" @click="handleBuy">
          <div class="btn-icon">
            <img src="@/assets/theme/dark/image/buy-icon.png" alt="买入" />
          </div>
          <span>{{ t("买入") }}</span>
        </div>
        <div class="action-btn sell-btn" @click="handleSell">
          <div class="btn-icon">
            <img src="@/assets/theme/dark/image/sell-icon.png" alt="卖出" />
          </div>
          <span>{{ t("卖出") }}</span>
        </div>
        <div class="action-btn position-btn" @click="handlePosition">
          <div class="btn-icon">
            <img src="@/assets/theme/dark/image/position-icon.png" alt="持仓" />
          </div>
          <span>{{ t("持仓") }}</span>
        </div>
        <div class="action-btn query-btn" @click="handleQuery">
          <div class="btn-icon">
            <img src="@/assets/theme/dark/image/query-icon.png" alt="查询" />
          </div>
          <span>{{ t("查询") }}</span>
        </div>
      </div>

      <!-- 充值提现按钮 -->
      <div class="recharge-withdraw">
        <div class="recharge-btn" @click="$router.push('/exchange/channel-in')">
          <div class="btn-content">
            <img src="@/assets/theme/dark/image/chongicon.png" alt="充值" />
            <span>{{ t("快捷充值") }}</span>
          </div>
          <img src="@/assets/theme/dark/image/goto.png" alt="箭头" />
        </div>
        <div class="withdraw-btn" @click="$router.push('/exchange/channel-out')">
          <div class="btn-content">
            <img src="@/assets/theme/dark/image/tiicon.png" alt="提现" />
            <span>{{ t("快捷提现") }}</span>
          </div>
          <img src="@/assets/theme/dark/image/goto.png" alt="箭头" />
        </div>
      </div>

      <!-- 交易详情标签页 -->
      <div class="trade-tabs">
        <div class="tab-nav">
          <div 
            class="tab-item" 
            :class="{ active: navActive === 0 }" 
            @click="handleChangeNav(0)"
          >
            {{ t("持仓") }}
          </div>
          <div 
            class="tab-item" 
            :class="{ active: navActive === 1 }" 
            @click="handleChangeNav(1)"
          >
            {{ t("委托") }}
          </div>
          <div 
            class="tab-item" 
            :class="{ active: navActive === 2 }" 
            @click="handleChangeNav(2)"
          >
            {{ t("成交") }}
          </div>
          <div 
            class="tab-item" 
            :class="{ active: navActive === 3 }" 
            @click="handleChangeNav(3)"
          >
            {{ t("自选") }}
          </div>
        </div>

        <!-- 表格头部 -->
        <div class="table-header">
          <div class="header-item market-value">{{ t("市值") }}</div>
          <div class="header-item profit-loss">{{ t("盈亏") }}</div>
          <div class="header-item position-available">{{ t("持仓/可用") }}</div>
          <div class="header-item cost-current">{{ t("成本/现价") }}</div>
        </div>

        <!-- 数据列表 -->
        <div class="data-list">
          <div v-if="futuresList.length === 0" class="empty-state">
            <img src="@/assets/image/assets-center/no-data.png" alt="暂无数据" class="no-data-img" />
            <p class="text-grey mt-10 text-24">{{ t("暂无记录") }}</p>
          </div>
          <div v-else>
            <div 
              v-for="(item, index) in futuresList" 
              :key="`${item.symbol}${index}`"
              class="futures-item"
              @click="handleItemClick(item)"
            >
              <div class="item-left">
                <div class="symbol">{{ item.symbol }}</div>
                <div class="market-value">{{ item.marketValue }}</div>
              </div>
              <div class="item-right">
                <div class="profit-loss">
                  <div class="profit-amount" :class="{ 
                    'text-up': item.profitLoss > 0, 
                    'text-down': item.profitLoss < 0 
                  }">
                    {{ item.profitLoss }}
                  </div>
                  <div class="profit-percent" :class="{ 
                    'text-up': item.profitLossPercentage > 0, 
                    'text-down': item.profitLossPercentage < 0 
                  }">
                    {{ item.profitLossPercentage > 0 ? '+' : '' }}{{ item.profitLossPercentage }}%
                  </div>
                </div>
                <div class="position-available">
                  <div class="position">{{ item.positionVolume }}</div>
                  <div class="available">{{ item.volume }}</div>
                </div>
                <div class="cost-current">
                  <div class="cost">{{ item.price }}</div>
                  <div class="current">{{ item.currentPrice }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useUserStore } from "@/store/user";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import useClipboard from "vue-clipboard3";
import { showToast } from "vant";
import { _assetsTradeTop } from "@/service/user.api";
import { themeStore } from "@/store/theme";
import { useStore } from 'vuex';

const thStore = themeStore();
const store = useStore();
const { t } = useI18n();
const { toClipboard } = useClipboard();
const router = useRouter();
const userStore = useUserStore();

// 响应式数据
const isLoading = ref(false);
const navActive = ref(0);
const currency = ref({});
const assetsObj = ref({});

// 期货数据 - 只保留黄金和白银
const futuresList = ref([
  {
    symbol: 'AU2412',
    name: 'AU2412', // 使用symbol作为name，在显示时通过i18n翻译
    commodityName: '黄金', // 商品名称，用于i18n翻译
    contractCode: '2412',
    marketValue: '428.593',
    profitLoss: 5.74,
    profitLossPercentage: 1.35,
    positionVolume: '10',
    volume: '10',
    price: '428.593',
    currentPrice: '428.593'
  },
  {
    symbol: 'AG2412',
    name: 'AG2412', // 使用symbol作为name，在显示时通过i18n翻译
    commodityName: '白银', // 商品名称，用于i18n翻译
    contractCode: '2412',
    marketValue: '1538.78',
    profitLoss: -58.93,
    profitLossPercentage: -3.69,
    positionVolume: '5',
    volume: '5',
    price: '1538.78',
    currentPrice: '1538.78'
  }
]);

// 方法
const copy = async () => {
  try {
    await toClipboard(userStore.userInfo && userStore.userInfo.usercode);
    showToast(t("copySuccess"));
  } catch (e) {
    console.error(e);
  }
};

const handleChangeNav = (index) => {
  navActive.value = index;
  // 根据不同的标签页加载不同的数据
  switch (index) {
    case 0:
      // 持仓数据
      break;
    case 1:
      // 委托数据
      break;
    case 2:
      // 成交数据
      break;
    case 3:
      // 自选数据
      break;
  }
};

const handleBuy = () => {
  // 跳转到买入页面
  router.push('/futures/buy');
};

const handleSell = () => {
  // 跳转到卖出页面
  router.push('/futures/sell');
};

const handlePosition = () => {
  // 跳转到持仓页面
  navActive.value = 0;
};

const handleQuery = () => {
  // 跳转到查询页面
  navActive.value = 1;
};

const handleItemClick = (item) => {
  // 跳转到期货详情页面
  router.push({
    name: 'FuturesDetail',
    params: { symbol: item.symbol }
  });
};

const assetsTradeTopFn = () => {
  isLoading.value = true;
  _assetsTradeTop({
    symbolType: 'futures',
    tradeType: 'futures'
  }).then(res => {
    isLoading.value = false;
    assetsObj.value = res;
  }).catch((e) => {
    isLoading.value = false;
  });
};

onMounted(async () => {
  await store.dispatch('home/SET_CURRENCY');
  currency.value = store.state.home.currency;
  assetsTradeTopFn();
});
</script>

<style lang="scss" scoped>
:deep(.van-loading) {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
}

.futures-trade-container {
  .green {
    color: $green;
  }

  .red {
    color: $red;
  }

  .header {
    display: flex;
    height: 28px;
    padding: 0 12px;

    .flex-l {
      flex: 1;
      display: inline-flex;
    }

    .title {
      font-weight: 700;
      font-size: 28px;
      line-height: 36px;
      color: $mainTextColor;
    }
  }

  .user-info {
    .name {
      font-size: 20px;
    }

    .ID {
      font-size: 16px;
    }
  }

  .asset {
    .line {
      padding: 14px 12px;
      display: flex;
      align-items: center;
      font-size: 18px;
      line-height: 24px;

      .value {
        margin-top: 10px;
        font-weight: 700;
        font-size: 28px;
        line-height: 32px;
        color: $text_color;
      }

      .profit {
        margin-top: 10px;
        font-size: 20px;
      }

      .flex-l {
        flex: 1;
      }

      .flex-r {
        flex: 1;
        text-align: right;
      }
    }
  }

  .quick-actions {
    display: flex;
    justify-content: space-around;
    padding: 20px 12px;
    background: $mainBgColor;

    .action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;

      .btn-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: $color_main;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 8px;

        img {
          width: 20px;
          height: 20px;
        }
      }

      span {
        font-size: 18px;
        color: $text_color;
      }

      &.buy-btn .btn-icon {
        background: $green;
      }

      &.sell-btn .btn-icon {
        background: $red;
      }

      &.position-btn .btn-icon {
        background: $color_main;
      }

      &.query-btn .btn-icon {
        background: $color_main;
      }
    }
  }

  .recharge-withdraw {
    display: flex;
    gap: 10px;
    padding: 0 12px 20px;

    .recharge-btn,
    .withdraw-btn {
      flex: 1;
      height: 72px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px;
      border-radius: 6px;
      cursor: pointer;

      .btn-content {
        display: flex;
        align-items: center;
        flex: 1;

        img {
          width: 24px;
          height: 24px;
          margin-right: 12px;
        }

        span {
          font-size: 18px;
          color: $text_color;
        }
      }

      img:last-child {
        width: 16px;
        height: 16px;
      }
    }

    .recharge-btn {
      background: url("@/assets/theme/dark/image/chongb.png");
      background-size: cover;
    }

    .withdraw-btn {
      border: 1px solid $color_main;
      border-radius: 10px;
    }
  }

  .trade-tabs {
    .tab-nav {
      display: flex;
      background: $mainBgColor;
      padding: 0 12px;

      .tab-item {
        flex: 1;
        text-align: center;
        padding: 12px 0;
        font-size: 20px;
        color: $text_color;
        cursor: pointer;
        border-bottom: 2px solid transparent;

        &.active {
          color: $color_main;
          border-bottom-color: $color_main;
          font-weight: 700;
        }
      }
    }

    .table-header {
      display: flex;
      background: $mainBgColor;
      padding: 12px;
      font-size: 18px;
      color: $text_color5;
      font-weight: 500;

      .header-item {
        flex: 1;
        text-align: center;

        &.market-value {
          text-align: left;
        }
      }
    }

    .data-list {
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 60px 20px;
        color: $text_color5;

        .no-data-img {
          width: 100px;
          height: 100px;
          margin-bottom: 16px;
        }
      }

      .futures-item {
        display: flex;
        padding: 16px 12px;
        border-bottom: 1px solid $border_color;
        cursor: pointer;

        &:hover {
          background-color: $mainBgColor;
        }

        .item-left {
          flex: 2;
          display: flex;
          flex-direction: column;
          justify-content: center;

          .symbol {
            font-size: 21px;
            font-weight: 500;
            color: $text_color;
            margin-bottom: 2px;
          }

          .market-value {
            font-size: 16px;
            color: $text_color5;
          }
        }

        .item-right {
          flex: 3;
          display: flex;
          align-items: center;
          justify-content: space-between;

          .profit-loss,
          .position-available,
          .cost-current {
            flex: 1;
            text-align: center;
            display: flex;
            flex-direction: column;
            gap: 2px;

            .text-up {
              color: $red;
            }

            .text-down {
              color: $green;
            }
          }
        }
      }
    }
  }
}
</style>
