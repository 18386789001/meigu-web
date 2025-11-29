/**
 * 第三方客服系统工具函数 - PC端
 * 支持根据用户登录状态打开不同的客服链接
 */

import { useUserStore } from '@/store/user.js'

/**
 * 打开第三方客服系统
 * - 未登录用户：直接跳转到客服链接（不带参数）
 * - 已登录用户：带上 params（包含UID）和 email 参数
 */
export const openThirdPartyCustomerService = () => {
  console.log('🎯 点击联系客服，打开第三方客服链接')
  
  try {
    // 检查用户登录状态
    const userStore = useUserStore()
    const isLoggedIn = userStore.existToken && userStore.userInfo?.usercode
    
    // 第三方客服基础链接
    let customerServiceUrl = 'https://cdn.bot04sg.cfd/chat_online/index?channelId=370dbbe39af14e3d8341bd960e808fab'
    
    if (isLoggedIn) {
      // 已登录用户，添加用户信息参数
      const usercode = userStore.userInfo.usercode || ''
      const username = userStore.userInfo.username || ''
      
      // 构建 params 参数：{"UID":"40002421"} 格式
      const paramsObj = {
        "UID": usercode
      }
      // 将对象转为JSON字符串后进行URL编码
      const paramsEncoded = encodeURIComponent(JSON.stringify(paramsObj))
      
      // 拼接完整的客服链接：添加 params 和 email 参数
      customerServiceUrl = `https://cdn.bot04sg.cfd/chat_online/index?channelId=370dbbe39af14e3d8341bd960e808fab&params=${paramsEncoded}&email=${encodeURIComponent(username)}`
      
      console.log('✅ 构建带用户信息的客服链接，UID:', usercode, 'Email:', username)
      console.log('📋 完整链接:', customerServiceUrl)
    } else {
      console.log('⚠️ 用户未登录，使用默认客服链接（不带参数）')
    }
    
    // 在新窗口打开客服链接
    const newWindow = window.open(customerServiceUrl, '_blank')
    
    if (newWindow) {
      console.log('✅ 成功在新标签页打开客服链接')
      return true
    } else {
      console.warn('⚠️ 浏览器阻止了弹窗，尝试在当前窗口打开')
      // 如果弹窗被阻止，在当前窗口打开
      window.location.href = customerServiceUrl
      return true
    }
  } catch (error) {
    console.error('❌ 打开客服链接失败:', error)
    return false
  }
}

/**
 * 获取客服链接（不打开，仅返回链接）
 * @returns {string} 客服链接
 */
export const getCustomerServiceUrl = () => {
  try {
    const userStore = useUserStore()
    const isLoggedIn = userStore.existToken && userStore.userInfo?.usercode
    
    let customerServiceUrl = 'https://cdn.bot04sg.cfd/chat_online/index?channelId=370dbbe39af14e3d8341bd960e808fab'
    
    if (isLoggedIn) {
      const usercode = userStore.userInfo.usercode || ''
      const username = userStore.userInfo.username || ''
      
      // 构建 params 参数：{"UID":"40002421"} 格式
      const paramsObj = {
        "UID": usercode
      }
      const paramsEncoded = encodeURIComponent(JSON.stringify(paramsObj))
      
      customerServiceUrl = `https://cdn.bot04sg.cfd/chat_online/index?channelId=370dbbe39af14e3d8341bd960e808fab&params=${paramsEncoded}&email=${encodeURIComponent(username)}`
    }
    
    return customerServiceUrl
  } catch (error) {
    console.error('❌ 获取客服链接失败:', error)
    return 'https://cdn.bot04sg.cfd/chat_online/index?channelId=370dbbe39af14e3d8341bd960e808fab'
  }
}

export default {
  openThirdPartyCustomerService,
  getCustomerServiceUrl
}

