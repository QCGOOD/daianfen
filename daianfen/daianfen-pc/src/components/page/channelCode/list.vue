<template>
  <div class="wrap" ref="wrap">
    <div ref="search">
      <button-wrap>
        <el-button type="primary" size="mini" @click="add">添加</el-button>
        <el-button type="primary" size="mini" :disabled="tableList.id == null" @click="update">修改</el-button>
        <!-- <el-button type="danger" size="mini" :disabled="tableList.id == null" @click="deleteConfirm">删除</el-button> -->
      </button-wrap>
    </div>   
    <qc-table 
    ref="table" 
    :table-list="showData" 
    :search="searchData" 
    url="api/admin/v1/channel_code/page">
 </qc-table>
  <dig-form 
    :visible='digFormWrap' 
    :id="updateId" 
    @close="digClose"   
  ></dig-form>
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
        channelId: 'ce48380a9cf3476b9b6139e7067bd86d',
      },
      showData: [
        { template: "index" },
        { prop: "name", label: "渠道名称" },
        { prop: "code", label: "代码" },
        { prop: "createTime", label: "创建时间" },
      ]
    };
  },
  methods: {
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
      }).then(() => {
        this.delete();
      })
    },
    //提示
    delete() {
      api.deleteCategory(this.tableList.id).then(res => {
        this.searchKeep();
        this.$message({
          message: "删除成功",
          type: "success"
        });
      })
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
