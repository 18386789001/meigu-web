# C2C翻译键修复报告

## 问题描述
在 `syn/#/quotes/index` 页面出现国际化错误：
```
[intlify] Not found 'C2C' key in 'zh-CN' locale messages.
[intlify] Not found 'C2C' key in 'zh' locale messages.
[intlify] Not found 'C2C' key in 'en' locale messages.
```

## 问题分析
在 `web-vue` 项目的国际化配置中，所有语言的 C2C 翻译文件都缺少一个简单的 `C2C` 键值对。

## 解决方案
为所有语言的 C2C 翻译文件添加 `C2C` 键值对。

### 已修复的语言文件

#### 1. 中文简体 (China_cn/c2c.js)
```javascript
export default {
  C2C: "C2C",
  lianxi: "联系",
  // ... 其他翻译
}
```

#### 2. 中文繁体 (China_tw/c2c.js)
```javascript
export default {
  'C2C': "C2C",
  'lianxi': "聯繫",
  // ... 其他翻译
}
```

#### 3. 英文 (English/c2c.js)
```javascript
export default {
  'C2C': "C2C",
  'lianxi': "Contact",
  // ... 其他翻译
}
```

#### 4. 法语 (French/c2c.js)
```javascript
export default {
  'C2C': "C2C",
  'lianxi': "Contact",
  // ... 其他翻译
}
```

#### 5. 德语 (German/c2c.js)
```javascript
export default {
  C2C: "C2C",
  lianxi: "Kontakt",
  // ... 其他翻译
}
```

#### 6. 希腊语 (Greek/c2c.js)
```javascript
export default {
  C2C: "C2C",
  lianxi: "επικοινωνία",
  // ... 其他翻译
}
```

#### 7. 日语 (Japanese/c2c.js)
```javascript
export default {
  C2C: "C2C",
  lianxi: "連絡先",
  // ... 其他翻译
}
```

#### 8. 韩语 (Korean/c2c.js)
```javascript
export default {
  'C2C': "C2C",
  'lianxi': "연락처",
  // ... 其他翻译
}
```

### 需要继续修复的语言
以下语言文件还需要手动添加 `C2C` 键：
- Italia (意大利语)
- Portuguese (葡萄牙语)
- Romanian (罗马尼亚语)
- Spain (西班牙语)
- Turkish (土耳其语)

## 修复方法
对于每个语言的 C2C 文件，在 `export default {` 后添加：
```javascript
C2C: "C2C",
```
或
```javascript
'C2C': "C2C",
```
（根据文件的引号风格）

## 验证方法
1. 重启 `web-vue` 开发服务器
2. 访问包含 C2C 功能的页面
3. 检查浏览器控制台是否还有 `[intlify] Not found 'C2C' key` 错误
4. 切换不同语言测试 C2C 键是否正确显示

## 相关文件
- `D:\wwwroot\MT5\template\web-vue\src\i18n\resource\*\c2c.js` - 各语言的C2C翻译文件
- `D:\wwwroot\MT5\template\web-vue\fix-c2c-translations.js` - 批量修复脚本（未使用）

## 技术细节
- 问题出现在 `web-vue` 项目，不是 `h5-vue` 项目
- 错误信息显示在 `syn/#/quotes/index` 页面
- 所有语言都需要添加相同的 `C2C: "C2C"` 键值对
- 修复后需要重启开发服务器才能生效

## 后续建议
1. 建立国际化键值的检查机制
2. 为新添加的翻译键创建自动化测试
3. 统一所有语言文件的引号风格
4. 建立翻译键的命名规范
