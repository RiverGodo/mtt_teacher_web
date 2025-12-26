<template>
    <div class="user-manage-main">
        <Tabs class="tab-name" value="name1">
            <TabPane label="分配病例" name="name1">
                <div class="main-view">
                    <div class="table-view">
                        <!-- <screen :selectSubjects="true" :btn-type="btnType" @handleBack="handleBack" @selectChange3="selectChange3"
                        :select-type1="selectType1" :typeArr="typeArr" size-title1="机构病例" :size-num1="counts" btn-name="保存"
                        :select2_2="selectState" @selectChange2_2="selectChange2_2" :visibilityBtn="visibilityBtn"
                        searchDropDownPlaceholder="请输入症状关键词（多选）" @searchDropDownChange="searchDropDownChange"
                        :searchDropDown="symptom"
                        :select2_1="difficultyList" @selectChange2_1="selectChange2_1" @handleClick="handleClick"/>
                        <Tables :tabel-height="tableHeight" isSelection :is-serial=true @operation1="see"
                                :column="columns1" :table-data="list" @on-select-all="selectTables" @select-tables="selectTables"/> -->
                        <div class="screen">
                            <div @click="handleBack" class="back">
                                <img src="../../../../assets/icons/icon/back.png" alt="">
                                <p>返回</p>
                            </div>
                            <Select @on-change="selectChange3" class="select-list" v-model="patient_division">
                                <Option v-for="(item,index) in select3" :value="item.title" :key="index">{{item.title}}</Option>
                            </Select>
                            <Select @on-change="selectChange2_1" class="select-list" v-model="degree">
                                <Option v-for="(item,index) in difficultyList" :value="item.id" :key="index">{{item.title}}</Option>
                            </Select>
                            <Select @on-change="selectChange2_2" class="select-list" v-model="is_distribution">
                                <Option v-for="(item,index) in selectState" :value="item.id" :key="index">{{item.title}}</Option>
                            </Select>      
                            <Select @on-change="searchDropDownChange" style="width: 500px;" class="select-list" v-model="searchDrop" multiple filterable remote :remote-method="remoteMethod1" placeholder="请输入症状关键词（多选）" :loading="loading1">
                                <Option v-for="(option, index) in options1" :value="option.id" :key="index">{{option.title}}</Option>
                            </Select>
                            <div class="number1">
                                <p>机构病例</p>
                                <span>{{select_count}}</span>
                                <p style="margin: 0; color: #9397AD;">/{{total}}</p>
                            </div>
                            <Button v-if="visibilityBtn == 'btn-visible'" style="margin-right: 20px;" @click="handleClick()" type="primary">保存</Button>
                        </div>
                        <Table style="min-height:500px" @on-selection-change="selectTables" :columns="columns1" :data="list">
                            <template slot-scope="{ row, index }" slot="operation">
                                <div class="action">
                                    <span @click="seeModal(row,index)" class="see">查看</span>
                                </div>
                            </template>
                        </Table>
                        <page-list class="page-main" :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
                    </div>
                    <!-- <div class="mechanism-view">
                        <p class="tit">选择分配机构</p>
                        <Input v-model="serach" placeholder="搜索机构名称" style="width: 240px;margin-bottom: 15px" />
                        <div class="mechanism-list">
                            <div v-for="(t,i) in mechanismList" :key="i" class="mechanism-item">
                                <Checkbox @on-change='selMech($event, t, i)' v-model="t.check"><p class="me-title"> {{t.title}}</p></Checkbox>
                            </div>
                        </div>
                        <div class="foot">
                            <Button style="width: 120px" type="primary">分配</Button>
                        </div>
                    </div> -->
                </div>
            </TabPane>
            <!-- <TabPane label="分配提纲" name="name2"></TabPane> -->
        </Tabs>
    </div>
</template>
<script>
    // import Tables from 'components/tables.vue'
    // import screen from 'components/ScreenFrame'
    import jurisdictionList from '../../jurisdictionList'
    import UserMixins from '../../Mixins/UserMixins'
    import postData from 'src/api/postData'
    import pageList from 'components/Page'
    import pageMixin from '../../../mixins/pageMixins'

    export default {
        name: "ManagementList",
        components: {pageList},
        mixins: [UserMixins, pageMixin],
        data() {
            return {
                serach: '',
                mechanismList: [],
                typeArr: ['select2_1', 'searchDropDown', 'size1', 'back', 'button', 'select2_2'],
                selectState: [{id: 'all', title: '全部状态'}, {id: 0, title: '未分配'}, {id: 1, title: '已分配'}],
                selectType1: false,
                organization_id: '',
                list: [],
                symptom: [],
                difficultyList: [{id: 'all', title: '全部难度'}, {id: 1, title: '简单'}, {id: 2, title: '适中'}, {
                    id: 3,
                    title: '困难'
                }],
                operationList: [['查看', 'operation1']],
                symptomList: [],
                degree: "all",
                counts: 0,
                visibilityBtn: 'btn-hide',
                patient_division: "全部科室",
                selectionList: [],
                select_count: 0,
                is_distribution: "all",
                select_case_ids: [],
                select3:[{id: 'all', title: '全部科室'}],
                searchDrop: [],
                loading1:false,
                 options1:[]
            }
        },
        computed: {
            columns1() {
                return [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '序号', 
                        key: 'index', 
                        align:'center',
                        width: 80
                    },
                    {
                        title: '症状',
                        key: 'symptom',
                        align: 'left',
                        minWidth: 200
                    },
                    {
                        title: '所属科室',
                        key: 'dept_name',
                        align: 'left',
                        minWidth: 150
                    },
                    // {
                    //     title: '适用人群',
                    //     key: 'realname',
                    //     align: 'left',
                    //     minWidth: 100
                    // },
                    {
                        title: '难度',
                        key: '',
                        minWidth: 80,
                        align:'center',
                        render: (h, params) => {
                            let sex = params.row.degree == 1 ? '简单' : params.row.degree == 2 ? '适中' : '困难'
                            return h('span', sex)
                        }
                    },
                    {
                        title: '患者姓名',
                        key: 'patient_name',
                        align:'center',
                        minWidth: 100
                    },
                    {
                        title: '性别',
                        key: '',
                        align:'center',
                        minWidth: 80,
                        render: (h, params) => {
                            let sex = this.$config.setSex(params.row.patient_gender)
                            return h('span', sex)
                        }
                    },
                    // {
                    //     title: '年龄',
                    //     key: 'patient_age',
                    //     align:'center',
                    //     minWidth: 80,
                    //     render: (h, params) => {
                    //         return h('span', params.row.patient_age.replace(/年/, '岁'))
                    //     }
                    // },
                    {
                        title: '状态',
                        key: '',
                        align:'center',
                        minWidth: 100,
                        render: (h, params) => {
                            return h('span', {style: params.row.is_distribution ? {color: '#4098FF'} : {}}, params.row.is_distribution ? '已分配' : '未分配')
                        }
                    },
                    {
                        title: '操作',
                        minWidth: 100,
                        slot: 'operation',
                        align: 'left',
                        operation: [['查看', 'operation1']],
                    }]
            }
        },
        beforeDestroy() {
            this.see = null;
            this.deletes = null;
            this.getList = null;
        },
        methods: {
            selMech(bool, t, i){
                console.log(bool, t, i);
            },
            setInit() {
                this.visibilityBtn = 'btn-visible'
            },
            selectTables(selection) {
                let list = []
                selection.forEach(item => {
                    list.push(item.id)
                })
                this.list.forEach((item1, index1) => {
                    if(list.indexOf(item1.id) == -1) {
                        if(this.select_case_ids.indexOf(item1.id) !== -1) {
                            this.select_case_ids.splice(this.select_case_ids.indexOf(item1.id), 1)
                        }
                    }else{
                        if(this.select_case_ids.indexOf(item1.id) == -1) {
                            this.select_case_ids.push(item1.id)
                        }
                    }
                })
                // console.log(this.list);
                // this.selectionList = selection
                this.setInit()
            },
            // onSelectAll(selection) {
            //     console.log(this.list,selection);
            //     this.selectionList = selection
            //     this.setInit()
            // },
            //查看
            seeModal(row, rowIndex) {
                let routeData = this.$router.resolve({ query: {case_id: row.id}, name: "view-cases" });
                window.open(routeData.href, "_blank")
            },
            selectChange3(val) {
                this.patient_division = val
                this.getList()
            },
            selectChange2_1(val) {
                this.degree = val
                this.getList()
            },
            selectChange2_2(val) {
                this.is_distribution = val;
                this.getList()
            },
            searchDropDownChange(val) {
                this.symptomList = val;
                this.getList()
            },
            setSeldata(d) {
                let arr = []
                d.map(t => {
                    arr.push(t.id)
                })
                return arr
            },
            handleClick() {
                // if(this.selectionList.length>0){
                let d = {
                    // cases_ids: this.selectionList.length > 0 ? this.setSeldata(this.selectionList) : [],
                    select_case_ids: this.select_case_ids,
                    organization_ids: [+this.$route.query.organization_id],
                }
                postData('user/divideCases', d).then((res) => {
                    if (res.res_code == 1) {
                        this.$Message.success('病例分配成功')
                        this.getList()
                    }
                })
                // }else this.$Message.success('请选择病例')
            },
            getList() {
                let d = {
                    page_size: this.pageSize,
                    page_num: this.current,
                    symptom: this.symptomList,
                    organization_id: +this.$route.query.organization_id,
                    degree: this.degree == "all" ? null : this.degree,
                    patient_division: this.patient_division == "全部科室" ? null : this.patient_division,
                    is_distribution: this.is_distribution == 'all' ? null : this.is_distribution,
                }
                postData('/v1/organization/getOrgCaseList', d).then((res) => {
                    if (res.res_code == 1) {
                        res.data.list.forEach((element,index) => {
                            if (String(index + 1).length == 1) {
                                element.index = '0' + (index + 1) 
                            }else{
                                element.index =  (index + 1)
                            }
                        });
                        // console.log(res.data,'getCasesForBatchDistribute');
                        this.select_case_ids = res.data.select_case_ids
                        this.list = res.data.list
                        // this.list.map((item, index) => {
                        //     if(this.select_case_ids.indexOf(item.id) == -1) item.is_distribution = 0
                        //     else this.list[index].is_distribution = 1
                        // })
                        this.total = res.data.count
                        this.select_count = res.data.select_count
                        this.counts = this.select_count + '/' + this.total
                        if (this.list.length > 0) {
                            this.list.map((t) => {
                                t._checked = t.is_distribution ? true : false
                            })
                        }
                    }
                })
            },
            handleBack() {
                this.$router.push({name: 'user-manage'})
            },
            getSymptom() {
                postData('common/getSymptoms').then((res) => {
                    if (res.res_code == 1) {
                        this.symptom = res.data
                        if (this.symptom.length > 0) {
                            this.symptom.map((t) => {
                                t.id = t.symptom
                                t.title = t.symptom
                            })
                        }
                    }
                })
                postData('/v1/common/getDeptList').then((res) => {
                    this.select3 = [{id: 'all', title: '全部科室'}, ...res.data]
                })
            },
            getOrganization(){
                postData('/v1/common/getOrganizationList').then((res) => {
                    this.mechanismList = res.data
                    this.mechanismList.map((t) => {
                        t.check = false
                    })
                })
            },
            // 付费学员返回事件，click触发，选中返回true
            remoteMethod1(query){
                if (query !== '') {
                    this.loading1 = true;
                    setTimeout(() => {
                        this.loading1 = false;
                        const list = this.symptom.filter(item => {
                            if(item.title.includes(query)){
                                return {
                                    id: item.id,
                                    title: item.title.length>4 ? item.title.slice(0,4)+'...' : item.title
                                }
                            }
                        });
                        this.options1 = list || []
                    }, 200);
                } else {
                    this.options1 = [];
                }
            },
        },
        mounted() {
            this.tableHeight = window.innerHeight - 260
            this.getSymptom()
            this.getList()
            this.getOrganization()
        }
    }
</script>
<style lang="less" scoped>
/deep/ .ivu-checkbox-wrapper{
    justify-content: center;
}
/deep/ .ivu-checkbox-wrapper{
    display: flex !important;
    align-items: center;
}
.tab-name, /deep/.ivu-tabs-content, .user-manage-main{
    height: 100% !important;
}
.main-view{
    display: flex;
    width: 100%;
    height: 100%;
    .table-view{
        // width: calc(100% - 260px);
        width: 100%;
        height: 100%;
    }
    .mechanism-view{
        width: 260px;
        height: calc(100% - 50px);
        background-color: #252f60;
        display: flex;
        flex-direction: column;
        align-items: center;
        .tit{
            font-family: PingFangSC-Medium;
            color: #fff;
            margin: 15px 0;
            height: 20px;
        }
        .mechanism-list{
            flex: 1;
            overflow-y: auto;
            width: 240px;
            background-color: #fff;
            .mechanism-item{
                display: flex;
                padding: 10px;
            }
            .me-title{
                white-space: nowrap;
                overflow: hidden;
                width: 180px;
                text-overflow: ellipsis;
                margin-left: 10px;
                text-align: left;
            }
        }
        .foot{
            width: 240px;
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            font-size: 16px;
            font-family: PingFangSC-Medium;
            background-color: #fff;
            border-top: 1px solid #f0f0f7;
            margin-bottom: 20px;
        }
    }
}
</style>
<style lang="less" scoped>
    .action{
       display: flex;
       align-items: center;
       span{
           cursor: pointer;
           color: #4098FF;
           margin-right: 10px;
       }
       .nosee{
           display: none;
       }
    }
    .action:hover{
        span{
            display: block;
        }
    }
    .screen{
        display: flex;
        align-items: center;
        background: #F0F0F7;
        height: 66px;
        .screen_input1{
            display: flex;
            align-items: center;
            position: relative;
        }
        .number1{
            display: flex;
            align-items: center;
            margin-right: auto;
            min-width: 150px;
            p{
                font-family: PingFangSC-Regular;
                font-size: 16px;
                color: #474C63;
                letter-spacing: 0;
                margin-left: 10px;
            }
            span{
                font-family: PingFangSC-Regular;
                font-size: 16px;
                color: #4098FF;
                letter-spacing: 0;
                margin-left: 10px;
            }
        }
        /deep/ .ivu-input{
            border-radius: 100px !important;
            padding-left: 40px;
            font-size: 16px !important;
        }
        /deep/ .ivu-icon-md-search{
            font-size: 20px;
            position: absolute;
            left: 25px;
        }
        .back{
                display: flex;
                justify-content: center;
                align-items: center;
                margin-left: 30px;
                cursor: pointer;
            img{
                width: 23px;
                // height: 19px;
            }
            p{
                margin-left: 10px;
                font-family: PingFangSC-Regular;
                font-size: 16px;
                color: #474C63;
                letter-spacing: 0;
                min-width: 32px;
            }
        }
    }
    .select-list{
        width: 200px;
        /* min-width: 200px; */
        margin-left: 10px;
        /deep/ .ivu-select-selection{
            border-radius: 100px;
        }
        /deep/ .ivu-select-selected-value{
            padding-left: 20px !important;
        }
        /deep/ .ivu-select-placeholder{
            padding-left: 20px !important;
        }
    }
</style>
