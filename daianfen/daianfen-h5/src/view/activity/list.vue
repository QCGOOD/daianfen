<template>
  <div>
    <tab bar-active-color="#668599" :line-width="0">
      <tab-item selected @on-item-click="onItemClick()">全部</tab-item>
      <tab-item v-for="c in categorys" :selected="selectedId == c.id" :key="c.id" @on-item-click="onItemClick(c.id)">{{c.name}}</tab-item>
    </tab>
    <scroller lock-x height="-44px">
      <div v-if="list.length >0"  style="padding-top:10px;background:#fff">
        <act-item v-for="(item, i) in list" :key="i" :item="item" @click.native="jumpPage(`/activity/detail?id=${item.id}`)"></act-item>
      </div>
      <div v-else style="text-align: center;padding-top: 40vh;color: #b7b7b7;font-size: 15px;">暂无数据</div>
    </scroller> 
  </div>
</template>

<script>
import { Tab, TabItem, Scroller } from "vux";
import ActItem from "@/components/Common/actItem";
export default {
  components: {
    ActItem,
    Tab,
    TabItem,
    Scroller
  },
  data() {
    return {
      list: [],
      categorys: [],
      selectedId: '',
    };
  },
  created() {
    this.selectedId = this.$route.query.id;
    this.apiGetActiveList(this.selectedId);
    this.apiGetCategorys();
  },
  methods: {
    apiGetCategorys() {
      this.$http.get("/category/treeByType", { type: 2 })
        .then(res => {
          this.apiGetCategory(res.data.data[0].id)
        });
    },
    apiGetCategory(id) {
      this.$http
        .get("/category/page", {
          parentId: id
        })
        .then(res => {
          this.categorys = res.data.data.list;
        });
    },
    apiGetActiveList(categoryId) {
      this.$vux.loading.show()
      this.$http.get("/activity/page", { categoryId }).then(res => {
        this.list = res.data.data.list;
      }).finally(() => {
        this.$vux.loading.hide()
      });
    },
    onItemClick(v) {
      this.selectedId = v;
      this.apiGetActiveList(v)
    },
    jumpPage(url) {
      this.$router.push(url);
    }
  }
};
</script>

<style>
</style>
