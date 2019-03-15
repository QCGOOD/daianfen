import http from '../../../utils/http.js'
import pageView from '../../../utils/pageView.js'
const app = getApp();

Page({

  data: {
    layoutHeight: app.globalData.layoutHeight,
    userInfo: {},
    reverseData: [],
    page: 1,
    size: 10,
    hasMoreData: false
  },

  onLoad: function (options) {
    this.apiGetReserveList();
    wx.getStorage({
      key: 'userInfo',
      success: res => {
        // console.log(res.data)
        this.setData({
          userInfo: res.data
        })
      } 
    })
  },

  // 取消预约
  cancelReserve(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let list = this.data.reverseData;
    let reserveId = list[index].id;
    
    if( list[index].state != 1 ) return;

     wx.showModal({
      title: '提示',
      content: '取消将会消耗一次预约机会，是否确认取消？',
      success: function(res) {
        if (res.confirm) {
          that.apiCancelReserve(reserveId, index);
        }
      }
   })
  },

  // 取消预约
  apiCancelReserve(id, index) {
    http.post('/reservation/cancel', {id: id}, true).then(res => {
      // console.log(res.data)
      if (res.data.errCode == 401) {
        app.login(() => {
          this.apiCancelReserve()
        });
      } else if(res.data.errCode == 0){
        let list = this.data.reverseData;
        list.splice(index, 1);
        this.setData({
          reverseData: list
        })
        app.toast('取消成功')
      }else{
        app.toast(res.data.errMsg)
      }
    })
  },

  // 记录列表
  apiGetReserveList() {
    wx.showLoading({title: '加载中…'})
    let {page, size, reverseData} = this.data;
    let params = {curPage: page, size: size };

    http.get('/reservation/list', params, true).then(res => {
      // console.log(res.data)
      if (res.data.errCode == 401) {
        app.login(() => {
          this.apiGetReserveList()
        });
      } else if(res.data.errCode == 0){   
        if (res.data.content0 && res.data.content0.rows) {
          let resData = res.data.content0.rows;
          let total  = res.data.content0.total || 0;
          // 分页
          pageView(this, page, size, 'reverseData', reverseData, resData, total);
        }     
      }else{
        app.toast(res.data.errMsg)
      }
    }).finally(() => {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
      setTimeout(() => {
        wx.hideLoading()
      }, 500);
    });
  },

   // 下拉刷新
   onPullDownRefresh() {
    wx.showNavigationBarLoading()
    this.setData({
      reverseData: [],
      page: 1,
    })
    this.apiGetReserveList()
  },

  // 上拉加载
  onReachBottom() {
    if (this.data.hasMoreData) {
      this.apiGetReserveList()
    }
  },

  // 转发
  onShareAppMessage: function (res) {
    // console.log(res)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
      
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