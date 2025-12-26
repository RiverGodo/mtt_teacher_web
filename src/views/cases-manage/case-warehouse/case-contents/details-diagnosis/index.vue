<template>
  <div class="diagnosis" id="content">
    <div class="dia-left">
      <div class="item item-1">
        <img :src="diagnosisImg" class="diagnosis-img" />
        <span class="item-title">诊疗详情</span>
      </div>
      <div class="main-seconds">
        <div
          @click="selSeconds(i, t)"
          v-for="(t, i) in seconds"
          :key="i"
          :class="t.active && t.num != 1 ? 'item-act' : ''"
          class="item item-2"
        >
          <img
            @click.stop="deletes(i, t)"
            v-if="i"
            :src="deletesImg"
            class="deletes-img"
          />
          <span
            :class="t.active ? 'item-title-act' : 'item-title-de'"
            class="item-title2"
            >第{{ t.num }}次诊疗</span
          >
        </div>
      </div>
      <div class="item-btn">
        <Button :disabled="isCheck" @click="add">+ 添加诊疗</Button>
      </div>
    </div>
    <div class="btns">
      <div>
        <Button
          @click="selType(t, i)"
          :class="t.active ? 'act-btn' : 'de-btn'"
          v-for="(t, i) in btns"
          :key="i"
          >{{ t.title }}</Button
        >
      </div>
    </div>
    <div class="main_right" style="flex: 1">
      <div class="main">
        <SceneDescription
          :diagnosisId="diagnosisId"
          page="0"
          v-if="page === 0"
        />
        <Interrogation :diagnosisId="diagnosisId" page="1" v-if="page == 1" />
        <PhysicalExam :diagnosisId="diagnosisId" page="2" v-if="page == 2" />
        <SupplementaryExam
          :diagnosisId="diagnosisId"
          page="3"
          v-if="page == 3"
        />
        <diagnosis :diagnosisId="diagnosisId" page="4" v-if="page == 4" />
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
          @click="handleNext(false)"
          type="primary"
          >下一步</Button
        >
      </div>
    </div>
  </div>
</template>
<script>
import Interrogation from "./com/Interrogation";
import PhysicalExam from "./com/physical-exam";
import SupplementaryExam from "./com/supplementary-exam";
import diagnosis from "./com/diagnosis";
import SceneDescription from "./com/scene-des";
import diagnosisImg from "../../../../../assets/img/case/diagnosis.png";
import deletesImg from "../../../../../assets/case/deletes.png";
import addImg from "../../../../../assets/case/add.png";

export default {
  components: {
    Interrogation,
    PhysicalExam,
    SupplementaryExam,
    diagnosis,
    SceneDescription,
  },
  data() {
    return {
      page: 0,
      diagnosisId: 0,
      diagnosisImg,
      deletesImg,
      addImg,
      case_id: +sessionStorage.getItem("CASEID"),
      btns: [
        { title: "场景描述", active: true },
        { title: "问诊", active: false },
        { title: "体格检查", active: false },
        { title: "辅助检查", active: false },
        { title: "防治与诊疗计划", active: false },
      ],
      activeSeconds: 1,
      seconds: [{ num: 1, active: true }],
    };
  },
  computed: {
    isCheck() {
      return Boolean(this.$route.query.isCheck) || false;
    },
  },
  mounted() {
    // this.saveData();
    $CasePreservation.$on("CasePreservation", this.preservation);
    this.getDiagnoseFrequency();
  },
  beforeDestroy() {
    $CasePreservation.$off("CasePreservation", this.preservation);
  },
  methods: {
    async setElements() {
      let ele = [],
        identify = [];
      await PostData("case/getElements", {
        type: "identify_element",
        case_id: this.case_id,
        frequency_id: sessionStorage.getItem("FrequencyId"),
      }).then((res) => {
        res.data.forEach((item) => {
          // item.code = item.id + '|' + sessionStorage.getItem('CASEID')
          item.code = item.id;
          item.title = item.element_name;
        });
        identify = res.data;
      });
      // console.log(identify)
      return [ele, identify];

      // let node = da.nodes;
      // let fillCol = ['#ECF5FF','#DFF5F7','#FFF2DE','#EBF8DB']
      // let fillCol2 = ['#F1E9FF']
      // let types = {
      //     '#ECF5FF': 'talk',
      //     '#DFF5F7': 'physical',
      //     '#FFF2DE': 'assist',
      //     '#EBF8DB': 'treat',
      //     // '#F9E6DB': 'disease',
      // }

      // if(node&&node.length>0){
      //     node.map((t) => {
      //         if(t.fill){
      //             if(fillCol2.includes(t.fill)&&t.label){
      //                 if(t.children.length>1){
      //                     t.children.map(it => {
      //                         identify.push({
      //                             code: it.id + '|' + sessionStorage.getItem('CASEID'),
      //                             title: it.label,
      //                         })
      //                     })
      //                 }else{
      //                     identify.push({
      //                         code: t.id + '|' + sessionStorage.getItem('CASEID'),
      //                         title: t.label,
      //                     })
      //                 }
      //             }
      //             if(fillCol.includes(t.fill)&&t.label){
      //                     if(t.children.length>1){
      //                     t.children.map(it => {
      //                         ele.push({
      //                             code: it.id + '|' + sessionStorage.getItem('CASEID'),
      //                             element_name: it.label,
      //                             type: types[t.fill]
      //                         })
      //                     })
      //                 }else{
      //                     ele.push({
      //                         code: t.id + '|' + sessionStorage.getItem('CASEID'),
      //                         element_name: t.label,
      //                         type: types[t.fill]
      //                     })
      //                 }
      //             }
      //         }
      //     })
      // }
    },
    saveIdentification(identify_elements = []) {
      if (identify_elements.length > 0) {
        PostData("case/saveIdentifyElement", {
          case_id: +sessionStorage.getItem("CASEID"),
          identify_elements,
        }).then((r) => {
          if (r.res_code)
            sessionStorage.setItem(
              "IdentifyElement",
              JSON.stringify(identify_elements)
            );
        });
      } else
        sessionStorage.setItem(
          "IdentifyElement",
          JSON.stringify(identify_elements)
        );
    },
    async setData(item, outline) {
      // const [ele , identify] = this.setElements()
      let identify = await this.setElements();
      this.saveIdentification(identify[1]);
      // PostData('case/saveCaseOutline', {elements: ele, ...outline})
      PostData("case/saveCaseOutline", { ...outline });
    },
    saveData() {
      PostData("case/getCaseDetailAndOutlines", {
        id: parseInt(sessionStorage.getItem("CASEID")),
      }).then((res) => {
        if (res.res_code == 1) {
          const ITEM = res.data.outlines[0].outline;
          if (ITEM) this.setData(JSON.parse(ITEM), res.data.outlines[0]);
        }
      });
    },
    getDiagnoseFrequency() {
      PostData("/v1/case/getExamineFrequency", { case_id: this.case_id }).then(
        (r) => {
          if (r.res_code == 1) {
            let d = [];
            if (r.data.list.length > 0) {
              this.diagnosisId = r.data.list[0].id;
              r.data.list.map((t, i) => {
                d.push({ num: i + 1, active: i ? false : true, ...t });
              });
              this.seconds = d;
            }
          }
        }
      );
    },
    selSeconds(i, t) {
      this.diagnosisId = t.id;
      this.activeSeconds = i + 1;
      this.seconds.map((t, l) => {
        t.active = l === i;
      });
      this.btns.map((it, k) => {
        it.active = k ? false : true;
      });
      this.page = 0;
    },
    deletes(i, t) {
      console.log(t);
      PostData("/v1/case/removeExamineFrequency", { case_id: this.case_id,frequency_index:t.frequency_index || t.id }).then((r) => {
        if (r.res_code == 1) {
          this.seconds.splice(i, 1);
          if (this.seconds.length == 1) {
            this.seconds[0].active = true;
          }
        }
      });
    },
    add() {
      PostData("/v1/case/addExamineFrequency", { case_id: this.case_id }).then(
        (r) => {
          if (r.res_code == 1) {
            let index = this.seconds.length;
            this.seconds.push({ num: index + 1, active: false, id: r.data.id });
          }
        }
      );
    },
    preservation(index) {
      if (index == 4) this.handleNext(true);
    },
    selType(t, i) {
      this.page = i;
      this.btns.map((it, l) => {
        if (l === i) it.active = true;
        else it.active = false;
      });
    },
    handleLast() {
      this.$emit("handleNavigate", 3);
      // 上一步定位到顶部
        let content = document.getElementById("content")
content.scrollIntoView()
    },
    hasContent(d) {
      let bool = true;
      d.map((t) => {
        if (t.frequency_id && t.usage_id) bool = bool && true;
        else bool = bool && false;
      });
      return bool;
    },
    // 获取病例所有解读
    getData(len, save) {
      this.isFinish(save);
      // PostData("/v1/case/getUnscramble", { case_id: this.case_id,type:1,case_examine_frequency_id:this.diagnosisId }).then(
      //   (r) => {
      //     if (r && r.res_code == 1) {
      //       // 根据 frequency_id 分组，区分第 n 次 诊疗
      //       console.log(this.seconds);
      //       let check_case_unscramble = true;
      //       let obj = {};
      //       this.seconds.forEach((item) => {
      //         obj[item.id] = [];
      //       });

      //       r.data.forEach((item) => {
      //         obj[item.frequency_id].push(item);
      //       });

      //       for (const key in obj) {
      //         if (obj.hasOwnProperty(key)) {
      //           const element = obj[key];
      //           if (element.length != len) {
      //             this.$Message.info(`请完善解读分析！`);
      //             check_case_unscramble = false;
      //             break;
      //           }
      //         }
      //       }
      //       if (check_case_unscramble) {
      //         this.isFinish(save);
      //       }
      //     }
      //   }
      // );
    },
    isFinish(save) {
      // PostData("case/getListByType", {
      //   type: "medicine",
      //   case_id: +sessionStorage.getItem("CASEID"),
      // }).then((r) => {
      //   if (r.res_code == 1) {
      //     if (r.data && r.data.length > 0) {
      //       if (this.hasContent(r.data)) this.$emit("handleNavigate", 5);
      //       else this.$Message.info("请完善药品的内容！");
      //     } else {
            if (!save) this.$emit("handleNavigate", 5);
            this.$Message.success("保存成功");
      //     }
      //   }
      // });
    },
    async checkScenceDesc() {
      this.scenceDesc = true;
      await PostData("v1/case/getScenceDesc", { case_examine_frequency_id: this.diagnosisId }).then(
        (res) => {
          if (res.res_code == 1) {
            if (!res.data.scence_desc) {
              this.scenceDesc = false;
              this.$Message.info("请完善场景描述！");
            }
          }
        }
      );
    },
    async handleNext(save) {
      // 下一步定位到顶部
        let content = document.getElementById("content")
content.scrollIntoView()
      // 请求场景是否已填写
      // let scenceDesc = true

      await this.checkScenceDesc();
      if (!this.scenceDesc) {
        return;
      }
      let d = JSON.parse(sessionStorage.getItem("CaseContentMsg"));
      console.log(d);
      let da = Array.isArray(d.force_unscramble_content) ? d.force_unscramble_content : JSON.parse(d.force_unscramble_content);
      if (+d.force_unscramble && da && da.length > 0) {
        this.getData(da.length, save);
      } else this.isFinish(save);
    },
  },
};
</script>
<style lang="less" scoped>
.diagnosis {
  // width: 100%;
  height: 100%;
  display: flex;
}
.deletes-img {
  width: 20px;
  height: 20px;
  position: absolute;
  left: 11px;
  display: none;
}
.dia-left {
  width: 142px;
  background-color: rgba(51, 55, 68, 1);
  height: 100%;
  position: relative;
  margin-left: auto;
  .main-seconds {
    width: 142px;
    height: 561px;
    overflow-y: auto;
  }
  .item {
    display: flex;
    align-items: center;
    height: 51px;
    width: 100%;
    // border-bottom: 1px solid #d7dde4;
  }
  .item-1 {
    padding-left: 11px;
    background-color: #000;
    .diagnosis-img {
      width: 20px;
      height: 20px;
      margin-right: 11px;
    }
    .item-title {
      font-weight: 400;
      font-style: normal;
      font-size: 16px;
      color: #cccccc;
    }
  }
  .item-2 {
    justify-content: center;
    .item-title2 {
      font-weight: 700;
      font-style: normal;
      font-size: 14px;
      cursor: pointer;
    }
    .item-title-act {
      color: #ffffff;
    }
    &:hover .deletes-img {
      display: block;
    }
  }
  .item-act {
    background-color: #000;
  }
  .item-de {
    color: #cccccc;
  }
  .item-btn {
    position: absolute;
    bottom: 10px;
    left: 15px;
    box-shadow: none !important;
  }
}
.btn {
  width: 142px;
  height: 51px;
  // margin-bottom: 15px;
  font-size: 18px;
  // border: none;
  border: 1px solid rgba(228, 228, 228, 1);
  border-radius: 0;
}
.main_right{
  position: relative;
}
.main {
  height: 100%;
  display: flex;
  flex-direction: row;
  // overflow: hidden;
}
.btns {
  width: 142px;
  height: 100%;
  background-color: #f0f0f7;
  .act-btn {
    .btn;
    // background-color:#4098FF;
    color: #4098ff;
    background-color: #fff;
    box-shadow: none;
    // box-shadow: 0 0 5px 0 rgba(64,152,255,0.40);
  }
  .de-btn {
    .btn;
    background-color: #f0f0f7;
    color: #9397ad;
    box-shadow: none;
  }
  .case-types {
    display: flex;
    flex-direction: column;
    align-items: center;
    .actvie-btn {
      width: 142px;
      height: 51px;
      background-color: #666;
      color: #fff;
      box-shadow: none !important;
      border: 1px solid #000;
      border-radius: 0;
      position: relative;
      &:hover .deletes-img {
        display: block;
      }
      .img-postion {
        top: 16px;
      }
      .icons {
        position: absolute;
        right: 11px;
        top: 16px;
      }
    }
    .btn {
      width: 107px;
      height: 35px;
      margin-top: 15px;
      color: #333333;
      border-radius: 5px;
      font-size: 14px !important;
      box-shadow: none !important;
      .add-img {
        width: 15px;
        height: 15px;
        position: relative;
        top: 2px;
      }
    }
  }
}
.case-btn-box {
  display: flex;
  margin-top: 15px;
  margin-bottom: 10px;
  justify-content: center;
  // position: absolute;
  // bottom: 50px;
  // left: 0;
  // right: 0;
  // margin: auto;
  .case-btn-last {
    width: 150px;
    height: 38px;
    background-color: #fff;
    color: #4098ff;
  }

  .case-btn {
    width: 150px;
    height: 38px;
    margin-left: 20px;
  }
}
</style>
