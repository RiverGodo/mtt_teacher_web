<template>
    <Modal v-model="show" :footer-hide="true" :title="title" @on-cancel="handleCancel" width="600">
        <div class="state">
            <Button :type="state == 'in' ? 'primary' : 'default'" @click="handleCheck('in')">导入</Button>
            <Button :type="state == 'out' ? 'primary' : 'default'" @click="handleCheck('out')">导出</Button>
        </div>
        <div v-if="state == 'in'" style="margin-top: 60px; height: 280px;">
            <div>1、下载模板文件，根据文件模板填写用户信息。 <a href="">下载模版</a></div>
            <div style="margin-top: 20px;">2、上传文件： <input ref="upload" type="file" @change="handleChange"></div>
            <div style="display: flex;justify-content: center;margin-top: 140px;">
                <Button type="primary" style="width: 120px;">确认</Button>
            </div>
        </div>
        <div v-else style="height: 280px; display: flex;align-items: center;justify-content: center">
            <Button type="primary" style="height: 50px;width: 140px;">点击下载文件</Button>
        </div>
    </Modal>
</template>

<script>
    export default {
        data() {
            return {
                show: false,
                title: '用户导入/导出',
                state: 'in'
            }
        },
        props: {
            showTransfer: Boolean
        },
        watch: {
            showTransfer(val) {
                this.show = val
            }
        },
        methods: {
            handleCancel() {
                this.$emit('transferCancel', false)
            },
            handleCheck(val) {
                this.state = val
            },
            handleChange(val) {
                console.log(val, this.$refs.upload.file, 'vvv');
            }
        }
    }
</script>

<style scoped lang="less">
    .state{
        display: flex;

        /deep/ .ivu-btn{
            border-radius: 0;
        }
    }
</style>
