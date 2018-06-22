<template>
  <div class="wrap" ref="wrap">
    <div ref="search">
      <search-wrap>
        <el-form :inline="true">
          <el-form-item label="名称">
            <el-input size="small" v-model="searchData.name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="search()">查询</el-button>
          </el-form-item>
        </el-form>
      </search-wrap>
      <button-wrap>
        <el-button type="primary" size="mini" @click="add">添加</el-button>
        <el-button type="primary" size="mini" :disabled="tableList.id == null" @click="update">修改</el-button>
        <el-button type="danger" size="mini" :disabled="tableList.id == null" @click="deleteConfirm">删除</el-button>
      </button-wrap>
    </div>   
    <qc-table ref="table" :table-list="showData" :search="searchData" url="api/admin/v1/attachment/page">
 </qc-table>
  <dig-form :visible='digFormWrap' :id="updateId" :categoryParent="categoryParent" @close="digClose"></dig-form>
  </div>
</template>

<script>
import { tableMixin } from "../../../assets/js/tableMixin";
import ButtonWrap from "../../common/ButtonWrap";
import SearchWrap from "../../common/SearchWrap";
import DigForm from "./form";
import api from "api/common.js";

export default {
  mixins: [tableMixin],
  components: { SearchWrap, ButtonWrap, DigForm },
  data() {
    return {
      updateId: "",
      digFormWrap: false,
      searchData: {
        parentId: "",
        name: "",
        categoryCode: 'index_rolling_picture',
      },
      showData: [
        { prop: "seqNum", label: "排序" },
        { prop: "url", label: "图片", template: "img", isPrefix: true },
        { prop: "name", label: "名称" },
        { prop: "href", label: "链接" },
        { prop: "note", label: "备注" },
        { prop: "createTime", label: "创建时间" }
      ],
      categoryType: true,
      categoryParent: {}
    };
  },
  // created() {
  //   this.treeByTypeCategory();
  // },
  methods: {
    treeByTypeCategory() {
      api.treeByTypeCategory({ type: 4 }).then(res => {
        let data = res.data.data[0];
        this.categoryParent = res.data.data[0];
        this.searchData.parentId = data.id;
        this.categoryType = false;
        this.search();
      })
    },
    //添加
    add() {
      this.digFormWrap = true;
    },
    //删除提示框
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
    //提示
    delete() {
      api.deleteAttachment({ id: this.tableList.id }).then(res => {
        this.searchKeep();
        this.$message({
          message: "删除成功",
          type: "success"
        });
      });
    },
    //修改
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
