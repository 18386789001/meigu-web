<template>
    <div class="trading-page">
      <!-- 页面头部 -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">{{ $t('trading.title') }}</h1>
          <p class="page-subtitle">{{ $t('trading.subtitle') }}</p>
        </div>
      </div>
  
      <!-- 交易统计卡片 -->
      <div class="stats-section">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">📈</div>
            <div class="stat-content">
              <h3>{{ $t('trading.stats.activeUsers') }}</h3>
              <p class="stat-number">50K+</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">💰</div>
            <div class="stat-content">
              <h3>{{ $t('trading.stats.totalVolume') }}</h3>
              <p class="stat-number">$2.5B</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🌍</div>
            <div class="stat-content">
              <h3>{{ $t('trading.stats.globalMarkets') }}</h3>
              <p class="stat-number">150+</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">⚡</div>
            <div class="stat-content">
              <h3>{{ $t('trading.stats.executionSpeed') }}</h3>
              <p class="stat-number">&lt;1ms</p>
            </div>
          </div>
        </div>
      </div>
  
      <!-- 交易产品网格 -->
      <div class="products-section">
        <h2 class="section-title">{{ $t('trading.products.title') }}</h2>
        <div class="products-grid">
          <div 
            v-for="product in tradingProducts" 
            :key="product.id"
            class="product-card"
            @click="navigateToProduct(product)"
          >
            <div class="product-header">
              <div class="product-icon">
                <div v-html="product.icon" class="icon-svg"></div>
              </div>
              <div class="product-info">
                <h3 class="product-title">{{ product.title }}</h3>
                <p class="product-description">{{ product.description }}</p>
              </div>
            </div>
            
            <div class="product-stats">
              <div class="stat-row">
                <span class="stat-label">{{ $t('trading.leverage') }}</span>
                <span class="stat-value">{{ product.leverage }}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">{{ $t('trading.spread') }}</span>
                <span class="stat-value">{{ product.spread }}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">{{ $t('trading.minVolume') }}</span>
                <span class="stat-value">{{ product.minVolume }}</span>
              </div>
            </div>
  
            <div class="product-actions">
              <button class="btn-primary" @click.stop="openRealAccount(product)">
                {{ $t('trading.realAccount') }}
              </button>
              <button class="btn-secondary" @click.stop="openDemoAccount(product)">
                {{ $t('trading.demoAccount') }}
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- 交易优势 -->
      <div class="advantages-section">
        <h2 class="section-title">{{ $t('trading.advantages.title') }}</h2>
        <div class="advantages-grid">
          <div class="advantage-card">
            <div class="advantage-icon">🚀</div>
            <h4>{{ $t('trading.advantages.fast') }}</h4>
            <p>{{ $t('trading.advantages.fastDesc') }}</p>
          </div>
          <div class="advantage-card">
            <div class="advantage-icon">🛡️</div>
            <h4>{{ $t('trading.advantages.secure') }}</h4>
            <p>{{ $t('trading.advantages.secureDesc') }}</p>
          </div>
          <div class="advantage-card">
            <div class="advantage-icon">📱</div>
            <h4>{{ $t('trading.advantages.mobile') }}</h4>
            <p>{{ $t('trading.advantages.mobileDesc') }}</p>
          </div>
          <div class="advantage-card">
            <div class="advantage-icon">🌐</div>
            <h4>{{ $t('trading.advantages.global') }}</h4>
            <p>{{ $t('trading.advantages.globalDesc') }}</p>
          </div>
        </div>
      </div>
  
      <!-- 交易时间 -->
      <div class="trading-hours-section">
        <h2 class="section-title">{{ $t('trading.hours.title') }}</h2>
        <div class="hours-grid">
          <div class="hours-card">
            <div class="hours-icon">📅</div>
            <h4>{{ $t('trading.hours.forex') }}</h4>
            <p>{{ $t('trading.hours.forexTime') }}</p>
          </div>
          <div class="hours-card">
            <div class="hours-icon">⏰</div>
            <h4>{{ $t('trading.hours.crypto') }}</h4>
            <p>{{ $t('trading.hours.cryptoTime') }}</p>
          </div>
          <div class="hours-card">
            <div class="hours-icon">🏛️</div>
            <h4>{{ $t('trading.hours.stocks') }}</h4>
            <p>{{ $t('trading.hours.stocksTime') }}</p>
          </div>
          <div class="hours-card">
            <div class="hours-icon">💎</div>
            <h4>{{ $t('trading.hours.commodities') }}</h4>
            <p>{{ $t('trading.hours.commoditiesTime') }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import config from '@/config';
  
  const router = useRouter();
  const { t, locale } = useI18n();
  
  // 监听语言变化，确保页面更新
  watch(() => locale.value, (newLocale) => {
    console.log('Trading.vue: 语言已切换到:', newLocale);
  });
  
  // 交易产品数据
  const tradingProducts = computed(() => [
    {
      id: 1,
      title: t('trading.forex.title'),
      description: t('trading.forex.description'),
      leverage: '1:1000',
      spread: '0.1',
      minVolume: '0.01',
      icon: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="30" fill="url(#forexGradient)" stroke="#3b82f6" stroke-width="2"/>
        <path d="M20 28h24v2H20v-2zm0 4h24v2H20v-2zm0 4h24v2H20v-2z" fill="white"/>
        <path d="M18 20h2v24h-2V20zm26 0h2v24h-2V20z" fill="#3b82f6"/>
        <path d="M32 18v2M32 44v2" stroke="white" stroke-width="2" stroke-linecap="round"/>
        <circle cx="32" cy="32" r="3" fill="white"/>
        <defs>
          <linearGradient id="forexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1e40af;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
          </linearGradient>
        </defs>
      </svg>`,
      route: '/trading/forex'
    },
    {
      id: 2,
      title: t('trading.crypto.title'),
      description: t('trading.crypto.description'),
      leverage: '1:100',
      spread: '0.05',
      minVolume: '0.001',
      icon: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="30" fill="url(#cryptoGradient)" stroke="#3b82f6" stroke-width="2"/>
        <circle cx="32" cy="32" r="16" fill="white"/>
        <path d="M24 24l16 16M40 24L24 40" stroke="#3b82f6" stroke-width="2" stroke-linecap="round"/>
        <circle cx="32" cy="32" r="3" fill="#3b82f6"/>
        <path d="M20 20l8-8M44 20l-8-8M20 44l8 8M44 44l-8 8" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
        <defs>
          <linearGradient id="cryptoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1e40af;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
          </linearGradient>
        </defs>
      </svg>`,
      route: '/trading/crypto'
    },
    {
      id: 3,
      title: t('trading.stocks.title'),
      description: t('trading.stocks.description'),
      leverage: '1:20',
      spread: '0.3',
      minVolume: '1',
      icon: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="30" fill="url(#stocksGradient)" stroke="#3b82f6" stroke-width="2"/>
        <path d="M16 40l8-12 8 8 8-16 8 20" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <circle cx="16" cy="40" r="2" fill="white"/>
        <circle cx="24" cy="28" r="2" fill="white"/>
        <circle cx="32" cy="36" r="2" fill="white"/>
        <circle cx="40" cy="20" r="2" fill="white"/>
        <circle cx="48" cy="44" r="2" fill="white"/>
        <path d="M20 16h24v2H20v-2zm0 4h24v2H20v-2z" stroke="white" stroke-width="1" stroke-linecap="round" fill="none"/>
        <defs>
          <linearGradient id="stocksGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1e40af;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
          </linearGradient>
        </defs>
      </svg>`,
      route: '/trading/stocks'
    },
    {
      id: 4,
      title: t('trading.commodities.title'),
      description: t('trading.commodities.description'),
      leverage: '1:100',
      spread: '0.2',
      minVolume: '0.1',
      icon: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="30" fill="url(#commoditiesGradient)" stroke="#3b82f6" stroke-width="2"/>
        <path d="M32 16c0-4 4-8 8-8s8 4 8 8v8h8v8h-8v8c0 4-4 8-8 8s-8-4-8-8v-8h-8v-8h8v-8z" fill="white"/>
        <path d="M28 24h8v8h-8v-8z" fill="#3b82f6"/>
        <circle cx="32" cy="32" r="2" fill="#3b82f6"/>
        <path d="M20 20l4-4M44 20l-4-4M20 44l4 4M44 44l-4 4" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
        <defs>
          <linearGradient id="commoditiesGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1e40af;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
          </linearGradient>
        </defs>
      </svg>`,
      route: '/trading/commodities'
    }
  ]);
  
  // 方法
  const navigateToProduct = (product) => {
    router.push(product.route);
  };
  
  const openRealAccount = (product) => {
    window.open(config.URLS.REAL_TRADING(product.id), '_blank');
  };

  const openDemoAccount = (product) => {
    window.open(config.URLS.DEMO_TRADING(product.id), '_blank');
  };
</script>
  
  <style scoped>
  .trading-page {
    min-height: 100vh;
    background: #000000;
    color: #ffffff;
    padding: 0;
    overflow-x: hidden;
  }
  
  /* 页面头部 */
  .page-header {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    padding: 60px 20px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  
  .page-header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="%23334155" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
    opacity: 0.3;
  }
  
  .header-content {
    position: relative;
    z-index: 1;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .page-title {
    font-size: 48px;
    font-weight: 800;
    margin-bottom: 16px;
    background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1.2;
  }
  
  .page-subtitle {
    font-size: 18px;
    color: #94a3b8;
    margin: 0;
    line-height: 1.6;
  }
  
  /* 统计卡片 */
  .stats-section {
    padding: 60px 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 24px;
  }
  
  .stat-card {
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    border: 1px solid #334155;
    border-radius: 16px;
    padding: 32px 24px;
    text-align: center;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  
  .stat-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .stat-card:hover {
    transform: translateY(-4px);
    border-color: #3b82f6;
    box-shadow: 0 20px 40px rgba(59, 130, 246, 0.1);
  }
  
  .stat-card:hover::before {
    opacity: 1;
  }
  
  .stat-icon {
    font-size: 32px;
    margin-bottom: 16px;
  }
  
  .stat-content h3 {
    font-size: 14px;
    color: #94a3b8;
    margin: 0 0 8px 0;
    font-weight: 500;
  }
  
  .stat-number {
    font-size: 28px;
    font-weight: 700;
    color: #ffffff;
    margin: 0;
  }
  
  /* 产品部分 */
  .products-section {
    padding: 60px 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .section-title {
    font-size: 32px;
    font-weight: 700;
    text-align: center;
    margin-bottom: 48px;
    color: #ffffff;
  }
  
  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 32px;
  }
  
  .product-card {
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    border: 1px solid #334155;
    border-radius: 20px;
    padding: 32px;
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  
  .product-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .product-card:hover {
    transform: translateY(-8px);
    border-color: #3b82f6;
    box-shadow: 0 25px 50px rgba(59, 130, 246, 0.15);
  }
  
  .product-card:hover::before {
    opacity: 1;
  }
  
  .product-header {
    display: flex;
    align-items: flex-start;
    gap: 20px;
    margin-bottom: 24px;
  }
  
  .product-icon {
    width: 60px;
    height: 60px;
    flex-shrink: 0;
  }
  
  .icon-svg {
    width: 100%;
    height: 100%;
  }
  
  .icon-svg svg {
    width: 100%;
    height: 100%;
  }
  
  .product-info {
    flex: 1;
  }
  
  .product-title {
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 8px 0;
    color: #ffffff;
  }
  
  .product-description {
    font-size: 14px;
    color: #94a3b8;
    line-height: 1.5;
    margin: 0;
  }
  
  .product-stats {
    background: rgba(30, 41, 59, 0.5);
    border: 1px solid #334155;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 24px;
  }
  
  .stat-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  
  .stat-row:last-child {
    margin-bottom: 0;
  }
  
  .stat-label {
    font-size: 14px;
    color: #94a3b8;
  }
  
  .stat-value {
    font-size: 14px;
    font-weight: 600;
    color: #ffffff;
  }
  
  .product-actions {
    display: flex;
    gap: 12px;
  }
  
  .btn-primary,
  .btn-secondary {
    flex: 1;
    padding: 14px 20px;
    border: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
  }
  
  .btn-primary {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
  }
  
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
  }
  
  .btn-secondary {
    background: transparent;
    color: #ffffff;
    border: 1px solid #334155;
  }
  
  .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: #3b82f6;
  }
  
  /* 优势部分 */
  .advantages-section {
    padding: 60px 20px;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  }
  
  .advantages-grid {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 32px;
  }
  
  .advantage-card {
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    border: 1px solid #334155;
    border-radius: 16px;
    padding: 32px 24px;
    text-align: center;
    transition: all 0.3s ease;
  }
  
  .advantage-card:hover {
    transform: translateY(-4px);
    border-color: #3b82f6;
    box-shadow: 0 15px 35px rgba(59, 130, 246, 0.1);
  }
  
  .advantage-icon {
    font-size: 40px;
    margin-bottom: 20px;
  }
  
  .advantage-card h4 {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 12px 0;
    color: #ffffff;
  }
  
  .advantage-card p {
    font-size: 14px;
    color: #94a3b8;
    line-height: 1.6;
    margin: 0;
  }
  
  /* 交易时间部分 */
  .trading-hours-section {
    padding: 60px 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .hours-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 24px;
  }
  
  .hours-card {
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    border: 1px solid #334155;
    border-radius: 16px;
    padding: 28px 24px;
    text-align: center;
    transition: all 0.3s ease;
  }
  
  .hours-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(59, 130, 246, 0.15);
    border-color: #3b82f6;
  }
  
  .hours-card h4 {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 16px 0;
    color: #ffffff;
  }
  
  .hours-card .time-range {
    font-size: 16px;
    color: #3b82f6;
    font-weight: 500;
    margin-bottom: 8px;
  }
  
  .hours-card .timezone {
    font-size: 14px;
    color: #94a3b8;
    margin: 0;
  }
  
  /* 移动端适配 */
  @media (max-width: 768px) {
    .container {
      padding: 0 16px;
    }
    
    .hero-section {
      padding: 40px 0;
    }
    
    .hero-title {
      font-size: 32px;
    }
    
    .hero-subtitle {
      font-size: 16px;
    }
    
    .trading-grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }
    
    .trading-card {
      padding: 20px;
    }
    
    .card-icon {
      width: 50px;
      height: 50px;
      margin-bottom: 16px;
    }
    
    .icon-svg {
      width: 40px;
      height: 40px;
    }
    
    .card-title {
      font-size: 18px;
    }
    
    .card-description {
      font-size: 14px;
    }
    
    .card-actions {
      flex-direction: column;
      gap: 12px;
    }
    
    .btn-primary,
    .btn-secondary {
      padding: 12px 16px;
      font-size: 14px;
    }
    
    .advantages-section {
      padding: 40px 0;
    }
    
    .advantages-grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }
    
    .advantage-card {
      padding: 20px;
    }
    
    .trading-hours-section {
      padding: 40px 0;
    }
    
    .hours-grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }
    
    .hours-card {
      padding: 20px;
    }
  }
  
  @media (max-width: 480px) {
    .hero-title {
      font-size: 28px;
    }
    
    .hero-subtitle {
      font-size: 14px;
    }
    
    .trading-card {
      padding: 16px;
    }
    
    .card-icon {
      width: 45px;
      height: 45px;
      margin-bottom: 14px;
    }
    
    .icon-svg {
      width: 35px;
      height: 35px;
    }
    
    .card-title {
      font-size: 16px;
    }
    
    .card-description {
      font-size: 13px;
    }
    
    .advantage-card {
      padding: 16px;
    }
    
    .advantage-card h4 {
      font-size: 16px;
    }
    
    .advantage-card p {
      font-size: 13px;
    }
    
    .hours-card {
      padding: 16px;
    }
    
    .hours-card h4 {
      font-size: 16px;
    }
    
    .hours-card .time-range {
      font-size: 14px;
    }
    
    .hours-card .timezone {
      font-size: 13px;
    }
  }
</style>