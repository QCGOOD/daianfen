<template>
  <div class="wrap" ref="wrap" :style="{'height': `${wrapHeight}px`}">
     <div class="data-setting" :style="{'height': `${mainHeight}px`}">
      <el-form class="form" :model="model" ref="model" label-position="top" size="small">
        <el-form-item label="开启" prop="isOpen" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-switch v-model="model.isSubscribeGuidenceEnabled"></el-switch>
        </el-form-item>
        <el-form-item v-show="model.isSubscribeGuidenceEnabled" label="二维码" prop="isOpen" :rules="[{ required: true, message: '该字段不能为空'}]">
          <div class="upload-img-box" @click="openImgBox('radio')">
            <img v-if="model.wechatSubscribeQrcode" :src="`${imgHost}/${model.wechatSubscribeQrcode}`" style="width: 120px;">
            <i v-else class="el-icon-plus upload-icon"></i>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="bottom-btn">
      <el-button type="primary" @click="submit()" style="margin-left: 30px;" size="small" :loading="loading">保存</el-button>
    </div>
    <image-dialog :visible="digImgWrap" :uploadType="uploadType" imageType='product' @close-imgbox="closeImgbox" @get-imgsrc="onGetImgsrc"></image-dialog>
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
      model: {
        isSubscribeGuidenceEnabled: false,
        wechatSubscribeQrcode: ''
      }
    }
  },
  created () {
    this.apiGetFollow()
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
      this.mainHeight = this.wrapHeight - 60;
    },
    apiGetFollow(){
      api.getFollow().then(res => {
        this.model = res.data.data
      })
    },
    submit() {
      if(this.model.isSubscribeGuidenceEnabled && this.model.wechatSubscribeQrcode == '') {
        this.$message({
          message: "请上传二维码",
          type: "error"
        });
        return;
      }
      api.follow(this.model)
      .then(res => {
        if(res.data.code == 2000){
          this.$message({
            message: "保存成功",
            type: "success"
          });
        }
      })
      .ca
    },
    // 打开图片对话框
    openImgBox(type) {
      this.uploadType = type;
      this.digImgWrap = true;
    },
    // 关闭图片对话框
    closeImgbox(state) {
      this.digImgWrap = false;
    },
    // 单张图片
    onGetImgsrc(val) {
      this.model.wechatSubscribeQrcode = val;
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
</style>

