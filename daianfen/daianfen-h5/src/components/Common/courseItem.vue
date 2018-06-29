<template>
  <div class="course-item white">
    <div class="img">
      <img :src="imgCut+item.iconUrl+cutParam3" alt="">
    </div>
    <p class="title">{{item.title}}</p>
    <p class="type" v-if="item.courseTagList">
      <span v-for="(tag,i) in item.courseTagList" :key="i">{{tag.name}}</span>
    </p>
    <div class="price-sign">
      <p class="price">
        <span>学费：</span>
        <span>{{item.price}}</span>
      </p>
      <p class="hot">
        <span>热度：</span>
        <span class="iconfont icon-shoucang" :class="{'icon-shoucang1':i<3}" v-for="i in 5" :key="i"></span>
      </p>
      <!-- <p class="sign">已报名：
        <span>7</span>
        <span>/</span>
        <span>20</span>
      </p> -->
    </div>
    <!-- <p class="time">开课时间：
      <span v-if="item.startTime">{{item.startTime | dateFormat}}</span>
    </p> -->
    <p class="time">学制：
      <span>{{item.educationalSystem}}</span>
    </p>
  </div>
</template>
<script>
export default {
  props: {
    item: Object
  },
  filters: {
    'dateFormat'(str) {
      str = str.substr(0,10)
      let arr = str.split('-')
      // arr[1] = '年'
      // arr[3] = '月'
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
.course-item {
  margin-top:4vw;
  padding:3vw;
  &:first-child{
    margin-top:0;
  }
  &:last-child {
    padding-bottom: 4vw;
  }
  .img{
    width:100%;
    // height:40vw;
    max-height:137px;
    overflow:hidden;
    img {
      width: 100%;
    }
  }
  
  .title {
    font-size: 4.2vw;
    font-weight:500;
    padding-top:1.2vw;
    padding-bottom: 1vw;
  }
  .type {
    margin-bottom: 1vw;
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
  }
  .price-sign {
    font-size: 3.6vw;
    display: flex;
    justify-content: space-between;
    .price {
      span:last-child {
        color: @theme-color;
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
</style>

