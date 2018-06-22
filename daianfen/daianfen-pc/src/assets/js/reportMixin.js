export const reportMixin = {
  data() {
    return {
      domHeight: 400
    }
  },
  mounted() {
    this.domHeight = this.$refs.wrap.clientHeight - this.$refs.search.clientHeight - 110;
    window.onresize = () => {
      this.domHeight = this.$refs.wrap.clientHeight - this.$refs.search.clientHeight - 110;
      console.log(this.domHeight)
    };
  }
}