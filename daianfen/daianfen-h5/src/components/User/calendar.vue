<template>
  <div class="calendar-wrap">
    <div id="calendar">
      <!-- 年份 月份 -->
      <div class="month">
        <ul>
          <!--点击会触发pickpre函数，重新刷新当前日期 @click(vue v-on:click缩写) -->
          <li class="arrow iconfont icon-sanjiaoxing-left" @click="pickPre(currentYear,currentMonth)"></li>
          <li class="year-month">
            <span class="choose-year">{{ currentYear }}</span>
            <i>/</i>
            <span class="choose-month">{{ currentMonth }}</span>
          </li>
          <li class="arrow iconfont icon-sanjiaoxing-right" @click="pickNext(currentYear,currentMonth)"></li>
        </ul>
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
        <span style="padding:0 2vw;">农历</span>
        <span>{{ lunar }}</span>
      </div>
    </div>
    
    <div class="lesson">
      <div class="lesson-item" v-for="(item, index) in scheduleList" :key="index">
        <span class="lesson-name">{{item.title}}</span>
        <div class="lesson-time">
          <span>{{item.startTime.substr(11,5)}}</span>
          <span>{{item.endTime.substr(11,5)}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import lunar from '../../util/lunar.js'
export default {
  components: {

  },
  data () {
    return {
      currentDay: 1,
      currentMonth: 6,
      currentYear: 2018,
      currentWeek: 1,
      days: [],
      currentDate: '',
      lunar: '',
      searchData: {
        startTime: ''
        // pageNum: 1,
        // pageSize: 10
      },
      scheduleList: [],
      lessonDay: {}
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
    this.getScheduleList()
  },
  methods: {
    getScheduleList() {
      this.$http
      .get('/memberCalendarEvent/page', this.searchData)
      .then(res => {
        console.log('日程====',res.data.data.list)
        let lessonDay = {};
        let dateArr = []
        this.scheduleList = res.data.data.list
        res.data.data.list.map((item, i) => {
          dateArr = item.startTime.substr(0,10)
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
      // console.log(this.currentYear, this.currentMonth, val,lunarDate)
      this.getScheduleList()
    }
  }
}
</script>

<style lang="less" scoped>
/*日历*/
.calendar-wrap{
  background:#fff;
}
#calendar {
  width: 94vw;
  margin:0 3vw;
  
}

.month {
  margin-left: 2vw;
  ul {
    display: flex;
    align-items:center;
    font-size:3.6vw;
    margin: 0;
    padding: 0;

    li {
      font-size: 3.8vw;
      list-style: none;
    }
    .arrow{
      color:@red-color;
      font-size:3.6vw;
    }
  }
}

.year-month {
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}

.choose-year {
  padding-left: 5vw;
}
.choose-month {
  text-align: center;
  padding-right:5vw;
}

.weekdays {
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  line-height: 34px;
  padding-top:4vw;

  li {
    display: inline-block;
    width: 12.7%;
    text-align: center;
    font-size: 3.6vw;
    color:@gray-color;
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
    font-size: 3.4vw;
    span{
      display:block;
      height:100%;
      width:100%;
      // background:yellow;
      span {
        position: relative;
        display: inline-block;
        width:7vw;
        height:7vw;
        border-radius:50%;
        border: 1px solid transparent;
        text-align:center;
        line-height: 7.5vw;
        // font-weight:500;
      }
      .currentDay{
        // color:#fff;
        border-color: @red-color;
        color: @red-color;
      }
      .dot::after{
        content:'';
        position: absolute;
        left: 50%;
        bottom:0.4vw;
        width:4px;
        height:4px;
        border-radius:50%;
        background:@red-color;
        margin-left:-2px;
      }
    } 
    .other-month {
      color: #808080;
    }
  }
}

.lunar{
  background: @active-color;
  line-height: 9vw;
  font-size:3.6vw;
  padding-left:5vw;
}

.lesson{
  // padding:2vw 0;
  padding-bottom:3vw;
  .lesson-item{
    position:relative;
    display:flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid @active-color;
    padding:3vw 0;
    margin-left:8vw;
    &::before{
      content: '';
      position: absolute;
      top:50%;
      left:-2vw;
      width:8px;
      height:8px;
      border-radius:50%;
      background:@red-color;
      margin-top:-4px;
    }
    .lesson-name{
      flex:1;
      font-size:3.8vw;
      margin-left:4vw;
    }
    .lesson-time{
      font-size:3.6vw;
      color:@gray-color;
      margin-right:4vw;
      margin-left:2vw;
      span{
        display: block;
      }
    }
  }
}


</style>