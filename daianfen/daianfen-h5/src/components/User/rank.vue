<template>
  <div class="rank white" :style="{ 'height': `${height}px`}">
    <img class="bg" src="static/image/rank-bg.png" alt="">
    <i class="iconfont icon-bangzhu1" @click="close(true)"></i>
    <div class="top">
      <div class="qian">
        <div class="item">
          <div class="dai">
            <img src="static/image/dai.png" alt="">
          </div>
          <div class="hua">
            <!-- <img src="static/image/study.png" alt=""> -->
            <img src="static/image/Influence.png" alt="">
            <span>1</span>
          </div>
        </div>
        <div class="item da">
          <div class="dai">
            <img src="static/image/dai.png" alt="">
          </div>
          <div class="hua">
            <!-- <img src="static/image/study.png" alt=""> -->
            <img src="static/image/Influence.png" alt="">
            <span>2</span>
          </div>
        </div>
        <div class="item">
          <div class="dai">
            <img src="static/image/dai.png" alt="">
          </div>
          <div class="hua">
            <!-- <img src="static/image/study.png" alt=""> -->
            <img src="static/image/Influence.png" alt="">
            <span>3</span>
          </div>
        </div>
      </div>
      <p class="text">
        伯爵 | 学习力 86
      </p>
    </div>
    <div class="sum-box" :style="{ 'height': `${sumHeight}px`}">
      <div class="s-item" :class="[i !== 0 ? 'vux-1px-t' : '']" v-for="(item, i) in 15" :key="i">
        <div class="left">
          <p class="title">转发一次</p>
          <p class="desc">第三方进行抽奖哦v哦弄死</p>
        </div>
        <div class="right">
          <p class="count">+10</p>
          <p class="time">2018.04.30</p>
        </div>
      </div>
    </div>
    <qc></qc>
    <div class="rule" v-if="isRule">
      <div class="popup">
        <p class="title">— 学习力与影响力 —</p>
        <div class="desc white">
          <div class="item">
            <p class="i-title">影响力指数：</p>
            <p class="i-text">(1) 转发一次+10；</p>
            <p class="i-text">(2) 转发后点击阅读：每点击阅读一个+1；</p>
            <p class="i-text">(3) 影响别人报名参加活动+20；</p>
            <p class="i-text">(4) 影响别人报名课程+50；</p>
          </div>
          <div class="item">
            <p class="i-title">学习力指数：</p>
            <p class="i-text">(1) 注册+10；</p>
            <p class="i-text">(2) 评论+10；</p>
            <p class="i-text">(3) 评论被点赞，每一个赞+1；</p>
            <p class="i-text">(4) 自己报名参加活动+20；</p>
            <p class="i-text">(5) 自己缴费报名课程+50；</p>
          </div>
        </div>
      </div>
      <div class="close">
        <i class="iconfont icon-guanbi1" @click="close(false)"></i>
      </div>
    </div>
  </div>
</template>

<script>
import Qc from '../Common/qc'

export default {
  components: {
    Qc
  },
  data () {
    return {
      height: 0,
      sumHeight: 0,
      isRule: false,
    }
  },
  mounted () {
    this.getHeight()
    window.onresize = () => {
      this.getHeight()
    }
  },
  methods: {
    getHeight () {
      this.height = window.innerHeight
      let top = document.querySelector('.top').offsetHeight
      let bottom = document.querySelector('.qchd').offsetHeight
      this.sumHeight = window.innerHeight - top - bottom - 13
    },
    close (state) {
      this.isRule = state
    },
  }
}
</script>

<style lang="less" scoped>
.rank {
  position: relative;
  .bg {
    position: absolute;
  }
  .icon-bangzhu1 {
    position: absolute;
    right: 4vw;
    top: 3vw;
    color: #fff;
    font-size: 5.5vw;
  }
  .top {
    padding: 15vw 15vw 5vw 15vw;
    .qian {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .item {
        line-height: 1;
        display: inline-flex;
        flex-flow: column;
        align-items: center;
        .dai {
          width: 13vw;
          position: relative;
        }
        .hua {
          width: 15vw;
          height: 15vw;
          position: relative;
          img {
            height: 100%;
          }
          span {
            position: absolute;
            top: 0;
            width: 15vw;
            height: 15vw;
            font-size: 8vw;
            font-weight: bold;
            color: rgb(77, 77, 77);
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }
      .da {
        .dai {
          width: 15vw;
        }
        .hua {
          width: 20vw;
          height: 20vw;
          span {
            width: 20vw;
            height: 20vw;
            font-size: 9vw;
          }
        }
      }
    }
    .text {
      text-align: center;
      color: @dark-color;
      margin-top: 2vw;
      font-size: 3.8vw;
    }
  }
  .sum-box {
    overflow-y: auto;
    margin: 0 5vw;
    background-color: #fff;
    box-shadow: 0px 0px 15px 0px #e2e2e2;
    border-radius: 2vw;
    padding: 0 4vw;
    .s-item {
      display: flex;
      justify-content: space-between;
      font-size: 4vw;
      padding: 2vw 0;
      .left {
        .desc {
          font-size: 3.5vw;
          color: @gray-color;
        }
      }
      .right {
        text-align: right;
        .count {
          color: @red-color;
        }
        .time {
          font-size: 3.5vw;
          color: @gray-color;
        }
      }
    }
  }
  .rule {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: column;
    .popup {
      width: 78vw;
      border-radius: 1vw;
      overflow: hidden;
      .title {
        background-color: @red-color;
        color: #fff;
        padding: 3vw 0;
        text-align: center;
        font-size: 4vw;
      }
      .desc {
        padding: 3vw 5vw;
        font-size: 3.6vw;
        line-height: 1.8;
        .item {
          &:last-child {
            margin-top: 4vw;
          }
          .i-text {
            color: @dark-color;
          }
        }
      }
    }
    .close {
      text-align: center;
      color: #fff;
      position: relative;
      height: 14vw;
      padding-top: 5vw;
      i {
        font-size: 7vw;
      }
      &:before {
        position: absolute;
        content: '';
        width: 1px;
        border-left: 1px solid #fff;
        left: 50%;
        top: -10vw;
        bottom: 10vw;
      }
    }
  }
}
</style>
