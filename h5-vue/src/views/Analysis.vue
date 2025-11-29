<template>
  <div class="analysis-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-info">
          <h1 class="page-title">{{ $t('analysis.title') }}</h1>
          <p class="page-subtitle">{{ $t('analysis.description') }}</p>
        </div>
        <div class="header-stats">
          <div class="stat-item">
            <span class="stat-value">156</span>
            <span class="stat-label">{{ $t('analysis.articles') }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">98%</span>
            <span class="stat-label">{{ $t('analysis.accuracy') }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">24/7</span>
            <span class="stat-label">{{ $t('analysis.updates') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="page-content">
      <!-- 分析类型筛选 -->
      <div class="analysis-types">
        <div class="section-header">
          <h2 class="section-title">{{ $t('analysis.analysisTypes') }}</h2>
          <div class="analysis-filter">
            <button 
              v-for="type in analysisTypes" 
              :key="type.id"
              class="filter-btn"
              :class="{ active: activeType === type.id }"
              @click="setActiveType(type.id)"
            >
              <i class="filter-icon">{{ type.icon }}</i>
              {{ type.name }}
            </button>
          </div>
        </div>
      </div>
      
      <!-- 分析内容 -->
      <div class="analysis-content">
        <div class="content-header">
          <h3 class="content-title">{{ $t('analysis.latestAnalysis') }}</h3>
          <div class="content-actions">
            <button class="action-btn">
              <i class="icon">🔍</i>
              {{ $t('analysis.search') }}
            </button>
            <button class="action-btn">
              <i class="icon">📊</i>
              {{ $t('analysis.charts') }}
            </button>
          </div>
        </div>
        
        <div class="analysis-grid">
          <div 
            v-for="item in filteredAnalysis" 
            :key="item.id"
            class="analysis-card"
            @click="goToAnalysis(item)"
          >
            <!-- 卡片头部 -->
            <div class="card-header">
              <div class="card-meta">
                <span class="meta-date">{{ item.date }}</span>
                <span class="meta-author">{{ item.author }}</span>
              </div>
              <div class="card-badge">
                <span class="badge-text">{{ item.type }}</span>
              </div>
            </div>

            <!-- 卡片内容 -->
            <div class="card-content">
              <h3 class="card-title">{{ item.title }}</h3>
              <p class="card-desc">{{ item.description }}</p>
              
              <div class="card-tags">
                <span 
                  v-for="tag in item.tags" 
                  :key="tag"
                  class="tag"
                >
                  {{ tag }}
                </span>
              </div>
            </div>

            <!-- 卡片统计 -->
            <div class="card-stats">
              <div class="stat-item">
                <i class="stat-icon">👁️</i>
                <span class="stat-value">{{ item.views }}</span>
              </div>
              <div class="stat-item">
                <i class="stat-icon">👍</i>
                <span class="stat-value">{{ item.likes }}</span>
              </div>
              <div class="stat-item">
                <i class="stat-icon">💬</i>
                <span class="stat-value">{{ item.comments }}</span>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="card-actions">
              <button class="btn-read" @click.stop="readAnalysis(item)">
                <i class="icon">📖</i>
                {{ $t('analysis.readMore') }}
              </button>
              <button class="btn-share" @click.stop="shareAnalysis(item)">
                <i class="icon">📤</i>
                {{ $t('analysis.share') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 分析优势 -->
      <div class="advantages-section">
        <h2 class="section-title">{{ $t('analysis.advantages') }}</h2>
        <div class="advantages-grid">
          <div class="advantage-card">
            <div class="advantage-icon">📈</div>
            <h3>{{ $t('analysis.professional') }}</h3>
            <p>{{ $t('analysis.professionalDesc') }}</p>
          </div>
          <div class="advantage-card">
            <div class="advantage-icon">⚡</div>
            <h3>{{ $t('analysis.timely') }}</h3>
            <p>{{ $t('analysis.timelyDesc') }}</p>
          </div>
          <div class="advantage-card">
            <div class="advantage-icon">🎯</div>
            <h3>{{ $t('analysis.accurate') }}</h3>
            <p>{{ $t('analysis.accurateDesc') }}</p>
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
const activeType = ref('daily');

// 分析类型 - 使用i18n翻译
const analysisTypes = computed(() => [
  { id: 'daily', name: t('analysis.types.daily'), icon: '📅' },
  { id: 'weekly', name: t('analysis.types.weekly'), icon: '📊' },
  { id: 'monthly', name: t('analysis.types.monthly'), icon: '📈' },
  { id: 'technical', name: t('analysis.types.technical'), icon: '🔧' },
  { id: 'fundamental', name: t('analysis.types.fundamental'), icon: '📰' }
]);

// 分析内容 - 使用i18n翻译
const analysis = computed(() => [
  {
    id: 1,
    title: t('analysis.sampleAnalysis.usdIndex.title'),
    description: t('analysis.sampleAnalysis.usdIndex.description'),
    type: t('analysis.types.technical'),
    date: '2024-01-15',
    author: t('analysis.authors.analyst1'),
    tags: [t('analysis.tags.usdIndex'), t('analysis.tags.technicalAnalysis'), t('analysis.tags.support'), t('analysis.tags.breakout')],
    views: 1234,
    likes: 89,
    comments: 23,
    category: 'technical'
  },
  {
    id: 2,
    title: t('analysis.sampleAnalysis.weeklyReview.title'),
    description: t('analysis.sampleAnalysis.weeklyReview.description'),
    type: t('analysis.types.weekly'),
    date: '2024-01-14',
    author: t('analysis.authors.analyst2'),
    tags: [t('analysis.tags.nfp'), t('analysis.tags.marketReview'), t('analysis.tags.currencyPairs'), t('analysis.tags.volatility')],
    views: 2156,
    likes: 156,
    comments: 45,
    category: 'weekly'
  },
  {
    id: 3,
    title: t('analysis.sampleAnalysis.goldFundamental.title'),
    description: t('analysis.sampleAnalysis.goldFundamental.description'),
    type: t('analysis.types.fundamental'),
    date: '2024-01-13',
    author: t('analysis.authors.analyst3'),
    tags: [t('analysis.tags.gold'), t('analysis.tags.inflation'), t('analysis.tags.fed'), t('analysis.tags.geopolitics')],
    views: 1876,
    likes: 134,
    comments: 67,
    category: 'fundamental'
  },
  {
    id: 4,
    title: t('analysis.sampleAnalysis.eurUsdStrategy.title'),
    description: t('analysis.sampleAnalysis.eurUsdStrategy.description'),
    type: t('analysis.types.daily'),
    date: '2024-01-15',
    author: t('analysis.authors.analyst4'),
    tags: [t('analysis.tags.eurUsd'), t('analysis.tags.tradingStrategy'), t('analysis.tags.breakout'), t('analysis.tags.resistance')],
    views: 987,
    likes: 67,
    comments: 12,
    category: 'daily'
  },
  {
    id: 5,
    title: t('analysis.sampleAnalysis.bitcoinTechnical.title'),
    description: t('analysis.sampleAnalysis.bitcoinTechnical.description'),
    type: t('analysis.types.technical'),
    date: '2024-01-12',
    author: t('analysis.authors.analyst5'),
    tags: [t('analysis.tags.bitcoin'), t('analysis.tags.technicalAnalysis'), t('analysis.tags.resistance'), t('analysis.tags.uptrend')],
    views: 3456,
    likes: 234,
    comments: 89,
    category: 'technical'
  },
  {
    id: 6,
    title: t('analysis.sampleAnalysis.monthlyOutlook.title'),
    description: t('analysis.sampleAnalysis.monthlyOutlook.description'),
    type: t('analysis.types.monthly'),
    date: '2024-01-10',
    author: t('analysis.authors.analyst6'),
    tags: [t('analysis.tags.centralBank'), t('analysis.tags.interestRate'), t('analysis.tags.marketOutlook'), t('analysis.tags.monetaryPolicy')],
    views: 2789,
    likes: 198,
    comments: 56,
    category: 'monthly'
  }
]);


// 简化的i18n键值修复函数
const fixI18nKeysDisplay = () => {
  try {
    console.log('Analysis: i18n keys display fixed');
  } catch (error) {
    console.error('Analysis: i18n keys display fix failed:', error);
  }
};

// 语言切换监听
let languageWatcher = null;
let languageChangeHandler = null;

onMounted(() => {
  // 调试i18n状态
  console.log('Analysis: Current locale:', locale.value);
  console.log('Analysis: Test translation:', t('analysis.title'));
  
  // 监听语言变化
  languageWatcher = watch(() => locale.value, () => {
    nextTick(() => {
      console.log('Analysis: Language switched to:', locale.value);
      console.log('Analysis: Test translation after switch:', t('analysis.title'));
    });
  }, { immediate: true });
  
  // 监听全局语言变化事件
  languageChangeHandler = (event) => {
    console.log('Analysis: Received language change event:', event.detail.locale);
    nextTick(() => {
      console.log('Analysis: Component updated');
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

// 过滤后的分析内容
const filteredAnalysis = computed(() => {
  return analysis.value.filter(item => item.category === activeType.value);
});

// 设置活跃类型
const setActiveType = (typeId) => {
  activeType.value = typeId;
};

// 跳转到分析页面
const goToAnalysis = (item) => {
  console.log('查看分析:', item);
  router.push(`/analysis/${item.category}/${item.id}`);
};

// 阅读分析
const readAnalysis = (item) => {
  console.log('阅读分析:', item);
  router.push(`/analysis/${item.category}/${item.id}`);
};

// 分享分析
const shareAnalysis = (item) => {
  console.log('分享分析:', item);
  // 这里可以添加分享功能
};
</script>

<style scoped>
.analysis-page {
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

.analysis-types {
  margin-bottom: 50px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 0 10px;
}

.section-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

.analysis-filter {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 20px;
  color: rgba(255,255,255,0.8);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.filter-btn:hover,
.filter-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  color: white;
  transform: translateY(-2px);
}

.filter-icon {
  font-size: 1.1rem;
}

.analysis-content {
  margin-bottom: 60px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 0 10px;
}

.content-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

.content-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 16px;
  color: rgba(255,255,255,0.8);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: rgba(255,255,255,0.15);
  color: white;
}

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 30px;
}

.analysis-card {
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

.analysis-card::before {
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

.analysis-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(0,0,0,0.6);
  border-color: rgba(255,255,255,0.2);
}

.analysis-card:hover::before {
  opacity: 1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px 0;
  margin-bottom: 20px;
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.meta-date {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.6);
  font-weight: 500;
}

.meta-author {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.8);
  font-weight: 600;
}

.card-badge {
  padding: 8px 16px;
  background: rgba(255,255,255,0.1);
  border-radius: 15px;
  border: 1px solid rgba(255,255,255,0.2);
}

.badge-text {
  font-size: 0.8rem;
  color: #ffffff;
  font-weight: 600;
}

.card-content {
  padding: 0 30px 25px;
}

.card-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 15px 0;
  line-height: 1.4;
}

.card-desc {
  font-size: 1rem;
  color: rgba(255,255,255,0.7);
  margin: 0 0 20px 0;
  line-height: 1.6;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  padding: 6px 12px;
  background: rgba(255,255,255,0.1);
  border-radius: 12px;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.8);
  font-weight: 500;
  border: 1px solid rgba(255,255,255,0.1);
}

.card-stats {
  display: flex;
  justify-content: space-around;
  padding: 20px 30px;
  background: rgba(255,255,255,0.03);
  border-top: 1px solid rgba(255,255,255,0.1);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  background: none;
  border: none;
  min-width: auto;
}

.stat-icon {
  font-size: 1rem;
}

.stat-value {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.8);
  font-weight: 600;
}

.card-actions {
  display: flex;
  gap: 12px;
  padding: 0 30px 30px;
}

.btn-read, .btn-share {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 16px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-read {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-read:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102,126,234,0.4);
}

.btn-share {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.btn-share:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(245,87,108,0.4);
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
  .analysis-page {
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
  
  .section-header {
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
  }
  
  .analysis-filter {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .analysis-grid {
    grid-template-columns: 1fr;
    gap: 25px;
  }
  
  .content-header {
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
  }
  
  .content-actions {
    justify-content: center;
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
  
  .card-title {
    font-size: 1.2rem;
  }
  
  .advantage-card {
    padding: 35px 25px;
  }
  
  .analysis-grid {
    grid-template-columns: 1fr;
  }
}
</style>