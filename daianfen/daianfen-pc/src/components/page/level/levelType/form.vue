<template>
<el-dialog :title='id ? "修改等级分类" : "添加等级分类 "' :visible.sync="visible" width="880px" :append-to-body="true" :before-close="close" :close-on-click-modal="false" :close-on-press-escape="false">
  <div style="overflow: auto;" v-loading="dataLoading">
    <el-form :model="model" ref="model" class="new-form" label-position="top">
      <el-form-item label="等级分类名称" prop="name" :rules="[{ required: true, message: '该字段不能为空'}]">
        <el-input size="small" v-model="model.name"></el-input>
      </el-form-item>
      <!-- <el-form-item label="等级分类类型" prop="type" :rules="[{ required: true, message: '该字段不能为空'}]">
        <el-input-number size="small" v-model="model.type"></el-input-number>
      </el-form-item> -->
      <el-form-item label="等级分类描述" prop="description" :rules="[{ required: true, message: '该字段不能为空'}]">
        <el-input size="small" v-model="model.description"></el-input>
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
import api from "api/common";
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
        type: "",
        description: ""
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
      api.getLevelType({ id: this.id }).then(res => {
        this.model = res.data.data;
        this.dataLoading = false;
      });
    },
    //添加
    save() {
      api
        .addLevelType(this.model)
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
        .updateLevelType(this.model)
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
      this.model = this.util.resetFields(this.model);
      console.log("close");
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
