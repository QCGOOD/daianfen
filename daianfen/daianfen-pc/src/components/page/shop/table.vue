<template>
  <div class="wrap" ref="wrap">
    <div ref="search">
      <button-wrap style="background: #fafbfc;">
        <el-button size="small" @click="back">返回</el-button>
      </button-wrap>
      <search-wrap>
        <el-form :inline="true" class="demo-form-inline">
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
    <qc-table ref="table" :height="domHeight" :table-list="showData" :search="searchData" :url="`/reservation/list?shopId=${$route.query.shopId}`"></qc-table>
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
        {value: 1,label: '已预约'},
        {value: 2,label: '已到店'},
        {value: 3,label: '已取消'},
      ],
      searchData: {
        status: 1,
        shopId: ''
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
  created() {
    this.searchData.shopId = this.$route.id
  },
  methods: {
   back() {
     this.$router.go(-1)
   }
  }
};
</script>