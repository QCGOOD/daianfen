const activity2 = [
  //活动管理
  {
    path: "activity2/list",
    component: () =>
      import ('@/components/page/activity2/list/list'),
  },
  //活动发布
  {
    path: "activity2/list/release",
    component: () =>
      import ('@/components/page/activity2/list/release'),
  },
  // 活动详情
  {
    path: "activity2/list/detail",
    component: () =>
      import ('@/components/page/activity2/list/detail'),
  },
  //活动分类
  {
    path: "activity2/category",
    component: () =>
      import ('@/components/page/activity2/category/list'),
  },
  //活动标签
  {
    path: "activity2/tag",
    component: () =>
      import ('@/components/page/activity2/tag/list'),
  },

  //活动回顾
  {
    path: "activity2/review",
    component: () =>
      import ('@/components/page/activity2/review/list'),
  },
  //回顾编辑
  {
    path: "activity2/review/form",
    component: () =>
      import ('@/components/page/activity2/review/form'),
  },
  //活动回顾详情
  {
    path: "activity2/review/detail",
    component: () =>
      import ('@/components/page/activity2/review/detail'),
  },

  //活动日程
  {
    path: "activity2/schedule",
    component: () =>
      import ('@/components/page/activity2/schedule/list'),
  },
]

export default activity2
