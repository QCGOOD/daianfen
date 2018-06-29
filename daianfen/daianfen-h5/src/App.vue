<template>
  <div id="app">
    <div v-if="!isFollow" class="follow" @click="showDialogStyle = true">您还没有关注哦，点击关注~</div>
    <div v-transfer-dom>
      <x-dialog v-model="showDialogStyle" hide-on-blur :dialog-style="{'overflow-y': 'auto'}" >
        <div class="img-box">
          <img :src="imgHost+qrUrl" style="max-width:100%">
          <i class="iconfont icon-guanbi1 close" @click="showDialogStyle = false"></i>
        </div>
      </x-dialog>
    </div>
    <router-view v-wechat-title="$route.meta.title"/>
  </div>
</template>

<script>
import { XDialog, TransferDomDirective as TransferDom } from 'vux'
export default {
  directives: {
    TransferDom
  },
  components: {
    XDialog,
  },
  name: "App",
  data() {
    return {
      showDialogStyle: false,
      isFollow: true,
      qrUrl: ''
    }
  },
  created() {
    // this.apiOpenFollow()
    // this.$wxSdk.onMenuShare('加速商学院','助力优秀企业加速发展！',`${this.$ROOTURL}/mobile/POUND/activity?wo=1&wot=2&woacm=1&mpl=1`,'http://athena-1255600302.cosgz.myqcloud.com/attachments/abs.jpg')
    if (process.env.NODE_ENV === "development") {
      // this.apiLogin();
    } else {
      this.$wxSdk.loadJsapiTicketSign();
      this.$wxSdk.hideMenuItems();
    }
    // this.apiGetUserInfo();
  },
  methods: {
    apiLogin() {
      this.$http
        .post("/member/login/mobile", { mobile: "18570478526", code: 1024 })
        .then(res => {
          this.apiGetOpenId("ogkuh0rsbAzcO8cHLMPiL50rK9lE");
        });
    },
    apiGetOpenId(openId) {
      this.$http.post("/member/openId", { openId }).then(res => {});
    },
    apiGetUserInfo() {
      this.$http.get("member/info").then(res => {
        this.$store.commit('userSave', res.data.data)
      });
    }
  }
};
</script>

<style lang="less">
@import "~vux/src/styles/reset.less";
@import "~vux/src/styles/1px.less";
@import "//at.alicdn.com/t/font_623587_spldk19sl9.css";

html,body {
  background-color: #fff !important;
  font-size:3.8vw;
}
img {
  width: 100%;
}
input {
  -webkit-appearance: none;
}
ul {
  list-style: none;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  // color: #2c3e50;
  // margin-top: 60px;
}
.white {
  background-color: white;
}
.loading-layer, .no-data-text.active{
  display: none;
}
.pull-to-refresh-layer{
  display: none;
}
.weui-dialog__btn_primary {
  color: @theme-color !important;
}
.weui-cells{
  margin-top:4vw !important;
}
// 首页搜索
.search{
  .weui-search-bar{
    border-radius:1vw !important;
  }
  .weui-search-bar__form{
    line-height: 2.3;
    .weui-search-bar__box .weui-icon-search{
      line-height: 9vw !important;
    }
  }
  .weui-search-bar__cancel-btn {
    line-height:  8.5vw !important;
  }
  .weui-search-bar:after,.weui-search-bar:before{
    display: none !important;
  }
}
// .content{
//   .vux-tab .vux-tab-item{
//     background:linear-gradient(transparent) !important;
//   }
// }

// 添加备注
.addRemark{
  .weui-cells {
    margin: 3vw !important;
    background-color: #f2f2f2 !important;
    border-radius: 1vw !important;
    &::before{
      border:0 none !important;
    }
    &::after{
      border:0 none !important;
    }
  }
  .weui-textarea {
    font-size: 3.8vw !important;
    background-color: #f2f2f2 !important;
  }
}
// 核销
.examine{
  .weui-form-preview__item{
    display: flex !important;
    justify-content: space-between !important;
  }
  .weui-form-preview__bd{
    flex:1 !important;
    text-align: left !important;
  }
}
</style>
