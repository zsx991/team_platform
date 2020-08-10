/**
* @author: hao.ling
* @date: 2020/7/23 14:31
* @Description: 登录后首页
*/
<template>
    <div id="home-menu">
        <a-layout>
            <a-layout-header id="layout-header">
                <menu-header/>
            </a-layout-header>
            <a-layout>
                <a-layout-sider id="layout-side">
                    <menu-side/>
                </a-layout-sider>
                <a-layout-content id="layout-content">
                    <menu-content/>
                </a-layout-content>
            </a-layout>
        </a-layout>
    </div>
</template>

<script>
    import MenuHeader from "../views/menu/menuHeader";
    import MenuSide from "../views/menu/menuSide";
    import MenuContent from "../views/menu/menuContent";

    export default {
        name: "homeMenu",
        components: {MenuContent, MenuSide, MenuHeader}
    }
</script>

<style scoped>
    #layout-header {
        background-color: green;
    }

    #layout-side {
        height: 90.2%;
        position: absolute;
        background: white;
    }

    #layout-content {
        left: 14.6%;
        height: 90.2%;
        width: 85.4%;
        border-left: 1px solid black;
        position: absolute;
        background: white;
    }
</style>