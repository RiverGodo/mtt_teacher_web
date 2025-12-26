<template>
  <div class="diagnosisDetail">
    <!-- 诊疗次数 tab 面板 -->
    <div class="diagnosisTimesWrapper">
      <div class="diagnosisTimesWrapperItem diagnosisTimesWrapperTitle">
        <img :src="assets.diagnosisImg" class="diagnosis-img" />诊疗详情
      </div>
      <div
        class="diagnosisTimesWrapperItem"
        v-for="(diagnosisTimesItem,
        diagnosisTimesIndex) in diagnoseFrequencyList"
        :key="'diagnoseFrequencyList' + diagnosisTimesIndex"
        :class="
          diagnosisTimesItem.frequency_index == currentDiagnosisNum
            ? 'diagnosisTimesWrapperItemActive'
            : ''
        "
        @click="changeDiagnoseFrequency(diagnosisTimesItem)"
      >
        第{{ diagnosisTimesItem.frequency_index }}次诊疗
      </div>
      <div class="diagnosisTimesWrapperAddBtn">
        <span>+ 添加诊疗</span>
      </div>
    </div>
    <!-- 诊疗项 tab 面板 -->
    <div class="diagnosisItemsTabWrapper">
      <div
        class="diagnosisItemsTabWrapperItem"
        v-for="(diagnosisItem, diagnosisItemIndex) in diagnosisItemsList"
        :key="'diagnosisItemsList' + diagnosisItemIndex"
        :class="
          diagnosisItem.index == currentDiagnosisItemNum
            ? 'diagnosisItemsTabWrapperItemActive'
            : ''
        "
        @click="changeDiagnosisItem(diagnosisItem)"
      >
        {{ diagnosisItem.title }}
      </div>
    </div>
    <!-- 各种诊疗项 -->
    <div class="diagnosisItemsWrapper">
      <!-- 场景描述 -->
      <scene-description
        v-if="currentDiagnosisItemNum == 1"
        :diagnosisId="currentFrequencyId"
        :isCheck="isCheck"
      />
      <!-- 问诊 -->
      <interrogation v-if="currentDiagnosisItemNum == 2" :isCheck="isCheck" />
      <!-- 体格检查 -->
      <body-check v-if="currentDiagnosisItemNum == 3" :isCheck="isCheck" />
      <!-- 辅助检查 -->
      <assist-check v-if="currentDiagnosisItemNum == 4" :isCheck="isCheck" />
      <!-- 防止诊疗 -->
      <treatment v-if="currentDiagnosisItemNum == 5" :isCheck="isCheck" />
      <div class="case-btn-box">
        <Button
          class="case-btn-last"
          v-if="!isCheck"
          @click="handleLast"
          type="primary"
          >上一步</Button
        >
        <Button
          class="case-btn"
          v-if="!isCheck"
          @click="handleNext(false)"
          type="primary"
          >下一步</Button
        >
      </div>
    </div>
  </div>
</template>

<script>
// 静态资源
import diagnosisImg from "../../../../../assets/img/case/diagnosis.png";
// 初始化值
const defaultDiagnosisNum = 1;
const defaultDiagnosisItemNum = 1;
// 组件
import sceneDescription from "./components/scene-description";
import interrogation from "./components/interrogation";
import bodyCheck from "./components/body-check";
import assistCheck from "./components/assist-check";
import treatment from "./components/treatment";
import postData from "src/api/postData";
export default {
  name: "diagnosisDetail",
  props: {
    isCheck: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      assets: {
        diagnosisImg,
      },
      diagnoseFrequencyList: [],
      currentDiagnosisNum: defaultDiagnosisNum,
      diagnosisItemsList: [
        { title: "场景描述", index: 1 },
        { title: "问诊", index: 2 },
        { title: "体格检查", index: 3 },
        { title: "辅助检查", index: 4 },
        { title: "防治与诊疗计划", index: 5 },
      ],
      currentDiagnosisItemNum: defaultDiagnosisItemNum,
      case_id: 0,
      currentFrequencyId: 0,
    };
  },
  components: {
    sceneDescription,
    interrogation,
    bodyCheck,
    assistCheck,
    treatment,
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.case_id = +this.$route.query.id;
      this.getDiagnoseFrequency(this.case_id);
    },
    getDiagnoseFrequency(case_id) {
      postData("case/getDiagnoseFrequency", { case_id }).then((res) => {
        if (res.res_code === 1) {
          this.diagnoseFrequencyList = res.data;
          this.currentFrequencyId = res.data[0].id; // 默认选择第一次诊疗的id
        }
      });
    },
    // 切换第N次诊疗
    changeDiagnoseFrequency(item) {
      this.currentDiagnosisNum = item.frequency_index;
      this.currentDiagnosisItemNum = defaultDiagnosisItemNum;
    },
    // 切换诊疗项
    changeDiagnosisItem(item) {
      this.currentDiagnosisItemNum = item.index;
    },
    // 上一步
    handleLast() {
      this.$emit("preStep");
    },
    // 下一步
    handleNext() {
      this.$emit("nextStep");
    },
  },
};
</script>

<style scoped lang="less">
@import url("./diagnosis-detail.less");
</style>