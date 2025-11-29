<template>
  <div class="new-header" :class="{ transparent: needTransparent }">
    <div style="padding: 0px 32px">
      <div class="header-inner">
        <!-- 左侧：Logo + 导航菜单 -->
        <div class="header-left">
          <!-- Logo -->
          <div class="logo" @click="goPage('/home')">
            <img src="@/assets/images/compositeHome/logo.png" alt="Logo" />
            <span class="logo-text">{{ $title }}</span>
          </div>

          <!-- 导航菜单 -->
          <nav class="nav-menu">
            <el-menu
              mode="horizontal"
              :ellipsis="false"
              @select="handleMenuSelect"
            >
              <template v-for="(_item, _index) in headerList" :key="_index">
                <!-- 直接菜单项（无子菜单） -->
                <el-menu-item
                  v-if="!_item.option || _item.option.length === 0"
                  :index="_item.path"
                >
                  {{ _item.isNewMenu ? t(`message.user.${_item.label}`) : t(_item.label) }}
                </el-menu-item>

                <!-- 子菜单（有选项） -->
                <el-sub-menu v-else :index="_item.path">
                  <template #title>
                    {{ _item.isNewMenu ? t(`message.user.${_item.label}`) : t(_item.label) }}
                  </template>
                  <el-menu-item
                    v-for="(item, index) in _item.option"
                    :key="index"
                    :index="`${_item.path}-${index}`"
                    @click="handleSubMenuClick(item)"
                  >
                    {{ item?.isNewMenu ? t(`message.home.${item?.label}`) : t(item?.label) }}
                  </el-menu-item>
                </el-sub-menu>
              </template>
            </el-menu>
          </nav>
        </div>

        <!-- 右侧：操作区 -->
        <div class="header-actions">
          <!-- 顶部快捷菜单 -->
          <!-- <div class="quick-links">
            <span
              class="quick-link"
              v-for="(_, i) in left3"
              :key="i"
              @click="goPage(_.url)"
            >
              {{ t(_.title) }}
            </span>
            <span class="quick-link" @click="goPage('/support')">
              {{ t("header-s1-4") }}
            </span>
            <span class="quick-link" @click="goPage('/refer-friend')">
              {{ t("header-s1-5") }}
            </span>
          </div> -->

          <!-- 用户操作按钮 -->
          <div class="user-actions">
            <!-- 未登录状态 -->
            <template v-if="!userInfo.token">
              <el-button text class="btn-link" @click="goPage('/login')">
                {{ t("header-s2-b2") }}
              </el-button>
              <el-button class="btn-primary" @click="goPage('/login')">
                {{ t("ready-b1") }}
              </el-button>
            </template>

            <!-- 已登录状态 -->
            <template v-else>
              <el-button class="btn-primary" @click="gotoPage">
                {{ t("header-s2-b1") }}
              </el-button>
              <el-button class="btn-logout" @click="handleLogout">
                {{ t("tuichu") }}
              </el-button>
            </template>

            <div class="separator-line"></div>

            <!-- 下载按钮 -->
            <div class="icon-btn" @click="handleDownload">
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
                      <el-icon
                        v-if="item.value === langValue"
                        class="check-icon"
                      >
                        <Select />
                      </el-icon>
                    </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>

        <!-- 移动端菜单按钮 -->
        <div class="mobile-menu-btn" @click="toggleMobileMenu">
          <el-icon><Menu /></el-icon>
        </div>
      </div>
    </div>

    <!-- 移动端菜单抽屉 -->
    <el-drawer
      v-model="mobileMenuVisible"
      direction="rtl"
      size="80%"
      :show-close="false"
      class="mobile-menu-drawer"
    >
      <template #header>
        <div class="drawer-header">
          <img src="@/assets/images/compositeHome/logo.png" alt="Logo" />
          <span>{{ $title }}</span>
        </div>
      </template>
      <div class="mobile-menu-content">
        <!-- 快捷链接 -->
        <div class="mobile-quick-links">
          <div
            class="mobile-menu-item"
            v-for="(_, i) in left3"
            :key="i"
            @click="goPageAndClose(_.url)"
          >
            {{ t(_.title) }}
          </div>
          <div class="mobile-menu-item" @click="goPageAndClose('/support')">
            {{ t("header-s1-4") }}
          </div>
          <div
            class="mobile-menu-item"
            @click="goPageAndClose('/refer-friend')"
          >
            {{ t("header-s1-5") }}
          </div>
        </div>

        <!-- 主导航 -->
        <div
          v-for="(_item, _index) in headerList"
          :key="_index"
          class="mobile-nav-group"
        >
          <!-- 直接菜单项（无子菜单） -->
          <div
            v-if="!_item.option || _item.option.length === 0"
            class="mobile-menu-item"
            @click="goPageAndClose(_item.path)"
          >
            {{ _item.isNewMenu ? t(`message.user.${_item.label}`) : t(_item.label) }}
          </div>

          <!-- 有子菜单的项 -->
          <template v-else>
            <div class="mobile-nav-title">{{ _item.isNewMenu ? t(`message.user.${_item.label}`) : t(_item.label) }}</div>
            <div
              v-for="(item, index) in _item.option"
              :key="index"
              class="mobile-menu-item"
              @click="goPageAndClose(item)"
            >
              {{ item?.isNewMenu ? t(`message.home.${item?.label}`) : t(item?.label) }}
            </div>
          </template>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { Menu, Download, Orange, Select } from "@element-plus/icons-vue";
import Axios from "@/api/login.js";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { useUserStore } from "@/store/user";
import { useLanguageStore } from "@/store/lang";
import { removeStorage, langOptions } from "@/utils";
import { gotoPage } from "@/utils/login";

const { t, locale } = useI18n();
const { userInfo } = storeToRefs(useUserStore());
const langStore = useLanguageStore();

const props = defineProps({
  needTransparent: {
    type: Boolean,
    default: false,
  },
});

const router = useRouter();
const langValue = computed(() => langStore.language);
const mobileMenuVisible = ref(false);

const left3 = [
  {
    url: "/partners",
    title: "header-s1-2",
  },
  {
    url: "/group",
    title: "header-s1-3",
  },
];

const handleLangChange = (val) => {
  locale.value = val;
  langStore.updateLang(val);
};

// 菜单选择处理
const handleMenuSelect = (index) => {
  if (index.startsWith("/")) {
    router.push(index);
  }
};

// 处理子菜单点击（支持 query 参数）
const handleSubMenuClick = (item) => {
  if (item.query) {
    router.push({
      path: item.path,
      query: item.query,
    });
  } else {
    router.push(item.path);
  }
};

// 移动端菜单切换
const toggleMobileMenu = () => {
  mobileMenuVisible.value = !mobileMenuVisible.value;
};

// 移动端跳转并关闭菜单
// 移动端：导航并关闭菜单（支持 query 参数）
const goPageAndClose = (pathOrItem) => {
  // 如果传入的是字符串，直接作为路径跳转
  if (typeof pathOrItem === "string") {
    router.push(pathOrItem);
  }
  // 如果传入的是对象，检查是否有 query 参数
  else if (pathOrItem && pathOrItem.path) {
    if (pathOrItem.query) {
      router.push({
        path: pathOrItem.path,
        query: pathOrItem.query,
      });
    } else {
      router.push(pathOrItem.path);
    }
  }
  mobileMenuVisible.value = false;
};

// 下载处理
const handleDownload = () => {
  // 可以打开下载页面或显示下载选项
  // 示例：跳转到下载页面
  // window.open('/download', '_blank');
  // 或者显示一个下载选项的弹窗
};

// 退出登录
const handleLogout = () => {
  Axios.loginOut().then((res) => {
    if (res.code == "0") {
      const store = useUserStore();
      store.resetUserInfo();
      removeStorage("spToken");
      removeStorage("username");
    }
  });
};
const whyList = [
  {
    label: "m1-1",
    path: "/why-demo/about",
  },
  {
    label: "m1-2",
    path: "/why-demo/awards",
  },
  {
    label: "m1-3",
    path: "/why-demo/premium-clients",
  },
  {
    label: "m1-4",
    path: "/why-demo/active-trader-program",
  },
  {
    label: "m1-5",
    path: "/why-demo/legal-entity-identifier",
  },
];
const marketList = [
  {
    label: "m2-product-s1-t1",
    path: "/trading/instruments",
  },
  {
    label: "m2-2",
    path: "/trading/spreads-swaps-commissions",
  },
  {
    label: "m2-3",
    path: "/trading/trading-hours",
  },
  {
    label: "m2-5",
    path: "/trading/accounts",
  },
  {
    label: "m2-6",
    path: "/trading/funding-withdrawals",
  },
  {
    label: "m2-7",
    path: "/trading/get-started",
  },
  {
    label: "m2-8",
    path: "/trading/trading-hours",
  },
];
const platformList = [
  {
    label: "m3-1",
    path: "/trading-platforms/platforms",
  },
  {
    label: "m3-st-h-s0-t1",
    path: "/trading-platforms/social-trading",
  },
  {
    label: "capitalise-ai",
    path: "/trading-platforms/tools/capitalise-ai",
  },
  {
    label: "m2-4",
    path: "/trading-platforms/maintenance-schedule",
  },
];
const analyzeList = [
  {
    label: "m4-1",
    path: "/market-analysis/market-news",
  },
  {
    label: "m4-2",
    path: "/trading-platforms/tools",
  },
  // {
  //   label: "经济日历",
  //   path: "/market-analysis/economic-calendar",
  // },
  {
    label: "m4-3",
    path: "/market-analysis/analysts",
  },
];
const educationList = [
  {
    label: "m5-1",
    path: "/education/learn-forex",
  },
  {
    label: "m5-2",
    path: "/education/learn-trade-cfds",
  },
  {
    label: "m5-3",
    path: "/education/trading-guides",
  },
  // {
  //   label: "线上讲座",
  //   path: "/education/webinars",
  // },
];

// 交易类别菜单 - 数字货币
const tradeCryptoList = [
  {
    label: "yongxuheyue",
    path: "/coin/constract/btc",
    query: { timestamp: Date.now(), RouterName: "sustainable" }, // 永续合约
    isNewMenu: true, // 标记为新菜单，使用 message.home 翻译
  },
  {
    label: "jiaogeheyue",
    path: "/coin/constract/btc",
    query: { timestamp: Date.now(), RouterName: "delivery" }, // 交割合约
    isNewMenu: true,
  },
  // {
  //   label: "xianhuojiaoyishouye",
  //   path: "/coin/spot/btc",
  //   isNewMenu: true,
  // },
];

const tradeStocksList = [
  {
    label: "yongxuheyue",
    path: "/stocks/constract/AAPL.US",
    query: { timestamp: Date.now(), RouterName: "sustainable" }, // 永续合约
    isNewMenu: true, // 标记为新菜单，使用 message.home 翻译
  },
  {
    label: "jiaogeheyue",
    path: "/stocks/constract/AAPL.US",
    query: { timestamp: Date.now(), RouterName: "delivery" }, // 交割合约
    isNewMenu: true,
  },
  {
    label: "xianhuojiaoyishouye",
    path: "/stocks/spot/AAPL.US",
    isNewMenu: true,
  },
];

const headerList = [
  // 新增：市场
  {
    label: "shichang",
    path: "/market",
    isNewMenu: true, // 标记为新菜单，使用 message.user 翻译
  },
  // 新增：数字货币
  {
    label: "shuzihuobi",
    option: tradeCryptoList,
    path: "/coin",
    isNewMenu: true,
  },
  // 新增：股票
  // {
  //   label: "stocks",
  //   option: tradeStocksList,
  //   path: "/stocks",
  //   isNewMenu: true,
  // },
  // 原有菜单（使用 compositeHome 根级别翻译）
  {
    label: "header-s2-1",
    option: whyList,
    path: "/why-demo",
  },
  {
    label: "header-s2-2",
    option: marketList,
    path: "/trading",
  },
  {
    label: "header-s2-3",
    option: platformList,
    path: "/trading-platforms",
  },
  {
    label: "header-s2-4",
    option: analyzeList,
    path: "/market-analysis",
  },
  {
    label: "header-s2-5",
    option: educationList,
    path: "/education",
  },
];

const goPage = (path) => {
  router.push(path);
};
</script>

<style lang="scss" scoped>
// 变量定义
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
$breakpoint-sm: 576px;
$breakpoint-md: 768px;
$breakpoint-lg: 992px;
$breakpoint-xl: 1200px;
$z-index-sticky: 1000;

.new-header {
  position: sticky;
  top: 0;
  height: $header-height;
  background: $color-black;
  border-bottom: 1px solid $color-divider;
  transition: all $transition-base;
  z-index: $z-index-sticky;
  box-sizing: border-box;
  width: 100%;

  &.transparent {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);

    // Logo文字改为黑色
    .logo-text {
      color: $color-black !important;
    }

    // 导航菜单文字改为黑色
    .nav-menu {
      :deep(.el-menu) {
        .el-sub-menu__title,
        .el-menu-item {
          color: $color-black !important;

          &:hover {
            color: $primary-color !important;
          }

          &.is-active {
            color: $primary-color !important;
          }
        }

        .el-sub-menu__icon-arrow {
          color: $color-black !important;
        }
      }
    }

    // 用户操作按钮
    .user-actions {
      .btn-link {
        color: $color-black !important;

        &:hover {
          color: $primary-color !important;
        }
      }

      // 分隔线改为黑色
      .separator-line {
        background-color: rgba(0, 0, 0, 0.2) !important;
      }

      .icon-btn {
        color: #666666 !important;

        &:hover {
          color: $color-black !important;
          background: rgba(0, 0, 0, 0.05) !important;
        }

        .el-icon {
          color: #666666 !important;
        }
      }
    }

    // 移动端菜单按钮
    .mobile-menu-btn {
      color: $color-black !important;
    }
  }

  .container {
    height: 100%;
    width: 100%;
    padding: 0 $spacing-xl;
    box-sizing: border-box;

    @media (max-width: $breakpoint-lg) {
      padding: 0 $spacing-lg;
    }

    @media (max-width: $breakpoint-md) {
      padding: 0 $spacing-md;
    }
  }

  .header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    width: 100%;
    gap: $spacing-xl;
  }

  // 左侧区域：Logo + 导航菜单
  .header-left {
    display: flex;
    align-items: center;
    gap: $spacing-xl;
    flex: 1;
    min-width: 0; // 防止内容溢出

    @media (max-width: $breakpoint-lg) {
      gap: $spacing-md;
    }
  }

  .logo {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: $spacing-md;
    flex-shrink: 0;

    img {
      height: 25px;
      width: auto;
    }

    .logo-text {
      font-size: 22px;
      color: $color-white;
      font-weight: $font-weight-bold;
    }
  }

  .nav-menu {
    flex: 0 1 auto;
    margin-left: $spacing-xl;

    :deep(.el-menu) {
      border-bottom: none;
      background: transparent;

      .el-sub-menu__title,
      .el-menu-item {
        font-size: $font-size-base;
        font-weight: $font-weight-medium;
        color: $color-text-primary;
        border-bottom: 2px solid transparent;
        transition: all $transition-base;
        height: $header-height;
        line-height: $header-height;

        &:hover {
          background: transparent;
          color: $primary-color;
          border-bottom-color: $primary-color;
        }

        &.is-active {
          color: $primary-color;
          border-bottom-color: $primary-color;
        }
      }

      .el-sub-menu__icon-arrow {
        color: $color-text-primary;
      }
    }

    @media (max-width: $breakpoint-lg) {
      display: none;
    }
  }

  // 右侧操作区
  .header-actions {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: $spacing-sm;
    flex-shrink: 0;
    min-width: 400px;

    @media (max-width: $breakpoint-lg) {
      display: none;
    }
  }

  .quick-links {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    font-size: $font-size-sm;

    .quick-link {
      color: $color-text-secondary;
      cursor: pointer;
      transition: color $transition-base;

      &:hover {
        color: $primary-color;
      }
    }
  }

  .user-actions {
    display: flex;
    align-items: center;
    gap: $spacing-md;

    // Element Plus 按钮基础样式重置
    :deep(.el-button) {
      height: auto;
      line-height: 1;

      // 移除 Element Plus 的 focus 样式
      &:focus,
      &:active {
        outline: none;
        border-color: inherit;
      }
    }

    .btn-link {
      color: $color-text-primary !important;
      font-weight: $font-weight-medium;
      background: transparent !important;
      border: none !important;

      &:hover {
        color: $primary-color !important;
        background: transparent !important;
      }

      &:focus,
      &:active {
        color: $color-text-primary !important;
        background: transparent !important;
      }
    }

    .btn-primary {
      background: $primary-color !important;
      color: $color-white !important;
      border: none !important;
      border-radius: $radius-sm;
      padding: 8px 20px;
      font-weight: $font-weight-medium;
      transition: all $transition-base;

      &:hover {
        background: lighten($primary-color, 10%) !important;
        color: $color-white !important;
        transform: translateY(-1px);
      }

      &:focus,
      &:active {
        background: $primary-color !important;
        color: $color-white !important;
      }
    }

    .btn-logout {
      background: transparent !important;
      color: $color-text-secondary !important;
      border: 1px solid $color-divider !important;
      border-radius: $radius-sm;
      padding: 8px 20px;
      font-weight: $font-weight-medium;
      transition: all $transition-base;

      &:hover {
        color: $color-white !important;
        border-color: $color-white !important;
        background: transparent !important;
      }

      &:focus,
      &:active {
        color: $color-text-secondary !important;
        border-color: $color-divider !important;
        background: transparent !important;
      }
    }

    // 通用图标按钮样式（下载、语言选择等）
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

    .separator-line {
      width: 1px;
      height: 20px;
      background-color: white;
      margin: 0px 12px;
    }

    .lang-select {
      cursor: pointer;
      display: flex;
      align-items: center;
    }
  }

  // 移动端菜单按钮
  .mobile-menu-btn {
    display: none;
    font-size: 24px;
    cursor: pointer;
    color: $color-text-primary;

    @media (max-width: $breakpoint-lg) {
      display: block;
    }
  }
}

// 移动端菜单抽屉
.mobile-menu-drawer {
  :deep(.el-drawer__header) {
    margin-bottom: 0;
    padding: $spacing-lg;
    border-bottom: 1px solid $color-divider;
  }

  .drawer-header {
    display: flex;
    align-items: center;
    gap: $spacing-md;

    img {
      height: 25px;
      width: auto;
    }

    span {
      font-size: 18px;
      font-weight: $font-weight-bold;
    }
  }

  .mobile-menu-content {
    padding: $spacing-md;

    .mobile-quick-links {
      padding-bottom: $spacing-lg;
      margin-bottom: $spacing-lg;
      border-bottom: 1px solid $color-divider;

      .mobile-menu-item {
        padding: $spacing-md;
        cursor: pointer;
        font-size: $font-size-sm;
        color: $color-text-secondary;
        transition: all $transition-base;

        &:hover {
          color: $primary-color;
          background: $bg-light;
          border-radius: $radius-sm;
        }
      }
    }

    .mobile-nav-group {
      margin-bottom: $spacing-lg;

      .mobile-nav-title {
        font-size: $font-size-lg;
        font-weight: $font-weight-bold;
        padding: $spacing-md;
        color: $color-text-primary;
      }

      .mobile-menu-item {
        padding: $spacing-md $spacing-lg;
        cursor: pointer;
        font-size: $font-size-base;
        color: $color-text-secondary;
        transition: all $transition-base;
        border-left: 2px solid transparent;

        &:hover {
          color: $primary-color;
          background: $bg-light;
          border-left-color: $primary-color;
        }
      }
    }
  }
}

// Element Plus 下拉菜单样式覆盖
:deep(.el-popper) {
  .el-menu--popup {
    background: $color-black;
    border: 1px solid $color-divider;
    min-width: 200px;

    .el-menu-item {
      color: $color-text-primary;
      font-size: $font-size-base;
      height: 40px;
      line-height: 40px;

      &:hover {
        background: $bg-light;
        color: $primary-color;
      }
    }
  }
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
