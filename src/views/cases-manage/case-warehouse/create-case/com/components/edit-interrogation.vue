<template>
  <div class="editInterrogationWrapper">
    <div v-if="step === 1">
      <div class="title">添加问诊</div>
      <div class="content">
        <div class="selectForm">
          <div class="itemLine">
            <span class="itemType">类型</span>
            <Select
              :disabled="isCheck"
              @on-change="changeInterrogationType"
              v-model="interrogationType"
              class="itemSel"
            >
              <Option
                v-for="(item, i) in selectTypeList"
                :value="item.talk_group"
                :key="i"
                >{{ item.talk_group }}</Option
              >
            </Select>
          </div>
          <div class="itemLine">
            <span class="itemType">提问</span>
            <Select
              :disabled="isCheck"
              @on-change="changeInterrogationQuestion"
              v-model="interrogationQuestion"
              filterable
              clearable
              class="itemSel"
            >
              <Option
                v-for="(item, i) in selectQuestionList"
                :value="item.question"
                :key="i"
                >{{ item.question }}</Option
              >
            </Select>
          </div>
          <div class="itemLine">
            <span class="itemType">回答</span>
            <Input
              :disabled="isCheck"
              v-model="interrogationAnswer"
              placeholder="请输入回答"
              class="itemSel"
            />
          </div>
        </div>
        <div v-if="diagnosisType == 1">
          <identify-element
            ref="identifyElement"
            :identifyInfo="interrogationItemData"
          />
          <diagnosis-basis
            ref="diagnosisBasis"
            :diagnosisInfo="interrogationItemData"
            :diagnosisList="dedaultDiagnosisList"
            :addedDiagnosisList="addedDiagnosisList"
          />
          <!-- <div
            class="identifyElementLine"
            v-if="identifyList && identifyList.length > 0"
          >
            <span>关联鉴别要素</span
            ><Cascader
              style="width: 280px"
              :data="identifyList"
              v-model="identify_element_code_sel"
            ></Cascader>
          </div> -->
          <!-- <div class="diagnosisSelWrapper">
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
          </div> -->
        </div>
        <!-- 干扰项/减分项 -->
        <div class="radioLine" v-if="diagnosisType == 2">
          <span style="margin-right: 20px">设为</span>
          <RadioGroup v-model="item_type">
            <!-- <Radio :disabled="isCheck" :label="1">{{type == 4 ? '得分项' : '诊断依据'}}</Radio> -->
            <Radio :disabled="isCheck" :label="2">干扰项</Radio>
            <Radio :disabled="isCheck" :label="3">扣分项</Radio>
          </RadioGroup>
        </div>
        <div v-if="item_type == 3">
            <div class="deductionLine deductionLineCenter">
              <span>扣分权重</span
              ><Rate
                :disabled="isCheck"
                v-model="deduct_weight"
                style="width: 140px"
              />
            </div>
            <div class="deductionLine">
              <span>扣分理由</span>
              <Input
                :disabled="isCheck"
                v-model="deduct_reason"
                :rows="4"
                type="textarea"
                style="width: 340px"
                placeholder="请输入回答"
              />
            </div>
          </div>
      </div>
      <div v-if="!isCheck" class="case-btn-box">
        <Button class="case-btn-last" @click="clear('clearBtn')" type="primary"
          >清空</Button
        >
        <Button class="case-btn" @click="determine()" type="primary"
          >确定</Button
        >
      </div>
    </div>
    <div v-else class="defaultContent">
      <img :src="assets.caseNO" class="case-no2" />
      <div class="case-no-text">请从左侧选择“添加”</div>
    </div>
  </div>
</template>

<script>
// 静态资源
import correct from "../../../../../../assets/case/correct2.png";
import error from "../../../../../../assets/case/error2.png";
import caseNO from "../../../../../../assets/case/case-no.png";
// 配置项
const defaultStep = 0; // 默认步骤数
const initStep = 1; // 初始化步骤数
// 组件
import diagnosisType from "./diagnosis-type";
import identifyElement from "./identify-element";
import diagnosisBasis from "./diagnosis-basis";
// 工具函数
import postData from "src/api/postData";
export default {
  // 添加/编辑 问诊
  name: "editInterrogation",
  props: {
    isCheck: {
      type: Boolean,
      default: false,
    },
    // 1 为得分项 2 扣分项/干扰项（对应外侧的tab类型）
    diagnosisType: {
      type: Number,
      default: 1,
    },
    // 当前选中组
    group: {
      type: Object,
      default: function () {
        return {};
      },
    },
    // 编辑的数据
    interrogationItemData: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  inject: ["basisData"],
  components: {
    diagnosisType,
    identifyElement,
    diagnosisBasis,
  },
  data() {
    return {
      assets: {
        correct,
        error,
        caseNO,
      },
      step: defaultStep, // 当前操作步骤
      isAdd: true, // 默认执行添加操作
      item_type: 1, // 1 得分项 2 干扰项 3 扣分项
      selectTypeList: [], // 问诊类型列表
      selectQuestionList: [], // 问诊问题列表
      interrogationType: "", // 当前问诊类型
      interrogationQuestion: "", // 当前问诊问题
      interrogationAnswer: "", // 当前问诊答案
      interrogationDeductWeight:0,//扣分权重
      interrogationDeductReason:"",//扣分理由
      identify_element_code_sel: [], // 当前已经选择的关联鉴别要素
      supportDiagnosisList: [], // 支持诊断列表
      noSupportDiagnosisList: [], // 排除诊断列表
      dedaultDiagnosisList: JSON.parse(JSON.stringify(this.basisData)), // 默认的诊断列表
      addedDiagnosisList: [], // 已添加的依据列表
    };
  },
  mounted() {
    this.case_id = +this.$route.query.id;
    this.init();
  },
  methods: {
    init() {
      this.getInterrogationTypes();
      this.getInterrogationQuestions();
      this.clear();
      this.step = initStep;
    },
    // 获取添加问诊的类型
    getInterrogationTypes() {
      let case_id = this.case_id;
      let frequency_id = sessionStorage.getItem("FrequencyId");
      let params = {
        case_id,
        frequency_id,
      };
      postData("case/getTalkTree", params).then((res) => {
        if (res.res_code === 1) {
          this.selectTypeList = res.data || [];
        }
      });
    },
    // 通过关键字获取问诊问题
    getInterrogationQuestions() {
      let case_id = this.case_id;
      let frequency_id = sessionStorage.getItem("FrequencyId");
      let keyword = "";
      // let talk_group =
      let params = {
        case_id,
        frequency_id,
      };
      postData("case/getTalksByKeyword", params).then((res) => {
        if (res.res_code === 1) {
          this.selectQuestionList = res.data || [];
        }
      });
    },
    changeInterrogationType() {},
    changeInterrogationQuestion() {},
    // changeSupportDiagnosisState(val) {
    //   let { index, check, weight, id } = val;
    //   // 如果支持诊断已经选择，排除诊断就不可以选择
    //   let noSupportIndex = this._findIndex(this.noSupportDiagnosisList, id);
    //   let cpSupportItem = Object.create(this.supportDiagnosisList[index]);

    //   if (noSupportIndex >= 0) {
    //     let cpNoSupportItem = Object.create(this.noSupportDiagnosisList[noSupportIndex]);
    //     cpNoSupportItem.disabled = check;
    //     this.noSupportDiagnosisList.splice(noSupportIndex,1,cpNoSupportItem)
    //   }

    //   cpSupportItem.check = check;
    //   cpSupportItem.weight = weight;
    //   this.supportDiagnosisList.splice(index,1,cpSupportItem)
    // },
    // changeNoSupportDiagnosisState(val) {
    //   let { index, check, weight, id } = val;
    //   // 如果除诊诊断已经选择，支持诊断就不可以选择
    //   let supportIndex = this._findIndex(this.supportDiagnosisList, id);
    //   let cpNoSupportItem = Object.create(this.noSupportDiagnosisList[index]);
    //   console.log(index,supportIndex)
    //   if (supportIndex >= 0) {
    //     let cpSupportItem = Object.create(this.supportDiagnosisList[supportIndex])
    //     cpSupportItem.disabled = check;
    //     this.supportDiagnosisList.splice(supportIndex,1,cpSupportItem)
    //   }

    //   cpNoSupportItem.check = check;
    //   cpNoSupportItem.weight = weight;
    //   this.noSupportDiagnosisList.splice(index,1,cpNoSupportItem)
    // },

    // 清空
    clear(from) {
      this.isAdd = true;
      this.item_type = 1;
      this.interrogationType = "";
      this.interrogationQuestion = "";
      this.interrogationAnswer = "";
      this.interrogationDeductWeight = 0;
      this.interrogationDeductReason = ""
      // 清空关联鉴别要素
      let identifyElement = this.$refs.identifyElement;
      if (identifyElement) {
        identifyElement.identify_element_code_sel = [];
      }
      if(from == 'clearBtn'){
        this.step = defaultStep;
      }
      // 清空已经添加的要素依据
      setTimeout(() => {
        if (this.$refs.diagnosisBasis) {
          this.addedDiagnosisList = [];
          this.$refs.diagnosisBasis._formate();
          this.step = defaultStep;
        }
        
      });
      // this._formateDefaultDiagnosisList(this.dedaultDiagnosisList);
    },
    // 确定添加问诊
    determine() {
      let talk_group = this.interrogationType;
      let question = this.interrogationQuestion;
      let answer = this.interrogationAnswer;
      let case_id = this.case_id;
      let item_type = this.item_type;
      let element_id = this.group.id;
      let frequency_id = sessionStorage.getItem("FrequencyId");
      let identify_element_code = 0;
      let case_diagnoses = [];
      let question_index = this.interrogationItemData.question_index;
      let talk_id = this.interrogationItemData.id;
      let deduct_reason = this.interrogationDeductReason; // ?
      let deduct_weight = this.interrogationDeductWeight; // ?

      let identify_element_code_sel = [];
      // 整理组id,当加分项时，传的时id，干扰/扣分传的时组名字（奇怪的很）
      if (item_type != 1) {
        element_id = this.group.talk_group;
      }
      // 当为得分项时添加依据
      if (item_type == 1) {
        // 判断依据整理
        let _supportDiagnosisList = this.$refs.diagnosisBasis.supportDiagnosisList.filter(
          (item) => item.check === true
        );
        let _noSupportDiagnosisList = this.$refs.diagnosisBasis.noSupportDiagnosisList.filter(
          (item) => item.check === true
        );

        _supportDiagnosisList.forEach((item) => {
          case_diagnoses.push({
            case_diagnose_id: item.id,
            basis_type: "SupportingBasis",
            weight: item.weight,
          });
        });
        _noSupportDiagnosisList.forEach((item) => {
          case_diagnoses.push({
            case_diagnose_id: item.id,
            basis_type: "NonSupportingBasis",
            weight: item.weight,
          });
        });
      }

      // 如果存在鉴别要素 鉴别要素id
      if (this.$refs.identifyElement) {
        identify_element_code_sel = this.$refs.identifyElement
          .identify_element_code_sel;
        if (identify_element_code_sel.length > 0) {
          identify_element_code = Number(
            identify_element_code_sel[identify_element_code_sel.length - 1]
          );
        }
      }

      let params = {
        answer,
        case_diagnoses,
        case_id,
        deduct_reason,
        deduct_weight,
        element_id,
        frequency_id,
        identify_element_code,
        item_type,
        question,
        talk_group,
        question_index,
      };
      // 编辑修改多传的参数
      if (!this.isAdd) {
        params.question_index = question_index;
        params.talk_id = talk_id;
        console.log(params);
      }
      PostData("case/operateTalkBasis", params).then((res) => {
        if (res.res_code === 1) {
          this.step = defaultStep;
          this.$emit("refreshData", {
            num: 1,
            diagnosisType: this.diagnosisType,
            groupId: this.group.id,
          });
          this.clear();
        }
      });
    },
    // 被编辑的项赋初始值
    initEditItemData() {
      this.step = initStep;
      this.isAdd = false;
      this.item_type = this.interrogationItemData.item_type || 1;
      this.interrogationAnswer = this.interrogationItemData.answer;
      this.interrogationQuestion = this.interrogationItemData.question;
      this.interrogationDeductWeight = this.interrogationItemData.deduct_weight;
      this.interrogationDeductReason = this.interrogationItemData.deduct_reason
      // 当编辑得分项时，interrogationType 赋值
      if (this.diagnosisType == 1) {
        this.interrogationType = this.interrogationItemData.talk_group;
        this.getCurrentItemTalkDiagnose();
      } else {
        let groupArr = this.selectTypeList.filter(
          (item) => item.id === this.group.id
        );
        if (groupArr.length > 0) {
          console.log(groupArr[0].talk_group);
          this.interrogationType = groupArr[0].talk_group;
        }
      }

      // this.findIdentifyElementCodeShow(this.interrogationItemData);
      // setTimeout(() => {
      //   if (this.$refs.diagnosisBasis) {
      //     this.$refs.diagnosisBasis.getCurrentItemDiagnosisAdd();
      //   }
      // });

      

      // this.$refs.diagnosisBasis.getCurrentItemDiagnosisAdd()
      // this.getCurrentItemDiagnosisAdd();
    },
    // 查找当前已经添加的问诊要素依据
    getCurrentItemTalkDiagnose() {
      let case_id = this.case_id;
      let frequency_id = sessionStorage.getItem("FrequencyId");
      let question_index = this.interrogationItemData.question_index;

      let params = {
        case_id,
        frequency_id,
        question_index,
      };
      PostData("case/getTalkDiagnose", params).then((res) => {
        if (res.res_code === 1) {
          this.addedDiagnosisList = res.data;
          setTimeout(() => {
            if(this.$refs.diagnosisBasis){
              this.$refs.diagnosisBasis._formate();
            }
          });
          // this._formateDefaultDiagnosisList(this.diagnosisList);
          // this._formateDiagnosisAddState(res.data);
        }
      });
    },
    // 反向查询关联要素
    // findIdentifyElementCodeShow(t) {
    //   if (t.identify_element_code) {
    //     this.identify_element_code = t.identify_element_code;
    //   }
    //   this.identifyList.forEach((Identify) => {
    //     if (!Identify.children) {
    //       if (Identify.value == this.identify_element_code) {
    //         this.identify_element_code_sel = [
    //           Number(this.identify_element_code),
    //           +"",
    //         ];
    //       }
    //     }
    //     if (Identify.children && Identify.children.length > 0) {
    //       Identify.children.forEach((child) => {
    //         if (child.value == this.identify_element_code) {
    //           this.identify_element_code_sel = [
    //             Number(Identify.value),
    //             Number(this.identify_element_code),
    //           ];
    //         }
    //       });
    //     }
    //   });
    // },
    // 查询当前项的已添加的诊断
    // getCurrentItemDiagnosisAdd() {
    //   let case_id = this.case_id;
    //   let frequency_id = sessionStorage.getItem("FrequencyId");
    //   let question_index = this.interrogationItemData.question_index;

    //   let params = {
    //     case_id,
    //     frequency_id,
    //     question_index,
    //   };
    //   PostData("case/getTalkDiagnose", params).then((res) => {
    //     if (res.res_code === 1) {
    //       // this._formateDefaultDiagnosisList(this.dedaultDiagnosisList);
    //       this._formateDiagnosisAddState(res.data);
    //     }
    //   });
    // },
    // 工具，整理当前项的已添加的诊断状态
    // _formateDiagnosisAddState(arr = []) {
    //   arr.forEach((item) => {
    //     // 支持
    //     if (item.basis_type === "SupportingBasis") {
    //       let sIndex = this.supportDiagnosisList.findIndex(
    //         (supportDiagnosis) => item.case_diagnose_id == supportDiagnosis.id
    //       );
    //       let nsIndex = this.noSupportDiagnosisList.findIndex(
    //         (noSupportDiagnosis) =>
    //           item.case_diagnose_id == noSupportDiagnosis.id
    //       );
    //       if (sIndex >= 0) {
    //         let cpItem = Object.create(this.supportDiagnosisList[sIndex]);
    //         cpItem.check = true;
    //         this.supportDiagnosisList.splice(sIndex, 1, cpItem);
    //       }
    //       if (sIndex >= 0 && nsIndex >= 0) {
    //         let cpItem = Object.create(this.noSupportDiagnosisList[nsIndex]);
    //         cpItem.disabled = true;
    //         this.noSupportDiagnosisList.splice(nsIndex, 1, cpItem);
    //       }
    //     }
    //     if (item.basis_type === "NonSupportingBasis") {
    //       let sIndex = this.supportDiagnosisList.findIndex(
    //         (supportDiagnosis) => item.case_diagnose_id == supportDiagnosis.id
    //       );
    //       let nsIndex = this.noSupportDiagnosisList.findIndex(
    //         (noSupportDiagnosis) =>
    //           item.case_diagnose_id == noSupportDiagnosis.id
    //       );
    //       if (sIndex >= 0) {
    //         let cpItem = Object.create(this.supportDiagnosisList[sIndex]);
    //         cpItem.disabled = true;
    //         this.supportDiagnosisList.splice(sIndex, 1, cpItem);
    //       }
    //       if (sIndex >= 0 && nsIndex >= 0) {
    //         let cpItem = Object.create(this.noSupportDiagnosisList[nsIndex]);
    //         cpItem.check = true;
    //         this.noSupportDiagnosisList.splice(nsIndex, 1, cpItem);
    //       }
    //     }
    //   });
    // },
    // 工具，寻找id对应的索引
    // _findIndex(arr = [], id = 0) {
    //   return arr.findIndex((item) => item.id === id);
    // },
    // 工具，整理默认支持项和排除项
    // _formateDefaultDiagnosisList(newVal) {
    //   this.supportDiagnosisList = JSON.parse(JSON.stringify(newVal));
    //   this.noSupportDiagnosisList = JSON.parse(
    //     JSON.stringify(
    //       newVal.filter((item) => item.type === "DifferentialDiagnosis")
    //     )
    //   );
    //   this.supportDiagnosisList.forEach((item) => {
    //     item.check = false;
    //     item.disabled = false;
    //   });
    //   this.noSupportDiagnosisList.forEach((item) => {
    //     item.check = false;
    //     item.disabled = false;
    //   });
    // },
  },
  // computed: {
  //   // 将鉴别要素数据转化成二级级联
  //   /**
  //            * [{
  //                   value: 'beijing',
  //                   label: '北京',
  //                   children: []
  //               }]
  //            */
  //   identifyList() {
  //     let identifyList = sessionStorage.getItem("IdentifyElement")
  //       ? JSON.parse(sessionStorage.getItem("IdentifyElement"))
  //       : [];
  //     let result = [];
  //     let obj = {};
  //     identifyList.forEach((identify) => {
  //       let pid = Number(identify.parent_node_id);
  //       if (obj[pid]) {
  //         obj[pid].children.push({
  //           value: Number(identify.code),
  //           label: identify.element_name,
  //           parent_node_id: Number(identify.parent_node_id),
  //         });
  //       } else {
  //         obj[pid] = {};
  //         obj[pid].parent_node_id = Number(identify.parent_node_id);
  //         obj[pid].parent_node_name = identify.parent_node_name;
  //         obj[pid].code = Number(identify.code);
  //         obj[pid].children = [
  //           {
  //             value: Number(identify.code),
  //             label: identify.element_name,
  //             parent_node_id: Number(identify.parent_node_id),
  //           },
  //         ];
  //       }
  //     });
  //     for (const key in obj) {
  //       if (obj.hasOwnProperty(key)) {
  //         const element = obj[key];
  //         if (element.children.length == 1) {
  //           result.push({
  //             value: Number(element.code),
  //             label: element.parent_node_name,
  //           });
  //         } else {
  //           result.push({
  //             value: Number(element.parent_node_id),
  //             label: element.parent_node_name,
  //             children: element.children,
  //           });
  //         }
  //       }
  //     }
  //     return result;
  //   },
  // },
  // watch: {
  // dedaultDiagnosisList: {
  //   handler: function (newVal, oldVal) {
  //     if (newVal) {
  //       this._formateDefaultDiagnosisList(newVal);
  //     }
  //   },
  //   immediate: true,
  // },
  // interrogationItemData:{
  //   handler: function (newVal, oldVal) {
  //     if (newVal) {
  //       this.step = initStep
  //       this.interrogationAnswer = newVal.answer
  //       this.interrogationQuestion = newVal.question
  //       this.interrogationType = newVal.talk_group
  //     }
  //   },
  //   immediate:true
  // }
  // },
};
</script>

<style lang="less" scoped>
.editInterrogationWrapper {
  .defaultContent {
    .case-no2 {
      width: 232px;
      height: 174px;
      margin-top: 60px;
    }
    .case-no-text {
      margin-top: 10px;
      font-size: 14px;
      color: #9397ad;
    }
  }
  .title {
    font-size: 16px;
    color: #474c63;
    height: 49px;
    width: inherit;
    line-height: 49px;
    text-align: center;
    border-bottom: 1px solid #f0f0f7;
  }
  .content {
    height: 550px;
    overflow-y: scroll;
    padding: 0 20px;
    .selectForm {
      border-bottom: 1px dashed #999;
      .itemLine {
        display: flex;
        align-items: center;
        margin: 10px 0;
        .itemType {
          width: 50px;
          text-align: left;
        }
        .itemSel {
          width: 350px;
        }
      }
    }
    .identifyElementLine {
      display: flex;
      align-items: center;
      justify-content: space-between;
      // padding: 0px 30px;
      margin: 10px 0;
    }
    /deep/.ivu-select-item {
      width: 300px;
    }
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
    .radioLine {
      display: flex;
      align-items: center;
      // padding: 0px 30px;
      margin: 10px 0;
    }
    .deductionLine{
      display: flex;
      span{
        width: 70px;
        text-align: left;
        margin-right: 20px;
      }
    }
    .deductionLineCenter{
      align-items: center;
    }
  }
  .case-btn-box {
    display: flex;
    justify-content: center;
    .case-btn-last {
      width: 120px;
      height: 36px;
      background-color: #fff;
      color: #4098ff;
    }
    .case-btn {
      width: 120px;
      height: 36px;
      margin-left: 20px;
    }
  }
}
</style>