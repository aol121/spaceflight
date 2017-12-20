<template>
  <div class="out-box">
   
    <div class="body-box">
      <h3>菜单权限与账号登录权限</h3>
      <div class="table-box">
        <el-table :data="tableData" stripe style="width: 100%" :height="height" ref="multipleTable">
          <el-table-column prop="access" label="权限\角色" min-width="100">
          </el-table-column>
          <el-table-column prop="admin" label="公司管理员" min-width="100">
          </el-table-column>
          <el-table-column prop="agent" label="代理商" min-width="100">
          </el-table-column>
          <el-table-column prop="service" label="客服" min-width="100">
          </el-table-column>
          <el-table-column prop="customer" label="客户" min-width="120">
          </el-table-column>
          <el-table-column prop="repairman" label="维修人员" min-width="120">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        height:550,
        tableData: [
          {
            access:'账号登陆权限',
            admin:'后台+APP',
            agent:'后台',
            service:'后台',
            customer:'后台+APP',
            repairman:'APP',
          },
          {
            access:'客户管理',
            admin:'✔',
            agent:'✔',
            service:'✔',
            customer:'',
            repairman:'',
          },
          {
            access:'代理商管理',
            admin:'✔',
            agent:'',
            service:'',
            customer:'',
            repairman:'',
          },
          {
            access:'设备品类管理',
            admin:'✔',
            agent:'',
            service:'',
            customer:'',
            repairman:'',
          },
          {
            access:'设备型号管理',
            admin:'✔',
            agent:'',
            service:'',
            customer:'',
            repairman:'',
          },
          {
            access:'模式预设',
            admin:'✔',
            agent:'',
            service:'',
            customer:'✔',
            repairman:'',
          },
          {
            access:'模式预设',
            admin:'✔',
            agent:'',
            service:'',
            customer:'✔',
            repairman:'',
          },
          {
            access:'区域设置',
            admin:'✔',
            agent:'✔',
            service:'',
            customer:'✔',
            repairman:'',
          },
          {
            access:'模式下发',
            admin:'✔',
            agent:'',
            service:'',
            customer:'✔',
            repairman:'',
          },
          {
            access:'电控管理设备',
            admin:'✔',
            agent:'',
            service:'',
            customer:'✔',
            repairman:'',
          },
          {
            access:'设备管理',
            admin:'✔',
            agent:'✔',
            service:'',
            customer:'✔',
            repairman:'',
          },
          {
            access:'维修人员管理',
            admin:'✔',
            agent:'',
            service:'',
            customer:'',
            repairman:'',
          },
          {
            access:'维修订单',
            admin:'✔',
            agent:'',
            service:'✔',
            customer:'✔',
            repairman:'',
          },
          {
            access:'用户管理',
            admin:'✔',
            agent:'✔',
            service:'✔',
            customer:'',
            repairman:'',
          },
          {
            access:'统计分析',
            admin:'✔',
            agent:'✔',
            service:'',
            customer:'✔',
            repairman:'',
          },
          {
            access:'知识库',
            admin:'✔',
            agent:'',
            service:'',
            customer:'',
            repairman:'',
          },
          {
            access:'banner管理',
            admin:'✔',
            agent:'',
            service:'',
            customer:'',
            repairman:'',
          },
          {
            access:'公告管理',
            admin:'✔',
            agent:'',
            service:'',
            customer:'',
            repairman:'',
          },
        ],
      };
    },
    created() {
     
    },
    /*computed: {
      data() {
        const self = this;
        return self.tableData
      }
    },*/
   
  }
</script>

<style scoped="scoped">
  h3 {
    line-height:50px;
    text-align: center;
    border-bottom: 1px solid #e1e4e6;
  } 
  .out-box {
    height: 100%;
  }
  
  .body-box {
    overflow: auto;
  }
  
  
  .table-box {
    padding: 0 20px;
  }
  
</style>