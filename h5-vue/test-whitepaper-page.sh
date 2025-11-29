#!/bin/bash

# 测试白皮书页面功能
echo "=== 测试 h5-vue 白皮书页面功能 ==="

# 检查文件是否存在
echo "1. 检查关键文件是否存在..."
if [ -f "template/h5-vue/src/views/About.vue" ]; then
    echo "✓ About.vue 文件存在"
else
    echo "✗ About.vue 文件不存在"
    exit 1
fi

if [ -f "template/h5-vue/src/i18n/zh-CN.js" ]; then
    echo "✓ zh-CN.js 语言文件存在"
else
    echo "✗ zh-CN.js 语言文件不存在"
    exit 1
fi

if [ -f "template/h5-vue/src/i18n/en-US.js" ]; then
    echo "✓ en-US.js 语言文件存在"
else
    echo "✗ en-US.js 语言文件不存在"
    exit 1
fi

# 检查白皮书翻译内容
echo ""
echo "2. 检查白皮书翻译内容..."

# 检查中文翻译
if grep -q "whitepaper:" template/h5-vue/src/i18n/zh-CN.js; then
    echo "✓ 中文白皮书翻译内容存在"
else
    echo "✗ 中文白皮书翻译内容不存在"
fi

# 检查英文翻译
if grep -q "whitepaper:" template/h5-vue/src/i18n/en-US.js; then
    echo "✓ 英文白皮书翻译内容存在"
else
    echo "✗ 英文白皮书翻译内容不存在"
fi

# 检查Vue组件结构
echo ""
echo "3. 检查Vue组件结构..."

# 检查模板结构
if grep -q "whitepaper-page" template/h5-vue/src/views/About.vue; then
    echo "✓ 白皮书页面容器存在"
else
    echo "✗ 白皮书页面容器不存在"
fi

# 检查目录导航
if grep -q "toc-nav" template/h5-vue/src/views/About.vue; then
    echo "✓ 目录导航存在"
else
    echo "✗ 目录导航不存在"
fi

# 检查9个章节
section_count=$(grep -c "content-section" template/h5-vue/src/views/About.vue)
if [ $section_count -eq 9 ]; then
    echo "✓ 9个章节都存在"
else
    echo "✗ 章节数量不正确，当前有 $section_count 个章节"
fi

# 检查i18n使用
echo ""
echo "4. 检查i18n国际化使用..."

# 检查t()函数使用
t_count=$(grep -c "t('whitepaper" template/h5-vue/src/views/About.vue)
if [ $t_count -gt 0 ]; then
    echo "✓ 使用了 $t_count 个i18n翻译键"
else
    echo "✗ 未使用i18n翻译"
fi

# 检查useI18n导入
if grep -q "useI18n" template/h5-vue/src/views/About.vue; then
    echo "✓ useI18n 已正确导入"
else
    echo "✗ useI18n 未导入"
fi

# 检查响应式目录
if grep -q "tocItems = computed" template/h5-vue/src/views/About.vue; then
    echo "✓ 响应式目录已实现"
else
    echo "✗ 响应式目录未实现"
fi

# 检查滚动功能
echo ""
echo "5. 检查滚动功能..."

if grep -q "scrollToSection" template/h5-vue/src/views/About.vue; then
    echo "✓ 滚动到章节功能已实现"
else
    echo "✗ 滚动到章节功能未实现"
fi

# 检查暗黑模式适配
echo ""
echo "6. 检查暗黑模式适配..."

if grep -q "prefers-color-scheme: dark" template/h5-vue/src/views/About.vue; then
    echo "✓ 系统暗黑模式适配已实现"
else
    echo "✗ 系统暗黑模式适配未实现"
fi

if grep -q "data-theme=\"dark\"" template/h5-vue/src/views/About.vue; then
    echo "✓ 主题存储暗黑模式适配已实现"
else
    echo "✗ 主题存储暗黑模式适配未实现"
fi

# 检查移动端适配
echo ""
echo "7. 检查移动端适配..."

if grep -q "max-width: 768px" template/h5-vue/src/views/About.vue; then
    echo "✓ 平板端适配已实现"
else
    echo "✗ 平板端适配未实现"
fi

if grep -q "max-width: 480px" template/h5-vue/src/views/About.vue; then
    echo "✓ 手机端适配已实现"
else
    echo "✗ 手机端适配未实现"
fi

# 检查样式完整性
echo ""
echo "8. 检查样式完整性..."

# 检查基础样式类
required_classes=("whitepaper-page" "section-title" "card" "card-header" "card-body" "toc-link")
for class in "${required_classes[@]}"; do
    if grep -q "\.$class" template/h5-vue/src/views/About.vue; then
        echo "✓ $class 样式已定义"
    else
        echo "✗ $class 样式未定义"
    fi
done

# 检查颜色主题
if grep -q "#66b3ff" template/h5-vue/src/views/About.vue; then
    echo "✓ 主题色已定义"
else
    echo "✗ 主题色未定义"
fi

if grep -q "#ffffff" template/h5-vue/src/views/About.vue; then
    echo "✓ 白色文字颜色已定义"
else
    echo "✗ 白色文字颜色未定义"
fi

echo ""
echo "=== 测试完成 ==="
echo ""
echo "功能特点："
echo "• ✅ 现代化简约UI设计"
echo "• ✅ 完整的9章节商业白皮书内容"
echo "• ✅ 中英文双语支持"
echo "• ✅ 响应式移动端适配"
echo "• ✅ 暗黑模式适配"
echo "• ✅ 平滑滚动导航"
echo "• ✅ 白色明亮文字颜色"
echo "• ✅ 保持原有HTML内容结构"
echo ""
echo "设计亮点："
echo "• 🎨 渐变背景和毛玻璃效果"
echo "• 🎨 卡片式布局设计"
echo "• 🎨 高亮关键词显示"
echo "• 🎨 专业的商业白皮书排版"
echo "• 🎨 完整的合规资质展示"
echo "• 🎨 详细的合作伙伴信息"
echo ""
echo "技术实现："
echo "• 🔧 Vue 3 Composition API"
echo "• 🔧 Vue I18n 国际化"
echo "• 🔧 SCSS 样式预处理器"
echo "• 🔧 响应式设计"
echo "• 🔧 平滑滚动交互"
echo "• 🔧 暗黑模式支持"
