<template>
 <div class="wrap" ref="wrap">
    <div ref="search">
      <!-- <search-wrap>
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="活动名称">
            <el-input size="small" v-model="searchData.title"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="search()">查询</el-button>
          </el-form-item>
        </el-form>
      </search-wrap> -->
      <button-wrap>
        <el-button type="primary" size="mini" @click="insert()">添加</el-button>
        <el-button type="primary" size="mini" :disabled="tableList.id == null" @click="update(1)">修改</el-button>
        <el-button type="primary" size="mini" :disabled="tableList.id == null" @click="update(2)">复制</el-button>
        <el-button type="primary" size="mini" :disabled="tableList.id == null" @click="detail()">详情</el-button>
        <el-button type="primary" size="mini" :disabled="tableList.id == null" @click="getVisible(1)" v-if="base.transferMember">提取活动链接</el-button>
        <el-button type="primary" size="mini" :disabled="tableList.id == null" @click="getVisible(2)" v-else>提取活动链接</el-button>
        <el-button type="primary" size="mini" :disabled="tableList.id == null || tableList.isRelease" @click="deleteConfirm(2)">发布</el-button>
        <el-button type="danger" size="mini" :disabled="tableList.id == null || !tableList.isRelease" @click="deleteConfirm(3)">取消发布</el-button>
        <el-button type="danger" size="mini" :disabled="tableList.id == null"  @click="deleteConfirm(1)">删除</el-button>
      </button-wrap>
    </div>
    <qc-table ref="table" :table-list="showData" :search="searchData" url="api/admin/v1/activity/page">
    </qc-table>
    <link-dialog :id="tableList.id" :channel="channel" :visible="actVisible" @close="closeLink"></link-dialog>

    <el-dialog title="活动链接" :visible.sync="simpleVisible" :append-to-body="true" :close-on-click-modal="false" :before-close="closeSimple" width="880px">
    <div style="display: flex;">
      <el-input size="small" v-model="shareLink"></el-input>
      <el-button size="mini" type="primary" style="margin: 0 15px;" @click="copy(shareLink)">复制</el-button>
      <el-popover placement="right" width="160" trigger="click">
        <qrcode 
          :value="shareLink" 
          v-if="shareLink" 
          tag="img"
          :options="{ size: 160 }"
          >
        </qrcode>
        <el-button slot="reference" type="primary" size="small" ref="test">二维码</el-button>
      </el-popover>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="closeSimple()" size="small">确 定</el-button>
    </span>
  </el-dialog>
  </div>
</template>

<script>
import { tableMixin } from "@/assets/js/tableMixin.js";
import SearchWrap from "common/SearchWrap";
import ButtonWrap from "common/ButtonWrap";
import LinkDialog from "./linkDialog";
import api from "api/common.js";
import Qrcode from '@xkeshi/vue-qrcode';

export default {
  mixins: [tableMixin],
  components: { SearchWrap, ButtonWrap, LinkDialog, Qrcode },
  data() {
    return {
      digFromWrap: false,
      actVisible: false,
      checkVisible: false,
      simpleVisible: false,
      updateId: "",
      searchData: {
        title: ""
      },
      showData: [
        { template: "index" },
        { prop: "iconUrl", label: "图标", template: "img", isPrefix: true },
        { prop: "title", label: "活动名称" },
        { prop: "isEnableFee", label: "付费活动", template: "Boolean" },
        { prop: "isRelease", label: "发布", template: "Boolean" },
        { prop: "place", label: "地点" },
        { prop: "address", label: "详细地址" },
        { prop: "startTime", label: "开始时间" },
        { prop: "endTime", label: "结束时间" },
        { prop: "createTime", label: "创建时间" }
      ],
      channel: [],
      shareBase: `${this.base.baseHost}${this.base.projectName()}/mobile/POUND/activity/detail?wo=1&wot=2&woacm=1&mpl=1&`,
      shareLink: '',
    };
  },
  created() {
    this.listChannel();
  },
  methods: {
    listChannel() {
      api
        .listChannel({ pageSize: 20, pageNum: 1, name: "", mobile: "" })
        .then(res => {
          console.log("listChannel === ", res.data);
          this.channel = res.data.data.list
        });
    },
    insert() {
      this.$router.push("list/release");
    },
    update(count) {
      this.updateId = this.tableList.id;
      if (count === 1) {
        if (this.tableList.isRelease)
          this.$router.push(
            `list/release?id=${this.tableList.id}&isRelease=true`
          );
        else this.$router.push(`list/release?id=${this.tableList.id}`);
      } else {
        this.$router.push(`list/release?id=${this.tableList.id}&copy=true`);
      }
    },
    detail() {
      this.$router.push(`list/detail?id=${this.tableList.id}`);
    },
    release(count) {
      let params = {
        id: this.tableList.id,
        isRelease: count === 2 ? true : false
      };
      api.updateRelease(params).then(res => {
        console.log('updateRelease == ', res.data || 0)
        this.searchKeep();  
        this.$message({
          message: "发布成功",
          type: "success"
        });
      });
    },
    deleteConfirm(count) {
      let text =
        count === 1 ? "是否删除该数据?" : 2 ? "是否发布?发布后不可修改付费状态" : '是否取消发布?';
      this.$confirm(text, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (count === 1) this.delete();
          else this.release(count);
        })
        .catch(() => {
          return;
        });
    },
    delete() {
      api
        .deleteActivity({ id: this.tableList.id })
        .then(res => {
          this.searchKeep();
          this.$message({
            message: "删除成功",
            type: "success"
          });
        })
        .catch(err => {
          this.$message({
            message: err.data.errMsg,
            type: "error"
          });
        });
    },
    close(flag) {
      this.updateId = "";
      this.digFromWrap = false;
      if (typeof flag == "boolean" && flag) {
        this.searchKeep();
      }
    },
    getVisible(count) {
      if (count === 1) this.actVisible = true;
      if (count === 2) {
        this.shareLink = `${this.shareBase}id=${this.tableList.id}`
        this.simpleVisible = true;
      }
    },
    closeSimple () {
      this.simpleVisible = false;
    },
    closeLink() {
      this.actVisible = false;
    },
    copy(shareLink) {
      let oInput = document.createElement("input");
      oInput.value = shareLink;
      document.body.appendChild(oInput);
      oInput.select();
      document.execCommand("copy");
      oInput.style.display = 'none';
      document.body.removeChild(oInput);
      this.$message({
        message: "复制成功",
        type: "success"
      });
    },
  }
};
</script>
