<template>
  <div class="skeleton-block">
    <div class="block"></div>
    <div class="block"></div>
    <div class="block"></div>
    <div class="block"></div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.skeleton-block {
  display: flex;
  justify-content: space-between;
  padding: 15px;
  .block{
    width: 75px;
    height: 75px;
    border-radius: 5px;
    background: #eee;
  }
}
</style>
