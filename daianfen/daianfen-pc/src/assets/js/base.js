let jiasu = {
  title: "加速商学院后台管理",

  baseHost: 'http://abs.wego168.com/',

  projectName: function () {
    let test = /accelerator_test/.test(window.location.href);
    let url = test ? "accelerator_test" : "accelerator";
    let name = process.env.NODE_ENV === "production" ? url : "accelerator_test"
    return name
  },
  transferMember: true,
  coupon: true,
  comment: true,
}

let daianfen = {
  title: "黛安芬后台管理",

  baseHost: 'https://triumph.wego168.com/',

  projectName: function () {
    let name = process.env.NODE_ENV === "production" ? 'triumph/admin' : "/triumph/admin"
    return name
  },
  transferMember: true,
  coupon: true,
  comment: true,
}

let zhongrui = {
  title: "中睿企业后台管理",

  baseHost: 'http://x.wego168.com/',

  projectName: function () {
    let name = process.env.NODE_ENV === "production" ? 'zhongrui' : "accelerator_test"
    return name
  },
}

let huaguhui = {
  title: "华古汇商城后台管理",

  baseHost: 'http://hgh.wego168.com/',

  productionProjectName: function () {
    return 'huaguhui_test'
  },
  developmentProjectName: function () {
    return 'huaguhui_test'
  },
  projectName: function () {
    let name = process.env.NODE_ENV === "production" ? 'huaguhui_test' : "accelerator_test"
    return name
  },
}

export default daianfen
// export default jiasu
// export default zhongrui
// export default huaguhui