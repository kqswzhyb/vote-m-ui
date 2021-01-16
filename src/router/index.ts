import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import store from '../store/index'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Layout',
    component: () => import(/* webpackChunkName: "layout" */"@/views/Layout.vue"),
    children: [
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
      },
    ]
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "login" */ "@/views/Login.vue")
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach(async (to, form) => {
  const token = (store as any).state.common.token || localStorage.getItem('token');
  if (token) {
    if (Object.keys((store as any).state.user.info).length === 1) {
      await store.dispatch('user/getUserInfo');
    }
    if (to.path === '/login') {
      router.push('/')
    }
  }
});

export default router;
