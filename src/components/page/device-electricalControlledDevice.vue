<template>
  <div class="out-box">
    <!--弹出对话框 Begin-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="40%">
      <el-form :label-position="labelPosition" :rules="rules" ref="form" label-width="80px" :model="form">
        <el-row :gutter="20">
          <el-col :span="20" :offset="2">
            <div class="grid-content bg-purle">
              <el-form-item label="设备编号">
                <el-input placeholder="输入编号" :disabled="isDisabled" v-model="form.id"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="20" :offset="2">
            <div class="grid-content bg-purle">
              <el-form-item required label="LoRa编号" prop="dacAPId">
                <el-input placeholder="输入LoRa编号" v-model="form.dacAPId"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="20" :offset="2">
            <div class="grid-content bg-purle">
              <el-form-item label="网关地址" prop="dacAddress">
                <el-input placeholder="网关地址" v-model="form.dacAddress"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <!--<el-col :span="10">
            <div class="grid-content bg-purle">
              <el-form-item label="模块" prop="dacModelId">
                <el-select v-model="form.dacModelId" placeholder="选择模块">

                  <el-option v-for="dacModel in dacModelList" :label="dacModel.name" :value="dacModel.id"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>-->

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
                    <el-form-item label="设备编号">
                      <el-input placeholder="设备编号" v-model="formLabelAlign.id__blk"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="grid-content bg-purple">
                    <el-form-item label="LoRa编号">
                      <el-input placeholder="LoRa编号" v-model="formLabelAlign.dacAPId__blk"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                

                <el-col :span="4">
                  <div class="grid-content bg-purple">
                    <el-button @click="searchModel" type="primary">查询</el-button>      
                  </div>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-col>
        <el-col :span="9" v-if="roleId != 'customer'">
          <div class="grid-content bg-purple btn-box">
            
            <upload-excel @on-selected-file='selected' @getdata="getData"></upload-excel>
            <a class="btn-span" href="static/template/设备LoRa配置导入模板.xlsx">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-xiazai"></use>
              </svg>模板
            </a> 
            <!--<span class="btn-span" @click="delet">
              <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-shanchu"></use>
                </svg>删除
            </span>-->
          </div>
        </el-col>
      </el-row>
      <div class="table-box">
        <el-table :data="tableData" stripe style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column prop="id" label="设备编号" min-width="115">
          </el-table-column>
          <el-table-column prop="dacAPId" label="LoRa编号" min-width="115">
          </el-table-column>
          <el-table-column prop="dacAddress" label="网关地址" min-width="115">
          </el-table-column>         
          <el-table-column prop="updateDate" label="修改时间" min-width="100">
          </el-table-column>
          <el-table-column prop="updateUserName" label="修改人" min-width="100">
          </el-table-column>
          <el-table-column label="操作" min-width="70" v-if="roleId != 'customer'">
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
//  import CsvExport from 'src/utils/CsvExport'
    import XLSX from 'xlsx'
  import uploadExcel from '../common/uploadExcel.vue'
  export default {
    components: {
      uploadExcel
    },
    data() {
      
      return {
        url: {
          deviceList:'api/admin/device',
          deviceCategoryList:'api/admin/deviceCategory',
          dacModelList:'api/admin/dacModel',

        },
        rules: {
          dacAPId: [{
            required: true,
            message: 'LoRa编号不能为空',
          }, ],
          dacAddress: [{
            required: true,
            message: '网关地址不能为空',
          }, ],
        },
        roleId:'',
        options:[],//删除传参
        modelId:null,//编辑传参
        deviceCategoryList:[],//品类容器
        dacModelList:[],//模块容器
        tableData: [],
        isDisabled: false,
        cur_page: 1,
        page_size:10,
        totalCount: 1,
        multipleSelection: [], //选择容器
        dialogTitle: '配置LoRa',
        dialogFormVisible: false,
        labelPosition: 'top',
        searchParams:{},
        form: {
          id: '',
          dacAPId: '',
          dacAddress:'',
        },
        formLabelAlign: {
          id__blk: '',
          dacAPId__blk: '',
        }
      };
    },
    mounted() {
      this.roleId = JSON.parse(sessionStorage.getItem('spaceflight_role')).id;
      this.getData();
    },   
    methods: {
      searchModel() {
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
            this.checkUpdateDeviceModel()
          }
        })
      },
      checkUpdateDeviceModel() {
        this.$axios({
            method: 'put',
            url: this.url.deviceList + '/' + this.modelId+'/ap',
            data: {
              params: {
                "apId":this.form.dacAPId,
                "address":this.form.dacAddress,
              },
            },
            headers: { //get添加请求头
              'Auth-Token': sessionStorage.getItem('spaceflight_token')
            }
          }).then((res) => {
            if(res.data.success) {
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.dialogFormVisible = false;
              this.getData();
            } else {
              this.$message.error(res.data.message)
            }

          });

      },
      handleEdit(index, row) {
        console.log(row)
        this.isDisabled = true;
        this.dialogFormVisible = true;
        this.modelId = row.id
        this.form = { //弹出框数据容器 
              id: row.id,
              dacAPId: row.dacAPId,
              dacAddress:row.dacAddress,
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

        self.$axios.get(self.url.deviceList, {
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

          for(let i in this.multipleSelection) {
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
            url: this.url.deviceList+'s',
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

      selected(data) {
        this.tableData = data.results
        this.tableHeader = data.header
        console.log(this.tableData)
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
  
  .tips {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 15px 20px;
    background-color: #fff;
  }
  
  .cell .icon {
    margin-right: 0;
    color: #20A0FF;
  }
  a {
    color: #333;
  }
</style>