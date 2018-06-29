<template>
  <div v-if="!pageNoData" class="detail">
    <div class="context">
      <div class="img">
        <img :src="imgHost+detail.iconUrl" alt="">
      </div>
      
      <div class="title-box white">
        <div class="title-top vux-1px-b">
          <p class="title">{{detail.title}}</p>
          <p class="type" v-if="detail.courseTagList.length > 0">
            <span v-for="(tag,i) in detail.courseTagList" :key="i">{{tag.name}}</span>
          </p>
          <div class="price-sign">
            <p class="price">
              <span>学费：</span>
              <span>{{detail.price}}</span>
            </p>
            <p class="hot">
              <span>热度：</span>
              <span class="iconfont icon-shoucang" :class="{'icon-shoucang1':i<3}" v-for="i in 5" :key="i"></span>
            </p>
          </div>
          <!-- <p class="sign">已报名：
              <span>7</span>
              <span>/</span>
              <span>20</span>
            </p> -->
          <!-- <p class="time">开课时间：
            <span v-if="detail.startTime">{{detail.startTime | dateFormat}}</span>
          </p> -->
          <p class="time">学制：
            <span>{{detail.educationalSystem}}</span>
          </p>
        </div>
        <!-- <div class="address">
          <div class="item">
            <p class="iconfont icon-laiyuan1">2018年7月-2019年4月</p>
          </div>
          <div class="item">
            <p class="iconfont icon-laiyuan1">的设计费设计哦i发哦i哦啊时空法卡刷饭卡泡芙拍卡牌是分开就</p>
          </div>
        </div>
      </div>
      <div class="sign-up-box white">
        <div class="item sign-up vux-1px-b">
          <div class="left">
            <i class="iconfont icon-baoming"></i>
            <span>已报名 （7/65）</span>
          </div>
          <div class="right">
            <div class="img" v-for="i in 5" :key="i">
              <img src="static/image/132.jpg" alt="">
            </div>
          </div>
          <i class="iconfont icon-jiantou"></i>
        </div>
        <div class="item">
          <i class="iconfont icon-pinglun"></i>
          <span>评论 （3）</span>
          <i class="iconfont icon-jiantou"></i>
        </div>-->
      </div> 
      <!-- <div class="sign-up-box white" @click="jumpPage(`/curriculum/sign?id=${$route.query.id}&c=${detail.activitySignSetting.maxNum}&s=${model.activitySignSetting.signNum}`)">
        <div class="item sign-up">
          <div class="left">
            <i class="iconfont icon-baoming"></i>
            <span>已报名 （{{detail.activitySignSetting.signNum}}/{{detail.activitySignSetting.maxNum}}）</span>
          </div>
          <div class="right">
            <div class="img" v-for="(item,i) in detail.activitySignSetting.imageList" :key="i">
              <img :src="item">
            </div>
          </div>
          <i class="iconfont icon-jiantou"></i>
        </div>
      </div> -->
      <div class="intro white">
        <p class="title iconfont icon-jianjie1 vux-1px-b">课程详情</p>
        <div  v-if="detail.content" class="html" v-html="detail.content"></div>
      </div>
      <qc></qc>
    </div>
    <div class="bottom-sign vux-1px-t" v-if="detail.isRelease">
      <div class="left" @click="jumpPage('/curriculum')">
        <i class="iconfont icon-kecheng2"></i>
        <p>更多课程</p>
      </div>
      <div v-if="detail.sign" class="right">报名成功</div>
      <div v-else class="right" @click="jumpPay()">我要报名</div>
    </div>
    <!-- <div class="bottom-sign vux-1px-t">
      <div class="item" @click="$router.push('/curriculum')">
        <i class="iconfont icon-gengduo"></i>
        <p>更多</p>
      </div>
      <a class="item" style="" :href="`tel:${detail.contactPhone}`">
        <i class="iconfont icon-76"></i>
        <p>{{detail.contact || '咨询'}}</p>
      </a>
      <div v-if="!detail.sign" class="item" @click="jumpPay">
        <i class="iconfont icon-baoming1"></i>
        <p>报名</p>
      </div>
      <div v-else class="item">
        <i class="iconfont icon-baoming1"></i>
        <p>报名成功</p>
      </div>
    </div> -->
  </div>
  <div v-else class="nodata">
    <img class="icon" src="static/image/icon.png" alt="">
    <p class="tip">课程已失效</p>
    <div class="btn-more" @click="jumpPage('/curriculum')">查看更多课程</div>
  </div>
</template>

<script>
import { Group, Cell, XDialog, XButton } from 'vux'

export default {
  components: {
    Group, Cell, XDialog, XButton
  },
  data () {
    return {
      showToast: true,
      detail: {},
      pageNoData: false
    }
  },
  created() {
    this.getDetail()
  },
  computed: {
    userInfo() {
      return this.$store.state.user;
    }
  },
  methods: {
    jumpPage(url) {
      this.$router.push(url);
    },
    getDetail() {
      this.$http.get('/course/get', {id: this.$route.query.id, shareMemberId: this.$route.query.shareMemberId})
      .then(res => {
        console.log('详情', res)
        this.detail = res.data.data
        document.title = this.detail.title;
        this.detail.content = this.detail.content.replace(/width: 100%;/g, '')
        // 分享
        let url = `${this.$ROOTURL}/mobile/POUND/curriculum/detail?wo=1&wot=2&woacm=1&mpl=1&id=${this.$route.query.id}&shareMemberId=${this.userInfo.id}`
        if (this.userInfo.is_distributer) {
          url += `&dst=1&dstr=${this.userInfo.id}`;
        }
        console.log('用户',this.userInfo)
        this.$wxSdk.onMenuShare(
          this.detail.title,
          this.detail.info,
          url,
          this.imgHost+this.detail.iconUrl,
          this.recordShare
        )
      })
      .catch(err => {
          if (err.data.code == 40001) {
            this.pageNoData = true;
          }
        });
    },
    // 报名
    jumpPay() {
      this.$router.push({ path: "/order/lessonConfrim", query: this.$route.query });
    },
    // 创建分享记录
    recordShare(url) {
      let params = {
        sourceId: this.$route.query.id,
        sourceType: 3,
        url: url
      }
      this.$http.post('/share/insert', params).then(res => {
      })
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
  },
  filters: {
    'dateFormat'(str) {
      str = str.substr(0,10)
      let arr = str.split('-')
      // arr[1] = '年'
      // arr[2] = '月'
      // arr[5] = '日'
      arr.splice(1,0,'年')
      arr.splice(3,0,'月')
      arr.splice(5,0,'日')
      str = arr.join('')
      return str
    }
  }
}
</script>

<style lang="less" scoped>
.white {
  background-color: white;
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
.detail {
  .context {
    margin-bottom: 15vw;
    .img {
      width:100%;
      height:40vw;
      max-height:145px;
      line-height: 0;
      overflow:hidden;
      img {
        width: 100%;
      }
    }
    .title-box {
      .title-top {
        padding: 2vw 4vw;
        .title {
          font-size: 4.5vw;
        }
        .type {
          margin-bottom: 1vw;
          position: relative;
          padding-right: 5vw;
          span {
            background-color: rgb(211, 194, 165);
            display: inline-block;
            padding: 0 2vw;
            color: #fff;
            border-radius: 1vw;
            font-size: 3.4vw;
            height: 5vw;
            line-height: 5vw;
            margin-right: 2vw;
            &:last-child {
              margin-right: 0;
            }
          }
          .icon-shoucang {
            position: absolute;
            right: 0;
            color: @light-color;
            font-size: 5vw;
          }
        }
        .price-sign {
          font-size: 3.6vw;
          display: flex;
          justify-content: space-between;
          .price {
            // span:nth-child(2) {
            //   color: @theme-color;
            // }
            span:last-child {
              color: @theme-color;
              // color: @dark-color;
              // text-decoration: line-through;
            }
          }
          .hot{
            .iconfont{
              display: inline-block;
              font-size:3.4vw;
              color:@yellow-color;
              color:#d3c2a5;
              margin-right:2vw;
            }
            span:last-child{
              margin-right:0;
            }
          }
          .sign {
            color: @gray-color;
            span:first-child {
              color: #000;
            }
          }
        }
        .time {
          font-size: 3.6vw;
          span {
            color: @dark-color;
          }
        }
      }
      .address {
        padding: 2vw;
      }
    }
    .sign-up-box {
      margin-top: 4vw;
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
          font-size: 4vw;
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
        font-size: 4vw;
        display: flex;
        align-items: center;
        &:before {
          font-size: 5vw;
          margin-right: 4vw;
          color: @red-color;
        }
      }
      .html {
        padding: 3vw;
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

  // .bottom-sign {
  //   height: 15vw;
  //   position: fixed;
  //   bottom: 0;
  //   left: 0;
  //   right: 0;
  //   display: flex;
  //   // justify-content: space-around;
  //   .item {
  //     // width: 35vw;
  //     flex:1;
  //     // background-color: rgb(248, 248, 248);
  //     background-color: @theme-color;
  //     color: #fff;
  //     display: inline-flex;
  //     // flex-flow: column;
  //     justify-content: center;
  //     align-items: center;
  //     border-right:1px solid #fff;
  //     &:last-child{
  //       border-right-color:@theme-color;
  //     }
  //     i {
  //       font-size: 5vw;
  //     }
  //     p {
  //       margin-left:2vw;
  //       font-size: 3.6vw;
  //     }
  //   }
  //   .right { 
  //     width: 65vw;
  //     background-color: @theme-color;
  //     display: inline-flex;
  //     justify-content: center;
  //     align-items: center;
  //     font-size: 4.5vw;
  //     color: #fff;
  //   }
  // }
}
</style>
