# K线接口调用频率调整说明

## 修改时间
2025年11月2日

## 修改目标
将大宗商品（type=commodities）的K线数据获取方式和频率调整为：
- **取消WebSocket连接**：大宗商品不再使用WebSocket实时推送，仅使用HTTP API定时轮询
- **1min周期**：2秒一次（HTTP轮询）
- **其他所有周期**（5min、15min、30min、60min、120min、1day、5day、1quarter、1year等）：5秒一次（HTTP轮询）
- **其他类型品种**（forex、cryptos、indices等）：保持原有WebSocket连接方式不变

## 修改范围

### 大宗商品（commodities）- 已修改
1. ❌ **禁用WebSocket连接** - 不再尝试连接WebSocket服务器，避免连接失败错误
2. ✅ **使用HTTP轮询** - 纯HTTP API定时获取数据
3. ✅ **1min周期2秒轮询** - 保证短周期的实时性
4. ✅ **其他周期5秒轮询** - 平衡实时性和服务器负载
5. 📊 **影响品种**: XAUUSD (Gold)、XAGUSD (Silver)、XALUSD (Aluminum)、XCUUSD (Copper)、XNIUSD (Nickel)、XPBUSD (Lead)、XZNUSD (Zinc)、XPTUSD (Platinum)、XPDUSD (Palladium)、UKOIL、USOIL等

### 其他类型（forex、cryptos、indices等）- 保持不变
1. ✅ **继续使用WebSocket** - 保持原有实时推送机制
2. ✅ **保持原有轮询频率** - 不受影响
3. 📊 **影响品种**: 外汇、数字货币、指数、股票等

## 修改文件列表

### 1. `wap-vue/src/components/fx-kline/index.vue`

#### 修改1：禁用大宗商品WebSocket连接
**修改位置**: `startQuoteScoket` 函数

**修改内容**:
```javascript
const startQuoteScoket = () => {
  // 检查是否为K线图页面
  if (!isKlinePage()) {
    console.log('🚫 当前页面不是K线图页面，跳过WebSocket连接');
    return;
  }
  
  // 大宗商品类型不使用WebSocket，只使用定时器轮询
  if (isCommoditiesType()) {
    console.log(`🚫 大宗商品类型 ${props.symbol} 不使用WebSocket，仅使用定时器轮询获取数据`);
    closeSocket(); // 确保关闭任何现有连接
    return;
  }
  
  // ... 其他类型继续使用WebSocket
}
```

**修改说明**:
- 大宗商品类型直接返回，不建立WebSocket连接
- 其他类型（forex、cryptos、indices等）继续使用WebSocket

#### 修改2：组件挂载时跳过大宗商品WebSocket
**修改位置**: `onMounted` 生命周期钩子

**修改内容**:
```javascript
onMounted(() => {
  // 检查是否为K线图页面
  if (!isKlinePage()) {
    console.log('🚫 当前页面不是K线图页面，跳过K线图组件初始化');
    return;
  }
  
  console.log('✅ 检测到K线图页面，启动K线图组件');
  
  defaultH.value = window.innerHeight - 94
  nextTick(async () => {
    await initData1()
    await initData()
    // 大宗商品不使用WebSocket，其他类型启动WebSocket
    if (!isCommoditiesType()) {
      startQuoteScoket()
    } else {
      console.log(`✅ 大宗商品类型 ${props.symbol}，跳过WebSocket启动，仅使用定时器轮询`)
    }
  })
})
```

**修改说明**:
- 组件初始化时，判断是否为大宗商品类型
- 非大宗商品才启动WebSocket连接

#### 修改3：K线定时器频率调整
**修改位置**: `startKlineTimer` 函数

**修改内容**:
```javascript
// 根据商品类型确定调用频率
let interval = 2000; // 默认2秒
let intervalText = '2秒';

// 如果是commodities类型的商品，根据时间周期调整调用频率
if (isCommoditiesType()) {
  // 仅1min周期使用2秒调用频率
  if (quotesStore.stage === '1min') {
    interval = 2000;
    intervalText = '2秒';
    console.log(`🔄 检测到commodities类型商品 ${props.symbol}，1min周期使用2秒调用频率`)
  } 
  // 其他所有周期使用5秒调用频率
  else {
    interval = 5000;
    intervalText = '5秒';
    console.log(`🔄 检测到commodities类型商品 ${props.symbol}，周期 ${quotesStore.stage} 使用5秒调用频率`)
  }
}
```

**修改说明**:
- 大宗商品1min周期: 2秒轮询
- 大宗商品其他所有周期（5min、15min、30min、60min、120min、1day、5day、1quarter、1year等）: 5秒轮询

### 2. `wap-vue/src/views/quotes/Detail.vue`
**修改位置**: 第1530-1546行 `startPriceTimer` 函数

**修改前**:
- 大宗商品实时价格更新: 5秒
- 其他品种实时价格更新: 3秒

**修改后**:
- 大宗商品实时价格更新: **5秒**（保持不变）
- 其他品种实时价格更新: 3秒

**修改内容**:
```javascript
// 设置定时器间隔：大宗商品5秒，其他品种3秒
const interval = symbolType.value === 'commodities' ? 5000 : 3000;
```

### 3. `wap-vue/src/views/quotes/components/BuySellTradeTab.vue`
**修改位置**: 第833-849行 `startCommodityPriceTimer` 函数

**修改前**:
- 大宗商品价格定时器: 5秒

**修改后**:
- 大宗商品价格定时器: **5秒**（保持不变）

**修改内容**:
```javascript
// 设置5秒定时器
commodityPriceTimer.value = setInterval(() => {
  getLatestPriceFromKline(symbol.value);
}, 5000);

console.log('✅ 交易页面启动大宗商品价格定时器，每5秒调用一次，symbol:', symbol.value);
```

## API接口信息
- **接口地址**: `https://jpmx.xyz/api/hobi!getKlineV1.action`
- **调用频率**: 
  - 大宗商品1min周期：2秒一次
  - 大宗商品其他周期：5秒一次
- **请求方法**: GET
- **参数示例**:
  - `symbol`: GOLD, Silver, Aluminum, COPPER, Nickel, Lead, Zinc, Platinum, Palladium, UKOIL, USOIL等
  - `line`: 1min, 5min, 15min, 30min, 60min, 120min, 1day, 5day, 1quarter, 1year等
  - `language`: zh-CN, en等

## 大宗商品符号列表
以下符号被识别为commodities类型，适用差异化调用频率（1min周期2秒，其他周期5秒）：
- **贵金属**: XAUUSD (Gold)、XAGUSD (Silver)、XPTUSD (Platinum)、XPDUSD (Palladium)
- **工业金属**: XALUSD (Aluminum)、XCUUSD (Copper)、XNIUSD (Nickel)、XPBUSD (Lead)、XZNUSD (Zinc)
- **能源**: UKOIL (布伦特原油)、USOIL (WTI原油)

## 测试验证
修改后，访问大宗商品K线图页面时（如黄金XAUUSD），可以在浏览器控制台看到以下日志：

### 1min周期（2秒调用频率）
```
✅ 检测到K线图页面，启动K线图组件
✅ 大宗商品类型 XAUUSD，跳过WebSocket启动，仅使用定时器轮询
🔄 检测到commodities类型商品 XAUUSD，1min周期使用2秒调用频率
🔄 启动K线数据自动刷新定时器，每2秒调用一次，时间周期: 1min，商品: XAUUSD
✅ 启动实时价格定时器，每5秒调用一次，symbol: XAUUSD
✅ 交易页面启动大宗商品价格定时器，每5秒调用一次，symbol: XAUUSD
```

**关键日志**：
- ✅ 不会出现WebSocket连接失败错误
- ✅ K线定时器每2秒调用一次
- ✅ 价格定时器每5秒调用一次

### 其他周期（5秒调用频率）
```
✅ 检测到K线图页面，启动K线图组件
✅ 大宗商品类型 XAUUSD，跳过WebSocket启动，仅使用定时器轮询
🔄 检测到commodities类型商品 XAUUSD，周期 1day 使用5秒调用频率
🔄 启动K线数据自动刷新定时器，每5秒调用一次，时间周期: 1day，商品: XAUUSD
✅ 启动实时价格定时器，每5秒调用一次，symbol: XAUUSD
✅ 交易页面启动大宗商品价格定时器，每5秒调用一次，symbol: XAUUSD
```

**关键日志**：
- ✅ 不会出现WebSocket连接失败错误
- ✅ K线定时器每5秒调用一次
- ✅ 价格定时器每5秒调用一次

## 影响范围总结

### ✅ 大宗商品（commodities）
| 周期 | WebSocket | K线轮询频率 | 价格轮询频率 |
|------|----------|------------|------------|
| 1min | ❌ 禁用 | ⚡ 2秒 | 🕐 5秒 |
| 5min | ❌ 禁用 | 🕐 5秒 | 🕐 5秒 |
| 15min | ❌ 禁用 | 🕐 5秒 | 🕐 5秒 |
| 30min | ❌ 禁用 | 🕐 5秒 | 🕐 5秒 |
| 60min | ❌ 禁用 | 🕐 5秒 | 🕐 5秒 |
| 120min | ❌ 禁用 | 🕐 5秒 | 🕐 5秒 |
| 1day | ❌ 禁用 | 🕐 5秒 | 🕐 5秒 |
| 5day | ❌ 禁用 | 🕐 5秒 | 🕐 5秒 |
| 1quarter | ❌ 禁用 | 🕐 5秒 | 🕐 5秒 |
| 1year | ❌ 禁用 | 🕐 5秒 | 🕐 5秒 |

### ✅ 其他类型（forex、cryptos、indices等）
- WebSocket: ✅ 保持原有实时推送
- 轮询频率: ✅ 保持原有设置
- 不受任何影响

## 优势说明

### 1. **解决WebSocket连接问题**
- ❌ 不再出现 `WebSocket connection to 'wss://mt5test.top/api/websocket/1/GOLD' failed` 错误
- ❌ 不再出现 `WebSocket is closed before the connection is established` 错误
- ✅ 大宗商品完全不依赖WebSocket服务器

### 2. **保证数据实时性**
- ⚡ 1min周期2秒轮询，满足短周期交易需求
- 🕐 其他周期5秒轮询，平衡实时性和服务器负载

### 3. **降低服务器压力**
- 📉 相比WebSocket长连接，HTTP轮询更可控
- 📉 根据周期差异化调用频率，优化资源使用

### 4. **提升稳定性**
- ✅ 不依赖WebSocket服务器可用性
- ✅ HTTP API更稳定可靠
- ✅ 即使WebSocket服务器宕机，大宗商品K线图仍能正常工作

## 注意事项
1. ✅ 修改后需要重新编译项目才能生效
2. ✅ 建议在开发环境测试验证后再发布到生产环境
3. ✅ **大宗商品不再依赖WebSocket服务器** - 即使WebSocket服务器不可用，大宗商品K线图也能正常工作
4. ✅ **HTTP API轮询频率** - 1min周期2秒，其他周期5秒，请确保后端API能够承受此频率
5. ⚠️ **其他类型品种仍需WebSocket** - 外汇、数字货币等仍然依赖WebSocket服务器
6. 📊 建议监控API接口的响应时间和服务器性能指标

## 编译和部署
修改完成后，需要执行以下步骤：
1. 进入wap-vue目录: `cd d:\Awww\mt5new\template\wap-vue`
2. 安装依赖（如果需要）: `npm install` 或 `yarn install`
3. 编译项目: `npm run build` 或 `yarn build`
4. 将编译后的文件部署到服务器

## 验证方式
1. 打开浏览器开发者工具（F12）
2. 访问大宗商品K线图页面，例如：
   - `https://jpmx.xyz/syn/?lang=en#/quotes/detail?symbol=XAUUSD&type=commodities`
3. 切换到Network标签，筛选`getKlineV1`接口
4. 观察接口调用频率：
   - 1min周期应该为每2秒调用一次
   - 其他周期应该为每5秒调用一次
5. 切换到Console标签，查看日志：
   - 应该看到 `🚫 大宗商品类型 XAUUSD 不使用WebSocket，仅使用定时器轮询获取数据`
   - 应该看到 `✅ 大宗商品类型 XAUUSD，跳过WebSocket启动，仅使用定时器轮询`
   - **不应该看到** WebSocket连接失败的错误

## 总结
本次修改实现了以下目标：
1. ✅ 大宗商品禁用WebSocket，改为纯HTTP轮询
2. ✅ 1min周期2秒调用，其他周期5秒调用
3. ✅ 解决了WebSocket连接失败的问题
4. ✅ 保证了数据的实时性和系统稳定性
5. ✅ 其他类型品种保持不变

修改完成且经过充分测试后，即可部署到生产环境！

