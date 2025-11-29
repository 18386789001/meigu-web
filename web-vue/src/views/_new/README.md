# 新首页模块说明文档

## 📋 概述

这是基于 Coinstore 设计的全新加密货币交易平台首页，位于 `src/views/_new/home/` 目录。

## 🎯 设计目标

- **现代化设计**: 采用品牌粉色 (#FF00FF) 作为主色调，黑色按钮作为 CTA 元素
- **模块化架构**: 每个区域都是独立的组件，便于维护和复用
- **响应式布局**: 完美适配桌面、平板和移动端
- **国际化支持**: 支持中英文切换，易于扩展其他语言
- **性能优化**: 组件懒加载、骨架屏、无限滚动等优化措施

## 📁 目录结构

```
src/views/_new/
├── home/                           # 首页模块
│   ├── index.vue                   # 首页入口文件
│   ├── components/                 # 首页组件
│   │   ├── HeroSection.vue         # Hero区域（标题+注册表单）
│   │   ├── TickerBar.vue           # 实时行情滚动条
│   │   ├── AnnouncementBar.vue     # 公告栏
│   │   ├── PopularEvents.vue       # 热门活动区域
│   │   ├── EventCard.vue           # 活动卡片
│   │   ├── NewListing.vue          # 新币上线区域
│   │   ├── ListingCard.vue         # 新币卡片（含3D效果）
│   │   ├── Markets.vue             # 市场行情区域
│   │   └── TradeAnywhere.vue       # APP下载区域
│   └── styles/                     # 样式文件
│       ├── variables.scss          # 样式变量
│       └── common.scss             # 通用样式
│
├── components/                     # 公共组件
│   ├── layout/                     # 布局组件
│   │   ├── Header.vue              # 顶部导航栏
│   │   └── Footer.vue              # 页脚
│   └── common/                     # 通用组件
│       ├── CoinIcon.vue            # 币种图标
│       ├── PercentBadge.vue        # 涨跌百分比
│       └── LangSelect.vue          # 语言选择器
│
└── README.md                       # 本文档
```

## 🚀 快速开始

### 1. 访问新首页

启动项目后，访问以下地址查看新首页：

```
http://localhost:5173/#/new-home
```

### 2. 开发新功能

在 `src/views/_new/home/components/` 目录下创建新组件，然后在 `index.vue` 中引入使用。

### 3. 修改样式

全局样式变量在 `src/views/_new/home/styles/variables.scss` 中定义，可以根据需要修改：

```scss
// 品牌色
$primary-color: #FF00FF;       // 主品牌色
$primary-dark: #E91EF0;        // 品牌色-深

// 中性色
$color-black: #000000;         // 纯黑
$color-text-primary: #1A1B23;  // 主文字

// 涨跌色
$color-up: #00C087;            // 上涨绿
$color-down: #FF4D4F;          // 下跌红
```

## 📦 核心组件说明

### Header 组件

**位置**: `src/views/_new/components/layout/Header.vue`

**功能**:
- Logo 和主导航菜单
- 登录/注册按钮
- 用户头像和下拉菜单
- 通知图标
- 语言选择器
- 移动端响应式菜单

### Hero Section 组件

**位置**: `src/views/_new/home/components/HeroSection.vue`

**功能**:
- 超大标题展示 "One Touch To Crypto"
- 注册表单（邮箱输入 + CTA按钮）
- APP 下载图标
- 背景装饰效果

**特点**:
- 响应式字体大小
- 邮箱验证
- 跳转到注册页面时携带邮箱参数

### Ticker Bar 组件

**位置**: `src/views/_new/home/components/TickerBar.vue`

**功能**:
- 实时行情数据展示
- 自动无限滚动
- 点击跳转到交易页面

**技术实现**:
- 使用 `requestAnimationFrame` 实现平滑滚动
- 双份数据实现无缝循环
- 每30秒自动更新数据

### Popular Events 组件

**位置**: `src/views/_new/home/components/PopularEvents.vue`

**功能**:
- 展示热门活动卡片
- 网格布局（响应式）
- 支持自定义背景和按钮

**EventCard 特点**:
- 支持背景图片、渐变色
- Logo 和插图展示
- 悬浮动画效果
- 点击跳转到活动详情

### New Listing 组件

**位置**: `src/views/_new/home/components/NewListing.vue`

**功能**:
- 展示新上线的币种
- 深色背景 + 3D 图标效果
- 光晕动画

**ListingCard 特点**:
- 深色渐变背景
- 3D 币种图标
- 圆形光晕效果（径向渐变）
- 悬浮时图标旋转和放大

### Markets 组件

**位置**: `src/views/_new/home/components/Markets.vue`

**功能**:
- Tab 切换（涨幅榜/热门/实验室）
- 行情表格展示
- 涨跌幅显示
- 交易按钮

**特点**:
- Element Plus Table 组件
- 响应式列宽
- 点击行跳转到交易页面

### Trade Anywhere 组件

**位置**: `src/views/_new/home/components/TradeAnywhere.vue`

**功能**:
- APP 下载推广
- 二维码展示
- 多平台下载按钮
- 手机预览图

### Footer 组件

**位置**: `src/views/_new/components/layout/Footer.vue`

**功能**:
- 4列菜单导航
- Logo 和语言选择
- 二维码下载
- 社交媒体图标
- 版权信息

## 🎨 设计规范

### 色彩体系

| 颜色名称 | 颜色值 | 用途 |
|---------|--------|------|
| 品牌主色 | #FF00FF | Logo、强调元素、按钮 |
| 黑色 | #000000 | CTA按钮、文字 |
| 白色 | #FFFFFF | 背景、按钮文字 |
| 上涨绿 | #00C087 | 涨幅百分比 |
| 下跌红 | #FF4D4F | 跌幅百分比 |

### 字体规范

- **超大标题**: 80-100px, Bold
- **大标题**: 48-60px, Bold
- **小标题**: 24-32px, Semibold
- **正文**: 14-16px, Regular
- **按钮文字**: 14-16px, Medium

### 间距规范

- **区块间距**: 80-120px
- **卡片间距**: 24-32px
- **内边距**: 24px, 32px, 48px

### 圆角规范

- **按钮**: 8-12px
- **卡片**: 16-20px
- **输入框**: 8-12px

## 🔌 API 接口

所有 API 接口定义在 `src/api/crypto.js`：

```javascript
// 获取实时行情
getRealtimeTickers(params)

// 获取热门活动
getPopularEvents()

// 获取新币上线
getNewListings(params)

// 获取市场数据
getMarketData(params)

// 快速注册
quickRegister(data)
```

## 🌍 国际化

### 添加新语言

1. 在 `src/i18n/resource/` 下创建对应语言文件夹
2. 创建 `newHome.js` 文件，参考现有的中英文文件结构
3. 在 `src/i18n/langs/` 对应语言文件中导入并配置

### 使用翻译

```vue
<template>
  <div>{{ $t('newHome.hero.title1') }}</div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const title = t('newHome.hero.title1');
</script>
```

## 📱 响应式断点

```scss
$breakpoint-xs: 480px;   // 手机（竖屏）
$breakpoint-sm: 640px;   // 手机（横屏）
$breakpoint-md: 768px;   // 平板（竖屏）
$breakpoint-lg: 1024px;  // 平板（横屏）
$breakpoint-xl: 1280px;  // 笔记本
$breakpoint-2xl: 1536px; // 桌面
```

## ⚡ 性能优化

### 已实现的优化

1. **组件懒加载**: 路由级别的组件使用动态导入
2. **图片懒加载**: 使用 `v-lazy` 指令
3. **防抖节流**: 滚动和搜索事件使用防抖
4. **无限滚动**: Ticker Bar 使用 RAF 实现平滑滚动
5. **CSS 优化**: 使用 `transform` 和 `opacity` 实现动画

### 待优化项

1. 添加骨架屏加载状态
2. 虚拟滚动（长列表）
3. 代码分割优化
4. CDN 加速静态资源

## 🔧 常见问题

### Q: 如何修改首页路由？

A: 编辑 `src/router/newHome.js` 文件中的 `path` 属性。

### Q: 如何添加新的区块？

A:
1. 在 `src/views/_new/home/components/` 创建新组件
2. 在 `index.vue` 中导入并使用
3. 添加相应的国际化翻译

### Q: 如何对接真实 API？

A:
1. 编辑各组件中的 `fetch` 方法
2. 取消注释 API 调用代码
3. 删除或注释掉模拟数据

### Q: 样式与 Element Plus 冲突怎么办？

A: 使用 `:deep()` 伪类选择器覆盖 Element Plus 样式：

```scss
:deep(.el-button) {
  background: $color-black;
}
```

## 📝 更新日志

### v1.0.0 (2024-01-15)

- ✨ 初始版本发布
- ✨ 实现 Hero Section、Popular Events、New Listing、Markets 等核心区域
- ✨ 完成响应式布局
- ✨ 支持中英文国际化
- ✨ 添加实时行情滚动条
- ✨ 3D 新币卡片效果

## 🤝 贡献指南

1. 遵循现有的代码风格和组件结构
2. 新组件需要添加完整的 props 类型定义
3. 样式使用 SCSS 编写，遵循 BEM 命名规范
4. 提交前确保代码通过 ESLint 检查
5. 添加必要的注释和文档

## 📄 许可证

Copyright © 2024 Coinstore. All rights reserved.

---

**文档最后更新**: 2024-01-15
**维护人员**: Development Team
**联系方式**: dev@coinstore.com
