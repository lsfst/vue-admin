<template>
    <div class="app-container">
        <div class="filter-container">
            <sticky class-name="sub-navbar">
                <!--搜素区-->
                <el-col :span="6">
                    <el-input :placeholder="$t('table.tbPkgCountDaily.idxUserSuiteId')" clearable
                              v-model="listQuery.idxUserSuiteId"
                              prefix-icon="el-icon-search" style="width: 90%;" class="filter-item"/>
                </el-col>
                <el-col :span="6">
                    <div class="el-date-editor el-range-editor el-input__inner el-range-editor--medium"
                         style="width: 90%;">
                        <input :placeholder="$t('table.tbPkgCountDaily.gte_cntDataSum')" class="el-range-input"
                               v-model="listQuery.gte_cntDataSum">
                        <span class="el-range-separator">~</span>
                        <input :placeholder="$t('table.tbPkgCountDaily.lte_cntDataSum')" class="el-range-input"
                               v-model="listQuery.lte_cntDataSum">
                    </div>
                </el-col>
                <el-col :span="6">
                    <el-date-picker
                            v-model="listQuery.countDate"
                            type="daterange"
                            style="width: 90%"
                            range-separator="~"
                            :start-placeholder="$t('table.countDate')"
                            :end-placeholder="$t('table.countDate')">
                    </el-date-picker>
                </el-col>
                <el-col :span="6">
                    <el-date-picker
                            v-model="listQuery.crtTm"
                            type="daterange"
                            style="width: 90%"
                            range-separator="~"
                            :start-placeholder="$t('table.crtTm')"
                            :end-placeholder="$t('table.crtTm')">
                    </el-date-picker>
                </el-col>
                <!--操作组件-->
                <operationsTemplate
                        :operations="operations"
                        :downloadLoading="downloadLoading"
                        @handleRefresh="handleRefresh"
                        @handleDownload="handleDownload"
                ></operationsTemplate>
            </sticky>
        </div>
        <div>
            <!--表格组件-->
            <simpleTableTemplate
                    :list-loading="listLoading"
                    :table-key="tableKey"
                    :expand="expand"
                    :prefix="prefix"
                    :table-list="tableList"
                    :computed-lists="computedLists"
                    @renderSort="renderSort"
                    @tableRowClassName="tableRowClassName"
            ></simpleTableTemplate>
            <!--翻页-->
            <div class="pagination-container">
                <el-pagination :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                               :total="total" background layout="total, sizes, prev, pager, next, jumper"
                               @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
            </div>
        </div>
    </div>
</template>

<script>
    //最简单的页面代码控制在200行：实际上大多都是复制，但是由于实例不同只能这样

    //子组件
    import simpleTableTemplate from '@/views/table/customTable/simpleTableTemplate'
    import operationsTemplate from '@/views/table/customTable/operationsTemplate'
    import Sticky from '@/components/Sticky'
    //axios api
    import {fetchMonthly} from '@/api/pkgDaily'
    //数据处理
    import {trafficFormat, toDecimals} from '@/filters/index'
    //通用call方法
    import {
        handleDownload, renderHeadSort, getList, debounce
    } from '@/utils/tableCustom'

    export default {
        name: "packageMonthly",
        components: {
            simpleTableTemplate,
            operationsTemplate,
            Sticky
        },
        data(){
            return {
                prefix:'table.tbPkgCountMonthly.',
                tableKey: 'keyCntID',
                tableList: [
                    {name: 'idxUserSuiteId', width: {length: '160'}, type: 'text', show: true},
                    {name: 'countDate', width: {length: '200'}, type: 'date', show: true},
                    {name: 'cntDataSum', width: {length: '160'}, type: 'tag', style: {width: '80px'}, show: true},
                    {name: 'dataCost', width: {length: '160',}, type: 'text', show: true},
                    {name: 'cntTimes', width: {length: '180'}, type: 'text', show: true},
                    {name: 'crtTm', width: {length: '200'}, type: 'date', sort: true, show: true},
                    {name: 'crtBy', width: {length: '120'}, type: 'text', show: true},
                    {name: 'mdfTm', width: {length: '200'}, type: 'date', show: true},
                    {name: 'mdfBy', width: {length: '120'}, type: 'text', show: true},
                ],
                check: false,
                expand: false,
                operations: ['download'],
                list: [],
                total: null,
                listLoading: true,
                listQuery: {
                    page: 1,
                    offset: 0,
                    limit: 20,
                    orderList: [],
                    idxUserSuiteId: undefined,
                    countDate: undefined,
                    gte_cntDataSum: undefined,
                    lte_cntDataSum: undefined,
                    crtTm: [],
                    countDate:[]
                },
                downloadLoading: false,
                lastDebounce: undefined,
                lastModifyTm: undefined
            }
        },
        created() {
            this.getList()
            this.lastModifyTm = (new Date()).getTime()
        },
        computed: {
            computedLists: function () {
                let computedList = this.list;
                let obj = new Object();
                for (let i = 0; i < computedList.length; i++) {
                    let tags = new Object();
                    //需要变化的才修改
                    obj = computedList[i];
                    tags.cntDataSum = obj.cntDataSum > 0 ? (obj.cntDataSum < 1000000 ? "info" : "blue") : "danger";
                    obj.cntDataSum = trafficFormat(obj.cntDataSum);
                    obj.dataCost = toDecimals(obj.dataCost / 1000, 3);
                    obj.tags = tags
                    computedList[i].showData  = obj
                }
                return computedList
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
            }
        },
        methods: {
            getList() {
                getList.call(this, fetchMonthly)
            },
            handleFilter() {
                this.listQuery.page = 1
                this.listQuery.offset = (this.listQuery.page - 1) * this.listQuery.limit
                this.getList()
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
            renderSort(h, {column, $index}, index, name) {
                return renderHeadSort.call(this, h, {column, $index}, index, name)
            },
            tableRowClassName({row, rowIndex}) {
                return '';
            },
            handleRefresh() {
                this.listQuery = {
                    page: 1,
                    offset: 0,
                    limit: 20,
                    orderList: [],
                    idxUserSuiteId: undefined,
                    countDate: undefined,
                    cntDataSum: undefined,
                    crtTm: [],
                    countDate:[]
                }
            },
            handleDownload() {
                const tHeader = ['idxUserSuiteId', 'countDate', 'cntDataSum', 'dataCost', 'cntTimes', 'crtTm','crtBy','mdfTm','mdfBy']
                handleDownload.call(this, tHeader, fetchMonthly)
            },
        }

    }

</script>