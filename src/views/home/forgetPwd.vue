/**
* @author: hao.ling
* @date: 2020/7/22 16:08
* @Description: 忘记密码
*/
<template>
    <div id="forgetPwd">
        <h1 align="center" style="margin-top: 10px">重置密码</h1>
        <a-spin :spinning="spinning">
            <a-form :form="forget_form" :label-col="{span:7}" @submit="resetPwd">

                <a-form-item label="用户名" style="margin-bottom: 5px ;margin-top: 8px" class="login-form">
                    <a-input  size="small" placeholder="请输入用户名" class="input"
                             v-decorator="['username',{rules:[{required:true,message:'请输入用户名'}]}]"
                              :disabled=nameDisable>
                        <my-icon class="icon" slot="prefix" type="icon-user"/>
                    </a-input>
                </a-form-item>
                <div v-if="isReset">
                    <a-form-item label="设置密码" style="margin-bottom: 5px ;margin-top: 10px" class="login-form">
                    <a-input-password size="small" placeholder="请设置新的密码"
                             class="input"
                             v-decorator="['password',{rules:[{required:true,message:'请设置新的密码'}]}]"
                             @blur="setpassword"
                    >
                        <my-icon class="icon" slot="prefix" type="icon-password"/>
                    </a-input-password>
                    </a-form-item>
                    <a-form-item label="确认密码" style="margin-bottom: 5px ;margin-top: 10px" class="login-form">
                    <a-input-password size="small" placeholder="请重复新的密码" class="input"
                             v-decorator="['confirmPassword',{rules:[{required:true,message:'请重复新的密码'}
                             ,{validator:validatePwdBlur}]}]"
                    >
                        <my-icon class="icon" slot="prefix" type="icon-password"/>
                    </a-input-password>
                    </a-form-item>
                    <a-form-item label="图形验证码" style="margin-bottom: 5px ;margin-top: 10px" class="login-form">
                        <a-input size="small" placeholder="验证码" style="width: 100px;z-index: 50"
                         v-decorator="['picture',{rules:[{required: true,message:'请输入验证码'},
                         {validator:confirmCode}]}]">
                        <my-icon class="icon" slot="prefix" type="icon-yanzhengma"/>
                        </a-input>
                        <div @click="refreshCode">
                            <verification-code :identifyCode="identifyCode" style="cursor: pointer"/>
                        </div>
                    </a-form-item>
                </div>

                <div v-if="!isReset">
                    <a-button type="primary" class="btn" style="margin-left: 70px">
                        <router-link to="/">取消</router-link>
                    </a-button>
                    <a-button type="primary" style="margin-left: 30px" class="btn" @click="nextStep">下一步</a-button>
                </div>
                <div v-else>
                    <a-button type="primary" class="btn" style="margin-left: 70px">
                        <router-link to="/">取消</router-link>
                    </a-button>
                    <a-button type="primary" style="margin-left: 30px" class="btn" @click="resetPwd">重置密码</a-button>
                </div>

            </a-form>
        </a-spin>
    </div>
</template>

<script>
    import VerificationCode from "./verificationCode";

    export default {
        name: "forgetPwd",
        components: {VerificationCode},
         data() {
            return {
                forget_form: this.$form.createForm(this, {name: "forget-form"}),
                loading:false,
                isReset:false,
                nameDisable:false,
                username:'',
                password:'',
                spinning:false,
                identifyCode: "",
                identifyCodes: "1234567890abcdefghijklmnopqrstuvwxyz"
            }
        },
        mounted() {
            this.identifyCode = ""
            this.makeCode(this.identifyCodes, 4)
        },

        methods:{
            nextStep(e){

                e.preventDefault()

                this.forget_form.validateFields((err, values) =>{

                    if (!err) {
                        this.Post("/user/checkUser", {
                            "username": values['username']
                        }).then(res => {
                            if (res['code'] === 9999){
                                this.$message.error(res['message'])
                            }
                            else {
                                this.isReset = true
                                this.nameDisable=true
                                this.username =res['data']['username']
                            }

                        })
                    }
                })
            },
            setpassword(e){
                this.password = e.target.value
            },

            // 校验密码是否一致
            validatePwdBlur(rules, value, callback){
                if (this.password !== value && value) {
                    callback("两次输入密码不一致")
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
            },

            //重置密码
            resetPwd(e){

                e.preventDefault()
                this.forget_form.validateFields((err, values) =>{

                    if (!err) {
                        this.spinning=true
                        this.Post("/user/resetPassword", {
                            "password": values['password'],
                            "username": this.username
                        }).then(res => {

                            this.spinning = false
                            if (res['code'] === 9999){
                                this.$message.error(res['message'])
                            }
                            else {
                                this.$message.success(res['message'],1,this.$router.push({name:"login"}))
                            }

                        })
                    }
                })
            }

        }
    }
</script>

<style scoped>

     #forgetPwd {
        width: 385px;
        height: 340px;
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