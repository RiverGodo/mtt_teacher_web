<template>
    <Modal @on-cancel="closeModal" :width="900" :mask-closable=false footer-hide v-model="show"  title="查看" >
       <div class="media-body">
            <img style="width: 100%" v-if="type == 'Picture'" :src="mediaUrl + fileUrl"/>
            <video controls width="100%" v-if="type == 'Video'" :src="mediaUrl + fileUrl"/>
            <audio controls style="width: 100%" v-if="type == 'Audio'" :src="mediaUrl + fileUrl"/>
       </div>
    </Modal>
</template>

<script>
    import mediaUrl from '../../config/media'

    export default {
        name: '',
        props: {
           mediaShow: {},
           type: {},
           fileUrl: {} 
        },
        watch: {
            mediaShow(_new){
                this.show = _new
            }
        },
        data() {
            return {
                show: false, mediaUrl
            }
        },
        methods: {
            closeModal(){
                this.show = false
                this.$emit('close-media')
            }
        }
    }
</script>

<style lang="less" scoped>
    .media-body{
        padding: 14px;
        min-height: 300px;
        display: flex;
        align-items: center;
    }
</style>