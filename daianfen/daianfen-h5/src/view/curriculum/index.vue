<template>
  <scroller lock-x class="scroller" height="-50.88" style="background:#f2f2f2;">
    <div v-show="courseList.length > 0">
      <course-item class="course-item" v-for="(item, i) in courseList" :key="i" @click.native="toDetail(item.id)" :item="item"></course-item>
      <qc></qc>
    </div>
    <div v-show="!courseList.length > 0" class="null">暂无数据</div>
  </scroller>
</template>

<script>
import CourseItem from '@/components/Common/courseItem'
import { Scroller } from "vux";
export default {
  components: {
    CourseItem,
    Scroller
  },
  data () {
    return {
      height:0,
      noData: true,
      courseList: [],
      searchData: {
        pageNum: 1
      }
    }
  },
  created () {
    this.getLessonList()
  },
  mounted () {
    this.$wxSdk.onMenuShare('加速商学院','助力优秀企业加速发展！',`${this.$ROOTURL}/mobile/POUND/curriculum?wo=1&wot=2&woacm=1&mpl=1`,'http://athena-1255600302.cosgz.myqcloud.com/attachments/abs.jpg')
    this.getHeight()
    window.onresize = () => {
      this.getHeight();
    }
  },
  methods: {
    getHeight() {
      this.height = window.innerHeight;
    },
    toDetail (id) {
      this.$router.push(`/curriculum/detail?id=${id}`)
    },
    getLessonList () {
      this.$vux.loading.show()
      this.$http.get('/course/page')
      .then(res => {
        console.log('课程',res.data)
        this.courseList = res.data.data.list
      }).finally(() => {
        this.$vux.loading.hide()
      });
    },
  }
}
</script>
<style lang="less" scoped>

.null{
  width:100vw;
  text-align: center;
  color: #808080;
  font-size: 15px;
  padding-top: 45vh;
}
</style>