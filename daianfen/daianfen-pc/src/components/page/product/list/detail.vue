<template>
  <div class="wrap" ref="wrap">
    <div class="tabbar">
      <div class="item" :class="{'active': i + 1 === activeIndex}" v-for="(item, i) in tabbar" :key="i" @click="handleSelect(item.index)">
        {{item.name}}
      </div>
      <el-button type="primary" size="mini" class="back" @click="back()">返回</el-button>
    </div>
    <div class="context-box" :style="{'height': `${areaHeight}px`}" ref="context">
      <div v-show="activeIndex === 1">
        <el-form :model="model" ref="model" label-width="80px">
          <el-form-item label="商品品牌" prop="brandId" :rules="[{ required: true, message: '该字段不能为空'}]">
            <el-select v-model="model.brandId" size="small">
              <el-option :label="item.name" :value="item.id" v-for="(item, i) in brandList" :key="i"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品名称" prop="name" :rules="[{ required: true, message: '该字段不能为空'}]">
            <el-input size="small" v-model="model.name" style="width:400px;"></el-input>
          </el-form-item>
          <el-form-item label="缩略图" prop="iconUrl" :rules="[{ required: true, message: '该字段不能为空'}]">
            <div class="upload-img-box" @click="openImgBox('radio')">
              <img v-if="model.iconUrl" :src="`${imgHost}/${model.iconUrl}`" style="width: 120px;">
              <i v-else class="el-icon-plus upload-icon"></i>
            </div>
          </el-form-item>
          <el-form-item label="是否上架" :rules="[{ required: true, message: '该字段不能为空'}]">
            <el-radio-group v-model="model.isSell">
              <el-radio :label="false">下架</el-radio>
              <el-radio :label="true">上架</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否发布" :rules="[{ required: true, message: '该字段不能为空'}]">
            <el-radio-group v-model="model.isRelease">
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
            <el-input-number size="small" v-model="model.seqNum" style="width:200px;"></el-input-number>
            <span>数字越小越靠前</span>
          </el-form-item>
        </el-form>
      </div>
      <div v-show="activeIndex === 2">
        <div>
          <editor :content="model.content" :config="config" @get-content="getContent"></editor>
        </div>
      </div>
      <div v-show="activeIndex === 3">
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
      <div v-show="activeIndex === 4">
        <div class="form">
          <el-form :model="model" label-width="90px" :inline="true">
            <el-form-item label="限时促销">
              <el-radio-group v-model="model.isPromotion" style="width:200px;">
                <el-radio :label="false">否</el-radio>
                <el-radio :label="true">是</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="促销价格" v-if="model.isPromotion">
              <el-input size="small" v-model="model.promotionPrice" type="number" style="width:200px;"></el-input>
            </el-form-item>
            <!-- <el-form-item label="促销时间" v-if="model.isPromotion">
              <el-date-picker size="small" v-model="model.startTime" type="date" placeholder="选择日期" style="width: 170px;"></el-date-picker>
              <span style="display: inline-block; width: 20px; text-align: center;">-</span>
              <el-date-picker size="small" v-model="model.endTime" type="date" placeholder="选择日期" style="width: 170px;"></el-date-picker>
            </el-form-item> -->
            <el-form-item label="原价">
              <el-input size="small" v-model="model.origPrice" type="number" style="width:200px;"></el-input>
            </el-form-item>
            <el-form-item label="现价">
              <el-input size="small" v-model="model.price" type="number" style="width:200px;"></el-input>
            </el-form-item>
            <el-form-item label="VIP价">
              <el-input size="small" v-model="model.vipPrice" type="number" style="width:200px;"></el-input>
            </el-form-item>
            <el-form-item label="现价最小值">
              <el-input size="small" v-model="model.minPrice" type="number" style="width:200px;"></el-input>
            </el-form-item>
            <el-form-item label="现价最大值">
              <el-input size="small" v-model="model.maxPrice" type="number" style="width:200px;"></el-input>
            </el-form-item>
            <el-form-item label="库存">
              <el-input size="small" v-model="model.qty" type="number" style="width:200px;"></el-input>
            </el-form-item>
            <el-form-item label="星级">
              <el-input size="small" v-model="model.level" type="number" style="width:200px;"></el-input>
            </el-form-item>
          </el-form>
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
                        <el-input size="small" v-model="item.value" type="number"></el-input>
                        <el-button size="small" type="success" icon="el-icon-check" style="padding: 9px;" @click="setSyncPrice(item, i)"></el-button>
                      </div>
                    </th>
                  </tr>
                  <tr v-for="(item, i) in tableBody" :key="i">
                    <td v-for="(label, index) in item.itemValue" :key="index" v-if="!label.hidden" :rowspan="label.rowspan">
                      <el-input size="small" v-model="label.value" type="number" :placeholder="label.placeholder" v-if="label.isInput"></el-input>
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
    <div class="bottom-btn">
      <el-button type="primary" @click="submit" size="small">保存</el-button>
    </div>
    
    <image-dialog :visible="digImgWrap" :uploadType="uploadType" imageType='product' @close-imgbox="closeImgbox" @get-imgsrc="onGetImgsrc" @get-imglistsrc="onGetImglistsrc"></image-dialog>
  </div>
</template>

<script>
import QcHeader from "common/QcHeader";
import editor from "common/editor";
import api from "api/common";
import { tableMixin } from "@/assets/js/tableMixin";
import UpLoadFile from "common/UpLoadFile";
import ImageDialog from "common/ImageDialog";

export default {
  mixins: [tableMixin],
  components: {
    QcHeader,
    UpLoadFile,
    ImageDialog,
    editor
  },
  data() {
    return {
      config: {
        initialFrameWidth: 800,
        initialFrameHeight: 500
      },
      digImgWrap: false,
      tabbar: [
        { index: 1, name: "基本信息" },
        { index: 2, name: "简介信息" },
        { index: 3, name: "相册" },
        { index: 4, name: "库存规格" }
      ],
      activeIndex: 1,
      editor: null,
      html: null,
      model: {
        name: "",
        brandId: "",
        iconUrl: "",
        rollingImgUrl: "",
        origPrice: "",
        vipPrice: "",
        promotionPrice: "",
        minPrice: "",
        maxPrice: "",
        qty: "",
        level: "",
        seqNum: "",
        isPromotion: false,
        isRelease: true,
        isSell: true,
        content: "",
        productItems: []
      },
      imgList: [],
      uploadType: "radio",
      limit: 1,
      input: [{ value: "" }],
      property: [],
      tableTitle: [
        { title: "现价", value: "", isInput: true },
        { title: "VIP价", value: "", isInput: true },
        { title: "促销价", value: "", isInput: true },
        { title: "库存", value: "", isInput: true }
        // { title: '销量', value: '', isInput: true },
      ],
      tableBody: [
        {
          itemValue: [
            { value: "", placeholder: "现价", isInput: true },
            { value: "", placeholder: "VIP价", isInput: true },
            { value: "", placeholder: "促销价", isInput: true },
            { value: "", placeholder: "库存", isInput: true }
          ]
        }
      ],
      wrapHeight: 0,
      areaHeight: 0,
      brandList: []
    };
  },
  created() {
    this.getBrandList();
  },
  mounted() {
    this.getHeight();
    window.onresize = () => {
      this.getHeight();
    };
    if (this.$route.query.id) {
      this.getProduct();
    }
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    getBrandList() {
      api
        .getBrandList({ pageNum: 1, pageSize: 100, isDeleted: "", name: "" })
        .then(res => {
          this.brandList = res.data.data.list;
        });
    },
    getProduct() {
      api.getProduct({ id: this.$route.query.id }).then(res => {
        this.model = res.data.data;
        if (this.model.rollingImgUrl) {
          let imgList = this.model.rollingImgUrl.split("_");
          imgList.map(item => {
            this.imgList.push({ url: item });
          });
        }

        // this.setContent(this.model.content)
        this.splitItems(this.model.productItems);
        this.splitSpec(this.model);
      });
    },
    splitSpec(model) {
      let list = [];
      let property = [];
      for (let key in model) {
        if (/spec/.test(key) && model[key]) {
          list.push({ key: key, value: model[key] });
        }
      }
      list.map((item, i) => {
        if (/Name/.test(item.key)) {
          property[item.key.substr(4, 1) - 1] = {};
          property[item.key.substr(4, 1) - 1].specName = item.value;
        }
        if (/Value/.test(item.key)) {
          let values = item.value.split("_");
          let specValue = [];
          values.map(item => {
            specValue.push({ value: item });
          });
          property[item.key.substr(4, 1) - 1].specValue = specValue;
        }
      });
      this.property = property;
      this.property.map((item, i) => {
        this.tableTitle.splice(i, 0, { title: item.specName, index: i });
      });
      this.setItemValue();
    },
    splitItems(productItems) {
      productItems.map((item, i) => {
        let itemValue = this.getItemValue();
        itemValue[0].value = item.price;
        itemValue[1].value = item.vipPrice;
        itemValue[2].value = item.promotionPrice;
        itemValue[3].value = item.qty;
        this.tableBody[i] = {};
        this.tableBody[i] = { itemValue: itemValue };
        for (let key in item) {
          if (/Value/.test(key) && item[key]) {
            this.tableBody[i].itemValue.splice(key.substr(4, 1) - 1, 0, {
              value: item[key],
              rowspan: 1
            });
          }
        }
      });
    },
    // 设置高度
    getHeight() {
      this.areaHeight = window.innerHeight - 120 - 154;
    },
    // 设置content
    setContent(content) {
      this.editor.addListener("ready", () => {
        this.editor.setContent(content);
      });
    },
    // 获取content
    getContent(content) {
      this.model.content = content;
      // this.model.content = this.editor.getContent()
    },
    // 切换侧边栏
    handleSelecta(index) {
      if (index === this.activeIndex) return;
      this.activeIndex = index;
    },
    handleSelect(index) {
      if (this.activeIndex === index) return false;
      this.activeIndex = index;
      this.$refs.context.scrollTop = 0;
    },
    // 打开图片对话框
    openImgBox(type) {
      this.uploadType = type;
      this.digImgWrap = true;
    },
    // 关闭图片对话框
    closeImgbox(state) {
      this.digImgWrap = false;
    },
    // 单张图片
    onGetImgsrc(val) {
      this.model.iconUrl = val;
    },
    // 多张图片
    onGetImglistsrc(list, state) {
      // console.log('onGetImglistsrc', list, state)
      if (state === 1) {
        list.map((item, i) => {
          let url = item.response.data.imageUrl;
          this.imgList.push({ url: url });
        });
      } else {
        list.map((item, i) => {
          let url = item.imgsrc;
          this.imgList.push({ url: url });
        });
      }
    },
    // 删除图片
    deleteImg(i) {
      this.imgList.splice(i, 1);
    },
    // 表格值
    getItemValue() {
      let itemValue = [
        { value: "", placeholder: "现价", isInput: true },
        { value: "", placeholder: "VIP价", isInput: true },
        { value: "", placeholder: "促销价", isInput: true },
        { value: "", placeholder: "库存", isInput: true }
        // { value: '', placeholder: '销量', isInput: true },
      ];
      return itemValue;
    },
    // 添加规格
    addProperty() {
      let data = {
        specName: "",
        specValue: [{ value: "" }]
      };
      this.property.push(data);
      let index = this.property.length - 1;
      this.tableTitle.splice(index, 0, { title: "", index: index });
      this.tableBody.map((item, i) => {
        item.itemValue.splice(index, 0, { value: "", rowspan: 1 });
      });
    },
    // 删除规格
    delProperty(i) {
      this.property.map((item, index) => {
        if (index > i) {
          this.tableTitle[index].index = this.tableTitle[index].index - 1;
        }
      });
      this.property.splice(i, 1);
      this.tableTitle.splice(i, 1);

      let count = 1;
      this.property.map((item, i) => {
        count *= item.specValue.length;
      });
      this.tableBody = [];
      for (let i = 0; i < count; i++) {
        this.tableBody.push({ itemValue: this.getItemValue() });
      }
      this.setItemValue();
    },
    // 设置表格
    setItemValue() {
      this.tableBody.map((item, i) => {
        let count = this.tableTitle.length - item.itemValue.length;
        if (count !== 0) {
          for (let i = 0; i < count; i++) {
            item.itemValue.splice(0, 0, { value: "", rowspan: 1 });
          }
        }
      });

      let total = 1;
      this.property.map((item, i) => {
        total *= item.specValue.length;
      });
      this.property.map((item, i) => {
        let count = 1;
        let index = 0;
        for (let j = 0; j <= i; j++) {
          count *= this.property[j].specValue.length;
        }
        index = total / count;
        this.tableBody.map((body, v) => {
          if (v % index === 0) {
            body.itemValue[i].rowspan = index;
            body.itemValue[i].hidden = false;
          } else {
            body.itemValue[i].hidden = true;
          }
        });
      });
    },
    // 添加属性
    addVaule(index) {
      this.property[index].specValue.push({ value: "" });
      if (this.property.length <= 1) {
        this.tableBody.push({ itemValue: this.getItemValue() });
      } else {
        let itemLength = this.property[index].specValue.length;
        let total = 1;
        this.property.map((item, i) => {
          total *= item.specValue.length;
        });
        let count = itemLength - 1;
        for (let i = 0; i < total / itemLength; i++) {
          this.tableBody.splice(count, 0, { itemValue: this.getItemValue() });
          count += itemLength;
        }
      }
      this.setItemValue();
    },
    // 删除属性
    delValue(i, index) {
      let length = this.property[i].specValue.length;
      if (length === 1) {
        this.$alert("规格最少需要一个属性值", "信息", {
          confirmButtonText: "确定"
        });
        return false;
      }
      if (i > 0) {
        let frontTotal = 1;
        let afterTotal = 1;
        this.property.map((item, i) => {
          frontTotal *= item.specValue.length;
        });
        this.property[i].specValue.splice(index, 1);
        this.property.map((item, i) => {
          afterTotal *= item.specValue.length;
        });
        let count = this.property[i].specValue.length;
        for (let i = 0; i < frontTotal - afterTotal; i++) {
          this.tableBody.splice(index, 1);
          index += count;
        }
      } else {
        this.property[i].specValue.splice(index, 1);
        let itemLength = this.tableBody.length / length;
        this.tableBody.splice(itemLength * index, itemLength);
      }
      this.setItemValue();
    },
    // 同步价格
    setSyncPrice(item, i) {
      this.tableBody.map((label, v) => [
        (label.itemValue[i].value = item.value)
      ]);
    },
    getProperty() {
      let data = {};
      this.property.map((item, i) => {
        data[`spec${i + 1}Name`] = item.specName;
        let value = "";
        item.specValue.map((label, k) => {
          value += label.value + "_";
        });
        value = value.substr(0, value.length - 1);
        data[`spec${i + 1}Value`] = value;
      });
      this.model = Object.assign(data, this.model);
    },
    getTable() {
      let list = [];
      this.tableBody.map((item, i) => {
        let data = {};
        let value = {};
        item.itemValue.map((label, k) => {
          let length = this.property.length;
          if (k < length) {
            data[`spec${k + 1}Name`] = this.tableTitle[k].title;
            data[`spec${k + 1}Value`] = label.value;
          } else {
            let titles = ["price", "vipPrice", "promotionPrice", "qty"];
            data[titles[k - length]] = label.value;
          }
        });
        list.push(data);
      });
      list.map(item => {
        item.name = this.model.name;
      });
      this.model.productItems = list;
    },
    getImgList() {
      let rollingImgUrl = "";
      this.imgList.map((item, i) => {
        rollingImgUrl += item.url + "_";
      });
      // rollingImgUrl = rollingImgUrl.substr(0,rollingImgUrl.length-1)
      this.model.rollingImgUrl = rollingImgUrl.substr(
        0,
        rollingImgUrl.length - 1
      );
    },
    // 提交
    submit() {
      // this.getContent()
      this.getProperty();
      this.getTable();
      this.getImgList();
      if (this.$route.query.id) this.updateProduct();
      else this.addProduct();
    },
    // 添加商品
    addProduct() {
      api.addProduct(this.model).then(res => {
        this.$message({
          message: "添加成功",
          type: "success"
        });
        this.$router.go(-1);
      });
    },
    // 更新商品
    updateProduct() {
      // console.log(this.model)
      // return false
      api.updateProduct(this.model).then(res => {
        this.$message({
          message: "更新成功",
          type: "success"
        });
        this.$router.go(-1);
      });
    }
  },
  // destroyed () {
  //   this.editor.destroy()
  // },
  watch: {
    property: {
      handler(val) {
        let length = val.length;
        if (length === 0) return;
        let total = 1;
        this.property.map((item, i) => {
          total *= item.specValue.length;
        });

        val.map((item, i) => {
          if (this.tableTitle[i].index === i) {
            this.tableTitle[i].title = item.specName;
          }
          let total = 1;
          this.property.map((label, k) => {
            if (k > i) {
              total *= label.specValue.length;
            }
          });
          let times = 1;
          for (let d = i - 1; d >= 0; d--) {
            times *= val[d].specValue.length;
          }
          let index = 0;
          for (let m = 0; m < times; m++) {
            for (let j = 0; j < item.specValue.length; j++) {
              for (let r = 0; r < total; r++) {
                this.tableBody[index].itemValue[i].value =
                  item.specValue[j].value;
                index++;
              }
            }
          }
        });
      },
      deep: true
    }
  }
};
</script>

<style lang="less" scoped>
.tabbar {
  display: flex;
  border-bottom: 1px solid #e7eaec;
  position: relative;
  .back {
    position: absolute;
    right: 10px;
    top: 13px;
  }
  .item {
    padding: 15px 30px;
    color: #bfbfbf;
    cursor: pointer;
    span {
      font-size: 22px;
    }
  }
  .active {
    background-color: #3091f2;
    color: #fff;
  }
}
.context-box {
  padding: 20px;
  overflow: auto;
  .setting {
    margin-bottom: 30px;
    .title {
      margin-bottom: 10px;
      padding-left: 10px;
      line-height: 1;
      font-size: 18px;
      position: relative;
      &:before {
        position: absolute;
        content: "";
        border-left: 3px solid #3091f2;
        left: 0;
        top: 0;
        bottom: 0;
      }
    }
  }
}

.area-box {
  display: flex;
  .sidebar {
    flex-shrink: 0;
    width: 150px;
  }
  .content {
    padding: 10px;
    overflow: auto;
  }
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
.property-box {
  border: 1px solid #e7eaec;
  padding: 15px;
  // width: 869px;
  .property-item {
    border-left: 3px solid rgba(0, 0, 0, 0.2);
    margin-bottom: 20px;
    .name {
      background: rgba(0, 0, 0, 0.035);
      padding: 10px 10px 10px 15px;
      display: flex;
      justify-content: space-between;
      .delete-btn {
        display: none;
      }
      &:hover {
        background: rgba(0, 0, 0, 0.05);
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
          transition: all 0.3s ease;
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
  // width: 900px;
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
.bottom-btn {
  text-align: center;
  height: 60px;
  line-height: 60px;
  border-top: 1px solid #e7eaec;
}
</style>
