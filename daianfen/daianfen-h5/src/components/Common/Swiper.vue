<template>
  <div class="picture">
    <swiper>
      <swiper-item class="swiper-item-img" v-for="(item, index) in imgs" :key="index" @click.native="goDetail(item.href)">
        <img :src="`${imgCut}${item.url}${cutParam2}`" >
        <div class="title">
          <p style="width:100%">{{item.name}}</p>
        </div>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
import { Swiper, SwiperItem } from "vux";

export default {
  components: {
    Swiper,
    SwiperItem
  },
  props: {
    imgs: Array
  },
  methods: {
    goDetail(url) {
      location.href = url;
    },
  }
};
</script>

<style lang="less">
.vux-slider > .vux-swiper > .vux-swiper-item > a > .vux-img {
  background-size: 100% !important;
}
.swiper-item-img {
  position: relative;
  img {
    width: 100%;
  }
  .title {
    position: absolute;
    bottom: 0;
    background: rgba(51, 51, 51, 0.58);
    width: 100%;
    padding: 10px 0 10px 10px;
    color: #fff;
    p {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>