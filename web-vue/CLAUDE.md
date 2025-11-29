[根目录](../../CLAUDE.md) > **web-vue**

# web-vue 模块文档

## 模块职责

web-vue是MSX平台的PC端Web应用，提供综合盘和交易所功能，支持包括股票、加密货币、ETF、外汇、大宗商品等多种金融产品的交易服务。该模块面向终端用户，提供完整的交易体验和投资管理功能。

## 入口与启动

- **入口文件**：`src/main.js`
- **应用根组件**：`src/App.vue`
- **启动命令**：
  - 开发环境：`yarn dev`
  - 生产构建：`yarn build`
  - 构建分析：`yarn build:visualizer`

## 对外接口

- **API服务**：位于`src/api`目录，包含：
  - 用户认证：`login.js`
  - 主页数据：`homePage.js`
  - 加密货币：`crypto.js`
  - 市场行情：`marketQuotes.js`, `quotes.js`
  - 股票交易：`kline.js`
  - 订单管理：`order.js`
  - 钱包管理：`wallet.js`
  - 财富管理：`wealth.js`
  - 推广功能：`promote.js`
  - C2C交易：`c2c.js`
  - 新股申购：`newShares.js`
  - 永续合约：`perpetualContract.js`
  - 大宗商品：`commodities.js`
  - ETF交易：`etf.js`
  - 货币兑换：`currency.js`
  - 交割合约：`delivery.js`

- **新API架构**：位于`src/api/newApi`目录
  - 市场配置：`marketConfig.js`
  - 市场行情：`marketQuotes.js`
  - 股票详情：`stockDetail.js`
  - RWA资产：`rwa.js`
  - WebSocket：`websocket.js`

## 关键依赖与配置

- **核心框架**：Vue 3.2.13 + Vue Router 4.1.6
- **状态管理**：Pinia 2.0.33 + 持久化插件
- **UI组件库**：Element Plus 2.3.1 + Element Plus Icons
- **构建工具**：Vite 4.2.1
- **工具库**：
  - HTTP客户端：axios
  - 图表库：echarts, klinecharts
  - 国际化：vue-i18n
  - 样式处理：tailwindcss, sass
  - 滑动验证：vue3-slide-verify
  - 国家选择：vue3-country-intl
  - 二维码：qrcode, vue-qrcode
  - 图片处理：image-conversion
  - 轮播图：swiper

- **环境配置**：
  - 基础配置：`.env`
  - 开发环境：`.env.development`
  - 生产环境：`.env.production`

## 数据模型

- **用户系统**：账户信息、KYC认证、安全设置
- **交易产品**：股票、加密货币、ETF、外汇、大宗商品
- **订单系统**：交易订单、历史记录、成交记录
- **钱包系统**：资产余额、充值提现、资金流水
- **行情数据**：实时报价、K线图表、深度数据
- **资讯内容**：新闻公告、市场分析、教育内容

## 测试与质量

- **代码检查**：ESLint，配置文件：`eslintConfig`
- **自动导入**：unplugin-auto-import, unplugin-vue-components
- **构建优化**：rollup-plugin-visualizer用于包大小分析

## 常见问题 (FAQ)

1. **多模板支持**：支持多种UI模板，通过路由配置切换不同风格
2. **国际化**：支持多语言，使用vue-i18n实现
3. **路由管理**：按功能模块划分路由，支持综合盘和交易所模式
4. **组件复用**：使用composite-home公共组件库实现界面复用

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
  - `tailwind.config.js` - TailwindCSS配置

- **样式文件**：
  - `src/assets/css` - 全局样式
  - `src/assets/css/compositeHome` - 综合盘样式

## 变更记录 (Changelog)

- 2025-11-29：初始化web-vue模块文档