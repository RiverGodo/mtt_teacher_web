<template>
    <div class="user-manage-main">
        <see :detail-data="tableRowData" title="查看信息" :show-modal='detailShow' @close="close"/>
        <transfer :showTransfer="showTransfer" @transferCancel="transferCancel" :downUrl="downUrl" :mould="mould" type="teacher"/>
        <!-- <FormModal :modal-false="true" :detail-data="tableRow" :show-modal='show' :form-list="formList"
                   @close="closeModal" @from-submit="handleSubmit"
                   :title="modalTitle" :rule-validate='rules'/>
        <screen :btn-type="btnType" :select-type1="selectType1" :typeArr="typeArr" size-title1="老师总数" :size-num1="total"
                btn-name="添加老师" :select2_1="select3" :select2="select2" @selectChange2="selectChange2" @selectChange2_1="selectChange3"
                placehodle="搜索用户ID/姓名" @selectChange1="selectChange1" @inputChange="inputChange"
                @handleClick="handleClick" @handleClick1="transferCancel(true)" btn-name1="导入/导出"/>
        <Tables :tabel-height="tableHeight" :is-serial=true @operation1="see" @operation2="edit" @operation3="deletes"
                :column="columns1" :table-data="list" :select-list="mentor"/> -->
        <div class="screen">
            <Select v-if="isSuper" @on-change="selectChange1" class="select-list" v-model="organization_id">
                <Option v-for="(item,index) in select1" :value="item.id" :key="index">{{item.title}}</Option>
            </Select>
            <Select @on-change="selectChange2" class="select-list" v-model="dept_id">
                <Option v-for="(item,index) in select2" :value="item.id" :key="index">{{item.title}}</Option>
            </Select>
            <Select @on-change="selectChange3" class="select-list" v-model="profession_id">
                <Option v-for="(item,index) in select3" :value="item.id" :key="index">{{item.title}}</Option>
            </Select>
            <div class="screen_input1">
                <Input style="width:300px;margin-left: 10px;" v-model="keyword" @on-change="inputChange()" placeholder="搜索用户ID/姓名" />
                <Icon type="md-search" slot="prefix"/>
            </div>
            <div class="number1">
                <p>老师总数</p>
                <span>{{total}}</span>
            </div>
            <Button style="margin-right: 20px;" @click="transferCancel(true)" type="default">
                <Icon size="18" type="ios-share" /> 导入/导出
            </Button>
            <Button style="margin-right: 20px;" @click="handleClick()" type="primary">添加老师</Button>
        </div>
        <Modal v-model="show" footer-hide :title="modalTitle" width="700px">
            <Form style="padding:50px;width: 645px;" ref="tableRow" :model="tableRow" :rules="modalType == 1 ? rules : rulesEdit" :label-width="80">
                <FormItem label="真实姓名" prop="realname">
                    <Input v-model="tableRow.realname" placeholder="请输入真实姓名" />
                </FormItem>
                <FormItem label="所属机构" prop="organization_id">
                    <Select v-model="tableRow.organization_id" v-if="isDisable == true">
                        <Option v-for="item in formList[1].selectList" :value="item.id" :key="item.id">{{item.title}}</Option>
                    </Select>
                    <p v-else>{{organizationName}}</p>
                </FormItem>
                <FormItem label="科室" prop="dept_id">
                    <Select v-model="tableRow.dept_id">
                        <Option v-for="item in formList[2].selectList" :value="item.id" :key="item.id">{{item.title}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="职称" prop="profession_id">
                    <Select v-model="tableRow.profession_id">
                        <Option v-for="item in formList[3].selectList" :value="item.id" :key="item.id">{{item.title}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="老师账号" prop="username">
                    <Input v-model="tableRow.username" placeholder="请输入老师账号" />
                </FormItem>
                <FormItem label="账号密码" prop="password">
                    <Input type="password" v-if="modalType == 1" v-model="tableRow.password" placeholder="请输入账号密码" />
                    <div v-else class="change_pass">
                        <div v-if="passType == 1" class="change_pass_main">
                            <Input disabled type="password" v-model="tableRow.password" placeholder="请输入账号密码" />
                            <Button @click="changPass()" style="margin-left: 10px;" type="primary">修改密码</Button>
                        </div>
                        <div v-else class="change_pass_main">
                            <Input type="password" v-model="tableRow.password" placeholder="请输入账号密码" />
                            <Button @click="changePassTrue()" style="margin-left: 10px;" type="info">确定</Button>
                            <Button @click="defaultPass()" style="margin-left: 10px;" type="default">取消</Button>
                        </div>
                    </div>
                </FormItem>
                <FormItem>
                    <Button style="margin-left:100px;width: 200px;" type="primary" @click="handleSubmit('tableRow')">保存</Button>
                </FormItem>
            </Form>
        </Modal>
        <Table :columns="columns1" :data="list" height="450">
            <template slot-scope="{ row, index }" slot="operation">
                <div class="action">
                    <span @click="seeModal(row,index)" class="see">查看</span>
                    <span @click="edit(row,index)" class="nosee">编辑</span>
                    <span @click="deletes(row,index)" class="nosee">删除</span>
                </div>
            </template>
        </Table>
        <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
    </div>
</template>
<script>
    // import Tables from '../../../components/tables.vue'
    // import FormModal from '../../../components/FormModal.vue'
    // import screen from '../../../components/ScreenFrame'
    import see from '../../../components/SeeInfo.vue'
    import transfer from '../../../components/transfer'
    import seeMixin from '../Mixins/seeMixin'
    import FormModalMixin from '../Mixins/FormModalMixin'
    import jurisdictionList from '../jurisdictionList'
    import UserMixins from '../Mixins/UserMixins'
    import postData from 'src/api/postData'
    import pageList from '../../../components/Page'
    import pageMixin from '../../mixins/pageMixins'
    import {validatePass, validateUsername3} from '../validate'
    import baseUrl from '../../../../config/url.js'
    import md5 from 'js-md5'

    export default {
        name: "ManagementList",
        components: { see, pageList, transfer},
        mixins: [seeMixin, FormModalMixin, UserMixins, pageMixin],
        props: {
            permissionItem3: {
                type: Object,
                default: null
            }
        },
        watch: {
            permissionItem3(_new) {
                // this.handleAuth(_new)
            }
        },
        data() {
            return {
                profession_id: 'all',
                dept_id: 'all',
                select1: [{id: 'all', title: '全部机构'}],
                select2: [{id: 'all', title: "全部科室"}],
                select3: [{id: 'all', title: "全部职称"}],
                mould: 'http://jhyl-static-file.oss-cn-hangzhou.aliyuncs.com/user_task/20200219103219.xls',
                modalTitle: '',
                modalType:1,
                passType:1,
                typeArr: ['isSuper', 'input', 'size1', 'button', 'button1', 'select2', 'select2_1'],
                tableRow: {},
                tableRowData: {},
                selectType1: false,
                keyword: '',
                organization_id: 'all',
                list: [],
                operationList: [['查看', 'operation1'], ['编辑', 'operation2'], ['删除', 'operation3']],
                formList: [
                    {type: 'input', name: '真实姓名', field: 'realname'},
                    {
                        type: 'select', name: '所属机构', field: 'organization_id',
                        selectList: [], selectField: ['id', 'title']
                    },
                    {
                        type: 'select', name: '科室', field: 'dept_id',
                        selectList: [], selectField: ['id', 'title']
                    },
                    {
                        type: 'select', name: '职称', field: 'profession_id',
                        selectList: [], selectField: ['id', 'title']
                    },
                    {type: 'input', name: '老师账号', field: 'username'},
                    {type: 'password', name: '账号密码', field: 'password'},
                ],
                rules: {
                    realname: [{required: true, message: '请输入真实姓名', trigger: 'blur'}],
                    dept_id: [{required: true, message: '请选择科室'}],
                    profession_id: [{required: true, message: '请选择职称'}],
                    username: [{required: true, validator: validateUsername3}],
                    password: [{required: true, validator: validatePass}],
                    organization_id: [{required: true, message: '请选择机构'}],
                },
                rulesEdit:{
                    realname: [{required: true, message: '请输入真实姓名', trigger: 'blur'}],
                    dept_id: [{required: true, message: '请选择科室'}],
                    profession_id: [{required: true, message: '请选择职称'}],
                    username: [{required: true, validator: validateUsername3}],
                    organization_id: [{required: true, message: '请选择机构'}],
                },
                showTransfer: false,
                oldteachername:'',
                 isDisable:true,
                organizationName:'',
                status:1,
            }
        },
        computed: {
            downUrl() {
                let orgtype = ''
                if (this.organization_id != 'all') {
                    orgtype  = this.organization_id
                }
                let word = (this.keyword || orgtype) ? '?' + this.keyword ? orgtype? `keyword=${this.keyword}&organization_id=${orgtype}` : `keyword=${this.keyword}` :`organization_id=${orgtype}` : ''
                return  baseUrl + 'user/exportTeachersToExcel' + word + (word.includes('?') ? '&' : '?') +`token=${sessionStorage.getItem('token')}`
            },
            columns1() {
                return [
                    {
                        title: '序号', 
                        key: 'index', 
                        align:'center',
                        width: 80
                    },
                    {
                        title: '用户ID',
                        key: 'username',
                        align: 'left',
                        tooltip: 'true',
                        minWidth: 100
                    }, {
                        title: '真实姓名',
                        key: 'realname',
                        minWidth: 100,
                        tooltip: 'true'
                    },
                    {
                        key: 'role',
                        title: '身份',
                        minWidth: 100,
                    },
                    { title: '所属机构', key: 'organization_name', align: 'left', minWidth: 100, tooltip: 'true'},
                    { title: '科室', key: 'dept_name', align: 'left', minWidth: 100,tooltip: 'true' },
                    { title: '职称', key: 'profession_name', align: 'left', minWidth: 100,tooltip: 'true'},
                    { title: '出病例', key: 'case_count', align: 'left', minWidth: 120, "sortable": true },
                    { title: '出提纲', key: 'outline_count', align: 'left', minWidth: 120, "sortable": true},
                    {
                        title: '最近登录时间',
                        key: 'last_login_time',
                        align: 'left',
                        minWidth: 190,
                        tooltip: 'true'
                    },
                    {
                        title: '操作',
                        minWidth: 260,
                        slot: 'operation',
                        align: 'left',
                        operation: [['查看', 'operation1'], ['编辑', 'operation2'], ['删除', 'operation3']],
                    }]
            }
        },
        methods: {
            changPass(){
                this.passType = 2
                this.tableRow.password = ""
            },
            defaultPass(){
                this.passType = 1
                this.tableRow.password = "////////"
            },
            changePassTrue(){
                let value = this.tableRow.password
                if (value == ''||value == undefined){
                this.$Message.error('请输入账号密码');
                } else {
                    var filter=/^[a-zA-Z0-9]{6,12}$/; 
                    if(filter.test(value)){
                    postData("/v1/user/modifyTeacher",{id:this.tableRow.id,password:md5(this.tableRow.password)}).then(res => {
                        if (res.res_code == 1) {
                            this.$Message.success("保存成功")
                            this.defaultPass()
                        } else {
                            this.$Message.error(res.msg);
                        }
                    })
                    } else {
                    this.$Message.error('请输入至少6位最多12位的字母或数字');
                    }
                }
            },
            transferCancel(val, data) {
                this.showTransfer = val
                if(data) this.getList()
            },
            seeModal(row, rowIndex) {
                sessionStorage.setItem('MentorDerails', JSON.stringify(row))
                window.open('/dashboard/mentor-derails')
            },
            edit(row, rowIndex) {
                this.oldteachername = row.username
                this.modalTitle = '编辑老师'
                this.modalType = 2
                this.show = true
                this.tableRow = {
                    realname: row.realname,
                    username: row.username,
                    password: row.password,
                    id: row.id,
                    organization_id: row.organization_id,
                    dept_id: row.dept_id,
                    profession_id: row.profession_id
                }
                this.defaultPass()
                this.setOrganization()
            },
            deletes(row, rowIndex) {
                let de = () => {
                    this.fromAddAndEdit('v1/user/removeAdmin', {id: row.id})
                }
                this.$config.deleteModal(de)
            },
            selectChange1(val) {
                this.organization_id = val
                this.getList()
            },
            selectChange2(val){
                this.dept_id = val
                this.getList()
            },
            selectChange3(val){
                this.profession_id = val
                this.getList()
            },
            inputChange(val) {
                // this.keyword = val
                this.current = 1
                this.getList()
            },
            setOrganization() {
                if (this.organizationList) {
                    this.$nextTick(() => {
                        this.formList[1].selectList = this.organizationList
                    })
                }
            },
            handleClick() {
                this.modalTitle = '添加老师'
                this.modalType = 1
                this.show = true
                this.tableRow = {}
                this.setOrganization()
            },
            getList() {
                let role_id = JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id
                let org = role_id === 1 ? this.organization_id : this.getOrganizationId
                let d = {
                    keyword: this.keyword,
                    page_size: this.pageSize,
                    page_num: this.current,
                    organization_id: org == 'all' ? null : org,
                    dept_id: this.dept_id == 'all' ? null : this.dept_id,
                    profession_id: this.profession_id == 'all' ? null : this.profession_id
                }
                postData('/v1/user/getTeacherList', d).then((res) => {
                    if (res.res_code == 1) {
                        res.data.list.forEach((element,index) => {
                            if (String(index + 1).length == 1) {
                                element.index = '0' + (index + 1) 
                            }else{
                                element.index =  (index + 1)
                            }
                        });
                        this.list = res.data.list
                        this.total = res.data.count
                    }
                })
                postData('/v1/common/getOrganizationList').then((res) => {
                    //判断机构id权限
                    if(role_id == 2 || role_id == 3){
                        this.isDisable = false
                        res.data.forEach((element) =>{
                            let orgId = sessionStorage.getItem('organizationId')
                            if(orgId == element.id){
                                this.organizationName = element.title
                            }
                        })
                        this.status = 2
                    }else if(role_id == 1){
                        this.isDisable = true
                        this.status = 1
                    }
                })
            },
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let d = this.tableRow
                        if (this.oldteachername == d.username) {
                            d.username = null
                        }
                        d.password = md5(d.password)
                        if (this.modalType !== 1) {
                            delete d.password
                        }
                        if (this.role_id != 1) d.organization_id = +sessionStorage.getItem('organizationId')
                        if (this.modalType == 1) this.fromAddAndEdit('/v1/user/addTeacher', d)
                        else this.fromAddAndEdit('/v1/user/modifyTeacher', d)
                    }
                })
            },
            getData() {
                postData('/v1/common/getOrganizationList').then((res) => {
                    this.formList[1].selectList = res.data
                    this.select1 = [{id: 'all', title: '全部机构'},...res.data]
                })
                postData('/v1/common/getDeptList').then(res => {
                    this.formList[2].selectList = res.data
                    this.select2 = [{id: 'all', title: "全部科室"}, ...res.data]
                })
                postData('/v1/common/getProfessionList').then(res => {
                    this.formList[3].selectList = res.data
                    this.select3 = [{id: 'all', title: "全部职称"}, ...res.data]
                })
            }
        },
        mounted() {
            this.getList()
            // if(this.permissionItem3) this.handleAuth(this.permissionItem3)
            this.organization_id = +sessionStorage.getItem('organizationId')
            this.getData()
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
    .select-list{
        width: 200px;
        /* min-width: 200px; */
        margin-left: 10px;
        /deep/ .ivu-select-selection{
            border-radius: 100px;
        }
        /deep/ .ivu-select-selected-value{
            padding-left: 20px;
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
        /deep/ .ivu-select-placeholder{
            padding-left: 20px !important;
        }
    }
    .change_pass_main{
        display: flex;
        align-items: center;
    }
</style>
