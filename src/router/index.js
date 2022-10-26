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
        path: '',
        name: 'Home',
        component: () => import(/* webpackChunkName: "home" */ '../views/m/Home.vue'),
        meta: {
          title: '视频列表',
          keepAlive: true
        },
      },
      {
        path: 'videos',
        name: 'Videos',
        component: () => import(/* webpackChunkName: "videos" */ '../views/m/Videos.vue'),
        meta: {
          title: '视频列表',
        },
      },
      {
        path: 'more-datas',
        name: 'More-Datas',
        component: () => import(/* webpackChunkName: "more-datas" */ '../views/m/More-Datas.vue'),
        meta: {
          title: '更多数据',
          keepAlive: true
        },
      },
    ],
  },
  {
    path: '/web',
    component: webLayout,
    children: [
      {
        path: '',
        name: 'Web-Home',
        component: () => import(/* webpackChunkName: "web-home" */ '../views/Web-Home.vue'),
      },
      {
        path: 'course',
        name: 'Course',
        component: () => import(/* webpackChunkName: "web-course" */ '../views/Web-Course.vue'),
        meta: {
          title: '华氏量化高端策略-实战培训教程',
        },
      },
      {
        path: 'more-datas',
        name: 'Web-More-Datas',
        component: () => import(/* webpackChunkName: "web-more-datas" */ '../views/Web-More-Datas.vue'),
        meta: {
          title: '更多数据',
        },
      },
    ],
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/notFound.vue'),
  },
  {
    path: '*', // 此处需特别注意至于最底部
    redirect: '/404',
  },
];

const router = new VueRouter({
  mode: process.env.NODE_ENV != 'production' ? 'hash' : 'history',
  base: process.env.NODE_ENV != 'production' ? '/' : '/hslh/', // 这个配置也很重要，否则会出现页面空白情况
  scrollBehavior: () => ({ x: 0, y: 0 }),
  routes,
});

export default router;
