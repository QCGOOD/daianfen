<template>
<el-dialog title='分销者' :visible.sync="visible" width="880px" :append-to-body="true" :before-close="close" :close-on-click-modal="false" :close-on-press-escape="false">
  <div style="overflow: auto;">
    <el-form :model="model" ref="model" class="new-form">
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
    }
  },
  data() {
    return {
      model: {
        username: "",
        password: "",
        memberId: "",
      }
    };
  },
  watch: {
    visible: {
      handler: function(val) {
        if (val && this.id != "") {
          // this.detail();
          this.model.memberId = this.id
        }
        deep: true;
      }
    }
  },
  methods: {
    //更新信息
    detail() {
      api.getChannelCode({ id: this.id }).then(res => {
        console.log(res.data.data);
        this.model = res.data.data;
      });
    },
    //添加
    save() {
      api.addChannelCode(this.model).then(res => {
        this.$message({
          message: "添加成功",
          type: "success"
        });
        this.close(true);
      });
    },
    //修改
    update() {
      api.transferMember(this.model).then(res => {
        this.$message({
          message: "添加成功",
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
.content .el-form-item {
  width: 280px;
  display: inline-block;
}
</style>
