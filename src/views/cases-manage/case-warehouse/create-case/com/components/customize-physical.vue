<template>
  <div>
    <!-- 自定义查体 -->
    <Modal v-model="customizePhysical" title="自定义查体" :width="900">
      <Form ref="formInline" :label-width="80">
        <Row>
          <Col span="8">
            <FormItem label="查体类别">
              <Select v-model="customizePhysicalForm.first_id" style="width:200px">
                <Option
                  v-for="item in customizePhysicalTypeList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="适用性别">
              <Select v-model="customizePhysicalForm.gender" style="width:200px">
                <Option v-for="item in selectSex" :value="item.id" :key="item.id">{{ item.title }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="适用年龄">
              <Select v-model="customizePhysicalForm.age_state" style="width:200px">
                <Option v-for="item in selectAge" :value="item.id" :key="item.id">{{ item.title }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <FormItem label="查体名称">
          <Input v-model="customizePhysicalForm.item_name" type="text" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="检查结果">
          <Input
            v-model="customizePhysicalForm.result_text"
            type="textarea"
            :rows="4"
            placeholder="请输入..."
          />
        </FormItem>
        <FormItem label>
          <upload-btn
            text="上传文件"
            class="content-btn-up"
            bucket="jhyl-static-file"
            type="image/jpeg,image/png,image/jpg,video/mp4,video/mov,audio/mpeg "
            @uploadcomplete="uploadType"
            :maxFileSize="300"
            :dir="'mtt/Data/main/Cases/' + fileDir + '/DefaultPhysicalExaminationResult'"
          />
          <span style="color:red">支持jpg/png图片、mp3音频、mp4/mov/avi视频，且大小不超过300M，只能上传多个同类型文件</span>
        </FormItem>
        <FormItem label>
          <div
            class="upload-list"
            v-for="(item, index) in customizePhysicalForm.result_media_urls"
            :key="index"
          >
            <div style="display: flex; align-items: center">
              <img
                :src="splitFile(item.result_media_url, 'img')"
                alt
                style="height: 18px;width: 16px;"
              />
              <div class="upload-list-content">{{splitFile(item.result_media_url, 'name')}}</div>
            </div>
            <Icon @click="deleteUpload(index)" type="ios-close" size="20" style="cursor: pointer" />
          </div>
        </FormItem>
      </Form>
      <div slot="footer" style="display:flex;justify-content:space-between">
        <p style="aline-self:flex-start;color:red">*添加到查体库后，请重新搜索并选择</p>
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
export default {
  name: "",
  props: {
    caseId: {
      type: Object,
    }
  },
  data() {
    return {
      audioImg,
      pictureImg,
      videoImg,
      customizePhysical: false, // 自定义查体弹窗
      customizePhysicalTypeList: [], // 类型列表
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
      fileDir:
        JSON.parse(sessionStorage.getItem("CaseContentMsg")).symptom || "",
      customizePhysicalForm: {
        first_id: "",
        age_state: "",
        gender: 0,
        item_name: "",
        result_media_urls: [],
        result_media_type: "None",
        result_text: "",
      },
    };
  },
  components: {
    UploadBtn,
  },
  methods: {
    uploadImg() {},
    uploadType(val) {
      console.log(val);
      this.customizePhysicalForm.result_media_urls.push({
        result_media_url: val.url.split("Cases/")[1],
      });
      this.customizePhysicalForm.result_media_type = this.opinionCategory(
        val.url.split(".")[val.url.split(".").length - 1]
      );
      console.log(
        this.opinionCategory(val.url.split(".")[val.url.split(".").length - 1])
      );
      // this.$forceUpdate();
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
      this.customizePhysicalForm.result_media_urls.splice(index, 1);
      this.$forceUpdate();
    },
    clear(){
      this.customizePhysicalForm = {
        first_id: "",
        age_state: "",
        gender: 0,
        item_name: "",
        result_media_urls: [],
        result_media_type: "None",
        result_text: "",
      }
    },
    add() {
      let params = JSON.parse(JSON.stringify(this.customizePhysicalForm));
      // 自定义添加体检
      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          const element = params[key];
          if (element === "") {
            delete params[key];
          }
        }
      }
      
      postData("case/addCustomPhysical", params).then((res) => {
        if(res.res_code == 1){
          this.clear()
          this.customizePhysical = false
          this.$Message.success(res.msg)
        }else{
          this.$Message.error("添加失败")
        }
      });
    },
    cancel() {
      this.clear()
      this.customizePhysical = false
    },
  },
  mounted() {
    postData("case/getPhysicalTreeByCaseId", { ...this.caseId }).then((res) => {
      this.customizePhysicalTypeList = res.data;
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
</style>