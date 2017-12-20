<template>
  <div class="out-box">
    <!--弹出对话框 Begin-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" size="small">
      <el-form :label-position="labelPosition" :rules="rules" ref="form" label-width="80px" :model="form">
        <el-row :gutter="24">
          <el-col :span="10" :offset="2">
            <div class="grid-content bg-purle">
              <el-form-item required label="用户名" prop="username">
                <el-input placeholder="用户名" :disabled="isDisabled" v-model="form.username"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purle">
              <el-form-item required label="姓名" prop="name">
                <el-input placeholder="姓名" v-model="form.name"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="10" :offset="2">
            <div class="grid-content bg-purle">
              <el-form-item label="手机号">
                <el-input placeholder="手机号" v-model="form.mobile"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purle">
              <el-form-item label="角色" prop="roleId">
                <el-select :disabled="disabledAdmin" @change="changeRole" v-model="form.roleId" placeholder="请选择角色">
                  <el-option
                    v-for="item in roleList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="10" :offset="2" v-if="form.roleId=='customer'">
            <div class="grid-content bg-purle">
              <el-form-item label="关联客户" prop="customerId">
                <el-select v-model="form.customerId" placeholder="关联客户">
                  <el-option v-for="linkCustomer in linkCustomerList" :label="linkCustomer.name" :value="linkCustomer.id"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="10" :offset="2" v-else-if="form.roleId=='agent'">
            <div class="grid-content bg-purle">
              <el-form-item label="关联代理商" prop="agentId">
                <el-select v-model="form.agentId" placeholder="关联代理商">
                  <el-option v-for="linkAgent in linkAgentList" :label="linkAgent.name" :value="linkAgent.id"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="10" :offset="2" v-else-if="form.roleId=='maintain'">
            <div class="grid-content bg-purle">
              <el-form-item label="关联修理人员" prop="maintainStaffId">
                <el-select v-model="form.maintainStaffId" placeholder="关联修理人员">
                  <el-option v-for="linkMaintainStaff in linkMaintainStaffList" :label="linkMaintainStaff.name" :value="linkMaintainStaff.id"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>

        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDialog('form')">确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>

      </div>
      <footer class="footer-tip" v-if="dialogTitle === '新增用户'">
        * 确认后用户名不可更改，初始密码为：123456，开通账号后请及时修改密码！
      </footer>
    </el-dialog>
    <!--弹出对话框 End-->
    <div class="body-box">
      <el-row class="row-box">
        <el-col :span="24">
          <div class="grid-content bg-purple btn-box">
            <span class="btn-span" @click="addUser">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-zengjia"></use>
                </svg><span>增加</span>
            </span>
            <span class="btn-span" @click="delet">
              <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-shanchu"></use>
                </svg>删除
            </span>
            <span class="btn-span" @click="resetPassword">
              <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-zhongzhimima"></use>
              </svg>重置密码
            </span>
          </div>
        </el-col>
      </el-row>
      <div class="table-box">
        <el-table :data="data" stripe style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
          <el-table-column :selectable="checkSelectable" type="selection" width="50"></el-table-column>
          <el-table-column prop="username" label="用户姓名" min-width="100">
          </el-table-column>
          <el-table-column prop="name" label="真实姓名" min-width="100">
          </el-table-column>
          <el-table-column prop="mobile" label="手机号" min-width="100">
          </el-table-column>
          <el-table-column prop="roleName" label="用户角色" min-width="100">
          </el-table-column>
          <el-table-column prop="updateDate" label="添加时间" min-width="120">
          </el-table-column>
          <el-table-column label="操作" min-width="70">
            <template scope="scope">
              <svg class="icon" aria-hidden="true" @click="handleEdit(scope.$index, scope.row)">
                <use xlink:href="#icon-bianji"></use>
              </svg>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination @size-change="handleSizeChange" :page-sizes="[10,15, 20, 30, 999]" :page-size="page_size" @current-change="handleCurrentChange" layout="sizes, prev, pager, next" :total="totalCount">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        url: {
          userList: 'api/admin/user',
          addUser: 'api/admin/user',
          editUser: 'api/admin/user',
          deleUsers: 'api/admin/users',
          customerList: 'api/admin/customer',
          agentList: 'api/admin/agent',
          maintainStaffList: 'api/admin/maintainStaff',
          resetPassword: 'api/admin/users/password',
        },
        rules: { 
          username: [{
            required: true,
            message: '用户名不能为空',
          }, ],
          name: [{
            required: true,
            message: '姓名不能为空',
          }, ],
          roleId: [{
            required: true,
            message: '请选择角色',
            trigger: 'change'
          }],
          customerId: [{
            required: true,
            message: '请选择关联客户',
            trigger: 'change'
          }],
          agentId: [{
            required: true,
            message: '请选择代理商',
            trigger: 'change'
          }],
          maintainStaffId: [{
            required: true,
            message: '请选择维修人员',
            trigger: 'change'
          }],

        },
        roleList:[
          {
            value: 'superadmin',
            label: '超级管理员',
            disabled: true
          },
          {
            value: 'admin',
            label: '管理员',
          },
          {
            value: 'customerservice',
            label: '客服',
          },
          {
            value: 'customer',
            label: '客户',
          },
          {
            value: 'agent',
            label: '代理商',
          },
          {
            value: 'maintain',
            label: '维修人员',
          },
        ],
        options:[],//批量删除参数容器
        row:null,//用于编辑用户传参
        linkCustomerList: [], //关联用户列表
        linkAgentList: [], //关联代理商列表
        linkMaintainStaffList: [], //关联维修人员列表
        tableData: [],
        isDisabled: false,
        disabledAdmin:false,
        cur_page: 1,
        page_size: 10,
        totalCount: 1,
        multipleSelection: [], //选择容器

        dialogTitle: '新增用户',
        dialogFormVisible: false,
        labelPosition: 'top',
        form: { //弹出框数据容器
          username: '',
          name: '',
          mobile: '',
          roleId: '',
          customerId: '',
          agentId: '',
          maintainStaffId: '',
        },
        formLabelAlign: {
          agent: '',
          linkman: '',
          contact: '',
          area: ''
        }
      };
    },
    mounted() {
      this.getData();
    },
    computed: {
      data() {
        const self = this;
        return self.tableData
      }

    },
    methods: {
      checkSelectable (row, index) {//表格多选选择性不可选
          //通过id来禁止不能选择的项
        // return row.id !== 1
        //通过索引index来禁止不能选择的项
        return row.roleId !='superadmin'
      },
      changeRole() {
        if(this.dialogTitle === '新增用户'){
          this.row = null;
        }
        this.form.customerId = "";
        this.form.agentId = "";
        this.form.maintainStaffId = "";
        if(this.form.roleId === 'customer') { //获取关联客户列表
          this.$axios.get(this.url.customerList, {
            headers: { //get添加请求头
              'Auth-Token': sessionStorage.getItem('spaceflight_token')
            }
          }).then((res) => {

            this.linkCustomerList = res.data.data;
            if(this.row && this.row.customerId) {
              this.form.customerId = this.row.customerId
            }

          })
        } else if(this.form.roleId === 'agent') {
          this.$axios.get(this.url.agentList, {
            headers: { //get添加请求头
              'Auth-Token': sessionStorage.getItem('spaceflight_token')
            }
          }).then((res) => {

            this.linkAgentList = res.data.data
            if(this.row && this.row.agentId) {
              this.form.agentId = this.row.agentId
            }
          })
        } else if(this.form.roleId === 'maintain') {
          this.$axios.get(this.url.maintainStaffList, {
            headers: { //get添加请求头
              'Auth-Token': sessionStorage.getItem('spaceflight_token')
            }
          }).then((res) => {

            this.linkMaintainStaffList = res.data.data
            if(this.row && this.row.maintainStaffId) {
              this.form.maintainStaffId = this.row.maintainStaffId
            }
          })
        }

      },

      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      submitDialog(formName) {
        this.$refs[formName].validate((valid) => {
          if(valid) {
            if(this.dialogTitle === '新增用户') {
              this.checkAddUser(formName)
            } else {
              this.checkUpdateUser()
            }

          }
        })

      },
      checkUpdateUser() {
        this.$axios.put(this.url.editUser + '/' + this.row.id, {
          params: this.form
        }, {
          headers: { //post添加请求头
            'Auth-Token': sessionStorage.getItem('spaceflight_token')
          }
        }).then((res) => {
          if(res.data.success) {
            this.dialogFormVisible = false;
            this.$message.success(res.data.message)
            this.getData();

          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      checkAddUser(formName) {
        this.$axios.post(this.url.addUser, {
          params: this.form
        }, {
          headers: { //post添加请求头
            'Auth-Token': sessionStorage.getItem('spaceflight_token')
          }
        }).then((res) => {
          if(res.data.success) {
            this.dialogFormVisible = false;
            this.$message.success(res.data.message)
            this.getData();

            this.form = { //弹出框数据容器
              username: '',
              name: '',
              mobile: '',
              roleId: '',
              customerId: '',
              agentId: '',
              maintainStaffId: '',
            }

          } else {
            this.$message.error(res.data.message)
          }

        })
      },
      addUser() { //新增用户
        this.dialogTitle = '新增用户';
        this.isDisabled = false;
        this.dialogFormVisible = true;
        this.form = { //弹出框数据容器
          username: '',
          name: '',
          mobile: '',
          roleId: '',
          customerId: '',
          agentId: '',
          maintainStaffId: '',
        }
      },
      handleEdit(index, row) {
        console.log(row)
        this.row = row;
        this.dialogTitle = '编辑用户';
        this.isDisabled = true;
        this.dialogFormVisible = true;
        if(row.roleId==="superadmin"){
          this.disabledAdmin = true
        }else {
          this.disabledAdmin = false
        }
//      this.userId = row.id
        this.form = { //弹出框数据容器 
          username: row.username,
          name: row.name,
          mobile: row.mobile,
          roleId: row.roleId,
          customerId: '',
          agentId: '',
          maintainStaffId: '',
        }
        this.changeRole()
      },

      handleSizeChange(val) { //改变每页容量
        this.page_size = val;
        this.getData()
      },
      handleCurrentChange(val) {
        this.cur_page = val;
        this.getData();
      },
      getData() {
        let self = this;
        self.$axios.get(self.url.userList, {
          params: {
            pageIndex: self.cur_page - 1,
            pageSize: self.page_size
          },
          headers: { //get添加请求头
            'Auth-Token': sessionStorage.getItem('spaceflight_token')
          }
        }).then((res) => {
          if(res.data.success) {
            self.totalCount = res.data.data.recordCount
            self.tableData = res.data.data.records;
            console.log(self.tableData)
          }else if(res.data.code==200){
            this.$router.push('/login')
          } else {
            self.$message.error(res.data.message)
          }
        })
      },
      /*filterTag(value, row) {
        return row.tag === value;
      },*/
      /*add() { //新增用户
        this.dialogFormVisible = true
      },*/
      resetPassword() {//批量重置密码
        if(this.multipleSelection.length > 0) {
          for(let i in this.multipleSelection){
            this.options[i] = this.multipleSelection[i].id
          }
          this.open3();
        } else {
          this.$message.error("请选择要重置密码的用户")
        }
      },
      open3() { //删除前提示
        this.$confirm('此操作将重置选中用户的密码（还原为：123456）, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'

        }).then(() => {
          this.$axios({
            method: 'delete',
            url: this.url.resetPassword,
            data: {
              params:{
                  id__in:this.options
              },
            },
            headers: {//get添加请求头
                'Auth-Token': sessionStorage.getItem('spaceflight_token')
              } 
          }).then((res)=>{
              if(res.data.success) {
              this.$message({
                type: 'success',
                message: '操作成功!'
              });
              this.getData();
            } else {
              this.$message.error(res.data.message)
              this.getData();
            }
          });

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      },
      delet() {//批量删除
        if(this.multipleSelection.length > 0) {
          for(let i in this.multipleSelection){
            this.options[i] = this.multipleSelection[i].id
          }
          this.open2();
        } else {
          this.$message.error("请选择要删除的用户")
        }
      },
      open2() { //删除前提示
        this.$confirm('此操作将永久删除选中的用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'

        }).then(() => {
          this.$axios({
            method: 'delete',
            url: this.url.deleUsers,
            data: {
              params:{
                  id__in:this.options
              },
            },
            headers: {//get添加请求头
                'Auth-Token': sessionStorage.getItem('spaceflight_token')
              } 
          }).then((res)=>{
              if(res.data.success) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getData();
            } else {
              this.$message.error(res.data.message)
              this.getData();
            }


          });

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      handleSelectionChange(val) {
        console.log(val)
        this.multipleSelection = val;
      },

    }
  }
</script>

<style scoped="scoped">
  .btn-span {
    height: 36px;
    display: inline-flex;
    align-items: center;
    vertical-align: bottom;
    font-size: 14px;
    margin-left: 20px;
    cursor: pointer;
  }
  
  .btn-span>span {
    vertical-align: bottom;
  }
  
  .btn-span .icon {
    font-size: 20px;
    margin-right: 4px;
  }
  
  .out-box {
    height: 100%;
  }
  
  .body-box {
    overflow: auto;
  }
  
  .row-box {
    padding: 20px;
    border-bottom: 1px solid #e1e4e6;
  }
  
  .table-box {
    padding: 0 20px;
  }
  
  .btn-box {
    text-align: right;
  }

  
  .cell .icon {
    margin-right: 0;
    color: #20A0FF;
  }
  .footer-tip {    
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    color: #ff8a8e;
    background-color: #fde8e7;
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow:ellipsis;
    
  }
</style>