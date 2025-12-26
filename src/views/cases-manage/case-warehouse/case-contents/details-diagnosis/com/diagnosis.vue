<template>
    <div class="main">
        <Modal v-if="!isCheck" v-model="modal1" footer-hide title="处置方式" >
            <div class="m-btns">
                <Button class="btns" @click="selTypes('AmbulatoryTreatment')">作为门诊患者治疗</Button>
                <Button class="btns btns2" @click="selTypes('HospitalizedTreatment')">收患者入院治疗</Button>
            </div>
        </Modal>
        <div class="tabs-view tabs-content">
            <Tabs @on-click="tabs" v-model="casePane" type="line" size="small" class="tabs">
                <TabPane name="1" :label="setLabel">
                   <div v-if="types" @click="selType" class="patient-disposition"><Icon type="ios-settings" :size="20"/>  {{types}}</div>
                   <OperationLeft :diagnosisId="diagnosisId" :caseDataId="caseDataId" v-if="casePane == 1" :type="page" :tabindex="casePane" />
                </TabPane>
                <TabPane name="2" label="干扰项/扣分项">
                   <div v-if="types" @click="selType" class="patient-disposition"><Icon type="ios-settings" :size="20" />  {{types}}</div>
                   <OperationLeft :diagnosisId="diagnosisId" :caseDataId="caseDataId" v-if="casePane == 2" :typePane="typePane" :tabindex="casePane" :type="page" />
                </TabPane>
                <TabPane name="3" label="诊疗处置">
                    <analysis :diagnosisId="diagnosisId" v-if="casePane == 3" />
                </TabPane>
            </Tabs>
        </div>
        <div class="content let-content">
            <OperationRight  :diagnosisId="diagnosisId" :type="page" :typePane="typePane" :tabindex="casePane" />
        </div>
        <Modal v-model="outlineModal" :footer-hide="true" title="查看提纲" width="1100" @on-cancel="modalCancel">
            <outlines ref="DiagnosisOutlines" :dragcanvas="true" v-if="outlineModal" style="height: 700px;"/>
        </Modal>
    </div>
</template>

<script>
    import caseSee from '../../../../../../assets/img/case/case-see.png'
    import caseSeeGrey from '../../../../../../assets/img/case/case-see-grey.png'
    import OperationLeft from './operation-left'
    import OperationRight from './operation-right'
    import analysis from './analysis'
    import outlines from 'components/outlines/index'

    export default {
        components: { OperationLeft, OperationRight, analysis, outlines },
        props: {
            page: {
                type: String,
                default: ''
            },
            diagnosisId: {}
        },
        data() {
            return {
                modal1: false,
                case: null,
                actImg: caseSee,
                typePane: '',
                casePane: '1',
                case_id: { case_id: +sessionStorage.getItem('CASEID') }, // 139
                outlineModal: false,
                caseDataId:null
            }
        },
        computed: {
            types(){
                let o = {
                    1 : '作为门诊患者治疗',
                    2 : '收患者入院治疗',
                }
                return this.case&&!this.isCheck ? o[this.case.patient_disposition] : ''
            },
            isCheck(){
                return Boolean(this.$route.query.isCheck) || false
            }
        },
        mounted() {
           this.getData(true)
        },
        methods: {
            setOutlinesData(){
                PostData('/v1/case/getOutline', {case_id: parseInt(sessionStorage.getItem('CASEID'))}).then(res => {
                    if(res.res_code == 1) {
                        this.$refs.DiagnosisOutlines.data = JSON.parse(res.data.outline)
                        this.$refs.DiagnosisOutlines.graph.read(JSON.parse(res.data.outline))
                        this.$refs.DiagnosisOutlines.updateCanvasSize()
                    }
                })
            },
            selType(){
                this.modal1 = true
            },
            getData(init = false){
                PostData("/v1/case/getTreatmentDisposition",{...this.case_id, case_examine_frequency_id: this.diagnosisId}).then((r) => {
                    if(r&&r.res_code == 1) {
                        if(!r.data.patient_disposition&&init) this.modal1 = true
                        this.case = r.data
                        this.caseDataId = r.data.id
                        sessionStorage.setItem('CaseTreatment', r.data&&r.data.id)
                    }
                })
            },
            selTypes(name){
                let url = ""
                if (this.case) {
                    if (this.case.id) {
                        url = "/v1/case/modifyTreatmentDisposition"
                    } else {
                        url = "/v1/case/addTreatmentDisposition"
                    }
                } else {
                    url = "/v1/case/addTreatmentDisposition"
                }
                let d = {
                    id: this.case&&this.case.id || null,
                    ...this.case_id,
                    patient_disposition: name == "AmbulatoryTreatment" ? 1 : 2,
                    case_examine_frequency_id: this.diagnosisId
                }
                PostData(url,d).then((r) => {
                    if(r&&r.res_code == 1) {
                        this.getData()
                        this.modal1 = false
                    }
                })
            },
            tabs(name){
                this.actImg = this.casePane == '1' ?  caseSee : caseSeeGrey ;
                this.typePane = name == 2 ? 'term' : ''
            },
            setLabel(h, params){
                return h('div',
                {
                   on: {
                       mouseenter: () => {
                          this.actImg = caseSee
                       },
                       mouseleave: () => {
                          this.actImg = this.casePane == '1' ?  caseSee : caseSeeGrey ;
                       }
                   },
                   style: {
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems : 'center',
                            justifyContent: 'center'
                    }
                },
                [
                    h('span', '得分项', {style: {'letter-spacing': '1.5px'}}),
                    h('img', {
                        attrs: {
                            src: this.actImg,
                        },
                        style: {
                            width: '15px',
                            height: '15px',
                            marginLeft: '10px'
                        },
                        on: {
                            click: () => {
                                this.outlineModal = true
                                this.setOutlinesData()
                            }
                        }
                    }),
                ]);
            },
            modalCancel() {
                this.outlineModal = false
            }
        },
    }
</script>

<style lang="less" scoped>
    @import './details.less';
    .m-btns{
        height: 200px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        .btns{
            width: 150px;
            height: 36px;
            background-color: #fff;
            color: #4098ff;
        }
        .btns2{
            margin-left: 15px;
        }
    }
    .patient-disposition{
        height: 40px;
        background-color: #f9cd46;
        text-align: left;
        line-height: 40px;
        padding-left: 20px;
        &:hover{
            color: #4098FF
        }
    }
    /deep/ .ivu-tabs-nav-container:focus .ivu-tabs-tab-focused{
        border-color: #f0f0f7 !important;
    }
    /deep/ .ivu-tabs-tabpane{
        height: 597px;
    }
    .tabs-content{
        box-shadow: 0 0 6px 0 rgba(0,0,0,0.10);
        border-radius: 3px;
        .tabs{
            width: 100%;
            /deep/ .ivu-tabs-nav{
                width: 100%;
                margin: 0 !important;
                /deep/ .ivu-tabs-ink-bar{
                    margin: 0 !important;
                    height: 2px !important;
                    width: 100%/3 !important;
                }
                /deep/ .ivu-tabs-tab{
                     width: 100%/3 !important;
                     font-family: PingFangSC-Medium;
                     font-size: 18px;
                     margin: 0 0 2px 0 !important;
                     padding: 0 !important;
                     border: 1px solid #F0F0F7 !important;
                }
            }
        }
    }
    .let-content{
        background: rgba(240,240,247,0.30);
        border-radius: 3px;
    }
</style>
