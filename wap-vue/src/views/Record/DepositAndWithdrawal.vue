<template>
    <div class="Record pb-12">
        <fx-header fixed>
            <template #title>{{ $t("rechargeWithRecord") }}</template>
        </fx-header>
        <div class="tab-fixed">
            <van-tabs v-model:active="active" @click-tab="onClickTab">
                <van-tab v-for="(item, index) in tabList" :key="index" :title="item.name">
                </van-tab>
            </van-tabs>
        </div>
        <div class="list-wrap px-8 pt-8">
            <div class="tab-wrap flex px-4 mt-5">
                <div class="tab-item mr-4" :class="[selectIndexActive === index ? 'active' : '']"
                    v-for="(item, index) in tabListTwo" :key="index" @click="changeCoin(index)">{{ item }}</div>
            </div>
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh" :pulling-text="t('下拉即可刷新')"
                :loosing-text="t('释放即可刷新')" :loading-text="t('加载中...')">
                <div v-if="noData" class="pt-20 text-center">
                    {{ $t('noData') }}
                </div>
                <template v-else>
                    <van-list v-model:loading="loading" :finished="finished" :loading-text="$t('loading')"
                        :finished-text="$t('noMore')" @load="onLoad">
                        <ul>
                            <li class="px-4 mt-10" v-for="(item, _index) in list" :key="_index" @click="openDetails(item)">
                                <div class="flex  justify-between">
                                    <div class="type">{{ getCurrencyDisplay(item) }}</div>
                                    <div class="money"> {{ item.amount }}</div>
                                </div>
                                <div class="flex mt-1 justify-between">
                                    <div class="time">{{ getTimeDisplay(item) }}</div>
                                    <div class="status flex">
                                        <!-- 银行卡充值记录状态映射 -->
                                        <template v-if="selectIndexActive == 0">
                                            <!-- 银行卡充值记录：状态3=成功，状态4=已取消 -->
                                            <template v-if="getStatusValue(item) == 3">
                                                <div class="status-icon status-icon-color1 mr-2"></div>
                                                <span class="status-text status-text-success">{{ $t('success') }}</span>
                                            </template>
                                            <template v-else-if="getStatusValue(item) == 4">
                                                <div class="status-icon status-icon-color4 mr-2"></div>
                                                <span class="status-text status-text-cancelled">{{ $t('Cancelled') }}</span>
                                            </template>
                                            <!-- 其他状态值显示为确认中 -->
                                            <template v-else>
                                                <div class="status-icon status-icon-color3 mr-2"></div>
                                                <span class="status-text status-text-pending">{{ $t('confirming') }}</span>
                                            </template>
                                        </template>
                                        <!-- 数字货币充提记录状态映射 -->
                                        <template v-if="selectIndexActive != 0">
                                            <template v-if="getStatusValue(item) == 0 && !isEthConverted(item)">
                                                <div class="status-icon status-icon-color3 mr-2"></div>
                                                <span class="status-text status-text-pending">{{ $t('confirming') }}</span>
                                            </template>
                                            <template v-if="getStatusValue(item) == 1 || isEthConverted(item)">
                                                <div class="status-icon status-icon-color1 mr-2"></div>
                                                <template v-if="isEthConverted(item)">
                                                    <span class="status-text status-text-success">{{ $t('ethConvertedToUsdtNotice') }}</span>
                                                </template>
                                                <template v-else>
                                                    <span class="status-text status-text-success">{{ $t('success') }}</span>
                                                </template>
                                            </template>
                                            <template v-if="getStatusValue(item) == 2 && !isEthConverted(item)">
                                                <div class="status-icon status-icon-color2 mr-2"></div>
                                                <span class="status-text status-text-failed">{{ $t('fail') }}</span>
                                            </template>
                                        </template>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </van-list>
                </template>

            </van-pull-refresh>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { _foreignRechargeWith, _getRechargeList, _getRechargeBlockchainList } from "@/service/recharge.api";
import { _withdrawList, _getWithdrawList } from "@/service/withdraw.api";
import { useI18n } from "vue-i18n";
import { getStorage, setStorage } from '@/utils/index'
const { t } = useI18n()

const router = useRouter()
const route = useRoute()
let active = ref(0)
let selectIndexActive = ref(0)
const list = ref([]);
const loading = ref(false);
const refreshing = ref(false)
const noData = ref(false)
const finished = ref(false);
const id = ref(1)
const tabList = ref([
    {
        name: t('recharge'),
        direction: 'recharge'
    },
    {
        name: t('withdraw'),
        direction: 'withdraw'
    }
])

onMounted(() => {
    // console.log(getters)
    let recordId = getStorage('recordId')
    id.value = recordId
    if (id.value == 1 || id.value == 2) {
        active.value = 0
        if (id.value == 2) {
            selectIndexActive.value = 1
        } else {
            selectIndexActive.value = 0
        }
    } else {
        active.value = 1
        if (id.value == 4) {
            selectIndexActive.value = 1
        } else {
            selectIndexActive.value = 0
        }
    }
})
let currentTab = ref({
    name: t('recharge'),
    direction: 'recharge'
})
const tabListTwo = [t('foreignCurrency'), t('digitalCurrency')]
const page = ref(1)
const onClickTab = () => {
    currentTab.value = tabList.value[active.value]
    id.value = active.value
    if (active.value == 0) {
        if (selectIndexActive.value == 0) {
            setStorage('recordId', 1)
        } else {
            setStorage('recordId', 2)
        }
    } else {
        if (selectIndexActive.value == 0) {
            setStorage('recordId', 3)
        } else {
            setStorage('recordId', 4)
        }
    }
    onRefresh()
}
const changeCoin = (index) => {
    selectIndexActive.value = index
    if (active.value == 0) {
        if (selectIndexActive.value == 0) {
            setStorage('recordId', 1)
        } else {
            setStorage('recordId', 2)
        }
    } else {
        if (selectIndexActive.value == 0) {
            setStorage('recordId', 3)
        } else {
            setStorage('recordId', 4)
        }
    }
    onRefresh()
}
const onLoad = () => {
    // 异步更新数据

    if (selectIndexActive.value == 0) {
        // 银行卡充提记录
        foreignRechargeWith()
    } else {
        // 数字货币充提记录
        if (active.value == 0) {
            // 充值记录
            getRechargeBlockchainList()
        } else {
            // 提现记录
            getWithdrawList()
        }
    }

}
const openDetails = (item) => {
    if (selectIndexActive.value == 0) {
        // 银行卡充提记录，跳转到原有详情页面
        router.push('/Record/RecordDetails?orderNo=' + item.order_no + '&type=' + selectIndexActive.value +
            '&isCZ=' + active.value)
    } else {
        // 数字货币充提记录，跳转到新的详情页面
        if (active.value == 0) {
            // 充值详情页面
            router.push('/cryptos/recharge/rechargeDetail?order_no=' + item.order_no)
        } else {
            // 提现详情页面
            router.push('/cryptos/withdraw/withdrawDetail?order_no=' + item.order_no)
        }
    }
}
// 银行卡充值
const foreignRechargeWith = () => {
    _foreignRechargeWith({
        page_no: page.value,
        direction: tabList.value[active.value].direction
    }).then((res) => {
        list.value = []
        refreshing.value = false;
        // if (res.length < 8) {
        //     finished.value = true
        // }

        list.value = list.value.concat(res);
        loading.value = false;
        finished.value = true
        // 如果没有数据，显示暂无数据
        if (list.value.length === 0 && page.value === 1) {
            noData.value = true
        }
        page.value++;
    })
}
// usdt充值
const getRechargeList = () => {
    _getRechargeList({
        page_no: page.value
    }).then((res) => {

        list.value = []
        refreshing.value = false;
        // if (res.length < 8) {
        //     finished.value = true
        // }
        loading.value = false;
        finished.value = true
        list.value = list.value.concat(res);
        // 如果没有数据，显示暂无数据
        if (list.value.length === 0 && page.value === 1) {
            noData.value = true
        }
        page.value++;
    });
}
// usdt提现记录
const withdrawList = () => {
    _withdrawList({
        page_no: page.value
    }).then((res) => {
        refreshing.value = false;
        loading.value = false;
        list.value = list.value.concat(res);
        finished.value = true
        // 如果没有数据，显示暂无数据
        if (list.value.length === 0 && page.value === 1) {
            noData.value = true
        }
        // 如果加载完毕，显示没有更多了
        // if (res.length < 8) {
        //     finished.value = true
        // }
        page.value++;
    });
}

// 新的数字货币充值记录API
const getRechargeBlockchainList = () => {
    _getRechargeBlockchainList({
        page_no: page.value,
        language: 'zh-CN'
    }).then((res) => {
        list.value = []
        refreshing.value = false;
        loading.value = false;
        finished.value = true
        list.value = list.value.concat(res);
        // 如果没有数据，显示暂无数据
        if (list.value.length === 0 && page.value === 1) {
            noData.value = true
        }
        page.value++;
    });
}

// 新的数字货币提现记录API
const getWithdrawList = () => {
    _getWithdrawList({
        page_no: page.value,
        language: 'zh-CN'
    }).then((res) => {
        refreshing.value = false;
        loading.value = false;
        list.value = list.value.concat(res);
        finished.value = true
        // 如果没有数据，显示暂无数据
        if (list.value.length === 0 && page.value === 1) {
            noData.value = true
        }
        page.value++;
    });
}
const onRefresh = () => {
    finished.value = false
    loading.value = true
    list.value = []
    page.value = 1
    noData.value = false
    onLoad()

}

// 获取货币显示
const getCurrencyDisplay = (item) => {
    if (selectIndexActive.value == 0) {
        // 银行卡充提记录
        return item.currency
    } else {
        // 数字货币充提记录
        return item.coin
    }
}

// 获取时间显示
const getTimeDisplay = (item) => {
    if (selectIndexActive.value == 0) {
        // 银行卡充提记录
        return item.create_time
    } else {
        // 数字货币充提记录
        return item.createtime
    }
}

// 获取状态值
const getStatusValue = (item) => {
    if (selectIndexActive.value == 0) {
        // 银行卡充提记录
        return item.state !== undefined ? item.state : 0; // 默认返回0（确认中）
    } else {
        // 数字货币充提记录
        return item.status !== undefined ? item.status : 0; // 默认返回0（确认中）
    }
}

// 判断是否为ETH转换状态
const isEthConverted = (item) => {
    if (selectIndexActive.value == 0) {
        // 银行卡充提记录不涉及ETH转换
        return false
    } else {
        // 数字货币充提记录，检查failure_msg
        return item.failure_msg === '当前币种为eth直接完成订单'
    }
}
</script>
<style lang="scss" scoped>
:deep(.van-tabs__line) {
    background: $btn_main;
}

:deep(.van-tab) {
    font-size: 16px;
}

:deep(.van-tabs__nav) {
    background: $select-bg;
}

:deep(.van-tab__text) {
    color: $text_color;
}

.Record {
    padding-top: var(--van-nav-bar-height);
    font-size: 14px;
}

.tab-fixed {
    // position: fixed;
    // top: var(--van-nav-bar-height);
    width: 100%;
    z-index: 2;
}

.tab-wrap {
    .tab-item {
        padding: 0 20px;
        height: 32px;
        text-align: center;
        line-height: 31px;
        color: $text_color1;
        border-radius: 20px;
        font-size: 14px;
    }

    .active {
        background: $btn_main;
        color: $main-btn-color;
    }
}

ul {
    li {
        .type {
            font-size: 18px;
        }

        .money {
            font-weight: bold;
            font-size: 16px;
        }

        .time {
            color: $dark-grey;
            font-size: 14px;
        }

        .status {
            color: $dark-grey;
            align-items: center;
            font-size: 14px;
        }
    }
}


.status-icon {
    width: 8px;
    height: 8px;
    border-radius: 50%;
}

.status-icon-color1 {
    background: $green;
}

.status-icon-color2 {
    background: #EA0F0F;
}

.status-icon-color3 {
    background: #F5D658;
}

.status-icon-color4 {
    background: #007bff;
}

// 状态文本颜色
.status-text {
    font-size: 14px;
}

.status-text-success {
    color: $green;
}

.status-text-failed {
    color: #EA0F0F;
}

.status-text-pending {
    color: #F5D658;
}

.status-text-cancelled {
    color: #007bff;
}
</style>