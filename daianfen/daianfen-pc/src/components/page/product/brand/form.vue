<template>
<el-dialog :title='id ? "修改" : "添加 "' :visible.sync="visible" width="880px" :append-to-body="true" :before-close="close" :close-on-click-modal="false" :close-on-press-escape="false">
  <div style="overflow: auto;" v-loading="dataLoading">
    <el-form :model="model" ref="model" class="new-form" label-position="top">
      <el-form-item>
        <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-input size="small" v-model="model.name"></el-input>
        </el-form-item>
        <el-form-item label="代码" prop="code" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-input size="small" v-model="model.code"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="seqNum" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-input-number size="small" v-model="model.seqNum"></el-input-number>
        </el-form-item>
        <el-form-item label="说明">
          <el-input size="small" v-model="model.info"></el-input>
        </el-form-item>
      </el-form-item>
      <el-form-item label="图标" prop="iconUrl" :rules="[{ required: true, message: '该字段不能为空'}]">
        <div class="upload-img-box" @click="openImgBox()">
          <img v-if="model.iconUrl" :src="`${imgHost}/${model.iconUrl}`" style="width: 120px;">
          <i v-else class="el-icon-plus upload-icon"></i>
        </div>
      </el-form-item>
    </el-form>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="close(false)">取 消</el-button>
    <el-button size="small" type="primary" @click="success()" :loading="loading">确 定</el-button>
  </span>
  <image-dialog :visible="digImgWrap" uploadType="radio" imageType='brand' @close-imgbox="closeImgbox" @get-imgsrc="onGetImgsrc"></image-dialog>
</el-dialog>
</template>

<script>
import api from "api/common";
import ImageDialog from "common/ImageDialog";

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
        code: "",
        iconUrl: "",
        info: "",
        seqNum: ""
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
    //获取
    detail() {
      api.getbrand({ id: this.id }).then(res => {
        this.model = res.data.data;
        this.dataLoading = false;
      });
    },
    //添加
    save() {
      api
        .saveBrand(this.model)
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
        .updateBrand(this.model)
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
        code: "",
        iconUrl: "",
        info: "",
        seqNum: ""
      };
      return model;
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
      this.model.iconUrl = val;
    }
  }
};
</script>
