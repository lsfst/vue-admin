<template>
    <div class="app-container">

        <div class="filter-container">
            <sticky class-name="sub-navbar">

                <el-col :span="6">
                    <el-select v-model="listQuery.respCode" class="filter-item"
                               :placeholder="$t('table.tbViFiAction.respCode')" filterable remote
                               style="width:90%" clearable
                               @focus="switchRespCode" :remote-method="remoteRespCodeMethod"
                               :loading="selectLoading"
                               clearable>
                        <el-option v-for="item in respCodeOptions" :key="item.value" :label="item.label"
                                   :value="item.value"/>
                    </el-select>
                </el-col>

                <el-col :span="6">
                    <el-input :placeholder="$t('table.tbViFiAction.idxViFiID')" v-model="listQuery.idxViFiID"
                              clearable
                              prefix-icon="el-icon-search" style="width: 90%;" class="filter-item"/>
                </el-col>

                <el-col :span="6">
                    <div class="el-date-editor el-range-editor el-input__inner el-range-editor--medium"
                         style="width: 90%;">
                        <input :placeholder="$t('table.tbViFiAction.gte_reqTime')" class="el-range-input"
                               v-model="listQuery.gte_reqTime">
                        <span class="el-range-separator">~</span>
                        <input :placeholder="$t('table.tbViFiAction.lte_reqTime')" class="el-range-input"
                               v-model="listQuery.lte_reqTime">
                    </div>
                </el-col>

                <el-col :span="6">
                    <el-date-picker
                            v-model="listQuery.reqDate"
                            type="daterange"
                            style="width: 90%"
                            range-separator="~"
                            :start-placeholder="$t('table.tbViFiAction.reqDate')"
                            :end-placeholder="$t('table.tbViFiAction.reqDate')">
                    </el-date-picker>
                </el-col>



                <operationsTemplate
                        :operations="operations"
                        :download-loading="downloadLoading"
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
    import {fetchAction} from '@/api/simp'
    import {respCodeS2} from '@/api/select'
    import {parseTime} from '@/utils'
    import {iccidFM, trafficFormat, toDecimals} from '@/filters/index'
    import {_getValidateRules} from '@/utils/rules'
    import {
        tableSortDown, tableSortUp, renderHeadSort, getList, selectionChange, selectionAll, areaFM, formatArea,
        debounce,computedFmt,remoteQuery,remoteInitQuery
    } from '@/utils/tableCustom'

    const reqActOptions=[
        {key: 'GSREG', name: '注册'},
        {key: 'SPUBLISH', name: '更新'},
        {key: 'VSWHB', name: '心跳'},
    ]

    const reqActKeyValue = reqActOptions.reduce((acc, cur) => {
        acc[cur.key] = cur.name
        return acc
    }, {})


    export default {
        name: 'simPDevActionTable',
        components: {Sticky,simpleTableTemplate,operationsTemplate},
        data() {
            return {
                prefix:'table.tbViFiAction.',
                tableKey: 'keyActionID',
                tableList: [
                    {name: 'keyActionID', width: {length: 160},show: true},
                    {name: 'idxViFiID',show:true, width: {length: 200}},
                    {name: 'reqAct',show:true,width:{length:160},type:'tip',format:{comData:reqActKeyValue},tips:function (value,row) {
                        if(row && row.reqAct){
                            let respReason= row.reqAct;
                            if(respReason){
                                value=respReason.split(" ")[0];
                            }
                        }else {
                            value="-";
                        }
                        return value;
                    }},
                    {name: 'reqIP', width: {length: 160},show: true},
                    {name: 'reqAreaId',show: true,width: {length: 160},format:{areaFM:true}},
                    {name: 'respCode', width: {length: 160},type:'tag',tagData:function(value){
                        let color;
                        if( value===0){
                            color = "success";
                        }else if(value===200){
                            color = "success";
                        }else if(value){
                            color="danger";
                        }else {
                            color="default";
                        }
                        return color
                    },show: true},
                    {name: 'respReason', width: {length: 160},show: true,format:{fmt:function (value) {
                        if(value){
                            let reason = value.split(" ")[0];
                            value = this.$t('respReason.'+reason) || "-";
                        }
                        return value;
                    }}},
                    {name: 'version',width: {length: 130},show: true},
                    {name: 'handTime',width: {length: 130},show: true,format:{fmt:function (value) {
                        if( value && value>2000){
                            return '<span style="color:red;">'+value+'</span>';
                        }
                        return value || "";
                    }}},
                    {name: 'reqTime',show:true, width: {length:130},type:'html',format:{fmt:function (value) {
                        if(value && value>180){
                            return "<span style='color:red'>" + value + "</span>";
                        }
                        return value || "";
                    }}},
                    {name: 'reqDate',  show: true,width: {length: 200,min:true},type:'date'},
                ],
                check: false,
                expand: false,
                operations: [],
                list: [],
                total: null,
                listLoading: true,
                listQuery: {
                    page: 1,
                    offset: 0,
                    limit: 20,
                    orderList: []
                },
                respCodeOptions: [],
                respCodeInitOptions: [],
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
            remoteInitQuery.call(this, respCodeS2, "respCode")
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
                getList.call(this, fetchAction)
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
            renderSort(h, {column, $index}, index, name) {
                return renderHeadSort.call(this, h, {column, $index}, index, name)
            },
            remoteRespCodeMethod(query){
                remoteInitQuery.call(this, respCodeS2,query, "respCode")
            },
            switchRespCode(){
                this.respCodeOptions = this.respCodeInitOptions
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
        width: 120px;
    }

</style>
