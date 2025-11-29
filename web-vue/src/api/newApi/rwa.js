import Axios from "@/utils/http";
import marketConfigApi from "./marketConfig.js";

/**
 * RWA（Real World Assets）资产相关 API
 * RWA 资产包含：股票、外汇、加密货币
 */

/**
 * 获取 RWA 资产行情列表
 * @param {Object} data - 请求参数
 * @param {string} [data.categoryCode] - 分类代码：stocks(股票)、forex(外汇)、crypto(加密货币)、all(全部)
 * @param {string} [data.keyword] - 搜索关键词
 * @param {AbortController} controller - 用于中断请求的控制器（可选）
 * @returns {Promise} 返回 RWA 资产行情数据
 * @description 获取实时 RWA 资产交易行情，包括价格、成交量等信息
 *
 * @example
 * // 获取所有 RWA 资产
 * const res = await getRWAQuotes({}, controller);
 *
 * // 获取股票行情
 * const res = await getRWAQuotes({ categoryCode: 'stocks' }, controller);
 *
 * // 获取外汇行情
 * const res = await getRWAQuotes({ categoryCode: 'forex' }, controller);
 *
 * // 获取加密货币行情
 * const res = await getRWAQuotes({ categoryCode: 'crypto' }, controller);
 */
async function getRWAQuotes(data, controller = null) {
  const { categoryCode, keyword, ...params } = data || {};

  try {
    let result = { success: true, count: 0, data: { tick_list: [] } };

    // 根据分类代码调用不同的接口
    if (!categoryCode || categoryCode === 'all') {
      // 获取所有类型的资产
      const [stocksRes, forexRes, cryptoRes] = await Promise.all([
        Axios.fetch("/api/example/home/stocks", params, controller),
        Axios.fetch("/api/example/forex/quotes", params, controller),
        Axios.fetch("/api/example/crypto/quotes", params, controller),
      ]);

      // 合并所有数据
      const allTickList = [];

      if (stocksRes.success && stocksRes.data?.tick_list) {
        allTickList.push(...stocksRes.data.tick_list.map(item => ({
          ...item,
          categoryCode: 'stocks',
          categoryName: '股票',
        })));
      }

      if (forexRes.success && forexRes.data?.tick_list) {
        allTickList.push(...forexRes.data.tick_list.map(item => ({
          ...item,
          categoryCode: 'forex',
          categoryName: '外汇',
        })));
      }

      if (cryptoRes.success && cryptoRes.data?.tick_list) {
        allTickList.push(...cryptoRes.data.tick_list.map(item => ({
          ...item,
          categoryCode: 'crypto',
          categoryName: '加密货币',
        })));
      }

      result.data.tick_list = allTickList;
      result.count = allTickList.length;

    } else if (categoryCode === 'stocks') {
      // 获取股票
      const res = await Axios.fetch("/api/example/home/stocks", params, controller);
      if (res.success && res.data?.tick_list) {
        result.data.tick_list = res.data.tick_list.map(item => ({
          ...item,
          categoryCode: 'stocks',
          categoryName: '股票',
        }));
        result.count = result.data.tick_list.length;
      }

    } else if (categoryCode === 'forex') {
      // 获取外汇
      const res = await Axios.fetch("/api/example/forex/quotes", params, controller);
      if (res.success && res.data?.tick_list) {
        result.data.tick_list = res.data.tick_list.map(item => ({
          ...item,
          categoryCode: 'forex',
          categoryName: '外汇',
        }));
        result.count = result.data.tick_list.length;
      }

    } else if (categoryCode === 'crypto') {
      // 获取加密货币
      const res = await Axios.fetch("/api/example/crypto/quotes", params, controller);
      if (res.success && res.data?.tick_list) {
        result.data.tick_list = res.data.tick_list.map(item => ({
          ...item,
          categoryCode: 'crypto',
          categoryName: '加密货币',
        }));
        result.count = result.data.tick_list.length;
      }
    }

    // 如果有搜索关键词，进行前端过滤
    if (keyword && result.data.tick_list.length > 0) {
      const lowerKeyword = keyword.toLowerCase();
      result.data.tick_list = result.data.tick_list.filter(item => {
        const code = (item.code || '').toLowerCase();
        const name = (item.name || '').toLowerCase();
        return code.includes(lowerKeyword) || name.includes(lowerKeyword);
      });
      result.count = result.data.tick_list.length;
    }

    return result;

  } catch (error) {
    console.error('获取RWA资产行情失败:', error);
    return { success: false, count: 0, data: { tick_list: [] } };
  }
}

/**
 * 获取 RWA 资产分类列表
 * @param {Object} data - 请求参数
 * @param {AbortController} controller - 用于中断请求的控制器（可选）
 * @returns {Promise} 返回 RWA 资产分类列表
 * @description 获取所有 RWA 资产分类：股票、外汇、加密货币
 */
function getRWACategories(data, controller = null) {
  // 返回固定的分类列表
  return Promise.resolve({
    success: true,
    data: {
      categories: [
        {
          id: 1,
          code: 'stocks',
          name: '股票',
          enName: 'Stocks',
          icon: '',
          sort: 1
        },
        {
          id: 2,
          code: 'forex',
          name: '外汇',
          enName: 'Forex',
          icon: '',
          sort: 2
        },
        {
          id: 3,
          code: 'crypto',
          name: '加密货币',
          enName: 'Crypto',
          icon: '',
          sort: 3
        }
      ]
    }
  });
}

/**
 * 获取自选 RWA 资产行情
 * @param {Object} data - 请求参数
 * @param {string} data.codes - RWA 资产代码列表，逗号分隔（必填），如 'AAPL.US,EURUSD,BTCUSDT'
 * @param {AbortController} controller - 用于中断请求的控制器（可选）
 * @returns {Promise} 返回自选 RWA 资产的实时行情数据
 * @description 根据提供的资产代码列表，批量获取这些资产的实时行情信息
 *
 * @example
 * const res = await getRWAWatchlistQuotes({
 *   codes: 'AAPL.US,EURUSD,BTCUSDT'
 * });
 */
function getRWAWatchlistQuotes(data, controller = null) {
  return Axios.fetch("/api/example/watchlist/quotes", data, controller);
}

/**
 * 获取 RWA 资产详情
 * @param {Object} data - 请求参数
 * @param {string} data.code - 资产代码（必填），如 'AAPL.US'、'EURUSD'、'BTCUSDT'
 * @param {AbortController} controller - 用于中断请求的控制器（可选）
 * @returns {Promise} 返回 RWA 资产详情
 * @description 获取指定 RWA 资产的详细信息
 */
function getRWADetail(data, controller = null) {
  return Axios.fetch("/api/example/asset/detail", data, controller);
}

/**
 * 解析 RWA 资产行情数据
 * @param {Object} quotesData - RWA 资产行情数据对象
 * @returns {Array} 返回格式化的 RWA 资产行情数据数组
 * @description 辅助方法：将 RWA 资产行情数据转换为更易用的格式
 */
function parseRWAQuotes(quotesData) {
  if (
    !quotesData ||
    !quotesData.tick_list ||
    quotesData.tick_list.length === 0
  ) {
    return [];
  }

  return quotesData.tick_list.map((item) => ({
    code: item.code,
    name: item.name,
    time: item.tick_time,
    timestamp: parseInt(item.tick_time),
    date: new Date(parseInt(item.tick_time)),
    price: parseFloat(item.price),
    volume: parseFloat(item.volume),
    turnover: parseFloat(item.turnover),
    change: parseFloat(item.change),
    changeRatio: parseFloat(item.changeRatio),
    high: parseFloat(item.high),
    low: parseFloat(item.low),
    open: parseFloat(item.open),
    preClose: parseFloat(item.preClose),
    categoryCode: item.categoryCode,
    categoryName: item.categoryName,
    icon: item.icon,
    seq: item.seq,
  }));
}

/**
 * 获取支持的 K 线类型列表
 * @param {AbortController} controller - 用于中断请求的控制器（可选）
 * @returns {Promise} 返回K线类型列表
 * @description 获取系统支持的所有K线类型配置
 *
 * @example
 * const res = await getRWAKlineTypes();
 * if (res.success) {
 *   const types = res.data.kline_types;
 *   // types: ["1分钟", "5分钟", "15分钟", "30分钟", "60分钟", "日K", "周K", "月K"]
 * }
 *
 * @returns {Promise<Object>} 返回数据结构：
 * {
 *   success: boolean,              // 请求是否成功
 *   data: {
 *     kline_types: string[]        // K线类型数组
 *   }
 * }
 */
function getRWAKlineTypes(controller = null) {
  return marketConfigApi.getKlineTypes(controller);
}

/**
 * 获取支持的市场类型列表
 * @param {AbortController} controller - 用于中断请求的控制器（可选）
 * @returns {Promise} 返回市场类型列表
 * @description 获取系统支持的所有市场类型配置
 *
 * @example
 * const res = await getRWAMarketTypes();
 * if (res.success) {
 *   const types = res.data.market_types;
 *   // types: ["stock", "forex", "crypto", "futures", ...]
 * }
 *
 * @returns {Promise<Object>} 返回数据结构：
 * {
 *   success: boolean,              // 请求是否成功
 *   data: {
 *     market_types: string[]       // 市场类型数组
 *   }
 * }
 */
function getRWAMarketTypes(controller = null) {
  return marketConfigApi.getMarketTypes(controller);
}

/**
 * 获取 RWA 资产 K 线数据
 * @param {Object} params - 请求参数
 * @param {string} params.code - 资产代码（必填），如 'AAPL.US'、'EURUSD'、'BTCUSDT'
 * @param {number} [params.adjustType=0] - 复权类型（可选）：0-不复权, 1-前复权, 2-后复权（仅股票有效）
 * @param {number} params.klineType - K线类型（必填）：
 *   - 1: 分时
 *   - 2: 1分钟
 *   - 3: 5分钟
 *   - 4: 15分钟
 *   - 5: 30分钟
 *   - 6: 1小时
 *   - 7: 日K
 *   - 8: 周K
 *   - 9: 月K
 * @param {string} params.marketType - 市场类型（必填），如 'stock', 'forex', 'crypto'
 * @param {number} [params.num=100] - 返回数据条数（可选），默认100条
 * @param {AbortController} controller - 用于中断请求的控制器（可选）
 * @returns {Promise} 返回K线数据
 * @description 查询指定 RWA 资产的K线数据，支持多种K线类型和复权方式
 *
 * @example
 * // 查询股票日K线数据
 * const res = await getRWAKlineData({
 *   code: 'AAPL.US',
 *   klineType: 7,
 *   marketType: 'stock',
 *   adjustType: 0,
 *   num: 100
 * });
 *
 * // 查询外汇5分钟K线
 * const res = await getRWAKlineData({
 *   code: 'EURUSD',
 *   klineType: 3,
 *   marketType: 'forex',
 *   num: 200
 * });
 *
 * // 查询加密货币1小时K线
 * const res = await getRWAKlineData({
 *   code: 'BTCUSDT',
 *   klineType: 6,
 *   marketType: 'crypto',
 *   num: 100
 * });
 */
function getRWAKlineData(params, controller = null) {
  return marketConfigApi.getKlineData(params, controller);
}

/**
 * 批量获取 RWA 资产 K 线数据
 * @param {Object} params - 请求参数
 * @param {string[]} params.codeList - 资产代码列表（必填），如 ['AAPL.US', 'EURUSD', 'BTCUSDT']
 * @param {number} [params.klineType] - K线类型（可选）：
 *   - 1: 分时
 *   - 2: 1分钟
 *   - 3: 5分钟
 *   - 4: 15分钟
 *   - 5: 30分钟
 *   - 6: 1小时
 *   - 7: 日K
 *   - 8: 周K
 *   - 9: 月K
 * @param {string} [params.marketType] - 市场类型（可选），如 'stock', 'forex', 'crypto'
 * @param {number} [params.num=2] - 返回数据条数（可选），批量查询建议设置为2
 * @param {AbortController} controller - 用于中断请求的控制器（可选）
 * @returns {Promise} 返回批量K线数据
 * @description 批量查询多个 RWA 资产的K线数据，适用于需要同时获取多个资产K线的场景
 *
 * @example
 * // 批量查询不同类型资产的日K线
 * const res = await getRWABatchKlineData({
 *   codeList: ['AAPL.US', 'EURUSD', 'BTCUSDT'],
 *   klineType: 7,
 *   num: 2
 * });
 */
function getRWABatchKlineData(params, controller = null) {
  return marketConfigApi.getBatchKlineData(params, controller);
}

/**
 * 获取 RWA 资产最新成交价
 * @param {Object} params - 请求参数
 * @param {string[]} params.codeList - 资产代码列表（必填），如 ['AAPL.US', 'EURUSD', 'BTCUSDT']
 * @param {string} params.marketType - 市场类型（可选），如 'stock', 'forex', 'crypto'
 * @param {AbortController} controller - 用于中断请求的控制器（可选）
 * @returns {Promise} 返回最新成交价数据
 * @description 批量查询指定 RWA 资产的最新成交价格信息
 *
 * @example
 * const res = await getRWATradeTick({
 *   codeList: ['AAPL.US', 'EURUSD', 'BTCUSDT'],
 *   marketType: 'stock'
 * });
 */
function getRWATradeTick(params, controller = null) {
  return marketConfigApi.getTradeTick(params, controller);
}

/**
 * 获取 RWA 资产市场深度
 * @param {Object} params - 请求参数
 * @param {string[]} params.codeList - 资产代码列表（必填），如 ['AAPL.US', 'EURUSD']
 * @param {string} params.marketType - 市场类型（可选），如 'stock', 'forex', 'crypto'
 * @param {AbortController} controller - 用于中断请求的控制器（可选）
 * @returns {Promise} 返回市场深度数据
 * @description 批量查询指定 RWA 资产的市场深度（买卖盘）信息
 *
 * @example
 * const res = await getRWADepthTick({
 *   codeList: ['AAPL.US', 'EURUSD'],
 *   marketType: 'stock'
 * });
 */
function getRWADepthTick(params, controller = null) {
  return marketConfigApi.getDepthTick(params, controller);
}

export default {
  getRWAQuotes,
  getRWACategories,
  getRWAWatchlistQuotes,
  getRWADetail,
  parseRWAQuotes,
  // K线相关
  getRWAKlineTypes,
  getRWAMarketTypes,
  getRWAKlineData,
  getRWABatchKlineData,
  getRWATradeTick,
  getRWADepthTick,
  // 复用 marketConfig 的解析方法
  parseKlineData: marketConfigApi.parseKlineData,
  parseBatchKlineData: marketConfigApi.parseBatchKlineData,
  parseTradeData: marketConfigApi.parseTradeData,
  parseDepthData: marketConfigApi.parseDepthData,
};
