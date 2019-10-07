<template>
  <div id="app">
    <h1>信息登记系统</h1>
    <div class="head">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入姓名" v-model="userInfo.name"></el-input>
        </el-col>
        <el-col :span="6">
          <el-input placeholder="请输入性别" v-model="userInfo.gender"></el-input>
        </el-col>
        <el-col :span="6">
          <el-input placeholder="请输入电话号码" v-model="userInfo.phoneNumber"></el-input>
        </el-col>
        <el-col :span="6">
          <el-date-picker
            v-model="userInfo.birthday"
            type="date"
            placeholder="请选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-col>
      </el-row>
      <!-- 添加按钮 -->
      <el-button 
        type="primary"
        class="add-btn" 
        @click="addUser(userInfo.name,userInfo.gender,userInfo.phoneNumber,userInfo.birthday)"
      >添加信息
      </el-button>
    </div>
    <div class="body">
      <template>
        <el-table :data="data" style="width: 100%">
          <el-table-column prop="data.id" label="序号" width="180">
            <template slot-scope="scope">{{scope.$index+1}}</template>
            <!-- 筛选序号 -->
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="180"></el-table-column>
          <el-table-column prop="gender" label="性别" width="180"></el-table-column>
          <el-table-column prop="phoneNumber" label="电话号码" width="180"></el-table-column>
          <el-table-column prop="birthday" label="出生日期" width="180"></el-table-column>

          <el-table-column prop label="操作" width="180">
            <!-- 编辑、删除按钮 -->
            <template slot-scope="scope">
              <!-- 编辑 -->
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="editUser(scope.row,scope.$index)"
              ></el-button>
              <!-- 删除 -->
              <el-button
                style="borderRadius:0;padding:7px;"
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="delUser(scope)"
              >
                <!-- circle -->
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <!-- 用户修改弹框 -->
    <el-dialog title="编辑用户信息" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      
        <div>
          <el-form ref="form" :model="editObj" label-width="80px">
            <el-form-item label="姓名">
              <el-input v-model="editObj.name"></el-input>
            </el-form-item>
            <el-form-item label="性别">
              <el-input v-model="editObj.gender"></el-input>
            </el-form-item>
            <el-form-item label="电话号码">
              <el-input v-model="editObj.phoneNumber"></el-input>
            </el-form-item>
            <el-form-item label="出生日期">
              <el-date-picker
                v-model="editObj.birthday"
                type="date"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                placeholder="请选择日期"
              ></el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
           
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button 
            style="borderRadius:0" 
            type="primary" 
            @click="confirm(editObj.name,editObj.gender,editObj.phoneNumber,editObj.birthday)"
          >提交
          </el-button>
      
        </span>
  
    </el-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import {
  getUserSession,
  delUserSession,
  changeUserSession,
  addUserSession,
} from "./api/userApi.js";

export default {
  name: "app",
  props: {
    msg: String
  },
  data: function() {
    return {
      userInfo: {
        //用户信息初始化
        name: "",
        gender: "",
        phoneNumber: "",
        birthday: ""
      },
      // tableData: [
      //   {
      //     name: "张三",
      //     gender: "男",
      //     phoneNumber: "18770731123",
      //     birthday: "2018-12-24"
      //   }
      // ],
      data: [],
      //控制修改弹框显示隐藏
      dialogVisible: false,
      //修改弹框初始化
      editObj: {
        name: "",
        gender: "",
        phoneNumber: "",
        birthday: ""
      },
      //保存下标方便编辑
      userIndex: 0
    };
  },
  methods: {
    //添加用户信息
    addUser(n,g,p,b) {
         let adddata = addUserSession(n,g,p,b);
      //优化思路：为减少代码淤积，n多项校验时，考虑策略模式
      // //姓名校验
      if (!this.userInfo.name) {
        this.$message({
          message: "姓名不能为空",
          type: "warning"
        });
        return;
      }
      if (!/^[\u4e00-\u9fa5]/.test(this.userInfo.name)) {
        this.$message({
          message: "姓名必须为中文",
          type: "warning"
        });
        return;
      }
      //性别校验
      if (!this.userInfo.gender) {
        this.$message({
          message: "性别不能为空",
          type: "warning"
        });
        return;
      }
      if (!/^男$|^女$/.test(this.userInfo.gender)) {
        this.$message({
          message: "性别必须为男或女",
          type: "warning"
        });
        return;
      }
      //电话号码校验
      if (!this.userInfo.phoneNumber) {
        this.$message({
          message: "电话号码不能为空",
          type: "warning"
        });
        return;
      }
      if (!/^1[35789]\d{9}$/.test(this.userInfo.phoneNumber)) {
        this.$message({
          message: "电话号码格式不正确",
          type: "warning"
        });
        return;
      }
      //生日校验
      if (!this.userInfo.birthday) {
        this.$message({
          message: "出生日期不能为空",
          type: "warning"
        });
        return;
      }
      //添加一个列表
      // this.tableData.push(this.userInfo);
      this.data.push(this.userInfo);
      this.userInfo = {
        //点击按钮后清空输入框
        name: "",
        gender: "",
        phoneNumber: "",
        birthday: ""
      };
    },
    //删除用户信息
    delUser(item) {
      this.$confirm("确认删除？")
        .then(() => {
          this.data.splice(item.$index, 1);
          console.log(item.row.id);
          let deldata = delUserSession(item.row.id);
        })
        .catch(() => {
          return;
        });
    },
    //编辑用户数据
    editUser(item, idx) {
      this.userIndex = idx;
      this.editObj = {
        name: item.name,
        gender: item.gender,
        birthday: item.birthday,
        phoneNumber: item.phoneNumber
      };
      this.dialogVisible = true;
    },
    handleClose() {
      //叉掉
      this.dialogVisible = false;
    },
    confirm(n,g,p,b) {
      //编辑提交
      this.dialogVisible = false;
      Vue.set(this.data, this.userIndex, this.editObj);
      //this.tableDate[this.userIndex] = this.editObj
      //上面注释这种方法监听不到数组index和length变化
      console.log(this.userIndex)
      console.log(n)
      console.log(g)
      console.log(p)
      console.log(b)
      let changedata = changeUserSession(n,g,p,b,this.userIndex)
    }
  },
  async created() {
    let data = await getUserSession();
    console.log(data);
    this.data = data;
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  color: #2c3e50;
  margin-top: 60px;
}
.add-btn {
  width: 100%;
  margin-top: 20px;
}
.body {
  margin-top: 20px;
}
</style>
