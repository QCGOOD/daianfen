<template>
  <div class="wrap" ref="wrap">
    <div ref="search">
      <button-wrap>
        <el-button type="primary" size="mini" @click="insert()">添加</el-button>
        <el-button type="primary" size="mini" @click="update()" :disabled="tableList.id == null">修改</el-button>
        <el-button type="danger" size="mini" @click="deleteConfirm()" :disabled="tableList.id == null">删除</el-button>
      </button-wrap>
    </div>
    <qc-table ref="table" :table-list="showData" :search="searchData"  url="api/v1/admin/brand/page"></qc-table>
    <dig-form :visible='digFormWrap' :id="updateId" @close="digClose"></dig-form>
  </div>
</template>

<script>
import { tableMixin } from "@/assets/js/tableMixin";
import SearchWrap from "common/SearchWrap";
import ButtonWrap from "common/ButtonWrap";
import DigForm from "./form";
import api from "api/common";
export default {
  mixins: [tableMixin],
  components: { SearchWrap, ButtonWrap, DigForm },
  data() {
    return {
      updateId: "",
      digFormWrap: false,
      searchData: {
        // nickname: "",
        // mobile: ""
      },
      showData: [
        { prop: "seqNum", label: "排序", template: "seqNum", },
        { prop: "iconUrl", label: "图标", template: "img", isPrefix: true },
        { prop: "name", label: "名称" },
        { prop: "code", label: "代码" },
        { prop: "info", label: "说明" }
      ]
    };
  },
  methods: {
    deleteConfirm() {
      this.$confirm("是否删除该数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delete();
        })
        .catch(() => {
          return;
        });
    },
    delete() {
      api
        .deleteBrand({ id: this.tableList.id })
        .then(res => {
          this.searchKeep();
          this.$message({
            message: "删除成功",
            type: "success"
          });
        })
        .catch(err => {
          this.$message({
            message: err.data.data.errMsg,
            type: "error"
          });
        });
    },
    insert() {
      this.digFormWrap = true;
    },
    update() {
      this.updateId = this.tableList.id;
      this.digFormWrap = true;
    },

    digClose(flag) {
      this.updateId = "";
      this.digFormWrap = false;
      if (typeof flag == "boolean" && flag) {
        this.searchKeep();
      }
    }
  }
};
</script>