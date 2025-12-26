<template>
  <div class="interrogation main">
    <!-- tab -->
    <div class="tabs-view tabs-content">
      <Tabs
        v-model="activeTab"
        @on-click="tabs"
        type="line"
        size="small"
        class="tabs"
      >
        <TabPane :label="setLabel" :name="tabLabels[0].name">
          <div class="tabInnerContent">
            <diagnosis-group
              v-for="(item, index) in interrogationPointsList"
              :ref="'interrogationPointsList' + index"
              :key="'interrogationPointsList' + index"
              :diagnosisGroupItem="item"
              :groupIndex="index"
              :unfold="currentSelGroupIndex === index ? true : false"
              :groupType="'talk'"
              :tabName="tabLabels[0].name"
              :isCheck="isCheck"
              @changeGroupIndex="changeGroupSelIndex"
              @addAiagnosisGroupItem="addCurrentAiagnosisGroupItem"
              @editItem="changeCurrentEditItem"
              @refreshData="refreshCurrentGroupList"
              class="tabItem"
            />
          </div>
        </TabPane>
        <TabPane :label="tabLabels[1].label" :name="tabLabels[1].name">
          <div class="tabInnerContent">
            <diagnosis-group
              v-for="(item, index) in interrogationPenaltiesList"
              :key="'interrogationPenaltiesList' + index"
              :ref="'interrogationPenaltiesList' + index"
              :diagnosisGroupItem="item"
              :groupIndex="index"
              :unfold="currentSelGroupIndex === index ? true : false"
              :groupType="'talk'"
              :tabName="tabLabels[1].name"
              :isCheck="isCheck"
              @changeGroupIndex="changeGroupSelIndex"
              @addAiagnosisGroupItem="addCurrentAiagnosisGroupItem"
              @editItem="changeCurrentEditItem"
              @refreshData="refreshCurrentGroupList"
            />
          </div>
        </TabPane>
        <TabPane :label="tabLabels[2].label" :name="tabLabels[2].name">
          <unscramble :diagnosisId="diagnosisId" :type="'1'" />
        </TabPane>
      </Tabs>
    </div>
    <div class="content let-content">
      <edit-interrogation
        ref="editInterrogation"
        :diagnosisType="Number(activeTab)"
        :group="currentSelGroup"
        :interrogationItemData="currentSelItemData"
        :isCheck="isCheck"
        @refreshData="refreshCurrentGroupList"
      />
    </div>
  </div>
</template>

<script>
import caseSee from "../../../../../../assets/img/case/case-see.png";
import caseSeeGrey from "../../../../../../assets/img/case/case-see-grey.png";
const defineTabLabels = [
  { name: "1", label: "得分项" },
  { name: "2", label: "干扰项/扣分项" },
  { name: "3", label: "解读分析" },
];
const dataType = "talk"; // 获取相关信息的类型
// 组件
import diagnosisGroup from "./diagnosis-group";
import unscramble from "./unscramble.vue";
import editInterrogation from "./edit-interrogation.vue";
// 工具函数
import postData from "src/api/postData";
export default {
  // 问诊
  name: "interrogation",
  props: {
    isCheck:{
      type:Boolean,
      default:false
    }
  },
  components: {
    diagnosisGroup,
    unscramble,
    editInterrogation,
  },
  data() {
    return {
      tabLabels: defineTabLabels,
      actImg: caseSee,
      activeTab: defineTabLabels[0].name,
      interrogationPointsList: [], // 问诊得分项
      interrogationPenaltiesList: [], //问诊干扰项/扣分项
      currentSelGroupIndex: -1, // 默认选中的组索引（得分项和扣分项通用）
      currentSelGroup: {}, // 默认选中的组id（得分项和扣分项通用）
      currentSelItemData: {}, // 编辑组内项的数据（得分项和扣分项通用）
      diagnosisId: sessionStorage.getItem("FrequencyId"),
    };
  },
  created() {},
  mounted() {
    this.case_id = +this.$route.query.id;
    this.init();
  },
  methods: {
    init() {
      this.getInterrogationPointsList();
    },
    setLabel(h, params) {
      return h(
        "div",
        {
          on: {
            mouseenter: () => {
              this.actImg = caseSee;
            },
            mouseleave: () => {
              console.log("mouseleave", this.activeTab, typeof this.activeTab);
              this.actImg =
                this.activeTab === this.tabLabels[0].name
                  ? caseSee
                  : caseSeeGrey;
            },
          },
          style: {
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        },
        [
          h("span", "得分项", { style: { "letter-spacing": "1.5px" } }),
          h("img", {
            attrs: {
              src: this.actImg,
            },
            style: {
              width: "15px",
              height: "15px",
              marginLeft: "10px",
            },
            on: {
              click: () => {
                // this.outlineModal = true;
                // this.setOutlinesData();
              },
            },
          }),
        ]
      );
    },
    tabs(name) {
      this.actImg = name === this.tabLabels[0].name ? caseSee : caseSeeGrey;
      this.currentSelGroupIndex = -1; // 切换tab收起全部展开
      this.$refs.editInterrogation.clear();
      if (name === "1") {
        this.getInterrogationPointsList();
      }
      if (name === "2") {
        this.getInterrogationPenaltiesList();
      }
    },
    // 刷新列表数据，主要是项的数量
    // 获取得分项列表
    getInterrogationPointsList() {
      let frequency_id = sessionStorage.getItem("FrequencyId");
      let params = {
        case_id: this.case_id,
        frequency_id,
        type: dataType,
      };
      postData("case/getElements", params).then((res) => {
        if (res.res_code === 1) {
          this.interrogationPointsList = res.data;
        }
      });
    },
    // 获取扣分项列表
    getInterrogationPenaltiesList() {
      let frequency_id = sessionStorage.getItem("FrequencyId");
      let params = {
        case_id: this.case_id,
        frequency_id,
        type: dataType,
      };
      postData("case/getTalkTree", params).then((res) => {
        if (res.res_code === 1) {
          this.interrogationPenaltiesList = res.data;
        }
      });
    },
    // 切换当前组
    changeGroupSelIndex(data) {
      this.currentSelGroupIndex = data.groupIndex;
      this.currentSelGroup = data.group;
    },
    // 给当前组添加项
    // type 1 得分项 2 扣分项（来自于tabName）
    addCurrentAiagnosisGroupItem() {
      this.$refs.editInterrogation.init();
    },
    // 更新组列表数据
    // type 1 得分项 2 干扰项/扣分
    refreshCurrentGroupList(val) {
      let id = val.groupId;
      let type = val.diagnosisType;
      let num = val.num;
      if (type === 1) {
        this.interrogationPointsList.forEach((item, index) => {
          if (item.id === id) {
            item.count += num;
            this.$refs["interrogationPointsList" + index][0].getData();
          }
        });
      } else if (type === 2) {
        this.interrogationPenaltiesList.forEach((item, index) => {
          if (item.id === id) {
            this.$refs["interrogationPenaltiesList" + index][0].getData();
            item.count += num;
          }
        });
      }
    },
    // 传递当前项的数据到编辑页面
    changeCurrentEditItem(val) {
      this.currentSelItemData = val;
      this.$nextTick(() => {
        this.$refs.editInterrogation.initEditItemData()
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import "./details.less";
/deep/ .ivu-tabs-nav-container:focus .ivu-tabs-tab-focused {
  border-color: #f0f0f7 !important;
}
/deep/ .ivu-tabs-tabpane {
  height: 597px;
}
.tabs-content {
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  .tabs {
    width: 100%;
    /deep/ .ivu-tabs-nav {
      width: 100%;
      margin: 0 !important;
      /deep/ .ivu-tabs-ink-bar {
        margin: 0 !important;
        height: 2px !important;
        width: 100%/3 !important;
      }
      /deep/ .ivu-tabs-tab {
        height: 49px !important;
        width: 100%/3 !important;
        font-family: PingFangSC-Medium;
        font-size: 18px;
        margin: 0 0 2px 0 !important;
        padding: 0 !important;
        border: 1px solid #f0f0f7 !important;
      }
    }
  }
}
.let-content {
  background: rgba(240, 240, 247, 0.3);
  border-radius: 3px;
}
</style>