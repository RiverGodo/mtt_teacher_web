<template>
    <Tabs style="height: 100%" v-model="panes">
        <TabPane label="数据概览" name="name1">
            <DataOverview v-if="panes == 'name1'" />
        </TabPane>
        <TabPane label="考试分析" name="name2">
            <ExamAnalysis v-if="panes == 'name2'" />
        </TabPane>
        <TabPane label="病例分析" name="name3">
            <CaseAnalysis v-if="panes == 'name3'" />
        </TabPane>
    </Tabs>
</template>

<script>
    import DataOverview from './data-overview'
    import CaseAnalysis from './case-analysis'
    import ExamAnalysis from './exam-analysis'

    export default {
        components: {DataOverview,CaseAnalysis,ExamAnalysis},
        name: '',
        data() {
            return {
                panes: 'name1'
            }
        }
    }
</script>

<style lang="less" scoped>
  .tab-name, /deep/.ivu-tabs-content, .data-management-main{
    height: 90vh !important;
    background-color: #f0f0f7;
  }
  /deep/ .ivu-btn{
      flex-direction: row !important;
      font-size: 14px !important;
  }
  .data-management-main{
    position: relative;
    padding: 10px;
    overflow-y: auto;
  }
  .case-analysis{
    height: 100% !important;
    background-color: #fff;
    overflow-y: auto;
  }
  /deep/ .ivu-select-dropdown{
      top: inherit !important
  }
</style>