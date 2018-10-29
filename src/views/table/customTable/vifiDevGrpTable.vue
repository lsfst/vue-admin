<template>
    <div class="app-container">

        <div class="filter-container">
            <sticky class-name="sub-navbar">
                <el-col :span="6">
                    <el-select v-model="listQuery.keyDevGrpID" class="filter-item"
                               :placeholder="$t('table.tbViFiDevGroup.keyDevGrpID')" filterable remote
                               style="width:90%" clearable
                               @focus="switchKeyDevGrpID" :remote-method="remoteKeyDevGrpIDMethod"
                               :loading="selectLoading"
                               clearable>
                        <el-option v-for="item in keyDevGrpIDOptions" :key="item.value" :label="item.label"
                                   :value="item.value"/>
                    </el-select>
                </el-col>

                <operationsTemplate
                        :operations="operations"
                        :download-loading="downloadLoading"
                        :delete-disable="deleteDisable"
                        :edit-disable="editDisable"
                        @handleRefresh="handleRefresh"
                        @handleDownload="handleDownload"
                        @handleUpdate="handleUpdate"
                        @handleDelete="handleDelete"
                        @handleCreate="handleCreate"
                ></operationsTemplate>

            </sticky>
        </div>

        <!--@sort-change="handleFilter"-->
        <!--:default-sort = "{prop: 'idxAgentId', order: 'descending'}"-->
        <!--element table 自带的表头排序可以在本地进行，若要触发后台访问接口，可以使用@sort-change监听-->
        <!--@select 监听checkbox选中  @select-all 监听全选-->
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
            <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="150px"
                     style="margin-right: 50px; margin-left:50px;">

                <el-col :span="4" class="text-center">
                    <button class="pan-btn blue-btn">Documentation</button>
                </el-col>

                <el-form-item v-if="dialogStatus=='create'" :label="$t('table.tbViFiDevGroup.keyDevGrpID')" prop="keyDevGrpID">
                    <el-input clearable v-model="temp.keyDevGrpID" name="keyDevGrpID"/>
                </el-form-item>

                <el-form-item v-if="dialogStatus!='batchUpdate'" :label="$t('table.tbViFiDevGroup.name')" prop="name">
                    <el-input clearable v-model="temp.name" name="name"/>
                </el-form-item>

                <el-form-item v-if="dialogStatus!='batchUpdate'" :label="$t('table.tbViFiDevGroup.termAuthType')" prop="termAuthType">
                    <el-select v-model="temp.termAuthType" class="filter-item" clearable name="termAuthType">
                        <el-option v-for="item in termAuthTypeOptions" :key="item.key" :label="item.name"
                                   :value="item.key"/>
                    </el-select>
                </el-form-item>

                <el-form-item :label="$t('table.tbViFiDevGroup.status')" prop="status">
                    <el-select v-model="temp.status" class="filter-item" clearable>
                        <el-option v-for="item in statusOptions" :key="item.key" :label="item.name"
                                   :value="item.key"/>
                    </el-select>
                </el-form-item>

                <el-form-item :label="$t('table.tbViFiDevGroup.devExpire')" prop="devExpire">
                    <el-input clearable v-model="temp.devExpire" type="number"/>
                </el-form-item>
                <el-form-item :label="$t('table.tbViFiDevGroup.rateLimit')" prop="rateLimit">
                    <el-input clearable v-model="temp.rateLimit"/>
                </el-form-item>
                <el-form-item :label="$t('table.tbViFiDevGroup.dayLimitVal')" prop="dayLimitVal">
                    <el-input clearable v-model="temp.dayLimitVal"/>
                </el-form-item>
                <el-form-item :label="$t('table.tbViFiDevGroup.dayLimitRate')" prop="dayLimitRate">
                    <el-input clearable v-model="temp.dayLimitRate"/>
                </el-form-item>
                <el-form-item :label="$t('table.tbViFiDevGroup.monLimitVal')" prop="monLimitVal">
                    <el-input clearable v-model="temp.monLimitVal" />
                </el-form-item>
                <el-form-item :label="$t('table.tbViFiDevGroup.monLimitRate')" prop="monLimitRate">
                    <el-input clearable v-model="temp.monLimitRate"/>
                </el-form-item>
                <el-form-item :label="$t('table.tbViFiDevGroup.dataType')" prop="dataType">
                    <el-select v-model="temp.dataType" class="filter-item" filterable
                               clearable>
                        <el-option v-for="item in dataTypeOptions" :key="item.key" :label="item.name"
                                   :value="item.key"/>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="dialogStatus!='batchUpdate'" :label="$t('table.tbViFiDevGroup.enableThirdCard')" prop="enableThirdCard">
                    <el-select v-model="temp.enableThirdCard" class="filter-item" filterable
                               clearable>
                        <el-option v-for="item in enableThirdCardOptions" :key="item.key" :label="item.name"
                                   :value="item.key"/>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="dialogStatus!='batchUpdate'" :label="$t('table.tbViFiDevGroup.remark')" prop="remark">
                    <el-input clearable v-model="temp.remark"/>
                </el-form-item>

                <div class="form_line"><span>——————————— 设备默认配置 ————————————</span></div>

                <el-form-item :label="$t('table.tbViFiDevGroup.idleAction')" prop="idleAction">
                    <el-select v-model="temp.idleAction" class="filter-item" filterable
                               clearable>
                        <el-option v-for="item in idleActionOptions" :key="item.key" :label="item.name"
                                   :value="item.key"/>
                    </el-select>
                </el-form-item>

                <el-form-item :label="$t('table.tbViFiDevGroup.idleTimes')" prop="idleTimes">
                    <el-input clearable v-model="temp.idleTimes"  :disabled="idleTimesDisabled"/>
                </el-form-item>

                <el-form-item :label="$t('table.tbViFiDevGroup.bwmode')" prop="bwmode">
                    <el-select v-model="temp.bwmode" class="filter-item" filterable
                               clearable>
                        <el-option v-for="item in bwmodeOptions" :key="item.key" :label="item.name"
                                   :value="item.key"/>
                    </el-select>
                </el-form-item>

                <el-form-item :label="$t('table.tbViFiDevGroup.ipwlist')" prop="ipwlist">
                    <el-input clearable v-model="temp.ipwlist" :disabled="ipwlistDisabled"/>
                </el-form-item>

                <el-form-item :label="$t('table.tbViFiDevGroup.wifi_auto_ctrl')"  prop="wifi_auto_ctrl">
                    <el-select v-model="temp.wifi_auto_ctrl" class="filter-item" filterable
                               clearable>
                        <el-option v-for="item in wifiAutoCtrlOptions" :key="item.key" :label="item.name"
                                   :value="item.key"/>
                    </el-select>
                </el-form-item>

                <el-form-item :label="$t('table.tbViFiDevGroup.clientsEnable')" prop="clientsEnable">
                    <el-select v-model="temp.clientsEnable" class="filter-item" filterable
                               clearable>
                        <el-option v-for="item in clientsEnableOptions" :key="item.key" :label="item.name"
                                   :value="item.key"/>
                    </el-select>
                </el-form-item>

                <el-form-item :label="$t('table.tbViFiDevGroup.protalAutoAddWhite')" prop="protalAutoAddWhite">
                    <el-input clearable v-model="temp.protalAutoAddWhite"/>
                </el-form-item>

                <div class="form_line"><span>——————————— 本地卡切换 ————————————</span></div>

                <el-form-item :label="$t('table.tbViFiDevGroup.localSwitchFailCnt')" prop="localSwitchFailCnt">
                    <el-input clearable v-model="temp.localSwitchFailCnt"  type="number" :disabled="localSwitchFailCntDisabled" />
                </el-form-item>
                <el-form-item :label="$t('table.tbViFiDevGroup.localSwitchOutTime')" prop="localSwitchOutTime">
                    <el-input clearable v-model="temp.localSwitchOutTime" type="number" :disabled="localSwitchOutTimeDisabled"/>
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
    import {fetch, create, update, remove} from '@/api/vifiDevGrp'
    import {vifiDevGrpS2} from '@/api/select'
    import {parseTime} from '@/utils'
    import {limitFormat} from '@/filters/index'
    import {_getValidateRules} from '@/utils/rules'
    import {
        handleCreate, handleDelete, handleDownload, updateData, renderHeadSort, createData,
        handleUpdate, getList, debounce
    } from '@/utils/tableCustom'

    const statusOptions = [
        {key: 'N', name: '初始'},
        {key: 'E', name: '正常'},
        {key: 'W', name: '异常'},
        {key: 'D', name: '禁用'},
        {key: 'F', name: '暂时禁用'},
        {key: 'R', name: '删除'},
    ]
    const dataTypeOptions = [
        {key: 'A', name: '远程卡优先'},
        {key: 'R', name: '远程卡'},
        {key: 'L', name: '本地卡'},
        {key: 'F', name: '本地卡优先'},
    ]

    const termAuthTypeOptions = [
        {key: 'F', name: 'WiFi认证'},
        {key: 'P', name: 'Portal认证'},
        {key: 'O', name: '公共WiFi'},
    ]

    const enableThirdCardOptions = [
        {key: 0, name: '不启用'},
        {key: 1, name: '启用'},
    ]

    const idleActionOptions = [
        {key: -1, name: '默认'},
        {key: 0, name: '不处理'},
        {key: 1, name: '关机'},
        {key: 2, name: '休眠'},
    ]

    const bwmodeOptions = [
        {key: 1, name: '白名单模式'},
        {key: 2, name: '黑名单模式'},
    ]

    const wifiAutoCtrlOptions = [
        {key: 0, name: '不启用'},
        {key: 1, name: '启用'},
    ]

    const clientsEnableOptions = [
        {key: 0, name: '不上报'},
        {key: 1, name: '上报'},
    ]


    const statusKeyValue = statusOptions.reduce((acc, cur) => {
        acc[cur.key] = cur.name
        return acc
    }, {})

    const termAuthTypeKeyValue = termAuthTypeOptions.reduce((acc, cur) => {
        acc[cur.key] = cur.name
        return acc
    }, {})

    const dataTypeKeyValue = dataTypeOptions.reduce((acc, cur) => {
        acc[cur.key] = cur.name
        return acc
    }, {})
    const enableThirdCardKeyValue = enableThirdCardOptions.reduce((acc, cur) => {
        acc[cur.key] = cur.name
        return acc
    }, {})
    const idleActionKeyValue = idleActionOptions.reduce((acc, cur) => {
        acc[cur.key] = cur.name
        return acc
    }, {})

    const bwmodeKeyValue = bwmodeOptions.reduce((acc, cur) => {
        acc[cur.key] = cur.name
        return acc
    }, {})

    const wifiAutoCtrlKeyValue = wifiAutoCtrlOptions.reduce((acc, cur) => {
        acc[cur.key] = cur.name
        return acc
    }, {})
    const clientsEnableKeyValue = clientsEnableOptions.reduce((acc, cur) => {
        acc[cur.key] = cur.name
        return acc
    }, {})

    export default {
        name: 'vifiDevGroup',
        components: {Sticky,simpleTableTemplate,operationsTemplate},
        data() {
            return {
                prefix:'table.tbViFiDevGroup.',
                tableKey: 'keyDevGrpID',
                tableList: [
                    {name: 'keyDevGrpID', width: {length: 100},vali:{required:true,strLen:[0,64],zh:false}},
                    {name: 'name',width: {length: 160},vali:{required:true,strLen:[0,64]}},
                    {name: 'devStatusInGroup',width: {length: 160,min:true},type: 'tip'},
                    {name: 'termAuthType', width: {length: 120},vali:{required:true}},
                    {name: 'status', hide:true},
                    {name: 'devExpire', width: {length: 120},vali:{moreThan:180}},
                    {name: 'rateLimit', width: {length: 120},vali:{moreThan:10}},
                    {name: 'dayLimitVal',width: {length: 120},vali:{lessThan:2000,decimals:3}},
                    {name: 'dayLimitRate', width: {length: 140},vali:{moreThan:10}},
                    {name: 'monLimitVal', width: {length: 120},vali:{lessThan:2000,decimals:3}},
                    {name: 'monLimitRate', width: {length: 140},vali:{moreThan:10}},
                    {name: 'dataType', width: {length: 100}},
                    {name: 'enableThirdCard',expand:true},
                    {name: 'remark',expand:true},
                    {name: 'devConfigs',hide:true},
                    {name: 'idleAction',expand:true,vali:{required:true}},
                    {name: 'idleTimes',expand:true},
                    {name: 'bwmode', expand: true},
                    {name: 'ipwlist',expand: true,vali:{ip:true}},
                    {name: 'wifi_auto_ctrl', expand: true},
                    {name: 'clientsEnable',expand:true},
                    {name: 'protalAutoAddWhite',expand:true,vali:{integer:true,moreThan:-1}},
                    {name: 'localSimSwitch', hide: true},
                    {name: 'localSwitchFailCnt',expand:true,vali:{integer:true,moreThan:0}},
                    {name: 'localSwitchOutTime',expand:true,vali:{integer:true,moreThan:120}},
                    {name: 'getSimLocationDegree', width: {length: 125}},
                    {name: 'mdfTm', width: {length: 180}, type: 'date', show: true},
                    {name: 'mdfBy',expand:true},
                    {name: 'crtTm',expand:true},
                    {name: 'crtBy',expand:true},
                ],
                check: true,
                expand: true,
                operations: ['add','edit','remove'],
                list: [],
                total: null,
                listLoading: true,
                listQuery: {
                    page: 1,
                    offset: 0,
                    limit: 20,
                    orderList: [],
                    keyDevGrpID:undefined
                },
                statusOptions: statusOptions,
                dataTypeOptions: dataTypeOptions,
                termAuthTypeOptions: termAuthTypeOptions,
                enableThirdCardOptions: enableThirdCardOptions,
                idleActionOptions: idleActionOptions,
                bwmodeOptions: bwmodeOptions,
                wifiAutoCtrlOptions: wifiAutoCtrlOptions,
                clientsEnableOptions: clientsEnableOptions,
                keyDevGrpIDOptions: [],
                keyDevGrpIDInitOptions: [],
                keyDevGrpIDQuery: {
                    query: '',
                    ownerId: 'eu.'
                },
                editDisable: true,
                deleteDisable: true,
                checkedRows: [],
                temp: {
                    keyDevGrpID: undefined,
                    name: undefined,
                    termAuthType: undefined,
                    status: undefined,
                    devExpire: undefined,
                    rateLimit: undefined,
                    dayLimitVal: undefined,
                    dayLimitRate: undefined,
                    monLimitVal: undefined,
                    monLimitRate: undefined,
                    dataType: undefined,
                    enableThirdCard: undefined,
                    remark: '',
                    devConfigs:undefined,
                    idleAction: undefined,
                    idleTimes: undefined,
                    bwmode: undefined,
                    ipwlist: undefined,
                    wifi_auto_ctrl: undefined,
                    clientsEnable: undefined,
                    protalAutoAddWhite: undefined,
                    localSwitchFailCnt: undefined,
                    localSwitchOutTime: undefined,
                },
                localSwitchFailCntDisabled:false,
                localSwitchOutTimeDisabled:false,
                idleTimesDisabled:false,
                ipwlistDisabled:false,
                dialogFormVisible: false,
                dialogStatus: '',
                textMap: {
                    update: 'edit',
                    create: 'create',
                    batchUpdate: 'batchEdit'
                },
                rules: {},
                singleRules: {},
                batchRules: {},
                downloadLoading: false,
                selectLoading: false,
                lastDebounce: undefined,
                lastModifyTm: undefined
            }
        },
        created() {
            //生命周期执行顺序：data->created->computed(list初始换状态)->mounted->computed(此时getList执行完毕修改list)
            this.getList()

            this.lastModifyTm = (new Date()).getTime()
            this.singleRules=_getValidateRules(this.tableList);
            //对于this实例的调用，方法中的this指向不可改变，可以在执行函数外面定义变量，比如用_this指向this，或者bind(this)
            let _this=this
            this.singleRules.idleTimes=[
                {validator:function (rule, value, callback) {
                    let idleAction = _this.temp.idleAction;
                    let idleTimes = _this.temp.idleTimes;
                    var flag = true;
                    switch (parseInt(idleAction)) {
                        case -1:
                            if (idleTimes != -1) {
                                flag = false;
                            }
                            break;
                        case 0:
                            break;
                        case 1:
                        case 2:
                            if (idleTimes < 60) {
                                flag = false;
                            }
                    }
                    if(flag){
                        callback()
                    }else {
                        callback(new Error('关机或休眠时空闲时长不能低于60s'))
                    }
                },trigger:'blur'}
            ]
            this.batchRules=_getValidateRules(this.tableList,true)
            this.batchRules.idleTimes=[
                {validator:function (rule, value, callback) {
                    let idleAction = _this.temp.idleAction;
                    let idleTimes = _this.temp.idleTimes;
                    var flag = true;
                    switch (parseInt(idleAction)) {
                        case -1:
                            if (idleTimes != -1) {
                                flag = false;
                            }
                            break;
                        case 0:
                            break;
                        case 1:
                        case 2:
                            if (idleTimes < 60) {
                                flag = false;
                            }
                    }
                    if(flag){
                        callback()
                    }else {
                        callback(new Error('关机或休眠时空闲时长不能低于60s'))
                    }
                },trigger:'blur'}
            ]
        },
        computed: {
            computedLists: function () {
                let computedList = this.list;
                let obj;
                for (let i = 0; i < computedList.length; i++) {
                    let tags = {};
                    let tips={};
                    obj = JSON.parse(JSON.stringify(computedList[i]))
                    let tip=this.devStatusOfGroup(obj.devStatusInGroup)
                    obj.devStatusInGroup = tip.dom;
                    tips.devStatusInGroup=tip.title
                    obj.termAuthType = termAuthTypeKeyValue[obj.termAuthType]
                    obj.dayLimitVal = limitFormat(obj.dayLimitVal);
                    obj.monLimitVal = limitFormat(obj.monLimitVal);
                    obj.dataType = dataTypeKeyValue[obj.dataType];
                    obj.enableThirdCard = enableThirdCardKeyValue[obj.enableThirdCard];
                    obj.idleAction = idleActionKeyValue[obj.idleAction];
                    obj.bwmode = bwmodeKeyValue[obj.idleAction];
                    obj.wifi_auto_ctrl = wifiAutoCtrlKeyValue[obj.idleAction];
                    tags.clientsEnable = clientsEnableKeyValue[obj.statusNew];

                    obj.tags = tags
                    obj.tips = tips

                    computedList[i].showData = obj
                }
                return computedList
            }
        },
        mounted(){
            vifiDevGrpS2(this.keyDevGrpIDQuery).then(response => {
                const S2Data = response.data.data.items;
                this.keyDevGrpIDInitOptions = S2Data.map(item => {
                    return {value: item.id, label: item.text};
                });
                this.keyDevGrpIDOptions = this.keyDevGrpIDInitOptions;
            })
        },
        watch: {
            //搜索监听
            listQuery: {
                handler(curVal, oldVal){
                    debounce.call(this, 2000, function () {
                        this.getList()
                    })

                },
                //监听对象需要设置deep
                deep: true
            },
            //checkedList监听
            checkedRows: {
                handler(curVal, oldVal){
                    if(curVal.length>0){
                        this.editDisable = false
                        this.deleteDisable = false
                    }else {
                        this.editDisable = true
                        this.deleteDisable = true
                    }
                },
            },
            //modal监听
            'temp.dataType': {
                handler(curVal, oldVal){
                    if (curVal == "A" || curVal == "F") {
                        this.localSwitchFailCntDisabled = true
                        this.localSwitchOutTimeDisabled = true
                    } else {
                        this.localSwitchFailCntDisabled = false
                        this.localSwitchOutTimeDisabled = false
                    }
                },
            },
            'temp.idleAction': {
                handler(curVal, oldVal){
                    if (curVal == -1) {
                        this.temp.idleTimes = -1
                        this.idleTimesDisabled = true
                    } else {
                        this.idleTimesDisabled = false
                        if (this.dialogStatus != "update") {
                            this.temp.idleTimes = 0
                        } else {
                            //返回原值（checkedRows中取）
                            this.temp.idleTimes = this.checkedRows[0].idleTimes || 0
                        }
                    }
                },
            },
            'temp.bwmode': {
                handler(curVal, oldVal){
                    if (curVal == undefined || curVal == null || curVal == "") {
                        return;
                    }
                    if (curVal != 1) {
                        this.ipwlistDisabled = true
                    } else {
                        if (this.dialogStatus != "update") {
                            this.ipwlistDisabled = false
                        } else {
                            //返回原值（checkedRows中取）
                            this.temp.ipwlist = this.checkedRows[0].ipwlist
                            this.ipwlistDisabled = false
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
                    keyDevGrpID: undefined,
                    name: undefined,
                    termAuthType: undefined,
                    status: undefined,
                    devExpire: undefined,
                    rateLimit: undefined,
                    dayLimitVal: undefined,
                    dayLimitRate: undefined,
                    monLimitVal: undefined,
                    monLimitRate: undefined,
                    dataType: undefined,
                    enableThirdCard: undefined,
                    remark: '',
                    devConfigs:undefined,
                    idleAction: undefined,
                    idleTimes: undefined,
                    bwmode: undefined,
                    ipwlist: undefined,
                    wifi_auto_ctrl: undefined,
                    clientsEnable: undefined,
                    protalAutoAddWhite: undefined,
                    localSimSwitch: undefined,
                    localSwitchFailCnt: undefined,
                    localSwitchOutTime: undefined,
                }
            },
            handleCreate() {
                handleCreate.call(this)
            },
            createData() {
                createData.call(this,create)
            },
            handleUpdate() {
                handleUpdate.call(this)
            },
            handleRefresh() {
                //js赋值无法触发事件:1.手动触发2.watch监听
                this.listQuery = {
                    page: 1,
                    offset: 0,
                    limit: 20,
                    orderList: [],
                    keyDevGrpID: undefined,
                }
            },
            updateData() {
                //组建devConfigs
                let config=new Object()
                if (this.temp.idleAction || this.temp.idleAction==0) {
                    config.idleAction = parseInt(this.temp.idleAction);
                }
                if (this.temp.idleTimes || this.temp.idleTimes==0) {
                    config.idleTimes = parseInt(this.temp.idleTimes);
                }
                if (this.temp.localSwitchFailCnt|| this.temp.localSwitchFailCnt==0) {
                    config.RFAILTMS = parseInt(this.temp.localSwitchFailCnt);
                }
                if (this.temp.localSwitchOutTime|| this.temp.localSwitchOutTime==0) {
                    config.RTIMEOUT = parseInt(this.temp.localSwitchOutTime);
                }
                if (this.temp.bwmode|| this.temp.bwmode==0) {
                    config.bwmode = parseInt(this.temp.bwmode);
                }
                if (this.temp.wifi_auto_ctrl || this.temp.wifi_auto_ctrl==0) {
                    config.wifi_auto_ctrl = parseInt(this.temp.wifi_auto_ctrl);
                }
                if (this.temp.clientsEnable || this.temp.clientsEnable==0) {
                    config.clientsEnable = parseInt(this.temp.clientsEnable);
                }
                if (this.temp.protalAutoAddWhite || this.temp.protalAutoAddWhite==0) {
                    config.protalAutoAddWhite = parseInt(this.temp.protalAutoAddWhite);
                }
                if (this.temp.ipwlist) {
                    config.ipwlist = this.temp.ipwlist.split(",");
                }
                if (Object.keys(config).length==0) {
                    config.config = (new Date()).getTime().toString();
                }
                this.temp.devConfigs=JSON.stringify(config)

                updateData.call(this, update)
            },
            //在渲染表头的时候，会调用此方法，h为createElement的缩写版  添加on.change事件即可
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
            remoteKeyDevGrpIDMethod(query) {
                //点击并不会触发远程查询时间，只有输入时才会触发
                if (query !== '') {
                    this.selectLoading = true;
                    this.keyDevGrpIDQuery.query = query,

                        vifiDevGrpS2(this.keyDevGrpIDQuery).then(response => {
                            this.selectLoading = false;
                            const S2Data = response.data.data.items;
                            this.keyDevGrpIDOptions = S2Data.map(item => {
                                return {value: item.id, label: item.text};
                            });
                        }).catch(r => {
                            this.selectLoading = false
                        })
                }
            },
            switchKeyDevGrpID(){
                this.keyDevGrpIDOptions = this.keyDevGrpIDInitOptions
            },
            selectionChange(val, row){
                this.checkedRows = val;
            },
            selectionAll(val, row){
                this.checkedRows = val;
            },
            clickRow(row){
                let checklist=this.checkedRows
                for(let i=checklist.length-1;i>=0;i--){
                    if(checklist[i].keyDevGrpID==row.keyDevGrpID){
                        return;
                    }
                }
                this.checkedRows.push(row)
            },
            tableRowClassName({row, rowIndex}) {
                if (rowIndex === 1) {
                    return 'warning-row';
                } else
                    return '';
            },
            devStatusOfGroup(value){
                var comData = {1:{text: '在线', color: "primary"},100:{text: '其他', color: "default"}},
                    statusArr = value && value.split("|");
                comData[100] = {text: '其他', color: "default"};
                if (!statusArr || statusArr.length === 0) {
                    return {dom:'-',title:'-'};
                } else {
                    var dom = '<div class="progress-box"><div class="progress" style="margin-top:4px;height:15px;">',
                        total = statusArr[0],
                        title = '总数' + ":" + total + '<br>';
                    for (var i = 1, len = statusArr.length; i < len; i++) {
                        var statusInfo = statusArr[i] && statusArr[i].split(":");
                        if (statusInfo && statusInfo.length >= 2) {
                            var statusI18NInfo = comData[statusInfo[0]];
                            title += statusI18NInfo.text + ":" + statusInfo[1] + '<br/>';
                            var per = parseInt(statusInfo[1] * 100 / total < 5 && statusInfo[1] > 0 ? (statusInfo[1] * 100 / total > 95 && statusInfo[1] != total ? 95 : statusInfo[1] * 100 / total) : statusInfo[1] * 100 / total);
                            dom += '<div class="progress-bar bg-' + statusI18NInfo.color + '" style="width:' +
                                per +
                                '%">' +
                                (statusInfo[0] === "1" ? '<span style="float:right;line-height:12px;">' + statusInfo[1] + '/' + total + '&nbsp;</span>' : "") + '</div>';
                        }
                    }
                    dom += '</div></div>';
                    return {dom:dom,title:title};
                }
            }
        }
    }
</script>
<style>

    .form_line {
        letter-spacing: -1px;
        text-align: center;
        font-size: 14px;
        font-weight: 700;
        color: #606266;
        margin: 20px auto;
    }

    .demo-table-expand label{
        width: 135px;
    }

</style>
