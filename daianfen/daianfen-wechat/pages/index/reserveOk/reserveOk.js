import http from '../../../utils/http.js'
import gps from '../../../utils/GPS.js'
const app = getApp();

Page({

  data: {
    layoutHeight: app.globalData.layoutHeight,
    imgHead: app.globalData.imgHead,
    // qrUrl: 'http://triumph-1255600302.file.myqcloud.com/attachments/image/143106066387782735.jpg',
    // qrUrl: 'http://triumph-1255600302.file.myqcloud.com/attachments/image/006pF2YMzy7bQ58ePjV8f%26690.jpg',
    qrUrl: 'http://triumph-1255600302.file.myqcloud.com/attachments/image/138015363138737362.png',
    imgPath: '',
    openQR: false,
    dialog: true,
    reserveData: {},
    reserveId: 'c0a8012062cdf7850162ce61b87f0035',
    couponNum: 0,
    latitude: 23.10647,
    longitude: 113.32446,
    address: '广州',
    shopName: '黛安芬',
  },
  
  onLoad: function (options) {
    this.setData({
      reserveId: options.reserveId
    })
    this.apiGetPoster();
    this.apiGetReserve(options.reserveId)
    // this.apiGetReserve(this.data.reserveId)
    // console.log('预约id====>',options.reserveId)
  },
  closeDialog() {
    this.setData({dialog: false})
  },
  // 打开二维码弹窗
  openQR() {
    this.setData({openQR: true})
  },
  // 关闭二维码弹窗
  closeQR() {
    this.setData({openQR: false})
  },
  // 阻止事件捕获
  stopCatch() {},

  // 获取图片
  apiGetPoster() {
    http.get('/config/get', {code: 'resSuccessPic'}, true).then(res => {
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

  // 获取预约信息
  apiGetReserve(id) {
    http.get('/reservation/get', { id }, true).then(res => {
      // console.log('预约详情',res)
      if (res.data.errCode == 401) {
        app.login(() => {
          this.apiGetReserve(id)
        });
      } else if (res.data.errCode == 0) {
        this.setData({
          reserveData: res.data.content0.reservation,
          couponNum: res.data.content0.couponsCount,
          latitude: res.data.content0.reservation.latitude,
          longitude: res.data.content0.reservation.longitude,
          address: res.data.content0.reservation.address,
          shopName: res.data.content0.reservation.shopName
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