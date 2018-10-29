<template>
  <div :class="className" :id="id" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
import customChart from './utils/customChart'
import {last30DaysTraffic} from '@/api/statistics'

Date.prototype.format = function (formatStr) {
    formatStr = formatStr || "yyyy-MM-dd HH:mm:ss";
    var str = formatStr;
    var Week = ['日', '一', '二', '三', '四', '五', '六'];
    var month = this.getMonth() + 1;
    str = str.replace(/yyyy|YYYY/, this.getFullYear());
    str = str.replace(/MM/, month > 9 ? month + '' : '0' + month);
    str = str.replace(/w|W/g, Week[this.getDay()]);
    str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
    str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
    str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
    str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
    return str;
};

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
        this.chart.setOption(customChart.twoSideOption);
        this.chart.showLoading();
        var xArr = [], yArr = [], zArr = [];
        last30DaysTraffic().then(res => {
            var data = res.data.data.simcardAndTraffic;
            if (data) {
                var trafficSum = data.trafficSum, simCardCount = data.simCardCount;
                for (var i = 0; i < trafficSum.length - 1; i++) {
                    xArr.push(new Date(trafficSum[i][0]).format('YYYY-MM-DD'));
                    yArr.push(trafficSum[i][1]),
                        zArr.push(simCardCount[i][1]);
                }
                this.chart.setOption(
                    {
                        title: {
                            text: '近30天流量统计',
                        },
                        xAxis: {
                            data: xArr    //填入X轴数据
                        },
                        series: [    //填入系列（内容）数据
                            customChart.getShadeLineSerie(yArr,'使用流量(G)'),
                            customChart.getShadeBarSerie(zArr,'使用卡数')
                        ]
                    }
                )
                this.chart.hideLoading();
            }


        })

    }
  }
}
</script>
