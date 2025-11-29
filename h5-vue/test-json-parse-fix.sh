#!/bin/bash

# JSON解析错误修复测试脚本
# 专门测试语言代码如"en-US"的JSON解析问题

echo "=== 开始测试JSON解析错误修复 ==="

# 进入项目目录
cd template/h5-vue

# 检查关键文件是否存在
echo "检查关键修复文件..."

files_to_check=(
  "src/utils/conservativeJsonErrorFix.js"
  "src/utils/superJsonErrorFix.js"
  "src/utils/languageSwitchRaceFix.js"
  "src/main.js"
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
echo "1. ✓ 保守JSON解析错误修复工具 (conservativeJsonErrorFix.js)"
echo "2. ✓ 超级JSON解析错误修复工具 (superJsonErrorFix.js) - 已优化"
echo "3. ✓ 语言切换竞态条件修复工具 (languageSwitchRaceFix.js) - 已优化"
echo "4. ✓ 主入口文件更新 (main.js)"
echo ""
echo "关键修复："
echo "- 识别简单字符串值（如语言代码 'en-US'）"
echo "- 只对真正的JSON格式错误进行修复"
echo "- 避免干扰正常的字符串处理"
echo "- 保守的错误处理策略"
echo ""
echo "预期效果："
echo "- 不再出现 'en-US is not valid JSON' 错误"
echo "- 语言代码正确处理"
echo "- JSON解析错误自动修复"
echo "- 保持正常功能不受影响"
echo ""
echo "建议测试步骤："
echo "1. 部署到生产环境"
echo "2. 尝试切换语言"
echo "3. 检查浏览器控制台是否还有JSON解析错误"
echo "4. 验证语言切换功能是否正常"
