/**
 * 第三方客服系统工具函数
 * 支持多种主流客服系统的直接打开聊天框功能
 * 支持 iOS APP 和 Web 浏览器环境
 */

import { _info } from '@/service/user.api.js'
import { useUserStore } from '@/store/user.js'
import { Browser } from '@capacitor/browser'
import { Capacitor } from '@capacitor/core'

/**
 * 打开第三方客服系统聊天框（带用户信息）
 * @param {Object} router - Vue Router 实例，用于回退到客服页面
 * @param {string} fallbackRoute - 回退路由，默认为 '/customerService'
 */
export const openThirdPartyCustomerService = async (router, fallbackRoute = '/customerService') => {
  console.log('🎯 点击联系客服，打开新的客服系统')
  
  try {
    // 检查用户登录状态
    const userStore = useUserStore();
    const isLoggedIn = userStore.userInfo && userStore.userInfo.token;
    
    // 构建客服链接
    let customerServiceUrl = 'https://cdn.bot04sg.cfd/chat_online/index?channelId=370dbbe39af14e3d8341bd960e808fab';
    
    if (isLoggedIn) {
      try {
        // 获取用户信息
        const userInfo = await _info({ language: 'en' });
        
        console.log('📋 获取到的完整用户信息:', userInfo);
        
        if (userInfo && userInfo.usercode) {
          // 为客服系统添加用户信息参数
          // 使用 params 参数传递自定义字段（JSON格式）
          const customParams = {
            UID: userInfo.usercode
          };
          const paramsString = encodeURIComponent(JSON.stringify(customParams));
          customerServiceUrl = `https://cdn.bot04sg.cfd/chat_online/index?channelId=370dbbe39af14e3d8341bd960e808fab&email=${userInfo.email || ''}&params=${paramsString}`;
          console.log('✅ 构建带用户信息的客服链接，UID:', userInfo.usercode, 'Email:', userInfo.email);
        } else {
          console.warn('⚠️ userInfo 或 usercode 为空');
        }
      } catch (userInfoError) {
        console.error('❌ 获取用户信息失败:', userInfoError);
        console.warn('将使用游客模式访问客服');
      }
    } else {
      console.log('用户未登录，将使用游客模式访问客服');
    }
    
    console.log('🔗 客服链接:', customerServiceUrl);
    
    // 根据运行环境选择打开方式
    const isNative = Capacitor.isNativePlatform();
    console.log(`📱 运行环境: ${isNative ? 'Native App' : 'Web Browser'}`);
    
    if (isNative) {
      // iOS/Android APP 环境，使用 Capacitor Browser
      try {
        await Browser.open({ 
          url: customerServiceUrl,
          windowName: '_self'
        });
        console.log('✅ 成功在原生APP中打开客服链接');
        return true;
      } catch (browserError) {
        console.error('❌ Capacitor Browser 打开失败:', browserError);
        // 回退到路由跳转
        if (router) {
          router.push(fallbackRoute);
        }
        return false;
      }
    } else {
      // Web 浏览器环境，在当前页签打开客服链接
      try {
        // 使用 window.location.href 在当前页签打开
        window.location.href = customerServiceUrl;
        console.log('✅ 成功在当前页签中打开客服链接');
        return true;
      } catch (windowError) {
        console.error('❌ 页面跳转失败:', windowError);
        // 回退到路由跳转
        if (router) {
          router.push(fallbackRoute);
        }
        return false;
      }
    }
  } catch (error) {
    console.error('❌ 打开客服链接失败:', error);
    // 如果打开失败，回退到原来的客服页面
    if (router) {
      router.push(fallbackRoute);
    }
    return false;
  }
}

/**
 * 检查是否有可用的第三方客服系统
 * @returns {boolean} 是否有可用的客服系统
 */
export const hasThirdPartyCustomerService = () => {
  return !!(
    window._MIXDESK ||
    window.LiveChatWidget ||
    window.Intercom ||
    window.Zendesk ||
    window.$crisp ||
    window.Tawk_API ||
    window.fcWidget ||
    window.HubSpotConversations
  )
}

/**
 * 获取当前可用的客服系统名称
 * @returns {string} 客服系统名称
 */
export const getCustomerServiceType = () => {
  if (window._MIXDESK) return 'MIXDESK'
  if (window.LiveChatWidget) return 'LiveChat'
  if (window.Intercom) return 'Intercom'
  if (window.Zendesk) return 'Zendesk'
  if (window.$crisp) return 'Crisp'
  if (window.Tawk_API) return 'Tawk.to'
  if (window.fcWidget) return 'Freshchat'
  if (window.HubSpotConversations) return 'HubSpot'
  return 'None'
}

/**
 * 初始化客服系统（如果需要）
 */
export const initCustomerService = () => {
  console.log('🔧 初始化客服系统检查')
  const serviceType = getCustomerServiceType()
  console.log(`📋 当前客服系统: ${serviceType}`)
  
  // 可以在这里添加特定客服系统的初始化逻辑
  if (serviceType !== 'None') {
    console.log('✅ 客服系统已就绪')
  } else {
    console.log('⚠️ 未检测到第三方客服系统')
  }
}

export default {
  openThirdPartyCustomerService,
  hasThirdPartyCustomerService,
  getCustomerServiceType,
  initCustomerService
}
