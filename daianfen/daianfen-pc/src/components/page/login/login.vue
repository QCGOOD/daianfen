<template>
  <div id="login" class="container">
    <div class="header">
      <div class="logo">
        <img src="../../../../static/images/logo-lg.png" alt="">
      </div>
      <p class="title">预约试穿管理系统</p>
    </div>
    <!-- :style="`background:url(${require('../../../../static/images/login-bg.png')}) no-repeat`" -->
    <div class="content" >
      <!-- :style="`background:url(${require('../../../../static/images/login-bg.png')}) no-repeat 100% 100%`" -->
      <div class="form-right bottom">
        <!-- <h4 class="title">欢迎登陆</h4> -->
        <el-form :model="model" class="form" :rules="rules" ref="model" label-position="top">
          <el-form-item label="" prop="account">
            <el-input type="text" prefix-icon="iconfont icon-zhanghao" v-model="model.account" placeholder="请输入账号" @keyup.enter.native="login"></el-input>
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input type="password" prefix-icon="iconfont icon-mima" v-model="model.password" placeholder="请输入密码" @keyup.enter.native="login"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="button" @click="login()" :loading="loading">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <footer class="footer">
      <p>Copyright 2013-2018 企成科技 版权所有</p>
    </footer>
  </div>
</template>
<script>
import api from "api/common.js";
export default {
  data() {
    return {
      loading: false,
      model: {
        account: "",
        password: ""
      },
      rules: {
        account: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    apiLogin(data) {
      console.log(data)
      this.$http.post('/login', data)
        .then(res => {
          this.$message.success('登录成功');
          setTimeout(() => {
            this.$router.push("/main/statistical");
          }, 500)
        })
        .catch(err => {
          this.loading = false;
          console.log("登陆接口失败", err);
        });
    },
    login() {
      this.loading = true;
      this.$refs.model.validate(valid => {
        if (valid) {
          this.apiLogin(this.model);
        } else {
          this.loading = false;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.el-form-item {
  margin-top: 40px !important;
  color:#fff;
}

#login {
  position: absolute;
  left:0;
  top:0;
  width: 100%;
  height:100%;
  min-height: 100%;
  overflow:hidden;
  .header{
    width:100%;
    height:40%;
    text-align: center;
    padding:120px 0 0;
    box-sizing: border-box;
    .logo{
      width:400px;
      height:250px;
      margin:0 auto;
      img{
        width:auto;
        max-width:100%;
      }
    }
    .title{
      font-size: 26px;
      color: #b80223;
      margin-top: 20px;
    }
  }
  .content{
    width:100%;
    height: 60%;
    background-color:#b80223;
    background-size:100% 100%;
    background:url(../../../../static/images/login-bg.png) no-repeat;
    background-size:100% 100%;
    .form-right {
      width: 450px;
      box-sizing: border-box;
      margin:0 auto;
      // overflow: hidden;
      .title {
        padding: 20px;
        font-size: 18px;
        border-bottom: 1px solid rgb(231, 231, 235);
      }
      .form {
        padding: 10px 20px 0px 20px;
        margin-top:58px;
        // background:rgba(255,255,255,.2);
        overflow:hidden;
        .button {
          width: 100%;
          color: #b80223;
          margin: 40px 0 20px;
        }
      }
    }
  }
  .footer {
    position: absolute;
    // bottom: 0;
    width: 100%;
    // padding: 40px 0;
    text-align: center;
    color: #fff;
    font-size: 14px;
  }
}
</style>