<template>
    <div class="data-management-main">
        <div class="sel-heads">
            <selects types="exam-analysis" @dataPickerChange="dataPickerChange" @timeChange="timeChange" 
            @selectChange1="selectChange1" @selectChange2="selectChange2" 
            @selectChange5="selectChange5" @selectChange3="selectChange3" @selectChange4="selectChange4" />
            <div class="sel-btns">
                <Button size="small" icon="ios-share" class="export-btns">数据导出</Button>
                <Button @click="toExam" style="margin-left: 10px" size="small" type="primary"  class="export-btns">查看考试记录</Button>
            </div>
        </div>
        <div class="abil" >
            <div class="ab-item">
                    <div class="ab-title">共完成了<span class="act-tit">{{examConut}}</span>次考试，参与<span class="act-tit">{{examNum}}</span>人次</div>
                    <div class="ab-head">
                    <span class="tit">诊疗能力</span>
                    <Poptip trigger="hover" placement="bottom-start" title="">
                        <div slot="content">
                            <p class="content-text">问诊：考察学员问诊的有效性。问诊有效性越高，评分越高。</p>
                            <p class="content-text">查体：考察学员体格检查的有效性。体格检查项正确率越高，评分越高。</p>
                            <p class="content-text">辅检：考察学员辅助检查的准确性。辅助检查项准确率越高，评分越高。</p>
                            <p class="content-text">诊断：考察学员诊断思维能力。诊断准确率越高，评分越高。</p>
                            <p class="content-text">治疗：考察学员综合治疗能力。花费越少，有效性越高，评分越高。</p>
                        </div>
                        <Icon :size="18" type="md-help-circle" />
                    </Poptip>
                    <div class="ab-right">
                        <span>综合评分：</span>
                        <Rate disabled show-text allow-half v-model="valueCustom">
                            <span style="color: red">{{ valueCustom }}</span>
                        </Rate>
                    </div>
                </div>
                <div style="flex:1;height: 300px;margin-top:10px;">
                    <div style="width: 100%; height: 100%" id="treatment-capability3"></div>
                </div>
            </div>
        </div>
        <div class="progress-view">
            <div class="completions">
                <span style="font-family: PingFangSC-Medium;">完成度</span>
                <Poptip placement="bottom-start" trigger="hover" title="">
                    <div slot="content">
                        <p>考试中学员的完成度。</p>
                    </div>
                    <Icon :size="18" type="md-help-circle" />
                </Poptip>
            </div>
            <div class="pro-view">
                <Progress status="normal" :stroke-width="25" class="completions-progress" :percent="completionsProgress" />
                <span class="progress-text">{{completionsProgress}}%</span>
            </div>
        </div>
        <div class="abil">
            <div class="echarts-item">
                <div style="width: 100%;height:100%" id="score-distribution"></div>
            </div>
        </div>
        <div class="abil">
            <BrokenLine :linex="linex" :liney="liney" type="passRates" id="passRates" title="通过率"  />
        </div>
        <div class="abil" style="margin-bottom: 50px">
            <BrokenLine :linex="linesx" :liney2="linesy2" :liney3="linesy3" :liney4="linesy4" :liney="linesy" type="performanceAnalysis" id="performanceAnalysis" title="成绩分析"  />
        </div>
    </div>
</template>

<script>
    import SellectsMixins from './sellects-mixins'
    import echarts from 'echarts'
    import BrokenLine from './com/broken-line'

    export default {
        mixins: [SellectsMixins],
        components: {BrokenLine},
        name: '',
        data() {
            return {
                completionsProgress: 0,
                examConut: 0,
                examNum: 0,
                linex: [],
                liney: [],
                linesx: [],
                linesy: [],
                linesy2: [],
                linesy3: [],
                linesy4: [],
                valueCustom: 0,
                echarts1: [],
            }
        },
        mounted(){
            this.getList()
        },
        methods: {
            toExam(){
                sessionStorage.setItem('menuActiveIndex', 'exam-manage')
                let routeData = this.$router.resolve({ name: "exam-manage" });
                window.open(routeData.href, "_blank")
                $MenuActiveIndex.$emit('MenuActiveIndex', 'exam-manage')
            },
            setXY(d, bool = false){
                let x = [], y = []
                if(d&&d.length>0){
                    d.map(t => {
                        if(bool) x.push(t.title + ' ' + t.x)
                        y.push(+t.y)
                    })
                }
                return bool ? [y, x] : y
            },
            getEcharts(type, d, url, filed, filed2){
                PostData(url, d).then(r => {
                    if(filed) this[filed] = []
                    if(r.res_code == 1){
                        if(type.includes('setEcherts')){
                            let realr = {}
                            realr.verb = r.data.composite_score
                            realr.all_count = 0
                            realr.complete_count = 0
                            realr.dtAbi = [
                                {name: "问诊", score: r.data.inquire},
                                {name: "治疗", score: r.data.treatment},
                                {name: "诊断", score: r.data.diagnose},
                                {name: "辅检", score: r.data.assistant},
                                {name: "查体", score: r.data.physical}
                            ]
                            this[filed] = realr.sysAbi || realr.dtAbi
                            this[filed2] = +realr.verb
                            this[type](this[filed])
                            this.examConut = realr.complete_count
                            this.examNum = realr.all_count
                        }
                        if(type == 'progresss'){
                            r.data.complete_rate = r.data.complete_percent * 100 + "%"
                            let pro = r.data.complete_rate
                            this.completionsProgress = pro ? +pro.slice(0, (pro.length - 1)) : 0
                        }
                        if(type == 'bar'){
                            let bx = [], by1 = [], by2 = [], by3 = []
                            r.data.exam_list.forEach(element => {
                                element.score_60 = element.score_distribution['0-60']
                                element.score_60_80 = element.score_distribution['60-80']
                                element.score_80 = element.score_distribution['80-100']
                                element.x = element.start_time
                            });
                            r.data.score_performance = r.data.exam_list
                            let list = r.data.score_performance
                            if(list&&list.length>0){
                                list.map((t) => {
                                    bx.push(t.title + ' ' + t.x)
                                    by1.push(t.score_60)
                                    by2.push(t.score_60_80)
                                    by3.push(t.score_80)
                                })
                            }
                            this.setEcherts2(bx, by1, by2, by3)
                        }
                        if(type.includes('line')){
                            r.data.exam_list.forEach(element => {
                                element.pass_count = element.pass_percent
                                element.x = element.start_time
                                element.y = element.pass_percent * 100
                                element.all_count = r.data.exam_list.length
                            });
                            r.data.pass_rates = r.data.exam_list
                            this[filed2] = []
                            let da = r.data.pass_rates || r.data.avgScore
                            let [ly, lx] = this.setXY(da, true)
                            this[filed] = ly
                            this[filed2] = lx
                            if(type == 'lines'){
                                this.linesy2 = this.setXY(r.data.middleScore, false)
                                this.linesy3 = this.setXY(r.data.stddevScore, false)
                                this.linesy4 = this.setXY(r.data.squareScore, false)
                            }
                        }
                    }
                })
            },
            getList(){
                let d = {
                    organization_id: this.getOrganizationId(), 
                    grade_id: this.valueSelect2 == 'all' ? '' : this.valueSelect2, 
                    dept_id: this.valueSelect3 == 'all' ? '' : this.valueSelect3, 
                    student_type_id: this.valueSelect4 == 'all' ? '' : this.valueSelect4, 
                    limit: this.valueSelect5,
                }
                d.organization_id = d.organization_id ? d.organization_id : null
                d.grade_id = d.grade_id ? d.grade_id : null
                d.dept_id = d.dept_id ? d.dept_id : null
                d.student_type_id = d.student_type_id ? d.student_type_id : null
                this.getEcharts('setEcherts1', d, '/v1/data/getExamDiagnoseChart', 'echarts1', 'valueCustom')
                this.getEcharts('progresss', d, '/v1/data/getExamCompletePercent', '', '')
                this.getEcharts('bar', d, '/v1/data/getExamScoreDistribution', '', '')
                this.getEcharts('line', d, '/v1/data/getExamPassPercent', 'liney', 'linex')
                this.getEcharts('lines', d, '/v1/data/getExamScoreAnalysis', 'linesy', 'linesx')
            },
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
            setEcherts2(dx, dy1, dy2, dy3){
                let myChart = echarts.init(document.getElementById('score-distribution'));
                let option = {
                    color: ['#f04864','#5A92FF', '#751b7c'],
                    title: this.setEchertsTitle('成绩分布'),
                    tooltip: {
                        trigger: 'axis',
                        padding: 15,
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        },
                        formatter: `{b}<br/> <div style='float: left'>{a0}：{c0}</div><br/>
                        <div style='float: left'>{a1}：{c1}</div><br/>
                        <div style='float: left'>{a2}：{c2}</div>`
                    },
                    legend: {
                        data: ['60分以下', '60~80分','80~100分'],
                    },
                    grid: {
                        left: '0%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        axisLabel: {
                            // fontSize: 10,
                            color: '#474C63',
                            axisLabel: {
                                formatter: function (value) {
                                    return value&&value.split(" ").join("\n") || value
                                },
                            }
                        },
                        // boundaryGap: true,
                        data: dx
                    },
                    yAxis: [
                        {
                            name: '（ 人 ）',
                            type: 'value',
                            axisLine: { show: false },
                            axisTick: { show: false},
                            axisLabel: {
                                formatter: function (value) {
                                    return Number.isInteger(value) ? value : '';
                                },
                                // fontSize: 10,
                                color: '#474C63'
                            },
                            splitLine: { lineStyle: {type: 'dashed', color: '#D4D7E3'}},
                        }
                    ],
                    series: [
                        {
                            name: '60分以下',
                            type: 'bar',
                            barGap: 0,
                            barMaxWidth: 40,
                            data: dy1
                        },
                        {
                            name: '60~80分',
                            type: 'bar',
                            barGap: 0,
                            barMaxWidth: 40,
                            data: dy2
                        },
                        {
                            name: '80~100分',
                            type: 'bar',
                            barGap: 0,
                            barMaxWidth: 40,
                            data: dy3
                        }
                    ]
                };
                myChart.setOption(option, true);
            },
            setOptions(indicators, list){
                return {
                    tooltip: {
                        trigger: 'axis',
                        padding: 15,
                        formatter: function ({value}) {
                            let str = ''
                            for (var i = 0; i < value.length; i++) {
                                str += `<div style='display: flex;justifyContent: flex-start;position: relative;'>
                                <span style='margin-right: 50px;'>${indicators[i].name}</span>
                                <br/><span style='position: absolute;right:0;'>${value[i]}</span></div>`;
                            }
                            return str
                        }
                    },
                    radar: {
                        name: {
                            formatter: function (value) {
                                return value&&value.split(" ").join("\n") || value
                            },
                        },
                        splitNumber: 4,
                        indicator: indicators,
                        radius: 120,
                        center: ["50%", "50%"],
                        axisLine: {
                            lineStyle: {
                                color: 'rgba(64,152,255,0.20)',
                            },
                        },
                        splitLine : {
                            show : true,
                            lineStyle : {
                                width : 1,
                                color : 'rgba(64,152,255,0.20)', // 设置网格的颜色
                            },
                        },
                        splitArea : {
                            areaStyle:{
                                color:['#fff','#f7faff']
                            }
                        }
                    },
                    symbolSize: 0,
                    textStyle:{
                        // fontSize: 10,
                        color: '#333',
                    },
                    series: [
                        {
                            avoidLabelOverlap: false,
                            type: 'radar',
                            tooltip: {
                                trigger: 'item',
                            },
                            itemStyle: { normal: {areaStyle: {type: 'default'}}},
                            data: [
                                {
                                    value: list,
                                    itemStyle: {
                                        normal: {
                                            color: 'rgba(35,158,255,0.5)'
                                        },
                                    },
                                },
                            ]
                        },
                    ]
                };
            },
            handleDate(d){
                let indicators = [], list = []
                d.map((t) => {
                    // 线下课程安-排合理性
                    indicators.push({ name: t.name, max: 5 })
                    list.push(t.score || 0)
                }) 
                return {indicators, list}
            },
            setEcherts1(d){
                let myChart = echarts.init(document.getElementById('treatment-capability3'));
                let {indicators, list} = this.handleDate(d)
                myChart.setOption(this.setOptions(indicators, list), true);
            },
        }
    }
</script>

<style lang="less" scoped>
    .content-text{
        text-align: left;
    }
    /deep/ .ivu-progress-success-bg, /deep/ .ivu-progress-bg{
        background-color: #4098FF !important;
    }
    /deep/ .ivu-progress-text{
        display: none !important;
    }
    .progress-text{
        font-size: 14px;
        margin-left: 0;
    }
    .sel-btns{
        position: absolute;
        right: 40px;
        top: 10px;
        display: inline-flex;
        .export-btns{
            height: 36px;
            font-size: 14px;
        }
    }
    .sel-heads{
        display: flex;
        width: 100%;
        padding: 10px 40px;
        background-color: #fff;
        border-bottom: 1px solid #f0f0f7;
        position: relative;
    }
    .progress-view{
        margin: 10px 0;
        background-color: #fff;
        padding: 20px 40px;
        .completions{
            text-align: left;
        }
        .pro-view{
            margin-top: 15px;
            display: flex;
            align-items: center;
        }
        /deep/ .completions-progress{
            /deep/ .ivu-progress-outer{
                float: left;
            }
        }
    }
    .echarts-item{
        width: 100%;
        background-color: #fff;
        margin-bottom: 10px;
        height: 320px;
        position: relative;
        padding: 10px 40px;
    }
    .abil{
        display: flex;
        width: 100%;
        .ab-item{
            background-color: #fff;
            width: 100%;
            padding: 10px 40px 0 40px;
            .ab-title{
                margin-bottom: 10px;
                text-align: left;
            }
            .act-tit{
                color: #333;
            }
            .ab-head{
                height: 30px;
                display: flex;
                align-items: center;
                position: relative;
                .tit{
                    font-size: 16px;
                    margin-right: 5px;
                }
                .ab-right{
                    position: absolute;
                    right: 0;
                }
            }
        }
    }
</style>