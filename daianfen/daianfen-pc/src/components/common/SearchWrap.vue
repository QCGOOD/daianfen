<template>
  <div class="search-wrap">
    <slot></slot>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less">
.search-wrap {
  padding: 10px 16px 0;
  border-bottom: 1px solid #eee;
  background: #fafbfc;
  .el-form-item {
    margin-bottom: 10px !important;
    input {
      width: 120px !important;
    }
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner{
     width: 200px !important;
  }
  .el-form-item .el-date-editor input {
    width: 100% !important;
  }
  .el-form--inline .el-form-item__label{
    line-height: 30px;
  }
  .el-form-item__content{
    line-height: 0;
  }
}
</style>
