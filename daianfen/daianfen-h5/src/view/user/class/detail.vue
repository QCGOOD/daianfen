<template>
  <div class="class">
    <div class="top">
      <div class="nav">
        <button-tab :height="30">
          <button-tab-item style="font-size:3.8vw;border:1px solid rgb(226, 81, 60)"  selected @on-item-click="clickTab(2)">学习力排行</button-tab-item>
          <button-tab-item  style="font-size:3.8vw;border:1px solid rgb(226, 81, 60)" @on-item-click="clickTab(1)">影响力排行</button-tab-item>
        </button-tab>
      </div>
      <div class="user">
        <div class="rank">
          <p>{{model.num || 0}}</p>
          <p>当前排名</p>
        </div>
        <div class="img">
          <img v-if="model.headImage" :src="model.headImage" alt="">
          <img v-else src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAuCAMAAABgZ9sFAAAAVFBMVEXx8fHMzMzr6+vn5+fv7+/t7e3d3d2+vr7W1tbHx8eysrKdnZ3p6enk5OTR0dG7u7u3t7ejo6PY2Njh4eHf39/T09PExMSvr6+goKCqqqqnp6e4uLgcLY/OAAAAnklEQVRIx+3RSRLDIAxE0QYhAbGZPNu5/z0zrXHiqiz5W72FqhqtVuuXAl3iOV7iPV/iSsAqZa9BS7YOmMXnNNX4TWGxRMn3R6SxRNgy0bzXOW8EBO8SAClsPdB3psqlvG+Lw7ONXg/pTld52BjgSSkA3PV2OOemjIDcZQWgVvONw60q7sIpR38EnHPSMDQ4MjDjLPozhAkGrVbr/z0ANjAF4AcbXmYAAAAASUVORK5CYII=" alt="">
        </div>
        <div class="rank">
          <p>{{model.experienceAmount || 0}}</p>
          <p v-show="searchData.type == 1">影响力</p>
          <p v-show="searchData.type == 2">学习力</p>
        </div>
      </div>
    </div>
    <div class="ranking white">
      <div class="item" :class="[i !== 0 ? 'vux-1px-t' : '']" v-for="(item, i) in model.list" :key="i">
        <div class="left">
          <div class="sum">
            <img v-if="i === 0" src="static/image/jin.png" alt="">
            <img v-if="i === 1" src="static/image/yin.png" alt="">
            <img v-if="i === 2" src="static/image/tong.png" alt="">
            <span v-if="i > 2">{{i+1}}</span>
          </div>
          <div class="user-img">
            <img v-if="item.headImage" :src="item.headImage" alt="">
            <img v-else src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAuCAMAAABgZ9sFAAAAVFBMVEXx8fHMzMzr6+vn5+fv7+/t7e3d3d2+vr7W1tbHx8eysrKdnZ3p6enk5OTR0dG7u7u3t7ejo6PY2Njh4eHf39/T09PExMSvr6+goKCqqqqnp6e4uLgcLY/OAAAAnklEQVRIx+3RSRLDIAxE0QYhAbGZPNu5/z0zrXHiqiz5W72FqhqtVuuXAl3iOV7iPV/iSsAqZa9BS7YOmMXnNNX4TWGxRMn3R6SxRNgy0bzXOW8EBO8SAClsPdB3psqlvG+Lw7ONXg/pTld52BjgSSkA3PV2OOemjIDcZQWgVvONw60q7sIpR38EnHPSMDQ4MjDjLPozhAkGrVbr/z0ANjAF4AcbXmYAAAAASUVORK5CYII=" alt="">
          </div>
          <p>{{item.name || '匿名'}}</p>
        </div>
        <div class="right">
          <span>{{item.levelName}} | {{item.experienceAmount}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ButtonTab, ButtonTabItem } from 'vux'
import { throws } from 'assert';

export default {
  components: {
    ButtonTab, ButtonTabItem
  },
  data () {
    return {
      model: {},
      searchData: {
        courseClassId: this.$route.query.id,
        type: 2
      }
    }
  },
  created() {
    this.apiGetDetail()
  },
  methods: {
    clickTab(index) {
      if(this.searchData.type == index) return;
      console.log(index)
      this.searchData.type = index
      this.apiGetDetail()
    },
    apiGetDetail() {
      this.$http.get('/courseClass/classMemBer', this.searchData)
      .then(res => {
        this.model = res.data.data
      })
    }
  }
}
</script>

<style lang="less" scoped>
.vux-button-group > a.vux-button-tab-item-last:after{
  width:0;
  border:0;
}
.vux-button-group > a.vux-button-tab-item-first:after{
  width:0;
  border:0;
}
.class {
  .top {
    padding: 3vw 18vw;
    .user {
      margin-top: 5vw;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      .img {
        width: 15vw;
        height: 15vw;
        border-radius: 50%;
        overflow: hidden;
        border: 2px solid @red-color;
      }
      .rank {
        text-align: center;
        p {
          font-size: 3.4vw;
          color: @gray-color;
          line-height: 1.5;
          &:first-child {
            font-size: 6vw;
            font-weight: bold;
            color: #000;
          }
        }
      }
    }
  }
  .ranking {
    padding: 0 6vw;
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 4vw;
      padding: 2vw 0;
      .left {
        display: inline-flex;
        align-items: center;
        .sum {
          display: inline-flex;
          align-items: center;
          width: 5vw;
          flex-shrink: 0;
          margin-right: 3vw;
          text-align: center;
          color: @red-color;
        }
        .user-img {
          width: 9vw;
          height: 9vw;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
          margin-right: 3vw;
        }
      }
      .right{
        display: inline-flex;
        align-items: center;
        color: @gray-color;
        font-size:3.6vw;
      }
    }
  }
}
</style>
