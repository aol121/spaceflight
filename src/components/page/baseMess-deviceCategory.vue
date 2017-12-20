<template>
  <div class="out-box">
    <!--弹出对话框 Begin-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" size="tiny">
      <el-form :label-position="labelPosition" :rules="rules" ref="form" label-width="80px" :model="form">
        <el-row :gutter="20">
          <el-col :span="18" :offset="3">
            <div class="grid-content bg-purle">
              <el-form-item label="设备品类编号">
                <el-input :disabled="isDisabled" placeholder="输入编号" v-model="form.id"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="18" :offset="3">
            <div class="grid-content bg-purle">
              <el-form-item label="设备品类名称" prop="name">
                <el-input placeholder="输入名称" v-model="form.name"></el-input>
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
                <el-col :span="6">
                  <div class="grid-content bg-purple">
                    <el-form-item label="设备品类编号">
                      <el-input placeholder="设备品类编号" v-model="formLabelAlign.id__blk"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="grid-content bg-purple">
                    <el-form-item label="设备品类名称">
                      <el-input placeholder="设备品类名称" v-model="formLabelAlign.name__blk"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="grid-content bg-purple">
   
                    <el-button @click="searchDeviceCategory" type="primary">查询</el-button>
       
                  </div>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-col>
        <el-col :span="9">
          <div class="grid-content bg-purple btn-box">
            <span class="btn-span" @click="addDeviceCategory">
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
          <el-table-column type="selection" min-width="50"></el-table-column>
          <el-table-column prop="id" label="设备品类编号" min-width="115">
          </el-table-column>
          <el-table-column prop="name" label="设备品类名称" min-width="115">
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
          <el-pagination 
            @size-change="handleSizeChange" 
            :page-sizes="[10,15, 20, 30, 999]"
            :page-size="page_size"
            @current-change="handleCurrentChange" 
            layout="sizes, prev, pager, next" 
            :total="totalCount">
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
          deviceCategoryList:'api/admin/deviceCategory',
        },
        rules: { 
         
          name: [{
            required: true,
            message: '名称不能为空',

          }, ]
          

        },
        options:[],//批量删除参数
        tableData: [],
        deviceCategoryId:null,
        isDisabled: false,
        cur_page: 1,
        page_size:10,//默认每页数量
        totalCount: 1,
        multipleSelection: [], //选择容器
        dialogTitle: '新增设备品类',
        dialogFormVisible: false,
        labelPosition: 'top',
        searchParams:{},
        form: {
          id: '',
          name: '',

        },
        formLabelAlign: {
          id__blk: '',
          name__blk: '',
        }
      };
    },
    mounted() {
      this.getData();
    },

    methods: {

      searchDeviceCategory(){
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
            if(this.dialogTitle === '新增设备品类') {
              this.checkAddDeviceCategory(formName)
            } else {
              this.checkUpdateDeviceCategory()
            }

          }
        })

      },
      checkUpdateDeviceCategory() {
        this.$axios.put(this.url.deviceCategoryList + '/' + this.deviceCategoryId, {
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
      checkAddDeviceCategory(formName) {
        this.$axios.post(this.url.deviceCategoryList, {
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
              id: '',
              name: '',
        
            }

          } else {
            this.$message.error(res.data.message)
          }

        })
      },
      addDeviceCategory() { //新增设备品类
        this.dialogTitle = '新增设备品类';
        this.isDisabled = false;
        this.dialogFormVisible = true;
        this.form = { //弹出框数据容器
          id: '',
          name: '',

        }
      },
      handleEdit(index, row) {
        console.log(row)

        this.dialogTitle = '编辑设备品类';
        this.isDisabled = true;
        this.dialogFormVisible = true;
        this.deviceCategoryId = row.id
        this.form = { //弹出框数据容器 
          id: row.id,
          name: row.name,

        }
      },

      handleSizeChange(val) {//改变每页容量
        this.page_size = val;
        this.getData(this.searchParams);
      },
      handleCurrentChange(val) {
        this.cur_page = val;
          this.getData(this.searchParams);
      },
      getData(v) {
        let self = this;
        self.$axios.get(self.url.deviceCategoryList, {
          params: {
            params:v,
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
            console.log(res.data.data)
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
            url: this.url.deviceCategoryList+'s',//批量删除接口
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

      handleSelectionChange(val) {
        console.log(val)
        this.multipleSelection = val;
      },

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
</style>