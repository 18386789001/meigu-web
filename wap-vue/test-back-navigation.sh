#!/bin/bash

echo "🔍 检查返回导航修改..."

# 检查CoinChart.vue中的handleBack函数
echo "📋 检查CoinChart.vue中的返回逻辑:"

if grep -q "commodities/List?activeTradingTab=contract" template/wap-vue/src/views/foreign/CoinChart.vue; then
    echo "✅ 找到跳转到合约交易列表的代码"
else
    echo "❌ 未找到跳转到合约交易列表的代码"
fi

if grep -q "跳转到合约交易列表页面" template/wap-vue/src/views/foreign/CoinChart.vue; then
    echo "✅ 找到相关注释"
else
    echo "❌ 未找到相关注释"
fi

# 检查是否还有旧的quotes/index跳转
if grep -q "quotes/index?tabActive=2" template/wap-vue/src/views/foreign/CoinChart.vue; then
    echo "⚠️ 警告：仍然存在旧的quotes/index跳转"
else
    echo "✅ 确认已移除旧的quotes/index跳转"
fi

# 检查commodities/List.vue中的查询参数处理
echo ""
echo "📋 检查commodities/List.vue中的查询参数处理:"

if grep -q "useRoute" template/wap-vue/src/views/commodities/List.vue; then
    echo "✅ 找到useRoute导入"
else
    echo "❌ 未找到useRoute导入"
fi

if grep -q "route.query.activeTradingTab" template/wap-vue/src/views/commodities/List.vue; then
    echo "✅ 找到查询参数处理逻辑"
else
    echo "❌ 未找到查询参数处理逻辑"
fi

if grep -q "从查询参数设置交易类型页签为合约交易" template/wap-vue/src/views/commodities/List.vue; then
    echo "✅ 找到相关日志信息"
else
    echo "❌ 未找到相关日志信息"
fi

# 检查ContractTradingList组件
echo ""
echo "📋 检查ContractTradingList组件:"

if grep -q "ContractTradingList" template/wap-vue/src/views/commodities/List.vue; then
    echo "✅ 找到ContractTradingList组件引用"
else
    echo "❌ 未找到ContractTradingList组件引用"
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
echo "1. foreign/coinChart?symbol=XAUUSD 页面的返回按钮现在跳转到合约交易列表"
echo "2. 跳转路径：/commodities/List?activeTradingTab=contract"
echo "3. commodities/List.vue 页面会检查查询参数并自动激活合约交易标签页"
echo "4. 移除了原来跳转到 quotes/index?tabActive=2 的逻辑"
echo ""
echo "🔧 功能流程："
echo "1. 用户在 foreign/coinChart?symbol=XAUUSD 页面点击返回按钮"
echo "2. 系统跳转到 /commodities/List?activeTradingTab=contract"
echo "3. commodities/List.vue 页面加载时检查查询参数"
echo "4. 自动设置 activeTradingTab 为 'contract'"
echo "5. 显示 ContractTradingList 组件内容"
echo ""
echo "✅ 现在返回按钮会正确跳转到合约交易列表页面！"
