<template>
    <div class="analysis">
        <div class="analysis-content">
            <Input :disabled="isCheck" v-model="treatment_principle" type="textarea" :rows="20" placeholder="请输入解读分析内容" />
            <div v-if="!isCheck" class="m-btns">
                <Button class="btns" @click="add">保存</Button>
            </div>
        </div>
    </div>
</template>

<script>
    import caseKey from '../../../../../../assets/case/case-key.png'
    export default {
        props: {
            type: {
                type: String,  //1 问诊 2 体格检查 3 辅助检查 4 诊疗详情
                default: ''
            },
        },
        data() {
            return {
                treatment_principle: '',
                dialogId:'',
                suggestion: '',
                caseKey,
                case_id: +sessionStorage.getItem('CASEID'),
                checkType: {
                    1: 'PrincipalDiagnosis',
                    2: 'SecondaryDiagnosis',
                    3: 'DifferentialDiagnosis'
                }
            }
        },
        watch: {
            type(_new){
                if(_new) this.getData()
            }
        },
        computed: {
            isCheck(){
                return Boolean(this.$route.query.isCheck) || false
            }
        },
        methods: {
             add(){
                 let d = {
                     case_id: this.case_id || null,
                     type: this.checkType[this.type],
                     frequency_id:sessionStorage.getItem("FrequencyId"),
                     explain: this.treatment_principle
                 }
                 PostData('case/addTreatmentExplain', d).then((r) => {
                     if(r&&r.res_code == 1) this.$Message.info(r.msg);
                 })
             },
             getData(){
                PostData('/v1/treatment/getTreatmentListByScore',{frequency_id:parseInt(sessionStorage.getItem("FrequencyId")),case_id: this.case_id}).then((r) => {
                    if(r&&r.res_code == 1) {
                        this.treatment_principle = r.data ? r.data.explain : ''
                        this.dialogId = parseInt(sessionStorage.getItem("FrequencyId"))
                    }
                })
            },
        },
        mounted() {
            this.getData()
        }
    }
</script>

<style lang="less" scoped>
    .analysis{
        width: inherit;
        height: 584px;
        position: relative;
        .empty{
            width: inherit;
            height: inherit;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            .case-key{
                width: 213px;
                height: 134px;
            }
            .empty-text{
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #9397AD;
            }
        }
        .analysis-content{
            width: inherit;
            height: inherit;
            padding: 20px 30px;
            .m-btns{
                height: 36px;
                margin-top: 30px;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: flex-end;
                .btns{
                    width: 150px;
                    height: 36px;
                    background-color: #fff;
                    color: #4098ff;
                }
            }
            .title{
                text-align: left;
                font-family: PingFangSC-Medium;
                font-size: 18px;
                color: #474C63;
                margin-bottom: 15px;
            }
        }
    }
</style>
