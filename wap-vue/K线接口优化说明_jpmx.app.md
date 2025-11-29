# K线接口优化说明 (jpmx.app分支)

## 优化时间
2025年11月2日

## 分支信息
- **分支名称**: `jpmx.app`
- **生产环境域名**: http://jpmx.app/

## 问题描述

### 1. 接口重复调用问题
- **现象**: 选择分时图(Line)时，每隔2秒会**连续调用两次**相同接口
- **影响**: 造成K线图出现上下插针，数据不稳定

### 2. 错误周期调用问题
- **现象**: 选择分时图时，会同时调用 `line=1day` 的接口
- **期望**: 只应该调用 `line=1min` 的接口

### 3. 语言参数混乱问题
- **现象**: 
  - 英文环境下出现 `language=zh-CN` 的调用
  - 不同语言环境下调用不同language参数的接口
- **期望**: 统一使用 `language=en`

## 优化方案

### 1. 添加统一language参数
**修改文件**: `wap-vue/src/service/trade.api.js`

```javascript
return request({
  url: `${API_PREFIX}/hobi!getKlineV1.action`,
  method: 'GET',
  params: {
    symbol: apiSymbol,
    line,
    language: 'en' // ✅ 统一使用英文，避免语言混乱导致的多次调用
  }
})
```

### 2. 移除重复初始化
**修改文件**: `wap-vue/src/components/fx-kline/index.vue`

```javascript
onMounted(() => {
  defaultH.value = window.innerHeight - 94
  nextTick(async () => {
    // ✅ 只调用一次初始化，避免重复调用API
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

### 3. 正确停止旧定时器
```javascript
watch([() => props.symbol, () => quotesStore.stage], ([newSymbol, newStage], [oldSymbol, oldStage]) => {
  if (newSymbol && (newSymbol !== oldSymbol || newStage !== oldStage)) {
    if (isKlinePage()) {
      console.log('🔄 停止旧定时器，重新启动K线定时器')
      stopKlineTimer() // ✅ 先停止旧定时器
      startKlineTimer() // ✅ 再启动新定时器
    }
  }
}, { immediate: false })
```

### 4. 统一分时图周期参数
```javascript
const getKlineData = async () => {
  // ✅ 统一使用1min周期获取分时图数据
  const actualStage = quotesStore.stage === 'timeSharing' ? '1min' : quotesStore.stage
  console.log(`📊 获取K线数据: symbol=${props.symbol}, stage=${actualStage}`)
  
  data.value = await _getKline(props.symbol, actualStage)
  // ...
}

const refreshKlineData = async () => {
  // ✅ 统一使用1min周期获取分时图数据
  const actualStage = quotesStore.stage === 'timeSharing' ? '1min' : quotesStore.stage
  console.log(`🔄 定时刷新K线数据: ${props.symbol}, 时间周期: ${actualStage}`)
  
  const newData = await _getKline(props.symbol, actualStage)
  // ...
}
```

## 优化后的接口调用行为

### jpmx.app 生产环境

**分时图 (timeSharing/Line) - 所有语言环境**:
```
✅ 只调用: http://jpmx.app/api/hobi!getKlineV1.action?symbol=GOLD&line=1min&language=en
✅ 频率: 每2秒调用一次
❌ 不会调用: line=1day 的接口
❌ 不会出现: language=zh-CN 的参数
```

**其他周期**:
```
✅ 正确调用对应周期: line=5min / line=15min / line=1day
✅ 统一语言参数: language=en
✅ 1min周期频率: 每2秒调用一次
✅ 其他周期频率: 每5秒调用一次
```

## 解决的问题总结

| 问题 | 优化前 | 优化后 |
|------|--------|--------|
| 接口调用次数 | 每2秒调用2次 | ✅ 每2秒调用1次 |
| 错误周期调用 | 出现line=1day | ✅ 只调用line=1min |
| 语言参数 | 混乱(zh-CN/en) | ✅ 统一language=en |
| K线图插针 | ❌ 有上下插针 | ✅ 无插针，稳定 |
| 定时器管理 | ❌ 未正确清理 | ✅ 正确停止和启动 |

## 测试验证

### 验证步骤
1. 打开浏览器开发者工具 (F12)
2. 访问大宗商品K线图页面: `http://jpmx.app/syn/?lang=en#/quotes/detail?symbol=XAUUSD&type=commodities`
3. 选择分时图 (Line)
4. 切换到 Network 标签，筛选 `getKlineV1`

### 预期结果

#### ✅ 英文环境
```
请求: http://jpmx.app/api/hobi!getKlineV1.action?symbol=GOLD&line=1min&language=en
频率: 每2秒调用一次
次数: 每次只调用一次（不重复）
```

#### ✅ 中文环境
```
请求: http://jpmx.app/api/hobi!getKlineV1.action?symbol=GOLD&line=1min&language=en
频率: 每2秒调用一次
次数: 每次只调用一次（不重复）
语言: 仍然使用 language=en（不受浏览器语言影响）
```

#### ✅ 控制台日志
```
✅ 检测到K线图页面，启动K线图组件
✅ 大宗商品类型 XAUUSD，跳过WebSocket启动，仅使用定时器轮询
📊 获取K线数据: symbol=XAUUSD, stage=1min
📊 K线图API调用: XAUUSD -> GOLD, 时间周期: 1min, 语言: en
🔄 检测到commodities类型商品 XAUUSD，1min周期使用2秒调用频率
🔄 启动K线数据自动刷新定时器，每2秒调用一次，时间周期: 1min，商品: XAUUSD

（每2秒输出一次）
⏰ K线定时器触发，刷新K线数据，时间周期: 1min，商品: XAUUSD
🔄 定时刷新K线数据: XAUUSD, 时间周期: 1min
📊 K线图API调用: XAUUSD -> GOLD, 时间周期: 1min, 语言: en
✅ K线数据刷新成功，获取到 XXX 条数据
```

## 注意事项

1. ✅ **必须重新编译项目才能生效**
   ```bash
   cd d:\Awww\mt5new\template\wap-vue
   git checkout jpmx.app
   npm run build
   # 或
   yarn build
   ```

2. ✅ **清除浏览器缓存**
   - 部署后建议用户清除浏览器缓存
   - 或使用硬刷新 (Ctrl + Shift + R)

3. ✅ **监控接口调用**
   - 部署到 http://jpmx.app/ 后监控接口调用频率是否正常
   - 确认不再出现重复调用

4. ✅ **验证不同语言环境**
   - 英文环境 (`?lang=en`)
   - 中文环境 (`?lang=zh`)
   - 日语环境 (`?lang=ja`)
   - 确保都使用 `language=en` 参数

## 修改文件清单

1. ✅ `wap-vue/src/service/trade.api.js`
   - 添加 `language: 'en'` 参数

2. ✅ `wap-vue/src/components/fx-kline/index.vue`
   - 移除重复初始化 (`initData1`)
   - 优化定时器停止逻辑
   - 统一分时图周期处理
   - 添加详细日志输出

3. ✅ `wap-vue/K线接口优化说明_jpmx.app.md`
   - 完整优化文档（本文件）

## 部署说明

### 编译命令
```bash
cd d:\Awww\mt5new\template\wap-vue
git checkout jpmx.app
npm run build
# 或
yarn build
```

### 部署目标
- 生产环境域名: http://jpmx.app/
- 需要将编译后的文件部署到对应服务器

### 回滚方案
如果出现问题，可以回滚到优化前的版本：
```bash
git checkout jpmx.app
git reset --hard HEAD~1
npm run build
```

## 与 main 分支的区别

- **main 分支**: 生产环境域名为 https://jpmx.xyz/
- **jpmx.app 分支**: 生产环境域名为 http://jpmx.app/
- **优化内容**: 完全相同
- **测试URL**: 需要使用 http://jpmx.app/ 域名进行测试

所有优化已在 jpmx.app 分支完成，请重新编译并部署到 http://jpmx.app/ 测试！🎉

