<template>
  <div class="out-box">

    <!--弹出对话框 Begin-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :label-position="labelPosition" :rules="rules" ref="form" label-width="80px" :model="form">
        
        <el-row :gutter="20">
          <el-col :span="10" :offset="2">
            <div class="grid-content bg-purle">
              <el-form-item label="标题" prop="title">
                <el-input placeholder="输入标题" v-model="form.title"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purle">
              <el-form-item label="排序">
                <el-input-number v-model="form.sort" :min="1"></el-input-number>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="10" :offset="2">
            <div class="grid-content bg-purle">     
              <el-form-item label="位置" prop="position">
                <el-input placeholder="输入位置" v-model="form.position"></el-input>
              </el-form-item>             
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purle">
              <el-form-item label="链接地址">
                <el-input placeholder="输入链接" v-model="form.linkUrl"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="20" :offset="2" style="text-align: center;">
            <div class="grid-content bg-purle">
              <el-form-item label="" prop="fileList">
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
                    <el-form-item label="标题">
                      <el-input placeholder="输入标题" v-model="formLabelAlign.title__blk"></el-input>
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
          <!--<el-table-column
            type="index"
            label="序号"
            width="50">
          </el-table-column>-->
          <el-table-column prop="title" label="标题" min-width="100">
          </el-table-column>
          <el-table-column prop="position" label="广告位置" min-width="100">
          </el-table-column>
          <el-table-column prop="sort" label="优先级" min-width="100">
          </el-table-column>
          <el-table-column prop="image" label="图片" min-width="200">
            <template scope="scope">
              <img v-if="scope.row.image" class="img" :src="scope.row.image.visitPathFull" />
            </template>

          </el-table-column>
          <el-table-column prop="linkUrl" label="链接" min-width="100">
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
          appBannerList: 'api/admin/appBanner',
        },
        rules: {
          title: [{
            required: true,
            message: '标题不能为空',
            trigger: 'blur'
          }, ],

          position: [{
            required: true,
            message: '位置不能为空',
            trigger: 'blur'
          }, ],

        },
        searchParams:{},
        flag:false,
        fileList:[],
        options:[],
        modelId:'',//编辑传参
        tableData: [],
        isDisabled: false,
        cur_page: 1,
        page_size: 10,
        totalCount: 1,
        multipleSelection: [], //选择容器
        dialogTitle: '新增banner',
        dialogFormVisible: false,
        labelPosition: 'top',
        uploadForm: new FormData(),
        form: {
          title: '',
          sort: 1,
          position: '',
          linkUrl: '',
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
            if(this.dialogTitle === '新增banner') {

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
        }else{

          this.open()
          return
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
      open() {
        this.$alert('请选择要上传的图片', '提示', {
          confirmButtonText: '确定',

        });
      },
      newHtml(file) { // before-upload
        this.uploadForm.append('image', file)
        return false

      },
      addDeviceModel() { //
        this.flag = false;
        this.dialogTitle = '新增banner';
        this.isDisabled = false;
        this.dialogFormVisible = true;
        this.fileList = [];
        this.form = { //弹出框数据容器
          title: '',
          sort: 1,
          position: '',
          linkUrl: '',
        }

      },
      handleEdit(index, row) {
        console.log(row)
        this.flag = false;
        this.dialogTitle = '编辑banner';
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
          title: row.title,
          sort: 3,
          position: row.position,
          linkUrl: row.linkUrl,
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
        console.log(val)
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