const user = [
  // 个人资料
  {
    path: '/user/userInfo',
    component: resolve => require(['@/view/user/userInfo'], resolve),
    meta: {
      title: '个人资料'
    }
  },
  // 修改手机
  {
    path: '/user/revisePhone',
    component: resolve => require(['@/view/user/revisePhone'], resolve),
    meta: {
      title: '修改手机'
    }
  },
  // 修改个人资料
  {
    path: '/user/receiveUser',
    component: resolve => require(['@/view/user/receiveUser'], resolve),
    meta: {
      title: '修改资料'
    }
  },
  // 签到
  {
    path: '/user/sign',
    component: resolve => require(['@/view/user/sign'], resolve),
    meta: {
      title: '签到'
    }
  },
  {
    path: '/user/signs',
    component: resolve => require(['@/view/user/signs'], resolve),
    meta: {
      title: '签到'
    }
  },
  // 我的活动
  {
    path: '/user/activity',
    component: resolve => require(['@/view/user/activity'], resolve),
    meta: {
      title: '我的活动'
    }
  },
  // 我的优惠券
  {
    path: '/user/coupon',
    component: resolve => require(['@/view/user/coupon'], resolve),
    meta: {
      title: '我的优惠券'
    }
  },
  // 我的日程
  {
    path: '/user/mySchedule',
    component: resolve => require(['@/view/user/mySchedule'], resolve),
    meta: {
      title: '我的日程'
    }
  },
  // 班级列表
  {
    path: '/user/class',
    component: resolve => require(['@/view/user/class/list'], resolve),
    meta: {
      title: '我的班级'
    }
  },
  // 班级详情
  {
    path: '/user/class/detail',
    component: resolve => require(['@/view/user/class/detail'], resolve),
    meta: {
      title: '班级详情'
    }
  },
  // 我的日历
  {
    path: '/user/calendar',
    component: resolve => require(['@/view/user/calendar'], resolve),
    meta: {
      title: '我的日历'
    }
  },
  // 回顾列表
  {
    path: '/user/summary',
    component: resolve => require(['@/view/User/summary'], resolve),
    meta: {
      title: '我的回顾'
    }
  },
  // 课回顾详情
  {
    path: '/user/summaryDetail',
    component: resolve => require(['@/view/user/summaryDetail'], resolve),
    meta: {
      title: '回顾详情'
    }
  },
  // 课程小结详情
  {
    path: '/user/receive',
    component: resolve => require(['@/view/user/receive'], resolve)
  },

]
export default user;
