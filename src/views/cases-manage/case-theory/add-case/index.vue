<template>
    <div class="theorymain">
        <div class="theorymain_top">
            <div class="theorymain_top_left">
                <div @click="handleBack()" class="theorymain_top_left_tep1">
                    <p>1. 基本信息</p>
                    <div class="header_blue"></div>
                </div>
                <div class="theorymain_top_left_tep2">
                    <div class="header_white"></div>
                    <p>2.添加题目</p>
                    <div class="header_next_white"></div>
                </div>
            </div>
            <p class="theorymain_top_middle">试卷总分：{{showScore()}}分，共{{caseList.length}}题</p>
            <div @click="showReview(true)" class="theorymain_top_btn1">
                <div style="margin-left: 25px;" class="cross"></div>
                <p>添加试题点评</p>
            </div>
            <!-- <div class="theorymain_top_btn2">
                <img :src="eyes" alt="">
                <p>预览</p>
            </div> -->
            <div @click="handleUp()" class="theorymain_top_right">
                <p>提交</p>
            </div>
        </div>
        <div class="add_case">
            <div v-for="(item, index) in caseList" :key="index" @click="canAdd2()" class="add_case_single">
                <div v-show="item.complete == 0">
                    <div class="single_top">
                        <div class="add_top_left">
                            <p>{{index+1}}、试题类型：</p>
                            <div class="radio">
                                <div @click="changeRadio(index,1)" class="radio_single">
                                    <div v-if="item.type == 1"  class="cycleright"><div class="block"></div></div>
                                    <div v-else class="cycle"></div>
                                    <p>单选题</p>
                                </div>
                                <div @click="changeRadio(index,2)" class="radio_single">
                                    <div v-if="item.type == 2"  class="cycleright"><div class="block"></div></div>
                                    <div v-else class="cycle"></div>
                                    <p>多选题</p>
                                </div>
                            </div>
                        </div>
                        <div class="single_top_right">
                            <div class="single_top_right_input">
                                <p>分值：</p>
                                <Input-number @on-change="changeScore(item)" style="width: 80px !important;" :max="100" :min="0" v-model="item.score"></Input-number>
                                <p style="margin-left: 10px;">分</p>
                            </div>
                            <div class="single_top_right_btn">
                                <div @click="handleComplate(item,index)" class="single_btn1">
                                    <p>完成</p>
                                </div>
                                <div @click="handDelSure(item,index)" class="single_btn2">
                                    <p>删除</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="single_middle">
                        <div class="single_middle_top">
                            <p>题目：</p>
                            <Input :id="'question'+index" v-model="item.question" style="width: 800px;" :autosize="{minRows: 4}" type="textarea" placeholder="请填写题目" />
                        </div>
                        <div class="single_middle_options">
                            <p class="options_title">选项：</p>
                            <div v-for="(item2, index2) in item.options" :key="index2" class="options_single">
                                <div class="options_single_top">
                                    <div :style="item2.type == 1 ? 'background: #4098FF;':'background: #9397AD;'" class="single_top_left">
                                        <p>{{setAlphabet(index2)}}</p>
                                    </div>
                                    <Input :id="'content'+index+index2" style="width: 767px;" v-model="item2.content" placeholder="请填写选项题目" />
                                    <img @click="handleDeleOption(index,index2)" :src="deletes" alt="">
                                </div>
                                <Input :id="'explain'+index+index2" :autosize="{minRows: 4}" style="width: 800px;" type="textarea" v-model="item2.explain" placeholder="请填写选项解析" />
                            </div>
                        </div>
                        <div v-show="caseList[index].options.length != 26" @click="addOptions(index)" class="add_options">
                            <div class="cross"></div>
                            <p>添加选项</p>
                        </div>
                        <div class="options_answer">
                            <p>答案：</p>
                            <div class="options_answer_main">
                                <div v-for="(item3, index3) in item.options" :key="index3" @click="addRight(index,index3)" class="answer_single">
                                    <div v-if="item3.type == 0" class="cycle"></div>
                                    <div v-else class="cycleright"><div class="block"></div></div>
                                    <p>{{setAlphabet(index3)}}</p>
                                </div>
                            </div>
                        </div>
                        <div class="options_point">
                            <p>考点：</p>
                            <Input :id="'exampoint'+index" :autosize="{minRows: 4}" style="width: 800px;" type="textarea" v-model="item.exam_point" placeholder="请填写考点" />
                        </div>
                        <div class="options_tree">
                            <p>对应思维树：</p>
                            <div @click="showOutline(1,index)" class="options_tree_select">
                                <p>请选择</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-show="item.complete == 1" class="case_main">
                    <div class="case_main_top">
                        <div class="top_left">
                            <p>{{index+1}}、试题类型：<span v-if="item.type == 1">单选题</span><span v-if="item.type == 2">多选题</span></p>
                        </div>
                        <div class="top_middle">
                            <p>分值：</p>
                            <Input-number @on-change="changeScore(item)" style="width: 80px !important;" :max="100" :min="0" v-model="item.score" placeholder="0"></Input-number>
                            <p style="margin-left: 10px;">分</p>
                        </div>
                        <div class="top_right">
                            <div @click="editCase(item,index)" class="btn_left">
                                <p>编辑</p>
                            </div>
                            <div @click="handDelSure(item,index)" class="btn_right">
                                <p>删除</p>
                            </div>
                        </div>
                    </div>
                    <div class="case_main_middle">
                        <div class="middle_text">
                            <span>题&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;目：</span>
                            <p>{{item.question}}</p>
                        </div>
                        <div class="middle_question">
                            <span>正确答案：</span>
                            <div>
                                <div v-for="(item2, index2) in item.options" :key="index2" v-show="item2.type == 1" class="question_block">
                                    <p class="title">{{setAlphabet(index2)}}、{{item2.content}}</p>
                                    <div class="block">
                                        <p><span>解析：</span>{{item2.explain}}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="middle_text">
                            <span>考&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;点：</span>
                            <p>{{item.exam_point}}</p>
                        </div>
                        <div class="middle_btn">
                            <span>对应思维树：</span>
                            <div @click="showOutline(2,index)" class="middle_btn_single">
                                <p>查看</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div @click="addCase()" class="add_title">
                <div class="cross2"></div>
                <p>添加试题</p>
            </div>
        </div>
        <errwind ref="errwind"></errwind>
        <div v-show="delwind" class="delwind">
            <div class="delwin_main">
                <p class="titles">确认删除试题？</p>
                <div class="delwin_btn">
                    <div @click="cansalDel()" class="delwin_btn_left">
                        <p>取消</p>
                    </div>
                    <div class="line">

                    </div>
                    <div @click="sureDel()" class="delwin_btn_right">
                        <p>确认</p>
                    </div>
                </div>
            </div>
        </div>
        <Modal v-model="reviewmodal" title="试题点评" footer-hide width="560">
            <Input v-model="comment" :rows="15" type="textarea" placeholder="请填写试题点评" />
            <div class="reviewbtn">
                <div @click="showReview(false)" class="reviewbtn_left">
                    <p>取消</p>
                </div>
                <div @click="addReview()" class="reviewbtn_right">
                    <p>保存</p>
                </div>
            </div>
        </Modal>
        <outlines ref="outline"></outlines>
    </div>
</template>

<script>
    import eyes from "../../../../assets/img/case/eyes.png"
    import deletes from "../../../../assets/img/case/delete2.png"
    import postData from 'src/api/postData'
    import errwind from '../components/errwind'
    import outlines from '../outlines/index'
    export default {
        name: 'theory-base',
        data() {
            return {
                eyes,
                deletes,
                delwind:false,
                items:{},
                indexs:0,
                reviewmodal:false,
                comment:'',
                commentype:0,
                caseList:[
                    {
                        score:0,
                        type:1,
                        question:'',
                        exam_point:'',
                        complete:0,
                        outline_node_id:null,
                        options:[
                            {
                                content:'',
                                explain:'',
                                type:0
                            },
                            {
                                content:'',
                                explain:'',
                                type:0
                            },
                            {
                                content:'',
                                explain:'',
                                type:0
                            },
                            {
                                content:'',
                                explain:'',
                                type:0
                            }
                        ]
                    }
                ],
                alphabet:["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
                componitem:null
            }
        },
        components: { errwind,outlines },
        methods: {
            showOutline(type,index){
                this.$refs.outline.showModals(type,index)
            },
            showReview(type){
                this.getComment()
                this.reviewmodal = type
            },
            handleBack(){
                // console.log(1);
                this.caseList.forEach((element,index) => {
                    if (!element.hasOwnProperty('isedit')) {
                        this.handleComplate(element,index)
                    }
                });
                this.$router.push({
                    name:'theory-base',
                    query:{
                        caseid:this.$route.query.caseid
                    }
                })
            },
            changeScore(item){
                if (item.score && item.hasOwnProperty('isedit')) {
                    postData("/v1/case/editTheory",{...item,case_id:parseInt(this.$route.query.caseid)}).then(res => {
                        if (res) {
                                console.log(res);
                        }
                    })
                }
            },
            addReview(){
                if (this.comment) {
                     postData('/v1/case/setTheoryComment',{case_id:parseInt(this.$route.query.caseid),comment:this.comment}).then(res => {
                        if (res.res_code == 1) {
                            this.showReview(false)
                        }
                    })
                } else {
                    // this.$refs.errwind.changeShow()
                    this.$Message.warning('请填写试题点评!')
                }
            },
            handleUp(){
                if (this.caseList.length) {
                    if (this.canAdd()) {
                        if (this.isSelect()) {
                            if (this.showScore() == 100) {
                                if (this.comment) {
                                    this.caseList.forEach((element,index) => {
                                        if (!element.hasOwnProperty('isedit')) {
                                            this.handleComplate(element,index)
                                        }
                                    });
                                    postData("/v1/case/modifyCaseInfo",{ case_id:parseInt(this.$route.query.caseid), state:1 }).then(res => {
                                        if (res.res_code == 1) {
                                            this.$router.push({
                                                name:'case-theory'
                                            })
                                        }
                                    })
                                } else {
                                    this.$Message.warning('您还未添加试题点评，请填写完成后再提交')
                                }
                            } else {
                                this.$Message.warning('满分必须为100分！')
                            }
                        } else {
                            // this.$Message.warning('请选择答案！')
                            this.$refs.errwind.changeShow()
                        }
                    } else {
                        // this.$Message.warning('请填写完整信息！')
                        this.$refs.errwind.changeShow()
                    }
                } else {
                    this.$Message.warning('您还未添加题目!')
                }
            },
            handleComplate(item,index,indexitem){
                let canadd = true
                if (!item.question) {
                    document.getElementById('question'+index).style.border = "1px solid #EA4605"
                    canadd = false
                }else{
                    document.getElementById('question'+index).style.border = "none"
                }
                if (!item.exam_point) {
                    document.getElementById('exampoint'+index).style.border = "1px solid #EA4605"
                    canadd = false
                }else{
                    document.getElementById('exampoint'+index).style.border = "none"
                }
                item.options.forEach((element2,index2) => {
                    if (!element2.content) {
                        document.getElementById('content'+index+index2).style.border = "1px solid #EA4605"
                        canadd = false
                    } else {
                        document.getElementById('content'+index+index2).style.border = "none"
                    }
                    if (!element2.explain) {
                        document.getElementById('explain'+index+index2).style.border = "1px solid #EA4605"
                        canadd = false
                    } else {
                        document.getElementById('explain'+index+index2).style.border = "none"
                    }
                });
                if (canadd) {
                    if (this.isSelect()) {
                        if (item.hasOwnProperty('isedit')) {
                            postData("/v1/case/editTheory",{...this.caseList[index],case_id:parseInt(this.$route.query.caseid)}).then(res => {
                                if (res) {
                                   this.caseList[index].complete = 1 
                                   if (indexitem) {
                                       this.caseList[indexitem].complete = 0
                                   }
                                   this.$forceUpdate()
                                }
                            })
                        } else {
                            postData("/v1/case/addTheory",{...this.caseList[index],case_id:parseInt(this.$route.query.caseid)}).then(res => {
                                if (res) {
                                //    this.caseList[index].complete = 1 
                                //    this.$forceUpdate()
                                    this.getD()
                                }
                            })
                        }
                        this.componitem = null
                    } else {
                        // this.$Message.warning('请选择答案！')
                        this.$refs.errwind.changeShow()
                    }
                } else {
                    // this.$Message.warning('请填写完整信息！')
                    this.$refs.errwind.changeShow()
                }
            },
            showScore(){
                let scores = 0
                this.caseList.forEach(element => {
                  scores += element.score
                });
                return scores
            },
            setAlphabet(index){
                return this.alphabet[index]
            },
            handleDeleOption(index1,index2){
                if (this.caseList[index1].options.length == 1) {
                    this.$Message.warning('选项最少为1项')
                } else {
                   if (this.caseList[index1].hasOwnProperty('isedit')) {
                        let pram = {
                            case_id:parseInt(this.$route.query.caseid),
                            id:parseInt(this.caseList[index1].options[index2].id),
                            case_theory_id:parseInt(this.caseList[index1].options[index2].case_theory_id)
                        }
                        postData('/v2/case/delTheoryOption',pram).then(res => {
                            if (res) {
                                this.caseList[index1].options.splice(index2,1)
                            }
                        })
                    } else {
                        this.caseList[index1].options.splice(index2,1)
                    } 
                }
            },
            handDelSure(item,index){
                this.delwind = true
                this.items = item
                this.indexs = index
            },
            sureDel(){
                this.handleDel(this.items,this.indexs)
                this.delwind = false
            },
            cansalDel(){
                this.delwind = false
            },
            handleDel(item,index){
                if (item.hasOwnProperty('isedit')) {
                    let pram = {
                        case_id:parseInt(this.$route.query.caseid),
                        id:item.id
                    }
                    postData('/v2/case/delTheory',pram).then(res => {
                        if (res.res_code == 1) {
                            this.caseList.splice(index,1)
                        }
                    })
                } else {
                    // console.log(2);
                    this.caseList.splice(index,1)
                }
                if (this.componitem) {
                    if (this.componitem.id == item.id) {
                        this.componitem = null
                    }  
                }
            },
            addOptions(index){
                this.caseList[index].options.push({
                    content:'',
                    explain:'',
                    type:0
                })
            },
            changeRadio(index,type){
                this.caseList[index].type = type
                this.caseList[index].options.forEach(element => {
                    element.type = 0
                });
            },
            addRight(index1,index2){
                if (this.caseList[index1].type == 1) {
                    this.caseList[index1].options.forEach(element => {
                        element.type = 0
                    });
                    this.caseList[index1].options[index2].type = 1
                } else {
                    if (this.caseList[index1].options[index2].type == 1) {
                        this.caseList[index1].options[index2].type = 0
                    } else {
                        this.caseList[index1].options[index2].type = 1
                    }
                }
            },
            editCase(item,index){
                if (this.canAdd()) {
                    if (this.isSelect()) {
                        if (this.componitem) {
                            let urls = ''
                            if (this.componitem.hasOwnProperty('isedit')) {
                                urls = '/v1/case/editTheory'
                            } else {
                                urls = '/v1/case/addTheory'
                            }
                            postData(urls,{...this.componitem,case_id:parseInt(this.$route.query.caseid)}).then(res => {
                                if (res) {
                                    postData("/v1/case/getTheoryList",{case_id:parseInt(this.$route.query.caseid)}).then(res2 => {
                                        if (res2.res_code == 1) {
                                            if (res2.data.length) {
                                                this.caseList = res2.data
                                                this.caseList.forEach(element => {
                                                    element.complete = 1 
                                                });
                                                this.caseList[index].complete = 0
                                                this.componitem = item
                                                this.$forceUpdate()
                                            }
                                        }
                                    })
                                }
                            })
                        }else{
                            this.caseList.forEach(element => {
                                element.complete = 1 
                            });
                            this.caseList[index].complete = 0
                            this.componitem = item
                            this.$forceUpdate()
                        }
                    } else {
                        // this.$Message.warning('请选择答案！')
                        this.$refs.errwind.changeShow()
                    }
                } else {
                    // this.$Message.warning('请填写完整信息！')
                    this.$refs.errwind.changeShow()
                }
            },
            isSelect(){
                let listlength = true
                for (let i = 0; i < this.caseList.length; i++) {
                    let numbers = 0
                    for (let p = 0; p < this.caseList[i].options.length; p++) {
                        numbers += this.caseList[i].options[p].type
                    }
                    if (numbers == 0) {
                        listlength = false
                        return
                    }
                }
                return listlength
                // console.log(listlength);
            },
            canAdd(){
                let canadd = true
                this.caseList.forEach((element,index) => {
                    if (!element.question) {
                        document.getElementById('question'+index).style.border = "1px solid #EA4605"
                        canadd = false
                    }else{
                        document.getElementById('question'+index).style.border = "none"
                    }
                    if (!element.exam_point) {
                        document.getElementById('exampoint'+index).style.border = "1px solid #EA4605"
                        canadd = false
                    }else{
                        document.getElementById('exampoint'+index).style.border = "none"
                    }
                    element.options.forEach((element2,index2) => {
                        if (!element2.content) {
                            document.getElementById('content'+index+index2).style.border = "1px solid #EA4605"
                            canadd = false
                        } else {
                            document.getElementById('content'+index+index2).style.border = "none"
                        }
                        if (!element2.explain) {
                            document.getElementById('explain'+index+index2).style.border = "1px solid #EA4605"
                            canadd = false
                        } else {
                            document.getElementById('explain'+index+index2).style.border = "none"
                        }
                    });
                });
                return canadd
            },
            canAdd2(){
                this.caseList.forEach((element,index) => {
                    if (element.question) {
                        document.getElementById('question'+index).style.border = "none"
                    }
                    if (element.exam_point) {
                        document.getElementById('exampoint'+index).style.border = "none"
                    }
                    element.options.forEach((element2,index2) => {
                        if (element2.content) {
                            document.getElementById('content'+index+index2).style.border = "none"
                        }
                        if (element2.explain) {
                            document.getElementById('explain'+index+index2).style.border = "none"
                        }
                    });
                });
            },
            addCase(){
                let list = {
                    score:0,
                    type:1,
                    question:'',
                    exam_point:'',
                    complete:0,
                    outline_node_id:'0',
                    options:[
                        {
                            content:'',
                            explain:'',
                            type:0
                        },
                        {
                            content:'',
                            explain:'',
                            type:0
                        },
                        {
                            content:'',
                            explain:'',
                            type:0
                        },
                        {
                            content:'',
                            explain:'',
                            type:0
                        }
                    ]
                }
                if (this.caseList.length) {
                    if (this.canAdd()) {
                        if (this.isSelect()) {
                            let urls = ''
                            if (this.componitem) {
                                if (this.componitem.hasOwnProperty('isedit')) {
                                    urls = '/v1/case/editTheory'
                                } else {
                                    urls = '/v1/case/addTheory'
                                }
                                postData(urls,{...this.componitem,case_id:parseInt(this.$route.query.caseid)}).then(res => {
                                    if (res) {
                                        postData("/v1/case/getTheoryList",{case_id:parseInt(this.$route.query.caseid)}).then(res2 => {
                                            if (res2.res_code == 1) {
                                                if (res2.data.length) {
                                                    this.caseList = res2.data
                                                    this.caseList.forEach(element => {
                                                        element.complete = 1 
                                                    });
                                                    this.caseList.push(list)
                                                    this.componitem = this.caseList[this.caseList.length-1]
                                                }
                                            }
                                        })
                                    }
                                })
                            }else{
                                this.caseList.forEach(element => {
                                    element.complete = 1 
                                });
                                this.caseList.push(list)
                                this.componitem = this.caseList[this.caseList.length-1]
                            }
                        } else {
                            // this.$Message.warning('请选择答案！')
                            this.$refs.errwind.changeShow()
                        }
                    } else {
                        // this.$Message.warning('请填写完整信息！')
                        this.$refs.errwind.changeShow()
                    }
                } else {
                    this.caseList.push(list)
                }
            },
            getD(){
                postData("/v1/case/getTheoryList",{case_id:parseInt(this.$route.query.caseid)}).then(res => {
                    if (res.res_code == 1) {
                        if (res.data.length) {
                            this.caseList = res.data
                            this.caseList.forEach(element => {
                                element.complete = 1
                                element.isedit = 1
                            });
                        }else{
                            this.componitem = this.caseList[0]
                        }
                    }
                })
            },
            getComment(){
                postData("/v1/case/getTheoryComment",{case_id:parseInt(this.$route.query.caseid)}).then(res => {
                    if (res.res_code == 1) {
                        console.log(res);
                        this.comment = res.data.theory_comment
                    }
                })
            }
        },
        mounted() {
            // console.log(this.$route.query);
            if (this.$route.query.caseid) {
                this.getD()
                this.getComment()
            }
        }
    }
</script>

<style lang="less" scoped>
    .theorymain{
        width: 100%;
        height: 100%;
        background: #eeeef6;
        overflow: unset;
        .theorymain_top{
            display: flex;
            align-items: center;
            height: 50px;
            .theorymain_top_left{
                display: flex;
                align-items: center;
                .theorymain_top_left_tep1{
                    width: 110px;
                    height: 30px;
                    background: #4098FF;
                    margin-left: 10px;
                    position: relative;
                    cursor: pointer;
                    p{
                        font-family: PingFangSC-Medium;
                        font-size: 16px;
                        color: #FFFFFF;
                        letter-spacing: 0;
                        line-height: 30px;
                    }
                    .header_blue{
                        z-index: 2;
                        border: 15px solid;
                        border-color: transparent transparent transparent #4098FF;
                        position: absolute;
                        right: -30px;
                        top: 0;
                    }
                }
                .theorymain_top_left_tep2{
                    width: 110px;
                    height: 30px;
                    background: #4098FF;
                    margin-left: 10px;
                    position: relative;
                    p{
                        font-family: PingFangSC-Medium;
                        font-size: 16px;
                        color: #FFFFFF;
                        letter-spacing: 0;
                        line-height: 30px;
                        margin-left: 20px;
                    }
                    .header_white{
                        z-index: 1;
                        width: 20px;
                        border: 15px solid;
                        border-color: transparent transparent transparent #eeeef6;
                        position: absolute;
                    }
                    .header_next_white{
                        z-index: 2;
                        border: 15px solid;
                        border-color: transparent transparent transparent #4098FF;
                        position: absolute;
                        right: -30px;
                        top: 0;
                    }
                }
            }
            .theorymain_top_middle{
                font-family: PingFangSC-Regular;
                font-size: 16px;
                color: #333333;
                letter-spacing: 0;
                text-align: center;
                margin-left: 45px;
            }
            .theorymain_top_btn1{
                display: flex;
                align-items: center;
                width: 133px;
                height: 30px;
                background: #FFFFFF;
                border-radius: 2px;
                border-radius: 2px;
                cursor: pointer;
                margin-left: auto;
                p{
                    font-family: PingFangSC-Medium;
                    font-size: 14px;
                    color: #4098FF;
                    letter-spacing: 0;
                    text-align: center;
                    margin-left: 10px;
                }
            }
            .theorymain_top_btn2{
                width: 100px;
                height: 30px;
                background: #FFFFFF;
                border-radius: 2px;
                border-radius: 2px;
                display: flex;
                align-items: center;
                margin-left: 10px;
                margin-right: 10px;
                cursor: pointer;
                img{
                    width: 17.5px;
                    height: 11.8px;
                    margin-left: 24px;
                    margin-right: 5.5px;
                }
                p{
                    font-family: PingFangSC-Medium;
                    font-size: 14px;
                    color: #4098FF;
                    letter-spacing: 0;
                    text-align: center;
                }
            }
            .theorymain_top_right{
                background: #4098FF;
                border-radius: 2px;
                border-radius: 2px;
                width: 100px;
                height: 30px;
                margin-left: 10px;
                margin-right: 10px;
                cursor: pointer;
                p{
                    font-family: PingFangSC-Medium;
                    font-size: 14px;
                    color: #FFFFFF;
                    letter-spacing: 0;
                    text-align: center;
                    line-height: 30px;
                }
            }
        }
        .add_case{
            // background: #FFFFFF;
            border-radius: 4px;
            border-radius: 4px;
            margin-left: 10px;
            margin-right: 10px;
            height: 90vh;
            overflow: auto;
            .add_case_single{
                padding: 30px;
                margin-bottom: 10px;
                background: #FFFFFF;
                .single_top{
                    display: flex;
                    align-items: center;
                    border-bottom: 1px solid #EDEDED;
                    padding-bottom: 15.5px;
                    .add_top_left{
                        display: flex;
                        align-items: center;
                        p{
                            font-family: PingFangSC-Medium;
                            font-size: 16px;
                            color: #333333;
                            letter-spacing: 0;
                            margin-right: 15px;
                        }
                        .radio{
                            display: flex;
                            align-items: center;
                            .radio_single{
                                display: flex;
                                align-items: center;
                                cursor: pointer;
                                p{
                                    font-family: PingFangSC-Regular;
                                    font-size: 16px;
                                    color: #333333;
                                    letter-spacing: 0;
                                    // margin-left: 10px;
                                }
                                .cycle{
                                    width: 20px;
                                    height: 20px;
                                    background: #FFFFFF;
                                    border: 1px solid #9397AD;
                                    border-radius: 50%;
                                    margin-right: 10px;
                                }
                                .cycleright{
                                    width: 20px;
                                    height: 20px;
                                    background: #FFFFFF;
                                    border: 1px solid #4098FF;
                                    border-radius: 50%;
                                    margin-right: 10px;
                                    position: relative;
                                    .block{
                                        width: 10px;
                                        height: 10px;
                                        background: #4098FF;
                                        position: absolute;
                                        border-radius: 50%;
                                        left: 0;
                                        right: 0;
                                        top: 0;
                                        bottom: 0;
                                        margin: auto;
                                    }
                                }
                            }
                        }
                    }
                    .single_top_right{
                        display: flex;
                        align-items: center;
                        margin-left: auto;
                        .single_top_right_input{
                            display: flex;
                            align-items: center;
                            margin-right: 50px;
                            p{
                                font-family: PingFangSC-Regular;
                                font-size: 16px;
                                color: #333333;
                                letter-spacing: 0;
                                text-align: right;
                            }
                            /deep/ .ivu-input-number-input{
                                text-align: center;
                            }
                        }
                        .single_top_right_btn{
                            display: flex;
                            align-items: center;
                            .single_btn1{
                                background: #4098FF;
                                border-radius: 2px;
                                border-radius: 2px;
                                width: 100px;
                                height: 30px;
                                cursor: pointer;
                                margin-right: 10px;
                                p{
                                    font-family: PingFangSC-Medium;
                                    font-size: 14px;
                                    color: #FFFFFF;
                                    letter-spacing: 0;
                                    text-align: center;
                                    line-height: 30px;
                                }
                            }
                            .single_btn2{
                                background: #EA4605;
                                border-radius: 2px;
                                border-radius: 2px;
                                width: 70px;
                                height: 30px;
                                cursor: pointer;
                                p{
                                    font-family: PingFangSC-Medium;
                                    font-size: 14px;
                                    color: #FFFFFF;
                                    letter-spacing: 0;
                                    text-align: center;
                                    line-height: 30px;
                                }
                            }
                        }
                    }
                }
                .single_middle{
                    margin-top: 20px;
                    .single_middle_top{
                        text-align: left;
                        p{
                            font-family: PingFangSC-Medium;
                            font-size: 16px;
                            color: #333333;
                            letter-spacing: 0;
                            margin-bottom: 10px;
                        }
                    }
                    .single_middle_options{
                        margin-top: 20px;  
                        .options_title{
                            text-align: left;
                            font-family: PingFangSC-Medium;
                            font-size: 16px;
                            color: #333333;
                            letter-spacing: 0;
                            margin-bottom: 10px;
                        }
                        .options_single{
                            margin-bottom: 20px;
                            text-align: left;
                            .options_single_top{
                                display: flex;
                                align-items: center;
                                margin-bottom: 10px;
                                .single_top_left{
                                    width: 34px;
                                    height: 34px;
                                    background: #9397AD;
                                    border-radius: 2px 0 0 2px;
                                    border-radius: 2px 0px 0px 2px;
                                    p{
                                        font-family: PingFangSC-Medium;
                                        font-size: 16px;
                                        color: #FFFFFF;
                                        letter-spacing: 0;
                                        text-align: center;
                                        line-height: 34px;
                                    }
                                }
                                img{
                                    width: 17px;
                                    height: 17px;
                                    cursor: pointer;
                                    margin-left: 12.5px;
                                }
                                /deep/ .ivu-input{
                                    height: 34px;
                                }
                            }
                        }
                    }
                    .add_options{
                        width: 150px;
                        height: 34px;
                        background: #FFFFFF;
                        border: 1px solid #4098FF;
                        border-radius: 2px;
                        border-radius: 2px;
                        display: flex;
                        align-items: center;
                        cursor: pointer;
                        p{
                            font-family: PingFangSC-Regular;
                            font-size: 16px;
                            color: #4098FF;
                            letter-spacing: 0;
                            margin-left: 15px;
                        }
                    }
                    .options_answer{
                        display: flex;
                        align-items: center;
                        margin-top: 30px;
                        p{
                            font-family: PingFangSC-Medium;
                            font-size: 16px;
                            color: #333333;
                            letter-spacing: 0;
                        }
                        .options_answer_main{
                            width: 800px;
                            display: flex;
                            flex-wrap: wrap;
                            align-content: flex-start;
                            overflow-y: auto;
                            justify-content: flex-start;
                        }
                        .answer_single{
                            display: flex;
                            align-items: center;
                            margin-left: 20px;
                            cursor: pointer;
                            width: 50px;
                            .cycle{
                                width: 20px;
                                height: 20px;
                                background: #FFFFFF;
                                border: 1px solid #9397AD;
                                border-radius: 50%;
                                margin-right: 10px;
                            }
                            .cycleright{
                                width: 20px;
                                height: 20px;
                                background: #FFFFFF;
                                border: 1px solid #4098FF;
                                border-radius: 50%;
                                margin-right: 10px;
                                position: relative;
                                .block{
                                    width: 10px;
                                    height: 10px;
                                    background: #4098FF;
                                    position: absolute;
                                    border-radius: 50%;
                                    left: 0;
                                    right: 0;
                                    top: 0;
                                    bottom: 0;
                                    margin: auto;
                                }
                            }
                        }
                    }
                    .options_point{
                        margin-top: 30px;
                        text-align: left;
                        p{
                            font-family: PingFangSC-Medium;
                            font-size: 16px;
                            color: #333333;
                            letter-spacing: 0;
                            text-align: left;
                            margin-bottom: 10px;
                        }
                    }
                    .options_tree{
                        display: flex;
                        align-items: center;
                        margin-top: 20px;
                        p{
                            font-family: PingFangSC-Medium;
                            font-size: 16px;
                            color: #333333;
                            letter-spacing: 0;
                        }
                        .options_tree_select{
                            width: 150px;
                            height: 34px;
                            background: #FFFFFF;
                            border: 1px solid #4098FF;
                            border-radius: 2px;
                            border-radius: 2px;
                            cursor: pointer;
                            p{
                                font-family: PingFangSC-Regular;
                                font-size: 16px;
                                color: #4098FF;
                                letter-spacing: 0;
                                line-height: 32px;
                            }
                        }
                    }
                }
                .case_main{
                    .case_main_top{
                        display: flex;
                        align-items: center;
                        border-bottom: 1px solid #ededed;
                        padding-bottom: 16px;
                        margin-bottom: 20px;
                        .top_left{
                            margin-right: 30px;
                            p{
                                font-family: PingFangSC-Medium;
                                font-size: 16px;
                                color: #333333;
                                letter-spacing: 0;
                            }
                            span{
                                font-family: PingFangSC-Regular;
                                font-size: 16px;
                                color: #333333;
                                letter-spacing: 0;
                            }
                        }
                        .top_middle{
                            display: flex;
                            align-items: center;
                            p{
                                font-family: PingFangSC-Regular;
                                font-size: 16px;
                                color: #333333;
                                letter-spacing: 0;
                                text-align: right;
                            }
                             /deep/ .ivu-input-number-input{
                                text-align: center;
                            }
                        }
                        .top_right{
                            display: flex;
                            align-items: center;
                            margin-left: auto;
                            .btn_left{
                                width: 100px;
                                height: 30px;
                                background: #4098FF;
                                border-radius: 2px;
                                border-radius: 2px;
                                margin-right: 10px;
                                cursor: pointer;
                                p{
                                    font-family: PingFangSC-Medium;
                                    font-size: 14px;
                                    color: #FFFFFF;
                                    letter-spacing: 0;
                                    text-align: center;
                                    line-height: 30px;
                                }
                            }
                            .btn_right{
                                width: 70px;
                                height: 30px;
                                background: #EA4605;
                                border-radius: 2px;
                                border-radius: 2px;
                                cursor: pointer;
                                p{
                                    font-family: PingFangSC-Medium;
                                    font-size: 14px;
                                    color: #FFFFFF;
                                    letter-spacing: 0;
                                    text-align: center;
                                    line-height: 30px;
                                }
                            }
                        }
                    }
                    .case_main_middle{
                        .middle_text{
                            display: flex;
                            align-items: flex-start;
                            margin-bottom: 20px;
                            span{
                                font-family: PingFangSC-Medium;
                                font-size: 16px;
                                color: #4098FF;
                                letter-spacing: 0;
                            }
                            p{
                                font-family: PingFangSC-Regular;
                                font-size: 16px;
                                color: #333333;
                                letter-spacing: 0;
                                width: 800px;
                                text-align: left;
                            }
                        }
                        .middle_question{
                            display: flex;
                            align-items: flex-start;
                            span{
                                font-family: PingFangSC-Medium;
                                font-size: 16px;
                                color: #4098FF;
                                letter-spacing: 0;
                            }
                            .question_block{
                                margin-bottom: 20px;
                                .title{
                                    font-family: PingFangSC-Regular;
                                    font-size: 16px;
                                    color: #333333;
                                    letter-spacing: 0;
                                    text-align: left;
                                    margin-bottom: 10px;
                                }
                                .block{
                                    width: 800px;
                                    background: #F4F9FF;
                                    border-radius: 2px;
                                    border-radius: 2px;
                                    padding: 10px 15px;
                                    span{
                                        font-family: PingFangSC-Medium;
                                        font-size: 16px;
                                        color: #333333;
                                        letter-spacing: 0;
                                        text-align: justify;
                                        line-height: 24px;
                                    }
                                    p{
                                        font-family: PingFangSC-Regular;
                                        font-size: 16px;
                                        color: #151515;
                                        letter-spacing: 0;
                                        text-align: justify;
                                        line-height: 24px;
                                    }
                                }
                            }
                        }
                        .middle_btn{
                            display: flex;
                            align-items: center;
                            span{
                                font-family: PingFangSC-Medium;
                                font-size: 16px;
                                color: #4098FF;
                                letter-spacing: 0;
                            }
                            .middle_btn_single{
                                width: 100px;
                                height: 34px;
                                background: #FFFFFF;
                                border: 1px solid #4098FF;
                                border-radius: 2px;
                                border-radius: 2px;
                                cursor: pointer;
                                p{
                                    font-family: PingFangSC-Regular;
                                    font-size: 16px;
                                    color: #4098FF;
                                    letter-spacing: 0;
                                    line-height: 34px;
                                }
                            }
                        }
                    }
                }
            }
        }
        .add_title{
            width: 250px;
            height: 34px;
            background: #4098FF;
            border-radius: 2px;
            border-radius: 2px;
            display: flex;
            align-items: center;
            margin: 0 auto;
            margin-bottom: 80px;
            margin-top: 20px;
            cursor: pointer;
            p{
                font-family: PingFangSC-Medium;
                font-size: 16px;
                color: #FFFFFF;
                letter-spacing: 0;
            }
        }
        .cross{
            background: #4098FF;
            height: 14px;
            position: relative;
            width: 2px;
            margin-left: 35px;
        }
        .cross::after{
            background: #4098FF;
            content: "";
            height: 2px;
            left: -6px;
            position: absolute;
            top: 6px;
            width: 14px;
        }
        .cross2{
            background: #ffffff;
            height: 14px;
            position: relative;
            width: 2px;
            margin-left: 85px;
            margin-right: 15px;
        }
        .cross2::after{
            background: #ffffff;
            content: "";
            height: 2px;
            left: -6px;
            position: absolute;
            top: 6px;
            width: 14px;
        }
    }
    .delwind{
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        z-index: 999;
        .delwin_main{
            width: 300px;
            height: 145px;
            border-radius: 10px;
            background: #ffffff;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            .titles{
                font-family: PingFangSC-Regular;
                font-size: 18px;
                color: #333333;
                text-align: center;
                height: 100px;
                line-height: 100px;
            }
            .delwin_btn{
                height: 45px;
                display: flex;
                align-items: center;
                border-top: 1px solid #e6e6e6;
                .delwin_btn_left{
                    width: 50%;
                    text-align: center;
                    line-height: 45px;
                    font-family: PingFangSC-Regular;
                    font-size: 16px;
                    color: #777272;
                    text-align: center;
                    cursor: pointer;
                }   
                .line{
                    width: 1px;
                    height: 45px;
                    background: #e6e6e6;
                }
                .delwin_btn_right{
                    width: 50%;
                    text-align: center;
                    line-height: 45px;
                    font-family: PingFangSC-Regular;
                    font-size: 16px;
                    color: #4098ff;
                    text-align: center;
                    cursor: pointer;
                }
            }
        }
    }
    .reviewbtn{
        display: flex;
        align-items: center;
        margin-top: 15px;
        .reviewbtn_left{
            background: #FFFFFF;
            border: 1px solid #4098FF;
            border-radius: 2px;
            border-radius: 2px;
            width: 140px;
            height: 30px;
            cursor: pointer;
            margin-left: auto;
            margin-right: 20px;
            p{
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #4098FF;
                text-align: center;
                line-height: 30px;
            }
        }
        .reviewbtn_right{
            background: #4098FF;
            border-radius: 2px;
            border-radius: 2px;
            border: 1px solid #4098FF;
            width: 140px;
            height: 30px;
            cursor: pointer;
            margin-right: auto;
            margin-left: 20px;
            p{
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #FFFFFF;
                text-align: center;
                line-height: 30px;
            }
        }
    }
</style>