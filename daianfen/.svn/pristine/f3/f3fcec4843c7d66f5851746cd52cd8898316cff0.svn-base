<template>
    <header class="header">
      <el-button @click="back()" type="primary" size="mini" class="back" v-if="isBack">
        <i class="iconfont icon-fanhui"></i>返回
      </el-button>
      <p>{{title}}</p>
    </header>
</template>

<script>
export default {
  props: {
    title: String,
    isBack: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    back() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="less" scopend>
.header {
  height: 50px;
  line-height: 50px;
  background: #f1f1f1;
  text-align: center;
  .back {
    float: left;
    margin: 11px 10px;
  }
}
</style>
