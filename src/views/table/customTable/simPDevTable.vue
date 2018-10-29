<template>
    <div class="app-container">

        <div class="filter-container">
            <sticky class-name="sub-navbar">

                <el-col :span="6">
                    <el-select v-model="listQuery.keySimPDevID" class="filter-item"
                               :placeholder="$t('table.tbSimPDev.keySimPDevID')" filterable remote
                               style="width:90%" clearable
                               @focus="switchKeySimPDevID" :remote-method="remoteKeySimPDevIDMethod"
                               :loading="selectLoading"
                               clearable>
                        <el-option v-for="item in keySimPDevIDOptions" :key="item.value" :label="item.label"
                                   :value="item.value"/>
                    </el-select>
                </el-col>

                <el-col :span="6">
                    <el-select v-model="listQuery.disable" :placeholder="$t('table.tbSimPDev.disable')" clearable
                                collapse-tags
                               style="width:  90%" class="filter-item">
                        <el-option v-for="item in disableOptions" :key="item.key" :label="item.name"
                                   :value="item.key"/>
                    </el-select>
                </el-col>

                <el-col :span="6">
                    <el-select v-model="listQuery.status" :placeholder="$t('table.tbSimPDev.status')" clearable
                               collapse-tags
                               style="width:  90%" class="filter-item">
                        <el-option v-for="item in statusOptions" :key="item.key" :label="item.name"
                                   :value="item.key"/>
                    </el-select>
                </el-col>


                <el-col :span="6">
                    <el-select v-model="listQuery.idxVSWID" class="filter-item"
                               :placeholder="$t('table.tbSimPDev.idxVSWID')" filterable remote
                               style="width:90%" clearable
                               @focus="switchIdxVSWID" :remote-method="remoteIdxVSWIDMethod"
                               :loading="selectLoading"
                               clearable>
                        <el-option v-for="item in idxVSWIDOptions" :key="item.value" :label="item.label"
                                   :value="item.value"/>
                    </el-select>
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
                     style="width: 500px; margin-left:50px;">

                <el-form-item v-if="dialogStatus=='create'" :label="$t('table.tbSimPDev.keySimPDevID')" prop="keySimPDevID">
                    <el-input clearable v-model="temp.keySimPDevID"/>
                </el-form-item>

                <el-form-item :label="$t('table.tbSimPDev.password')" prop="password">
                    <el-input clearable v-model="temp.password"/>
                </el-form-item>


                <el-form-item :label="$t('table.tbSimPDev.devName')" prop="devName">
                    <el-input clearable v-model="temp.devName"/>
                </el-form-item>

                <el-form-item :label="$t('table.tbSimPDev.disable')" prop="disable">
                    <el-select v-model="temp.disable" class="filter-item" clearable>
                        <el-option v-for="item in disableOptions" :key="item.key" :label="item.name"
                                   :value="item.key"/>
                    </el-select>
                </el-form-item>

                <el-form-item :label="$t('table.tbSimPDev.idxSimPDevGrpID')" prop="idxSimPDevGrpID">
                    <el-select v-model="temp.idxSimPDevGrpID" class="filter-item" placeholder="Please select" filterable remote
                               @focus="switchIdxSimPDevGrpID" :remote-method="remoteIdxSimPDevGrpIDMethod" :loading="selectLoading"
                               clearable>
                        <el-option v-for="item in idxSimPDevGrpIDOptions" :key="item.value" :label="item.label"
                                   :value="item.value"/>
                    </el-select>
                </el-form-item>

                <el-form-item :label="$t('table.tbSimPDev.typeName')" prop="typeName">
                    <el-select v-model="temp.typeName" class="filter-item" clearable>
                        <el-option v-for="item in typeNameOptions" :key="item.key" :label="item.name"
                                   :value="item.key"/>
                    </el-select>
                </el-form-item>

                <el-form-item :label="$t('table.tbSimPDev.idxVSWID')" prop="idxVSWID">
                    <el-select v-model="temp.idxVSWID" class="filter-item" placeholder="Please select" filterable remote
                               @focus="switchIdxVSWID" :remote-method="remoteIdxVSWIDMethod" :loading="selectLoading"
                               clearable>
                        <el-option v-for="item in idxVSWIDOptions" :key="item.value" :label="item.label"
                                   :value="item.value"/>
                    </el-select>
                </el-form-item>

                <el-form-item :label="$t('table.tbSimPDev.expire')" prop="expire">
                    <el-input clearable v-model="temp.expire"/>
                </el-form-item>

                <el-form-item :label="$t('table.tbSimPDev.remarks')" prop="remarks">
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
    import {fetch, create, update, remove} from '@/api/simp'
    import {vswS2, simPDevS2,simPDevGrpS2} from '@/api/select'
    import {parseTime} from '@/utils'
    import {iccidFM, trafficFormat, toDecimals} from '@/filters/index'
    import {_getValidateRules} from '@/utils/rules'
    import {
        tableSortDown, tableSortUp, handleDelete, handleDownload, updateData, renderHeadSort, createData,handleCreate,countIds,
        handleUpdate, getList, selectionChange, selectionAll, areaFM, formatArea, debounce,computedFmt,remoteQuery,remoteInitQuery
    } from '@/utils/tableCustom'

    const disableOptions = [
        {key: 0, name: '正常'},
        {key: 1, name: '禁用'},
    ]
    const statusOptions = [
        {key: 0, name: '在线',style:'primary'},
        {key: 1, name: '离线',style:'default'},
    ]

    const typeNameOptions=[
        {key:'Simpool 128',name:'Simpool 128'},
        {key:'Simpool 256',name:'Simpool 256'}
    ]

    const disableKeyValue = disableOptions.reduce((acc, cur) => {
        acc[cur.key] = cur.name
        return acc
    }, {})

    const statusKeyValue = statusOptions.reduce((acc, cur) => {
        acc[cur.key] = cur.name
        return acc
    }, {})

    const statusKeyStyle = statusOptions.reduce((acc, cur) => {
        acc[cur.key] = cur.style
        return acc
    }, {})

    var portperFormat=function(portsVal,sum){
        return portsVal != 0 && parseInt(portsVal * 100 / sum) < 5 ? 5 : parseInt(portsVal * 100 / sum);
    };


    export default {
        name: 'simPDevTable',
        components: {Sticky,simpleTableTemplate,operationsTemplate},
        data() {
            return {
                prefix:'table.tbSimPDev.',
                tableKey: 'keySimPDevID',
                tableList: [
                    {name: 'keySimPDevID', width: {length: 120},show: true,vali:{required:true,zh:false,strLen:[0,64]}},
                    {name: 'password',expand:true,vali:{required:true,strLen:[0,64]}},
                    {name: 'devName',expand:true,vali:{strLen:[0,128]}},
                    {name: 'disable',expand:true,vali:{required:true},format:{comData:disableKeyValue}},
                    {name:"idxSimPDevGrpID", expand:true,vali:{required:true}},
                    {name:"typeName",expand:true,vali:{required:true}},
                    {name: 'status',width: {length: 180},show:true,type:"tag",tagData:statusKeyStyle,format:{comData:statusKeyValue}},
                    {name: 'ipaddr', width: {length: 180}, show: true},
                    {name:'idxVSWID',width:{length:180},show:true,vali:{required:true}},
                    {name: 'port', width: {length: 180}, expand: true},
                    {name: 'portsStatus', width: {length: 180,min:true}, type: 'tip',format:{fmt:function (value,row) {
                        var status=row.status;
                        var valueArr = value.split("||");//固定5个
                        var value0 = parseInt(valueArr[0]), value1 = parseInt(valueArr[1]),
                            value2 = parseInt(valueArr[2]), value3 = parseInt(valueArr[3]), offlineSimP = parseInt(valueArr[4]);
                        var sum = value0 + value1 + value2 + value3 + offlineSimP;
                        if(valueArr.length != 5 || sum==0){
                            return  {fmt:"-",title:"-"};
                        }
                        var valPer0, valPer1, valPer2,valPer3;
                        var max = Math.max(parseInt(valueArr[0]), parseInt(valueArr[1]), parseInt(valueArr[2]), parseInt(valueArr[3]));
                        if (max == valueArr[0]) {
                            valPer1 = portperFormat(valueArr[1],sum);
                            valPer2 = portperFormat(valueArr[2],sum);
                            valPer3 = portperFormat(valueArr[3],sum);
                            valPer0 = 100 - valPer1 - valPer2-valPer3;
                        } else if (max == valueArr[1]) {
                            valPer0 = portperFormat(valueArr[0],sum);
                            valPer2 = portperFormat(valueArr[2],sum);
                            valPer3 = portperFormat(valueArr[3],sum);
                            valPer1 = 100 - valPer0 - valPer2-valPer3;
                        } else if (max == valueArr[2]){
                            valPer0 = portperFormat(valueArr[0],sum);
                            valPer1 = portperFormat(valueArr[1],sum);
                            valPer3 = portperFormat(valueArr[3],sum);
                            valPer2 = 100 - valPer0 - valPer1-valPer3;
                        }else {
                            valPer0 = portperFormat(valueArr[0],sum);
                            valPer1 = portperFormat(valueArr[1],sum);
                            valPer2 = portperFormat(valueArr[2],sum);
                            valPer3 = 100 - valPer0 - valPer1-valPer2;
                        }
                        if(status!=0){
                            value0 = 0; value1 = 0; value2 = 0; value3 = parseInt(valueArr[4]);
                            valPer0 = 0; valPer1 = 0; valPer2 = 0; valPer3 = 100;
                        }
                        var title = "使用中: " + value0 + '<br>'  +
                            "卡空闲: " + value1 + '<br>' +  "卡异常: " + value2
                            + '<br>' + "无卡: " + value3;
                        let dom="<div class='progress' style='margin-top:2px;height:18px;'>" + // title="'+ title +'" // progress-bar-primary 没有这个类
                            "<div class='progress-bar' style='background-color: #4374e0!important;width:" + valPer0 + "%'><span class='sr-only'>35% Complete (success)</span></div>" +
                            "<div class='progress-bar progress-bar-success' style='width:" + valPer1 + "%'><span class='sr-only'>1</span></div>" +
                            "<div class='progress-bar progress-bar-warning' style='width:" + valPer2 + "%'><span class='sr-only'>1</span></div>" +
                            "<div class='progress-bar' style='background-color: "+(status!=0?"#e5e5e5":"#ccc")+";width:" + valPer3 + "%;'><span class='sr-only'>1</span></div>" +
                            "</div>";
                        return {fmt:dom,tip:title}
                    }},show: true},
                    {name: 'expire', width: {length: 180},show: true,vali:{integer:true,required:true}},
                    {name: 'lastUpdate', width: {length: 180},type:'date',  show: true},
                    {name:"remarks", expand:true},
                    {name: 'mdfTm',  expand: true},
                    {name: 'mdfBy',expand:true},
                    {name: 'crtTm',width: {length: 180}, type: 'date',show:true},
                    {name: 'crtBy',expand:true}
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
                disableOptions:disableOptions,
                statusOptions:statusOptions,
                typeNameOptions:typeNameOptions,
                idxVSWIDOptions: [],
                idxVSWIDInitOptions: [],
                keySimPDevIDOptions:[],
                keySimPDevIDInitOptions:[],
                idxSimPDevGrpIDOptions:[],
                idxSimPDevGrpIDInitOptions:[],
                editDisable: false,
                deleteDisable: true,
                checkedRows: [],
                temp: {
                    keySimPDevID:undefined,
                    password: undefined,
                    devName: undefined,
                    disable: undefined,
                    idxSimPDevGrpID: undefined,
                    typeName: undefined,
                    idxVSWID:undefined,
                    expire:180,
                    remarks:undefined
                },
                dialogFormVisible: false,
                dialogStatus: '',
                textMap: {
                    update: 'edit',
                    create: 'create',
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
            remoteInitQuery.call(this, vswS2, "idxVSWID")
            remoteInitQuery.call(this, simPDevS2, "keySimPDevID")
            remoteInitQuery.call(this, simPDevGrpS2, "idxSimPDevGrpID")
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
                        this.editDisable=false
                        this.deleteDisable = false
                    }else {
                        this.editDisable=true
                        this.deleteDisable = true
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
                    keySimPDevID:undefined,
                    password: undefined,
                    devName: undefined,
                    disable: undefined,
                    idxSimPDevGrpID: undefined,
                    typeName: undefined,
                    idxVSWID:undefined,
                    expire:180,
                    remarks:undefined
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
                    orderList: []
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
            remoteIdxVSWIDMethod(query) {
                remoteInitQuery.call(this, vswS2,query, "idxVSWID")
            },
            remoteKeySimPDevIDMethod(query) {
                remoteInitQuery.call(this, simPDevS2,query, "keySimPDevID")
            },
            remoteIdxSimPDevGrpIDMethod(query){
                remoteInitQuery.call(this, simPDevGrpS2,query, "idxSimPDevGrpID")
            },
            switchIdxVSWID(){
                this.idxVSWIDOptions = this.idxVSWIDInitOptions
            },
            switchKeySimPDevID(){
                this.keySimPDevIDOptions = this.keySimPDevIDInitOptions
            },
            switchIdxSimPDevGrpID(){
                this.idxSimPDevGrpIDOptions = this.idxSimPDevGrpIDInitOptions
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
                    if(checklist[i].keySimPDevID==row.keySimPDevID){
                        return;
                    }
                }
                this.checkedRows.push(row)
            }
        }
    }
</script>
<style>
    .demo-table-expand label{
        width: 120px;
    }

</style>
