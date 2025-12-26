<template>
    <div class="analysis">
        <div class="analysis-content">
            <div v-for="(item, index) in treatment_list" :key="index" class="un-list">
                <span style="float:left;font-size: 18px;margin-bottom: 10px;">{{index+1}}.{{item.name}}</span>
                <Input :disabled="isCheck" v-model="item.explain" type="textarea" :rows="5" placeholder="请输入解读分析内容" />
            </div>
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
                suggestion: '',
                caseKey,
                case_id: +sessionStorage.getItem('CASEID'),
                checkType: {
                    1: 'PrincipalDiagnosis',
                    2: 'SecondaryDiagnosis',
                    3: 'DifferentialDiagnosis'
                },
                treatment_list:[]
            }
        },
        watch: {
            type(_new){
                if(_new){
                    this.getData()
                    this.getList()
                }
            }
        },
        computed: {
            isCheck(){
                return Boolean(this.$route.query.isCheck) || false
            }
        },
        methods: {
             add(){
                //  let d = {
                //      case_id: this.case_id || null,
                //      type: this.checkType[this.type],
                //      unscramble: this.treatment_principle
                //  }
                let d = []
                this.treatment_list.forEach((donms,list) => {
                    d.push({
                        case_diagnose_id:donms.id,
                        explain:donms.explain
                    })
                });
                let add = 0
                d.forEach(element => {
                    if (!element.explain) {
                        add = add + 1
                    }
                });
                // console.log(add);
                if (add == 0) {
                    d.forEach(element => {
                        PostData('/v1/case/modifyDiagnose', {case_diagnose_id:element.case_diagnose_id,explain:element.explain}).then((r) => {
                            if(r&&r.res_code == 1) this.$Message.info("保存成功");
                        }) 
                    });
                }else{
                    this.$Message.info("请填写解读分析！");
                }
             },
             getData(){
                PostData('/v1/case/getDiagnoseScore',{case_id: this.case_id, type: this.checkType[this.type]}).then((r) => {
                    if(r&&r.res_code == 1) {
                        this.treatment_principle = r.data.list ? r.data.unscramble : ''
                    }
                })
            },
            getList(){
                 PostData('/v1/case/getDiagnoseByScore',{case_id: this.case_id, tab_type: this.checkType[this.type]}).then((r) => {
                   if(r&&r.res_code == 1) {
                       if (this.type == 1) {
                           this.treatment_list = r.data.principal.diagnose_list
                       } else if(this.type ==2){
                           this.treatment_list = r.data.secondary.diagnose_list
                       }else{
                           this.treatment_list = r.data.differential.diagnose_list
                       }
                       this.treatment_list.forEach(element => {
                           element.name = element.element_name
                       });
                    }
                })
            }
        },
        mounted() {
              this.getData()
              this.getList()
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
            overflow-y: auto;
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
        .un-list{
            margin-top: 10px;
            margin-bottom: 20px;
        }
    }
</style>
