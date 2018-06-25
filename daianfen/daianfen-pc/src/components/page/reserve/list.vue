<template>
  <div class="wrap" ref="wrap">
    <div ref="search">
      <search-wrap>
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="">
            <el-input size="small" placeholder="专柜" v-model="searchData.shopName"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="searchData.status" size="small" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-date-picker size="small" value-format="yyyy-MM-dd" v-model="searchData.startDate" type="date" placeholder="开始时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="">
            <el-date-picker size="small" value-format="yyyy-MM-dd" v-model="searchData.endDate" type="date" placeholder="结束时间"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="search()">查询</el-button>
          </el-form-item>
        </el-form>
      </search-wrap>
    </div>
    <qc-table ref="table" :height="domHeight" :table-list="showData" :search="searchData" url="/reservation/list"></qc-table>
    <dig-form :visible='digFormWrap' :id="updateId" @close="digClose" ></dig-form>
    <account-form :visible='accountFormWrap' :id="updateId" @close="digClose" ></account-form>
  </div>
</template>

<script>
import { tableMixin } from "../../../assets/js/tableMixin";
import SearchWrap from "../../common/SearchWrap";
import ButtonWrap from "../../common/ButtonWrap";
import DigForm from "./form";
import AccountForm from "./accountForm";
import api from "api/common";
export default {
  mixins: [tableMixin],
  components: { SearchWrap, ButtonWrap, DigForm, AccountForm },
  data() {
    return {
      updateId: "",
      digFormWrap: false,
      accountFormWrap: false,
      options: [
        {value: 0,label: '全部'},
        {value: 1,label: '已预约'},
        {value: 2,label: '已到店'},
        {value: 3,label: '已取消'},
      ],
      searchData: {
        // curPage: '1',
        // size: '20',
        startDate: '',
        endDate: '',
        status: 1,
        shopName: ''
      },
      showData: [
        { prop: "img_url", label: "头像", template: "img", headImage: true },
        { prop: "member_name", label: "姓名" },
        { prop: "phone_no", label: "手机" },
        { prop: "shop_name", label: "专柜" },
        { prop: "reservation_date", label: "预约日期" },
        { prop: "reservation_time", label: "预约时间" },
        { prop: "id", label: "操作", template: 'mark'}
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
      api.deleteApp({ id: this.tableList.id }).then(res => {
        this.searchKeep();
        this.$message({
          message: "删除成功",
          type: "success"
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
      this.accountFormWrap = false;
      if (typeof flag == "boolean" && flag) {
        this.searchKeep();
      }
    },
    addAccount() {
      this.updateId = this.tableList.id;
      this.accountFormWrap = true;
    }
  }
};
</script>