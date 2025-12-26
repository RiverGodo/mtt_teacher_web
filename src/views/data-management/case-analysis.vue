<template>
    <div class="case-analysis">
        <div class="analysis-content">
            <div class="h-view">
                <span class="grey-medium6">病例使用排名</span>
                <span class="case-num">共计病例{{allCount}}份</span>
            </div>
            <div class="ana-head">
                <selects @dataPickerChange="dataPickerChange" @timeChange="timeChange" 
                @selectChange1="selectChange1" @selectChange2="selectChange2" 
                @selectChange3="selectChange3" @selectChange4="selectChange4" />
                <div class="sel-btns">
                    <a :href="downUrl">
                        <Button size="small" icon="ios-share" class="export-btns">数据导出</Button>
                    </a>
                    <Button @click="toCase" style="margin-left: 10px" size="small" type="primary"  class="export-btns">查看病例详情</Button>
                </div>
            </div>
            <div style="margin-top: 20px;margin-bottom: 50px">
                <tables :column="column" :tableData="tableData"/>
            </div>
        </div>
    </div>
</template>

<script>
    import SellectsMixins from './sellects-mixins'
    import tables from '../../components/tables'
    import u1 from '../../assets/case/u34827.png'
    import u2 from '../../assets/case/u34829.png'
    import u3 from '../../assets/case/u34831.png'
    import postData from '../../api/postData'
    export default {
        mixins: [SellectsMixins],
        components: { tables },
        name: '',
        data() {
            return {
                allCount: 0,
                column: [
                    {
                        title: '排名',
                        width: 100,
                        render: (h, params) => {
                            if(params.index < 3){
                                return h('img', {
                                    style: {
                                        width: "20px",
                                        verticalAlign: "middle"
                                    },
                                    attrs: {
                                        src: [u1, u2, u3][params.index]
                                    }
                                })
                            }else return h('span', params.index + 1)
                        }
                    },
                    {
                        title: '病例名称',
                        key: 'symptom'
                    },
                    {
                        title: '使用总次数',
                        key: 'scene_learn_num',
                        align: 'center'
                    },
                    {
                        title: '平均得分',
                        key: 'avg',
                        align: 'center'
                    },
                ],
                tableData: []
            }
        },
        computed: {
            getDataUrl(){
                let da = {
                    ...this.timesDate,
                    grade_id: this.valueSelect2 == 'all' ? '' : this.valueSelect2, 
                    dept_id: this.valueSelect3 == 'all' ? '' : this.valueSelect3, 
                    student_type_id: this.valueSelect4 == 'all' ? '' : this.valueSelect4, 
                    time_type: this.times,
                }
                let str = ''
                for(let i in da){
                    str += '&' + i + '=' + da[i]
                }
                return str
            },
            downUrl(){
                return BaseUrl + `data/exportCasesToExcel?organization_id=${this.getOrganizationId()}` + this.getDataUrl
            }
        },
        mounted(){
            this.getDataUrl
            this.getList()
        },
        methods: {
            toCase(){
                sessionStorage.setItem('menuOpenName', JSON.stringify(["case-manage"]));
                sessionStorage.setItem('menuActiveIndex', 'case-warehouse')
                // this.$router.push({name: 'case-warehouse'})
                $MenuActiveIndex.$emit('MenuActiveIndex', 'case-warehouse')
                let routeData = this.$router.resolve({ name: "case-warehouse" });
                window.open(routeData.href, "_blank")
            },
            getList(){
                let d = {
                    ...this.timesDate,
                    organization_id: this.getOrganizationId(), 
                    grade_id: this.valueSelect2 == 'all' ? '' : this.valueSelect2, 
                    dept_id: this.valueSelect3 == 'all' ? '' : this.valueSelect3, 
                    student_type_id: this.valueSelect4 == 'all' ? '' : this.valueSelect4, 
                    time_type: this.times,
                }
                d.organization_id = d.organization_id ? d.organization_id : null
                d.grade_id = d.grade_id ? d.grade_id : null
                d.dept_id = d.dept_id ? d.dept_id : null
                d.student_type_id = d.student_type_id ? d.student_type_id : null
                PostData('/v1/data/getCaseAnalysis', d).then(r => {
                    if(r.res_code == 1){
                        this.tableData = r.data.list
                        this.allCount = r.data.list.length
                    }
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .analysis-content{
        padding: 20px 40px;
        background-color: #fff;
        .h-view{
            text-align: left;
            margin-bottom: 20px;
            .case-num{
                margin-left: 40px;
            }
        }
    }
    .ana-head{
        display: flex;
        position: relative;
    }
    .sel-btns{
        position: absolute;
        right: 0;
        display: inline-flex;
        .export-btns{
            height: 36px;
            font-size: 14px;
        }
    }
</style>