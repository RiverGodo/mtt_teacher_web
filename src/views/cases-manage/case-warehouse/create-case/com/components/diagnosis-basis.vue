<template>
  <div class="diagnosisSelWrapper">
    <div class="diagnosisSelTitle">
      <img :src="assets.correct" class="img" />支持诊断
    </div>
    <div class="diagnosisSelList">
      <diagnosis-type
        v-for="(item, index) in supportDiagnosisList"
        :key="'supportDiagnosisList' + index"
        :info="item"
        :type="'support'"
        :diagnosisIndex="index"
        :disables="item.disabled"
        :check="item.check"
        @changeSupportDiagnosisState="changeSupportDiagnosisState"
      />
    </div>
    <div class="diagnosisSelTitle">
      <img :src="assets.error" class="img" />排除诊断
    </div>
    <div class="diagnosisSelList">
      <diagnosis-type
        v-for="(item, index) in noSupportDiagnosisList"
        :key="'noSupportDiagnosisList' + index"
        :info="item"
        :type="'noSupport'"
        :diagnosisIndex="index"
        :disables="item.disabled"
        :check="item.check"
        @changeNoSupportDiagnosisState="changeNoSupportDiagnosisState"
      />
    </div>
  </div>
</template>

<script>
// 静态资源
import correct from "../../../../../../assets/case/correct2.png";
import error from "../../../../../../assets/case/error2.png";
// 组件
import diagnosisType from "./diagnosis-type";
export default {
  name: "diagnosisBasis",
  props: {
    diagnosisList: {
      type: Array,
      default: function () {
        return [];
      },
    },
    addedDiagnosisList: {
      type: Array,
      default: function () {
        return [];
      },
    },
    diagnosisInfo: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  mounted() {
    this.case_id = +this.$route.query.id;
  },
  data() {
    return {
      assets: {
        correct,
        error,
      },
      supportDiagnosisList: [],
      noSupportDiagnosisList: [],
    };
  },
  components: {
    diagnosisType,
  },
  methods: {
    // 查询当前项的已添加的诊断
    getCurrentItemDiagnosisAdd() {
      let case_id = this.case_id;
      let frequency_id = sessionStorage.getItem("FrequencyId");
      let question_index = this.diagnosisInfo.question_index;

      let params = {
        case_id,
        frequency_id,
        question_index,
      };
      PostData("case/getTalkDiagnose", params).then((res) => {
        if (res.res_code === 1) {
          this._formateDefaultDiagnosisList(this.diagnosisList);
          this._formateDiagnosisAddState(res.data);
        }
      });
    },
    changeSupportDiagnosisState(val) {
      let { index, check, weight, id } = val;
      // 如果支持诊断已经选择，排除诊断就不可以选择
      let noSupportIndex = this._findIndex(this.noSupportDiagnosisList, id);
      let cpSupportItem = Object.create(this.supportDiagnosisList[index]);

      if (noSupportIndex >= 0) {
        let cpNoSupportItem = Object.create(
          this.noSupportDiagnosisList[noSupportIndex]
        );
        cpNoSupportItem.disabled = check;
        this.noSupportDiagnosisList.splice(noSupportIndex, 1, cpNoSupportItem);
      }

      cpSupportItem.check = check;
      cpSupportItem.weight = weight;
      this.supportDiagnosisList.splice(index, 1, cpSupportItem);
    },
    changeNoSupportDiagnosisState(val) {
      let { index, check, weight, id } = val;
      // 如果除诊诊断已经选择，支持诊断就不可以选择
      let supportIndex = this._findIndex(this.supportDiagnosisList, id);
      let cpNoSupportItem = Object.create(this.noSupportDiagnosisList[index]);
      if (supportIndex >= 0) {
        let cpSupportItem = Object.create(
          this.supportDiagnosisList[supportIndex]
        );
        cpSupportItem.disabled = check;
        this.supportDiagnosisList.splice(supportIndex, 1, cpSupportItem);
      }

      cpNoSupportItem.check = check;
      cpNoSupportItem.weight = weight;
      this.noSupportDiagnosisList.splice(index, 1, cpNoSupportItem);
    },
    // 工具，格式化
    _formate(){
      this._formateDefaultDiagnosisList(this.diagnosisList);
      this._formateDiagnosisAddState(this.addedDiagnosisList);
    },
    // 工具，寻找id对应的索引
    _findIndex(arr = [], id = 0) {
      return arr.findIndex((item) => item.id === id);
    },
    // 工具，整理默认支持项和排除项
    _formateDefaultDiagnosisList(newVal) {
      this.supportDiagnosisList = JSON.parse(JSON.stringify(newVal));
      // 不支持的只有鉴别
      this.noSupportDiagnosisList = JSON.parse(
        JSON.stringify(
          newVal.filter((item) => item.type === "DifferentialDiagnosis")
        )
      );
      this.supportDiagnosisList.forEach((item) => {
        item.check = false;
        item.disabled = false;
      });
      this.noSupportDiagnosisList.forEach((item) => {
        item.check = false;
        item.disabled = false;
      });
    },
    // 工具，整理当前项的已添加的诊断状态
    _formateDiagnosisAddState(arr = []) {
      console.log("整理当前项的已添加的诊断状态")
      arr.forEach((item) => {
        // 支持
        if (item.basis_type === "SupportingBasis") {
          let sIndex = this.supportDiagnosisList.findIndex(
            (supportDiagnosis) => item.case_diagnose_id == supportDiagnosis.id
          );
          let nsIndex = this.noSupportDiagnosisList.findIndex(
            (noSupportDiagnosis) =>
              item.case_diagnose_id == noSupportDiagnosis.id
          );
          if (sIndex >= 0) {
            let cpItem = Object.create(this.supportDiagnosisList[sIndex]);
            cpItem.check = true;
            cpItem.weight = item.weight;
            this.supportDiagnosisList.splice(sIndex, 1, cpItem);
          }
          if (sIndex >= 0 && nsIndex >= 0) {
            let cpItem = Object.create(this.noSupportDiagnosisList[nsIndex]);
            cpItem.disabled = true;
            cpItem.weight = item.weight;
            this.noSupportDiagnosisList.splice(nsIndex, 1, cpItem);
          }
        }
        if (item.basis_type === "NonSupportingBasis") {
          let sIndex = this.supportDiagnosisList.findIndex(
            (supportDiagnosis) => item.case_diagnose_id == supportDiagnosis.id
          );
          let nsIndex = this.noSupportDiagnosisList.findIndex(
            (noSupportDiagnosis) =>
              item.case_diagnose_id == noSupportDiagnosis.id
          );
          if (sIndex >= 0) {
            let cpItem = Object.create(this.supportDiagnosisList[sIndex]);
            cpItem.disabled = true;
            cpItem.weight = item.weight;
            this.supportDiagnosisList.splice(sIndex, 1, cpItem);
          }
          if (sIndex >= 0 && nsIndex >= 0) {
            let cpItem = Object.create(this.noSupportDiagnosisList[nsIndex]);
            cpItem.check = true;
            cpItem.weight = item.weight;
            this.noSupportDiagnosisList.splice(nsIndex, 1, cpItem);
          }
        }
      });
    },
  },
  watch: {
    diagnosisList: {
      handler: function (newVal, oldVal) {
        if (newVal) {
          this._formateDefaultDiagnosisList(newVal);
        }
      },
      immediate: true,
    },
  },
};
</script>

<style lang="less" scoped>
.diagnosisSelWrapper {
  // padding: 10px 30px;
  .diagnosisSelTitle {
    display: flex;
    align-items: center;
    color: #474c63;
    font-size: 14px;
    font-weight: bold;
    .img {
      margin-right: 10px;
      width: 15px;
      height: 15px;
    }
  }
  .diagnosisSelList {
  }
}
</style>