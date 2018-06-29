<template>
  <div class="comment-item vux-1px-t white">
    <div class="info-box">
      <div class="img">
        <img src="static/image/132.jpg" alt="">
      </div>
      <div class="user">
        <p class="name">
          <span>哈妹</span>
          <span>企成科技 | 前端</span>
        </p>
        <p class="context">
          都是金佛i是山东福建是东方的说法就是错的是第三方角度来说就了多少房间
        </p>
      </div>
    </div>
    <div class="time">
      2小时前
    </div>
  </div>
</template>

<style lang="less" scoped>
.comment-item {
  display: flex;
  justify-content: space-between;
  padding: 3vw 4vw;
  &:before {
    left: 4vw;
  }
  .info-box {
    display: inline-flex;
    .img {
      width: 14vw;
      height: 14vw;
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;
      margin-right: 4vw;
    }
    .user {
      font-size: 4vw;
      .name {
         span:last-child {
           color: @gray-color;
         }
      }
      .context {
        color: @dark-color;
        margin-top: 1vw;
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
