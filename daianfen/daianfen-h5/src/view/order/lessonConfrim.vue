<template>
  <div class="want-sign">
    <div class="top white">
      <div class="img">
        <img v-show="model.iconUrl" :src="`${imgCut}${model.iconUrl}${cutParam1}`" alt="">
      </div>
      <div class="info">
        <p class="title">{{model.title}}</p>
        <div class="time-price">
          <p class="time">
            <span style="color:#000;">学制：</span>
            {{model.educationalSystem}}
          </p>
          <p class="price" v-if="model.price">
            <span>￥</span>
            {{model.price}}
          </p>
          <p class="price" v-else>免费</p>
        </div>
      </div>
    </div>
    <div class="number" v-if="model.activitySignSetting && model.activitySignSetting.singleNum < 1">
      <span>数量</span>
      <inline-x-number width="50px" v-model="sign.num" :min="1" :max="model.activitySignSetting.singleNum" ></inline-x-number>
    </div>
    <!-- <div class="discount">
      <group gutter="0">
        <cell title="选择优惠券" is-link></cell>
        <cell>
          <p slot="title">
            <span class="title">试听券</span>
            <span class="condition"> -￥50</span>
            <span class="condition">[50元试听券]</span>
          </p>
        </cell>
      </group>
    </div> -->
    <div class="sign-up white">
      <p class="title vux-1px-b">填写参加人信息</p>
      <div class="input-box">
        <!-- 1:文本,2:单选,3:多选,4:时间选择,5:图片，6音乐 ；7。文件 -->
        <label class="item" v-for="(item, i) in signDataList" v-if="item.type == 1" :key="i">
          <!-- <i class="iconfont icon-wode1"></i> -->
          <input v-model="item.value" type="text" :placeholder="`${item.name}${item.isRequired?'（必填）':''}`">
        </label>
        <group v-else-if="item.type == 2">
          <popup-radio :title="item.name" :options="item.options" v-model="item.value" placeholder="请选择"></popup-radio>
        </group>
        <group :title="item.name" v-else-if="item.type == 3" >
           <checklist label-position="left" :options="item.options" v-model="item.value"></checklist>
        </group>
        <!-- <input type="file" accept> -->
      </div>
    </div>
    <div class="btn-pay" @click="save()" v-if="model.isEnableFee && !model.activitySignSetting.isEnableAudit">
      <div class="price">总计 <span>{{this.sign.price * sign.num}}</span></div>
      <div class="pay">微信支付</div>
    </div>
    <div class="btn" @click="save()" v-else>
      确定
    </div>
  </div>
</template>

<script>
import { Group, Cell, InlineXNumber, Radio, Checklist, PopupRadio } from "vux";

export default {
  components: {
    Group,
    Cell,
    InlineXNumber,
    Radio,
    Checklist,
    PopupRadio
  },
  data() {
    return {
      sign: {
        sourceId: "",
        sourceType: "",
        shareCode: "",
        shareMemberId: "",
        price: 0,
        num: 1
      },
      signDataList: [],
      model: {}
    };
  },
  created() {
    this.apiGetActiveOne(this.$route.query.id);
  },
  computed: {
    userInfo() {
      return this.$store.state.user;
    }
  },
  methods: {
    apiGetActiveOne(id) {
      this.$http.get("/course/get", { id }).then(res => {
        this.model = res.data.data;
        try {
          this.sign.sourceId = this.model.id;
          this.sign.price = this.model.price;
        } catch (error) {
          // this.sign.price = 0;
          console.error("表示价格转化失败了");
        }
        // 格式化表单数据
        this.signDataList = this.model.signDataSettingList.map(res => {
          res.value = "";
          res.settingId = res.id;
          if (res.fieldName == "name") {
            res.value = this.userInfo.name;
          }
          if (res.fieldName == "mobile") {
            res.value = this.userInfo.mobile;
          }
          if (res.fieldName == "company") {
            res.value = this.userInfo.company;
          }
          if (res.fieldName == "position") {
            res.value = this.userInfo.position;
          }
          if (res.options) {
            res.options = res.options.split("_");
          }
          if (res.type == 3) {
            res.value = [];
          }
          return res;
        });
      });
      // 判断类型操作
    },
    apiSaveOrder(query) {
      query.sign.sourceId = query.id;
      this.$vux.loading.show({ text: "正在提交" });
      this.$http.json("/courseSignTemp/sign", query)
        .then(res => {
          // if (this.model.activitySignSetting.isEnableAudit) {
          //   // 开启审核后
          //   this.jumpPage("/order/success?type=1");
          // } else if (this.model.isEnableFee) {
          //   // 要给钱
          //   this.apiPayOrder(res.data.message);
          // } else {
            // 完美无暇
            this.jumpPage("/order/lessonSuccess?type=0");
          // }
        })
        .catch(err => {
          this.toast(err.data.message);
        })
        .finally(() => {
          this.$vux.loading.hide()
        });
    },
    apiPayOrder(orderId, orderType = 2) {
      this.$http.post("/pay", { orderId, orderType, payReturnUrl:`${this.$ROOTURL}/mobile/#/order/success?type=0` }).then(res => {
        location.href = `${this.$ROOTURL}/pay.html?token=${res.data.data.id}`
      });
    },
    save() {
      // 撸两个新的空间
      let sign = JSON.parse(JSON.stringify(this.sign));
      sign.price *= 100;
      let signDataList = JSON.parse(JSON.stringify(this.signDataList));
      // 验证一下数据
      for (let i = 0; i < signDataList.length; i++) {
        if (
          signDataList[i].fieldName == "mobile" &&
          !/^1[0-9]{10}$/.test(signDataList[i].value)
        ) {
          this.$vux.toast.text("手机格式不正确");
          return;
        }
        if (signDataList[i].isRequired && signDataList[i].value == "") {
          this.$vux.toast.text(`请填写${signDataList[i].name}`);
          return;
        }
        if ( signDataList[i].type == 3 && typeof signDataList[i].value != "sting" ) {
          signDataList[i].value = signDataList[i].value.join("_");
        }
      }
      this.apiSaveOrder({ ...this.$route.query, sign, signDataList });
    },
    jumpPage(url) {
      this.$router.push(url);
    }
  }
};
</script>

<style lang="less">
.want-sign {
  margin-bottom: 14vw;
  .top {
    display: flex;
    padding: 3vw 4vw;
    .img {
      width: 28vw;
      height: 20vw;
      border-radius: 2vw;
      overflow: hidden;
      flex-shrink: 0;
      margin-right: 3vw;
      position: relative;
      img {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .info {
      flex: 1;
      .title {
        font-size: 3.8vw;
      }
      .time-price {
        margin-top: 5vw;
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        line-height: 1;
        .time {
          font-size: 3.4vw;
          color: @gray-color;
          span {
            color: @yellow-color;
          }
        }
        .price {
          font-size: 3.8vw;
          color: @red-color;
          span {
            font-size: 3vw;
            margin-right: -1vw;
          }
        }
      }
    }
  }
  .number {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    background: #fff;
    border-top: 1px solid #f2f2f2;
  }
  .discount {
    margin-top: 3vw;
    .title {
      border: 1px solid #bf9f56;
      font-size: 3.5vw;
      padding: 0.5vw 1vw;
      color: #bf9f56;
    }
    .condition {
      color: #5d6266;
    }
  }
  .sign-up {
    margin-top: 3vw;
    .title {
      padding: 3vw 0;
      margin-left: 4vw;
    }
    .input-box {
      padding: 4vw;
      .item {
        padding: 0 3vw;
        margin-bottom: 3.8vw;
        height: 10vw;
        display: block;
        line-height: 10vw;
        background-color: rgb(247, 247, 247);
        i {
          font-size: 4.5vw;
          margin-right: 2vw;
          color: @red-color;
        }
        input {
          outline: none;
          border: 0;
          background-color: rgb(247, 247, 247);
          font-size: 3.8vw;
          width: 100%;
        }
      }
      .weui-cells {
        font-size: 3.8vw;
        background: #f7f7f7;
        color: #757575;
        &::after,
        &::before {
          border-bottom: 0px solid #d9d9d9;
          border-top: 0px solid #d9d9d9;
        }
      }
    }
  }
  .btn {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 14vw;
    line-height: 14vw;
    background-color: @theme-color;
    color: #fff;
    font-size: 4.6vw;
    text-align: center;
  }
  .btn-pay {
    height: 50px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    bottom: 0;
    background: #fff;
    border-top: 1px solid #e4e4e4;
    box-sizing: border-box;
    .price {
      padding-left: 10px;
      font-size: 13px;
      color: #666;
      span {
        font-size: 16px;
        color: #e2513c;
      }
    }
    .pay {
      height: 100%;
      width: 120px;
      line-height: 45px;
      text-align: center;
      font-size: 15px;
      background-color: #62b900;
      color: #fff;
      box-sizing: border-box;
    }
  }
}
</style>
