<template>
    <div class="app-container">

        <div class="filter-container">
            <sticky class-name="sub-navbar">

                <el-col :span="6">
                    <el-input :placeholder="$t('table.tbGlobalSIM.keyGlobalSIMID')" v-model="listQuery.keyGlobalSIMID"
                              clearable
                              prefix-icon="el-icon-search" style="width: 90%;" class="filter-item"/>
                </el-col>

                <el-col :span="6">
                    <el-select v-model="listQuery.idxGlobalSIMGrpID" class="filter-item"
                               :placeholder="$t('table.tbGlobalSIM.idxGlobalSIMGrpID')" filterable remote
                               style="width:90%" clearable
                               @focus="switchGlobalSIMGrp" :remote-method="remoteGlobalSIMGrpMethod"
                               :loading="selectLoading"
                               clearable>
                        <el-option v-for="item in globalSIMGrpOptions" :key="item.value" :label="item.label"
                                   :value="item.value"/>
                    </el-select>
                </el-col>

                <el-col :span="6">
                    <el-select v-model="listQuery.idxViFiID" class="filter-item"
                               :placeholder="$t('table.tbGlobalSIM.idxViFiID')" filterable remote
                               style="width:90%" clearable
                               @focus="switchVifi" :remote-method="remoteVifiMethod"
                               :loading="selectLoading"
                               clearable>
                        <el-option v-for="item in vifiOptions" :key="item.value" :label="item.label"
                                   :value="item.value"/>
                    </el-select>
                </el-col>

                <el-col :span="6">
                    <el-select v-model="listQuery.status" :placeholder="$t('table.tbGlobalSIM.status')" clearable
                               collapse-tags
                               style="width:  90%" class="filter-item">
                        <el-option v-for="item in statusOptions" :key="item.key" :label="item.name"
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

                <el-form-item v-if="dialogStatus=='create'" :label="$t('table.tbGlobalSIM.keyGlobalSIMID')" prop="keyGlobalSIMID">
                    <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" clearable v-model="temp.keyGlobalSIMID"/>
                </el-form-item>
                <el-form-item  v-if="dialogStatus=='create'">
                    <div class="el-form-item__error" style="display: inline;position: inherit" v-text="keyCount">
                    </div>
                    <input type="file" id="keyGlobalSIMID-fileElem" multiple="multiple" accept="text/plain"
                           style="display:none" @change="handleFiles()">
                    <label style="cursor:pointer;float:right;" for="keyGlobalSIMID-fileElem" class="btn-sm">批量导入ID&nbsp;&nbsp;<i
                            class="el-icon-document"></i></label>
                </el-form-item>


                <el-form-item :label="$t('table.tbGlobalSIM.idxGlobalSIMGrpID')" prop="idxGlobalSIMGrpID">
                    <el-select v-model="temp.idxGlobalSIMGrpID" class="filter-item" placeholder="Please select" filterable remote
                               @focus="switchGlobalSIMGrp" :remote-method="remoteGlobalSIMGrpMethod" :loading="selectLoading"
                               clearable>
                        <el-option v-for="item in globalSIMGrpOptions" :key="item.value" :label="item.label"
                                   :value="item.value"/>
                    </el-select>
                </el-form-item>

                <el-form-item :label="$t('table.tbGlobalSIM.idxViFiID')" prop="idxViFiID">
                    <el-select v-model="temp.idxViFiID" class="filter-item" placeholder="Please select" filterable remote
                               @focus="switchVifi" :remote-method="remoteVifiMethod" :loading="selectLoading"
                               clearable>
                        <el-option v-for="item in vifiOptions" :key="item.value" :label="item.label"
                                   :value="item.value"/>
                    </el-select>
                </el-form-item>

                <el-form-item :label="$t('table.tbGlobalSIM.status')" prop="status">
                    <el-select v-model="temp.status" class="filter-item" clearable>
                        <el-option v-for="item in statusOptions" :key="item.key" :label="item.name"
                                   :value="item.key"/>
                    </el-select>
                </el-form-item>

                <el-form-item :label="$t('table.tbGlobalSIM.pinValue')" prop="pinValue">
                    <el-input clearable v-model="temp.pinValue"/>
                </el-form-item>

                <el-form-item :label="$t('table.tbGlobalSIM.remarks')" prop="remarks">
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
    import {fetch, create, update, remove} from '@/api/globalSim'
    import {vifiS2,globalSIMGrpS2} from '@/api/select'
    import {parseTime} from '@/utils'
    import {iccidFM, trafficFormat, toDecimals} from '@/filters/index'
    import {_getValidateRules} from '@/utils/rules'
    import {
        tableSortDown, tableSortUp, handleDelete, updateData, renderHeadSort, createData,handleCreate,countIds,
        handleUpdate, getList, selectionChange, selectionAll, areaFM, formatArea, debounce,computedFmt,remoteQuery,remoteInitQuery
    } from '@/utils/tableCustom'

    const statusOptions=[
        {key:0,name:'正常',style:'primary'},
        {key:1,name:'禁用',style:'danger'}
    ]
    const pinResultOptions=[
        {key:0,name:'未设置pin码'},
        {key:1,name:'pin码设置成功'}
    ]

    const statusKeyValue = statusOptions.reduce((acc, cur) => {
        acc[cur.key] = cur.name
        return acc
    }, {})

    const statusKeyStyle = statusOptions.reduce((acc, cur) => {
        acc[cur.key] = cur.style
        return acc
    }, {})

    const pinResultKeyValue = pinResultOptions.reduce((acc, cur) => {
        acc[cur.key] = cur.name
        return acc
    }, {})

    export default {
        name: 'globalSimTable',
        components: {Sticky,simpleTableTemplate,operationsTemplate},
        data() {
            return {
                prefix:'table.tbGlobalSIM.',
                tableKey: 'keyGlobalSIMID',
                tableList: [
                    {name: 'keyGlobalSIMID', width: {length: 180},show: true,vali:{required:true,zh:false,repeatCheck:true}},
                    {name: 'idxGlobalSIMGrpID',expand:true, width: {length: 180},vali:{required:true}},
                    {name: 'idxViFiID',show:true,width:{length:180}},
                    {name: 'status', width: {length: 140},show: true,type:'tag',tagData:statusKeyStyle,format:{comData:statusKeyValue},vali:{required:true}},
                    {name: 'netData',show:true,width:{length:130},vali:{required:true},format:{radio:1000,decimals:3}},
                    {name:"pinValue",width: {length: 160},show:true},
                    {name:"pinResult",show:true,width: {length: 200},format:{comData:pinResultKeyValue} },
                    {name: 'remarks',show:true, width: {length: 140,min:true},vali:{strLen:[0,128]}},
                    {name: 'mdfTm',  expand: true,width: {length: 180},type:'date'},
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
                statusOptions:statusOptions,
                pinResultOptions:pinResultOptions,
                vifiOptions: [],
                vifiInitOptions: [],
                globalSIMGrpOptions: [],
                globalSIMGrpInitOptions: [],
                editDisable: false,
                deleteDisable: true,
                checkedRows: [],
                temp: {
                    keyGlobalSIMID:undefined,
                    idxGlobalSIMGrpID:undefined,
                    idxViFiID:undefined,
                    status:undefined,
                    pinValue:undefined,
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
                keyCount:''
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
            remoteInitQuery.call(this, vifiS2, "vifi")
            remoteInitQuery.call(this, globalSIMGrpS2, "globalSIMGrp")
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
            'temp.keyGlobalSIMID': {
                handler(curVal, oldVal){
                    //计数
                    if(curVal){
                        let count=countIds(curVal)
                        if(count){
                            this.keyCount='共'+count+'项'
                        }else {
                            this.keyCount=''
                        }
                    }
                },
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
            resetTemp() {
                this.temp = {
                    keyGlobalSIMID:undefined,
                    idxGlobalSIMGrpID:undefined,
                    idxViFiID:undefined,
                    status:undefined,
                    pinValue:undefined,
                    remarks: undefined
                }
                this.keyCount=''
            },
            handleCreate() {
                handleCreate.call(this)
            },
            createData() {
                createData.call(this,create)
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
                updateData.call(this, update)
            },
            renderSort(h, {column, $index}, index, name) {
                return renderHeadSort.call(this, h, {column, $index}, index, name)
            },
            handleDelete() {
                handleDelete.call(this, remove)
            },
            remoteVifiMethod(query){
                remoteInitQuery.call(this, vifiS2,query, "vifi")
            },
            switchVifi(){
                this.vifiOptions = this.vifiInitOptions
            },
            remoteGlobalSIMGrpS2Method(query){
                remoteInitQuery.call(this, globalSIMGrpS2,query, "globalSIMGrp")
            },
            switchGlobalSIMGrpS2(){
                this.globalSIMGrpS2Options = this.globalSIMGrpS2InitOptions
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
            },
            handleFiles() {
                let input = document.getElementById("keyGlobalSIMID-fileElem"), files = input.files, _this = this
                if (files.length) {
                    var reader = new FileReader();  // readAsText,readAsBinaryString
                    reader.onload = function () {
                        let txt = this.result.trim(), lines = txt.split("\n"), result = ""
                        //方案2：
                        if (lines.length > 0) {
                            for (var j = 0, len = lines.length; j < len; j++) {
                                result += "," + lines[j].trim();
                            }
                            _this.temp.keyGlobalSIMID = (_this.temp.keyGlobalSIMID ? _this.temp.keyGlobalSIMID : "") + result
                        }
                        //重置change事件
                        input.value = '';
                    };
                    reader.readAsText(files[0], "utf-8");
                }
            }
        }
    }
</script>
<style>
    .demo-table-expand label{
        width: 120px;
    }

</style>