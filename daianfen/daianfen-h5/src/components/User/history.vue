<template>
  <div class="history white" :style="{ 'height': `${height}px`}">
    <div class="list">
      <div class="item" :class="[i === 4 ? 'today' : '']" v-for="(item, i) in 5" :key="i">
        <div class="line">
          <div class="cricle"></div>
        </div>
        <div class="text">
          <p class="time">2018.05.23 8:20-9:00</p>
          <p class="title">课程：《法师打飞机爬升》撒娇幅度萨芬卡萨丁师傅究竟哦加哦打发时间</p>
        </div>
      </div>
    </div>
    <qc :fixed="true"></qc>
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
    }
  }
}
</script>

<style lang="less" scoped>
.history {
  padding: 4vw;
  box-sizing: border-box;
  .list {
    .item {
      margin-bottom: 5vw;
      display: flex;
      position: relative;
      .line {
        flex-shrink: 0;
        margin-right: 3vw;
        position: relative;
        width: 3vw;
        .cricle {
          width: 3vw;
          height: 3vw;
          background-color: rgb(204, 204, 204);
          border-radius: 50%;
        }
        &:after {
          content: '';
          position: absolute;
          border-left: 1px solid rgb(204, 204, 204);
          width: 1px;
          left: 50%;
          transform: translateX(-50%);
          top: 0;
          bottom: -5vw;
        }
      }
      .text {
        line-height: 1;
        .time {
          color: rgb(204, 204, 204);
          font-size: 3.6vw;
          margin-bottom: 2vw;
        }
        .title {
          font-size: 3.8vw;
          line-height: 1.5;
        }
      }
    }
    .today {
      .line {
        &:after {
          border: 0;
        }
      }
      .text {
        .title {
          color: @red-color;
        }
      }
    }
  }
}
</style>

