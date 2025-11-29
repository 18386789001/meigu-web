import Axios from "@/utils/http";

/**
 * 市场配置相关 API
 */

/**
 * 获取支持的K线类型列表
 * @param {AbortController} controller - 用于中断请求的控制器（可选）
 * @returns {Promise} 返回K线类型列表
 * @description 获取系统支持的所有K线类型配置
 *
 * @example
 * const res = await getKlineTypes();
 * if (res.success) {
 *   const types = res.data.kline_types;
 *   // types: ["1分钟", "5分钟", "15分钟", "30分钟", "60分钟", "日K", "周K", "月K"]
 * }
 *
 * @returns {Promise<Object>} 返回数据结构：
 * {
 *   success: boolean,              // 请求是否成功
 *   data: {
 *     kline_types: string[]        // K线类型数组，如 ["1分钟", "5分钟", "15分钟", ...]
 *   }
 * }
 */
function getKlineTypes(controller = null) {
  return Axios.fetch("/api/alltick/market/kline/types", {}, controller);
}

/**
 * 获取支持的市场类型列表
 * @param {AbortController} controller - 用于中断请求的控制器（可选）
 * @returns {Promise} 返回市场类型列表
 * @description 获取系统支持的所有市场类型配置
 *
 * @example
 * const res = await getMarketTypes();
 * if (res.success) {
 *   const types = res.data.market_types;
 *   // types: ["stock", "forex", "crypto", "futures", ...]
 * }
 *
 * @returns {Promise<Object>} 返回数据结构：
 * {
 *   success: boolean,              // 请求是否成功
 *   data: {
 *     market_types: string[]       // 市场类型数组，如 ["stock", "forex", "crypto", ...]
 *   }
 * }
 */
function getMarketTypes(controller = null) {
  return Axios.fetch("/api/alltick/market/market/types", {}, controller);
}

/**
 * 查询最新成交价
 * @param {Object} params - 请求参数
 * @param {string[]} params.codeList - 股票代码列表（必填），如 ['AAPL.US', '9988.HK', 'TSLA.US']
 * @param {string} params.marketType - 市场类型（可选），如 'stock', 'forex', 'crypto'
 * @param {AbortController} controller - 用于中断请求的控制器（可选）
 * @returns {Promise} 返回最新成交价数据
 * @description 批量查询指定股票代码的最新成交价格信息
 *
 * @example
 * const res = await getTradeTick({
 *   codeList: ['AAPL.US', '9988.HK', 'TSLA.US'],
 *   marketType: 'stock'
 * });
 * if (res.success) {
 *   const trades = res.data.tick_list;
 *   trades.forEach(trade => {
 *     console.log(`${trade.code}: ${trade.price}`);
 *   });
 * }
 *
 * @returns {Promise<Object>} 返回数据结构：
 * {
 *   success: boolean,              // 请求是否成功
 *   count: number,                 // 返回的数据数量
 *   data: {
 *     tick_list: [{               // 成交数据列表
 *       code: string,              // 股票代码，如 'AAPL.US'
 *       tick_time: string,         // 成交时间戳，如 '1763366893931'
 *       price: string,             // 成交价格，如 '154.900000'
 *       volume: string,            // 成交量，如 '7221500'
 *       turnover: string,          // 成交额，如 '1118610350.000000'
 *       trade_direction: number,   // 交易方向：0-未知, 1-买入, 2-卖出
 *       seq: string                // 序列号，如 '2161475'
 *     }]
 *   }
 * }
 */
function getTradeTick(params, controller = null) {
  // 兼容旧的调用方式（数组）和新的调用方式（对象）
  let codeList, marketType;

  if (Array.isArray(params)) {
    codeList = params;
    marketType = null;
  } else {
    codeList = params.codeList;
    marketType = params.marketType;
  }

  // 构建URL，将 marketType 作为查询参数
  let url = "/api/alltick/market/trade-tick";
  if (marketType) {
    url += `?marketType=${marketType}`;
  }

  return Axios.post(url, codeList, controller);
}

/**
 * 查询市场深度
 * @param {Object} params - 请求参数
 * @param {string[]} params.codeList - 股票代码列表（必填），如 ['AAPL.US', '9988.HK']
 * @param {string} params.marketType - 市场类型（可选），如 'stock', 'forex', 'crypto'
 * @param {AbortController} controller - 用于中断请求的控制器（可选）
 * @returns {Promise} 返回市场深度数据
 * @description 批量查询指定股票代码的市场深度（买卖盘）信息
 *
 * @example
 * const res = await getDepthTick({
 *   codeList: ['9988.HK', 'AAPL.US'],
 *   marketType: 'stock'
 * });
 * if (res.success) {
 *   const depths = res.data.tick_list;
 *   depths.forEach(depth => {
 *     console.log(`${depth.code} - 买一: ${depth.bids[0].price}, 卖一: ${depth.asks[0].price}`);
 *   });
 * }
 *
 * @returns {Promise<Object>} 返回数据结构：
 * {
 *   success: boolean,              // 请求是否成功
 *   count: number,                 // 返回的数据数量
 *   data: {
 *     tick_list: [{               // 深度数据列表
 *       code: string,              // 股票代码，如 '9988.HK'
 *       tick_time: string,         // 时间戳，如 '1763366901430'
 *       asks: [{                   // 卖盘数组（卖一到卖十）
 *         volume: string,          // 挂单量，如 '154600'
 *         price: string            // 价格，如 '154.900000'
 *       }],
 *       bids: [{                   // 买盘数组（买一到买十）
 *         volume: string,          // 挂单量，如 '44800'
 *         price: string            // 价格，如 '154.800000'
 *       }],
 *       seq: string                // 序列号，如 '2162448'
 *     }]
 *   }
 * }
 */
function getDepthTick(params, controller = null) {
  // 兼容旧的调用方式（数组）和新的调用方式（对象）
  let codeList, marketType;

  if (Array.isArray(params)) {
    codeList = params;
    marketType = null;
  } else {
    codeList = params.codeList;
    marketType = params.marketType;
  }

  // 构建URL，将 marketType 作为查询参数
  let url = "/api/alltick/market/depth-tick";
  if (marketType) {
    url += `?marketType=${marketType}`;
  }

  return Axios.post(url, codeList, controller);
}

/**
 * 查询K线数据
 * @param {Object} params - 请求参数
 * @param {string} params.code - 股票代码（必填），如 'AAPL.US' 或 '9988.HK'
 * @param {number} [params.adjustType=0] - 复权类型（可选）：0-不复权, 1-前复权, 2-后复权
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
 * @description 查询指定股票的K线数据，支持多种K线类型和复权方式
 *
 * @example
 * // 查询日K线数据（不复权）
 * const res = await getKlineData({
 *   code: '9988.HK',
 *   klineType: 7,
 *   marketType: 'stock',
 *   adjustType: 0,
 *   num: 100
 * });
 *
 * // 查询5分钟K线（前复权）
 * const res = await getKlineData({
 *   code: 'AAPL.US',
 *   klineType: 3,
 *   marketType: 'stock',
 *   adjustType: 1,
 *   num: 200
 * });
 *
 * @returns {Promise<Object>} 返回数据结构：
 * {
 *   success: boolean,              // 请求是否成功
 *   data: {
 *     code: string,                // 股票代码，如 '9988.HK'
 *     kline_type: number,          // K线类型，如 7（日K）
 *     adjust_type: number,         // 复权类型：0-不复权, 1-前复权, 2-后复权
 *     kline_data: [{              // K线数据数组
 *       timestamp: string,         // 时间戳，如 '1763049600'
 *       open_price: string,        // 开盘价，如 '154.000000'
 *       close_price: string,       // 收盘价，如 '154.900000'
 *       high_price: string,        // 最高价，如 '155.500000'
 *       low_price: string,         // 最低价，如 '153.800000'
 *       volume: string,            // 成交量，如 '19956444'
 *       turnover: string           // 成交额，如 '12900520613.000000'
 *     }]
 *   }
 * }
 */
function getKlineData(params, controller = null) {
  return Axios.fetch("/api/alltick/market/kline", params, controller);
}

/**
 * 批量查询K线数据
 * @param {Object} params - 请求参数
 * @param {string[]} params.codeList - 股票代码列表（必填），如 ['AAPL.US', '9988.HK', '700.HK']
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
 * @description 批量查询多个股票的K线数据，适用于需要同时获取多只股票K线的场景
 *
 * @example
 * // 批量查询周K线数据
 * const res = await getBatchKlineData({
 *   codeList: ['700.HK', '9988.HK', 'AAPL.US'],
 *   klineType: 8,
 *   marketType: 'stock',
 *   num: 2
 * });
 * if (res.success) {
 *   const klineList = res.data.kline_list;
 *   klineList.forEach(stock => {
 *     console.log(`${stock.code}: ${stock.kline_data.length} 条K线数据`);
 *   });
 * }
 *
 * @returns {Promise<Object>} 返回数据结构：
 * {
 *   success: boolean,              // 请求是否成功
 *   data: {
 *     kline_list: [{               // K线列表数组
 *       code: string,              // 股票代码，如 '700.HK'
 *       kline_type: number,        // K线类型，如 8（周K）
 *       kline_data: [{             // K线数据数组
 *         timestamp: string,       // 时间戳，如 '1763049600'
 *         open_price: string,      // 开盘价，如 '645.000000'
 *         close_price: string,     // 收盘价，如 '641.000000'
 *         high_price: string,      // 最高价，如 '659.000000'
 *         low_price: string,       // 最低价，如 '640.000000'
 *         volume: string,          // 成交量，如 '19956444'
 *         turnover: string         // 成交额，如 '12900520613.000000'
 *       }]
 *     }]
 *   }
 * }
 */
function getBatchKlineData(params, controller = null) {
  return Axios.post("/api/alltick/market/kline/batch", params, controller);
}

/**
 * 解析成交数据
 * @param {Object} tradeData - 成交数据对象
 * @returns {Array} 返回格式化的成交数据数组
 * @description 辅助方法：将成交数据转换为更易用的格式
 */
function parseTradeData(tradeData) {
  if (
    !tradeData ||
    !tradeData.tick_list ||
    tradeData.tick_list.length === 0
  ) {
    return [];
  }

  return tradeData.tick_list.map((item) => ({
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

/**
 * 解析深度数据
 * @param {Object} depthData - 深度数据对象
 * @returns {Array} 返回格式化的深度数据数组
 * @description 辅助方法：将深度数据转换为更易用的格式
 */
function parseDepthData(depthData) {
  if (
    !depthData ||
    !depthData.tick_list ||
    depthData.tick_list.length === 0
  ) {
    return [];
  }

  return depthData.tick_list.map((item) => ({
    code: item.code,
    time: item.tick_time,
    timestamp: parseInt(item.tick_time),
    date: new Date(parseInt(item.tick_time)),
    asks: item.asks.map((ask) => ({
      price: parseFloat(ask.price),
      volume: parseFloat(ask.volume),
    })),
    bids: item.bids.map((bid) => ({
      price: parseFloat(bid.price),
      volume: parseFloat(bid.volume),
    })),
    seq: item.seq,
  }));
}

/**
 * 解析K线数据
 * @param {Object} klineData - K线数据对象
 * @returns {Object} 返回格式化的K线数据对象
 * @description 辅助方法：将K线数据转换为更易用的格式
 */
function parseKlineData(klineData) {
  if (!klineData || !klineData.kline_data || klineData.kline_data.length === 0) {
    return null;
  }

  return {
    code: klineData.code,
    klineType: klineData.kline_type,
    adjustType: klineData.adjust_type,
    klineData: klineData.kline_data.map((item) => ({
      timestamp: parseInt(item.timestamp),
      date: new Date(parseInt(item.timestamp) * 1000), // 转换为Date对象（秒级时间戳）
      open: parseFloat(item.open_price),
      close: parseFloat(item.close_price),
      high: parseFloat(item.high_price),
      low: parseFloat(item.low_price),
      volume: parseFloat(item.volume),
      turnover: parseFloat(item.turnover),
    })),
  };
}

/**
 * 解析批量K线数据
 * @param {Object} batchKlineData - 批量K线数据对象
 * @returns {Array} 返回格式化的批量K线数据数组
 * @description 辅助方法：将批量K线数据转换为更易用的格式
 */
function parseBatchKlineData(batchKlineData) {
  if (
    !batchKlineData ||
    !batchKlineData.kline_list ||
    batchKlineData.kline_list.length === 0
  ) {
    return [];
  }

  return batchKlineData.kline_list.map((stock) => ({
    code: stock.code,
    klineType: stock.kline_type,
    klineData: stock.kline_data.map((item) => ({
      timestamp: parseInt(item.timestamp),
      date: new Date(parseInt(item.timestamp) * 1000), // 转换为Date对象（秒级时间戳）
      open: parseFloat(item.open_price),
      close: parseFloat(item.close_price),
      high: parseFloat(item.high_price),
      low: parseFloat(item.low_price),
      volume: parseFloat(item.volume),
      turnover: parseFloat(item.turnover),
    })),
  }));
}

export default {
  getKlineTypes,
  getMarketTypes,
  getTradeTick,
  getDepthTick,
  getKlineData,
  getBatchKlineData,
  parseTradeData,
  parseDepthData,
  parseKlineData,
  parseBatchKlineData,
};
