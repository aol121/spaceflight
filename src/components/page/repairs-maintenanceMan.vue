<template>
  <div class="out-box">
    <!--弹出对话框 Begin-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="40%">
      <el-form :label-position="labelPosition" :rules="rules" ref="form" label-width="80px" :model="form">
        <el-row>
          <el-col :span="18" :offset="3">
            <div class="grid-content bg-purle">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="18" :offset="3">
            <div class="grid-content bg-purle">
              <el-form-item label="所属公司" prop="company">
                <el-input v-model="form.company"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="18" :offset="3">
            <div class="grid-content bg-purle">
              <el-form-item label="手机号" prop="mobile">
                <el-input v-model="form.mobile"></el-input>
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
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form label-position="top" label-width="80px" :model="formLabelAlign" ref="formLabelAlign">
              <el-row :gutter="10" class="from-row">
                <el-col :span="8">
                  <div class="grid-content bg-purple">
                    <el-form-item label="维修人员">
                      <el-input placeholder="维修人员" v-model="formLabelAlign.name__blk"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="grid-content bg-purple">
                    <el-form-item label="所属公司">
                      <el-input placeholder="所属公司" v-model="formLabelAlign.company__blk"></el-input>
                    </el-form-item>
                  </div>
                </el-col>

                <el-col :span="4">
                  <div class="grid-content bg-purple">
                    <el-button @click="search" type="primary">查询</el-button>
                  </div>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple btn-box">
            <span class="btn-span" @click="add">
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
          <el-table-column type="selection" width="55"></el-table-column>

          <el-table-column prop="name" label="姓名" min-width="100">
          </el-table-column>
          <el-table-column prop="company" label="所属公司" min-width="100">
          </el-table-column>
          <el-table-column prop="mobile" label="联系方式" min-width="100">
          </el-table-column>
          <el-table-column prop="statistics.reviewAvg" label="综合评分" min-width="100">
          </el-table-column>
          <el-table-column prop="updateDate" label="修改时间" min-width="100">
          </el-table-column>
          <el-table-column prop="updateUserName" label="修改人" min-width="100">
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
  export default {
    data() {
      return {
        url: {
          maintainStaffList: 'api/admin/maintainStaff',
          addMaintainStaff: 'api/admin/maintainStaff',
          editMaintainStaff: 'api/admin/maintainStaff/',
        },
        rules: { //检验手机号码         
          name: [{
            required: true,
            message: '姓名不能为空',
          }, ]         
        },
        maintainStaffId:'',
        options:[],
        isSearch:false,
        tableData: [],
        isDisabled: false,
        cur_page: 1,
        page_size: 10,
        totalCount: null,
        multipleSelection: [], //选择容器
        searchParams:{},
        dialogTitle: '新增人员',
        dialogFormVisible: false,
        labelPosition: 'top',
        form: {//弹出框数据容器
          name:'',
          company:'',
          mobile:'',
        },
        formLabelAlign: {//搜索条件
          name__blk: '',
          company__blk: '',
        
        }
      };
    },
    created() {
      this.getData();
    },
    methods: {
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
        self.$axios.get(self.url.maintainStaffList, {
          params: {
            params:v,
            method:'statistics',
            pageIndex: self.cur_page - 1,
            pageSize: 10
          },
          headers: {//get添加请求头
            'Auth-Token': sessionStorage.getItem('spaceflight_token')
          }
        }).then((res) => {
          console.log('217,',res.data.data)
          if(res.data.success){
            self.totalCount = res.data.data.recordCount;
            self.tableData = res.data.data.records;
          }else if(res.data.code==200){
            this.$router.push('/login')
          }else {
            self.$message.error(res.data.message)
          }
          
        })
      },
      handleEdit(index, row) {
        console.log(row)
        this.maintainStaffId = row.id
        this.dialogFormVisible = true
        this.dialogTitle = '编辑人员';
        this.isDisabled = true;
        this.form = { //弹出框数据容器
            name:row.name,
            company:row.company || '',
            mobile:row.mobile || '',
          }
        
      },
      submitDialog(formName) {
        this.$refs[formName].validate((valid) => {
          if(valid) {
            if(this.dialogTitle === '新增人员') {
              this.checkAddMaintainStaff(formName)
            } else {
              this.checkUpdateMaintainStaff()
            }
            
          }
        })
      },
      checkUpdateMaintainStaff() {       
        this.$axios.put(this.url.editMaintainStaff+'/'+this.maintainStaffId, {
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
      checkAddMaintainStaff(formName) {
        this.$axios.post(this.url.addMaintainStaff, {   
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
      add() {
        this.dialogFormVisible = true;
        this.dialogTitle = '新增人员';
        this.form = { //弹出框数据容器
            name:'',
            company:'',
            mobile:'',
        }        
      },
      search(){//查询按钮
        this.searchParams = {};
        for(let key in this.formLabelAlign) {
          if(this.formLabelAlign[key]) {
            this.searchParams[key] = this.formLabelAlign[key]
          }
        }
        this.getData(this.searchParams)
        /*if(!this.formLabelAlign.name__blk && !this.formLabelAlign.company__blk){
          this.$message.warning("请输入查询条件")
          this.getData();
          return
        }
        let self = this;
        let formParams ={}
        for(let key in self.formLabelAlign){
          if(self.formLabelAlign[key]){
            formParams[key] = self.formLabelAlign[key]
          }
        }
        self.$axios.get(self.url.maintainStaffList, {
          params: {
            "params": formParams,

          },
          headers: {//get添加请求头
            'Auth-Token': sessionStorage.getItem('spaceflight_token')
          }
        }).then((res) => {
          console.log('308,',res.data.data)
          if(res.data.success){
            this.isSearch =  true;
            this.totalCount = 1
            self.tableData = res.data.data;
          }else {
            self.$message.error(res.data.message)
          }          
        })*/
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
            url: this.url.maintainStaffList + 's',
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
    padding: 20px 20px 0;
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
  .tips {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2;
    padding: 15px 20px;
    background-color: #fff;
  }
 
  .cell .icon {
    margin-right: 0;
    color: #20A0FF;
  }
  
  .blue {
    color: blue;
  }
</style>