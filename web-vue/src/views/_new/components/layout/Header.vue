<template>
  <div class="new-header">
    <div class="container" style="width: 100%">
      <div class="header-inner">
        <div style="display: flex; align-items: center">
          <!-- Logo -->
          <div
            class="logo"
            @click="goHome"
            style="display: flex; align-items: center"
          >
            <img src="@/assets/logo.png" alt="Coinstore" />
            <span style="font-size: 22px; color: #fa05fc">Coinstore</span>
          </div>

          <!-- 导航菜单 -->
          <nav class="nav-menu">
            <el-menu
              mode="horizontal"
              :ellipsis="false"
              @select="handleMenuSelect"
            >
              <el-menu-item index="/quotes">
                {{ $t("newHome.menu.quotes") }}
              </el-menu-item>
              <el-menu-item index="/market">
                {{ $t("newHome.menu.market") }}
              </el-menu-item>
              <el-menu-item index="/contract">
                {{ $t("newHome.menu.contract") }}
              </el-menu-item>
              <el-menu-item index="/launchpad">
                {{ $t("newHome.menu.launchpad") }}
              </el-menu-item>
              <el-menu-item index="/super-pairs">
                {{ $t("newHome.menu.superPairs") }}
              </el-menu-item>

              <!-- Spotlight 下拉菜单 -->
              <el-sub-menu index="spotlight">
                <template #title>
                  {{ $t("newHome.menu.spotlight") }}
                </template>
                <el-menu-item index="/spotlight/projects">
                  {{ $t("newHome.menu.projects") }}
                </el-menu-item>
                <el-menu-item index="/spotlight/events">
                  {{ $t("newHome.menu.events") }}
                </el-menu-item>
              </el-sub-menu>

              <!-- 更多下拉菜单 -->
              <el-sub-menu index="more">
                <template #title>
                  {{ $t("newHome.menu.more") }}
                </template>
                <el-menu-item index="/earn">
                  {{ $t("newHome.menu.earn") }}
                </el-menu-item>
                <el-menu-item index="/nft">
                  {{ $t("newHome.menu.nft") }}
                </el-menu-item>
                <el-menu-item index="/about">
                  {{ $t("newHome.menu.about") }}
                </el-menu-item>
              </el-sub-menu>

              <el-menu-item index="/spin">
                {{ $t("newHome.menu.spin") }}
              </el-menu-item>
            </el-menu>
          </nav>
        </div>

        <!-- 操作区 -->
        <div class="header-actions">
          <!-- 登录按钮 -->
          <el-button v-if="!isLoggedIn" text class="btn-login" @click="goLogin">
            {{ $t("common.login") }}
          </el-button>

          <!-- 注册按钮 -->
          <el-button
            v-if="!isLoggedIn"
            class="btn-register"
            @click="goRegister"
          >
            {{ $t("common.register") }}
          </el-button>

          <!-- 用户菜单 -->
          <el-dropdown
            v-if="isLoggedIn"
            trigger="click"
            @command="handleUserCommand"
          >
            <div class="user-avatar">
              <img v-if="userInfo.avatar" :src="userInfo.avatar" alt="User" />
              <el-icon v-else><User /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  {{ $t("newHome.menu.profile") }}
                </el-dropdown-item>
                <el-dropdown-item command="wallet">
                  {{ $t("newHome.menu.wallet") }}
                </el-dropdown-item>
                <el-dropdown-item command="orders">
                  {{ $t("newHome.menu.orders") }}
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  {{ $t("common.logout") }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <div style="display: flex">
            <!-- 下载 -->
            <div class="icon-btn" @click="handleDownload">
              <el-icon><Download /></el-icon>
            </div>
            <!-- 语言选择 -->
            <LangSelect />
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
          <img src="@/assets/images/logo.png" alt="Coinstore" class="logo" />
        </div>
      </template>
      <div class="mobile-menu-content">
        <!-- 移动端菜单项 -->
        <div
          v-for="item in mobileMenuItems"
          :key="item.index"
          class="mobile-menu-item"
        >
          <div @click="handleMobileMenuClick(item)">
            {{ item.label }}
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useUserStore } from "@/store/user";
import { storeToRefs } from "pinia";
import LangSelect from "@/views/_new/components/common/LangSelect.vue";

const router = useRouter();
const { t } = useI18n();
const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);

const isFixed = ref(false);
const mobileMenuVisible = ref(false);
const notificationCount = ref(0);

const isLoggedIn = computed(() => !!userInfo.value?.token);

const mobileMenuItems = computed(() => [
  { index: "/quotes", label: t("newHome.menu.quotes") },
  { index: "/market", label: t("newHome.menu.market") },
  { index: "/contract", label: t("newHome.menu.contract") },
  { index: "/launchpad", label: t("newHome.menu.launchpad") },
  { index: "/super-pairs", label: t("newHome.menu.superPairs") },
  { index: "/spin", label: t("newHome.menu.spin") },
]);

const handleScroll = () => {
  isFixed.value = window.scrollY > 100;
};

const goHome = () => {
  router.push("/new-home");
};

const goLogin = () => {
  router.push("/login");
};

const goRegister = () => {
  router.push("/register");
};

const handleMenuSelect = (index) => {
  if (index.startsWith("/")) {
    router.push(index);
  }
};

const handleUserCommand = (command) => {
  switch (command) {
    case "profile":
      router.push("/my/profile");
      break;
    case "wallet":
      router.push("/wallet");
      break;
    case "orders":
      router.push("/order");
      break;
    case "logout":
      userStore.logout();
      router.push("/login");
      break;
  }
};

const handleDownload = () => {
  // TODO: 显示下载面板或跳转到下载页面
  console.log("Handle download");
};

const showNotifications = () => {
  // TODO: 显示通知面板
  console.log("Show notifications");
};

const toggleMobileMenu = () => {
  mobileMenuVisible.value = !mobileMenuVisible.value;
};

const handleMobileMenuClick = (item) => {
  router.push(item.index);
  mobileMenuVisible.value = false;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style lang="scss" scoped>
@import "@/views/_new/home/styles/variables.scss";

.new-header {
  position: sticky;
  height: $header-height;
  border-bottom: 1px solid $color-divider;
  transition: all $transition-base;
  z-index: $z-index-sticky;
  &.fixed {
    box-shadow: $shadow-md;
  }
  padding: 0px 12px;
  box-sizing: border-box;

  .container {
    height: 100%;
  }

  .header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    width: 100vw;
    gap: $spacing-xl;
  }

  // 左侧区域：Logo + 导航菜单
  .logo {
    cursor: pointer;
    flex-shrink: 0;

    img {
      height: 32px;
      width: auto;
    }
  }

  .nav-menu {
    flex-shrink: 0;
    margin-left: $spacing-xl;

    :deep(.el-menu) {
      border-bottom: none;
      background: transparent;

      .el-menu-item,
      .el-sub-menu__title {
        font-size: $font-size-base;
        font-weight: $font-weight-medium;
        color: $color-text-primary;
        border-bottom: 2px solid transparent;
        transition: all $transition-base;

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
    }

    @media (max-width: $breakpoint-lg) {
      display: none;
    }
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    margin-right: 24px;

    @media (max-width: $breakpoint-md) {
      .btn-login {
        display: none;
      }
    }

    .notification-badge {
      :deep(.el-badge__content) {
        background: $primary-color;
      }
    }

    .icon-btn {
      font-size: 20px;
      cursor: pointer;
      color: $color-text-secondary;
      transition: color $transition-base;
      margin-right: 12px;
      &:hover {
        color: $color-text-primary;
      }
    }

    .btn-login {
      color: $color-text-primary;
      font-weight: $font-weight-medium;

      &:hover {
        color: $primary-color;
      }
    }

    .btn-register {
      background: $color-black;
      color: $color-white;
      border-radius: $radius-sm;
      padding: 10px 24px;
      font-weight: $font-weight-medium;

      &:hover {
        background: #333;
      }
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      overflow: hidden;
      cursor: pointer;
      background: $bg-light;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all $transition-base;

      &:hover {
        transform: scale(1.05);
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .el-icon {
        font-size: 20px;
        color: $color-text-secondary;
      }
    }
  }

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

.mobile-menu-drawer {
  .drawer-header {
    padding: $spacing-lg;

    .logo {
      height: 32px;
      width: auto;
    }
  }

  .mobile-menu-content {
    padding: $spacing-md;

    .mobile-menu-item {
      padding: $spacing-md;
      border-bottom: 1px solid $color-divider;
      cursor: pointer;
      font-size: $font-size-lg;
      color: $color-text-primary;
      transition: all $transition-base;

      &:hover {
        color: $primary-color;
        background: $bg-light;
      }

      &:last-child {
        border-bottom: none;
      }
    }
  }
}
</style>
