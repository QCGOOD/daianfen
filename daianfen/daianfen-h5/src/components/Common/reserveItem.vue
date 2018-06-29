<template>
  <div class="reserve-item" :class="{'new-reverse': item.isRead <= 0 && item.state == 1}" @click="jumpPage(item)">
    <div class="left img">
      <img v-if="item.img_url" :src="item.img_url" alt="">
      <img v-else src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAuCAMAAABgZ9sFAAAAVFBMVEXx8fHMzMzr6+vn5+fv7+/t7e3d3d2+vr7W1tbHx8eysrKdnZ3p6enk5OTR0dG7u7u3t7ejo6PY2Njh4eHf39/T09PExMSvr6+goKCqqqqnp6e4uLgcLY/OAAAAnklEQVRIx+3RSRLDIAxE0QYhAbGZPNu5/z0zrXHiqiz5W72FqhqtVuuXAl3iOV7iPV/iSsAqZa9BS7YOmMXnNNX4TWGxRMn3R6SxRNgy0bzXOW8EBO8SAClsPdB3psqlvG+Lw7ONXg/pTld52BjgSSkA3PV2OOemjIDcZQWgVvONw60q7sIpR38EnHPSMDQ4MjDjLPozhAkGrVbr/z0ANjAF4AcbXmYAAAAASUVORK5CYII=" alt="">
    </div>
    <div class="info">
      <p class="name">{{item.member_name}}（{{item.phone_no}}）</p>
      <p class="time">{{item.reservation_time}}</p>
      <p class="date">{{item.reservation_date}}</p>
    </div>
    <div class="right">
      <i class="iconfont icon-you"></i>
    </div>
  </div>
</template>

<script>
export default {
  components: {

  },
  props: {
    item: Object,
    type: String
  },
  methods: {
    jumpPage(item) {
      if(!item) return;
      let obj = {id: item.id, state: item.state};
      sessionStorage.setItem('itemScroll', JSON.stringify(obj))
      this.$router.push(`/index/detail?id=${item.id}&memberId=${item.member_id}`)
    }
  }
};
</script>

<style lang="less" scoped>
.new-reverse{
  &::before{
    content: ' ';
    position: absolute;
    top: 4vw;
    left: 4vw;
    width: 5px;
    height:5px;
    background-color: @theme-color;
    border-radius: 100%;
    z-index:2;
  }
}
.reserve-item {
  display: flex;
  padding: 3vw 0;
  position: relative;
  justify-content: space-around;
  align-items: center;
  border-bottom:1px solid #eee;
  background-color: #fff;
  &:last-child{
    border-bottom: 0;
  }
  .img {
    width: 12vw;
    height: 12vw;
    border-radius:50%;
    margin-right: 10px;
    flex-shrink: 0;
    overflow: hidden;
    margin-left:3vw;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .info {
    flex: 1;
    .time {
      font-size:3.6vw;
      color:#707070;
    }
    .date {
      color:#808080;
      font-size:3.4vw;
    }
  }
  .right{
    margin-right: 4vw;
    color:#999;
  }
}
</style>
