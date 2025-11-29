#!/bin/bash

echo "🔍 检查K线图组件定时器频率修改..."

# 检查fx-kline/index.vue文件中的关键修改
echo "📋 检查fx-kline/index.vue中的定时器修改:"

# 检查定时器间隔修改
if grep -q "2000" template/wap-vue/src/components/fx-kline/index.vue; then
    echo "✅ 找到定时器间隔改为2000毫秒（2秒）"
else
    echo "❌ 未找到定时器间隔改为2000毫秒"
fi

# 检查注释更新
if grep -q "每2秒调用一次" template/wap-vue/src/components/fx-kline/index.vue; then
    echo "✅ 找到注释更新为每2秒调用一次"
else
    echo "❌ 未找到注释更新"
fi

# 检查是否还有旧的10秒设置
if grep -q "10000" template/wap-vue/src/components/fx-kline/index.vue; then
    echo "⚠️ 警告：仍然存在10000毫秒的设置"
else
    echo "✅ 确认已移除10000毫秒的设置"
fi

# 检查API调用函数
if grep -q "refreshKlineData" template/wap-vue/src/components/fx-kline/index.vue; then
    echo "✅ 找到refreshKlineData函数"
else
    echo "❌ 未找到refreshKlineData函数"
fi

# 检查定时器启动函数
if grep -q "startKlineTimer" template/wap-vue/src/components/fx-kline/index.vue; then
    echo "✅ 找到startKlineTimer函数"
else
    echo "❌ 未找到startKlineTimer函数"
fi

# 检查定时器停止函数
if grep -q "stopKlineTimer" template/wap-vue/src/components/fx-kline/index.vue; then
    echo "✅ 找到stopKlineTimer函数"
else
    echo "❌ 未找到stopKlineTimer函数"
fi

# 检查API接口调用
if grep -q "_getKline" template/wap-vue/src/components/fx-kline/index.vue; then
    echo "✅ 找到_getKline API调用"
else
    echo "❌ 未找到_getKline API调用"
fi

echo "🎉 检查完成！"
echo ""
echo "📊 修改说明："
echo "1. K线图API调用频率从10秒改为2秒"
echo "2. 定时器间隔从10000毫秒改为2000毫秒"
echo "3. 更新了相关注释和日志信息"
echo "4. API接口：https://jpmx.xyz/api/hobi!getKlineV1.action?symbol=GOLD&line=1min&language=en"
echo "5. 页面：foreign/coinChart?symbol=XAUUSD"
echo "6. 现在每2秒自动刷新一次K线数据"
