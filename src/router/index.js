import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/index',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children:[
                {
                    path: '/',
                    redirect: '/baseMess-client'
//                  component: resolve => require(['../components/page/baseMess-client.vue'], resolve)
                },
                
                {
                    path: '/baseMess-client',
                    component: resolve => require(['../components/page/baseMess-client'], resolve)    // 客户管理
                },
                {
                    path: '/baseMess-agent',
                    component: resolve => require(['../components/page/baseMess-agent'], resolve)    // 代理商管理
                },
                {
                    path: '/baseMess-deviceCategory',
                    component: resolve => require(['../components/page/baseMess-deviceCategory'], resolve)    // 设备品类管理
                },
                /*{
                    path: '/baseMess-deviceCategory-info',
                    component: resolve => require(['../components/page/deviceCategory-info'], resolve)    // 设备品类管理详情
                },*/
                {
                    path: '/baseMess-deviceType',
                    component: resolve => require(['../components/page/baseMess-deviceType'], resolve)    // 设备型号管理
                },
                {
                    path: '/baseMess-defaultMode',
                    component: resolve => require(['../components/page/baseMess-defaultMode'], resolve)    // 模式预设
                },
                {
                    path: '/device-areaSet',
                    component: resolve => require(['../components/page/device-areaSet'], resolve)    // 区域设置
                },
                {
                    path: '/device-device',
                    component: resolve => require(['../components/page/device-device'], resolve)    // 设备管理
                },
                {
                    path: '/device-modelIssued',
                    component: resolve => require(['../components/page/device-modelIssued'], resolve)    // 模式下发
                },
                {
                    path: '/device-electricalControlledDevice',
                    component: resolve => require(['../components/page/device-electricalControlledDevice'], resolve)    // 电控设备管理
                },
                {
                    path: '/repairs-maintenanceMan',
                    component: resolve => require(['../components/page/repairs-maintenanceMan'], resolve)    // 维修人员管理
                },
                {
                    path: '/repairs-maintenanceOrder',
                    component: resolve => require(['../components/page/repairs-maintenanceOrder'], resolve)    // 维修订单
                },
                {
                    path: '/APP-knowledgeBase',
                    component: resolve => require(['../components/page/APP-knowledgeBase'], resolve)    // 知识库
                },
                {
                    path: '/APP-advertisement',
                    component: resolve => require(['../components/page/APP-advertisement'], resolve)    // 广告管理
                },
                {
                    path: '/APP-notice',
                    component: resolve => require(['../components/page/APP-notice'], resolve)    // 公告管理
                },
                /*{
                    path: '/backgroundUser-role',
                    component: resolve => require(['../components/page/backgroundUser-role'], resolve)    // 角色管理
                },*/
                {
                    path: '/backgroundUser-user',
                    component: resolve => require(['../components/page/backgroundUser-user'], resolve)    // 用户管理
                },
                {
                    path: '/backgrounUser-accessConfig',
                    component: resolve => require(['../components/page/backgrounUser-accessConfig'], resolve)    // 权限配置
                },
                {
                    path: '/chart-maintain',
                    component: resolve => require(['../components/page/chart-maintain'], resolve)    // 统计分析、年度维修数量  
                },
                {
                    path: '/chart-customer',
                    component: resolve => require(['../components/page/chart-customer'], resolve)    // 统计分析、年度客户数量  
                },
                {
                    path: '/chart-agent',
                    component: resolve => require(['../components/page/chart-agent'], resolve)    // 统计分析、年度代理商数量  
                },
                {
                    path: '/chart-communication',
                    component: resolve => require(['../components/page/chart-communication'], resolve)    // 统计分析、通讯流量数  
                },
                {
                    path: '/chart-maintainMan',
                    component: resolve => require(['../components/page/chart-maintainMan'], resolve)    // 统计分析、年度维修人员数量  
                },
                {
                    path: '/chart-area',
                    component: resolve => require(['../components/page/chart-area'], resolve)    // 统计分析、年度区域数量  
                },
                {
                    path: '/chart-deviceType',
                    component: resolve => require(['../components/page/chart-deviceType'], resolve)    // 统计分析、设备型号数量  
                },
                {
                    path: '/chart-workHours',
                    component: resolve => require(['../components/page/chart-workHours'], resolve)    // 统计分析、工作总时  
                },
                {
                    path: '/chart-mileage',
                    component: resolve => require(['../components/page/chart-mileage'], resolve)    // 统计分析、里程数  
                },
                {
                    path: '/chart-increasesCapacity',
                    component: resolve => require(['../components/page/chart-increasesCapacity'], resolve)    // 统计分析、增发电量  
                },
                {
                    path: '/chart-intactByArea',
                    component: resolve => require(['../components/page/chart-intactByArea'], resolve)    // 统计分析、完好率(按区域)  
                },
                {
                    path: '/chart-intactByAgent',
                    component: resolve => require(['../components/page/chart-intactByAgent'], resolve)    // 统计分析、完好率(按代理商)  
                },
                {
                    path: '/chart-intactByModel',
                    component: resolve => require(['../components/page/chart-intactByModel'], resolve)    // 统计分析、完好率(按型号)  
                },
                {
                    path: '/chart-favorableRate',
                    component: resolve => require(['../components/page/chart-favorableRate'], resolve)    // 统计分析、好评率  
                },
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
    ]
})
