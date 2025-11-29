<template>
  <div>
    <div class="page-header-background">
      <div class="page-header-content page-header-box">
        <!-- 通用左边菜单 -->
        <div class="left-page-header">
          <div @click="goRouter('/')" class="logo">
            <img
              src="@/assets/images/compositeHome/logo.png"
              width="24"
              height="24"
            />
            <span class="logoName2"> {{ $title }} </span>
          </div>
          <menu-item
            v-for="(_, i) in leftMenuList"
            :key="i"
            :title="_.title"
            :menuList="_.menuList"
            :url="_.url"
            :tips="_.tips"
          >
          </menu-item>
        </div>
        <!-- 登录前的右边菜单-->
        <div class="right-page-header-pre-login" v-if="!userStore.existToken">
          <div @click="goRouter('/login')">{{ $t("message.home.denglu") }}</div>
          <div @click="goRouter('/register')">
            {{ $t("message.home.zhuce") }}
          </div>

          <div class="separator-line1"></div>

          <!-- 下载按钮图标 -->
          <div class="icon-btn" @click="goApp">
            <el-icon style="font-size: 20px"><Download /></el-icon>
          </div>

          <!-- 语言选择 -->
          <el-dropdown
            trigger="click"
            @command="handleLangChange"
            class="lang-select"
          >
            <div class="icon-btn">
              <el-icon><Orange /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="item in langOptions"
                  :key="item.value"
                  :command="item.value"
                  :class="{ active: item.value === langValue }"
                >
                  <div class="lang-item">
                    <span>{{ item.label }}</span>
                    <el-icon v-if="item.value === langValue" class="check-icon">
                      <Select />
                    </el-icon>
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <!-- 登录后的右边菜单 -->
        <div class="right-page-header" v-else>
          <!-- 充值 -->
          <div style="margin: auto; top: 0; left: 0; bottom: 0; right: 0">
            <div @click="goRouter('/recharge')" class="recharge-btn">
              <img
                src="@/assets/images/headIcon/right-menu/material-symbols.png"
              />
              {{ $t("message.user.chongzhi") }}
            </div>
          </div>
          <!-- 钱包、订单、账户 -->
          <menu-item
            v-for="(_, i) in rightMenuList"
            :key="i"
            :title="_.title"
            :menuList="_.menuList"
            :isRight="true"
          >
          </menu-item>

          <div class="separator-line1"></div>

          <!-- 下载按钮图标 -->
          <div class="icon-btn" @click="goApp">
            <el-icon><Download /></el-icon>
          </div>

          <!-- 语言选择 -->
          <el-dropdown
            trigger="click"
            @command="handleLangChange"
            class="lang-select"
          >
            <div class="icon-btn">
              <el-icon><Orange /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="item in langOptions"
                  :key="item.value"
                  :command="item.value"
                  :class="{ active: item.value === langValue }"
                >
                  <div class="lang-item">
                    <span>{{ item.label }}</span>
                    <el-icon v-if="item.value === langValue" class="check-icon">
                      <Select />
                    </el-icon>
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { mapState } from "pinia";
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";
import { Download, Orange, Select } from "@element-plus/icons-vue";
import { useI18n } from "vue-i18n";
import { useUserStore } from "@/store/user";
import { useCurrencyStore } from "@/store/currency";
import { useLanguageStore } from "@/store/lang";
import MenuItem from "./headerMenuItem.vue";
import { getImages, nowUrl } from "@/utils/index";
import { qianbaoList, dingdanList } from "@/utils/menuConfig";
import { langOptions } from "@/utils";
const router = useRouter();

const { t, locale } = useI18n();
const currencyStore = useCurrencyStore();
const userStore = useUserStore();
const langStore = useLanguageStore();

const langValue = computed(() => langStore.language);

let leftMenuList = computed(() => [
  {
    title: "shichang", //市场
    url: "/market",
  },
  {
    title: "shuzihuobi", // 数字货币= 现货交易 永续合约 交割合约
    menuList: [
      ...contractList("/coin/constract/btc"),
      // ...spotList("/coin/spot/btc"),
    ],
  },
  // {
  //   title: "yijianmaibi", // 一键买币
  //   menuList: [
  //     {
  //       iconPath: getImages("headIcon/left-menu/fast-maimai.png"),
  //       urlPath: "/c2c/fastBuy",
  //       title: "dibu11",
  //       desc: "yijianmaimai_1",
  //     },
  //     {
  //       iconPath: getImages("headIcon/left-menu/free-maimai.png"),
  //       urlPath: "/c2c/wantBuy",
  //       title: "ziyoujiaoyi",
  //       desc: "ziyoujiaoyi_1",
  //     },
  //   ],
  // },
  // {
  //   title: "meigu", // 美股 = 美股交易 永续合约 交割合约
  //   menuList: [
  //     ...contractList(
  //       `/usStocks/constract/${currencyStore.usStocksCurrency[0]?.symbol}`
  //     ),
  //     ...spotList(
  //       `/usStocks/spot/${currencyStore.usStocksCurrency[0]?.symbol}`,
  //       "meigujiaoyi"
  //     ),
  //   ],
  // },
  {
    title: "RWA", // RWA 资产
    url: "/rwa",
  },
  {
    title: "dazhongshangpin", // 大宗商品
    url: "/commodities/market",
  },
  //   {
  //   title: "Agu", // A股
  //   menuList: [
  //     ...contractList(
  //       `/cnStocks/constract/${currencyStore.cnStocksCurrency[0]?.symbol}`
  //     ),
  //     ...spotList(
  //       `/cnStocks/spot/${currencyStore.cnStocksCurrency[0]?.symbol}`,
  //       "Agujiaoyi"
  //     ),
  //   ],
  // },
  // {
  //   title: "ganggu", // 港股和美股一样
  //   menuList: [
  //     ...contractList(
  //       `/hkStocks/constract/${currencyStore.hkStocksCurrency[0]?.symbol}`
  //     ),
  //     ...spotList(
  //       `/hkStocks/spot/${currencyStore.hkStocksCurrency[0]?.symbol}`,
  //       "ganggujiaoyi"
  //     ),
  //   ],
  // },
  // {
  //   title: "taigu", // 台股和美股一样
  //   menuList: [
  //     ...contractList(
  //       `/twStocks/constract/${currencyStore.twStocksCurrency[0]?.symbol}`
  //     ),
  //     ...spotList(
  //       `/twStocks/spot/${currencyStore.twStocksCurrency[0]?.symbol}`,
  //       "taigujiaoyi"
  //     ),
  //   ],
  // },
  // {
  //   title: "stocks", // 股票 = 股票交易 永续合约 交割合约
  //   menuList: [
  //     ...contractList(
  //       `/stocks/constract/${
  //         currencyStore.stocksCurrency[0]?.symbol || "AAPL.US"
  //       }`
  //     ),
  //     ...spotList(
  //       `/stocks/spot/${currencyStore.stocksCurrency[0]?.symbol || "AAPL.US"}`,
  //       "stocks"
  //     ),
  //   ],
  // },
  // {
  //   title: "waihui", // 外汇=永续合约 交割合约
  //   menuList: contractList(
  //     `/forex/constract/${currencyStore.forexCurrency[0]?.symbol}`
  //   ),
  // },
  // {
  //   title: "etf", // ETF= etf交易 永续合约 交割合约
  //   menuList: [
  //     ...contractList(`/etf/constract/${currencyStore.etfCurrency[0]?.symbol}`),
  //     ...spotList(
  //       `/etf/spot/${currencyStore.etfCurrency[0]?.symbol}`,
  //       "etfjiaoyi"
  //     ),
  //   ],
  // },
  // {
  //   title: "jinrongyewu", // 金融业务=基金理财+矿池锁仓+C2C
  //   menuList: [
  //     {
  //       iconPath: getImages("headIcon/left-menu/pig.png"),
  //       urlPath: "/fundMa",
  //       title: "licaijijin",
  //       desc: "jijinlicai_1",
  //     },
  //     {
  //       iconPath: getImages("headIcon/left-menu/min.png"),
  //       urlPath: "/fundMakc",
  //       title: "kuangchisuocang",
  //       desc: "kuangchisuocang_1",
  //     },
  //   ],
  // },
]);

const contractList = (urlPath) => {
  return [
    {
      iconPath: getImages("headIcon/left-menu/constract-icon.png"),
      urlPath,
      urlQuery: { timestamp: Date.now(), RouterName: "sustainable" },
      title: "yongxuheyue",
      desc: "yongxuheyue_1",
    },
    {
      iconPath: getImages("headIcon/left-menu/delivery-icon.png"),
      urlPath,
      urlQuery: { timestamp: Date.now(), RouterName: "delivery" },
      title: "jiaogeheyue",
      desc: "jiaogeheyue_1",
    },
  ];
};

const spotList = (urlPath, tle) => {
  return [
    {
      iconPath: getImages("headIcon/left-menu/spot-icon.png"),
      urlPath,
      title: tle || "xianhuojiaoyishouye",
      desc: "xianhuojiaoyi_1",
    },
  ];
};

const rightMenuList = [
  // {
  //   title: "新股认购",
  //   menuList: [
  //     {
  //       urlPath: "/newShares/newSharesBox",
  //       title: "xingurengou",
  //       iconPath: getImages("headIcon/newShares/6123.png"),
  //     },
  //     {
  //       urlPath: "/newShareSrecord/drawRecord",
  //       title: "chouqianjilu",
  //       iconPath: getImages("headIcon/newShares/6137.png"),
  //     },
  //     {
  //       urlPath: "/newShareSrecord/payRecord",
  //       title: "renjiaojilu",
  //       iconPath: getImages("headIcon/newShares/6138.png"),
  //     },
  //     {
  //       urlPath: "/newShares/newSharesInventory",
  //       title: "xingukucun",
  //       iconPath: getImages("headIcon/newShares/6139.png"),
  //     },
  //     {
  //       urlPath: "/newShares/nowSharesInventory",
  //       title: "xiangukucun",
  //       iconPath: getImages("headIcon/newShares/6140.png"),
  //     },
  //   ],
  // },
  {
    title: "qianbao",
    menuList: qianbaoList,
  },
  {
    title: "dingdan", //订单历史
    menuList: dingdanList,
  },
  {
    title: "zhanghu",
    menuList: [
      {
        urlPath: "/my/security",
        title: "zhanghuanquan",
        iconPath: getImages("headIcon/personal-menu/account-security.png"),
      },
      {
        urlPath: "/my/universal",
        title: "tongyong",
        iconPath: getImages("headIcon/personal-menu/universal.png"),
      },
      {
        urlPath: "/my/helpCenter",
        title: "bangzhuzhongxin",
        iconPath: getImages("headIcon/personal-menu/help-center.png"),
      },
      {
        urlPath: "/promote",
        title: "tuiguangzhouxin",
        iconPath: getImages("headIcon/personal-menu/contract-account.png"),
      },
      {
        urlPath: "/my/announcement",
        title: "gonggaozhongxin",
        iconPath: getImages("headIcon/personal-menu/notice.png"),
      },
      {
        urlPath: "/loginOut",
        title: "tuichu",
        iconPath: getImages("headIcon/personal-menu/quit.png"),
      },
    ],
  },
];

const goRouter = (parmas) => {
  router.push(parmas);
};

const handleLangChange = (val) => {
  locale.value = val;
  langStore.updateLang(val);
};

const goApp = () => {
  window.location.href = "/app.html";
};
</script>
<style lang="scss" scoped>
// 变量定义（与 compositeHome/header.vue 保持一致）
$header-height: 70px;
$primary-color: #2e64f1;
$color-black: #000000;
$color-white: #ffffff;
$color-text-primary: #ffffff;
$color-text-secondary: #999999;
$color-divider: rgba(255, 255, 255, 0.1);
$bg-light: rgba(255, 255, 255, 0.05);
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;
$spacing-xl: 32px;
$font-size-sm: 12px;
$font-size-base: 14px;
$font-size-lg: 16px;
$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-bold: 600;
$radius-sm: 4px;
$transition-base: 0.3s ease;
$shadow-md: 0 4px 12px rgba(0, 0, 0, 0.15);
$breakpoint-lg: 992px;
$z-index-sticky: 1000;

.page-header-background {
  position: sticky;
  top: 0;
  background-color: $color-black;
  padding: 0 $spacing-xl;
  border-bottom: 1px solid $color-divider;
  z-index: $z-index-sticky;
  transition: all $transition-base;
}

.page-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: $header-height;
  color: $color-text-primary;
}

.left-page-header > div:nth-child(1) > img {
  display: inline-block;
}

.right-page-header,
.left-page-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: $spacing-md;
}

.right-page-header-pre-login {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.right-page-header > div {
  cursor: pointer;
  color: $color-text-primary;
  transition: color $transition-base;
  font-size: $font-size-base;
  font-weight: $font-weight-medium;

  &:hover {
    color: $primary-color;
  }
}

.right-page-header-pre-login > div {
  padding: 0 $spacing-md;
  cursor: pointer;
  color: $color-text-primary;
  transition: color $transition-base;
  font-size: $font-size-base;
  font-weight: $font-weight-medium;

  &:hover {
    color: $primary-color;
  }
}

.left-page-header > div {
  cursor: pointer;
  color: $color-text-primary;
  transition: all $transition-base;
  font-size: $font-size-base;
  font-weight: $font-weight-medium;
  padding: 0 $spacing-sm;

  &:hover {
    color: $primary-color;
  }
}

.logo {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  cursor: pointer;
  margin-right: $spacing-lg;

  img {
    height: 25px;
    width: auto;
  }
}

.logoName2 {
  display: flex;
  align-items: center;
  font-weight: $font-weight-bold;
  font-size: 22px;
  color: $color-white;
  transition: color $transition-base;
}

.el-dropdown-link {
  cursor: pointer;
  font-size: $font-size-base;
}

.el-icon-arrow-down {
  font-size: $font-size-sm;
}

.recharge-btn {
  background-color: $primary-color;
  padding: 8px 20px;
  height: auto;
  min-width: 98px;
  border-radius: $radius-sm;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-weight: $font-weight-medium;
  transition: all $transition-base;
  color: $color-white;
  border: none;
  cursor: pointer;

  &:hover {
    background: lighten($primary-color, 10%);
    transform: translateY(-1px);
    box-shadow: $shadow-md;
  }

  img {
    width: 16px;
    height: 16px;
  }
}

// 图标按钮样式（下载、语言选择等）
.icon-btn {
  font-size: 20px;
  cursor: pointer;
  color: $color-text-secondary;
  transition: all $transition-base;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;

  &:hover {
    color: $color-text-primary;
    background: $bg-light;
  }
}

.separator-line1 {
  width: 2px !important;
  height: 20px;
  background-color: white;
  margin: 0px 12px;
  padding: 0px !important;
}

.lang-select {
  cursor: pointer;
  display: flex;
  align-items: center;
}

// 语言选择下拉菜单样式
:deep(.el-dropdown-menu) {
  background: $color-black;
  border: 1px solid $color-divider;
  padding: $spacing-sm;

  .el-dropdown-menu__item {
    padding: $spacing-sm $spacing-md;
    border-radius: $radius-sm;
    transition: all $transition-base;

    .lang-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      min-width: 120px;
      color: $color-text-primary;

      .check-icon {
        color: $primary-color;
        font-size: 16px;
      }
    }

    &.active {
      color: $primary-color;
      font-weight: $font-weight-medium;
      background: rgba($primary-color, 0.1);
    }

    &:hover {
      background: $bg-light;
      color: $color-text-primary;
    }
  }
}
</style>
