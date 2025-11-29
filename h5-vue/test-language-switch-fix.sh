#!/bin/bash

# 语言切换错误修复测试脚本
# 用于测试h5-vue生产环境中的语言切换JSON解析错误修复

echo "=== 开始测试语言切换错误修复 ==="

# 进入项目目录
cd template/h5-vue

# 检查关键文件是否存在
echo "检查关键修复文件..."

files_to_check=(
  "src/utils/productionErrorFix.js"
  "src/utils/aboutPageErrorFix.js"
  "src/utils/languageSwitchErrorFix.js"
  "src/utils/enhancedErrorHandling.js"
  "src/utils/languageSwitchRaceFix.js"
  "src/utils/superJsonErrorFix.js"
  "src/main.js"
  "src/App.vue"
  "src/views/About.vue"
)

for file in "${files_to_check[@]}"; do
  if [ -f "$file" ]; then
    echo "✓ $file 存在"
  else
    echo "✗ $file 不存在"
    exit 1
  fi
done

# 检查语法错误
echo "检查语法错误..."
npm run lint:fix

# 构建项目
echo "构建项目..."
npm run build

# 检查构建结果
if [ -d "../../jar/h5" ]; then
    echo "✓ 构建成功"
    
    # 检查关键文件
    if [ -f "../../jar/h5/index.html" ]; then
        echo "✓ index.html 存在"
    else
        echo "✗ index.html 不存在"
        exit 1
    fi
    
    # 检查JavaScript文件
    js_files=$(find ../../jar/h5/static -name "*.js" | wc -l)
    echo "✓ 找到 $js_files 个JavaScript文件"
    
    # 检查是否有语法错误
    echo "检查JavaScript文件语法..."
    for js_file in $(find ../../jar/h5/static -name "*.js"); do
        if ! node -c "$js_file" 2>/dev/null; then
            echo "✗ 发现语法错误: $js_file"
            exit 1
        fi
    done
    echo "✓ 所有JavaScript文件语法正确"
    
else
    echo "✗ 构建失败"
    exit 1
fi

echo "=== 测试完成 ==="
echo ""
echo "修复内容总结："
echo "1. ✓ 生产环境错误修复工具 (productionErrorFix.js)"
echo "2. ✓ About页面专用修复工具 (aboutPageErrorFix.js)"
echo "3. ✓ 语言切换错误修复工具 (languageSwitchErrorFix.js)"
echo "4. ✓ 增强错误处理机制 (enhancedErrorHandling.js)"
echo "5. ✓ 语言切换竞态条件修复工具 (languageSwitchRaceFix.js)"
echo "6. ✓ 超级JSON解析错误修复工具 (superJsonErrorFix.js)"
echo "7. ✓ 主入口文件更新 (main.js)"
echo "8. ✓ App.vue语言切换更新"
echo "9. ✓ About.vue错误处理更新"
echo ""
echo "预期效果："
echo "- 语言切换时不再出现 'SyntaxError: Invalid linked format' 错误"
echo "- About页面能够正常加载"
echo "- JSON解析错误自动修复"
echo "- localStorage数据自动清理"
echo "- 错误监听和自动修复"
echo ""
echo "建议测试步骤："
echo "1. 部署到生产环境"
echo "2. 访问 About 页面"
echo "3. 尝试切换语言（特别是切换到日语）"
echo "4. 检查浏览器控制台是否还有错误"
echo "5. 验证页面功能是否正常"
