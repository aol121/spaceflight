<template>
  <div class="out-box">
    <!--弹出对话框 Begin-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :label-position="labelPosition" ref="form" :rule="rules" label-width="80px" :model="form">
        <el-row>
          <el-col :span="20" :offset="2">
            <div class="grid-content bg-purle">
              <el-form-item label="选择维修人员" prop="maintainStaff">
                <el-select v-model="form.maintainStaff" placeholder="维修人员" prop="maintainStaff">
                  <el-option v-for="customerservice in maintainStaffList" :label="customerservice.name" :value="customerservice.id"></el-option>
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

    <!--维修图片弹出对话框 Begin-->
    <el-dialog class="image-box" title="维修图片" :visible.sync="dialogFormVisible1">

      <el-carousel :interval="5000" arrow="always">
        <el-carousel-item v-for="item in imageList">
          <!--<h3>{{ item }}</h3>-->
          <div class="image-wrap" :style="'background:url('+item.visitPathFull+') no-repeat center center;backgroundSize:contain'">
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

    <div class="body-box">
      <el-row class="row-box">
        <el-col :span="15">
          <div class="grid-content bg-purple">
            <el-form label-position="top" label-width="80px" :model="formLabelAlign" ref="formLabelAlign">
              <el-row :gutter="10" class="from-row">
                <el-col :span="6">
                  <div class="grid-content bg-purple">
                    <el-form-item label="维修状态">
                      <el-select v-model="formLabelAlign.status" placeholder="请选择状态">
                        <el-option label="请选择..." value=""></el-option>
                        <el-option label="报修中" value="0"></el-option>
                        <el-option label="维修中" value="1"></el-option>
                        <el-option label="已完成" value="2"></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="grid-content bg-purple">
                    <el-form-item label="订单编号">
                      <el-input placeholder="输入订单编号" v-model="formLabelAlign.id__blk"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="grid-content bg-purple">
                    <el-form-item label="设备编号">
                      <el-input placeholder="输入设备编号" v-model="formLabelAlign.deviceId__blk"></el-input>
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
        <el-col :span="9" v-if="roleId !='customer'">
          <div class="grid-content bg-purple btn-box">

            <span class="btn-span" @click="acceptance">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-shouli"></use>
                </svg><span>受理</span>
            </span>
            <span class="btn-span" @click="termination">
              <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-zhongzhi"></use>
              </svg>终止
            </span>

          </div>
        </el-col>
      </el-row>
      <div class="table-box">
        <el-table :data="tableData" stripe style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">

          <el-table-column type="expand">
            <template scope="props">
              <el-form label-position="left" inline class="demo-table-expand" label-width="100px">
                <el-form-item label="订单编号">
                  <span>{{ props.row.id }}</span>
                </el-form-item>
                <el-form-item label="设备型号">
                  <span>{{ props.row.deviceModelName }}</span>
                </el-form-item>
                <el-form-item label="所属客户">
                  <span>{{ props.row.customerName }}</span>
                </el-form-item>
                <el-form-item label="所属客户">
                  <span>{{ props.row.agentName }}</span>
                </el-form-item>
                <el-form-item label="设备区域">
                  <span>{{ props.row.deviceAreaName }}</span>
                </el-form-item>
                <el-form-item label="报修类型">
                  <span>{{ props.row.applyType }}</span>
                </el-form-item>
                <el-form-item label="故障描述">
                  <span>{{ props.row.applyContent }}</span>
                </el-form-item>
                <el-form-item label="联系人姓名">
                  <span>{{ props.row.applyPerson }}</span>
                </el-form-item>
                <el-form-item label="联系方式">
                  <span>{{ props.row.applyMobile }}</span>
                </el-form-item>
                <el-form-item label="维修状态">
                  <span>{{ props.row.status==0?'报修中':(props.row.status==1?'维修中':'已完成') }}</span>
                </el-form-item>
                <el-form-item label="维修下单时间">
                  <span>{{ props.row.createDate }}</span>
                </el-form-item>
                <el-form-item label="维修完成时间">
                  <span>{{ props.row.updateDate }}</span>
                </el-form-item>
                <el-form-item label="维修人员">
                  <span>{{ props.row.maintainStaffName }}</span>
                </el-form-item>
                <el-form-item label="组件编号">
                  <span v-if="props.row.repairComponents && props.row.repairComponents.length>0">{{ props.row.repairComponents.id }}</span>
                </el-form-item>
                <el-form-item label="维修数量">
                  <span v-if="props.row.repairComponents && props.row.repairComponents.length>0">{{ props.row.repairComponents.quality }}</span>
                </el-form-item>
                <el-form-item label="维修结果">
                  <span>{{ props.row.repairResult }}</span>
                </el-form-item>
                <el-form-item label="用户评价">
                  <span>{{ props.row.review }}</span>
                </el-form-item>

              </el-form>
            </template>
          </el-table-column>
          <el-table-column type="selection" width="55"></el-table-column>
          <!--<el-table-column prop="id" label="订单编号" min-width="100">
          </el-table-column>-->
          <el-table-column prop="deviceId" label="设备编号" min-width="100">
          </el-table-column>
          <el-table-column prop="customerName" label="所属客户" min-width="100">
          </el-table-column>
          <el-table-column prop="agentName" label="所属代理" min-width="100">
          </el-table-column>
          <el-table-column prop="applyType" label="报修类型" min-width="100">
          </el-table-column>
          <el-table-column prop="status" label="维修状态" min-width="100">
            <template scope="scope">
              <span v-if="scope.row.status=='2'" style="color: ##67C23A">已完成</span>
              <span v-else-if="scope.row.status=='1'" style="color: ##409EFF">维修中</span>
              <span v-else-if="scope.row.status=='0'" style="color: #FA5555">报修中</span>
            </template>
          </el-table-column>
          <el-table-column prop="maintainStaffName" label="维修人员" min-width="100">
          </el-table-column>
          <el-table-column prop="repairResult" label="维修结果" min-width="100">
          </el-table-column>
          <el-table-column label="维修照片" width="80">
            <template scope="scope">

              <el-button @click="examine(scope.$index, scope.row)" plain size="small">查看</el-button>
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
  /*import {getData} from 'src/utils/commonFn'*/
  export default {
    name:'vue',
    data() {
      return {
        url: {
          maintainOrderList: 'api/admin/maintainOrder',
          maintainStaffList: 'api/admin/maintainStaff'
        },
        rules: {
          maintainStaff: [{
            required: true,
            message: '维修人员不能为空',
          }, ],
        },
        isSearch:false,
        options:[],//终止
        tableData: [],
        isDisabled: false,
        cur_page: 1,
        page_size: 10,
        totalCount: 18,
        multipleSelection: [], //选择容器
        maintainStaffList: [], //维修人员列表
        imageList: [],
        dialogTitle: '受理订单',
        dialogFormVisible: false,
        dialogFormVisible1: false,
        labelPosition: 'top',
        searchParams:{},
        form: {
          maintainStaff: '',

        },
        formLabelAlign: {
          status: null,
          id__blk:'',
          deviceId__blk:'',
        },
        roleId: '', //角色类型
      };
    },
    mounted() {
      this.roleId = JSON.parse(sessionStorage.getItem('spaceflight_role')).id;
      this.getData();

    },

    methods: {
      search(){//查询
        this.searchParams = {};
        for(let key in this.formLabelAlign) {
          if(this.formLabelAlign[key]) {
            if(key =="status"){
              this.searchParams[key] = this.formLabelAlign[key]-0
            }else {
              this.searchParams[key] = this.formLabelAlign[key]
            }
            
          }
        }
        this.getData(this.searchParams)

      },
      examine(index, row) { //查看维修照片
        if(row.applyImages && row.applyImages.length > 0) {
          //        alert(1)
          this.imageList = row.applyImages
          this.dialogFormVisible1 = true;
        } else {
          this.$message.warning("暂无维修照片")
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
        self.$axios.get(self.url.maintainOrderList, {
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
      submitDialog(formName) { //确定提交受理
        this.$refs[formName].validate((valid) => {
          if(valid) {
            let params = []
            for(let i in this.multipleSelection) {
              params[i] = this.multipleSelection[i].id
            }
            this.$axios({
              method: 'put',
              url: this.url.maintainOrderList + 's',
              data: {
                method: 'distribute',
                params: {
                  id__in: params,
                  maintainStaffId: this.form.maintainStaff,
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
                this.dialogFormVisible = false;
              } else {
                this.$message.error(res.data.message)
              }
            });
          }
        })

      },
      acceptance() { //受理
        if(this.multipleSelection.length > 0) {
          this.dialogFormVisible = true
          this.$axios.get(this.url.maintainStaffList,{
            headers: { //get添加请求头
                'Auth-Token': sessionStorage.getItem('spaceflight_token')
              }
          }).then((res)=>{
            if(res.data.success) {
                this.maintainStaffList = res.data.data
                console.log("334",res.data)
              } else {
                this.$message.error(res.data.message)
              }
          })
        } else {
          this.$message.error("请至少选择一项要受理的订单")
        }
      },
      termination() { //终止
        if(this.multipleSelection.length > 0) {
          //        this.open2(this.multipleSelection[0].id);
          for(let i in this.multipleSelection) {
            this.options[i] = this.multipleSelection[i].id
          }
          this.open2();

        } else {
          this.$message.error("请至少选择一项要删除的订单")
        }
      },
      open2() { //删除前提示
        this.$confirm('此操作将终止选中的订单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios({
            method: 'put',
            url: this.url.maintainOrderList + 's',
            data: {
              method: 'terminate',
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
                message: '操作成功!'
              });
              this.getData();
            } else {
              this.$message.error(res.data.message)
            }

          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
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
  
  .image-box .el-dialog__body .image-wrap {
    height: 100%;
  }
</style>