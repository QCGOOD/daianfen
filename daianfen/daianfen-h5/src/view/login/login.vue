<template>
  <div class="wrap">
    <div class="banner">
      <img src="@/assets/image/poster.png" alt="">
    </div>
    <div class="content">
      <div class="section">
        <i class="iconfont icon-shoujihaoma"></i>
        <input type="text" v-model.number="model.loginPhoneNumber" maxlength="11" placeholder="请输入手机号">
      </div>
      <div class="section">
        <i class="iconfont icon-yanzhengma"></i>
        <input type="text" v-model.number="model.validateCodeByMember" placeholder="请输入验证码">
        <div class="code" v-if="!send" @click="sendCode()">获取验证码</div>
        <div class="code" v-else style="border-color:#d9d9d9;color:#aaa;">重发{{second}}s</div>
      </div>
      <x-button class="login" type="warn" @click.native="login">登录</x-button>
      <div class="logo">
        <img src="@/assets/image/logo.png" alt="">
      </div>
    </div>
    <!-- <qc></qc> -->
  </div>
</template>

<script>
import { XButton } from 'vux'
export default {
  components: {
    XButton
  },
  data() {
    return {
      model: {
        loginPhoneNumber: '',
        validateCodeByMember: ''
      },
      timer: null,
      send: false,
      second: 30
    };
  },
  created() {
    // this.apiGetImage();
    // this.apiGetCategorys();
    // this.apiGetActives();
    // this.apiHasOpenId()
    this.apiChooseLogin()
  },
  mounted() {
    window.onresize = () => {
      
    };
  },
  methods: {
    getUrlParam(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r != null){
        alert(r)
        return unescape(r[2]);
      }else{
        return null;
      }
    },
    // apiHasOpenId() {
    //   // 授权接口
    //   this.$http.get('/accredit')
    //   .then(res => {
    //     this.apiChooseLogin()
    //   })
    // },
    apiChooseLogin() {
      // 选择登录方式
      this.$http.post('/choose')
      .then(res => {
        if(res.data.content0.hasOpenId) {
          localStorage.setItem('userInfo', JSON.stringify(res.data.content0))
          // 已授权
          this.$router.replace('/index')
        }else{
          // 未授权
          // this.apiHasOpenId()
        }
        
      })
    },
    apiSendCode() {
      // 发送验证码
      this.$http.post('/validate_code', {loginPhoneNumber: this.model.loginPhoneNumber})
      .then(res => {
        this.countDown()
      })
    },
    apiLogin(data) {
      this.$http.post('/login', data)
      .then(res => {
        this.toast('登录成功')
        sessionStorage.setItem('userInfo', JSON.stringify(res.data.content0))
        setTimeout(() => {
          this.$router.replace('/index')
        }, 500)
      })
    },
    login() {
      if(this.model.loginPhoneNumber === '' || this.model.validateCodeByMember === '') {
        this.toast('手机号或验证码不能为空')
        return false;
      }
      this.apiLogin(this.model)
    },
    sendCode() {
      // 发送验证码
      if(this.model.loginPhoneNumber == ''){
        this.toast('请输入手机号')
        return;
      }
      this.apiSendCode()
    },
    countDown() {
      // 倒计时
      this.send = true
      this.timer = setInterval(() => {
        this.second --
        // console.log('执行了', this.second)
        if(this.second <= 0){
        clearInterval(this.timer)
        this.send = false
        this.second = 6
        return;
      }
      },1000)
    }
  },
  destroyed() {
    clearInterval(this.timer)
  }
}
</script>
<style lang="less" scoped>
.wrap{
  min-height: 100vh;
  background: #fff;
  overflow: hidden;
}
.banner{
  width:100vw;
  height:53vw;
  overflow: hidden;
  background-color:#f2f2f2;
  img{
    width:100%;
  }
}
.content{
  padding-bottom: 10vw;
  .section{
    display: flex;
    // justify-content: space-around;
    align-items: center;
    width: 78vw;
    height: 12vw;
    border: 1px solid #bfbfbf;
    border-radius: 5px;
    box-sizing: border-box;
    margin: 5vw auto 0;
    padding: 2vw 3vw;
    font-size:3.8vw;
    &:first-child{
      margin-top:8vw;
    }
    i{
      font-size:4vw;
    }
    input{
      width: 0;
      flex:1;
      outline: 0;
      border:0;
      height:100%;
      margin-left:10px;
      font-size:3.8vw;
    }
    &:last-child{
      input{
        flex: 2;
      }
    }
    .code{
      font-size: 3.6vw;
    }
  }
  .login{
    width: 78vw;
    margin: 8vw auto;
    background: #b80223;
  }
  .logo{
    width: 34vw;
    height: 25vw;
    margin: 12vw auto 0;
    overflow: hidden;
    img{
      width: 100%;
    }
  }
}


</style>
