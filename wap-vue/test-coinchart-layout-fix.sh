#!/bin/bash

echo "🔍 检查CoinChart页面布局优化..."

# 检查CoinChart.vue文件中的关键修改
echo "📋 检查CoinChart.vue中的布局修改:"

# 检查新的HTML结构
if grep -q "price-changes" template/wap-vue/src/views/foreign/CoinChart.vue; then
    echo "✅ 找到price-changes容器"
else
    echo "❌ 未找到price-changes容器"
fi

if grep -q "price-row" template/wap-vue/src/views/foreign/CoinChart.vue; then
    echo "✅ 找到price-row类"
else
    echo "❌ 未找到price-row类"
fi

# 检查CSS样式修改
if grep -q "font-size: 18px" template/wap-vue/src/views/foreign/CoinChart.vue; then
    echo "✅ 找到红色实时价格字体大小调整（18px）"
else
    echo "❌ 未找到红色实时价格字体大小调整"
fi

if grep -q "flex-direction: column" template/wap-vue/src/views/foreign/CoinChart.vue; then
    echo "✅ 找到flex-l改为垂直布局"
else
    echo "❌ 未找到flex-l垂直布局"
fi

if grep -q "justify-content: space-between" template/wap-vue/src/views/foreign/CoinChart.vue; then
    echo "✅ 找到涨跌额和涨跌幅度的左右分布"
else
    echo "❌ 未找到涨跌额和涨跌幅度的左右分布"
fi

if grep -q "align-items: flex-start" template/wap-vue/src/views/foreign/CoinChart.vue; then
    echo "✅ 找到flex-r顶部对齐设置"
else
    echo "❌ 未找到flex-r顶部对齐设置"
fi

# 检查布局结构
echo "📋 检查布局结构:"

# 检查涨跌额和涨跌幅度的位置
if grep -A 5 -B 5 "net-change" template/wap-vue/src/views/foreign/CoinChart.vue | grep -q "price-changes"; then
    echo "✅ 涨跌额已放在price-changes容器内"
else
    echo "❌ 涨跌额未放在price-changes容器内"
fi

if grep -A 5 -B 5 "change-ratio" template/wap-vue/src/views/foreign/CoinChart.vue | grep -q "price-changes"; then
    echo "✅ 涨跌幅度已放在price-changes容器内"
else
    echo "❌ 涨跌幅度未放在price-changes容器内"
fi

echo "🎉 检查完成！"
echo ""
echo "📊 布局优化说明："
echo "1. 红色实时价格字体从24px减小到18px，避免遮挡其他字段"
echo "2. 涨跌额放在红色实时价格下方的左边"
echo "3. 涨跌幅度放在红色实时价格下方的右边"
echo "4. 高与今开对齐，低与今收对齐"
echo "5. 使用flex布局确保垂直对齐"
echo "6. 添加了price-row类统一行高和对齐"
