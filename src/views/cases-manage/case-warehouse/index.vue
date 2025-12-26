<template>
  <div>
    <!-- <screen
      isSuper
      :typeArr="typeArr"
      sizeTitle1="病例总数"
      :sizeNum1="sizeNum1"
      btnName="创建病例"
      placehodle="病症/诊断/作者姓名"
      selectSubjects
      @selectChange1="selectChange1"
      @selectChange3="selectChange3"
      @inputChange="inputChange"
      @handleClick="handleClick"
      :select2="select2"
      @selectChange2="selectChange2"
      :select2Placeholder="select2Placeholder"
      :select2_1="select2_1"
      @selectChange2_1="selectChange2_1"
      :select2_1Placeholder="select2_1Placeholder"
    ></screen> -->
    <div class="screen">
      <Select v-if="isSuper" @on-change="selectChange1" class="select-list" v-model="organization_id">
          <Option v-for="(item,index) in select1" :value="item.id" :key="index">{{item.title}}</Option>
      </Select>
      <Select @on-change="selectChange3" class="select-list" v-model="patient_division">
          <Option v-for="(item,index) in select3" :value="item.title" :key="index">{{item.title}}</Option>
      </Select>
      <Select @on-change="selectChange2" class="select-list" v-model="degree">
          <Option v-for="(item,index) in select2" :value="item.id" :key="index">{{item.title}}</Option>
      </Select>
      <Select @on-change="selectChange2_1" class="select-list" v-model="state">
          <Option v-for="(item,index) in select2_1" :value="item.id" :key="index">{{item.title}}</Option>
      </Select>
      <div class="screen_input1">
          <Input style="width:300px;margin-left: 10px;" v-model="keyword" @on-change="inputChange()" placeholder="病症/诊断/作者姓名" />
          <Icon type="md-search" slot="prefix"/>
      </div>
      <div class="number1">
          <p>病例总数</p>
          <span style="color:#9397AD"><span style="margin:0">{{count}}</span>/<span style="margin:0;color:#9397AD">{{total}}</span></span>
      </div>
      <Button style="margin-right: 20px;" @click="handleClick()" type="primary">创建病例</Button>
    </div>
    <!--        <tables :tabel-height="tableHeight" :is-serial=true :column="columns1" :table-data="list"-->
    <!--                @operation1="checkCase" @operation2="editCase" @operation3="toExamine"-->
    <!--                @operation4="deleteCase" @operation5="copyCase"></tables>-->
    <Modal class="reject-modals" v-model="rejectModal" :footer-hide="true" title="拒绝原因" width="700">
      <div style="min-height: 200px" v-if="isSee">{{no_pass_reason}}</div>
      <div v-else>
        <Input v-model="no_pass_reason" type="textarea" :rows="10" />
      </div>
      <div style="margin-top: 40px;display: flex;justify-content: center">
        <Button v-if="isSee" style="width: 120px;" type="primary" @click="editCase(activeItem)">编辑病例</Button>
        <Button v-else @click="refuse" type="primary" style="width: 120px;">确认</Button>
      </div>
    </Modal>
    <div  class="content">
      <p v-if="list.length == 0" style="position:absolute;left:50%;top:50%">目前还没有病例，快去创建病例吧！</p>
      <div class="content-wrapper" :style="{'height': tableHeight + 'px'}" v-else>
        <div
          v-for="(item, index) in list"
          :key="index"
          class="content-box"
          @click="checkCase(item)"
        >
          <div
            v-if="item.degree"
            class="box-degree"
            :style="{backgroundColor: degreeLevel[item.degree].color}"
          >{{degreeLevel[item.degree].title}}</div>
          <div
            class="box-img"
            :style="{transform: item.state == 0 ? 'rotate(450deg)' : item.state == 3 ? 'rotate(408deg)' : 'rotate(334deg)', top: item.state == 0 ? '-3px' : '-20px', right: item.state == 0 ? '3px' : '-38px'}"
          > 
            <img
              v-show="selectState(item.state + 2)"
              :width="item.state == 0 ? '60' : '80'"
              height="60"
              :src="selectState(item.state + 2)"
              alt
            />
          </div>
          <div class="content-top">
            <div class="content-top-symptom">{{item.symptom}}</div>
            <div class="content-top-content">
              <div>
                ID:
                <span>{{item.id}}</span>
              </div>
              <div>
                诊断
                <span style="overflow-x: auto">{{item.principal_diagnosis_name}}</span>
              </div>
            </div>
          </div>
          <div class="content-bottom">
            <div class="bottom-left">
              <div>
                机构：
                <span>{{item.organization_name}}</span>
              </div>
              <div>
                科室：
                <span>{{item.dept_name}}</span>
              </div>
              <div>
                创建人：
                <span>{{item.realname}}</span>
              </div>
              <div>
                创建时间：
                <span>{{item.add_time}}</span>
              </div>
            </div>
            <div :class="item.state == 2 ? 'bottom-right2' : 'bottom-right'">
              <div v-if="item.state == 3" style="margin-right: 10px;">
                <div>{{item.use_count}}</div>
                <div>使用次数</div>
                <Button
                  v-if="$config.roleIsDistribution()"
                  style="margin: 4px 4px 0 0;"
                  type="error"
                  @click="deleteCase(item, index)"
                >删除</Button>
              </div>
              <div class="right-btn" v-else-if="item.state == -1">
                <Button type="primary" @click="rejectCase(item)">拒绝原因</Button>
                <Button style="margin-left: 4px;" type="error" @click="deleteCase(item, index)">删除</Button>
              </div>
              <div class="right-btn" v-else-if="item.state == 0">
                <Button type="primary" @click="editCase(item)">编辑</Button>
                <Button style="margin-left: 4px;" type="error" @click="deleteCase(item, index)">删除</Button>
              </div>
              <div
                @mouseleave="hideBtn"
                class="right-btn"
                style="flex-direction: column;"
                v-else-if="item.state == 2"
              >
                <Button type="primary" @click.stop="auditCase(item)">审核</Button>
                <Button v-if="isToExam" @click.stop="toExamCase(item, 3)">通过</Button>
                <Button v-if="isToExam" @click.stop="toExamCase(item, -1)">拒绝</Button>
              </div>
              <div class="right-btn" v-else-if="item.state == 1&&$config.roleIsDistribution()">
                <Button @click.stop="distributionCase(item)" type="primary">分配</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <distribution
      :show="showDistribution"
      @close="closeDistribution"
      :cases_id="cases_id"
      @handleCancel="getList"
    />
    <page-list :current="current" :total="count" :page-size="pageSize" @page-list="pageList" />
  </div>
</template>

<script>
import distribution from "./com/distribution";
import screen from "../../../components/ScreenFrame";
import tables from "../../../components/tables";
import pageList from "../../../components/Page";
import pageMixin from "../../mixins/pageMixins";
import postData from "../../../api/postData";
import axios from "axios";
import url from "../../../../config/url";
import state_1 from "../../../assets/img/audit-sate/state_1.jpg";
import state_2 from "../../../assets/img/audit-sate/state_2.jpg";
import state_4 from "../../../assets/img/audit-sate/state_3.jpg";
import state_3 from "../../../assets/img/audit-sate/state_5.jpg";

let operationList = [
  ["查看", "operation1"],
  ["编辑", "operation2"],
];
let screenType = ["isSuper", "input", "input2", "size1", "button", "select2"];
export default {
  components: { screen, tables, pageList, distribution },
  mixins: [pageMixin],
  data() {
    return {
      no_pass_reason: "",
      isSee: false,
      activeItem: null,
      cases_id: null,
      showDistribution: false,
      isToExam: false,
      state_1,
      state_2,
      state_3,
      state_4,
      typeArr:
        this.$config.getRoleId() == 1
          ? [...screenType, "select2_1"]
          : screenType,
      count: 0,
      tableHeight: null,
      organization_id: "all",
      keyword: "",
      rejectModal: false,
      degreeLevel: {
        1: { color: "#7ED321", title: "简单" },
        2: { color: "#4098ff", title: "中等" },
        3: { color: "#FD6C1E", title: "困难" },
      },
      columns1: [
        {
          title: "病症",
          key: "symptom",
          align: "left",
          minWidth: 200,
        },
        {
          title: "主要诊断",
          key: "principal_diagnosis_name",
          align: "left",
          minWidth: 200,
        },
        {
          title: "科室",
          key: "patient_division",
          align: "center",
          minWidth: 200,
        },
        {
          title: "难度",
          key: "degree",
          align: "left",
          minWidth: 80,
          render: (h, param) => {
            let d =
              param.row.degree == 1
                ? "简单"
                : param.row.degree == 2
                ? "适中"
                : "困难";
            return h("span", d);
          },
        },
        {
          title: "患者信息",
          key: "message",
          align: "left",
          minWidth: 200,
          // render: (h, params) => {
          //     let d = params.row.patient_name + '/' + params.row.patient_gender + '/' + params.row.patient_age
          //     return h('span', d)
          // }
        },
        {
          title: "审核状态",
          key: "",
          minWidth: 100,
          render: (h, param) => {
            // -1未通过 0草稿 1审核中 2通过
            let arr = ["未通过", "草稿", "待分配", "审核中", "通过"];
            let d = arr[param.row.state + 1];
            return h("span", d);
          },
        },
        {
          title: "使用次数",
          key: "use_count",
          minWidth: 100,
        },
        {
          title: "更新人",
          key: "realname",
          minWidth: 120,
        },
        {
          title: "更新时间",
          key: "add_time",
          minWidth: 200,
        },
        {
          title: "操作",
          minWidth: 300,
          slot: "operation",
          check_id: true,
          operationAllot: true,
          operation:
            this.$config.getRoleId() == 1 || this.$config.getRoleId() == 2
              ? [
                  [
                    ...operationList,
                    ["审核", "operation3"],
                    ["删除", "operation4"],
                  ],
                  [
                    ...operationList,
                    ["审核", "operation3"],
                    ["删除", "operation4"],
                  ],
                ]
              : [
                  [...operationList, ["删除", "operation4"]],
                  [
                    ["查看", "operation1"],
                    ["复制", "operation5"],
                  ],
                ],
        },
      ],
      list: [],
      state: "all",
      select1:[{ id: "all", title: "全部难度" }],
      select2: [
        { id: "all", title: "全部难度" },
        { id: 1, title: "简单" },
        { id: 2, title: "适中" },
        { id: 3, title: "困难" },
      ],
      select3: [{ id: "all", title: "全部难度" }],
      select2_1: [
        // {id: 'all', title: '审核状态'}, {id: 2, title: '审核成功'}, {id: -1, title: '审核失败'}, { id: 1, title: '审核中' }, {id: 0, title: '草稿'},
        { id: "all", title: "审核状态" },
        { id: 3, title: "审核成功" },
        { id: -1, title: "审核失败" },
        { id: 2, title: "审核中" },
        { id: 1, title: "待分配" },
        { id: 0, title: "草稿" },
      ],
      select2Placeholder: "选择科室",
      select2_1Placeholder: "选择难度",
      degree: "all",
      patient_division: "全部科室",
      removeSession: [
        "CaseContentMsg",
        "CaseContentSum",
        "ACTIVEOUTLINE",
        "CASEMSGEDIT",
        "CASEID",
        "CaseTreatment",
        "CaseActiveStep",
      ],
      radioCheck: "同意",
    };
  },
  computed: {
    sizeNum1() {
      // console.log(this.count ? '1' : '2');
      return this.count + "/" + this.total;
    },
  },
  methods: {
    distributionCase(val) {
      this.cases_id = val.id;
      this.showDistribution = true;
    },
    closeDistribution() {
      this.showDistribution = false;
    },
    hideBtn() {
      this.isToExam = false;
    },
    selectState(state) {
      return state == 5 ? "" : this["state_" + state];
    },
    selectChange1(val) {
      this.organization_id = val;
      this.getList();
    },
    selectChange3(val) {
      this.patient_division = val;
      this.getList();
    },
    inputChange(val) {
      // this.keyword = val;
      this.current = 1
      this.getList();
    },
    handleClick() {
      sessionStorage.setItem("CaseActiveStep", 1);
      sessionStorage.setItem("CaseActiveMaxStep", 1);
      this.removeSession.forEach((item) => {
        sessionStorage.removeItem(item);
      });
      window.open("/dashboard/case-contents");
    },
    selectChange2(val) {
      this.degree = val;
      this.getList();
    },
    selectChange2_1(val) {
      this.state = val;
      this.getList();
    },
    refuse() {
      if (this.no_pass_reason) {
        PostData("/v1/case/examineCase", {
          case_id: this.activeItem.id,
          state: -1,
          no_pass_reason: this.no_pass_reason,
        }).then((r) => {
          if (r.res_code == 1) {
            this.rejectModal = false;
            this.$Message.info("审核成功!");
            this.getList();
          }
        });
      } else this.$Message.info("请输入拒绝原因");
    },
    toExamCase(v, i) {
      this.activeItem = v;
      if (i === -1) {
        this.isSee = false;
        this.rejectModal = true;
      } else {
        PostData("/v1/case/examineCase", { case_id: v.id, state: i }).then((r) => {
          if (r.res_code == 1) {
            this.isSee = false;
            this.$Message.info("审核成功!");
            this.getList();
          }
        });
      }
    },
    toExamine(v) {
      if (v.state == -1 || v.state == 3) this.$Message.info("已审核过该病例");
      else if (v.state == 0) this.$Message.info("不能对草稿进行审核");
      else
        this.$Modal.confirm({
          title: "提示",
          closable: true,
          render: (h) => {
            return h(
              "RadioGroup",
              {
                attrs: {
                  value: this.radioCheck,
                },
                on: {
                  "on-change": (val) => {
                    this.radioCheck = val;
                  },
                },
              },
              [
                h("Radio", { props: { label: "同意" } }),
                h("Radio", { props: { label: "拒绝" } }),
              ]
            );
          },
          onOk: () => {
            let check = { 同意: 3, 拒绝: -1 };
            PostData("/v1/case/examineCase", {
              case_id: v.id,
              state: check[this.radioCheck],
            }).then((r) => {
              if (r.res_code == 1) {
                this.$Message.info("审核成功!");
                this.getList();
              }
            });
          },
          onCancel: () => {},
        });
    },
    checkCase(val) {
      // console.log(val);
      // let routeData = this.$router.resolve({query: {case_id: val.id}, name: "view-cases"});
      // window.open(routeData.href, "_blank")
      sessionStorage.setItem("CaseActiveStep", 1);
      let url = this.$router.resolve({
        path: "/dashboard/case-contents",
        query: { id: val.id, copy_state: val.copy_state, isCheck: true },
      });
      PostData("/v1/case/getStep", { id: val.id }).then((res) => {
        if (res.res_code == 1) {
          sessionStorage.setItem("CaseActiveMaxStep", res.data.step);
          sessionStorage.setItem("CASEID",val.id)
          window.open(url.href, "_blank");
        }
      });
    },
    editCase(val) {
      this.rejectModal = false;
      window.event.stopPropagation();
      sessionStorage.setItem("CaseActiveStep", 1);
      let url = this.$router.resolve({
        path: "/dashboard/case-contents",
        query: { id: val.id, copy_state: val.copy_state },
      });
      PostData("/v1/case/getStep", { id: val.id }).then((res) => {
        if (res.res_code == 1) {
          sessionStorage.setItem("CaseActiveMaxStep", res.data.step);
          sessionStorage.setItem("CASEID",val.id)
          window.open(url.href, "_blank");
        }
      });
    },
    deleteCase(val, i) {
      window.event.stopPropagation();
      this.$Modal.confirm({
        title: "提示",
        content: `<p>是否删除该病例！</p>`,
        onOk: () => {
          postData("/v1/case/removeCase", { id: val.id }).then((res) => {
            if (res.res_code == 1) {
              this.list.splice(i, 1);
              this.$Message.success(res.msg);
            }
          });
        },
      });
    },
    auditCase(v) {
      window.event.stopPropagation();
      if (v.state == -1 || v.state == 3) this.$Message.info("已审核过该病例");
      else this.isToExam = true;
      // this.$Modal.confirm({
      //     title: '提示',
      //     closable: true,
      //     render: (h) => {
      //         return h('RadioGroup', {
      //             attrs: {
      //                 'value': this.radioCheck
      //             },
      //             on: {
      //                 'on-change': (val) => {
      //                     this.radioCheck = val
      //                 }
      //             }
      //         }, [
      //             h('Radio', {props: {label: '同意'}}),
      //             h('Radio', {props: {label: '拒绝'}}),
      //         ])
      //     },
      //     onOk: () => {
      //         let check = {'同意': 2, '拒绝' : -1}
      // PostData('case/approve',{id: v.id, state: check[this.radioCheck]}).then((r) => {
      //     if(r.res_code == 1) {
      //         this.$Message.info('审核成功!')
      //         this.getList()
      //     }
      // })
      //     },
      //     onCancel: () => {
      //     }
      // });
    },
    rejectCase(val) {
      this.activeItem = val;
      this.no_pass_reason = val.no_pass_reason;
      window.event.stopPropagation();
      this.rejectModal = true;
      this.isSee = true;
    },
    copyCase(val) {
      this.$Modal.confirm({
        title: "提示",
        content: "复制需要1分钟时间，请一分钟查看",
        onOk: () => {
          axios
            .post(url + "case/copyCase", {
              token: sessionStorage.getItem("token") || "",
              id: val.id,
            })
            .then((res) => {
              if (res.res_code == 1) this.getList();
            });
        },
      });
      // postData('case/copyCase', {id: val.id}).then(res => {
      //     console.log(res);
      // })
    },
    getList() {
      let role_id = this.$config.getRoleId();
      let da =
        role_id > 1 ? this.$config.getOrganizationId() : this.organization_id;
      let d = {
        organization_id: da == "all" ? null : da,
        keyword: this.keyword,
        page_size: this.pageSize,
        page_num: this.current,
        degree: this.degree == "all" ? null : this.degree,
        patient_division: this.patient_division == "全部科室" ? null : this.patient_division,
        state: this.state == "all" ? null : this.state,
        question_type:1
      };
      postData("/v1/case/getCaseList", d).then((res) => {
        this.list = res.data.list;
        this.list.forEach((item) => {
          if (item.patient_age) {
            let age = item.patient_age.split("");
            age[age.length - 1] =
              age[age.length - 1] == "年" ? "岁" : age[age.length - 1];
            item.message =
              item.patient_name +
              "/" +
              (item.patient_gender == "Male" ? "男" : "女") +
              "/" +
              age.join("");
          }
        });
        this.total = res.data.list.length;
        this.count = res.data.count;
      });
    },
  },
  mounted() {
    this.pageSize = 12;
    this.getList();
    this.tableHeight = window.innerHeight - 200;
    PostData('/v1/common/getDeptList').then(res => {
        this.select3 = [{id: 'all', title: '全部科室'},...res.data]
    })
    PostData('/v1/common/getOrganizationList').then((res) => {
        this.select1 = [{id: 'all', title: '全部机构'},...res.data]
    })
  },
};
</script>

<style scoped lang="less">
.reject-modals {
  /deep/ .ivu-modal-body {
    padding: 20px 40px !important;
  }
}
.content {
  
  .content-wrapper {
      display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  overflow-y: auto;
  justify-content: flex-start;
  padding: 0 5%;
  background-color: rgb(242, 242, 242);
    .content-box {
      width: 300px;
      height: 170px;
      margin: 15px;
      background-color: #fff;
      padding: 8px;
      color: #000;
      position: relative;

      &:hover {
        .right-btn {
          display: flex;
        }
      }
      .right-btn {
        display: none;
      }
    }
    .box-img {
      position: absolute;
      right: -38px;
      top: -20px;
      transform: rotate(335deg);
    }
    .box-degree {
      position: absolute;
      left: 0;
      top: 0;
      width: 30px;
      height: 17px;
      text-align: center;
      line-height: 17px;
      color: #fff;
      font-size: 12px;
    }
    .content-top {
      display: flex;

      .content-top-symptom {
        width: 82px;
        height: 64px;
        background-color: rgba(201, 201, 201, 1);
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .content-top-content {
        text-align: left;
        margin-left: 10px;
      }
    }
    .content-bottom {
      display: flex;
      justify-content: space-between;
      position: relative;
      margin-top: 10px;

      .bottom-left {
        text-align: left;
      }
      .bottom-right {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: absolute;
        bottom: 5px;
        right: -6px;

        /deep/ .ivu-btn {
          font-size: 14px !important;
        }
      }
      .bottom-right2 {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: absolute;
        top: 50px;
        right: -6px;
        z-index: 3;
        /deep/ .ivu-btn {
          font-size: 14px !important;
        }
      }
    }
  }
}
</style>
<style lang="less" scoped>
    .action{
       display: flex;
       align-items: center;
       span{
           cursor: pointer;
           color: #4098FF;
           margin-right: 10px;
       }
       .nosee{
           display: none;
       }
    }
    .action:hover{
        span{
            display: block;
        }
    }
    .select-list{
        width: 200px;
        /* min-width: 200px; */
        margin-left: 10px;
        /deep/ .ivu-select-selection{
            border-radius: 100px;
        }
        /deep/ .ivu-select-selected-value{
            padding-left: 20px;
        }
    }
    .screen{
        display: flex;
        align-items: center;
        background: #F0F0F7;
        height: 66px;
        .screen_input1{
            display: flex;
            align-items: center;
            position: relative;
        }
        .number1{
            display: flex;
            align-items: center;
            margin-right: auto;
            min-width: 150px;
            p{
                font-family: PingFangSC-Regular;
                font-size: 16px;
                color: #474C63;
                letter-spacing: 0;
                margin-left: 10px;
            }
            span{
                font-family: PingFangSC-Regular;
                font-size: 16px;
                color: #4098FF;
                letter-spacing: 0;
                margin-left: 10px;
            }
        }
        /deep/ .ivu-input{
            border-radius: 100px !important;
            padding-left: 40px;
            font-size: 16px !important;
        }
        /deep/ .ivu-icon-md-search{
            font-size: 20px;
            position: absolute;
            left: 25px;
        }
        /deep/ .ivu-select-placeholder{
            padding-left: 20px !important;
        }
    }
</style>
