<template>
  <div class="coupon-item white" :class="[type === 'guoqi' ? '' : index % 2 === 0 ? 'red' : 'blue']">
    <div class="left">
      <button class="shiyong" v-if="type === 'keyong'">使用<i class="iconfont icon-jiantou"></i></button>
      <p class="title">{{item.type | couponType}}</p>
      <span class="english">AUDITION STAMPS</span>
      <div class="bottom">
        <span>满{{item.orderAmount / 100}}元可用</span>
        <span> | </span>
        <span>适用：{{item.scope == 303 ? '指定活动分类' : '指定活动'}}</span>
      </div>
    </div>
    <div class="right">
      <img class="bg" src="static/image/right.png" alt="">
      <div class="circle">
        <p>VALUE</p>
        <p>
          <span>￥</span>
          {{item.type | amount(item.amount)}}
        </p>
      </div>
      <p class="time">有效期至：{{item.expireTime | dateFormat}}</p>
      <div class="check" v-if="type === 'select'">
        <x-icon type="ios-circle-outline"  v-show="!item.checked"></x-icon>
        <x-icon type="ios-checkmark" v-show="item.checked"></x-icon>
      </div>
    </div>
    <img class="yiyong" src="static/image/yiyong.png" alt="" v-if="type === 'yiyong'">
  </div>
</template>

<script>
import { CheckIcon } from 'vux'

export default {
  components: {
    CheckIcon
  },
  props: {
    index: Number,
    item: Object,
    type: String,
  },
  data () {
    return {
      check: false
    }
  },
  filters: {
    priceFormat(val) {
      if(!val || val == '') return val
      else return val/100
    },
    couponType(type) {
      if(type == 1)return '抵扣券'
      else if(type == 2) return '折扣券'
    },
    amount(type, amount) {
      if(type == 1) return amount/100
      else if(type == 2) return amount+'折'
    },
    scope(val) {
      if(val == 303) return '部分活动分类可用'
      else if(304) return '部分活动可用'
    },
    dateFormat(date) {
      if(date == '') return date
      else return date.replace(/-/g, '.').substr(0,10)
    }
  }
}
</script>

<style lang="less" scoped>
.coupon-item {
  margin: 4vw;
  height: 25vw;
  border-radius: 2vw;
  display: flex;
  overflow: hidden;
  position: relative;
  .left {
    flex-shrink: 0;
    width: 65%;
    color: #fff;
    text-align: right;
    padding-right: 3vw;
    box-sizing: border-box;
    position: relative;
    background: linear-gradient(to bottom right, rgb(211, 211, 211), rgb(198, 198, 198) 40%, rgb(187, 187, 187));
    .shiyong {
      position: absolute;
      outline: none;
      border: 0;
      left: 2vw;
      top: 2vw;
      background-color: #fff;
      color: @red-color;
      font-size: 12px;
      padding: 0 2vw;
      border-radius: 4vw;
      height: 6vw;
      .iconfont{
        font-size:3.2vw;
        transform:scale(0.6);
      }
    }
    .title {
      font-size: 24px;
    }
    .english {
      font-family: Georgia;
      border-bottom: 1px solid #fff;
      padding-bottom: 0.5vw;
      font-size: 10px;
    }
    .bottom {
      font-size: 11px;
      margin-top: 2vw;
    }
  }
  .right {
    position: relative;
    width: 35%;
    .bg {
      position: absolute;
      width: 100%;
      height: 100%;
      left: -1vw;
    }
    .circle {
      position: relative;
      width: 17vw;
      height: 17vw;
      border-radius: 50%;
      color: #fff;
      display: flex;
      flex-flow: column;
      justify-content: center;
      align-items: center;
      line-height: 1;
      margin: 2vw auto 0 auto;
      background-color: rgb(187, 187, 187);
      &::after {
        position: absolute;
        content: '';
        left: -1vw;
        bottom: 2vw;
        width: 0;
        height: 0;
        border-left: 4vw solid transparent;
        border-right: 4vw solid transparent;
        border-bottom: 6vw solid rgb(187, 187, 187);
      }
      p {
        z-index: 1;
        position: relative;
        &:first-child {
          font-family: Georgia;
          font-size: 2.5vw;
          margin-left: 2vw;
          font-weight: bold;
        }
        &:last-child {
          font-size: 7vw;
          font-family: Georgia;
          span {
            font-size: 4vw;
            margin-right: -2.5vw;
            position: relative;
            top: -2vw;
          }
        }
      }
    }
    .time {
      margin-top: 1vw;
      position: relative;
      font-size: 3.2vw;
      text-align: center;
      color: @gray-color;
    }
    .check {
      position: absolute;
      top: 2vw;
      right: 1vw;
    }
  }
  .yiyong {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 17vw;
  }
}

.red {
  .left {
    background: linear-gradient(to bottom right, #ffb400, rgb(251, 159, 23) 40%, #f26651);
  }
  .right {
    .circle {
      background-color: @red-color;
      &::after {
        position: absolute;
        content: '';
        left: -1vw;
        bottom: 2vw;
        width: 0;
        height: 0;
        border-left: 4vw solid transparent;
        border-right: 4vw solid transparent;
        border-bottom: 6vw solid @red-color;
      }
    }
  }
}
.blue {
  .left {
    background: linear-gradient(to bottom right, rgb(78, 196, 255), rgb(73, 144, 251));
  }
  .right {
    .circle {
      background-color: rgb(75, 146, 253);
      &::after {
        position: absolute;
        content: '';
        left: -1vw;
        bottom: 2vw;
        width: 0;
        height: 0;
        border-left: 4vw solid transparent;
        border-right: 4vw solid transparent;
        border-bottom: 6vw solid rgb(75, 146, 253);
      }
    }
  }
}

.vux-x-icon {
  fill: @yellow-color;
}
</style>
