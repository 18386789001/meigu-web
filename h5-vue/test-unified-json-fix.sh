#!/bin/bash

echo "🧪 测试统一JSON错误修复工具"
echo "================================"

# 检查文件是否存在
if [ -f "src/utils/unifiedJsonErrorFix.js" ]; then
    echo "✅ unifiedJsonErrorFix.js 文件存在"
else
    echo "❌ unifiedJsonErrorFix.js 文件不存在"
    exit 1
fi

# 检查main.js是否正确导入
if grep -q "unifiedJsonErrorFix" src/main.js; then
    echo "✅ main.js 已正确导入 unifiedJsonErrorFix"
else
    echo "❌ main.js 未导入 unifiedJsonErrorFix"
fi

# 检查是否移除了其他冲突的导入
if grep -q "productionErrorFix.*executeAllFixes" src/main.js; then
    echo "⚠️  main.js 仍包含可能冲突的 productionErrorFix 导入"
else
    echo "✅ main.js 已移除冲突的 productionErrorFix 导入"
fi

# 检查统一JSON修复的初始化
if grep -q "autoFixUnifiedJson" src/main.js; then
    echo "✅ main.js 已正确调用 autoFixUnifiedJson"
else
    echo "❌ main.js 未调用 autoFixUnifiedJson"
fi

# 检查isSimpleStringValue函数
if grep -q "isSimpleStringValue" src/utils/unifiedJsonErrorFix.js; then
    echo "✅ unifiedJsonErrorFix.js 包含 isSimpleStringValue 函数"
else
    echo "❌ unifiedJsonErrorFix.js 缺少 isSimpleStringValue 函数"
fi

# 检查语言代码支持
if grep -q "en-US.*zh-CN.*ja-JP" src/utils/unifiedJsonErrorFix.js; then
    echo "✅ unifiedJsonErrorFix.js 支持常见语言代码"
else
    echo "❌ unifiedJsonErrorFix.js 缺少语言代码支持"
fi

echo ""
echo "🎯 统一JSON错误修复工具测试完成"
echo "================================"
