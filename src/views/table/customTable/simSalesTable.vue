<template>
    <div class="app-container">

        <div class="filter-container">
            <sticky class-name="sub-navbar">
                <el-col :span="6">
                    <el-input :placeholder="$t('table.tbSimSales.keySimSalesID')" v-model="listQuery.keySimSalesID"
                              clearable
                              prefix-icon="el-icon-search" style="width: 90%;" class="filter-item"/>
                </el-col>

                <el-col :span="6">
                    <el-select v-model="listQuery.idxSCGroupID" class="filter-item"
                               :placeholder="$t('table.tbSimSales.idxSCGroupID')" filterable remote
                               style="width:90%" clearable
                               @focus="switchIdxSCGroupID" :remote-method="remoteIdxSCGroupIDMethod"
                               :loading="selectLoading"
                               clearable>
                        <el-option v-for="item in idxSCGroupIDOptions" :key="item.value" :label="item.label"
                                   :value="item.value"/>
                    </el-select>
                </el-col>

                <el-col :span="6">
                    <el-select v-model="listQuery.idxAreaId" class="filter-item"
                               :placeholder="$t('table.tbSimSales.idxAreaId')" filterable remote
                               style="width:90%" clearable
                               @focus="switchIdxAreaId" :remote-method="remoteIdxAreaIdMethod"
                               :loading="selectLoading"
                               clearable>
                        <el-option v-for="item in idxAreaIdOptions" :key="item.value" :label="item.label"
                                   :value="item.value"/>
                    </el-select>
                </el-col>

                <el-col :span="6">
                    <el-select v-model="listQuery.limitAgent" class="filter-item"
                               :placeholder="$t('table.tbSimSales.limitAgent')" filterable remote
                               style="width:90%" clearable
                               @focus="switchLimitAgent" :remote-method="remoteLimitAgentMethod"
                               :loading="selectLoading"
                               clearable>
                        <el-option v-for="item in limitAgentOptions" :key="item.value" :label="item.label"
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
                     style="width: 400px; margin-left:50px;">

                <el-form-item :label="$t('table.tbSimSales.idxSCGroupID')" prop="idxSCGroupID">
                    <el-select v-model="temp.idxSCGroupID" class="filter-item" placeholder="Please select" filterable remote
                               @focus="switchIdxSCGroupID" :remote-method="remoteIdxSCGroupIDMethod" :loading="selectLoading"
                               clearable>
                        <el-option v-for="item in idxSCGroupIDOptions" :key="item.value" :label="item.label"
                                   :value="item.value"/>
                    </el-select>
                </el-form-item>

                <el-form-item :label="$t('table.tbSimSales.idxAreaId')" prop="idxAreaId">
                    <el-select v-model="temp.idxAreaId" class="filter-item" placeholder="Please select" filterable remote
                               @focus="switchIdxAreaId" :remote-method="remoteIdxAreaIdMethod" :loading="selectLoading"
                               clearable>
                        <el-option v-for="item in idxAreaIdOptions" :key="item.value" :label="item.label"
                                   :value="item.value"/>
                    </el-select>
                </el-form-item>

                <el-form-item :label="$t('table.tbSimSales.limitAgent')" prop="limitAgent">
                    <el-select v-model="temp.limitAgent" class="filter-item" placeholder="Please select" filterable remote
                               @focus="switchLimitAgent" :remote-method="remoteLimitAgentMethod" :loading="selectLoading"
                               clearable>
                        <el-option v-for="item in limitAgentOptions" :key="item.value" :label="item.label"
                                   :value="item.value"/>
                    </el-select>
                </el-form-item>

                <el-form-item :label="$t('table.tbSimSales.agentChild')" prop="agentChild">
                    <el-select v-model="temp.agentChild" class="filter-item" clearable>
                        <el-option v-for="item in agentChildOptions" :key="item.key" :label="item.name"
                                   :value="item.key"/>
                    </el-select>
                </el-form-item>

                <el-form-item :label="$t('table.tbSimSales.remarks')" prop="remarks">
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
    import {fetchSales, createSales, updateSales, removeSales} from '@/api/simcard'
    import {areaS2, SCGroupS2,agentS2} from '@/api/select'
    import {parseTime} from '@/utils'
    import {iccidFM, trafficFormat, toDecimals} from '@/filters/index'
    import {_getValidateRules} from '@/utils/rules'
    import {
        tableSortDown, tableSortUp, handleDelete, handleDownload, updateData, renderHeadSort, createData,handleCreate,countIds,
        handleUpdate, getList, selectionChange, selectionAll, areaFM, formatArea, debounce,computedFmt,remoteQuery,remoteInitQuery
    } from '@/utils/tableCustom'

    const agentChildOptions = [
        {key: 1, name: '不含子代理'},
        {key: 2, name: '含子代理商'},
    ]

    const agentChildKeyValue = agentChildOptions.reduce((acc, cur) => {
        acc[cur.key] = cur.name
        return acc
    }, {})


    export default {
        name: 'simSalesTable',
        components: {Sticky,simpleTableTemplate,operationsTemplate},
        data() {
            return {
                prefix:'table.tbSimSales.',
                tableKey: 'keySimSalesID',
                tableList: [
                    {name: 'keySimSalesID', width: {length: 180},show: true},
                    {name: 'idxSCGroupID',show:true,width: {length: 180},vali:{required:true}},
                    {name: 'idxAreaId',show:true,width: {length: 180},type:'html',format:{areaFM:true},vali:{required:true}},
                    {name: 'weightPriority', width: {length: 180}, show:true},
                    {name:"limitAgent", width:{length: 180},show:true,vali:{required:true}},
                    {name:"agentChild",hide:true,vali:{required:true}},
                    {name: 'remarks',width: {length: 180,min :true},show:true,vali:{strLen:[0,256]}},
                    {name: 'mdfTm', width: {length: 180}, type: 'date', show: true},
                    {name: 'mdfBy',expand:true},
                    {name: 'crtTm',expand:true},
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
                agentChildOptions:agentChildOptions,
                idxSCGroupIDOptions: [],
                idxSCGroupIDInitOptions: [],
                idxAreaIdOptions:[],
                idxAreaIdInitOptions:[],
                limitAgentOptions:[],
                limitAgentInitOptions:[],
                editDisable: false,
                deleteDisable: true,
                checkedRows: [],
                temp: {
                    keySimSalesID:undefined,
                    idxSCGroupID: undefined,
                    idxAreaId: undefined,
                    limitAgent: undefined,
                    agentChild: 1,
                    remarks: undefined
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
            remoteInitQuery.call(this, SCGroupS2, "idxSCGroupID")
            remoteInitQuery.call(this, areaS2, "idxAreaId","area")
            remoteInitQuery.call(this, agentS2, "limitAgent")
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
                        if(curVal.length==1){
                            this.editDisable=false
                        }else {
                            this.editDisable=true
                        }
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
                getList.call(this, fetchSales)
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
                    keySimSalesID:undefined,
                    idxSCGroupID: undefined,
                    idxAreaId: undefined,
                    limitAgent: undefined,
                    agentChild: 1,
                    remarks: undefined
                }
            },
            handleCreate() {
                handleCreate.call(this)
            },
            createData() {
                createData.call(this,createSales)
            },
            handleUpdate() {
                handleUpdate.call(this)
                if(this.temp.limitAgent.indexOf(".*")>0){
                    this.temp.agentChild=2
                    this.temp.limitAgent=this.temp.limitAgent.replace(".*","")
                }else {
                    this.temp.agentChild=1
                }
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
                updateData.call(this, updateSales)
            },
            renderSort(h, {column, $index}, index, name) {
                return renderHeadSort.call(this, h, {column, $index}, index, name)
            },
            handleDelete() {
                handleDelete.call(this, removeSales)
            },
            handleDownload() {
                const tHeader = ['keySimCardID', 'idxSCGroupID', 'simPDevID', 'areaCode', 'status', 'statusNew']
                handleDownload.call(this, tHeader, fetchSales)
            },
            remoteIdxSCGroupIDMethod(query) {
                remoteQuery.call(this,SCGroupS2,query,"idxSCGroupID")
            },
            remoteIdxAreaIdMethod(query) {
                remoteQuery.call(this,areaS2,query,"idxAreaId","area")
            },
            remoteLimitAgentMethod(query){
                remoteQuery.call(this,agentS2,query,"limitAgent")
            },
            switchIdxSCGroupID(){
                this.idxSCGroupIDOptions = this.idxSCGroupIDInitOptions
            },
            switchIdxAreaId(){
                this.idxAreaIdOptions = this.idxAreaIdInitOptions
            },
            switchLimitAgent(){
                this.limitAgentOptions = this.limitAgentInitOptions
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
                    if(checklist[i].keySimSalesID==row.keySimSalesID){
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
