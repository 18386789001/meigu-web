/**
 * 大宗商品 API 接口文件
 * 包含大宗商品的所有数据获取接口
 * 创建日期: 2025-11-22
 * 版本: v1.0
 */

import Axios from "@/utils/http";

// ================================
// 一、符号映射配置
// ================================

/**
 * 大宗商品符号映射表
 * 用于将业务层符号转换为API所需符号
 */
const SYMBOL_MAPPING = {
  // 贵金属类
  'XAUUSD': 'GOLD',       // 黄金
  'XAGUSD': 'Silver',     // 白银
  'XPTUSD': 'Platinum',   // 铂金
  'XPDUSD': 'Palladium',  // 钯金

  // 工业金属类
  'XCUUSD': 'COPPER',     // 铜
  'XALUSD': 'Aluminum',   // 铝
  'XNIUSD': 'Nickel',     // 镍
  'XZNUSD': 'Zinc',       // 锌
  'XPBUSD': 'Lead',       // 铅

  // 能源类
  'UKOIL': 'UKOIL',       // 布伦特原油
  'USOIL': 'USOIL'        // 美国原油
};

/**
 * 将业务符号转换为API符号
 * @param {string} symbol - 业务符号（如 XAUUSD）
 * @returns {string} API符号（如 GOLD）
 */
const convertSymbol = (symbol) => {
  return SYMBOL_MAPPING[symbol] || symbol;
};

// ================================
// 二、大宗商品数据获取 API
// ================================

/**
 * 获取大宗商品实时数据
 * @param {number} pageNo - 分页页码，默认为1
 * @param {string} language - 语言，固定为 'zh-CN'
 * @returns {Promise<Object>} 返回大宗商品实时数据
 *
 * 返回数据结构：
 * {
 *   success: true,
 *   data: {
 *     tick_list: [{
 *       symbol: "XAUUSD",
 *       name: "黄金",
 *       price: "3760.24",
 *       changeRatio: 0.29,
 *       change: 10.83,
 *       close: 3760.24,
 *       high: 3783.78,
 *       low: 3734.63,
 *       open: 3748.99,
 *       volume: "1234567",
 *       turnover: "1234567890.00",
 *       tick_time: "1763366893931",
 *       seq: "2161475"
 *     }],
 *     count: 20
 *   }
 * }
 */
function getCommoditiesRealtime(pageNo = 1, language = 'zh-CN') {
  return Axios.fetch('/api/publicRealtimeByType', {
    type: 'forex',
    pageNo: pageNo,
    category: 'commodities',
    language: 'zh-CN' // 固定使用zh-CN
  });
}

/**
 * 获取币种列表（支持大宗商品）
 * @param {Object} params - 请求参数
 * @param {string} params.type - 类型：'forex'(外汇) 或 'commodities'(大宗商品)
 * @param {string} params.language - 语言（type='commodities' 时自动设为 'zh-CN'）
 * @param {AbortController} controller - 用于取消请求
 * @returns {Promise<Array>} 返回币种列表
 *
 * 特殊处理：
 * 1. 当 type='commodities' 时，自动将 language 设为 'zh-CN'
 * 2. 返回数据中会自动过滤掉 XAUUSD（黄金）和 XAGUSD（白银）
 */
function getCoins(params = {}, controller = null) {
  const requestParams = { ...params };

  // 如果是commodities类型，固定使用zh-CN语言
  if (params && params.type === 'commodities') {
    requestParams.language = 'zh-CN';
  }

  return Axios.fetch('/api/item!list.action', requestParams, controller)
    .then(response => {
      // 如果是commodities类型，过滤掉symbol=XAUUSD和symbol=XAGUSD的数据
      if (params && params.type === 'commodities' && Array.isArray(response)) {
        const filteredData = response.filter(item =>
          item.symbol !== 'XAUUSD' && item.symbol !== 'XAGUSD'
        );
        return filteredData;
      }
      return response;
    });
}

/**
 * 获取行情数据
 * @param {string} symbol - 商品符号，如 'XAUUSD'、'EURUSD'
 * @param {boolean} isCommodities - 是否为大宗商品（为 true 时自动设置 language='zh-CN'）
 * @param {AbortController} controller - 用于取消请求
 * @returns {Promise<Object>} 返回行情数据
 */
function getHomeList(symbol = 'btc', isCommodities = false, controller = null) {
  const params = { symbol };

  if (isCommodities) {
    params.language = 'zh-CN';
  }

  return Axios.fetch('/api/hobi!getRealtime.action', params, controller);
}

// ================================
// 三、K线和市场数据 API
// ================================

/**
 * 获取K线数据
 * @param {string} symbol - 商品符号（原始符号，如 XAUUSD），会自动转换
 * @param {string} line - 时间周期：1min, 5min, 15min, 30min, 60min, 4hour, 1day, 1week, 1mon
 * @param {AbortController} controller - 用于取消请求
 * @returns {Promise<Array>} 返回K线数据数组
 *
 * 注意：
 * 1. 传入业务符号（如 XAUUSD），内部会自动转换为API符号（如 GOLD）
 * 2. 语言固定为 'en'，避免多次调用导致的语言混乱
 */
function getKline(symbol, line, controller = null) {
  const apiSymbol = convertSymbol(symbol);

  console.log(`📊 K线图API调用: ${symbol} -> ${apiSymbol}, 时间周期: ${line}, 语言: en`);

  return Axios.fetch('/api/hobi!getKlineV1.action', {
    symbol: apiSymbol,
    line,
    language: 'en'
  }, controller).catch((error) => {
    console.error(`❌ K线图API调用失败: ${symbol} -> ${apiSymbol}`, error);
    return [];
  });
}

/**
 * 获取分时数据
 * @param {string} symbol - 商品符号（原始符号，会自动映射）
 * @param {AbortController} controller - 用于取消请求
 * @returns {Promise<Array>} 返回分时数据数组
 */
function getTrend(symbol, controller = null) {
  const apiSymbol = convertSymbol(symbol);

  console.log(`📈 分时图API调用: ${symbol} -> ${apiSymbol}`);

  return Axios.fetch('/api/hobi!getTrend.action', {
    symbol: apiSymbol
  }, controller).catch((error) => {
    console.error(`❌ 分时图API调用失败: ${symbol} -> ${apiSymbol}`, error);
    return [];
  });
}

/**
 * 获取交易记录
 * @param {string} symbol - 商品符号（支持 XAUUSD→GOLD、XAGUSD→Silver 映射）
 * @param {AbortController} controller - 用于取消请求
 * @returns {Promise<Array>} 返回交易记录数组
 */
function getTrade(symbol, controller = null) {
  const apiSymbol = convertSymbol(symbol);

  return Axios.fetch('/api/hobi!getTrade.action', {
    symbol: apiSymbol
  }, controller);
}

/**
 * 获取深度数据
 * @param {string} symbol - 商品符号
 * @param {AbortController} controller - 用于取消请求
 * @returns {Promise<Object>} 返回深度数据
 *
 * 返回数据结构：
 * {
 *   symbol: "GOLD",
 *   asks: [{ price: "3761.00", volume: "100" }],
 *   bids: [{ price: "3760.00", volume: "150" }]
 * }
 */
function getDeepData(symbol, controller = null) {
  const apiSymbol = convertSymbol(symbol);

  return Axios.fetch('/api/hobi!getDepth.action', {
    symbol: apiSymbol
  }, controller);
}

// ================================
// 四、工具函数
// ================================

/**
 * 获取支持的时间周期列表
 * @returns {Array<Object>} 时间周期配置数组
 */
function getTimeFrames() {
  return [
    { value: '1min', label: '1分钟' },
    { value: '5min', label: '5分钟' },
    { value: '15min', label: '15分钟' },
    { value: '30min', label: '30分钟' },
    { value: '60min', label: '1小时' },
    { value: '4hour', label: '4小时' },
    { value: '1day', label: '日K' },
    { value: '1week', label: '周K' },
    { value: '1mon', label: '月K' }
  ];
}

/**
 * 获取大宗商品分类配置
 * @returns {Array<Object>} 商品分类数组
 */
function getCommodityCategories() {
  return [
    {
      code: 'precious_metals',
      name: 'Precious Metals',
      items: ['XAUUSD', 'XAGUSD', 'XPTUSD', 'XPDUSD']
    },
    {
      code: 'industrial_metals',
      name: 'Industrial Metals',
      items: ['XCUUSD', 'XALUSD', 'XNIUSD', 'XZNUSD', 'XPBUSD']
    },
    {
      code: 'energy',
      name: 'Energy',
      items: ['UKOIL', 'USOIL']
    }
  ];
}

/**
 * 获取商品名称（中文）
 * @param {string} symbol - 商品符号
 * @returns {string} 商品中文名称
 */
function getCommodityName(symbol) {
  const nameMap = {
    'XAUUSD': '黄金',
    'XAGUSD': '白银',
    'XPTUSD': '铂金',
    'XPDUSD': '钯金',
    'XCUUSD': '铜',
    'XALUSD': '铝',
    'XNIUSD': '镍',
    'XZNUSD': '锌',
    'XPBUSD': '铅',
    'UKOIL': '布伦特原油',
    'USOIL': '美国原油'
  };
  return nameMap[symbol] || symbol;
}

// ================================
// 五、导出接口
// ================================

export default {
  // 数据获取接口
  getCommoditiesRealtime,
  getCoins,
  getHomeList,

  // K线和市场数据接口
  getKline,
  getTrend,
  getTrade,
  getDeepData,

  // 工具函数
  getTimeFrames,
  getCommodityCategories,
  getCommodityName,
  convertSymbol,

  // 导出符号映射表（供外部使用）
  SYMBOL_MAPPING
};
