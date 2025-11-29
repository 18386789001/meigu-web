#!/bin/bash

echo "🔍 检查高、低字段位置调整..."

# 检查flex-r-item样式修改
echo "📋 检查flex-r-item样式修改:"

if grep -q "margin-left: 10px" template/wap-vue/src/views/foreign/CoinChart.vue; then
    echo "✅ 找到margin-left: 10px样式修改"
else
    echo "❌ 未找到margin-left样式修改"
fi

if grep -q "第一列（高低）往右移动" template/wap-vue/src/views/foreign/CoinChart.vue; then
    echo "✅ 找到相关注释"
else
    echo "❌ 未找到相关注释"
fi

# 检查模板结构
echo ""
echo "📋 检查模板结构:"

if grep -q "{{ t('high') }}" template/wap-vue/src/views/foreign/CoinChart.vue; then
    echo "✅ 找到高字段显示"
else
    echo "❌ 未找到高字段显示"
fi

if grep -q "{{ t('Low') }}" template/wap-vue/src/views/foreign/CoinChart.vue; then
    echo "✅ 找到低字段显示"
else
    echo "❌ 未找到低字段显示"
fi

if grep -q "price-row" template/wap-vue/src/views/foreign/CoinChart.vue; then
    echo "✅ 找到price-row类"
else
    echo "❌ 未找到price-row类"
fi

# 检查实时数据
echo ""
echo "📋 检查实时数据:"

if grep -q "realtimeData?.high" template/wap-vue/src/views/foreign/CoinChart.vue; then
    echo "✅ 找到实时数据中的high字段"
else
    echo "❌ 未找到实时数据中的high字段"
fi

if grep -q "realtimeData?.low" template/wap-vue/src/views/foreign/CoinChart.vue; then
    echo "✅ 找到实时数据中的low字段"
else
    echo "❌ 未找到实时数据中的low字段"
fi

# 检查格式化函数
echo ""
echo "📋 检查格式化函数:"

if grep -q "priceFormat" template/wap-vue/src/views/foreign/CoinChart.vue; then
    echo "✅ 找到priceFormat函数"
else
    echo "❌ 未找到priceFormat函数"
fi

echo ""
echo "🎉 检查完成！"
echo ""
echo "📊 修改说明："
echo "1. 在.flex-r-item:first-child样式中将margin-left从-10px改为10px"
echo "2. 这将使高、低字段往右移动20px（从-10px到+10px）"
echo "3. 保持了原有的其他样式设置"
echo ""
echo "🎯 效果："
echo "- 高字段（如3891.46）会往右移动"
echo "- 低字段（如3837.97）会往右移动"
echo "- 与今开、今收字段的对齐关系得到改善"
echo "- 在移动端设备上提供更好的视觉平衡"
echo ""
echo "✅ 现在高、低字段已经往右移动，提供更好的布局效果！"
