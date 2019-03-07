import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const BASE = '/accelerator/mobile'

export default new Router({
  // mode: 'history',
  // base: BASE,
  routes: [
    {
      path: '/',
      redirect: '/login',
      component: resolve => require(['@/view/login/login'], resolve),
      children: [
        // 登录
        {
          path: '/login',
          component: resolve => require(['@/view/login/login'], resolve),
          meta: {
            title: '黛安芬预约管理'
          }
        },
        
      ]
    },
    {
      path: '/index',
      component: resolve => require(['@/view/index/index'], resolve),
      meta: {
        title: '黛安芬预约管理'
      }
    },
    {
      path: '/index/detail',
      component: resolve => require(['@/view/index/detail'], resolve),
      meta: {
        title: '预约详情'
      }
    },
    {
      path: '/index/addRemark',
      component: resolve => require(['@/view/index/addRemark'], resolve),
      meta: {
        title: '添加备注'
      }
    },
    {
      path: '/index/examine',
      component: resolve => require(['@/view/index/examine'], resolve),
      meta: {
        title: '核销优惠券'
      }
    },
  ],

})
