<template>
  <div class="wrap" ref="wrap" :style="{'height': `${wrapHeight}px`}">
    <div class="data-setting">
      <p class="desc">
        <span>输入类型为单选或多选时起效。备选项，以下划线分隔。</span>
      </p>
      <table cellpadding="0" cellspacing="0" class="data-table">
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
        <tr v-for="(item, i) in signDataSettingList" :key="i">
          <td>
            <el-input-number size="mini" v-model="item.sort" style="width: 100px;"></el-input-number>
          </td>
          <td>
            <el-select v-model="item.type" placeholder="请选择" size="mini" style="width: 120px;">
              <el-option v-for="(item, i) in inputType" :key="i" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </td>
          <td>
            <el-input v-model="item.name" placeholder="请输入内容" size="mini" style="width: 150px;"></el-input>
          </td>
          <td>
            <el-input v-model="item.fieldName" placeholder="请输入内容" size="mini" style="width: 150px;"></el-input>
          </td>
          <td>
            <el-input :disabled="item.type !== 2 && item.type !== 3" v-model="item.options" placeholder="请输入内容" size="mini" style="width: 200px;"></el-input>
          </td>
          <td>
            <el-checkbox v-model="item.isRequired"></el-checkbox>
          </td>
          <td>
            <el-checkbox v-model="item.isShow"></el-checkbox>
          </td>
          <td>
            <el-button type="danger" size="mini" :disabled="i < 4" @click="delDataSetting(i)">删除</el-button>
          </td>
        </tr>
        <el-button type="primary" size="mini" class="add" @click="addDataSetting()">新增</el-button>
      </table>
      <div class="save">
        <el-button type="primary" size="small" :loading="loading" @click="saveSignDataSetting()">保存</el-button>
      </div>
      
    </div>
  </div>
</template>

<script>
import { tableMixin } from "@/assets/js/tableMixin"
import api from "api/common"

export default {
  mixins: [tableMixin],
  data () {
    return {
      signDataSettingList: [],
      inputType: [
        { name: '文本', value: 1 },
        { name: '单选', value: 2 },
        { name: '多选', value: 3 },
        // { name: '时间选择', value: 4 },
        // { name: '图片', value: 5 },
        // { name: '音乐', value: 6 },
        // { name: '文件', value: 7 },
      ],
      loading: false,
    }
  },
  created () {
    this.getSignDataSetting()
  },
  methods: {
    getSignDataSetting () {
      api.getSignDataSetting().then(res => {
        console.log(res.data)
        this.signDataSettingList = res.data.data
      })
    },
    saveSignDataSetting () {
      this.loading = true
      api.saveSignDataSetting(this.signDataSettingList).then(res => {
        this.loading = false
        console.log(res.data)
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.getSignDataSetting()
      }).catch(err => {
        this.loading = false
      })
    },
    addDataSetting () {
      let data = {
        sort: (this.signDataSettingList.length + 1) * 10,
        name: '',
        fieldName: '',
        type: 1,
        options: '',
        isRequired: true,
        isShow: true,
      }
      this.signDataSettingList.push(data)  
    },
    delDataSetting (i) {
      this.signDataSettingList.splice(i, 1)
    },
  }
}
</script>

<style lang="less" scoped>
.data-setting {
    padding: 20px;
  }
.data-table {
  width: 1050px;
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
    th, td {
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
.save {
  width: 1050px;
  text-align: center;
  padding: 10px 0;
}
</style>
