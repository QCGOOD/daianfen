import http from '../../utils/http.js'
var timer = null
Page({

  data: {
    isSendCode: false,
    second: 6,
    barActive: 0,
    pantyActive: 1,
    showMore: false,
    model: {
      uname: '',
      mobile: '',
      code: '',
      barSize: '70A',
      pantySize: 'M'
    },
    barList: [
      '70A', '70B', '70C', '70D', '70E',
      '75A', '75B', '75C', '75D', '75E',
      '80A', '70B', '70C', '80D', '80E',
      '75A', '85B', '80C', '85D', '85E',
      '90A', '90B', '90C', '90D', '90E',
      '95A', '95B', '95C', '95D', '95E',
    ],
    pantyList: ['S', 'M', 'L', 'EL', 'EEL'],
  },

  onLoad(options) {
  
  },
  onHide() {
    clearInterval(timer)
  },
  // 正在输入
  bindKeyInput(e) {
    let type = e.currentTarget.dataset.key;
    let value = e.detail.value;
    let key = `model.${type}`;
    this.setData({
      [key]: value
    })
  },
  // 提交
  submit() {
    console.log(this.data.model)
  },
  // 发送验证码
  sendCode() {
    if (this.data.model.mobile == '') {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
      return false;
    }
    this.countDown()
  },
  showMore() {
    this.setData({
      showMore: !this.data.showMore
    })
  },
  // 选择文胸尺寸
  pickBar(e) {
    let obj = e.currentTarget.dataset;
    if(this.barActive == obj.i) return false;
    let barSize = 'model.barActive';
    this.setData({
      barActive: obj.i,
      [barSize]: obj.size
    })
  },
  // 选择内裤尺寸
  pickPanty(e) {
    let obj = e.currentTarget.dataset;
    if(this.data.pantyActive == obj.i) return false;
    let pantySize = 'model.pantySize';
    this.setData({
      pantyActive: obj.i,
      [pantySize]: obj.size
    })
  },
  // 验证码倒计时
  countDown() {
    let second = this.data.second
    this.setData({isSendCode: true})
    timer = setInterval(() => {
      second --
      this.setData({second: second})
      if(second < 1){
      clearInterval(timer)
      this.setData({
        isSendCode: false,
        second: 6
      })
      return;
    }
    },1000)
  }

})