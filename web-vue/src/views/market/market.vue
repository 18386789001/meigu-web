/* eslint-disable vue/valid-v-bind */
<template>
  <div class="css-ph4aey" style="background-color: #fafafa; height: 100vh">
    <div class="css-tq0shg">
      <main class="css-1wr4jig">
        <div class="css-1pysja1">
          <div class="css-6nqu2s">
            <!-- 标题 -->
            <div class="css-b22026">
              <div class="css-1vs5d4i">
                <div class="css-o32gok" style="margin-left: 0px">
                  {{ $t("message.hangqing.hangqing") }}
                </div>
              </div>
            </div>

            <!-- 热门币种卡片 -->
            <div class="top-cards-container">
              <div
                class="top-card-item"
                v-for="(item, index) in topListData"
                :key="index"
              >
                <div class="card-header">
                  <el-image
                    :src="handleSymbolImg(item.symbol)"
                    class="coin-icon"
                  >
                    <template #error>
                      <div class="image-slot">
                        <img
                          :src="`${ConfigURL.HOST_URL}/symbol/noCoins.png`"
                          class="coin-icon"
                        />
                      </div>
                    </template>
                  </el-image>
                  <span class="coin-name">{{ getName(item) }}</span>
                </div>

                <div style="display: flex; align-items: flex-end">
                  <div class="card-price">{{ item.close }}</div>
                  <div
                    class="card-change"
                    style="margin-left: 12px"
                    :class="item.changeRatio > 0 ? 'change-up' : 'change-down'"
                  >
                    {{ item.changeRatio > 0 ? "+" : "" }}{{ item.changeRatio }}%
                  </div>
                </div>

                <div class="card-volume">
                  {{ $t("message.hangqing.24hjiaoyiliang") }} {{ fixData(item.volume) }}
                </div>
              </div>
            </div>

            <div class="content_box">
              <!-- Tab导航和搜索 -->
              <div class="market-tabs-wrapper">
                <div class="market-tabs">
                  <div
                    class="market-tab-item"
                    @click="changeActiveType(item)"
                    v-for="item in marketList"
                    :key="item.type"
                    :class="{ 'tab-active': activeIndex == item.id }"
                  >
                    {{ item.name }}
                  </div>
                </div>

                <div class="market-search">
                  <div class="search-wrapper">
                    <div class="search-icon-prefix">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        class="search-icon"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M11 6a5 5 0 110 10 5 5 0 010-10zm0-3a8 8 0 017.021 11.838l3.07 3.07-1.59 1.591-1.591 1.591-3.07-3.07A8 8 0 1111 3z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </div>
                    <el-select
                      class="market-search-select"
                      v-model="searchValue"
                      filterable
                      remote
                      reserve-keyword
                      :placeholder="$t('message.hangqing.sousuo')"
                      :remote-method="remoteSearchMethod"
                      :loading="searchLoading"
                    >
                      <el-option
                        v-for="item in searchOptions"
                        :key="item.symbol"
                        :label="item.label"
                        :value="item.symbol"
                        @click.stop="goDetail(item.symbol, item)"
                      />
                    </el-select>
                  </div>
                </div>
              </div>

              <!-- 列表 -->
              <div class="content-view-box">
                <!-- Element UI 表格 -->
                <el-table
                  :data="searchList"
                  style="width: 100%"
                  :header-cell-style="{
                    background: '#fafafa',
                    color: '#707a8a',
                    fontSize: '12px',
                    fontWeight: '500',
                  }"
                  :row-style="{ cursor: 'pointer' }"
                >
                  <!-- 名称列 -->
                  <el-table-column
                    :label="$t('message.hangqing.mingcheng')"
                    width="250"
                    align="center"
                  >
                    <template #default="{ row }">
                      <div class="name-cell">
                        <!-- 收藏图标 -->
                        <div
                          class="star-icon"
                          @click.stop="
                            collectNameList.indexOf(row.symbol) >= 0
                              ? deleteCollectFun(row)
                              : collectFun(row)
                          "
                        >
                          <svg
                            v-if="collectNameList.indexOf(row.symbol) >= 0"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="#FDB022"
                            class="star-svg"
                          >
                            <path
                              d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                            />
                          </svg>
                          <svg
                            v-else
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#B7BDC6"
                            stroke-width="2"
                            class="star-svg"
                          >
                            <path
                              d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                            />
                          </svg>
                        </div>
                        <!-- 币种图标 -->
                        <el-image
                          :src="handleSymbolImg(row.symbol)"
                          class="coin-img"
                        >
                          <template #error>
                            <div class="image-slot">
                              <img
                                :src="`${ConfigURL.HOST_URL}/symbol/noCoins.png`"
                                class="coin-img"
                              />
                            </div>
                          </template>
                        </el-image>
                        <!-- 币种名称 -->
                        <span class="coin-name-text">{{ getName(row) }}</span>
                      </div>
                    </template>
                  </el-table-column>

                  <!-- 价格列 -->
                  <el-table-column
                    :label="$t('message.hangqing.jiage')"
                    align="center"
                  >
                    <template #default="{ row }">
                      <span class="price-text">${{ row.close }}</span>
                    </template>
                  </el-table-column>

                  <!-- 24H涨跌列 -->
                  <el-table-column
                    :label="$t('message.hangqing.24hzhangfu')"
                    align="center"
                  >
                    <template #default="{ row }">
                      <span
                        :class="row.changeRatio > 0 ? 'green' : 'red'"
                        class="change-text"
                      >
                        {{ row.changeRatio }}%
                      </span>
                    </template>
                  </el-table-column>

                  <!-- 24H交易量列 -->
                  <el-table-column
                    :label="$t('message.hangqing.24hjiaoyiliang')"
                    align="center"
                  >
                    <template #default="{ row }">
                      <span>{{ fixData(row.amount) }}</span>
                    </template>
                  </el-table-column>

                  <!-- 操作列 -->
                  <el-table-column label="" width="120" align="center">
                    <template #default="{ row }">
                      <el-button
                        type="primary"
                        size="small"
                        @click.stop="goDetail(row.symbol, row)"
                        class="trade-button"
                      >
                        {{ $t("message.hangqing.jiaoyi") }}
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>

                <!-- Element UI 分页器 -->
                <div class="pagination-container">
                  <el-pagination
                    v-model:current-page="currentPage"
                    :page-size="maxItemPage"
                    :total="total"
                    layout="prev, pager, next"
                    @current-change="OnclickPage"
                    background
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { fixData } from "@/utils/utils";
import { mapState } from "pinia";
import ConfigURL from "@/config/index";
import Axios from "@/api/currency";
import marketQuotesApi from "@/api/newApi/marketQuotes.js";
// import marketConfigApi from "@/api/newApi/marketConfig.js";
import { handleSymbolImg } from "@/utils";
import { useUserStore } from "@/store/user";
import { useLanguageStore } from "@/store/lang";

export default {
  data() {
    return {
      ConfigURL,
      fixData,
      topListData: [], //热门列表
      btnChooseIndex: 0,
      marketListType: "", //市场选择类型 美股 外汇，虚拟币...
      jsonArray: [], //所有行情
      activeList: [], //选择类型后的列表数据，用于展示
      activeIndex: 0, //选中类型的index
      allPage: 1, //总共页码
      maxItemPage: 13, //单页最大展示条数
      currentPage: 1, // 当前页码
      total: 0, // 总条数
      rankDataList: [], // 当前所属榜列表数据
      rankItem: {
        type: "changeRatio",
        sort: "up",
      }, //当前所选中的榜单对象,初始默认为涨幅榜
      rankIndex: 0, //当前所选中的榜单index
      searchValue: "",
      searchList: [],
      collectNameList: [],
      timer: [],
      controller: new AbortController(),
      intervalTimer1: [],
      searchLoading: false,
      searchOptions: [],
    };
  },
  computed: {
    ...mapState(useUserStore, ["existToken", "userInfo"]),
    ...mapState(useLanguageStore, ["language"]), // 直接获取state和getters
    // 市场列表 - 使用computed使其响应语言变化
    marketList() {
      return [
        {
          id: 0,
          name: this.$t("message.jiaoyi.zixuan"),
          type: "collect",
        },
        {
          id: 2,
          name: this.$t("message.user.shuzihuobi"),
          type: "cryptos",
        },
        {
          id: 4,
          name: this.$t("message.user.stocks"),
          type: "stocks",
        },
        {
          id: 3,
          name: this.$t("message.user.waihui"),
          type: "forex",
        },
      ];
    },
    // 涨幅榜 跌幅榜 成交量榜列表 - 使用computed使其响应语言变化
    rankTypeList() {
      return [
        {
          id: 0,
          name: this.$t("message.hangqing.zhangfubang"),
          type: "changeRatio",
          sort: "up",
        },
        {
          id: 1,
          name: this.$t("message.hangqing.diefubang"),
          type: "changeRatio",
          sort: "down",
        },
        {
          id: 2,
          name: this.$t("message.hangqing.chengjiaobang"),
          type: "volume",
          sort: "up",
        },
      ];
    },
  },
  mounted() {
    this.marketListType = this.marketList[1].type;
    this.activeIndex = this.marketList[1].id;
    this.controller = new AbortController();
    this.getPublicRealtimeByType();
    this.initGetPublicRealtimeTop();
    // this.getSymbol();
    // this.getItemOptionalList();
    window.scrollTo(0, 0);
  },
  methods: {
    handleSymbolImg,
    initGetPublicRealtimeByType() {
      this.cleanTime();
      this.getPublicRealtimeByType();
    },
    getPublicRealtimeByType() {
      
      if (this.marketListType == "collect") {
        this.fliterTypeData();
        return;
      }

      // 使用新API获取市场数据
      let apiCall;
      if (this.marketListType === "cryptos") {
        apiCall = marketQuotesApi.getCryptoQuotes({}, this.controller);
      } else if (this.marketListType === "forex") {
        apiCall = marketQuotesApi.getForexQuotes({}, this.controller);
      } else if (this.marketListType === "stocks") {
        apiCall = marketQuotesApi.getHomeStocksQuotes({}, this.controller);
      } else {
        // 如果是其他类型，清空列表
        this.jsonArray = [];
        this.total = 0;
        this.fliterTypeData();
        this.cleanTime();
        return;
      }

      apiCall
        .then((res) => {
          // 判断接口是否成功 (code === 0 且 success === true)
          if ((res.code === 0 || res.success === true) && res.data && res.data.tick_list) {
            // 转换数据格式
            this.jsonArray = res.data.tick_list.map(item => ({
              symbol: item.code,
              close: parseFloat(item.price).toFixed(6),
              changeRatio: ((Math.random() * 20) - 10).toFixed(2), // TODO: 需要真实的涨跌幅数据
              volume: parseFloat(item.volume),
              amount: parseFloat(item.turnover),
              type: this.marketListType
            }));
            // 获取总条数
            this.total = this.jsonArray.length;

            //筛选对应type
            this.fliterTypeData();
            this.cleanTime(); // 清除定时器
          } else {
            // 接口失败
            this.jsonArray = [];
            this.total = 0;
            this.fliterTypeData();
            this.cleanTime();
          }
        })
        .catch((error) => {
          console.error("Failed to fetch market data:", error);
          this.jsonArray = [];
          this.total = 0;
          this.fliterTypeData();
          this.cleanTime();
        });
    },
    async fliterTypeData() {
      if (this.marketListType == "collect") {
        await this.getItemOptionalList();
      } else {
        // 行情的展示数据
        // this.activeList = this.jsonArray.filter((val) => {
        //   return val.type == this.marketListType;
        // });
        this.activeList = [...this.jsonArray];
      }
      // //获取顶部热门
      //  await this.getPublicRealtimeTop()

      this.getPageSize();
      this.onInputSearch();
      // 右边榜单的数据
      let rankDataList = [...this.activeList].sort(
        this.compare(this.rankItem.type, this.rankItem.sort)
      );
      this.rankDataList = rankDataList.slice(0, this.maxItemPage);
    },
    compare(p, type) {
      //这是比较函数
      return function (m, n) {
        var a = m[p];
        var b = n[p];
        if (a == b) {
          return;
        }
        if (type == "up") {
          return b - a; //升序
        } else if (type == "down") {
          return a - b; //降序
        } else {
          return a - b;
        }
      };
    },
    initGetPublicRealtimeTop() {
      this.unbindTimerHandle();
      if (this.controller.signal.aborted) {
        return; // 中断接口之后退出事件不做处理
      }
      // 只调用一次，不再轮询
      this.getPublicRealtimeTop();
    },
    getPublicRealtimeTop() {
      return new Promise((reslove) => {
        if (this.marketListType === "collect") {
          this.topListData = this.activeList.slice(0, 4);
          reslove();
          return;
        }

        // 使用新API获取热门币种
        let apiCall;
        if (this.marketListType === "cryptos") {
          apiCall = marketQuotesApi.getCryptoQuotes({}, this.controller);
        } else if (this.marketListType === "forex") {
          apiCall = marketQuotesApi.getForexQuotes({}, this.controller);
        } else if (this.marketListType === "stocks") {
          apiCall = marketQuotesApi.getHomeStocksQuotes({}, this.controller);
        } else {
          // 如果是其他类型，从当前列表取前4条
          this.topListData = this.activeList.slice(0, 4);
          reslove();
          return;
        }

        apiCall
          .then((res) => {
            // 判断接口是否成功 (code === 0 且 success === true)
            if ((res.code === 0 || res.success === true) && res.data && res.data.tick_list && res.data.tick_list.length > 0) {
              // 转换数据格式
              this.topListData = res.data.tick_list.slice(0, 4).map(item => ({
                symbol: item.code,
                close: parseFloat(item.price).toFixed(6),
                changeRatio: ((Math.random() * 20) - 10).toFixed(2), // TODO: 需要真实的涨跌幅数据
                volume: parseFloat(item.volume),
                amount: parseFloat(item.turnover)
              }));
            } else {
              // 接口失败
              this.topListData = this.activeList.slice(0, 4);
            }
            reslove();
          })
          .catch((error) => {
            console.error("Failed to fetch top data:", error);
            this.topListData = this.activeList.slice(0, 4);
            reslove();
          });
      });
    },
    getPageSize() {
      let size = Math.ceil(this.total / this.maxItemPage);
      this.allPage = size < 1 ? 1 : size;
    },
    OnclickPage(page) {
      if (this.currentPage == page) {
        return;
      }
      this.currentPage = page;
      // this.getSymbol();
      this.initGetPublicRealtimeByType();
      this.initGetPublicRealtimeTop();
    },
    matchPage(index, currentPage) {
      let flag =
        index < currentPage * this.maxItemPage &&
        index >= (currentPage - 1) * this.maxItemPage;
      return flag;
    },
    changeActiveType(item) {
      this.marketListType = item.type;
      this.activeIndex = item.id;
      this.currentPage = 1;
      this.rankItem = this.rankTypeList[0];
      this.rankIndex = this.rankItem.id;
      // this.getSymbol();
      this.initGetPublicRealtimeByType();
      this.initGetPublicRealtimeTop();
      // this.fliterTypeData();
    },
    // 榜单切换
    changeTypeRank(item) {
      this.rankItem = item;
      this.rankIndex = item.id;
      this.rankDataList = [...this.activeList].sort(
        this.compare(this.rankItem.type, this.rankItem.sort)
      );
    },
    onInputSearch() {
      if (this.searchValue != "") {
        this.searchList = this.activeList.filter((val) => {
          return (
            val.symbol.toUpperCase().indexOf(this.searchValue.toUpperCase()) !=
            -1
          );
        });
        this.OnclickPage(1);
      } else {
        this.getPageSize();
        this.searchList = this.activeList;
      }
    },
    // 前端搜索 - 根据symbol/name过滤
    remoteSearchMethod(query) {
      if (query) {
        this.searchLoading = true;

        // 使用前端数据进行搜索过滤
        setTimeout(() => {
          this.searchOptions = this.activeList
            .filter(item => {
              const searchText = query.toUpperCase();
              return item.symbol.toUpperCase().includes(searchText);
            })
            .map(item => ({
              symbol: item.symbol,
              name: item.symbol, // 如果没有name字段，使用symbol
              type: item.type,
              label: item.symbol
            }))
            .slice(0, 20); // 限制搜索结果数量

          this.searchLoading = false;
        }, 100);
      } else {
        this.searchOptions = [];
      }
    },
    //获取自选币种列表
    getItemOptionalList() {
      return new Promise((resolve, reject) => {
        if (this.existToken) {
          Axios.getItemOptionalStatus().then((res) => {
            this.collectNameList = [];
            this.jsonArray = res.data.map((item) => {
              this.collectNameList.push(item.symbol);
              item.changeRatio = item.change_ratio;
              return item;
            });
            this.activeList = this.jsonArray;
            resolve();
          });
          // if (this.jsonArray.length) {
          //   this.activeList = this.jsonArray.filter((val) => {
          //     return this.collectNameList.includes(val.symbol);
          //   });
          // }
        } else {
          this.activeList = [];
          resolve();
        }
      });
    },
    //收藏
    collectFun(item) {
      let obj = {
        symbol: item.symbol,
      };

      if (this.existToken) {
        Axios.addItemUserOptiona(obj).then((res) => {
          this.$message({
            message: this.$t("message.jiaoyi.shoucangchenggong"),
            type: "success",
          });
          this.getItemOptionalList();
        });
      } else {
        this.$router.push("/login");
      }
    },
    //取消收藏
    deleteCollectFun(item) {
      let obj = {
        symbol: item.symbol,
      };
      Axios.deleteItemUserOptiona(obj).then((res) => {
        this.$message({
          message: this.$t("message.jiaoyi.quxiaoshoucangchenggong"),
          type: "success",
        });
        this.getItemOptionalList();
      });
    },
    getName(item) {
      return item.symbol.toUpperCase();
    },
    goDetail(symbol, item) {
      let RouterName = "sustainable"; //永续
      if (item.type == "cryptos") {
        this.$router.push({
          path: `coin/constract/${symbol}`,
          query: { timestamp: Date.now(), RouterName: RouterName },
        });
      } else if (item.type == "indices") {
        this.$router.push({
          path: `etf/constract/${symbol}`,
          query: { timestamp: Date.now(), RouterName: RouterName },
        });
      } else if (item.type == "forex") {
        this.$router.push({
          path: `forex/constract/${symbol}`,
          query: { timestamp: Date.now(), RouterName: RouterName },
        });
      } else if (item.type == "stocks") {
        this.$router.push({
          path: `stocks/constract/${symbol}`,
          query: { timestamp: Date.now(), RouterName: RouterName },
        });
      }
    },
    // 清除定时器
    cleanTime() {
      this.timer.forEach((item) => {
        if (item) {
          clearInterval(item);
        }
      });
    },
    // 清除定时器
    unbindTimerHandle() {
      this.intervalTimer1.forEach((item) => {
        if (item) {
          clearInterval(item);
        }
      });
    },
  },
  unmounted() {
    this.cleanTime();
    this.unbindTimerHandle();
    this.controller.abort();
  },
};
</script>

<style scoped lang="scss">
@import url("@/assets/css/market/bamarket.css");

/* 顶部热门卡片样式 */
.top-cards-container {
  display: flex;
  gap: 16px;
  padding: 32px 0;
  max-width: 1200px;
  margin: 0 auto;
}

.content_box {
  border: 1px solid #e9ecef;
  max-width: 1200px;
  margin: 0 auto;
}

.top-card-item {
  flex: 1;
  background: #ffffff;
  border: 1px solid #eaecef;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.coin-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.coin-name {
  font-weight: 500;
  font-size: 14px;
  color: #1e2329;
}

.card-price {
  font-size: 24px;
  font-weight: 600;
  color: #1e2329;
  margin-bottom: 8px;
  font-family: "DINNext", sans-serif;
}

.card-change {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;

  &.change-up {
    color: #0ecb81;
  }

  &.change-down {
    color: #f6465d;
  }
}

.card-volume {
  font-size: 12px;
  color: #707a8a;
}

/* Tab导航和搜索 */
.market-tabs-wrapper {
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 12px 12px;
  border-bottom: 1px solid #e9ecef;

  .market-tabs {
    display: flex;
    gap: 32px;
    // height: 26px;
  }
}

.market-tab-item {
  font-size: 16px;
  font-weight: 500;
  color: #707a8a;
  cursor: pointer;
  position: relative;
  transition: color 0.3s;

  &:hover {
    color: #1e2329;
  }

  &.tab-active {
    color: #1e2329;

    &::after {
      content: "";
      position: absolute;
      bottom: -20px;
      left: 0;
      right: 0;
      height: 2px;
      background: #1d91ff;
    }
  }
}

.market-search {
  position: relative;
  .search-wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;
    width: 280px;
  }

  .search-icon-prefix {
    position: absolute;
    left: 12px;
    z-index: 10;
    display: flex;
    align-items: center;
    pointer-events: none;
  }

  .search-icon {
    width: 16px;
    height: 16px;
    color: #b7bdc6;
  }

  :deep(.market-search-select) {
    width: 100%;

    .el-input {
      .el-input__wrapper {
        background: #ffffff;
        border: 1px solid #eaecef;
        border-radius: 20px;
        box-shadow: none;
        padding-left: 36px;
        height: 40px;

        &:hover {
          border-color: #b7bdc6;
        }
      }

      &.is-focus .el-input__wrapper {
        border-color: #1d91ff;
      }

      .el-input__inner {
        font-size: 14px;
        color: #1e2329;
        padding-left: 0;

        &::placeholder {
          color: #b7bdc6;
        }
      }

      .el-input__suffix {
        display: none;
      }
    }
  }
}

/* 分类筛选 */
.category-filter {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 12px;
  padding: 16px 0;
  flex-wrap: wrap;
}

.filter-item {
  padding: 8px 16px;
  background: #fafafa;
  border-radius: 20px;
  font-size: 14px;
  color: #5e6673;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background: #f0f1f2;
  }

  &.active {
    background: #fef6d8;
    color: #c99400;
    font-weight: 500;
  }
}

.filter-icon {
  font-size: 16px;
}

/* 列表样式优化 */
.content-view-box {
  max-width: 1200px;
  margin: 0px auto 0;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  padding: 0;
}

/* Element UI 表格样式定制 */
:deep(.el-table) {
  font-size: 14px;

  .el-table__header-wrapper {
    .el-table__header {
      th {
        border-bottom: 1px solid #eaecef;
      }
    }
  }

  .el-table__body-wrapper {
    .el-table__body {
      tr {
        &:hover > td {
          background: #fafafa !important;
        }

        td {
          border-bottom: 1px solid #eaecef;
          padding: 16px 0;
        }
      }
    }
  }

  .el-table__cell {
    padding: 12px 16px;
  }
}

/* 名称单元格样式 */
.name-cell {
  display: flex;
  padding-left: 24px;
  gap: 8px;
}

.star-icon {
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.15);
  }

  img {
    width: 20px;
    height: 20px;
  }

  .star-svg {
    width: 18px;
    height: 18px;
    transition: all 0.2s;
  }
}

.coin-img {
  width: 26px;
  height: 26px;
  border-radius: 50%;
}

.coin-name-text {
  font-size: 14px;
  font-weight: 500;
  color: #1e2329;
}

/* 价格文本样式 */
.price-text {
  font-size: 14px;
  color: #1e2329;
  font-family: "DINNext", sans-serif;
}

/* 涨跌幅样式 */
.change-text {
  font-size: 14px;
  font-weight: 500;
}

.green {
  color: #0ecb81;
}

.red {
  color: #f6465d;
}

/* 交易按钮样式 */
.trade-button {
  padding: 6px 16px;
  font-size: 14px;
}

/* 分页器容器 */
.pagination-container {
  display: flex;
  justify-content: center;
  padding: 24px 0;
  background: white;
}

:deep(.el-pagination) {
  .btn-prev,
  .btn-next {
    background: white;
    border: 1px solid #eaecef;

    &:hover:not(:disabled) {
      color: #1d91ff;
    }
  }

  .el-pager {
    li {
      background: white;
      border: 1px solid #eaecef;
      margin: 0 4px;

      &:hover {
        color: #1d91ff;
      }

      &.is-active {
        background: #1d91ff;
        color: white;
        border-color: #1d91ff;
      }
    }
  }
}

.tab-item {
  padding-top: 20px !important;
  padding-bottom: 10px !important;
  cursor: pointer;
}

.content-view-box-img {
  margin-right: 19px;
  &:nth-last-child(1) {
    margin-right: 0;
  }
}
:deep(.search-select) {
  .el-input.is-focus {
    .el-input__wrapper {
      box-shadow: none !important;
    }
  }
  .el-input {
    height: 42px;
    .el-input__wrapper {
      box-shadow: none !important;
    }
  }
}
</style>
