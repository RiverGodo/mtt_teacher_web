<template>
  <div class="analysis-content">
    <div class="title">处置原则</div>
    <Input
      :disabled="isCheck"
      v-model="treatment_principle"
      type="textarea"
      :rows="8"
      placeholder="请输入处置原则"
    />
    <div class="title title2">诊疗建议</div>
    <Input
      :disabled="isCheck"
      v-model="suggestion"
      type="textarea"
      :rows="8"
      placeholder="请输入诊疗建议"
    />
    <div v-if="!isCheck" class="m-btns">
      <Button class="btns" @click="add">保存</Button>
    </div>
  </div>
</template>

<script>
// 工具函数
import postData from "src/api/postData";
export default {
  props: {
    isCheck: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      treatment_principle: "",
      suggestion: "",
    };
  },
  mounted() {
    this.case_id = +this.$route.query.id;
    this.getData();
  },
  methods: {
    add() {
      let d = {
        id: this.case.id || null,
        treatment_principle: this.treatment_principle,
        suggestion: this.suggestion,
        frequency_id: sessionStorage.getItem("FrequencyId"),
      };
      PostData("case/setTreatDisposition", d).then((r) => {
        if (r && r.res_code == 1) {
          this.$Message.info(r.msg);
        }
      });
    },
    getData() {
      let params = {
        case_id:this.case_id,
        frequency_id:sessionStorage.getItem("FrequencyId")
      }
      PostData("case/getTreatDisposition", params).then((r) => {
        if (r && r.res_code == 1) {
          if (!r.data) this.modal1 = true;
          this.case = r.data;
          if (r.data) {
            this.treatment_principle = r.data.treatment_principle;
            this.suggestion = r.data.suggestion;
          }
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.analysis-content {
  width: inherit;
  height: inherit;
  padding: 20px 30px;
  .m-btns {
    height: 36px;
    margin-top: 30px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    .btns {
      width: 150px;
      height: 36px;
      background-color: #fff;
      color: #4098ff;
    }
  }
  .title {
    text-align: left;
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: #474c63;
    margin-bottom: 15px;
  }
  .title2 {
    margin-top: 40px;
  }
}
</style>