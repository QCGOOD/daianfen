<template>
  <div class="wrap" ref="wrap">
    <div ref="search">
      <button-wrap>
        <el-button type="primary" size="mini" @click="add">添加</el-button>
        <el-button type="primary" size="mini" :disabled="tableList.id == null" @click="update">修改</el-button>
        <el-button type="danger" size="mini" :disabled="tableList.id == null" @click="deleteConfirm">删除</el-button>
      </button-wrap>
    </div>  
    <qc-table ref="table" :table-list="showData" :search="searchData" url="api/v1/admin/store/page">
 </qc-table>
  <dig-form :visible='digFormWrap' :id="updateId" @close="digClose"></dig-form>
  </div>
</template>

<script>
import { tableMixin } from "@/assets/js/tableMixin";
import ButtonWrap from "common/ButtonWrap";
import SearchWrap from "common/SearchWrap";
import DigForm from "./form";
import api from "api/common.js";

export default {
  mixins: [tableMixin],
  components: { SearchWrap, ButtonWrap, DigForm },
  data() {
    return {
      storeList: "",
      updateId: "",
      digFormWrap: false,
      searchData: {
        isRelease: ""
      },
      showData: [
        { template: "index" },
        { prop: "logoIconUrl", label: "商标", template: "img", isPrefix: true },
        { prop: "name", label: "商户名称" },
        { prop: "industry", label: "行业" },
        { prop: "city", label: "城市" },
        { prop: "address", label: "地址" },
        { prop: "personInCharge", label: "负责人" },
        { prop: "mobile", label: "负责人手机号码" },
        { prop: "customerServiceNumbers", label: "客服电话" },
        { prop: "info", label: "商户说明" },
        { prop: "status", label: "状态", template: "merchant" },
        { prop: "auditStatus", label: "审批", template: 'auditStatus' },
        { prop: "auditBy", label: "审批者" },
        { prop: "isPlatformProduct", label: "是否使用平台的商品", template: 'Boolean' },
        { prop: "createTime", label: "创建时间" }
      ]
    };
  },
  created() {},
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
      api
        .deleteStore(this.tableList.id)
        .then(res => {
          this.searchKeep();
          this.$message({
            message: "删除成功",
            type: "success"
          });
        })
        .catch(err => {
          this.$message({
            message: err.data.errMsg,
            type: "error"
          });
        });
    },
    //修改
    update() {
      this.updateId = this.tableList.id;
      this.digFormWrap = true;
    },
    //双击行
    DbTableList() {
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
