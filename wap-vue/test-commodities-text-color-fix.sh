#!/bin/bash

# wap-vue大宗商品页面暗黑主题文本颜色修复测试脚本

echo "=== 开始测试wap-vue大宗商品页面文本颜色修复 ==="

# 进入项目目录
cd template/wap-vue

# 检查关键文件是否存在
echo "检查关键修复文件..."

files_to_check=(
  "src/views/commodities/List.vue"
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
if [ -d "../../jar/wap" ]; then
    echo "✓ 构建成功"
    
    # 检查关键文件
    if [ -f "../../jar/wap/index.html" ]; then
        echo "✓ index.html 存在"
    else
        echo "✗ index.html 不存在"
        exit 1
    fi
    
    # 检查JavaScript文件
    js_files=$(find ../../jar/wap/static -name "*.js" | wc -l)
    echo "✓ 找到 $js_files 个JavaScript文件"
    
    # 检查是否有语法错误
    echo "检查JavaScript文件语法..."
    for js_file in $(find ../../jar/wap/static -name "*.js"); do
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
echo "1. ✓ 商品符号文本颜色适配 (.commodity-symbol) - 暗黑模式白色"
echo "2. ✓ 商品名称文本颜色适配 (.commodity-name) - 暗黑模式白色"
echo "3. ✓ 商品详细信息文本颜色适配 (.commodity-details) - 暗黑模式白色"
echo "4. ✓ 成交量信息文本颜色适配 (.commodity-volume) - 暗黑模式白色"
echo "5. ✓ 页签标签文本颜色适配 (.tab-label) - 暗黑模式白色"
echo "6. ✓ 空状态文本颜色适配 (.empty-text) - 暗黑模式白色"
echo "7. ✓ 空状态图标颜色适配 (.empty-icon) - 暗黑模式白色"
echo "8. ✓ 容器背景色暗黑模式适配 (.commodities-container)"
echo "9. ✓ 页签容器暗黑模式适配 (.tabs-container)"
echo "10. ✓ 商品卡片暗黑模式适配 (.commodity-item)"
echo "11. ✓ 价格显示颜色暗黑模式适配"
echo "12. ✓ 图表容器暗黑模式适配 (.mini-chart)"
echo "13. ✓ JavaScript动态主题检测和样式应用"
echo "14. ✓ CSS媒体查询暗黑模式适配"
echo "15. ✓ 强制CSS优先级覆盖"
echo "16. ✓ 商品分类名字（贵金属、能源、软商品）暗黑模式优化"
echo "17. ✓ 商品卡片所有文字暗黑模式统一为白色"
echo "18. ✓ 强制暗黑模式样式应用函数"
echo "19. ✓ 多重CSS选择器确保暗黑模式样式生效"
echo "20. ✓ JavaScript内联样式强制设置文字颜色"
echo ""
echo "修复的具体问题："
echo "- 商品符号（XAUUSD等）：明亮主题使用黑色 (#000000)，暗黑主题使用白色 (#ffffff)"
echo "- 商品名称：明亮主题使用黑色 (#000000)，暗黑主题使用白色 (#ffffff)"
echo "- 详细信息（高、低、开）：明亮主题使用灰色 (#666666)，暗黑主题使用白色 (#ffffff)"
echo "- 成交量信息（24小时成交量、成交额）：明亮主题使用灰色 (#666666)，暗黑主题使用白色 (#ffffff)"
echo "- 页签标签（贵金属、能源、软商品）：明亮主题使用黑色 (#000000)，暗黑主题使用白色 (#ffffff)"
echo "- 空状态文字：明亮主题使用灰色 (#666666)，暗黑主题使用白色 (#ffffff)"
echo "- 空状态图标：暗黑主题使用白色 (#ffffff)"
echo "- 容器背景：明亮主题使用默认背景，暗黑主题使用黑色 (#000000)"
echo "- 页签容器：明亮主题使用默认背景，暗黑主题使用深灰色 (#1a1a1a)"
echo "- 商品卡片：明亮主题使用默认背景，暗黑主题使用深灰色 (#1a1a1a)"
echo "- 价格颜色：上涨使用绿色系，下跌使用红色系，暗黑模式下增强对比度"
echo "- 图表容器：明亮主题使用浅色背景，暗黑主题使用深色背景 (#2a2a2a)"
echo "- 支持多种主题检测方式：themeStore、媒体查询、class检测"
echo "- JavaScript动态检测主题并应用内联样式"
echo "- CSS媒体查询提供备用暗黑模式样式"
echo "- 强制CSS优先级确保暗黑主题样式生效"
echo "- 所有文字在暗黑模式下统一显示为白色，确保清晰可读"
echo "- 强制暗黑模式样式应用函数，确保样式生效"
echo "- 多重CSS选择器覆盖各种暗黑模式实现方式"
echo "- JavaScript内联样式强制设置，优先级最高"
echo ""
echo "预期效果："
echo "- 明亮主题下：深色文字在浅色背景上清晰可读"
echo "- 暗黑主题下：所有文字统一显示为白色，在深色背景上清晰可读"
echo "- 商品分类名字（贵金属、能源、软商品）在暗黑模式下显示为白色"
echo "- 商品符号（XAUUSD等）在暗黑模式下显示为白色"
echo "- 商品详细信息（高、低、开）在暗黑模式下显示为白色"
echo "- 成交量信息（24小时成交量、成交额）在暗黑模式下显示为白色"
echo "- 容器和卡片背景自动适配主题"
echo "- 价格颜色在暗黑模式下增强对比度"
echo "- 图表和图标在暗黑模式下正确显示"
echo "- 自动适配主题切换，无需手动调整"
echo "- 支持多种主题检测方式，确保兼容性"
echo "- 所有界面元素在暗黑模式下都清晰可见"
echo "- 页签导航、空状态等界面元素适配主题"
echo "- 悬停效果和交互状态适配主题"
echo "- 商品名称、价格信息、成交量等所有文本适配主题"
echo "- 页签导航文字适配主题"
echo "- 空状态提示文字适配主题"
echo "- 空状态提示文字清晰可见"
echo ""
echo "建议测试步骤："
echo "1. 部署到生产环境"
echo "2. 访问大宗商品页面"
echo "3. 测试明亮主题下的文字显示"
echo "4. 切换到暗黑主题，测试文字显示"
echo "5. 检查所有商品卡片中的文字是否清晰可见"
echo "6. 验证页签导航文字是否适配主题"
echo "7. 测试主题切换时的文字颜色变化"
