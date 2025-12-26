<template>
  <div>
    <div class="file-type">
      {{tip}}
    </div>
    <div class="right-content-btn">
      <div style="width: 300px">
        <div
          v-for="(item, index) in upload_file"
          @click="seeMediaFile(item, fileType)"
          :key="index"
          class="file_item"
        >
          <img class="media-img" :src="mediaImg[fileType]" />
          <div class="upload-name">{{ item.media_name }}</div>
          <Icon
            color="#4098FF"
            v-if="!isCheck"
            class="upload-delete"
            @click.stop="deleteUpload(index)"
            type="ios-close"
            size="20"
          />
        </div>
      </div>
      <upload-btn
        text="上传文件"
        class="content-btn-up"
        bucket="jhyl-static-file"
        type="image/jpeg,image/png,image/jpg,video/mp4,video/mov,audio/mpeg "
        @uploadcomplete="uploadImg"
        :maxFileSize="300"
        :dir="
          'mtt/Data/main/Cases/' +
          fileDir +
          `/${typeDir}/` +
          thirdName
        "
      />
    </div>
  </div>
</template>

<script>
// 静态资源
import deleteImg from "../../../../../../assets/img/templater/delete.png";
import wordImg from "../../../../../../assets/img/templater/word.png";
import audioImg from "../../../../../../assets/img/templater/audio.png";
import videoImg from "../../../../../../assets/img/templater/video.png";
import pictureImg from "../../../../../../assets/img/templater/picture.png";
// 配置
const imgs = ["jpeg", "jpg", "png"];
const videos = ["mp4", "mov", "avi"];
const IMG_TYPE_NAME = "Picture";
const VIDEO_TYPE_NAME = "Video";
const AUDIO_TYPE_NAME = "Audio";
// 组件
import uploadBtn from "../../../../../../components/UploadButton";
export default {
  name: "fileUpload",
  props: {
    isCheck: {
      type: Boolean,
      default: false,
    },
    fileOriginType:{
      type:String,
      default:"None"
    },
    fileList:{
      type:Array,
      default:function(){
        return []
      }
    },
    tip:{
      type:String,
      default:""
    },
    typeDir:{
      type:String,
      default:""
    }
  },
  data() {
    return {
      upload_file: this.fileList,
      fileDir:
        JSON.parse(sessionStorage.getItem("CaseContentMsg")).symptom || "",
      thirdName: "",
      fileType: this.fileOriginType,
      mediaImg: {
        Picture: pictureImg,
        Video: videoImg,
        Audio: audioImg,
      },
    };
  },
  components: {
    uploadBtn,
  },
  mounted() {},
  methods: {
    uploadImg(val) {
      let url = val.url;
      let splitArr = val.url.split(".");
      let fileSuffix = splitArr[splitArr.length - 1];
      val.type = imgs.includes(fileSuffix)
        ? IMG_TYPE_NAME
        : videos.includes(fileSuffix)
        ? VIDEO_TYPE_NAME
        : AUDIO_TYPE_NAME;
      if (this.fileType) {
        if (this.fileType == val.type || this.fileType =='None') this.setUploadImg(val);
        else this.$Message.info("只能上传多个同类型文件！");
      } else this.setUploadImg(val);
    },
    setUploadImg(val) {
      this.fileType = val.type;
      let arr = val.resultName.split("/");
      this.upload_file.push({
        media_name: val.name,
        result_media_url: arr.splice(4, arr.length).join("/"),
      });
    },
    seeMediaFile() {},
    deleteUpload(index) {
      this.$config.deleteModal(() => {
        this.upload_file.splice(index, 1);
      });
    },
  },
  watch:{
    fileList:{
      handler:function(newVal,oldVal){
        this.upload_file = newVal
      },
      immediate:true
    },
    fileOriginType:{
      handler:function(newVal,oldVal){
        this.fileType = newVal
      },
      immediate:true
    }
  }
};
</script>

<style lang="less" scoped>
.file-type {
  margin: 8px 0;
  font-family: PingFangSC-Regular;
  font-size: 10px;
  color: #a4a9c0;
  text-align: left;
}
.right-content-btn {
  display: flex;
  justify-content: space-between;
  .content-btn-up {
    background-color: #fff;
    width: 96px;
    height: 30px;
  }
  .content-btn-read {
    margin-right: 20px;
    color: #4098ff;
    height: 30px;
  }
  .file_item {
    width: 280px;
    display: flex;
    align-items: center;
    margin-right: 30px;
    justify-content: space-between;
    margin-bottom: 8px;
    background: #fff;
    border: 1px solid #4098ff;
    padding: 3px 10px;
    cursor: pointer;
    .upload-name {
      flex: 1;
      text-align: left;
      margin-left: 10px;
      overflow: hidden;
      color: #4098ff;
    }
    .media-img {
      width: 14px;
      height: 16px;
    }
  }
}
</style>