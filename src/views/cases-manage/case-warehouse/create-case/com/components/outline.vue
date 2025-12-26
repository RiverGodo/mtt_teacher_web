<template>
    <Modal v-model="show" @on-cancel="handleCancel" :footer-hide="true" title="引用提纲" width="900">
        <screen :typeArr="typeArr" :select2="select2" @selectChange2="selectChange2" @inputChange="inputChange" sizeTitle1="提纲数" :sizeNum1="total" @selectChange1="selectChange1"/>
        <div class="card">
            <div v-for="(item, index) in dataList" :key="index" class="card-box" :class="item.select ? 'select-box' : ''">
                <div v-if="item.select" class="check-data">
                    <Icon type="md-checkmark" color="#fff" size="20" style="transform: rotate(-45deg);margin-bottom: 2px;"/>
                </div>
                <div class="card-title">{{item.symptom}}</div>
                <div class="card-degree" :style="{backgroundColor: decideDegree[+item.degree - 1].color}">{{decideDegree[+item.degree - 1].title}}</div>
                <div class="card-content">
                    <div>id: {{item.id}}</div>
                    <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;margin-top: 6px;">诊断：{{setName(item.icd10_names)}}</div>
                    <div style="display: flex; margin-top: 6px;">
                        <div>机构：{{item.title}}</div>
                        <div style="margin: 0 8px;">|</div>
                        <div>科室：{{item.dept}}</div>
                    </div>
                    <div style="display: flex;margin-top: 6px;">
                        <div>创建人：{{item.realname}}</div>
                        <div style="margin: 0 8px;">|</div>
                        <div>创建时间：{{item.create_time.slice(0, 10)}}</div>
                    </div>
                </div>
                <div class="card-btn">
                    <Button style="margin-right: 4px;" type="primary" ghost @click="handleCheck(item)">查看</Button>
                    <Button type="primary" @click="handleSelect(item)">引用提纲</Button>
                </div>
            </div>
        </div>
        <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
        <!--        <div class="btn"><Button type="primary" style="width: 130px;" @click="handleClick">确认</Button></div>-->
    </Modal>
</template>

<script>
    import screen from 'components/ScreenFrame'
    import pageList from 'components/Page'
    import pageMixin from 'mix/pageMixins'

    export default {
        components: {screen, pageList},
        mixins: [pageMixin],
        data() {
            return {
                typeArr: ['isSuper', 'select2', 'size1', 'input'],
                select2: [
                    {title: '全部', id: 'all'},
                    {title: '简单', id: 1},
                    {title: '中等', id: 2},
                    {title: '困难', id: 3},
                ],
                show: false,
                dataList: [],
                outline: {},
                degree: '',
                keyword: '',
                organization_id: '',
                decideDegree: [
                    {color: '#7ED321', title: '简单'},
                    {color: '#4098ff', title: '中等'},
                    {color: '#FD6C1E', title: '困难'},
                ],
            }
        },
        props: {
            isShow: Boolean
        },
        watch: {
            isShow(val) {
                this.show = val
            }
        },
        methods: {
            handleCancel() {
                this.$emit('outline-cancel')
            },
            setName(val) {
                console.log(val)
                let str = ''
                    if(val){
                        JSON.parse(val).forEach(item => {
                        str += str ? ',' + item : item
                    })
                }
                return str
            },
            handleSelect(item) {
                this.dataList.forEach(it => {it.select = false})
                item.select = true
                this.$emit('outline_submit', item)
                this.$forceUpdate()
            },
            handleClick() {
                this.$emit('outline_submit', this.outline)
            },
            handleCheck(item) {
                sessionStorage.setItem('caseType', JSON.stringify('check'))
                sessionStorage.setItem('caseOutline', JSON.stringify(item))
                // this.$router.push({path: 'outline-content', query: {id: item.id || null}})
                window.open(`/dashboard/outline-content?id=${item.id || null}`)
            },
            selectChange2(val) {
                this.degree = val == 'all' ? '' : val
                this.getList()
            },
            inputChange(val) {
                this.keyword = val
                this.getList()
            },
            selectChange1(val) {
                this.organization_id = val
                this.getList()
            },
            getList() {
                let data = {
                    page_num: this.current,
                    page_size: this.pageSize,
                    organization_id: +this.organization_id,
                    degree: this.degree,
                    keyword: this.keyword
                }
                PostData('common/getOutlineList', data).then(res => {
                    if(res.res_code == 1) {
                        this.dataList = res.data.data
                        this.total = res.data.count
                    }
                })
            }
        },
        mounted() {
            this.organization_id = this.$config.getOrganizationId(),
            this.pageSize = 6
            this.getList()
        }
    }
</script>

<style scoped lang="less">
    .card{
        display: flex;
        flex-wrap: wrap;
        // height: 600px;
        overflow-y: auto;
        align-items: self-start;
        align-content: baseline;
    }
    .card-box{
        width: 260px;
        margin: 10px;
        box-shadow: 3px 3px rgba(99,99,99,.3);
        border: 1px solid #999;
        height: 180px;
        position: relative;
        overflow: hidden;

        &:hover{
            .card-btn{
                display: flex;
            }
        }
    }
    .check-data{
        position: absolute;
        right: -30px;
        top: -30px;
        background-color: #4098ff;
        width: 60px;
        height: 60px;
        transform: rotate(45deg);
        display: flex;
        align-items: flex-end;
        justify-content: center;
    }
    .select-box{
        border: 1px solid #4098ff;
        box-shadow: 3px 3px rgba(64,152,255,.3);
    }
    .card-title{
        background-color: #f0f0f7;
        text-align: center;
        font-size: 16px;
        height: 28px;
        line-height: 28px
    }
    .card-degree{
        position: absolute;
        top: 4px;
        left: 2px;
        color: #fff;
        background-color:#4098ff;
        padding: 0 2px;
        border-radius: 4px;
    }
    .card-content{
        padding: 6px;
        display: flex;
        flex-direction: column;
        height: 152px;
    }
    .card-btn{
        position: absolute;
        right: 0;
        bottom: 0;
        display: none;
        background-color:#fff;
    }
    .btn{
        width: 100%;
        display: flex;
        justify-content: center;
        margin-top: 40px;
    }
</style>
