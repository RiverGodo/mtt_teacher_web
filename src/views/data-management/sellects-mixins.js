import selects from './com/selects.vue'
export default {
    components: { selects },
    name: '',
    data() {
        return {
            valueSelect1: '',
            valueSelect2: '',
            valueSelect3: '',
            valueSelect4: '',
            valueSelect5: 10,
            timesDate: '',
            times: 'MONTH',
            data_picker: []
        }
    },
    methods: {
        getOrganizationId(){
            let role = JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id
            return role == 1 ? (this.valueSelect1 == 'all' ? '' : this.valueSelect1) :  +sessionStorage.getItem('organizationId')
        },
        dataPickerChange(val, data_picker) {
            this.timesDate = val
            this.data_picker = data_picker
            if(this.data_picker.length==2&&this.data_picker[0]) this.getList()
        },
        timeChange(val){
            this.times = val
            if(val !='CUSTOM') this.getList()
        },
        selectChange1(val){
            this.valueSelect1 = val
            this.getList()
        },
        selectChange2(val){
            this.valueSelect2 = val
            this.getList()
        },
        selectChange3(val){
            this.valueSelect3 = val
            this.getList()
        },
        selectChange4(val){
            this.valueSelect4 = val
            this.getList()
        },
        selectChange5(val){
            this.valueSelect5 = val
            this.getList()
        }
    },
}