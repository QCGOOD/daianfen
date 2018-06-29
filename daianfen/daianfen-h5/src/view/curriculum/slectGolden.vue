<template>
  <div class="sign-success" style="min-height:100vh;overflow:hidden;" :style="{'min-height': `${wrapHeight}px`}">
    <div class="box">
      <p class="title">我的课后感</p>
      <div class="content">
        <div class="section">
          <!-- 金句 -->
          <ul class="checklist">
            <li class="item" v-for="(item, index) in commonList" :key="index" @click="change(index)">
              <i><i class="iconfont icon-gouxuan" :class="{'active': active == index}"></i></i>
              <span>{{ item.content }}</span>
            </li>
            <!-- 自定义金句 -->
            <li class="item" @click="change(commonList.length)">
              <i><i class="iconfont icon-gouxuan" :class="{'active': active == commonList.length}"></i></i>
              <input v-model.trim="model.content" placeholder="自定义课后感…" />
            </li>
          </ul>
          <!-- 上传图片 -->
          <div class="upload">
            <ul class="img-list">
              <!-- 图片列表 -->
              <li v-for="(item, index) in model.imgUrl" :key="index" @click="pickImg(index)">
                <img :src="imgHost+item">
                <!-- imgHost+ -->
                <!-- 删除按钮-->
                 <transition name="slide-fade">
                  <i v-show="index == currentImg" class="iconfont icon-guanbi delete"  @click="deleteImg(index)"></i>
                </transition>
              </li>
              <!-- 选择图片上传 -->
              <div class="icon" @click="addImg">
                <i class="iconfont icon-jia"></i>
                <!-- @change="choiceImg" -->
                <!-- <input class="input-upload" type="file" @change="choiceImg"  /> -->
              </div>
            </ul>
          </div>
        </div>
        <div style="margin:10vw 4vw;">
          <x-button type="warn" @click.native="subMit">确定</x-button>
        </div>
      </div>
    </div>
    <!-- <qc></qc> -->
  </div>
</template>

<script>
import axios from 'axios'
import Qc from '../../components/Common/qc'
import { XButton  } from 'vux'
import { setTimeout } from 'timers';
export default {
  components: {
    Qc,
    XButton,
  },
  data () {
    return {
      wrapHeight:667,
      model: {
        sourceId: '',
        sourceType: '',
        shortSentenceId: '',
        shortSentence: '',
        imgUrl: [],
        content: '',
        iconUrl: '',
        title: ''
      },
      commonList: [ ],
      checklist: [],
      labelPosition: '',
      value: '',
      active: 0,
      
      currentImg: null
    }
  },
  created() {
    if(this.$route.query.sourceType == 1){
      // this.getActi()
    }else if(this.$route.query.sourceType == 3) {
      // this.getLesson()
    }
    
  },
  mounted() { 
    this.getHeight()
    console.log(window.innerHeight);
  },
  methods: {
    getHeight () {
      this.wrapHeight = window.innerHeight;
    },
    change(i) {
      this.active = i;
      if(i == this.commonList.length){
        // 选择自定义  清除默认选中的第一条
        this.model.shortSentenceId = ''
        this.model.shortSentence = ''
      }else{
        console.log(i, this.commonList[i].shortSentenceId)
        this.model.shortSentenceId = this.commonList[i].id
        this.model.shortSentence = this.commonList[i].content
      }
    },
    addImg() {
      this.$wxSdk.chooseImg(this.chooseImg)
    },
    chooseImg(val) {
      // alert(val)
      // this.model.imgUrl.push(val)
      if(this.model.imgUrl.length > 9){
        this.$vux.toast.show({text:'最多可上传9张', type: 'text'})
        return;
      }
      this.$wxSdk.upLoadImg(val, this.upLoadImg)
    },
    upLoadImg(val) {
      let params = {
        mediaId: val,
        imageType: 'partakeSense'
      }
      this.$http.post('/attachment/images', params).then(res => {
        console.log(JSON.stringify(res.data))
        this.model.imgUrl.push(res.data.data.imageUrl)
      }).catch(res =>
        alert(res.data.message)
      )
      
      // if(this.model.imgList.length >= 9){
      //   // 显示文字
      //   this.$vux.toast.text('最多可上传9张')
      //   return;
      // }

      // let file = e.target.files[0];
      // // console.log(e.target.files[0])
      // let params = new FormData(); //创建form对象
        
      //   params.append('file',file,file.name);//通过append向form对象添加数据
      //   params.append('imageType','radio');//添加form表单中其他数据

      // this.$http.upLoad('/attachments/images/tencent_cloud', params).then(res => {
      //   console.log(res)
      //   // this.model.imgList.push(res.data.data)
      // })
    },

    pickImg(i) {
      if(i == this.currentImg) this.currentImg = null;
      else this.currentImg = i;
    },
    deleteImg(i) {
      this.model.imgUrl.splice(i,1)
    },
    // 获取h活动
    getActi(){
      this.$http.get('/activity/get', {id: this.$route.query.id}).then(res => {
        this.model.iconUrl = res.data.data.iconUrl
        this.model.title = res.data.data.title
        this.getReview(this.$route.query.id)
        localStorage.setItem('detail', JSON.stringify(res.data.data))
      })
    },
    // 获取课程
    getLesson(){
      this.$http.get('/course/get', {id: this.$route.query.id}).then(res => {
        console.log('课程=====',res.data)
        this.model.iconUrl = res.data.data.iconUrl
        this.model.title = res.data.data.title
        this.getReview(this.$route.query.id)
        localStorage.setItem('detail', JSON.stringify(res.data.data))
      })
    },
    // 获取小结
    getReview(id) {
      this.$http.get('/reviewSummary/get', {sourceId: id}).then(res => {
        console.log('小结=======',res.data)
        this.commonList = res.data.data.shortSentenceList
        this.model.sourceType = res.data.data.sourceType
        this.model.sourceId = res.data.data.sourceId
        this.model.shortSentenceId = res.data.data.shortSentenceList[0].id      //默认设置第一条金句
        this.model.shortSentence = res.data.data.shortSentenceList[0].content   //默认设置第一条金句
      })
    },
    // 新增课后感
    addLessonFeel() {
      let params = JSON.parse(JSON.stringify(this.model))
      params.imgUrl = JSON.stringify(params.imgUrl)
      this.$http.post('partakeSense/add', params).then(res => {
        console.log('新增课后感====',res.data.data.id)  // res.data.id
        if(res.data.code == 20000){
           this.$vux.toast.show({text:'发布成功', type: 'text'})
          setTimeout(() => {
            if(this.$route.query.sourceType == 1) this.$router.replace(`/user/summaryDetail?id=${res.data.data.id}&actId=${this.$route.query.id}`);
            else this.$router.replace(`/user/summaryDetail?id=${res.data.data.id}`);
          },500)
        }else{
          this.toast('发布失败')
        }
      })
    },
    // 提交
    subMit() {
      
      if( this.active == this.commonList.length && this.model.content == ''){
        this.toast('内容不能为空')
        return;
      };
      this.addLessonFeel()
    }
  }
}
</script>

<style lang="less" scoped>

.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to{
  transform: translate(2vw, -2vw);
  opacity: 0;
}

.box{
  border:1px solid #dddddd;
  border-radius:10px;
  margin:4vw;
  p.title{
    text-align: center;
    padding:3vw 0;
    color: @red-color;
    border-radius:10px 10px 0 0;
    border-bottom:1px solid #ddd;
    background:#f8f8f8;
  }
  .content{
    background:#fff;
    border-radius:0 0 10px 10px;
    padding-top:2vw;
    overflow: hidden;
    // padding-bottom:10vw;
    .checklist{
      list-style: none;
      font-size:3.8vw;
      .item{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding:2vw 0;
        span, .span{
          padding-right:4vw;
        }
        input{
          outline: 0 none;
          border:0 none;
          flex:1;
          height:100%;
          font-size:3.8vw;
          padding:3vw;
          margin-right:4vw;
          background-color:#f8f8f8;
        }
        .iconfont{
          color:#fff;
          font-size:5vw;
          border:1px solid #ccc;
          border-radius:50%;
          margin:0 4vw;
        }
        .active{
          color:@red-color;
          border-color:transparent;
        }
      }
      
      
    }
    .upload{
      margin:3vw 4vw 0 13vw;
      .img-list{
        display: flex;
        align-items: center;
        // justify-content: fle
        flex-wrap: wrap;
        li{
          position:relative;
          width:21.3vw;
          height:21.3vw;
          margin-right:5vw;
          // border: 1px solid #ccc;
          margin-bottom:2vw;
          box-sizing: border-box;
          overflow:hidden;
          img{
            width:100%;
          }
          .delete{
            position: absolute;
            top:1vw;
            right:1vw;
            font-size:3.8vw;
            color: @red-color;
          }
        }
        li:nth-child(3n+0){
          margin-right:0;
        }
        
      }
      .icon{
        position:relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width:50px;
        height:50px;
        border:1px solid #ddd;
        border-radius:5px;
        // margin-left:5vw;
        .iconfont{
          font-size:5.5vw;
          color:#ccc;
        }
      }
      input{
        position: absolute;
        top:0;
        left:0;
        right:0;
        bottom:0;
        width:100%;
        height:100%;
        opacity: 0;
      }
    }
    
  }
}
</style>
