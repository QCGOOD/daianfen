<template>
  <div class="sign-up">
    <p class="title white">已报名 ({{$route.query.s}}/{{$route.query.c}})</p>
    <sign-item v-for="(item, i) in list" :key="i" :item="item"></sign-item>
  </div>
</template>

<script>
import SignItem from "@/components/Common/signItem";

export default {
  components: {
    SignItem
  },
  data() {
    return {
      list: []
    }
  },
  created() {
    this.apiGetSignUps(this.$route.query.id);
  },
  methods: {
    apiGetSignUps(activityId) {
      this.$http.get("/activitySign/signMembers", { activityId }).then(res => {
        this.list = res.data.data.list;
        console.log(this.list)
      });
    }
  }
};
</script>

<style lang="less" scoped>
.sign-up {
  .title {
    font-size: 4vw;
    padding: 3vw;
  }
}
</style>
