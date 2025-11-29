// 接口文档地址：https://enjdhdg.site/api/doc.html#/%E5%A4%96%E6%B1%87%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0/h5%E7%AE%80%E5%86%B5/queryByIdUsingGET_13
import request from './request'
import { METHODS } from '@/config'
import { API_PREFIX } from '@/config'

/**
 * 根据symbol获取简况数据
 * @returns {*}
 * @private
 */
export const _getItemSummary = (symbol) => {
  // 将商品符号转换为API支持的符号
  let apiSymbol = symbol;
  
  // 贵金属和工业金属的转换映射
  const symbolMapping = {
    'XAUUSD': 'GOLD',
    'XAGUSD': 'Silver',
    'XALUSD': 'Aluminum',
    'XCUUSD': 'COPPER', 
    'XNIUSD': 'Nickel',
    'XPBUSD': 'Lead',
    'XZNUSD': 'Zinc',
    'XPTUSD': 'Platinum',
    'XPDUSD': 'Palladium',
    'UKOIL': 'UKOIL',
    'USOIL': 'USOIL'
  };
  
  // 如果symbol在映射表中，使用映射后的值；否则使用原始symbol
  apiSymbol = symbolMapping[symbol] || symbol;
  
  console.log(`📋 商品简况API调用: ${symbol} -> ${apiSymbol}`);
  
  return request({
    url: `${API_PREFIX}/item/itemSummary/get`,
    method: METHODS.GET,
    params: {
      symbol: apiSymbol
    }
  }).catch((error) => {
    console.error(`❌ 商品简况API调用失败: ${symbol} -> ${apiSymbol}`, error);
    // 如果API调用失败，返回默认数据而不是抛出错误
    return {
      symbolName: symbol,
      symbol: symbol,
      error: 'API调用失败'
    };
  })
}

// 获取etf 简况f10
export const _getETFItemList = (params) => {
  return request({
    url: `${API_PREFIX}/item!list.action`,
    method: 'GET',
    params
  })
}

// 获取etf详情
export const _getConstituentStockList = (symbol) => {
  // 将商品符号转换为API支持的符号
  let apiSymbol = symbol;
  
  // 贵金属和工业金属的转换映射
  const symbolMapping = {
    'XAUUSD': 'GOLD',
    'XAGUSD': 'Silver',
    'XALUSD': 'Aluminum',
    'XCUUSD': 'COPPER', 
    'XNIUSD': 'Nickel',
    'XPBUSD': 'Lead',
    'XZNUSD': 'Zinc',
    'XPTUSD': 'Platinum',
    'XPDUSD': 'Palladium',
    'UKOIL': 'UKOIL',
    'USOIL': 'USOIL'
  };
  
  // 如果symbol在映射表中，使用映射后的值；否则使用原始symbol
  apiSymbol = symbolMapping[symbol] || symbol;
  
  console.log(`📋 成分股列表API调用: ${symbol} -> ${apiSymbol}`);
  
  return request({
    url: `${API_PREFIX}/projectBreed/getConstituentStockList`,
    method: 'GET',
    params: {
      symbol: apiSymbol
    }
  }).catch((error) => {
    console.error(`❌ 成分股列表API调用失败: ${symbol} -> ${apiSymbol}`, error);
    // 如果API调用失败，返回空数组而不是抛出错误
    return [];
  })
}

/**
 * 美股获取板块指数成分股
 * @private
 */
export const _getRelateStocks = (symbol) => {
  return request({
    url: `${API_PREFIX}/item!relateStocks.action`,
    method: METHODS.GET,
    params: {
      symbol
    }
  })
}

/**
 * etf查币对详情
 * @private
 */
export const _queryBySymbol = (symbol) => {
  return request({
    url: `${API_PREFIX}/item!queryBySymbol.action`,
    method: METHODS.GET,
    params: {
      symbol
    }
  })
}

/**
 * etf查持仓列表
 * @private
 */
export const _getETFList = (symbolType) => {
  return request({
    url: `${API_PREFIX}/exchangeapplyorder!getETFList.action`,
    method: METHODS.GET,
    params: {
      symbolType
    }
  })
}

/**
 * etf查币仓位
 * @private
 */
export const _getETFSum = (symbolType) => {
  return request({
    url: `${API_PREFIX}/exchangeapplyorder!getETFSum.action`,
    method: METHODS.GET,
    params: {
      symbolType
    }
  })
}

// 获取订单列表
export const _contractApplyOrder = (params) => {
  return request({
    url: `${API_PREFIX}/contractApplyOrder!list.action`,
    method: METHODS.POST,
    data: params
  })
}

export const _getAllAssets = () => {
  return request({
    url: `${API_PREFIX}/assets!getAll.action`,
    method: 'GET'
  })
}

// 获取交易成交列表
export const getExchangeApplyHisList = (symbolType) => {
  return request({
    url: `${API_PREFIX}/exchangeapplyorder!list.action`,
    method: METHODS.POST,
    data: {
      page_no: 1,
      type: 'hisorders',
      symbolType,
      isAll: true
    }
  })
}

// 获取交易委托列表
export const getExchangeApplyOrderList = (symbolType) => {
  return request({
    url: `${API_PREFIX}/exchangeapplyorder!list.action`,
    method: METHODS.POST,
    data: {
      page_no: 1,
      type: 'orders',
      symbolType,
      isAll: true
    }
  })
}

// 获取交易成交列表
export const _getExchangeCanceledHisList = (symbolType) => {
  return request({
    url: `${API_PREFIX}/exchangeapplyorder!list.action`,
    method: METHODS.POST,
    data: {
      page_no: 1,
      type: 'canceled',
      symbolType,
      isAll: true
    }
  })
}

// 获取交易自选
export const _getOptionalList = (type) => {
  return request({
    url: `${API_PREFIX}/item/itemUserOptionalList/listItemsByType`,
    method: METHODS.GET,
    params: {
      type
    }
  })
}


// 获取资讯
// 获取资讯 - 始终获取中文数据，前端负责翻译
export const _getInformationList = (maxTime) => {
  return request({
    url: `${API_PREFIX}/information!list.action`,
    method: METHODS.GET,
    params: {
      limit: 50,
      maxTime,
      language: 'zh-CN' // 强制使用中文接口获取原始数据
    }
  })
}

// 获取美股交易记录
export const _getStockTradeList = (symbol) => {
  return request({
    url: `${API_PREFIX}/hobi!getStockTradeList.action`,
    method: METHODS.GET,
    params: {
      symbol
    }
  })
}

/**
 * etf热力图
 * @private
 */
export const _getHotMapList = () => {
  return request({
    url: `${API_PREFIX}/tip/getRandom`,
    method: METHODS.GET
  })
}

/**
 * 美股热力图
 * @private
 */
export const _getUsStocksHotMapList = () => {
  return request({
    url: `${API_PREFIX}/tip/getRandomByType?type=US-stocks`,
    method: METHODS.GET
  })
}

// 获取etf 简况f10
export const _getHkStocksItemList = (params) => {
  return request({
    url: `${API_PREFIX}/item!queryByScene`,
    method: 'GET',
    params
  })
}
