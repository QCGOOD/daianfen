<template>
  <div class="class">
    <div class="top">
      <div class="nav">
        <button-tab height="30">
          <button-tab-item style="font-size:3.8vw;border:1px solid rgb(226, 81, 60)">学习力排行</button-tab-item>
          <button-tab-item  style="font-size:3.8vw;border:1px solid rgb(226, 81, 60)" selected>影响力排行</button-tab-item>
        </button-tab>
      </div>
      <div class="user">
        <div class="rank">
          <p>5</p>
          <p>当前排名</p>
        </div>
        <div class="img">
          <img src="static/image/132.jpg" alt="">
        </div>
        <div class="rank">
          <p>5</p>
          <p>学习力</p>
          <!-- <p>影响力</p> -->
        </div>
      </div>
    </div>
    <div class="ranking white">
      <div class="item" :class="[i !== 0 ? 'vux-1px-t' : '']" v-for="(item, i) in 7" :key="i">
        <div class="left">
          <div class="sum">
            <img v-if="i === 0" src="static/image/jin.png" alt="">
            <img v-if="i === 1" src="static/image/yin.png" alt="">
            <img v-if="i === 2" src="static/image/tong.png" alt="">
            <span v-if="i > 2">3</span>
          </div>
          <div class="user-img">
            <img src="static/image/132.jpg" alt="">
          </div>
          <p>哈梅犯得上</p>
        </div>
        <div class="right">
          13131321分
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ButtonTab, ButtonTabItem } from 'vux'

export default {
  components: {
    ButtonTab, ButtonTabItem
  }
}
</script>

<style lang="less" scoped>
.vux-button-group > a.vux-button-tab-item-last:after{
  width:0;
  border:0;
}
.vux-button-group > a.vux-button-tab-item-first:after{
  width:0;
  border:0;
}
.class {
  .top {
    padding: 3vw 18vw;
    .user {
      margin-top: 5vw;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      .img {
        width: 15vw;
        height: 15vw;
        border-radius: 50%;
        overflow: hidden;
        border: 2px solid @red-color;
      }
      .rank {
        text-align: center;
        p {
          font-size: 3.4vw;
          color: @gray-color;
          line-height: 1.5;
          &:first-child {
            font-size: 6vw;
            font-weight: bold;
            color: #000;
          }
        }
      }
    }
  }
  .ranking {
    padding: 0 6vw;
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 4vw;
      padding: 2vw 0;
      .left {
        display: inline-flex;
        align-items: center;
        .sum {
          width: 5vw;
          flex-shrink: 0;
          margin-right: 3vw;
          text-align: center;
          color: @red-color;
        }
        .user-img {
          width: 9vw;
          height: 9vw;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
          margin-right: 3vw;
        }
      }
    }
  }
}
</style>
