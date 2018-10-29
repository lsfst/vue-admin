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
            //定制seria
            getSeria(name, data, colors){
                return customChart.getMultiLineSerie(name, data, colors);
            },
            initChart() {
                this.chart = echarts.init(document.getElementById(this.id));
                this.chart.setOption(customChart.getMultiLineOption());
                this.chart.showLoading();
                //axios不支持同步
                const type = "D";
                var xArr = [], legendArr = [], dataArr = [];
                getGrpMonthInfo({"grpType": 4, "column": type,isDay:false}).then(res => {
                    var result = res.data.data;
                    if (type == 'D' ? result.dataInfo && Object.keys(result.dataInfo).length > 0 :
                            (type == "C" ? result.countInfo && Object.keys(result.countInfo).length > 0 :
                                result.rateInfo && Object.keys(result.rateInfo).length > 0)) {
                        var dataInfo = type == 'D' ? result.dataInfo : (type == "C" ? result.countInfo : result.rateInfo);
                        var keys = Object.keys(dataInfo);
                        legendArr = keys;
                        var colors = customChart.getMultiLineColors();
                        for (var key in dataInfo) {

                            if (dataArr.length > 6) {
                                break;
                            }
                            var arr = new Array;
                            for (var i = 0; i < 6; i++) {
                                arr.push(dataInfo[key][i][1]);
                                if (xArr.length < 6) {
                                    xArr.push(dataInfo[key][i][0])
                                }
                            }
                            let seria = this.$options.methods.getSeria(key, arr, colors[dataArr.length]);
                            dataArr.push(seria);
                            //最多七条
                        }
                        this.chart.setOption({
                            title: {
                                text: '设备组流量统计',
                            },
                            toolbox: {
                                feature: {
                                    magicType: {type: ['line', 'bar']},
                                }
                            },
                            xAxis: {
                                data: xArr    //填入X轴数据
                            },
                            yAxis: {
                                name: '(K)',
                            },
                            legend: {
                                data: legendArr
                            },
                            series: dataArr
                        })
                    }

                    this.chart.hideLoading();
                });

            }
        }
    }
</script>
