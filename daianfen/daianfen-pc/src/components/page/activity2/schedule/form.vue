<template>
  <div class="wrap" ref="wrap" :style="{'height': `${wrapHeight}px`}">
    <div ref="header">
      <qc-header :title="updateId?'修改课程回顾':'添加课程回顾'"></qc-header>
    </div>
    <div class="area-box" :style="{'height': `${areaHeight}px`}">
      <!-- 选择课程 -->
      <el-form class="form" :model="model" ref="model" label-position="top" size="small">
        <el-form-item v-if="!updateId || updateId == ''" label="选择课程" prop="sourceId" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-select size="small"  v-model="sourceId">
            <el-option v-for="(item, index) in lessonList" :key="index" :label="item.title" :value="123456" ></el-option>
          </el-select>
        </el-form-item>
        <!-- 金句 开始-->
        <el-form-item class="sentence" label="课堂金句" prop="list">
          <el-button size="mini" type="primary" @click="addSentence">新增</el-button>
          <div class="sentence-list" style="">
            <div class="item" style="padding-left:10px;background:#f1f1f1;">
              <span style="width:150px;">排序</span>
              <span style="flex:1;">内容</span>
              <span style="width:60px;">操作</span>
            </div>
            <div class="item" v-for="(item, index) in model.shortSentenceList" :key="index">
              <!-- 排序 -->
              <el-input-number v-model="item.sort" :min="10" :step="10" style="margin-right:20px;"></el-input-number>
              <!-- 内容 -->
              <el-input
                class="input-content"
                placeholder="请输入内容"
                v-model="item.content"
                size="small">
              </el-input>
              <!-- 操作 -->
              <el-button class="delete" size="mini" type="danger" @click="delSentence(index)">删除</el-button>
            </div>
          </div>
        </el-form-item>  
        <!-- 金句结束 -->
        <!-- 回顾内容 -->
        <el-form-item label="内容" prop="content" :rules="[{ required: true, message: '该字段不能为空'}]">
          <div class="editor">
            <editor :content="model.content" :config="config" @get-content="getContent"></editor>
          </div>
        </el-form-item>
      </el-form>
    </div>  <!-- 回顾内容 结束-->
    <div class="bottom-btn">
      <el-button type="primary" @click="submit">保存</el-button>
    </div>
    <image-dialog :visible="digImgWrap" :uploadType="uploadType" imageType='product' @close-imgbox="closeImgbox" @get-imgsrc="onGetImgsrc" @get-imglistsrc="onGetImglistsrc"></image-dialog>
  </div>
</template>

<script>
import QcHeader from "common/QcHeader"
import editor from "common/editor"
import SearchWrap from "common/SearchWrap";
import api from "api/common"
import { tableMixin } from "@/assets/js/tableMixin";
import UpLoadFile from "common/UpLoadFile"
import ImageDialog from "common/ImageDialog"

export default {
  mixins: [tableMixin],
  components: {
    QcHeader, UpLoadFile, ImageDialog, editor, SearchWrap
  },
  data () {
    return {
      config: {
        initialFrameWidth: 800,
        initialFrameHeight: 500,
      },
      select: null,
      digImgWrap: false,
      editor: null,
      html: null,
      updateId: null,
      lessonList: [],
      sourceId: '',
      model: {
        id: '',
        title: '',
        shortSentenceList: [],
        content: '',
      },
      imgList: [],
      uploadType: 'radio',
      limit: 1,
      input: [
        { value: '' },
      ],
      wrapHeight: 0,
      areaHeight: 0,
      brandList: [],
    }
  },
  created () {
    console.log(this.$route.query)
    this.updateId = this.$route.query.id;
    this.model.id = this.$route.query.id;
    if(this.updateId) this.getDetail();
    this.getLesson()
  },
  mounted () {
    // this.editor = UE.getEditor('editor')
    this.getHeight()
    window.onresize = () => {
      this.getHeight()
    }
  },
  methods: {
    // 设置高度
    getHeight () {
      this.wrapHeight = window.innerHeight - 80 - 40
      this.areaHeight = this.wrapHeight - 50 - 61
    },
    getLesson() {
      let params = {
        page: 1,
      };
      api.getLesson().then(res => {
        console.log('课程',res.data);
        this.lessonList = res.data.data.list
      })
    },
    getDetail() {
      api.lessonReviewDetail({id: this.updateId, sourceId: this.model.sourceId}).then(res => {
        console.log(res.data.data)
        this.model.content = res.data.data.content
        this.model.title = res.data.data.title
        this.model.shortSentenceList = res.data.data.shortSentenceList
        this.model.content = res.data.data.content
      })
    },
    // 新增句子
    addSentence () {
      let data = {
        content: '', 
        sort: (this.model.shortSentenceList.length + 1) * 10
      }
      this.model.shortSentenceList.push(data)
      console.log(data)
    },
    // 删除句子
    delSentence (i) {
      this.model.shortSentenceList.splice(i, 1)
    },
    // 设置content
    setContent (content) {
      this.editor.addListener("ready", () => {
        this.editor.setContent(content)
      })
    },
    // 获取content
    getContent (content) {
      this.model.content = content
      // this.model.content = this.editor.getContent()
      // console.log(content)
    },
    // 打开图片对话框
    openImgBox (type) {
      this.uploadType = type
      this.digImgWrap = true
    },
    // 关闭图片对话框
    closeImgbox (state) {
      this.digImgWrap = false
    },
    // 单张图片
    onGetImgsrc (val) {
      this.model.iconUrl = val
    },
    // 多张图片
    onGetImglistsrc (list, state) {
      // console.log('onGetImglistsrc', list, state)
      if (state === 1) {
        list.map((item, i) => {
          let url = item.response.data.imageUrl
          this.imgList.push({url: url})
        })
      } else {
        list.map((item, i) => {
          let url = item.imgsrc
          this.imgList.push({url: url})
        })
      }
    },
    // 删除图片
    deleteImg (i) {
      this.imgList.splice(i, 1)
    },
    getImgList () {
      let rollingImgUrl = ''
      this.imgList.map((item, i) => {
        rollingImgUrl += item.url + '_'
      })
      // rollingImgUrl = rollingImgUrl.substr(0,rollingImgUrl.length-1)
      this.model.rollingImgUrl = rollingImgUrl.substr(0,rollingImgUrl.length-1)
    },
    // 提交
    submit () {
      console.log(this.model)
      let params = this.model;
      
      if(this.updateId) {
        params.id = this.updateId;
        api.updeteLessonReview(params).then(res => {
          console.log(res)
          if(res.data.code == 20000) {
            this.$message({
              message: '保存成功',
              type: 'success'
            });
            setTimeout(() => {
              this.$router.back(-1)
            }, 1000)
          }
        })
      }else{
        if(!this.model.sourceId){
          this.$message({
            message: '请选择课程',
            type: 'warning'
          });
          return
        }else if(!this.model.content){
          this.$message({
            message: '内容不能为空',
            type: 'warning'
          });
          return;
        }
        params.sourceId = this.sourceId;
        api.saveLessonReview(params).then(res => {
          console.log(res)
          if(res.data.code == 20000) {
            this.$message({
              message: '保存成功',
              type: 'success'
            });
            setTimeout(() => {
              this.$router.back(-1)
            }, 1000)
          }
        })
      }
    },
  }
}
</script>

<style lang="less" scoped>
.el-menu-item.is-active {
  color: #fff;
  background: #337ab7;
}
.form{
  width:800px;
  margin-left:20px;
  padding:20px 0;
}
.area-box {
  overflow-y:auto;
  .search{
    width:100%;
  }
}
.sentence-list{
  .item{
    display: flex;
    margin-top:20px;
    .input-content{
      flex:1;
    }
    &:last-child{
      margin-bottom:0;
    }
    .delete{
      margin-left:20px;
    }
  }
}
.upload-img-box {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 6px;
  border: 1px dashed #d9d9d9;
  overflow: hidden;
  cursor: pointer;
  &:hover {
    border-color: #409eff;
  }
  .upload-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
}
.img-box {
  display: flex;
  align-content: flex-start;
  flex-wrap: wrap;
  .item {
    position: relative;
    width: 100px;
    height: 100px;
    border: 1px solid #eee;
    overflow: hidden;
    cursor: pointer;
    position: relative;
    margin: 0 6px 6px 0;
    flex-shrink: 0;
    &:nth-child(7n) {
      margin: 0 0 6px 0;
    }
    img {
      width: 100%;
    }
    .el-icon-error {
      position: absolute;
      top: 5px;
      right: 5px;
      font-size: 20px;
      color: #c5c5c5;
    }
  }
  .item-upload {
    position: relative;
    width: 100px;
    height: 100px;
    border-radius: 6px;
    border: 1px dashed #d9d9d9;
    overflow: hidden;
    cursor: pointer;
    line-height: 100px;
    text-align: center;
    &:hover {
      border-color: #409eff;
    }
    i {
      font-size: 26px;
      color: #8c939d;
    }
  }
}
.property-box {
  border: 1px solid #e7eaec;
  padding: 15px;
  // width: 869px;
  .property-item {
    border-left: 3px solid rgba(0,0,0,0.2);
    margin-bottom: 20px;
    .name {
      background: rgba(0,0,0,0.035);
      padding: 10px 10px 10px 15px;
      display: flex;
      justify-content: space-between;
      .delete-btn {
        display: none;
      }
      &:hover {
        background: rgba(0,0,0,0.05);
        .delete-btn {
          display: block;
        }
      }
    }
    .value {
      display: flex;
      align-content: flex-start;
      flex-wrap: wrap;
      .input {
        width: 150px;
        margin: 15px 0 0 15px;
        flex-shrink: 0;
        position: relative;
        overflow: hidden;
        i {
          font-size: 14px;
          position: absolute;
          right: -15px;
          top: 0;
          transition: all .3s ease;
        }
        &:hover {
          i {
            right: 3px;
            cursor: pointer;
          }
        }
      }
      .btn {
        margin: 15px 0 0 15px;
      }
    }
    &:hover {
      border-color: #337ab7;
    }
  }
}
.property-table {
  border: 1px solid #e7eaec;
  margin-top: 20px;
  // width: 900px;
  border-spacing: 0;
  border-collapse: collapse;
  tr {
    th {
      padding: 15px 12px;
      line-height: 1.5;
      .input-group {
        display: flex;
      }
    }
    td {
      border-top: 1px solid #e7eaec;
      line-height: 1.5;
      padding: 15px 12px;
      text-align: center;
    }
  }
}
.bottom-btn {
  text-align: center; 
  height: 60px; 
  line-height: 60px;
  border-top: 1px solid #e7eaec;
}
</style>
