<template>
  <div class="out-box">
    <!--弹出对话框 Begin-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="30%">
      <el-form :label-position="labelPosition" :rules="rules" ref="form" label-width="80px" :model="form">
        <el-row :gutter="20">
          <el-col :span="10" :offset="2">
            <div class="grid-content bg-purle">
              <el-form-item label="代理商编号">
                <el-input :disabled="isDisabled" v-model="form.id"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purle">
              <el-form-item label="代理商名称" prop="name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </div>
          </el-col>
          
          <el-col :span="10" :offset="2">
            <div class="grid-content bg-purle">
              <el-form-item label="联系人">
                <el-input v-model="form.contact"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purle">
              <el-form-item label="联系方式">
                <el-input v-model="form.contactWay"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="20" :offset="2">
            <div class="grid-content bg-purle">
              <el-form-item label="地址">
                <el-input type="textarea" v-model="form.address"></el-input>
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
        <el-col :span="15">
          <div class="grid-content bg-purple">
            <el-form label-position="top" label-width="80px" :model="formLabelAlign" ref="formLabelAlign">
              <el-row :gutter="10" class="from-row">
                <el-col :span="5">
                  <div class="grid-content bg-purple">
                    <el-form-item label="代理商名称">
                      <el-input placeholder="代理商名称" v-model="formLabelAlign.name__blk"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="5">
                  <div class="grid-content bg-purple">
                    <el-form-item label="联系人">
                      <el-input placeholder="联系人" v-model="formLabelAlign.contact__blk"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="5">
                  <div class="grid-content bg-purple">
                    <el-form-item label="联系方式">
                      <el-input placeholder="联系方式" v-model="formLabelAlign.contactWay__blk"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="grid-content bg-purple">
                    <el-button @click="searchAgent" type="primary" >查询</el-button>
                  </div>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-col>
        <el-col :span="9">
          <div class="grid-content bg-purple btn-box">
            <span class="btn-span" @click="addAgent">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-zengjia"></use>
                </svg><span>增加</span>
            </span>
            <span class="btn-span" @click="delet">
              <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-shanchu"></use>
                </svg>删除
            </span>
          </div>
        </el-col>
      </el-row>
      <div class="table-box">
        <el-table :data="tableData" stripe style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column prop="id" label="代理商编号" min-width="105">
          </el-table-column>
          <el-table-column prop="name" label="代理商名称" min-width="105">
          </el-table-column>
          <el-table-column prop="address" label="地址">
          </el-table-column>
          <el-table-column prop="contact" label="联系人">
          </el-table-column>
          <el-table-column prop="contactWay" label="联系方式" min-width="100">
          </el-table-column>
          <el-table-column prop="updateDate" label="修改时间" min-width="100">
          </el-table-column>
          <el-table-column label="关联客户" min-width="100">
            <template scope="scope">
              <el-button size="small" @click="searchCustomer(scope.$index, scope.row)">查询</el-button>
            </template>
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
        url:{
          agentList:'api/admin/agent',
          deleAgents:'api/admin/agents',
        },
        rules: { 
          name: [{
            required: true,
            message: '名称不能为空',

          }, ],         
        },
        agentId:null,
        options:[],
        tableData: [],
        isDisabled: false,
        cur_page: 1,
        totalCount: 1,
        page_size: 10,
        multipleSelection: [], //选择容器
        dialogTitle: '新增代理商',
        dialogFormVisible: false,
        labelPosition: 'top',
        searchParams:{},
        form: {
          id: '',
          name: '',
          address: '',
          contact: '',
          contactWay: '',   
        },
        formLabelAlign: {
          name__blk: '',
          contact__blk: '',
          contactWay__blk: '',
        }
      };
    },
    mounted() {
      this.getData();
    },

    methods: {
      searchCustomer(index,row){
        this.$router.push('/baseMess-client')
        sessionStorage.setItem("spaceflight_agentName",row.name)
      },
      searchAgent(){//查询代理商
        this.searchParams = {};
        for(let key in this.formLabelAlign) {
          if(this.formLabelAlign[key]) {
            this.searchParams[key] = this.formLabelAlign[key]
          }
        }
        this.getData(this.searchParams)
      },     
      submitDialog(formName) {
        this.$refs[formName].validate((valid) => {
          if(valid) {
            if(this.dialogTitle === '新增代理商') {
              this.checkAddAgent(formName)
            } else {
              this.checkUpdateAgent()
            }            
          }
        })
      },
      checkUpdateAgent() {       
        this.$axios.put(this.url.agentList+'/'+this.agentId, {
          params: this.form
        },{
          headers: {//post添加请求头
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
      checkAddAgent(formName) {
        this.$axios.post(this.url.agentList, {   
            params: this.form        
        },{
          headers: {//post添加请求头
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
      addAgent() { //新增用户
        let self = this;
        this.dialogTitle = '新增代理商';
        this.isDisabled = false;
        this.dialogFormVisible = true;
        this.form = { //弹出框数据容器
          id:'',
          name: '',
          address: '',
          contact: '',
          contactWay: '',   
        }
        if(JSON.stringify(this.customerserviceList)=='[]' && JSON.stringify(this.agentList)=='[]'){
          
          this.getAgentCustomerservice()//获取代理商与客服列表
  
        }else {
          
        }   
      },
      handleEdit(index, row) {
        console.log(row)
        this.dialogFormVisible = true
        this.dialogTitle = '编辑代理商';
        this.isDisabled = true;
        this.agentId = row.id
            this.form = { //弹出框数据容器 
              id:row.id,
              name: row.name,
              address: row.address,
              contact: row.contact,
              contactWay: row.contactWay,           
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
        self.$axios.get(self.url.agentList, {
         params: {
           params:v,
            pageIndex: self.cur_page - 1,
            pageSize: self.page_size
          },
          headers: {//get添加请求头
            'Auth-Token': sessionStorage.getItem('spaceflight_token')
          }
        }).then((res) => {
          console.log(res.data.data)
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
      delet() {
        if(this.multipleSelection.length > 0) {
          for(let i in this.multipleSelection){
            this.options[i] = this.multipleSelection[i].id
          }
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
            url: this.url.deleAgents,
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
            }
          });

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
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
      /*info(row) { //查看详情
        // 1. 用户详情存vuex
        this.$store.commit('save_detail_info', row);
        // 2. 动态改变路由的指向
        this.$router.push({
          path: `/userInfo/${row.name}`
        });
      }*/
    }
  }
</script>

<style scoped="scoped">
  .btn-span {
    height:36px;
    display: inline-flex;
    align-items: center;
    vertical-align: bottom;
   font-size:14px ;
   margin-left: 15px;
   cursor: pointer;
  }
  .btn-span>span {
    vertical-align: bottom;
  }
  .btn-span .icon {
    font-size: 20px;
    margin-right:4px;

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
</style>