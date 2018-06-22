<template>
  <div class="wrap" ref="wrap" v-loading="dataLoading">
    <div class="tabbar">
      <div class="item" :class="{'active': i + 1 === activeIndex}" v-for="(item, i) in tabbar" :key="i" @click="handleSelect(item.index)">
        {{item.name}}
      </div>
      <el-button type="primary" size="mini" class="back" @click="back">返回</el-button>
    </div>
    <div class="context-box" :style="{'height': `${areaHeight}px`}" ref="context">
      <div v-show="activeIndex === 1">
        <!-- 基础设置 -->
        <div class="setting">
          <p class="title">基础设置</p>
          <el-form :model="model" ref="base" label-position="top" size="small">
            <el-form-item label="课程名称" prop="title" :rules="[{ required: true, message: '该字段不能为空'}]">
              <el-input size="small" v-model="model.title" style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item>
              <!-- <el-form-item label="课程分类" prop="categoryId" :rules="[{ required: true, message: '该字段不能为空'}]" class="inline right">
                <el-select v-model="model.categoryId" size="small">
                  <el-option :label="item.name" :value="item.id" v-for="(item, i) in category" :key="i"></el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item label="课程标签" class="inline">
                <el-select v-model="model.courseTagLists" size="small" multiple>
                  <el-option :label="item.name" :value="item.id" v-for="(item, i) in tag" :key="i"></el-option>
                </el-select>
              </el-form-item>
            </el-form-item>
            <el-form-item label="学制" prop="educationalSystem" :rules="[{ required: true, message: '该字段不能为空'}]">
              <el-input size="small" v-model="model.educationalSystem" style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item label="价格" prop="price" :rules="[{ required: true, message: '该字段不能为空'}]">
              <el-input size="small" v-model="model.price" style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item label="联系人" prop="contact" :rules="[{ required: true, message: '该字段不能为空'}]">
              <el-input size="small" v-model="model.contact" style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="contactPhone" :rules="[{ required: true, message: '该字段不能为空'}]">
              <el-input size="small" type="number" v-model.number.trim="model.contactPhone" style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item label="城市" prop="city" :rules="[{ required: true, message: '该字段不能为空'}]">
              <el-input size="small" v-model="model.city" style="width:400px;"></el-input>
            </el-form-item>
            <!-- <el-form-item label="课程地点" prop="place" :rules="[{ required: true, message: '该字段不能为空'}]">
              <el-input size="small" v-model="model.place" style="width:400px;"></el-input>
            </el-form-item> -->
            <!-- <el-form-item label="详细地址" prop="address" :rules="[{ required: true, message: '该字段不能为空'}]">
              <el-input size="small" v-model="model.address" style="width:400px;"></el-input>
            </el-form-item> -->
            <el-form-item label="封面图" prop="iconUrl" :rules="[{ required: true, message: '该字段不能为空'}]">
              <div class="upload-img-box" @click="openImgBox('radio')">
                <img v-if="model.iconUrl" :src="`${imgHost}/${model.iconUrl}`" style="width: 120px;">
                <i v-else class="el-icon-plus upload-icon"></i>
              </div>
            </el-form-item>
            <el-form-item label="课程简介" prop="info" :rules="[{ required: true, message: '该字段不能为空'}]">
              <el-input size="small" v-model="model.info" type="textarea" style="width:400px;"></el-input>
            </el-form-item>
            <el-form-item label="课程详情" prop="content" :rules="[{ required: true, message: '该字段不能为空'}]">
              <editor :content="model.content" @get-content="getContent"></editor>
            </el-form-item>
          </el-form>
        </div>

        <!-- 报名自定义字段设置 -->
        <div class="setting">
          <p class="title">报名自定义字段设置</p>
          <p class="desc">
            <span>输入类型为单选或多选时起效。备选项，以下划线分隔。</span>
          </p>
          <table cellpadding="0" cellspacing="0" class="act-table">
            <tr>
              <th>序号</th>
              <th>输入类型</th>
              <th>显示名称</th>
              <th>对应会员字段</th>
              <th>选项</th>
              <th>必填</th>
              <th>显示在前端</th>
              <th>操作</th>
            </tr>
            <tr v-for="(item, i) in model.signDataSettingList" :key="i">
              <td>
                <el-input-number size="mini" v-model="item.sort" style="width: 100px;" :disabled="model.isRelease"></el-input-number>
              </td>
              <td>
                <el-select v-model="item.type" placeholder="请选择" size="mini" style="width: 120px;" :disabled="item.id && item.id !== ''  || model.isRelease">
                  <el-option v-for="(item, i) in inputType" :key="i" :label="item.name" :value="item.value">
                  </el-option>
                </el-select>
              </td>
              <td>
                <el-input v-model="item.name" placeholder="请输入内容" size="mini" style="width: 150px;" :disabled="model.isRelease"></el-input>
              </td>
              <td>
                <el-input v-model="item.fieldName" placeholder="请输入内容" size="mini" style="width: 150px;" :disabled="item.id && item.id !== ''  || model.isRelease"></el-input>
              </td>
              <td>
                <el-input :disabled="item.type !== 2 && item.type !== 3 || model.isRelease" v-model="item.options" placeholder="请输入内容" size="mini" style="width: 200px;"></el-input>
              </td>
              <td>
                <el-switch v-model="item.isRequired" active-text="" active-color="#409EFF" inactive-color="#e8e8e8" :disabled="model.isRelease"></el-switch>
              </td>
              <td>
                <el-switch v-model="item.isShow" active-text="" active-color="#409EFF" inactive-color="#e8e8e8" :disabled="model.isRelease"></el-switch>
              </td>
              <td>
                <el-button type="danger" size="mini" @click="delDataSetting(i)" :disabled="model.isRelease">删除</el-button>
              </td>
            </tr>
            <el-button type="primary" size="mini" class="add" @click="addDataSetting()" :disabled="model.isRelease">新增</el-button>
          </table>
        </div>
      </div>
    </div>
    <div class="bottom-btn">
      <el-button type="primary" @click="submit()" style="margin-left: 30px;" size="small" :loading="loading">保存</el-button>
    </div>
    <image-dialog :visible="digImgWrap" :uploadType="uploadType" imageType='product' @close-imgbox="closeImgbox" @get-imgsrc="onGetImgsrc"></image-dialog>
  </div>
</template>

<script>
import QcHeader from "common/QcHeader";
import { tableMixin } from "@/assets/js/tableMixin";
import editor from "common/editor";
import api from "api/common";
import ImageDialog from "common/ImageDialog";

export default {
  mixins: [tableMixin],
  components: {
    editor,
    ImageDialog,
    QcHeader
  },
  data() {
    return {
      digImgWrap: false,
      uploadType: "radio",
      areaHeight: 0,
      tabbar: [
        { index: 1, name: "课程设置" }
        // { index: 2, name: '高级设置' },
        // { index: 3, name: '子课程设置' },
      ],
      activeIndex: 1,
      model: {
        title: "",
        // categoryId: "",
        courseTagList: [],
        courseTagLists: [],
        isRelease: false,
        iconUrl: "",
        info: "",
        content: "",
        price: "",
        educationalSystem: "",
        contact: "",
        contactPhone: "",
        city: "",
        // place: "",
        // address: "",
        signDataSettingList: []
      },
      inputType: [
        { name: "文本", value: 1 },
        { name: "单选", value: 2 },
        { name: "多选", value: 3 }
        // { name: "时间选择", value: 4 },
        // { name: "图片", value: 5 },
        // { name: "音乐", value: 6 },
        // { name: "文件", value: 7 }
      ],
      tag: [],
      loading: false,
      dataLoading: false
    };
  },
  created() {
    // this.treeByTypeCategory();
    this.listTag();
    if (this.$route.query.id) {
      this.dataLoading = true;
      this.detail(this.$route.query.id);
    } else {
      this.getSignDataSetting();
    }
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
      this.areaHeight = window.innerHeight - 120 - 154;
    },
    handleSelect(index) {
      if (this.activeIndex === index) return false;
      this.activeIndex = index;
      this.$refs.context.scrollTop = 0;
    },
    back() {
      this.$router.go(-1);
    },
    getSignDataSetting() {
      api.getSignDataSetting().then(res => {
        res.data.data.map(item => {
          item.isSystem = false;
        });
        this.model.signDataSettingList = res.data.data;
        console.log(this.model.signDataSettingList);
      });
    },
    listTag() {
      api.listTag({ type: 4 }).then(res => {
        this.tag = res.data.data.list;
      });
    },
    detail(id) {
      api.getLesson({ id: id }).then(res => {
        console.log(res);
        let data = res.data.data;
        data.courseTagLists = [];
        if (data.courseTagList.length > 0) {
          data.courseTagList.map(item => {
            data.courseTagLists.push(item.tagId);
          });
        }
        this.model = data;
        if (this.model.price)
          this.model.price = this.model.price / 100;

        if (this.$route.query.copy === "true")
          this.model = this.copy(this.model);

        this.dataLoading = false;
      });
    },
    copy(model) {
      for (let key in model) {
        if (model[key].constructor === Array) {
          model[key].map(item => {
            for (let key in item) {
              if (
                key === "id" ||
                key === "createTime" ||
                key === 'courseId'
              ) {
                delete item[key];
              }
            }
          });
        }
        if (key === "id" || key === "createTime") {
          delete model[key];
        }
      }
      model.isRelease = false;
      console.log("copy", model);
      return model;
    },
    addDataSetting() {
      let data = {
        sort: (this.model.signDataSettingList.length + 1) * 10,
        name: "",
        fieldName: "",
        type: 1,
        options: "",
        isRequired: true,
        isShow: true,
        isSystem: false
      };
      this.model.signDataSettingList.push(data);
    },
    delDataSetting(i) {
      if (i < 2) return false;
      this.model.signDataSettingList.splice(i, 1);
    },
    getContent(content) {
      this.model.content = content;
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
    check() {
      let state = false;
      this.$refs.base.validate(valid => {
        state = valid;
      });
      if (!state) {
        this.$message.error("请将基础设置信息填写完整！");
        return false;
      }
      return state;
    },
    submit() {
      if (!this.check()) return false;

      let model = JSON.parse(JSON.stringify(this.model));
      // if (model.price) model.price = Math.floor(model.price * 100);

      model.courseTagList = [];
      model.courseTagLists.map(item => {
        model.courseTagList.push({ tagId: item });
      });

      console.log("model", model);
      // return false
      this.loading = true;
      // if (this.$route.query.id) this.updateLesson(model);
      // else this.addLesson(model);

      if (this.$route.query.copy) this.addLesson(model);
      else if (this.$route.query.id) this.updateLesson(model);
      else this.addLesson(model);
    },
    updateLesson(model) {
      api
        .updateLesson(model)
        .then(res => {
          this.loading = false;
          console.log(res);
          this.$message({
            message: "修改成功",
            type: "success"
          });
          setTimeout(() => {
            this.$router.go(-1);
          }, 500);
        })
        .catch(err => {
          this.loading = false;
        });
    },
    addLesson(model) {
      api
        .addLesson(model)
        .then(res => {
          this.loading = false;
          console.log(res.data);
          this.$message({
            message: "保存成功",
            type: "success"
          });
          setTimeout(() => {
            this.$router.go(-1);
          }, 500);
        })
        .catch(err => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="less" scoped>
.tabbar {
  position: relative;
  display: flex;
  border-bottom: 1px solid #e7eaec;
  .back {
    position: absolute;
    right: 10px;
    top: 13px;
  }
  .item {
    padding: 15px;
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
.inline {
  display: inline-block;
  margin-bottom: 0;
}
.right {
  margin-right: 30px;
}
.right-30 {
  margin-right: 30px;
}
.zi {
  padding: 10px;
  border: 1px solid #e7eaec;
  margin-top: 20px;
  position: relative;
  .del {
    position: absolute;
    right: 20px;
    top: 20px;
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
.act-table {
  border: 1px solid #dfe6ec;
  position: relative;
  .add {
    position: absolute;
    top: -35px;
    right: 0;
  }
  tr {
    &:first-child {
      background: #eef1f6;
    }
    th,
    td {
      padding: 7px 10px;
      text-align: center;
      white-space: nowrap;
    }
  }
}
.desc {
  color: #7b7b7b;
  font-size: 15px;
  margin-top: 10px;
  margin-bottom: 5px;
}
.bottom-btn {
  text-align: center;
  height: 60px;
  line-height: 60px;
  border-top: 1px solid #e7eaec;
}
</style>
