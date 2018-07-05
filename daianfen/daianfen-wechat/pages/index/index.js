import http from '../../utils/http.js'
//获取应用实例
const app = getApp()

Page({
  data: {
    layoutHeight: app.globalData.layoutHeight,
    imgHead: app.globalData.imgHead,
    imgPath: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.apiGetPoster();
    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo','scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              // 用户已经同意小程序使用此功能，后续调用 接口不会弹窗询问
              // wx.startRecord()
            }
          })
        }
      }
    })
  },

  // 获取图片
  apiGetPoster() {
    http.get('/config/get', {code: 'resIndexPic'}, true).then(res => {
      // console.log('获取图片',res.data)
      if (res.data.errCode == 401) {
        app.login(() => {
          this.apiGetPoster()
        });
      } else if (res.data.errCode == 0) {
        this.setData({
          imgPath: res.data.content0.content
        })
      }else{
        app.toast(res.data.errMsg)
      }
    })
  },

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  // 转发
  onShareAppMessage: function (res) {
    console.log(res)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
      
    }
    return {
      title: '预约试穿，乐享优惠',
      imageUrl: '/static/images/poster.png',
      path: '/pages/index/index',
      success: function(res2) {
        // 转发成功
        // console.log(res2)
      },
      fail: function(res) {
        // 转发失败
      }
    }
  }
})
