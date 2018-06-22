<template>
  <div class="wrap" ref="wrap" v-loading="dataLoading">
    <div class="tabbar">
      <div class="item" :class="{'active': i + 1 === activeIndex}" v-for="(item, i) in tabbar" :key="i" @click="handleSelect(item.index)">
        {{item.name}}
      </div>
      <el-button type="primary" size="mini" class="back" @click="back">返回</el-button>
    </div>
    <div class="area-box" :style="{'height': `${areaHeight}px`}" ref="context">
      <div v-show="activeIndex === 1">
        <el-form :model="model" ref="model" label-position="top" size="small">
          <!-- <el-form-item label="规则类型" prop="ruleType" :rules="[{ required: true, message: '该字段不能为空'}]">
            <el-select v-model="model.ruleType" size="small">
              <el-option :label="item.name" :value="item.id" v-for="(item, i) in brandList" :key="i"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="规则名称" prop="ruleName" :rules="[{ required: true, message: '该字段不能为空'}]">
            <el-input size="small" v-model="model.ruleName" style="width:400px;"></el-input>
          </el-form-item>
          <el-form-item label="规则描述" prop="ruleDescription" :rules="[{ required: true, message: '该字段不能为空'}]">
            <el-input size="small" v-model="model.ruleDescription" style="width:400px;"></el-input>
          </el-form-item>
          <el-form-item label="规则时间" prop="ruleStartTime" :rules="[{ required: true, message: '该字段不能为空'}]">
            <el-date-picker
              :editable="false"
              v-model="datetime.ruleTime"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="发券总数，0表示无限" prop="totalQuantity" :rules="[{ required: true, message: '该字段不能为空'}]">
            <el-input-number size="small" v-model="model.totalQuantity"></el-input-number>
          </el-form-item>
          <el-form-item label="每日发券数量，0表示无限" prop="quantityPerDay" :rules="[{ required: true, message: '该字段不能为空'}]">
            <el-input-number size="small" v-model="model.quantityPerDay"></el-input-number>
          </el-form-item>
          <el-form-item label="单个会员领券总量，0表示无限" prop="memberReceiveQuantity" :rules="[{ required: true, message: '该字段不能为空'}]">
            <el-input-number size="small" v-model="model.memberReceiveQuantity"></el-input-number>
          </el-form-item>
          <el-form-item label="单个会员每天领券数量，0表示无限" prop="memberReceiveQuantityPerDay" :rules="[{ required: true, message: '该字段不能为空'}]">
            <el-input-number size="small" v-model="model.memberReceiveQuantityPerDay"></el-input-number>
          </el-form-item>
          <el-form-item label="规则内容" prop="content" :rules="[{ required: true, message: '该字段不能为空'}]">
            <editor :content="model.content" @get-content="getContent"></editor>
          </el-form-item>
        </el-form>
      </div>
      <div v-show="activeIndex === 2">
        <el-form :model="model" ref="model" label-position="top" size="small">
          <el-form-item label="优惠券标题" prop="couponTitle" :rules="[{ required: true, message: '该字段不能为空'}]">
            <el-input size="small" v-model="model.couponTitle" style="width:400px;"></el-input>
          </el-form-item>
          <el-form-item label="优惠券描述" prop="couponDescription" :rules="[{ required: true, message: '该字段不能为空'}]">
            <el-input size="small" v-model="model.couponDescription" style="width:400px;"></el-input>
          </el-form-item>
          <el-form-item label="优惠券图标" prop="couponIcon" :rules="[{ required: true, message: '该字段不能为空'}]">
            <div class="upload-img-box" @click="openImgBox('radio')">
              <img v-if="model.couponIcon" :src="`${imgHost}/${model.couponIcon}`" style="width: 120px;">
              <i v-else class="el-icon-plus upload-icon"></i>
            </div>
          </el-form-item>
          <el-form-item label="优惠券类型" prop="couponType" :rules="[{ required: true, message: '该字段不能为空'}]">
            <el-select v-model="model.couponType" size="small">
              <el-option label="抵扣券" value="1"></el-option>
              <el-option label="折扣券" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="优惠券抵扣金额或折扣百分比" prop="couponAmount" :rules="[{ required: true, message: '该字段不能为空'}]">
            <el-input-number size="small" v-model="model.couponAmount"></el-input-number>
          </el-form-item>
          <el-form-item label="订单金额，订单达到金额才能用券" prop="couponOrderAmount" :rules="[{ required: true, message: '该字段不能为空'}]">
            <el-input-number size="small" v-model="model.couponOrderAmount"></el-input-number>
          </el-form-item>
          
          <el-form-item label="优惠券有效期类型" prop="couponValidDaysType" :rules="[{ required: true, message: '该字段不能为空'}]">
            <el-select v-model="model.couponValidDaysType" size="small">
              <el-option label="指定时间段" :value="1"></el-option>
              <el-option label="指定天数" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="model.couponValidDaysType === 1" label="优惠券起效日期范围" prop="couponValidTime" :rules="[{ required: true, message: '该字段不能为空'}]">
            <el-date-picker
              :editable="false"
              v-model="datetime.couponTime"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="起效日期"
              end-placeholder="失效日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item v-if="model.couponValidDaysType === 2" label="有效天数" prop="couponValidDays" :rules="[{ required: true, message: '该字段不能为空'}]">
            <el-input-number size="small" v-model="model.couponValidDays"></el-input-number>
          </el-form-item>
          <el-form-item label="优惠券作用范围" prop="couponScope" :rules="[{ required: true, message: '该字段不能为空'}]">
            <el-select v-model="model.couponScope" size="small">
              <el-option label="指定活动分类" :value="303"></el-option>
              <el-option label="指定活动" :value="304"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-show="model.couponScope === 303" label="指定活动分类" prop="referenceIdList" :rules="[{ required: true, message: '该字段不能为空'}]" class="inline">
            <el-select v-model="model.referenceIdList" size="small" multiple style="width: 400px;">
              <el-option :label="item.name" :value="item.id" v-for="(item, i) in category" :key="i"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-show="model.couponScope === 304" label="指定活动" prop="referenceIdList" :rules="[{ required: true, message: '该字段不能为空'}]" class="inline">
            <el-select v-model="model.referenceIdList" size="small" multiple style="width: 400px;">
              <el-option :label="item.title" :value="item.id" v-for="(item, i) in activity" :key="i"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="bottom-btn">
      <el-button type="primary" size="small" @click="submit" :loading="loading">确定</el-button>
    </div>
    
    <image-dialog :visible="digImgWrap" :uploadType="uploadType" imageType='product' @close-imgbox="closeImgbox" @get-imgsrc="onGetImgsrc"></image-dialog>
  </div>
</template>

<script>
import QcHeader from "../../common/QcHeader";
import editor from "../../common/editor";
import api from "api/common";
import { tableMixin } from "../../../assets/js/tableMixin";
import ImageDialog from "../../common/ImageDialog";

export default {
  mixins: [tableMixin],
  components: {
    QcHeader,
    ImageDialog,
    editor
  },
  data() {
    return {
      config: {
        initialFrameWidth: 800,
        initialFrameHeight: 500
      },
      digImgWrap: false,
      tabbar: [
        { index: 1, name: "规则设置" },
        { index: 2, name: "优惠券设置" }
      ],
      activeIndex: 1,
      datetime: {
        ruleTime: "",
        couponTime: ""
      },
      model: {
        ruleName: "",
        ruleType: 2,
        ruleDescription: "",
        ruleStartTime: "",
        ruleEndTime: "",
        totalQuantity: 1,
        quantityPerDay: 1,
        memberReceiveQuantity: 1,
        memberReceiveQuantityPerDay: 1,
        content: "",
        couponAmount: "",
        couponOrderAmount: "",
        couponDescription: "",
        couponIcon: "",
        couponTitle: "",
        couponScope: "",
        couponType: "",
        couponValidDaysType: "",
        couponValidTime: "",
        couponValidDays: "",
        referenceIdList: []
      },
      goodsBrandList: [
        { id: "1", title: "品牌一" },
        { id: "2", title: "品牌二" },
        { id: "3", title: "品牌三" },
        { id: "4", title: "品牌四" }
      ],
      imgList: [],
      uploadType: "radio",
      areaHeight: 0,
      brandList: [],
      activity: [],
      category: [],
      loading: false,
      dataLoading: false
    };
  },
  created() {
    this.listCategory();
    this.listActivity();
    if (this.$route.query.id) {
      this.dataLoading = true;
      this.getCouponRule(this.$route.query.id);
    }
  },
  mounted() {
    this.getHeights();
    window.onresize = () => {
      this.getHeights();
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    // 设置高度
    getHeights() {
      this.areaHeight = window.innerHeight - 120 - 154;
    },
    // 切换
    handleSelect(index) {
      if (index === this.activeIndex) return;
      this.activeIndex = index;
      this.$refs.context.scrollTop = 0;
    },
    // 打开图片对话框
    openImgBox(type) {
      this.uploadType = type;
      this.digImgWrap = true;
    },
    // 关闭图片对话框
    closeImgbox(state) {
      this.digImgWrap = false;
    },
    // 单张图片
    onGetImgsrc(val) {
      this.model.couponIcon = val;
    },
    getContent(content) {
      this.model.content = content;
    },
    getCouponRule(id) {
      api.getCouponRule({id: id}).then(res => {
        console.log('getCouponRule == ', res.data)
        // let model = res.data.data
        this.model = res.data.data
        this.datetime.ruleTime = [
          this.model.ruleStartTime,
          this.model.ruleEndTime
        ]
        if (this.model.couponValidTime) {
          this.datetime.couponTime = [
            this.model.couponValidTime,
            this.model.couponExpireTime
          ]
        }
        this.dataLoading = false;
      })
    },
    listCategory() {
      api
        .listCategory({ parentId: "40914b72bc094ae18646f607e1cbb2fd" })
        .then(res => {
          this.category = res.data.data.list;
          console.log('category === ', this.category)
        });
    },
    listActivity() {
      api
        .listActivity({
          pageSize: 200,
          pageNum: 1
        })
        .then(res => {
          console.log("listActivity", res.data);
          this.activity = res.data.data.list
        });
    },
    couponRuleType() {
      api.couponRuleType({ couponRuleType: 2 }).then(res => {
        console.log("couponRuleType", res.data);
      });
    },

    // 提交
    submit() {
      let model = JSON.parse(JSON.stringify(this.model))
      let referenceIdList = ''
      model.referenceIdList.map(item => {
        referenceIdList += item + ','
      })
      model.referenceIdList = referenceIdList
      console.log('model === ', model)
      // return false
      this.loading = true
      if (this.$route.query.id) this.updateCouponRule(model);
      else this.addCouponRule(model);
    },
    // 添加
    addCouponRule(model) {
      api.addCouponRule(model).then(res => {
        this.loading = false
        this.$message({
          message: "添加成功",
          type: "success"
        });
        this.$router.go(-1);
      }).catch(err => {
        this.loading = false
      })
    },
    // 更新
    updateCouponRule(model) {
      api.updateCouponRule(model).then(res => {
        this.loading = false
        this.$message({
          message: "更新成功",
          type: "success"
        });
        this.$router.go(-1);
      }).catch(err => {
        this.loading = false
      })
    }
  },
  watch: {
    "datetime.ruleTime"(val) {
      this.model.ruleStartTime = val[0];
      this.model.ruleEndTime = val[1];
    },
    "datetime.couponTime"(val) {
      this.model.couponValidTime = val[0];
      this.model.couponExpireTime = val[1];
    },
    'model.couponScope'(nVal, oVal) {
      console.log(nVal, oVal)
      if (oVal) {
        this.model.referenceIdList = []
      }
    }
  }
};
</script>

<style lang="less" scoped>
.tabbar {
  display: flex;
  border-bottom: 1px solid #e7eaec;
  position: relative;
  .back {
    position: absolute;
    right: 10px;
    top: 13px;
  }
  .item {
    padding: 15px 30px;
    color: #bfbfbf;
    cursor: pointer;
    span {
      font-size: 22px;
    }
  }
  .active {
    background-color: #3091f2;
    color: #fff;
  }
}

.area-box {
  padding: 20px;
  overflow: auto;
}
.upload-img-box {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 6px;
  border: 1px dashed #d9d9d9;
  overflow: hidden;
  cursor: pointer;
  &:hover {
    border-color: #409eff;
  }
  .upload-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
}

.bottom-btn {
  text-align: center;
  height: 60px;
  line-height: 60px;
  border-top: 1px solid #e7eaec;
}
</style>
