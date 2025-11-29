/**
 * 生成外汇交易对图标文件
 * 为缺失的外汇交易对创建SVG和PNG占位符图标
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 外汇交易对列表 - 扩展版本，包含更多常见交易对
const forexPairs = [
  // 主要货币对
  'audcad', 'audchf', 'audeur', 'audgbp', 'audjpy', 'audnzd', 'audusd',
  'cadchf', 'cadjpy', 'chfjpy', 'euraud', 'eurcad', 'eurchf', 'eurgbp',
  'eurjpy', 'eurnzd', 'eurusd', 'gbpaud', 'gbpcad', 'gbpchf', 'gbpjpy',
  'gbpnzd', 'gbpusd', 'nzdcad', 'nzdchf', 'nzdjpy', 'nzdusd', 'usdcad',
  'usdchf', 'usdjpy',

  // 次要货币对
  'eursek', 'eurnok', 'eurpln', 'eurczk', 'eurhuf', 'eurtry',
  'gbpsek', 'gbpnok', 'gbppln', 'gbpczk', 'gbphuf', 'gbptry',
  'usdsek', 'usdnok', 'usdpln', 'usdczk', 'usdhuf', 'usdtry',
  'usdzar', 'usdmxn', 'usdbrl', 'usdsgd', 'usdhkd', 'usdkrw',

  // 商品货币对
  'audsgd', 'audhkd', 'nzdsgd', 'nzdhkd', 'cadsgd', 'cadhkd',

  // 交叉货币对
  'eursgd', 'eurhkd', 'gbpsgd', 'gbphkd', 'chfsgd', 'chfhkd',
  'jpysgd', 'jpyhkd', 'sekjpy', 'nokjpy', 'plnjpy', 'czkjpy'
];

// 生成SVG图标内容
function generateForexSVG(pair) {
  const baseCurrency = pair.substring(0, 3).toUpperCase();
  const quoteCurrency = pair.substring(3, 6).toUpperCase();
  
  return `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad-${pair}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4CAF50;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2196F3;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- 背景圆形 -->
  <circle cx="32" cy="32" r="30" fill="url(#grad-${pair})" stroke="#fff" stroke-width="2"/>
  
  <!-- 基础货币 -->
  <text x="32" y="24" font-family="Arial, sans-serif" font-size="10" font-weight="bold" 
        text-anchor="middle" fill="white">${baseCurrency}</text>
  
  <!-- 分隔线 -->
  <line x1="16" y1="32" x2="48" y2="32" stroke="white" stroke-width="1"/>
  
  <!-- 报价货币 -->
  <text x="32" y="44" font-family="Arial, sans-serif" font-size="10" font-weight="bold" 
        text-anchor="middle" fill="white">${quoteCurrency}</text>
  
  <!-- 外汇符号 -->
  <circle cx="50" cy="14" r="8" fill="rgba(255,255,255,0.2)"/>
  <text x="50" y="18" font-family="Arial, sans-serif" font-size="8" font-weight="bold" 
        text-anchor="middle" fill="white">FX</text>
</svg>`;
}

// 生成PNG占位符（实际上是SVG格式，但文件扩展名为PNG）
function generatePNGPlaceholder(pair) {
  return generateForexSVG(pair);
}

// 主要货币的颜色映射
const currencyColors = {
  'USD': '#2E7D32', // 绿色
  'EUR': '#1976D2', // 蓝色
  'GBP': '#7B1FA2', // 紫色
  'JPY': '#D32F2F', // 红色
  'AUD': '#F57C00', // 橙色
  'CAD': '#C62828', // 深红色
  'CHF': '#5D4037', // 棕色
  'NZD': '#00796B'  // 青色
};

// 生成带颜色的SVG图标
function generateColoredForexSVG(pair) {
  const baseCurrency = pair.substring(0, 3).toUpperCase();
  const quoteCurrency = pair.substring(3, 6).toUpperCase();
  
  const baseColor = currencyColors[baseCurrency] || '#4CAF50';
  const quoteColor = currencyColors[quoteCurrency] || '#2196F3';
  
  return `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad-${pair}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${baseColor};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${quoteColor};stop-opacity:1" />
    </linearGradient>
    <filter id="shadow-${pair}">
      <feDropShadow dx="2" dy="2" stdDeviation="2" flood-opacity="0.3"/>
    </filter>
  </defs>
  
  <!-- 背景圆形 -->
  <circle cx="32" cy="32" r="30" fill="url(#grad-${pair})" stroke="#fff" stroke-width="2" filter="url(#shadow-${pair})"/>
  
  <!-- 基础货币背景 -->
  <circle cx="32" cy="20" r="12" fill="rgba(255,255,255,0.2)"/>
  <text x="32" y="25" font-family="Arial, sans-serif" font-size="11" font-weight="bold" 
        text-anchor="middle" fill="white">${baseCurrency}</text>
  
  <!-- 分隔符 -->
  <text x="32" y="36" font-family="Arial, sans-serif" font-size="8" font-weight="bold" 
        text-anchor="middle" fill="white">/</text>
  
  <!-- 报价货币背景 -->
  <circle cx="32" cy="44" r="12" fill="rgba(255,255,255,0.2)"/>
  <text x="32" y="49" font-family="Arial, sans-serif" font-size="11" font-weight="bold" 
        text-anchor="middle" fill="white">${quoteCurrency}</text>
  
  <!-- 外汇标识 -->
  <circle cx="52" cy="12" r="6" fill="rgba(255,255,255,0.9)"/>
  <text x="52" y="15" font-family="Arial, sans-serif" font-size="6" font-weight="bold" 
        text-anchor="middle" fill="${baseColor}">FX</text>
</svg>`;
}

// 确保目录存在
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 创建目录: ${dirPath}`);
  }
}

// 主函数
function generateForexIcons() {
  console.log('🚀 开始生成外汇交易对图标...');
  
  const symbolDir = path.join(__dirname, 'public', 'symbol');
  ensureDirectoryExists(symbolDir);
  
  let generatedCount = 0;
  let skippedCount = 0;
  
  forexPairs.forEach((pair, index) => {
    const pairLower = pair.toLowerCase();
    const svgPath = path.join(symbolDir, `${pairLower}.svg`);
    const pngPath = path.join(symbolDir, `${pairLower}.png`);
    
    // 生成SVG文件
    if (!fs.existsSync(svgPath)) {
      const svgContent = generateColoredForexSVG(pairLower);
      fs.writeFileSync(svgPath, svgContent, 'utf8');
      console.log(`✅ 生成SVG: ${pairLower}.svg`);
      generatedCount++;
    } else {
      console.log(`⏭️  跳过已存在: ${pairLower}.svg`);
      skippedCount++;
    }
    
    // 生成PNG占位符文件
    if (!fs.existsSync(pngPath)) {
      const pngContent = generateColoredForexSVG(pairLower);
      fs.writeFileSync(pngPath, pngContent, 'utf8');
      console.log(`✅ 生成PNG: ${pairLower}.png`);
      generatedCount++;
    } else {
      console.log(`⏭️  跳过已存在: ${pairLower}.png`);
      skippedCount++;
    }
  });
  
  console.log('\n📊 生成统计:');
  console.log(`✅ 新生成文件: ${generatedCount}`);
  console.log(`⏭️  跳过文件: ${skippedCount}`);
  console.log(`📁 总外汇对: ${forexPairs.length}`);
  console.log(`📁 目标目录: ${symbolDir}`);
  
  console.log('\n🎉 外汇交易对图标生成完成！');
  
  // 验证生成的文件
  console.log('\n🔍 验证生成的文件:');
  forexPairs.forEach(pair => {
    const svgPath = path.join(symbolDir, `${pair}.svg`);
    const pngPath = path.join(symbolDir, `${pair}.png`);
    
    const svgExists = fs.existsSync(svgPath);
    const pngExists = fs.existsSync(pngPath);
    
    if (svgExists && pngExists) {
      console.log(`✅ ${pair}: SVG ✓ PNG ✓`);
    } else {
      console.log(`❌ ${pair}: SVG ${svgExists ? '✓' : '✗'} PNG ${pngExists ? '✓' : '✗'}`);
    }
  });
}

// 如果直接运行此脚本
// generateForexIcons(); // 已生成，注释掉避免重复运行

export {
  generateForexIcons,
  forexPairs
};
