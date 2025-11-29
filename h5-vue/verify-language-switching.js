/**
 * H5-Vue语言切换功能验证脚本
 * 在浏览器控制台中运行此脚本来测试语言切换功能
 */

// 语言配置
const languages = [
  { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
  { code: 'zh-TW', name: '繁體中文', flag: '🇹🇼' },
  { code: 'en-US', name: 'English', flag: '🇺🇸' },
  { code: 'ja-JP', name: '日本語', flag: '🇯🇵' },
  { code: 'ko-KR', name: '한국어', flag: '🇰🇷' },
  { code: 'th-TH', name: 'ไทย', flag: '🇹🇭' },
  { code: 'vi-VN', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'de-DE', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
  { code: 'it-IT', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt-PT', name: 'Português', flag: '🇵🇹' },
  { code: 'el-GR', name: 'Ελληνικά', flag: '🇬🇷' }
];

// 测试语言切换功能
function testLanguageSwitching() {
  console.log('=== H5-Vue语言切换功能测试 ===');
  
  // 1. 检查当前状态
  const currentLang = localStorage.getItem('lang');
  console.log('1. 当前语言设置:', currentLang);
  
  // 2. 检查语言切换器元素
  const languageBtn = document.querySelector('.language-btn');
  const languageMenu = document.querySelector('.language-menu');
  
  if (languageBtn) {
    console.log('2. ✅ 找到语言切换按钮:', languageBtn.textContent.trim());
  } else {
    console.log('2. ❌ 未找到语言切换按钮');
  }
  
  if (languageMenu) {
    console.log('3. ✅ 找到语言菜单');
  } else {
    console.log('3. ❌ 未找到语言菜单');
  }
  
  // 3. 检查语言选项
  const languageItems = document.querySelectorAll('.language-item');
  console.log('4. 语言选项数量:', languageItems.length);
  
  languageItems.forEach((item, index) => {
    const flag = item.querySelector('.flag')?.textContent;
    const name = item.querySelector('.name')?.textContent;
    const isActive = item.classList.contains('active');
    console.log(`   ${index + 1}. ${flag} ${name} ${isActive ? '(当前)' : ''}`);
  });
  
  // 4. 检查i18n状态
  if (window.$i18n) {
    console.log('5. ✅ 找到全局i18n实例');
    console.log('   当前locale:', window.$i18n.locale);
  } else {
    console.log('5. ❌ 未找到全局i18n实例');
  }
  
  return {
    currentLang,
    languageBtn: !!languageBtn,
    languageMenu: !!languageMenu,
    languageItemsCount: languageItems.length,
    hasI18n: !!window.$i18n
  };
}

// 模拟语言切换
function simulateLanguageSwitch(langCode) {
  console.log(`=== 模拟切换到语言: ${langCode} ===`);
  
  // 1. 保存到localStorage
  localStorage.setItem('lang', langCode);
  console.log('1. ✅ 已保存语言到localStorage:', langCode);
  
  // 2. 查找语言配置
  const lang = languages.find(l => l.code === langCode);
  if (lang) {
    console.log('2. ✅ 找到语言配置:', lang.name);
  } else {
    console.log('2. ❌ 未找到语言配置');
    return false;
  }
  
  // 3. 更新全局i18n（如果存在）
  if (window.$i18n) {
    window.$i18n.locale = langCode;
    console.log('3. ✅ 已更新全局i18n locale:', langCode);
  } else {
    console.log('3. ⚠️ 未找到全局i18n实例');
  }
  
  // 4. 刷新页面
  console.log('4. 🔄 即将刷新页面以应用新语言...');
  setTimeout(() => {
    window.location.reload();
  }, 1000);
  
  return true;
}

// 检查语言切换后的效果
function checkLanguageSwitchResult() {
  console.log('=== 检查语言切换结果 ===');
  
  const currentLang = localStorage.getItem('lang');
  console.log('1. localStorage中的语言:', currentLang);
  
  // 检查界面文字是否已更改
  const heroTitle = document.querySelector('.hero-title');
  const navHome = document.querySelector('.nav-item span');
  
  if (heroTitle) {
    console.log('2. 首页标题:', heroTitle.textContent);
  }
  
  if (navHome) {
    console.log('3. 导航文字:', navHome.textContent);
  }
  
  // 检查语言切换器显示
  const languageBtn = document.querySelector('.language-btn span');
  if (languageBtn) {
    console.log('4. 语言切换器显示:', languageBtn.textContent);
  }
  
  return {
    currentLang,
    heroTitle: heroTitle?.textContent,
    navText: navHome?.textContent,
    languageBtnText: languageBtn?.textContent
  };
}

// 批量测试所有语言
function testAllLanguages() {
  console.log('=== 批量测试所有语言 ===');
  
  const testLanguages = ['en-US', 'zh-CN', 'ja-JP', 'ko-KR', 'de-DE'];
  let currentIndex = 0;
  
  function testNextLanguage() {
    if (currentIndex >= testLanguages.length) {
      console.log('=== 所有语言测试完成 ===');
      return;
    }
    
    const langCode = testLanguages[currentIndex];
    const lang = languages.find(l => l.code === langCode);
    
    console.log(`测试语言 ${currentIndex + 1}/${testLanguages.length}: ${lang.name}`);
    
    // 切换到下一个语言
    simulateLanguageSwitch(langCode);
    
    currentIndex++;
  }
  
  // 开始测试
  testNextLanguage();
}

// 导出函数到全局
if (typeof window !== 'undefined') {
  window.testLanguageSwitching = testLanguageSwitching;
  window.simulateLanguageSwitch = simulateLanguageSwitch;
  window.checkLanguageSwitchResult = checkLanguageSwitchResult;
  window.testAllLanguages = testAllLanguages;
  
  console.log('🔧 语言切换测试工具已加载');
  console.log('可用函数:');
  console.log('- testLanguageSwitching(): 检查语言切换功能状态');
  console.log('- simulateLanguageSwitch(langCode): 模拟语言切换');
  console.log('- checkLanguageSwitchResult(): 检查语言切换结果');
  console.log('- testAllLanguages(): 批量测试所有语言');
  
  // 自动运行基础检查
  setTimeout(() => {
    testLanguageSwitching();
  }, 1000);
}

// 如果在Node.js环境中，直接导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testLanguageSwitching,
    simulateLanguageSwitch,
    checkLanguageSwitchResult,
    testAllLanguages,
    languages
  };
}
