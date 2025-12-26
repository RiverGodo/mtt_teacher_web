<template>
  <Card>
    <div class="createDiagnosis">
      <!-- 添加诊断 -->
      <div class="createDiagnosisItem addDiagnosis">
        <p class="addDiagnosisTitle">添加诊断</p>
        <div class="caseSeeBar">提纲 <img :src="assets.caseSee" alt="" /></div>
        <!-- 图例 -->
        <div class="diagnosisLegendBar">
          <div
            v-for="(item, index) in diagnosisLegend"
            :key="'diagnosisLegend' + index"
            class="diagnosisLegendItem"
          >
            <span :style="{ background: item.active_color }"></span
            >{{ item.title }}
          </div>
        </div>
        <!-- 供选择的诊断列表 -->
        <div class="diagnosisListWrapper">
          <div
            v-for="(item, illness_index) in illnessForDiagnosisList"
            :key="'illnessForDiagnosisList' + illness_index"
            class="diagnosisListWrapperItem"
            :style="{ background: item.type ? item.bg : '' }"
          >
            <div class="diagnosisListWrapperItemLeft">
              {{ illness_index + 1 }}、{{ item.illness_name }} <span></span>
            </div>
            <div class="diagnosisListWrapperItemRight">
              添加至
              <span
                v-for="(diagnosisLegend_item,
                diagnosisLegend_index) in diagnosisLegend"
                :key="'diagnosisLegend' + diagnosisLegend_index"
                :style="{
                  background:
                    item.type === diagnosisLegend_item.type
                      ? item.color
                      : diagnosisLegend_item.default_color,
                }"
                @click="
                  setCurrentIllnessDiagnosisType(item, diagnosisLegend_item)
                "
                >{{ diagnosisLegend_item.short_title }}</span
              >{{ item.title }}
            </div>
          </div>
        </div>
      </div>
      <!-- 设置诊断 -->
      <div class="createDiagnosisItem setDiagnosis">
        <p class="setDiagnosisTitle">设置诊断</p>
        <!-- 已经设置的诊断列表 -->
        <div class="setDiagnosisWrapper">
          <div
            v-for="(illnessAddedForDiagnosisValue,
            illnessAddedForDiagnosisKey,
            illnessAddedForDiagnosisIndex) in illnessAddedForDiagnosisList"
            :key="
              'illnessAddedForDiagnosisList' + illnessAddedForDiagnosisIndex
            "
          >
            <div
              v-if="
                illnessAddedForDiagnosisValue.diagnosis &&
                illnessAddedForDiagnosisValue.diagnosis.length > 0
              "
              class="setDiagnosisItem"
            >
              <p class="setDiagnosisItemTitle">
                {{ setColorByIllnessType(illnessAddedForDiagnosisKey).title }}
              </p>
              <div class="setDiagnosisIllnessItem">
                <div class="setDiagnosisIllnessItemLine">
                  <span class="setDiagnosisIllnessItemTitle">分值</span>
                  <Input
                    :disabled="isCheck"
                    v-model="illnessAddedForDiagnosisValue.score"
                    placeholder="请输入分值"
                    style="width: 300px"
                  />
                  <Tooltip
                    content="主要诊断、次要诊断、鉴别诊断3项总分为100分"
                    placement="top"
                    :transfer="true"
                    max-width="400"
                  >
                    <img
                      class="diagnose-score-img"
                      :src="assets.explain_img"
                      alt=""
                    />
                  </Tooltip>
                </div>
                <div
                  class="setDiagnosisIllnessItemLine setDiagnosisIllnessItemLineFlex"
                  v-for="(item,
                  index) in illnessAddedForDiagnosisValue.diagnosis"
                  :key="index"
                >
                  <div>
                    <span class="setDiagnosisIllnessItemTitle">诊断</span>
                    <span
                      class="setDiagnosisIllnessItemName"
                      :style="{
                        background: setColorByIllnessType(
                          illnessAddedForDiagnosisKey
                        ).bg,
                        color: setColorByIllnessType(
                          illnessAddedForDiagnosisKey
                        ).color,
                      }"
                      >{{ item.name }}</span
                    >
                  </div>
                  <div>
                    <span class="setDiagnosisIllnessItemTitle">权重等级</span>
                    <Rate
                      :disabled="isCheck"
                      v-model="item.weight"
                      @on-change="setCurrentDiagnoseWeight(item)"
                      style="width: 140px; margin-left: 4px"
                    />
                    <!-- v-if="!isCheck" @click="deletes(t.id, t.icd10_id)" -->
                    <img
                      v-if="!isCheck"
                      @click="deleteCurrentDiagnose(item)"
                      class="diagnose-message-right-img"
                      :src="assets.delete_img"
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
        @click="handleNext()"
        type="primary"
        >下一步</Button
      >
    </div>
  </Card>
</template>

<script>
// 静态资源
import caseSee from "../../../../../assets/img/case/case-see.png";
import explain_img from "../../../../../assets/img/case/explain.png";
import delete_img from "../../../../../assets/img/case/delete.png";
// 初始化值
const PrincipalDiagnosis = "PrincipalDiagnosis";
const legend = [
  {
    title: "主要诊断",
    short_title: "主",
    type: "PrincipalDiagnosis",
    default_color: "#9397AD",
    active_color: "#A876F9",
    active_bg: "#e7d9fd",
    default_bg: "#FAFAFC",
  },
  {
    title: "次要诊断",
    short_title: "次",
    type: "SecondaryDiagnosis",
    default_color: "#9397AD",
    active_color: "#FFA003",
    active_bg: "#ffe5b9",
    default_bg: "#FAFAFC",
  },
  {
    title: "鉴别诊断",
    short_title: "鉴",
    type: "DifferentialDiagnosis",
    default_color: "#9397AD",
    active_color: "#0AC7E6",
    active_bg: "#b9eff8",
    default_bg: "#FAFAFC",
  },
];
// 组件
import postData from "src/api/postData";

export default {
  name: "createDiagnosis",
  props: {
    isCheck: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      assets: {
        caseSee,
        explain_img,
        delete_img,
      },
      diagnosisLegend: legend,
      illnessForDiagnosisList: [],
      illnessAddedForDiagnosisList: [],
    };
  },
  created(){},
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      this.case_id = +sessionStorage.getItem("CASEID");
      await this.getIllnessForDiagnosis(this.case_id);
      await this.getIllnessAdded(this.case_id);
    },
    // 获取当前病例可添加的诊断
    async getIllnessForDiagnosis(case_id) {
      await postData("case/getIllnessByCaseId", { case_id }).then((res) => {
        if (res.res_code === 1) {
          this.illnessForDiagnosisList = res.data;
        }
      });
    },
    // 获取当前病例已经添加的诊断
    async getIllnessAdded(case_id) {
      await postData("case/getDiagnoseByCase", { case_id }).then((res) => {
        if (res.res_code === 1) {
          this.illnessAddedForDiagnosisList = res.data;
          this.setIllnessForDiagnosisType(
            this.illnessForDiagnosisList,
            this.illnessAddedForDiagnosisList
          );
          this.$forceUpdate();
        }
      });
    },
    // 由已添加的诊断设置左侧全部病种的颜色,默认灰色,右侧已添加的病种id赋值给左侧 icds
    setIllnessForDiagnosisType(all = [], added = {}) {
      all.forEach((all_item) => {
        let calc_color = this.setColorByIllnessType("");
        all_item.bg = calc_color.bg;
        all_item.color = calc_color.color;
      });
      // 通过 all 中 id 和 added 中 icd10_id 是否相等
      for (const key in added) {
        if (added.hasOwnProperty(key)) {
          const element = added[key];
          if (element.diagnosis && element.diagnosis.length > 0) {
            element.diagnosis.forEach((diagnosisItem) => {
              let index = all.findIndex(
                (all_item) => all_item.id === diagnosisItem.icd10_id
              );
              if (index == -1) {
                console.log(diagnosisItem);
              }
              if (index >= 0) {
                all[index].type = key;
                let calc_color = this.setColorByIllnessType(key);
                all[index].bg = calc_color.bg;
                all[index].color = calc_color.color;
                all[index].icds = diagnosisItem.id;
              }
            });
          }
        }
      }
    },
    // 根据类型判断当前显示的颜色
    setColorByIllnessType(type) {
      let index = this.diagnosisLegend.findIndex(
        (diagnosisLegend_item) => diagnosisLegend_item.type == type
      );
      if (index >= 0) {
        return {
          color: this.diagnosisLegend[index].active_color,
          bg: this.diagnosisLegend[index].active_bg,
          title: this.diagnosisLegend[index].title,
        };
      } else {
        // 此处默认显示第0个的数据，如需修改，另设默认初始值
        return {
          color: this.diagnosisLegend[0].default_color,
          bg: this.diagnosisLegend[0].default_bg,
          title: this.diagnosisLegend[0].title,
        };
      }
    },
    //设置当前病种的诊断类型（主、次、鉴）
    setCurrentIllnessDiagnosisType(illness_item, diagnosisLegend_item) {
      // 非编辑状态下返回
      if(this.isCheck){return false}

      const default_weight = 5;
      let type_to_mark = diagnosisLegend_item.type; // 要标记的类型
      let type_pre = illness_item.type; // 之前标记的类型
      let case_id = this.case_id;
      let icd10_id = illness_item.id;
      let name = illness_item.illness_name;
      let id = illness_item.icds; // 右侧已经添加病种的id
      if (
        this.hasSetPrincipalDiagnosis() &&
        type_to_mark === PrincipalDiagnosis
      ) {
        this.$Message.error("已经存在主要诊断！请勿重复添加");
        return;
      }

      let params = {
        case_id,
        icd10_id,
        name,
        type: type_to_mark,
        weight: default_weight,
      };
      // 此处包含添加和修改两个部分
      // 有 type 是已经标记过
      if (type_pre) {
        params.id = id;
        this.modifyCurrentDiagnose(params);
      } else {
        // 添加
        this.addNewDiagnose(params);
      }
    },
    // 设置某病种评分权重
    setCurrentDiagnoseWeight(item) {
      let case_id = this.case_id;
      let icd10_id = item.icd10_id;
      let name = item.name;
      let type = item.type;
      let weight = item.weight;
      let id = item.id;
      let lx_illness_id = item.icd10_id
      let params = {
        case_id,
        icd10_id,
        name,
        type,
        weight,
        id,
        lx_illness_id
      };
      this.modifyCurrentDiagnose(params);
    },
    // 添加某类型病种
    addNewDiagnose(params) {
      postData("case/addDiagnose", params).then((res) => {
        if (res.res_code === 1) {
          this.init();
        }
      });
    },
    // 修改某类型病种
    modifyCurrentDiagnose(params) {
      postData("case/modifyDiagnose", params).then((res) => {
        if (res.res_code === 1) {
          this.init();
        }
      });
    },
    // 删除某类型病种
    deleteCurrentDiagnose(item) {
      let id = item.id;
      let params = {
        id,
      };
      postData("case/removeDiagnose", params).then((res) => {
        if (res.res_code === 1) {
          this.init();
        }
      });
    },
    // 检测当前是否已经存在主要诊断，若存在，提示主要诊断已经存在
    hasSetPrincipalDiagnosis() {
      let index = this.illnessForDiagnosisList.findIndex(
        (item) => item.type === PrincipalDiagnosis
      );
      if (index > -1) return true;
      return false;
    },
    // 检测是否已经创建了主要诊断，且每一个都包含权重，分值的总数为100分
    validateData(data) {
      if (typeof data == "object") {
        let num = 0;
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            const element = data[key];
            num += element.score;
            if (key === PrincipalDiagnosis) {
              if (element.diagnosis.length === 0) {
                this.$Message.error("请添加主要诊断！");
                return false;
              }
            }
          }
        }
        if (num != 100) {
          this.$Message.error("诊断的分值总分必须为100分！");
          return false;
        }
        return true
      } else {
        this.$Message.error("数据错误！");
        return false;
      }
    },
    // 上一步
    handleLast() {
      this.$emit("preStep");
    },
    // 下一步
    handleNext() {
      let isValidate =  this.validateData(this.illnessAddedForDiagnosisList);
      if(isValidate) this.$emit("nextStep");
    },
  },
};
</script>

<style scoped lang="less">
@import url("./create-diagnosis.less");
</style>