<template>
  <div class="wrap" ref="wrap">
    <div ref="search">
      <search-wrap>
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="">
            <el-input size="small" placeholder="起始编号" v-model="searchData.couponsNo"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-input size="small" type="number" maxlength="11" placeholder="手机" v-model.number="searchData.phoneNo"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="searchData.useState" size="small" placeholder="状态">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="searchData.couponsBreed" size="small" placeholder="类型">
              <el-option
                v-for="item in options2"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="search()">查询</el-button>
          </el-form-item>
        </el-form>
      </search-wrap>
    </div>
    <qc-table ref="table" :height="domHeight" :table-list="showData" :search="searchData" url="/coupons/search"></qc-table>
  </div>
</template>

<script>
import { tableMixin } from "../../../assets/js/tableMixin";
import SearchWrap from "../../common/SearchWrap";
import ButtonWrap from "../../common/ButtonWrap";
export default {
  mixins: [tableMixin],
  components: { SearchWrap, ButtonWrap },
  data() {
    return {
      options: [
        {value: '',label: '全部'},
        {value: '未使用',label: '未使用'},
        {value: '已使用',label: '已使用'},
      ],
      options2: [
        {value: '',label: '全部'},
        {value: 1,label: 'CRM优惠券'},
        {value: 2,label: '系统优惠券'},
      ],
      searchData: {
        // curPage: '1',
        // size: '20',
        // startDate: '2018-04-21',
        // endDate: '2018-05-21',
        couponsBreed: '',
        phoneNo: '',
        couponsNo: '',
        useState: '',
      },
      showData: [
        { prop: "content", label: "", template: 'couponContent', expand: true },
        { prop: "couponsNo", label: "编号" },
        { prop: "par", label: "金额" },
        { prop: "useState", label: "状态" },
        { prop: "couponsBreed", label: "来源", template: 'couponsBreed' },
        { prop: "couponsType", label: "类型" },
        { prop: "receiveTime", label: "领取时间", template: 'date' },
        { prop: "content", label: "标题", template: 'couponContent' },
        { prop: "phoneNo", label: "手机" },
        { prop: "employeeName", label: "核销人" },
        { prop: "shopName", label: "专柜" },
      ]
    };
  },
  methods: {
   
  }
};
</script>