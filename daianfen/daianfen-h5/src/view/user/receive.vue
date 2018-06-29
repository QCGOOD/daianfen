<template>
  <div class="receive" v-if="!userInfo.is_distributer">
    <img style="width: 20%;margin: 0 auto;display: block;padding: 40px 0;" src="http://athena-1255600302.cosgz.myqcloud.com/attachments/abs.jpg">
    <p class="title">请正确输入以下信息</p>
    <group gutter="0">
      <x-input placeholder="请输入你的姓名" v-model="form.name">
        <i slot="label" class="iconfont icon-xingming" style="padding-right:10px;display:block;" width="30" height="30"></i>
      </x-input>
      <x-input placeholder="请输入你的手机号码" v-model="form.mobile">
        <i slot="label" class="iconfont icon-shouji" style="padding-right:10px;display:block;" width="30" height="30"></i>
      </x-input>
      <x-input placeholder="请输入验证码" v-model="form.code">
        <i slot="label" class="iconfont icon-yanzhengma" style="padding-right:10px;display:block;" width="30" height="30"></i>
        <x-button class="vcode_btn" v-show="showBtn" slot="right" type="primary" mini @click.native="getVcode">获取</x-button>
				<x-button class="vcode_btn2" v-show="!showBtn" slot="right" mini plain type="primary" style="margin-top: 0;" >{{number}}</x-button>
      </x-input>
    </group>
    <div class="btn">
      <x-button class="primary-btn" type="primary" :disabled="disabled" @click.native="memberBind">确定</x-button>
    </div>
  </div>
  <div class="receive review" v-else>
    <div class="content">
      <i class="iconfont" :class="userInfo.distributer_status === 1?'icon-dengdai':'icon-chenggong'"></i>
      <div v-if="userInfo.distributer_status === 1">
        <h2 class="title">待审核</h2>
        <p class="msg">关注公众号，可第一时间接收审核消息</p>
        <img class="qrcode" src="static/image/qrcode.jpg" alt="">
      </div>
      <div v-else>
        <h2 class="title">审核通过</h2>
        <p class="msg">恭喜，你已成为业务员！</p>
      </div>      
      <div class="btn-more" @click="jumpPage('/activity')">查看更多活动</div>
    </div>
  </div>
</template>

<script>
import { Group, XInput, XButton } from 'vux'

export default {
  components: {
    Group, XInput, XButton
  },
  data () {
    return {
      form: {
        name: '',
        mobile: '',
        code: ''
      },
      number: 60,
      showBtn: true,
      disabled: true,
      interval: null
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user;
    }
  },
  created () {
    this.$wxSdk.onMenuShare(
      '业务员注册',
      '注册成为业务员',
      `${this.$ROOTURL}/mobile/POUND/user/receive?wo=1&wot=2&woacm=1&mpl=1`,
      `http://athena-1255600302.cosgz.myqcloud.com/attachments/abs.jpg`
    );
  },
  methods: {
    // 获取验证码
    getVcode () {
      let reg = /^1[0-9]{10}$/
      if (!reg.test(this.form.mobile)) {
        this.toast('请输入正确的手机号码')
        return false
      }
      this.showBtn = false
      this.interval = setInterval(() => {
        if (this.number > 0) {
          this.number--
        } else {
          clearInterval(this.interval)
          this.showBtn = true
          this.number = 60
        }
      }, 1000)
      this.$http.post('/distributer/regist/code',{ mobile: this.form.mobile }).then(res => {
        console.log(res.data)
        if (res.data.code === 0) {
          this.toast('验证码已发送，请注意查收')
        } else {
          this.toast(res.data.message)
        }
      }).catch(err => {
        clearInterval(this.interval)
        this.showBtn = true
        this.number = 60
      })
    },
    memberBind () {
      this.$http.post('/distributer/regist',this.form).then(res => {
        this.$store.dispatch('userSave');
      })
    },
    jumpPage(url) {
      this.$router.push(url);
    }
  },
  watch: {
    form: {
      handler (val) {
        let num = 0
        for (let key in val) {
          if (val[key] === '') {
            num++
          }
        }
        if (num === 0) this.disabled = false
        else this.disabled = true
      },
      deep: true
    },
    'form.mobile' (val) {
      if (!this.showBtn) {
        clearInterval(this.interval)
        this.showBtn = true
        this.number = 60
      }
    }
  },
  destroyed() {
    this.$wxSdk.onMenuShare(
      "加速商学院",
      "助力优秀企业加速发展！",
      `${this.$ROOTURL}/mobile/POUND/activity?wo=1&wot=2&woacm=1&mpl=1`,
      "http://athena-1255600302.cosgz.myqcloud.com/attachments/abs.jpg"
    );
  }
}
</script>

<style lang="less" scoped>
.receive {
  background-color: #fff;
  height: 100vh;
  .title {
    padding: 3vw;
    font-size: 4vw;
  }
  .vcode_btn {
    width: 20vw;
    height: 8vw;
    background: #e2513c;
    border-radius: 3px;
    &:active {
      background: #e2513c;
    }
  }
  .vcode_btn2 {
    border-radius: 3px;
    width: 20vw;
    height: 8vw;
    color: @primary-color;
    border: 1px solid #e2513c;
    &:active {
      color: @primary-color;
      border: 1px solid #e2513c;
    }
  }
  .btn {
    padding: 10vw 5vw 0 5vw;
    .primary-btn {
      background: #e2513c;
    }
    .primary-btn[disabled='disabled'] {
      background: #f37885;
    }
  }
  &.receive {
    .content {
      text-align: center;
      .iconfont {
        font-size: 90px;
        &.icon-dengdai {
          color: #e2513c;
        }
        &.icon-chenggong {
          color: #62b900;
        }
      }
      .title {
        font-size: 20px;
      }
      .msg {
        font-size: 14px;
      }
      .qrcode {
        width: 45%;
        margin-top: 20px;
      }
      .btn-more {
        width: 175px;
        height: 40px;
        padding: 13px 0;
        margin: 20px auto 0;
        display: block;
        line-height: 1;
        font-size: 15px;
        text-align: center;
        background: #cecece;
        color: #fff;
        border-radius: 3px;
        box-sizing: border-box;
      }
    }
  }
  
}
</style>
