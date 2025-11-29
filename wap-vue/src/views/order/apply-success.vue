<template>
    <div class="success">
        <fx-header :back="false" @back="$router.push('/trade/index')">
        </fx-header>
        <img class="success-img" src="../../assets/image/order/success-bg.png" />
        <p class="title mt-5">{{ currentType == 'recharge' ? $t('recharge') : $t('withdraw') }} {{
            $t('successfulApplication')
        }}</p>
        <ul class="pl-10 pr-10 mt-20">
            <li class="mt-8">
                <div>{{ currentType == 'recharge' ? $t('recharge') : $t('withdraw') }} {{ $t('applicationSubmitted') }}
                </div>
                <p class="mt-2 text-26">{{ getCurrentTime() }}</p>
            </li>
            <li class="mt-8">
                <div>{{ currentType == 'recharge' ? $t('recharge') : $t('withdraw') }} {{ $t('applicationSubmitted') }}
                </div>
                <p class="mt-2 text-26">{{ currentType == 'recharge' ? $t('recharge') : $t('withdraw') }}{{
                    $t('ContactCustomerService')
                }}</p>
            </li>
            <li class="mt-8">
                <div>{{ currentType == 'recharge' ? $t('recharge') : $t('withdraw') }} {{ $t('succeeded') }}</div>
                <p class="mt-2 text-26">{{ $t('Youinformation') }}</p>
            </li>
        </ul>
        <!-- 客服按钮 - 中间显眼位置 -->
        <div class="customer-service-section">
            <van-button class="customer-service-btn" type="success" @click="contactCustomerService">
                <van-icon name="service" class="service-icon" />
                {{ $t('contactCustomerServiceQuickly') || '请尽快联系客服！' }}
            </van-button>
        </div>
        
        <!-- 查看历史按钮 - 底部 -->
        <div class="px-10 mt-20 w-but">
            <van-button class="w-full" type="primary" @click="toHistory">{{ $t('Check') }} {{ currentType == 'recharge' ?
                $t('recharge') : $t('withdraw')
            }}{{ $t('history') }}</van-button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { setStorage } from '@/utils/index'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const currentType = ref('')
const id = ref(2)
const type = ref('bank')

onMounted(() => {
    currentType.value = route.query.currentType
    type.value = route.query.type

})
const toHistory = () => {
    if (type.value == 'bank') {
        id.value = 3
    } else {
        if (currentType.value == 'withdraw') {
            id.value = 4
        } else {
            id.value = 2
        }
    }
    setStorage('recordId', id.value)
    router.push('/Record/DepositAndWithdrawal')
}

const contactCustomerService = async () => {
    const { openThirdPartyCustomerService } = await import('@/utils/customerService.js');
    await openThirdPartyCustomerService(router);
}
const getCurrentTime = () => {
    var date = new Date();//当前时间
    var year = date.getFullYear() //返回指定日期的年份
    var month = repair(date.getMonth() + 1);//月
    var day = repair(date.getDate());//日
    var hour = repair(date.getHours());//时
    var minute = repair(date.getMinutes());//分
    var second = repair(date.getSeconds());//秒

    //当前时间 
    var curTime = year + "-" + month + "-" + day
        + " " + hour + ":" + minute + ":" + second;
    return curTime;
}
const repair = (i) => {
    if (i >= 0 && i <= 9) {
        return "0" + i;
    } else {
        return i;
    }
}
</script>
<style lang="scss" scoped>
.success {

    .success-img {
        width: 73px;
        height: 73px;
        display: block;
        margin: 0 auto;
        margin-top: 50px;
    }

    .title {
        font-size: 22px;
        font-weight: bold;
        text-align: center;
    }

    .assets {
        color: $active_line;
    }

    .w-but {
        position: fixed;
        bottom: 20px;
        width: 100%;
    }

    ul {
        li {
            div {
                font-size: 16px;
                color: $text_color;
            }

            p {
                color: $dark-grey;
            }
        }
    }

    // 客服按钮样式
    .customer-service-section {
        display: flex;
        justify-content: center;
        margin: 30px 20px;
        
        .customer-service-btn {
            background: linear-gradient(135deg, #4CAF50, #45a049);
            border: none;
            border-radius: 25px;
            padding: 15px 30px;
            font-size: 16px;
            font-weight: bold;
            color: white;
            box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            min-width: 200px;
            
            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
            }
            
            &:active {
                transform: translateY(0);
            }
            
            .service-icon {
                font-size: 18px;
            }
        }
    }
}
</style>