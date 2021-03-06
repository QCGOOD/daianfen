import http from '../../../utils/http.js'
const app = getApp();

Page({

  data: {
    layoutHeight: app.globalData.layoutHeight,
    reserveData: {},
    reserveId: '',
  },

  onLoad: function (options) {
    this.setData({
      reserveId: options.id
    })
    this.apiReserveDetail();
  },

  // 预约详情
  apiReserveDetail() {
    http.get('/reservation/get', {id: this.data.reserveId}, true).then(res => {
      if (res.data.errCode == 401) {
        app.login(() => {
          this.apiReserveDetail()
        });
      } else if(res.data.errCode == 0){
        this.setData({
          reserveData: res.data.content0.reservation
        })
      }else{
        app.toast(res.data.errMsg)
      }
    })
  },

  // 确认到店
  confirmShop(e) {
    let reserveId = this.data.reserveId;
    if( this.data.reserveData.state != 1 ) return;
      wx.showModal({
      title: '提示',
      content: '确认将会立即生效，是否确认到店？',
      success: res => {
        if (res.confirm) {
          this.apiConfirmShop(reserveId);
        }
      }
    })
  },

  // 取消预约
  cancelReserve(e) {
    let reserveId = this.data.reserveId;
    if( this.data.reserveData.state != 1 ) return;
      wx.showModal({
      title: '提示',
      content: '取消将会消耗一次预约机会，是否确认取消？',
      success: res => {
        if (res.confirm) {
          this.apiCancelReserve(reserveId);
        }
      }
    })
  },

  // 确认到店
  apiConfirmShop(id) {
    http.post('/reservation/updateState', {reservationId: id}, true).then(res => {
      if (res.data.errCode == 401) {
        app.login(() => {
          this.apiConfirmShop(id)
        });
      } else if(res.data.errCode == 0){
        app.toast('确认成功')
        setTimeout(() => {
          wx.redirectTo({
            url: '../myReserve/myReserve'
          })
        }, 500);
      }else{
        app.toast(res.data.errMsg)
      }
    })
  },

  // 取消预约
  apiCancelReserve(id) {
    http.post('/reservation/cancel', {id: id}, true).then(res => {
      if (res.data.errCode == 401) {
        app.login(() => {
          this.apiCancelReserve(id)
        });
      } else if(res.data.errCode == 0){
        app.toast('取消成功')
        setTimeout(() => {
          wx.redirectTo({
            url: '../myReserve/myReserve'
          })
        }, 500);
      }else{
        app.toast(res.data.errMsg)
      }
    })
  },
    // 导航
  navigation() {
    // let that = this;
    let reserveData = this.data.reserveData;
    let lat = Number(reserveData.latitude);
    let lon = Number(reserveData.longitude);
    let address = reserveData.shopName;

    // gcj02
    wx.openLocation({
      latitude: lat,
      longitude: lon,
      scale: 28,
      name: address
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


})