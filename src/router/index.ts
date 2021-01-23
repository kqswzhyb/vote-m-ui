import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import store from '../store/index'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect:'/vote',
    name: 'Layout',
    component: () => import(/* webpackChunkName: "layout" */"@/views/Layout.vue"),
    children: [
      {
        path: "/vote",
        name: "Vote",
        component: () =>
          import(/* webpackChunkName: "vote" */ "@/views/Vote.vue")
      },
      {
        path: "/vote/:id",
        name: "VoteDetail",
        component: () =>
          import(/* webpackChunkName: "voteDetail" */ "@/views/VoteDetail.vue")
      },
      {
        path: "/moe",
        name: "Moe",
        component: () =>
          import(/* webpackChunkName: "moe" */ "@/views/Moe.vue")
      },
      {
        path: "/moe/:id",
        name: "MoeDetail",
        component: () =>
          import(/* webpackChunkName: "moeDetail" */ "@/views/MoeDetail.vue")
      },
      {
        path: "/mine",
        name: "Mine",
        component: () =>
          import(/* webpackChunkName: "mine" */ "@/views/Mine.vue")
      },
      {
        path: "/message",
        name: "Message",
        component: () =>
          import(/* webpackChunkName: "message" */ "@/views/MessageCenter.vue")
      },
      {
        path: "/follow",
        name: "Follow",
        component: () =>
          import(/* webpackChunkName: "follow" */ "@/views/MyFollow.vue")
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
  routes,
});

router.beforeEach(async (to, form) => {
  const token = (store as any).state.common.token || localStorage.getItem('token');
  if (token) {
    if (Object.keys((store as any).state.user.info).length === 1) {
      await store.dispatch('user/getUserInfo');
      store.dispatch('user/getUserMessage')
      store.dispatch('user/getUserUnreadMessage')
    }
    if (to.path === '/login') {
      router.push('/')
    }
  }
});

export default router;
