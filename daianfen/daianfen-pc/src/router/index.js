import Vue from 'vue';
import Router from 'vue-router';
import product from './product';
import activity2 from './activity2';
import activity from './activity';
import lesson from './lesson';
import level from './level';
import reserve from './reserve';
import statistical from './statistical';
import power from './power';
import coupon from './coupon';
import reserveSetting from './reserveSetting';
import guide from './guide';
import shop from './shop';
import category from './category';
import channel from './channel';
import attachment from './attachment';
import distributer from './distributer';
import member from './member';
import setting from './setting';


Vue.use(Router)

export default new Router({
  routes: [{
      path: "/",
      redirect: "/login"
    },
    {
      path: "/login",
      component: () =>
        import ('@/components/page/login/login'),
    },
    {
      path: '/main',
      component: () =>
        import ('@/components/page/main/index'),
      children: [
        // 预约管理
        ...reserve,

        // 数据统计管理
        ...statistical,
        
        // 权限管理
        ...power,

        //  系统设置
        ...setting,

        // 会员
        ...member,
        
        // 业务员
        ...distributer,
        
        // 图片
        ...attachment,

        // 分类
        ...category,

        // 商城
        ...product,
        
        // 活动
        ...activity2,

        // 活动
        ...activity,
        
        // 课程
        ...lesson,
        
        // 等级
        ...level,
        
        // 优惠券
        ...coupon,
        
        // 预约设置
        ...reserveSetting,
        
        // 专柜
        ...shop,

        // 导购
        ...guide,

        // 渠道
        ...channel,
      ]
    },
    // {
    //   name: '404',
    //   path: '/404notFound',
    //   component: () => import('@/components/notFound.vue'),
    // },
    {
      path: '*',
      redirect: '/login',
    },
  ]
})
