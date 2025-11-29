<template>
  <div class="support-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-info">
          <h1 class="page-title">{{ $t('support.title') }}</h1>
          <p class="page-subtitle">{{ $t('support.subtitle') }}</p>
        </div>
        <div class="header-stats">
          <div class="stat-item">
            <span class="stat-value">24/7</span>
            <span class="stat-label">{{ $t('support.quickSupport.liveChat.availability') }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">< 2min</span>
            <span class="stat-label">{{ $t('support.quickSupport.phone.responseTime') }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">98%</span>
            <span class="stat-label">{{ $t('support.satisfaction') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="page-content">
      <!-- 快速支持选项 -->
      <div class="quick-support-section">
        <div class="section-header">
          <h2 class="section-title">{{ $t('support.quickSupport.title') }}</h2>
          <p class="section-subtitle">{{ $t('support.quickSupport.liveChat.description') }}</p>
        </div>
        
        <div class="support-grid">
          <div 
            v-for="option in supportOptions" 
            :key="option.id"
            class="support-card"
            @click="goToOption(option)"
          >
            <!-- 卡片头部 -->
            <div class="card-header">
              <div class="card-icon">
                <div class="icon-wrapper" :style="{ backgroundColor: option.color }">
                  {{ option.icon }}
                </div>
              </div>
              <div class="card-status">
                <span class="status-dot" :class="option.status"></span>
                <span class="status-text">{{ option.statusText }}</span>
              </div>
            </div>

            <!-- 卡片内容 -->
            <div class="card-content">
              <h3 class="card-title">{{ option.title }}</h3>
              <p class="card-desc">{{ option.description }}</p>
              
              <div class="card-info">
                <div class="info-item">
                  <span class="info-label">{{ $t('support.responseTime') }}</span>
                  <span class="info-value">{{ option.responseTime }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">{{ $t('support.availability') }}</span>
                  <span class="info-value">{{ option.availability }}</span>
                </div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="card-actions">
              <button class="btn-primary" @click.stop="goToOption(option)">
                <i class="icon">➤</i>
                {{ $t('support.startChat') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 常见问题 -->
      <div class="faq-section">
        <div class="section-header">
          <h2 class="section-title">{{ $t('support.faq.title') }}</h2>
          <p class="section-subtitle">{{ $t('support.faq.faqDesc') }}</p>
        </div>
        
        <div class="faq-filter">
          <button 
            v-for="category in faqCategories" 
            :key="category.id"
            class="filter-btn"
            :class="{ active: activeFaqCategory === category.id }"
            @click="setActiveFaqCategory(category.id)"
          >
            <i class="filter-icon">{{ category.icon }}</i>
            {{ category.name }}
          </button>
        </div>
        
        <div class="faq-list">
          <div 
            v-for="faq in filteredFaqs" 
            :key="faq.id"
            class="faq-item"
            :class="{ active: activeFaq === faq.id }"
            @click="toggleFaq(faq.id)"
          >
            <div class="faq-header">
              <div class="faq-question">
                <h3 class="question-text">{{ faq.question }}</h3>
                <div class="question-category">{{ faq.category }}</div>
              </div>
              <div class="faq-toggle">
                <i class="toggle-icon" :class="{ rotated: activeFaq === faq.id }">▼</i>
              </div>
            </div>
            
            <div class="faq-content" v-show="activeFaq === faq.id">
              <div class="faq-answer">
                <p class="answer-text">{{ faq.answer }}</p>
                
                <div class="answer-actions">
                  <button class="action-btn helpful" @click.stop="markHelpful(faq.id)">
                    <i class="icon">👍</i>
                    {{ $t('support.helpful') }}
                  </button>
                  <button class="action-btn not-helpful" @click.stop="markNotHelpful(faq.id)">
                    <i class="icon">👎</i>
                    {{ $t('support.notHelpful') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 联系方式 -->
      <div class="contact-section">
        <div class="section-header">
          <h2 class="section-title">{{ $t('support.contactUs') }}</h2>
          <p class="section-subtitle">{{ $t('support.contactDesc') }}</p>
        </div>
        
        <div class="contact-grid">
          <div class="contact-card">
            <div class="contact-header">
              <div class="contact-icon">
                <div class="icon-wrapper" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                  📞
                </div>
              </div>
              <div class="contact-status">
                <span class="status-dot online"></span>
                <span class="status-text">{{ $t('support.online') }}</span>
              </div>
            </div>
            
            <div class="contact-content">
              <h3 class="contact-title">{{ $t('support.quickSupport.phone.title') }}</h3>
              <p class="contact-desc">{{ $t('support.quickSupport.phone.description') }}</p>
              
              <div class="contact-info">
                <div class="info-item">
                  <span class="info-label">{{ $t('support.contact.methods.phone') }}</span>
                  <span class="info-value">+86 400-123-4567</span>
                </div>
                <div class="info-item">
                  <span class="info-label">{{ $t('support.contact.methods.hours') }}</span>
                  <span class="info-value">{{ $t('support.quickSupport.phone.availability') }}</span>
                </div>
              </div>
            </div>
            
            <div class="contact-actions">
              <button class="btn-call" @click="makeCall">
                <i class="icon">📞</i>
                {{ $t('support.callNow') }}
              </button>
            </div>
          </div>

          <div class="contact-card">
            <div class="contact-header">
              <div class="contact-icon">
                <div class="icon-wrapper" style="background: linear-gradient(135deg, #4facfe 0%, #43e97b 100%);">
                  💬
                </div>
              </div>
              <div class="contact-status">
                <span class="status-dot online"></span>
                <span class="status-text">{{ $t('support.online') }}</span>
              </div>
            </div>
            
            <div class="contact-content">
              <h3 class="contact-title">{{ $t('support.liveChat') }}</h3>
              <p class="contact-desc">{{ $t('support.liveChatDesc') }}</p>
              
              <div class="contact-info">
                <div class="info-item">
                  <span class="info-label">{{ $t('support.responseTime') }}</span>
                  <span class="info-value">< 30秒</span>
                </div>
                <div class="info-item">
                  <span class="info-label">{{ $t('support.languages') }}</span>
                  <span class="info-value">{{ $t('support.languagesValue') }}</span>
                </div>
              </div>
            </div>
            
            <div class="contact-actions">
              <button class="btn-chat" @click="startChat">
                <i class="icon">💬</i>
                {{ $t('support.startChat') }}
              </button>
            </div>
          </div>

          <div class="contact-card">
            <div class="contact-header">
              <div class="contact-icon">
                <div class="icon-wrapper" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">
                  📧
                </div>
              </div>
              <div class="contact-status">
                <span class="status-dot online"></span>
                <span class="status-text">{{ $t('support.online') }}</span>
              </div>
            </div>
            
            <div class="contact-content">
              <h3 class="contact-title">{{ $t('support.emailSupport') }}</h3>
              <p class="contact-desc">{{ $t('support.emailDesc') }}</p>
              
              <div class="contact-info">
                <div class="info-item">
                  <span class="info-label">{{ $t('support.email') }}</span>
                  <span class="info-value">support@mt5.com</span>
                </div>
                <div class="info-item">
                  <span class="info-label">{{ $t('support.responseTime') }}</span>
                  <span class="info-value">{{ $t('support.emailResponseTime') }}</span>
                </div>
              </div>
            </div>
            
            <div class="contact-actions">
              <button class="btn-email" @click="sendEmail">
                <i class="icon">📧</i>
                {{ $t('support.sendEmail') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 支持优势 -->
      <div class="advantages-section">
        <h2 class="section-title">{{ $t('support.advantages') }}</h2>
        <div class="advantages-grid">
          <div class="advantage-card">
            <div class="advantage-icon">🚀</div>
            <h3>{{ $t('support.fastResponse') }}</h3>
            <p>{{ $t('support.fastResponseDesc') }}</p>
          </div>
          <div class="advantage-card">
            <div class="advantage-icon">🎯</div>
            <h3>{{ $t('support.expertTeam') }}</h3>
            <p>{{ $t('support.expertTeamDesc') }}</p>
          </div>
          <div class="advantage-card">
            <div class="advantage-icon">🌍</div>
            <h3>{{ $t('support.multiLanguage') }}</h3>
            <p>{{ $t('support.multiLanguageDesc') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t, locale } = useI18n();

// 响应式数据
const activeFaq = ref(null);
const activeFaqCategory = ref('all');

// 支持选项
const supportOptions = ref([
  {
    id: 1,
    title: t('support.quickSupport.liveChat.title'),
    description: t('support.quickSupport.liveChat.description'),
    icon: '💬',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    responseTime: t('support.quickSupport.liveChat.responseTime'),
    availability: t('support.quickSupport.liveChat.availability'),
    status: 'online',
    statusText: 'Online'
  },
  {
    id: 2,
    title: t('support.quickSupport.phone.title'),
    description: t('support.quickSupport.phone.description'),
    icon: '📞',
    color: 'linear-gradient(135deg, #4facfe 0%, #43e97b 100%)',
    responseTime: t('support.quickSupport.phone.responseTime'),
    availability: t('support.quickSupport.phone.availability'),
    status: 'online',
    statusText: 'Online'
  },
  {
    id: 3,
    title: t('support.quickSupport.email.title'),
    description: t('support.quickSupport.email.description'),
    icon: '📧',
    color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    responseTime: t('support.quickSupport.email.responseTime'),
    availability: t('support.quickSupport.email.availability'),
    status: 'online',
    statusText: 'Online'
  },
  {
    id: 4,
    title: t('support.quickSupport.ticket.title'),
    description: t('support.quickSupport.ticket.description'),
    icon: '📹',
    color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    responseTime: t('support.quickSupport.ticket.responseTime'),
    availability: t('support.quickSupport.ticket.availability'),
    status: 'online',
    statusText: 'Online'
  }
]);

// FAQ分类 - 使用i18n翻译
const faqCategories = computed(() => [
  { id: 'all', name: t('common.all'), icon: '📋' },
  { id: 'account', name: t('support.faq.categories.account'), icon: '👤' },
  { id: 'trading', name: t('support.faq.categories.trading'), icon: '💹' },
  { id: 'platform', name: t('support.faq.categories.platform'), icon: '🔧' },
  { id: 'security', name: t('support.faq.categories.security'), icon: '💳' }
]);

// 常见问题 - 使用i18n翻译，带Fallback
const faqs = computed(() => {
  try {
    const faqData = t('support.faq.questions');
    const allFaqs = [];
    
    // 如果翻译返回的是键值本身，使用fallback数据
    if (typeof faqData === 'string' && faqData === 'support.faq.questions') {
      console.warn('Translation not loaded, using fallback FAQ data');
      return getFallbackFaqs();
    }
    
    // 检查faqData是否为对象
    if (typeof faqData === 'object' && faqData !== null && !Array.isArray(faqData)) {
      // 合并所有分类的FAQ
      Object.keys(faqData).forEach(categoryId => {
        const categoryFaqs = faqData[categoryId];
        
        // 确保categoryFaqs是数组
        if (Array.isArray(categoryFaqs)) {
          categoryFaqs.forEach((faq, index) => {
            if (faq && typeof faq === 'object' && faq.question && faq.answer) {
              allFaqs.push({
                id: `${categoryId}_${index + 1}`,
                question: faq.question,
                answer: faq.answer,
                category: t(`support.faq.categories.${categoryId}`),
                categoryId: categoryId
              });
            }
          });
        }
      });
    } else {
      console.warn('FAQ data is not a valid object, using fallback:', faqData);
      return getFallbackFaqs();
    }
    
    return allFaqs;
  } catch (error) {
    console.error('Error generating FAQs:', error);
    return getFallbackFaqs();
  }
});

// Fallback FAQ 数据
const getFallbackFaqs = () => {
  return [
    {
      id: 'account_1',
      question: t('support.faq.questions.account[0].question', '如何开设交易账户？'),
      answer: t('support.faq.questions.account[0].answer', '开设交易账户非常简单，只需要点击"立即开户"按钮，填写个人信息，上传身份证明文件，审核通过后即可开始交易。整个过程通常需要1-2个工作日。'),
      category: t('support.faq.categories.account', '账户相关'),
      categoryId: 'account'
    },
    {
      id: 'account_2',
      question: t('support.faq.questions.account[1].question', '忘记密码怎么办？'),
      answer: t('support.faq.questions.account[1].answer', '如果忘记密码，可以在登录页面点击"忘记密码"，输入您的邮箱地址，我们会发送重置密码的链接到您的邮箱。请确保邮箱地址正确且可以正常接收邮件。'),
      category: t('support.faq.categories.account', '账户相关'),
      categoryId: 'account'
    },
    {
      id: 'trading_1',
      question: t('support.faq.questions.trading[0].question', '交易时间是什么时候？'),
      answer: t('support.faq.questions.trading[0].answer', '外汇市场24小时交易，从周一早上开始到周五晚上结束。具体交易时间会根据不同的货币对而有所不同，您可以在交易平台上查看实时市场状态。'),
      category: t('support.faq.categories.trading', '交易相关'),
      categoryId: 'trading'
    },
    {
      id: 'platform_1',
      question: t('support.faq.questions.platform[0].question', 'MT5平台如何使用？'),
      answer: t('support.faq.questions.platform[0].answer', 'MT5平台是专业的交易软件，我们提供详细的视频教程和操作指南。您也可以联系我们的客服团队获得一对一的技术支持。'),
      category: t('support.faq.categories.platform', '平台相关'),
      categoryId: 'platform'
    },
    {
      id: 'security_1',
      question: t('support.faq.questions.security[0].question', '如何保证账户安全？'),
      answer: t('support.faq.questions.security[0].answer', '我们采用银行级别的安全措施保护您的账户，包括SSL加密、双重身份验证等。建议您定期修改密码，不要在公共场所登录账户。'),
      category: t('support.faq.categories.security', '安全相关'),
      categoryId: 'security'
    }
  ];
};


// 简化的i18n键值修复函数
const fixI18nKeysDisplay = () => {
  try {
    console.log('Support: i18n keys display fixed');
  } catch (error) {
    console.error('Support: i18n keys display fix failed:', error);
  }
};

// 语言切换监听
let languageWatcher = null;
let languageChangeHandler = null;

onMounted(() => {
  // 监听语言变化
  languageWatcher = watch(() => locale.value, () => {
    nextTick(() => {
      console.log('Support: Language switched to:', locale.value);
    });
  }, { immediate: true });
  
  // 监听全局语言变化事件
  languageChangeHandler = (event) => {
    console.log('Support: Received language change event:', event.detail.locale);
    nextTick(() => {
      console.log('Support: Component updated');
    });
  };
  
  window.addEventListener('language-changed', languageChangeHandler);
});

onUnmounted(() => {
  if (languageWatcher) {
    languageWatcher();
  }
  if (languageChangeHandler) {
    window.removeEventListener('language-changed', languageChangeHandler);
  }
});

// 过滤后的FAQ
const filteredFaqs = computed(() => {
  if (activeFaqCategory.value === 'all') {
    return faqs.value;
  }
  return faqs.value.filter(faq => faq.categoryId === activeFaqCategory.value);
});

// 设置活跃FAQ分类
const setActiveFaqCategory = (categoryId) => {
  activeFaqCategory.value = categoryId;
};

// 切换FAQ
const toggleFaq = (faqId) => {
  activeFaq.value = activeFaq.value === faqId ? null : faqId;
};

// 标记有帮助
const markHelpful = (faqId) => {
  console.log('Mark as helpful:', faqId);
  // 这里可以添加API调用
};

// 标记没帮助
const markNotHelpful = (faqId) => {
  console.log('Mark as not helpful:', faqId);
  // 这里可以添加API调用
};

// 跳转到支持选项
const goToOption = (option) => {
  console.log('Select support option:', option);
  // 这里可以添加具体的跳转逻辑
};

// 拨打电话
const makeCall = () => {
  console.log('Make call');
  window.open('tel:+864001234567');
};

// 开始聊天
const startChat = () => {
  console.log('Start chat');
  // 这里可以添加聊天窗口逻辑
};

// 发送邮件
const sendEmail = () => {
  console.log('Send email');
  window.open('mailto:support@mt5.com');
};
</script>

<style scoped>
.support-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 50px;
}

.header-content {
  max-width: 1000px;
  margin: 0 auto;
}

.header-info {
  margin-bottom: 40px;
}

.page-title {
  font-size: 3.5rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 15px 0;
  text-shadow: 0 4px 8px rgba(0,0,0,0.5);
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-size: 1.4rem;
  color: rgba(255,255,255,0.8);
  margin: 0;
  font-weight: 300;
  letter-spacing: 0.01em;
}

.header-stats {
  display: flex;
  justify-content: center;
  gap: 50px;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
  padding: 25px;
  background: rgba(255,255,255,0.05);
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  min-width: 140px;
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-5px);
  background: rgba(255,255,255,0.08);
}

.stat-value {
  display: block;
  font-size: 2.5rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.stat-label {
  font-size: 1rem;
  color: rgba(255,255,255,0.7);
  font-weight: 500;
}

.page-content {
  max-width: 1400px;
  margin: 0 auto;
}

.quick-support-section,
.faq-section,
.contact-section,
.advantages-section {
  margin-bottom: 60px;
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.section-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 15px 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

.section-subtitle {
  font-size: 1.1rem;
  color: rgba(255,255,255,0.7);
  margin: 0;
  font-weight: 400;
}

.support-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.support-card {
  background: rgba(30,30,30,0.95);
  backdrop-filter: blur(15px);
  border-radius: 24px;
  padding: 0;
  box-shadow: 0 12px 40px rgba(0,0,0,0.4);
  border: 1px solid rgba(255,255,255,0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.support-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #4facfe, #43e97b, #fa709a, #ffecd2);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.support-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(0,0,0,0.6);
  border-color: rgba(255,255,255,0.2);
}

.support-card:hover::before {
  opacity: 1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px 0;
  margin-bottom: 20px;
}

.card-icon {
  display: flex;
  align-items: center;
}

.icon-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: white;
  box-shadow: 0 8px 20px rgba(0,0,0,0.3);
  transition: transform 0.3s ease;
}

.support-card:hover .icon-wrapper {
  transform: scale(1.1);
}

.card-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4ade80;
}

.status-text {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.8);
  font-weight: 500;
}

.card-content {
  padding: 0 30px 25px;
}

.card-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.card-desc {
  font-size: 1rem;
  color: rgba(255,255,255,0.7);
  margin: 0 0 20px 0;
  line-height: 1.6;
}

.card-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.info-label {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.6);
  font-weight: 500;
}

.info-value {
  font-size: 0.9rem;
  color: #ffffff;
  font-weight: 600;
}

.card-actions {
  padding: 0 30px 30px;
}

.btn-primary {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 16px;
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102,126,234,0.4);
}

.faq-filter {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 20px;
  color: rgba(255,255,255,0.8);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover,
.filter-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  color: white;
  transform: translateY(-2px);
}

.filter-icon {
  font-size: 1rem;
}

.faq-list {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  background: rgba(30,30,30,0.95);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  margin-bottom: 20px;
  border: 1px solid rgba(255,255,255,0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.faq-item:hover {
  border-color: rgba(255,255,255,0.2);
  transform: translateY(-2px);
}

.faq-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px;
}

.faq-question {
  flex: 1;
}

.question-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.question-category {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.6);
  font-weight: 500;
}

.faq-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255,255,255,0.1);
  transition: all 0.3s ease;
}

.toggle-icon {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.8);
  transition: transform 0.3s ease;
}

.toggle-icon.rotated {
  transform: rotate(180deg);
}

.faq-content {
  border-top: 1px solid rgba(255,255,255,0.1);
  padding: 0 30px 25px;
}

.faq-answer {
  padding-top: 20px;
}

.answer-text {
  font-size: 1rem;
  color: rgba(255,255,255,0.8);
  margin: 0 0 20px 0;
  line-height: 1.6;
}

.answer-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 12px;
  background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.8);
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: rgba(255,255,255,0.1);
  color: white;
}

.action-btn.helpful:hover {
  background: rgba(74,222,128,0.2);
  border-color: #4ade80;
}

.action-btn.not-helpful:hover {
  background: rgba(248,113,113,0.2);
  border-color: #f87171;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.contact-card {
  background: rgba(30,30,30,0.95);
  backdrop-filter: blur(15px);
  border-radius: 24px;
  padding: 0;
  box-shadow: 0 12px 40px rgba(0,0,0,0.4);
  border: 1px solid rgba(255,255,255,0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.contact-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #4facfe, #43e97b, #fa709a);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.contact-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(0,0,0,0.6);
  border-color: rgba(255,255,255,0.2);
}

.contact-card:hover::before {
  opacity: 1;
}

.contact-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px 0;
  margin-bottom: 20px;
}

.contact-icon {
  display: flex;
  align-items: center;
}

.contact-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.contact-content {
  padding: 0 30px 25px;
}

.contact-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.contact-desc {
  font-size: 1rem;
  color: rgba(255,255,255,0.7);
  margin: 0 0 20px 0;
  line-height: 1.6;
}

.contact-info {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.contact-actions {
  padding: 0 30px 30px;
}

.btn-call, .btn-chat, .btn-email {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 20px;
  border: none;
  border-radius: 16px;
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-call {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.btn-call:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102,126,234,0.4);
}

.btn-chat {
  background: linear-gradient(135deg, #4facfe 0%, #43e97b 100%);
}

.btn-chat:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(79,172,254,0.4);
}

.btn-email {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.btn-email:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(250,112,154,0.4);
}

.advantages-section {
  text-align: center;
}

.advantages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 35px;
  margin-top: 50px;
}

.advantage-card {
  background: rgba(30,30,30,0.95);
  backdrop-filter: blur(15px);
  border-radius: 24px;
  padding: 45px 35px;
  text-align: center;
  box-shadow: 0 12px 40px rgba(0,0,0,0.4);
  border: 1px solid rgba(255,255,255,0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.advantage-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.advantage-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 25px 70px rgba(0,0,0,0.6);
  border-color: rgba(255,255,255,0.2);
}

.advantage-card:hover::before {
  opacity: 1;
}

.advantage-icon {
  font-size: 3.5rem;
  margin-bottom: 25px;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
}

.advantage-card h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 20px 0;
}

.advantage-card p {
  font-size: 1.1rem;
  color: rgba(255,255,255,0.7);
  margin: 0;
  line-height: 1.6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .support-page {
    padding: 15px;
  }
  
  .page-title {
    font-size: 2.8rem;
  }
  
  .header-stats {
    gap: 25px;
  }
  
  .stat-item {
    padding: 20px;
    min-width: 120px;
  }
  
  .support-grid,
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 25px;
  }
  
  .faq-filter {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .advantages-grid {
    grid-template-columns: 1fr;
    gap: 25px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 2.2rem;
  }
  
  .card-title,
  .contact-title {
    font-size: 1.2rem;
  }
  
  .advantage-card {
    padding: 35px 25px;
  }
}
</style>