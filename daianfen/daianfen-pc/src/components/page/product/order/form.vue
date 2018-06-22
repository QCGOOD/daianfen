<template>
<el-dialog title="修改订单物流" :visible.sync="visible" width="880px" :append-to-body="true" :before-close="close" :close-on-click-modal="false" :close-on-press-escape="false">
  <div style="overflow: auto;" v-loading="dataLoading">
    <el-form :model="model" ref="model" class="new-form">
      <el-form-item>
        <el-form-item label="物流公司" prop="logisticsCompany" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-input size="small" v-model="model.logisticsCompany"></el-input>
        </el-form-item>
        <el-form-item label="物流单号" prop="logisticsNo" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-input size="small" v-model="model.logisticsNo"></el-input>
        </el-form-item>
        <el-form-item label="物流信息" prop="logisticsInfo" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-input size="small" v-model="model.logisticsInfo"></el-input>
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
    }
  },
  data() {
    return {
      model: {
        logisticsCompany: "",
        logisticsNo: "",
        logisticsInfo: "",
        id: ""
      },
      loading: false,
      dataLoading: false
    };
  },
  watch: {
    visible(val) {
      if (val && this.id != "") {
        // this.dataLoading = true;
        // this.detail();
        this.model.id = this.id;
      }
    }
  },
  methods: {
    //获取
    detail() {
      api.getbrand(this.id).then(res => {
        console.log(res.data.data);
        this.model = res.data.data;
      });
    },
    //添加
    save() {
      api
        .saveBrand(this.model)
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
        .updateLogistics(this.model)
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
        logisticsCompany: "",
        logisticsNo: "",
        logisticsInfo: "",
        id: ""
      }
      return model
    }
  }
};
</script>
