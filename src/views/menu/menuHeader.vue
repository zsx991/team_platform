/**
* @author: hao.ling
* @date: 2020/7/23 14:36
* @Description: 菜单头部
*/
<template>
    <div id="menu-header">
        <div id="icon"></div>
        <a-dropdown :trigger="['click']" id="drop" placement="bottomCenter">
            <a class="drop" @click="e => e.preventDefault()">
                <my-icon type="icon-user"/>
                {{username}}
                <my-icon type="icon-down"/>
            </a>
            <a-menu slot="overlay" style="margin-top: -15px">
                <a-menu-item key="0">
                    <a @click="editPwd">
                        <my-icon class="icon" type="icon-xiugaimima"/>
                        修改密码</a>
                </a-menu-item>
                <a-menu-item key="1">
                    <a @click="logout">
                        <my-icon class="icon" type="icon-logout"/>
                        退出登录</a>
                </a-menu-item>
            </a-menu>
        </a-dropdown>
    </div>
</template>

<script>
    export default {
        name: "menuHeader",
        data() {
            return {
                username: ""
            }
        },
        created() {
            this.username = this.getCookie("username")
        },
        methods: {
            // 修改密码
            editPwd() {
                this.$router.push({name: "editPwd"})
            },
            // 退出登录
            logout() {
                this.deleteCookie('username')
                this.$router.push({name: "login"})
            }
        }
    }
</script>

<style scoped>
    #icon {
        height: 50px;
        width: 60px;
        background: url("../../../public/icon.jpg");
        background-size: cover;
        margin-top: 8px;
        position: absolute;
    }

    #drop {
        float: right;
        margin-right: 50px;
        font-size: 20px;
        color: white;
    }

    .icon {
        margin-right: 2px;
    }
</style>