/**
 * 路由辅助工具
 * 提供安全的路由跳转方法，避免传递undefined参数导致的错误
 */

/**
 * 安全的路由跳转函数
 * @param {Object} router - Vue Router实例
 * @param {string|Object} path - 路由路径或路由对象
 * @param {string} defaultPath - 默认路径，当path为空时使用
 * @returns {Promise} 路由跳转的Promise
 */
export function safeRouterPush(router, path, defaultPath = '/') {
  try {
    // 如果没有传递路径参数，使用默认路径
    if (!path) {
      console.warn('safeRouterPush: 路径参数为空，使用默认路径:', defaultPath);
      path = defaultPath;
    }

    // 检查路径类型
    if (typeof path === 'string') {
      // 字符串路径
      if (!path.trim()) {
        console.warn('safeRouterPush: 路径为空字符串，使用默认路径:', defaultPath);
        path = defaultPath;
      }
    } else if (typeof path === 'object' && path !== null) {
      // 路由对象
      if (!path.path && !path.name) {
        console.warn('safeRouterPush: 路由对象缺少path或name属性，使用默认路径:', defaultPath);
        path = defaultPath;
      }
    } else {
      // 无效类型
      console.warn('safeRouterPush: 无效的路径类型，使用默认路径:', defaultPath);
      path = defaultPath;
    }

    // 执行路由跳转
    return router.push(path);
  } catch (error) {
    console.error('safeRouterPush: 路由跳转失败:', error);
    // 如果跳转失败，尝试跳转到首页
    try {
      return router.push('/');
    } catch (fallbackError) {
      console.error('safeRouterPush: 回退到首页也失败:', fallbackError);
      // 最后的回退方案：使用window.location
      window.location.href = '/';
      return Promise.resolve();
    }
  }
}

/**
 * 安全的路由替换函数
 * @param {Object} router - Vue Router实例
 * @param {string|Object} path - 路由路径或路由对象
 * @param {string} defaultPath - 默认路径，当path为空时使用
 * @returns {Promise} 路由替换的Promise
 */
export function safeRouterReplace(router, path, defaultPath = '/') {
  try {
    // 如果没有传递路径参数，使用默认路径
    if (!path) {
      console.warn('safeRouterReplace: 路径参数为空，使用默认路径:', defaultPath);
      path = defaultPath;
    }

    // 检查路径类型
    if (typeof path === 'string') {
      // 字符串路径
      if (!path.trim()) {
        console.warn('safeRouterReplace: 路径为空字符串，使用默认路径:', defaultPath);
        path = defaultPath;
      }
    } else if (typeof path === 'object' && path !== null) {
      // 路由对象
      if (!path.path && !path.name) {
        console.warn('safeRouterReplace: 路由对象缺少path或name属性，使用默认路径:', defaultPath);
        path = defaultPath;
      }
    } else {
      // 无效类型
      console.warn('safeRouterReplace: 无效的路径类型，使用默认路径:', defaultPath);
      path = defaultPath;
    }

    // 执行路由替换
    return router.replace(path);
  } catch (error) {
    console.error('safeRouterReplace: 路由替换失败:', error);
    // 如果替换失败，尝试替换到首页
    try {
      return router.replace('/');
    } catch (fallbackError) {
      console.error('safeRouterReplace: 回退到首页也失败:', fallbackError);
      // 最后的回退方案：使用window.location
      window.location.href = '/';
      return Promise.resolve();
    }
  }
}

/**
 * 创建安全的gotoPage函数
 * @param {Object} router - Vue Router实例
 * @param {string} defaultPath - 默认路径
 * @returns {Function} 安全的gotoPage函数
 */
export function createSafeGotoPage(router, defaultPath = '/trading') {
  return function gotoPage(path) {
    return safeRouterPush(router, path, defaultPath);
  };
}

/**
 * 验证路由路径是否有效
 * @param {string|Object} path - 路由路径或路由对象
 * @returns {boolean} 是否有效
 */
export function isValidRoutePath(path) {
  if (!path) return false;
  
  if (typeof path === 'string') {
    return path.trim().length > 0;
  }
  
  if (typeof path === 'object' && path !== null) {
    return !!(path.path || path.name);
  }
  
  return false;
}

/**
 * 标准化路由路径
 * @param {string|Object} path - 路由路径或路由对象
 * @param {string} defaultPath - 默认路径
 * @returns {string|Object} 标准化后的路径
 */
export function normalizeRoutePath(path, defaultPath = '/') {
  if (!isValidRoutePath(path)) {
    return defaultPath;
  }
  
  if (typeof path === 'string') {
    return path.trim();
  }
  
  return path;
}

// 导出默认的安全路由跳转函数
export default {
  safeRouterPush,
  safeRouterReplace,
  createSafeGotoPage,
  isValidRoutePath,
  normalizeRoutePath
};
