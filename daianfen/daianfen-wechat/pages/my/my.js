
import http from '../../utils/http.js'
const app = getApp();
Page({

  data: {
    layoutHeight: app.globalData.layoutHeight,
    userInfo: {},
    apiUserInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  onLoad: function (options) {
    this.apiGetUserInfo();
    this.getUserInfo()
  },

  getUserInfo (e) {
    wx.getUserInfo({
      withCredentials: false,
      success: res => {
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
  onGetUserInfo(e) {
    let data = e.detail;
    if (data.userInfo) {
      this.setData({
        userInfo: data.userInfo,
        hasUserInfo: true
      })
      wx.setStorageSync('userInfo', data.userInfo)
    }
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