<template>
  <div class="wrap examine">
    <div class="content" ref="content">
      <!-- 优惠券信息 -->
      <div class="detail">
        <div class="head">
          <img :src="`static/image/${detail.par > 199?'Golden':detail.par > 99?'purple':'blue'}.png`" alt="">
          <div class="head-info">
            <div class="head-item">
              <span>编号: {{detail.couponsNo}}</span>
              <span>{{detail.useState}}</span>
            </div>
            <div class="head-item">
              <span class="par">￥{{detail.par}}</span>
              <p class="type">{{detail.couponsType}}</p>
            </div>
            <div class="head-item">
              <p class="date">{{detail.title}}</p>
            </div>
          </div>
        </div>
        <div class="footer">
          <p class="f-title">到期: {{detail.validDate}}</p>
          <p class="info" v-html="detail.info"></p>
        </div>
      </div>
      <div class="submit">
        <x-button  type="warn" @click.native="submit">确认核销</x-button>
      </div>
      <!-- 弹窗 -->
      <!-- <div v-transfer-dom>
        <confirm
          v-model="showConfirm"
          :show-cancel-button="showCancel"
          :content="confirmText"
          title="提示"
          confirm-text="返回首页"
          @on-confirm="confirm">
        </confirm>
      </div> -->
    </div>
  </div>
</template>
<script>
import { XButton, Confirm } from 'vux'
export default {
  components: {
    XButton, Confirm
  },
  data() {
    return {
      detail: {
        par: 0
      },
      showCancel: false,
      showConfirm: false,
      confirmText: '核销成功'
    };
  },
  created() {
    this.apiGetDetail()
  },
  methods: {
    apiGetDetail() {
      // 查看详情
      this.$http.get('/coupons/get', {id: this.$route.query.id})
      .then(res => {
        this.detail = res.data.content0
        let regTitle = /.*\s/; // 匹配标题
        let regDetail = /\s[0-9].*/g; // 匹配详情
        // 标题
        this.detail.title = res.data.content0.content.match(regTitle)[0];
        // this.detail.title = res.data.content0.content.replace(/.*\s/,);
        let date = res.data.content0.validDate;
        // 日期
        this.detail.validDate = `${date.substr(0,4)}年${date.substr(4,2)}月${date.substr(6,2)}日`
        // 内容
        try {
          let info = res.data.content0.content.replace(/；/g,'；<br>');
          this.detail.info = info.match(regDetail).join('');
        } catch (error) {
          this.detail.info = res.data.content0.content;
        }
        
      })
    },
    submit() {
      this.$http.post('/coupons/useCoupons', {id: this.$route.query.id})
      .then(res => {
        // this.confirmText = res.data.errMsg
        // this.showConfirm = true
        this.confirm()
      })
    },
    confirm() {
      let that = this;
      this.$vux.alert.show({
        title: '提示',
        content: '核销成功',
        onShow () {
        },
        onHide () {
          that.$router.replace('/index')
        }
      })
      
    }
  }
}
</script>
<style lang="less" scoped>
.wrap{
  background: #f2f2f2;
  min-height: 100vh;
}
.detail{
  padding-top: 3vw;
  margin: 0 3vw;
  .head{
    position: relative;
    height: 30vw;
    background: red;
    border-radius: 1.5vw 1.5vw 0 0;
    overflow: hidden;
    img{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      background-color: #f2f2f2;
    }
    .head-info{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      padding: 3vw;
      box-sizing: border-box;
      z-index: 22;
      .head-item{
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #fff;
        .par{
          font-size: 8vw;
        }
        .type{
          font-size: 4.5vw;
        }
        .date{
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
      }
    }
  }
  .footer{
    padding: 0 3vw;
    background: #fff;
    border-radius: 0 0 1.5vw 1.5vw;
    color: #808080;
    // .title{
    //   color: #808080;
    //   font-size: 3.4vw;
    //   text-overflow: ellipsis;
    //   white-space: nowrap;
    //   overflow: hidden;
    //   border-bottom: 1px solid #eee;
    //   padding: 2vw 0;
    // }
    .f-title{
      color: #808080;
      padding: 2vw 0;
      border-bottom: 1px solid #eee;
    }
    .info{
      padding: 3vw;
      word-break: break-all;
      color: #808080;
    }
  }
}
  .submit{
    margin: 10vw 6vw;
  }


</style>
