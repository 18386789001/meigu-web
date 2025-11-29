import { getCurrentDomain, generateUrl, generateWapUrl, generateApiUrl, generateWsUrl, URL_GENERATORS } from '@/utils/domainManager';

// 环境配置
let env_url = '';
if (import.meta.env.MODE === 'development') {
  // 开发环境使用相对路径，通过Vite代理转发到生产环境
  env_url = "";
} else {
  env_url = getCurrentDomain();
}

let ENV_DEV = "http://" + env_url + "/"; // dev
let ENV_PROD = "https://" + env_url + "/"; // prod

let HOST_URL = "";
let BASE_URL = "";
let WS_URL = "";
let WAP_URL = ""; // WAP端URL配置

if (import.meta.env.MODE === 'development') {
  // 开发环境使用相对路径
  HOST_URL = "";
  BASE_URL = "/";
  WS_URL = generateWsUrl();
  WAP_URL = generateWapUrl(); // 开发环境使用域名管理器
} else {
  // 生产环境使用HTTPS协议
  HOST_URL = "https://" + env_url;
  BASE_URL = ENV_PROD;
  WS_URL = generateWsUrl();
  WAP_URL = generateWapUrl(); // 生产环境动态获取域名
}

// 使用域名管理器的URL生成器
const URLS = {
  // WAP端登录注册页面（支持语言参数传递）
  LOGIN: (params = {}) => URL_GENERATORS.WAP_LOGIN(params),
  REGISTER: (params = {}) => URL_GENERATORS.WAP_REGISTER(params),
  DEMO_ACCOUNT: (params = {}) => URL_GENERATORS.WAP_DEMO(params),
  REAL_ACCOUNT: (params = {}) => URL_GENERATORS.WAP_REAL(params),

  // 交易相关页面
  TRADING: (tradingType, params = {}) => URL_GENERATORS.WAP_TRADING(tradingType, params),
  DEMO_TRADING: (tradingType, params = {}) => URL_GENERATORS.WAP_DEMO_TRADING(tradingType, params),
  REAL_TRADING: (tradingType, params = {}) => URL_GENERATORS.WAP_REAL_TRADING(tradingType, params),

  // API相关
  API_REALTIME: (symbol) => URL_GENERATORS.API_REALTIME(symbol),
  API_DEPTH: (symbol) => URL_GENERATORS.API_DEPTH(symbol),
  API_KLINE: (symbol, period) => URL_GENERATORS.API_KLINE(symbol, period),

  // WebSocket相关
  WS_REALTIME: (symbols) => URL_GENERATORS.WS_REALTIME(symbols),
  WS_DEPTH: (symbol) => URL_GENERATORS.WS_DEPTH(symbol),
};

// 动态URL生成器（向后兼容）
const createDynamicUrl = (path = '', params = {}) => {
  return generateWapUrl(path, params);
};

export default {
  HOST_URL,
  BASE_URL,
  WS_URL,
  WAP_URL,
  createDynamicUrl,
  URLS,
  // 导出域名管理功能
  getCurrentDomain,
  generateUrl,
  generateWapUrl,
  generateApiUrl,
  generateWsUrl,
};
