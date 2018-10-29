<template>
  <div :class="className" :id="id" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
import customChart from './utils/customChart'
import {getGrpMonthInfo} from '@/api/statistics'

export default {
  mixins: [resize],
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
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id));
        this.chart.setOption(customChart.getMixChartOption());
        this.chart.showLoading();
        const type = "D";
        var xArr = [], legendArr = [], dataArr = [],toltalArr=[0,0,0,0,0,0];
        getGrpMonthInfo( {"grpType": 4, "column": type,isDay:false}).then(res => {
            var result = res.data.data;
            if (type == 'D' ? result.dataInfo && Object.keys(result.dataInfo).length > 0 :
                    (type == "C" ? result.countInfo && Object.keys(result.countInfo).length > 0 :
                        result.rateInfo && Object.keys(result.rateInfo).length > 0)) {
                var dataInfo = type == 'D' ? result.dataInfo : (type == "C" ? result.countInfo : result.rateInfo);
                var keys = Object.keys(dataInfo);
                legendArr = keys;
                legendArr.push("总量")
                let barColors=customChart.getMixBarColors();
                let index=0;
                for (var key in dataInfo) {

                    var arr = new Array;
                    for (var i = 0; i < 6; i++) {
                        arr.push(dataInfo[key][i][1]);
                        toltalArr[i]+=arr[i];
                        if (xArr.length < 6) {
                            xArr.push(dataInfo[key][i][0])
                        }
                    }
                    let seria =customChart.getMixChartBarSerie( arr,key,barColors[index]);
                    dataArr.push(seria);
                    index++;
                    //最多七条
                }
                //总量计算
                dataArr.push(customChart.getMixChartLineSerie( toltalArr,'总量','rgba(252,230,48,1)'))

            }
            this.chart.setOption(
                {
                    backgroundColor: '#82ABBA',
                    title: {
                        text: '设备组流量统计',
                    },
                    xAxis: {
                        axisLine: {
                            lineStyle: {
                                color: '#000'
                            }
                        },
                        data: xArr    //填入X轴数据
                    },
                    yAxis: {
                        axisLine: {
                            lineStyle: {
                                color: '#000'
                            }
                        },
                        name: '(K)',
                    },
                    legend: {
                        textStyle: {
                            color: '#000'
                        },
                        data: legendArr
                    },
                    dataZoom:{
                        show:false
                    },
                    series: dataArr
                }
            )
        this.chart.hideLoading();

        })

    }
  }
}
</script>
