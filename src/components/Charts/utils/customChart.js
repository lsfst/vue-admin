/**
 * Created by sz on 2018/9/7.
 */
import echarts from 'echarts'

const multiLineColors = [
    [
        'rgba(137, 189, 27, 0.3)', 'rgba(137, 189, 27, 0)', 'rgb(137,189,27)', 'rgba(137,189,2,0.27)'
    ],
    [
        'rgba(0, 136, 212, 0.3)', 'rgba(0, 136, 212, 0)', 'rgba(0, 136, 212)', 'rgba(0, 136, 212, 0.2)'
    ],
    [
        'rgba(219, 50, 51, 0.3)', 'rgba(219, 50, 51, 0)', 'rgba(219, 50, 51)', 'rgba(219, 50, 51, 0.2)'
    ],
    [
        'rgba(230, 162, 60, 0.3)', 'rgba(230, 162, 60, 0)', 'rgba(230, 162, 60)', 'rgba(230, 162, 60, 0.2)'
    ],
    [
        'rgba(103, 58, 183, 0.3)', 'rgba(103, 58, 183, 0)', 'rgba(103, 58, 183)', 'rgba(103, 58, 183, 0.2)'
    ],
    [
        'rgba(121, 85, 72, 0.3)', 'rgba(121, 85, 72, 0)', 'rgba(121, 85, 72)', 'rgba(121, 85, 72, 0.2)'
    ],
    [
        'rgba(96, 125, 139, 0.3)', 'rgba(96, 125, 139, 0)', 'rgba(96, 125, 139)', 'rgba(96, 125, 139, 0.2)'
    ],
];

const mixBarColors = ['rgba(255,144,128,1)', 'rgba(0,191,183,1)', 'rgba(236,71,88,0.7)', 'rgba(0, 136, 212)', 'rgb(248,172,89)', 'rgb(21,85,72,1)']

function shadeLineSerie(data,name) {
    return {
        name:name,
        type: 'line',
        smooth: true,
        itemStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                        {offset: 0, color: '#A1E8E4'},
                        {offset: 0.5, color: '#23c6c8'},
                        {offset: 1, color: '#1ab394'}
                    ]
                )
            },
            emphasis: {
                color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                        {offset: 0, color: '#1ab394'},
                        {offset: 0.7, color: '#23c6c8'},
                        {offset: 1, color: '#A1E8E4'}
                    ]
                )
            }
        },
        data: data,
        markPoint: {
            data: [
                {type: 'max', name: '最大值'},
//                            {type: 'min', name: '最小值'}
            ]
        },
        markLine: {
            data: [
                {type: 'average', name: '平均值'}
            ]
        },
        animationDelay: function (idx) {
            return idx * 20;
        }
    }
}

function shadeBarSerie(data,name) {
    return {
        name: name,
        type: 'bar',
        smooth: true,
        itemStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                        {offset: 0, color: '#83bff6'},
                        {offset: 0.5, color: '#188df0'},
                        {offset: 1, color: '#188df0'}
                    ]
                )
            },
            emphasis: {
                color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                        {offset: 0, color: '#2378f7'},
                        {offset: 0.7, color: '#2378f7'},
                        {offset: 1, color: '#83bff6'}
                    ]
                )
            }
        },
        yAxisIndex: 1,
        data: data,
        markPoint: {
            data: [
                {type: 'max', name: '最大值'},
//                            {type: 'min', name: '最小值'}
            ]
        },
        markLine: {
            data: [
                {type: 'average', name: '平均值'}
            ]
        },
        animationDelay: function (idx) {
            return idx * 20 + 100;
        }
    }
}

const multiLineOption = {
    backgroundColor: '#394056',
    title: {
        top: 20,
        // text: '设备组统计',
        textStyle: {
            fontWeight: 'normal',
            fontSize: 16,
            color: '#F1F1F3'
        },
        left: '1%'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            lineStyle: {
                color: '#57617B'
            }
        }

    },
    legend: {
        top: 20,
        icon: 'rect',
        itemWidth: 14,
        itemHeight: 5,
        itemGap: 13,
        data: [],
        right: '4%',
        textStyle: {
            fontSize: 12,
            color: '#F1F1F3'
        }
    },
    grid: {
        top: 100,
        left: '3%',
        right: '4%',
        bottom: '2%',
        containLabel: true
    },
    xAxis: [{
        type: 'category',
        boundaryGap: false,
        axisLine: {
            lineStyle: {
                color: '#57617B'
            }
        },
        data: []
    }],
    yAxis: [
        {
            type: 'value',
            // name: '(K)',
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#57617B'
                }
            },
            axisLabel: {
                margin: 10,
                textStyle: {
                    fontSize: 14
                }
            },
            splitLine: {
                lineStyle: {
                    color: '#57617B'
                }
            }
        }],
    series: []
}

const twoSideOption={
    // 957861 A2B4BA
    backgroundColor: '#EFF0DC',
    title: {
        x: '20',
        top: '20',
        textStyle: {
            color: '#000',
            fontSize: '22'
        },
        subtextStyle: {
            color: '#90979c',
            fontSize: '16'
        }
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            textStyle: {
                color: '#fff'
            }
        }
    },
    toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
            mark: {show: true},
            dataView: {readOnly: false},
            magicType: {type: ['line', 'bar']},  // 'stack', 'tiled':平铺叠加切换
            restore: {},
            // saveAsImage: {
            //     name: '近30天流量使用',
            //     backgroundColor: 'white'
            // }
        }
    },
    grid: {
        borderWidth: 0,
        top: 110,
        bottom: 95,
        textStyle: {
            color: '#fff'
        }
    },
    legend: {
        x: '5%',
        top: '10%',
        textStyle: {
            color: '#90979c'
        },
        data: []
    },
    //是否启用拖拽重计算特性，默认关闭(即值为false)
    calculable: true,
    xAxis: [{
        //坐标轴类型，横轴默认为类目型'category'
        type: 'category',
        axisLine: {
            lineStyle: {
                color: '#90979c'
            }
        },
        splitLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        splitArea: {
            show: false
        },
        axisLabel: {
            interval: 0,
            rotate:40

        },
        data: []
    }],
    yAxis: [
        {
        type: 'value',
            name:'流量 G',
        splitLine: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#90979c'
            }
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            formatter: '{value}'
            // interval: 0
        },
        splitArea: {
            show: false
        }
    },
        {
            type: 'value',
            name:'卡数',
            splitLine: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#90979c'
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                formatter: '{value}'
                // interval: 0
            },
            splitArea: {
                show: false
            }
        },
    ],
    series:[]


}


const mixChartOption = {
    backgroundColor: '#344b58',
    title: {
        // text: 'statistics',
        x: '20',
        top: '20',
        textStyle: {
            color: '#fff',
            fontSize: '22'
        },
        subtextStyle: {
            color: '#90979c',
            fontSize: '16'
        }
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            textStyle: {
                color: '#fff'
            }
        }
    },
    grid: {
        borderWidth: 0,
        top: 110,
        bottom: 95,
        textStyle: {
            color: '#fff'
        }
    },
    legend: {
        x: '5%',
        top: '10%',
        textStyle: {
            color: '#90979c'
        },
        data: []
    },
    calculable: true,
    xAxis: [{
        //坐标轴类型，横轴默认为类目型'category'
        type: 'category',
        axisLine: {
            lineStyle: {
                color: '#90979c'
            }
        },
        splitLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        splitArea: {
            show: false
        },
        axisLabel: {
            interval: 0

        },
        data: []
    }],
    yAxis: [{
        type: 'value',
        splitLine: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#90979c'
            }
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            interval: 0
        },
        splitArea: {
            show: false
        }
    }],
    //滚动条设置
    dataZoom: [{
        show: true,
        height: 30,
        xAxisIndex: [
            0
        ],
        bottom: 30,
        start: 10,
        end: 80,
        handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
        handleSize: '110%',
        handleStyle: {
            color: '#d3dee5'

        },
        textStyle: {
            color: '#fff'
        },
        borderColor: '#90979c'

    }, {
        type: 'inside',
        show: true,
        height: 15,
        start: 1,
        end: 35
    }],
    series: []
}

function getMultiLineSerie(name, data, colors) {
    return {
        name: name,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        lineStyle: {
            normal: {
                width: 1
            }
        },
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: colors[0]
                }, {
                    offset: 0.8,
                    color: colors[1]
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
            }
        },
        itemStyle: {
            normal: {
                color: colors[2],
                borderColor: colors[3],
                borderWidth: 12

            }
        },
        data: data
    }
}

function getMixChartBarSerie(data, name, itemColor) {
    return {
        name: name ? name : '',
        type: 'bar',
        stack: 'total',
        barMaxWidth: 35,
        barGap: '10%',
        itemStyle: {
            normal: {
                color: itemColor ? itemColor : 'rgba(0,191,183,1)',
                barBorderRadius: 0,
                label: {
                    show: false,
                    // position: 'insideTop',
                    // formatter(p) {
                    //     return p.value > 0 ? p.value : ''
                    // }
                }
            }
        },
        data: data
    }
}

function getMixChartLineSerie(data, name, itemColor) {
    return {
        name: name ? name : '',
        type: 'line',
        stack: 'total',
        symbolSize: 10,
        symbol: 'circle',
        itemStyle: {
            normal: {
                color: itemColor ? itemColor : 'rgba(252,230,48,1)',
                barBorderRadius: 0,
                label: {
                    show: true,
                    position: 'top',
                    formatter(p) {
                        return p.value > 0 ? p.value : ''
                    }
                }
            }
        },
        data: data
    }
}

export default {
    getMultiLineSerie: (name, data, colors) => {
        return getMultiLineSerie(name, data, colors);
    },
    getMultiLineOption: () => {
        return multiLineOption;
    },
    getMultiLineColors: () => {
        return multiLineColors;
    },
    getMixChartOption: () => {
        return mixChartOption;
    },
    getMixBarColors: () => {
        return mixBarColors;
    },
    getMixChartBarSerie: (data, name, itemColor) => {
        return getMixChartBarSerie(data, name, itemColor);
    },
    getMixChartLineSerie: (data, name, itemColor) => {
        return getMixChartLineSerie(data, name, itemColor);
    },
    getShadeBarSerie: (data, name) => {
        return shadeBarSerie(data, name);
    },
    getShadeLineSerie: (data, name) => {
        return shadeLineSerie(data, name);
    },
    twoSideOption,
}
