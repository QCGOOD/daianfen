<template>
  <div class="wrap" ref="wrap" :style="{'height': `${wrapHeight}px`}">
    <div ref="header">
      <qc-header title='课堂金句'></qc-header>
    </div>
    <div class="area-box" :style="{'height': `${areaHeight}px`}">
      <!-- <div style="height:100%;overflow-y:auto;"> -->
        <el-form class="form" :model="formData" ref="model" label-position="top" size="small">
          <el-form-item label="选择活动" prop="activity" :rules="[{ required: true, message: '该字段不能为空'}]">
            <el-select size="small"  v-model="formData.activity">
              <el-option label="全部" value=""></el-option>
              <el-option label="上架" value="1"></el-option>
              <el-option label="未上架" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="sentence" label="金句" prop="list" :rules="[{ required: true, message: '该字段不能为空'}]">
            <el-button size="mini" type="primary" @click="addSentence">新增</el-button>
            <!-- <div class="sentence"> -->
              <div class="sentence-list">
                <div class="item" v-for="(item, index) in formData.list" :key="index">
                  <el-input
                    placeholder="请输入内容"
                    v-model="item.value"
                    size="small">
                  </el-input>
                  <el-button class="delete" size="mini" type="danger" @click="delSentence(index)">删除</el-button>
                </div>
              </div>
            <!-- </div> -->
          </el-form-item>
        </el-form>
      <!-- </div> -->
    </div>
    <div class="bottom-btn">
      <el-button type="primary" @click="submit">确定</el-button>
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
      uploadType: 'io',
      digImgWrap: false,
      limit: 1,
      input: [
        { value: '' },
      ],
      wrapHeight: 0,
      areaHeight: 0,
      formData: {
        // 活动
        activity: null,
        // 金句
        list: [{value: ''}],
        img: '',
        title: '',
        ad: ''
      },
    }
  },
  created () {

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
    // 新增句子
    addSentence () {
      let data = {value:''}
      this.formData.list.push(data)
    },

    // 删除句子
    delSentence (i) {
      this.formData.list.splice(i, 1)
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
      this.formData.img = val
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
      // this.getContent()
      // if (this.$route.query.id) this.updateProduct()
      // else this.addProduct()
    },
  }
}
</script>

<style lang="less" scoped>
.el-menu-item.is-active {
  color: #fff;
  background: #337ab7;
}
.area-box {
  overflow-y:auto;
  .sentence-list{
    .item{
      display: flex;
      margin-top:20px;
      &:last-child{
        margin-bottom:0;
      }
      .delete{
        margin-left:20px;
      }
    }
  }
}
.form{
  width:500px;
  margin-left:20px;
  // margin-top:20px;
  padding-top:20px;
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

.bottom-btn {
  text-align: center; 
  height: 60px; 
  line-height: 60px;
  border-top: 1px solid #e7eaec;
}
</style>
