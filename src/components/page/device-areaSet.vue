<template>
  <div class="out-box">

    <!--弹出对话框 Begin-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" @close="closeEdit">
      <el-form :label-position="labelPosition" :rules="rules" ref="form" label-width="80px" :model="form">
        <el-row :gutter="20">
          <el-col :span="10" :offset="2">
            <div class="grid-content bg-purle">
              <el-form-item label="区域名称" prop="name">
                <el-input placeholder="输入区域" v-model="form.name"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purle">
              <el-form-item v-if="roleId=='agent'" label="客户" prop="customerId"><!--//代理商登录-->
                <el-select v-model="form.customerId" placeholder="选择客户" >                    
                  <el-option v-for="customer in customerList" :label="customer.name" :value="customer.id"></el-option>
                </el-select>           
              </el-form-item>
              <el-form-item v-else-if="roleId=='customer'" label="客户" > <!--//客户登录 -->          
                <el-select v-model="form.customerId" placeholder="选择客户" >                  
                  <el-option :label="mess.customerName" :value="mess.customerId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-else label="客户" > <!--//管理员登录  -->         
                <el-select v-model="form.customerId" placeholder="选择客户" >                  
                  <el-option  label="公共模式" value=""></el-option>
                  <el-option v-for="customer in customerList" :label="customer.name" :value="customer.id"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="10" :offset="2">
            <div class="grid-content bg-purle">
              <el-form-item label="负责人">
                <el-input placeholder="输入负责人" v-model="form.manager"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purle">
              <el-form-item label="负责人手机号">
                <el-input placeholder="输入手机号" v-model="form.managerMobile"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="24" :offset="2">
            <div class="grid-content bg-purle">
              <el-row :gutter="24" v-for="(domain, index) in domains">
                <el-col :span="10">
                  <div class="grid-content bg-purple">
                    <el-form-item label="设备型号" :rules="{
                        required: true, message: '设备型号不能为空', trigger: 'blur'
                      }">
                      <el-select v-model="domain.deviceModelId" placeholder="设备型号">
                        <!--<el-option label="请选择..." value=""></el-option>-->
                        <el-option v-for="deviceType in deviceTypeList" :label="deviceType.name" :value="deviceType.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="10">
                  <div class="grid-content bg-purple">
                    <el-form-item label="设备数量">
                      <el-input-number v-model="domain.quantity" :min="0"></el-input-number>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="grid-content bg-purple" style="padding-top: 44px;margin-left:-10px">
                    <span @click="addDomain" v-if="index===0">
                        <svg class="icon" aria-hidden="true">
                          <use  xlink:href="#icon-zengjia"></use>
                          
                        </svg>
                    </span>
                    <span @click.prevent="removeDomain(domain)" v-else>
                        <svg class="icon" aria-hidden="true">
                
                          <use xlink:href="#icon-shanchu"></use>
                        </svg>
                    </span>
                  </div>
                </el-col>
              </el-row>
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
                    <el-form-item label="客户名称">
                      <el-input placeholder="输入客户名称" v-model="formLabelAlign.customerName__blk"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="grid-content bg-purple">
                    <el-form-item label="区域">
                      <el-input placeholder="输入区域" v-model="formLabelAlign.name__blk"></el-input>
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
      <div class="table-box area-set">
        <el-table :data="data"  stripe style="width: 100%;" ref="multipleTable" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" :selectable="checkSelectable"></el-table-column>
          <el-table-column prop="customerName" label="客户名称" min-width="100">
          </el-table-column>
          <el-table-column prop="name" label="区域" min-width="80">
          </el-table-column>
          
          <el-table-column prop="typeNum" label="设备型号x(正常运行/总)数量" min-width="120">
          </el-table-column>
          <!--<el-table-column prop="dacModelName" label="正常运行数" min-width="115">
          </el-table-column>-->
          <el-table-column prop="manager" label="区域负责人" min-width="115">
          </el-table-column>
          <el-table-column prop="managerMobile" label="负责人电话" min-width="115">
          </el-table-column>

          <el-table-column label="操作" min-width="70">
            <template scope="scope">
              <svg v-if="(roleId !='customer' && roleId !='agent') || scope.row.customerId !=''" class="icon" aria-hidden="true" @click="handleEdit(scope.$index, scope.row)">
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
          areaList: 'api/admin/area',
          customerList: 'api/admin/customer', //客户列表
          deviceTypeList: '/api/admin/deviceModel', //设备型号

        },

        rules: {

          name: [{
            required: true,
            message: '名称不能为空',
          }, ],
          customerId: [{
            required: true,
            message: '客户不能为空',
          }, ],

        },

        options: [], //删除传参
        modelId: null, //编辑传参
        customerList: [], //客户容器
        deviceTypeList: [], //设备型号容器
        tableData: [],
        isDisabled: false,
        cur_page: 1,
        page_size: 10,
        totalCount: 1,
        multipleSelection: [], //选择容器
        select_cate: '',
        select_word: '',
        del_list: [],
        dialogTitle: '新增区域设置',
        dialogFormVisible: false,
        labelPosition: 'top',
        searchParams:{},
        form: {
          name: '',
          customerId: '',
          manager: '',
          managerMobile: '',
          deviceInfoList: [ //区域设备信息 选填
          ]

        },
        domains: [{
          deviceModelId: '',
          quantity: 0,
        }],
        formLabelAlign: {
          customerName__blk: '',
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
          if(d.deviceInfoList && d.deviceInfoList.length > 0) {
            d.typeNum = ''
            for(let i in d.deviceInfoList) {
              if(d.deviceInfoList[i].deviceModelName && d.deviceInfoList[i].quantity){
                d.typeNum += d.deviceInfoList[i].deviceModelName + '型x(' +d.deviceInfoList[i].regularRunningQuantity
                +'/'+ d.deviceInfoList[i].quantity + ')台;\n '
              }
                   
            }
          }
          return d;
        })
      },
      mess(){
        return JSON.parse(sessionStorage.getItem('spaceflight_mess'))
      }
    },
    methods: {
      closeEdit(){
        if(this.dialogTitle === "编辑区域设置"){
          this.getData();
        }
      },
      checkSelectable (row, index) {//表格多选选择性不可选

        return (this.roleId !='customer' && this.roleId !='agent') || row.customerId !== ''
      },

      removeDomain(item) {
        var index = this.domains.indexOf(item)
        if(index !== -1) {
          this.domains.splice(index, 1)
        }
      },
      addDomain() { //新增设备型号
        this.domains.push({
          deviceModelId: '',
          quantity: 0,
        });
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
          return self.$axios.get(self.url.customerList, {
            headers: { //get添加请求头
              'Auth-Token': sessionStorage.getItem('spaceflight_token')
            }
          });
        }

        function getModel() {
          return self.$axios.get(self.url.deviceTypeList, {
            headers: { //get添加请求头
              'Auth-Token': sessionStorage.getItem('spaceflight_token')
            }
          });
        }

        self.$axios.all([getCategory(), getModel()])
          .then(self.$axios.spread((ctegory, model) => {
            // 两个请求现在都执行完成
            console.log('305', model.data.data)
            self.customerList = ctegory.data.data
            self.deviceTypeList = model.data.data
            if(callback) {
              callback()
            }
          }));
      },
      submitDialog(formName) {
        this.$refs[formName].validate((valid) => {
          if(valid) {
            if(this.dialogTitle === '新增区域设置') {
              this.checkAddDeviceModel(formName)
            } else {
              this.checkUpdateDeviceModel()
            }
          }
        })
      },
      checkUpdateDeviceModel() {
        this.$axios.put(this.url.areaList + '/' + this.modelId, {
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
        this.form.deviceInfoList = this.domains
        this.$axios.post(this.url.areaList, {
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
        this.dialogTitle = '新增区域设置';
        this.isDisabled = false;
        this.dialogFormVisible = true;
        this.domains = [{
          deviceModelId: '',
          quantity: 0,
        }]
        if(JSON.stringify(this.customerList) === '[]') {

          this.getCategoryModel(() => {
            if(this.roleId=='customer'){
              this.form = { //弹出框数据容器
                name: '',
                customerId: this.mess.customerId,
                manager: '',
                managerMobile: '',
                deviceInfoList: [ //区域设备信息 选填
                ]
              }
            }else {
              this.form = { //弹出框数据容器
                name: '',
                customerId: '',
                manager: '',
                managerMobile: '',
                deviceInfoList: [ //区域设备信息 选填
                ]
              }
            }
          });
        } else {
          if(this.roleId=='customer'){
              this.form = { //弹出框数据容器
                name: '',
                customerId: this.mess.customerId,
                manager: '',
                managerMobile: '',
                deviceInfoList: [ //区域设备信息 选填
                ]
              }
            }else {
              this.form = { //弹出框数据容器
                name: '',
                customerId: '',
                manager: '',
                managerMobile: '',
                deviceInfoList: [ //区域设备信息 选填
                ]
              }
            }
        }
      },
      handleEdit(index, row) {
        console.log(row)

        this.dialogTitle = '编辑区域设置';
        this.isDisabled = true;
        this.dialogFormVisible = true;
        this.modelId = row.id
        if(JSON.stringify(this.customerList) === '[]') {
          this.getCategoryModel(() => {
            this.form = {
              name: row.name,
              customerId: row.customerId,
              manager: row.manager,
              managerMobile: row.managerMobile,
              deviceInfoList: row.deviceInfoList
            }
            this.domains = row.deviceInfoList
          });
          
        }else {
          this.form = {
              name: row.name,
              customerId: row.customerId,
              manager: row.manager,
              managerMobile: row.managerMobile,
              deviceInfoList: row.deviceInfoList
            }
            this.domains = row.deviceInfoList
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
        self.$axios.get(self.url.areaList, {
          
          params: {
            params:v,
            method:'statistics',
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

      filterTag(value, row) {
        return row.tag === value;
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
            url: this.url.areaList + 's',
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
  /*.el-input-number,.el-date-editor.el-input {
    width:100%;
  }*/
  .el-table .el-table__row .cell{
    word-break: keep-all !important;
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
    padding: 15px 20px;
    background-color: #fff;
  }
  
  .cell .icon {
    margin-right: 0;
    color: #20A0FF;
  }
</style>