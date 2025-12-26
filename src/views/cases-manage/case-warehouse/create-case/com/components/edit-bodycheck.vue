<template>
  <div class="editBodycheckWrapper">
    <div v-if="step != 0">
      <div class="title">
        添加查体
        <Button
          type="primary"
          style="float: right; margin: 8px 5px 0 0"
          @click="openCustomizePhysicalModal"
          >自定义</Button
        >
      </div>
      <div class="content">
        <div v-if="step == initStep">
          <div class="selLine">
            <span>类型</span
            ><Cascader
              transfer
              style="width: 160px"
              :data="physicalCheckTypeList"
              v-model="physicalCheckTypeSel"
              @on-change="changePhysicalCheckType"
            />
            <Input
              style="width: 200px"
              v-model="keyword"
              clearable
              @on-change="getPhysicalCheckItemListByKeyword"
              placeholder="请输入搜索内容"
            />
          </div>
          <div class="bodycheckSelList">
            <div
              v-for="(item, index) in physicalCheckItemList"
              :key="'physicalCheckItemList' + index"
              class="physicalCheckItem"
              :class="item.is_exist === 1 ? 'physicalCheckItemActive' : ''"
              @click="selCurrentPhysicalCheckItem(item)"
            >
              {{ index + 1 }}、{{ item.item_name || item.name }}
            </div>
          </div>
        </div>
        <div v-if="step == editStep">
          <div class="levelTitle">
            {{ currentEditPhysicalCheckItemLevelTitle }}
          </div>
          <Input
            :disabled="isCheck"
            v-model="currentEditPhysicalCheckItem.result_text"
            type="textarea"
            :rows="4"
            placeholder="请输入检查结果"
          />
          <!-- 文件上传 -->
          <file-upload
            ref="refFileUpload"
            :tip="'* 支持jpg/png图片、mp3音频、mp4/mov/avi视频，且大小不超过300M，只能上传多个同类型文件'"
            :typeDir="'DefaultPhysicalExaminationResult'"
            :fileList="currentEditPhysicalCheckItem.media"
            :fileOriginType="currentEditPhysicalCheckItem.result_media_type"
          />
          <div v-if="diagnosisType == 1">
            <!-- 鉴别要素 -->
            <identify-element
              ref="identifyElement"
              :identifyInfo="currentEditPhysicalCheckItem"
            />
            <!-- 要素依据 -->
            <diagnosis-basis
              ref="diagnosisBasis"
              :diagnosisInfo="bodycheckItemData"
              :diagnosisList="dedaultDiagnosisList"
              :addedDiagnosisList="addedDiagnosisList"
            />
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
                v-model="currentEditPhysicalCheckItem.deduct_weight"
                style="width: 140px"
              />
            </div>
            <div class="deductionLine">
              <span>扣分理由</span>
              <Input
                :disabled="isCheck"
                v-model="currentEditPhysicalCheckItem.deduct_reason"
                :rows="4"
                type="textarea"
                style="width: 340px"
                placeholder="请输入回答"
              />
            </div>
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
    <!-- 自定义查体 -->
    <customize-physical ref="customizePhy" :caseId="{case_id}"></customize-physical>
  </div>
</template>

<script>
// 静态资源
import caseNO from "../../../../../../assets/case/case-no.png";
// 配置项
const DEFAULT_STEP = 0; // 默认步骤数
const INIT_STEP = 1; // 初始化步骤数
const EDIT_STEP = 2; // 编辑步骤数
// 组件
import fileUpload from "./file-upload";
import identifyElement from "./identify-element";
import diagnosisBasis from "./diagnosis-basis";
import customizePhysical from "./customize-physical"; // 自定义查体
// 工具函数
import postData from "src/api/postData";
import tool from "src/tool/tool";
export default {
  name: "editBodycheck",
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
    bodycheckItemData: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  inject: ["basisData"],
  data() {
    return {
      assets: {
        caseNO,
      },
      case_id:0,
      step: DEFAULT_STEP,
      initStep: INIT_STEP,
      editStep: EDIT_STEP,
      item_type: 1, // 1 得分项 2 干扰项 3 扣分项
      isAdd: true, // 默认执行添加操作
      physicalCheckTypeList: [], // 体检所有分类
      physicalCheckItemList: [], // 体检所有项
      physicalCheckTypeSel: [], // 当前分类
      keyword: "", // 关键字
      debounceGetPhysicalCheckList: undefined, // 获取检查项列表防抖
      currentEditPhysicalCheckItemLevelTitle: "", // 分级标题
      currentEditPhysicalCheckItem: {}, // 当前正在编辑的
      dedaultDiagnosisList: JSON.parse(JSON.stringify(this.basisData)), // 默认的诊断列表
      addedDiagnosisList: [], // 已添加的依据列表
    };
  },
  components: {
    fileUpload,
    identifyElement,
    diagnosisBasis,
    customizePhysical
  },
  beforeMount() {
    this.debounceGetPhysicalCheckList = tool.debounce(
      this.getPhysicalCheckList,
      1000
    );
  },
  mounted() {
    this.case_id = +this.$route.query.id;
    this.init();
    this.step = DEFAULT_STEP
  },
  methods: {
    init() {
      this.clear();
      this.getPhysicalTypeList();
      this.getPhysicalCheckList();
    },
    // 清空
    clear(from) {
      this.step = INIT_STEP;
      if (from == "clearBtn") {
        this.step = DEFAULT_STEP;
      }
      this.item_type = 1;
      this.isAdd = true;
      this.physicalCheckTypeSel = [];
    },
    // 确定添加/修改
    determine() {
      let item_type = this.item_type;
      let identify_element_code = 0;
      let case_diagnoses = [];
      let frequency_id = sessionStorage.getItem("FrequencyId");
      let physical_id = this.bodycheckItemData.id;
      let element_id = 0;
      let identify_element_code_sel = [];
      let result_media_type = this.$refs.refFileUpload.fileType || "None";
      // 当为得分项时添加依据
      if (item_type == 1) {
        element_id = this.group.id;
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
      } else {
        // 当当前编辑的不是得分项，此处 element_id 为 first_id
        element_id = this.group.first_id;
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

      let params = JSON.parse(
        JSON.stringify(this.currentEditPhysicalCheckItem)
      );
      // 获取当前已经添加的文件资源
      params.datas = this.$refs.refFileUpload.upload_file;
      params.case_diagnoses = case_diagnoses;
      params.identify_element_code = identify_element_code;
      params.frequency_id = frequency_id;
      params.element_id = element_id;

      params.tool_region_id = params.third_id;
      params.result_media_type = result_media_type;
      params.item_type = item_type;
      
      if (!this.isAdd) {
        params.id = physical_id;
      } else {
        params.item = this.currentEditPhysicalCheckItemLevelTitle;
      }
      
      PostData("case/operatePhysicalBasis", params).then((res) => {
        if (res.res_code === 1) {
          this.step = DEFAULT_STEP;
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
    async initEditItemData() {
      this.step = EDIT_STEP;
      this.isAdd = false;
      await this.getCurrentPhysicalCheckItemInfo();
      this.getCurrentItemPhysicalDiagnose();
    },
    // 获取所有检查项的列表
    getPhysicalCheckList() {
      let case_id = this.case_id;
      let first_id = 0;
      let frequency_id = sessionStorage.getItem("FrequencyId");
      let keyword = this.keyword;

      if (this.physicalCheckTypeSel.length > 0) {
        first_id = this.physicalCheckTypeSel[0]; // 此处目前只有1级
      }

      let params = {
        case_id,
        first_id,
        frequency_id,
        keyword,
      };
      postData("case/getItemListBySecondId", params).then((res) => {
        if (res.res_code === 1) {
          this.physicalCheckItemList = res.data;
        }
      });
    },
    // 获取所有检查类别的列表
    getPhysicalTypeList() {
      let case_id = this.case_id;
      let frequency_id = sessionStorage.getItem("FrequencyId");
      let params = {
        case_id,
        frequency_id,
      };
      postData("case/getPhysicalTreeByCaseId", params).then((res) => {
        if (res.res_code === 1) {
          this.physicalCheckTypeList = res.data;
          this.physicalCheckTypeList.unshift({ value: 0, label: "全部" });
        }
      });
    },
    // 改变检查项类别
    changePhysicalCheckType(val) {
      this.physicalCheckTypeSel = val;
      this.getPhysicalCheckList();
    },
    // 关键字搜索
    getPhysicalCheckItemListByKeyword() {
      this.debounceGetPhysicalCheckList();
    },
    // 选择当前检查项
    selCurrentPhysicalCheckItem(item) {
      this.step = this.editStep;
      this.currentEditPhysicalCheckItem = item;
      this._formateCurrentEditPhysicalCheckItemLevelTitle(item);
      console.log(item);
    },
    // 查询当前检查项具体信息
    async getCurrentPhysicalCheckItemInfo() {
      let frequency_id = sessionStorage.getItem("FrequencyId");
      let id = this.bodycheckItemData.id;
      // 获取要素详情（编辑时需要添加此参数）
      let type = "basis";

      let params = {
        frequency_id,
        id,
        type,
      };
      postData("case/getResultById", params).then((res) => {
        if (res.res_code === 1) {
          this.currentEditPhysicalCheckItem = res.data;
          this.item_type = res.data.item_type;
          this._formateCurrentEditPhysicalCheckItemLevelTitle(res.data);
        }
      });
    },
    //
    getCurrentItemPhysicalDiagnose() {
      let case_id = this.case_id;
      let frequency_id = sessionStorage.getItem("FrequencyId");
      let physical_id = this.bodycheckItemData.id;

      let params = {
        case_id,
        frequency_id,
        physical_id,
      };

      PostData("case/getPhysicalDiagnose", params).then((res) => {
        if (res.res_code === 1) {
          this.addedDiagnosisList = res.data;
          setTimeout(() => {
            if (this.$refs.diagnosisBasis) {
              this.$refs.diagnosisBasis._formate();
            }
          });
        }
      });
    },
    // 打开自定义添加体检弹窗
    openCustomizePhysicalModal(){
      this.$refs.customizePhy.customizePhysical = true;
    },
    _formateCurrentEditPhysicalCheckItemLevelTitle(item) {
      let levelTitle = "";
      let first_name = item.first_name;
      let second_name = item.second_name;
      let third_name = item.third_name;
      if (first_name) {
        levelTitle += first_name;
      }
      if (second_name) {
        levelTitle += `>${second_name}`;
      }
      if (third_name) {
        levelTitle += `>${third_name}`;
      }
      this.currentEditPhysicalCheckItemLevelTitle = levelTitle;
    },
  },
};
</script>

<style lang="less" scoped>
.editBodycheckWrapper {
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
    overflow-y: auto;
    padding: 0 20px;
    .selLine {
      padding: 10px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .bodycheckSelList {
      height: 490px;
      overflow-y: auto;
      .physicalCheckItem {
        padding: 10px;
        display: flex;
        cursor: pointer;
      }
      .physicalCheckItemActive {
        background: #f3f3f3;
      }
      .physicalCheckItem:hover {
        background: rgba(240, 240, 247, 0.8);
        color: #4098ff;
      }
    }
    .levelTitle {
      display: flex;
      align-items: center;
      height: 40px;
    }
    .radioLine {
      display: flex;
      align-items: center;
      // padding: 0px 30px;
      margin: 10px 0;
    }
    .deductionLine {
      display: flex;
      span {
        width: 70px;
        text-align: left;
        margin-right: 20px;
      }
    }
    .deductionLineCenter {
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