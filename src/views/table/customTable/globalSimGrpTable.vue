<template>
    <div class="app-container">

        <div class="filter-container">
            <sticky class-name="sub-navbar">

                <el-col :span="6">
                    <el-input :placeholder="$t('table.tbGlobalSIMGrp.groupName')" v-model="listQuery.groupName"
                              clearable
                              prefix-icon="el-icon-search" style="width: 90%;" class="filter-item"/>
                </el-col>

                <el-col :span="6">
                    <el-select v-model="listQuery.idxSalerID" class="filter-item"
                               :placeholder="$t('table.tbGlobalSIMGrp.idxSalerID')" filterable remote
                               style="width:90%" clearable
                               @focus="switchSupplier" :remote-method="remoteSupplierMethod"
                               :loading="selectLoading"
                               clearable>
                        <el-option v-for="item in supplierOptions" :key="item.value" :label="item.label"
                                   :value="item.value"/>
                    </el-select>
                </el-col>

                <el-col :span="6">
                    <el-select v-model="listQuery.ispId" class="filter-item"
                               :placeholder="$t('table.tbGlobalSIMGrp.ispId')" filterable remote
                               style="width:90%" clearable
                               @focus="switchIsp" :remote-method="remoteIspMethod"
                               :loading="selectLoading"
                               clearable>
                        <el-option v-for="item in ispOptions" :key="item.value" :label="item.label"
                                   :value="item.value"/>
                    </el-select>
                </el-col>

                <el-col :span="6">
                    <el-select v-model="listQuery.areaCode" class="filter-item"
                               :placeholder="$t('table.tbGlobalSIMGrp.areaCode')" filterable remote
                               style="width:90%" clearable
                               @focus="switchArea" :remote-method="remoteAreaMethod"
                               :loading="selectLoading"
                               clearable>
                        <el-option v-for="item in areaOptions" :key="item.value" :label="item.label"
                                   :value="item.value"/>
                    </el-select>
                </el-col>

                <el-col :span="6">
                    <el-select v-model="listQuery.cardType" :placeholder="$t('table.tbGlobalSIMGrp.cardType')" clearable
                               collapse-tags
                               style="width:  90%" class="filter-item">
                        <el-option v-for="item in cardTypeOptions" :key="item.key" :label="item.name"
                                   :value="item.key"/>
                    </el-select>
                </el-col>

                <el-col :span="6">
                    <el-select v-model="listQuery.cardSize" :placeholder="$t('table.tbGlobalSIMGrp.cardSize')" clearable
                               collapse-tags
                               style="width:  90%" class="filter-item">
                        <el-option v-for="item in cardSizeOptions" :key="item.key" :label="item.name"
                                   :value="item.key"/>
                    </el-select>
                </el-col>

                <operationsTemplate
                        :operations="operations"
                        :download-loading="downloadLoading"
                        :delete-disable="deleteDisable"
                        :edit-disable="editDisable"
                        @handleRefresh="handleRefresh"
                        @handleCreate="handleCreate"
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

                <el-form-item :label="$t('table.tbGlobalSIMGrp.groupName')" prop="groupName">
                    <el-input clearable v-model="temp.groupName"/>
                </el-form-item>

                <el-form-item :label="$t('table.tbGlobalSIMGrp.idxSalerID')" prop="idxSalerID">
                    <el-select v-model="temp.idxSalerID" class="filter-item" placeholder="Please select" filterable remote
                               @focus="switchSupplier" :remote-method="remoteSupplierMethod" :loading="selectLoading"
                               clearable>
                        <el-option v-for="item in supplierOptions" :key="item.value" :label="item.label"
                                   :value="item.value"/>
                    </el-select>
                </el-form-item>

                <el-form-item :label="$t('table.tbGlobalSIMGrp.areaCode')" prop="areaCode">
                    <el-select v-model="temp.areaCode" class="filter-item" placeholder="Please select" filterable remote
                               @focus="switchArea" :remote-method="remoteAreaMethod" :loading="selectLoading"
                               clearable>
                        <el-option v-for="item in areaOptions" :key="item.value" :label="item.label"
                                   :value="item.value"/>
                    </el-select>
                </el-form-item>

                <el-form-item :label="$t('table.tbGlobalSIMGrp.ispId')" prop="ispId">
                    <el-select v-model="temp.ispId" class="filter-item" placeholder="Please select" filterable remote
                               @focus="switchIsp" :remote-method="remoteIspMethod" :loading="selectLoading"
                               clearable>
                        <el-option v-for="item in ispOptions" :key="item.value" :label="item.label"
                                   :value="item.value"/>
                    </el-select>
                </el-form-item>


                <el-form-item :label="$t('table.tbGlobalSIMGrp.cardType')" prop="cardType">
                    <el-select v-model="temp.cardType" class="filter-item" clearable>
                        <el-option v-for="item in cardTypeOptions" :key="item.key" :label="item.name"
                                   :value="item.key"/>
                    </el-select>
                </el-form-item>


                <el-form-item :label="$t('table.tbGlobalSIMGrp.cardSize')" prop="cardSize">
                    <el-select v-model="temp.cardSize" class="filter-item" clearable>
                        <el-option v-for="item in cardSizeOptions" :key="item.key" :label="item.name"
                                   :value="item.key"/>
                    </el-select>
                </el-form-item>

                <el-form-item :label="$t('table.tbGlobalSIMGrp.monthlyRental')" prop="monthlyRental">
                    <el-input clearable v-model="temp.monthlyRental"/>
                </el-form-item>

                <el-form-item :label="$t('table.tbGlobalSIMGrp.dataPrice')" prop="dataPrice">
                    <el-input clearable v-model="temp.dataPrice"/>
                </el-form-item>

                <el-form-item :label="$t('table.tbGlobalSIMGrp.roamDataPrice')" prop="roamDataPrice">
                    <el-input clearable v-model="temp.roamDataPrice"/>
                </el-form-item>

                <el-form-item :label="$t('table.tbGlobalSIMGrp.remarks')" prop="remarks">
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
    import {fetchGroup, createGroup, updateGroup, removeGroup} from '@/api/globalSim'
    import {supplierS2,areaS2,ispS2} from '@/api/select'
    import {parseTime} from '@/utils'
    import {iccidFM, trafficFormat, toDecimals} from '@/filters/index'
    import {_getValidateRules} from '@/utils/rules'
    import {
        tableSortDown, tableSortUp, handleDelete, updateData, renderHeadSort, createData,handleCreate,countIds,
        handleUpdate, getList, selectionChange, selectionAll, areaFM, formatArea, debounce,computedFmt,remoteQuery,remoteInitQuery
    } from '@/utils/tableCustom'

    const cardTypeOptions=[
        {key:2,name:'2G 卡'},
        {key:3,name:'3G 卡'},
        {key:4,name:'4G 卡'}
    ]

    const cardSizeOptions=[
        {key:1,name:'Sim 大卡'},
        {key:2,name:'Micro Sim 中卡'},
        {key:3,name:'Nano Sim 小卡'}
    ]

    const cardTypeKeyValue = cardTypeOptions.reduce((acc, cur) => {
        acc[cur.key] = cur.name
        return acc
    }, {})

    const cardSizeKeyValue = cardSizeOptions.reduce((acc, cur) => {
        acc[cur.key] = cur.name
        return acc
    }, {})

    export default {
        name: 'globalSimGrpTable',
        components: {Sticky,simpleTableTemplate,operationsTemplate},
        data() {
            return {
                prefix:'table.tbGlobalSIMGrp.',
                tableKey: 'keyGlobalSIMGrpID',
                tableList: [
                    {name: 'keyGlobalSIMGrpID', width: {length: 100},expand: true},
                    {name: 'groupName',show:true, width: {length: 160},vali:{required:true}},
                    {name: 'idxSalerID',show:true,width:{length:130}},

                    {name: 'areaCode', width: {length: 180},show: true,type:'html',format:{areaFM:true},vali:{required:true}},
                    {name: 'ispId',show:true, width: {length: 130},vali:{required:true,strLen:[0,128]}},
                    {name: 'cardType',show:true,width:{length:130},vali:{required:true},format:{comData:cardTypeKeyValue}},
                    {name: 'cardSize', width: {length: 140},show: true,vali:{required:true},format:{comData:cardSizeKeyValue}},
                    {name: 'monthlyRental',show:true, width: {length: 100},format:{ratio:1000},vali:{required:true,integer:true}},
                    {name: 'dataPrice',show:true,width:{length:120},format:{ratio:1000},vali:{required:true,integer:true}},
                    {name: 'roamDataPrice',expand:true,width:{length:140},format:{ratio:1000},vali:{required:true,integer:true}},

                    {name: 'number',show:true,width:{length:100}},

                    {name: 'remarks',show:true, width: {length: 140,min:true},vali:{strLen:[0,128]}},
                    {name: 'mdfTm',  expand: true,width: {length: 200},type:'date'},
                    {name: 'mdfBy',width: {length: 150},expand:true},
                    {name: 'crtTm',width: {length: 180},type:'date',show:true},
                    {name: 'crtBy',width: {length: 150},expand:true}
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
                cardTypeOptions:cardTypeOptions,
                cardSizeOptions:cardSizeOptions,
                areaOptions: [],
                areaInitOptions: [],
                supplierOptions: [],
                supplierInitOptions: [],
                ispOptions: [],
                ispInitOptions: [],
                editDisable: false,
                deleteDisable: true,
                checkedRows: [],
                temp: {
                    keyGlobalSIMGrpID:undefined,
                    groupName:undefined,
                    idxSalerID:undefined,
                    areaCode:undefined,
                    ispId:undefined,
                    cardType:undefined,
                    cardSize:undefined,
                    monthlyRental:undefined,
                    dataPrice:undefined,
                    roamDataPrice:undefined,
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
            remoteInitQuery.call(this, supplierS2, "supplier")
            remoteInitQuery.call(this, areaS2, "area","area")
            remoteInitQuery.call(this, ispS2, "isp")
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
                    keyGlobalSIMGrpID:undefined,
                    groupName:undefined,
                    idxSalerID:undefined,
                    areaCode:undefined,
                    ispId:undefined,
                    cardType:undefined,
                    cardSize:undefined,
                    monthlyRental:undefined,
                    dataPrice:undefined,
                    roamDataPrice:undefined,
                    remarks: undefined
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
                updateData.call(this, updateGroup)
            },
            renderSort(h, {column, $index}, index, name) {
                return renderHeadSort.call(this, h, {column, $index}, index, name)
            },
            handleDelete() {
                handleDelete.call(this, removeGroup)
            },
            remoteSupplierMethod(query){
                remoteInitQuery.call(this, supplierS2,query, "supplier")
            },
            switchSupplier(){
                this.supplierOptions = this.supplierInitOptions
            },
            remoteAreaMethod(query){
                remoteInitQuery.call(this, areaS2,query, "area")
            },
            switchArea(){
                this.areaOptions = this.areaInitOptions
            },
            remoteIspMethod(query){
                remoteInitQuery.call(this, ispS2,query, "isp")
            },
            switchIsp(){
                this.ispOptions = this.ispInitOptions
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
                    if(checklist[i].keyID==row.keyID){
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