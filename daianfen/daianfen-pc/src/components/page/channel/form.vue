<template>
<el-dialog :title='id ?"修改":"添加"' :visible.sync="visible" width="880px" :append-to-body="true" :before-close="close" :close-on-click-modal="false" :close-on-press-escape="false">
  <div style="overflow: auto;" v-loading="dataLoading">
    <el-form :model="model" ref="model" class="new-form">
      <el-form-item label="渠道商名称" prop="name" :rules="[{ required: true, message: '该字段不能为空'}]">
        <el-input size="small" v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item label="渠道名称" prop="channelName" :rules="[{ required: true, message: '该字段不能为空'}]">
        <el-input size="small" v-model="model.channelName"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile" :rules="[{ required: true, message: '该字段不能为空'}]">
        <el-input size="small" v-model="model.mobile" type="number"></el-input>
      </el-form-item>
      <el-form-item label="登录用户名" prop="username" :rules="[{ required: true, message: '该字段不能为空'}]">
        <el-input size="small" v-model="model.username"></el-input>
      </el-form-item>
      <el-form-item label="登录密码" prop="password" :rules="[{ required: true, message: '该字段不能为空'}]">
        <el-input size="small" v-model="model.password"></el-input>
      </el-form-item>
    </el-form>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="close(false)">取 消</el-button>
    <el-button size="small" type="primary" @click="success()" :loading="loading">确 定</el-button>
  </span>
</el-dialog>
</template>

<script>
import api from "api/common.js";
export default {
  props: {
    visible: Boolean,
    id: {
      type: String,
      default: ""
    },
    isAdd: {
      type: Boolean,
      default: true
    },
    updateJson: {
      type: Object
    }
  },
  data() {
    return {
      model: {
        name: "",
        mobile: "",
        channelName: "",
        username: "",
        password: ""
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
      api.getCategory(this.id).then(res => {
        this.model = res.data.data;
        this.dataLoading = false;
      });
    },
    //添加
    save() {
      api
        .addChannel(this.model)
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
      api.updateCategory(this.model).then(res => {
        this.loading = false;
        this.$message({
          message: "修改成功",
          type: "success"
        });
        this.close(true);
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
      this.$refs.model.resetFields();
      this.$emit("close", flag);
    }
  }
};
</script>

<style lang="less" scoped>
.new-form {
  .el-form-item {
    width: 260px;
    display: inline-block;
    &:not(:nth-child(3n + 1)) {
      margin-left: 20px;
    }
    .el-select {
      width: 100%;
    }
  }
}
</style>
