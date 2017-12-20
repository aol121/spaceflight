<template>
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
      url:'api/admin/record/praiseRate',
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
            this.chartData = res.data;
            this.chartData.title = "好评率"
            this.flag = true;
            console.log(res.data)
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
</style>