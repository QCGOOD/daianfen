import http from '../../utils/http.js'
const app = getApp()
var timer = null
Page({

  data: {
    isSendCode: false,
    canISubmit: true,
    second: 59,
    barActive: 0,
    pantyActive: 1,
    showMore: false,
    info: {},
    model: {
      name: '',
      phoneNo: '',
      code: '',
      sex: 2,
      birthday: '',
      barSize: '',
      pantySize: ''
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
  // 提交
  submit() {
    if (this.data.model.name == '') {
      app.toast('请输入姓名')
    }else if(this.data.model.phoneNo == '') {
      app.toast('请输入手机')
    }else if(this.data.model.code == '') {
      app.toast('请输入验证码')
    }else if(this.data.model.birthday == '') {
      app.toast('请选择生日')
    // }else if(this.data.model.pantySize == '') {
    //   app.toast('请选择文胸尺寸')
    // }else if(this.data.model.pantySize == '') {
    //   app.toast('请选择内裤尺寸')
    }else{
      this.apiRegist(this.data.model)
    }
  },
  // 获取验证码
  apiSendCode(model) {
    http.post('/sendCode', model, true).then(res => {
      // console.log('验证码',res.data)
      if (res.data.errCode == 401) {
        app.login(() => {
          this.apiSendCode(model)
        });
      } else if (res.data.errCode == 0) {
        // do something
        this.countDown()
      }else{
        app.toast(res.data.errMsg)
      }
    })
  },
  // 注册
  apiRegist(model) {
    wx.showLoading()
    this.setData({canISubmit: false})
    http.post('/member/regist', model, true).then(res => {
      // console.log('注册',res.data)
      if (res.data.errCode == 401) {
        app.login(() => {
          this.apiRegist(model)
        });
      } else if (res.data.errCode == 0) {
        // do something
        setTimeout(() => {
          wx.redirectTo({
            url: 'success/success?couponNum='+res.data.content0
          })
        }, 500);
      }else{
        app.toast(res.data.errMsg)
      }
    }).finally(() => {
      this.setData({canISubmit: true})
      setTimeout(() => {
        wx.hideLoading()
      }, 500)
    });
  },
  // 发送验证码
  sendCode() {
    if (this.data.model.phoneNo == '') {
      app.toast('手机号不能为空')
      return false;
    }
    this.apiSendCode({mobile: this.data.model.phoneNo})
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
  // 选择生日
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let birthday = 'model.birthday';
    this.setData({
      [birthday]: e.detail.value
    })
  },
  // 性别
  switchChange: function (e){
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
    let sex = 'model.sex';
    
    if (e.detail.value) {
      this.setData({
        [sex]: 1
      })
    } else {
      this.setData({
        [sex]: 2
      })
    }
  },

  // 展开更多
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
        second: 59
      })
      return;
    }
    },1000)
  }

})