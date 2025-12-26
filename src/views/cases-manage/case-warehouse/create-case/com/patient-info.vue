<template>
  <div class="patientInfo case-content-summarize">
    <Form
      ref="formValidate"
      class="case-form"
      :model="formInline"
      :rules="ruleValidate"
    >
      <div
        v-if="isCheck"
        style="
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 38px;
          z-index: 1;
        "
        class="aaa"
      ></div>
      <FormItem>
        <div class="case-title">
          <span>患者信息</span>
          <div class="case-line"></div>
        </div>
      </FormItem>
      <FormItem
        label="姓名"
        style="display: inline-block; width: 49%"
        prop="patient_name"
      >
        <Input
          class="case-name"
          style="width: 262px"
          type="text"
          v-model="formInline.patient_name"
          :disabled="isCheck"
          placeholder="患者姓名"
        />
        <span class="case-name-hint" @click="createName">自动生成</span>
      </FormItem>
      <FormItem
        label="年龄"
        style="display: inline-block; width: 49%; position: relative"
        prop="patient_age"
      >
        <InputNumber
          class="case-name"
          style="width: 262px !important"
          :min="0"
          :disabled="isCheck"
          v-model="formInline.patient_age"
        />
        <Select
          style="width: 74px; position: absolute; right: 0; top: 0"
          :disabled="isCheck"
          v-model="formInline.patient_time_type"
        >
          <Option value="岁">岁</Option>
          <Option value="月">月</Option>
          <Option value="月">周</Option>
          <Option value="日">日</Option>
        </Select>
      </FormItem>
      <FormItem
        label="性别"
        style="display: inline-block; width: 49%"
        prop="patient_gender"
      >
        <Select
          style="width: 262px"
          :disabled="isCheck"
          @on-change="setSex"
          v-model="formInline.patient_gender"
          placeholder="患者性别"
        >
          <Option value="Male">男</Option>
          <Option value="Female">女</Option>
        </Select>
      </FormItem>
      <FormItem
        label="民族"
        style="display: inline-block; width: 49%"
        prop="patient_nation"
      >
        <Select
          style="width: 262px"
          :disabled="isCheck"
          v-model="formInline.patient_nation"
          placeholder="患者民族"
        >
          <Option
            v-for="(item, index) in nationList"
            :value="item.nation"
            :key="index"
            >{{ item.nation }}</Option
          >
        </Select>
      </FormItem>
      <FormItem
        label="婚否"
        style="display: inline-block; width: 49%"
        prop="patient_marital_status"
      >
        <Select
          style="width: 262px"
          :disabled="isCheck"
          v-model="formInline.patient_marital_status"
          placeholder="患者婚姻状态"
        >
          <Option value="未婚">未婚</Option>
          <Option value="已婚">已婚</Option>
          <Option value="离异">离异</Option>
        </Select>
      </FormItem>
      <FormItem
        v-if="formInline.patient_gender == 'Female'"
        label="生育情况"
        style="display: inline-block; width: 49%"
        prop="is_fertility"
      >
        <Select
          style="width: 262px"
          :disabled="isCheck"
          v-model="formInline.is_fertility"
          placeholder="患者生育情况"
        >
          <Option :value="0">未怀孕</Option>
          <Option :value="1">已怀孕</Option>
          <Option :value="2">产后</Option>
        </Select>
      </FormItem>
      <FormItem
        class="case-postpartum"
        v-if="formInline.is_fertility == 1 || formInline.is_fertility == 2"
        style="display: inline-block; width: 49%"
      >
        <template slot="label"
          ><span style="color: #ff3300; margin-right: 4px; line-height: 1"
            >*</span
          >{{ formInline.is_fertility == 1 ? "怀孕" : "产后" }}时间</template
        >
        <InputNumber
          class="case-name"
          style="width: 130px !important"
          type="text"
          :disabled="isCheck"
          v-model="formInline.postpartumWeeks"
        />
        <span class="case-postpartum-hint">周</span>
        <InputNumber
          class="case-name"
          style="width: 130px !important"
          type="text"
          :disabled="isCheck"
          v-model="formInline.postpartumDay"
        />
        <span class="case-postpartum-hint">天</span>
      </FormItem>
      <FormItem
        label="病情陈述人"
        style="display: inline-block; width: 49%"
        prop="medical_history_representor"
      >
        <Select
          style="width: 262px"
          :disabled="isCheck"
          v-model="formInline.medical_history_representor"
          placeholder="病情陈述人"
        >
          <Option value="本人">本人</Option>
          <Option value="家属">家属</Option>
        </Select>
      </FormItem>
      <FormItem
        label="职业"
        style="display: inline-block; width: 49%"
        prop="patient_occupation"
      >
        <Input
          class="case-name"
          style="width: 262px"
          type="text"
          :disabled="isCheck"
          v-model="formInline.patient_occupation"
          placeholder="患者本人职业"
        />
      </FormItem>
      <FormItem style="display: inline-block; width: 49%" />
      <FormItem label="主诉" prop="cardinal_symptom">
        <Input
          style="width: 644px"
          type="textarea"
          :disabled="isCheck"
          v-model="formInline.cardinal_symptom"
          placeholder="请输入患者主要病症"
        />
      </FormItem>
      <FormItem label="病情描述" prop="chief_complaint">
        <Input
          style="width: 644px"
          type="textarea"
          :disabled="isCheck"
          v-model="formInline.chief_complaint"
          placeholder="请输入患者对病情描述"
        />
      </FormItem>
      <FormItem class="case-btns">
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
      </FormItem>
    </Form>
    <div v-if="ageImgs" class="age-imgs">
      <img :src="ageImgs" class="img" />
    </div>
  </div>
</template>

<script>
const family_name = [
    "赵",
    "钱",
    "孙",
    "李",
    "周",
    "吴",
    "郑",
    "王",
    "冯",
    "陈",
    "褚",
    "卫",
    "蒋",
    "沈",
    "韩",
    "杨",
    "朱",
    "秦",
    "尤",
    "许",
    "何",
    "吕",
    "施",
    "张",
    "孔",
    "曹",
    "严",
    "华",
    "金",
    "魏",
    "陶",
    "姜",
    "戚",
    "谢",
    "邹",
    "喻",
    "柏",
    "水",
    "窦",
    "章",
    "云",
    "苏",
    "潘",
    "葛",
    "奚",
    "范",
    "彭",
    "郎",
    "鲁",
    "韦",
    "昌",
    "马",
    "苗",
    "凤",
    "花",
    "方",
    "俞",
    "任",
    "袁",
    "柳",
    "酆",
    "鲍",
    "史",
    "唐",
    "费",
    "廉",
    "岑",
    "薛",
    "雷",
    "贺",
    "倪",
    "汤",
    "滕",
    "殷",
    "罗",
    "毕",
    "郝",
    "邬",
    "安",
    "常",
    "乐",
    "于",
    "时",
    "傅",
    "皮",
    "卞",
    "齐",
    "康",
    "伍",
    "余",
    "元",
    "卜",
    "顾",
    "孟",
    "平",
    "黄",
    "和",
    "穆",
    "萧",
    "尹",
  ],
  givenNames = [
    "子璇",
    "淼",
    "国栋",
    "夫子",
    "瑞堂",
    "甜",
    "敏",
    "尚",
    "国贤",
    "贺祥",
    "晨涛",
    "昊轩",
    "易轩",
    "益辰",
    "益帆",
    "益冉",
    "瑾春",
    "瑾昆",
    "春齐",
    "杨",
    "文昊",
    "东东",
    "雄霖",
    "浩晨",
    "熙涵",
    "溶溶",
    "冰枫",
    "欣欣",
    "宜豪",
    "欣慧",
    "建政",
    "美欣",
    "淑慧",
    "文轩",
    "文杰",
    "欣源",
    "忠林",
    "榕润",
    "欣汝",
    "慧嘉",
    "新建",
    "建林",
    "亦菲",
    "林",
    "冰洁",
    "佳欣",
    "涵涵",
    "禹辰",
    "淳美",
    "泽惠",
    "伟洋",
    "涵越",
    "润丽",
    "翔",
    "淑华",
    "晶莹",
    "凌晶",
    "苒溪",
    "雨涵",
    "嘉怡",
    "佳毅",
    "子辰",
    "佳琪",
    "紫轩",
    "瑞辰",
    "昕蕊",
    "萌",
    "明远",
    "欣宜",
    "泽远",
    "欣怡",
    "佳怡",
    "佳惠",
    "晨茜",
    "晨璐",
    "运昊",
    "汝鑫",
    "淑君",
    "晶滢",
    "润莎",
    "榕汕",
    "佳钰",
    "佳玉",
    "晓庆",
    "一鸣",
    "语晨",
    "添池",
    "添昊",
    "雨泽",
    "雅晗",
    "雅涵",
    "清妍",
    "诗悦",
    "嘉乐",
    "晨涵",
    "天赫",
    "玥傲",
    "佳昊",
    "天昊",
    "萌萌",
    "若萌",
  ],
  ageImgfemaxle = [
    "http://sfile.9mededu.com/mtt/avatar/婴儿女.jpg",
    "http://sfile.9mededu.com/mtt/avatar/儿童女.jpg",
    "http://sfile.9mededu.com/mtt/avatar/青年女.jpg",
    "http://sfile.9mededu.com/mtt/avatar/中年女.jpg",
    "http://sfile.9mededu.com/mtt/avatar/老奶奶.jpg",
  ],
  ageImgMaxle = [
    "http://sfile.9mededu.com/mtt/avatar/婴儿男.jpg",
    "http://sfile.9mededu.com/mtt/avatar/儿童男.jpg",
    "http://sfile.9mededu.com/mtt/avatar/青年男.jpg",
    "http://sfile.9mededu.com/mtt/avatar/中年男.jpg",
    "http://sfile.9mededu.com/mtt/avatar/老爷爷.jpg",
  ];
export default {
  name: "patientInfo",
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
  data() {
    return {
      nationList: [],
      family_name, // 姓氏
      givenNames, // 名字
      ageImgfemaxle, // 女图片
      ageImgMaxle, // 男图片
      formInline: {
        patient_name: "",
        patient_nation: "",
        patient_age: 0,
        patient_gender: "",
        patient_marital_status: "",
        is_fertility: "",
        medical_history_representor: "",
        patient_occupation: "",
        cardinal_symptom: "",
        chief_complaint: "",
        patient_time_type: "岁",
        postpartumWeeks: 0,
        postpartumDay: 0,
      },
      ruleValidate: {
        patient_name: [
          { required: true, message: "请输入患者姓名", trigger: "blur" },
        ],
        patient_nation: [
          { required: true, message: "请输入患者民族", trigger: "blur" },
        ],
        patient_age: [{ required: true, message: "请输入患者年龄" }],
        patient_gender: [
          { required: true, message: "请选择患者性别", trigger: "change" },
        ],
        patient_marital_status: [
          { required: true, message: "请选择患者婚姻状态", trigger: "change" },
        ],
        is_fertility: [{ required: true, message: "请选择患者生育情况" }],
        medical_history_representor: [
          { required: true, message: "请选择病情陈述人", trigger: "change" },
        ],
        patient_occupation: [
          { required: true, message: "请输入患者职业", trigger: ["blur","change"] },
        ],
        cardinal_symptom: [
          { required: true, message: "请输入主要病症", trigger: ["blur","change"] },
        ],
        chief_complaint: [
          { required: true, message: "请输入主要病症", trigger: ["blur","change"] },
        ],
      },
    };
  },
  computed: {
    ageImgs() {
      let d =
        this.formInline.patient_gender == "Male"
          ? this.ageImgMaxle
          : this.formInline.patient_gender == "Female"
          ? this.ageImgfemaxle
          : null;
      if (d) {
        let year = { 岁: 1, 月: 12, 周: 52, 日: 365 };
        let num = year[this.formInline.patient_time_type];
        let sort = Number.parseInt(this.formInline.patient_age / num);
        let ageType = (d, n, m, sort, i) => {
          return n <= sort <= m ? d[i] : "";
        };
        if (sort < 6) return ageType(d, 0, 5, sort, 0);
        else if (sort < 16) return ageType(d, 6, 15, sort, 1);
        else if (sort < 26) return ageType(d, 16, 25, sort, 2);
        else if (sort < 51) return ageType(d, 26, 50, sort, 3);
        else if (sort > 50) return ageType(d, 50, 300, sort, 4);
      }
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.case_id = +sessionStorage.getItem("CASEID");;
      this.getNationList();
    },
    // 上一步
    handleLast() {
      this.$emit("preStep");
    },
    // 下一步,保存成功后进入到下一步
    handleNext(){
      this.savePatientInfo()
    },
    // 自动生成名字
    createName() {
      let i = parseInt(Math.random() * 100);
      let j = parseInt(Math.random() * 100);
      this.formInline.patient_name = this.family_name[i] + this.givenNames[j];
    },
    // 设置性别
    setSex(val) {
      if (val == "Female") {
        this.formInline.is_fertility = 0;
      }
      this.formInline.patient_marital_status = "未婚";
      this.formInline.medical_history_representor = "本人";
    },
    // 获取民族列表
    getNationList() {
      PostData("common/getNations").then((r) => {
        if (r && r.data) this.nationList = r.data;
      });
    },
    // 保存患者概述 实际上是调用 modify,对当前进行的修改
    savePatientInfo(){
      let params = this.formInline
       PostData("case/modifyCase",params).then(res => {
         if(res.res_code === 1) {
           this.$emit("nextStep");
         }
       })
    }
  },
  watch: {
    caseData: {
      handler(newVal, oldVal) {
        if (Object.keys(newVal).length != 0) {
          let _newVal = JSON.parse(JSON.stringify(newVal));
          this.formInline = Object.assign(this.formInline, _newVal);
          this.formInline.patient_age = Number(this.formInline.patient_age)
        }
      },
      immediate: true,
    },
  },
};
</script>

<style scoped lang="less">
@import url("./patient-info.less");
</style>