<template>
  <!-- <iframe :srcdoc="html" v-if="html" id="frame" style="width:100%;border:none;"/> -->
  <div v-html="html"></div>
</template>

<script>
export default {
  props: {
    html: {
      type: String,
      default: ""
    }
  },
  mounted() {
    this.setIframeHeight(document.getElementById("frame"));
  },
  methods: {
    setIframeHeight(iframe) {
      if (iframe) {
        setTimeout(() => {
          var iframeWin = iframe.contentWindow || iframe.contentDocument.parentWindow;
          iframe.height = iframeWin.document.getElementsByTagName('html')[0].offsetHeight
        }, 1000);
      }
    }
  },
};
</script>

<style>
</style>
