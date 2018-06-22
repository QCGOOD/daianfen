<template>
<el-dialog :title='id ? "修改" : "添加 "' :visible.sync="visible" width="880px" :append-to-body="true" :before-close="close" :close-on-click-modal="false" :close-on-press-escape="false">
  <div style="overflow: auto;" v-loading="dataLoading">
    <el-form :model="model" ref="model" class="new-form">
      <el-form-item class="item-text">
        <el-form-item label="用户名" prop="name" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-input size="small" v-model="model.name"></el-input>
        </el-form-item>
        <el-form-item v-if="!id" label="用户账号" prop="username" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-input size="small" v-model="model.username"></el-input>
        </el-form-item>
        <el-form-item v-if="!id" label="用户密码" prop="password" :rules="[{ required: true, message: '该字段不能为空'}]">
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
    },
    isAdd: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      model: {
        name: "",
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
    //获取信息
    detail() {
      api.getAccount({ id: this.id }).then(res => {
        this.model.id = res.data.data.id;
        this.model.name = res.data.data.name;
        this.dataLoading = false;
      });
    },
    //添加
    save(model) {
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
    //修改
    update() {
      api
        .updateAccount(this.model)
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
        username: "",
        password: ""
      }
      return model
    }
  }
};
</script>

