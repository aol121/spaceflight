<template>
  <div class="out-box">

    <!--弹出对话框 Begin-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :label-position="labelPosition" :rules="rules" ref="form" label-width="80px" :model="form">
        <el-row :gutter="24">
          <el-col :span="16" :offset="4">
            <div class="grid-content bg-purle">
              <el-form-item label="预设模式" prop="commandId">
                <el-select v-model="form.commandId" placeholder="预设模式">
                  <!--<el-option label="请选择..." value=""></el-option>-->
                  <el-option v-for="item in commandConfig" :label="item.name" :value="item.id"></el-option>
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
    <!--弹出“检测参数”对话框 Begin-->
    <el-dialog title="最近检测参数" :visible.sync="dialogFormVisible2" class="param-box">
      <p style="font-size:16px;line-height: 30px;margin-bottom: 14px;">
        <span style="margin-right: 30px;">设备编号：{{title.deviceCode}}</span>
        <span style="margin-right: 30px;">设备型号：{{title.deviceType}}</span>
        <span>板卡编号：{{title.dacCode}}</span>
      </p>
      <el-table ref="singleTable" stripe :data="fieldList" style="width: 100%;margin-bottom: 10px;" max-height="399">
        <el-table-column type="index" label="序号" min-width="50">
        </el-table-column>
        <el-table-column property="fieldCode" label="参数编号" min-width="120">
          <!--<template scope="scope">
            <el-input size="medium" v-model="scope.row.fieldCode" placeholder="请输入内容"></el-input>
          </template>-->

        </el-table-column>
        <el-table-column property="fieldName" label="参数名称" min-width="120">
        </el-table-column>
        <el-table-column property="fieldValue" label="参数值">
          <template scope="scope">
            <!--<el-input style="text-align: center;" size="medium" v-model="scope.row.fieldValue" placeholder="请输入参数值"></el-input>-->
            <div v-if="!scope.row.alarmLeavel" style="color:#409EFF">{{scope.row.fieldValue}}</div>
            <div v-if="scope.row.alarmLeavel =='1'" style="color:#E6A23C">{{scope.row.fieldValue}}</div>
            <div v-if="scope.row.alarmLeavel =='2'" style="color:#F56C6C">{{scope.row.fieldValue}}</div>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible2 = false">确 定</el-button>
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
      </div>

    </el-dialog>
    <!--弹出“检测参数”对话框 End-->

    <div class="body-box">
      <el-row class="row-box">
        <el-col :span="15">
          <div class="grid-content bg-purple">
            <el-form label-position="top" label-width="80px" :model="formLabelAlign" ref="formLabelAlign">
              <el-row :gutter="10" class="from-row">
                <el-col :span="6">
                  <div class="grid-content bg-purple">
                    <el-form-item label="所属客户">
                      <el-input placeholder="输入客户名称" v-model="formLabelAlign.customerName__blk"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="grid-content bg-purple">
                    <el-form-item label="所属区域">
                      <el-select v-model="formLabelAlign.areaId" placeholder="选择区域">
                        <el-option label="选择区域..." value=""></el-option>
                        <el-option v-for="item in area" :label="item.name" :value="item.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="grid-content bg-purple">
                    <el-form-item label="设备型号">
                      <el-select v-model="formLabelAlign.modelId" placeholder="选择设备型号">
                        <el-option label="选择设备型号..." value=""></el-option>
                        <el-option v-for="item in deviceModel" :label="item.name" :value="item.id"></el-option>
                      </el-select>
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
            <span class="btn-span" @click="multiIssu">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-piliang"></use>
                </svg><span>模式下发</span>
            </span>
            <span class="btn-span" @click="checkClear">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-clear"></use>
                </svg><span>模式清除</span>
            </span>
          </div>
        </el-col>
      </el-row>
      <div class="table-box">
        <el-table :data="tableData" stripe style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column prop="modelName" label="设备型号" min-width="115">
          </el-table-column>
          <el-table-column prop="id" label="设备编号" min-width="115">
          </el-table-column>
          <!--<el-table-column prop="runningStatus" label="连接信息" min-width="115">
            <template scope="scope">
              <span v-if="scope.row.runningStatus=='1'" style="color: #409EFF">连接</span>
              <span v-else style="color: #FA5555">断开</span>
            </template>
          </el-table-column>
          <el-table-column prop="runningStatus" label="运行状态" min-width="100">
            <template scope="scope">
              <span v-if="scope.row.runningStatus=='1'" style="color: #409EFF">正常</span>
              <span v-else style="color: #FA5555">异常</span>
            </template>
          </el-table-column>-->
          <el-table-column prop="runningStatus" label="运行状态" min-width="95">
            <template scope="scope">
              <span v-if="scope.row.runningStatus=='1'" style="color: #409EFF">已连接</span>
              <span v-else style="color: #FA5555">未连接</span>
            </template>
          </el-table-column>
          <el-table-column label="异常状态" min-width="95">
            <template scope="scope">
              <span v-if="scope.row.faultStatus=='0'" style="color: #409EFF">正常</span>
              <span v-else-if="scope.row.faultStatus=='1'" style="color: #E6A23C">异常</span>
              <span v-else="scope.row.faultStatus=='2'" style="color: #FA5555">故障</span>
            </template>
          </el-table-column>
          <el-table-column prop="commandConfigList" label="当前下发">
            <template scope="scope">
              <span v-if="scope.row.commandConfigList.length>0" style="color: #409EFF">{{scope.row.commandConfigList[0].commandConfigName}}</span>
              <span v-else style="color: #FA5555">无</span>
            </template>
          </el-table-column>
          <!--<el-table-column prop="commandConfigList" label="下发状态">
            <template scope="scope">
              <span v-if="scope.row.commandConfigList.length>0" style="color: #409EFF">已下发</span>
              <span v-else style="color: #FA5555">未下发</span>
            </template>
          </el-table-column>-->
          <el-table-column prop="customerName" label="所属客户" min-width="100">
          </el-table-column>
          <el-table-column prop="areaName" label="设备区域" min-width="100">
          </el-table-column>
          <el-table-column prop="updateDate" label="修改时间" min-width="100">
          </el-table-column>
          <el-table-column prop="updateUserName" label="修改人" min-width="100">
          </el-table-column>

          <el-table-column label="操作" min-width="100">
            <template scope="scope">
              <el-button @click="monitoredParameters(scope.$index, scope.row)" type="text">检测参数</el-button>
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
          deviceList: 'api/admin/device',
          deviceModel: 'api/admin/deviceModel', //设备型号列表
          areaList: 'api/admin/area', //区域列表
          commandConfig1: 'api/admin/devices/commandConfig',
          commandConfig: 'api/admin/commandConfig',

        },
        rules: {
          commandId: [{
            required: true,
            message: '预设模式不能为空',
            trigger: 'blur'
          }, ],
        },
        title: {
          deviceCode: '',
          deviceType: '',
          dacCode: '',
        },
        fieldList: [], //最近检测参数列表
        options: [],
        alarmData: [],
        commandConfig: [], //模式列表
        dialogTitle: '批量模式下发',
        dialogFormVisible: false,
        dialogFormVisible2: false,
        labelPosition: 'top',
        area: [], //区域列表容器
        deviceModel: [], //设备型号容器
        tableData: [],
        isDisabled: false,
        cur_page: 1,
        page_size: 10,
        totalCount: 1,
        multipleSelection: [], //选择容器
        searchParams: {},
        form: {
          commandId: ''
        },
        formLabelAlign: {
          customerName__blk: '',
          modelId: '',
          areaId: '',
        }
      };
    },
    mounted() {
      this.getData();
      this.getList();
    },

    methods: {
      monitoredParameters(index, row) { //查看检测参数
        console.log(row)
        this.title.deviceCode = row.id;
        this.title.deviceType = row.modelName;
        this.title.dacCode = row.dacModelId;
        this.$axios.get(this.url.deviceList + '/' + row.id + '/recentData', {
          headers: { //get添加请求头
            'Auth-Token': sessionStorage.getItem('spaceflight_token')
          }
        }).then((res) => {
          console.log(res.data.data)
          this.fieldList = []
          if(res.data.success && res.data.data && res.data.data.fieldList) {
            let a = res.data.data.fieldList
            for(let key in a) {

              this.fieldList.push(a[key])
            }
            console.log('544', this.fieldList)
            this.dialogFormVisible2 = true
          } else {
            this.$message.warning("未获取到当前设备的检测参数")
          }

        })
      },
      submitDialog(formName) {
        this.$refs[formName].validate((valid) => {
          if(valid) {
            if(this.dialogTitle === '批量模式下发') {
              this.checkConfig(formName)
            }
          }
        })
      },
      checkClear() { //批量清除
        if(this.multipleSelection.length > 0) {
          for(let i in this.multipleSelection) {
            this.options[i] = this.multipleSelection[i].id
          }
          this.$axios({
            method: 'delete',
            url: this.url.commandConfig1,
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
                message: res.data.message
              });
              this.getData();
            } else {
              if(res.data.message) {
                this.$message.error(res.data.message)
              } else {
                this.$message.error("操作失败")
              }

            }

          });
        } else {
          this.$message.warning("请至少选择一种要模式清除的设备")
        }
      },
      checkConfig(formName) { //确定模式下发
        this.$axios({
          method: 'put',
          url: this.url.commandConfig1,
          data: {
            params: {
              id__in: this.options,
              commandConfigId: this.form.commandId
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
            this.getData();
            this.dialogFormVisible = false;
          } else {
            if(res.data.message) {
              this.$message.error(res.data.message)
            } else {
              this.$message.error("下发失败！")
            }

          }

        });
      },
      multiIssu() { //模式下发
        let self = this
        this.form.commandId = ''
        if(this.multipleSelection.length > 0) {
          for(let i in this.multipleSelection) {
            this.options[i] = this.multipleSelection[i].id
          }
          if(JSON.stringify(this.commandConfig) === '[]') {
            this.$axios.get(this.url.commandConfig, { //获取模式列表
              headers: { //get添加请求头
                'Auth-Token': sessionStorage.getItem('spaceflight_token')
              }
            }).then((res) => {
              if(res.data.success) {
                this.dialogFormVisible = true
                this.commandConfig = res.data.data
                this.getData();
              }
            })
          } else {
            this.dialogFormVisible = true
          }
        } else {
          this.$message.warning("请至少选择一种要配置的设备")
        }

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
      getList(callback) { //获取增改下拉列表
        let self = this;

        function getDeviceModel() {
          return self.$axios.get(self.url.deviceModel, {
            headers: { //get添加请求头
              'Auth-Token': sessionStorage.getItem('spaceflight_token')
            }
          });
        }

        function getArea() {
          return self.$axios.get(self.url.areaList, {
            headers: { //get添加请求头
              'Auth-Token': sessionStorage.getItem('spaceflight_token')
            }
          });
        }
        self.$axios.all([getDeviceModel(), getArea()])
          .then(self.$axios.spread((deviceModel, area) => {
            // 两个请求现在都执行完成
            console.log('367', deviceModel.data.data)
            self.deviceModel = deviceModel.data.data
            self.area = area.data.data
            if(callback) {
              callback()
            }
          }));
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
        self.$axios.get(self.url.deviceList, {
          params: {
            params: v,
            pageIndex: self.cur_page - 1,
            pageSize: self.page_size,
            method: 'commandConfig',
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
      handleSelectionChange(val) {
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
  
  .cell .icon {
    margin-right: 0;
    color: #20A0FF;
  }
</style>