import Vue from 'vue';
import VueRouter from 'vue-router';
import mLayout from '../views/m/layout.vue';
import webLayout from '../views/layout.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: mLayout,
    children: [
      {
        path: '/',
        name: 'Home',
        component: () => import(/* webpackChunkName: "home" */ '../views/m/Home.vue'),
        meta: {
          title: '视频列表'
        }
      },
      {
        path: '/videos',
        name: 'Videos',
        component: () => import(/* webpackChunkName: "videos" */ '../views/m/Videos.vue'),
        meta: {
          title: '视频列表'
        }
      }
    ]
  },
  {
    path: '/web',
    component: webLayout,
    children: [
      {
        path: '/',
        name: 'Home',
        component: () => import(/* webpackChunkName: "web-home" */ '../views/Home.vue')
      }
    ]
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/notFound.vue')
  },
  {
    path: '*', // 此处需特别注意至于最底部
    redirect: '/404'
  }
];

const router = new VueRouter({
  scrollBehavior: () => ({ x: 0, y: 0 }),
  routes
});

export default router;
