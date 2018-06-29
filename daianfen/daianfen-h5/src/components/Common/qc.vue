<template>
  <div class="qchd" :class="{'fixed': fixed}" ref="qc" >
    <img src="static/image/logo.png" alt="" @click="jumpPage()">
  </div>
</template>

<script>
export default {
  name: 'Qc',
  props: {
    fixed: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      height: 0
    }
  },
  mounted() {
    this.height = this.$refs.qc.offsetHeight;
  },
  methods: {
    jumpPage() {
      location.href = 'http://m.wego168.com/m/index.html?from=abs'
    }
  }
}
</script>

<style lang="less" scoped>
.fixed {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0);
}
.qchd {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4vw 0;
  img {
    width: 38vw;
  }
  span {
    color: #c5c5c5;
    font-size: 3.5vw;
    margin-left: 4vw;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      width: 1px;
      left: -2vw;
      top: 1vw;
      bottom: 1vw;
      border-left: 1px solid #c5c5c5;
      // transform: scaleX(0.5);
    }
  }
}
</style>
