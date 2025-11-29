import request from './request'
import { METHODS } from '@/config'

/**
 * RWA（Real World Assets）资产相关 API
 * RWA 资产包含：股票、外汇、加密货币
 * 参考：src/service/newApi/rwa.js
 */

/**
 * 获取股票行情
 * @returns Promise
 */
export const _getRWAStocks = () => {
  return request({
    url: '/api/example/home/stocks',
    method: METHODS.GET
  })
}

/**
 * 获取外汇行情
 * @returns Promise
 */
export const _getRWAForex = () => {
  return request({
    url: '/api/example/forex/quotes',
    method: METHODS.GET
  })
}

/**
 * 获取加密货币行情
 * @returns Promise
 */
export const _getRWACrypto = () => {
  return request({
    url: '/api/example/crypto/quotes',
    method: METHODS.GET
  })
}

/**
 * 获取 RWA 资产详情
 * @param {Object} params - 请求参数
 * @param {string} params.code - 资产代码（必填），如 'AAPL.US'、'EURUSD'、'BTCUSDT'
 * @returns Promise
 */
export const _getRWADetail = (params) => {
  return request({
    url: '/api/example/asset/detail',
    method: METHODS.GET,
    params
  })
}

/**
 * 获取自选 RWA 资产行情
 * @param {Object} params - 请求参数
 * @param {string} params.codes - RWA 资产代码列表，逗号分隔（必填），如 'AAPL.US,EURUSD,BTCUSDT'
 * @returns Promise
 */
export const _getRWAWatchlist = (params) => {
  return request({
    url: '/api/example/watchlist/quotes',
    method: METHODS.GET,
    params
  })
}
