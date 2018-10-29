<template>
    <div class="app-container">

        <div class="filter-container">
            <sticky class-name="sub-navbar">

                <el-col :span="6">
                    <el-input :placeholder="$t('table.tbSIMCountDaily.idxSIMId')" v-model="listQuery.idxSIMId"
                              clearable
                              prefix-icon="el-icon-search" style="width: 90%;" class="filter-item"/>
                </el-col>

                <el-col :span="6">
                    <el-select v-model="listQuery.idxSIMGrpID" class="filter-item"
                               :placeholder="$t('table.tbSIMCountDaily.idxSIMGrpID')" filterable remote
                               style="width:90%" clearable
                               @focus="switchIdxSIMGrpID" :remote-method="remoteIdxSIMGrpIDMethod"
                               :loading="selectLoading"
                               clearable>
                        <el-option v-for="item in idxSIMGrpIDOptions" :key="item.value" :label="item.label"
                                   :value="item.value"/>
                    </el-select>
                </el-col>

                <el-col :span="6">
                    <el-date-picker
                            v-model="listQuery.countDate"
                            type="daterange"
                            style="width: 90%"
                            format="yyyy-MM-dd"
                            range-separator="~"
                            :start-placeholder="$t('table.tbSIMCountDaily.countDate')"
                            :end-placeholder="$t('table.tbSIMCountDaily.countDate')">
                    </el-date-picker>
                </el-col>

                <el-col :span="6">
                    <el-select v-model="listQuery.simType" :placeholder="$t('table.tbSIMCountDaily.simType')" clearable
                                collapse-tags style="width:  90%" class="filter-item">
                        <el-option v-for="item in simTypeOptions" :key="item.key" :label="item.name" :value="item.key"/>
                    </el-select>
                </el-col>

                <el-col :span="6">
                    <el-select v-model="listQuery.idxAreaId" class="filter-item"
                               :placeholder="$t('table.tbSIMCountDaily.idxAreaId')" filterable remote
                               style="width:90%" clearable
                               @focus="switchIdxAreaId" :remote-method="remoteIdxAreaIdMethod"
                               :loading="selectLoading"
                               clearable>
                        <el-option v-for="item in idxAreaIdOptions" :key="item.value" :label="item.label"
                                   :value="item.value"/>
                    </el-select>
                </el-col>

                <el-col :span="6">
                    <div class="el-date-editor el-range-editor el-input__inner el-range-editor--medium"
                         style="width: 90%;">
                        <input :placeholder="$t('table.tbSIMCountDaily.gte_cntDataSum')" class="el-range-input"
                               v-model="listQuery.gte_cntDataSum">
                        <span class="el-range-separator">~</span>
                        <input :placeholder="$t('table.tbSIMCountDaily.lte_cntDataSum')" class="el-range-input"
                               v-model="listQuery.lte_cntDataSum">
                    </div>
                </el-col>


                <el-col :span="6">
                    <el-date-picker
                            v-model="listQuery.crtTm"
                            type="daterange"
                            style="width: 90%"
                            range-separator="~"
                            :start-placeholder="$t('table.tbSIMCountDaily.crtTm')"
                            :end-placeholder="$t('table.tbSIMCountDaily.crtTm')">
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
    import {fetchMonthly} from '@/api/simcard'
    import {SCGroupS2,areaS2} from '@/api/select'
    import {parseTime} from '@/utils'
    import {formatTimeMSec2Day} from '@/filters/index'
    import {_getValidateRules} from '@/utils/rules'
    import {
        tableSortDown, tableSortUp, renderHeadSort, getList, selectionChange, selectionAll,
        debounce,computedFmt,remoteQuery,remoteInitQuery,handleDownload
    } from '@/utils/tableCustom'

    const simTypeOptions = [
        {key: 0, name: '未知'},
        {key: 1, name: '流量卡'},
        {key: 2, name: '启动卡'},
        {key: 3, name: '本地卡'},
    ]

    const simTypeKeyValue = simTypeOptions.reduce((acc, cur) => {
        acc[cur.key] = cur.name
        return acc
    }, {})

    export default {
        name: 'simMonthlyTable',
        components: {Sticky,simpleTableTemplate,operationsTemplate},
        data() {
            return {
                prefix:'table.tbSIMCountDaily.',
                tableKey: 'keyCDID',
                tableList: [
                    {name: 'idxSIMId', width: {length: 250},type:'html',format:{iccidFM:true},show: true},
                    {name: 'idxSIMGrpID',show:true,width:{length:200}},
                    {name: 'countDate',show:true,type:"date", width: {length: 200}},
                    {name: 'simType',width:{length:180},format:{comData:simTypeKeyValue},show: true},
                    {name: 'idxAreaId',width:{length:230,min:true},type:'html',format:{areaFM:true},show: true},
                    {name: 'cntDataDown', format:{trafficFM:true},width: {length: 160},expand: true},
                    {name: 'cntDataUp',format:{trafficFM:true}, width: {length: 160},expand: true},
                    {name: 'cntDataSum',sort:true,format:{trafficFM:true},width: {length: 202},type:'tag',tagData:function(value){
                        return  value> 0 ? (value<1000000?"info":"warning") : "danger";
                    },show: true},
                    {name: 'dataCost',format:{decimals:2,ratio:1000},width: {length: 200},show: true},
                    {name: 'cntTimes',format:{trafficFM:true},expand:true, width: {length:130}},

                    {name: 'crtTm',  show: true,type:'date',width: {length: 200}},
                    {name: 'crtBy',  expand: true},
                    {name: 'mdfTm',  expand: true},
                    {name: 'mdfBy',  expand: true},
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
                simTypeOptions:simTypeOptions,
                idxSIMGrpIDOptions: [],
                idxSIMGrpIDInitOptions: [],
                idxAreaIdOptions:[],
                idxAreaIdInitOptions:[],
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
            remoteInitQuery.call(this, SCGroupS2, "idxSIMGrpID")
            remoteInitQuery.call(this, areaS2,"idxAreaId","area")
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
            remoteIdxSIMGrpIDMethod(query){
                remoteQuery.call(this, SCGroupS2,query, "idxSIMGrpID")
            },
            remoteIdxAreaIdMethod(query){
                remoteQuery.call(this, areaS2,query, "idxAreaId","area")
            },
            switchIdxSIMGrpID(){
                this.idxSIMGrpIDOptions = this.idxSIMGrpIDInitOptions
            },
            switchIdxAreaId(){
                this.idxAreaIdOptions = this.idxAreaIdInitOptions
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
