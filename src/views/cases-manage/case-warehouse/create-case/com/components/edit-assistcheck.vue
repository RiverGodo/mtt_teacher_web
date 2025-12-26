<template>
  <div class="editAssistWrapper">
    <div v-if="step != 0">
      <div class="title">
        添加辅检
        <Button
          type="primary"
          style="float: right; margin: 8px 5px 0 0"
          @click="openCustomizeAssistModal"
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
              :data="assistCheckTypeList"
              v-model="assistCheckTypeSel"
              @on-change="changeAssistCheckType"
            />
            <Input
              style="width: 200px"
              v-model="keyword"
              clearable
              @on-change="getAssistCheckItemListByKeyword"
              placeholder="请输入搜索内容"
            />
          </div>
          <div class="bodycheckSelList">
            <div
              v-for="(item, index) in assistCheckItemList"
              :key="'physicalCheckItemList' + index"
              class="physicalCheckItem"
              :class="item.is_exist === 1 ? 'physicalCheckItemActive' : ''"
              @click="selCurrentAssistCheckItem(item)"
            >
              {{ index + 1 }}、{{ item.item_name || item.name }}
            </div>
          </div>
        </div>
        <div
          v-if="step == editStep"
          style="border-bottom: 1px dashed #abb7c5; padding-bottom: 20px"
        >
          <div class="levelTitle">
            {{ currentEditAssistCheckItemLevelTitle }}
          </div>
          <div class="radioLine">
            <span style="margin-right: 20px">设为</span>
            <!-- v-model="data_type" -->
            <RadioGroup v-model="data_type">
              <Radio :disabled="isCheck" label="ImageData">使用文件</Radio>
              <Radio :disabled="isCheck" label="ExaminationReport"
                >使用模板</Radio
              >
              <Radio :disabled="isCheck" label="None">使用文字</Radio>
            </RadioGroup>
          </div>
          <!-- 使用文件 -->
          <file-upload
            v-if="data_type == 'ImageData'"
            ref="refFileUpload"
            :tip="'* 支持doc文件、docx文件，且大小不超过300M，只能上传一个文件'"
            :typeDir="'DefaultAssistantExamination'"
            :fileList="fileOriginList"
            :fileOriginType="currentEditAssistCheckItem.result_media_type"
          />
          <!-- 使用模板 -->
          <div
            v-if="data_type == 'ExaminationReport'"
            class="upload-mold tables"
          >
            <div class="mold-head">
              <div
                class="mold-head-content"
                v-for="(item, index) in mold_head"
                :key="index"
                :style="{ width: item.width }"
              >
                {{ item.title }}
              </div>
            </div>
            <div v-if="assisTable && assisTable.length > 0">
              <div
                v-for="(item, index) in assisTable"
                class="mold-content"
                :key="index"
              >
                <img
                  v-if="!isCheck"
                  class="content-img"
                  :src="assets.deleteImg"
                  alt
                  @click="deleteTable(index)"
                />
                <div style="display: flex">
                  <div
                    v-for="(item1, index1) in mold_head"
                    :key="index1"
                    :style="{
                      width: item1.width,
                      'padding-left':
                        item1.model == 'name' && !isCheck ? '10px' : '',
                    }"
                    class="content-edit"
                  >
                    <Tooltip
                      v-if="item[item1.model]"
                      theme="light"
                      :content="item[item1.model]"
                    >
                      <Input
                        :disabled="isCheck"
                        v-model="item[item1.model]"
                        :class="item1.model == 'name' ? 'table-name1' : ''"
                        autocomplete="off"
                      />
                    </Tooltip>
                    <Input
                      v-else
                      :disabled="isCheck"
                      v-model="item[item1.model]"
                      :class="item1.model == 'name' ? 'table-name1' : ''"
                      autocomplete="off"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="assis-table-no">暂无数据</div>
            <div v-if="!isCheck" class="btn-box">
              <Button class="modal-add-btn" @click="addTable">添加列表</Button>
            </div>
          </div>
          <!-- 使用文字 -->
          <div v-if="data_type == 'None'" style="margin: 2px 20px 0 20px">
            <Input
              v-model="currentEditAssistCheckItem.result_text"
              type="textarea"
              :rows="4"
              placeholder="请输入..."
            />
          </div>
          <div v-if="diagnosisType == 1">
            <!-- 鉴别要素 -->
            <identify-element
              ref="identifyElement"
              :identifyInfo="currentEditAssistCheckItem"
            />
            <!-- 要素依据 -->
            <diagnosis-basis
              ref="diagnosisBasis"
              :diagnosisInfo="assistcheckItemData"
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
        </div>
        <div v-if="item_type == 3">
          <div class="deductionLine deductionLineCenter">
            <span>扣分权重</span
            ><Rate
              :disabled="isCheck"
              v-model="currentEditAssistCheckItem.deduct_weight"
              style="width: 140px"
            />
          </div>
          <div class="deductionLine">
            <span>扣分理由</span>
            <Input
              :disabled="isCheck"
              v-model="currentEditAssistCheckItem.deduct_reason"
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
    <!-- 自定义辅检 -->
    <customize-assist ref="refCustomizeAssist" :caseId="{ case_id }" />
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
import fileUpload from "./file-upload";
import identifyElement from "./identify-element";
import diagnosisBasis from "./diagnosis-basis";
import customizeAssist from "./customize-assist"; // 自定义辅检
// 工具函数
import postData from "src/api/postData";
import tool from "src/tool/tool";
export default {
  // 编辑辅检
  name: "editAssist",
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
    assistcheckItemData: {
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
        deleteImg,
      },
      case_id: 0,
      step: DEFAULT_STEP,
      initStep: INIT_STEP,
      editStep: EDIT_STEP,
      item_type: 1, // 1 得分项 2 干扰项 3 扣分项
      isAdd: true, // 默认执行添加操作
      assistCheckTypeList: [], // 体检所有分类
      assistCheckItemList: [], // 体检所有项
      assistCheckTypeSel: [], // 当前分类
      keyword: "", // 关键字
      first_id: 0, // 辅检类别默认id
      data_type: "ImageData", // 默认的附件类型
      debounceGetAssistCheckList: undefined, // 获取检查项列表防抖
      currentEditAssistCheckItemLevelTitle: "", // 分级标题
      currentEditAssistCheckItemOrigin: {}, // 列表项记录的信息
      currentEditAssistCheckItem: {}, // 当前正在编辑的
      dedaultDiagnosisList: JSON.parse(JSON.stringify(this.basisData)), // 默认的诊断列表
      addedDiagnosisList: [], // 已添加的依据列表
      mold_head: [
        { title: "项目", width: "34%", model: "name" },
        { title: "缩写", width: "15%", model: "abbreviation" },
        { title: "检查结果", width: "18%", model: "value" },
        { title: "参考值", width: "15%", model: "refvalue" },
        { title: "单位", width: "18%", model: "units" },
      ],
      assisTable: [], // 模板表格数据
      fileOriginList: [], // 原始的文件列表
    };
  },
  components: {
    fileUpload,
    identifyElement,
    diagnosisBasis,
    customizeAssist,
  },
  created(){
    this.case_id = +this.$route.query.id;
  },
  beforeMount() {
    this.debounceGetAssistCheckList = tool.debounce(
      this.getAssistCheckList,
      1000
    );
  },
  mounted() {
    
    this.init();
    this.step = DEFAULT_STEP
  },
  methods: {
    init() {
      this.getAssistTypeList();
      this.getAssistCheckList();
      this.clear();
      this.step = INIT_STEP;
    },
    // 清空
    clear(from) {
      this.step = INIT_STEP;
      if (from == "clearBtn") {
        this.step = DEFAULT_STEP;
      }
    },
    // 被编辑的项赋初始值
    async initEditItemData() {
      this.step = EDIT_STEP;
      this.isAdd = false;
      this.getCurrentAssistCheckItemInfo(this.assistcheckItemData);
      // await this.getCurrentPhysicalCheckItemInfo();
      this.getCurrentItemPhysicalDiagnose();
    },
    // 确定添加/修改
    determine() {
      let case_id = this.case_id;
      let item_type = this.item_type;
      let identify_element_code = 0;
      let case_diagnoses = [];
      let frequency_id = sessionStorage.getItem("FrequencyId");
      let element_id = 0;
      let identify_element_code_sel = [];
      let type = this.data_type; // 结果附件类型
      let media = []; // 结果附件

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

      let params = JSON.parse(JSON.stringify(this.currentEditAssistCheckItem));
      // 根据结果附件类型判断media
      params = Object.assign(params, this.currentEditAssistCheckItemOrigin);
      params.case_diagnoses = case_diagnoses;
      params.identify_element_code = identify_element_code;
      params.frequency_id = frequency_id;
      params.element_id = element_id;
      params.item_type = item_type;
      params.media = media;
      params.type = type;

      console.log(params);
      PostData("case/operateAssistBasis", params).then((res) => {
        if (res.res_code === 1) {
          this.step = DEFAULT_STEP;

          // 在辅检项里，得分项 id 当为干扰项/扣分项时 first_id
          let groupId =
            this.diagnosisType == 1 ? this.group.id : this.group.first_id;

          this.$emit("refreshData", {
            num: 1,
            diagnosisType: this.diagnosisType,
            groupId,
          });
          this.clear("clearBtn");
        }
      });
    },
    // 获取添加辅检的类型
    getAssistTypeList() {
      let case_id = this.case_id;
      console.log( "????")
      let frequency_id = sessionStorage.getItem("FrequencyId");
      let params = {
        case_id,
        frequency_id,
      };
      postData("case/getAssistTreeByCaseId", params).then((res) => {
        if (res.res_code === 1) {
          this.assistCheckTypeList = res.data || [];
        }
      });
    },
    // 通过关键字搜索
    getAssistCheckItemListByKeyword() {
      this.debounceGetAssistCheckList();
    },
    // 通过关键字获取辅检项
    getAssistCheckList() {
      let case_id = this.case_id;
      let first_id = this.first_id;
      let frequency_id = sessionStorage.getItem("FrequencyId");
      let keyword = this.keyword;

      let params = {
        case_id,
        frequency_id,
        first_id,
        keyword,
      };

      postData("case/getItemListByParentId", params).then((res) => {
        if (res.res_code === 1) {
          this.assistCheckItemList = res.data || [];
        }
      });
    },
    // 选择当前辅检项
    selCurrentAssistCheckItem(item) {
      console.log(item);
      this.step = this.editStep;
      this.currentEditAssistCheckItemOrigin = item;
      if (item.id) {
        this.getCurrentAssistCheckItemInfo(item);
      }

      this._formateCurrentEditAssistCheckItemLevelTitle(item);
    },
    // 查找当前项信息
    getCurrentAssistCheckItemInfo(itemInfo) {
      let frequency_id = sessionStorage.getItem("FrequencyId");
      let id = itemInfo.id;

      let params = {
        frequency_id,
        id,
        type: "basis",
      };
      postData("case/getAssistResultById", params).then((res) => {
        if (res.res_code === 1) {
          this.currentEditAssistCheckItem = res.data;
          // 结果类型
          this.data_type = res.data.type;
          // 得分项/干扰项
          this.item_type = res.data.item_type || 1;
          // 结果文件资源
          if (this.data_type == "ImageData") {
            this.fileOriginList = res.data.media || [];
            if (typeof this.fileOriginList != "array") {
              this.fileOriginList = new Array(this.fileOriginList);
            }
          }
          // 模板资源
          else if (this.data_type == "ExaminationReport") {
            this.assisTable = res.data.media;
          }

          // 文字资源(没有赋值到其他变量上)

          // 整理分级标题
          this._formateCurrentEditAssistCheckItemLevelTitle(res.data);
        }
      });
    },
    // 查找当前项已经添加的要素依据
    getCurrentItemPhysicalDiagnose() {
      let case_id = this.case_id;
      let frequency_id = sessionStorage.getItem("FrequencyId");
      let assist_id = this.assistcheckItemData.id;

      let params = {
        case_id,
        frequency_id,
        assist_id,
      };

      PostData("case/getAssistDiagnose", params).then((res) => {
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
    // 改变类别，触发搜索
    changeAssistCheckType(val) {
      this.first_id = val[0];
      this.getAssistCheckList();
    },
    openCustomizeAssistModal() {
      this.$refs.refCustomizeAssist.customizeAssist = true;
    },
    // 添加模板列表项
    addTable() {
      this.assisTable.push({
        abbreviation: "",
        name: "",
        refvalue: "",
        units: "",
        value: "",
      });
    },
    // 删除模板列表项
    deleteTable(index) {
      let { abbreviation, name, refvalue, units, value } = this.assisTable[
        index
      ];
      if (abbreviation || name || refvalue || units || value)
        this.$Modal.confirm({
          title: "提示",
          content: "确认删除该项内容",
          onOk: () => {
            this.assisTable.splice(index, 1);
          },
        });
      else this.assisTable.splice(index, 1);
    },
    // 整理分级标题
    _formateCurrentEditAssistCheckItemLevelTitle(item) {
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
      this.currentEditAssistCheckItemLevelTitle = levelTitle;
    },
  },
};
</script>

<style lang="less" scoped>
.editAssistWrapper {
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
  .upload-mold {
    margin-top: 10px;
    .mold-head {
      display: flex;

      .mold-head-content {
        background: #f0f0f7;
        border: 1px solid #c8ccdd;
        height: 36px;
        line-height: 36px;
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #474c63;
        text-align: center;
        margin-right: -1px;
      }
    }

    .mold-content {
      position: relative;

      &:hover {
        .content-img {
          display: inline-block;
        }
      }

      .content-img {
        display: none;
        height: 14px;
        width: 14px;
        position: absolute;
        z-index: 1;
        top: 50%;
        left: 2px;
        transform: translateY(-50%);
        cursor: pointer;
      }

      .content-edit {
        border: 1px solid #c8ccdd;
        text-align: center;
        height: 36px;
        line-height: 36px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #474c63;
        margin-right: -1px;
        margin-top: -1px;
        overflow: hidden;

        /deep/ .ivu-input {
          border: none;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;

          &:focus {
            overflow-y: visible;
          }
        }

        &:focus {
          outline: none;
        }
      }
    }
  }
  .tables {
    margin: 0 5px;
  }
  .assis-table-no {
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .btn-box {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
  }
  /deep/.ivu-table-cell {
    font-size: 14px !important;
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