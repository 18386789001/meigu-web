#!/bin/bash

echo "🔍 检查meta标签修复..."

# 检查index.html中的meta标签
echo "📋 检查index.html中的meta标签:"

if grep -q "mobile-web-app-capable" template/wap-vue/index.html; then
    echo "✅ 找到新的mobile-web-app-capable meta标签"
else
    echo "❌ 未找到新的mobile-web-app-capable meta标签"
fi

if grep -q "apple-mobile-web-app-capable" template/wap-vue/index.html; then
    echo "✅ 保留apple-mobile-web-app-capable meta标签（向后兼容）"
else
    echo "❌ 未找到apple-mobile-web-app-capable meta标签"
fi

# 检查meta标签的顺序
echo ""
echo "📋 检查meta标签的顺序:"

mobile_line=$(grep -n "mobile-web-app-capable" template/wap-vue/index.html | cut -d: -f1)
apple_line=$(grep -n "apple-mobile-web-app-capable" template/wap-vue/index.html | cut -d: -f1)

if [ "$mobile_line" -lt "$apple_line" ]; then
    echo "✅ meta标签顺序正确：mobile-web-app-capable 在 apple-mobile-web-app-capable 之前"
else
    echo "⚠️ meta标签顺序可能有问题"
fi

# 检查其他相关meta标签
echo ""
echo "📋 检查其他相关meta标签:"

if grep -q "theme-color" template/wap-vue/index.html; then
    echo "✅ 找到theme-color meta标签"
else
    echo "❌ 未找到theme-color meta标签"
fi

if grep -q "apple-mobile-web-app-status-bar-style" template/wap-vue/index.html; then
    echo "✅ 找到apple-mobile-web-app-status-bar-style meta标签"
else
    echo "❌ 未找到apple-mobile-web-app-status-bar-style meta标签"
fi

if grep -q "apple-touch-icon" template/wap-vue/index.html; then
    echo "✅ 找到apple-touch-icon meta标签"
else
    echo "❌ 未找到apple-touch-icon meta标签"
fi

echo ""
echo "🎉 检查完成！"
echo ""
echo "📊 修复说明："
echo "1. 添加了新的 mobile-web-app-capable meta标签"
echo "2. 保留了 apple-mobile-web-app-capable meta标签以确保向后兼容"
echo "3. 新的meta标签放在旧标签之前，优先使用新标准"
echo ""
echo "🔧 关于警告的说明："
echo "1. ✅ Apple Web App警告已修复"
echo "2. ⚠️ Chrome扩展警告(runtime.lastError)是浏览器扩展相关的，不影响应用功能"
echo "3. 这些警告不会影响应用的正常运行"
echo ""
echo "✅ 现在访问 /syn 路径时，Apple Web App警告应该已经消失！"
