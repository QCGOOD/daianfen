<template>
<el-dialog :title='id ? "修改优惠券规则" : "添加优惠券规则 "' :visible.sync="visible" width="880px" :append-to-body="true" :before-close="close" :close-on-click-modal="false" :close-on-press-escape="false">
  <div style="overflow: auto;">
    <el-form :model="model" ref="model" class="new-form" label-position="top">
      <el-form-item label="等级头衔" prop="name" :rules="[{ required: true, message: '该字段不能为空'}]">
        <el-input size="small" v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item label="等级类型" prop="type" :rules="[{ required: true, message: '该字段不能为空'}]">
        <el-input-number size="small" v-model="model.type" :disabled="true"></el-input-number>
      </el-form-item>
      <el-form-item label="等级" prop="level" :rules="[{ required: true, message: '该字段不能为空'}]">
        <el-input-number size="small" v-model="model.level"></el-input-number>
      </el-form-item>
      <el-form-item label="经验值" prop="experienceAmount" :rules="[{ required: true, message: '该字段不能为空'}]">
        <el-input-number size="small" v-model="model.experienceAmount"></el-input-number>
      </el-form-item>
      <el-form-item label="描述" prop="description" :rules="[{ required: true, message: '该字段不能为空'}]">
        <el-input size="small" v-model="model.description"></el-input>
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
        ruleName: '',
        ruleType: 2,
        ruleDescription: '',
        ruleStartTime: '',
        ruleEndTime: '',
        totalQuantity: 1,
        quantityPerDay: 1,
        memberReceiveQuantity: 1,
        memberReceiveQuantityPerDay: 1,
        content: '',
        couponAmount: '',
        couponOrderAmount: '',
        couponDescription: '',
        couponIcon: '',
        couponTitle: '',
        couponScope: '',
      }
    };
  },
  watch: {
    visible: {
      handler: function(val) {
        this.model.type = this.$route.query.type
        if (val && this.id != "") {
          this.detail();
        }
      },
      deep: true
    }
  },
  methods: {
    //获取信息
    detail () {
      api.getLevelConfig({id: this.id}).then(res => {
        this.model = res.data.data
      });
    },
    //添加
    save () {
      api.addLevelConfig(this.model).then(res => {
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
    //修改
    update() {
      api.updateLevelConfig(this.model).then(res => {
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
            this.save();
          }
        } else {
          return false;
        }
      });
    },
    close(flag) {
      this.model = this.util.resetFields(this.model)
      console.log('close')
      this.$emit("close", flag);
    },
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
