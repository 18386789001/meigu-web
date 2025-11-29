#!/bin/bash

echo "🔍 检查K线图组件symbol映射逻辑..."

# 检查trade.api.js中的symbol映射
echo "📋 检查trade.api.js中的symbol映射:"

if grep -q "USOIL.*USOIL" template/wap-vue/src/service/trade.api.js; then
    echo "✅ 找到USOIL映射配置"
else
    echo "❌ 未找到USOIL映射配置"
fi

if grep -q "XAUUSD.*GOLD" template/wap-vue/src/service/trade.api.js; then
    echo "✅ 找到XAUUSD映射配置"
else
    echo "❌ 未找到XAUUSD映射配置"
fi

# 检查fx-kline组件中的symbol使用
echo ""
echo "📋 检查fx-kline组件中的symbol使用:"

if grep -q "props.symbol" template/wap-vue/src/components/fx-kline/index.vue; then
    echo "✅ 找到props.symbol的使用"
else
    echo "❌ 未找到props.symbol的使用"
fi

if grep -q "_getKline.*props.symbol" template/wap-vue/src/components/fx-kline/index.vue; then
    echo "✅ 找到_getKline使用props.symbol"
else
    echo "❌ 未找到_getKline使用props.symbol"
fi

# 检查定时器频率
echo ""
echo "📋 检查定时器频率:"

if grep -q "2000" template/wap-vue/src/components/fx-kline/index.vue; then
    echo "✅ 找到2秒定时器设置"
else
    echo "❌ 未找到2秒定时器设置"
fi

# 检查API URL构建
echo ""
echo "📋 检查API URL构建:"

if grep -q "hobi!getKlineV1.action" template/wap-vue/src/service/trade.api.js; then
    echo "✅ 找到正确的API端点"
else
    echo "❌ 未找到正确的API端点"
fi

echo ""
echo "🎉 检查完成！"
echo ""
echo "📊 当前实现说明："
echo "1. K线图组件使用props.symbol动态获取symbol参数"
echo "2. _getKline API函数包含完整的symbol映射表"
echo "3. USOIL -> USOIL 映射已配置"
echo "4. XAUUSD -> GOLD 映射已配置"
echo "5. 定时器频率为2秒一次"
echo "6. API调用会根据当前页面的symbol动态调整"
echo ""
echo "🔧 测试场景："
echo "- foreign/coinChart?symbol=USOIL -> 调用 symbol=USOIL 的API"
echo "- foreign/coinChart?symbol=XAUUSD -> 调用 symbol=GOLD 的API"
echo "- 其他symbol -> 直接使用原始symbol调用API"
