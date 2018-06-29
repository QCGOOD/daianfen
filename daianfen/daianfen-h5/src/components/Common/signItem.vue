<template>
  <div class="sign-item vux-1px-t white">
    <div class="info-box">
      <div class="img">
        <img :src="item.headImage" alt="">
      </div>
      <div class="user">
        <p class="name">{{item.name | formatName}}</p>
        <p class="position">{{item.company}} <span v-if="item.company && item.position">|</span> {{item.position}}</p>
      </div>
    </div>
    <div class="time">
      {{item.signTimeStr}}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: Object
  },
  filters: {
    formatName(v) {
      return v.replace(/(.{1})(.*)/g,'$1**');
    },
    formatTime(v) {
      return v.replace(/(.*)(.{7})/g,'$1');
    }
  }
}
</script>

<style lang="less" scoped>
.sign-item {
  display: flex;
  justify-content: space-between;
  padding: 2vw 4vw;
  &:before {
    left: 4vw;
  }
  .info-box {
    display: inline-flex;
    .img {
      width: 10vw;
      height: 10vw;
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;
      margin-right: 4vw;
    }
    .user {
      font-size: 4vw;
      .position {
        color: @gray-color;
        font-size: 3.5vw;
      }
    }
  }
  .time {
    flex-shrink: 0;
    margin-left: 2vw;
    color: @gray-color;
    font-size: 3.5vw;
  }
}
</style>

