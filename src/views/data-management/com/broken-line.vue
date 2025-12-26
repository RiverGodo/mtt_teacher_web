<template>
    <div class="echarts-main">
        <div :id="id" style="height: 300px;width: 100%;"></div>
    </div>
</template>
<script>
    import echarts from 'echarts'
    export default {
        props: {
            id: {},
            title: {},
            type: {},
            linex: {},
            liney: {},
            liney2: {},
            liney3: {},
            liney4: {}
        },
        watch: {
            linex(_new){
                if(this.type == 'performanceAnalysis'){
                   this.setEcherts1(this.liney, _new, this.liney2, this.liney3, this.liney4)
                }else this.setEcherts1(this.liney, _new)
            }
        },
        methods: {
            setEchertsTitle(text){
                return {
                    text,
                    // left: 20,
                    textStyle: {
                        fontSize: 14,
                        color: '#474C63'
                    }
                }
            },
            isCustonMouths(){
                let bool = false
                if(this.times == 'CUSTOM'&&this.data_picker.length==2&&this.data_picker[0]){
                    let da = new Date(this.data_picker[0])
                    let n1 = this.data_picker[1].split('-').join("")
                    let n2 = (this.$config.getDay(29, da)).split('-').join("")
                    bool = +n1 <= (+n2)
                }
                return (this.times=='WEEK'||this.times=='MONTH') ? true : bool
            },
            setOptions(d, dx, dy2, dy3, dy4){
                let obj = {
                    dataOverview1: [],
                    dataOverview2: [],
                    passRates: [],
                    performanceAnalysis: [{name: '平均分', icon: 'circle'},{name: '中位数', icon: 'circle'},
                    {name: '标准差', icon: 'circle'},{name: '方差', icon: 'circle'}],
                }
                let setData = (name, d) => {
                    return  {
                        name,
                        type: 'line',
                        data: d || [0]
                    }
                }
                let da = {
                    dataOverview1: [setData('学习人数', d)], 
                    dataOverview2: [setData('平均时长', d)],
                    passRates: [setData('通过率', d)],
                    performanceAnalysis: [
                        setData('平均分', d),
                        setData('中位数', dy2),
                        setData('标准差', dy3),
                        setData('方差', dy4),
                    ],
                } 
                let legendData = obj[this.type]
                let list = da[this.type]
                let ya = this.type == 'performanceAnalysis' ? {name: '分'} : this.type == 'passRates' ? {name: '（ % ）', max: 100} : {name: ''}
                let performanceAnalysisToolView = `{b}<br/> <div style='float: left'>{a0}：{c0}</div><br/>
                <div style='float: left'>{a1}：{c1}</div><br/>
                <div style='float: left'>{a2}：{c2}</div><br/>
                <div style='float: left'>{a3}：{c3}</div>`
                let passRatesTool = `{b}<br/> <div style='float: left'>{a}：{c}</div>`
                return {
                    color: this.type == 'performanceAnalysis' ? ['#f04864','#4098FF','#4ecb73','#ba36f6'] : ['#4098FF'],
                    title: this.setEchertsTitle(this.title),
                    tooltip: {
                        trigger: 'axis',
                        padding: 15,
                        formatter: this.type == 'passRates' ? passRatesTool : this.type == 'performanceAnalysis' ? performanceAnalysisToolView : '{b} <br/> {a}：{c}'
                    },
                    legend: {
                        data: legendData
                    },
                    grid: {
                        left: '0%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: dx || [''],
                        axisLine: { show: false },
                        axisTick: { show: false},
                        axisLabel: {
                            formatter: (value) => {
                                if(this.type.includes('dataOverview')) return value.slice(5)
                                else return value&&value.split(" ").join("\n") || value
                            },
                        }
                    },
                    yAxis: {
                        ...ya,
                        type: 'value',
                        axisLine: { show: false },
                        axisTick: { show: false},
                        splitLine :{    //网格线
                            lineStyle:{  type:'dashed' ,color: '#D4D7E3' },
                            show:true //隐藏或显示
                        },
                        axisLabel: {
                            formatter: (value) => {
                                return this.type == 'dataOverview1' ? (Number.isInteger(value) ? value : '') : value
                            },
                            // fontSize: 10,
                            color: '#474C63'
                        }
                    },
                    series: list
                };
            },  
            setEcherts1(d, dx, dy2, dy3, dy4){
                let myChart = echarts.init(document.getElementById(this.id));
                myChart.setOption(this.setOptions(d, dx, dy2, dy3, dy4), true);
            },
        }
    }
</script>

<style lang="less" scoped>
    .echarts-main{
        padding: 10px 40px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        background-color: #fff;
        margin-bottom: 10px;
        width: 100%;
    }
</style>