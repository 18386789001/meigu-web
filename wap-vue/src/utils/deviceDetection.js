/**
 * 设备检测工具
 * 用于检测用户是否使用PC端访问移动端应用
 */

/**
 * 检测是否为PC端设备
 * @returns {boolean} true表示PC端，false表示移动端
 */
export function isPCDevice() {
  // 获取用户代理字符串
  const userAgent = navigator.userAgent.toLowerCase();
  
  // PC端设备特征
  const pcKeywords = [
    'windows', 'macintosh', 'mac os x', 'linux', 'x11',
    'win32', 'win64', 'wow64', 'x86_64', 'amd64'
  ];
  
  // 移动端设备特征
  const mobileKeywords = [
    'mobile', 'android', 'iphone', 'ipad', 'ipod',
    'blackberry', 'windows phone', 'opera mini',
    'iemobile', 'mobile safari', 'webos'
  ];
  
  // 检查是否为移动端
  const isMobile = mobileKeywords.some(keyword => userAgent.includes(keyword));
  
  // 检查是否为PC端
  const isPC = pcKeywords.some(keyword => userAgent.includes(keyword));
  
  // 如果明确检测到移动端，返回false
  if (isMobile) {
    return false;
  }
  
  // 如果明确检测到PC端，返回true
  if (isPC) {
    return true;
  }
  
  // 通过屏幕尺寸判断
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  
  // 如果屏幕宽度大于1024px，认为是PC端
  if (screenWidth > 1024) {
    return true;
  }
  
  // 如果屏幕高度大于768px且宽度大于768px，认为是PC端
  if (screenHeight > 768 && screenWidth > 768) {
    return true;
  }
  
  // 通过触摸支持判断
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // 如果没有触摸支持且屏幕较大，认为是PC端
  if (!hasTouch && screenWidth > 768) {
    return true;
  }
  
  // 默认认为是移动端
  return false;
}


/**
 * 检查是否应该跳转到PC端应用
 * @returns {boolean} true表示应该跳转，false表示不需要跳转
 */
export function shouldRedirectToPC() {
  // 检查URL参数中是否有强制移动端的标识
  const urlParams = new URLSearchParams(window.location.search);
  const forceMobile = urlParams.get('mobile') === 'true' || urlParams.get('wap') === 'true';
  
  if (forceMobile) {
    return false;
  }
  
  // 检查是否为PC端
  return isPCDevice();
}
