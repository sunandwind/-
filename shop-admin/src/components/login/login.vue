<template>
  <div class="login">
    <!-- el-form: 表单组件 -->
    <!-- :model="form" form对象用来收集表单中所有的数据 -->
    <!-- label-width：设置label的宽度 -->
    <!-- el-form-item：表单项 -->
    <!-- rules: 设置校验的规则 给每一个el-form-item设置一个prop属性 v-model的值一样 -->
    <el-form ref="form" :model="form" label-width="80px" :rules="rules">
      <img src="../imags/leo.jpg" alt="">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password">
    <el-input v-model="form.password" placeholder="请输入密码" type="password"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="login">登录</el-button>
    <el-button @click="reset">重置</el-button>
  </el-form-item>
</el-form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    reset() {
      this.$refs.form.resetFields()
    },
    login() {
      this.$refs.form.validate(valid => {
        if (valid) {
          axios({
            url: 'http://localhost:8888/api/private/v1/login',
            method: 'post',
            data: this.form
          }).then(res => {
            if (res.data.meta.status === 200) {
              this.$message.success('登录成功')
              this.$router.push('/home')
            } else {
              this.$message.error(res.data.meta.msg)
            }
          })
        } else {
          console.log('没通过')
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
/*
  vue脚手架给我们配置了less的配置，但是并没有安装less 和 less-loader
  yarn add less less-loader -D
*/
.login {
  height: 100%;
  background-color: #2d434c;
  overflow: hidden;
  .el-form {
    width: 400px;
    margin: 200px auto;
    background-color: #fff;
    padding: 75px 40px 15px;
    border-radius: 20px;
    position: relative;
    img {
      width: 150px;
      height: 150px;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: -100px;
      border-radius: 50%;
      border: 10px solid #fff;
    }
    .el-button + .el-button {
      margin-left: 70px;
    }
  }
}
</style>
