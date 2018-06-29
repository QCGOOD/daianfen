<template>
  <div class="revise-mobile">
    <div class="group">
      <p>当前手机：{{user.mobile}}</p>
    </div>
    <div class="group">
      <div class="input">
        <input type="tel" placeholder="请输入新手机" maxlength="11" v-model.number="model.mobile">
      </div>
      <div class="input">
        <input type="text"  placeholder="请输入验证码" maxlength="6" v-model.number="model.code">
        <div class="send-code" v-if="!send" @click="sendCode()">获取</div>
        <div class="send-code" v-else style="border-color:#d9d9d9;color:#aaa;">{{second}}s</div>
      </div>
    </div>
    <div class="btn" @click="save()">确定</div>
  </div>
</template>

<script>
import { Badge } from 'vux'
// 验证码计时器
var timer;
export default {
  components: {
  },
  data() {
    return {
      user: {
        name: '陈书记',
        mobile: '15181983435',
        company: '企成',
        job: '前端'
      },
      model: {
        mobile: '',
        code:''
      },
      send: false,
      second: 6
    };
  },
  created() {
    this.apiGetUser();
  },
  methods: {
    apiGetUser() {
      this.$http.get("/member/info").then(res => {
        console.log(res.data.data)
        this.user = res.data.data;
      });
    },
    jumpPage(url) {
      this.$router.push(url)
    },
    sendCode() {
      if(this.model.mobile == ''){
        this.toast('请输入手机号')
        return;
      }
      this.apiSendCode()
    },
    save() {
      if(this.model.mobile == '' || this.model.code == '' ){
        this.toast('请完善信息')
        return false;
      }
      this.apiSave()
    },
    apiSendCode() {
      this.$http.post('/member/bind/code', this.model)
      .then(res => {
        console.log(res.data)
        this.countDown()
      })
    },
    apiSave() {
      this.$http.post('/member/bind', this.model)
      .then(res => {
        console.log(res.data)
        this.toast('修改成功')
        setTimeout(() => {
          this.$router.go(-1)
        }, 500)
      })
    },
    countDown() {
      // 倒计时
      this.send = true
      timer = setInterval(() => {
        this.second --
        console.log('执行了', this.second)
        if(this.second <= 0){
        clearInterval(timer)
        this.send = false
        this.second = 6
        return;
      }
      },1000)
    }
  },
  destroyed() {
    clearInterval(timer)
  }
};
</script>

<style lang="less" scoped>
.revise-mobile{
  background:#fff;
  height:100vh;
  overflow: hidden;
.send-code{
  // padding:0 6vw;
  width:16vw;
  line-height: 1.8;
  border: 1px solid @red-color;
  border-radius:1vw;
  text-align: center;
  font-size:3.6vw;
  color: @red-color;
}
  .group{
    padding-top:6vw;
    &:first-child{
      padding:6vw 4vw 0;
    }
    .input{
      position: relative;
      padding:2.7vw 4vw;
      display: flex;
      align-items: center;
      justify-content: center;

      &::after{
        content: " ";
        position: absolute;
        left: 4vw;
        right: 4vw;
        bottom:0;
        border-bottom: 1px solid #D9D9D9;
        color: #D9D9D9;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
      }
    }
    input{
      flex:1;
      width:100%;
      height:1.4em;
      line-height: 1.4;
      font-size: inherit;
      color: inherit;
      outline: 0 none;
      border:0 none;
    }
  }

  .btn{
    background:@red-color;
    // border:1px solid @red-color;
    border-radius:1vw;
    text-align:center;
    line-height:11vw;
    color: #fff;
    margin:20vw 4vw 5vw;
  }
}

</style>
