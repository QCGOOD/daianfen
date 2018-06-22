<template>
  <div class="wrap" ref="wrap">
    <div ref="search">
      <search-wrap>
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="会员名称">
            <el-input size="small" v-model="searchData.name"></el-input>
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input size="small" v-model="searchData.mobile"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="search()">查询</el-button>
          </el-form-item>
        </el-form>
      </search-wrap>
      <button-wrap v-if="base.transferMember">
        <el-button type="primary" size="mini" :disabled="tableList.id == null || tableList.distributer !== undefined" @click="transfer()">会员转业务员</el-button>
      </button-wrap>
    </div>
    <qc-table ref="table" :table-list="showData" :search="searchData" url="api/admin/v1/member/page"></qc-table>
    <dig-form :visible='digFormWrap' :id="updateId" @close="digClose"></dig-form>
  </div>
</template>

<script>
import { tableMixin } from "../../../assets/js/tableMixin";
import SearchWrap from "../../common/SearchWrap";
import ButtonWrap from "../../common/ButtonWrap";
import DigForm from "./form";
import api from "api/common";
export default {
  mixins: [tableMixin],
  components: { SearchWrap, ButtonWrap, DigForm },
  data() {
    return {
      updateId: "",
      digFormWrap: false,
      a: undefined,
      searchData: {
        username: "",
        number: "",
        mobile: ""
      },
      showData: [
        { template: "index" },
        { prop: "headImage", label: "头像", template: "img", headImage: true },
        { prop: "name", label: "会员名称" },
        { prop: "mobile", label: "手机号码" },
        { prop: "sex", label: "性别", template: "sex" },
        { prop: "company", label: "公司" },
        { prop: "position", label: "职位" },
        { prop: "createTime", label: "创建时间" },
      ]
    };
  },
  created() {
    if (this.base.transferMember) {
      this.showData.push(
        { prop: "distributer", label: "业务员", template: "Boolean" }
      )
    }
    
  },
  methods: {
    transfer() {
      this.updateId = this.tableList.id;
      this.digFormWrap = true;
    },
    digClose(flag) {
      this.updateId = "";
      this.digFormWrap = false;
      if (typeof flag == "boolean" && flag) {
        this.searchKeep();
      }
    },
    detail() {
      this.$router.push(`member/detail?id=${this.tableList.id}`);
    },
    fileSuccess(res) {
      console.log(res);
      if (res.code == 0) {
        this.searchKeep();
        this.$message({
          message: "导入成功",
          type: "success",
          duration: 0,
          showClose: true
        });
      } else {
        this.$message({
          message: res.message,
          type: "error",
          duration: 0,
          showClose: true
        });
      }
    },
    beforeAvatarUpload(file) {
      const type =
        file.name.split(".")[1] == "xlsx" || file.name.split(".")[1] == "xls";
      if (!type) {
        this.$message.error("请上传xlsx或xls");
      }
      return type;
    }
  }
};
</script>

