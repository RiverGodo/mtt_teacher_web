<template>
  <div>
    <Input
      :disabled="disableds"
      class="vSearchinput"
      @on-change="setChange"
      @on-focus="focuss"
      v-model="query"
      :placeholder="placeholder"
      :style="`width: ${heights}px`"
    />
    <div
      v-if="show && options1&&options1.length>0"
      class="selects vSearchInquiringsInter"
      :style="`width: ${heights}px`"
    >
      <div v-if="options1&&options1.length>0">
        <div @click="setSelect(t)" v-for="(t,i) in options1" :key="i" v-show="t.showques" class="option">
          <span>{{setTitle(t)}}</span>
        </div>
      </div>
      <!--            <div v-else class='no'>暂无匹配</div>-->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    heights: {
      type: Number,
      default: 34
    },
    isTerm: {},
    caseType: {},
    categoryId:{},
    case_id: {},
    name: {},
    placeholder: {},
    querys: {},
    diagnosisId: {},
    disableds: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: false,
      query: this.querys,
      category_id:-1,
      options1: []
    };
  },
  mounted(){
    document.addEventListener('click', (e) => {

       if (!this.$el.contains(e.target)) this.show = false

   })
  },
  watch: {
    caseType(_new) {
      this.getData(this.query);
    },
    categoryId(_new){
      this.category_id = _new
    },
    querys(_new) {
      this.query = _new;
    },
    // show(_new) {
    //   let doc = document.querySelector(".vSearchInquiringsInter");
    //   let doc2 = document.querySelector(".vSearchinput");
    //   let bod = document.body;
    //   let fn = () => {
    //       if (bod)
    //         bod.onclick = () => {
    //           this.show = false;
    //         };
    //     }
    //   if (_new) {
    //     this.setCancelBubble(doc);
    //     this.setCancelBubble(doc2);
    //     setTimeout(() => {
    //       if (bod)
    //         bod.onclick = fn
    //     }, 0);
    //   } else {
    //     doc.onclick = null;
    //     doc2.onclick = null;
    //     bod.onclick = null;
    //     let type = "click"
    //     if (bod.removeEventListener) {
    //       bod.removeEventListener(type, fn);
    //     } else {
    //       //ie
    //       for (var i in bod.events[type]) {
    //         if (bod.events[type][i] == fn) {
    //           bod.events[type].splice(i, 1);
    //         }
    //       }
    //     }
    //   }
    // }
  },
  methods: {
    setCancelBubble(doc) {
      if (doc) {
        doc.onclick = e => {
          if (e && e.stopPropagation) e.stopPropagation();
          if (window.event) window.event.cancelBubble = false;
        };
      }
    },
    setTitle(t) {
      return t[this.name];
    },
    setSelect(t) {
      // console.log(t);
      this.query = t[this.name];
      this.show = false;
      this.$emit("set-sel", t);
    },
    setChange() {
      this.remoteMethod1(this.query);
      this.$emit("set-sel", this.query);
    },
    focuss(e) {
      this.show = true;
    },
    blur(){
      this.show = false;
    },
    getData(query) {
      sessionStorage.setItem("quesid",this.caseType)
      setTimeout(() => {
        let d = {
          category_id: this.caseType ? this.caseType : "",
          ...this.case_id,
          keyword: query
        };
        if(d.category_id === -1 || d.category_id == "" || typeof(d.category_id) == "string"){
          delete d.category_id
        }else{
          PostData("/v1/case/getInquireTemplateList_zlxq", {
            ...d
          }).then(r => {
            if(r && r.data){
              let setionquestion = sessionStorage.getItem("Question") ? JSON.parse(sessionStorage.getItem("Question")) : []
              r.data.list.forEach(element => {
                element.showques = true
              });
              for (let p = 0; p < r.data.list.length; p++) {
                for (let i = 0; i < setionquestion.length; i++) {
                  if (r.data.list[p].question == setionquestion[i].question) {
                    r.data.list[p].showques = false
                  }
                }
              }
              this.options1 = r.data.list
              // console.log(this.options1);
            };
          });
        }
      }, 200);
    },
    remoteMethod1(query) {
      if (query !== "") this.getData(query);
      else {
        this.options1 = [];
      }
    }
  }
};
</script>

<style lang="less" scoped>
.no {
  .item;
  text-align: center;
  height: 80px;
  line-height: 80px;
}
.item {
  width: inherit;
  margin: 0;
  line-height: normal;
  padding: 7px 16px;
  clear: both;
  color: #657180;
  font-size: 14px !important;
  white-space: nowrap;
  list-style: none;
  cursor: pointer;
  background: #fff;
}
.selects {
  display: flex;
  flex-direction: column;
  position: absolute;
  z-index: 900;
  background-color: #fff;
  max-height: 200px;
  overflow: auto;
  margin: 5px 0;
  padding: 5px 0;
  background-color: #fff;
  box-sizing: border-box;
  border-radius: 4px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
  .option {
    .item;
    text-align: left;
    &:hover {
      background: #f3f3f3;
    }
  }
}
</style>
