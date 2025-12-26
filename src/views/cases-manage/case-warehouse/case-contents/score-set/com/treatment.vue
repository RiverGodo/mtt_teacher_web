<template>
    <div class="main">
        <div :style="`width: ${casePane == 2 ? '1061px' : '561px' }`" class="tabs-view tabs-content">
            <Tabs @on-click="tabs" v-model="casePane" type="line" size="small" class="tabs">
                <TabPane name="1" label="防治与诊疗计划">
                   <OperationLeft :type="page"/>
                </TabPane>
                <TabPane name="2" label="解读分析">
                   <!-- <OperationLeft :type="page"/> -->
                   <unscramble-list :type="page" />
                </TabPane>
            </Tabs>
        </div>
        <div v-show="casePane == 1" class="content let-content">
            <TreatmentRight :type="page" />
        </div>
    </div>
</template>

<script>
    import OperationLeft from './operation-left'
    import TreatmentRight from './treatment-right.vue'
    import unscrambleList from './unscramble-list.vue'

    export default {
        components: { OperationLeft, TreatmentRight, unscrambleList },
        props: {
            page: {
                type: String,
                default: ''
            },
        },
        data() {
            return {
                typePane: '',
                casePane: '1'
            }
        },
        methods: {
            tabs(name){
                this.typePane = name == 2 ? 'term' : ''
                // console.log(this.casePane);
            },
        },
    }
</script>

<style lang="less" scoped>
    @import '../../details-diagnosis/com/details.less';
    /deep/ .ivu-tabs-nav-container:focus .ivu-tabs-tab-focused{
        border-color: #f0f0f7 !important;
    }
    /deep/ .ivu-tabs-tabpane{
        height: 597px;
    }
    .tabs-content{
        box-shadow: 0 0 6px 0 rgba(0,0,0,0.10);
        border-radius: 3px;
        .tabs5{
            width: 100%;
            /deep/ .ivu-tabs-tab-active{
                color: #474C63;
            }
            /deep/ .ivu-tabs-ink-bar{
                background-color: #F0F0F7 !important;
            }
            /deep/ .ivu-tabs-nav{
                width: 100%;
                margin: 0 !important;
                /deep/ .ivu-tabs-ink-bar{
                    margin: 0 !important;
                    height: 2px !important;
                    width: 100% !important;
                }
                /deep/ .ivu-tabs-tab{
                     height: 49px !important;
                     width: 100% !important;
                     font-family: PingFangSC-Medium;
                     font-size: 18px;
                     margin: 0 0 2px 0 !important;
                     padding: 0 !important;
                     border: 1px solid #F0F0F7 !important;
                }
            }
        }
                .tabs{
            width: 100%;
            /deep/ .ivu-tabs-nav-scroll{
                justify-content: flex-start;
            }
            /deep/ .ivu-tabs-nav{
                width: 561px;
                margin: 0 !important;
                /deep/ .ivu-tabs-ink-bar{
                    margin: 0 !important;
                    height: 2px !important;
                    width: 100%/2 !important;
                }
                /deep/ .ivu-tabs-tab{
                     height: 49px !important;
                     width: 100%/2 !important;
                     font-family: PingFangSC-Medium;
                     font-size: 18px;
                     margin: 0 0 2px 0 !important;
                     padding: 0 !important;
                     border: 1px solid #F0F0F7 !important;
                }
            }
        }
    }
    .let-content{
        background: rgba(240,240,247,0.30);
        border-radius: 3px;
    }
</style>