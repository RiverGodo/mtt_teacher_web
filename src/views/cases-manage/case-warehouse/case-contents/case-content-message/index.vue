<template>
  <div id="content">
    <Form
      ref="formValidate"
      class="case-form"
      :model="formInline"
      label-position="right"
      :rules="ruleValidate"
    >
      <div
        v-if="isCheck"
        style="position: absolute;left: 0;right: 0;top: 0;bottom: 38px;z-index: 1">
        </div>
      <FormItem>
        <div class="case-title">
          <span>病例信息</span>
          <div class="case-line"></div>
        </div>
      </FormItem>
      <FormItem label="病例名称" prop="symptom">
        <Input
          style="width: 664px;"
          type="text"
          v-model="formInline.symptom"
          placeholder="填写主要病症（15字以内）"
        />
      </FormItem>
      <FormItem label="首要专科" style="display: inline-block; width: 50%;" prop="patient_division">
        <Select @on-change="selectChangeDefault" style="width: 278px;" v-model="formInline.patient_division">
          <Option
            v-for="(item, index) in patient_list"
            :key="index"
            :value="item.id"
          >{{item.title}}</Option>
        </Select>
      </FormItem>
      <FormItem label="难度设置" style="display: inline-block; width: 49%;" prop="degree">
        <Select  style="width: 278px;" v-model="formInline.degree">
          <Option v-for="(item, index) in degree_list" :value="item.id" :key="index">{{item.title}}</Option>
        </Select>
      </FormItem>
      <FormItem label="引用提纲" prop="outline_ids">
        <!--                <Select style="width: 664px;" v-model="formInline.outline_ids" placeholder="选择框架" filterable>-->
        <!--                    <Option v-for="(item, index) in symptom_list" :key="index" :value="item.id">{{item.symptom}}</Option>-->
        <!--                </Select>-->
        <div style="display: flex">
          <Button
            style="width: 200px;"
            :style="{color: formInline.outline_ids ? '#4098ff' : '#657180'}"
            @click="handleOutline"
            :disabled="formInline.outline_ids ? true : false"
          >{{formInline.outline_ids ? formInline.outlineName : '选择提纲'}}</Button>
          <!--                    <span v-if="formInline.outline_ids" style="margin-left: 8px">{{outlineName}}</span>-->
        </div>
      </FormItem>
      <FormItem label="强制解读" prop="force_unscramble">
        <RadioGroup v-model="formInline.force_unscramble" style="margin-left: 20px;">
          <Radio
            v-for="(item, index) in force_unscramble_list"
            :key="index"
            :label="item.id"
          >{{item.title}}</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem
        v-if="formInline.force_unscramble === '1'"
        prop="force_unscramble_content"
        style="margin-left: 112px;"
      >
        <CheckboxGroup v-model="formInline.force_unscramble_content" class="checkout-group">
          <Checkbox
            v-for="(item, index) in force_unscramble_content_list"
            :label="item.id"
            :key="index"
          >{{item.title}}</Checkbox>
        </CheckboxGroup>
      </FormItem>
      <!-- <FormItem label="复诊配置" prop="rediagnosis">
        <RadioGroup v-model="formInline.rediagnosis" style="margin-left: 20px;">
          <Radio
            v-for="(item, index) in rediagnosis_list"
            :key="index"
            :label="item.id"
          >{{item.title}}</Radio>
        </RadioGroup>
      </FormItem> -->
      <FormItem v-if="formInline.rediagnosis === '1'">
        <div class="case-end">
          <div class="case-end-box">
            <div>问诊结束</div>
            <InputNumber class="box-input-number" v-model="case_talk" :max="100" :min="0"></InputNumber>
            <div>次</div>
          </div>
          <div class="case-end-box">
            <div>体检结束</div>
            <InputNumber class="box-input-number" v-model="case_physical" :max="100" :min="0"></InputNumber>
            <div>次</div>
          </div>
          <div class="case-end-box">
            <div>辅检结束</div>
            <InputNumber class="box-input-number" v-model="case_assist" :max="100" :min="0"></InputNumber>
            <div>次</div>
          </div>
          <div class="case-end-box" style="margin-right: 0;">
            <div>处置结束</div>
            <InputNumber class="box-input-number" v-model="case_handle" :max="100" :min="0"></InputNumber>
            <div>次</div>
          </div>
        </div>
      </FormItem>
      <FormItem label="病例摘要" prop="abstract">
        <Input
          style="width: 664px;"
          type="textarea"
          v-model="formInline.abstract"
          placeholder="简述病例的主要内容以及注意事项（限最多500字）"
        />
      </FormItem>
      <FormItem label="学习目的" prop="study_purpose">
        <Input
          style="width: 664px;"
          type="textarea"
          v-model="formInline.study_purpose"
          placeholder="简述病例需要学生掌握知识点，以及诊疗方案"
        />
      </FormItem>
      <FormItem class="case-btns">
          <Button class="case-btn" v-if="!isCheck" @click="handleSubmit(false)" type="primary">
            下一步
          </Button>
          
      </FormItem>
      
    </Form>
    <outlineModal @outline-cancel="outlineCancel" ref="defaultSelect" :isShow="isShow" @outline_submit="outlineSubmit" />
  </div>
</template>

<script>
import outlineModal from "./components/outline";

export default {
  components: { outlineModal },
  data() {
    return {
      formInline: {
        symptom: "",
        patient_division: "",
        degree: "",
        outline_ids: "",
        force_unscramble: "",
        force_unscramble_content: [],
        rediagnosis: "",
        abstract: "",
        study_purpose: ""
      },
      ruleValidate: {
        symptom: [
          {
            required: true,
            message: "最多输入15字",
            trigger: "blur",
            max: 15
          }
        ],
        patient_division: [
          { required: true, message: "请选择首要专科" }
        ],
        degree: [
          {
            required: true,
            message: "请设置病例难度",
            trigger: "change",
            type: "number"
          }
        ],
        outline_ids: [{ required: true, message: "请选择引用框架" }],
        force_unscramble: [
          { required: true, message: "请选择是否解读", trigger: "change" }
        ],
        force_unscramble_content: [
          { required: true, message: "请选择解读选项" }
        ],
        rediagnosis: [
          { required: true, message: "请选择复诊配置", trigger: "change" }
        ],
        abstract: [
          { required: true, message: "请输入病例摘要", trigger: "blur" }
        ],
        study_purpose: [
          { required: true, message: "请输入学习目的", trigger: "blur" }
        ]
      },
      symptom_list: [],
      patient_list: [],
      degree_list: [
        { id: 1, title: "简单" },
        { id: 2, title: "适中" },
        { id: 3, title: "困难" }
      ],
      force_unscramble_list: [
        { id: "0", title: "不强制解读" },
        { id: "1", title: "自定义解读" }
      ],
      force_unscramble_content_list: [
        { id: "1", title: "问诊结束" },
        { id: "2", title: "体格检查结束" },
        { id: "3", title: "辅助检查结束" }
      ],
      rediagnosis_list: [
        { id: "0", title: "不可复诊" },
        { id: "1", title: "自定义配置" }
      ],
      case_talk: 0,
      case_physical: 0,
      case_assist: 0,
      case_handle: 0,
      isCheck: false,
      isShow: false,
      outlineName: ""
    };
  },
  methods: {
    outlineCancel() {
      this.isShow = false;
    },
    handleOutline() {
      this.isShow = true;
    },
    outlineSubmit(val) {
      this.isShow = false;
      this.outlineName = val.symptom;
      this.formInline.outlineName = val.symptom;
      this.formInline.outline_ids = val.id;
    },
    setSubminType(type){
      switch (type) {
        case "talk":
          return 1
        break;
        case "physical":
          return 2
        break;
        case "assist":
          return 3
        break;
        case "treat":
          return 4
        break;
        case "identify_element":
          return 5
        break;
        case "gather":
          return 6
        break;
      }
    },
    addCase(d, save) {
      console.log(this.patient_list);
      d.dept_id = d.dept_name
      this.patient_list.forEach(element => {
        if (element.id == d.dept_id) {
          d.dept_name = element.title
        }
      });
      let url = sessionStorage.getItem("CASEID")
        ? "/v1/case/modifyCaseInfo"
        : "/v1/case/addCaseInfo";
      PostData(url, d).then(r => {
        if (r.res_code == 1) {
          this.$Message.success("保存成功");
          if (url == "/v1/case/addCaseInfo")
            sessionStorage.setItem("CASEID", r.data.case_id);
          if (!save) this.$emit("handleNavigate", 2);
        }
      });
    },
    handleSubmit(save) {
      let data = this.formInline;
      if (this.formInline.rediagnosis === "1")
        data.rediagnosis_content = JSON.stringify({
          talk: this.case_talk,
          physical: this.case_physical,
          assist: this.case_assist,
          handle: this.case_handle
        });
      this.$refs.formValidate.validate(valid => {

        if (valid) {
          let out = null;
          // console.log(this.symptom_list);
          this.symptom_list.map(t => {
            if (t.id == this.formInline.outline_ids) {
              out = t;
            }
          });
          sessionStorage.setItem("CaseContentMsg",JSON.stringify(this.formInline));
          // let url = type ? 'case/modifyCase' : 'case/addCase'
          // let d = this.formInline
          let d = this.$config.copy(this.formInline);
          d.dept_name = d.patient_division;
          d.outline_id = d.outline_ids;
          d.force_unscramble = d.force_unscramble + "";
          d.rediagnosis = +d.rediagnosis;
          this.patient_list.forEach(element => {
            if (element.title == d.patient_division) {
              d.dept_id = element.id
            }
          });
          d.question_type = 1
          d.force_unscramble_content = JSON.stringify(
            d.force_unscramble_content
          );
          let da1 = {};
          if (sessionStorage.getItem("CASEID")) {
            let date = JSON.parse(sessionStorage.getItem("CaseContentSum"));
            da1 = { ...date, ...d };
            da1.id = +sessionStorage.getItem("CASEID");
            da1.case_id = +sessionStorage.getItem("CASEID");
          } else da1 = d;
          // console.log(out);
          if (out) {
            sessionStorage.setItem("ACTIVEOUTLINE", JSON.stringify(out));
            // 每次清空 elements，防止多次合并对象
            da1.elements = []
            PostData("/v1/outline/getoutlineDetail",{id:out.id}).then(res => {
              if (res.res_code == 1) {
                let formate_data = this.formateIllnessAndElementsFromOutline(res.data);
                console.log(formate_data);
                this.addCase(Object.assign(da1, formate_data), save);
              }
            })
          }else{
            this.addCase(da1, save);
          } 
        }
        // 下一步定位到顶部
        let content = document.getElementById("content")
content.scrollIntoView()
      });
    },
    submitData(d) {
      let url =
        this.$route.query && this.$route.query.id
          ? "/v1/case/modifyCaseInfo"
          : "/v1/case/addCaseInfo";
      PostData(url, d).then(res => {
        console.log(res, "rrr");
      });
    },
    getSel() {
      PostData("/v1/common/getDeptList").then(r => {
        if (r && r.data) this.patient_list = r.data;
      });
      PostData("/v1/outline/getOutlineList", {
        page_num: 1,
        page_size: 99999,
        organization_id: this.$config.getOrganizationId() == "" ? null : this.$config.getOrganizationId()
      }).then(r => {
        if (r && r.data) this.symptom_list = r.data.list;
      });
    },
    setFormInline(d) {
      // console.log(d);
      this.formInline = d;
      this.formInline.outline_ids = d.outline_id;
      this.formInline.force_unscramble = d.force_unscramble + "";
      this.formInline.rediagnosis = d.rediagnosis + "";
      this.formInline.patient_division = d.dept_name
      if (d.rediagnosis_content && d.rediagnosis_content.includes("{")) {
        let { talk, physical, assist, handle } = JSON.parse(
          d.rediagnosis_content
        );
        this.case_talk = +talk;
        this.case_physical = +physical;
        this.case_assist = +assist;
        this.case_handle = +handle;
      }
      this.formInline.force_unscramble_content = JSON.parse(
        d.force_unscramble_content
      );
      if (d.patient_division) {
        this.selectChangeDefault(d.patient_division)
      }
    },
    getData(case_id) {
      PostData("case/getTreatDisposition", { case_id }).then(r => {
        if (r && r.res_code == 1) {
          sessionStorage.setItem("CaseTreatment", r.data && r.data.id);
        }
      });
    },
    getFormData() {
      if (this.$route.query && this.$route.query.id) {
        PostData("/v1/case/getCaseInfo", {
          case_id: parseInt(this.$route.query.id)
        }).then(res => {
          // console.log(res);
          if (res.res_code == 1) {
            sessionStorage.setItem("CaseContentMsg", JSON.stringify(res.data));
            // sessionStorage.setItem("ACTIVEOUTLINE", JSON.stringify(res.data.outlines[0]));
            sessionStorage.setItem("CaseContentSum", JSON.stringify(res.data));
            // console.log("wsq");
            // sessionStorage.setItem("CASEID", res.data.id);
            this.setFormInline(res.data);
            this.getData(parseInt(this.$route.query.id));
            // this.outlineName = res.data.outlines[0].symptom;
            // this.formInline.outlineName = res.data.outlines[0].symptom;
          }
        });
      } else {
        if (sessionStorage.getItem("CaseContentMsg")) {
          let d = JSON.parse(sessionStorage.getItem("CaseContentMsg"));
          this.formInline = d;
          // console.log(JSON.stringify(d))
          // this.formInline.outline_ids = d.outline_id
        }
      }
    },
    preservation(index) {
      if (index == 1) this.handleSubmit(true);
    },
    // 从题纲拿到病种信息
    formateIllnessAndElementsFromOutline(data) {
      // console.log(JSON.parse(data.outline));
      let nodes = JSON.parse(data.outline).nodes
      // console.log(nodes);
      let elements = [], illness = [];
      // console.log(nodes,"wsq");
      nodes.forEach(node => {
        if (node.mark_id > 0) {
          // 处理集合节点
          if (node.node_type == "gather") {
            if (node.children && node.children.length > 0) {
              node.children.forEach(shape => {
                elements.push({
                    parent_node_id: node.id,
                    parent_node_name:node.true_label || node.label,
                    child_shape_id: shape.child_shape_id ? shape.child_shape_id : "0",
                    element_id: shape.child_shape_id ? shape.child_shape_id : "0",
                    element_name: shape.true_label,
                    type: node.mark_id == 5 ? 6 : this.setSubminType(node.mark_type)
                  });
              });
            }
          }
          // 处理一般节点
          else {
            elements.push({
                parent_node_id: node.id,
                parent_node_name: node.true_label || node.label,
                child_shape_id: "0",
                element_id: node.id,
                child_shape_id: node.child_shape_id ? node.child_shape_id : "0",
                element_name: node.true_label || node.label,
                type: node.mark_id == 5 ? 6 : this.setSubminType(node.mark_type)
              });
          }
        }
      });
      return {
        elements: elements,
        illness: illness
      };
    },
    changeTypeData(type){
      switch (type) {
        case "talk":
          return 1
        break;
        case "physical":
          return 2
        break;
        case "assist":
          return 3
        break;
        case "identify_element":
          return 4
        break;
        case "treat":
          return 5
        break;
        case "gather":
          return 6
        break;
      }
    },
    selectChangeDefault(value){
      this.$refs.defaultSelect.selectChange3(value)
    }
  },
  beforeDestroy() {
    $CasePreservation.$off("CasePreservation", this.preservation);
  },
  mounted() {
    this.getSel();
    this.getFormData();
    $CasePreservation.$on("CasePreservation", this.preservation);
    this.isCheck = this.$route.query ? this.$route.query.isCheck : false;
  }
};
</script>

<style scoped lang="less">
.case-btns {
  margin-bottom: 10px !important;
}
/deep/ .ivu-form-item-label {
  font-family: PingFangSC-Regular;
  font-size: 16px !important;
  color: #474c63 !important;
  letter-spacing: 0.93px !important;
  text-align: right;
}
/deep/ .ivu-form-item-content {
  text-align: left;
}
/deep/ .ivu-input,
/deep/ .ivu-input-number,
/deep/ .ivu-radio-wrapper,
/deep/ .ivu-checkbox-wrapper {
  border-radius: 4px !important;
  font-family: PingFangSC-Regular !important;
  font-size: 16px !important;
  color: #474c63 !important;
  letter-spacing: 0.93px !important;
}
/deep/ .ivu-select-placeholder {
  font-family: PingFangSC-Regular;
  font-size: 16px !important;
  color: #9397ad;
  letter-spacing: 0.93px;
}
/deep/ .ivu-radio-inner,
/deep/ .ivu-checkbox-inner {
  width: 16px;
  height: 16px;
}
/deep/ .ivu-radio-inner:after {
  left: 2px;
  top: 2px;
}
/deep/ .ivu-checkbox-inner:after {
  left: 5px;
  top: 3px;
}
/deep/ .ivu-radio-wrapper,
/deep/ .ivu-checkbox-wrapper {
  margin-right: 30px;
}
/deep/ .ivu-input-number-handler-wrap {
  display: none;
}
/deep/ .ivu-form-item-error-tip {
  left: 90px;
}
/deep/ textarea.ivu-input {
  height: 110px;
}
.case-form {
  width: 760px;
  position: relative;
  padding-bottom: 80px;
  .case-title {
    font-family: PingFangSC-Regular;
    font-size: 24px;
    color: #a4a9c0;
    letter-spacing: 1.4px;
    text-align: center;
    position: relative;
  }
  .case-name {
    /deep/ .ivu-input {
      padding-right: 80px !important;
    }
  }
  .case-name-hint {
    position: absolute;
    left: 236px;
    fine-height: 36px;
    font-size: 13px;
    color: #4098ff;
    cursor: pointer;
  }
  .case-line {
    opacity: 0.1;
    background: #4098ff;
    width: 108px;
    height: 8px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 22px;
  }
  .age-year {
    width: 100px;
    position: relative;
    display: flex;
    align-items: center;

    /deep/ .ivu-input-number {
      border-radius: 4px 0 0 4px !important;
    }
  }
  .age-month {
    width: 100px;
    position: relative;
    display: flex;
    align-items: center;

    /deep/ .ivu-input-number {
      border-radius: 0 !important;
      border-left: 0;
      border-right: 0;
    }
  }
  .age-day {
    width: 100px;
    position: relative;
    display: flex;
    align-items: center;

    /deep/ .ivu-input-number {
      border-radius: 0 4px 4px 0 !important;
    }
  }
  .age-hint {
    width: 0;
    position: absolute;
    left: 76px;
    font-size: 16px;
    color: #474c63;
  }
  .case-end {
    display: flex;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #474c63;
    letter-spacing: 0.93px;
    margin-left: 112px;

    /deep/ .ivu-input-number-input {
      text-align: center;
    }

    .case-end-box {
      display: flex;
      margin-right: 20px;

      .box-input-number {
        width: 50px !important;
        margin: 0 5px;
      }
    }
  }
  .case-btn {
    width: 150px;
    height: 38px;
    margin: 40px auto 0 auto;
  }
}
</style>
