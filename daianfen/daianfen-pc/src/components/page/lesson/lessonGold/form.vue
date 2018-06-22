<template>
<el-dialog title="添加商品" :visible.sync="visible" width="1080px" top="5vh" :append-to-body="true" :before-close="close" :close-on-click-modal="false" :close-on-press-escape="false">
  <div style="overflow: auto;">
    <el-menu mode="horizontal" :default-active="activeIndex" @select="handleSelect">
      <el-menu-item v-for="(item, i) in sidebarList" :key="i" :index="item.index">{{item.title}}</el-menu-item>
    </el-menu>
    <div class="content">
      <div v-show="activeIndex === '1'">
        <el-form :model="basic" ref="model" label-width="80px">
          <el-form-item label="商品品牌" prop="brandId" :rules="[{ required: true, message: '该字段不能为空'}]">
            <el-select v-model="basic.brandId" size="small">
              <el-option :label="item.title" :value="item.id" v-for="(item, i) in goodsBrandList" :key="i"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品名称" prop="name" :rules="[{ required: true, message: '该字段不能为空'}]">
            <el-input size="small" v-model="basic.name" style="width:400px;"></el-input>
          </el-form-item>
          <el-form-item label="缩略图" prop="iconUrl" :rules="[{ required: true, message: '该字段不能为空'}]">
            <!-- <up-load :imgSrc="model.thumbnail" type="icon" @getImg="getImg"></up-load> -->
            <div class="upload-img-box" @click="openImgBox('radio')">
              <img v-if="basic.iconUrl" :src="`${imgHost}/${basic.iconUrl}`" style="width: 120px;">
              <i v-else class="el-icon-plus upload-icon"></i>
            </div>
          </el-form-item>
          <el-form-item label="是否上架" :rules="[{ required: true, message: '该字段不能为空'}]">
            <el-radio-group v-model="basic.isSell">
              <el-radio :label="false">下架</el-radio>
              <el-radio :label="true">上架</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否发布" :rules="[{ required: true, message: '该字段不能为空'}]">
            <el-radio-group v-model="basic.isRelease">
              <el-radio :label="false">否</el-radio>
              <el-radio :label="true">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- <el-form-item label="店家推荐" :rules="[{ required: true, message: '该字段不能为空'}]">
            <el-radio-group v-model="basic.shop">
              <el-radio :label="false">否</el-radio>
              <el-radio :label="true">是</el-radio>
            </el-radio-group>
          </el-form-item> -->
          <el-form-item label="排序" prop="seqNum" :rules="[{ required: true, message: '该字段不能为空'}]">
            <el-input-number size="small" v-model="basic.seqNum" style="width:200px;"></el-input-number>
            <span>数字越小越靠前</span>
          </el-form-item>
        </el-form>
      </div>
      <div v-show="activeIndex === '2'">
        <!-- <div>
          <div id="toolbar" style="background: #e8e8e8;"></div>
          <div id="editorElem" style="border:1px solid #f2f2f2;height:300px;"></div>
        </div>
        <el-button @click="getContent">查看内容</el-button> -->
        <div style="width: 400px; height: 300px;">
          <!-- <div id="editor" type="text/plain" style="width: 400px; height: 300px;"></div> -->
          <!-- <script id='editor' type="text/plain"></script> -->
          <el-button @click="getContent">查看内容</el-button>
        </div>
      </div>
      <div v-show="activeIndex === '3'">
        <el-form :model="model" ref="model" label-width="80px">
          <el-form-item label="商品相册" >
            <div class="img-box">
              <div class="item" v-for="(item, i) in imgList" :key="i" >
                <img :src="`${imgHost}${item.url}`" alt="">
                <i class="el-icon-error" @click="deleteImg(i)"></i>
              </div>
              <div class="item-upload" @click="openImgBox('select')">
                <i class="el-icon-plus"></i>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div v-show="activeIndex === '4'">
        <up-load-file @on-handle="handle"></up-load-file>
      </div>
      <div v-show="activeIndex === '5'">
        <div class="form">
          <el-form label-width="90px">
            <el-form-item label="商品规格">
              <div class="property-box">
                <div class="property-item" v-for="(item, i) in property" :key="i">
                  <div class="name">
                    <el-input size="small" style="width: 200px;" v-model="item.specName" placeholder="编辑名称"></el-input>
                    <el-button type="danger" icon="el-icon-delete" circle class="delete-btn" @click="delProperty(i)"></el-button>
                  </div>
                  <div class="value">
                    <div  class="input" v-for="(label, index) in item.specValue" :key="index">
                      <el-input size="small" v-model="label.value"></el-input>
                      <i class="iconfont icon-shanchu" @click="delValue(i, index)"></i>
                    </div>
                    <div class="btn" @click="addVaule(i)">
                      <el-button size="small" type="primary">添加</el-button>
                    </div>
                  </div>
                </div>
                <el-button size="small" type="success" style="width: 150px;" @click="addProperty()" v-if="property.length < 4">添加规格</el-button>
              </div>
              <table class="property-table" v-if="property.length">
                  <tr>
                    <th v-for="(item, i) in tableTitle" :key="i">
                      {{item.title}}
                      <div class="input-group" v-if="item.isInput">
                        <el-input size="small" v-model="item.value"></el-input>
                        <el-button size="small" type="success" icon="el-icon-check" style="padding: 9px;" @click="setSyncPrice(item, i)"></el-button>
                      </div>
                    </th>
                  </tr>
                  <tr v-for="(item, i) in tableBody" :key="i">
                    <td v-for="(label, index) in item.itemValue" :key="index" v-if="!label.hidden" :rowspan="label.rowspan">
                      <el-input size="small" v-model="label.value" :placeholder="label.placeholder" v-if="label.isInput"></el-input>
                      <span v-else>{{label.value}}</span>
                    </td>
                    <!-- <td v-else :rowspan="label.rowspan">{{label.value}}</td> -->
                  </tr>
              </table>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <image-dialog :visible="digImgWrap" :uploadType="uploadType" @close-imgbox="onCloseImgbox" @get-imgsrc="onGetImgsrc" @get-imglistsrc="onGetImglistsrc"></image-dialog>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="close(false)">取 消</el-button>
    <el-button size="small" type="primary" @click="success()">确 定</el-button>
  </span>
</el-dialog>
</template>

<script>
import api from "api/common.js";
import UpLoadFile from "common/UpLoadFile"
import ImageDialog from "common/ImageDialog"

export default {
  components: {
    UpLoadFile, ImageDialog
  },
  props: {
    visible: Boolean,
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      value: '',
      digImgWrap: false,
      model: {
        goodsType: '', 
        goodsBrand: '',
        goodsTitle: '',
        thumbnail: '',
        onSale: true,
        hotProducts: false,
        shop: false,
        sort: '',
        imgList: [],
        content: '',
      },
      basic: {
        name: '',
        brandId: '',
        iconUrl: '',
        isSell: true,
        isRelease: true,
        seqNum: '',
      },
      intro: {
        content: '',
      },
      rollingImgUrl: {
        rollingImgUrl: '',
      },
      price: {
        origPrice: '',
        price: '',
        vipPrice: '',
        promotionPrice: '',
        isPromotion: false,
        minPrice: '',
        maxPrice: '',
        startTime: '',
        endTime: '',
        level: '',
        qty: '',
        saleNumber: '',
      },
      sidebarList: [
        { index: '1', title: '基本信息' },
        { index: '2', title: '简介信息' },
        { index: '3', title: '相册' },
        { index: '4', title: '配送方式' },
        { index: '5', title: '库存规格' },
      ],
      activeIndex: '5',
      goodsTypeList: [
        { id: '1', title: '分类一'},
        { id: '2', title: '分类二'},
        { id: '3', title: '分类三'},
        { id: '4', title: '分类四'},
      ],
      goodsBrandList: [
        { id: '1', title: '品牌一'},
        { id: '2', title: '品牌二'},
        { id: '3', title: '品牌三'},
        { id: '4', title: '品牌四'},
      ],
      imgList: [
        { url: `attachments/assets/lingquan.png` },
        { url: `attachments/assets/lingquan2.png` },
        { url: `attachments/assets/logo.png` },
        { url: `attachments/assets/logo.png` },
        { url: `attachments/assets/logo.png` },
        { url: `attachments/assets/logo.png` },
        { url: `attachments/assets/logo.png` },
      ],
      uploadType: 'radio',
      limit: 1,
      input: [
        { value: '' },
      ],
      property: [],
      tableTitle: [
        { title: '现价', value: '', isInput: true },
        { title: 'VIP价', value: '', isInput: true },
        { title: '促销价', value: '', isInput: true },
        { title: '库存', value: '', isInput: true },
        { title: '销量', value: '', isInput: true },
      ],
      tableBody: [
        {
          itemValue: [
            { value: '', placeholder: '现价', isInput: true },
            { value: '', placeholder: 'VIP价', isInput: true },
            { value: '', placeholder: '促销价', isInput: true },
            { value: '', placeholder: '库存', isInput: true },
            { value: '', placeholder: '销量', isInput: true },
          ]
        }
      ],
      itemValue: {},
      editor: null,
    }
  },
  mounted () {
    // this.$nextTick(() => {
    //   editor.customConfig.uploadImgHooks = {
    //     customInsert: (insertImg, result, editor) => {
    //       insertImg(`${this.imgURL}/${result.imageUrl}`);
    //     }
    //   };
    //   editor.customConfig.onchange = html => {
    //     this.model.content = html
    //   }
    //   editor.create()
    // })
    // this.editor = UE.getEditor('editor')
  },
  methods: {
    getContent () {
      console.log(this.model.content)
    },
    handle () {
      console.log('handle')
    },
    handleSelect (index) {
      if (index === this.activeIndex) return
      this.activeIndex = index
      console.log(this.activeIndex)
    },
    openImgBox (type) {
      this.uploadType = type
      this.digImgWrap = true
    },
    onCloseImgbox (state) {
      this.digImgWrap = false
    },
    detail (id) {
      api.detailGoods(id).then(res => {
        let model = Object.assign({}, res.data.data)
        model.quantity = model.quantity / 100
        model.giftQuantity = model.giftQuantity / 100
        model.amount = model.amount / 100
        model.onSale = model.onSale ? '1' : '0'
        this.model = Object.assign({}, model)
      })
    },
    save (model) {
      model.quantity = model.quantity * 100
      model.giftQuantity = model.giftQuantity * 100
      model.amount = model.amount * 100
      console.log('model === ', model)
      api.saveGoods(model).then(res => {
        this.$message({
          message: "添加成功",
          type: "success"
        })
        this.close(true)
      })
    },
    update (id, model) {
      model.quantity = model.quantity * 100
      model.giftQuantity = model.giftQuantity * 100
      model.amount = model.amount * 100
      api.updateGoods(id, model).then(res => {
        this.$message({
          message: "修改成功",
          type: "success"
        });
        this.close(true)
      })
    },
    success () {
      console.log(this.basic)
      return false
      this.$refs.model.validate(valid => {
        if (valid) {
          if (this.id != "") {
            this.update(this.id, this.model)
          } else {
            this.save(this.model)
          }
        } else {
          return false
        }
      })
    },
    close(flag) {
      this.activeIndex = '1'
      this.model.previewImage = "";
      this.$refs.model.resetFields()
      this.$emit("close", flag)
    },
    onGetImgsrc (val) {
      this.basic.iconUrl = val
    },
    onGetImglistsrc (list, state) {
      console.log('onGetImglistsrc', list, state)
      if (state === 1) {
        list.map((item, i) => {
          let url = item.response.data
          this.imgList.push({url: url})
        })
      } else {
        list.map((item, i) => {
          let url = item.imgsrc
          this.imgList.push({url: url})
        })
      }
    },
    deleteImg (i) {
      this.imgList.splice(i, 1)
    },
    getItemValue () {
      let itemValue = [
        { value: '', placeholder: '现价', isInput: true },
        { value: '', placeholder: 'VIP价', isInput: true },
        { value: '', placeholder: '促销价', isInput: true },
        { value: '', placeholder: '库存', isInput: true },
        { value: '', placeholder: '销量', isInput: true },
      ]
      return itemValue
    },
    addProperty () {
      let data = {
        specName: '',
        specValue: [
          { value: '' },
        ]
      }
      this.property.push(data)
      let index = this.property.length - 1
      this.tableTitle.splice(index, 0, { title: '', index: index })
      this.tableBody.map((item, i) => {
        item.itemValue.splice(index, 0, { value: '', rowspan: 1 })
      })
    },
    delProperty (i) {
      this.property.map((item, index) => {
        if (index > i) {
          this.tableTitle[index].index = this.tableTitle[index].index - 1
        }
      })
      this.property.splice(i, 1)
      this.tableTitle.splice(i, 1)
      
      let count = 1
      this.property.map((item, i) => {
        count *= item.specValue.length
      })
      this.tableBody = []
      for (let i = 0; i < count; i++) {
        this.tableBody.push({ itemValue: this.getItemValue() })
      }
      this.setItemValue()
    },
    setItemValue () {
      this.tableBody.map((item, i) => {
        let count = this.tableTitle.length - item.itemValue.length
        if (count !== 0) {
          for (let i = 0; i < count; i++) {
            item.itemValue.splice(0, 0, { value: '', rowspan: 1 })
          }
        }
      })
      let total = 1
      this.property.map((item, i) => {
        total *= item.specValue.length
      })
      this.property.map((item, i) => {
        let count = 1
        let index = 0
        for (let j = 0; j <= i; j++) {
          count *= this.property[j].specValue.length
        }
        index = total / count
        this.tableBody.map((body, v) => {
          if (v % index === 0) {
            body.itemValue[i].rowspan = index
            body.itemValue[i].hidden = false
          } else {
            body.itemValue[i].hidden = true
          }
        })
      })
    },
    addVaule (index) {
      this.property[index].specValue.push({ value: '' })
      if (this.property.length <= 1) {
        this.tableBody.push({ itemValue: this.getItemValue() })
      } else {
        let itemLength = this.property[index].specValue.length
        let total = 1
        this.property.map((item, i) => {
          total *= item.specValue.length
        })
        let count = itemLength - 1
        for (let i = 0; i < total / itemLength; i++) {
          this.tableBody.splice(count, 0, { itemValue: this.getItemValue() })
          count += itemLength
        }
      }
      this.setItemValue()
    },
    delValue (i, index) {
      let length = this.property[i].specValue.length
      if (length === 1) {
        this.$alert('规格最少需要一个属性值', '信息', {
          confirmButtonText: '确定',
        })
        return false
      }
      if (i > 0) {
        let frontTotal = 1
        let afterTotal = 1
        this.property.map((item, i) => {
          frontTotal *= item.specValue.length
        })

        this.property[i].specValue.splice(index, 1)
        this.property.map((item, i) => {
          afterTotal *= item.specValue.length
        })
        let count = this.property[i].specValue.length
        for (let i = 0; i < frontTotal - afterTotal; i++) {
          this.tableBody.splice(index, 1)
          index += count
        }
      } else {
        this.property[i].specValue.splice(index, 1)
        let itemLength = this.tableBody.length / length
        this.tableBody.splice(itemLength * index, itemLength)
      }
      this.setItemValue()
    },
    setSyncPrice(item, i) {
      console.log(item, i)
      this.tableBody.map((label, v) => [
        label.itemValue[i].value = item.value
      ])
    }
  },
  watch: {
    property: {
      handler (val) {
        let length = val.length
        if (length === 0) return
        let total = 1
        this.property.map((item, i) => {
          total *= item.specValue.length
        })


        val.map((item, i) => {
          if (this.tableTitle[i].index === i) {
            this.tableTitle[i].title = item.specName
          }

          let total = 1
          this.property.map((label, k) => {
            if (k > i) {
              total *= label.specValue.length
            }
          })
          let times = 1
          for (let d = i - 1; d >= 0; d--) {
            times *= val[d].specValue.length
          }
          let index = 0
          for (let m = 0; m < times; m++) {
            for (let j = 0; j < item.specValue.length; j++) {
              for (let r = 0; r < total; r++) {
                console.log('item.specValue[j].value', item.specValue[j].value)
                console.log('index', index)
                this.tableBody[index].itemValue[i].value = item.specValue[j].value
                index++
              }
            }
          }
        })
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
.el-menu-item.is-active {
  color: #fff !important;
  background: #337ab7 !important;
  border: 0;
}
.el-menu--horizontal .el-menu-item {
  height: 40px !important;
  line-height: 40px !important;
}
.content {
  padding: 10px 0;
}
.upload-img-box {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 6px;
  border: 1px dashed #d9d9d9;
  overflow: hidden;
  cursor: pointer;
  &:hover {
    border-color: #409eff;
  }
  .upload-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
}
.img-box {
  display: flex;
  align-content: flex-start;
  flex-wrap: wrap;
  .item {
    position: relative;
    width: 100px;
    height: 100px;
    border: 1px solid #eee;
    overflow: hidden;
    cursor: pointer;
    position: relative;
    margin: 0 6px 6px 0;
    flex-shrink: 0;
    &:nth-child(7n) {
      margin: 0 0 6px 0;
    }
    img {
      width: 100%;
    }
    .el-icon-error {
      position: absolute;
      top: 5px;
      right: 5px;
      font-size: 20px;
      color: #c5c5c5;
    }
  }
  .item-upload {
    position: relative;
    width: 100px;
    height: 100px;
    border-radius: 6px;
    border: 1px dashed #d9d9d9;
    overflow: hidden;
    cursor: pointer;
    line-height: 100px;
    text-align: center;
    &:hover {
      border-color: #409eff;
    }
    i {
      font-size: 26px;
      color: #8c939d;
    }
  }
}
.form {
  height: 550px;
  overflow-y: scroll;
}
.property-box {
  border: 1px solid #e7eaec;
  padding: 15px;
  width: 869px;
  .property-item {
    border-left: 3px solid rgba(0,0,0,0.2);
    margin-bottom: 20px;
    .name {
      background: rgba(0,0,0,0.035);
      padding: 10px 10px 10px 15px;
      display: flex;
      justify-content: space-between;
      .delete-btn {
        display: none;
      }
      &:hover {
        background: rgba(0,0,0,0.05);
        .delete-btn {
          display: block;
        }
      }
    }
    .value {
      display: flex;
      align-content: flex-start;
      flex-wrap: wrap;
      .input {
        width: 150px;
        margin: 15px 0 0 15px;
        flex-shrink: 0;
        position: relative;
        overflow: hidden;
        i {
          font-size: 14px;
          position: absolute;
          right: -15px;
          top: 0;
          transition: all .3s ease;
        }
        &:hover {
          i {
            right: 3px;
            cursor: pointer;
          }
        }
      }
      .btn {
        margin: 15px 0 0 15px;
      }
    }
    &:hover {
      border-color: #337ab7;
    }
  }
}
.property-table {
  border: 1px solid #e7eaec;
  margin-top: 20px;
  width: 900px;
  border-spacing: 0;
  border-collapse: collapse;
  tr {
    th {
      padding: 15px 12px;
      line-height: 1.5;
      .input-group {
        display: flex;
      }
    }
    td {
      border-top: 1px solid #e7eaec;
      line-height: 1.5;
      padding: 15px 12px;
      text-align: center;
    }
  }
}
</style>
