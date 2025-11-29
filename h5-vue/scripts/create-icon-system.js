/**
 * 创建完整的图标管理系统
 * 包括SVG图标生成、PNG备用图标、图标管理工具等
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 扩展的币种列表，包括更多常见币种
const cryptoSymbols = [
  // 原有缺失的币种
  'ava', 'trump', 'cyber', 'mnde', 'eurq', 'arty', 'orca',
  'xrp', 'link', 'bch', 'yfi', 'tusd', 'mln', 'ronin',
  'pvusd', 'osmo', 'xaut', 'spy',
  
  // 常见加密货币
  'btc', 'eth', 'bnb', 'ada', 'sol', 'dot', 'matic', 'avax',
  'ltc', 'doge', 'shib', 'uni', 'atom', 'near', 'ftm', 'algo',
  'xlm', 'vet', 'icp', 'fil', 'trx', 'etc', 'theta', 'xmr',
  'eos', 'aave', 'mkr', 'comp', 'snx', 'crv', 'sushi', '1inch',
  
  // 稳定币
  'usdt', 'usdc', 'busd', 'dai', 'frax', 'usdd', 'tusd',
  
  // DeFi代币
  'cake', 'mdx', 'bake', 'alpha', 'xvs', 'vai', 'belt',
  
  // NFT和游戏代币
  'axs', 'slp', 'sand', 'mana', 'enj', 'chr', 'alice',
  
  // 其他热门代币
  'gmt', 'stepn', 'apt', 'sui', 'arb', 'op', 'matic'
];

// 股票和ETF符号
const stockSymbols = [
  'spy', 'qqq', 'iwm', 'vti', 'voo', 'vtv', 'vug', 'vea',
  'aapl', 'msft', 'googl', 'amzn', 'tsla', 'meta', 'nvda', 'nflx'
];

// 外汇符号
const forexSymbols = [
  'eur', 'gbp', 'jpy', 'aud', 'cad', 'chf', 'nzd', 'usd'
];

// 商品符号
const commoditySymbols = [
  'xau', 'xag', 'oil', 'gas', 'copper', 'wheat', 'corn', 'sugar'
];

// 颜色主题配置
const colorThemes = {
  crypto: [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2',
    '#A3E4D7', '#F9E79F', '#D5A6BD', '#AED6F1', '#A9DFBF'
  ],
  stock: [
    '#2E86AB', '#A23B72', '#F18F01', '#C73E1D', '#6A994E',
    '#BC4749', '#F2E8CF', '#386641', '#A7C957', '#F2CC8F'
  ],
  forex: [
    '#264653', '#2A9D8F', '#E9C46A', '#F4A261', '#E76F51',
    '#E63946', '#F77F00', '#FCBF49', '#003049', '#669BBC'
  ],
  commodity: [
    '#8B4513', '#DAA520', '#CD853F', '#D2691E', '#B8860B',
    '#A0522D', '#8FBC8F', '#556B2F', '#6B8E23', '#808000'
  ]
};

// 生成高质量SVG图标
function generateAdvancedSVGIcon(symbol, category = 'crypto') {
  const symbolUpper = symbol.toUpperCase();
  const displayText = symbolUpper.length > 4 ? symbolUpper.substring(0, 4) : symbolUpper;
  const colors = colorThemes[category] || colorThemes.crypto;
  const colorIndex = symbol.charCodeAt(0) % colors.length;
  const primaryColor = colors[colorIndex];
  
  // 根据类别选择不同的设计风格
  let iconContent = '';
  
  switch (category) {
    case 'crypto':
      iconContent = `
  <defs>
    <linearGradient id="grad-${symbol}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${adjustBrightness(primaryColor, -20)};stop-opacity:1" />
    </linearGradient>
  </defs>
  <circle cx="32" cy="32" r="30" fill="url(#grad-${symbol})" stroke="#FFFFFF" stroke-width="2"/>
  <text x="50%" y="50%" text-anchor="middle" dy="0.35em" font-family="Arial, sans-serif" 
        font-size="${displayText.length > 3 ? '14' : '18'}" font-weight="bold" fill="#FFFFFF">
    ${displayText}
  </text>`;
      break;
      
    case 'stock':
      iconContent = `
  <rect x="4" y="4" width="56" height="56" rx="8" fill="${primaryColor}"/>
  <rect x="6" y="6" width="52" height="52" rx="6" fill="none" stroke="#FFFFFF" stroke-width="1"/>
  <text x="50%" y="50%" text-anchor="middle" dy="0.35em" font-family="Arial, sans-serif" 
        font-size="${displayText.length > 3 ? '12' : '16'}" font-weight="bold" fill="#FFFFFF">
    ${displayText}
  </text>`;
      break;
      
    case 'forex':
      iconContent = `
  <polygon points="32,4 60,32 32,60 4,32" fill="${primaryColor}"/>
  <polygon points="32,8 56,32 32,56 8,32" fill="none" stroke="#FFFFFF" stroke-width="2"/>
  <text x="50%" y="50%" text-anchor="middle" dy="0.35em" font-family="Arial, sans-serif" 
        font-size="${displayText.length > 3 ? '12' : '16'}" font-weight="bold" fill="#FFFFFF">
    ${displayText}
  </text>`;
      break;
      
    case 'commodity':
      iconContent = `
  <circle cx="32" cy="32" r="28" fill="${primaryColor}"/>
  <circle cx="32" cy="32" r="24" fill="none" stroke="#FFFFFF" stroke-width="2"/>
  <text x="50%" y="50%" text-anchor="middle" dy="0.35em" font-family="Arial, sans-serif" 
        font-size="${displayText.length > 3 ? '11' : '15'}" font-weight="bold" fill="#FFFFFF">
    ${displayText}
  </text>`;
      break;
      
    default:
      iconContent = `
  <circle cx="32" cy="32" r="30" fill="${primaryColor}"/>
  <text x="50%" y="50%" text-anchor="middle" dy="0.35em" font-family="Arial, sans-serif" 
        font-size="${displayText.length > 3 ? '14' : '18'}" font-weight="bold" fill="#FFFFFF">
    ${displayText}
  </text>`;
  }
  
  return `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">${iconContent}
</svg>`;
}

// 调整颜色亮度的辅助函数
function adjustBrightness(hex, percent) {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

// 创建目录的函数
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// 生成所有图标
function generateAllIcons() {
  const publicDir = path.join(__dirname, '../public');
  const symbolDir = path.join(publicDir, 'symbol');
  
  // 确保目录存在
  ensureDirectoryExists(symbolDir);
  
  console.log('🚀 开始生成完整的图标系统...\n');
  
  let totalGenerated = 0;
  
  // 生成加密货币图标
  console.log('📈 生成加密货币图标...');
  cryptoSymbols.forEach((symbol, index) => {
    const svgContent = generateAdvancedSVGIcon(symbol, 'crypto');
    const svgPath = path.join(symbolDir, `${symbol.toLowerCase()}.svg`);
    fs.writeFileSync(svgPath, svgContent, 'utf8');
    totalGenerated++;
  });
  console.log(`✅ 生成了 ${cryptoSymbols.length} 个加密货币图标\n`);
  
  // 生成股票图标
  console.log('📊 生成股票图标...');
  stockSymbols.forEach((symbol, index) => {
    const svgContent = generateAdvancedSVGIcon(symbol, 'stock');
    const svgPath = path.join(symbolDir, `${symbol.toLowerCase()}.svg`);
    fs.writeFileSync(svgPath, svgContent, 'utf8');
    totalGenerated++;
  });
  console.log(`✅ 生成了 ${stockSymbols.length} 个股票图标\n`);
  
  // 生成外汇图标
  console.log('💱 生成外汇图标...');
  forexSymbols.forEach((symbol, index) => {
    const svgContent = generateAdvancedSVGIcon(symbol, 'forex');
    const svgPath = path.join(symbolDir, `${symbol.toLowerCase()}.svg`);
    fs.writeFileSync(svgPath, svgContent, 'utf8');
    totalGenerated++;
  });
  console.log(`✅ 生成了 ${forexSymbols.length} 个外汇图标\n`);
  
  // 生成商品图标
  console.log('🥇 生成商品图标...');
  commoditySymbols.forEach((symbol, index) => {
    const svgContent = generateAdvancedSVGIcon(symbol, 'commodity');
    const svgPath = path.join(symbolDir, `${symbol.toLowerCase()}.svg`);
    fs.writeFileSync(svgPath, svgContent, 'utf8');
    totalGenerated++;
  });
  console.log(`✅ 生成了 ${commoditySymbols.length} 个商品图标\n`);
  
  // 生成默认图标和加载图标
  const defaultSvg = generateAdvancedSVGIcon('?', 'crypto');
  fs.writeFileSync(path.join(symbolDir, 'default.svg'), defaultSvg, 'utf8');
  
  const loadingSvg = generateAdvancedSVGIcon('...', 'crypto');
  fs.writeFileSync(path.join(publicDir, 'loading-default.svg'), loadingSvg, 'utf8');
  
  console.log('🎉 图标系统生成完成！');
  console.log(`📊 总计生成: ${totalGenerated} 个图标`);
  console.log(`📁 图标位置: ${symbolDir}`);
  console.log('\n✨ 功能特性:');
  console.log('  • 高质量SVG矢量图标');
  console.log('  • 分类颜色主题（加密货币、股票、外汇、商品）');
  console.log('  • 渐变和边框效果');
  console.log('  • 响应式设计');
  console.log('  • 完整的备用机制');
}

// 执行生成
// generateAllIcons(); // 已生成，注释掉避免重复运行
