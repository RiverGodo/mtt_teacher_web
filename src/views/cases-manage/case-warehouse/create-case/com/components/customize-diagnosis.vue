<template>
  <div>
    <!-- 自定义查体 -->
    <Modal v-model="customizeDiagnosis" title="自定义药品" :width="900">
      <Form ref="formInline" :label-width="80">
        <FormItem label="药品类别">
          <Select v-model="customizeDiagnosisForm.medicine_type" style="width:200px">
            <Option v-for="item in selectMedicine" :value="item.id" :key="item.id">{{ item.title }}</Option>
          </Select>
        </FormItem>
        <FormItem label="药品名称">
          <Input v-model="customizeDiagnosisForm.medicine_name" type="text" placeholder="请输入..."></Input>
        </FormItem>
      </Form>
      <div slot="footer" style="display:flex;justify-content:space-between">
        <p style="aline-self:flex-start;color:red">*添加到药品库后，请重新搜索并选择</p>
        <div style="display:flex;flex-direction:row-reverse">
          <Button type="primary" @click="add">添加</Button>
          <Button style="margin-right:10px" @click="cancel">取消</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import postData from "src/api/postData";
export default {
  name: "customizeDiagnosis",
  data() {
    return {
      customizeDiagnosis: false,
      selectMedicine: [
        {
          id: 6,
          title: "西药",
        },
        {
          id: 9,
          title: "中药",
        },
      ],
      customizeDiagnosisForm: {
        medicine_type: "",
        medicine_name: "",
      },
    };
  },
  methods: {
    close() {
      this.customizeDiagnosis = false;
    },
    add() {
      postData("case/addCustomMedicine", this.customizeDiagnosisForm).then((res) => {
        if (res.res_code === 1) {
          this.close();
          this.clear();
          this.$Message.success(res.msg);
        }else{
          this.$Message.error(res.msg)
        }
      });
    },
    cancel() {
      this.close();
      this.clear();
    },
    clear() {
      this.customizeDiagnosisForm = {
        medicine_type: "",
        medicine_name: "",
      };
    },
  },
};
</script>

<style>
</style>