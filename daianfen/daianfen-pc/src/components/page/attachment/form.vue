<template>
<el-dialog :title='id ? "修改" : "添加"' :visible.sync="visible" width="880px" :append-to-body="true" :before-close="close" :close-on-click-modal="false" :close-on-press-escape="false">
  <div style="overflow: auto;" v-loading="dataLoading">
    <el-form :model="model" ref="model" class="new-form" label-position="top">
      <el-form-item>
        <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-input size="small" v-model="model.name"></el-input>
        </el-form-item>
        <el-form-item label="链接">
          <el-input size="small" v-model="model.href"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="seqNum" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-input-number size="small" v-model="model.seqNum"></el-input-number>
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input size="small" v-model="model.note"></el-input>
        </el-form-item>
      </el-form-item>
      <el-form-item label="图片" prop="url" :rules="[{ required: true, message: '该字段不能为空'}]">
        <div class="upload-img-box" @click="openImgBox()">
          <img v-if="model.url" :src="`${imgHost}/${model.url}`" style="width: 120px;">
          <i v-else class="el-icon-plus upload-icon"></i>
        </div>
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
import ImageDialog from "../../common/ImageDialog";
import api from "api/common.js";

export default {
  props: {
    visible: Boolean,
    id: {
      type: String,
      default: ""
    }
  },
  components: {
    ImageDialog
  },
  data() {
    return {
      digImgWrap: false,
      model: {
        name: "",
        href: "",
        url: "",
        seqNum: 0,
        note: "",
        categoryId: "63458b7f822b42ad8931c0c89f65c275"
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
    //更新信息
    detail() {
      api.getAttachment({ id: this.id }).then(res => {
        this.model = res.data.data;
        this.dataLoading = false;
      });
    },
    //添加
    save() {
      api.addAttachment(this.model).then(res => {
        this.loading = false;
        this.$message({
          message: "添加成功",
          type: "success"
        });
        this.close(true);
      }).catch(err => {
        this.loading = false;
      })
    },
    //修改
    update() {
      api.updateAttachment(this.model).then(res => {
        this.loading = false;
        this.$message({
          message: "修改成功",
          type: "success"
        });
        this.close(true);
      }).catch(err => {
        this.loading = false;
      })
    },
    success() {
      this.$refs.model.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.id != "") {
            this.update();
          } else {
            this.save();
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
        href: "",
        url: "",
        seqNum: 0,
        note: "",
        categoryId: "63458b7f822b42ad8931c0c89f65c275"
      };
      return model;
    },
    // 打开图片对话框
    openImgBox() {
      // this.uploadType = type
      this.digImgWrap = true;
    },
    // 关闭图片对话框
    closeImgbox(state) {
      this.digImgWrap = false;
    },
    // 单张图片
    onGetImgsrc(val) {
      this.model.url = val;
    }
  }
};
</script>
