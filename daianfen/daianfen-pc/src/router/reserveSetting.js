const reserveSetting = [
  //背景图
  {
    path: "bgSetting",
    component: () =>
      import ('@/components/page/reserveSetting/bgSetting'),
  },
  // 预约时间
  {
    path: "timeSetting",
    component: () =>
      import ('@/components/page/reserveSetting/timeSetting'),
  },
  //其他
  {
    path: "otherSetting",
    component: () =>
      import ('@/components/page/reserveSetting/otherSetting'),
  },

];

export default reserveSetting;