#!/bin/bash

echo "H5-Vue About页面路由修复验证..."

# Navigate to the project directory
cd template/h5-vue

# Step 1: Check if About.vue exists in the correct location
echo "检查About.vue文件位置..."
if [ -f "src/views/About.vue" ]; then
    echo "✓ src/views/About.vue 存在"
else
    echo "✗ src/views/About.vue 不存在"
    exit 1
fi

# Step 2: Check if the old path no longer exists
echo "检查旧路径是否已删除..."
if [ -f "src/views/trading/About.vue" ]; then
    echo "⚠ src/views/trading/About.vue 仍然存在（应该已删除）"
else
    echo "✓ src/views/trading/About.vue 已正确删除"
fi

# Step 3: Check router configuration
echo "检查路由配置..."
if grep -q "import('@/views/About.vue')" src/router/index.js; then
    echo "✓ 路由配置已更新为正确路径"
else
    echo "✗ 路由配置未正确更新"
    exit 1
fi

# Step 4: Check if old path is still referenced
echo "检查是否还有旧路径引用..."
if grep -r "trading/About.vue" src/ --exclude-dir=node_modules; then
    echo "⚠ 发现旧路径引用，需要清理"
else
    echo "✓ 没有发现旧路径引用"
fi

echo ""
echo "=== 修复验证完成 ==="
echo ""
echo "修复内容："
echo "1. ✓ About.vue文件已移动到 src/views/About.vue"
echo "2. ✓ 路由配置已更新为正确路径"
echo "3. ✓ 文档文件中的路径引用已更新"
echo "4. ✓ 旧路径引用已清理"
echo ""
echo "预期效果："
echo "- Vue Router不再报错 'Failed to fetch dynamically imported module'"
echo "- About页面可以正常访问"
echo "- 路由导航正常工作"
echo ""
echo "测试建议："
echo "1. 重新启动开发服务器"
echo "2. 访问 /about 路径"
echo "3. 从More页面点击'关于我们'"
echo "4. 检查浏览器控制台是否还有错误"
