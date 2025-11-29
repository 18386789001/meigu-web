/**
 * 错误过滤器 - 静默处理不需要的错误
 * 主要用于过滤钱包扩展等第三方扩展产生的错误
 */

class ErrorFilter {
  constructor() {
    this.isInitialized = false;
    this.filteredErrorCount = 0;
  }

  // 初始化错误过滤器
  init() {
    if (this.isInitialized) return;
    
    this.setupErrorFilters();
    this.isInitialized = true;
    
    console.log('✅ 错误过滤器已初始化');
  }

  // 设置错误过滤器
  setupErrorFilters() {
    // 过滤全局JavaScript错误
    const originalErrorHandler = window.onerror;
    window.onerror = (message, source, lineno, colno, error) => {
      if (this.shouldFilterError(message)) {
        this.filteredErrorCount++;
        console.log(`[错误过滤器] 已过滤JavaScript错误: ${message}`);
        return true; // 阻止错误显示
      }

      // 调用原始错误处理器
      if (originalErrorHandler) {
        return originalErrorHandler(message, source, lineno, colno, error);
      }
      return false;
    };

    // 过滤Promise错误 - 使用更高优先级
    window.addEventListener('unhandledrejection', (event) => {
      if (this.shouldFilterError(event.reason?.message)) {
        this.filteredErrorCount++;
        console.log(`[错误过滤器] 已过滤Promise错误: ${event.reason?.message}`);
        event.preventDefault(); // 阻止错误显示
        event.stopImmediatePropagation(); // 阻止其他监听器处理
      }
    }, true); // 使用捕获阶段，确保优先处理

    // 过滤console.error中的特定错误
    const originalConsoleError = console.error;
    console.error = (...args) => {
      const message = args.join(' ');
      if (this.shouldFilterError(message)) {
        this.filteredErrorCount++;
        console.log(`[错误过滤器] 已过滤控制台错误: ${message}`);
        return; // 不输出到控制台
      }
      originalConsoleError.apply(console, args);
    };
  }

  // 判断是否应该过滤错误
  shouldFilterError(message) {
    if (!message || typeof message !== 'string') return false;
    
    const filterKeywords = [
      // 钱包扩展相关错误
      'Sender: Failed to get initial state',
      'Talisman extension has not been configured',
      'getProviderState',
      'sender_getProviderState',
      'polkadot',
      'wallet',
      
      // 其他可以忽略的错误
      'favicon.ico',
      'manifest.json',
      'Non-Error promise rejection captured'
    ];
    
    return filterKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  // 获取过滤统计
  getFilterStats() {
    return {
      filteredCount: this.filteredErrorCount,
      isInitialized: this.isInitialized
    };
  }

  // 重置统计
  resetStats() {
    this.filteredErrorCount = 0;
  }
}

// 创建全局实例
export const errorFilter = new ErrorFilter();

// 导出便捷方法
export const initErrorFilter = () => errorFilter.init();
export const getFilterStats = () => errorFilter.getFilterStats();
export const resetFilterStats = () => errorFilter.resetStats();

// 立即初始化（仅在浏览器环境中）
if (typeof window !== 'undefined') {
  // 立即设置错误过滤，不等待其他初始化
  const immediateFilter = () => {
    // 立即过滤Promise错误
    window.addEventListener('unhandledrejection', (event) => {
      const message = event.reason?.message || '';
      if (message.includes('Talisman') ||
          message.includes('Sender') ||
          message.includes('polkadot') ||
          message.includes('wallet')) {
        console.log(`[立即过滤] 钱包错误: ${message}`);
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);

    // 立即过滤JavaScript错误
    window.addEventListener('error', (event) => {
      const message = event.message || '';
      if (message.includes('Talisman') ||
          message.includes('Sender') ||
          message.includes('polkadot') ||
          message.includes('wallet')) {
        console.log(`[立即过滤] JavaScript错误: ${message}`);
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);
  };

  // 立即执行
  immediateFilter();

  // 然后初始化完整的过滤器
  errorFilter.init();
}
