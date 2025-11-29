#!/bin/bash

echo "🔍 检查直接跳转到大宗商品页面的修改..."

# 检查CoinChart.vue中的返回逻辑
echo "📋 检查CoinChart.vue中的返回逻辑:"

if grep -q "quotes/commodities?activeTradingTab=contract" template/wap-vue/src/views/foreign/CoinChart.vue; then
    echo "✅ 找到直接跳转到大宗商品页面的代码"
else
    echo "❌ 未找到直接跳转到大宗商品页面的代码"
fi

if grep -q "返回到大宗商品页面并激活合约交易标签页" template/wap-vue/src/views/foreign/CoinChart.vue; then
    echo "✅ 找到相关注释"
else
    echo "❌ 未找到相关注释"
fi

# 检查是否还有错误的路径
if grep -q "quotes/index?tabActive=3" template/wap-vue/src/views/foreign/CoinChart.vue; then
    echo "⚠️ 警告：仍然存在quotes/index?tabActive=3路径"
else
    echo "✅ 确认已移除quotes/index?tabActive=3路径"
fi

# 检查路由配置
echo ""
echo "📋 检查路由配置:"

if grep -q "path: 'commodities'" template/wap-vue/src/router/index.js; then
    echo "✅ 找到commodities路由配置"
    echo "   路径: /quotes/commodities"
else
    echo "❌ 未找到commodities路由配置"
fi

# 检查commodities/List.vue中的查询参数处理
echo ""
echo "📋 检查commodities/List.vue中的查询参数处理:"

if grep -q "route.query.activeTradingTab === 'contract'" template/wap-vue/src/views/commodities/List.vue; then
    echo "✅ 找到activeTradingTab=contract查询参数处理"
else
    echo "❌ 未找到activeTradingTab=contract查询参数处理"
fi

if grep -q "从查询参数设置交易类型页签为合约交易" template/wap-vue/src/views/commodities/List.vue; then
    echo "✅ 找到相关日志信息"
else
    echo "❌ 未找到相关日志信息"
fi

# 检查现货交易和合约交易标签页
echo ""
echo "📋 检查现货交易和合约交易标签页:"

if grep -q "现货交易" template/wap-vue/src/views/commodities/List.vue; then
    echo "✅ 找到现货交易标签页"
else
    echo "❌ 未找到现货交易标签页"
fi

if grep -q "合约交易" template/wap-vue/src/views/commodities/List.vue; then
    echo "✅ 找到合约交易标签页"
else
    echo "❌ 未找到合约交易标签页"
fi

if grep -q "activeTradingTab === 'spot'" template/wap-vue/src/views/commodities/List.vue; then
    echo "✅ 找到现货交易条件渲染"
else
    echo "❌ 未找到现货交易条件渲染"
fi

if grep -q "activeTradingTab === 'contract'" template/wap-vue/src/views/commodities/List.vue; then
    echo "✅ 找到合约交易条件渲染"
else
    echo "❌ 未找到合约交易条件渲染"
fi

echo ""
echo "🎉 检查完成！"
echo ""
echo "📊 修改说明："
echo "1. 直接跳转到 /quotes/commodities?activeTradingTab=contract"
echo "2. 使用现有的路由配置，不需要单独设置新路由"
echo "3. 通过查询参数控制显示合约交易标签页"
echo "4. 支持现货交易和合约交易两种模式"
echo ""
echo "🔧 导航流程："
echo "1. 用户在合约交易页签点击商品"
echo "2. 跳转到 /foreign/coinChart?symbol=XAUUSD&from=contract"
echo "3. 用户点击返回按钮"
echo "4. 系统检测到 from=contract"
echo "5. 直接返回到 /quotes/commodities?activeTradingTab=contract"
echo "6. 自动激活合约交易标签页"
echo ""
echo "✅ 现在使用直接路径跳转，应该不会再出现404错误！"
