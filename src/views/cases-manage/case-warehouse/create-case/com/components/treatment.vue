<template>
  <div class="bodyCheckWrapper main">
    <Modal
      v-if="!isCheck"
      v-model="setTreatMthodFlag"
      footer-hide
      title="处置方式"
    >
      <div class="m-btns">
        <Button class="btns" @click="selTypes('AmbulatoryTreatment')"
          >作为门诊患者治疗</Button
        >
        <Button class="btns btns2" @click="selTypes('HospitalizedTreatment')"
          >收患者入院治疗</Button
        >
      </div>
    </Modal>
    <!-- tab -->
    <div class="tabs-view tabs-content">
      <Tabs
        v-model="activeTab"
        @on-click="tabs"
        type="line"
        size="small"
        class="tabs"
      >
        <TabPane :label="setLabel" :name="tabLabels[0].name">
          <div @click="setTreatMthodFlag = true" class="patient-disposition">
            <Icon type="ios-settings" :size="20" /> {{ patient_disposition | dispositionTranslate  }}
          </div>
          <div class="tabInnerContent">
            <diagnosis-group
              v-for="(item, index) in interrogationPointsList"
              :key="'interrogationPointsList' + index"
              :ref="'interrogationPointsList' + index"
              :diagnosisGroupItem="item"
              :groupIndex="index"
              :unfold="currentSelGroupIndex === index ? true : false"
              :groupType="'treat'"
              :tabName="tabLabels[0].name"
              :isCheck="isCheck"
              @addAiagnosisGroupItem="addCurrentAiagnosisGroupItem"
              @changeGroupIndex="changeGroupSelIndex"
              @editItem="changeCurrentEditItem"
              @refreshData="refreshCurrentGroupList"
            />
          </div>
        </TabPane>
        <TabPane :label="tabLabels[1].label" :name="tabLabels[1].name">
          <div @click="setTreatMthodFlag = true" class="patient-disposition">
            <Icon type="ios-settings" :size="20" /> {{ patient_disposition | dispositionTranslate}}
          </div>
          <div class="tabInnerContent">
            <diagnosis-group
              v-for="(item, index) in interrogationPenaltiesList"
              :key="'interrogationPenaltiesList' + index"
              :ref="'interrogationPenaltiesList' + index"
              :diagnosisGroupItem="item"
              :groupIndex="index"
              :unfold="currentSelGroupIndex === index ? true : false"
              :groupType="'treat'"
              :tabName="tabLabels[1].name"
              :isCheck="isCheck"
              @addAiagnosisGroupItem="addCurrentAiagnosisGroupItem"
              @changeGroupIndex="changeGroupSelIndex"
              @editItem="changeCurrentEditItem"
              @refreshData="refreshCurrentGroupList"
            />
          </div>
        </TabPane>
        <TabPane :label="tabLabels[2].label" :name="tabLabels[2].name">
          <analysis />
        </TabPane>
      </Tabs>
    </div>
    <div class="content let-content">
      <edit-treatment
        ref="refEditTreatment"
        :diagnosisType="Number(activeTab)"
        :group="currentSelGroup"
        :treatmentItemData="currentSelItemData"
        :isCheck="isCheck"
        :case_treatment_id="case_treatment_id"
        @refreshData="refreshCurrentGroupList"
      />
    </div>
  </div>
</template>

<script>
import caseSee from "../../../../../../assets/img/case/case-see.png";
import caseSeeGrey from "../../../../../../assets/img/case/case-see-grey.png";
const defineTabLabels = [
  { name: "1", label: "得分项" },
  { name: "2", label: "干扰项/扣分项" },
  { name: "3", label: "诊疗处置" },
];
const dataType = "treat"; // 获取相关信息的类型
// 组件
import diagnosisGroup from "./diagnosis-group";
import editTreatment from "./edit-treatment";
import analysis from "./analysis";
// 工具函数
import postData from "src/api/postData";
export default {
  // 辅检
  name: "treatment",
  props: {
    isCheck: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    diagnosisGroup,
    editTreatment,
    analysis,
  },
  data() {
    return {
      tabLabels: defineTabLabels,
      actImg: caseSee,
      activeTab: defineTabLabels[0].name,
      interrogationPointsList: [], // 问诊得分项
      interrogationPenaltiesList: [], //问诊干扰项/扣分项
      currentSelGroupIndex: -1, // 默认选中的组（得分项和扣分项通用）
      currentSelGroup: {}, // 默认选中的组（得分项和扣分项通用）
      currentSelItemData: {}, // 编辑组内项的数据（得分项和扣分项通用）
      diagnosisId: sessionStorage.getItem("FrequencyId"),
      case_treatment_id:0, // 诊疗id
      setTreatMthodFlag: false, // 是否添加过处置方式
      patient_disposition:"", // 诊疗方式
    };
  },
  created() {
    this.case_id = +this.$route.query.id;
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getInterrogationPointsList();
      this.getPatientTreatMethod();
    },
    selTypes(name) {
      let d = {
        id: (this.case && this.case.id) || null,
        case_id:this.case_id,
        patient_disposition: name,
        frequency_id: this.diagnosisId,
      };
      PostData("case/setTreatMethod", d).then((r) => {
        if (r && r.res_code == 1) {
          this.setTreatMthodFlag = false;
          this.patient_disposition = name;
        }
      });
    },
    // 查询是否定义过患者治疗方式（门诊/住院）
    getPatientTreatMethod() {
      let case_id = this.case_id;
      let frequency_id = sessionStorage.getItem("FrequencyId");

      let params = {
        case_id,
        frequency_id,
      };
      postData("case/getTreatDisposition", params).then((res) => {
        if (!res) {
          this.setTreatMthodFlag = true;
        } else if (res && res.data) {
          this.case = res.data
          this.case_treatment_id = res.data.id;
          this.patient_disposition = res.data.patient_disposition
        }
      });
    },
    setLabel(h, params) {
      return h(
        "div",
        {
          on: {
            mouseenter: () => {
              this.actImg = caseSee;
            },
            mouseleave: () => {
              console.log("mouseleave", this.activeTab, typeof this.activeTab);
              this.actImg =
                this.activeTab === this.tabLabels[0].name
                  ? caseSee
                  : caseSeeGrey;
            },
          },
          style: {
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        },
        [
          h("span", "得分项", { style: { "letter-spacing": "1.5px" } }),
          h("img", {
            attrs: {
              src: this.actImg,
            },
            style: {
              width: "15px",
              height: "15px",
              marginLeft: "10px",
            },
            on: {
              click: () => {
                // this.outlineModal = true;
                // this.setOutlinesData();
              },
            },
          }),
        ]
      );
    },
    tabs(name) {
      this.actImg = name === this.tabLabels[0].name ? caseSee : caseSeeGrey;
      this.currentSelGroupIndex = -1; // 切换tab收起全部展开
      if (name === "1") {
        this.getInterrogationPointsList();
      }
      if (name === "2") {
        this.getInterrogationPenaltiesList();
      }
    },
    // 获取得分项列表
    getInterrogationPointsList() {
      let frequency_id = sessionStorage.getItem("FrequencyId");
      let params = {
        case_id: this.case_id,
        frequency_id,
        type: dataType,
      };
      postData("case/getElements", params).then((res) => {
        if (res.res_code === 1) {
          this.interrogationPointsList = res.data;
        }
      });
    },
    // 获取扣分项列表
    getInterrogationPenaltiesList() {
      let frequency_id = sessionStorage.getItem("FrequencyId");
      let params = {
        case_id: this.case_id,
        frequency_id,
        type: dataType,
      };
      postData("case/getTreatDetailList", params).then((res) => {
        if (res.res_code === 1) {
          this.interrogationPenaltiesList = res.data;
        }
      });
    },
    // 切换当前组
    changeGroupSelIndex(data) {
      this.currentSelGroupIndex = data.groupIndex;
      this.currentSelGroup = data.group;
    },
    // 给当前组添加项
    addCurrentAiagnosisGroupItem(groupData) {
      let treatmentTypeSel = [];
      switch (groupData.type) {
        case "operation":
          treatmentTypeSel = [1];
          break;
        case "medicine":
          treatmentTypeSel = [2, 6];
          break;
        case "treat":
          treatmentTypeSel = [3];
          break;
        case "other":
          treatmentTypeSel = [4];
          break;
        default:
          break;
      }
      this.$refs.refEditTreatment.setStep(1);
      this.$refs.refEditTreatment.treatmentTypeSel = treatmentTypeSel;
      this.$refs.refEditTreatment.item_type = 2;
      this.$refs.refEditTreatment.changeTreatmentType(treatmentTypeSel);
    },
    // 传递当前项的数据到编辑页面
    changeCurrentEditItem(val) {
      this.currentSelItemData = val;
      this.$nextTick(() => {
        this.$refs.refEditTreatment.initEditItemData();
      });
    },
    // 更新组列表数据
    // type 1 得分项 2 干扰项/扣分
    refreshCurrentGroupList(val) {
      let id = val.groupId;
      let type = val.diagnosisType;
      let num = val.num;
      if (type === 1) {
        this.interrogationPointsList.forEach((item, index) => {
          if (item.id === id) {
            item.count += num;
            this.$refs["interrogationPointsList" + index][0].getData();
          }
        });
      } else if (type === 2) {
        this.interrogationPenaltiesList.forEach((item, index) => {
          if (item.id === id) {
            this.$refs["interrogationPenaltiesList" + index][0].getData();
            item.count += num;
          }
        });
      }
      this.$refs.refEditTreatment.clear("clearBtn");
    },
  },
  filters:{
    dispositionTranslate:function(val){
      if(val == 'AmbulatoryTreatment'){
        return "作为门诊患者治疗"
      }
      else if(val == 'HospitalizedTreatment'){
        return "收患者入院治疗"
      }
      return ""
    }
  }
};
</script>

<style lang="less" scoped>
@import "./details.less";
/deep/ .ivu-tabs-nav-container:focus .ivu-tabs-tab-focused {
  border-color: #f0f0f7 !important;
}
/deep/ .ivu-tabs-tabpane {
  height: 597px;
}
.m-btns {
  height: 200px;
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
  .btns2 {
    margin-left: 15px;
  }
}
.patient-disposition {
  height: 40px;
  background-color: #f9cd46;
  text-align: left;
  line-height: 40px;
  padding-left: 20px;
  &:hover {
    color: #4098ff;
  }
}
.tabs-content {
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  .tabs {
    width: 100%;
    /deep/ .ivu-tabs-nav {
      width: 100%;
      margin: 0 !important;
      /deep/ .ivu-tabs-ink-bar {
        margin: 0 !important;
        height: 2px !important;
        width: 100%/3 !important;
      }
      /deep/ .ivu-tabs-tab {
        height: 49px !important;
        width: 100%/3 !important;
        font-family: PingFangSC-Medium;
        font-size: 18px;
        margin: 0 0 2px 0 !important;
        padding: 0 !important;
        border: 1px solid #f0f0f7 !important;
      }
    }
  }
}
.let-content {
  background: rgba(240, 240, 247, 0.3);
  border-radius: 3px;
}
</style>