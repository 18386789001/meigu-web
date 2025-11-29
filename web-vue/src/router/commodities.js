/**
 * 大宗商品路由配置
 * Commodities Routes
 */

const commoditiesRoutes = [
  // 大宗商品行情列表页
  {
    path: "/commodities/market",
    name: "CommoditiesMarket",
    meta: {
      commonHeader: true,
    },
    component: () => import("@/views/commodities/market.vue"),
  },

  // 大宗商品现货交易页（K线页面）
  {
    path: "/commodities/spot/:id",
    name: "CommoditiesSpot",
    meta: {
      commonHeader: true,
    },
    component: () => import("@/views/commodities/spot/index.vue"),
  },

  // 大宗商品合约交易页（K线页面）
  {
    path: "/commodities/constract/:id",
    name: "CommoditiesConstract",
    meta: {
      commonHeader: true,
    },
    component: () => import("@/views/commodities/constract/index.vue"),
  },
];

export { commoditiesRoutes };
