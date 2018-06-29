<template>
  <div>
    <tab bar-active-color="#668599" :line-width="0">
      <!-- <tab-item selected @on-item-click="onItemClick(0)">全部</tab-item> -->
      <!-- <tab-item @on-item-click="onItemClick(1)">待审核</tab-item> -->
      <!-- <tab-item @on-item-click="onItemClick(2)">待支付</tab-item> -->
      <!-- <tab-item @on-item-click="onItemClick(3)">待开始</tab-item> -->
      <tab-item selected @on-item-click="onItemClick(1)">进行中</tab-item>
      <tab-item @on-item-click="onItemClick(2)">已结束</tab-item>
    </tab>
    <scroller lock-x height="-44px">
      <div v-if="list.length > 0" style="padding-top:10px;background:#fff">
        <act-item  v-for="(item, i) in list" :key="i" :item="item" @click.native="jumpPage(`/activity/detail?id=${item.id}`)"></act-item>
      </div>
      <div v-else style="text-align: center;padding-top: 40vh;color: #b7b7b7;font-size: 15px;">暂无数据</div>
    </scroller> 
  </div>
</template>

<script>
import ActItem from "@/components/Common/actItem";
import { Tab, TabItem,Scroller } from "vux";
export default {
  components: {
    ActItem,
    Tab,
    TabItem,
    Scroller
  },
  data() {
    return {
      list: []
    };
  },
  created() {
    this.apiGetActiveList();
  },
  methods: {
    apiGetActiveList(status = 1) {
      this.$http.get("/activity/signActivityPage", { status}).then(res => {
        this.list = res.data.data.list;
      });
    },
    onItemClick(type) {
      this.apiGetActiveList(type);
    },
    jumpPage(url) {
      this.$router.push(url);
    }
  }
};
</script>

<style>
</style>
