# 大宗商品 API 对接文档

> **项目**: WAP-VUE
> **创建日期**: 2025-11-22
> **文档版本**: v1.0

---

## 目录

- [一、大宗商品数据获取 API](#一大宗商品数据获取-api)
  - [1. 获取大宗商品实时数据](#1-获取大宗商品实时数据)
  - [2. 获取币种列表](#2-获取币种列表支持大宗商品)
  - [3. 获取行情数据](#3-获取行情数据)
- [二、K线和市场数据 API](#二k线和市场数据-api)
  - [4. 获取 K 线数据](#4-获取-k-线数据-)
  - [5. 获取分时数据](#5-获取分时数据)
  - [6. 获取交易记录](#6-获取交易记录)
  - [7. 获取深度数据](#7-获取深度数据)
- [三、RWA 新接口 API](#三rwa-新接口-api)
  - [8. 获取 RWA 资产行情列表](#8-获取-rwa-资产行情列表)
  - [9. 获取 RWA 资产分类](#9-获取-rwa-资产分类)
  - [10. 获取 RWA K线数据](#10-获取-rwa-k线数据)
- [四、市场配置 API](#四市场配置-api)
- [五、商品符号映射表](#五商品符号映射表)
- [六、实际使用示例](#六实际使用示例)
- [七、关键注意事项](#七关键注意事项)

---

## 一、大宗商品数据获取 API

### 1. 获取大宗商品实时数据

**接口名称**: `_getCommoditiesRealtime()`
**文件路径**: `src/service/quotes.api.js:57-68`

#### 请求参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|-------|------|------|--------|------|
| pageNo | Number | 否 | 1 | 分页页码 |
| language | String | 否 | 'zh-CN' | 语言（固定为 zh-CN，无法修改） |

#### 请求信息

- **请求方式**: `GET`
- **请求 URL**: `https://jpmx.xyz/api/publicRealtimeByType`
- **Query 参数**:
  ```
  type=forex
  pageNo=1
  category=commodities
  language=zh-CN
  ```

#### 返回数据结构

```javascript
{
  success: true,
  data: {
    tick_list: [
      {
        symbol: "XAUUSD",              // 商品符号
        name: "黄金",                   // 商品名称
        price: "3760.24",              // 当前价格
        changeRatio: 0.29,             // 涨跌比例（%）
        change: 10.83,                 // 涨跌额
        close: 3760.24,                // 收盘价
        high: 3783.78,                 // 最高价
        low: 3734.63,                  // 最低价
        open: 3748.99,                 // 开盘价
        volume: "1234567",             // 成交量
        turnover: "1234567890.00",     // 成交额
        tick_time: "1763366893931",    // 时间戳（毫秒）
        seq: "2161475"                 // 序列号
      }
    ],
    count: 20                          // 数据总数
  }
}
```

#### 调用示例

```javascript
import { _getCommoditiesRealtime } from '@/service/quotes.api'

// 获取第一页大宗商品数据
const res = await _getCommoditiesRealtime(1)

// 获取第二页
const res = await _getCommoditiesRealtime(2, 'zh-CN')
```

#### 接口实现代码

```javascript
export const _getCommoditiesRealtime = (pageNo = 1, language = 'zh-CN') => {
  return request({
    url: 'https://jpmx.xyz/api/publicRealtimeByType',
    method: 'GET',
    params: {
      type: 'forex',
      pageNo: pageNo,
      category: 'commodities',
      language: 'zh-CN' // 固定使用zh-CN
    }
  })
}
```

---

### 2. 获取币种列表（支持大宗商品）

**接口名称**: `_getCoins()`
**文件路径**: `src/service/home.api.js:5-26`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| params.type | String | 是 | 类型：'forex'(外汇) 或 'commodities'(大宗商品) |
| params.language | String | 否 | 语言（type='commodities' 时自动设为 'zh-CN'） |

#### 请求信息

- **请求方式**: `GET`
- **请求 URL**: `{API_PREFIX}/item!list.action`
- **Query 参数示例**:
  ```
  type=commodities
  language=zh-CN
  ```

#### 返回数据结构

```javascript
[
  {
    symbol: "XPBUSD",              // 商品符号
    name: "铅",                     // 中文名称
    enName: "Lead",                // 英文名称
    displayName: "Lead",           // 显示名称
    shortName: "Lead",             // 简称
    type: "forex",                 // 类型
    exchange: "GC",                // 交易所
    country: "US",                 // 国家
    category: "commodities",       // 分类
    isOptional: 0,                 // 是否可自选
    lastPrice: "2087.50",          // 最新价格
    changeRatio: -1.25,            // 涨跌比例
    marketTime: {
      timezone: "Asia/Shanghai",   // 时区
      utc: "+08:00",               // UTC偏移
      status: "trading",           // 市场状态
      time: "11:30:45"             // 市场时间
    }
  }
]
```

#### ⚠️ 特殊处理逻辑

1. **自动过滤**: 返回数据中会自动过滤掉 `XAUUSD`（黄金）和 `XAGUSD`（白银）
2. **语言固定**: 当 `type='commodities'` 时，自动将 `language` 设为 `'zh-CN'`

#### 调用示例

```javascript
import { _getCoins } from '@/service/home.api'

// 获取大宗商品列表
const res = await _getCoins({ type: 'commodities' })

// 获取外汇列表
const res = await _getCoins({ type: 'forex', language: 'en' })
```

#### 接口实现代码

```javascript
export const _getCoins = (params = {}) => {
    const requestParams = { ...params }
    // 如果是commodities类型，固定使用zh-CN语言
    if (params && params.type === 'commodities') {
        requestParams.language = 'zh-CN'
    }

    return request({
        url: `${API_PREFIX}/item!list.action`,
        method: "GET",
        params: requestParams
    }).then(response => {
        // 如果是commodities类型，过滤掉symbol=XAUUSD和symbol=XAGUSD的数据
        if (params && params.type === 'commodities' && Array.isArray(response)) {
            const filteredData = response.filter(item =>
                item.symbol !== 'XAUUSD' && item.symbol !== 'XAGUSD'
            )
            return filteredData
        }
        return response
    })
}
```

---

### 3. 获取行情数据

**接口名称**: `_getHomeList()`
**文件路径**: `src/service/home.api.js:29-40`

#### 请求参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|-------|------|------|--------|------|
| symbol | String | 否 | 'btc' | 商品符号，如 'XAUUSD'、'EURUSD' |
| isCommodities | Boolean | 否 | false | 是否为大宗商品（为 true 时自动设置 language='zh-CN'） |

#### 请求信息

- **请求方式**: `GET`
- **请求 URL**: `{API_PREFIX}/hobi!getRealtime.action`
- **Query 参数示例**:
  ```
  symbol=XAUUSD
  language=zh-CN
  ```

#### 返回数据结构

```javascript
{
  symbol: "XAUUSD",
  name: "黄金",
  price: "3760.24",
  changeRatio: 0.29,
  change: 10.83,
  close: 3760.24,
  high: 3783.78,
  low: 3734.63,
  open: 3748.99,
  volume: "1234567",
  turnover: "1234567890.00",
  market: {
    status: "trading",          // 市场状态：trading/closed
    time: "15:30:45",           // 市场时间
    time_zone: "US/Eastern"     // 时区
  }
}
```

#### 调用示例

```javascript
import { _getHomeList } from '@/service/home.api'

// 获取黄金行情
const res = await _getHomeList('XAUUSD', true)

// 获取比特币行情
const res = await _getHomeList('btc', false)
```

#### 接口实现代码

```javascript
export const _getHomeList = (symbol = 'btc', isCommodities = false) => {
    const params = { symbol }
    if (isCommodities) {
        params.language = 'zh-CN'
    }

    return request({
        url: `${API_PREFIX}/hobi!getRealtime.action`,
        method: "GET",
        params
    })
}
```

---

## 二、K线和市场数据 API

### 4. 获取 K 线数据 ⭐

**接口名称**: `_getKline()`
**文件路径**: `src/service/trade.api.js:310-347`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| symbol | String | 是 | 商品符号（原始符号，如 XAUUSD） |
| line | String | 是 | 时间周期：1min, 5min, 15min, 30min, 60min, 4hour, 1day, 1week, 1mon |

#### 请求信息

- **请求方式**: `GET`
- **请求 URL**: `{API_PREFIX}/hobi!getKlineV1.action`
- **Query 参数示例**:
  ```
  symbol=GOLD
  line=1day
  language=en
  ```

#### 🔄 符号映射表（重要）

| 原始符号 | API使用符号 | 商品名称 |
|---------|-----------|---------|
| XAUUSD | GOLD | 黄金 |
| XAGUSD | Silver | 白银 |
| XALUSD | Aluminum | 铝 |
| XCUUSD | COPPER | 铜 |
| XNIUSD | Nickel | 镍 |
| XPBUSD | Lead | 铅 |
| XZNUSD | Zinc | 锌 |
| XPTUSD | Platinum | 铂金 |
| XPDUSD | Palladium | 钯金 |
| UKOIL | UKOIL | 布伦特原油 |
| USOIL | USOIL | 美国原油 |

⚠️ **特别注意**: 调用此接口时，传入 `XAUUSD`，实际 API 会自动转换为 `GOLD`

#### 返回数据结构

```javascript
[
  {
    timestamp: "1763049600",       // 时间戳（秒）
    open: "3748.99",               // 开盘价
    close: "3760.24",              // 收盘价
    high: "3783.78",               // 最高价
    low: "3734.63",                // 最低价
    volume: "1234567",             // 成交量
    turnover: "1234567890.00"      // 成交额
  }
  // ... 更多K线数据
]
```

#### 调用示例

```javascript
import { _getKline } from '@/service/trade.api'

// 获取黄金日K线（传入XAUUSD，自动转换为GOLD）
const res = await _getKline('XAUUSD', '1day')

// 获取白银5分钟K线
const res = await _getKline('XAGUSD', '5min')

// 获取原油小时线
const res = await _getKline('USOIL', '60min')
```

#### 接口实现代码

```javascript
export const _getKline = (symbol, line) => {
  let apiSymbol = symbol;

  const symbolMapping = {
    'XAUUSD': 'GOLD',
    'XAGUSD': 'Silver',
    'XALUSD': 'Aluminum',
    'XCUUSD': 'COPPER',
    'XNIUSD': 'Nickel',
    'XPBUSD': 'Lead',
    'XZNUSD': 'Zinc',
    'XPTUSD': 'Platinum',
    'XPDUSD': 'Palladium',
    'UKOIL': 'UKOIL',
    'USOIL': 'USOIL'
  };

  apiSymbol = symbolMapping[symbol] || symbol;

  console.log(`📊 K线图API调用: ${symbol} -> ${apiSymbol}, 时间周期: ${line}, 语言: en`);

  return request({
    url: `${API_PREFIX}/hobi!getKlineV1.action`,
    method: 'GET',
    params: {
      symbol: apiSymbol,
      line,
      language: 'en'
    }
  }).catch((error) => {
    console.error(`❌ K线图API调用失败: ${symbol} -> ${apiSymbol}`, error);
    return [];
  })
}
```

---

### 5. 获取分时数据

**接口名称**: `_getTrend()`
**文件路径**: `src/service/trade.api.js:350-385`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| symbol | String | 是 | 商品符号（原始符号，会自动映射） |

#### 请求信息

- **请求方式**: `GET`
- **请求 URL**: `{API_PREFIX}/hobi!getTrend.action`
- **Query 参数示例**:
  ```
  symbol=GOLD
  ```

#### 返回数据结构

```javascript
[
  {
    timestamp: "1763366893931",    // 时间戳（毫秒）
    price: "3760.24",              // 当前价格
    volume: "12345",               // 成交量
    open: "3748.99"                // 开盘价
  }
  // ... 更多分时数据点
]
```

#### 调用示例

```javascript
import { _getTrend } from '@/service/trade.api'

// 获取黄金分时图数据
const res = await _getTrend('XAUUSD')

// 获取白银分时图数据
const res = await _getTrend('XAGUSD')
```

#### 接口实现代码

```javascript
export const _getTrend = (symbol) => {
  let apiSymbol = symbol;

  const symbolMapping = {
    'XAUUSD': 'GOLD',
    'XAGUSD': 'Silver',
    'XALUSD': 'Aluminum',
    'XCUUSD': 'COPPER',
    'XNIUSD': 'Nickel',
    'XPBUSD': 'Lead',
    'XZNUSD': 'Zinc',
    'XPTUSD': 'Platinum',
    'XPDUSD': 'Palladium',
    'UKOIL': 'UKOIL',
    'USOIL': 'USOIL'
  };

  apiSymbol = symbolMapping[symbol] || symbol;

  console.log(`📈 分时图API调用: ${symbol} -> ${apiSymbol}`);

  return request({
    url: `${API_PREFIX}/hobi!getTrend.action`,
    method: 'GET',
    params: {
      symbol: apiSymbol
    }
  }).catch((error) => {
    console.error(`❌ 分时图API调用失败: ${symbol} -> ${apiSymbol}`, error);
    return [];
  })
}
```

---

### 6. 获取交易记录

**接口名称**: `_getTrade()`
**文件路径**: `src/service/trade.api.js:388-404`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| symbol | String | 是 | 商品符号（支持 XAUUSD→GOLD、XAGUSD→Silver 映射） |

#### 请求信息

- **请求方式**: `GET`
- **请求 URL**: `{API_PREFIX}/hobi!getTrade.action`

#### 返回数据结构

```javascript
[
  {
    timestamp: "1763366893931",
    price: "3760.24",
    volume: "1000",
    direction: "BUY"  // BUY 或 SELL
  }
  // ... 更多交易记录
]
```

#### 调用示例

```javascript
import { _getTrade } from '@/service/trade.api'

// 获取黄金交易记录
const res = await _getTrade('XAUUSD')
```

#### 接口实现代码

```javascript
export const _getTrade = (symbol) => {
  let apiSymbol = symbol;
  if (symbol === 'XAUUSD') {
    apiSymbol = 'GOLD';
  } else if (symbol === 'XAGUSD') {
    apiSymbol = 'Silver';
  }

  return request({
    url: `${API_PREFIX}/hobi!getTrade.action`,
    method: 'GET',
    params: {
      symbol: apiSymbol
    }
  })
}
```

---

### 7. 获取深度数据

**接口名称**: `_getDeepData()`
**文件路径**: `src/service/trade.api.js:407-423`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| symbol | String | 是 | 商品符号 |

#### 请求信息

- **请求方式**: `GET`
- **请求 URL**: `{API_PREFIX}/hobi!getDepth.action`

#### 返回数据结构

```javascript
{
  symbol: "GOLD",
  asks: [                          // 卖盘（价格从低到高）
    { price: "3761.00", volume: "100" },
    { price: "3761.50", volume: "200" },
    { price: "3762.00", volume: "150" }
    // ... 卖十
  ],
  bids: [                          // 买盘（价格从高到低）
    { price: "3760.00", volume: "150" },
    { price: "3759.50", volume: "250" },
    { price: "3759.00", volume: "180" }
    // ... 买十
  ]
}
```

#### 调用示例

```javascript
import { _getDeepData } from '@/service/trade.api'

// 获取黄金深度数据
const res = await _getDeepData('XAUUSD')
```

#### 接口实现代码

```javascript
export const _getDeepData = (symbol) => {
  let apiSymbol = symbol;
  if (symbol === 'XAUUSD') {
    apiSymbol = 'GOLD';
  } else if (symbol === 'XAGUSD') {
    apiSymbol = 'Silver';
  }

  return request({
    url: `${API_PREFIX}/hobi!getDepth.action`,
    method: 'GET',
    params: {
      symbol: apiSymbol
    }
  })
}
```

---

## 三、RWA 新接口 API

### 8. 获取 RWA 资产行情列表

**接口名称**: `getRWAQuotes()`
**文件路径**: `src/service/newApi/rwa.js:31-130`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| data.categoryCode | String | 否 | 分类：'stocks'(股票)、'forex'(外汇)、'crypto'(加密货币)、'all'(全部) |
| data.keyword | String | 否 | 搜索关键词（前端过滤） |
| controller | AbortController | 否 | 用于中止请求 |

#### 请求信息

- **请求方式**: `GET`
- **内部调用的端点**:
  - `/api/example/home/stocks` - 股票数据
  - `/api/example/forex/quotes` - 外汇数据
  - `/api/example/crypto/quotes` - 加密货币数据

#### 返回数据结构

```javascript
{
  success: true,
  count: 25,
  data: {
    tick_list: [
      {
        code: "AAPL.US",
        name: "苹果公司",
        tick_time: "1763366893931",
        price: "178.25",
        volume: "52400000",
        turnover: "9330000000.00",
        change: 2.20,
        changeRatio: 1.25,
        high: 179.50,
        low: 176.80,
        open: 177.00,
        preClose: 176.05,
        categoryCode: "stocks",
        categoryName: "股票",
        icon: "https://...",
        seq: "2161475"
      }
      // ... 更多资产
    ]
  }
}
```

#### 调用示例

```javascript
import rwaApi from '@/service/newApi/rwa'

// 获取所有 RWA 资产
const res = await rwaApi.getRWAQuotes({}, controller)

// 获取外汇行情
const res = await rwaApi.getRWAQuotes({ categoryCode: 'forex' })

// 搜索特定资产
const res = await rwaApi.getRWAQuotes({
  categoryCode: 'stocks',
  keyword: 'AAPL'
})
```

---

### 9. 获取 RWA 资产分类

**接口名称**: `getRWACategories()`
**文件路径**: `src/service/newApi/rwa.js:139-172`

#### 请求信息

- **请求方式**: `GET`
- **无需参数**

#### 返回数据结构

```javascript
{
  success: true,
  data: {
    categories: [
      {
        id: 1,
        code: "stocks",
        name: "股票",
        enName: "Stocks",
        icon: "",
        sort: 1
      },
      {
        id: 2,
        code: "forex",
        name: "外汇",
        enName: "Forex",
        icon: "",
        sort: 2
      },
      {
        id: 3,
        code: "crypto",
        name: "加密货币",
        enName: "Crypto",
        icon: "",
        sort: 3
      }
    ]
  }
}
```

#### 调用示例

```javascript
import rwaApi from '@/service/newApi/rwa'

// 获取所有资产分类
const res = await rwaApi.getRWACategories()
```

---

### 10. 获取 RWA K线数据

**接口名称**: `getRWAKlineData()`
**文件路径**: `src/service/newApi/rwa.js:337-339`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| params.code | String | 是 | 资产代码，如 'AAPL.US'、'EURUSD' |
| params.klineType | Number | 是 | K线类型：1(分时)、2(1分)、3(5分)、4(15分)、5(30分)、6(1小时)、7(日K)、8(周K)、9(月K) |
| params.marketType | String | 是 | 市场类型：'stock'、'forex'、'crypto' |
| params.adjustType | Number | 否 | 复权类型：0(不复权)、1(前复权)、2(后复权)，仅股票有效 |
| params.num | Number | 否 | 返回数据条数，默认100 |

#### 请求信息

- **请求方式**: `GET`
- **请求 URL**: `/api/alltick/kline/klineData`

#### K线类型说明

| klineType | 说明 | 适用场景 |
|-----------|------|---------|
| 1 | 分时 | 实时行情 |
| 2 | 1分钟 | 短线交易 |
| 3 | 5分钟 | 短线交易 |
| 4 | 15分钟 | 短线交易 |
| 5 | 30分钟 | 短线交易 |
| 6 | 1小时 | 日内交易 |
| 7 | 日K | 中长期分析 |
| 8 | 周K | 中长期分析 |
| 9 | 月K | 长期投资 |

#### 返回数据结构

```javascript
{
  success: true,
  data: {
    code: "9988.HK",
    kline_type: 7,
    adjust_type: 0,
    kline_data: [
      {
        timestamp: "1763049600",
        open_price: "154.000000",
        close_price: "154.900000",
        high_price: "155.500000",
        low_price: "153.800000",
        volume: "19956444",
        turnover: "12900520613.000000"
      }
      // ... 更多K线数据
    ]
  }
}
```

#### 调用示例

```javascript
import rwaApi from '@/service/newApi/rwa'

// 查询股票日K线数据
const res = await rwaApi.getRWAKlineData({
  code: 'AAPL.US',
  klineType: 7,
  marketType: 'stock',
  adjustType: 0,
  num: 100
})

// 查询外汇5分钟K线
const res = await rwaApi.getRWAKlineData({
  code: 'EURUSD',
  klineType: 3,
  marketType: 'forex',
  num: 200
})

// 查询加密货币1小时K线
const res = await rwaApi.getRWAKlineData({
  code: 'BTCUSDT',
  klineType: 6,
  marketType: 'crypto',
  num: 150
})
```

---

## 四、市场配置 API

### 11. 获取支持的K线类型

**接口名称**: `getKlineTypes()`
**文件路径**: `src/service/newApi/marketConfig.js:28-30`

#### 请求信息

- **请求方式**: `GET`
- **请求 URL**: `/api/alltick/market/kline/types`

#### 返回数据结构

```javascript
{
  success: true,
  data: {
    kline_types: [
      "1分钟",
      "5分钟",
      "15分钟",
      "30分钟",
      "60分钟",
      "日K",
      "周K",
      "月K"
    ]
  }
}
```

---

### 12. 获取支持的市场类型

**接口名称**: `getMarketTypes()`
**文件路径**: `src/service/newApi/marketConfig.js:53-55`

#### 请求信息

- **请求方式**: `GET`
- **请求 URL**: `/api/alltick/market/market/types`

#### 返回数据结构

```javascript
{
  success: true,
  data: {
    market_types: [
      "stock",     // 股票
      "forex",     // 外汇
      "crypto",    // 加密货币
      "futures"    // 期货
    ]
  }
}
```

---

## 五、商品符号映射表

### 贵金属类

| 符号 | 中文名称 | 英文名称 | API符号 | 单位 |
|-----|---------|---------|--------|------|
| XAUUSD | 黄金 | Gold | GOLD | 美元/盎司 |
| XAGUSD | 白银 | Silver | Silver | 美元/盎司 |
| XPTUSD | 铂金 | Platinum | Platinum | 美元/盎司 |
| XPDUSD | 钯金 | Palladium | Palladium | 美元/盎司 |

### 工业金属类

| 符号 | 中文名称 | 英文名称 | API符号 |
|-----|---------|---------|--------|
| XCUUSD | 铜 | Copper | COPPER |
| XALUSD | 铝 | Aluminum | Aluminum |
| XNIUSD | 镍 | Nickel | Nickel |
| XZNUSD | 锌 | Zinc | Zinc |
| XPBUSD | 铅 | Lead | Lead |

### 能源类

| 符号 | 中文名称 | 英文名称 | API符号 | 单位 |
|-----|---------|---------|--------|------|
| UKOIL | 布伦特原油 | Brent Crude Oil | UKOIL | 美元/桶 |
| USOIL | 美国原油 | WTI Crude Oil | USOIL | 美元/桶 |

---

## 六、实际使用示例

### 示例 1: 大宗商品列表页

```javascript
import { _getCommoditiesRealtime } from '@/service/quotes.api'
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const commoditiesList = ref([])
    const loading = ref(false)
    const pageNo = ref(1)
    const finished = ref(false)

    // 加载大宗商品数据
    const loadCommoditiesData = async () => {
      loading.value = true
      try {
        const res = await _getCommoditiesRealtime(pageNo.value, 'zh-CN')
        if (res && res.data && res.data.tick_list) {
          commoditiesList.value = res.data.tick_list
          finished.value = res.data.tick_list.length < 20
        }
      } catch (error) {
        console.error('加载大宗商品数据失败:', error)
      } finally {
        loading.value = false
      }
    }

    // 下拉刷新
    const onRefresh = () => {
      pageNo.value = 1
      loadCommoditiesData()
    }

    // 上拉加载更多
    const onLoadMore = () => {
      if (!finished.value) {
        pageNo.value++
        loadCommoditiesData()
      }
    }

    // 初始化加载
    onMounted(() => {
      loadCommoditiesData()
    })

    return {
      commoditiesList,
      loading,
      finished,
      onRefresh,
      onLoadMore
    }
  }
}
```

---

### 示例 2: 黄金K线图

```javascript
import { _getKline } from '@/service/trade.api'
import { ref, watch } from 'vue'

export default {
  setup() {
    const symbol = ref('XAUUSD')
    const timeFrame = ref('1day')
    const klineData = ref([])
    const loading = ref(false)

    // 加载K线数据
    const loadKlineData = async () => {
      loading.value = true
      try {
        // 传入XAUUSD，API会自动转换为GOLD
        const res = await _getKline(symbol.value, timeFrame.value)
        klineData.value = res || []

        // 处理K线数据用于图表展示
        const chartData = klineData.value.map(item => ({
          time: Number(item.timestamp),
          open: Number(item.open),
          close: Number(item.close),
          high: Number(item.high),
          low: Number(item.low),
          volume: Number(item.volume)
        }))

        // 渲染图表
        renderChart(chartData)
      } catch (error) {
        console.error('加载K线数据失败:', error)
        klineData.value = []
      } finally {
        loading.value = false
      }
    }

    // 切换时间周期
    const changeTimeFrame = (newTimeFrame) => {
      timeFrame.value = newTimeFrame
      loadKlineData()
    }

    // 监听商品符号变化
    watch(symbol, () => {
      loadKlineData()
    })

    return {
      symbol,
      timeFrame,
      klineData,
      loading,
      changeTimeFrame
    }
  }
}
```

---

### 示例 3: RWA 外汇行情列表

```javascript
import rwaApi from '@/service/newApi/rwa'
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const forexList = ref([])
    const loading = ref(false)
    const controller = ref(null)

    // 加载外汇行情
    const loadForexQuotes = async () => {
      loading.value = true

      // 创建 AbortController 用于取消请求
      controller.value = new AbortController()

      try {
        const res = await rwaApi.getRWAQuotes(
          { categoryCode: 'forex' },
          controller.value
        )

        if (res.success && res.data?.tick_list) {
          forexList.value = res.data.tick_list
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('加载外汇数据失败:', error)
        }
      } finally {
        loading.value = false
      }
    }

    // 搜索外汇
    const searchForex = async (keyword) => {
      loading.value = true
      try {
        const res = await rwaApi.getRWAQuotes({
          categoryCode: 'forex',
          keyword: keyword
        })

        if (res.success && res.data?.tick_list) {
          forexList.value = res.data.tick_list
        }
      } catch (error) {
        console.error('搜索失败:', error)
      } finally {
        loading.value = false
      }
    }

    // 组件卸载时取消请求
    onUnmounted(() => {
      if (controller.value) {
        controller.value.abort()
      }
    })

    // 初始化加载
    onMounted(() => {
      loadForexQuotes()
    })

    return {
      forexList,
      loading,
      searchForex
    }
  }
}
```

---

### 示例 4: 商品详情页（综合使用）

```javascript
import { _getHomeList, _getKline, _getTrend, _getDeepData } from '@/service/trade.api'
import { ref, onMounted } from 'vue'

export default {
  props: {
    symbol: {
      type: String,
      required: true,
      default: 'XAUUSD'
    }
  },
  setup(props) {
    const realtimeData = ref(null)
    const klineData = ref([])
    const trendData = ref([])
    const depthData = ref(null)

    // 加载实时数据
    const loadRealtimeData = async () => {
      try {
        const res = await _getHomeList(props.symbol, true)
        realtimeData.value = res
      } catch (error) {
        console.error('加载实时数据失败:', error)
      }
    }

    // 加载K线数据
    const loadKlineData = async (timeFrame = '1day') => {
      try {
        const res = await _getKline(props.symbol, timeFrame)
        klineData.value = res || []
      } catch (error) {
        console.error('加载K线数据失败:', error)
      }
    }

    // 加载分时数据
    const loadTrendData = async () => {
      try {
        const res = await _getTrend(props.symbol)
        trendData.value = res || []
      } catch (error) {
        console.error('加载分时数据失败:', error)
      }
    }

    // 加载深度数据
    const loadDepthData = async () => {
      try {
        const res = await _getDeepData(props.symbol)
        depthData.value = res
      } catch (error) {
        console.error('加载深度数据失败:', error)
      }
    }

    // 初始化加载所有数据
    onMounted(() => {
      loadRealtimeData()
      loadKlineData()
      loadTrendData()
      loadDepthData()

      // 设置定时刷新（每5秒）
      const timer = setInterval(() => {
        loadRealtimeData()
        loadDepthData()
      }, 5000)

      // 清理定时器
      onUnmounted(() => {
        clearInterval(timer)
      })
    })

    return {
      realtimeData,
      klineData,
      trendData,
      depthData,
      loadKlineData
    }
  }
}
```

---

## 七、关键注意事项

### ⚠️ 语言处理规则

1. **大宗商品（commodities）**：固定使用中文（`zh-CN`），无法修改
2. **K线数据**：固定使用英文（`en`），避免多次调用导致的语言混乱
3. **其他接口**：可以自定义语言参数

```javascript
// 示例：大宗商品自动使用中文
const res = await _getCoins({ type: 'commodities' })
// 实际请求参数会自动变为 { type: 'commodities', language: 'zh-CN' }
```

---

### ⚠️ 符号转换规则

- 调用 K线、分时、交易记录、深度数据等接口时
- 大宗商品符号（如 `XAUUSD`）会自动转换为 API 符号（如 `GOLD`）
- **无需手动转换**，SDK 内部已处理

```javascript
// 错误做法：手动转换
const res = await _getKline('GOLD', '1day')  // ❌ 不要这样做

// 正确做法：使用原始符号
const res = await _getKline('XAUUSD', '1day')  // ✅ SDK会自动转换
```

---

### ⚠️ 数据过滤规则

- `_getCoins()` 接口返回大宗商品时，会自动过滤掉 `XAUUSD` 和 `XAGUSD`
- 这是业务逻辑需要，并非 API 限制
- 如需获取黄金和白银数据，请使用 `_getCommoditiesRealtime()` 接口

---

### ⚠️ 时间戳格式差异

| 数据类型 | 时间戳格式 | 位数 | 示例 |
|---------|-----------|------|------|
| 行情数据 | 毫秒 | 13位 | 1763366893931 |
| K线数据 | 秒 | 10位 | 1763049600 |
| 分时数据 | 毫秒 | 13位 | 1763366893931 |

```javascript
// 转换示例
const timestampMs = 1763366893931  // 毫秒
const timestampS = 1763049600      // 秒

// 毫秒转秒
const seconds = Math.floor(timestampMs / 1000)

// 秒转毫秒
const milliseconds = timestampS * 1000

// 转换为Date对象
const date = new Date(timestampMs)
```

---

### ⚠️ 错误处理最佳实践

```javascript
// 方式 1: 使用 catch 返回默认值
const klineData = await _getKline(symbol, '1day').catch(() => [])

// 方式 2: 使用 try-catch
try {
  const res = await _getCommoditiesRealtime(1)
  // 处理数据
  if (res && res.data && res.data.tick_list) {
    commoditiesList.value = res.data.tick_list
  }
} catch (error) {
  console.error('API调用失败:', error)
  // 显示错误提示给用户
  showErrorToast('加载失败，请稍后重试')
}

// 方式 3: 统一错误处理
const safeApiCall = async (apiFunc, fallback = null) => {
  try {
    return await apiFunc()
  } catch (error) {
    console.error('API调用失败:', error)
    return fallback
  }
}

// 使用统一错误处理
const res = await safeApiCall(
  () => _getKline('XAUUSD', '1day'),
  []
)
```

---

### ⚠️ 请求取消处理（RWA API）

```javascript
import { ref, onUnmounted } from 'vue'

// 创建 AbortController
const controller = ref(null)

// 发起可取消的请求
const loadData = async () => {
  // 取消之前的请求
  if (controller.value) {
    controller.value.abort()
  }

  // 创建新的控制器
  controller.value = new AbortController()

  try {
    const res = await rwaApi.getRWAQuotes(
      { categoryCode: 'forex' },
      controller.value
    )
    // 处理数据
  } catch (error) {
    // 忽略取消错误
    if (error.name !== 'AbortError') {
      console.error('请求失败:', error)
    }
  }
}

// 组件卸载时取消请求
onUnmounted(() => {
  if (controller.value) {
    controller.value.abort()
  }
})
```

---

### ⚠️ API_PREFIX 配置

在 `src/config/index.js` 中定义的 API 前缀：

```javascript
export const API_PREFIX = process.env.VUE_APP_API_PREFIX || ''
```

**环境配置**：

- 开发环境：`.env.development`
- 生产环境：`.env.production`

```bash
# .env.development
VUE_APP_API_PREFIX=https://dev-api.example.com

# .env.production
VUE_APP_API_PREFIX=https://api.example.com
```

---

## 八、常见问题 FAQ

### Q1: 为什么获取黄金K线数据时要传入 XAUUSD 而不是 GOLD？

**A**: 为了保持代码的一致性和可读性，SDK 会自动处理符号映射。你只需要使用业务层的符号（如 XAUUSD），SDK 内部会自动转换为 API 需要的符号（GOLD）。

---

### Q2: 为什么大宗商品列表中没有黄金和白银？

**A**: `_getCoins()` 接口会自动过滤掉 XAUUSD 和 XAGUSD。如果需要获取黄金和白银的数据，请使用 `_getCommoditiesRealtime()` 接口。

---

### Q3: 如何判断市场是否开盘？

**A**: 通过行情数据中的 `market.status` 字段判断：
- `trading`: 交易中
- `closed`: 已休市

```javascript
const res = await _getHomeList('XAUUSD', true)
if (res.market.status === 'trading') {
  console.log('市场开盘中')
} else {
  console.log('市场已休市')
}
```

---

### Q4: K线数据返回为空怎么办？

**A**: 可能的原因：
1. 符号不正确或不支持
2. 时间周期参数错误
3. API 调用失败

建议使用错误处理返回空数组：
```javascript
const klineData = await _getKline(symbol, '1day').catch(() => [])
```

---

### Q5: 如何实现行情数据的实时刷新？

**A**: 使用定时器定期调用 API：

```javascript
let timer = null

onMounted(() => {
  loadData()
  timer = setInterval(() => {
    loadData()
  }, 5000)  // 每5秒刷新一次
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
```

---

## 九、更新日志

### v1.0 (2025-11-22)
- 初始版本
- 添加所有大宗商品相关 API 文档
- 添加 RWA 新接口文档
- 添加实际使用示例
- 添加常见问题 FAQ

---

## 十、联系方式

如有问题或需要补充文档，请联系：
- 技术支持：技术部
- 文档维护：开发团队

---

**文档结束**
