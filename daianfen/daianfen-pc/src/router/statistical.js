const statistical = [
  //PV,UV
  {
    path: "statistical",
    component: () =>
      import ('@/components/page/statistical/pvAndUv'),
  },
  //预约汇总
  {
    path: "statistical/totalReserve",
    component: () =>
      import ('@/components/page/statistical/totalReserve'),
  },
]

export default statistical
