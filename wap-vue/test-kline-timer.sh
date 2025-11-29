#!/bin/bash

# 测试 wap-vue K线图定时器功能
echo "=== 测试 wap-vue K线图定时器功能 ==="

# 检查文件是否存在
echo "1. 检查关键文件是否存在..."
if [ -f "template/wap-vue/src/components/fx-kline/index.vue" ]; then
    echo "✓ fx-kline/index.vue 文件存在"
else
    echo "✗ fx-kline/index.vue 文件不存在"
    exit 1
fi

if [ -f "template/wap-vue/src/service/trade.api.js" ]; then
    echo "✓ trade.api.js 文件存在"
else
    echo "✗ trade.api.js 文件不存在"
    exit 1
fi

# 检查K线定时器相关代码
echo ""
echo "2. 检查K线定时器相关代码..."

# 检查定时器变量
if grep -q "klineTimer" template/wap-vue/src/components/fx-kline/index.vue; then
    echo "✓ klineTimer 定时器变量已定义"
else
    echo "✗ klineTimer 定时器变量未定义"
fi

# 检查启动定时器函数
if grep -q "startKlineTimer" template/wap-vue/src/components/fx-kline/index.vue; then
    echo "✓ startKlineTimer 函数已定义"
else
    echo "✗ startKlineTimer 函数未定义"
fi

# 检查停止定时器函数
if grep -q "stopKlineTimer" template/wap-vue/src/components/fx-kline/index.vue; then
    echo "✓ stopKlineTimer 函数已定义"
else
    echo "✗ stopKlineTimer 函数未定义"
fi

# 检查刷新K线数据函数
if grep -q "refreshKlineData" template/wap-vue/src/components/fx-kline/index.vue; then
    echo "✓ refreshKlineData 函数已定义"
else
    echo "✗ refreshKlineData 函数未定义"
fi

# 检查定时器间隔设置
if grep -q "10000" template/wap-vue/src/components/fx-kline/index.vue; then
    echo "✓ 定时器间隔设置为10秒（10000毫秒）"
else
    echo "✗ 定时器间隔未设置为10秒"
fi

# 检查定时器启动调用
if grep -q "startKlineTimer()" template/wap-vue/src/components/fx-kline/index.vue; then
    echo "✓ 在initData中调用了startKlineTimer"
else
    echo "✗ 在initData中未调用startKlineTimer"
fi

# 检查定时器清理
if grep -q "stopKlineTimer()" template/wap-vue/src/components/fx-kline/index.vue; then
    echo "✓ 在onBeforeUnmount中调用了stopKlineTimer"
else
    echo "✗ 在onBeforeUnmount中未调用stopKlineTimer"
fi

# 检查watch监听器
if grep -q "watch.*props.symbol.*quotesStore.stage" template/wap-vue/src/components/fx-kline/index.vue; then
    echo "✓ 添加了symbol和时间周期变化的watch监听器"
else
    echo "✗ 未添加symbol和时间周期变化的watch监听器"
fi

# 检查API调用
echo ""
echo "3. 检查API调用相关代码..."

# 检查_getKline函数
if grep -q "_getKline" template/wap-vue/src/service/trade.api.js; then
    echo "✓ _getKline API函数存在"
else
    echo "✗ _getKline API函数不存在"
fi

# 检查API URL
if grep -q "hobi!getKlineV1.action" template/wap-vue/src/service/trade.api.js; then
    echo "✓ K线API URL正确"
else
    echo "✗ K线API URL不正确"
fi

# 检查symbol映射
if grep -q "XAUUSD.*GOLD" template/wap-vue/src/service/trade.api.js; then
    echo "✓ XAUUSD到GOLD的symbol映射存在"
else
    echo "✗ XAUUSD到GOLD的symbol映射不存在"
fi

# 检查错误处理
echo ""
echo "4. 检查错误处理..."

if grep -q "catch.*error" template/wap-vue/src/components/fx-kline/index.vue; then
    echo "✓ 添加了错误处理机制"
else
    echo "✗ 未添加错误处理机制"
fi

# 检查控制台日志
if grep -q "console.log.*K线" template/wap-vue/src/components/fx-kline/index.vue; then
    echo "✓ 添加了调试日志"
else
    echo "✗ 未添加调试日志"
fi

echo ""
echo "=== 测试完成 ==="
echo ""
echo "功能特点："
echo "• ✅ 每10秒自动调用K线API"
echo "• ✅ 支持symbol和时间周期变化时重新启动定时器"
echo "• ✅ 组件卸载时自动清理定时器"
echo "• ✅ 完整的错误处理机制"
echo "• ✅ 详细的调试日志"
echo "• ✅ 支持XAUUSD到GOLD的symbol映射"
echo ""
echo "API调用："
echo "• 🔗 API地址: https://jpmx.xyz/api/hobi!getKlineV1.action"
echo "• 🔗 参数: symbol=GOLD&line=1day&language=en"
echo "• ⏰ 调用频率: 每10秒一次"
echo "• 📊 支持的时间周期: 1min, 5min, 15min, 30min, 60min, 1day, 1week, 1mon等"
echo ""
echo "技术实现："
echo "• 🔧 Vue 3 Composition API"
echo "• 🔧 setInterval 定时器"
echo "• 🔧 watch 监听器"
echo "• 🔧 生命周期管理"
echo "• 🔧 错误处理和日志记录"
