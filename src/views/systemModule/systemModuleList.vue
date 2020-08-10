/**
* @author: hao.ling
* @date: 2020/8/5 14:47
* @Description: 系统模块列表
*/
<template>
    <div id="system-module-list">
        <a-layout>
            <a-layout-header id="system-header">
                <a-form layout="inline">
                    <a-form-item label="系统名称">
                        <a-select style="width: 120px" v-model="system_name" @change="change" allowClear
                                  placeholder="请选择">
                            <a-select-option v-for="system in system_list" :key="system.systemName">
                                {{system.systemName}}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="模块名称">
                        <a-select style="width: 120px" v-model="module_name" allowClear placeholder="请选择"
                                  @focus="check">
                            <a-select-option v-for="newModule in new_module_list" :key="newModule.moduleName">
                                {{newModule.moduleName}}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-tooltip>
                        <template slot="title">查询</template>
                        <my-icon type="icon-search" class="icon" style="color: blue;" @click="search"/>
                    </a-tooltip>
                    <a-tooltip>
                        <template slot="title">重置</template>
                        <my-icon type="icon-zhongzhi" class="icon" style="color: red;" @click="reset"/>
                    </a-tooltip>
                    <a-tooltip>
                        <template slot="title">新增</template>
                        <my-icon type="icon-add1" class="icon" style="color: green;" @click="addSystem"/>
                    </a-tooltip>
                </a-form>
            </a-layout-header>
            <a-layout-content style="background-color: white;">
                <a-table :dataSource="data_list" bordered :columns="column" :pagination="false" :scroll="{x:500,y:500}"
                         style="margin-left: 30px;margin-right: 30px">
                    <span slot="action" slot-scope="text,record">
                        <a-tooltip>
                            <template slot="title">编辑</template>
                            <my-icon type="icon-edit" class="icon" @click="edit(text)" style="color: lawngreen"/>
                        </a-tooltip>
                        <a-tooltip>
                            <template slot="title">查看</template>
                            <my-icon type="icon-chakan" class="icon" @click="view(text)"
                                     style="color: blueviolet"/>
                        </a-tooltip>
                        <a-tooltip>
                            <template slot="title">删除</template>
                            <a-popconfirm title="是否确认删除" ok-text="确认" cancel-text="取消" @confirm="del(record.id)">
                            <my-icon type="icon-delete" class="icon" @click="del(record.id)" style="color: red"/>
                        </a-popconfirm>
                        </a-tooltip>
                    </span>
                </a-table>
                <a-pagination id="pagination" :default-current="curPage" :total="total" :page-size="pageSize" :show-total="total => `共${total}条`"
                              @change="onChange"/>
            </a-layout-content>
        </a-layout>
    </div>
</template>

<script>
    let systemId = 1
    let moduleId = 1

    const column = [
        {title: "操作", key: "action", align: "center", width: 130, scopedSlots: {customRender: "action"}, fixed: "left"},
        {title: "项目名称", dataIndex: "systemName", key: "system", align: "center", width: 150},
        {title: "模块名称", dataIndex: "moduleName", key: "module", align: "center", width: 150},
        {title: "模块地址", dataIndex: "address", key: "address", align: "center", width: 300},
        {title: "环境", dataIndex: "pre", key: "pre", align: "center", width: 100},
        {title: "环境地址", dataIndex: "preAddress", key: "preAddress", align: "center", width: 300},
        {title: "数据库地址", dataIndex: "dbAddress", key: "dbAddress", align: "center", width: 300},
        {title: "通用数据", dataIndex: "data", key: "data", align: "center", width: 300}
    ]

    export default {
        name: "systemModuleList",
        data() {
            return {
                system_name: undefined ,
                module_name: undefined ,
                system_list: [],
                module_list: [],
                new_module_list: [],
                data_list: [], column,
                total: 0, curPage: 1, pageSize: 5,
                openSelect: false
            }
        },
        created() {
            this.getProjectModuleName()
            this.getSystemModuleList()
        },
        methods: {
            // 获取项目、模块名称
            getProjectModuleName() {
                systemId = 1
                this.system_list = []
                this.module_list = []
                this.Get("/project/getProjectTree", {}).then(res => {
                    console.log(res)
                    res['code'] === 1000 ? res['data'].map((item) => {
                        this.system_list.push({id: systemId, systemName: item['systemName']})
                        moduleId = 1
                        item['modules'].map((module) => {
                            this.module_list.push({
                                id: moduleId, systemId: systemId, moduleName: module['modulesName'],
                                systemName: item['systemName']
                            })
                            moduleId++
                        })
                        systemId++
                    }) : this.$message.error(res['message'])
                })
            },
            // 通过项目名称获取模块信息
            change(value) {
                this.new_module_list = []
                moduleId = 1
                this.module_list.map((list) => {
                    value === list['systemName'] ? this.new_module_list.push({
                        id: moduleId, moduleName: list['moduleName']
                    }) : ""
                    moduleId++
                })
                this.module_name = undefined
            },
            // 编辑
            edit(value) {
                this.$router.push({'name':"systemModuleAdd", query: {id: value}})
                console.log(value)
            },
            // 查看
            view(value) {
                console.log(value)
            },
            // 删除
            del(value) {
                console.log(value)
            },
            // 查询
            search() {
                // console.log(this.system_name, this.module_name)
                this.getSystemModuleList(this.system_name, this.module_name)
            },
            // 重置
            reset() {
                this.system_name = undefined
                this.module_name = undefined
            },
            // 新增
            add() {

            },
            // 分页
            onChange(page) {
                this.curPage = page
                this.getSystemModuleList(this.system_name,this.module_name)
            },
            // 检查是否选择项目
            check() {
                if (this.system_name === undefined) {
                    this.$message.error("请选择项目名称", 2)
                }
            },
            // 获取系统模块列表
            getSystemModuleList(programName = undefined , modulesName = undefined ) {
                let data = {}
                programName && modulesName !== null ? data = {
                    programName: this.system_name, modulesName: this.module_name,pageSize: this.pageSize,pageNum : this.curPage
                } : data = {
                    pageSize: this.pageSize,pageNum : this.curPage
                }
                this.data_list = []
                let pre = ""
                this.Get("/project/getProjectList", data).then(res => {
                    if (res['code'] === 1000) {
                        this.total = res['data']['total']
                        res['data']['project'].map((item) => {
                            item['env'] === 1 ? pre = "测试" : pre = "生产"
                            this.data_list.push({
                                systemName: item['programName'], moduleName: item['modulesName'], data: item['comData'],
                                address: item['modulesUrl'], preAddress: item['programHost'], pre: pre,
                                dbAddress: item['sql'], id: item['id'],moduleId:item['modulesId']
                            })
                        })
                    } else this.$message.error(res['message'])
                })
            },

            addSystem(){
                this.$router.push({name:"systemModuleAdd"})
            }
        }
    }
</script>

<style scoped>
    #system-header {
        height: 50px;
        background-color: white;
    }

    .icon {
        cursor: pointer;
        margin-top: 10px;
        font-size: 20px;
        margin-right: 10px;
    }

    #pagination {
        float: right;
        margin-top: 10px;
        margin-right: 50px;
    }
</style>
<style>

</style>