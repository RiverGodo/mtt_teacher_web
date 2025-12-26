<template>
  <div style="height: 100%;">
    <div class="case-header">
      <div class="case-header-left">
        <div class="case-header-back" @click="handleBack">
          <img src="../../../../assets/img/case/case_back.png" alt />
          <div class="back-font">返回</div>
        </div>
        <div class="case-header-title">绘制提纲</div>
        <div class="case-header-btn">
          <img
            @click="hugeZoom"
            class="header-btn-img"
            src="../../../../assets/img/case/case_huge.png"
            alt
          />
          <img
            @click="littleZoom"
            class="header-btn-img"
            src="../../../../assets/img/case/case_little.png"
            alt
          />
          <img
            @click="changeStep(-1)"
            class="header-btn-img"
            src="../../../../assets/img/case/case_behind.png"
            alt
          />
          <img
            @click="changeStep(1)"
            class="header-btn-img"
            src="../../../../assets/img/case/case_front.png"
            alt
          />
        </div>
        <!-- <div class="case-header-title case-header-btn">
          <Switch v-model="auto_layout" @on-change="toggleAutoLayout" />&nbsp;&nbsp;
          <span v-if="auto_layout">开启</span>
          <span v-else>关闭</span>对齐
        </div>-->
      </div>
      <!-- @click="handleCursor(item, index)" -->
      <div class="case-header-type">
        <div v-for="(item, index) in case_type" :key="index" class="type-box" v-if="index != 3">
          <div class="type-box-color" :style="{backgroundColor: item.color}"></div>
          <div class="type-box-font">{{item.title}}</div>
        </div>
        <div style="display: flex;align-items: center; margin-left: 30px;">
          <Button
            v-if="showSave"
            @click="handleSubmit"
            class="save-btn-save"
          >{{caseTypeName == 'check' ? '复制提纲' : '保存草稿'}}</Button>
          <Button
            @click="handleCommit"
            type="primary"
            class="save-btn"
          >{{caseTypeName == 'check' ? '新建提纲' : '提交审核'}}</Button>
        </div>
      </div>
    </div>
    <outline ref="outline" :canedit="caseTypeName == 'check' ?false :true" />
  </div>
</template>

<script>
import outline from "components/outlines";
import mouse_img1 from "assets/img/case/1.png";
import mouse_img2 from "assets/img/case/2.png";
import mouse_img3 from "assets/img/case/3.png";
import mouse_img4 from "assets/img/case/4.png";
import mouse_img5 from "assets/img/case/6.png";
import mouse_img6 from "assets/img/case/5.png";
import audioPlay from "assets/img/case/audioPlay.png";
import audioPause from "assets/img/case/audioPause.png";
import add_content from "assets/img/case/addContent.png";
import key_explain from "assets/img/case/keyExplain.png";
import explain_outline from "assets/img/case/explain_outline.png";
import postData from "../../../../api/postData";

export default {
  components: { outline },
  data() {
    return {
      mouse_img1,
      mouse_img2,
      mouse_img3,
      mouse_img4,
      mouse_img5,
      mouse_img6,
      audioPlay,
      audioPause,
      add_content,
      key_explain,
      explain_outline,
      caseTypeName: "",
      case_type: [
        {
          color: "rgb(128,185,252)",
          fill_color: "rgba(128,185,252,0.1)",
          stroke_color: "rgb(128,185,252)",
          title: "问诊",
          short_title: "问诊"
        },
        {
          color: "rgb(96,207,215)",
          fill_color: "rgba(96,207,215,0.1)",
          stroke_color: "rgb(96,207,215)",
          title: "体格检查",
          short_title: "体检"
        },
        {
          color: "rgb(255,127,218)",
          fill_color: "rgba(255,127,218,0.1)",
          stroke_color: "rgb(255,127,218)",
          title: "辅助检查",
          short_title: "辅检"
        },
        {
          color: "rgb(178,131,255)",
          fill_color: "rgba(178,131,255,0.1)",
          stroke_color: "rgb(178,131,255)",
          title: "诊断",
          short_title: "诊断"
        },
        {
          color: "rgb(156,226,96)",
          fill_color: "rgba(156,226,96,0.1)",
          stroke_color: "rgb(156,226,96)",
          title: "治疗",
          short_title: "治疗"
        },
        {
          color: "rgb(255,174,39)",
          fill_color: "rgba(255,174,39,0.1)",
          stroke_color: "rgb(255,174,39)",
          title: "鉴别要素",
          short_title: "鉴别要素"
        },
        {
          color: "rgb(244,118,118)",
          fill_color: "rgba(244,118,118,0.1)",
          stroke_color: "rgb(244,118,118)",
          title: "病种",
          short_title: "病种"
        }
      ],
      showSave: true,
      menuObj: {
        editEdge: "able",
        edit: "able",
        editGather: "able",
        add: "able",
        line: "able",
        copy: "able",
        explain: "able",
        sign: "able",
        delete: "able",
        deleteGather: "able",
        result: "able"
      },
      symptom: "新建病症",
      icd10_ids: [],
      icd10_names: [],
      degree: "2",
      auto_layout: true
    };
  },
  methods: {
    handleBack() {
      if (sessionStorage.getItem("caseType") == "check")
        this.$Modal.confirm({
          title: "提示",
          content: "请确认返回上一层",
          onOk: () => {
            this.$router.go(-1);
          }
        });
      else this.$router.go(-1);
    },
    // handleCursor(item, index) {
    //   if (index == 5) return;
    //   let imgList = {
    //     0: this.mouse_img1,
    //     1: this.mouse_img2,
    //     2: this.mouse_img3,
    //     3: this.mouse_img4,
    //     4: this.mouse_img5,
    //     5: this.mouse_img6
    //   };
    //   let img = imgList[index];
    //   document.querySelector(
    //     "#container"
    //   ).children[1].style.cursor = `url(${img}), progress `;
    //   this.signColor = { ...item, ...{ cursor: `url(${img}), progress` } };
    // },
    hugeZoom() {
      this.$refs.outline.graph.zoom(1.2);
    },
    littleZoom() {
      this.$refs.outline.graph.zoom(0.8);
    },
    // 前进，后退
    changeStep(step) {
      if(step === -1 ){
        let len = this.$refs.outline.redoList.length
        if(len){
          let curr = this.$refs.outline.redoList.pop()
          console.log(curr)
          curr.forEach(item => {
            if(item.operation == "add"){
              item.operation = "delete"
              console.log(1)
              this.$refs.outline.graph.removeItem(item.model.id)
            }
            else if(item.operation == "delete"){
              item.operation = "add"
              console.log(2)
              this.$refs.outline.graph.add(item.type,item.model)
            }
          })
          this.$refs.outline.undoList.push(curr)
        }
        // let len = this.$refs.outline.undoList.length
        // if(len){
        //   let curr = this.$refs.outline.undoList.pop()
        //   this.$refs.outline.redoList.push(curr)
        //   curr.forEach(item => {
        //     this.$refs.outline.graph.removeItem(item.model.id)
        //   })
        // }
      }else if(step === 1){
        let len = this.$refs.outline.undoList.length
        if(len){
          let curr = this.$refs.outline.undoList.pop()
          console.log(curr)
          curr.forEach(item => {
            if(item.operation == "add"){
              item.operation = "delete"
              console.log(1)
              this.$refs.outline.graph.removeItem(item.model.id)
            }
            else if(item.operation == "delete"){
              item.operation = "add"
              console.log(2)
              this.$refs.outline.graph.add(item.type,item.model)
            }
          })
          this.$refs.outline.redoList.push(curr)
        }
        // let len = this.$refs.outline.redoList.length
        // if(len){
        //   let curr = this.$refs.outline.redoList.pop()
        //   this.$refs.outline.undoList.push(curr)
        //   curr.forEach(item => {
        //     this.$refs.outline.graph.add(item.type,item.model)
        //   })
        // }
      }
    },
    // 复制，保存草稿
    handleSubmit() {
      this.$refs.outline.clearSelected();
      let outline = this.$refs.outline.graph.save();
      let icd10_names = [];
      outline.nodes.forEach(node => {
        if (node.mark_id > 0) {
          // 病种
          if (node.mark_id == 5) {
            if (node.node_type == "gather") {
              if (node.children && node.children.length > 0) {
                node.children.forEach(shape => {
                  icd10_names.push(shape.true_label);
                });
              }
            } else {
              icd10_names.push(node.label);
            }
          }
        }
      });
      let data = {
        outline: JSON.stringify(outline),
        symptom: outline.nodes[0].label,
        degree: parseInt(outline.nodes[0].degree),
        dept_id: JSON.parse(sessionStorage.getItem("caseOutline")).dept_id,
        desc: JSON.parse(sessionStorage.getItem("caseOutline")).desc,
      };

      if (this.caseTypeName == "check") {
        postData("/v1/outline/addOutline", { ...data, state: 0 }).then(res => {
          this.$Message.success("复制成功");
          if (res.res_code == 1) this.$router.go(-1);
        });
        return;
      }
      if (this.$route.query.id) {
        data.id = parseInt(this.$route.query.id);
         postData("/v1/outline/modifyOutline", { ...data, state: 0 }).then(res => {
          this.$Message.success(res.msg);
          if (res.res_code == 1) this.$router.go(-1);
        });
      } else {
         postData("/v1/outline/addOutline", { ...data, state: 0 }).then(res => {
          this.$Message.success(res.msg);
          if (res.res_code == 1) this.$router.go(-1);
        });
      }
    },
    // 新建，提审
    handleCommit() {
      // 清空节点选中状态
      this.$refs.outline.clearSelected();
      // 拿到节点数据
      let outline = this.$refs.outline.graph.save();
      let icd10_names = [];
      outline.nodes.forEach(node => {
        // node.tags = []
        // node.tags.push({
        //   type: 'key_points',
        //   label: "这是tips",
        //   files: [],
        // })
        if (node.mark_id > 0) {
          // 病种
          if (node.mark_id == 5) {
            if (node.node_type == "gather") {
              if (node.children && node.children.length > 0) {
                node.children.forEach(shape => {
                  icd10_names.push(shape.true_label);
                });
              }
            } else {
              icd10_names.push(node.label);
            }
          }
        }
      });
      // return
      let data = {
        outline: JSON.stringify(outline),
        symptom: outline.nodes[0].label,
        degree: parseInt(outline.nodes[0].degree),
        dept_id: JSON.parse(sessionStorage.getItem("caseOutline")).dept_id,
        desc: JSON.parse(sessionStorage.getItem("caseOutline")).desc,
      };
      if (this.caseTypeName == "check") {
        window.open(`/dashboard/outline-content`);
        return;
      }
      if (this.$route.query.id) {
        data.id = parseInt(this.$route.query.id);
        postData("/v1/outline/modifyOutline", { ...data, state: 1 }).then(res => {
          this.$Message.success(res.msg);
          if (res.res_code == 1) this.$router.go(-1);
        });
      } else {
        postData("/v1/outline/addOutline", { ...data, state: 1 }).then(res => {
          this.$Message.success(res.msg);
          if (res.res_code == 1) this.$router.go(-1);
        });
      }
    }
    // 切换自动布局
    // toggleAutoLayout(value) {
    //   sessionStorage.setItem("auto_layout", value ? 1 : 0);
    //   let graph = this.$refs.outline.graph;
    //   if (value) {
    //     let gather_ids = [];
    //     let y = 0;
    //     // Window.is_gather = false;
    //     // console.log(gather_ids)
    //     graph.updateLayout({
    //       type: "dagre",
    //       rankdir: "TB",
    //       nodesep: 50,
    //       ranksepFunc: d => {
    //         if (d.y != y) {
    //           y = d.y;
    //           if (Window.is_gather) {
    //             Window.is_gather = !Window.is_gather;
    //             return 100;
    //           }
    //         }
    //         // console.log(d.y)
    //         if (d.node_type == "gather") {
    //           Window.is_gather = true;
    //           // console.log("gather")
    //           // graph
    //           //   .findById(d.id)
    //           //   .getOutEdges()
    //           //   .forEach(edge => {
    //           //     gather_ids.push(edge.getTarget().get("id"));
    //           //   });
    //           // return 200;
    //         }
    //         // if (gather_ids.indexOf(d.id) != -1 && d.node_type!='gather') {
    //         //   console.log(d.id,200)
    //         //   return 200;
    //         // }
    //         // console.log(d.id,20)
    //         return 0;
    //       }
    //     });
    //   } else {
    //     graph.updateLayout("origin-layout");
    //   }
    // }
  },
  mounted() {
    let data = JSON.parse(sessionStorage.getItem("caseOutline"));
    this.caseTypeName = JSON.parse(sessionStorage.getItem("caseType"));
    // console.log(data);
    this.degree = this.$refs.outline.data.nodes[0].degree = data.degree;
    this.symptom = this.$refs.outline.data.nodes[0].label = data.symptom;
    // this.symptom = data.symptom;
    this.showSave =
      this.caseTypeName === "check" ||
      JSON.parse(sessionStorage.getItem("caseOutline")).state == 0 ||
      !this.$route.query.id;

    if (this.$route.query.id) {
      console.log(data.outline);
      let outline = JSON.parse(data.outline);
      outline.nodes[0].label = this.symptom = data.symptom;
      outline.nodes[0].degree = this.degree = data.degree;
      this.$refs.outline.data = outline;
      this.graphType = "manual";
      this.$refs.outline.graph.read(outline);
    } else {
      let outline = {
        nodes: this.$refs.outline.data.nodes,
        // combos:[{
        //   id: "comboA"
        // }]
      };
      outline.nodes[0].label = data.symptom;
      outline.nodes[0].degree = data.degree;

      this.$refs.outline.data = outline;
      this.graphType = "manual";
      this.$refs.outline.graph.clear();
      this.$refs.outline.graph.read(outline);
      // this.toggleAutoLayout(true);
      console.log(outline)
    }
    // this.$refs.outline.updateGraph();
    
    this.$refs.outline.updateCanvasSize();
    this.$refs.outline.updateGraph();
    // 判断是否自动布局
    // this.auto_layout = JSON.parse(sessionStorage.getItem("auto_layout"))
    //   ? true
    //   : false;
    // if (this.auto_layout) {
    //   return;
    //   this.toggleAutoLayout(true);
    // }
  }
};
</script>

<style lang="less" scoped>
.case-header {
  height: 50px;
  background: #686f92;
  display: flex;
  align-items: center;
  min-width: 1370px;
  justify-content: space-between;

  .case-header-left {
    display: flex;
    align-items: center;
    height: 100%;
  }

  .case-header-back {
    width: 130px;
    height: 100%;
    background: #4098ff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    .back-img {
    }

    .back-font {
      margin-left: 10px;
      font-size: 18px;
      color: #fff;
    }
  }

  .case-header-title {
    margin-left: 30px;
    color: #fff;
    font-size: 18px;
  }

  /deep/ .ivu-btn-info {
    background-color: #2db7f5;
    border-color: #2db7f5;

    &:hover {
      background-color: #57c5f7;
      border-color: #57c5f7;
    }
  }

  .case-header-btn {
    margin-left: 30px;
    display: flex;
    align-items: center;

    .header-btn-img {
      margin-right: 16px;
      cursor: pointer;
    }
  }

  .case-header-type {
    display: flex;
    margin-right: 50px;
    align-items: center;

    .type-box {
      display: flex;
      cursor: pointer;
      align-items: center;
      margin-left: 15px;

      .type-box-color {
        width: 20px;
        height: 10px;
        border-radius: 2px;
        margin-right: 10px;
      }

      .type-box-font {
        color: #fff;
        font-size: 16px;
      }
    }
    .save-btn-save {
      width: 133px;
      height: 34px;
      margin-right: 10px;
      /*margin-left: 30px;*/
      color: #4098ff;
      background-color: #fff;
    }
    .save-btn {
      width: 133px;
      height: 34px;
    }
  }
}
</style>
