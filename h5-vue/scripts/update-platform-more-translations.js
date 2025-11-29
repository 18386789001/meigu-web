#!/usr/bin/env node

/**
 * 更新Platform和More页面的多语言翻译
 * 基于英文版本翻译到其他语言
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 语言映射
const languages = {
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文', 
  'ja-JP': '日本語',
  'ko-KR': '한국어',
  'th-TH': 'ไทย',
  'vi-VN': 'Tiếng Việt',
  'de-DE': 'Deutsch',
  'es-ES': 'Español',
  'fr-FR': 'Français',
  'it-IT': 'Italiano',
  'pt-PT': 'Português',
  'el-GR': 'Ελληνικά'
};

// 英文基础翻译（从en-US.js提取）
const baseTranslations = {
  platform: {
    title: 'Trading Platform',
    subtitle: 'Choose the trading platform that suits you best',
    description: 'Professional trading platform, stable and reliable',
    platforms: 'Platforms',
    uptime: 'Uptime',
    support: 'Support',
    availablePlatforms: 'Available Platforms',
    all: 'All',
    desktop: 'Desktop',
    mobile: 'Mobile',
    web: 'Web',
    spread: 'Spread',
    leverage: 'Leverage',
    execution: 'Execution',
    download: 'Download',
    tryDemo: 'Try Demo',
    advantages: 'Platform Advantages',
    reliable: 'Reliable',
    reliableDesc: '99.9% uptime',
    fast: 'Fast Execution',
    fastDesc: 'Millisecond order execution',
    secure: 'Secure',
    secureDesc: 'Bank-level security encryption',
    multiDevice: 'Multi-device Support',
    multiDeviceDesc: 'Support multi-device synchronization',
    
    // Platform descriptions
    mt5Desktop: 'Professional desktop trading platform',
    mt5Mobile: 'Mobile trading application',
    mt5Web: 'Web-based trading platform',
    mt4Classic: 'Classic trading platform',
    
    // Platform types
    platformTypes: {
      desktop: 'Desktop',
      mobile: 'Mobile',
      web: 'Web',
      legacy: 'Legacy'
    },
    
    // Platform features
    features: {
      advancedCharts: 'Advanced Chart Analysis',
      eaTrading: 'EA Automated Trading',
      multiAccount: 'Multi-Account Management',
      marketDepth: 'Market Depth Display',
      realTimePush: 'Real-time Push Notifications',
      oneClickTrading: 'One-Click Trading',
      chartAnalysis: 'Chart Analysis',
      accountManagement: 'Account Management',
      noDownload: 'No Download Required',
      crossPlatform: 'Cross-Platform Compatible',
      realTimeSync: 'Real-time Synchronization',
      cloudStorage: 'Cloud Storage',
      classicInterface: 'Classic Interface',
      stableReliable: 'Stable & Reliable',
      richIndicators: 'Rich Indicators',
      wideSupport: 'Wide Support'
    }
  },
  
  more: {
    title: 'More Features',
    tradingServices: 'Trading Services',
    platformServices: 'Platform Services',
    accountServices: 'Account Services',
    accountManagement: 'Account Management',
    forexTrading: 'Forex Trading',
    forexDesc: 'Global Major Currency Pairs',
    cryptocurrency: 'Cryptocurrency',
    cryptoDesc: 'Bitcoin, Ethereum, etc.',
    stockTrading: 'Stock Trading',
    stockDesc: 'Global Major Stock Markets',
    commodityTrading: 'Commodity Futures',
    commodityDesc: 'Gold, Oil and other commodities',
    mt4Platform: 'MT4 Platform',
    mt4Desc: 'Classic Trading Platform',
    mt5Platform: 'MT5 Platform',
    mt5Desc: 'Next Generation Trading Platform',
    webTrading: 'Web Trading',
    webDesc: 'No download required, browser trading',
    mobileTrading: 'Mobile Trading',
    mobileDesc: 'Trade anywhere, anytime',
    marketAnalysis: 'Market Analysis',
    analysisDesc: 'Professional market analysis',
    educationCenter: 'Education Center',
    educationDesc: 'Trading knowledge and tutorials',
    customerSupport: 'Customer Support',
    supportDesc: '24/7 online customer service',
    login: 'Login Account',
    loginDesc: 'Access your trading account',
    register: 'Register Account',
    registerDesc: 'Open a new trading account',
    support: 'Customer Support',
    settings: 'Settings',
    language: 'Language Settings',
    languageDesc: 'Switch interface language',
    about: 'About Us',
    aboutDesc: 'Learn about Demo platform'
  }
};

// 各语言翻译映射
const translations = {
  'zh-CN': {
    platform: {
      title: '交易平台',
      subtitle: '选择最适合您的交易平台',
      description: 'Professional trading platform，稳定可靠',
      platforms: '平台',
      uptime: '稳定性',
      support: '支持',
      availablePlatforms: '可用平台',
      all: '全部',
      desktop: '桌面版',
      mobile: '移动版',
      web: '网页版',
      spread: '点差',
      leverage: '杠杆',
      execution: '执行',
      download: '下载',
      tryDemo: '试用演示',
      advantages: '平台优势',
      reliable: '稳定可靠',
      reliableDesc: '99.9%稳定运行',
      fast: '快速执行',
      fastDesc: '毫秒级订单执行',
      secure: '安全保护',
      secureDesc: '银行级安全加密',
      multiDevice: '多设备支持',
      multiDeviceDesc: '支持多设备同步',
      
      mt5Desktop: '专业桌面交易平台',
      mt5Mobile: '移动端交易应用',
      mt5Web: '网页版交易平台',
      mt4Classic: '经典交易平台',
      
      platformTypes: {
        desktop: '桌面版',
        mobile: '移动版',
        web: '网页版',
        legacy: '经典版'
      },
      
      features: {
        advancedCharts: '高级图表分析',
        eaTrading: 'EA自动交易',
        multiAccount: '多账户管理',
        marketDepth: '市场深度显示',
        realTimePush: '实时行情推送',
        oneClickTrading: '一键交易',
        chartAnalysis: '图表分析',
        accountManagement: '账户管理',
        noDownload: '无需下载安装',
        crossPlatform: '跨平台兼容',
        realTimeSync: '实时同步',
        cloudStorage: '云端存储',
        classicInterface: '经典界面',
        stableReliable: '稳定可靠',
        richIndicators: '丰富指标',
        wideSupport: '广泛支持'
      }
    },
    
    more: {
      title: '更多功能',
      tradingServices: '交易服务',
      platformServices: '平台服务',
      accountServices: '账户服务',
      accountManagement: '账户管理',
      forexTrading: '外汇交易',
      forexDesc: '全球主要货币对',
      cryptocurrency: '数字货币',
      cryptoDesc: '比特币、以太坊等',
      stockTrading: '股票交易',
      stockDesc: '全球主要股票市场',
      commodityTrading: '商品期货',
      commodityDesc: '黄金、石油等商品',
      mt4Platform: 'MT4平台',
      mt4Desc: '经典交易平台',
      mt5Platform: 'MT5平台',
      mt5Desc: '新一代交易平台',
      webTrading: '网页交易',
      webDesc: '无需下载，浏览器交易',
      mobileTrading: '移动交易',
      mobileDesc: '随时随地交易',
      marketAnalysis: '市场分析',
      analysisDesc: '专业市场分析',
      educationCenter: '教育中心',
      educationDesc: '交易知识和教程',
      customerSupport: '客户支持',
      supportDesc: '24/7在线客服',
      login: '登录账户',
      loginDesc: '访问您的交易账户',
      register: '注册账户',
      registerDesc: '开设新的交易账户',
      support: '客户支持',
      settings: '设置',
      language: '语言设置',
      languageDesc: '切换界面语言',
      about: '关于我们',
      aboutDesc: '了解Demo平台'
    }
  }
};

// 更新语言文件
function updateLanguageFile(langCode, translations) {
  const filePath = path.join(__dirname, '..', 'src', 'i18n', `${langCode}.js`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ 语言文件不存在: ${filePath}`);
    return false;
  }
  
  try {
    // 读取现有文件
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 检查是否已有platform部分
    if (content.includes('// Platform') || content.includes('platform: {')) {
      console.log(`✅ ${langCode} 已包含platform翻译，跳过更新`);
    } else {
      // 在文件末尾添加platform翻译
      const platformTranslation = `
  // Platform
  platform: ${JSON.stringify(translations.platform, null, 4).replace(/"/g, "'")},`;
      
      // 在最后的}之前插入
      content = content.replace(/}\s*$/, `${platformTranslation}\n}`);
    }
    
    // 检查是否已有more部分
    if (content.includes('// More features page') || content.includes('more: {')) {
      console.log(`✅ ${langCode} 已包含more翻译，跳过更新`);
    } else {
      // 在文件末尾添加more翻译
      const moreTranslation = `
  // More features page
  more: ${JSON.stringify(translations.more, null, 4).replace(/"/g, "'")},`;
      
      // 在最后的}之前插入
      content = content.replace(/}\s*$/, `${moreTranslation}\n}`);
    }
    
    // 写回文件
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ 已更新 ${langCode} 翻译文件`);
    return true;
    
  } catch (error) {
    console.error(`❌ 更新 ${langCode} 失败:`, error.message);
    return false;
  }
}

// 主函数
function main() {
  console.log('🚀 开始更新Platform和More页面的多语言翻译...\n');
  
  let successCount = 0;
  let totalCount = 0;
  
  // 更新中文翻译
  if (translations['zh-CN']) {
    totalCount++;
    if (updateLanguageFile('zh-CN', translations['zh-CN'])) {
      successCount++;
    }
  }
  
  // 对于其他语言，使用英文作为基础
  for (const langCode of Object.keys(languages)) {
    if (langCode === 'zh-CN') continue; // 已处理
    
    totalCount++;
    if (updateLanguageFile(langCode, baseTranslations)) {
      successCount++;
    }
  }
  
  console.log(`\n📊 更新完成: ${successCount}/${totalCount} 个语言文件更新成功`);
  
  if (successCount === totalCount) {
    console.log('🎉 所有语言文件更新成功！');
  } else {
    console.log('⚠️  部分语言文件更新失败，请检查错误信息');
  }
}

// 运行脚本
main();
