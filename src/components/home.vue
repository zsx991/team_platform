/**
* @author: hao.ling
* @date: 2020/7/22 9:43
* @Description: 首页入口
*/
<template>
    <div id="home">
        <router-view/>
    </div>
</template>

<script>
    export default {
        name: "home"
    }
</script>

<style scoped>
    #home {
        width: 100%;
        height: 100%;
        background-size: auto;
        background: url('../assets/loading_bg.jpg');
        position: fixed;
    }
</style>