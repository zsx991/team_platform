/**
* @author: hao.ling
* @date: 2020/7/22 9:57
* @Description: 登录页面
*/
<template>
    <div id="login">
        <h1 align="center">Welcome</h1>
        <a-form :form="login_form" :label-col="{span:7}" @submit="login">
            <a-form-item label="用户名" style="margin-bottom: 5px" class="login-form">
                <a-input size="small" placeholder="请输入用户名" class="input"
                         v-decorator="['username',{rules:[{required:true,message:'请输入用户名'}]}]">
                    <my-icon class="icon" slot="prefix" type="icon-user"/>
                </a-input>
            </a-form-item>
            <a-form-item label="密码" style="margin-bottom: -10px" class="login-form">
                <a-input-password size="small" placeholder="请输入密码" class="input" @keyup.native.enter="login"
                                  v-decorator="['password',{rules:[{required:true,message:'请输入密码'}]}]">
                    <my-icon class="icon" slot="prefix" type="icon-password"/>
                </a-input-password>
            </a-form-item>
            <a-button type="link" id="forget" size="small">
                <router-link :to="{name: 'forgetPwd'}">忘记密码？</router-link>
            </a-button>
            <a-button type="primary" class="btn" style="margin-left: 90px">
                <router-link :to="{name:'register'}">注册</router-link>
            </a-button>
            <a-button type="primary" class="btn" @click="login">登录</a-button>
        </a-form>
    </div>
</template>

<script>
    export default {
        name: "login",
        data() {
            return {
                login_form: this.$form.createForm(this, {name: "login-form"})
            }
        },
        methods: {
            // 登录
            login(e) {
                e.preventDefault()
                this.login_form.validateFields((err, values) => {
                    if (!err) {
                        this.Post("/login", {
                            "username": values['username'], "password": values['password']
                        }).then(res => {
                            if (res['code'] === 1000) {
                                this.setCookie("username", res['data']['username'])
                                this.setCookie("userId", res['data']['userId'])
                                this.$router.push({name: "homeMenu"})
                                this.$message.success(res['message'], 1)
                            } else {
                                this.$message.error(res['message'])
                            }
                        })
                    }
                })
            },
        }
    }
</script>

<style scoped>
    #login {
        width: 380px;
        height: 270px;
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

    #forget {
        margin-left: 220px;
        margin-top: -40px;
    }

    .btn {
        margin-top: 25px;
        margin-right: 50px;
    }
</style>
<style>
    .login-form .ant-form-explain {
        margin-left: 110px;
        margin-bottom: -20px;
    }
</style>