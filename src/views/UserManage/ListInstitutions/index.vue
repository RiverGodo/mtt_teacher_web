<template>
   <div class="user-manage-main">
        <see :detail-data="tableRowData" title="查看信息" :show-modal='detailShow' @close="close" />
        <!-- <FormModal :modal-false="true" :detail-data="tableRow" :uploadFlie=true :show-modal='show' :form-list="formList" @from-submit="handleSubmit"
                   @close="closeModal" :title="modalTitle" :rule-validate="rules" :maxFileSize="2"/> -->
        <!-- <screen :btn-type="btnType"  :typeArr="typeArr"  size-title1="机构总数" :size-num1="total" btn-name="添加机构" placehodle="搜索机构名称"  @inputChange="inputChange"
                @handleClick="handleClick" @handleClick1="handleClick1" btn-name1="批量分配病例"/> -->
        <!-- <Tables :tabel-height="tableHeight" :is-serial=true @operation1="see" @operation2="edit" @operation3="allocationCases" :column="columns1" :table-data="list" :select-list="institution"/> -->
        <div class="screen">
            <div class="screen_input1">
                <Input style="width:300px;margin-left: 30px;" v-model="keyword" @on-change="inputChange()" placeholder="搜索机构名称" />
                <Icon type="md-search" slot="prefix"/>
            </div>
            <div class="number1">
                <p>机构总数</p>
                <span>{{total}}</span>
            </div>
            <Button style="margin-right: 20px;" @click="handleClick()" type="primary">添加机构</Button>
        </div>
        <Modal v-model="show" footer-hide :title="modalTitle" width="700px">
            <Form style="padding:50px;width: 645px;" ref="tableRow" :model="tableRow" :rules="modalType == 1 ? rules : rulesEdit" :label-width="80">
                <imgup ref="imgup"></imgup>
                <FormItem label="机构名称" prop="title">
                    <Input v-model="tableRow.title" placeholder="请输入机构名称" />
                </FormItem>
                <FormItem label="机构域名" prop="subdomain">
                    <div style="display: flex;align-item:center;">
                        <Input v-model="tableRow.subdomain" placeholder="请输入机构域名" />
                        <span>.mtt.physicianedu.com</span>
                    </div>
                </FormItem>
                <FormItem label="机构账号" prop="username">
                    <Input v-model="tableRow.username" placeholder="请输入机构账号" />
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
                <FormItem label="机构介绍" prop="desc">
                    <Input v-model="tableRow.desc" placeholder="请输入机构介绍" />
                </FormItem>
                <FormItem>
                    <Button style="margin-left:100px;width: 200px;" type="primary" @click="handleSubmit('tableRow')">保存</Button>
                </FormItem>
            </Form>
        </Modal>
        <Table :columns="columns1" :data="list">
            <template slot-scope="{ row, index }" slot="operation">
                <div class="action">
                    <span @click="seeModal(row,index)" class="see">查看</span>
                    <span @click="edit(row,index)" class="nosee">编辑</span>
                    <span @click="allocationCases(row,index)" class="nosee">分配病例</span>
                    <Switch size="large" v-model="row.states" class="nosee">
                        <p slot="open">正常</p>
                        <p slot="close">停用</p>
                    </Switch>
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
  import see from '../../../components/SeeInfo.vue'
  import seeMixin from '../Mixins/seeMixin'
  import FormModalMixin from '../Mixins/FormModalMixin'
  import postData from 'src/api/postData'
  import { mapState } from 'vuex'
  import UserMixins from '../Mixins/UserMixins'
  import pageList from '../../../components/Page'
  import pageMixin from '../../mixins/pageMixins'
  import  { validatePass, validateUsername2 } from '../validate'
  import subdomainUrl from '../../../../config/subdomainUrl'
  import imgup from "./imgup"
  import md5 from 'js-md5'

  export default {
    name: "ManagementList",
    components: { see, pageList, imgup },
    mixins: [seeMixin, FormModalMixin, UserMixins, pageMixin],
    props: {
        permissionItem2: {
            type: Object,
            default: null
        }
    },
    data (){
        return{
            modalTitle: '',
            modalType:1,
            passType:1,
            tableRow: {},
            tableRowData: {},
            keyword: '',
            head_img:'',
            typeArr: ['input','size1','button'],
            columns1: [
            {
                title: '序号', 
                key: 'index', 
                align:'center',
                width: 80
            },
            {
                title: '机构名称',
                key: 'title',
                align: 'left',
                minWidth: 100,
                tooltip: 'true'
            },
            {
                title: '老师总数',
                key: 'teacher_count',
                align:'center',
                minWidth: 100
            },
            {
                title: '学员总数',
                key: 'student_count',
                align:'center',
                minWidth: 100
            },
            {
                title: '病例总数',
                key: 'case_count',
                align:'center',
                minWidth: 100
            },
             {
                title: '用户ID',
                key: 'username',
                align: 'left',
                minWidth: 150
            },
            {
                key: 'role_name',
                title: '身份',
                align:'center',
                minWidth: 120,
            },
            {
                title: '状态',
                key: 'state_name',
                minWidth: 100
            },
            {
                title: '最近登录时间',
                key: 'last_login_time',
                align: 'left',
                minWidth: 200
            },
            {
                title: '操作',
                minWidth: 300,
                slot: 'operation',
                align: 'left',
                isSwitch: true, // true --> 正常 false --> 禁用
                switchKey: 'states',
                switchList: ['正常', '停用'],
                operation: [['查看','operation1'], ['编辑','operation2'],['分配病例','operation3']],
            }],
            list: [],
            formList: [
                { type: 'input', name: '机构名称',  field: 'title'},
                { type: 'input', name: '机构域名', field: 'subdomain', subdomainUrl: subdomainUrl },
                { type: 'input', name: '机构账号',  field: 'username' },
                { type: 'password', name: '账号密码',  field: 'password' },
                { type: 'textarea', name: '机构介绍',  field: 'desc' },
            ],
            rules:{
                title: [{ required: true, message: '请输入机构名称', trigger: 'blur' } ],
                subdomain: [{ required: true, message: '请输入子域名', trigger: 'blur' } ],
                username: [{ required: true, validator: validateUsername2 }],
                password: [{ required: true, validator: validatePass }],
                desc: [{ required: true, message: '请输入机构介绍', trigger: 'blur' } ],
            },
            rulesEdit:{
                title: [{ required: true, message: '请输入机构名称', trigger: 'blur' } ],
                subdomain: [{ required: true, message: '请输入子域名', trigger: 'blur' } ],
                username: [{ required: true, validator: validateUsername2 }],
                desc: [{ required: true, message: '请输入机构介绍', trigger: 'blur' } ],
            },
            operationList: [['查看','operation1'], ['编辑','operation2'],['分配病例','operation3']],
            formValidate:{
                title:'',
                subdomain:'',
                username:'',
                password:'',
                desc:''
            },
            oldorgname:''
        }
    },
    // watch: {
    //     permissionItem2(_new){
    //         // this.handleAuth(_new)
    //     }
    // },
    methods: {
        allocationCases(row,rowIndex){
            this.$router.push({name: "distribution-case", query: {organization_id: row.id}})
        },
        seeModal(row,rowIndex){
          this.tableRowData = row;
          this.tableRowData.mechanismName = row.title
          row.list = ["用户ID："+row.username,"手机号："+row.phone,"身份："+row.role_name,"注册时间："+row.create_time,"最后登录："+row.update_time]
          this.detailShow = true;
        },
        edit(row,rowIndex){
            this.show = true
            this.oldorgname = row.username
            row.head_img = row.logo_img&&row.logo_img != '-' ? row.logo_img : ''
            this.$refs.imgup.head_img = row.logo_img&&row.logo_img != '-' ? row.logo_img : ''
            this.modalTitle = '编辑机构'
            this.modalType = 2
            this.tableRow = row
            this.defaultPass()
        },
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
                postData("/v1/organization/modifyOrganization",{id:this.tableRow.id,password:md5(this.tableRow.password)}).then(res => {
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
        deletes(row,rowIndex){
          this.fromAddAndEdit('user/removeDept', {id: row.organization_id})
        },
        inputChange(val){
        //    this.keyword = val;
           this.current = 1
           this.getList()
        },
        handleClick(){
            this.modalTitle = '添加机构'
            this.modalType = 1
            this.show = true
            this.tableRow = {}
            this.$refs.imgup.head_img = ''
        },
        handleClick1() {
            this.$router.push({name: "distribution-case"})
            // let arr = []
            // axios.post('http://api.9mededu.com/met/product/curriculum_online/get_list', {
            //     token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOjE1NCwicm9sZV9pZCI6MSwib3JnYW5pemF0aW9uX2lkIjoxLCJleHAiOjE1ODM5MTk0MjM0OTB9.ozuuVmOywO1Xy3REH3UwzHAN6IMO1qodklSorCMwXvw",
            //     product_id: 39,
            //     page_size: 998,
            //     page_num: 1,
            // }).then(res => {
            //     res.data.data.data.forEach(item => {
            //         axios.post('http://api.9mededu.com/met/product/curriculum_online_catalog/get_list', {
            //             token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOjE1NCwicm9sZV9pZCI6MSwib3JnYW5pemF0aW9uX2lkIjoxLCJleHAiOjE1ODM5MTk0MjM0OTB9.ozuuVmOywO1Xy3REH3UwzHAN6IMO1qodklSorCMwXvw",
            //             curriculum_online_id: item.id
            //         }).then(re => {
            //             re.data.data.forEach(item1 => {
            //                 item1.children.forEach(item2 => {
            //                     arr.push(item2.video_url)
            //                 })
            //             })
            //         })
            //     })
            // }).then(() => {
            //     setTimeout(() => {
            //         console.log(arr, 'arr');
            //     }, 2000)
            // })
        },
        getList(){
            let d = {
              title: this.keyword,
              page_size: this.pageSize,
              page_num: this.current
            }
            postData('/v1/organization/getOrganizationList', d).then((res) => {
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
                    t.state_name = t.state == -1 ? '停用' : '正常'
                    t.states = t.state == -1 ? false : true
                })
            })
        },
        handleSubmit(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let val = this.tableRow
                    val.role_id = 2
                    // val.logo_img = this.$refs.imgup.head_img
                    val.logo_img = "http://cdn.qmzbe.top/%E7%86%8A%E7%8C%AB%E5%A4%B4%E5%83%8F.png"
                    let orgList = {
                        id:this.tableRow.id,
                        title:this.tableRow.title,
                        subdomain:this.tableRow.subdomain,
                        username:this.tableRow.username,
                        password:md5(this.tableRow.password),
                        desc:this.tableRow.desc,
                        logo_img:this.tableRow.logo_img
                    }
                    if (this.oldorgname == orgList.username) {
                        orgList = {
                            id:this.tableRow.id,
                            title:this.tableRow.title,
                            subdomain:this.tableRow.subdomain,
                            password:md5(this.tableRow.password),
                            desc:this.tableRow.desc,
                            logo_img:this.tableRow.logo_img
                        }
                    }
                    if (this.modalType !== 1) {
                        delete orgList.password
                    }
                    if(this.modalType === 1) this.fromAddAndEdit('/v1/organization/addOrganization', orgList)
                    else this.fromAddAndEdit('/v1/organization/modifyOrganization', orgList)
                    this.oldorgname = ""
                }
            })
        },
    },
    mounted() {
        this.getList()
        // if(this.permissionItem2) this.handleAuth(this.permissionItem2)
    }
  }
</script>
<style lang="less" scoped>
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
            left: 45px;
        }
    }
    .change_pass_main{
        display: flex;
        align-items: center;
    }
</style>
