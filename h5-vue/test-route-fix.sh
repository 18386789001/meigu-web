#!/bin/bash

# 测试路由修复
echo "=== 测试 h5-vue 路由修复 ==="

# 检查路由文件
echo "1. 检查路由配置文件..."
if [ -f "src/router/index.js" ]; then
    echo "✓ 路由配置文件存在"
else
    echo "✗ 路由配置文件不存在"
    exit 1
fi

# 检查About路由路径
echo ""
echo "2. 检查About路由路径..."
if grep -q "@/views/About.vue" src/router/index.js; then
    echo "✓ About路由路径已修复为 @/views/About.vue"
else
    echo "✗ About路由路径未修复"
fi

# 检查是否还有旧的路径引用
if grep -q "@/views/about/About.vue" src/router/index.js; then
    echo "✗ 仍存在旧路径引用 @/views/about/About.vue"
else
    echo "✓ 已移除旧路径引用"
fi

# 检查子路由是否已移除
echo ""
echo "3. 检查子路由清理..."
section_routes=("AboutSection1" "AboutSection2" "AboutSection3" "AboutSection4" "AboutSection5" "AboutSection6" "AboutSection7" "AboutSection8" "AboutSection9")
for route in "${section_routes[@]}"; do
    if grep -q "$route" src/router/index.js; then
        echo "✗ 仍存在子路由 $route"
    else
        echo "✓ 已移除子路由 $route"
    fi
done

# 检查validRoutes数组
echo ""
echo "4. 检查validRoutes数组..."
if grep -q "/about/section" src/router/index.js; then
    echo "✗ validRoutes中仍包含子路由"
else
    echo "✓ validRoutes已清理子路由"
fi

# 检查About.vue文件位置
echo ""
echo "5. 检查About.vue文件位置..."
if [ -f "src/views/About.vue" ]; then
    echo "✓ About.vue文件在正确位置 src/views/About.vue"
else
    echo "✗ About.vue文件不在预期位置"
fi

if [ -f "src/views/about/About.vue" ]; then
    echo "✗ 旧位置仍存在About.vue文件"
else
    echo "✓ 旧位置文件已清理"
fi

# 检查其他文件中的路由引用
echo ""
echo "6. 检查其他文件中的路由引用..."
if grep -r "about/About" src/ --exclude-dir=node_modules | grep -v "test-" | grep -v ".sh$"; then
    echo "✗ 其他文件中仍存在旧路径引用"
else
    echo "✓ 其他文件中无旧路径引用"
fi

# 检查goToAbout函数
echo ""
echo "7. 检查goToAbout函数..."
if grep -q "router.push('/about')" src/views/More.vue; then
    echo "✓ More.vue中goToAbout函数使用正确路径"
else
    echo "✗ More.vue中goToAbout函数路径不正确"
fi

if grep -q "router.push('/about')" src/views/Home.vue; then
    echo "✓ Home.vue中goToAbout函数使用正确路径"
else
    echo "✗ Home.vue中goToAbout函数路径不正确"
fi

echo ""
echo "=== 路由修复测试完成 ==="
echo ""
echo "修复内容："
echo "• ✅ 更新About路由路径从 @/views/about/About.vue 到 @/views/About.vue"
echo "• ✅ 移除所有子路由（section1-section9）"
echo "• ✅ 清理validRoutes数组中的子路由引用"
echo "• ✅ 保持goToAbout函数使用正确的路由路径"
echo ""
echo "预期结果："
echo "• 🎯 路由导航不再出现 'Failed to fetch dynamically imported module' 错误"
echo "• 🎯 About页面可以正常加载和显示"
echo "• 🎯 白皮书内容完整显示在单个页面中"
echo "• 🎯 支持中英文切换"
echo "• 🎯 支持移动端适配和暗黑模式"
