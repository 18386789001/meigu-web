// H5端全局错误处理和监控工具
import { ElMessage } from 'element-plus';

class ErrorHandler {
  constructor() {
    this.errorQueue = [];
    this.maxQueueSize = 50;
    this.isInitialized = false;
  }

  // 初始化错误处理
  init() {
    if (this.isInitialized) return;
    
    this.setupGlobalErrorHandlers();
    this.setupPromiseErrorHandlers();
    this.isInitialized = true;
    
    console.log('✅ H5端全局错误处理器已初始化');
  }

  // 设置全局错误处理器
  setupGlobalErrorHandlers() {
    // 捕获JavaScript运行时错误
    window.addEventListener('error', (event) => {
      // 检查是否为钱包扩展错误，如果是则跳过处理
      if (this.isWalletError(event.message)) {
        return; // 让errorFilter.js处理钱包错误
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
  }

  // 设置Promise错误处理器
  setupPromiseErrorHandlers() {
    window.addEventListener('unhandledrejection', (event) => {
      // 检查是否为钱包扩展错误，如果是则跳过处理
      if (this.isWalletError(event.reason?.message)) {
        return; // 让errorFilter.js处理钱包错误
      }

      const error = {
        type: 'promise_error',
        message: event.reason?.message || 'Promise被拒绝',
        stack: event.reason?.stack,
        timestamp: new Date().toISOString(),
        url: window.location.href
      };

      this.handleError(error);
      event.preventDefault();
    });
  }

  // 处理错误
  handleError(error) {
    console.error('H5端错误:', error);
    
    // 添加到错误队列
    this.addToErrorQueue(error);
    
    // 根据错误类型显示不同的用户提示
    
    if (this.isAuthError(error.message)) {
      return; // 认证错误已在http拦截器中处理
    }
    
    // 显示通用错误提示
    this.showUserFriendlyMessage(error);
  }


  // 判断是否为钱包相关错误
  isWalletError(message) {
    if (!message || typeof message !== 'string') return false;

    const walletKeywords = [
      'Sender: Failed to get initial state',
      'Talisman extension has not been configured',
      'getProviderState',
      'sender_getProviderState',
      'polkadot',
      'wallet'
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

  // 显示用户友好的错误信息
  showUserFriendlyMessage(error) {
    let message = '系统出现异常，请刷新页面重试';
    
    if (error.message.includes('Script error')) {
      message = '页面脚本执行异常，请刷新页面';
    } else if (error.message.includes('ChunkLoadError')) {
      message = '页面资源加载失败，请刷新页面';
    }
    
    ElMessage.error(message);
  }

  // 添加错误到队列
  addToErrorQueue(error) {
    this.errorQueue.push(error);
    
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift();
    }
  }

  // 获取错误统计
  getErrorStats() {
    return {
      total: this.errorQueue.length,
      javascript: this.errorQueue.filter(e => e.type === 'javascript_error').length,
      promise: this.errorQueue.filter(e => e.type === 'promise_error').length
    };
  }
}

// 创建全局实例
export const errorHandler = new ErrorHandler();

// 导出便捷方法
export const initErrorHandler = () => errorHandler.init();
export const getErrorStats = () => errorHandler.getErrorStats();

