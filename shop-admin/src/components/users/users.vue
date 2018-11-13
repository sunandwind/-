<template>
  <div class="users">
    <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/users' }">用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
 <div>
   <el-input placeholder="请输入关键字" class="input-with-select" v-model="query">
    <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
 </el-input>
  <el-button type="success" plain @click="showAddDialog">用户添加</el-button>
 </div>
  <el-table
    :data="userList"
    style="width: 100%">
    <el-table-column
      prop="username"
      label="姓名"
      width="180">
    </el-table-column>
    <el-table-column
      prop="email"
      label="邮箱"
      width="180">
    </el-table-column>
     <el-table-column
      prop="mobile"
      label="电话"
      width="180">
    </el-table-column>
    <el-table-column
      label="状态"
      width="180">
       <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeState(scope.row)">
          </el-switch>
        </template>
    </el-table-column>
     <el-table-column
        label="操作">
        <!-- 自定义这一列的内容，必须指定template -->
        <template slot-scope="scope">
          <el-button size="small" plain type="primary" icon="el-icon-edit"  @click="showEditDialog(scope.row)"></el-button>
          <el-button size="small" plain type="danger" icon="el-icon-delete" @click="delUser(scope.row.id)"></el-button>
          <el-button size="small" plain type="success" icon="el-icon-check">分配角色</el-button>
        </template>
      </el-table-column>
  </el-table>
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[2, 4, 6, 8]"
      background
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加用户的对话框 -->
    <!-- el-dialog: 对话框组件 -->
    <!-- :visible:控制对话框的显示 -->
    <!-- width: 设置对话框的宽度 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="40%"
    >
      <!-- 添加用户的表单 -->
      <el-form ref="addForm" :model="addForm" :rules="rules" status-icon label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input placeholder="请输入用户名" v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input placeholder="请输入密码" v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入邮箱" v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input placeholder="请输入电话" v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
 <!-- 修改对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="40%"
    >
      <el-form ref="editForm" :model="editForm" :rules="rules" status-icon label-width="80px">
        <el-form-item label="用户名">
          <el-tag type="info">{{editForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入邮箱" v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input placeholder="请输入电话" v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    return {
      query: '',
      currentPage: 1,
      pageSize: 2,
      total: 0,
      userList: [],
      // 控制添加用户的对话框的显示， false
      addDialogVisible: false,
      // 收集添加用户的数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入正确格式的邮箱', trigger: 'blur' }
        ],
        mobile: [
          {
            pattern: /^1\d{10}$/,
            message: '请输入正确的手机号',
            trigger: 'blur'
          }
        ]
      },
      // 控制编辑用户的数据
      editDialogVisible: false,
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      }
    }
  },
  methods: {
    getUserList() {
      axios({
        method: 'get',
        url: 'http://localhost:8888/api/private/v1/users',
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        },
        headers: {
          Authorization: localStorage.getItem('token')
        }
      }).then(res => {
        console.log(res.data)
        if (res.meta.status === 200) {
          this.userList = res.data.users
          this.total = res.data.total
        }
      })
    },
    handleSizeChange(val) {
      this.currentPage = 1
      this.pageSize = val
      // 重新渲染
      this.getUserList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      // 重新发送ajax请求获取数据
      this.getUserList()
    },
    search() {
      this.currentPage = 1
      this.getUserList()
    },
    // 删除用户
    delUser(id) {
      this.$confirm('你确定要删除这个用户吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          axios({
            method: 'delete',
            url: `http://localhost:8888/api/private/v1/users/${id}`,
            headers: {
              Authorization: localStorage.getItem('token')
            }
          }).then(res => {
            if (res.meta.status === 200) {
              if (this.userList.length === 1 && this.currentPage > 1) {
                this.currentPage--
              }
              this.getUserList()
              this.$message.success('删除成功了')
            }
          })
        })
        .catch(() => {
          this.$message.error('你取消了删除操作')
        })
    },
    changeState({ id, mg_state: mgState }) {
      this.axios({
        url: `users/${id}/state/${mgState}`,
        method: 'put'
      }).then(res => {
        if (res.meta.status === 200) {
          this.$message.success('修改状态成功了')
        } else {
          this.$message.error('修改状态失败了')
        }
      })
    },
    showAddDialog() {
      this.addDialogVisible = true
    },
    addUser() {
      this.$refs.addForm.validate(valid => {
        if (!valid) return false
        this.axios({
          method: 'post',
          url: 'users',
          data: this.addForm
        }).then(res => {
          let { meta: { status } } = res
          if (status === 201) {
            this.total++
            this.currentPage = Math.ceil(this.total / this.pageSize)
            this.getUserList()
            this.addDialogVisible = false
            this.$refs.addForm.resetFields()
          }
        })
      })
    },
    showEditDialog(user) {
      this.editDialogVisible = true
      this.editForm.id = user.id
      this.editForm.username = user.username
      this.addForm.email = user.email
      this.editForm.mobile = user.mobile
    },
    editUser() {
      this.$refs.editForm.validate(valid => {
        if (!valid) return false
        this.axios({
          method: 'put',
          url: `users/${this.editForm.id}`,
          data: this.editForm
        }).then(res => {
          let { meta: { status } } = res
          if (status === 200) {
            this.getUserList()
            // 重置
            this.$refs.editForm.resetFields()
            // 隐藏
            this.editDialogVisible = false
          }
        })
      })
    }
  },
  created() {
    this.getUserList()
  }
}
</script>
<style lang="less" scoped>
.el-breadcrumb {
  height: 30px;
  line-height: 30px;
}

.input-with-select {
  width: 400px;
  margin-bottom: 10px;
}
</style>
