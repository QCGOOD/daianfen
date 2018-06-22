<template>
<el-dialog :title='id ? "修改班级" : "添加班级 "' :visible.sync="visible" width="880px" :append-to-body="true" :before-close="close" :close-on-click-modal="false" :close-on-press-escape="false">
  <div style="overflow: auto;">
    <el-form :model="model" ref="model" class="new-form" label-position="top" size="small">
      <el-form-item>
        <el-form-item label="标题" prop="title" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-input v-model="model.title"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="info" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-input v-model="model.info"></el-input>
        </el-form-item>
        <el-form-item label="地点" prop="place" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-input v-model="model.place"></el-input>
        </el-form-item>
        <el-form-item label="详细地址" prop="address" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-input v-model="model.address"></el-input>
        </el-form-item>
        <el-form-item label="时间" prop="startTime" :rules="[{ required: true, message: '该字段不能为空'}]">
          <el-date-picker
            :editable="false"
            v-model="datetime"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
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
    },
    courseId: String,
    courseClassId: String,
    copy: Boolean,
  },
  data() {
    return {
      model: {
        title: "",
        info: "",
        place: "",
        address: "",
        startTime: "",
        endTime: "",
        courseId: this.courseId,
        courseClassId: this.courseClassId,
      },
      datetime: [],
      lesson: [],
      lecturer: [],
      loading: false,
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.model.courseId = this.courseId
        this.model.courseClassId = this.courseClassId
        if (this.id != "") {
          this.detail();
        }
      }
    },
    datetime(val) {
      if (val) {
        this.model.startTime = val[0];
        this.model.endTime = val[1];
      } else {
        this.model.startTime = "";
        this.model.endTime = "";
      }
    }
  },
  methods: {
    //获取
    detail() {
      api.getClassHour({ id: this.id }).then(res => {
        console.log(res.data.data);
        this.model = res.data.data;
        this.datetime = [
          this.model.startTime,
          this.model.endTime
        ];
        if (this.copy) {
          delete this.model.id
          delete this.model.createTime
        }
        console.log('model === ', this.model)
      });
    },
    //添加
    save(model) {
      api
        .addClassHour(this.model)
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
        .updateClassHour(this.model)
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
          if (this.copy) {
            this.save();
          } else if (this.id != "") {
            this.update();
          } else {
            this.save();
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
        title: "",
        info: "",
        place: "",
        address: "",
        startTime: "",
        endTime: "",
        courseId: "",
        courseClassId: "",
      };
      return model;
    }
  },
};
</script>

