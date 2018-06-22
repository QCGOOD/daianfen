<template>
<el-dialog :title='id ? "修改账号" : "添加账号 "' :visible.sync="visible" width="880px" :append-to-body="true" :before-close="close" :close-on-click-modal="false" :close-on-press-escape="false">
  <div style="overflow: auto;">
    <el-form :model="model" ref="model" class="new-form" label-position="top">
      <el-form-item label="角色名" prop="name" :rules="[{ required: true, message: '该字段不能为空'}]">
        <el-input size="small" v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item label="角色标识" prop="role" :rules="[{ required: true, message: '该字段不能为空'}]">
        <el-input size="small" v-model="model.role"></el-input>
      </el-form-item>
      <el-form-item label="角色信息" prop="description" :rules="[{ required: true, message: '该字段不能为空'}]">
        <el-input size="small" v-model="model.description"></el-input>
      </el-form-item>
      <el-form-item label="是否冻结" prop="isFrozen">
        <el-checkbox v-model="model.isFrozen">冻结</el-checkbox>
      </el-form-item>
    </el-form>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="close(false)">取 消</el-button>
    <el-button size="small" type="primary" @click="success()">确 定</el-button>
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
        role: "",
        description: "",
        isFrozen: false,
      }
    };
  },
  watch: {
    visible: {
      handler: function(val) {
        
        if (val && this.id != "") {
          this.detail();
        }
      },
      deep: true
    }
  },
  methods: {
    //获取信息
    detail() {
      api.getRole({id: this.id}).then(res => {
        this.model = res.data.data
      });
    },
    //添加保存
    save(model) {
      api.addRole(this.model).then(res => {
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.close(true);
        })
        .catch(err => {
          console.log("错误:" + err);
        });
    },
    //修改商户
    update() {
      api.updateRole(this.model).then(res => {
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
      // this.$refs.model.resetFields();
      this.model = this.util.resetFields(this.model)
      // this.model = {}
      console.log('close')
      this.$emit("close", flag);
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
.avatar-uploader {
  position: relative;
  width: 178px;
  height: 178px;
  border-radius: 6px;
  border: 1px dashed #d9d9d9;
  overflow: hidden;
  cursor: pointer;
}
.avatar-uploader:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  // height: 178px;
  display: block;
}
.img-upload {
  display: flex;
  justify-content: space-between;
  .img-item {
    width: 270px;
  }
}
</style>
