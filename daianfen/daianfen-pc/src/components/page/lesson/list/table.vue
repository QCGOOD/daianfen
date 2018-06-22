<template>
  <div class="table-box">
    <el-table :data="tableData" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column :align="item.align || 'center'" :prop="item.prop" :label="item.label" v-for="(item, i) in propData" :key="i" v-if="!item.template"></el-table-column>
      <el-table-column :align="item.align || 'center'" v-else-if="item.template =='signStatus'" :label="item.label" :width="item.width" >
        <template slot-scope="scope">{{scope.row[item.prop] | signStatus }}</template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="text-align: center; padding: 10px; 0"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="1"
      :page-sizes="[10, 20, 30]"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next"
      :total="page.total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    tableData: Array,
    propData: Array,
    activeIndex: String,
    page: Object,
  },
  methods: {
    handleSizeChange (val) {
      this.$emit('size-change', this.activeIndex, val)
    },
    handleCurrentChange (val) {
      console.log(this.activeIndex)
      this.$emit('current-change', this.activeIndex, val)
    },
    handleSelectionChange (val) {
      this.$emit('get-selection', this.activeIndex, val)
    },
  },
  filters: {
    // 状态
    signStatus (val) {
      if (val === "") return ""
      switch (val) {
        case 1:
          return "待审核";
        case 2:
          return "审核通过";
        case 3:
          return "审核不通过";
        case 4:
          return "待支付";
        case 5:
          return "已支付";
        case 6:
          return "已报名";
        case 7:
          return "已退款";
        case 8:
          return "已取消";
      }
    },
  }
}
</script>

<style lang="less">
.table-box {
    border: 1px solid #f3f3f3;
    height: 600px;
    .el-table thead tr th {
      background-color: #f5f7fa;
    }
  }
</style>
