<template>
  <div class="header">
    <div class="logo"></div>
    <div class="user-info">
      <el-dropdown trigger="hover" @command="handleCommand">
        <span class="el-dropdown-link">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-mess"></use>
          </svg><span style="font-size:16px;display:inline-block;line-height: 36px;vertical-align: top">{{username}}</span>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="editOwnMess">个人信息</el-dropdown-item>
          <el-dropdown-item command="changePassWord">修改密码</el-dropdown-item>
          <el-dropdown-item command="loginout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" class="changePassword" size="tiny">
      <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" class="demo-ruleForm">
        <el-row>

          <el-col :span="18" :offset="3">
            <div class="grid-content bg-purple">
              <el-form-item label="原密码" prop="oldPass">
                <el-input type="password" v-model="ruleForm2.oldPass" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="新密码" prop="pass">
                <el-input type="password" v-model="ruleForm2.pass" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="checkPass">
                <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off"></el-input>
              </el-form-item>
            </div>
          </el-col>

        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm2')">确 定</el-button>
        <el-button @click="resetForm('ruleForm2')">取 消</el-button>
      </div>
    </el-dialog>

    <!--弹出对话框 Begin-->
    <el-dialog title="个人信息" :visible.sync="dialogFormVisible3" size="small">
      <el-form label-position="top" :rules="rules" ref="form" label-width="80px" :model="form">
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
              <el-form-item label="手机号" placeholder="手机号">
                <el-input placeholder="用户名" v-model="form.mobile"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purle">
              <el-form-item label="角色" prop="roleId">
                <el-select disabled @change="changeRole" v-model="form.roleId" placeholder="请选择角色">
                  <el-option label="超级管理员" value="superadmin"></el-option>
                  <el-option label="管理员" value="admin"></el-option>
                  <el-option label="客服" value="customerservice"></el-option>
                  <el-option label="客户" value="customer"></el-option>
                  <el-option label="代理商" value="agent"></el-option>
                  <el-option label="维修人员" value="maintain"></el-option>

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

    </el-dialog>
    <!--弹出对话框 End-->

  </div>
</template>
<script>
  export default {
    data() {
      var validatePass = (rule, value, callback) => {
        if(value === '') {
          callback(new Error('请输入密码'));
        } else if(value && value.length < 6) {
          callback(new Error('密码至少为6个字母或数字或两者组合'));
        } else {
          if(this.ruleForm2.checkPass !== '') {
            this.$refs.ruleForm2.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if(value === '') {
          callback(new Error('请再次输入密码'));
        } else if(value !== this.ruleForm2.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        url: {
          ownMess: 'api/auth/token/user',
          loginout: 'api/auth/token',
          changePassword: 'api/admin/user',
          customerList: 'api/admin/customer',
          agentList: 'api/admin/agent',
          maintainStaffList: 'api/admin/maintainStaff',
        },
        rules: { //检验手机号码
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
        name: '航天云',
        linkCustomerList: [], //关联用户列表
        linkAgentList: [], //关联代理商列表
        linkMaintainStaffList: [], //关联维修人员列表
        ownmess: {}, //个人信息容器
        dialogFormVisible: false,
        dialogFormVisible3: false,
        ruleForm2: { //修改密码弹窗
          oldPass: '',
          pass: '',
          checkPass: ''
        },
        form: { //弹出框数据容器
          username: '',
          name: '',
          mobile: '',
          roleId: '',
          customerId: '',
          agentId: '',
          maintainStaffId: '',
        },
        roleList: [],
        isDisabled: true,
        rules2: { //修改密码验证规则
          pass: [{
            validator: validatePass, //指定验证器
            trigger: 'blur'
          }],
          checkPass: [{
            validator: validatePass2,
            trigger: 'blur'
          }]
        }
      }
    },
    computed: {
      username() {
        let username = sessionStorage.getItem('spaceflight_username');
        return username ? username : this.name;
      }
    },
    methods: {
      changeRole() { //个人信息 角色id change事件
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
            if(this.ownmess.customerId) {
              this.form.customerId = this.ownmess.customerId
            }

          })
        } else if(this.form.roleId === 'agent') {
          this.$axios.get(this.url.agentList, {
            headers: { //get添加请求头
              'Auth-Token': sessionStorage.getItem('spaceflight_token')
            }
          }).then((res) => {

            this.linkAgentList = res.data.data
            if(this.ownmess.agentId) {
              this.form.agentId = this.ownmess.agentId
            }
          })
        } else if(this.form.roleId === 'maintain') {
          this.$axios.get(this.url.maintainStaffList, {
            headers: { //get添加请求头
              'Auth-Token': sessionStorage.getItem('spaceflight_token')
            }
          }).then((res) => {
            this.linkMaintainStaffList = res.data.data
            if(this.ownmess.maintainStaffId) {
              this.form.maintainStaffId = this.ownmess.maintainStaffId
            }
          })
        }

      },
      resetForm(formName) { //重置弹框数据
        this.dialogFormVisible = false
        this.dialogFormVisible3 = false
        this.$refs[formName].resetFields();
      },
      editOwnMess() { //修改个人信息
        this.$axios.post('api/user/update', {
          params: this.ruleForm3
        }).then((res) => {
          console.log('165', res.data)
          console.log(this.$router.app._route.fullPath)
          if(res.data.success) {
            this.$message.success(res.data.message)
            this.dialogFormVisible3 = false;
          } else if(res.data.code == 200) {
            this.$message.error("您已下线请重新登录！")
            this.$router.push('/login');
            sessionStorage.removeItem('ms_username')
            sessionStorage.removeItem('ms_userid')
          } else {
            this.$message.error("请求出错")
          }
        })
      },
      logout() {
        this.open2();
      },
      open2() { //注销提示
        this.$confirm('此操作将”退出登录“返回登录界面, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'

        }).then(() => {
          this.$axios.delete(this.url.loginout).then((res) => {
            if(res.data.success) {
              this.$message.success(res.data.message)
              sessionStorage.removeItem('spaceflight_username')
              sessionStorage.removeItem('spaceflight_token')
              this.$router.push('/login');
            } else {
              this.$message.error(res.data.message)
            }
          }).catch((e) => {
            this.$router.push('/login');
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      },
      submitForm(formName) { //修改密码  确定 按钮
        this.$refs[formName].validate((valid) => {
          if(valid) {
            this.$axios.put(this.url.changePassword + '/' + this.ownmess.id + '/password', {
              params: {
                //              params: {
                originalPassword: this.ruleForm2.oldPass, //原密码 必填
                newPassword: this.ruleForm2.pass //新密码 选填
                //              }
              }
            }, {
              headers: { //get添加请求头
                'Auth-Token': sessionStorage.getItem('spaceflight_token')
              }
            }).then((res) => {
              console.log(res.data.data)
              if(res.data.success) {
                this.dialogFormVisible = false
                this.$message.success(res.data.message)
                this.$router.push('/login');
              } else {
                this.$message.error(res.data.message)
              }
            }).catch((err) => {

            })

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      handleCommand(command) {
        let self = this;
        if(command === 'editOwnMess') { //command的值不同 执行方式不同
          this.dialogFormVisible3 = true

          if(JSON.stringify(this.ownmess) === '{}') { //获取个人信息
            this.$axios.get(this.url.ownMess, {
              headers: { //get添加请求头
                'Auth-Token': sessionStorage.getItem('spaceflight_token')
              }
            }).then((res) => {
              console.log("282,", res.data.data)
              this.ownmess = res.data.data

              this.form = { //弹出框数据容器
                username: this.ownmess.username,
                name: this.ownmess.name,
                mobile: this.ownmess.mobile || '',
                roleId: this.ownmess.roleId,
              }
              this.changeRole(); //初始赋值触发 角色change事件

            })
          }

        } else if(command === 'changePassWord') {
          this.dialogFormVisible = true
          if(JSON.stringify(this.ownmess) === '{}') { //获取个人信息
            this.$axios.get(this.url.ownMess, {
              headers: { //get添加请求头
                'Auth-Token': sessionStorage.getItem('spaceflight_token')
              }
            }).then((res) => {
              console.log("282,", res.data.data)
              this.ownmess = res.data.data
            })
          }

        } else if(command === 'loginout') {
          this.logout()
        }
      }
    }
  }
</script>
<style scoped>
  .header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    color: #409EFF;
  }
  
  .header .logo {
    float: left;
    width: 360px;
    height: 70px;
    background: url(../../../static/img/logo.png) no-repeat center center;
  }
  
  .user-info {
    float: right;
    padding-right: 25px;
    margin-right: 25px;
    color: #333;
    height: 30px;
    padding-top: 16px;
    line-height: 30px;
  }
  
  .user-info .icon {
    font-size: 36px;
  }
  
  .el-dropdown-menu {
    margin: 0;
    font-size: 14px;
  }
  
  .user-info .el-dropdown-link {
    position: relative;
    display: inline-block;
    /*padding-left: 50px;*/
    color: #333;
    cursor: pointer;
    vertical-align: middle;
  }
  
  .user-info .user-logo {
    position: absolute;
    left: 0;
    top: 15px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  
  .el-icon-caret-bottom {
    font-size: 12px;
  }
  
  .el-dropdown-menu__item {
    text-align: center;
  }
</style>