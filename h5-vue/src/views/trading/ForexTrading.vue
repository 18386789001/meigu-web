<template>
  <div class="forex-trading-page">
    <!-- 视频背景 -->
    <video 
      class="video-background" 
      autoplay 
      muted 
      loop 
      playsinline
    >
      <source src="/背景.mp4" type="video/mp4">
    </video>
    
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-info">
          <h1 class="page-title">
            <span v-if="$t('trading.forex.title') !== 'trading.forex.title'">{{ $t('trading.forex.title') }}</span>
            <span v-else>外汇交易</span>
          </h1>
          <p class="page-subtitle">
            <span v-if="$t('trading.forex.description') !== 'trading.forex.description'">{{ $t('trading.forex.description') }}</span>
            <span v-else>全球主要货币对交易</span>
          </p>
        </div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="page-content">
      <!-- 货币对列表 -->
      <div class="symbols-section">
        <div class="symbols-list">
          <div 
            v-for="symbol in symbols" 
            :key="symbol.id"
            class="symbol-card"
            @click="selectSymbol(symbol)"
          >
            <!-- 货币对信息 -->
            <div class="symbol-info">
              <div class="pair-flags">
                <img :src="symbol.baseIcon" :alt="symbol.baseCurrency" class="currency-icon" />
                <img :src="symbol.quoteIcon" :alt="symbol.quoteCurrency" class="currency-icon" />
              </div>
              <div class="pair-details">
                <h3 class="pair-name">{{ symbol.name }}</h3>
                <p class="pair-desc">{{ symbol.description }}</p>
              </div>
            </div>

            <!-- 价格信息 -->
            <div class="price-info">
              <div class="price-main">
                <span class="price-value">{{ symbol.price }}</span>
                <span class="price-change" :class="symbol.changeType">
                  {{ symbol.changeIcon }} {{ symbol.changeText }}
                </span>
              </div>
              <div class="price-details">
                <div class="price-row">
                  <span class="price-label">
                    <span v-if="$t('trading.forex.high') !== 'trading.forex.high'">{{ $t('trading.forex.high') }}</span>
                    <span v-else>最高</span>
                  </span>
                  <span class="price-value-small">{{ symbol.high }}</span>
                </div>
                <div class="price-row">
                  <span class="price-label">
                    <span v-if="$t('trading.forex.low') !== 'trading.forex.low'">{{ $t('trading.forex.low') }}</span>
                    <span v-else>最低</span>
                  </span>
                  <span class="price-value-small">{{ symbol.low }}</span>
                </div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="action-buttons">
              <button class="btn-chart" @click.stop="viewChart(symbol)">
                <i class="icon">📈</i>
                <span v-if="$t('trading.forex.chart') !== 'trading.forex.chart'">{{ $t('trading.forex.chart') }}</span>
                <span v-else>图表</span>
              </button>
              <button class="btn-trade" @click.stop="startTrading(symbol)">
                <i class="icon">💼</i>
                <span v-if="$t('trading.forex.trade') !== 'trading.forex.trade'">{{ $t('trading.forex.trade') }}</span>
                <span v-else>交易</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 交易优势 -->
      <div class="advantages-section">
        <h2 class="section-title">
          <span v-if="$t('trading.forex.advantages') !== 'trading.forex.advantages'">{{ $t('trading.forex.advantages') }}</span>
          <span v-else>交易优势</span>
        </h2>
        <div class="advantages-grid">
          <div class="advantage-card">
            <div class="advantage-icon">⚡</div>
            <h3>
              <span v-if="$t('trading.forex.fastExecution') !== 'trading.forex.fastExecution'">{{ $t('trading.forex.fastExecution') }}</span>
              <span v-else>快速执行</span>
            </h3>
            <p>
              <span v-if="$t('trading.forex.fastExecutionDesc') !== 'trading.forex.fastExecutionDesc'">{{ $t('trading.forex.fastExecutionDesc') }}</span>
              <span v-else>毫秒级订单执行</span>
            </p>
          </div>
          <div class="advantage-card">
            <div class="advantage-icon">🔒</div>
            <h3>
              <span v-if="$t('trading.forex.secure') !== 'trading.forex.secure'">{{ $t('trading.forex.secure') }}</span>
              <span v-else>安全可靠</span>
            </h3>
            <p>
              <span v-if="$t('trading.forex.secureDesc') !== 'trading.forex.secureDesc'">{{ $t('trading.forex.secureDesc') }}</span>
              <span v-else>银行级安全保障</span>
            </p>
          </div>
          <div class="advantage-card">
            <div class="advantage-icon">📱</div>
            <h3>
              <span v-if="$t('trading.forex.mobile') !== 'trading.forex.mobile'">{{ $t('trading.forex.mobile') }}</span>
              <span v-else>移动交易</span>
            </h3>
            <p>
              <span v-if="$t('trading.forex.mobileDesc') !== 'trading.forex.mobileDesc'">{{ $t('trading.forex.mobileDesc') }}</span>
              <span v-else>随时随地交易</span>
            </p>
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

// 监听语言切换事件
const handleLanguageChange = () => {
  console.log('ForexTrading: 语言切换事件触发');
  nextTick(() => {
    console.log('ForexTrading: 强制更新组件');
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
  console.log('ForexTrading: locale变化', oldLocale, '->', newLocale);
  nextTick(() => {
    console.log('ForexTrading: locale变化后强制更新');
    // 强制修复i18n键值显示
    fixI18nKeysDisplay();
  });
}, { immediate: true });

// 强制修复i18n键值显示
const fixI18nKeysDisplay = () => {
  try {
    // 定义翻译映射
    const translations = {
      'trading.forex.title': '外汇交易',
      'trading.forex.description': '全球主要货币对交易',
      'trading.forex.chart': '图表',
      'trading.forex.trade': '交易',
      'trading.forex.high': '最高',
      'trading.forex.low': '最低',
      'trading.forex.advantages': '交易优势',
      'trading.forex.fastExecution': '快速执行',
      'trading.forex.fastExecutionDesc': '毫秒级订单执行',
      'trading.forex.secure': '安全可靠',
      'trading.forex.secureDesc': '银行级安全保障',
      'trading.forex.mobile': '移动交易',
      'trading.forex.mobileDesc': '随时随地交易'
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
            console.log(`ForexTrading: 替换i18n键值 ${key} -> ${translations[key]}`);
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
    
    console.log('ForexTrading: i18n键值修复完成');
    
  } catch (error) {
    console.error('ForexTrading: i18n键值修复失败:', error);
  }
};

// 获取货币对描述的函数
const getPairDescription = (pairName) => {
  const key = `trading.forex.pairDescriptions.${pairName}`;
  const translation = t(key);
  // 如果翻译不存在，返回默认值
  if (translation === key) {
    const defaultDescriptions = {
      'EUR/USD': '欧元/美元',
      'GBP/USD': '英镑/美元',
      'USD/JPY': '美元/日元'
    };
    return defaultDescriptions[pairName] || pairName;
  }
  return translation;
};

// 精简的货币对数据 - 只保留3条主要货币对
const symbols = computed(() => [
  {
    id: 1,
    name: 'EUR/USD',
    description: getPairDescription('EUR/USD'),
    price: '1.0856',
    change: 0.24,
    changeType: 'positive',
    changeIcon: '↗',
    changeText: '+0.24%',
    high: '1.0862',
    low: '1.0848',
    baseCurrency: 'EUR',
    quoteCurrency: 'USD',
    baseIcon: '/h5/svg/forex/eur.svg',
    quoteIcon: '/h5/svg/forex/usd.svg',
    spread: '0.8',
    minVolume: '0.01',
    leverage: '1:500'
  },
  {
    id: 2,
    name: 'GBP/USD',
    description: getPairDescription('GBP/USD'),
    price: '1.2734',
    change: -0.18,
    changeType: 'negative',
    changeIcon: '↘',
    changeText: '-0.18%',
    high: '1.2741',
    low: '1.2729',
    baseCurrency: 'GBP',
    quoteCurrency: 'USD',
    baseIcon: '/h5/svg/forex/gbp.svg',
    quoteIcon: '/h5/svg/forex/usd.svg',
    spread: '1.2',
    minVolume: '0.01',
    leverage: '1:500'
  },
  {
    id: 3,
    name: 'USD/JPY',
    description: getPairDescription('USD/JPY'),
    price: '149.85',
    change: 0.42,
    changeType: 'positive',
    changeIcon: '↗',
    changeText: '+0.42%',
    high: '149.92',
    low: '149.78',
    baseCurrency: 'USD',
    quoteCurrency: 'JPY',
    baseIcon: '/h5/svg/forex/usd.svg',
    quoteIcon: '/h5/svg/forex/jpy.svg',
    spread: '1.5',
    minVolume: '0.01',
    leverage: '1:500'
  }
]);

// 语言切换监听
let languageWatcher = null;
let languageChangeHandler = null;
let fixInterval = null;
let lastFixTime = 0;

// 防抖修复函数
const debouncedFixI18nKeys = () => {
  const now = Date.now();
  if (now - lastFixTime < 1000) { // 1秒内只执行一次
    return;
  }
  lastFixTime = now;
  fixI18nKeysDisplay();
};

onMounted(() => {
  // 监听语言变化
  languageWatcher = watch(() => locale.value, () => {
    // 强制重新渲染组件
    nextTick(() => {
      console.log('ForexTrading: 语言已切换:', locale.value);
      // 防抖修复i18n键值显示
      debouncedFixI18nKeys();
    });
  }, { immediate: true });
  
  // 监听全局语言变化事件
  languageChangeHandler = (event) => {
    console.log('ForexTrading: 收到语言变化事件:', event.detail.locale);
    // 强制更新组件
    nextTick(() => {
      console.log('ForexTrading: 组件已更新');
      // 防抖修复i18n键值显示
      debouncedFixI18nKeys();
    });
  };
  
  window.addEventListener('language-changed', languageChangeHandler);
  
  // 组件挂载后立即修复i18n键值
  setTimeout(() => {
    debouncedFixI18nKeys();
  }, 500);
  
  // 定期检查和修复（减少频率）
  fixInterval = setInterval(() => {
    debouncedFixI18nKeys();
  }, 10000); // 改为10秒检查一次
});

onUnmounted(() => {
  if (languageWatcher) {
    languageWatcher();
  }
  if (languageChangeHandler) {
    window.removeEventListener('language-changed', languageChangeHandler);
  }
  if (fixInterval) {
    clearInterval(fixInterval);
  }
});

// 选择货币对
const selectSymbol = (symbol) => {
  console.log('选择货币对:', symbol);
};

// 查看图表
const viewChart = (symbol) => {
  console.log('查看图表:', symbol);
  router.push(`/trading/forex/${symbol.name}/chart`);
};

// 开始交易
const startTrading = (symbol) => {
  console.log('开始交易:', symbol);
  window.open(`http://localhost:333/syn/#/trading?symbol=${symbol.name}`, '_blank');
};
</script>

<style scoped>
.forex-trading-page {
  min-height: 100vh;
  padding: 20px;
  color: white;
  position: relative;
  overflow-x: hidden;
}

/* 视频背景 */
.video-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
  opacity: 0.8;
}

/* 添加深色遮罩层确保文字可读性 */
.forex-trading-page::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 0;
  pointer-events: none;
}

/* 确保所有内容在遮罩层之上 */
.forex-trading-page > * {
  position: relative;
  z-index: 1;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.header-content {
  max-width: 600px;
  margin: 0 auto;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 10px 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

.page-subtitle {
  font-size: 1.1rem;
  color: rgba(255,255,255,0.8);
  margin: 0;
  font-weight: 300;
}

.page-content {
  max-width: 800px;
  margin: 0 auto;
}

.symbols-section {
  margin-bottom: 40px;
}

.symbols-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.symbol-card {
  background: rgba(40,40,40,0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.symbol-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.15);
}

.symbol-info {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.pair-flags {
  display: flex;
  gap: 5px;
}

.currency-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  transition: transform 0.3s ease;
}

.currency-icon:hover {
  transform: scale(1.1);
}

.pair-details {
  flex: 1;
}

.pair-name {
  font-size: 1.4rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 5px 0;
}

.pair-desc {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.7);
  margin: 0;
}

.price-info {
  margin-bottom: 20px;
}

.price-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.price-value {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
}

.price-change {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 1rem;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 20px;
}

.price-change.positive {
  color: #38a169;
  background: rgba(56,161,105,0.1);
}

.price-change.negative {
  color: #e53e3e;
  background: rgba(229,62,62,0.1);
}

.price-details {
  display: flex;
  gap: 30px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 80px;
}

.price-label {
  font-size: 0.85rem;
  color: rgba(255,255,255,0.6);
  font-weight: 500;
}

.price-value-small {
  font-size: 0.9rem;
  color: #ffffff;
  font-weight: 600;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.btn-chart, .btn-trade {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-chart {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-chart:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102,126,234,0.4);
}

.btn-trade {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.btn-trade:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245,87,108,0.4);
}

.advantages-section {
  text-align: center;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 30px 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

.advantages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.advantage-card {
  background: rgba(40,40,40,0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 25px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.1);
  transition: all 0.3s ease;
}

.advantage-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.15);
}

.advantage-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.advantage-card h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 10px 0;
}

.advantage-card p {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.7);
  margin: 0;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .forex-trading-page {
    padding: 15px;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .symbol-card {
    padding: 20px;
  }
  
  .price-details {
    flex-direction: column;
    gap: 10px;
  }
  
  .price-row {
    justify-content: space-between;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .advantages-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.8rem;
  }
  
  .symbol-card {
    padding: 15px;
  }
  
  .price-value {
    font-size: 1.6rem;
  }
  
  .pair-name {
    font-size: 1.2rem;
  }
}
</style>