<template>
  <div class="editor" :style="{'width': `${config.initialFrameWidth}px`}">
    <el-button size="mini" type="primary" class="upload-img" @click="openImgBox()">上传图片</el-button>
    <div type="text/plain" ref="editor"></div>
    <image-dialog :visible="digImgWrap" imageType='activity' @close-imgbox="closeImgbox" @get-imgsrc="onGetImgsrc"></image-dialog>
  </div>
</template>

<script>
import '../../../static/ueditor/ueditor.config.js'
import '../../../static/ueditor/ueditor.all.min.js'
import '../../../static/Ueditor/lang/zh-cn/zh-cn.js'
import '../../../static/Ueditor/ueditor.parse.min.js'
import ImageDialog from "./ImageDialog"

export default {
  props: {
    content: String,
    configs: Object,
  },
  components: {
    ImageDialog,
  },
  computed: {
    config () {
      let config = Object.assign(this.default, this.configs)
      console.log(config)
      return config
    }
  },
  data () {
    return {
      editor: null,
      id: Math.random().toString(36).substr(2) + 'ueditorId',
      digImgWrap: false,
      default: {
        initialFrameWidth: 780,
        initialFrameHeight: 500,
        toolbars: [
          [              
            'bold', 'italic', 'underline',  '|', 
            'forecolor', 'backcolor', '|',
            'emotion', 'insertimage', 'insertvideo', 'map','horizontal','|',
            'fontfamily', 'fontsize', '|',   
            'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',             
            'indent', '|',
            'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',
            'link', 'unlink', '|',
            'undo', 'redo','removeformat',  'pasteplain', 'source',
            'fullscreen','|'
          ]
        ],
      }
    }
  },
  mounted () {
    // console.log('id', this.id)
    this.$nextTick(() => {
      this.$refs.editor.id = this.id
      this.editor = UE.getEditor(this.id, this.config)
      this.editor.ready(() => {
        this.editor.setContent(this.content || '')
        this.editor.addListener('contentChange', () => {
          this.getContent()
        })
      })
    })
  },
  watch: {
    content (val) {
      this.$nextTick(() => {
        this.$refs.editor.id = this.id
        if (!this.editor) this.editor = UE.getEditor(this.id, this.config)
        
        this.editor.ready(() => {
          this.editor.setContent(this.content || '')
          this.editor.addListener('contentChange', () => {
            this.getContent()
          })
        })
      })
    }
  },
  methods: {
    // 设置content
    setContent (content) {
      this.editor.ready(() => {
        this.editor.setContent(content || '')
      })
    },
    // 获取content
    getContent () {
      this.$emit('get-content', this.editor.getContent())
    },
    beforeFileUpload (file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG/PNG 格式!");
      }
      return isJPG
    },
    imgSuccess (res, file, fileList) {
      if (res.code === 20000) {
        this.insertimage(this.imgHost + res.data.imageUrl)
      } else {
        this.$message({
          message: res.message,
          type: "error"
        });
      }
    },
    imgFail (err, file, fileList) {
      console.log("上传失败 ", err, file, fileList);
      this.$message({
        message: err.data.message,
        type: "error"
      });
    },
    insertimage (url) {
      this.editor.execCommand( 'insertimage', {
        src: url,
        width: 375,
      });
    },
    // 打开图片对话框
    openImgBox () {
      this.digImgWrap = true
    },
    // 关闭图片对话框
    closeImgbox (state) {
      this.digImgWrap = false
    },
    // 单张图片
    onGetImgsrc (val) {
      // this.model.iconUrl = val
      this.insertimage(this.imgHost + val)
    },
  },
  destoryed () {
    this.editor.destory();
  },
}
</script>

<style lang="less">
.editor {
  line-height: 1.2;
  position: relative;
  .upload-img {
    position: absolute;
    z-index: 1000;
    top: 28px;
    right: 3px;
    width: 60px;
    height: 25px;
    padding: 0;
  }
}

</style>
