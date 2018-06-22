<template>
  <div class="wrap" ref="wrap">
    <div ref="header">
      <qc-header title="修改角色权限"></qc-header>
    </div>
    <div class="power-content">
      <div v-for="(item, i) in tree" :key="i">
        <p class="title">
          <el-checkbox v-model="state" class="checkbox">{{item.name}}</el-checkbox>
        </p>
        <div class="item-list" v-for="(label, i) in item.childs" :key="i">
          <el-checkbox v-model="state">{{label.name}}</el-checkbox>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QcHeader from "common/QcHeader";
import ButtonWrap from "common/ButtonWrap";
import DigForm from "./form";
import api from "api/common";

export default {
  components: {
    QcHeader
  },
  data() {
    return {
      tree: [],
      state: false
    }
  },
  created() {
    this.permissionTree();
  },
  methods: {
    permissionTree() {
      api.permissionTree().then(res => {
        console.log(res.data);
        this.tree = res.data.data
      });
    }
  }
};
</script>

<style lang="less">
.power-content {
  padding: 20px;
  .title {
    padding: 10px 0;
    border-bottom: 1px dashed #ccc;
    .checkbox {
      .el-checkbox__label {
        font-size: 16px;
      }
    }
  }
  .item-list {
    padding: 10px 0;
    margin-left: 20px;
  }
}
</style>
