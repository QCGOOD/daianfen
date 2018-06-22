import http from '../../../utils/http.js'
import gps from '../../../utils/GPS.js'

const app = getApp();
// 引入SDK核心类
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({

  data: {
    layoutHeight: app.globalData.layoutHeight,
    imgHead: app.globalData.imgHead,
    imgPath: '',
    cityData: [],
    storeData: [],
    city: '',
    shopId: '',
    shopName: '',
    showCity: false,
    // 维度
    latitude: '',
    // 经度
    longitude: '',
  },

  onLoad: function (options) {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'WTHBZ-BZT36-YX6SJ-M5AJW-BGSDF-YVBT4'
    });

    this.apiGetPoster();
    this.getLocation();
    this.apiGetCityList();
  },

  // 获取当前位置
  getLocation() {
    let that = this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function(res) {
        // console.log('定位成功')
        let latitude = res.latitude
        let longitude = res.longitude
        // gcj02 to bd09 
        // let location = gps.bd_decrypt(latitude, longitude)
        let city = wx.getStorageSync('city');
        if (city && city != ''){
            that.apiGetStoreList(city, latitude, longitude);
            console.log('我来自缓存===》',city);
            that.setData({
              city: city
            })
        } else {
          // 调用腾讯地图接口
          qqmapsdk.reverseGeocoder({
            location: {
              latitude: latitude,
              longitude: longitude
            },
            success: function(res) {
              // let city = res.result.address_component.city.replace(/市$/,'')
              let qqCity = res.result.address_component.city
              // 获取店铺
              that.apiGetStoreList(qqCity, latitude, longitude);
              // 百度
              // that.apiGetStoreList(city, location.lat, location.lon);
              console.log('我来自qq===》',qqCity);
              that.setData({
                city: qqCity
              })
              wx.setStorage({
                key:"city",
                data: qqCity
              })
            },
            fail: function(res) {
              this.setData({
                city: '获取定位失败'
              })
            }
          });
        }

        that.setData({
          latitude: latitude, 
          longitude: longitude
        })
        // bdo9
        // that.setData({
        //   latitude: location.lat, 
        //   longitude: location.lon
        // })
      },
      fail: function(res) {
        that.setData({
          city: '获取定位失败'
        })
      }
    })
  },

  // 选择城市列表
  showCity() {
    this.setData({showCity: !this.data.showCity})
  },

  // 选择店铺
  choiceShop(e) {
    let shopId = e.currentTarget.dataset.id;
    let shopName = e.currentTarget.dataset.name;
    this.setData({shopId, shopName})
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 500
    })
  },

  // 选择城市
  choiceCity(e) {
    let city = e.currentTarget.dataset.value;
    this.setData({ 
      city, 
      shopId: '',
      shopName: '',
      showCity: false 
    })
    this.apiGetStoreList(city, this.data.latitude, this.data.longitude);
  },

  // 搜索专柜
  inputting(e) {
    this.setData({
      shopName: e.detail.value,
      shopId: ''
    })
    this.apiGetStoreList(this.data.city, this.data.latitude, this.data.longitude);
  },

  // 跳转到选择时间页面
  nextStep() {
    let shopId = this.data.shopId;
    if(!shopId || shopId == ''){
      wx.showToast({
        title: '专柜有误',
        icon: 'none',
        duration: 1000
      })
    }else{
      wx.navigateTo({
        url: '../bespeakTime/bespeakTime?id='+shopId,
      })
    }
  },

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

  apiGetCityList() {
    http.get('/shop/getCityList', {}, true).then(res => {
      // console.log('城市列表',res)
      if (res.data.errCode == 401) {
        app.login(() => {
          this.apiGetCityList()
        });
      } else if (res.data.errCode == 0) {
        this.setData({
          cityData: res.data.content0.rows
        })
      }
    })
  },
  // 获取店铺列表
  apiGetStoreList(city, lat, lng) {
    if(city == '' || lat == '' || lng == '' || city == '获取定位失败') {
      wx.showToast({title: '请授权我们获取您的位置', icon: 'none'})
      wx.openSetting({
        success: (res) => {
          if(res.authSetting['scope.userLocation']){
            this.getLocation();
          }
        }
      });
      return;
    };
    let params = {
      city: city,
      name: this.data.shopName,
      lat: lat,
      lng: lng
    };
    http.get('/shop/getAroundShopList', params, true).then(res => {
      // console.log('店铺列表',res)
      if (res.data.errCode == 401) {
        app.login(() => {
          this.apiGetStoreList(lat, lng)
        });
      } else if (res.data.errCode == 0) {
        this.setData({
          storeData: res.data.content0.rows
        })
      }
    })
  }

})