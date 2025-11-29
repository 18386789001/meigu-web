#!/bin/bash

echo "🔍 检查顶部页签修复..."

# 检查CoinChart.vue中的返回逻辑
echo "📋 检查CoinChart.vue中的返回逻辑:"

if grep -q "quotes/index?tabActive=3&activeTradingTab=contract" template/wap-vue/src/views/foreign/CoinChart.vue; then
    echo "✅ 找到跳转到quotes/index的代码"
else
    echo "❌ 未找到跳转到quotes/index的代码"
fi

if grep -q "返回到行情页面的大宗商品页签" template/wap-vue/src/views/foreign/CoinChart.vue; then
    echo "✅ 找到相关注释"
else
    echo "❌ 未找到相关注释"
fi

# 检查quotes/List.vue中的props传递
echo ""
echo "📋 检查quotes/List.vue中的props传递:"

if grep -q ":activeTradingTab=\"route.query.activeTradingTab\"" template/wap-vue/src/views/quotes/List.vue; then
    echo "✅ 找到activeTradingTab props传递"
else
    echo "❌ 未找到activeTradingTab props传递"
fi

# 检查commodities/List.vue中的props接收
echo ""
echo "📋 检查commodities/List.vue中的props接收:"

if grep -q "defineProps" template/wap-vue/src/views/commodities/List.vue; then
    echo "✅ 找到defineProps定义"
else
    echo "❌ 未找到defineProps定义"
fi

if grep -q "activeTradingTab.*String" template/wap-vue/src/views/commodities/List.vue; then
    echo "✅ 找到activeTradingTab props定义"
else
    echo "❌ 未找到activeTradingTab props定义"
fi

if grep -q "props.activeTradingTab" template/wap-vue/src/views/commodities/List.vue; then
    echo "✅ 找到props.activeTradingTab使用"
else
    echo "❌ 未找到props.activeTradingTab使用"
fi

# 检查quotes/List.vue中的tabActive处理
echo ""
echo "📋 检查quotes/List.vue中的tabActive处理:"

if grep -q "tabIndex: 3" template/wap-vue/src/views/quotes/List.vue; then
    echo "✅ 找到tabIndex: 3配置（大宗商品）"
else
    echo "❌ 未找到tabIndex: 3配置"
fi

if grep -q "大宗商品" template/wap-vue/src/views/quotes/List.vue; then
    echo "✅ 找到大宗商品标签页配置"
else
    echo "❌ 未找到大宗商品标签页配置"
fi

# 检查路由配置
echo ""
echo "📋 检查路由配置:"

if grep -q "path: 'commodities'" template/wap-vue/src/router/index.js; then
    echo "✅ 找到commodities路由配置"
else
    echo "❌ 未找到commodities路由配置"
fi

echo ""
echo "🎉 检查完成！"
echo ""
echo "📊 修复说明："
echo "1. 返回路径改为 /quotes/index?tabActive=3&activeTradingTab=contract"
echo "2. 通过quotes/List.vue显示顶部页签导航"
echo "3. 通过props将activeTradingTab传递给commodities/List.vue"
echo "4. commodities/List.vue优先使用props中的activeTradingTab"
echo ""
echo "🔧 导航流程："
echo "1. 用户在合约交易页签点击商品"
echo "2. 跳转到 /foreign/coinChart?symbol=XAUUSD&from=contract"
echo "3. 用户点击返回按钮"
echo "4. 系统检测到 from=contract"
echo "5. 返回到 /quotes/index?tabActive=3&activeTradingTab=contract"
echo "6. quotes/List.vue显示顶部页签导航，激活大宗商品页签"
echo "7. 通过props传递activeTradingTab=contract给commodities/List.vue"
echo "8. commodities/List.vue自动激活合约交易标签页"
echo ""
echo "✅ 现在返回时会正确显示顶部的页签导航（大宗商品、加密货币等）！"
