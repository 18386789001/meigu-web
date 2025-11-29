<template>
    <div class="home">
        <!-- 顶部搜索栏 -->
        <div class="header">
            <div class="avatar">
                <Icon icon="carbon:user-avatar" width="24" height="24" />
            </div>
            <div class="search-box">
                <Icon icon="ri:search-line" width="20" height="20" color="#999" />
                <input type="text" :placeholder="$t('搜索.占位符')">
            </div>
            <div class="header-right">
                <Icon icon="material-symbols:headphones" width="24" height="24" />
                <Icon icon="mdi:bell-outline" width="24" height="24" />
            </div>
        </div>

        <!-- 新人礼包banner -->
        <div class="gift-banner">
            <div class="gift-left">
                <div class="gift-icon">
                    <Icon icon="mdi:gift-outline" width="32" height="32" />
                </div>
                <div class="gift-info">
                    <div class="gift-amount">1,000USD {{ $t('新人欢迎.礼包') }}</div>
                    <div class="gift-desc">{{ $t('新人欢迎.新用户') }}</div>
                </div>
            </div>
            <button class="register-btn">{{ $t('新人欢迎.注册') }}</button>
        </div>

        <!-- 功能导航 -->
        <div class="nav-section">
            <div class="nav-item" v-for="(item, index) in navList" :key="index">
                <Icon :icon="item.icon" width="28" height="28" />
                <span class="nav-name">{{ item.name }}</span>
            </div>
        </div>

        <!-- 广告轮播 -->
        <div class="banner-section">
            <div class="banner-item">
                <div class="banner-left">
                    <div class="banner-tag">
                        <Icon icon="ph:fire-bold" color="#ff6b00" width="16" height="16" />
                        {{ $t('活动.热门') }}
                    </div>
                    <div class="banner-title">JD Trader {{ $t('活动.首次交易') }}</div>
                    <button class="join-btn">
                        {{ $t('活动.参与') }}
                        <Icon icon="material-symbols:chevron-right" width="16" height="16" />
                    </button>
                </div>
                <div class="banner-right">
                    <img src="@/assets/trader.png" alt="trader">
                </div>
            </div>
        </div>

        <!-- 市场行情 -->
        <div class="market-section">
            <div class="market-tabs">
                <div v-for="tab in marketTabs" :key="tab.id" :class="['tab-item', { active: currentTab === tab.id }]"
                    @click="currentTab = tab.id">
                    {{ tab.name }}
                </div>
            </div>
            <div class="market-list">
                <div class="market-item" v-for="item in marketData" :key="item.code">
                    <div class="stock-info">
                        <div class="stock-name">{{ item.name }}</div>
                        <div class="stock-code">{{ item.code }}</div>
                    </div>
                    <div class="stock-price">
                        <div class="current-price">{{ item.price }}</div>
                        <div :class="['price-change', item.change >= 0 ? 'up' : 'down']">
                            {{ item.change >= 0 ? '+' : '' }}{{ item.change }}%
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 跟单板块 -->
        <div class="section-block">
            <div class="section-header">
                <h3>{{ $t('板块.跟单') }}</h3>
                <button class="more-btn">
                    {{ $t('通用.更多') }}
                    <Icon icon="material-symbols:chevron-right" width="16" height="16" />
                </button>
            </div>
            <div class="trader-list">
                <div class="trader-card" v-for="trader in traders" :key="trader.id">
                    <div class="trader-info">
                        <img :src="trader.avatar" class="trader-avatar">
                        <div class="trader-detail">
                            <div class="trader-name">{{ trader.name }}</div>
                            <div class="trader-stats">
                                <span>{{ $t('交易员.收益率') }} <b class="up">{{ trader.profit }}%</b></span>
                                <span>{{ $t('交易员.跟随者') }} {{ trader.followers }}</span>
                            </div>
                        </div>
                    </div>
                    <button class="follow-btn">{{ $t('交易员.跟随') }}</button>
                </div>
            </div>
        </div>

        <!-- 理财板块 -->
        <div class="section-block">
            <div class="section-header">
                <h3>{{ $t('板块.理财') }}</h3>
                <button class="more-btn">
                    {{ $t('通用.更多') }}
                    <Icon icon="material-symbols:chevron-right" width="16" height="16" />
                </button>
            </div>
            <div class="finance-list">
                <div class="finance-card" v-for="item in financeProducts" :key="item.id">
                    <div class="finance-info">
                        <div class="finance-name">{{ item.name }}</div>
                        <div class="finance-rate">
                            <span class="rate-num">{{ item.rate }}%</span>
                            <span class="rate-label">{{ $t('理财.年化收益') }}</span>
                        </div>
                        <div class="finance-desc">{{ item.desc }}</div>
                    </div>
                    <button class="invest-btn">{{ $t('理财.投资') }}</button>
                </div>
            </div>
        </div>

        <!-- 资讯板块 -->
        <div class="section-block">
            <div class="section-header">
                <h3>{{ $t('板块.资讯') }}</h3>
                <button class="more-btn">
                    {{ $t('通用.更多') }}
                    <Icon icon="material-symbols:chevron-right" width="16" height="16" />
                </button>
            </div>
            <div class="news-list">
                <div class="news-item" v-for="news in newsList" :key="news.id">
                    <div class="news-content">
                        <div class="news-title">{{ news.title }}</div>
                        <div class="news-meta">
                            <span class="news-source">{{ news.source }}</span>
                            <span class="news-time">{{ news.time }}</span>
                        </div>
                    </div>
                    <img v-if="news.image" :src="news.image" class="news-image">
                </div>
            </div>
        </div>

        <!-- 底部导航 -->
        <div class="bottom-nav">
            <div v-for="item in bottomNavs" :key="item.id" :class="['nav-btn', { active: currentNav === item.id }]"
                @click="currentNav = item.id">
                <Icon :icon="item.icon" width="24" height="24" />
                <span>{{ item.name }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()

// 使用计算属性来处理动态变化的翻译内容
const navList = computed(() => [
    { name: i18n.t('导航.期权'), icon: 'icon-park-outline:chart-stock' },
    { name: i18n.t('导航.美股'), icon: 'icon-park-outline:dollar' },
    { name: i18n.t('导航.A股'), icon: 'icon-park-outline:chinese' },
    { name: i18n.t('导航.港股'), icon: 'icon-park-outline:hk' },
    { name: i18n.t('导航.加密货币'), icon: 'cryptocurrency:btc' },
    { name: i18n.t('导航.资讯'), icon: 'icon-park-outline:news' },
    { name: i18n.t('导航.理财'), icon: 'icon-park-outline:finance' },
    { name: i18n.t('导航.下载'), icon: 'icon-park-outline:download' }
])

const marketTabs = computed(() => [
    { id: 'hot', name: i18n.t('市场.热门') },
    { id: 'us', name: i18n.t('市场.美股') },
    { id: 'a', name: i18n.t('市场.A股') },
    { id: 'hk', name: i18n.t('市场.港股') },
    { id: 'crypto', name: i18n.t('市场.加密货币') },
    { id: 'forex', name: i18n.t('市场.现货') }
])

const bottomNavs = computed(() => [
    { id: 'home', name: i18n.t('底部导航.首页'), icon: 'material-symbols:home-outline' },
    { id: 'market', name: i18n.t('底部导航.市场'), icon: 'material-symbols:analytics-outline' },
    { id: 'trade', name: i18n.t('底部导航.交易'), icon: 'material-symbols:candlestick-chart-outline' },
    { id: 'discover', name: i18n.t('底部导航.发现'), icon: 'material-symbols:explore-outline' },
    { id: 'mine', name: i18n.t('底部导航.我的'), icon: 'material-symbols:person-outline' }
])

const traders = computed(() => [
    {
        id: 1,
        name: i18n.t('交易员.达人A'),
        avatar: "/avatars/trader1.png",
        profit: 289.5,
        followers: "12.5万"
    },
    {
        id: 2,
        name: i18n.t('交易员.达人B'),
        avatar: "/avatars/trader2.png",
        profit: 156.8,
        followers: "8.2万"
    }
])

const financeProducts = computed(() => [
    {
        id: 1,
        name: i18n.t('理财.稳健计划'),
        rate: 12.8,
        desc: i18n.t('理财.稳健描述')
    },
    {
        id: 2,
        name: i18n.t('理财.高收益计划'),
        rate: 25.6,
        desc: i18n.t('理财.高收益描述')
    }
])

const marketData = ref([
    {
        name: '腾讯控股',
        code: 'HK 00700.HK',
        price: '403.800',
        change: 0.00
    },
    {
        name: '英伟达',
        code: 'US NVDA.US',
        price: '146.990',
        change: -0.88
    }
])

const currentTab = ref('hot')
const currentNav = ref('home')

const newsList = ref([
    {
        id: 1,
        title: "比特币突破48000美元，创下年内新高",
        source: "币市快讯",
        time: "10分钟前",
        image: "/news/btc.png"
    },
    {
        id: 2,
        title: "美联储暗示年内可能降息，加密货币市场全线上涨",
        source: "财经日报",
        time: "35分钟前",
        image: "/news/fed.png"
    }
])
</script>

<style scoped>
.home {
    min-height: 100vh;
    background: #f7f7f7;
    padding-bottom: 56px;
}

.header {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    background: #fff;
    position: sticky;
    top: 0;
    z-index: 100;
}

.avatar {
    width: 32px;
    height: 32px;
    border-radius: 16px;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
}

.search-box {
    flex: 1;
    display: flex;
    align-items: center;
    background: #f5f5f5;
    border-radius: 16px;
    margin: 0 12px;
    padding: 6px 12px;
    height: 32px;
}

.search-box input {
    border: none;
    background: transparent;
    margin-left: 8px;
    width: 100%;
    font-size: 14px;
    color: #333;
}

.search-box input::placeholder {
    color: #999;
}

.header-right {
    display: flex;
    gap: 16px;
    color: #666;
}

.gift-banner {
    margin: 12px;
    background: #fff;
    border-radius: 12px;
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.gift-left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.gift-icon {
    color: #ff6b00;
}

.gift-amount {
    font-size: 16px;
    font-weight: 600;
    color: #333;
}

.gift-desc {
    font-size: 12px;
    color: #999;
    margin-top: 4px;
}

.register-btn {
    background: #000;
    color: #fff;
    border: none;
    padding: 8px 20px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
}

.nav-section {
    background: #fff;
    padding: 20px 16px 12px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px 0;
}

.nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
}

.nav-name {
    font-size: 12px;
    color: #333;
}

.banner-section {
    margin: 12px;
}

.banner-item {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.banner-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: #fff0e5;
    color: #ff6b00;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
}

.banner-title {
    margin: 12px 0;
    font-size: 16px;
    font-weight: 600;
    color: #333;
}

.join-btn {
    border: none;
    background: transparent;
    color: #666;
    padding: 4px 0;
    display: flex;
    align-items: center;
    font-size: 14px;
}

.banner-right img {
    width: 120px;
    height: 120px;
    object-fit: contain;
}

.market-section {
    background: #fff;
    margin-top: 12px;
}

.market-tabs {
    display: flex;
    padding: 0 16px;
    border-bottom: 1px solid #f0f0f0;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
}

.market-tabs::-webkit-scrollbar {
    display: none;
}

.tab-item {
    padding: 12px 16px;
    font-size: 14px;
    color: #666;
    position: relative;
    white-space: nowrap;
}

.tab-item.active {
    color: #333;
    font-weight: 600;
}

.tab-item.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 2px;
    background: #000;
    border-radius: 1px;
}

.market-item {
    display: flex;
    justify-content: space-between;
    padding: 16px;
    border-bottom: 1px solid #f0f0f0;
}

.stock-name {
    font-size: 16px;
    color: #333;
    font-weight: 500;
}

.stock-code {
    font-size: 12px;
    color: #999;
    margin-top: 4px;
}

.current-price {
    font-size: 16px;
    text-align: right;
    color: #333;
    font-weight: 500;
}

.price-change {
    font-size: 12px;
    text-align: right;
    margin-top: 4px;
}

.up {
    color: #00c087;
}

.down {
    color: #ff6b6b;
}

.bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    display: flex;
    padding: 6px 0;
    border-top: 1px solid #f0f0f0;
}

.nav-btn {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    font-size: 12px;
    color: #999;
}

.nav-btn.active {
    color: #000;
}

.section-block {
    background: #fff;
    margin-top: 12px;
    padding: 16px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.section-header h3 {
    font-size: 16px;
    font-weight: 600;
    color: #333;
}

.more-btn {
    border: none;
    background: transparent;
    color: #999;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 4px;
}

/* 跟单样式 */
.trader-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.trader-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 8px;
}

.trader-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.trader-avatar {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    object-fit: cover;
}

.trader-name {
    font-size: 15px;
    font-weight: 500;
    color: #333;
}

.trader-stats {
    display: flex;
    gap: 12px;
    font-size: 12px;
    color: #666;
    margin-top: 4px;
}

.follow-btn {
    background: #f0f0f0;
    border: none;
    padding: 6px 16px;
    border-radius: 4px;
    color: #333;
    font-size: 14px;
}

/* 理财样式 */
.finance-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.finance-card {
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.finance-name {
    font-size: 15px;
    font-weight: 500;
    color: #333;
}

.finance-rate {
    margin: 8px 0;
}

.rate-num {
    font-size: 20px;
    font-weight: 600;
    color: #ff6b00;
}

.rate-label {
    font-size: 12px;
    color: #999;
    margin-left: 4px;
}

.finance-desc {
    font-size: 12px;
    color: #666;
}

.invest-btn {
    background: #000;
    color: #fff;
    border: none;
    padding: 8px 20px;
    border-radius: 4px;
    font-size: 14px;
}

/* 资讯样式 */
.news-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.news-item {
    display: flex;
    gap: 12px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;
}

.news-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
}

.news-content {
    flex: 1;
}

.news-title {
    font-size: 15px;
    color: #333;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.news-meta {
    margin-top: 8px;
    font-size: 12px;
    color: #999;
    display: flex;
    gap: 12px;
}

.news-image {
    width: 100px;
    height: 70px;
    border-radius: 4px;
    object-fit: cover;
}
</style>