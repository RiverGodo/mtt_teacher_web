<template>
   <div class="user-manage-main">
	    <transfer :showTransfer="showTransfer" @transferCancel="transferCancel" :downUrl="downUrl" :mould="mould"/>
        <!-- <comparison :show="showComparison" @close="close" /> -->
        <!-- <FormModal :modal-false="true"  :detail-data="tableRow" :show-modal='show' :form-list="formList" @close="closeModal" @from-submit="handleSubmit" @change-list="changeList"  modalText="*学员账号为证件号，密码是证件号后四位"   :title="modalTitle" :rule-validate='rules'/>
        <screen :btn-type="btnType" :select-type1="selectType1" :typeArr="typeArr" size-title1="学员总数" :size-num1="total" btn-name="添加学员"
                @handleClick1="transferCancel(true)" btn-name1="导入/导出"  placehodle="搜索用户ID/姓名/证件号"   @selectChange1="selectChange1"  @inputChange="inputChange"
                :select2_1="select3" :select2="select2" @selectChange2="selectChange2" @selectChange2_1="selectChange3"
                :select2_2="select4" @selectChange2_2="selectChange4" @handleClick="handleClick"/>
        <Tables :tabel-height="tableHeight" :is-serial=true @operation1="see" @operation2="deletes"  @table-swtich="tableSwtich" :column="columns1" :table-data="list"  :select-list="student"/> -->
        <div class="screen">
            <Select v-if="isSuper" @on-change="selectChange1" class="select-list" v-model="organization_id">
                <Option v-for="(item,index) in select1" :value="item.id" :key="index">{{item.title}}</Option>
            </Select>
            <Select @on-change="selectChange2" class="select-list" v-model="grade_id">
                <Option v-for="(item,index) in select2" :value="item.id" :key="index">{{item.title}}</Option>
            </Select>
            <Select @on-change="selectChange3" class="select-list" v-model="dept_id">
                <Option v-for="(item,index) in select3" :value="item.id" :key="index">{{item.title}}</Option>
            </Select>
            <Select @on-change="selectChange4" class="select-list" v-model="student_type_id">
                <Option v-for="(item,index) in select4" :value="item.id" :key="index">{{item.title}}</Option>
            </Select>
            <div class="screen_input1">
                <Input style="width:260px;margin-left: 10px;" v-model="keyword" @on-change="inputChange()" placeholder="搜索用户ID/姓名/证件号" />
                <Icon type="md-search" slot="prefix"/>
            </div>
            <div class="number1">
                <p>学员总数</p>
                <span>{{total}}</span>
            </div>
            <Button style="margin-right: 20px;" @click="transferCancel(true)" type="default">
                <Icon size="18" type="ios-share" /> 导入/导出
            </Button>
            <Button style="margin-right: 20px;" @click="handleClick()" type="primary">添加学员</Button>
        </div>
        <Modal v-model="show" footer-hide :title="modalTitle" width="700px">
            <Form style="padding:40px;width: 645px;" ref="tableRow" :model="tableRow" :rules=" status== 1 ? rules : rules1" :label-width="100">
                <FormItem label="真实姓名" prop="realname">
                    <Input v-model="tableRow.realname" placeholder="请输入真实姓名" />
                </FormItem>
                <FormItem label="性别" prop="sex">
                    <RadioGroup v-model="tableRow.sex">
                        <Radio label="1">
                            <span>男</span>
                        </Radio>
                        <Radio label="0">
                            <span>女</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="所属机构" prop="organization_id">
                    <Select placeholder="请选择所属机构" v-model="tableRow.organization_id" v-if="isDisable == true">
                        <Option v-for="item in orgList" :value="item.id" :key="item.id">{{item.title}}</Option>
                    </Select>
                     <p v-else>{{organizationName}}</p>
                </FormItem>
                <FormItem label="年级/班级" prop="grade_id">
                    <Select placeholder="请选择年级/班级" v-model="tableRow.grade_id">
                        <Option v-for="item in gradeList" :value="item.id" :key="item.id">{{item.title}}</Option>
                        <!-- <Option v-for="item in select2" :value="item.id" :key="item.id">{{item.title}}</Option> -->
                    </Select>
                </FormItem>
                <FormItem label="科室" prop="dept_id">
                    <Select placeholder="请选择科室" v-model="tableRow.dept_id">
                        <Option v-for="item in deptList" :value="item.id" :key="item.id">{{item.title}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="学员类型" prop="student_type_id">
                    <Select placeholder="请选择学员类型" v-model="tableRow.student_type_id">
                        <Option v-for="item in stuTypeList" :value="item.id" :key="item.id">{{item.title}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="证件类型" prop="id_type">
                    <Select placeholder="请选择证件类型" @on-change="changeList" v-model="tableRow.id_type">
                        <Option v-for="item in idType" :value="item.id" :key="item.id">{{item.title}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="证件号码" prop="id_num">
                    <Input v-model="tableRow.id_num" placeholder="请输入证件号码" />
                </FormItem>
                <p class="middle_p">*学员账号为证件号，密码是证件号后四位</p>
                <FormItem>
                    <Button style="margin-left:100px;width: 200px;" type="primary" @click="handleSubmit('tableRow')">保存</Button>
                </FormItem>
            </Form>
        </Modal>
        <Table :columns="columns1" :data="list">
            <template slot-scope="{ row, index }" slot="operation">
                <div class="action">
                    <span @click="seeModal(row,index)" class="see">查看</span>
                    <Switch size="large" v-model="row.states" @on-change="tableSwtich(row)" class="nosee">
                        <p slot="open">正常</p>
                        <p slot="close">停用</p>
                    </Switch>
                    <span @click="deletes(row,index)" class="nosee">删除</span>
                </div>
            </template>
        </Table>
       <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
   </div>
</template>
<script>
//   import Tables from '../../../components/tables.vue'
//   import FormModal from '../../../components/FormModal.vue'
//   import screen from '../../../components/ScreenFrame'
  import FormModalMixin from '../Mixins/FormModalMixin'
  import jurisdictionList from '../jurisdictionList'
  import UserMixins from '../Mixins/UserMixins'
  import seeMixin from '../Mixins/seeMixin'
  import postData from 'src/api/postData'
  import pageList from '../../../components/Page'
  import pageMixin from '../../mixins/pageMixins'
//   import pk from '../../../assets/img/pk.png'
//   import comparison from './comparison'
  import transfer from '../../../components/transfer'
  import baseUrl from '../../../../config/url.js'

  let role_id = JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id
  const IDTYPE = [{id: 1, title: '身份证'},{id: 2, title: '工作证'},{id: 3, title: '手机号'},{id: 4, title: '学生证'},{id: 5, title: '护照'}]
  export default {
    name: "ManagementList",
    components: { pageList, transfer },
    mixins: [ FormModalMixin, UserMixins, pageMixin, seeMixin],
    props: {
        permissionItem4: {
            type: Object,
            default: null
        }
    },
    watch: {
        permissionItem4(_new){
            // this.handleAuth(_new)
        }
    },
    data (){
        const validateCheck = (rule, value, callback) => {
            console.log(this.caccval);
            let ID = /^(^\d{18}$|^\d{17}(\d|X|x))$/;
            let passport = /^1[45][0-9]{7}$|([P|p|S|s]\d{7}$)|([S|s|G|g]\d{8}$)|([Gg|Tt|Ss|Ll|Qq|Dd|Aa|Ff]\d{8}$)|([H|h|M|m]\d{8,10})$/;
            let JobNum = /^[a-zA-Z0-9]{4,}$/;
            let phone = /^[1]([3-9])[0-9]{9}$/;
            if (value == ''||value == undefined) {
                callback(new Error('请输入证件号码'));
            } else if (this.caccval == 1) {
                if(ID.test(value)) callback();
                else callback(new Error('请输入正确的身份证号码'));
            } else if (this.caccval == 2||this.caccval == 4) {
                let text = this.caccval == 2 ? '工作证' : '学生证'
                if(JobNum.test(value)) callback();
                else callback(new Error('请输入正确的'+text));
            } else if (this.caccval == 3) {
                if(phone.test(value)) callback();
                else callback(new Error('请输入正确的手机号'));
            }else if (this.caccval == 5) {
                if(passport.test(value)) callback();
                else callback(new Error('请输入正确的护照号码'));
            }
        };
        const realnameItem = { type: 'input', name: '真实姓名',  field: 'realname'}
        const sexItem =  { type: 'radio', name: '性别', selectField: [ 'id','name' ], field: 'sex',selectList: [{id: 1, name: '男'}, {id: 0, name: '女'}] }
        const organizationItem = { type: 'select', name: '所属机构', field: 'organization_id' ,
                selectList: [], selectField: [ 'id','title' ]
        }
        const formItem = role_id == 1 ? [realnameItem, sexItem, organizationItem] : [realnameItem, sexItem]
        return{
            grade_id: 'all',
            dept_id: 'all',
            student_type_id: 'all',
            select1: [{id: 'all', title: '全部机构'}],
            select2: [{id: 'all', title: "年级/班级"}],
            select3: [{id: 'all', title: "全部科室"}],
            select4: [{id: 'all', title: "全部类型"}],
			mould: 'http://jhyl-static-file.oss-cn-hangzhou.aliyuncs.com/user_task/20200219103242.xls',
            showComparison: false,
            modalTitle: '',
            tableRow: {},   
			showTransfer: false,
            tableRowData: {},
            selectType1: false,
            keyword: '',
            organization_id:'all',
            list: [],
            operationList: [['查看','operation1']],
            caccval: null,
            formList: [
                ...formItem,
                { type: 'select', name: '年级/班级', field: 'grade_id' ,
                    selectList: [], selectField: [ 'id','title' ]
                },
                { type: 'select', name: '科室', field: 'dept_id' ,
                    selectList: [], selectField: [ 'id','title' ]
                },
                { type: 'select', name: '学员类型', field: 'student_type_id' ,
                    selectList: [], selectField: [ 'id','title' ]
                },
                { type: 'select', name: '证件类型', field: 'id_type' , selectChange: true,
                    selectList: IDTYPE, selectField: [ 'id','title' ]
                },
                { type: 'input', name: '证件号码',  field: 'id_num'}
            ],
            rules:{
                sex: [{ required: true, message: '请选择性别'}],
                realname: [{ required: true, message: '请输入真实姓名', trigger: 'blur' } ],
                organization_id: [{ required: true, message: '请选择机构' } ],
                id_type: [{ required: true, message: '请选择证件类型' } ],
                grade_id: [{ required: true, message: '请选择年级/班级' } ],
                dept_id: [{ required: true, message: '请选择科室' } ],
                student_type_id: [{ required: true, message: '请选择学员类型' } ],
                id_num: [{ required: true, validator: validateCheck, } ],
            },
            rules1:{
                sex: [{ required: true, message: '请选择性别'}],
                realname: [{ required: true, message: '请输入真实姓名', trigger: 'blur' } ],
                organization_id: [{ required: false, message: '请选择机构' } ],
                id_type: [{ required: true, message: '请选择证件类型' } ],
                grade_id: [{ required: true, message: '请选择年级/班级' } ],
                dept_id: [{ required: true, message: '请选择科室' } ],
                student_type_id: [{ required: true, message: '请选择学员类型' } ],
                id_num: [{ required: true, validator: validateCheck, } ],
            },
            //是否展示所属机构
            isDisable:true,
            organizationName:'',
            status:1,
            idType:[{id: 1, title: '身份证'},{id: 2, title: '工作证'},{id: 3, title: '手机号'},{id: 4, title: '学生证'},{id: 5, title: '护照'}],
            orgList:[],
            gradeList:[],
            deptList:[],
            stuTypeList:[],
        }
    },
    computed: {
		downUrl() {
            let orgtype = ''
            if (this.organization_id != 'all') {
                orgtype  = this.organization_id
            }
		    let word = (this.keyword || orgtype) ? '?' + this.keyword ? orgtype? `keyword=${this.keyword}&organization_id=${orgtype}` : `keyword=${this.keyword}` :`organization_id=${orgtype}` : ''
		    return  baseUrl + 'user/exportStudentsToExcel' + word + (word.includes('?') ? '&' : '?') +`token=${sessionStorage.getItem('token')}`
		},
         typeArr(){
             let d = ['isSuper','input','size1', 'button1', 'select2', 'select2_1', 'select2_2'];
             return (this.role_id == 1 || this.role_id == 2) ? [...d,,'button'] : d
         },
         columns1(){
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
            },{
                title: '真实姓名',
                key: 'realname',
                align:'center',
                tooltip: 'true',
                minWidth: 100
            },
            {
                title: '性别',
                key: '',
                align:'center',
                minWidth: 100,
                render: (h, params) => {
                    let d = this.$config.setSex(params.row.sex)
                    return h('span', d)
                }
            },
            { title: '所属机构', key: 'organization_name', align: 'left',tooltip: 'true', minWidth: 100 },
            { title: '年级/班级', key: 'grade_name', align: 'left', tooltip: 'true',minWidth: 120 },
            { title: '科室', key: 'dept_name', align: 'left', tooltip: 'true',minWidth: 100 },
            { title: '学员类型', key: 'student_type', align: 'left',tooltip: 'true', minWidth: 100 },
            // {
            //     title: '证件类型',
            //     key: '',
            //     minWidth: 100,
            //     render: (h, params) => {
            //         let d = params.row.id_type;
            //         let text = '-'
            //         if(d){
            //             IDTYPE.forEach((t)=>{
            //                 if(t.id == d) text = t.title
            //             })
            //         }
            //         return h('span', text)
            //     }
            // },
            {
                title: '证件号',
                key: 'id_num',
                align: 'left',
                tooltip: 'true',
                minWidth: 180
            },
            {
                title: '状态',
                key: 'state_name',
                minWidth: 80,
                render: (h, params) => {
                    let d = params.row.state == -1 ? '停用' : '正常'
                    return h('span', d)
                }
            },
            {
                title: '最近登录时间',
                key: 'last_login_time',
                align: 'left',
                tooltip: 'true',
                minWidth: 190
            },
            {
                title: '操作',
                minWidth: 260,
                slot: 'operation',
                align: 'left',
                isSwitch: true, // true --> 正常 false --> 禁用
                switchKey: 'states',
                deletes: true,
                switchList: ['正常', '停用'],
                operation: [['查看','operation1'],'isSwitch',['删除','operation2']],
            }]
         }
    },
    methods: {
		transferCancel(val, data) {
		    this.showTransfer = val
		    if(data) this.getList()
		},
        // studentComparison(){
        //     this.showComparison = true
        // },
        // close(){
        //     this.showComparison = false
        // },
        seeModal(row,rowIndex){
            sessionStorage.setItem('STUDENRTABLEROWDATA', JSON.stringify(row))
            let routeData = this.$router.resolve({ query: {id: row.id, grade_id: row.grade_id || ''}, name: "view-trainees" });
            window.open(routeData.href, "_blank")
        },
        changeList(val){
            this.caccval = val
        },
        selectChange1(val){
          this.current = 1
          this.organization_id = val
          this.getList()
        },
        selectChange3(val){
            this.current = 1
            this.dept_id = val
            this.getList()
        },
        selectChange2(val){
            this.current = 1
            this.grade_id = val
            this.getList()
        },
        selectChange4(val){
            this.current = 1
            this.student_type_id = val
            this.getList()
        },
        inputChange(val){
          this.current = 1
        //   this.keyword = val
          this.getList()
        },
        modalInit(d){
            this.modalTitle = '添加学员'
            this.show = true
            this.tableRow = {}
            let role_id = JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id
            if(role_id !== 3 || role_id !== 2) this.formList[2].selectList = d
        },
        handleClick(){
            let role_id = JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id
            if(role_id == 2 || role_id == 3) this.modalInit([])
            else {
                postData('/v1/common/getOrganizationList').then((res) => {
                    if(res.res_code == 1){
                        this.modalInit(res.data)
                    }
                })
            }
        },
        getList(){
            let role_id = JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id
            let org = role_id === 1 ? this.organization_id : this.getOrganizationId
            let d = {
              keyword: this.keyword,
              page_size: this.pageSize,
              page_num: this.current,
              organization_id:  org == 'all' ? null : org,
              dept_id: this.dept_id == 'all' ? null : this.dept_id,
              grade_id: this.grade_id == 'all' ? null : this.grade_id,
              student_type_id: this.student_type_id == 'all' ? null : this.student_type_id
            }
            postData('/v1/user/getStudentList', d).then((res) => {
                 if(res.res_code == 1){
                    res.data.list.forEach((element,index) => {
                        if (String(index + 1).length == 1) {
                            element.index = '0' + (index + 1) 
                        }else{
                            element.index =  (index + 1)
                        }
                    });
                    this.list = res.data.list
                    this.total = res.data.count
                    this.list.map((t) => {
                        t.states = t.state == -1 ? false : true
                        t.head_img = t.img_url
                        t.homework_count = t.homework_count + ' 次'
                        t.test_count = t.test_count + ' 次'
                        t.exam_count = t.exam_count + ' 次'
                    })
                 }
            })
        },
        deletes(r){
          let d = { id: r.id, state:  r.states ? 1 : -1 }
          let de = () => { this.fromAddAndEdit('/v1/user/removeStudent', d) }
          this.$config.deleteModal(de, '删除该学员账号后，该学员学习数据将一并删除，是否继续？')
        },
        tableSwtich(r){
          let d = { id: r.id, state:  r.states ? 1 : -1 }
          this.fromAddAndEdit('/v1/user/modifyStudentState', d)
        },
        handleSubmit(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let val = this.tableRow
                    let role_id = JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id
                    if(role_id == 2 || role_id == 3) val.organization_id = +sessionStorage.getItem('organizationId')
                    val.sex = parseInt(val.sex)
                    this.fromAddAndEdit('/v1/user/addStudent',val)
                }
            })
        },
        getDate(url, i){
            let role_id = JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id
            PostData(url).then((res) => {
                // let num = role_id == 1 ? i : i - 1
                // this.formList[num].selectList = res.data
                //年级/班级
                if(i == 3){
                    this.select2 = [{id: 'all', title: "年级/班级"}, ...res.data]
                    this.gradeList = res.data
                } 
                //科室列表
                if(i == 4){
                    this.select3 = [{id: 'all', title: "全部科室"}, ...res.data]
                    this.deptList = res.data
                } 
                if(i == 5){
                    this.select4 = [{id: 'all', title: "全部类型"}, ...res.data]
                    this.stuTypeList = res.data
                } 
            })
            postData('/v1/common/getOrganizationList').then((res) => {
                //机构列表
                this.orgList = res.data
                this.select1 = [{id: 'all', title: '全部机构'},...res.data]
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
            console.log(this.formList)
        },
        getSelList() {
            this.getDate('/v1/common/getGradeList', 3)
            this.getDate('/v1/common/getDeptList', 4)
            this.getDate('/v1/common/getStudentTypeList', 5)
        }
    },
    mounted() {
        this.getSelList()
        // if(this.role_id == 1)  this.getOrganization()
        if(this.role_id == 3) {this.columns1[this.columns1.length - 1].operation.splice(1, 1)}
        this.getList()
        // if(this.permissionItem4) this.handleAuth(this.permissionItem4)
    }
  }
</script>
<style lang="less">
    .student-comparison{
        position: absolute;
        top: 70px;
        right: 10px;
        z-index: 1000;
        height: 80px;
        background-color: #fffd55;
        width: 40px;
        border: 1px solid rgb(255, 204, 0);
        border-radius: 10px;
        .texts{
            -webkit-writing-mode: vertical-rl;
            writing-mode: vertical-rl;
            color: #333;
            margin-left: 9px;
            margin-top: 11px;
        }
    }
    .student-comparison2{
        position: absolute;
        top: -1px;
        right: -1px;
        z-index: 1000;
        height: 80px;
        width: 80px;
        display: none;
        background-color: #fff;
        .student-comparison2-bg{
            height: 80px;
            width: 80px;
            border-radius: 40px;
            background-image: url('../../../assets/img/pk-bg.png');
            background-size: 100% 100%;
            background-repeat: no-repeat;
            .pk{
                width: 60px;
                margin-top: 10px;
            }
        }
    }
    .student-comparison:hover .student-comparison2{
        display: block;
    }
    .action{
       display: flex;
       align-items: center;
       .see{
           cursor: pointer;
           color: #4098FF;
           margin-right: 10px;
       }
       .nosee{
           display: none;
           cursor: pointer;
           color: #4098FF;
           margin-right: 10px;
           p{
               color: #fff;
           }
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
    .middle_p{
        margin-left: 100px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #F54802;
        margin-top: 30px;
        margin-bottom: 30px;
    }
</style>

