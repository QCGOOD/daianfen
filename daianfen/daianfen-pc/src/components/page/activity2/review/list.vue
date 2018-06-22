<template>
 <div class="wrap" ref="wrap">
    <div ref="search">
      <!-- <search-wrap>
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="课程">
            <el-select size="small" v-model="searchData.sourceId">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="(item, index) in lessonList" :key="index" :label="item.title" :value="123456" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="search()">查询</el-button>
          </el-form-item>
        </el-form>
      </search-wrap> -->
      <button-wrap>
        <el-button type="primary" size="mini" @click="insert()">添加</el-button>
        <el-button type="primary" size="mini" :disabled="tableList.id == null" @click="update()">修改</el-button>
        <el-button type="primary" size="mini" :disabled="tableList.id == null" @click="detail()">详情</el-button>
        <el-button type="danger" size="mini" :disabled="tableList.id == null"  @click="deleteConfirm()">删除</el-button>
      </button-wrap>
    </div>
    <div>

    </div>
    <qc-table ref="table" :height="domHeight" :table-list="showData" :search="searchData" url="api/admin/v1/reviewSummary/page">
    </qc-table>
    <dig-form v-if="digFromWrap" :visible="digFromWrap" :id="updateId" @close="close" ></dig-form>
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
      digFromWrap: false,
      updateId: "",
      searchData: {
        pageNum: 1,
        pageSize: 20,
        sourceId: "",
        sourceType: 3
      },
      lessonList: [],
      showData: [
        { prop: "qrcodeUrl", label: "二维码", template: 'img', isQR: true },
        { prop: "title", label: "标题" },
        { prop: "praiseQuantity", label: "点赞数" },
        { prop: "visitQuantity", label: "阅读数" },
        { prop: "shareQuantity", label: "分享数" },
        { prop: "createTime", label: "创建时间" },
      ]
    };
  },
  created() {
    // this.getLesson()
  },
  methods: {
    insert () {
      // this.digFromWrap = true;
      this.$router.push(`review/form`)
    },
    detail () {
      // this.digFromWrap = true;
      this.$router.push(`review/detail?id=${this.tableList.id}&sourceId=${this.tableList.sourceId}`)
    },
    update () {
      this.updateId = this.tableList.id;
      this.$router.push(`review/form?id=${this.tableList.id}`)
      // this.digFromWrap = true;
    },
    deleteConfirm () {
      console.log(this.searchKeep)
      this.$confirm("是否删除该数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.delete()
      })
      .catch(() => {
        return
      })
    },
    delete () {
      api.deleteLessonReview({id: this.tableList.id}).then(res => {
        this.searchKeep()
        this.$message({
          message: "删除成功",
          type: "success"
        })
      }).catch(err => {
        this.$message({
          message: err.data.message,
          type: "error"
        })
      })
    },
    close(flag) {
      this.updateId = "";
      this.digFromWrap = false;
      if(typeof flag == 'boolean' && flag){
        this.searchKeep();
      }
    },
    getLesson() {
      let params = {
        page: 1,
      };
      api.getLesson().then(res => {
        console.log('课程',res.data);
        this.lessonList = res.data.data.list
      })
    }
  }
};
</script>
