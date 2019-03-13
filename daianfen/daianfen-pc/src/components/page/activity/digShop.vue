<template>
  <el-dialog class="store-dialog" title="选择专柜" v-loading="loading" :visible.sync="visible" width="700px" :append-to-body="true" :before-close="close" :close-on-click-modal="false" :close-on-press-escape="false">
    <search-wrap>
      <el-form :inline="true">
        <el-form-item label="编号">
          <el-input size="small" v-model="search.shopNo" clearable></el-input>
        </el-form-item>
        <el-form-item label="专柜">
          <el-input size="small" v-model="search.shopName" clearable></el-input>
        </el-form-item>
        <el-form-item label="城市">
          <el-input size="small" v-model="search.city" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="onSearch()">搜索</el-button>
        </el-form-item>
      </el-form>
    </search-wrap>
    <!-- <qc-table ref="table" :table-list="model.show" :search="model.search" :autoHeight="500" url="api/admin/v1/print_store/page"></qc-table> -->
    <div class="table" style="height: 400px;margin: 0;">
      <el-table :data="tableData" height="100%" ref="tabel" style="width: 100%;overflow-y: auto;" highlight-current-row @selection-change="selection" element-loading-text="数据加载中">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column v-for="(item, index) in showData" :key="index" :prop="item.prop" :label="item.label" :width="item.width || ''" align="left"></el-table-column>
      </el-table>
    </div>
    <div style="text-align:center;padding:10px 0;border-bottom: 1px solid #ebeef5;">
      <el-pagination layout="prev, pager, next, sizes" :page-sizes="[10, 20, 30]" :page-size="search.size" :current-page="search.curPage" :total="search.total" @size-change="onChangeSize" @current-change="onChangePage"></el-pagination>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="close(false)">取 消</el-button>
      <el-button size="small" @click="submit" :disabled="!tableId.length">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import api from "api/common.js";
import { TABLE } from "@/mixins";
import SearchWrap from "common/SearchWrap";

export default {
  mixins: [TABLE],
  components: { SearchWrap },
  props: {
    visible: Boolean,
    id: {
      type: String,
      default: ""
    },
    shopTags: {
      type: Array,
      default: []
    },
  },
  data() {
    return {
      tableApi: "/shop/list",
      tableId: [],
      search: {
        shopName: "",
        city: "",
        shopNo: ""
      },
      showData: [
        { prop: "shopNo", label: "编号" },
        { prop: "shopName", label: "专柜",  width: '250' },
        { prop: "shopType", label: "渠道" },
        { prop: "city", label: "城市" },
        // { prop: "createTime", label: "创建时间" }
      ],
      loading: false
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.onSearch();
      }
    },
    tableData() {
      // this.$nextTick(_ => {
      //   console.log(this.shopTags)
      //   for (var i = 0;i<this.shopTags.length;i++) {
      //     for (var j = 0;j<this.tableData.length;j++) {
      //       if ((this.shopTags[i].id || this.shopTags[i].shopId) == this.tableData[j].id) {
      //         this.$ref.table.toggleRowSelection(this.tableData[j], true)
      //         console.log(this.tableId[i].shopName)
      //       }
      //     }
      //   }
        
      // })
    }
  },
  methods: {
    selection(row) {
      this.tableId = row;
      console.log(this.tableId)
    },
    submit() {
      this.$emit("submit", this.tableId);
      this.close(true);
    },
    //删除提示框
    handleDelete(id) {
      this.$confirm("是否删除该数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delete(id);
        })
        .catch(() => {
          return;
        });
    },
    //删除
    delete(id) {
      api.delAdminStoreSubscribeApp({ id: id }).then(res => {
        this.$message({
          message: "删除成功",
          type: "success"
        });
        this.onSearchRefresh();
      });
    },
    close(flag) {
      this.$emit("close", flag);
    }
  }
};
</script>

<style lang="less" scoped>
.store-dialog {
  /deep/.el-dialog__body {
    padding: 20px;
    padding-bottom: 10px;
  }
}
</style>

