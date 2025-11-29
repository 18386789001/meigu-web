// 主页接口
import request from "./request";
import { METHODS } from '@/config'
import { API_PREFIX } from '@/config'

// 获取币种
export const _getCoins = (params = {}) => {
  // 如果是commodities类型，固定使用zh-CN语言
  const requestParams = { ...params }
  if (params && params.type === 'commodities') {
    requestParams.language = 'zh-CN'
  }
  
  return request({
    url: `${API_PREFIX}/item!list.action`,
    method: "GET",
    params: requestParams
    // isLoading: true
  }).then(response => {
    // 如果是commodities类型，过滤掉symbol=GOLD和symbol=Silver的数据，保留XAUUSD和XAGUSD
    if (params && params.type === 'commodities' && Array.isArray(response)) {
      const filteredData = response.filter(item => 
        item.symbol !== 'GOLD' && item.symbol !== 'Silver'
      )
      return filteredData
    }
    return response
  })
};

// 获取行情
export const _getHomeList = (symbol = 'btc') => {
  return request({
    url: `${API_PREFIX}/hobi!getRealtime.action`,
    method: "GET",
    params: {
      symbol
    }
    // isLoading: true
  })
};



// 查询是否加入自选
export const _checkIsInCollect = symbol => {
  return request({
    url: `${API_PREFIX}/itemUserOptional!getItemOptionalStatus.action`,
    method: 'GET',
    params: {
      symbol
    }
  })
}

// 自选
export const _collect = (symbol) => {
  return request({
    url: `${API_PREFIX}/itemUserOptional!add.action`,
    method: 'GET',
    loading: true,
    params: {
      symbol
    }
  })
}

// 删除自选
export const _deleteCollect = symbol => {
  return request({
    url: `${API_PREFIX}/itemUserOptional!delete.action`,
    method: 'GET',
    loading: true,
    params: {
      symbol
    }
  })
}

// 我的自选
export const _myCoins = () => {
  return request({
    url: `${API_PREFIX}/itemUserOptional!list.action`,
    method: 'GET'
  })
}