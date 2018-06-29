<template>
  <div class="wrap">
    <div class="content" ref="content">
      <!-- 用户信息 -->
      <div class="user">
        <div class="img">
          <img v-if="detail.imgUrl" :src="detail.imgUrl" alt="">
          <img v-else src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAuCAMAAABgZ9sFAAAAVFBMVEXx8fHMzMzr6+vn5+fv7+/t7e3d3d2+vr7W1tbHx8eysrKdnZ3p6enk5OTR0dG7u7u3t7ejo6PY2Njh4eHf39/T09PExMSvr6+goKCqqqqnp6e4uLgcLY/OAAAAnklEQVRIx+3RSRLDIAxE0QYhAbGZPNu5/z0zrXHiqiz5W72FqhqtVuuXAl3iOV7iPV/iSsAqZa9BS7YOmMXnNNX4TWGxRMn3R6SxRNgy0bzXOW8EBO8SAClsPdB3psqlvG+Lw7ONXg/pTld52BjgSSkA3PV2OOemjIDcZQWgVvONw60q7sIpR38EnHPSMDQ4MjDjLPozhAkGrVbr/z0ANjAF4AcbXmYAAAAASUVORK5CYII=" alt="">
        </div>
        <p class="user-info">姓名：<span>{{detail.memberName}}</span></p>
        <p class="user-info">微信名：<span>{{detail.nickName}}</span></p>
        <p class="user-info">手机号码：<span>{{detail.phoneNo}}</span></p>
        <p class="user-info">预约时间：<span>{{detail.reservationDate}} {{detail.reservationTime}}</span></p>
        <div class="insert" v-if="detail.hasRemark == 0" @click="jumpPage(`/index/addRemark?id=${detail.id}`)">
          <i class="iconfont icon-xiugaibeizhu"></i>
          添加备注
        </div>
        <div class="insert" v-else>已备注</div>
      </div>
      <!-- 备注 -->
      <div class="mark">
        <divider v-if="markList.length > 0" class="divider">仅展示客户最近预约两条备注记录</divider>
        <divider v-else class="divider">暂无备注</divider>
        <div class="mark-item" v-if="i < 2" v-for="(item, i) in markList" :key="i">
          <div class="mark-content">
            <p class="title">备注：</p>
            <p class="size">
              <span>文胸尺寸: <span>{{item.barSize}}</span></span>
              <span>内裤尺寸: <span>{{item.pantySize}}</span></span>
            </p>
            <p class="info">{{item.remark}}</p>
          </div>
          <div class="footer">
            <span class="date-time">{{item.createTime.substr(0, 16)}}</span>
            <span class="mark-user">备注人: {{item.employeeName}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Divider  } from 'vux'
import ReserveItem from "@/components/Common/reserveItem";
export default {
  components: {
    Divider
  },
  data() {
    return {
      scrollerTop: 0,
      searchData: {
        keyWord: '',
        selectType: 2,
        status: 1,
      },
      list: [],
      markList: [],
      detail: {
        hasRemark: 0
      },
    };
  },
  created() {
    // this.search()
    this.apiGetDetail()
    this.apiGetMark()
  },
  methods: {
    apiGetDetail(data) {
      // 查看详情
      this.$http.get('/reservation/details', {id: this.$route.query.id})
      .then(res => {
        this.detail = res.data.content0
      })
    },
    apiGetMark() {
      // 查看备注
      this.$http.get('/reservation/remarks', {memberId: this.$route.query.memberId})
      .then(res => {
        this.markList = res.data.content0.rows
      })
    },
    jumpPage(url) {
      if (!url) return false;
      this.$router.push(url)
    }
  }
}
</script>
<style lang="less" scoped>
.divider{
  width:90%;
  margin:0 auto;
  font-size: 3.2vw;
  color: #808080;
}
.wrap{
  width: 100%;
  height: 100vh;
  background: #f2f2f2;
  overflow-y: auto;
}
.content{
  // min-height:100%;
  position: relative;
  background:#fff;
  border-radius: 1.5vw;
  box-sizing: border-box;
  padding: 3vw;
  margin: 4vw;
  .insert{
    position: absolute;
    top: 3vw;
    right: 3vw;
    font-size: 4vw;
    color: #808080;
    padding: 3px;
    i{
      font-size:3.6vw;
      margin-right:3px;
    }
  }
  .user{
    overflow: hidden;
    .img{
      width: 16vw;
      height: 16vw;
      background-color: #f2f2f2;
      border-radius: 50%;
      margin: 4vw auto 5vw;
      img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .user-info{
      color:#808080;
      margin-bottom:2vw;
      &:last-child{
        margin-bottom:0;
      }
      span{
        padding-left: 2vw;
        color: #333;
      }
    }
  }
  .mark{
    margin-top: 5vw;
    .mark-item{
      
      margin: 3vw 0;
      
      color: #555;
      .mark-content{
        background-color: #f2f2f2;
        border-radius: 1.5vw;
        padding:3vw 2vw;
        p{
          margin-bottom:1vw;
          &:last-child{
            margin-bottom: 0;
          }
        }
        .title{
          font-size: 4vw;
        }
        .size{
          display: flex;
          span{
            flex:1;
            span{
              color: @theme-color;
            }
          }
        }
        .info{
          word-break: break-all;
          line-height: 1.2;
        }
      }
      .footer{
        display: flex;
        justify-content: space-between;
        background: #fff;
        padding: 1vw 2vw;
      }
    }
  }
}


</style>
