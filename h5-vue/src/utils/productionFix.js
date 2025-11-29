/**
 * 生产环境修复工具
 * 用于修复localStorage中的无效数据导致的JSON解析错误
 */

/**
 * 清理所有localStorage中的无效数据
 */
export function cleanAllInvalidData() {
  console.log('开始清理localStorage中的无效数据...');
  
  let cleaned = false;
  const keysToCheck = ['lang', 'userInfo', 'token', 'theme', 'preferences'];
  
  keysToCheck.forEach(key => {
    try {
      const value = localStorage.getItem(key);
      
      if (value && typeof value === 'string') {
        // 检查是否是JSON字符串
        if (value.startsWith('{') || value.startsWith('[')) {
          try {
            JSON.parse(value);
            console.log(`✓ ${key}: 有效JSON数据`);
          } catch (error) {
            console.warn(`✗ ${key}: 无效JSON数据，正在清理:`, value);
            localStorage.removeItem(key);
            cleaned = true;
          }
        } else {
          // 非JSON字符串，检查是否是有效的语言代码
          if (key === 'lang') {
            const validLanguages = [
              'zh-CN', 'zh-TW', 'en-US', 'ja-JP', 'ko-KR', 
              'th-TH', 'vi-VN', 'de-DE', 'es-ES', 'fr-FR', 
              'it-IT', 'pt-PT', 'el-GR'
            ];
            
            if (!validLanguages.includes(value)) {
              console.warn(`✗ ${key}: 无效语言代码，正在清理:`, value);
              localStorage.removeItem(key);
              cleaned = true;
            } else {
              console.log(`✓ ${key}: 有效语言代码:`, value);
            }
          } else {
            console.log(`✓ ${key}: 有效字符串数据:`, value);
          }
        }
      } else if (value === null) {
        console.log(`- ${key}: 无数据`);
      } else {
        console.log(`✓ ${key}: 有效数据:`, value);
      }
    } catch (error) {
      console.error(`错误检查 ${key}:`, error);
      try {
        localStorage.removeItem(key);
        cleaned = true;
        console.warn(`✗ ${key}: 移除无效数据`);
      } catch (removeError) {
        console.error(`无法移除 ${key}:`, removeError);
      }
    }
  });
  
  if (cleaned) {
    console.log('✓ localStorage清理完成，已移除无效数据');
  } else {
    console.log('✓ localStorage数据检查完成，无需清理');
  }
  
  return cleaned;
}

/**
 * 强制重置语言设置为默认值（英文）
 */
export function resetLanguageToDefault() {
  try {
    localStorage.setItem('lang', 'en-US');
    console.log('✓ 语言设置已重置为默认值: en-US');
    return true;
  } catch (error) {
    console.error('重置语言设置失败:', error);
    return false;
  }
}

/**
 * 检查并修复所有localStorage问题
 */
export function fixAllLocalStorageIssues() {
  console.log('=== 开始修复localStorage问题 ===');
  
  // 1. 清理无效数据
  const cleaned = cleanAllInvalidData();
  
  // 2. 重置语言设置
  const reset = resetLanguageToDefault();
  
  // 3. 验证修复结果
  try {
    const lang = localStorage.getItem('lang');
    console.log('当前语言设置:', lang);
    
    // 确保语言设置为英文，如果不是英文则设置为英文
    if (!lang || lang !== 'en-US') {
      console.log('语言不是英文，设置为英文默认值');
      localStorage.setItem('lang', 'en-US');
    } else {
      console.log('语言设置正确: en-US');
    }
  } catch (error) {
    console.error('验证语言设置失败:', error);
  }
  
  console.log('=== localStorage修复完成 ===');
  
  return {
    cleaned,
    reset,
    success: true
  };
}

/**
 * 在页面加载时自动修复
 */
export function autoFixOnLoad() {
  // 延迟执行，确保页面完全加载
  setTimeout(() => {
    try {
      fixAllLocalStorageIssues();
    } catch (error) {
      console.error('自动修复失败:', error);
    }
  }, 100);
}
