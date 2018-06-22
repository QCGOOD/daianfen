<template>
  <div class="wrap" ref="wrap">
    <div ref="search">
      <search-wrap>
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="">
            <el-input size="small" placeholder="城市" v-model="searchData.city"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-input size="small" placeholder="专柜" v-model="searchData.shopName"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="search()">查询</el-button>
          </el-form-item>
        </el-form>
      </search-wrap>
      <button-wrap>
        <el-button type="primary" size="small" @click="insert()">新建</el-button>
        <el-button type="warning" size="small" :disabled="tableList.id == null" @click="update()">修改</el-button>
        <el-button type="danger" size="small" :disabled="tableList.id == null" @click="deleteConfirm()">删除</el-button>
        <el-button type="info" size="small" @click="apiExport()">导出</el-button>
        <up-load-file url="/shop/importData" size="small"></up-load-file>
      </button-wrap>
    </div>
    <qc-table ref="table" :height="domHeight" :table-list="showData" :search="searchData" url="/shop/list"></qc-table>
  
    <el-dialog :title="updateId?'修改':'新建'" :visible.sync="dialogFormVisible" append-to-body @close="digClose()">
      <el-form :model="model" :rules="rules" label-width="100px" style="width:500px;margin:0 auto;">
        <el-form-item label="编号" prop="shopNo">
          <el-input v-model="model.shopNo"></el-input>
        </el-form-item>
        <el-form-item label="专柜" prop="shopName">
          <el-input v-model="model.shopName"></el-input>
        </el-form-item>
        <el-form-item label="渠道" prop="shopType">
          <el-input v-model="model.shopType" placeholder="柜台"></el-input>
        </el-form-item>
        <el-form-item label="省份" prop="province">
          <el-input v-model="model.province"></el-input>
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <el-input v-model="model.city"></el-input>
        </el-form-item>
        <el-form-item label="区县" prop="area">
          <el-input v-model="model.area"></el-input>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="model.address" placeholder="输入完整的地址，包括省市区"></el-input>
        </el-form-item>
        <el-form-item label="纬度" prop="latitude">
          <el-input v-model="model.latitude" placeholder="此项为空时，系统自动获取"></el-input>
        </el-form-item>
        <el-form-item label="经度" prop="lng">
          <el-input v-model="model.longitude" placeholder="此项为空时，系统自动获取"></el-input>
          <a href="http://lbs.qq.com/tool/getpoint/index.html" target="view_window" style="cursor: pointer; color: rgb(184, 2, 35); text-decoration: underline;">坐标拾取</a>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="digClose()">取 消</el-button>
        <el-button type="primary" @click="digClose()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { tableMixin } from "../../../assets/js/tableMixin";
import SearchWrap from "../../common/SearchWrap";
import ButtonWrap from "../../common/ButtonWrap";
import UpLoadFile from "common/UpLoadFile";
import api from "api/common";
export default {
  mixins: [tableMixin],
  components: { SearchWrap, ButtonWrap, UpLoadFile },
  data() {
    return {
      updateId: "",
      isImport: false,
      dialogFormVisible: false,
      options: [
        {value: 0,label: '全部'},
        {value: 1,label: '已预约'},
        {value: 2,label: '已到店'},
        {value: 3,label: '已取消'},
      ],
      model: {},
      searchData: {
        shopName: '',
        city: '',
      },
      showData: [
        { prop: "name", label: "编号", width:150, align: 'left'},
        { prop: "code", label: "专柜", width:200, align: 'left'},
        { prop: "customerName", label: "渠道", width:100, align: 'left'},
        { prop: "remark", label: "省份", width:100, align: 'left'},
        { prop: "endDate", label: "城市", width:100, align: 'left'},
        { prop: "createTime", label: "区县", width:120, align: 'left'},
        { prop: "createTime", label: "地址", align: 'left'},
        { prop: "createTime", label: "操作", title: '查看预约', url:'/mian/guide', template: 'jump'},
      ],
      rules: {
        shopNo: [
          { required: true, message: '字段不能为空', trigger: 'blur' }
        ],
        shopName: [
          { required: true, message: '字段不能为空', trigger: 'blur' }
        ],
        shopType: [
          { required: true, message: '字段不能为空', trigger: 'blur' }
        ],
        province: [
          { required: true, message: '字段不能为空', trigger: 'blur' }
        ],
        city: [
          { required: true, message: '字段不能为空', trigger: 'blur' }
        ],
        area: [
          { required: true, message: '字段不能为空', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '字段不能为空', trigger: 'blur' }
        ],
        city: [
          { required: true, message: '字段不能为空', trigger: 'blur' }
        ],
      }
    };
  },
  methods: {
    apiAddData(data) {
      this.$http.post('/shop/add', data)
      .then(res => {
        this.$message.success('提交成功')
        this.digClose()
      })
    },
    search(){
      this.searchKeep();
    },
    deleteConfirm() {
      this.$confirm(`此操作将删除 ${ this.tableList.shopName } 是否继续？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delete();
        })
        .catch(() => {
          return;
        });
    },
    delete() {
      this.$http.post('/shop/delete', { employeeId: this.tableList.id }).then(res => {
        this.searchKeep();
        this.$message.success('删除成功')
      });
    },
    insert() {
      this.dialogFormVisible = true;
    },
    update() {
      this.updateId = this.tableList.id;
      this.dialogFormVisible = true;
      this.model = this.tableList
    },
    digClose(flag) {
      this.updateId = "";
      this.dialogFormVisible = false;
      this.model = {}
    },
    // 导入
    apiImport() {
      this.isImport = true;
    },
    // 导出
    apiExport() {
      location.href = `${this.localhost}/shop/exportData?${this.qs.stringify(this.searchData)}`
    },
    // 提交
    submit() {
      this.$refs.model.validate(valid => {
        if (valid) {
          this.apiAddData(this.model);
        } else {
          this.loading = false;
        }
      });
    },
    
  }
};
</script>