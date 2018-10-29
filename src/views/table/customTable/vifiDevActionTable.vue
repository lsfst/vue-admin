<template>
    <div class="app-container">
        <div class="filter-container">
            <sticky class-name="sub-navbar">
                <!--搜素区-->
                <el-col :span="6">
                    <el-select v-model="listQuery.idxViFiID" class="filter-item"
                               :placeholder="$t('table.tbViFiAction.idxViFiID')" filterable remote
                               style="width:90%" clearable
                               @focus="switchIdxViFiID" :remote-method="remoteIdxViFiIDMethod"
                               :loading="selectLoading"
                               clearable>
                        <el-option v-for="item in idxViFiIDOptions" :key="item.value" :label="item.label"
                                   :value="item.value"/>
                    </el-select>
                </el-col>

                <el-col :span="6">
                    <el-input :placeholder="$t('table.tbViFiAction.idxICCID')" v-model="listQuery.idxICCID" clearable
                              prefix-icon="el-icon-search" style="width:  90%;" class="filter-item"/>
                </el-col>

                <el-col :span="6">
                    <el-select v-model="listQuery.in_cardType" :placeholder="$t('table.tbViFiAction.cardType')" clearable
                                collapse-tags multiple
                               style="width:  90%" class="filter-item">
                        <el-option v-for="item in cardTypeOptions" :key="item.key" :label="item.name"
                                   :value="item.key"/>
                    </el-select>
                </el-col>

                <el-col :span="6">
                    <el-select v-model="listQuery.in_reqAct" :placeholder="$t('table.tbViFiAction.reqAct')" clearable
                               multiple collapse-tags
                               style="width:  90%" class="filter-item">
                        <el-option v-for="item in reqActOptions" :key="item.key" :label="item.name"
                                   :value="item.key"/>
                    </el-select>
                </el-col>

                <el-col :span="6">
                    <el-input :placeholder="$t('table.tbViFiAction.reqIP')" v-model="listQuery.reqIP" clearable
                              prefix-icon="el-icon-search" style="width:  90%;" class="filter-item"/>
                </el-col>

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
                    <el-date-picker
                            v-model="listQuery.reqDate"
                            type="daterange"
                            style="width: 90%"
                            range-separator="~"
                            :start-placeholder="$t('table.tbViFiAction.reqDate')"
                            :end-placeholder="$t('table.tbViFiAction.reqDate')">
                    </el-date-picker>
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
    import {fetchAction} from '@/api/vifi'
    import {vifiS2,respCodeS2} from '@/api/select'
    import {trafficFormat, toDecimals,iccidFM} from '@/filters/index'
    import {
        renderHeadSort, getList, debounce
    } from '@/utils/tableCustom'



    const reqActOptions = [
        {key: 'GET', name: '拿卡'},
        {key: 'KEEP_ALIVE', name: '心跳'},
        {key: 'VCLOSE', name: '下线'},
        {key: 'VOPEN', name: '拨号'},
        {key: 'VUPDATE', name: '计费'},
    ]
    const cardTypeOptions=[
        {key: 'R', name: '远程卡'},
        {key: 'L', name: '本地卡'},
    ]
    const reqActKeyValue = reqActOptions.reduce((acc, cur) => {
        acc[cur.key] = cur.name
        return acc
    }, {})
    const  cardTypeKeyValue = cardTypeOptions.reduce((acc, cur) => {
        acc[cur.key] = cur.name
        return acc
    }, {})

    export default {
        name: "vifiDevAction",
        components: {
            simpleTableTemplate,
            operationsTemplate,
            Sticky
        },
        data(){
            return {
                prefix:'table.tbViFiAction.',
                tableKey: 'keyActionID',
                tableList: [
                    {name: 'keyActionID', width: {length: '160'}, type: 'text', show: true},
                    {name: 'idxViFiID', width: {length: '200'}, type: 'text', show: true},
                    {name: 'idxICCID', width: {length: '160'}, type: 'html', show: true},
                    {name: 'cardType', width: {length: '160',}, type: 'text', expand: true},
                    {name: 'groupName', width: {length: '180'}, type: 'text', expand: true},
                    {name: 'reqAct', width: {length: '180'}, type: 'tip', show: true},
                    {name: 'reqIP', width: {length: '180'}, type: 'text', expand: true},

                    {name: 'reqAreaId', type: 'text', expand: true},
                    {name: 'respCode', width: {length: '180'}, type: 'tag', show: true},
                    {name: 'respReason', width: {length: '180',min:true}, type: 'tip', show: true},

                    {name: 'sessionId',type: 'text', expand: true},
                    {name: 'version', type: 'text', expand: true},
                    {name: 'extv1', expand: true},
                    {name: 'extv2',  expand: true},
                    {name: 'extv3',expand: true},
                    {name: 'reqDate',  width: {length: '180'}, type: 'date',sort:true, show:true},
                    {name: 'reqTime',  expand:true},

                    {name: 'handTime', width: {length: '120'}, type: 'html',sort:true, show: true},
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
                    idxICCID: undefined,
                    in_cardType:[],
                    in_reqAct:[],
                    reqIP:undefined,
                    respCode:undefined,
                    reqDate: [],
                },
                idxViFiIDQuery: {
                    query: '',
                    ownerId: 'eu.'
                },
                respCodeQuery: {
                    query: '',
                    ownerId: 'eu.'
                },
                cardTypeOptions:cardTypeOptions,
                reqActOptions:reqActOptions,
                idxViFiIDOptions:[],
                idxViFiIDInitOptions:[],
                respCodeOptions:[],
                respCodeInitOptions:[],
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
                    let tags = new Object();
                    let tips = new Object();
                    //需要变化的才修改
                    obj = JSON.parse(JSON.stringify(computedList[i]));
                    obj.idxICCID = iccidFM(obj.idxICCID);
                    tips.reqAct=obj.reqAct;
                    obj.reqAct = reqActKeyValue[obj.reqAct];
                    tags.respCode=obj.respCode?(obj.respCode==0 || obj.respCode==200 ?'success':'danger') :'default';
                    tips.respReason=obj.respReason
                    if(obj.respReason){
                        let reason = obj.respReason.split(" ")[0];
                        reason = this.$t("respReason."+reason) || "";
                        if(reason.indexOf("(")>=0){
                            reason=reason.substring(0,reason.lastIndexOf("("))
                        }
                        obj.respReason=reason

                    }
                    obj.cardType=cardTypeKeyValue[obj.cardType]
                    obj.handTime=(obj.handTime && obj.handTime>2000)?"<span style='color:red;'>"+obj.handTime+"</span>":obj.handTime
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
            }),
                respCodeS2(this.respCodeQuery).then(response => {
                    const S2Data = response.data.data.items;
                    this.respCodeInitOptions = S2Data.map(item => {
                        return {value: item.id, label: item.text};
                    });
                    this.respCodeOptions = this.respCodeInitOptions;
                })
        },
        methods: {
            getList() {
                getList.call(this, fetchAction)
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
                    idxICCID: undefined,
                    cardType:undefined,
                    reqAct:undefined,
                    reqIP:undefined,
                    respCode:undefined,
                    reqDate: [],
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
            remoteRespCodeMethod(query) {
                if (query !== '') {
                    this.selectLoading = true;
                    this.respCodeQuery.query = query,

                        respCodeS2(this.respCodeQuery).then(response => {
                            this.selectLoading = false;
                            const S2Data = response.data.data.items;
                            this.respCodeOptions = S2Data.map(item => {
                                return {value: item.id, label: item.text};
                            });
                        }).catch(r => {
                            this.selectLoading = false
                        })
                }
            },
            switchRespCode(){
                this.respCodeOptions = this.respCodeInitOptions
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