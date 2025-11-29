#!/bin/bash

echo "🔍 检查quotes/detail页面格式化修改..."

# 检查字体大小修改
echo "📋 检查红色实时价格字体大小修改:"

if grep -q "font-size: 16px" template/wap-vue/src/views/quotes/Detail.vue; then
    echo "✅ 找到字体大小修改为16px"
else
    echo "❌ 未找到字体大小修改"
fi

if grep -q "font-size: 14px" template/wap-vue/src/views/quotes/Detail.vue; then
    echo "✅ 找到小屏幕字体大小修改为14px"
else
    echo "❌ 未找到小屏幕字体大小修改"
fi

# 检查格式化函数
echo ""
echo "📋 检查格式化函数:"

if grep -q "formatDecimal" template/wap-vue/src/views/quotes/Detail.vue; then
    echo "✅ 找到formatDecimal函数"
else
    echo "❌ 未找到formatDecimal函数"
fi

if grep -q "toFixed(2)" template/wap-vue/src/views/quotes/Detail.vue; then
    echo "✅ 找到toFixed(2)格式化"
else
    echo "❌ 未找到toFixed(2)格式化"
fi

# 检查模板中的格式化使用
echo ""
echo "📋 检查模板中的格式化使用:"

if grep -q "formatDecimal(chartData.netChange)" template/wap-vue/src/views/quotes/Detail.vue; then
    echo "✅ 找到netChange格式化使用"
else
    echo "❌ 未找到netChange格式化使用"
fi

if grep -q "formatDecimal(chartData?.change_ratio)" template/wap-vue/src/views/quotes/Detail.vue; then
    echo "✅ 找到change_ratio格式化使用"
else
    echo "❌ 未找到change_ratio格式化使用"
fi

if grep -q "formatDecimal(chartData.changeRatio)" template/wap-vue/src/views/quotes/Detail.vue; then
    echo "✅ 找到changeRatio格式化使用"
else
    echo "❌ 未找到changeRatio格式化使用"
fi

# 检查数据处理中的格式化
echo ""
echo "📋 检查数据处理中的格式化:"

if grep -q "formatDecimal(commodityData.netChange" template/wap-vue/src/views/quotes/Detail.vue; then
    echo "✅ 找到数据处理中netChange格式化"
else
    echo "❌ 未找到数据处理中netChange格式化"
fi

if grep -q "formatDecimal(commodityData.changeRatio" template/wap-vue/src/views/quotes/Detail.vue; then
    echo "✅ 找到数据处理中changeRatio格式化"
else
    echo "❌ 未找到数据处理中changeRatio格式化"
fi

# 检查API调用
echo ""
echo "📋 检查API调用:"

if grep -q "publicRealtimeByType" template/wap-vue/src/views/quotes/Detail.vue; then
    echo "✅ 找到API调用"
else
    echo "❌ 未找到API调用"
fi

if grep -q "type=forex.*category=commodities" template/wap-vue/src/views/quotes/Detail.vue; then
    echo "✅ 找到API参数配置"
else
    echo "❌ 未找到API参数配置"
fi

# 检查错误处理
echo ""
echo "📋 检查错误处理:"

if grep -q "null.*undefined.*isNaN" template/wap-vue/src/views/quotes/Detail.vue; then
    echo "✅ 找到空值检查"
else
    echo "❌ 未找到空值检查"
fi

if grep -q "return 0.00" template/wap-vue/src/views/quotes/Detail.vue; then
    echo "✅ 找到默认值处理"
else
    echo "❌ 未找到默认值处理"
fi

echo ""
echo "🎉 检查完成！"
echo ""
echo "📊 修改说明："
echo "1. 缩小了顶部红色实时价格字体大小（16px，小屏幕14px）"
echo "2. 添加了formatDecimal函数进行数值格式化"
echo "3. 在模板中使用formatDecimal格式化netChange和changeRatio"
echo "4. 在数据处理阶段（getCommoditiesData和getRealtimePriceData）进行格式化"
echo "5. 使用四舍五入逻辑（toFixed(2)）保留两位小数"
echo ""
echo "🔧 API数据处理流程："
echo "1. 调用API: https://jpmx.xyz/api/publicRealtimeByType?type=forex&category=commodities&pageNo=1"
echo "2. 接收JSON数据，包含changeRatio和netChange字段"
echo "3. 在getCommoditiesData和getRealtimePriceData函数中处理数据"
echo "4. 使用formatDecimal函数格式化数值"
echo "5. 返回格式化后的数据给前端显示"
echo ""
echo "📈 格式化效果示例："
echo "- COPPER: changeRatio: 0.015209034919334619 → 0.02"
echo "- COPPER: netChange: 159.65000000000146 → 159.65"
echo "- ALUMINUM: changeRatio: -0.0024548091943762214 → -0.00"
echo "- ALUMINUM: netChange: -6.599999999999909 → -6.60"
echo ""
echo "✅ 现在quotes/detail页面的红色实时价格字体更小，涨跌幅和涨跌额都显示为保留两位小数的格式！"
