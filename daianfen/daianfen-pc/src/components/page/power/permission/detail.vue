<template>
  <div class="wrap" ref="wrap">
    <div ref="header">
      <qc-header :title="`${$route.query.name}-权限列表`"></qc-header>
    </div>
    <div ref="search">
      <button-wrap>
        <el-button type="primary" size="mini" @click="insert()">添加</el-button>
      </button-wrap>
    </div>
    <div>
      <table class="power-permission" cellpadding="0" cellspacing="0">
        <thead>
          <tr>
            <th>名称</th>
            <th>链接</th>
            <th>状态</th>
            <!-- <th>排序</th> -->
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in listByParent" :key="i">
            <!-- <td v-if="!item.child">
              <i class="el-icon-caret-bottom" @click="show(item)" v-if="item.show"></i>
              <i class="el-icon-caret-right" @click="show(item)" v-else></i>
              {{item.name}}
            </td>
            <td v-else>
              <span style="padding-left: 20px;">{{item.name}}</span>
            </td> -->
            <td>{{item.name}}</td>
            <td>{{item.url}}</td>
            <td>{{item.isDeleted ? '作废' : '正常'}}</td>
            <!-- <td>{{item.seqNum}}</td> -->
            <td>
              <el-button size="mini" type="primary" @click="update(item)">编辑</el-button>
              <el-button size="mini" type="danger" @click="deleteConfirm(item.id)">删除</el-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <dig-form :visible='digFormWrap' :id="updateId" :parentId="parentId" @close="digClose" resourceType="button"></dig-form>
  </div>
</template>

<script>
import QcHeader from "common/QcHeader";
import ButtonWrap from "common/ButtonWrap";
import DigForm from "./form";
import api from "api/common";

export default {
  components: {
    QcHeader,
    ButtonWrap,
    DigForm
  },
  data() {
    return {
      updateId: "",
      parentId: "",
      digFormWrap: false,
      listByParent: []
    };
  },
  created() {
    this.listByParentId();
  },
  methods: {
    listByParentId() {
      api.listByParentId({ id: this.$route.query.id }).then(res => {
        console.log(res.data);
        this.listByParent = res.data.data
      });
    },
    insert(item) {
      this.parentId = this.$route.query.id;
      this.digFormWrap = true;
    },
    update(item) {
      this.updateId = item.id;
      this.digFormWrap = true;
    },
    deleteConfirm(id) {
      this.$confirm("是否删除该数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delete(id);
        })
        .catch(() => {
          return;
        });
    },
    delete(id) {
      api
        .deletePermission({ id: id })
        .then(res => {
          this.listByParentId();
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
    digClose(flag) {
      this.updateId = "";
      this.digFormWrap = false;
      if (typeof flag == "boolean" && flag) {
        this.listByParentId();
      }
    }
  }
};
</script>

<style lang="less" scoped>
.power-permission {
  text-align: left;
  border: 1px solid #ddd;
  width: 100%;
  th,
  td {
    padding: 10px;
  }
  td {
    border-top: 1px solid #ddd;
  }
  tbody {
    tr {
      &:nth-child(odd) {
        td {
          background-color: #f9f9f9;
        }
      }
      &:hover {
        td {
          background-color: #e9e9e9;
        }
      }
    }
  }
}
</style>