/**
 * 设备检测工具
 * 用于检测用户设备类型，支持多种移动设备和浏览器
 */

/**
 * 移动设备UserAgent关键词
 */
const MOBILE_KEYWORDS = [
  // 基础移动设备关键词
  'mobile', 'phone', 'pad', 'pod', 'tablet',
  
  // iOS设备
  'iphone', 'ipod', 'ios', 'ipad',
  
  // Android设备
  'android', 'androidphone', 'androidtablet',
  
  // 其他移动设备
  'blackberry', 'iemobile', 'mobile safari',
  
  // 中国移动浏览器
  'mqqbrowser', 'juc', 'micromessenger', 'wechat',
  'qqbrowser', 'baiduboxapp', 'baidubrowser',
  '360browser', '360phonebrowser', 'qhbrowser',
  'ucbrowser', 'ucweb', 'opera mini', 'opera mobi',
  
  // 其他浏览器
  'fennec', 'wosbrowser', 'browserng', 'webos',
  'symbian', 'windows phone', 'windows mobile',
  
  // 平板设备
  'kindle', 'silk', 'playbook', 'nook',
  
  // 新兴设备
  'smartphone', 'smarttv', 'smartwatch',
  
  // 特定厂商
  'samsung', 'huawei', 'xiaomi', 'oppo', 'vivo',
  'oneplus', 'meizu', 'zte', 'lenovo', 'motorola',
  'lg', 'sony', 'htc', 'nokia'
];

/**
 * 移动浏览器UserAgent关键词
 */
const MOBILE_BROWSER_KEYWORDS = [
  'mobile safari', 'chrome mobile', 'firefox mobile',
  'edge mobile', 'opera mobile', 'samsung browser',
  'huawei browser', 'miui browser', 'oppo browser',
  'vivo browser', 'uc browser', 'qq browser',
  'baidu browser', '360 browser', 'sogou browser',
  'maxthon mobile', 'liebao mobile'
];

/**
 * 屏幕尺寸阈值
 */
const SCREEN_THRESHOLDS = {
  MOBILE_MAX_WIDTH: 768,    // 移动端最大宽度
  MOBILE_MAX_HEIGHT: 1024,  // 移动端最大高度
  TABLET_MAX_WIDTH: 1024,   // 平板最大宽度
  TABLET_MAX_HEIGHT: 1366   // 平板最大高度
};

/**
 * 检测是否为移动设备（基于UserAgent）
 */
export function isMobileByUserAgent() {
  if (typeof navigator === 'undefined') {
    return false;
  }
  
  const userAgent = navigator.userAgent.toLowerCase();
  
  // 首先检查是否为桌面浏览器（排除移动端）
  const isDesktopBrowser = userAgent.includes('windows nt') || 
                          userAgent.includes('macintosh') || 
                          userAgent.includes('linux') ||
                          userAgent.includes('x11');
  
  // 如果是桌面浏览器且没有明确的移动设备标识，则不是移动端
  if (isDesktopBrowser && !userAgent.includes('mobile') && !userAgent.includes('android')) {
    return false;
  }
  
  // 检查明确的移动设备关键词
  const hasMobileKeyword = MOBILE_KEYWORDS.some(keyword => 
    userAgent.includes(keyword.toLowerCase())
  );
  
  // 检查移动浏览器关键词
  const hasMobileBrowser = MOBILE_BROWSER_KEYWORDS.some(keyword => 
    userAgent.includes(keyword.toLowerCase())
  );
  
  return hasMobileKeyword || hasMobileBrowser;
}

/**
 * 检测是否为移动设备（基于屏幕尺寸）
 */
export function isMobileByScreenSize() {
  if (typeof window === 'undefined') {
    return false;
  }
  
  const { innerWidth, innerHeight } = window;
  
  // 检查屏幕宽度和高度 - 更严格的判断
  const isSmallScreen = innerWidth <= SCREEN_THRESHOLDS.MOBILE_MAX_WIDTH && 
                       innerHeight <= SCREEN_THRESHOLDS.MOBILE_MAX_HEIGHT;
  
  // 检查屏幕比例（移动设备通常宽高比不同）- 更严格的比例判断
  const aspectRatio = innerWidth / innerHeight;
  const isMobileRatio = aspectRatio < 0.5 || aspectRatio > 2.0;
  
  // 同时满足小屏幕和移动设备比例才认为是移动端
  return isSmallScreen && isMobileRatio;
}

/**
 * 检测是否为平板设备
 */
export function isTablet() {
  if (typeof navigator === 'undefined' || typeof window === 'undefined') {
    return false;
  }
  
  const userAgent = navigator.userAgent.toLowerCase();
  const { innerWidth, innerHeight } = window;
  
  // 检查平板关键词
  const hasTabletKeyword = userAgent.includes('ipad') || 
                          userAgent.includes('tablet') ||
                          userAgent.includes('kindle') ||
                          userAgent.includes('playbook');
  
  // 检查平板屏幕尺寸
  const isTabletScreen = innerWidth > SCREEN_THRESHOLDS.MOBILE_MAX_WIDTH && 
                        innerWidth <= SCREEN_THRESHOLDS.TABLET_MAX_WIDTH &&
                        innerHeight <= SCREEN_THRESHOLDS.TABLET_MAX_HEIGHT;
  
  return hasTabletKeyword || isTabletScreen;
}

/**
 * 检测触摸设备
 */
export function isTouchDevice() {
  if (typeof window === 'undefined') {
    return false;
  }
  
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

/**
 * 检测特定浏览器
 */
export function detectBrowser() {
  if (typeof navigator === 'undefined') {
    return 'unknown';
  }
  
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (userAgent.includes('chrome') && !userAgent.includes('edge')) {
    return 'chrome';
  } else if (userAgent.includes('firefox')) {
    return 'firefox';
  } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
    return 'safari';
  } else if (userAgent.includes('edge')) {
    return 'edge';
  } else if (userAgent.includes('opera') || userAgent.includes('opr')) {
    return 'opera';
  } else if (userAgent.includes('360browser') || userAgent.includes('360phonebrowser')) {
    return '360';
  } else if (userAgent.includes('qqbrowser') || userAgent.includes('mqqbrowser')) {
    return 'qq';
  } else if (userAgent.includes('ucbrowser') || userAgent.includes('ucweb')) {
    return 'uc';
  } else if (userAgent.includes('baiduboxapp') || userAgent.includes('baidubrowser')) {
    return 'baidu';
  } else if (userAgent.includes('micromessenger')) {
    return 'wechat';
  }
  
  return 'unknown';
}

/**
 * 检测操作系统
 */
export function detectOS() {
  if (typeof navigator === 'undefined') {
    return 'unknown';
  }
  
  const userAgent = navigator.userAgent.toLowerCase();
  const platform = navigator.platform?.toLowerCase() || '';
  
  if (userAgent.includes('android')) {
    return 'android';
  } else if (userAgent.includes('iphone') || userAgent.includes('ipad') || userAgent.includes('ipod')) {
    return 'ios';
  } else if (userAgent.includes('windows')) {
    return 'windows';
  } else if (userAgent.includes('mac')) {
    return 'macos';
  } else if (userAgent.includes('linux')) {
    return 'linux';
  }
  
  return 'unknown';
}

/**
 * 综合检测是否为移动端
 */
export function isMobileDevice() {
  // 1. 基于UserAgent检测（主要判断依据）
  const userAgentMobile = isMobileByUserAgent();
  

  // 优先使用UserAgent检测，只有在UserAgent明确指示移动设备时才跳转
  // 避免PC端浏览器被误判为移动端
  if (userAgentMobile) {
    return true;
  }

  return false;
}

/**
 * 获取设备详细信息
 */
export function getDeviceInfo() {
  return {
    isMobile: isMobileDevice(),
    isTablet: isTablet(),
    isTouch: isTouchDevice(),
    browser: detectBrowser(),
    os: detectOS(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    screenSize: typeof window !== 'undefined' ? {
      width: window.innerWidth,
      height: window.innerHeight
    } : null
  };
}

/**
 * 监听屏幕尺寸变化
 */
export function onScreenSizeChange(callback) {
  if (typeof window === 'undefined') {
    return () => {};
  }
  
  let timeoutId = null;
  
  const handleResize = () => {
    // 防抖处理
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      const deviceInfo = getDeviceInfo();
      callback(deviceInfo);
    }, 300);
  };
  
  window.addEventListener('resize', handleResize);
  
  // 返回清理函数
  return () => {
    window.removeEventListener('resize', handleResize);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };
}

/**
 * 初始化设备检测
 */
export function initDeviceDetection() {
  const deviceInfo = getDeviceInfo();
  
  console.log('设备检测结果:', deviceInfo);
  
  // 在window对象上暴露设备信息，便于调试
  if (typeof window !== 'undefined') {
    window.deviceInfo = deviceInfo;
  }
  
  return deviceInfo;
}
