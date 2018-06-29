<template>
  <div class="main" id="main">
    <div v-if="model.defaultBackgroundImage" class="img">
      <img v-show="!isSuccess" :src="img + model.defaultBackgroundImage" alt="" :style="{ 'height': `${viewHeight}px` }">
      <img v-show="isSuccess" :src="img + model.successBackgroundImage" alt="" :style="{ 'height': `${viewHeight}px` }">
    </div>
    <div class="input-box" v-show="!isSuccess">
      <p class="title">请输入签到编号</p>
      <div class="input-content">
        <div class="input-item" v-for="(item, index) in inputs" :key="index" @click="inputActive(true)">
          <span>{{item.value}}</span>
        </div>
      </div>
    </div>
    <div class="number-box" :class="{ 'number-active': numberActive }">
      <div class="n-top iconfont icon-jiantou" @click="inputActive(false)"></div>
      <div class="n-content">
        <div class="n-item" :class="{'gray': item.gray }" :style="{'width': `${itemWidth}px`}" v-for="(item, index) in numbers" :key="index" @click="numberInput(item.value)">
          <span v-if="item.value > -1">{{item.value}}</span>
          <i class="iconfont icon-shanchushangwu103401" v-if="item.delete"></i>
        </div>
      </div>
    </div>
    <div class="fail-mask" v-if="isFailBox" @click="close"></div>
    <div class="fail-box" v-if="isFailBox">
      <div class="f-close" @click="close"></div>
      <div class="f-img">
        <img :src="img + model.signInFailImage" alt="">
      </div>
      <p>{{message}}</p>
    </div>
    <div class="bottom" @click="qicheng">
      由企成互动提供技术支持
    </div>
    <div class="register" v-if="false">
      <div class="regist-box">
        <group gutter="0">
          <x-input title="手机号码" placeholder="请输入手机号码" v-model="form.mobile" type="number" required :max="11"></x-input>
          <x-input title="验证码" placeholder="请输入验证码" v-model="form.code" required>
            <x-button class="code" v-show="showBtn" slot="right" type="primary" mini @click.native="getCode">获取</x-button>
            <x-button class="code" v-show="!showBtn" slot="right" type="primary" mini plain>{{number}}</x-button>
          </x-input>
        </group>
        <group>
          <x-button type="primary" @click.native="register">注册</x-button>
        </group>
      </div>
    </div>
  </div>
</template>

<script>
import { Group, XInput, XButton } from 'vux'
import { setInterval, clearInterval } from 'timers';

export default {
  components: {
    Group, XInput, XButton
  },
  data () {
    return {
      showBtn: true,
      number: 60,
      form: {
        mobile: '',
        code: ''
      },
      inputs: [
        { value: '' },
        { value: '' },
        { value: '' },
        { value: '' },
        { value: '' },
        { value: '' }
      ],
      numbers: [
        { value: 1 },
        { value: 2 },
        { value: 3 },
        { value: 4 },
        { value: 5 },
        { value: 6 },
        { value: 7 },
        { value: 8 },
        { value: 9 },
        { value: '', gray: true },
        { value: 0 },
        { value: -1, delete: true, gray: true }     
      ],
      numberActive: false,
      id: '',
      model: {},
      isSuccess: false,
      isFailBox: false,
      message: '',
      viewHeight: 0,
      itemWidth: 0,
    }
  },
  created () {
    console.log(this.$route.query)
    this.id = this.$route.query.id
    if (/192.168.1.79/.test(window.location.origin)) {
      this.login()
    } else {
      this.activity()
    }
  },
  mounted () {
    this.viewHeight = window.innerHeight
    this.itemWidth = window.innerWidth / 3
    window.onresize = () => {
      this.viewHeight = window.innerHeight
      this.itemWidth = window.innerWidth / 3
    }
    console.log(this.viewHeight)
    let main = document.getElementById('main')
    main.oncontextmenu = e => {
      // e.preventDefault()
    }
  },
  methods: {
    qicheng () {
      // window.open('http://www.wego168.com')
      window.location.href = 'http://m.wego168.com/m/index.html'
    },
    inputActive (state) {
      this.numberActive = state
    },
    numberInput (value) {
      if (value === '') return false
      if (value === -1) {
        for (let i = this.inputs.length-1; i >= 0; i--) {
          if (this.inputs[i].value !== '') {
            this.inputs[i].value = ''
            return false
          }
        }
        return false
      }
      for (let i = 0; i < this.inputs.length; i++) {
        if (this.inputs[i].value === '') {
          this.inputs[i].value = value
          // this.checkInput()
          return
        }
      }
    },
    login () {
      api.login({ mobile: '13844836024', code: '1024'}).then(res => {
        console.log(res.data)
        this.activity()
      })
    },
    activity () {
      api.activity(this.$route.query.id).then(res => {
        console.log('activity === ', res.data)
        if (res.data.code === 0) {
          this.model = res.data.data
          console.log(this.model)
          this.isSuccess = this.model.alreadySignIn
          // console.log(this.isSuccess)
        }
      })
    },
    signIn (id, code) {
      api.signIn(id, {code: code}).then(res => {
        console.log(res.data)
        if (res.data.code === 0) {
          this.toast(res.data.message)
          this.isSuccess = true
        } else {
          this.message = res.data.message
          this.isFailBox = true
          this.inputs.map(item => {
            if (item.value !== '') {
              item.value = ''
            }
          })
        }
      })
    },
    close () {
      this.isFailBox = false
    },
    getCode () {
      let reg = /^1[0-9]{10}$/
      if (this.form.mobile === '') {
        this.toast('请输入手机号码')
        return false
      }
      if (this.form.mobile && !reg.test(this.form.mobile)) {
        this.toast('请输入正确的手机号码')
        return false
      }
      this.showBtn = false
      var interval = setInterval(() => {
        if (this.number > 0) {
          this.number--
        } else {
          clearInterval(interval)
          this.showBtn = true
          this.number = 60
        }
      }, 1000)
      console.log(this.form)
      api.sendCode({ mobile: this.form.mobile }).then(res => {
        console.log(res.data)
      })
    },
    register () {
      if (this.form.mobile === '') {
        this.toast('请输入手机号码')
        return false
      } else if (this.form.code === '') {
        this.toast('请输入验证码')        
        return false
      }
      api.regist(this.form).then(res => {
        console.log(res.data)
        if (res.data.code === 0) {

        } else {
          this.toast(res.data.message)
        }
      })
    }
  },
  watch: {
    inputs: {
      handler () {
        console.log('watch')
        let num = 0
        let value = ''
        this.inputs.map(item => {
          if (item.value !== '') {
            num++
            value += item.value
          }
        })
        console.log(num)
        if (num === this.inputs.length) {
          this.numberActive = false
          console.log(value)
          this.signIn(this.$route.query.id, value)
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
  .main {
    position: relative;
    display: flex;
    justify-content: center;
    overflow: hidden;
    .img {
      line-height: 0;
      img {
        width: 100%;
      }
    }
    
    .input-box {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 66vw;
      background-color: rgba(0, 0, 0, 0.3);
      padding: 4vw 10vw;
      .title {
        color: #fff;
        font-size: 5vw;
        margin-bottom: 3vw;
      }
      .input-content {
        .input-item {
          width: 11vw;
          height: 11vw;
          background-color: rgba(255, 255, 255, .7);
          line-height: 11vw;
          text-align: center;
          float: left;
          &:not(:last-child) {
            margin-right: 2.8vw;
          }
          .input {
            width: 100%;
            text-align: center;
            background-color: transparent;
            border: 0;
            outline: none;
            font-size: 8vw;
          }
          span {
            font-size: 8vw;
          }
        }
      }
    }
    .number-box {
      z-index: 1;
      transition: all .2s;
      position: fixed;
      bottom: -66vw;
      left: 0;
      right: 0;
      background: #fff;
      .n-top {
        height: 6vw;
        line-height: 6vw;
        text-align: center;
        font-size: 5vw;
        color: #d9d9d9;
        &:active {
          background-color: #ECECEC;
        }
      }
      .n-content {
        display: flex;
        flex-wrap: wrap;
        position: relative;
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          border-top: 1px solid #d9d9d9;
          color: #d9d9d9;
          transform: scaleY(0.5);
        }
        &::after {
          content: " ";
          position: absolute;
          left: 0;
          top: 0;
          width: 1px;
          bottom: 0;
          border-left: 1px solid #D9D9D9;
          color: #D9D9D9;
          transform-origin: 0 0;
          transform: scaleX(0.5);
        }
        .gray {
          background-color: rgb(224, 224, 224);
        }
        .n-item {
          // width: 33.33%;
          float: left;
          height: 15vw;
          line-height: 15vw;
          box-sizing: border-box;
          text-align: center;
          position: relative;
          font-size: 5vw;
          &:active {
            background-color: #ECECEC;
          }
          &::before {
            content: '';
            position: absolute;
            right: 0;
            top: 0;
            width: 1px;
            bottom: 0;
            border-right: 1px solid #D9D9D9;
            color: #D9D9D9;
            transform-origin: 100% 0;
            transform: scaleX(0.5);
          }
          &::after {
            content: '';
            position: absolute;
            left: 0;
            bottom: 0;
            right: 0;
            height: 1px;
            border-bottom: 1px solid #D9D9D9;
            color: #D9D9D9;
            transform-origin: 0 100%;
            transform: scaleY(0.5);
          }
          .icon-shanchushangwu103401 {
            font-size: 6vw;
          }
        }
      }
    }
    .number-active {
      bottom: 0;
    }
    .fail-mask {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      // background: chartreuse;
    }
    .fail-box {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80vw;
      height: 50vw;
      background-color: #fff;
      border: 3px solid rgb(90, 72, 57);
      border-radius: 10px;
      padding: 2vw 0;
      text-align: center;
      display: flex;
      flex-flow: column;
      justify-content: center;
      align-items: center;
      .f-close {
        width: 6vw;
        height: 6vw;
        position: absolute;
        top: 4px;
        right: 4px;
        transform: rotate(45deg);
        &::before {
          content: '';
          position: absolute;
          height: 1px;
          top: 50%;
          left: 0;
          right: 1px;
          transform: translate(0, -50%);
          border-top: 1px solid rgb(90, 72, 57);
          background-color: rgb(90, 72, 57);
        }
        &::after {
          content: '';
          position: absolute;
          width: 1px;
          top: 0;
          left: 50%;
          bottom: 1px;
          transform: translate(-50%, 0);
          border-left: 1px solid rgb(90, 72, 57);
          background-color: rgb(90, 72, 57);
        }
      }
      .f-img {
        width: 35vw;
        margin-bottom: 3vw;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .bottom {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 10vw;
      line-height: 10vw;
      text-align: center;
      background-color: rgba(255, 255, 255, 0.9);
      color: rgb(106, 186, 231);
    }
    .register {
      position: fixed;
      z-index: 11;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      // height: 40vw;
      background-color: rgba(0, 0, 0, 0.5);
      .regist-box {
        background-color: #fff;
        padding: 4vw 1vw;
        .code {
          width: 20vw;
          height: 30px;
          margin-top: 0;
          box-sizing: border-box;
        }
      }
    }
  }
</style>
