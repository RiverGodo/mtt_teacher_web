<template>
     <Modal :width="700" transfer v-model="modal1" :title="title" footer-hide @on-cancel="cancel">
        <Tabs v-model="pane" class="rank-tab" v-if="type == 1" type="card">
            <TabPane name="name1" label="练习次数">
                <Table :columns="columns1" :data="data1"></Table>
                <p style="margin-top: 16px">当前排名：{{hInfo.in_grade_sort_num}}<span style="margin-left: 50px">练习次数：{{hInfo.r_count}}</span></p>
            </TabPane>
            <TabPane name="name2" label="近10次平均分">
                <Table :columns="columns2" :data="data2"></Table>
                <p style="margin-top: 16px">当前排名：{{hInfo.in_grade_sort_num}}<span style="margin-left: 50px"> 近10次平均分：{{avgScores}}</span></p>
            </TabPane>
        </Tabs>
        <Tabs v-model="pane2" class="rank-tab" v-if="type == 2" type="card">
            <TabPane name="name1" label="综合排名">
                <Table :columns="columns3" :data="data3"></Table>
                <p style="margin-top: 16px">当前排名：{{hInfo.in_grade_sort_num}}<span style="margin-left: 50px">平均评分：{{avgScores}}</span></p>
            </TabPane>
        </Tabs>
    </Modal>
</template>

<script>
import postData from '../../../api/postData'
    export default {
        props: {
            title: {},
            isShow: {},
            type: {},
            hInfo: {}
        },
        name: '',
        data() {
            return {
                pane: 'name1',
                pane2: 'name1',
                avgScores: 0,
                columns1: [
                    {
                        title: '排名',
                        type: 'index',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '姓名',
                        key: 'realname'
                    },
                    {
                        title: '学习次数',
                        key: 'r_count',
                        align: 'center'
                    },
                ],
                columns2: [
                    {
                        title: '排名',
                        type: 'index',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '名称',
                        key: 'realname'
                    },
                    {
                        title: '近10次平均分',
                        key: 'avg_score',
                        align: 'center'
                    },
                ],
                columns3: [
                    {
                        title: '排名',
                        type: 'index',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '姓名',
                        key: 'realname'
                    },
                    {
                        title: '综合评分',
                        key: 'avg_score',
                        align: 'center'
                    },
                ],
                data1: [],
                data2: [],
                data3: [],
                modal1: false
            }
        },
        watch: {
            isShow(_new){
                this.modal1 = _new
                if(_new) {
                    this.getDate()
                    this.pane = 'name1'
                    this.pane2 = 'name1'
                }
            },
        },
        methods: {
            cancel(){
                this.modal1 = false
                this.$emit("close")
            },
            getList(url, name){
                postData('user/' + url,{grade_id: +this.$route.query.grade_id, student_id: +this.$route.query.id}).then(r => {
                    if(r.res_code ==1){
                        if((url == 'getExerciseAvgScore10' || url == 'getExamSortListByGrade')){
                            this[name] = r.data.result
                            this.avgScores = r.data.studentInfo.avg_score
                        }else this[name] = r.data
                    }
                })
            },
            getDate(){
                if(this.type == 1) {
                    this.getList('getExerciseCountListByGrade', 'data1')
                    this.getList('getExerciseAvgScore10', 'data2')
                }
                if(this.type == 2) this.getList('getExamSortListByGrade', 'data3')
            }
        }
    }
</script>

<style lang="less" scoped>
    /deep/ .rank-tab{
        /deep/ .ivu-tabs-tab{
            width: auto !important;
            height: auto !important;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #474C63;
            letter-spacing: 0;
            padding: 5px 16px 4px !important;
        }
        /deep/ .ivu-tabs-nav-scroll{
            display: flex;
            justify-content: flex-start;
        }
    }
</style>