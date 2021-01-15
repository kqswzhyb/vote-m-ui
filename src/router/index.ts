import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Vote",
    component: () =>
    import(/* webpackChunkName: "vote" */ "@/views/Vote.vue")
  },
  {
    path: "/moe",
    name: "Moe",
    component: () =>
      import(/* webpackChunkName: "moe" */ "@/views/Moe.vue")
  },
  {
    path: "/mine",
    name: "Mine",
    component: () =>
      import(/* webpackChunkName: "mine" */ "@/views/Mine.vue")
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
