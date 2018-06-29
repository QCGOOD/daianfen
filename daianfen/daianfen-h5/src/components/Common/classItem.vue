<template>
  <div class="summary-item white">
    <div class="img">
      <img v-if="item.iconUrl" :src="imgHost+item.iconUrl" alt="">
      <img v-else src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAuCAMAAABgZ9sFAAAAVFBMVEXx8fHMzMzr6+vn5+fv7+/t7e3d3d2+vr7W1tbHx8eysrKdnZ3p6enk5OTR0dG7u7u3t7ejo6PY2Njh4eHf39/T09PExMSvr6+goKCqqqqnp6e4uLgcLY/OAAAAnklEQVRIx+3RSRLDIAxE0QYhAbGZPNu5/z0zrXHiqiz5W72FqhqtVuuXAl3iOV7iPV/iSsAqZa9BS7YOmMXnNNX4TWGxRMn3R6SxRNgy0bzXOW8EBO8SAClsPdB3psqlvG+Lw7ONXg/pTld52BjgSSkA3PV2OOemjIDcZQWgVvONw60q7sIpR38EnHPSMDQ4MjDjLPozhAkGrVbr/z0ANjAF4AcbXmYAAAAASUVORK5CYII=" alt="">
    </div>
    <div class="info">
      <p class="title">{{item.name}}</p>
      <div class="time-price">
        <span class="time">学员：{{item.num || 0}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
  }
}
</script>

<style lang="less" scoped>
.summary-item {
  display: flex;
  padding: 3vw 4vw;
  .img {
    width: 26vw;
    height: 22vw;
    border-radius: 2vw;
    overflow: hidden;
    flex-shrink: 0;
    margin-right: 4vw;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .info {
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    .title {
      font-size: 4vw;
      line-height: 1.4;
    }
    .time-price {
      display: flex;
      justify-content: space-between;
      padding-top: 1vw;
      .time {
        color: @gray-color;
        font-size: 3.6vw;
      }
    }
  }
}
</style>

