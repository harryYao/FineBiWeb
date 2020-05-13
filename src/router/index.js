import Vue from 'vue'
import Router from 'vue-router'
import IndexPage from '@/pages/index/index'
import ApiTestPage from '@/pages/apitest/index'
import LoginPage from '@/pages/login/index'
import InterfacePage from '@/pages/interface/interface'
import FeedbackQuery from '@/pages/feedbackquery/index'
import SqlQuery from '@/pages/sqlquery/index'

Vue.use(Router)

let router = new Router({
  // mode: 'history',
  base: '/webroot/',
  routes: [
    {
      path: '/',
      name: 'IndexPage',
      component: IndexPage
    },
    {
      path: '/login',
      name: 'LoginPage',
      component: LoginPage
    },
    {
      path: '/apitest',
      name: 'ApiTestPage',
      component: ApiTestPage
    },
    {
      path: '/interface',
      name: 'InterfacePage',
      component: InterfacePage
    },
    {
      path: '/feedbackquery',
      name: 'FeedbackQuery',
      component: FeedbackQuery
    },
    {
      path: '/sqlquery',
      name: 'SqlQuery',
      component: SqlQuery
    }
  ]
})

router.beforeEach((to, from, next) => {
  // console.log('beforeEach', to, from)
  if (to.matched.length === 0) {
    from.name? next({name: from.name}) : next('/'); 
  } else {
    next();
  }
});

router.afterEach((to, from) => {
  // console.log('afterEach', to, from)
})

export default router;
