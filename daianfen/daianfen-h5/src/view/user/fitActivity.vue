<template>
  <div>
    <scroller lock-x class="scroller">
      <div v-if="list.length > 0" style="padding-top:4vw;background:#fff;">
        <act-item v-for="(item, i) in list" :key="i" :item="item" style="" @click.native="jumpPage(`/activity/detail?id=${item.id}`)"></act-item>
      </div>
      <div v-else style="text-align: center;padding-top: 40vh;color: #b7b7b7;font-size: 15px;">暂无数据</div>
    </scroller>
  </div>
</template>
<script>
import { Scroller } from "vux";
import ActItem from "@/components/Common/actItem";
export default {
  components: {
    ActItem,
    Scroller
  },
  data() {
    return {
      list: [],
      selectedId: '',
    };
  },
  created() {
    this.apiGetActiveList()
  },
  methods: {
    apiGetActiveList() {
      this.$vux.loading.show()
      this.$http.get("/coupon/scope", {id: this.$route.query.id}).then(res => {
        console.log('可用活动列表', res.data)
        this.list = res.data.data;
      }).finally(() => {
        this.$vux.loading.hide()
      });
    },
    jumpPage(url) {
      this.$router.push(url);
    }
  }
}
</script>
