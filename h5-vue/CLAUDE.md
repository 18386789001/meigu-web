[根目录](../../CLAUDE.md) > **h5-vue**

# h5-vue 模块文档

## 模块职责

h5-vue是MSX平台的移动端H5轻量级交易应用，专为移动设备设计的简洁版交易界面。该模块专注于核心交易功能，提供轻量级、高性能的移动交易体验，包括基本的加密货币、股票等金融产品的交易服务。

## 入口与启动

- **入口文件**：`src/main.js`
- **应用根组件**：`src/App.vue`
- **启动命令**：
  - 开发环境：`yarn dev --port 3333`
  - 生产构建：`yarn build`
  - 预览构建：`yarn preview --port 3333`

## 对外接口

- **API服务**：统一的HTTP客户端，位于`src/utils/http.js`
- **请求封装**：使用Axios进行HTTP请求处理

## 关键依赖与配置

- **核心框架**：Vue 3.2.13 + Vue Router
- **状态管理**：Pinia 2.0.33 + 持久化插件
- **UI组件库**：Element Plus 2.3.1（移动端优化版）
- **构建工具**：Vite 4.2.1
- **工具库**：
  - HTTP客户端：axios
  - 图表库：echarts 5.4.2, klinecharts 9.2.1
  - 国际化：vue-i18n
  - 样式处理：tailwindcss, sass
  - 滑动验证：vue3-slide-verify
  - 国家选择：vue3-country-intl
  - 二维码：qrcode, vue-qrcode
  - 图片处理：image-conversion
  - 轮播图：swiper
  - 数值处理：js-big-decimal
  - 剪贴板：clipboard
  - 懒加载：vue3-lazy
  - 拖拽调整：vue-drag-resize
  - 滑块组件：vue-slider-component
  - 事件总线：vue3-eventbus

- **环境配置**：
  - 基础配置：`.env`
  - 开发环境：`.env.development`
  - 生产环境：`.env.production`

## 数据模型

- **用户系统**：账户信息、登录认证、设备检测
- **交易产品**：加密货币、股票等基础金融产品
- **行情数据**：实时报价、基础图表数据
- **订单系统**：交易订单、历史记录

## 测试与质量

- **代码检查**：ESLint + Vue3规则
- **自动导入**：unplugin-auto-import, unplugin-vue-components, unplugin-vue-define-options
- **构建优化**：内置Vite优化

## 常见问题 (FAQ)

1. **设备检测**：自动检测设备类型，PC端访问会自动跳转
2. **路由处理**：强制重定向到/h5/路径下的页面
3. **语言设置**：默认使用英文语言包，强制初始化为英文
4. **错误处理**：包含多种错误修复工具，处理localStorage和JSON解析问题
5. **localStorage管理**：包含完整的localStorage清理和修复机制

## 相关文件清单

- **核心文件**：
  - `src/main.js` - 应用入口
  - `src/App.vue` - 根组件
  - `src/router/index.js` - 路由配置
  - `src/store/index.js` - 状态管理

- **配置文件**：
  - `package.json` - 项目配置
  - `vite.config.js` - Vite配置
  - `.env` - 环境变量

- **工具文件**：
  - `src/utils/deviceDetector.js` - 设备检测
  - `src/utils/localStorage.js` - localStorage管理
  - `src/utils/productionFix.js` - 生产环境修复
  - `src/utils/languageInit.js` - 语言初始化
  - `src/utils/errorHandler.js` - 错误处理
  - `src/utils/errorFilter.js` - 错误过滤

## 变更记录 (Changelog)

- 2025-11-29：初始化h5-vue模块文档