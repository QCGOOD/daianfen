<template>
  <div class="container">
    <div class="top">
      <div style="display: flex; align-items: inherit;">
        <img src="../../../../static/images/logo-mini.png" alt="">
        <!-- <h2>{{base.title}}</h2> -->
      </div>
      <div>
      <el-dropdown class="el-dropdown" :hide-on-click="false">
        <span class="el-dropdown-link">
          <i class="el-icon-setting"></i>admin
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="digShow = true">修改密码</el-dropdown-item>
          <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      </div>
    </div>
    <div class="main">
      <div class="sidebar" :style="{'height': `${sidebarHeight}px`}">
        <el-menu 
          :unique-opened="true" 
          v-if="menuList != null" 
          class="new-el-menu list-bg-color"  
          :router="true" 
          :default-active="$route.path"
          active-text-color="rgb(202, 104, 122)"
          text-color="#fff">
          <el-submenu v-if="item.menuList" v-for='(item,index) in menuList' :index="index+'-'" :key="item.name">
            <template slot="title">
              <i class="el-icon-caret-right" style="color:#fff;"></i>
              {{item.name}}
              </template>
            <el-menu-item class="el-menu-item" v-for="list in item.menuList" :key="list.name" :index="list.url">{{list.name}}</el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
      <el-dialog title="修改密码" :visible.sync="digShow" width="380px" :append-to-body="true" :before-close="close">
        <el-form :model="model" ref="model" label-width="100px" :rules="rules">
          <el-form-item label="旧密码" prop="oldPassword" :rules="[{ required: true, message: '密码不能为空', trigger: 'blur'}]">
            <el-input size="small" v-model="model.oldPassword" type="password"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword" :rules="[{ required: true, message: '新密码不能为空', trigger: 'blur'}]">
            <el-input size="small" v-model="model.newPassword" type="password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass" >
            <el-input size="small" v-model="model.checkPass" type="password"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="close()">取 消</el-button>
          <el-button size="small" type="primary" @click="apiPassword()">确 定</el-button>
        </span>
      </el-dialog>
      <router-view :style="{'height': `${wrapHeight}px`}"></router-view>
    </div>
  </div>
</template>

<script>
import api from "api/common.js";
export default {
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.model.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      rules: {
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      },
      digShow: false,
      model: {
        oldPassword: "",
        newPassword: "",
        checkPass: ""
      },
      app: [
        // 应用管理
        {
          name: "应用管理",
          menuList: [
            {
              name: "应用管理",
              url: "/main/app",
            },
          ]
        },
      ],
      setting: [
        // 系统管理
        {
          name: "系统管理",
          menuList: [
            // {
            //   name: "系统报名字段",
            //   url: "/main/signDataSetting"
            // },
            {
              name: "引导关注",
              url: "/main/follow"
            }
          ]
        },
      ],
      dataTongji: [
        // 数据统计
        {
          name: "数据统计",
          menuList: [
            {
              name: "pv/uv汇总",
              url: "/main/statistical",
            },
            {
              name: "预约汇总",
              url: "/main/statistical/totalReserve",
            },
          ]
        },
      ],
      reserve: [
        // 预约管理
        {
          name: "预约管理",
          menuList: [
            {
              name: "预约记录",
              url: "/main/reserve",
            },
          ]
        },
      ],
      reserveSetting: [
        // 预约设置
        {
          name: "预约设置",
          menuList: [
            {
              name: "更换背景图",
              url: "/main/bgSetting",
            },
            {
              name: "预约时间",
              url: "/main/timeSetting",
            },
            {
              name: "其他",
              url: "/main/otherSetting",
            }
          ]
        },
      ],
      guide: [
        // 导购管理
        {
          name: "导购管理",
          menuList: [
            {
              name: "导购列表",
              url: "/main/guide",
            },
          ]
        },
      ],
      shop: [
        // 专柜管理
        {
          name: "专柜管理",
          menuList: [
            {
              name: "专柜列表",
              url: "/main/shop",
            },
          ]
        },
      ],
      coupon: [
        // 优惠券管理
        {
          name: "优惠券管理",
          menuList: [
            // {
            //   name: "优惠券列表",
            //   url: "/main/coupon/couponList",
            // },
            {
              name: "领取列表",
              url: "/main/coupon",
            },
            {
              name: "制券规则",
              url: "/main/coupon/ruleList",
            },
          ]
        },
      ],
      activity: [
        // 活动管理
        {
          name: "活动管理",
          menuList: [
            {
              name: "活动列表",
              url: "/main/activity",
            },
          ]
        },
      ],
      member: [
        // 活动管理
        {
          name: "会员管理",
          menuList: [
            {
              name: "会员列表",
              url: "/main/member",
            },
          ]
        },
      ],
      menuList: [],
      wrapHeight: 0,
      sidebarHeight: 0
    };
  },
  created() {
    this.menuList = [
      // ...this.app,
      // ...this.power,
      // ...this.category,
      // ...this.product,
      // ...this.setting,
      ...this.dataTongji,
      ...this.reserve,
      ...this.reserveSetting,
      ...this.coupon,
      ...this.guide,
      ...this.shop,
      ...this.activity,
      ...this.member,
      // ...this.level,
      // ...this.channel,
      // ...this.distributer,
      // ...this.attachment,
    ]
  },
  mounted() {
    this.getHeight();
    window.onresize = () => {
      this.getHeight();
    };
  },
  methods: {
    getHeight() {
      this.wrapHeight = window.innerHeight - 120;
      this.sidebarHeight = window.innerHeight - 80;
    },
    apiPassword() {
      this.$refs.model.validate(valid => {
        if (valid) {
          this.$http.post('/account/change', this.model)
            .then(res => {
              this.$message.success('修改成功');
              this.close();
              setTimeout(() => {
                this.$router.push("/login");
              }, 1000);
            })
            .catch(err => {
              this.$message({
                message: err.data.errMsg,
                type: "error"
              });
            });
        } else {
          return false;
        }
      });
    },
    apiLogout() {
      this.$http.get('/logout').then(res => {
        this.$router.replace("/login");
        this.$message.info('已退出')
      });
    },
    close() {
      this.digShow = false;
      this.$refs.model.resetFields();
    },
    // 退出
    logout() {
      this.$confirm(`确认退出登录？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        this.apiLogout();
      })
      .catch(() => {
        return;
      });
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  position: relative;
  height: 100%;
  .top {
    top: 0;
    position: absolute;
    // background: #2c3135;
    height: 80px;
    width: 100%;
    line-height: 30px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 30px;
    justify-content: space-between;
    // background-image: linear-gradient(to right, #4facfe 0%, #4edee4 120%);
    img {
      width: 140px;
      margin: 0 52px 0 30px;
    }
    .el-dropdown{
      font-size:16px;
      margin-right: 25px;
      &:hover{
        cursor: pointer;
      }
      i{
        margin-right:5px;
      }
    }
  }
  .main {
    display: flex;
    position: absolute;
    top: 80px;
    bottom: 0;
    width: 100%;
    height: 100%;
    // background: #f6f6f8;
    background: #f2f2f2;
    // border: 1px solid #ddd;
    box-sizing: border-box;
    .sidebar {
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      flex: 217px 0;
      flex-shrink: 0;
      // height: 100%;
      overflow-y: auto;
      background-color: rgb(67, 67, 67);
      
      .new-el-menu {
        // background-color: rgb(67, 67, 67);
        .el-submenu:hover{
        .el-submenu__title:hover{
          background-color: rgb(67, 67, 67);
        }
      }
        .el-menu-item{
          background-color: rgb(67, 67, 67);
          &:hover {
            background:#000;
          }
        }
      }
    }
    .wrap {
      flex: 1;
      margin: 20px;
      background: #fff;
      overflow: auto;
      border: 1px solid #eee;
    }
  }
  .el-menu-item {
    font-size: 14px;
  }
  .el-menu {
    border: 0;
    background-color: rgb(67, 67, 67);
  }
}
</style>
