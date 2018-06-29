<template>
  <div v-if="status == 0" class="sign" :style="`background: url(${this.imgCut}${model.checkUrl}) no-repeat center center;`">
    <div class="from">
      <input class="list list--input" v-model="fromModel.msg" type="text" :placeholder="`${fromModel.checkinWay == 1?'签到手机号':'签到暗号'}`"/>
      <button class="list list--button" @click="apiSaveSign">确认签到</button>
    </div>
    <div class="mask" v-if="failMsg">
      <div class="dialog">
        <img class="close" src="static/image/close.png" alt="" @click="failMsg = ''">
        <img :src="`${this.imgCut}${model.failUrl}`" alt="">
        <h2 class="tip">签到失败</h2>
        <p class="msg">{{failMsg}}</p>
      </div>
    </div>
  </div>
  <div v-else class="sign" :style="`background: url(${this.imgCut}${model.successUrl}) no-repeat center center;`">
  </div>
</template>

<script>
export default {
  data() {
    return {
      model: "",
      fromModel: {
        msg: "",
        checkinSettingId: "",
        checkinWay: "1"
      },
      failMsg: ""
    };
  },

  created() {
    let query = this.$route.query;
    this.fromModel.checkinWay = query.checkWay;
    this.apiGetSignInfo(query.id);
  },
  methods: {
    apiGetSignInfo(checkinSettingId) {
      this.$http
        .get("activityCheckin/getCheckData", { checkinSettingId })
        .then(res => {
          this.model = res.data.data.checkinSetting;
          this.status = res.data.data.checkin;
          this.fromModel.checkinSettingId = checkinSettingId;
        });
    },
    apiSaveSign() {
      if (this.fromModel.checkinWay == 1) {
        let reg = /^1[0-9]{10}$/
        if (this.fromModel.msg && !reg.test(this.fromModel.msg)) {
          this.toast('请输入正确的手机号码')
          return false
        }
      }
      this.$vux.loading.show({text:'请稍后...'})
      this.$http
        .post("activityCheckin/checkin", this.fromModel)
        .then(res => {
          this.apiGetSignInfo(this.fromModel.checkinSettingId);
        })
        .catch(err => {
          this.failMsg = err.data.message;
        })
        .finally(e => {
          this.$vux.loading.hide()
        });
    },
    save() {}
  }
};
</script>

<style lang="less">
.sign {
  min-height: 100vh;
  background-size: cover !important;
  .mask {
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.32);
    .dialog {
      width: 60%;
      padding: 15px;
      position: absolute;
      top: 50%;
      left: 50%;
      background: #fff;
      border-radius: 5px;
      transform: translate(-50%, -50%);
      .close {
        position: absolute;
        top: -60px;
        width: 28px;
        left: 50%;
        transform: translateX(-50%);
      }
      img {
        display: block;
      }
      .tip {
        margin: 15px 0;
        font-size: 14px;
        font-weight: normal;
        text-align: center;
      }
      .msg {
        text-align: center;
        font-size: 12px;
        color: #b1b1b1;
      }
    }
  }
  .from {
    width: 100%;
    position: absolute;
    bottom: 150px;
    .list {
      width: 65%;
      height: 45px;
      padding: 0 25px;
      margin: 0 auto;
      display: block;
      border: none;
      outline: none;
      border-radius: 25px;
      font-size: 16px;
      text-align: center;
      box-sizing: border-box;
      &--input {
        box-shadow: 0 2px 5px #d8d8d8;
      }
      &--button {
        margin-top: 20px;
        color: #fff;
        background: #ff5433;
      }
    }
  }
}
</style>
