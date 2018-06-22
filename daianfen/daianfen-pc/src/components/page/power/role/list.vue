<template>
  <div class="wrap" ref="wrap">
    <div ref="search">
      <search-wrap>
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="用户名">
            <el-input size="small" v-model="searchData.name"></el-input>
          </el-form-item>
          <el-form-item label="角色">
            <el-input size="small" v-model="searchData.role"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="search()">查询</el-button>
          </el-form-item>
        </el-form>
      </search-wrap>
      <button-wrap>
        <el-button type="primary" size="mini" @click="insert()">添加</el-button>
        <el-button type="primary" size="mini" @click="update()" :disabled="tableList.id == null">修改</el-button>
        <el-button type="primary" size="mini" @click="detail()" :disabled="tableList.id == null">编辑权限</el-button>
        <el-button type="danger" size="mini" @click="deleteConfirm()" :disabled="tableList.id == null">删除</el-button>
      </button-wrap>
    </div>
    <qc-table ref="table" :height="domHeight" :table-list="showData" :search="searchData" url="api/v1/admin/role/page"></qc-table>
    <dig-form :visible='digFormWrap' :id="updateId" @close="digClose" ></dig-form>
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
      isAdd:true,
      digFormWrap: false,
      searchData: {
        name: "",
        role: ""
      },
      showData: [
        { template: "index" },
        { prop: "name", label: "角色名" },
        { prop: "role", label: "角色标识" },
        { prop: "description", label: "角色信息" },
        { prop: "isFrozen", label: "是否冻结", template: 'Boolean' },
        { prop: "createTime", label: "创建时间" },
      ]
    };
  },
  methods: {
    deleteConfirm () {
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
      api.deleteRole({id:this.tableList.id}).then(res => {
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
      this.isAdd=true
      this.digFormWrap = true;
    },
    update() {
      this.updateId = this.tableList.id;   
      this.isAdd=false     
      this.digFormWrap = true;
    },
    detail() {
      this.$router.push(`role/detail?id=${this.tableList.id}`)
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
