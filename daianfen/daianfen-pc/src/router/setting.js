const setting = [
  //系统报名字段管理
  {
    path: "signDataSetting",
    component: () =>
      import ('@/components/page/setting/signDataSetting'),
  },

  //引导关注
  {
    path: "follow",
    component: () =>
      import ('@/components/page/setting/follow'),
  }
];

export default setting;