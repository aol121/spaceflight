<template>
  <div class="out-box">

    <!--弹出对话框 Begin-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :label-position="labelPosition" :rules="rules" ref="form" label-width="80px" :model="form">
        <el-row :gutter="20">
          <el-col :span="10" :offset="2">
            <div class="grid-content bg-purle">
              <el-form-item label="计划号" prop="code">
                <el-input placeholder="（确认后不可更改）" :disabled="isDisabled" v-model="form.code"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purle">
              <el-form-item label="计划名称" prop="name">
                <el-input placeholder="输入名称" v-model="form.name"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="10" :offset="2">
            <div class="grid-content bg-purle">
              <el-form-item label="客户" v-if="roleId==='customer'">
                <el-select v-model="form.customerId" placeholder="选择客户">
                  <el-option :label="mess.customerName" :value="mess.customerId"></el-option>
                  
                </el-select>
              </el-form-item>
              <el-form-item label="客户" v-else>
                <el-select v-model="form.customerId" placeholder="选择客户">
                  <el-option label="公用模式" value=""></el-option>
                  <el-option v-for="deviceCategory in deviceCategoryList" :label="deviceCategory.name" :value="deviceCategory.id"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purle">
              <el-form-item label="模块" prop="dacModelId">
                <el-select disabled v-model="form.dacModelId" placeholder="选择模块">
                  <el-option v-for="dacModel in dacModelList" :label="dacModel.name" :value="dacModel.id"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          
          <el-col :span="10" :offset="2">
            <div class="grid-content bg-purle">
              <el-form-item label="时间" prop="timeString">
                <el-time-picker
                  value-format="HH:mm:ss"
                  v-model="form.timeString"        
                  placeholder="选择时间">
                </el-time-picker>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purle">
              <el-form-item label="间隔天数" prop="periodDay">
                <el-input-number v-model="form.periodDay" :min="1" ></el-input-number>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="10" :offset="2">
            <div class="grid-content bg-purle">
              <el-form-item label="清扫频次" prop="frequency">
                <el-input-number v-model="form.frequency" :min="1"></el-input-number>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purle">
              <el-form-item label="速度（单位：%）" prop="speed">
                <el-input-number v-model="form.speed" :min="10" :max="95"></el-input-number>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="10" :offset="2">
            <div class="grid-content bg-purle">
              <el-form-item label="指令" prop="commandRuleId">    
                <el-select disabled v-model="form.commandRuleId" placeholder="选择指令">
                  <!--<el-option :label="dacModelList.commandRuleMap['2'].name" :value="dacModelList.commandRuleMap['2'].ruleId"></el-option>-->
                  <el-option :label="ruleObj.name" :value="ruleObj.ruleId"></el-option>
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
    <div class="body-box">
      <el-row class="row-box">
        <el-col :span="15">
          <div class="grid-content bg-purple">
            <el-form label-position="top" label-width="80px" :model="formLabelAlign" ref="formLabelAlign">
              <el-row :gutter="10" class="from-row">
                <el-col :span="6">
                  <div class="grid-content bg-purple">
                    <el-form-item label="计划号">
                      <el-input placeholder="输入计划号" v-model="formLabelAlign.code__blk"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="grid-content bg-purple">
                    <el-form-item label="计划名称">
                      <el-input placeholder="输入名称" v-model="formLabelAlign.name__blk"></el-input>
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
            <span class="btn-span" @click="delet">
              <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-shanchu"></use>
                </svg>删除
            </span>
          </div>
        </el-col>
      </el-row>
      <div class="table-box">
        <el-table :data="data" stripe style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" :selectable="checkSelectable">

          </el-table-column>
          <el-table-column prop="code" label="计划号" min-width="115">
          </el-table-column>
          <el-table-column prop="name" label="计划名称" min-width="115">
          </el-table-column>
          <el-table-column prop="periodDay" label="间隔天数" min-width="115">
          </el-table-column>          
          <el-table-column prop="timeString" label="清扫时间">
          </el-table-column>
          <el-table-column prop="attributes.frequency" label="清扫频次">
          </el-table-column>
          <el-table-column prop="attributes.speed" label="清扫速度">
          </el-table-column>

          <el-table-column label="操作" min-width="70">
            <template scope="scope">
              <!--当不是  客户登录  或者不是公共模式  时  显示-->
            <svg v-if="roleId !='customer' || scope.row.customerId !=''"  class="icon" aria-hidden="true" @click="handleEdit(scope.$index, scope.row)">
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
          defaultModeList:'api/admin/commandConfig',
          customerList:'api/admin/customer',//客户列表
          dacModelList:'api/admin/dacModel',//模块列表

        },
        rules: {
          code: [{
            required: true,
            message: '计划号不能为空',
          }, ],
          name: [{
            required: true,
            message: '名称不能为空',
          }, ],
          commandRuleId: [{
            required: true,
            message: '指令不能为空',
          }, ],
          dacModelId: [{
            required: true,
            message: '模块不能为空',
          }, ],
          timeString: [{
            required: true,
            message: '时间不能为空',
          }, ],
          periodDay: [{
            required: true,
            message: '间隔天数不能为空',
          }, ],
          frequency: [{
            required: true,
            message: '频次不能为空',
          }, ],
          speed: [{
            required: true,
            message: '速度不能为空',
          }, ],
        },
        options:[],//删除传参
        modelId:null,//编辑传参
        deviceCategoryList:[],//品类容器
        dacModelList:[],//模块容器
        ruleObj:{},
        tableData: [],
        isDisabled: false,
        cur_page: 1,
        page_size:10,
        totalCount: 1,
        multipleSelection: [], //选择容器
        dialogTitle: '新增模式预设',
        dialogFormVisible: false,
        labelPosition: 'top',
        searchParams:{},
        form: {
          code: '',
          name: '',
          customerId:'',
          dacModelId:'',
          commandRuleId:'',
          timeString:'',
          periodDay:null,          
          frequency:null,          
          speed:10,          
        },
        formLabelAlign: {
          code__blk: '',
          name__blk: '',
        },
        roleId:'',//角色类型
      };
    },
    mounted() {
      this.roleId = JSON.parse(sessionStorage.getItem('spaceflight_role')).id;
      this.getData();
    },
    computed: {
      data() {
        const self = this;        
        return self.tableData.filter(function(d) {
          let a = d.timeExpression.split(' ').splice(0,3).reverse().join(':')
          let b = (d.timeExpression.split(' ').splice(3,1))[0].split('/')[1]
          d.periodDay = b;
          d.timeString = a 
          if(d.attributes && d.attributes.speed){
            d.attributes.speed = d.attributes.speed+"%"
          }
          
          return d;
        })
      },
      mess(){
        return JSON.parse(sessionStorage.getItem('spaceflight_mess'))
      }
      

    },
    methods: {
      checkSelectable (row, index) {//表格多选选择性不可选
          //通过id来禁止不能选择的项
        // return row.id !== 1
        //通过索引index来禁止不能选择的项
        return this.roleId !='customer' || row.customerId !== ''
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
      getCategoryModel(callback){
        let self = this;
        function getCategory() {
          return self.$axios.get(self.url.customerList, {
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
//          console.log('self.dacModelList',self.dacModelList[0])
            if(callback) {
              callback()
            }
          }));
      },
      submitDialog(formName) {
        this.$refs[formName].validate((valid) => {
          if(valid) {
            if(this.dialogTitle === '新增模式预设') {
              this.checkAddDeviceModel(formName)
            } else {
              this.checkUpdateDeviceModel()
            }
          }
        })
      },
      checkUpdateDeviceModel() {
        this.$axios.put(this.url.defaultModeList + '/' + this.modelId, {
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
        console.log(this.form)
        this.$axios.post(this.url.defaultModeList, {
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
        this.dialogTitle = '新增模式预设';
        this.isDisabled = false;
        this.dialogFormVisible = true;        
        if(JSON.stringify(this.dacModelList)==='[]'){
          this.getCategoryModel(()=>{

            for(let key in this.dacModelList[0].commandRuleMap){
              if(this.dacModelList[0].commandRuleMap[key].configurable){
                this.ruleObj = this.dacModelList[0].commandRuleMap[key]
              }
            }
            console.log('xxx',this.ruleObj)
            
            if(this.roleId=='customer'){
              this.form = { //弹出框数据容器
                code: '',
                name: '',
                customerId:this.mess.customerId,
                dacModelId:'DAC001',
                commandRuleId:this.ruleObj.ruleId,
                timeString:'',
                periodDay:1,
                frequency:1,          
                speed:10,             
              }
            }else {
              this.form = { //弹出框数据容器
                code: '',
                name: '',
                customerId:'',
                dacModelId:'DAC001',
                commandRuleId:this.ruleObj.ruleId,
                timeString:'',
                periodDay:1,
                frequency:1,          
                speed:10,             
              }
            }
          });
        }else {
          for(let key in this.dacModelList[0].commandRuleMap){
              if(this.dacModelList[0].commandRuleMap[key].configurable){
                this.ruleObj = this.dacModelList[0].commandRuleMap[key]
              }
            }
          if(this.roleId=='customer'){
              this.form = { //弹出框数据容器
                code: '',
                name: '',
                customerId:this.mess.customerId,
                dacModelId:'DAC001',
                commandRuleId:this.ruleObj.ruleId,
                timeString:'',
                periodDay:1,
                frequency:1,          
                speed:1,             
              }
            }else {
              this.form = { //弹出框数据容器
                code: '',
                name: '',
                customerId:'',
                dacModelId:'DAC001',
                commandRuleId:this.ruleObj.ruleId,
                timeString:'',
                periodDay:1,
                frequency:1,          
                speed:10,             
              }
            }
        }
      },
      handleEdit(index, row) {
        console.log(row)

        this.dialogTitle = '编辑模式预设';
        this.isDisabled = true;
        this.dialogFormVisible = true;
        this.modelId = row.id
        if(JSON.stringify(this.dacModelList)==='[]'){
          
          this.getCategoryModel(()=>{
            for(let key in this.dacModelList[0].commandRuleMap){
              if(this.dacModelList[0].commandRuleMap[key].configurable){
                this.ruleObj = this.dacModelList[0].commandRuleMap[key]
              }
            }
            console.log('489',this.ruleObj)
            this.form = { //弹出框数据容器 
              code: row.code,
              name: row.name,
              customerId:row.customerId,
              dacModelId:'DAC001',
              commandRuleId:row.commandRuleId,
              timeString:row.timeString,
              periodDay:row.periodDay,
              frequency:row.frequency,          
              speed:row.speed, 
            }
          });
        }else {
          for(let key in this.dacModelList[0].commandRuleMap){
              if(this.dacModelList[0].commandRuleMap[key].configurable){
                this.ruleObj = this.dacModelList[0].commandRuleMap[key]
              }
            }
            console.log('508',this.ruleObj)
          this.form = { //弹出框数据容器 
              code: row.code,
              name: row.name,
              customerId:row.customerId,
              dacModelId:'DAC001',
              commandRuleId:row.commandRuleId,
              timeString:row.timeString,
              periodDay:row.periodDay,
              frequency:row.frequency,          
              speed:row.speed, 
            }
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

        self.$axios.get(self.url.defaultModeList, {
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
          console.log(this.options)

          this.open2();
        } else {
          this.$message.error("请选择要删除的客户")
        }

      },
      open2() { //删除前提示
        this.$confirm('此操作将清空使用该模式的设备模式, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'

        }).then(() => {

          this.$axios({
            method: 'delete',
            url: this.url.defaultModeList+'s',
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
  
  .cell .icon {
    margin-right: 0;
    color: #20A0FF;
  }
</style>