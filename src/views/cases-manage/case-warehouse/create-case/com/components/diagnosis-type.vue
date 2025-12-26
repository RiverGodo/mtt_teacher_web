<template>
  <div class="diagnosisTypeWrapper">
    <Checkbox
      @on-change="checkbox"
      :disabled="disables"
      class="checkbox"
      v-model="main"
    >
      <span class="checkbox-title">{{info.type | typeTranslate}}{{ info.name }}</span>
    </Checkbox>
    <div class="main-degree" v-if="info.check">
      <span class="grey-regular4">重要程度</span>
      <Rate v-model="mainDegree" @on-change="setSel" style="min-width: 140px" /> 
    </div>
  </div>
</template>

<script>
// 配置项
const diagnosisTypeMap = {
  PrincipalDiagnosis: "主要",
  SecondaryDiagnosis: "次要",
  DifferentialDiagnosis: "鉴别",
};
export default {
  // 诊断类型
  name: "diagnosisType",
  props: {
    info: {
      type: Object,
      default: function () {
        return {};
      },
    },
    diagnosisIndex: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      default: "",
    },
    check: {
      type: Boolean,
      default: false,
    },
    disables: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      main: this.check,
      mainDegree: this.info.weight,
    };
  },
  mounted() {},
  methods: {
    checkbox(val) {
      this.emitData(val)
    },
    setSel() {
      this.emitData()
    },
    emitData(val){
      let data = {
          index: this.diagnosisIndex,
          check: val === undefined ? true:val,
          weight: this.mainDegree,
          id: this.info.id,
        }
      if (this.type === "support") {
        this.$emit("changeSupportDiagnosisState", data);
      }
      if (this.type === "noSupport") {
        this.$emit("changeNoSupportDiagnosisState", data);
      }
    }
  },
  filters:{
    typeTranslate:function(val){
      if(diagnosisTypeMap[val]){
        return diagnosisTypeMap[val]+"-"
      }
      return ""
    }
  },
  watch: {
    info: {
      handler: function (newVal) {
        this.main = newVal.check;
        this.mainDegree = newVal.weight;
      },
      deep: true,
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .ivu-checkbox {
  margin-top: 4px !important;
}
.diagnosisTypeWrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  min-height: 34px;
  margin-bottom: 15px;
  .checkbox {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    flex: 1;
    text-align: left;
    .checkbox-title {
      margin-left: 5px;
      display: inline-block;
    }
  }
  .main-degree {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 200px;
    .sel-degree {
      margin-left: 10px;
      width: 120px;
      height: 34px;
    }
  }
}
.grey-regular4 {
  min-width: 90px;
}
</style>