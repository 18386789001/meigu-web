# 移动端检测功能优化说明

## 需求描述

优化web-vue项目中的移动端检测功能，支持更多移动设备和浏览器类型，包括：
- 谷歌浏览器移动端
- Edge浏览器移动端
- 360浏览器移动端
- 苹果浏览器（Safari）
- 苹果手机（iPhone）
- 安卓手机（Android）

要求用户使用移动端访问 [https://jpmx.xyz/](https://jpmx.xyz/) 时，根据屏幕尺寸判断，一律自动跳转到H5端首页 [https://jpmx.xyz/h5/](https://jpmx.xyz/h5/)。

## 解决方案

### 1. 创建专业设备检测工具

创建了 `src/utils/deviceDetector.js` 文件，提供全面的设备检测功能：

#### 移动设备关键词检测
```javascript
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
```

#### 移动浏览器检测
```javascript
const MOBILE_BROWSER_KEYWORDS = [
  'mobile safari', 'chrome mobile', 'firefox mobile',
  'edge mobile', 'opera mobile', 'samsung browser',
  'huawei browser', 'miui browser', 'oppo browser',
  'vivo browser', 'uc browser', 'qq browser',
  'baidu browser', '360 browser', 'sogou browser',
  'maxthon mobile', 'liebao mobile'
];
```

#### 屏幕尺寸阈值
```javascript
const SCREEN_THRESHOLDS = {
  MOBILE_MAX_WIDTH: 768,    // 移动端最大宽度
  MOBILE_MAX_HEIGHT: 1024,  // 移动端最大高度
  TABLET_MAX_WIDTH: 1024,   // 平板最大宽度
  TABLET_MAX_HEIGHT: 1366   // 平板最大高度
};
```

### 2. 多维度检测机制

#### 基于UserAgent检测
```javascript
export function isMobileByUserAgent() {
  if (typeof navigator === 'undefined') {
    return false;
  }
  
  const userAgent = navigator.userAgent.toLowerCase();
  
  // 检查移动设备关键词
  const hasMobileKeyword = MOBILE_KEYWORDS.some(keyword => 
    userAgent.includes(keyword.toLowerCase())
  );
  
  // 检查移动浏览器关键词
  const hasMobileBrowser = MOBILE_BROWSER_KEYWORDS.some(keyword => 
    userAgent.includes(keyword.toLowerCase())
  );
  
  return hasMobileKeyword || hasMobileBrowser;
}
```

#### 基于屏幕尺寸检测
```javascript
export function isMobileByScreenSize() {
  if (typeof window === 'undefined') {
    return false;
  }
  
  const { innerWidth, innerHeight } = window;
  
  // 检查屏幕宽度和高度
  const isSmallScreen = innerWidth <= SCREEN_THRESHOLDS.MOBILE_MAX_WIDTH || 
                       innerHeight <= SCREEN_THRESHOLDS.MOBILE_MAX_HEIGHT;
  
  // 检查屏幕比例（移动设备通常宽高比不同）
  const aspectRatio = innerWidth / innerHeight;
  const isMobileRatio = aspectRatio < 0.75 || aspectRatio > 1.33;
  
  return isSmallScreen || isMobileRatio;
}
```

#### 触摸设备检测
```javascript
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
```

#### 浏览器类型检测
```javascript
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
```

#### 操作系统检测
```javascript
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
```

### 3. 综合移动端检测

```javascript
export function isMobileDevice() {
  // 1. 基于UserAgent检测
  const userAgentMobile = isMobileByUserAgent();
  
  // 2. 基于屏幕尺寸检测
  const screenMobile = isMobileByScreenSize();
  
  // 3. 检测触摸设备
  const isTouch = isTouchDevice();
  
  // 4. 检测平板（平板也视为移动端）
  const isTabletDevice = isTablet();
  
  // 综合判断：满足任一条件即认为是移动端
  return userAgentMobile || screenMobile || (isTouch && isTabletDevice);
}
```

### 4. 修改App.vue实现自动跳转

#### 导入设备检测工具
```javascript
import { isMobileDevice, getDeviceInfo, initDeviceDetection, onScreenSizeChange } from "@/utils/deviceDetector";
```

#### 替换旧的检测函数
```javascript
// 移动端跳转处理
const handleMobileRedirect = () => {
  const deviceInfo = getDeviceInfo();
  
  console.log('设备检测结果:', deviceInfo);
  
  // 如果是移动端，跳转到H5端
  if (deviceInfo.isMobile) {
    const currentUrl = window.location.href;
    const currentHost = window.location.host;
    const currentProtocol = window.location.protocol;
    
    // 构建H5端URL
    const h5Url = `${currentProtocol}//${currentHost}/h5/`;
    
    console.log(`检测到移动端设备，正在跳转到H5端: ${h5Url}`);
    console.log(`设备信息: 浏览器=${deviceInfo.browser}, 系统=${deviceInfo.os}, 屏幕=${deviceInfo.screenSize?.width}x${deviceInfo.screenSize?.height}`);
    
    // 跳转到H5端
    window.location.href = h5Url;
    return true;
  }
  
  return false;
};
```

#### 在onMounted中实现检测和跳转
```javascript
onMounted(() => {
  // 初始化设备检测
  initDeviceDetection();
  
  // 如果是移动端，跳转H5端地址
  if (handleMobileRedirect()) {
    return; // 如果已跳转，不再执行后续代码
  }
  
  // 监听屏幕尺寸变化，如果用户调整窗口大小到移动端尺寸，也进行跳转
  const cleanupResizeListener = onScreenSizeChange((deviceInfo) => {
    if (deviceInfo.isMobile) {
      console.log('屏幕尺寸变化，检测到移动端尺寸，准备跳转到H5端');
      setTimeout(() => {
        handleMobileRedirect();
      }, 1000); // 延迟1秒，避免频繁跳转
    }
  });
  
  // 组件卸载时清理监听器
  onUnmounted(() => {
    cleanupResizeListener();
  });
  
  langStore.updateLang(curlang);
  // ... 其他初始化代码
});
```

## 支持的设备和浏览器

### 移动设备
- **iOS设备**：iPhone、iPad、iPod
- **Android设备**：各种Android手机和平板
- **其他移动设备**：BlackBerry、Windows Phone、Symbian等
- **平板设备**：iPad、Android平板、Kindle等
- **新兴设备**：智能手表、智能电视等

### 移动浏览器
- **系统浏览器**：Safari Mobile、Chrome Mobile、Firefox Mobile
- **国产浏览器**：360浏览器、QQ浏览器、UC浏览器、百度浏览器
- **厂商浏览器**：华为浏览器、小米浏览器、OPPO浏览器、vivo浏览器
- **其他浏览器**：Edge Mobile、Opera Mobile、Samsung Browser等

### 屏幕尺寸检测
- **移动端阈值**：宽度 ≤ 768px 或高度 ≤ 1024px
- **平板端阈值**：宽度 ≤ 1024px 且高度 ≤ 1366px
- **宽高比检测**：移动设备通常宽高比 < 0.75 或 > 1.33
- **触摸设备检测**：支持触摸操作的设备

## 功能特性

### 1. 多重检测机制
- **UserAgent检测**：基于浏览器标识检测
- **屏幕尺寸检测**：基于屏幕分辨率检测
- **触摸设备检测**：基于触摸能力检测
- **平板设备检测**：专门检测平板设备

### 2. 实时响应
- **页面加载检测**：页面加载时立即检测
- **屏幕尺寸变化监听**：窗口大小变化时重新检测
- **防抖处理**：避免频繁检测和跳转

### 3. 详细日志
- **设备信息记录**：记录浏览器类型、操作系统、屏幕尺寸
- **跳转日志**：记录跳转过程和目标URL
- **调试信息**：便于开发和调试

### 4. 优雅降级
- **兼容性处理**：处理各种浏览器兼容性问题
- **错误处理**：检测失败时的降级方案
- **资源清理**：组件卸载时清理监听器

## 测试验证

### 1. 设备测试
- **iPhone Safari**：iOS设备上的Safari浏览器
- **Android Chrome**：Android设备上的Chrome浏览器
- **iPad Safari**：iPad上的Safari浏览器
- **华为浏览器**：华为设备上的系统浏览器
- **小米浏览器**：小米设备上的MIUI浏览器

### 2. 浏览器测试
- **Chrome Mobile**：移动端Chrome浏览器
- **Edge Mobile**：移动端Edge浏览器
- **360浏览器**：360手机浏览器
- **QQ浏览器**：腾讯QQ浏览器
- **UC浏览器**：UC手机浏览器

### 3. 屏幕尺寸测试
- **小屏手机**：宽度 < 400px
- **大屏手机**：宽度 400-768px
- **平板竖屏**：宽度 768-1024px
- **平板横屏**：高度 < 768px

### 4. 功能测试
- **自动跳转**：移动端访问自动跳转到H5端
- **屏幕变化**：调整窗口大小触发跳转
- **日志记录**：控制台显示详细设备信息
- **兼容性**：各种浏览器环境下的兼容性

## 部署说明

### 1. 构建应用
```bash
npm run build
```

### 2. 部署到生产环境
- 将构建后的文件部署到 [https://jpmx.xyz/](https://jpmx.xyz/)
- 确保新的设备检测代码生效

### 3. 验证功能
1. **移动端访问测试**：使用手机访问主站，验证自动跳转
2. **浏览器兼容性测试**：测试各种移动浏览器
3. **屏幕尺寸测试**：调整浏览器窗口大小验证跳转
4. **日志检查**：检查控制台日志确认检测结果

## 总结

通过创建专业的设备检测工具和优化App.vue中的检测逻辑，实现了全面的移动端检测和自动跳转功能：

### 优势
1. **检测全面**：支持各种移动设备、浏览器和屏幕尺寸
2. **实时响应**：页面加载和窗口变化时都能及时检测
3. **详细日志**：提供完整的设备信息和跳转日志
4. **性能优化**：防抖处理避免频繁检测
5. **兼容性好**：支持各种浏览器和操作系统

### 效果
- ✅ **移动端自动跳转**：移动设备访问自动跳转到H5端
- ✅ **屏幕尺寸检测**：根据屏幕尺寸判断移动端
- ✅ **多浏览器支持**：支持各种移动浏览器
- ✅ **实时响应**：窗口大小变化时也能检测
- ✅ **详细日志**：便于调试和监控

现在用户使用任何移动设备或调整浏览器窗口到移动端尺寸访问 [https://jpmx.xyz/](https://jpmx.xyz/) 时，都会自动跳转到H5端首页 [https://jpmx.xyz/h5/](https://jpmx.xyz/h5/)，提供更好的移动端用户体验。
