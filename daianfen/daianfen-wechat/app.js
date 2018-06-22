import http from '/utils/http.js'
App({
  onLaunch: function () {
    // 展示本地存储能力
    this.globalData.layoutHeight = wx.getSystemInfoSync().windowHeight - 30;
    this.userLoing();
  },
  userLoing() {
    wx.login({
      success: login => {
        // console.log(login)
        this.apiLogin(login.code);
      }
    })
  },
  apiLogin(code) {
    // var params;
    // if (nickName && imgUrl) params = { code, nickName, imgUrl };
    // else params = { code };
    // let params = { code, nickName, imgUrl }
    http.post('/login', { code }).then(res => {
      // console.log(res)
      wx.setStorageSync('sessionKeyId', res.data.sessionKeyId);
      // console.log('sessionKeyId=========>',res.data.sessionKeyId);
    })
  },
  login(callback) {
    wx.login({
      success: rej => {
        http.post('/login',{code: rej.code}).then(res => {
          wx.setStorageSync('sessionKeyId', res.data.sessionKeyId);
          callback(res)
        })
      }
    })
  },
  globalData: {
    userInfo: null,
    layoutHeight:0,
    imgHead: 'http://triumph-1255600302.file.myqcloud.com'
  }
})