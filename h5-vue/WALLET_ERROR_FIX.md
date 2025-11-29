# H5-Vue 钱包错误修复方案

## 问题描述

在h5-vue项目首页打开时，控制台出现以下钱包扩展相关错误：

```
Sender: Failed to get initial state. Please report this bug.
Talisman extension has not been configured yet. Please continue with onboarding.
```

这些错误是由用户浏览器中安装的钱包扩展（如Sender、Talisman等）产生的，不影响网站正常功能，但会在控制台产生噪音。

## 解决方案

### 1. 删除钱包相关代码

已删除以下文件：
- `h5-vue/src/utils/walletErrorHandler.js` - 钱包错误处理器
- `h5-vue/verify-wallet-removal.js` - 钱包代码验证脚本
- `h5-vue/test-wallet-removal.html` - 钱包删除测试页面

### 2. 创建错误过滤器

新增 `h5-vue/src/utils/errorFilter.js` 文件，实现以下功能：

- **静默过滤钱包错误**：自动识别并过滤钱包扩展产生的错误
- **保留正常错误**：确保其他重要错误仍然正常显示
- **统计功能**：记录过滤的错误数量，便于调试

#### 过滤的错误类型：
- Sender钱包相关错误
- Talisman钱包相关错误
- Polkadot扩展相关错误
- favicon.ico和manifest.json相关错误

### 3. 修复manifest.json配置

修复了以下问题：
- 将无效的协议 `web+mt5` 改为 `web+demo`
- 修正了图标路径，从 `/h5/images/` 改为 `/images/`
- 确保所有资源路径正确

### 4. 集成到主应用

在 `h5-vue/src/main.js` 中：
- 导入错误过滤器
- 在错误处理器之前初始化过滤器
- 确保钱包错误在到达用户之前被过滤

## 使用方法

### 自动初始化
错误过滤器会在页面加载时自动初始化，无需手动调用。

### 手动控制（可选）
```javascript
import { initErrorFilter, getFilterStats, resetFilterStats } from '@/utils/errorFilter';

// 手动初始化（通常不需要）
initErrorFilter();

// 获取过滤统计
const stats = getFilterStats();
console.log('已过滤错误数量:', stats.filteredCount);

// 重置统计
resetFilterStats();
```

## 测试验证

### 1. 使用测试页面
打开 `h5-vue/test-error-filter.html` 进行测试：
- 模拟各种钱包错误
- 验证过滤效果
- 查看统计信息

### 2. 浏览器控制台验证
1. 打开h5-vue项目首页
2. 打开浏览器开发者工具
3. 观察控制台输出
4. 钱包相关错误应该不再显示

### 3. 预期结果
- ✅ 钱包扩展错误被静默处理
- ✅ 正常错误仍然显示
- ✅ 用户体验不受影响
- ✅ 开发调试不受干扰

## 技术实现

### 错误过滤机制
1. **全局错误捕获**：重写 `window.onerror`
2. **Promise错误捕获**：监听 `unhandledrejection` 事件
3. **控制台错误过滤**：重写 `console.error`
4. **关键词匹配**：基于错误消息内容进行智能过滤

### 过滤策略
- 使用关键词匹配识别钱包错误
- 保持原有错误处理链不变
- 只过滤特定类型的错误，不影响其他功能

## 维护说明

### 添加新的过滤规则
在 `errorFilter.js` 的 `shouldFilterError` 方法中添加新的关键词：

```javascript
const filterKeywords = [
  // 现有关键词...
  'new_wallet_error_keyword', // 添加新的关键词
];
```

### 调试模式
在开发环境中，可以通过控制台查看过滤统计：
```javascript
console.log(window.errorFilter?.getFilterStats());
```

## 注意事项

1. **不影响功能**：错误过滤只是隐藏显示，不影响网站功能
2. **保留重要错误**：只过滤已知的无害错误
3. **可以关闭**：如需调试，可以临时禁用过滤器
4. **性能友好**：过滤逻辑轻量，不影响页面性能

## 总结

通过实施这个解决方案：
- 彻底解决了钱包扩展错误的显示问题
- 保持了代码的简洁性和可维护性
- 提升了用户和开发者的体验
- 为将来可能出现的类似问题提供了可扩展的解决框架
