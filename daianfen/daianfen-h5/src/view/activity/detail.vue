<template>
  <div v-if="!pageNoData" class="detail">
    <div class="context">
      <div class="img">
        <img :src="`${imgHost}${model.iconUrl}`">
        <p class="start-tip" v-if="lastTime">距活动开始仅：{{lastTime}}</p>
      </div>
      <div class="title-box white">
        <div class="title">
          <p class="title-text">{{model.title}}</p>
          <p class="price" v-if="model.isEnableFee">
            <span>￥</span>{{model.activityFee.price | formatPrice}}
          </p>
          <p class="price" v-else>
            免费
          </p>
        </div>
        <div class="time-address vux-1px-t">
          <div class="time vux-1px-b">
            <i class="iconfont icon-shijian"></i>
            <span>{{model.startTime | formatDate}}&nbsp;至&nbsp;{{model.endTime | formatDate}}</span>
          </div>
          <div class="address vux-1px-b" v-show="model.sponsor">
            <i class="iconfont icon-dizhi"></i>
            <span>{{model.sponsor}}</span>
            <i class="iconfont icon-fangxiang1"></i>
          </div>
          <div class="address vux-1px-b" v-show="model.organizer">
            <i class="iconfont icon-dizhi"></i>
            <span>{{model.organizer}}</span>
            <i class="iconfont icon-fangxiang1"></i>
          </div>
          <div class="address">
            <i class="iconfont icon-dizhi"></i>
            <span>{{model.address}}</span>
            <i class="iconfont icon-fangxiang1"></i>
          </div>
        </div>
      </div>
      <!-- <div class="active-title">选择子活动</div>
      <checker class="active-box" default-item-class="active-item" selected-item-class="active-item-selected">
        <checker-item v-for="(item, i) in childActive" :key="i" value="1">
          <div>这是一个活动的分区啦是的发送到</div>
          <div class="tnb">
            <span class="time">时间</span>
            <span class="price">多少钱</span>
          </div>
        </checker-item>
      </checker> -->
      <div class="sign-up-box white" @click="jumpPage(`/activity/sign?id=${$route.query.id}&c=${model.activitySignSetting.maxNum}&s=${model.activitySignSetting.signNum}`)">
        <div class="item sign-up">
          <div class="left">
            <i class="iconfont icon-baoming"></i>
            <span>已报名 （{{model.activitySignSetting.signNum}}/{{model.activitySignSetting.maxNum}}）</span>
          </div>
          <div class="right">
            <div class="img" v-for="(item,i) in model.activitySignSetting.imageList" :key="i">
              <img :src="item">
            </div>
          </div>
          <i class="iconfont icon-jiantou"></i>
        </div>
      </div>
      <div class="intro white">
        <p class="title iconfont icon-jianjie vux-1px-b">活动简介</p>
        <div class="html">
          <sp-html :html="model.content"></sp-html>
        </div>
      </div>
    </div>
    <section class="remark" v-if="model.isEnableComment">
      <divider>留言</divider>
      <div class="remark__title">
        <span>所有留言</span>
        <span style="color: #bb9d70;" @click="showComment()">我要留言</span>
      </div>
      <ul class="remark__detail">
        <li class="remark__list" v-for="(list) in comments" :key="list.id">
          <div class="headimg">
            <img :src="list.memberHeadImage" alt="" srcset="">
          </div>
          <div class="content">
            <section class="info">
              <div class="unt">
                <p>{{list.memberName}}</p>
                <p>{{list.createTime}}</p>
              </div>
              <p class="menu" @tounch="showComment(list)">
                <i class="iconfont icon-pingluncu"></i>
                回复
              </p>
            </section>
            <p class="text">{{list.content}}</p>
            <ul class="reply" v-if="list.subComments">
              <li v-for="child in list.subComments" :key="child.id">
                <span>{{child.memberName}}：</span>
                {{child.content}}
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </section>
    <div class="comment" v-if="commentWarp">
      <input v-focus v-model="commentModel.content" :placeholder="commentModel.placeholder" @blur="commentWarp = false" type="text">
      <x-button class="btn-send" :disabled="sendLock" @click.native="saveComment">{{commentModel.parentId ? '回复' :'评论'}}</x-button>
    </div>
    <p class="cancel-sign" @click="apiCancelSign(model.sign.id)" v-if="model.activitySignSetting.isEnableUnsign && model.sign">取消报名</p>
    <qc></qc>
    <div style="height:15vw"></div>
    <div class="bottom-sign vux-1px-t" v-if="model.isRelease">
      <div class="left" @click="jumpPage('/activity')">
        <i class="iconfont icon-huodong"></i>
        <p>更多活动</p>
      </div>
      <div v-if="matchTime == 0" class="right" style="background: #d0d0d0">未开始</div>
      <div v-else-if="matchTime == 1" class="right" style="background: #d0d0d0">已结束</div>
      <div v-else-if="model.sign && model.sign.status == 1" class="right" >审核中</div>
      <div v-else-if="model.sign && model.sign.status == 4" class="right" @click="apiPayOrder()" style="background-color: #62b900" >微信支付</div>
      <div v-else-if="model.sign && model.sign.status == 6" class="right">报名成功</div>
      <div v-else class="right" @click="jumpPay()">我要报名</div>
    </div>
  </div>
  <div v-else class="nodata">
    <img class="icon" src="static/image/icon.png" alt="">
    <p class="tip">活动已失效</p>
    <div class="btn-more" @click="jumpPage('/activity')">查看更多活动</div>
  </div>
</template>

<script>
import { Group, Cell, Divider, Checker, CheckerItem, XButton } from "vux";
import SpHtml from "@/components/Common/html";
export default {
  components: {
    Group,
    Cell,
    Divider,
    Checker,
    CheckerItem,
    SpHtml,
    XButton
  },
  data() {
    return {
      sendLock: false,
      commentWarp: false,
      comments: [],
      commentModel: {
        sourceId: "",
        sourceType: 1,
        content: "",
        parentId: ""
      },
      couponList: [],
      pageNoData: false,
      model: {},
      childActive: [{ name: 1 }, { name: 2 }],
      lastTime: ""
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.user;
    },
    matchTime() {
      let startTime = this.model.activitySignSetting.signStartTime.replace(/\-/g, "/");
      let endTime = this.model.activitySignSetting.signEndTime.replace(/\-/g, "/");
      if ((new Date(startTime)) > (new Date())) {
        // 活动未开始
        console.log('活动状态=======>未开始')
        return 0
      } else if ((new Date(endTime)) < (new Date())) {
        // 活动已结束
        console.log('活动状态=======>已结束')
        return 1
      } else {
        // 可以报名
        console.log('活动状态=======>进行中')
        return 2
      }
    },
  },
  created() {
    this.query = this.$route.query;
    this.apiGetActiveOne(this.query.id, this.query.shareMemberId);
  },
  methods: {
    apiGetActiveOne(id, shareMemberId) {
      this.$http
        .get("/activity/get", { id, shareMemberId })
        .then(res => {
          this.model = res.data.data;
          document.title = this.model.title;
          // 优惠券
          this.apiGetCoupons()
          // 分享链接
          let url = `${this.$ROOTURL}/mobile/POUND/activity/detail?wo=1&wot=2&woacm=1&mpl=1&id=${id}&shareMemberId=${this.userInfo.id}`;
          if (this.userInfo.is_distributer) {
            // 分销分享链接
            url += `&dst=1&dstr=${this.userInfo.id}`;
          }
          if(this.model.isEnableComment) {
            // 评论
            this.apiGetComment(id);
          }
          // 倒计时
          this.countDown(this.model.startTime);
          // 分享配置
          this.$wxSdk.onMenuShare(
            this.model.title,
            this.model.info,
            url,
            `${this.imgHost}${this.model.iconUrl}`,
            this.recordShare
          );
        })
        .catch(err => {
          if (err.data.code == 40001) {
            this.pageNoData = true;
          }
        });
    },
    // 创建分享记录
    recordShare(url) {
      let params = {
        sourceId: this.$route.query.id,
        sourceType: 2,
        url: url
      }
      this.$http.post('/share/insert', params).then(res => {
      })
    },
    // 获取可用优惠券
    apiGetCoupons() {
      let params = {
        activityId: this.model.id,
        activityCategoryId: this.model.categoryId
      }
      this.$http.get("/coupon_rule/available/activity", params).then(res => {
        console.log('可用优惠券=====',res.data)
        this.couponList = res.data.data;
      });
    },
    // 获取评论
    apiGetComment(sourceId) {
      let auditStatus = this.model.isEnableCommentAudit ? '2' : '1';
      this.$http.get("/comment/page", { sourceId, auditStatus }).then(res => {
        this.comments = res.data.data.list;
      });
    },
    // 发评论
    apiSaveComment(model) {
      this.sendLock = true;
      this.$http
        .post("/comment/insert", model)
        .then(res => {
          this.commentWarp = false;
          this.apiGetComment(model.sourceId);
        })
        .catch(err => {
          this.toast(err.data.message);
        })
        .finally(() => {
          this.sendLock = false
        });
    },
    apiPayOrder() {
      this.$vux.loading.show({ text: "正在发起支付" });
      this.$http
        .post("/pay", {
          orderId: this.model.sign.id,
          orderType: 2,
          payReturnUrl: location.href
        })
        .then(res => {
          location.href = `${this.$ROOTURL}/pay.html?token=${
            res.data.data.id
          }`;
        });
    },
    apiCancelSign(id) {
      const _this = this;
      this.$vux.confirm.show({
        title: '提示',
        content: '是否取消本次报名',
        onCancel () {
          console.log('plugin cancel')
        },
        onConfirm () {
          _this.$http.post('/activitySignTemp/cancel', {id})
            .then(res => {
              _this.apiGetActiveOne(this.query.id, this.query.shareMemberId)
            })
        }
      })
    },
    jumpPage(url) {
      this.$router.push(url);
    },
    jumpPay() {
      this.$router.push({ path: "/order/confirm", query: this.query });
    },
    // 倒计时
    countDown(str) {
      let newStr = str.replace(/\-/g, "/");
      //获取当前时间
      let now = Date.now();
      //设置截止时间
      let endDate = new Date(newStr);
      let end = endDate.getTime();
      //时间差
      let lastTime = end - now;
      // 时间低于两天 并且不能出现负数
      if (lastTime <= 172800000 && lastTime > 0) {
        let [d, h, m, s] = [
          Math.floor(lastTime / 1000 / 60 / 60 / 24),
          Math.floor((lastTime / 1000 / 60 / 60) % 24),
          Math.floor((lastTime / 1000 / 60) % 60),
          Math.floor((lastTime / 1000) % 60)
        ];
        this.lastTime = `${d}天${h}时${m}分${s}秒`;
        this.timer = setTimeout(this.countDown, 1000, str);
      }
    },
    // 发评论
    showComment(list) {
      this.commentModel.sourceId = "";
      this.commentModel.parentId = "";
      this.commentModel.content = "";
      this.commentModel.placeholder = "请输入...";
      if (list) {
        this.commentModel.sourceId = list.sourceId;
        this.commentModel.parentId = list.id;
        this.commentModel.placeholder = `回复:${list.memberName}`;
      } else {
        this.commentModel.sourceId = this.query.id;
      }
      this.commentWarp = true;
    },
    saveComment() {
      this.apiSaveComment(this.commentModel);
    },
  },
  directives: {
    focus: {
      // 指令的定义
      inserted: function(el) {
        el.focus();
      }
    }
  },
  destroyed() {
    clearInterval(this.timer);
    this.$wxSdk.onMenuShare(
      "加速商学院",
      "助力优秀企业加速发展！",
      `${this.$ROOTURL}/mobile/POUND/activity?wo=1&wot=2&woacm=1&mpl=1`,
      "http://athena-1255600302.cosgz.myqcloud.com/attachments/abs.jpg"
    );
  }
};
</script>

<style lang="less" scoped>
.white {
  background-color: white;
}
.detail {
  overflow-x: hidden;
  .active-title {
    padding: 10px 15px;
    border-bottom: 1px solid #e5e5e5;
    background: #fff;
  }
  .active-box {
    padding: 4vw 0;
    background: #fff;
    border-bottom: 1px solid #e4e4e4;
  }
  .active-item {
    width: 87%;
    margin: 0 auto 4vw;
    padding: 2.7vw 3vw;
    display: block;
    font-size: 3.7vw;
    border: 2px solid #dbdbdb;
    border-radius: 8px;
    color: #333;
    .tnb {
      margin-top: 10px;
      justify-content: space-between;
      display: flex;
      .time {
        padding: 5px;
        font-size: 3.5vw;
        line-height: 1;
        border-radius: 3px;
        background: #dbdbdb;
        color: #fff;
      }
      .price {
        color: #dbdbdb;
      }
    }
    &:last-child {
      margin-bottom: 0;
    }
    &.active-item-selected {
      border: 2px solid #e2513c;
      .time {
        background: #eb8576;
      }
      .price {
        color: #e2513c;
      }
    }
  }

  .context {
    .img {
      position: relative;
      img {
        width: 100%;
        display: block;
      }
      .start-tip {
        width: 100%;
        padding: 2.6vw 0;
        position: absolute;
        bottom: 0;
        left: 0;
        font-size: 3.5vw;
        text-align: center;
        color: #fff;
        background-color: rgba(226, 81, 60, 0.68);
      }
    }
    .title-box {
      margin-bottom: 4vw;
      .title {
        padding: 3vw 3vw 1vw 3vw;
        .title-text {
          font-size: 15px;
        }
        .price {
          color: @red-color;
          font-size: 15px;
          position: relative;
          span {
            font-size: 4vw;
          }
          .icon-shoucang {
            position: absolute;
            right: 0;
            color: @light-color;
            font-size: 5vw;
          }
        }
      }
      .time-address {
        padding-left: 4vw;
        font-size: 4vw;
        .time,
        .address {
          display: flex;
          align-items: center;
          line-height: 1;
          padding: 17px 0;
          .iconfont {
            margin-right: 2vw;
            font-size: 13px;
            color: #c7c7c7;
          }
          span {
            font-size: 13px;
          }
        }
        .address {
          padding-right: 10vw;
          position: relative;
          .icon-fangxiang1 {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            color: @gray-color;
          }
        }
      }
    }
    .sign-up-box {
      padding-left: 4vw;
      .item {
        padding: 3vw 0;
        position: relative;
        .iconfont {
          font-size: 5vw;
          color: @red-color;
          margin-right: 2vw;
        }
        span {
          font-size: 14px;
        }
        .icon-jiantou {
          position: absolute;
          right: 2vw;
          top: 50%;
          transform: translateY(-50%);
          color: @gray-color;
          font-size: 4vw;
        }
      }
      .sign-up {
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 1;
        .right {
          display: flex;
          padding-right: 10vw;
          .img {
            width: 8vw;
            height: 8vw;
            border-radius: 50%;
            overflow: hidden;
            border: 2px solid #ffffff;
            box-sizing: border-box;
            margin-left: -2vw;
            &:first-child {
              margin-left: 0;
            }
            img {
              width: 100%;
            }
          }
        }
      }
    }
    .intro {
      margin-top: 4vw;
      .title {
        padding: 3vw 4vw;
        font-size: 14px;
        display: flex;
        align-items: center;
        &:before {
          font-size: 5vw;
          margin-right: 2vw;
          color: @red-color;
        }
      }
      .html {
        padding: 3vw;
      }
    }
  }
  .remark {
    li {
      list-style: none;
    }
    padding: 6vw 4vw;
    &__title {
      margin: 15px 0 25px;
      display: flex;
      justify-content: space-between;
      font-size: 3.5vw;
    }

    &__list {
      display: flex;
      margin-bottom: 3.7vw;
      .headimg {
        width: 10vw;
        height: 10vw;
        margin-right: 15px;
        border-radius: 50%;
        overflow: hidden;
      }
      .content {
        flex: 1;
        padding-bottom: 3.3vw;
        border-bottom: 1px solid #e0e0e0;
        .info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .unt {
            p:first-child {
              font-size: 3.5vw;
            }
            p:last-child {
              font-size: 2.9vw;
              color: #999;
            }
          }
          .menu {
            font-size: 3.5vw;
            color: #999;
            .iconfont {
              vertical-align: middle;
              color: #000;
            }
          }
        }
      }
      .text {
        padding-top: 2vw;
        font-size: 3.5vw;
        color: #444;
      }
      .reply {
        margin-top: 2vw;
        padding: 1.9vw;
        font-size: 3.5vw;
        color: #333;
        background: #ebebeb;
        span {
          color: #999;
        }
      }
    }
  }
  .bottom-sign {
    height: 15vw;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    .left {
      width: 35vw;
      background-color: rgb(248, 248, 248);
      color: @theme-color;
      display: inline-flex;
      flex-flow: column;
      justify-content: center;
      align-items: center;
      i {
        font-size: 4.5vw;
      }
      p {
        font-size: 3.6vw;
      }
    }
    .right {
      width: 65vw;
      background-color: @theme-color;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      font-size: 4.5vw;
      color: #fff;
    }
  }
  .comment {
    position: fixed;
    width: 100%;
    bottom: 0;
    display: flex;
    background: #fff;
    z-index: 10;
    height: 56px;
    & > input {
      flex: 1;
      padding: 10px;
      margin: 10px;
      border: none;
      outline: none;
      border-radius: 2px;
      background: #eee;
    }
    .btn-send {
      width: 60px;
      height: 36px;
      padding: 0;
      margin: 10px 10px 10px 0;
      font-size: 14px;
      border: none;
      background: #e2513c;
      color: #fff;
      border-radius: 3px;
    }
  }
  .cancel-sign {
    text-align: center;
    font-size: 14px;
    color: #b7b7b7;
  }
}
.nodata {
  .icon {
    width: 70%;
    margin: 45px auto 30px;
    display: block;
  }
  .tip {
    font-size: 13px;
    text-align: center;
    margin-bottom: 80px;
  }
  .btn-more {
    width: 175px;
    height: 40px;
    padding: 13px 0;
    margin: 0 auto;
    display: block;
    line-height: 1;
    font-size: 15px;
    text-align: center;
    background: #e2513c;
    color: #fff;
    border-radius: 3px;
    box-sizing: border-box;
  }
}
</style>
