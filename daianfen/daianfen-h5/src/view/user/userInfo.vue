<template>
  <div class="user">
    <group class="group">
      <cell title="头像" is-link style="position:relative;">
        <img style="width:40px; display:block;margin-right:5px;border-radius:50%;" :src="user.headImage">
        <popup-radio :options="options" v-model="byImg" @on-hide="popupHide()" style="width:100%;position:absolute;top:0;left:0;z-index:222;opacity:0;">
          <template slot-scope="props" slot="each-item">
            <p style="text-align:center;">同步微信头像</p>
          </template>
        </popup-radio>
      </cell>
      
      <cell title="昵称" :value="user.appellation" is-link @click.native="jumpPage('')"></cell>
    </group>
    <group class="group">
      <cell title="姓名" :value="user.name" @click.native="onClick"></cell>
      <cell title="手机" :value="user.mobile" is-link @click.native="jumpPage('/user/revisePhone')"></cell>
      <cell title="公司" :value="user.company"></cell>
      <cell title="职位" :value="user.position"></cell>
    </group>
    <div class="btn" @click="jumpPage('/user/receiveUser')">修改资料</div>
  </div>
</template>

<script>
import { Cell, CellBox, CellFormPreview, Group, Badge, PopupRadio } from 'vux'
export default {
  components: {
    Group,
    Cell,
    CellFormPreview,
    CellBox,
    Badge,
    PopupRadio 
  },
  data() {
    return {
      user: {
        name: '',
        appellation: '',
        mobile: '',
        company: '',
        position: ''
      },
      byImg: '',
      options: ['1']
    };
  },
  created() {
    this.apiGetUser();
  },
  methods: {
    apiGetUser() {
      this.$http.get("/member/info").then(res => {
        console.log(res.data.data)
        this.user = res.data.data;
      });
    },
    apiUpDateHeadImg() {
      this.$http.post('/member/refresh_head_image')
      .then(res => {
        this.apiGetUser()
      })
    },
    jumpPage(url) {
      this.$router.push(url)
    },
    popupHide() {
      this.apiUpDateHeadImg()
    }
  }
};
</script>

<style lang="less" scoped>
.user {
  .btn{
    border:1px solid @red-color;
    border-radius:1vw;
    text-align:center;
    line-height:11vw;
    color: @red-color;
    margin:20vw 4vw 5vw;
  }
}
</style>
