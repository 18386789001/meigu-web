# H5-vue - MT5移动端官网

## 项目简介

H5-vue是MT5交易平台的移动端官网项目，专为移动设备优化设计。当用户使用PC端访问时，系统会自动重定向到PC版本（web-vue）；当用户使用移动端访问时，会显示这个专门优化的H5版本。

## 技术栈

- **框架**: Vue 3 + Vite
- **路由**: Vue Router 4
- **状态管理**: Pinia
- **UI组件**: Element Plus
- **国际化**: Vue I18n
- **样式**: SCSS + CSS Variables
- **构建工具**: Vite
- **包管理**: npm/yarn

## 项目结构

```
h5-vue/
├── public/                 # 静态资源
├── src/
│   ├── api/               # API接口
│   ├── assets/            # 资源文件
│   │   ├── css/           # 样式文件
│   │   ├── images/        # 图片资源
│   │   └── icons/         # 图标资源
│   ├── components/        # 组件
│   │   ├── common/        # 通用组件
│   │   ├── mobile/        # 移动端专用组件
│   │   └── ...           # 其他组件
│   ├── config/            # 配置文件
│   ├── i18n/             # 国际化
│   ├── router/            # 路由配置
│   ├── store/             # 状态管理
│   ├── utils/             # 工具函数
│   ├── views/             # 页面组件
│   ├── App.vue            # 根组件
│   └── main.js            # 入口文件
├── index.html             # HTML模板
├── package.json           # 项目配置
├── vite.config.js         # Vite配置
└── README.md              # 项目说明
```

## 功能特性

### 🎨 现代化UI设计
- 深色主题设计，符合金融交易平台风格
- 响应式布局，适配各种移动设备
- 流畅的动画效果和交互体验
- 符合Material Design和iOS设计规范

### 📱 移动端优化
- 触摸友好的交互设计
- 最小44px触摸目标尺寸
- 防止iOS缩放和长按选择
- 安全区域适配（刘海屏、底部指示器）
- 手势操作支持

### 🌍 多语言支持
- 支持中文、英文、日文、韩文、泰文、越南文
- 自动检测浏览器语言
- 语言切换实时生效
- 本地存储语言偏好

### 🧭 智能导航
- 汉堡菜单设计
- 侧边栏导航
- 底部导航栏
- 面包屑导航
- 返回顶部按钮

### 🔄 自动设备检测
- 自动检测移动端/桌面端
- 桌面端自动重定向到PC版本
- 移动端显示H5版本
- 响应式断点管理

### 🎯 交易功能集成
- 交易产品展示
- 实时行情数据
- 平台介绍
- 教育中心
- 客户支持

## 开发指南

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0

### 安装依赖
```bash
# 使用npm
npm install

# 或使用yarn
yarn install
```

### 开发模式
```bash
# 启动开发服务器
npm run dev

# 或
yarn dev
```

访问 http://localhost:3333

### 构建生产版本
```bash
# 构建生产版本
npm run build

# 或
yarn build
```

### 预览生产版本
```bash
# 预览生产版本
npm run preview

# 或
yarn preview
```

## 配置说明

### 环境变量
项目支持以下环境变量：

- `VITE_APP__TITLE`: 应用标题
- `VITE_APP__EMAIL`: 联系邮箱

### API配置
- 开发环境：通过Vite代理转发到生产环境
- 生产环境：直接调用API接口
- WebSocket：支持实时数据推送

### 路由配置
- 自动路由懒加载
- 路由守卫和权限控制
- 移动端专用路由

## 部署说明

### 构建部署
1. 执行 `npm run build` 构建项目
2. 将 `dist` 目录部署到Web服务器
3. 配置Nginx或Apache支持SPA路由

### 环境配置
- 开发环境：http://localhost:3333
- 生产环境：根据实际部署地址配置

## 浏览器支持

- iOS Safari >= 12
- Android Chrome >= 70
- Android Firefox >= 68
- Samsung Internet >= 10
- UC Browser >= 12

## 性能优化

- 代码分割和懒加载
- 图片懒加载和压缩
- CSS和JS压缩
- 缓存策略优化
- PWA支持（可选）

## 开发规范

### 代码风格
- 使用ESLint和Prettier
- 遵循Vue 3 Composition API
- 组件命名使用PascalCase
- 文件命名使用kebab-case

### 提交规范
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式调整
- refactor: 代码重构
- test: 测试相关
- chore: 构建过程或辅助工具的变动

## 常见问题

### Q: 如何添加新的语言支持？
A: 在 `src/i18n/` 目录下添加新的语言文件，并在 `src/i18n/index.js` 中注册。

### Q: 如何自定义主题颜色？
A: 修改 `src/assets/css/variables.scss` 中的CSS变量。

### Q: 如何添加新的页面？
A: 在 `src/views/` 目录下创建页面组件，并在 `src/router/index.js` 中添加路由配置。

### Q: 如何调试移动端？
A: 使用Chrome DevTools的设备模拟器，或通过局域网IP在真机上访问。

## 更新日志

### v1.0.0 (2024-01-01)
- 初始版本发布
- 基础移动端UI框架
- 多语言支持
- 设备检测和自动切换
- 交易功能集成

## 许可证

MIT License

## 联系方式

- 项目维护者：Demo Team
- 邮箱：support@demo.com
- 项目地址：https://github.com/demo/h5-vue
