const activity = [
  // 活动列表
  {
    path: '/activity/list',
    component: resolve => require(['@/view/activity/list'], resolve),
    meta: {
      title: '活动列表'
    }
  },
  // 活动详情
  {
    path: '/activity/detail',
    component: resolve => require(['@/view/activity/detail'], resolve),
    // meta: {
    //   title: '活动详情'
    // }
  },
  // 活动日历
  {
    path: '/activity/calendar',
    component: resolve => require(['@/view/activity/calendar'], resolve),
    meta: {
      title: '活动日历'
    }
  },
  // 已报名
  {
    path: '/activity/sign',
    component: resolve => require(['@/view/activity/sign'], resolve),
    meta: {
      title: '已报名'
    }
  },
]
export default activity;
