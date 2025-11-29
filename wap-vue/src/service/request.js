import axios from 'axios'
// import qs from 'qs'
import { showToast, closeToast, showLoadingToast, showNotify } from 'vant'
import {
  BASE_URL,
  REQUEST_TIMEOUT,
  CONTENT_TYPE,
  CONTENT_TYPES,
  WITH_CREDENTIALS,
  METHODS
} from '@/config'
import i18n from '@/i18n'
import { getStorage } from '@/utils/index'
// import store from '@/store'
import { useUserStore } from '@/store/user.js'
import store from '@/store/store'
import router from '@/router'
import { signatureGenerate } from '@/utils/signatureUtil.js'

let isClose = false
const service = axios.create({
  baseURL: BASE_URL,
  withCredentials: WITH_CREDENTIALS,
  // timeout: REQUEST_TIMEOUT, // 请求超时时间
  headers: {
    [CONTENT_TYPE]: CONTENT_TYPES.URL_ENCODED
  }
})

// 请求拦截
service.interceptors.request.use(
  (config) => {
    if (!config) {
      config = {}
    }
    if (!config.headers) {
      config.headers = {}
    }
    if (config.method === METHODS.POST) {
      if (config.data) {
        // config.data = qs.stringify(config.data)
      }
    }
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    config.headers[' x-api-client-timezone'] = timeZone
    const userStore = useUserStore()
    const TOKEN = userStore.userInfo.token
    const { systemRandom, timestamp, signature } = signatureGenerate()
    if (!config.params) {
      config.params = {}
    }
    if (systemRandom) {
      config.headers['systemRandom'] = systemRandom
    }
    if (timestamp) {
      config.headers['tissuePaper'] = timestamp
    }
    if (signature) {
      config.headers['sign'] = signature
    }
    if (TOKEN) {
      config.headers['token'] = TOKEN
    }
    // 处理idcode/execute接口的特殊参数格式
    if (config.url.includes('/api/idcode/execute')) {
      // 获取当前语言，转换为标准格式
      let currentLang = getStorage('lang') || 'en'
      let language = currentLang
      if (currentLang === 'en') {
        language = 'en-US'
      } else if (currentLang === 'zh-CN' || currentLang === 'CN') {
        language = 'zh-CN'
      }

      // 构建URL查询参数
      const separator = config.url.includes('?') ? '&' : '?'
      config.url += `${separator}language=${language}`

      // 添加target和areacode参数到URL
      if (config.data && config.data.target) {
        config.url += `&target=${config.data.target}`
        // 移除data中的target，避免重复
        delete config.data.target
      }

      // 添加areacode参数（默认为空）
      const areacode = (config.data && config.data.areacode) || ''
      config.url += `&areacode=${areacode}`
      if (config.data && config.data.areacode !== undefined) {
        delete config.data.areacode
      }
    } else if (config.url == '/api/api/cms!get.action') {
      if (config.params.content_code == '001') {
        if (getStorage('lang') == 'CN' || getStorage('lang') == 'zh-CN') {
          config.params['language'] = 'zh-CN'
        } else {
          config.params['language'] = 'en'
        }
      } else {
        config.params['language'] = getStorage('lang') || 'en'
      }
    } else if (config.url.includes('/api/information!list.action')) {
      // 新闻接口始终使用中文，前端负责翻译
      config.params['language'] = 'zh-CN'
    } else if (config.url.includes('/api/publicRealtimeByType')) {
      // 大宗商品接口固定使用中文，不要覆盖
      // 不设置language参数，让API函数自己控制
    } else if (config.url.includes('/api/item!list.action')) {
      // 商品列表接口，如果是commodities类型，固定使用zh-CN
      if (config.params && config.params.type === 'commodities') {
        config.params['language'] = 'zh-CN'
      } else {
        config.params['language'] = getStorage('lang') || 'en'
      }
    } else if (config.url.includes('/api/hobi!getRealtime.action')) {
      // 实时行情接口，如果已经设置了language参数，不要覆盖
      // 让API函数自己控制language参数
      if (!config.params || !config.params.language) {
        config.params['language'] = getStorage('lang') || 'en'
      }
    } else if (config.url.includes('/api/hobi!getKlineV1.action')) {
      // K线接口固定使用en，不要覆盖
      // 大宗商品K线图必须统一使用language=en
      if (!config.params || !config.params.language) {
        config.params['language'] = 'en'
      }
    } else {
      config.params['language'] = getStorage('lang') || 'en'
    }
    if (config.loading) {
      showLoadingToast({ forbidClick: true, duration: 0 })
      isClose = true
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截
service.interceptors.response.use(
  (res) => {
    const userStore = useUserStore()
    if (isClose) {
      closeToast()
      isClose = false
    }
    // console.log(res.config.returnType)
    const {
      data: { code, data, msg, token }
    } = res
    if (res.config['returnType'] === 'origin') {
      // 原样返回
      return Promise.resolve(res.data)
    }
    switch (code / 1) {
      case 0: // 正确响应
        return Promise.resolve(data)
      // case 401:
      // case 402:
      // case 407:
      case 403: // 登录状态已过期，您可以继续留在该页面，或者重新登录
        // 显示友好的错误提示
        let errorMessage = msg;
        if (msg && (msg.includes('账号已过期') || msg.includes('已经在其他地方登录'))) {
          errorMessage = i18n.global.t('您的账号已过期或已在其他设备登录，请重新登录');
        } else {
          errorMessage = i18n.global.t('登录状态已过期，请重新登录');
        }
        
        showToast({
          message: errorMessage,
          type: 'fail',
          duration: 2000
        });
        
        // 清除用户信息
        userStore.userInfo = {}
        store.state.user.userInfo = {}
        
        // 延迟跳转到登录页
        setTimeout(() => {
          router.push({
            path: '/login'
          })
        }, 1500);
        return
      case 10:
      case 20:
        return Promise.reject(res.data)
      default:
        showToast(i18n.global.t(msg))
        return Promise.reject(msg)
    }
  },
  (error) => {
    // 网络状态监控
    if (error && error.request) {
      const status = error.request['status']
      switch (status) {
        case 401:
          break
        case 424:
          logout()
          break
        case 404:
          showToast({
            message: i18n.global.t('interfaceNotFound'),
            type: 'fail',
            duration: 2000
          })
          break
        case 415:
          showToast({
            message: i18n.global.t('httpProtocolMismatch'),
            type: 'fail',
            duration: 2000
          })
          break
        case 428:
          showToast({
            message: i18n.global.t('VerificationCodeIsIllegal'),
            type: 'fail',
            duration: 2000
          })
          break
        // case 500:
        //   showToast({ message: '服务未启动', type: 'fail', duration: 2000 })
        //   break
        // default:
        //   showToast({ message: '服务错误', type: 'fail', duration: 2000 })
        //   break
        default:
          // console.log(error)
          // 检查是否是K线图相关的API错误
          const isKlineApi = error.config.url && (
            error.config.url.includes('/api/hobi!getKlineV1.action') ||
            error.config.url.includes('/api/hobi!getTrend.action') ||
            error.config.url.includes('/api/item!summary.action') ||
            error.config.url.includes('/api/item!constituentStockList.action')
          )
          
          // 如果是K线图API错误，不显示错误提示（全局处理）
          if (isKlineApi) {
            // 不显示错误提示，静默处理
            return
          }
          
          // 排除某些特定的API错误提示
          if (
            error.config.url != '/api/api/hobi!getRealtime.action' &&
            error.config.url != '/api/api/item!list.action'
          ) {
            showToast({
              message:
                i18n.global.t(error.message) || i18n.global.t('serviceError'),
              type: 'fail',
              duration: 2000
            })
          }
      }
    } else {
      // 检查是否是K线图相关的API错误
      const isKlineApi = error.config && error.config.url && (
        error.config.url.includes('/api/hobi!getKlineV1.action') ||
        error.config.url.includes('/api/hobi!getTrend.action') ||
        error.config.url.includes('/api/item!summary.action') ||
        error.config.url.includes('/api/item!constituentStockList.action')
      )
      
      // 如果是K线图API错误，不显示错误提示（全局处理）
      if (isKlineApi) {
        // 不显示错误提示，静默处理
        return
      }
      
      showToast({
        message: i18n.global.t(error.message) || i18n.global.t('serviceError'),
        type: 'fail',
        duration: 2000
      })
    }

    return Promise.reject(error)
  }
)

export default service
