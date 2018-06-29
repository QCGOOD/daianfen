<template>
  <div class="sign-success">
    <div class="success white">
      <div class="user">
        <div class="img">
          <img src="static/image/132.jpg" alt="">
        </div>
        <p>啊啊</p>
      </div>
      <div class="gou">
        <i class="iconfont icon-chenggong"></i>
        <span>您已经成功领取试听券</span>
      </div>
      <div class="qrcode">
        <div class="left">
          <p>长按识别二维码关注</p>
          <p>加速商学院</p>
          <p>在这里，收获您的知识与梦想！</p>
        </div>
        <div class="right">
          <img src="static/image/zanwei.jpg" alt="">
        </div>
      </div>
    </div>
    <qc :fixed="true"></qc>
  </div>
</template>

<script>
import Qc from './Common/qc'

export default {
  components: {
    Qc
  }
}
</script>

<style lang="less" scoped>
.sign-success {
  .success {
    margin: 10vw 5vw 5vw 5vw;
    border-radius: 1vw;
    position: relative;
    .user {
      position: absolute;
      left: 0;
      right: 0;
      top: -7vw;
      text-align: center;
      .img {
        width: 15vw;
        height: 15vw;
        border-radius: 50%;
        overflow: hidden;
        margin: 0 auto;
      }
      p {
        font-size: 4vw;
        margin-top: 1vw;
      }
    }
    .gou {
      padding-top: 15vw;
      color: rgb(104, 192, 0);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-flow: column;
      height: 80vw;
      i {
        font-size: 18vw;
        margin-right: 3vw;
      }
      span {
        font-size: 4.5vw;
        line-height: 15vw;
      }
    }
    .qrcode {
      background-color: rgb(104, 192, 0);
      color: #fff;
      display: flex;
      padding: 4vw 3vw;
      border-bottom-left-radius: 2vw;
      border-bottom-right-radius: 2vw;
      .left {
        display: inline-flex;
        flex-flow: column;
        justify-content: center;
        align-content: center;
        p {
          text-align: center;
          font-size: 3.6vw;
          &:first-child {
            letter-spacing: 1.2vw;
          }
          &:nth-child(2) {
            padding: 1vw 0;
            font-size: 7vw;
            font-weight: bold;
            letter-spacing: 2vw;
          }
        }
      }
      .right {
        width: 30vw;
        height: 30vw;
        flex-shrink: 0;
        margin-left: 2vw;
        img {
          height: 100%;
        }
      }
    }
  }
}
</style>
