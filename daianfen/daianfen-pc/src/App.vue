<template>
  <div id="app" class="main_app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "app"
};
</script>

<style lang="less">
@import "./assets/styles/elm.less";
@import "./assets/styles/wawa.less";
@import "//at.alicdn.com/t/font_623570_imnxw0ahu53fpqfr.css";

body {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}
#app {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
input[type="number"] {
  -moz-appearance: textfield;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0;
}
.required::before {
  content: "*";
  color: red;
  display: inline-block;
  margin-right: 5px;
}
.tongji {
  padding: 10px 30px;
  margin-top: 52px;
  font-size: 18px;
  .item {
    span {
      color: rgb(255, 31, 31);
    }
    &:not(:last-child) {
      margin-right: 20px;
    }
  }
}
.upload-img-box {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 6px;
  border: 1px dashed #d9d9d9;
  overflow: hidden;
  cursor: pointer;
  &:hover {
    border-color: #409eff;
  }
  .upload-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
}
.img-upload {
  display: flex;
  justify-content: space-between;
  .img-item {
    width: 270px;
  }
}

.new-form {
  .el-form-item {
    margin-bottom: 0;
    &:last-child {
      margin-bottom: 20px;
    }
    width: 100%;
    .el-form-item {
      margin-bottom: 6px;
      width: 260px;
      display: inline-block;
      margin-right: 20px;
      &:nth-child(3n) {
        margin-right: 0;
      }
      .el-select, .el-input-number {
        width: 100%;
      }
    }
  }
}

#login{
  & .el-input__prefix {
    left:15px;
    color: #ccc;
    .iconfont{
      font-size:16px;
    }
  }
  & .el-input--prefix .el-input__inner{
    padding-left:45px!important;
    background-color:transparent;
    color:#fff;
  }
  & .el-form-item.is-error .el-input__inner{
    // border-color:#ccc;
  }
  & .el-form-item__error{
    color:#fff;
  }
}
</style>
