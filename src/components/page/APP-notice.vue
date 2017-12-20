<template>
  <div class="out-box">
    <!--弹出对话框 Begin-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="40%">
      <el-form :label-position="labelPosition" :rules="rules" ref="form" label-width="80px" :model="form">       
        <el-row :gutter="20">
          <el-col :span="20" :offset="2">
            <div class="grid-content bg-purle">
              <el-form-item label="公告标题" prop="title">
                <el-input placeholder="输入标题" v-model="form.title"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="20" :offset="2">
            <div class="grid-content bg-purle">     
              <el-form-item label="公告内容" prop="content">
                <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="公告内容"
                  v-model="form.content">
                </el-input>
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
                    <el-form-item label="公告标题">                     
                      <el-input placeholder="输入标题" v-model="formLabelAlign.title__blk"></el-input>
                      </el-select>
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
        <el-col :span="9">
          <div class="grid-content bg-purple btn-box">
            <span class="btn-span" @click="addDeviceModel">
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
          <el-table-column
            type="index"
            label="序号"
            min-width="50">
          </el-table-column>        
          <el-table-column prop="title" label="标题" min-width="100">
          </el-table-column>
          <el-table-column prop="content" label="内容" min-width="100">
          </el-table-column>
          <el-table-column prop="createDate" label="发布时间" min-width="100">
          </el-table-column>
          <!--<el-table-column prop="" label="发布人" min-width="110">
          </el-table-column>-->
          <el-table-column prop="updateDate" label="编辑时间" min-width="100">
          </el-table-column>
          <el-table-column prop="updateUserName" label="编辑人" min-width="110">
          </el-table-column>
          <el-table-column label="操作" min-width="80">
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
          appBannerList: 'api/admin/appNotice',//公告
        },
        rules: {
          title: [{
            required: true,
            message: '标题不能为空',
            trigger: 'blur'
          }, ],

          content: [{
            required: true,
            message: '内容不能为空',
            trigger: 'blur'
          }, ],


        },
        isSearch:false,
        options:[],
        modelId:'',
        tableData: [],
        isDisabled: false,
        cur_page: 1,
        page_size: 10,
        totalCount: 18,
        multipleSelection: [], //选择容器
        dialogTitle: '新增故障',
        dialogFormVisible: false,
        labelPosition: 'top',
        searchParams:{},
        form: {
          title: '',
          content: '',
        },
        formLabelAlign: {
          title__blk: '',
          
        }
      };
    },
    mounted() {
      this.getData();
    },
    
    methods: {
      search() {
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
            if(this.dialogTitle === '新增公告') {

              this.checkAddDeviceModel(formName)
            } else {
              this.checkUpdateDeviceModel()
            }
          }
        })
      },

      checkUpdateDeviceModel() {
        this.$axios({
          method: 'put',
          url: this.url.appBannerList+ '/' + this.modelId,
          data: {
            params:this.form
          },
          headers: { //post添加请求头
            'Auth-Token': sessionStorage.getItem('spaceflight_token')
          }
        }).then(res => {
          if(res.data.success) {
            this.dialogFormVisible = false;
            this.$message.success(res.data.message)
            this.getData();

          } else {
            this.$message.error(res.data.message)
          }
        })

      },

      checkAddDeviceModel(formName) {

        this.$axios({
          method: 'post',
          url: this.url.appBannerList,
          data: {
            params:this.form
          },
          headers: { //post添加请求头
            'Auth-Token': sessionStorage.getItem('spaceflight_token')
          }
        }).then(res => {
          if(res.data.success) {
            this.dialogFormVisible = false;
            this.$message.success(res.data.message)
            this.getData();

          } else {
            this.$message.error(res.data.message)
          }
        })
            
      },
      addDeviceModel() { //
        this.dialogTitle = '新增公告';
        this.isDisabled = false;
        this.dialogFormVisible = true;
        this.form = { //弹出框数据容器
          title: '',
          content: '',
        }

      },
      handleEdit(index, row) {
        console.log(row)
        this.dialogTitle = '编辑公告';
        this.isDisabled = true;
        this.dialogFormVisible = true;
        this.modelId = row.id
        this.form = {
          title: row.title,
          content: row.content,
        }
      },
      handleSizeChange(val) { //改变每页容量
        this.page_size = val;
        this.getData(this.searchParams);
      },
      handleCurrentChange(val) {//翻页
        this.cur_page = val;
        this.getData(this.searchParams);
      },
      getData(v) {
        let self = this;
        self.$axios.get(self.url.appBannerList, {
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
          console.log('404',this.options)

          this.open2();
        } else {
          this.$message.error("请至少选择一条要删除的数据")
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
            url: this.url.appBannerList+'s',
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
        this.multipleSelection = val;
      },
    }
  }
</script>

<style scoped="scoped">
  .el-upload__tip {
    margin-top:0;
    line-height:18px;
  }
  .img {
    max-width: 50%;
    max-height: 200px;
  }
  
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