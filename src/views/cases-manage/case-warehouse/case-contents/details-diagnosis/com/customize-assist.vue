<template>
  <div>
    <!-- 自定义查体 -->
    <Modal v-model="customizeAssist" title="自定义辅检" :width="900">
      <Form ref="formInline" :label-width="80">
        <Row>
          <Col span="8">
            <FormItem label="辅检类别">
              <Select v-model="customizeAssistForm.first_id" style="width:200px">
                <Option
                  v-for="item in customizeAssistTypeList"
                  :value="item.id"
                  :key="item.id"
                >{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="适用性别">
              <Select v-model="customizeAssistForm.gender" style="width:200px">
                <Option v-for="item in selectSex" :value="item.id" :key="item.id">{{ item.title }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="适用年龄">
              <Select v-model="customizeAssistForm.age_state" style="width:200px">
                <Option v-for="item in selectAge" :value="item.id" :key="item.id">{{ item.title }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <FormItem label="辅检名称">
          <Input v-model="customizeAssistForm.item_name" type="text" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="检查结果">
          <RadioGroup v-model="checkResultType" @on-change="checkResultTypeChange">
            <Radio :label="checkResultTypeArr[0]">文字</Radio>
            <Radio :label="checkResultTypeArr[1]">模板</Radio>
            <Radio :label="checkResultTypeArr[2]">文件</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label v-if="checkResultType == checkResultTypeArr[0]">
          <Input
            v-model="customizeAssistForm.result_text"
            type="textarea"
            :rows="4"
            placeholder="请输入..."
          />
        </FormItem>
        <FormItem label v-if="checkResultType == checkResultTypeArr[1]">
          <div class="upload-mold">
            <div class="mold-head">
              <div
                class="mold-head-content"
                v-for="(item, index) in mold_head"
                :key="index"
                :style="{'width': item.width}"
              >{{item.title}}</div>
            </div>
            <div
              v-for="(item, index) in customizeAssistForm.reports"
              class="mold-content"
              :key="index"
            >
              <img class="content-img" :src="deleteImg" alt @click="deleteTable(index)" />
              <div style="display: flex;">
                <Input
                  v-model="item[item1.model]"
                  v-for="(item1, index1) in mold_head"
                  :key="index1"
                  class="content-edit"
                  :style="{'width': item1.width, 'padding-left': item1.model == 'name' ? '10px' : ''}"
                  autocomplete="off"
                >
                  <!--                                <Icon v-if="item1.model == 'value'" type="ios-arrow-round-up" slot="suffix" color="#f00"/>-->
                </Input>
              </div>
            </div>
            <div class="btn-box">
              <Button class="modal-add-btn" @click="addTable">添加模块列表</Button>
            </div>
          </div>
        </FormItem>
        <FormItem label v-if="checkResultType == checkResultTypeArr[2]">
          <upload-btn
            text="上传文件"
            class="content-btn-up"
            bucket="jhyl-static-file"
            type="image/jpeg,image/png,image/jpg,video/mp4,video/mov,audio/mpeg,.doc,.docx, "
            @uploadcomplete="uploadType"
            :maxFileSize="300"
            :dir="'mtt/Data/main/Cases/' + fileDir + '/DefaultPhysicalExaminationResult'"
          />
          <span style="color:red">支持jpg/png图片、mp3音频、mp4/mov/avi视频，且大小不超过300M，只能上传多个同类型文件</span>
          <div
            class="upload-list"
            v-for="(item, index) in customizeAssistForm.files"
            :key="index"
          >
            <div style="display: flex; align-items: center">
              <img
                :src="splitFile(item.report, 'img')"
                alt
                style="height: 18px;width: 16px;"
              />
              <div class="upload-list-content">{{item.name}}</div>
            </div>
            <Icon @click="deleteUpload(index)" type="ios-close" size="20" style="cursor: pointer" />
          </div>
        </FormItem>
      </Form>
      <div slot="footer" style="display:flex;justify-content:space-between">
        <p style="aline-self:flex-start;color:red">*添加到辅检库后，请重新搜索并选择</p>
        <div style="display:flex;flex-direction:row-reverse">
          <Button type="primary" @click="add">添加</Button>
          <Button style="margin-right:10px" @click="cancel">取消</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import postData from "src/api/postData";
import UploadBtn from "../../../../../../components/UploadButton";
import audioImg from "../../../../../../assets/img/templater/audio.png";
import pictureImg from "../../../../../../assets/img/templater/picture.png";
import videoImg from "../../../../../../assets/img/templater/video.png";
import deleteImg from "../../../../../../assets/img/templater/delete.png";
const checkResultTypeArr = [1, 2, 3]; // 1 文字 2 模板 3 文件
const checkResultTypeDefault = "None";
export default {
  name: "",
  props: {
    caseId: {
      type: Object,
    },
  },
  data() {
    return {
      audioImg,
      pictureImg,
      videoImg,
      deleteImg,
      customizeAssist: false, // 自定义查体弹窗
      customizeAssistTypeList: [], // 类型列表
      selectSex: [
        { id: "Common", title: "通用" },
        { id: "Male", title: "男" },
        { id: "Female", title: "女" },
      ],
      selectAge: [
        { id: 0, title: "通用" },
        { id: 1, title: "婴幼儿(0-6岁)" },
        { id: 2, title: "少儿(7-15岁)" },
        { id: 3, title: "青年(16-35岁)" },
        { id: 4, title: "中年(36-60岁)" },
        { id: 5, title: "老年(61-99岁)" },
      ],
      mold_head: [
        { title: "项目", width: "240px", model: "name" },
        { title: "缩写", width: "90px", model: "abbreviation" },
        { title: "检查结果", width: "150px", model: "value" },
        { title: "参考值", width: "150px", model: "refvalue" },
        { title: "单位", width: "74px", model: "units" },
      ],
      fileDir:
        JSON.parse(sessionStorage.getItem("CaseContentMsg")).symptom || "",
      checkResultTypeArr: checkResultTypeArr,
      checkResultType: checkResultTypeArr[0],
      customizeAssistForm: {
        first_id: "",
        item_name: "",
        result_text: "",
        age_state: 0,
        gender: "Common",
        files: [],
        reports: [],
        type: checkResultTypeDefault
      },
    };
  },
  components: {
    UploadBtn,
  },
  methods: {
    uploadType(val) {
      console.log(val)
      this.customizeAssistForm.files.push({
        report: val.url.split("Cases/")[1],
        name:val.name,
        type: this.opinionCategory(
          val.url.split(".")[val.url.split(".").length - 1]
        ),
      });
    },
    opinionCategory(val) {
      switch (val) {
        case "jpg":
        case "png":
          return "Picture";
        case "mp4":
        case "mov":
        case "avi":
          return "Video";
        case "mp3":
          return "Audio";
        case "doc":
        case "docx":
          return "Word";
        default:
          return "None";
      }
    },
    splitFile(name, type) {
      let file = {
        Picture: this.pictureImg,
        Video: this.videoImg,
        Audio: this.audioImg,
      };
      if (type == "name") return name.split("/")[name.split("/").length - 1];
      else {
        let file_type = this.opinionCategory(
          name.split(".")[name.split(".").length - 1]
        );
        return file[file_type];
      }
    },
    deleteUpload(index) {
      this.customizeAssistForm.files.splice(index, 1);
      this.$forceUpdate();
    },
    addTable() {
      this.customizeAssistForm.reports.push({
        abbreviation: "",
        name: "",
        refvalue: "",
        units: "",
        value: "",
      });
    },
    deleteTable(index) {
      let {
        abbreviation,
        name,
        refvalue,
        units,
        value,
      } = this.customizeAssistForm.reports[index];
      if (abbreviation || name || refvalue || units || value)
        this.$Modal.confirm({
          title: "提示",
          content: "确认删除该项内容",
          onOk: () => {
            this.customizeAssistForm.reports.splice(index, 1);
          },
        });
      else this.customizeAssistForm.reports.splice(index, 1);
    },
    checkResultTypeChange(type) {
      switch (type) {
        case checkResultTypeArr[0]:
          this.customizeAssistForm.type = "None";
          this.customizeAssistForm.file = {};
          this.customizeAssistForm.reports = [];
          break;
        case checkResultTypeArr[1]:
          this.customizeAssistForm.type = "ExaminationReport";
          this.customizeAssistForm.result_text = "";
          this.customizeAssistForm.file = [];
          break;
        case checkResultTypeArr[2]:
          this.customizeAssistForm.type = "ImageData";
          this.customizeAssistForm.result_text = "";
          this.customizeAssistForm.reports = [];
          break;
        default:
          break;
      }
    },
    clear() {
      this.customizeAssistForm = {
        first_id: "",
        item_name: "",
        result_text: "",
        age_state: "",
        gender: 0,
        files: [],
        reports: [],
        type: checkResultTypeDefault,
      };
    },
    add() {
      let params = JSON.parse(JSON.stringify(this.customizeAssistForm));
      // 自定义添加体检
      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          const element = params[key];
          if (element === "") {
            delete params[key];
          }
        }
      }

      postData("case/addCustomAssist", params).then((res) => {
        if (res.res_code == 1) {
          this.clear();
          this.customizeAssist = false;
          this.$Message.success(res.msg);
        } else {
          this.$Message.error("添加失败");
        }
      });
    },
    cancel() {
      this.clear();
      this.customizeAssist = false;
    },
  },
  mounted() {
    postData("/v1/common/getAssistantCategory", { ...this.caseId,parent_id:0 }).then((res) => {
      this.customizeAssistTypeList = res.data;
    });
  },
};
</script>

<style lang="less" scoped>
.upload-list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 310px;
  height: 30px;
  margin-top: 10px;
  background: rgba(240, 240, 247, 0.5);
  border: 1px solid rgba(175, 179, 201, 0.5);
  padding: 0 10px;

  &:hover {
    background: #f3f8ff;
    border: 1px solid #bddbff;
  }

  .upload-list-content {
    width: 200px;
    overflow: hidden;
    margin-left: 10px;
    white-space: nowrap;
    text-overflow: ellipsis;
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
</style>