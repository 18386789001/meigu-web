<template>
  <div class="education-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-info">
          <h1 class="page-title">{{ $t('education.title') }}</h1>
          <p class="page-subtitle">{{ $t('education.description') }}</p>
        </div>
        <div class="header-stats">
          <div class="stat-item">
            <span class="stat-value">200+</span>
            <span class="stat-label">{{ $t('education.courses') }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">50+</span>
            <span class="stat-label">{{ $t('education.instructors') }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">24/7</span>
            <span class="stat-label">{{ $t('education.access') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="page-content">
      <!-- 教育分类 -->
      <div class="categories-section">
        <h2 class="section-title">{{ $t('education.learningPathsTitle') }}</h2>
        <div class="categories-grid">
          <div 
            v-for="category in categories" 
            :key="category.id"
            class="category-card"
            @click="selectCategory(category)"
          >
            <div class="category-icon" :style="{ backgroundColor: category.color }">
              {{ category.icon }}
            </div>
            <h3 class="category-name">{{ category.name }}</h3>
            <p class="category-count">{{ category.count }} {{ $t('education.items') }}</p>
          </div>
        </div>
      </div>

      <!-- 热门课程 -->
      <div class="courses-section">
        <div class="section-header">
          <h2 class="section-title">{{ $t('education.popularCourses') }}</h2>
          <div class="view-all">
            <button class="btn-view-all" @click="viewAllCourses">
              {{ $t('education.viewAll') }}
            </button>
          </div>
        </div>
        
        <div class="courses-grid">
          <div 
            v-for="course in courses" 
            :key="course.id"
            class="course-card"
            @click="selectCourse(course)"
          >
            <!-- 课程信息 -->
            <div class="course-header">
              <div class="course-image">
                <div class="image-placeholder" :style="{ backgroundColor: course.color }">
                  {{ course.icon }}
                </div>
              </div>
              <div class="course-badge">
                <span class="badge-text">{{ course.level }}</span>
              </div>
            </div>

            <div class="course-content">
              <h3 class="course-title">{{ course.title }}</h3>
              <p class="course-desc">{{ course.description }}</p>
              
              <div class="course-meta">
                <div class="meta-row">
                  <span class="meta-icon">⏱️</span>
                  <span class="meta-text">{{ course.duration }}</span>
                </div>
                <div class="meta-row">
                  <span class="meta-icon">👥</span>
                  <span class="meta-text">{{ course.students }}</span>
                </div>
                <div class="meta-row">
                  <span class="meta-icon">⭐</span>
                  <span class="meta-text">{{ course.rating }}</span>
                </div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="action-buttons">
              <button class="btn-preview" @click.stop="previewCourse(course)">
                <i class="icon">👁️</i>
                {{ $t('education.preview') }}
              </button>
              <button class="btn-enroll" @click.stop="enrollCourse(course)">
                <i class="icon">📚</i>
                {{ $t('education.enroll') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 学习优势 -->
      <div class="advantages-section">
        <h2 class="section-title">{{ $t('education.advantages') }}</h2>
        <div class="advantages-grid">
          <div class="advantage-card">
            <div class="advantage-icon">🎓</div>
            <h3>{{ $t('education.professional') }}</h3>
            <p>{{ $t('education.professionalDesc') }}</p>
          </div>
          <div class="advantage-card">
            <div class="advantage-icon">📱</div>
            <h3>{{ $t('education.flexible') }}</h3>
            <p>{{ $t('education.flexibleDesc') }}</p>
          </div>
          <div class="advantage-card">
            <div class="advantage-icon">🏆</div>
            <h3>{{ $t('education.certified') }}</h3>
            <p>{{ $t('education.certifiedDesc') }}</p>
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

// 教育分类数据 - 使用i18n翻译
const categories = computed(() => [
  {
    id: 1,
    name: t('education.categories.forex'),
    icon: '💱',
    count: 45,
    color: '#667eea'
  },
  {
    id: 2,
    name: t('education.categories.stocks'),
    icon: '📈',
    count: 38,
    color: '#764ba2'
  },
  {
    id: 3,
    name: t('education.categories.crypto'),
    icon: '₿',
    count: 32,
    color: '#f093fb'
  },
  {
    id: 4,
    name: t('education.categories.commodities'),
    icon: '🥇',
    count: 28,
    color: '#f5576c'
  }
]);

// 热门课程数据 - 使用i18n翻译
const courses = computed(() => [
  {
    id: 1,
    title: t('education.courses.forexBasics.title'),
    description: t('education.courses.forexBasics.description'),
    duration: `4${t('education.timeUnits.hours')}`,
    students: '1.2K',
    rating: '4.8',
    level: t('education.levels.beginner'),
    icon: '💱',
    color: '#667eea'
  },
  {
    id: 2,
    title: t('education.courses.technicalAnalysis.title'),
    description: t('education.courses.technicalAnalysis.description'),
    duration: `6${t('education.timeUnits.hours')}`,
    students: '856',
    rating: '4.9',
    level: t('education.levels.intermediate'),
    icon: '📊',
    color: '#764ba2'
  },
  {
    id: 3,
    title: t('education.courses.riskManagement.title'),
    description: t('education.courses.riskManagement.description'),
    duration: `3${t('education.timeUnits.hours')}`,
    students: '2.1K',
    rating: '4.7',
    level: t('education.levels.advanced'),
    icon: '🛡️',
    color: '#f093fb'
  },
  {
    id: 4,
    title: t('education.courses.cryptoGuide.title'),
    description: t('education.courses.cryptoGuide.description'),
    duration: `5${t('education.timeUnits.hours')}`,
    students: '1.5K',
    rating: '4.6',
    level: t('education.levels.intermediate'),
    icon: '₿',
    color: '#f5576c'
  },
  {
    id: 5,
    title: t('education.courses.fundamentalAnalysis.title'),
    description: t('education.courses.fundamentalAnalysis.description'),
    duration: `7${t('education.timeUnits.hours')}`,
    students: '934',
    rating: '4.8',
    level: t('education.levels.intermediate'),
    icon: '📈',
    color: '#4facfe'
  },
  {
    id: 6,
    title: t('education.courses.tradingPsychology.title'),
    description: t('education.courses.tradingPsychology.description'),
    duration: `2${t('education.timeUnits.hours')}`,
    students: '3.2K',
    rating: '4.9',
    level: t('education.levels.advanced'),
    icon: '🧠',
    color: '#43e97b'
  }
]);


// 简化的i18n键值修复函数
const fixI18nKeysDisplay = () => {
  try {
    console.log('Education: i18n keys display fixed');
  } catch (error) {
    console.error('Education: i18n keys display fix failed:', error);
  }
};

// 语言切换监听
let languageWatcher = null;
let languageChangeHandler = null;

onMounted(() => {
  // 调试i18n状态
  console.log('Education: Current locale:', locale.value);
  console.log('Education: Test translation:', t('education.categoriesTitle'));
  
  // 监听语言变化
  languageWatcher = watch(() => locale.value, () => {
    nextTick(() => {
      console.log('Education: Language switched to:', locale.value);
      console.log('Education: Test translation after switch:', t('education.categoriesTitle'));
    });
  }, { immediate: true });
  
  // 监听全局语言变化事件
  languageChangeHandler = (event) => {
    console.log('Education: Received language change event:', event.detail.locale);
    nextTick(() => {
      console.log('Education: Component updated');
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

// 选择分类
const selectCategory = (category) => {
  console.log('Select category:', category);
  router.push(`/education/category/${category.id}`);
};

// 选择课程
const selectCourse = (course) => {
  console.log('Select course:', course);
  router.push(`/education/course/${course.id}`);
};

// 预览课程
const previewCourse = (course) => {
  console.log('Preview course:', course);
  router.push(`/education/course/${course.id}/preview`);
};

// 报名课程
const enrollCourse = (course) => {
  console.log('Enroll course:', course);
  router.push(`/education/course/${course.id}/enroll`);
};

// 查看所有课程
const viewAllCourses = () => {
  console.log('View all courses');
  router.push('/education/courses');
};
</script>

<style scoped>
.education-page {
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

.categories-section {
  margin-bottom: 60px;
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

.view-all {
  display: flex;
  align-items: center;
}

.btn-view-all {
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-view-all:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102,126,234,0.4);
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

.category-card {
  background: rgba(30,30,30,0.95);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.category-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.category-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  border-color: rgba(255,255,255,0.2);
}

.category-card:hover::before {
  opacity: 1;
}

.category-icon {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin: 0 auto 20px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.3);
  transition: transform 0.3s ease;
}

.category-card:hover .category-icon {
  transform: scale(1.1);
}

.category-name {
  font-size: 1.4rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 10px 0;
}

.category-count {
  font-size: 1rem;
  color: rgba(255,255,255,0.7);
  margin: 0;
}

.courses-section {
  margin-bottom: 60px;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 30px;
}

.course-card {
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

.course-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.course-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(0,0,0,0.6);
  border-color: rgba(255,255,255,0.2);
}

.course-card:hover::before {
  opacity: 1;
}

.course-header {
  position: relative;
  padding: 25px;
  background: rgba(255,255,255,0.02);
}

.course-image {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}

.image-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: #ffffff;
  box-shadow: 0 8px 20px rgba(0,0,0,0.3);
  transition: transform 0.3s ease;
}

.course-card:hover .image-placeholder {
  transform: scale(1.1);
}

.course-badge {
  position: absolute;
  top: 20px;
  right: 20px;
}

.badge-text {
  padding: 6px 12px;
  background: rgba(255,255,255,0.1);
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #ffffff;
  border: 1px solid rgba(255,255,255,0.2);
}

.course-content {
  padding: 0 25px 25px;
}

.course-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 12px 0;
  line-height: 1.3;
}

.course-desc {
  font-size: 1rem;
  color: rgba(255,255,255,0.7);
  margin: 0 0 20px 0;
  line-height: 1.5;
}

.course-meta {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 25px;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.1);
}

.meta-icon {
  font-size: 1.1rem;
}

.meta-text {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.8);
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 12px;
  padding: 0 25px 25px;
}

.btn-preview, .btn-enroll {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 20px;
  border: none;
  border-radius: 16px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.btn-preview {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-preview:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102,126,234,0.4);
}

.btn-enroll {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.btn-enroll:hover {
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
  .education-page {
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
  
  .categories-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
  }
  
  .courses-grid {
    grid-template-columns: 1fr;
    gap: 25px;
  }
  
  .course-meta {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  
  .action-buttons {
    flex-direction: column;
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
  
  .course-title {
    font-size: 1.3rem;
  }
  
  .advantage-card {
    padding: 35px 25px;
  }
  
  .categories-grid {
    grid-template-columns: 1fr;
  }
}
</style>