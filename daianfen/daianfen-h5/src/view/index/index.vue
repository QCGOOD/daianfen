<template>
  <div>
    <div class="top" ref="top">
      <div class="header" ref="header" style="background:url('static/image/poster.png') no-repeat;background-size:100%;">
        <p>{{userInfo.employee.name}}</p>
        <p>{{userInfo.employee.phoneNo}}</p>
        <p>{{userInfo.shop.shopName}}</p>
        <div class="logout" @click="logout">退出</div>
        <div class="scan" @click="qrCode">
          <i class="iconfont icon-saoyisao"></i>
        </div>
      </div>
      <div class="content" ref="content">
        <!-- 搜索 -->
        <search
          class="search"
          @on-change="searchChange"
          v-model.trim="searchData.keyWord"
          :auto-fixed="false"
          placeholder="请输入姓名或手机号"
          ref="search"></search>
        <!-- 导航 -->
        <tab class="tab" :line-width="1" custom-bar-width="60px">
          <tab-item class="tab-item" @on-item-click="handler" :selected="searchData.status == 1">
            已预约
            <badge class="badge" v-if="newCount > 0" :text="newCount"></badge>
          </tab-item>
          <tab-item class="tab-item" @on-item-click="handler" :selected="searchData.status == 2">已到店</tab-item>
          <tab-item class="tab-item" @on-item-click="handler" :selected="searchData.status == 3">已取消</tab-item>
        </tab>
      </div>
    </div>
    <div>
      <scroller class="scroller" lock-x :height="`-${scrollerTop}px`">
      <div id="">
        <reserve-item class="reserve-item" :id="item.id" v-for="(item,i) in list" :key="i" :item="item"></reserve-item>
      </div>
    </scroller>
    </div>
  </div>
</template>
<script>
import { Search, Tab, TabItem, Scroller, Badge } from 'vux'
import ReserveItem from "@/components/Common/reserveItem";
import { setTimeout } from 'timers';
export default {
  components: {
    Search, Tab, TabItem, Scroller, ReserveItem, Badge
  },
  data() {
    return {
      scrollerTop: 0,
      searchData: {
        keyWord: '',
        selectType: 2,
        status: 1,
      },
      newCount: 0,
      list: [],
      userInfo: {
        employee: {},
        shop: {}
      },
      model: {},
    };
  },
  created() {
    this.search()
    if(localStorage.getItem('userInfo')){
      let userInfo = localStorage.getItem('userInfo')
      this.userInfo = JSON.parse(userInfo)
    }
  },
  mounted() {
    this.getHeight()
    this.setScrollTop()
    window.onresize = () => {
      this.getHeight()
      this.setScrollTop()
    };
  },
  methods: {
    getHeight() {
      let domHeight = window.innerHeight;
      let top = this.$refs.top.clientHeight;
      let headHeight = this.$refs.header.clientHeight;
      let contentHeight = this.$refs.content.clientHeight;
      this.scrollerTop = top;
    },
    setScrollTop() {
      // 滚动到上一次的位置
      let target = sessionStorage.getItem('itemScroll')
      if(!target) return false;
      target = JSON.parse(target)
      console.log(target)
      this.searchData.status = target.state
      this.$nextTick(() => {
        let el = document.querySelector(".xs-container");
        let domHeight = window.innerHeight;
        
        let targetEl = document.getElementById('c0a8011263cda27a0163cda300ea0002');
        // let targetEl = this.$refs.c0a8011263cda27a0163cda300ea0002;
        console.log(targetEl)
        if(!targetEl) return false;
        let setScrollTop = targetEl.offsetTop;
        if(setScrollTop > (el.clientHeight - (domHeight - this.scrollerTop))){
          setScrollTop = el.clientHeight - (domHeight - this.scrollerTop)
        }
        // console.log(setScrollTop, elHeight)
        el.style.transform = `translateY(-${setScrollTop}px)`
      })
    },
    apiGetList(data) {
      this.$http.get('/reservation/select', data)
      .then(res => {
        this.list = res.data.content0.rows
      })
    },
    apiGetNewCount() {
      this.$http.get('/reservation/newReservation')
      .then(res => {
        this.newCount = res.data.content0
      })
    },
    apiLogout() {
      // 退出登录
      this.$http.post('/logout')
      .then(res => {
        this.$router.push('/login')
      })
    },
    logout() {
      let that = this;
      this.$vux.confirm.show({
        title: '提示',
        content: '确认退出登录？',
        // 组件除show外的属性
        onCancel () {},
        onConfirm () {
          that.apiLogout()
        }
      })
    },
    // 扫码
    qrCode() {
      this.$wxSdk.scanQRCode();
    },
    resultScanQRCode(id) {
      this.$router.push(`/index/examine?id=${id}`)
    },
    handler(i) {
      // 切换tab
      if(i+1 == this.searchData.status) return false;
      this.searchData.status = i+1
      this.search()
    },
    search() {
      this.apiGetNewCount()
      this.apiGetList(this.searchData)
    },
    searchChange() {
      // 改变搜索类型
      let reg = /^\d+$/;
      if(reg.test(this.searchData.keyWord)){
        // 手机号
        this.searchData.selectType = 1
      }else{
        // 姓名
        this.searchData.selectType = 2
      }
      this.apiGetNewCount()
      this.apiGetList(this.searchData)
    }
  }
}
</script>
<style lang="less" scoped>
.top{
  padding-top:3vw;
}
.header{
  position: relative;
  width:92vw;
  height:38vw;
  overflow: hidden;
  background-color:#f2f2f2;
  border-radius:1vw;
  margin:0 auto;
  padding:3vw;
  box-sizing: border-box;
  color:#fff;
  // font-size:3.8vw;
  .logout{
    position: absolute;
    top:3vw;
    right:3vw;
    padding:5px;
    // font-size: 4vw;
  }
  .scan{
    position: absolute;
    top:12vw;
    right:4.5vw;
    padding:5px;
    i{
      font-size: 6vw;
      font-weight: bold;
      // color: @theme-color;
    }
  } 
}
.content{
  .search{
    width:92vw;
    margin:3vw auto 0;
  }
  .tab{
    font-size: 4vw;
    .tab-item{
      position: relative;
      .badge{
        position: absolute;
        top:10%;
        right: 12%;
      }
    }
  }
}
.scroller{
  padding-top: 1vw;
}


</style>
