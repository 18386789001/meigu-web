<template>
  <div class="platform-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-info">
          <h1 class="page-title">
            <span v-if="$t('platform.title') !== 'platform.title'">{{ $t('platform.title') }}</span>
            <span v-else>交易平台</span>
          </h1>
          <p class="page-subtitle">
            <span v-if="$t('platform.description') !== 'platform.description'">{{ $t('platform.description') }}</span>
            <span v-else>Professional trading platform，稳定可靠</span>
          </p>
        </div>
        <div class="header-stats">
          <div class="stat-item">
            <span class="stat-value">4</span>
            <span class="stat-label">
              <span v-if="$t('platform.platforms') !== 'platform.platforms'">{{ $t('platform.platforms') }}</span>
              <span v-else>平台</span>
            </span>
          </div>
          <div class="stat-item">
            <span class="stat-value">99.9%</span>
            <span class="stat-label">
              <span v-if="$t('platform.uptime') !== 'platform.uptime'">{{ $t('platform.uptime') }}</span>
              <span v-else>稳定性</span>
            </span>
          </div>
          <div class="stat-item">
            <span class="stat-value">24/7</span>
            <span class="stat-label">
              <span v-if="$t('platform.support') !== 'platform.support'">{{ $t('platform.support') }}</span>
              <span v-else>支持</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="page-content">
      <!-- 平台列表 -->
      <div class="platforms-section">
        <div class="section-header">
          <h2 class="section-title">{{ $t('platform.availablePlatforms') }}</h2>
          <div class="platform-filter">
            <button class="filter-btn active">{{ $t('platform.all') }}</button>
            <button class="filter-btn">{{ $t('platform.desktop') }}</button>
            <button class="filter-btn">{{ $t('platform.mobile') }}</button>
            <button class="filter-btn">{{ $t('platform.web') }}</button>
          </div>
        </div>
        
        <div class="platforms-grid">
          <div 
            v-for="platform in platforms" 
            :key="platform.id"
            class="platform-card"
            @click="selectPlatform(platform)"
          >
            <!-- 平台信息 -->
            <div class="platform-header">
              <div class="platform-logo">
                <div class="logo-placeholder" :style="{ backgroundColor: platform.color }">
                  {{ platform.icon }}
                </div>
              </div>
              <div class="platform-badge">
                <span class="badge-text">{{ platform.type }}</span>
              </div>
            </div>

            <div class="platform-content">
              <h3 class="platform-name">{{ platform.name }}</h3>
              <p class="platform-desc">{{ platform.description }}</p>
              
              <div class="platform-features">
                <div 
                  v-for="feature in platform.features" 
                  :key="feature"
                  class="feature-item"
                >
                  <span class="feature-icon">✓</span>
                  <span class="feature-text">{{ feature }}</span>
                </div>
              </div>
              
              <div class="platform-stats">
                <div class="stat-row">
                  <span class="stat-label">{{ $t('platform.spread') }}</span>
                  <span class="stat-value">{{ platform.spread }}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">{{ $t('platform.leverage') }}</span>
                  <span class="stat-value">{{ platform.leverage }}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">{{ $t('platform.execution') }}</span>
                  <span class="stat-value">{{ platform.execution }}</span>
                </div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="action-buttons">
              <button class="btn-download" @click.stop="downloadPlatform(platform)">
                <i class="icon">📥</i>
                {{ $t('platform.download') }}
              </button>
              <button class="btn-demo" @click.stop="tryDemo(platform)">
                <i class="icon">🎮</i>
                {{ $t('platform.tryDemo') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 平台优势 -->
      <div class="advantages-section">
        <h2 class="section-title">{{ $t('platform.advantages') }}</h2>
        <div class="advantages-grid">
          <div class="advantage-card">
            <div class="advantage-icon">⚡</div>
            <h3>{{ $t('platform.fastExecution') }}</h3>
            <p>{{ $t('platform.fastExecutionDesc') }}</p>
          </div>
          <div class="advantage-card">
            <div class="advantage-icon">🛡️</div>
            <h3>{{ $t('platform.secure') }}</h3>
            <p>{{ $t('platform.secureDesc') }}</p>
          </div>
          <div class="advantage-card">
            <div class="advantage-icon">📱</div>
            <h3>
              <span v-if="$t('platform.multiDevice') !== 'platform.multiDevice'">{{ $t('platform.multiDevice') }}</span>
              <span v-else>多设备支持</span>
            </h3>
            <p>
              <span v-if="$t('platform.multiDeviceDesc') !== 'platform.multiDeviceDesc'">{{ $t('platform.multiDeviceDesc') }}</span>
              <span v-else>支持多设备同步</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t, locale } = useI18n();

// 平台数据
const platforms = ref([
  {
    id: 1,
    name: 'MT5 Desktop',
    description: '专业桌面交易平台',
    type: 'Desktop',
    icon: '💻',
    color: '#4facfe',
    spread: '0.1 pips',
    leverage: '1:1000',
    execution: '< 50ms',
    features: [
      '高级图表分析',
      'EA自动交易',
      '多账户管理',
      '市场深度显示'
    ]
  },
  {
    id: 2,
    name: 'MT5 Mobile',
    description: '移动端交易应用',
    type: 'Mobile',
    icon: '📱',
    color: '#43e97b',
    spread: '0.1 pips',
    leverage: '1:1000',
    execution: '< 50ms',
    features: [
      '实时行情推送',
      '一键交易',
      '图表分析',
      '账户管理'
    ]
  },
  {
    id: 3,
    name: 'MT5 Web',
    description: '网页版交易平台',
    type: 'Web',
    icon: '🌐',
    color: '#fa709a',
    spread: '0.1 pips',
    leverage: '1:1000',
    execution: '< 50ms',
    features: [
      '无需下载安装',
      '跨平台兼容',
      '实时同步',
      '云端存储'
    ]
  },
  {
    id: 4,
    name: 'MetaTrader 4',
    description: '经典交易平台',
    type: 'Legacy',
    icon: '📊',
    color: '#ffecd2',
    spread: '0.2 pips',
    leverage: '1:500',
    execution: '< 100ms',
    features: [
      '经典界面',
      '稳定可靠',
      '丰富指标',
      '广泛支持'
    ]
  }
]);

// 监听语言切换事件
const handleLanguageChange = () => {
  console.log('Platform: 语言切换事件触发');
  nextTick(() => {
    console.log('Platform: 强制更新组件');
    // 强制修复i18n键值显示
    fixI18nKeysDisplay();
  });
};

// 监听全局语言切换事件
onMounted(() => {
  window.addEventListener('language-changed', handleLanguageChange);
});

onUnmounted(() => {
  window.removeEventListener('language-changed', handleLanguageChange);
});

// 监听locale变化
watch(() => locale.value, (newLocale, oldLocale) => {
  console.log('Platform: locale变化', oldLocale, '->', newLocale);
  nextTick(() => {
    console.log('Platform: locale变化后强制更新');
    // 强制修复i18n键值显示
    fixI18nKeysDisplay();
  });
}, { immediate: true });

// 强制修复i18n键值显示
const fixI18nKeysDisplay = () => {
  try {
    // 定义翻译映射
    const translations = {
      'platform.title': '交易平台',
      'platform.description': 'Professional trading platform，稳定可靠',
      'platform.platforms': '平台',
      'platform.uptime': '稳定性',
      'platform.support': '支持',
      'platform.availablePlatforms': '可用平台',
      'platform.all': '全部',
      'platform.desktop': '桌面版',
      'platform.mobile': '移动交易',
      'platform.web': 'Web交易',
      'platform.spread': '点差',
      'platform.leverage': '杠杆',
      'platform.execution': '执行',
      'platform.download': '下载',
      'platform.tryDemo': '试用',
      'platform.advantages': '平台优势',
      'platform.reliable': '稳定可靠',
      'platform.reliableDesc': '99.9%稳定运行',
      'platform.fast': '快速执行',
      'platform.fastDesc': '毫秒级订单执行',
      'platform.secure': '安全保护',
      'platform.secureDesc': '银行级安全加密',
      'platform.multiDevice': '多设备支持',
      'platform.multiDeviceDesc': '支持多设备同步'
    };
    
    // 递归查找并替换文本节点
    const replaceTextNodes = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        let text = node.textContent;
        let hasChanges = false;
        
        Object.keys(translations).forEach(key => {
          if (text.includes(key)) {
            text = text.replace(key, translations[key]);
            hasChanges = true;
            console.log(`Platform: 替换i18n键值 ${key} -> ${translations[key]}`);
          }
        });
        
        if (hasChanges) {
          node.textContent = text;
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // 递归处理子节点
        Array.from(node.childNodes).forEach(childNode => {
          replaceTextNodes(childNode);
        });
      }
    };
    
    // 查找页面中的所有文本节点并替换
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    let textNode;
    while (textNode = walker.nextNode()) {
      replaceTextNodes(textNode);
    }
    
    console.log('Platform: i18n键值修复完成');
    
  } catch (error) {
    console.error('Platform: i18n键值修复失败:', error);
  }
};

// 语言切换监听
let languageWatcher = null;
let languageChangeHandler = null;

onMounted(() => {
  // 监听语言变化
  languageWatcher = watch(() => locale.value, () => {
    // 强制重新渲染组件
    nextTick(() => {
      console.log('Platform: 语言已切换:', locale.value);
      // 强制修复i18n键值显示
      setTimeout(() => {
        fixI18nKeysDisplay();
      }, 100);
    });
  }, { immediate: true });
  
  // 监听全局语言变化事件
  languageChangeHandler = (event) => {
    console.log('Platform: 收到语言变化事件:', event.detail.locale);
    // 强制更新组件
    nextTick(() => {
      console.log('Platform: 组件已更新');
      // 强制修复i18n键值显示
      setTimeout(() => {
        fixI18nKeysDisplay();
      }, 100);
    });
  };
  
  window.addEventListener('language-changed', languageChangeHandler);
  
  // 组件挂载后立即修复i18n键值
  setTimeout(() => {
    fixI18nKeysDisplay();
  }, 500);
  
  // 定期检查和修复
  const fixInterval = setInterval(() => {
    fixI18nKeysDisplay();
  }, 3000);
  
  // 清理定时器
  onUnmounted(() => {
    if (fixInterval) {
      clearInterval(fixInterval);
    }
  });
});

onUnmounted(() => {
  if (languageWatcher) {
    languageWatcher();
  }
  if (languageChangeHandler) {
    window.removeEventListener('language-changed', languageChangeHandler);
  }
});

// 选择平台
const selectPlatform = (platform) => {
  console.log('选择平台:', platform);
  router.push(`/platform/${platform.id}`);
};

// 下载平台
const downloadPlatform = (platform) => {
  console.log('下载平台:', platform);
  window.open(`http://localhost:333/syn/#/download/${platform.id}`, '_blank');
};

// 试用演示
const tryDemo = (platform) => {
  console.log('试用演示:', platform);
  window.open(`http://localhost:333/syn/#/demo/${platform.id}`, '_blank');
};
</script>

<style scoped>
.platform-page {
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

.platforms-section {
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

.platform-filter {
  display: flex;
  gap: 12px;
}

.filter-btn {
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
}

.platforms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 30px;
}

.platform-card {
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

.platform-card::before {
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

.platform-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(0,0,0,0.6);
  border-color: rgba(255,255,255,0.2);
}

.platform-card:hover::before {
  opacity: 1;
}

.platform-header {
  position: relative;
  padding: 30px;
  background: rgba(255,255,255,0.02);
}

.platform-logo {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.logo-placeholder {
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

.platform-card:hover .logo-placeholder {
  transform: scale(1.1);
}

.platform-badge {
  position: absolute;
  top: 25px;
  right: 25px;
}

.badge-text {
  padding: 8px 16px;
  background: rgba(255,255,255,0.1);
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #ffffff;
  border: 1px solid rgba(255,255,255,0.2);
}

.platform-content {
  padding: 0 30px 30px;
}

.platform-name {
  font-size: 1.6rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 12px 0;
  line-height: 1.3;
  text-align: center;
}

.platform-desc {
  font-size: 1rem;
  color: rgba(255,255,255,0.7);
  margin: 0 0 25px 0;
  line-height: 1.5;
  text-align: center;
}

.platform-features {
  margin-bottom: 25px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.feature-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4facfe 0%, #43e97b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: white;
  font-weight: bold;
}

.feature-text {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.8);
  font-weight: 500;
}

.platform-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.stat-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.1);
}

.stat-label {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.6);
  font-weight: 500;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 1rem;
  color: #ffffff;
  font-weight: 700;
}

.action-buttons {
  display: flex;
  gap: 12px;
  padding: 0 30px 30px;
}

.btn-download, .btn-demo {
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

.btn-download {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-download:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102,126,234,0.4);
}

.btn-demo {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.btn-demo:hover {
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
  .platform-page {
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
  
  .platform-filter {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .platforms-grid {
    grid-template-columns: 1fr;
    gap: 25px;
  }
  
  .platform-stats {
    grid-template-columns: 1fr;
    gap: 15px;
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
  
  .platform-name {
    font-size: 1.4rem;
  }
  
  .advantage-card {
    padding: 35px 25px;
  }
  
  .platforms-grid {
    grid-template-columns: 1fr;
  }
}
</style>