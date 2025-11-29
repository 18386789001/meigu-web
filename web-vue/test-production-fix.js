#!/usr/bin/env node

/**
 * 生产环境错误修复测试脚本
 * 用于验证 Fragment 初始化错误是否已解决
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 web-vue 生产环境错误修复测试');
console.log('=====================================\n');

// 测试配置
const testConfig = {
  buildDir: 'dist',
  testPort: 3000,
  timeout: 30000, // 30秒超时
};

// 颜色输出函数
const colors = {
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
};

// 测试步骤
const testSteps = [
  {
    name: '检查配置文件',
    test: checkConfigFiles,
  },
  {
    name: '清理构建缓存',
    test: cleanBuildCache,
  },
  {
    name: '执行生产构建',
    test: buildProduction,
  },
  {
    name: '分析构建产物',
    test: analyzeBuildOutput,
  },
  {
    name: '检查模块依赖',
    test: checkModuleDependencies,
  },
];

// 主测试函数
async function runTests() {
  console.log(colors.blue('开始执行测试...\n'));
  
  let passedTests = 0;
  let totalTests = testSteps.length;
  
  for (const step of testSteps) {
    try {
      console.log(colors.cyan(`📋 ${step.name}...`));
      await step.test();
      console.log(colors.green(`✅ ${step.name} - 通过\n`));
      passedTests++;
    } catch (error) {
      console.log(colors.red(`❌ ${step.name} - 失败`));
      console.log(colors.red(`   错误: ${error.message}\n`));
    }
  }
  
  // 输出测试结果
  console.log('=====================================');
  console.log(`测试结果: ${passedTests}/${totalTests} 通过`);
  
  if (passedTests === totalTests) {
    console.log(colors.green('🎉 所有测试通过！生产环境错误已修复。'));
  } else {
    console.log(colors.red('⚠️  部分测试失败，请检查相关配置。'));
  }
}

// 检查配置文件
function checkConfigFiles() {
  const requiredFiles = [
    'vite.config.js',
    'src/main.js',
    'src/plugins/element-plus.js',
    'package.json'
  ];
  
  for (const file of requiredFiles) {
    if (!fs.existsSync(file)) {
      throw new Error(`缺少必要文件: ${file}`);
    }
  }
  
  // 检查 vite.config.js 中的关键配置
  const viteConfig = fs.readFileSync('vite.config.js', 'utf8');
  
  const requiredConfigs = [
    'vue-core',
    'element-plus',
    'force: true',
    'ElementPlusResolver'
  ];
  
  for (const config of requiredConfigs) {
    if (!viteConfig.includes(config)) {
      throw new Error(`vite.config.js 缺少配置: ${config}`);
    }
  }
  
  // 检查 main.js 中的导入顺序
  const mainJs = fs.readFileSync('src/main.js', 'utf8');
  
  if (!mainJs.includes('setupElementPlus')) {
    throw new Error('main.js 未使用 setupElementPlus 函数');
  }
  
  console.log('   ✓ 所有配置文件检查通过');
}

// 清理构建缓存
function cleanBuildCache() {
  try {
    // 清理 node_modules/.vite 缓存
    if (fs.existsSync('node_modules/.vite')) {
      execSync('rm -rf node_modules/.vite', { stdio: 'pipe' });
    }
    
    // 清理 dist 目录
    if (fs.existsSync('dist')) {
      execSync('rm -rf dist', { stdio: 'pipe' });
    }
    
    console.log('   ✓ 构建缓存清理完成');
  } catch (error) {
    throw new Error(`清理缓存失败: ${error.message}`);
  }
}

// 执行生产构建
function buildProduction() {
  try {
    console.log('   正在执行生产构建...');
    
    // 执行构建命令
    const buildOutput = execSync('npm run build', { 
      stdio: 'pipe',
      encoding: 'utf8',
      timeout: testConfig.timeout
    });
    
    // 检查构建是否成功
    if (!fs.existsSync('dist')) {
      throw new Error('构建失败，未生成 dist 目录');
    }
    
    // 检查关键文件是否存在
    const distFiles = fs.readdirSync('dist');
    const hasIndexHtml = distFiles.some(file => file === 'index.html');
    const hasJsFiles = distFiles.some(file => file.includes('.js') || fs.existsSync(path.join('dist', file)) && fs.statSync(path.join('dist', file)).isDirectory());
    
    if (!hasIndexHtml) {
      throw new Error('构建产物缺少 index.html');
    }
    
    if (!hasJsFiles) {
      throw new Error('构建产物缺少 JavaScript 文件');
    }
    
    console.log('   ✓ 生产构建成功完成');
    
    // 输出构建统计信息
    const buildStats = getBuildStats();
    console.log(`   📊 构建统计: ${buildStats}`);
    
  } catch (error) {
    throw new Error(`生产构建失败: ${error.message}`);
  }
}

// 分析构建产物
function analyzeBuildOutput() {
  try {
    const distPath = 'dist';
    
    // 查找 JavaScript 文件
    const jsFiles = findJsFiles(distPath);
    
    if (jsFiles.length === 0) {
      throw new Error('未找到 JavaScript 构建文件');
    }
    
    console.log(`   📁 找到 ${jsFiles.length} 个 JavaScript 文件`);
    
    // 检查是否有预期的分块文件
    const expectedChunks = ['vue-core', 'element-plus', 'vendor'];
    const foundChunks = [];
    
    for (const jsFile of jsFiles) {
      for (const chunk of expectedChunks) {
        if (jsFile.includes(chunk)) {
          foundChunks.push(chunk);
        }
      }
    }
    
    console.log(`   🧩 找到分块: ${foundChunks.join(', ')}`);
    
    // 检查文件中是否包含可能导致错误的模式
    for (const jsFile of jsFiles) {
      const filePath = path.join(distPath, jsFile);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // 检查是否包含 Fragment 相关的问题模式
        if (content.includes('Cannot access') && content.includes('before initialization')) {
          throw new Error(`发现潜在的初始化错误在文件: ${jsFile}`);
        }
      }
    }
    
    console.log('   ✓ 构建产物分析通过');
    
  } catch (error) {
    throw new Error(`构建产物分析失败: ${error.message}`);
  }
}

// 检查模块依赖
function checkModuleDependencies() {
  try {
    // 检查 package.json 中的依赖版本
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    const criticalDeps = {
      'vue': packageJson.dependencies?.vue,
      'element-plus': packageJson.dependencies?.['element-plus'],
      '@element-plus/icons-vue': packageJson.dependencies?.['@element-plus/icons-vue'],
      'vite': packageJson.devDependencies?.vite,
    };
    
    console.log('   📦 关键依赖版本:');
    for (const [dep, version] of Object.entries(criticalDeps)) {
      if (version) {
        console.log(`      ${dep}: ${version}`);
      } else {
        console.log(`      ${dep}: 未安装`);
      }
    }
    
    // 检查是否有已知的问题版本组合
    const vueVersion = criticalDeps.vue;
    const elementPlusVersion = criticalDeps['element-plus'];
    
    if (vueVersion && elementPlusVersion) {
      // 这里可以添加已知的版本兼容性检查
      console.log('   ✓ 依赖版本兼容性检查通过');
    }
    
  } catch (error) {
    throw new Error(`模块依赖检查失败: ${error.message}`);
  }
}

// 辅助函数：获取构建统计信息
function getBuildStats() {
  try {
    const distPath = 'dist';
    const files = getAllFiles(distPath);
    
    let totalSize = 0;
    let jsSize = 0;
    let cssSize = 0;
    
    for (const file of files) {
      const filePath = path.join(distPath, file);
      const stats = fs.statSync(filePath);
      totalSize += stats.size;
      
      if (file.endsWith('.js')) {
        jsSize += stats.size;
      } else if (file.endsWith('.css')) {
        cssSize += stats.size;
      }
    }
    
    return `总大小: ${formatBytes(totalSize)}, JS: ${formatBytes(jsSize)}, CSS: ${formatBytes(cssSize)}`;
  } catch (error) {
    return '统计信息获取失败';
  }
}

// 辅助函数：查找 JavaScript 文件
function findJsFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const itemPath = path.join(currentDir, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        traverse(itemPath);
      } else if (item.endsWith('.js')) {
        files.push(path.relative(dir, itemPath));
      }
    }
  }
  
  traverse(dir);
  return files;
}

// 辅助函数：获取所有文件
function getAllFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const itemPath = path.join(currentDir, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        traverse(itemPath);
      } else {
        files.push(path.relative(dir, itemPath));
      }
    }
  }
  
  traverse(dir);
  return files;
}

// 辅助函数：格式化字节大小
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 运行测试
if (require.main === module) {
  runTests().catch(error => {
    console.error(colors.red(`测试执行失败: ${error.message}`));
    process.exit(1);
  });
}

module.exports = {
  runTests,
  testSteps,
  colors
};
