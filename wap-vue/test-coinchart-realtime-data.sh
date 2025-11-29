#!/bin/bash

echo "🔍 检查CoinChart页面实时数据功能..."

# 检查CoinChart.vue文件中的关键修改
echo "📋 检查CoinChart.vue中的关键修改:"

# 检查API导入
if grep -q "_getRealtimeByType" template/wap-vue/src/views/foreign/CoinChart.vue; then
    echo "✅ 找到_getRealtimeByType API导入"
else
    echo "❌ 未找到_getRealtimeByType API导入"
fi

# 检查实时数据状态
if grep -q "realtimeData" template/wap-vue/src/views/foreign/CoinChart.vue; then
    echo "✅ 找到realtimeData状态变量"
else
    echo "❌ 未找到realtimeData状态变量"
fi

# 检查实时数据获取函数
if grep -q "fetchRealtimeData" template/wap-vue/src/views/foreign/CoinChart.vue; then
    echo "✅ 找到fetchRealtimeData函数"
else
    echo "❌ 未找到fetchRealtimeData函数"
else
    echo "❌ 未找到fetchRealtimeData函数"
fi

# 检查定时器函数
if grep -q "startRealtimeTimer" template/wap-vue/src/views/foreign/CoinChart.vue; then
    echo "✅ 找到startRealtimeTimer函数"
else
    echo "❌ 未找到startRealtimeTimer函数"
fi

if grep -q "stopRealtimeTimer" template/wap-vue/src/views/foreign/CoinChart.vue; then
    echo "✅ 找到stopRealtimeTimer函数"
else
    echo "❌ 未找到stopRealtimeTimer函数"
fi

# 检查模板中的新元素
if grep -q "net-change" template/wap-vue/src/views/foreign/CoinChart.vue; then
    echo "✅ 找到涨跌额显示元素"
else
    echo "❌ 未找到涨跌额显示元素"
fi

if grep -q "change-ratio" template/wap-vue/src/views/foreign/CoinChart.vue; then
    echo "✅ 找到涨跌幅度显示元素"
else
    echo "❌ 未找到涨跌幅度显示元素"
fi

# 检查"今收"标签
if grep -q "今收" template/wap-vue/src/views/foreign/CoinChart.vue; then
    echo "✅ 找到今收标签"
else
    echo "❌ 未找到今收标签"
fi

# 检查i18n翻译
echo "📋 检查i18n翻译:"

if grep -q "今收.*今收" template/wap-vue/src/i18n/modules/zh-CN.js; then
    echo "✅ 中文今收翻译已添加"
else
    echo "❌ 中文今收翻译未添加"
fi

if grep -q "Today Close" template/wap-vue/src/i18n/modules/en.js; then
    echo "✅ 英文今收翻译已添加"
else
    echo "❌ 英文今收翻译未添加"
fi

if grep -q "今日終値" template/wap-vue/src/i18n/modules/Japanese.js; then
    echo "✅ 日文今收翻译已添加"
else
    echo "❌ 日文今收翻译未添加"
fi

echo "🎉 检查完成！"
echo ""
echo "📊 功能说明："
echo "1. 从API获取实时数据：https://jpmx.xyz/api/publicRealtimeByType?type=forex&category=commodities&pageNo=1"
echo "2. 涨跌额显示在红色实时价格的最左边"
echo "3. 涨跌幅度显示在红色实时价格的最右边"
echo "4. 昨收改为今收"
echo "5. 每3秒自动更新一次数据"
echo "6. 支持中英日三语"
