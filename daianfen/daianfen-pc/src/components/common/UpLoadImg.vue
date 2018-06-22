<template>
  <div>
    <div v-if="imageType">
      <el-upload
        v-if="uploadType === 'radio'"
        ref="upload"
        class="avatar-uploader"
        :action="action"
        :data="{ imageType: imageType}"
        :before-upload="beforeAvatarUpload"
        :on-success="imgSuccess"
        :on-error="imgFail">
        <img v-if="imgSrc" :src="`${imgHost}${imgSrc}`" class="avatar-img">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <el-upload
        v-else
        ref="upload"
        :action="action"
        list-type="picture-card"
        :data="{ imageType: imageType}"
        :before-upload="beforeAvatarUpload"
        :on-success="imgSuccess"
        :on-error="imgFail"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove">
        <i class="el-icon-plus"></i>
      </el-upload>
    </div>
    <div v-else>
      <p>应用组件需传imageType（imageType="xxxx"）！</p>
    </div>
    <el-button type="danger" size="mini" style="margin: 10px;" @click.native="getImg('')" v-if="imgSrc">删除</el-button>
    <!-- 大图 -->
    <el-dialog :visible.sync="dialogVisible" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    url: String,
    imgSrc: String,
    imageType: {
      dafault: 'imageType',
      type: String
    },
    uploadType: {
      type: String,
      default: "radio" // 单选 radio, 多选 select
    }
  },
  data() {
    return {
      thumbnail: "",
      dialogImageUrl: "",
      dialogVisible: false,
      action: ""
    };
  },
  mounted() {
    this.action =
      process.env.NODE_ENV === "production"
        ? `${this.base.baseHost}${this.base.projectName()}/attachments/images/tencent_cloud`
        : `${this.base.projectName()}/attachments/images/tencent_cloud`;
  },
  methods: {
    clearFiles() {
      this.$refs.upload.clearFiles();
    },
    getImg(val) {
      this.$emit("get-uploadimg", val);
    },
    getImglist(list) {
      this.$emit("get-uploadimglist", list);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    imgSuccess(res, file, fileList) {
      if (res.errCode === 0) {
        if (this.uploadType === "radio") this.getImg(res.imageUrl);
        else this.getImglist(fileList);
        this.$message.success('上传完成');
      } else {
        if (this.uploadType === "select") {
          fileList.map((item, i) => {
            if (file.uid === item.uid) {
              fileList.splice(i, 1);
            }
          });
        }
        this.$message.error(res.errMsg);
      }
    },
    imgFail(err, file, fileList) {
      console.log("上传失败 ", err, file, fileList);
      if (this.uploadType === "select") {
        fileList.map((item, i) => {
          if (file.uid === item.uid) {
            fileList.splice(i, 1);
          }
        });
      }
      this.$message({
        message: err.data.message,
        type: "error"
      });
    },
    handleRemove(file, fileList) {
      fileList.map((item, i) => {
        if (file.uid === item.uid) {
          fileList.splice(i, 1);
        }
      });
      this.getImglist(fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  }
};
</script>

<style lang="less" scoped>
.avatar-uploader {
  position: relative;
  width: 148px;
  height: 148px;
  line-height: 148px;
  text-align: center;
  border-radius: 6px;
  border: 1px dashed #d9d9d9;
  overflow: hidden;
  cursor: pointer;
}
.avatar-uploader:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
}
.avatar-img {
  width: 148px;
  display: block;
}
</style>
