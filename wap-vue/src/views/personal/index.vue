<template>
    <section class="my-index">
        <div class="assets">
            <div class="top">
                <div class="title">{{ $t('my') }}{{ $t('资产') }}</div>
            </div>
            <div class="currentAssets">
                <div class="top">
                    <div class="amount">
                        <div class="amountTop"><img class="nation"
                                src="data:image/png;base64,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"
                                alt=""><span>US {{ $t('总资产') }}(USDT)</span>
                            <div class="eyeBox"><img
                                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMsSURBVHgB7VdNTttAFH7PTuJKLVVuUPcGYQnZxEJEMiwgJwBOUDhByAlKTwCcILCAVGmDsyHZFd+A9AaR2BAaz+s8E9OAZ5w4bIrkT7Jsz5ufz+/fABkyZMiQ4b8GwivQbHpFc8mqmEQlwzA+TcuEEL8DRD+4G3VrNWcICyI1QSZlfczvIppbQFSZaxFiV5A43Vwrn0BKpCL43et9AUGHBFiExTAQQI00ROci2Gp5NuWtJiKUYkKCLqE4xwfzzHVXBjzUbl+XApPnYl2+2ootB/AwclzXGcBrCba8/g4KcfRSawg0FAIbG+urR0nrLzu9fQOoHl8PQzJw33VWTmFRgpJcnU0aX0RDwwCn6pT9aCwKGH7O/xn509phjQoTPJVrEMDBxpr+Iw2d4PJnb1tFjsGamyYXQh6dR2jyBQXrttXpH7NrsKhaLfsCsKHaS2roK1sJNFBqkDfGQuFGEwwDd231s3Jdp3cLz33uma+1rvqeKvJDcz+MllU+qdZgwfJ0kcpRqBqfaMt+MWyD9e44eqEgOFetlWYukmU1VbIYwVbnehfUkfeIAPyIUGTCKMqV86XGmp4XfizmzDPdtkhQ4oCCWQQnqUGLzeqj741zOTv0tStpVnlXpqAJrMCs8F1G7CBpb0mmrhh7QQ8oXRKmBG2nhDR1rCTGCOqiLcJF51dYc8e5sQ9zAs18OPdCppukeSr/jhHknEQI2sNR3Nf4XnNkAyBrLMymdxKZ1jAhieBAVQKVUYyINU7GSpmJW/9eYI83hoRD5QlTWlH7d3iWgY5KpiTIX8wZXiXjqIyiLdSM3JgI4uVK1miWRdoLGw1NdhCEe7oASi51P64P5SF1xaJhEJATRXQ41+vbMB7b/Hyf++DXnOUnC7Tbnix1BXVuFdRw18uHoMHsZkHmRS5HqmIvABpJdZSha9HYrBTAgVtNbr3ma7dYO4I80LROYfTJBB5ptNnq21Yh2NY1tdIlfOnLtVl5cW6CT0TDKqPt8WYi1JqAb0kmja9ZACFRNHbmbvknTe3IeH8y7Zvz4HU/Td5N0QruKkSm8qcJMfBH5lI3LakMGTJkyPCG8BfKSG8/5e6oxAAAAABJRU5ErkJggg=="
                                    alt=""></div>
                        </div>
                        <div class="money">${{ usdtTotalAssets }}</div>
                    </div>
                </div>
                <div class="bottom">
                    <div class="text-left"><span>{{ $t('总资产') }}(USDT)</span><span class="value">≈${{ usdtTotalAssets }}</span></div>
                </div>
                <div class="btnGroup">
                    <div class="recharge" @click="$router.push('/exchange/channel-in')">{{ $t('recharge') }}</div>
                    <div class="withdraw" @click="$router.push('/exchange/channel-out')">{{ $t('withdraw') }}</div>
                </div>
            </div>
            <!-- 日元JPY资产 -->
            <div class="otherAssets">
                <div class="amountTop">
                    <div class="left">
                        <img class="nation-flag" src="../../assets/image/lang/Japanese.png" alt="">
                        <span class="currency-text">JPY</span>
                        <span>{{ $t('总资产') }}(JPY)</span>
                    </div>
                    <div class="right">¥{{ jpyTotalAssets }}</div>
                </div>
                <div class="assetsInfo">
                    <div><span>{{ $t('总资产') }}(USDT)</span><span>≈${{ jpyTotalAssetsUSDT }}</span>
                    </div>
                </div>
            </div>
            <!-- 英镑GBP资产 -->
            <div class="otherAssets">
                <div class="amountTop">
                    <div class="left">
                        <img class="nation-flag" src="../../assets/英国国旗.png" alt="">
                        <span class="currency-text">GBP</span>
                        <span>{{ $t('总资产') }}(GBP)</span>
                    </div>
                    <div class="right">£{{ gbpTotalAssets }}</div>
                </div>
                <div class="assetsInfo">
                    <div><span>{{ $t('总资产') }}(USDT)</span><span>≈${{ gbpTotalAssetsUSDT }}</span>
                    </div>
                </div>
            </div>
            <!-- 韩元KRW资产 -->
            <div class="otherAssets">
                <div class="amountTop">
                    <div class="left">
                        <img class="nation-flag" src="../../assets/image/lang/Korean.png" alt="">
                        <span>KRW {{ $t('总资产') }}(KRW)</span>
                    </div>
                    <div class="right">₩{{ krwTotalAssets }}</div>
                </div>
                <div class="assetsInfo">
                    <div><span>{{ $t('总资产') }}(USDT)</span><span>≈${{ krwTotalAssetsUSDT }}</span>
                    </div>
                </div>
            </div>
            <div class="otherAssets hidden-cny-assets">
                <div class="amountTop">
                    <div class="left"><img class="nation"
                            src="data:image/png;base64,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"
                            alt=""><span>CN {{ $t('总资产') }}(CNY)</span></div>
                    <div class="right">¥{{ cnyTotalAssets }}</div>
                </div>
                <div class="assetsInfo">
                    <div><span>{{ $t('总资产') }}(USDT)</span><span>≈${{ cnyTotalAssetsUSDT }}</span>
                    </div>
                </div>
            </div>
            <div class="otherAssets">
                <div class="amountTop">
                    <div class="left"><img class="nation"
                            src="data:image/png;base64,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"
                            alt=""><span>HK {{ $t('总资产') }}(HKD)</span></div>
                    <div class="right">HK${{ hkdTotalAssets }}</div>
                </div>
                <div class="assetsInfo">
                    <div><span>{{ $t('总资产') }}(USDT)</span><span>≈${{ hkdTotalAssetsUSDT }}</span>
                    </div>
                </div>
            </div>
            <div class="otherAssets">
                <div class="amountTop">
                    <div class="left"><img class="nation"
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAATbSURBVHgBzZhbTFxFGMf/M2e37NZWFnrBapXT1hJQLlsM9UoKsQ9eaoMPxpcSoCb6VGl9aQQNPGI09dIW1KjQF0pbI5qYCNUHePCJmqVpI9gCu4mk0suWhbKFsufM+M2BbZZFYGEX4ZdszsycMzP//eab+WaGYUkcLwJ4HiXoKdxb2JhrUFa72NTLAP18DMwHyA5A62QIdWORsNg/bXQBY4cpUUbV9Mg3aWwM12TVfI0pobUTMDudlEYM2BATx2uBYCUJcmFp6BKyKQncZwKnNIjahSosYLEGnTOzdXOa0z00ND7nVzFYLBqyoChm81iPz/Vi+/az5YDpSUl1ut9+5wlwxsC5QLq+DozNWS1WdAHukUAJFifsi/Jjx3Ibt25d5yosfATPPL2BygSqPshH9pPrKW0gXshaLgneKqGVISZhWn0JZ/bGmzfv4auv9yJ4N4jzbdfxWkk6PqzejUuXRiAlR1KSqioRL8r3pDZb3Ey3cHyq/9Ja4unr97vOtFzFoUNPYd++R+Fwcly5EkBNdRfZTaDiYBba2//GiRM9EEIuxceiCZDP7Yr0uRltMXbSm56+Xq+vL8S1f0bx1sGcaZvQZIeJ2/5JNHx5EcGggbq6P6jcTtZLiDBCdnPIXeHc/aHk/PPaLQ859fz8zWhq+hNvvpExLYhNd6ghJdUB/y2Joeuj2F2wBRqPT8pMmDsEXhMlrEF3pTjKDpRm4ejRbDz3QhrWPmCfXZVm5qZNa/BRXSHefS8HObkbqAwJg/7nYRohV4QwUXTbH9I//qQLzz7fip9/GkBf/zCVm9ZQhVHpGzdGUFDQiorS3+Hx3IKM3//vw6QSxSsjhGHKhAKoej8fp1tewrff9WNiIlKUQHPzZeTmpaL9/KtIe1hDImZlNIKh3BIJnHRTBx6VycxMQU52Mn79bRClBzKQnGpDcrITjiQNI6MGNqZyHKnsoiFMwY6d63Hu7CAMI5Qg5w8jYdq0YmWxPeGi3t4Azn0/gJGAgf0ljyM4KhEYvoedO9fi1Dc9eHHvY9B3OHHhgh+nmwdgmpNIPAw2Q+SpIF4UqVaN7sZNTpxp+YuGswcZGQ9iW3oy+r1jeOXlNmRlbkBvzx2rAZn4kZxWIYtImNQRpdjvH6clow9ScPRfvYsffhyAIBV9faPw+u7QTNQsn1s+mFtZTEeUXkF9CmFaOfVsbxucekMWMkISy+H0Ubhs+9nlhfdYyjjzeHaKLUiKGRI4ti5G24+4WwtxDo1E8QQ6nZqVAcSJXYiEiiICKtrFLSzxSB9XUR2rCElxiVxaCWMdWEWovYxhZx3cgLiIVYRUwqyzqJXhXjlrPVsZJINPk2JbeHfRhFUBncTk1Jlz2mLWicWL6U3aSqGcPuQQxc4Jy/ktdXQYwGdYYTSOJiUKiAo0gts8FBzdWAEMDt8aIbaF8zPOlUwYr2MFFlyTy4C5RhRHls0UNnWncAT/EyqI0VYakzZeER7ChSqUq+i3nD+TMTnJuJy0owyLQV14UAPDyyXMYGz4v64GYhVHtzLMm2hRtE3yjMOhI15oL1sjmRaXQNMSpA2b4aNiopDWrSDKTWb3CqbFLMagbye5RiGP18hFLOBLOgrSoc1NFwh7KOAWWTGWMR2qU6lCMAtIa8GW3YzTzkWIbuqkE4vkX9KFiLAUaj7HAAAAAElFTkSuQmCC"
                            alt=""><span>TWD {{ $t('总资产') }}(TWD)</span></div>
                    <div class="right">NT${{ twdTotalAssets }}</div>
                </div>
                <div class="assetsInfo">
                    <div><span>{{ $t('总资产') }}(USDT)</span><span>≈${{ twdTotalAssetsUSDT }}</span>
                    </div>
                </div>
            </div>

        </div>
    </section>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { _assetsTradeTop } from '@/service/user.api'
import { _getC2CCurrencyList } from '@/service/recharge.api'
import axios from 'axios'

export default {
    setup() {
        // 响应式数据
        const totalAssetsData = ref({})
        const exchangeRates = ref({
            JPY: 150,  // JPY/USD汇率，默认150
            GBP: 0.79, // GBP/USD汇率，默认0.79
            KRW: 1300, // KRW/USD汇率，默认1300
            CNY: 7.1,  // CNY/USD汇率，默认7.1
            HKD: 7.75, // HKD/USD汇率，默认7.75
            TWD: 31.5  // TWD/USD汇率，默认31.5
        })

        // 计算属性
        const usdtTotalAssets = computed(() => {
            const totalAssets = totalAssetsData.value.totalAssets
            if (totalAssets) {
                // 处理字符串类型的totalAssets
                const amount = typeof totalAssets === 'string' ? parseFloat(totalAssets) : totalAssets
                return amount.toFixed(2)
            }
            return '0'
        })

        const jpyTotalAssets = computed(() => {
            const totalAssets = totalAssetsData.value.totalAssets
            if (totalAssets) {
                const usdtAmount = typeof totalAssets === 'string' ? parseFloat(totalAssets) : totalAssets
                return (usdtAmount * exchangeRates.value.JPY).toFixed(0)
            }
            return '0'
        })

        const jpyTotalAssetsUSDT = computed(() => {
            return usdtTotalAssets.value
        })

        const gbpTotalAssets = computed(() => {
            const totalAssets = totalAssetsData.value.totalAssets
            if (totalAssets) {
                const usdtAmount = typeof totalAssets === 'string' ? parseFloat(totalAssets) : totalAssets
                return (usdtAmount * exchangeRates.value.GBP).toFixed(2)
            }
            return '0'
        })

        const gbpTotalAssetsUSDT = computed(() => {
            return usdtTotalAssets.value
        })

        const krwTotalAssets = computed(() => {
            const totalAssets = totalAssetsData.value.totalAssets
            if (totalAssets) {
                const usdtAmount = typeof totalAssets === 'string' ? parseFloat(totalAssets) : totalAssets
                return (usdtAmount * exchangeRates.value.KRW).toFixed(0)
            }
            return '0'
        })

        const krwTotalAssetsUSDT = computed(() => {
            return usdtTotalAssets.value
        })

        // 新增CNY计算属性
        const cnyTotalAssets = computed(() => {
            const totalAssets = totalAssetsData.value.totalAssets
            if (totalAssets) {
                const usdtAmount = typeof totalAssets === 'string' ? parseFloat(totalAssets) : totalAssets
                return (usdtAmount * exchangeRates.value.CNY).toFixed(2)
            }
            return '0'
        })

        const cnyTotalAssetsUSDT = computed(() => {
            return usdtTotalAssets.value
        })

        // 新增HKD计算属性
        const hkdTotalAssets = computed(() => {
            const totalAssets = totalAssetsData.value.totalAssets
            if (totalAssets) {
                const usdtAmount = typeof totalAssets === 'string' ? parseFloat(totalAssets) : totalAssets
                return (usdtAmount * exchangeRates.value.HKD).toFixed(2)
            }
            return '0'
        })

        const hkdTotalAssetsUSDT = computed(() => {
            return usdtTotalAssets.value
        })

        // 新增TWD计算属性
        const twdTotalAssets = computed(() => {
            const totalAssets = totalAssetsData.value.totalAssets
            if (totalAssets) {
                const usdtAmount = typeof totalAssets === 'string' ? parseFloat(totalAssets) : totalAssets
                return (usdtAmount * exchangeRates.value.TWD).toFixed(2)
            }
            return '0'
        })

        const twdTotalAssetsUSDT = computed(() => {
            return usdtTotalAssets.value
        })

        // 获取实时汇率数据
        const getExchangeRates = async () => {
            try {
                console.log('开始获取实时汇率...')
                
                // 使用与银行卡入款页面相同的API服务函数
                const result = await _getC2CCurrencyList({ language: 'en' })
                console.log('汇率API返回数据:', result)

                if (result && Array.isArray(result)) {
                    // 更新汇率数据
                    result.forEach(currency => {
                        if (currency.currency && currency.rate) {
                            exchangeRates.value[currency.currency] = currency.rate
                        }
                    })
                    console.log('更新后的汇率数据:', exchangeRates.value)
                } else {
                    console.warn('汇率API返回数据格式不正确:', result)
                }
            } catch (error) {
                console.error('获取实时汇率失败:', error)
                console.log('使用默认汇率数据')
            }
        }

        // 获取ETF总资产数据 (与交易页面相同的方式)
        const getETFTotalAssets = async () => {
            try {
                const response = await _assetsTradeTop({
                    symbolType: 'indices', // ETF对应的symbolType
                    tradeType: 'exchange'   // ETF使用exchange类型
                })

                // 处理API返回的数据结构 {code: 0, data: {...}, succeed: true}
                if (response && response.code === 0 && response.data) {
                    totalAssetsData.value = response.data
                    console.log('ETF总资产数据:', response.data)
                } else {
                    // 如果返回结构不是预期的，直接使用response
                    totalAssetsData.value = response
                    console.log('ETF总资产数据(直接):', response)
                }
            } catch (error) {
                console.error('获取ETF总资产失败:', error)
                // 设置默认值
                totalAssetsData.value = { totalAssets: "0" }
            }
        }

        // 生命周期
        onMounted(async () => {
            // 先获取汇率数据，再获取资产数据
            await getExchangeRates()
            await getETFTotalAssets()
        })

        return {
            usdtTotalAssets,
            jpyTotalAssets,
            jpyTotalAssetsUSDT,
            gbpTotalAssets,
            gbpTotalAssetsUSDT,
            krwTotalAssets,
            krwTotalAssetsUSDT,
            cnyTotalAssets,
            cnyTotalAssetsUSDT,
            hkdTotalAssets,
            hkdTotalAssetsUSDT,
            twdTotalAssets,
            twdTotalAssetsUSDT,
            exchangeRates,
            getETFTotalAssets,
            getExchangeRates
        }
    }
}
</script>

<style >
.my-index {
    background-color: var(--main3_background);
    padding-bottom: calc(80px + constant(safe-area-inset-bottom)) !important;
    padding-bottom: calc(80px + env(safe-area-inset-bottom)) !important
}

.my-index .assets {
    padding: 10px;
    margin-top: 10px
}

.my-index .assets .top {
    display: flex;
    justify-content: space-between;
    align-items: center
}

.my-index .assets .top .title {
    font-size: 18px;
    font-weight: 600
}

.my-index .currentAssets {
    background-color: var(--inverse);
    border-radius: 4px;
    margin-top: 5px;
    box-shadow: rgba(0, 0, 0, .06) 0 8px 24px;
    padding: 10px;
    display: flex;
    flex-direction: column
}

.my-index .currentAssets .top {
    display: flex;
    justify-content: space-between;
    align-items: center
}

.my-index .currentAssets .top .amount {
    display: flex;
    flex-direction: column
}

.my-index .currentAssets .top .amount .amountTop {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 16px;
    font-weight: 600
}

.my-index .currentAssets .top .amount .amountTop .nation {
    width: 19px;
    height: 19px;
    border-radius: 50%
}

.my-index .currentAssets .top .amount .amountTop .eye {
    width: 19px
}

.my-index .currentAssets .top .amount .money {
    font-size: 28px;
    font-weight: 600;
    line-height: 42px
}

.my-index .currentAssets .bottom {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    margin-top: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--sec-border)
}

.my-index .currentAssets .bottom>div {
    display: flex;
    flex-direction: column;
    font-size: 12px;
    color: var(--tips-color);
    line-height: 18px
}

.my-index .currentAssets .bottom>div .value {
    font-size: 15px;
    line-height: 22px
}

.my-index .currentAssets .btnGroup {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 15px;
    margin: 10px 0
}

.my-index .currentAssets .btnGroup div {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    box-shadow: 0 min(.8vw, 3.4px) min(.266667vw, 1.133333px) max(-.533333vw, -2.266667px) rgba(0, 0, 0, .2), 0 min(.533333vw, 2.266667px) min(.533333vw, 2.266667px) 0 rgba(0, 0, 0, .14), 0 min(.266667vw, 1.133333px) min(1.333333vw, 5.666667px) 0 rgba(0, 0, 0, .12);
    font-size: 16px;
    font-weight: 600;
    border-radius: 4px;
    height: 44px
}

.my-index .currentAssets .btnGroup div.recharge {
    background-color: #00ae8c
}

.my-index .currentAssets .btnGroup div.withdraw {
    background-color: #f2495e
}

.my-index .otherAssets {
    padding: 10px;
    border-bottom: 1px solid var(--sec-border);
    display: flex;
    flex-direction: column
}

.my-index .otherAssets .amountTop {
    display: flex;
    justify-content: space-between;
    align-items: center
}

.my-index .otherAssets .amountTop .left {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 13px;
    font-weight: 600
}

.my-index .otherAssets .amountTop .left .nation {
    width: 19px;
    height: 19px;
    border-radius: 50%
}

.my-index .otherAssets .amountTop .left .nation-flag {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #e0e0e0;
}

.my-index .otherAssets .amountTop .left .currency-symbol {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    color: white;
    margin-left: 5px;
}

.my-index .otherAssets .amountTop .left .currency-symbol svg {
    width: 14px;
    height: 14px;
}

.my-index .otherAssets .amountTop .left .currency-text {
    font-weight: 600;
    color: #667eea;
    margin-right: 5px;
    font-size: 14px;
}

.my-index .otherAssets .amountTop .right {
    font-size: 16px;
    font-weight: 600
}

.my-index .otherAssets .assetsInfo {
    display: flex;
    flex-direction: column;
    padding: 10px 0
}

.my-index .otherAssets .assetsInfo div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: var(--tips-color)
}

.my-index .otherAssets .assetsInfo div span:last-child {
    font-size: 13px
}

.eyeBox {
    width: 17px;
    height: 17px
}

.eyeBox img {
    width: 100%;
    height: 100%
}

/* 隐藏CN总资产(CNY)显示 */
.hidden-cny-assets {
    display: none !important;
}
</style>
