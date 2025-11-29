/**
 * 清除localStorage中的中文语言设置脚本
 * 用于强制将应用设置为英文默认语言
 */

// 清除中文语言设置
function clearChineseLanguage() {
    console.log('=== 清除中文语言设置 ===');
    
    try {
        // 获取当前语言设置
        const currentLang = localStorage.getItem('lang');
        console.log('当前语言设置:', currentLang);
        
        // 如果是中文语言，清除并设置为英文
        if (currentLang === 'zh' || currentLang === 'zh-CN' || currentLang === 'zh-TW') {
            console.log('检测到中文语言设置，正在清除...');
            
            // 清除语言设置
            localStorage.removeItem('lang');
            
            // 设置为英文
            localStorage.setItem('lang', 'en-US');
            
            console.log('✅ 语言设置已清除并设置为英文');
            console.log('新的语言设置:', localStorage.getItem('lang'));
            
            return true;
        } else {
            console.log('当前语言不是中文，无需清除');
            return false;
        }
    } catch (error) {
        console.error('❌ 清除语言设置失败:', error);
        return false;
    }
}

// 强制设置英文语言
function forceEnglishLanguage() {
    console.log('=== 强制设置英文语言 ===');
    
    try {
        localStorage.setItem('lang', 'en-US');
        console.log('✅ 已强制设置为英文语言');
        console.log('当前语言设置:', localStorage.getItem('lang'));
        
        // 刷新页面以应用新语言
        console.log('🔄 即将刷新页面以应用新语言...');
        setTimeout(() => {
            window.location.reload();
        }, 1000);
        
        return true;
    } catch (error) {
        console.error('❌ 强制设置英文语言失败:', error);
        return false;
    }
}

// 检查语言设置状态
function checkLanguageStatus() {
    console.log('=== 检查语言设置状态 ===');
    
    try {
        const currentLang = localStorage.getItem('lang');
        const isChinese = currentLang === 'zh' || currentLang === 'zh-CN' || currentLang === 'zh-TW';
        
        console.log('当前语言设置:', currentLang);
        console.log('是否为中文:', isChinese);
        console.log('需要清除:', isChinese);
        
        if (isChinese) {
            console.log('⚠️ 检测到中文语言设置，建议执行清除操作');
        } else {
            console.log('✅ 语言设置正常');
        }
        
        return {
            currentLang,
            isChinese,
            needsClearing: isChinese
        };
    } catch (error) {
        console.error('❌ 检查语言设置状态失败:', error);
        return null;
    }
}

// 导出函数（如果在浏览器环境中）
if (typeof window !== 'undefined') {
    window.clearChineseLanguage = clearChineseLanguage;
    window.forceEnglishLanguage = forceEnglishLanguage;
    window.checkLanguageStatus = checkLanguageStatus;
    
    console.log('🔧 语言清除工具已加载');
    console.log('可用函数:');
    console.log('- clearChineseLanguage(): 清除中文语言设置');
    console.log('- forceEnglishLanguage(): 强制设置英文语言');
    console.log('- checkLanguageStatus(): 检查语言设置状态');
    
    // 自动检查状态
    checkLanguageStatus();
}

// 如果在Node.js环境中，直接导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        clearChineseLanguage,
        forceEnglishLanguage,
        checkLanguageStatus
    };
}
