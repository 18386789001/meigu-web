import request from './request'

// 获取期货列表
export const getFuturesList = (params) => {
  return request({
    url: '/api/futures/list',
    method: 'get',
    params
  })
}

// 获取期货详情
export const getFuturesDetail = (symbol) => {
  return request({
    url: `/api/futures/detail/${symbol}`,
    method: 'get'
  })
}

// 获取期货持仓
export const getFuturesPositions = (params) => {
  return request({
    url: '/api/futures/positions',
    method: 'get',
    params
  })
}

// 获取期货委托
export const getFuturesOrders = (params) => {
  return request({
    url: '/api/futures/orders',
    method: 'get',
    params
  })
}

// 获取期货成交记录
export const getFuturesTrades = (params) => {
  return request({
    url: '/api/futures/trades',
    method: 'get',
    params
  })
}

// 期货买入
export const futuresBuy = (data) => {
  return request({
    url: '/api/futures/buy',
    method: 'post',
    data
  })
}

// 期货卖出
export const futuresSell = (data) => {
  return request({
    url: '/api/futures/sell',
    method: 'post',
    data
  })
}

// 取消期货订单
export const cancelFuturesOrder = (orderId) => {
  return request({
    url: `/api/futures/cancel/${orderId}`,
    method: 'post'
  })
}

// 获取期货资产信息
export const getFuturesAssets = () => {
  return request({
    url: '/api/futures/assets',
    method: 'get'
  })
}

// 获取期货行情
export const getFuturesQuotes = (symbols) => {
  return request({
    url: '/api/futures/quotes',
    method: 'get',
    params: { symbols }
  })
}
