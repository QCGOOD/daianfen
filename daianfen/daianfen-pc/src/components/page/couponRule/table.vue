<template>
  <div class="wrap" ref="wrap">
    <!-- <div ref="search">
      <button-wrap>
        <el-button type="primary" size="mini" @click="insert()">添加</el-button>
        <el-button type="primary" size="mini" @click="update()" :disabled="tableList.id == null">修改</el-button>
        <el-button type="primary" size="mini" @click="jumpPage()" :disabled="tableList.id == null">查看</el-button>
      </button-wrap>
    </div> -->
    <qc-table ref="table" :height="domHeight" :table-list="showData" :search="searchData" :url="`api/admin/v1/coupon/page?ruleId=${$route.query.id}`"></qc-table>
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
        { prop: "memberHeadImage", label: "头像", template: 'img' },
        { prop: "memberName", label: "昵称" },
        { prop: "status", label: "状态", template: "couponStatus" },
        { prop: "createTime", label: "领取时间" },
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
