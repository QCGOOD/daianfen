<template>
  <div class="wrap" ref="wrap">
    <div ref="search">
      <search-wrap>
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="">
            <el-input size="small" placeholder="起始编号" v-model="searchData.name"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-input size="small" type="number" maxlength="11" placeholder="手机" v-model.number="searchData.name"></el-input>
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
        {value: 0,label: '全部'},
        {value: 1,label: '未使用'},
        {value: 2,label: '已使用'},
      ],
      searchData: {
        // curPage: '1',
        // size: '20',
        // startDate: '2018-04-21',
        // endDate: '2018-05-21',
        status: 0,
        shopName: ''
      },
      showData: [
        { prop: "content", label: "", template: 'expand' },
        { prop: "couponsNo", label: "编号" },
        { prop: "par", label: "金额" },
        { prop: "useState", label: "状态" },
        { prop: "receiveTime", label: "领取时间" },
        { prop: "title", label: "标题" },
        { prop: "phoneNo", label: "手机" },
      ]
    };
  },
  methods: {
   
  }
};
</script>