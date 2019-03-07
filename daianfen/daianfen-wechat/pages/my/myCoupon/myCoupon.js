import http from '../../../utils/http.js'
import pageView from '../../../utils/pageView.js'
const app = getApp();
Page({

  /**
   * 优惠券状态
   * 1 已使用
   * 2 未使用
   * 3 已过期
   */
  data: {
    layoutHeight: app.globalData.layoutHeight,
    imgHead: app.globalData.imgHead,
    isRequst: false,
    state: 2,
    open: false,
    couponList: [],
    page: 1,
    size: 10,
    hasMoreData: false,
    notuseCount: 0,
    usedCount: 0,
    validCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.apiGetCouponList();
  },

  choiceState(e) {
    let state = e.currentTarget.dataset.state;
    if(state == this.data.state) return;
    this.setData({
      couponList: [],
      page: 1,
      state,
    });
    this.apiGetCouponList();
  },

  openDetail() {
    this.setData({
      open: !this.data.open
    })
  },
  
  // 优惠券列表
  apiGetCouponList() {
    wx.showLoading({title: '加载中…'})
    this.setData({isRequst: false})
    let {state, page, size, couponList} = this.data;
    let params = { useState: state, curPage: page, size: size };
    http.get('/coupons/list', params, true).then(res => {
      // console.log(res.data)
      if (res.data.errCode == 401) {
        app.login(() => {
          this.apiGetCouponList()
        });
      } else if(res.data.errCode == 0){
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        
        let resData = res.data.content0.rows;
        let total  = res.data.content0.total;
        this.setData({
          notuseCount: res.data.content0.notuseCount,
          usedCount: res.data.content0.usedCount,
          validCount: res.data.content0.validCount
        })
        resData.map((item) => {
          try {
            let regTitle = /.*\s/; // 匹配标题
            let regDetail = /\s[0-9].*/g; // 匹配详情
          //  item.title = item.content.match(regTitle);
            item.title = item.content.substr(0, item.content.indexOf(" "));
            item.content = item.content = item.content.replace(/；/g,'；\n');
            item.detail = item.content.match(regDetail).join('');
          }catch(err) {
            console.log(err)
            item.detail = item.content;
          }
        })

        // 分页
        pageView(this, page, size, 'couponList', couponList, resData, total);
        
      }else{
        wx.showTost({
          title: res.data.message, 
          icon: 'none'
        })
      }
    }).finally(() => {
      setTimeout(() => {
        this.setData({isRequst: true})
        wx.hideLoading()
      }, 300);
    });
  },

  // 下拉刷新
  onPullDownRefresh() {
    wx.showNavigationBarLoading()
    this.setData({
      couponList: [],
      page: 1,
    })
    this.apiGetCouponList()
  },

  // 上拉加载
  onReachBottom() {
    if (this.data.hasMoreData) {
      this.apiGetCouponList()
    }
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