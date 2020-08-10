<template>
    <div id="system-module-add">
        <a-breadcrumb id="bread">
        <a-breadcrumb-item >
                <my-icon class='icon' type="icon-system" :to="{name:'systemModuleList'}"/>
                <router-link :to="{name:'systemModuleList'}">系统模块列表</router-link>

        </a-breadcrumb-item>
        <a-breadcrumb-item v-if="projectId===0">
          新增系统模块
        </a-breadcrumb-item>
            <a-breadcrumb-item v-else>
          编辑系统模块
        </a-breadcrumb-item>
        </a-breadcrumb>
        <a-form-model :model="form"
                      :label-col="labelCol"
                      :wrapper-col="wrapperCol"
                      style="margin-top: 20px;padding-top: 20px"
                      :rules = "formRules"
                      ref="rfForm"

                >
            <a-form-model-item label="选择系统" prop="system"  class ='form-item'>
                <a-select v-model="form.system" :disabled="isSelect" placeholder="请选择系统" @select="getSystemInfo" @change="changeSystem" allowClear
                          mode="combobox"
                          >
                    <a-select-option v-for="system in system_list" :key="system.systemName">
                                {{system.systemName}}
                    </a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item label="系统地址：" prop="systemhost"  class ='form-item'>
                <div style="padding-top: 25px">
                    <label>测试</label>
                    <a-input v-model="form.systemHostTest" placeholder="填写如www.baidu.com" :disabled="isTestDisabled"/>
                    <label>生产</label>
                    <a-input v-model="form.systemHostRelease" placeholder="填写如www.baidu.com" :disabled="isReleaseDisabled"/>
                </div>
            </a-form-model-item>

            <a-form-model-item label="选择模块" prop="modules"  class ='form-item'>
                <a-select v-model="form.modules" :disabled="isSelect" placeholder="请选择模块" @select="getModuleInfo" @change="changeModule" allowClear mode="combobox">
                    <a-select-option v-for="newModule in new_module_list" :key="newModule.moduleName">
                                {{newModule.moduleName}}
                    </a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item label="模块地址："  prop="modulesurl" class ='form-item'>
                 <a-input v-model="form.modulesUrl" placeholder="填写如/login"/>
            </a-form-model-item>

            <a-form-model-item label="通用数据">
                <div style="padding-top: 25px">
                    <label>测试</label>
                    <a-input v-model="form.comDataTest" type="textarea" placeholder="填写如{key:vaule,key:vaule}" :disabled="isTestDisabled"/>
                    <label>生产</label>
                    <a-input v-model="form.comDataRelease" type="textarea" placeholder="填写如{key:vaule,key:vaule}" :disabled="isReleaseDisabled"/>
                </div>
            </a-form-model-item>

            <a-form-model-item label="选择数据库" prop="sqls"  class ='form-item'>
                <a-select style="width: 150px" v-model="form.sqls" placeholder="请选择数据库" @change="changeSql" @select="getSqlInfo" allowClear>
                    <a-select-option v-for="sql in sql_list" :key="sql.sqlName">
                                {{sql.sqlName}}
                    </a-select-option>
                </a-select>
                <a-button type="primary" @click="addDB" style="margin-left: 30px;margin-right: 30px">
                +数据库
              </a-button>
                <div v-if="sqlSelected">
                    <a-table  :dataSource="data_list" bordered :columns="column" :pagination="false"
                         style="margin-left: 30px;margin-right: 30px">
                </a-table>
                </div>

            </a-form-model-item>

            <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
              <a-button type="primary" @click="addProject">
                新增
              </a-button>
              <a-button style="margin-left: 10px;" @click="backProjectList">
                返回
              </a-button>
            </a-form-model-item>
        </a-form-model>
        <div >
                    <a-modal class="add-modal" v-model="addSql" title="新增数据库" on-ok="dbhandleOk">

                        <template slot="footer">
                            <a-button key="back" @click="handleCancel">
                                返回
                            </a-button>
                            <a-button key="submit" type="primary" :loading="loading" @click="dbhandleOk">
                                提交
                            </a-button>
                        </template>
                        <a-form-model
                                ref="ruleForm"
                                :model="dbForm"
                                :rules="dbrules"
                                :label-col="dblabelCol"
                                :wrapper-col="dbwrapperCol"
                        >
                            <a-form-model-item ref="name" label="数据库名称" prop="name" class ='form-item'>
                                <a-input
                                        v-model="dbForm.name"
                                        placeholder="输入数据库名称"
                                        @blur="() => {
                                            $refs.name.onFieldBlur();
                                                 }"
                                />
                            </a-form-model-item>
                            <a-form-model-item label="" class ='form-item-tip' style="top: 20px" prop="checkBoth">
                                    <label style="font-size: 13px; color: rgba(95,95,95,0.66); left: 88px">配置规则：测试与生产两者至少填一个</label>
                            </a-form-model-item>

                            <a-form-model-item  label="测试环境"   class ='form-item'>
                                    <a-input v-model="dbForm.Test" :rows="6" type="textarea" placeholder="输入测试环境配置"
                                             />

                            </a-form-model-item>
                            <a-form-model-item ref="name" label="生产环境"  class ='form-item' >
                                    <a-input v-model="dbForm.Release" :rows="6" type="textarea" placeholder="输入生产环境配置"/>

                            </a-form-model-item>

                        </a-form-model>
                    </a-modal>
                </div>
    </div>
</template>

<script>
    let systemId = 1
    let moduleId = 1

    const column =[

        {title: "环境", dataIndex: "pre", key: "pre", align: "center", width: 100},
        {title: "地址", dataIndex: "sqlHost", key: "sql", align: "center", width: 150},
        {title: "port", dataIndex: "sqlPort", key: "port", align: "center", width: 150},
        {title: "用户名", dataIndex: "sqlUser", key: "user", align: "center", width: 300},
        {title: "密码", dataIndex: "sqlPwd", key: "pwd", align: "center", width: 300},
    ]

    let dbdefault = "{\n" +
        "\"sqlHost\":\"\",\n" +
        "\"sqlPort\":\"\",\n" +
        "\"sqlUser\":\"\",\n" +
        "\"sqlPwd\":\"\"\n" +
        "}"

    export default {
        name: "systemModuleAdd",

        data() {
            let  checkDBConfig =(rules, value, callback)=> {
                if (JSON.parse(this.dbForm.Release)['sqlHost'] ==='' && JSON.parse(this.dbForm.Test)['sqlHost'] === '') {
                    callback('测试和生产至少填写一个')
                } else callback()
            };

            let  checkModuleUrl =(rules, value, callback)=> {

                if (!this.form.modulesUrl) {
                    callback('请填写项目地址')
                } else callback()
            };

            let  checkSystemHost =(rules, value, callback)=> {

                if (!this.form.systemHostTest && !this.form.systemHostRelease) {
                    callback('请测试和生产地址至少填一个')
                } else callback()
            };

            return {
                column,
                labelCol: { span: 4 },
                wrapperCol: { span: 14 },
                dblabelCol: { span: 8 },
                dbwrapperCol: { span: 14 },
                projectId:0,
                form: {
                    system: undefined,
                    modules: undefined,
                    sqls:undefined,
                    systemHostTest: '',
                    systemHostRelease:'',
                    comDataTest: '',
                    comDataRelease:'',
                    modulesUrl:'',


                },
                formRules:{
                    system:[{ required: true, message: '请选择系统', trigger: 'change' }],
                    systemhost:[{ validator:checkSystemHost, trigger: 'change' }],
                    modules:[{ required: true, message: '请选择模块', trigger: 'change' }],
                    modulesurl:[{ validator:checkModuleUrl, trigger: 'change'  }],
                    sqls:[{ required: true, message: '请选择相关数据库', trigger: 'change' }],

                },
                system_list:[],
                module_list:[],
                programIdT:0,
                programIdR:0,
                modulesId:0,
                new_module_list:[],
                sql_list:[],
                data_list:[],
                system_info:[],
                sqlSelected:false,

                addSql:false,
                dbdefault,
                dbForm: {
                    name: '',
                    Test:dbdefault,
                    Release:dbdefault,
                },
                dbrules: {
                    name: [
                        { required: true,message: '请输入数据库配置', trigger: 'blur' },
                    ],
                    checkBoth: [{ validator:checkDBConfig },],
                },

                loading:false,

                isTestDisabled:false,
                isReleaseDisabled:false,
                isSelect:false

            };
        },
        created() {

            this.getSqlName()
            if (this.$route.query['id'] !== undefined){

                this.projectId = this.$route.query['id']['id']
                this.editProject()
            }else {
                this.getProjectModuleName()

            }


        },

        methods: {
            // 获取项目、模块名称
            getProjectModuleName() {

                systemId = 1
                this.system_list = []
                this.module_list = []
                this.Get("/project/getProjectTree", {}).then(res => {
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

            getSqlName() {
                this.Get('/project/checkSqlData', {}).then(res => {
                    res['code'] === 1000 ? res['data'].map((item) => {
                        this.sql_list.push({sqlId: item['sqlId'], sqlName: item['sqlName']})
                    }) : this.$message.error(res['message'])
                    // console.log(this.sql_list)
                })
            },

            // 通过项目名称获取模块信息
            changeSystem(value) {
                this.new_module_list = []
                moduleId = 1
                this.module_list.map((list) => {
                    value === list['systemName'] ? this.new_module_list.push({
                        id: moduleId, moduleName: list['moduleName']
                    }) : ""
                    moduleId++
                })

                this.form.systemHostTest = ''
                this.form.systemHostRelease = ''
                this.form.modules = undefined
                this.form.comDataTest = ''
                this.form.comDataRelease = ''

            },

            // 通过项目名称获取项目信息
            getSystemInfo(value) {
                // console.log(value)
                this.Post('/project/getProgramDetail', {
                    'programName': value
                }).then(res => {
                    if (res['code'] === 1000) {
                        console.log(res)
                        res['data'].map((item) => {
                            this.programId = item['programId']
                            if (item['env'] === 1) {
                                this.form.systemHostTest = item['programHost']
                                this.form.comDataTest = item['comData']
                                this.programIdT = item['programId']
                            }
                            if (item['env'] === 2) {
                                this.form.systemHostRelease = item['programHost']
                                this.form.comDataRelease = item['comData']
                                this.programIdR = item['programId']
                            }
                        })
                    } else this.$message.error(res['message'])
                })
            },

            // 通过输入模块名称
            changeModule(value) {
                this.form.modules = value
                this.form.modulesUrl = ''
                this.modulesId = 0

            },

            getModuleInfo(value) {

                this.Post('/project/getModulesDetail', {
                    'modulesName': value
                }).then(res => {
                    // console.log(res)
                    if (res['code'] === 1000) {
                        this.form.modulesUrl = res['data']['modulesUrl']
                        this.modulesId = res['data']['mId']
                        // console.log(this.form.modulesUrl)
                    } else this.$message.error(res['message'])
                    }
                )
            },
            changeSql() {
                this.data_list = []
                this.sqls === undefined ? this.sqlSelected = false : ''
            },
            getSqlInfo(value) {
                let pre = ""
                this.sqlSelected = true
                this.Get('/project/getSqldataDetails', {
                    sqlName: value

                }).then(res => {
                    if (res['code'] === 1000) {
                        res['data'].map((item) => {
                            item['env'] === 1 ? pre = "测试" : pre = "生产"
                            this.data_list.push({
                                sqlHost: item['sqlHost'], sqlPort: item['sqlPort'], sqlUser: item['sqlUser'],
                                sqlPwd: item['sqlPwd'], pre: pre, env: item['env'], sqlId: item['id']
                            })
                        })
                    } else this.$message.error(res['message'])
                })
            },

            addProject() {
                // console.log(this.form.modulesUrl)
                this.$refs.rfForm.validate(valid => {
                    if (valid) {
                        this.system_info = []
                        for (var i = 1; i < 3; i++) {
                            let syshost = ''
                            let comData = ''
                            let programid = 0
                            if (i === 1) {
                                syshost = this.form.systemHostTest
                                comData = this.form.comDataTest
                                programid = this.programIdT
                            } else {
                                syshost = this.form.systemHostRelease
                                comData = this.form.comDataRelease
                                programid = this.programIdR
                            }
                            if (syshost !== '') {
                                this.system_info.push({
                                    "programHost": syshost,
                                    'comData': comData,
                                    'env': i,
                                    'programId': programid,
                                    'programName': this.form.system,
                                    'status': 0
                                })
                            }
                        }
                        // console.log(this.modulesId)
                        this.Post('/project/addProject', {
                            "programInfo": this.system_info,
                            "modulesInfo": {
                                "modulesId": this.modulesId,
                                "modulesUrl": this.form.modulesUrl,
                                "modulesName": this.form.modules,
                                "status": 0
                            },
                            "sqlInfo": this.data_list,
                            "projectId":this.projectId
                        }).then(res => {
                            res['code'] === 1000 ? this.$message.success(res['message'], 1, this.$router.push({"name": "systemModuleList"})) : this.$message.error[res['message']]
                        })
                    }
                })

            },

            backProjectList(){
                this.$router.push({"name":"systemModuleList"})
            },

            addDB() {
                this.addSql = true
            },

            dbhandleOk() {

                // let isVaild = this.checkDBConfig()
                const sqlInfo = [];
                this.$refs.ruleForm.validate(vaild=>{
                    if (vaild){
                    const dbRelease = JSON.parse(this.dbForm.Release);
                    const dbTest = JSON.parse(this.dbForm.Test);
                    if (dbRelease['sqlHost'] !==''){
                        dbRelease['sqlName'] = this.dbForm.name
                        dbRelease['env'] =2
                        sqlInfo.push(dbRelease)
                    }
                    if (dbTest['sqlHost'] !==''){
                        dbTest['sqlName'] = this.dbForm.name
                        dbTest['env'] =1
                        sqlInfo.push(dbTest)
                    }
                    // console.log(sqlInfo)
                    this.Post('/project/addDB',{
                        "sqlList":sqlInfo
                    }).then((res)=>{
                        if (res['code']===1000){
                            this.$message.success(res['message'],this.getSqlName())
                            this.addSql = false
                            this.resetDB();
                        }else this.$message.error(res['message'])
                    })
                }
                })

            },

            handleCancel() {
                this.addSql = false

            },

            resetDB(){
                this.dbForm.name=''
                this.dbForm.Test = this.dbdefault
                this.dbForm.Release = this.dbdefault
            },

            async editProject(){
                this.isSelect = true
                this.form.system = this.$route.query['id']['systemName']
                if (this.$route.query['id']['pre'] ==='生产'){
                    this.isTestDisabled = true
                }else {
                    this.isReleaseDisabled = true
                }
                await this.getSystemInfo(this.form.system)
                this.form.modules = this.$route.query['id']['moduleName']
                this.form.modulesUrl = this.$route.query['id']['address']
                this.modulesId = this.$route.query['id']['moduleId']
                this.form.sqls = JSON.parse(this.$route.query['id']['dbAddress'])['sqlName']
                this.getSqlInfo(this.form.sqls)
            }
        }
    }
</script>

<style scoped>
    #bread{
        margin-left: 20px;
        margin-top: 10px;
        font-size: 13px;
        margin-right: 28px;
    }
    #system-header {
        height: 50px;
        background-color: white;
    }

    .icon {
        cursor: pointer;
        margin-top: 10px;
        font-size: 20px;
        left: 20px;
    }

    #pagination {
        float: right;
        margin-top: 10px;
        margin-right: 50px;
    }
</style>
<style>
    .form-item .ant-form-explain{
        margin-top: 4px;
        margin-bottom:5px;
    }
    .form-item-tip .ant-form-explain{
        margin-top: 4px;
        margin-bottom:8px;
        margin-left: 88px;
    }
</style>