<template>
  <div class="out-box">
    <!--弹出对话框 Begin-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :label-position="labelPosition" :rules="rules" ref="form" label-width="80px" :model="form">
        <el-row :gutter="20">
          <el-col :span="10" :offset="2">
            <div class="grid-content bg-purle">
              <el-form-item label="设备编号" prop="id">
                <el-input placeholder="（确认后不可更改）" :disabled="isDisabled" v-model="form.id"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purle">
              <el-form-item label="设备型号" prop="modelId">
                <el-select v-model="form.modelId" placeholder="选择型号" :disabled="roleId==='customer'">
                  <el-option v-for="item in deviceModel" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="10" :offset="2">
            <div class="grid-content bg-purle">
              <el-form-item label="电池规格">
                <el-input :disabled="roleId==='customer'" placeholder="电池规格" v-model="form.batterySpec"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <!--<el-col :span="10">
            <div class="grid-content bg-purle">
              <el-form-item label="所属代理商">
                <el-select v-model="form.agentId" placeholder="选择代理商">
                  <el-option v-for="item in agent" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          
          <el-col :span="10" :offset="2">
            <div class="grid-content bg-purle">
              <el-form-item label="单程长度">
                <el-input placeholder="单程长度" v-model="form.coverageSize"></el-input>
              </el-form-item>
            </div>
          </el-col>-->
          <el-col :span="10">
            <div class="grid-content bg-purle">
              <el-form-item label="所属客户" prop="customerId">
                <el-select v-model="form.customerId" placeholder="选择客户" :disabled="roleId==='customer'">
                  <el-option v-for="item in customer" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="10" :offset="2">
            <div class="grid-content bg-purle">
              <el-form-item label="板卡(模块)编号" prop="dacId">
                <el-input placeholder="（确认后不可更改）" :disabled="isDisabled" v-model="form.dacId"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purle">
              <el-form-item label="所属区域">
                <el-select v-model="form.areaId" placeholder="选择区域">
                  <el-option v-for="item in area" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="10" :offset="2">
            <div class="grid-content bg-purle">
              <el-form-item label="交付日期">
                <el-date-picker :disabled="roleId==='customer'" v-model="form.deliveryDate" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content bg-purle">
              <el-form-item label="质保到期日">
                <el-date-picker :disabled="roleId==='customer'" v-model="form.warrantyExpiryDate" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd">
                </el-date-picker>
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
    
    <!--维修图片弹出对话框 Begin-->
    <el-dialog class="image-box" title="已安装图片" :visible.sync="dialogFormVisible1">

      <el-carousel :interval="5000" arrow="always">
        <el-carousel-item v-for="item in imageList">
          <!--<h3>{{ item }}</h3>-->
          <div class="image-wrap" :style="'background:url('+item.visitPathFull+') no-repeat center center;backgroundSize:contain;height:100%'">
            <!--{{item.visitPathFull}}-->

          </div>
          <!--<div class="image-wrap" :style="background:url(+{item.visitPathFull}+) no-repeat center center;bacckground-sizing:cover">
            
          </div>-->
        </el-carousel-item>
      </el-carousel>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible1 = false">确 定</el-button>
        <el-button @click="dialogFormVisible1 = false">取 消</el-button>
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
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form label-position="top" label-width="80px" :model="formLabelAlign" ref="formLabelAlign">
              <el-row :gutter="10" class="from-row">
                <el-col :span="6">
                  <div class="grid-content bg-purple">
                    <el-form-item label="设备编号">
                      <el-input placeholder="输入编号" v-model="formLabelAlign.id__blk"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="grid-content bg-purple">
                    <el-form-item label="所属客户">
                      <el-input placeholder="客户名称" v-model="formLabelAlign.customerName__blk"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="grid-content bg-purple">
                    <el-form-item label="设备状态">
                      <el-select v-model="formLabelAlign.faultStatus" placeholder="设备状态">
                        <el-option label="请选择..." value=""></el-option>
                        <el-option label="正常" value="0"></el-option>
                        <el-option label="异常" value="1"></el-option>
                        <el-option label="故障" value="2"></el-option>
                        
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>

                <el-col :span="4">
                  <div class="grid-content bg-purple">

                    <el-button @click="searchCustomer" type="primary">查询</el-button>

                  </div>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-col>
        <el-col :span="12" v-if="roleId !='agent' && roleId !='customer'">
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
            <span class="btn-span" @click="activateService">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-jihuo"></use>
                </svg><span>激活</span>
            </span>
            <span class="btn-span" @click="stopService">
              <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-dongjie"></use>
              </svg>停止
            </span>
            <!--导入功能-->
            <upload-excel @on-selected-file='selected' @getdata="getData"></upload-excel>
            <a class="btn-span" href="static/template/设备导入模板.xlsx">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-xiazai"></use>
              </svg>模板
            </a>

          </div>
        </el-col>
      </el-row>
      <div class="table-box">
        <el-table :data="tableData" stripe style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
          <!--更多信息-->
          <el-table-column type="expand">
            <template scope="props">
              <el-form label-position="left" inline class="demo-table-expand" label-width="90px">
                <el-form-item label="质保到期日">
                  <span>{{ props.row.warrantyExpiryDate }}</span>
                </el-form-item>
                <el-form-item label="板卡编号">
                  <span>{{ props.row.dacId }}</span>
                </el-form-item>
                <el-form-item label="客户名称">
                  <span>{{ props.row.customerName }}</span>
                </el-form-item>
                <el-form-item label="电池规格">
                  <span>{{ props.row.batterySpec }}</span>
                </el-form-item>
                <el-form-item label="交付日期">
                  <span>{{ props.row.deliveryDate }}</span>
                </el-form-item>
                <el-form-item label="单程长度">
                  <span>{{ props.row.coverageSize }}</span>
                </el-form-item>
                <el-form-item label="修改时间">
                  <span>{{ props.row.updateDate }}</span>
                </el-form-item>
                <el-form-item label="修改人">
                  <span>{{ props.row.updateUserName }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column type="selection" width="50" :selectable="checkSelectable"></el-table-column>
          <el-table-column prop="id" label="设备编号" min-width="100">
          </el-table-column>
          <el-table-column prop="modelName" label="设备型号" min-width="100">
          </el-table-column>
          <el-table-column prop="areaName" label="所属区域" min-width="100">
          </el-table-column>
          <el-table-column prop="agentName" label="所属代理商" min-width="100">
          </el-table-column>
          <el-table-column prop="customerName" label="所属客户" min-width="100">
          </el-table-column>
          <!--<el-table-column prop="warrantyExpiryDate" label="质保到期日" min-width="100">
          </el-table-column>-->
          <el-table-column prop="status" label="安装状态" min-width="100">
            <template scope="scope">
              <!--<span v-if="scope.row.installStatus=='1'" style="color: #409EFF">已安装</span>-->
              <el-button  v-if="scope.row.installStatus=='1'" @click="examine(scope.$index, scope.row)" type="text">已安装<i class="el-icon-picture el-icon--right"></i></el-button>
              <span v-else style="color: #FA5555">未安装</span>
            </template>
          </el-table-column>
          </el-table-column>
          <el-table-column prop="active" label="服务状态" min-width="95">
            <template scope="scope">
              <span v-if="scope.row.active=='1'" style="color: #409EFF">激活</span>
              <span v-else style="color: #FA5555">停止</span>
            </template>
          </el-table-column>
          <el-table-column prop="runningStatus" label="运行状态" min-width="95">
            <template scope="scope">
              <span v-if="scope.row.runningStatus=='1'" style="color: #409EFF">已连接</span>
              <span v-else style="color: #FA5555">未连接</span>
            </template>
          </el-table-column>
          <el-table-column label="设备状态" min-width="95">
            <template scope="scope">
              <span v-if="scope.row.faultStatus=='0'" style="color: #409EFF">正常</span>
              <span v-else-if="scope.row.faultStatus=='1'" style="color: #E6A23C">异常</span>
              <span v-else="scope.row.faultStatus=='2'" style="color: #FA5555">故障</span>
            </template>
          </el-table-column>
          <el-table-column prop="maintainStatus" label="维护状态" min-width="95">
            <template scope="scope">
              <span v-if="scope.row.maintainStatus=='0'" style="color: #409EFF">正常</span>
              <span v-if="scope.row.maintainStatus=='1'" style="color: #409EFF">报修中</span>
              <span v-if="scope.row.maintainStatus=='2'" style="color: #FA5555">维修中</span>
            </template>
          </el-table-column>
          <el-table-column label="服务控制" min-width="240" v-if="roleId !='agent'">
            <template scope="scope">
              <el-button  @click="clear(scope.$index, scope.row)" type="primary" plain size="small">清扫</el-button>
              <el-button  @click="stop(scope.$index, scope.row)" type="danger" plain size="small">停止</el-button>
              <el-button @click="reset(scope.$index, scope.row)" type="warning" plain size="small">复位</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="170" v-if="roleId !='agent'">
            <template scope="scope">
              <el-button @click="monitoredParameters(scope.$index, scope.row)" size="small">检测参数</el-button>
              <el-button @click="handleEdit(scope.$index, scope.row)" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination @size-change="handleSizeChange" :page-sizes="[10,15, 20, 30, 999, 9999]" :page-size="page_size" @current-change="handleCurrentChange" layout="sizes, prev, pager, next" :total="totalCount">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import uploadExcel from '../common/uploadExcel.vue'
  export default {
    components: {
      uploadExcel
    },
    data() {
      return {
        url: {
          deviceList: 'api/admin/device',
          customerList: 'api/admin/customer', //客户列表
          deviceModel: 'api/admin/deviceModel', //设备型号列表
          agentList: 'api/admin/agent', //代理商列表
          areaList: 'api/admin/area', //区域列表
          command: 'api/admin/devices/command', //控制指令
          installRecord: 'api/admin/installRecord', //安装记录
        },
        rules: {
          id: [{
            required: true,
            message: '设备编号不能为空',
            trigger: 'blur'
          }, ],
          dacId: [{
            required: true,
            message: '板卡编号不能为空',
            trigger: 'blur'
          }, ],
          modelId: [{
            required: true,
            message: '设备型号不能为空',
            trigger: 'blur'
          }, ],
          customerId: [{
            required: true,
            message: '所属客户不能为空',
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
        options1: [],//停止设备服务参数
        customer: [], //客户列表容器
        deviceModel: [], //设备型号容器
        agent: [], //代理商容器
        area: [], //区域列表容器
        tableData: [],
        tableHeader: [],
        isDisabled: false,
        cur_page: 1,
        page_size: 10,
        totalCount: 1,
        multipleSelection: [], //选择容器
        dialogTitle: '新增设备',
        dialogFormVisible: false,//增删弹窗
        dialogFormVisible1: false,//已安装图片
        dialogFormVisible2: false,//检测参数
        labelPosition: 'top',
        searchParams:{},
        imageList: [],//已安装图片容器
        form: {
          id: '', //设备编号 必填
          dacId: '', //模块id 必填
          modelId: '', //型号id 必填
          customerId: '', //客户id 必填
          //        agentId: '', //代理商id 选填
          areaId: '', //区域id 选填
          batterySpec: '', //电池规格 选填
          warrantyExpiryDate: '', //质保到期日 选填
          deliveryDate: '', //交付日期 选填
          //        coverageSize:'',//单程长度
        },
        formLabelAlign: {
          id__blk: '',
          customerName__blk: '',
          faultStatus: '',
        },
        roleId: '', //角色类型
      };
    },
    mounted() {
      this.roleId = JSON.parse(sessionStorage.getItem('spaceflight_role')).id;
      this.getData();
    },
    
    methods: {
      examine(index, row) { //查看已安装照片
        this.$axios.get(this.url.installRecord+'/'+row.id,{
          headers: { //get添加请求头
            'Auth-Token': sessionStorage.getItem('spaceflight_token')
          }
        }).then((res)=>{
          console.log(res.data)
          if(res.data.success){
            if(res.data.data.installImages && res.data.data.installImages.length>0){
              this.imageList = res.data.data.installImages
          this.dialogFormVisible1 = true;
            }else {
              this.$message.warning("暂无安装照片")
            }
          }else {
            this.$message.error(res.data.message)
          }
        })
      },
      activateService(){//批量激活服务
        if(this.multipleSelection.length > 0) {
          let params = [];
          for(let i in this.multipleSelection) {
            params[i] = this.multipleSelection[i].id
          }
          this.$axios.post(this.url.command, {
          params: {
            id__in: params,
            command:'active', //控制类型 必填 激活服务-active，停止服务-deactive，发送指令-control
          }
          
        },{
          headers: { //get添加请求头
            'Auth-Token': sessionStorage.getItem('spaceflight_token')
          }
        }).then((res)=>{
          if(res.data.success){
            this.$message.success("操作成功")
            this.getData();
          }else {
            this.$message.error("操作失败")
          }
        })
        } else {
          this.$message.error("请至少选择一台要激活服务的设备")
        }
      },
      stopService(){//批量停止服务
        if(this.multipleSelection.length > 0) {

          for(let i in this.multipleSelection) {
            this.options1[i] = this.multipleSelection[i].id
          }
          console.log(this.options)

          this.open3();
        } else {
          this.$message.error("请至少选择一台要停止服务的设备")
        }
      },
      open3() { //删除前提示
        this.$confirm('此操作将停止选中设备的服务, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'

        }).then(() => {

          this.$axios({
            method: 'post',
            url: this.url.command,
            data: {
              params: {
                id__in: this.options1,
                command:'deactive', //控制类型 必填 激活服务-active，停止服务-deactive，发送指令-control
              },
            },
            headers: { //get添加请求头
              'Auth-Token': sessionStorage.getItem('spaceflight_token')
            }
          }).then((res) => {
            if(res.data.success) {
              this.$message({
                type: 'success',
                message: '操作成功!'
              });
              this.getData();
            } else {
              this.$message.error("操作失败")
            }

          });

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      clear(index, row) {
        console.log(row)
        this.$axios.post(this.url.command, {
          params: {
            id__in: [
              row.id
            ],
            command:'control', //控制类型 必填 激活服务-active，停止服务-deactive，发送指令-control
            ruleId: 4 //指令id 在command=control时必填 清扫-4，暂停-5，继续-6，退回-7
          }
          
        },{
          headers: { //get添加请求头
            'Auth-Token': sessionStorage.getItem('spaceflight_token')
          }
        }).then((res)=>{
          console.log(res.data.data)
          if(res.data.success){
            this.$message.success("操作成功")
          }
        })
      },
      stop(index, row) {
        this.$axios.post(this.url.command, {
          params: {
            id__in: [
              row.id
            ],
            command:'control', //控制类型 必填 激活服务-active，停止服务-deactive，发送指令-control
            ruleId: 5 //指令id 在command=control时必填 清扫-4，暂停-5，继续-6，退回-7
          }
          
        },{
          headers: { //get添加请求头
            'Auth-Token': sessionStorage.getItem('spaceflight_token')
          }
        }).then((res)=>{
          console.log(res.data.data)
          if(res.data.success){
            this.$message.success("操作成功")
          }
        })
      },
      reset(index, row) {
        this.$axios.post(this.url.command, {
          params: {
            id__in: [
              row.id
            ],
            command:'control', //控制类型 必填 激活服务-active，停止服务-deactive，发送指令-control
            ruleId: 7 //指令id 在command=control时必填 清扫-4，暂停-5，继续-6，退回-7
          }
          
        },{
          headers: { //get添加请求头
            'Auth-Token': sessionStorage.getItem('spaceflight_token')
          }
        }).then((res)=>{
          console.log(res.data.data)
          if(res.data.success){
            this.$message.success("操作成功")
          }
        })
      },        
      monitoredParameters(index, row) {//查看检测参数
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
            console.log('544',this.fieldList)
            this.dialogFormVisible2 = true
          } else {
            this.$message.warning("未获取到当前设备的检测参数")
          }

        })
      },
      checkSelectable(row, index) { //表格多选选择性不可选
        //通过id来禁止不能选择的项
        // return row.id !== 1
        //通过索引index来禁止不能选择的项
        return this.roleId != 'customer' && this.roleId != 'agent'
      },
      searchCustomer() {
        this.searchParams = {};
        for(let key in this.formLabelAlign) {
          if(this.formLabelAlign[key]) {
            if(key === "faultStatus"){
              this.searchParams[key] = this.formLabelAlign[key]-0
            }else {
              this.searchParams[key] = this.formLabelAlign[key]
            }
            
          }
        }
        this.getData(this.searchParams)
      },
      submitDialog(formName) {
        this.$refs[formName].validate((valid) => {
          if(valid) {
            if(this.dialogTitle === '新增设备') {
              this.checkAddDeviceModel(formName)
            } else {
              this.checkUpdateDeviceModel()
            }
          }
        })
      },
      checkUpdateDeviceModel() {
        this.$axios.put(this.url.deviceList + '/' + this.modelId, {
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
        this.$axios.post(this.url.deviceList, {
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
      addDeviceModel() { //??????
        this.dialogTitle = '新增设备';
        this.isDisabled = false;
        this.dialogFormVisible = true;
        this.form = { //弹出框数据容器
          id: '', //设备编号 必填
          dacId: '', //模块id 必填
          modelId: '', //型号id 必填
          customerId: '', //客户id 必填
          //            agentId: '', //代理商id 选填
          areaId: '', //区域id 选填
          batterySpec: '', //电池规格 选填
          warrantyExpiryDate: '', //质保到期日 选填
          deliveryDate: '', //交付日期 选填
          //            coverageSize:'',//单程长度
        }
        if(JSON.stringify(this.customer) === '[]') {
          this.getList();
        }
      },
      handleEdit(index, row) {
        console.log(row)
        this.dialogTitle = '编辑设备';
        this.isDisabled = true;
        this.dialogFormVisible = true;
        this.modelId = row.id
        if(JSON.stringify(this.customer) === '[]') {
          this.getList(() => {
            this.form = { //弹出框数据容器 
              id: row.id, //设备编号 必填
              dacId: row.dacId, //模块id 必填
              modelId: row.modelId, //型号id 必填
              customerId: row.customerId, //客户id 必填
              //            agentId: row.agentId, //代理商id 选填
              areaId: row.areaId, //区域id 选填
              batterySpec: row.batterySpec, //电池规格 选填
              warrantyExpiryDate: row.warrantyExpiryDate, //质保到期日 选填
              deliveryDate: row.deliveryDate, //交付日期 选填
              //            coverageSize:row.coverageSize,//单程长度
            }
          });
        } else {
          this.form = { //弹出框数据容器 
            id: row.id, //设备编号 必填
            dacId: row.dacId, //模块id 必填
            modelId: row.modelId, //型号id 必填
            customerId: row.customerId, //客户id 必填
            //            agentId: row.agentId, //代理商id 选填
            areaId: row.areaId, //区域id 选填
            batterySpec: row.batterySpec, //电池规格 选填
            warrantyExpiryDate: row.warrantyExpiryDate, //质保到期日 选填
            deliveryDate: row.deliveryDate, //交付日期 选填
            //            coverageSize:row.coverageSize,//单程长度
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

        self.$axios.get(self.url.deviceList, {
          params: {
            params:v,
            pageIndex: self.cur_page - 1,
            pageSize: self.page_size,
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

      getList(callback) { //获取增改下拉列表
        let self = this;

        function getCustomer() {
          return self.$axios.get(self.url.customerList, {
            headers: { //get添加请求头
              'Auth-Token': sessionStorage.getItem('spaceflight_token')
            }
          });
        }

        function getDeviceModel() {
          return self.$axios.get(self.url.deviceModel, {
            headers: { //get添加请求头
              'Auth-Token': sessionStorage.getItem('spaceflight_token')
            }
          });
        }

        function getAgent() {
          return self.$axios.get(self.url.agentList, {
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

        self.$axios.all([getCustomer(), getDeviceModel(), getAgent(), getArea()])
          .then(self.$axios.spread((customer, deviceModel, agent, area) => {
            // 两个请求现在都执行完成
            console.log('area', area.data.data)
            self.customer = customer.data.data
            self.deviceModel = deviceModel.data.data
            self.agent = agent.data.data
            self.area = area.data.data
            if(callback) {
              callback()
            }
          }));
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
            url: this.url.deviceList + 's',
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
      /*exportTable() {//导出表格
        let columns = this.$refs.multipleTable.$children.filter(t => t.prop != null)
        const fields = columns.map(t => t.prop)
        const fieldNames = columns.map(t => t.label)
        CsvExport(this.tableData, fields, fieldNames, '设备列表')
      },*/
      /*handleDownload() {
        this.downloadLoading = true
        require.ensure([], () => {
          const {
            export_json_to_excel
          } = require('../../utils/Export2Excel')
          const tHeader = ['设备型号', '设备编号', 'LORA编号', '区域名称', '代理商', '所属客户', '运行状态', '交付日期', '质保到期日', '修改时间', '修改人']
          const filterVal = ['code', 'name', 'address', 'linkMan', 'contact', 'agency', 'server', 'serverContact', 'changeTime', 'status', 'changeMan']
          //        const tHeader = ['序号', '文章标题', '作者', '阅读数', '发布时间']
          //        const filterVal = ['id', 'title', 'author', 'pageviews', 'display_time']
          const list = this.data
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, '列表excel')
          this.downloadLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if(j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      },*/
      handleSelectionChange(val) {
        console.log(val)
        this.multipleSelection = val;
      },
      selected(data) {
        this.tableData = data.results
        this.tableHeader = data.header
        console.log(this.tableData)
      }
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
  /*详细信息*/
  
  .demo-table-expand {
    font-size: 0;
    color: #1D8CE0;
  }
  
  .demo-table-expand label {
    color: #99a9bf !important;
  }
  
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 33.33%;
  }
  
  .el-table__expanded-cell .demo-table-expand .el-form--inline .el-form-item__label {
    color: #99a9bf !important;
  }
  
  a {
    color: #333;
  }
  .image-box .el-dialog__body .image-wrap {
    height: 100%;
  }
</style>