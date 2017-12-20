<template>
  <div class="out-box">

    <!--弹出对话框 Begin-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :label-position="labelPosition" :rules="rules" ref="form" label-width="80px" :model="form">
        <el-row :gutter="20">
          <el-col :span="10" :offset="2">
            <div class="grid-content bg-purle">
              <el-form-item label="编号">
                <el-input placeholder="输入编号" :disabled="isDisabled" v-model="form.id"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purle">
              <el-form-item required label="名称" prop="name">
                <el-input placeholder="输入名称" v-model="form.name"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="10" :offset="2">
            <div class="grid-content bg-purle">
              <el-form-item label="品类" prop="categoryId">
                <!--<el-input placeholder="选择品类" v-model="form.id"></el-input>-->
                <el-select v-model="form.categoryId" placeholder="选择品类">
                  <!--<el-option label="请选择..." value=""></el-option>-->
                  <el-option v-for="deviceCategory in deviceCategoryList" :label="deviceCategory.name" :value="deviceCategory.id"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purle">
              <el-form-item label="模块" prop="dacModelId">
                <el-select v-model="form.dacModelId" placeholder="选择模块">
                  <!--<el-option label="请选择..." value=""></el-option>-->
                  <el-option v-for="dacModel in dacModelList" :label="dacModel.name" :value="dacModel.id"></el-option>
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

    <!--弹出“查看参数”对话框 Begin-->
    <el-dialog :title="dialogTitle2" :visible.sync="dialogFormVisible2" class="examine-param">
      <p style="font-size:16px;line-height: 30px;margin-bottom: 14px;">
        <span style="margin-right: 30px;">设备型号编号：{{alarmCode}}</span>
        <span>设备型号名称：{{alarmName}}</span>
      </p>
      <el-table ref="singleTable" stripe :data="alarmData" style="width: 100%;margin-bottom: 10px;" max-height="399">
        <el-table-column type="index" label="序号" min-width="50">
        </el-table-column>
        <el-table-column property="code" label="参数编号" min-width="120">
        </el-table-column>
        <el-table-column property="name" label="参数名称" min-width="120">
        </el-table-column>
        <el-table-column property="value" label="参数值" min-width="120">
          <template scope="scope">
            <el-input @change="(v)=>{scope.row.value = isNaN(v)? '':v}" size="medium" v-model.number="scope.row.value" placeholder="配置参数值"></el-input>

          </template>
        </el-table-column>
        <el-table-column property="unit" label="单位">
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitParamConfig">确 定</el-button>
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
      </div>

    </el-dialog>
    <!--弹出“查看参数”对话框 End-->

    <!--弹出"配置"对话框 Begin-->
    <el-dialog title="参数配置" :visible.sync="dialogFormVisible1">
      <el-form :label-position="labelPosition" label-width="80px" :model="formObj">
        <p style="line-height:26px;">预警规则—参数红色预警</p>
        <div class="config-row">
          <el-row class="" v-for="(item,index) in formObj.configurable" v-if="item.alarmLevel===1">
            <el-col :span="10" :offset="1">
              <div class="grid-content bg-purle">
                <el-form-item :label="item.fieldName">
                  <el-input placeholder="输入数字" @change="(v)=>{item.upperLimit = isNaN(v)? '':v}" v-model.number="item.upperLimit">
                    <template slot="prepend">大于</template>
                    <template slot="append">{{item.fieldUnit}}</template>
                  </el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="2" style="text-align: center;padding-top:42px;">
              或
            </el-col>
            <el-col :span="10" style="padding-top:10px;">
              <div class="grid-content bg-purle">
                <el-form-item label=" ">
                  <el-input placeholder="输入数字" @change="(v)=>{item.lowerLimit = isNaN(v)? '':v}" v-model.number="item.lowerLimit">
                    <template slot="prepend">小于</template>
                    <template slot="append">{{item.fieldUnit}}</template>
                  </el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </div>
        <p style="line-height:26px;">异常规则—设备异常短信告警</p>
        <el-row class="" v-for="(item,index) in formObj.configurable" v-if="item.alarmLevel===2">
          <el-col :span="10" :offset="1">
            <div class="grid-content bg-purle">
              <el-form-item :label="item.fieldName">
                <el-input placeholder="输入数字" @change="(v)=>{item.upperLimit = isNaN(v)? '':v}" v-model="item.upperLimit">
                  <template slot="prepend">大于</template>
                  <template slot="append">{{item.fieldUnit}}</template>
                </el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="2" style="text-align: center;padding-top:42px;">
            或
          </el-col>
          <el-col :span="10" style="padding-top:10px;">
            <div class="grid-content bg-purle">
              <el-form-item label=" " prop="name">
                <el-input placeholder="输入数字" @change="(v)=>{item.lowerLimit = isNaN(v)? '':v}" v-model.number="item.lowerLimit">
                  <template slot="prepend">小于</template>
                  <template slot="append">{{item.fieldUnit}}</template>
                </el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitConfig('formObj')">确 定</el-button>
        <el-button @click="dialogFormVisible1 = false">取 消</el-button>
      </div>

    </el-dialog>
    <!--弹出配置对话框 End-->

    <div class="body-box">
      <el-row class="row-box">
        <el-col :span="15">
          <div class="grid-content bg-purple">
            <el-form label-position="top" label-width="80px" :model="formLabelAlign" ref="formLabelAlign">
              <el-row :gutter="10" class="from-row">
                <el-col :span="6">
                  <div class="grid-content bg-purple">
                    <el-form-item label="设备型号编号">
                      <el-input placeholder="设备型号编号" v-model="formLabelAlign.id__blk"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="grid-content bg-purple">
                    <el-form-item label="设备型号名称">
                      <el-input placeholder="设备型号名称" v-model="formLabelAlign.name__blk"></el-input>
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
        <el-col :span="9">
          <div class="grid-content bg-purple btn-box">
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
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column prop="id" label="设备型号编号" min-width="115">
          </el-table-column>
          <el-table-column prop="name" label="设备型号名称" min-width="115">
          </el-table-column>
          <el-table-column prop="categoryName" label="所属设备品类" min-width="115">
          </el-table-column>
          <!--<el-table-column prop="dacModelName" label="所属模块">
          </el-table-column>-->
          <el-table-column label="参数列表">
            <template scope="scope">
              <el-button type="text" @click="viewParameters(scope.$index, scope.row)">查看参数</el-button>
            </template>
          </el-table-column>
          <el-table-column  label="告警规则">
            <template scope="scope">
              <!--<el-tooltip effect="dark" content="配置参数" placement="left">-->
              <svg class="icon" aria-hidden="true" @click.stop="handleConfig(scope.$index, scope.row)">
                <use xlink:href="#icon-config"></use>
              </svg>
          
            </template>
            
            
          </el-table-column>
          <el-table-column label="操作" min-width="50">
            <template scope="scope">
              
              <!--</el-tooltip>-->
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
          deviceModelList: 'api/admin/deviceModel',
          deviceCategoryList: 'api/admin/deviceCategory',
          dacModelList: 'api/admin/dacModel',
          //        Configurable: 'api/admin/alarmConfig',
          alarmConfig: 'api/admin/alarmConfig',

        },
        rules: {
          name: [{
            required: true,
            message: '姓名不能为空',
          }, ],
          categoryId: [{
            required: true,
            message: '品类不能为空',
          }, ],
          dacModelId: [{
            required: true,
            message: '模块不能为空',
          }, ],
        },
        rules1: {
          name: [{
            type: 'number',
            message: '姓名不能为空',
          }, ],
          categoryId: [{
            required: true,
            message: '品类不能为空',
          }, ],
          dacModelId: [{
            required: true,
            message: '模块不能为空',
          }, ],
        },
        alarmCode: '',
        alarmName: '',
        alarmData: [], //参看参数表格数据
        options: [], //删除传参
        modelId: null, //编辑传参
        deviceCategoryList: [], //品类容器
        dacModelList: [], //模块容器
        tableData: [],
        isDisabled: false,
        cur_page: 1,
        page_size: 10,
        totalCount: 1,
        multipleSelection: [], //选择容器
        dialogTitle: '新增设备型号',
        dialogTitle2: '查看参数',
        dialogFormVisible: false, //增改弹窗
        dialogFormVisible1: false, //配置参数弹窗
        dialogFormVisible2: false, //参看参数弹窗
        labelPosition: 'top',
        formObj: {
          configurable: []
        },
        //      configurable: [], //可配置项列表
        form: {
          id: '',
          name: '',
          categoryId: '',
          dacModelId: 'DAC001',
        },
        //      alarmConfig: [],//参数配置表单容器
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
      submitParamConfig(){//提交“查看参数”配置信息

        
        this.$axios({
          method: 'put',
            url: 'api/admin/deviceModel/'+this.alarmCode+'/attributes',
            data: {
              params: {
                attributes:this.alarmData
              },
            },
            headers: { //get添加请求头
              'Auth-Token': sessionStorage.getItem('spaceflight_token')
            }
        }).then((res)=>{
          if(res.data.success){
            this.$message.success(res.data.message)
            this.dialogFormVisible2 = false;
          }else {
            this.$message.error(res.data.message)
          }

        })
      },
     
      viewParameters(index, row) {
        console.log(row)
        this.dialogFormVisible2 = true;
        this.alarmData = row.attributes;
        this.alarmCode = row.id
        this.alarmName = row.name
      },
      submitConfig() {

        let params = []
        console.log('345', this.formObj.configurable)
        let a = this.formObj.configurable
        for(let i in a) {
          if(a[i].upperLimit && a[i].lowerLimit) { //上下线 两个都有
            if(a[i].upperLimit-0 > a[i].lowerLimit-0) { //上限大于下限
              params.push(a[i])
            } else {
              //                alert("不符合要求")
              this.tips('上限值 必须大于 下限值');
              return
            }
          } else if(a[i].upperLimit || a[i].lowerLimit) { //两者有一
            if(a[i].upperLimit) {
              delete a[i].lowerLimit
            }
            if(a[i].lowerLimit) {
              delete a[i].upperLimit
            }
            params.push(a[i])
          }else {//两个都没有
            delete a[i].lowerLimit
            delete a[i].upperLimit
            params.push(a[i])
          }
        }
        console.log('375', params) //完成  上限值 必须大于 下限值      去除没有参数的 字段
        let params1 = []
        let ruleIndex = params[0].alarmLevel;
        let ruleCode = params[0].fieldCode;
        for(let i in params) {
          if(ruleIndex != params[i].alarmLevel) { //同时存在  告警 和 预警
            //              alert('有不同规则的参数')
            for(let j in params) {

              if(params[i].alarmLevel != params[j].alarmLevel && params[i].fieldCode === params[j].fieldCode) { //规则不同  且  类型一样

                if(params[i].lowerLimit-0 >= params[j].lowerLimit-0) { //预警下限  大于  告警下限   报错
                  this.tips('预警下限  必须小于  告警下限');
                  return
                }
                if(params[i].upperLimit-0 <= params[j].upperLimit-0) { //预警下限  大于  告警下限   报错

                  this.tips('预警上限  必须大于  告警上限');
                  return
                }
                params1 = params

              }
            }
          } else { //只存在一种告警规则
            params1 = params
          }
        }
        console.log('402', params1)
        this.$axios.post(this.url.alarmConfig, {
          
          params: {
            deviceModelId:this.modelId,
            alarmConfigFieldList:params1
          }
        }, {
          headers: { //post添加请求头
            'Auth-Token': sessionStorage.getItem('spaceflight_token')
          }
        }).then((res) => {
          if(res.data.success) {
            this.dialogFormVisible1 = false;
            this.$message.success(res.data.message)
            this.getData();

          } else {
            this.$message.error(res.data.message)
          }
        })

      },
      tips(v) {//错误提示
        this.$notify.error({
          title: '提示',
          message: v,
          
        });
      },
      handleConfig(index, row) { //配置参数 按钮
        this.modelId = row.id;
        this.$axios.get(this.url.alarmConfig + '/' + row.id, { //获取可配置项
          headers: { //get添加请求头
            'Auth-Token': sessionStorage.getItem('spaceflight_token')
          }
        }).then((res) => {
          console.log('350', res.data.data)
          if(res.data.success) {
            let a = res.data.data.alarmConfigFieldList
            for(let i in a) {
              if(!a[i].upperLimit) {
                a[i].upperLimit = null
              }
              if(!a[i].lowerLimit) {
                a[i].lowerLimit = null
              }
            }
            this.formObj.configurable = a;
            console.log('449', this.formObj.configurable)
            this.dialogFormVisible1 = true;
          } else {
            this.$message.error(res.data.message)
          }

        })
      },
      searchModel() {
        this.searchParams = {};
        for(let key in this.formLabelAlign) {
          if(this.formLabelAlign[key]) {
            this.searchParams[key] = this.formLabelAlign[key]
          }
        }
        this.getData(this.searchParams)
      },
      getCategoryModel(callback) {
        let self = this;

        function getCategory() {
          return self.$axios.get(self.url.deviceCategoryList, {
            headers: { //get添加请求头
              'Auth-Token': sessionStorage.getItem('spaceflight_token')
            }
          });
        }

        function getModel() {
          return self.$axios.get(self.url.dacModelList, {
            headers: { //get添加请求头
              'Auth-Token': sessionStorage.getItem('spaceflight_token')
            }
          });
        }

        self.$axios.all([getCategory(), getModel()])
          .then(self.$axios.spread((ctegory, model) => {
            // 两个请求现在都执行完成
            console.log(model.data.data)
            self.deviceCategoryList = ctegory.data.data
            self.dacModelList = model.data.data
            if(callback) {
              callback()
            }
          }));
      },
      submitDialog(formName) {
        this.$refs[formName].validate((valid) => {
          if(valid) {
            if(this.dialogTitle === '新增设备型号') {
              this.checkAddDeviceModel(formName)
            } else {
              this.checkUpdateDeviceModel()
            }
          }
        })
      },
      checkUpdateDeviceModel() {
        this.$axios.put(this.url.deviceModelList + '/' + this.modelId, {
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
      checkAddDeviceModel(formName) {
        this.$axios.post(this.url.deviceModelList, {
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
      addDeviceModel() { //
        this.dialogTitle = '新增设备型号';
        this.isDisabled = false;
        this.dialogFormVisible = true;
        this.form = { //弹出框数据容器
          id: '',
          name: '',
          categoryId: '',
          dacModelId: 'DAC001',
        }
        if(JSON.stringify(this.dacModelList) === '[]') {
          this.getCategoryModel();
        }
      },
      handleEdit(index, row) {
        console.log(row)

        this.dialogTitle = '编辑设备型号';
        this.isDisabled = true;
        this.dialogFormVisible = true;
        this.modelId = row.id
        if(JSON.stringify(this.dacModelList) === '[]') {
          this.getCategoryModel(() => {
            this.form = { //弹出框数据容器 
              id: row.id,
              name: row.name,
              categoryId: row.categoryId,
              dacModelId: 'DAC001',
            }
          });
        } else {
          this.form = { //弹出框数据容器 
            id: row.id,
            name: row.name,
            categoryId: row.categoryId,
            dacModelId: 'DAC001',
          }
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
        self.$axios.get(self.url.deviceModelList, {
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
          } else if(res.data.code == 200) {
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
          console.log(this.options)

          this.open2();
        } else {
          this.$message.error("请至少选择一位要删除的客户")
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
            url: this.url.deviceModelList + 's',
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
  .el-input-group__prepend div.el-select .el-input__inner {
    width: 130px !important;
    padding-left: 10px;
  }
  
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
  
  .config-row {
    border-bottom: 1px solid #F1F3F5;
    margin-bottom: 20px;
    ;
  }
  
  .btn-span {
    height: 36px;
    display: inline-flex;
    align-items: center;
    vertical-align: bottom;
    font-size: 14px;
    margin-left: 15px;
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
    margin: 0 5px;
  }
</style>