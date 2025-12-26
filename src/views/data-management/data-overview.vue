<template>
    <div class="data-management-main">
        <div class="heads">
            <div class="time-view">
                <Icon :size="18" color="#8D96C2" type="ios-alert" />
                <span style="margin: 0 5px">数据统计截止到</span>
                <span class="time">{{$config.formatTime2(new Date())}}</span>
                <!-- <a :href="downUrl"> -->
                    <Button icon="ios-share" class="export-btn">数据导出</Button>
                <!-- </a> -->
            </div>
            <div class="h-list">
                <div :class="i ? 'h-margin' : ''" class="h-item" v-for="(t,i) in hList" :key="i">
                    <img class="imgs" :src="t.img" />
                    <div class="h-conent">
                        <p class="h-num">{{t.num}}<span class="h-tit">{{i < 2 ? '人' : '人次'}}</span></p>
                        <p style="margin-top: 12px" class="h-tit">{{t.tit}}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="sel-heads">
            <selects @dataPickerChange="dataPickerChange" @timeChange="timeChange" 
            @selectChange1="selectChange1" @selectChange2="selectChange2" 
            @selectChange3="selectChange3" @selectChange4="selectChange4" />
        </div>
        <div class="abil" >
            <div class="ab-left ab-item">
                <div class="ab-head">
                    <span class="tit">系统能力</span>
                    <Poptip trigger="hover" placement="bottom-start"  title="">
                        <div slot="content">
                            <p class="content-text">系统性：考察学员整体诊疗能力是否全面。诊疗过程中正确率越高，评分越高。</p>
                            <p class="content-text">逻辑性：考察学员的诊断、治疗是否有据可依。诊断依据越准确，评分越高。</p>
                            <p class="content-text">精准性：考察学员的诊疗能力都准确率。正确率越高，评分越高。</p>
                            <p class="content-text">敏捷性：考察学员诊疗思维的熟练程度、 反应速度。诊疗耗时越少，评分越高。</p>
                            <p class="content-text">经济性：考察学员诊疗费用把控能力。花费越少，评分越高。</p>
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
                    <div style="width: 100%; height: 100%" id="system-capability2"></div>
                </div>
            </div>
            <div class="ab-item">
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
                        <Rate disabled show-text allow-half v-model="valueCustom2">
                            <span style="color: red">{{ valueCustom2 }}</span>
                        </Rate>
                    </div>
                </div>
                <div style="flex:1;height: 300px;margin-top:10px;">
                    <div style="width: 100%; height: 100%" id="treatment-capability2"></div>
                </div>
            </div>
        </div>
        <div class="abil" style="margin-bottom: 40px">
            <div class="ab-left ab-item2">
                <BrokenLine :linex="lineX1" :liney="lineY1" type="dataOverview1" id="dataOverview1" title="学员学习活跃趋势"  />
                <BrokenLine :linex="lineX2" :liney="lineY2" type="dataOverview2" id="dataOverview2" title="学员学习平均时长 (分)" />
            </div>
            <div class="ab-item2">
                <EchartsView :pieList="pieList" :barx="barx" :bary="bary" />
            </div>
        </div>
    </div>
</template>

<script>
    import u1 from '../../assets/case/u33638.png'
    import u2 from '../../assets/case/u33657.png'
    import u3 from '../../assets/case/u33672.png'
    import u4 from '../../assets/case/u33685.png'
    import SellectsMixins from './sellects-mixins'
    import echarts from 'echarts'
    import BrokenLine from './com/broken-line'
    import EchartsView from './com/echarts-view'
    export default {
        mixins: [SellectsMixins],
        components: { BrokenLine, EchartsView },
        name: '',
        data() {
            return {
                pieList: [],
                barx: [],
                bary: [],
                lineX1: [],
                lineY1: [],
                lineX2: [],
                lineY2: [],
                valueCustom: 0,
                valueCustom2: 0,
                echarts1: [],
                echarts2: [],
                hList: [
                    {num: 0, tit: '老师', img: u1},
                    {num: 0, tit: '学员', img: u2},
                    {num: 0, tit: '学习人次', img: u4},
                    {num: 0, tit: '考试人次', img: u3},
                ]
            }
        },
        mounted(){
            this.getData()
            this.getList()
        },
        computed: {
            downUrl(){
                // let arr = ['product/exportStudentProgress', 'product/exportStudentOnlineProgress', 
                // 'product/exportStudentOnlineHomeworkProgress', 'product/exportOnlineFocus', 'product/exportOfflineSubjects']
                // return BaseUrl+`${arr[this.active - 1]}?product_id=${+this.$route.query.id}&batch_id=${this.selStudent === 'all' ? '' : this.selStudent}`
                return ''
            }
        },
        methods: {
            getData(){
                PostData('/v1/data/getUserData').then(r => {
                    let obj = ['teacher_count', 'student_count', 'study_count', 'join_exam_count']
                    if(r.res_code == 1){
                        this.hList.map((t, i) => {
                            t.num = r.data[obj[i]]
                        })
                    }
                })
            },
            getEcharts(type, d, url, filed, filed2){
                PostData(url, d).then(r => {
                    console.log(r);
                    this[filed] = []
                    if(r.res_code == 1){
                        if(type.includes('setEcherts')){
                            let realr = {}
                            realr.verb = r.data.composite_score
                            if (type == "setEcherts1") {
                                realr.sysAbi = [
                                    {name: "系统性", score: r.data.systematic},
                                    {name: "经济性", score: r.data.economic},
                                    {name: "敏捷性", score: r.data.agile},
                                    {name: "精准性", score: r.data.precise},
                                    {name: "逻辑性", score: r.data.logic}
                                ]
                            } else {
                                realr.dtAbi = [
                                    {name: "问诊", score: r.data.inquire},
                                    {name: "治疗", score: r.data.treatment},
                                    {name: "诊断", score: r.data.diagnose},
                                    {name: "辅检", score: r.data.assistant},
                                    {name: "查体", score: r.data.physical}
                                ]
                            }
                            this[filed] = realr.sysAbi || realr.dtAbi
                            this[filed2] = +realr.verb
                            this[type](this[filed])
                        }
                        if(type == 'line' || type == 'bar'){
                            r.data.forEach(element => {
                                element.y = element.count
                                element.x = element.date
                            });
                            this[filed2] = []
                            if(r.data.length>0){
                                r.data.map(t => {
                                    this[filed].push(t.y)
                                    this[filed2].push(t.x)
                                })
                            }
                        }
                        if(type == 'pie'){
                            let realr = {
                                h0_4:{
                                    count: r.data['0_4'],
                                    ratio: r.data['0_4']*100 + "%",
                                    type: "h0_4",
                                },
                                h4_8:{
                                    count: r.data['4_8'],
                                    ratio: r.data['4_8']*100 + "%",
                                    type: "h4_8",
                                },
                                h8_12:{
                                    count: r.data['8_12'],
                                    ratio: r.data['8_12']*100 + "%",
                                    type: "h8_12",
                                },
                                h12_16:{
                                    count: r.data['12_16'],
                                    ratio: r.data['12_16']*100 + "%",
                                    type: "h12_16",
                                },
                                h16_20:{
                                    count: r.data['16_20'],
                                    ratio: r.data['16_20']*100 + "%",
                                    type: "h16_20",
                                },
                                h20_24:{
                                    count: r.data['20_24'],
                                    ratio: r.data['20_24']*100 + "%",
                                    type: "h20_24",
                                }
                            }
                            this[filed] = [realr.h20_24, realr.h16_20, realr.h12_16, realr.h8_12, realr.h4_8, realr.h0_4]
                        }
                    }
                })
            },
            getList(){
                let d = {
                    ...this.timesDate,
                    organization_id: this.getOrganizationId(), 
                    grade_id: this.valueSelect2 == 'all' ? null : this.valueSelect2, 
                    dept_id: this.valueSelect3 == 'all' ? null : this.valueSelect3, 
                    student_type_id: this.valueSelect4 == 'all' ? null : this.valueSelect4, 
                    time_type: this.times,
                }
                d.organization_id = d.organization_id ? d.organization_id : null
                d.grade_id = d.grade_id ? d.grade_id : null
                d.dept_id = d.dept_id ? d.dept_id : null
                d.student_type_id = d.student_type_id ? d.student_type_id : null
                this.getEcharts('setEcherts1', d, '/v1/data/getSystemChart', 'echarts1', 'valueCustom')
                this.getEcharts('setEcherts2', d, '/v1/data/getDiagnoseChart', 'echarts2', 'valueCustom2')
                this.getEcharts('line', d, '/v1/data/getStudyActiveChart', 'lineY1', 'lineX1')
                this.getEcharts('line', d, '/v1/data/getStudyAvgTimeChart', 'lineY2', 'lineX2')
                this.getEcharts('bar', d, '/v1/data/getStudyCountChart', 'bary', 'barx')
                this.getEcharts('pie', d, '/v1/data/getStudyTimePartChart', 'pieList', '')
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
                                return value&&value.split("-").join("\n") || value
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
                    let score = t.score ? t.score.toFixed(2) : 0
                    // 线下课程安-排合理性
                    indicators.push({ name: t.name, max: 5 })
                    list.push(score)
                }) 
                return {indicators, list}
            },
            setEcherts1(d){
                let myChart = echarts.init(document.getElementById('system-capability2'));
                let {indicators, list} = this.handleDate(d)
                myChart.setOption(this.setOptions(indicators, list), true);
            },
            setEcherts2(d){
                let myChart = echarts.init(document.getElementById('treatment-capability2'));
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
    .heads{
        padding: 20px 40px;
        background-color: #fff;
        display: flex;
        flex-direction: column;
        .time-view{
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            position: relative;
            width: 100%;
            .export-btn{
                height: 36px;
                position: absolute;
                right: 0;
                bottom: 0
            }
        }
        .h-list{
            margin-top: 10px;
            display: flex;
            width: 100%;
            .h-margin{
                margin-left: 40px;
            }
            .h-item{
                flex: 1;
                display: flex;
                align-items: center;
                background-color: #e6e6cf;
                height: 130px;
                padding: 0 20px;
                position: relative;
                .imgs{
                    width: 85px;
                    height: 85px;
                }
                .h-conent{
                   position: absolute;
                   right: 20px;
                   text-align: left;
                   .h-num{
                       font-size: 36px;
                       font-family: PingFangSC-Medium;
                       color: #4098ff
                   }
                   .h-tit{
                       font-size: 14px;
                       font-family: PingFangSC-Medium;
                       color: #4098ff
                   }
                }
            }
        }
        .time{
            color: red;
        }
    }
    .sel-heads{
        margin-top: 10px;
        display: flex;
        width: 100%;
        padding: 10px 40px;
        background-color: #fff;
        border-bottom: 1px solid #f0f0f7;
    }
    .abil{
        display: flex;
        .ab-left{
            margin-right: 10px;
        }
        .ab-item2{
            width: 50%;
            margin-bottom: 10px;
        }
        .ab-item{
            background-color: #fff;
            width: 50%;
            padding: 10px 40px 0 40px;
            margin-bottom: 10px;
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
</style>