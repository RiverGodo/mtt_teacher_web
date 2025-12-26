<template>
    <div class="upload-flie">
        <Upload ref="upload" :show-upload-list="false" action="http://dscj-app.oss-cn-qingdao.aliyuncs.com"
                :format="['jpg','jpeg','png']" :data="uploadData"
                accept="image/jpeg,image/png,image/jpg,image/bmp"
                :before-upload="handleBeforeUpload" :on-format-error="handleFormatError">
            <div v-if="!head_img" class="modal-upload-flie">
                <img class="upload-flie-img" src="../../../assets/icons/icon/upload.png"/>
                <p>点击上传</p>
            </div>
            <img v-if="head_img" class="upload-flie-img-2" :src="head_img"/>
        </Upload>
    </div>
</template>

<script>
    import {get_sign} from '../../../api/modules/ali_oss'
    import axios from 'axios'
    const ossHost = 'http://jhyl-static-file.oss-cn-hangzhou.aliyuncs.com';
    export default {
        name: 'imgup',
        data() {
            return {
                uploadData: {},
                head_img: '',
                uploadConfig: {
                    bucket: 'jhyl-static-file',
                    dir: 'user_task',
                    type: 1
                },
                fileSize: null,
                maxFileSize:300,
                resourse_url: ''
            }
        },
        methods: {
             handleBeforeUpload(file) {
                this.fileSize = file.size / (1024 * 1024);
                if (this.maxFileSize > 0 && this.fileSize > this.maxFileSize) {
                    this.$Modal.info({
                        title: '提示',
                        content: '文件过大',
                        onOk: () => {
                        }
                    });
                    return;
                }
                this.handleGetassignKey(file);
                return false
            },
            handleFormatError(file) {
                this.$Message.warning('请上传图片');
            },
            // 从oss上获取assignKey;
            handleGetassignKey(file_item, insert) {
                var date = new Date(); //dscj-app,user_task
                date = date.toGMTString();
                get_sign(file_item.type, date, this.uploadConfig.bucket, this.uploadConfig.dir, file_item.name, 'post')
                    .then(res => {
                        if (res.data.res_code == 1) {
                            const formData = new FormData();
                            this.resourse_url = res.data.data.filename;
                            formData.append('key', res.data.data.filename);
                            formData.append('OSSAccessKeyId', res.data.data.accessKeyID);
                            formData.append('success_action_status', '200');
                            formData.append('signature', res.data.data.sign);
                            formData.append('policy', res.data.data.policyBase64);
                            formData.append('file', file_item);
                            this.handleUploadFile(formData, encodeURI(ossHost));
                        }
                    })
            },
            // 上传到oss上
            handleUploadFile(form_data, url) {
                var vm = this;
                axios({
                    method: 'POST',
                    url: url,
                    data: form_data,
                    onUploadProgress: function (progressEvent) {
                        var progress = Math.round(progressEvent.lengthComputable ? progressEvent.loaded *
                            100 / progressEvent.total : 0);
                        vm.percentage = progress;
                    },
                }).then(res => {
                    this.head_img = url + '/' + this.resourse_url;
                });
            }
        }
    }
</script>

<style lang="less" scoped>
    .upload-flie {
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
    }

    .modal-upload-flie {
        width: 118px;
        height: 118px;
        background: #F0F0F7;
        border-radius: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    .upload-flie-img {
        width: 40px;
        height: 35px;
    }

    .upload-flie-img-2 {
        width: 118px;
        height: 118px;
        border-radius: 100px
    }
</style>