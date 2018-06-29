import Vue from 'vue'
import Router from 'vue-router'
import activity from "./activity";
import user from "./user";
import curriculum from "./curriculum";
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
    // 活动的路由
    ...activity,
    // 课程路由
    ...curriculum,
    // 用户的路由
    ...user,
    // 我的
    {
      path: '/user',
      component: resolve => require(['@/view/user/index'], resolve),
      meta: {
        title: '个人中心'
      }
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
    // 订单确认
    {
      path: '/order/confirm',
      component: resolve => require(['@/view/order/confirm'], resolve),
      meta: {
        title: '活动报名'
      }
    },
    {
      path: '/order/success',
      component: resolve => require(['@/view/order/success'], resolve),
      meta: {
        title: '活动报名'
      }
    },
    // 课程报名
    {
      path: '/order/lessonConfrim',
      component: resolve => require(['@/view/order/lessonConfrim'], resolve),
      meta: {
        title: '课程报名'
      }
    },
    // 课程报名成功
    {
      path: '/order/lessonSuccess',
      component: resolve => require(['@/view/order/lessonSuccess'], resolve)
    },
    // 试听券领取成功
    {
      path: '/order/couponSuccess',
      component: resolve => require(['@/view/order/couponSuccess'], resolve)
    },
    // 帮助
    {
      path: '/user/help',
      component: resolve => require(['@/components/User/help'], resolve)
    },
    // 历史
    {
      path: '/user/history',
      component: resolve => require(['@/components/User/history'], resolve)
    },
    // 适用活动
    {
      path: '/user/fitActivity',
      component: resolve => require(['@/view/user/fitActivity'], resolve),
      meta: {
        title: '适用活动'
      }
    },
    // 收藏
    {
      path: '/user/collect',
      component: resolve => require(['@/components/User/collect'], resolve)
    },

    // 排行
    {
      path: '/user/rank',
      component: resolve => require(['@/components/User/rank'], resolve)
    },
    // 领券
    {
      path: '/receiveSuccess',
      component: resolve => require(['@/components/receiveSuccess'], resolve)
    },
    // 适用活动
    {
      path: '/user/coupon/apply',
      component: resolve => require(['@/components/User/apply'], resolve)
    },
  ],

})
