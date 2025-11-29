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

/**
 * 获取自选股列表行情
 * @param {Object} data - 请求参数
 * @param {string} data.codes - 自选股代码列表，逗号分隔（必填），如 'AAPL.US,TSLA.US,700.HK' 或 '9988.HK,MSFT.US'
 * @param {AbortController} controller - 用于中断请求的控制器（可选）
 * @returns {Promise} 返回自选股列表的实时行情数据
 * @description 根据提供的股票代码列表，批量获取这些股票的实时行情信息
 *
 * @example
 * // 获取多只自选股的行情
 * const res = await getWatchlistQuotes({
 *   codes: 'AAPL.US,TSLA.US,700.HK'
 * });
 *
 * // 获取单只股票的行情
 * const res = await getWatchlistQuotes({
 *   codes: '9988.HK'
 * });
 *
 * @returns {Promise<Object>} 返回数据结构：
 * {
 *   success: boolean,              // 请求是否成功
 *   count: number,                 // 返回的股票数量
 *   data: {
 *     tick_list: [{               // 行情数据列表
 *       code: string,              // 股票代码，如 '9988.HK'
 *       tick_time: string,         // 时间戳，如 '1763366893931'
 *       price: string,             // 当前价格，如 '154.900000'
 *       volume: string,            // 成交量，如 '7221500'
 *       turnover: string,          // 成交额，如 '1118610350.000000'
 *       trade_direction: number,   // 交易方向：0-未知, 1-买入, 2-卖出
 *       seq: string                // 序列号，如 '2161475'
 *     }]
 *   }
 * }
 */
function getWatchlistQuotes(data, controller = null) {
  return Axios.fetch("/api/example/watchlist/quotes", data, controller);
}

/**
 * 解析自选股行情数据
 * @param {Object} quotesData - 自选股行情数据对象
 * @returns {Array} 返回格式化的自选股行情数据数组
 * @description 辅助方法：将自选股行情数据转换为更易用的格式
 */
function parseWatchlistQuotes(quotesData) {
  if (
    !quotesData ||
    !quotesData.tick_list ||
    quotesData.tick_list.length === 0
  ) {
    return [];
  }

  return quotesData.tick_list.map((item) => ({
    code: item.code,
    time: item.tick_time,
    timestamp: parseInt(item.tick_time),
    date: new Date(parseInt(item.tick_time)), // 转换为Date对象
    price: parseFloat(item.price),
    volume: parseFloat(item.volume),
    turnover: parseFloat(item.turnover),
    direction: item.trade_direction, // 0-未知, 1-买入, 2-卖出
    seq: item.seq,
  }));
}

export default {
  getCryptoQuotes,
  getForexQuotes,
  getHomeStocksQuotes,
  getAllMarketQuotes,
  getWatchlistQuotes,
  parseWatchlistQuotes,
};
