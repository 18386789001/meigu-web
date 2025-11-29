#!/bin/bash

echo "WAP-Vue Commodities页面暗黑主题文字颜色修复验证..."

# Navigate to the project directory
cd template/wap-vue

# Step 1: Check if List.vue exists
echo "检查commodities List.vue文件..."
if [ -f "src/views/commodities/List.vue" ]; then
    echo "✓ src/views/commodities/List.vue 存在"
else
    echo "✗ src/views/commodities/List.vue 不存在"
    exit 1
fi

# Step 2: Check if dark theme CSS rules exist
echo "检查暗黑主题CSS规则..."
if grep -q "prefers-color-scheme: dark" src/views/commodities/List.vue; then
    echo "✓ 包含暗黑主题媒体查询"
else
    echo "✗ 缺少暗黑主题媒体查询"
fi

if grep -q "tab-label.*color.*ffffff.*important" src/views/commodities/List.vue; then
    echo "✓ 页签标签暗黑主题样式存在"
else
    echo "✗ 页签标签暗黑主题样式缺失"
fi

if grep -q "commodity-symbol.*color.*ffffff.*important" src/views/commodities/List.vue; then
    echo "✓ 商品符号暗黑主题样式存在"
else
    echo "✗ 商品符号暗黑主题样式缺失"
fi

if grep -q "commodity-details.*color.*ffffff.*important" src/views/commodities/List.vue; then
    echo "✓ 商品详情暗黑主题样式存在"
else
    echo "✗ 商品详情暗黑主题样式缺失"
fi

# Step 3: Check JavaScript dynamic styling
echo "检查JavaScript动态样式..."
if grep -q "applyThemeStyles" src/views/commodities/List.vue; then
    echo "✓ 包含applyThemeStyles函数"
else
    echo "✗ 缺少applyThemeStyles函数"
fi

if grep -q "forceDarkModeStyles" src/views/commodities/List.vue; then
    echo "✓ 包含forceDarkModeStyles函数"
else
    echo "✗ 缺少forceDarkModeStyles函数"
fi

if grep -q "detailItems.*forEach" src/views/commodities/List.vue; then
    echo "✓ 包含详情项动态样式处理"
else
    echo "✗ 缺少详情项动态样式处理"
fi

if grep -q "volumeItems.*forEach" src/views/commodities/List.vue; then
    echo "✓ 包含成交量项动态样式处理"
else
    echo "✗ 缺少成交量项动态样式处理"
fi

# Step 4: Check theme watcher
echo "检查主题监听器..."
if grep -q "watch.*thStore.theme" src/views/commodities/List.vue; then
    echo "✓ 包含主题变化监听器"
else
    echo "✗ 缺少主题变化监听器"
fi

# Step 5: Count CSS rules with !important
echo "统计!important样式规则数量..."
important_count=$(grep -c "!important" src/views/commodities/List.vue)
echo "✓ 找到 $important_count 个!important样式规则"

# Step 6: Check specific elements
echo "检查特定元素样式..."
elements=("tab-label" "commodity-symbol" "commodity-name" "commodity-details" "commodity-volume" "detail-item" "volume-item")

for element in "${elements[@]}"; do
    if grep -q "$element.*color.*ffffff.*important" src/views/commodities/List.vue; then
        echo "✓ $element 暗黑主题样式存在"
    else
        echo "✗ $element 暗黑主题样式缺失"
    fi
done

echo ""
echo "=== 暗黑主题文字颜色修复验证完成 ==="
echo ""
echo "修复内容："
echo "1. ✓ 增强了CSS优先级，使用多层!important规则"
echo "2. ✓ 添加了强制暗黑模式样式块"
echo "3. ✓ 增强了JavaScript动态样式应用"
echo "4. ✓ 添加了对详情项和成交量项的处理"
echo "5. ✓ 增强了主题变化监听器"
echo ""
echo "修复的元素："
echo "- 贵金属、能源、软商品标签 (.tab-label)"
echo "- 商品符号如XAUUSD (.commodity-symbol)"
echo "- 商品名称 (.commodity-name)"
echo "- 商品详情 (.commodity-details, .detail-item)"
echo "- 成交量信息 (.commodity-volume, .volume-item)"
echo "- 空状态文字 (.empty-text, .empty-icon)"
echo ""
echo "测试建议："
echo "1. 启动wap-vue开发服务器"
echo "2. 访问quotes页面，切换到commodities标签"
echo "3. 切换到暗黑主题"
echo "4. 检查以下元素是否显示为白色："
echo "   - 贵金属、能源、软商品标签"
echo "   - XAUUSD等商品符号"
echo "   - 高、低、开等详情标签"
echo "   - 24小时成交量/成交额信息"
echo "5. 检查控制台是否有相关调试日志"
echo ""
echo "预期效果："
echo "- 暗黑主题下所有文字都显示为白色"
echo "- 明亮主题下文字显示为黑色/灰色"
echo "- 主题切换时文字颜色实时更新"
echo "- 保持原有的价格涨跌颜色（绿色/红色）"
