/**
* @author: hao.ling
* @date: 2020/7/23 14:38
* @Description: 首页菜单栏
*/
<template>
    <div id="menu-side">
        <a-menu mode="inline" :open-keys="openKeys" @openChange="onOpenChange" :defaultSelectedKeys="selectKey">
            <a-sub-menu v-for="menu in menu_list" :key="menu.key">
                <span slot="title"><my-icon :type="menu.icon" style="font-size: 18px"/>{{menu.name}}</span>
                <a-menu-item v-for="list in menu.menu" :key="list.key">
                    <my-icon :type="list.icon" style="font-size: 16px"/>
                    <span @click="goto(list.path)">{{list.name}}</span>
                </a-menu-item>
            </a-sub-menu>
        </a-menu>
    </div>
</template>

<script>
    export default {
        name: "menuSide",
        data() {
            return {
                rootSubmenuKeys: ['sub1', 'sub2'],
                openKeys: [],
                selectKey: [this.$route.path],
                menu_list: [{
                    key: "sub1", icon: "icon-xitongmokuai", name: "系统模块管理",
                    menu: [
                        {key: "/systemModule/list", icon: "icon-system", path: {name: "systemModuleList"}, name: "系统模块"}
                    ],
                }, {
                    key: "sub2", icon: "icon-test-case-group", name: "测试用例管理",
                    menu: [
                        {key: "/functional/list", icon: "icon-mokuai", path: {name: "functionalList"}, name: "功能测试用例"},
                    ],
                }],
            }
        },
        created() {
            this.refresh()
        },
        methods: {
            // 展开当前菜单
            onOpenChange(openKeys) {
                const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1)
                this.rootSubmenuKeys.indexOf(latestOpenKey) === -1 ? this.openKeys = openKeys : this.openKeys = latestOpenKey ? [latestOpenKey] : []
            },
            // 刷新页面保存当前路径
            refresh() {
                this.menu_list.some((menu) => {
                    menu.menu.some((item) => {
                        if (item['key'] === this.selectKey[0]) {
                            this.openKeys = [menu.key]
                            return true
                        }
                    })
                })
            },
            // 菜单跳转
            goto(value) {
                this.$router.push(value)
            }
        }
    }
</script>

<style scoped>

</style>