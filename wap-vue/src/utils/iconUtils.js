/**
 * 图标工具函数
 * 处理图标加载失败的情况
 */

/**
 * 处理图标加载错误
 * @param {Event} event - 图片加载错误事件
 * @param {string} symbol - 符号名称
 * @param {string} fallbackSrc - 备用图标路径
 */
export const handleIconError = (event, symbol, fallbackSrc = null) => {
  console.warn(`Failed to load icon for symbol: ${symbol}`);
  
  // 设置备用图标
  if (fallbackSrc) {
    event.target.src = fallbackSrc;
  } else {
    // 使用默认图标
    event.target.src = '/symbol/default.png';
  }
  
  // 添加错误样式
  event.target.classList.add('icon-error');
};

/**
 * 处理图标加载成功
 * @param {Event} event - 图片加载成功事件
 * @param {string} symbol - 符号名称
 */
export const handleIconLoad = (event, symbol) => {
  console.log(`Successfully loaded icon for symbol: ${symbol}`);
  
  // 移除错误样式
  event.target.classList.remove('icon-error');
};

/**
 * 生成图标URL
 * @param {string} symbol - 符号名称
 * @param {string} hostUrl - 主机URL
 * @returns {string} 图标URL
 */
export const getIconUrl = (symbol, hostUrl = '') => {
  if (!symbol) {
    return '/symbol/default.png';
  }
  
  return `${hostUrl}/symbol/${symbol.toLowerCase()}.png`;
};

/**
 * 检查图标是否存在
 * @param {string} symbol - 符号名称
 * @param {string} hostUrl - 主机URL
 * @returns {Promise<boolean>} 图标是否存在
 */
export const checkIconExists = async (symbol, hostUrl = '') => {
  try {
    const url = getIconUrl(symbol, hostUrl);
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.warn(`Failed to check icon existence for ${symbol}:`, error);
    return false;
  }
};

/**
 * 预加载图标
 * @param {string} symbol - 符号名称
 * @param {string} hostUrl - 主机URL
 * @returns {Promise<boolean>} 预加载是否成功
 */
export const preloadIcon = (symbol, hostUrl = '') => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = getIconUrl(symbol, hostUrl);
  });
};
