/**
 * 域名管理工具
 * 用于处理动态域名切换和URL生成
 */

// 默认域名配置
const DEFAULT_DOMAINS = {
  production: 'jpmx.xyz',
  development: 'jpmx.xyz',
  staging: 'staging.jpmx.xyz'
};

// 获取当前环境
const getCurrentEnvironment = () => {
  if (import.meta.env.MODE === 'development') {
    return 'development';
  }
  if (window.location.hostname.includes('staging')) {
    return 'staging';
  }
  return 'production';
};

// 获取当前域名
const getCurrentDomain = () => {
  if (import.meta.env.MODE === 'development') {
    // 开发环境使用配置的默认域名
    return DEFAULT_DOMAINS.development;
  }
  // 生产环境使用当前访问的域名
  return window.location.host;
};

// 生成完整URL
const generateUrl = (path = '', params = {}, options = {}) => {
  const {
    protocol = 'https',
    subdomain = '',
    domain = getCurrentDomain(),
    port = ''
  } = options;

  // 构建基础URL
  let baseUrl = `${protocol}://`;
  
  if (subdomain) {
    baseUrl += `${subdomain}.`;
  }
  
  baseUrl += domain;
  
  if (port) {
    baseUrl += `:${port}`;
  }

  // 添加路径
  if (path && !path.startsWith('/')) {
    path = '/' + path;
  }
  
  // 检查路径中是否包含hash (#)
  let hashPart = '';
  let pathPart = path;
  if (path.includes('#')) {
    const hashIndex = path.indexOf('#');
    pathPart = path.substring(0, hashIndex);
    hashPart = path.substring(hashIndex);
  }
  
  let fullUrl = baseUrl + pathPart;

  // 添加查询参数（在hash之前）
  if (Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        searchParams.append(key, value);
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      fullUrl += (fullUrl.includes('?') ? '&' : '?') + queryString;
    }
  }

  // 添加hash部分
  fullUrl += hashPart;

  return fullUrl;
};

// WAP端URL生成器
const generateWapUrl = (path = '', params = {}) => {
  // 开发环境：使用本地 WAP-Vue 服务器
  if (import.meta.env.MODE === 'development') {
    const options = {
      protocol: 'http',
      domain: 'localhost',
      port: '333'
    };
    return generateUrl(`/syn${path}`, params, options);
  }
  
  // 生产环境：使用生产域名
  return generateUrl(`/syn${path}`, params);
};

// API URL生成器
const generateApiUrl = (path = '', params = {}) => {
  return generateUrl(`/api${path}`, params);
};

// WebSocket URL生成器
const generateWsUrl = (path = '', params = {}) => {
  const domain = getCurrentDomain();
  return generateUrl(`/api/websocket${path}`, params, {
    protocol: 'wss',
    domain
  });
};

// 预定义的URL生成器
const URL_GENERATORS = {
  // WAP端页面
  WAP_LOGIN: (params = {}) => generateWapUrl('/#/my/index', params),
  WAP_REGISTER: (params = {}) => generateWapUrl('/#/my/index', params),
  WAP_DEMO: (params = {}) => generateWapUrl('/#/my/index', { type: 'demo', ...params }),
  WAP_REAL: (params = {}) => generateWapUrl('/#/my/index', { type: 'real', ...params }),
  WAP_TRADING: (tradingType, params = {}) => generateWapUrl('/#/my/index', { trading: tradingType, ...params }),
  WAP_DEMO_TRADING: (tradingType, params = {}) => generateWapUrl('/#/my/index', { type: 'demo', trading: tradingType, ...params }),
  WAP_REAL_TRADING: (tradingType, params = {}) => generateWapUrl('/#/my/index', { type: 'real', trading: tradingType, ...params }),

  // API端点
  API_REALTIME: (symbol) => generateApiUrl('/hobi!getRealtime.action', { symbol }),
  API_DEPTH: (symbol) => generateApiUrl('/hobi!getDepth.action', { symbol }),
  API_KLINE: (symbol, period) => generateApiUrl('/hobi!getKline.action', { symbol, period }),

  // WebSocket连接
  WS_REALTIME: (symbols) => generateWsUrl('', { symbols }),
  WS_DEPTH: (symbol) => generateWsUrl('/depth', { symbol }),
};

// 域名切换功能
const switchDomain = (newDomain) => {
  if (import.meta.env.MODE === 'development') {
    console.warn('开发环境不支持域名切换，请在生产环境中使用');
    return false;
  }

  try {
    // 保存当前域名到localStorage
    localStorage.setItem('customDomain', newDomain);
    
    // 构建新的URL
    const currentPath = window.location.pathname + window.location.search + window.location.hash;
    const newUrl = `${window.location.protocol}//${newDomain}${currentPath}`;
    
    // 跳转到新域名
    window.location.href = newUrl;
    return true;
  } catch (error) {
    console.error('域名切换失败:', error);
    return false;
  }
};

// 获取自定义域名
const getCustomDomain = () => {
  return localStorage.getItem('customDomain') || null;
};

// 重置为默认域名
const resetToDefaultDomain = () => {
  localStorage.removeItem('customDomain');
  const env = getCurrentEnvironment();
  const defaultDomain = DEFAULT_DOMAINS[env];
  
  if (window.location.host !== defaultDomain) {
    switchDomain(defaultDomain);
  }
};

// 验证域名格式
const validateDomain = (domain) => {
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])*$/;
  return domainRegex.test(domain);
};

// 域名健康检查
const checkDomainHealth = async (domain, timeout = 5000) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(`https://${domain}/api/health`, {
      method: 'GET',
      signal: controller.signal,
      mode: 'cors'
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.warn(`域名健康检查失败: ${domain}`, error);
    return false;
  }
};

// 导出所有功能
export {
  getCurrentEnvironment,
  getCurrentDomain,
  generateUrl,
  generateWapUrl,
  generateApiUrl,
  generateWsUrl,
  URL_GENERATORS,
  switchDomain,
  getCustomDomain,
  resetToDefaultDomain,
  validateDomain,
  checkDomainHealth,
  DEFAULT_DOMAINS
};

// 默认导出主要功能
export default {
  getCurrentDomain,
  generateUrl,
  generateWapUrl,
  URL_GENERATORS,
  switchDomain,
  validateDomain,
  checkDomainHealth
};
