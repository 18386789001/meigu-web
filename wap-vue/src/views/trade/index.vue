<template>
  <section class="pb-fix">
    <van-loading color="#1194F7" class="loading-box" v-if="isLoading" />
    <div class="trade-container-box">
      <header class="header">
        <div class="flex-l">
          <span class="title">{{ t("trade") }}</span>
        </div>
      </header>
      <section class="trade-tab-container">
        <van-tabs v-model:active="tabActive" shrink @click-tab="onClickTab">
          <van-tab v-for="(item, index) in listTab" :key="item.tabIndex" :name="item.tabIndex" :title="item.title">
            <div class="content-container">
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
              <div class="asset">
                <div class="line">
                  <div class="flex-l">
                    <p v-if="item.type === 'Etf'">{{ t("ETFTotalAssets") }}</p>
                    <p v-if="item.type === 'Cryptos'">{{ t("TotalCryptocurrencyAssets") }}</p>
                    <p v-if="item.type === 'Foreign'">{{ t("TotalForeignExchangeAssets") }}</p>
                    <p v-if="item.type === 'Futures'">{{ t("Futures Total assets") }}</p>
                    <p v-if="item.type === 'UsStock'">{{ t("Stock Total assets") }}</p>
                    <p v-if="item.type === 'HkStock'">{{ t('Stock Total assets') }}</p>
                    <p v-if="item.type === 'TWStock'">{{ t('Stock Total assets') }}</p>
                    <p v-if="item.type === 'JPStock'">{{ t('Stock Total assets') }}</p>
                    <p v-if="item.type === 'AStock'">{{ t('Stock Total assets') }}</p>
                    <p v-if="item.type === 'MyStock'">{{ t('马股总资产') }}</p>
                    <p v-if="item.type === 'INDIAStock'">{{ t('Stock Total assets') }}</p>
                    <p v-if="item.type === 'UK-stocks'">{{ t('Stock Total assets') }}</p>
                    <p v-if="item.type === 'DE-stocks'">{{ t('Stock Total assets') }}</p>
                    <p v-if="item.type === 'BZ-stocks'">{{ t('Stock Total assets') }}</p>
                    <p class="value">
                      {{
                        currency?.currency_symbol || ''
                      }}
                      {{
                        assetsObj.totalAssets
                        ? (assetsObj.totalAssets * (currency?.rate ?? 0)).toFixed(2)
                        : "0"
                      }}
                    </p>
                  </div>
                  <div class="flex-r">
                    <p v-if="item.type === 'Etf'">{{ t("ETFFloatingProfitAndLoss") }}</p>
                    <p v-if="item.type === 'Cryptos'">{{ t("AmoCryptoLssunt") }}</p>
                    <p v-if="item.type === 'Foreign'">{{ t("ForeignExchangeLoss") }}</p>
                    <p v-if="item.type === 'Futures'">{{ t("Futures Loss") }}</p>
                    <p v-if="item.type === 'UsStock'">{{ t("Stock Loss") }}</p>
                    <p v-if="item.type === 'HkStock'">{{ t('Stock Loss') }}</p>
                    <p v-if="item.type === 'TWStock'">{{ t('Stock Loss') }}</p>
                    <p v-if="item.type === 'JPStock'">{{ t('Stock Loss') }}</p>
                    <p v-if="item.type === 'AStock'">{{ t('Stock Loss') }}</p>
                    <p v-if="item.type === 'MyStock'">{{ t('马股浮动盈亏') }}</p>
                    <p v-if="item.type === 'INDIAStock'">{{ t('Stock Loss') }}</p>
                    <p v-if="item.type === 'UK-stocks'">{{ t('Stock Loss') }}</p>
                    <p v-if="item.type === 'DE-stocks'">{{ t('Stock Loss') }}</p>
                    <p v-if="item.type === 'BZ-stocks'">{{ t('Stock Loss') }}</p>
                    <p class="profit red">
                      {{
                        currency?.currency_symbol || ''
                      }}
                      {{
                        assetsObj.profit
                        ? (assetsObj.profit * (currency?.rate ?? 0)).toFixed(2)
                        : "0"
                      }}
                    </p>
                  </div>
                </div>
                <div class="line">
                  <div class="flex-l">
                    <p v-if="item.type === 'Etf'">{{ t("ETFAvailableBalance") }}</p>
                    <p v-if="item.type === 'Cryptos'">{{ t("CryptocurrenciesBalance") }}</p>
                    <p v-if="item.type === 'Foreign'">{{ t("foreignBlance") }}</p>
                    <p v-if="item.type === 'Futures'">{{ t("Futures Balance") }}</p>
                    <p v-if="item.type === 'UsStock'">{{ t("Stock Balance") }}</p>
                    <p v-if="item.type === 'HkStock'">{{ t('Stock Balance') }}</p>
                    <p v-if="item.type === 'TWStock'">{{ t('Stock Balance') }}</p>
                    <p v-if="item.type === 'JPStock'">{{ t('Stock Balance') }}</p>
                    <p v-if="item.type === 'AStock'">{{ t('Stock Balance') }}</p>
                    <p v-if="item.type === 'MyStock'">{{ t('马股可用余额') }}</p>
                    <p v-if="item.type === 'INDIAStock'">{{ t('Stock Balance') }}</p>
                    <p v-if="item.type === 'UK-stocks'">{{ t('Stock Balance') }}</p>
                    <p v-if="item.type === 'DE-stocks'">{{ t('Stock Balance') }}</p>
                    <p v-if="item.type === 'BZ-stocks'">{{ t('Stock Balance') }}</p>
                    <p class="value">
                      {{
                        currency?.currency_symbol || ''
                      }}
                      {{
                        assetsObj.usdtBalance
                        ? (assetsObj.usdtBalance * (currency?.rate ?? 0)).toFixed(2)
                        : "0"
                      }}
                    </p>
                  </div>
                  <div class="flex-r">
                    <p v-if="item.type === 'Etf'">{{ t("ETFTheDay") }}</p>
                    <p v-if="item.type === 'Cryptos'">{{ t("Cryptocurrencyday") }}</p>
                    <p v-if="item.type === 'Foreign'">{{ t("ForeignDay") }}</p>
                    <p v-if="item.type === 'Futures'">{{ t("Futures Profit Day") }}</p>
                    <p v-if="item.type === 'UsStock'">{{ t("Stock Profit Day") }}</p>
                    <p v-if="item.type === 'HkStock'">{{ t('Stock Profit Day') }}</p>
                    <p v-if="item.type === 'TWStock'">{{ t('Stock Profit Day') }}</p>
                    <p v-if="item.type === 'JPStock'">{{ t('Stock Profit Day') }}</p>
                    <p v-if="item.type === 'AStock'">{{ t('Stock Profit Day') }}</p>
                    <p v-if="item.type === 'MyStock'">{{ t('马股当日盈亏') }}</p>
                    <p v-if="item.type === 'INDIAStock'">{{ t('Stock Profit Day') }}</p>
                    <p v-if="item.type === 'UK-stocks'">{{ t('Stock Profit Day') }}</p>
                    <p v-if="item.type === 'DE-stocks'">{{ t('Stock Profit Day') }}</p>
                    <p v-if="item.type === 'BZ-stocks'">{{ t('Stock Profit Day') }}</p>
                    <p class="profit red">
                      {{
                        currency?.currency_symbol || ''
                      }}
                      {{
                        assetsObj.profitToday
                        ? (assetsObj.profitToday * (currency?.rate ?? 0)).toFixed(2)
                        : "0"
                      }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </van-tab>
        </van-tabs>
      </section>
      <section class="content-container">
        <ex-nav :symbolType="symbolType" />
        <div class="quickly">
          <div class="quickBox chongbi" :class="[thStore.theme == 'dark' ? 'dark' : 'white']"
            @click="$router.push('/exchange/channel-in')">
            <div class="left">
 
              <div class="leftCont">
                <p style="max-width: 100px" class="color-white">{{ $t("快捷充值") }}</p>
              </div>
            </div>
            <div class="right">
              <img v-if="thStore.theme == 'dark'" src="@/assets/theme/dark/image/goto.png" alt="" />
              <img v-else src="@/assets/theme/white/image/goto.png" alt="" />
            </div>
          </div>
          <div class="quickBox tibi ml-10" :class="[thStore.theme == 'dark' ? 'dark' : 'white']"
            @click="$router.push('/exchange/channel-out')">
            <div class="left">

              <div class="leftCont">
                <p style="max-width: 100px">{{ $t("FastWithdrawal") }}</p>
              </div>
            </div>
            <div class="right">
              <img v-if="thStore.theme == 'dark'" src="@/assets/theme/dark/image/goto.png" alt="" />
              <img v-else src="@/assets/theme/white/image/goto.png" alt="" />
            </div>
          </div>
        </div>
      </section>
      <div class="indicator-index-container">
        <div class="indicator-index-box">
          <div class="flex-l">
            <ul>
              <li :class="{ active: navActive === index }" v-for="(item, index) in navTabList" :key="index"
                @click="handleChangeNav(item.index)">
                {{ item.text }}
              </li>
            </ul>
          </div>
          <!-- 加密货币页签的现货切换按钮 -->
          <div v-if="tabActive === 1" class="spot-switch-container">
            <div class="spot-switch">
              <button 
                :class="{ active: spotMode === 'perpetual' }" 
                @click="switchSpotMode('perpetual')"
                class="switch-btn perpetual-btn"
              >
                <span class="btn-text">{{ t('合约') }}</span>
              </button>
              <button 
                :class="{ active: spotMode === 'spot' }" 
                @click="switchSpotMode('spot')"
                class="switch-btn spot-btn"
              >
                <span class="btn-text">{{ t('现货') }}</span>
              </button>
            </div>
          </div>
          <!-- 大宗商品页签的合约现货切换按钮 -->
          <div v-if="tabActive === 0" class="spot-switch-container">
            <div class="spot-switch">
              <button 
                :class="{ active: futuresMode === 'contract' }" 
                @click="switchFuturesMode('contract')"
                class="switch-btn contract-btn"
              >
                <span class="btn-text">{{ t('合约') }}</span>
              </button>
              <button 
                :class="{ active: futuresMode === 'spot' }" 
                @click="switchFuturesMode('spot')"
                class="switch-btn spot-btn"
              >
                <span class="btn-text">{{ t('现货') }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <section class="etf-container">
        <div class="all-etf-ranking" v-if="!([1, 2].includes(tabActive))">
          <div class="etf-table">
            <ul v-if="navActive === 0">
              <li class="title-line">
                <div class="flex-l">
                  <p>{{ t("marketValue") }}</p>
                </div>
                <div class="flex-r">
                  <div class="flex-r-item">
                    <p>{{ t("盈亏") }}</p>
                  </div>
                  <div class="flex-r-item">
                    <p>{{ t("openAvailable") }}</p>
                  </div>
                  <div class="flex-r-item">
                    <p>{{ t("costCurrentPrice") }}</p>
                  </div>
                </div>
              </li>
            </ul>
            <ul v-if="navActive === 1">
              <li class="title-line">
                <div class="flex-l">
                  <p>{{ t("委托时间") }}</p>
                </div>
                <div class="flex-r">
                  <div class="flex-r-item">
                    <p>{{ t("EntrustmentTransactionPrice") }}</p>
                  </div>
                  <div class="flex-r-item">
                    <p>{{ t("OrderQuantity") }}</p>
                  </div>
                  <div class="flex-r-item">
                    <p>{{ t("状态") }}</p>
                  </div>
                  <div class="flex-r-item">
                    <p>{{ t("操作") }}</p>
                  </div>
                </div>
              </li>
            </ul>
            <ul v-if="navActive === 2">
              <li class="title-line">
                <div class="flex-l">
                  <p>{{ t("成交时间") }}</p>
                </div>
                <div class="flex-r">
                  <div class="flex-r-item">
                    <p>{{ t("成交价格") }}</p>
                  </div>
                  <div class="flex-r-item">
                    <p>{{ t("成交量") }}</p>
                  </div>
                  <div class="flex-r-item">
                    <p>{{ t("状态") }}</p>
                  </div>
                </div>
              </li>
            </ul>
            <ul v-if="navActive === 3">
              <li class="title-line">
                <div class="flex-l flex items-center">
                  <p>{{ t("stockCode") }}</p>
                </div>
                <div class="flex-r">
                  <div class="flex-r-item">
                    <p>{{ t("现价") }}</p>
                  </div>
                  <div class="flex-r-item">
                    <p>{{ t("涨跌幅") }}</p>
                  </div>
                  <div class="flex-r-item">
                    <p>{{ t("changeHands") }}</p>
                  </div>
                  <div class="flex-r-item">
                    <p>{{ t("aavolumeRatioa") }}</p>
                  </div>
                </div>
              </li>
            </ul>
            <ul v-if="etfList.length !== 0">
              <li v-for="(item, index) in etfList" :key="`${item.symbol}${index}`"
                @click="itemClickOneOrThirdly(item, navActive)">
                <template v-if="navActive == 0 || navActive == 5">
                  <div class="flex-l">
                    <p>{{ item.symbol }}</p>
                    <p class="gray-text">{{ item.marketValue }}</p>
                  </div>
                  <div class="flex-r">
                    <div class="flex-r-item">
                      <p :class="item.profitLoss < 1 ? 'text-up' : 'text-down'">
                        {{ item.profitLoss }}
                      </p>
                      <p :class="item.profitLossPercentage < 1 ? 'text-up' : 'text-down'">
                        {{
                          item.profitLossPercentage && item.profitLossPercentage !== 0
                          ? `${item.profitLossPercentage}%`
                          : 0
                        }}
                      </p>
                    </div>
                    <div class="flex-r-item">
                      <p :class="item.close < 1 ? 'text-up' : 'text-down'">
                        {{ item.positionVolume }}
                      </p>
                      <p :class="item.close < 1 ? 'text-up' : 'text-down'">
                        {{ item.volume }}
                      </p>
                    </div>
                    <div class="flex-r-item">
                      <p :class="item.close < 1 ? 'text-up' : 'text-down'">
                        {{ item.price }}
                      </p>
                      <p :class="item.close < 1 ? 'text-up' : 'text-down'">
                        {{ item.currentPrice }}
                      </p>
                    </div>
                  </div>
                </template>
                <template v-if="navActive == 1">
                  <div class="flex-l">
                    <p>{{ item.symbol }}</p>
                    <p class="gray-text">
                      <span class="tip-text" :class="item.offset === 'close' ? 'text-down' : 'text-up'">{{
                        item.offset ===
                        "open" ? t("买") : t("卖")
                      }}</span>
                      {{
                        item.create_time_ts
                        ? dayjs(item.create_time_ts * 1000)
                          .format("YYYY-MM-DD HH:mm:ss")
                          .slice(11)
                        : "--"
                      }}
                    </p>
                  </div>
                  <div class="flex-r">
                    <div class="flex-r-item">
                      <p :class="item.open < 1 ? 'text-up' : 'text-down'">
                        {{ item.price }}
                      </p>
                      <p :class="item.open < 1 ? 'text-up' : 'text-down'">
                        {{ item.closePrice }}
                      </p>
                    </div>
                    <div class="flex-r-item">
                      <p :class="item.close < 1 ? 'text-up' : 'text-down'">
                        {{ item.volume }}
                      </p>
                    </div>
                    <div class="flex-r-item">
                      <p>
                        {{ item.state === "created" ? t("createdNew") : t(item.state) }}
                      </p>
                    </div>
                    <div class="flex-r-item operate-btn" @click="cancelSingle(item.order_no)">
                      <span>{{ t("撤单") }}</span>
                    </div>
                  </div>
                </template>
                <template v-if="navActive == 2">
                  <div class="flex-l">
                    <p>{{ item.symbol }}</p>
                    <p class="gray-text">
                      <span class="tip-text" :class="item.offset === 'close' ? 'text-down' : 'text-up'">{{
                        item.offset ===
                        "open" ? t("买") : t("卖")
                      }}</span>
                      {{
                        item.create_time_ts
                        ? dayjs(item.create_time_ts * 1000)
                          .format("YYYY-MM-DD HH:mm:ss")
                          .slice(11)
                        : "--"
                      }}
                    </p>
                  </div>
                  <div class="flex-r">
                    <div class="flex-r-item">
                      <p :class="item.open < 1 ? 'text-up' : 'text-down'">
                        {{ item.price }}
                      </p>
                    </div>
                    <div class="flex-r-item">
                      <p :class="item.close < 1 ? 'text-up' : 'text-down'">
                        {{ item.volume }}
                      </p>
                    </div>
                    <div class="flex-r-item">
                      <p>
                        {{ item.state === "created" ? t("委托完成") : t(item.state) }}
                      </p>
                    </div>
                  </div>
                </template>
                <template v-if="navActive == 3">
                  <div class="flex-l">
                    <p>{{ item.name }}</p>
                    <p class="gray-text">{{ item.symbol }}</p>
                  </div>
                  <div class="flex-r">
                    <div class="flex-r-item">
                      <p :class="item.close < 200 ? 'text-up' : 'text-down'">
                        {{ item.close }}
                      </p>
                    </div>
                    <div class="flex-r-item">
                      <p :class="item.changeRatio < 1 ? 'text-up' : 'text-down'">
                        {{
                          item.changeRatio === 0
                          ? 0
                          : item.changeRatio
                            ? item.changeRatio + "%"
                            : "--"
                        }}
                      </p>
                    </div>
                    <div class="flex-r-item">
                      <p>
                        {{
                          item.turnoverRate === 0
                          ? 0
                          : item.turnoverRate
                            ? item.turnoverRate + "%"
                            : "--"
                        }}
                      </p>
                    </div>
                    <div class="flex-r-item" :class="item.volumeRatio < 0.5 ? 'text-up' : 'text-down'">
                      <p>
                        {{
                          item.volumeRatio === 0
                          ? 0
                          : item.volumeRatio
                            ? item.volumeRatio + "%"
                            : "--"
                        }}
                      </p>
                    </div>
                  </div>
                </template>
              </li>
            </ul>
            <div class="flex flex-col justify-center pt-50 pb-20 items-center" v-else>
              <img src="@/assets/image/assets-center/no-data.png" alt="" class="no-data-img" />
              <p class="text-grey mt-10 text-24">{{ $t("暂无记录") }}</p>
            </div>
          </div>
        </div>
      </section>
      <div class="symbol-list" v-if="tabActive === 1 || tabActive === 2">
        <!-- 现货模式的数据显示 -->
        <div v-if="tabActive === 1 && spotMode === 'spot'" class="spot-data-container">
          <!-- 现货持仓 -->
          <div v-if="navActive === 0" class="spot-positions">
            <div class="flex flex-col justify-center pt-50 pb-20 items-center" v-if="spotPositions.length === 0">
              <img src="@/assets/image/assets-center/no-data.png" alt="" class="no-data-img" />
              <p class="text-grey mt-10 text-24">{{ $t("暂无记录") }}</p>
            </div>
            <div v-else class="spot-assets-list">
              <div class="spot-asset-item" v-for="item in spotPositions" :key="item.symbol">
                <div class="flex justify-between items-center">
                  <div class="flex items-center">
                    <img :src="getSpotIconSrc(item.symbol)" 
                      class="spot-icon rounded-full" />
                    <div class="text-grey symbol-name text-30 textColor2 ml-5">
                      {{ item.symbol.toUpperCase() }}/USDT
                    </div>
                  </div>
                  <div class="flex-col text-30 text-right">
                    <div class="textColor" v-if="item.symbol == 'btc'">
                      {{ item.volume ? Number(item.volume).toFixed(8) : "0.0" }}
                    </div>
                    <div class="textColor" v-else-if="item.symbol == 'eth'">
                      {{ item.volume ? Number(item.volume).toFixed(8) : "0.0" }}
                    </div>
                    <div class="textColor" v-else-if="item.symbol == 'usdt'">
                      {{ item.volume ? Number(item.volume).toFixed(2) : "0.0" }}
                    </div>
                    <div class="textColor" v-else>
                      {{ item.volume ? Number(item.volume).toFixed(8) : "0.0" }}
                    </div>
                    <div class="text-grey text-30 mb-0">
                      ≈{{ currency?.currency_symbol || '$' }}
                      {{ item.usdt ? Number(item.usdt).toFixed(2) : "0.0" }}
                    </div>
                  </div>
                </div>
                <div class="flex justify-between mt-10 pl-3">
                  <div class="flex-col text-30">
                    <div class="text-grey">{{ $t("可用") }}</div>
                    <div class="textColor" v-if="item.symbol == 'btc'">
                      {{ item.usable ? Number(item.usable).toFixed(8) : "0.0" }}
                    </div>
                    <div class="textColor" v-else-if="item.symbol == 'eth'">
                      {{ item.usable ? Number(item.usable).toFixed(8) : "0.0" }}
                    </div>
                    <div class="textColor" v-else-if="item.symbol == 'usdt'">
                      {{ item.usable ? Number(item.usable).toFixed(2) : "0.0" }}
                    </div>
                    <div class="textColor" v-else>
                      {{ item.usable ? Number(item.usable).toFixed(8) : "0.0" }}
                    </div>
                  </div>
                  <div class="flex-col text-30">
                    <div class="text-grey">{{ $t("锁仓") }}</div>
                    <div class="textColor" v-if="item.symbol === 'btc'">
                      {{ item.lock_amount ? Number(item.lock_amount).toFixed(8) : "0.0" }}
                    </div>
                    <div class="textColor" v-else-if="item.symbol === 'eth'">
                      {{ item.lock_amount ? Number(item.lock_amount).toFixed(8) : "0.0" }}
                    </div>
                    <div class="textColor" v-else-if="item.symbol == 'usdt'">
                      {{ item.lock_amount ? Number(item.lock_amount).toFixed(2) : "0.0" }}
                    </div>
                    <div class="textColor" v-else>
                      {{ item.lock_amount ? Number(item.lock_amount).toFixed(8) : "0.0" }}
                    </div>
                  </div>
                  <div class="flex-col text-30 text-right">
                    <div class="text-grey">{{ $t("冻结") }}</div>
                    <div class="textColor" v-if="item.symbol == 'btc'">
                      {{ Number(item.frozenAmount + item.freeze_amount).toFixed(8) || "0.0" }}
                    </div>
                    <div class="textColor" v-else-if="item.symbol == 'eth'">
                      {{ Number(item.frozenAmount + item.freeze_amount).toFixed(8) || "0.0" }}
                    </div>
                    <div class="textColor" v-else-if="item.symbol == 'usdt'">
                      {{ Number(item.frozenAmount + item.freeze_amount).toFixed(2) || "0.0" }}
                    </div>
                    <div class="textColor" v-else>
                      {{ Number(item.frozenAmount + item.freeze_amount).toFixed(8) || "0.0" }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 现货委托订单 -->
          <div v-if="navActive === 1" class="spot-orders">
            <!-- 币种选择器 -->
            <div class="symbol-selector-container">
              <div class="symbol-selector" @click="toggleSymbolSelector">
                <span class="symbol-text">{{ selectedSymbol.toUpperCase() }}</span>
                <van-icon name="arrow-down" class="arrow-icon" />
                <!-- 下拉选项 -->
                <div v-if="showSymbolSelector" class="symbol-dropdown">
                  <div 
                    v-for="symbol in availableSymbols" 
                    :key="symbol"
                    class="symbol-option"
                    @click.stop="selectSymbol(symbol)"
                  >
                    {{ symbol.toUpperCase() }}
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 委托订单列表 -->
            <div v-if="spotOrders.length === 0" class="no-data-container">
              <img src="@/assets/image/assets-center/no-data.png" alt="" class="no-data-img" />
              <p class="text-grey mt-10 text-24">{{ $t("暂无记录") }}</p>
            </div>
            
            <div v-else class="orders-list">
              <div v-for="order in spotOrders" :key="order.order_no" class="order-item">
                <div class="order-header">
                  <div class="order-type">
                    <span :class="order.offset === 'open' ? 'text-green' : 'text-red'">
                      {{ getOrderTypeText(order.order_price_type, order.offset) }}
                    </span>
                    <span class="symbol-name">{{ order.name || `${order.symbol.toUpperCase()}/USDT` }}</span>
                  </div>
                  <div class="order-time">{{ order.create_time || '--' }}</div>
                </div>
                
                <div class="order-content">
                  <div class="order-progress">
                    <div class="progress-circle">
                      <div class="progress-text">0%</div>
                    </div>
                    <div class="order-details">
                      <div class="detail-row">
                        <span class="label">{{ $t('数量') }}</span>
                        <span class="value">0/{{ order.volume || '--' }}</span>
                      </div>
                      <div class="detail-row">
                        <span class="label">{{ $t('价格') }}</span>
                        <span class="value">{{ order.price || '--' }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="order-actions">
                    <button class="action-btn detail-btn" @click="goOrderDetail(order.order_no)">
                      {{ $t('详情') }}
                    </button>
                    <button 
                      v-if="order.state === 'submitted'" 
                      class="action-btn cancel-btn" 
                      @click="cancelOrder(order.order_no)"
                    >
                      {{ $t('撤单') }}
                    </button>
                    <button 
                      v-else-if="order.state === 'created'" 
                      class="action-btn completed-btn"
                    >
                      {{ $t('已完成') }}
                    </button>
                    <button 
                      v-else-if="order.state === 'canceled'" 
                      class="action-btn canceled-btn"
                    >
                      {{ $t('已取消') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 现货历史记录 -->
          <div v-if="navActive === 2" class="spot-history">
            <!-- 币种选择器 -->
            <div class="symbol-selector-container">
              <div class="symbol-selector" @click="toggleSymbolSelector">
                <span class="symbol-text">{{ selectedSymbol.toUpperCase() }}</span>
                <van-icon name="arrow-down" class="arrow-icon" />
                <!-- 下拉选项 -->
                <div v-if="showSymbolSelector" class="symbol-dropdown">
                  <div 
                    v-for="symbol in availableSymbols" 
                    :key="symbol"
                    class="symbol-option"
                    @click.stop="selectSymbol(symbol)"
                  >
                    {{ symbol.toUpperCase() }}
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 历史记录列表 -->
            <div v-if="spotHistory.length === 0" class="no-data-container">
              <img src="@/assets/image/assets-center/no-data.png" alt="" class="no-data-img" />
              <p class="text-grey mt-10 text-24">{{ $t("暂无记录") }}</p>
            </div>
            
            <div v-else class="history-list">
              <div v-for="order in spotHistory" :key="order.order_no" class="history-item">
                <div class="history-header">
                  <div class="history-type">
                    <span :class="order.offset === 'open' ? 'text-green' : 'text-red'">
                      {{ getOrderTypeText(order.order_price_type, order.offset) }}
                    </span>
                    <span class="symbol-name">{{ order.name || `${order.symbol.toUpperCase()}/USDT` }}</span>
                  </div>
                  <div class="history-status" @click="goOrderDetail(order.order_no)">
                    <span class="status-text">{{ getOrderStatusText(order.state) }}</span>
                    <van-icon name="arrow" class="arrow-icon" />
                  </div>
                </div>
                
                <div class="history-content">
                  <div class="info-row">
                    <div class="info-item">
                      <span class="label">{{ $t('时间') }}</span>
                      <span class="value">{{ order.create_time ? order.create_time.substring(5) : '--' }}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">{{ $t('委托价') }}（USDT）</span>
                      <span class="value">{{ order.price || '--' }}</span>
                    </div>
                  </div>
                  
                  <div class="info-row">
                    <div class="info-item">
                      <span class="label">{{ $t('交易额') }}（USDT）</span>
                      <span class="value">{{ order.total || '--' }}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">{{ $t('成交总额') }}（USDT）</span>
                      <span class="value">{{ order.total || '--' }}</span>
                    </div>
                  </div>
                  
                  <div class="info-row">
                    <div class="info-item">
                      <span class="label">{{ $t('成交均价') }}（USDT）</span>
                      <span class="value">{{ order.closePrice || order.price || '--' }}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">{{ $t('成交量') }}（{{ order.symbol.toUpperCase() }}）</span>
                      <span class="value">{{ order.volume || '--' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 永续合约模式的数据显示 -->
        <div class="flex flex-col justify-center pt-50 pb-20 items-center" v-if="symbolList.length === 0">
          <img src="@/assets/image/assets-center/no-data.png" alt="" class="no-data-img" />
          <p class="text-grey mt-10 text-24">{{ $t("暂无记录") }}</p>
        </div>
        <ul v-else>
          <li class="symbol-list-item" v-for="item in symbolList" :key="item" @click="itemClickSecondOrFourth(item)">
            <div class="symbol-list-top">
              <div class="item-l flex-1">
                <p class="symbol-name">{{ item.name }}</p>
                <p class="price-change" v-if="navActive !== 1">
                  <span class="price-l">{{ item.trade_avg_price }}</span>
                  <span class="arrow">→</span>
                  <span :class="{
                    'price-r': true,
                    green: item.mark_price - item.trade_avg_price > 0,
                    red: item.mark_price - item.trade_avg_price < 0,
                  }">{{ item.mark_price }}</span>
                </p>
                <p class="price-change" v-else>
                  <span class="price-l">{{ item.price }}</span>
                  <span class="arrow">→</span>
                  <span :class="{
                    'price-r': true,
                    green: item.mark_price - item.price > 0,
                    red: item.mark_price - item.price < 0,
                  }">{{ item.mark_price ?? "--" }}</span>
                </p>
              </div>
              <div class="item-r flex-1">
                <p class="tile">
                  {{ item?.order_price_type === "opponent" ? t("市价") : t("限价") }}
                </p>
                <div class="volume-box">
                  <div :class="{
                    volume: true,
                    'green-border': item.direction === 'buy',
                    'red-border': item.direction !== 'buy',
                  }">
                    <span :class="{
                      'volume-l': true,
                      'green-bg': item.direction === 'buy',
                      'red-bg': item.direction !== 'buy',
                    }">{{ item.direction == "buy" ? t("Buy") : t("Sell") }}</span>
                    <span :class="{
                      'volume-r': true,
                      green: item.direction === 'buy',
                      red: item.direction !== 'buy',
                    }">
                      {{
                        `${item.volume_open / (item.lever_rate ?? 1)} * ${item.lever_rate ?? 1
                        } x`
                      }}
                      {{ t("volume") }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="symbol-list-bottom">
              <div class="bottom-l flex-1">
                <div class="order-info">
                  <p class="margin">{{ t("margin") }}: {{ item.deposit }}</p>
                  <p class="id">{{ t("orderId") }}: #{{ item.order_no }}</p>
                  <p class="date">{{ item.create_time }}</p>
                </div>
              </div>
              <div class="bottom-r">
                <p :class="{
                  'profit-num': true,
                  green: item.profit > 0,
                  red: item.profit < 0,
                }">
                  {{ item.profit }}
                </p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, computed } from "vue";
import { useUserStore } from "@/store/user";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import ExNav from "@/components/trade/ex-nav/index.vue";
import useClipboard from "vue-clipboard3";
import { showToast } from "vant";
import { getStorage } from "@/utils";
import {
  _getETFList,
  _contractApplyOrder,
  getExchangeApplyHisList,
  getExchangeApplyOrderList,
  _getOptionalList,
} from "@/service/etf.api";
import { watch } from "vue";
import { contractOrder } from "@/service/trade.api";
import TradeApi from "@/service/trading.js";
import { _assetsTradeTop } from "@/service/user.api";
import request from "@/service/request";
import dayjs from "dayjs";
import { themeStore } from "@/store/theme";
import { useStore } from 'vuex';

const thStore = themeStore();
const store = useStore()
const { t } = useI18n();
const { toClipboard } = useClipboard();
const router = useRouter();
const route = useRoute();
const defaultTabActive = +route.query.tabActive || 0;
const tabActive = ref(defaultTabActive);
const navActive = ref(0);
const userStore = useUserStore();
const symbolType = ref("indices"); //默认etf
const etfList = ref([]);
const symbolList = ref([]);
const currency = ref({});
const isLoading = ref(false);
const assetsObj = ref({})
const assets = ref({})
// 现货模式切换
const spotMode = ref('perpetual'); // 'perpetual' 或 'spot'
// 期货模式切换
const futuresMode = ref('contract'); // 'contract' 或 'spot'
// 现货数据
const spotPositions = ref([]); // 现货持仓
const spotOrders = ref([]); // 现货委托订单
const spotHistory = ref([]); // 现货历史记录
const selectedSymbol = ref('btc'); // 选中的币种
const showSymbolSelector = ref(false); // 是否显示币种选择器
const availableSymbols = ref(['btc', 'eth', 'sol', 'dot', 'ada', 'xrp', 'ltc', 'bch']); // 可选择的币种列表
const navTabV1 = ref([
  {
    text: t("持仓"),
    index: 0,
  },
  {
    text: t("entrust"),
    index: 1,
  },
  {
    text: t("成交"),
    index: 2,
  },
]);

const navTabV2 = ref([
  {
    text: t("持仓"),
    index: 0,
  },
  {
    text: t("entrustOrder"),
    index: 1,
  },
  {
    text: t("历史记录"),
    index: 2,
  },
]);

const listTab = ref([
  {
    title: t('大宗商品'),
    type: 'Futures',
    urlMatch: 'futures',
    symbolType: 'futures',
    tabIndex: 0
  },
  {
    title: t('加密货币'),
    type: 'Cryptos',
    urlMatch: 'crypto',
    symbolType: 'cryptos',
    tabIndex: 1
  },
  {
    title: t('外汇'),
    type: 'Foreign',
    urlMatch: 'for',
    symbolType: 'forex',
    tabIndex: 2
  },
  {
    title: 'ETF',
    type: 'Etf',
    urlMatch: 'etf',
    symbolType: 'indices',
    tabIndex: 3
  },
  // 隐藏US Stocks和HK Stocks页签
  // {
  //   title: t('UsStocks'),
  //   type: 'UsStock',
  //   urlMatch: 'stock',
  //   symbolType: 'US-stocks',
  //   tabIndex: 4
  // },
  // {
  //   title: t('港股'),
  //   type: 'HkStock',
  //   urlMatch: 'HK-stocks',
  //   symbolType: 'HK-stocks',
  //   tabIndex: 5
  // },
  // 隐藏台股和A股页签
  // {
  //   title: t('台股'),
  //   type: 'TWStock',
  //   urlMatch: 'TW-stocks',
  //   symbolType: 'TW-stocks',
  //   tabIndex: 6
  // },
  // {
  //   title: t('A股'),
  //   type: 'AStock',
  //   urlMatch: 'A-stocks',
  //   symbolType: 'A-stocks',
  //   tabIndex: 7
  // },
])

const navTabList = computed(() => {
  return [1, 2].includes(tabActive.value) ? navTabV2.value : navTabV1.value;
});

const getCurrency = async () => {
  _getExchangeRate()
    .then((res) => {
      currency.value = res;
    })
    .catch((err) => Promise.reject(err));
};

onMounted(async () => {
  await store.dispatch('home/SET_CURRENCY')
  currency.value = store.state.home.currency
  setSomeBackParams();
  getETFList();
  assetsTradeTopFn();
  
  // 如果是加密货币页签且是现货模式，初始化加载现货数据
  if (tabActive.value === 1 && spotMode.value === 'spot') {
    loadSpotData();
  }
  
  // interval.value = setInterval(() => {
  //   getETFItemList()
  // }, 1000)
});

onBeforeUnmount(() => {
  // if (interval.value) {
  //   clearInterval(interval.value)
  // }
});

watch(symbolType, (newVal, oldVal) => {
  if (newVal === 'indices' || newVal === 'US-stocks' || newVal === 'HK-stocks'
    || newVal === 'TW-stocks' || newVal === 'JP-stocks' || newVal === 'A-stocks'
    || newVal === 'INDIA-stocks' || newVal === 'MY-stocks' || newVal === 'futures') {
    getETFList()

  } else {
    getContractOrder();
  }
  assetsTradeTopFn()
});

// 现货模式切换
const switchSpotMode = (mode) => {
  spotMode.value = mode;
  if (mode === 'spot') {
    loadSpotData();
  } else {
    // 切换到永续合约模式，重新加载当前tab数据
    handleChangeNav(navActive.value);
  }
};

// 期货模式切换
const switchFuturesMode = (mode) => {
  futuresMode.value = mode;
  if (mode === 'spot') {
    // 期货现货模式的处理逻辑
    console.log('切换到期货现货模式');
  } else {
    // 切换到期货合约模式，重新加载当前tab数据
    handleChangeNav(navActive.value);
  }
};

// 加载现货数据
const loadSpotData = async () => {
  try {
    isLoading.value = true;
    const language = getStorage('lang') || 'zh-CN';
    
    // 根据当前tab加载对应数据
    switch (navActive.value) {
      case 0: // 持仓
        await loadSpotPositions(language);
        break;
      case 1: // 委托订单
        await loadSpotOrders(language);
        break;
      case 2: // 历史记录
        await loadSpotHistory(language);
        break;
    }
  } catch (error) {
    console.error('加载现货数据失败:', error);
    showToast(t('数据加载失败'));
  } finally {
    isLoading.value = false;
  }
};

// 加载现货持仓数据
const loadSpotPositions = async (language) => {
  try {
    const response = await request({
      url: '/api/wallet/getAll.action',
      method: 'GET',
      params: {
        symbolType: 'cryptos',
        language: language
      }
    });
    
    // 检查响应结构 - 这个API直接返回数据，没有code字段
    if (response && response.extends) {
      // 从extends字段获取数据，只展示volume不等于0的币种数据
      const allData = response.extends || [];
      const filteredData = allData.filter(item => {
        // 检查volume字段，支持字符串和数字类型
        const volume = parseFloat(item.volume);
        return !isNaN(volume) && volume > 0;
      });
      spotPositions.value = filteredData;
    } else {
      console.error('现货持仓API响应格式错误:', response);
      spotPositions.value = [];
    }
  } catch (error) {
    console.error('现货持仓API调用失败:', error);
    spotPositions.value = [];
  }
};

// 加载现货委托订单数据
const loadSpotOrders = async (language) => {
  try {
    const response = await request({
      url: '/api/exchangeapplyorder!list.action',
      method: 'GET',
      params: {
        page_no: 1,
        symbol: selectedSymbol.value,
        type: 'orders',
        language: language
      }
    });
    
    // 检查响应结构 - API可能直接返回数组或包含data字段的对象
    let dataArray = null;
    if (Array.isArray(response)) {
      // 如果直接返回数组
      dataArray = response;
    } else if (response && response.code === 0 && Array.isArray(response.data)) {
      // 如果返回包含code和data字段的对象
      dataArray = response.data;
    } else if (response && response.data && Array.isArray(response.data)) {
      // 如果返回包含data字段的对象（没有code字段）
      dataArray = response.data;
    }
    
    if (dataArray) {
      spotOrders.value = dataArray;
    } else {
      console.error('现货委托订单API响应格式错误，无法解析数据:', response);
      spotOrders.value = [];
    }
  } catch (error) {
    console.error('现货委托订单API调用失败:', error);
    spotOrders.value = [];
  }
};

// 加载现货历史记录数据
const loadSpotHistory = async (language) => {
  try {
    const response = await request({
      url: '/api/exchangeapplyorder!list.action',
      method: 'GET',
      params: {
        page_no: 1,
        symbol: selectedSymbol.value,
        type: 'opponent',
        language: language
      }
    });
    
    // 检查响应结构 - API可能直接返回数组或包含data字段的对象
    let dataArray = null;
    if (Array.isArray(response)) {
      // 如果直接返回数组
      dataArray = response;
    } else if (response && response.code === 0 && Array.isArray(response.data)) {
      // 如果返回包含code和data字段的对象
      dataArray = response.data;
    } else if (response && response.data && Array.isArray(response.data)) {
      // 如果返回包含data字段的对象（没有code字段）
      dataArray = response.data;
    }
    
    if (dataArray) {
      spotHistory.value = dataArray;
    } else {
      console.error('现货历史记录API响应格式错误，无法解析数据:', response);
      spotHistory.value = [];
    }
  } catch (error) {
    console.error('现货历史记录API调用失败:', error);
    spotHistory.value = [];
  }
};

// 获取现货资产图标
const getSpotIconSrc = (symbol) => {
  if (!symbol) {
    return `/symbol/default.png`
  }
  
  // 优先使用PNG格式
  return `/symbol/${symbol.toLowerCase()}.png`
};

// 币种选择器相关函数
const toggleSymbolSelector = () => {
  showSymbolSelector.value = !showSymbolSelector.value;
};

const selectSymbol = (symbol) => {
  selectedSymbol.value = symbol;
  showSymbolSelector.value = false;
  // 重新加载当前tab的数据
  if (spotMode.value === 'spot') {
    loadSpotData();
  }
};

const getOrderTypeText = (orderPriceType, offset) => {
  const typeText = orderPriceType === 'limit' ? t('限价') : t('市价');
  const offsetText = offset === 'open' ? t('买入') : t('卖出');
  return `${typeText}/${offsetText}`;
};

const getOrderStatusText = (state) => {
  switch (state) {
    case 'submitted':
      return t('已提交');
    case 'created':
      return t('已完成');
    case 'canceled':
      return t('已取消');
    default:
      return state;
  }
};

// 订单相关操作
const goOrderDetail = (orderNo) => {
  // 跳转到订单详情页面
  router.push({
    path: '/cryptos/symbolOrderDetail',
    query: { order_no: orderNo }
  });
};

const cancelOrder = async (orderNo) => {
  try {
    // 调用撤单API
    await request({
      url: '/api/exchangeapplyorder!cancel.action',
      method: 'POST',
      data: {
        order_no: orderNo
      }
    });
    
    showToast(t('撤单成功'));
    // 重新加载数据
    const language = getStorage('lang') || 'zh-CN';
    if (navActive.value === 1) {
      await loadSpotOrders(language);
    } else if (navActive.value === 2) {
      await loadSpotHistory(language);
    }
  } catch (error) {
    console.error('撤单失败:', error);
    showToast(t('撤单失败'));
  }
};

const handleChangeNav = (index) => {
  navActive.value = index;
  etfList.value = [];
  // 加密货币&外汇
  if ([1, 2].includes(tabActive.value)) {
    // navTabV2
    if (tabActive.value === 1 && spotMode.value === 'spot') {
      // 加密货币现货模式
      loadSpotData();
    } else {
      // 永续合约模式
    switch (index) {
      case 0:
        getContractOrder();
        break;
      case 1:
        getContractApplyOrder();
        break;
      case 2:
        getHisContractOrder();
        break;
      default:
        break;
      }
    }
  } else {
    // navTabV1
    switch (index) {
      case 0:
        getETFList();
        break;
      case 1:
        getETFOrderList();
        break;
      case 2:
        getETFHisList();
        break;
      default:
        break;
    }
  }
};

const getETFList = () => {
  _getETFList(symbolType.value).then((data) => {
    etfList.value = data ?? [];
  });
};

// 成交列表
const getETFHisList = () => {
  getExchangeApplyHisList(symbolType.value).then((data) => {
    etfList.value = data ?? [];
  });
};

// 委托列表
const getETFOrderList = () => {
  getExchangeApplyOrderList(symbolType.value).then((data) => {
    etfList.value = data ?? [];
  });
};


const getOptionalList = () => {
  _getOptionalList(symbolType.value).then((data) => {
    etfList.value = data ?? [];
  });
};

const getContractOrder = () => {
  let obj = {
    type: "orders",
    page_no: 1,
    page_size: "all",
    symbolType: symbolType.value,
  };
  contractOrder(obj).then((res) => {
    symbolList.value = res ?? [];
  });
};

// 历史
const getHisContractOrder = () => {
  let obj = {
    type: "hisorders",
    page_no: 1,
    page_size: "all",
    symbolType: symbolType.value,
  };
  contractOrder(obj).then((res) => {
    symbolList.value = res ?? [];
  });
};

// 委托列表
const getContractApplyOrder = () => {
  let obj = {
    type: "orders",
    page_no: 1,
    page_size: "all",
    symbolType: symbolType.value,
  };
  _contractApplyOrder(obj).then((res) => {
    symbolList.value = res ?? [];
  });
};

const copy = async () => {
  try {
    await toClipboard(userStore.userInfo && userStore.userInfo.usercode);
    showToast(t("copySuccess"));
  } catch (e) {
    console.error(e);
  }
};

// 跳转回来的一些反显参数
const setSomeBackParams = () => {
  switch (tabActive.value) {
    case 0:
      symbolType.value = "futures";
      break;
    case 1:
      symbolType.value = "cryptos";
      break;
    case 2:
      symbolType.value = "forex";
      break;
    case 3:
      symbolType.value = "indices";
      break;
    case 4:
      symbolType.value = "US-stocks";
      break;
    case 5:
      symbolType.value = 'HK-stocks';
      break;
    case 6:
      symbolType.value = 'TW-stocks';
      break;
    case 7:
      symbolType.value = 'A-stocks';
      break;
    case 8:
      symbolType.value = 'INDIA-stocks';
      break;
    case 9:
      symbolType.value = 'UK-stocks';
      break;
    case 10:
      symbolType.value = 'DE-stocks';
      break;
    case 11:
      symbolType.value = 'BZ-stocks';
      break;
    case 12:
      symbolType.value = 'MY-stocks';
      break;
    default:
      break;
  }
};

const onClickTab = ({ name }) => {
  tabActive.value = name;
  navActive.value = 0;

  listTab.value.forEach(item => {
    if (name == item.tabIndex) {
      symbolType.value = item.symbolType
    }
  })
  router.push('/trade/index?tabActive=' + tabActive.value)
};

const itemClickOneOrThirdly = (item, index) => {
  // index: navActive
  switch (index) {
    case 0:
      switch (symbolType.value) {
        case "indices":
          router.push(
            `/quotes/openTrade?tabActive=3&symbol=${item.symbol}&from=trade&type=indices&tradeTabActive=0&navActive=0`
          );
          break;
        case "futures":
          router.push(
            `/futures/detail/${item.symbol}?from=trade&type=futures&tradeTabActive=3&navActive=0`
          );
          break;
        case "US-stocks":
          router.push(
            `/quotes/openTrade?tabActive=3&symbol=${item.symbol}&from=trade&type=US-stocks&tradeTabActive=3&navActive=0`
          );
          break;
        case 'HK-stocks':
          router.push(`/quotes/openTrade?tabActive=3&symbol=${item.symbol}&from=trade&type=HK-stocks&tradeTabActive=3&navActive=0`)
          break;
        case 'JP-stocks':
          router.push(`/quotes/openTrade?tabActive=3&symbol=${item.symbol}&from=trade&type=JP-stocks&tradeTabActive=3&navActive=0`)
          break;
        case 'TW-stocks':
          router.push(`/quotes/openTrade?tabActive=3&symbol=${item.symbol}&type=TW-stocks`)
          break;
        case 'A-stocks':
          router.push(`/quotes/openTrade?tabActive=3&symbol=${item.symbol}&from=trade&type=A-stocks&tradeTabActive=0&navActive=0`)
          break;
        case 'INDIA-stocks':
          router.push(`/quotes/openTrade?tabActive=3&symbol=${item.symbol}&from=trade&type=INDIA-stocks&tradeTabActive=3&navActive=0`)
          break;
        case 'UK-stocks':
          router.push(`/quotes/openTrade?tabActive=3&symbol=${item.symbol}&from=trade&type=UK-stocks&tradeTabActive=3&navActive=0`)
          break;
        case 'DE-stocks':
          router.push(`/quotes/openTrade?tabActive=3&symbol=${item.symbol}&from=trade&type=DE-stocks&tradeTabActive=3&navActive=0`)
          break;
        case 'BZ-stocks':
          router.push(`/quotes/openTrade?tabActive=3&symbol=${item.symbol}&from=trade&type=BZ-stocks&tradeTabActive=3&navActive=0`)
          break;
        case 'MY-stocks':
          router.push(`/quotes/openTrade?tabActive=3&symbol=${item.symbol}&from=trade&type=MY-stocks&tradeTabActive=3&navActive=0`)
          break;
      }
      break;
    case 1:
      switch (symbolType.value) {
        case "indices":
          router.push(
            `/quotes/openTrade?tabActive=4&symbol=${item.symbol}&from=trade&type=indices&tradeTabActive=0&navActive=1`
          );
          break;
        case "futures":
          router.push(
            `/futures/detail/${item.symbol}?from=trade&type=futures&tradeTabActive=3&navActive=1`
          );
          break;
        case "US-stocks":
          router.push(
            `/quotes/openTrade?tabActive=4&symbol=${item.symbol}&from=trade&type=US-stocks&tradeTabActive=3&navActive=1`
          );
          break;
        case 'HK-stocks':
          router.push(`/quotes/openTrade?tabActive=4&symbol=${item.symbol}&from=trade&type=HK-stocks&tradeTabActive=3&navActive=1`)
          break;
        case 'JP-stocks':
          router.push(`/quotes/openTrade?tabActive=4&symbol=${item.symbol}&from=trade&type=JP-stocks&tradeTabActive=3&navActive=1`)
          break;
        case 'TW-stocks':
          router.push(`/quotes/openTrade?tabActive=4&symbol=${item.symbol}&type=TW-stocks`)
          break;
        case "A-stocks":
          router.push(
            `/quotes/openTrade?tabActive=4&symbol=${item.symbol}&from=trade&type=A-stocks&tradeTabActive=0&navActive=1`
          );
          break;
        case 'INDIA-stocks':
          router.push(`/quotes/openTrade?tabActive=4&symbol=${item.symbol}&from=trade&type=INDIA-stocks&tradeTabActive=3&navActive=1`)
          break;
        case 'UK-stocks':
          router.push(`/quotes/openTrade?tabActive=4&symbol=${item.symbol}&from=trade&type=UK-stocks&tradeTabActive=3&navActive=1`)
          break;
        case 'DE-stocks':
          router.push(`/quotes/openTrade?tabActive=4&symbol=${item.symbol}&from=trade&type=DE-stocks&tradeTabActive=3&navActive=1`)
          break;
        case 'BZ-stocks':
          router.push(`/quotes/openTrade?tabActive=4&symbol=${item.symbol}&from=trade&type=BZ-stocks&tradeTabActive=3&navActive=1`)
          break;
        case 'MY-stocks':
          router.push(`/quotes/openTrade?tabActive=4&symbol=${item.symbol}&from=trade&type=MY-stocks&tradeTabActive=3&navActive=1`)
          break;
      }
      break;
    case 2:
      switch (symbolType.value) {
        case "indices":
          router.push(
            `/quotes/openTrade?tabActive=4&symbol=${item.symbol}&from=trade&type=indices&tradeTabActive=0&navActive=2&selectIndex=2`
          );
          break;
        case "futures":
          router.push(
            `/futures/detail/${item.symbol}?from=trade&type=futures&tradeTabActive=3&navActive=2&selectIndex=2`
          );
          break;
        case "US-stocks":
          router.push(
            `/quotes/openTrade?tabActive=4&symbol=${item.symbol}&from=trade&type=US-stocks&tradeTabActive=3&navActive=2&selectIndex=2`
          );
          break;
        case 'HK-stocks':
          router.push(`/quotes/openTrade?tabActive=4&symbol=${item.symbol}&from=trade&type=HK-stocks&tradeTabActive=3&navActive=2&selectIndex=2`)
          break;
        case 'JP-stocks':
          router.push(`/quotes/openTrade?tabActive=4&symbol=${item.symbol}&from=trade&type=JP-stocks&tradeTabActive=3&navActive=2&selectIndex=2`)
          break;
        case 'TW-stocks':
          router.push(`/quotes/openTrade?tabActive=4&symbol=${item.symbol}&type=TW-stocks`)
          break;
        case "A-stocks":
          router.push(
            `/quotes/openTrade?tabActive=4&symbol=${item.symbol}&from=trade&type=A-stocks&tradeTabActive=0&navActive=2&selectIndex=2`
          );
          break;
        case 'INDIA-stocks':
          router.push(`/quotes/openTrade?tabActive=4&symbol=${item.symbol}&from=trade&type=INDIA-stocks&tradeTabActive=3&navActive=2&selectIndex=2`)
          break;
        case 'UK-stocks':
          router.push(`/quotes/openTrade?tabActive=4&symbol=${item.symbol}&from=trade&type=UK-stocks&tradeTabActive=3&navActive=2&selectIndex=2`)
          break;
        case 'DE-stocks':
          router.push(`/quotes/openTrade?tabActive=4&symbol=${item.symbol}&from=trade&type=DE-stocks&tradeTabActive=3&navActive=2&selectIndex=2`)
          break;
        case 'BZ-stocks':
          router.push(`/quotes/openTrade?tabActive=4&symbol=${item.symbol}&from=trade&type=BZ-stocks&tradeTabActive=3&navActive=2&selectIndex=2`)
          break;
        case 'MY-stocks':
          router.push(`/quotes/openTrade?tabActive=4&symbol=${item.symbol}&from=trade&type=MY-stocks&tradeTabActive=3&navActive=2&selectIndex=2`)
          break;
      }
      break;
  }
};

const itemClickSecondOrFourth = (item) => {
  // 加密货币
  if (tabActive.value === 1) {
    switch (navActive.value) {
      case 0:
        router.push(
          `/cryptos/perpetualContract/${item.symbol}?from=trade&type=cryptos&tradeTabActive=1&navActive=0`
        );
        break;
      case 1:
        router.push(
          `/cryptos/perpetualContract/${item.symbol}?from=trade&type=cryptos&tradeTabActive=1&navActive=1`
        );
        break;
      case 2:
        router.push(
          `/cryptos/perpetualHistory?symbol=${item.symbol}&type=cryptos&from=trade&tradeTabActive=1&navActive=2`
        );
        break;
    }
  } else if (tabActive.value === 2) {
    // 外汇
    switch (navActive.value) {
      case 0:
        router.push(
          `/position/index?symbol=${item.symbol}&from=trade&type=forex&tabIndex=0&tradeTabActive=2&navActive=0`
        );
        break;
      case 1:
        router.push(
          `/position/index?symbol=${item.symbol}&from=trade&type=forex&tabIndex=1&tradeTabActive=2&navActive=1`
        );
        break;
      case 2:
        router.push(
          `/history/list?symbol=${item.symbol}&from=trade&type=forex&tradeTabActive=2&navActive=2`
        );
        break;
    }
  }
};

const cancelSingle = (order) => {
  console.log("order:", order);
  TradeApi.tradeCancel({
    order_no: order,
  })
    .then((res) => {
      console.log(res, "res");
      showToast(this.$t("成功"));
    })
    .catch(() => {
    });
};

const assetsTradeTopFn = (tradeType) => {
  console.log(symbolType.value)
  isLoading.value = true;
  _assetsTradeTop({
    symbolType: symbolType.value,
    tradeType: symbolType.value == 'cryptos' ? 'contract' : 'exchange'
  }).then(res => {
    isLoading.value = false;
    assetsObj.value = res
  }).catch((e) => {
    isLoading.value = false;
  });
}
</script>
<style lang="scss" scoped>
:deep(.van-loading) {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
}

:deep(.van-tabs__nav) {
  background: $mainBgColor;
}

:deep(.van-tab) {
  font-size: 14px;
  color: $text_color;
  font-weight: 400;
}

:deep(.van-tab.van-tab--active) {
  font-weight: 700;
}

.operate-btn {
  width: 49px;
  height: 20px;
  line-height: 20px;
  background: $delivery_left_tab_background;
  text-align: center;
  color: #818181;
  font-family: "Helvetica";
  font-style: normal;
  font-weight: 400;
  font-size: 11px;
}

.trade-container-box {
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

      .icon {
        display: inline-block;
        width: 24px;
        height: 28px;
        padding: 6px 4px;

        img {
          height: 16px;
          width: 12px;
        }
      }
    }

    .title {
      font-weight: 700;
      font-size: 20px;
      line-height: 28px;
      color: $mainTextColor;
    }
  }

  .trade-tab-container {
    margin-top: 18px;
  }

  .no-data-img {
    margin-top: 20px;
    width: 100px;
    height: 100px;
  }

  .content-container {
    padding: 0 12px;

    .name {
      font-size: 14px;
    }

    .ID {
      font-size: 12px;
    }

    .line {
      padding: 14px 12px;
      display: flex;
      align-items: center;
      font-size: 12px;
      line-height: 18px;

      .gray-text {
        color: #bcbdc2;
        font-size: 12px;
      }

      .value {
        margin-top: 10px;
        font-weight: 700;
        font-size: 20px;
        line-height: 24x;
        color: $text_color;
      }

      .profit {
        margin-top: 10px;
        font-size: 14px;
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
}

.indicator-index-container {
  .indicator-index-box {
    padding: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .flex-l {
      flex: 1;

      ul {
        display: flex;

        li {
          flex: 1;
          text-align: center;
          margin: 0 4px;
          font-size: 12px;
          border-radius: 4px;
        }
      }
    }

    // 现货切换按钮样式
  .spot-switch-container {
    margin: 8px 0;
    padding: 0 20px;
    
    .spot-switch {
      display: flex;
      background: #f5f5f5;
      border-radius: 20px;
      padding: 3px;
      gap: 3px;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
      
      .switch-btn {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px 12px;
        border: none;
        background: transparent;
        color: #666;
        font-size: 12px;
        font-weight: 500;
        border-radius: 17px;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        
        .btn-text {
          font-size: 12px;
          font-weight: 500;
        }
        
        &.active {
          background: #1194F7;
          color: white;
          font-weight: 600;
          box-shadow: 0 2px 6px rgba(17, 148, 247, 0.3);
        }
        
        &:hover:not(.active) {
          background: rgba(17, 148, 247, 0.1);
          color: #1194F7;
        }
        
        &.perpetual-btn.active {
          background: #1194F7;
        }
        
        &.spot-btn.active {
          background: #1194F7;
        }
        
        &.contract-btn.active {
          background: #1194F7;
        }
      }
    }
    
    // 移动端适配
    @media (max-width: 768px) {
      margin: 6px 0;
      padding: 0 16px;
      
      .spot-switch {
        border-radius: 18px;
        padding: 2px;
        gap: 2px;
        
        .switch-btn {
          padding: 6px 10px;
          border-radius: 16px;
          
          .btn-text {
            font-size: 11px;
          }
        }
      }
    }
    
    @media (max-width: 480px) {
      margin: 5px 0;
      padding: 0 12px;
      
      .spot-switch {
        border-radius: 16px;
        padding: 2px;
        gap: 2px;
        
        .switch-btn {
          padding: 5px 8px;
          border-radius: 14px;
          
          .btn-text {
            font-size: 10px;
          }
        }
        }
      }
    }

    .flex-r {
      display: flex;
      justify-content: flex-end;
      width: 80px;

      img {
        width: 12px;
        height: 16px;
      }
    }
  }

  .active {
    background: $btn_main;
    color: $white;
  }
}

.quickly {
  width: 100%;
  height: 72px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;

  .quickBox {
    flex: 1;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
    border-radius: 6px;
    border: 1px solid $color_main;

    .left {
      display: flex;
      align-items: center;
      flex: 1;

      .leftBox {
        width: 3rem;
        height: 3rem;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }

    .leftCont {
      margin-left: 12px;

      p {
        font-size: 12px;
        color: $text_color;
        line-height: 14px;
      }
    }

    .right {
      width: 16px;
      height: 16px;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .chongbi {
    background: url("@/assets/theme/white/image/chongb.png");
    background-size: cover;

    &.dark {
      background: url("@/assets/theme/dark/image/chongb.png");
      background-size: cover;
    }
  }

  .tibi {
    // background: url("@/assets/theme/white/image/tib.png");
    // background-size: cover;
    border: 1px solid var(--color_main);
    border-radius: .625rem;

    &.dark {
      background: url("@/assets/theme/dark/image/tib.png");
      background-size: cover;
    }
  }
}

.etf-container {
  padding: 0;

  .hot-container {
    margin: 20px 0;
    padding: 0 8px;

    .header-box {
      display: flex;

      .title {
        flex: 1;
        font-size: 16px;
        padding: 0 8px;
        font-weight: 700;
      }

      .icon-group {
        display: flex;
        align-items: center;

        .icon.arrow {
          margin-left: 10px;
          width: 7px;
          height: 9px;
        }
      }
    }

    .hot-box {
      display: grid;
      grid-template-columns: 33.33% 33.33% 33.33%;
      grid-template-rows: repeat(2, 100px);
    }

    .hot-item {
      padding: 6px 2px;
      margin: 4px;
      text-align: center;
      font-size: 12px;
      line-height: 18px;
      color: #b8bdd1;
      background: #1b2134;
      border-radius: 4px;

      .value {
        font-weight: 700;
        color: $text_color;
        line-height: 24px;
      }

      .num {
        .num-left {
          margin-right: 6px;
        }
      }
    }
  }

  .all-etf-ranking,
  .other-etf-ranking {
    margin-top: 10px;

    .title {
      font-weight: 700;
      padding: 0 12px;
    }

    .tabs {
      padding: 0 12px;
      margin-top: 10px;
      height: 40px;
      line-height: 24px;
      color: #bbbcbd;

      .tab-item {
        margin: 4px;
        text-align: center;
        padding: 4px 6px;
        font-size: 12px;
        color: $text_color5;
        background: $US_tab_background;
        border-radius: 10px;
        background-size: cover;
      }

      .active {
        font-weight: 700;
        color: $color_main !important;
        background: $US_tabActice_background;
        border-radius: 10px;
        background-size: cover;
      }
    }

    .etf-table {
      .right {
        text-align: right;
      }

      ul {
        margin-top: 10px;
      }

      .title-line {
        color: #747a8f;
        font-size: 12px;
        font-weight: 400;
        padding: 0 12px;
        border: none;
      }

      li {
        padding: 14px 12px;
        display: flex;
        font-size: 12px;
        line-height: 18px;
        border-bottom: 1px solid $border_color;

        .gray-text {
          color: #bcbdc2;
          font-size: 12px;

          .tip-text {
            width: 27px;
            height: 16px;
            line-height: 16px;
            text-align: center;
            border-radius: 4px;
            color: $white;
            display: inline-block;

            &.text-up {
              background: $red;
            }

            &.text-down {
              background: $green;
            }
          }
        }

        .flex-l {
          width: 100px;
        }

        .flex-r {
          display: inline-flex;
          flex: 1;

          .flex-r-item {
            flex: 1;
            align-self: center;
            text-align: center;
          }
        }
      }
    }
  }
}

.symbol-list {
  display: flex;
  flex-direction: column;
  margin-top: 10px;

  .symbol-list-item {
    margin: 0 0 10px;
    justify-content: space-between;
    padding: 10px;
    font-size: 12px;
    color: #989899;
    font-weight: 600;
    border-bottom: 1px solid $border_color;
  }

  .symbol-list-top {
    display: flex;

    .item-l {
      text-align: left;

      .symbol-name {
        font-size: 16px;
        color: $text_color;
      }

      .price-change {
        color: $text_color;

        .price-l {
          font-weight: 600;
        }

        .arrow {
          margin: 0 6px;
        }
      }
    }

    .item-r {
      text-align: right;

      .volume-box {
        .volume {
          display: inline-flex;
          border: 1px solid $green;
          border-radius: 5px;

          .volume-l {
            width: 40px;
            background-color: $green;
            color: $main-btn-color;
            font-size: 12px;
            text-align: center;
          }

          .volume-r {
            padding: 0 6px;
            // color: $green;
            font-weight: 400;
          }

          .red {
            color: $red;
          }
        }

        .red-bg {
          background-color: $red !important;
        }

        .green-bg {
          background-color: $green !important;
        }

        .green-border {
          border: 1px solid $green !important;
        }

        .red-border {
          border: 1px solid $red !important;
        }
      }
    }
  }

  .symbol-list-bottom {
    display: flex;
    margin-top: 4px;

    .order-info {
      line-height: 18px;
    }

    .bottom-r {
      text-align: right;
      display: flex;

      .profit-num {
        line-height: 54px;
        font-weight: 600;
        font-size: 20px;
      }
    }
  }

  .no-data {
    margin: 20px auto;
    width: 200px;
    height: 200px;
  }

  // 现货资产样式
  .spot-assets-list {
    padding: 0 20px;
    
    .spot-asset-item {
      margin-bottom: 20px;
      padding: 16px 20px;
      background: #f8f9fa;
      border-radius: 12px;
      border: 1px solid #e9ecef;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .spot-icon {
        width: 40px;
        height: 40px;
        object-fit: cover;
      }
      
      .symbol-name {
        margin-left: 12px;
        font-size: 16px;
        font-weight: 600;
        color: #2c3e50;
      }
      
      // 移动端适配
      @media (max-width: 768px) {
        padding: 12px 16px;
        margin-bottom: 16px;
        
        .spot-icon {
          width: 32px;
          height: 32px;
        }
        
        .symbol-name {
          font-size: 14px;
          margin-left: 8px;
        }
        
        .text-30 {
          font-size: 12px !important;
        }
        
        .text-24 {
          font-size: 10px !important;
        }
      }
      
      @media (max-width: 480px) {
        padding: 10px 12px;
        margin-bottom: 12px;
        
        .spot-icon {
          width: 28px;
          height: 28px;
        }
        
        .symbol-name {
          font-size: 13px;
          margin-left: 6px;
        }
        
        .text-30 {
          font-size: 11px !important;
        }
        
        .text-24 {
          font-size: 9px !important;
        }
      }
    }
  }

  // 币种选择器样式
  .symbol-selector-container {
    padding: 20px;
    
    .symbol-selector {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      background: #f5f5f5;
      border: 1px solid #ddd;
      border-radius: 8px;
      cursor: pointer;
      
      .symbol-text {
        font-size: 16px;
        font-weight: 600;
        color: #333;
      }
      
      .arrow-icon {
        font-size: 14px;
        color: #666;
        transition: transform 0.3s ease;
      }
      
      .symbol-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        max-height: 200px;
        overflow-y: auto;
        
        .symbol-option {
          padding: 12px 16px;
          font-size: 14px;
          color: #333;
          cursor: pointer;
          border-bottom: 1px solid #f0f0f0;
          
          &:hover {
            background: #f8f9fa;
          }
          
          &:last-child {
            border-bottom: none;
          }
        }
      }
    }
  }

  // 委托订单样式
  .spot-orders {
    .no-data-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 50px 20px;
      
      .no-data-img {
        width: 120px;
        height: 120px;
      }
    }
    
    .orders-list {
      padding: 0 20px;
      
      .order-item {
        margin-bottom: 16px;
        padding: 16px;
        background: white;
        border-radius: 12px;
        border: 1px solid #e9ecef;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        
        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          
          .order-type {
            display: flex;
            align-items: center;
            gap: 8px;
            
            .symbol-name {
              font-size: 16px;
              font-weight: 600;
              color: #333;
            }
          }
          
          .order-time {
            font-size: 12px;
            color: #666;
          }
        }
        
        .order-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          
          .order-progress {
            display: flex;
            align-items: center;
            gap: 12px;
            
            .progress-circle {
              width: 60px;
              height: 60px;
              border-radius: 50%;
              background: #f0f0f0;
              display: flex;
              align-items: center;
              justify-content: center;
              position: relative;
              
              .progress-text {
                font-size: 12px;
                font-weight: 600;
                color: #333;
              }
            }
            
            .order-details {
              .detail-row {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 4px;
                
                .label {
                  font-size: 12px;
                  color: #666;
                }
                
                .value {
                  font-size: 12px;
                  font-weight: 600;
                  color: #333;
                }
              }
            }
          }
          
          .order-actions {
            display: flex;
            flex-direction: column;
            gap: 8px;
            
            .action-btn {
              padding: 6px 12px;
              border-radius: 6px;
              font-size: 12px;
              font-weight: 500;
              border: none;
              cursor: pointer;
              transition: all 0.3s ease;
              
              &.detail-btn {
                background: #e3f2fd;
                color: #1976d2;
              }
              
              &.cancel-btn {
                background: #ffebee;
                color: #d32f2f;
              }
              
              &.completed-btn {
                background: #e8f5e8;
                color: #2e7d32;
              }
              
              &.canceled-btn {
                background: #f5f5f5;
                color: #666;
              }
            }
          }
        }
      }
    }
  }

  // 历史记录样式
  .spot-history {
    .no-data-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 50px 20px;
      
      .no-data-img {
        width: 120px;
        height: 120px;
      }
    }
    
    .history-list {
      padding: 0 20px;
      
      .history-item {
        margin-bottom: 16px;
        padding: 16px;
        background: white;
        border-radius: 12px;
        border: 1px solid #e9ecef;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        
        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          
          .history-type {
            display: flex;
            align-items: center;
            gap: 8px;
            
            .symbol-name {
              font-size: 16px;
              font-weight: 600;
              color: #333;
            }
          }
          
          .history-status {
            display: flex;
            align-items: center;
            gap: 4px;
            cursor: pointer;
            
            .status-text {
              font-size: 12px;
              color: #666;
            }
            
            .arrow-icon {
              font-size: 12px;
              color: #666;
            }
          }
        }
        
        .history-content {
          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            
            .info-item {
              flex: 1;
              
              .label {
                display: block;
                font-size: 12px;
                color: #666;
                margin-bottom: 2px;
              }
              
              .value {
                font-size: 12px;
                font-weight: 600;
                color: #333;
              }
            }
          }
        }
      }
    }
  }
}

// 全局移动端适配
@media (max-width: 768px) {
  .van-tabs__nav {
    font-size: 14px;
  }
  
  .van-tab {
    font-size: 14px;
    padding: 0 8px;
  }
  
  .van-tabs__line {
    height: 2px;
  }
  
  .text-30 {
    font-size: 12px !important;
  }
  
  .text-24 {
    font-size: 10px !important;
  }
  
  .text-20 {
    font-size: 9px !important;
  }
}

@media (max-width: 480px) {
  .van-tabs__nav {
    font-size: 12px;
  }
  
  .van-tab {
    font-size: 12px;
    padding: 0 6px;
  }
  
  .text-30 {
    font-size: 11px !important;
  }
  
  .text-24 {
    font-size: 9px !important;
  }
  
  .text-20 {
    font-size: 8px !important;
  }
}
</style>
