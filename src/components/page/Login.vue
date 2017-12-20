<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="logo"></div>
      <el-form label-position="top" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
        <el-form-item prop="username" label="用户名">
          <el-input autofocus v-model="ruleForm.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input type="password" placeholder="密码" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    data: function() {
      return {
        url:{
          token:'api/auth/token',
          ownMess: 'api/auth/token/user',
          roleAccess:'api/admin/role'
        },
        visiable: [//完整列表
          'baseMess-client', 
          'baseMess-agent', 
          'baseMess-deviceCategory', 
          'baseMess-deviceType', 
          'baseMess-defaultMode', 
          'device-areaSet',
          'device-device',
          'device-modelIssued',
          'device-electricalControlledDevice',
          'repairs-maintenanceMan',
          'repairs-maintenanceOrder',
          'APP-knowledgeBase',
          'APP-advertisement',
          'APP-notice',
          'backgroundUser-user',
          'backgrounUser-accessConfig',
          'statistic-analysis',
          /*'superadmin',
          'admin',
          'customerservice',
          'customer',
          'agent',
          'maintain',*/
          
        ],
        roleAccessList: {}, //权限列表
        roleId:'',
        ruleForm: {
          username: '',
          password: ''
        },
        rules: {
          username: [{
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }]
        }
      }
    },
    methods: {
      submitForm(formName) {
        const self = this;
        self.$refs[formName].validate((valid) => {
          if(valid) {
            self.$axios.post(self.url.token,{       
                params: {
                  username: self.ruleForm.username,
                  password: self.ruleForm.password
                }             
            }).then((res)=>{
              if(res.data.success){
                self.$message.success(res.data.message)
                sessionStorage.setItem('spaceflight_token', res.data.data); 
                sessionStorage.setItem('spaceflight_username', self.ruleForm.username);         
                //获取个人信息  获取roleId  
                  this.$axios.get(this.url.ownMess, {
                    headers: { //get添加请求头
                      'Auth-Token': sessionStorage.getItem('spaceflight_token')
                    }
                  }).then((res) => {
                    console.log("96,", res.data.data)
                    let mess = JSON.stringify(res.data.data)
                    let role = JSON.stringify(res.data.data.role)
                    sessionStorage.setItem('spaceflight_mess', mess);
                    sessionStorage.setItem('spaceflight_roleId', res.data.data.roleId);
                    sessionStorage.setItem('spaceflight_role',role );
                    if(res.data.data.role.accessAll){//管理员
                      self.$router.push('index');
                    }else {//非管理员
                      for(let key in res.data.data.role.accessList){
                        for(let j in self.visiable){
                          if(key.indexOf(self.visiable[j])>-1){
                            self.$router.push(self.visiable[j]);//默认跳转至第一个页面
                            return
                          }
                        }
                      }
                    }
                  })
               
              }else {
                self.$message.error(res.data.message)
              }
            })                   
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }
</script>

<style scoped>
  .login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
  }
  
  .ms-title {
    position: absolute;
    top: 50%;
    width: 100%;
    margin-top: -230px;
    text-align: center;
    font-size: 30px;
    color: #fff;
  }
  
  .ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 300px;
    height: 300px;
    margin: -190px 0 0 -190px;
    padding:20px 40px;
    border-radius: 5px;
    background: #fff;
  }
  .ms-login .logo {
    height:60px;
    background: url(../../../static/img/login-logo.png) no-repeat center center;
    background-size: contain;
  }
  .login-btn {
    text-align: center;
  }
  
  .login-btn button {
    width: 100%;
    height: 36px;
  }
  .el-form-item {
    margin-bottom: 20px;
  }
</style>