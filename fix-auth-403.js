// MT5认证403错误深度修复脚本
console.log('🔧 MT5认证403错误修复脚本启动');

// 1. 增强的Token管理
class TokenManager {
  constructor() {
    this.tokenKey = 'spToken';
    this.userKey = 'userInfo';
    this.refreshKey = 'refreshToken';
    this.init();
  }

  init() {
    // 监听localStorage变化
    window.addEventListener('storage', (e) => {
      if (e.key === this.tokenKey && !e.newValue) {
        console.log('检测到Token被清除，准备重新登录');
        this.handleTokenExpired();
      }
    });
  }

  // 获取Token
  getToken() {
    try {
      return localStorage.getItem(this.tokenKey) || 
             sessionStorage.getItem(this.tokenKey) ||
             this.getTokenFromCookie();
    } catch (error) {
      console.error('获取Token失败:', error);
      return null;
    }
  }

  // 从Cookie获取Token
  getTokenFromCookie() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === this.tokenKey) {
        return decodeURIComponent(value);
      }
    }
    return null;
  }

  // 清除认证信息
  clearAuth() {
    try {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
      localStorage.removeItem(this.refreshKey);
      sessionStorage.removeItem(this.tokenKey);
      sessionStorage.removeItem(this.userKey);
      sessionStorage.removeItem(this.refreshKey);
      
      // 清除Cookie中的认证信息
      document.cookie = `${this.tokenKey}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `${this.userKey}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      
      console.log('认证信息已清除');
    } catch (error) {
      console.error('清除认证信息失败:', error);
    }
  }

  // 处理Token过期
  handleTokenExpired() {
    console.log('Token已过期，准备跳转到登录页');
    
    // 显示友好的提示
    if (window.ElMessage) {
      window.ElMessage.warning('登录状态已过期，请重新登录');
    } else {
      alert('登录状态已过期，请重新登录');
    }
    
    // 延迟跳转
    setTimeout(() => {
      const currentPath = window.location.pathname;
      if (currentPath.includes('/login')) {
        // 如果已经在登录页，刷新页面
        window.location.reload();
      } else {
        // 跳转到登录页
        window.location.href = '/login';
      }
    }, 1500);
  }

  // 验证Token格式
  validateToken(token) {
    if (!token) return false;
    
    // 检查Token是否为空字符串
    if (token.trim() === '') return false;
    
    // 检查Token长度（通常Token应该有合理的长度）
    if (token.length < 10) return false;
    
    // 检查Token是否包含特殊字符（根据您的Token格式调整）
    if (token.includes('undefined') || token.includes('null')) return false;
    
    return true;
  }
}

// 2. 增强的HTTP拦截器
class AuthInterceptor {
  constructor() {
    this.tokenManager = new TokenManager();
    this.retryQueue = [];
    this.isRefreshing = false;
    this.setupInterceptors();
  }

  setupInterceptors() {
    // 拦截所有fetch请求
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      return this.interceptRequest(originalFetch, ...args);
    };

    // 拦截所有XMLHttpRequest
    const originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
      const xhr = new originalXHR();
      const originalOpen = xhr.open;
      const originalSend = xhr.send;
      
      xhr.open = function(method, url, ...rest) {
        xhr._method = method;
        xhr._url = url;
        return originalOpen.call(this, method, url, ...rest);
      };
      
      xhr.send = function(data) {
        // 添加Token到请求头
        const token = new TokenManager().getToken();
        if (token && new TokenManager().validateToken(token)) {
          xhr.setRequestHeader('Token', token);
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
        
        // 监听响应
        xhr.addEventListener('load', () => {
          if (xhr.status === 403) {
            new AuthInterceptor().handle403Response(xhr.responseText);
          }
        });
        
        return originalSend.call(this, data);
      };
      
      return xhr;
    };
  }

  async interceptRequest(originalFetch, ...args) {
    try {
      // 添加Token到请求头
      const token = this.tokenManager.getToken();
      if (token && this.tokenManager.validateToken(token)) {
        const [url, options = {}] = args;
        const headers = new Headers(options.headers);
        headers.set('Token', token);
        headers.set('Authorization', `Bearer ${token}`);
        args[1] = { ...options, headers };
      }

      const response = await originalFetch(...args);
      
      // 检查403响应
      if (response.status === 403) {
        const responseText = await response.clone().text();
        this.handle403Response(responseText);
      }
      
      return response;
    } catch (error) {
      console.error('请求拦截器错误:', error);
      throw error;
    }
  }

  handle403Response(responseText) {
    try {
      const data = JSON.parse(responseText);
      console.log('403响应数据:', data);
      
      if (data.msg && (
        data.msg.includes('账号已过期') || 
        data.msg.includes('已经在其他地方登录') ||
        data.msg.includes('登录状态')
      )) {
        console.log('检测到认证过期，清除认证信息');
        this.tokenManager.clearAuth();
        this.tokenManager.handleTokenExpired();
      }
    } catch (error) {
      console.error('解析403响应失败:', error);
      // 即使解析失败，也清除认证信息
      this.tokenManager.clearAuth();
      this.tokenManager.handleTokenExpired();
    }
  }
}

// 3. 页面加载时的认证检查
function checkAuthOnLoad() {
  const tokenManager = new TokenManager();
  const token = tokenManager.getToken();
  
  console.log('页面加载时Token检查:', {
    hasToken: !!token,
    tokenValid: tokenManager.validateToken(token),
    currentPath: window.location.pathname
  });
  
  // 如果当前不在登录页且没有有效Token，跳转到登录页
  if (!window.location.pathname.includes('/login') && 
      (!token || !tokenManager.validateToken(token))) {
    console.log('没有有效Token，跳转到登录页');
    tokenManager.handleTokenExpired();
  }
}

// 4. 定期检查认证状态
function setupAuthMonitor() {
  // 每5分钟检查一次认证状态
  setInterval(() => {
    const tokenManager = new TokenManager();
    const token = tokenManager.getToken();
    
    if (!token || !tokenManager.validateToken(token)) {
      console.log('定期检查发现Token无效');
      tokenManager.handleTokenExpired();
    }
  }, 5 * 60 * 1000); // 5分钟
}

// 5. 用户交互监控
function setupUserActivityMonitor() {
  let lastActivity = Date.now();
  
  const updateActivity = () => {
    lastActivity = Date.now();
  };
  
  // 监听用户活动
  ['click', 'keypress', 'scroll', 'touchstart'].forEach(event => {
    document.addEventListener(event, updateActivity, true);
  });
  
  // 每10分钟检查用户活动
  setInterval(() => {
    const now = Date.now();
    const inactiveTime = now - lastActivity;
    
    // 如果用户30分钟没有活动，检查Token状态
    if (inactiveTime > 30 * 60 * 1000) {
      const tokenManager = new TokenManager();
      const token = tokenManager.getToken();
      
      if (!token || !tokenManager.validateToken(token)) {
        console.log('用户长时间无活动且Token无效，准备重新登录');
        tokenManager.handleTokenExpired();
      }
    }
  }, 10 * 60 * 1000); // 10分钟
}

// 初始化所有功能
function init() {
  console.log('🚀 初始化MT5认证修复系统');
  
  // 等待页面加载完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(init, 1000); // 延迟1秒确保所有脚本加载完成
    });
    return;
  }
  
  try {
    // 初始化Token管理器
    const tokenManager = new TokenManager();
    
    // 初始化HTTP拦截器
    new AuthInterceptor();
    
    // 页面加载时检查认证
    checkAuthOnLoad();
    
    // 设置认证监控
    setupAuthMonitor();
    
    // 设置用户活动监控
    setupUserActivityMonitor();
    
    console.log('✅ MT5认证修复系统初始化完成');
    
    // 在控制台暴露调试方法
    window.MT5AuthDebug = {
      getToken: () => tokenManager.getToken(),
      clearAuth: () => tokenManager.clearAuth(),
      checkAuth: () => checkAuthOnLoad(),
      validateToken: (token) => tokenManager.validateToken(token)
    };
    
    console.log('🔧 调试方法已暴露到 window.MT5AuthDebug');
    
  } catch (error) {
    console.error('❌ MT5认证修复系统初始化失败:', error);
  }
}

// 启动修复系统
init();
