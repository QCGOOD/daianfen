<template>
  <div class="wrap" ref="wrap">
    <div ref="search">
      <button-wrap>
        <el-button type="primary" size="mini" @click="insert()">添加</el-button>
        <el-button type="primary" size="mini" @click="update()" :disabled="tableList.id == null">修改</el-button>
        <el-button type="danger" size="mini" @click="deleteConfirm()" :disabled="tableList.id == null">删除</el-button>
        <el-button type="primary" size="mini" @click="detail()" :disabled="tableList.id == null">编辑学员和排课</el-button>
        <upload-file :id="tableList.id" :data="{classId: tableList.id}" title="导入班级学员" url="api/admin/v1/courseClass/importMember"></upload-file>
      </button-wrap>
    </div>
    <qc-table ref="table" :table-list="showData" :search="searchData" url="api/admin/v1/courseClass/page"></qc-table>
    <dig-form :visible='digFormWrap' :id="updateId" @close="digClose"></dig-form>
  </div>
</template>

<script>
import { tableMixin } from "@/assets/js/tableMixin";
import SearchWrap from "common/SearchWrap";
import ButtonWrap from "common/ButtonWrap";
import uploadFile from "common/UpLoadFile";
import DigForm from "./form";
import api from "api/common";
export default {
  mixins: [tableMixin],
  components: { SearchWrap, ButtonWrap, DigForm, uploadFile },
  data() {
    return {
      updateId: "",
      isAdd: true,
      digFormWrap: false,
      searchData: {
        // type: 4
        // nickname: "",
        // mobile: ""
      },
      showData: [
        { template: "index" },
        { prop: "name", label: "名称" },
        { prop: "info", label: "简介" },
        { prop: "courseTitle", label: "课程" },
        { prop: "lecturerName", label: "讲师" },
        { prop: "num", label: "人数" },
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
        .deleteClass({ id: this.tableList.id })
        .then(res => {
          this.searchKeep();
          this.$message({
            message: "删除成功",
            type: "success"
          });
        });
    },
    insert() {
      this.isAdd = true;
      this.digFormWrap = true;
    },
    update() {
      this.updateId = this.tableList.id;
      this.digFormWrap = true;
    },
    detail() {
      this.$router.push(`class/detail?id=${this.tableList.id}`)
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