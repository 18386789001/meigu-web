# H5-Vue 域名代理解决方案

## 🎯 问题描述

原项目中存在大量硬编码的URL，如：
```javascript
window.open('https://jpmx.xyz/syn/#/my/index', '_blank')
```

当需要更换域名时，这些硬编码URL会导致跳转失败，影响用户体验。

## 🛠️ 解决方案

### 1. 动态域名管理系统

创建了完整的域名管理工具 `src/utils/domainManager.js`，提供：

- **动态域名检测**：自动识别当前访问域名
- **环境适配**：开发环境和生产环境自动切换
- **URL生成器**：统一的URL生成接口
- **域名切换**：支持运行时域名切换
- **健康检查**：域名可用性检测

### 2. 统一配置管理

更新了 `src/config/index.js`，集成域名管理器：

```javascript
import { getCurrentDomain, generateWapUrl, URL_GENERATORS } from '@/utils/domainManager';

const URLS = {
  LOGIN: () => URL_GENERATORS.WAP_LOGIN(),
  REGISTER: () => URL_GENERATORS.WAP_REGISTER(),
  DEMO_TRADING: (tradingType) => URL_GENERATORS.WAP_DEMO_TRADING(tradingType),
  REAL_TRADING: (tradingType) => URL_GENERATORS.WAP_REAL_TRADING(tradingType),
};
```

### 3. 组件级别修复

更新了所有包含硬编码URL的组件：

#### 修复的文件：
- ✅ `src/App.vue` - 主应用组件
- ✅ `src/views/Home.vue` - 首页组件
- ✅ `src/views/Trading.vue` - 交易页面
- ✅ `src/views/More.vue` - 更多功能页面
- ✅ `src/components/mobile/MobileHeader.vue` - 移动端头部

#### 修复示例：
```javascript
// 修复前
const goToLogin = () => {
  window.open('https://jpmx.xyz/syn/#/my/index', '_blank')
}

// 修复后
import config from '@/config'

const goToLogin = () => {
  window.open(config.URLS.LOGIN(), '_blank')
}
```

### 4. Vite代理配置

更新了 `vite.config.js`，添加WAP端代理支持：

```javascript
proxy: {
  '/api': {
    target: 'https://jpmx.xyz',
    changeOrigin: true,
    secure: true,
  },
  // 新增：代理WAP端请求
  '/syn': {
    target: 'https://jpmx.xyz',
    changeOrigin: true,
    secure: true,
  }
}
```

### 5. 域名切换组件

创建了用户友好的域名切换组件 `src/components/DomainSwitcher.vue`：

- **可视化界面**：直观的域名切换面板
- **预设域名**：快速切换到常用域名
- **自定义域名**：支持输入任意域名
- **健康检查**：切换前检查域名可用性
- **多语言支持**：中英文界面

### 6. 多语言支持

为域名切换器添加了完整的多语言支持：

- **中文翻译**：`src/i18n/zh-CN.js`
- **英文翻译**：`src/i18n/en-US.js`

## 🚀 使用方法

### 开发环境

1. **启动开发服务器**：
   ```bash
   cd h5-vue
   npm run dev
   ```

2. **访问应用**：
   - 本地访问：`http://localhost:3333`
   - 所有外部链接会自动使用 `https://jpmx.xyz/syn` 作为基础URL

### 生产环境

1. **构建应用**：
   ```bash
   npm run build
   ```

2. **部署到新域名**：
   - 将构建文件部署到新域名（如：`https://newdomain.com`）
   - 所有外部链接会自动使用 `https://newdomain.com/syn` 作为基础URL

### 域名切换

#### 方法一：使用域名切换组件
1. 在任意页面添加域名切换组件：
   ```vue
   <template>
     <DomainSwitcher />
   </template>
   
   <script setup>
   import DomainSwitcher from '@/components/DomainSwitcher.vue'
   </script>
   ```

2. 点击域名切换按钮，选择新域名或输入自定义域名

#### 方法二：编程方式切换
```javascript
import { switchDomain } from '@/utils/domainManager'

// 切换到新域名
switchDomain('newdomain.com')
```

## 🔧 技术特性

### 1. 自动域名检测
```javascript
// 开发环境
getCurrentDomain() // 返回: 'jpmx.xyz'

// 生产环境（假设部署到 newdomain.com）
getCurrentDomain() // 返回: 'newdomain.com'
```

### 2. 智能URL生成
```javascript
// 自动适配当前域名
generateWapUrl('/#/my/index') 
// 开发环境: 'https://jpmx.xyz/syn/#/my/index'
// 生产环境: 'https://newdomain.com/syn/#/my/index'
```

### 3. 参数化URL支持
```javascript
// 支持查询参数
URL_GENERATORS.WAP_DEMO_TRADING('btcusdt')
// 生成: 'https://domain.com/syn/#/my/index?type=demo&trading=btcusdt'
```

### 4. 环境隔离
- **开发环境**：使用固定的测试域名
- **生产环境**：自动检测当前访问域名
- **预览环境**：支持staging子域名

## 📊 修复统计

### 修复的硬编码URL数量：
- **App.vue**: 2个URL
- **Home.vue**: 3个URL  
- **Trading.vue**: 2个URL
- **More.vue**: 2个URL
- **MobileHeader.vue**: 2个URL

**总计**: 11个硬编码URL已全部修复

### 新增功能：
- ✅ 动态域名管理器
- ✅ 统一URL配置系统
- ✅ 域名切换组件
- ✅ Vite代理配置
- ✅ 多语言支持
- ✅ 域名健康检查

## 🎉 效果验证

### 测试场景1：域名更换
1. **原域名**：`https://jpmx.xyz`
2. **新域名**：`https://newdomain.com`
3. **结果**：所有外部链接自动更新为新域名

### 测试场景2：开发环境
1. **本地开发**：`http://localhost:3333`
2. **外部链接**：自动使用 `https://jpmx.xyz/syn`
3. **代理转发**：通过Vite代理访问远程服务

### 测试场景3：用户切换
1. **用户操作**：通过域名切换组件选择新域名
2. **系统响应**：自动跳转到新域名对应页面
3. **状态保持**：保留当前页面路径和参数

## 🔮 未来扩展

### 1. 多环境支持
- 支持更多预设环境（测试、预发布、生产）
- 环境特定的配置管理

### 2. 域名负载均衡
- 支持多个域名的负载均衡
- 自动故障转移

### 3. 缓存优化
- 域名解析结果缓存
- 减少重复的健康检查

### 4. 监控集成
- 域名可用性监控
- 切换操作日志记录

## 📝 总结

通过实施这套域名代理解决方案，成功解决了硬编码URL导致的域名切换问题：

1. **彻底解决**：所有硬编码URL已替换为动态生成
2. **用户友好**：提供可视化的域名切换界面
3. **开发便利**：开发环境自动代理，无需手动配置
4. **生产就绪**：支持任意域名的无缝切换
5. **扩展性强**：模块化设计，易于维护和扩展

现在无论将项目部署到任何域名，所有外部链接都会自动适配，确保功能正常运行。
