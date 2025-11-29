/**
 * localStorage数据清理和修复工具
 * 用于检测和修复生产环境中的localStorage数据损坏问题
 */

// 支持的语言代码列表
const VALID_LANGUAGES = [
  'zh-CN', 'zh-TW', 'en-US', 'ja-JP', 'ko-KR', 
  'th-TH', 'vi-VN', 'de-DE', 'es-ES', 'fr-FR', 
  'it-IT', 'pt-PT', 'el-GR'
];

// 需要JSON格式的localStorage键
const JSON_KEYS = ['userInfo', 'preferences', 'settings'];

/**
 * 检测localStorage中的数据问题
 */
export function detectLocalStorageIssues() {
  const issues = [];
  
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      
      if (!value) continue;
      
      // 检查JSON格式的键
      if (JSON_KEYS.includes(key)) {
        if (typeof value === 'string' && !value.startsWith('{') && !value.startsWith('[')) {
          issues.push({
            type: 'invalid_json',
            key,
            value,
            message: `键 "${key}" 应该是JSON格式，但存储了普通字符串: "${value}"`
          });
        } else if (value.startsWith('{') || value.startsWith('[')) {
          try {
            JSON.parse(value);
          } catch (error) {
            issues.push({
              type: 'json_parse_error',
              key,
              value,
              message: `键 "${key}" 包含无效的JSON数据: ${error.message}`
            });
          }
        }
      }
      
      // 检查语言代码
      if (key === 'lang') {
        if (!VALID_LANGUAGES.includes(value)) {
          issues.push({
            type: 'invalid_language',
            key,
            value,
            message: `无效的语言代码: "${value}"`
          });
        }
      }
      
      // 检查是否有语言代码被错误存储到其他键中
      if (key !== 'lang' && VALID_LANGUAGES.includes(value)) {
        issues.push({
          type: 'misplaced_language',
          key,
          value,
          message: `语言代码 "${value}" 被错误存储到键 "${key}" 中`
        });
      }
    }
  } catch (error) {
    console.error('检测localStorage问题失败:', error);
    issues.push({
      type: 'detection_error',
      message: `检测过程出错: ${error.message}`
    });
  }
  
  return issues;
}

/**
 * 修复localStorage中的数据问题
 */
export function fixLocalStorageIssues() {
  console.log('=== 开始修复localStorage问题 ===');
  
  const issues = detectLocalStorageIssues();
  
  if (issues.length === 0) {
    console.log('✓ 未发现localStorage问题');
    return true;
  }
  
  console.log(`发现 ${issues.length} 个问题:`);
  issues.forEach((issue, index) => {
    console.log(`${index + 1}. [${issue.type}] ${issue.message}`);
  });
  
  let fixedCount = 0;
  
  try {
    issues.forEach(issue => {
      switch (issue.type) {
        case 'invalid_json':
          // 清理错误的JSON数据
          localStorage.removeItem(issue.key);
          console.log(`✓ 已清理键 "${issue.key}" 的错误数据`);
          fixedCount++;
          break;
          
        case 'json_parse_error':
          // 清理损坏的JSON数据
          localStorage.removeItem(issue.key);
          console.log(`✓ 已清理键 "${issue.key}" 的损坏JSON数据`);
          fixedCount++;
          break;
          
        case 'invalid_language':
          // 重置为默认语言
          localStorage.setItem('lang', 'zh-CN');
          console.log(`✓ 已将语言代码重置为默认值: zh-CN`);
          fixedCount++;
          break;
          
        case 'misplaced_language':
          // 移除错误位置的语言代码
          localStorage.removeItem(issue.key);
          // 如果lang键不存在，设置正确的语言
          if (!localStorage.getItem('lang')) {
            localStorage.setItem('lang', issue.value);
          }
          console.log(`✓ 已清理键 "${issue.key}" 中错误存储的语言代码`);
          fixedCount++;
          break;
          
        default:
          console.warn(`未处理的问题类型: ${issue.type}`);
      }
    });
    
    console.log(`✓ 修复完成，共修复 ${fixedCount} 个问题`);
    return true;
    
  } catch (error) {
    console.error('修复localStorage问题失败:', error);
    return false;
  }
}

/**
 * 强制清理所有localStorage数据
 */
export function clearAllLocalStorage() {
  try {
    console.log('=== 强制清理localStorage ===');
    localStorage.clear();
    console.log('✓ localStorage已清空');
    
    // 设置默认值
    localStorage.setItem('lang', 'zh-CN');
    console.log('✓ 已设置默认语言: zh-CN');
    
    return true;
  } catch (error) {
    console.error('清理localStorage失败:', error);
    return false;
  }
}

/**
 * 验证localStorage数据完整性
 */
export function validateLocalStorage() {
  console.log('=== 验证localStorage数据完整性 ===');
  
  const issues = detectLocalStorageIssues();
  
  if (issues.length === 0) {
    console.log('✓ localStorage数据完整，无问题');
    return true;
  }
  
  console.log(`发现 ${issues.length} 个问题:`);
  issues.forEach((issue, index) => {
    console.log(`${index + 1}. [${issue.type}] ${issue.message}`);
  });
  
  return false;
}

/**
 * 安全获取localStorage数据
 */
export function safeGetItem(key, defaultValue = null) {
  try {
    const value = localStorage.getItem(key);
    
    if (!value) {
      return defaultValue;
    }
    
    // 如果是JSON键，尝试解析
    if (JSON_KEYS.includes(key)) {
      if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
        try {
          return JSON.parse(value);
        } catch (error) {
          console.warn(`解析JSON数据失败 [${key}]:`, error);
          localStorage.removeItem(key);
          return defaultValue;
        }
      } else {
        console.warn(`键 "${key}" 应该存储JSON数据，但存储了普通字符串: "${value}"`);
        localStorage.removeItem(key);
        return defaultValue;
      }
    }
    
    return value;
    
  } catch (error) {
    console.error(`获取localStorage数据失败 [${key}]:`, error);
    return defaultValue;
  }
}

/**
 * 安全设置localStorage数据
 */
export function safeSetItem(key, value) {
  try {
    if (JSON_KEYS.includes(key)) {
      // JSON键需要序列化
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      // 普通键直接存储
      localStorage.setItem(key, value);
    }
    return true;
  } catch (error) {
    console.error(`设置localStorage数据失败 [${key}]:`, error);
    return false;
  }
}

/**
 * 初始化localStorage清理
 */
export function initLocalStorageCleaner() {
  console.log('=== 初始化localStorage清理器 ===');
  
  // 检测问题
  const issues = detectLocalStorageIssues();
  
  if (issues.length > 0) {
    console.log(`发现 ${issues.length} 个问题，正在修复...`);
    const success = fixLocalStorageIssues();
    
    if (success) {
      console.log('✓ localStorage问题修复完成');
    } else {
      console.error('✗ localStorage问题修复失败');
    }
  } else {
    console.log('✓ localStorage数据正常');
  }
  
  // 验证修复结果
  setTimeout(() => {
    validateLocalStorage();
  }, 1000);
}
