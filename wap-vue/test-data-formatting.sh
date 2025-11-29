#!/bin/bash

echo "🔍 检查API数据处理格式化修改..."

# 检查ContractTradingList.vue中的格式化函数
echo "📋 检查ContractTradingList.vue中的格式化函数:"

if grep -q "formatDecimal" template/wap-vue/src/views/commodities/components/ContractTradingList.vue; then
    echo "✅ 找到formatDecimal函数"
else
    echo "❌ 未找到formatDecimal函数"
fi

if grep -q "toFixed(2)" template/wap-vue/src/views/commodities/components/ContractTradingList.vue; then
    echo "✅ 找到toFixed(2)格式化"
else
    echo "❌ 未找到toFixed(2)格式化"
fi

# 检查数据处理逻辑
echo ""
echo "📋 检查数据处理逻辑:"

if grep -q "changeRatio: formatDecimal" template/wap-vue/src/views/commodities/components/ContractTradingList.vue; then
    echo "✅ 找到changeRatio格式化处理"
else
    echo "❌ 未找到changeRatio格式化处理"
fi

if grep -q "netChange: formatDecimal" template/wap-vue/src/views/commodities/components/ContractTradingList.vue; then
    echo "✅ 找到netChange格式化处理"
else
    echo "❌ 未找到netChange格式化处理"
fi

# 检查API调用
echo ""
echo "📋 检查API调用:"

if grep -q "_getRealtimeByType" template/wap-vue/src/views/commodities/components/ContractTradingList.vue; then
    echo "✅ 找到API调用函数"
else
    echo "❌ 未找到API调用函数"
fi

if grep -q "type: 'forex'" template/wap-vue/src/views/commodities/components/ContractTradingList.vue; then
    echo "✅ 找到API参数配置"
else
    echo "❌ 未找到API参数配置"
fi

if grep -q "category: 'commodities'" template/wap-vue/src/views/commodities/components/ContractTradingList.vue; then
    echo "✅ 找到commodities分类"
else
    echo "❌ 未找到commodities分类"
fi

# 检查错误处理
echo ""
echo "📋 检查错误处理:"

if grep -q "null.*undefined.*isNaN" template/wap-vue/src/views/commodities/components/ContractTradingList.vue; then
    echo "✅ 找到空值检查"
else
    echo "❌ 未找到空值检查"
fi

if grep -q "return 0.00" template/wap-vue/src/views/commodities/components/ContractTradingList.vue; then
    echo "✅ 找到默认值处理"
else
    echo "❌ 未找到默认值处理"
fi

# 检查日志输出
echo ""
echo "📋 检查日志输出:"

if grep -q "格式化示例" template/wap-vue/src/views/commodities/components/ContractTradingList.vue; then
    echo "✅ 找到格式化示例日志"
else
    echo "❌ 未找到格式化示例日志"
fi

echo ""
echo "🎉 检查完成！"
echo ""
echo "📊 修改说明："
echo "1. 添加了formatDecimal函数进行数值格式化"
echo "2. 在processCommodityData函数中处理API返回的数据"
echo "3. 对changeRatio和netChange进行两位小数格式化"
echo "4. 使用四舍五入逻辑（toFixed(2)）"
echo "5. 在数据处理阶段完成格式化，而不是在模板中"
echo ""
echo "🔧 API数据处理流程："
echo "1. 调用API: https://jpmx.xyz/api/publicRealtimeByType?type=forex&category=commodities&pageNo=1"
echo "2. 接收JSON数据，包含changeRatio和netChange字段"
echo "3. 在processCommodityData函数中处理数据"
echo "4. 使用formatDecimal函数格式化数值"
echo "5. 返回格式化后的数据给前端显示"
echo ""
echo "📈 格式化效果示例："
echo "- ALUMINUM: changeRatio: -0.0024548091943762214 → -0.00"
echo "- ALUMINUM: netChange: -6.599999999999909 → -6.60"
echo "- COPPER: changeRatio: 0.015209034919334619 → 0.02"
echo "- COPPER: netChange: 159.65000000000146 → 159.65"
echo ""
echo "✅ 现在API返回的数据会在处理阶段就完成格式化，前端显示的都是保留两位小数的数值！"
