import Axios from "@/utils/http";

/**
 * 股票详情相关 API
 */

/**
 * 获取股票详情页数据（K线+深度+成交）
 * @param {Object} data - 请求参数
 * @param {string} data.code - 股票代码（必填），例如：'9988.HK', 'AAPL.US'
 * @param {AbortController} controller - 用于中断请求的控制器（可选）
 * @returns {Promise} 返回股票详情数据
 * @description 获取指定股票的完整详情数据，包括：
 * - K线数据（暂未在示例中展示）
 * - 深度数据（depthData）：包含买卖盘信息（买一到买十，卖一到卖十）
 * - 成交数据（tradeData）：包含实时成交记录
 *
 * @example
 * // 使用示例
 * const res = await getStockDetail({ code: '9988.HK' });
 * if (res.success) {
 *   const { depthData, tradeData } = res.data;
 *   // 处理深度数据
 *   const asks = depthData.tick_list[0].asks; // 卖盘
 *   const bids = depthData.tick_list[0].bids; // 买盘
 *   // 处理成交数据
 *   const trades = tradeData.tick_list;
 * }
 *
 * @returns {Promise<Object>} 返回数据结构：
 * {
 *   success: boolean,              // 请求是否成功
 *   data: {
 *     code: string,                // 股票代码，如 '9988.HK'
 *     depthData: {                 // 深度数据（买卖盘）
 *       tick_list: [{
 *         tick_time: string,       // 时间戳，如 '1763366901430'
 *         code: string,            // 股票代码
 *         asks: [{                 // 卖盘数组（卖一到卖十）
 *           volume: string,        // 挂单量，如 '154600'
 *           price: string          // 价格，如 '154.900000'
 *         }],
 *         bids: [{                 // 买盘数组（买一到买十）
 *           volume: string,        // 挂单量，如 '44800'
 *           price: string          // 价格，如 '154.800000'
 *         }],
 *         seq: string              // 序列号，如 '2162448'
 *       }]
 *     },
 *     tradeData: {                 // 成交数据
 *       tick_list: [{
 *         volume: string,          // 成交量，如 '7221500'
 *         tick_time: string,       // 成交时间戳，如 '1763366893931'
 *         trade_direction: number, // 交易方向：0-未知, 1-买入, 2-卖出
 *         code: string,            // 股票代码，如 '9988.HK'
 *         price: string,           // 成交价格，如 '154.900000'
 *         turnover: string,        // 成交额，如 '1118610350.000000'
 *         seq: string              // 序列号，如 '2161475'
 *       }]
 *     }
 *   }
 * }
 */
function getStockDetail(data, controller = null) {
  return Axios.fetch("/api/example/stock/detail", data, controller);
}

/**
 * 解析深度数据
 * @param {Object} depthData - 深度数据对象
 * @returns {Object} 返回格式化的深度数据
 * @description 辅助方法：将深度数据转换为更易用的格式
 */
function parseDepthData(depthData) {
  if (!depthData || !depthData.tick_list || depthData.tick_list.length === 0) {
    return null;
  }

  const latestTick = depthData.tick_list[0];
  return {
    time: latestTick.tick_time,
    code: latestTick.code,
    asks: latestTick.asks.map((item) => ({
      price: parseFloat(item.price),
      volume: parseFloat(item.volume),
    })),
    bids: latestTick.bids.map((item) => ({
      price: parseFloat(item.price),
      volume: parseFloat(item.volume),
    })),
    seq: latestTick.seq,
  };
}

/**
 * 解析成交数据
 * @param {Object} tradeData - 成交数据对象
 * @returns {Array} 返回格式化的成交数据数组
 * @description 辅助方法：将成交数据转换为更易用的格式
 */
function parseTradeData(tradeData) {
  if (!tradeData || !tradeData.tick_list || tradeData.tick_list.length === 0) {
    return [];
  }

  return tradeData.tick_list.map((item) => ({
    time: item.tick_time,
    code: item.code,
    price: parseFloat(item.price),
    volume: parseFloat(item.volume),
    turnover: parseFloat(item.turnover),
    direction: item.trade_direction, // 0-未知, 1-买入, 2-卖出
    seq: item.seq,
  }));
}

/**
 * 对比多个股票的K线走势
 * @param {Object} data - 请求参数
 * @param {string} data.codes - 股票代码列表，逗号分隔（必填），如 'AAPL.US,MSFT.US,GOOGL.US' 或 '700.HK,9988.HK'
 * @param {number} [data.klineType] - K线类型（可选）
 *   - 1: 分时
 *   - 2: 1分钟
 *   - 3: 5分钟
 *   - 4: 15分钟
 *   - 5: 30分钟
 *   - 6: 1小时
 *   - 7: 日K
 *   - 8: 周K
 *   - 9: 月K
 * @param {AbortController} controller - 用于中断请求的控制器（可选）
 * @returns {Promise} 返回多个股票的K线对比数据
 * @description 对比多个股票的K线走势，用于股票对比分析
 *
 * @example
 * // 对比三只股票的日K线
 * const res = await compareStocks({
 *   codes: 'AAPL.US,MSFT.US,GOOGL.US',
 *   klineType: 7
 * });
 *
 * // 对比港股（使用默认K线类型）
 * const res = await compareStocks({
 *   codes: '700.HK,9988.HK'
 * });
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
function compareStocks(data, controller = null) {
  return Axios.fetch("/api/example/stock/compare", data, controller);
}

/**
 * 解析K线对比数据
 * @param {Object} compareData - K线对比数据对象
 * @returns {Array} 返回格式化的K线对比数据数组
 * @description 辅助方法：将K线对比数据转换为更易用的格式
 */
function parseCompareData(compareData) {
  if (
    !compareData ||
    !compareData.kline_list ||
    compareData.kline_list.length === 0
  ) {
    return [];
  }

  return compareData.kline_list.map((stock) => ({
    code: stock.code,
    klineType: stock.kline_type,
    klineData: stock.kline_data.map((item) => ({
      timestamp: parseInt(item.timestamp),
      date: new Date(parseInt(item.timestamp) * 1000), // 转换为Date对象
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
  getStockDetail,
  compareStocks,
  parseDepthData,
  parseTradeData,
  parseCompareData,
};
