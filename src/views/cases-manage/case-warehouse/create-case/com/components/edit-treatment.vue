<template>
  <div class="editTreatmentWrapper">
    <div class="content">
      <div v-if="step != 0">
        <div class="title">
          添加诊疗
          <Button
            type="primary"
            style="float: right; margin: 8px 5px 0 0"
            @click="openCustomizePhysicalModal"
            >自定义</Button
          >
        </div>
        <!-- 类型选择 -->
        <!-- v-if="step == initStep" -->
        <div class="selLine1">
          <span>类型</span
          ><Cascader
            transfer
            style="width: 160px; float: left"
            :data="treatmentTypeList"
            :disabled="isCheck"
            v-model="treatmentTypeSel"
            @on-change="changeTreatmentType"
          />
          <Input
            style="width: 180px; float: right"
            v-if="currentSelTreatmentType == 2"
            :disabled="isCheck"
            v-model="keyword"
            clearable
            @on-change="debounceGetMedicineList"
            placeholder="请输入搜索内容"
          />
        </div>

        <div v-if="step == editStep">
          <!-- 手术相关 -->
          <div v-if="currentSelTreatmentType == 1">
            <div class="selLine">
              <span class="require">手术名称</span
              ><Input
                v-model="operation"
                :disabled="isCheck"
                style="width: 320px"
                placeholder="请输入搜索内容"
              />
            </div>
            <div class="selLine selLineBaseTop">
              <span class="require">应用理由</span
              ><Input
                type="textarea"
                v-model="reason_for_using"
                :disabled="isCheck"
                :rows="4"
                style="width: 320px"
                placeholder="请输入应用理由"
              />
            </div>
          </div>
          <!-- 药品相关 -->
          <div v-if="currentSelTreatmentType == 2">
            <!-- 选择药品 -->
            <div class="medicineSelList" v-if="showMedicineListState">
              <div
                v-for="(item, index) in medicineList"
                :key="'medicineList' + index"
                :disabled="isCheck"
                class="medicineListItem"
                :class="item.is_exist === 1 ? 'medicineListItemActive' : ''"
                @click="selCurrentMedicineItem(item)"
              >
                {{ index + 1 }}、{{ item.item_name || item.name }}
              </div>
            </div>
            <!-- 编辑药品 -->
            <div v-if="step == editStep && !showMedicineListState">
              <div class="medicineTitle">{{ currentMedicineSel.name }}</div>
              <div class="selLine">
                <span class="require">药物用法</span>
                <Select
                  v-model="usage_id"
                  :disabled="isCheck"
                  @on-change="changeMedicineMethod"
                  style="width: 320px"
                  :placeholder="'请选择药物用法'"
                >
                  <Option
                    v-for="item in medicineUseMethodsList"
                    :value="item.id"
                    :key="item.id"
                    >{{ item.name }}</Option
                  >
                </Select>
              </div>
              <div class="selLine">
                <span class="require">药物剂量</span>
                <Input
                  v-model="dosage"
                  :disabled="isCheck"
                  type="text"
                  style="width: 320px"
                  :placeholder="'请填写药物剂量'"
                />
              </div>
              <div class="selLine">
                <span class="require">时间间隔</span>
                <Select
                  v-model="medicineFrequencyId"
                  :disabled="isCheck"
                  @on-change="changeMedicineFrequency"
                  style="width: 320px"
                  :placeholder="'请选择时间间隔'"
                >
                  <Option
                    v-for="item in medicineFrequencyList"
                    :value="item.id"
                    :key="item.id"
                    >{{ item.name }}</Option
                  >
                </Select>
              </div>
              <div class="selLine selLineBaseTop">
                <span class="require">应用理由</span
                ><Input
                  type="textarea"
                  :disabled="isCheck"
                  v-model="reason_for_using"
                  :rows="4"
                  style="width: 320px"
                  placeholder="请输入应用理由"
                />
              </div>
            </div>
          </div>
          <!-- 护理相关 -->
          <div v-if="currentSelTreatmentType == 3">
            <div class="selLine">
              <span>护理等级</span>
              <Select
                v-model="nursing_level_id"
                :disabled="isCheck"
                @on-change="changeNurseLevel"
                style="width: 320px"
                :placeholder="'请选择护理等级'"
              >
                <Option
                  v-for="item in nurseLevelList"
                  :value="item.id"
                  :key="item.id"
                  >{{ item.name }}</Option
                >
              </Select>
            </div>
            <div class="selLine">
              <span>护理常规</span>
              <Input
                v-model="nursing_routine"
                :disabled="isCheck"
                type="text"
                style="width: 320px"
                :placeholder="'请选择护理常规'"
              />
            </div>
            <div class="selLine">
              <span>膳食</span>
              <Select
                v-model="nurseDietSel"
                :disabled="isCheck"
                @on-change="changeNurseDiet"
                multiple
                style="width: 320px"
                :placeholder="'请选择膳食（多选）'"
              >
                <Option
                  v-for="item in nurseDietList"
                  :value="item.id"
                  :key="item.id"
                  >{{ item.name }}</Option
                >
              </Select>
            </div>
            <div class="selLine">
              <span>体位</span>
              <Select
                v-model="position_id"
                :disabled="isCheck"
                @on-change="changeNursePosition"
                style="width: 320px"
                :placeholder="'请选择体位'"
              >
                <Option
                  v-for="item in nursePositionList"
                  :value="item.id"
                  :key="item.id"
                  >{{ item.name }}</Option
                >
              </Select>
            </div>
            <div class="selLine">
              <span> 护理项目</span>
              <Select
                v-model="nurseItemSel"
                :disabled="isCheck"
                @on-change="changeNurseItem"
                multiple
                style="width: 320px"
                :placeholder="'请选择护理项目（多选）'"
              >
                <Option
                  v-for="item in nurseItemList"
                  :value="item.id"
                  :key="item.id"
                  >{{ item.name }}</Option
                >
              </Select>
            </div>
            <div class="selLine">
              <span> 操作</span>
              <Select
                v-model="nurseOperationSel"
                :disabled="isCheck"
                @on-change="changeNurseOperation"
                multiple
                style="width: 320px"
                :placeholder="'请选择操作（多选）'"
              >
                <Option
                  v-for="item in nurseOperationList"
                  :value="item.id"
                  :key="item.id"
                  >{{ item.name }}</Option
                >
              </Select>
            </div>
            <div
              class="selLine"
              v-for="(item, index) in nurseOperationSelContent"
              :key="'nurseOperationSelContent' + index"
            >
              <span></span>
              <div>
                <div style="text-align: left">
                  <span style="color: red">*</span> {{ item.manipulation }}
                </div>
                <div>
                  <Input
                    v-model="item.manipulation_content"
                    :disabled="isCheck"
                    type="text"
                    style="width: 320px"
                  />
                </div>
              </div>
            </div>
            <div class="selLine selLineBaseTop">
              <span class="require">应用理由</span>
              <Input
                type="textarea"
                v-model="reason_for_using"
                :disabled="isCheck"
                :rows="4"
                style="width: 320px"
                placeholder="请输入应用理由"
              />
            </div>
          </div>
          <!-- 其他 -->
          <div v-if="currentSelTreatmentType == 4">
            <div class="selLine">
              <span class="require">治疗名称</span
              ><Input
                v-model="other_name"
                :disabled="isCheck"
                style="width: 320px"
                placeholder="请输入搜索内容"
              />
            </div>
            <div class="selLine selLineBaseTop">
              <span class="require">应用理由</span
              ><Input
                type="textarea"
                v-model="reason_for_using"
                :disabled="isCheck"
                :rows="4"
                style="width: 320px"
                placeholder="请输入应用理由"
              />
            </div>
          </div>
          <div v-if="step == editStep && !showMedicineListState">
            <div class="selLine selLineBaseJustify" v-if="diagnosisType == 1">
              <span>得分权重</span>
              <Rate
                :disabled="isCheck"
                v-model="weight"
                style="width: 140px; margin-left: 20px"
              />
            </div>
            <div class="radioLine" v-if="diagnosisType == 2">
              <span style="margin-right: 20px">设为</span>
              <RadioGroup v-model="item_type">
                <!-- <Radio :disabled="isCheck" :label="1">{{type == 4 ? '得分项' : '诊断依据'}}</Radio> -->
                <Radio :disabled="isCheck" :label="2">干扰项</Radio>
                <Radio :disabled="isCheck" :label="3">扣分项</Radio>
              </RadioGroup>
            </div>
            <div v-if="item_type == 3">
              <div class="selLine selLineBaseJustify">
                <span>扣分权重</span>
                <Rate
                  :disabled="isCheck"
                  v-model="deduct_weight"
                  style="width: 140px; margin-left: 20px"
                />
              </div>
              <div class="selLine selLineBaseTop">
                <span>扣分理由</span>
                <Input
                  type="textarea"
                  v-model="deduct_reason"
                  :disabled="isCheck"
                  :rows="4"
                  style="width: 320px"
                  placeholder="请输入扣分理由"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 初始化显示背景 -->
      <div v-else class="defaultContent">
        <img :src="assets.caseNO" class="case-no2" />
        <div class="case-no-text">请从左侧选择“添加”</div>
      </div>
    </div>
    <div v-if="!isCheck && step != 0" class="case-btn-box">
      <Button class="case-btn-last" @click="clear()" type="primary"
        >清空</Button
      >
      <Button class="case-btn" @click="determine()" type="primary">确定</Button>
    </div>
    <customize-diagnosis ref="refCustomizeDiagnosis" :caseId="{ case_id }" />
  </div>
</template>

<script>
// 静态资源
import caseNO from "../../../../../../assets/case/case-no.png";
import deleteImg from "../../../../../../assets/img/templater/delete.png";
// 配置项
const DEFAULT_STEP = 0; // 默认步骤数
const INIT_STEP = 1; // 初始化步骤数
const EDIT_STEP = 2; // 编辑步骤数
// 组件
import customizeDiagnosis from "./customize-diagnosis";
// 工具函数
import postData from "src/api/postData";
import tool from "src/tool/tool";

export default {
  name: "editTreatment",
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
    treatmentItemData: {
      type: Object,
      default: function () {
        return {};
      },
    },
    // 诊疗id
    case_treatment_id: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      assets: {
        caseNO,
        deleteImg,
      },
      case_id: 0,
      step: DEFAULT_STEP,
      initStep: INIT_STEP,
      editStep: EDIT_STEP,
      item_type: 1, // 1 得分项 2 干扰项 3 扣分项
      isAdd: true, // 默认执行添加操作

      treatmentTypeList: [
        { value: 1, label: "手术", children: [] },
        {
          value: 2,
          label: "药品",
          children: [
            {
              value: 6,
              label: "西药",
              children: [],
            },
            {
              value: 9,
              label: "中成药",
              children: [],
            },
          ],
        },
        { value: 3, label: "护理", children: [] },
        { value: 4, label: "其他", children: [] },
      ], // 诊疗分类
      treatmentTypeSel: [], // 当前选择的诊疗分类
      currentSelTreatmentType: 0, // 当前选择添加的类别
      keyword: "", // 关键字
      nurseLevelList: [], // 护理等级列表
      nurseDietList: [], // 护理膳食列表
      nursePositionList: [], // 护理体位列表
      nurseItemList: [], // 护理项目列表
      nurseOperationList: [], // 护理操作列表
      operation: "", // 手术名称
      reason_for_using: "", // 应用理由
      weight: 0, // 得分权重
      other_name: "", // 其他 治疗名称
      nursing_level_id: 0, // 护理等级id
      nursing_routine: "", // 护理常规
      nurseDietSel: [], // 护理膳食id数组
      position_id: 0, // 护理体位id
      nurseItemSel: [], // 护理项目id数组
      nurseOperationSel: [], // 护理操作id数组
      nurseOperationSelContent: [], // 护理操作对应的操作内容
      showMedicineListState: false, // 是否显示药品列表
      medicineList: [], // 药品列表
      debounceGetMedicineList: undefined, // 获取检查项列表防抖
      medicineUseMethodsList: [], // 药品用法列表
      medicineFrequencyList: [], // 药品时间间隔
      currentMedicineSel: {}, //当前选择的药品
      dosage: "", // 药物剂量
      usage_id: 0, // 药物用法id
      medicineFrequencyId: 0, // 时间间隔id
      deduct_weight: 0, // 扣分权重
      deduct_reason: 0, // 扣分理由
    };
  },
  components: {
    customizeDiagnosis,
  },
  created() {
    this.case_id = +this.$route.query.id;
  },
  beforeMount() {
    this.debounceGetMedicineList = tool.debounce(
      this.getMedicineListByKeyword,
      1000
    );
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {},
    setStep(step) {
      this.step = step;
    },
    setIsAdd(add) {
      this.isAdd = add;
    },
    // 自定义
    openCustomizePhysicalModal() {
      this.$refs.refCustomizeDiagnosis.customizeDiagnosis = true;
    },
    // 选择诊疗分类
    changeTreatmentType(val) {
      this.currentSelTreatmentType = val[0];
      if (this.currentSelTreatmentType == 3) {
        this.getAllNurseData();
      }
      if (val[0] && val[0] != 2) {
        this.step = this.editStep;
      }
      if (val[1]) {
        this.step = this.editStep;
        this.showMedicineListState = true;
        this.medicineType = val[1];
        this.getMedicineListByKeyword();
        this.getAllMedicineData();
      }
    },
    // 初始化要编辑的数据
    async initEditItemData() {
      this.setStep(this.editStep);
      this.setIsAdd(false);
      this.showMedicineListState = false;
      this.currentEditId = this.treatmentItemData.id;
      this.item_type = this.treatmentItemData.item_type;
      this.deduct_weight = this.treatmentItemData.deduct_weight;
      this.deduct_reason = this.treatmentItemData.deduct_reason;
      // 初始化手术
      if (this.treatmentItemData.type == "operation") {
        this.currentSelTreatmentType = 1;

        this.operation = this.treatmentItemData.operation;
        this.reason_for_using = this.treatmentItemData.reason_for_using;
        this.weight = this.treatmentItemData.weight;
      }
      // 初始化药品
      if (this.treatmentItemData.type == "medicine") {
        this.currentSelTreatmentType = 2;
        if (this.treatmentItemData.medicine_type == "西药") {
          this.medicineType = 6;
        } else if (this.treatmentItemData.medicine_type == "中药") {
          this.medicineType = 9;
        }
        await this.getAllMedicineData();
        this.currentMedicineSel.name = this.treatmentItemData.medicine_name;
        this.usage_id = this.treatmentItemData.usage_id;
        this.dosage = this.treatmentItemData.dosage;
        this.medicineFrequencyId = this.treatmentItemData.frequency_id;
        this.reason_for_using = this.treatmentItemData.reason_for_using;
        this.weight = this.treatmentItemData.weight;
        console.log(`this.medicineUseMethodsList`);
        // 整理 usage
        let usageIndex = this.medicineUseMethodsList.findIndex(
          (item) => item.id == this.usage_id
        );
        this.usage = this.medicineUseMethodsList[usageIndex].name;
        console.log(usageIndex, this.usage);
        // 整理 frequency
        let frequencyIndex = this.medicineFrequencyList.findIndex(
          (item) => item.id == this.medicineFrequencyId
        );
        this.frequency = this.medicineFrequencyList[frequencyIndex].name;
        console.log(frequencyIndex, this.frequency);
      }

      // 初始化护理
      if (this.treatmentItemData.type == "treat") {
        this.currentSelTreatmentType = 3;

        await this.getAllNurseData();
        this.nursing_level_id = this.treatmentItemData.nursing_level_id;
        // 整理 nursing_level
        let nurseLevelSelIndex = this.nurseLevelList.findIndex(
          (item) => item.id == this.nursing_level_id
        );
        if (nurseLevelSelIndex > -1) {
          this.nursing_level = this.nurseLevelList[nurseLevelSelIndex].name;
        }

        this.nursing_routine = this.treatmentItemData.nursing_routine;

        if (
          this.treatmentItemData.diets &&
          this.treatmentItemData.diets.length > 0
        ) {
          this.treatmentItemData.diets.forEach((item) => {
            this.nurseDietSel.push(item.diet_id);
          });
        }
        this.position_id = this.treatmentItemData.position_id;

        if (
          this.treatmentItemData.nursings &&
          this.treatmentItemData.nursings.length > 0
        ) {
          this.treatmentItemData.nursings.forEach((item) => {
            this.nurseItemSel.push(item.nursing_id);
          });
        }

        if (
          this.treatmentItemData.manipulations &&
          this.treatmentItemData.manipulations.length > 0
        ) {
          this.treatmentItemData.manipulations.forEach((item) => {
            this.nurseOperationSel.push(item.manipulation_id);
            this.nurseOperationSelContent.push({
              manipulation: item.manipulation,
              manipulation_id: item.manipulation_id,
              manipulation_content: item.manipulation_content,
            });
          });
        }

        this.reason_for_using = this.treatmentItemData.reason_for_using;
        this.weight = this.treatmentItemData.weight;
      }
      // 初始化其他
      if (this.treatmentItemData.type == "other") {
        this.currentSelTreatmentType = 4;
        this.other_name = this.treatmentItemData.other_name;
        this.reason_for_using = this.treatmentItemData.reason_for_using;
        this.weight = this.treatmentItemData.weight;
      }
    },
    // 搜索药品
    getMedicineListByKeyword() {
      let case_id = this.case_id;
      let case_treatment_id = this.case_treatment_id;
      let frequency_id = sessionStorage.getItem("FrequencyId");
      let keyword = this.keyword;
      let medicine_type = this.medicineType;

      let params = {
        case_id,
        case_treatment_id,
        frequency_id,
        keyword,
        medicine_type,
      };
      postData("case/getMedicineList", params).then((res) => {
        if (res.res_code === 1) {
          this.medicineList = res.data;
        }
      });
    },
    // 选择当前药品
    selCurrentMedicineItem(item) {
      this.clearData();
      this.setStep(this.editStep);
      this.showMedicineListState = false;
      this.currentSelTreatmentType = 2;
      this.currentMedicineSel = item;
    },

    // 提交
    determine() {
      let case_id = this.case_id;
      let case_treatment_id = this.case_treatment_id;
      let deduct_reason = this.deduct_reason;
      let deduct_weight = this.deduct_weight;
      let element_id = this.group.id;
      let frequency_id = sessionStorage.getItem("FrequencyId");
      let item_type = this.item_type;
      let operation = this.operation;
      let reason_for_using = this.reason_for_using;
      let weight = this.weight;
      let other_name = this.other_name;

      let params = {
        case_id,
        case_treatment_id,
        deduct_reason,
        deduct_weight,
        element_id,
        frequency_id,
        item_type,
        operation,
        reason_for_using,
        weight,
        other_name,
      };

      switch (this.currentSelTreatmentType) {
        case 1:
          this.editOperation(params);
          break;
        case 2:
          this.editMedicine(params);
          break;
        case 3:
          this.editNurse(params);
          break;
        case 4:
          this.editOther(params);
          break;
        default:
          break;
      }
    },
    // 清空
    clear() {
      this.clearData();
      this.setStep(DEFAULT_STEP);
    },
    // 清空数据
    clearData() {
      // 清空数据
      this.currentSelTreatmentType = 0;
      this.item_type = this.diagnosisType == 1 ? 1 : 2;
      this.operation = ""; // 手术名称
      this.reason_for_using = ""; // 应用理由
      // this.case_treatment_id = 0; // 诊疗id
      this.weight = 0; // 得分权重
      this.other_name = ""; // 其他 治疗名称
      this.nursing_level_id = 0; // 护理等级id
      this.nursing_routine = ""; // 护理常规
      this.nurseDietSel = []; // 护理膳食id数组
      this.position_id = 0; // 护理体位id
      this.nurseItemSel = []; // 护理项目id数组
      this.nurseOperationSel = []; // 护理操作id数组
      this.nurseOperationSelContent = []; // 护理操作对应的操作内容
      this.currentMedicineSel = {}; //当前选择的药品
      this.dosage = ""; // 药物剂量
      this.usage_id = 0; // 药物用法id
      this.medicineFrequencyId = 0; // 时间间隔id
      this.deduct_weight = 0;
      this.deduct_reason = "";
    },
    // 获取护理相关信息
    async getAllNurseData() {
      await this.getNurseLevelList();
      await this.getNurseDietList();
      await this.getNursePositionList();
      await this.getNurseItemList();
      await this.getNurseOperationList();
    },
    // 获取护理等级
    async getNurseLevelList() {
      if (this.nurseLevelList.length > 0) return;
      let case_id = this.case_id;
      let params = {
        case_id,
      };
      await postData("case/getNursingLevel", params).then((res) => {
        if (res.res_code === 1) {
          this.nurseLevelList = res.data;
        }
      });
    },
    // 获取膳食
    async getNurseDietList() {
      if (this.nurseDietList.length > 0) return;
      let case_id = this.case_id;
      let params = {
        case_id,
      };
      await postData("case/getDiet", params).then((res) => {
        if (res.res_code === 1) {
          this.nurseDietList = res.data;
        }
      });
    },
    // 获取体位
    async getNursePositionList() {
      if (this.nursePositionList.length > 0) return;
      let case_id = this.case_id;
      let params = {
        case_id,
      };
      await postData("case/getPosition", params).then((res) => {
        if (res.res_code === 1) {
          this.nursePositionList = res.data;
        }
      });
    },
    // 获取护理项目
    async getNurseItemList() {
      if (this.nurseItemList.length > 0) return;
      let case_id = this.case_id;
      let params = {
        case_id,
      };
      await postData("case/getNursing", params).then((res) => {
        if (res.res_code === 1) {
          this.nurseItemList = res.data;
        }
      });
    },
    // 获取操作
    async getNurseOperationList() {
      if (this.nurseOperationList.length > 0) return;
      let case_id = this.case_id;
      let params = {
        case_id,
      };
      postData("case/getManipulation", params).then((res) => {
        if (res.res_code === 1) {
          this.nurseOperationList = res.data;
        }
      });
    },
    // 编辑手术
    editOperation(params) {
      let url = "";
      if (this.isAdd) {
        url = "case/addOperation";
      } else {
        params.id = this.currentEditId;
        url = "case/modifyOperation";
      }
      // 添加 修改
      postData(url, params).then((res) => {
        if (res.res_code === 1) {
          this.step = DEFAULT_STEP;
          this.$emit("refreshData", {
            num: 1,
            diagnosisType: this.diagnosisType,
            groupId: this.group.id,
          });
          this.clearData();
        }
      });
    },
    // 获取药品相关信息
    async getAllMedicineData() {
      await this.getMedicineUseMethodsList();
      await this.getMedicineFrequencyList();
    },
    // 获取药品用法列表
    async getMedicineUseMethodsList() {
      if (this.medicineUseMethodsList.length > 0) return;
      let case_id = this.case_id;
      let medicine_type = this.medicineType;

      let params = {
        case_id,
        medicine_type,
      };
      await postData("case/getUsage", params).then((res) => {
        if (res.res_code === 1) {
          this.medicineUseMethodsList = res.data;
        }
      });
    },
    // 获取药品时间间隔
    async getMedicineFrequencyList() {
      if (this.medicineFrequencyList.length > 0) return;
      let case_id = this.case_id;
      let medicine_type = this.medicineType;

      let params = {
        case_id,
        medicine_type,
      };
      await postData("case/getFrequency", params).then((res) => {
        if (res.res_code === 1) {
          this.medicineFrequencyList = res.data;
        }
      });
    },
    // 改变药物用法
    changeMedicineMethod(usage_id) {
      this.usage_id = usage_id;
      let index = this.medicineUseMethodsList.findIndex(
        (item) => item.id == usage_id
      );
      this.usage = this.medicineUseMethodsList[index].name;
      console.log(index, this.usage);
    },
    // 改变时间间隔
    changeMedicineFrequency(frequencyId) {
      this.medicineFrequencyId = frequencyId;
      let index = this.medicineFrequencyList.findIndex(
        (item) => item.id == frequencyId
      );
      this.frequency = this.medicineFrequencyList[index].name;
      console.log(index, this.frequency);
    },
    // 编辑药品
    editMedicine(params) {
      let dosage = this.dosage;
      let frequency = this.frequency;
      let frequency_id = this.medicineFrequencyId;
      let medicine_type = this.medicineType;
      let medicine_id = this.currentMedicineSel.id;
      let medicine_name = this.currentMedicineSel.name;
      let primary_classification = this.currentMedicineSel.primary_name;
      let primary_id = this.currentMedicineSel.primary_id;
      let secondary_classification = this.currentMedicineSel.secondary_name;
      let secondary_id = this.currentMedicineSel.secondary_id;
      let usage = this.usage;
      let usage_id = this.usage_id;

      params.dosage = dosage;
      params.frequency = frequency;
      params.frequency_id = frequency_id;
      params.medicine_id = medicine_id;
      params.medicine_name = medicine_name;
      params.medicine_type = medicine_type;
      params.primary_classification = primary_classification;
      params.primary_id = primary_id;
      params.secondary_classification = secondary_classification;
      params.secondary_id = secondary_id;
      params.usage = usage;
      params.usage_id = usage_id;

      let url = "";
      if (this.isAdd) {
        url = "case/addMedicine";
      } else {
        url = "case/modifyMedicine";
        params.id = this.currentEditId;
      }
      postData(url, params).then((res) => {
        if (res.res_code === 1) {
          this.step = DEFAULT_STEP;
          this.$emit("refreshData", {
            num: 1,
            diagnosisType: this.diagnosisType,
            groupId: this.group.id,
          });
          this.clearData();
        }
      });
    },
    // 改变护理等级,拿到对应名字
    changeNurseLevel(val) {
      let currentSelIndex = this.nurseLevelList.findIndex(
        (item) => item.id == val
      );
      if (currentSelIndex > -1) {
        this.nursing_level = this.nurseLevelList[currentSelIndex].name;
      }
    },
    // 改变护理膳食
    changeNurseDiet(arr) {
      console.log(arr);
      let dietFormate = [];
      let dietMap = {};
      this.nurseDietList.forEach((item) => {
        dietMap[item.id] = item;
      });
      arr.forEach((item) => {
        if (dietMap[item]) {
          dietFormate.push({
            diet_id: dietMap[item].id,
            diet: dietMap[item].name,
          });
        }
      });
      this.diets = dietFormate;
    },
    // 改变体位
    changeNursePosition(val) {
      let currentSelIndex = this.nursePositionList.findIndex(
        (item) => item.id == val
      );
      if (currentSelIndex > -1) {
        this.position = this.nursePositionList[currentSelIndex].name;
      }
    },
    // 改变护理项目
    changeNurseItem(arr) {
      let itemFormate = [];
      let itemMap = {};
      this.nurseItemList.forEach((item) => {
        itemMap[item.id] = item;
      });
      arr.forEach((item) => {
        if (itemMap[item]) {
          itemFormate.push({
            nursing_id: itemMap[item].id,
            nursing: itemMap[item].name,
          });
        }
      });
      this.nursings = itemFormate;
    },
    // 改变护理操作
    changeNurseOperation(arr) {
      let operationFormate = [];
      let operationContentArr = []; // 操作附加说明
      let operationMap = {};
      let operationContentMap = {};

      this.nurseOperationList.forEach((item) => {
        operationMap[item.id] = item;
      });

      this.nurseOperationSelContent.forEach((item) => {
        operationContentMap[item.manipulation_id] = item;
      });
      // 添加操作
      if (this.nurseOperationSelContent.length < arr.length) {
        console.log("添加操作");
        arr.forEach((item) => {
          if (!operationContentMap[item]) {
            console.log(operationContentMap, item);
            this.nurseOperationSelContent.push({
              manipulation: operationMap[item].name,
              manipulation_id: operationMap[item].id,
              manipulation_content: "",
            });
          }
        });
      } // 删除操作
      else if (this.nurseOperationSelContent.length > arr.length) {
        console.log("删除操作", operationContentMap);
        let newArr = [];
        this.nurseOperationSelContent.forEach((item) => {
          let id = item.manipulation_id;
          let arrIndex = arr.findIndex((arrItem) => arrItem == id);
          if (arrIndex != -1) {
            newArr.push(item);
            console.log(item);
          }
        });
        this.nurseOperationSelContent = newArr;
      }
    },
    // 编辑护理
    editNurse(params) {
      let nursing_level_id = this.nursing_level_id; // 护理等级id
      let nursing_level = this.nursing_level; // 护理等级文字
      let nursing_routine = this.nursing_routine; // 护理常规
      let diets = this.diets; // 膳食
      let position_id = this.position_id; // 体位id
      let position = this.position; // 体位文字
      let nursings = this.nursings; // 护理项目
      let manipulations = this.nurseOperationSelContent; // 操作

      // 整理参数

      params.nursing_level_id = nursing_level_id;
      params.nursing_level = nursing_level;
      params.nursing_routine = nursing_routine;
      params.diets = diets;
      params.position_id = position_id;
      params.position = position;
      params.nursings = nursings;
      params.manipulations = manipulations;

      if (!this.isAdd) {
        params.id = this.currentEditId;
      }
      postData("case/operateNursing", params).then((res) => {
        if (res.res_code === 1) {
          this.step = DEFAULT_STEP;
          this.$emit("refreshData", {
            num: 1,
            diagnosisType: this.diagnosisType,
            groupId: this.group.id,
          });
          this.clearData();
        }
      });
    },
    // 编辑其他
    editOther(params) {
      postData("case/addOther", params).then((res) => {
        if (res.res_code === 1) {
          this.step = DEFAULT_STEP;
          this.$emit("refreshData", {
            num: 1,
            diagnosisType: this.diagnosisType,
            groupId: this.group.id,
          });
          this.clearData();
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.editTreatmentWrapper {
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
    height: 600px;
    overflow-y: auto;
    padding: 0 20px;
    .selLine1 {
      padding: 10px 0;
      display: flow-root;
      border-bottom: 1px dashed #f0f0f7;
      // display: flex;
      // align-items: center;
      span {
        float: left;
        margin-right: 10px;
        margin-top: 10px;
      }
    }
    .medicineTitle {
      position: relative;
      margin: 10px;
      font-size: 16px;
      font-weight: bold;
      color: #2d3662;
      margin-left: 10px;
      text-align: left;
    }
    .medicineTitle::before {
      content: " ";
      position: absolute;
      left: -10px;
      top: 0px;
      width: 5px;
      height: 100%;
      background: #4098ff;
    }
    .selLine {
      padding: 10px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      // span{
      //   width: 80px;
      //   text-align: left;
      // }
      .require::before {
        content: "*";
        color: red;
      }
    }
    .selLineBaseTop {
      align-items: flex-start;
    }
    .selLineBaseJustify {
      justify-content: flex-start;
    }
    .radioLine {
      display: flex;
      align-items: center;
      // padding: 0px 30px;
      margin: 10px 0;
    }
    .medicineSelList {
      height: 490px;
      overflow-y: auto;
      .medicineListItem {
        padding: 10px;
        display: flex;
        cursor: pointer;
      }
      .medicineListItemActive {
        background: #f3f3f3;
      }
      .medicineListItem:hover {
        background: rgba(240, 240, 247, 0.8);
        color: #4098ff;
      }
    }
  }
  .case-btn-box {
    display: flex;
    justify-content: center;
    margin-top: 10px;
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
}
</style>