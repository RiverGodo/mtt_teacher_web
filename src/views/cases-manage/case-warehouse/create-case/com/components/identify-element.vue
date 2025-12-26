<template>
  <div
    class="identifyElementLine"
    v-if="identifyList && identifyList.length > 0"
  >
    <span>关联鉴别要素</span
    ><Cascader
      style="width: 280px"
      :disabled="isCheck"
      :data="identifyList"
      v-model="identify_element_code_sel"
    ></Cascader>
  </div>
</template>

<script>
export default {
  props:{
    isCheck:{
      type:Boolean,
      default:false
    },
    identifyInfo:{
      type:Object,
      default:function(){
        return {}
      }
    }
  },
  data(){
    return{
      identify_element_code:0,
      identify_element_code_sel:[]
    }
  },
  methods:{
    // 反向查询关联要素
    findIdentifyElementCodeShow(itemInfo) {
      if (itemInfo.identify_element_code) {
        this.identify_element_code = itemInfo.identify_element_code;
      }

      this.identifyList.forEach((Identify) => {
        if (!Identify.children) {
          if (Identify.value == this.identify_element_code) {
            this.identify_element_code_sel = [
              Number(this.identify_element_code),
              +"",
            ];
          }
        }
        if (Identify.children && Identify.children.length > 0) {
          Identify.children.forEach((child) => {
            if (child.value == this.identify_element_code) {
              this.identify_element_code_sel = [
                Number(Identify.value),
                Number(this.identify_element_code),
              ];
            }
          });
        }
      });
    },
  },
  computed: {
    // 将鉴别要素数据转化成二级级联
    /**
             * [{
                    value: 'beijing',
                    label: '北京',
                    children: []
                }]
             */
    identifyList() {
      let identifyList = sessionStorage.getItem("IdentifyElement")
        ? JSON.parse(sessionStorage.getItem("IdentifyElement"))
        : [];
      let result = [];
      let obj = {};
      identifyList.forEach((identify) => {
        let pid = Number(identify.parent_node_id);
        if (obj[pid]) {
          obj[pid].children.push({
            value: Number(identify.code),
            label: identify.element_name,
            parent_node_id: Number(identify.parent_node_id),
          });
        } else {
          obj[pid] = {};
          obj[pid].parent_node_id = Number(identify.parent_node_id);
          obj[pid].parent_node_name = identify.parent_node_name;
          obj[pid].code = Number(identify.code);
          obj[pid].children = [
            {
              value: Number(identify.code),
              label: identify.element_name,
              parent_node_id: Number(identify.parent_node_id),
            },
          ];
        }
      });
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const element = obj[key];
          if (element.children.length == 1) {
            result.push({
              value: Number(element.code),
              label: element.parent_node_name,
            });
          } else {
            result.push({
              value: Number(element.parent_node_id),
              label: element.parent_node_name,
              children: element.children,
            });
          }
        }
      }
      return result;
    },
  },
  watch:{
    identifyInfo:{
      handler:function(newVal){
        this.findIdentifyElementCodeShow(newVal)
      },
      immediate:true,
      deep:true
    }
  }
};
</script>

<style lang="less" scoped>
.identifyElementLine {
  display: flex;
  align-items: center;
  justify-content: space-between;
  // padding: 0px 30px;
  margin: 10px 0;
}
</style>