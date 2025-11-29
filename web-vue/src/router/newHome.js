/**
 * 新首页路由配置
 */

export const newHomeRoutes = [
  {
    path: '/new-home',
    name: 'newHome',
    component: () => import('@/views/_new/home/index.vue'),
    meta: {
      title: 'Coinstore - One Touch To Crypto',
      description: 'Leading cryptocurrency exchange platform'
    }
  }
];
