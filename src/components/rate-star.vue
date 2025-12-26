<template>
    <div>
        <div v-if='stops' class="star">
            <div @click.stop="setStar(i)" class="item" v-for="(t, i) in star" :key="i">
                <Tooltip :content="t" placement="bottom">
                    <Icon :size="20" :color="i < weights ? '#f5a623' : '#e9e9e9'" type="ios-star" />
                </Tooltip>
            </div>
        </div>
        <div v-else class="star">
            <div @click="setStar(i)" class="item" v-for="(t, i) in star" :key="i">
                <Tooltip :content="t" placement="bottom">
                    <Icon :size="20" :color="i < weights ? '#f5a623' : '#e9e9e9'" type="ios-star" />
                </Tooltip>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            weight: {
                type: Number,
                default: 0
            },
            stops: {
                type: Boolean,
                stops: false
            }
        },
        data() {
            return {
                star: ['可疑依据','较弱依据','一般依据','重要依据','关键依据'],
                weights: this.weight,
            }
        },
        watch: {
            weight(_new){
                this.weights = _new
            }
        },
        computed: {
            isCheck(){
                return Boolean(this.$route.query.isCheck) || false
            }
        },
        methods: {
            setStar(i){
                if(!this.isCheck){
                    this.$emit('setStar', i + 1)
                }
            },
        },
        mounted() {
            this.weights = this.weight
        }
    }
</script>

<style lang="less" scoped>
    .star{
        display: flex;
        flex-direction: row;
        .item{
            margin-right: 8px;
            cursor: pointer;
        }
    }
</style>
