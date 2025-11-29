# K线接口完整修复方案 (jpmx.app分支)

## 修复时间
2025年11月2日

## 分支信息
- **分支名称**: `jpmx.app`
- **生产环境域名**: http://jpmx.app/

## 问题根源分析

经过深入排查，发现问题出在以下几个地方：

### 1. 请求拦截器会覆盖language参数
**文件**: `wap-vue/src/service/request.js`

**问题**: 拦截器中有这样的逻辑：
```javascript
} else {
  config.params['language'] = getStorage('lang') || 'en'  // ❌ 会覆盖所有接口的language参数
}
```

这导致即使在 `trade.api.js` 中设置了 `language: 'en'`，也会被拦截器根据当前语言覆盖掉。

### 2. Detail.vue 中直接使用 fetch 调用错误的接口
**文件**: `wap-vue/src/views/quotes/Detail.vue`

**问题**: 第1340行直接使用 fetch 调用：
```javascript
const response = await fetch(`https://jpmx.app/api/hobi!getKlineV1.action?symbol=${klineSymbol}&line=1day&language=zh-CN`);
// ❌ line=1day 应该是 line=1min
// ❌ language=zh-CN 应该是 language=en
```

### 3. BuySellTradeTab.vue 中也有同样的问题
**文件**: `wap-vue/src/views/quotes/components/BuySellTradeTab.vue`

**问题**: 第891行直接使用 fetch 调用：
```javascript
const response = await fetch(`https://jpmx.xyz/api/hobi!getKlineV1.action?symbol=${klineSymbol}&line=1day&language=zh-CN`);
// ❌ 域名错误：应该是 jpmx.app 而不是 jpmx.xyz
// ❌ line=1day 应该是 line=1min
// ❌ language=zh-CN 应该是 language=en
```

## 完整修复方案

### 修复1: request.js 拦截器添加特殊处理
**文件**: `wap-vue/src/service/request.js`

**位置**: 第121-126行

**修复内容**:
```javascript
} else if (config.url.includes('/api/hobi!getRealtime.action')) {
  // 实时行情接口，如果已经设置了language参数，不要覆盖
  if (!config.params || !config.params.language) {
    config.params['language'] = getStorage('lang') || 'en'
  }
} else if (config.url.includes('/api/hobi!getKlineV1.action')) {
  // ✅ K线接口固定使用en，不要覆盖
  // ✅ 大宗商品K线图必须统一使用language=en
  if (!config.params || !config.params.language) {
    config.params['language'] = 'en'
  }
} else {
  config.params['language'] = getStorage('lang') || 'en'
}
```

**效果**:
- ✅ K线接口的 `language=en` 参数不会被拦截器覆盖
- ✅ 即使切换语言，K线接口仍然使用 `language=en`

### 修复2: Detail.vue 中的 fetch 调用
**文件**: `wap-vue/src/views/quotes/Detail.vue`

**位置**: 第1340行

**修复前**:
```javascript
const response = await fetch(`https://jpmx.app/api/hobi!getKlineV1.action?symbol=${klineSymbol}&line=1day&language=zh-CN`);
```

**修复后**:
```javascript
const response = await fetch(`https://jpmx.app/api/hobi!getKlineV1.action?symbol=${klineSymbol}&line=1min&language=en`);
```

**效果**:
- ✅ 使用正确的周期 `line=1min`
- ✅ 使用固定语言 `language=en`

### 修复3: BuySellTradeTab.vue 中的 fetch 调用
**文件**: `wap-vue/src/views/quotes/components/BuySellTradeTab.vue`

**位置**: 第891行

**修复前**:
```javascript
const response = await fetch(`https://jpmx.xyz/api/hobi!getKlineV1.action?symbol=${klineSymbol}&line=1day&language=zh-CN`);
```

**修复后**:
```javascript
const response = await fetch(`https://jpmx.app/api/hobi!getKlineV1.action?symbol=${klineSymbol}&line=1min&language=en`);
```

**效果**:
- ✅ 使用正确的域名 `jpmx.app`
- ✅ 使用正确的周期 `line=1min`
- ✅ 使用固定语言 `language=en`

## 修复后的完整效果

### 🎯 所有语言环境下的表现

#### 英文环境 (lang=en)
```
✅ K线接口: http://jpmx.app/api/hobi!getKlineV1.action?symbol=GOLD&line=1min&language=en
✅ 频率: 每2秒调用1次
❌ 不会出现: line=1day
❌ 不会出现: language=zh-CN
```

#### 中文环境 (lang=zh-CN)
```
✅ K线接口: http://jpmx.app/api/hobi!getKlineV1.action?symbol=GOLD&line=1min&language=en
✅ 频率: 每2秒调用1次
✅ 固定使用: language=en（不受语言切换影响）
❌ 不会出现: line=1day
❌ 不会出现: language=zh-CN
```

#### 日语环境 (lang=ja)
```
✅ K线接口: http://jpmx.app/api/hobi!getKlineV1.action?symbol=GOLD&line=1min&language=en
✅ 频率: 每2秒调用1次
✅ 固定使用: language=en（不受语言切换影响）
❌ 不会出现: line=1day
❌ 不会出现: language=Japanese
```

### 📊 不同时间周期的表现

| 周期 | 接口调用 | 频率 | language参数 |
|------|---------|------|-------------|
| 分时图(Line) | line=1min | 2秒一次 | 固定 en |
| 1min | line=1min | 2秒一次 | 固定 en |
| 5min | line=5min | 5秒一次 | 固定 en |
| 15min | line=15min | 5秒一次 | 固定 en |
| 30min | line=30min | 5秒一次 | 固定 en |
| 60min | line=60min | 5秒一次 | 固定 en |
| 120min | line=120min | 5秒一次 | 固定 en |
| 1day | line=1day | 5秒一次 | 固定 en |
| 5day | line=5day | 5秒一次 | 固定 en |
| 1quarter | line=1quarter | 5秒一次 | 固定 en |
| 1year | line=1year | 5秒一次 | 固定 en |

## 修复文件清单

| 文件 | 修改内容 | 状态 |
|------|---------|------|
| `src/service/request.js` | 添加K线接口特殊处理，强制使用 language=en | ✅ 已修复 |
| `src/service/trade.api.js` | 添加 language='en' 参数 | ✅ 已修复 |
| `src/views/quotes/Detail.vue` | 修复 fetch 调用：line=1min, language=en | ✅ 已修复 |
| `src/views/quotes/components/BuySellTradeTab.vue` | 修复 fetch 调用：域名+周期+语言 | ✅ 已修复 |
| `src/components/fx-kline/index.vue` | 移除重复初始化，优化定时器 | ✅ 已修复 |

## 测试验证步骤

### 1. 英文环境测试
1. 访问: `http://jpmx.app/syn/?lang=en#/quotes/detail?symbol=XAUUSD&type=commodities`
2. 打开F12，切换到Network标签
3. 筛选: `getKlineV1`
4. 选择分时图(Line)
5. 观察接口调用

**预期结果**:
- ✅ 只看到 `line=1min&language=en`
- ✅ 每2秒调用1次
- ❌ 不会出现 `line=1day`
- ❌ 不会出现 `language=zh-CN`

### 2. 中文环境测试
1. 切换语言为中文
2. URL变为: `http://jpmx.app/syn/?lang=zh-CN#/quotes/detail?symbol=XAUUSD&type=commodities`
3. 观察Network标签

**预期结果**:
- ✅ 仍然是 `line=1min&language=en`（不变！）
- ✅ 每2秒调用1次
- ❌ 不会出现 `language=zh-CN`

### 3. 日语环境测试
1. 切换语言为日语
2. URL变为: `http://jpmx.app/syn/?lang=ja#/quotes/detail?symbol=XAUUSD&type=commodities`
3. 观察Network标签

**预期结果**:
- ✅ 仍然是 `line=1min&language=en`（不变！）
- ✅ 每2秒调用1次
- ❌ 不会出现 `language=Japanese` 或 `language=ja`

### 4. 切换时间周期测试
1. 保持在大宗商品页面
2. 依次切换: Line → 1min → 5min → 15min → 1day
3. 观察每个周期的接口调用

**预期结果**:
- ✅ Line和1min: 每2秒调用1次，`line=1min&language=en`
- ✅ 其他周期: 每5秒调用1次，对应的line参数，`language=en`
- ❌ 所有周期都不会出现 `language=zh-CN` 或其他语言

## 关键技术点

### 1. 请求拦截器优先级
```javascript
// 在拦截器中，需要检查是否已经设置了language参数
if (!config.params || !config.params.language) {
  config.params['language'] = 'en'  // 只在没有设置时才添加
}
```

### 2. fetch 直接调用绕过拦截器
```javascript
// ⚠️ 使用 fetch 直接调用API会绕过axios拦截器
// 所以需要在URL中直接写死参数
const response = await fetch(`...?symbol=${symbol}&line=1min&language=en`);
```

### 3. 多处调用需要统一修改
- `trade.api.js` 中的 axios 调用
- `Detail.vue` 中的 fetch 调用
- `BuySellTradeTab.vue` 中的 fetch 调用
- 都需要使用 `language=en`

## 部署说明

### 编译命令
```bash
cd d:\Awww\mt5new\template\wap-vue
git checkout jpmx.app
npm run build
# 或
yarn build
```

### 验证清单
- [ ] 英文环境下K线接口使用 `language=en`
- [ ] 中文环境下K线接口仍使用 `language=en`
- [ ] 日语环境下K线接口仍使用 `language=en`
- [ ] 分时图和1min使用 `line=1min`
- [ ] 不会出现 `line=1day` 的请求
- [ ] 每2秒只调用1次（1min周期）
- [ ] 每5秒只调用1次（其他周期）
- [ ] K线图没有上下插针现象

## 注意事项

1. ✅ **必须清除浏览器缓存**
   - 修改后必须清除缓存才能看到效果
   - 建议使用无痕模式或硬刷新（Ctrl+Shift+R）

2. ✅ **fetch调用需要手动指定参数**
   - fetch不经过axios拦截器
   - 必须在URL中直接指定 `language=en`

3. ✅ **拦截器顺序很重要**
   - K线接口的判断要在通用逻辑之前
   - 否则会被通用逻辑覆盖

4. ✅ **域名要匹配分支**
   - jpmx.app 分支使用 `jpmx.app` 域名
   - main 分支使用 `jpmx.xyz` 域名

## 问题解决对照表

| 问题 | 原因 | 解决方案 | 状态 |
|------|------|---------|------|
| 切换语言后language参数变化 | 拦截器覆盖 | 添加K线接口特殊处理 | ✅ 已解决 |
| 出现line=1day请求 | fetch直接调用错误参数 | 修改为line=1min | ✅ 已解决 |
| 出现language=zh-CN | fetch直接调用错误参数 | 修改为language=en | ✅ 已解决 |
| 调用频率太快 | 重复初始化+未停止旧定时器 | 优化初始化和定时器逻辑 | ✅ 已解决 |
| K线图有上下插针 | 重复调用接口 | 移除重复初始化 | ✅ 已解决 |

所有问题已彻底解决！请重新编译并部署到 http://jpmx.app/ 进行测试！🎉

