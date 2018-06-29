<template>
  <div class="list-skeleton">
    <div class="img">
    </div>
    <div class="lists">
      <p class="list title"></p >
      <p class="list"></p >
      <p class="list w-60"></p >
    </div>
  </div>
</template>

<script>
export default {
};
</script>

<style lang="less" scoped>
.list-skeleton {
  display: flex;
  padding: 0 15px 15px;
  .img {
    width: 100px;
    height: 70px;
    background: #eee;
  }
  .lists {
    flex: 1;
    margin-left: 15px;
    .list {
      margin-bottom: 10px;
      height: 10px;
      background: #eee;
      &.title {
        height: 30px;
      }
      &.w-60 {
        width: 60%
      }
    }
  }
}
</style>
