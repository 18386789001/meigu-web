#!/bin/bash

echo "🔍 检查合约交易页面商品过滤和排序功能..."

# 检查ContractTradingList.vue文件中的关键修改
echo "📋 检查ContractTradingList.vue中的关键修改:"

# 检查processCommodityData函数
if grep -q "processCommodityData" template/wap-vue/src/views/commodities/components/ContractTradingList.vue; then
    echo "✅ 找到processCommodityData函数"
else
    echo "❌ 未找到processCommodityData函数"
fi

# 检查GOLD和SILVER过滤逻辑
if grep -q "symbol !== 'GOLD'" template/wap-vue/src/views/commodities/components/ContractTradingList.vue; then
    echo "✅ 找到GOLD过滤逻辑"
else
    echo "❌ 未找到GOLD过滤逻辑"
fi

if grep -q "symbol !== 'SILVER'" template/wap-vue/src/views/commodities/components/ContractTradingList.vue; then
    echo "✅ 找到SILVER过滤逻辑"
else
    echo "❌ 未找到SILVER过滤逻辑"
fi

# 检查XAUUSD和XAGUSD排序逻辑
if grep -q "symbol?.toUpperCase() === 'XAUUSD'" template/wap-vue/src/views/commodities/components/ContractTradingList.vue; then
    echo "✅ 找到XAUUSD排序逻辑"
else
    echo "❌ 未找到XAUUSD排序逻辑"
fi

if grep -q "symbol?.toUpperCase() === 'XAGUSD'" template/wap-vue/src/views/commodities/components/ContractTradingList.vue; then
    echo "✅ 找到XAGUSD排序逻辑"
else
    echo "❌ 未找到XAGUSD排序逻辑"
fi

# 检查数据处理调用
if grep -q "processCommodityData(data)" template/wap-vue/src/views/commodities/components/ContractTradingList.vue; then
    echo "✅ 找到数据处理调用"
else
    echo "❌ 未找到数据处理调用"
fi

# 检查调试日志
if grep -q "合约交易数据已处理" template/wap-vue/src/views/commodities/components/ContractTradingList.vue; then
    echo "✅ 找到调试日志"
else
    echo "❌ 未找到调试日志"
fi

echo "🎉 检查完成！"
echo ""
echo "📊 功能说明："
echo "1. 隐藏GOLD和SILVER商品"
echo "2. 将XAUUSD移动到第一位"
echo "3. 将XAGUSD移动到第二位"
echo "4. 其他商品保持原有顺序"
echo "5. 添加了调试日志便于监控"
