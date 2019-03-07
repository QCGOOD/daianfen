import wx from "weixin-js-sdk";
import api from "../api/common";

export default {
  configApiList(obj, jsApiList) {
    wx.config({
      debug: false,
      appId: obj.appId,
      timestamp: obj.timestamp,
      nonceStr: obj.nonceStr,
      signature: obj.signature,
      jsApiList: jsApiList
    });
  },

  loadJsapiTicketSign() {
    let jsApiList = [
      "scanQRCode",
      // "onMenuShareTimeline",
      // "onMenuShareAppMessage",
      // "chooseWXPay",
      // "hideMenuItems",
      // "chooseImage",
      // "uploadImage",
      // "previewImage"
    ];
    let signUrl = location.href.split("#")[0];
    api.getWeixin({ url: signUrl }).then(res => {
      // alert(JSON.stringify(res.data.content0))
      this.configApiList(res.data.content0, jsApiList);
    });
  },
  // 转发分享
  onMenuShare(title, desc, link, imgUrl, cb) {
    wx.ready(() => {
      let dataForWeixin = {
        title: title,
        desc: desc,
        link: link,
        imgUrl: imgUrl,
        success: () => {
          cb && cb(link);
        },
        cancel: () => {
          // alert('分享失败')
        }
      };
      wx.onMenuShareTimeline(dataForWeixin);
      wx.onMenuShareAppMessage(dataForWeixin);
    });
    wx.error(err => {
      alert(JSON.stringify(err));
    });
    // let jsApiList = ['onMenuShareTimeline', 'onMenuShareAppMessage']
    // this.loadJsapiTicketSign(jsApiList)
  },

  // 微信支付
  chooseWXPay(model, success) {
    wx.ready(() => {
      let dataForWeixin = {
        timestamp: model.timeStamp,
        nonceStr: model.nonceString,
        package: model.pack,
        signType: model.signType,
        paySign: model.paySign,
        success: res => {
          success && success();
        },
        cancel: () => {
          alert(`取消支付`);
        }
      };
      wx.chooseWXPay(dataForWeixin);
    });
    wx.error(() => {});
    // let jsApiList = ['chooseWXPay']
    // this.loadJsapiTicketSign(jsApiList)
  },

  // 图片预览
  previewImage(ccurPath, paths) {
    wx.ready(() => {
      wx.previewImage({
        current: ccurPath, // 当前显示图片的http链接

        urls: paths // 需要预览的图片http链接列表
      });
      // callback(localIds)
    });
    wx.error(err => {
      alert(JSON.stringify(err));
    });
  },
  // 选择图片
  chooseImg(callback) {
    wx.ready(() => {
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ["compressed"], // 可以指定是原图还是压缩图，默认二者都有 'original',
        sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
          var localIds = res.localIds[0]; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          callback && callback(localIds);
        }
      });
    });
    wx.error(err => {
      alert(JSON.stringify(err));
    });
  },

  // 上传图片
  upLoadImg(localIds, callback) {
    wx.ready(() => {
      wx.uploadImage({
        localId: localIds, // 需要上传的图片的本地ID，由chooseImage接口获得
        isShowProgressTips: 1, // 默认为1，显示进度提示
        success: function(res) {
          var serverId = res.serverId; // 返回图片的服务器端ID
          callback && callback(serverId);
        }
      });
    });
    wx.error(err => {
      alert(JSON.stringify(err));
    });
  },

  // 扫码
  scanQRCode(cb) {
    wx.ready(() => {
      let data = {
        needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: function(res) {
          var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
          cb && cb(result);
        }
      };
      wx.scanQRCode(data);
    });
    wx.error(err => {
      alert(JSON.stringify(err));
    });
    // let jsApiList = ['scanQRCode']
    // this.loadJsapiTicketSign(jsApiList)
  },
  hideMenuItems() {
    wx.ready(() => {
      wx.hideMenuItems({
        menuList: ["menuItem:copyUrl"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
      });
    });
  },
  onBridgeReady() {
    WeixinJSBridge.call("hideOptionMenu");
  },
  // 隐藏菜单
  hideOptionMenu() {
    console.log(1);
    if (typeof WeixinJSBridge == "undefined") {
      if (document.addEventListener) {
        document.addEventListener(
          "WeixinJSBridgeReady",
          this.onBridgeReady,
          false
        );
      } else if (document.attachEvent) {
        document.attachEvent("WeixinJSBridgeReady", this.onBridgeReady);
        document.attachEvent("onWeixinJSBridgeReady", this.onBridgeReady);
      }
    } else {
      this.onBridgeReady();
    }
  }
};
