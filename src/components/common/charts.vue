<template>
  <div :class="className" :id="id" :style="{height:height,width:width}"></div>
</template>

<script>
  import echarts from 'echarts'

  export default {
    props: {
      className: {
        type: String,
        default: 'chart'
      },
      id: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '200px'
      },
      height: {
        type: String,
        default: '200px'
      },
      chartData: {
        type: Object,
        default: {}
      }
    },
    data() {
      return {
        chart: null
      }
    },
    mounted() {
      this.initChart()
      this.chart = null
    },
    beforeDestroy() {
      if(!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
    methods: {
      type(o) { //精确判断数据类型
        var s = Object.prototype.toString.call(o);
        return s.slice(s.indexOf(" ") + 1, s.length - 1).toLowerCase();
      },
      initChart() {
        console.log('53', this.chartData)
        console.log('54', this.type(this.chartData.data))

        this.chart = echarts.init(document.getElementById(this.id))
        let option = {
          title: {
            text: this.chartData.title,
            textStyle: {
              align: 'center'
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'none'
            }
          },
          xAxis: {
            type: 'category',
            //          data: x,
            axisLabel: {
              inside: false,
              textStyle: {
                color: '#333',
              }
            },
            axisTick: {
              show: true
            },
            axisLine: {
              show: true
            },
            z: 4
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              textStyle: {
                color: '#999'
              }
            }
          },
          dataZoom: [{
            type: 'inside',
          }]
        }
        if(this.type(this.chartData.data) === "array") { //单项柱状图
          let x = []
          let y = []
          for(let i in this.chartData.data) {
            if(this.chartData.data[i].value+1 && this.chartData.data[i].name) {
              
              y.push(this.chartData.data[i].value)
              x.push(this.chartData.data[i].name)
            }

          }
          option.xAxis.data = x
          option.series = [{
            type: 'bar',
            /*label: {
              normal: {
                show: true,
                position: 'top',
                color: '#333',
                verticalAlign: 'middle',

                distance: 10
              }
            },*/
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1, [{
                      offset: 0,
                      color: '#83bff6'
                    },
                    {
                      offset: 0.5,
                      color: '#188df0'
                    },
                    {
                      offset: 1,
                      color: '#188df0'
                    }
                  ]
                ),
                barBorderRadius: 14
              },
              emphasis: {
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1, [{
                      offset: 0,
                      color: '#2378f7'
                    },
                    {
                      offset: 0.7,
                      color: '#2378f7'
                    },
                    {
                      offset: 1,
                      color: '#83bff6'
                    }
                  ]
                )
              }
            },
            data: y,
            barMaxWidth: 28,
          }]

        } 
        /*else { //多项柱状图  返回的是object
          let nameList = [];
          option.series = [];
          for(let key in this.chartData.data) {
            nameList.push(key)
            option.series.push({
              type: 'bar',
              name: key,
//            stack: null,
              barGap: 0,
              label: {
                normal: {
                  show: true,
                  position: 'insideTop',
                  color: '#fff',
                  rotate:90,
                  verticalAlign: 'middle',
                  distance: 15
                }
              },
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1, [{
                        offset: 0,
                        color: '#83bff6'
                      },
                      {
                        offset: 0.5,
                        color: '#188df0'
                      },
                      {
                        offset: 1,
                        color: '#188df0'
                      }
                    ]
                  ),
                  barBorderRadius: 5
                },
                emphasis: {
                  color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1, [{
                        offset: 0,
                        color: '#2378f7'
                      },
                      {
                        offset: 0.7,
                        color: '#2378f7'
                      },
                      {
                        offset: 1,
                        color: '#83bff6'
                      }
                    ]
                  )
                }
              },
              data: [],
              barMaxWidth: 28,
            })
            let index = 1
            let len = this.chartData.data[key].length
            for(let i in this.chartData.data[key]) {//添加数据
              
              option.series[(option.series.length) - 1].data.push(this.chartData.data[key][i].value)
              if(i*index<length/5){
                option.series[(option.series.length) - 1].stack = index+""               
              }else {
                index++
              }
               
            }

          }
          option.xAxis.data = []
          for(let i in this.chartData.data[nameList[0]]) {
            option.xAxis.data.push(this.chartData.data[nameList[0]][i].name)
          }
          option.legend= {}
          option.legend.data = nameList;

        }*/
        console.log('227', option)
        this.chart.setOption(option)
      }
    }
  }
</script>