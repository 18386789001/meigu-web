// MT5生产环境快速修复脚本
console.log('🔧 MT5生产环境问题修复脚本');

// 1. 修复favicon问题
const fixFavicon = () => {
  const faviconLink = document.querySelector('link[rel*="icon"]');
  if (!faviconLink) {
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/x-icon';
    link.href = '/favicon.ico';
    document.head.appendChild(link);
    console.log('✅ 已添加favicon引用');
  }
};

// 2. 钱包扩展错误处理
const handleWalletErrors = () => {
  // 捕获钱包相关错误
  window.addEventListener('error', (event) => {
    if (event.message.includes('Sender') || event.message.includes('Talisman')) {
      console.warn('钱包扩展错误已捕获:', event.message);
      event.preventDefault(); // 阻止错误传播
    }
  });
  
  // 捕获Promise错误
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason?.message?.includes('wallet')) {
      console.warn('钱包Promise错误已捕获:', event.reason);
      event.preventDefault();
    }
  });
};

// 3. 403错误处理优化
const handleAuthErrors = () => {
  // 拦截403错误，显示友好提示
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    try {
      const response = await originalFetch(...args);
      if (response.status === 403) {
        const data = await response.clone().json();
        if (data.msg.includes('账号已过期') || data.msg.includes('其他地方登录')) {
          console.warn('认证错误:', data.msg);
          // 显示用户友好的提示
          if (window.ElMessage) {
            window.ElMessage.warning('登录状态已过期，请重新登录');
          }
        }
      }
      return response;
    } catch (error) {
      throw error;
    }
  };
};

// 执行修复
fixFavicon();
handleWalletErrors();
handleAuthErrors();

console.log('✅ 生产环境修复脚本已执行完成');

