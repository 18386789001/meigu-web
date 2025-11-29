import Axios from "@/utils/http";

/**
 * WebSocket 连接管理相关 API
 */

/**
 * 连接 WebSocket
 * @param {Object} params - 请求参数
 * @param {string} [params.marketType] - 市场类型（可选），如 'stock', 'forex', 'crypto'
 * @param {AbortController} controller - 用于中断请求的控制器（可选）
 * @returns {Promise} 返回连接结果
 * @description 建立 WebSocket 连接，用于实时接收市场行情数据
 *
 * @example
 * // 连接股票市场 WebSocket
 * const res = await connectWebSocket({ marketType: 'stock' });
 * if (res.success) {
 *   console.log('WebSocket 连接成功');
 * }
 *
 * // 不指定市场类型（连接默认市场）
 * const res = await connectWebSocket({});
 */
function connectWebSocket(params = {}, controller = null) {
  return Axios.fetch(
    "/api/alltick/market/websocket/connect",
    params,
    controller
  );
}

/**
 * 断开 WebSocket
 * @param {AbortController} controller - 用于中断请求的控制器（可选）
 * @returns {Promise} 返回断开结果
 * @description 断开 WebSocket 连接，停止接收实时市场数据
 *
 * @example
 * const res = await disconnectWebSocket();
 * if (res.success) {
 *   console.log('WebSocket 已断开');
 * }
 */
function disconnectWebSocket(controller = null) {
  return Axios.fetch(
    "/api/alltick/market/websocket/disconnect",
    {},
    controller
  );
}

/**
 * 获取 WebSocket 连接状态
 * @param {AbortController} controller - 用于中断请求的控制器（可选）
 * @returns {Promise} 返回连接状态
 * @description 查询当前 WebSocket 连接状态
 *
 * @example
 * const res = await getWebSocketStatus();
 * if (res.success) {
 *   console.log('连接状态:', res.data);
 * }
 *
 * @returns {Promise<Object>} 返回数据结构：
 * {
 *   success: boolean,              // 请求是否成功
 *   data: {
 *     connected: boolean,          // 是否已连接
 *     marketType: string          // 当前连接的市场类型
 *   }
 * }
 */
function getWebSocketStatus(controller = null) {
  return Axios.fetch("/api/alltick/market/websocket/status", {}, controller);
}

/**
 * 订阅市场深度（WebSocket）
 * @param {Object} data - 请求参数
 * @param {Array<Object>} data.symbolList - 产品代码列表（必填），格式：[{code: "AAPL.US", depthLevel: 5}]
 * @param {string} data.symbolList[].code - 股票代码，如 'AAPL.US', '9988.HK'
 * @param {number} [data.symbolList[].depthLevel] - 深度档位（可选），如 5, 10, 20
 * @param {string} [data.marketType] - 市场类型（可选），如 'stock', 'forex', 'crypto'
 * @param {AbortController} controller - 用于中断请求的控制器（可选）
 * @returns {Promise} 返回订阅结果
 * @description 通过 WebSocket 订阅指定股票的市场深度数据（买卖盘信息）
 *
 * @example
 * // 订阅单只股票的市场深度
 * const res = await subscribeDepth({
 *   symbolList: [
 *     { code: 'AAPL.US', depthLevel: 5 }
 *   ],
 *   marketType: 'stock'
 * });
 *
 * // 订阅多只股票的市场深度
 * const res = await subscribeDepth({
 *   symbolList: [
 *     { code: 'AAPL.US', depthLevel: 10 },
 *     { code: '9988.HK', depthLevel: 5 },
 *     { code: 'TSLA.US', depthLevel: 10 }
 *   ],
 *   marketType: 'stock'
 * });
 *
 * @returns {Promise<Object>} 返回数据结构：
 * {
 *   success: boolean,              // 请求是否成功
 *   message: string                // 订阅结果消息
 * }
 */
function subscribeDepth(data, controller = null) {
  return Axios.fetch(
    "/api/alltick/market/websocket/subscribe/depth",
    data,
    controller
  );
}

/**
 * 订阅实时成交（WebSocket）
 * @param {Object} data - 请求参数
 * @param {Array<Object>} data.symbolList - 产品代码列表（必填），格式：[{code: "AAPL.US"}]
 * @param {string} data.symbolList[].code - 股票代码，如 'AAPL.US', '9988.HK'
 * @param {string} [data.marketType] - 市场类型（可选），如 'stock', 'forex', 'crypto'
 * @param {AbortController} controller - 用于中断请求的控制器（可选）
 * @returns {Promise} 返回订阅结果
 * @description 通过 WebSocket 订阅指定股票的实时成交数据
 *
 * @example
 * // 订阅单只股票的实时成交
 * const res = await subscribeTrade({
 *   symbolList: [
 *     { code: 'AAPL.US' }
 *   ],
 *   marketType: 'stock'
 * });
 *
 * // 订阅多只股票的实时成交
 * const res = await subscribeTrade({
 *   symbolList: [
 *     { code: 'AAPL.US' },
 *     { code: '9988.HK' },
 *     { code: 'TSLA.US' },
 *     { code: '700.HK' }
 *   ],
 *   marketType: 'stock'
 * });
 *
 * @returns {Promise<Object>} 返回数据结构：
 * {
 *   success: boolean,              // 请求是否成功
 *   message: string                // 订阅结果消息
 * }
 */
function subscribeTrade(data, controller = null) {
  return Axios.fetch(
    "/api/alltick/market/websocket/subscribe/trade",
    data,
    controller
  );
}

export default {
  connectWebSocket,
  disconnectWebSocket,
  getWebSocketStatus,
  subscribeDepth,
  subscribeTrade,
};
