<template>
  <div class="diagnosisGroupWrapper" @click="selCurrentGroup">
    <div class="diagnosisGroup">
      <div class="title">
        <img :src="assets.deEdit" alt="" />{{
          diagnosisGroupItem.element_name ||
          diagnosisGroupItem.talk_group ||
          diagnosisGroupItem.first_name ||
          diagnosisGroupItem.name
        }}({{ diagnosisGroupItem.count }})
      </div>
      <div class="flag">
        <img v-if="unfold" :src="assets.selClose" alt="" />
        <img v-else :src="assets.selOpen" alt="" />
      </div>
    </div>
    <div v-if="unfold">
      <div
        v-for="(item, index) in currentGroupDataList"
        :key="'diagnosisGroupList' + index"
        @click.stop="editCurrentItem(item,index)"
      >
        <div class="diagnosisGroupListItem" :class="currentSelIndex === index ? 'diagnosisGroupListItemActive':''" v-if="item.item_type != '1'">
          <!-- 问诊相关 -->
          <div class="diagnosisGroupListItemLine" v-if="groupType === 'talk'">
            <span class="flag question">问</span>{{ item.question }}
          </div>
          <div class="diagnosisGroupListItemLine" v-if="groupType === 'talk'">
            <span class="flag answer">答</span>{{ item.answer }}
          </div>
          <!-- 体检相关 -->
          <div
            class="diagnosisGroupListItemLine"
            v-if="groupType === 'physical'"
          >
            <span class="flag question">部位</span
            >{{ item.item || item.first_name }}
          </div>
          <div
            class="diagnosisGroupListItemLine"
            v-if="groupType === 'physical'"
          >
            <span class="flag answer">结果</span>{{ item.result_text }}
          </div>
          <!-- 辅检相关 -->
          <div class="diagnosisGroupListItemLine" v-if="groupType === 'assist'">
            <span class="flag question">检查项 </span
            >{{ item.item || item.first_name }}
          </div>
          <!-- 防治与诊疗 -->
          <div class="diagnosisGroupListItemLine" v-if="groupType === 'treat'">
            <span class="flag question"
              >{{ item.type | treatTypeTranslate }} </span
            >{{ item.content }}
          </div>
          <span class="delete" v-if="!isCheck" @click.stop="removeCurrentItem(item)">删除</span>
          <button v-if="item.item_type">
            {{ item.item_type | optionsTypeTranslate }}
          </button>
        </div>
      </div>
      <div>
        <Button class="case-add-btn" v-if="!isCheck" @click.stop="add()">
          <img :src="assets.caseAdd" class="add" />
          <span class="add-text">添加</span>
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
// 静态资源
import selClose from "../../../../../../assets/img/case/sel-close.png";
import selOpen from "../../../../../../assets/img/case/sel-open.png";
import actEdit from "../../../../../../assets/img/case/edit1.png";
import deEdit from "../../../../../../assets/img/case/edit2.png";
import caseAdd from "../../../../../../assets/img/case/case-add1.png";
// 配置项
const getUrlMap = {
  talk: "case/getTalkListByElement",
  physical: "case/getPhysicalResultByElement",
  assist: "case/getAssistResultByElement",
  treat: "case/getListByElement",
};
const deleteUrlMap = {
  talk: "case/removeTalkBasis",
  physical: "case/removeBasis",
  assist: "case/removeAssistBasis",
  treat: "case/removeTreat",
};
// 工具函数
import postData from "src/api/postData";
export default {
  name: "diagnosisGroup",
  props: {
    isCheck:{
      type:Boolean,
      default:false
    },
    // 组数据
    diagnosisGroupItem: {
      type: Object,
      default: () => {
        return {};
      },
    },
    // 组索引
    groupIndex: {
      type: Number,
      default: -1,
    },
    // 是否选中
    unfold: {
      type: Boolean,
      default: false,
    },
    // 组类型 talk 问诊
    groupType: {
      type: String,
      default: "",
    },
    // tab name
    tabName: {
      type: String,
      default: "1",
    },
  },
  data() {
    return {
      assets: {
        selClose,
        selOpen,
        actEdit,
        deEdit,
        caseAdd,
      },

      currentGroupDataList: [], //当前组的数据
      currentSelIndex:-1, // 当前选择的索引
    };
  },
  mounted() {
    this.case_id = +this.$route.query.id;
  },
  methods: {
    init() {},
    // 选中当前组
    selCurrentGroup() {
      if (!this.unfold) {
        this.$emit("changeGroupIndex", {
          groupIndex: this.groupIndex,
          group: this.diagnosisGroupItem,
        });
        this.getData();
      } else {
        this.$emit("changeGroupIndex", {
          groupIndex: -1,
          group: this.diagnosisGroupItem,
        });
      }
    },
    // 获取数据
    getData() {
      if (this.tabName === "1") {
        this.getCurrentGroupPointsDataList();
      } else if (this.tabName === "2") {
        this.getCurrentGroupPenaltiesDataList();
      }
    },
    // 获取当前组得分项已添加的数据
    getCurrentGroupPointsDataList() {
      let url = getUrlMap[this.groupType];
      let case_id = this.case_id;
      let element_id = this.diagnosisGroupItem.id;
      let frequency_id = sessionStorage.getItem("FrequencyId");
      let params = {
        case_id,
        element_id,
        frequency_id,
      };
      if (url) {
        postData(url, params).then((res) => {
          if (res.res_code === 1) {
            this.currentGroupDataList = res.data;
          }
        });
      }
    },
    // 获取当前组干扰项/扣分项已添加的数据
    getCurrentGroupPenaltiesDataList() {
      let url = "";
      let params = {};
      let case_id = this.case_id;
      let frequency_id = sessionStorage.getItem("FrequencyId");
      let talk_group = this.diagnosisGroupItem.talk_group;
      let first_id = this.diagnosisGroupItem.first_id;
      let type = this.groupType;
      // 问诊
      if (this.groupType == "talk") {
        url = "case/getTalkTree";
        params = {
          case_id,
          frequency_id,
          talk_group,
        };
      }
      //体格
      if (this.groupType == "physical") {
        url = "case/getPhysicalResultByFirstId";
        params = {
          case_id,
          frequency_id,
          first_id,
        };
      }
      // 辅检
      if (this.groupType == "assist") {
        url = "case/getAssistResultByFirstId";
        params = {
          case_id,
          frequency_id,
          first_id,
        };
      }
      // 防治诊疗
      if (this.groupType == "treat") {
        url = "case/getListByType";
        params = {
          case_id,
          frequency_id,
          type: this.diagnosisGroupItem.type,
        };
      }

      postData(url, params).then((res) => {
        if (res.res_code === 1) {
          this.currentGroupDataList = res.data;
        }
      });
    },
    // 添加当前组项
    add() {
      this.$emit("addAiagnosisGroupItem",this.diagnosisGroupItem);
    },
    // 编辑当前的项
    editCurrentItem(item, index) {
      this.currentSelIndex = index;
      this.$emit("editItem", item);
    },
    // 删除当前的项
    removeCurrentItem(item) {
      let url = deleteUrlMap[this.groupType];
      let case_id = this.case_id;
      let frequency_id = sessionStorage.getItem("FrequencyId");
      let element_id = this.diagnosisGroupItem.id;
      let id = item.id;
      // 如果是问诊，添加 question_index
      let question_index = item.question_index;

      // 如果是防止诊疗，需要添加额外参数 type
      let type = item.type == "treat" ? "nursing" : item.type;

      let params = {
        case_id,
        frequency_id,
        element_id,
        id,
        question_index,
        type,
      };
      this.$Modal.confirm({
        title: "你确认要删除吗？",
        content: "<p>删除后列表里的所选数据将被清空。</p>",
        onOk: () => {
          PostData(url, params).then((r) => {
            if (r && r.res_code == 1) {
              // this.getData();
              this.$emit("refreshData", {
                num: -1,
                diagnosisType: +this.tabName,
                groupId: this.diagnosisGroupItem.id || this.diagnosisGroupItem.first_id,
              });
            }
          });
        },
        onCancel: () => {},
      });
    },
  },
  filters: {
    treatTypeTranslate: function (type) {
      return {
        operation: "手术",
        medicine: "西药",
        treat: "护理",
        other: "其他",
      }[type];
    },
    optionsTypeTranslate: function (type) {
      return {
        1: "得分项",
        2: "干扰项",
        3: "扣分项",
      }[type];
    },
  },
};
</script>

<style lang="less" scoped>
.diagnosisGroup {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  background: #fafafc;
  padding: 10px 20px;
  margin-top: 10px;
  .title {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #474c63;
    font-weight: bold;
    img {
      width: 15px;
      margin-right: 10px;
    }
  }
  .flag {
    img {
      width: 10px;
    }
  }
}
.diagnosisGroupListItem {
  position: relative;
  padding: 10px 20px;
  border-bottom: 1px solid #f0f0f7;
  text-align: left;
  .diagnosisGroupListItemLine {
    display: flex;
    // align-items: center;
    text-align: left;
    margin-top: 5px;
    .flag {
      height: 20px;
      border-radius: 2px;
      padding: 2px;
      font-size: 12px;
      line-height: 16px;
      text-align: center;
      border-radius: 3px;
      margin-right: 10px;
    }
    .question {
      color: #4098ff;
      background-color: rgba(64, 152, 255, 0.15);
    }
    .answer {
      color: #ff9509;
      background-color: rgba(255, 149, 9, 0.15);
    }
  }
  .delete {
    display: none;
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
    color: red;
  }
}
.itemActive{
  background-color: rgba(235, 244, 255, 0.5);
  border-left: 2px solid #4098ff;
  box-shadow: -5px 0px 5px #ddd;
}
.diagnosisGroupListItem:hover {
  .itemActive;
  .delete {
    display: block;
  }
}
.diagnosisGroupListItemActive{
  .itemActive;
}
.case-add-btn {
  margin: 10px auto;
  background-color: #4098ff;
  .add {
    width: 15px;
    height: 15px;
    margin-right: 8px;
    position: relative;
    top: 2px;
  }
  .add-text {
    height: 15px;
    font-size: 14px;
    color: #fff;
  }
}
</style>