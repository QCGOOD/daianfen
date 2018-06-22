const channel = [
  // 渠道商
  {
    path: "channel",
    component: () =>
      import ('@/components/page/channel/list'),
  },
  // 渠道
  {
    path: "channelCode",
    component: () =>
      import ('@/components/page/channelCode/list'),
  },

];

export default channel;