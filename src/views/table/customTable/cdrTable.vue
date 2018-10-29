<template>
    <div class="app-container">

        <div class="filter-container">
            <sticky class-name="sub-navbar">

                <el-col :span="6">
                    <el-input :placeholder="$t('table.tbCDR.idxViFiID')" v-model="listQuery.idxViFiID"
                              clearable
                              prefix-icon="el-icon-search" style="width: 90%;" class="filter-item"/>
                </el-col>

                <el-col :span="6">
                    <el-input :placeholder="$t('table.tbCDR.idxSimCardID')" v-model="listQuery.idxSimCardID"
                              clearable
                              prefix-icon="el-icon-search" style="width: 90%;" class="filter-item"/>
                </el-col>

                <el-col :span="6">
                    <el-select v-model="listQuery.idxVSWID" class="filter-item"
                               :placeholder="$t('table.tbCDR.idxVSWID')" filterable remote
                               style="width:90%" clearable
                               @focus="switchIdxVSWID" :remote-method="remoteIdxVSWIDMethod"
                               :loading="selectLoading"
                               clearable>
                        <el-option v-for="item in idxVSWIDOptions" :key="item.value" :label="item.label"
                                   :value="item.value"/>
                    </el-select>
                </el-col>


                <el-col :span="6">
                    <el-select v-model="listQuery.area" class="filter-item"
                               :placeholder="$t('table.tbCDR.area')" filterable remote
                               style="width:90%" clearable
                               @focus="switchArea" :remote-method="remoteAreaMethod"
                               :loading="selectLoading"
                               clearable>
                        <el-option v-for="item in areaOptions" :key="item.value" :label="item.label"
                                   :value="item.value"/>
                    </el-select>
                </el-col>

                <operationsTemplate
                        :operations="operations"
                        :download-loading="downloadLoading"
                        @handleDownload="handleDownload"
                        @handleRefresh="handleRefresh"
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
            ></simpleTableTemplate>

            <div class="pagination-container">
                <el-pagination :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                               :total="total" background layout="total, sizes, prev, pager, next, jumper"
                               @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
            </div>
        </div>

    </div>
</template>

<script>
    import simpleTableTemplate from '@/views/table/customTable/simpleTableTemplate'
    import operationsTemplate from '@/views/table/customTable/operationsTemplate'
    import Sticky from '@/components/Sticky'

    //import具体方法时，必须{}包裹
    import {fetch} from '@/api/cdr'
    import {areaS2,vswS2} from '@/api/select'
    import {parseTime} from '@/utils'
    import {formatTimeMSec2Day} from '@/filters/index'
    import {_getValidateRules} from '@/utils/rules'
    import {
        tableSortDown, tableSortUp, renderHeadSort, getList, selectionChange, selectionAll,
        debounce,computedFmt,remoteQuery,remoteInitQuery,handleDownload
    } from '@/utils/tableCustom'

    const cdrTypeOptions = [
        {key: 'N', name: '在线呼叫'},
        {key: 'C', name: '落地呼叫'},
        {key: 'B', name: '落地回拨'},
        {key: 'G', name: 'GoIP 呼叫'},
        {key: 'K', name: 'GoIP 回拨'},
        {key: 'S', name: 'GoIP 短信'},
        {key: 'D', name: '混用套餐'},
        {key: 'L', name: '本地卡套餐'},
        {key: 'R', name: '远程卡套餐'},
        {key: 'V', name: '数据上网'},
    ]

    const cdrTypeKeyValue = cdrTypeOptions.reduce((acc, cur) => {
        acc[cur.key] = cur.name
        return acc
    }, {})

    export default {
        name: 'cdrTable',
        components: {Sticky,simpleTableTemplate,operationsTemplate},
        data() {
            return {
                prefix:'table.tbCDR.',
                tableKey: 'keyCDRID',
                tableList: [
                    {name: 'keyCDRID', width: {length: 100},sort:true,show: true},
                    {name: 'cdrType',show:true,width:{length:150},format:{comData:cdrTypeKeyValue}},
                    {name: 'idxViFiID',show:true, width: {length: 200}},
                    {name: 'idxSimCardID',width:{length:220},type:'html',format:{iccidFM:true},show: true},
                    {name: 'idxRateId',expand: true},
                    {name: 'suiteRateIds', expand: true},
                    {name: 'dataTraffic',format:{trafficFM:true}, sort:true,type:"tag",tagData:function(value){
                        return value> 0 ? (value<1000000?"info":"warning") : "danger";
                    },width: {length: 160},show: true},
                    {name: 'uuwifiSessId',expand: true},
                    {name: 'costCash',format:{decimals:2,ratio:1000},width: {length: 150},show: true},
                    {name: 'costReward',expand: true},
                    {name: 'idxVSWID',show:true, width: {length:150,min:true}},

                    {name: 'idxSimPID',expand: true},
                    {name: 'idxVAPPID',  expand: true},
                    {name: 'countryCode',format:{areaFM:true},  expand: true},
                    {name: 'area',  show: true,width: {length: 200},type:'html',format:{areaFM:true}},
                    {name: 'crtTm', show: true,type:'date',width: {length: 200}},
                    {name: 'crtBy',  expand: true},
                ],
                check: false,
                expand: true,
                operations: ['download'],
                list: [],
                total: null,
                listLoading: true,
                listQuery: {
                    page: 1,
                    offset: 0,
                    limit: 20,
                    orderList: []
                },
                idxVSWIDOptions: [],
                idxVSWIDInitOptions: [],
                areaOptions:[],
                areaInitOptions:[],
                downloadLoading: false,
                selectLoading: false,
                lastDebounce: undefined,
                lastModifyTm: undefined,
            }
        },
        created() {
            this.getList()
            this.lastModifyTm = (new Date()).getTime()
        },
        computed: {
            computedLists: function () {
                return computedFmt.call(this,this.list,this.tableList)
            }
        },
        mounted(){
            remoteInitQuery.call(this, vswS2, "idxVSWID")
            remoteInitQuery.call(this, areaS2,"area","area")
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
            handleRefresh() {
                this.listQuery = {
                    page: 1,
                    offset: 0,
                    limit: 20,
                    orderList: []
                }
            },
            handleDownload() {
                const tHeader = this.tableList.map(function (value) {
                    return value.name;
                })
                handleDownload.call(this, tHeader, fetch)
            },
            renderSort(h, {column, $index}, index, name) {
                return renderHeadSort.call(this, h, {column, $index}, index, name)
            },
            remoteIdxVSWIDMethod(query){
                remoteQuery.call(this, vswS2,query, "idxVSWID")
            },
            remoteAreaMethod(query){
                remoteQuery.call(this, areaS2,query, "area","area")
            },
            switchIdxVSWID(){
                this.idxVSWIDOptions = this.idxVSWIDInitOptions
            },
            switchArea(){
                this.areaOptions = this.areaInitOptions
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
        }
    }
</script>

<style>

    .demo-table-expand label{
        width: 135px;
    }

</style>