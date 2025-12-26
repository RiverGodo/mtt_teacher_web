<template>
  <div class="create-case-page" id="content">
    <div class="header">
      <div class="header-left" @click="handleBack">
        <img class="header-back-img" :src="assets.content_back" alt />
        <div class="header-back-font">返回</div>
      </div>
      <!-- <div v-if="!isCheck" class="header-right">
        <div class="header-right-box" @click="handleSumit">
          <img class="header-right-img" :src="assets.content_submit" alt />
          <div class="header-right-font">提交</div>
        </div>
      </div> -->
    </div>
    <div class="content">
      <!-- 步骤导航 -->
      <div class="navigate">
        <div
          v-for="(item, index) in navigate"
          :key="index"
          :class="opinionNavigate(index)"
          @click="setNavigate(index)"
        >
          <div class="navigate-left">
            <span />
          </div>
          <div class="navigate-content">{{ item.title }}</div>
          <div class="navigate-right">
            <span />
          </div>
        </div>
      </div>
      <!-- 病例信息 -->
      <case-info
        v-if="progress === 1"
        :caseData="caseData"
        :isCheck="isCheck"
        @nextStep="handleNextStep"
      />
      <!-- 患者概述 -->
      <patient-info
        v-if="progress === 2"
        :caseData="caseData"
        :isCheck="isCheck"
        @nextStep="handleNextStep"
        @preStep="progress--"
      />
      <!-- 创建诊断 -->
      <create-diagnosis
        v-if="progress === 3"
        :caseData="caseData"
        :isCheck="isCheck"
        @nextStep="handleNextStep"
        @preStep="progress--"
      />
      <!-- 诊疗详情 -->
      <diagnosis-detail
        v-if="progress === 4"
        :caseData="caseData"
        :isCheck="isCheck"
        :basisData="caseBasisList"
        @nextStep="handleNextStep"
        @preStep="progress--"
      />
      <!-- 提纲查看 -->
      <ouline-preview style="width: 100%;" :isCheck="isCheck" v-if="progress == 5" />
      <!-- 评分设置 -->
      <score-set v-if="progress == 6" :isCheck="isCheck" @handleNavigate="handleNavigate" />
    </div>
  </div>
</template>

<script>
// 静态资源和方法
import content_back from "../../../../assets/img/case/content_back.png";
import content_submit from "../../../../assets/img/case/content_submit.png";
import postData from "src/api/postData";
// 组件
import caseInfo from "./com/case-info";
import patientInfo from "./com/patient-info";
import createDiagnosis from "./com/create-diagnosis";
import diagnosisDetail from "./com/diagnosis-detail";
import scoreSet from "./com/score-set";
import oulinePreview from "./com/outline-preview";
// 导航项
const navigate = [
  { title: "病例信息" },
  { title: "患者概述" },
  { title: "创建诊断" },
  { title: "诊疗详情" },
  { title: "提纲查看" },
  { title: "评分设置" },
];
export default {
  name: "createCasePage",
  components: {
    caseInfo,
    patientInfo,
    createDiagnosis,
    diagnosisDetail,
    scoreSet,
    oulinePreview
  },
  provide(){
    return {
      basisData:[]
    }
  },
  data() {
    return {
      // 静态资源
      assets: {
        content_back,
        content_submit,
      },
      progress: 1,
      maxProgress: 1,
      isCheck: false, // 当前病例状态 新建/编辑/查看
      navigate, //导航数据
      caseData: {}, // 病例信息
      caseBasisList:[], // 病例诊断依据
    };
  },
  created(){
    this.case_id = +this.$route.query.id;
    if(this.case_id){
      sessionStorage.setItem("CASEID",this.case_id)
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (this.case_id) {
        this.isCheck = this.$route.query.isCheck == 'true' ? true:false
        // 存储当前的 caseid
        sessionStorage.setItem("CASEID",this.case_id)
        this.getCaseDetailByCaseId(this.case_id);
        this.getCurrentCaseMaxStep(this.case_id);
        this.getCaseBasisList(this.case_id)
      }
    },
    // 获取病例详情
    getCaseDetailByCaseId(id) {
      postData("case/getCaseDetailAndOutlines", { id }).then((res) => {
        if (res.res_code === 1) {
          this.caseData = res.data;
          sessionStorage.setItem("CaseContentMsg", JSON.stringify(res.data));
          const ITEM = res.data.outlines[0].outline;
          if (ITEM) this.setData(JSON.parse(ITEM), res.data.outlines[0]);
          
        }
      });
    },
    // 拿到鉴别要素
    async setElements() {
      let ele = [];
      let identify = [];
      await PostData("case/getElements", {
        type: "identify_element",
        case_id: this.case_id,
        frequency_id: sessionStorage.getItem("FrequencyId"),
      }).then((res) => {
        res.data.forEach((item) => {
          item.code = item.id;
          item.title = item.element_name;
        });
        identify = res.data;
      });
      return [ele, identify];
    },
    //
    async setData(item, outline) {
      let identify = await this.setElements();
      this.saveIdentification(identify[1]);
      PostData("case/saveCaseOutline", { ...outline });
    },
    // 存储鉴别要素
    saveIdentification(identify_elements = []) {
      if (identify_elements.length > 0) {
        PostData("case/saveIdentifyElement", {
          case_id: this.case_id,
          identify_elements,
        }).then((r) => {
          if (r.res_code)
            sessionStorage.setItem(
              "IdentifyElement",
              JSON.stringify(identify_elements)
            );
        });
      } else
        sessionStorage.setItem(
          "IdentifyElement",
          JSON.stringify(identify_elements)
        );
    },
    // 获取病例的依据
    getCaseBasisList(case_id) {
      let frequency_id = sessionStorage.getItem("FrequencyId");
      let params = {
        case_id,
        frequency_id,
      };
      PostData("case/getMockDiagnoses", params).then(res=>{
        if(res.res_code === 1){
          this.caseBasisList = res.data
          // 此处动态修改了 provide的值
          this._provided.basisData = this.caseBasisList;
        }
      })
    },
    handleBack() {},
    // 点击下一步，再次获取详情回调
    handleNextStep(case_id) {
      if(case_id){
        this.case_id = case_id
      }
      if (this.case_id) {
        this.getCaseDetailByCaseId(this.case_id);
        this.getCurrentCaseMaxStep(this.case_id);
        this.progress++;
        PostData("case/setStep", {
            case_id: +sessionStorage.getItem("CASEID"),
            step: this.progress,
          }).then((res) => {
            if (res.res_code == 1) {
              sessionStorage.setItem("CaseActiveMaxStep", this.progress);
              this.maxProgress = this.progress;
            }
          });
      }
    },
    handleSumit() {
      let data = this.formInline;
      console.log(data);
    },
    // 计算当前步骤样式
    opinionNavigate(index) {
      if (index == 0)
        return this.progress == 1 ? "navigate-first-check" : "navigate-first";
      else {
        if (index == this.progress - 1) return "navigate-other-check";
        else if (index > this.maxProgress - 1) return "navigate-other";
        else if (index <= this.maxProgress - 1) return "navigate-other-checked";
      }
    },
    // 切换当前步骤
    setNavigate(index) {
      if (index < this.maxProgress) this.progress = index + 1;
    },
    // 获取当前病例已填写的最后步骤数
    getCurrentCaseMaxStep(case_id) {
      PostData("case/getStep", { case_id }).then((res) => {
        if (res.res_code === 1) {
          this.maxProgress = res.data.step;
        }
      });
    },
    handleNavigate(index) {
      PostData("case/getStep", {
        case_id: +sessionStorage.getItem("CASEID"),
      }).then((res) => {
        if (index > res.data.step || !res.data.step)
          PostData("case/setStep", {
            case_id: +sessionStorage.getItem("CASEID"),
            step: index,
          }).then((res) => {
            if (res.res_code == 1) {
              sessionStorage.setItem("CaseActiveMaxStep", index);
              this.maxProgress = index;
            }
          });
      });
      this.progress = index;
      sessionStorage.setItem("CaseActiveStep", index);
    },
  },
};
</script>

<style scoped lang="less">
@import url("./index.less");
</style>