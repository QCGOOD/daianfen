<template>
 <div class="wrap" ref="wrap">
    <div ref="search">
      <button-wrap>
        <el-button type="primary" size="mini" @click="release">发布日程</el-button>
      </button-wrap>
    </div>
    <div class="main">
      <div style="width:400px;">
        <calendar :domWidth="400" @pick-day="onPickDay"></calendar>
      </div>
      <qc-table class="qc-table" ref="table" :height="domHeight" :table-list="showData" :search="searchData" url="api/admin/v1/calendarEvent/page">
      </qc-table>
    </div>
    <dig-form v-if="digFromWrap" :visible="digFromWrap" :id="updateId" @close="close" ></dig-form>
  </div>
</template>

<script>
import { tableMixin } from "@/assets/js/tableMixin.js";
import SearchWrap from "common/SearchWrap";
import ButtonWrap from "common/ButtonWrap";
import Calendar from "./calendar";
import DigForm from "./form";
import api from "api/common.js";
export default {
  mixins: [tableMixin],
  components: { SearchWrap, ButtonWrap, DigForm, Calendar },
  data() {
    return {
      domHeight: 0,
      digFromWrap: false,
      updateId: "",
      searchData: {
        startTime: '',
        sourceType: 3
      },
      lessonList: [],
      showData: [
        { prop: "title", label: "标题" },
        // { prop: "sourceType", label: "来源" },
        // { prop: "id", label: "点赞数" },
        { prop: "startTime", label: "开始时间" },
        { prop: "endTime", label: "结束时间" },
        { prop: "createTime", label: "创建时间" },
      ]
    };
  },
  created() {
    let now = new Date();
    this.searchData.startTime = `${now.getFullYear()}-${(now.getMonth()+1) < 10 ?'0'+(now.getMonth()+1):now.getMonth()+1}`;
  },
  mounted () {
    // this.editor = UE.getEditor('editor')
    this.getHeight()
    window.onresize = () => {
      this.getHeight()
    }
  },
  methods: {
    onPickDay (val) {
      this.searchData.startTime = val
      this.searchKeep();
    },
    release() {
      this.$router.push('list/release')
    },
    // 设置高度
    getHeight () {
      this.wrapHeight = window.innerHeight - 80 - 40
      this.domHeight = this.wrapHeight - 50 - 61
    },
    insert () {
      // this.digFromWrap = true;
      this.$router.push(`lessonReview/form`)
    },
    detail () {
      // this.digFromWrap = true;
      this.$router.push(`lessonReview/detail?id=${this.tableList.id}&sourceId=${this.tableList.sourceId}`)
    },
    update () {
      this.updateId = this.tableList.id;
      this.$router.push(`lessonReview/form?id=${this.tableList.id}`)
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
  }
};
</script>
<style lang="less" scoped>
.main{
  display: flex;
  .qc-table{
    flex:1;
    border-left:1px solid #E4E7ED;
  }
}
</style>
