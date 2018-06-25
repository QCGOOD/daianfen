<template>
<el-dialog :title='id ? "修改应用" : "添加应用 "' :visible.sync="visible" width="880px" :append-to-body="true" :before-close="close" :close-on-click-modal="false" :close-on-press-escape="false">
  <div style="overflow: auto;" v-loading="dataLoading">
    <el-form :model="model" ref="model" class="new-form" size="small" label-position="top">
      <el-form-item>
        <el-form-item label="应用名称" prop="name" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-input size="small" v-model="model.name"></el-input>
        </el-form-item>
        <el-form-item label="项目名（英文）" prop="code" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-input size="small" v-model="model.code"></el-input>
        </el-form-item>
        <el-form-item label="所属客户" prop="customerName" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-input size="small" v-model="model.customerName"></el-input>
        </el-form-item>
        <el-form-item label="到期日" prop="endDate" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-date-picker type="datetime" size="small" placeholder="选择日期" v-model="model.endDate" value-format="yyyy-MM-dd HH:mm:ss" :editable="false"></el-date-picker>
        </el-form-item>
        <el-form-item label="备注说明">
          <el-input size="small" v-model="model.remark"></el-input>
        </el-form-item>
      </el-form-item>
      <el-form-item label="图标" prop="logUrl" :rules="[{ required: true, message: '该字段不能为空'}]">
        <div class="upload-img-box" @click="openImgBox()">
          <img v-if="model.logUrl" :src="`${imgHost}/${model.logUrl}`" style="width: 120px;">
          <i v-else class="el-icon-plus upload-icon"></i>
        </div>
      </el-form-item>
    </el-form>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="close(false)">取 消</el-button>
    <el-button size="small" type="primary" @click="success()" :loading="loading">确 定</el-button>
  </span>
  <image-dialog :visible="digImgWrap" uploadType="radio" imageType='app' @close-imgbox="closeImgbox" @get-imgsrc="onGetImgsrc"></image-dialog>
</el-dialog>
</template>

<script>
import api from "api/common.js";
import ImageDialog from "../../common/ImageDialog";

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
        customerName: "",
        endDate: "",
        remark: "",
        logUrl: ""
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
    //获取信息
    detail() {
      api.getApp({ id: this.id }).then(res => {
        this.model = res.data.data;
        this.dataLoading = false;
      });
    },
    //添加
    save(model) {
      api
        .addApp(this.model)
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
        .updateApp(this.model)
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
        code: "",
        customerName: "",
        endDate: "",
        remark: "",
        logUrl: ""
      }
      return model
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
      this.model.logUrl = val;
    }
  }
};
</script>

