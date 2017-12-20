<template>
  <div class="out-box">
    <!--弹出对话框 Begin-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :label-position="labelPosition" :rules="rules" ref="form" label-width="80px" :model="form">
        <el-row :gutter="24">
          <el-col :span="10" :offset="2">
            <div class="grid-content bg-purle">
              <el-form-item label="客户编号" prop="id">
                <el-input placeholder="客户编号" :disabled="isDisabled" v-model="form.id"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purle">
              <el-form-item label="姓名" prop="name">
                <el-input placeholder="姓名" v-model="form.name"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="10" :offset="2">
            <div class="grid-content bg-purle">
              <el-form-item label="地址">
                <el-input placeholder="地址" v-model="form.address"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purle">
              <el-form-item label="代理商">
                <el-select :disabled="roleId==='customerservice' || roleId==='agent'" v-model="form.agentId" placeholder="代理商">
                  <el-option label="请选择..." value=""></el-option>
                  <el-option v-for="agent in agentList" :label="agent.name" :value="agent.id"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="10" :offset="2">
            <div class="grid-content bg-purle">
              <el-form-item label="联系人">
                <el-input placeholder="联系人" v-model="form.contact"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purle">
              <el-form-item label="联系方式">
                <el-input placeholder="联系方式" v-model="form.contactWay"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="10" :offset="2">
            <div class="grid-content bg-purle">
              <el-form-item label="客服">
                <el-select :disabled="roleId==='customerservice' || roleId==='agent'" v-model="form.csUserId" placeholder="客服">
                  <el-option label="请选择..." value=""></el-option>
                  <el-option v-for="customerservice in customerserviceList" :label="customerservice.name" :value="customerservice.id"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purle">
              <el-form-item label="客服电话">
                <el-input :disabled="roleId==='customerservice' || roleId==='agent'" placeholder="客服电话" v-model="form.csUserMobile"></el-input>
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
    <div class="body-box">
      <el-row class="row-box">
        <el-col :span="13">
          <div class="grid-content bg-purple">
            <el-form label-position="top" label-width="80px" :model="formLabelAlign" ref="formLabelAlign">
              <el-row :gutter="10" class="from-row">
                <el-col :span="6">
                  <div class="grid-content bg-purple">
                    <el-form-item label="客户名称">
                      <el-input placeholder="客户名称" v-model="formLabelAlign.name__blk"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="grid-content bg-purple">
                    <el-form-item label="手机号">
                      <el-input placeholder="手机号" v-model="formLabelAlign.contactWay__blk"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="grid-content bg-purple">
                    <el-form-item label="所属代理">
                      <el-select v-model="formLabelAlign.agentName" placeholder="所属代理">
                        <el-option label="请选择..." value=""></el-option>
                        <el-option v-for="agent in agentList" :label="agent.name" :value="agent.name"></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>

                <el-col :span="4">
                  <div class="grid-content bg-purple">
                    <el-button @click="searchCustomer" type="primary">查询</el-button>
                  </div>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-col>
        <el-col :span="11" v-if="roleId !== 'customerservice' && roleId !== 'agent'">
          <div class="grid-content bg-purple btn-box">
            <span class="btn-span" @click="addCustomer">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-zengjia"></use>
                </svg><span>增加</span>
            </span>
            <span class="btn-span" @click="delet">
              <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-shanchu"></use>
                </svg>删除
            </span>
            <upload-excel @on-selected-file='selected' @getdata="getData"></upload-excel>
            <a class="btn-span" href="static/template/客户导入模板.xlsx">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-xiazai"></use>
              </svg>模板
            </a>
          </div>
        </el-col>
      </el-row>
      <div class="table-box">
        <el-table :data="tableData" stripe style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
          <el-table-column type="expand">
            <template scope="props">
              <el-form label-position="left" inline class="demo-table-expand" label-width="80px">
                <el-form-item label="客户编号">
                  <span>{{ props.row.id }}</span>
                </el-form-item>
                <el-form-item label="客户名称">
                  <span>{{ props.row.name }}</span>
                </el-form-item>
                <el-form-item label="地址">
                  <span>{{ props.row.address }}</span>
                </el-form-item>
                <el-form-item label="联系人">
                  <span>{{ props.row.contact }}</span>
                </el-form-item>
                <el-form-item label="联系方式">
                  <span>{{ props.row.contactWay }}</span>
                </el-form-item>
                <el-form-item label="所属代理">
                  <span>{{ props.row.agentName }}</span>
                </el-form-item>
                <el-form-item label="客服">
                  <span>{{ props.row.csUserName }}</span>
                </el-form-item>
                <el-form-item label="修改时间">
                  <span>{{ props.row.updateDate }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="name" label="客户名称" min-width="100">
          </el-table-column>
          <el-table-column prop="contact" label="联系人" min-width="100">
          </el-table-column>
          <el-table-column prop="contactWay" label="联系方式" min-width="100">
          </el-table-column>
          <el-table-column prop="agentName" label="所属代理" min-width="100">
          </el-table-column>
          <el-table-column prop="csUserName" label="客服" min-width="100">
          </el-table-column>
          <el-table-column prop="csUserMobile" label="客服电话" min-width="110">
          </el-table-column>
          <el-table-column label="操作" width="80">
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
//import {getData} from 'src/utils/commonFn'
  import uploadExcel from '../common/uploadExcel.vue'
  export default {
    components: {
      uploadExcel
    },
    data() {
      return {
        url: {
          customerList: 'api/admin/customer',
          addCustomer: 'api/admin/customer',
          editCustomer: 'api/admin/customer/',
          deleCustomer: 'api/admin/customers',
          importExcel: 'api/admin/customers',
          customerserviceList: 'api/admin/user',
          agentList: 'api/admin/agent',
        },
        rules: {
          name: [{
            required: true,
            message: '姓名不能为空',
            trigger:'blur'
          }, ],
        },
        customerId: null,
        tableData: [],
        customerserviceList: [], //客服列表
        agentList: [], //代理商列表
        isDisabled: false,
        cur_page: 1,
        page_size: 10,
        totalCount: 1,
        options: [],
        multipleSelection: [], //选择容器
        dialogTitle: '新增客户',
        dialogFormVisible: false,
        labelPosition: 'top',
        searchParams:{},
        form: {
          id: '',
          name: '',
          address: '',
          contact: '',
          contactWay: '',
          agentId: '',
          csUserId: '',
          csUserMobile: '',
        },
        formLabelAlign: {
          name__blk: '',
          contactWay__blk: '',
          agentName: ''
        },
        roleId:'',
      };
    },
    mounted() {
      this.roleId = JSON.parse(sessionStorage.getItem('spaceflight_role')).id;
      if(sessionStorage.getItem("spaceflight_agentName")){
        this.getAgentCustomerservice(()=>{
          this.formLabelAlign.agentName = sessionStorage.getItem("spaceflight_agentName")
          this.searchCustomer();
        })
      }else {
        this.getData();
        
        this.getAgentCustomerservice()
      }
    },
    
    beforeRouteLeave (to, from, next) {
      sessionStorage.removeItem("spaceflight_agentName")
      next()
    },
      
    methods: {
      searchCustomer() {//查询
        
        this.searchParams = {};
        for(let key in this.formLabelAlign) {
          if(this.formLabelAlign[key]) {
            this.searchParams[key] = this.formLabelAlign[key]
          }
        }
        this.getData(this.searchParams)
        /*getData(this,{
          url:this.url.customerList,
          params:this.searchParams, 
          pageIndex:this.cur_page - 1,
          pageSize:this.page_size,
        })*/
        
      },
      submitDialog(formName) {
        this.$refs[formName].validate((valid) => {
          if(valid) {
            if(this.dialogTitle === '新增客户') {
              this.checkAddCustomer(formName)
            } else {
              this.checkUpdateCustomer()
            }

          }
        })

      },
      checkUpdateCustomer() {
        this.$axios.put(this.url.editCustomer + '/' + this.customerId, {
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
      checkAddCustomer(formName) {
        this.$axios.post(this.url.addCustomer, {
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
      addCustomer() { //新增用户
        let self = this;
        this.dialogTitle = '新增客户';
        this.isDisabled = false;
        this.dialogFormVisible = true;
        this.form = { //弹出框数据容器
          id: '',
          name: '',
          address: '',
          contact: '',
          contactWay: '',
          agentId: '',
          csUserId: '',
          csUserMobile: '',
        }
        if(JSON.stringify(this.customerserviceList) == '[]' && JSON.stringify(this.agentList) == '[]') {

          this.getAgentCustomerservice() //获取代理商与客服列表

        }

      },
      handleSizeChange(val) { //改变每页容量
        this.page_size = val;
        this.getData(this.searchParams);        
      },
      handleCurrentChange(val) {
        this.cur_page = val;
        this.getData(this.searchParams);
      },
      getData(v) {
        let self = this;        
        self.$axios.get(self.url.customerList, {
          params: {
            params:v,
            pageIndex: self.cur_page - 1,
            pageSize: self.page_size
          },
          headers: { //get添加请求头
            'Auth-Token': sessionStorage.getItem('spaceflight_token')
          }
        }).then((res) => {
          console.log(res.data.data)
          if(res.data.success) {
            self.totalCount = res.data.data.recordCount
            self.tableData = res.data.data.records;
            console.log(self.tableData)
          }else if(res.data.code==200){//未登录
            this.$router.push('/login')
          } else {
            self.$message.error(res.data.message)
          }
        })
      },
      handleEdit(index, row) { //编辑客户
        console.log(row)
        this.dialogFormVisible = true
        this.dialogTitle = '编辑客户';
        this.isDisabled = true;
        this.customerId = row.id
        if(JSON.stringify(this.customerserviceList) == '[]' && JSON.stringify(this.agentList) == '[]') {
          this.getAgentCustomerservice(() => {
            this.form = { //弹出框数据容器
              id: row.id,
              name: row.name,
              address: row.address,
              contact: row.contact,
              contactWay: row.contactWay,
              agentId: row.agentId,
              csUserId: row.csUserId,
              csUserMobile: row.csUserMobile,
            }
          }) //获取代理商与客服列表
        } else {
          this.form = { //弹出框数据容器
            id: row.id,
            name: row.name,
            address: row.address,
            contact: row.contact,
            contactWay: row.contactWay,
            agentId: row.agentId,
            csUserId: row.csUserId,
            csUserMobile: row.csUserMobile,
          }
        }
      },
      getAgentCustomerservice(callback) {
        let self = this;

        function getCustomerservice() {
          return self.$axios.get(self.url.customerserviceList, {
            params: {
              params: {
                roleId: 'customerservice'
              }

            },
            headers: { //get添加请求头
              'Auth-Token': sessionStorage.getItem('spaceflight_token')
            }
          });
        }
        function getAgent() {
          return self.$axios.get(self.url.agentList, {
            headers: { //get添加请求头
              'Auth-Token': sessionStorage.getItem('spaceflight_token')
            }
          });
        }

        self.$axios.all([getCustomerservice(), getAgent()])
          .then(self.$axios.spread((customerservice, agent) => {
            // 两个请求现在都执行完成
            console.log(agent.data.data)
            self.customerserviceList = customerservice.data.data
            self.agentList = agent.data.data
            if(callback) {
              callback()
            }
          }));
      },
      delet() {
        if(this.multipleSelection.length > 0) {

          for(let i in this.multipleSelection) {
            this.options[i] = this.multipleSelection[i].id
          }
          console.log(this.options)

          this.open2();
        } else {
          this.$message.error("请选择要删除的客户")
        }

      },
      open2() { //删除前提示
        this.$confirm('此操作将永久删除选中的文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'

        }).then(() => {

          this.$axios({
            method: 'delete',
            url: this.url.deleCustomer,
            data: {
              params: {
                id__in: this.options
              },
            },
            headers: { //get添加请求头
              'Auth-Token': sessionStorage.getItem('spaceflight_token')
            }
          }).then((res) => {
            if(res.data.success) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getData();
            } else {
              this.$message.error(res.data.message)
            }

          });

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      selected(data) { //导入表格
        /*this.tableData = data.results
        this.tableHeader = data.header*/
        console.log(data)
      },

      /*activate() {
        if(this.multipleSelection.length > 0) {

        } else {
          this.$message.error("请至少选择一个要激活的客户")
        }
      },
      freeze: function() {
        let c = {
          "d": 345
        }
        let a = c
        console.log(a) //  {d: 345}
        a.x = this.cur_page
        console.log(a) //  {d: 345, x: 1}
        return;
      },*/
      /*handleDelete(index, row) {
        this.$message.error('删除第' + (index + 1) + '行');
      },*/
      /*delAll() {
        const self = this,
          length = self.multipleSelection.length;
        let str = '';
        self.del_list = self.del_list.concat(self.multipleSelection);
        for(let i = 0; i < length; i++) {
          str += self.multipleSelection[i].name + ' ';
        }
        self.$message.error('删除了' + str);
        self.multipleSelection = [];
      },*/
      handleSelectionChange(val) {
        console.log(val)
        this.multipleSelection = val;
      },
      info(row) { //查看详情
        // 1. 用户详情存vuex
        this.$store.commit('save_detail_info', row);
        // 2. 动态改变路由的指向
        this.$router.push({
          path: `/userInfo/${row.name}`
        });
      }
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
    /*height: calc(100% - 51px);*/
    overflow: auto;
  }
  
  .row-box {
    padding: 10px 20px 0;
    border-bottom: 1px solid #e1e4e6;
  }
  
  .table-box {
    padding: 0 20px;
  }
  
  .el-col-4 .grid-content {
    /*border:none;*/
    padding-top: 34px;
  }
  
  .btn-box {
    text-align: right;
    padding-top: 34px;
  }
  .cell .icon {
    margin-right: 0;
    color: #20A0FF;
  }
  
  .blue {
    color: blue;
  }
  /*详细信息*/
  
  .demo-table-expand {
    font-size: 0;
    color: #1D8CE0;
  }
  
  .demo-table-expand label {
    color: #99a9bf !important;
  }
  
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 33.33%;
  }
  
  .el-table__expanded-cell .demo-table-expand .el-form--inline .el-form-item__label {
    color: #99a9bf !important;
  }
  
  a {
    color: #333;
  }
</style>