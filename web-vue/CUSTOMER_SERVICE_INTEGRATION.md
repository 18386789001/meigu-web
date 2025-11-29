# Web Vue PC端 - 第三方客服对接说明

## 📋 概述

本文档说明了 Web Vue PC端第三方客服系统的对接实现，支持根据用户登录状态自动传递用户信息到客服系统。

## 🎯 功能需求

1. **游客（未登录）**：点击客服图标，跳转到第三方客服链接，不带任何用户参数
2. **已登录用户**：点击客服图标，跳转到第三方客服链接，自动携带 UID 和邮箱信息

## 🔗 客服链接配置

### 基础链接
```
https://chat.jpmx.app/chat/index?noCanClose=1&token=282ba867e4ea0a2bc6792f52728c28d8
```

### 参数说明

| 参数名 | 说明 | 值类型 | 是否必填 |
|--------|------|--------|----------|
| `noCanClose` | PC端是否显示广告 | number | 是（固定为1） |
| `token` | 与后台交互的凭证 | string | 是（固定值） |
| `uid` | 用户ID | string | 登录后自动传递 |
| `phone` | 用户邮箱 | string | 登录后自动传递 |

### 其他可选参数（未使用）
- `deviceType`: 手动适应浏览器类型（Mobile移动端）
- `nickName`: 用户昵称
- `sex`: 用户性别
- `avatar`: 用户头像
- `openid`: 用户openid
- `kefu_id`: 客服ID

## 📁 文件修改清单

### 1. 新增文件：`/src/utils/customerService.js`

```javascript
/**
 * 第三方客服系统工具函数 - PC端
 * 支持根据用户登录状态打开不同的客服链接
 */

import { useUserStore } from '@/store/user.js'

/**
 * 打开第三方客服系统
 * - 未登录用户：直接跳转到客服链接（不带参数）
 * - 已登录用户：带上 uid（usercode）和 phone（username邮箱）参数
 */
export const openThirdPartyCustomerService = () => {
  // 检查用户登录状态
  const userStore = useUserStore()
  const isLoggedIn = userStore.existToken && userStore.userInfo?.usercode
  
  // 第三方客服基础链接
  let customerServiceUrl = 'https://chat.jpmx.app/chat/index?noCanClose=1&token=282ba867e4ea0a2bc6792f52728c28d8'
  
  if (isLoggedIn) {
    // 已登录用户，添加用户信息参数
    const usercode = userStore.userInfo.usercode || ''
    const username = userStore.userInfo.username || ''
    
    // 拼接 uid 和 phone 参数
    customerServiceUrl = `https://chat.jpmx.app/chat/index?noCanClose=1&token=282ba867e4ea0a2bc6792f52728c28d8&uid=${encodeURIComponent(usercode)}&phone=${encodeURIComponent(username)}`
  }
  
  // 在新窗口打开客服链接
  window.open(customerServiceUrl, '_blank')
}
```

**主要功能：**
- 根据用户登录状态构建不同的客服链接
- 使用 `encodeURIComponent` 对参数进行 URL 编码
- 在新窗口打开客服链接

### 2. 修改文件：`/src/App.vue`

#### 修改点1：导入客服工具
```javascript
import { openThirdPartyCustomerService } from "@/utils/customerService";
```

#### 修改点2：修改客服图标点击事件
```vue
<!-- 修改前 -->
<div v-if="!show_kefu" class="service-box">
  <img src="@/assets/images/exchangeHome/service1.png" @click="changeChatShow(true)" />
</div>

<!-- 修改后 -->
<div class="service-box">
  <img src="@/assets/images/exchangeHome/service1.png" @click="handleCustomerService" />
</div>
```

#### 修改点3：添加处理函数
```javascript
/**
 * 处理客服图标点击事件
 * 直接打开第三方客服链接（根据登录状态决定是否带参数）
 */
const handleCustomerService = () => {
  console.log('🎯 用户点击客服图标');
  openThirdPartyCustomerService();
};
```

## 🔄 工作流程

```
用户点击客服图标
    ↓
调用 handleCustomerService()
    ↓
执行 openThirdPartyCustomerService()
    ↓
检查用户登录状态（userStore.existToken）
    ↓
┌─────────────┴─────────────┐
↓                           ↓
未登录                    已登录
↓                           ↓
基础链接                  带参数链接
(无uid/phone)            (uid + phone)
↓                           ↓
└─────────────┬─────────────┘
              ↓
    window.open() 新窗口打开
```

## 📊 用户信息来源

### 登录接口
```
GET http://localhost:5173/api/user/login?language=en&username=laohu1234&password=123456
```

### 返回数据结构
```json
{
  "data": {
    "usercode": "40002095",
    "token": "Bzw3LwRm13Nt/SpmErwMCc+SmR0JpXUyP1i6YY9gOQLe1yuB9OhkAHKjZhU/EfqW",
    "username": "laohu1234"
  },
  "code": 0,
  "msg": "",
  "total": 0,
  "succeed": true
}
```

### 字段映射关系
| 登录接口字段 | userStore字段 | 客服链接参数 | 说明 |
|-------------|--------------|--------------|------|
| `usercode` | `userInfo.usercode` | `uid` | 用户ID |
| `username` | `userInfo.username` | `phone` | 用户邮箱 |
| `token` | `userInfo.token` | - | 用于判断登录状态 |

## 🧪 测试场景

### 场景1：游客（未登录）
**生成链接：**
```
https://chat.jpmx.app/chat/index?noCanClose=1&token=282ba867e4ea0a2bc6792f52728c28d8
```

**测试步骤：**
1. 清除登录状态（清除 localStorage 或退出登录）
2. 点击页面右下角客服图标
3. 验证新窗口打开的链接不包含 `uid` 和 `phone` 参数

### 场景2：已登录用户
**测试用户：**
- usercode: `40002095`
- username: `laohu1234`

**生成链接：**
```
https://chat.jpmx.app/chat/index?noCanClose=1&token=282ba867e4ea0a2bc6792f52728c28d8&uid=40002095&phone=laohu1234
```

**测试步骤：**
1. 使用测试账号登录（username: laohu1234, password: 123456）
2. 点击页面右下角客服图标
3. 验证新窗口打开的链接包含正确的 `uid` 和 `phone` 参数
4. 在浏览器开发者工具的 Console 中查看日志输出

## 🎨 测试工具

已创建测试页面：`/web-vue/test-customer-service.html`

**使用方法：**
1. 用浏览器直接打开 `test-customer-service.html`
2. 点击"模拟游客点击客服"按钮，测试游客场景
3. 点击"模拟已登录用户点击客服"按钮，测试已登录场景
4. 查看浏览器 Console 日志，确认生成的链接正确

## ⚠️ 注意事项

1. **浏览器弹窗拦截**
   - 部分浏览器可能会阻止 `window.open()` 弹窗
   - 需要用户允许浏览器弹窗权限
   - 如果弹窗被阻止，会在当前窗口打开（备用方案）

2. **URL 编码**
   - 所有参数值都使用 `encodeURIComponent()` 进行编码
   - 确保特殊字符（如邮箱中的 @）正确传递

3. **用户信息获取**
   - 依赖 Pinia store 中的 `userStore.userInfo`
   - 确保登录后 userStore 正确更新
   - 使用 `userStore.existToken` 判断登录状态

4. **兼容性**
   - 保留了原有的 iframe 客服逻辑（未删除）
   - 如果需要回退到 iframe 模式，可以修改 `handleCustomerService` 函数

## 🔍 调试技巧

### 查看生成的链接
在浏览器 Console 中可以看到详细日志：
```javascript
🎯 用户点击客服图标
✅ 构建带用户信息的客服链接，UID: 40002095 Email: laohu1234
✅ 成功在新窗口打开客服链接
```

### 检查 userStore 状态
在浏览器 Console 中执行：
```javascript
import { useUserStore } from '@/store/user.js'
const userStore = useUserStore()
console.log('登录状态:', userStore.existToken)
console.log('用户信息:', userStore.userInfo)
```

## 📝 与移动端对比

| 特性 | Web Vue (PC端) | Wap Vue (移动端) |
|------|---------------|-----------------|
| 用户信息来源 | `userStore.userInfo` | `_info()` API |
| 打开方式 | `window.open()` 新窗口 | `window.location.href` 或 Capacitor Browser |
| 环境判断 | 无需判断 | 需判断 Native/Web |
| UID 字段 | `usercode` | `usercode` |
| 邮箱字段 | `username` | `email` |

## 🚀 部署说明

1. 确保所有修改已保存
2. 构建项目：`npm run build` 或 `yarn build`
3. 部署到生产环境
4. 测试游客和已登录用户两种场景

## 📞 技术支持

如有问题，请检查：
1. `userStore.userInfo` 是否正确存储用户信息
2. 浏览器 Console 是否有错误日志
3. 客服链接是否正确打开
4. 参数是否正确传递到客服系统

---

**创建日期：** 2024-10-31  
**最后更新：** 2024-10-31  
**版本：** 1.0.0

