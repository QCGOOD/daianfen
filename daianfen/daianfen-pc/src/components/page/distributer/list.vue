<template>
  <div class="wrap" ref="wrap">
    <div ref="search">
      <search-wrap>
        <el-form :inline="true" class="demo-form-inline" size="small">
          <el-form-item label="会员名称">
            <el-input v-model="searchData.name"></el-input>
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input v-model="searchData.mobile"></el-input>
          </el-form-item>
          <el-form-item label="审核状态">
            <el-select v-model="searchData.status" placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option label="待审核" value="1"></el-option>
              <el-option label="已审核" value="2"></el-option> 
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="search()">查询</el-button>
          </el-form-item>
        </el-form>
      </search-wrap>
      <button-wrap>
        <el-button type="primary" size="mini" :loading="loading" :disabled="tableList.id == null || tableList.status === 2" @click="distributerAudit()">业务员审核</el-button>
      </button-wrap>
    </div>
    <qc-table ref="table" :table-list="showData" :search="searchData" url="api/admin/v1/distributer/page"></qc-table>
    <!-- <dig-form :visible='digFormWrap' :id="updateId" @close="digClose"></dig-form> -->
  </div>
</template>

<script>
import { tableMixin } from "../../../assets/js/tableMixin";
import SearchWrap from "../../common/SearchWrap";
import ButtonWrap from "../../common/ButtonWrap";
// import DigForm from "./form";
import api from "api/common";
export default {
  mixins: [tableMixin],
  components: { SearchWrap, ButtonWrap },
  data() {
    return {
      updateId: "",
      digFormWrap: false,
      searchData: {
        name: "",
        mobile: "",
        status: '',
      },
      showData: [
        { template: "index" },
        { prop: "name", label: "名称" },
        { prop: "mobile", label: "手机号码" },
        { prop: "number", label: "编号" },
        { prop: "status", label: "审核状态", template: "disAudit" },
        { prop: "createTime", label: "创建时间" }
      ],
      loading: false
    };
  },
  methods: {
    distributerAudit() {
      this.loading = true;
      api.distributerAudit({ id: this.tableList.id }).then(res => {
        this.loading = false;
        this.searchKeep();
        this.$message({
          message: "审核成功",
          type: "success"
        });
      }).catch(err => {
        this.loading = false;
      })
    },
  }
};
</script>

