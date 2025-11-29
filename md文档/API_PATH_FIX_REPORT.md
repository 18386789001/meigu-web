# API路径重复问题修复报告

## 🔍 问题分析

### 错误现象
```
POST https://jpmx.xyz/apis/apis/channelBlockchain/list 404 (Not Found)
```

### 问题根源
API路径出现了重复的 `/apis/apis/` 前缀，这是因为：

1. **系统自动添加前缀**: `this.$http.adornUrl()` 方法已经自动添加了 `/apis/` 前缀
2. **手动添加前缀**: 我们在代码中又手动添加了 `/apis/` 前缀
3. **结果**: 最终URL变成了 `/apis/apis/channelBlockchain/list`，导致404错误

### 正确的URL应该是
```
POST https://jpmx.xyz/apis/channelBlockchain/list
```

## 🔧 修复方案

### 1. **修复列表查询接口** ✅

#### 修复前（重复前缀）
```javascript
this.$http({
  url: this.$http.adornUrl("/apis/channelBlockchain/list"),
  method: "post",
})
```
**结果URL**: `/apis/apis/channelBlockchain/list` ❌

#### 修复后（移除手动前缀）
```javascript
this.$http({
  url: this.$http.adornUrl("/channelBlockchain/list"),
  method: "post",
})
```
**结果URL**: `/apis/channelBlockchain/list` ✅

### 2. **修复删除接口** ✅

#### 修复前
```javascript
url: this.$http.adornUrl("/apis/channelBlockchain/delete")
```

#### 修复后
```javascript
url: this.$http.adornUrl("/channelBlockchain/delete")
```

### 3. **修复获取详情接口** ✅

#### 修复前
```javascript
url: this.$http.adornUrl(`/apis/channelBlockchain/info/${this.dataForm.id}`)
```

#### 修复后
```javascript
url: this.$http.adornUrl(`/channelBlockchain/info/${this.dataForm.id}`)
```

### 4. **修复新增/修改接口** ✅

#### 修复前
```javascript
const apiUrl = isUpdate ? '/apis/channelBlockchain/update' : '/apis/channelBlockchain/save'
```

#### 修复后
```javascript
const apiUrl = isUpdate ? '/channelBlockchain/update' : '/channelBlockchain/save'
```

## 📱 修复后的完整接口列表

### 所有接口的正确路径
```javascript
// 1. 列表查询
url: this.$http.adornUrl("/channelBlockchain/list")
// 实际请求: POST /apis/channelBlockchain/list

// 2. 获取详情
url: this.$http.adornUrl(`/channelBlockchain/info/${id}`)
// 实际请求: GET /apis/channelBlockchain/info/{id}

// 3. 新增地址
url: this.$http.adornUrl("/channelBlockchain/save")
// 实际请求: POST /apis/channelBlockchain/save

// 4. 修改地址
url: this.$http.adornUrl("/channelBlockchain/update")
// 实际请求: POST /apis/channelBlockchain/update

// 5. 删除地址
url: this.$http.adornUrl("/channelBlockchain/delete")
// 实际请求: POST /apis/channelBlockchain/delete
```

## 🎯 adornUrl方法工作原理

### 系统配置
```javascript
// 系统的 adornUrl 方法会自动处理：
// 1. 添加基础URL前缀
// 2. 添加 /apis/ 路径前缀
// 3. 处理参数和认证信息

this.$http.adornUrl("/channelBlockchain/list")
// ↓ 系统自动处理
// https://jpmx.xyz/apis/channelBlockchain/list
```

### 错误的使用方式
```javascript
// ❌ 错误：手动添加 /apis/ 前缀
this.$http.adornUrl("/apis/channelBlockchain/list")
// 结果：https://jpmx.xyz/apis/apis/channelBlockchain/list (404错误)
```

### 正确的使用方式
```javascript
// ✅ 正确：让系统自动添加前缀
this.$http.adornUrl("/channelBlockchain/list")
// 结果：https://jpmx.xyz/apis/channelBlockchain/list (正常访问)
```

## 🚀 测试验证

### 验证步骤
1. **清除浏览器缓存**: 确保使用最新代码
2. **打开开发者工具**: 监控Network面板
3. **执行操作**: 进行列表查询、新增、编辑、删除操作
4. **检查请求URL**: 确认所有请求URL都是正确的格式

### 预期结果
```
✅ GET  /apis/channelBlockchain/info/1
✅ POST /apis/channelBlockchain/list
✅ POST /apis/channelBlockchain/save
✅ POST /apis/channelBlockchain/update
✅ POST /apis/channelBlockchain/delete
```

### 不应该出现的错误URL
```
❌ /apis/apis/channelBlockchain/list
❌ /apis/apis/channelBlockchain/update
❌ /apis/apis/channelBlockchain/info/1
```

## 📁 修改的文件

### 1. `admin-vue/src/views/modules/sys-config/public-address.vue`
- **列表查询**: 移除 `/apis/` 手动前缀
- **删除接口**: 移除 `/apis/` 手动前缀

### 2. `admin-vue/src/views/modules/sys-config/public-address-add-or-update.vue`
- **获取详情**: 移除 `/apis/` 手动前缀
- **新增接口**: 移除 `/apis/` 手动前缀
- **修改接口**: 移除 `/apis/` 手动前缀

## 🎊 总结

### 问题解决
✅ **路径重复**: 修复了 `/apis/apis/` 重复前缀问题
✅ **404错误**: 解决了接口404 Not Found错误
✅ **统一规范**: 所有接口都使用统一的路径格式
✅ **系统兼容**: 正确使用系统的 `adornUrl` 方法

### 技术要点
- **理解系统机制**: `adornUrl` 方法会自动添加必要的前缀
- **避免重复前缀**: 不要手动添加系统已经处理的前缀
- **统一接口规范**: 所有相关接口使用相同的路径格式
- **测试验证**: 通过Network面板验证实际请求URL

### 最佳实践
1. **使用相对路径**: 在 `adornUrl` 中使用相对路径，让系统处理前缀
2. **统一命名**: 所有相关接口使用统一的路径前缀
3. **测试验证**: 每次修改后都要验证实际的请求URL
4. **文档记录**: 记录正确的接口使用方式

现在所有的API接口路径都已经修复，不会再出现404错误了！
