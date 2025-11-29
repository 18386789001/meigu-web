<template>
  <div class="app-container">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :key="route.name" :is="Component" v-if="route.meta.keepAlive" />
      </keep-alive>
      <component :key="route.name" :is="Component" v-if="!route.meta.keepAlive" />
    </router-view>
    <fx-footer v-if="route.meta.tarbar" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import fxFooter from "@/components/fx-footer/index.vue";
import { useRoute } from "vue-router";
import { setStorage, getStorage } from "@/utils/index.js";
import { SET_THEME } from "@/store/types.store";
import { themeStore } from "@/store/theme";
import { initializeWapLanguage, isFirstVisit } from "@/utils/languageInit.js";
import { useI18n } from 'vue-i18n';


const route = useRoute();
const thStore = themeStore();
const { locale } = useI18n();
const geturlkey = (name) => {
  return (
    decodeURIComponent(
      (new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(location.href) || [
        ,
        "",
      ])[1].replace(/\+/g, "%20")
    ) || null
  );
};
let usercode = geturlkey("usercode");
if (usercode) {
  setStorage("usercode", usercode);
}
//设置主题 - 默认使用暗黑模式
if (!getStorage("theme")) {
  // 首次访问，设置默认主题为暗黑模式
  thStore[SET_THEME]("dark", false);
} else {
  // 使用存储的主题设置
  thStore[SET_THEME](thStore.theme, false);
}

const timeConvert = () => {
  _timeConvert().then(res => {
    setStorage('timezone', res.showTimeZone)
  })
}
onMounted(() => {
  // 初始化语言设置，支持URL参数语言
  console.log('🚀 WAP-Vue 应用启动');

  // 检查是否为首次访问
  const firstVisit = isFirstVisit();
  if (firstVisit) {
    console.log('👋 首次访问 WAP-Vue，欢迎！');
  }

  // 初始化语言设置（会自动检查URL参数）
  const languageResult = initializeWapLanguage();
  console.log('🌐 语言初始化结果:', languageResult);
  
  // 🔧 重要：语言初始化后，更新 i18n 的 locale
  const currentLang = localStorage.getItem('lang') || 'en';
  if (locale && locale.value !== undefined) {
    locale.value = currentLang;
    console.log('🌐 WAP-Vue App: i18n locale 已更新为:', currentLang);
  }
  
  // 如果从URL获取到语言参数，记录日志
  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get('lang');
  if (langParam) {
    console.log('🌐 从H5页面接收到语言参数:', langParam);
    console.log('🌐 已自动切换到指定语言');
  }
})
</script>
<style lang="scss">
.nationList {
  .van-action-sheet {
    height: 80%;
  }
}


.van-dialog {
  width: var(--van-dialog-width) !important;
}

.van-icon-arrow-left {
  color: $text_color !important;
}

.van-nav-bar::after {
  border-bottom: none;
}

.van-tabbar-item__text {
  color: #bec1d2;
}

#app {
  .van-popup {
    background: $main_background !important;
    margin: 0 auto;
  }
}

#cryptos {

  // 上传图片框大小设置
  .van-uploader__upload {
    width: 140px !important;
    height: 140px !important;
  }

  .van-uploader__upload-icon {
    font-size: 48px !important;
  }

  .van-uploader__upload {
    background-color: $upload_bg !important;
    border: 2px dashed #b8bcc5;
  }

  // tab标签短横线颜色
  .van-tabs__line {
    background-color: $active_line !important;
  }

  .van-tabs__wrap {
    // height: 88px !important;
  }

  .van-tab__text--ellipsis {
    overflow: visible !important;
    -webkit-box-orient: horizontal !important; //修复K线tab标题文字显示不全
  }

  .van-tab__text {
    font-size: 16px !important;
  }

  .vux-pop-out-enter-active,
  .vux-pop-out-leave-active,
  .vux-pop-in-enter-active,
  .vux-pop-in-leave-active {
    will-change: transform;
    transition: all 250ms;
    height: 100%;
    top: 0;
    position: absolute;
    backface-visibility: hidden;
    perspective: 1000;
  }

  .vux-pop-out-enter {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }

  .vux-pop-out-leave-active {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  .vux-pop-in-enter {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  .vux-pop-in-leave-active {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }

  #mining-account {
    .van-grid-item__content {
      padding: 41px 0;
    }
  }

  .upload-wrap {
    .van-uploader__preview {
      margin: 0 !important;
    }
  }

  .popup-delivery {
    .van-circle {
      // width: 300px !important;
      // height: 300px !important;
    }

    .van-count-down {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      // font-size: 40px;
    }
  }

  .list-quatation {
    .van-cell {
      padding: 15px 0 !important;
      background: $main_background;

      &::after {
        border: none;
      }
    }
  }

  .quotes {
    .van-tabs__line {
      width: 120px !important;
    }
  }

  .nationList {
    .van-action-sheet {
      height: 80%;
    }
  }

  #withdraw_verify {
    .van-field-word-limit-line-height {
      height: 30px;
    }
  }

  #editAd {
    .van-dropdown-menu__item {
      justify-content: left;
    }

    .van-dropdown-menu__title::after {
      right: -200px;
      border-color: #3c507100 transparent #323233f7 #36689a;
    }

    //.van-cell{
    //  background-color: #eee;
    //}
    .bg {
      .van-cell {
        background-color: $mainTextColor;
      }
    }
  }


  #wantBuy {
    .van-popover__action {
      width: 320px;
    }
  }

  .adScreening {
    .van-cell {
      line-height: 50px;
    }

    .van-field__control {
      background-color: $tab_background;
      padding-left: 20px;
    }
  }

  .vue-auth-box_ .auth-control_ .range-box {
    background-color: #eaeaea !important;
    height: 30px !important;
    margin-bottom: 40px;
  }

  .vue-auth-box_ .auth-control_ .range-box .range-slider .range-btn {
    width: 140px !important;
    height: 74px !important;
    background: $color_main !important;
    border-radius: 96px !important;
    top: -50%;
  }

  .vue-auth-box_ .auth-control_ .range-box .range-slider .range-btn>div {
    border: solid 1px $mainTextColor !important;
    border-radius: 4px;
  }

  .van-toast {
    width: 300px;
  }

  .van-toast__text {
    word-break: break-word;
  }

  .van-tabbar--fixed {
    z-index: 10;
    padding-bottom: constant(safe-area-inset-bottom);
  }

  #buy_nav {
    .van-nav-bar__title {
      font-size: 18px !important;
    }
  }

  .van-cell-group {
    &::after {
      border: none;
    }
  }

  .van-collapse {
    &::after {
      border: none;
    }
  }

  .van-cell {
    padding: 0;
    color: $text_color1;

    &::after {
      border: none;
    }

    .van-cell__value {
      color: $black;
    }
  }

  .van-nav-bar__title {
    color: $text_color;
  }

  .van-hairline--top-bottom::after,
  .van-hairline-unset--top-bottom::after {
    border: none;
  }

  .van-dialog {
    background: $main_background;
  }

  .van-dialog__header {
    color: $text_color;
  }

  .van-dialog__message--has-title {
    color: $dark-grey;
  }

  .van-button--default {
    background: $main_background;
    color: $dark-grey;
  }

  .van-nav-bar {
    background: $main_background;
    line-height: normal;
  }

  .van-dropdown-menu__title {
    color: $text_color !important;
  }

  .van-nav-bar__right {
    color: $text_color;
  }
}

.van-nav-bar__left {
  padding: 0 16px !important;
}

.header {
  padding-top: 8px !important;
}

</style>
