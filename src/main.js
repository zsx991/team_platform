import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd, {Icon, message} from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import Cookie from 'vue-cookie'
import Axios from "axios";

Vue.config.productionTip = false

Vue.use(Antd)

// axios请求服务地址
Axios.defaults.baseURL = "http://192.168.253.134:9900/api";

// 请求超时时间(豪秒)
Axios.defaults.timeout = 10000

// 请求拦截
Axios.interceptors.request.use(request => {
    return request
}, error => {
    return Promise.reject(error)
})

// 响应拦截
Axios.interceptors.response.use(response => {
    return response
}, error => {
    if (error && error.response) {
        switch (error.response.status) {
            case 400:
                error.message = "请求错误(400)"
                break
            case 403:
                error.message = "拒绝访问(403)"
                break
            case 404:
                error.message = "访问资源未找到(404)"
                break
            case 405:
                error.message = "请求方法错误(405)"
                break
            case 408:
                error.message = "请求超时(408)"
                break
            case 500:
                error.message = "服务器错误(500)"
                break
            case 502:
                error.message = "网络错误(502)"
                break
            case 503:
                error.message = "服务不可用(503)"
                break
            case 504:
                error.message = "网络超时(504)"
                break
            default:
                error.message = `连接出错(${error.response.status})`
        }
    } else {
        error.message = "连接服务器失败"
    }
    message.error(error.message)
    return Promise.reject(error)
})

// get请求
Vue.prototype.Get = function (url, param = {}) {
    return new Promise((resolve, reject) => {
        Axios.get(url, {params: param}).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err.data)
        })
    })
}

// post请求
Vue.prototype.Post = function (url, param = {}) {
    return new Promise((resolve, reject) => {
        Axios({
            url: url, method: "post", data: param,
        }).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err.data)
        })
    })
}

// 保存cookie
Vue.prototype.setCookie = function (name, value) {
    Cookie.set(name, value)
}

// 获取cookie
Vue.prototype.getCookie = function (name) {
    return Cookie.get(name)
}

// 删除cookie
Vue.prototype.deleteCookie = function (name) {
    Cookie.delete(name)
}


// 设置信息提示
message.config({
    top: `60px`,
    duration: 1.5,
    maxCount: 3
})

// 定义使用iconfont图标
Vue.component("MyIcon", Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1964783_umyt53ridjd.js',
}))

// 全局路由守卫
router.beforeEach((to, from, next) => {
    if (to.path !== '/' && to.path !== '/register' && to.path !== '/forgetPwd') {
        if (Cookie.get('username') === null) {
            next('/');
        } else {
            next()
        }
    } else {
        next()
    }
});

new Vue({
    router,
    store,
    'render': h => h(App)
}).$mount('#app')
