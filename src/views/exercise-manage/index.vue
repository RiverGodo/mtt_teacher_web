<template>
   <div class="user-manage-main">
        <!-- <screen :selectSubjects="true" :select2="select2" :btn-type="btnType" @selectChange1="selectChange1" @selectChange3="selectChange3"  :select-type1="selectType1" :typeArr="typeArr" size-title1="练习总数" :size-num1="total"
        searchDropDownPlaceholder="请输入症状关键词（多选）" @selectChange2="selectChange2"  @searchDropDownChange="searchDropDownChange" :searchDropDown="symptom" :select2_1="difficultyList"  @selectChange2_1="selectChange2_1" />
        <Tables :tabel-height="tableHeight" :is-serial=true @operation1="see" :column="columns1" :table-data="list" /> -->
        <div class="screen">
            <Select v-if="isSuper" @on-change="selectChange1" class="select-list" v-model="organization_id">
                <Option v-for="(item,index) in select1" :value="item.id" :key="index">{{item.title}}</Option>
            </Select>
            <Select @on-change="selectChange3" class="select-list" v-model="patient_division">
                <Option v-for="(item,index) in select3" :value="item.title" :key="index">{{item.title}}</Option>
            </Select>
            <Select @on-change="selectChange2" class="select-list" v-model="score_state">
                <Option v-for="(item,index) in select2" :value="item.id" :key="index">{{item.title}}</Option>
            </Select>
            <Select @on-change="selectChange2_1" class="select-list" v-model="degree">
                <Option v-for="(item,index) in difficultyList" :value="item.id" :key="index">{{item.title}}</Option>
            </Select>
            <Select @on-change="searchDropDownChange" style="width: 500px;" class="select-list" v-model="searchDrop" multiple filterable remote :remote-method="remoteMethod1" placeholder="请输入症状关键词（多选）" :loading="loading1">
                <Option v-for="(option, index) in options1" :value="option.id" :key="index">{{option.title}}</Option>
            </Select>
            <div class="number1">
                <p>练习总数</p>
                <span>{{total}}</span>
            </div>
        </div>
        <Table :columns="columns1" :data="list">
            <template slot-scope="{ row, index }" slot="operation">
                <div class="action">
                    <span @click="seeModal(row,index)" class="see">查看</span>
                </div>
            </template>
        </Table>
       <page-list class="page-main" :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
   </div>
</template>
<script>
  import Tables from 'components/tables.vue'
  import FormModal from 'components/FormModal.vue'
  import screen from 'components/ScreenFrame'
  import FormModalMixin from '../UserManage/Mixins/FormModalMixin'
  import jurisdictionList from '../UserManage/jurisdictionList'
  import UserMixins from '../UserManage/Mixins/UserMixins'
  import postData from 'src/api/postData'
  import pageList from 'components/Page'
  import pageMixin from '../mixins/pageMixins'
  import  { validatePass, validateUsername3 } from '../UserManage/validate'
  export default {
    name: "ManagementList",
    components: { Tables, FormModal, screen, pageList },
    mixins: [ FormModalMixin, UserMixins, pageMixin ],
    data (){
        return{
            typeArr: ['isSuper','select2','select2_1','searchDropDown','size1'],
            selectType1: false,
            organization_id:'all',
            list: [],
            symptom: [],
            select2: [{title: '全部评分状态', id: 'all'},{title: '未评分', id: 0},{title: '已评分', id: 1}],
            select1:[{id: 'all', title: '全部机构'}],
            select3:[],
            difficultyList: [{id: 'all', title: '全部难度'},{id: 1, title: '简单'},{id: 2, title: '适中'},{id: 3, title: '困难'}],
            operationList: [[['评分','查看'],'operation1']],
            symptomList: [],
            degree: "all",
            score_state: "all",
            patient_division: "全部科室",
            loading1:false,
            options1:[],
            searchDrop: []
        }
    },
    computed: {
         columns1(){
            return [
            {
                title: '序号', 
                key: 'index', 
                align:'center',
                width: 80
            },
            {
                title: '病例症状',
                key: 'symptom',
                align: 'left',
                minWidth: 200
            },
            // {
            //     title: '所属科室',
            //     key: 'patient_division',
            //     align: 'left',
            //     minWidth: 150
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
                title: '真实姓名',
                key: 'realname',
                align:'center',
                minWidth: 100
            },
            {
                title: '评分',
                key: '',
                minWidth: 100,
                align:'center',
                render: (h, params) => {
                    let d = params.row.score_state == 1 ? params.row.score : '-'
                    return h('span', d)
                }
            },
            {
                title: '提交时间',
                key: 'last_time',
                align:'center',
                minWidth: 100
            },
            {
                title: '操作人',
                key: 'operator',
                align:'center',
                minWidth: 100
            },
            {
                title: '操作',
                minWidth: 260,
                operation_state: true,
                slot: 'operation',
                align: 'left',
                operation: [[['查看', (this.$config.getRoleId()==3 || this.$config.getRoleId()==2) ? '评分' : ''],'operation1']],
            }]
         }
    },
    beforeDestroy() {
        this.see = null;
        this.getList = null;
    },
    methods: {
        //查看
        seeModal(row,rowIndex){
            // state 1--查看 2--评分
            let state = row.score_state===1 ? 1 : row.score_state === 0 ? 2 : 0;
            let querys = {id: row.id, case_id: row.case_id, type: 1, state, back: 'exercise-manage', do_state: 1, score_state: row.score_state}
            let query = row.score_state === 1 ? {...querys, score: row.score} : querys
            let d = { query, name: "view-reports"}
            let role_id = this.$config.getRoleId() 
            if(state == 1) this.$router.replace(d)
            if(state == 2){
                if(role_id == 1 || role_id == 2) this.$router.replace(d)
                else  this.$Message.info('无评分权限');
            }  
        },
        selectChange3(val){
            this.patient_division = val
            this.getList()
        },
        selectChange1(val){
            this.organization_id = val
            this.getList()
        },
        selectChange2_1(val){
          this.degree = val
          this.getList()
        },
        selectChange2(val) {
            this.score_state = val
            this.getList()
        },
        searchDropDownChange(val){
            this.symptomList = val;
            this.current = 1
            this.getList()
        },
        getList(){
            let d = {
              page_size: this.pageSize,
              page_num: this.current,
              symptom: this.symptomList,
              degree: this.degree == "all" ? null : this.degree,
              patient_division: this.patient_division == "全部科室" ? null : this.patient_division,
              organization_id: this.$config.getOrganizationId(this.organization_id) == "all" ? null : this.$config.getOrganizationId(this.organization_id),
              score_state: this.score_state == "all" ? null : this.score_state
            }
            postData('v1/exercise/getExerciseList', d).then((res) => {
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
                 }
            })
        },
        getSymptom(){
            postData('common/getSymptoms').then((res)=>{
                if(res.res_code==1){
                    this.symptom = res.data
                    if(this.symptom.length>0){
                        this.symptom.map((t)=>{
                            t.id = t.symptom
                            t.title = t.symptom
                        })
                    }
                }
            })
            postData('/v1/common/getOrganizationList').then((res) => {
                // this.formList[1].selectList = res.data
                this.select1 = [{id: 'all', title: '全部机构'},...res.data]
            })
            postData('/v1/common/getDeptList').then((res) => {
                this.select3 = [{id: 'all', title: '全部科室'}, ...res.data]
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
        this.tableHeight = window.innerHeight - 200
        this.getList()
        this.getSymptom()
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

