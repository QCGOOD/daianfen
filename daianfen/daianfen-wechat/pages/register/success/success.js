import http from '../../../utils/http.js'
import gps from '../../../utils/GPS.js'
const app = getApp();

Page({

  data: {
    layoutHeight: app.globalData.layoutHeight,
    imgHead: app.globalData.imgHead,
    qrUrl: 'http://triumph-1255600302.file.myqcloud.com/attachments/image/138015363138737362.png',
    imgPath: '',
    openQR: false,
    dialog: false,
    reserveData: {},
    reserveId: '',
    couponNum: 0,
    latitude: 23.10647,
    longitude: 113.32446,
    address: '广州',
    shopName: '黛安芬',
  },
  
  onLoad: function (options) {
    this.setData({
      couponNum: options.couponNum
    })
    this.apiGetPoster();
    // this.apiGetReg()
  },
  closeDialog() {
    this.setData({dialog: false})
  },

  // 阻止事件捕获
  stopCatch() {},

  // 获取图片
  apiGetPoster() {
    http.get('/config/get', {code: 'resDressPic'}, true).then(res => {
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
        wx.showToast({
          title: res.data.errMsg,
          icon: 'none'
        })
      }
    })
  },

  // 导航
  navigation() {
    let that = this;
    // gcj02
    wx.openLocation({
      latitude: Number(that.data.latitude),
      longitude: Number(that.data.longitude),
      scale: 28,
      name: that.data.shopName
    })
    // bdo9
    // let location = gps.bd_decrypt(Number(that.data.latitude), Number(that.data.longitude))
    // wx.openLocation({
    //   latitude: location.lat,
    //   longitude: location.lon,
    //   scale: 28,
    //   name: that.data.address
    // })
  },

    // 预览图片
  previewImage() {
    wx.previewImage({
      urls: [`${this.data.qrUrl}`],
    })
  }

})