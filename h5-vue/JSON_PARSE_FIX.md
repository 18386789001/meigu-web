# JSON.parse 错误修复说明

## 问题描述

在浏览器控制台中出现以下错误：
```
Uncaught SyntaxError: Unexpected token 'j', "ja-JP" is not valid JSON
```

## 问题原因

1. **语言代码处理错误**: 在 `main.js` 中使用 `includes()` 方法检查语言代码，导致 `"ja-JP"` 被错误处理
2. **localStorage 数据验证不足**: 没有对存储在 localStorage 中的语言代码和 JSON 数据进行有效性验证
3. **JSON.parse 缺少错误处理**: 在解析用户信息时没有适当的错误处理机制

## 修复内容

### 1. 创建了 localStorage 工具函数 (`src/utils/localStorage.js`)

- 提供安全的 localStorage 操作方法
- 验证语言代码的有效性
- 自动清理无效数据
- 统一的错误处理机制

### 2. 修复了 `main.js`

```javascript
// 修复前
const lang = localStorage.getItem("lang")?.includes("zh-CN");

// 修复后
const savedLang = localStorage.getItem("lang");
const validLang = getValidLanguageCode(savedLang, 'zh-CN');
const lang = validLang === "zh-CN" || validLang === "zh-TW";
```

### 3. 修复了 `i18n/index.js`

- 简化了语言获取逻辑
- 使用工具函数进行语言代码验证
- 自动清理无效的语言代码

### 4. 修复了 `store/user.js`

- 添加了 JSON 解析的错误处理
- 验证 JSON 字符串格式
- 提供详细的错误日志

### 5. 修复了 `App.vue`

- 使用统一的语言代码验证
- 简化了语言加载逻辑

### 6. 添加了调试工具

- 创建了 `DebugLocalStorage.vue` 页面
- 可以通过访问 `/debug` 路径来调试 localStorage 数据
- 提供实时监控和清理功能

## 支持的语言代码

```javascript
const SUPPORTED_LANGUAGES = [
  'zh-CN', 'zh-TW', 'en-US', 'ja-JP', 'ko-KR', 
  'th-TH', 'vi-VN', 'de-DE', 'es-ES', 'fr-FR', 
  'it-IT', 'pt-PT', 'el-GR'
];
```

## 使用方法

1. **自动清理**: 应用启动时会自动清理无效的 localStorage 数据
2. **手动调试**: 访问 `/debug` 页面进行手动调试和测试
3. **错误日志**: 所有错误都会在控制台输出详细的日志信息

## 测试方法

1. 启动应用后，访问 `/debug` 页面
2. 点击"设置无效语言代码"按钮
3. 点击"设置无效JSON"按钮
4. 点击"刷新数据"按钮查看清理结果
5. 检查浏览器控制台确认没有错误

## 预防措施

1. 所有 localStorage 操作都通过工具函数进行
2. 语言代码在使用前都会进行验证
3. JSON 数据在解析前都会进行格式检查
4. 提供详细的错误日志用于调试

## 注意事项

- 修复后的代码向后兼容
- 不会影响现有的有效数据
- 自动清理只会在检测到无效数据时执行
- 所有操作都有错误处理机制
