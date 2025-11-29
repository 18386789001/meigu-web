/**
 * 同步所有语言的 i18n 文件，将 AROHI 替换为 JPMX
 * 针对 wap-vue 项目的语言文件
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 语言文件列表
const languageFiles = [
  'CN.js',
  'de.js', 
  'en.js',
  'es.js',
  'fr.js',
  'gr.js',
  'Italy.js',
  'Japanese.js',
  'Korean.js',
  'pt.js',
  'ro.js',
  'th.js',
  'tur.js',
  'vi.js',
  'zh-CN.js'
];

// 替换规则
const replacements = [
  // 基本替换
  { from: /AROHI/g, to: 'JPMX' },
  { from: /Arohi/g, to: 'JPMX' },
  { from: /arohi/g, to: 'JPMX' },
  
  // 邮箱地址替换
  { from: /support@arohi\.com/g, to: 'support@JPMX.com' },
  { from: /support{'@'}arohi\.com/g, to: "support{'@'}JPMX.com" },
  { from: /premium@arohi\.com/g, to: 'premium@JPMX.com' },
  { from: /premium{'@'}arohi\.com/g, to: "premium{'@'}JPMX.com" },
  
  // 域名替换
  { from: /www\.arohi\.com/g, to: 'www.JPMX.com' },
  { from: /arohi\.com/g, to: 'JPMX.com' },
  
  // 公司名称替换
  { from: /AROHI Markets Limited/g, to: 'JPMX Markets Limited' },
  { from: /AROHI Markets Ltd/g, to: 'JPMX Markets Ltd' },
  { from: /AROHI Group Limited/g, to: 'JPMX Group Limited' },
  { from: /AROHI Limited/g, to: 'JPMX Limited' },
  
  // 服务器地址替换
  { from: /edge\d+\.arohi\.com/g, to: (match) => match.replace('arohi.com', 'JPMX.com') },
  
  // 路径替换
  { from: /\/arohi\//g, to: '/JPMX/' },
  { from: /#\/arohi-/g, to: '#/JPMX-' },
  
  // 特殊格式替换
  { from: /\{AROHI\}/g, to: '{JPMX}' },
  { from: /\$AROHI/g, to: '$JPMX' },
];

/**
 * 处理单个文件
 */
function processFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  文件不存在: ${filePath}`);
      return false;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let changeCount = 0;

    // 应用所有替换规则
    replacements.forEach(rule => {
      const originalContent = content;
      content = content.replace(rule.from, rule.to);
      if (content !== originalContent) {
        modified = true;
        // 计算替换次数
        const matches = originalContent.match(rule.from);
        if (matches) {
          changeCount += matches.length;
        }
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ 已更新: ${path.basename(filePath)} (${changeCount} 处修改)`);
      return true;
    } else {
      console.log(`ℹ️  无需修改: ${path.basename(filePath)}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ 处理文件失败: ${filePath}`, error.message);
    return false;
  }
}

/**
 * 主处理函数
 */
function main() {
  console.log('🚀 开始同步 AROHI → JPMX 替换...\n');
  
  const i18nDir = path.join(__dirname, 'src/i18n/modules');
  let totalFiles = 0;
  let modifiedFiles = 0;
  
  // 处理每个语言文件
  languageFiles.forEach(fileName => {
    console.log(`📁 处理语言文件: ${fileName}`);
    const filePath = path.join(i18nDir, fileName);
    totalFiles++;
    
    if (processFile(filePath)) {
      modifiedFiles++;
    }
    
    console.log(''); // 空行分隔
  });
  
  // 输出统计信息
  console.log('📊 处理完成统计:');
  console.log(`   总文件数: ${totalFiles}`);
  console.log(`   修改文件数: ${modifiedFiles}`);
  console.log(`   未修改文件数: ${totalFiles - modifiedFiles}`);
  
  if (modifiedFiles > 0) {
    console.log('\n🎉 AROHI → JPMX 同步完成！');
    console.log('💡 建议运行以下命令验证修改：');
    console.log('   yarn dev');
  } else {
    console.log('\n✨ 所有文件都已是最新状态，无需修改。');
  }
}

// 运行脚本
main();
