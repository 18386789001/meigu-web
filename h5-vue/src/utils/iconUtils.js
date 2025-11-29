/**
 * 图标工具类
 * 提供图标管理、加载、缓存等功能
 */

// 图标缓存
const iconCache = new Map()
const failedIcons = new Set()

// 图标类别映射
const categoryMapping = {
  // 加密货币
  crypto: [
    'btc', 'eth', 'bnb', 'ada', 'sol', 'dot', 'matic', 'avax',
    'ltc', 'doge', 'shib', 'uni', 'atom', 'near', 'ftm', 'algo',
    'xlm', 'vet', 'icp', 'fil', 'trx', 'etc', 'theta', 'xmr',
    'eos', 'aave', 'mkr', 'comp', 'snx', 'crv', 'sushi', '1inch',
    'ava', 'trump', 'cyber', 'mnde', 'eurq', 'arty', 'orca',
    'xrp', 'link', 'bch', 'yfi', 'tusd', 'mln', 'ronin',
    'pvusd', 'osmo', 'xaut', 'usdt', 'usdc', 'busd', 'dai'
  ],
  
  // 股票
  stock: [
    'spy', 'qqq', 'iwm', 'vti', 'voo', 'vtv', 'vug', 'vea',
    'aapl', 'msft', 'googl', 'amzn', 'tsla', 'meta', 'nvda', 'nflx'
  ],
  
  // 外汇
  forex: [
    'eur', 'gbp', 'jpy', 'aud', 'cad', 'chf', 'nzd', 'usd'
  ],
  
  // 商品
  commodity: [
    'xau', 'xag', 'oil', 'gas', 'copper', 'wheat', 'corn', 'sugar'
  ]
}

/**
 * 获取符号的类别
 * @param {string} symbol - 符号名称
 * @returns {string} 类别名称
 */
export function getSymbolCategory(symbol) {
  if (!symbol) return 'crypto'
  
  const symbolLower = symbol.toLowerCase()
  
  for (const [category, symbols] of Object.entries(categoryMapping)) {
    if (symbols.includes(symbolLower)) {
      return category
    }
  }
  
  // 默认返回crypto类别
  return 'crypto'
}

/**
 * 生成图标URL
 * @param {string} symbol - 符号名称
 * @param {string} format - 图标格式 (svg|png)
 * @param {string} hostUrl - 主机URL
 * @returns {string} 图标URL
 */
export function getIconUrl(symbol, format = 'svg', hostUrl = '') {
  if (!symbol) {
    return `${hostUrl}/symbol/default.${format}`
  }
  
  const symbolLower = symbol.toLowerCase()
  return `${hostUrl}/symbol/${symbolLower}.${format}`
}

/**
 * 检查图标是否存在
 * @param {string} symbol - 符号名称
 * @param {string} format - 图标格式
 * @param {string} hostUrl - 主机URL
 * @returns {Promise<boolean>} 图标是否存在
 */
export async function checkIconExists(symbol, format = 'svg', hostUrl = '') {
  const cacheKey = `${symbol}-${format}`
  
  // 检查缓存
  if (iconCache.has(cacheKey)) {
    return iconCache.get(cacheKey)
  }
  
  // 检查失败列表
  if (failedIcons.has(cacheKey)) {
    return false
  }
  
  try {
    const url = getIconUrl(symbol, format, hostUrl)
    const response = await fetch(url, { method: 'HEAD' })
    const exists = response.ok
    
    // 缓存结果
    iconCache.set(cacheKey, exists)
    
    if (!exists) {
      failedIcons.add(cacheKey)
    }
    
    return exists
  } catch (error) {
    console.warn(`Failed to check icon existence for ${symbol}:`, error)
    failedIcons.add(cacheKey)
    return false
  }
}

/**
 * 预加载图标
 * @param {string[]} symbols - 符号列表
 * @param {string} hostUrl - 主机URL
 * @returns {Promise<void>}
 */
export async function preloadIcons(symbols, hostUrl = '') {
  const promises = symbols.map(async (symbol) => {
    // 优先尝试SVG格式
    const svgExists = await checkIconExists(symbol, 'svg', hostUrl)
    if (!svgExists) {
      // SVG不存在时尝试PNG格式
      await checkIconExists(symbol, 'png', hostUrl)
    }
  })
  
  await Promise.all(promises)
}

/**
 * 获取最佳图标格式
 * @param {string} symbol - 符号名称
 * @param {string} hostUrl - 主机URL
 * @returns {Promise<string>} 最佳格式 (svg|png|fallback)
 */
export async function getBestIconFormat(symbol, hostUrl = '') {
  // 优先检查SVG
  const svgExists = await checkIconExists(symbol, 'svg', hostUrl)
  if (svgExists) {
    return 'svg'
  }
  
  // 其次检查PNG
  const pngExists = await checkIconExists(symbol, 'png', hostUrl)
  if (pngExists) {
    return 'png'
  }
  
  // 都不存在时返回fallback
  return 'fallback'
}

/**
 * 处理图标加载错误的通用函数
 * @param {Event} event - 错误事件
 * @param {string} symbol - 符号名称
 * @param {string} hostUrl - 主机URL
 * @param {Function} fallbackCallback - 备用回调函数
 */
export function handleIconError(event, symbol, hostUrl = '', fallbackCallback = null) {
  const img = event.target
  const src = img.src
  
  // 从URL中提取格式信息
  const formatMatch = src.match(/\.(svg|png)(\?|$)/)
  const currentFormat = formatMatch ? formatMatch[1] : 'svg'
  
  console.warn(`Failed to load ${currentFormat} icon for symbol: ${symbol}`)
  
  // 标记为失败
  const cacheKey = `${symbol}-${currentFormat}`
  failedIcons.add(cacheKey)
  iconCache.set(cacheKey, false)
  
  // 如果当前是SVG格式失败，尝试PNG格式
  if (currentFormat === 'svg') {
    const pngUrl = getIconUrl(symbol, 'png', hostUrl)
    img.src = pngUrl
    return
  }
  
  // 如果PNG格式也失败，执行备用回调
  if (fallbackCallback && typeof fallbackCallback === 'function') {
    fallbackCallback(event, symbol)
  } else {
    // 默认备用处理：使用默认图标
    img.src = getIconUrl('default', 'svg', hostUrl)
  }
}

/**
 * 处理图标加载成功
 * @param {Event} event - 加载事件
 * @param {string} symbol - 符号名称
 */
export function handleIconLoad(event, symbol) {
  const img = event.target
  const src = img.src
  
  // 从URL中提取格式信息
  const formatMatch = src.match(/\.(svg|png)(\?|$)/)
  const currentFormat = formatMatch ? formatMatch[1] : 'svg'
  
  // 缓存成功结果
  const cacheKey = `${symbol}-${currentFormat}`
  iconCache.set(cacheKey, true)
  
  // 从失败列表中移除
  failedIcons.delete(cacheKey)
  
  console.log(`Successfully loaded ${currentFormat} icon for symbol: ${symbol}`)
}

/**
 * 清除图标缓存
 * @param {string} symbol - 可选，清除特定符号的缓存
 */
export function clearIconCache(symbol = null) {
  if (symbol) {
    const symbolLower = symbol.toLowerCase()
    const keysToDelete = []
    
    for (const key of iconCache.keys()) {
      if (key.startsWith(symbolLower + '-')) {
        keysToDelete.push(key)
      }
    }
    
    keysToDelete.forEach(key => {
      iconCache.delete(key)
      failedIcons.delete(key)
    })
  } else {
    iconCache.clear()
    failedIcons.clear()
  }
}

/**
 * 获取缓存统计信息
 * @returns {object} 缓存统计
 */
export function getCacheStats() {
  return {
    cached: iconCache.size,
    failed: failedIcons.size,
    successRate: iconCache.size > 0 ? 
      ((iconCache.size - failedIcons.size) / iconCache.size * 100).toFixed(2) + '%' : '0%'
  }
}

// 导出默认配置
export const defaultConfig = {
  hostUrl: '',
  defaultFormat: 'svg',
  fallbackFormat: 'png',
  preloadEnabled: true,
  cacheEnabled: true
}
