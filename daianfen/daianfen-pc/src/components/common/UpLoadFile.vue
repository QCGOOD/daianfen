<template>
  <div style="display: inline-block; margin-left: 10px;">
    <el-upload
      :action="action"
      :show-file-list="false"
      :on-success="fileSuccess"
      :data="data"
      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      :before-upload="beforeFileUpload">
      <el-button :size="size" type="info" >{{title}}</el-button>
      <!-- :disabled="id == null" -->
    </el-upload>
  </div>
</template>

<script>
export default {
  props: {
    url: String,
    id: {
      default: null,
      type: String
    },
    data: Object,
    title: {
      default: "导入",
      type: String
    },
    size: {
      default: "mini",
      type: String
    }
  },
  data() {
    return {
      action: ""
    };
  },
  mounted() {
    this.action = `${this.base.projectName()}${this.url}`;
  },
  methods: {
    clearFiles() {
      this.$refs.upload.clearFiles();
    },
    beforeFileUpload(file) {
      const type =
        file.name.split(".")[1] == "xlsx" || file.name.split(".")[1] == "xls";
      if (!type) {
        this.$message.error("请上传xlsx或xls");
      }
      return type;
    },
    fileSuccess(res) {
      if (res.errCode === 0) {
        this.$message({
          message: "导入成功",
          type: "success"
        });
      } else {
        this.$message({
          message: res.errMsg,
          type: "error"
        });
      }
    }
  }
};
</script>
