#!/bin/bash

echo "🔍 检查CoinChart页面价格格式化和布局调整..."

# 检查CoinChart.vue文件中的关键修改
echo "📋 检查CoinChart.vue中的价格格式化修改:"

# 检查priceFormat函数修改
if grep -q "toFixed(2)" template/wap-vue/src/views/foreign/CoinChart.vue; then
    echo "✅ 找到价格格式化改为两位小数"
else
    echo "❌ 未找到价格格式化改为两位小数"
fi

# 检查新增的格式化函数
if grep -q "netChangeFormat" template/wap-vue/src/views/foreign/CoinChart.vue; then
    echo "✅ 找到涨跌额格式化函数"
else
    echo "❌ 未找到涨跌额格式化函数"
fi

if grep -q "changeRatioFormat" template/wap-vue/src/views/foreign/CoinChart.vue; then
    echo "✅ 找到涨跌幅度格式化函数"
else
    echo "❌ 未找到涨跌幅度格式化函数"
fi

# 检查模板中的格式化函数调用
if grep -q "netChangeFormat(realtimeData" template/wap-vue/src/views/foreign/CoinChart.vue; then
    echo "✅ 找到涨跌额格式化函数调用"
else
    echo "❌ 未找到涨跌额格式化函数调用"
fi

if grep -q "changeRatioFormat(realtimeData" template/wap-vue/src/views/foreign/CoinChart.vue; then
    echo "✅ 找到涨跌幅度格式化函数调用"
else
    echo "❌ 未找到涨跌幅度格式化函数调用"
fi

# 检查CSS布局调整
if grep -q "justify-content: flex-start" template/wap-vue/src/views/foreign/CoinChart.vue; then
    echo "✅ 找到price-changes改为左对齐"
else
    echo "❌ 未找到price-changes左对齐"
fi

if grep -q "gap: 8px" template/wap-vue/src/views/foreign/CoinChart.vue; then
    echo "✅ 找到涨跌额和涨跌幅度间距缩短为8px"
else
    echo "❌ 未找到涨跌额和涨跌幅度间距缩短"
fi

if grep -q "text-align: left" template/wap-vue/src/views/foreign/CoinChart.vue; then
    echo "✅ 找到涨跌幅度改为左对齐"
else
    echo "❌ 未找到涨跌幅度左对齐"
fi

echo "🎉 检查完成！"
echo ""
echo "📊 修改说明："
echo "1. 所有价格数据保留两位小数，去掉多余的0"
echo "2. 涨跌额和涨跌幅度都使用格式化函数"
echo "3. 涨跌幅度往左边移动，与涨跌额间距缩短为8px"
echo "4. 涨跌幅度改为左对齐，不再右对齐"
echo "5. 价格显示更加简洁美观"
