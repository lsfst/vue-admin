<template>
    <div class="app-container">

        <div class="filter-container">
            <sticky class-name="sub-navbar">

                <el-col :span="6">
                    <el-select v-model="listQuery.idxAgentID" class="filter-item"
                               :placeholder="$t('table.tbSimPDevGrp.idxAgentID')" filterable remote
                               style="width:90%" clearable
                               @focus="switchIdxAgentID" :remote-method="remoteKeyIdxAgentIDMethod"
                               :loading="selectLoading"
                               clearable>
                        <el-option v-for="item in idxAgentIDOptions" :key="item.value" :label="item.label"
                                   :value="item.value"/>
                    </el-select>
                </el-col>

                <el-col :span="6">
                    <el-input :placeholder="$t('table.tbSimPDevGrp.groupName')" v-model="listQuery.groupName"
                              clearable
                              prefix-icon="el-icon-search" style="width: 90%;" class="filter-item"/>
                </el-col>

                <el-col :span="6">
                    <el-input :placeholder="$t('table.tbSimPDevGrp.remarks')" v-model="listQuery.remarks"
                              clearable
                              prefix-icon="el-icon-search" style="width: 90%;" class="filter-item"/>
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

                <el-form-item :label="$t('table.tbSimPDevGrp.groupName')" prop="groupName">
                    <el-input clearable v-model="temp.groupName"/>
                </el-form-item>

                <el-form-item :label="$t('table.tbSimPDevGrp.remarks')" prop="remarks">
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
    import {fetchGroup, createGroup, updateGroup, removeGroup} from '@/api/simp'
    import {agentS2} from '@/api/select'
    import {parseTime} from '@/utils'
    import {iccidFM, trafficFormat, toDecimals} from '@/filters/index'
    import {_getValidateRules} from '@/utils/rules'
    import {
        tableSortDown, tableSortUp, handleDelete, updateData, renderHeadSort, createData,handleCreate,countIds,
        handleUpdate, getList, selectionChange, selectionAll, areaFM, formatArea, debounce,computedFmt,remoteQuery,remoteInitQuery
    } from '@/utils/tableCustom'

    export default {
        name: 'simPDevGrpTable',
        components: {Sticky,simpleTableTemplate,operationsTemplate},
        data() {
            return {
                prefix:'table.tbSimPDevGrp.',
                tableKey: 'keyID',
                tableList: [
                    {name: 'keyID', width: {length: 160},show: true},
                    {name: 'groupName',show:true, width: {length: 240},vali:{required:true,strLen:[0,128]}},
                    {name: 'idxAgentID',show:true,width:{length:240}},
                    {name: 'remarks',show:true, width: {length: 300,min:true},vali:{strLen:[0,128]}},
                    {name: 'mdfTm',  show: true,width: {length: 200},type:'date'},
                    {name: 'mdfBy',width: {length: 150},show:true},
                    {name: 'crtTm',width: {length: 200},type:'date',show:true},
                    {name: 'crtBy',width: {length: 150},show:true}
                ],
                check: true,
                expand: false,
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
                idxAgentIDOptions: [],
                idxAgentIDInitOptions: [],
                editDisable: false,
                deleteDisable: true,
                checkedRows: [],
                temp: {
                    groupName:undefined,
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
            remoteInitQuery.call(this, agentS2, "idxAgentID")
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
                    groupName:undefined,
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
            remoteIdxAgentIDMethod(query){
                remoteInitQuery.call(this, agentS2,query, "idxAgentID")
            },
            switchIdxAgentID(){
                this.idxAgentIDOptions = this.idxAgentIDInitOptions
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
