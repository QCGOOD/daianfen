<template>
<el-dialog title='添加账号' :visible.sync="visible" width="880px" :append-to-body="true" :before-close="close" :close-on-click-modal="false" :close-on-press-escape="false">
  <div style="overflow: auto;">
    <el-form :model="model" ref="model" class="new-form">
      <el-form-item>
        <el-form-item label="用户名" prop="name" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-input size="small" v-model="model.name"></el-input>
        </el-form-item>
        <el-form-item label="用户账号" prop="username" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-input size="small" v-model="model.username"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-input size="small" v-model="model.password"></el-input>
        </el-form-item>
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
    }
  },
  data() {
    return {
      model: {
        name: "",
        username: "",
        password: "",
        appId: ""
      },
      loading: false
    };
  },
  watch: {
    visible: {
      handler: function(val) {
        if (val && this.id != "") {
          this.model.appId = this.id;
        }
      },
      deep: true
    }
  },
  methods: {
    //添加
    save() {
      api
        .addAccount(this.model)
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
    success() {
      this.$refs.model.validate(valid => {
        if (valid) {
          this.loading = true;
          this.save();
        } else {
          return false;
        }
      });
    },
    close(flag) {
      this.$emit("close", flag);
    }
  }
};
</script>
