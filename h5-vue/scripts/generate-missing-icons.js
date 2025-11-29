/**
 * 生成缺失的币种图标
 * 为缺失的币种创建通用的SVG图标
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 缺失的币种列表（根据错误日志）
const missingSymbols = [
  'ava', 'trump', 'cyber', 'mnde', 'eurq', 'arty', 'orca',
  'xrp', 'link', 'bch', 'yfi', 'tusd', 'mln', 'ronin',
  'pvusd', 'osmo', 'arty', 'xaut', 'spy'
];

// 颜色配置 - 为不同币种分配不同颜色
const colorPalette = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2',
  '#A3E4D7', '#F9E79F', '#D5A6BD', '#AED6F1', '#A9DFBF'
];

// 生成SVG图标的函数
function generateSVGIcon(symbol, color) {
  const symbolUpper = symbol.toUpperCase();
  const displayText = symbolUpper.length > 4 ? symbolUpper.substring(0, 4) : symbolUpper;
  
  return `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <circle cx="32" cy="32" r="32" fill="${color}"/>
  <text x="50%" y="50%" text-anchor="middle" dy="0.35em" font-family="Arial, sans-serif" 
        font-size="${displayText.length > 3 ? '16' : '20'}" font-weight="bold" fill="#FFFFFF">
    ${displayText}
  </text>
</svg>`;
}

// 生成PNG备用图标的函数（简化版，实际应该使用canvas或其他工具）
function generatePNGFallback(symbol) {
  // 这里返回一个简单的数据URL，实际项目中可能需要更复杂的生成逻辑
  return `data:image/svg+xml;base64,${Buffer.from(generateSVGIcon(symbol, '#666666')).toString('base64')}`;
}

// 创建目录的函数
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// 主函数
function generateMissingIcons() {
  const publicDir = path.join(__dirname, '../public');
  const symbolDir = path.join(publicDir, 'symbol');
  
  // 确保symbol目录存在
  ensureDirectoryExists(symbolDir);
  
  console.log('开始生成缺失的币种图标...');
  
  missingSymbols.forEach((symbol, index) => {
    const color = colorPalette[index % colorPalette.length];
    const svgContent = generateSVGIcon(symbol, color);
    
    // 生成SVG文件
    const svgPath = path.join(symbolDir, `${symbol.toLowerCase()}.svg`);
    fs.writeFileSync(svgPath, svgContent, 'utf8');
    console.log(`✅ 生成SVG图标: ${symbol.toLowerCase()}.svg`);
    
    // 生成PNG文件（作为备用）
    const pngPath = path.join(symbolDir, `${symbol.toLowerCase()}.png`);
    // 注意：这里只是创建一个占位符，实际项目中可能需要真正的PNG生成
    fs.writeFileSync(pngPath, '# PNG placeholder for ' + symbol, 'utf8');
    console.log(`✅ 生成PNG占位符: ${symbol.toLowerCase()}.png`);
  });
  
  // 生成默认图标
  const defaultSvg = generateSVGIcon('?', '#999999');
  fs.writeFileSync(path.join(symbolDir, 'default.svg'), defaultSvg, 'utf8');
  fs.writeFileSync(path.join(symbolDir, 'default.png'), '# Default PNG placeholder', 'utf8');
  console.log('✅ 生成默认图标: default.svg, default.png');
  
  // 生成loading-default.png（用于wap-vue项目）
  const loadingDefaultSvg = generateSVGIcon('...', '#CCCCCC');
  fs.writeFileSync(path.join(publicDir, 'loading-default.png'), '# Loading default PNG placeholder', 'utf8');
  console.log('✅ 生成加载默认图标: loading-default.png');
  
  console.log(`\n🎉 图标生成完成！共生成 ${missingSymbols.length} 个币种图标`);
  console.log('📁 图标位置:', symbolDir);
}

// 执行生成
// generateMissingIcons(); // 已生成，注释掉避免重复运行

export { generateMissingIcons, generateSVGIcon };
