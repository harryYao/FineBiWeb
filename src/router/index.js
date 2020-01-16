import Vue from 'vue'
import Router from 'vue-router'
import IndexPage from '@/pages/index/index'
import ApiTestPage from '@/pages/apitest/index'
import LoginPage from '@/pages/login/index'
import InterfacePage from '@/pages/interface/interface'

Vue.use(Router)

let router = new Router({
  mode: 'history',
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
    }
  ]
})

router.beforeEach((to, from, next) => {
  // console.log('beforeEach', to, from)
  next()
});

router.afterEach((to, from) => {
  // console.log('afterEach', to, from)
})

export default router;
