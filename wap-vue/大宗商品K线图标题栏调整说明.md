# 大宗商品K线图标题栏调整说明

## 修改时间
2025年11月6日

## 修改目的
调整大宗商品K线图详情页面顶部标题栏的显示格式，使用itemSummary API获取的symbol字段作为括号内的显示内容。

## 页面路径
`syn/?lang=en#/quotes/detail?symbol=Platinum&type=commodities`

## 修改需求

### 当前显示格式
- **铂金**：`铂金（XPTUSD）`
- **黄金**：`黄金（XAUUSD）`
- **白银**：`白银（XAGUSD）`

### 修改后格式
- **铂金**：`铂金（Platinum）`
- **黄金**：`黄金（GOLD）` 或 `Gold（Gold）`（根据语言环境）
- **白银**：`白银（Silver）` 或 `Silver（Silver）`（根据语言环境）

### 格式规则
1. **商品名称**：使用i18n翻译的商品名称（如"铂金"、"黄金"、"白银"）
2. **括号内容**：使用从 itemSummary API 获取的 `symbol` 字段（如"Platinum"、"GOLD"、"Silver"）

## API接口说明

### itemSummary API
**请求URL：** `https://jpmx.xyz/api/item/itemSummary/get?symbol={symbol}&language=zh-CN`

**请求方法：** `GET`

**请求参数：**
- `symbol`: 商品符号（如 Platinum、XAUUSD、XAGUSD）
- `language`: 语言代码（如 zh-CN、en、Japanese）

**返回示例（Platinum）：**
```json
{
  "data": {
    "uuid": "1972744436152897538",
    "symbolName": "XAUUSD",
    "symbol": "Platinum",
    "createTime": "2025-09-30 03:23:14",
    "updateTime": "2025-09-30 03:23:14",
    "delFlag": 0,
    "lang": "en"
  },
  "code": 0,
  "msg": "",
  "total": 0,
  "succeed": true
}
```

**使用字段：**
- `data.symbol`: 商品symbol，用于显示在括号内（如 "Platinum"）

## 技术实现

### 修改文件
`wap-vue/src/views/quotes/Detail.vue`

### 修改内容

#### 1. 新增辅助函数 `getDisplaySymbol`（第399-417行）

```javascript
// 获取商品显示用的symbol（从itemSummary API）
const getDisplaySymbol = async (originalSymbol) => {
  try {
    const summaryResponse = await fetch(`https://jpmx.xyz/api/item/itemSummary/get?symbol=${originalSymbol}&language=zh-CN`);
    const summaryData = await summaryResponse.json();
    console.log('📊 getDisplaySymbol API返回数据:', summaryData);
    
    if (summaryData && summaryData.code === 0 && summaryData.data && summaryData.data.symbol) {
      console.log('✅ 返回itemSummary的symbol:', summaryData.data.symbol);
      return summaryData.data.symbol;
    }
  } catch (error) {
    console.warn('⚠️ 获取displaySymbol失败:', error);
  }
  
  // 如果API失败，返回原始symbol
  console.log('⚠️ 返回原始symbol:', originalSymbol);
  return originalSymbol;
};
```

**功能说明：**
- 调用itemSummary API获取商品的symbol字段
- 如果API失败或返回无效数据，返回原始symbol作为fallback
- 使用async/await处理异步请求

#### 2. 修改 `getCommoditiesData` 函数（第1158-1160行）

**修改前：**
```javascript
// 提取实际交易符号
const actualSymbol = extractSymbolFromName(commodityData.name) || originalSymbol;

console.log('🔍 翻译后的名称:', translatedName, '实际交易符号:', actualSymbol);

// 设置chartData
chartData.value = {
  name: `${translatedName}（${actualSymbol}）`,
  // ...
};
```

**修改后：**
```javascript
// 调用辅助函数获取商品显示用的symbol
const displaySymbol = await getDisplaySymbol(originalSymbol);
console.log('🔍 翻译后的名称:', translatedName, '显示symbol:', displaySymbol);

// 设置chartData
chartData.value = {
  name: `${translatedName}（${displaySymbol}）`,
  // ...
};
```

**修改说明：**
- 移除了从name字段提取symbol的逻辑（`extractSymbolFromName`）
- 改为调用 `getDisplaySymbol` 函数获取symbol
- 使用API返回的symbol作为显示内容

## 商品名称显示对照表

### 中文环境（lang=zh-CN）

| 商品 | 原始Symbol | API返回的Symbol | 修改前显示 | 修改后显示 |
|-----|-----------|----------------|-----------|-----------|
| 铂金 | Platinum | Platinum | 铂金（XPTUSD） | 铂金（Platinum） |
| 黄金 | XAUUSD | GOLD | 黄金（XAUUSD） | 黄金（GOLD） |
| 白银 | XAGUSD | Silver | 白银（XAGUSD） | 白银（Silver） |
| 铝 | Aluminum | Aluminum | 铝（XALUSD） | 铝（Aluminum） |
| 铜 | COPPER | COPPER | 铜（XCUUSD） | 铜（COPPER） |
| 铅 | Lead | Lead | 铅（XPBUSD） | 铅（Lead） |
| 锌 | Zinc | Zinc | 锌（XZNUSD） | 锌（Zinc） |
| 镍 | Nickel | Nickel | 镍（XNIUSD） | 镍（Nickel） |

### 英文环境（lang=en）

| 商品 | 原始Symbol | API返回的Symbol | 修改前显示 | 修改后显示 |
|-----|-----------|----------------|-----------|-----------|
| Platinum | Platinum | Platinum | Platinum（XPTUSD） | Platinum（Platinum） |
| Gold | XAUUSD | GOLD | Gold（XAUUSD） | Gold（GOLD） |
| Silver | XAGUSD | Silver | Silver（XAGUSD） | Silver（Silver） |
| Aluminum | Aluminum | Aluminum | Aluminum（XALUSD） | Aluminum（Aluminum） |
| Copper | COPPER | COPPER | Copper（XCUUSD） | Copper（COPPER） |

### 日文环境（lang=Japanese）

| 商品 | 原始Symbol | API返回的Symbol | 修改前显示 | 修改后显示 |
|-----|-----------|----------------|-----------|-----------|
| 白金 | Platinum | Platinum | 白金（XPTUSD） | 白金（Platinum） |
| 金 | XAUUSD | GOLD | 金（XAUUSD） | 金（GOLD） |
| 銀 | XAGUSD | Silver | 銀（XAGUSD） | 銀（Silver） |
| アルミニウム | Aluminum | Aluminum | アルミニウム（XALUSD） | アルミニウム（Aluminum） |
| 銅 | COPPER | COPPER | 銅（XCUUSD） | 銅（COPPER） |

## 测试步骤

### 1. 重启开发服务器
```bash
cd D:\Awww\mt5new\template\wap-vue

# 停止当前服务器（Ctrl + C）
# 然后重新启动
npm run dev
```

### 2. 清除浏览器缓存
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

### 3. 测试不同商品

#### 测试铂金
访问：`syn/?lang=zh-CN#/quotes/detail?symbol=Platinum&type=commodities`

**验证点：**
- ✅ 顶部标题栏显示：`铂金（Platinum）`
- ✅ 不是：`铂金（XPTUSD）`

#### 测试黄金
访问：`syn/?lang=zh-CN#/quotes/detail?symbol=XAUUSD&type=commodities`

**验证点：**
- ✅ 顶部标题栏显示：`黄金（GOLD）`
- ✅ 不是：`黄金（XAUUSD）`

#### 测试白银
访问：`syn/?lang=zh-CN#/quotes/detail?symbol=XAGUSD&type=commodities`

**验证点：**
- ✅ 顶部标题栏显示：`白银（Silver）`
- ✅ 不是：`白银（XAGUSD）`

#### 测试铝
访问：`syn/?lang=zh-CN#/quotes/detail?symbol=Aluminum&type=commodities`

**验证点：**
- ✅ 顶部标题栏显示：`铝（Aluminum）`
- ✅ 不是：`铝（XALUSD）`

### 4. 测试多语言环境

#### 英文环境
访问：`syn/?lang=en#/quotes/detail?symbol=Platinum&type=commodities`

**验证点：**
- ✅ 顶部标题栏显示：`Platinum（Platinum）`

#### 日文环境
访问：`syn/?lang=Japanese#/quotes/detail?symbol=Platinum&type=commodities`

**验证点：**
- ✅ 顶部标题栏显示：`白金（Platinum）`

### 5. 测试API失败情况

如果itemSummary API失败（网络错误或返回错误），应该使用原始symbol作为fallback：
- ✅ 显示：`铂金（Platinum）`（使用原始symbol）

### 6. 控制台日志验证

检查浏览器控制台输出：

```
📊 getDisplaySymbol API返回数据: {data: {symbol: "Platinum", ...}, code: 0, ...}
✅ 返回itemSummary的symbol: Platinum
🔍 翻译后的名称: 铂金 显示symbol: Platinum
✅ 设置的chartData: {name: "铂金（Platinum）", ...}
```

## 技术要点

### 1. API调用顺序
```
1. getCommoditiesData() 被调用
2. 调用 getDisplaySymbol(originalSymbol)
3. getDisplaySymbol 调用 itemSummary API
4. 使用返回的 symbol 构建标题
5. 设置 chartData.value.name
```

### 2. Fallback机制
```
itemSummary API成功 → 使用API返回的symbol
         ↓ 失败
使用原始symbol（originalSymbol）
```

### 3. 异步处理
- 使用 `async/await` 处理API异步请求
- `getDisplaySymbol` 是异步函数
- `getCommoditiesData` 中 await 调用 `getDisplaySymbol`

### 4. 错误处理
```javascript
try {
  // 调用API
} catch (error) {
  // 返回fallback值
  return originalSymbol;
}
```

## 注意事项

1. **API依赖**
   - 依赖 itemSummary API 的正常运行
   - 如果API失败，会自动使用原始symbol作为fallback

2. **性能考虑**
   - 每次加载K线图页面都会调用itemSummary API
   - API调用是异步的，不会阻塞页面渲染

3. **缓存**
   - 当前实现没有缓存机制
   - 如需优化性能，可考虑添加symbol映射缓存

4. **多语言支持**
   - 商品名称部分使用i18n翻译
   - 括号内的symbol直接使用API返回值，不翻译

## 相关API接口

### 使用的API
1. **itemSummary API**: 获取商品的symbol字段
   - URL: `/api/item/itemSummary/get`
   - 用途: 获取显示用的symbol

2. **publicRealtimeByType API**: 获取实时价格数据
   - URL: `/api/publicRealtimeByType`
   - 用途: 获取商品的价格、涨跌幅等数据

## 完成状态
✅ 代码修改完成
✅ 新增 `getDisplaySymbol` 辅助函数
✅ 修改 `getCommoditiesData` 函数使用新的symbol
✅ 无 Lint 错误
✅ 支持fallback机制
✅ 文档记录完成

## 相关文档
- [大宗商品i18n多语言支持说明.md](./大宗商品i18n多语言支持说明.md)
- [大宗商品日语翻译修正说明.md](./大宗商品日语翻译修正说明.md)
- [大宗商品卡片显示调整说明.md](./大宗商品卡片显示调整说明.md)
- [大宗商品K线优化说明.md](./大宗商品K线优化说明.md)

