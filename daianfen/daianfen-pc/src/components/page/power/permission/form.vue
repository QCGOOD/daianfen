<template>
<el-dialog :title='id ? "修改" : "添加 "' :visible.sync="visible" width="880px" :append-to-body="true" :before-close="close" :close-on-click-modal="false" :close-on-press-escape="false">
  <div style="overflow: auto;" v-loading="dataLoading">
    <el-form :model="model" ref="model" class="new-form" label-position="top" size="small">
      <el-form-item>
        <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-input size="small" v-model="model.name"></el-input>
        </el-form-item>
        <el-form-item label="资源路径" prop="url" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-input size="small" v-model="model.url"></el-input>
        </el-form-item>
        <el-form-item label="权限字符串" prop="permission" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-input size="small" v-model="model.permission"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="seqNum" :rules="[{ required: true, message: '该字段不能为空'}]" v-if="resourceType === 'menu'">
          <el-input-number size="small" v-model="model.seqNum" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="isDeleted" :rules="[{ required: true, message: '该字段不能为空'}]">
          <!-- <el-switch v-model="model.isDeleted" active-text="作废" inactive-text="正常"></el-switch> -->
          <el-select v-model="model.isDeleted" placeholder="请选择">
            <el-option label="正常" :value="false"></el-option>
            <el-option label="作废" :value="true"></el-option>
          </el-select>
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
    parentId: String,
    resourceType: String
  },
  data() {
    return {
      model: {
        name: "",
        resourceType: this.resourceType,
        url: "",
        permission: "",
        parentId: "",
        seqNum: 0,
        isDeleted: false
      },
      loading: false,
      dataLoading: false
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.model.parentId = this.parentId
        console.log(this.model)
        if (this.id != "") {
          this.dataLoading = true;
          this.detail();
        }
      }
    }
  },
  methods: {
    //获取
    detail() {
      api.getPermission({ id: this.id }).then(res => {
        this.model = res.data.data;
        this.dataLoading = false;
      });
    },
    //添加
    save() {
      api
        .addPermission(this.model)
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
        .updatePermission(this.model)
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
        resourceType: "menu",
        url: "",
        permission: "",
        parentId: "",
        seqNum: 0,
        isDeleted: false
      }
      return model
    }
  }
};
</script>

