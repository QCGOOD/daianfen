<template>
  <div class="help">
    <div class="problem">
      <p class="problem-title">
        常见问题
      </p>
      <div class="p-content">
        <div class="p-c-item" v-for="(item, i) in list" :key="i">
          <p class="i-title" @click="show(item, i)">
            <span>{{item.title}}</span>
            <!-- <i class="iconfont icon-jiantou-copy-copy-copy" v-show="item.show"></i> -->
            <i class="iconfont" :class="[item.show ? 'icon-jiantoushang' : 'icon-jiantouxia']"></i>
          </p>
          <p class="i-content" v-show="item.show" :class="{ 'content-show': item.show }">
            {{item.content}}
          </p>
        </div>
      </div>
    </div>
    <div class="customer">
      <p class="cu-title">客服电话</p>
      <div class="cu-content">
        <p>遇到无法解决的问题请联系客服为您处理</p>
        <p>工作时间：周一至周日，9：00-18：00</p>
      </div>
      <p class="cu-phone">点击拨号:
        <a href="tel:020-36980731">020-36980731</a>
      </p>
    </div>
    <!-- <qc></qc> -->
  </div>
</template>

<script>
// import Qc from '../Common/qc'

export default {
  // components: {
  //   Qc
  // },
  data () {
    return {
      list: [
        { title: '会员有什么优惠？', content: '会员可以享受店内所有会员优惠', show: false },
        { title: '会员如何充值？充值有什么优惠？', content: '充值步骤：a)进入会员中心--->我要充值--->选择需要充值的金额--->微信充值--->完成b)大笔金额需店内联系服务员代充充值优惠：充值页面有相关充值赠送引导，充值成功后转发邀请好友可领取优惠券。', show: false },
        { title: '如何领取优惠券？优惠券何时可用？', content: ' 优惠券可在支付或充值成功后邀请好友、参与活动时领取。所获取的优惠券在扫码支付时可以使用，具体详细信息可在首页优惠券中查看。', show: false },
        { title: '扫码支付时余额与优惠券是否可以同时使用？', content: '可以，扫码支付时使用余额、优惠券和微信结合支付。', show: false }
      ],
      index: null
    }
  },
  methods: {
    show (item, index) {
      if (index === this.index && item.show) {
        item.show = false
        return false
      }
      this.list.map((item, i) => {
        item.show = false
        if (index === i) item.show = true
      })
      this.index = index
    }
  }
}
</script>

<style lang="less" scoped>
.help {
  .problem {
    position: relative;
    &::after {
      content: '';
      position: absolute;
      height: 1px;
      bottom: 0;
      transform: scaleY(0.5);
      left: 0;
      right: 0;
      border-bottom: 1px solid #D9D9D9;
    }
    .problem-title {
      height: 12vw;
      line-height: 12vw;
      font-size: 4vw;
      color: rgb(141, 141, 141);
      background: #fff;
      padding: 0 4vw;
    }
    .p-content {
      .p-c-item {
        font-size: 4vw;
        position: relative;
        &::after {
          content: '';
          position: absolute;
          height: 1px;
          top: 0;
          transform: scaleY(0.5);
          left: 4vw;
          right: 0;
          border-top: 1px solid #D9D9D9;
        }
        .i-title {
          display: flex;
          justify-content: space-between;
          background: #fff;
          padding: 3vw 4vw;
          i {
            color: @light-color;
            font-size: 4vw;
          }
        }
        .i-content {
          padding: 2vw 4vw 2vw 6vw;
          color: rgb(129, 129, 129);
          font-size: 3.7vw;
          line-height: 1.8;
        }
      }
    }
  }
  .customer {
    background: #fff;
    margin-top: 3vw;
    font-size: 4vw;
    padding: 4vw;
    .cu-title {
      color: @gray-color;
    }
    .cu-content {
      margin: 3vw 0 4vw 0;
    }
    .cu-phone {
      a {
        color: @theme-color;
      }
    }
  }
}
</style>
