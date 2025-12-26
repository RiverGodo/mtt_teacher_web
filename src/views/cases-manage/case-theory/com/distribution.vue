<template>
    <Modal class="comparison" :width="906" v-model="modal1" @on-cancel="close" title="分配审核" footer-hide>
        <div class="main">
            <div style="display: flex">
                <div class="item">
                    <div class="title">选择分配人员</div>
                    <Input @on-change="inputSearch" v-model="search" class="search" suffix="ios-search" placeholder="搜索姓名" />
                    <div class="sel-dept">
                        <span>筛选：</span>
                        <Select @on-change="selectSearch" v-model="dept_id" style="width:200px">
                            <Option v-for="item in select3" :value="item.id" :key="item.id">{{ item.title }}</Option>
                        </Select>
                    </div>
                    <Tables :highlightRow="true" style="width: 100%;" :tabel-height="tableHeight"  :column="columns1" :table-data="list"
                    @row-click="rowClick" />
                    <!-- <Page simple v-if="total>pageSize" :current="current" :total="total" :page-size="pageSize" @on-change="pageList" /> -->
                </div>
                <div class="item" style="margin-left: -1px">
                    <div ref="titttttttt" class="title">已选择</div>
                    <div style="height: 550px; width: 100%;overflow-y: auto">
                        <div v-for="(item, index) in list2" :key="index" class="right-box">
                            <div>{{item.realname}}</div>
                            <Icon type="md-close" style="cursor: pointer" @click="deleteList(index)"/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="foot">
                <Button @click="cancal" class="btn">取消</Button>
                <Button style="margin-left: 10px" type="primary" @click="comparison" class="btn">确认</Button>
            </div>
        </div>
    </Modal>
</template>

<script>
    import Tables from '../../../../components/tables.vue'

    export default {
        props: {
            show: {
                type: Boolean,
                default: false,
            },
            cases_id: Number
        },
        components: { Tables },
        data() {
            return {
                modal1: this.show,
                search: '',
                select1: [],
                select2: [],
                select3: [{id: 'all', title: "全部科室"}],
                dept_id: 'all',
                title: '',
                grade: '',
                tableHeight: 459,
                tableHeight2: 550,
                columns1: [
                    {
                        title: '姓名',
                        key: 'realname',
                        minWidth: 80,
                        align: 'left',
                        render: (h, params) => {
                            return h('Tooltip', {
                                props: { placement: 'bottom' }
                            }, [
                                params.row.realname,
                                h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } },params.row.realname)
                            ])
                        }
                    },
                ],
                list: [],
                list2:[],
                current: 1,
                total: null,
                pageSize: 9
            }
        },
        watch: {
            show(_new){
                this.modal1 = _new
                if(_new){
                    this.getList()
                    this.getDate('/v1/common/getDeptList')
                }
            }
        },
        methods: {
            cancal(){
                this.list2 = []
                this.close()
            },
            getDate(url){
                PostData(url).then((res) => {
                    this.select3 = [{id: 'all', title: "全部科室"}, ...res.data]
                })
            },
            setSelect() {
                this.list2.forEach(item => {
                    this.list.map(item1 => {
                        if(item.id == item1.id) item1._checked = true
                    })
                })
            },
            comparison(){
                if(this.list2.length>0){
                    let data = {
                        distribution_user_id: this.list2[0].id,
                        case_id: this.cases_id
                    }
                    PostData('/v1/case/distributionCase', data).then(res => {
                        if(res.res_code == 1) {
                            this.close()
                            this.$emit('handleCancel')
                        }
                    })
                }else this.$Message.info('请选择老师！')
            },
            rowClick(row){
                this.list2 = [row]
            },
            pageList(val) {
                this.current = val
                this.getList()
            },
            close(){
                this.modal1 = false;
                this.$emit('close', false)
            },
            deleteList(index) {
                this.list2.splice(index, 1)
            },
            inputSearch(){
                this.getList()
            },
            selectSearch(){
                this.getList()
            },
            getList(){
                let role_id = JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id
                let org = role_id === 1 ? null : JSON.parse(sessionStorage.getItem('organizationId'))
                let d = {
                    keyword: this.search,
                    page_size: 9999,
                    page_num: 1,
                    dept_id: this.dept_id == 'all' ? null : this.dept_id,
                    organization_id: org,
                }
                PostData('/v1/user/getTeacherList',d).then((res) => {
                    if(res.res_code == 1){
                        // this.list = res.data.list
                        // this.total = res.data.count
                        this.list = res.data.list
                        this.setSelect()
                    }
                })
            },
        }
    }
</script>

<style lang="less" scoped>
    /deep/ .ivu-tooltip-rel{
        overflow: hidden !important;
        height: 23px !important;
    }
    .comparison{
        /deep/ .ivu-modal-body{
            padding: 20px 40px;
        }
        .sel-dept{
            display: flex;
            justify-content: flex-start;
            align-items: center;
            width: 367px;
        }
        .foot{
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 10px;
            .btn{
                width: 120px;
            }
        }
        .main{
            .item{
                width: 413px;
                // height: 501px;
                background-color: rgba(255, 255, 255, 1);
                border: 1px solid rgba(188, 188, 188, 1);
                display: flex;
                flex-direction: column;
                align-items: center;
                .title{
                    width: 413px;
                    height: 43px;
                    background: inherit;
                    background-color: rgba(215, 215, 215, 1);
                    border: 1px solid rgba(228, 228, 228, 1);
                    line-height: 43px;
                    text-align: center;
                    font-weight: 700;
                    font-size: 14px;
                }
                .search{
                    width: 367px;
                    margin: 10px 0;
                }
                .selects{
                    display: flex;
                    margin-bottom: 10px;
                }
            }
            .right-box{
                height: 43px;
                background-color: rgba(242, 242, 242, 1);
                border-bottom: 1px solid rgb(204, 204, 204);
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 20px;
            }
        }
    }
</style>
