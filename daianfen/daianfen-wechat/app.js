import http from '/utils/http.js'
App({
  onLaunch: function () {
    // 获取新版本
    this.getUpdate()
    // 登录
    this.userLoing();
    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo','scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              // 用户已经同意小程序使用此功能，后续调用 接口不会弹窗询问
            }
          })
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
            }
          })
        }
      }
    })
    // 展示本地存储能力
    this.globalData.layoutHeight = wx.getSystemInfoSync().windowHeight - 30;
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
  // 提示框
  toast(text, icon) {
    wx.showToast({
      title: text,
      icon: icon || 'none'
    })
  },
  // 获取新版本
  getUpdate() {
    try {
      const updateManager = wx.getUpdateManager();
      updateManager.onUpdateReady(function() {
        wx.showModal({
          title: "更新提示",
          content: "新版本已经准备好，是否重启应用？",
          success(res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate();
            }
          }
        });
      });
    } catch (err) {}
  },
  globalData: {
    userInfo: null,
    layoutHeight:0,
    imgHead: 'http://triumph-1255600302.file.myqcloud.com'
  }
})