<template>
  <div class="wrap" ref="wrap" :style="{'height': `${wrapHeight}px`}">
     <div class="data-setting" :style="{'height': `${mainHeight}px`}">
      <!-- <el-form class="form" :model="model" ref="model" label-position="top" size="small">
        <el-form-item label="开启" prop="isOpen" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-switch v-model="model.isSubscribeGuidenceEnabled"></el-switch>
        </el-form-item>
        <el-form-item v-show="model.isSubscribeGuidenceEnabled" label="二维码" prop="isOpen" :rules="[{ required: true, message: '该字段不能为空'}]">
          <div class="upload-img-box" @click="openImgBox('radio')">
            <img v-if="model.wechatSubscribeQrcode" :src="`${imgHost}/${model.wechatSubscribeQrcode}`" style="width: 120px;">
            <i v-else class="el-icon-plus upload-icon"></i>
          </div>
        </el-form-item>
      </el-form> -->
      <div class="setting-item">
        <div>
          <p class="title">设置首页背景图</p>
          <span class="tips">建议尺寸大小： 375*330</span>
        </div>
        <div class="img" style="width:375px;height:330px;">
          <img v-if="configList[2].content" :src="imgHost+configList[2].content" alt="">
        </div>
        <el-button @click.native="openImgBox('radio', 2)">更换图片</el-button>
      </div>
      <hr>
      <div class="setting-item">
        <div>
          <p class="title">设置预约页背景图</p>
          <span class="tips">建议尺寸大小： 375*200</span>
        </div>
        <div class="img" style="width:375px;height:200px;">
          <img v-if="configList[0].content" :src="imgHost+configList[0].content" alt="">
        </div>
        <el-button @click.native="openImgBox('radio', 0)">更换图片</el-button>
      </div>
      <hr>
      <div class="setting-item">
        <div>
          <p class="title">设置预约成功背景图</p>
          <span class="tips">建议尺寸大小： 375*155</span>
        </div>
        <div class="img" style="width:375px;height:155px;">
          <img v-if="configList[1].content" :src="imgHost+configList[1].content" alt="">
        </div>
        <el-button @click.native="openImgBox('radio', 1)">更换图片</el-button>
      </div>
    </div>
    <image-dialog :visible="digImgWrap" :uploadType="uploadType" imageType='barcode' @close-imgbox="closeImgbox" @get-imgsrc="onGetImgsrc"></image-dialog>
  </div>
</template>
<script>
import ImageDialog from "common/ImageDialog";
import api from "api/common";
export default {
  components: {
    ImageDialog,
  },
  data () {
    return {
      digImgWrap: false,
      uploadType: "radio",
      wrapHeight: 0,
      mainHeight: 0,
      loading: false,
      model: {},
      configList: [
        // /attachments/image/t8xp0z78bnhz34f8.jpg
        {content: ''},
        {content: ''},
        {content: ''},
      ]
    }
  },
  created () {
    this.apiGetConfig()
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
      this.wrapHeight = window.innerHeight - 162;
      this.mainHeight = this.wrapHeight;
    },
    apiGetConfig(){
      this.$http.get('/config/getByType', {type: 'resPic'})
      .then(res => {
        this.configList = res.data.content0.rows
      })
    },
    apiUpDate() {
      this.$http.post('/config/update', this.model)
      .then(res => {
        this.$message.success('更新成功');
      })
    },
    // 打开图片对话框
    openImgBox(type, index) {
      this.uploadType = type;
      this.digImgWrap = true;
      this.model = this.configList[index]
    },
    // 关闭图片对话框
    closeImgbox(state) {
      this.digImgWrap = false;
    },
    // 单张图片
    onGetImgsrc(val) {
      this.model.content = val;
      this.apiUpDate()
    },
  }
}
</script>
<style lang="less" scoped>
.data-setting {
  padding: 20px;
}
.bottom-btn {
  text-align: center;
  height: 60px;
  line-height: 60px;
  border-top: 1px solid #e7eaec;
}
hr{
  height:0;
  margin:30px 0;
  border-width:0;
  border-bottom:1px solid #fff;
  border-top:1px solid #e4e4e4;
}
.setting-item{
  .title{
    position: relative;
    padding-left: 10px;
    &::before{
      content: '';
      position: absolute;
      top: 3px;
      left: 0;
      width: 0;
      height: 17px;
      border-left: 2px solid #000;
    }
  }
  .tips{
    font-size: 13px;
    color: #808080;
    line-height: 2.0;
    padding-left: 1em;
  }
  .img{
    background:#f2f2f2;
    margin:40px 0;
    overflow:hidden;
    img{
      width:100%;
    }
  }
}
.setting-item:last-child{
  padding-bottom:20px;
}
</style>

