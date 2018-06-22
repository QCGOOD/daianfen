<template>
  <!-- <inline-calendar></inline-calendar> -->
  <div id="calendar" :style="{'width': `${domWidth}px`}">
    <!-- 年份 月份 -->
    <div class="month">
      <ul>
        <!--点击会触发pickpre函数，重新刷新当前日期 @click(vue v-on:click缩写) -->
        <li class="arrow el-icon-caret-left" @click="pickPre(currentYear,currentMonth)"></li>
        <li class="year-month">
          <span class="choose-year">{{ currentYear }}</span>
          <i>/</i>
          <span class="choose-month">{{ currentMonth }}</span>
        </li>
        <li class="arrow el-icon-caret-right" @click="pickNext(currentYear,currentMonth)"></li>
      </ul>
      <el-button type="primary" size="mini" @click="pickMonth">本月</el-button>
    </div>
    <!-- 星期 -->
    <ul class="weekdays">
      <li>一</li>
      <li>二</li>
      <li>三</li>
      <li>四</li>
      <li>五</li>
      <li>六</li>
      <li>日</li>
    </ul>
    <!-- 日期 -->
    <ul class="days">
      <li v-for="(dayobject, index) in days" :key="index" @click="pickDay(dayobject.day.getDate())">
        <!--本月-->
        <!--如果不是本月  改变类名加灰色-->
        <span v-if="dayobject.day.getMonth()+1 != currentMonth" class="other-month"></span>
        <!-- {{ dayobject.day.getDate() }} -->
        <!--如果是本月  还需要判断是不是这一天-->
        <span v-else>
          <span 
          :class="{
            'currentDay': currentDate == `${currentYear}-${currentMonth}-${dayobject.day.getDate()}`,
            'dot': lessonDay[`${currentYear}-${currentMonth}-${dayobject.day.getDate()}`]
            }" >{{ dayobject.day.getDate() }}</span>
        </span>
      </li>
    </ul>
    <div class="lunar">
      <span v-if="currentDate == `${currentYear}-${currentMonth}-${new Date().getDate()}`">今天</span>
      <span v-else>{{currentDate}}</span>
      <span style="padding:0 10px;">农历</span>
      <span>{{ lunar }}</span>
    </div>
  </div>
  
  <!-- <div class="lesson">
    <div class="lesson-item" v-for="(item, index) in 5" :key="index">
      <span class="lesson-name">课程： 《一不小心进了艺术圈》曹启泰的10堂艺术课</span>
      <div class="lesson-time">
        <span>08:00</span>
        <span>11:00</span>
      </div>
    </div>
  </div> -->
  <!-- </div> -->
</template>
<script>
import lunar from '@/util/lunar.js'
import api from "api/common.js";
export default {
  props: {
    domWidth: {
      type: Number,
      default: 400,
    }
  },
  data () {
    return {
      currentDay: 1,
      currentMonth: 1,
      currentYear: 1970,
      currentWeek: 1,
      days: [],
      currentDate: '',
      lunar: '',
      searchData: {
        startTime: '',
        sourceType: 3
      },
      scheduleList: [],
      lessonDay: {}
    }
  },
  watch: {
    'currentMonth'() {
      // console.log(1111, this.searchData.startTime)
      this.searchData.startTime = `${this.currentYear}-${this.currentMonth <10?'0'+this.currentMonth: this.currentMonth}`
      this.getScheduleList()
      this.$emit('pick-day', this.searchData.startTime);
    }
  },
  created() {
    let that = this;
    this.initData(null);
    let lunarDate = lunar.solar2lunar();
    this.lunar = lunarDate.IMonthCn+lunarDate.IDayCn
    let now = new Date();
    this.currentDate = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`;
    this.searchData.startTime = `${this.currentYear}-${this.currentMonth < 10 ? '0'+this.currentMonth : this.currentMonth}`
    // this.getScheduleList()
  },
  methods: {
    getScheduleList() {
      api.getScheduleList(this.searchData)
      .then(res => {
        console.log('日程====',res.data.data.list)
        let lessonDay = {};
        let dateArr = []
        this.scheduleList = res.data.data.list
        res.data.data.list.map((item, i) => {
          dateArr.push(item.startTime.substr(0,10))
          
          dateArr[i] = dateArr[i].replace(/-0/g,'-')
          let ke = `${dateArr[i]}`
          lessonDay[ke] = {}
        })
        this.lessonDay = lessonDay;
        console.log('包装后的日期',lessonDay)
      })
    },
    initData (cur) {
      let that = this;
      let leftcount = 0; //存放剩余数量
      let date;
      if (cur) {
        date = new Date(cur);
      } else {
        let now = new Date();
        let d = new Date(that.formatDate(now.getFullYear(), now.getMonth(), 1));
        d.setDate(37);
        date = new Date(that.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
      }
      that.currentDay = date.getDate();
      that.currentYear = date.getFullYear();
      that.currentMonth = date.getMonth() + 1;
      // that.currentDate = `${that.currentYear}-${that.currentMonth}-1`
      that.currentWeek = date.getDay(); // 1...6,0
      if (that.currentWeek == 0) {
          that.currentWeek = 7;
      }
      let str = that.formatDate(that.currentYear, that.currentMonth, that.currentDay);
      that.days.length = 0;
      // 今天是周日，放在第一行第7个位置，前面6个
      //初始化本周
      for (let i = that.currentWeek - 1; i >= 0; i--) {
        let d = new Date(str);
        d.setDate(d.getDate() - i);
        let dayobject = {}; //用一个对象包装Date对象  以便为以后预定功能添加属性
        dayobject.day = d;
        that.days.push(dayobject); //将日期放入data 中的days数组 供页面渲染使用
      }
      //其他周
      for (let i = 1; i <= 42 - that.currentWeek; i++) {
        let d = new Date(str);
        d.setDate(d.getDate() + i);
        let dayobject = {};
        dayobject.day = d;
        that.days.push(dayobject);
      }
    },
    pickPre(year, month) {
      let that = this;
      // setDate(0); 上月最后一天
      // setDate(-1); 上月倒数第二天
      // setDate(dx) 参数dx为 上月最后一天的前后dx天
      let d = new Date(that.formatDate(year, month, 1));
      d.setDate(0);
      that.initData(that.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
    },
    pickNext: function (year, month) {
      // console.log(this.currentDay, this.currentMonth)
      let that = this;
      let d = new Date(that.formatDate(year, month, 1));
      d.setDate(37);
      that.initData(that.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
    },
    pickYear: function (year, month) {
      // alert(year + "," + month);
    },
    // 返回 类似 2016-01-02 格式的字符串
    formatDate (year, month, day) {
      let y = year;
      let m = month;
      if (m < 10) m = "0" + m;
      let d = day;
      if (d < 10) d = "0" + d;
      return y + "-" + m + "-" + d
    },
    pickDay(val) {
      this.currentDay = val;
      this.currentDate = `${this.currentYear}-${this.currentMonth}-${val}`
      let lunarDate = lunar.solar2lunar(this.currentYear, this.currentMonth, val);
      this.lunar = lunarDate.IMonthCn+lunarDate.IDayCn
      // this.getScheduleList()
      let curDate = this.searchData.startTime+(val >= 10 ? '-'+val : '-0'+val)
      this.$emit('pick-day', curDate);
    },
    pickMonth() {
      let curDate = this.searchData.startTime
      this.$emit('pick-day', curDate);
    }
  },
}
</script>

<style lang="less" scoped>
/*日历*/

#calendar {
  width: 100%;
  // margin:0 30px;
  font-size:14px;
}

.month {
  display: flex;
  justify-content: space-between;
  margin:0 20px;
  margin-top:20px;
  ul {
    display: flex;
    align-items:center;
    font-size:16px;
    margin: 0;
    padding: 0;
    // background:#ccc;

    li {
      font-size: 14px;
      list-style: none;
    }
    .arrow{
      color:#409EFF;
      font-size:24px;
      &:hover{
        cursor: pointer;
      }
    }
  }
}

.year-month {
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}

.choose-year {
  padding-left: 20px;
}
.choose-month {
  text-align: center;
  padding-right:20px;
}

.weekdays {
  // margin: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  background:#409EFF;
  line-height: 34px;
  margin-top:20px;

  li {
    display: inline-block;
    width: 12.7%;
    text-align: center;
    font-size: 14px;
    color:#fff;
    font-weight: 200;
    margin-top:5px;
  }
}

.days {
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;

  li {
    list-style-type: none;
    display: inline-block;
    width: 14.2%;
    text-align: center;
    padding-bottom: 3px;
    padding-top: 7px;
    font-size: 14px;
    &:hover{
      cursor: pointer;
      font-size:18px;
      span span{
        color:#409EFF;
      }
    }
    span{
      display:block;
      height:100%;
      width:100%;
      // background:yellow;
      span {
        position: relative;
        display: inline-block;
        width:35px;
        height:34px;
        border-radius:50%;
        border: 1px solid transparent;
        text-align:center;
        line-height: 35px;
        // font-weight:500;
      }
      .currentDay{
        border-color: #409EFF;
        color: #409EFF;
      }
      .dot::after{
        content:'';
        position: absolute;
        left: 50%;
        bottom:2px;
        width:6px;
        height:6px;
        border-radius:50%;
        background:#409EFF;
        margin-left:-3px;
      }
    } 
    .other-month {
      color: #808080;
    }
  }
}

.lunar{
  background: #f1f1f1;
  line-height:40px;
  font-size:14px;
  padding-left:20px;
}

</style>