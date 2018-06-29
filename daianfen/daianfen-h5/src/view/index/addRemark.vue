<template>
  <div class="wrap">
    <div class="content" ref="content">
      <!-- 用户信息 -->
      <div class="user">
        <div class="img">
          <img v-if="detail.imgUrl" :src="detail.imgUrl" alt="">
          <img v-else src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAuCAMAAABgZ9sFAAAAVFBMVEXx8fHMzMzr6+vn5+fv7+/t7e3d3d2+vr7W1tbHx8eysrKdnZ3p6enk5OTR0dG7u7u3t7ejo6PY2Njh4eHf39/T09PExMSvr6+goKCqqqqnp6e4uLgcLY/OAAAAnklEQVRIx+3RSRLDIAxE0QYhAbGZPNu5/z0zrXHiqiz5W72FqhqtVuuXAl3iOV7iPV/iSsAqZa9BS7YOmMXnNNX4TWGxRMn3R6SxRNgy0bzXOW8EBO8SAClsPdB3psqlvG+Lw7ONXg/pTld52BjgSSkA3PV2OOemjIDcZQWgVvONw60q7sIpR38EnHPSMDQ4MjDjLPozhAkGrVbr/z0ANjAF4AcbXmYAAAAASUVORK5CYII=" alt="">
        </div>
        <p>{{detail.memberName}} <span v-if="detail.phoneNo">({{detail.phoneNo}})</span></p>
      </div>
      <!-- 文胸尺寸 -->
      <div class="bar section">
        <p>文胸尺寸</p>
        <div>
          <span class="size-item" :class="{'active': barActive == i}" @click="pickBar(item, i)" v-for="(item, i) in barList" :key="i">{{item}}</span>
        </div>
      </div>
      <!-- 内裤尺寸 -->
      <div class="panty section">
        <p>内裤尺寸</p>
        <div>
          <span class="size-item" :class="{'active': pantyActive == i}" @click="pickPanty(item, i)" v-for="(item, i) in pantyList" :key="i">{{item}}</span>
        </div>
      </div>
      <div class="addRemark">
        <group>
          <x-textarea :max="100" name="description" v-model="model.remark" autosize placeholder="请输入您的备注信息"></x-textarea>
        </group>
      </div>
      <div class="bottom-btn">
        <x-button class="btn comfirm" type="warn" @click.native="comfirm">完成</x-button>
        <x-button class="btn cancel" type="warn" @click.native="cancel">取消</x-button>
      </div>
      <qc></qc>
    </div>
  </div>
</template>
<script>
import { Divider, XTextarea, Group, XButton  } from 'vux'
import ReserveItem from "@/components/Common/reserveItem";
import { setTimeout } from 'timers';
export default {
  components: {
    Divider, XTextarea, Group, XButton
  },
  data() {
    return {
      model: {
        reservationId: this.$route.query.id,
        barSize: '70A',
        pantySize: 'M',
        remark: '',
      },
      barActive: 0,
      pantyActive: 1,
      barList: [
        '70A', '70B', '70C', '70D', '70E',
        '75A', '75B', '75C', '75D', '75E',
        '80A', '70B', '70C', '80D', '80E',
        '75A', '85B', '80C', '85D', '85E',
        '90A', '90B', '90C', '90D', '90E',
        '95A', '95B', '95C', '95D', '95E',
      ],
      pantyList: ['S', 'M', 'L', 'EL', 'EEL'],
      detail: {},
    };
  },
  created() {
    // this.search()
    this.apiGetDetail()
    // this.apiGetMark()
  },
  methods: {
    apiGetDetail(data) {
      // 查看详情
      this.$http.get('/reservation/details', {id: this.$route.query.id})
      .then(res => {
        this.detail = res.data.content0
      })
    },
    apiInsert(data) {
      // 添加备注
      this.$http.post('/reservation/addRemark', data)
      .then(res => {
        this.toast('添加成功')
        setTimeout(() => {
          this.$router.go(-1)
        }, 500)
      })
    },
    comfirm() {
      this.apiInsert(this.model)
    },
    cancel() {
      this.$router.go(-1)
    },
    jumpPage(url) {
      if (!url) return false;
      this.$router.push(url)
    },
    pickBar(item, i) {
      console.log(item)
      if(this.barActive == i) return false;
      this.model.barSize = item;
      this.barActive = i;
    },
    pickPanty(item, i) {
      console.log(item)
      if(this.pantyActive == i) return false;
      this.model.pantySize = item;
      this.pantyActive = i;
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

}
.content{
  .user{
    display: flex;
    align-items: center;
    overflow: hidden;
    padding: 3vw;
    .img{
      width: 13vw;
      height: 13vw;
      background-color: #f2f2f2;
      border-radius: 50%;
      margin-right: 3vw;
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
        color: rgb(27, 10, 10);
      }
    }
  }
  // 文胸
  .section{
    p{
      line-height: 2.5;
    }
    margin:3vw;
    .size-item{
      display: inline-block;
      width: 15.4vw;
      height: 6.667vw;
      font-size: 3.467vw;
      text-align: center;
      line-height: 6.667vw;
      color: #555;
      border: 1px solid #808080;
      border-radius: 2px;
      margin-bottom: 2.667vw;
      margin-right: 3.4vw;
    }
    .size-item:nth-child(5n){
      margin-right: 0;
    }
  }
  .textarea{
    margin: 3vw;
    background: #f2f2f2;
    border-radius: 1.5vw;
  }
  .bottom-btn{
    margin: 7vw 3vw 4vw;
  }
}
// 选中状态，
.active{
  position: relative;
  border-color: @theme-color !important;
  color: @theme-color !important;
  &::after{
    content: "";
    position: absolute;
    top: 0;
    right: -1px;
    height: 0;
    width: 0;
    // border-top: 4vw solid #0f9f20;
    border-top: 4vw solid @theme-color;
    border-right: 4vw solid transparent;
    border-bottom: 4vw solid transparent;
    transform: rotateY(180deg);
    color: #fff;
  }
  &::before{
    content: "√";
    position: absolute;
    top: -1.867vw;
    right: 1px;
    font-size: 2.667vw;
    color: #fff;
    z-index: 111;;
  }
}
</style>
