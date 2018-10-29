<template>
    <div class="app-container">
        <div class="filter-container">
            <sticky class-name="sub-navbar">
                <!--搜素区-->
                <el-col :span="6">
                    <el-select v-model="listQuery.idxViFiID" class="filter-item"
                               :placeholder="$t('table.tbViFiCtrlCmd.idxViFiID')" filterable remote
                               style="width:90%" clearable
                               @focus="switchIdxViFiID" :remote-method="remoteIdxViFiIDMethod"
                               :loading="selectLoading"
                               clearable>
                        <el-option v-for="item in idxViFiIDOptions" :key="item.value" :label="item.label"
                                   :value="item.value"/>
                    </el-select>
                </el-col>

                <el-col :span="6">
                    <el-select v-model="listQuery.cmd" :placeholder="$t('table.tbViFiCtrlCmd.cmd')" clearable
                                collapse-tags
                               style="width:  90%" class="filter-item">
                        <el-option v-for="item in cmdOptions" :key="item.key" :label="item.name"
                                   :value="item.key"/>
                    </el-select>
                </el-col>

                <el-col :span="6">
                    <el-select v-model="listQuery.status" :placeholder="$t('table.tbViFiCtrlCmd.status')" clearable
                                collapse-tags
                               style="width:  90%" class="filter-item">
                        <el-option v-for="item in statusOptions" :key="item.key" :label="item.name"
                                   :value="item.key"/>
                    </el-select>
                </el-col>

                <!--操作组件-->
                <operationsTemplate
                        :operations="operations"
                        :downloadLoading="downloadLoading"
                        @handleRefresh="handleRefresh"
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

    import simpleTableTemplate from '@/views/table/customTable/simpleTableTemplate'
    import operationsTemplate from '@/views/table/customTable/operationsTemplate'
    import Sticky from '@/components/Sticky'
    import {fetchCmd} from '@/api/vifi'
    import {vifiS2} from '@/api/select'
    import {trafficFormat, toDecimals,iccidFM} from '@/filters/index'
    import {
        renderHeadSort, getList, debounce
    } from '@/utils/tableCustom'


    const cmdOptions = [
        {key: 'LOG', name: '获取日志'},
        {key: 'DEV', name: '修改设备'},
        {key: 'SHUTDOWN', name: '远程关机'},
        {key: 'REBOOT', name: '远程重启'},
    ]
    const statusOptions=[
        {key: '0', name: '待发送',style:'default'},
        {key: '1', name: '已发送',style:'success'},
        {key: '2', name: '队列中',style:'default'},
        {key: '9', name: '已回复',style:'success'},
        {key: '10', name: '成功',style:'success'},
        {key: '11', name: '失败',style:'danger'},
        {key: '12', name: '超时',style:'warning'},
    ]
    const cmdKeyValue = cmdOptions.reduce((acc, cur) => {
        acc[cur.key] = cur.name
        return acc
    }, {})
    const  statusKeyValue = statusOptions.reduce((acc, cur) => {
        acc[cur.key] = cur.name
        return acc
    }, {})

    const  statusStyleValue = statusOptions.reduce((acc, cur) => {
        acc[cur.key] = cur.style
        return acc
    }, {})

    export default {
        name: "vifiDevCmd",
        components: {
            simpleTableTemplate,
            operationsTemplate,
            Sticky
        },
        data(){
            return {
                prefix:'table.tbViFiCtrlCmd.',
                tableKey: 'keyCtrlCmdID',
                tableList: [
                    {name: 'keyCtrlCmdID', type: 'text', expand: true},
                    {name: 'idxViFiID', width: {length: '280'}, type: 'text', show: true},
                    {name: 'cmd', width: {length: '180'}, type: 'text', show: true},
                    {name: 'status', width: {length: '180'}, type: 'tag', show: true},
                    {name: 'params', width: {length: 280,min:true}, show: true},
                    {name: 'retry', expand: true},
                    {name: 'effectDate', expand: true},

                    {name: 'ineffectDate',expand: true},
                    {name: 'duration',  expand: true},
                    {name: 'sendTime', width: {length: '200'}, type: 'date', show: true},

                    {name: 'respTime', width: {length: '200'},type: 'date', show: true},
                    {name: 'mdfTm', type: 'text', expand: true},
                    {name: 'mdfBy', expand: true},
                    {name: 'crtTm',  width: {length: '200'},type: 'date', show: true},
                    {name: 'crtBy',expand: true},
                ],
                check: false,
                expand: true,
                operations: [],
                list: [],
                total: null,
                listLoading: true,
                listQuery: {
                    page: 1,
                    offset: 0,
                    limit: 20,
                    orderList: [],
                    idxViFiID: undefined,
                    cmd: undefined,
                    status:undefined,
                },
                idxViFiIDQuery: {
                    query: '',
                    ownerId: 'eu.'
                },
                respCodeQuery: {
                    query: '',
                    ownerId: 'eu.'
                },
                cmdOptions:cmdOptions,
                statusOptions:statusOptions,
                idxViFiIDOptions:[],
                idxViFiIDInitOptions:[],
                selectLoading:false,
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
                let obj ;
                for (let i = 0; i < computedList.length; i++) {
                    let tags = {};
                    let tips = {};
                    //需要变化的才修改
                    obj = JSON.parse(JSON.stringify(computedList[i]));
                    obj.cmd=cmdKeyValue[obj.cmd]
                    tags.status=statusStyleValue[obj.status]
                    obj.status=statusKeyValue[obj.status]
                    obj.tags = tags
                    obj.tips = tips
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
        mounted(){
            vifiS2(this.idxViFiIDQuery).then(response => {
                const S2Data = response.data.data.items;
                this.idxViFiIDInitOptions = S2Data.map(item => {
                    return {value: item.id, label: item.text};
                });
                this.idxViFiIDOptions = this.idxViFiIDInitOptions;
            })
        },
        methods: {
            getList() {
                getList.call(this, fetchCmd)
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
                    idxViFiID: undefined,
                    cmd: undefined,
                    status:undefined,
                }
            },

            remoteIdxViFiIDMethod(query) {
                //点击并不会触发远程查询时间，只有输入时才会触发
                if (query !== '') {
                    this.selectLoading = true;
                    this.idxViFiIDQuery.query = query,

                        vifiS2(this.idxViFiIDQuery).then(response => {
                            this.selectLoading = false;
                            const S2Data = response.data.data.items;
                            this.idxViFiIDOptions = S2Data.map(item => {
                                return {value: item.id, label: item.text};
                            });
                        }).catch(r => {
                            this.selectLoading = false
                        })
                }
            },
            switchIdxViFiID(){
                this.idxViFiIDOptions = this.idxViFiIDInitOptions
            },

        }

    }

</script>

<style>

    .demo-table-expand label{
        width: 135px;
    }

</style>