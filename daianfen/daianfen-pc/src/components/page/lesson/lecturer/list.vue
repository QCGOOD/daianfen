<template>
  <div class="wrap" ref="wrap">
    <div ref="search">
      <button-wrap>
        <el-button type="primary" size="mini" @click="insert()">新增</el-button>
        <el-button type="primary" size="mini" @click="update()" :disabled="tableList.id == null">修改</el-button>
        <el-button type="danger" size="mini" @click="deleteConfirm()" :disabled="tableList.id == null">删除</el-button>
      </button-wrap>
    </div>
    <qc-table ref="table" :height="domHeight" :table-list="showData" :search="searchData" url="api/admin/v1/lecturer/page"></qc-table>
    <dig-form :visible='digFormWrap' :id="updateId" :cid="contentId" @close="digClose" ></dig-form>
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
      contentId: "",
      digFormWrap: false,
      searchData: {
        type: 3,
        name: ""
      },
      showData: [
        { template: "index" },
        { prop: "headImgUrl", label: "头像", template: "img", isPrefix: true },
        { prop: "name", label: "名称" },
        { prop: "info", label: "说明" },
        { prop: "createTime", label: "创建时间" }
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
        .deleteLecturer({ id: this.tableList.id })
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