<template>
    <div class="app-container">

        <div class="filter-container">
            <sticky class-name="sub-navbar">
                <el-col :span="6">
                    <el-select v-model="listQuery.keyDevID" class="filter-item"
                               :placeholder="$t('table.tbViFiDevice.keyDevID')" filterable remote
                               style="width:90%" clearable
                               @focus="switchKeyDevID" :remote-method="remoteKeyDevIDMethod"
                               :loading="selectLoading"
                               clearable>
                        <el-option v-for="item in keyDevIDOptions" :key="item.value" :label="item.label"
                                   :value="item.value"/>
                    </el-select>
                </el-col>
                <el-col :span="6">
                    <el-input :placeholder="$t('table.tbViFiDevice.alaisName')" v-model="listQuery.alaisName"
                              clearable
                              prefix-icon="el-icon-search" style="width: 90%;" class="filter-item"/>
                </el-col>
                <el-col :span="6">
                    <el-select v-model="listQuery.idxDevGrpID" class="filter-item"
                               :placeholder="$t('table.tbViFiDevice.idxDevGrpID')" filterable remote
                               style="width:90%" clearable
                               @focus="switchIdxDevGrpID" :remote-method="remoteIdxDevGrpIDMethod"
                               :loading="selectLoading"
                               clearable>
                        <el-option v-for="item in idxDevGrpIDOptions" :key="item.value" :label="item.label"
                                   :value="item.value"/>
                    </el-select>
                </el-col>
                <el-col :span="6">
                    <el-select v-model="listQuery.in_online" :placeholder="$t('table.tbViFiDevice.online')" clearable
                               multiple collapse-tags style="width:  90%" class="filter-item">
                        <el-option v-for="item in onlineOptions" :key="item.key" :label="item.name" :value="item.key"/>
                    </el-select>
                </el-col>
                <el-col :span="6">
                    <el-select :placeholder="$t('table.tbViFiDevice.idxUserID')" v-model="listQuery.idxUserID"
                               prefix-icon="el-icon-search" clearable style="width:  90%;" class="filter-item" remote
                               @focus="switchIdxUserID"
                               clearable filterable :remote-method="remoteIdxUserIDMethod" :loading="selectLoading">
                        <el-option v-for="item in idxUserIDOptions" :key="item.value" :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="6">
                    <el-input :placeholder="$t('table.tbViFiDevice.iccidGlobal')" v-model="listQuery.iccidGlobal"
                              clearable prefix-icon="el-icon-search" style="width: 90%;" class="filter-item"/>
                </el-col>
                <el-col :span="6">
                    <el-input :placeholder="$t('table.tbViFiDevice.idxIccid')" v-model="listQuery.idxIccid"
                              clearable prefix-icon="el-icon-search" style="width: 90%;" class="filter-item"/>
                </el-col>
                <el-col :span="6">
                    <el-select :placeholder="$t('table.tbViFiDevice.idxAgentID')" v-model="listQuery.idxAgentID"
                               prefix-icon="el-icon-search" clearable style="width:  90%;" class="filter-item" remote
                               @focus="switchIdxAgentID"
                               clearable filterable :remote-method="remoteIdxAgentIDMethod" :loading="selectLoading">
                        <el-option v-for="item in idxAgentIDOptions" :key="item.value" :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="6">
                    <el-select :placeholder="$t('table.tbViFiDevice.softwareVer')" v-model="listQuery.softwareVer"
                               prefix-icon="el-icon-search" clearable style="width:  90%;" class="filter-item" remote
                               @focus="switchSoftwareVer"
                               clearable filterable :remote-method="remoteSoftwareVerMethod" :loading="selectLoading">
                        <el-option v-for="item in softwareVerOptions" :key="item.value" :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="6">
                    <el-date-picker
                            v-model="listQuery.lastConnectTime"
                            type="daterange"
                            style="width: 90%"
                            range-separator="~"
                            :start-placeholder="$t('table.tbViFiDevice.lastConnectTime')"
                            :end-placeholder="$t('table.tbViFiDevice.lastConnectTime')">
                    </el-date-picker>
                </el-col>
                <el-col :span="6">
                    <el-select v-model="listQuery.in_bootFirstISP" :placeholder="$t('table.tbViFiDevice.bootFirstISP')" clearable
                               multiple collapse-tags
                               style="width:  90%" class="filter-item">
                        <el-option v-for="item in bootFirstISPOptions" :key="item.key" :label="item.name"
                                   :value="item.key"/>
                    </el-select>
                </el-col>
                <el-col :span="6">
                    <el-input :placeholder="$t('table.tbViFiDevice.remark')" v-model="listQuery.remark"
                              clearable
                              prefix-icon="el-icon-search" style="width: 90%;" class="filter-item"/>
                </el-col>
                <el-col :span="6">
                    <div class="el-date-editor el-range-editor el-input__inner el-range-editor--medium"
                         style="width: 90%;">
                        <input :placeholder="$t('table.tbViFiDevice.gte_todayUUWiFiData')" class="el-range-input"
                               v-model="listQuery.gte_todayUUWiFiData">
                        <span class="el-range-separator">~</span>
                        <input :placeholder="$t('table.tbViFiDevice.lte_todayUUWiFiData')" class="el-range-input"
                               v-model="listQuery.lte_todayUUWiFiData">
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="el-date-editor el-range-editor el-input__inner el-range-editor--medium"
                         style="width: 90%;">
                        <input :placeholder="$t('table.tbViFiDevice.gte_monthUUWiFiData')" class="el-range-input"
                               v-model="listQuery.gte_monthUUWiFiData">
                        <span class="el-range-separator">~</span>
                        <input :placeholder="$t('table.tbViFiDevice.lte_monthUUWiFiData')" class="el-range-input"
                               v-model="listQuery.lte_monthUUWiFiData">
                    </div>
                </el-col>

                <operationsTemplate
                        :operations="operations"
                        :download-loading="downloadLoading"
                        :delete-disable="deleteDisable"
                        :edit-disable="editDisable"
                        @handleRefresh="handleRefresh"
                        @handleCreate="handleCreate"
                        @handleDownload="handleDownload"
                        @handleUpdate="handleUpdate"
                        @handleDelete="handleDelete"
                ></operationsTemplate>

            </sticky>
        </div>
        <div>

            <simpleTableTemplate
                    :list-loading="listLoading"
                    :table-key="tableKey"
                    :expand="expand"
                    :check="check"
                    :prefix="prefix"
                    :table-list="tableList"
                    :computed-lists="computedLists"
                    @tableRowClassName="tableRowClassName"
                    @renderSort="renderSort"
                    @selectionAll="selectionAll"
                    @selectionChange="selectionChange"
                    @clickRow="clickRow"
            ></simpleTableTemplate>

            <div class="pagination-container">
                <el-pagination :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                               :total="total" background layout="total, sizes, prev, pager, next, jumper"
                               @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
            </div>
        </div>


        <el-dialog :title="$t(textMap[dialogStatus])" :visible.sync="dialogFormVisible">
            <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px"
                     style="width: 400px; margin-left:50px;">

                <el-form-item :label="$t('table.tbViFiDevice.keyDevID')" prop="keyDevID">
                    <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" clearable v-model="temp.keyDevID"/>
                </el-form-item>

                <el-form-item>
                    <div class="el-form-item__error" style="display: inline;position: inherit" v-text="keyCount">
                    </div>
                    <input type="file" id="keyDevID-fileElem" multiple="multiple" accept="text/plain"
                           style="display:none" @change="handleFiles()">
                    <label style="cursor:pointer;float:right;" for="keyDevID-fileElem" class="btn-sm">批量导入ID&nbsp;&nbsp;<i
                            class="el-icon-document"></i></label>
                </el-form-item>


                <el-form-item :label="$t('table.tbViFiDevice.alaisName')" prop="alaisName">
                    <el-input clearable v-model="temp.alaisName"/>
                </el-form-item>

                <el-form-item :label="$t('table.tbViFiDevice.devState')" prop="devState">
                    <el-select v-model="temp.devState" class="filter-item" clearable>
                        <el-option v-for="item in devStateOptions" :key="item.key" :label="item.name"
                                   :value="item.key"/>
                    </el-select>
                </el-form-item>

                <el-form-item :label="$t('table.tbViFiDevice.idxDevGrpID')" prop="idxDevGrpID">
                    <el-select v-model="temp.idxDevGrpID" class="filter-item" placeholder="Please select" filterable remote
                               @focus="switchIdxDevGrpID" :remote-method="remoteIdxDevGrpIDMethod" :loading="selectLoading"
                               clearable>
                        <el-option v-for="item in idxDevGrpIDOptions" :key="item.value" :label="item.label"
                                   :value="item.value"/>
                    </el-select>
                </el-form-item>

                <el-form-item :label="$t('table.tbViFiDevice.idxUserID')" prop="idxUserID">
                    <el-select v-model="temp.idxUserID" class="filter-item" placeholder="Please select" filterable remote
                               @focus="switchIdxUserID" :remote-method="remoteIdxUserIDMethod" :loading="selectLoading"
                               clearable>
                        <el-option v-for="item in idxUserIDOptions" :key="item.value" :label="item.label"
                                   :value="item.value"/>
                    </el-select>
                </el-form-item>

                <el-form-item :label="$t('table.tbViFiDevice.idxAgentID')" prop="idxAgentID">
                    <el-select v-model="temp.idxAgentID" class="filter-item" placeholder="Please select" filterable remote
                               @focus="switchIdxAgentID" :remote-method="remoteIdxAgentIDMethod" :loading="selectLoading"
                               clearable>
                        <el-option v-for="item in idxAgentIDOptions" :key="item.value" :label="item.label"
                                   :value="item.value"/>
                    </el-select>
                </el-form-item>

                <el-form-item :label="$t('table.tbViFiDevice.debugIdt')" prop="debugIdt">
                    <el-select v-model="temp.debugIdt" class="filter-item" clearable>
                        <el-option v-for="item in debugIdtOptions" :key="item.key" :label="item.name"
                                   :value="item.key"/>
                    </el-select>
                </el-form-item>

                <el-form-item :label="$t('table.tbViFiDevice.rateLimit')" prop="rateLimit">
                    <el-input clearable v-model="temp.rateLimit"/>
                </el-form-item>


                <el-form-item :label="$t('table.tbViFiDevice.cos')" prop="cos">
                    <el-select v-model="temp.cos" class="filter-item" clearable multiple>
                        <el-option v-for="item in cosOptions" :key="item.key" :label="item.name"
                                   :value="item.key"/>
                    </el-select>
                </el-form-item>

                <el-form-item :label="$t('table.tbViFiDevice.bootFirstISP')" prop="bootFirstISP">
                    <el-select v-model="temp.bootFirstISP" class="filter-item" clearable>
                        <el-option v-for="item in bootFirstISPOptions" :key="item.key" :label="item.name"
                                   :value="item.key"/>
                    </el-select>
                </el-form-item>

                <el-form-item :label="$t('table.tbViFiDevice.remarks')" prop="remarks">
                    <el-input clearable v-model="temp.remarks"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{ $t('table.confirm') }}
                </el-button>
                <el-button v-else type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import simpleTableTemplate from '@/views/table/customTable/simpleTableTemplate'
    import operationsTemplate from '@/views/table/customTable/operationsTemplate'
    import Sticky from '@/components/Sticky'

    //import具体方法时，必须{}包裹
    import {fetch, create, update, remove,check} from '@/api/vifi'
    import {vifiS2, vifiDevGrpS2, userS2,agentS2,softwareVerS2} from '@/api/select'
    import {parseTime} from '@/utils'
    import {iccidFM, trafficFormat, toDecimals} from '@/filters/index'
    import {_getValidateRules} from '@/utils/rules'
    import {
        tableSortDown, tableSortUp, handleDelete, handleDownload, updateData, renderHeadSort, createData,handleCreate,countIds,
        handleUpdate, getList, selectionChange, selectionAll, areaFM, formatArea, debounce,computedFmt,remoteQuery,remoteInitQuery
    } from '@/utils/tableCustom'

    const devStateOptions = [
        {key: 'N', name: '初始'},
        {key: 'E', name: '正常'},
        {key: 'W', name: '异常'},
        {key: 'D', name: '禁用'},
        {key: 'F', name: '暂时禁用'},
        {key: 'R', name: '删除'},
        {key: 'G', name: '删除'},
    ]
    const onlineOptions = [
        {key: 0, name: '离线',style:'default'},
        {key: 1, name: '在线',style:'primary'},
        {key: 3, name: '已拿卡',style:'success'},
        {key: 4, name: '失败',style:'danger'},
        {key: 5, name: '拨号中',style:'warning'},
        {key: 6, name: '下线',style:'default'},
        {key: 11, name: '本地在线',style:'success'},
        {key: 15, name: '初始',style:'default'},
        {key: 16, name: '异常',style:'default'},
        {key: 17, name: '禁用',style:'danger'},
        {key: 18, name: '删除',style:'default'},
        {key: 19, name: '暂时禁用',style:'default'},
    ]

    const debugIdtOptions = [
        {key: 0, name: '初始'},
        {key: 1, name: '正常'},
        {key: 2, name: '异常'},
        {key: 3, name: '禁用'},
        {key: 4, name: '暂时禁用'},
        {key: 5, name: '删除'},
        {key: 6, name: '删除'},
    ]

    const bootFirstISPOptions = [
        {key: 0, name: '自动'},
        {key: 46000, name: '移动优先'},
        {key: 46001, name: '联通优先'},
        {key: 46002, name: '电信优先'},
    ]

    const cosOptions = [
        {key: 'T', name: '测试服务'},
        {key: 'L', name: '定位服务'},
        {key: 'S', name: '上报服务'},
    ]

    const devStateKeyValue = devStateOptions.reduce((acc, cur) => {
        acc[cur.key] = cur.name
        return acc
    }, {})
    const onlineKeyValue = onlineOptions.reduce((acc, cur) => {
        acc[cur.key] = cur.name
        return acc
    }, {})
    const onlineKeyStyle = onlineOptions.reduce((acc, cur) => {
        acc[cur.key] = cur.style
        return acc
    }, {})
    const debugIdtKeyValue = debugIdtOptions.reduce((acc, cur) => {
        acc[cur.key] = cur.name
        return acc
    }, {})
    const bootFirstISPKeyValue = bootFirstISPOptions.reduce((acc, cur) => {
        acc[cur.key] = cur.name
        return acc
    }, {})


    export default {
        name: 'vifiDevTable',
        components: {Sticky,simpleTableTemplate,operationsTemplate},
        data() {
            return {
                prefix:'table.tbViFiDevice.',
                tableKey: 'keyDevID',
                tableList: [
                    {name: 'keyDevID', width: {length: 180}, type: 'text', show: true,vali:{required:true,zh:false,repeatCheck:true,valid:function (rule, value, callback) {
                    try {
                        if(value){
                            check({idList:value}).then(response => {
                                let data = response.data.data;
                                if(data && data.length>0){
                                    return callback(new Error('存在非法id：'+JSON.stringify(data)))
                                }else{
                                    return callback()
                                }
                            })
                        }else {
                            return callback()
                        }
                    }catch(e) {
                        return callback(new Error("check fail"))
                    }
                    }}},
                    {name: 'alaisName',show:true,width: {length: 180},type:'text',vali:{strLen:[0,45]}},
                    {name: 'devState',format:{comData:devStateKeyValue},expand:true,vali:{required:true}},
                    {name: 'idxDevGrpID', expand: true,vali:{required:true,strLen:[0,45]}},
                    {name: 'groupName', width: {length: 160}, type: 'text', show: true},
                    {name: 'online', width: {length: 100}, type: 'tag',tagData:onlineKeyStyle, sort:true,show: true,format:{comData:onlineKeyValue}, vali: {integer: true, LessThan: 10000}},
                    {name: 'idxUserID', expand: true,vali: {strLen:[0,45]}},
                    {name: 'idxAgentID', expand: true, vali: {required: true}},
                    {name: 'idx3rdUserId', expand: true},
                    {name: 'idx3rdUserName', expand: true},
                    {name: 'iccidGlobal', expand: true},
                    {name: 'iccidLocal',format:{iccidFM:true},expand:true},
                    {name: 'imeiGlobal',expand:true},
                    {name: 'lastUUWiFiAreaId', format:{areaFM:true},width: {length: 200}, type: 'html',sort:true, show: true,vali: {strLen:[0,64]}},
                    {name: 'idxIccid',width: {length: 200},type:'html',format:{iccidFM:true},show:true},
                    {name: 'todayUUWiFiData',width: {length: 200},format:{trafficFM:true},type:'text',sort:true,show:true},
                    {name: 'monthUUWiFiData',width: {length: 200},format:{trafficFM:true},type:'text',sort:true,show:true},
                    {name: 'softwareVer',expand:true},
                    {name: 'debugIdt',format:{comData:debugIdtKeyValue},expand:true,vali:{required:true}},
                    {name: 'lastConnectIP',expand:true},
                    {name: 'lastConnectTime', width: {length: 190}, type: 'date',sort:true, show: true},
                    {name: 'rateLimit', width: {length: 180}, type: 'text',sort:true, show: true,format:{limitFM:true},vali: { integer: true, lessThan: 10000000,moreThan:0}},
                    {name: 'cos',format:{fmt:function (value) {
                        let result=""
                        if(value){
                            if(value.indexOf('T')){
                                result+="测试服务 "
                            }
                            if(value.indexOf('L')){
                                result+="定位服务 "
                            }
                            if(value.indexOf('S')){
                                result+="上报服务"
                            }
                        }
                        return result
                    }}, expand: true},
                    {name: 'bootFirstISP',format:{comData:bootFirstISPKeyValue},width: {length: 180},show:true},
                    {name: 'remarks',expand:true,vali:{strLen:[0,256]}},
                    {name: 'mdfTm', width: {length: 180}, type: 'date', show: true},
                    {name: 'mdfBy',expand:true},
                    {name: 'crtTm',expand:true},
                    {name: 'crtBy',expand:true}
                ],
                check: true,
                expand: true,
                operations: ['add','edit','remove','download'],

                list: [],
                total: null,
                listLoading: true,
                listQuery: {
                    page: 1,
                    offset: 0,
                    limit: 20,
                    orderList: [],
                    keyDevID: undefined,
                    alaisName: undefined,
                    idxDevGrpID: undefined,
                    idxUserID: undefined,
                    in_online: [],
                    iccidGlobal: undefined,
                    idxIccid: undefined,
                    idxAgentID:undefined,
                    lastConnectTime:[],
                    softwareVer:undefined,
                    in_bootFirstISP:[],
                    remark:undefined,
                    gte_todayUUWiFiData:undefined,
                    lte_todayUUWiFiData:undefined,
                    gte_monthUUWiFiData:undefined,
                    lte_monthUUWiFiData:undefined
                },
                bootFirstISPOptions:bootFirstISPOptions,
                debugIdtOptions:debugIdtOptions,
                onlineOptions:onlineOptions,
                devStateOptions:devStateOptions,
                cosOptions:cosOptions,
                keyDevIDOptions: [],
                keyDevIDInitOptions: [],
                idxDevGrpIDOptions:[],
                idxDevGrpIDInitOptions:[],
                idxUserIDOptions:[],
                idxUserIDInitOptions:[],
                idxAgentIDOptions:[],
                idxAgentIDInitOptions:[],
                softwareVerOptions:[],
                softwareVerInitOptions:[],
                editDisable: false,
                deleteDisable: true,
                checkedRows: [],
                temp: {
                    keyDevID: '',
                    alaisName: undefined,
                    devState: undefined,
                    idxDevGrpID: undefined,
                    idxUserID: undefined,
                    idxAgentID: undefined,
                    debugIdt: undefined,
                    rateLimit: undefined,
                    cos:[],
                    bootFirstISP: undefined,
                    remarks: undefined
                },
                dialogFormVisible: false,
                dialogStatus: '',
                textMap: {
                    update: 'edit',
//                    create: 'create',
                    batchUpdate: 'batchEdit'
                },
                rules: {},
                singleRules: {
                },
                batchRules: {},
                downloadLoading: false,
                selectLoading: false,
                lastDebounce: undefined,
                lastModifyTm: undefined,
                keyCount:''
            }
        },
        created() {
            this.getList()
            this.lastModifyTm = (new Date()).getTime()
            this.singleRules=_getValidateRules(this.tableList);
            this.batchRules=_getValidateRules(this.tableList,true)
        },
        computed: {
            computedLists: function () {
                return computedFmt.call(this,this.list,this.tableList)
            }
        },
        mounted(){
            remoteInitQuery.call(this, vifiS2, "keyDevID")
            remoteInitQuery.call(this, vifiDevGrpS2, "idxDevGrpID")
            remoteInitQuery.call(this, userS2, "idxUserID")
            remoteInitQuery.call(this, agentS2, "idxAgentID")
            remoteInitQuery.call(this, softwareVerS2, "softwareVer")
        },
        watch: {
            listQuery: {
                handler(curVal, oldVal){
                    debounce.call(this, 2000, function () {
                        this.getList()
                    })
                },
                deep: true
            },
            checkedRows: {
                handler(curVal, oldVal){
                    if(curVal.length>0){
                        this.deleteDisable = false
                    }else {
                        this.deleteDisable = true
                    }
                },
            },
            'temp.keyDevID': {
                handler(curVal, oldVal){
                   //计数
                    if(curVal){
                        let count=countIds(curVal)
                        if(count){
                            this.keyCount='共'+count+'项'
                        }else {
                            this.keyCount=''
                        }
                    }
                },
            },
        },
        methods: {
            getList() {
                getList.call(this, fetch)
            },
            handleSizeChange(val) {
                this.listQuery.limit = val
                this.listQuery.offset = (this.listQuery.page - 1) * this.listQuery.limit
                this.getList()
            },
            handleCurrentChange(val) {
                this.listQuery.page = val
                this.listQuery.offset = (this.listQuery.page - 1) * this.listQuery.limit
                this.getList()
            },
            resetTemp() {
                this.temp = {
                    keyDevID: '',
                    alaisName: undefined,
                    devState: undefined,
                    idxDevGrpID: undefined,
                    idxUserID: undefined,
                    idxAgentID: undefined,
                    debugIdt: undefined,
                    rateLimit: undefined,
                    cos:[],
                    bootFirstISP: undefined,
                    remarks: undefined,
                }
                this.keyCount=''
            },
            handleCreate() {
                handleCreate.call(this)
            },
            createData() {
                createData.call(this,create)
            },
            handleUpdate() {
                if (this.checkedRows.length > 1 || this.checkedRows.length==0) {
                    //批量编辑：重置所有选项
                    this.dialogStatus = 'batchUpdate'
                    this.rules = this.batchRules
                    this.resetTemp()
                    this.temp.keyDevID=this.checkedRows.map(function (value) {
                        return value.keyDevID
                    }).join(",")
//                    this.temp.keyDevID=
                } else {
                    //单项编辑
                    //不应该简单替换为全部数据，而应只保留表单上的数据
                    var temps = Object.assign({}, this.checkedRows[0])
                    for(let key in this.temp){
                        this.temp[key]=temps[key]
                    }
                    this.dialogStatus = 'update'
                    this.rules = this.singleRules
                }

                this.dialogFormVisible = true
                this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate()
                })
            },
            handleRefresh() {
                //js赋值无法触发事件:1.手动触发2.watch监听
                this.listQuery = {
                    page: 1,
                    offset: 0,
                    limit: 20,
                    orderList: [],
                    keyDevID: undefined,
                    alaisName: undefined,
                    idxDevGrpID: undefined,
                    idxUserID: undefined,
                    in_online: [],
                    iccidGlobal: undefined,
                    idxIccid: undefined,
                    idxAgentID:undefined,
                    lastConnectTime:[],
                    softwareVer:undefined,
                    in_bootFirstISP:[],
                    remark:undefined,
                    gte_todayUUWiFiData:undefined,
                    lte_todayUUWiFiData:undefined,
                    gte_monthUUWiFiData:undefined,
                    lte_monthUUWiFiData:undefined
                }
            },
            updateData() {
                updateData.call(this, update)
            },
            renderSort(h, {column, $index}, index, name) {
                return renderHeadSort.call(this, h, {column, $index}, index, name)
            },
            handleDelete() {
                handleDelete.call(this, remove)
            },
            handleDownload() {
                const tHeader = ['keySimCardID', 'idxSCGroupID', 'simPDevID', 'areaCode', 'status', 'statusNew']
                handleDownload.call(this, tHeader, fetch)
            },
            remoteKeyDevIDMethod(query) {
                remoteQuery.call(this,vifiS2,query,"keyDevID")
            },
            remoteIdxDevGrpIDMethod(query) {
                remoteQuery.call(this,vifiDevGrpS2,query,"idxDevGrpID")
            },
            remoteIdxUserIDMethod(query){
                remoteQuery.call(this,userS2,query,"idxUserID")
            },
            remoteIdxAgentIDMethod(query) {
                remoteQuery.call(this,agentS2, query, "idxAgentID")
            },
            remoteSoftwareVerMethod(query) {
                remoteQuery.call(this, softwareVerS2,query, "softwareVer")
            },
            switchKeyDevID(){
                this.keyDevIDOptions = this.keyDevIDInitOptions
            },
            switchIdxDevGrpID(){
                this.idxDevGrpIDOptions = this.idxDevGrpIDInitOptions
            },
            switchIdxUserID(){
                this.idxUserIDOptions = this.idxUserIDInitOptions
            },
            switchIdxAgentID(){
                this.idxAgentIDOptions = this.idxAgentIDInitOptions
            },
            switchSoftwareVer(){
                this.softwareVerOptions = this.softwareVerInitOptions
            },
            selectionChange(val, row){
                this.checkedRows = val;
            },
            selectionAll(val, row){
                this.checkedRows = val;
            },
            tableRowClassName({row, rowIndex}) {
                    return '';
            },
            clickRow(row){
                let checklist=this.checkedRows
                for(let i=checklist.length-1;i>=0;i--){
                    if(checklist[i].keyDevID==row.keyDevID){
                        return;
                    }
                }
                this.checkedRows.push(row)
            },
            handleFiles() {
                let input = document.getElementById("keyDevID-fileElem"), files = input.files, _this = this
                if (files.length) {
                    var reader = new FileReader();  // readAsText,readAsBinaryString
                    reader.onload = function () {
                        let txt = this.result.trim(), lines = txt.split("\n"), result = ""
                        //方案2：
                        if (lines.length > 0) {
                            for (var j = 0, len = lines.length; j < len; j++) {
                                result += "," + lines[j].trim();
                            }
                            _this.temp.keyDevID = (_this.temp.keyDevID ? _this.temp.keyDevID : "") + result
                        }
                        //重置change事件
                        input.value = '';
                    };
                    reader.readAsText(files[0], "utf-8");
                }
            }
        }
    }
</script>
<style>
    .demo-table-expand label{
        width: 120px;
    }

</style>
