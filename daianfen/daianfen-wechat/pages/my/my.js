
import http from '../../utils/http.js'
const app = getApp();
Page({

  data: {
    layoutHeight: app.globalData.layoutHeight,
    userInfo: {},
    hasUserInfo: false,
    apiUserInfo: {},
  },

  onLoad: function (options) {
    this.apiGetUserInfo();
    this.getUserInfo();
  },

  getUserInfo (e) {
    wx.getUserInfo({
      success: res => {
        // console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        wx.setStorage({
          key:"userInfo",
          data: res.userInfo
        })
      }
    }) 
  },
  apiGetUserInfo() {
    http.get('/member/get', {}, true).then(res => {
      // console.log('用户信息',res)
      if (res.data.errCode == 401) {
        app.login(() => {
          this.apiGetUserInfo()
        });
      } else if (res.data.errCode == 0) {
        this.setData({
          apiUserInfo: res.data.content0
        })
      }
    })
  }
})