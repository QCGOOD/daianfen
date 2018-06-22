<template>
  <div class="wrap" ref="wrap" :style="{'height': `${wrapHeight}px`}">
    <div ref="header">
      <qc-header title='课程回顾详情'></qc-header>
    </div>
    <div class="area-box" :style="{'height': `${areaHeight}px`}">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="金句" name="first">
          <el-card class="gold">
            <div class="gold-item" v-if="model.shortSentenceList.length == 0">暂无数据</div>
            <div class="gold-item" v-else v-for="(item, index) in model.shortSentenceList" :key="index">
              <p>
                <span style="width: 50px;">{{item.sort}}</span>
                {{item.content}}
              </p>
            </div>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="课后感" name="second">
          <table-box 
            :tHeight="areaHeight - 52" 
            :tableData="checkData.tableData" 
            style="margin-top:-15px;" 
            @get-selection="getSelection" 
            @current-change="handleCurrentChange" 
            @size-change="handleSizeChange"
            :propData="checkData.propData" 
            :page="checkData.page">
          </table-box>
        </el-tab-pane>
      </el-tabs>
      
    </div>
  </div>
</template>

<script>
import { tableMixin } from "@/assets/js/tableMixin.js";
import tableBox from './table'
import QcHeader from "common/QcHeader"
import api from "api/common"

export default {
  mixins: [tableMixin],
  components: {
    QcHeader, tableBox
  },
  data () {
    return {
      activeName: 'first',
      model: {
        id: '',
        shortSentenceList: [],
        content: '',
      },
      checkData: {
        tableData: [],
        propData: [
          { prop: "iconUrl", label: "封面", template: 'iconUrl' },
          { prop: "content", label: "内容" },
          { prop: "praiseQuantity", label: "点赞数" },
          { prop: "visitQuantity", label: "阅读数" },
          { prop: "shareQuantity", label: "分享数" },
          { prop: "imgUrl", label: "图片", template: 'img'},
          { prop: "createTime", label: "创建时间"}
        ],
        page: {
          total: 0,
          pageSize: 20,
          pageNum: 1,
          sourceId: '',
          memberId: ''
        }
      },
      wrapHeight: 0,
      areaHeight: 0,
      tableHeight: 500,
    }
  },
  created () {
    this.model.id = this.$route.query.id;
    this.getDetail(this.$route.query.id);
    this.checkData.page.sourceId = this.$route.query.sourceId;
    this.getLessonFeel()
  },
  mounted () {
    this.getHeight()
    window.onresize = () => {
      this.getHeight()
    }
    this.getDetail()
  },
  methods: {
    // 设置高度
    getHeight () {
      this.wrapHeight = window.innerHeight - 80 - 40
      this.areaHeight = this.wrapHeight - 50 - 61
      this.tableHeight = this.areaHeight - 60
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    // 选中
    getSelection (val) {
      console.log(val)
    },
    // 翻页
    handleCurrentChange (val) {
      console.log(val)
      this.checkData.page.pageNum = val
      this.getLessonFeel()
    },
    // 显示个数
    handleSizeChange (val) {
      this.checkData.page.pageSize = val
      this.getLessonFeel()
    },
    getDetail () {
      // this.getContent()
      api.lessonReviewDetail({id: this.model.id}).then(res => {
        console.log(res.data)
        this.model.content = res.data.data.content
        this.model.shortSentenceList = res.data.data.shortSentenceList
      })
    },
    getLessonFeel() {
      console.log(this.checkData.page)
      api.getLessonFeel(this.checkData.page).then(res => {
        console.log('课后感=====',res.data)
        res.data.data.list.map((item,i) => {
          if(item.imgUrl && item.imgUrl != '') item.imgUrl = JSON.parse(item.imgUrl)
        })
        this.checkData.tableData = res.data.data.list
        this.checkData.page.total = res.data.data.total

      })
    }
  }
}
</script>

<style lang="less" scoped>
.area-box {
  padding:20px 20px;
  .gold{
    .gold-item{
      padding:10px 20px;
      border-bottom: 1px solid #ebeef5;
    }
  }
}
</style>
