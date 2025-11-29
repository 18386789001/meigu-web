const fs = require('fs');
const path = require('path');

// 需要修复的语言目录
const languageDirs = [
  'German',
  'Greek', 
  'Italia',
  'Japanese',
  'Korean',
  'Portuguese',
  'Romanian',
  'Spain',
  'Turkish'
];

// 基础路径
const basePath = './src/i18n/resource';

languageDirs.forEach(dir => {
  const c2cPath = path.join(basePath, dir, 'c2c.js');
  
  if (fs.existsSync(c2cPath)) {
    console.log(`处理 ${dir}/c2c.js`);
    
    try {
      // 读取文件内容
      let content = fs.readFileSync(c2cPath, 'utf8');
      
      // 检查是否已经有C2C键
      if (content.includes("'C2C':")) {
        console.log(`  ${dir} 已经有C2C键，跳过`);
        return;
      }
      
      // 在export default {后添加C2C键
      content = content.replace(
        /export default \{\s*'lianxi'/,
        "export default {\n  'C2C': \"C2C\",\n  'lianxi'"
      );
      
      // 写回文件
      fs.writeFileSync(c2cPath, content, 'utf8');
      console.log(`  ${dir} C2C键添加成功`);
      
    } catch (error) {
      console.error(`处理 ${dir} 时出错:`, error.message);
    }
  } else {
    console.log(`${dir}/c2c.js 文件不存在`);
  }
});

console.log('C2C翻译键修复完成！');
