[根目录](../../CLAUDE.md) > **wap-vue**

# wap-vue 模块文档

## 模块职责

wap-vue是MSX平台的移动端WAP应用，专为移动设备优化的完整交易界面。该模块提供与web-vue类似的交易功能，但界面和交互针对移动端进行了优化，包括加密货币、股票、ETF、外汇等多种金融产品的移动交易体验。

## 入口与启动

- **入口文件**：`src/main.js`
- **应用根组件**：`src/App.vue`
- **启动命令**：
  - 开发环境：`yarn dev`
  - 生产构建：`yarn build`
  - 构建分析：`yarn build:visualizer`

## 对外接口

- **API服务**：位于`src/service`目录，包含：
  - 登录认证：`login.api.js`
  - 加密货币：`cryptos.api.js`
  - ETF基金：`etf.api.js`
  - 理财产品：`financialManagement.api.js`
  - 基金交易：`fund.api.js`
  - 期货交易：`futures.api.js`
  - 主页数据：`home.api.js`
  - 即时通讯：`im.api.js`
  - IPO申购：`ipo.api.js`
  - 自选股：`optional.api.js`
  - 场外交易：`otc.api.js`
  - 充值服务：`recharge.api.js`, `recharge.js`
  - 行情数据：`quotes.api.js`
  - RWA资产：`rwa.api.js`
  - 交易功能：`trade.api.js`, `trading.js`
  - 上传功能：`upload.api.js`
  - 用户管理：`user.api.js`
  - 提现服务：`withdraw.api.js`
  - 抵押借贷：`pledgeLoan.js`
  - 推广功能：`promote.js`
  - 请求封装：`request.js`

- **新API架构**：位于`src/service/newApi`目录
  - 市场配置：`marketConfig.js`
  - 市场行情：`marketQuotes.js`
  - 股票详情：`stockDetail.js`
  - RWA资产：`rwa.js`
  - WebSocket：`websocket.js`

- **其他服务**：位于`src/services`目录
  - 新闻语言：`newsLanguageService.js`
  - 翻译服务：`translationService.js`

## 关键依赖与配置

- **核心框架**：Vue 3.2.41 + Vue Router 4.1.6
- **状态管理**：Pinia 2.0.23 + Vuex 4.1.0（混合使用）
- **UI组件库**：Vant 4.0.9（移动端UI库）
- **构建工具**：Vite 3.2.0
- **工具库**：
  - HTTP客户端：axios
  - 图表库：echarts 5.4.2, klinecharts 8.6.3
  - 国际化：vue-i18n
  - 样式处理：tailwindcss, sass
  - 响应式适配：amfe-flexible, postcss-pxtorem
  - 二维码：qrcode
  - 图片处理：image-conversion, html2canvas
  - 日期处理：dayjs
  - 实用工具：@vueuse/core, qs
  - 移动端优化：default-passive-events
  - 电容器：@capacitor系列（原生功能）
  - 拖拽排序：vuedraggable
  - 拼图验证：vue3-puzzle-vcode
  - 轮播3D：vue3-carousel-3d
  - 二维码扫描：vue3-qr-reader
  - 滑动验证：vue-slider-component
  - 剪贴板：vue-clipboard3

- **环境配置**：
  - 基础配置：`.env`
  - 开发环境：`.env.development`
  - 生产环境：`.env.production`

## 数据模型

- **用户系统**：账户信息、登录认证、设置管理
- **交易产品**：加密货币、股票、ETF、期货、基金、理财产品
- **订单系统**：交易订单、历史订单、持仓信息
- **行情数据**：实时报价、K线图表、市场深度
- **资金管理**：账户余额、充值提现、资金流水
- **C2C交易**：买卖订单、交易记录、评价系统
- **IM系统**：聊天消息、联系人、群组

## 测试与质量

- **代码检查**：ESLint + Prettier
- **自动导入**：unplugin-vue-components, unplugin-vue-define-options
- **构建优化**：rollup-plugin-visualizer用于包大小分析
- **代码压缩**：terser
- **路径修复**：fixDistPath.js

## 常见问题 (FAQ)

1. **移动适配**：使用amfe-flexible和postcss-pxtorem实现移动端适配
2. **多语言**：支持国际化，自动检测和切换语言
3. **混合状态管理**：同时使用Pinia和Vuex，需要注意状态同步
4. **原生功能**：通过Capacitor框架提供原生功能支持

## 相关文件清单

- **核心文件**：
  - `src/main.js` - 应用入口
  - `src/App.vue` - 根组件
  - `src/router/index.js` - 路由配置
  - `src/store/index.js` - Pinia状态管理
  - `src/store/store.js` - Vuex状态管理

- **配置文件**：
  - `package.json` - 项目配置
  - `vite.config.js` - Vite配置
  - `.env` - 环境变量
  - `postcss.config.js` - PostCSS配置

- **样式文件**：
  - `src/assets/css` - 全局样式
  - `src/assets/scss` - SCSS样式

- **工具文件**：
  - `src/assets/remNew.js` - 移动适配
  - `fixDistPath.js` - 构建路径修复

## 变更记录 (Changelog)

- 2025-11-29：初始化wap-vue模块文档