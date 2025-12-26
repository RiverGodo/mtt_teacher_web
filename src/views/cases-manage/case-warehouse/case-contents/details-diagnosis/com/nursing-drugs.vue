<template>
<div class="diagnosis-form" v-if="type">
    <HeightTitle v-if="isEdit" :title="diagnosisTitle" />
    <!-- {{diagnosisFms}} -->
    <div v-if="type == 1" class="nursing-main-content" style="height: 34px;">
        <div class="nursing-main-text"><span style="color: #EB0C0C">*</span>手术名称</div>
        <Input :disabled="isCheck" class="nurse-main-item" v-model="diagnosisFms.operation" placeholder="输入手术名称" />
    </div>
     <div v-if="type == 4" class="nursing-main-content" style="height: 34px;">
        <div class="nursing-main-text"><span style="color: #EB0C0C">*</span>治疗名称</div>
        <Input :disabled="isCheck" class="nurse-main-item" v-model="diagnosisFms.name" placeholder="输入治疗名称" />
    </div>
    <div class="nursing-main" v-if="(itemType == 2 || itemType == 3) && type == 3">
        <Select :disabled="isCheck" label-in-value class="nurse-main-item drug-select" v-model="drugContent[0]" @on-change="operationChange(nursingList[0], 0, $event)" :placeholder="nursingList[0].hint" :multiple="nursingList[0].multiple">
            <Option class="nursing-main-option" v-for="(item1, index1) in nursingList[0].list" :value="item1.id" :key="index1">{{ item1.name }}</Option>
        </Select>
    </div>
    <div class="nursing-main" v-if="(type == 2 || type == 3) && itemType == 1">
        <!-- {{drugContent}} -->
        <div class="nursing-main-content modal-content" style="height: 34px;" v-for="(item, index) in nursingList" :key="index" >
            <div class="nursing-main-text" v-html="item.title"></div>
            <Input :disabled="isCheck" class="nurse-main-item" @on-change="changeDrugContent" v-model="drugContent[index]" v-if="item.type&&item.type==='input'" :placeholder="item.hint"/>
            <Select :disabled="isCheck" v-else label-in-value class="nurse-main-item drug-select" v-model="drugContent[index]" @on-change="operationChange(item, index, $event)" :placeholder="item.hint" :multiple="item.multiple">
                <Option class="nursing-main-option" v-for="(item1, index1) in item.list" :value="item1.id" :key="index1">{{ item1.name }}</Option>
            </Select>
        </div>
        <div v-show="type == 3" class="operation-content" v-for="(t,k) in inputContent" :key="k+200" >
            <div class="operation-text" ><span style="color: #EB0C0C">*</span>{{t.name}}操作内容</div>
            <Input :disabled="isCheck" class="operation-item" v-model="inputList[k]"  placeholder="请输入操作内容"/>
        </div>
    </div>
    <div v-if="itemType == 1" class="nursing-main-content" style="height: 94px;" >
        <div class="nursing-main-text"><span style="color: #EB0C0C">*</span>应用理由</div>
        <Input :disabled="isCheck" class="nurse-main-item"  v-model="diagnosisFms.reason" type="textarea" :rows="4" placeholder="输入应有理由" />
    </div>
    <div v-if="itemType == 1">
        <HeightTitle :title="weightTit" />
        <div class="diagnosis-weight"><RateStar @setStar="setStar" :weight="diagnosisFms.weight"/></div>
    </div>
    <div v-if="itemType == 1">
        <div style="display: flex;align-items:center;">
            <HeightTitle title="解析" />
            <Poptip word-wrap width="200" trigger="click" placement="right">
                <img style="cursor: pointer;margin-left: 10px;margin-top: 8px;" :src="infot" alt="">
                <div class="imgsloat" style="top: -20px;left: 170px;" slot="content">
                <div class="ddes">请解释，该治疗为【得分项】的理由。</div>
                </div>
            </Poptip>
        </div>
        <div>
            <Input type="textarea" :rows="4" :disabled="isCheck" v-model="diagnosisFms.parsing" placeholder="请填写解析" class="case-type" />
        </div>
    </div>
</div>
</template>

<script>
    import UploadBtn from '../../../../../../components/UploadButton'
    import deleteImg from '../../../../../../assets/img/templater/delete.png'
    import HeightTitle from './height-title'
    import nursings from './nursing-drug'
    import RateStar from '../../../../../../components/rate-star'
    import infot from "../../../../../../assets/img/templater/info.png"
    export default {
        components: { UploadBtn, HeightTitle, RateStar },
        props: {
            diagnosisTitle: {
                type: String,  //2 药品 3 护理
                default: ''
            },
            type: {
                type: Number,  //2 药品 3 护理
                default: 0
            },
            isEdit: {
                type: Boolean,
                default: false
            },
            drugContents: {
                type: Array,
                default: () => []
            },
            inputContents: {
                type: Array,
                default: () => []
            },
            diagnosisData:  {
                type: Array,
                default: () => []
            },
            diagnosisFm: {
                type: Object,
                default: { reason: '', weight: 0, operation: '',parsing:'' }
            },
            medicineNum: {
                type: Number,
                default: 0
            },
            itemType: {
                type: Number,
                default: 0
            },
            weightTit: {
                type: String,
                default: '得分权重'
            },
        },
        computed: {
            isCheck(){
                return Boolean(this.$route.query.isCheck) || false
            }
        },
        watch: {
            type(_new){
                this.setInput()
            },
            diagnosisFm(_new){
                this.diagnosisFms = _new
            },
            drugContents(_new){
                this.drugContent = _new
            },
            inputContents(_new){
                this.inputList  = _new
                if(_new[0] == null) this.inputContent = []
            },
            diagnosisData(_new){
                this.diagnosisDatas = _new
            }
        },
        data() {
            return {
                diagnosisFms: this.diagnosisFm,
                deleteImg,
                case_id: { case_id: +sessionStorage.getItem('CASEID') },
                drugContent: this.drugContents,
                diagnosisDatas: this.diagnosisData,
                inputContent: [],
                inputList: this.inputContents,
                drugInput: nursings.drugInput,
                nursingInput: nursings.nursingInput,
                nursingList:[],
                nursingLevel: [],
                fileType: '',
                parsing:'',
                infot
            }
        },
        methods: {
            setStar(i){
                this.diagnosisFms.weight = i
            },
            changeDrugContent(){
                console.log(this.diagnosisDatas,'diagnosisDatas')
            },
            setInput(){
                if(this.type == 2) {
                    this.nursingList = this.drugInput
                    this.getDrugs()
                }
                if(this.type == 3)  {
                    this.nursingList = this.nursingInput
                    this.getNursingData()
                }
                // console.log(this.type,this.nursingList);
            },
            operationChange(item, i, ev){
                if(item.multiple){
                    this.$nextTick(() => {
                        let doc = document.querySelectorAll('.modal-content')[i]
                        let hei = doc.querySelector('.drug-select .ivu-select-selection').offsetHeight
                        let h = doc.offsetHeight
                        if((hei+2) != h){
                            doc.style.height = `${hei+2}px`
                        }
                    })
                }
                this.diagnosisDatas.splice(i,1,ev)
                this.$emit('nursing-drugs-data', this.diagnosisDatas)
                if(item.title.includes('操作')){
                    let d = [], da = []
                    d = this.drugContent[i]
                    if(d.length>0){
                        d.forEach((t,index) => {
                            da[index] = {id: t, name: ev&&ev[index].label}
                        })
                    }
                    this.inputContent = da
                    this.inputList.length = this.inputContent.length
                }
            },
            getList(type, url, i, t){
                let d = { ...this.case_id, type: t}
                PostData(url, d).then((r) => {
                    if(r&&r.data) {
                        this[type][i].list = r.data
                    }
                })
            },
            getNursingData(){
                this.getList('nursingInput', '/v1/common/getTreatmentCategory', 0, 1)
                this.getList('nursingInput', '/v1/common/getTreatmentCategory', 2, 2)
                this.getList('nursingInput', '/v1/common/getTreatmentCategory', 3, 3)
                this.getList('nursingInput', '/v1/common/getTreatmentCategory', 4, 4)
                this.getList('nursingInput', '/v1/common/getTreatmentCategory', 5, 5)
            },
            getDrugs(){
                this.getList('drugInput', '/v1/common/getTreatmentCategory', 0 ,this.medicineNum == 6 ? 7 : 7)
                this.getList('drugInput', '/v1/common/getTreatmentCategory', 2 ,this.medicineNum == 6 ? 8 : 8)
            },
            a(w){
                this.diagnosisFms.weight = w
            }
        },
        mounted() {
            this.setInput()
            $CaseScoreWeightDeduction.$on('CaseScoreWeightDeduction', this.a)
        },
    }
</script>

<style lang="less" scoped>
    .diagnosis-weight{
        display: flex;
        text-align: left;
        margin-left: 15px;
    }
    .diagnosis-form{
        margin: 0 20px 30px 20px;
    }
    .operation-content{
        display: flex;
        flex-direction: column;
        margin-left: 70px;
        margin-bottom: 12px;
        min-height: 68px;
        .operation-text{
            margin-right: 10px;
            line-height: 34px;
            text-align: left;
        }
        .operation-item{
            flex: 1
        }
    }
    .nursing-main{
        display: flex;
        flex-direction: column;
    }
    .nursing-main-content{
        margin-bottom: 12px;
        display: flex;
        .nursing-main-text{
            width: 70px;
            text-align: left;
            line-height: 34px;
        }
        .nurse-main-item{
            flex: 1
        }
    }
</style>
