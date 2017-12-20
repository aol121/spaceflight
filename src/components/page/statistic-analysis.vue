<template>
  <div class="box">
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="grid-content bg-purple" ref="abc">
          <schart canvasId="bar" :width="width" height="400" :data="data1" type="bar" :options="options1"></schart>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <schart canvasId="bar1" :width="width" height="400" :data="data1" type="bar" :options="options1"></schart>
        </div>
      </el-col>
      
    </el-row>
  </div>
</template>

<script>
  import Schart from 'vue-schart';
  export default {
    components: {
      Schart
    },
    data: () => ({
      width: 500,
      data1: [{
          name: '设备1',
          value: 1141
        },
        {
          name: '设备2',
          value: 1499
        },
        {
          name: '设备3',
          value: 2260
        },
        {
          name: '设备4',
          value: 1170
        },
        {
          name: '设备5',
          value: 970
        },
        {
          name: '设备6',
          value: 1450
        },
        {
          name: '设备7',
          value: 1460
        },
        {
          name: '设备8',
          value: 1470
        },
        {
          name: '设备9',
          value: 1480
        },
        {
          name: '设备10',
          value: 1490
        },
        {
          name: '设备11',
          value: 1550
        },
        {
          name: '设备12',
          value: 1350
        },
        {
          name: '设备13',
          value: 1350
        },
      ],

      options1: {
        title: '设备型号数量统计',
        bgColor: '#fff',
        titleColor: '#333',
        fillColor: '#1D8CE0',
        fillColor: '#1D8CE0',
        axisColor: '#666',
        contentColor: '#f1f3f5'
      },

    }),
    mounted() {
      this.width = this.$refs.abc.getBoundingClientRect().width;
      console.log(this.$refs.abc.getBoundingClientRect().width)

    }
  }
</script>

<style scoped="scoped">
  .box {
    width: 100%;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
  }
  
  .schart {
    width: 100%;
    height: 100%;
    text-align: center;
  }
</style>