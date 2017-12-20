<template>
  <div class="out-box">

    <!--弹出对话框 Begin-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :label-position="labelPosition" :rules="rules" ref="form" label-width="80px" :model="form">
        
        <el-row :gutter="20">
          <el-col :span="10" :offset="2">
            <div class="grid-content bg-purle">
              <el-form-item label="故障代码" prop="code">
                <el-input placeholder="输入代码" v-model="form.code"></el-input>
              </el-form-item>
              
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purle">
              <el-form-item label="故障名称" prop="name">
                <el-input placeholder="输入名称" v-model="form.name"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="20" :offset="2">
            <div class="grid-content bg-purle">     
              <el-form-item label="故障描述" >
                <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="输入描述"
                  v-model="form.content">
                </el-input>
              </el-form-item>             
            </div>
          </el-col>

          <el-col :span="20" :offset="2" style="text-align: center;">
            <div class="grid-content bg-purle">
              <el-form-item label="" prop="image">
                <el-upload 
                  :on-change="imgChange"
                  :file-list="fileList"
                  class="upload-demo" ref="uploadhtml" drag :auto-upload="false" :action="url.appBannerList" :before-upload="newHtml" accept=".jpg,.png">
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                  <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
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
                    <el-form-item label="故障代码">                     
                      <el-input placeholder="输入代码" v-model="formLabelAlign.code__blk"></el-input>
                      </el-select>
                    </el-form-item>
                    
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="grid-content bg-purple">
                    <el-form-item label="故障名称">
                      <el-input placeholder="输入名称" v-model="formLabelAlign.name__blk"></el-input>
                    </el-form-item>
                  </div>
                </el-col>

                <!--</el-col>-->
                <el-col :span="4">
                  <div class="grid-content bg-purple">
                    <!--<el-form-item label="查询">-->
                    <el-button @click="search" type="primary">查询</el-button>
                    <!--</el-form-item>-->
                  </div>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-col>
        <el-col :span="9">
          <div class="grid-content bg-purple btn-box">
            <!--<el-button @click="add">-->
            <span class="btn-span" @click="addDeviceModel">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-zengjia"></use>
                </svg><span>增加</span>
            </span>
            <!--</el-button>-->
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
          <el-table-column prop="code" label="故障代码" min-width="100">
          </el-table-column>
          <el-table-column prop="name" label="故障名称" min-width="100">
          </el-table-column>
          <el-table-column prop="content" label="故障描述" min-width="100">
          </el-table-column>

          <el-table-column prop="image" label="相关图片" min-width="200">
            <template scope="scope">
              <!--<span v-if="scope.row.active=='1'" style="color: #409EFF">激活</span>-->
              
              <img v-if="scope.row.image" class="img" :src="scope.row.image.visitPathFull" />
            </template>
          </el-table-column>

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
          appBannerList: 'api/admin/deviceDict',//故障知识库
        },
        rules: {
          name: [{
            required: true,
            message: '故障名称不能为空',
            trigger: 'blur'
          }, ],

          code: [{
            required: true,
            message: '故障代码不能为空',
            trigger: 'blur'
          }, ],
        },

        flag:false,
        fileList:[],
        options:[],
        modelId:'',
        tableData: [],
        isDisabled: false,
        cur_page: 1,
        page_size: 10,
        totalCount: 1,
        multipleSelection: [], //选择容器
        dialogTitle: '新增故障',
        dialogFormVisible: false,
        labelPosition: 'top',
        searchParams:{},
        uploadForm: new FormData(),
        form: {
          code: '',
          name: '',
          content: '',
        },
        formLabelAlign: {
          name__blk: '',
          code__blk: '',
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
            if(this.dialogTitle === '新增故障') {

              this.checkAddDeviceModel(formName)
            } else {
              this.checkUpdateDeviceModel()
            }
          }
        })
      },
      imgChange(){
        this.flag = true
      },
      checkUpdateDeviceModel() {
        if(this.uploadForm.has('params')){

          this.uploadForm.delete('params')
        }
        if(this.uploadForm.has('image')){
          this.uploadForm.delete('image')
        }
        this.uploadForm.append('params', JSON.stringify(this.form))
        if(this.flag){
          this.$refs.uploadhtml.submit() // 提交时触发了before-upload函数
        }
        this.$axios({
          method: 'post',
          url: this.url.appBannerList+ '/' + this.modelId,
          data: this.uploadForm,
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
        if(this.uploadForm.has('params')){
          this.uploadForm.delete('params')
        }
        if(this.uploadForm.has('image')){
          this.uploadForm.delete('image')
        }
        this.uploadForm.append('params', JSON.stringify(this.form))
        if(this.flag){
          this.$refs.uploadhtml.submit() // 提交时触发了before-upload函数
        }
        
        this.$axios({
          method: 'post',
          url: this.url.appBannerList,
          data: this.uploadForm,
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
      newHtml(file) { // before-upload
        this.uploadForm.append('image', file)
        return false

      },
      addDeviceModel() { //
        this.flag = false
        this.dialogTitle = '新增故障';
        this.isDisabled = false;
        this.dialogFormVisible = true;
        this.fileList = [];
        this.form = { //弹出框数据容器
          code: '',
          name: '',
          content: '',
        }

      },
      handleEdit(index, row) {
        console.log(row)
        this.fileList = [];
        this.flag = false
        this.dialogTitle = '编辑故障';
        this.isDisabled = true;
        this.dialogFormVisible = true;
        this.modelId = row.id
        if(row.image){
          this.fileList = [
            {
              name:row.image.fileName,
              url:row.image.visitPathFull
            }
          ]
        }
        this.form = {
          code: row.code,
          name: row.name,
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

      /*filterTag(value, row) {
        return row.tag === value;
      },*/

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
    }
  }
</script>

<style scoped="scoped">
  /*.el-dialog__wrapper .el-form-item.is-required:nth-of-type(4) {
    height:74px;
  }*/
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