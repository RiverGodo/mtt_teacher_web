<template>
    <div>
        <Modal class="message-modals" v-model="messageModal" :footer-hide="true" :title="titleModal" width="700" label-position="left" @on-cancel="handleCancel">
            <Form ref="messageForm" :model="outlineForm" :rules="ruleValidate">
                <FormItem label="提纲病症：" style="position: relative" prop="symptom">
                    <Input :disabled="caseDisabled" v-model="outlineForm.symptom" placeholder="请描述主要病症" style="width: 320px;" maxlength="10"/>
                    <div class="input-num">{{outlineForm.symptom.length}}/10</div>
                </FormItem>
                <FormItem label="提纲难度：" prop="degree">
                    <RadioGroup v-model="outlineForm.degree">
                        <Radio :disabled="caseDisabled" label="1">简单</Radio>
                        <Radio :disabled="caseDisabled" label="2">适中</Radio>
                        <Radio :disabled="caseDisabled" label="3">困难</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="所属科室：" prop="dept_id">
                    <Select :disabled="caseDisabled" style="width: 320px;" v-model="outlineForm.dept_id">
                        <Option v-for="(item, index) in patient_list" :key="index" :value="item.id">{{item.title}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="提纲概要：" style="position: relative" prop="desc">
                    <Input :disabled="caseDisabled" v-model="outlineForm.desc" placeholder="请描述主要病症" type="textarea" style="width: 480px;" :autosize="{minRows: 5, maxRows: 5}" maxlength="300"/>
                    <div class="textarea-num">{{outlineForm.desc.length}}/300</div>
                </FormItem>
                <div style="display: flex; justify-content: center">
                    <Button @click="handleNext" type="primary" style="width: 150px;">下一步</Button>
                </div>
            </Form>
        </Modal>
        <Modal class="reject-modals" v-model="rejectModal" :footer-hide="true" title="拒绝原因" width="700">
            <div style="min-height: 200px" v-if="isSee">{{no_pass_reason}}</div>
            <div v-else>
                <Input v-model="no_pass_reason" type="textarea" :rows="10"/>
            </div>
            <div style="margin-top: 40px;display: flex;justify-content: center">
                <Button v-if="isSee" style="width: 120px;" type="primary" @click="editCase(activeItem)">编辑提纲</Button>
                <Button v-else @click="refuse" type="primary" style="width: 120px;">确认</Button>
            </div>
        </Modal>
        <distribution :show="showDistribution" @close="closeDistribution" :outline_id="outline_id" @handleCancel="getList"/>
        <div class="screen">
            <Select v-if="isSuper" @on-change="selectChange1" class="select-list" v-model="organization_id">
                <Option v-for="(item,index) in select1" :value="item.id" :key="index">{{item.title}}</Option>
            </Select>
            <Select @on-change="selectChange3" class="select-list" v-model="dept">
                <Option v-for="(item,index) in select3" :value="item.title" :key="index">{{item.title}}</Option>
            </Select>
            <Select @on-change="selectChange2" class="select-list" v-model="state">
                <Option v-for="(item,index) in select2" :value="item.id" :key="index">{{item.title}}</Option>
            </Select>
            <div class="screen_input1">
                <Input style="width:300px;margin-left: 10px;" v-model="keyword" @on-change="inputChange()" placeholder="搜索病症或诊断内容" />
                <Icon type="md-search" slot="prefix"/>
            </div>
            <div class="number1">
                <p>提纲总数</p>
                <span>{{total}}</span>
            </div>
            <Button style="margin-right: 20px;" @click="handleClick()" type="primary">新建提纲</Button>
        </div>
        <!-- <screen :typeArr="typeArr" sizeTitle1="提纲总数" :sizeNum1="total" btnName="新建提纲" btnName1="分配审核" placehodle="搜索病症或诊断内容"
                @inputChange="inputChange" @handleClick="handleClick" @handleClick1="handleClick1" :selectSubjects="true" :select2="select2" select2Placeholder="请选择审核状态"
                @selectChange1="selectChange1" @selectChange3="selectChange3" @selectChange2="selectChange2" ></screen> -->
<!--        <tables :tabel-height="tableHeight" :is-serial=true :column="columns1" :table-data="list" @operation="checkCase" @operation1="editCase"-->
<!--                @operation2="deleteCase" @operation3="auditCase" @operation4="copyCase"></tables>-->
        <div :style="{'height': tableHeight + 'px'}" class="content">
            <div v-for="(item, index) in list" :key="index" class="content-box" @click="checkCase(item)">
                <div class="box-degree" :style="{backgroundColor: degreeLevel[item.degree].color}">
                    {{degreeLevel[item.degree].title}}
                </div>
                <div class="box-img" :style="{transform: item.state == 0 ? 'rotate(450deg)' : item.state == 3 ? 'rotate(408deg)' : 'rotate(334deg)', top: item.state == 0 ? '-3px' : '-20px', right: item.state == 0 ? '3px' : '-38px'}">
                    <img v-if="selectState(item.state + 2)" :width="item.state == 0 ? '60' : '80'" height="60" :src="selectState(item.state + 2)" alt="">
                </div>
                <div class="content-top">
                    <div class="content-top-symptom">{{item.symptom}}</div>
                    <div class="content-top-content">
                        <div>ID: <span>{{item.id}}</span></div>
                        <div>诊断 <span style="overflow-x: auto">{{item.principal_diagnosis_name}}</span></div>
                    </div>
                </div>
                <div class="content-bottom">
                    <div class="bottom-left">
                        <div>科室： <span>{{item.dept}}</span></div>
                        <div>创建人： <span>{{item.realname}}</span></div>
                        <div>创建时间： <span>{{item.create_time}}</span></div>
                    </div>
                    
                    <div :class="item.state == 2 ? 'bottom-right2' : 'bottom-right'">
                        <div v-if="item.state == 3" style="margin-right: 10px;">
                            <div>{{item.use_count}}</div>
                            <div>使用次数</div>
                            <Button v-if="$config.roleIsDistribution()" style="margin: 4px 4px 0 0;" type="error" @click="deleteCase(item)">删除</Button>
                        </div>
                        <div class="right-btn" v-else-if="item.state == -1">
                            <Button type="primary" @click="rejectCase(item)">拒绝原因</Button>
                            <Button style="margin-left: 4px;" type="error" @click="deleteCase(item)">删除</Button>
                        </div>
                        <div class="right-btn" v-else-if="item.state == 0">
                            <Button type="primary" @click="editCase(item)">编辑</Button>
                            <Button style="margin-left: 4px;" type="error" @click="deleteCase(item)">删除</Button>
                        </div>
                        <div @mouseleave="hideBtn" class="right-btn" style="flex-direction: column;"  v-else-if="item.state == 2">
                            <Button type="primary" @click.stop="auditCase(item)">审核</Button>
                            <Button v-if="isToExam" @click.stop="toExamCase(item, 3)">通过</Button>
                            <Button v-if="isToExam" @click.stop="toExamCase(item, -1)">拒绝</Button>
                        </div>
                        <div class="right-btn"  v-else-if="item.state == 1&&$config.roleIsDistribution()">
                            <Button type="primary" @click="distributionCase(item)">分配</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
    </div>
</template>

<script>
    import screen from '../../../components/ScreenFrame'
    import tables from '../../../components/tables'
    import pageList from '../../../components/Page'
    import pageMixin from '../../mixins/pageMixins'
    import postData from '../../../api/postData'
    var operationList = [['查看','operation'], ['编辑','operation1'], ['删除','operation2'], ['审核','operation3'], ['复制','operation4']]
    import state_1 from '../../../assets/img/audit-sate/state_1.jpg'
    import state_2 from '../../../assets/img/audit-sate/state_2.jpg'
    import state_4 from '../../../assets/img/audit-sate/state_3.jpg'
    import state_3 from '../../../assets/img/audit-sate/state_5.jpg'
    import distribution from './components/distribution'

    export default {
        components: {screen, tables, pageList, distribution},
        mixins: [pageMixin],
        data() {
            return {
                no_pass_reason: '',
                isSee: false,
                activeItem: null,
                cases_id: null,
                isToExam: false,
                state_1, state_2, state_3, state_4,
                typeArr: ['input', 'isSuper', 'select2', 'size1', 'button'],
                sizeNum1: 10,
                tableHeight: null,
                keyword: '',
                rejectModal: false,
                showDistribution: false,
                outline_id: null,
                degreeLevel: {
                    1: {color: '#7ED321', title: '简单'},
                    2: {color: '#4098ff', title: '中等'},
                    3: {color: '#FD6C1E', title: '困难'}
                },
                columns1: [{
                        title: '病症',
                        key: 'symptom',
                        align: 'left',
                        minWidth: 200
                    }, {
                        title: '诊断内容',
                        key: 'icd10_title',
                        align: 'left',
                        minWidth: 200,
                        // render: (h,  param) =>  {
                        //     let d = ''
                        //     JSON.parse(param.row.icd10_names).forEach(item => {
                        //         d = !d ? item :  ',' + item
                        //     })
                        //     return  h('span', d)
                        // }
                    }, {
                        title: '难度',
                        // key: 'degree',
                        align: 'left',
                        minWidth: 80,
                        render: (h, param) => {
                            let d = param.row.degree == 1 ? '简单' : param.row.degree == 2 ? '适中' : '困难'
                            return h('span', d)
                        }
                    }, {
                        title: '科室',
                        key: 'dept',
                        minWidth: 120
                    }, {
                        title: '审核状态',
                        key: 'use_count',
                        minWidth: 120,
                        render: (h, param) => {
                            let data = {'-1': '审核失败', '0': '草稿', '1': '审核中', '2': '审核成功',}
                            let dataColor = {'-1': '#F54802', '0': '#474643', '1': '#4098FF', '2': '#2EBF07',}
                            return h('span', {
                                style: {
                                    color: dataColor[param.row.state],
                                },
                                domProps: {
                                    innerHTML: data[param.row.state]
                                },
                            })
                        }
                    }, {
                        title: '使用次数',
                        key: 'use_count',
                        minWidth: 120
                    }, {
                        title: '更新人',
                        key: 'realname',
                        minWidth: 120
                    }, {
                        title: '更新时间',
                        key: 'create_time',
                        minWidth: 200
                    }, {
                    title: '操作',
                    minWidth: 260,
                    check_id: true,
                    slot: 'operation',
                    operationAllot: true,
                    operation: this.$config.getRoleId() == 1 || this.$config.getRoleId() == 2 ? [[...operationList.slice(0, 4)], [...operationList.slice(0, 4)]] : [[...operationList.slice(0, 3)], [...operationList.slice(0, 1), ...operationList.slice(4,5)]],
                }
                ],
                list: [],
                messageModal: false,
                titleModal: '新建提纲',
                outlineForm: {
                    symptom: '',
                    degree: '',
                    dept_id: '',
                    desc: '',
                },
                ruleValidate: {
                    symptom: [{required: true, message: '请输入提纲病症', trigger: 'change'}],
                    degree: [{required: true, message: '请选择提纲难度'}],
                    dept_id: [{required: true, message: '请选择提纲所属科室'}],
                    desc: [{required: true, message: '请输入提纲概要', trigger: 'change'}],
                },
                patient_list: [],
                caseDisabled: false,
                select1: [{id: 'all', title: '全部机构'}],
                select2: [
                    {id: 'all', title: '审核状态'}, 
                    {id: 3, title: '审核成功'}, 
                    {id: -1, title: '审核失败'}, 
                    { id: 2, title: '审核中' }, 
                    { id: 1, title: '待分配' },
                     {id: 0, title: '草稿'},
                    // {id: 'all', title: ' 全部'}, {id: -1, title: '审核失败'}, {id: 0, title: '草稿'}, {id: 1, title: '审核中'}, {id: 2, title: '审核成功'}
                ],
                select3:[{id: 'all', title: '全部科室'}],
                dept: '全部科室',
                organization_id: 'all',
                state: 'all',
                radioCheck: '同意',
                deptId:'all',
            }
        },
        methods: {
            hideBtn(){
                this.isToExam = false
            },
            selectState(state) {
                return state == 5 ? "" : this['state_' + state]
            },
            inputChange(val) {
                // this.keyword = val
                this.current = 1
                this.getList()
            },
            selectChange1(val) {
                this.organization_id = val
                this.getList()
            },
            selectChange2(val) {
                this.state = val
                this.getList()
            },
            selectChange3(val) {
                this.dept = val
                this.select3.forEach(element => {
                    if (val == element.title) {
                        this.deptId = element.id
                    }
                });
                this.getList()
            },
            handleClick() {
                this.$refs.messageForm.resetFields()
                this.modifyCase(this.outlineForm, 'create')
            },
            handleClick1() {
                window.open('dashboard/distribution-outline')
            },
            editCase(val) {
                window.event.stopPropagation()
                sessionStorage.setItem("auto_layout",val.auto_layout)
                this.modifyCase(val, 'edit')
            },
            checkCase(val) {
                this.modifyCase(val, 'check', true)
                PostData('/v1/outline/getoutlineDetail',{id:this.outlineForm.id}).then(res => {
                    this.outlineForm.outline = res.data.outline
                    this.$router.push({path: 'outline-content', query: {id: this.outlineForm.id || null}})
                    sessionStorage.setItem('caseOutline', JSON.stringify(this.outlineForm))
                })
            },
            modifyCase(val, type, state) {
                this.messageModal = !state
                this.outlineForm = val
                val.degree = String(val.degree)
                this.titleModal = type == 'edit' ? '编辑提纲' : '新建提纲'
                sessionStorage.setItem('caseType', JSON.stringify(type))
                this.caseDisabled = type == 'check' ? true : false
            },
            deleteCase(val) {
                window.event.stopPropagation()
                this.$Modal.confirm({
                    title: '提示',
                    content: '<p>确认删除该病症提纲</p>',
                    onOk: () => {
                        postData('/v1/outline/removeOutline',{id: val.id}).then(res => {
                          if(res.res_code == 1) {
                              this.getList()
                              this.$Message.success(res.msg)
                          }
                        })
                    },
                });
            },
            rejectCase(val) {
                this.activeItem = val
                this.no_pass_reason = val.no_pass_reason
                window.event.stopPropagation()
                this.rejectModal = true
                this.isSee = true
            },
            distributionCase(val) {
                window.event.stopPropagation()
                this.outline_id = val.id
                this.showDistribution =  true
            },
            closeDistribution() {
                this.showDistribution =  false
            },
            refuse(){
                if(this.no_pass_reason){
                    PostData('/v1/outline/examineOutline',{outline_id: this.activeItem.id, state: - 1, no_pass_reason: this.no_pass_reason}).then((r) => {
                        if(r.res_code == 1) {
                            this.rejectModal = false
                            this.$Message.info('审核成功!')
                            this.getList()
                        }
                    })
                }else this.$Message.info('请输入拒绝原因')
            },
            toExamCase(v, i){
                this.activeItem = v
                if(i === -1){
                    this.isSee = false
                    this.rejectModal = true
                }else{
                    PostData('/v1/outline/examineOutline',{outline_id: v.id, state: i}).then((r) => {
                        if(r.res_code == 1) {
                            this.isSee = false
                            this.$Message.info('审核成功!')
                            this.getList()
                        }
                    })
                }
            },
            auditCase(v) {
                window.event.stopPropagation()
                if(v.state == -1 || v.state == 3) this.$Message.info('已审核过该病例')
                else this.isToExam = true
                // if(v.state == -1 || v.state == 3) this.$Message.info('已审核过该病例')
                // else this.$Modal.confirm({
                //     title: '提示',
                //     closable: true,
                //     render: (h) => {
                //         return h('RadioGroup', {
                //             attrs: {
                //                 'value': this.radioCheck
                //             },
                //             on: {
                //                 'on-change': (val) => {
                //                     this.radioCheck = val
                //                 }
                //             }
                //         }, [
                //             h('Radio', {props: {label: '同意'}}),
                //             h('Radio', {props: {label: '拒绝'}}),
                //         ])
                //     },
                //     onOk: () => {
                //         let check = {'同意': 3, '拒绝' : -1}
                //         PostData('case/approve',{id: v.id, state: check[this.radioCheck]}).then((r) => {
                //             if(r.res_code == 1) {
                //                 this.$Message.info('审核成功!')
                //                 this.getList()
                //             }
                //         })
                //     },
                //     onCancel: () => {
                //     }
                // });
            },
            copyCase(val) {
                postData('case/copyOutline', {id: val.id}).then(res => {
                    if(res.res_code == 1) this.getList()
                })
            },
            getList() {
                let role_id = this.$config.getRoleId()
                let da = role_id > 1 ? this.$config.getOrganizationId() : this.organization_id
                if(role_id == 3) this.columns1[this.columns1.length-1].operation.splice(3, 1)
                let d = {
                    keyword: this.keyword,
                    page_size: this.pageSize,
                    page_num: this.current,
                    organization_id: da == "all" ? null : da,
                    dept: this.dept == "全部科室" ? null : this.dept,
                    state: this.state == "all" ? null : this.state,
                    dept_id: this.deptId == 'all' ? null : this.deptId
                }
                postData('/v1/outline/getOutlineList', d).then((res) => {
                    this.list = res.data.list
                    this.list.map(item => {
                        postData('v1/outline/getoutlineDetail',{id:item.id}).then(res => {
                            item.outline = res.data.outline
                        })
                        let d = ''
                        if(item.icd10_names) JSON.parse(item.icd10_names).forEach(item1 => {
                            d = !d ? item1 :  d + ',' + item1
                        })
                        item.icd10_title = d
                    })
                    this.list.forEach(element => {
                       this.select3.forEach(element2 => {
                           if (element.dept_id == element2.id) {
                               element.dept = element2.title
                           }
                       });
                    });
                    console.log(this.list);
                    
                    this.total = res.data.count
                })
            },
            handleNext() {
                this.$refs.messageForm.validate((valid) => {
                    if(valid) {
                        if (this.outlineForm.id) {
                            PostData('/v1/outline/getoutlineDetail',{id:this.outlineForm.id}).then(res => {
                                this.outlineForm.outline = res.data.outline
                                this.$router.push({path: 'outline-content', query: {id: this.outlineForm.id || null}})
                                sessionStorage.setItem('caseOutline', JSON.stringify(this.outlineForm))
                            })
                        } else {
                            this.$router.push({path: 'outline-content', query: {id: this.outlineForm.id || null}})
                            sessionStorage.setItem('caseOutline', JSON.stringify(this.outlineForm))
                        }
                    }
                })
            },
            handleCancel() {
                this.outlineForm = {
                    symptom: '',
                    degree: '',
                    dept_id: '',
                    desc: '',
                }
            }
        },
        mounted() {
            this.pageSize = 12
            this.tableHeight = window.innerHeight - 200
            PostData('/v1/common/getDeptList').then(res => {
                if(res.res_code == 1) this.patient_list = res.data
            })
            PostData('/v1/common/getDeptList').then(res => {
                this.select3 = [{id: 'all', title: '全部科室'},...res.data]
            })
            PostData('/v1/common/getOrganizationList').then((res) => {
                this.select1 = [{id: 'all', title: '全部机构'},...res.data]
            })
            this.getList()
        }
    }
</script>

<style scoped lang="less">
    .ivu-form-item{
        display: flex;
    }
    /deep/ .ivu-modal-body{
        padding: 40px !important;
    }
    /deep/ .ivu-form-item-label{
        font-family: PingFangSC-Regular;
        font-size: 16px !important;
        color: #474C63 !important;
        letter-spacing: 0.93px !important;
        text-align: right;
    }
    /deep/ .ivu-input, /deep/ .ivu-input-number, /deep/ .ivu-radio-wrapper, /deep/ .ivu-checkbox-wrapper{
        border-radius: 4px !important;
        font-family: PingFangSC-Regular !important;
        font-size: 16px !important;
        color: #474C63 !important;
        letter-spacing: 0.93px !important;
    }
    /deep/ .ivu-select-placeholder{
        font-family: PingFangSC-Regular;
        font-size: 16px!important;
        color: #9397AD;
        letter-spacing: 0.93px;
    }
    /deep/ .ivu-radio-inner, /deep/ .ivu-checkbox-inner{
        width: 16px;
        height: 16px;
    }
    /deep/ .ivu-radio-inner:after{
        left: 2px;
        top: 2px;
    }
    /deep/ .ivu-checkbox-inner:after{
        left: 5px;
        top: 3px;
    }
    /deep/ .ivu-radio-wrapper, /deep/ .ivu-checkbox-wrapper{
        margin-right: 30px;
    }
    .input-num{
        position: absolute;
        top: 0;
        right: -40px;
        line-height: 36px
    }
    .textarea-num{
        position: absolute;
        bottom: 0;
        right: -62px;
        line-height: 36px
    }
    .content{
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        overflow-y: auto;
        justify-content: flex-start;
        padding: 0 5%;
        background-color: rgb(242, 242, 242);

        .content-box{
            width: 300px;
            height: 170px;
            margin: 15px;
            background-color: #fff;
            padding: 8px;
            color: #000;
            position: relative;

            &:hover{
                .right-btn{
                    display: flex;
                }
            }
            .right-btn{
                display: none;
            }
        }
        .box-img{
            position: absolute;
            right: -38px;
            top: -20px;
            transform: rotate(335deg);
        }
        .box-degree{
            position: absolute;
            left: 0;
            top: 0;
            width: 30px;
            height: 17px;
            text-align: center;
            line-height: 17px;
            color: #fff;
            font-size: 12px;
        }
        .content-top{
            display: flex;

            .content-top-symptom{
                width: 82px;
                height: 64px;
                background-color:rgba(201, 201, 201, 1);
                display: flex;
                justify-content: center;
                align-items: center
            }
            .content-top-content{
                text-align: left;
                margin-left: 10px;
            }
        }
        .content-bottom{
            display: flex;
            justify-content: space-between;
            position: relative;
            margin-top: 10px;

            .bottom-left{
                text-align: left;
            }
            .bottom-right{
                display: flex;
                flex-direction: column;
                align-items: center;
                position: absolute;
                bottom: -10px;
                right: -6px;

                /deep/ .ivu-btn{
                    font-size: 14px !important;
                }
            }
            .bottom-right2{
                display: flex;
                flex-direction: column;
                align-items: center;
                position: absolute;
                top: 50px;
                right: -6px;
                z-index: 3;
                /deep/ .ivu-btn{
                    font-size: 14px !important;
                }
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
</style>

