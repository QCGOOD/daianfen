<template>
  <div class="calendar-wrap">
    <div id="calendar" ref="calendar">
      <!-- 年份 月份 -->
      <ul class="month" style="background:url('	http://athena-1255600302.cosgz.myqcloud.com/attachments/activity/914c0b0cac894963a99e55b8f0d6e5c8.jpg') no-repeat top;background-size:100%">
        <!--点击会触发pickpre函数，重新刷新当前日期 @click(vue v-on:click缩写) -->
        <li class="arrow iconfont icon-sanjiaoxing-left" @click="pickPre(currentYear,currentMonth)"></li>
        <!-- <li class="year-month">
          <span class="choose-year">{{ currentYear }}</span>
          <i>/</i>
          <span class="choose-month">{{ currentMonth }}</span>
        </li> -->
        <li class="year-month">
          <span class="choose-month">{{ currentMonth > 10 ? currentMonth : '0'+currentMonth }}月</span>
          <span class="choose-year">{{ currentYear }} {{lunarYear}}年</span>
        </li>
        <li class="arrow iconfont icon-sanjiaoxing-right" @click="pickNext(currentYear,currentMonth)"></li>
      </ul>
      <!-- 星期 -->
      <ul class="weekdays" style="display:none;">
        <li>日</li>
        <li>一</li>
        <li>二</li>
        <li>三</li>
        <li>四</li>
        <li>五</li>
        <li>六</li>
      </ul>
      <!-- 日期 -->
      <ul class="days" style="display:none;">
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
    </div>
    <div class="lunar" style="display:none;">
      <span v-if="currentDate == `${currentYear}-${currentMonth}-${new Date().getDate()}`">今天</span>
      <span v-else>{{currentDate}}</span>
      <span style="padding:0 2vw;">农历</span>
      <span>{{ lunar }}</span>
    </div>
    <scroller lock-x class="data-list" :height="`-${headerHeight}px`">
      <!-- :style="{ 'height': `${listHeight}px`}" :on-infinite="loadMore" :on-refresh="refresh" -->
      <div v-show="scheduleList.length > 0">
        <div class="data-item" :ref="item.day" v-for="item in scheduleList" :key="item.id">
          <div class="data-item-left">
            <span class="day">{{item.day}}</span>
            <span style="display:block;margin-top:-1vw;">{{item.week}}</span>
          </div>
          <div class="data-item-right">
            <span style="font-size:3.4vw;color:#808080;">{{item.date}}</span>
            <div class="data-item-list">
                <ul>
                  <li v-for="l in item.list" :key="l.id">
                    <div class="title">{{l.title}}</div>
                    <div class="footer">
                      <span class="time">{{l.startTime.substr(10, 6)+' - '+l.endTime.substr(10,6)}}</span>
                      <span class="type" v-if="l.activityTagList.length > 0" v-for="tag in l.activityTagList" :key="tag.id">{{tag.name}}</span>
                    </div>
                  </li>
                </ul>
            </div>
          </div>
        </div>
      </div>
      <div v-show="!scheduleList.length > 0" class="null">暂无数据</div>
    </scroller>
  </div>
</template>
<script>
import lunar from '../../util/lunar.js'
import { setTimeout } from 'timers';
import { Scroller } from "vux";
export default {
  components: {
    Scroller
  },
  data () {
    return {
      height: 0,
      headerHeight:0,
      listHeight: 0,
      currentDay: 1,
      currentMonth: 6,
      currentYear: 2018,
      currentWeek: 1,
      backgroundImage: '',
      days: [],
      currentDate: '',
      lunar: '',
      lunarYear: '',
      searchData: {
        startTime: '',
        // pageNum: 1,
        // pageSize: 10
      },
      day: 30,
      noData: true,
      list: [],
      scheduleList: [],
      lessonDay: {}
    }
  },
  created() {
    let that = this;
    this.initData(null);
    let now = new Date();
    this.currentDate = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`;
    this.searchData.startTime = `${this.currentYear}-${this.currentMonth < 10 ? '0'+this.currentMonth : this.currentMonth}`
    this.apiGetActiveList()
  },
  mounted() {
    this.getHeight()
    window.onresize = () => {
      this.getHeight();
    }
  },
  methods: {
    getHeight() {
      this.height = window.innerHeight;
      this.headerHeight = this.$refs.calendar.clientHeight
      this.listHeight = this.height - this.headerHeight
    },
    apiGetActiveList() {
      this.$vux.loading.show()
      this.$http.get("/activity/page", this.searchData).then(res => {
        console.log('活动列表', res.data.data)
        // 重新包装数据格式
        let newList = [];
        res.data.data.list.map((item, i) => {
          let startTime = item.startTime.substr(0,10)
          let endTime = item.startTime.substr(0,10)
          let date = `${this.monthDay(item.startTime)} - ${this.monthDay(item.endTime)}`
          // 设置周
          let lunarDate = lunar.solar2lunar(item.startTime.substr(0, 4), item.startTime.substr(5, 2), item.startTime.substr(8, 2))
          let week = '周'+lunarDate.ncWeek.substr(2,1)
          newList.push({
            day: item.startTime.substr(8,2),
            startTime: item.startTime.substr(0, 10),
            endTime: item.endTime.substr(0, 10),
            week: week,
            date: date,
            list: []
          })
          newList.map((label, j) => {
            // 开始日期是同一天，就放入同一个列表
            if (label.startTime === startTime) {
              newList.splice(j+1, 1)
              label.list.push(item)
              // 谁的结束日期大，就显示谁的
              let date1 = Date.parse(new Date(label.endTime))
              let date2 = Date.parse(new Date(endTime))
              if(date1 >= date2)label.date = `${this.monthDay(item.startTime)} - ${this.monthDay(label.endTime)}`
              else label.date = `${this.monthDay(item.startTime)} - ${this.monthDay(endTime)}`
            }
          })
        })
        this.scheduleList = newList
        
        this.$nextTick(() => {
          this.setScrollTop()
        })
      }).finally(() => {
        this.$vux.loading.hide()
      });
    },
    // 滚动到最近的日期
    setScrollTop(curDate) {
      let days = [], isBbreak = false;
      let now = new Date()
      if(!curDate) {
        curDate = `${now.getUTCFullYear()}-${now.getMonth()+1}`
      }
      // 获取日程的天 包装成数组
      this.scheduleList.map((item) => {
        days.push(JSON.parse(JSON.stringify(item.day)))
      })
      // for (let i = now.getDate(); i <= 31; i++) {
        let d = new Date(curDate);
        d.setDate(d.getDate()+now.getDate()-1);
        let curDay = d.getDate() >= 10 ? d.getDate() : '0'+d.getDate()
        // 依次判断 距离最近的日程 滚动到该处
        
        for(let j = 0; j<days.length; j++) {
          // console.log('滚动到======》', curDay, days[j])
          if( curDay <= days[j] ){
            
            this.$nextTick(() => {
              console.log(1, days[j])
              let el = document.querySelector(".xs-container");
              let setScrollTop = this.$refs[`${days[j]}`][0].offsetTop;
              if(setScrollTop > (el.clientHeight - this.listHeight)){
                setScrollTop = el.clientHeight - this.listHeight
              }
              el.style.transform = `translateY(-${setScrollTop}px)`
            })
            // 跳出外部循环
            isBbreak = true
            // 跳出当前循环
            break;
          }else if(j == days.length - 1){
            this.$nextTick(() => {
              console.log('没匹配到')
              // console.log(this.$refs[`${days[j]}`][0].offsetTop)
              let el = document.querySelector(".xs-container");
              let setScrollTop = el.clientHeight - this.listHeight;
              console.log(el.clientHeight - this.listHeight)
              el.style.transform = `translateY(-${setScrollTop}px)`
            })
          }
        }
        // if (isBbreak) break;
      // }
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
      // 今天是周二，放在第一行第3个位置，前面2个
      //初始化本周
      for (let i = that.currentWeek; i >= 0; i--) {
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
    // 接受2018-05-02格式，返回 类似 05月02日 格式的字符串
    monthDay(str) {
      return `${str.substr(5, 2)}月${str.substr(8, 2)}日`
    },
    // 设置农历
    getLunar(year, month, day) {
      let lunarDate = lunar.solar2lunar(year, month, day)
      this.lunarYear = lunarDate.gzYear
      this.lunar = lunarDate.IMonthCn+lunarDate.IDayCn
    },
    pickDay(val) {
      this.currentDay = val;
      this.currentDate = `${this.currentYear}-${this.currentMonth}-${val}`
      this.getLunar(this.currentYear, this.currentMonth, val);
      // this.getScheduleList()
    },
    loadMore(done) {
      // if(this.noData) {
      //   console.log('上拉')
      //   this.$nextTick(() => {
      //     this.$refs.myScroller.finishInfinite(2);
      //   })
      //   return;
      // }
      
      // let self = this;
      // let start = this.list.length;
      // let list = this.list,
      //     page = this.searchData.pageNum,
      //     size = this.searchData.pageSize;
      // 总页数
      // let totalPage = total % size == 0 ? total / size : Math.ceil(total / size) ;
      // // console.log(original,list,resData)
      // if(page == 1) list = [];
      
      // if(page >= totalPage){
      //   this.arr = list.concat(resData);
      //   this.noData = true;
      // }else{
      //   this.arr = list.concat(resData);
      //   this.noData = false;
      //   this.searchData.pageNum = page + 1;
      // }
      // setTimeout(() => {
      //   self.$refs.myScroller.resize();
      //   done()
      // }, 1500)
    },
  },
  filters: {
    type(val) {
      if(val == 1) return '活动'
      if(val == 3) return '课程'
    }
  },
  watch: {
    'currentMonth'() {
      let date = this.currentDate.split('-')
      this.getLunar(...date)
      this.searchData.startTime = `${this.currentYear}-${this.currentMonth < 10 ? '0'+this.currentMonth : this.currentMonth}`
      this.apiGetActiveList()
      // setTimeout(() => {
      //   this.setScrollTop(this.searchData.startTime);
      // })
    }
  }
}
</script>

<style lang="less" scoped>
.null{
  text-align: center;
  color: #808080;
  font-size: 15px;
  margin-top: 40vh;
}

/*日历*/

#calendar {
  width: 100%;
  box-sizing: border-box;
}

.month {
  display: flex;
  // justify-content: center;
  background-color:#f2f2f2;
  align-items:center;
  height:30vw;
  font-size:3.6vw;
  color:#fff;
  margin: 0;
  // padding: 0;
  padding-left:4vw;

  li {
    font-size: 3.8vw;
    list-style: none;
  }
  .arrow{
    // color:@red-color;
    font-size:3.6vw;
    // background:red;
  }
}

.year-month {
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin:0 2vw 0;
}

.choose-year {
  margin-top:-2vw;
}
.choose-month {
  text-align: center;
  font-size:7vw;
  margin-top:4vw;
  padding:0;
}

.weekdays {
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  line-height: 34px;
  // padding-top:4vw;

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
  // padding:0 3vw;

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

.data-list{
  // padding:2vw 0;
  // padding-bottom:3vw;
  background:#fff;
  .data-item{
    position:relative;
    display:flex;
    justify-content: space-around;
    // padding:3vw 0;
    padding-top:3vw;
    &:last-child{
      padding-bottom:3vw;
    }
    .data-item-left{
      text-align: center;
      font-size:3.4vw;
      margin:0 6vw;
      .day{
        display: block;
        font-size:5vw;
        margin-top:2vw;
      }
    }
    .data-item-right{
      flex:1;
      .data-item-list{
        font-size:3.4vw;
        margin-right:6vw;
        background: #f2f2f2;
        ul{
          list-style: none;
          padding:3vw;
          li{
            padding-bottom:2vw;
            &:last-child{
              padding-bottom:0;
            }
            .title{
              word-break: break-all;
            }
            .footer{
              display: flex;
              justify-content: flex-start;
              align-items: center;
              flex-wrap: wrap;
              .time{
                flex:1;
                font-size:3.4vw;
                color:#808080;
              }
              .type{
                background-color: rgb(211, 194, 165);
                display: inline-block;
                padding: 0 2vw;
                color: #fff;
                border-radius: 1vw;
                font-size: 3.4vw;
                height: 5vw;
                line-height: 5vw;
                margin-right: 2vw;
                margin-bottom:1vw;
                &:last-child{
                  margin-right:0;
                }
              }
            }
            
          }
        }
        span{
          display: block;
        }
      }
    }
    
  }
}


</style>