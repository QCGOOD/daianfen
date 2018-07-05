import http from '../../../utils/http.js'
const app = getApp();
/**
   * 预约流程
   * 请求用户信息接口--点击预约按钮--新用户--新增用户--预约
   * 请求用户信息接口--点击预约按钮--老用户--预约
**/

Page({

  data: {
    imgHead: app.globalData.imgHead,
    imgPath: '',
    date: '',
    time: '',
    uname: '',
    phone: null,
    userInfo: {},
    dateData: [],
    timeData: [],
    // 专柜id
    shopId: '',
    // 预约id
    reserveId: '',
    // tru为新用户
    isNewUser: true,
    // 是否注册
    isRegist: false,
    // 是否打开选择框
    showDate: false,
    showTime: false,
    // 是否可提交
    canISubmit: true
  },

  onLoad: function (options) {
    if(options.id){
      this.setData({shopId: options.id});
    }
    this.apiGetPoster();
    this.apiGetTimeAndDate();
    this.getUserInfo();
    this.apiGetUserInfo();
  },

  inputting(e) {
    let type = e.currentTarget.dataset.type;
    let value = e.detail.value;
    this.setData({
      [type]: value
    })
  },

  showDate(e) {
    let type = e.currentTarget.dataset.type;
    if (type === 'date') this.setData({showDate: !this.data.showDate});
    else this.setData({showTime: !this.data.showTime});
    if(this.data.showDate) this.setData({showTime: false});
    else if(this.data.showTime) this.setData({showDate: false});
    
  },

  choiceDate(e) {
    let type = e.currentTarget.dataset.type;
    let value = e.currentTarget.dataset.value;
    if (type === 'date') this.setData({[type]: value, showDate: !this.data.showDate});
    else this.setData({[type]: value, showTime: !this.data.showTime});
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
        app.toast(res.data.errMsg)
      }
    })
  },

  // 获取用户信息---判断是否是新用户
  apiGetUserInfo() {
    http.get('/member/get', {}, true).then(res => {
      // console.log('用户信息',res)
      if (res.data.errCode == 401) {
        app.login(() => {
          this.apiGetUserInfo()
        });
      } else if (res.data.errCode == 0) {
        if(!res.data.content0 || res.data.content0 == '') {
          this.setData({isNewUser: true});
        }else {
          this.setData({
            isNewUser: false, 
            isRegist: res.data.content0.isRegist,
            uname: res.data.content0.name, 
            phone: res.data.content0.phoneNo
          });
        }
      }
    })
  },

  // 提交表单数据
  submitFormData(e) {
    // 阻止连续提交
    if(!this.data.canISubmit) return false;
    let shopId = this.data.shopId;
    let date = this.data.date;
    let time = this.data.time;
    let uname = this.data.uname;
    let phone = this.data.phone;

    if(date == '' || time == '' || date == '获取日期失败' || time == '获取时间失败'|| uname == '' || !phone || phone == ''){
      app.toast('请完善信息')
    }else if( !this.isPoneAvailable(phone) ){
      app.toast('手机号有误')
    }else if(!shopId || shopId == ''){
      app.toast('店铺异常请重新选择')
    }else{
      if(this.data.isNewUser) {
        // 新用户
        this.apiSaveUserInfo();
        // console.log('新用户')
      }else{
        // 老用户
        this.apiPostReserve();
      }
    }
  },

  // 新增用户
  apiSaveUserInfo() {
    let params = {
        name: this.data.uname,
        phoneNo: this.data.phone,
        nickName: this.data.userInfo.nickName || '',
        imgUrl: this.data.userInfo.avatarUrl || ''
    };
    http.post('/member/save', params, true).then(res => {
      // console.log('新增用户',res)
      if (res.data.errCode == 401) {
        app.login(() => {
          this.apiSaveUserInfo(params)
        });
      } else if (res.data.errCode == 0) {
        this.apiPostReserve();
      }else{
        app.toast(res.data.errMsg)
      }
    })
  },

  // 预约
  apiPostReserve() {
    // 阻止连续提交
    this.setData({canISubmit: false});
    wx.showLoading({title: '加载中…'})
    let data = this.data;
    let params = {
        shopId: data.shopId,
        memberName: data.uname,
        phoneNo: data.phone,
        reservationDate: data.date,
        reservationTime: data.time
    };
    http.post('/reservation/save', params, true).then(res => {
      // console.log('预约',res)
      if (res.data.errCode == 401) {
        app.login(() => {
          this.apiPostReserve(params)
        });
      } else if (res.data.errCode == 0) {

        this.setData({ reserveId: res.data.content0.reservationId})
        // this.apiSaveUserInfo()
        wx.redirectTo({
          url: '../reserveOk/reserveOk?reserveId='+res.data.content0.reservationId
        })
      }else{
        app.toast(res.data.errMsg)
      }
    }).finally(() => {
      this.setData({canISubmit: true})
      wx.hideLoading()
    });
  },

  // 获取时间
  apiGetTimeAndDate() {
    http.get('/config/timeSelect', {}, true).then(res => {
      // console.log('日期时间',res)
      if (res.data.errCode == 401) {
        app.login(() => {
          this.apiGetTimeAndDate()
        });
      } else if (res.data.errCode == 0) {
        this.setData({
          dateData: res.data.content0.dateSlot,
          timeData: res.data.content0.timeSlot,
          date: res.data.content0.dateSlot[0],
          time: res.data.content0.timeSlot[0]
        })
      }else{
        this.setData({
          date: '获取日期失败',
          time: '获取时间失败'
        })
      }
    })
  },

  // 获取用户基本信息
  getUserInfo() {
    wx.getUserInfo({
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        app.globalData.userInfo = res.userInfo;
        this.setData({userInfo: res.userInfo})
        // console.log(res.userInfo)
      }
    })
  },
  
  getPhoneNumber: function(e) { 

  },

  apiGetPhone() {
    let params = {
      encryptedData: 'eYslDsxKRryxW7MN7CYKhn6pWhRPiuH6yyufuxl7qfnDLsv3kcNSVcq0Y/dNdrdreTak8GjLhrSkEwrVCm0lDo+JZNvLl/U0pijwZvs9yDuvH1A1IOTZ83/cy2laWSGOKcIu7S08SisZ3CYuD35D7OhgeWg607SRzCTPYM4StwBndubzky6CUfCvGN8n29M7WpytCz4aZJaqr8sBMJJeRQ==',
      iv: 'HkyBhIaUqcrDMx8mRmRf+Q==',
      // sessionKeyId: 'c0a8012062cda0d60162cda1f5890006'
    };
    http.get('/getPhoneNo', params, true).then(res => {
      // console.log('手机号',res)
      if (res.data.errCode == 401) {
        app.login(() => {
          // this.apiGetCityList()
        });
      } else if (res.data.errCode == 0) {
        this.setData({
          // cityData: res.data.content0.rows
        })
      }
    })
  },
  
   /**
  * 验证码时效;
  * that Page
  * count 倒计时间(s)
  */
  setTimeCode(that, count) {
    let countDown = count;
    let timer = setInterval(function () {
      countDown--;
      that.setData({ againTxt: '重发(' + countDown + 's)' })
      if (countDown == 0) {
        that.setData({ againTxt: '重发(' + count + 's)' })
        clearInterval(timer)
        that.setData({ isPost: false })
        return;
      }
    }, 1000)
  },

  /**
   * 11位手机号验证 函数
   * str 手机号
   * 1--以1为开头；
   * 2--第二位可为3,4,5,7,8,中的任意一位；
   * 3--最后以0-9的9个整数结尾。
   */
  isPoneAvailable(str) {
    let myReg = /^[1][0-9]{10}$/;
    if (!myReg.test(str)) {
      return false;
    } else {
      return true;
    }
  }
})