<template>
  <div class="revise-mobile">
    <div class="group" style="background:#fff;">
      <x-input title='姓名' type="text" text-align="right" required v-model="model.name"></x-input>
      <popup-radio title="性别" :options="sex" v-model="model.sex"></popup-radio>
      <x-input title='公司' type="text" text-align="right" v-model="model.company"></x-input>
      <x-input title='职位' type="text" text-align="right" v-model="model.position"></x-input>
    </div>
    <div class="btn" @click="save()">确定</div>
  </div>
</template>

<script>
import { XInput, PopupRadio} from 'vux'
// 验证码计时器
var timer;
export default {
  components: {
    XInput,
    PopupRadio
  },
  data() {
    return {
      model: {},
      sex: [
        {key: 1, value:'男'}, {key: 2, value: '女'}
      ]
    }
  },
  created() {
    this.apiGetUser();
  },
  methods: {
    apiGetUser() {
      this.$http.get("/member/info").then(res => {
        console.log(res.data.data)
        this.model = res.data.data;
      });
    },
    jumpPage(url) {
      this.$router.push(url)
    },
    save() {
      console.log(this.model)
      if(this.model.name == '' || this.model.sex == '' ){
        this.toast('字段不能为空')
        return false;
      }
      this.apiSave()
    },
    apiSave() {
      this.$http.post('/member/profile', this.model)
      .then(res => {
        console.log(res.data)
        this.toast('修改成功')
        setTimeout(() => {
          this.$router.go(-1)
        }, 500)
      })
    },
  },
};
</script>

<style lang="less" scoped>
.revise-mobile{
  overflow: hidden;

  .btn{
    background:@red-color;
    // border:1px solid @red-color;
    border-radius:1vw;
    text-align:center;
    line-height:11vw;
    color: #fff;
    margin:20vw 4vw 5vw;
  }
}

</style>
