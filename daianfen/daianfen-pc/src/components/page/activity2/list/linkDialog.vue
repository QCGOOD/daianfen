<template>
  <el-dialog
    title="活动链接"
    :visible.sync="visible"
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="close"
    width="880px">
    <div class="link-box">
      <el-menu default-active="0" class="left-tab" @select="handleSelect">
        <el-menu-item :index="i + ''" v-for="(item, i) in channel" :key="i">
          <span slot="title">{{item.name}}</span>
        </el-menu-item>
      </el-menu>
      <div class="right-link" v-loading="dataLoading">
        <div v-for="(item, i) in shareList" :key="i" class="share-box" >
          <p>{{item.name}}</p>
          <div style="display: flex;">
            <el-input size="small" v-model="item.shareLink" style="width: 500px;"></el-input>
            <el-button size="mini" type="primary" style="margin: 0 15px;" @click="copy(item.shareLink)">复制</el-button>
            <el-popover placement="right" width="160" trigger="click">
              <!-- <img :src="item.checkinQrcodeUrl" alt="" style="width: 100%;"> -->
              <qrcode 
                :value="item.shareLink" 
                v-if="item.shareLink" 
                tag="img"
                :options="options"
                >
              </qrcode>
              <el-button slot="reference" type="primary" size="small" ref="test">二维码</el-button>
            </el-popover>
          </div>
        </div>
        <p v-if="shareList.length === 0">暂无渠道</p>
      </div>
    </div>
    <!-- <el-button type="primary" size="small" @click="test">测试</el-button> -->
    <span slot="footer" class="dialog-footer">
      <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
      <el-button type="primary" @click="close()" size="small">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import api from "api/common";
import Qrcode from '@xkeshi/vue-qrcode'

export default {
  components: {
    Qrcode,
  },
  props: {
    id: String,
    visible: Boolean,
    channel: Array,
  },
  data() {
    return {
      shareBase: `${this.base.baseHost}${this.base.projectName()}/mobile/POUND/activity/detail`,
      shareList: [],
      options: {
        size: 160
      },
      dataLoading: false,
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.dataLoading = true;
        this.listChannelCode(this.channel[0].id)
      }
    }
  },
  methods: {
    test() {

    },
    close() {
      this.$emit("close");
    },
    handleSelect(key) {
      console.log(key)
      this.dataLoading = true;
      this.listChannelCode(this.channel[key].id)
    },
    listChannelCode(id) {
      api.listChannelCode({ pageSize: 100, channelId: id }).then(res => {
        this.dataLoading = false;
        console.log(res.data);
        this.shareList = res.data.data.list.map(item => {
          let res = {};
          res.name = item.name;
          res.shareCode = `${
            this.shareBase
          }?wo=1&wot=2&woacm=1&mpl=1&ch=1&chc=${item.code}`;
          return res;
        });
        
        this.shareList.map(item => {
          item.shareLink = `${item.shareCode}&id=${this.id}`;
        });
        console.log("shareList === ", this.shareList.length);
      });
    },
    copy(shareLink) {
      let oInput = document.createElement("input");
      oInput.value = shareLink;
      document.body.appendChild(oInput);
      oInput.select();
      document.execCommand("copy");
      oInput.style.display = 'none';
      document.body.removeChild(oInput);
      this.$message({
        message: "复制成功",
        type: "success"
      });
    },
  }
}
</script>

<style lang="less" scoped>
.link-box {
  display: flex;
  .left-tab {
    flex-shrink: 0;
  }
  .right-link {
    padding: 0 30px;
  }
  .share-box {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
