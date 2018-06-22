<template>
 <div class="wrap" ref="wrap">
    <div ref="search">
      <search-wrap>
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="上架">
            <el-select size="small" v-model="searchData.onSale">
              <el-option label="全部" value=""></el-option>
              <el-option label="上架" value="1"></el-option>
              <el-option label="未上架" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="search()">查询</el-button>
          </el-form-item>
        </el-form>
      </search-wrap>
      <button-wrap>
        <el-button type="primary" size="mini" @click="insert()">添加</el-button>
        <el-button type="primary" size="mini" :disabled="tableList.id == null" @click="update()">修改</el-button>
        <el-button type="danger" size="mini" :disabled="tableList.id == null"  @click="deleteConfirm()">删除</el-button>
      </button-wrap>
    </div>
    <qc-table ref="table" :height="domHeight" :table-list="showData" :search="searchData" url="api/v1/admin/product/page">
    </qc-table>
    <dig-form v-if="digFromWrap" :visible="digFromWrap" :id="updateId" @close="close" ></dig-form>
  </div>
</template>

<script>
import { tableMixin } from "@/assets/js/tableMixin.js";
import SearchWrap from "common/SearchWrap";
import ButtonWrap from "common/ButtonWrap";
import DigForm from "./form";
import api from "api/common.js";
export default {
  mixins: [tableMixin],
  components: { SearchWrap, ButtonWrap, DigForm },
  data() {
    return {
      digFromWrap: false,
      updateId: "",
      searchData: {
        isRelease: "",
      },
      showData: [
        // { template: "index" },
        { prop: "seqNum", label: "排序号" },
        { prop: "iconUrl", label: "图标", template: 'img', isPrefix: true },
        { prop: "name", label: "商品名称" },
        { prop: "brandName", label: "品牌" },
        { prop: "isSell", label: "是否上架", template: 'Boolean' },
        { prop: "price", label: "现价", template: 'price' },
        { prop: "qty", label: "库存" },
        { prop: "createTime", label: "创建时间" },
      ]
    };
  },
  methods: {
    insert () {
      // this.digFromWrap = true;
      this.$router.push('list/detail')
    },
    update () {
      this.updateId = this.tableList.id;
      this.$router.push(`list/detail?id=${this.tableList.id}`)
      // this.digFromWrap = true;
    },
    deleteConfirm () {
      this.$confirm("是否删除该数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.delete()
      })
      .catch(() => {
        return
      })
    },
    delete () {
      api.deleteProduct({id: this.tableList.id}).then(res => {
        this.searchKeep()
        this.$message({
          message: "删除成功",
          type: "success"
        })
      }).catch(err => {
        this.$message({
          message: err.data.errMsg,
          type: "error"
        })
      })
    },
    close(flag) {
      this.updateId = "";
      this.digFromWrap = false;
      if(typeof flag == 'boolean' && flag){
        this.searchKeep();
      }
    }
  }
};
</script>
