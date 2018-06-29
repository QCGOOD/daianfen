<template>
  <div>
    <router-view></router-view>
    <div>
      <div :style="{ 'height': `${bHeight}px`}"></div>
      <tabbar class="tabbar">
        <tabbar-item link="/activity" :selected="isActivity">
          <i slot="icon" class="iconfont" :class="[isActivity ? 'icon-huodong1' : 'icon-huodong']"></i>
          <span slot="label">活动</span>
        </tabbar-item>
        <tabbar-item link="/curriculum" :selected="isCurriculum">
          <i slot="icon" class="iconfont" :class="[isCurriculum ? 'icon-kecheng' : 'icon-kecheng1']"></i>
          <span slot="label">课程</span>
        </tabbar-item>
        <tabbar-item link="/user" :selected="isUser">
          <i slot="icon" class="iconfont" :class="[isUser ? 'icon-wode' : 'icon-wode1']"></i>
          <span slot="label">我的</span>
        </tabbar-item>
      </tabbar>
    </div>
  </div>
</template>

<script>
import { Tabbar, TabbarItem } from 'vux'

export default {
  components: {
    Tabbar, TabbarItem
  },
  data () {
    return {
      bHeight: 0,
    }
  },
  computed: {
    isActivity () {
      return /activity/.test(this.$route.path)
    },
    isUser () {
      return /user/.test(this.$route.path)
    },
    isCurriculum () {
      return /curriculum/.test(this.$route.path)
    }
  },
  mounted () {
    this.bHeight = document.querySelector('.tabbar').offsetHeight
    window.onresize = () => {
      this.bHeight = document.querySelector('.tabbar').offsetHeight
    }
  }
}
</script>

<style lang="less" scoped>
.tabbar {
  position: fixed;
  .iconfont {
    font-size: 5vw;
  }
  span {
    font-size: 3.6vw;
  }
}
</style>
