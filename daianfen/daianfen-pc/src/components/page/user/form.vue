<template>
<el-dialog :title='isAdd?"添加商户":"修改商户"' :visible.sync="visible" width="880px" :append-to-body="true" :before-close="close" :close-on-click-modal="false" :close-on-press-escape="false">
  <div style="overflow: auto;">
    <el-form :model="model" ref="model" class="new-form">
      <el-form-item label="店名" prop="name" :rules="[{ required: true, message: '该字段不能为空'}]">
        <el-input size="small" v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile" :rules="[{ required: true, message: '该字段不能为空'}]">
        <el-input size="small" v-model="model.mobile"></el-input>
      </el-form-item>    
       <el-form-item label="行业" prop="industry" >
        <el-input size="small" v-model="model.industry"></el-input>
      </el-form-item>
        <el-form-item label="城市" prop="city" >
        <el-input size="small" v-model="model.city"></el-input>
      </el-form-item>
        <el-form-item label="负责人" prop="personInCharge" :rules="[{ required: true, message: '该字段不能为空'}]">
        <el-input size="small" v-model="model.personInCharge"></el-input>
      </el-form-item> 
     <el-form-item label="客服电话" prop="customerServiceNumbers" >
        <el-input size="small" v-model="model.customerServiceNumbers"></el-input>
      </el-form-item>
      <el-form-item label="店铺说明" prop="info" :rules="[{ required: true, message: '该字段不能为空'}]">
        <el-input size="small" v-model="model.info"></el-input>
      </el-form-item>
          <el-form-item label="审批者" prop="auditBy" >
        <el-input size="small" v-model="model.auditBy"></el-input>
      </el-form-item> 
    </el-form>
      
    <div class="img-upload">
      <div class="img-item">
        <p>图标</p>
        <el-upload class="avatar-uploader" :show-file-list="false" name="file" :data="{ imageType: 'store'}" :action="`/athena-app/api/v1/attachments/images/tencent_cloud`" :on-success="imgSuccess" :on-error="imgFail" :before-upload="beforeAvatarUpload">
          <img v-if='model.iconImage' :src="`${imgHost}${model.iconImage}`" class="avatar">
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
    </div>
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
    },
    updateJson: {
      type: Object
    }
  },
  data() {
    return {
      basic: {
        name: "",
        industry: "",
        city: "",
        iconUrl: "",
        isSell: true,
        isRelease: true,
        seqNum: ""
      },
      model: {
        name: "",
        industry:'',
        iconImage: "",
        auditBy: "",
        info: "",
        code: "",
        content: "",
        mobile: "",
        city:'',
        loginUsername: "",
        loginPassword: "",
        address: "",
        seqNumL: "",
        personInCharge: "",
        customerServiceNumbers: ""
      },
      industryList: [
        { id: "1", title: "覆盖发" },
        { id: "2", title: "品牌的萨达二" },
        { id: "3", title: "多少多少" },
        { id: "4", title: "品牌ad撒四" }
      ],
      cityList: [
        { id: "1", title: "覆盖发" },
        { id: "2", title: "品牌的萨达二" },
        { id: "3", title: "多少多少" },
        { id: "4", title: "品牌ad撒四" }
      ]
    };
  },
  watch: {
    visible: {
      handler: function(val) {
        console.log(this.isAdd);
        if (val && this.id != "" && this.isAdd) {
          this.detail();
          this.model = this.updateJson;
        }
      },
      deep: true
    }
  },
  methods: {
    //获取更新品牌信息
    detail() {
      api.getStore(this.id).then(res => {
        // this.model = Object.assign({}, res.data.data);
        // console.log(res.data);
        this.model = res.data
      });
    },
    //添加保存
    save(model) {
      let params = {
         name: "",
        iconImage: "",
        info: "",
        code: "",
        industry:'',
        content: "",
        mobile: "",
        loginUsername: "",
        loginPassword: "",
        address: "",
        seqNumL: "",
        city:'',
        personInCharge: "",
        auditBy:'',
        customerServiceNumbers: "",
        status: 0,
        auditStatus: 0,
        isPlatformProduct: true
      };
      for (let val in params) {
        model[val] == undefined
          ? (params[val] = params[val])
          : (params[val] = model[val]);
      }
      console.log(params);
    // return 
      api
        .addStore(params)
        .then(res => {
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
      api.updatetore(this.model).then(res => {
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
      // this.model.iconImage = "";
      this.$refs.model.resetFields();
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
      // console.log("imgSuccess", res.data);
      this.model.iconImage = res.data.imageUrl;
      console.log("图片地址", this.model.iconImage);
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
.content .el-form-item {
  width: 280px;
  display: inline-block;
}
</style>
