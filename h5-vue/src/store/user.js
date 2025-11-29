import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    // 用户信息
    userInfo: null,
    isLoggedIn: false,
    
    // 语言设置
    language: 'zh-CN',
    
    // 主题设置
    theme: 'dark',
    
    // 用户偏好
    preferences: {
      notifications: true,
      soundEnabled: true,
      autoRefresh: true,
      chartType: 'candlestick'
    }
  }),
  
  getters: {
    // 获取用户显示名称
    displayName: (state) => {
      if (state.userInfo) {
        return state.userInfo.nickname || state.userInfo.username || '用户';
      }
      return '游客';
    },
    
    // 获取用户头像
    avatar: (state) => {
      if (state.userInfo && state.userInfo.avatar) {
        return state.userInfo.avatar;
      }
      return '/default-avatar.png';
    },
    
    // 检查是否为VIP用户
    isVip: (state) => {
      return state.userInfo && state.userInfo.vipLevel > 0;
    }
  },
  
  actions: {
    // 设置用户信息
    setUserInfo(userInfo) {
      this.userInfo = userInfo;
      this.isLoggedIn = !!userInfo;
    },
    
    // 清除用户信息
    clearUserInfo() {
      this.userInfo = null;
      this.isLoggedIn = false;
    },
    
    // 设置语言
    setLanguage(language) {
      this.language = language;
      localStorage.setItem('lang', language);
    },
    
    // 设置主题
    setTheme(theme) {
      this.theme = theme;
      document.body.className = document.body.className.replace(/theme-\w+/g, '');
      document.body.classList.add(`theme-${theme}`);
    },
    
    // 更新用户偏好
    updatePreferences(preferences) {
      this.preferences = { ...this.preferences, ...preferences };
    },
    
    // 登录
    async login(credentials) {
      try {
        // 这里应该调用实际的登录API
        console.log('登录请求:', credentials);
        
        // 模拟登录成功
        const userInfo = {
          id: 1,
          username: credentials.username,
          nickname: 'Demo用户',
          email: 'user@demo.com',
          avatar: '/default-avatar.png',
          vipLevel: 1,
          registerTime: new Date().toISOString()
        };
        
        this.setUserInfo(userInfo);
        return { success: true, data: userInfo };
      } catch (error) {
        console.error('登录失败:', error);
        return { success: false, error: error.message };
      }
    },
    
    // 登出
    async logout() {
      try {
        // 这里应该调用实际的登出API
        console.log('登出请求');
        
        this.clearUserInfo();
        return { success: true };
      } catch (error) {
        console.error('登出失败:', error);
        return { success: false, error: error.message };
      }
    },
    
    // 检查登录状态
    checkLoginStatus() {
      // 从本地存储检查登录状态
      const token = localStorage.getItem('token');
      const userInfo = localStorage.getItem('userInfo');
      
      if (token && userInfo) {
        try {
          // 检查是否是语言代码被错误存储到userInfo中
          if (typeof userInfo === 'string' && !userInfo.startsWith('{') && !userInfo.startsWith('[')) {
            console.warn('检测到userInfo中存储了非JSON数据，可能是语言代码:', userInfo);
            // 清理错误的userInfo数据
            localStorage.removeItem('userInfo');
            this.clearUserInfo();
            return;
          }
          
          // 确保userInfo是有效的JSON字符串
          if (typeof userInfo === 'string' && (userInfo.startsWith('{') || userInfo.startsWith('['))) {
            this.setUserInfo(JSON.parse(userInfo));
          } else {
            console.warn('用户信息格式不正确:', userInfo);
            this.clearUserInfo();
          }
        } catch (error) {
          console.error('解析用户信息失败:', error);
          console.error('错误数据:', userInfo);
          // 清理损坏的数据
          localStorage.removeItem('userInfo');
          this.clearUserInfo();
        }
      }
    }
  },
  
  persist: {
    key: 'user-store',
    storage: localStorage,
    paths: ['userInfo', 'isLoggedIn', 'language', 'theme', 'preferences']
  }
});
