<template>
  <div class="wrap" ref="wrap">
    <div ref="search">
      <search-wrap>
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="">
            <el-input size="small" v-model="searchData.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-input size="small" v-model="searchData.phoneNo" placeholder="请输入手机"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="searchData.isRegist" size="small" placeholder="是否注册">
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
      <!-- <button-wrap v-if="base.transferMember">
        <el-button type="primary" size="mini" :disabled="tableList.id == null || tableList.distributer !== undefined" @click="transfer()">会员转业务员</el-button>
      </button-wrap> -->
    </div>
    <qc-table ref="table" :table-list="showData" :search="searchData" url="/member/page"></qc-table>
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
        name: "",
        phoneNo: "",
        isRegist: ""
      },
      options: [
        {value: true, label: '是'},
        {value: false, label: '否'},
      ],
      showData: [
        { template: "index" },
        { prop: "imgUrl", label: "头像", template: "img", headImage: true },
        { prop: "name", label: "姓名" },
        { prop: "nickName", label: "昵称" },
        { prop: "phoneNo", label: "手机" },
        { prop: "isRegist", label: "是否注册", template: 'Boolean' },
        { prop: "createTime", label: "创建时间" },
      ]
    };
  },
  created() {
    
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

