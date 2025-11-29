// 全局错误处理和监控工具
import { ElMessage } from 'element-plus';

class ErrorHandler {
  constructor() {
    this.errorQueue = [];
    this.maxQueueSize = 100;
    this.isInitialized = false;
  }

  // 初始化错误处理
  init() {
    if (this.isInitialized) return;

    this.setupGlobalErrorHandlers();
    this.setupPromiseErrorHandlers();
    this.setupNetworkErrorHandlers();
    this.isInitialized = true;

    console.log('✅ 全局错误处理器已初始化');
  }

  // 设置全局错误处理器
  setupGlobalErrorHandlers() {
    // 捕获JavaScript运行时错误
    window.addEventListener('error', (event) => {
      // 检查是否为钱包扩展错误
      if (this.isWalletError(event.message)) {
        return; // 跳过钱包扩展错误
      }

      const error = {
        type: 'javascript_error',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      };

      this.handleError(error);
    });

    // 捕获资源加载错误
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        const error = {
          type: 'resource_error',
          message: `资源加载失败: ${event.target.src || event.target.href}`,
          element: event.target.tagName,
          src: event.target.src || event.target.href,
          timestamp: new Date().toISOString(),
          url: window.location.href
        };
        
        this.handleResourceError(error);
      }
    }, true);
  }

  // 设置Promise错误处理器
  setupPromiseErrorHandlers() {
    window.addEventListener('unhandledrejection', (event) => {
      // 检查是否为钱包扩展错误，如果是则跳过处理
      if (this.isWalletError(event.reason?.message)) {
        return; // 跳过钱包扩展错误
      }

      const error = {
        type: 'promise_error',
        message: event.reason?.message || 'Promise被拒绝',
        stack: event.reason?.stack,
        timestamp: new Date().toISOString(),
        url: window.location.href
      };

      this.handleError(error);

      // 阻止默认的错误处理
      event.preventDefault();
    });
  }

  // 设置网络错误处理器
  setupNetworkErrorHandlers() {
    // 拦截fetch请求
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        
        // 检查HTTP状态码
        if (!response.ok) {
          const error = {
            type: 'network_error',
            message: `网络请求失败: ${response.status} ${response.statusText}`,
            url: args[0],
            status: response.status,
            statusText: response.statusText,
            timestamp: new Date().toISOString()
          };
          
          this.handleNetworkError(error);
        }
        
        return response;
      } catch (error) {
        const errorInfo = {
          type: 'network_error',
          message: `网络请求异常: ${error.message}`,
          url: args[0],
          timestamp: new Date().toISOString()
        };
        
        this.handleNetworkError(errorInfo);
        throw error;
      }
    };
  }

  // 处理JavaScript错误
  handleError(error) {
    // 只在开发环境输出详细错误信息
    if (import.meta.env.DEV) {
      console.error('JavaScript错误:', error);
    }

    // 添加到错误队列
    this.addToErrorQueue(error);

    // 根据错误类型显示不同的用户提示

    if (this.isAuthError(error.message)) {
      // 认证错误已经在http拦截器中处理
      return;
    }

    // 显示通用错误提示
    this.showUserFriendlyMessage(error);
  }

  // 处理资源加载错误
  handleResourceError(error) {
    // 静默处理资源加载错误，不输出控制台日志
    // console.warn('资源加载错误:', error);

    // 添加到错误队列（但不输出日志）
    this.addToErrorQueue(error, true);

    // 对于所有资源加载错误，都不显示错误提示
    // 图标缺失等问题暂时不处理，不影响用户体验
    return;
  }

  // 处理网络错误
  handleNetworkError(error) {
    // 只在开发环境输出网络错误详情
    if (import.meta.env.DEV) {
      console.error('网络错误:', error);
    }

    // 添加到错误队列
    this.addToErrorQueue(error);

    // 显示网络错误提示
    ElMessage.error('网络连接异常，请检查网络设置');
  }



  // 判断是否为钱包扩展错误
  isWalletError(message) {
    if (!message) return false;

    const walletKeywords = [
      'Talisman extension',
      'Sender',
      'wallet',
      'extension has not been configured',
      'Failed to get initial state',
      'chrome-extension://',
      'moz-extension://',
      'safari-extension://'
    ];

    return walletKeywords.some(keyword =>
      message.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  // 判断是否为认证相关错误
  isAuthError(message) {
    const authKeywords = [
      '账号已过期', '已经在其他地方登录', '登录状态', 'token', '401', '403'
    ];

    return authKeywords.some(keyword =>
      message.includes(keyword)
    );
  }

  // 判断是否为非关键资源
  isNonCriticalResource(src) {
    const nonCriticalPatterns = [
      'favicon.ico',
      'analytics',
      'tracking',
      'ads',
      'social',
      'symbol/', // 添加图标资源到非关键资源列表
      '.png',
      '.svg',
      '.jpg',
      '.jpeg',
      '.gif'
    ];

    return nonCriticalPatterns.some(pattern =>
      src && src.toLowerCase().includes(pattern)
    );
  }

  // 显示用户友好的错误信息
  showUserFriendlyMessage(error) {
    let message = '系统出现异常，请刷新页面重试';
    
    if (error.message.includes('Script error')) {
      message = '页面脚本执行异常，请刷新页面';
    } else if (error.message.includes('ChunkLoadError')) {
      message = '页面资源加载失败，请刷新页面';
    } else if (error.message.includes('Network')) {
      message = '网络连接异常，请检查网络设置';
    }
    
    ElMessage.error(message);
  }

  // 添加错误到队列
  addToErrorQueue(error, silent = false) {
    this.errorQueue.push(error);

    // 限制队列大小
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift();
    }

    // 只在开发环境下且非静默模式时打印错误
    if (import.meta.env.DEV && !silent) {
      console.error('错误队列:', this.errorQueue);
    }
  }

  // 获取错误统计
  getErrorStats() {
    const stats = {
      total: this.errorQueue.length,
      javascript: this.errorQueue.filter(e => e.type === 'javascript_error').length,
      resource: this.errorQueue.filter(e => e.type === 'resource_error').length,
      network: this.errorQueue.filter(e => e.type === 'network_error').length,
      promise: this.errorQueue.filter(e => e.type === 'promise_error').length
    };
    
    return stats;
  }

  // 清除错误队列
  clearErrorQueue() {
    this.errorQueue = [];
  }

  // 上报错误到服务器（可选）
  reportErrors() {
    if (this.errorQueue.length === 0) return;
    
    // 这里可以实现错误上报逻辑
    console.log('上报错误到服务器:', this.errorQueue);
    
    // 清除已上报的错误
    this.clearErrorQueue();
  }
}

// 创建全局实例
export const errorHandler = new ErrorHandler();

// 导出便捷方法
export const initErrorHandler = () => errorHandler.init();
export const getErrorStats = () => errorHandler.getErrorStats();
export const clearErrors = () => errorHandler.clearErrorQueue();
export const reportErrors = () => errorHandler.reportErrors();

