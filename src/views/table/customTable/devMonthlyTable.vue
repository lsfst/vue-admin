<template>
    <div class="app-container">

        <div class="filter-container">
            <sticky class-name="sub-navbar">

                <el-col :span="6">
                    <div class="el-date-editor el-range-editor el-input__inner el-range-editor--medium"
                         style="width: 90%;">
                        <input :placeholder="$t('table.tbUUWiFiCountDaily.gte_cntDataSum')" class="el-range-input"
                               v-model="listQuery.gte_cntDataSum">
                        <span class="el-range-separator">~</span>
                        <input :placeholder="$t('table.tbUUWiFiCountDaily.lte_cntDataSum')" class="el-range-input"
                               v-model="listQuery.lte_cntDataSum">
                    </div>
                </el-col>


                <el-col :span="6">
                    <div class="el-date-editor el-range-editor el-input__inner el-range-editor--medium"
                         style="width: 90%;">
                        <input :placeholder="$t('table.tbUUWiFiCountDaily.gte_cntLocalDataSum')" class="el-range-input"
                               v-model="listQuery.gte_cntLocalDataSum">
                        <span class="el-range-separator">~</span>
                        <input :placeholder="$t('table.tbUUWiFiCountDaily.lte_cntLocalDataSum')" class="el-range-input"
                               v-model="listQuery.lte_cntLocalDataSum">
                    </div>
                </el-col>

                <el-col :span="6">
                    <div class="el-date-editor el-range-editor el-input__inner el-range-editor--medium"
                         style="width: 90%;">
                        <input :placeholder="$t('table.tbUUWiFiCountDaily.gte_cntRemoteDataSum')" class="el-range-input"
                               v-model="listQuery.gte_cntRemoteDataSum">
                        <span class="el-range-separator">~</span>
                        <input :placeholder="$t('table.tbUUWiFiCountDaily.lte_cntRemoteDataSum')" class="el-range-input"
                               v-model="listQuery.lte_cntRemoteDataSum">
                    </div>
                </el-col>

                <el-col :span="6">
                    <el-input :placeholder="$t('table.tbUUWiFiCountDaily.idxViFiID')" v-model="listQuery.idxViFiID"
                              clearable
                              prefix-icon="el-icon-search" style="width: 90%;" class="filter-item"/>
                </el-col>

                <el-col :span="6">
                    <el-date-picker
                            v-model="listQuery.countDate"
                            type="daterange"
                            style="width: 90%"
                            format="yyyy-MM-dd"
                            range-separator="~"
                            :start-placeholder="$t('table.tbUUWiFiCountDaily.countDate')"
                            :end-placeholder="$t('table.tbUUWiFiCountDaily.countDate')">
                    </el-date-picker>
                </el-col>

                <el-col :span="6">
                    <el-date-picker
                            v-model="listQuery.crtTm"
                            type="daterange"
                            style="width: 90%"
                            range-separator="~"
                            :start-placeholder="$t('table.tbUUWiFiCountDaily.crtTm')"
                            :end-placeholder="$t('table.tbUUWiFiCountDaily.crtTm')">
                    </el-date-picker>
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
    import {fetchMonthly} from '@/api/devDaily'
    import {parseTime} from '@/utils'
    import {formatTimeMSec2Day} from '@/filters/index'
    import {_getValidateRules} from '@/utils/rules'
    import {
        tableSortDown, tableSortUp, renderHeadSort, getList, selectionChange, selectionAll,
        debounce,computedFmt,remoteQuery,remoteInitQuery,handleDownload
    } from '@/utils/tableCustom'

    export default {
        name: 'devMonthlyTable',
        components: {Sticky,simpleTableTemplate,operationsTemplate},
        data() {
            return {
                prefix:'table.tbUUWiFiCountDaily.',
                tableKey: 'idxViFiID',
                tableList: [
                    {name: 'idxViFiID', width: {length: 180},show: true},
                    {name: 'countDate',show:true,type:"date", width: {length: 180}},
                    {name: 'cntDataSum',show:true,sort:true,width:{length:160},type:'tag',format:{trafficFM:true},tagData:function (value) {
                       return value> 0 ? (value<1000000?"primary":"warning") : "danger";
                    }},
                    {name: 'cntLocalDataSum',sort:true,width:{length:160},format:{trafficFM:true},show: true},
                    {name: 'cntRemoteDataSum',sort:true,width:{length:160},format:{trafficFM:true},show: true},

                    {name: 'cost',format:{ratio:1000,decimals:2},show: true,width: {length: 160}},
                    {name: 'deviceDur',  show: true,width: {length: 200},format:{fmt:function (value) {
                        return formatTimeMSec2Day(value)
                    }}},
                    {name: 'cntTimes',  show: true,width: {length: 200}},
                    {name: 'crtTm',  show: true,type:"date",width: {length: 200}},
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
                lastUseCodeOptions: [],
                lastUseCodeInitOptions: [],
                idxAgentIDOptions:[],
                idxAgentIDInitOptions:[],
                lastUseDescOptions:[],
                lastUseDescInitOptions:[],
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
                getList.call(this, fetchMonthly)
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
                //js赋值无法触发事件:1.手动触发2.watch监听
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
                handleDownload.call(this, tHeader, fetchMonthly)
            },
            renderSort(h, {column, $index}, index, name) {
                return renderHeadSort.call(this, h, {column, $index}, index, name)
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
        width: 140px;
    }

</style>
