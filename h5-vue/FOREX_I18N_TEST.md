# ForexTrading.vue 多语言支持测试

## 测试目的
验证ForexTrading.vue页面的货币对描述是否正确支持中文、英文和日文三种语言。

## 测试内容

### 1. 货币对描述翻译
测试以下货币对在不同语言下的显示：

#### EUR/USD (欧元/美元)
- **中文**: 欧元/美元
- **英文**: Euro/US Dollar  
- **日文**: ユーロ/米ドル

#### GBP/USD (英镑/美元)
- **中文**: 英镑/美元
- **英文**: British Pound/US Dollar
- **日文**: 英ポンド/米ドル

#### USD/JPY (美元/日元)
- **中文**: 美元/日元
- **英文**: US Dollar/Japanese Yen
- **日文**: 米ドル/円

### 2. 测试步骤

1. **启动应用**
   ```bash
   cd h5-vue
   npm run dev
   ```

2. **访问外汇交易页面**
   - 打开浏览器访问: `http://localhost:5173/trading/forex`

3. **切换语言测试**
   - 切换到中文，检查货币对描述是否显示为中文
   - 切换到英文，检查货币对描述是否显示为英文
   - 切换到日文，检查货币对描述是否显示为日文

### 3. 预期结果

#### 中文环境 (zh-CN)
```
EUR/USD - 欧元/美元
GBP/USD - 英镑/美元  
USD/JPY - 美元/日元
```

#### 英文环境 (en-US)
```
EUR/USD - Euro/US Dollar
GBP/USD - British Pound/US Dollar
USD/JPY - US Dollar/Japanese Yen
```

#### 日文环境 (ja-JP)
```
EUR/USD - ユーロ/米ドル
GBP/USD - 英ポンド/米ドル
USD/JPY - 米ドル/円
```

### 4. 日语翻译说明

日语货币名称采用了标准的金融术语：

- **ユーロ** (Euro) - 欧元的标准日语表记
- **米ドル** (Bei-doru) - 美元的标准日语表记，"米"指美国
- **英ポンド** (Ei-pondo) - 英镑的标准日语表记
- **円** (En) - 日元的日语表记

### 5. 技术实现

#### i18n配置
货币对描述存储在各语言文件的 `trading.forex.pairDescriptions` 对象中：

```javascript
// zh-CN.js
pairDescriptions: {
  'EUR/USD': '欧元/美元',
  'GBP/USD': '英镑/美元',
  'USD/JPY': '美元/日元'
}

// en-US.js  
pairDescriptions: {
  'EUR/USD': 'Euro/US Dollar',
  'GBP/USD': 'British Pound/US Dollar',
  'USD/JPY': 'US Dollar/Japanese Yen'
}

// ja-JP.js
pairDescriptions: {
  'EUR/USD': 'ユーロ/米ドル',
  'GBP/USD': '英ポンド/米ドル', 
  'USD/JPY': '米ドル/円'
}
```

#### 组件实现
使用computed属性和翻译函数动态获取描述：

```javascript
const getPairDescription = (pairName) => {
  const key = `trading.forex.pairDescriptions.${pairName}`;
  const translation = t(key);
  // 如果翻译不存在，返回默认值
  if (translation === key) {
    const defaultDescriptions = {
      'EUR/USD': '欧元/美元',
      'GBP/USD': '英镑/美元', 
      'USD/JPY': '美元/日元'
    };
    return defaultDescriptions[pairName] || pairName;
  }
  return translation;
};
```

### 6. 故障排除

如果翻译不生效，检查：

1. **i18n文件语法**: 确保JSON格式正确
2. **翻译键路径**: 确保 `trading.forex.pairDescriptions.XXX` 路径正确
3. **语言切换**: 确保语言切换功能正常工作
4. **缓存清理**: 清除浏览器缓存后重试

### 7. 扩展支持

如需添加更多货币对，在三个语言文件的 `pairDescriptions` 对象中添加对应翻译即可：

```javascript
'USD/CHF': {
  'zh-CN': '美元/瑞士法郎',
  'en-US': 'US Dollar/Swiss Franc', 
  'ja-JP': '米ドル/スイスフラン'
}
```
