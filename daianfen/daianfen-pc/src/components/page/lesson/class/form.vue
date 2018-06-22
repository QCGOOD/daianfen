<template>
<el-dialog :title='id ? "修改" : "添加"' :visible.sync="visible" width="880px" :append-to-body="true" :before-close="close" :close-on-click-modal="false" :close-on-press-escape="false">
  <div style="overflow: auto;" v-loading="dataLoading">
    <el-form :model="model" ref="model" class="new-form" label-position="top" size="small">
      <el-form-item>
        <el-form-item label="班级名称" prop="name" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-input v-model="model.name"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="info" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-input v-model="model.info"></el-input>
        </el-form-item>
        <el-form-item label="课程" prop="courseId" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-select v-model="model.courseId" placeholder="请选择课程">
            <el-option  v-for="(item, i) in lesson" :key="i" :label="item.title" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="讲师" prop="lecturerId" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-select v-model="model.lecturerId" placeholder="请选择课程">
            <el-option  v-for="(item, i) in lecturer" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form-item>
    </el-form>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="close(false)">取 消</el-button>
    <el-button size="small" type="primary" @click="success()" :loading="loading">确 定</el-button>
  </span>
</el-dialog>
</template>

<script>
import api from "api/common";
export default {
  props: {
    visible: Boolean,
    id: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      model: {
        name: "",
        info: "",
        courseId: "",
        lecturerId: ""
      },
      lesson: [],
      lecturer: [],
      loading: false,
      dataLoading: false
    };
  },
  created() {
    this.listLesson();
    this.listLecturer();
  },
  watch: {
    visible(val) {
      if (val && this.id != "") {
        this.dataLoading = true;
        this.detail();
      }
    }
  },
  methods: {
    listLesson() {
      api.listLesson({ pageSize: 200, pageNum: 1 }).then(res => {
        console.log(res.data)
        this.lesson = res.data.data.list
      })
    },
    listLecturer() {
      api.listLecturer({ pageSize: 200, pageNum: 1 }).then(res => {
        this.lecturer = res.data.data.list
        console.log('this.lecturer === ', this.lecturer)
      })
    },
    //获取
    detail() {
      api.getClass({ id: this.id }).then(res => {
        console.log(res.data.data);
        this.model = res.data.data;
        this.dataLoading = false;
      });
    },
    //添加
    save(model) {
      api
        .addClass(this.model)
        .then(res => {
          this.loading = false;
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.close(true);
        })
        .catch(err => {
          this.loading = false;
        });
    },
    //修改
    update() {
      api
        .updateClass(this.model)
        .then(res => {
          this.loading = false;
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.close(true);
        })
        .catch(err => {
          this.loading = false;
        });
    },
    success() {
      this.$refs.model.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.id != "") {
            this.update();
          } else {
            this.save(this.model);
          }
        } else {
          return false;
        }
      });
    },
    close(flag) {
      this.model = this.reduc();
      this.$emit("close", flag);
    },
    reduc() {
      let model = {
        name: "",
        info: "",
        courseId: "",
        lecturerId: ""
      };
      return model;
    }
  }
};
</script>

