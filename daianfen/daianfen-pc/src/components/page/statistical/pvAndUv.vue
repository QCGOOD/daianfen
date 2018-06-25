<template>
  <div class="wrap" ref="wrap" :style="{'height': `${wrapHeight}px`}">
    <search-wrap>
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="">
            <el-date-picker size="small" value-format="yyyy-MM-dd" v-model="searchData.startDate" type="date" placeholder="开始时间"></el-date-picker>
          </el-form-item>
          <!-- <span>至</span> -->
          <el-form-item label="">
            <el-date-picker size="small" value-format="yyyy-MM-dd" v-model="searchData.endDate" type="date" placeholder="结束时间"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="apiDataList()">查询</el-button>
          </el-form-item>
        </el-form>
      </search-wrap>
    <div class="data-setting" :style="{'height': `${mainHeight}px`}" style="100%;" >
      <div id="myChart" v-show="this.list.length > 0" :style="{'width': `${mainWidth}px`, 'height': `${mainHeight}px`}" style=""></div>
      <div v-show="!this.list.length > 0" style="text-align:center;color:#808080;margin-top:20%;">暂无数据</div>
    </div>
    <div class="bottom-btn">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchData.curPage" :page-sizes="[10, 20, 30]" :page-size="searchData.size" layout="total, sizes, prev, pager, next" :total="searchData.total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import SearchWrap from "../../common/SearchWrap";
import util from "@/assets/js/util";
export default {
  components: {
    SearchWrap
  },
  data () {
    return {
      wrapHeight: 0,
      mainHeight: 0,
      mainWidth: 0,
      options: ['PV', 'UV'],
      searchData: {
        startDate: '',
        endDate: '',
        curPage: 1,
        size: 15,
        total: 0,
      },
      list: [],
      echartData: {
        pv: [],
        uv: [],
        date: []
      },
    }
  },
  created () {
    let yesterday = util.yesterday()
    this.searchData.startDate = yesterday
    this.searchData.endDate = yesterday
  },
  mounted() {
    this.getHeights();
    window.onresize = () => {
      this.getHeights();
    };
    this.apiDataList()
  },
  methods: {
    // 设置高度
    getHeights() {
      this.wrapHeight = window.innerHeight - 162;
      this.mainHeight = this.wrapHeight -55 - 62;
      this.mainWidth = this.$refs.wrap.clientWidth - 40;
    },
    // 获取数据
    apiDataList(){
      this.$http.get('/statistics/pvList', this.searchData).then(res => {
        this.list = res.data.content0.list
        this.searchData.total = res.data.content0.total
        let list = res.data.content0.list
        let pv = [], uv = [], date = [];
        list.map((item, i) => {
          pv.push(item.pageVisitPv)
          uv.push(item.pageVisitUv)
          date.push(item.date.substr(5,6))
        })
        this.echartData = {pv, uv, date}
        this.$nextTick(() => {
          this.myChart()
        })
      })
    },
     // 分页
    handleSizeChange(val) {
      document.getElementsByClassName(
        "el-table__body-wrapper"
      )[0].scrollTop = 0;
      this.searchData.size = val;
      this.searchData.curPage = 1;
      this.apiDataList();
    },
    handleCurrentChange(val) {
      document.getElementsByClassName(
        "el-table__body-wrapper"
      )[0].scrollTop = 0;
      this.searchData.curPage = val;
      this.apiDataList();
    },
    // 配置
    myChart() {
      let myChart = this.echarts.init(document.getElementById('myChart'), null, {renderer: 'svg'});
      myChart.setOption({
        title: {
          text: '单位/次',
          textStyle: {
            fontSize: 14,
            color: '#808080',
            fontWeight: 'normal'
          },
          padding: [20, 0, 0, 20]
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: this.options
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.echartData.date
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name:'PV',
            type:'line',
            stack: '总量',
            data: this.echartData.pv
          },
          {
            name:'UV',
            type:'line',
            stack: '总量',
            data: this.echartData.uv
          }
        ]
      });
    },
  }
}
</script>
<style lang="less" scoped>
.data-setting {
  padding: 20px;
}
.bottom-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  border-top: 1px solid #e7eaec;
}
</style>

