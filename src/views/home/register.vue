/**
* @author: hao.ling
* @date: 2020/7/22 14:01
* @Description: 注册页面
*/
<template>
    <div id="register">
        <h1 align="center">注册</h1>
        <a-form :form="register_form" :label-col="{span:7}" @submit="register">
            <a-form-item label="用户名" style="margin-bottom: 5px" class="register-form">
                <a-input size="small" placeholder="请输入用户名" class="input"
                         v-decorator="['username',{rules:[{required:true,message:'请输入用户名'}]}]">
                    <my-icon class="icon" slot="prefix" type="icon-user"/>
                </a-input>
            </a-form-item>
            <a-form-item label="密码" style="margin-bottom: 5px" class="register-form">
                <a-input-password size="small" placeholder="请输入密码" class="input"
                                  v-decorator="['password',{rules:[{required: true,message:'请输入密码'},{validator:getPassword}]}]">
                    <my-icon class="icon" slot="prefix" type="icon-password"/>
                </a-input-password>
            </a-form-item>
            <a-form-item label="确认密码" style="margin-bottom: 5px" class="register-form">
                <a-input-password size="small" placeholder="请确认密码" class="input"
                                  v-decorator="['confirmPwd',{rules:[{required: true,message:'请确认密码'},{validator:confirmPwd}]}]">
                    <my-icon class="icon" slot="prefix" type="icon-password"/>
                </a-input-password>
            </a-form-item>
            <a-form-item label="验证码" style="margin-bottom: -10px" class="code-form">
                <a-input size="small" placeholder="验证码" style="width: 100px;z-index: 50"
                         v-decorator="['picture',{rules:[{required: true,message:'请输入验证码'},{validator:confirmCode}]}]">
                    <my-icon class="icon" slot="prefix" type="icon-yanzhengma"/>
                </a-input>
                <div @click="refreshCode">
                    <verification-code :identifyCode="identifyCode" style="cursor: pointer"/>
                </div>
            </a-form-item>
            <a-button type="primary" class="btn" style="margin-left: 90px">
                <router-link to="login">登录</router-link>
            </a-button>
            <a-button type="primary" class="btn" @click="register">注册</a-button>
        </a-form>
    </div>
</template>

<script>
    import VerificationCode from "./verificationCode";

    export default {
        name: "register",
        components: {VerificationCode},
        data() {
            return {
                register_form: this.$form.createForm(this, {name: "register-form"}),
                password: "",
                identifyCode: "",
                identifyCodes: "1234567890abcdefghijklmnopqrstuvwxyz"
            }
        },
        mounted() {
            this.identifyCode = ""
            this.makeCode(this.identifyCodes, 4)
        },
        methods: {
            // 注册
            register(e) {
                e.preventDefault()
                this.register_form.validateFields((err, values) => {
                    if (!err) {
                        this.Post("/register", {
                            username: values['username'], password: values['password']
                        }).then(res => {
                            res['code'] === 1000 ? this.$message.success(res['message'], 1, () => {
                                this.$router.push({name: "login"})
                            }) : this.$message.error(res['message'])
                        })
                    }
                })
            },
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
            // 确认验证码
            confirmCode(rules, value, callback) {
                if (value !== this.identifyCode) {
                    callback("验证码错误")
                }
                callback()
            },
            // 刷新图片验证码
            refreshCode() {
                this.identifyCode = ""
                this.makeCode(this.identifyCodes, 4)
            },
            // 生成随机数
            randomNum(min, max) {
                max = max + 1
                return Math.floor(Math.random() * (max - min) + min)
            },
            // 随机选择
            makeCode(data, len) {
                for (let i = 0; i < len; i++) {
                    this.identifyCode += data[this.randomNum(0, data.length - 1)]
                }
            }
        }
    }
</script>

<style scoped>
    #register {
        width: 380px;
        height: 320px;
        background-color: white;
        margin-top: 100px;
        margin-left: 500px;
        border: 1px solid black;
        border-radius: 15px;
    }

    .input {
        width: 200px;
    }

    .icon {
        font-size: 16px;
        margin-left: -3px;
    }

    .btn {
        margin-top: 10px;
        margin-right: 50px;
    }
</style>
<style>
    .code-form .ant-form-explain {
        margin-top: -20px;
        margin-left: 110px;
    }

    .register-form .ant-form-explain {
        margin-top: -20px;
        margin-left: 110px;
        margin-bottom: -20px;
    }
</style>