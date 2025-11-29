/**
 * H5-Vue中文语言切换验证脚本
 * 在浏览器控制台中运行此脚本来测试中文语言切换功能
 */

// 中文语言配置
const chineseLanguages = [
  { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
  { code: 'zh-TW', name: '繁体中文', flag: '🇹🇼' }
];

// 测试中文语言切换
function testChineseLanguageSwitching() {
  console.log('=== H5-Vue中文语言切换测试 ===');
  
  // 1. 检查当前状态
  const currentLang = localStorage.getItem('lang');
  console.log('1. 当前语言设置:', currentLang);
  
  // 2. 检查是否为中文
  const isChinese = currentLang === 'zh-CN' || currentLang === 'zh-TW';
  console.log('2. 是否为中文:', isChinese ? '是' : '否');
  
  // 3. 检查语言切换器
  const languageBtn = document.querySelector('.language-btn');
  if (languageBtn) {
    const btnText = languageBtn.querySelector('span')?.textContent;
    console.log('3. 语言切换器显示:', btnText);
  } else {
    console.log('3. ❌ 未找到语言切换器');
  }
  
  // 4. 检查语言菜单
  const languageMenu = document.querySelector('.language-menu');
  if (languageMenu) {
    const chineseItems = languageMenu.querySelectorAll('.language-item').forEach(item => {
      const flag = item.querySelector('.flag')?.textContent;
      const name = item.querySelector('.name')?.textContent;
      const isActive = item.classList.contains('active');
      if (flag === '🇨🇳' || flag === '🇹🇼') {
        console.log(`4. 中文语言选项: ${flag} ${name} ${isActive ? '(当前)' : ''}`);
      }
    });
  }
  
  // 5. 检查界面文字
  const heroTitle = document.querySelector('.hero-title');
  const navHome = document.querySelector('.nav-item span');
  
  if (heroTitle) {
    console.log('5. 首页标题:', heroTitle.textContent);
    const isChineseText = /[\u4e00-\u9fff]/.test(heroTitle.textContent);
    console.log('   是否为中文:', isChineseText ? '是' : '否');
  }
  
  if (navHome) {
    console.log('6. 导航文字:', navHome.textContent);
    const isChineseText = /[\u4e00-\u9fff]/.test(navHome.textContent);
    console.log('   是否为中文:', isChineseText ? '是' : '否');
  }
  
  return {
    currentLang,
    isChinese,
    heroTitle: heroTitle?.textContent,
    navText: navHome?.textContent,
    hasLanguageBtn: !!languageBtn,
    hasLanguageMenu: !!languageMenu
  };
}

// 切换到简体中文
function switchToSimplifiedChinese() {
  console.log('=== 切换到简体中文 ===');
  
  // 1. 保存语言设置
  localStorage.setItem('lang', 'zh-CN');
  console.log('1. ✅ 已保存简体中文到localStorage');
  
  // 2. 更新全局i18n（如果存在）
  if (window.$i18n) {
    window.$i18n.locale = 'zh-CN';
    console.log('2. ✅ 已更新全局i18n locale为简体中文');
  } else {
    console.log('2. ⚠️ 未找到全局i18n实例');
  }
  
  // 3. 刷新页面
  console.log('3. 🔄 即将刷新页面以应用简体中文...');
  setTimeout(() => {
    window.location.reload();
  }, 1000);
  
  return true;
}

// 切换到繁体中文
function switchToTraditionalChinese() {
  console.log('=== 切换到繁体中文 ===');
  
  // 1. 保存语言设置
  localStorage.setItem('lang', 'zh-TW');
  console.log('1. ✅ 已保存繁体中文到localStorage');
  
  // 2. 更新全局i18n（如果存在）
  if (window.$i18n) {
    window.$i18n.locale = 'zh-TW';
    console.log('2. ✅ 已更新全局i18n locale为繁体中文');
  } else {
    console.log('2. ⚠️ 未找到全局i18n实例');
  }
  
  // 3. 刷新页面
  console.log('3. 🔄 即将刷新页面以应用繁体中文...');
  setTimeout(() => {
    window.location.reload();
  }, 1000);
  
  return true;
}

// 检查中文翻译内容
function checkChineseTranslations() {
  console.log('=== 检查中文翻译内容 ===');
  
  const translations = {
    'zh-CN': {
      'home.heroTitle': '在任何地方与Demo交易可能性',
      'home.startTrading': '开始交易',
      'nav.home': '首页',
      'nav.trading': '交易'
    },
    'zh-TW': {
      'home.heroTitle': '在任何地方與Demo交易可能性',
      'home.startTrading': '開始交易',
      'nav.home': '首頁',
      'nav.trading': '交易'
    }
  };
  
  Object.keys(translations).forEach(langCode => {
    const langName = langCode === 'zh-CN' ? '简体中文' : '繁体中文';
    console.log(`${langName} (${langCode}) 翻译内容:`);
    
    Object.keys(translations[langCode]).forEach(key => {
      console.log(`  ${key}: ${translations[langCode][key]}`);
    });
  });
}

// 验证中文语言切换结果
function verifyChineseLanguageResult() {
  console.log('=== 验证中文语言切换结果 ===');
  
  const currentLang = localStorage.getItem('lang');
  const isChinese = currentLang === 'zh-CN' || currentLang === 'zh-TW';
  
  console.log('1. localStorage中的语言:', currentLang);
  console.log('2. 是否为中文:', isChinese ? '是' : '否');
  
  // 检查界面文字
  const heroTitle = document.querySelector('.hero-title');
  const startTradingBtn = document.querySelector('.btn-primary');
  const navItems = document.querySelectorAll('.nav-item span');
  
  if (heroTitle) {
    const isChineseText = /[\u4e00-\u9fff]/.test(heroTitle.textContent);
    console.log('3. 首页标题:', heroTitle.textContent);
    console.log('   是否为中文:', isChineseText ? '是' : '否');
  }
  
  if (startTradingBtn) {
    const isChineseText = /[\u4e00-\u9fff]/.test(startTradingBtn.textContent);
    console.log('4. 开始交易按钮:', startTradingBtn.textContent);
    console.log('   是否为中文:', isChineseText ? '是' : '否');
  }
  
  navItems.forEach((item, index) => {
    const isChineseText = /[\u4e00-\u9fff]/.test(item.textContent);
    console.log(`5. 导航项 ${index + 1}:`, item.textContent);
    console.log(`   是否为中文:`, isChineseText ? '是' : '否');
  });
  
  return {
    currentLang,
    isChinese,
    heroTitle: heroTitle?.textContent,
    startTradingBtn: startTradingBtn?.textContent,
    navItems: Array.from(navItems).map(item => item.textContent)
  };
}

// 批量测试中文语言
function testAllChineseLanguages() {
  console.log('=== 批量测试所有中文语言 ===');
  
  const testLanguages = ['zh-CN', 'zh-TW'];
  let currentIndex = 0;
  
  function testNextChinese() {
    if (currentIndex >= testLanguages.length) {
      console.log('=== 所有中文语言测试完成 ===');
      return;
    }
    
    const langCode = testLanguages[currentIndex];
    const lang = chineseLanguages.find(l => l.code === langCode);
    
    console.log(`测试中文语言 ${currentIndex + 1}/${testLanguages.length}: ${lang.name}`);
    
    // 切换到下一个中文语言
    if (langCode === 'zh-CN') {
      switchToSimplifiedChinese();
    } else {
      switchToTraditionalChinese();
    }
    
    currentIndex++;
  }
  
  // 开始测试
  testNextChinese();
}

// 导出函数到全局
if (typeof window !== 'undefined') {
  window.testChineseLanguageSwitching = testChineseLanguageSwitching;
  window.switchToSimplifiedChinese = switchToSimplifiedChinese;
  window.switchToTraditionalChinese = switchToTraditionalChinese;
  window.checkChineseTranslations = checkChineseTranslations;
  window.verifyChineseLanguageResult = verifyChineseLanguageResult;
  window.testAllChineseLanguages = testAllChineseLanguages;
  
  console.log('🔧 中文语言切换测试工具已加载');
  console.log('可用函数:');
  console.log('- testChineseLanguageSwitching(): 检查中文语言切换状态');
  console.log('- switchToSimplifiedChinese(): 切换到简体中文');
  console.log('- switchToTraditionalChinese(): 切换到繁体中文');
  console.log('- checkChineseTranslations(): 检查中文翻译内容');
  console.log('- verifyChineseLanguageResult(): 验证中文语言切换结果');
  console.log('- testAllChineseLanguages(): 批量测试所有中文语言');
  
  // 自动运行基础检查
  setTimeout(() => {
    testChineseLanguageSwitching();
    checkChineseTranslations();
  }, 1000);
}

// 如果在Node.js环境中，直接导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testChineseLanguageSwitching,
    switchToSimplifiedChinese,
    switchToTraditionalChinese,
    checkChineseTranslations,
    verifyChineseLanguageResult,
    testAllChineseLanguages,
    chineseLanguages
  };
}
