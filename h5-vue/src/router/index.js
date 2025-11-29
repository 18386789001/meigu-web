import { createRouter, createWebHistory } from 'vue-router';
import { useI18n } from 'vue-i18n';

const router = createRouter({
  history: createWebHistory('/h5/'),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Home.vue'),
      meta: {
        title: '首页',
        keepAlive: true
      }
    },
    {
      path: '/home',
      redirect: '/'
    },
    {
      path: '/trading',
      name: 'Trading',
      component: () => import('@/views/Trading.vue'),
      meta: {
        title: '交易中心',
        keepAlive: true
      }
    },
    {
      path: '/trading/forex',
      name: 'ForexTrading',
      component: () => import('@/views/trading/ForexTrading.vue'),
      meta: {
        title: '外汇交易',
        keepAlive: true
      }
    },
    {
      path: '/trading/crypto',
      name: 'CryptoTrading',
      component: () => import('@/views/trading/CryptoTrading.vue'),
      meta: {
        title: '数字货币交易',
        keepAlive: true
      }
    },
    {
      path: '/trading/stocks',
      name: 'StocksTrading',
      component: () => import('@/views/trading/StocksTrading.vue'),
      meta: {
        title: '股票交易',
        keepAlive: true
      }
    },
    {
      path: '/trading/commodities',
      name: 'CommoditiesTrading',
      component: () => import('@/views/trading/CommoditiesTrading.vue'),
      meta: {
        title: '商品期货交易',
        keepAlive: true
      }
    },
    {
      path: '/market',
      name: 'Market',
      component: () => import('@/views/Market.vue'),
      meta: {
        title: '行情',
        keepAlive: true
      }
    },
    {
      path: '/platform',
      name: 'Platform',
      component: () => import('@/views/Platform.vue'),
      meta: {
        title: '交易平台',
        keepAlive: true
      }
    },
    {
      path: '/platform/mt4',
      name: 'PlatformMT4',
      component: () => import('@/views/platform/MT4.vue'),
      meta: {
        title: 'MetaTrader 4',
        keepAlive: true
      }
    },
    {
      path: '/platform/mt5',
      name: 'PlatformMT5',
      component: () => import('@/views/platform/MT5.vue'),
      meta: {
        title: 'MetaTrader 5',
        keepAlive: true
      }
    },
    {
      path: '/platform/web',
      name: 'PlatformWeb',
      component: () => import('@/views/platform/Web.vue'),
      meta: {
        title: 'Web交易',
        keepAlive: true
      }
    },
    {
      path: '/platform/mobile',
      name: 'PlatformMobile',
      component: () => import('@/views/platform/Mobile.vue'),
      meta: {
        title: '移动交易',
        keepAlive: true
      }
    },
    {
      path: '/education',
      name: 'Education',
      component: () => import('@/views/Education.vue'),
      meta: {
        title: '教育中心',
        keepAlive: true
      }
    },
    {
      path: '/analysis',
      name: 'Analysis',
      component: () => import('@/views/Analysis.vue'),
      meta: {
        title: '市场分析',
        keepAlive: true
      }
    },
    {
      path: '/support',
      name: 'Support',
      component: () => import('@/views/Support.vue'),
      meta: {
        title: '客户支持',
        keepAlive: true
      }
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('@/views/About.vue'),
      meta: {
        title: '关于我们',
        keepAlive: true
      }
    },
    {
      path: '/more',
      name: 'More',
      component: () => import('@/views/More.vue'),
      meta: {
        title: '更多',
        keepAlive: true
      }
    },
    {
      path: '/debug',
      name: 'DebugLocalStorage',
      component: () => import('@/views/DebugLocalStorage.vue'),
      meta: {
        title: '调试工具',
        keepAlive: false
      }
    },
    // 404页面已删除，直接重定向到首页
    {
      path: '/:pathMatch(.*)*',
      redirect: '/home'
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// 路由守卫
router.beforeEach((to, from, next) => {
  // 确保语言设置为英文（每次路由切换时检查）
  try {
    const currentLang = localStorage.getItem('lang');
    if (!currentLang) {
      localStorage.setItem('lang', 'en-US');
      console.log('路由守卫：设置默认语言为英文');
    }
  } catch (error) {
    console.error('路由守卫：语言设置失败', error);
  }

  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - JPMX`;
  }
  
  // 只对不存在的路由进行重定向，允许正常的路由导航
  const validRoutes = [
    '/', '/home', '/trading', '/market', '/platform', '/more', '/debug',
    '/trading/forex', '/trading/crypto', '/trading/stocks', '/trading/commodities',
    '/platform/mt4', '/platform/mt5', '/platform/web', '/platform/mobile',
    '/education', '/analysis', '/support', '/about'
  ];
  
  // 检查是否是有效路由或子路由
  const isValidRoute = validRoutes.includes(to.path) || 
    validRoutes.some(route => to.path.startsWith(route + '/'));
  
  if (!isValidRoute) {
    // 如果是无效路由，重定向到首页
    next({ name: 'Home', replace: true });
    return;
  }
  
  next();
});

// 路由后置守卫
router.afterEach((to, from) => {
  // 页面加载完成后的处理
  console.log(`导航到: ${to.path}`);
});

// 应用启动时的重定向检查 - Vue Router 4.x 使用 isReady()
router.isReady().then(() => {
  // 检查当前URL是否包含/h5/路径
  const currentPath = window.location.pathname;
  if (!currentPath.startsWith('/h5/')) {
    // 如果当前路径不包含/h5/，重定向到正确的路径
    window.location.href = '/h5/';
  }
});

export default router;
