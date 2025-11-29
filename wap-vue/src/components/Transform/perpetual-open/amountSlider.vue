<!-- 张数选择器 -->
<template>
    <div class="slider-index">
        <div class="amount-slider">
            <div class="amount-slider-clickable">
                <van-slider
                    v-model="sliderAmount"
                    @change="sliderAmountChange"
                    :min="0"
                    :max="100"
                    :step="1"
                    bar-height="2px"
                    active-color="#266BFF"
                    inactive-color="#404040"
                >
                    <template #button>
                        <div class="custom-slider-button"></div>
                    </template>
                </van-slider>
            </div>
            <div class="poecs">
                <span @click="setSliderValue(0)">0%</span>
                <span class="lins" @click="setSliderValue(10)">10%</span>
                <span class="lins" @click="setSliderValue(25)">25%</span>
                <span class="lins" @click="setSliderValue(50)">50%</span>
                <span class="lins" @click="setSliderValue(75)">75%</span>
                <span class="lins" @click="setSliderValue(100)">100%</span>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import { Slider } from "vant";

export default {
    name: "amountSlider",
    components: {
        [Slider.name]: Slider,
    },
    props: {
        maxAmount: {
            type: Number,
            default: 0, //可开或者可平的总数
        },
    },
    data() {
        return {
            amount: undefined, //用户输入的张数
            sliderAmount: 0, //滑块的数量，默认0%
            marks: [0, 20, 40, 60, 80, 100], // 平均分配的标记点
        };
    },
    computed: {
        ...mapGetters(["existToken"]),
    },
    mounted() {
        // 组件挂载后设置默认0%的值
        if (this.maxAmount > 0) {
            // 0%对应视觉位置0%
            this.sliderAmount = 0;
            this.sliderAmountChange(0);
        }
    },
    methods: {
        //输入框事件
        inputChange(val) {
            this.$emit("getAmount", val);
        },
        // 清除输入框
        cleanAmount() {
            this.amount = undefined;
        },
        //滑块事件
        sliderAmountChange(val) {
            console.log("滑块的值", val, this.maxAmount);
            // 将视觉位置转换为实际百分比值
            const visualMarks = [0, 20, 40, 60, 80, 100];
            const actualValues = [0, 10, 25, 50, 75, 100];
            
            // 找到最接近的视觉标记点
            let closestIndex = 0;
            let minDiff = Math.abs(val - visualMarks[0]);
            for (let i = 1; i < visualMarks.length; i++) {
                const diff = Math.abs(val - visualMarks[i]);
                if (diff < minDiff) {
                    minDiff = diff;
                    closestIndex = i;
                }
            }
            
            const actualValue = actualValues[closestIndex];
            console.log("实际百分比值", actualValue);
            
            let data;
            if (this.maxAmount) {
                if (actualValue == 0) {
                    this.amount = undefined;
                } else {
                    const rate = actualValue / 100; //如0.25
                    data = this.maxAmount * rate;
                    this.amount = parseInt(data);
                }
                this.$emit("getAmount", this.amount);
            }
        },
        //输入框amount变化
        amountChange(amount) {
            // 将实际百分比值转换为视觉位置
            const actualValue = (amount / this.maxAmount) * 100;
            const visualMarks = [0, 20, 40, 60, 80, 100];
            const actualValues = [0, 10, 25, 50, 75, 100];
            
            // 找到最接近的实际值
            let closestIndex = 0;
            let minDiff = Math.abs(actualValue - actualValues[0]);
            for (let i = 1; i < actualValues.length; i++) {
                const diff = Math.abs(actualValue - actualValues[i]);
                if (diff < minDiff) {
                    minDiff = diff;
                    closestIndex = i;
                }
            }
            
            this.sliderAmount = visualMarks[closestIndex];
        },
        emptyValue() {
            this.sliderAmount = "";
        },
        // 点击设置滑块值
        setSliderValue(value) {
            // 将实际百分比值映射到视觉位置
            const visualMarks = [0, 20, 40, 60, 80, 100];
            const actualValues = [0, 10, 25, 50, 75, 100];
            const index = actualValues.indexOf(value);
            if (index !== -1) {
                this.sliderAmount = visualMarks[index];
                this.sliderAmountChange(value);
            }
        },
    },
};
</script>
<style scoped lang="scss">
/* 滑块 */
.amount-slider-clickable {
    padding: 0 10px;
    margin-bottom: 10px;
}

.custom-slider-button {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #266BFF;
    border: 1px solid #dddddd;
    box-shadow: 0 2px 4px rgba(38, 107, 255, 0.3);
}

.poecs {
    margin-top: 16px;
    color: $text_color;
}

.poecs span.lins {
    display: inline-block;
    width: 18%;
    text-align: right;
}
</style>
  