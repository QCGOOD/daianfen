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
          <el-form-item label="">
            <el-input size="small" placeholder="专柜编号" v-model="searchData.shopNo"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-input size="small" placeholder="导购姓名" v-model="searchData.employeeName"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-input size="small" type="number" placeholder="导购手机" v-model.number="searchData.phoneNo"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="search()">查询</el-button>
          </el-form-item>
        </el-form>
      </search-wrap>
      <button-wrap>
        <el-button type="primary" size="small" @click="insert()">新建</el-button>
        <el-button type="warning" size="small" :disabled="tableList.id == null" @click="update()">修改</el-button>
        <el-button type="danger" size="small" :disabled="tableList.id == null" @click="deleteConfirm()">冻结</el-button>
        <!-- <el-button type="info" size="small" @click="apiImport()">导入</el-button> -->
        
        <el-button type="info" size="small" @click="apiExport()">导出</el-button>
        <up-load-file url="/employee/importData" size="small"></up-load-file>
      </button-wrap>
    </div>
    <qc-table ref="table" :height="domHeight" :table-list="showData" :search="searchData" stripe url="/employee/list"></qc-table>
  
    <el-dialog title="编辑资料" :visible.sync="dialogFormVisible" width="40%" append-to-body @close="digClose()">
      <el-form :model="model" ref="model" :rules="rules" size="small" style="width:300px;margin:0 auto;">
        <el-form-item label="导购姓名" prop="name">
          <el-input v-model="model.name"></el-input>
        </el-form-item>
        <el-form-item label="导购手机" prop="phoneNo">
          <el-input type="number" v-model.number="model.phoneNo"></el-input>
        </el-form-item>
        <el-form-item label="雇员编号" prop="jobNumber">
          <el-input v-model="model.jobNumber"></el-input>
        </el-form-item>
        <el-form-item label="专柜编号" prop="shopNo">
          <el-input v-model="model.shopNo"></el-input>
        </el-form-item>
        <el-form-item label="专柜代号" prop="shopCode">
          <el-input v-model="model.shopCode"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="digClose()">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
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
        employeeName: '',
        phoneNo: '',
        shopNo: '',
        shopName: '',
        city: '',
      },
      showData: [
        { prop: "jobNumber", label: "雇员编号", width:150, align: 'center'},
        { prop: "name", label: "姓名", width:150, align: 'left'},
        { prop: "phoneNo", label: "电话", width:160, align: 'left'},
        { prop: "state", label: "状态", width:120, align: 'left', template: 'guideState'},
        { prop: "city", label: "城市", width:100, align: 'left'},
        { prop: "shopNo", label: "专柜编号", width:120, align: 'left'},
        { prop: "shopCode", label: "专柜代号", width:120, align: 'left'},
        { prop: "shopName", label: "专柜", align: 'left'},
      ],
      rules: {
        name: [
          { required: true, message: '字段不能为空', trigger: 'blur' }
        ],
        jobNumber: [
          { required: true, message: '字段不能为空', trigger: 'blur' }
        ],
        phoneNo: [
          { required: true, message: '字段不能为空', trigger: 'blur' }
        ],
        shopNo: [
          { required: true, message: '字段不能为空', trigger: 'blur' }
        ],
        shopName: [
          { required: true, message: '字段不能为空', trigger: 'blur' }
        ],
        shopCode: [
          { required: true, message: '字段不能为空', trigger: 'blur' }
        ],
      }
    };
  },
  methods: {
    apiAddData(data) {
      this.$http.post('/employee/add', data)
      .then(res => {
        this.$message.success('提交成功')
        this.searchKeep();
        this.digClose()
      })
    },
    search(){
      this.searchKeep();
    },
    deleteConfirm() {
      this.$confirm(`此操作将冻结导购 ${ this.tableList.name } 是否继续？`, "提示", {
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
      this.$http.post('/employee/frozen', { employeeId: this.tableList.id }).then(res => {
        this.searchKeep();
        this.$message.success('冻结成功')
      });
    },
    insert() {
      this.dialogFormVisible = true;
    },
    update() {
      this.updateId = this.tableList.id;
      this.dialogFormVisible = true;
      this.model = JSON.parse(JSON.stringify(this.tableList))
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
      location.href = `${this.localhost}/employee/exportData?${this.qs.stringify(this.searchData)}`
    },
    // 提交
    submit() {
      this.$refs.model.validate(valid => {
        if (valid) {
          // let params = {
          //   id: this.model.id || '',
          //   jobNumber: this.model.jobNumber,
          //   name: this.model.name,
          //   shopNo: this.model.shopNo,
          //   shopCode: this.model.shopCode,
          //   phoneNo: this.model.phoneNo,
          // }
          if(this.model.createTime) delete this.model.createTime
          if(this.model.updateTime) delete this.model.updateTime
          this.apiAddData(this.model);
        } else {
          this.loading = false;
        }
      });
    },
    
  }
};
</script>