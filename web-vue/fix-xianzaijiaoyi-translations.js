import fs from 'fs';
import path from 'path';

// 定义所有语言目录和对应的翻译
const languageTranslations = {
  'China_cn': '现在交易',
  'China_tw': '現在交易', 
  'English': 'Trade Now',
  'Japanese': '今すぐ取引',
  'Korean': '지금 거래',
  'French': 'Négocier maintenant',
  'German': 'Jetzt handeln',
  'Spanish': 'Operar ahora',
  'Italia': 'Fai trading ora',
  'Portuguese': 'Negociar agora',
  'Romanian': 'Tranzacționează acum',
  'Greek': 'Κάνε συναλλαγή τώρα',
  'Turkish': 'Şimdi işlem yap',
  'Spain': 'Operar ahora'
};

// 基础路径
const basePath = './src/i18n/resource';

console.log('开始修复 xianzaijiaoyi 翻译键...\n');

Object.keys(languageTranslations).forEach(dir => {
  const compositeHomePath = path.join(basePath, dir, 'compositeHome.js');
  
  if (fs.existsSync(compositeHomePath)) {
    console.log(`处理 ${dir}/compositeHome.js`);
    
    try {
      // 读取文件内容
      let content = fs.readFileSync(compositeHomePath, 'utf8');
      
      // 检查是否已经有xianzaijiaoyi键
      if (content.includes('"xianzaijiaoyi"') || content.includes("'xianzaijiaoyi'")) {
        console.log(`  ${dir} 已经有xianzaijiaoyi键，跳过`);
        return;
      }
      
      // 获取对应的翻译
      const translation = languageTranslations[dir];
      
      // 在export default {后添加xianzaijiaoyi键
      // 寻找合适的位置插入，通常在文件开头
      const insertLine = `  "xianzaijiaoyi": "${translation}",\n`;
      
      // 在export default {后面插入
      content = content.replace(
        /export default \{(\s*)/,
        `export default {$1  "xianzaijiaoyi": "${translation}",\n$1`
      );
      
      // 写回文件
      fs.writeFileSync(compositeHomePath, content, 'utf8');
      console.log(`  ${dir} xianzaijiaoyi键添加成功: "${translation}"`);
      
    } catch (error) {
      console.error(`处理 ${dir} 时出错:`, error.message);
    }
  } else {
    console.log(`${dir}/compositeHome.js 文件不存在`);
  }
});

console.log('\nxianzaijiaoyi 翻译键修复完成！');
console.log('\n修复内容：');
console.log('- 为所有语言的 compositeHome.js 文件添加了 "xianzaijiaoyi" 翻译键');
console.log('- 中文简体: "现在交易"');
console.log('- 中文繁体: "現在交易"');
console.log('- 英文: "Trade Now"');
console.log('- 日文: "今すぐ取引"');
console.log('- 韩文: "지금 거래"');
console.log('- 法文: "Négocier maintenant"');
console.log('- 德文: "Jetzt handeln"');
console.log('- 西班牙文: "Operar ahora"');
console.log('- 意大利文: "Fai trading ora"');
console.log('- 葡萄牙文: "Negociar agora"');
console.log('- 罗马尼亚文: "Tranzacționează acum"');
console.log('- 希腊文: "Κάνε συναλλαγή τώρα"');
console.log('- 土耳其文: "Şimdi işlem yap"');
console.log('\n现在按钮应该显示正确的翻译文本而不是拼音了！');
