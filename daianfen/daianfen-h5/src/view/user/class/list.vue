<template>
  <div>
    <scroller lock-x>
      <div v-if="classList.length > 0">
        <class-item class="course-item" v-for="(item, i) in classList" :key="i" :item="item"  @click.native="toDetail(item.id)" ></class-item>
      </div>
      <div v-else class="null">暂无数据</div>
    </scroller>
  </div>
</template>

<script>
import classItem from '@/components/Common/classItem'
import { Scroller } from "vux";
export default {
  components: {
    classItem,
    Scroller
  },
  data () {
    return {
      height:0,
      noData: true,
      classList: [],
      searchData: {
        pageNum: 1
      }
    }
  },
  created () {
    this.getDataList()
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
    toDetail (id) {
      this.$router.push(`/user/class/detail?id=${id}`)
    },
    getDataList () {
      this.$vux.loading.show()
      this.$http.get('/courseClass/myClassList')
      .then(res => {
        console.log('班级',res)
        this.classList = res.data.data
      }).finally(() => {
        this.$vux.loading.hide()
      });
    },
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

</style>