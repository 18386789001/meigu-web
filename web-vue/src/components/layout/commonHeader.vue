<template>
    <div class="msx-header-container">
        <div class="page-header-background">
            <div class="page-header-content page-header-box">
                <!-- 左侧菜单 -->
                <div class="left-page-header">
                    <!-- Logo -->
                    <div @click="goRouter('/')" class="logo">
                        <img :src="logoSrc" alt="GLOBEX Logo" />
                        <span class="logo-text">GLOBEX</span>
                    </div>

                    <!-- 导航菜单 -->
                    <div class="nav-menu">
                        <!-- RWA Dropdown -->
                        <el-dropdown trigger="hover" popper-class="msx-dark-dropdown" :show-timeout="0"
                            :hide-timeout="200">
                            <div class="nav-item">
                                RWA
                                <el-icon class="arrow-icon">
                                    <ArrowDown />
                                </el-icon>
                            </div>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item class="msx-menu-item">
                                        <div class="item-content">
                                            <div class="text">
                                                <div class="title">Spot</div>
                                                <div class="desc">Real Value On-Chain</div>
                                            </div>
                                        </div>
                                    </el-dropdown-item>
                                    <el-dropdown-item class="msx-menu-item" @click="navigateToRWAFutures">
                                        <div class="item-content">
                                            <div class="text">
                                                <div class="title">Futures</div>
                                                <div class="desc">Trade RWA Perpetuals</div>
                                            </div>
                                        </div>
                                    </el-dropdown-item>
                                    <el-dropdown-item class="msx-menu-item">
                                        <div class="item-content">
                                            <div class="text">
                                                <div class="title">Options</div>
                                                <div class="desc">Manage Risk with Options</div>
                                            </div>
                                        </div>
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>

                        <!-- Crypto Dropdown -->
                        <el-dropdown trigger="hover" popper-class="msx-dark-dropdown" :show-timeout="0"
                            :hide-timeout="200">
                            <div class="nav-item">
                                Crypto
                                <el-icon class="arrow-icon">
                                    <ArrowDown />
                                </el-icon>
                            </div>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item class="msx-menu-item">
                                        <div class="item-content">
                                            <div class="text">
                                                <div class="title">Spot</div>
                                                <div class="desc">Trade Top Crypto Assets</div>
                                            </div>
                                        </div>
                                    </el-dropdown-item>
                                    <el-dropdown-item class="msx-menu-item">
                                        <div class="item-content">
                                            <div class="text">
                                                <div class="title">Futures</div>
                                                <div class="desc">Trade USDT Perpetuals</div>
                                            </div>
                                        </div>
                                    </el-dropdown-item>
                                    <el-dropdown-item class="msx-menu-item">
                                        <div class="item-content">
                                            <div class="text">
                                                <div class="title">Watchlist</div>
                                                <div class="desc">Add Favorites Instantly</div>
                                            </div>
                                        </div>
                                    </el-dropdown-item>
                                    <el-dropdown-item class="msx-menu-item">
                                        <div class="item-content">
                                            <div class="text">
                                                <div class="title">Bridge</div>
                                                <div class="desc">Transfer Assets Across Chains</div>
                                            </div>
                                        </div>
                                    </el-dropdown-item>
                                    <el-dropdown-item class="msx-menu-item">
                                        <div class="item-content">
                                            <div class="text">
                                                <div class="title">Options</div>
                                                <div class="desc">Manage Crypto Risk Strategically</div>
                                            </div>
                                        </div>
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>

                        <!-- Referrals Dropdown -->
                        <el-dropdown trigger="hover" popper-class="msx-dark-dropdown" :show-timeout="0"
                            :hide-timeout="200">
                            <div class="nav-item">
                                Referrals
                                <el-icon class="arrow-icon">
                                    <ArrowDown />
                                </el-icon>
                            </div>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item class="msx-menu-item">
                                        <div class="item-content">
                                            <div class="text">
                                                <div class="title">Invite Friends</div>
                                                <div class="desc">Share with friends, create value together, earn up to
                                                    20% commission</div>
                                            </div>
                                        </div>
                                    </el-dropdown-item>
                                    <el-dropdown-item class="msx-menu-item">
                                        <div class="item-content">
                                            <div class="text">
                                                <div class="title">Affiliate Program</div>
                                                <div class="desc">Become an affiliate, unlock exclusive rewards, earn up
                                                    to 30% commission</div>
                                            </div>
                                        </div>
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>

                        <!-- Reward Dropdown -->
                        <el-dropdown trigger="hover" popper-class="msx-dark-dropdown" :show-timeout="0"
                            :hide-timeout="200">
                            <div class="nav-item reward-item">
                                <div class="diamond-icon"></div>
                                Reward
                                <el-icon class="arrow-icon">
                                    <ArrowDown />
                                </el-icon>
                            </div>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item class="msx-menu-item">
                                        <div class="item-content">
                                            <div class="text">
                                                <div class="title">Points</div>
                                                <div class="desc">Earn points, unlock hidden wealth!</div>
                                            </div>
                                        </div>
                                    </el-dropdown-item>
                                    <el-dropdown-item class="msx-menu-item">
                                        <div class="item-content">
                                            <div class="text">
                                                <div class="title">Rewards Hub</div>
                                                <div class="desc">Exclusive gifts and surprises, all in the rewards hub!
                                                </div>
                                            </div>
                                        </div>
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                </div>

                <!-- 右侧菜单 -->
                <div class="right-page-header">
                    <!-- 货币选择 Dropdown -->
                    <el-dropdown trigger="hover" popper-class="msx-currency-pop" @command="handleCurrencyChange">
                        <div class="currency-selector">
                            <img :src="currentCurrency.icon" class="currency-icon" />
                            <span class="currency-name">{{ currentCurrency.name }}</span>
                            <el-icon class="arrow-icon">
                                <ArrowDown />
                            </el-icon>
                        </div>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item v-for="item in currencyList" :key="item.name" :command="item"
                                    class="currency-item" :class="{ active: currentCurrency.name === item.name }">
                                    <div class="currency-row">
                                        <img :src="item.icon" class="item-icon" />
                                        <span class="item-name">{{ item.fullName }}</span>
                                        <div v-if="currentCurrency.name === item.name" class="active-dot"></div>
                                    </div>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>

                    <!-- 图标按钮 -->
                    <div class="icon-btn">
                        <img :src="bellIconSrc" alt="Notifications" />
                    </div>
                    <div class="icon-btn">
                        <img :src="earthIconSrc" alt="Language" />
                    </div>
                    <div class="icon-btn" @click="toggleTheme">
                        <img :src="themeIconSrc" alt="Theme" />
                    </div>

                    <!-- Connect Wallet Button -->
                    <button class="connect-wallet-btn">Connect wallet</button>
                </div>
            </div>
        </div>
    </div>

  </template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ArrowDown } from "@element-plus/icons-vue";

const router = useRouter();

// 图标引用
const logoSrc = "/image/logo.png";

// 响应式图标引用
const bellIconSrc = computed(() => {
  return isDarkMode.value ? "/image/bell-white.png" : "/image/bell-black.png";
});

const earthIconSrc = computed(() => {
  return isDarkMode.value ? "/image/earth-white.png" : "/image/earth-black.png";
});

// 主题状态管理
const isDarkMode = ref(localStorage.getItem('theme') === 'light' ? false : true);

// 计算主题图标
const themeIconSrc = computed(() => {
  return isDarkMode.value ? "/image/moon.png" : "/image/sun.png";
});

// 主题切换函数
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  const newTheme = isDarkMode.value ? 'dark' : 'light';
  localStorage.setItem('theme', newTheme);
  document.body.className = newTheme;
};

// 初始化主题
onMounted(() => {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  isDarkMode.value = savedTheme === 'light' ? false : true;
  document.body.className = savedTheme;
});

// 货币列表
const currencyList = [
    { name: "SOL", fullName: "Solana", icon: "/image/SOL.webp" },
    { name: "BSC", fullName: "BNB Chain", icon: "/image/BNB.webp" },
    { name: "ETH", fullName: "Ethereum", icon: "/image/WTH.webp" },
    { name: "TRX", fullName: "TRONIX", icon: "/image/TRON.webp" },
];

const currentCurrency = ref(currencyList[0]);

const handleCurrencyChange = (item) => {
    currentCurrency.value = item;
};

const goRouter = (path) => {
    router.push(path);
};

const navigateToRWAFutures = () => {
    const timestamp = Date.now();
    router.push({
        path: '/coin/constract/btc',
        query: {
            timestamp: timestamp,
            RouterName: 'sustainable'
        }
    });
};
</script>

<style lang="scss">
/* 强制覆盖 Element Plus Dropdown 样式 - 全局生效 */
/* 使用 CSS 变量覆盖 Element Plus 的默认颜色，这是最稳健的方法 */
.el-popper.msx-dark-dropdown {
    --el-bg-color-overlay: #1a1a1a !important;
    --el-text-color-regular: #fff !important;
    --el-border-color-light: #333 !important;
    --el-fill-color-light: #2c2c2c !important;
    --el-dropdown-menuItem-hover-fill: #2c2c2c !important;
    --el-dropdown-menuItem-hover-color: #fff !important;

    background-color: var(--el-bg-color-overlay) !important;
    border: 1px solid var(--el-border-color-light) !important;
    margin-top: 12px !important;
    /* 增加与导航栏的间距 */

    /* 隐藏小箭头 */
    .el-popper__arrow {
        display: none !important;
    }

    .el-dropdown-menu {
        background-color: transparent !important;
        padding: 8px !important;
    }

    .el-dropdown-menu__item {
        color: var(--el-text-color-regular) !important;
        border-radius: 4px;
        padding: 10px 16px !important;
        margin-bottom: 2px;

        &:hover,
        &:focus {
            background-color: var(--el-fill-color-light) !important;
            color: #fff !important;
        }
    }
}

/* 货币选择器专用样式 - 间距更小 */
.el-popper.msx-currency-pop {
    --el-bg-color-overlay: #1a1a1a !important;
    --el-text-color-regular: #fff !important;
    --el-border-color-light: #333 !important;
    --el-fill-color-light: #2c2c2c !important;
    --el-dropdown-menuItem-hover-fill: #2c2c2c !important;
    --el-dropdown-menuItem-hover-color: #fff !important;

    background-color: var(--el-bg-color-overlay) !important;
    border: 1px solid var(--el-border-color-light) !important;
    margin-top: 4px !important;
    /* 紧贴导航栏 */

    /* 隐藏小箭头 */
    .el-popper__arrow {
        display: none !important;
    }

    .el-dropdown-menu {
        background-color: transparent !important;
        padding: 8px !important;
    }

    .el-dropdown-menu__item {
        color: var(--el-text-color-regular) !important;
        border-radius: 4px;
        padding: 10px 16px !important;
        margin-bottom: 2px;

        &:hover,
        &:focus {
            background-color: var(--el-fill-color-light) !important;
            color: #fff !important;
        }
    }
}

/* 确保图片大小正确，防止图片过大撑开布局 */
.msx-dark-dropdown .currency-item .currency-row .item-icon,
.msx-currency-pop .currency-item .currency-row .item-icon {
    width: 24px !important;
    height: 24px !important;
    border-radius: 50%;
    object-fit: cover;
    display: block;
}

/* 菜单项内容布局 */
.msx-dark-dropdown .msx-menu-item .item-content {
    display: flex;
    align-items: flex-start;
    gap: 12px;

    .text {
        display: flex;
        flex-direction: column;

        .title {
            font-size: 14px;
            font-weight: 600;
            color: #fff;
            line-height: 1.2;
        }

        .desc {
            font-size: 12px;
            color: #888;
            margin-top: 4px;
            white-space: normal;
            max-width: 200px;
        }
    }
}

/* 货币选择器行布局 */
.msx-dark-dropdown .currency-item .currency-row,
.msx-currency-pop .currency-item .currency-row {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 10px;

    .item-name {
        font-size: 14px;
        color: #fff;
        font-weight: 500;
        flex: 1;
    }

    .active-dot {
        width: 6px;
        height: 6px;
        background-color: #bcff2f;
        border-radius: 50%;
        box-shadow: 0 0 4px #bcff2f;
    }
}
</style>

<style lang="scss" scoped>
.msx-header-container {
    width: 100%;
    background-color: #000;
}

.page-header-background {
    height: 64px;
    background-color: #000;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    padding: 0 24px;
}

.page-header-content {
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.left-page-header {
    display: flex;
    align-items: center;
    gap: 40px;
}

.logo {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: -30px;

    img {
        height: 56px;
        width: auto;
    }

    .logo-text {
        font-size: 22px;
        font-weight: bold;
        color: #fff;
    }
}

.nav-menu {
    display: flex;
    align-items: center;
    gap: 24px;

    /* Remove focus outline for all dropdowns */
    :deep(.el-dropdown),
    :deep(.el-tooltip__trigger) {
        outline: none !important;
        border: none !important;
    }

    .nav-item {
        color: #fff;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 4px;
        transition: color 0.3s;
        outline: none !important;

        &:hover {
            color: #bcff2f;

            .arrow-icon {
                transform: rotate(180deg);
            }
        }

        .arrow-icon {
            font-size: 12px;
            transition: transform 0.3s;
        }

        &.reward-item {
            .diamond-icon {
                width: 16px;
                height: 16px;
                margin-right: 2px;
                background-image: url('/image/diamond-white.png');
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
                transition: background-image 0.3s ease;
            }

            &:hover .diamond-icon {
                background-image: url('/image/diamond-green.png');
            }
        }
    }
}

.right-page-header {
    display: flex;
    align-items: center;
    gap: 16px;

    /* Remove focus outline for dropdowns */
    :deep(.el-dropdown),
    :deep(.el-tooltip__trigger) {
        outline: none !important;
        border: none !important;
    }
}

.currency-selector {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #1a1a1a;
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.3s;
    outline: none !important;

    &:hover {
        background: #2c2c2c;

        .arrow-icon {
            transform: rotate(180deg);
        }
    }

    .currency-icon {
        width: 20px;
        height: 20px;
        border-radius: 50%;
    }

    .currency-name {
        color: #fff;
        font-size: 14px;
        font-weight: 600;
    }

    .arrow-icon {
        color: #888;
        font-size: 12px;
        transition: transform 0.3s;
    }
}

.icon-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 50%;
    transition: background 0.3s;

    &:hover {
        background: rgba(255, 255, 255, 0.1);
    }

    img {
        width: 20px;
        height: 20px;
    }
}

.connect-wallet-btn {
    background: #bcff2f;
    color: #000;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
        background: #a8e628;
        transform: translateY(-1px);
    }
}
</style>

<!-- 白天模式样式 -->
<style lang="scss">
/* 全局白天模式样式 */
body.light {
  background-color: #ffffff !important;
  color: #333 !important;
}

/* Header白天模式样式 */
body.light .msx-header-container {
  background-color: #ffffff !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
}

body.light .page-header-background {
  background-color: #ffffff !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
}

body.light .logo-text {
  color: #333 !important;
}

body.light .nav-item {
  color: #333 !important;

  &:hover {
    color: #bcff2f !important;
  }
}

body.light .currency-selector {
  background: #f5f5f5 !important;

  &:hover {
    background: #e8e8e8 !important;
  }

  .currency-name {
    color: #333 !important;
  }

  .arrow-icon {
    color: #666 !important;
  }
}

body.light .icon-btn {
  &:hover {
    background: rgba(0, 0, 0, 0.05) !important;
  }
}

/* 禁用货币选择器的过渡动画 */
.currency-selector,
.currency-selector *,
.currency-item,
.currency-item * {
  transition: background-color 0s, color 0s, transform 0s !important;
}

/* 禁用Element Plus下拉菜单的过渡动画 */
.el-dropdown,
.el-dropdown *,
.el-popper,
.el-popper *,
.el-dropdown-menu,
.el-dropdown-menu *,
.el-dropdown-item,
.el-dropdown-item * {
  transition: all 0s !important;
  animation-duration: 0s !important;
}

/* 移除货币选择下拉菜单项目的边框 */
.msx-currency-pop .el-dropdown-menu,
.msx-currency-pop .el-dropdown-menu .el-dropdown-item,
.msx-currency-pop .currency-item {
  border: none !important;
  border-bottom: none !important;
  border-top: none !important;
  outline: none !important;
}

/* 移除所有分隔线 */
.msx-currency-pop .el-dropdown-menu .el-dropdown-menu__item {
  border-bottom: none !important;
}

/* Element Plus Dropdown 白天模式覆盖 */
body.light .el-popper.msx-dark-dropdown,
body.light .el-popper.msx-currency-pop {
  --el-bg-color-overlay: #ffffff !important;
  --el-text-color-regular: #333 !important;
  --el-border-color-light: #ddd !important;
  --el-fill-color-light: #f5f5f5 !important;
  --el-dropdown-menuItem-hover-fill: #f5f5f5 !important;
  --el-dropdown-menuItem-hover-color: #333 !important;

  background-color: var(--el-bg-color-overlay) !important;
  border: 1px solid var(--el-border-color-light) !important;

  .el-dropdown-menu__item {
    color: var(--el-text-color-regular) !important;

    &:hover,
    &:focus {
      background-color: var(--el-fill-color-light) !important;
      color: #333 !important;
    }
  }
}

body.light .currency-item .currency-row .item-name {
  color: #333 !important;
}

body.light .msx-menu-item .item-content .text {
  .title {
    color: #333 !important;
  }

  .desc {
    color: #666 !important;
  }
}

/* 钻石图标白天模式 */
body.light .reward-item .diamond-icon {
  background-image: url('/image/diamond-black.png') !important;
}

body.light .reward-item:hover .diamond-icon {
  background-image: url('/image/diamond-green.png') !important;
}
</style>
