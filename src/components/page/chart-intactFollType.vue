<template>
  <el-table
    :data="tableData"
    border
    @cell-mouse-enter="handleMouseEnter"
    @cell-mouse-leave="handleMouseOut"
    style="width: 100%">
    <el-table-column
      label="日期"
      width="180">
      <template scope="scope">
      <span v-if="!scope.row.editFlag">{{ scope.row.name }}</span>
      <span v-if="scope.row.editFlag" class="cell-edit-input"><el-input v-model="inputColumn1" placeholder="请输入内容"></el-input></span>
      <span v-if="!scope.row.editFlag" style="margin-left:10px;" class="cell-icon"  @click="handleEdit(scope.row)">  <i class="el-icon-edit"></i> </span>
      <span v-if="scope.row.editFlag"  style="margin-left:10px;"  class="cell-icon"  @click="handleSave(scope.row)">  <i class="el-icon-document"></i> </span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default{


  data(){
    return {
      tableData:[
        {
          name:"test",
          editeFlage:false
        },
        {
          name:"test",
          editeFlage:false
        },
        {
          name:"test",
          editeFlage:false
        },
        {
          name:"test",
          editeFlage:false
        },
      ],
      inputColumn1:""//第一列的输入框
    }
  },
  methods:{
    handleEdit:function(row){
        //遍历数组改变editeFlag
    },
    handleSave:function(row){
        //保存数据，向后台取数据
    },
    handleMouseEnter:function(row, column, cell, event){

      cell.children[0].children[1].style.color="black";
    },
    handleMouseOut:function(row, column, cell, event){

      cell.children[0].children[1].style.color="#ffffff";
    }
  }
}

</script>

<style>
.cell-edit-input .el-input, .el-input__inner {
  width:100px;
}
.cell-icon{
  cursor:pointer;
  color:#fff;
}
</style>


<!--<template>
  <div class="components-container" style='height:100%'>
    <div class='chart-container'>
      <mix-chart :chart-data="chartData" v-if="flag" height='100%' width='100%'></mix-chart>
    </div>
  </div>
</template>

<script>
import mixChart from '@/components/common/charts'

export default {
  components: { mixChart },
  data(){
    
    return {
      url:'api/admin/record/integrityRateByModel',
      flag:false,
      chartData:{}
    }
  },
  mounted(){
    this.getData()
  },
  methods:{
    getData(){
      this.$axios.get(this.url,{
        headers: { //get添加请求头
            'Auth-Token': sessionStorage.getItem('spaceflight_token')
          }
      }).then((res)=>{
        if(res.data.success) {
            this.chartData = res.data.data;
            this.chartData.title = "完好率-按模块"
            this.flag = true;
            console.log(res.data.data)
          }else if(res.data.code==200){
            this.$router.push('/login')
          } else {
            this.$message.error(res.data.message)
          }
      })
    }
  }
  
}
</script>

<style scoped>
.chart-container{
  position: relative;
  width: 100%;
  height: 100%;
  padding:20px; 
  box-sizing:border-box;
}
</style>-->
  
  
