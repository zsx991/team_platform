import Vue from 'vue'
import VueRouter from 'vue-router'
import home from "../components/home";
import login from "../views/home/login";
import register from "../views/home/register";
import forgetPwd from "../views/home/forgetPwd";
import homeMenu from "../components/homeMenu";
import editPwd from "../views/menu/editPwd";
import systemModuleList from "../views/systemModule/systemModuleList";
import systemModuleAdd from "../views/systemModule/systemModuleAdd";

Vue.use(VueRouter)

const routes = [{
    path: "/",
    name: "home",
    component: home,
    children: [{
        path: "/",
        name: "login",
        component: login
    }, {
        path: "/register",
        name: "register",
        component: register
    }, {
        path: "/forgetPwd",
        name: "forgetPwd",
        component: forgetPwd
    }]
}, {
    path: "/index",
    name: "homeMenu",
    component: homeMenu,
    children: [{
        path: "/index/editPwd",
        name: "editPwd",
        component: editPwd
    }, {
        path: "/systemModule/list",
        name: "systemModuleList",
        component: systemModuleList
    },{
        path: "/systemModule/add",
        name: "systemModuleAdd",
        component: systemModuleAdd
    }]
}]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
