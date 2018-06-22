<template>
 <div class="wrap" ref="wrap">
    <div ref="search">
      <search-wrap>
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="订单号">
            <el-input clearable size="small" v-model="searchData.orderNo"></el-input>
          </el-form-item>
          <el-form-item label="订单名称">
            <el-input clearable size="small" v-model="searchData.name"></el-input>
          </el-form-item>
          <el-form-item label="支付状态">
            <el-select size="small" v-model="searchData.payStatus">
              <el-option label="全部" value=""></el-option>
              <el-option label="新建" :value="1"></el-option>
              <el-option label="进行中" :value="2"></el-option>
              <el-option label="交易成功" :value="3"></el-option>
              <el-option label="失败" :value="-1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收件人">
            <el-input clearable size="small" v-model="searchData.receiver"></el-input>
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input clearable size="small" v-model="searchData.mobile"></el-input>
          </el-form-item>
          <el-form-item label="开始时间">
            <el-date-picker type="datetime" size="small" placeholder="选择日期" v-model="searchData.startCreateTime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker type="datetime" size="small" placeholder="选择日期" v-model="searchData.endCreateTime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="search()">查询</el-button>
          </el-form-item>
        </el-form>
      </search-wrap>
      <button-wrap>
        <el-button type="primary" size="mini" @click="update()" :disabled="tableList.id == null">修改订单物流</el-button>
      </button-wrap>
    </div>
    <qc-table ref="table" :height="domHeight" :tongji="1" :table-list="showData" :search="searchData" url="api/v1/admin/order/page">
    </qc-table>
    <dig-form :visible="digFormWrap" :id="updateId" @close="digClose" ></dig-form>
  </div>
</template>

<script>
import { tableMixin } from "@/assets/js/tableMixin.js";
import SearchWrap from "common/SearchWrap";
import ButtonWrap from "common/ButtonWrap";
import DigForm from "./form";
import api from "api/common.js";
export default {
  mixins: [tableMixin],
  components: { SearchWrap, ButtonWrap, DigForm },
  data() {
    return {
      digFormWrap: false,
      updateId: "",
      searchData: {
        orderNo: "",
        name: "",
        payStatus: "",
        receiver: "",
        mobile: "",
        startCreateTime: "",
        endCreateTime: ""
      },
      showData: [
        { template: "index" },
        { prop: "orderNo", label: "订单编号" },
        { prop: "name", label: "订单名称" },
        { prop: "totalAmount", label: "订单金额", template: "price" },
        { prop: "qty", label: "数量" },
        { prop: "payStatus", label: "支付状态", template: "payStatus" },
        { prop: "receiver", label: "收件人" },
        { prop: "mobile", label: "手机号码" },
        { prop: "address", label: "收货地址" },
        { prop: "logisticsCompany", label: "物流公司" },
        { prop: "logisticsNo", label: "物流编号" },
        { prop: "createTime", label: "创建时间" },
      ],
      store: [],
      summary: {}
    };
  },
  created() {
    let date = this.util.nowDate("t");
    this.searchData.startCreateTime = `${date} 00:00:00`;
    this.searchData.endCreateTime = `${date} 23:59:59`;

  },
  methods: {  
    update () {
      this.updateId = this.tableList.id;    
      this.digFormWrap = true;
    },
    digClose (flag) {
      this.updateId = "";
      this.digFormWrap = false;
      if (typeof flag == "boolean" && flag) {
        this.searchKeep();
      }
    }
  }
};
</script>
