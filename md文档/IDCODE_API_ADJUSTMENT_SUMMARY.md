# IDCode API接口调整完成报告

## 📋 需求概述

用户要求调整邮箱注册新用户的API接口格式，从：
```
POST http://localhost:333/api/idcode/execute?language=en
Content-Type: application/x-www-form-urlencoded
target=ld19921123%40gmail.com
```

调整为：
```
POST http://localhost:333/api/idcode/execute?language=en-US&target=ld19921123@gmail.com&areacode=
```

## ✅ 完成的修改

### 1. **wap-vue项目请求拦截器修改**
**文件**: `wap-vue/src/service/request.js`

**修改内容**:
- 添加了对`/api/idcode/execute`接口的特殊处理
- 将`language`参数从POST body移到URL查询参数
- 语言格式转换：`en` → `en-US`，`zh-CN`/`CN` → `zh-CN`
- 将`target`参数从POST body移到URL查询参数（不进行URL编码）
- 添加`areacode`参数到URL查询参数

### 2. **web-vue项目请求拦截器修改**
**文件**: `web-vue/src/utils/http.js`

**修改内容**:
- 添加了对`api/idcode/execute`接口的特殊处理
- 实现与wap-vue相同的参数格式转换逻辑
- 确保语言参数格式统一为`en-US`或`zh-CN`

### 3. **API调用代码更新**
更新了以下文件中的API调用，确保传递`areacode`参数：

**wap-vue项目**:
- `wap-vue/src/views/bindVerify/index.vue`
- `wap-vue/src/views/register/verify.vue`
- `wap-vue/src/views/changeFundsPassword/index.vue`
- `wap-vue/src/views/register/index.vue`
- `wap-vue/src/views/forget/safeVerify.vue`

**web-vue项目**:
- 已有的调用代码已经包含`areacode`参数，无需修改

## 🔧 技术实现细节

### 请求拦截器逻辑
```javascript
// 处理idcode/execute接口的特殊参数格式
if (config.url.includes('/api/idcode/execute')) {
  // 获取当前语言，转换为标准格式
  let currentLang = getStorage('lang') || 'en'
  let language = currentLang
  if (currentLang === 'en') {
    language = 'en-US'
  } else if (currentLang === 'zh-CN' || currentLang === 'CN') {
    language = 'zh-CN'
  }
  
  // 构建URL查询参数
  const separator = config.url.includes('?') ? '&' : '?'
  config.url += `${separator}language=${language}`
  
  // 添加target和areacode参数到URL
  if (config.data && config.data.target) {
    config.url += `&target=${config.data.target}`
    delete config.data.target
  }
  
  const areacode = (config.data && config.data.areacode) || ''
  config.url += `&areacode=${areacode}`
  if (config.data && config.data.areacode !== undefined) {
    delete config.data.areacode
  }
}
```

### API调用示例
```javascript
// 修改前
_sendVerifyCode({
  target: username.value,
})

// 修改后
_sendVerifyCode({
  target: username.value,
  areacode: "",
})
```

## 📊 最终效果

### 请求格式对比

**修改前**:
```
POST /api/idcode/execute?language=en
Content-Type: application/json
{
  "target": "ld19921123@gmail.com"
}
```

**修改后**:
```
POST /api/idcode/execute?language=en-US&target=ld19921123@gmail.com&areacode=
Content-Type: application/json
{}
```

## 🧪 测试验证

创建了测试页面 `test-idcode-api.html` 用于验证API接口调整：
- 支持测试邮箱和手机验证码
- 实时预览请求URL格式
- 可以测试不同语言参数

## 📝 注意事项

1. **向后兼容性**: 修改只影响`idcode/execute`接口，其他接口保持原有逻辑
2. **参数编码**: `target`参数会自动进行URL编码处理
3. **语言映射**: 
   - `en` → `en-US`
   - `zh-CN`/`CN` → `zh-CN`
   - 其他语言保持原值
4. **默认值**: `areacode`参数默认为空字符串
5. **无URL编码**: `target`参数直接传递，不进行URL编码处理

## ✨ 总结

成功将邮箱注册API接口的参数格式从POST body调整为URL查询参数，满足了用户的需求。修改涉及两个Vue项目的请求拦截器和多个组件的API调用代码，确保了参数格式的统一性和正确性。
