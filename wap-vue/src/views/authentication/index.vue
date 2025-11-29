<template>
  <!-- 申请身份认证 -->
  <div style="padding-bottom: 30px" class="text-26 authentication">
    <fx-header @back="loginOut">
      <template #title>
        {{ $t('primaryCertification') }}
      </template>
    </fx-header>
    <!-- <country-list /> -->
    <div v-if="show">
      <div class="pt-14 pb-14 box-border border-b-color" v-if="disabled() || status === 3">
        <div class="flex justify-between items-center px-8 textColor">
          <div class="text-26">{{ $t('authVerify') }}</div>
          <div class="flex items-center" v-if="resultArr[status]">
            <!-- <img
              :src="require(`@/assets/image/assets-center/${resultArr[status] && resultArr[status].split('_')[0]}.png`)"
              alt="success img" class="w-9 h-9" /> -->
            <img src="@/assets/image/assets-center/identifing.png" v-if="status == 1" class="w-10 h-10" />
            <img src="@/assets/image/assets-center/small-success.png" v-if="status == 0 || status == 2"
              class="w-10 h-10" />
            <img src="@/assets/image/assets-center/icon-close.png" v-if="status == 3" class="w-10 h-10" />
            <div class="text-24 ml-4">{{ resultArr[status] && resultArr[status].split('_')[1] }}</div>
          </div>
        </div>
      </div>
      <div class="pl-8 pr-8">
        <div class="">
          <div class=" mb-3 text-28 textColor">{{ $t('nationality') }}</div>
          <div class="pt-7 pb-7 pl-10 pr-10 flex justify-between items-center rounded inputBackground textColor box"
            @click="openBtn">
            <div class="flex items-center ml-2">
              <!-- <div class="iti-flag" :class="key" style="transform: scale(2.1)"></div> -->
              <div class="iti-flag mr-10 " :class="countryCode" style="transform: scale(2.1)"></div>
              <div>{{ countryName }}</div>
            </div>

            <img src="@/assets/image/down-arrow.png" class="w-5 h-3" alt="arrow" />
          </div>
        </div>
        <ExInput :label="$t('realName')" :disabled="disabled()" :clearBtn="!disabled()"
          :placeholderText="$t('entryRealName')" v-model="name" />
        <ExInput :label="$t('credentPassport')" :disabled="disabled()" :clearBtn="!disabled()"
          :placeholderText="$t('entryCredentPassport')" v-model="idnumber" />
        <div>
          <div v-if="resultArr.length > 0" class="mt-1 mb-3 textColor">{{ $t('uploadCredentPassport') }} </div>
          <div v-else class="mt-4 mb-12 textColor">{{ $t('uploadPicCredentPassport') }}</div>
          <!-- 调整为两列布局，身份证正面和反面各占一半 -->
          <div class="flex mb-10 justify-between gap-4">
            <div class="flex-1 flex flex-col text-center justify-center items-center">
              <div class="upload-wrap-large">
                <img src="../../assets/image/kyc/0.png" alt="" class="w-full"
                  v-if="[1, 2].includes(status) && frontFile.length === 0" />
                <van-uploader v-model="frontFile" :max-count="1" :deletable="!disabled()" :after-read="afterRead"
                  @click-upload="onClickUpload('frontFile')" v-else />
              </div>
              <div class="text-32 h-12 textColor1 mt-3 font-medium">{{ $t('credentFront') }}</div>
            </div>
            <div class="flex-1 flex flex-col text-center justify-center items-center">
              <div class="upload-wrap-large">
                <img src="../../assets/image/kyc/1.png" alt="" class="w-full"
                  v-if="[1, 2].includes(status) && reverseFile.length === 0" />
                <van-uploader v-model="reverseFile" :max-count="1" :disabled="disabled()" :deletable="!disabled()"
                  :after-read="afterRead" @click-upload="onClickUpload('reverseFile')" v-else />
              </div>
              <div class="text-32 h-12 textColor1 mt-3 font-medium">{{ $t('credentObverse') }}</div>
            </div>
          </div>
        </div>
        <template v-if="!disabled()">
          <div class="text-28 mb-8 textColor">{{ $t('photoExample') }}</div>
          <img src="@/assets/image/kyc/kyc-demo.png" alt="" style="width:100%;height:auto;" class="w-auto h-56 mb-5">
          <!-- <div class="mb-5 flex justify-center">
            <div class="flex flex-1 justify-center">
              <img src="../../assets/image/kyc/kyc_demo1.png" alt="" class="w-80 h-80" />
            </div>
            <div class="flex flex-1 justify-center">
              <img src="../../assets/image/kyc/kyc_demo2.png" alt="" class="w-80 h-80" />
            </div>
          </div> -->
        </template>
        <button class="apply-btn btnMain text-white text-26 h-24 rounded" @click="onSubmit" v-if="!disabled()">{{
          $t('Apply')
        }}</button>
        <div class="pt-9 pb-16 text-24" v-if="!disabled() || status === 3">
          <span class="text-grey">{{ $t('uploadTitle1') }} {{ $t('photoExample') }}</span>
          <span class="text-blue service-text" @click="tokefu"> {{ $t('ContactService') }}</span>
        </div>
        <nationality-list ref='controlChild' :title="$t('selectNation')" @getName="getName" v-if="!disabled()">
        </nationality-list>
      </div>
    </div>
  </div>
</template>

<script setup>
import { _getIdentify, _info, _applyIdentify } from "@/service/user.api.js";
import { _uploadImage } from "@/service/upload.api.js";
import { onMounted, ref, watch } from 'vue';
import nationalityList from './components/nationalityList.vue'
import { useRouter } from "vue-router";
import { showToast, Uploader } from "vant"
// import ExInput from "@/components/ex-input";
import countries from "./components/countryList";
import { getCurrentInstance } from 'vue';
import { useI18n } from "vue-i18n";
const { locale, t } = useI18n()
const router = useRouter()
const countryName = ref('')
const countryCode = ref('jp')
const idnumber = ref('')
const name = ref('')
const frontFile = ref([])
const reverseFile = ref([])
// 移除手持证件照相关变量
// const fileList = ref([])
const curFile = ref('frontFile')
const status = ref('')
const imgs = ref([])
const idcard_path_front_path = ref('')
const idcard_path_back_path = ref('')
const idcard_path_hold_path = ref('')
const resultArr = ref(['small-success_' + t('applynoView'), 'identifing_' + t('reviewing'), 'small-success_' + t('passView'), 'icon-close_' + t('noPassView')])
const show = ref(false)
const controlChild = ref(null)
const { proxy } = getCurrentInstance();

// 获取对应语言的日本名称
const getJapanName = () => {
  try {
    return countries[locale.value]?.['jp']?.name || 'Japan'
  } catch (error) {
    console.error('获取日本名称失败:', error)
    return 'Japan'
  }
}

onMounted(() => {
  // 强制设置默认国籍为日本（使用国际化名称）
  countryName.value = getJapanName()
  countryCode.value = 'jp'
  
  fetchInfo();
})

// 监听语言变化，自动更新国家名称
watch(() => locale.value, (newLocale) => {
  console.log('🌐 语言变化:', newLocale)
  
  // 检查当前用户是否有国籍信息（不管审核状态如何）
  const hasNationality = countryCode.value && countryCode.value !== '';
  
  if (hasNationality) {
    // 如果用户有国籍信息，更新对应语言的国籍名称
    try {
      const nationalityInfo = countries[newLocale]?.[countryCode.value];
      if (nationalityInfo) {
        countryName.value = nationalityInfo.name;
        console.log('🌐 更新用户国籍名称:', {
          code: countryCode.value,
          name: nationalityInfo.name,
          locale: newLocale
        });
      } else {
        // 如果找不到对应的国际化名称，使用默认的日本
        console.warn('⚠️ 找不到国籍代码对应的国际化名称，使用默认日本');
        countryName.value = getJapanName();
        countryCode.value = 'jp';
      }
    } catch (error) {
      console.error('❌ 更新国籍名称时出错:', error);
      countryName.value = getJapanName();
      countryCode.value = 'jp';
    }
  } else {
    // 如果用户没有国籍信息，使用日本名称
    countryName.value = getJapanName()
    console.log('🌐 更新默认国籍名称:', countryName.value)
  }
})
const loginOut = () => {
  router.push('/certificationCenter')
}
const fetchInfo = () => {   // 获取状态
  _getIdentify().then(data => {
    show.value = true
    status.value = data.status
    
    console.log('🔍 fetchInfo - API返回数据:', data)
    console.log('🔍 fetchInfo - 设置前 countryName:', countryName.value, 'countryCode:', countryCode.value)
    
    // 检查用户是否已经有国籍信息（不管审核状态如何）
    const hasNationality = data.nationality && data.nationality !== null && data.nationality !== '';
    console.log('🔍 fetchInfo - 用户国籍信息:', hasNationality, 'nationality:', data.nationality, 'status:', data.status)
    
    if (hasNationality) {
      // 如果用户已经选过国籍（不管是否审核通过），显示用户的国籍
      console.log('✅ 用户已有国籍，显示用户国籍:', data.nationality)
      
      // 从国籍代码获取对应的国际化名称
      const nationalityCode = data.nationality;
      try {
        const nationalityInfo = countries[locale.value]?.[nationalityCode];
        if (nationalityInfo) {
          countryName.value = nationalityInfo.name;
          countryCode.value = nationalityCode;
          console.log('✅ 设置用户国籍:', {
            code: nationalityCode,
            name: nationalityInfo.name,
            locale: locale.value
          });
        } else {
          // 如果找不到对应的国际化名称，使用默认的日本
          console.warn('⚠️ 找不到国籍代码对应的国际化名称，使用默认日本');
          countryName.value = getJapanName();
          countryCode.value = 'jp';
        }
      } catch (error) {
        console.error('❌ 处理国籍信息时出错:', error);
        countryName.value = getJapanName();
        countryCode.value = 'jp';
      }
    } else {
      // 如果用户还没有国籍信息，默认显示日本
      console.log('⚠️ 用户无国籍信息，默认显示日本');
      countryName.value = getJapanName()
      countryCode.value = 'jp'
    }
    
    console.log('🔍 fetchInfo - 设置后 countryName:', countryName.value, 'countryCode:', countryCode.value)

    if (data.id != null) {
      idnumber.value = data.idnumber
      name.value = data.name
      frontFile.value = data.idimg_1 ? [{ url: data.idimg_1_path, resURL: data.idimg_1 }] : []
      reverseFile.value = data.idimg_2 ? [{ url: data.idimg_2_path, resURL: data.idimg_2 }] : []
      // 移除手持证件照数据处理
      // fileList.value = data.idimg_3 ? [{ url: data.idimg_3_path, resURL: data.idimg_3 }] : []
    }
    
  }).catch(error => {
    console.error('❌ fetchInfo 错误:', error)
    // API调用失败时，默认显示日本
    countryName.value = getJapanName()
    countryCode.value = 'jp'
  })
}
const onClickUpload = (type) => {
  console.log(type)
  curFile.value = type
}
const disabled = () => { // 是否禁用按钮
  return ![0, 3, ''].includes(status.value)
}
const afterRead = (file) => {
  file.status = 'uploading'
  file.message = t('uploading')

  _uploadImage(file).then(data => {
    file.status = 'success'
    file.message = t('uploadSuccess')
    file.resURL = data
  }).catch(err => {
    file.status = 'failed'
    file.message = t('uploadFailed')
  })
};



//打开国家列表底部弹窗
const openBtn = () => {
  if (!disabled()) {
    proxy.$refs.controlChild.open()
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
  _applyIdentify({
    name: name.value,
    idnumber: idnumber.value,
    frontFile: frontFile.value,
    reverseFile: reverseFile.value,
    // 移除手持证件照参数
    // fileList: fileList.value,
    countryName: countryCode.value // this.countryName 存储的 code, 回来再遍历
  }).then(() => {
    showToast(t('submitSuccess'))
    router.push('/verified')
    // this.fetchInfo()
  }).catch(err => {
    if (err.code === 'ECONNABORTED') { showToast('网络超时！'); }
    else if (err.msg !== undefined) { showToast(err.msg); }
  })
}
const tokefu = () => {
  router.push('/customerService')
}

</script>
<style lang="scss" scoped>
@import "@/views/authentication/components/intl.css";

.box {
  padding: 1.5rem !important;
}

.authentication {
  width: 100%;
  box-sizing: border-box;
}

.upload-wrap {
  // width: 220px;
  // height: 220px;
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
  font-size: 35px;
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

.apply-btn {
  border: none;
  outline: none;
  width: 100%;
  height: 50px;
}

.service-text {
  text-decoration: underline;
}

.rounded {
  padding: 0.6rem;
}

.mb-32 {
  margin-bottom: 16px;
}

.pt-35 {
  padding-top: 16px;
}
</style>
