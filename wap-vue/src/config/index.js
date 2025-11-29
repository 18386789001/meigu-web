// 请求方法
export const METHODS = { POST: 'POST', GET: 'GET', PUT: 'PUT', PATCH: 'PATCH', DELETE: 'DELETE' }

// 请求超时时间
export const REQUEST_TIMEOUT = 30000

// 请求频率
export const TIME_OUT = 10000

// 表单类型key
export const CONTENT_TYPE = 'Content-Type'

// 表单类型value
export const CONTENT_TYPES = {
    URL_ENCODED: 'application/x-www-form-urlencoded'
}

// 是否携带凭证
export const WITH_CREDENTIALS = false

// API前缀
export const API_PREFIX = ''

// 请求频率
export const REQUEST_TIMER = 2000


/// 默认日线
export const defaultStage = '1day'

export const defaultSeconds = 1 * 24 * 60 * 60 * 1000


let base_url = import.meta.env.VITE_BASE_API
let ws_url = import.meta.env.VITE_WEB_SOCKET+'/api/websocket'
let host_url =import.meta.env.VITE_BASE_API

// 在开发环境中使用空字符串，让请求通过Vite代理
// if (import.meta.env.DEV) {
//   base_url = ''
//   host_url = ''
// }

export const BASE_URL = base_url
export const WS_URL = ws_url
export const IMG_PATH = host_url
export const HOST_URL = host_url

export default {
    sliderOptions: {
        dotSize: 14,
        width: 'auto',
        height: 4,
        contained: false,
        direction: 'ltr',
        data: null,
        dataLabel: 'label',
        dataValue: 'value',
        min: 0,
        max: 0, // 这里默认是3，被我改了
        interval: 1,
        disabled: false,
        clickable: true,
        duration: 0.5,
        adsorb: false,
        lazy: false,
        tooltip: 'active',
        tooltipPlacement: 'top',
        tooltipFormatter: void 0,
        useKeyboard: false,
        keydownHook: null,
        dragOnClick: false,
        enableCross: true,
        fixed: false,
        minRange: void 0,
        maxRange: void 0,
        order: true,
        marks: false,
        dotOptions: void 0,
        dotAttrs: void 0,
        process: true,
        dotStyle: void 0,
        railStyle: void 0,
        processStyle: void 0,
        tooltipStyle: void 0,
        stepStyle: void 0,
        stepActiveStyle: void 0,
        labelStyle: void 0,
        labelActiveStyle: void 0,
    }
}
