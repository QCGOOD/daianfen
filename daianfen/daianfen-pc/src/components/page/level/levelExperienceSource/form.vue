<template>
<el-dialog :title='id ? "修改等级分类" : "添加等级分类 "' :visible.sync="visible" width="880px" :append-to-body="true" :before-close="close" :close-on-click-modal="false" :close-on-press-escape="false">
  <div style="overflow: auto;" v-loading="dataLoading">
    <el-form :model="model" ref="model" class="new-form" label-position="top">
      <el-form-item>
        <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-input size="small" v-model="model.name"></el-input>
        </el-form-item>
        <el-form-item label="等级类型" prop="type" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-input-number size="small" v-model="model.type" :disabled="true"></el-input-number>
        </el-form-item>
        <el-form-item label="编码" prop="code" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-input size="small" v-model="model.code" :disabled="model.id"></el-input>
        </el-form-item>
        <el-form-item label="经验值数量" prop="amount" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-input-number size="small" v-model="model.amount"></el-input-number>
        </el-form-item>
        <el-form-item label="描述" prop="description" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-input size="small" v-model="model.description"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="note" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-input size="small" v-model="model.note"></el-input>
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
import api from "api/common";
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
        type: "",
        amount: "",
        code: "",
        description: "",
        note: ""
      },
      loading: false,
      dataLoading: false
    };
  },
  watch: {
    visible(val) {
      this.model.type = this.$route.query.type;
      if (val && this.id != "") {
        this.dataLoading = true;
        this.detail();
      }
    }
  },
  methods: {
    //获取信息
    detail() {
      api.getLevelSource({ id: this.id }).then(res => {
        this.model = res.data.data;
        this.dataLoading = false;
      });
    },
    //添加
    save() {
      api
        .addLevelSource(this.model)
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
        .updateLevelSource(this.model)
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
      console.log("close");
      this.$emit("close", flag);
    },
    reduc() {
      let model = {
        name: "",
        type: "",
        amount: "",
        code: "",
        description: "",
        note: ""
      };
      return model;
    }
  }
};
</script>

