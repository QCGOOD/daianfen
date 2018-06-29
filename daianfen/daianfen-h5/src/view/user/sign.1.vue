<template>
  <div class="sign">
    <div class="popup">
      <div class="box">
        <div class="img">
          <img src="static/image/zanwei.jpg" alt="">
        </div>
        <div class="qian">
          <div class="date">
            <i class="iconfont icon-qiandaorili"></i>
            <div class="text">
              <p>4月29日，签到成功！</p>
              <p>学习力+10</p>
            </div>
          </div>
          <div class="total">
            累计打卡
            <span>001</span>
            天
          </div>
        </div>
        <div class="intro">
          <p class="title">跟大煞风景哦aids发士大夫骄傲科技发达省份两次心理剧大赛</p>
          <p class="desc">简介：士大夫撒法薪酬大师傅但是跟大煞风景哦aids发士大夫骄傲科技发达省份两次心理剧大赛</p>
        </div>
        <p class="time">您很守时哦，棒棒哒~</p>
      </div>
      <div class="btn">
        <flexbox>
          <flexbox-item>
            <x-button type="primary">保存到相册</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button type="primary">转发</x-button>
          </flexbox-item>
        </flexbox>
      </div>
    </div>
  </div>
</template>

<script>
import { XButton, Flexbox, FlexboxItem } from 'vux'

export default {
  components: {
    XButton, Flexbox, FlexboxItem
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
  },
  methods: {
    close () {
      this.$emit('close', false)
    }
  }
}
</script>

<style lang="less" scoped>
.sign {
  position: fixed;
  z-index: 501;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #f3f3f3;
  .popup {
    position: absolute;
    top: 44px;
    left: 50%;
    transform: translate(-50%);
    .close {
      text-align: center;
      color: #fff;
      position: relative;
      height: 14vw;
      i {
        font-size: 8vw;
      }
      &:after {
        position: absolute;
        content: '';
        width: 1px;
        border-left: 1px solid #fff;
        left: 50%;
        top: 10vw;
        bottom: 0;
      }
    }
    .box {
      width: 80vw;
      background-color: #fff;
      border-radius: 2vw;
      overflow: hidden;
      .img {
        width: 80vw;
        line-height: 0;
      }
      .qian {
        background-color: @red-color;
        color: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 3vw;
        font-size: 3.6vw;
        .date {
          display: inline-flex;
          align-items: center;
          i {
            font-size: 4vw;
            margin-right: 2vw;
          }
          .text {
            font-size: 13px;
          }
        }
        .total {
          font-size: 13px;
          align-content: flex-end;
          span {
            font-size: 23px;
            font-weight: bold;
          }
        }
      }
      .intro {
        padding: 22px 13px;
        font-size: 14px;
        .title {
          font-size: 3.8vw;
        }
        .desc {
          margin-top: 22px;
          font-size: 12px;
          color: @gray-color;
        }
      }
      .time {
        text-align: center;
        padding: 4vw 0;
        font-size: 3.4vw;
        color: @yellow-color;
      }
    }
    .btn {
      margin-top: 20px;
    }
  }  
}
</style>
