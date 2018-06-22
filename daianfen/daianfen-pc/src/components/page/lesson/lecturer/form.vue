<template>
<el-dialog :title='id ? "修改讲师" : "新增讲师 "' :visible.sync="visible" width="880px" :append-to-body="true" :before-close="close" :close-on-click-modal="false" :close-on-press-escape="false">
  <div style="overflow: auto;" v-loading="dataLoading">
    <el-form :model="model" ref="model" class="new-form" label-position="top">
      <el-form-item class="item-text">
        <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-input size="small" v-model="model.name"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="info" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-input size="small" v-model="model.info"></el-input>
        </el-form-item> 
      </el-form-item>
      
      <el-form-item label="头像" prop="headImgUrl" :rules="[{ required: true, message: '该字段不能为空'}]">
        <div class="upload-img-box" @click="openImgBox()">
          <img v-if="model.headImgUrl" :src="`${imgHost}/${model.headImgUrl}`" style="width: 120px;">
          <i v-else class="el-icon-plus upload-icon"></i>
        </div>
      </el-form-item>
      <el-form-item label="介绍" prop="content">
        <editor :content="model.content" :configs="config" @get-content="getContent" ></editor>
      </el-form-item>
    </el-form>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="close(false)">取 消</el-button>
    <el-button size="small" type="primary" @click="success()" :loading="loading">确 定</el-button>
  </span>
  <image-dialog :visible="digImgWrap" uploadType="radio" imageType='actType' @close-imgbox="closeImgbox" @get-imgsrc="onGetImgsrc"></image-dialog>
</el-dialog>
</template>

<script>
import api from "api/common";
import ImageDialog from "common/ImageDialog";
import editor from "common/editor";

export default {
  props: {
    visible: Boolean,
    id: {
      type: String,
      default: ""
    }
  },
  components: {
    ImageDialog, editor
  },
  data() {
    return {
      digImgWrap: false,
      model: {
        name: "",
        info: "",
        headImgUrl: "",
        content: ""
      },
      config: {
        initialFrameWidth: 680,
        initialFrameHeight: 300,
      },
      loading: false,
      dataLoading: false
    };
  },
  watch: {
    visible(val) {
      if (val && this.id != "") {
        this.dataLoading = true;
        this.detail();
      }
    }
  },
  methods: {
    getContent(content) {
      this.model.content = content;
    },
    //获取信息
    detail() {
      api.getLecturer({ id: this.id }).then(res => {
        this.model = res.data.data;
        this.dataLoading = false;
      });
    },
    //添加
    save(model) {
      api
        .addLecturer(this.model)
        .then(res => {
          this.loading = false;
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.close(true);
        })
        .catch(err => {
          this.loading = false;
        });
    },
    //修改
    update() {
      api
        .updateLecturer(this.model)
        .then(res => {
          this.loading = false;
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.close(true);
        })
        .catch(err => {
          this.loading = false;
        });
    },
    success() {
      this.$refs.model.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.id != "") {
            this.update();
          } else {
            this.save(this.model);
          }
        } else {
          return false;
        }
      });
    },
    close(flag) {
      this.model = this.reduc();
      this.$emit("close", flag);
    },
    reduc() {
      let model = {
        name: "",
        info: "",
        headImgUrl: "",
        content: ""
      }
      return model
    },
    // 打开图片对话框
    openImgBox() {
      this.digImgWrap = true;
    },
    // 关闭图片对话框
    closeImgbox(state) {
      this.digImgWrap = false;
    },
    // 单张图片
    onGetImgsrc(val) {
      this.model.headImgUrl = val;
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
    imgSuccess(res) {
      console.log("imgSuccess", res.data);
      this.model.iconImage = res.data;
      console.log(this.model.iconImage);
    },
    imgFail(err) {
      console.log("上传失败 ", err);
      this.$message({
        message: err.data.message,
        type: "error"
      });
    }
  }
};
</script>

<style lang="less" scoped>
.new-form {
  .item-text {
    margin-bottom: 0;
    .el-form-item {
      margin-bottom: 22px;

      width: 260px;
      display: inline-block;
      &:not(:nth-child(3n + 1)) {
        margin-left: 20px;
      }
      .el-select,
      .el-input-number {
        width: 100%;
      }
    }
  }
}
</style>
