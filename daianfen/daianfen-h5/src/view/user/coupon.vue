<template>
  <div class="coupon">
    <div class="tab">
      <tab active-color="#000" bar-active-color="rgb(226, 81, 60)">
        <tab-item selected @on-item-click="onItemClick(1)">可用{{counts[1]}}</tab-item>
        <tab-item @on-item-click="onItemClick(2)">已用{{counts[2]}}</tab-item>
        <tab-item @on-item-click="onItemClick(3)">过期{{counts[3]}}</tab-item>
      </tab>
    </div>
    <scroller lock-x class="data-list" height="-44px">
      <div class="list" v-if="list.length > 0" style="background:#fff;overflow:auto;">
        <coupon-item v-for="(item, i) in list" :key="i" :index="i" :item="item" :type="type" @click.native="jumpPage(`/user/fitActivity?id=${item.ruleId}`)"></coupon-item>
        <qc style="background:#f2f2f2;"></qc>
      </div>
      <div v-else style="text-align: center;padding-top: 40vh;color: #b7b7b7;font-size: 15px;">暂无数据</div>
    </scroller>
  </div>
</template>

<script>
import { Tab, TabItem, Scroller } from 'vux'
import CouponItem from '@/components/Common/couponItem'

export default {
  components: {
    Tab, TabItem, CouponItem, Scroller
  },
  data () {
    return {
      list: [],
      typeList: ['','keyong', 'yiyong', 'guoqi'],
      type: 'keyong',
      sarechData: {
        ruleType: 2,
        status: 1
      },
      counts: {}
    }
  },
  created() {
    this.apiGetCount()
    this.apiGetPage()
  },
  methods: {
    onItemClick(index) {
      console.log('on item click:', index)
      this.type = this.typeList[index]
      this.sarechData.status = index
      this.list = []
      this.apiGetPage()
    },
    apiGetPage() {
      this.$vux.loading.show()
      this.$http.get('/coupon', this.sarechData)
      .then(res => {
        console.log(res.data.data)
        this.list = res.data.data.list
        
      }).finally(() => {
        this.$vux.loading.hide()
      });
    },
    apiGetCount() {
      this.$http.get('/coupon/count', {ruleType: 2})
      .then(res => {
        this.counts = res.data.data
      })
    },
    jumpPage(url) {
      this.$router.push(url);
    }
  }
}
</script>
<style lang="less" scoped>
.null{
  text-align: center;
  color: #808080;
  font-size: 15px;
  margin-top: 49vh;
}

</style>
