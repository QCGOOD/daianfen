<template>
  <div class="wrap" ref="wrap" :style="{'height': `${wrapHeight}px`}">
     <div class="data-setting" :style="{'height': `${mainHeight}px`}">
      <el-form class="form" :model="form" ref="model" label-position="top" size="small">
        <el-form-item v-if="filterItem(key)" v-for="(item, key) in form" :key="key" class="setting-item" label="" prop="">
          <p class="title">{{item.name}}</p>
          <span class="tips">PS:{{item.description}}</span>
          <div class="setting-item-content">
            <el-input class="input" placeholder="请输入数值" v-model="item.content" clearable></el-input>
            <el-button size="small" @click.native="save(item, item.code)">保存</el-button>
          </div>
        </el-form-item>
        <!-- <el-form-item class="setting-item" label="" prop="" :rules="[{ required: true, message: '该字段不能为空', trigger: 'blur'}]">
          <p class="title">{{form.resTimesLimit.name}}</p>
          <span class="tips">PS:{{form.resTimesLimit.description}}</span>
          <div class="setting-item-content">
            <el-input class="input" placeholder="请输入数值" v-model="form.resTimesLimit.content" clearable></el-input>
            <el-button size="small" @click.native="save(form.resTimesLimit, form.resTimesLimit.code)">保存</el-button>
          </div>
        </el-form-item> -->
        <!-- 优惠券起始编号 -->
        <el-form-item class="setting-item" label="" prop="" :rules="[{ required: true, message: '该字段不能为空', trigger: 'blur'}]">
          <p class="title">{{form.couponsStart.name}}</p>
          <span class="tips">PS:{{form.couponsStart.description}}</span>
          <div style="margin:10px 0 0 10px;;">
            <el-tag
              v-for="(tag, i) in couponsStart"
              :key="i"
              type="info"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)">
              {{tag}}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            >
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加</el-button>
            <!-- <el-input style="width:400px;margin-left:10px;" placeholder="请输入标题" v-model="form.couponsStart.content" clearable></el-input> -->
            <br>
            <el-button style="margin-top:15px;" size="small" @click.native="save(form.couponsStart, form.couponsStart.code)">保存</el-button>
          </div>
        </el-form-item>
        <!-- 预约提醒 -->
        <el-form-item class="setting-item" label="" prop="" :rules="[{ required: true, message: '该字段不能为空', trigger: 'blur'}]">
          <p class="title">{{form.reservationRemind.name}}</p>
          <span class="tips">PS:{{form.reservationRemind.description}}</span>
          <div style="margin-left:10px;">
            <div style="margin:15px 0px;">
              <span style="color:#606060;">标题：</span>
              <el-input style="width:400px;margin-left:10px;" placeholder="请输入标题" v-model="remind.title" clearable></el-input>
            </div>
            <div style="margin:15px 0px;">
              <span style="color:#606060;">内容：</span>
              <el-input style="width:400px;margin-left:10px;" placeholder="请输入内容" v-model="remind.remark" clearable></el-input>
            </div>
            <el-button size="small" @click.native="save(form.reservationRemind, form.reservationRemind.code)">保存</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  components: {

  },
  data () {
    return {
      wrapHeight: 0,
      mainHeight: 0,
      form: {},
      model: {},
      remind: {
        title: '',
        remark: ''
      },
      couponsStart: [],
      inputVisible: false,
      inputValue: ''
    }
  },
  created () {
    this.apiGetConfig()
  },
  mounted() {
    this.getHeights();
    window.onresize = () => {
      this.getHeights();
    };
  },
  methods: {
    // 设置高度
    getHeights() {
      this.wrapHeight = window.innerHeight - 162;
      this.mainHeight = this.wrapHeight;
    },
    // 获取配置列表
    apiGetConfig(){
      this.$http.get('/config/list')
      .then(res => {
        this.form = res.data.content0
        // 预约提醒
        this.remind = JSON.parse(res.data.content0.reservationRemind.content)
        // 起始编号
        // this.couponsStart = JSON.parse(JSON.parse(res.data.content0.couponsStart.content))
        this.couponsStart = JSON.parse(res.data.content0.couponsStart.content)
      })
    },
    // 根据code获取配置
    apiGetCodeConfig(code){
      this.$http.get('/config/getByCode', {code: code})
      .then(res => {
        this.form[code] = res.data.content0
      })
    },
    // 更新配置
    apiUpDate(model, code) {
      this.$http.post('/config/update', model)
      .then(res => {
        this.$message.success('更新成功');
        // this.apiGetConfig()
        this.apiGetCodeConfig(code)
      })
    },
    // 提交
    save(model, code) {
      this.model = model
      this.apiUpDate(this.model, code)
    },
    // 删除标签
    handleClose(tag) {
      this.couponsStart.splice(this.couponsStart.indexOf(tag), 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 标签输入
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.couponsStart.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    // 过滤可循环的配置
    filterItem(code) {
      if (code === '') return false;
      switch(code)
      {
      case 'couponsRemindCount':
        return true
        break;
      case 'resDateCount':
        return true
        break;
      case 'remindEmail':
        return true
        break;
      case 'resTimesLimit':
        return true
        break;
      default:
        return false;
      }
    }
  },
  watch: {
    couponsStart() {
      this.form.couponsStart.content = JSON.stringify(this.couponsStart)
    }
  },
  filters: {
    
  }
}
</script>
<style lang="less" scoped>

.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

.data-setting {
  padding: 20px;
}
.bottom-btn {
  text-align: center;
  height: 60px;
  line-height: 60px;
  border-top: 1px solid #e7eaec;
}
.setting-item{
  border-bottom:1px solid #e4e4e4;
  padding-top:10px;
  padding-bottom:40px;
  &:last-child{
    border-bottom:0;
  }
  .title{
    position: relative;
    padding:0;
    padding-left: 10px;
    font-size:16px;
    height:26px;
    &::before{
      content: '';
      position: absolute;
      top: 0.4em;
      left: 0;
      width: 0;
      height: 18px;
      border-left: 2px solid #000;
    }
  }
  .tips{
    font-size: 13px;
    color: #808080;
    padding-left: 1em;
  }
  .input{
      width:200px;
      margin-right:20px;
    }
  .setting-item-content{
    display: flex;
    align-items: center;
    margin:10px 0 0 10px;
    
  }
}

</style>

