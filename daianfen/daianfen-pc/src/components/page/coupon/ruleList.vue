<template>
  <div class="wrap" ref="wrap">
    <div ref="search">
      <button-wrap>
        <el-button type="primary" size="small" @click="insert()">新建</el-button>
        <el-button type="warning" size="small" :disabled="tableList.id == null" @click="update()">修改</el-button>
        <!-- <el-button type="danger" size="small" :disabled="tableList.id == null" @click="deleteConfirm()">删除</el-button> -->
      </button-wrap>
    </div>
    <qc-table ref="table" :height="domHeight" :table-list="showData" :search="searchData" stripe url="/makeCoupons/page"></qc-table>
  
    <el-dialog :title="updateId?'修改':'新建'" :visible.sync="dialogFormVisible" width="600px" append-to-body @close="digClose()">
      <el-form :model="model" ref="model" :rules="rules" label-width="120px" style="width:500px;margin:0 auto;">
        <el-form-item label="标题" prop="title">
          <el-input v-model.trim="model.title"></el-input>
        </el-form-item>
        <el-form-item label="说明" prop="content">
          <el-input v-model.trim="model.content" placeholder="每条数字开头，中文分号结尾。如：1.内容；2.内容；"></el-input>
        </el-form-item>
        <!-- <el-form-item label="类型" prop="couponsType">
          <el-select v-model="model.ruleType" placeholder="优惠券类型,ABM1中的细类。例如生日券，积分券，回馈券，体验券等">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="类型" prop="couponsType">
          <el-input v-model="model.couponsType" style="width:210px;"></el-input>
        </el-form-item>
        <el-form-item label="面值" prop="par">
          <el-input v-model="model.par" placeholder="请输入数值" style="width:210px;"></el-input>
        </el-form-item>
        <el-form-item label="总数" prop="totalCount">
          <el-input v-model="model.totalCount" placeholder="请输入数值" style="width:210px;"></el-input>
        </el-form-item>
        <el-form-item label="起始编号" prop="startNo">
          <el-input v-model="model.startNo" style="width:210px;"></el-input>
        </el-form-item>
        <!-- <el-form-item label="优惠券总数" prop="totalCount">
          <el-input-number style="margin-left:3px;" v-model="model.totalCount"  :min="1"></el-input-number>
        </el-form-item> -->
        <el-form-item label="过期时间" prop="validDate">
          <el-date-picker size="small" value-format="yyyy-MM-dd" format="yyyy-MM-dd" v-model="model.validDate" type="date" placeholder="过期时间"></el-date-picker>
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
export default {
  mixins: [tableMixin],
  components: { SearchWrap, ButtonWrap },
  data() {
    return {
      updateId: "",
      dialogFormVisible: false,
      model: {
        couponsType: '',
        content: '',
        title: '',
        par: '',
        validDate: '',
        totalCount: '',
        startNo: ''
      },
      searchData: {},
      options: [
        {label: '预约', value: 1, disabled: false},
        {label: '注册', value: 2, disabled: true}
      ],
      showData: [
        { template: 'index' },
        { prop: "title", label: "标题", align: 'left'},
        { prop: "par", label: "面值"},
        { prop: "totalCount", label: "总数"},
        { prop: "madeCount", label: "已生成数"},
        { prop: "startNo", label: "起始编号"},
        { prop: "couponsType", label: "类型"},
        { prop: "validDate", label: "过期时间"},
        { prop: "content", label: "说明", align: 'left'},
      ],
      rules: {
        title: [
          { required: true, message: '字段不能为空', trigger: 'blur' }
        ],
        couponsType: [
          { required: true, message: '字段不能为空', trigger: 'blur' }
        ],
        startNo: [
          { required: true, message: '字段不能为空', trigger: 'blur' }
        ],
        validDate: [
          { required: true, message: '字段不能为空', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '字段不能为空', trigger: 'blur' }
        ],
        totalCount: [
          { required: true, message: '字段不能为空', trigger: 'blur' }
        ],
        par: [
          { required: true, message: '字段不能为空', trigger: 'blur' }
        ],
      }
    };
  },
  watch: {
   
  },
  methods: {
    apiAddData(data) {
      // data.startDate += ':00';
      // data.endDate += ':00';
      this.$http.post('/makeCoupons/save', data)
      .then(res => {
        this.$message.success('提交成功')
        this.digClose()
        this.searchKeep();
      })
    },
    search(){
      this.searchKeep();
    },
    deleteConfirm() {
      this.$confirm(`此操作将删除 ${ this.tableList.title } 是否继续？`, "提示", {
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
      this.$http.post('/makeCoupons/delete', { id: this.tableList.id }).then(res => {
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
      this.model = JSON.parse(JSON.stringify(this.tableList))
    },
    digClose(flag) {
      this.updateId = "";
      this.dialogFormVisible = false;
      this.model = {}
    },
    // 提交
    submit() {
      this.$refs.model.validate(valid => {
        if (valid) {
          delete this.model.createTime
          delete this.model.updateTime
          delete this.model.isDeleted
          delete this.model.madeCount
          this.model.title  =  this.model.title.replace(/\s+/g,""); 
          this.apiAddData(this.model);
        } else {
          this.loading = false;
        }
      });
    },
    
  }
};
</script>