<template>
  <div class="components-container" style='height:100%'>
    <el-row class="row-box">
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <el-form label-position="top" label-width="80px" :model="formLabelAlign" ref="formLabelAlign">
            <el-row :gutter="10" class="from-row">
              <el-col :span="7">
                <div class="grid-content bg-purple">
                  <el-form-item label="年份">
                    <el-input placeholder="输入年份" @change="(v)=>{formLabelAlign.year = isNaN(v)? '':v}" v-model.number="formLabelAlign.year"></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="7">
                <div class="grid-content bg-purple">
                  <el-form-item label="电量值">
                    <el-input @change="(v)=>{formLabelAlign.electricity = isNaN(v)? '':v}" placeholder="电量值" v-model.number="formLabelAlign.electricity"></el-input>
                  </el-form-item>
                </div>
              </el-col>

              <el-col :span="4">
                <div class="grid-content bg-purple" style="padding-top:34px;">

                  <el-button @click="save" type="primary">保存</el-button>

                </div>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-col>
      <!--<el-col :span="12" >
        <div class="" style="padding-top:44px;color:#F56C6C;">
        	注：电量值为负数时为删除所填年份，为非负数（>=0）时为增加一条数据
        </div>
                              
      </el-col>-->
    </el-row>
    <div class='chart-container'>
      <mix-chart :chart-data="chartData" v-if="flag" height='100%' width='100%'></mix-chart>
    </div>
  </div>
</template>

<script>
  import mixChart from '@/components/common/charts'

  export default {
    components: {
      mixChart
    },
    data() {

      return {
        url: 'api/admin/record/electricity',
        flag: false,
        chartData: {},
        formLabelAlign: {
          year: '',
          electricity: '',
        },
      }
    },
    mounted() {
      this.getData()
    },
    methods: {
      save() {
        if(this.formLabelAlign.year && this.formLabelAlign.electricity) {
          console.log(this.formLabelAlign.year)
          if(this.formLabelAlign.year - 0 < 0 || this.formLabelAlign.electricity - 0 < 0) {
            this.$message.error("年份和电量值均不能为负数")
            return;
          } else {
            this.$confirm('此操作将增加一条数据,增加后只能修改‘电量值’不可修改‘年份’且不能删除‘年份’, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'

            }).then(() => {
              this.flag = false;
              this.$axios.post(this.url, {
                params: this.formLabelAlign
              }, {
                headers: { //post添加请求头
                  'Auth-Token': sessionStorage.getItem('spaceflight_token')
                }
              }).then((res) => {
                if(res.data.success) {
                  this.$message({
                    type: 'success',
                    message: '操作成功!'
                  });
                  this.formLabelAlign = {
                    year: '',
                    electricity: '',
                  };
                  this.getData();
                } else {
                  this.$message.error(res.data.message)
                }
              })

            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消操作'
              });
            });
          }

        } else {
          this.$message.error("请正确填写年份和电量")
        }
      },

      getData() {
        this.$axios.get(this.url, {
          headers: { //get添加请求头
            'Auth-Token': sessionStorage.getItem('spaceflight_token')
          }
        }).then((res) => {
          if(res.data.success) {
            this.chartData = res.data;
            this.chartData.title = "增发电量"
            this.flag = true;
            console.log('', res.data.data)
          } else if(res.data.code == 200) {
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
  .chart-container {
    position: relative;
    width: 100%;
    height: calc(100% - 107px);
    padding: 20px;
    box-sizing: border-box;
  }
  
  .row-box {
    padding: 10px 20px 0;
    border-bottom: 1px solid #e1e4e6;
  }
</style>