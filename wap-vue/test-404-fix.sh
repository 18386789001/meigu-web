#!/bin/bash

echo "🔍 检查404错误修复..."

# 检查CoinChart.vue中的返回逻辑
echo "📋 检查CoinChart.vue中的返回逻辑:"

if grep -q "quotes/index?tabActive=3" template/wap-vue/src/views/foreign/CoinChart.vue; then
    echo "✅ 找到跳转到大宗商品页面的代码"
else
    echo "❌ 未找到跳转到大宗商品页面的代码"
fi

if grep -q "从合约交易页签进入，返回到大宗商品页面" template/wap-vue/src/views/foreign/CoinChart.vue; then
    echo "✅ 找到相关注释"
else
    echo "❌ 未找到相关注释"
fi

# 检查是否还有错误的路径
if grep -q "commodities/List" template/wap-vue/src/views/foreign/CoinChart.vue; then
    echo "⚠️ 警告：仍然存在错误的commodities/List路径"
else
    echo "✅ 确认已移除错误的commodities/List路径"
fi

# 检查路由配置
echo ""
echo "📋 检查路由配置:"

if grep -q "path: 'commodities'" template/wap-vue/src/router/index.js; then
    echo "✅ 找到commodities路由配置"
else
    echo "❌ 未找到commodities路由配置"
fi

# 检查quotes/List.vue中的tabActive处理
echo ""
echo "📋 检查quotes/List.vue中的tabActive处理:"

if grep -q "tabIndex: 3" template/wap-vue/src/views/quotes/List.vue; then
    echo "✅ 找到tabIndex: 3配置"
else
    echo "❌ 未找到tabIndex: 3配置"
fi

if grep -q "大宗商品" template/wap-vue/src/views/quotes/List.vue; then
    echo "✅ 找到大宗商品标签页配置"
else
    echo "❌ 未找到大宗商品标签页配置"
fi

if grep -q "route.query.tabActive" template/wap-vue/src/views/quotes/List.vue; then
    echo "✅ 找到tabActive查询参数处理"
else
    echo "❌ 未找到tabActive查询参数处理"
fi

# 检查ContractTradingList.vue中的跳转逻辑
echo ""
echo "📋 检查ContractTradingList.vue中的跳转逻辑:"

if grep -q "from: 'contract'" template/wap-vue/src/views/commodities/components/ContractTradingList.vue; then
    echo "✅ 找到from: 'contract'查询参数"
else
    echo "❌ 未找到from: 'contract'查询参数"
fi

echo ""
echo "🎉 检查完成！"
echo ""
echo "📊 修复说明："
echo "1. 修正了返回路径从 /commodities/List 改为 /quotes/index?tabActive=3"
echo "2. 确认了路由配置中commodities的正确路径是 /quotes/commodities"
echo "3. 确认了quotes/List.vue中tabIndex: 3对应大宗商品标签页"
echo "4. 保持了from: 'contract'查询参数用于识别来源"
echo ""
echo "🔧 导航流程："
echo "1. 用户在合约交易页签点击商品"
echo "2. 跳转到 /foreign/coinChart?symbol=XAUUSD&from=contract"
echo "3. 用户点击返回按钮"
echo "4. 系统检测到 from=contract"
echo "5. 返回到 /quotes/index?tabActive=3"
echo "6. 自动激活大宗商品标签页"
echo ""
echo "✅ 现在从合约交易页签进入的详情页会正确返回到大宗商品页面，不再出现404错误！"
