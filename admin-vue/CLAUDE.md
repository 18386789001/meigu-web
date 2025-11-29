[根目录](../../CLAUDE.md) > **admin-vue**

# admin-vue 模块文档

## 模块职责

admin-vue是MSX平台的管理后台系统，提供平台管理、用户管理、内容管理、系统配置等功能。该模块主要面向平台管理员和运营人员，用于维护和监控整个交易平台的运行。

## 入口与启动

- **入口文件**：`src/main.js`
- **应用根组件**：`src/App.vue`
- **启动命令**：
  - 开发环境：`yarn serve`
  - 生产构建：`yarn build`

## 对外接口

- **API服务**：位于`src/api`目录，包含：
  - 用户管理：`user.js`
  - 认证授权：`auth.js`
  - 文章管理：`article.js`
  - 聊天功能：`chat.js`, `chat.api.js`
  - 联系人管理：`contacts.js`
  - 群组管理：`group.js`
  - 表情管理：`emoticon.js`
  - 文件上传：`upload.js`

- **网络请求**：使用axios库，封装在`src/utils/httpRequest.js`

## 关键依赖与配置

- **核心框架**：Vue 2.6.14 + Vue Router 3.5.2 + Vuex 3.6.2
- **UI组件库**：Element UI 2.15.7 + Avue 2.8.27
- **工具库**：
  - 加密：crypto-js, js-md5
  - 数据处理：lodash
  - 图表：echarts, echarts-gl
  - 其他：qs, js-base64, vue-clipboard2

- **环境配置**：
  - 开发环境：`.env.development`
  - 生产环境：`.env.production`

## 数据模型

- **用户管理**：用户信息、权限设置、角色管理
- **内容管理**：文章、通知、公告
- **聊天系统**：消息、联系人、群组、表情
- **系统配置**：平台参数、业务规则

## 测试与质量

- **代码检查**：ESLint，配置文件：`.eslintrc.js`
- **测试框架**：Jest，配置文件：`jest.config.js`
- **代码规范**：遵循standard规范

## 常见问题 (FAQ)

1. **音频功能**：系统内置多种音频提示，如充值、提现、认证等
2. **签名验证**：文件上传使用签名验证机制
3. **权限控制**：通过路由守卫和组件级权限控制实现

## 相关文件清单

- **核心文件**：
  - `src/main.js` - 应用入口
  - `src/App.vue` - 根组件
  - `src/router/index.js` - 路由配置
  - `src/store/index.js` - 状态管理

- **配置文件**：
  - `package.json` - 项目配置
  - `babel.config.js` - Babel配置
  - `.env.development` - 开发环境变量
  - `.env.production` - 生产环境变量

- **构建配置**：
  - `vue.config.js` - Vue CLI配置

## 变更记录 (Changelog)

- 2025-11-29：初始化admin-vue模块文档