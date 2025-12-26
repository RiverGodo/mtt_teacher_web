<template>
    <div class="sel-main">
        <Select placement="bottom" v-if="isSuper" v-model="valueSelect1" @on-change="selectChange1" class="select-list" placeholder="请选择机构">
            <Option v-for="(item,i) in select" :value="item.id " :key="i">{{ item.title }}</Option>
        </Select>
        <Select placement="bottom" v-model="valueSelect2" @on-change="selectChange2" class="select-list" placeholder="请选择年级">
            <Option v-for="(item,i) in select2" :value="item.id " :key="i">{{ item.title }}</Option>
        </Select>
        <Select placement="bottom" v-model="valueSelect3" @on-change="selectChange3" class="select-list" placeholder="请选择学科">
            <Option v-for="(item, i) in select3" :value="item.id" :key="i">{{ item.title }}</Option>
        </Select>
        <Select placement="bottom" v-model="valueSelect4" @on-change="selectChange4" class="select-list" placeholder="请选择类型">
            <Option v-for="(item,i) in select4" :value="item.id " :key="i">{{ item.title }}</Option>
        </Select>
        <Select placement="bottom" v-if="types == 'exam-analysis'" v-model="valueSelect5" @on-change="selectChange5" class="select-list" placeholder="请选择类型">
            <Option v-for="(item,i) in select6" :value="item.id " :key="i">{{ item.title }}</Option>
        </Select>
        <Select placement="bottom" v-else v-model="times" @on-change="timeChange" class="select-list" >
                <Option v-for="(item,i) in select5" :value="item.id " :key="i">{{ item.title }}</Option>
        </Select>
        <DatePicker placement="bottom" v-if="isDaterange&&types != 'exam-analysis'" type="daterange" format="yyyy-MM-dd" placeholder="请选择时间范围"  class="screen-data-picker"
        v-model="data_picker" @on-change="dataPickerChange" ></DatePicker>
    </div>
</template>

<script>
    export default {
        props: {
            types: {
                type: String,
                default: ''
            }
        },
        name: '',
        data() {
            return {
                isSuper: false,
                valueSelect1: 'all',
                valueSelect2: 'all',
                valueSelect3: 'all',
                valueSelect4: 'all',
                valueSelect5: 10,
                select6: [
                    {id: 10, title: '最近10次'},
                    {id: 20, title: '最近20次'},
                    {id: 30, title: '最近30次'}
                ],
                select: [{id: 'all', title: '全部机构'}],
                select2: [{id: 'all', title: '全部年级'}],
                subjectsSelect3: [{id: 'all', title: '全部科室'}],
                select3: [],
                select4: [{id: 'all', title: '全部类型'}],
                isDaterange: false,
                data_picker: [],
                times: 'MONTH',
                select5: [
                    {id: "MONTH", title: '近30天'},
                    {id: "6MONTH", title: '近半年'},
                    {id: "YEAR", title: '近一年'},
                    {id: "CUSTOM", title: '自定义'},
                ],
            }
        },
        mounted(){
            this.isSuper = JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id == 1 ? true : false
            this.getList()
        },
        methods: {
            selectChange5(val){
                this.$emit('selectChange5', val)
            },
            setCustom(){
                let d = {}
                if(this.times == 'CUSTOM'&&this.data_picker.length==2){
                    d.start_time = this.data_picker[0]
                    d.end_time = this.data_picker[1]
                    d.time_format = this.isCustonMouths() ? 'DAY' : 'MONTH'
                }
                return d
            },
            isCustonMouths(){
                let bool = false
                if(this.times == 'CUSTOM'&&this.data_picker.length==2&&this.data_picker[0]){
                    let da = new Date(this.data_picker[0])
                    let n1 = this.data_picker[1].split('-').join("")
                    let n2 = (this.$config.getDay(29, da)).split('-').join("")
                    bool = +n1 <= (+n2)
                }
                return (this.times=='WEEK'||this.times=='MONTH') ? true : bool
            },
            dataPickerChange(val) {
                this.data_picker = val
                this.$emit('dataPickerChange', this.setCustom(), this.data_picker)
            },
            timeChange(val){
                this.isDaterange = val =='CUSTOM'
                this.$emit('timeChange', val)
                if(val !='CUSTOM') this.data_picker = []
            },
            selectChange1(val){
                this.$emit('selectChange1', val)
            },
            selectChange2(val){
                this.$emit('selectChange2', val)
            },
            selectChange3(val){
                this.$emit('selectChange3', val)
            },
            selectChange4(val){
                this.$emit('selectChange4', val)
            },
            getDate(url, name, d){
                PostData(url).then((res) => {
                    this[name] = [...d, ...res.data]
                })
            },
            getList() {
                this.getDate('/v1/common/getDeptList', 'select3', this.subjectsSelect3)
                this.getDate('/v1/common/getOrganizationList', 'select', this.select)
                this.getDate('/v1/common/getGradeList', 'select2', this.select2)
                this.getDate('/v1/common/getStudentTypeList', 'select4', this.select4)
            }
        }
    }
</script>

<style lang="less" scoped>
    .sel-main{
        display: flex;
        .select-list {
            width: 130px;
            margin-right: 10px;
        }
        .screen-data-picker{
            width: 150px !important;
            /deep/ .ivu-btn{
                display: inline-block !important;
            }
        }
    }
    @media screen and (max-width: 1367px){
        .sel-main{
            display: flex;
            .select-list {
                width: 115px;
                margin-right: 10px;
            }
            .screen-data-picker{
                width: 115px !important;
                /deep/ .ivu-btn{
                    display: inline-block !important;
                }
            }
        }
    }
</style>