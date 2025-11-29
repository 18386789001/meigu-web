# Web Vue - 客服链接全面更新报告

## 📋 更新概述

根据需求，对 Web Vue PC端所有客服相关功能进行了全面更新，统一使用新的第三方客服链接系统。

## 🎯 更新内容

### 1. 银行卡充值订单成功页面
**文件路径：** `/src/views/wallet/recharge/successOrder.vue`

#### 修改1：隐藏银行信息
- ✅ 隐藏了"银行名称"（Bank Name）字段
- ✅ 隐藏了"账户地址"（Account address）字段
- ✅ 保留了"总价"（Total Price）字段

**修改位置：** 第116-129行
```vue
<!-- 银行名称 - 已隐藏 -->
<!-- <div class="t-box">
  <p class="label">{{ $t("message.user.yinhangmingcheng") }}</p>
  <p class="price">{{ detailInfo?.paramValue1 }}</p>
</div> -->

<!-- 账户地址 - 已隐藏 -->
<!-- <div class="t-box">
  <p class="label">{{ $t("message.user.zhanghudizhi") }}</p>
  <p class="price">{{ detailInfo.paramValue3 }}</p>
</div> -->
```

#### 修改2：更新客服链接
- ✅ 导入第三方客服工具函数
- ✅ "To pay"（去付款）按钮 → 跳转到第三方客服
- ✅ "Contact customer service"（联系客服）按钮 → 跳转到第三方客服
- ✅ "Online customer service"（在线客服）区域 → 跳转到第三方客服

**修改的方法：**
```javascript
handleShowChat() {
  // 打开第三方客服
  openThirdPartyCustomerService();
}

handleGotoPay() {
  // 打开第三方客服
  openThirdPartyCustomerService();
}

onRoute() {
  openThirdPartyCustomerService();
}
```

### 2. 充值订单详情页面
**文件路径：** `/src/views/wallet/recharge/detail.vue`

#### 更新内容
- ✅ 导入第三方客服工具函数
- ✅ "联系客服"按钮 → 跳转到第三方客服

**修改的方法：**
```javascript
handleShowChat() {
  // 打开第三方客服
  openThirdPartyCustomerService();
}
```

### 3. 提现订单详情页面
**文件路径：** `/src/views/wallet/withdraw/detail.vue`

#### 更新内容
- ✅ 导入第三方客服工具函数
- ✅ "联系客服"按钮 → 跳转到第三方客服

**修改的方法：**
```javascript
handleShowChat() {
  // 打开第三方客服
  openThirdPartyCustomerService();
}
```

## 📊 修改文件清单

| 序号 | 文件路径 | 修改内容 | 状态 |
|-----|---------|---------|------|
| 1 | `/src/views/wallet/recharge/successOrder.vue` | 隐藏银行信息 + 更新客服链接 | ✅ 完成 |
| 2 | `/src/views/wallet/recharge/detail.vue` | 更新客服链接 | ✅ 完成 |
| 3 | `/src/views/wallet/withdraw/detail.vue` | 更新客服链接 | ✅ 完成 |

## 🔄 工作原理

所有客服相关按钮现在都调用统一的 `openThirdPartyCustomerService()` 函数：

```javascript
import { openThirdPartyCustomerService } from "@/utils/customerService";

// 调用示例
handleShowChat() {
  openThirdPartyCustomerService();
}
```

该函数会：
1. 检查用户登录状态
2. **未登录用户**：跳转到基础客服链接（不带参数）
   ```
   https://chat.jpmx.app/chat/index?noCanClose=1&token=282ba867e4ea0a2bc6792f52728c28d8
   ```

3. **已登录用户**：跳转到带用户信息的客服链接
   ```
   https://chat.jpmx.app/chat/index?noCanClose=1&token=282ba867e4ea0a2bc6792f52728c28d8&uid=40002095&phone=laohu1234
   ```

## 🎨 用户体验变化

### 银行卡充值订单成功页面
**修改前：**
- 显示银行名称和账户地址
- 点击"去付款"打开聊天窗口
- 点击"联系客服"打开聊天窗口

**修改后：**
- ❌ 不显示银行名称和账户地址（已隐藏）
- ✅ 点击"去付款" → 在新窗口打开第三方客服
- ✅ 点击"联系客服" → 在新窗口打开第三方客服
- ✅ 点击"在线客服"区域 → 在新窗口打开第三方客服

### 充值/提现详情页面
**修改前：**
- 点击"联系客服"打开右侧聊天窗口

**修改后：**
- ✅ 点击"联系客服" → 在新窗口打开第三方客服

## 🧪 测试建议

### 测试场景1：未登录用户
1. 清除登录状态
2. 访问银行卡充值订单页面
3. 点击"去付款"按钮
4. 验证打开的客服链接**不包含** `uid` 和 `phone` 参数

### 测试场景2：已登录用户
1. 使用测试账号登录（laohu1234 / 123456）
2. 访问银行卡充值订单页面
3. 点击"去付款"按钮
4. 验证打开的客服链接**包含**正确的 `uid` 和 `phone` 参数

### 测试场景3：验证银行信息隐藏
1. 创建一个银行卡充值订单
2. 访问订单成功页面（`/bank/orderSuccess?id=xxx`）
3. 验证页面**不显示**银行名称和账户地址
4. 验证只显示"总价"（Total Price）

### 测试场景4：充值详情页面
1. 访问充值订单详情页面
2. 点击"联系客服"按钮
3. 验证打开第三方客服链接

### 测试场景5：提现详情页面
1. 访问提现订单详情页面
2. 点击"联系客服"按钮
3. 验证打开第三方客服链接

## 📝 其他检查的页面

以下页面也进行了检查，但未发现需要修改的客服链接：

| 文件路径 | 检查结果 | 说明 |
|---------|---------|------|
| `/src/views/wallet/withdraw/usdt.vue` | ✅ 无需修改 | 有被注释的客服按钮，无需处理 |
| `/src/views/wallet/withdraw/successDialog.vue` | ✅ 无需修改 | 只有文字提示，无实际客服按钮 |
| `/src/views/wallet/menu/walletOverview.vue` | ✅ 无需修改 | 无客服相关功能 |
| `/src/App.vue` | ✅ 已更新 | 全局客服图标（之前已完成） |

## ⚠️ 注意事项

1. **浏览器弹窗权限**
   - 部分浏览器可能会阻止 `window.open()` 弹窗
   - 用户需要允许浏览器弹窗权限
   - 如果弹窗被阻止，会在当前窗口打开（备用方案）

2. **用户信息传递**
   - 依赖 Pinia store 中的 `userStore.userInfo`
   - 确保登录后 userStore 正确更新用户信息
   - UID 字段：`userInfo.usercode`
   - 邮箱字段：`userInfo.username`

3. **兼容性**
   - 所有页面都保留了原有的聊天窗口组件（RightChat）
   - 如果需要回退到原有方案，可以轻松还原

## 🔍 调试技巧

### 查看生成的客服链接
在浏览器 Console 中可以看到详细日志：
```javascript
🎯 用户点击客服图标
✅ 构建带用户信息的客服链接，UID: 40002095 Email: laohu1234
✅ 成功在新窗口打开客服链接
```

### 检查 userStore 状态
在浏览器 Console 中执行：
```javascript
// 检查登录状态
console.log('登录状态:', useUserStore().existToken)

// 检查用户信息
console.log('用户信息:', useUserStore().userInfo)
```

## 🚀 部署清单

1. ✅ 确保所有修改已保存
2. ✅ 所有文件无 linter 错误
3. ⏳ 构建项目：`npm run build` 或 `yarn build`
4. ⏳ 部署到测试环境进行测试
5. ⏳ 测试所有场景（未登录/已登录）
6. ⏳ 部署到生产环境

## 📞 相关文档

- [客服对接完整文档](./CUSTOMER_SERVICE_INTEGRATION.md)
- [客服工具源码](./src/utils/customerService.js)
- [测试页面](./test-customer-service.html)

---

**更新日期：** 2024-11-01  
**更新人员：** AI Assistant  
**版本：** 1.0.0  
**状态：** ✅ 已完成

