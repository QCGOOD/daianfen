<template>
  <span class="status" :class="style">{{ formatStatus }}</span>
</template>

<script>
export default {
  props: {
    status: Number
  },
  data() {
    return {
      style: ""
    };
  },
  computed: {
    formatStatus(v) {
      switch (this.status) {
        case 1:
          return "未开始";
        case 2:
          return "报名中";
        case 3:
          return "报名截止";
        case 4:
          return "进行中";
        case 5:
          return "已结束";
      }
    }
  }
};
</script>

<style lang="less">
.status {
  float: right;
  margin-top: 2px;
  padding: 0 1.5vw;
  font-size: 3.3vw;
  border-radius: 1vw;
  color: #d3c2a5;
  border: 1px solid #d3c2a5;
}
</style>
