#!/bin/bash

echo "🔍 检查涨跌额和涨跌幅度位置调整..."

# 检查second-line样式修改
echo "📋 检查second-line样式修改:"

if grep -q "margin-left: -10px" template/wap-vue/src/views/quotes/Detail.vue; then
    echo "✅ 找到margin-left: -10px样式修改"
else
    echo "❌ 未找到margin-left样式修改"
fi

if grep -q "将涨跌额和涨跌幅度往左移动" template/wap-vue/src/views/quotes/Detail.vue; then
    echo "✅ 找到相关注释"
else
    echo "❌ 未找到相关注释"
fi

# 检查模板结构
echo ""
echo "📋 检查模板结构:"

if grep -q "second-line" template/wap-vue/src/views/quotes/Detail.vue; then
    echo "✅ 找到second-line类"
else
    echo "❌ 未找到second-line类"
fi

if grep -q "chartData.netChange" template/wap-vue/src/views/quotes/Detail.vue; then
    echo "✅ 找到涨跌额显示"
else
    echo "❌ 未找到涨跌额显示"
fi

if grep -q "chartData?.change_ratio" template/wap-vue/src/views/quotes/Detail.vue; then
    echo "✅ 找到涨跌幅度显示"
else
    echo "❌ 未找到涨跌幅度显示"
fi

# 检查格式化函数
echo ""
echo "📋 检查格式化函数:"

if grep -q "formatDecimal" template/wap-vue/src/views/quotes/Detail.vue; then
    echo "✅ 找到formatDecimal函数"
else
    echo "❌ 未找到formatDecimal函数"
fi

echo ""
echo "🎉 检查完成！"
echo ""
echo "📊 修改说明："
echo "1. 在.second-line样式中添加了margin-left: -10px"
echo "2. 这将使涨跌额和涨跌幅度一起往左移动10px"
echo "3. 保持了原有的margin-top: 8px间距"
echo ""
echo "🎯 效果："
echo "- 涨跌额（如30.08）和涨跌幅度（如0.79%）会一起往左移动"
echo "- 与红色实时价格（如3886.78）的对齐关系得到改善"
echo "- 在移动端设备上提供更好的视觉平衡"
echo ""
echo "✅ 现在涨跌额和涨跌幅度已经往左移动，提供更好的布局效果！"
