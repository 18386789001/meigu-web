const rwaRoutes = [
  {
    path: "/rwa",
    label: "rwa-list",
    meta: {
      commonHeader: true,
    },
    component: () => import("@/views/rwa/index.vue"),
  },
  {
    path: "/rwa/spot/:id",
    label: "rwa-spot",
    meta: {
      commonHeader: true,
    },
    component: () => import("@/views/rwa/spot/index.vue"),
  },
];

export { rwaRoutes };
