<template>
    <div class="theorymain">
        <div class="theorymain_top">
            <div class="theorymain_top_left">
                <div class="theorymain_top_left_tep1">
                    <p>1. 基本信息</p>
                    <div class="header_blue"></div>
                </div>
                <div class="theorymain_top_left_tep2">
                    <div class="header_white"></div>
                    <p>2.添加题目</p>
                    <div class="header_next_white"></div>
                </div>
            </div>
            <div @click="handleSubmit('formValidate')" class="theorymain_top_right">
                <p>下一步</p>
            </div>
        </div>
        <div class="theorymain_middle">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate">
                <div class="theorymain_middle_tep1">
                <div class="tep_title">
                    <div class="block"></div>
                    <p>病例信息</p>
                </div>
                <div class="tep1_main">
                    <div class="tep1_main_single1">
                        <p>病例名称：</p>
                        <FormItem prop="symptom">
                            <Input style="width:600px;" maxlength="15" v-model="formValidate.symptom" placeholder="填写病例名称（最多15个字）" />
                        </FormItem>
                    </div>
                    <div class="tep1_main_single2">
                        <div class="single2_block">
                            <p>首要专科：</p>
                            <FormItem prop="division">
                                <Select style="width: 250px;" v-model="formValidate.division" @on-change="selectChange">
                                    <Option v-for="item in select1" :value="item.patient_division" :key="item.id">{{item.patient_division}}</Option>
                                </Select>
                            </FormItem>
                        </div>
                        <div class="single2_block">
                            <p>病例难度：</p>
                            <FormItem prop="degree">
                                <Select style="width: 250px;" v-model="formValidate.degree" @on-change="selectDegree">
                                    <Option v-for="item in select2" :value="item.title" :key="item.title">{{item.title}}</Option>
                                </Select>
                            </FormItem>
                        </div>
                    </div>
                    <div class="tep1_main_single3">
                        <p>关联提纲：</p>
                        <div @click="handleShowOutline()" v-if="!outlineName" class="single3_btn">
                            <div class="cross"></div>
                            <p>选择提纲</p>
                        </div>
                        <div v-else-if="this.$route.query.caseid" style="cursor: no-drop;" class="single3_btn2">
                            <p>{{outlineName}}</p>
                        </div>
                        <div @click="handleShowOutline()" class="single3_btn2" v-else>
                            <p>{{outlineName}}</p>
                        </div>
                    </div>
                    <div class="tep1_main_single4">
                        <p>学习大纲：</p>
                        <FormItem prop="abstract">
                            <Input v-model="formValidate.abstract" :autosize="{minRows: 4}" type="textarea" style="width:600px" placeholder="简述病例需要学生掌握知识点，以及诊疗方案" />
                        </FormItem>
                    </div>
                </div>
            </div>
            <div class="theorymain_middle_tep2">
                <div class="tep_title">
                    <div class="block"></div>
                    <p>患者信息</p>
                </div>
                <div class="tep2_main_single1">
                    <div class="single1_block">
                        <p class="single1_title">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：</p>
                        <div class="single1_block_input1">
                            <FormItem prop="name">
                                <Input style="width: 252px !important;" v-model="formValidate.name" placeholder="请输入姓名" />
                            </FormItem>
                            <p @click="createName()">自动生成</p>
                        </div>
                    </div>
                    <div class="single1_block">
                        <p class="single1_title">年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;龄：</p>
                        <div class="single1_block_input2">
                            <FormItem prop="age">
                                <InputNumber class="case-name" style="width: 252px !important;" :min="0" :max="999" type="text" v-model="formValidate.age"/>
                            </FormItem>
                            <Select style="width: 74px;position: absolute;right: 0;top: 0;" v-model="age">
                                <Option value="岁">岁</Option>
                                <Option value="月">月</Option>
                                <Option value="周">周</Option>
                                <Option value="日">日</Option>
                            </Select>
                        </div>
                    </div>
                </div>
                <div class="tep2_main_single2">
                    <p class="single2_title">性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别：</p>
                    <div class="single2_checkbox">
                        <div @click="changeSex('Male')" class="single2_checkbox_block">
                            <div class="block">
                                <img v-show="sex == 'Male'" :src="right" alt="">
                            </div>
                            <p>男</p>
                        </div>
                        <div @click="changeSex('Female')" class="single2_checkbox_block">
                            <div class="block">
                                <img v-show="sex == 'Female'" :src="right" alt="">
                            </div>
                            <p>女</p>
                        </div>
                    </div>
                </div>
                <div class="tep2_main_single3">
                    <p>患者情况：</p>
                    <FormItem prop="complaint">
                        <Input :autosize="{minRows: 4}" type="textarea" v-model="formValidate.complaint" style="width:600px" placeholder="请输入患者情况" />
                    </FormItem>
                </div>
            </div>
            <div class="theorymain_middle_tep3">
                <div class="tep_title">
                    <div class="block"></div>
                    <p>场景设置</p>
                </div>
                <div class="tep3_main">
                    <div class="tep3_main_single1">
                        <p>场景设计：</p>
                        <FormItem prop="desc">
                            <Input :autosize="{minRows: 4}" type="textarea" v-model="formValidate.desc" style="width:600px" placeholder="形象生动的描写诊疗场景" />
                        </FormItem>
                    </div>
                    <div class="tep3_main_single2">
                        <p>操作限时：</p>
                        <FormItem prop="time">
                            <InputNumber :min="0" :max="999" v-model="formValidate.time" style="width:100px !important;" />
                        </FormItem>
                        <p style="margin-left: 10px;">分钟</p>
                    </div>
                </div>
            </div>
            </Form>
        </div>
        <outlineModal @outline-cancel="outlineCancel" ref="defaultSelect"  :isShow="isShow" @outline_submit="outlineSubmit" :newDepInfo='newDepInfo'/>
        <errwind ref="errwind"></errwind>
    </div>
</template>

<script>
    import postData from 'src/api/postData';
    import outlineModal from "./components/outline";
    import right from '../../../../assets/img/case/right.png'
    import errwind from '../components/errwind'
    export default {
        name: 'theory-base',
        data() {
            return {
                right,
                deptList:[],
                select1:[],
                select2: [
                    { id: 1, title: "简单" },
                    { id: 2, title: "适中" },
                    { id: 3, title: "困难" }
                ],
                ruleValidate:{
                    symptom:[
                        { required: true, message: '请填写病例名称', trigger: 'blur' }
                    ],
                    division:[
                        { required: true, message: '请选择首要专科', trigger: 'change' }
                    ],
                    abstract:[
                        { required: true, message: '请填写学习大纲', trigger: 'blur' }
                    ],
                    name:[
                        { required: true, message: '请填写患者姓名', trigger: 'blur' }
                    ],
                    complaint:[
                        { required: true, message: '请填写患者情况', trigger: 'blur' }
                    ],
                    desc:[
                        { required: true, message: '请填写场景设计', trigger: 'blur' } 
                    ],
                    degree:[
                        { required: true, message: '请选择病例难度', trigger: 'change' } 
                    ]
                },
                formValidate:{
                    question_type:2,
                    degree:'',
                    age:10,
                    symptom:'',
                    division:'',
                    abstract:'',
                    name:'',
                    complaint:'',
                    desc:'',
                    time:10
                },
                age:'岁',
                sex:'Male',
                outlineName:'',
                isShow:false,
                outlineId:0,
                family_name: [
                    "赵", "钱", "孙", "李", "周", "吴", "郑", "王", "冯", "陈",
                    "褚", "卫", "蒋", "沈", "韩", "杨", "朱", "秦", "尤", "许",
                    "何", "吕", "施", "张", "孔", "曹", "严", "华", "金", "魏",
                    "陶", "姜", "戚", "谢", "邹", "喻", "柏", "水", "窦", "章",
                    "云", "苏", "潘", "葛", "奚", "范", "彭", "郎", "鲁", "韦",
                    "昌", "马", "苗", "凤", "花", "方", "俞", "任", "袁", "柳",
                    "酆", "鲍", "史", "唐", "费", "廉", "岑", "薛", "雷", "贺",
                    "倪", "汤", "滕", "殷", "罗", "毕", "郝", "邬", "安", "常",
                    "乐", "于", "时", "傅", "皮", "卞", "齐", "康", "伍", "余",
                    "元", "卜", "顾", "孟", "平", "黄", "和", "穆", "萧", "尹"
                ],
                givenNames: [
                    "子璇", "淼", "国栋", "夫子", "瑞堂", "甜", "敏", "尚", "国贤", "贺祥", "晨涛",
                    "昊轩", "易轩", "益辰", "益帆", "益冉", "瑾春", "瑾昆", "春齐", "杨", "文昊",
                    "东东", "雄霖", "浩晨", "熙涵", "溶溶", "冰枫", "欣欣", "宜豪", "欣慧", "建政",
                    "美欣", "淑慧", "文轩", "文杰", "欣源", "忠林", "榕润", "欣汝", "慧嘉", "新建",
                    "建林", "亦菲", "林", "冰洁", "佳欣", "涵涵", "禹辰", "淳美", "泽惠", "伟洋",
                    "涵越", "润丽", "翔", "淑华", "晶莹", "凌晶", "苒溪", "雨涵", "嘉怡", "佳毅",
                    "子辰", "佳琪", "紫轩", "瑞辰", "昕蕊", "萌", "明远", "欣宜", "泽远", "欣怡",
                    "佳怡", "佳惠", "晨茜", "晨璐", "运昊", "汝鑫", "淑君", "晶滢", "润莎", "榕汕",
                    "佳钰", "佳玉", "晓庆", "一鸣", "语晨", "添池", "添昊", "雨泽", "雅晗", "雅涵",
                    "清妍", "诗悦", "嘉乐", "晨涵", "天赫", "玥傲", "佳昊", "天昊", "萌萌", "若萌"
                ],
                newDepInfo:{
                    newTitle:'',
                    newDepid:'',
                    newDegree:''
                },
                //诊疗次数
                treatmentNum:''
            }
        },
        components: { outlineModal,errwind },
        methods: {
            outlineSubmit(val) {
                // console.log(val);
                this.isShow = false;
                this.outlineName = val.symptom;
                // this.formInline.outlineName = val.symptom;
                // this.formInline.outline_ids = val.id;
                this.outlineId = val.id
            },
            outlineCancel() {
                this.isShow = false;
            },
            handleSubmit (name) {
                console.log(this.select1);
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if (this.outlineId == 0) {
                           this.$Message.error('请选择提纲!');
                        }else{
                            if (this.formValidate.age == 0) {
                                this.$refs.errwind.changeShow()
                                return;
                            }
                            if (this.formValidate.time == 0) {
                                this.$refs.errwind.changeShow()
                                return;
                            }
                            let depid = ""
                            this.select1.forEach(element => {
                                if (element.title == this.formValidate.division) {
                                    depid = element.id
                                }
                            });
                            let fromData = {
                                symptom:this.formValidate.symptom,
                                dept_name:this.formValidate.division,
                                dept_id:depid,
                                degree:this.formValidate.degree == '简单' ? 1 : this.formValidate.degree == '适中' ? 2 : 3,
                                outline_id:this.outlineId,
                                abstract:this.formValidate.abstract,
                                study_purpose:this.formValidate.abstract,
                                question_type:2,
                                patient_name:this.formValidate.name,
                                patient_gender:this.sex,
                                patient_age:this.formValidate.age+this.age,
                                patient_age_type:this.age == '岁' ? 1 : this.age == '月' ? 2 : this.age == '周' ? 3 :4,
                                chief_complaint:this.formValidate.complaint,
                                cardinal_symptom:this.formValidate.complaint,
                                scence_desc:this.formValidate.desc,
                                time_limit:this.formValidate.time
                            }
                            if (this.$route.query.caseid) {
                                //编辑病例
                                postData('/v1/case/modifyCaseInfo',{...fromData,case_id:parseInt(this.$route.query.caseid)}).then(res => {
                                    if (res.res_code == 1) {
                                        this.$router.push({
                                            name:"add-case",
                                            query:{
                                                caseid:this.$route.query.caseid
                                            }
                                        })
                                        fromData.case_id = parseInt(this.$route.query.caseid)
                                        fromData.patient_gender = fromData.patient_gender == "Male" ? 1 : 2
                                        fromData.patient_age = parseInt(fromData.patient_age.slice(0,fromData.patient_age.length-1))
                                        // fromData.patient_age_type = 0
                                        fromData.patient_marital_status = 0
                                        fromData.patient_nation_id = 0
                                        fromData.patient_occupation = "1"
                                        fromData.medical_history_representor = 0
                                        fromData.is_fertility = 0
                                        fromData.fertility_time_week = 0
                                        fromData.fertility_time_day = 0
                                        //设置患者信息
                                        postData('/v1/case/setPatientInfo',fromData).then(res1 => {
                                            if (res1.res_code == 1) {
                                                //赋值诊疗次数id
                                                fromData.case_examine_frequency_id = this.treatmentNum
                                                postData('/v1/case/setScenceDesc',fromData).then(res2 => {
                                                    if (res2.res_code == 1) {
                                                        this.$router.push({
                                                            name:"add-case",
                                                            query:{
                                                                caseid:this.$route.query.caseid
                                                            }
                                                        })  
                                                    }else if(res2.res_code == 400){
                                                        // this.$Message.warning('请填写必要信息');
                                                        this.$refs.errwind.changeShow()
                                                    }else{
                                                        console.log(res2);
                                                    }
                                                })
                                            }else if(res1.res_code == 400){
                                                // this.$Message.warning('请填写必要信息');
                                                this.$refs.errwind.changeShow()
                                            }else{
                                                console.log(res1);
                                            }
                                        })  
                                    }else if(res.res_code == 400){
                                        // this.$Message.warning('请填写必要信息');
                                        this.$refs.errwind.changeShow()
                                    }else{
                                        console.log(res);
                                    }
                                })
                            }else{
                                //新建病例
                                postData('/v1/case/addCaseInfo',fromData).then(res => {
                                    if (res.res_code == 1) {
                                        fromData.case_id = res.data.case_id
                                        fromData.patient_gender = fromData.patient_gender == "Male" ? 1 : 2
                                        fromData.patient_age = parseInt(fromData.patient_age.slice(0,fromData.patient_age.length-1))
                                        // fromData.patient_age_type = 0
                                        fromData.patient_marital_status = 0
                                        fromData.patient_nation_id = 0
                                        fromData.patient_occupation = "1"
                                        fromData.medical_history_representor = 0
                                        fromData.is_fertility = 0
                                        fromData.fertility_time_week = 0
                                        fromData.fertility_time_day = 0
                                        //设置患者信息
                                        postData('/v1/case/setPatientInfo',fromData).then(res1 => {
                                            if (res1.res_code == 1) {
                                                this.$router.push({
                                                    name:"add-case",
                                                    query:{
                                                        caseid:fromData.case_id
                                                    }
                                                })
                                                // fromData.case_examine_frequency_id = 0
                                                // postData('/v1/case/setScenceDesc',fromData).then(res2 => {
                                                //     if (res2.res_code == 1) {
                                                //         this.$router.push({
                                                //             name:"add-case",
                                                //             query:{
                                                //                 caseid:res.data.case_id
                                                //             }
                                                //         })  
                                                //     }else if(res2.res_code == 400){
                                                //         // this.$Message.warning('请填写必要信息');
                                                //         this.$refs.errwind.changeShow()
                                                //     }else{
                                                //         console.log(res2);
                                                //     }
                                                // })
                                            }else if(res1.res_code == 400){
                                                // this.$Message.warning('请填写必要信息');
                                                this.$refs.errwind.changeShow()
                                            }else{
                                                console.log(res1);
                                            }
                                        })
                                    }else if(res.res_code == 400){
                                        // this.$Message.warning('请填写必要信息');
                                        this.$refs.errwind.changeShow()
                                    }else{
                                        console.log(res);
                                    }
                                })
                            }
                        }
                    } else {
                        // this.$Message.error('请填写必要信息!');
                        this.$refs.errwind.changeShow()
                    }
                })
            },
            handleNext(){
                let depid = ""
                this.select1.forEach(element => {
                    if (element.title == this.formValidate.division) {
                        depid = element.id
                    }
                });
                let fromData = {
                    symptom:this.symptom,
                    dept_name:this.valueModal1,
                    dept_id:depid,
                    degree:this.valueModal2,
                    outline_id:this.outlineId,
                    abstract:this.abstract,
                    study_purpose:this.abstract,
                    question_type:2,
                    patient_name:this.name,
                    patient_gender:this.sex,
                    patient_age:this.ageNumber+this.age,
                    chief_complaint:this.cardinal,
                    cardinal_symptom:this.cardinal,
                    scence_desc:this.desc,
                    time_limit:this.time
                }
                postData('/v1/case/addCaseInfo',fromData).then(res => {
                    console.log(res);
                    if (res.res_code == 1) {
                        this.$router.push({
                            name:"add-case"
                        })  
                    }else if(res.res_code == 400){
                        //  this.$Message.warning('请填写必要信息');
                        this.$refs.errwind.changeShow()
                    }else{
                        console.log(res);
                    }
                })
            },
            getDepts(){
                postData("/v1/common/getDeptList").then(res => {
                    if (res) {
                        res.data.forEach(element => {
                            element.patient_division = element.title
                        });
                        this.select1 = res.data
                    }
                })
            },
            getD(){
                postData("/v1/case/getCaseInfo",{case_id:parseInt(this.$route.query.caseid)}).then(res => {
                    if (res) {
                        this.formValidate.question_type = res.data.question_type
                        this.formValidate.degree = res.data.degree == 1 ? '简单' : res.data.degree == 2 ? '适中' : '困难'
                        this.outlineId = res.data.outline_id
                        this.deptList.forEach(element => {
                            if (element.id == res.data.outline_id) {
                                this.outlineName = element.symptom
                            }
                        });
                        this.formValidate.symptom = res.data.symptom
                        this.formValidate.division = res.data.dept_name
                        this.formValidate.abstract = res.data.abstract
                    }
                })
                postData("/v1/case/getPatientInfo",{case_id:parseInt(this.$route.query.caseid)}).then(res => {
                    if (res) {
                        var reg = /[\u4e00-\u9fa5]/g; 
                        this.formValidate.name = res.data.patient_name
                        // this.formValidate.age = parseInt(res.data.patient_age.replace(reg, ""))
                        // this.age = res.data.patient_age.match(reg).join("")
                        this.formValidate.age = res.data.patient_age;
                        this.age = res.data.patient_age_type == 1 ? '岁' :res.data.patient_age_type == 2 ? '月' :res.data.patient_age_type == 3 ? '周' : '日'
                        this.sex = res.data.patient_gender == 1 ? 'Male' : 'Female'
                        this.formValidate.complaint = res.data.chief_complaint
                    }
                })
                //获取诊疗次数
                postData("/v1/case/getExamineFrequency",{case_id:parseInt(this.$route.query.caseid)}).then(res => {
                    if (res) {
                        let treatmentNum = res.data.list[0].id;
                        this.treatmentNum = res.data.list[0].id;
                        if(treatmentNum){
                            //获取场景设置参数
                            postData("/v1/case/getScenceDesc",{case_id:parseInt(this.$route.query.caseid),case_examine_frequency_id:treatmentNum}).then(res => {
                                if (res) {
                                    this.formValidate.desc = res.data.scence_desc
                                    this.formValidate.time = res.data.time_limit
                                }
                            })
                        }
                    }
                })
                
            },
            changeSex(value){
                console.log(value)
                this.sex = value
            },
            handleShowOutline(){
                this.isShow = true
            },
            // 选择首要专科
            selectChange(val){
                this.select1.forEach(element => {
                    if (element.title == val) {
                        this.newDepInfo.newDepid = element.id
                        this.newDepInfo.newTitle = val
                    }
                });
            },
            //选择病例难度
            selectDegree(val){
                this.newDepInfo.newDegree = val == '简单' ? 1 : val == '适中' ? 2 : 3
            },
            // 自动生成名字
            createName() {
                let i = parseInt(Math.random() * 100);
                let j = parseInt(Math.random() * 100);
                this.formValidate.name = this.family_name[i] + this.givenNames[j];
            }
        },
        mounted() {
            this.getDepts()   
            if (this.$route.query.caseid) {
                setTimeout(() => {
                    this.deptList = this.$refs.defaultSelect.dataList
                    this.getD()
                }, 1000);
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
                    background: #C1C1D7;
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
                        border-color: transparent transparent transparent #C1C1D7;
                        position: absolute;
                        right: -30px;
                        top: 0;
                    }
                }
            }
            .theorymain_top_right{
                margin-left: auto;
                background: #4098FF;
                border-radius: 2px;
                border-radius: 2px;
                width: 100px;
                height: 30px;
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
        .theorymain_middle{
            padding-top: 25px;
            background: #FFFFFF;
            margin-left: 10px;
            margin-right: 10px;
            margin-bottom: 40px;
            // height: 100%;
            height: 80vh;
            overflow: auto;
            .tep_title{
                display: flex;
                align-items: center;
                margin-bottom: 30px;
                .block{
                    width: 5px;
                    height: 22px;
                    background: #4098FF;
                    margin-right: 10px;
                }
                p{
                    font-family: PingFangSC-Medium;
                    font-size: 20px;
                    color: #333333;
                    letter-spacing: 0;
                    text-align: center;
                }
            }
            .theorymain_middle_tep1{
                margin-left: 25px;
                margin-bottom: 15px;
                .tep1_main{
                    margin-left: 15px;
                    .tep1_main_single1{
                        display: flex;
                        align-items: center;
                        // margin-bottom: 15px;
                        p{
                            font-family: PingFangSC-Regular;
                            font-size: 16px;
                            color: #333333;
                            letter-spacing: 0;
                            margin-bottom: 25px;
                        }
                    }
                    .tep1_main_single2{
                        display: flex;
                        align-items: center;
                        // margin-bottom: 15px;
                        .single2_block{
                            display: flex;
                            align-items: center;
                            margin-right: 20px;
                            p{
                                font-family: PingFangSC-Regular;
                                font-size: 16px;
                                color: #333333;
                                letter-spacing: 0;
                                margin-bottom: 25px;
                            }
                        }
                    }
                    .tep1_main_single3{
                        display: flex;
                        align-items: center;
                        margin-bottom: 25px;
                        p{
                            font-family: PingFangSC-Regular;
                            font-size: 16px;
                            color: #333333;
                            letter-spacing: 0;
                        }
                        .single3_btn{
                            display: flex;
                            align-items: center;
                            width: 250px;
                            height: 34px;
                            background: #FFFFFF;
                            border: 1px solid #4098FF;
                            border-radius: 2px;
                            border-radius: 2px;
                            cursor: pointer;
                            .cross{
                                background: #4098FF;
                                height: 18px;
                                position: relative;
                                width: 2px;
                                margin-left: 79px;
                            }
                            .cross::after{
                                background: #4098FF;
                                content: "";
                                height: 2px;
                                left: -8px;
                                position: absolute;
                                top: 8px;
                                width: 18px;
                            }
                            p{
                                font-family: PingFangSC-Regular;
                                font-size: 16px;
                                color: #4098FF;
                                letter-spacing: 0;
                                margin-left: 15px;
                            }
                        }   
                        .single3_btn2{
                            display: flex;
                            align-items: center;
                            width: 250px;
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
                                margin-left: 15px;
                                text-align: center;
                                margin: 0 auto;
                            }
                        }
                    }
                    .tep1_main_single4{
                        display: flex;
                        align-items: flex-start;
                        p{
                            font-family: PingFangSC-Regular;
                            font-size: 16px;
                            color: #333333;
                            letter-spacing: 0;
                        }
                    }
                }
            }
            .theorymain_middle_tep2{
                margin-left: 25px;
                margin-bottom: 15px;
                .tep2_main_single1{
                    display: flex;
                    align-items: center;
                    margin-left: 15px;
                    // margin-bottom: 15px;
                    .single1_block{
                        display: flex;
                        align-items: center;
                        margin-right: 20px;
                        .single1_title{
                            font-family: PingFangSC-Regular;
                            font-size: 16px;
                            color: #333333;
                            letter-spacing: 0;
                            margin-bottom: 25px;
                        }
                        .single1_block_input1{
                            display: flex;
                            align-items: center;
                            width: 250px;
                            height: 34px;
                            background: #FFFFFF;
                            // border: 1px solid #CDCED3;
                            // border-radius: 2px;
                            // border-radius: 2px;
                            // margin-bottom: 25px;
                            position: relative;
                            input{
                                border: none;
                                outline: none;
                                height: 32px;
                                width: 170px;
                                margin-left: 10px;
                            }
                            p{
                                font-family: PingFangSC-Medium;
                                font-size: 14px;
                                color: #4098FF;
                                letter-spacing: 0;
                                cursor: pointer;
                                position: absolute;
                                right: 8px;
                                background: #FFFFFF;
                                top: -5px;
                            }
                        }
                        .single1_block_input2{
                            position: relative;
                        }
                    }
                }
                .tep2_main_single2{
                    display: flex;
                    align-items: center;
                    margin-left: 15px;
                    margin-bottom: 25px;
                    .single2_title{
                        font-family: PingFangSC-Regular;
                        font-size: 16px;
                        color: #333333;
                        letter-spacing: 0;
                    }
                    .single2_checkbox{
                        display: flex;
                        align-items: center;
                        .single2_checkbox_block{
                            margin-right: 30px;
                            display: flex;
                            align-items: center;
                            .block{
                                width: 20px;
                                height: 20px;
                                background: #FFFFFF;
                                border: 1px solid #CDCED3;
                                border-radius: 2px;
                                border-radius: 2px;
                                margin-right: 10px;
                                cursor: pointer;
                                img{
                                    width: 12px;
                                }
                            }
                            p{
                                font-family: PingFangSC-Regular;
                                font-size: 16px;
                                color: #333333;
                                letter-spacing: 0;
                            }
                        }
                    }
                }
                .tep2_main_single3{
                    display: flex;
                    align-items: flex-start;
                    margin-left: 15px;
                    p{
                        font-family: PingFangSC-Regular;
                        font-size: 16px;
                        color: #333333;
                        letter-spacing: 0;
                    }
                }
            }
            .theorymain_middle_tep3{
                margin-left: 25px;
                padding-bottom: 50px;
                .tep3_main{
                    margin-left: 15px;
                    .tep3_main_single1{
                        display: flex;
                        align-items: flex-start;
                        // margin-bottom: 15px;
                        p{
                            font-family: PingFangSC-Regular;
                            font-size: 16px;
                            color: #333333;
                            letter-spacing: 0;
                        }
                    }
                    .tep3_main_single2{
                       display: flex;
                       align-items: center; 
                       p{
                           font-family: PingFangSC-Regular;
                            font-size: 16px;
                            color: #333333;
                            letter-spacing: 0;
                            margin-bottom: 25px;
                       }
                       .tep3_main_single2_main{
                           display: flex;
                           align-items: center;
                       }
                    }
                }
            }
        }
    }
</style>