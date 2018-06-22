<template>
 <div class="wrap" ref="wrap">
    <div ref="search">
      <!-- <search-wrap>
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="分类">
            <el-select size="small" v-model="searchData.type">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="(item, index) in 5" :key="index" label="经济学" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select size="small" v-model="searchData.status">
              <el-option label="全部" value=""></el-option>
              <el-option label="报名中" value="1"></el-option>
              <el-option label="已开课" value="2"></el-option>
              <el-option label="已结束" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="search()">查询</el-button>
          </el-form-item>
        </el-form>
      </search-wrap> -->
      <button-wrap>
        <el-button type="primary" size="mini" @click="insert()">添加</el-button>
        <el-button type="primary" size="mini" :disabled="tableList.id == null" @click="update(1)">修改</el-button>
        <el-button type="primary" size="mini" :disabled="tableList.id == null" @click="update(2)">复制</el-button>
        <el-button type="primary" size="mini" :disabled="tableList.id == null" @click="detail()">详情</el-button>
        <el-button type="primary" size="mini" :disabled="tableList.id == null || tableList.isRelease" @click="deleteConfirm(2)">发布</el-button>
        <el-button type="danger" size="mini" :disabled="tableList.id == null"  @click="deleteConfirm(1)">删除</el-button>
      </button-wrap>
    </div>
    <qc-table ref="table" :table-list="showData" :search="searchData" url="api/admin/v1/course/page">
    </qc-table>
    <!-- <dig-form v-if="digFromWrap" :visible="digFromWrap" :id="updateId" @close="close" ></dig-form> -->
  </div>
</template>

<script>
import { tableMixin } from "@/assets/js/tableMixin.js";
import SearchWrap from "common/SearchWrap";
import ButtonWrap from "common/ButtonWrap";
// import DigForm from "./form";
import api from "api/common.js";
export default {
  mixins: [tableMixin],
  components: { SearchWrap, ButtonWrap },
  data() {
    return {
      digFromWrap: false,
      updateId: "",
      searchData: {},
      typeList: [],
      showData: [
        { template: "index" },
        { prop: "iconUrl", label: "封面", template: "img", isPrefix: true },
        { prop: "title", label: "课程" },
        { prop: "educationalSystem", label: "学制" },
        { prop: "city", label: "城市" },
        // { prop: "place", label: "地点" },
        // { prop: "address", label: "详细地址" },
        { prop: "isRelease", label: "发布", template: "Boolean" },
        { prop: "createTime", label: "创建时间" }
      ]
    };
  },
  methods: {
    insert() {
      // this.digFromWrap = true;
      this.$router.push("list/release");
    },
    update(count) {
      this.updateId = this.tableList.id;
      // this.$router.push(`lessonRelease?id=${this.tableList.id}`);
      if (count === 1) {
        this.$router.push(`list/release?id=${this.tableList.id}`);
      } else {
        this.$router.push(`list/release?id=${this.tableList.id}&copy=true`);
      }
    },
    detail() {
      this.$router.push(`list/detail?id=${this.tableList.id}`);
    },
    deleteConfirm(count) {
      let text =
        count === 1 ? "是否删除该数据?" : "是否发布?";
      this.$confirm(text, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (count === 1) this.delete();
          else this.release();
        })
        .catch(() => {
          return;
        });
    },
    delete() {
      api
        .deleteLesson({ id: this.tableList.id })
        .then(res => {
          console.log(res);
          this.searchKeep();
          this.$message({
            message: "删除成功",
            type: "success"
          });
        })
        .catch(err => {
          this.$message({
            message: err.data.errMsg,
            type: "error"
          });
        });
    },
    release() {
      // console.log(this.tableList)
      // return false
      let model = Object.assign({}, this.tableList)
      model.isRelease = true
      api
        .updateLesson(model)
        .then(res => {
          this.loading = false;
          console.log(res);
          this.$message({
            message: "发布成功",
            type: "success"
          });
          setTimeout(() => {
            this.$router.go(-1);
          }, 500);
        })
        .catch(err => {
          this.loading = false;
        });
    },
    close(flag) {
      this.updateId = "";
      this.digFromWrap = false;
      if (typeof flag == "boolean" && flag) {
        this.searchKeep();
      }
    }
  }
};
</script>
