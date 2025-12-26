<template>
   <div class="user-manage-main">
        <see :detail-data="tableRowData" title="查看信息" :show-modal='detailShow' @close="close" />
        <!-- <FormModal :modal-false="true" :detail-data="tableRow" :show-modal='show' :form-list="formList" @from-submit="handleSubmit" @close="closeModal" :title="modalTitle" :rule-validate='rules'/> -->
        <!-- <screen :btn-type="btnType" :typeArr="typeArr" size-title1="管理总数" :size-num1="total" btn-name="添加管理"  @inputChange="inputChange" placehodle="搜索用户ID/姓名" @handleClick="handleClick"/> -->
        <!-- <Tables :tabel-height="tableHeight" :is-serial="true" @operation1="see" @operation2="edit" @operation3="deletes"  :column="columns1" :table-data="list" :select-list="management"/> -->
        <div class="screen">
            <div class="screen_input1">
                <Input style="width:300px;margin-left: 30px;" v-model="keyword" @on-change="inputChange()" placeholder="搜索用户ID/姓名" />
                <Icon type="md-search" slot="prefix"/>
            </div>
            <div class="number1">
                <p>管理总数</p>
                <span>{{total}}</span>
            </div>
            <Button style="margin-right: 20px;" @click="handleClick()" type="primary">添加管理</Button>
        </div>
        <Modal v-model="show" footer-hide :title="modalTitle" width="700px">
            <Form style="padding:50px;width: 645px;" ref="formValidate" :model="formValidate" :rules="modalType == 1 ? rules : rulesEdit" :label-width="80">
                <FormItem label="真实姓名" prop="realname">
                    <Input v-model="formValidate.realname" placeholder="请输入真实姓名" />
                </FormItem>
                <FormItem label="身份类型" prop="role_id">
                    <Select v-model="formValidate.role_id">
                        <Option v-for="item in selectList" :value="item.id" :key="item.id">{{item.title}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="账号" prop="username">
                    <Input  v-model="formValidate.username" placeholder="请输入账号" />
                </FormItem>
                <FormItem label="账号密码" prop="password">
                    <Input type="password" v-if="modalType == 1" v-model="formValidate.password" placeholder="请输入账号密码" />
                    <div v-else class="change_pass">
                        <div v-if="passType == 1" class="change_pass_main">
                            <Input disabled type="password" v-model="formValidate.password" placeholder="请输入账号密码" />
                            <Button @click="changPass()" style="margin-left: 10px;" type="primary">修改密码</Button>
                        </div>
                        <div v-else class="change_pass_main">
                            <Input type="password" v-model="formValidate.password" placeholder="请输入账号密码" />
                            <Button @click="changePassTrue()" style="margin-left: 10px;" type="info">确定</Button>
                            <Button @click="defaultPass()" style="margin-left: 10px;" type="default">取消</Button>
                        </div>
                    </div>
                </FormItem>
                <FormItem>
                    <Button style="margin-left:100px;width: 200px;" type="primary" @click="handleSubmit('formValidate')">保存</Button>
                </FormItem>
            </Form>
        </Modal>
        <Table :columns="columns1" :data="list">
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
//   import Tables from '../../../components/tables.vue'
//   import FormModal from '../../../components/FormModal.vue'
//   import screen from '../../../components/ScreenFrame'
  import see from '../../../components/SeeInfo.vue'
  import seeMixin from '../Mixins/seeMixin'
  import FormModalMixin from '../Mixins/FormModalMixin'
  import postData from 'src/api/postData'
  import UserMixins from '../Mixins/UserMixins'
  import pageList from '../../../components/Page'
  import pageMixin from '../../mixins/pageMixins'
  import  { validatePass, validateUsername } from '../validate'
  import md5 from 'js-md5'
  export default {
    name: "ManagementList",
    components: {see, pageList },
    mixins: [seeMixin, FormModalMixin, UserMixins, pageMixin],
    // props: {
    //     permissionItem1: {
    //         type: Object,
    //         default: null
    //     }
    // },
    data (){
        return{
            total:0,
            modalTitle: '',
            modalType:1,
            passType:1,
            // tableRow: {},
            tableRowData: {},
            // typeArr: ['input','size1','button'],
            columns1: [
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
                },
                {
                    title: '真实姓名',
                    key: 'realname',
                    align:'center',
                    tooltip: 'true',
                    minWidth: 100
                },
                {
                    title: '身份',
                    key: 'role_name',
                    align:'center',
                    tooltip: 'true',
                    minWidth: 100
                },
                {
                    title: '最近登录时间',
                    key: 'last_login_time',
                    tooltip: 'true',
                    align: 'left',
                    minWidth: 190
                },
                {
                    title: '操作',
                    minWidth: 260,
                    slot: 'operation',
                    align: 'left',
                    // operation: [['查看','operation1'], ['编辑','operation2'], ['删除','operation3']],
                }
            ],
            list:[],
            // formList: [
            //     { type: 'input', name: '真实姓名',  field: 'realname'},
            //     { type: 'select', name: '身份类型', field: 'role_id' ,
            //         selectList: [{id: 1, title: '总管理员'}, {id: 4, title: '顾问'} ], selectField: [ 'id','title' ]
            //     },
            //     { type: 'input', name: '账号',  field: 'username' },
            //     { type: 'password', name: '账号密码',  field: 'password' },
            // ],
            rules:{
                realname: [{ required: true, message: '请输入真实姓名', trigger: 'blur' } ],
                role_id: [{ required: true, message: '请选择身份类型' } ],
                username: [{ required: true, validator: validateUsername }],
                password: [{ required: true, validator: validatePass }],
            },
            rulesEdit:{
                realname: [{ required: true, message: '请输入真实姓名', trigger: 'blur' } ],
                role_id: [{ required: true, message: '请选择身份类型' } ],
                username: [{ required: true, validator: validateUsername }],
            },
            // data1: null,
            keyword: '',
            // operationList: [['查看','operation1'], ['编辑','operation2'], ['删除','operation3']],
            selectList: [{id: 1, title: '总管理员'}, {id: 4, title: '顾问'} ],
            formValidate:{
                realname:'',
                role_id:'',
                username:'',
                password:''
            },
            oldusername:''
        }
    },
    // watch: {
    //     permissionItem1(_new){
    //         // this.handleAuth(_new)
    //     }
    // },
    methods: {
        seeModal(row,rowIndex){
            row.list = ["用户ID："+row.username,"手机号："+row.phone,"注册时间："+row.create_time,"最后登录："+row.update_time]
            this.detailShow = true;
            this.tableRowData = row;
        },
        edit(row,rowIndex){
            this.oldusername = row.username
            this.modalTitle = '编辑管理'
            this.modalType = 2
            this.show = true
            this.formValidate = row
            this.defaultPass()
        },
        changPass(){
            this.passType = 2
            this.formValidate.password = ""
        },
        defaultPass(){
            this.passType = 1
            this.formValidate.password = "////////"
        },
        changePassTrue(){
            let value = this.formValidate.password
            if (value == ''||value == undefined){
            this.$Message.error('请输入账号密码');
            } else {
                var filter=/^[a-zA-Z0-9]{6,12}$/; 
                if(filter.test(value)){
                postData("/v1/user/modifyAdmin",{id:this.formValidate.id,password:md5(this.formValidate.password)}).then(res => {
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
        handleSubmit(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let modiifyList = {
                        id:this.formValidate.id,
                        realname:this.formValidate.realname,
                        username:this.formValidate.username,
                        // password:md5(this.formValidate.password),
                        role_id:this.formValidate.role_id
                    }
                    if (this.oldusername == modiifyList.username) {
                        modiifyList = {
                            id:this.formValidate.id,
                            realname:this.formValidate.realname,
                            // password:md5(this.formValidate.password),
                            role_id:this.formValidate.role_id
                        }
                    }
                    this.formValidate.password = md5(this.formValidate.password)
                    if(this.modalType == 1) this.fromAddAndEdit('/v1/user/addAdmin',this.formValidate)
                    else this.fromAddAndEdit('/v1/user/modifyAdmin',modiifyList)
                    this.oldusername = ""
                }
            })
        },
        deletes(row,rowIndex){
            let de = () => { this.fromAddAndEdit('/v1/user/removeAdmin',{id: row.id}) }
            this.$config.deleteModal(de)
        },
        inputChange(val){
            // this.keyword = val;
            this.current = 1
            this.getList()
        },
        handleClick(){
            this.modalTitle = '添加管理'
            this.modalType = 1
            this.formValidate = { realname: '', username: '',  password: '', role_id: '' }
            this.show = true
        },
        getList(){
            let d = {
                keyword: this.keyword,
                page_size: this.pageSize,
                page_num: this.current
            }
            postData('v1/user/getAdminList', d).then((res) => {
                  res.data.list.forEach((element,index) => {
                      if (String(index + 1).length == 1) {
                        element.index = '0' + (index + 1) 
                      }else{
                        element.index =  (index + 1)
                      }
                  });
                  this.list = res.data.list
                  this.total = res.data.count
                  if(this.list.length>0){
                      this.list.map((t) => {
                          t.role_name = t.role_id == 1 ? '总管理员' : t.role_id == 4 ? '顾问'  : ''
                      })
                  }
            })
        }
    },
    mounted() {
        this.getList()
        // if(this.permissionItem1) this.handleAuth(this.permissionItem1)
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
            left: 45px;
        }
    }
    .change_pass_main{
        display: flex;
        align-items: center;
    }
</style>
