<template>
  <div class="case-info case-form">
    <div class="case-title">
      <span>病例信息</span>
      <div class="case-line"></div>
    </div>
    <Form
      ref="formValidate"
      class="case-form"
      :model="formInline"
      label-position="right"
      :rules="ruleValidate"
    >
      <FormItem label="病例名称" prop="symptom">
        <Input
          style="width: 664px"
          type="text"
          v-model="formInline.symptom"
          :disabled="isCheck"
          placeholder="填写主要病症（15字以内）"
        />
      </FormItem>
      <FormItem
        label="首要专科"
        style="display: inline-block; width: 50%"
        prop="patient_division"
      >
        <Select
          style="width: 278px"
          v-model="formInline.patient_division"
          :disabled="isCheck"
        >
          <Option
            v-for="(item, index) in patient_list"
            :key="index"
            :value="item.patient_division"
            >{{ item.patient_division }}</Option
          >
        </Select>
      </FormItem>
      <FormItem
        label="难度设置"
        style="display: inline-block; width: 49%"
        prop="degree"
      >
        <Select
          style="width: 278px"
          v-model="formInline.degree"
          :disabled="isCheck"
        >
          <Option
            v-for="(item, index) in degree_list"
            :value="item.id"
            :key="index"
            >{{ item.title }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="引用提纲" prop="outline_id">
        <div style="display: flex">
          <Button
            style="width: 200px"
            :style="{ color: formInline.outline_id ? '#4098ff' : '#657180' }"
            :disabled="isCheck"
            @click="openOutlineModal"
            >{{
              formInline.outline_id ? formInline.outlineName : "选择提纲"
            }}</Button
          >
        </div>
      </FormItem>
      <FormItem label="强制解读" prop="force_unscramble">
        <RadioGroup
          v-model="formInline.force_unscramble"
          style="margin-left: 20px"
        >
          <Radio
            v-for="(item, index) in force_unscramble_list"
            :key="index"
            :disabled="isCheck"
            :label="item.id"
            >{{ item.title }}</Radio
          >
        </RadioGroup>
      </FormItem>
      <FormItem
        v-if="formInline.force_unscramble === 1"
        prop="force_unscramble_content"
        style="margin-left: 112px"
      >
        <CheckboxGroup
          v-model="formInline.force_unscramble_content"
          class="checkout-group"
        >
          <Checkbox
            v-for="(item, index) in force_unscramble_content_list"
            :label="item.id"
            :key="index"
            :disabled="isCheck"
            >{{ item.title }}</Checkbox
          >
        </CheckboxGroup>
      </FormItem>
      <FormItem label="复诊配置" prop="rediagnosis">
        <RadioGroup v-model="formInline.rediagnosis" style="margin-left: 20px">
          <Radio
            v-for="(item, index) in rediagnosis_list"
            :key="index"
            :label="item.id"
            :disabled="isCheck"
            >{{ item.title }}</Radio
          >
        </RadioGroup>
      </FormItem>
      <FormItem v-if="formInline.rediagnosis === 1">
        <div class="case-end">
          <div class="case-end-box">
            <div>问诊结束</div>
            <InputNumber
              class="box-input-number"
              :disabled="isCheck"
              v-model="case_talk"
              :max="100"
              :min="0"
            />
            <div>次</div>
          </div>
          <div class="case-end-box">
            <div>体检结束</div>
            <InputNumber
              class="box-input-number"
              v-model="case_physical"
              :disabled="isCheck"
              :max="100"
              :min="0"
            />
            <div>次</div>
          </div>
          <div class="case-end-box">
            <div>辅检结束</div>
            <InputNumber
              class="box-input-number"
              v-model="case_assist"
              :disabled="isCheck"
              :max="100"
              :min="0"
            />
            <div>次</div>
          </div>
          <div class="case-end-box" style="margin-right: 0">
            <div>处置结束</div>
            <InputNumber
              class="box-input-number"
              v-model="case_handle"
              :disabled="isCheck"
              :max="100"
              :min="0"
            />
            <div>次</div>
          </div>
        </div>
      </FormItem>
      <FormItem label="病例摘要" prop="abstract">
        <Input
          style="width: 664px"
          type="textarea"
          v-model="formInline.abstract"
          :disabled="isCheck"
          placeholder="简述病例的主要内容以及注意事项（限最多500字）"
        />
      </FormItem>
      <FormItem label="学习目的" prop="study_purpose">
        <Input
          style="width: 664px"
          type="textarea"
          v-model="formInline.study_purpose"
          :disabled="isCheck"
          placeholder="简述病例需要学生掌握知识点，以及诊疗方案"
        />
      </FormItem>
      <FormItem class="case-btns">
        <Button
          class="case-btn"
          v-if="!isCheck"
          @click="handleSubmitCaseInfo(false)"
          type="primary"
          >下一步</Button
        >
      </FormItem>
    </Form>
    <outlineModal
      @outline-cancel="closeOutlineModal"
      :isShow="isShowOutlineModal"
      @outline_submit="outlineSubmit"
    />
  </div>
</template>

<script>
// 组件
import outlineModal from "./components/outline";
//难度
const degree_list = [
    { id: 1, title: "简单" },
    { id: 2, title: "适中" },
    { id: 3, title: "困难" },
  ], // 解读方式
  force_unscramble_list = [
    { id: 0, title: "不强制解读" },
    { id: 1, title: "自定义解读" },
  ], // 自定义解读
  force_unscramble_content_list = [
    { id: 1, title: "问诊结束" },
    { id: 2, title: "体格检查结束" },
    { id: 3, title: "辅助检查结束" },
  ], // 复诊配置
  rediagnosis_list = [
    { id: 0, title: "不可复诊" },
    { id: 1, title: "自定义配置" },
  ];

export default {
  name: "caseInfo",
  props: {
    isCheck: {
      type: Boolean,
      default: false,
    },
    caseData: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  components: {
    outlineModal,
  },
  data() {
    return {
      // 状态
      isShowOutlineModal: false, //是否显示提纲预览弹窗
      // 数据
      degree_list,
      force_unscramble_list,
      force_unscramble_content_list,
      rediagnosis_list,
      patient_list: [], //专科列表
      case_talk: 0, // 问诊结束次数
      case_physical: 0, // 体检结束次数
      case_assist: 0, //辅检结束次数
      case_handle: 0, //处置结束次数
      // 表单数据
      formInline: {
        symptom: "",
        patient_division: "",
        degree: "",
        outline_id: "",
        force_unscramble: "",
        force_unscramble_content: [],
        rediagnosis: "",
        abstract: "",
        study_purpose: "",
      },
      // 表单验证规则
      ruleValidate: {
        symptom: [
          {
            required: true,
            message: "最多输入15字",
            trigger: "blur",
            max: 15,
          },
        ],
        patient_division: [
          { required: true, message: "请选择首要专科", trigger: "change" },
        ],
        degree: [
          {
            required: true,
            message: "请设置病例难度",
            trigger: "change",
            type: "number",
          },
        ],
        outline_id: [{ required: true, message: "请选择引用框架" }],
        force_unscramble: [
          {
            required: true,
            type: "number",
            message: "请选择是否解读",
            trigger: "change",
          },
        ],
        force_unscramble_content: [
          { required: true, message: "请选择解读选项" },
        ],
        rediagnosis: [
          {
            required: true,
            type: "number",
            message: "请选择复诊配置",
            trigger: "change",
          },
        ],
        abstract: [
          { required: true, message: "请输入病例摘要", trigger: "blur" },
        ],
        study_purpose: [
          { required: true, message: "请输入学习目的", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.case_id = +sessionStorage.getItem("CASEID");
      this.getPatientList();
    },
    // 打开选择提纲
    openOutlineModal() {
      this.isShowOutlineModal = true;
    },
    // 取消选择提纲
    closeOutlineModal() {
      this.isShowOutlineModal = false;
    },
    // 选择提纲回调
    outlineSubmit(val) {
      this.isShowOutlineModal = false;
      this.formInline.outlineName = val.symptom;
      this.formInline.outline_id = val.id;
    },
    // 获取专科列表
    getPatientList() {
      PostData("common/getDepts").then((r) => {
        if (r && r.data) this.patient_list = r.data;
      });
    },
    // 提交病例信息
    handleSubmitCaseInfo() {
      let params = JSON.parse(JSON.stringify(this.formInline));
      if (this.formInline.rediagnosis === 1) {
        params.rediagnosis_content = JSON.stringify({
          talk: this.case_talk,
          physical: this.case_physical,
          assist: this.case_assist,
          handle: this.case_handle,
        });
      }
      params.force_unscramble_content = JSON.stringify(
        params.force_unscramble_content
      );
      // 有病例id 调用修改
      if (this.case_id) {
        this.modifyCurrentCase(params);
      } else {
        this.createNewCase(params);
      }
    },
    // 新增病例
    createNewCase(params) {
      PostData("case/addCase", params).then((res) => {
        if (res.res_code === 1) {
          // let path = this.$route.path;
          let id = res.data.id;
          sessionStorage.setItem('CASEID',id)
          this.$emit("nextStep",id);
        }
      });
    },
    // 修改病例
    modifyCurrentCase(params) {
      this.$emit("nextStep");
      PostData("case/modifyCase", params).then((res) => {
        console.log(res, "rrr");
      });
    },
  },
  watch: {
    caseData: {
      handler(newVal, oldVal) {
        if (Object.keys(newVal).length != 0) {
          let _newVal = JSON.parse(JSON.stringify(newVal));
          _newVal.force_unscramble_content = JSON.parse(
            _newVal.force_unscramble_content
          );
          // 拿到自定义配置数据
          let rediagnosis_content = JSON.parse(_newVal.rediagnosis_content);
          if (
            rediagnosis_content &&
            Array.isArray(rediagnosis_content) &&
            rediagnosis_content.length > 0
          ) {
            let { talk, physical, assist, handle } = rediagnosis_content;
            this.case_talk = talk;
            this.case_physical = physical;
            this.case_assist = assist;
            this.case_handle = handle;
          }

          this.formInline = Object.assign(this.formInline, _newVal);
          // 拿到提纲
          this.formInline.outlineName = _newVal.outlines[0].symptom;
          this.formInline.outline_id = _newVal.outlines[0].outline_id;
        }
      },
      immediate: true,
    },
  },
};
</script>

<style scoped lang="less">
@import url("./case-info.less");
</style>