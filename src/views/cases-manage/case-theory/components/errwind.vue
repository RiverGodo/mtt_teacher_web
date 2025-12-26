<template>
    <div v-show="showind" class="errwind">
        <img :src="errwind" alt="">
        <p>{{textdata}}</p>
    </div>
</template>

<script>
    import errwind from "../../../../assets/img/case/errwind.png"
    export default {
        name: 'errwind',
        props:{
            textdata:{
                type:String,
                default:'您还有未完成的信息!'
            }
        },
        watch:{
            showind(newval,oldval){
                if (newval) {
                    setTimeout(() => {
                        this.showind = false
                    }, 1000);
                }
            }
        },
        data() {
            return {
                errwind,
                showind:false
            }
        },
        methods: {
            changeShow(){
                this.showind = true
            }
        },
    }
</script>

<style lang="less" scoped>
    .errwind{
        width: 200px;
        height: 100px;
        background: #FFFFFF;
        box-shadow: 0 1px 10px 0 rgba(54,64,115,0.20);
        border-radius: 4px;
        border-radius: 4px;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        img{
            width: 32px;
            height: 32px;
            margin-top: 16px;
            margin-bottom: 8px;
        }
        p{
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #333333;
            text-align: center;
        }
    }
</style>