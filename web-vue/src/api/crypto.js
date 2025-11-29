import request from '@/utils/request';

/**
 * 加密货币相关 API
 */

// 获取实时行情列表
export function getRealtimeTickers(params) {
  return request({
    url: '/api/v1/market/tickers',
    method: 'get',
    params
  });
}

// 获取单个交易对行情
export function getTickerBySymbol(symbol) {
  return request({
    url: `/api/v1/market/ticker/${symbol}`,
    method: 'get'
  });
}

// 获取热门活动列表
export function getPopularEvents() {
  return request({
    url: '/api/v1/events/popular',
    method: 'get'
  });
}

// 获取活动详情
export function getEventDetail(id) {
  return request({
    url: `/api/v1/events/${id}`,
    method: 'get'
  });
}

// 获取新币上线列表
export function getNewListings(params) {
  return request({
    url: '/api/v1/coins/new-listing',
    method: 'get',
    params
  });
}

// 获取市场行情数据
export function getMarketData(params) {
  return request({
    url: '/api/v1/market/spot',
    method: 'get',
    params
  });
}

// 获取涨幅榜
export function getGainers(params) {
  return request({
    url: '/api/v1/market/gainers',
    method: 'get',
    params
  });
}

// 获取热门交易对
export function getHotPairs(params) {
  return request({
    url: '/api/v1/market/hot',
    method: 'get',
    params
  });
}

// 获取公告列表
export function getAnnouncements(params) {
  return request({
    url: '/api/v1/announcements',
    method: 'get',
    params
  });
}

// 获取公告详情
export function getAnnouncementDetail(id) {
  return request({
    url: `/api/v1/announcements/${id}`,
    method: 'get'
  });
}

// 用户注册（快速注册）
export function quickRegister(data) {
  return request({
    url: '/api/v1/user/quick-register',
    method: 'post',
    data
  });
}

// 订阅邮件列表
export function subscribeEmail(data) {
  return request({
    url: '/api/v1/subscribe',
    method: 'post',
    data
  });
}

// 获取币种信息
export function getCoinInfo(symbol) {
  return request({
    url: `/api/v1/coins/${symbol}`,
    method: 'get'
  });
}

// 获取交易对信息
export function getTradingPairInfo(symbol) {
  return request({
    url: `/api/v1/trading-pairs/${symbol}`,
    method: 'get'
  });
}

// 获取24小时交易统计
export function get24hStats(symbol) {
  return request({
    url: `/api/v1/market/24h-stats/${symbol}`,
    method: 'get'
  });
}
