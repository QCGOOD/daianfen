<template>
<el-dialog :title='id ? "修改" : "添加"' :visible.sync="visible" width="880px" :append-to-body="true" :before-close="close" :close-on-click-modal="false" :close-on-press-escape="false">
  <div style="overflow: auto;">
    <el-form :model="model" ref="model" class="new-form" label-position="top">
      <el-form-item class="item-text">
        <el-form-item label="商户名称" prop="name" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-input size="small" v-model="model.name"></el-input>
        </el-form-item>
        <el-form-item label="行业" prop="industry" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-input size="small" v-model="model.industry"></el-input>
        </el-form-item>
        <el-form-item label="城市" prop="city" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-input size="small" v-model="model.city"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-input size="small" v-model="model.address"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="personInCharge" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-input size="small" v-model="model.personInCharge"></el-input>
        </el-form-item>
        <el-form-item label="负责人手机号码" prop="mobile" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-input size="small" v-model="model.mobile"></el-input>
        </el-form-item>
        <el-form-item label="客服电话" prop="customerServiceNumbers" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-input size="small" v-model="model.customerServiceNumbers"></el-input>
        </el-form-item>
        <el-form-item label="店铺说明" prop="info" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-input size="small" v-model="model.info"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-select v-model="model.status" size="small">
            <el-option label="新建" :value="0"></el-option>
            <el-option label="开业" :value="1"></el-option>
            <el-option label="歇业" :value="2"></el-option>
            <el-option label="结业" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否使用平台的商品" prop="isPlatformProduct" >
          <el-switch v-model="model.isPlatformProduct" active-text="使用平台的商品" active-color="#409EFF"></el-switch>
        </el-form-item>
      </el-form-item>
      <el-form-item label="商标" prop="logoIconUrl" :rules="[{ required: true, message: '该字段不能为空'}]">
        <div class="upload-img-box" @click="openImgBox()">
          <img v-if="model.logoIconUrl" :src="`${imgHost}/${model.logoIconUrl}`" style="width: 120px;">
          <i v-else class="el-icon-plus upload-icon"></i>
        </div>
      </el-form-item>
    </el-form>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="close(false)">取 消</el-button>
    <el-button size="small" type="primary" @click="success()" :loading="loading">确 定</el-button>
  </span>
  <image-dialog :visible="digImgWrap" uploadType="radio" imageType='actType' @close-imgbox="closeImgbox" @get-imgsrc="onGetImgsrc"></image-dialog>
</el-dialog>
</template>

<script>
import api from "api/common";
import ImageDialog from "common/ImageDialog";

export default {
  props: {
    visible: Boolean,
    id: {
      type: String,
      default: ""
    }
  },
  components: {
    ImageDialog
  },
  data() {
    return {
      digImgWrap: false,
      model: {
        name: "",
        logoIconUrl: "",
        type: 0,
        industry: "",
        city: "",
        address: "",
        personInCharge: "",
        mobile: "",
        customerServiceNumbers: "",
        info: "",
        status: 0,
        auditStatus: 0,
        auditStatus: "",
        isPlatformProduct: false
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
      ],
      loading: false
    };
  },
  watch: {
    visible: {
      handler: function(val) {
        if (val && this.id) {
          this.detail();
        }
      },
      deep: true
    }
  },
  methods: {
    //获取更新品牌信息
    detail() {
      api.getStore({ id: this.id }).then(res => {
        this.model = res.data.data;
      });
    },
    //添加
    save() {
      api
        .addStore(this.model)
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
        .updatetore(this.model)
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
        logoIconUrl: "",
        type: 0,
        industry: "",
        city: "",
        address: "",
        personInCharge: "",
        mobile: "",
        customerServiceNumbers: "",
        info: "",
        status: 0,
        auditStatus: 0,
        auditStatus: "",
        isPlatformProduct: false
      }
      return model
    },
    // 打开图片对话框
    openImgBox() {
      this.digImgWrap = true;
    },
    // 关闭图片对话框
    closeImgbox(state) {
      this.digImgWrap = false;
    },
    // 单张图片
    onGetImgsrc(val) {
      this.model.logoIconUrl = val;
    }
  }
};
</script>