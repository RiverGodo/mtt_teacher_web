export default {
  data() {
    return {
      current: 1,
      total: null,
      pageSize: 16,
      isSuper: JSON.parse(sessionStorage.getItem('PERSONALDETAILS')).role_id == 1 ? true : false
    }
  },
  methods: {
    pageList(val) {
      if(this.pageTotal){
        this.current = val
        this.initData();
      }else{
        this.current = val
        this.getList()
      }
    }
  }
}
