# 大宗商品 Constract 组件 API 兼容性分析

## 一、Constract 组件使用的 API

### 1. 从 `currency.js` 导入的接口

| 接口名 | 用途 | 调用示例 |
|-------|------|---------|
| `getAllSymbolDetails()` | 获取所有币种信息 | `Axios.getAllSymbolDetails({ type: 'commodities' })` |
| `getRealtime()` | 获取实时行情数据 | `Axios.getRealtime({ symbol: 'XAUUSD' })` |
| `addItemUserOptiona()` | 添加自选币种 | `Axios.addItemUserOptiona({ symbol: 'XAUUSD' })` |
| `deleteItemUserOptiona()` | 删除自选币种 | `Axios.deleteItemUserOptiona({ symbol: 'XAUUSD' })` |
| `getItemOptionalStatus()` | 查询自选列表 | `Axios.getItemOptionalStatus()` |
| `currencyPaypal()` | 获取钱包资产 | `Axios.currencyPaypal()` |

### 2. 从 `kline.js` 导入的接口

| 接口名 | 用途 | 调用示例 |
|-------|------|---------|
| `getKline()` | 获取K线数据 | `AxiosKline.getKline({ symbol: 'XAUUSD', line: '1day' })` |

---

## 二、大宗商品 API 文档要求

### 1. 核心要求

**接口路径：**
- ❌ 旧版：`/api/hobi!getKline.action`
- ✅ 新版：`/api/hobi!getKlineV1.action`

**符号映射要求：**
```javascript
XAUUSD → GOLD
XAGUSD → Silver
XCUUSD → COPPER
// ... 等等
```

**语言参数：**
- K线接口固定使用 `language=en`
- 其他接口大宗商品时使用 `language=zh-CN`

---

## 三、兼容性问题分析

### ⚠️ 问题 1: K线接口版本不匹配

**现状：**
- `kline.js` 使用：`/api/hobi!getKline.action`
- 大宗商品要求：`/api/hobi!getKlineV1.action`

**影响：**
- 可能导致 K线数据无法正确获取
- 如果后端不支持旧版接口，会返回错误

### ⚠️ 问题 2: 缺少符号映射

**现状：**
- `kline.js` 的 `getKline()` 直接传递原始符号
- 没有 XAUUSD → GOLD 的转换逻辑

**影响：**
- 大宗商品 K线数据可能无法获取
- 后端可能不认识 XAUUSD 这样的符号

### ✅ 无问题：其他接口

| 接口 | 兼容性 | 说明 |
|------|--------|------|
| `getAllSymbolDetails()` | ✅ 完全兼容 | 通过 `type='commodities'` 参数即可 |
| `getRealtime()` | ✅ 完全兼容 | 通用接口，支持所有类型 |
| 自选相关接口 | ✅ 完全兼容 | 通用接口，支持所有类型 |

---

## 四、解决方案

### 方案 1: 修改 kline.js（推荐）⭐

**优点：**
- 统一所有页面的 K线接口
- 一次修改，全局生效

**缺点：**
- 可能影响其他页面（需要测试）

**实现：**
```javascript
// src/api/kline.js
function getKline(data) {
  // 判断是否为大宗商品
  const isCommodities = data.type === 'commodities';
  
  // 符号映射
  const symbolMapping = {
    'XAUUSD': 'GOLD',
    'XAGUSD': 'Silver',
    // ... 其他映射
  };
  
  const params = { ...data };
  
  if (isCommodities && symbolMapping[data.symbol]) {
    params.symbol = symbolMapping[data.symbol];
  }
  
  // 使用 V1 接口
  return Axios.fetch("/api/hobi!getKlineV1.action", params);
}
```

### 方案 2: 在 Constract 组件中拦截（不推荐）

**优点：**
- 不影响其他页面

**缺点：**
- 代码侵入性强
- 维护困难
- 重复代码

### 方案 3: 创建独立的大宗商品 Constract 组件（不推荐）

**优点：**
- 完全独立，互不影响

**缺点：**
- 代码重复
- 维护成本高

---

## 五、推荐的实施步骤

### Step 1: 检查现有接口是否支持 V1 版本

```bash
# 测试旧版接口
curl "https://jpmx.xyz/api/hobi!getKline.action?symbol=GOLD&line=1day"

# 测试新版接口
curl "https://jpmx.xyz/api/hobi!getKlineV1.action?symbol=GOLD&line=1day"
```

### Step 2: 修改 kline.js 支持符号映射

```javascript
// src/api/kline.js
import Axios from "@/utils/http";

// 大宗商品符号映射表
const COMMODITY_SYMBOL_MAP = {
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

function getKline(data) {
  const params = { ...data };
  
  // 如果是大宗商品符号，进行映射
  if (params.symbol && COMMODITY_SYMBOL_MAP[params.symbol]) {
    console.log(`🔄 符号映射: ${params.symbol} -> ${COMMODITY_SYMBOL_MAP[params.symbol]}`);
    params.symbol = COMMODITY_SYMBOL_MAP[params.symbol];
  }
  
  return Axios.fetch("/api/hobi!getKlineV1.action", params);
}

export default {
  getKline,
};
```

### Step 3: 测试验证

1. 测试数字货币 K线（确保不影响）
2. 测试美股 K线（确保不影响）
3. 测试大宗商品 K线（XAUUSD、XAGUSD、USOIL）

---

## 六、备用方案：commodities.js 导出包装函数

如果修改 `kline.js` 有风险，可以在 `commodities.js` 中创建包装函数：

```javascript
// src/api/commodities.js

// 导入原始的 kline API
import AxiosKline from '@/api/kline'

// 包装后的 K线函数（已实现）
export const getCommoditiesKline = (symbol, line, controller) => {
  const apiSymbol = convertSymbol(symbol)
  return AxiosKline.getKline({
    symbol: apiSymbol,
    line,
    language: 'en'
  })
}
```

然后在 Constract 组件中判断 `pageType`，如果是 'commodities'，则使用 commodities.js 的函数。

---

## 七、结论

### ✅ 可以直接使用的接口（无需修改）
- getAllSymbolDetails
- getRealtime
- addItemUserOptiona
- deleteItemUserOptiona
- getItemOptionalStatus
- currencyPaypal

### ⚠️ 需要处理的接口
- **getKline** - 需要符号映射和使用 V1 版本

### 推荐行动
1. ✅ **立即测试**：访问 `/commodities/constract/XAUUSD` 看是否能正常显示
2. ⚠️ **关注点**：重点观察 K线图是否正常加载
3. 🔧 **修复方案**：如果 K线加载失败，使用方案 1 修改 kline.js

---

**文档创建时间：** 2025-11-22
**作者：** AI Assistant
**状态：** 待测试验证
