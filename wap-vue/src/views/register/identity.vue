<template>
    <!-- 申请身份认证 -->
    <div class="identity pl-8 pr-8 text-24" style="padding-bottom: 30px;">
        <div class="header">
            <div class="flex items-center" @click="$router.go(-1)"><img
                    src="../../assets/image/assets-center/left-arrow.png" alt="" class="leftReturn" /></div>
            <!-- <div class="textColor" @click="$router.push('/finish')">{{ $t('skip') }}</div> -->
        </div>
        <Step :step="2"></Step>
        <div class="title textColor">{{ $t('realNameVertify') }}</div>
        <div class="pt-8 pb-7 box-border border-b-color" v-if="disabled() || status === 3">
            <div class="flex justify-between items-center px-4">
                <div class="text-26">{{ $t('authVerify') }}</div>
                <div class="flex items-center" v-if="resultArr[this.status]">
                    <img :src="require(`@/assets/image/assets-center/${resultArr[this.status] && resultArr[this.status].split('_')[0]}.png`)"
                        alt="success img" class="w-4.5 h-4.5" />
                    <div class="text-16 ml-2">{{ resultArr[this.status] && resultArr[this.status].split('_')[1] }}
                    </div>
                </div>
            </div>
        </div>
        <div>
            <div class="mb-1">
                <div class="mt-27 mb-13 text-12 textColor">{{ $t('nationality') }}</div>
                <div class="pt-2 pb-2 pl-4 pr-19 flex justify-between items-center rounded inputBackground textColor"
                    @click="openBtn">
                    <div class="flex items-center">
                        <div class="iti-flag mr-8" :class="countryCode" style="transform: scale(1.3)"></div>
                        <div>{{ countryName }}</div>
                    </div>

                    <img v-if="resultArr.length === 0" src="@/assets/image/down-arrow.png" class="w-17 h-10" alt="arrow" />
                </div>
            </div>
            <ExInput :label="$t('realName')" :placeholderText="$t('entryRealName')" v-model="name" />
            <ExInput :label="$t('credentPassport')" :placeholderText="$t('entryCredentPassport')" v-model="idnumber" />
            <div>
                <div v-if="resultArr.length > 0" class="mb-13 textColor">{{ $t('uploadCredentPassport') }}</div>
                <div v-else class="mt-55 mb-13">{{ $t('uploadPicCredentPassport') }}</div>
                <!-- 调整为两列布局，移除手持证件照上传区域 -->
                <div class="flex mt-4 mb-6 justify-between gap-4">
                    <div class="flex-1 flex flex-col text-center justify-center items-center">
                        <div class="upload-wrap-large">
                            <img src="@/assets/image/kyc/0.png" alt="" class="w-full"
                                v-if="[1, 2].includes(status) && frontFile.length === 0" />
                            <van-uploader v-model="frontFile" :max-count="1" :disabled="disabled()" :deletable="!disabled()"
                                :after-read="afterRead" @click-upload="onClickUpload('frontFile')" v-else />
                        </div>
                        <div class="mt-3 text-32 h-12 textColor font-medium">{{ $t('credentFront') }}</div>
                    </div>
                    <div class="flex-1 flex flex-col text-center justify-center items-center">
                        <div class="upload-wrap-large">
                            <img src="@/assets/image/kyc/1.png" alt="" class="w-full"
                                v-if="[1, 2].includes(status) && reverseFile.length === 0" />
                            <van-uploader v-model="reverseFile" :max-count="1" :disabled="disabled()"
                                :deletable="!disabled()" :after-read="afterRead"
                                @click-upload="onClickUpload('reverseFile')" v-else />
                        </div>
                        <div class="mt-3 text-32 h-12 textColor font-medium">{{ $t('credentObverse') }}</div>
                    </div>
                    <!-- 移除手持证件照上传区域 -->
                    <!-- <div class="flex-1 flex flex-col text-center justify-center items-center">
                        <div class="upload-wrap">
                            <img src="@/assets/image/kyc/2.png" alt="" class="w-full"
                                v-if="[1, 2].includes(status) && fileList.length === 0" />
                            <van-uploader v-model="fileList" :max-count="1" :disabled="disabled()" :deletable="!disabled()"
                                :after-read="afterRead" @click-upload="onClickUpload('fileList')" v-else />
                        </div>
                        <div class="mt-3 text-20 h-5 textColor">{{ $t('handCredent') }}</div>
                    </div> -->
                </div>
            </div>
            <template v-if="!disabled()">
                <div class="mb-4 textColor text-26">{{ $t('photoExample') }}</div>
                <img src="@/assets/image/kyc/kyc-demo.png" alt="" style="width:100%;height:auto;" class="w-auto h-56 mb-24">
                <!-- <div class="mb-100 flex justify-center">
                    <div class="flex flex-1 justify-center">
                        <img src="../../assets/image/kyc/kyc_demo1.png" alt="" class="w-80 h-80" />
                    </div>
                    <div class="flex flex-1 justify-center">
                        <img src="../../assets/image/kyc/kyc_demo2.png" alt="" class="w-80 h-80" />
                    </div>
                </div> -->
            </template>
            <van-button class="w-full" style="margin-top:10px;" type="primary" @click="onSubmit">{{ $t('nextStep') }}
            </van-button>
            <nationality-list ref='controlChildRef' :title="$t('selectNation')" @getName="getName" v-if="!disabled()">
            </nationality-list>
        </div>
    </div>
</template>

<script setup>
import Step from "./step.vue";
import nationalityList from '../authentication/components/nationalityList.vue'
import { Uploader } from 'vant';
import { _applyIdentify, _getIdentify } from '@/service/user.api.js'
import { _uploadImage } from '@/service/upload.api'
import countriesinit from "../authentication/components/countryList";
import ExInput from "@/components/ex-input/index.vue";
import { showToast } from "vant";
import { useRouter } from "vue-router";
import { ref, reactive, onMounted, watch } from "vue";
import { useI18n } from 'vue-i18n'
const { locale, t } = useI18n()
const router = useRouter()

const countries = ref(countriesinit)
const countryName = ref('')   // 默认设置为空，将通过函数获取
const countryCode = ref('jp') // 默认设置为日本的国家代码
const idnumber = ref('')
const name = ref('')

const frontFile = ref([])
const reverseFile = ref([])
const fileList = ref([])
const curFile = ref('frontFile')
const status = ref(-1) // 0
const imgs = ref([])
const resultArr = ref(['small-success_' + t('applynoView'), 'identifing_' + t('reviewing'), 'small-success_' + t('passView'), 'icon-close_' + t('noPassView')]) // 0 好像是未提交

// 获取对应语言的日本名称
const getJapanName = () => {
    try {
        return countries.value[locale.value]?.['jp']?.name || 'Japan'
    } catch (error) {
        console.error('获取日本名称失败:', error)
        return 'Japan'
    }
}

onMounted(() => {
    // 设置默认国籍为日本（使用国际化名称）
    countryName.value = getJapanName()
    fetchInfo()
})

// 监听语言变化，自动更新国家名称
watch(() => locale.value, (newLocale) => {
    console.log('🌐 语言变化:', newLocale)
    // 重新获取对应语言的日本名称
    countryName.value = getJapanName()
    console.log('🌐 更新后的国家名称:', countryName.value)
})

const fetchInfo = () => {   // 获取状态
    _getIdentify().then(data => {
        status.value = data.status
        
        // 强制默认为日本，无论什么情况都不覆盖（使用国际化名称）
        countryName.value = getJapanName()
        countryCode.value = 'jp'
        
        if (data.status !== 0) {
            // 不覆盖国籍默认值，只获取其他用户数据
            idnumber.value = data.idnumber
            name.value = data.name
            frontFile.value = data.idimg_1 ? [{ url: data.idimg_1_path }] : []
            reverseFile.value = data.idimg_2 ? [{ url: data.idimg_2_path }] : []
            // 移除手持证件照数据处理
            // fileList.value = data.idimg_3 ? [{ url: data.idimg_3_path }] : []
        }
    })
}

const onClickLeft = () => {
    router.go(-1);
}
const disabled = () => { // 是否禁用按钮
    return ![0, 3, -1].includes(status.value)
}
const onClickUpload = (type) => {
    curFile.value = type
}
const afterRead = (file) => { /// 处理文件
    file.status = 'uploading'
    file.message = t('uploading')
    _uploadImage(file).then(data => {
        file.status = 'success';
        file.message = t('uploadSuccess');
        file.resURL = data
        if (curFile.value == 'frontFile') {
            frontFile.value = [file]
        } else if (curFile.value == 'reverseFile') {
            reverseFile.value = [file]
        }
        // 移除手持证件照文件处理
        // else {
        //     fileList.value = [file]
        // }
        // [curFile.value].value = [file]
    }).catch(err => {
    file.status = 'failed'
    file.message = t('uploadFailed')
  })
}
//打开国家列表底部弹窗
const controlChildRef = ref(null)
const openBtn = () => {
    if (!disabled()) {
        controlChildRef.value.open();
    }
}
//获取到当前选中国家的code值
const getName = (params) => {
    countryName.value = params.name;
    countryCode.value = params.code;
}
const onSubmit = () => {

    if (!countryName.value) {
        showToast(t('selectNation'))
        return
    }
    if (!name.value) {
        showToast(t('entryName'))
        return
    }
    if (!idnumber.value) {
        showToast(t('entryCredent'))
        return
    }
    // 验证证件照片是否已上传
    if (!frontFile.value.length) {
        showToast(t('uploadIdPhotos'))
        return
    }
    if (!reverseFile.value.length) {
        showToast(t('uploadIdPhotos'))
        return
    }
    if (status.value !== 0) {
        // 直接跳转到完成页面，跳过谷歌验证
        router.push('/finish');
    } else {
        _applyIdentify({
            name: name.value,
            idnumber: idnumber.value,
            frontFile: frontFile.value,
            reverseFile: reverseFile.value,
            fileList: [], // 传递空数组，避免undefined错误
            countryName: countryCode.value // countryName 存储的 code, 回来再遍历
        }).then(() => {
            showToast(t('submitSuccess'))
            // 直接跳转到完成页面，跳过谷歌验证
            router.push('/finish');
            //this.fetchInfo()
        }).catch(err => {
            console.log(err)
            showToast(t(err.message));
        })
    }

}

</script>
<style lang="scss" scoped>
@import "@/views/authentication/components/intl.css";

.identity {
    width: 100%;
    box-sizing: border-box;
}

.upload-wrap {
    width: 110px;
    height: 110px;
    display: flex;
    justify-content: center;
    align-items: center;
}

// 新的大尺寸上传区域样式，适用于两列布局
.upload-wrap-large {
    width: 100%;
    height: 180px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px dashed #e0e0e0;
    border-radius: 12px;
    background-color: #fafafa;
    transition: all 0.3s ease;

    &:hover {
        border-color: #1989fa;
        background-color: #f0f8ff;
    }

    img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        border-radius: 8px;
    }
}

input {
    font-size: 18px;
}

input:disabled {
    background: $mainbgWhiteColor;
}

.list-view {
    overflow-y: scroll;
    border-bottom: 1px solid $border_color;
}

.kyc-input {
    width: 100%;
    border: none;
}


.service-text {
    text-decoration: underline;
}

.header {
    display: flex;
    justify-content: space-between;
    padding: 0 13px;
    font-size: 14px;
    height: 50px;
    line-height: 50px;
}

.stepBox {
    padding: 0 15px;
}

.title {
    font-weight: 700;
    font-size: 26px;
    margin-top: 25px;
    margin-bottom: 30px;
}

.city {
    background: $light-grey;
}
</style>
