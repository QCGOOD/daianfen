const curriculum = [
  // 课程列表
  {
    path: '/curriculum',
    component: resolve => require(['@/view/curriculum/index'], resolve)
  },
  // 课程详情
  {
    path: '/curriculum/detail',
    component: resolve => require(['@/view/curriculum/detail'], resolve)
  },
  // 课程金句
  {
    path: '/curriculum/slectGolden',
    component: resolve => require(['@/view/curriculum/slectGolden'], resolve)
  },

]
export default curriculum;
