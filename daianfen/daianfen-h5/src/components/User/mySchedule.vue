<template>
  <div class="schedule" :style="{'height':`${height}px`}">
    <scroller v-if="scheduleList.length > 0" :on-infinite="loadMore" :on-refresh="refresh" ref="myscroller">
      <div 
        class="schedule-item" 
        @click="toDetail(item.sourceId, item.sourceType)"
        v-for="(item, index) in scheduleList" :key="index"
        :class="{ expire: date(item.endTime) == 1, today: date(item.endTime) == 2 }">
        <!-- <p class="date">{{item.startTime | dateFormat}}</p> -->
        <!-- <p class="date">{{item.endTime}}</p> -->
        <p class="lesson">{{item.title}}</p>
      </div>
    </scroller>
    <span v-else class="null">暂无数据</span>
  </div>
</template>

<script>
export default {
  data () {
    return {
      noData: true,
      height: 0,
      year: '',
      month: '',
      searchData: {
        // pageNum: 1,
        // pageSize:'',
        startTime: ''
      },
      scheduleList: [
        // {id: '123456', sourceType: 1, startTime: '2018.05.16 08:00', endTime: '2018-05-20 23:00', title: '课程 《一不小心进了艺术圈》曹启泰的10唐艺术课堂'},
        // {id: '123456', sourceType: 1, startTime: '2018.05.16 08:00', endTime: '2018-05-21 23:00', title: '课程 《一不小心进了艺术圈》曹启泰的10唐艺术课堂'},
        // {id: '123456', sourceType: 1, startTime: '2018.05.16 08:00', endTime: '2018-05-22 23:00', title: '课程 《一不小心进了艺术圈》曹启泰的10唐艺术课堂'},
        // {id: '123456', sourceType: 2, startTime: '2018.05.16 08:00', endTime: '2018-05-23 23:00', title: '课程 《一不小心进了艺术圈》曹启泰的10唐艺术课堂'},
        // {id: '123456', sourceType: 1, startTime: '2018.05.16 08:00', endTime: '2018-05-24 23:00', title: '课程 《一不小心进了艺术圈》曹启泰的10唐艺术课堂'},
        // {id: '123456', sourceType: 2, startTime: '2018.05.16 08:00', endTime: '2018-05-25 23:00', title: '课程 《一不小心进了艺术圈》曹启泰的10唐艺术课堂'},
        // {id: '123456', sourceType: 1, startTime: '2018.05.25 08:00', endTime: '2018-05-26 23:00', title: '课程 《一不小心进了艺术圈》曹启泰的10唐艺术课堂'},
        // {id: '123456', sourceType: 2, startTime: '2018.05.26 08:00', endTime: '2018-05-26 23:00', title: '课程 《一不小心进了艺术圈》曹启泰的10唐艺术课堂'},
        // {id: '123456', sourceType: 3, startTime: '2018.05.26 08:00', endTime: '2018-05-27 23:00', title: '课程 《一不小心进了艺术圈》曹启泰的10唐艺术课堂'},
        // {id: '123456', sourceType: 1, startTime: '2018.05.27 08:00', endTime: '2018-05-27 23:00', title: '课程 《一不小心进了艺术圈》曹启泰的10唐艺术课堂'},
        // {id: '123456', sourceType: 1, startTime: '2018.05.27 08:00', endTime: '2018-05-28 23:00', title: '课程 《一不小心进了艺术圈》曹启泰的10唐艺术课堂'},
        // {id: '123456', sourceType: 2, startTime: '2018.05.31 08:00', endTime: '2018-05-29 23:00', title: '课程 《一不小心进了艺术圈》曹启泰的10唐艺术课堂'},
        // {id: '123456', sourceType: 1, startTime: '2018.05.31 08:00', endTime: '2018-05-30 23:00', title: '课程 《一不小心进了艺术圈》曹启泰的10唐艺术课堂'},
        // {id: '123456', sourceType: 2, startTime: '2018.05.31 08:00', endTime: '2018-05-30 23:00', title: '课程 《一不小心进了艺术圈》曹启泰的10唐艺术课堂'},
        // {id: '123456', sourceType: 1, startTime: '2018.05.31 08:00', endTime: '2018-05-31 23:00', title: '课程 《一不小心进了艺术圈》曹启泰的10唐艺术课堂'},
      ],
    }
  },
  created() {
    let now = new Date();
    this.year = now.getFullYear();
    this.month = (now.getMonth()+1) < 10 ? '0'+now.getMonth()+1 : now.getMonth()+1;
    this.getScheduleList()
  },
  mounted () {
    this.getHeight()
    window.onresize = () => {
      this.getHeight();
    }
  },
  methods: {
    getHeight() {
      this.height = window.innerHeight;
    },
    toDetail(id, type) {
      console.log(type)
      if(type == 2) this.$router.push(`/curriculum/detail?id=${id}`)
      else this.$router.push(`/activity/detail?id=${id}`)
    },
    date(value) {
      console.log('data === ', value)
      // 日期
      let date = value.substr(0,10); 
      // 结束时间  
      let emdTime = value.substr(11, 5);
      let dateTime = Date.parse(new Date(date+' '+emdTime));
      // 当前时间戳
      let nowDateTime = Date.parse(new Date());
      // 天
      let day = new Date().getDate();

      if (dateTime < nowDateTime) {
        // 过期
        return 1;
      } else if (date.substr(8) == day) {
        // 当日
        return 2;
      } else { 
        // 未到
        return 3;
      }
    },
    loadMore(done) {
      if(this.noData) {
        this.$nextTick(() => {
          this.$refs.myscroller.finishInfinite(2);
        })
        return;
      }
      console.log('上拉')
      let self = this;
      let start = this.list.length;
      let list = this.list,
          page = this.searchData.pageNum,
          size = this.searchData.pageSize;
      // 总页数
      // let totalPage = total % size == 0 ? total / size : Math.ceil(total / size) ;
      // // console.log(original,list,resData)
      // if(page == 1) list = [];
      
      // if(page >= totalPage){
  //       this.arr = list.concat(resData);
  //       this.noData = true;
      // }else{
  //       this.arr = list.concat(resData);
  //       this.noData = false;
  //       this.searchData.pageNum = page + 1;
      // }
      setTimeout(() => {
        // let item = {date: '2018.05.28 08:00-09:00', lesson: '《一不小心进了艺术圈》曹启泰的10唐艺术课堂'};
        // for(let i = start + 1; i < start + 10; i++) {
        //   self.list.push(item)
        // }
        // if(start > 30) {
        //   self.noData = true;
        // }
        // self.$refs.myscroller.resize();
        done()
      }, 1500)
    },
    refresh(done) {
      console.log('下拉');
      this.getScheduleList();
      this.searchData.pageNum = 1;
      let timeOut = setTimeout(()=>{
        // 停止下拉刷新
        // this.$refs.myscroller.finishPullToRefresh()
        done() 
      }, 1000)
    },
    getScheduleList() {
      this.$http
      .get('/memberCalendarEvent/page', this.searchData)
      .then(res => {
        console.log('日程====',res.data.data.list)
        this.scheduleList = res.data.data.list
      })
    },
  },
  filters: {
    dateFormat(str) {
      return str.substr(0,10)
    }
  }
}
</script>

<style>
.no-data-text.active {
  display: none;
}
</style>

<style lang="less" scoped>
.no-data-text.active{
  display: none;
}
.null{
  display: block;
  text-align:center;
  color:#808080;
  font-size:4vw;
  margin:auto;
  margin-top:45vh;
}
.schedule{
  position:relative;
  width:100%;
  // height:667px;
  background: #fff;
  overflow:hidden;
  
  .schedule-item{
    position: relative;
    font-size:3.6vw;
    margin:3vw 5vw 0;
    margin-left:6vw;
    padding-left:5vw;
    &::before{
      position: absolute;
      top:0.6vw;
      left:-1.6vw;
      content: ' ';
      width:3vw;
      height:3vw;
      background:#fff;
      border: 1px solid rgb(204, 204, 204);
      border-radius:50%;
      z-index:2;
    }
    &::after{
      position: absolute;
      top:3vw;
      left:0;
      content: ' ';
      height:105%;
      border-left: 1px solid rgb(204, 204, 204);
    }
    &:nth-last-child(2)::after{
      height:0;
      border:0;
    }
    &:last-child::after{
      height:0;
      border:0;
    }
    .date{
      font-size:3.5vw;
    }
  }
  // 当天
  .today{
    color: @red-color;
    &::before{
      background: @red-color;
      border-color: @red-color;
    }
  }
  // 过期
  .expire{
    color: rgb(204, 204, 204);
    &::before{
      background: rgb(204, 204, 204);
      border-color: rgb(204, 204, 204);
    }
    &::after{
      border-color: rgb(204, 204, 204);
    }
  }
}
</style>

