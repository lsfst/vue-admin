<template>
    <div class="app-container">

        <div class="filter-container">
            <sticky class-name="sub-navbar">
                <el-col :span="6">
                    <el-input :placeholder="$t('table.tbSCGroup.groupName')" v-model="listQuery.groupName"
                              clearable
                              prefix-icon="el-icon-search" style="width: 90%;" class="filter-item"/>
                </el-col>

                <el-col :span="6">
                    <el-select v-model="listQuery.idxAreaId" class="filter-item"
                               :placeholder="$t('table.tbSCGroup.idxAreaId')" filterable remote
                               style="width:90%" clearable
                               @focus="switchIdxAreaId" :remote-method="remoteIdxAreaIdMethod"
                               :loading="selectLoading"
                               clearable>
                        <el-option v-for="item in idxAreaIdOptions" :key="item.value" :label="item.label"
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

                <!--<el-col :span="4" class="text-center">-->
                    <!--<button class="pan-btn blue-btn">Documentation</button>-->
                <!--</el-col>-->

                <el-form-item v-if="dialogStatus=='create'" :label="$t('table.tbSCGroup.keySCGroupID')" prop="keySCGroupID">
                    <el-input clearable v-model="temp.keySCGroupID" name="keySCGroupID"/>
                </el-form-item>

                <el-form-item v-if="dialogStatus!='batchUpdate'" :label="$t('table.tbSCGroup.groupName')" prop="groupName">
                    <el-input clearable v-model="temp.groupName" name="groupName"/>
                </el-form-item>

                <el-form-item v-if="dialogStatus!='batchUpdate'" :label="$t('table.tbSCGroup.ispID')" prop="ispID">
                    <el-select v-model="temp.ispID" class="filter-item" placeholder="Please select" filterable remote
                               @focus="switchIspID" :remote-method="remoteIspIDMethod" :loading="selectLoading"
                               clearable>
                        <el-option v-for="item in ispIDOptions" :key="item.value" :label="item.label"
                                   :value="item.value"/>
                    </el-select>
                </el-form-item>

                <el-form-item v-if="dialogStatus!='batchUpdate'" :label="$t('table.tbSCGroup.idxAreaId')" prop="idxAreaId">
                    <el-select v-model="temp.idxAreaId" class="filter-item" placeholder="Please select" filterable remote
                               @focus="switchIdxAreaId" :remote-method="remoteIdxAreaIdMethod" :loading="selectLoading"
                               clearable>
                        <el-option v-for="item in idxAreaIdOptions" :key="item.value" :label="item.label"
                                   :value="item.value"/>
                    </el-select>
                </el-form-item>

                <el-form-item  v-if="dialogStatus!='batchUpdate'" :label="$t('table.tbSCGroup.cardType')" prop="cardType">
                    <el-select v-model="temp.cardType" class="filter-item" clearable>
                        <el-option v-for="item in cardTypeOptions" :key="item.key" :label="item.name"
                                   :value="item.key"/>
                    </el-select>
                </el-form-item>

                <el-form-item  v-if="dialogStatus!='batchUpdate'" :label="$t('table.tbSCGroup.imei')" prop="imei">
                    <el-input clearable v-model="temp.imei"/>
                </el-form-item>

                <el-form-item  v-if="dialogStatus!='batchUpdate'" :label="$t('table.tbSCGroup.usageCyc')" prop="usageCyc">
                    <el-select v-model="temp.usageCyc" class="filter-item" clearable>
                        <el-option v-for="item in usageCycOptions" :key="item.key" :label="item.name"
                                   :value="item.key"/>
                    </el-select>
                </el-form-item>

                <el-form-item  v-if="dialogStatus!='batchUpdate'" :label="$t('table.tbSCGroup.dataUsage')" prop="dataUsage">
                    <el-input clearable v-model="temp.dataUsage"/>
                </el-form-item>

                <el-form-item v-if="dialogStatus!='batchUpdate'" :label="$t('table.tbSCGroup.lastResetTm')" >
                    <el-date-picker
                            v-model="temp.lastResetTm"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            type="date"
                            prop="lastResetTm">
                    </el-date-picker>
                </el-form-item>

                <el-form-item  v-if="dialogStatus!='batchUpdate'" :label="$t('table.tbSCGroup.dayMaxUsage')" prop="dayMaxUsage">
                    <el-input clearable v-model="temp.dayMaxUsage"/>
                </el-form-item>

                <el-form-item  v-if="dialogStatus!='batchUpdate'" :label="$t('table.tbSCGroup.usagePolicy')" prop="usagePolicy">
                    <el-select v-model="temp.usagePolicy" class="filter-item" clearable>
                        <el-option v-for="item in usagePolicyOptions" :key="item.key" :label="item.name"
                                   :value="item.key"/>
                    </el-select>
                </el-form-item>

                <el-form-item  v-if="dialogStatus!='batchUpdate'" :label="$t('table.tbSCGroup.monthMaxUsage')" prop="monthMaxUsage">
                    <el-input clearable v-model="temp.monthMaxUsage" />
                </el-form-item>

                <el-form-item  v-if="dialogStatus!='batchUpdate'" :label="$t('table.tbSCGroup.rateLimit')" prop="rateLimit">
                    <el-input clearable v-model="temp.rateLimit"/>
                </el-form-item>

                <el-form-item  v-if="dialogStatus!='batchUpdate'" :label="$t('table.tbSCGroup.apn')" prop="apn">
                    <el-input clearable v-model="temp.apn" />
                </el-form-item>

                <el-form-item  v-if="dialogStatus!='batchUpdate'" :label="$t('table.tbSCGroup.roamSupport')" prop="roamSupport">
                    <el-select v-model="temp.roamSupport" class="filter-item" filterable
                               clearable>
                        <el-option v-for="item in roamSupportOptions" :key="item.key" :label="item.name"
                                   :value="item.key"/>
                    </el-select>
                </el-form-item>

                <el-form-item v-if="dialogStatus!='batchUpdate'" :label="$t('table.tbSCGroup.priority')" prop="priority">
                    <el-select v-model="temp.priority" class="filter-item" filterable
                               clearable>
                        <el-option v-for="item in priorityOptions" :key="item.key" :label="item.name"
                                   :value="item.key"/>
                    </el-select>
                </el-form-item>

                <el-form-item v-if="dialogStatus!='batchUpdate'" :label="$t('table.tbSCGroup.enbCardIMEI')" prop="enbCardIMEI">
                    <el-select v-model="temp.enbCardIMEI" class="filter-item" filterable
                               clearable>
                        <el-option v-for="item in enbCardIMEIOptions" :key="item.key" :label="item.name"
                                   :value="item.key"/>
                    </el-select>
                </el-form-item>

                <el-form-item :label="$t('table.tbSCGroup.simExpire')" prop="simExpire">
                    <el-input clearable v-model="temp.simExpire"/>
                </el-form-item>

                <el-form-item v-if="dialogStatus!='batchUpdate'" :label="$t('table.tbSCGroup.remarks')" prop="remarks">
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
    import {fetchGroup,createGroup,updateGroup,removeGroup} from '@/api/simcard'
    import {areaS2,ispS2} from '@/api/select'
    import {parseTime} from '@/utils'
    import {limitFormat} from '@/filters/index'
    import {_getValidateRules} from '@/utils/rules'
    import {
        handleCreate, handleDelete, handleDownload, updateData, renderHeadSort, createData,
        handleUpdate, getList, debounce,computedFmt,remoteInitQuery,remoteQuery
    } from '@/utils/tableCustom'

    const usageCycOptions = [
        {key: '1', name: '每日'},
        {key: '7', name: '7天'},
        {key: '30', name: '每月'},
        {key: '90', name: '每季'},
        {key: '180', name: '半年'},
        {key: '365', name: '每年'},
    ]

    const cardTypeOptions = [
        {key: '0', name: '自动'},
        {key: '2', name: '2G 卡'},
        {key: '3', name: '3G 卡'},
        {key: '4', name: '4G 卡'},
        {key: '5', name: '5G 卡'},
    ]

//    const cardSizeOptions = [
//        {key: '1', name: 'Sim 大卡'},
//        {key: '2', name: 'Micro Sim 中卡'},
//        {key: '3', name: 'Nano Sim 小卡'},
//    ]
    const roamSupportOptions=[
        {key: '0', name: '否'},
        {key: '1', name: '是'}
    ]

    const priorityOptions = [
        {key: '0', name: '0'},
        {key: '1', name: '1'},
        {key: '2', name: '2'},
        {key: '3', name: '3'},
        {key: '4', name: '4'},
        {key: '5', name: '5'},
        {key: '6', name: '6'},
        {key: '7', name: '7'},
        {key: '8', name: '8'},
        {key: '9', name: '9'},
    ]
    const usagePolicyOptions = [
        {key: '0', name: '随机'},
        {key: '1', name: '优先用完'},
        {key: '2', name: '同时并发'},
    ]
    const enbCardIMEIOptions = [
        {key: '0', name: '禁用'},
        {key: '1', name: '启用'},
    ]

    const usageCycKeyValue = usageCycOptions.reduce((acc, cur) => {
        acc[cur.key] = cur.name
        return acc
    }, {})

    const cardTypeKeyValue = cardTypeOptions.reduce((acc, cur) => {
        acc[cur.key] = cur.name
        return acc
    }, {})

    const roamSupportKeyValue = roamSupportOptions.reduce((acc, cur) => {
        acc[cur.key] = cur.name
        return acc
    }, {})
    const usagePolicyKeyValue = usagePolicyOptions.reduce((acc, cur) => {
        acc[cur.key] = cur.name
        return acc
    }, {})

    const enbCardIMEIKeyValue = enbCardIMEIOptions.reduce((acc, cur) => {
        acc[cur.key] = cur.name
        return acc
    }, {})

    export default {
        name: 'simGrpTable',
        components: {Sticky,simpleTableTemplate,operationsTemplate},
        data() {
            return {
                prefix:'table.tbSCGroup.',
                tableKey: 'keySCGroupID',
                tableList: [
                    {name: 'keySCGroupID', width: {length: 100},vali:{required:true,strLen:[0,64],zh:false,valid:function (rule, value, callback) {
                            if(value=='0'){
                                return callback(new Error('组编号不能为0'))
                            }else {
                                return callback()
                            }
                    }}},
                    {name: 'groupName',width: {length: 160},vali:{required:false,strLen:[0,128]}},
                    {name: 'ispID',expand:true,vali:{required:true}},
                    {name: 'idxAreaId', width: {length: 140},vali:{required:true},type:'html',format:{areaFM:true}},
                    {name: 'cardType', expand:true,format:{comData:cardTypeKeyValue}},
                    {name: 'imei', hide:true,vali:{strLen:[0,9]}},
                    {name: 'usageCyc', width: {length: 120},vali:{required:true},format:{comData:usageCycKeyValue}},
                    {name: 'dataUsage',width: {length: 120},vali:{moreThan:0.1,lessThan:2000,decimals:3,required:true},format:{ratio:1000000}},
                    {name: 'lastResetTm', type:'date',expand:true,vali:{required:true}},
                    {name: 'usagePolicy',width: {length: 120},vali:{required:true},format:{comData:usagePolicyKeyValue}},
                    {name: 'dayMaxUsage', width: {length: 120},vali:{lessThan:10000,decimals:3,required:true},format:{ratio:1000000,decimals:3}},
                    {name: 'monthMaxUsage', width: {length: 140},vali:{lessThan:10000,decimals:3},format:{ratio:1000000,decimals:3}},
                    {name: 'rateLimit', expand:true,vali:{integer:true,lessThan:1000000,moreThan:10}},
                    {name: 'scStatusInGroup', width: {length: 160,min:true},type:'tip',format:{fmt:function (value) {
                        let comData = {3:{text: '空闲', color: "success"},100:{text: '其他', color: "default"}},
                            statusArr = value && value.split("|");
                        if (!statusArr || statusArr.length === 0) {
                            return {fmt:'-',tip:"-"};
                        } else {
                            let dom = '<div class="progress-box"><div class="progress" style="margin-top:4px;height:15px;">',
                                total = statusArr[0],title = '总数' + ":" + total + '<br>';
                            for (let i = 1, len = statusArr.length; i < len; i++) {
                                let statusInfo = statusArr[i] && statusArr[i].split(":");
                                if (statusInfo && statusInfo.length >= 2) {
                                    let statusI18NInfo = comData[statusInfo[0]],
                                    per = parseInt(statusInfo[1] * 100 / total < 5 && statusInfo[1] > 0 ? (statusInfo[1] * 100 / total > 95 && statusInfo[1] != total ? 95 : statusInfo[1] * 100 / total) : statusInfo[1] * 100 / total);
                                    title += statusI18NInfo.text + ":" + statusInfo[1] + '<br/>';
                                    dom += '<div class="progress-bar bg-' + statusI18NInfo.color + '" style="width:' +
                                        per +
                                        '%">' +
                                        (statusInfo[0] === "3" ? '<span style="float:right;line-height:12px;">' + statusInfo[1] + '/' + total + '&nbsp;</span>' : "") + '</div>';
                                }
                            }
                            dom += '</div></div>';
                            return {fmt:dom,tip:title};
                        }
                    }}},
                    {name: 'apn',expand:true,vali:{strLen:[0,30]}},
                    {name: 'roamSupport',expand:true,format:{comData:roamSupportKeyValue}},
                    {name: 'dialnumber',expand:true},
                    {name: 'dialuid',expand:true},
                    {name: 'dialpwd', expand: true},
                    {name: 'priority',width: {length: 120}},
                    {name: 'enbCardIMEI',width: {length: 120},format:{comData:enbCardIMEIKeyValue}},
                    {name: 'simExpire',hide:true,vali:{moreThan:179}},
                    {name: 'remarks', expand: true,vali:{strLen:[0,128]}},
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
                    orderList: []
                },
                usageCycOptions: usageCycOptions,
                cardTypeOptions: cardTypeOptions,
                roamSupportOptions: roamSupportOptions,
                priorityOptions: priorityOptions,
                usagePolicyOptions: usagePolicyOptions,
                enbCardIMEIOptions: enbCardIMEIOptions,
                idxAreaIdOptions: [],
                idxAreaIdInitOptions: [],
                ispIDOptions:[],
                ispIDInitOptions:[],
                editDisable: true,
                deleteDisable: true,
                checkedRows: [],
                temp: {
                    keySCGroupID:undefined,
                    groupName:undefined,
                    ispID:undefined,
                    idxAreaId:undefined,
                    cardType:undefined,
                    imei:undefined,
                    usageCyc:undefined,
                    dataUsage:undefined,
                    lastResetTm:undefined,
                    dayMaxUsage:undefined,
                    usagePolicy:undefined,
                    monthMaxUsage:undefined,
                    rateLimit:undefined,
                    apn:undefined,
                    roamSupport:undefined,
                    priority:undefined,
                    enbCardIMEI:undefined,
                    simExpire:undefined,
                    remarks:undefined
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
                return computedFmt.call(this,this.list,this.tableList)
            }
        },
        mounted(){
            remoteInitQuery.call(this, areaS2, "idxAreaId","area")
            remoteInitQuery.call(this, ispS2, "ispID")
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
        },
        methods: {
            getList() {
                getList.call(this, fetchGroup)
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
                    keySCGroupID:undefined,
                    groupName:undefined,
                    ispID:undefined,
                    idxAreaId:undefined,
                    cardType:undefined,
                    imei:undefined,
                    usageCyc:undefined,
                    dataUsage:undefined,
                    lastResetTm:undefined,
                    dayMaxUsage:undefined,
                    usagePolicy:undefined,
                    monthMaxUsage:undefined,
                    rateLimit:undefined,
                    apn:undefined,
                    roamSupport:undefined,
                    priority:undefined,
                    enbCardIMEI:undefined,
                    simExpire:undefined,
                    remarks:undefined
                }
            },
            handleCreate() {
                handleCreate.call(this)
            },
            createData() {
                createData.call(this,createGroup)
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
                    orderList: []
                }
            },
            updateData() {
                //组建devConfigs
                updateData.call(this, updateGroup)
            },
            //在渲染表头的时候，会调用此方法，h为createElement的缩写版  添加on.change事件即可
            renderSort(h, {column, $index}, index, name) {
                return renderHeadSort.call(this, h, {column, $index}, index, name)
            },
            handleDelete() {
                handleDelete.call(this, removeGroup)
            },
            handleDownload() {
                const tHeader = ['keySimCardID', 'idxSCGroupID', 'simPDevID', 'areaCode', 'status', 'statusNew']
                handleDownload.call(this, tHeader, fetchGroup)
            },
            remoteIdxAreaIdMethod(query) {
                //点击并不会触发远程查询时间，只有输入时才会触发
                remoteQuery.call(this,areaS2,query,"idxAreaId","area")
            },
            remoteIspIDMethod(query) {
                //点击并不会触发远程查询时间，只有输入时才会触发
                remoteQuery.call(this,ispS2,query,"ispID")
            },
            switchIdxAreaId(){
                this.idxAreaIdOptions = this.idxAreaIdInitOptions
            },
            switchIspID(){
                this.ispIDOptions = this.ispIDInitOptions
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
            scStatusOfGroup(value){
                var comData = {1:{text: '空闲', color: "primary"},100:{text: '其他', color: "default"}},
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
