<template>
  <div class="wrap" ref="wrap">
    <div ref="header">
      <qc-header title='班级详情'></qc-header>
    </div>
    <div class="area-box" :style="{'height': `${areaHeight}px`}">
      <div class="top">
        <p class="title">{{model.name}}</p>
      </div>
      <el-menu mode="horizontal" :default-active="activeIndex" @select="handleSelect">
        <el-menu-item v-for="(item, i) in sidebarList" :key="i" :index="item.index">{{item.title}}</el-menu-item>
      </el-menu>
      <div>
        <div v-show="activeIndex === '1'">
          <qc-table ref="table" :autoHeight="autoHeight1" :table-list="showData" :search="searchData" url="api/admin/v1/memberCourseClass/page"></qc-table>
        </div>
        <div v-show="activeIndex === '2'">
          <div ref="search">
            <button-wrap>
              <el-button type="primary" size="mini" @click="insert()">添加课时</el-button>
              <el-button type="primary" size="mini" @click="update(1)" :disabled="tableList.id == null">修改课时</el-button>
              <el-button type="primary" size="mini" @click="update(2)" :disabled="tableList.id == null">复制课时</el-button>
              <el-button type="danger" size="mini" @click="deleteConfirm()" :disabled="tableList.id == null">删除课时</el-button>
              <el-popover placement="right" width="200" trigger="click">
              <img :src="imgHost + tableList.checkinQrcodeUrl" alt="" style="width: 100%;">
              <el-button slot="reference" type="info" size="mini" :disabled="tableList.id == null || tableList.checkinQrcodeUrl == null">二维码</el-button>
            </el-popover>
            </button-wrap>
          </div>
          <qc-table ref="table" :autoHeight="autoHeight2" :table-list="showData2" :search="searchData" url="api/admin/v1/courseClassLesson/page"></qc-table>
        </div>
      </div>
    </div>
    <dig-form :visible='digFormWrap' :id="updateId" :copy="copy" @close="digClose" :courseId="model.courseId" :courseClassId="model.id"></dig-form>

  </div>
</template>

<script>
import QcHeader from "common/QcHeader";
import ButtonWrap from "common/ButtonWrap";
import DigForm from "./form2";
import api from "api/common";
import { tableMixin } from "@/assets/js/tableMixin";

export default {
  mixins: [tableMixin],
  components: {
    QcHeader, DigForm, ButtonWrap
  },
  data() {
    return {
      digFormWrap: false,
      updateId: "",
      copy: false,
      searchData: {
        courseClassId: this.$route.query.id
      },
      showData: [
        { template: "index" },
        { prop: "name", label: "姓名" },
        { prop: "mobile", label: "手机" },
        { prop: "position", label: "职位" },
        { prop: "company", label: "公司" },
        { prop: "assignClassTime", label: "分配时间" },
        { prop: "memberId", label: "是否绑定", template: "Boolean" }
      ],
      showData2: [
        { template: "index" },
        { prop: "title", label: "标题" },
        { prop: "info", label: "简介" },
        { prop: "place", label: "地点" },
        { prop: "address", label: "地址" },
        { prop: "startTime", label: "开始时间" },
        { prop: "endTime", label: "结束时间" }
      ],
      model: {},
      tabbar: [
        { index: 1, name: '班级成员' },
        { index: 2, name: '课时安排' }
      ],
      sidebarList: [
        { index: "1", title: "班级成员" },
        { index: "2", title: "课时安排" }
      ],
      activeIndex: "1",
      areaHeight: 0,
      autoHeight1: 0,
      autoHeight2: 0
    }
  },
  created() {
    this.detail();
  },
  mounted() {
    this.getHeights();
    window.onresize = () => {
      this.getHeights();
    };
  },
  methods: {
    // 设置高度
    getHeights() {
      this.areaHeight = window.innerHeight - 230;
      this.autoHeight1 = window.innerHeight - 120 - 201 - 52;
      this.autoHeight2 = window.innerHeight - 120 - 201 - 52 - 49;
    },
    handleSelect(index) {
      if (index === this.activeIndex) return;
      this.activeIndex = index;
    },
    back() {
      this.$router.go(-1);
    },
    //获取
    detail() {
      api.getClass({ id: this.$route.query.id }).then(res => {
        console.log(res.data.data);
        this.model = res.data.data;
      });
    },
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
      api
        .deleteClassHour({ id: this.tableList.id })
        .then(res => {
          this.searchKeep();
          this.$message({
            message: "删除成功",
            type: "success"
          });
        });
    },
    insert() {
      this.isAdd = true;
      this.digFormWrap = true;
    },
    update(count) {
      if (count === 2) {
        this.copy = true;
      } else {
        this.copy = false;
      }
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
  }
}
</script>

<style lang="less">
.area-box {
  .top {
    height: 89px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #f3f3f3;
    width: 100%;
    .title {
      font-size: 22px;
      padding-left: 30px;
    }
    .desc {
      color: #686868;
      margin-top: 10px;
      padding-left: 30px;
      span {
        margin-right: 30px;
      }
    }
  }
}
</style>
