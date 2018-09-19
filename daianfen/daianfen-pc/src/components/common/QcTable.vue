<template>
  <div class="qc-table" :style="{'height': `${autoHeight || tHeight}px`}" style="">
    <!-- @row-click="handleSelect" @selection-change="handleCheck"  -->
    <el-table v-loading="loading" element-loading-text="数据加载中" height="100%" style="overflow-y: auto;" :data="tableData" 
    highlight-current-row @row-click="vuexTableList" @cell-dblclick='DbTableList' :border="border" :stripe="stripe"
     @selection-change="vuexTableId">
     <!-- @cell-dblclick='DbTableList'  -->
      <!-- <el-table-column
        type="selection"
        width="55">
      </el-table-column> -->
      <!--基本的显示  -->
      <el-table-column v-for="(item,index) in tableList" :key="index" :align="item.align || 'center'" show-overflow-tooltip v-if="!item.template" :prop="item.prop" :label="item.label" :width="item.width">
      </el-table-column>
      <!--序号  -->
      <el-table-column align="center" v-else-if="item.template == 'index'" type="index" label="序号" width="65">
      </el-table-column>
      <!--排序  -->
      <el-table-column align="center" v-else-if="item.template == 'seqNum'" :label="item.label" width="65">
        <template slot-scope="scope">{{scope.row[item.prop]}}</template>
      </el-table-column>
      <!--checkbox  -->
      <el-table-column :align="item.align || 'center'" type="selection" v-else-if="item.template=='checkbox'" width="55">
      </el-table-column>
      <!--金钱  -->
      <el-table-column :align="item.align || 'center'" v-else-if="item.template == 'price'" :label="item.label" :width="item.width">
        <template slot-scope="scope">{{scope.row[item.prop] || 0 | price}}</template>
      </el-table-column>
      <!--布尔值  -->
      <el-table-column :align="item.align || 'center'" v-else-if="item.template == 'Boolean'" :label="item.label" :width="item.width">
        <template slot-scope="scope">{{scope.row[item.prop]?"是":"否"}}</template>
      </el-table-column>
      <!--性别  -->
      <el-table-column :align="item.align || 'center'" v-else-if="item.template == 'sex'" :label="item.label" :width="item.width" >
         <template slot-scope="scope">{{scope.row[item.prop] == 1?'男':'女'}}</template>
      </el-table-column>
      <!--是否启用  -->
      <el-table-column :align="item.align || 'center'" v-else-if="item.template == 'used'" :label="item.label" :width="item.width" inline-template>
        <div>{{row[item.prop] == 1?'是':'否'}}</div>
      </el-table-column>
      <!--图片  -->
      <el-table-column align="center" v-else-if="item.template == 'img'" :label="item.label" :width="140">
        <template slot-scope="scope">
          <img style="display:block;margin:5px auto" src="http://athena-1255600302.cosgz.myqcloud.com/attachments/qc-logo.png" width="60" height="60" v-if="scope.row[item.prop] ==undefined || scope.row[item.prop] === ''">
          <img style="display:block;margin:5px auto" :src="`${imgHost}${scope.row[item.prop]}`" width="60" height="60" v-else-if="item.isPrefix">
          <img style="display:block;margin:5px auto" :src="`${imgHost}${scope.row[item.prop]}`" width="100" height="100" v-else-if="item.isQR">
          <img style="display:block;margin:5px auto;border-radius:50%;" :src="`${scope.row[item.prop]}`" width="60" height="60" v-else-if="item.headImage">
          <img style="display:block;margin:5px auto" :src="scope.row[item.prop]" width="60" height="60" v-else>
        </template>
      </el-table-column>
      <el-table-column align="center" v-else-if="item.template == 'mark'" :label="item.label" :width="140">
        <template slot-scope="scope">
          <div @click="handleAdd(scope.row[item.prop])" class="btn" style="color:#b80223;">查看备注</div>
        </template>
      </el-table-column>
      <el-table-column align="left" fixed="right" v-else-if="item.template == 'jump'" :label="item.label" :width="140">
        <template slot-scope="scope">
          <div @click="jumpPage(scope.row[item.prop])" class="btn" style="color:#b80223;">{{item.title}}</div>
        </template>
      </el-table-column>
      
      <!-- 展开行 优惠券详情-->
      <el-table-column type="expand" v-else-if="item.template == 'couponContent' && item.expand" :label="item.label">
        <template slot-scope="scope">
          <p style="line-height:2;" v-html="couponContent(scope.row[item.prop])"></p>
          <!-- {{scope.row[item.prop] | couponContent(2)}} -->
        </template>
      </el-table-column>
      <!-- 优惠券标题 -->
      <el-table-column  v-else-if="item.template == 'couponContent'" :label="item.label">
        <template slot-scope="scope">
          <p style="line-height:2;">{{scope.row[item.prop] | couponContent(1)}}</p>
        </template>
      </el-table-column>
      <!-- 优惠券来源 -->
      <el-table-column  v-else-if="item.template == 'couponsBreed'" :label="item.label" :width="item.width">
        <template slot-scope="scope">
          <span>{{scope.row[item.prop] | couponsBreed}}</span>
        </template>
      </el-table-column>
      <!-- 导购状态 -->
      <el-table-column  v-else-if="item.template == 'guideState'" :label="item.label" :width="item.width">
        <template slot-scope="scope">
          <span>{{scope.row[item.prop] | guideState}}</span>
        </template>
      </el-table-column>
      <!--日期 -->
      <el-table-column :align="item.align || 'center'" v-else-if="item.template =='date'" :label="item.label" :width="item.width">
        <template slot-scope="scope">
          <div>
            {{scope.row[item.prop] | formatData}}
          </div>
        </template>
      </el-table-column>
      <!-- 时间范围 -->
      <el-table-column :align="item.align || 'center'" v-else-if="item.template =='timeLimit'" :label="item.label" :width="item.width" inline-template>
        <div>
          {{row.startTime | yearMoutn}}&nbsp;&nbsp;&nbsp;&nbsp;{{row.startTime | DateTime}}-{{row.endTime | DateTime}}
        </div>
      </el-table-column>
      <el-table-column :align="item.align || 'center'" v-else-if="item.template =='array'" :label="item.label" :width="item.width" inline-template>
        <div>
          <span v-for="(arrayList,index) in row[item.prop]" :key="index">{{arrayList}}
            <span v-if=" index+1 !=row[item.prop].length">；</span>
          </span>
        </div>
      </el-table-column>
      <!-- 预约状态  -->
      <el-table-column :align="item.align || 'center'" v-else-if="item.template == 'reserveState'" :label="item.label" :width="item.width">
        <template slot-scope="scope">{{scope.row[item.prop] | reserveState}}</template>
      </el-table-column>
      <el-table-column :align="item.align || 'center'" v-else-if="item.template =='audit'" :label="item.label" :width="item.width" >
        <template slot-scope="scope">{{scope.row[item.prop] | audit }}</template>
      </el-table-column>
      <el-table-column :align="item.align || 'center'" v-else-if="item.template =='auditStatus'" :label="item.label" :width="item.width" >
        <template slot-scope="scope">{{scope.row[item.prop] | auditStatus }}</template>
      </el-table-column>
      <el-table-column :align="item.align || 'center'" v-else-if="item.template =='payWay'" :label="item.label" :width="item.width" >
        <template slot-scope="scope">{{scope.row[item.prop] | payWay }}</template>
      </el-table-column>
      <el-table-column :align="item.align || 'center'" v-else-if="item.template =='couponStatus'" :label="item.label" :width="item.width" >
        <template slot-scope="scope">{{scope.row[item.prop] | couponStatus }}</template>
      </el-table-column>
      <el-table-column :align="item.align || 'center'" v-else-if="item.template =='payStatus'" :label="item.label" :width="item.width" >
        <template slot-scope="scope">{{scope.row[item.prop] | payStatus }}</template>
      </el-table-column>
      <el-table-column :align="item.align || 'center'" v-else-if="item.template =='merchant'" :label="item.label" :width="item.width" >
        <template slot-scope="scope">{{scope.row[item.prop] | merchant }}</template>
      </el-table-column>
      <el-table-column :align="item.align || 'center'" v-else-if="item.template =='tagType'" :label="item.label" :width="item.width" >
        <template slot-scope="scope">{{scope.row[item.prop] | tagType }}</template>
      </el-table-column>
      <el-table-column :align="item.align || 'center'" v-else-if="item.template =='ruleType'" :label="item.label" :width="item.width" >
        <template slot-scope="scope">{{scope.row[item.prop] | ruleType }}</template>
      </el-table-column>
      <el-table-column :align="item.align || 'center'" v-else-if="item.template =='disAudit'" :label="item.label" :width="item.width" >
        <template slot-scope="scope">{{scope.row[item.prop] | disAudit }}</template>
      </el-table-column>
      <el-table-column :align="item.align || 'center'" v-else-if="item.template =='checkWay'" :label="item.label" :width="item.width" >
        <template slot-scope="scope">{{scope.row[item.prop] | checkWay }}</template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.curPage" :page-sizes="[10, 20, 30]" :page-size="page.size" layout="total, sizes, prev, pager, next" :total="page.total">
      </el-pagination>
    </div>
    <el-dialog title="备注" :visible.sync="dialogTableVisible" append-to-body>
      <el-table :data="mark" border show-overflow-tooltip>
        <el-table-column property="createTime" label="时间" width="150"></el-table-column>
        <el-table-column property="employeeName" label="导购" width="120"></el-table-column>
        <el-table-column property="barSize" label="内衣尺寸" width="100"></el-table-column>
        <el-table-column property="pantySize" label="内裤尺寸" width="100"></el-table-column>
        <el-table-column property="remark" label="内容"></el-table-column>
      </el-table>
    </el-dialog>
    <!-- <dig-qrcode :visible="digQrcode" :imgUrl="row[item.prop]" @close="checkQrcode"></dig-qrcode> -->
  </div>
</template>

<script>
import apiCommon from "api/common";
import { mapMutations } from "vuex";
import qs from "qs";
export default {
  props: {
    tableList: Array,
    search: Object,
    url: String,
    delay: Boolean,
    height: Number,
    isDetail: Boolean,
    stripe: Boolean,
    border: Boolean,
    tongji: {
      type: Number,
      default: 0
    },
    autoHeight: Number,
    categoryType: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      imgURL: "",
      loading: false,
      dialogTableVisible: false,
      tableData: [],
      page: {
        total: 0,
        size: 20,
        curPage: 1
      },
      mark: [],
      digQrcode: false,
      tableRow: {},
      tHeight: 0
    };
  },
  created() {
    this.imgURL = process.env.IMG_URL;
  },
  mounted() {
    this.$nextTick(() => {
      this.getHeightTable();
      window.onresize = () => {
        this.getHeightTable();
      };
      this.getTableList();
    });
  },
  filters: {
    couponContent(val, type) {
      if(!val) return '';
      let regTitle = /.*\s/; // 匹配标题
      let regDetail = /\s[0-9].*/g; // 匹配详情
      if(type === 1) {
        return val.match(regTitle)[0];
      }else if(type === 2){
        val = val.replace(/；/g,'；\n');
        val = val.match(regDetail).join('');
        return val.replace(/；/g, '；<br>');
      }
    },
    // 优惠券来源
    couponsBreed(val) {
      if (!val) return val;
      switch (val) {
        case 1:
          return "CRM优惠券";
        case 2:
          return "系统优惠券";
      }
    },
    // 优惠券规则
    guideState(val) {
      if (!val) return val;
      switch (val) {
        case 1:
          return "在职";
        case 2:
          return "离职";
      }
    },
    formatData(val) {
      // 传入格式 年月日 时分秒
      if(!val) return val;
      if(val.length < 16) return val;
      return val.substr(0, 16)
    },
    // 业务员审核
    disAudit(val) {
      if (val === "") return "";
      switch (val) {
        case 1:
          return "待审核";
        case 2:
          return "已审核";
      }
    },
    // 订单审核状态
    audit(val) {
      if (val === "") return "";
      switch (val) {
        case 1:
          return "待审核";
        case 2:
          return "确认中";
        case 3:
          return "审核完毕";
        case 4:
          return "已拒绝";
      }
    },
    // 审核状态
    auditStatus(val) {
      if (val === "") return "";
      switch (val) {
        case 0:
          return "提交";
        case 1:
          return "审批通过";
        case 2:
          return "审批不通过";
      }
    },
    // 支付方式
    payWay(val) {
      if (val === "") return "";
      switch (val) {
        case "alipay":
          return "支付宝支付";
        case "cash":
          return "现金";
        case "pos":
          return "POS机";
        case "wechat":
          return "微信支付";
      }
    },
    //支付状态
    payStatus(val) {
      if (val === "") return "";
      switch (val) {
        case -1:
          return "支付失败";
        case 1:
          return "新建";
        case 2:
          return "进行中";
        case 3:
          return "交易成功";
      }
    },
    //预约状态
    reserveState(val) {
      if (val === "") return "";
      switch (val) {
        case 1:
          return "已预约";
        case 2:
          return "已到店";
        case 3:
          return "已取消";
      }
    },
    //优惠券领取状态
    couponStatus(val) {
      if (val === "") return "";
      switch (val) {
        case 1:
          return "未用";
        case 2:
          return "已用";
        case 3:
          return "已过期";
      }
    },
    // 商户状态
    merchant(val) {
      if (val === "") return "";
      switch (val) {
        case 0:
          return "新建";
        case 1:
          return "开业";
        case 2:
          return "歇业";
        case 3:
          return "结业";
      }
    },
    // 标签类型
    tagType(val) {
      if (val === "") return "";
      switch (val) {
        case 1:
          return "会员";
        case 2:
          return "商品";
        case 3:
          return "活动";
        case 4:
          return "课程";
        case 5:
          return "新闻";
        case 6:
          return "产品";
      }
    },
    // 规则类型
    ruleType(val) {
      if (val === "") return "";
      switch (val) {
        case 1:
          return "商城";
        case 2:
          return "活动";
        case 3:
          return "课程";
      }
    },
    // 签到方式
    checkWay(val) {
      if (val === "") return "";
      switch (val) {
        case 1:
          return "二维码";
        case 2:
          return "手机签到";
        case 3:
          return "暗号签到";
      }
    }
  },
  methods: {
    getHeightTable() {
      let search = document.querySelector(".search-wrap");
      let button = document.querySelector(".button-wrap");
      let tongji = document.querySelector(".tongji");
      this.tHeight = window.innerHeight - 120 - 52;
      if (search) this.tHeight = this.tHeight - search.offsetHeight;
      if (button) this.tHeight = this.tHeight - button.offsetHeight;
      if (tongji) this.tHeight = this.tHeight - tongji.offsetHeight;
      if (this.isDetail) this.tHeight = this.tHeight - 50;
    },
    couponContent(val) {
      // 优惠券详情
      let regDetail = /\s[0-9].*/g; // 匹配详情
      val = val.replace(/；/g,'；\n');
      val = val.match(regDetail).join('');
      return val.replace(/；/g, '；<br>');
    },
    // 表单请求接口地址
    apiTable(url, search) {
      this.loading = true;
      var data = {};
      data = Object.assign(data, search);

      this.$http.get(url, data)
        .then(res => {
          this.tableData = res.data.content0.rows;
          console.log("数据", this.tableData);
          this.page.total = res.data.content0.total;
          this.loading = !true;
        })
        .catch(err => {
          this.loading = !true;
          console.log("表格接口调用失败", err);
          // this.$router.replace("/login");
        });
    },
    // 查询表格数据
    getTableList() {
      this.page = Object.assign(this.search, this.page);
      if (!this.categoryType) this.apiTable(this.url, this.page);
    },
    // 搜索表格数据
    searchTableList() {
      this.setTableList({});
      this.page = Object.assign(this.search, this.page);
      this.page.curPage = 1;
      this.apiTable(this.url, this.page);
    },
    searchTableListKeep() {
      this.setTableList({});
      this.page = Object.assign(this.search, this.page);
      this.apiTable(this.url, this.page);
    },
    // 分页
    handleSizeChange(val) {
      document.getElementsByClassName(
        "el-table__body-wrapper"
      )[0].scrollTop = 0;
      this.page.size = val;
      this.page.curPage = 1;
      this.getTableList();
    },
    handleCurrentChange(val) {
      document.getElementsByClassName(
        "el-table__body-wrapper"
      )[0].scrollTop = 0;
      this.page.curPage = val;
      this.getTableList();
    },
    // 每行选中 提交到vuex 管理
    vuexTableList(row) {
      this.setTableList(row);
    },
    //双击行
    DbTableList(row) {
      this.$emit("DbTableList", row);
    },
    // 每行选中id 提交到vuex 管理
    vuexTableId(row) {
      let arr = "";
      row.forEach(item => {
        arr += "_" + item.id;
      });
      this.setTableId(arr.substr(1));
    },
    // vuex
    ...mapMutations({
      setTableList: "TABLELIST",
      setTableId: "TABLEID"
    }),
    // 跳转
    jumpPage(id) {
      this.$router.push(`/main/shop/table?shopId=${id}`)
    },
    handleAdd(id) {
      this.dialogTableVisible = true;
      this.$http.get('/reservation/remark', {reservationId: id})
      .then(res => {
        console.log(res.data.content0)
        this.mark = []
        this.mark.push(res.data.content0)
        if(this.mark[0].createTime) this.mark[0].createTime = this.mark[0].createTime.substr(0,16);
      })
    }
  },
  destroyed() {
    this.setTableList({});
  }
};
</script>

<style lang="less">
@import url("../../assets/styles/wawa.less");
.img {
  width: 200px;
  img {
    width: 100%;
  }
}
.btn:hover{
  cursor: pointer;
}
.qc_table_success {
  color: #35cd02;
  vertical-align: middle;
  &::before {
    content: "";
    .dot(#35cd02,5px,5px);
  }
}
.qc_table_error {
  color: #fd0a01;
  vertical-align: middle;
  &::before {
    content: "";
    .dot(#fd0a01,5px,5px);
  }
}
.block {
  margin-bottom: 0;
}
</style>
