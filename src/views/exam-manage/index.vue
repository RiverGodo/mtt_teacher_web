<template>
    <div class="user-manage-main">
        <!-- <screen :btn-type="btnType" :typeArr="typeArr" size-title1="考试总数" :size-num1="total" btn-name="创建考试" @selectChange1="selectChange1" @inputChange="inputChange" @handleClick="handleClick"
        placehodle="请输入关键字" :select2Placeholder="select2Placeholder" @selectChange2="selectChange2" :select2="select2"/>
        <Tables :tabel-height="tableHeight" :is-serial=true @operation1="see" @operation2="edit" @operation3="deletes"  :column="columns1" :table-data="list" :select-list="management"/> -->
        <div class="screen">
            <Select v-if="isSuper" @on-change="selectChange1" class="select-list" v-model="organization_id">
                <Option v-for="(item,index) in select1" :value="item.id" :key="index">{{item.title}}</Option>
            </Select>
            <Select @on-change="selectChange2" class="select-list" v-model="room_state">
                <Option v-for="(item,index) in select2" :value="item.id" :key="index">{{item.title}}</Option>
            </Select>
            <div class="screen_input1">
                <Input style="width:300px;margin-left: 10px;" v-model="keyword" @on-change="inputChange()" placeholder="请输入关键字" />
                <Icon type="md-search" slot="prefix"/>
            </div>
            <div class="number1">
                <p>考试总数</p>
                <span>{{total}}</span>
            </div>
            <Button style="margin-right: 20px;" @click="handleClick()" type="primary">创建考试</Button>
        </div>
        <Table :columns="columns1" :data="list">
            <template slot-scope="{ row, index }" slot="operation">
                <div class="action">
                    <span @click="seeModal(row,index)" class="see">查看</span>
                    <span @click="edit(row,index)" v-if="row.state == 0" class="nosee">编辑</span>
                    <span @click="deletes(row,index)" class="nosee">删除</span>
                </div>
            </template>
        </Table>
        <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
    </div>
</template>
<script>
    // import Tables from '../../components/tables.vue'
    // import screen from '../../components/ScreenFrame'
    import postData from 'src/api/postData'
    import pageList from '../../components/Page'
    import pageMixin from '../mixins/pageMixins'

    export default {
        components: { pageList },
        mixins: [pageMixin],
        props: {
            permissionItem1: {
                type: Object,
                default: null
            }
        },
        data (){
            return{
                modalTitle: '',
                tableRow: {},
                tableRowData: {},
                columns1: [
                    {
                        title: '序号', 
                        key: 'index', 
                        align:'center',
                        width: 80
                    },
                    {
                        title: '考试标题',
                        key: 'title',
                        align: 'left',
                        minWidth: 200
                    },{
                        title: '病例数量',
                        key: 'case_count',
                        align:'center',
                        minWidth: 100
                    },
                    {
                        title: '参加人数',
                        key: 'student_count',
                        align:'center',
                        minWidth: 100
                    },
                    {
                        title: '状态',
                        key: 'room_state',
                        minWidth: 100,
                        align:'center',
                        render: (h, param) => {
                                let data = param.row.room_state == 1 ? '考试中' : param.row.room_state == -1 ? '已结束' : '未开始'
                            return h('span', data)
                        }
                    },
                    {
                        title: '开始时间',
                        key: 'start_time',
                        align:'center',
                        minWidth: 200
                    },
                    {
                        title: '结束时间',
                        key: 'end_time',
                        align:'center',
                        minWidth: 200
                    },
                    {
                        title: '创建人',
                        key: 'realname',
                        align:'center',
                        minWidth: 200
                    },
                    {
                        title: '操作',
                        minWidth: 260,
                        slot: 'operation',
                        operationSlice: true,
                        sliceType: 'room_state',
                        operation: [['查看','operation1'], ['编辑','operation2'], ['删除','operation3']],
                    }],
                list:[],
                formList: [
                    { type: 'input', name: '真实姓名',  field: 'realname'},
                    { type: 'input', name: '管理账号',  field: 'username' },
                    { type: 'password', name: '账号密码',  field: 'password' },
                ],
                rules:{
                    realname: [{ required: true, message: '请输入真实姓名', trigger: 'blur' } ],
                },
                data1: null,
                keyword: '',
                operationList: [['查看','operation1'], ['编辑','operation2'], ['删除','operation3']],
                tableHeight: null,
                management: [],
                typeArr: ['isSuper', 'select2', 'input', 'size1', 'button'],
                btnType: true,
                select2Placeholder: '请选择状态',
                organization_id: "all",
                select2: [{title: '全部状态', id: 'all'},{title: '考试中', id: 1}, {title: '已结束', id: 2}, {title: '未开始', id: 0}],
                select1:[{id: 'all', title: '全部机构'}],
                room_state: 'all'
            }
        },
        methods: {
            seeModal(row,rowIndex){
                this.$router.replace({name: 'check-exam', query: {type: 1, id: row.id}})
            },
            edit(row,rowIndex){
                this.$router.replace({name: 'creat-exam', query: {id: row.id, type: 1}})
            },
            deletes(row,rowIndex){
                this.$config.deleteModal(() => {
                    this.$config.fnPost('/v1/exam/removeExam', {id: row.id}, () => { this.getList() })
                })
            },
            inputChange(val){
                // this.keyword = val;
                this.current = 1
                this.getList()
            },
            selectChange1(val) {
                this.organization_id = val
                this.getList()
            },
            selectChange2(val) {
                this.room_state = val 
                this.getList()
            },
            handleClick(){
                this.$router.replace({name: 'creat-exam', query: {type: 1}})
            },
            getList(){
                let d = {
                    keyword: this.keyword,
                    page_size: this.pageSize,
                    page_num: this.current,
                    organization_id: this.$config.getOrganizationId(this.organization_id) == "all" ? null : this.$config.getOrganizationId(this.organization_id),
                    state: this.room_state == "all" ? null : this.room_state
                }
                postData('/v1/exam/getExamList', d).then((res) => {
                    res.data.list.forEach((element,index) => {
                        if (String(index + 1).length == 1) {
                            element.index = '0' + (index + 1) 
                        }else{
                            element.index =  (index + 1)
                        }
                    });
                    this.list = res.data.list
                    this.total = res.data.count
                })
                
            }
        },
        mounted() {
            this.getList()
            this.tableHeight = window.innerHeight - 200
            postData('/v1/common/getOrganizationList').then((res) => {
                // this.formList[1].selectList = res.data
                this.select1 = [{id: 'all', title: '全部机构'},...res.data]
            })
        }
    }
</script>
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
