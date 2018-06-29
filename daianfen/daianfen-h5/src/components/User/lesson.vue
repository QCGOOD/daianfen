<template>
  <div class="lesson-wrap">
    <div class="lesson" :style="{'min-height': `${height - qcHeight}px`}">
      <div class="btn-bar" :class="{'choice-schedule': type ==2}">
        <div :class="{active: type == 1}" @click="choiceType(1)">日历</div>
        <div :class="{active: type == 2}" @click="choiceType(2)">日程</div>
      </div>
      <calendar v-show="type == 1" class="calendar"></calendar>
      <!-- :style="{'height': `${height - qcHeight}px`,}" -->
      <schedule v-show="type == 2" :domHeight="height" 
       class="schedule"></schedule>
    </div>
    <qc ref="qc"></qc>
  </div>
</template>
<script>
import calendar from "./calendar";
import schedule from "./schedule";
import qc from "../Common/qc";
export default {
  components: {
    calendar, schedule, qc
  },
  data () {
    return {
      height: 0,
      qcHeight: 0,
      type: 1
    }
  },
  created() {

  },
  mounted () {
    this.getHeight()
    window.onresize = () => {
      this.getHeight();
    }
  },
  methods: {
    choiceType(val) {
      this.type = val;
    },
    getHeight() {
      this.height = window.innerHeight;
      this.qcHeight = this.$refs.qc.height;
      console.log(this.qcHeight)
    }
  }
}
</script>

<style lang="less" scoped>
.lesson{
  position:relative;
  overflow:hidden;
  .calendar{
    padding-top:4vw;
    background:#fff;
  }
  .schedule{
    padding-top:13vw;
    box-sizing:border-box;
  }
  .btn-bar{
    position:absolute;
    top:3vw;
    right:4vw;
    z-index:2;
    // background:yellow;
    div{
      display:inline-block;
      border-radius:20vw;
      height:4.5vw;
      background:#fff;
      border:1px solid @gray-color;
      // box-sizing:border-box;
      font-size:3.9vw;
      color:@gray-color;
      line-height:5vw;
      padding:5px 3.5vw;
      margin-left:2vw;
    }
    .active{
      background:@red-color;
      border-color:@red-color;
      color: #fff;
    }
  }
  .choice-schedule{
      display:flex;
      justify-content: flex-end;
      padding-right:4vw;
      width:100vw;
      background:#fff;
      right:0;
      border-bottom:1px solid @light-color;
      // box-shadow: 0 4px 5px 0 @light-color;
      padding-bottom:3vw;
    }
}

</style>