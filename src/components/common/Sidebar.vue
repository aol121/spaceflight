<template>

  <div class="sidebar">
    <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" unique-opened router>
      <template v-for="(item,index) in visible">
        <template v-if="item.subs" @click="changeIsActive($event.index)">
          <el-submenu :index="item.index"  :class="{active:isActive==index}">
            <template slot="title">
              <svg class="icon" aria-hidden="true">
                <use :xlink:href="item.icon"></use>
              </svg> {{ item.title }}
            </template>
            <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">- {{ subItem.title }}                        
            </el-menu-item> 
          </el-submenu>
        </template>        
        <template v-else>
          <el-menu-item :index="item.index">
            <svg class="icon" aria-hidden="true">
              <use :xlink:href="item.icon"></use>
            </svg> {{ item.title }}
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        url: {
          ownMess: 'api/auth/token/user',
        },
        isActive:null,
        items: [
          {
            icon: '#icon-baseMess-w',
            index: '1',
            title: '基础信息管理',
            subs: [{
                index: 'baseMess-client',
                title: '客户管理'
              },
              {
                index: 'baseMess-agent',
                title: '代理商管理'
              },
              {
                index: 'baseMess-deviceCategory',
                title: '设备品类管理'
              },
              {
                index: 'baseMess-deviceType',
                title: '设备型号管理'
              },
              {
                index: 'baseMess-defaultMode',
                title: '模式预设'
              },
            ]
          },
          {
            icon: '#icon-device-w',
            index: '2',
            title: '设备管理',
            subs: [{
                index: 'device-areaSet',
                title: '区域设置'
              },
              {
                index: 'device-device',
                title: '设备管理'
              },
              {
                index: 'device-modelIssued',
                title: '模式下发'
              },
              {
                index: 'device-electricalControlledDevice',
                title: '电控设备管理'
              },
            ]
          },
          {
            icon: '#icon-require-w1',
            index: '3',
            title: '报修管理',
            subs: [{
                index: 'repairs-maintenanceMan',
                title: '维修人员管理'
              },
              {
                index: 'repairs-maintenanceOrder',
                title: '维修订单'
              },
            ]
          },
          {
            icon: '#icon-app-w',
            index: '4',
            title: 'APP管理',
            subs: [{
                index: 'APP-knowledgeBase',
                title: '故障知识库'
              },
              {
                index: 'APP-advertisement',
                title: 'banner管理'
              },
              {
                index: 'APP-notice',
                title: '公告管理'
              },
            ]
          },
          {
            icon: '#icon-after-w',
            index: '5',
            title: '后台用户管理',
            subs: [
              {
                index: 'backgroundUser-user',
                title: '用户管理'
              },
              {
                index: 'backgrounUser-accessConfig',
                title: '角色权限'
              },
            ]
          },
          {
            icon: '#icon-statistic-w',
            index: '6',
            title: '统计分析',
            subs: [
              {
                index: 'chart-maintain',
                title: '年度维修数量'
              },
              {
                index: 'chart-customer',
                title: '年度客户数量'
              },
              {
                index: 'chart-agent',
                title: '年度代理商数量'
              },
              {
                index: 'chart-communication',
                title: '通讯流量数'
              },
              {
                index: 'chart-maintainMan',
                title: '年度维修人员数量'
              },
              {
                index: 'chart-area',
                title: '年度区域数量'
              },
              {
                index: 'chart-deviceType',
                title: '设备型号数量'
              },
              {
                index: 'chart-workHours',
                title: '工作总时'
              },
              {
                index: 'chart-mileage',
                title: '里程数'
              },
              {
                index: 'chart-increasesCapacity',
                title: '增发电量'
              },
              {
                index: 'chart-intactByArea',
                title: '完好率(按区域)'
              },
              {
                index: 'chart-intactByAgent',
                title: '完好率(按代理商)'
              },
              {
                index: 'chart-intactByModel',
                title: '完好率(按型号)'
              },

              {
                index: 'chart-favorableRate',
                title: '好评率'
              },
            ]
          },
 
        ],

      }
    },

    computed: {
      onRoutes() {
        return this.$route.path.replace('/', '');
      },
     visible(){
       let role = JSON.parse(sessionStorage.getItem('spaceflight_role'))
       if(!role) {//复制网址直接跳转登录页面
         this.$router.push('/login')
       }
          console.log("160,", role)
          if(!role.accessAll) { //非管理员

            let list = role.accessList
            let visible = [];//初步筛选出改用户可见列表
            let visible1 = []

            for(let key in list) {
              if(key.indexOf('admin/') > -1) {
                let a = key.replace('admin/', '')
                visible.push(a)
              }
            }
            console.log('222',visible)
            let a = null;
            for(let i in this.items) {
              for(let j in visible) {
                if(JSON.stringify(this.items[i]).indexOf(visible[j]) > -1) {
                  if(a != i) {
                    visible1.push(this.items[i])
                    a = i;
                  }
                  console.log(i)
                }
              }

            }
            console.log('236',visible1)
            for(let l in visible1) {
              let a1 = []
              for(let m in visible1[l].subs) {
                for(let n in visible) {
                  if(visible1[l].subs[m].index == visible[n]) {
                    a1.push(visible1[l].subs[m])
                  }
                }

              }
              visible1[l].subs = a1;
            }          
            return visible1
          }else {
            return this.items
          }        
     }     
    },
  }
</script>

<style scoped>
  .active {
    background-color: #fff;
  }
  .sidebar>.el-menu>li:last-of-type {
    font-size: 16px;
  }
  
  .sidebar {
    display: block;
    position: absolute;
    width: 240px;
    left: 0;
    top: 70px;
    bottom: 0;
  }
  
  .sidebar>ul {
    height: 100%;
    overflow: auto;
    padding:0px 20px 0;
    background:-webkit-linear-gradient(top,#11bcf8,#155eff);
    background:-moz-linear-gradient(top,#11bcf8,#155eff);
    background:-o-linear-gradient(top,#11bcf8,#155eff);
    background:-ms-linear-gradient(top,#11bcf8,#155eff);   
  }
  .icon {
    font-size: 22px;
    margin-right: 6px;
    margin-top: -3px;
  }
</style>