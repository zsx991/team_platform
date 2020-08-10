/**
* @author: hao.ling
* @date: 2020/7/23 15:04
* @Description: 修改密码
*/
<template>
    <div id="edit-pwd">
        <a-form :form="editPwdForm" id="editPwd-form" :label-col="{span:10}" @submit="changePwd">
            <h1 align="center">修改密码</h1>
            <a-form-item label="旧密码" style="margin-bottom: 5px" class="pwd-form">
                <a-input-password class="input" size="small"
                                  v-decorator="['oldPassword',{rules:[{required:true,message:'请输入旧密码'}]}]">
                    <my-icon class="icon" slot="prefix" type="icon-password"/>
                </a-input-password>
            </a-form-item>
            <a-form-item label="新密码" style="margin-bottom: 5px" class="pwd-form">
                <a-input-password class="input" size="small"
                                  v-decorator="['newPassword',{rules:[{required:true,message:'请输入新密码'},{validator:getPassword}]}]">
                    <my-icon class="icon" slot="prefix" type="icon-password"/>
                </a-input-password>
            </a-form-item>
            <a-form-item label="确认密码" style="margin-bottom: 5px" class="pwd-form">
                <a-input-password class="input" size="small"
                                  v-decorator="['confirmPwd',{rules:[{required:true,message:'请确认密码'},{validator:confirmPwd}]}]">
                    <my-icon class="icon" slot="prefix" type="icon-password"/>
                </a-input-password>
            </a-form-item>
            <a-button class="btn" style="margin-left: 450px">
                <router-link to="/index">返回</router-link>
            </a-button>
            <a-button class="btn" @click="changePwd">修改</a-button>
        </a-form>
    </div>
</template>

<script>
    export default {
        name: "editPwd",
        data() {
            return {
                editPwdForm: this.$form.createForm(this, {name: "editPwd-form"}),
                password: "",
            }
        },
        methods: {
            // 获取密码
            getPassword(rules, value, callback) {
                this.password = value
                callback()
            },
            // 确认密码
            confirmPwd(rules, value, callback) {
                if (value && this.password !== value) {
                    callback("两次密码不一致")
                }
                callback()
            },
            // 修改密码
            changePwd(e) {
                e.preventDefault()
                this.editPwdForm.validateFields((err, value) => {
                    if (!err) {
                        this.Post("/user/resetPassword", {
                            password: value['oldPassword'],
                            newPassword: value['newPassword'],
                            username: this.getCookie('username')
                        }).then(res => {
                            res['code'] === 1000 ? this.$message.success(res['message'], 1, () => {
                                this.deleteCookie("username")
                                this.$router.push({name: "login"})
                            }) : this.$message.error(res['message'])
                        })
                    }
                })
            },
        }
    }
</script>

<style scoped>
    #editPwd-form {
        margin-top: 50px;
    }

    .input {
        width: 200px;
    }

    .btn {
        margin-top: 20px;
        margin-right: 80px;
    }
</style>
<style>
    .pwd-form .ant-form-explain {
        margin-left: 490px;
        margin-bottom: -20px;
    }
</style>