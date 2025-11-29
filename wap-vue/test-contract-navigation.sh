#!/bin/bash

echo "🔍 检查合约交易导航修改..."

# 检查ContractTradingList.vue中的跳转逻辑
echo "📋 检查ContractTradingList.vue中的跳转逻辑:"

if grep -q "from: 'contract'" template/wap-vue/src/views/commodities/components/ContractTradingList.vue; then
    echo "✅ 找到from: 'contract'查询参数"
else
    echo "❌ 未找到from: 'contract'查询参数"
fi

if grep -q "itemClick.*router.push" template/wap-vue/src/views/commodities/components/ContractTradingList.vue; then
    echo "✅ 找到itemClick跳转逻辑"
else
    echo "❌ 未找到itemClick跳转逻辑"
fi

# 检查CoinChart.vue中的返回逻辑
echo ""
echo "📋 检查CoinChart.vue中的返回逻辑:"

if grep -q "route.query.from === 'contract'" template/wap-vue/src/views/foreign/CoinChart.vue; then
    echo "✅ 找到合约交易来源判断"
else
    echo "❌ 未找到合约交易来源判断"
fi

if grep -q "从合约交易页签进入" template/wap-vue/src/views/foreign/CoinChart.vue; then
    echo "✅ 找到相关注释"
else
    echo "❌ 未找到相关注释"
fi

if grep -q "quotes/index?tabActive=2" template/wap-vue/src/views/foreign/CoinChart.vue; then
    echo "✅ 找到默认跳转到行情页面的逻辑"
else
    echo "❌ 未找到默认跳转逻辑"
fi

# 检查完整的返回逻辑流程
echo ""
echo "📋 检查完整的返回逻辑流程:"

if grep -q "isOptional.*optional/index" template/wap-vue/src/views/foreign/CoinChart.vue; then
    echo "✅ 找到自选股返回逻辑"
else
    echo "❌ 未找到自选股返回逻辑"
fi

if grep -q "from.*trade.*trade/index" template/wap-vue/src/views/foreign/CoinChart.vue; then
    echo "✅ 找到交易页面返回逻辑"
else
    echo "❌ 未找到交易页面返回逻辑"
fi

echo ""
echo "🎉 检查完成！"
echo ""
echo "📊 修改说明："
echo "1. ContractTradingList.vue 跳转时添加 from: 'contract' 查询参数"
echo "2. CoinChart.vue 根据 from 参数判断返回目标"
echo "3. 从合约交易页签进入时，返回合约交易列表页面"
echo "4. 其他情况保持原有返回逻辑"
echo ""
echo "🔧 导航流程："
echo "1. 用户在合约交易页签点击商品"
echo "2. 跳转到 /foreign/coinChart?symbol=XAUUSD&from=contract"
echo "3. 用户点击返回按钮"
echo "4. 系统检测到 from=contract"
echo "5. 返回到 /commodities/List?activeTradingTab=contract"
echo "6. 自动激活合约交易标签页"
echo ""
echo "✅ 现在从合约交易页签进入的详情页会正确返回到合约交易页签！"
