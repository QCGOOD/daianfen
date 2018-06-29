<template>
  <div class="comment" ref="comment">
    <p class="title white">评论 (3)</p>
    <div class="context" :style="{ 'height': `${contextHeight}px`}">
      <comment-item v-for="(item, i) in 8" :key="i"></comment-item>
    </div>
    <div class="send white vux-1px-t" id="input">
      <input class="input"  type="text" @focus="onFocus" @blur="onBlur">
      <span>发送</span>
    </div>
  </div>
</template>

<script>
import CommentItem from './Common/commentItem'
export default {
  components: {
    CommentItem
  },
  data () {
    return {
      contextHeight: 0,
      isFocus: false,
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
      let title = document.querySelector('.title').offsetHeight
      let send = document.querySelector('.send').offsetHeight
      this.contextHeight = window.innerHeight - title - send
    },
    onFocus () {
      // document.querySelector('#input').scrollIntoView(true)
    },
    onBlur () {
      // document.querySelector('#input').scrollIntoView()
    }
  }
}
</script>

<style lang="less" scoped>
.hidden {
  overflow-y: hidden;
}
.comment {
  .title {
    font-size: 4vw;
    padding: 3vw;
  }
  .context {
    overflow-y: scroll;
  }
  .send {
    height: 14vw;
    padding: 0 4vw;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    .input {
      border: 1px solid @light-color;
      border-radius: 1vw;
      font-size: 4vw;
      height: 9vw;
      // outline: none;
      margin: 2.5vw 0;
      width: 80vw;
      padding: 0 2vw;
      box-sizing: border-box;
    }
    span {
      width: 10vw;
      text-align: right;
      display: inline-block;
    }
  }
}
</style>
