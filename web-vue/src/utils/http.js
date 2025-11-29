import axios from "axios";
import URL from "@/config/index";
import router from "@/router";
import allTits from "@/i18n/back";
import { signatureGenerate } from "@/utils/signatureUtil";
import { useUserStore } from "@/store/user";
import { langOptions, getParamsLang } from "./index";

import { ElMessage } from "element-plus";
import { getStorage, removeStorage, setStorage, getBrowserLang } from "@/utils";

const getStore = () => {
  const userStore = useUserStore(); //不放在函数里会导致持久化有问题

  return {
    userStore,
  };
};

axios.defaults.timeout = 15000;
axios.defaults.baseURL = URL.BASE_URL;
axios.interceptors.request.use(
  (config) => {
    const token = getStorage("spToken");
    if (token) {
      config.headers["Token"] = token;
    }

    // 处理idcode/execute接口的特殊参数格式
    if (config.url.includes("api/idcode/execute")) {
      // 获取当前语言，转换为标准格式
      let currentLang = getStorage("lang") || "en";
      let language = currentLang;
      if (currentLang === "en") {
        language = "en-US";
      } else if (currentLang === "zh-CN" || currentLang === "CN") {
        language = "zh-CN";
      }

      // 构建URL查询参数
      const separator = config.url.includes("?") ? "&" : "?";
      config.url += `${separator}language=${language}`;

      // 添加target和areacode参数到URL
      if (config.data && config.data.target) {
        config.url += `&target=${config.data.target}`;
        // 移除data中的target，避免重复
        delete config.data.target;
      }

      // 添加areacode参数（默认为空）
      const areacode = (config.data && config.data.areacode) || "";
      config.url += `&areacode=${areacode}`;
      if (config.data && config.data.areacode !== undefined) {
        delete config.data.areacode;
      }
    } else if (!config?.params?.language && !config.url.includes("language")) {
      var lang = getParamsLang();
      const separator = config.url.includes("?") ? "&" : "?";
      const newUrl = `${config.url}${separator}language=${lang}`;
      config.url = newUrl;
    }

    // 获取请求头参数
    const { timestamp, signature, systemRandom } = signatureGenerate();
    // console.log(999999, timestamp, signature, systemRandom);
    if (timestamp) config.headers["tissuePaper"] = timestamp;
    if (signature) config.headers["sign"] = signature;
    if (systemRandom) config.headers["systemRandom"] = systemRandom;

    return config;
  },
  (error) => {
    console.log("request error--", error);
    return Promise.reject(error);
  }
);

const handleClearLoginInfo = (message = null) => {
  getStore().userStore.resetUserInfo();
  removeStorage("user");
  removeStorage("username");
  removeStorage("spToken");
  removeStorage("vuex");
  
  // 显示友好的提示信息
  if (message) {
    ElMessage.warning(message);
  } else {
    ElMessage.warning("登录状态已过期，请重新登录");
  }
  
  // 延迟跳转，让用户看到提示信息
  setTimeout(() => {
    router.push("/login");
  }, 1500);
};

//http response 拦截器
const langOptionKeys = langOptions.map((it) => it.value);
axios.interceptors.response.use(
  (response) => {
    var lang = getStorage("lang");
    // 判断请求是否成功: code === 0 或者 success === true
    if (response.data.code != 0 && response.data.success !== true) {
      let lanTits = "tits_en"; //兜底
      if (lang && langOptionKeys.includes(lang)) {
        lanTits = `tits_${lang}`;
      }

      //403表示接口失效
      if (response.data.code == "403" || response.data.code == "401") {
        // 根据错误消息显示不同的提示
        let errorMessage = response.data.msg;
        if (errorMessage.includes("账号已过期") || errorMessage.includes("已经在其他地方登录")) {
          errorMessage = "您的账号已过期或已在其他设备登录，请重新登录";
        }
        handleClearLoginInfo(errorMessage);
      }
      if (allTits[lanTits] && allTits[lanTits][response.data.msg]) {
        ElMessage.error(allTits[lanTits][response.data.msg]);
      } else {
        ElMessage.error(response.data.msg);
      }
      return Promise.reject(response);
    }
    return response;
  },
  (error) => {
    // 401表示接口失效
    if (error?.response?.status === 401) {
      handleClearLoginInfo();
    }
    console.log("reject", error);
    return Promise.reject(error);
  }
);

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function fetch(url, params = {},controller=null) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params,
        signal: controller ? controller.signal : '',
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @param controller - AbortController for request cancellation
 * @returns {Promise}
 */

export function post(url, data, controller = null) {
  return new Promise((resolve, reject) => {
    axios.post(url, data, {
      signal: controller ? controller.signal : undefined,
    }).then(
      (response) => {
        resolve(response.data);
      },
      (err) => {
        reject(err);
      }
    );
  });
}

export function postFormData(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios({
      method: "post",
      url,
      data,
      transformRequest: [
        function (data) {
          let ret = "";
          for (let it in data) {
            ret +=
              encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&";
          }
          ret = ret.substring(0, ret.lastIndexOf("&"));
          return ret;
        },
      ],
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }).then(
      (response) => {
        resolve(response.data);
      },
      (err) => {
        reject(err);
      }
    );
  });
}
export default { fetch, post, postFormData };
