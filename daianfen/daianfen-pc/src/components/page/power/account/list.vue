<template>
  <div class="wrap" ref="wrap">
    <div ref="search">
      <search-wrap>
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="用户名">
            <el-input size="small" v-model="searchData.name"></el-input>
          </el-form-item>
          <el-form-item label="用户账号">
            <el-input size="small" v-model="searchData.username"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="search()">查询</el-button>
          </el-form-item>
        </el-form>
      </search-wrap>
      <button-wrap>
        <el-button type="primary" size="mini" @click="insert()">添加账号</el-button>
        <el-button type="primary" size="mini" @click="update()" :disabled="tableList.id == null">修改账号</el-button>
        <el-button type="primary" size="mini" @click="openPwd()" :disabled="tableList.id == null">修改账号密码</el-button>
        <el-button type="danger" size="mini" @click="deleteConfirm()" :disabled="tableList.id == null">删除账号</el-button>
      </button-wrap>
    </div>
    <qc-table ref="table" :height="domHeight" :table-list="showData" :search="searchData" url="api/v1/admin/account/page"></qc-table>
    <dig-form :visible='digFormWrap' :id="updateId" @close="digClose" ></dig-form>

    <el-dialog title="修改账号密码" :visible.sync="visiblePwd" :append-to-body="true" :before-close="closePwd" :close-on-click-modal="false" :close-on-press-escape="false">
      <div style="overflow: auto;">
        <el-form :model="pwdData" ref="pwdData" class="new-form">
          <el-form-item label="旧密码" prop="password" :rules="[{ required: true, message: '该字段不能为空'}]">
            <el-input size="small" v-model="pwdData.password"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword" :rules="[{ required: true, message: '该字段不能为空'}]">
            <el-input size="small" v-model="pwdData.newPassword"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="closePwd()">取 消</el-button>
        <el-button size="small" type="primary" @click="successPwd()" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { tableMixin } from "@/assets/js/tableMixin";
import SearchWrap from "common/SearchWrap";
import ButtonWrap from "common/ButtonWrap";
import DigForm from "./form";
import api from "api/common";
export default {
  mixins: [tableMixin],
  components: { SearchWrap, ButtonWrap, DigForm },
  data() {
    return {
      updateId: "",
      isAdd: true,
      digFormWrap: false,
      searchData: {
        name: "",
        username: ""
      },
      showData: [
        { template: "index" },
        { prop: "name", label: "用户名" },
        { prop: "username", label: "用户账号" },
        { prop: "password", label: "用户密码" },
        { prop: "createTime", label: "创建时间" }
      ],
      pwdData: {
        username: "",
        password: "",
        newPassword: ""
      },
      visiblePwd: false,
      loading: false
    };
  },
  methods: {
    deleteConfirm() {
      this.$confirm("是否删除该数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delete();
        })
        .catch(() => {
          return;
        });
    },
    delete() {
      api
        .deleteAccount({ id: this.tableList.id })
        .then(res => {
          this.searchKeep();
          this.$message({
            message: "删除成功",
            type: "success"
          });
        })
        .catch(err => {
          this.$message({
            message: err.data.data.errMsg,
            type: "error"
          });
        });
    },
    insert() {
      this.isAdd = true;
      this.digFormWrap = true;
    },
    update() {
      this.updateId = this.tableList.id;
      this.isAdd = false;
      this.digFormWrap = true;
    },
    openPwd() {
      this.pwdData.username = this.tableList.username;
      this.visiblePwd = true;
    },
    closePwd() {
      this.pwdData = this.util.resetFields(this.pwdData);
      this.visiblePwd = false;
    },
    successPwd() {
      this.$refs.pwdData.validate(valid => {
        if (valid) {
          this.loading = true;
          this.updatePwd();
        } else {
          return false;
        }
      });
    },
    updatePwd() {
      api.updatePwd(this.pwdData).then(res => {
        this.loading = false;
        this.$message({
          message: "修改成功",
          type: "success"
        });
        this.closePwd();
      }).catch(err => {
        this.loading = false;
      })
    },
    digClose(flag) {
      this.updateId = "";
      this.digFormWrap = false;
      if (typeof flag == "boolean" && flag) {
        this.searchKeep();
      }
    }
  }
};
</script>