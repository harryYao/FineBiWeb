import Vue from 'vue';
import Router from 'vue-router';
import IndexPage from '@/pages/index/index';
import LoginPage from '@/pages/login/index';

const TestPage = () => import(/* webpackChunkName: 'skintest' */'@/pages/testpage/index');
const MobileTestPage = () => import(/* webpackChunkName: 'skintest' */'@/pages/testpage/mobile');

Vue.use(Router);

const router = new Router({
  base: '/webroot/',
  routes: [
    {
      path: '/',
      name: 'IndexPage',
      component: IndexPage,
      children: [
        {
          path: '/testpage',
          component: TestPage,
        },
      ],
    },
    {
      path: '/login',
      name: 'LoginPage',
      component: LoginPage,
    },
    {
      path: '/mobiletest',
      name: 'mobiletest',
      component: MobileTestPage,
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.matched.length === 0) {
    from.name ? next({ name: from.name }) : next('/');
  } else {
    next();
  }
});

export default router;
