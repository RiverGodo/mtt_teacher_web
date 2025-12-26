<template>
    <div>
        <CaseSummary :show="show" @close="close"/>
        <div class="main">
            <div class="btns">
                <Button  @click="selType(t,i)" :class="t.active ? 'act-btn' : 'de-btn'" v-for="(t,i) in btns" :key="i" v-if="t.show">{{t.title}}</Button>
            </div>
            <diagnosis page="1" v-if="page == 1"  />
            <diagnosis page="2" v-if="page == 2"  />
            <diagnosis page="3" v-if="page == 3"  />
            <treatment page="4" v-if="page == 4" />
            <diagnosis page="5" v-if="page == 5"  />
        </div>
        <div class="case-btn-box">
            <Button class="case-btn-last" v-if="!isCheck" @click="handleLast" type="primary">上一步</Button>
            <Button class="case-btn" v-if="!isCheck" @click="summary()" type="primary">病例总结</Button>
        </div>
    </div>
</template>
<script>
import diagnosis from './com/diagnosis'
import treatment from './com/treatment.vue'
import CaseSummary from './com/case-summary'
export default {
    components: { diagnosis, treatment, CaseSummary},
    data() {
        return {
            show: false,
            page: 0,
            btns: [
                { title: '主要诊断', active: false, show:true },
                { title: '次要诊断', active: false, show:true },
                { title: '鉴别诊断', active: false, show:true },
                // { title: '防治与诊疗计划', active: false, show:true },
                // { title: '扣分项', active: false, show:true },
            ],
            isCheck:false
        }
    },
    beforeDestroy () {
        $CasePreservation.$off('CasePreservation', this.preservation)
        $CaseSummarys.$off('CaseSummarys', this.summary)
    },
    mounted() {
        this.isCheck = this.$route.query ? this.$route.query.isCheck : false
        this.getD()
        this.selType(this.btns[0], 0)
        $CasePreservation.$on('CasePreservation', this.preservation)
        $CaseSummarys.$on('CaseSummarys', this.summary)
    },
    methods: {
        close(){
            this.show = false
        },
        summary(){
            this.show = true
        },
        preservation(index){
            if(index == 6) this.complete(true)
        },
        selType(t,i){
            this.page = i + 1;
            this.btns.map((it, l) => {
                if(l === i) it.active = true;
                else it.active = false
            })
        },
        handleLast() {
            this.$emit('handleNavigate', 5)
        },
        getD() {
            PostData("/v1/case/getDiagnoseByScore",{case_id:+sessionStorage.getItem("CASEID")}).then(res => {
                if (res.data.principal.diagnose_list.length == 0) {
                    this.btns[0].show = false    
                }
                if (res.data.secondary.diagnose_list.length == 0) {
                    this.btns[1].show = false
                }
                if (res.data.differential.diagnose_list.length == 0) {
                    this.btns[2].show = false   
                }
            })
            // PostData("case/getFirstListByTab",{case_id:+sessionStorage.getItem("CASEID"),tab_type:"SecondaryDiagnosis"}).then(res => {
            //     if (res.data.length == 0) {
            //         this.btns[1].show = false
            //     }
            // })
            // PostData("case/getFirstListByTab",{case_id:+sessionStorage.getItem("CASEID"),tab_type:"DifferentialDiagnosis"}).then(res => {
            //     if (res.data.length == 0) {
            //         this.btns[2].show = false
            //     }
            // })
            // PostData("case/getFirstListByTab",{case_id:+sessionStorage.getItem("CASEID"),tab_type:"treat",score_type:2,frequency_id:+sessionStorage.getItem("FrequencyId")}).then(res => {
            //     let coutnumber = 1
            //     for (let i = 0; i < res.data.length; i++) {
            //         if (res.data[i].count != 0) {
            //             coutnumber = coutnumber + 1
            //         }  
            //     }
            //     if (coutnumber == 1) {
            //         this.btns[3].show = false
            //     }
            // })
            // PostData("case/getFirstListByTab",{case_id:+sessionStorage.getItem("CASEID"),tab_type:"deduction"}).then(res => {
            //     if (res.data.length == 0) {
            //         this.btns[4].show = false
            //     }
            // })
        },
        complete(save) {
            // let d = {
            //     case_id: +sessionStorage.getItem('CASEID'),
            //     tab_type: "PrincipalDiagnosis"
            // }
            // PostData('case/getFirstListByTab', d).then((r) => {
            //     if(r.data){
            //         if(r.data.length>0){
            //             let d = r.data[0]
            //             if(d.weight)  {
            //                 if(save) this.$Message.success('保存成功')
            //                 else {
            //                     this.$Message.info('病例创建成功！');
            //                     this.$router.push('case-warehouse')
            //                 }
            //             }else this.$Message.info('请选择主要诊断的评分权重！');
            //         }
            //     }
            // })
            let state = +JSON.parse(sessionStorage.getItem('CaseContentSum')).state
            if(state === 3) this.$Message.info('该病例已通过审核')
            else {
                this.$Message.success(save ? '提交成功！' : '保存成功!')
            //     PostData('case/approveCase',{id: +sessionStorage.getItem('CASEID'), state: 1}).then((r) => {
            //         if(r.res_code == 1) {
            //             this.$Message.success('已提交审核!')
            //             this.$router.push('case-warehouse')
            //         }
            //     })
            }
        }
    },
}
</script>
<style lang="less" scoped>
    .btn{
        width: 150px;
        height: 41px;
        border-top-left-radius: 20.5px;
        border-bottom-left-radius: 20.5px;
        margin-bottom: 15px;
        font-size: 18px;
        border: none
    }
    .main{
        display: flex;
        flex-direction: row;
    }
    .btns{
        width: 150px;
        margin-top: 49px;
        .act-btn{
            .btn;
            background-color:#4098FF;
            color: #fff;
            box-shadow: 0 0 5px 0 rgba(64,152,255,0.40);
        }
        .de-btn{
            .btn;
            background-color: #F0F0F7;
            color: #9397AD;
            box-shadow: none;
        }
    }
    .case-btn-box{
        display: flex;
        margin-top: 15px;
        justify-content: center;
        .case-btn-last{
            width: 150px;
            height: 38px;
            background-color: #fff;
            color: #4098ff;
        }

        .case-btn{
            width: 150px;
            height: 38px;
            margin-left: 20px;
        }
    }
</style>
