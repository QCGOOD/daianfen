const coupon = [
  // 优惠券领取列表
  {
    path: "coupon",
    component: () => import('@/components/page/coupon/list'),
  },
  //优惠券规则
  {
    path: "coupon/ruleList",
    component: () => import('@/components/page/coupon/ruleList'),
  },
  //优惠券列表
  {
    path: "coupon/couponList",
    component: () => import('@/components/page/coupon/couponList'),
  },
  // //优惠券详情列表
  // {
  //   path: "coupon/table",
  //   component: () => import('@/components/page/coupon/table'),
  // }
];

export default coupon;