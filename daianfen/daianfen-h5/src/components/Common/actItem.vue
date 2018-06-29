<template>
  <div class="act-item white">
    <div class="img">
      <img :src="`${imgCut}${item.iconUrl}${cutParam1}`" alt="">
    </div>
    <div class="info">
      <p class="title">{{item.title}}</p >
      <span style="width:1px;display:inline-block"></span>
      <span class="type" v-for="(tag,i) in item.activityTagList" :key="i">{{tag.name}}</span>
      <Tag :status='item.status'></Tag>
      <div class="time-price">
        <span class="time">
        {{item.startTime | formatDate}}
        </span>
        <span class="price" v-if="item.isEnableFee">￥{{item.activityFee.price | formatPrice}}</span>
        <span class="price" v-else>免费</span>
      </div>
    </div>
  </div>
</template>

<script>
import Tag from "./tag.vue";
export default {
  components: {
    Tag
  },
  props: {
    item: Object,
    type: String
  }
};
</script>

<style lang="less" scoped>
.act-item {
  display: flex;
  padding: 0 4vw 3vw;
  position: relative;
  .img {
    width: 26vw;
    height: 21vw;
    position: relative;
    margin-right: 10px;
    flex-shrink: 0;
    overflow: hidden;
    img {
      width: 100%;
    }
  }
  .info {
    flex: 1;
    .title {
      font-size: 3.8vw;
      line-height: 5vw;
      height: 10vw;
      overflow: hidden;
    }
    .type {
      margin-right: 8px;
      padding: 0 1.5vw;
      font-size: 3.3vw;
      display: inline-block;
      border-radius: 1vw;
      color: #fff;
      background-color: rgb(211, 194, 165);
    }
    .time-price {
      display: flex;
      justify-content: space-between;
      padding-top: 1vw;
      .time {
        color: @gray-color;
        font-size: 3.4vw;
        span {
          color: @yellow-color;
          margin-left: -1vw;
        }
      }
      .price {
        color: @red-color;
        font-size: 3.6vw;
      }
      .collect {
        color: @gray-color;
        font-size: 3.4vw;
      }
    }
  }
}
</style>
