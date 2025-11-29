<!-- 登录 -->
<template>
  <div class="login" style="padding-top: 124px;">
    <div
      class="binance-row rests1"
      style="margin-left: -12px; margin-right: -12px"
    >
      <div
        class="binance-col css-yyvsvt"
        style="padding-left: 12px; padding-right: 12px"
      >
        <div class="mt-20 mb-12">
          <div class="css-1mzk4e3">{{ t("zhanghudenglu") }}</div>
          <div class="mt-4 css-s3l2jm">{{ t("chang1") }}</div>
        </div>

        <div class="css-tmpver">
          <!-- 切换 - 显示3种登录方式 -->
          <div class="css-62gygx" style="overflow: visible;">
            <div
              class="css-ov54vn"
              v-for="(val, index) in arrType"
              :key="index"
            >
              <div
                :class="[changeType == index ? 'active' : '', 'css-1cahv52']"
                @click="changeTypeCk(index)"
              >
                {{ val }}
              </div>
            </div>
          </div>

          <!-- 登录方式-展示 -->
          <div class="css-15651n7">
            <div class="css-xjlny9">
              {{ changeType === 0 ? t("youxiang") : changeType === 1 ? t("shoujihao") : t("zhanghao") }}
            </div>
            <!-- 邮箱/手机/账号登录 -->
            <div class="css-hiy16i">
              <el-input
                autocomplete="off"
                type="text"
                name="email"
                class="rest3"
                :placeholder="changeType === 0 ? t('qsr_youxiang') : changeType === 1 ? t('qsr_shoujihao') : t('qsr_zhanghao')"
                v-model.trim="emailPd.account"
                clearable
              >
              </el-input>
            </div>
            <!-- 请输入邮箱/手机/账号 -->
            <div
              class="help_error css-1c3pga9"
              v-if="showverify && !emailPd.account"
            >
              {{ changeType === 0 ? t("qsr_youxiang") : changeType === 1 ? t("qsr_shoujihao") : t("qsr_zhanghao") }}
            </div>
          </div>
          <!-- 密码 -->
          <div class="css-15651n7">
            <div class="css-xjlny9">{{ t("mima") }}</div>
            <el-input
              :placeholder="t('qsr_mima')"
              v-model="emailPd.pwd"
              clearable
              type="password"
              show-password
            >
            </el-input>
            <div
              class="help_error css-1c3pga9"
              v-if="showverify && !emailPd.pwd"
            >
              {{ t("qsr_mima") }}
            </div>
            <!-- 忘记密码 -->
            <div data-bn-type="link" class="css-sck6b1" @click="forgotPwd">
              {{ t("wangjimima") }}
            </div>
          </div>

          <!-- 登录按钮 -->
          <button
            data-bn-type="button"
            id="click_login_submit"
            class="css-1bsmpdm"
            @click="loginForm"
          >
            {{ t("denglu") }}
          </button>
          <!-- 立即注册 -->
          <div class="css-jhkvqo">
            {{ t("haimeiyouzhanghao") }}？&nbsp;
            <div class="css-r3o9q9" @click="goRouter('/register')">
              {{ t("quzhuce") }}
            </div>
          </div>

          <Forgot />
          <!-- <selector-country ref="selectCountryRef" /> 已移除，只支持邮箱登录 -->
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import Axios from "@/api/login.js";
import Forgot from "./components/Forgotpwd.vue";
// import selectorCountry from "./components/selecterPup.vue"; // 已移除，只支持邮箱登录
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/store/user";
// import { useCountryCodeStore } from "@/store/countryCode"; // 已移除，只支持邮箱登录
import { setStorage } from "@/utils/index";

const { t } = useI18n();
const userStore = useUserStore();
// const countryCodeStore = useCountryCodeStore(); // 已移除，只支持邮箱登录
const router = useRouter();
const arrType = [t("youxiang"), t("shoujihao"), t("zhanghao")];
const changeType = ref(0); // 默认邮箱登录
const showverify = ref(false);
// const selectCountryRef = ref(null); // 已移除，只支持邮箱登录
const emailPd = ref({
  email: "",
  pwd: "",
  account: "",
});

const goRouter = (parmas) => {
  router.push(parmas);
};
// 切换登录方式
const changeTypeCk = (index) => {
  changeType.value = index;
};
// 获取手机号前缀 - 已移除，只支持邮箱登录
const forgotPwd = () => {
  router.push({
    path: "/resetpwd",
  });
};
// 登录
const loginForm = () => {
  const { account, pwd } = emailPd.value;
  let data = {
    username: account,
    password: pwd,
  };
  showverify.value = true;
  
  if (data.username && data.password) {
    Axios.login({
      ...data,
    })
      .then((res) => {
        if (res.code == "0") {
          setStorage("spToken", res.data.token);
          setStorage("username", res.data.username);
          userStore.updateUserInfo(res.data);
          router.push("/");
        }
      })
      .catch((e) => {
        console.log("login error", e);
      });
  } else {
    ElMessage.error(t("qsr_wanzhengdexinxi"));
  }
};
</script>
<style lang="css" scoped>
@import url("@/assets/css/login/login.css");
.el-input {
  height: 52px;
}
.el-input--suffix >>> .el-input__inner {
  padding-right: 30px;
  outline: none;
  border: none;
}
.mt-4 {
  margin-top: 8px !important;
}

.border-countrycode {
  border: 1px solid #dcdfe6;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 90px;
  margin-right: 12px;
  border-radius: 4px;
}

/* Tab切换样式优化 - 添加border-bottom效果 */
.css-62gygx {
  border-bottom: 1px solid #e6e9ed;
  margin-bottom: 24px !important;
}

.css-1cahv52 {
  background-color: transparent !important;
  color: #707a8a !important;
  padding-bottom: 12px !important;
  border-bottom: 2px solid transparent;
  border-radius: 0 !important;
  margin-right: 24px !important;
  transition: all 0.3s ease;
}

.css-1cahv52:hover {
  color: #1e2329 !important;
}

.css-1cahv52.active {
  background-color: transparent !important;
  color: #1e2329 !important;
  font-weight: 500;
  border-bottom: 2px solid #f0b90b !important;
}
</style>
