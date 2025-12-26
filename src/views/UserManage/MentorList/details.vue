<template>
    <div>
        <div class="top">
            <div class="top-left" v-if="info">
                <img class="left-img" src="https://www.baidu.com/img/baidu_resultlogo@2.png" alt="">
                <div class="left-content">
                    <div style="font-size: 28px">{{info.realname}}</div>
                    <div>用户ID：{{info.username}}</div>
                    <div>科室：{{info.dept_title}}</div>
                    <div>职称：{{info.profession_title}}</div>
                </div>
                <div class="left-time">
                    <div>注册时间：{{info.create_time}}</div>
                </div>
            </div>
            <div class="top-right" v-if="info">
                <div>数据统计截止时间：{{$config.formatTime(new Date())}}</div>
                <div style="display: flex;margin-top: 40px;justify-content: flex-end">
                    <div>
                        <div style="font-size: 28px">{{info.case_count}}</div>
                        <div style="font-size: 16px">出病例</div>
                    </div>
                    <div style="margin-left: 40px;">
                        <div style="font-size: 28px">{{info.outline_count}}</div>
                        <div style="font-size: 16px">出提纲</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="content">
            <div class="content-tabs">
                <div @click="selectTab(1)" style="margin-top: 40px;" :class="tabVal == 1 ? 'content-tab-pane-select' : 'content-tab-pane'">病例</div>
                <div @click="selectTab(2)" :class="tabVal == 2 ? 'content-tab-pane-select' : 'content-tab-pane'">提纲</div>
            </div>
            <div style="flex: 1;">
                <div v-if="list.length>0" :style="{'height': tableHeight + 'px'}" class="contents">
                    <div v-for="(item, index) in list" :key="index" class="content-box" @click="checkCase(item)">
                        <div class="box-degree" :style="{backgroundColor: degreeLevel[item.degree].color}">
                            {{degreeLevel[item.degree].title}}
                        </div>
<!--                        <div class="box-img" :style="{transform: item.state == 0 ? 'rotate(450deg)' : item.state == 2 ? 'rotate(408deg)' : 'rotate(334deg)', top: item.state == 0 ? '-3px' : '-20px', right: item.state == 0 ? '3px' : '-38px'}">-->
<!--                            <img :width="item.state == 0 ? '60' : '80'" height="60" :src="selectState(item.state + 2)" alt="">-->
<!--                        </div>-->
                        <div class="content-top">
                            <div class="content-top-symptom">{{item.symptom}}</div>
                            <div class="content-top-content">
                                <div>ID: <span>{{item.id}}</span></div>
                                <div>诊断 <span style="overflow-x: auto">{{item.principal_diagnosis_name}}</span></div>
                            </div>
                        </div>
                        <div class="content-bottom">
                            <div class="bottom-left">
                                <div>机构： <span>{{item.organization_name}}</span></div>
                                <div>科室： <span>{{item.dept || item.patient_division}}</span></div>
                                <div>创建人： <span>{{item.realname}}</span></div>
                                <div>创建时间： <span>{{item.create_time || item.add_time}}</span></div>
                            </div>
                            <div class="bottom-right">
                                <div style="margin-right: 10px;">
                                    <div>{{item.use_count}}</div>
                                    <div>使用次数</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style="height: 80px;width: 100%"></div>
                </div>
                <div class="no-view" :style="{'height': tableHeight + 'px'}" v-else>
                    <img class="imgs" :src="noImg" />
                    <p class="grey-medium1">暂未创建{{tabVal == 1 ? '病例' : '提纲'}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import noImg from '../../../assets/img/u3366.png'
    export default {
        data() {
            return {
                noImg,
                tabVal: 1,
                tableHeight: null,
                degreeLevel: {
                    1: {color: '#7ED321', title: '简单'},
                    2: {color: '#4098ff', title: '中等'},
                    3: {color: '#FD6C1E', title: '困难'}
                },
                list: [],
                caseList: [],
                outList: [],
                info: null
            }
        },
        methods: {
            selectTab(val) {
                this.tabVal  = val
                this.list = val == 1 ? this.caseList : this.outList
            },
            selectState(state) {
                return state == 4 ? "" : this['state_' + state]
            },
            getList(url, filed ,list) {
                let role_id = this.$config.getRoleId()
                let da = role_id > 1 ? this.$config.getOrganizationId() : this.organization_id
                if(role_id == 3) this.columns1[this.columns1.length-1].operation.splice(3, 1)
                let d = {
                    page_size: 9999,
                    page_num: 1,
                    select_user_id: +this.info.id,
                }
                PostData(url, d).then((res) => {
                    this[list] = res.data[filed] || []
                    if(res.data[filed].length>0){
                        this[list].map(item => {
                            let d = ''
                            if(item.icd10_names) JSON.parse(item.icd10_names).forEach(item1 => {
                                d = !d ? item1 :  d + ',' + item1
                            })
                            item.icd10_title = d
                        })
                    }
                    if(this.tabVal == 1) this.list = this.caseList
                })
            },
            checkCase(item){
                console.log(item);
            }
        },
        mounted() {
            if(sessionStorage.getItem('MentorDerails')) {
                this.info = JSON.parse(sessionStorage.getItem('MentorDerails'))
                this.getList('/v1/case/getCaseList', 'list' ,'caseList')
                this.getList('/v1/outline/getOutlineList', 'list','outList')
            }
            this.tableHeight = window.innerHeight - 200
        }
    }
</script>

<style scoped  lang="less">
    .no-view{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .imgs{
            width: 134px;
            height: 160px;
            margin-bottom: 30px;
        }
    }
    .top{
        height: 188px;
        background-color: rgba(36, 46, 99, 1);
        display: flex;
        justify-content: space-between;
        align-items: center;

        .top-left{
            display: flex;
            color: #fff;

            .left-img{
                width: 150px;
                height: 150px;
                border-radius: 100%;
                margin-left: 100px;
            }
            .left-content{
                margin-left: 100px;
                text-align: left;
                font-size: 14px;
                font-weight: bold;

                div{
                    margin-top: 14px;
                }
            }
            .left-time{
                margin-left: 100px;
                display: flex;
                align-items: flex-end;
                font-size: 14px;
                font-weight: bold;
            }
        }
        .top-right{
            margin-right: 100px;
            color: #fff;
        }
    }
    .content{
        display: flex;
        .content-tabs{
            width: 200px;
        }
        .content-tab-pane{
            color: #333;
            height: 54px;
            line-height: 54px;
            font-size: 18px;
            font-weight: bolder;

            &:hover{
                color: #4098ff;
                cursor: pointer;
            }
        }
        .content-tab-pane-select{
            background-color: #0099ff;
            color: #fff;
            height: 54px;
            line-height: 54px;
            font-size: 18px;
            font-weight: bolder;
        }
    }
    .contents{
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        overflow-y: auto;
        justify-content: flex-start;
        padding: 0 5%;
        background-color: rgb(242, 242, 242);
        .content-box{
            width: 315px;
            height: 170px;
            margin: 20px;
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
                bottom: 10px;
                right: -6px;

                /deep/ .ivu-btn{
                    font-size: 14px !important;
                }
            }
        }
    }

</style>
