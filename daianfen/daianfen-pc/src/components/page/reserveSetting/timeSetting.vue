<template>
  <div class="wrap" ref="wrap" :style="{'height': `${wrapHeight}px`}">
    <button-wrap>
        <el-button type="primary" size="small" @click="insert()">添加</el-button>
    </button-wrap>
    <div class="data-setting" :style="{'height': `${mainHeight}px`}">
      <div class="item" v-for="(item, i) in timeList" :key="i">
        <i class="el-icon-remove" @click="deleteTime(i)"></i>
        <div class="left">
          <span>开始时间</span>
          <el-time-select v-model="item.startTime" :picker-options="options" :clearable="false" :editable="false" @change="updateTime" placeholder="选择时间"></el-time-select>
        </div>
        <div class="right">
          <span>结束时间</span>
          <el-time-select v-model="item.endTime" :picker-options="options" :clearable="false" :editable="false" @change="updateTime" placeholder="选择时间"></el-time-select>
        </div>
      </div>
    </div>
    <div class="bottom-btn">
      <el-button type="primary" @click="submit()" style="margin-left: 30px;" size="small" :loading="loading">保存</el-button>
    </div>
  </div>
</template>
<script>
import ButtonWrap from "../../common/ButtonWrap";
export default {
  components: {
    ButtonWrap
  },
  data () {
    return {
      wrapHeight: 0,
      mainHeight: 0,
      loading: false,
      value1: '',
      options:{
        start: '06:00',
        step: '00:30',
        end: '23:00'
      },
      timeList: [
        {startTime: '', endTime: ''},
        {startTime: '', endTime: ''},
        {startTime: '', endTime: ''},
      ],
      configList: [],
      model: {}
    }
  },
  created () {
    this.apiGetConfig()
  },
  mounted() {
    this.getHeights();
    window.onresize = () => {
      this.getHeights();
    };
  },
  methods: {
    // 设置高度
    getHeights() {
      this.wrapHeight = window.innerHeight - 162;
      this.mainHeight = this.wrapHeight -55 - 60;
    },
    // 获取时间配置
    apiGetConfig(){
      this.$http.get('/config/list').then(res => {
        this.model = res.data.content0.resTimeSlot
        let timeList = JSON.parse(JSON.stringify(this.timeList));
        let resList = JSON.parse(res.data.content0.resTimeSlot.content);
        resList.map((item, i) => {
          timeList[i].startTime = item.substr(0,5)
          timeList[i].endTime = item.substr(6)
        })
        this.timeList = timeList;
      })
    },
    // 更新配置
    apiUpdate() {
      this.$http.post('/config/update', this.model)
      .then(res => {
        this.loading = false;
        this.$message.success('保存成功')
        this.apiGetConfig()
      })
    },
    // 删除时间
    deleteTime(i){
      if(this.timeList.length < 2){
        this.$message.warning('至少保留一组时间')
        return;
      }
      this.timeList.splice(i,1)
      this.updateTime()
    },
    // 添加时间
    insert() {
      if(this.timeList.length > 7){
        this.$message.warning('最多可添加 8 组时间')
        return;
      }
      let time = {startTime: '08:00', endTime: '20:00'}
      this.timeList.push(time)
      this.updateTime()
    },
    // 更新时间
    updateTime() {
      let timeList = JSON.parse(JSON.stringify(this.timeList));
      let newList = [];
      timeList.map(item => {
        let timeStr = `${item.startTime}-${item.endTime}`
        newList.push(timeStr)
      })
      this.model.content = JSON.stringify(newList)
    },
    // 提交
    submit() {
      this.loading = true;
      this.apiUpdate()
    },
  }
}
</script>
<style lang="less" scoped>
.data-setting {
  padding: 20px;
}
.bottom-btn {
  text-align: center;
  height: 60px;
  line-height: 60px;
  border-top: 1px solid #e7eaec;
}
.item{
  display: flex;
  align-items: center;
  margin-bottom:20px;
  i{
    margin-right: 10px;
    font-size:18px;
    color:#b80223;
    &:hover{
      cursor: pointer;
    }
  }
  .left,.right{
    display: flex;
    align-items: center;
    margin-right:20px;
    span{
      font-size:16px;
      color:#606266;
      margin-right:10px;
    }
  }
}
</style>

