<template>
  <div class="wrap" ref="wrap">
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
            <th>排序</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in manageMenu" :key="i" v-if="!item.childHide">
            <td v-if="!item.child">
              <i class="el-icon-caret-bottom" @click="show(item)" v-if="item.show"></i>
              <i class="el-icon-caret-right" @click="show(item)" v-else></i>
              {{item.name}}
            </td>
            <td v-else>
              <span style="padding-left: 20px;">{{item.name}}</span>
            </td>
            <td>{{item.url}}</td>
            <td>{{item.isDeleted ? '作废' : '正常'}}</td>
            <td>{{item.seqNum}}</td>
            <td>
              <el-button size="mini" type="primary" @click="update(item)">编辑</el-button>
              <el-button size="mini" type="danger" @click="deleteConfirm(item.id)">删除</el-button>
              <el-button size="mini" type="info" @click="insert(item)" v-if="!item.child">添加子菜单</el-button>
              <el-button size="mini" type="info" v-else @click="detail(item)">编辑权限</el-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <dig-form :visible='digFormWrap' :id="updateId" :parentId="parentId" @close="digClose" resourceType="menu"></dig-form>
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
      parentId: "",
      digFormWrap: false,
      searchData: {
        name: "",
        resourceType: ""
      },
      showData: [
        { template: "index" },
        { prop: "name", label: "名称" },
        { prop: "resourceType", label: "资源类型" },
        { prop: "url", label: "接口" },
        { prop: "permission", label: "许可" },
        { prop: "createTime", label: "创建时间" }
      ],
      manageMenu: []
    };
  },
  created() {
    this.manageMenuTree();
  },
  methods: {
    manageMenuTree() {
      api.manageMenuTree().then(res => {
        console.log("manageMenuTree === ", res.data);
        let data = [];
        res.data.data.map(item => {
          item.show = true;
          data.push(item);
          if (item.childs) {
            item.childs.map(label => {
              label.child = true;
              label.childHide = false;
              data.push(label);
            });
          }
        });
        console.log("data == ", data);
        this.manageMenu = data;
      });
    },
    show(item) {
      console.log(item)
      item.show = !item.show
      this.manageMenu.map(label => {
        if (label.child) {
          if (label.parentId === item.id) {
            label.childHide = !label.childHide
          }
        }
      })
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
          this.manageMenuTree();
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
    insert(item) {
      if (item) this.parentId = item.id
      this.digFormWrap = true;
    },
    update(item) {
      this.updateId = item.id;
      this.digFormWrap = true;
    },
    detail(item) {
      this.$router.push(`permission/detail?id=${item.id}&name=${item.name}`);
    },
    digClose(flag) {
      this.updateId = "";
      this.digFormWrap = false;
      if (typeof flag == "boolean" && flag) {
        this.manageMenuTree();
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
