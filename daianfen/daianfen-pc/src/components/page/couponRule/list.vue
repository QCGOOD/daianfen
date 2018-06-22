<template>
  <div class="wrap" ref="wrap">
    <div ref="search">
      <button-wrap>
        <el-button type="primary" size="mini" @click="insert()">添加</el-button>
        <el-button type="primary" size="mini" @click="update()" :disabled="tableList.id == null">修改</el-button>
        <el-button type="primary" size="mini" @click="jumpPage()" :disabled="tableList.id == null">查看</el-button>
        <el-button type="primary" size="mini" @click="deleteConfirm(1)" :disabled="tableList.id == null || tableList.isPublished">发布</el-button>
        <el-button type="danger" size="mini" @click="deleteConfirm(2)" :disabled="tableList.id == null || tableList.isAborted">中止</el-button>
      </button-wrap>
    </div>
    <qc-table ref="table" :height="domHeight" :table-list="showData" :search="searchData" url="api/admin/v1/coupon_rule/list"></qc-table>
    <dig-form :visible='digFormWrap' :id="updateId" @close="digClose" ></dig-form>
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
      isAdd: true,
      digFormWrap: false,
      searchData: {
        ruleType: 2
      },
      showData: [
        { template: "index" },
        { prop: "ruleName", label: "规则名称" },
        { prop: "ruleType", label: "规则类型", template: "ruleType" },
        { prop: "isPublished", label: "发布", template: "Boolean" },
        { prop: "isAborted", label: "中止", template: "Boolean" }, 
        { prop: "ruleDescription", label: "规则描述" },
        { prop: "totalQuantity", label: "发券总数" },
        { prop: "ruleStartTime", label: "规则开始时间" },
        { prop: "ruleEndTime", label: "规则结束时间" },
        { prop: "createTime", label: "创建时间" }
      ]
    };
  },
  methods: {
    deleteConfirm(count) {
      let title = count === 1 ? '是否发布？发布后将不可修改。' : '是否中止？中止后无法继续领券。'
      this.$confirm(title, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (count === 1) this.publish();
          else this.delete();
        })
        .catch(() => {
          return;
        });
    },
    delete() {
      api
        .deleteCouponRule({ id: this.tableList.id })
        .then(res => {
          this.searchKeep();
          this.$message({
            message: "删除成功",
            type: "success"
          });
        })
    },
    publish() {
      api.publish({ id: this.tableList.id }).then(res => {
        this.searchKeep();
        this.$message({
          message: "发布成功",
          type: "success"
        });
      })
    },
    insert() {
      // this.isAdd=true
      // this.digFormWrap = true;
      this.$router.push(`couponRule/detail`);
    },
    update() {
      this.$router.push(`couponRule/detail?id=${this.tableList.id}`);
      // this.updateId = this.tableList.id;
      // this.isAdd=false
      // this.digFormWrap = true;
    },
    jumpPage() {
      this.$router.push(`couponRule/table?id=${this.tableList.id}`);
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
