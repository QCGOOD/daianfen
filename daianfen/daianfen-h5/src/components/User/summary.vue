<template>
  <!-- <div class="summary"> -->
    <scroller :on-infinite="loadMore" :on-refresh="refresh" ref="myscroller">
      <summary-item v-for="(item, i) in list" :item="item" :key="i" @click.native="toDetail"></summary-item>
    </scroller>
    <!-- <div v-else class="null">暂无数据</div> -->
  <!-- </div> -->
</template>

<script>
import SummaryItem from '../Common/summaryItem'
export default {
  components: {
    SummaryItem
  },
  data () {
    return {
      height: 0,
      noData: true,
      searchData: {
        sourceId: '',
        pageNum: 1,
        // pageSize: 10,
      },
      list: [
        {title: '翻跟斗风格的地翻跟斗风格的地方的广告方的广告', img: 'static/image/3.jpg', date: '2018-05-31'},
        {title: '翻跟斗风格的地翻跟斗风格的地方的广告方的广告', img: 'static/image/3.jpg', date: '2018-05-31'},
        {title: '翻跟斗风格的地翻跟斗风格的地方的广告方的广告', img: 'static/image/3.jpg', date: '2018-05-31'},
        ]
    }
  },
  created() {
    this.searchData.sourceId = this.$route.query.sourceId
    this.getPageList()
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
    toDetail() {
      this.$router.push(`/user/summary/detail?sourceId=${this.$route.query.sourceId}&id=123456`)
    },
    getPageList() {
      this.$http.get('partakeSense/page', this.searchData).then(res => {
        console.log(res.data)
        // this.list = res.data.data.list
      })
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
      self.$refs.myscroller.resize();
      done()
    },
    refresh(done) {
      console.log('下拉');
      this.searchData.pageNum = 1;
      this.getPageList()
      let timeOut = setTimeout(()=>{
        // 停止下拉刷新
        // this.$refs.myscroller.finishPullToRefresh()
        done() 
      }, 600)
    }
  }
}
</script>
<style lang="less" scoped>

.null{
  text-align: center;
  color: #808080;
  font-size: 15px;
  padding-top: 45vh;
}

.summary{
  width:100vw;
  height:100%;
  background: #fff;
}
</style>