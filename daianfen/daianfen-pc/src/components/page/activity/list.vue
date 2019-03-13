<template>
  <div class="wrap" ref="wrap">
    <div ref="search">
      <button-wrap>
        <el-button type="primary" size="small" @click="insert()">新建</el-button>
        <el-button type="warning" size="small" :disabled="tableList.id == null" @click="update()">修改</el-button>
        <el-button type="danger" size="small" :disabled="tableList.id == null" @click="deleteConfirm()">删除</el-button>
      </button-wrap>
    </div>
    <qc-table ref="table" :height="domHeight" :table-list="showData" :search="searchData" url="/couponsRule/list"></qc-table>

    <el-dialog :title="updateId?'修改':'新建'" v-if="dialogFormVisible" :visible.sync="dialogFormVisible" v-loading="detailLoading" width="600px" append-to-body @close="digClose()">
      <el-form class="form" :model="model" ref="model" :rules="rules" label-width="120px" style="width:500px;margin:0 auto;">
        <el-form-item label="标题" prop="title">
          <el-input v-model="model.title" size="small"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="ruleType">
          <el-select v-model="model.ruleType" size="small" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="来源" prop="couponsBreed">
          <el-select v-model="model.couponsBreed" size="small" placeholder="请选择">
            <el-option v-for="item in optionSource" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规则" v-if="model.couponsBreed == 2" prop="makeCouponsId" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-select v-model="model.makeCouponsId" size="small" placeholder="请选择">
            <el-option v-for="item in ruleList" :key="item.id" :label="item.title" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="起始编号" v-if="model.couponsBreed == 1" prop="startNo" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-input v-model="model.startNo" size="small" style="width:210px;"></el-input>
        </el-form-item>
        <el-form-item label="投放范围" prop="sendScope">
          <el-select v-model="model.sendScope" size="small" placeholder="请选择">
            <el-option v-for="item in optionScope" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="model.sendScope == 'by_shop'" label="投放专柜" prop="shopId" :rules="[{ required: true, message: '该字段不能为空'}]">
          <div style="max-height: 80px; overflow-y: auto;line-height: 2.1;">
            <el-tag :key="tag.id || tag.shopId" v-for="tag in shopTags" size="mini" closable :disable-transitions="false" @close="delTag('shop', tag)">
              {{tag.shopName}}
            </el-tag>
          </div>
          <el-button class="button-new-tag" size="mini" @click="onshowShop">添加专柜</el-button>
        </el-form-item>
        <el-form-item v-if="model.sendScope == 'by_city'" label="投放城市" prop="city" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-select v-model="cityTags" multiple filterable closable placeholder="请选择，可搜索">
            <el-option v-for="item in cityList" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="有效期天数" prop="validDate">
          <el-input v-model="model.validDate" size="small" placeholder="请输入数值" style="width:210px;"></el-input>
        </el-form-item>
        <el-form-item label="赠送数量" prop="sendCount">
          <el-input-number v-model="model.sendCount" size="small" :min="1" style="margin: 5px 0;margin-left:3px;width:210px;"></el-input-number>
        </el-form-item>
        <el-form-item label="开始时间" prop="startDate">
          <el-date-picker size="small" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm" v-model="model.startDate" type="datetime" placeholder="开始时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endDate">
          <el-date-picker size="small" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm" v-model="model.endDate" type="datetime" placeholder="结束时间"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="digClose()">取 消</el-button>
        <el-button size="small" type="primary" @click="submit()">确 定</el-button>
      </div>
    </el-dialog>
    <dig-shop :visible="digShop" a="1" :shop-tags="shopTags" @submit="shopSubmit" @close="onHideShop"></dig-shop>
  </div>
</template>

<script>
import { tableMixin } from "../../../assets/js/tableMixin";
// import SearchWrap from "../../common/SearchWrap";
import ButtonWrap from "../../common/ButtonWrap";
import DigShop from "./digShop.vue";
export default {
  mixins: [tableMixin],
  components: { ButtonWrap, DigShop },
  data() {
    return {
      updateId: "",
      detailLoading: false,
      dialogFormVisible: false,
      digShop: false,
      digCity: false,
      shopTags: [],
      cityTags: [],
      cityList: [],
      model: {
        title: "",
        startDate: "",
        endDate: "",
        startNo: "",
        sendCount: 1,
        ruleType: 1,
        couponsBreed: 1,
        makeCouponsId: "",
        sendScope: "limitless",
        shopId: "",
        city: ""
      },
      searchData: {},
      options: [
        { label: "预约", value: 1, disabled: false },
        { label: "注册", value: 2, disabled: false }
      ],
      optionSource: [
        { label: "CRM优惠券", value: 1, disabled: false },
        { label: "系统优惠券", value: 2, disabled: false }
      ],
      optionScope: [
        { label: "无限制", value: "limitless", disabled: false },
        { label: "专柜", value: "by_shop", disabled: false },
        { label: "城市", value: "by_city", disabled: false }
      ],
      ruleList: [],
      showData: [
        { prop: "title", label: "标题" },
        { prop: "startNo", label: "起始编号" },
        { prop: "startDate", label: "开始时间", template: "date" },
        { prop: "endDate", label: "结束时间", template: "date" }
      ],
      rules: {
        title: [{ required: true, message: "字段不能为空", trigger: "blur" }],
        ruleType: [
          { required: true, message: "字段不能为空", trigger: "blur" }
        ],
        couponsBreed: [
          { required: true, message: "字段不能为空", trigger: "blur" }
        ],
        validDate: [
          { required: true, message: "字段不能为空", trigger: "blur" }
        ],
        sendScope: [
          { required: true, message: "字段不能为空", trigger: "blur" }
        ],
        sendCount: [
          { required: true, message: "字段不能为空", trigger: "blur" }
        ],
        startDate: [
          { required: true, message: "字段不能为空", trigger: "blur" }
        ],
        endDate: [{ required: true, message: "字段不能为空", trigger: "blur" }]
      }
    };
  },
  watch: {
    "model.couponsBreed"(val) {
      if (val != 1) this.model.startNo = "";
      if (val != 2) this.model.makeCouponsId = "";
    },
    "model.sendScope"(val) {
      if (val != "by_shop") {
        this.model.shopId = "";
        this.shopTags = [];
      }
      if (val != "by_city") {
        this.model.city = "";
        this.cityTags = [];
      }
    },
    dialogFormVisible(val) {
      if (!val) {
        this.shopTags = [];
        this.cityTags = [];
      }
    },
    shopTags(val) {
      if (val) {
        let arr = "";
        this.shopTags.forEach(item => {
          arr += "|" + (item.id || item.shopId);
        });
        this.model.shopId = arr.substr(1);
      }
    },
    cityTags(val) {
      if (val) {
        let arr = "";
        this.cityTags.forEach(item => {
          arr += "|" + item;
        });
        this.model.city = arr.substr(1);
      }

    }
  },
  created() {
    this.apiGetRuleList();
  },
  mounted() {
    this.apiGetCityList();
  },
  methods: {
    onshowShop() {
      this.digShop = true;
    },
    onHideShop() {
      this.digShop = false;
    },
    onshowCity() {
      this.digCity = true;
    },
    onHideCity() {
      this.digCity = false;
    },
    delTag(type, item) {
      if (type == "shop") {
        this.shopTags.splice(this.shopTags.indexOf(item), 1);
      } else if (type == "city") {
        this.cityTags.splice(this.cityTags.indexOf(item), 1);
      }
    },
    shopSubmit(data) {
      // 去重
      // for (let i = 0; i < data.length; i++) {
      //   if (this.shopTags.indexOf(data[i]) == -1) this.shopTags.push(data[i]);
      // }
      var _arr = new Array();
      for (let i = 0; i < this.shopTags.length; i++) {
        _arr.push(this.shopTags[i]);
      }
      for (let i = 0; i < data.length; i++) {
        let flag = true;
        for (let j = 0; j < this.shopTags.length; j++) {
          if (data[i].id == (this.shopTags[j].id || this.shopTags[j].shopId)) {
            flag = false;
            break;
          }
        }
        if (flag) {
          _arr.push(data[i]);
        }
      }
      this.shopTags = _arr;
    },

    getDetail() {
      this.$http
        .get("/couponsRule/get", { id: this.tableList.id })
        .then(res => {
          this.detailLoading = false;
          this.model = res.data.content0;
          if (this.model.cityScopeList) {
            this.cityTags = this.model.cityScopeList;
            return false;
            for (let i = 0; i < this.model.cityScopeList.length; i++) {
              this.cityTags.push(this.model.cityScopeList[i].city);
            }
          }
          if (this.model.shopScopeList) {
            this.shopTags = this.model.shopScopeList;
            return false;
            for (let i = 0; i < this.model.shopScopeList.length; i++) {
              this.shopTags.push(this.model.shopScopeList[i]);
            }
          }
        })
        .catch(err => {
          this.detailLoading = false;
        });
    },
    apiGetRuleList() {
      this.$http.get("/makeCoupons/list").then(res => {
        this.ruleList = res.data.content0.rows;
      });
    },
    apiGetCityList(keyword) {
      this.$http
        .get("/shop/getCityList", { pageNum: 1, pageSize: 50, name: keyword })
        .then(res => {
          this.cityList = res.data.content0.rows;
        });
    },
    apiAddData(data) {
      // data.startDate += ':00';
      // data.endDate += ':00';
      this.$http.post("/coupons_rule/insert", data).then(res => {
        this.$message.success("保存成功");
        this.digClose();
        this.searchKeep();
      });
    },
    updateData(data) {
      // data.startDate += ':00';
      // data.endDate += ':00';
      this.$http.post("/coupons_rule/update", data).then(res => {
        this.$message.success("保存成功");
        this.digClose();
        this.searchKeep();
      });
    },
    deleteConfirm() {
      this.$confirm(`此操作将删除 ${this.tableList.title} 是否继续？`, "提示", {
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
      this.$http
        .post("/couponsRule/delete", { id: this.tableList.id })
        .then(res => {
          this.searchKeep();
          this.$message.success("删除成功");
        });
    },
    search() {
      this.searchKeep();
    },
    insert() {
      this.dialogFormVisible = true;
    },
    update() {
      this.updateId = this.tableList.id;
      this.dialogFormVisible = true;
      this.detailLoading = true;
      this.getDetail();
      // this.model = JSON.parse(JSON.stringify(this.tableList));
    },
    digClose(flag) {
      this.updateId = "";
      this.dialogFormVisible = false;
      this.model = {
        title: "",
        startDate: "",
        endDate: "",
        startNo: "",
        sendCount: 1,
        ruleType: 1,
        couponsBreed: 1,
        makeCouponsId: "",
        sendScope: "limitless",
        shopId: "",
        city: ""
      };
    },
    // 提交
    submit() {
      this.$refs.model.validate(valid => {
        if (valid) {
          delete this.model.createTime;
          delete this.model.updateTime;
          delete this.model.remainQty;
          delete this.model.sendQty;
          delete this.model.totalQty;
          delete this.model.state;
          delete this.model.cityScopeList;
          delete this.model.shopScopeList;
          if (this.updateId) {
            this.updateData(this.model);
          } else {
            this.apiAddData(this.model);
          }
        } else {
          this.$message.warning("请完善数据");
          this.loading = false;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.form {
  /deep/.el-tag {
    margin-right: 8px;
  }
}

.button-new-tag {
  margin-right: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
