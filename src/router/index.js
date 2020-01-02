import Vue from 'vue'
import Router from 'vue-router'
import IndexPage from '@/pages/index/index'
import InterfacePage from '@/pages/interface/interface'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'IndexPage',
      component: IndexPage
    },
    {
      path: '/interface',
      name: 'InterfacePage',
      component: InterfacePage
    }
  ]
})
