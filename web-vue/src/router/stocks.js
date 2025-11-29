const stocksRoutes = [
  {
    path: "/stocks/spot/:id",
    label: "spot",
    meta: {
      commonHeader: true,
    },
    component: () => import("@/views/Stocks/spot/index.vue"),
  },
  {
    path: "/stocks/constract/:id",
    label: "constarct",
    meta: {
      commonHeader: true,
    },
    component: () => import("@/views/Stocks/constract/index.vue"),
  },
];

export { stocksRoutes };
