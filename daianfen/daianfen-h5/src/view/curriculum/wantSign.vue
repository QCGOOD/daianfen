<template>
  <div class="want-sign">
    <div class="top white">
      <div class="img">
        <img src="static/image/zanwei.jpg" alt="">
      </div>
      <div class="info">
        <p class="title">《一不小心进了艺术圈》曹启泰的10堂技术课</p>
        <div class="time-price">
          <p class="time">
            距开课：
            <span>24</span>天
            <span>23</span>时
            <span>30</span>分
          </p>
          <p class="price">
            <span>￥</span>
            99.00
          </p>
        </div>
      </div>
    </div>
    <div class="discount">
      <group gutter="0">
        <cell title="选择优惠券" is-link></cell>
        <cell>
          <p slot="title">
            <span class="title">试听券</span>
            <span class="condition">-￥50</span>
            <span class="condition">[50元试听券]</span>
          </p>
        </cell>
      </group>
    </div>
    <div class="sign-up white">
      <p class="title vux-1px-b">填写参加人信息</p>
      <div class="input-box">
        <div class="item">
          <i class="iconfont icon-wode1"></i>
          <input type="text" placeholder="请输入姓名">
        </div>
        <div class="item">
          <i class="iconfont icon-shouji"></i>
          <input type="text" placeholder="请输入手机号">
        </div>
        <div class="item">
          <i class="iconfont icon-gongsi"></i>
          <input type="text" placeholder="请输入公司简称">
        </div>
        <div class="item">
          <i class="iconfont icon-zhiwei"></i>
          <input type="text" placeholder="请输入职位">
        </div>
      </div>
    </div>
    <div class="btn">
      确定
    </div>
  </div>
</template>

<script>
import { Group, Cell } from 'vux'

export default {
  components: {
    Group, Cell
  }
}
</script>

<style lang="less" scoped>
.want-sign {
  margin-bottom: 14vw;
  .top {
    display: flex;
    padding: 3vw 4vw;
    .img {
      width: 28vw;
      height: 20vw;
      border-radius: 2vw;
      overflow: hidden;
      flex-shrink: 0;
      margin-right: 3vw;
      img {
        height: 100%;
      }
    }
    .info {
      .title {
        font-size: 3.8vw;
      }
      .time-price {
        display: flex;
        justify-content: space-between;
        margin-top: 5vw;
        line-height: 1;
        .time {
          font-size: 3.4vw;
          color: @gray-color;
          span {
            color: @yellow-color;
          }
        }
        .price {
          font-size: 4.2vw;
          span {
            font-size: 3vw;
            margin-right: -1vw;
          }
        }
      }
    }
  }
  .discount {
    margin-top: 3vw;
    .title {
      border: 1px solid #bf9f56;
      font-size: 3.5vw;
      padding: 0.5vw 1vw;
      color: #bf9f56;
    }
    .condition {
      color: #5d6266;
    }
  }
  .sign-up {
    margin-top: 3vw;
    .title {
      padding: 3vw 0;
      margin-left: 4vw;
    }
    .input-box {
      padding: 4vw;
      .item {
        background-color: rgb(247, 247, 247);
        height: 10vw;
        line-height: 10vw;
        padding: 0 3vw;
        margin-bottom: 3vw;
        i {
          font-size: 4.5vw;
          margin-right: 2vw;
          color: @red-color;
        }
        input {
          outline: none;
          border: 0;
          background-color: rgb(247, 247, 247);
          font-size: 3.8vw;
        }
      }
    }
  }
  .btn {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 14vw;
    line-height: 14vw;
    background-color: @theme-color;
    color: #fff;
    font-size: 4.6vw;
    text-align: center;
  }
}
</style>
