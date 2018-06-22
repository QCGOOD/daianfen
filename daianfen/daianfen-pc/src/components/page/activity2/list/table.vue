<template>
  <div class="table-box">
    <el-table :data="tableData" @selection-change="handleSelectionChange" :highlight-current-row="currentRow" @row-click="handleRowClick" height="100%" style="overflow-y: auto;">
      <el-table-column type="selection" width="55" align="center" v-if="!currentRow"></el-table-column>
      <el-table-column :prop="item.prop" :label="item.label" v-for="(item, i) in propData" :key="i" v-if="!item.template" :align="item.align || 'center'"></el-table-column>
      <el-table-column :align="item.align || 'center'" v-else-if="item.template =='signStatus'" :label="item.label" :width="item.width" >
        <template slot-scope="scope">{{scope.row[item.prop] | signStatus }}</template>
      </el-table-column>
      <el-table-column :align="item.align || 'center'" v-else-if="item.template =='auditStatus'" :label="item.label" :width="item.width" >
        <template slot-scope="scope">{{scope.row[item.prop] | auditStatus }}</template>
      </el-table-column>
      <!--布尔值  -->
      <el-table-column :align="item.align || 'center'" v-else-if="item.template == 'Boolean'" :label="item.label" :width="item.width">
        <template slot-scope="scope">{{scope.row[item.prop]?"是":"否"}}</template>
      </el-table-column>
      <el-table-column :align="item.align || 'center'" v-else-if="item.template =='checkWay'" :label="item.label" :width="item.width" >
        <template slot-scope="scope">{{scope.row[item.prop] | checkWay }}</template>
      </el-table-column>
      <!--图片  -->
      <el-table-column align="center" v-else-if="item.template == 'img'" :label="item.label" :width="140">
        <template slot-scope="scope">
          <img style="display:block;margin:10px auto" src="http://athena-1255600302.cosgz.myqcloud.com/attachments/qc-logo.png" width="60" height="60" v-if="scope.row[item.prop] ==undefined || scope.row[item.prop] === ''">
          <img style="display:block;margin:10px auto" :src="`${imgHost}${scope.row[item.prop]}`" width="60" height="60" v-else-if="item.isPrefix">
          <img style="display:block;margin:10px auto" :src="`${scope.row[item.prop]}`" width="60" height="60" v-else-if="item.headImage">
          <img style="display:block;margin:10px auto" :src="scope.row[item.prop]" width="60" height="60" v-else>
        </template>
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
    currentRow: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit("size-change", this.activeIndex, val);
    },
    handleCurrentChange(val) {
      console.log(this.activeIndex);
      this.$emit("current-change", this.activeIndex, val);
    },
    handleSelectionChange(val) {
      console.log(val)
      this.$emit("get-selection", this.activeIndex, val);
    },
    handleRowClick(row) {
      this.$emit("row-click", row);
    }
  },
  filters: {
    // 状态
    signStatus(val) {
      if (val === "") return "";
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
    // 签到方式
    checkWay(val) {
      if (val === "") return "";
      switch (val) {
        case 1:
          return "手机签到";
        case 2:
          return "暗号签到";
        case 3:
          return "二维码";
      }
    },
    // 评论状态
    auditStatus(val) {
      if (val === "") return "";
      switch (val) {
        case 1:
          return "未审核";
        case 2:
          return "已审核";
        case 3:
          return "已拒绝";
      }
    }
  }
};
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
