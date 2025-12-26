<template>
  <div>
    <caseOutline
      ref="outline"
      class="case-outline"
      :dragcanvas="true"
      :outlinesee="true"
      @saveData="saveData"
    />
    <div class="case-btn-box">
      <Button class="case-btn-last" v-if="!isCheck" @click="handleLast" type="primary">上一步</Button>
      <Button class="case-btn" v-if="!isCheck" @click="handleNext(false)" type="primary">下一步</Button>
    </div>
    <Spin fix v-if="loading_state">
      <Icon type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
      <div>Loading</div>
    </Spin>
  </div>
</template>

<script>
// import caseOutline from './case-outline'
import caseOutline from "components/outlines";

export default {
  props:{
    isCheck:{
      type:Boolean,
      default:false
    }
  },
  components: { caseOutline },
  data() {
    return {
      caseHeight: "627px",
      outline: null,
      dataList: [],
      loading_state:false,
      // isCheck:false
    };
  },
  beforeDestroy() {
    $CasePreservation.$off("CasePreservation", this.preservation);
  },
  mounted() {
    // this.isCheck = this.$route.query ? this.$route.query.isCheck : false
    $CasePreservation.$on("CasePreservation", this.preservation);
    // PostData('case/getAllOutlineTalk',{"case_id": JSON.parse(sessionStorage.getItem('CASEID')),}).then(res => {
    //     this.changeOutlineList(res.data)
    // })
    //  PostData("case/getElementShowState", {
    //   case_id: JSON.parse(sessionStorage.getItem("CASEID"))
    // })
    let p1 = PostData("case/getElementShowState", {
      case_id: JSON.parse(sessionStorage.getItem("CASEID")),
    });
    let p2 = PostData("case/getIllnessShowState", {
      case_id: JSON.parse(sessionStorage.getItem("CASEID")),
    });
    this.loading_state = true
    Promise.all([p1, p2])
      .then((res) => {
        let p1_result = res[0].data;
        let p2_result = res[1].data;
        return Object.assign({}, p1_result, p2_result);
      })
      .then((res) => {
        this.changeOutlineList(res);
      })
      .then(() => {
        PostData("case/getCaseDetailAndOutlines", {
          id: parseInt(sessionStorage.getItem("CASEID")),
        }).then((res) => {
          this.loading_state = false
          if (res.res_code == 1) {
            this.outline = res.data.outlines[0];
            this.$refs.outline.data = JSON.parse(res.data.outlines[0].outline);
            this.$refs.outline.graph.read(
              JSON.parse(res.data.outlines[0].outline)
            );
            // 将查到的节点标记数据添加到节点上
            this.setData(this.dataList, this.$refs.outline.data);
            this.$refs.outline.updateCanvasSize();
            // this.graph.translate(document.querySelector('#mountNode').offsetWidth / 2 - 160, 0)
          }
        });
      })
      .catch((e) => {
        this.loading_state = false
      });
  },
  methods: {
    preservation(index) {
      if (index == 5) this.handleNext(true);
    },
    handleLast() {
      this.$emit("handleNavigate", 4);
    },
    handleNext(save) {
      this.saveData(save);
      // this.outline.outline = JSON.stringify(this.$refs.outline.graph.save())
      // PostData('case/saveCaseOutline', {...{elements: this.setElements()}, ...this.outline}).then(res => {
      //     this.saveData(save)
      // })
    },
    saveData(save) {
      if (!save) this.$emit("handleNavigate", 6);
      this.$Message.success("保存成功");
    },
    changeOutlineList(data) {
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          let element = data[key];
          let filter = [];
          if (Array.isArray(element)) {
            element.forEach((child, child_idx) => {
              // 处理 illness
              if (child.illness_name && child.type) {
                filter.push(child);
              }
              // 处理 elements
              if (child.element_name && child.shwo_state) {
                filter.push(child);
              }
            });
            data[key] = filter;
          }
        }
      }

      // const dataList = {}, list = ['assist', 'talk', 'physical','identify_element']
      // list.forEach(item => {
      //     if(data[item]) data[item].forEach(item1 => {
      //         item1.type = item
      //         item1.code = item1.parent_node_id
      //         if(dataList[item1.code]) dataList[item1.code].push(item1)
      //         else dataList[item1.code] = [item1]
      //     })
      // })
      console.log(data);
      this.dataList = data;
    },
    /**
     * data 节点标记数据
     * graph 原始提纲数据
     * 此处 设置 组合节点 每个 child_shape 的 element_or_illness_id element_type
     * 每个 child_shape 的 tag 的 element_or_illness_id element_type
     */
    setData(data, graph) {
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          let element = data[key];
          let filter = [];
          if (Array.isArray(element)) {
            element.forEach((child, child_idx) => {
              // 处理 illness
              if (child.illness_name && child.type) {
                filter.push(child);
              }
              // 处理 elements
              if (child.element_name && child.shwo_state) {
                filter.push(child);
              }
            });
            data[key] = filter;
          }
        }
      }
      graph.nodes.map((item) => {
        for (let i in data) {
          if (item.id == i) {
            if (item.children && item.children.length > 0) {
              item.children.forEach((child) => {
                data[i].forEach((d) => {
                  if (child.child_shape_id == d.child_shape_id) {
                    
                    child.element_type = d.type;
                    child.element_or_illness_id = d.id;
                    child.right_state = +d.right_state;
                    child.tags.push({
                      type: d.type,
                      label: d.element_name || d.illness_name,
                      files: [],
                      id: d.id,
                    });
                  }
                });
              });
            } else {
              data[i].forEach((d) => {
                if (d.parent_node_id === item.id) {
                  item.tags.push({
                    type: d.type,
                    label: item.label,
                    files: [],
                    id: d.id,
                  });
                }
              });
            }
          }
        }
      });

      this.$refs.outline.data = graph;
      this.$refs.outline.graph.read(graph);
      this.$refs.outline.updateCanvasSize();
    },
    setElements() {
      let da = this.$refs.outline.graph.save();
      let node = da.nodes;
      let fillCol = ["#ECF5FF", "#DFF5F7", "#FFF2DE", "#EBF8DB"];
      let types = {
        "#ECF5FF": "talk",
        "#DFF5F7": "physical",
        "#FFF2DE": "assist",
        "#EBF8DB": "treat",
        // '#F9E6DB': 'disease',
      };
      let ele = [];
      if (node && node.length > 0) {
        node.map((t) => {
          if (t.fill) {
            if (fillCol.includes(t.fill) && t.all_label) {
              ele.push({
                code: t.id + "|" + sessionStorage.getItem("CASEID"),
                element_name: t.all_label,
                type: types[t.fill],
              });
            }
          }
        });
      }
      return ele;
    },
    // addMarkToGraph(mark_data){
    //     console.log(mark_data)
    //     console.log()
    // }
  },
  created() {
    // this.caseHeight = document.body.clientHeight + 'px'
  },
};
</script>

<style lang="less" scoped>
.case-outline {
  margin-top: 10px;
}
.case-btn-box {
  display: flex;
  margin-top: 26px;
  justify-content: center;

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
