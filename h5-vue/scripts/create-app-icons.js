#!/usr/bin/env node

/**
 * 创建应用图标文件
 * 生成PWA所需的各种尺寸图标
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SVG图标模板
const createIconSVG = (size) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e40af;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffd700;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ffed4e;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- 背景 -->
  <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#bgGradient)"/>
  
  <!-- 主图标 - 交易图表 -->
  <g transform="translate(${size * 0.2}, ${size * 0.2})">
    <!-- 图表背景 -->
    <rect x="0" y="${size * 0.15}" width="${size * 0.6}" height="${size * 0.45}" 
          rx="${size * 0.02}" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
    
    <!-- 趋势线 -->
    <polyline points="${size * 0.05},${size * 0.45} ${size * 0.15},${size * 0.35} ${size * 0.25},${size * 0.25} ${size * 0.35},${size * 0.3} ${size * 0.45},${size * 0.2} ${size * 0.55},${size * 0.25}"
              fill="none" stroke="url(#iconGradient)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    
    <!-- 数据点 -->
    <circle cx="${size * 0.05}" cy="${size * 0.45}" r="2" fill="url(#iconGradient)"/>
    <circle cx="${size * 0.15}" cy="${size * 0.35}" r="2" fill="url(#iconGradient)"/>
    <circle cx="${size * 0.25}" cy="${size * 0.25}" r="2" fill="url(#iconGradient)"/>
    <circle cx="${size * 0.35}" cy="${size * 0.3}" r="2" fill="url(#iconGradient)"/>
    <circle cx="${size * 0.45}" cy="${size * 0.2}" r="2" fill="url(#iconGradient)"/>
    <circle cx="${size * 0.55}" cy="${size * 0.25}" r="2" fill="url(#iconGradient)"/>
    
    <!-- 货币符号 -->
    <text x="${size * 0.3}" y="${size * 0.1}" text-anchor="middle" 
          font-family="Arial, sans-serif" font-size="${size * 0.08}" font-weight="bold" fill="url(#iconGradient)">$</text>
  </g>
  
  <!-- 底部文字 -->
  <text x="${size * 0.5}" y="${size * 0.85}" text-anchor="middle" 
        font-family="Arial, sans-serif" font-size="${size * 0.06}" font-weight="bold" fill="white">Demo</text>
</svg>`;

// 创建图标文件
function createIcons() {
  console.log('🚀 开始创建应用图标...\n');
  
  const imagesDir = path.join(__dirname, '..', 'public', 'images');
  
  // 确保images目录存在
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
    console.log('📁 创建images目录');
  }
  
  // 创建不同尺寸的SVG图标
  const sizes = [192, 512];
  
  sizes.forEach(size => {
    const svgContent = createIconSVG(size);
    const svgPath = path.join(imagesDir, `mobile-${size}.svg`);
    
    try {
      fs.writeFileSync(svgPath, svgContent, 'utf8');
      console.log(`✅ 创建 ${size}x${size} SVG图标: mobile-${size}.svg`);
    } catch (error) {
      console.error(`❌ 创建 ${size}x${size} SVG图标失败:`, error.message);
    }
  });
  
  // 创建favicon.ico的SVG版本
  const faviconSVG = createIconSVG(32);
  const faviconPath = path.join(__dirname, '..', 'public', 'favicon.svg');
  
  try {
    fs.writeFileSync(faviconPath, faviconSVG, 'utf8');
    console.log('✅ 创建favicon.svg');
  } catch (error) {
    console.error('❌ 创建favicon.svg失败:', error.message);
  }
  
  // 创建一个简单的PNG占位符（实际项目中应该使用真实的PNG图标）
  const pngPlaceholder = `data:image/svg+xml;base64,${Buffer.from(createIconSVG(192)).toString('base64')}`;
  
  console.log('\n📝 建议:');
  console.log('1. 使用专业工具将SVG转换为PNG格式');
  console.log('2. 确保图标在不同背景下都清晰可见');
  console.log('3. 测试图标在各种设备上的显示效果');
  
  console.log('\n🎉 图标创建完成！');
}

// 运行脚本
createIcons();
