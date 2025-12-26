<template>
    <div class="casemain">
        <div class="casemain_top">
            <div class="casemain_top_select">
                <p>科室</p>
                <Select style="width: 200px;" @on-change="selectChange1" v-model="valueSelect1">
                    <Option v-for="item in select1" :value="item.patient_division" :key="item.id">{{item.patient_division}}</Option>
                </Select>
            </div>
            <div class="casemain_top_select">
                <p>难度</p>
                <Select style="width: 200px;" @on-change="selectChange2" v-model="valueSelect2">
                    <Option v-for="item in select2" :value="item.id" :key="item.id">{{item.title}}</Option>
                </Select>
            </div>
            <Input @on-change="inputChange" prefix="ios-search" style="width: 300px;margin-left: 20px;" v-model="valueModal" placeholder="请输入病症/诊断/作者姓名"/>
            <div class="casemain_number">
                <p>病例总数：<span>{{count}}</span></p>
            </div>
            <div @click="addCase()" class="casemain_btn">
                <p>新建病例</p>
            </div>
        </div>
        <Modal class="reject-modals" v-model="rejectModal" :footer-hide="true" title="拒绝原因" width="700">
            <div style="min-height: 200px" v-if="isSee">{{no_pass_reason}}</div>
            <div v-else>
                <Input v-model="no_pass_reason" type="textarea" :rows="10" />
            </div>
            <div style="margin-top: 40px;display: flex;justify-content: center">
                <Button v-if="isSee" style="width: 120px;" type="primary" @click="editCase(activeItem)">编辑病例</Button>
                <Button v-else @click="refuse" type="primary" style="width: 120px;">确认</Button>
            </div>
        </Modal>
        <div class="casemain_middle">
            <div v-for="(item, index) in caseList" :key="index" @click="handleAdd(item.id)" class="casemain_box">
                <div :style="{backgroundColor: degreeLevel[item.degree].color}" class="casemain_box_float">
                    <p>{{degreeLevel[item.degree].title}}</p>
                </div>
                <div v-show="item.state != 3" class="box-img"> 
                    <img :width="item.state == 0 ? '60' : '80'" height="60" :src="selectState(item.state + 2)" />
                </div>
                <div class="casemain_box_top">
                    <div class="casemain_box_top_left">
                        {{item.symptom}}
                    </div>
                    <div class="casemain_box_top_right">
                        <p>ID：{{item.id}}</p>
                        <p>题目数量：{{item.question_count}}</p>
                    </div>
                </div>
                <div class="casemain_box_end">
                    <div class="casemain_box_end_left">
                        <p>机构：{{item.organization_name}}</p>
                        <p>科室：{{item.dept_name}}</p>
                        <p>创建人：{{item.realname}}</p>
                        <p>创建时间：{{changeTime(item.add_time)}}</p>
                    </div>
                    <!-- <div class="casemain_box_end_right">
                        <p class="number">{{item.use_count}}</p>
                        <p>使用次数</p>
                    </div> -->
                    <div :class="item.state == 2 ? 'bottom-right2' : 'bottom-right'">
                        <div v-if="item.state == 3">
                            <div style="font-size: 18px;color: #333333;">{{item.use_count}}</div>
                            <div style="ont-size: 12px;color: #333333;">使用次数</div>
                            <Button
                            v-if="$config.roleIsDistribution()"
                            style="margin: 4px 4px 0 0;"
                            type="error"
                            @click="deleteCase(item, index)"
                            >删除</Button>
                        </div>
                        <div class="right-btn" v-else-if="item.state == -1">
                            <Button type="primary" @click="rejectCase(item)">拒绝原因</Button>
                            <Button style="margin-left: 4px;" type="error" @click="deleteCase(item, index)">删除</Button>
                        </div>
                        <div class="right-btn" v-else-if="item.state == 0">
                            <Button type="primary" @click="editCase(item)">编辑</Button>
                            <Button style="margin-left: 4px;" type="error" @click="deleteCase(item, index)">删除</Button>
                        </div>
                        <div
                            @mouseleave="hideBtn"
                            class="right-btn"
                            style="flex-direction: column;"
                            v-else-if="item.state == 2"
                        >
                            <Button type="primary" @click.stop="auditCase(item)">审核</Button>
                            <Button v-if="isToExam" @click.stop="toExamCase(item, 3)">通过</Button>
                            <Button v-if="isToExam" @click.stop="toExamCase(item, -1)">拒绝</Button>
                        </div>
                        <div class="right-btn" v-else-if="item.state == 1&&$config.roleIsDistribution()">
                            <Button @click.stop="distributionCase(item)" type="primary">分配</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <distribution
        :show="showDistribution"
        @close="closeDistribution"
        :cases_id="cases_id"
        @handleCancel="getList"
        />
    </div>
</template>

<script>
    import postData from 'src/api/postData';
    import moment from 'moment';
    import state_1 from "../../../assets/img/audit-sate2/state_1.png";
    import state_2 from "../../../assets/img/audit-sate2/state_2.png";
    import state_4 from "../../../assets/img/audit-sate2/state_3.png";
    import state_3 from "../../../assets/img/audit-sate2/state_5.png";
    import distribution from "./com/distribution";
    export default {
        name: 'case-theory',
        components: { distribution },
        data() {
            return {
                state_1,
                state_2,
                state_3,
                state_4,
                list:[],
                count:0,
                caseList:[],
                cases_id: null,
                showDistribution: false,
                activeItem: null,
                no_pass_reason: "",
                rejectModal:false,
                isSee: false,
                isToExam: false,
                degreeLevel: {
                    1: { color: "#7ED321", title: "简单" },
                    2: { color: "#4098ff", title: "中等" },
                    3: { color: "#FD6C1E", title: "困难" },
                },
                select1:[],
                select2: [
                    { id: "all", title: "不限" },
                    { id: 1, title: "简单" },
                    { id: 2, title: "适中" },
                    { id: 3, title: "困难" }
                ],
                valueSelect1:'不限',
                valueSelect2:'all',
                valueModal:'',
                sendList:{
                    page_size:999,
                    page_num:1,
                    keyword:'',
                    degree_id:0,
                    patient_division:'',
                    question_type:2
                }
            }
        },
        methods: {
            hideBtn() {
                this.isToExam = false;
            },
            addCase(){
               this.$router.push({
                   name:"theory-base"
               }) 
            },
            auditCase(v) {
                window.event.stopPropagation();
                if (v.state == -1 || v.state == 3) this.$Message.info("已审核过该病例");
                else this.isToExam = true;
            },
            closeDistribution() {
                this.showDistribution = false;
            },
            distributionCase(val) {
                this.cases_id = val.id;
                this.showDistribution = true;
            },
            editCase(item){
                console.log(item);
                this.$router.push({
                    name:'theory-base',
                    query:{
                        caseid:item.id
                    }
                })
            },
            toExamCase(v, i) {
                this.activeItem = v;
                if (i === -1) {
                    this.isSee = false;
                    this.rejectModal = true;
                } else {
                    PostData("/v1/case/examineCase", { case_id: v.id, state: i }).then((r) => {
                        if (r.res_code == 1) {
                            this.isSee = false;
                            this.$Message.info("审核成功!");
                            this.getList();
                        }
                    });
                }
            },
            refuse() {
                if (this.no_pass_reason) {
                    PostData("case/approveCase", {
                        id: this.activeItem.id,
                        state: -1,
                        no_pass_reason: this.no_pass_reason,
                    }).then((r) => {
                        if (r.res_code == 1) {
                            this.rejectModal = false;
                            this.$Message.info("审核成功!");
                            this.getList();
                        }
                    });
                } else this.$Message.info("请输入拒绝原因");
            },
            rejectCase(val) {
                this.activeItem = val;
                this.no_pass_reason = val.no_pass_reason;
                window.event.stopPropagation();
                this.rejectModal = true;
                this.isSee = true;
            },
            selectState(state) {
                return this["state_" + state];
            },
            selectChange1(){
                this.valueSelect1 == '不限' ? this.sendList.patient_division = '' : this.sendList.patient_division = this.valueSelect1
                this.getList()
            },
            selectChange2(){
                this.valueSelect2 == 'all' ? this.sendList.degree_id = 0 : this.sendList.degree_id = this.valueSelect2
                this.getList()
            },
            handleAdd(id){
                console.log(id);
                this.$router.push({
                    name:"theory-base",
                    query:{
                        caseid:id
                    }
                })
            },
            inputChange(){
                this.sendList.keyword = this.valueModal
                this.getList()
            },
            changeTime(value){
               return moment().format('YYYY年MM月DD日',value)
            },
            getDepts(){
                postData("/v1/common/getDeptList").then(res => {
                    if (res) {
                        let add = {
                            id:'all',
                            patient_division:'不限'
                        }
                        res.data.forEach(element => {
                            element.patient_division = element.title
                        });
                        this.select1 = res.data
                        this.select1.unshift(add)
                    }
                })
            },
            getList(){
                //获取列表前判断是否为总管理员
                let role_id = JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id
                let org = role_id === 1 ? null : JSON.parse(sessionStorage.getItem('organizationId'))
                postData("/v1/case/getCaseList",{organization_id: org, ...this.sendList}).then(res => {
                    if (res) {
                        this.count = res.data.count
                        this.caseList = res.data.list
                    }
                })
            },
            deleteCase(val, i) {
                window.event.stopPropagation();
                this.$Modal.confirm({
                    title: "提示",
                    content: `<p>是否删除该病例！</p>`,
                    onOk: () => {
                        postData("/v1/case/removeCase", { id: val.id }).then((res) => {
                            if (res.res_code == 1) {
                                this.caseList.splice(i, 1);
                                this.$Message.success("删除成功！");
                            }
                        });
                    },
                });
            }
        },
        mounted() {
            this.getDepts()
            this.getList()
        }
    }
</script>

<style lang="less" scoped>
    .casemain{
        width: 100%;
        height: 100%;
        background: #eeeef6;
        .casemain_top{
            display: flex;
            align-items: center;
            height: 60px;
            background: #FFFFFF;
            .casemain_top_select{
                display: flex;
                align-items: center;
                margin-left: 20px;
                p{
                    font-family: PingFangSC-Regular;
                    font-size: 14px;
                    color: #333333;
                    letter-spacing: 0;
                    margin-right: 5px;
                }
            }
            .casemain_number{
                margin-left: 10px;
                p{
                    font-family: PingFangSC-Regular;
                    font-size: 14px;
                    color: #333333;
                    letter-spacing: 0;
                    span{
                        font-family: PingFangSC-Medium;
                        font-size: 14px;
                        color: #4098FF;
                        letter-spacing: 0;
                        line-height: 20px;
                    }
                }
                
            }
            .casemain_btn{
                margin-left: auto;
                margin-right: 20px;
                width: 100px;
                height: 30px;
                background: #4098FF;
                border-radius: 2px;
                border-radius: 2px;
                cursor: pointer;
                p{
                    font-family: PingFangSC-Medium;
                    font-size: 14px;
                    color: #FFFFFF;
                    letter-spacing: 0;
                    line-height: 30px;
                }
            }
        }
        .casemain_middle{
            height: 1106px;
            display: flex;
            flex-wrap: wrap;
            align-content: flex-start;
            overflow-y: auto;
            justify-content: flex-start;
            // padding: 0 5%;
            // background-color: #f2f2f2;
            padding: 10px;
            padding-left: 5px;
            padding-right: 5px;
            .casemain_box{
                width: 320px;
                height: 193px;
                background: #FFFFFF;
                border-radius: 4px;
                position: relative;
                cursor: pointer;
                margin-left: 30px;
                margin-top: 20px;
                .casemain_box_float{
                    width: 38px;
                    height: 20px;
                    background: #74C818;
                    border-radius: 0 2px 2px 0;
                    position: absolute;
                    left: 0;
                    top: 5px;
                    p{
                        font-family: PingFangSC-Medium;
                        font-size: 14px;
                        color: #FFFFFF;
                        letter-spacing: 0;
                        line-height: 20px;
                    }
                }
                .casemain_box_top{
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                    .casemain_box_top_left{
                        width: 100px;
                        height: 70px;
                        background: #DEDEEA;
                        margin-left: 15px;
                        margin-top: 15px;
                        font-family: PingFangSC-Medium;
                        font-size: 18px;
                        color: #333333;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        word-wrap:break-word;
                        overflow: hidden;
                    }
                    .casemain_box_top_right{
                        margin-left: 10px;
                        p{
                            font-family: PingFangSC-Regular;
                            font-size: 14px;
                            color: #333333;
                            letter-spacing: 0;
                            text-align: left;
                            margin-bottom: 10px;
                        }
                    }
                }
                .casemain_box_end{
                    display: flex;
                    align-items: flex-end;
                    .casemain_box_end_left{
                        margin-left: 15px;
                        p{
                            font-family: PingFangSC-Regular;
                            font-size: 12px;
                            color: #9397AD;
                            letter-spacing: 0;
                            text-align: left;
                            margin-bottom: 5px;
                        }
                    }
                    .casemain_box_end_right{
                        position: absolute;
                        right: 15px;
                        bottom: 15px;
                        .number{
                            font-family: PingFangSC-Medium;
                            font-size: 18px;
                            color: #333333;
                            letter-spacing: 0;
                        }
                        p{
                            font-family: PingFangSC-Regular;
                            font-size: 12px;
                            color: #333333;
                            letter-spacing: 0;
                        }
                    }
                }
            }
        }
    }
    .box-img {
      position: absolute;
      transform: rotate(360deg);
      right: 0;
      top: 0;
    }
    .bottom-right {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: absolute;
        bottom: 10px;
        right: 10px;

        /deep/ .ivu-btn {
            font-size: 14px !important;
        }
    }
    .bottom-right2 {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: absolute;
        top: 150px;
        right: 10px;
        z-index: 3;
        /deep/ .ivu-btn {
            font-size: 14px !important;
        }
    }
    .right-btn{
        display: flex;
        align-items: center;
    }
</style>