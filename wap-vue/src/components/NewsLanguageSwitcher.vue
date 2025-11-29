<template>
  <div class="news-language-switcher">
    <!-- 语言切换按钮 -->
    <van-button 
      type="default" 
      size="small" 
      class="language-btn"
      @click="showLanguageOptions = !showLanguageOptions"
    >
      <van-icon name="translate" />
      {{ getCurrentLanguageName() }}
      <van-icon name="arrow-down" :class="{ 'rotate': showLanguageOptions }" />
    </van-button>

    <!-- 语言选项弹出层 -->
    <van-popup 
      v-model:show="showLanguageOptions" 
      position="bottom" 
      :style="{ height: '40%' }"
      round
    >
      <div class="language-options">
        <div class="options-header">
          <h3>{{ t('选择新闻语言') }}</h3>
          <van-icon name="cross" @click="showLanguageOptions = false" />
        </div>
        
        <div class="options-content">
          <div class="language-note">
            <van-icon name="info-o" />
            <span>{{ t('选择您希望新闻资讯显示的语言') }}</span>
          </div>
          
          <div class="language-list">
            <div 
              v-for="lang in availableLanguages" 
              :key="lang.code"
              class="language-item"
              :class="{ 'active': currentNewsLanguage === lang.code }"
              @click="selectNewsLanguage(lang.code)"
            >
              <div class="language-info">
                <span class="language-flag">{{ lang.flag }}</span>
                <div class="language-text">
                  <span class="language-name">{{ lang.name }}</span>
                  <span class="language-desc">{{ lang.description }}</span>
                </div>
              </div>
              <van-icon 
                v-if="currentNewsLanguage === lang.code" 
                name="success" 
                color="#1989fa" 
              />
            </div>
          </div>
          
          <div class="options-footer">
            <van-button 
              type="primary" 
              block 
              @click="confirmLanguageChange"
              :loading="switching"
            >
              {{ switching ? t('切换中...') : t('确认切换') }}
            </van-button>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { getNewsDisplayLanguage, setNewsDisplayLanguage } from '@/utils/languageInit.js';
import newsLanguageService from '@/services/newsLanguageService.js';

const { t, locale } = useI18n();

// 响应式数据
const showLanguageOptions = ref(false);
const currentNewsLanguage = ref('en');
const switching = ref(false);

// 可用语言列表
const availableLanguages = ref([
  {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
    description: 'Display news in English'
  },
  {
    code: 'CN',
    name: '简体中文',
    flag: '🇨🇳',
    description: '显示中文新闻'
  },
  {
    code: 'Japanese',
    name: '日本語',
    flag: '🇯🇵',
    description: 'ニュースを日本語で表示'
  },
  {
    code: 'Korean',
    name: '한국어',
    flag: '🇰🇷',
    description: '한국어로 뉴스 표시'
  }
]);

// 计算属性
const getCurrentLanguageName = () => {
  const lang = availableLanguages.value.find(l => l.code === currentNewsLanguage.value);
  return lang ? lang.name : 'English';
};

// 方法
const selectNewsLanguage = (langCode) => {
  if (langCode !== currentNewsLanguage.value) {
    currentNewsLanguage.value = langCode;
  }
};

const confirmLanguageChange = async () => {
  if (switching.value) return;
  
  switching.value = true;
  
  try {
    // 设置新闻显示语言
    const success = setNewsDisplayLanguage(currentNewsLanguage.value);
    
    if (success) {
      // 清除翻译缓存
      newsLanguageService.clearCache();
      
      // 触发新闻语言变化事件
      window.dispatchEvent(new CustomEvent('newsLanguageChanged', {
        detail: { 
          language: currentNewsLanguage.value,
          languageName: getCurrentLanguageName()
        }
      }));
      
      // 显示成功提示
      showToast(t('新闻语言已切换为') + ' ' + getCurrentLanguageName());
      
      // 关闭弹出层
      showLanguageOptions.value = false;
      
      console.log('📰 新闻语言已切换为:', currentNewsLanguage.value);
    } else {
      showToast(t('语言切换失败，请重试'));
    }
  } catch (error) {
    console.error('新闻语言切换失败:', error);
    showToast(t('语言切换失败，请重试'));
  } finally {
    switching.value = false;
  }
};

const showToast = (message) => {
  // 这里可以使用Vant的Toast组件
  console.log('Toast:', message);
};

// 生命周期
onMounted(() => {
  // 获取当前新闻显示语言
  currentNewsLanguage.value = getNewsDisplayLanguage();
  console.log('📰 当前新闻显示语言:', currentNewsLanguage.value);
  
  // 监听新闻语言变化事件
  window.addEventListener('newsLanguageChanged', (e) => {
    currentNewsLanguage.value = e.detail.language;
    console.log('📰 接收到新闻语言变化事件:', e.detail);
  });
});

// 暴露给父组件的方法
defineExpose({
  getCurrentNewsLanguage: () => currentNewsLanguage.value,
  setNewsLanguage: (langCode) => {
    currentNewsLanguage.value = langCode;
  }
});
</script>

<style lang="scss" scoped>
.news-language-switcher {
  .language-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #666;
    font-size: 12px;
    
    .van-icon {
      font-size: 14px;
      
      &.rotate {
        transform: rotate(180deg);
        transition: transform 0.3s ease;
      }
    }
  }
}

.language-options {
  padding: 20px;
  
  .options-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
    
    .van-icon {
      font-size: 20px;
      color: #999;
      cursor: pointer;
    }
  }
  
  .options-content {
    .language-note {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      background: #f7f8fa;
      border-radius: 8px;
      margin-bottom: 20px;
      
      .van-icon {
        color: #1989fa;
        font-size: 16px;
      }
      
      span {
        font-size: 14px;
        color: #666;
      }
    }
    
    .language-list {
      .language-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        border-radius: 8px;
        margin-bottom: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
          background: #f7f8fa;
        }
        
        &.active {
          background: #e8f4ff;
          border: 1px solid #1989fa;
        }
        
        .language-info {
          display: flex;
          align-items: center;
          gap: 12px;
          
          .language-flag {
            font-size: 24px;
          }
          
          .language-text {
            display: flex;
            flex-direction: column;
            gap: 2px;
            
            .language-name {
              font-size: 16px;
              font-weight: 500;
              color: #333;
            }
            
            .language-desc {
              font-size: 12px;
              color: #999;
            }
          }
        }
      }
    }
  }
  
  .options-footer {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #eee;
  }
}
</style>
