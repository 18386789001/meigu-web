const coinRoutes = [
  {
    path: "/coin/spot/:id",
    label: "spot",
    meta: {
      commonHeader: true,
    },
    component: () => import("@/views/coin/spot/index.vue"),
  },
  {
    path: "/coin/constract/:type/:id",
    label: "contract",
    meta: {
      commonHeader: true,
    },
    component: () => import("@/views/coin/constract/index.vue"),
  },
];

export { coinRoutes };
