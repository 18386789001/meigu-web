import Axios from "@/utils/http";

/**
 * 市场行情相关 API
 */

/**
 * 获取加密货币行情
 * @param {Object} data - 请求参数
 * @param {AbortController} controller - 用于中断请求的控制器（可选）
 * @returns {Promise} 返回加密货币行情数据
 * @description 获取实时加密货币交易行情，包括价格、成交量等信息
 */
function getCryptoQuotes(data, controller = null) {
  return Axios.fetch("/api/example/crypto/quotes", data, controller);
}

/**
 * 获取外汇行情
 * @param {Object} data - 请求参数
 * @param {AbortController} controller - 用于中断请求的控制器（可选）
 * @returns {Promise} 返回外汇行情数据
 * @description 获取实时外汇交易行情，包括汇率、成交量等信息
 */
function getForexQuotes(data, controller = null) {
  return Axios.fetch("/api/example/forex/quotes", data, controller);
}

/**
 * 获取首页推荐股票行情
 * @param {Object} data - 请求参数
 * @param {AbortController} controller - 用于中断请求的控制器（可选）
 * @returns {Promise} 返回首页推荐股票行情数据
 * @description 获取首页展示的推荐股票实时行情，包括港股和美股
 */
function getHomeStocksQuotes(data, controller = null) {
  return Axios.fetch("/api/example/home/stocks", data, controller);
}

/**
 * 获取所有市场行情（加密货币、外汇、股票）
 * @param {Object} params - 请求参数
 * @param {string} params.market - 市场类型：crypto|forex|stocks
 * @param {AbortController} controller - 用于中断请求的控制器（可选）
 * @returns {Promise} 返回对应市场的行情数据
 * @description 根据市场类型统一获取行情数据的便捷方法
 */
function getAllMarketQuotes(params, controller = null) {
  const { market, ...data } = params;

  switch (market) {
    case "crypto":
      return getCryptoQuotes(data, controller);
    case "forex":
      return getForexQuotes(data, controller);
    case "stocks":
      return getHomeStocksQuotes(data, controller);
    default:
      return Promise.reject(new Error("Invalid market type"));
  }
}

export default {
  getCryptoQuotes,
  getForexQuotes,
  getHomeStocksQuotes,
  getAllMarketQuotes,
};
