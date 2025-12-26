<template>
    <Modal v-model="modal2" footer-hide title="思维树" width="1000">
        <div v-show="modaltype == 1" class="modal_text">
            <p>提示：请在思维树中选择与题目相关的模块，以便学生更好理解临床诊疗思维。</p>
        </div>
        <div class="modal_main">
            <outlines ref="DiagnosisOutlines" :dragcanvas="true" :canClick="modaltype == 1 ? true : false"/>
        </div>
        <div v-show="modaltype == 1" class="modal_bottom">
            <div @click="handleSure()" class="modal_button">
                <p>确认</p>
            </div>
        </div>
    </Modal>
</template>

<script>
    import outlines from 'components/outlines/index'
    import showoutlines from 'components/outlines/index'
    export default {
        components: { outlines,showoutlines },
        data() {
            return {
                modal2:false,
                selects:false,
                parentindex:null,
                modaltype:1 //编辑1查看2
            }
        },
        methods: {
            showModals(type,index){
                this.modaltype = type
                this.parentindex = index
                this.modal2 = !this.modal2
                this.selects = false
                if (this.modal2) {
                    PostData('/v1/case/getOutline', {case_id: parseInt(this.$route.query.caseid)}).then(res => {
                        if(res.res_code == 1) {
                            let adds = JSON.parse(res.data.outline)
                            adds.nodes.forEach(element => {
                                if (element.fill) {
                                    element.fill = ''
                                }
                                if (element.color) {
                                    element.color = '#333333'
                                }
                                if (element.stroke) {
                                    element.stroke = ''
                                }
                            });
                            let parentdata = JSON.parse(this.$parent.caseList[index].outline_node_id)
                            console.log(parentdata);
                            for (let i = 0; i < adds.nodes.length; i++) {
                                if (parentdata && parentdata.length) {
                                    for (let p = 0; p < parentdata.length; p++) {
                                        if (parentdata[p].child_shape_id) {
                                            if (adds.nodes[i].children && adds.nodes[i].children.length) {
                                                for (let d = 0; d < adds.nodes[i].children.length; d++) {
                                                    if (adds.nodes[i].children[d].parent_node_id == parentdata[p].id && adds.nodes[i].children[d].child_shape_id == parentdata[p].child_shape_id) {
                                                        adds.nodes[i].children[d].color = "#ffffff"
                                                        adds.nodes[i].children[d].fill = "#D05F00"
                                                        adds.nodes[i].children[d].stock = "#D05F00"
                                                        this.selects = true
                                                    }
                                                }
                                            }
                                        } else {
                                            if (adds.nodes[i].id == parentdata[p].id) {
                                                adds.nodes[i].color = "#ffffff"
                                                adds.nodes[i].fill = "#D05F00"
                                                adds.nodes[i].stock = "#D05F00"
                                                this.selects = true
                                            }
                                        }
                                    }
                                }
                            }
                            this.$refs.DiagnosisOutlines.data = adds
                            this.$refs.DiagnosisOutlines.graph.read(adds)
                            this.$refs.DiagnosisOutlines.updateCanvasSize()
                        }
                    })
                }
            },
            handleSure(){
                let selectdata = []
                let evt = this.$refs.DiagnosisOutlines.data.nodes
                evt.forEach(element => {
                    if (element.children) {
                        if (element.children.length) {
                            element.children.forEach(events => {
                                if (events.color == "#ffffff") {
                                    selectdata.push({
                                        id:events.parent_node_id,
                                        child_shape_id:events.child_shape_id
                                    })
                                }
                            });
                        } else {
                           if (element.color == "#ffffff") {
                                selectdata.push({
                                    id:element.id
                                })
                            } 
                        }
                    } else {
                        if (element.color == "#ffffff") {
                            selectdata.push({
                                id:element.id
                            })
                        }
                    }
                });
                this.modal2 = false
                this.$parent.caseList[this.parentindex].outline_node_id = JSON.stringify(selectdata)
                // console.log(selectdata);
            },
            changeSelects(){
                this.selects = true
            }
        }
    }
</script>

<style lang="less" scoped>
    .modal_text{
        width: 100%;
        height: 30px;
        background: #FFF5D7;
        position: absolute;
        left: 0;
        right: 0;
        top: 50px;
        p{
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #D05F00;
            letter-spacing: 0;
            text-align: justify;
            margin-left: 30px;
            line-height: 30px;
        }
    }
    .modal_main{
        margin-top: 30px;
    }
    .modal_bottom{
        width: 100%;
        height: 50px;
        background: #FFFFFF;
        border-radius: 0 0 8px 8px;
        border-top: 1px solid #CDCED3;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        .modal_button{
            width: 260px;
            height: 36px;
            background: #4098FF;
            border-radius: 4px;
            border-radius: 4px;
            margin: 7px auto;
            cursor: pointer;
            p{
                font-family: PingFangSC-Regular;
                font-size: 16px;
                color: #FFFFFF;
                letter-spacing: 0;
                text-align: center;
                line-height: 36px;
            }
        }
    }
</style>