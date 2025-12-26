<template>
  <Modal :width="632" @on-cancel="close" footer-hide v-model="modal1" title="病例总结">
    <Input v-model="summary" :rows="12" type="textarea" placeholder="请输入病例总结" />
    <p class="summary-title">* 病例总结展示给带教老师查看，以及学员练习病例结束后可查看病例总结。</p>
    <div class="sum-btns">
      <Button class="btns" @click="preservation()" type="primary">保存</Button>
      <Button class="btns" style="margin-left: 20px" @click="toExamine()" type="primary">提交审核</Button>
    </div>
  </Modal>
</template>

<script>
export default {
  props: {
    show: {},
  },
  watch: {
    show(_new) {
      this.modal1 = _new;
      if (_new) this.getData();
    },
  },
  data() {
    return {
      modal1: false,
      summary: "",
    };
  },
  methods: {
    getData() {
      PostData("/v1/case/getCaseInfo", {
        case_id: +sessionStorage.getItem("CASEID"),
      }).then((r) => {
        if (r.res_code == 1) this.summary = r.data.summary;
      });
    },
    close() {
      this.modal1 = false;
      this.$emit("close");
    },
    preservation(bool = false) {
      if (this.summary) {
        if (bool) {
          this.$Modal.confirm({
            title: "你确认要提交审核吗？",
            content: "<p>提交审核后，信息将不能被修改！</p>",
            onOk: () => {
              PostData("/v1/case/modifyCaseInfo", {
                case_id: +sessionStorage.getItem("CASEID"),
                summary: this.summary,
                state:1
              }).then((r) => {
                if (r.res_code == 1) {
                  this.close();
                  this.toExam();
                } else {
                  this.$Message.error(r.msg);
                }
              });
            },
            onCancel: () => {},
          });
        } else {
          PostData("/v1/case/modifyCaseInfo", {
            case_id: +sessionStorage.getItem("CASEID"),
            summary: this.summary,
            state:1
          }).then((r) => {
            if (r.res_code == 1) {
              this.$Message.success(r.msg);
              
            }
          });
        }
      } else this.$Message.success("请输入病例总结!");
    },
    toExam() {
      let state = +JSON.parse(sessionStorage.getItem("CaseContentSum")).state;
      if (state === 3) this.$Message.info("该病例已通过审核");
      else {
        PostData("/v1/case/modifyCaseInfo", {
          case_id: +sessionStorage.getItem("CASEID"),
          state: 1,
        }).then((r) => {
          if (r.res_code == 1) {
            this.$Message.success("已提交审核!");
            this.$router.push('case-warehouse')
          }
        });
      }
    },
    async toExamine() {
      await this.preservation(true);
      // await this.toExam();
    },
  },
};
</script>

<style lang="less" scoped>
.summary-title {
  font-family: PingFangSC-Medium;
  color: red;
  margin: 10px 0;
  font-size: 12px;
}
.sum-btns {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  .btns {
    width: 150px;
    height: 38px;
  }
}
</style>