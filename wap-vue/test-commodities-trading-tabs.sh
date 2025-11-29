#!/bin/bash

echo "🔍 检查大宗商品页面交易类型页签功能..."

# 检查List.vue文件中的关键修改
echo "📋 检查List.vue中的关键修改:"

# 检查交易类型页签容器
if grep -q "trading-tabs-container" template/wap-vue/src/views/commodities/List.vue; then
    echo "✅ 找到交易类型页签容器"
else
    echo "❌ 未找到交易类型页签容器"
fi

# 检查现货交易和合约交易页签
if grep -q "现货交易" template/wap-vue/src/views/commodities/List.vue; then
    echo "✅ 找到现货交易页签"
else
    echo "❌ 未找到现货交易页签"
fi

if grep -q "合约交易" template/wap-vue/src/views/commodities/List.vue; then
    echo "✅ 找到合约交易页签"
else
    echo "❌ 未找到合约交易页签"
fi

# 检查activeTradingTab状态
if grep -q "activeTradingTab" template/wap-vue/src/views/commodities/List.vue; then
    echo "✅ 找到activeTradingTab状态变量"
else
    echo "❌ 未找到activeTradingTab状态变量"
fi

# 检查onTradingTabChange函数
if grep -q "onTradingTabChange" template/wap-vue/src/views/commodities/List.vue; then
    echo "✅ 找到onTradingTabChange函数"
else
    echo "❌ 未找到onTradingTabChange函数"
fi

# 检查ContractTradingList组件导入
if grep -q "ContractTradingList" template/wap-vue/src/views/commodities/List.vue; then
    echo "✅ 找到ContractTradingList组件导入"
else
    echo "❌ 未找到ContractTradingList组件导入"
fi

# 检查合约交易组件文件
if [ -f "template/wap-vue/src/views/commodities/components/ContractTradingList.vue" ]; then
    echo "✅ 找到ContractTradingList.vue组件文件"
else
    echo "❌ 未找到ContractTradingList.vue组件文件"
fi

# 检查i18n翻译
echo "📋 检查i18n翻译:"

if grep -q "现货交易" template/wap-vue/src/i18n/modules/zh-CN.js; then
    echo "✅ 中文翻译已添加"
else
    echo "❌ 中文翻译未添加"
fi

if grep -q "Spot Trading" template/wap-vue/src/i18n/modules/en.js; then
    echo "✅ 英文翻译已添加"
else
    echo "❌ 英文翻译未添加"
fi

if grep -q "現物取引" template/wap-vue/src/i18n/modules/Japanese.js; then
    echo "✅ 日文翻译已添加"
else
    echo "❌ 日文翻译未添加"
fi

echo "🎉 检查完成！"
