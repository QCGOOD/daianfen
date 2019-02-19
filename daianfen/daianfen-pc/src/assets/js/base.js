
let daianfen = {
  title: "黛安芬后台管理",

  baseHost: 'https://triumph.wego168.com/',

  projectName: function () {
    let name = process.env.NODE_ENV === "production" ? location.origin + location.pathname.match(/^\/\w+/g)[0] + '/admin' : "/triumph/admin"
    return name
  },
  transferMember: true,
  coupon: true,
  comment: true,
}


export default daianfen
