<template>
  <div class="wrap" ref="wrap">
    <div ref="header">
      <qc-header title='活动详情'></qc-header>
    </div>
    <div class="area-box" :style="{'height': `${areaHeight}px`, 'overflow-y': 'auto'}">
      <div class="top">
        <p class="title">{{model.title}}</p>
      </div>
      <el-menu mode="horizontal" :default-active="activeIndex" @select="handleSelect">
        <el-menu-item v-for="(item, i) in sidebarList" :key="i" :index="item.index">{{item.title}}</el-menu-item>
      </el-menu>
      <div class="content">
        <div v-show="activeIndex === '1'">
          <div class="active-title">报名列表</div>
          <div class="search-box padding">
            <el-form :inline="true" size="small">
              <el-form-item label="手机号或姓名">
                <el-input placeholder="请输入手机号或姓名" v-model="signData.page.param"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="sign()">查询</el-button>
              </el-form-item>
            </el-form>
          </div>

          <table-box :tableData="signData.tableData" :propData="signData.propData" :page="signData.page" :activeIndex="activeIndex" @get-selection="getSelection" @current-change="handleCurrentChange" @size-change="handleSizeChange"></table-box>
          
        </div>
        <div v-show="activeIndex === '2'">
          <div class="active-title" v-if="model.activityCheckinSetting">签到时间</div>
          <div class="check-time" v-if="model.activityCheckinSetting">
            <table cellpadding="0" cellspacing="0" class="act-table">
              <tr>
                <th style="width: 220px;">签到开始时间</th>
                <th style="width: 220px;">签到结束时间</th>
                <th style="width: 220px;">签到迟到时间</th>
                <th style="width: 80px;">签到二维码</th>
                <th style="width: 80px;" v-if="model.activityCheckinSetting.isEnableMobileCheckin">手机二维码</th>
                <th style="width: 80px;" v-if="model.activityCheckinSetting.checkinCode">暗号二维码</th>
              </tr>
              <tr v-for="(item, i) in model.activityCheckinSetting.checkinTimeList" :key="i">
                <td>
                  <span>{{item.checkinStartTime}}</span>
                </td>
                <td>
                  <span>{{item.checkinEndTime}}</span>
                </td>
                <td>
                  <span>{{item.checkinLateTime}}</span>
                </td>
                <td>
                  <el-popover placement="right" width="300" trigger="click">
                    <img :src="item.checkinQrcodeUrl" alt="" style="width: 100%;">
                    <el-button slot="reference" type="primary" size="mini">二维码</el-button>
                  </el-popover>
                </td>
                <td v-if="model.activityCheckinSetting.isEnableMobileCheckin">
                  <el-popover placement="right" width="300" trigger="click">
                    <qrcode
                      :value="`http://abs.wego168.com/accelerator_test/mobile/POUND/user/sign?wo=1&wot=2&woacm=1&mpl=1&id=${item.checkinSettingId}&checkWay=1`"
                      v-if="item.checkinSettingId"
                      tag="img"
                      :options="options">
                    </qrcode>
                    <div style="display: flex;">
                      <el-input size="small" :value="`http://abs.wego168.com/accelerator_test/mobile/POUND/user/sign?wo=1&wot=2&woacm=1&mpl=1&id=${item.checkinSettingId}&checkWay=1`" ></el-input>
                      <el-button size="mini" type="primary" style="margin: 0 15px;" @click="copy(`http://abs.wego168.com/accelerator_test/mobile/POUND/user/sign?wo=1&wot=2&woacm=1&mpl=1&id=${item.checkinSettingId}&checkWay=1`)">复制</el-button>
                    </div>
                    <el-button slot="reference" type="primary" size="mini">二维码</el-button>
                  </el-popover>
                </td>
                <td v-if="model.activityCheckinSetting.checkinCode">
                  <el-popover placement="right" width="300" trigger="click">
                    <qrcode
                      :value="`http://abs.wego168.com/accelerator_test/mobile/POUND/user/sign?wo=1&wot=2&woacm=1&mpl=1&id=${item.checkinSettingId}&checkWay=2`"
                      v-if="item.checkinSettingId"
                      tag="img"
                      :options="options">
                    </qrcode>
                    <div style="display: flex;">
                      <el-input size="small" :value="`http://abs.wego168.com/accelerator_test/mobile/POUND/user/sign?wo=1&wot=2&woacm=1&mpl=1&id=${item.checkinSettingId}&checkWay=2`" ></el-input>
                      <el-button size="mini" type="primary" style="margin: 0 15px;" @click="copy(`http://abs.wego168.com/accelerator_test/mobile/POUND/user/sign?wo=1&wot=2&woacm=1&mpl=1&id=${item.checkinSettingId}&checkWay=2`)">复制</el-button>
                    </div>
                    <el-button slot="reference" type="primary" size="mini">二维码</el-button>
                  </el-popover>
                </td>
              </tr>
            </table>
          </div>
          <div class="active-title">签到列表</div>
          <!-- <div class="search-box padding">
            <el-form :inline="true" >
              <el-form-item>
                <el-input placeholder="请输入手机号或姓名" v-model="signData.search" size="small"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="small" @click="search()">查询</el-button>
              </el-form-item>
            </el-form>
          </div> -->
          <!-- <div class="padding">
            <el-radio-group v-model="radio" size="small">
              <el-radio-button :label="item.index" v-for="(item, i) in checkType" :key="i">{{item.name}}</el-radio-button>
            </el-radio-group>
          </div> -->
          <div class="select-btn padding">
            <div class="left">
              <!-- <el-input size="small" placeholder="请输入8位序列号或手机号"></el-input>
              <el-button size="small" type="primary" style="margin-left: 10px;">签到</el-button> -->
              <el-form :inline="true" >
                <el-form-item>
                  <el-input placeholder="请输入手机号或姓名" v-model="checkData.page.param" size="small"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="small" @click="listCheckin()">查询</el-button>
                </el-form-item>
              </el-form>
            </div>
            <!-- <div class="right">
              <el-button size="small" style="width: 80px;">导入Excel</el-button>
              <el-button size="small" style="width: 80px;">导出Excel</el-button>
            </div> -->
          </div>
          <table-box :tableData="checkData.tableData" :propData="checkData.propData" :page="checkData.page" :activeIndex="activeIndex" @get-selection="getSelection" @current-change="handleCurrentChange" @size-change="handleSizeChange" :currentRow="true"></table-box>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QcHeader from "common/QcHeader";
import api from "api/common";
import { tableMixin } from "@/assets/js/tableMixin";
import tableBox from "./table";
import Qrcode from "@xkeshi/vue-qrcode";

export default {
  mixins: [tableMixin],
  components: {
    QcHeader,
    tableBox,
    Qrcode
  },
  data() {
    return {
      options: {
        size: 300
      },
      sidebarList: [
        { index: "1", title: "报名管理" },
        { index: "2", title: "签到管理" },
      ],
      activeIndex: "1",
      model: {
        activitySignSetting: {},
        activityTagList: {},
        activityFee: {}
      },
      category: {},
      tag: {},
      areaHeight: 0,
      radio: 1,
      radioType: [
        { index: 0, name: "全部" },
        { index: 1, name: "待审核" },
        { index: 2, name: "审核通过" },
        { index: 3, name: "审核不通过" },
        { index: 4, name: "待支付" },
        { index: 5, name: "已支付" },
        { index: 6, name: "已报名" },
        { index: 7, name: "已退款" },
        { index: 8, name: "已取消" }
      ],
      checkType: [
        { index: 1, name: "全部" },
        { index: 2, name: "已签到" },
        { index: 3, name: "未签到" }
      ],
      evaluateType: [
        { index: "", name: "全部" },
        { index: 1, name: "未审核" },
        { index: 2, name: "已审核" },
        { index: 3, name: "已拒绝" }
      ],
      signData: {
        radio: 0,
        tableData: [],
        propData: [],
        page: {
          total: 0,
          pageSize: 20,
          pageNum: 1,
          sourceId: this.$route.query.id,
          param: "",
          status: 0
        },
        selectionList: []
      },
      checkData: {
        tableData: [],
        propData: [
          { prop: "name", label: "姓名" },
          { prop: "mobile", label: "手机号码" },
          { prop: "checkWay", label: "签到方式", template: 'checkWay' },
          { prop: "isLate", label: "是否迟到", template: 'Boolean' },
          { prop: "checkinTime", label: "签到时间" },
        ],
        page: {
          total: 0,
          pageSize: 20,
          pageNum: 1,
          param: '',
          sourceId: this.$route.query.id
        },
      },
      commentData: {
        tableData: [],
        propData: [
          { prop: "memberHeadImage", label: "头像", template: "img", headImage: true },
          { prop: "memberName", label: "姓名" },     
          { prop: "content", label: "评论内容" },
          { prop: "createTime", label: "评论时间" },
          { prop: "auditStatus", label: "审核状态", template: 'auditStatus' },
        ],
        page: {
          total: 0,
          pageSize: 20,
          pageNum: 1,
          auditStatus: '',
          sourceId: this.$route.query.id
        },
        row: {}
      }
    };
  },
  created() {
    // this.listCategory();
    this.getLesson(this.$route.query.id);
    this.signDataSetting();
    // this.listCheckin();
    // this.activityComment();
  },
  mounted() {
    this.getHeight();
    window.onresize = () => {
      this.getHeight();
    };
  },
  methods: {
    listCategory() {
      api
        .listCategory({ parentId: "09c896d13f22441d9dfaea4c753acb02" })
        .then(res => {
          this.category = res.data.data.list;
          this.listTag();
        });
    },
    listTag() {
      api.listTag({ type: 4 }).then(res => {
        this.tag = res.data.data.list;
        this.getLesson(this.$route.query.id);
      });
    },
    // 签到列表
    listCheckin() {
      api.listCheckin(this.checkData.page).then(res => {
        console.log("listCheckin === ", res.data);
        this.checkData.tableData = res.data.data.list
      });
    },
    getLesson(id) {
      api.getLesson({ id: id }).then(res => {
        this.model = res.data.data;
        console.log("detail", this.model);
      });
    },
    // 设置高度
    getHeight() {
      this.areaHeight = window.innerHeight - 230;
    },
    // 切换tabbar
    handleSelect(index) {
      if (index === this.activeIndex) return;
      this.activeIndex = index;
      this.$refs.wrap.scrollTop = 0;
    },
    // 选中
    getSelection(index, val) {
      console.log(index);
      if (index == 2) {
        this.signData.selectionList = val;
        console.log("this.signData.selectionList", this.signData.selectionList);
      }
      console.log(val);
    },
    // 翻页
    handleCurrentChange(index, val) {
      console.log(index);
      // 报名
      if (index == 1) {
        this.signData.page.pageNum = val;
        this.sign();
      } else if (index == 2) {
        // 签到
        console.log(index);
        this.checkData.page.pageNum = val;
        this.pageCategory();
      }
    },
    // 显示个数
    handleSizeChange(index, val) {
      // 报名
      if (index == 1) {
        this.signData.page.pageSize = val;
        this.sign();
      }
      // 签到
      if (index == 2) {
        this.checkData.page.pageSize = val;
        this.pageCategory();
      }
    },
    // 搜索
    search() {
      if (this.activeIndex == 1) {
        if (!this.signData.search) return;
        var n = Number(this.signData.search);
        console.log(!isNaN(n));
        console.log(this.signData.search);
      }
    },
    // 获取活动报名的字段
    signDataSetting() {
      api.signDataSetting({ sourceId: this.$route.query.id }).then(res => {
        console.log("报名的字段", res.data);
        res.data.data.map((item, i) => {
          this.signData.propData.push({
            prop: item.fieldName,
            label: item.name,
            id: item.id
          });
        });

        this.signData.propData.push(
          {
            prop: "distributerName",
            label: "业务员"
          },
          {
            prop: "shareMemberName",
            label: "分享者"
          },
          {
            prop: "channelCodeName",
            label: "渠道"
          },
          {
            prop: "createTime",
            label: "报名时间"
          }
        );
        this.sign();
      });
    },
    // 报名列表
    sign() {
      api.courseSign(this.signData.page).then(res => {
        this.signData.tableData = res.data.data.list;
        this.signData.page.total = res.data.data.total;

        res.data.data.list.map((item, i) => {
          if (item.signDataList) {
            let model = {};
            item.signDataList.map((label, k) => {
              this.signData.propData.map((data, v) => {
                if (data.id === label.settingId) {
                  model[data.prop] = label.value;
                }
              });
            });
            this.signData.tableData[i] = Object.assign(
              this.signData.tableData[i],
              model
            );
          }
        });
        console.log("报名列表", this.signData.tableData);
      });
    },
    checkAuditSign(status) {
      let count = 0;
      this.signData.selectionList.map(item => {
        if (item.status !== 1) {
          count++;
        }
      });
      console.log("count", count);
      if (count !== 0) {
        this.$message.error("状态为待审核才可通过或拒绝审核，请重新选择");
      } else {
        this.auditSign(status);
      }
    },
    // 报名审核
    auditSign(status) {
      console.log(status);
      let params = [];
      this.signData.selectionList.map(item => {
        params.push({
          status: status,
          id: item.id,
          isAudit: item.isAudit,
          memberId: item.memberId || ""
        });
      });
      console.log("params", params);
      // return false
      api.auditSign(params).then(res => {
        this.$message({
          message: "修改成功",
          type: "success"
        });
        this.sign();
      });
    },
    // 评论列表
    activityComment() {
      api.listComment(this.commentData.page).then(res => {
        this.commentData.tableData = res.data.data.list;
        this.commentData.page.total = res.data.data.total;

        console.log("评论列表", this.commentData.tableData);
      });
    },
    handleRowClick(row) {
      this.commentData.row = row
      console.log('row == ', this.commentData.row)
    },
    auditComment() {
      api.auditComment({id: this.commentData.row.id}).then(res => {
        this.$message({
          message: "审核成功",
          type: "success"
        });
      })
    },
    refuseComment() {
      api.refuseComment({id: this.commentData.row.id}).then(res => {
        this.$message({
          message: "拒绝成功",
          type: "success"
        });
      })
    },
    deleteComment() {
      api.deleteComment({id: this.commentData.row.id}).then(res => {
        this.$message({
          message: "删除成功",
          type: "success"
        });
      })
    },
    copy(shareLink) {
      let oInput = document.createElement("input");
      oInput.value = shareLink;
      document.body.appendChild(oInput);
      oInput.select();
      document.execCommand("copy");
      oInput.style.display = "none";
      document.body.removeChild(oInput);
      this.$message({
        message: "复制成功",
        type: "success"
      });
    }
  }
};
</script>

<style lang="less">
.area-box {
  .top {
    height: 89px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #f3f3f3;
    width: 100%;
    .title {
      font-size: 22px;
      padding-left: 30px;
    }
    .desc {
      color: #686868;
      margin-top: 10px;
      padding-left: 30px;
      span {
        margin-right: 30px;
      }
    }
  }
  .content {
    padding: 20px;
    .active-title {
      background-color: rgb(252, 252, 252);
      padding: 10px;
      border: 1px solid #f3f3f3;
    }
    .time {
      background-color: rgb(252, 252, 252);
      padding: 10px;
      font-size: 15px;
    }
    .padding {
      padding: 10px 0;
    }
    .search-box {
      .el-form-item {
        margin-bottom: 0 !important;
      }
    }
    .select-btn {
      display: flex;
      justify-content: space-between;
      .left {
        display: inline-flex;
        align-items: center;
        p {
          margin-right: 20px;
          span {
            color: rgb(66, 149, 251);
            padding: 0 5px;
          }
        }
      }
    }
    .detail {
      .item {
        margin-bottom: 20px;

        .title {
          margin-bottom: 10px;
          padding-left: 10px;
          line-height: 1;
          position: relative;
          &:before {
            position: absolute;
            content: "";
            border-left: 3px solid #3091f2;
            left: 0;
            top: 0;
            bottom: 0;
          }
        }
        .context {
          p {
            line-height: 2;
            display: flex;
            span {
              margin-left: 10px;
              &:first-child {
                margin-left: 0;
                color: rgb(129, 129, 129);
                width: 90px;
                flex-shrink: 0;
                text-align: right;
              }
              img {
                width: 200px;
              }
            }
            .info {
              max-width: 630px;
            }
          }
        }
      }
      .content-box {
        .title {
          margin-left: 0;
          color: #818181;
          width: 90px;
          text-align: right;
          line-height: 2;
        }
        .detail-content {
          width: 700px;
          max-height: 700px;
          overflow: auto;
          border: 1px solid #ececec;
          padding: 10px;
        }
      }
    }
  }
}
.check-time {
  padding: 10px 0 20px 0;
  .act-table {
    border: 1px solid #dfe6ec;
    position: relative;
    .add {
      position: absolute;
      top: -35px;
      right: 0;
    }
    tr {
      &:first-child {
        background: #eef1f6;
      }
      th,
      td {
        padding: 7px 10px;
        text-align: center;
        white-space: nowrap;
      }
    }
  }
}
</style>
