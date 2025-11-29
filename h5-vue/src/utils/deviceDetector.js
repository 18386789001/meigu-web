// 设备检测和自动切换工具
import { ref, onMounted, onUnmounted } from 'vue';

// 设备状态
export const isMobile = ref(false);
export const isTablet = ref(false);
export const isDesktop = ref(false);

// 屏幕尺寸
export const screenSize = ref({
  width: 0,
  height: 0,
  type: 'desktop' // mobile, tablet, desktop
});

// 设备类型
export const deviceType = ref('desktop');

// 检测设备类型
export const detectDevice = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  // 更新屏幕尺寸
  screenSize.value = {
    width,
    height,
    type: width <= 768 ? 'mobile' : width <= 1024 ? 'tablet' : 'desktop'
  };
  
  // 检测设备类型
  const userAgent = navigator.userAgent;
  const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isTabletDevice = /iPad|Android(?=.*\bMobile\b)/i.test(userAgent);
  const isSmallScreen = width <= 768;
  
  // 更新设备状态
  isMobile.value = isMobileDevice || isSmallScreen;
  isTablet.value = isTabletDevice || (width > 768 && width <= 1024);
  isDesktop.value = !isMobile.value && !isTablet.value;
  
  // 更新设备类型
  if (isMobile.value) {
    deviceType.value = 'mobile';
  } else if (isTablet.value) {
    deviceType.value = 'tablet';
  } else {
    deviceType.value = 'desktop';
  }
  
  // 添加设备类名到body
  document.body.className = document.body.className.replace(/device-\w+/g, '');
  document.body.classList.add(`device-${deviceType.value}`);
  
  return {
    isMobile: isMobile.value,
    isTablet: isTablet.value,
    isDesktop: isDesktop.value,
    deviceType: deviceType.value,
    screenSize: screenSize.value
  };
};

// 初始化设备检测
export const initDeviceDetection = () => {
  // 初始检测
  detectDevice();
  
  // 监听窗口大小变化
  const handleResize = () => {
    detectDevice();
  };
  
  // 监听设备方向变化
  const handleOrientationChange = () => {
    setTimeout(() => {
      detectDevice();
    }, 100);
  };
  
  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', handleOrientationChange);
  
  // 返回清理函数
  return () => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('orientationchange', handleOrientationChange);
  };
};

// 组合式API
export const useMobileDetection = () => {
  let cleanup = null;
  
  onMounted(() => {
    cleanup = initDeviceDetection();
  });
  
  onUnmounted(() => {
    if (cleanup) {
      cleanup();
    }
  });
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    screenSize,
    deviceType,
    detectDevice
  };
};

// 移动端工具函数
export const mobileUtils = {
  // 防止iOS缩放
  preventZoom: () => {
    if (isMobile.value) {
      document.addEventListener('touchstart', (e) => {
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      }, { passive: false });
    }
  },
  
  // 添加触摸反馈
  addTouchFeedback: (element) => {
    if (isMobile.value && element) {
      element.addEventListener('touchstart', () => {
        element.style.transform = 'scale(0.95)';
      });
      
      element.addEventListener('touchend', () => {
        element.style.transform = 'scale(1)';
      });
    }
  },
  
  // 平滑滚动
  smoothScroll: (element, offset = 0) => {
    if (element) {
      const targetPosition = element.offsetTop - offset;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  },
  
  // 获取视口高度
  getViewportHeight: () => {
    return window.innerHeight;
  },
  
  // 获取安全区域高度
  getSafeAreaHeight: () => {
    if (isMobile.value) {
      return window.innerHeight - (window.outerHeight - window.innerHeight);
    }
    return window.innerHeight;
  }
};

// PC端自动切换逻辑
export const autoSwitchToDesktop = () => {
  // 检查是否已经切换过，避免重复切换
  const hasSwitched = sessionStorage.getItem('h5-to-desktop-switched');
  if (hasSwitched) {
    console.log('已经切换过，跳过重复切换');
    return false;
  }
  
  const device = detectDevice();
  
  // 如果是桌面端，自动在新页签中打开PC版
  if (device.isDesktop) {
    console.log('检测到桌面端，自动切换到PC版');
    
    // 标记已经切换过
    sessionStorage.setItem('h5-to-desktop-switched', 'true');
    
    // 获取当前域名
    const currentDomain = window.location.host;
    const currentProtocol = window.location.protocol;
    
    // 构建PC版URL
    const desktopUrl = `${currentProtocol}//${currentDomain}/`;
    
    // 在新页签中打开PC版
    window.open(desktopUrl, '_blank');
    
    // 显示提示信息
    console.log(`已在新页签中打开PC版: ${desktopUrl}`);
    
    // 可选：显示用户友好的提示
    if (typeof window !== 'undefined' && window.alert) {
      setTimeout(() => {
        alert('检测到您使用的是PC端，已为您自动打开PC版页面');
      }, 500);
    }
    
    return true;
  }
  
  return false;
};

// 自动切换逻辑（保持向后兼容）
export const autoSwitch = () => {
  const device = detectDevice();
  
  // 如果是桌面端，自动切换到PC版
  if (device.isDesktop) {
    return autoSwitchToDesktop();
  }
  
  // 如果是移动端，正常显示H5版本
  if (device.isMobile) {
    console.log('检测到移动端，显示H5版本');
  }
  
  return device;
};
